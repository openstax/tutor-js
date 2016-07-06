{expect} = require 'chai'

_ = require 'underscore'
ld = require 'lodash'

{ExerciseActions, ExerciseStore} = require '../../src/flux/exercise'
{TocActions, TocStore} = require '../../src/flux/toc'

EXERCISES = require '../../api/exercises.json'
READINGS  = require '../../api/ecosystems/1/readings.json'
EXERCISE  = _.first(EXERCISES.items)
COURSE_ID = 1
PAGE_IDS  = [1, 2]
ECOSYSTEM_ID = 1

describe 'exercises store', ->

  beforeEach (done) ->
    @exercise = ld.cloneDeep(EXERCISE)
    @tags = _.clone @exercise.tags
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, PAGE_IDS)
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'groups exercises by chapter/section', ->
    expect(_.keys(ExerciseStore.groupBySectionsAndTypes(ECOSYSTEM_ID, PAGE_IDS).all.grouped))
      .to.deep.equal(['', '1.1'])

  it 'ommits excluded exercises from groups', ->
    exercise = _.extend({}, EXERCISE, is_excluded: true)
    ExerciseActions.updateExercises([exercise])

    exercises = ExerciseStore.groupBySectionsAndTypes(ECOSYSTEM_ID, PAGE_IDS).all.grouped['1.1']
    expect(_.pluck(exercises, 'id')).not.to.include(exercise.id)

    exercise.is_excluded = false
    ExerciseActions.updateExercises([exercise])
    exercises = ExerciseStore.groupBySectionsAndTypes(ECOSYSTEM_ID, PAGE_IDS).all.grouped['1.1']
    expect(_.pluck(exercises, 'id')).to.include(exercise.id)

  it 'returns a blank string when chapter section is missing', ->
    expect(ExerciseStore.getChapterSectionOfExercise('1', tags: [])).to.equal('')
