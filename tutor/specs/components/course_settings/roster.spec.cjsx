{React, Testing, pause, sinon, _, ReactTestUtils} = require '../helpers/component-testing'
ld = require 'lodash'
Roster = require '../../../src/components/course-settings/roster'
{ bootstrapCoursesList } = require('../../courses-test-data')
COURSE = require '../../../api/user/courses/1.json'
ROSTER = require '../../../api/courses/1/roster.json'

COURSE_ID = '1'

{CourseActions} = require '../../../src/flux/course'
{PeriodActions} = require '../../../src/flux/period'
{RosterActions} = require '../../../src/flux/roster'

describe 'Course Settings', ->

  beforeEach ->
    bootstrapCoursesList()
    CourseActions.loaded(COURSE, COURSE_ID)
    RosterActions.loaded(ROSTER, COURSE_ID)
    sinon.stub(PeriodActions, 'delete', (periodId) ->
      PeriodActions._deleted(arguments...)
      course = ld.cloneDeep(COURSE)
      period = _.findWhere(course.periods, id: periodId)
      period.is_archived = true
      CourseActions.loaded(course, COURSE_ID)
    )
    sinon.stub(PeriodActions, 'restore').returns(null)
    @props =
      courseId: COURSE_ID

  afterEach ->
    PeriodActions.delete.restore()
    PeriodActions.restore.restore()

  it 'renders period panels', ->
    wrapper = mount(<Roster {...@props} />)
    for period, i in ['1st', '2nd', '3rd', '5th', '6th', '10th']
      expect(wrapper.find('.periods .nav-tabs li').at(i).text())
        .to.equal(period)
    undefined

  it 'renders students in the panels', ->
    wrapper = mount(<Roster {...@props} />)
    for name, i in ['Angstrom', 'Glass', 'Hackett', 'Jaskolski', 'Lowe', 'Tromp', 'Reilly']
      expect(wrapper.find('.roster tbody tr').at(i).find('td').at(1).text())
        .to.equal(name)
    undefined

  it 'switches roster when tab is clicked', ->
    wrapper = mount(<Roster {...@props} />)
    tab = wrapper.find('.periods .nav-tabs li').at(1).find('a')
    tab.simulate('click')
    expect(wrapper.find('.roster tbody tr').at(0).find('td').at(1).text())
      .to.equal('Bloom')
    expect(wrapper.find('.roster tbody tr').at(1).find('td').at(1).text())
      .to.equal('Kirlin')
    undefined

  it 'can archive periods', ->
    wrapper = mount(<Roster {...@props} />)
    expect(wrapper.find('.nav-tabs .active').text()).to.equal('1st')
    wrapper.find('.control.delete-period').simulate('click')

    modal = _.last document.querySelectorAll('.settings-delete-period-modal')
    expect(modal).to.exist
    Testing.actions.click(modal.querySelector('button.delete'))
    expect(PeriodActions.delete).to.have.been.called
    wrapper.update()
    expect(wrapper.find('.nav-tabs .active').text()).to.equal('2nd')
    expect(wrapper.find('.roster tbody tr').at(0).find('td').at(1).text())
      .to.equal('Bloom')
    undefined

  it 'can view and unarchive periods', ->
    wrapper = mount(<Roster {...@props} />)
    wrapper.find('.view-archived-periods button').simulate('click')
    periods = _.pluck(document.querySelectorAll(
      '.settings-view-archived-periods-modal tbody td:first-child'), 'textContent'
    )

    expect(periods).to.deep.equal(['4th', '7th'])
    Testing.actions.click(
      document.querySelector('.settings-view-archived-periods-modal .restore-period .btn')
    )
    expect(PeriodActions.restore).to.have.been.called
    undefined
