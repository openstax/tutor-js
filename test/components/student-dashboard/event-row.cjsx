EventRow = require '../../../src/components/student-dashboard/event-row'
{Testing, expect, _, React} = require '../helpers/component-testing'

EVENT =
  "id": "118",
  "title": "Read Chapter 1",
  "opens_at": (new Date(Date.now() - 1000 * 3600 * 24)).toString(),
  "due_at": "2016-05-19T12:00:00.000Z",
  "last_worked_at": "2016-05-19T11:59:00.000Z",
  "type": "reading",
  "complete": true,
  "is_deleted": false,
  "exercise_count": 3,
  "complete_exercise_count": 3

DELETED_EVENT =
  "id": "118",
  "title": "Read Chapter 1",
  "opens_at": "2016-05-16T05:01:00.000Z",
  "due_at": "2016-05-19T12:00:00.000Z",
  "last_worked_at": "2016-05-19T11:59:00.000Z",
  "type": "reading",
  "complete": true,
  "is_deleted": true,
  "exercise_count": 3,
  "complete_exercise_count": 3

regularRow = null
deletedRow = null

describe 'Event Row', ->
  beforeEach ->
    regular = <EventRow className="testing" event={EVENT} courseId="3" feedback="" />
    deleted = <EventRow className="" event={DELETED_EVENT} courseId="3" feedback="" />
    regularRow = Testing.shallowRender(regular)
    deletedRow = Testing.shallowRender(deleted)

  it 'passes classnames to containing div', ->
    expect(regularRow.props.className.indexOf("testing")).is.not.equal(-1)

  it 'adds a deleted class for deleted tasks', ->
    expect(deletedRow.props.className.indexOf("deleted")).is.not.equal(-1)

  it 'shows the hide button when showing deleted tasks', ->
    lastColumn = _.last(deletedRow.props.children)
    dueDate = _.first(lastColumn.props.children)
    hideButton = _.last(lastColumn.props.children)

    expect(dueDate).to.be.falsy
    expect(hideButton.props.className.indexOf('-hide-button')).is.not.equal(-1)

  it 'shows withdrawn feedback when showing deleted tasks', ->
    feedbackColumn = deletedRow.props.children[2]
    feedback = feedbackColumn.props.children
    expect(feedback.props.children).to.equal("Withdrawn")

  it 'disallows onclick for event row if deletable', ->
    expect(deletedRow.props.onClick).to.be.falsy
    expect(regularRow.props.onClick).to.not.be.falsy
