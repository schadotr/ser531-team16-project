const expressObject = require('express');
const app = expressObject();
const connection = require("./db/database");
const dotenv = require('dotenv');
const requestObject = require('request');
var querystring = require('querystring');
dotenv.config();

connection();

app.use(expressObject.json());

app.listen(8081);
console.log("Server is listening port 8080 !!!!");

app.get('/movie-by-title', (request, response) => {
    const movieTitle = request.body.movieTitle;
    var query = querystring.stringify({ "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#> SELECT ?Title ?Year ?Genre ?RunTime ?Rating ?Votes ?Adult ?OriginalTitle WHERE { ?movID a mov:MovieID. ?movID mov:hasPrimaryTitle ?pt. ?pt mov:isPrimaryTitle ?Title. FILTER(?Title = "Reis"^^xsd:string). ?movID mov:hasGenre ?g. ?g mov:isGenre ?Genre. ?movID mov:isAdult ?Adult. ?movID mov:hasReleaseYear ?ry. ?ry mov:isReleaseYear ?Year. ?movID mov:hasRating ?R. ?R mov:isRating ?Rating. ?movID mov:hasRunTime ?rt. ?rt mov:isRunTime ?RunTime. ?movID mov:hasVotes ?v. ?v mov:isVotes ?Votes. ?movID mov:hasSecondaryTitle ?st. ?st mov:isSecondaryTitle ?OriginalTitle. } ORDER BY DESC(?Rating) LIMIT 100` });
    requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: 'http://fuseki:3030/movie-management/?' + query }, function (error, res, body) {
        return response.send(body);
    });
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