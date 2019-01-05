const assert = require('assert');
require('../src/db');
const add = require('../src/add.js')

//example - https://mochajs.org/
// describe('Array', function() {
//     describe('#indexOf()', function() {
//       it.skip('should return -1 unless present', function() {
//         // this test will not be run
//       });

//       it('should return the index when present', function() {
//         // this test will be run
//       });
//     });
//   });


// describe('...', function() {
//     it("...", function(done) {
//         // ...
//         done();
//     });
// });



describe('add and delete', function () {
    
    const mockCourse = {
        name: 'AIT Mock',
        date: 'Fall 2018 Mock',
        courseNumber: 'CS-UA.480 Mock',
        professor: "Joe Biden Mock",
    }

    const mockCourse2 = {
        name: 'Machine Learning Mock',
        date: 'Fall 2018 Mock',
        courseNumber: 'CS-UA.480 Mock',
        professor: "Joe Biden Mock",
    }

    const mockNote = {
        name: 'Class1 Mock',
        date: '11/19/18 Mock',
        desc: 'hello world Mock',
        file: {
            path: './test/test.jpg',
            mimeType: 'image/jpeg'
        }
    }

    const noteData = { name: "class1", id: "1234" }

    describe('addNoteAndCourse(success)', function () {
        it('should create note and course when given parameters', function (done) {
            function success() {
                //successfully added notes
                done();
            }
            add.addNoteAndCourse(mockCourse, mockNote, success);
        });
    });

    describe('updateCourse(success)', function () {
        it('should update course if exist and not add a new one', function (done) {
            
            
            function success(update) {
                assert.equal(update, 'update course');
                done();

            }
            add.findCourseAndUpdate(mockCourse, success, noteData);
        });
    });

    describe('updateCourse(fail)', function () {
        it('should add a new course if it doesnt exist', function (done) {
            
            function success(update) {
                assert.equal(update, 'add course successfully');
                done();
            }
            add.findCourseAndUpdate(mockCourse2, success, noteData);
        });
    });


    describe('deleteCourse', function () {
        it('should delete course if it exist', function (done) {
            
            function success1(err) {
                assert.equal(err, null);
            }
            function success2(err) {
                assert.equal(err, null);
                done();
            }
            add.deleteCourse(mockCourse, success1);
            add.deleteCourse(mockCourse2, success2);
        });
    })

    describe('deleteNote', function () {
        it('should delete note if it exist', function (done) {
           
            function success(err) {
                assert.equal(err, null);
                done();
            }
            add.deleteNote(mockNote, success);
        });
    })
});