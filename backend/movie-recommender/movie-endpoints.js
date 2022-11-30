const expressObject = require('express');
const app = expressObject();
const connection = require("./db/database");
const dotenv = require('dotenv');
dotenv.config();

connection();

app.use(expressObject.json());

app.listen(8081);
console.log("Server is listening port 8080 !!!!");

app.get('/movie-by-title', (request, response) => {
    const movieTitle = request.body.movieTitle;
    response.send("ok");
});

app.get('/movie-by-genre', (request, response) => {
    const genreList = request.body.genres;
    response.send("ok");
});

app.get('/movie-by-actor', (request, response) => {
    const actorName = request.body.actorName;
    response.send("ok");
});

app.get('/movie-by-director', (request, response) => {
    const directorName = request.body.directorName;
    response.send("ok");
});

app.get('/movie-by-producer', (request, response) => {
    const producerName = request.body.producerName;
    response.send("ok");
});

app.get('/movie-by-writer', (request, response) => {
    const writerName = request.body.writerName;
    response.send("ok");
});

app.get('/movie-by-multiple-parameters', (request, response) => {
    const movieTitle = request.body.movieTitle;
    const genreList = request.body.genres;
    const actorName = request.body.actorName;
    const directorName = request.body.directorName;
    const producerName = request.body.producerName;
    const writerName = request.body.writerName;
    response.send("ok");
});