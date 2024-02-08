import chai from 'chai';
import { describe } from 'mocha';
import supertest from 'supertest';


const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Session Management', () => {
    it('Debe crear una nueva sesion cuando el usuario inicia session', async () => {
        const response = await requester(index)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.statusCode).toBe(200);
        expect(response.headers['set-cookie']).toBeDefined();
    });

    it('deberia destruir la sesion cuando el usuario cierre la session', async () => {
        const response = await requester(index)
            .get('/api/users/logout');

        expect(response.statusCode).toBe(302);
        expect(response.headers['set-cookie'][0]).toContain('Max-Age=0');
    });

});


const MemoryStore = require('memorystore')(session);

const sessionConfigForTesting = {
    ...sessionConfig,
    store: new MemoryStore({
    }),
};



