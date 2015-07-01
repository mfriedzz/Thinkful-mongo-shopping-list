var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
  before(function(done) {
    seed.run(function() {
      done();
    });
  });

  it('should list items on GET', function(done) {
    chai.request(app)
      .get('/items')
      .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.should.have.length(3);
      res.body[0].should.be.a('object');
      res.body[0].should.have.property('name');
      res.body[0].name.should.be.a('string');
      res.body[0].name.should.equal('Broad beans');
      res.body[1].name.should.equal('Tomatoes');
      res.body[2].name.should.equal('Peppers');
      done();
    });
  });

//   after(function(done) {
//     Item.remove(function() {
//       done();
//     });
//   });
// });


  
 

  it('should edit an item on PUT', function(done) {
    // use public APIs only (vs internal Model.operation)
    //    GET /items
    //    POST /items/:id
    //    GET /items
    //
    // if implementation switches from Mongo then all tests will fail
    // then tests would have to be rewritten <-- RISK
    chai.request(app)
      .get('/items')
      .end(function(err, res) {
      var items = res.body;

      chai.request(app)
        .put('/items/' + items[0]._id)
        .send({name: 'Bread'})
        .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.name.should.be.a('string');
        res.body.name.should.equal('Bread');
        done();
      });
    });
  });

  
 
  it('should delete an item on DELETE', function(done) {
    chai.request(app)
      .get('/items')
      .end(function(err, res) {
      var items = res.body;
      var itemName = items[0].name;

      chai.request(app)
        .delete('/items/' + items[0]._id)
        .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.a('string');
        res.body.message.should.equal('Item Deleted');
        done();
      });
    });
  });

  
   after(function(done) {
    Item.remove(function() {
      done();
    });
  });
});

  