const API_ENDPOINT = process.env.API_ENDPOINT;

export const getPaths = async () => {
  const res = await fetch(`${API_ENDPOINT}/api/v1/admin/build/paths`, {
    headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
  });
  const data = res.json();
  return data;
};
