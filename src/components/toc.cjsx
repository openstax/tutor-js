_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
WindowHelpers = require '../helpers/window'

BindStoreMixin = require './bind-store-mixin'
{ReferenceBookActions, ReferenceBookStore} = require '../flux/reference-book'
{CourseStore} = require '../flux/course'

Toc = React.createClass
  displayName: 'Toc'
  mixins: [BindStoreMixin]
  bindStore: ReferenceBookStore

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)
    @ecosystem_id = course.ecosystem_id
    ReferenceBookActions.load(course.ecosystem_id)

  renderBullet: (item) ->
    line = "#{item.chapter_section.join('.')} #{item.title}"

    if item.type is "page"
      line = <a href="https://cnx.org/contents/#{item.cnx_id}">{line}</a>

    <li>{line}
      <ul>
        { _.map item.children, (child) => @renderBullet(child) }
      </ul>
    </li>

  renderRow: (item) ->
    return null if item.chapter_section[1] == 0

    if item.chapter_section.length == 1
      return _.map item.children, (child) => @renderRow(child)

    line = "#{item.title}"

    if item.type is "page"
      line = <a href="https://cnx.org/contents/#{item.cnx_id}">{line}</a>

    <tr>
      <td>{item.chapter_section.join('.')}</td>
      <td>{line}</td>
    </tr>

  render: ->
    toc = ReferenceBookStore.getToc(@ecosystem_id)
    return null if !toc?.children?

    <BS.Panel className="assignment-links">
      <span className='assignment-links-title'>Assignment Links</span>

      <p>Here are 3 easy steps to assigning Concept Coach.</p>

      <ol>
        <li>Identify the textbook sections you wish to assign to your students.</li>
        <li>For each section you wish to assign, copy and paste the corresponding links
            for those sections into your syllabus or your LMS assignment builder. For
            the best experience for your students, enable your LMS to load the URL in
            a new browser tab.</li>
        <li>When your students click one of the links, they will be taken to the textbook.
            After reading the text, they will be prompted to launch OpenStax Concept Coach
            to access the assigned questions!</li>
      </ol>

      <hr/>

      <ul>
        { _.map toc.children, (child) => @renderBullet(child)  }
      </ul>

      <hr/>

      <table className="table">
        <thead>
          <tr>
            <td>Section</td>
            <td>Link to Textbook and Corresponding Concept Coach</td>
          </tr>
        </thead>
        <tbody>
          { _.map toc.children, (child) => @renderRow(child)  }
        </tbody>
      </table>

    </BS.Panel>

module.exports = {Toc}
