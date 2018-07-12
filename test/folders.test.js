'use strict';

const chai = require('chai');
const chaiHttp = require ('chai-http');

const mongoose = require ('mongoose');

const app = require ('../server');

const { TEST_MONGODB_URI } = require ('../config');

const Folder = require('../models/folders');
const seedFolders = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe ('tests for folders endpoints', () => {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function () {
    return Folder.insertMany(seedFolders);
  });
    
  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });
      
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/folders', function () {

    it('should return all folders', function () {

      return Promise.all([
        Folder.find(),
        chai.request(app).get('/api/folders')
      ])
        .then (([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        }); 
    });

  });

  describe('GET /api/folders/:id', function () {
    it('should return the folder at the selected id', function () {
      let data;

      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/folders/${data.id}`);
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

  describe('POST /api/folders', function() {
    it('should create and return a new folder when provided valid data', function () {
      const newFolder = {
        'name': 'New'
      };

      let res;

      return chai.request(app)
        .post('/api/folders')
        .send(newFolder)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id','name','createdAt','updatedAt');

          return Folder.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('PUT /api/folders/:id', function () {
    it('should update a folder and return said folder when provided valid data', function () {
      const updatedItem = {
        'name': 'Updated'
      };

      let res, data;
      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).put(`/api/folders/${data.id}`)
            .send(updatedItem);
        })
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');

          return Folder.findById(res.body.id);
        })
        .then (updatedData => {
          expect(res.body.id).to.equal(updatedData.id);
          expect(res.body.name).to.equal(updatedData.name);
          expect(new Date(res.body.createdAt)).to.eql(updatedData.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(updatedData.updatedAt);
        });
    });
  });

  describe('DELETE /api/folders/:id', function () {
    it('should delete the folder at the selected id', function () {
      let data;

      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/folders/${data.id}`);
        })
        .then ((res) => {
          expect(res).to.have.status(204);
        });

    });
  });

});