React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
TutorLink = require '../link'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

CourseName = React.createClass
  displayName: 'CourseName'

  propTypes:
    course: React.PropTypes.object

  mixins: [BindStoreMixin]
  bindStore: CourseStore

  render: ->

    {course} = @props
    course = CourseStore.get(course?.id)
    return null unless course

    <TutorLink
      to='dashboard'
      params={courseId: course.id}
      className='navbar-brand'>
      <div className="course-name">{course.name}</div>
    </TutorLink>



module.exports = CourseName
