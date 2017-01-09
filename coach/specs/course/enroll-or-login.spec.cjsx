{React} = require 'shared/specs/helpers'

jest.mock('../../src/user/login-gateway')
LoginGateway = require '../../src/user/login-gateway'

FakeWindow = require 'shared/specs/helpers/fake-window'

Course = require 'course/model'
NewCourseRegistration = require 'course/new-registration'
User = require 'user/model'
EnrollOrLogin = require 'course/enroll-or-login'


describe 'EnrollOrLogin Component', ->

  beforeEach ->
    @props = { windowImpl: new FakeWindow }

  it 'renders with action choices', ->
    LoginGateway.isActive.mockReturnValue(false)
    wrapper = shallow(<EnrollOrLogin {...@props} />)
    expect(wrapper.find('EnrollSignUp')).to.have.length(1)
    expect(wrapper.find('EnrollLogin')).to.have.length(1)
    expect(wrapper.find('LoginGateway')).to.have.length(0)
    undefined

  it 'renders login gateway when it’s open', ->
    LoginGateway.isActive.mockReturnValue(true)
    wrapper = shallow(<EnrollOrLogin {...@props} />)
    expect(wrapper.find('EnrollSignUp')).to.have.length(0)
    expect(wrapper.find('EnrollLogin')).to.have.length(0)
    expect(wrapper.find('LoginGateway')).to.have.length(1)
    undefined
