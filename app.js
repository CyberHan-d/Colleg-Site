const express 		= require("express");  // Подключение модулей
const os 			= require("os");
const bodyParser 	= require("body-parser");
const mongodb 		= require("./database");
const greeting 		= require("./greeting");
const crash			= require("./error");


// Global variable 
// date

// создаем сервер
const app = express();
const parser = express.json();

app.use(express.static(__dirname + "/site"));


app.use("/log-in(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/log-in.html");
});

app.get("/register(.html)?", function (request, response) {
	response.sendFile(__dirname + "/site/site_module/register.html");

	console.log("Page register load!");
});

app.post("/register(.html)?", parser, function (request, response) {

	const name 			= request.body.name;
	const firstName 	= request.body.firstName;
	const secondName 	= request.body.secondName;
	const group 		= request.body.group;

	const studentTable 	= {name: name, firstName: firstName, secondName: secondName, group: group};

	collectionStudents.insertOne(studentTable, function(error, result) {

		if (error) return console.log("Ошибка в отправке данных Student " + crash.errorReturn(error));

		console.log("Data send");
		response.send(studentTable);
	});

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
console.log("Стартанули сервер. Версия 0.7.1-dev");
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));

// http.createServer(function (request, response) { // request - хранит данные запроса, response - отправляет ответ
	
// 	response.end("Go NodeJS2X");

// }).listen(3000, "127.0.0.1", function () {
// 	console.log("Стартанули сервер. Версия 0.2.0-dev");
// 	console.log(date);
// 	console.log(greeting.getMessage(os.userInfo().username));
// });
