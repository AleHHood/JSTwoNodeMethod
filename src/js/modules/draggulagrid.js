/* https://github.com/bevacqua/react-dragula импортируем готовое 
решение для drag and drop  */
import dragula from 'dragula';
import getscheme from './getScheme';
import getCalculation from './calculationMethod';

const dragggrid = () => {

    const blockBar = document.querySelector('.calculation__blockBar'),
        blockHome = document.querySelectorAll('.calculation__block'),
        container = document.querySelector('.calculation__container'),
        containerBottom = document.querySelector('.container__bottom'),
        calcBlocksettings = document.querySelector('.calculation__blocksettings'),
        blockSettings = document.querySelector('.blocksettings__container'),
        cell = document.querySelectorAll('.grid__cell'),
        wrapperFormN = document.querySelector('.blocksettings__wrapper-N'),
        wrapperFormKnots = document.querySelector('.blocksettings__wrapper-Knots'),
        wrapperFormR = document.querySelector('.blocksettings__wrapper-R'),
        wrapperFormE = document.querySelector('.blocksettings__wrapper-E'),
        inputFormR = document.querySelector('#rblock'),
        inputFormE = document.querySelector('#eblock'),
        inputFormN = document.querySelector('#nblock'),
        notifyR = document.querySelector('#notifyR'),
        notifyE = document.querySelector('#notifyE'),
        notifyN = document.querySelector('#notifyN'),
        blocks = []; // массив блоков
    let copyDrakeContainers = [],
        numId = 10,
        scheme = 0;
    const formSettings = document.querySelector('.calculation__settings'),
        ActiveBlocks = []; //массив блоков в рабочей зоне



    //Класс для создание перетаскиваемых блоков (резисторы, эдс, ветви, узлы)  
    class Block {
        constructor(
            rotate = 0, type, voltage = 0, resistance = 0, cell,
            id, element, number, error, x, y
        ) {
            this.rotate = rotate; // 0 - горизонтальное пол. 1 - вертикальное
            this.type = type; // 0=R, 1=E, 2=B, 3=K, 4=Corner;
            this.voltage = voltage;
            this.resistance = resistance;
            this.cell = cell; //ячейка сетки в котором находится блок
            this.id = id;
            this.element = element;
            this.number = number; //номер элемента (присваевается пользователем)
            this.error = error; //Запись ошибки при некорректном заполнении юзером
            this.x = x; //координат по х (номер столбца ячейки)
            this.y = y; //координатат по y(номер строки ячейки)
        }

        render(classesBlock) {
            const newBlock = document.createElement('div');
            newBlock.classList.add('calculation__block');

            newBlock.classList.add(classesBlock);
            newBlock.setAttribute('id', numId);

            if (classesBlock == 'calculation__block-R') {
                this.type = 0;
            }
            if (classesBlock == 'calculation__block-E') {
                this.type = 1;
            }
            if (classesBlock == 'calculation__block-B') {
                this.type = 2;
            }
            if (classesBlock == 'calculation__block-K') {
                this.type = 3;
            }
            if (classesBlock == 'calculation__block-Corner') {
                this.type = 4;
            }

            this.element = newBlock;
            this.id = numId;
            numId = numId + 1;
            blockBar.append(newBlock);
        }

        //Содержимое окна параметров блока (зависит от типа элемента)
        getParametrForm() {
            switch (this.type) {
                case 0:
                    wrapperFormN.style.display = 'block';
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormR.style.display = 'block';
                    wrapperFormE.style.display = 'none';
                    inputFormR.value = this.resistance;
                    break;
                case 1:
                    wrapperFormN.style.display = 'block';
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormE.style.display = 'block';
                    wrapperFormR.style.display = 'none';
                    inputFormE.value = this.voltage;
                    break;
                case 3:
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormN.style.display = 'none';
                    wrapperFormE.style.display = 'none';
                    wrapperFormR.style.display = 'none';
                    inputFormE.value = this.voltage;
                    break;
                default:
                    wrapperFormN.style.display = 'none';
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormE.style.display = 'none';
                    wrapperFormR.style.display = 'none';
                    break;
            }
            inputFormN.removeAttribute('data-form');
            inputFormN.setAttribute('data-form', this.id);
            inputFormN.value = this.number;
        }
        getErrorMessage() {
            let tNotify = 0;
            notifyN.style.display = 'none';

            switch (this.type) {
                case 0:
                    tNotify = notifyR;
                    tNotify.style.display = 'none';
                    break;
                case 1:
                    tNotify = notifyE;
                    tNotify.style.display = 'none';
                    break;
            }
            switch (this.error) {
                case 'error':
                    tNotify.style.display = 'block';
                    tNotify.textContent =
                        `Введите значение от 0 до 1000`;

                    this.element.style.backgroundColor =
                        'pink';
                    break;

                case 'errorNumber':
                    notifyN.style.display = 'block';
                    notifyN.textContent =
                        `Введите значение от 0 до 1000`;

                    this.element.style.backgroundColor =
                        'pink';
                    break;

                case 'number':
                    notifyN.style.display = 'block';
                    notifyN.textContent =
                        `Номера элементов совпадают`;

                    this.element.style.backgroundColor =
                        'pink';
                    break;

                case 'connection': {
                    this.element.style.backgroundColor = 'pink';
                    break;
                }

                default:
                    break;
            }

        }
        Validation(InputForm, el) {
            if (
                ((InputForm.value >= 1000) || (InputForm.value <= 0)) &&
                (InputForm !== inputFormN)
            ) {
                this.error = 'error';
                this.getErrorMessage();
            } else {
                if ((InputForm.value < 0) || (InputForm.value >= 1000)) {
                    this.error = 'errorNumber';
                    this.getErrorMessage();
                    this.number = inputFormN.value;
                } else {
                    el.style.display = 'none';
                    this.number = inputFormN.value;
                    this.error = '';
                    this.element.style.backgroundColor = '#fff';
                }
            }
        }
    }

    //-----------------Добавляем блоки из блокБар в blocks------------//

    blockHome.forEach((element, i) => {
        blocks[i] = new Block();
        blocks[i].rotate = 0;
        blocks[i].voltage = 0;
        blocks[i].resistance = 0;
        blocks[i].type = +element.id;
        blocks[i].id = element.id;
        blocks[i].element = element;
    });


    //-----------------Добавляем перетаскивание для блоков------------//

    const drake = dragula([blockBar, ...cell], {
        accepts: function (el, target) {
            return target !== blockBar;
        },
        mirrorContainer: container,
    });

    // Копируем массив всех div в которые можно перетаскивать блоки
    copyDrakeContainers = drake.containers.filter((element) => element)

    //Ограничиваем перетаскивание блоков в уже занятые ячейки
    function LimitingByDragging(event) {
        const target = event.target;

        if (target && target.classList.contains('calculation__block')) {
            blocks.forEach(element => {
                element.element.classList.remove('active');
            });
            //Вызываем окно настроек блока
            getForm(target);
            //Сбрасываем перетаскивание div до изначальных настроек
            drake.containers = [];
            copyDrakeContainers.forEach(element => {
                drake.containers.push(element);
            });

            //Перебираем все ячейки сетки, разрешаем перетаскиваение только в
            //пустые ячейки или в текущую
            cell.forEach((element, i) => {
                if (
                    element.firstChild &&
                    (element.firstChild != event.target)
                ) {
                    i = i + 1;
                    drake.containers.splice(i, 1, 0);
                    i = i - 1;
                }
            });
        }
    }

    //------------Закрываем окно настроек---------------//

    function closeBlockSettings() {
        blockSettings.classList.remove('blocksettings-show');

        setTimeout(() =>
            calcBlocksettings.classList.remove('calculation-show'),
            301);

        blocks.forEach(element => {
            element.element.classList.remove('active');
        });
    }

    containerBottom.addEventListener('click', function () {
        closeBlockSettings();
    });



    //----Создаём новый блок--------//
    function GetNewBlock(event) {

        const target = event.target;
        let startDragg = false;

        if (target.className.indexOf('calculation__block calculation__block') >= 0) {
            const numBlockBar = blockBar.children.length,
                className = target.className.split(' ')[1];

            const anim = () => {
                if (!target.classList.contains("gu-transit") && startDragg) {
                    startDragg = true;
                } else if (target.classList.contains("gu-transit")) {
                    startDragg = true;
                    addOrRemoveBlockInBlockbar(numBlockBar, className);
                    window.requestAnimationFrame(anim);
                } else {
                    window.requestAnimationFrame(anim);
                }
            }
            window.requestAnimationFrame(anim);

            function addOrRemoveBlockInBlockbar(numBlockBar, className) {
                //Если кол. изначальных блоков в blockBar меньше чем 
                //до начала перетаскивания (перятянули один блок в ячейки)
                // - добавляем новый блок
                if (numBlockBar > blockBar.children.length) {
                    blocks[numId] = new Block();
                    blocks[numId].render(className);
                    //Если кол. изначальных блоков в blockBar больше чем 
                    //до начала перетаскивания (вернули один блок в blockBar)
                    // - удаляем последний блок
                } else if (numBlockBar < blockBar.children.length) {
                    blockBar.lastChild.remove();
                }
            }
        }
    }

    //Forms

    function getForm(target) {
        if (target && target.classList.contains('calculation__block')) {
            blocks.forEach((elem, i) => {
                if (elem.element == target) {
                    elem.getParametrForm();
                    elem.getErrorMessage();
                }
            });
            blockSettings.classList.add('blocksettings-show');
            calcBlocksettings.classList.add('calculation-show');
            blockSettings.scrollTo(0, 0);
            target.classList.add('active');
        }
    }

    //----------------Получаем данные из окна настроек-------------//
    //для сопостовления инпута и элемента используем Id
    function getValueFromForm() {
        blockSettings.addEventListener('input', (event) => {
            const target = event.target;
            if (target && target.id == inputFormR.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if (elem.id == dataForm) {
                        elem.resistance = inputFormR.value;
                        elem.Validation(inputFormR, notifyR);
                    }
                });
            }
            if (target && target.id == inputFormE.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if (elem.id == dataForm) {
                        elem.voltage = inputFormE.value;
                        elem.Validation(inputFormE, notifyE);
                    }
                });
            }

            if (target && target.id == inputFormN.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if (elem.id == dataForm) {
                        elem.Validation(inputFormN, notifyN);
                        switch (elem.type) {
                            case 0:
                                elem.element.textContent =
                                    `R${elem.number}`;
                                break;

                            case 1:
                                elem.element.textContent =
                                    `E${elem.number}`;
                                break;
                        }
                    }
                });
            }
        });
    }

    //-------------Удаление или вращение блока через кнопки в окне настроек--------//
    function GetRemoveOrRotateBlock() {

        blockSettings.addEventListener('click', (event) => {

            const target = event.target;
            if (
                target &&
                target.classList.contains('btn__remove')
            ) {
                blocks.forEach(element => {
                    if (element.element.classList.contains('active')) {
                        element.element.remove();
                        blockSettings.classList.remove('blocksettings-show');

                        setTimeout(() =>
                            calcBlocksettings.classList.remove('calculation-show'),
                            301);
                    }
                });
            }
            if (target && target.classList.contains('btn__rotate')) {
                blocks.forEach(element => {
                    if (element.element.classList.contains('active')) {
                        if (element.type == 0) {
                            if (element.rotate == 0) {
                                element.element.classList.add('rotate-0');
                                element.rotate = 1;
                            } else {
                                element.element.classList.remove('rotate-0');
                                element.rotate = 0;
                            }
                        } else {
                            switch (element.rotate) {
                                case 0:
                                    element.element.classList.add(
                                        `rotate-${element.type}`
                                    );
                                    element.rotate = 1;
                                    break;
                                case 1:
                                    element.element.classList.add(
                                        `rotate-${element.type}-180`
                                    );
                                    element.element.classList.remove(
                                        `rotate-${element.type}`
                                    );
                                    element.rotate = 2;
                                    break;
                                case 2:
                                    element.element.classList.add(
                                        `rotate-${element.type}-270`
                                    );
                                    element.element.classList.remove(
                                        `rotate-${element.type}-180`
                                    );
                                    element.rotate = 3;
                                    break;
                                case 3:
                                    element.element.classList.remove(
                                        `rotate-${element.type}-270`
                                    );
                                    element.rotate = 0;
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }

    //Перебираем все ячейки и записываем все используемые блоки в массив
    function getActiveBlocks() {
        let i = 0;
        cell.forEach((element) => {
            if (element.firstChild) {
                blocks.forEach((el) => {
                    if (element.firstChild === el.element) {
                        el.cell = element;
                        el.x = +(element.getAttribute('data-x'));
                        el.y = +(element.getAttribute('data-y'));
                        ActiveBlocks[i] = el;
                        ++i;
                    }
                });
            }
        });
    }

    //Удаляем старый ответ при необходимости пересчета
    function removeOldAnswerBlock(classBlock) {
        const removeBlock = document.querySelectorAll(classBlock);
        if (removeBlock) {
            removeBlock.forEach(element => {
                element.remove();
            });
        }
    }


    blockBar.addEventListener('mousedown', (event) => {
        GetNewBlock(event);
    });
    blockBar.addEventListener('touchstart', (event) => {
        GetNewBlock(event);
    });


    container.addEventListener('mousedown', function (event) {
        LimitingByDragging(event);

        //Если произошло нажатие на пустую ячейку, то закрываем окно параметров блока
        if (
            event.target &&
            event.target.classList.contains('grid__cell')
        ) {
            closeBlockSettings();
        }
    });

    container.addEventListener('touchstart', function (event) {
        LimitingByDragging(event);

        //Если произошло нажатие на пустую ячейку, то закрываем окно параметров блока
        if (
            event.target &&
            event.target.classList.contains('grid__cell')
        ) {
            closeBlockSettings();
        }
    });
    // Получаем данные из формы настроек
    getValueFromForm();
    GetRemoveOrRotateBlock();
    formSettings.addEventListener('click', (event) => {


        //--------Нажатие кнопки РАССЧИТАТЬ--------------------//
        event.preventDefault();
        const target = event.target;
        if (target && target.classList.contains('btn__calculate')) {

            //Удаялем старые ошибки (если они есть)
            removeOldAnswerBlock('.Error__block');

            //Удаляем старый ответ (если он есть)
            removeOldAnswerBlock('.answer__block');


            const promise1 = new Promise((resolve, reject) => {
                //Получаем активные блоки и передаём в модуль обработки getscheme
                getActiveBlocks();
                resolve(ActiveBlocks);
            }).then(value => {
                return new Promise((resolve, reject) => {
                    scheme = getscheme(ActiveBlocks);

                    if (scheme == 'error') {
                        reject();
                    } else {
                        resolve(scheme);
                    }
                });

            }).then(scheme => {

                //Удаляем старый ответ (если он есть)
                removeOldAnswerBlock('.answer__block');
                //Рассчитываем схему
                getCalculation(scheme);
                /* getCalculation( SaveScheme() ); */
            }).catch(() => {
                //Удаляем старый ответ (если он есть)
                removeOldAnswerBlock('.answer__block');
            });
        }
    });

};

export default dragggrid;