{expect} = require 'chai'
_ = require 'underscore'
ld = require 'lodash'

EXERCISES  = require '../../api/exercises.json'
FilterFunc = require '../../src/flux/qa-exercise-data-filter'

EXERCISE = _.first(EXERCISES.items)

ECOSYSTEMS = require '../../api/ecosystems.json'
ECOSYSTEM_ID = '1' # AP BIO

{EcosystemsActions} = require '../../src/flux/ecosystems'

describe 'QA Exercise Data Filter', ->

  beforeEach (done) ->
    @exercise = ld.cloneDeep(EXERCISE)
    @tags = _.clone @exercise.tags

    EcosystemsActions.loaded(ECOSYSTEMS)
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'removes unrelated book tags', ->
    ex = FilterFunc(@exercise, {ecosystemId: ECOSYSTEM_ID})

    expect(ex.tags).to.deep.equal(
      _.reject(@tags, {id: 'lo:stax-bio:1-1-1'}) # should remove not matching LO
    )

  it 'keeps LO tag for courent book', ->
    ex = FilterFunc(@exercise, {ecosystemId: ECOSYSTEM_ID})

    expect(ex.tags).to.include(
      _.findWhere(@tags, {id: 'lo:stax-apbio:2-2-2'})
    )
