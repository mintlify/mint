import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, paths }: { secret: string; paths: string[] } = req.body;
  if (secret !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (!paths) {
    return res.status(400).json({ error: 'No paths provided' });
  }
  const promises: Promise<string>[] = paths.map(
    (path) =>
      new Promise(async (resolve, reject) => {
        try {
          await res.revalidate(path);
          return resolve(path);
        } catch (err: any) {
          return reject(path);
        }
      })
  );
  const response = await Promise.allSettled(promises);
  return res.json(response);
}
