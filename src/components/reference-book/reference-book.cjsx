React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
CourseDataMixin = require '../course-data-mixin'
NavBar = require './navbar'
Menu = require './slide-out-menu'

{CourseListingStore} = require '../../flux/course-listing'
{CourseStore} = require '../../flux/course'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

# menu width (300) + page width (1000) + 50 px padding
# corresponds to @reference-book-page-width and @reference-book-menu-width in variables.less
MENU_VISIBLE_BREAKPOINT = 1350

module.exports = React.createClass
  displayName: 'ReferenceBook'
  contextTypes:
    router: React.PropTypes.func
  mixins: [BindStoreMixin, CourseDataMixin]
  bindStore: CourseListingStore
  bindEvent: 'loaded'

  componentWillMount: ->
    {courseId, cnxId, section} = @context.router.getCurrentParams()

    unless cnxId? or section?
      section = ReferenceBookStore.getFirstSection(courseId)
      @context.router.transitionTo('viewReferenceBookSection', {courseId, section})
      return

    CourseListingStore.ensureLoaded()

  getPageProps: ->
    params = {courseId, cnxId, section} = @context.router.getCurrentParams()
    return params if courseId? and cnxId? and section?

    if section?
      page = ReferenceBookStore.getChapterSectionPage({courseId, section})
    else if cnxId?
      page = ReferenceBookStore.getPageInfo({courseId, cnxId})
      section = page.chapter_section

    cnxId ?= page?.cnx_id

    {cnxId, section, courseId}

  getInitialState: ->
    {cnxId} = @context.router.getCurrentParams()
    # Pop open the menu unless the page was explicitly navigated to
    {isMenuVisible: not cnxId}

  toggleTeacherEdition: (ev) ->
    @setState(showTeacherEdition: not @state.showTeacherEdition)
    ev?.preventDefault() # stops react-router from scrolling to top

  onMenuClick: ->
    @toggleMenuState() unless window.innerWidth > MENU_VISIBLE_BREAKPOINT

  toggleMenuState: (ev) ->
    @setState(isMenuVisible: not @state.isMenuVisible)
    ev?.preventDefault() # needed to prevent scrolling to top

  render: ->
    {courseId} = @context.router.getCurrentParams()
    courseDataProps = @getCourseDataProps(courseId)
    pageProps = @getPageProps()

    course = CourseStore.get(courseId)
    classnames = ["reference-book"]
    classnames.push('menu-open') if @state.isMenuVisible
    if course and _.findWhere(course.roles, type: 'teacher')
      toggleTeacher = @toggleTeacherEdition
      teacherLinkText = if @state.showTeacherEdition
        classnames.push('is-teacher')
        "Hide Teacher Edition"
      else
        "Show Teacher Edition"

    <div {...courseDataProps} className={classnames.join(' ')}>
      <NavBar
        {...pageProps}
        toggleTocMenu={@toggleMenuState}
        teacherLinkText={teacherLinkText}
        showTeacherEdition={toggleTeacher} />
      <div className="content">
        <Menu {...pageProps} onMenuSelection={@onMenuClick} />
        <Router.RouteHandler {...pageProps} />
      </div>
    </div>
