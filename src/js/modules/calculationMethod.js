import getMath from './mathExpression';
import trackScroll from './scrollTo';


const getCalculation = (branchs) => {
    console.log(branchs); ///////////////
    const answerSection = document.querySelector('.answer');

    let parameters = [],
    U = 0,
    I = [],
    textArr = [],
    answer;
    class branchElements {
        constructor(
            numberBranch, nameR, resistance, nameG, 
            conductance, nameE, voltage, ...elements
            ) {
            this.numberBranch = numberBranch;
            this.conductance = conductance;
            this.nameG = nameG;
            this.resistance = resistance;
            this.nameR = nameR;
            this.voltage = voltage;
            this.nameE = nameE;
            this.elements = elements;
        }
    }

        


    function getParametrsBranch(branchs) {
        let numberBranch = 0;

        //Перебор ветвей
        branchs.forEach((branch, i) => {
            if (i < 2){
                return;
            }

            let R = [],
            K = 0,
            E =  [],
            N = 0;

            //Перебор элементов ветви
            branch.elements.forEach(block => {

                //Правильная нумерация
                branchs[0].elements.forEach((knot, number) => {
                    if(knot.y === block.y){
                        numberBranch = number + 1;
                        Arrow(knot, numberBranch);
                    }
                });
                
                if(block.type === 0){
                    K = K + 1;
                    R[K] = block;
                }

                if(block.type === 1){
                    N = N + 1;
                    E[N] = block;
                }

            });
        
            if(numberBranch === 1){
                textArr.push(
                    `Так как действительные направления 
                    токов до расчёта цепи нам неизвестны — произвольно 
                    указываем направления токов в ветвях.`
                );
                getAnswerBlock(textArr);
                textArr = [];
            }

            GetValueResist(R, K, numberBranch);
            GetValueVoltage(E, N, numberBranch);
        });
    }


    function getAnswerBlock(textArr) {
        
        answer = document.createElement('div');
        answer.classList.add('answer__block');
        answerSection.append(answer);
        textArr.forEach(element => {
            getMath(element, answer);
        });
    }



    function GetValueResist(R, K, numberBranch){
        parameters[numberBranch] = new branchElements(numberBranch);

        if(K < 2){

            parameters[numberBranch].nameG = `g${R[K].number}`;
            parameters[numberBranch].conductance = 1 / +R[K].resistance;
            parameters[numberBranch].nameR = `r${R[K].number}`;
            parameters[numberBranch].resistance = +R[K].resistance;

            let resistance = +R[K].resistance;
            let answer = toFixed3(1 / +R[K].resistance);
            
            textArr.push(`Найдём проводимость ветви №${numberBranch}`);
            textArr.push(`tac g${R[K].number} =~1/r${R[K].number}`);
            textArr.push(`tac g${R[K].number} =~1/${resistance}~=`+
            ` ${answer} См`);
            getAnswerBlock(textArr);
            textArr = [];




        } else {

            let Name = '',
            value = 0,
            sum = 0,
            expressionValue = '',
            expression = '';

            R.forEach(resist => {
                Name = `${Name}` + `${resist.number}`;
                expression += `+ R${resist.number} `;
                expressionValue += `+ ${resist.resistance} `;
                sum = +resist.resistance;
                value = value + sum;
                
            });

            
            expression = `${expression}`.slice(2);
            expressionValue = `${expressionValue}`.slice(2);

            parameters[numberBranch].nameR = `r${Name}`;
            parameters[numberBranch].resistance = +value;

            value = 1 / +value;

            parameters[numberBranch].nameG = `g${Name}`;
            parameters[numberBranch].conductance = +value;


            //Округляем число для вывода
            value = toFixed3(+value);
            
            
            textArr.push(`Найдём проводимость ветви №${numberBranch}`);
            textArr.push(`tac g${Name} =~1/${expression}`);
            textArr.push(`tac g${Name} =~1/${expressionValue}~= ${value} См`);
            getAnswerBlock(textArr);
            textArr = [];

        }
    }

    function GetValueVoltage(R, K, numberBranch){
        let voltage = 0;
        let Name = '';

        if(K === 0){

/*             textArr.push(`Эдс для ветви №${numberBranch}`);
            textArr.push(`0 В`);
            getAnswerBlock(textArr);
            textArr = []; */


            parameters[numberBranch].nameE = ` + 0`;
            parameters[numberBranch].voltage = 0;
            return;

        }
        if(K < 2){

            voltage = +(R[K].voltage);
            if(R[K].rotate == 2){
                voltage = -voltage;
            }
                
/*             textArr.push(`Эдс для ветви №${numberBranch}`);
            textArr.push(`E${R[K].number} = ${voltage} В`);
            getAnswerBlock(textArr);
            textArr = []; */

            Name = ` + E${R[K].number}`;
            if(R[K].rotate == 2){
                Name = ` - E${R[K].number}`;
            }

            parameters[numberBranch].nameE = `${Name}`;
            parameters[numberBranch].voltage = +voltage;

        } else {

            let value = 0,
            expressionValue = '',
            expression = '';

            Name = '';
            
            R.forEach(EDS => {
                let EDSname = ' + E',
                plus = '+';
                

                Name = `${Name}` + `${EDS.number}`;

                voltage = +EDS.voltage;
                console.log(EDS.rotate);
                if(EDS.rotate == 2){
                    voltage = -voltage;
                    EDSname = ' - E';
                    plus = '-';
                }

                expression += `${EDSname}${EDS.number} `;
                expressionValue += `${plus} ${EDS.voltage} `;

                value = value + voltage;
            });

                expression = SliceElement(`${expression}`, '+ ');
                expressionValue = SliceElement(`${expressionValue}`, '+ ');


            textArr.push(`ЭДС для ветви №${numberBranch}`);
            textArr.push(`tac E${Name} = ${expression}`);
            textArr.push(`tac E${Name} = ${expressionValue} = ${value} В`);
            getAnswerBlock(textArr);
            textArr = [];

            
            if(value < 0){  
                Name = ` - E${Name}`;
            } else{
                Name = ` + E${Name}`;
            }
            parameters[numberBranch].nameE = `${Name}`;
            parameters[numberBranch].voltage = +value;
        }
    }

    function Arrow(block, numberBranch, revers = 0){

            // Удаляем все содержимое блоков(название токов)
            while (block.element.firstChild) {
                block.element.removeChild(block.element.firstChild);
            }

            // Заново добавляем название узла
            if(numberBranch === 2){ 
                const spanText = document.createElement('span');
                spanText.classList.add('knot-text');
                spanText.textContent = `A`;
                block.element.append(spanText);
            }

            const span = document.createElement('span');
            span.classList.add('top');
            span.textContent = `I${numberBranch}`;
            block.element.prepend(span);
            if(!revers){
                block.element.style.cssText = 
                `background: url(../img/svg/Arrow.SVG) -130% -90% no-repeat;
                background-size: 97px;`;
            } else {
                console.log('revers');
                block.element.style.cssText = 
                `background: url(../img/svg/Arrow.SVG) -130% -90% no-repeat;
                background-size: 97px;`;
            }
    }



    function toFixed3(num){ 
        let x = 0;
        for (let n = 5; n >= 0; --n) {
            num = +num;
            num = num.toFixed(n);
            x = num.length;
            x = x - 1;

            //Исправляем ошибку с округлением 5
            if(n > 3){
                if(num.slice(-1) == '5'){
                    num = num.slice(0, x) + `6`;
                }
                continue;
            }

            if(num.slice(-1) == '0'){
                num = num.slice(0, x);
                if(num.slice(-1) == '0'){
                    continue;
                } else {
                    num = +num;
                    return num;
                }
            } else {
                num = +num;
                return num;
            }
        }
    }



    function SliceElement(str, element){
        if(str.substr(0, 2) == element){
            return str.slice(2);
        } else{
            console.log(str);
            return str;
        }
    } 

    

    function GetVoltageSсheme() {
        let sumEG = 0,
        sumG = 0,
        expressionEG = '',
        expressionG = '',
        a = '',
        b = '',
        plus = '+';

    parameters.forEach(element => {

        sumEG = sumEG + element.conductance * element.voltage;

        if(element.voltage < 0) { 
            plus = '';
        }else{
            plus = ' + ';
        }

        expressionEG = expressionEG + 
        `${plus} ${element.voltage}` +  
        `⋅${ toFixed3(element.conductance) }`;

        a = a + `${element.nameE}` +  `⋅${element.nameG}`;

        sumG = sumG + element.conductance;
        expressionG = expressionG + ` + ${ toFixed3(element.conductance) }`;
        b = b + ` + ${element.nameG}`;

    });

        U = sumEG / sumG;

        a = SliceElement(a, ' +');
        b = SliceElement(b, ' +');
        expressionG = SliceElement(expressionG, ' +');
        expressionEG = SliceElement(expressionEG, ' +');
        
        textArr.push(`Напряжение между узлами А-В равно:`);
        textArr.push(`tac Uab =~${a}/${b}~=~${expressionEG}/${expressionG}~= `+
        `${toFixed3(U)} В`);
        textArr.push(
        `notice ЭДС направленная к узлу A, записывается со знаком «+», 
        если в противоположную сторону, то со знаком «-».`
        );
        getAnswerBlock(textArr);
        textArr = [];
    }
    



    function FindCurrent() {
        let sumEU = 0,
        sumG = 0,
        expressionEU = '',
        expressionG = '',
        a = '',
        b = '',
        plus = '+'; 
        parameters.forEach((element, i) => {
            I[i] = (element.voltage - U) * element.conductance;
            I[i] = toFixed3(I[i]);
            
            //Меняем направление тока на схеме при отрицательных значениях
/*             if(I[i] < 0) {
                Arrow(branchs[0].elements[i-1], i, 1);
            } */

            if(U < 0) { 
                plus = ' +';
            }else{
                plus = ' -';
            }
    
            expressionEU =  `${element.voltage}` + 
            `${plus} ${Math.abs(toFixed3(U))}`;

            a = `${element.nameE}` + ` - U`;
            b = `${element.nameG}`;

            a = SliceElement(a, ' +');

        textArr.push(`Найдём ток в ветви №${i}`);
        textArr.push(`tac I${i} = ${a}⋅${b} = `+
        `(${expressionEU})⋅${toFixed3(element.conductance)} = ${I[i]} А`);
        if(I[i] < 0) {
            textArr.push(
            `notice Так как ток I${i} получился с отрицательным 
            значением - реальное направление тока в цепи, будет от узла
             A к узлу B, то есть противоположно изначально принятому.`
            );
        }
        getAnswerBlock(textArr);
        textArr = [];
        });
    }


    function getBalance(parameters){
        let sumEI = 0,
        sumRII = 0,
        expressionEI = '',
        expressionRII = '',
        a = '',
        b = '',
        plus = '+';

        textArr.push(
            `Для проверки правильности решения составим 
            <a href="https://electrikam.com/balans` +
            `-moshhnostej-v-cepi-postoyannogo-toka/">
            баланс мощностей</a>.`
        );

        parameters.forEach((element, i) => {

            
            sumEI = sumEI + element.voltage * I[i];
            sumRII = sumRII + (I[i] * I[i]) * element.resistance;
        
            
            // добавляем скобки к отрицательным токам
/*             if(I[i] < 0) { 
                I[i] = `(${I[i]})`;
            } */


            //Если напрвление токов не совпадает с направлением ЭДС
            if((element.voltage * I[i]) < 0){

                textArr.push(
                    `notice Источник ${SliceElement(element.nameE, ' -')} потребляет 
                    электрическую энергию, т.к. направление ЭДС не совпадает с 
                    направлением тока в ветвях.
                `);
                textArr.push(
                    `notice Следовательно, в баланс мощностей ЭДС 
                    ${SliceElement(element.nameE, ' -')} 
                    записывается со знаком минус.
                `);
                
                if(element.voltage > 0){
                    element.voltage = element.voltage * -1; 
                    element.nameE = SliceElement(element.nameE, ' +');
                    element.nameE = ` - ${element.nameE}`;
                }
                
            } else {      

                if(element.voltage < 0){
                    element.voltage = element.voltage * -1;
                    element.nameE = SliceElement(element.nameE, ' -');
                    element.nameE = ` + ${element.nameE}`;
                }
            }

            if(I[i] < 0) { 
                I[i] = I[i] * -1;
            }

            if(element.voltage < 0){
                plus = '';
            } else {
                plus = '+';
            }

            a = a + `${element.nameE} ⋅ I${i}`;
            expressionEI = expressionEI + 
            ` ${plus}${element.voltage} ⋅ ${I[i]}`;

            b = b + ` + I${i}<sup>2</sup> ⋅ ${element.nameR}`;
            expressionRII = expressionRII + 
            ` + ${I[i]}<sup>2</sup> ⋅ ${element.resistance}`;
        });

        a = SliceElement(a, ' +');
        b = SliceElement(b, ' +');

        expressionEI = SliceElement(expressionEI, ` +`);
        expressionRII = SliceElement(expressionRII, ' +');

        textArr.push(`tac ${a} = ${b}`);
        textArr.push(`tac ${expressionEI} = ${expressionRII}`);
        textArr.push(`tac ${toFixed3(sumEI)} Вт = ${toFixed3(sumRII)} Вт`);
        if(Math.abs(((sumEI - sumRII)/ sumEI)) < 0.03){
            textArr.push(`tac Баланс сошелся.`);
        }else{
            textArr.push(`ОШИБКА.`);
        }
        getAnswerBlock(textArr);
        textArr = [];
    }
 

    getParametrsBranch (branchs);
    GetVoltageSсheme();
    FindCurrent();
    getBalance(parameters);
    trackScroll(document.documentElement.clientHeight);



};




export default getCalculation;