const express 		= require("express");  // Подключение модулей
const expressHbs	= require("express-handlebars");
const hbs 				= require("hbs");
const os 					= require("os");
const mongodb 		= require("./database");
const greeting 		= require("./greeting");
const crash				= require("./error");


// Global variable
// date

// создаем сервер
const app = express();
// const parser = express.json();


app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.engine("hbs", expressHbs(
	{
		layoutsDir: 		"views/layouts",
		defaultLayout: 	"layout",
		extname: 				"hbs"
	}
));

// Route pages

app.route("/log-in(.html)?")
	.get(function(req, res) {
		res.sendFile(__dirname + "/site/site_module/log-in.html");

		res.status(200);
		console.log("Page log-in load!");
	});

app.route("/register(.html)?")
	.get(function(reg, res) {
		res.render("register", {
			title: "Регистрация нового пользователя"
		});

		res.status(200);
		console.log("Page register load!");
	});

	app.route("/profile(.html)?")
		.get(function(req, res) {
			res.render("profile", {
				title: "Ваш профиль"
			});

			res.status(200);
			console.log("Page profile load!");
		});

	app.route("/home(.html)?")
		.get(function(req, res) {
			res.render("home", {
				title: "Домашняя страница"
			});

			res.status(200);
			console.log("Page home load!");
		});

app.use(function(reg, res) {
		res.render("not-found", {
			title: "Страница улетела("
		});

		res.status(404);
		console.log("Страница не найдена");
	});

// app.post("api/student", parser, function (request, response) {
//
// 	const name 			= request.body.name;
// 	const firstName 	= request.body.firstName;
// 	const secondName 	= request.body.secondName;
// 	const group 		= request.body.group;
//
// 	const studentTable 	= {name: name, firstName: firstName, secondName: secondName, group: group};
//
// 	collectionStudents.insertOne(studentTable, function(error, result) {
//
// 		if (error) return console.log("Ошибка в отправке данных Student " + crash.errorReturn(error));
//
// 		console.log("Data send");
// 		response.send(studentTable);
// 	});
//
// });

app.listen(3000);
console.log("Стартанули сервер. Версия 0.7.3-dev");
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));
