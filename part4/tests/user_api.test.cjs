const assert = require("node:assert");
const { test, describe, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");

const supertest = require("supertest");
const app = require("../app.cjs");
const api = supertest(app);
const User = require("../models/user.cjs");
const listHelper = require("../utils/list_helper.cjs");

const bcrypt = require("bcrypt");

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash("sekret", 10);
		const user = new User({ username: "root", passwordHash });
		await user.save();
	});

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await listHelper.usersInDb();

		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await listHelper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		assert(usernames.includes(newUser.username));
	});

	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await listHelper.usersInDb();

		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salainen",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await listHelper.usersInDb();
		assert(result.body.error.includes("expected `username` to be unique"));

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test("creation fails with proper statuscode and message if username shorter than 3 chars", async () => {
		const usersAtStart = await listHelper.usersInDb();

		const newUser = {
			username: "ro",
			name: "Superuser",
			password: "salainen",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await listHelper.usersInDb();
		assert(
			result.body.error.includes(
				"username is missing or less than 3 chars long"
			)
		);

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});

	test("creation fails with proper statuscode and message if password shorter than 3 chars", async () => {
		const usersAtStart = await listHelper.usersInDb();

		const newUser = {
			username: "roo",
			name: "Superuser",
			password: "sa",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await listHelper.usersInDb();
		assert(
			result.body.error.includes(
				"password is missing or less than 3 chars long"
			)
		);

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});
});

after(async () => {
	await mongoose.connection.close();
});
