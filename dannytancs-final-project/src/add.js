const mongoose = require('mongoose');
const course = mongoose.model('Course');
const note = mongoose.model('Note');
const user = mongoose.model('User');
const fs = require('fs');

function deleteFile(path) {
  fs.unlink(path, (err) => {
    if(err) {
      console.log(err);
    }
  });
}


function findCourseAndUpdate(courseInfo, cb, note = undefined, path = "./test/test.jpg") {
  course.findOne({ name: courseInfo.name, date: courseInfo.date, courseNumber: courseInfo.courseNumber, professor: courseInfo.professor }, (err, result) => {
    if (err) {
      console.log(err);
    }
  
    if (note && result) {
      
      result.notes.push(note);
      result.save();
      if (path !== "./test/test.jpg") {
        console.log('delete file');
        deleteFile(path);
      }
      cb('update course');
    }
    else {
      //add new class;
      const aCourse = new course({
        name: courseInfo.name,
        date: courseInfo.date,
        courseNumber: courseInfo.courseNumber,
        professor: courseInfo.professor,
        notes: [note]
      });
      aCourse.save((err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          if (path !== "./test/test.jpg") {
            console.log('delete file');
            deleteFile(path);
          }
          cb('add course successfully');
        }
      });
    }
  });
}

function addNoteAndCourse(courseInfo, noteInfo, cb) {
  const aNote = new note({
    name: noteInfo.name,
    desc: noteInfo.desc,
    date: noteInfo.date,
  });
  aNote.file.data = fs.readFileSync(noteInfo.file.path).toString('base64');
  aNote.file.contentType = noteInfo.file.mimetype;
  aNote.save((err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      const name = result.name;
      const id = result.id;
      const noteData = {name: name, id:id}
      const path = noteInfo.file.path
      console.log(path);
      findCourseAndUpdate(courseInfo, cb, noteData, path);
    }
  });
}

function deleteCourse(courseInfo, cb) {

  course.findOneAndRemove({
    name: courseInfo.name,
    date: courseInfo.date,
    courseNumber: courseInfo.courseNumber,
    professor: courseInfo.professor
  }, function (err) {
    cb(err);
  });;
}

function deleteNote(noteInfo, cb) {
  note.findOneAndRemove({
    name: noteInfo.name,  
    desc: noteInfo.desc,
    date: noteInfo.date
  }, function (err) {
    cb(err);
  });
}


function deleteUser(userInfo, cb) {
  user.findOneAndRemove({
    username: userInfo.username
  }, function (err) {
    cb(err);
  });
}



module.exports = {
  addNoteAndCourse: addNoteAndCourse,
  findCourseAndUpdate: findCourseAndUpdate,
  deleteCourse: deleteCourse,
  deleteNote: deleteNote,
  deleteUser: deleteUser
};
