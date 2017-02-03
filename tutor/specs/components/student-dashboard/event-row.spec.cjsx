EventRow = require '../../../src/components/student-dashboard/event-row'
{Testing, _, React} = require '../helpers/component-testing'

EVENT =
  'id': '118',
  'title': 'Read Chapter 1',
  'opens_at': (new Date(Date.now() - 1000 * 3600 * 24)).toString(),
  'due_at': '2016-05-19T12:00:00.000Z',
  'last_worked_at': '2016-05-19T11:59:00.000Z',
  'type': 'reading',
  'complete': true,
  'is_deleted': false,
  'exercise_count': 3,
  'complete_exercise_count': 3

DELETED_EVENT =
  'id': '118',
  'title': 'Read Chapter 1',
  'opens_at': '2016-05-16T05:01:00.000Z',
  'due_at': '2016-05-19T12:00:00.000Z',
  'last_worked_at': '2016-05-19T11:59:00.000Z',
  'type': 'reading',
  'complete': true,
  'is_deleted': true,
  'exercise_count': 3,
  'complete_exercise_count': 3

DELETED_NOT_STARTED_EVENT =
  'id': '118',
  'title': 'Read Chapter 1',
  'opens_at': '2016-05-16T05:01:00.000Z',
  'due_at': '2016-05-19T12:00:00.000Z',
  'last_worked_at': '2016-05-19T11:59:00.000Z',
  'type': 'reading',
  'complete': true,
  'is_deleted': true,
  'exercise_count': 3,
  'complete_exercise_count': 0

regularRow = null
deletedRow = null
deletedNotStartedRow = null

describe 'Event Row', ->
  beforeEach ->
    regular = <EventRow
      className='testing'
      event={EVENT}
      eventType='generic'
      isCollege={false}
      courseId='3'
      feedback=''
    />
    deleted = <EventRow
      className=''
      event={DELETED_EVENT}
      eventType='generic'
      isCollege={false}
      courseId='3'
      feedback=''
    />
    deletedNotStarted = <EventRow
      className=''
      event={DELETED_NOT_STARTED_EVENT}
      eventType='generic'
      isCollege={false}
      courseId='3'
      feedback=''
    />
    regularRow = mount(regular)
    deletedRow = mount(deleted)
    deletedNotStartedRow = mount(deleted)

  it 'passes classnames to containing div for eventType', ->
    expect(regularRow.find('.task').hasClass('generic')).to.be.true
    undefined

  it 'adds a deleted class for deleted tasks', ->
    expect(deletedRow.find('.task').hasClass('deleted')).to.be.true
    undefined

  it 'shows the hide button when showing deleted tasks', ->
    expect(deletedRow.find('button')).to.have.length(1)
    expect(deletedRow.find('button').hasClass('hide-task')).to.be.true
    undefined

  it 'shows withdrawn in due column when showing deleted tasks', ->
    expect(deletedRow.find('.due-at').text()).to.equal('Withdrawn')
    undefined

  it 'allows onclick for event row if deleted', ->
    expect(deletedRow.find('a').prop('onClick')).to.not.be.falsy
    expect(regularRow.find('a').prop('onClick')).to.not.be.falsy
    undefined

  it 'disallows onclick for event row if deleted and not started', ->
    expect(deletedNotStartedRow.props.onClick).to.be.falsy
    expect(regularRow.props.onClick).to.not.be.falsy
    undefined
