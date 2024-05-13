import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Stream } from 'stream';
import { getTokenxToken } from '../../../auth/getTokenXToken';
import { verifyIdportenAccessToken } from '../../../auth/verifyIdPortenToken';
import { logger, rawLogger } from '../../../utils/backendLogger';

export const config = {
  api: {
    // Fjerner bodyParser for å unngå problem med 'multipart/form-data'
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let tokenxToken = '';
  if (process.env.APP_ENV !== 'development' && process.env.APP_ENV !== 'test') {
    let idportenToken: string | undefined;
    try {
      idportenToken = req.headers.authorization?.split(' ')[1];
      await verifyIdportenAccessToken(idportenToken);
    } catch (e) {
      logger.warn('kunne ikke validere idportentoken i beskyttetApi', e);
      return res.status(401).json({ message: 'Access denied' });
    }
    if (!idportenToken) return;

    tokenxToken = await getTokenxToken(idportenToken, process.env.INNSENDING_API_AUDIENCE!);
  }

  const { all: nextPath, ...params } = req.query;

  let path = '';
  if (typeof nextPath === 'string') {
    path = nextPath;
  }

  if (typeof nextPath !== 'string' && nextPath) {
    path = nextPath.join('/');
  }

  const method = req.method as Method;

  // Removed host-header because of certification issues with node
  const { host, ...headers } = req.headers as AxiosRequestHeaders;

  await axios({
    method: method,
    url: `${process.env.REMOTE_API_URL}/${path}`,
    params: params,
    data: req, // Sender data videre som stream
    headers: {
      ...headers,
      authorization: `Bearer ${tokenxToken}`,
    },
    responseType: 'stream',
    timeout: 180000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  })
    .then((response: AxiosResponse<Stream>) => {
      for (const key in response.headers) {
        res.setHeader(key, response.headers[key]);
      }

      res.status(response.status);
      response.data.pipe(res);
    })
    .catch((error: AxiosError<Stream>) => {
      const commonErrorObject = {
        requestMethod: req.method,
        requestPath: req.url,
        userAgent: headers['user-agent'],
        referer: headers['referer'],
        headerSize: error.request?._header?.length,
        cookieSize: headers.cookie?.length, // Mistenker at cookies fra nav.no kan være uavanlig stor, i noen tilfeller
      };
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        const statusCode = error.response.status;

        let body = '';
        error.response.data.on('data', (chunk) => (body += chunk));

        error.response.data.on('end', () => {
          try {
            const logLevel = statusCode < 500 ? 'warn' : 'error';
            const data = JSON.parse(body);
            rawLogger.log(logLevel, {
              ...data,
              ...commonErrorObject,
              statusCode,
            });
          } catch (e) {
            rawLogger.error({
              ...commonErrorObject,
              apiResponse: body,
              statusCode,
              message: 'Feil format på response body. Forventer JSON',
            });
          }
        });
        for (const key in error.response.headers) {
          res.setHeader(key, error.response.headers[key]);
        }
        res.status(error.response.status);
        return error.response.data.pipe(res);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of http.ClientRequest
        if (error.code === 'ECONNRESET') {
          // Connection was most likely aborted because client lost connection, or canceled the request
          rawLogger.warn({
            ...commonErrorObject,
            message: `No response - ECONNRESET: ${error.message}`,
          });
        } else if (error.code === AxiosError.ECONNABORTED) {
          // Request timed out due to exceeding timeout specified in axios configuration
          rawLogger.error({
            ...commonErrorObject,
            message: `No response - Timeout: ${error.message}`,
          });
        } else {
          rawLogger.error({
            ...commonErrorObject,
            message: `No response error - Unknown: ${error.message}`,
          });
        }
        return res.status(500).send('En feil har oppstått');
      } else {
        // Something happened in setting up the request that triggered an Error
        rawLogger.error({
          ...commonErrorObject,
          message: 'Invalid request error',
        });
        res.status(500).send('Ukjent feil');

        throw error;
      }
    });
}
