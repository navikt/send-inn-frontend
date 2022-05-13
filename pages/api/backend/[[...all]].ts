import axios, { AxiosRequestHeaders, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

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
    console.log('test');
    console.log(req.headers);

    //TODO: Check if this works with query params
    const path =
        typeof req.query.all === 'string'
            ? req.query.all
            : req.query.all.join('/');
    console.log(path);
    const method = req.method as Method;

    // https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    const data = Buffer.concat(buffers);

    // Removed host-header because of certification issues with node
    const { host, ...headers } = req.headers;

    console.log({ data });
    const response = await axios({
        method: method,
        url: `${process.env.NEXT_PUBLIC_API_URL}/${path}`,
        data: data,
        headers: headers as AxiosRequestHeaders,
        timeout: 20000,
    }).catch((error) => {
        console.log(error.response?.data);
        throw error;
    });
    console.log(response.data);

    res.json(response.data);
}
