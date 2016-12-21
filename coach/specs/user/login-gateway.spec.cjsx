React = require 'react'
SnapShot = require 'react-test-renderer'

jest.mock('../../src/user/model')
User = require '../../src/user/model'

FakeWindow = require 'shared/specs/helpers/fake-window'

LoginGateway = require 'user/login-gateway'

describe 'User login gateway component', ->
  beforeEach ->
    User.endpoints = {login: 'test-login'}
    @props =
      type: 'profile'
      loginWindow: new FakeWindow()
      windowImpl: new FakeWindow()

  it 'renders children when window is closed', ->
    wrapper = shallow(<LoginGateway {...@props}><span>Child</span></LoginGateway>)
    expect(wrapper.text()).to.include('reopen window')
    expect(SnapShot.create(<LoginGateway {...@props} />).toJSON()).toMatchSnapshot()
    wrapper.setState(loginWindow: false)
    expect(wrapper.text()).to.include('Child')
    expect(SnapShot.create(<LoginGateway {...@props} />).toJSON()).toMatchSnapshot()
    undefined

  it 'opens a propup window when clicked', ->
    wrapper = shallow(<LoginGateway {...@props} />)
    wrapper.find('a').simulate('click')
    expect(@props.windowImpl.open).to.have.been.calledWith(
        sinon.match(/test-login\?parent=.*/),
        'oxlogin',
        sinon.match(/toolbar=no,location=yes,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=\d+,height=\d+,top=\d+,left=\d+/)
      )
    undefined
