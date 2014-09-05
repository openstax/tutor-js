fs = require('fs')

GRUNT_DIR = 'config/grunt'

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

  files = fs.readdirSync(GRUNT_DIR)
  files.forEach (file) ->
    require("./#{GRUNT_DIR}/#{file}")(grunt)

  grunt.registerTask('dist', ['clean', 'browserify', 'concat'])
  grunt.registerTask('test', ['mochaTest'])
