module.exports =
  entry:
    tutor: [
      "babel-polyfill",
      "index.js",
      "resources/styles/tutor.scss"
    ]
    qa: [
      "babel-polyfill",
      "src/qa.coffee"
    ]
