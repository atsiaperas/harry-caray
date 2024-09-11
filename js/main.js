import { updateButtonState, screenshotFlash, createFinalImage } from "./handleScreenshot.js";
import { hideLandingPage, showLoading } from "./handleViewUpdates.js";

var canvasHeight = window.innerHeight;
var canvasWidth = window.innerWidth;

var deepAR;

let initialPageLoad = true

const glassesEffect = './assets/effects/HC-glasses-013'
const faceEffect = './assets/effects/HC-face-01'

var showTutorialTimer
var prevInterval
const faceTrackingTutorial = document.getElementById('tutorial-container--face-tracking')


// get the viewport height and multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);


/* 
    __________________________

    DeepAR Main - Start
    __________________________
*/
    function startDeepAR() {
        // Initialize the DeepAR object
        deepAR = DeepAR({
            licenseKey: 'a35105758a4e60b7a3c8e044bc680fb7ffd74585b999a01c87f7b753d05b371c63ec7ee3e50461d4',
            canvasWidth: canvasWidth, 
            canvasHeight: canvasHeight,
            canvas: document.getElementById('deepar-canvas'),
            libPath: '../lib',
            onInitialize: function() {
                // start video immediately after the initalization, mirror = true
                deepAR.startVideo(true);
                // load the aviators effect on the first face into slot 'slot'
                deepAR.switchEffect(0, 'slot', glassesEffect, function() {
                    // effect loaded
                });
            },

            onScreenshotTaken: function(photo) { 
                
                console.log(showTutorialTimer)

                // hide face tracking tutorial if it is being displayed
                if (showTutorialTimer) {
                    clearInterval(showTutorialTimer)
                    faceTrackingTutorial.style.display = 'none'
                }

                // show animation
                screenshotFlash()

                // hide banner slider
                const bannerSwiper = document.querySelector('.swiper');
                bannerSwiper.style.display = 'none'

                // get active banner image and banner display for screenshot
                const activeBannerSlide = document.querySelector('.swiper-slide-active');
                const activeBannerDisplay = document.querySelector('#active-banner-image');

                activeBannerDisplay.style.display = "block"
                let activeBannerImage = activeBannerSlide.firstElementChild.src;

                // set active banner image so it can be saved as one image
                activeBannerDisplay.src = activeBannerImage

                // get deepCanvasImage element
                const deepCanvasImage = document.getElementById("deepCanvasImage") 

                // set our screenshot image as the src for our deepCanvasImage
                deepCanvasImage.src = photo;

                // stop deepAR
                this.shutdown()

                // hide deepAR canvas
                const deepARCanvas =  document.getElementById("deepar-canvas") 
                deepARCanvas.style.display = 'none'

                // toggle download button
                updateButtonState();

                createFinalImage()

            },

            onFaceVisibilityChanged: function(visible) {
                

                if (visible) {
                    
                    faceTrackingTutorial.style.display = 'none'

                    // clear previous interval if face was found during count down
                    clearInterval(prevInterval)

                } else {

                    let count = 0

                    // count every second that a face is not visible 
                    showTutorialTimer = setInterval(() => {

                        count++
                        console.log(count)

                        // if 2 seconds without a face detected
                        if (count > 1) {

                            // prompt user to better position face
                            faceTrackingTutorial.style.display = 'flex'

                            // clear interval for next check
                            clearInterval(showTutorialTimer)
                        }

                    }, 1000)

                    // save reference to previous interval
                    prevInterval = showTutorialTimer
                    
                }  

            }
        });

        // download the face tracking model
        deepAR.downloadFaceTrackingModel('./models/models-68-extreme.bin');

        deepAR.onCameraPermissionDenied = function() {
            alert('Harry Caray AR needs permission to access your camera in order to work - please update your privacy settings')
        };

        deepAR.onVideoStarted = function() {
            if (initialPageLoad) {
                // hide landing page
                hideLandingPage()

                // set initialPageLoad flag to false so hideLandingPage() won't run every time we restart deepAR
                initialPageLoad = false
            }

            // disable secondary loading screen
            const secondaryLoadingScreen = document.getElementById("secondary-loading-screen")

            if (secondaryLoadingScreen.style.display == 'flex') {
                secondaryLoadingScreen.classList.remove("fade-in")
                secondaryLoadingScreen.classList.add("fade-out")

                setTimeout(() => {
                    secondaryLoadingScreen.style.display = 'none'
                }, 990)
            }
        }
    }
/* 
    __________________________

    DeepAR Main - End
    __________________________
*/




/* 
    __________________________

    Face filter effects - Start
    __________________________
*/
    function addGlasses() {
        deepAR.switchEffect(0, 'slot', glassesEffect);
    }

    function addFace() {
        deepAR.switchEffect(0, 'slot', faceEffect);
    }
/* 
    __________________________

    Face filter effects - End
    __________________________
*/




/* 
    __________________________

    Click event listeners - Start
    __________________________
*/
    // start face tracking 
    document.getElementById("launch-button").addEventListener("click", function() {
        showLoading()
        startDeepAR()
    });

    // take screenshot
    document.getElementById("screenshot-button").addEventListener("click", function() {
        deepAR.takeScreenshot()
    });

    // share screenshot 
    document.getElementById("share-button").addEventListener("click", function() {
        createFinalImage()
    });

    // exit out of screenshot preview
    document.getElementById("exit-screenshot-button").addEventListener("click", function() {

        // show banner slider
        const bannerSwiper = document.querySelector('.swiper');
        bannerSwiper.style.display = 'block'

        // remove previous banner image
        const activeBannerDisplay = document.querySelector('#active-banner-image');
        activeBannerDisplay.src = ""
        activeBannerDisplay.style.display = "none"

        // --------------------------------------------------

        // remove screenshot preview from DOM
        const deepCanvasImage = document.getElementById("deepCanvasImage")
        deepCanvasImage.src = ""

        // show face filter canvas again
        const deepARCanvas =  document.getElementById("deepar-canvas") 
        deepARCanvas.style.display = 'block'

        // show loading screen while deepAR starts
        const secondaryLoadingScreen = document.getElementById("secondary-loading-screen") 
        secondaryLoadingScreen.style.display = 'flex'
        secondaryLoadingScreen.classList.add("fade-in")

        // call deepAR
        startDeepAR()

        // toggle back to screenshot button
        updateButtonState()

    });

    // exit out of fallback preview
    document.getElementById("exit-save-fallback--button").addEventListener("click", function() {

        // hide manual save screen and remove previous screenshot 
        const saveFallbackContainer =  document.getElementById("save-fallback--container") 
        const saveFallbackPhoto =  document.getElementById("save-fallback--photo") 
        saveFallbackContainer.style.display = "none"
        saveFallbackPhoto.src = ""

        // show screenshot container
        const screenshotContainer =  document.getElementById("screenshot-container") 
        screenshotContainer.style.display = "block"

        // remove previous banner image
        const activeBannerDisplay = document.querySelector('#active-banner-image');
        activeBannerDisplay.src = ""
        activeBannerDisplay.style.display = "none"

        // show banner slider
        const bannerSwiper = document.querySelector('.swiper');    
        bannerSwiper.style.display = "block";

        // remove screenshot preview from DOM
        const deepCanvasImage = document.getElementById("deepCanvasImage")
        deepCanvasImage.src = ""

        // show face filter canvas again
        const deepARCanvas =  document.getElementById("deepar-canvas") 
        deepARCanvas.style.display = 'block'

        // show loading screen while deepAR starts
        const secondaryLoadingScreen = document.getElementById("secondary-loading-screen") 
        secondaryLoadingScreen.style.display = 'flex'
        secondaryLoadingScreen.classList.add("fade-in")

        // toggle back to screenshot button
        updateButtonState()

        // call deepAR
        startDeepAR()

    });

    // apply glasses effect
    document.getElementById("updatedFaceFilter--glasses").addEventListener("click", function() {
        addGlasses()
    });

    // apply face effect
    document.getElementById("updatedFaceFilter--face").addEventListener("click", function() {
        addFace()
    });
/* 
    __________________________

    Click event listeners - End
    __________________________
*/