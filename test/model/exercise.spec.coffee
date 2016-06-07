{Testing, expect, sinon, _} = require 'test/helpers'

Exercise = require 'model/exercise'
VideoPlaceholder = require 'components/exercise-preview/video-placeholder'

EXERCISE = require 'stubs/exercise-preview/data'

describe 'Exercise Model Helpers', ->

  it 'tests for types', ->
    expect( Exercise.isMultipart(EXERCISE) ).to.be.true
    expect( Exercise.hasVideo(EXERCISE) ).to.be.true
    expect( Exercise.hasInteractive(EXERCISE) ).to.be.false


  it 'splits preview into parts', ->
    parts = Exercise.replacePlaceholders(EXERCISE.preview)
    expect( parts ).to.have.lengthOf(3)
    expect( parts[0] ).to.have.string('Watch this video about DNA')
    expect( parts[1] ).to.equal(VideoPlaceholder)
    expect( parts[2] ).to.have.string('After watching it')
