import chai from 'chai';
import { describe } from 'mocha';
import supertest from 'supertest';


const expect = chai.expect;
const requester = supertest('http://localhost:8080')


describe('Cart Router API', () => {
  it('Para obtener todos los carritos', (done) => {
    chai.requester(index)
      .get('/api/carts')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Para obtener un carrito por ID', (done) => {
    const cartId = 'your_sample_cart_id'; // Asegúrate de tener un ID válido aquí
    chai.requester(index)
      .get(`/api/carts/${cartId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

});


