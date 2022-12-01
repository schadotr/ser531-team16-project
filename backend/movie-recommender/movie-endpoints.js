const expressObject = require('express');
const app = expressObject();
const connection = require("./db/database");
const dotenv = require('dotenv');
const requestObject = require('request');
var querystring = require('querystring');
const cors = require('cors');
app.use(expressObject.json());

dotenv.config();

connection();

app.use(expressObject.json());
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.listen(8081);
console.log("Server is listening port 8080 !!!!");

app.get('/movie-by-title', (request, response) => {
  const movieTitle = request.query.movieTitle;
  console.log(movieTitle);
  var query = querystring.stringify({ "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#> SELECT ?Title ?Year ?Genre ?RunTime ?Rating ?Votes ?Adult ?OriginalTitle WHERE { ?movID a mov:MovieID. ?movID mov:hasPrimaryTitle ?pt. ?pt mov:isPrimaryTitle ?Title. FILTER(STRSTARTS(?Title , "${movieTitle}"^^xsd:string)). ?movID mov:hasGenre ?g. ?g mov:isGenre ?Genre. ?movID mov:isAdult ?Adult. ?movID mov:hasReleaseYear ?ry. ?ry mov:isReleaseYear ?Year. ?movID mov:hasRating ?R. ?R mov:isRating ?Rating. ?movID mov:hasRunTime ?rt. ?rt mov:isRunTime ?RunTime. ?movID mov:hasVotes ?v. ?v mov:isVotes ?Votes. ?movID mov:hasSecondaryTitle ?st. ?st mov:isSecondaryTitle ?OriginalTitle. } ORDER BY DESC(?Rating) LIMIT 100` });
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/movie-management/?` + query }, function (error, res, body) {
    return response.send(body);
  });
});

app.get('/movie-by-genre', (request, response) => {
  var genreList = request.query.genres;
  var typeOfQuery = request.query.type;

  genreList = genreList.split(',');
  var queryList = [];
  genreList.forEach((genre) => {
    queryList.push(`{?movID mov:hasGenre ?g.
        ?g mov:isGenre ?Genre.
        FILTER(CONTAINS(lcase(str(?Genre)), "${genre}"^^xsd:string)).}`)
  });
  if (typeOfQuery == 'or') {
    queryList = queryList.join([separator = ' UNION ']);
  } else {
    queryList = queryList.join([separator = ' . ']);
  }
  var query = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#>
    SELECT ?Title ?Year ?Genre ?RunTime ?Rating ?Votes ?OriginalTitle WHERE {
      ?movID a mov:MovieID.
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ${queryList}
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
    } ORDER BY DESC(?Year) LIMIT 1000`});
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/movie-management/?` + query }, function (error, res, body) {
    return response.send(body);
  });
});

app.get('/movie-by-actor', (request, response) => {
  const actorName = request.query.actorName;
  var q = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX act: <http://www.semanticweb.org/ser531-team16/actor#>
    SELECT DISTINCT ?MovieID ?Name ?knownfor WHERE {
      ?actID a act:ActorID.
      ?actID act:hasActorID ?ActorID.
      ?actID act:hasPrimaryName ?Name.
      FILTER(?Name = "${actorName}").
      ?actID act:knownFor ?knownfor.
    } ORDER BY(?Name)`});
  var knownfor;
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/actor/?` + q }, function (error, res, body) {
    return response.send(body);
    console.log(knownfor);
    var query = querystring.stringify({
      "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#>
      SELECT ?Title ?Movieid ?Year ?Genre ?RunTime ?Rating ?Votes ?OriginalTitle ?Adult WHERE {
        ?movID a mov:MovieID.
        ?movID mov:isMovieID ?Movieid.
        ?movID mov:hasPrimaryTitle ?pt.
        ?pt mov:isPrimaryTitle ?Title.
        FILTER(CONTAINS(${knownfor}^^xsd:string,?Movieid)).
        ?movID mov:hasGenre ?g.
        ?g mov:isGenre ?Genre.
        ?movID mov:isAdult ?Adult.
        ?movID mov:hasReleaseYear ?ry.
        ?ry mov:isReleaseYear ?Year.
        ?movID mov:hasRating ?R.
        ?R mov:isRating ?Rating.
        ?movID mov:hasRunTime ?rt.
        ?rt mov:isRunTime ?RunTime.
        ?movID mov:hasVotes ?v.
        ?v mov:isVotes ?Votes.
        ?movID mov:hasSecondaryTitle ?st.
        ?st mov:isSecondaryTitle ?OriginalTitle.
      } ORDER BY DESC(?Rating) LIMIT 100`});
    requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}/movie-management/?` + query }, function (error, res, body) {
      return response.send(body);
    });
  });
});

app.get('/movie-by-director', (request, response) => {
  const directorName = request.body.directorName;
  var q = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dir: <http://www.semanticweb.org/ser531-team16/director#>
    SELECT DISTINCT ?DirectorID ?Name ?knownfor WHERE {
      ?dirID a dir:DirectorID.
      ?dirID dir:hasID ?DirectorID.
      ?dirID dir:hasPrimaryName ?Name.
      FILTER(?Name = ${directorName}).
      ?dirID dir:knownFor ?knownfor.
    } ORDER BY(?Name)`});
  var knownfor;
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}/director/?` + q }, function (error, res, body) {
    knownfor = body.knownfor;
  });
  var query = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#>
    SELECT ?Title ?Movieid ?Year ?Genre ?RunTime ?Rating ?Votes ?OriginalTitle ?Adult WHERE {
      ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid.
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      FILTER(CONTAINS(${knownfor}^^xsd:string,?Movieid)).
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
    } ORDER BY DESC(?Rating) LIMIT 100`});
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/movie-management/?` + query }, function (error, res, body) {
    return response.send(body);
  });
  response.send("ok");
});

app.get('/movie-by-producer', (request, response) => {
  const producerName = request.body.producerName;
  var q = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX prod: <http://www.semanticweb.org/ser531-team16/producer#>
    SELECT DISTINCT ?ProducerID ?Name ?knownfor WHERE {
      ?prodID a prod:ProducerID.
      ?prodID prod:hasID ?ProducerID.
      ?prodID prod:hasPrimaryName ?Name.
      FILTER(?Name = ${producerName}).
      ?prodID prod:knownFor ?knownfor.
    } ORDER BY(?Name)`});
  var knownfor;
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/producer/?` + q }, function (error, res, body) {
    knownfor = body.knownfor;
  });
  var query = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#>
    SELECT ?Title ?Movieid ?Year ?Genre ?RunTime ?Rating ?Votes ?OriginalTitle ?Adult WHERE {
      ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid.
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      FILTER(CONTAINS(${knownfor}^^xsd:string,?Movieid)).
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
    } ORDER BY DESC(?Rating) LIMIT 100`});
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/movie-management/?` + query }, function (error, res, body) {
    return response.send(body);
  });
  response.send("ok");
});

app.get('/movie-by-writer', (request, response) => {
  const writerName = request.body.writerName;
  var q = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX wri: <http://www.semanticweb.org/ser531-team16/writer#>
    SELECT DISTINCT ?WriterID ?Name ?knownfor WHERE {
      ?wriID a wri:WriterID.
      ?wriID wri:hasID ?WriterID.
      ?wriID wri:hasPrimaryName ?Name.
      FILTER(?Name = ${writerName}).
      ?wriID wri:knownFor ?knownfor.
    } ORDER BY(?Name)`});
  var knownfor;
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/writer/?` + q }, function (error, res, body) {
    knownfor = body.knownfor;
  });
  var query = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#>
    SELECT ?Title ?Movieid ?Year ?Genre ?RunTime ?Rating ?Votes ?OriginalTitle ?Adult WHERE {
      ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid.
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      FILTER(CONTAINS(${knownfor}^^xsd:string,?Movieid)).
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
    } ORDER BY DESC(?Rating) LIMIT 100`});
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/movie-management/?` + query }, function (error, res, body) {
    return response.send(body);
  });
  response.send("ok");
});

app.get('/movie-by-multiple-parameters', (request, response) => {
  const movieTitle = request.body.movieTitle;
  const genreList = request.body.genres;
  const actorName = request.body.actorName;
  const directorName = request.body.directorName;
  const producerName = request.body.producerName;
  const writerName = request.body.writerName;
  var query = querystring.stringify({
    "query": `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mov: <http://www.semanticweb.org/ser531-team16/movie#>
    PREFIX act: <http://www.semanticweb.org/ser531-team16/actor#>
    PREFIX dir: <http://www.semanticweb.org/ser531-team16/director#>
    PREFIX prod: <http://www.semanticweb.org/ser531-team16/producer#>
    SELECT ?Title ?Year ?Genre ?RunTime ?Rating ?Votes ?OriginalTitle WHERE {
      
      {?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        FILTER(?Title = ${movieTitle}).}
        UNION
        {?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        FILTER(CONTAINS(?Genre, ${genreList[0]})).}
        UNION
        {?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        FILTER(CONTAINS(?Genre, ${genreList[1]})).}
        UNION
        {
        ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        ?actID a act:ActorID.
        ?actID act:hasPrimaryName ${actorName}^^xsd:string.
        ?actID act:knownFor ?knownfor1.
        FILTER(CONTAINS(?knownfor1,?Movieid)).
          }
        UNION
        {
        ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        ?dirID a dir:DirectorID.
        ?dirID dir:hasPrimaryName ${directorName}^^xsd:string. 
        ?dirID dir:knownFor ?knownfor2.
        FILTER(CONTAINS(?knownfor2,?Movieid)).
      }
        UNION
        {
        ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        ?prodID a prod:ProducerID.
        ?prodID prod:hasPrimaryName "RDJ"^^xsd:string.
        ?prodID prod:knownFor ?knownfor3.
        FILTER(CONTAINS(?knownfor3,?Movieid)).
      }
      UNION
        {
        ?movID a mov:MovieID.
      ?movID mov:isMovieID ?Movieid. 
      ?movID mov:hasPrimaryTitle ?pt.
      ?pt mov:isPrimaryTitle ?Title.
      ?movID mov:hasGenre ?g.
      ?g mov:isGenre ?Genre.
      ?movID mov:isAdult ?Adult.
      ?movID mov:hasReleaseYear ?ry.
      ?ry mov:isReleaseYear ?Year.
      ?movID mov:hasRating ?R.
      ?R mov:isRating ?Rating.
      ?movID mov:hasRunTime ?rt.
      ?rt mov:isRunTime ?RunTime.
      ?movID mov:hasVotes ?v.
      ?v mov:isVotes ?Votes.
      ?movID mov:hasSecondaryTitle ?st.
      ?st mov:isSecondaryTitle ?OriginalTitle.
        ?wriID a wri:WriterID.
        ?wriID wri:hasPrimaryName ${writerName}^^xsd:string.
        ?wriID wri:knownFor ?knownfor4.
        FILTER(CONTAINS(?knownfor4,?Movieid)).
      }
    } ORDER BY(?Title) LIMIT 5000` });
  requestObject.post({ headers: { 'content-type': 'application/x-www-form-urlencoded', 'accept': 'application/json' }, url: `http://${process.env.FUSEKI}:3030/movie-management/?` + query }, function (error, res, body) {
    return response.send(body);
  });
  response.send("ok");
});