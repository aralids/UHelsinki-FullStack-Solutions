const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static("dist"));

const morgan = require("morgan");
// app.use(morgan("tiny"));

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :obj")
);

morgan.token("obj", function (req) {
	if (req.method === "POST") {
		return "- " + JSON.stringify(req.body);
	} else {
		return "";
	}
});

const Person = require("./models/person.cjs");

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

/*
let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];
*/

app.get("/api/persons/", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/info/", (request, response) => {
	const date = new Date();
	response.writeHead(200, { "Content-Type": "text/plain" });
	Person.find({}).then((persons) => {
		response.end(`Phonebook has info for ${persons.length} people.\n\n${date}`);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findById(id)
		.then((person) => {
			response.json(person);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;

	Person.findByIdAndDelete(id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
	const body = request.body;

	/*
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number missing",
		});
	}

	
	if (Person.find({ name: body.name })) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	
    const newId = String(Math.floor(Math.random() * 1000000));
    */

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	const body = request.body;

	Person.findById(id)
		.then((person) => {
			if (!person) {
				return response.status(404).end();
			}

			person.name = body.name;
			person.number = body.number;

			return person.save().then((updatedPerson) => {
				response.json(updatedPerson);
			});
		})
		.catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT);
