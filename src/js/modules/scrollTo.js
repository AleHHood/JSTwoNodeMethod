import { mobileMAXHeight, mobileMAXWeight, blockHeight } from "./constants";

const trackScroll = (scrollTo) => {
  let windowWidth = document.documentElement.clientWidth,
    windowHeight = document.documentElement.clientHeight;

  if (windowHeight < mobileMAXHeight && windowWidth < mobileMAXWeight) {
    if (windowHeight < blockHeight) {
      scrollTo = blockHeight - windowHeight + scrollTo;
    }
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  }
};
export default trackScroll;
