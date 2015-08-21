{React, Testing, expect, sinon} = require './helpers/component-testing'

CNX_ID    = '128@3'
COURSE_ID = '1'
COURSE    = require '../../api/user/courses/1.json'

{CourseActions} = require '../../src/flux/course'
{BookContentMixin} = require('../../src/components/book-content-mixin')

TestComponent = React.createClass
  mixins: [ BookContentMixin ]
  getCnxId: sinon.spy -> CNX_ID
  getSplashTitle: sinon.spy -> 'Test Title'
  render: ->
    React.createElement('div', {}, @buildReferenceBookLink())

describe 'Book content mixin', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)

  it 'renders using course id and cnx id', ->
    Testing.renderComponent( TestComponent, routerParams: {courseId: COURSE_ID} ).then ({element, dom}) ->
      expect(Testing.router.makeHref).to.have.been.calledWith('viewReferenceBookPage', {
        courseId: COURSE_ID, cnxId: CNX_ID
      })
