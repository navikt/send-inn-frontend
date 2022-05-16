import axios, { AxiosRequestHeaders, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenxToken } from '../../../auth/getTokenXToken';
import curlirize from 'axios-curlirize';

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
    // https://github.com/navikt/permitteringsportal/blob/6e68af2b3bd6b090226fd35e3566d12302e54755/src/server/konstanter.js
    // const API_AUDIENCE = process.env.API_AUDIENCE || 'tokenx';

    // initializing axios-curlirize with your axios instance
    //curlirize(axios);

    let tokenxToken = '';
    if (process.env.NODE_ENV === 'production') {
        const idportenToken =
            req.headers.authorization!.split(' ')[1];
        tokenxToken = await getTokenxToken(
            idportenToken,
            process.env.INNSENDING_API_AUDIENCE,
        );
    }

    console.log('test');
    console.log(req.headers);

    //TODO: Check if this works with query params

    /*
    if (req.query.all) {
   const path =
        typeof req.query.all === 'string'
            ? req.query.all
            : req.query.all.join('/');
        } else {
            const path = "";
        }
            
*/
    let path = '';
    if (typeof req.query.all === 'string') {
        path = req.query.all;
    }

    if (typeof req.query.all !== 'string' && req.query.all) {
        path = req.query.all.join('/');
    }

    console.log(path);
    const method = req.method as Method;

    // https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    const data = Buffer.concat(buffers);

    // Removed host-header because of certification issues with node
    const { host, ...headers } = req.headers as AxiosRequestHeaders;

    //console.log({ data });

    console.log(`${process.env.REMOTE_API_URL}/${path}`);

    // tokenxToken

    const response = await axios({
        method: method,
        url: `${process.env.REMOTE_API_URL}/${path}`,
        data: data,
        headers: {
            ...headers,
            authorization: `Bearer ${tokenxToken}`,
        },
        timeout: 20000,
    }).catch((error) => {
        console.log(error.response?.data);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx

            // todo vurder å fjerne noen
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            res.status(error.response.status).json(
                error.response.data,
            );
            return;
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

    res.json(response.data);
}
