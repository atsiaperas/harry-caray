/* 
	________________________________________________________________________

		functions for handling page content updates  
	________________________________________________________________________
*/ 



// hide landing page
export function hideLandingPage() {
    const landingPage = document.getElementById("landing-screen")
    landingPage.classList.add('landing-transition')

    setTimeout(() => {
        landingPage.style.display = "none"

        // show banner tutorial
        showSwipeTutorial()
    }, 1990)
}



// show loading animation while deepAR starts up
export function showLoading() {
    const loadingAnimation = document.getElementById("loading-animation--landing")
    const launchButton = document.getElementById("launch-button")

    loadingAnimation.style.display = 'inline-block'
    launchButton.style.display = 'none'
}



// show banner swiper tutorial
function showSwipeTutorial() {
    const tutorialScreen = document.querySelector('#tutorial-container');
    const tutorialCTA = document.querySelector('#tutorial-CTA');
    const bannerSwiper = document.querySelector('.swiper');
  
    // fade in swipe tutorial
    tutorialScreen.classList.add("fade-in");
    tutorialScreen.style.display = "flex";

    // fade in banner slider
    bannerSwiper.classList.add("fade-in");
    bannerSwiper.style.display = "block";
  
    tutorialCTA.innerHTML = "Swipe to change banners"
  
    if (window.innerWidth > window.innerHeight) {

        // if in desktop - use click events
        document.body.addEventListener('click', function(event) {
            // user swipes to add a banner image so hide tutorial content
            tutorialScreen.classList.add("fade-out");
            tutorialScreen.style.display = "none";

            // remove animation classes from banner slider
            bannerSwiper.classList.remove("fade-in");
            bannerSwiper.classList.remove("swiper-hint");
        
        }, false);

    } else {

        // else - use touch events
        document.body.addEventListener('touchend', function(event) {
            // user swipes to add a banner image so hide tutorial content
            tutorialScreen.classList.add("fade-out");
            tutorialScreen.style.display = "none";

            // remove animation classes from banner slider
            bannerSwiper.classList.remove("fade-in");
            bannerSwiper.classList.remove("swiper-hint");

        }, false);

    }
}