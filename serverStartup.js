import { server } from './mocks/server.js';

export const serverStartup = () => {
    if (process.env.API_MOCKING === 'true') {
        server.listen();
    }
};
