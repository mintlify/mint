import { withSentry } from '@sentry/nextjs';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { jsonSyntaxHighlight } from './utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, method, body, params, headers } = req.body;
  try {
    const response = await axios({
      url,
      method,
      params,
      data: body,
      headers,
    });

    res.send({
      response: response.data,
      highlightedJson: jsonSyntaxHighlight(response.data),
    });
  } catch (error: any) {
    const response = error.response;
    res.send({
      response: response?.data,
      highlightedJson: jsonSyntaxHighlight(response?.data),
    });
  }
}

export default withSentry(handler);
