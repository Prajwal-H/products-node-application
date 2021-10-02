require("dotenv").config();
const { app } = require("./src/app");
var http = require("http").createServer(app);
//express server init

http.listen(process.env.PORT, () => {
	console.log(`Development App running on port ` + process.env.PORT + `!`);
});
