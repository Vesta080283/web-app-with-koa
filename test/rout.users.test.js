process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : users', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });
  });

  describe('GET /api/v1/users', () => {
    it('should return all users', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 user objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'username', 'email', 'password');
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should respond with a single user', (done) => {
      chai.request(server)
      .get('/api/v1/users/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 user object}
        res.body.data[0].should.include.keys(
          'id', 'username', 'email', 'password'
        );
        done();
      });
    });
    
  it('should throw an error if the user does not exist', (done) => {
    chai.request(server)
    .get('/api/v1/users/9999999')
    .end((err, res) => {
      // there should an error
      should.exist(err);
      // there should be a 404 status code
      res.status.should.equal(404);
      // the response should be JSON
      res.type.should.equal('application/json');
      // the JSON response body should have a
      // key-value pair of {"status": "error"}
      res.body.status.should.eql('error');
      // the JSON response body should have a
      // key-value pair of {"message": "That user does not exist."}
      res.body.message.should.eql('That user does not exist.');
      done();
    });
  });
});

  
    describe('POST /api/v1/users', () => {
      it('should return the user that was added', (done) => {
        chai.request(server)
        .post('/api/v1/user')
        .send({
          username: 'John Grey',
          email: 'johngrey@gmail.com',
          password: '123456'
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 201 status code
          // (indicating that something was "created")
          res.status.should.equal(201);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 user object}
          res.body.data[0].should.include.keys(
            'id', 'username', 'email', 'password'
          );
          done();
        });
      });

      
    it('should throw an error if the payload is malformed', (done) => {
      chai.request(server)
      .post('/api/v1/users')
      .send({
        username: 'John Grey'
      })
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 400 status code
        res.status.should.equal(400);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a message key
        should.exist(res.body.message);
        done();
      });
    });
  });

  describe('PUT /api/v1/users', () => {
    it('should return the user that was updated', (done) => {
      knex('users')
      .select('*')
      .then((user) => {
        const userObject = user[0];
        chai.request(server)
        .put(`/api/v1/users/${userObject.id}`)
        .send({
          rating: 9
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 user object}
          res.body.data[0].should.include.keys(
            'id', 'username', 'email', 'password'
          );
          // ensure the user was in fact updated
          const newUserObject = res.body.data[0];
          newUserObject.rating.should.not.eql(UserObject.rating);
          done();
        });
      });

      it('should throw an error if the user does not exist', (done) => {
        chai.request(server)
        .put('/api/v1/users/9999999')
        .send({
          rating: 9
        })
        .end((err, res) => {
          // there should an error
          should.exist(err);
          // there should be a 404 status code
          res.status.should.equal(404);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql('error');
          // the JSON response body should have a
          // key-value pair of {"message": "That user does not exist."}
          res.body.message.should.eql('That user does not exist.');
          done();
        });
      });
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should return the user that was deleted', (done) => {
      knex('users')
      .select('*')
      .then((users) => {
        const userObject = users[0];
        const lengthBeforeDelete = users.length;
        chai.request(server)
        .delete(`/api/v1/users/${userObject.id}`)
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 user object}
          res.body.data[0].should.include.keys(
            'id', 'username', 'email', 'password'
          );
          // ensure the user was in fact deleted
          knex('users').select('*')
          .then((updatedusers) => {
            updatedusers.length.should.eql(lengthBeforeDelete - 1);
            done();
          });
        });
      });
    });
    it('should throw an error if the user does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/users/9999999')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That user does not exist."}
        res.body.message.should.eql('That user does not exist.');
        done();
      });
    });
  });