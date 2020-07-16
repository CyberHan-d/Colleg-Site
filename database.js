const mongo	= require("mongoose");
const crash = require("./error");

const url = "mongodb+srv://admin:W2Do1RgspeRpeSoU@college-kgk.zlmi7.mongodb.net/";

async function start() {
	try {
		await mongo.connect(
			"mongodb+srv://admin:W2Do1RgspeRpeSoU@college-kgk.zlmi7.mongodb.net/",
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
