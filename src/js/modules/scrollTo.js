
const trackScroll = (scrollTo) => {

    let windowWidth = document.documentElement.clientWidth,
        windowHeight = document.documentElement.clientHeight;

    if(windowHeight < 950 && windowWidth < 1200){
        if(windowHeight < 665){
            scrollTo = 665 - windowHeight + scrollTo;
        }
        window.scrollTo({
            top: scrollTo,
            behavior: "smooth"
        });
    }
    
};
export default trackScroll;