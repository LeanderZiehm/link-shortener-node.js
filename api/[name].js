import { connectToDatabase } from './mongo';

export default async function handler(req, res) {
  const { name } = req.query; // Capture the dynamic part of the URL (slug)

  console.log(`Received request for shortened URL: /${name}`);

  if (!name) {
    console.error('Error: No slug provided');
    return res.status(400).json({ error: 'No slug provided' });
  }

  try {
    // Connect to the database
    const db = await connectToDatabase();

    // Log successful DB connection
    console.log('Database connection successful.');

    // Query the database for the shortened URL using the slug
    const link = await db.collection('links').findOne({ slug: name });

    if (!link) {
      console.warn(`Warning: No link found for slug: ${name}`);
      return res.status(404).json({ error: 'Shortened URL not found' });
    }

    // Log the found link
    console.log(`Redirecting to: ${link.url}`);

    // Redirect to the original URL
    res.redirect(link.url);
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
