import axios from 'axios';

export const getPage = async (subdomain: string, path: string) => {
  try {
    const { data, status } = await axios.post(
      `${process.env.API_ENDPOINT}/api/v2/internal/deployment/${subdomain}/static-props`,
      {
        path,
        basePath: process.env.BASE_PATH,
      },
      { headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` } }
    );
    return { data, status };
  } catch (err: any) {
    const {
      response: { data, status },
    }: { response: { data: any; status: number } } = err;
    return {
      data,
      status,
    };
  }
};
