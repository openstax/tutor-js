_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

Router = require '../helpers/router'
BindStoreMixin = require './bind-store-mixin'
{ReferenceBookActions, ReferenceBookStore} = require '../flux/reference-book'
{default: Courses} = require '../models/courses-map'

AssignmentLinks = React.createClass
  displayName: 'AssignmentLinks'
  mixins: [BindStoreMixin]
  bindStore: ReferenceBookStore

  componentWillMount: ->
    {courseId} = _.defaults(Router.currentParams(), @props)

    course = Courses.get(courseId)
    @setState(ecosystem_id: course.ecosystem_id)
    ReferenceBookActions.load(course.ecosystem_id)

  renderRow: (item, baseUrl, bookId) ->
    chapter_section = item.chapter_section.join('.')

    pageId = item.short_id or item.uuid
    url = "#{baseUrl}/contents/#{bookId}:#{pageId}/#{chapter_section}"

    link =
      if (item.type is "page") and (item.chapter_section[1] isnt 0)
        <a href="#{url}">{url}</a>
      else
        null

    row =
      <tr key={item.id} data-section-id={item.id}>
        <td>{chapter_section}</td>
        <td>
          <span className="title">{item.title}</span>
          {link}
        </td>
      </tr>

    if item.chapter_section.length is 1
      <tbody key={item.id}>
        {row}
        { _.map item.children, (child) => @renderRow(child, baseUrl, bookId) }
      </tbody>
    else
      row

  render: ->
    toc = ReferenceBookStore.getToc(@state.ecosystem_id)

    return null if not toc?.children?

    bookId = toc.short_id or toc.uuid
    baseUrl = toc.webview_url or 'https://cnx.org'

    <BS.Panel className="assignment-links">
      <span className='assignment-links-title'>Assignment Links</span>

      <p>Here are 3 easy steps to assigning Concept Coach:</p>

      <ol>
        <li>Find the textbook sections you want to assign in the list below.</li>
        <li>Copy and paste the corresponding links into your syllabus or LMS.
            <small>We recommend setting your LMS to open the link in a new tab.</small></li>
        <li>Your students will be able to launch Concept Coach from the bottom of each section.</li>
      </ol>

      <table>
        { _.map toc.children, (child) => @renderRow(child, baseUrl, bookId)  }
      </table>

    </BS.Panel>

module.exports = AssignmentLinks
