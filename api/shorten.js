import { connectToDatabase } from '../../lib/mongo';

export default async function handler(req, res) {
  const { url, name } = req.query;
  if (!url || !name) return res.status(400).json({ error: 'Missing params' });

  const db = await connectToDatabase();
  const exists = await db.collection('links').findOne({ slug: name });

  if (exists) return res.status(409).json({ error: 'Slug already taken' });

  await db.collection('links').insertOne({ slug: name, url });

  res.status(200).json({ shortUrl: `${req.headers.host}/${name}` });
}
