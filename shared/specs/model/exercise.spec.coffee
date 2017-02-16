{Testing, sinon, _} = require 'shared/specs/helpers'

Exercise = require 'model/exercise'


describe 'Exercise Helper', ->

  it 'calculates trouble url', ->
    expect(Exercise.troubleUrl({
      bookUUID: '185cbf87-c72e-48f5-b51e-f14f21b5eabd'
      project: 'tutor',
      exerciseId: '22@22'
    })).toEqual('https://oscms-dev.openstax.org/errata/form?source=tutor&location=Exercise%3A%2022%4022&book=Biology')

  it 'skips missing parts', ->
    expect(Exercise.troubleUrl({
      exerciseId: '42@1'
    })).toEqual('https://oscms-dev.openstax.org/errata/form?location=Exercise%3A%2042%401')
