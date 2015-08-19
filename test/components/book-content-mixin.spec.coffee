{React, Testing, expect, sinon} = require './helpers/component-testing'

CNX_ID    = '128@3'
COURSE_ID = '1'
COURSE    = require '../../api/user/courses/1.json'

{CourseActions} = require '../../src/flux/course'

TestComponent = React.createClass
  mixins: [ require('../../src/components/book-content-mixin') ]
  getCnxId: sinon.spy -> CNX_ID
  getSplashTitle: sinon.spy -> 'Test Title'
  render: ->
    React.createElement('div', {}, @buildReferenceBookLink())

describe 'Book content mixin', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)

  describe 'building reference book links', ->

    it 'looks up book id from course store', ->
      Testing.renderComponent( TestComponent, routerParams: {courseId: '1'} ).then ({element, dom}) ->
        expect(Testing.router.makeHref).to.have.been.calledWith('viewReferenceBookPage', {
          bookId: COURSE.book_id, cnxId: CNX_ID
        })
        console.log dom

    it 'uses book id if provided', ->
      Testing.renderComponent( TestComponent, routerParams: {bookId: '459'} )
        .then ({element}) ->
          expect(Testing.router.makeHref).to.have.been.calledWith('viewReferenceBookPage', {
            bookId: '459', cnxId: CNX_ID
          })
