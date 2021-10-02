const tagsModel = require("../models/Tags.Model");

//#region get tags controller for lisitng all tags
const list_tags = function (req, res) {
	const { id } = req.params;
	let sql;
	if (!id) {
		sql = "SELECT * FROM tag";
	} else {
		sql = "SELECT * FROM tag where id = " + id;
	}
	tagsModel
		.list(sql)
		.then((tags) => {
			res.status(200).send(tags);
		})
		.catch((err) => {
			res.status(400).send({
				message: err,
			});
		});
};
//#endregion

//#region create tags controller for creating a tags
const create_tags = function (req, res) {
	const { name } = req.body;
	if (name) {
		tagsModel
			.insert(name)
			.then((inserted) => {
				if (inserted) {
					res.status(200).send({
						success: true,
						message: "Successfully created a tags",
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

//#region update tags controller for updating a tags
const update_tags = function (req, res) {
	const { name } = req.body;
	let tagsUpdateValues = {};
	tagsUpdateValues["name"] = name;
	tagsModel
		.update(tagsUpdateValues, req.params.id)
		.then((updated) => {
			if (updated) {
				tagsModel
					.list(req.params.id)
					.then((tags) => {
						res.status(200).send({
							success: true,
							message: "Successfully updated a tags",
							updated_tags: tags[0],
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
					message: "Updating a tags failed",
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

//#region delete tags controller for deleting a tags
const delete_tags = function (req, res) {
	tagsModel
		.remove(req.params.id)
		.then((removed) => {
			if (removed) {
				res.status(200).send({
					success: true,
					message: "Successfully deleted a tags",
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

module.exports = { list_tags, create_tags, update_tags, delete_tags };
