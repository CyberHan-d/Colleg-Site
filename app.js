const express = require("express");  // Подключение модулей
const os = require("os");
const bodyParser = require("body-parser");
const mongodb = require("./database");
const greeting = require("./greeting");


// Global variable 
// date

// создаем сервер
const app = express();

app.use(express.static(__dirname + "/site"));

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use("/log-in(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/log-in.html");
});

app.get("/register(.html)?", urlencodedParser, function (request, response) {
	response.sendFile(__dirname + "/site/site_module/register.html");
});

app.get("/profile(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/profile.html");
});

app.get("/home(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/home.html");
});

app.use(function (request, response) {
	
	response.sendFile(__dirname + "/site/site_module/not-found.html");
});

app.listen(3000);
console.log("Стартанули сервер. Версия 0.6.0-dev");
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));

// http.createServer(function (request, response) { // request - хранит данные запроса, response - отправляет ответ
	
// 	response.end("Go NodeJS2X");

// }).listen(3000, "127.0.0.1", function () {
// 	console.log("Стартанули сервер. Версия 0.2.0-dev");
// 	console.log(date);
// 	console.log(greeting.getMessage(os.userInfo().username));
// });
