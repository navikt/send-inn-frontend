import { rest } from 'msw';
import { soknadMock } from '../data/soknad/index.js';
const { REMOTE_API_URL } = process.env;

export const opprettEttersending = rest.post(
  REMOTE_API_URL + '/frontend/v1/ettersendPaSkjema',
  async (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(await soknadMock('ettersending-default')));
  },
);
