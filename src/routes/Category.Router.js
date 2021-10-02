var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/Category.Controller");

//#region route to get all categories and id specific category
router.get("/:id?", categoryController.list_categories);
//#endregion

//#region route to create a category
router.post("/", categoryController.create_category);
//#endregion

//#region route to update a specific category
router.put("/:id", categoryController.update_category);
//#endregion

//#region route to delete a specific category
router.delete("/:id", categoryController.delete_category);
//#endregion

module.exports = router;
