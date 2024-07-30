const SearchSection = ({ filter, handleFilterChange }) => {
	return (
		<>
			<h2>Search</h2>
			<div>
				filter: <input value={filter} onChange={handleFilterChange} />
			</div>
		</>
	);
};

export default SearchSection;
