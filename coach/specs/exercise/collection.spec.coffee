_ = require 'underscore'
cloneDeep = require 'lodash/cloneDeep'
Collection = require 'exercise/collection'
step = require '../../api/steps/4571/GET'

describe 'Exercise Collection', ->

  beforeEach ->
    @stepId = 4571
    @step = cloneDeep(step)
    Collection.quickLoad(@stepId, @step)

  describe 'getCurrentPanel', ->
    it 'returns free-response by default', ->
      expect(Collection.getCurrentPanel(@stepId)).equal('free-response')
      undefined

    it 'returns review if content.questions is missing', ->
      @step.content = {}
      Collection.quickLoad(@stepId, @step)
      expect(Collection.getCurrentPanel(@stepId)).equal('review')
      undefined

    it 'returns multiple-choice if free_response is present', ->
      @step.free_response = 'my best guess'
      Collection.quickLoad(@stepId, @step)
      expect(Collection.getCurrentPanel(@stepId)).equal('multiple-choice')
      undefined

    it 'returns multiple-choice for true-false format', ->
      @step.content.questions[0].formats = ['true-false']
      Collection.quickLoad(@stepId, @step)
      expect(Collection.getCurrentPanel(@stepId)).equal('multiple-choice')
      undefined

  describe 'free response caching', ->
    it 'get returns cached free response if free response has been cached', ->
      FIRST_RESPONSE = 'This is the first response'
      SECOND_RESPONSE = 'This is the second response'

      expect(Collection.get(@stepId).cachedFreeResponse).to.be.falsy
      Collection.cacheFreeResponse(@stepId, FIRST_RESPONSE)
      expect(Collection.get(@stepId).cachedFreeResponse).to.equal(FIRST_RESPONSE)
      Collection.cacheFreeResponse(@stepId, SECOND_RESPONSE)
      expect(Collection.get(@stepId).cachedFreeResponse).to.equal(SECOND_RESPONSE)
      undefined

    it 'clears cached free response if actual free-response has been saved', ->
      FIRST_RESPONSE = 'This is the first response'
      SAVED_RESPONSE = 'This is the saved response'

      savedStep = _.extend {}, @step, {free_response: SAVED_RESPONSE}

      expect(Collection.get(@stepId).cachedFreeResponse).to.be.falsy
      Collection.cacheFreeResponse(@stepId, FIRST_RESPONSE)
      expect(Collection.get(@stepId).cachedFreeResponse).to.equal(FIRST_RESPONSE)
      Collection.quickLoad(@stepId, savedStep)
      expect(Collection.get(@stepId).cachedFreeResponse).to.be.falsy
      expect(Collection.get(@stepId).free_response).to.equal(SAVED_RESPONSE)
      undefined
