import auth from '../../../middlewares/auth';
import { getContacts } from '../../../models/contact';
import { Parser } from 'json2csv';

export default async function handler(req, res) {
  auth(req, res, async () => {
    const contacts = await getContacts(req.user.id);
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(contacts.rows);

    res.setHeader('Content-Disposition', 'attachment;filename=contacts.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.status(200).send(csv);
  });
}
