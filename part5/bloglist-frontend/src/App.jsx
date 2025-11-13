import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Toggleable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState({
		message: null,
		status: null,
	});

	useEffect(() => {
		blogService
			.getAll()
			.then((blogs) => setBlogs(blogs.sort((a, b) => a.likes - b.likes)));
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				username,
				password,
			});
			window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
			setUser(user);
			setUsername("");
			setPassword("");
			blogService.setToken(user.token);
			setNotification({ message: "Successful login", status: "success" });
			setTimeout(() => {
				setNotification({ message: null, error: null });
			}, 5000);
		} catch (exception) {
			setNotification({ message: "Wrong credentials", status: "error" });
			setTimeout(() => {
				setNotification({ message: null, error: null });
			}, 5000);
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("loggedBloglistUser");
		setUser(null);
	};

	const addBlog = async (blogObject) => {
		const returnedBlog = await blogService.create(blogObject);
		setBlogs(blogs.concat(returnedBlog).sort((a, b) => a.likes - b.likes));
	};

	const increaseBlogLikes = async (blogObject) => {
		const returnedBlog = await blogService.updateLikes(blogObject);
		let currBlogs = JSON.parse(JSON.stringify(blogs));
		currBlogs = currBlogs.map((blog) => {
			if (blog.id === blogObject.id) {
				console.log("returnedBlog: ", returnedBlog);
				return returnedBlog;
			}
			return blog;
		});
		setBlogs(currBlogs.sort((a, b) => a.likes - b.likes));
	};

	const deleteBlog = async (blogObject) => {
		if (window.confirm("Do you want to delete this blog?")) {
			await blogService.remove(blogObject.id);
			let currBlogs = JSON.parse(JSON.stringify(blogs));
			currBlogs = currBlogs.filter((blog) => blog.id !== blogObject.id);
			setBlogs(currBlogs.sort((a, b) => a.likes - b.likes));
		}
	};

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	if (user === null) {
		return (
			<div>
				<Notification
					message={notification.message}
					status={notification.status}
				/>
				<h2>Log in to application</h2>
				<form onSubmit={handleLogin}>
					<div>
						<label>
							username
							<input
								type="text"
								value={username}
								name="Username"
								onChange={({ target }) => setUsername(target.value)}
							/>
						</label>
					</div>
					<div>
						<label>
							password
							<input
								type="password"
								value={password}
								name="Password"
								onChange={({ target }) => setPassword(target.value)}
							/>
						</label>
					</div>
					<button id="login-button" type="submit">
						login
					</button>
				</form>
			</div>
		);
	}

	return (
		<div>
			<Notification
				message={notification.message}
				status={notification.status}
			/>
			<h2>blogs</h2>
			<p>
				{user.name} logged in{" "}
				<button onClick={() => handleLogout()}>log out</button>
			</p>

			<Togglable buttonLabel="new blog">
				<BlogForm createBlog={addBlog} setNotification={setNotification} />
			</Togglable>

			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					increaseBlogLikes={increaseBlogLikes}
					user={user}
					deleteBlog={deleteBlog}
				/>
			))}
		</div>
	);
};

export default App;
