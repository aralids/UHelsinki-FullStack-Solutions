const Notification = ({ message, status }) => {
	if (!message || !status) {
		return <></>;
	}
	return (
		<div
			style={{
				backgroundColor: "lightgrey",
				borderRadius: "5px",
				border: status === "success" ? "3px solid green" : "3px solid red",
				padding: "10px",
			}}
		>
			<p
				className="error"
				style={{
					fontSize: "20px",
					color: status === "success" ? "green" : "red",
				}}
			>
				{message}
			</p>
		</div>
	);
};

export default Notification;
