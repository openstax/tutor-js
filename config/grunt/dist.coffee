module.exports = (grunt) ->
  grunt.config 'browserify',
    options:
      browserifyOptions:
        extensions: ['.js', '.coffee']
      bundleOptions:
        standalone: 'Exercise'
        debug: true # Source Maps
      transform: ['coffeeify']
    exercise:
      files:
        '.build/exercise.js': ['src/exercise.coffee']

  grunt.config 'clean',
    all: ['.build', 'dist']

  grunt.config 'concat',
    exercise:
      files:
        'dist/libs.js': [
          'bower_components/loader/loader.js'
          'htmlbars/vendor/handlebars.amd.js'
          'htmlbars/vendor/simple-html-tokenizer.amd.js'
          'htmlbars/htmlbars-compiler.amd.js'
          'htmlbars/htmlbars-runtime.amd.js'
          'htmlbars/morph.amd.js'
          'src/nodefine.js'
        ]
        'dist/exercise.js': ['.build/exercise.js']
