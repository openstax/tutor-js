{expect} = require 'chai'
_ = require 'underscore'
{ExerciseActions, ExerciseStore} = require '../src/flux/exercise'

exercises = require '../api/exercises'

findTagByType = (exercise, tagType) -> _.findWhere(exercise.tags, {type: tagType})

COURSE_ID = 1
PAGE_ID = 1

describe 'Exercise Store and Actions', ->
  beforeEach ->
    ExerciseActions.loaded(exercises, COURSE_ID, PAGE_ID)

  afterEach ->
    ExerciseActions.reset()

  it 'can get exercise details', ->
    exercise = exercises.items[0]
    bloomsTag = findTagByType(exercise, 'blooms')
    lengthTag = findTagByType(exercise, 'length')
    dokTag = findTagByType(exercise, 'dok')
    
    {tagString} = ExerciseStore.getTagStrings(exercise.id)

    expect(_.indexOf(tagString, bloomsTag.name)).to.not.equal(-1)
    expect(_.indexOf(tagString, lengthTag.name)).to.not.equal(-1)
    expect(_.indexOf(tagString, dokTag.name)).to.not.equal(-1)

  it 'can get teks tag name', ->
    exercise = exercises.items[0]

    teksTag = findTagByType(exercise, 'teks')
    teks = ExerciseStore.getTeksString(exercise.id)

    expect(teksTag.name.indexOf(teks)).to.not.equal(-1)




