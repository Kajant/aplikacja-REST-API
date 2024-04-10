const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");


const Joi = require("joi");

const schemaAdd = Joi.object({
      name: Joi.string().alphanum().min(1).max(44).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      phone: Joi.string().alphanum().min(8).max(16).required(),
      });
const schemaUpdate = Joi.object({
      name: Joi.string().alphanum().min(1).max(44),
      email: Joi.string().email({ minDomainSegments: 2 }),
      phone: Joi.string().alphanum().min(8).max(16),
      });


router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const body = schemaAdd.validate(req.body);
  const { name, email, phone } = body.value;
  if (body.error) {
    return res.status(400).json({ message: `Field ${body.error.message}`});
  }
  try {
    const newContact = {name, email, phone};
    await addContact(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const deleted = await removeContact(id);
    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
}); 

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const body = schemaUpdate.validate(req.body);
  if (body.error) {
    return res.status(400).json({ message: `Field ${body.error.message}` });
  }
  try {
    const updatedContact = await updateContact(id, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;