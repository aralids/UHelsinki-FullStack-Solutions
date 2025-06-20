const app = require("./app.cjs");

const logger = require("./utils/logger.cjs");
const config = require("./utils/config.cjs");

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
