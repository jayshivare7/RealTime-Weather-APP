const userTab=document.querySelector("[data-useWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const headerC=document.querySelector(".headingC");
// initially variables needed??

let oldTab=userTab;
const API_KEY="a9e8dad3319ba939845514bd3b2d4540";
oldTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(newTab){
// oldTab=clickedTab;
if(newTab!= oldTab){
     oldTab.classList.remove("current-tab");
     oldTab=newTab;
     oldTab.classList.add("current-tab");

     if(!searchForm.classList.contains("active")){
userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
searchForm.classList.add("active");
     }
     else{
// main pehle search wale tab me tha , ab your weather ko visible karana hai  
 
        searchForm.classList.remove("active");
        userContainer.classList.remove("active");
// ab main your weather tab me aa gya hu , toh weather bhi display karna padega , so lets check local storage first
//  for coordinates , if we have saved them there 
getFromSessionStorage();
     }
    }
}
userTab.addEventListener("click",() => {
    
    //pass clicked tab as input parameter 
    switchTab(userTab);
});
 searchTab.addEventListener("click",() => {
    
    //pass clicked tab as input parameter 
    switchTab(searchTab);
});
headerC.addEventListener("click",() => {
 document.location.reload();   
});


// check if coordinates are already present in session storage  

function getFromSessionStorage(){
const localCoordinates= sessionStorage.getItem("user-coordinates");

if(!localCoordinates){
    // agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
}
else{
const coordinates= JSON.parse(localCoordinates);
fetchUserWeatherInfo(coordinates);

}
}
async function fetchUserWeatherInfo(coordinates){
const {lat,lon}=coordinates;
// make grantconatiner invisible 
grantAccessContainer.classList.remove("active");
// make loader visible
loadingScreen.classList.add("active");
// API call

try {
    const response= await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);

        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
}

catch (error) {
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");

    alert("Unable to fetch Weather");
}

}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elemnets
const cityName=document.querySelector("[data-cityName]");
const countryIcon=document.querySelector("[data-countryIcon]");
const desc=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-weatherIcon]");
const temp=document.querySelector("[data-temp]");
const windspeed=document.querySelector("[data-windspeed]");
const humidity=document.querySelector("[data-humidity]");
const cloudiness=document.querySelector("[data-cloud]");

//fetch  values from and put in UI elements !!
cityName.innerText=weatherInfo?.name;
countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText= weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText=`${weatherInfo?.main?.temp}°C`;
windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
humidity.innerText=`${weatherInfo?.main?.humidity}%`;
cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
if(cityName==undefined){
    // printW();
    console.log(weatherInfo);
}
}

function getLocation(){
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
}
else{
    //  alert to show no geolocation access available
    alert("No Loaction Access Available");


}
}
function showPosition(position){
const userCoordinates = {
    lat: position.coords.latitude,
lon: position.coords.longitude,
};
sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) => {
e.preventDefault();
let cityName = searchInput.value;
if(cityName=== ""){
    return;
}
else fetchSearchWeatherInfo(cityName);


})
async function fetchSearchWeatherInfo(city){
loadingScreen.classList.add("active");
userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
try {
    const res= await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data=await res.json();
    loadingScreen.classList.remove("active");
userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
} catch (error) {
    alert("Unable to fetch Weather");
        
}
}


