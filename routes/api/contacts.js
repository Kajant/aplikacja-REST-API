const express = require("express");
const router = express.Router();
const { getListContacts, getThisContactById, addNewContact, updateThisContact, updateStatusContact, removeThisContact } = require("../../controllers/contacts");

router.get("/", getListContacts);
router.get("/:contactId", getThisContactById);
router.delete("/:contactId", removeThisContact);
router.post("/", addNewContact);
router.put("/:contactId", updateThisContact);
router.patch("/:contactId", updateStatusContact);

module.exports = router;