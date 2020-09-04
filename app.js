require("dotenv").config();
const express 			= require("express");  // Подключение модулей
const session				=	require("express-session");
const expressHbs		= require("express-handlebars");
const flash					= require("express-flash");
const os 						= require("os");
const passport			= require("passport");
const MongoConnect	= require("connect-mongo");
const initializePassport = require("./passport-config");
const mongodb 			= require("./database");
const greeting 			= require("./greeting");


// Global variable
// date
// Student
// Group
// Teacher
// GroupStudent

// создаем сервер
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
// initializePassport(passport, login => {
// 	return
// });

// app.use(session({
// 	secret: process.env.SECRETKEY,
// 	resave: false,
// 	saveUninitialized: false,
// 	store: new MongoConnect({
// 		url: "mongodb+srv://admin:W2Do1RgspeRpeSoU@college-kgk.zlmi7.mongodb.net/kgk",
// 	})
// }));

app.set("view engine", "hbs");
app.engine("hbs", expressHbs(
	{
		layoutsDir: 		"views/layouts",
		defaultLayout: 	"layout",
		extname: 				"hbs",
	}
));

// Route pages
// Student.findOne({login: req.body.username}) == req.body.username && 	Student.findOne({pass: mongodb.compareHash(req.body.password, mongodb.passHash(req.body.password))})

app.route("/log-in(.html)?")
	.get(function(req, res) {
		res.sendFile(__dirname + "/public/log-in.html");

		res.status(200);
		console.log("Page log-in load!");

	})
	// .post(function(req, res) {
	// 	if(Student.findOne({"login": req.body.username}) && mongodb.compareHash(req.body.password, mongodb.passHash(req.body.password)) === true){
	// 		console.log("Вход успешен");
	// 		//
	// 		res.redirect("/home");
	// 	} else {
	// 		console.log();
	// 		console.log(Student.findOne({login: req.body.username}));
	// 		console.log("Пароль или логин не правильный!");
	// 		res.redirect("/log-in.html");
	// 	}
	// });

app.route("/register")
	.get(async function(req, res) {
		const students = await Student.find().lean();
		const groups = await Group.find().lean();
		const teachers = await Teacher.find().lean();

		res.render("register", {
			title: "Общий список",
			students,
			groups,
			teachers,
		});

		res.status(200);
		console.log("Page register load!");
	});

app.route("/register/teacher")
	.get(async function(req, res) {
		const teachers = await Teacher.find().lean();

		res.render("register-teacher", {
			title: "Регистрация предподователя",
			teachers
		});

		res.status(200);
		console.log("Page register/teacher load");
	})
	.post(async function(req, res) {
		try {
			let newPass		= mongodb.gPass();
			let hashPass 	= mongodb.passHash(newPass);
			let login			= req.body.firstName + "." + req.body.secondName;

			const teachers = new Teacher({
				name: req.body.name,
				firstName: req.body.firstName,
				secondName: req.body.secondName,
				email: req.body.email,
				phone: req.body.phone,
				pass: newPass,
				login: login,
			});

			await teachers.save();
			res.status(200);
			mongodb.sendMailRegisterTeacher(req.body.email, newPass, req.body.name, req.body.secondName, login);
			console.log("Предподователь создан");
			res.redirect("/register/teacher");
		} catch(err) {
			console.log("Не удалось отправить запрос");
			console.log(err);
		}
	});

	app.post("/register/teacher/delete", async function(req, res) {
		mongodb.sendMailDelete(req.body.email, req.body.name);
		await Teacher.findByIdAndDelete(req.body.id);
		console.log("Пользователь удален");
		res.redirect("/register/teacher");
	});

app.route("/register/group")
	.get(async function(req, res) {
		const groups = await Group.find().lean();

		res.render("register-group", {
			title: "Регистрация группы",
			groups
		});

		res.status(200);
		console.log("Page register/group load");
	})
	.post(async function(req, res) {
		try {
			const groups = new Group({
				name: req.body.name,
				code: req.body.code,
			});

			await groups.save();
			res.status(200);
			console.log("Группа создана");
			res.redirect("/register/group");
		} catch(err) {
			console.log("Не удалось отправить запрос");
			console.log(err);
		}
	});

	app.post("/register/group/delete", async function(req, res) {
		await Group.findByIdAndDelete(req.body.id);
		console.log("Группа удалена");
		res.redirect("/register/group");
	});


app.route("/register/student")
	.get(async function(reg, res) {
		const students = await Student.find().lean();
		const groups = await Group.find().lean();

		res.render("register-student", {
			title: "Регистрация студента",
			students,
			groups
		});

		res.status(200);
		console.log("Page register/student load!");
	})
	.post(async function(req, res) {
		try {
			let newPass		= mongodb.gPass();
			let hashPass 	= mongodb.passHash(newPass);
			let login			= req.body.firstName + "." + req.body.secondName;
			console.log(login);
			const students = new Student({
				name: req.body.name,
				firstName: req.body.firstName,
				secondName: req.body.secondName,
				email: req.body.email,
				group: req.body.group,
				pass: newPass,
				login: login,
			});

			await students.save();
			res.status(200);
			mongodb.sendMailRegisterStudent(req.body.email, newPass, req.body.name, login);
			console.log("Пользователь зарегестрирован");
			res.redirect("/register/student");
		} catch(err) {
			console.log("Не удалось отправить запрос");
			console.log(err);
		}
	});

app.post("/register/student/delete", async function(req, res) {
	mongodb.sendMailDelete(req.body.email, req.body.name);
	await Student.findByIdAndDelete(req.body.id);
	console.log("Пользователь удален");
	res.redirect("/register/student");
});

app.route("/register/student-group")
	.get(async function(reg, res) {
		const students = await Student.find().lean();
		const groups = await GroupStudent.find().lean();

		res.render("register-student-group", {
			title: "Создание группы",
			students,
			groups
		});

		res.status(200);
		console.log("Page register/student load!");
	})
	.post(async function(req, res) {
		try {
			const group = new GroupStudent({
				code: req.body.code,
				students: req.body.students
			});

			await group.save();
			res.status(200);
			console.log("Группа создана");
			res.redirect("/register/student-group");
		} catch(err) {
			console.log("Не удалось отправить запрос");
			console.log(err);
		}
	});

	app.post("/register/student-group/delete", async function(req, res) {
		await GroupStudent.findByIdAndDelete(req.body.id);
		console.log("Группа удалена");
		res.redirect("/register/student-group");
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

app.listen(process.env.PORT);
console.log("Стартанули сервер. Версия 0.9.0-dev");
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));
