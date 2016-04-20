{expect} = require 'chai'
_ = require 'lodash'

React = require 'react'
{Promise} = require 'es6-promise'
{routerStub}   = require '../helpers/utilities'
ReactTestUtils = require 'react-addons-test-utils'
Navbar = require '../../../src/components/navbar'

{testParams, setupStores, resetStores, userModel, courseModel} = require './spec-test-params'

testWithRole = (roleType) ->
  ->
    # Don't need to render on each since no actions are being performed between each task
    before (done) ->
      container = document.createElement('div')
      @roleTestParams = setupStores(roleType)

      routerStub
        .goTo('/dashboard')
        .then((result) =>
          navbarComponent = ReactTestUtils.findRenderedComponentWithType(result.component, Navbar)
          navbarDOMNode = navbarComponent.getDOMNode()
          @result = _.extend({navbarComponent, navbarDOMNode}, result)

          done()
        , done)

    after ->
      routerStub.unmount()
      resetStores(roleType)

    xit 'should have redirected from dashboard to a role-based dashboard path', (done) ->
      {router} = @result
      currentPath = router.getCurrentPath()
      expectedPath = router.makeHref(@roleTestParams.dashroute, {courseId: courseModel.id})
      expect(currentPath).to.include(expectedPath)
      done()

    it 'should have a navbar', (done) ->
      {navbarComponent} = @result
      expect(ReactTestUtils.isCompositeComponent(navbarComponent)).to.be.true
      done()

    it 'should have expected course name', (done) ->
      {navbarDOMNode} = @result
      expect(navbarDOMNode.innerText).to.include(courseModel.name)
      done()

    it 'should have expected user name', (done) ->
      {navbarDOMNode} = @result
      expect(navbarDOMNode.innerText).to.include(userModel.name)
      done()


describe 'Student Navbar Component', testWithRole('student')

describe 'Teacher Navbar Component', testWithRole('teacher')
