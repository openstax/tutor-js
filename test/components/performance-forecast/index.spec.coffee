{expect} = require 'chai'
_ = require 'underscore'

React = require 'react'
ReactTestUtils = require 'react-addons-test-utils'
{Promise}      = require 'es6-promise'
{routerStub, commonActions} = require '../helpers/utilities'


PerformanceForecast = require '../../../src/flux/performance-forecast'
Guide = require '../../../src/components/performance-forecast/guide'

GUIDE_DATA = require '../../../api/courses/1/guide.json'
COURSE_ID = '1' # needs to be a string, that's what LoadableItem expects

renderGuide = (url) ->
  new Promise (resolve, reject) ->
    routerStub.goTo(url).then( (result) ->
      resolve(_.extend({
        guide: ReactTestUtils.findRenderedComponentWithType(result.component, Guide)
      }, result))
    , (err) ->
      console.err err
    )

describe 'Learning Guide', ->

  beforeEach ->
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    renderGuide('/courses/1/guide').then (state) =>
      @state = state


  it 'renders panel for each chapter', ->
    titles = _.pluck( @state.div.querySelectorAll('.chapter .title'), 'textContent')
    expect(titles).to.have.deep.equal([
      'My Weaker Areas', 'Acceleration', 'Force and Newton\'s Laws of Motion'
    ])

  it 'renders practice panel', ->
    titles = _.pluck( @state.div.querySelectorAll('.weaker .title'), 'textContent')
    expect(titles).to.have.deep.equal([
      'My Weaker Areas', 'Newton\'s First Law of Motion: Inertia', 'Force'
    ])
