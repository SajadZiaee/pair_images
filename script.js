// In the name of Allah
// TODO: add a dark mode toggle button. ===> ADDED.
// TODO: save dark mode state in local storage. ===> ADDED.
// TODO: add a "Start Now" button. ===> ADDED.
// TODO: show images to the user while the results are being displayed. ===> ADDED.
// TODO: add a border so the user knows which pictures he choosed correctly 
// and which pictures he choosed wrongly. ===> ADDED.

const body = document.body;
const btnChangeTheme = document.getElementById('btn-change-theme');
const images = document.querySelectorAll('.image');
const btnStartGame = document.getElementById('btn-start-game');
const txtRemainingTime = document.getElementById('txt-remaining-time');
const btnStartNow = document.getElementById('btn-start-now');
const remainingTimeAndStartNow = document.getElementById('remaining-time-and-start-now');
const btnFinishGame = document.getElementById('btn-finish-game');
const msgNotFinished = document.getElementById('message-not-finished');
const resultsAndRestart = document.getElementById('results-and-restart');
const txtResults = document.getElementById('txt-results');
const btnRestartGame = document.getElementById('btn-restart-game');



let selected1 = -1, selected2 = -1;

let isGameStarted = false;
let remainingTime = 10;
let arrayImages = [1, 1, 2, 2, 3, 3, 4, 4];
let arraySelections = [-1, -1, -1, -1, -1, -1, -1, -1];
let arrayColors = ['red', 'blue', 'aqua', 'orange', 'yellow', 'purple', 'pink', 'white'];

getThemeFromLocalStorage();

btnChangeTheme.addEventListener('click', function () {
    if (body.classList == "bg-light") {
        localStorage.setItem('theme', 'dark');
        body.classList = "bg-dark";
        btnChangeTheme.style.color = "white";
        txtRemainingTime.style.color = 'white';
        txtResults.style.color = 'white';
        images.forEach(function (image) {
            image.classList.add('image-dark');
        });

    }
    else {
        localStorage.setItem('theme', 'light');
        body.classList = "bg-light";
        btnChangeTheme.style.color = "black";
        txtRemainingTime.style.color = 'black';
        txtResults.style.color = 'black';
        images.forEach(function (image) {
            image.classList.remove('image-dark');
        });

    }
});

btnStartGame.addEventListener('click', function () {
    remainingTime = 10;
    btnStartGame.classList.add('hidden');
    remainingTimeAndStartNow.classList.remove('hidden');
    arrayImages = shuffle(arrayImages);
    for (let i = 0; i <= 7; i++) {
        images[i].style = '';
        images[i].classList = `image image-${arrayImages[i]}`;
        if (body.classList == "bg-dark") { /// the theme.
            images[i].classList.add('image-dark');
        }
    }

    txtRemainingTime.textContent = 'زمان باقی مانده: ' + 10;
    let interval = setInterval(() => {
        if (remainingTime <= 1) {
            clearInterval(interval);
            remainingTimeAndStartNow.classList.add('hidden');
            btnFinishGame.classList.remove('hidden');
            isGameStarted = true;
            for (let i = 0; i <= 7; i++) {
                images[i].style.background = 'grey';
            }
        }
        remainingTime -= 1;
        txtRemainingTime.textContent = 'زمان باقی مانده: ' + remainingTime;
    }, 1000);
});

btnStartNow.addEventListener('click', function () {
    remainingTime = 0;
});


for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click', function () {

        if (isGameStarted === true) {
            if (selected1 === -1) {
                selected1 = i;


            } else {
                if (arraySelections[selected1] !== -1) { /// previously choosed something.
                    let previouslySelected = arraySelections[selected1];
                    arraySelections[previouslySelected] = -1;
                    images[previouslySelected].innerHTML = ``;
                }


                selected2 = i;



                if (arraySelections[selected2] !== -1) { /// previously choosed something.
                    let previouslySelected = arraySelections[selected2];
                    arraySelections[previouslySelected] = -1;
                    images[previouslySelected].innerHTML = ``;
                }
                if (selected1 !== selected2) {  /// to check if previously clicked on this element or not.
                    images[i].innerHTML = `<p style="padding-top: 25%; text-align: center; color: ${arrayColors[selected1]};">
                ${selected1 + 1}
            </p>`;
                    images[selected1].innerHTML = `<p style="padding-top: 25%; text-align: center; color: ${arrayColors[selected1]};">
                ${selected2 + 1}
            </p>`;
                    arraySelections[selected1] = selected2;
                    arraySelections[selected2] = selected1;
                    selected1 = -1;
                    selected2 = -1;
                } else {  /// selected === selected2: meaning that the user clicked on the same item twice.
                    selected2 = -1;
                }
            }

        }

    });
}

btnFinishGame.addEventListener('click', function () {
    let hasFinished = true;
    for (let i = 0; i < arraySelections.length; i++) { // Check if the user has completed the game.
        if (arraySelections[i] === -1) {
            hasFinished = false;
            msgNotFinished.classList.remove('hidden');
            setTimeout(function () {
                msgNotFinished.classList.add('hidden');
            }, 5000)

            break;
        }
    }
    if (hasFinished === true) {
        let trueCount = 0;
        for (let i = 0; i < arraySelections.length; i++) {
            images[i].style = '';
            if (arrayImages[i] === arrayImages[arraySelections[i]]) {
                trueCount++;
                images[i].classList = `image image-${arrayImages[i]} image-correctly`;
            } else {
                images[i].classList = `image image-${arrayImages[i]} image-wrongly`;
            }

        }
        trueCount /= 2;
        let falseCount = 4 - trueCount;
        // for (let i = 0; i <= 7; i++) {
        //     images[i].style = '';
        //     images[i].classList = `image image-${arrayImages[i]}`;
        //     if (body.classList == "bg-dark") { /// the theme.
        //         images[i].classList.add('image-dark');
        //     }
        // }
        txtResults.textContent = `تعداد درست: ${trueCount}  تعداد غلط:  ${falseCount} `;
        btnFinishGame.classList.add('hidden');
        resultsAndRestart.classList.remove('hidden');
    }


});

btnRestartGame.addEventListener('click', function () {
    resultsAndRestart.classList.add('hidden');
    // btnStartGame.classList.remove('hidden');

    images.forEach(function (image) {
        image.textContent = '';
    });
    arraySelections = [-1, -1, -1, -1, -1, -1, -1, -1];
    selected1 = -1;
    selected2 = -1;
    btnStartGame.click(); /// this line triggers click on btnStartGame.

});





function shuffle(array) {  /// got this from internet :)
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function getThemeFromLocalStorage() {
    let theme = localStorage.getItem('theme');
    if (theme !== null) {
        if (theme === 'dark') {
            body.classList = "bg-dark";
            btnChangeTheme.style.color = "white";
            txtRemainingTime.style.color = 'white';
            txtResults.style.color = 'white';
            images.forEach(function (image) {
                image.classList.add('image-dark');
            });
        }
    }
}

