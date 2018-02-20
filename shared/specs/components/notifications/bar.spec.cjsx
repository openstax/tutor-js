React = require 'react'
SnapShot = require 'react-test-renderer'
moment = require 'moment'
cloneDeep = require 'lodash/cloneDeep'
jest.mock('../../../src/model/notifications')
Notifications = require '../../../src/model/notifications'

Bar = require '../../../src/components/notifications/bar'

jest.useFakeTimers()

describe 'Notifications Bar', ->
  props = null

  beforeEach ->
    props =
      displayAfter: 777
      callbacks: {}

  afterEach ->
    Notifications.getActive.mockClear()
    Notifications.on.mockClear()
    setTimeout.mockClear()
    Notifications.setCourseRole.mockClear()

  it 'renders and matches snapshot', ->
    Notifications.getActive.mockReturnValue([{id: '1', message: 'A test'}])
    wrapper = shallow(<Bar {...props} />)
    jest.runAllTimers()
    expect(wrapper.hasClass('viewable')).to.equal true
    expect(wrapper.find("SystemNotification[noticeId='1']")).to.have.length(1)

    component = SnapShot.create(<Bar {...props} />)
    jest.runAllTimers()
    expect(component.toJSON()).toMatchSnapshot()
    undefined


  it 'starts and stops listening to notifications', ->
    wrapper = shallow(<Bar {...props} />)
    expect(Notifications.on).toHaveBeenLastCalledWith('change', expect.anything())
    wrapper.unmount()
    expect(Notifications.off).toHaveBeenLastCalledWith('change', expect.anything())
    undefined

  it 'shows itself after a delay if there are notifications', ->
    Notifications.getActive.mockReturnValueOnce([{id: '1', message: 'A test'}])
    wrapper = shallow(<Bar {...props} />)
    expect(wrapper.hasClass('viewable')).to.equal false
    expect(setTimeout.mock.calls.length).toBe(1)
    expect(setTimeout.mock.calls[0][1]).toBe(777)
    jest.runAllTimers()
    expect(wrapper.hasClass('viewable')).to.equal true
    undefined

  it 'displays all notifications and can dismiss them', ->
    firstNotice = {id: '1', message: 'TEST 1'}
    Notifications.getActive.mockReturnValue([firstNotice])
    wrapper = shallow(<Bar {...props} />)
    jest.runAllTimers()
    expect(wrapper.hasClass('viewable')).to.equal true
    systemNotice = wrapper.find("SystemNotification[noticeId='1']")
    expect(systemNotice).to.have.length(1)
    secondNotice = {id: '2', message: 'TEST 2'}
    Notifications.getActive.mockReturnValue([firstNotice, secondNotice])

    Notifications.on.mock.calls[0][1]()

    expect(wrapper.find("SystemNotification[noticeId='1']")).to.have.length(1)
    expect(wrapper.find("SystemNotification[noticeId='2']")).to.have.length(1)

    Notifications.getActive.mockReturnValue([secondNotice])
    systemNotice.prop('onDismiss')()
    jest.runAllTimers()
    expect(Notifications.acknowledge).toHaveBeenLastCalledWith(firstNotice)

    expect(wrapper.find("SystemNotification[noticeId='1']")).to.have.length(0)
    expect(wrapper.find("SystemNotification[noticeId='2']")).to.have.length(1)

    # simulate no new notices
    Notifications.getActive.mockReturnValue(null)
    wrapper.find("SystemNotification[noticeId='2']").prop('onDismiss')()
    jest.runAllTimers()
    expect(Notifications.acknowledge).toHaveBeenLastCalledWith(secondNotice)

    expect(wrapper.hasClass('viewable')).to.equal false
    undefined

  it 'displays when new notices arrive', ->
    Notifications.getActive.mockReturnValue(null)
    wrapper = shallow(<Bar {...props} />)
    expect(wrapper.find("SystemNotification")).to.have.length(0)
    expect(wrapper.hasClass('viewable')).to.equal false
    Notifications.getActive.mockReturnValue([{id: '42', message: 'Foo'}])
    Notifications.on.mock.calls[0][1]()
    expect(wrapper.hasClass('viewable')).to.equal true
    expect(wrapper.find("SystemNotification[noticeId='42']")).to.have.length(1)
    undefined


  it 'notifies the store when course or role changes', ->
    expect(Notifications.setCourseRole).not.toHaveBeenCalled()
    props.course = {id: '1', ends_at: moment().add(1, 'day'), students: [{role_id: '111'}] }
    props.role = {id: '111', type: 'student', joined_at: '2016-01-30T01:15:43.807Z' }
    wrapper = shallow(<Bar {...props} />)
    expect(Notifications.setCourseRole).toHaveBeenCalledTimes(1)

    wrapper.setProps(cloneDeep(props))
    expect(Notifications.setCourseRole).toHaveBeenCalledTimes(1)

    props = cloneDeep(props)
    props.role.id = '34'
    wrapper.setProps(props)
    expect(Notifications.setCourseRole).toHaveBeenCalledTimes(2)

    props = cloneDeep(props)
    props.course.id = '42'
    wrapper.setProps(props)
    expect(Notifications.setCourseRole).toHaveBeenCalledTimes(3)
