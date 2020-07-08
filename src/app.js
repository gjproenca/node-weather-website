const path = require(`path`);
const express = require(`express`);
const hbs = require(`hbs`);
const geocode = require(`./utils/geocode.js`);
const forecast = require(`./utils/forecast`);
const { serialize } = require("v8");

const app = express();
// port equals to 3000 if it doesnt exist but if on heroku it exists and it will be set to it
const port = proccess.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, `../templates/views`);
const partialsPath = path.join(__dirname, `../templates/partials`);

// Setup handlebars engine and views location
app.set(`view engine`, `hbs`);
app.set(`views`, viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get(``, (req, res) => {
  res.render(`index`, {
    title: `Weather App`,
    name: `Goncalo Proenca`,
  });
});

app.get(`/about`, (req, res) => {
  res.render(`about`, {
    title: `About Me`,
    name: `Goncalo Proenca`,
  });
});

app.get(`/help`, (req, res) => {
  res.render(`help`, {
    helpText: `This is a message on the help page.`,
    title: `Help`,
    name: `Goncalo Proenca`,
  });
});

app.get(`/weather`, (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: `Your must provide and address!`,
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get(`/products`, (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: `You must provide a search term`,
    });
  }

  console.log(req.query.search);

  res.send({
    products: [],
  });
});

app.get(`/help/*`, (req, res) => {
  res.render("404", {
    title: "404",
    name: "Goncalo Proenca",
    errorMessage: "Help article not found",
  });
});

app.get(`*`, (req, res) => {
  res.render("404", {
    title: "404",
    name: "Goncalo Proenca",
    errorMessage: "Page not found",
  });
});

// Starting server on port 3000
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
