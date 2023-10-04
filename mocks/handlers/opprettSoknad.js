import { rest } from 'msw';
import { soknadMock } from '../data/soknad/index.js';
const { REMOTE_API_URL } = process.env;

export const opprettSoknad = rest.post(REMOTE_API_URL + '/frontend/v1/soknad', async (req, res, ctx) => {
  return res(ctx.status(201), ctx.json(await soknadMock('dokumentinnsending-default')));
});
