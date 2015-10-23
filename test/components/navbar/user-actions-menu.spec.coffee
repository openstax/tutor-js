{Testing, expect, sinon, _} = require '../helpers/component-testing'

UserActionsMenu = require '../../../src/components/navbar/user-actions-menu'

{testParams, setupStores, resetStores, userModel, courseModel} = require './spec-test-params'

testWithRole = (roleType) ->

  ->
    before (done) ->
      @roleTestParams = setupStores(roleType)
      done()

    after ->
      resetStores(roleType)

    it 'should have expected dropdown menu', (done) ->
      Testing.renderComponent( UserActionsMenu, props: {courseId: courseModel.id} ).then ({dom}) =>
        dropdownItems = dom.querySelectorAll('li')
        roleItems = Array.prototype.slice.call(dropdownItems, 0, -4)
        labels = _.pluck(@roleTestParams.menu, 'label')
        labels.push 'Browse the Book'
        expect(_.pluck(roleItems, 'innerText')).to.deep.equal(labels)
        done()

    it 'should have link to browse the book', (done) ->
      Testing.renderComponent( UserActionsMenu, props: {courseId: courseModel.id} ).then ({dom}) ->
        bookLink = dom.querySelector('.view-reference-guide')
        expect(bookLink).not.to.be.null
        expect(bookLink.getAttribute('target')).to.equal('_blank')
        done()

describe 'Student Navbar Component', testWithRole('student')

describe 'Teacher Navbar Component', testWithRole('teacher')
