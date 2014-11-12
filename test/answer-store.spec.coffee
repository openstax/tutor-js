{expect} = require 'chai'

{AnswerActions, AnswerStore} = require '../src/flux/answer'

describe 'Answer Store', ->
  afterEach ->
    AnswerActions.reset()

  it 'should clear the store', ->
    question = {id: 0}
    expect(AnswerStore.getAllAnswers()).to.deep.equal({})
    AnswerActions.setAnswer(question, 'id123')
    expect(AnswerStore.getAllAnswers()).to.deep.equal({0: 'id123'})
    AnswerActions.reset()
    expect(AnswerStore.getAllAnswers()).to.deep.equal({})


  it 'should store an answer and notify', ->
    question = {id: 0}

    calledSynchronously = 0
    AnswerStore.addChangeListener ->
      calledSynchronously += 1

    AnswerActions.setAnswer(question, 'id123')
    expect(AnswerStore.getAnswer(question)).to.equal('id123')
    AnswerActions.setAnswer(question, 'id234')
    expect(AnswerStore.getAnswer(question)).to.equal('id234')
    expect(calledSynchronously).to.equal(2)
