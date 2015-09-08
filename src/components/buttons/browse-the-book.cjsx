React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'BrowseTheBook'

  contextTypes:
    router: React.PropTypes.func

  getDefaultProps: ->
    bsStyle: 'primary'

  propTypes:
    courseId:  React.PropTypes.string
    ecosystemId:  React.PropTypes.string
    chapterId: React.PropTypes.number
    sectionId: React.PropTypes.number
    page:      React.PropTypes.string
    unstyled:  React.PropTypes.bool
    bsStyle:   React.PropTypes.string

  getLinkProps: (link) ->
    linkProps = {target:'_blank', className:'view-reference-guide', href: link}
    linkProps.className += " #{@props.className}" if @props.className
    text = @props.children or 'Browse the Book'

    omitProps = _.chain(@propTypes)
      .keys()
      .union(['children', 'className', 'unstyled'])
      .value()
    # sometimes, props should transfer, such as onClick
    transferProps = _.omit(@props, omitProps)

    _.extend({}, transferProps, linkProps)

  render: ->
    courseId = @props.courseId or @context.router.getCurrentParams().courseId

    return null unless courseId # if we don't have a course id we can't browse it's book

    unless @props.page
      {ecosystemId} = @props
      courseEcosystemId = CourseStore.get(courseId)?.ecosystem_id

      # only link with ecosystem id if needed.
      if ecosystemId isnt courseEcosystemId
        queryParams = {ecosystemId}

    # the router is smart enough to figure out which props are present and return the best route
    linkType = if @props.page then 'viewReferenceBookPage' else
      if @props.section then 'viewReferenceBookSection' else 'viewReferenceBook'
    link = @context.router.makeHref( linkType, {courseId, cnxId: @props.page, section:@props.section}, queryParams )

    linkProps = @getLinkProps(link)
    text = @props.children or 'Browse the Book'

    if @props.unstyled
      <a {...linkProps}>{text}</a>
    else
      <BS.Button bsStyle={@props.bsStyle} {...linkProps}>{text}</BS.Button>
