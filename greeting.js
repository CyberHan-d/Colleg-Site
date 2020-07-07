global.date = new Date();

module.exports.getMessage = function (name) {
	let now = date.getHours();
	if (now >= 13 && now < 20) {
		return "Добрый день " + name;
	} else if (now >= 20 ) {
		return "Добрый вечер " + name;
	} else {
		return "Доброе утро " + name;
	}
};