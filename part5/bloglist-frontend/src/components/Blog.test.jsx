import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders title and author but not likes and url", () => {
	const blog = {
		title: "Component testing is done with react-testing-library",
		author: "Maxi Sydow",
		url: "https://example.com/blog",
		likes: 100,
		user: { username: "dilara", name: "Dilara", id: "123abc" },
	};
	render(
		<Blog
			blog={blog}
			user={{ username: "dilara", name: "Dilara", id: "123abc" }}
		/>
	);

	const blogTitle = screen.getByText(
		"Component testing is done with react-testing-library",
		{ exact: false }
	);
	expect(blogTitle).toBeVisible();

	const blogAuthor = screen.getByText("Maxi Sydow", { exact: false });
	expect(blogAuthor).toBeVisible();

	const blogLikes = screen.queryByText("likes", { exact: false });
	expect(blogLikes).toBeNull();

	const blogURL = screen.queryByText("http", { exact: false });
	expect(blogURL).toBeNull();
});

test("renders title, author, likes and url after button click", async () => {
	const blog = {
		title: "Component testing is done with react-testing-library",
		author: "Maxi Sydow",
		url: "https://example.com/blog",
		likes: 100,
		user: { username: "dilara", name: "Dilara", id: "123abc" },
	};

	render(
		<Blog
			blog={blog}
			user={{ username: "dilara", name: "Dilara", id: "123abc" }}
		/>
	);

	const user = userEvent.setup();
	const button = screen.getByText("view");
	await user.click(button);

	const blogTitle = screen.getByText(
		"Component testing is done with react-testing-library",
		{ exact: false }
	);
	expect(blogTitle).toBeVisible();

	const blogAuthor = screen.getByText("Maxi Sydow", { exact: false });
	expect(blogAuthor).toBeVisible();

	const blogLikes = screen.queryByText("likes", { exact: false });
	expect(blogLikes).toBeVisible();

	const blogURL = screen.queryByText("http", { exact: false });
	expect(blogURL).toBeVisible();
});

test("clicking like button twice registers twice", async () => {
	const blog = {
		title: "Component testing is done with react-testing-library",
		author: "Maxi Sydow",
		url: "https://example.com/blog",
		likes: 100,
		user: { username: "dilara", name: "Dilara", id: "123abc" },
	};

	const mockHandler = vi.fn();

	render(
		<Blog
			blog={blog}
			user={{ username: "dilara", name: "Dilara", id: "123abc" }}
			increaseBlogLikes={mockHandler}
		/>
	);

	const user = userEvent.setup();
	const button = screen.getByText("view");
	await user.click(button);

	const likeButton = screen.getByText("like");

	await user.click(likeButton);
	await user.click(likeButton);

	expect(mockHandler.mock.calls).toHaveLength(2);
});
