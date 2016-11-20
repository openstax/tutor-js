React = require 'react'
BS = require 'react-bootstrap'
Icon = require '../icon'
TutorLink = require '../link'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
OXFancyLoader = require '../ox-fancy-loader'

BuildCourse = React.createClass
  displayName: 'BuildCourse'
  statics:
    Footer: ({course}) ->
      controls = if course?
        <TutorLink
          to={if course.is_concept_coach then 'ccDashboardHelp' else 'dashboard'}
          params={courseId: course.id}
          query={showIntro: 'true'}
          className='btn btn-primary next'
        >
          Continue to new course
        </TutorLink>
      else
        <BS.Button bsStyle='primary' className='next'>
          Continue to new course
        </BS.Button>

      <div className="controls">
        {controls}
      </div>
    title: 'Your new course is ready!'

  componentWillMount: ->
    NewCourseActions.save()

  renderSaved: (newCourse) ->
    <div>
      <h4>You can now continue to your new course.</h4>
    </div>

  renderPending: ->
    # covered by loading animation
    <div>
      <h4>We’re building your Tutor course…</h4>
      <p>Should take about 10 seconds</p>
    </div>

  render: ->
    newCourse = NewCourseStore.newCourse()
    if newCourse
      @renderSaved(newCourse)
    else
      @renderPending()


module.exports = BuildCourse
