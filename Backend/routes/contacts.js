const express = require("express");
const router = express.Router();
const contactController = require("../controller/contact");
const { validateToken } = require("../middlewares/auth");

router.post("/find-contact", validateToken, contactController.findContact);
router.post("/add-contact/:contactUserId", validateToken, contactController.addContacts);
router.get("/all-contacts", validateToken, contactController.getAllContacts);

module.exports = router;
