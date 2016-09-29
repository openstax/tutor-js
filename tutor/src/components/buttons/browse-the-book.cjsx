React = require 'react'
_ = require 'underscore'
NewTabLink = require '../new-tab-link'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'BrowseTheBook'

  contextTypes:
    router: React.PropTypes.func

  getDefaultProps: ->
    bsStyle: 'primary'
    onlyShowBrowsable: true
    tabIndex: 0

  propTypes:
    courseId:  React.PropTypes.string
    ecosystemId:  React.PropTypes.string
    chapterId: React.PropTypes.number
    sectionId: React.PropTypes.number
    page:      React.PropTypes.string
    unstyled:  React.PropTypes.bool
    tabIndex:  React.PropTypes.number
    onlyShowBrowsable:  React.PropTypes.bool
    bsStyle:   React.PropTypes.string

  getLinkProps: ->
    linkProps =
      className: 'view-reference-guide'

    linkProps.className += " #{@props.className}" if @props.className
    linkProps.className += " btn btn-#{@props.bsStyle}" unless @props.unstyled

    omitProps = _.chain(@propTypes)
      .keys()
      .union(['children', 'className', 'unstyled'])
      .value()
    # most props should transfer, such as onClick
    transferProps = _.omit(@props, omitProps)

    _.extend({}, transferProps, linkProps)

  buildRouteProps: (courseId) ->
    unless @props.page
      {ecosystemId} = @props
      courseEcosystemId = CourseStore.get(courseId)?.ecosystem_id

      # only link with ecosystem id if needed.
      if ecosystemId isnt courseEcosystemId
        queryParams = {ecosystemId}

    # the router is smart enough to figure out which props are present and return the best route
    linkType = if @props.page then 'viewReferenceBookPage' else
      if @props.section then 'viewReferenceBookSection' else 'viewReferenceBook'

    routeProps =
      to: linkType
      params: {courseId, cnxId: @props.page, section:@props.section}
      query: queryParams

  getCourseId: ->
    @props.courseId or @context.router?.getCurrentParams().courseId

  canBrowse: (courseId) ->
    courseId? and not CourseStore.get(courseId)?.is_concept_coach

  render: ->
    courseId = @getCourseId()
    text = @props.children or 'Browse the Book'
    linkProps = @getLinkProps()

    # Unable to browse course-less
    unless @canBrowse(courseId)
      if @props.onlyShowBrowsable
        return null
      else
        return <span {...linkProps}>{text}</span>

    routeProps = @buildRouteProps(courseId)
    linkProps = _.extend({}, routeProps, linkProps)

    <NewTabLink {...linkProps}>{text}</NewTabLink>
