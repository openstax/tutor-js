{expect} = require 'chai'

_ = require 'underscore'
ld = require 'lodash'

{ExerciseActions, ExerciseStore} = require '../../src/flux/exercise'

EXERCISES = require '../../api/exercises.json'
EXERCISE  = _.first(EXERCISES.items)
COURSE_ID = 1
PAGE_IDS  = [1, 2]

describe 'exercises store', ->

  beforeEach (done) ->
    @exercise = ld.cloneDeep(EXERCISE)
    @tags = _.clone @exercise.tags
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, PAGE_IDS)
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'loads by pages and groups exercises by chapter/section', ->
    expect(_.keys(ExerciseStore.getGroupedIncludedExercises(PAGE_IDS)))
      .to.deep.equal(['1.1'])


  it 'ommits excluded exercises from groups', ->
    exercise = _.extend({}, EXERCISE, is_excluded: true)
    ExerciseActions.updateExercises([exercise])

    exercises = ExerciseStore.getGroupedIncludedExercises(PAGE_IDS)['1.1']
    expect(_.pluck(exercises, 'id')).not.to.include(exercise.id)

    exercise.is_excluded = false
    ExerciseActions.updateExercises([exercise])
    exercises = ExerciseStore.getGroupedIncludedExercises(PAGE_IDS)['1.1']
    expect(_.pluck(exercises, 'id')).to.include(exercise.id)
