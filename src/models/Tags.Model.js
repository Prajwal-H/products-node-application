const connection = require("../constants/Connection");

//#region tags model to list all tags or specific tags with id
const list = async function (sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (error, getAllTags) {
			if (error) {
				return reject(error);
			} else {
				resolve(getAllTags);
			}
		});
	});
};
//#endregion

//#region tags model to create a tags
const insert = async function (name) {
	let sql = `INSERT INTO tag (name) VALUES (?)`;
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

//#region tags model to update a tags
const update = async function (updateJson, id) {
	let sql = "UPDATE tag SET ? WHERE id = " + id;
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

//#region tags model to deleting a tags
const remove = async function (id) {
	let sql = "DELETE FROM tag WHERE id = ?";
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
