import chai from 'chai';
import { describe } from 'mocha';
import supertest from 'supertest';


const expect = chai.expect;
const requester = supertest('http://localhost:8080')


describe('Product Router API', () => {
  it('Para obtener todos los productos', (done) => {
    chai.requester(index)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Para obtener el producto por ID', (done) => {
    const productId = 'your_sample_product_id'; // Asegúrate de tener un ID válido aquí
    chai.requester(index)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('Para crear un nuevo producto', (done) => {
    const newProduct = {
      name: 'Sample Product',
      description: 'Sample Description',
      price: 19.99,
      category: 'Sample Category',
      stock: 10,
      thumbnail: 'sample_thumbnail_url',
    };

    chai.requester(index)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('name').equal('Sample Product');
        done();
      });
  });

});

