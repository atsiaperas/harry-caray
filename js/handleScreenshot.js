/* 
	________________________________________________________________________

		functions for handling screenshot and image share/save functionality  
	________________________________________________________________________
*/ 



// turns all elements in our screenshot container into one image, then passes that image to the web share function
export function createFinalImage() {
    const screenshotContainer =  document.getElementById("screenshot-container") 

    html2canvas(screenshotContainer).then(canvas => {

        try {
            let finalScreenshot = canvas.toDataURL('image/jpeg', 1);

            // share image
            // shareScreenshot(finalScreenshot) - As of 3/8/2022, the web share API fails on IOS 15. Use manualSaveFallback() until a fix from apple is released

			      manualSaveFallback(finalScreenshot)
        }
        catch (e) {
            console.log("Screenshot failed: " + e);
        }

    });
}



// if web share API is not supported
function manualSaveFallback(photo) {

    // hide share button
    const shareButton =  document.getElementById("share-button") 
    shareButton.style.display = "none"

    // Show manual photo save screen and add screenshot 
    const saveFallbackContainer =  document.getElementById("save-fallback--container") 
    const saveFallbackPhoto =  document.getElementById("save-fallback--photo") 
    saveFallbackContainer.style.display = "flex"
    saveFallbackPhoto.src = photo

    // hide web share screenshot preview 
    const screenshotContainer =  document.getElementById("screenshot-container") 
    const screenshotExit =  document.getElementById("exit-screenshot--container") 
    screenshotContainer.style.display = "none"
    screenshotExit.style.display = "none"
}



// share/save image via web share API
/* 

	As of 3/8/2022, the web share API fails on IOS 15. Use manualSaveFallback() until a fix from apple is released

*/
async function shareScreenshot(finalScreenshot) { 
    const blob = await (await fetch(finalScreenshot)).blob();

    const filesArray = [
      new File(
        [blob],
        `harry-caray${Date.now()}.jpg`,
        {
          type: blob.type,
          lastModified: new Date().getTime()
        }
      )
    ];

    const shareData = {
      files: filesArray,
    };

    if (navigator.canShare && navigator.canShare({ files: filesArray })) {

        navigator.share(shareData)
        .then(() => console.log('Share was successful.'))
        .catch((error) => alert('Sharing failed', error));

    } else {
        console.log(`Your system doesn't support sharing files.`);

        // if web share API is not supported
        manualSaveFallback(finalScreenshot)
    }
}



// show screenshot effect
export function screenshotFlash() {

	const screenshotFlash = document.querySelector('#screenshot-flash');
	screenshotFlash.style.display = "block";
	screenshotFlash.classList.add("screenshot-flash-animation")

	setTimeout(() => {
		screenshotFlash.classList.remove("screenshot-flash-animation")
		screenshotFlash.style.display = "none";
	}, 750)

}


  
// Toggles between camera and download buttons - TOGGLE FOR WEB SHARE FEATURE 
// export function updateButtonState() {

//     // const shareButton = document.getElementById('download-button');
//     const screenshotButton = document.getElementById('screenshot-button');
//     const filterButtonFace = document.querySelector('#updatedFaceFilter--face');
//     const filterButtonGlasses = document.querySelector('#updatedFaceFilter--glasses');
//     const exitScreenshot = document.querySelector('#exit-screenshot--container');
// 	const shareButton = document.querySelector('#share-button');

  
//     if (shareButton.style.display == "none") {

//       // show download button
//       shareButton.style.display = "block";
//       screenshotButton.style.display = "none";

//       // hide filter selection buttons
//       filterButtonFace.style.display = "none";
//       filterButtonGlasses.style.display = "none";

//       // show exit screenshot preview button
//       exitScreenshot.style.display = "flex";
  
//     } else {

//       // show screenshot button
//       shareButton.style.display = "none";
//       screenshotButton.style.display = "block";

//       // show filter selection buttons
//       filterButtonFace.style.display = "block";
//       filterButtonGlasses.style.display = "block";

//       // hide exit screenshot preview button
//       exitScreenshot.style.display = "none";

//     }
// }

export function updateButtonState() {
	const buttonContainer = document.querySelector('.screenshot-button--container'); 
	const exitButtonContainer = document.querySelector('.exit-screenshot--container'); 

	if (buttonContainer.style.display == 'flex') {

		// hide filter/capture buttons
		buttonContainer.style.display = 'none'

		// show exit button 
		exitButtonContainer.style.display = 'flex'

	} else {

    // show filter/capture buttons
		buttonContainer.style.display = 'flex'

		// hide exit button 
		exitButtonContainer.style.display = 'none'

	}
}