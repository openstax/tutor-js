{Testing, sinon, _} = require 'shared/specs/helpers'

Exercise = require 'model/exercise'

describe 'Exercise Helper', ->

  afterEach ->
    Exercise.setErrataFormURL('https://oscms.openstax.org/errata/form')

  it 'calculates trouble url', ->
    expect(Exercise.troubleUrl({
      bookUUID: '185cbf87-c72e-48f5-b51e-f14f21b5eabd'
      project: 'tutor'
      exerciseId: '22@22'
      chapter_section: [1, 2]
      title: 'Intro to Physics'
    })).toEqual("#{Exercise.ERRATA_FORM_URL}?source=tutor&location=1.2%20Intro%20to%20Physics&book=Biology&exerciseId=22%4022")

  it 'skips missing parts', ->
    expect(Exercise.troubleUrl({
      chapter_section: [1, 2]
      title: 'Intro to Physics'
    })).toEqual("#{Exercise.ERRATA_FORM_URL}?location=1.2%20Intro%20to%20Physics")


  it 'can set the errata url', ->
    Exercise.setErrataFormURL('')
    expect(Exercise.ERRATA_FORM_URL).toEqual('https://oscms.openstax.org/errata/form')
    Exercise.setErrataFormURL('https://my-crazy-url/')
    expect(Exercise.troubleUrl({
      bookUUID: '185cbf87-c72e-48f5-b51e-f14f21b5eabd'
      project: 'tutor'
      exerciseId: '22@22'
      chapter_section: [1, 2]
      title: 'Intro to Physics'
    })).toEqual("https://my-crazy-url/?source=tutor&location=1.2%20Intro%20to%20Physics&book=Biology&exerciseId=22%4022")
