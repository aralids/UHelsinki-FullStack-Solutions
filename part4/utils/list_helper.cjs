const _ = require("lodash");

const User = require("../models/user.cjs");

const dummy = (blogs) => {
	// ...
};

const totalLikes = (blogs) => {
	const result = blogs.reduce((acc, blog) => acc + blog["likes"], 0);
	return result;
};

const favoriteBlog = (blogs) => {
	const result = blogs.reduce((currMax, blog) => {
		if (currMax) {
			if (currMax["likes"] > blog["likes"]) {
				return currMax;
			} else {
				return blog;
			}
		} else {
			return blog;
		}
	}, null);
	return result;
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return null;
	}

	const freqsObj = _.countBy(blogs, _.property("author"));
	const maxAuthor = _.maxBy(
		Object.keys(freqsObj),
		(author) => freqsObj[author]
	);
	return { author: maxAuthor, blogs: freqsObj[maxAuthor] };
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return null;
	}

	let likesObj = {};
	for (let blog of blogs) {
		if (blog.author in likesObj) {
			likesObj[blog.author] += blog.likes;
		} else {
			likesObj[blog.author] = blog.likes;
		}
	}

	const maxAuthor = _.maxBy(
		Object.keys(likesObj),
		(author) => likesObj[author]
	);
	return { author: maxAuthor, likes: likesObj[maxAuthor] };
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
	usersInDb,
};
