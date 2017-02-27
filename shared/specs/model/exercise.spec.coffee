{Testing, sinon, _} = require 'shared/specs/helpers'

Exercise = require 'model/exercise'


describe 'Exercise Helper', ->

  it 'calculates trouble url', ->
    expect(Exercise.troubleUrl({
      bookUUID: '185cbf87-c72e-48f5-b51e-f14f21b5eabd'
      project: 'tutor',
      exerciseId: '22@22'
    })).toEqual('https://docs.google.com/a/rice.edu/forms/d/e/1FAIpQLSd5rLsdKv75nkpary6dfJMRuw0bcqSetYV3hO-pFbzqqplM0Q/viewform?entry.649352110=22%4022&entry.1091629000=Biology')

  it 'skips missing parts', ->
    expect(Exercise.troubleUrl({
      exerciseId: '42@1'
    })).toEqual('https://docs.google.com/a/rice.edu/forms/d/e/1FAIpQLSd5rLsdKv75nkpary6dfJMRuw0bcqSetYV3hO-pFbzqqplM0Q/viewform?entry.649352110=42%401')
