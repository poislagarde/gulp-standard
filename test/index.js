/* globals it, describe */

var fs = require('fs')
var should = require('should')
var gutil = require('gulp-util')
var standard = require('../')

require('mocha')

var testFile1 = fs.readFileSync('test/fixtures/testFile1.js')
var testFile2 = fs.readFileSync('test/fixtures/testFile2.js')

describe('gulp-standard', function () {
  it('should lint files', function (done) {
    var stream = standard()
    var fakeFile = new gutil.File({
      base: 'test/fixtures',
      cwd: 'test/',
      path: 'test/fixtures/testFile1.js',
      contents: testFile1
    })
    stream.once('data', function (newFile) {
      should.exist(newFile)
      should.exist(newFile.standard)
      should(newFile.standard.results[0].messages[0].message).equal("Expected '===' and instead saw '=='.")
      done()
    })
    stream.write(fakeFile)
    stream.end()
  })

  it('should catch broken syntax', function (done) {
    var stream = standard()
    var fakeFile = new gutil.File({
      base: 'test/fixtures',
      cwd: 'test/',
      path: 'test/fixtures/testFile2.js',
      contents: testFile2
    })
    stream.once('data', function (newFile) {
      should(newFile.standard.results[0].messages[0].message)
        .equal('Parsing error: Unexpected token }')
      done()
    })
    stream.write(fakeFile)
    stream.end()
  })

  it('should continue the stream', function (done) {
    var stream = standard()
    var reporter = standard.reporter('default')
    var fakeFile = new gutil.File({
      base: 'test/fixtures',
      cwd: 'test/',
      path: 'test/fixtures/testFile2.js',
      contents: testFile2
    })
    stream.write(fakeFile)
    stream.pipe(reporter)
    .once('data', function (newFile) {
      should(newFile.standard.results[0].messages[0].message)
        .equal('Parsing error: Unexpected token }')
      done()
    })
    stream.end()
  })
})
