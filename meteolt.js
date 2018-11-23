//jsdom to query html document
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// make http requests
const http = require('http');

var url = 'http://www.meteo.lt/lt/miestas?placeCode=';
var city = "Vilnius";

http.get(url + city, (resp) => {
  let data = '';
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    //console.log(JSON.parse(data).explanation);
    console.log(formatMainInfoAsJSON(data));
  });
}).on("error", (err) => {
  console.log(formatErrorInfoAssJson(err.message));
});
var formatErrorInfoAssJson = function(errorMessage){
  return {
    "type": "error",
    "date": new Date(),
    "data":{
      "message": errorMessage
    }
  };
};

var formatMainInfoAsJSON = function(fullHtml){
    const dom = new JSDOM(fullHtml);
    const infoContainer = dom.window.document.querySelector(".weather_info");

    var currentTemp = infoContainer.querySelector(".temperature").innerHTML;
    var feelsLikeTemp = infoContainer.querySelector(".feelLike").innerHTML;
    var humidityGround = infoContainer.querySelector(".humidityGround").innerHTML;
    var windSpeedGround = infoContainer.querySelector(".windSpeedGround").innerHTML;

    return {
      "type": "weatherInfo",
      "date": new Date(),
      "data":{
        "city": city,
        "currentTemp": currentTemp,
        "feelsLikeTemp": feelsLikeTemp,
        "humidityGround": humidityGround,
        "windSpeedGround": windSpeedGround
      }
    };
};
