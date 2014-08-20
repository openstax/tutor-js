# Stores answers for questions in an exercise

answers = {}

module.exports =
  getAnswers: -> answers
  answerQuestion: (questionId, answer) ->
    console.log("Answered #{questionId} with", answer)
    answers[questionId] = answer
