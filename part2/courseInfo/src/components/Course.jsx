const Header = ({ courseName }) => {
	return <h1>{courseName}</h1>;
};

const Total = ({ sumOfExercises }) => {
	return <p>Number of exercises {sumOfExercises}</p>;
};

const Part = ({ name, exercises }) => {
	return (
		<p>
			{name} {exercises}
		</p>
	);
};

const Content = ({ parts }) => {
	return (
		<div>
			{...parts.map((part) => (
				<Part name={part.name} exercises={part.exercises} />
			))}
		</div>
	);
};

const Course = ({ course }) => {
	return (
		<>
			<Header courseName={course.name} />
			<Content parts={course.parts} />
			<Total
				sumOfExercises={course.parts.reduce(
					(acc, part) => acc + part.exercises,
					0
				)}
			/>
		</>
	);
};

export default Course;
