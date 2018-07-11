// 'use strict';

// const mongoose = require('mongoose');
// const { MONGODB_URI } = require('../config');

// const Note = require('../models/note');

// //Find/Search for notes using Note.find

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = /labore/i;
//     let filter = {};

//     if (searchTerm) {
//       const re = new RegExp(searchTerm, 'i');
//       filter.$or = [{ title: re },{ content: re }];
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })    
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// //Find note by id using Note.findById

// // mongoose.connect(MONGODB_URI)
// //   .then(() => {
// //     const searchId = '000000000000000000000002';

// //     return Note.findById(searchId);
// //   })
// //   .then(results => {
// //     console.log(results);
// //   })
// //   .then(() => {
// //     return mongoose.disconnect();
// //   })
// //   .catch(err => {
// //     console.error(`ERROR: ${err.message}`);
// //     console.error(err);
// //   });

// //Create a new note using Note.create

// // mongoose.connect(MONGODB_URI)
// //   .then(() => {
// //     const newNote = {
// //       title: 'Adding a new note',
// //       content: 'Adding the best content.'
// //     };

// //     return Note.create(newNote);
// //   })
// //   .then(results => {
// //     console.log(results);
// //   })
// //   .then(() => {
// //     return mongoose.disconnect();
// //   })
// //   .catch(err => {
// //     console.error(`ERROR: ${err.message}`);
// //     console.error(err);
// //   });


// // // Delete a note by id using Note.findByIdAndRemove
// // mongoose.connect(MONGODB_URI)
// //   .then(() => {
// //     const id = '5b45053944f7b222056aaa90';
// //     return Note.findByIdAndRemove(id);
// //   })
// //   .then(results => {
// //     console.log(results);
// //   })
// //   .then(() => {
// //     return mongoose.disconnect();
// //   })
// //   .catch(err => {
// //     console.err(`ERROR: ${err.message}`);
// //     console.err(err);
// //   });
