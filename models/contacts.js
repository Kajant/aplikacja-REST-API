const fs = require("fs/promises");
const generateUniqueId = require('generate-unique-id')
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  }
  catch (error) {
      console.log('error');
  }
};

const getContactById = async (contactId) => {
  try {
      const contacts = await listContacts();
      const contact = contacts.find(item => item.id === contactId);
      return contact;
  }
  catch (error) {
      console.log('error');
  }
};

const removeContact = async (contactId) => {
  try {
      const contacts = await listContacts();
      const index = contacts.findIndex(item => item.id === contactId);
      if (index === -1) {
          return false;
      }
      const result = contacts.splice(index, 1);
      await fs.writeFile(contactsPath, JSON.stringify(contacts));
      return result;
  }
  catch {
      console.log('error');
  }
}

const addContact = async (body) => {
  try {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const newContact = { 
      id: generateUniqueId(),
      name,
      email,
      phone,
      };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
  }
  catch {
      console.log('error');
  }
}

const updateContact = async (contactId, body) => {
  try{
      const contacts = await listContacts();
      const { name, email, phone } = body;
      const [contact] = contacts.filter(contact => contact.id === contactId);
         contact.name = name
         contact.email = email
         contact.phone = phone
         await fs.writeFile(contactsPath, JSON.stringify(contacts));
         return contact;
} catch (error) {
  return false;
}
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};