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
// Lesson
// TimeTable

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

app.route("/register(.html)?")
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

//route register teacher----------------------------------------------------------------------\

app.route("/register/teacher(.html)?")
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

// route register group-----------------------------------------------------------------\

app.route("/register/group(.html)?")
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


// route register student-----------------------------------------------------------\

app.route("/register/student(.html)?")
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
				phone: req.body.phone,
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

//route student group--------------------------------------------------------\

app.route("/register/student-group(.html)?")
	.get(async function(reg, res) {
		const students = await Student.find().lean();
		const groups = await GroupStudent.find().lean();
		const group = await Group.find().lean();

		res.render("register-student-group", {
			title: "Создание группы",
			students,
			groups,
			group
		});

		res.status(200);
		console.log("Page register/student load!");
	})
	.post(async function(req, res) {
		try {
			const group = new GroupStudent({
				code: req.body.code,
				students: req.body.students,
				group: req.body.group
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


// route register lesson-------------------------------------------------------------------\

	app.route("/register/lesson(.html)?")
	.get(async function(reg, res) {
		const teachers = await Teacher.find().lean();
		const lessons = await Lesson.find().lean();

		res.render("register-lesson", {
			title: "Создание урока",
			teachers,
			lessons
		});

		res.status(200);
		console.log("Page register/lesson load!");
	})
	.post(async function(req, res) {
		try {
			const lesson = new Lesson({
				name: req.body.name,
				teacher: req.body.teacher,
				cabinet: req.body.cabinet
			});

			await lesson.save();
			res.status(200);
			console.log("Урок создан");
			res.redirect("/register/lesson");
		} catch(err) {
			console.log("Не удалось отправить запрос");
			console.log(err);
		}
	});

// route regitser timetable --------------------------------------------------------------------------------------

app.route("/register/timetable(.html)?")
.get(async function(reg, res) {
	const lessons = await Lesson.find().lean();
	const groupStudents = await GroupStudent.find().lean();
	const timeTable = await TimeTable.find().lean();

	res.render("register-timetable", {
		title: "Создание расписания",
		groupStudents,
		lessons,
		timeTable,
	});

	res.status(200);
	console.log("Page register/timetable load!");
})
.post(async function(req, res) {
	try {
		const timeTable = new TimeTable({
			monday:[{
				lesson_1: req.body.lesson_1_Monday,
				lesson_2: req.body.lesson_2_Monday,
				lesson_3: req.body.lesson_3_Monday,
				lesson_4: req.body.lesson_4_Monday,
			}],
			tuesday:[{
				lesson_1: req.body.lesson_1_Tuesday,
				lesson_2: req.body.lesson_2_Tuesday,
				lesson_3: req.body.lesson_3_Tuesday,
				lesson_4: req.body.lesson_4_Tuesday,
			}],
			wednesday:[{
				lesson_1: req.body.lesson_1_Wednesday,
				lesson_2: req.body.lesson_2_Wednesday,
				lesson_3: req.body.lesson_3_Wednesday,
				lesson_4: req.body.lesson_4_Wednesday,
			}],
			thursday:[{
				lesson_1: req.body.lesson_1_Thursday,
				lesson_2: req.body.lesson_2_Thursday,
				lesson_3: req.body.lesson_3_Thursday,
				lesson_4: req.body.lesson_4_Thursday,
			}],
			friday:[{
				lesson_1: req.body.lesson_1_Friday,
				lesson_2: req.body.lesson_2_Friday,
				lesson_3: req.body.lesson_3_Friday,
				lesson_4: req.body.lesson_4_Friday,
			}],
			saturday:[{
				lesson_1: req.body.lesson_1_Saturday,
				lesson_2: req.body.lesson_2_Saturday,
				lesson_3: req.body.lesson_3_Saturday,
				lesson_4: req.body.lesson_4_Saturday,
			}],
			group: req.body.group
		});

		await timeTable.save();
		res.status(200);
		console.log("Расписание создано!");
		res.redirect("/register/timetable");
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

app.listen(process.env.PORT);
console.log("Стартанули сервер. Версия " + process.env.VERSION);
console.log(date);
console.log(greeting.getMessage(os.userInfo().username));
