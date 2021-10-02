const connection = require("../constants/Connection");

//#region category model to list all category or specific category with id
const list = async function (sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (error, getAllCategories) {
			if (error) {
				return reject(error);
			} else {
				resolve(getAllCategories);
			}
		});
	});
};
//#endregion

//#region category model to create a category
const insert = async function (name) {
	let sql = `INSERT INTO category (name) VALUES (?)`;
	return new Promise((resolve, reject) => {
		connection.query(sql, [name], function (error, insertResults) {
			if (error) {
				return reject(error);
			} else {
				if (insertResults.affectedRows === 1) {
					resolve(true);
				}
			}
		});
	});
};
//#endregion

//#region category model to update a category
const update = async function (updateJson, id) {
	let sql = "UPDATE category SET ? WHERE id = " + id;
	return new Promise((resolve, reject) => {
		connection.query(sql, updateJson, function (error, updateResults) {
			if (error) {
				return reject(error);
			} else {
				if (updateResults.affectedRows === 1) {
					resolve(true);
				}
			}
		});
	});
};
//#endregion

//#region category model to deleting a category
const remove = async function (id) {
	let sql = "DELETE FROM category WHERE id = ?";
	return new Promise((resolve, reject) => {
		connection.query(sql, [id], function (error, deleteResults) {
			if (error) {
				return reject(error);
			} else {
				if (deleteResults.affectedRows === 1) {
					resolve(true);
				}
			}
		});
	});
};
//#endregion

module.exports = { list, insert, update, remove };
