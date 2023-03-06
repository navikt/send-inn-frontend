import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;
import { soknadMock } from '../data/soknad/index.js';

export const opprettSoknad = rest.post(
    REMOTE_API_URL + '/frontend/v1/soknad',
    async (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json(await soknadMock('dokumentinnsending-default')),
        );
    },
);
