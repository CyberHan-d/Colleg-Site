const express = require("express");  // Подключение модулей
const greeting = require("./greeting");
const os = require("os");

// Global variable
// date

// создаем сервер
const app = express();

app.use(express.static(__dirname + "/site"));

app.use("/log-in(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/log-in.html");
});

app.use("/register(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/register.html");
});

app.use(function (request, response) {
	
	response.sendFile(__dirname + "/site/site_module/not-found.html");
});

app.listen(3000);
console.log("Стартанули сервер. Версия 0.3.0-dev");
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));

// http.createServer(function (request, response) { // request - хранит данные запроса, response - отправляет ответ
	
// 	response.end("Go NodeJS2X");

// }).listen(3000, "127.0.0.1", function () {
// 	console.log("Стартанули сервер. Версия 0.2.0-dev");
// 	console.log(date);
// 	console.log(greeting.getMessage(os.userInfo().username));
// });
