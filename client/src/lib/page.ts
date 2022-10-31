import axios from 'axios';

export const getPage = async (site: string, path: string) => {
  const { data, status } = await axios.get(`${process.env.API_ENDPOINT}/api/v1/admin/build/static-props`, {
    headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
    data: {
      subdomain: site,
      path,
    },
  });
  return { data, status };
};
