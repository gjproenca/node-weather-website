const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=75a02516cf8db6be576e2f968530417a&query=${latitude},${longitude}`;

  request(
    { url, json: true },
    (
      error,
      {
        body: {
          error: bodyError,
          current: { temperature, weather_descriptions, humidity, feelslike },
        },
      }
    ) => {
      if (error) {
        callback(`Unable to connect to the weather services!`, undefined);
      } else if (bodyError) {
        callback(`Unable to find location!`, undefined);
      } else {
        callback(
          undefined,
          `${weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out. Humidity ${humidity}%.`
        );
      }
    }
  );
};

module.exports = forecast;
