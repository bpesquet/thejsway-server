const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();
const upload = multer();
const jsonParser = bodyParser.json();
const Sequelize = require("sequelize");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const sequelize = new Sequelize("database", "", "", {
  host: "localhost",
  dialect: "sqlite",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: ".data/database.sqlite"
});
const Testimony = sequelize.define("Testimony", {
  name: {
    type: Sequelize.STRING
  },
  rating: {
    type: Sequelize.INTEGER
  },
  comment: {
    type: Sequelize.STRING
  }
});
Testimony.sync().then();

const articles = [
  { id: 1, title: "First article", content: "Hello World!" },
  {
    id: 2,
    title: "Lorem ipsum",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit mauris ac porttitor accumsan. Nunc vitae pulvinar odio, auctor interdum dolor. Aenean sodales dui quis metus iaculis, hendrerit vulputate lorem vestibulum."
  },
  {
    id: 3,
    title: "Lorem ipsum in French",
    content:
      "J’en dis autant de ceux qui, par mollesse d’esprit, c’est-à-dire par la crainte de la peine et de la douleur, manquent aux devoirs de la vie. Et il est très facile de rendre raison de ce que j’avance."
  }
];

app.get("/", (request, response) => {
  Testimony.findAll().then(testimonies => {
    response.send(testimonies);
  });
});

app.get("/api/articles", (request, response) => {
  response.json(articles);
});

// Expect form data
app.post("/tshirt", upload.array(), (request, response) => {
  const size = request.body.size;
  const color = request.body.color;
  response.send(`Command received! Size: ${size}, color: ${color}`);
});

// Expect form data
app.post("/animals", upload.array(), (request, response) => {
  const name = request.body.name;
  const vote = request.body.strongest;
  response.send(`Hello ${name}, you voted: ${vote}`);
});

// Expect JSON data
app.post("/cars", jsonParser, (request, response) => {
  const cars = request.body;
  response.send(`You sent me a list of cars: ${JSON.stringify(cars)}`);
});

// Expect form data
app.post("/articles", upload.array(), (request, response) => {
  const title = request.body.title;
  const content = request.body.content;
  articles.push({ title, content });
  response.send("New article added successfully!");
});

app.post("/api/testimony", jsonParser, (request, response) => {
  const testimony = request.body;
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
