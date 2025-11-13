import { useState } from "react";

const BlogForm = ({ createBlog, setNotification }) => {
	const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

	const addBlog = async (event) => {
		event.preventDefault();
		const response = await createBlog(newBlog);
		console.log("response: ", response);

		setNewBlog({ title: "", author: "", url: "" });
	};
	return (
		<div>
			<h2>Create blog</h2>
			<form
				onSubmit={(event) => {
					try {
						addBlog(event);
						setNotification({
							message: "Successful blog creation",
							status: "success",
						});
						setTimeout(() => {
							setNotification({ message: null, error: null });
						}, 5000);
					} catch (error) {
						setNotification({
							message: "Blog creation fail: " + error,
							status: "error",
						});
						setTimeout(() => {
							setNotification({ message: null, error: null });
						}, 5000);
					}
				}}
			>
				<div>
					<label>
						title
						<input
							type="text"
							value={newBlog.title}
							name="Title"
							data-testid="1"
							onChange={({ target }) =>
								setNewBlog({ ...newBlog, title: target.value })
							}
						/>
					</label>
				</div>
				<div>
					<label>
						author
						<input
							type="text"
							value={newBlog.author}
							name="Author"
							data-testid="2"
							onChange={({ target }) =>
								setNewBlog({ ...newBlog, author: target.value })
							}
						/>
					</label>
				</div>
				<div>
					<label>
						url
						<input
							type="text"
							value={newBlog.url}
							name="Url"
							data-testid="3"
							onChange={({ target }) =>
								setNewBlog({ ...newBlog, url: target.value })
							}
						/>
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default BlogForm;
