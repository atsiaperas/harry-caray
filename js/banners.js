let showMenu = false;
let stickerIndex = 0;

const sticker00 = '';
const sticker01 = './assets/banners/beautiful_day.png';
const sticker02 = './assets/banners/birthday.png';
const sticker03 = './assets/banners/go_cubs.png';
const sticker04 = './assets/banners/holy_cow.png';
const sticker05 = './assets/banners/it_could_be.png';
const sticker06 = './assets/banners/ribs.png';
const sticker07 = './assets/banners/take_me_out.png';


const stickerArr = [
  sticker00,
  sticker01,
  sticker02,
  sticker03,
  sticker04,
  sticker05,
  sticker06,
  sticker07
]

function updateSticker(swipe) {

    const stickerEl = document.querySelector("#canvasSticker");

    switch(swipe) {
        case 'right':

            if (stickerIndex == stickerArr.length - 1) {
                stickerIndex = 0
            } else {
                stickerIndex++;
            }

          break;
        case 'left':

            if (stickerIndex == 0) {
                stickerIndex = stickerArr.length - 1
            } else {
                stickerIndex--;
            }

          break;
        default:
    }

    if (stickerIndex === 0) {
        // if we are on empty banner slot - make sure banner does not show
        stickerEl.src = stickerArr[stickerIndex];
        stickerEl.style.visibility = 'hidden';
    } else {
        stickerEl.src = stickerArr[stickerIndex];
        stickerEl.style.visibility = 'visible';
    }

}


// Handle Swipe detection
// ______________________
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let showingFilter = 0;

function handleGesture(touchstartX, touchstartY, touchendX, touchendY) {

    const delx = touchendX - touchstartX;
    const dely = touchendY - touchstartY;

    if (Math.abs(delx) > Math.abs(dely)) {
        if (delx > 0) {
            // swipe right
            updateSticker('right');
        }
        else {
            // swipe left
            updateSticker('left');
        }
    } else if (Math.abs(delx) < Math.abs(dely)) {
        // if (dely > 0) {
        //     // swipe down
        // } else {
        //     // swipe up
        // } 
    } else {
        // tap 
    }
	
}


const gestureZone = document.getElementById('screenshot-container'); 
// const gestureZone = document.getElementById('deepar-canvas');

if (window.innerWidth > window.innerHeight) {

    gestureZone.addEventListener('click', function(event) {
        updateSticker('right') 
    }, false);

} else {

    // else - use touch events
    gestureZone.addEventListener('touchstart', function(event) {

        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    
    }, false);
    
    gestureZone.addEventListener('touchend', function(event) {
    
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
    
        handleGesture(touchstartX, touchstartY, touchendX, touchendY)
    
    }, false); 

}


// toggles between calling the add 2D face filter event and the add 3D glasses filter event
function toggleFaceFilterEvent() {

    if (showingFilter == 0) {
        document.body.dispatchEvent(toggleFaceEvent);
    } else {
        document.body.dispatchEvent(toggleGlassesEvent);
    }

    showingFilter = !showingFilter;

}