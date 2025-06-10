const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog.cjs");
const { userExtractor } = require("../utils/middleware.cjs");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
		id: 1,
	});
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
	const id = request.params.id;
	const blog = await Blog.findById(id).populate("user", {
		username: 1,
		name: 1,
		id: 1,
	});
	response.json(blog);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
	const body = request.body;
	const user = request.user;

	if (!body.title || !body.url) {
		response.status(400).end();
	} else {
		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes ?? 0,
			user: user._id,
		});

		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();

		response.status(201).json(savedBlog);
	}
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
	const id = request.params.id;
	const user = request.user;

	const blog = await Blog.findById(id);
	if (user._id.toString() !== blog.user.toString()) {
		return response.status(401).end();
	}

	await Blog.findByIdAndDelete(id);
	response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
	const id = request.params.id;
	const body = request.body;

	const blog = await Blog.findById(id);
	if (!blog) {
		return response.status(404).end();
	}

	blog.likes = body.likes;

	const updatedBlog = await blog.save();
	response.json(updatedBlog);
});

module.exports = blogsRouter;
