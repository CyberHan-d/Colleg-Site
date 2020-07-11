const MongoClient = require("mongodb").MongoClient;
const crash = require("./error");

const url = "mongodb://127.0.0.1/";
const mongoClient = new MongoClient(url, {useNewUrlParser: true});
mongoClient.connect(function (error, client) {

	if (error) {
		crash.errorReturn(error);
	}

	// Create database users
	
	const dbUsers 				= client.db("users");
	const collectionStudents 	= dbUsers.collection("student");
	const collectionTeacher 	= dbUsers.collection("teacher");
	const collectionAdmin 		= dbUsers.collection("admin");

	// Create database lessons
	
	const dbLessons				= client.db("lessons");
	const collectionMonday		= dbLessons.collection("mondayLessons");
	const collectionTuesday		= dbLessons.collection("tuesdayLessons");
	const collectionWednesday	= dbLessons.collection("wednesdayLessons");
	const collectionThursday	= dbLessons.collection("thursdayLessons");
	const collectionFriday		= dbLessons.collection("fridayLessons");
	const collectionSaturday	= dbLessons.collection("saturdayLessons");

	let student = {name: "Жендос", firstName: "Повелитель", secondName: "Мамок", group: "Ад"};
	collectionUsers.insertOne(student, function (error, result) {
		
		if (error) {
			error.errorReturn(error);
		}

		console.log(result.ops);
	});


	client.close();
});