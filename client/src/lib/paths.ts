import axios from 'axios';

const REQUEST_ADMIN_OPTIONS = {
  headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const checkGetPathsStatus = async (id: string): Promise<any> => {
  const status = await axios.get(
    `${process.env.API_ENDPOINT}/api/v1/admin/build/get-paths/${id}`,
    REQUEST_ADMIN_OPTIONS
  );
  return status.data;
};

const THREE_MINUTES_IN_MS = 1000 * 60 * 3;

export const monitorGetPathsStatus = async (id: string) => {
  let workerStatus = null;
  let millisecondsPassed = 0;
  const intervalMs = 100;

  while (workerStatus == null && millisecondsPassed < THREE_MINUTES_IN_MS) {
    const status = await checkGetPathsStatus(id);
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

export const getPaths = async () => {
  const {
    data: { id },
  }: { data: { id: string } } = await axios.get(
    `${process.env.API_ENDPOINT}/api/v1/admin/build/paths`,
    REQUEST_ADMIN_OPTIONS
  );
  const paths = await monitorGetPathsStatus(id);

  return paths;
};
