React = require 'react'
BS = require 'react-bootstrap'
find = require 'lodash/find'
filter = require 'lodash/filter'
isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'

classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

{CourseListingStore} = require '../../flux/course-listing'


CourseDetails = React.createClass
  statics:
    title: 'Name your course'

  updateName: (ev) ->
    NewCourseActions.set({name: ev.target.value})

  updateSectionCount: (ev) ->
    NewCourseActions.set({num_sections: parseInt(ev.target.value, 10)})

  render: ->

    <div className="course-details" >
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
