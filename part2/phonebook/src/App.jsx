import { useState, useEffect } from "react";
import personService from "./services/persons";

import SearchSection from "./components/SearchSection.jsx";
import AddNewSection from "./components/AddNewSection.jsx";
import CatalogSection from "./components/CatalogSection.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
	const [persons, setPersons] = useState([
		{ name: "Arto Hellas", number: "0123-4567" },
		{ name: "Dilara Sarach", number: "1234-5678" },
		{ name: "Dima Love", number: "2345-6789" },
	]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilter] = useState("");
	const [errorMessage, setErrorMessage] = useState({
		message: null,
		color: null,
	});

	useEffect(() => {
		personService.getAll().then((initialCatalog) => {
			setPersons(initialCatalog);
		});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();

		const nameExists = persons.reduce(
			(acc, person) => acc || person.name === newName,
			false
		);

		if (!nameExists) {
			const personObject = {
				name: newName,
				number: newNumber,
			};

			personService
				.create(personObject)
				.then((returnedNewPerson) => {
					setPersons(persons.concat(returnedNewPerson));
					setNewName("");
					setNewNumber("");
				})
				.then(() => {
					setErrorMessage({
						message: `${newName} was added to the phonebook.`,
						color: "green",
					});
					setTimeout(() => {
						setErrorMessage({
							message: null,
							color: null,
						});
					}, 5000);
				});
		} else {
			const person = persons.find((n) => n.name === newName);
			const changedPerson = { ...person, number: newNumber };
			if (
				window.confirm(
					`${newName} is already in the catalog. Do you want to update it?`
				)
			) {
				personService
					.update(person.id, changedPerson)
					.then((updatedPerson) => {
						setPersons(
							persons.map((person) =>
								person.id !== updatedPerson.id ? person : updatedPerson
							)
						);
					})
					.then(() => {
						setErrorMessage({
							message: `${newName}'s number was changed to ${newNumber}.`,
							color: "green",
						});
						setTimeout(() => {
							setErrorMessage({
								message: null,
								color: null,
							});
						}, 5000);
					})
					.catch(() => {
						setErrorMessage({
							message: `${newName} has already been removed from the phonebook.`,
							color: "red",
						});
						setTimeout(() => {
							setErrorMessage({
								message: null,
								color: null,
							});
						}, 5000);
					});
			}
		}
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	const handleDeleteClick = (id) => {
		if (window.confirm(`Remove ${newName} from catalog?`)) {
			personService.remove(id).then((deletedEntry) => {
				setPersons(persons.filter((person) => person.id !== deletedEntry.id));
			});
		}
	};

	let content = persons.filter((person) =>
		person.name.toUpperCase().includes(filter.toUpperCase())
	);

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification
				message={errorMessage["message"]}
				color={errorMessage["color"]}
			/>
			<SearchSection filter={filter} handleFilterChange={handleFilterChange} />
			<AddNewSection
				addPerson={addPerson}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>
			<CatalogSection content={content} handleClick={handleDeleteClick} />
		</div>
	);
};

export default App;
