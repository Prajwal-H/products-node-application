const categoryModel = require("../models/Category.Model");

//#region get category controller for lisitng all category
const list_categories = function (req, res) {
	const { id } = req.params;
	let sql;
	if (!id) {
		sql = "SELECT * FROM category";
	} else {
		sql = "SELECT * FROM category where id = " + id;
	}
	categoryModel
		.list(sql)
		.then((category) => {
			res.status(200).send(category);
		})
		.catch((err) => {
			res.status(400).send({
				message: err,
			});
		});
};
//#endregion

//#region create category controller for creating a category
const create_category = function (req, res) {
	const { name } = req.body;
	if (name) {
		categoryModel
			.insert(name)
			.then((inserted) => {
				if (inserted) {
					res.status(200).send({
						success: true,
						message: "Successfully created a category",
					});
				}
			})
			.catch((err) => {
				res.status(400).send({
					message: err,
				});
			});
	} else {
		res.status(400).send({
			message: "Name should be given",
		});
	}
};
//#endregion

//#region update category controller for updating a category
const update_category = function (req, res) {
	const { name } = req.body;
	let categoryUpdateValues = {};
	categoryUpdateValues["name"] = name;
	categoryModel
		.update(categoryUpdateValues, req.params.id)
		.then((updated) => {
			if (updated) {
				categoryModel
					.list(req.params.id)
					.then((category) => {
						res.status(200).send({
							success: true,
							message: "Successfully updated a category",
							updated_category: category[0],
						});
					})
					.catch((err) => {
						res.status(400).send({
							message: err,
						});
					});
			} else {
				res.status(200).send({
					success: false,
					message: "Updating a category failed",
				});
			}
		})
		.catch((err) => {
			res.status(400).send({
				message: err,
			});
		});
};
//#endregion

//#region delete category controller for deleting a category
const delete_category = function (req, res) {
	categoryModel
		.remove(req.params.id)
		.then((removed) => {
			if (removed) {
				res.status(200).send({
					success: true,
					message: "Successfully deleted a category",
				});
			}
		})
		.catch((err) => {
			res.status(400).send({
				message: err,
			});
		});
};
//#endregion

module.exports = { list_categories, create_category, update_category, delete_category };
