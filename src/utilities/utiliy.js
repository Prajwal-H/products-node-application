const CryptoJS = require("crypto-js");

exports.encryptMessage = function (messageToencrypt = "", secretkey = "") {
	var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
	return encryptedMessage.toString();
};

exports.decryptMessage = function (encryptedMessage = "", secretkey = "") {
	var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
	var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
	return decryptedMessage;
};
