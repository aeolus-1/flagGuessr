import { countryData } from "./countries.js";
const countryList = countryData.map((a) => {
  return a.name;
});

autocomplete(document.getElementById("myInput"), countryList);

var remainingCountries = [],
    currentCountry = undefined


guessInput.onsubmit = (a)=>{
    a.preventDefault();
    makeGuess(a.srcElement[0].value)
    a.srcElement[0].value = ""
}

function sanitse(name) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}


function restart(newCountryList=false) {
    remainingCountries = newCountryList.constructor==Array?newCountryList:[...countryList]
    selectRandom()
    
}
function selectRandom() {
    let selectedCountry = remainingCountries[Math.floor(Math.random()*remainingCountries.length)]

    setCountry(selectedCountry);
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
            selectRandom()
        } else {
            alert("you win :)")
            restart()
        }


    }
}
function setCountry(name) {
    let con = countryData[countryData.findIndex((a)=>{return a.name==name})];
    currentCountry = con.name
    globe.pointOfView(
      { lat: con.coords[0], lng: con.coords[1], altitude: 2.5 },
      250
    );
    document.getElementById("flagImg").src = `./flags/${con.name}.svg`;
    document.getElementById("completed").textContent = `${countryList.length-remainingCountries.length}/${countryList.length}`
  }




document.getElementById("resetProgress").onclick = restart



window.onload = () => {
    let localStorageRemainingCountries = localStorage.getItem("remainingCountries")
    if (localStorageRemainingCountries) {
        remainingCountries = JSON.parse(localStorageRemainingCountries)
    }


    restart(remainingCountries=remainingCountries)
};
