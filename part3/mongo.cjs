// 3.12
const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://dilaratsch:${password}@part3-cluster.pxqevzp.mongodb.net/?retryWrites=true&w=majority&appName=part3-cluster`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	id: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
	Person.find({}).then((persons) => {
		console.log("phonebook:");
		persons.map((person) =>
			console.log(person["name"] + " " + person["number"])
		);
		mongoose.connection.close();
	});
} else {
	const person = new Person({
		id: "5",
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then(() => {
		console.log("person saved!");
		mongoose.connection.close();
	});
}
