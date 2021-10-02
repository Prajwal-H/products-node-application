const connection = require("../constants/Connection");

//#region product model to list all product or specific product with id
const list = async function (sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (error, getAllProducts) {
			if (error) {
				return reject(error);
			} else {
				resolve(getAllProducts);
			}
		});
	});
};
//#endregion

//#region product model to create a product
const insert = async function (name, categry, tag, otherDetailsJson) {
	let sql = `INSERT INTO products (name,category,tags,other_details) VALUES (?,?,?,?)`;
	return new Promise((resolve, reject) => {
		connection.query(sql, [name, categry, tag, otherDetailsJson], function (error, insertResults) {
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

//#region product model to update a product
const update = async function (updateJson, id) {
	let sql = "UPDATE products SET ? WHERE id = " + id;
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

//#region product model to deleting a product
const remove = async function (id) {
	let sql = "DELETE FROM products WHERE id = ?";
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
