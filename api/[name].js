import { connectToDatabase } from '../../lib/mongo';

export default async function handler(req, res) {
  const { name } = req.query;
  const db = await connectToDatabase();
  const result = await db.collection('links').findOne({ slug: name });

  if (result) {
    res.writeHead(302, { Location: result.url });
    res.end();
  } else {
    res.status(404).send('Not found');
  }
}
