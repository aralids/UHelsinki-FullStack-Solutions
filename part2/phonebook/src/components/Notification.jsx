const Notification = ({ message, color }) => {
	if (message === null) {
		return null;
	}

	return (
		<div style={{ color: color }} className="error">
			{message}
		</div>
	);
};

export default Notification;
