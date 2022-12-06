import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, urlPath } = req.body;
  if (secret !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ revalidated: false, error: 'Invalid token' });
  }

  if (!urlPath) {
    return res.status(400).json({ revalidated: false, error: 'No path provided' });
  }

  try {
    await res.revalidate(urlPath);
    return res.json({ revalidated: true });
  } catch (error) {
    return res.status(500).json({ revalidated: false, error });
  }
}
