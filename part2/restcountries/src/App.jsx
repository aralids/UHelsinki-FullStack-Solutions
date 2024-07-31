import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import axios, { all } from "axios";

function App() {
	const [query, setQuery] = useState("");
	const [allCountries, setAllCountries] = useState([]);
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		axios
			.get("https://studies.cs.helsinki.fi/restcountries/api/all")
			.then((response) => {
				setAllCountries(response.data);
				setCountries(response.data);
			});
	}, []);

	const handleQueryChange = (event) => {
		setQuery(event.target.value);
		setCountries(
			allCountries.filter((country) =>
				country["name"]["common"]
					.toUpperCase()
					.startsWith(event.target.value.toUpperCase())
			)
		);
	};

	const handleShowClick = (newQuery) => {
		setQuery(newQuery);
		setCountries(
			allCountries.filter((country) =>
				country["name"]["common"]
					.toUpperCase()
					.startsWith(newQuery.toUpperCase())
			)
		);
	};

	return (
		<>
			<div>
				countries: <input value={query} onChange={handleQueryChange} />
			</div>
			<CountryList countries={countries} handleShowClick={handleShowClick} />
		</>
	);
}

export default App;
