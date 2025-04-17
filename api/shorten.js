import { connectToDatabase } from './mongo'; 

export default async function handler(req, res) {
  const { url, name } = req.query;

  console.log("Received URL:", url);
  console.log("Received alias:", name);

  if (!url || !name) {
    console.log("Missing URL or name parameters");
    return res.status(400).json({ error: 'Missing url or name parameters' });
  }

  // Basic URL validation
  try {
    new URL(url); // Check if the URL is valid
  } catch (error) {
    console.log("Invalid URL:", url);
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const db = await connectToDatabase();
  const exists = await db.collection('links').findOne({ slug: name });

  if (exists) {
    console.log("Alias already exists:", name);
    return res.status(409).json({ error: 'Slug already taken' });
  }

  await db.collection('links').insertOne({ slug: name, url });
  const shortUrl = `${req.headers.host}/${name}`;

  console.log("Shortened URL created:", shortUrl);
  return res.status(200).json({ shortUrl });
}
