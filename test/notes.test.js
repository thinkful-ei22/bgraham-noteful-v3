'use strict';

const chai = require('chai');
const chaiHttp = require ('chai-http');

const mongoose = require ('mongoose');

const app = require ('../server');

const { TEST_MONGODB_URI } = require ('../config');

const Note = require('../models/note');
const Folder = require('../models/folders');

const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('tests for notes Endpoints', () =>{

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Note.insertMany(seedNotes), Folder.insertMany(seedFolders);
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/notes', function () {
    it('should return all notes', function () {

      
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  describe('GET /api/notes/:id', function () {
    it('should return the note at the selected id', function () {
      let data;

      return Note.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then ((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'folderId','createdAt', 'updatedAt');

          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function (){
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'folderId': '111111111111111111111101'
      };

      let res;

      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'folderId', 'createdAt', 'updatedAt');
       
          return Note.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });

    });

  });

  describe('PUT /api/notes/:id', function () {
    it('should update an item and return said updated item when provided valid data', function () {
      const updatedItem = {
        'title': 'This is an updated item',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'folderId': '111111111111111111111102'
      };

      let res, data;
      return Note.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).put(`/api/notes/${data.id}`)
            .send(updatedItem);
        })
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'folderId', 'createdAt', 'updatedAt');
   
          return Note.findById(res.body.id);
        })
        .then (updatedData => {
          expect(res.body.id).to.equal(updatedData.id);
          expect(res.body.title).to.equal(updatedData.title);
          expect(res.body.content).to.equal(updatedData.content);
          expect(new Date(res.body.createdAt)).to.eql(updatedData.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(updatedData.updatedAt);
        });
     
    });
  });

  describe('DELETE /api/notes/:id', function () {
    it('should delete the item at the selected id', function () {
      let data;

      return Note.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/notes/${data.id}`);
        })
        .then ((res) => {
          expect(res).to.have.status(204);
        });

    });
  });
});




