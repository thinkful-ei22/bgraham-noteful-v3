'use strict';

const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId, tagId} = req.query;
  let filter = {};
  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'title': re }, { 'content': re }];
  }

  if (folderId){
    filter.folderId = folderId;
  }

  if (tagId){
    filter.tags = tagId;
  }

  Note
    .find(filter)
    .populate('tags')
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Note
    .findById(id)
    .populate('tags')

    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});
/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content, folderId, tags} = req.body;
  const newNote = {title, content, folderId, tags};

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  if (!mongoose.Types.ObjectId.isValid(folderId)){
    const err = new Error('The `ObjectId` is not valid');
    err.status = 400;
    return next(err);
  }
  if (newNote.tags){
    newNote.tags.forEach(tag => {
      if(!mongoose.Types.ObjectId.isValid(tag)) {
        const err = new Error('Tag not valid');
        err.status = 400;
        return next(err);
      }
    });
  }
  return Note.create(newNote)
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {title, content, folderId, tags} = req.body;
  const updateNote = {title, content, folderId, tags};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  

  if (!mongoose.Types.ObjectId.isValid(folderId)){
    const err = new Error('The `ObjectId` is not valid');
    err.status = 400;
    return next(err);
  }
  

  if (updateNote.tags){
    updateNote.tags.forEach(tag => {
      if(!mongoose.Types.ObjectId.isValid(tag)) {
        const err = new Error('Tag not valid');
        err.status = 400;
        return next(err);
      }
    });
  }
  
  Note
    .findByIdAndUpdate(id, updateNote, {new:true, upsert:true})
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});


/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Note
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