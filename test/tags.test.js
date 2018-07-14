'use strict';

const chai = require('chai');
const chaiHttp = require ('chai-http');

const mongoose = require ('mongoose');

const app = require ('../server');

const { TEST_MONGODB_URI } = require ('../config');

const Tag = require('../models/tag');
const seedTags = require('../db/seed/tags');

const expect = chai.expect;
chai.use(chaiHttp);

describe ('tests for tags endpoints', () => {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
      
  beforeEach(function () {
    return Tag.insertMany(seedTags);
  });
      
  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });
        
  after(function () {
    return mongoose.disconnect();
  });
  
  describe('GET /api/tags', function () {
  
    it('should return all tags', function () {
  
      return Promise.all([
        Tag.find(),
        chai.request(app).get('/api/tags')
      ])
        .then (([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        }); 
    });
  
  });
  
  describe('GET /api/tags/:id', function () {
    it('should return the tag at the selected id', function () {
      let data;
  
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/tags/${data.id}`);
        })
        .then ((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
    
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
  
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });
  
  describe('POST /api/tags', function() {
    it('should create and return a new tag when provided valid data', function () {
      const newTag = {
        'name': 'New'
      };
  
      let res;
  
      return chai.request(app)
        .post('/api/tags')
        .send(newTag)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id','name','createdAt','updatedAt');
  
          return Tag.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });
  
  describe('PUT /api/tags/:id', function () {
    it('should update a tag and return said tag when provided valid data', function () {
      const updatedItem = {
        'name': 'Updated'
      };
  
      let res, data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).put(`/api/tags/${data.id}`)
            .send(updatedItem);
        })
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
  
          return Tag.findById(res.body.id);
        })
        .then (updatedData => {
          expect(res.body.id).to.equal(updatedData.id);
          expect(res.body.name).to.equal(updatedData.name);
          expect(new Date(res.body.createdAt)).to.eql(updatedData.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(updatedData.updatedAt);
        });
    });
  });
  
  describe('DELETE /api/tags/:id', function () {
    it('should delete the folder at the selected id', function () {
      let data;
  
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/tags/${data.id}`);
        })
        .then ((res) => {
          expect(res).to.have.status(200);
        });
  
    });
  });
  
});