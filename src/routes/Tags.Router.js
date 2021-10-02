var express = require("express");
var router = express.Router();
const tagsController = require("../controllers/Tags.Controller");

//#region route to get all tags and id specific tags
router.get("/:id?", tagsController.list_tags);
//#endregion

//#region route to create a tags
router.post("/", tagsController.create_tags);
//#endregion

//#region route to update a specific tags
router.put("/:id", tagsController.update_tags);
//#endregion

//#region route to delete a specific tags
router.delete("/:id", tagsController.delete_tags);
//#endregion

module.exports = router;
