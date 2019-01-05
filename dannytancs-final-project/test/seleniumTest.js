//https://code.tutsplus.com/tutorials/an-introduction-to-webdriver-using-the-javascript-bindings--cms-21855
// var webdriver = require('selenium-webdriver');
// var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();

// browser.get('http://en.wikipedia.org/wiki/Wiki');
// browser.findElements(webdriver.By.css('[href^="/wiki/"]')).then(function(links){
//     console.log('Found', links.length, 'Wiki links.' )
//     browser.quit();
// });


const assert = require('assert');
require("../src/db.js");
const add = require("../src/add.js");
require('chromedriver');
var webdriver = require('selenium-webdriver');
const path = require('path');

const user = {
    username: 'automateTest1',
    password: 'automateTest1',
    name: 'automateTest1'
}


// https://stackoverflow.com/questions/25583641/set-value-of-input-instead-of-sendkeys-selenium-webdriver-nodejs



describe('registering', async function () {
    it('should register a unregistered user', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/register').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.name('name')).sendKeys(user.name).then(function () {
                        driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                            return driver.getCurrentUrl();
                        }).then(function (url) {
                            assert.equal('http://localhost:3000/', url);
                            done();
                            driver.quit();
                        });
                    });
                });
            });
        });
    });
    it('should not register a registered user', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/register').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.name('name')).sendKeys(user.name).then(function () {
                        driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                            return driver.getCurrentUrl();
                        }).then(function (url) {
                            assert.equal('http://localhost:3000/register', url);
                            done();
                            driver.quit();
                        });
                    });
                });
            });
        });
    });
});


describe('logging in', function () {
    it('should login in a registered user', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        return driver.getCurrentUrl();
                    }).then(function (url) {
                        assert.equal('http://localhost:3000/', url);
                        done();
                        driver.quit();
                    });
                });
            });
        });
    });
    it('should not login with incorrect password', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys('helloworld').then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        return driver.getCurrentUrl();
                    }).then(function (url) {
                        assert.equal('http://localhost:3000/login', url);
                        done();
                        driver.quit();
                    });
                });
            });
        });
    });
});

const course = {
    name: 'AIT Test',
    date: 'Fall 2018 Test',
    courseNumber: 'CS-UA.480 Test',
    professor: "Joe Biden Test",

}

const note = {
    name: 'Class1 Test',
    date: '11/19/18 Test',
    desc: 'hello world Test',
    file: path.join(__dirname, 'test.jpg')
}


describe('adding course', function () {
    it('should add course', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        driver.findElement(webdriver.By.id("addNotes")).click().then(function () {
                            driver.findElement(webdriver.By.name("courseName")).sendKeys(course.name).then(function () {
                                driver.findElement(webdriver.By.name("courseYear")).sendKeys(course.date).then(function () {
                                    driver.findElement(webdriver.By.name("courseNumber")).sendKeys(course.courseNumber).then(function () {
                                        driver.findElement(webdriver.By.name("professor")).sendKeys(course.professor).then(function () {
                                            driver.findElement(webdriver.By.name("noteName")).sendKeys(note.name).then(function () {
                                                driver.findElement(webdriver.By.name("dateTaken")).sendKeys(note.date).then(function () {
                                                    driver.findElement(webdriver.By.name("noteDesc")).sendKeys(note.desc).then(function () {
                                                        driver.findElement(webdriver.By.name("file")).sendKeys(note.file).then(function () {
                                                            driver.findElement(webdriver.By.id("addButton")).click().then(function () {
                                                                return driver.getCurrentUrl();
                                                            }).then(function (url) {
                                                                assert.equal('http://localhost:3000/', url);
                                                                done();
                                                                driver.quit();
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


describe('adding/deleting course from profile', function () {
    it('add course to profile', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        driver.findElement(webdriver.By.id(course.courseNumber + course.name + course.date)).click().then(function () {
                            driver.findElement(webdriver.By.id("addtoProfile")).click().then(function () {
                                return driver.getCurrentUrl();
                            }).then(function (url) {
                                assert.equal('http://localhost:3000/myprofile', url);
                                done();
                                driver.quit();
                            });
                        });
                    });
                });
            });
        });
    });
    it('delete course from profile', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        driver.get('localhost:3000/myprofile').then(function () {
                            driver.findElement(webdriver.By.id(course.courseNumber + course.name + course.date + "delete")).click().then(function () {
                                driver.findElement(webdriver.By.id(course.courseNumber + course.name + course.date + "delete")).then(function (webElement) {
                                    console.log('Element exists');
                                }, function (err) {
                                    assert('no such element', err.state);
                                    done();
                                    driver.quit();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


describe('deleting course', function () {
    it('should delete course', function (done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        driver.findElement(webdriver.By.id(course.courseNumber + course.name + course.date + "delete")).click().then(function () {
                            driver.findElement(webdriver.By.id(course.courseNumber + course.name + course.date + "delete")).then(function (webElement) {
                                console.log('Element exists');
                            }, function (err) {
                                assert('no such element', err.state);
                                add.deleteNote(note, (err) => {
                                    done();
                                    driver.quit();
                                })
                            });
                        });
                    });
                });
            });
        });
    });
});


describe('log out', function () {
    it('should log out', function(done) {
        let driver = new webdriver.Builder().forBrowser('chrome').build();
        driver.get('localhost:3000/login').then(function () {
            driver.findElement(webdriver.By.name('username')).sendKeys(user.username).then(function () {
                driver.findElement(webdriver.By.name('password')).sendKeys(user.password).then(function () {
                    driver.findElement(webdriver.By.css("button[type = 'submit']")).submit().then(function () {
                        driver.findElement(webdriver.By.id('logout')).submit().then(function () {
                            return driver.getCurrentUrl();
                        }).then(function (url) {
                            add.deleteUser(user, function (err) {
                                console.log(err);
                                assert.equal('http://localhost:3000/login', url);
                                done();
                                driver.quit();
                            });
                        });
                    });
                });
            });
        });
    });
});





