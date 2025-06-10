const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app.cjs");
const bcrypt = require("bcrypt");

const Blog = require("../models/blog.cjs");
const User = require("../models/user.cjs");

const api = supertest(app);

let dummyUser = {};
let token = "";
const initialBlogs = [
	{
		title: "Blog 1",
		author: "Monica Bellucci",
		url: "https://example.com/blog1",
		likes: 1,
	},
	{
		title: "Blog 2",
		author: "Monica Bellucci",
		url: "https://example.com/blog2",
		likes: 2,
	},
];

beforeEach(async () => {
	await User.deleteMany({});
	const passwordHash = await bcrypt.hash("sekret", 10);
	const user = new User({ username: "root", name: "Root", passwordHash });
	await user.save();
	dummyUser = {
		username: "root",
		name: "Root",
		id: user.id,
	};
	token =
		"Bearer " +
		(
			await api
				.post("/api/login")
				.send({ username: "root", password: "sekret" })
		).body.token;

	await Blog.deleteMany({});
	let blogObject = new Blog({ ...initialBlogs[0], user: user.id });
	await blogObject.save();
	blogObject = new Blog({ ...initialBlogs[1], user: user.id });
	await blogObject.save();
});

test("blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, 2);
});

test("unique identifier stored as id not _id", async () => {
	const response = await api.get("/api/blogs");

	let ids = response.body.map((e) => e.id);
	ids = ids.filter((id) => id);

	let underscoreIds = response.body.map((e) => e._id);
	underscoreIds = underscoreIds.filter((underscoreId) => underscoreId);

	assert.strictEqual(ids.length, 2);
	assert.strictEqual(underscoreIds.length, 0);
});

test("a valid blog can be added ", async () => {
	const newBlog = {
		title: "newestBestestBlog",
		author: "Monica Bellucci",
		url: "https://example.com/newestbestest",
		likes: 100,
	};

	await api
		.post("/api/blogs")
		.set("Authorization", token)
		.send(newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const response = await api.get("/api/blogs");

	const titles = response.body.map((r) => r.title);

	assert.strictEqual(response.body.length, initialBlogs.length + 1);

	assert(titles.includes("newestBestestBlog"));
});

test("a valid blog cannot be added without authorization", async () => {
	const newBlog = {
		title: "newestBestestBlog",
		author: "Monica Bellucci",
		url: "https://example.com/newestbestest",
		likes: 100,
	};

	await api.post("/api/blogs").send(newBlog).expect(401);

	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, initialBlogs.length);
});

test("likes default to 0", async () => {
	const newBlog = {
		title: "newestBestestBlog",
		author: "Monica Bellucci",
		url: "https://example.com/newestbestest",
	};

	const newBlogId = (
		await api.post("/api/blogs").set("Authorization", token).send(newBlog)
	).body.id;

	const response = await api.get("/api/blogs");

	const savedNewBlog = response.body.find((b) => b.id === newBlogId);
	console.log("savedNewBlog: ", savedNewBlog);

	assert.strictEqual(savedNewBlog.likes, 0);
});

test("blog without title is not added", async () => {
	const newBlog = {
		author: "Monica Bellucci",
		url: "https://example.com/newestbestest",
	};

	await api
		.post("/api/blogs")
		.set("Authorization", token)
		.send(newBlog)
		.expect(400);

	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog without url is not added", async () => {
	const newBlog = {
		title: "newestBestestBlog",
		author: "Monica Bellucci",
	};

	await api
		.post("/api/blogs")
		.set("Authorization", token)
		.send(newBlog)
		.expect(400);

	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog can be requested by id", async () => {
	const blogs = await api.get("/api/blogs");
	const blogId = blogs.body[0].id;

	const response = await api.get(`/api/blogs/${blogId}`);
	const returnedBlog = response.body;

	assert.deepStrictEqual(returnedBlog, {
		...initialBlogs[0],
		id: blogId,
		user: dummyUser,
	});
});

test("blog can be deleted by id", async () => {
	const blogs = await api.get("/api/blogs");
	const blogId = blogs.body[0].id;

	await api
		.delete(`/api/blogs/${blogId}`)
		.set("Authorization", token)
		.expect(204);
	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, initialBlogs.length - 1);
});

test("blog cannot be deleted without authorization", async () => {
	const blogs = await api.get("/api/blogs");
	const blogId = blogs.body[0].id;

	await api.delete(`/api/blogs/${blogId}`).expect(401);
	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog likes can be updated by id", async () => {
	const blogs = await api.get("/api/blogs");
	const blog = blogs.body[0];

	await api
		.put(`/api/blogs/${blog.id}`)
		.send({ ...blog, likes: blog.likes + 1 });
	const response = await api.get(`/api/blogs/${blog.id}`);
	const returnedBlog = response.body;

	assert.deepStrictEqual(returnedBlog, {
		...blog,
		id: blog.id,
		likes: blog.likes + 1,
	});
});

after(async () => {
	await mongoose.connection.close();
});
