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
VALID_UUIDS = ['0e58aa87-2e09-40a7-8bf3-269b2fa16509']

findTagByType = (exercise, tagType) -> _.findWhere(exercise.tags, {type: tagType})

describe 'exercises store', ->

  beforeEach (done) ->
    @exercise = ld.cloneDeep(EXERCISE)
    ExerciseActions.reset()
    @tags = _.clone @exercise.tags
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, PAGE_IDS)
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'groups exercises by chapter/section', ->
    expect(_.keys(ExerciseStore.groupBySectionsAndTypes(ECOSYSTEM_ID, PAGE_IDS).all.grouped))
      .to.deep.equal(['1.1'])

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

  it 'can get exercise details', ->
    exercise = EXERCISES.items[0]
    bloomsTag = findTagByType(exercise, 'blooms')
    lengthTag = findTagByType(exercise, 'length')
    dokTag = findTagByType(exercise, 'dok')

    {tagString} = ExerciseStore.getTagStrings(exercise.id)

    expect(_.indexOf(tagString, bloomsTag.name)).to.not.equal(-1)
    expect(_.indexOf(tagString, lengthTag.name)).to.not.equal(-1)
    expect(_.indexOf(tagString, dokTag.name)).to.not.equal(-1)

  it 'can get teks tag name', ->
    exercise = EXERCISES.items[0]
    teksTag = findTagByType(exercise, 'teks')
    teks = ExerciseStore.getTeksString(exercise.id)
    expect(teksTag.name.indexOf(teks)).to.not.equal(-1)

  it 'calulates exclusion minimum threshold', ->
    exercises = ExerciseStore.forCnxModuleUuid(VALID_UUIDS[0])
    exercise = exercises[0]
    expect(exercises).to.have.lengthOf(5)
    expect(ExerciseStore.excludedAtMinimum(exercise, VALID_UUIDS)).to.equal(5)
    ExerciseActions.updateExercises([_.extend({}, exercise, is_excluded: true)])
    # it should not warn when the count is below minimum
    expect(ExerciseStore.excludedAtMinimum(exercise, VALID_UUIDS)).to.be.false

  it 'warns immediatly if exercise count is less than 5', ->
    ExerciseActions.reset()
    exercises = EXERCISES.items[0..2]
    ExerciseActions.loadedForCourse(
      {total_count: 2, items: exercises},
      COURSE_ID, PAGE_IDS
    )
    exercises = ExerciseStore.forCnxModuleUuid(VALID_UUIDS[0])
    expect(exercises).to.have.lengthOf(3)
    exercise = exercises[0]
    expect(ExerciseStore.excludedAtMinimum(exercise, VALID_UUIDS)).to.equal(3)
    ExerciseActions.updateExercises([_.extend({}, exercise, is_excluded: true)])
    # now that there is exclusions, it shouldn't warn
    expect(ExerciseStore.excludedAtMinimum(exercise, VALID_UUIDS)).to.be.false
