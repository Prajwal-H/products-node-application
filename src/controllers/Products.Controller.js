const productsModel = require("../models/Products.Model");
const { product_response } = require("../responses/Products.Response");

//#region get people controller for lisitng all people
exports.list_people = function (req, res) {
	const { type, member_type, search, include, exclude, page, per_page } = req.query;
	const { id, userId } = req.params;
	let sql;
	if (userId) {
		sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,b.id as memberTypeId,
		b.name AS memberType,IF(c.leader_id IS NULL, FALSE, TRUE) AS following,IF(d.leader_id IS NULL, NULL, d.notes) AS notes,GROUP_CONCAT(DISTINCT e.id,'>>>',e.name) as interest,
		GROUP_CONCAT(DISTINCT f.id,'>>>',f.name) as industries FROM people a LEFT JOIN member_type b ON (a.member_type = b.id)
		LEFT JOIN people_follow c ON (c.leader_id = a.wordpress_id AND c.follower_id = ${userId}) LEFT JOIN people_notes d ON (d.leader_id = a.wordpress_id AND d.noter_id =${userId})
		LEFT JOIN interests e ON FIND_IN_SET(e.id, REPLACE(REPLACE(REPLACE(JSON_EXTRACT(a.other_details,'$.interests'),'"',''),'[',''),']',''))
		LEFT JOIN industries f ON FIND_IN_SET(f.id,REPLACE(JSON_EXTRACT(a.other_details,'$.industry'),'"',''))`;
	} else {
		sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,b.id as memberTypeId,
		b.name AS memberType,GROUP_CONCAT(DISTINCT e.id,'>>>',e.name) as interest,GROUP_CONCAT(DISTINCT f.id,'>>>',f.name) as industries FROM people a LEFT JOIN member_type b ON (a.member_type = b.id)
		LEFT JOIN interests e ON FIND_IN_SET(e.id, REPLACE(REPLACE(REPLACE(JSON_EXTRACT(a.other_details,'$.interests'),'"',''),'[',''),']',''))
		LEFT JOIN industries f ON FIND_IN_SET(f.id,REPLACE(JSON_EXTRACT(a.other_details,'$.industry'),'"','')) `;
	}
	if (!id) {
		let addSql = `where`;
		if (member_type) {
			if (addSql === "where") {
				addSql += ` a.member_type IN(${member_type})`;
			} else {
				addSql += ` AND a.member_type IN(${member_type})`;
			}
		}
		if (search) {
			if (addSql === "where") {
				addSql += ` (a.first_name LIKE '%${search}%' OR a.last_name LIKE '%${search}%')`;
			} else {
				addSql += ` AND (a.first_name LIKE '%${search}%' OR a.last_name LIKE '%${search}%')`;
			}
		}
		if (include) {
			if (addSql === "where") {
				addSql += ` a.wordpress_id IN(${include})`;
			} else {
				addSql += ` AND a.wordpress_id IN(${include})`;
			}
		}
		if (exclude) {
			if (addSql === "where") {
				addSql += ` a.wordpress_id NOT IN(${exclude})`;
			} else {
				addSql += ` AND a.wordpress_id NOT IN(${exclude})`;
			}
		}
		if (addSql !== "where") {
			sql += addSql;
			sql += " AND a.active = 1";
		} else {
			sql += " WHERE a.active = 1 ";
		}
		sql += " GROUP BY a.wordpress_id";
		if (type) {
			if (type === "asc") {
				sql += ` ORDER BY a.first_name ASC,a.last_name ASC`;
			} else if (type === "desc") {
				sql += ` ORDER BY a.first_name DESC,a.last_name DESC`;
			}
		} else {
			sql += ` ORDER BY a.wordpress_id ASC`;
		}
		if (page && per_page) {
			offset = parseInt(page);
			limitCount = parseInt(per_page);
			limitCount = limitCount ? limitCount : 20;
			offset = offset ? (offset !== 1 ? (offset - 1) * limitCount : offset - 1) : 0;
			sql += ` LIMIT ${offset + `,` + limitCount}`;
		}
	} else {
		sql += ` WHERE wordpress_id = ` + id;
	}
	productsModel
		.list(sql)
		.then((people) => {
			let result = [];
			if (id) {
				res.status(200).send(product_response(people[0]));
			} else {
				people.forEach((member) => {
					result.push(product_response(member));
				});
				res.status(200).send(result);
			}
		})
		.catch((err) => {
			res.status(400).send({
				message: err,
			});
		});
};
//#endregion

//#region controller for listing all the user favorites
exports.list_user_favorites = function (req, res) {
	const { page, per_page } = req.query;
	const { userId } = req.params;
	if (userId) {
		let sql;
		sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,
		b.id as memberTypeId,b.name AS memberType,IF(c.leader_id IS NULL, FALSE, TRUE) AS following,IF(d.leader_id IS NULL, NULL, d.notes) AS notes FROM people a
		LEFT JOIN member_type b ON (a.member_type = b.id) LEFT JOIN people_follow c ON (c.leader_id = a.wordpress_id AND c.follower_id = ${userId}) 
		LEFT JOIN people_notes d ON (d.leader_id = a.wordpress_id AND d.noter_id = ${userId})  WHERE c.follower_id = ${userId} AND a.active = 1 ORDER BY a.first_name ASC,a.last_name ASC`;
		if (page && per_page) {
			offset = parseInt(page);
			limitCount = parseInt(per_page);
			limitCount = limitCount ? limitCount : 10;
			offset = offset ? (offset !== 1 ? (offset - 1) * limitCount + 1 : offset - 1) : 0;
			sql += ` LIMIT ${offset + `,` + limitCount}`;
		}
		productsModel
			.list(sql)
			.then((people) => {
				let result = [];
				people.forEach((member) => {
					result.push(product_response(member));
				});
				res.status(200).send(result);
			})
			.catch((err) => {
				res.status(400).send({
					message: err,
				});
			});
	} else {
		res.status(400).send({
			message: "User Id missing for getting favorites",
		});
	}
};
//#endregion

//#region controller for listing all the user notes
exports.list_user_notes = function (req, res) {
	const { page, per_page } = req.query;
	const { userId } = req.params;
	if (userId) {
		let sql;
		sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,
		b.id as memberTypeId,b.name AS memberType,IF(c.leader_id IS NULL, FALSE, TRUE) AS following,IF(d.leader_id IS NULL, NULL, d.notes) AS notes FROM people a
		LEFT JOIN member_type b ON (a.member_type = b.id) LEFT JOIN people_follow c ON (c.leader_id = a.wordpress_id AND c.follower_id = ${userId}) 
		LEFT JOIN people_notes d ON (d.leader_id = a.wordpress_id AND d.noter_id = ${userId})  WHERE d.noter_id = ${userId} AND a.active = 1 ORDER BY a.first_name ASC,a.last_name ASC`;
		if (page && per_page) {
			offset = parseInt(page);
			limitCount = parseInt(per_page);
			limitCount = limitCount ? limitCount : 10;
			offset = offset ? (offset !== 1 ? (offset - 1) * limitCount + 1 : offset - 1) : 0;
			sql += ` LIMIT ${offset + `,` + limitCount}`;
		}
		productsModel
			.list(sql)
			.then((people) => {
				let result = [];
				people.forEach((member) => {
					result.push(product_response(member));
				});
				res.status(200).send(result);
			})
			.catch((err) => {
				res.status(400).send({
					message: err,
				});
			});
	} else {
		res.status(400).send({
			message: "User Id missing for getting notes",
		});
	}
};
//#endregion

//#region create people controller for creating a people
exports.create_people = function (req, res) {
	const { wpId, firstName, lastName, profile, email, mobile, type, designation, company, industry, linkedIn, aboutMe, interests, gender, country } = req.body;
	if (wpId && firstName && lastName && email && mobile) {
		let calendarJson = { calType: "Select Your Calendar", token: "N/A", calId: "N/A" };
		let otherDetailsJson = { designation: "N/A", company: "N/A", industry: "N/A", linkedIn: "N/A", about: "N/A", interests: "[]", gender: "N/A", country: "N/A" };
		let profilePhoto = profile ? profile : "N/A";
		let memberType = type ? type : 1;
		if (designation) {
			otherDetailsJson["designation"] = designation;
		}
		if (company) {
			otherDetailsJson["company"] = company;
		}
		if (industry) {
			otherDetailsJson["industry"] = industry;
		}
		if (linkedIn) {
			otherDetailsJson["linkedIn"] = linkedIn;
		}
		if (aboutMe) {
			otherDetailsJson["about"] = aboutMe;
		}
		if (interests) {
			otherDetailsJson["interests"] = interests;
		}
		if (gender) {
			otherDetailsJson["gender"] = gender;
		}
		if (country) {
			otherDetailsJson["country"] = country;
		}
		productsModel
			.insert(wpId, firstName, lastName, profilePhoto, email, mobile, memberType, JSON.stringify(otherDetailsJson), JSON.stringify(calendarJson))
			.then((inserted) => {
				if (inserted) {
					res.status(200).send({
						success: true,
						message: "Successfully created a People",
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
			message: "All parameters are required",
		});
	}
};
//#endregion

//#region update people controller for updating a people
exports.update_people = function (req, res) {
	const { firstName, lastName, profile, email, mobile, type, designation, company, industry, linkedIn, aboutMe, interests, calendar, gender, country } = req.body;
	let sql = "SELECT * FROM people WHERE wordpress_id = " + req.params.id;
	productsModel
		.list(sql)
		.then((people) => {
			let peopleUpdateValues = {};
			let otherDetailsJson = JSON.parse(people[0].other_details);
			let calendarJson = JSON.parse(people[0].calendar_details);
			if (firstName) {
				peopleUpdateValues["first_name"] = firstName;
			}
			if (lastName) {
				peopleUpdateValues["last_name"] = lastName;
			}
			if (profile) {
				peopleUpdateValues["profile_photo"] = profile;
			}
			if (email) {
				peopleUpdateValues["mobile"] = email;
			}
			if (mobile) {
				peopleUpdateValues["email"] = mobile;
			}
			if (type) {
				peopleUpdateValues["member_type"] = type;
			}
			if (designation) {
				otherDetailsJson["designation"] = designation;
			}
			if (company) {
				otherDetailsJson["company"] = company;
			}
			if (industry) {
				otherDetailsJson["industry"] = industry;
			}
			if (linkedIn) {
				otherDetailsJson["linkedIn"] = linkedIn;
			}
			if (aboutMe) {
				otherDetailsJson["about"] = aboutMe;
			}
			if (interests) {
				otherDetailsJson["interests"] = interests;
			}
			if (gender) {
				otherDetailsJson["gender"] = gender;
			}
			if (country) {
				otherDetailsJson["country"] = country;
			}
			if (calendar) {
				if (calendar.calType) {
					calendarJson["calType"] = calendar.calType;
				}
				if (calendar.token) {
					calendarJson["token"] = calendar.token;
				}
				if (calendar.calId) {
					calendarJson["calId"] = calendar.calId;
				}
			}
			peopleUpdateValues["other_details"] = JSON.stringify(otherDetailsJson);
			peopleUpdateValues["calendar_details"] = JSON.stringify(calendarJson);
			productsModel
				.update(peopleUpdateValues, req.params.id)
				.then((updated) => {
					// let result = product_response(people);
					if (updated) {
						let sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,b.id as memberTypeId,
											b.name AS memberType,GROUP_CONCAT(DISTINCT e.id,'>>>',e.name) as interest,GROUP_CONCAT(DISTINCT f.id,'>>>',f.name) as industries FROM people a
											LEFT JOIN member_type b ON (a.member_type = b.id)
											LEFT JOIN interests e ON FIND_IN_SET(e.id, REPLACE(REPLACE(REPLACE(JSON_EXTRACT(a.other_details,'$.interests'),'"',''),'[',''),']',''))
											LEFT JOIN industries f ON FIND_IN_SET(f.id,REPLACE(JSON_EXTRACT(a.other_details,'$.industry'),'"','')) WHERE a.wordpress_id = ${req.params.id}`;
						productsModel
							.list(sql)
							.then((people) => {
								res.status(200).send({
									success: true,
									message: "Successfully updated a People",
									data: product_response(people[0]),
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
							message: "Updating a people failed",
						});
					}
				})
				.catch((err) => {
					res.status(400).send({
						message: err,
					});
				});
		})
		.catch((err) => {
			res.status(400).send({
				message: err,
			});
		});
};
//#endregion

//#region delete people controller for deleting a people
exports.block_time = function (req, res) {
	const { date, slots } = req.body;
	const { id } = req.params;
	console.log(date, slots);
	if (date && slots) {
		let sql = "SELECT * FROM people WHERE wordpress_id = " + id;
		productsModel
			.list(sql)
			.then((people) => {
				let blockTimesJson = people[0].block_times !== null ? JSON.parse(people[0].block_times) : {};
				console.log(blockTimesJson);
				blockTimesJson[date] = slots;
				let peopleUpdateValues = {};
				peopleUpdateValues["block_times"] = JSON.stringify(blockTimesJson);
				productsModel
					.update(peopleUpdateValues, id)
					.then((updated) => {
						// let result = product_response(people);
						if (updated) {
							let sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,b.id as memberTypeId,
											b.name AS memberType,GROUP_CONCAT(DISTINCT e.id,'>>>',e.name) as interest,GROUP_CONCAT(DISTINCT f.id,'>>>',f.name) as industries FROM people a
											LEFT JOIN member_type b ON (a.member_type = b.id)
											LEFT JOIN interests e ON FIND_IN_SET(e.id, REPLACE(REPLACE(REPLACE(JSON_EXTRACT(a.other_details,'$.interests'),'"',''),'[',''),']',''))
											LEFT JOIN industries f ON FIND_IN_SET(f.id,REPLACE(JSON_EXTRACT(a.other_details,'$.industry'),'"','')) WHERE a.wordpress_id = ${req.params.id}`;
							productsModel
								.list(sql)
								.then((people) => {
									res.status(200).send({
										success: true,
										message: "Successfully blocked time for a user",
										data: product_response(people[0]),
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
								message: "blocking time for a user failed",
							});
						}
					})
					.catch((err) => {
						res.status(400).send({
							message: err,
						});
					});
			})
			.catch((err) => {
				res.status(400).send({
					message: err,
				});
			});
	} else {
		res.status(400).send({
			message: "All data required",
		});
	}
};
//#endregion

//#region unsync calendar people controller for unsyncing the calendar
exports.unsyncCalendar = function (req, res) {
	let calendarJson = { calType: "Select Your Calendar", token: "N/A", calId: "N/A" };
	let peopleUpdateValues = {};
	peopleUpdateValues["calendar_details"] = JSON.stringify(calendarJson);
	productsModel
		.update(peopleUpdateValues, req.params.id)
		.then((updated) => {
			// let result = product_response(people);
			if (updated) {
				let sql = `SELECT a.id,a.wordpress_id,a.first_name,a.last_name,a.profile_photo,a.mobile,a.email,a.other_details,a.calendar_details,a.block_times,b.id as memberTypeId,
				b.name AS memberType,GROUP_CONCAT(DISTINCT e.id,'>>>',e.name) as interest,GROUP_CONCAT(DISTINCT f.id,'>>>',f.name) as industries FROM people a
				LEFT JOIN member_type b ON (a.member_type = b.id)
				LEFT JOIN interests e ON FIND_IN_SET(e.id, REPLACE(REPLACE(REPLACE(JSON_EXTRACT(a.other_details,'$.interests'),'"',''),'[',''),']',''))
				LEFT JOIN industries f ON FIND_IN_SET(f.id,REPLACE(JSON_EXTRACT(a.other_details,'$.industry'),'"','')) WHERE a.wordpress_id = ${req.params.id}`;
				productsModel
					.list(sql)
					.then((people) => {
						res.status(200).send({
							success: true,
							message: "Successfully unsynced calendar for People",
							data: product_response(people[0]),
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
					message: "Updating a people failed",
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

//#region activate user controller for activate user account
exports.activate_user = function (req, res) {
	const { id } = req.params;
	let peopleUpdateValues = {};
	peopleUpdateValues["active"] = 1;
	productsModel
		.update(peopleUpdateValues, id)
		.then((updated) => {
			// let result = product_response(people);
			if (updated) {
				res.status(200).send({
					success: true,
					message: "Successfully activated a user",
				});
			} else {
				res.status(200).send({
					success: false,
					message: "Activation failed",
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

//#region delete people controller for deleting a people
exports.delete_people = function (req, res) {
	productsModel
		.remove(req.params.id)
		.then((removed) => {
			if (removed) {
				res.status(200).send({
					success: true,
					message: "Successfully deleted a user",
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
