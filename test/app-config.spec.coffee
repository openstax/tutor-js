{expect} = require 'chai'

{AppConfigActions, AppConfigStore} = require '../src/flux/app-config'

describe 'App Configuration', ->

  it 'gets and sets the assets host', ->
    # Karma runs it's specs on localhost using a random port
    expect( AppConfigStore.getAssetsHost() ).to.match(/localhost:\d+/)
    AppConfigActions.setAssetsHost("https://crazy-bobs-cheap-servers.testing/")
    expect( AppConfigStore.getAssetsHost() ).to.equal("https://crazy-bobs-cheap-servers.testing/")

  it 'sets production environment', ->
    expect( AppConfigStore.isProductionEnvironment() ).to.eq(false)
    AppConfigActions.setProductionEnvironment(true)
    expect( AppConfigStore.isProductionEnvironment() ).to.eq(true)

  it 'calculates resource links', ->
    expect(AppConfigStore.urlForResource("a-pretty-image.svg"))
      .to.include("/style/resources/a-pretty-image.svg")
    AppConfigActions.setProductionEnvironment(true)
    expect(AppConfigStore.urlForResource("a-pretty-image.svg"))
      .to.include("/assets/style/resources/a-pretty-image.svg")
