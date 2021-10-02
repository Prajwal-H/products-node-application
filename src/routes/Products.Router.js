var express = require("express");
var router = express.Router();
const peopleController = require("../controllers/Products.Controller");

//#region route to get all people and id specific people
router.get("/:id?", peopleController.list_people);
//#endregion

//#region route to get all people and id specific people
router.get("/user/:userId/:id?", peopleController.list_people);
//#endregion

//#region route to get all people and id specific people
router.get("/favorites/user/:userId", peopleController.list_user_favorites);
//#endregion

//#region route to get all people and id specific people
router.get("/notes/user/:userId", peopleController.list_user_notes);
//#endregion

//#region route to create a people
router.post("/", peopleController.create_people);
//#endregion

//#region route to create a people
router.post("/activate/:id", peopleController.activate_user);
//#endregion

//#region route to update a specific people
router.put("/:id", peopleController.update_people);
//#endregion

//#region route to favorite or unfavorite a specific people
router.post("/unsync-calendar/:id", peopleController.unsyncCalendar);
//#endregion

//#region route to favorite or unfavorite a specific people
router.post("/block-calendar/:id", peopleController.block_time);
//#endregion

//#region route to delete a specific people
router.delete("/:id", peopleController.delete_people);
//#endregion

module.exports = router;
