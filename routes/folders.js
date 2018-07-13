'use strict';

const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

const Folder = require('../models/folder');

router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  let filter= {};
  if (searchTerm){
    const re = new RegExp(searchTerm, 'i');
    filter = {'name': re};
  }
  Folder
    .find(filter)
    .sort({name: 'asc'})
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder
    .findById(id)
    .then(results => {
      if (results) {
        res.json(results);
      }
      else {
        next();
      }
    })
    .catch(err => next(err));
});


router.post('/', (req, res, next) => {
  const {name} = req.body;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newFolder = {name};

  Folder.create(newFolder)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);  
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {name} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateFolder = {name};

  Folder
    .findByIdAndUpdate(id, updateFolder, {new: true, upsert: true})
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder
    .findByIdAndRemove(id)
    .then(results => {
      if (results) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));      
});
module.exports = router;