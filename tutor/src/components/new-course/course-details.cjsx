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
    activeTab: if NewCourseStore.get('offering_id') then 2 else 1

  handleTabSelect: (activeTab) ->
    if activeTab is 1
      NewCourseActions.set(cloned_from_id: null)
      NewCourseActions.set(name: null)
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
    teachingCourses: filter(CourseListingStore.allCourses(), (course) ->
      course.offering_id is NewCourseStore.get('offering_id') and find(course.roles, type: 'teacher')
    )

  onContinue: ->
    @props.onContinue(quarter: @state.selected)

  onSelect: (cloned_from_id) ->
    prev_selected_id = NewCourseStore.get('cloned_from_id')
    cloned_from_id = null if cloned_from_id is prev_selected_id
    name = NewCourseStore.get('name')
    newCourse = find(@state.teachingCourses, id: cloned_from_id)

    if newCourse
      # is the current name blank or the same as the previous course?
      if isEmpty(name) or (
        prev_selected_id and find(@state.teachingCourses, id: prev_selected_id).name is name
      )
        name = newCourse.name
        num_sections = newCourse.periods.length
    else
      num_sections = NewCourseStore.get('num_sections')
      name = ''

    NewCourseActions.set({name, cloned_from_id, num_sections})

  updateName: (ev) ->
    NewCourseActions.set({name: ev.target.value})

  updateSectionCount: (ev) ->
    NewCourseActions.set({num_sections: parseInt(ev.target.value, 10)})

  render: ->

    <div className="course-details" >

      <PastCourses courses={@state.teachingCourses}
        onSelect={@onSelect}
        selected={NewCourseStore.get('cloned_from_id')} />

      <BS.FormGroup className='course-name'>
        <BS.ControlLabel>Name of new course:</BS.ControlLabel>
        <BS.FormControl autoFocus
          type="text"
          value={NewCourseStore.get('name') or ''}
          onChange={@updateName}
        />
      </BS.FormGroup>
      <BS.Form inline>
        <BS.FormGroup className="section-count">
          <BS.ControlLabel>Number of sections</BS.ControlLabel>
          <BS.FormControl
            type="text"
            value={NewCourseStore.get('num_sections') or ''}
            onChange={@updateSectionCount}
          />
        </BS.FormGroup>
      </BS.Form>

    </div>



module.exports = CourseDetails
