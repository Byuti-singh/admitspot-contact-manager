import auth from '../../../middlewares/auth';
import { addContact, getContacts, updateContact, deleteContact } from '../../../models/contact';
import { contactSchema } from '../../../schemas/contactSchema';
import { validate } from '../../../utils/validation';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    auth(req, res, async () => {
      const { name, email, phone, address, timezone } = req.body;
      const { error } = validate(contactSchema, { name, email, phone, address, timezone });
      if (error) return res.status(400).json({ error: error.details });
      const contact = await addContact({ ...req.body, userId: req.user.id });
      return res.status(201).json(contact.rows[0]);
    });
  } else if (req.method === 'GET') {
    auth(req, res, async () => {
      const filters = req.query;
      const contacts = await getContacts(req.user.id, filters);
      res.status(200).json(contacts.rows);
    });
  } else if (req.method === 'PUT') {
    auth(req, res, async () => {
      const query = req.query;
      const idString = query.id;
      const id = parseInt(idString);
      const { name, email, phone, address, timezone } = req.body;
      const { error } = validate(contactSchema, { name, email, phone, address, timezone });
      if (error) return res.status(400).json({ error: error.details });
      const contacts = await updateContact({ ...req.body, id });
      if (contacts.rowCount === 0) {
        res.status(404).json({error: 'Contact not found'});
      } else {
      res.status(200).json(contacts.rows[0]);
      }
    });
  }  else if (req.method === 'DELETE') {
    auth(req, res, async () => {
      const query = req.query;
      const idString = query.id;
      const id = parseInt(idString);
      const { name, email, phone, address, timezone } = req.body;
      const { error } = validate(contactSchema, { name, email, phone, address, timezone });
      if (error) return res.status(400).json({ error: error.details });
      const contacts = await deleteContact({ ...req.body, id });
      if (contacts.rowCount === 0) {
        res.status(404).json({error: 'Contact not found'});
      } else {
      res.status(200).json({message: 'Contact soft deleted.'});
      }
    });
  }
}
