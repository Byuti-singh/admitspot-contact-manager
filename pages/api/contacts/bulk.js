import auth from '../../../middlewares/auth';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { addContact } from '../../../models/contact';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  auth(req, res, () => {
    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(500).json({ message: 'File upload error' });

      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const contact of results) {
            await addContact({ ...contact, userId: req.user.id });
          }
          res.status(200).json({ message: 'Bulk upload successful' });
        });
    });
  });
}
