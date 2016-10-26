React = require 'react'
BS = require 'react-bootstrap'
find = require 'lodash/find'
filter = require 'lodash/filter'
isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'

classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

{CourseListingStore} = require '../../flux/course-listing'

PastCourses = React.createClass
  getInitialState: ->
    activeTab: 1

  handleTabSelect: (activeTab) ->
    if activeTab is 1
      NewCourseActions.set(source_course_id: null)
    @setState({activeTab})

  SourcePicker: ->
    return null unless @state.activeTab is 2
    <div className="source-course">
      <BS.Table bordered>
        <tbody>
          {for course in @props.courses
            <tr key={course.id}
              className={classnames(selected: @props.selected is course.id)}
              onClick={partial(@props.onSelect, course.id)}>
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

CourseDetails = React.createClass

  getInitialState: ->
    course_name: ''
    source_course_id: null
    copy_ql: true
    section_count: 1
    teachingCourses: filter(CourseListingStore.allCourses(), (course) ->
      course.appearance_code is NewCourseStore.get('course_code') and find(course.roles, type: 'teacher')
    )

  onContinue: ->
    @props.onContinue(quarter: @state.selected)

  onSelect: (source_course_id) ->
    prev_selected_id = NewCourseStore.get('source_course_id')
    source_course_id = null if source_course_id is prev_selected_id
    course_name = @state.course_name
    newCourse = find(@state.teachingCourses, id: source_course_id)

    if newCourse
      # is the current name blank or the same as the previous course?
      if isEmpty(course_name) or (
        prev_selected_id and find(@state.teachingCourses, id: prev_selected_id).name is course_name
      )
        course_name = newCourse.name
    else
      course_name = ''

    NewCourseActions.set({course_name, source_course_id})

  updateName: (ev) ->
    NewCourseActions.set({course_name: ev.target.value})

  setQL: (ev) ->
    NewCourseActions.set({should_copy_question_library: ev.target.checked})

  updateSectionCount: (ev) ->
    NewCourseActions.set({number_of_sections: parseInt(ev.target.value, 10)})

  render: ->

    <div className="course-details" >

      <PastCourses courses={@state.teachingCourses}
        onSelect={@onSelect}
        copy_ql={NewCourseStore.get('should_copy_question_library')}
        setQL={@setQL}
        selected={NewCourseStore.get('source_course_id')} />

      <BS.FormGroup>
        <BS.ControlLabel>Name of new course:</BS.ControlLabel>
        <BS.FormControl autoFocus
          type="text"
          value={NewCourseStore.get('course_name')}
          onChange={@updateName}
        />
      </BS.FormGroup>
      <BS.Form inline>
        <BS.FormGroup className="section-count">
          <BS.ControlLabel>Number of sections</BS.ControlLabel>
          <BS.FormControl autoFocus
            type="text"
            value={NewCourseStore.get('section_count')}
            onChange={@updateSectionCount}
          />
        </BS.FormGroup>
      </BS.Form>

    </div>



module.exports = CourseDetails
