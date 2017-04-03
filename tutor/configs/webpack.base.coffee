module.exports =
  entry:
    tutor: [
      "babel-polyfill",
      "index.coffee",
      "resources/styles/tutor.less"
    ]
    qa: [
      "babel-polyfill",
      "src/qa.coffee"
    ]
