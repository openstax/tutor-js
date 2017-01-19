React = require 'react'
SnapShot = require 'react-test-renderer'

jest.mock('../../../src/user/model')
User = require '../../../src/user/model'

Launcher = require 'concept-coach/launcher'

describe 'Launcher', ->

  beforeEach ->
    User.isLoggedIn.mockReturnValue(false)
    User.isEnrolled.mockReturnValue(false)
    @props =
      onLogin: jest.fn()
      onEnroll: jest.fn()
      onLaunch: jest.fn()
      onEnrollSecondSemester: jest.fn()
      collectionUUID: 'C_UUID'

  it 'renders with launching status', ->
    wrapper = shallow(<Launcher {...@props} />)
    expect(wrapper.find('LoginAction[isVisible=true]')).to.have.length(1)
    expect(SnapShot.create(<Launcher {...@props} />).toJSON()).toMatchSnapshot()
    undefined

  it 'renders as logged in', ->
    User.isLoggedIn.mockReturnValue(true)
    wrapper = shallow(<Launcher {...@props} />)
    expect(wrapper.find('LoginAction[isVisible=false]')).to.have.length(1)
    expect(wrapper.find('Enroll')).to.have.length(1)
    expect(SnapShot.create(<Launcher {...@props} />).toJSON()).toMatchSnapshot()
    undefined

  it 'renders as enrolled', ->
    User.isLoggedIn.mockReturnValue(true)
    User.isEnrolled.mockReturnValue(true)
    wrapper = shallow(<Launcher {...@props} />)
    expect(wrapper.find('LoginAction[isVisible=false]')).to.have.length(1)
    expect(wrapper.find('Launch')).to.have.length(1)
    expect(SnapShot.create(<Launcher {...@props} />).toJSON()).toMatchSnapshot()
    undefined

  it 'calls callbacks when buttons clicked', ->
    wrapper = mount(<Launcher {...@props} />)
    wrapper.find('LoginAction').prop('onLogin')()
    expect(@props.onLogin).toHaveBeenCalled()
    wrapper.find('Enroll').simulate('click')
    expect(@props.onEnroll).toHaveBeenCalled()
    undefined
