{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'
NewCourseRegistration = require 'course/new-registration'
User = require 'user/model'
EnrollOrLogin = require 'course/enroll-or-login'


describe 'EnrollOrLogin Component', ->

  it 'renders actions', ->
    Testing.renderComponent( EnrollOrLogin, props: {} ).then ({dom}) ->
      expect(dom.textContent).to.include 'Sign up for Concept Coach'
      expect(dom.textContent).to.include 'No enrollment code? Contact your instructor'

  it 'updates text when log in is clicked', ->
    Testing.renderComponent( EnrollOrLogin, props: {} ).then ({dom}) ->
      login = dom.querySelector('.login-gateway.login')
      Testing.actions.click(login)
      expect(
        login.classList.contains('is-open')
      ).to.be.true
      expect(login.textContent).to
        .equal('Please log in using your OpenStax account in the window. Click to reopen window.')
