function creatUser(name, firstName, secondName, group) {
	$.ajax ({
		url: "api/student",
		contentType: "application/json",
		method: "POST",
		data: JSON.stringify({
			name: name,
			firstName: firstName,
			secondName: secondName,
			group: group
		}),
		success: function (student) {
			console.log("success");
			reset();
		}
	})
}