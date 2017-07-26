jest.mock 'model/notifications'
jest.mock 'model/ui-settings'

{Testing, sinon, _} = require 'shared/specs/helpers'
FakeWindow = require 'shared/specs/helpers/fake-window'

moment = require 'moment'
URLs = require 'model/urls'
Notifications = require 'model/notifications'
UiSettings = require 'model/ui-settings'
TEST_NOTICES = require '../../../api/notifications'

Poller = require 'model/notifications/pollers'
FakeWindow = require 'shared/specs/helpers/fake-window'

describe 'Notification Pollers', ->
  beforeEach ->
    @notices = Notifications
    @notices.windowImpl = new FakeWindow

    @tutor = Poller.forType(@notices, 'tutor')
    @tutor.onReply({
      data: {
        notifications: [
          { id: 'test', message: 'A test notice' }
        ]
      }
    })

    @accounts = Poller.forType(@notices, 'accounts')
    @accounts.onReply({
      data: {
        contact_infos: [
          {id: 1234, is_verified: false}
        ]
      }
    })
    @pollers = [@tutor, @accounts]


  it 'polls when url is set', ->
    for poller in @pollers
      expect(@notices.windowImpl.setInterval).not.to.have.been.called
      poller.setUrl('/test')
      expect(poller.url).toEqual('/test')
      expect(@notices.windowImpl.setInterval).to.have.been.called
      @notices.windowImpl.setInterval.reset()
    undefined

  it 'returns list of active notices', ->
    expect(@tutor.getActiveNotifications()).toEqual([
      { id: 'test', message: 'A test notice', type: 'tutor' }
    ])
    expect(@accounts.getActiveNotifications()).toMatchObject([
      {id: 1234, is_verified: false, type: 'accounts'}
    ])

  it 'remembers when acknowledged', ->
    for poller in @pollers
      notice = _.first poller.getActiveNotifications()
      poller.acknowledge(notice)
      expect(UiSettings.set).toHaveBeenLastCalledWith("ox-notifications-#{poller.type}", [notice.id])
    undefined

  it 'does not list items that are already acknowledged', ->
    UiSettings.get.mockReturnValue(["2"])
    @tutor.onReply(data: TEST_NOTICES)
    active = @tutor.getActiveNotifications()
    expect( _.pluck(active, 'id') ).to.deep.equal(['1']) # no id "2"
    undefined

  it 'removes outdated ids from prefs', ->
    # mock that we've observed the current notices
    UiSettings.get.mockReturnValue(['1', '2'])
    @tutor.onReply(data: TEST_NOTICES)

    # load a new set of messages that do not include the previous ones
    @tutor.onReply(
      data: { notifications: [{id: '3', message: 'message three'}] }
    )
    # 1 and 2 are removed
    expect(UiSettings.set).toHaveBeenLastCalledWith('ox-notifications-tutor', [])
    undefined
