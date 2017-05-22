module.exports =
  entry:
    tutor: [
      "babel-polyfill",
      "index.js",
      "resources/styles/tutor.less"
    ]
    qa: [
      "babel-polyfill",
      "src/qa.coffee"
    ]
