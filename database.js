const MongoClient = require("mongodb").MongoClient;
const crash = require("./error");

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useNewUrlParser: true});
mongoClient.connect(function (error, client) {

	if (error) {
		crash.errorReturn(error);
	}
	
	const dbUsers = client.db("users");
	const collectionUsers = dbUsers.collection("student");
	let student = {name: "Жендос", firstName: "Повелитель", secondName: "Мамок", group: "Ад"};
	collectionUsers.insertOne(student, function (error, result) {
		
		if (error) {
			error.errorReturn(error);
		}

		console.log(result.ops);
	});

	client.close();
});