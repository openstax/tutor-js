React = require 'react'
SnapShot = require 'react-test-renderer'

jest.mock('../../../src/model/notifications')
Notifications = require '../../../src/model/notifications'

Bar = require '../../../src/components/notifications/bar'

jest.useFakeTimers()

describe 'Notifications Bar', ->

  beforeEach ->
    @props =
      displayAfter: 777
      callbacks: {}

  afterEach ->
    Notifications.getActive.mockClear()
    Notifications.on.mockClear()
    setTimeout.mockClear()

  it 'renders and matches snapshot', ->
    Notifications.getActive.mockReturnValue([{id: '1', message: 'A test'}])
    wrapper = shallow(<Bar {...@props} />)
    jest.runAllTimers()
    expect(wrapper.hasClass('viewable')).to.equal true
    expect(wrapper.find("SystemNotification[noticeId='1']")).to.have.length(1)

    component = SnapShot.create(<Bar {...@props} />)
    jest.runAllTimers()
    expect(component.toJSON()).toMatchSnapshot()
    undefined


  it 'starts and stops listening to notifications', ->
    wrapper = shallow(<Bar {...@props} />)
    expect(Notifications.on).toHaveBeenLastCalledWith('change', jasmine.any(Function))
    wrapper.unmount()
    expect(Notifications.off).toHaveBeenLastCalledWith('change', jasmine.any(Function))
    undefined

  it 'shows itself after a delay if there are notifications', ->
    Notifications.getActive.mockReturnValueOnce([{id: '1', message: 'A test'}])
    wrapper = shallow(<Bar {...@props} />)
    expect(wrapper.hasClass('viewable')).to.equal false
    expect(setTimeout.mock.calls.length).toBe(1)
    expect(setTimeout.mock.calls[0][1]).toBe(777)
    jest.runAllTimers()
    expect(wrapper.hasClass('viewable')).to.equal true
    undefined

  it 'displays all notifications and can dismiss them', ->
    firstNotice = {id: '1', message: 'TEST 1'}
    Notifications.getActive.mockReturnValue([firstNotice])
    wrapper = shallow(<Bar {...@props} />)
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
    wrapper = shallow(<Bar {...@props} />)
    expect(wrapper.find("SystemNotification")).to.have.length(0)
    expect(wrapper.hasClass('viewable')).to.equal false
    Notifications.getActive.mockReturnValue([{id: '42', message: 'Foo'}])
    Notifications.on.mock.calls[0][1]()
    expect(wrapper.hasClass('viewable')).to.equal true
    expect(wrapper.find("SystemNotification[noticeId='42']")).to.have.length(1)
    undefined
