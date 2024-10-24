import auth from '../../../middlewares/auth';
import { addContact, getContacts } from '../../../models/contact';
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
  }
}
