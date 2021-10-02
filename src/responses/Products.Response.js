//#region To genarate the response to be sent to user
exports.product_response = function (people) {
  let peopleResponseJson = {};
  peopleResponseJson["id"] = people.id;
  return peopleResponseJson;
};
//#endregion
