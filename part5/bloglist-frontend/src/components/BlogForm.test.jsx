import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
	const user = userEvent.setup();
	const createBlog = vi.fn();

	render(<BlogForm createBlog={createBlog} setNotification={() => {}} />);

	const titleInput = screen.getByTestId("1");
	const authorInput = screen.getByTestId("2");
	const urlInput = screen.getByTestId("3");
	const createButton = screen.getByText("create");

	await user.type(titleInput, "testing title...");
	await user.type(authorInput, "testing author...");
	await user.type(urlInput, "testing url...");
	await user.click(createButton);

	expect(createBlog.mock.calls).toHaveLength(1);
	expect(createBlog.mock.calls[0][0].title).toBe("testing title...");
	expect(createBlog.mock.calls[0][0].author).toBe("testing author...");
	expect(createBlog.mock.calls[0][0].url).toBe("testing url...");
});
