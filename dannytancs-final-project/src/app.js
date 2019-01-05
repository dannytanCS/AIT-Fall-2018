const express = require("express");
const app = express();
const path = require("path");
require('./db');
const session = require('express-session');
const auth = require('./auth.js');
const add = require('./add.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');

const course = mongoose.model('Course');
const note = mongoose.model('Note');
const user = mongoose.model('User');
const fs = require('fs');


const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));


class Course {
    constructor(name, date, courseNumber, professor) {
        this.name = name;
        this.date = date;
        this.courseNumber = courseNumber;
        this.professor = professor;
    }
}

class Note {
    constructor(name, date, desc, file) {
        this.name = name;
        this.date = date;
        this.desc = desc;
        this.file = file;
    }
}

class User {
    constructor(username, password, name = "") {
        this.username = username;
        this.password = password;
        this.name = name;
    }
}


// add req.session.user to every context object for templates
app.use((req, res, next) => {
    // now you can use {{user}} in your template!
    res.locals.user = req.session.user;
    next();
});


function deleteFunction(path) {
    fs.unlink(path, (err) => {
        console.log(err);
    });
}

app.get('/', (req, res) => {
    if (req.session.user) {
        course.find({}, (err, result) => {
            res.render('home', { courses: result });
        });
    }
    else {
        res.redirect('/login');
    }
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const aUser = new User(req.body.username, req.body.password);
    auth.login(aUser, (err) => {
        console.log(err);
        res.render('login', err);
    }, (user) => {
        auth.startAuthenticatedSession(req, user, (err) => {
            res.redirect('/');
            console.log(err);
        });
    });
});


app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const aUser = new User(req.body.username, req.body.password, req.body.name);
    auth.register(aUser, (err) => {
        res.render('register', err);
    }, (user) => {
        auth.startAuthenticatedSession(req, user, (err) => {
            res.redirect('/');
            console.log(err);
        });
    });
});


app.get('/add', (req, res) => {
    if (req.session.user) {
        res.render('add');
    }
    else {
        res.redirect('/login');
    }
});

app.get('/myprofile', (req, res) => {
    if (req.session.user) {
        user.findById(req.session.user._id, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                course.find({ "_id": { $in: result.courses } }, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        res.render('profile', { courses: result });
                    }
                });
            }
        });
    }
    else {
        res.redirect('/');
    }
});

app.get('/myprofile/add/courses/:courseID', (req, res) => {
    user.findById(req.session.user._id, (err, result) => {
        result.courses.push(req.params.courseID);
        result.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/myprofile');
            }
        });
    });
});


app.get('/myprofile/delete/courses/:courseID', (req, res) => {
    user.findById(req.session.user._id, (err, result) => {
        const newCourses = result.courses.filter(function (value, index) {
            return value !== req.params.courseID;
        });
        result.courses = newCourses;
        result.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/myprofile');
            }
        });
    });
});

app.get('/courses/:courseID', (req, res) => {
    course.findById(req.params.courseID, (err, result) => {
        result.notes.forEach(element => {
            element['courseId'] = req.params.courseID;
        });
        res.render('courses', { courseData: result });
    });
});

app.get('/courses/:courseID/notes/:noteID', (req, res) => {
    note.findById(req.params.noteID, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            result['courseId'] = req.params.courseID;
            res.render('notes', { noteData: result });
        }
    });
});




app.post('/add', upload.single('file'), (req, res) => {
    if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png") {
        const courseInfo = new Course(req.body.courseName, req.body.courseYear, req.body.courseNumber, req.body.professor);
        const noteInfo = new Note(req.body.noteName, req.body.dateTaken, req.body.noteDesc, req.file);
        add.addNoteAndCourse(courseInfo, noteInfo, (valid) => {
            console.log(valid);
            res.redirect('/');
        });
    }
    else {
        res.render('add', { message: "INPUT FILE IS NOT AN IMAGE(JPEG OR PNG)" });
    }
});

app.get('/delete/courses/:courseID', (req, res) => {
    course.findById(req.params.courseID, (err, courseInfo) => {
        if (err) {
            console.log(err);
        }
        else {
            const aCourse = new Course(courseInfo.name, courseInfo.date, courseInfo.courseNumber, courseInfo.professor);
            add.deleteCourse(aCourse, (err) => {
                if (err) {
                    res.redirect('/', { message: 'Error in deleting course' });
                }
                else {
                    res.redirect('/');
                }
            });
        }
    });
});


app.get('/delete/courses/:courseID/notes/:noteID', (req, res) => {
    note.findById(req.params.noteID, (err, noteInfo) => {
        if (err) {
            console.log(err);
        }
        else {
            const aNote = new Note(noteInfo.name, noteInfo.date, noteInfo.desc);
            add.deleteNote(aNote, (err) => {
                if (err) {
                    res.redirect('/', { message: 'Error in deleting note' });
                }
                else {
                    const aCourse = course.findById(req.params.courseID, (err, courseInfo) => {
                        const newCourseInfo = courseInfo.notes.filter(function (value, index) {
                            return value.id !== req.params.noteID;
                        });
                        courseInfo.notes = newCourseInfo;
                        courseInfo.save((err) => {
                            if (err) {
                                res.redirect('/', { message: 'Error in deleting note' });
                            }
                            else {
                                res.redirect('/');
                            }
                        });
                    });
                }
            });
        }
    });

});


app.post('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
});

app.get('/delete', (req, res) => {
    res.render('delete');
});

app.post('/delete/course', (req, res) => {
    const aCourse = new Course(req.body.courseName, req.body.courseYear, req.body.courseNumber, req.body.professor);
    add.deleteCourse(aCourse, (err) => {
        if (err) {
            res.render('delete', { message: 'Error in deleting course' });
        }
        else {
            res.redirect('/');
        }
    });

});

app.post('/delete/note', (req, res) => {
    const aCourse = new Course(req.body.courseNameNote, req.body.courseYearNote, req.body.courseNumberNote, req.body.professorNote);
    const aNote = new Note(req.body.noteName, req.body.dateTaken, req.body.noteDesc);

    note.findOne({
        name: aNote.name,
        desc: aNote.desc,
        date: aNote.date
    }, (err, result) => {
        if (err) {
            res.render('delete', { message: 'Error in deleting note' });
        }
        else if (result) {
            const noteId = result._id.toString();
            course.findOne({
                name: aCourse.name,
                date: aCourse.date,
                courseNumber: aCourse.courseNumber,
                professor: aCourse.professor
            }, (err, courseInfo) => {
                if (err) {
                    res.render('delete', { message: 'Error in deleting note' });
                }
                else {
                    const newCourseInfo = courseInfo.notes.filter(function (value, index) {
                        return value.id !== noteId;
                    });
                    console.log(courseInfo.notes);
                    console.log(newCourseInfo);
                    courseInfo.notes = newCourseInfo;
                    courseInfo.save((err) => {
                        if (err) {
                            res.render('delete', { message: 'Error in deleting note' });
                        }
                        else {
                            add.deleteNote(aNote, (err) => {
                                if (err) {
                                    res.render('delete', { message: 'Error in deleting note' });
                                }
                                else {
                                    res.redirect('/');
                                }
                            });
                        }
                    });
                }
            })
        }
    });
});

app.listen(process.env.PORT || 3000);