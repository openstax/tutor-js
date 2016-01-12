Navigation = require 'navigation/model'

describe 'Navigation Model', ->

  beforeEach ->
    Navigation.initialize({})

  it 'gets nav data by view', ->
    data = Navigation.getDataByView('profile')
    expect(data).not.to.be.null
    expect(data.state.view).equal('profile')

  it 'gets nav data by view route', ->
    view = Navigation.getViewByRoute('{prefix}{base}profile')
    expect(view).equal('profile')
