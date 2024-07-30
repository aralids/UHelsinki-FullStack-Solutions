const AddNewSection = ({
	addPerson,
	newName,
	handleNameChange,
	newNumber,
	handleNumberChange,
}) => {
	return (
		<>
			<h2>Add new</h2>
			<form onSubmit={addPerson}>
				<div>
					name: <input value={newName} onChange={handleNameChange} />
					<br />
					number: <input value={newNumber} onChange={handleNumberChange} />
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
		</>
	);
};

export default AddNewSection;
