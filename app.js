const express 		= require("express");  // Подключение модулей
const expressHbs	= require("express-handlebars");
const os 					= require("os");
const mongodb 		= require("./database");
const greeting 		= require("./greeting");
const crash				= require("./error");


// Global variable
// date
//Student

// создаем сервер
const app = express();
// const parser = express.json();

app.use(express.static("/site"));
app.use(express.urlencoded({extended: true}));

app.set("view engine", "hbs");
// hbs.registerPartials(__dirname + "/views/partials");
app.engine("hbs", expressHbs(
	{
		layoutsDir: 		"views/layouts",
		defaultLayout: 	"layout",
		extname: 				"hbs",
		// handlebars: allowInsecurePrototypeAccess(hbs)
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
	.get(async function(reg, res) {
		const students = await Student.find().lean();

		res.render("register", {
			title: "Регистрация нового пользователя",
			students
		});

		res.status(200);
		console.log("Page register load!");
	})
	.post(async function(req, res) {
		try {
			let newPass = mongodb.gPass();
			console.log(newPass);
			let hashPass = mongodb.passHash(newPass);
			console.log(hashPass);
			const students = new Student({
				name: req.body.name,
				firstName: req.body.firstName,
				secondName: req.body.secondName,
				email: req.body.email,
				group: req.body.group,
				pass: hashPass
			});

			await students.save();
			res.status(200);
			mongodb.sendMailNode(req.body.email, newPass, req.body.name);
			console.log("Пользователь зарегестрирован");
			res.redirect("/register");
		} catch(err) {
			console.log("Не удалось отправить запрос");
			console.log(err);
		}
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

app.listen(3000);
console.log("Стартанули сервер. Версия 0.8.0-dev");
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));
