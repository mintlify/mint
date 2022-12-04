import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, paths }: { secret: string; paths: string[] } = req.body;
  if (secret !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (!paths) {
    return res.status(400).json({ error: 'No paths provided' });
  }

  paths.forEach((path) => {
    axios.post(`https://${process.env.VERCEL_URL}/api/revalidate`, {
      secret: process.env.ADMIN_TOKEN,
      urlPath: path,
    });
  });

  // 202 because we guarantee we started the async process, but do not know if it worked
  return res.status(202);
}
