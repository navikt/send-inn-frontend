import axios, { AxiosRequestHeaders, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenxToken } from '../../../auth/getTokenXToken';
import { verifyIdportenAccessToken } from '../../../auth/verifyIdPortenToken';

export const config = {
    api: {
        // Fjerner bodyParser for å unngå problem med 'multipart/form-data'
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    let tokenxToken = '';
    if (process.env.NODE_ENV === 'production') {
        let idportenToken: string;
        try {
            idportenToken = req.headers.authorization.split(' ')[1];
            await verifyIdportenAccessToken(idportenToken);
        } catch (e) {
            console.warn(
                'kunne ikke validere idportentoken i beskyttetApi',
                e,
            );
            return res.status(401).json({ message: 'Access denied' });
        }
        tokenxToken = await getTokenxToken(
            idportenToken,
            process.env.INNSENDING_API_AUDIENCE,
        );
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

    const response = await axios({
        method: method,
        url: `${process.env.REMOTE_API_URL}/${path}`,
        params: params,
        data: req, // Sender data videre som stream
        headers: {
            ...headers,
            authorization: `Bearer ${tokenxToken}`,
        },
        responseType: 'stream',
        timeout: 20000,
    }).catch((error) => {
        console.log(error.response?.data);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx

            console.log({
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers,
            });

            return res
                .status(error.response.status)
                .json(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        res.status(500).send('Ukjent feil');

        throw error;
    });

    if (!response) {
        return;
    }
    for (const key in response.headers) {
        res.setHeader(key, response.headers[key]);
    }

    res.status(response.status);
    response.data.pipe(res);
}
