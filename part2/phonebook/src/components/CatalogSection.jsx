const CatalogSection = ({ content, handleClick }) => {
	return (
		<>
			<h2>Catalog</h2>
			<div>
				{...content.map((person) => (
					<div style={{ display: "block" }}>
						<p style={{ display: "inline" }}>
							{person.name}, {person.number}
						</p>
						<button onClick={() => handleClick(person.id)}>delete</button>
					</div>
				))}
			</div>
		</>
	);
};

export default CatalogSection;
