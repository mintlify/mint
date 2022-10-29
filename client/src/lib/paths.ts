import axios from 'axios';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const checkWorkerStatus = async (id: string): Promise<any> => {
  const status = await axios.get(`${process.env.API_ENDPOINT}/api/v1/admin/build/cache-all/${id}`);
  return status.data;
};

const THREE_MINUTES_IN_MS = 1000 * 60 * 3;

export const monitorWorkerStatus = async (id: string) => {
  let workerStatus = null;
  let millisecondsPassed = 0;
  const intervalMs = 100;

  while (workerStatus == null && millisecondsPassed < THREE_MINUTES_IN_MS) {
    const status = await checkWorkerStatus(id);
    if (status.state === 'completed' && status.data) {
      workerStatus = status.data;
      break;
    } else if (status.state === 'failed') {
      throw new Error('Unable to generate documentation');
    }

    millisecondsPassed += intervalMs;
    await sleep(intervalMs);
  }

  return workerStatus;
};

const cacheAll = async () => {
  const {
    data: { id },
  } = await axios.post(`${process.env.API_ENDPOINT}/api/v1/admin/build/cache-all`);
  return id;
};

export const getPaths = async () => {
  const id = await cacheAll();
  await monitorWorkerStatus(id);
  const { data }: { data: Record<string, string[][]> } = await axios.get(
    `${process.env.API_ENDPOINT}/api/v1/admin/build/paths`,
    {
      headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
    }
  );
  return data;
};
