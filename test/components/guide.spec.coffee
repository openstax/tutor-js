{expect} = require 'chai'

React = require 'react'
_ = require 'underscore'

{CourseStore, CourseActions} = require '../../src/flux/course'
{Guide} = require '../../src/components/task-plan/guide'

VALID_MODEL = require '../../api/courses/1/guide.json'




getModel = (model) ->
  {id} = model
  #load guidedata
  CourseActions.loaded(model, id)
  CourseActions.loadedGuide(model, id)
  html = React.renderToString(<Guide id={id} />)
  div = document.createElement('div')
  div.innerHTML = html
  div


describe 'Learning Guide', ->
  beforeEach ->
    CourseActions.reset()


  it 'should load a valid model', ->

    node = getModel(VALID_MODEL)

    expect(node.querySelector('.-course-guide-table')).to.not.be.null
    
    expect(parseInt(node.querySelector('.-course-guide-table-id').innerText)).to.equal(VALID_MODEL.fields[0].id)
    expect(node.querySelector('.-course-guide-table-title').innerText).to.equal(VALID_MODEL.fields[0].title)

    expect(parseInt(node.querySelector('.-course-guide-table-unit').innerText)).to.equal(VALID_MODEL.fields[0].unit)
    expect(parseInt(node.querySelector('.-course-guide-table-questions_answered_count').innerText)).to.equal(VALID_MODEL.fields[0].questions_answered_count)
    expect(parseFloat(node.querySelector('.-course-guide-table-current_level').innerText)).to.equal(VALID_MODEL.fields[0].current_level)
    expect(parseInt(node.querySelector('.course-guide-table-page_ids span').innerText)).to.equal(VALID_MODEL.fields[0].page_ids[0])
    expect(node.querySelector('.-course-guide-table-practice_button')).to.not.be.null
