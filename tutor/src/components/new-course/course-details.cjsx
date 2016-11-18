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
  displayName: 'CourseDetails'
  statics:
    title: 'Name your course'

  componentWillMount: ->
    NewCourseActions.set({num_sections: 1}) unless NewCourseStore.get('num_sections')

  updateName: (ev) ->
    NewCourseActions.set({name: ev.target.value})

  updateSectionCount: (ev) ->
    NewCourseActions.set({num_sections: parseInt(ev.target.value, 10)})

  render: ->
    <BS.Form>
      <BS.FormGroup className='course-details-name'>
        <BS.InputGroup>
          <BS.InputGroup.Addon>Name of course</BS.InputGroup.Addon>
          <BS.FormControl autoFocus
            type="text"
            value={NewCourseStore.get('name') or ''}
            onChange={@updateName}
          />
        </BS.InputGroup>
      </BS.FormGroup>
      <BS.FormGroup className='course-details-sections'>
        <BS.InputGroup>
          <BS.InputGroup.Addon>Number of sections</BS.InputGroup.Addon>
          <BS.FormControl
            type='number'
            min='1'
            value={NewCourseStore.get('num_sections')}
            onChange={@updateSectionCount}
          />
        </BS.InputGroup>
        <p className='course-details-sections-note'>
          <small><i>(You can add or remove sections later)</i></small>
        </p>
      </BS.FormGroup>
    </BS.Form>

module.exports = CourseDetails
