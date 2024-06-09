import { useState } from "react";

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}:</td>
			<td>{value}</td>
		</tr>
	);
};

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
	if (good === 0 && neutral === 0 && bad === 0) {
		return <p>No statistics to show yet.</p>;
	} else {
		return (
			<>
				<h2>statistics</h2>
				<table>
					<tbody>
						<StatisticLine text="good" value={good} />
						<StatisticLine text="neutral" value={neutral} />
						<StatisticLine text="bad" value={bad} />
						<StatisticLine text="all" value={total} />
						<StatisticLine text="average" value={average} />
						<StatisticLine text="positive" value={positive + "%"} />
					</tbody>
				</table>
			</>
		);
	}
};

const Button = ({ onClick, text }) => {
	return <button onClick={onClick}>{text}</button>;
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);
	const [total, setTotal] = useState(0);
	const [average, setAverage] = useState(0);
	const [positive, setPositive] = useState(0);

	const handleGood = () => {
		const newGood = good + 1;
		const newTotal = total + 1;
		setGood(newGood);
		setTotal(newTotal);
		setAverage((newGood - bad) / newTotal);
		setPositive((newGood / newTotal) * 100);
	};

	const handleNeutral = () => {
		const newTotal = total + 1;
		setNeutral(neutral + 1);
		setTotal(newTotal);
		setAverage((good - bad) / newTotal);
		setPositive((good / newTotal) * 100);
	};

	const handleBad = () => {
		const newBad = bad + 1;
		const newTotal = total + 1;
		setBad(bad + 1);
		setTotal(newTotal);
		setAverage((good - newBad) / newTotal);
		setPositive((good / newTotal) * 100);
	};

	return (
		<>
			<h2>give feedback</h2>
			<Button onClick={handleGood} text="good" />
			<Button onClick={handleNeutral} text="neutral" />
			<Button onClick={handleBad} text="bad" />
			<Statistics
				good={good}
				neutral={neutral}
				bad={bad}
				total={total}
				average={average}
				positive={positive}
			/>
		</>
	);
};

export default App;
