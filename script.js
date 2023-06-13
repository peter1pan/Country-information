async function allCountry(countryName) {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/name/" + countryName
    );
    if (!response.ok) throw new Error("Country not found");
    const data = await response.json();
    setCountry(data[0]);

    const borderNeigbor = data[0].borders;
    if (!borderNeigbor) throw new Error("The country has not neigboor");
    const response2 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + borderNeigbor.toString()
    );

    const neigbors = await response2.json();
    neigborCountry(neigbors);
    document.querySelector("#loading").style.opacity = 0;
  } catch (error) {
    errorMsg(error);
  }
}

function setCountry(data) {
  const html = `
 <div class="card-body">
   <div class="row">
    <div class="col-4">
     <img src="${data.flags.png}" alt
   <div class="col-8">
     <h3 class="card-tittle">${data.name.common}</h3>
     <hr>
     <div class="row">
       <div class="col-4">Population</div>
       <div class="col-8">${(data.population / 1000000).toFixed(1)}</div>
     </div>
     <div class="row">
       <div class="col-4">Capital</div>
       <div class="col-8">${data.capital[0]}</div>
     </div>
     <div class="row">
       <div class="col-4">Spellings</div>
       <div class="col-8">${data.altSpellings}</div>
     </div>
     <div class="row">
       <div class="col-4">Language</div>
       <div class="col-8">${Object.values(data.languages)}</div>
     </div>
     <div class="row">
       <div class="col-4">Currency</div>
       <div class="col-8">${Object.values(data.currencies)[0].name} (${
    Object.values(data.currencies)[0].symbol
  })</div>
     </div>
   </div>
    </div>
 </div>
 `;
  document.querySelector(".container").innerHTML = html;
}

function neigborCountry(data) {
  let html = "";
  for (let neighborCountries of data) {
    html += `
<div class="col-2 mt-2" id="neigbors">
 <div onclick="allCountry('${neighborCountries.name.common}')" class="card">
  <img class="image-top" src="${neighborCountries.flags.png}" alt=""/>
  <div class="card-body">
 <h6 class="card-tittle">${neighborCountries.name.common}</h6>
 </div>
 </div>
</div>
  `;
  }
  document.querySelector(".neigbor-bar").style.opacity = 1;
  document.querySelector("#neigbors").innerHTML = html;
}

function errorMsg(error) {
  document.querySelector("#loading").style.opacity = 0;
  const errorHtml = `
     <div class="alert alert-danger">
         ${error.message}
         </div>
     `;
  setTimeout(() => {
    document.querySelector(".alert-bar").innerHTML = "";
  }, 3000);
  document.querySelector(".alert-bar").innerHTML = errorHtml;
} // error code

const input_bar = document.querySelector("#input-bar");
const search_button = document

  .querySelector(".search-button")
  .addEventListener("click", function () {
    let textValue = document.querySelector("#input-bar").value;
    allCountry(textValue);
    document.querySelector(".neigbor-bar").style.opacity = 0;
    document.querySelector(".neigbor-tittle").style.display = "block";
    document.querySelector("#loading").style.opacity = 1;
  });

document.querySelector("#btnLocation").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    document.querySelector("#loading").style.opacity = 1;
  }
}); // location code

async function onSuccess(position) {
  // location button code
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  const locationApiKey = "0e2d2adcd6af417fa0eb51de12891bb6";
  const locationApi = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${locationApiKey}`;
  const response = await fetch(locationApi);
  const data = await response.json();
  const country = data.results[0].components.country;

  document.querySelector("#input-bar").value = country;
  document.querySelector(".search-button").click();
  document.querySelector("#loading").style.opacity = 0;
}

function onError(error) {
  document.querySelector("#loading").style.opacity = 0;
}
