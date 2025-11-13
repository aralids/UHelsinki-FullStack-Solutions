import { useState } from "react";

const Blog = ({ blog, increaseBlogLikes, user, deleteBlog }) => {
	const [showDetails, setShowDetails] = useState(false);
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};
	return (
		<div style={blogStyle} className="blog">
			{blog.title} {blog.author}{" "}
			<button onClick={() => setShowDetails(!showDetails)}>
				{showDetails ? "hide" : "view"}
			</button>
			{showDetails ? (
				<div>
					{blog.url}
					<br />
					likes {blog.likes}{" "}
					<button onClick={() => increaseBlogLikes(blog)}>like</button>
					<br />
					{blog.user.name}
					<br />
					{blog.user.username === user.username ? (
						<button
							style={{ backgroundColor: "lightblue" }}
							onClick={() => deleteBlog(blog)}
						>
							remove
						</button>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Blog;
