_ = require 'underscore'
Collection = require 'exercise/collection'
step = require '../../api/steps/4571/GET'

describe 'Exercise Collection', ->

  beforeEach ->
    @stepId = 4571
    @step = _.clone(step)
    Collection.quickLoad(@stepId, @step)

  describe 'getCurrentPanel', ->
    it 'returns free-response by default', ->
      expect(Collection.getCurrentPanel(@stepId)).equal('free-response')

    it 'returns review if content.questions is missing', ->
      @step.content = {}
      Collection.quickLoad(@stepId, @step)
      expect(Collection.getCurrentPanel(@stepId)).equal('review')

    it 'returns multiple-choice if free_response is present', ->
      @step.free_response = 'my best guess'
      Collection.quickLoad(@stepId, @step)
      expect(Collection.getCurrentPanel(@stepId)).equal('multiple-choice')
