React = require 'react'
BS = require 'react-bootstrap'
find = require 'lodash/find'
filter = require 'lodash/filter'
isEmpty = require 'lodash/isEmpty'

classnames = require 'classnames'

{CourseListingStore} = require '../../flux/course-listing'


PastCourses = React.createClass
  getInitialState: ->
    activeTab: 1

  handleTabSelect: (activeTab) ->
    @setState({activeTab})

  SourcePicker: ->
    return null unless @state.activeTab is 2
    <div className="source-course">
      <BS.Table bordered>
        <tbody>
          {for course in @props.courses
            <tr key={course.id}
              className={classnames(selected: @props.selected is course.id)}
              onClick={_.partial(@props.onSelect, course.id)}>
              <td>{course.name}</td>
            </tr>}
        </tbody>
      </BS.Table>
      <BS.Form inline>
        <BS.FormGroup controlId='ql'>
           <BS.FormControl
             type="checkbox"
             disabled={not @props.selected}
             checked={@props.copy_ql}
             onChange={@props.setQL}
           /> <BS.ControlLabel>Keep Question Library exclusions</BS.ControlLabel>
        </BS.FormGroup>
      </BS.Form>
    </div>

  render: ->
    return null if isEmpty(@props.courses)

    <div className="other-courses">
      <BS.Nav bsStyle="pills" justified
        activeKey={@state.activeTab}
        onSelect={this.handleTabSelect}
      >
        <BS.NavItem eventKey={1} href="/home">Create a new course</BS.NavItem>
        <BS.NavItem eventKey={2} title="Item">copy a past course</BS.NavItem>
      </BS.Nav>
      <@SourcePicker />
    </div>

SelectCourse = React.createClass

  getInitialState: ->
    course_name: ''
    source_course_id: null
    copy_ql: true
    section_count: 1
    teachingCourses: filter(CourseListingStore.allCourses(), (course) =>
      course.appearance_code is @props.course_code and find(course.roles, type: 'teacher')
    )

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    onCancel: React.PropTypes.func.isRequired
    course_code: React.PropTypes.string.isRequired

  Footer: ->
    <div className="controls">
      <BS.Button onClick={@props.onCancel}>Cancel</BS.Button>
      <BS.Button onClick={@onContinue} disabled={isEmpty(@state.course_name)}
        bsStyle="primary">Continue</BS.Button>
    </div>

  onContinue: ->
    @props.onContinue(quarter: @state.selected)

  onSelect: (source_course_id) ->
    source_course_id = null if source_course_id is @state.source_course_id
    @setState({source_course_id})


  updateName: (ev) ->
    @setState(course_name: ev.target.value)

  setQL: (ev) ->
    @setState(copy_ql: ev.target.checked)

  updateSectionCount: ->
    @setState(section_count: ev.target.value)

  render: ->
    <BS.Panel className="course-details" footer={<@Footer />}>

      <PastCourses courses={@state.teachingCourses}
        onSelect={@onSelect}
        copy_ql={@state.copy_ql}
        setQL={@setQL}
        selected={@state.source_course_id} />

      <BS.FormGroup>
        <BS.ControlLabel>Name of new course:</BS.ControlLabel>
        <BS.FormControl autoFocus
          type="text"
          value={@state.course_name}
          onChange={@updateName}
        />
      </BS.FormGroup>
      <BS.Form inline>
        <BS.FormGroup className="section-count">
          <BS.ControlLabel>Number of sections</BS.ControlLabel>
          <BS.FormControl autoFocus
            type="text"
            value={@state.section_count}
            onChange={@updateSectionCount}
          />
        </BS.FormGroup>
      </BS.Form>

    </BS.Panel>



module.exports = SelectCourse
