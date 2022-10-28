import axios from 'axios';

export const getPaths = async () => {
  const { data }: { data: Record<string, string[][]> } = await axios.get(
    `${process.env.API_ENDPOINT}/api/v1/admin/build/paths`,
    {
      headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
    }
  );
  return data;
};
