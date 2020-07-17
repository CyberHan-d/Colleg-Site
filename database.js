const mongo							= require("mongoose");
const nodemailer 				= require("nodemailer");
const generatorPassword	= require("password-generator");
const bcrypt						= require("bcrypt");
const crash 						= require("./error");

const url = "mongodb+srv://admin:W2Do1RgspeRpeSoU@college-kgk.zlmi7.mongodb.net/";

async function start() {
	try {
		await mongo.connect(
			"mongodb+srv://admin:W2Do1RgspeRpeSoU@college-kgk.zlmi7.mongodb.net/kgk",
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

start();

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
	email: {
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

global.Student = mongo.model("students", studentSchema);

//mail

module.exports.sendMailNode = function (mailTo, pass, name, login) {
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

//pass
module.exports.gPass = function() {

	const gPass = generatorPassword(15, false, /\d/, "KGK-");
	return gPass;
};

module.exports.passHash = function(pass) {
	let salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(pass, salt);
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
