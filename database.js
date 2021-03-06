const mongo							= require("mongoose");
const nodemailer 				= require("nodemailer");
const generatorPassword	= require("password-generator");
const bcrypt						= require("bcrypt");
const crash 						= require("./error");

// const url = "mongodb+srv://admin:T77j3kxwBqgaAwU@college-kgk.zlmi7.mongodb.net/kgk";
const url = "mongodb+srv://admin:T77j3kxwBqgaAwU@college-kgk.zlmi7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// mongo.set('debug', true); // Дебажим ебаный код 16.09.2020

async function start(url) {
	try {
		await mongo.connect(
				url,
			{
				useNewUrlParser: true,
				useFindAndModify: false
			}
		)
	} catch (err) {
		console.log("Что-то пошло не так");
		console.log(err);
	}
};

start(url);

//Schema

const Schema = mongo.Schema;

const studentSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	secondName: {
		type: String,
		required: true
	},
	group: {
		type: String,
		required: true
	},
	groupNumber: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	pass: {
		type: String
	},
	login: {
		type: String
	},
	versionKey: false

});

const groupSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: Number,
		required: true
	},
});

const teacherSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	secondName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	pass: {
		type: String
	},
	login: {
		type: String
	},
	versionKey: false
});

const groupStudentSchema = new Schema({
	students:[],
	group: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
});

const lessonSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	teacher: {
		type: String,
		required: true
	},
	cabinet: {
		type: String,
		required: true
	}
});

// Написал эту схему, вроде работает 16.09.2020
// const timeTableSchema = new Schema({
// 	monday: [{
// }],
// 	tuesday: [{
// 		lessons: [{
// 			firstLesson: {
// 				type: String
// 			},
// 			secondLesson: {
// 				type: String
// 			},
// 			threeLesson: {
// 				type: String
// 			},
// 			fourLesson: {
// 				type: String
// 			},
// 			fiveLesson: {
// 				type: String
// 			},
// 		}]
// 	}],
// 	wednesday: [{
// 		lessons: [{
// 			firstLesson: {
// 				type: String
// 			},
// 			secondLesson: {
// 				type: String
// 			},
// 			threeLesson: {
// 				type: String
// 			},
// 			fourLesson: {
// 				type: String
// 			},
// 			fiveLesson: {
// 				type: String
// 			},
// 		}]
// 	}],
// 	thursday: [{
// 		lessons: [{
// 			firstLesson: {
// 				type: String
// 			},
// 			secondLesson: {
// 				type: String
// 			},
// 			threeLesson: {
// 				type: String
// 			},
// 			fourLesson: {
// 				type: String
// 			},
// 			fiveLesson: {
// 				type: String
// 			},
// 		}]
// 	}],
// 	friday: [{
// 		lessons: [{
// 			firstLesson: {
// 				type: String
// 			},
// 			secondLesson: {
// 				type: String
// 			},
// 			threeLesson: {
// 				type: String
// 			},
// 			fourLesson: {
// 				type: String
// 			},
// 			fiveLesson: {
// 				type: String
// 			},
// 		}]
// 	}],
// 	saturday: [{
// 		lessons: [{
// 			firstLesson: {
// 				type: String
// 			},
// 			secondLesson: {
// 				type: String
// 			},
// 			threeLesson: {
// 				type: String
// 			},
// 			fourLesson: {
// 				type: String
// 			},
// 			fiveLesson: {
// 				type: String
// 			},
// 		}]
// 	}],
// 	group: {
// 		type: String,
// 		required: true
// 	},
// });

//  Переписал это говнище 28.09. Я БЛЯТЬ НЕНАВИЖУ БАЗЫ ДАННЫХ
// const timeTableSchema = new Schema({
// 	monday: [],
// 	tuesday: [],
// 	wednesday: [],
// 	thursday: [],
// 	friday: [],
// 	saturday: [],
// 	group: {
// 		type: String,
// 		required: true
// 	},
// });
// Я дебил
// Я СДЕЛАЛ ЭТО!! время 5.00...
// Пояснения, массив типа Monday и т.д. проходят ввиде обьекта, состоящего из данных типа стринги.
const timeTableSchema = new Schema({
	monday: [{
		lesson_1: String,
		lesson_2: String,
		lesson_3: String,
		lesson_4: String
	}],
	tuesday: [{
		lesson_1: String,
		lesson_2: String,
		lesson_3: String,
		lesson_4: String,
	}],
	wednesday: [{
		lesson_1: String,
		lesson_2: String,
		lesson_3: String,
		lesson_4: String,
	}],
	thursday: [{
		lesson_1: String,
		lesson_2: String,
		lesson_3: String,
		lesson_4: String,
	}],
	friday: [{
		lesson_1: String,
		lesson_2: String,
		lesson_3: String,
		lesson_4: String,
	}],
	saturday: [{
		lesson_1: String,
		lesson_2: String,
		lesson_3: String,
		lesson_4: String,
	}],
	group: {
		type: String,
		required: true
	},
});

global.Student = mongo.model("students", studentSchema);
global.Group = mongo.model("groups", groupSchema);
global.Teacher = mongo.model("teachers", teacherSchema);
global.GroupStudent = mongo.model("student_groups", groupStudentSchema);
global.Lesson = mongo.model("lesson", lessonSchema);
global.TimeTable = mongo.model("timetable", timeTableSchema);
//mail

module.exports.sendMailRegisterStudent = function (mailTo, pass, name, login) {
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: "lavern.franecki@ethereal.email",
			pass: "36dsms7NbAabzJw9Rx",
		},
	});

	const mail = transporter.sendMail({
		from: "KGK College",
		to: mailTo,
		subject: "Регистрация на сайте",
		text: "Привет " + name + " , добро пожаловать в систему дистанционного обучения. Твой пароль: " + pass + ". Твой логин: " + login
	});

};

module.exports.sendMailRegisterTeacher = function (mailTo, pass, name, secondName, login) {
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: "lavern.franecki@ethereal.email",
			pass: "36dsms7NbAabzJw9Rx",
		},
	});

	const mail = transporter.sendMail({
		from: "KGK College",
		to: mailTo,
		subject: "Регистрация предподователя на сайте",
		text: "Здравствуйте " + name + " " + secondName + " , добро пожаловать в систему дистанционного обучения. Ваш пароль: " + pass + ". Ваш логин: " + login
	});

};

module.exports.sendMailDelete = function (mailTo,name) {
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: "lavern.franecki@ethereal.email",
			pass: "36dsms7NbAabzJw9Rx",
		},
	});

	const mail = transporter.sendMail({
		from: "KGK College",
		to: mailTo,
		subject: "Ваш аккаунт аннулирован",
		text: "Привет " + name + ". Твой аккаунт удален"
	});

};

//pass
module.exports.gPass = function() {

	const gPass = generatorPassword(15, false, /\d/, "KGK-");
	return gPass;
};

module.exports.passHash = function(pass) {
	let salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(pass, salt);
};

module.exports.compareHash = function (pass, hash) {
	return bcrypt.compareSync(pass, hash)
};
// const mongoClient = new MongoClient(url, {useNewUrlParser: true});
// mongoClient.connect(function (error, client) {
//
// 	if (error) {
// 		crash.errorReturn(error);
// 	}
//
// 	// Create database users
//
// 	global.dbUsers 						= client.db("users");
// 	global.collectionStudents 			= dbUsers.collection("student");
// 	module.exports.collectionTeacher 	= dbUsers.collection("teacher");
// 	module.exports.collectionAdmin 		= dbUsers.collection("admin");
//
// 	// Create database lessons
//
// 	const dbLessons				= client.db("lessons");
// 	const collectionMonday		= dbLessons.collection("mondayLessons");
// 	const collectionTuesday		= dbLessons.collection("tuesdayLessons");
// 	const collectionWednesday	= dbLessons.collection("wednesdayLessons");
// 	const collectionThursday	= dbLessons.collection("thursdayLessons");
// 	const collectionFriday		= dbLessons.collection("fridayLessons");
// 	const collectionSaturday	= dbLessons.collection("saturdayLessons");
//
// 	// let student = {name: "Жендос", firstName: "Повелитель", secondName: "Мамок", group: "Ад"};
// 	// collectionUsers.insertOne(student, function (error, result) {
//
// 	// 	if (error) {
// 	// 		error.errorReturn(error);
// 	// 	}
//
// 	// 	console.log(result.ops);
// 	// });
//
// 	client.close();
// });
