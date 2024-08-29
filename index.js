//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


import { countryData } from "./countries.js";
const countryList = countryData.map((a) => {
  return a.name;
});

autocomplete(document.getElementById("myInput"), countryList);

var remainingCountries = [],
    wrongGuesses = {},
    currentCountry = undefined,
    hasPreloaded = false


guessInput.onsubmit = (a)=>{
    a.preventDefault();
    makeGuess(a.srcElement[0].value)
    a.srcElement[0].value = ""
}

function sanitse(name) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}


function restart(newCountryList=false, newWrongGuesses=false) {
    remainingCountries = newCountryList.constructor==Array?newCountryList:[...countryList]
    wrongGuesses = newWrongGuesses.constructor==Object?newWrongGuesses:(()=>{
        let wg = {}
        remainingCountries.map((a)=>{wg[a]=0;return a})
        return wg
    })()
    console.log(newWrongGuesses,wrongGuesses)

    hasPreloaded = false
    document.getElementById("completed").textContent = `0/${countryList.length}`
    document.getElementById("wrong").textContent = `${0}/${countryList.length}`

    updateWrongs()
    shuffleRemaining()
    nextCountry()
    
}
function shuffleRemaining() {
    remainingCountries = shuffle(remainingCountries)
}
function nextCountry() {
    if (remainingCountries.length<=0) {
        console.log("empty remain count")
        restart()
        return
    }
    let selectedCountry = remainingCountries[0]

    setCountry(selectedCountry)
    if (!hasPreloaded) {
        showImg(selectedCountry)
        hasPreloaded = true
    } else {
        loadPreloadedImg()
    }
    if (remainingCountries.length>1) preloadImg(remainingCountries[1])
    
}
function checkRemaining(remaining) {
    for (let i = 0; i < remaining.length; i++) {
        const country = remaining[i];
        let countryExists = countryData.findIndex((a)=>{return a.name==country})
        if (countryExists==-1) {
            console.log("found non existant country, resetting progress")
            restart()
            break
        }
    }
    return remaining
}

function makeGuess(name) {
    if (sanitse(name)==sanitse(currentCountry)) {
        for (let i = 0; i < remainingCountries.length; i++) {
            if (remainingCountries[i]==currentCountry) {
                remainingCountries.splice(i,1)
                break
            }
        }
        localStorage.setItem("remainingCountries", JSON.stringify(remainingCountries))
        if (remainingCountries.length>0) {
            nextCountry()
        } else {
            alert("you win :)")
            restart()
        }


    } else {
        wrongGuesses[currentCountry] = 1
        updateWrongs()
        
    }
}
function updateWrongs() {
    let values = Object.keys(wrongGuesses).map(function(key){
        return wrongGuesses[key];
    }),
    wrongs = values.reduce((accumulator, currentValue) => accumulator + currentValue)
    document.getElementById("wrong").textContent = `${wrongs}/${countryList.length}`

    localStorage.setItem("wrongGuesses", JSON.stringify(wrongGuesses))

    console.log(wrongs)
    return wrongs
}
function setCountry(name) {
    console.log(name)
    let con = countryData[countryData.findIndex((a)=>{return a.name==name})];
    currentCountry = con.name
    globe.pointOfView(
      { lat: con.coords[0], lng: con.coords[1], altitude: 2.5 },
      250
    );
    document.getElementById("completed").textContent = `${countryList.length-remainingCountries.length}/${countryList.length}`
}

const imgPrefixes = "./flags/"
var currentlyLoadedFlag = 1
function loadPreloadedImg() {
    document.getElementById(`flagImg${currentlyLoadedFlag}`).style.display = "none"
    document.getElementById(`flagImg${currentlyLoadedFlag==1?2:1}`).style.display = ""
    currentlyLoadedFlag = currentlyLoadedFlag==1?2:1
}
function preloadImg(src) {
    console.log()
    document.getElementById(`flagImg${currentlyLoadedFlag==1?2:1}`).src = imgPrefixes+`${src}.svg`;
}
function showImg(src) {
    currentlyLoadedFlag = 1
    document.getElementById("flagImg"+1).style.display = ""
    document.getElementById("flagImg"+2).style.display = "none"
    document.getElementById("flagImg"+1).src = imgPrefixes+`${src}.svg`;
}




document.getElementById("resetProgress").onclick = ()=>{
    localStorage.removeItem("remainingCountries")
    if (!confirm("reset progress?")) return 0 
    restart()

}



window.onload = () => {
    let localStorageRemainingCountries = localStorage.getItem("remainingCountries")
    console.log(localStorageRemainingCountries)
    if (localStorageRemainingCountries!=null) {
        remainingCountries = checkRemaining(JSON.parse(localStorageRemainingCountries))
    } else {
        remainingCountries = undefined
    }

    let localWrongGuesses = localStorage.getItem("wrongGuesses")
    console.log(localWrongGuesses)
    if (localWrongGuesses!=null) {
        wrongGuesses = JSON.parse(localWrongGuesses)
    } else {
        wrongGuesses = undefined
    }
    

    restart(remainingCountries=remainingCountries, wrongGuesses=wrongGuesses)
};
