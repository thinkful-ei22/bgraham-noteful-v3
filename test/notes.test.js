'use strict';

const chai = require('chai');
const chaiHttp = require ('chai-http');

const mongoose = require ('monggose');

const app = require ('../server');

const { TEST_MONGO_URI } = require ('../config');

const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);