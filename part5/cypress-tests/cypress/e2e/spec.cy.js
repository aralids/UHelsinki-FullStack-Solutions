describe("Blog app", function () {
	beforeEach(function () {
		cy.request("POST", "http://localhost:3003/api/testing/reset");
		const user = {
			name: "Matti Luukkainen",
			username: "mluukkai",
			password: "salainen",
		};
		const otherUser = {
			name: "Dilara Sarach",
			username: "dsarach",
			password: "diosmio",
		};
		cy.request("POST", "http://localhost:3003/api/users/", user);
		cy.request("POST", "http://localhost:3003/api/users/", otherUser);
		cy.visit("http://localhost:5173");
	});

	it("Login form is shown", function () {
		cy.contains("label", "username");
		cy.contains("label", "password");
		cy.contains("button", "login");
	});

	describe("Login", function () {
		it("succeeds with correct credentials", function () {
			cy.contains("label", "username").type("mluukkai"); // labels need to be added in the HTML (via React)
			cy.contains("label", "password").type("salainen");
			cy.get("#login-button").click();
			cy.contains("Matti Luukkainen logged in");
		});

		it("fails with wrong credentials", function () {
			cy.contains("label", "username").type("mluukkai"); // labels need to be added in the HTML (via React)
			cy.contains("label", "password").type("mlukkai");
			cy.get("#login-button").click();
			cy.get(".error")
				.should("contain", "Wrong credentials")
				.and("have.css", "color", "rgb(255, 0, 0)");
		});
	});

	describe("Blog app", function () {
		describe("When logged in", function () {
			beforeEach(function () {
				cy.login({ username: "mluukkai", password: "salainen" });
			});

			it("A blog can be created", function () {
				cy.contains("new blog").click();
				cy.contains("label", "title").type("a blog created by cypress");
				cy.contains("label", "author").type("aralids");
				cy.contains("label", "url").type("www.github.com/aralids");
				cy.contains("button", "create").click();
				cy.contains("a blog created by cypress");
			});

			describe("and several notes exist", function () {
				beforeEach(function () {
					cy.createBlog({
						title: "first blog",
						author: "aralids",
						url: "www.github.com/aralids",
					});
					cy.createBlog({
						title: "second blog",
						author: "aralids",
						url: "www.github.com/aralids",
					});
					cy.createBlog({
						title: "third blog",
						author: "aralids",
						url: "www.github.com/aralids",
					});
				});

				it("one of those can be liked", function () {
					cy.contains("second blog").find("button").click();
					cy.contains("likes")
						.invoke("text")
						.then((text) => {
							const likesBefore = Number(text.match(/\d+/)[0]);
							cy.contains("like").click();

							cy.contains("likes")
								.invoke("text")
								.then((textAfter) => {
									const likesAfter = Number(textAfter.match(/\d+/)[0]);
									expect(likesAfter).to.eq(likesBefore + 1);
								});
						});
				});

				it("one of those can be deleted by the user who created it", function () {
					cy.contains("second blog").find("button").click();
					cy.contains("remove").click();
					cy.contains("second blog").should("not.exist");
				});

				it("a blog cannot be deleted by a user who did not created it", function () {
					cy.contains("log out").click();
					cy.login({ username: "dsarach", password: "diosmio" });
					cy.contains("second blog").find("button").click();
					cy.contains("remove").should("not.exist");
				});

				it("a blog cannot be deleted by a user who did not created it", function () {
					cy.contains("first blog").find("button").click();
					cy.contains("like").click();
					cy.wait(500);
					cy.contains("like").click();
					cy.wait(500);
					cy.contains("like").click();
					cy.wait(500);
					cy.contains("third blog").find("button").click();
					cy.contains("like").click();
					cy.wait(500);
					cy.contains("like").click();
					cy.wait(500);
					cy.get(".blog").eq(0).should("contain", "second blog");
					cy.get(".blog").eq(1).should("contain", "third blog");
					cy.get(".blog").eq(2).should("contain", "first blog");
				});
			});
		});
	});
});
