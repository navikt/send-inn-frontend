import { server } from './mocks/server.js';

export const serverStartup = () => {
    console.log('Next startup');
    if (process.env.API_MOCKING === 'true') {
        server.listen();
    }
};
