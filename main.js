
let numberInput = document.getElementById("interval");
let numberInputDecimal = document.getElementById("intervalDecimal");
let intervalQuantity = document.getElementById("intervalQuantity");
let timeBetweenInterval = document.getElementById("timeBetweenInterval");
let timeDelay
let inputValue = numberInput.value;
let inputDecValue = numberInputDecimal.value;
let inputQuantity = intervalQuantity.value;

let displayHere = document.getElementById("showTime-time");
let timerDiv = document.getElementById("showTime");
let startButton = document.getElementById("startTimer");
let pauseButton = document.getElementById("pauseTimer");
let restartButton = document.getElementById("restartTimer");
let preFixTimeButton = document.querySelectorAll(".smallBtn");
let bells = document.getElementById("bells");
let delayTimeOutput = document.getElementById("delayTag");
let timerInterval;
let remainingTime = 0;
let timeInSeconds = 0;
let runCounterRepeat = 0;
let timerRunning = false;
let timerPaused = false;
let resumeTimeBool = false;
let OneMoreIntervall = true;


window.addEventListener('change', () => {
    inputValue = numberInput.value;
    inputDecValue = numberInputDecimal.value;
    inputQuantity = intervalQuantity.value;
    getTimeInSeconds();

});
//this function is fore the range input
function updateTime() {
    const timeRange = document.getElementById("timeRange");
    const timeRangeValue = timeRange.value;
    const minutes = Math.floor(timeRangeValue / 2).toString().padStart(2, '0');
    const seconds = (timeRangeValue % 2 === 0) ? "00" : "30";

    timeRange.addEventListener("change", () => {
        numberInput.value = minutes;
        numberInputDecimal.value = seconds;

    })
    numberInput.addEventListener("change", () => {
        const timeRange = document.getElementById("timeRange");
        timeRange.value = numberInput.value * 2;

    })
}


// Initialize the time display
updateTime();
getTimeInSeconds();

numberInput.addEventListener('change', () => {
    inputValue = numberInput.value;
});

numberInputDecimal.addEventListener('change', () => {
    inputDecValue = numberInputDecimal.value;
});

intervalQuantity.addEventListener('change', () => {
    inputQuantity = intervalQuantity.value;
});


startButton.addEventListener('click', () => {
    startTimer(false, false);
    restartButton.style.display = "inline";
    startButton.style.display = "none";
    timerDiv.style.display = "inline";



});
pauseButton.addEventListener('click', pauseTimer);
restartButton.addEventListener('click', () => {

    runCounterRepeat = 0;
    OneMoreIntervall = true;
    resumeTimeBool = false;
    timerRunning = false;
    timerPaused = false;

    clearInterval(timerInterval);
    clearTimeout(theRepeatTimerTimeout);

    getTimeInSeconds();

    displayHere.innerHTML = "00:00";
    pauseButton.innerHTML = "pause";

    startTimer(false, true);
});
numberInput.onkeydown = (event) => keyCheck(event);
numberInputDecimal.onkeydown = (event) => keyCheck(event);
inputQuantity.onkeydown = (event) => keyCheck(event);

preFixTimeButton.forEach((item) => {
    item.addEventListener('click', () => {

        let arr = item.innerHTML.split(":");

        numberInput.value = arr[0];
        inputValue = numberInput.value;
        numberInputDecimal.value = arr[1];
        inputDecValue = numberInputDecimal.value;


    })
})


function startTimer(bool, reset) {
    let timesLeft = inputQuantity;
    let timeIntervall = 3000;
    let intervallDelay = timeBetweenInterval.value * 1000;

    if (runCounterRepeat < timesLeft && OneMoreIntervall) {

        let showIntervall = document.getElementById("showTime-intervall-strong");
        setTimeout(() => {
            showIntervall.innerHTML = timesLeft - runCounterRepeat - 1;
        }, 1000);
        timeInSeconds = timeInSeconds * 1000;
        timeIntervall = timeInSeconds + intervallDelay;

        if (resumeTimeBool) {
            //if we resume from a pause session we use this
            setTimer(remainingTime, displayHere);
            resumeTimeBool = false;

         }else {
            getTimeInSeconds()
            if (reset === true) {
                clearInterval(timerInterval);
                timerRunning = true;
                timerPaused = false;        
                setTimer(remainingTime, displayHere);
            }
          
            else{

            clearInterval(timerInterval);
            timerRunning = true;
            setTimer(remainingTime, displayHere);}
        
            

        }
// replay the timer so long we still have intervals to do.
        theRepeatTimerTimeout = setTimeout(() => {
            startTimer(bool);

        }, timeIntervall);

    }
    else {
        OneMoreIntervall = false;
    }


}



function setTimer(time, display, NoBells) {
    if (NoBells) {
        return;

    } else {
        bells.play();
    }
    let timer = time, minutes, seconds;
    timerInterval = setInterval(function () {

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            timerPaused = false;
            if (NoBells) {
                return;

            } else {
                bells.play();
            }
            runCounterRepeat++;
        }

        remainingTime = timer;
    }, 1000);

}

function getTimeInSeconds() {

    timeInSeconds = parseInt(inputValue) * 60;

    if (inputDecValue > 0) {
        timeInSeconds = parseInt(inputDecValue) + timeInSeconds;
    }
    remainingTime = timeInSeconds;

}

function pauseTimer() {

    if (timerPaused == false) {
        if (remainingTime == -1) {
            let alertMessage = document.createElement("p");
            timerDiv.appendChild(alertMessage);
            alertMessage.innerText = "Sorry we cant stop timer between intervalls";
            setTimeout(() => {
                timerDiv.removeChild(alertMessage);

            }, 3000);
        } else {
            clearInterval(timerInterval);
            clearTimeout(theRepeatTimerTimeout);

            timerRunning = false;
            timerPaused = true;

            pauseButton.innerHTML = "resume";
        }

    }

    else if (timerPaused == true) {
        resumeTimeBool = true;
        timerRunning = true;
        timerPaused = false;
        startTimer(false);
        pauseButton.innerHTML = "pause";

    }
}


function keyCheck(event) {
    var key = event.keyCode;
   
    if (key < 48 || key > 57) {
        if (key === 8 || key === 37 || key === 39) {
            return;
        }
        event.preventDefault();

    }

}

