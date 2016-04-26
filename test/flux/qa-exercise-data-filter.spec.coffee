{expect} = require 'chai'
_ = require 'underscore'
ld = require 'lodash'

EXERCISES  = require '../../api/exercises.json'
FilterFunc = require '../../src/flux/qa-exercise-data-filter'

EXERCISE = _.first(EXERCISES.items)

ECOSYSTEMS = require '../../api/ecosystems.json'
ECOSYSTEM_ID = '1' # AP BIO

{EcosystemsActions} = require '../../src/flux/ecosystems'

BAD_TAG_IDS = [
  'context-cnxmod:185cbf87-c72e-48f5-b51e-f14f21b5eabd'
  'lo:stax-bio:1-1-1'
]

describe 'QA Exercise Data Filter', ->

  beforeEach (done) ->
    @exercise = ld.cloneDeep(EXERCISE)
    @tags = _.clone @exercise.tags

    EcosystemsActions.loaded(ECOSYSTEMS)
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'removes tags unrelated to current book', ->
    ex = FilterFunc(@exercise, {ecosystemId: ECOSYSTEM_ID})
    tags = _.pluck(ex.tags, 'id')
    valid = (
      _.reject(
        _.pluck(@tags, 'id'), (id) ->
          _.include(BAD_TAG_IDS, id)
        )
      )
    expect(tags).to.deep.equal(valid)

  it 'keeps tags for current book', ->
    ex = FilterFunc(@exercise, {ecosystemId: ECOSYSTEM_ID})

    expect(ex.tags).to.include(
      _.findWhere(@tags, {id: 'lo:stax-apbio:2-2-2'})
    )
    expect(ex.tags).to.include(
      _.findWhere(@tags, {id: 'context-cnxmod:d52e93f4-8653-4273-86da-3850001c0786'})
    )
