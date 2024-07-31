import { useEffect, useState } from "react";
import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY;

const CountryList = ({ countries, handleShowClick }) => {
	console.log(countries);
	if (countries.length > 10) {
		return <p>Too many matches, specify your query.</p>;
	} else if (countries.length > 1) {
		return (
			<div style={{ display: "block", paddingTop: "2vh" }}>
				{...countries.map((country) => (
					<div>
						<p style={{ display: "inline" }}>{country["name"]["common"]}</p>
						<button
							style={{ display: "inline" }}
							onClick={() => handleShowClick(country["name"]["common"])}
						>
							show
						</button>
					</div>
				))}
			</div>
		);
	} else if (countries.length === 1) {
		const [weatherReport, setWeatherReport] = useState(null);
		useEffect(() => {
			axios
				.get(
					`https://api.openweathermap.org/data/2.5/weather?q=${countries[0]["capital"]}&APPID=${api_key}`
				)
				.then((response) => {
					console.log(response.data);
					setWeatherReport(response.data);
				});
		}, []);

		if (!weatherReport) {
			return <></>;
		}
		return (
			<>
				<h1>{countries[0]["name"]["common"]}</h1>
				<p>capital(s): {countries[0]["capital"].join(", ")}</p>
				<p>area: {countries[0]["area"]}</p>
				<p>
					<b>languages: </b>
				</p>
				<ul>
					{...Object.values(countries[0]["languages"]).map((lang) => (
						<li>{lang}</li>
					))}
				</ul>
				<img
					src={countries[0]["flags"]["png"]}
					style={{ border: "2px solid lightgrey" }}
				></img>
				<p>Temperature: {weatherReport["main"]["temp"]} Kelvin</p>
				<img
					src={`https://openweathermap.org/img/wn/${weatherReport["weather"][0]["icon"]}.png`}
				></img>
				<p>Wind: {weatherReport["wind"]["speed"]}m/s</p>
			</>
		);
	} else {
		return <p>No matches.</p>;
	}
};

export default CountryList;
