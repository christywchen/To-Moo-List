const carousel = document.querySelector(".carousel");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const slides = document.querySelectorAll(".slide");
const pageIcons = document.querySelectorAll(".page-icon");
const numberOfSlides = slides.length;
let slideNumber = 0;
const bgColor = ["#075CBE", "#368EF2", "#6945A6", "#5FBC4D"];

//image slider next button
nextBtn.addEventListener("click", () => {
  slides.forEach((slide) => {
    slide.classList.remove("active");
    //element.classList:return a collection of class attributes of the element.
  });
  pageIcons.forEach((slideIcon) => {
    slideIcon.classList.remove("active");
  });
  // from line 12 to line 18 means remove the transition between slides
  // and pageIcons
  slideNumber++;

  if (slideNumber > (numberOfSlides - 1)) {
    slideNumber = 0;
  }

  document.getElementsByClassName("navbar-container")[0].style.backgroundColor = bgColor[slideNumber];
  // console.log(document.getElementsByClassName("navbar-container")[0])
  document.getElementsByClassName("header-content")[0].style.background = bgColor[slideNumber];
  document.getElementsByClassName("carousel")[0].style.background = bgColor[slideNumber];
  slides[slideNumber].classList.add("active");
  pageIcons[slideNumber].classList.add("active");
  //line 31 to line 32 add the "active" attribute for specific slide and pageIcon
});

//image slider previous button
prevBtn.addEventListener("click", () => {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  pageIcons.forEach((slideIcon) => {
    slideIcon.classList.remove("active");
  });

  slideNumber--;

  if (slideNumber < 0) {
    slideNumber = numberOfSlides - 1;
  }

  document.getElementsByClassName("navbar-container")[0].style.background = bgColor[slideNumber];
  document.getElementsByClassName("header-content")[0].style.background = bgColor[slideNumber];
  document.getElementsByClassName("carousel")[0].style.background = bgColor[slideNumber];
  slides[slideNumber].classList.add("active");
  pageIcons[slideNumber].classList.add("active");
});

//image slider autoplay
let playSlider;

const repeater = () => {
  playSlider = setInterval(function() {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    pageIcons.forEach((slideIcon) => {
      slideIcon.classList.remove("active");
    });

    slideNumber++;

    if (slideNumber > (numberOfSlides - 1)) {
      slideNumber = 0;
    }

    document.getElementsByClassName("navbar-container")[0].style.background = bgColor[slideNumber];
    document.getElementsByClassName("header-content")[0].style.background = bgColor[slideNumber];
    document.getElementsByClassName("carousel")[0].style.background = bgColor[slideNumber];
    slides[slideNumber].classList.add("active");
    pageIcons[slideNumber].classList.add("active");
  }, 4000);
}
repeater();

//stop the image slider autoplay on mouseover
carousel.addEventListener("mouseover", () => {
  //The mouseover event is fired at an Element when a pointing device (such as a mouse or 
  //trackpad) is used to move the cursor onto the element or one of its child elements.
  clearInterval(playSlider);
  //The global clearInterval() method cancels a timed, repeating action which was previously 
  //established by a call to setInterval().
});

//start the image slider autoplay again on mouseout
carousel.addEventListener("mouseout", () => {
  repeater();
});
