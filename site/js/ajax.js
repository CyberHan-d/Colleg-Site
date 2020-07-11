function creatUser(name, firstName, secondName, group) {
	$.ajax ({
		url: "/register(html.)?",
		contentType: "application/json",
		method: "POST",
		data: JSON.stringify({
			name: name,
			firstName: firstName,
			secondName: secondName,
			group: group
		}),
		success: function (student) {
			reset();
		};
	});
};