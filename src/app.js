require("dotenv").config();
const express = require("express");
let session = require("express-session");
const cors = require("cors");
let bodyParser = require("body-parser");
const formData = require("express-form-data");
const productsRouter = require("./routes/Products.Router");
const categoriesRouter = require("./routes/Category.Router");
const tagsRouter = require("./routes/Tags.Router");

//Express app
const app = express();

app.engine("html", require("ejs").renderFile);

//#region app initialization to use cors to solve cors issue and accept all kind of request body
let corsOptions = {
	origin: ["http://localhost:3000"],
	optionsSuccessStatus: 200, // For legacy browser support
	methods: "GET, PUT, POST, PATCH, DELETE",
};

app.use(cors(corsOptions));

app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(express.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(formData.parse());
//#endregion

app.get("/", function (req, res) {
	res.send("<h1 style='text-align:center;'>Node App for products is working !! &#128521</h1>");
});

app.use("/api/v1/products", productsRouter);

app.use("/api/v1/categories", categoriesRouter);

app.use("/api/v1/tags", tagsRouter);

module.exports = { app };
