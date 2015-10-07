React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'

{EcosystemsStore} = require '../../flux/ecosystems'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
ReferenceBook = require '../reference-book/reference-book'

TeacherContentToggle = require '../reference-book/teacher-content-toggle'
LoadableItem = require '../loadable-item'
QAContent = require './content'
QAExercises = require './exercises'
BookLink  = require './book-link'
QAContentToggle = require './content-toggle'

QAViewBook = React.createClass

  propTypes:
    bookId: React.PropTypes.string.isRequired
    section: React.PropTypes.string

  getInitialState: ->
    isShowingTeacherContent: true, isShowingBook: false

  renderNavbarControls: ->
    if @state.isShowingBook
      teacherContent = <TeacherContentToggle isShowing={@state.isShowingTeacherContent}
        onChange={@setTeacherContent} />

    <BS.Nav navbar right>
      <BS.NavItem>
        {teacherContent}
        <QAContentToggle isShowingBook={@state.isShowingBook} onChange={@setContentShowing}/>
      </BS.NavItem>
      <BS.DropdownButton title="Available Books" className="dropdown-toggle">
        {for book in EcosystemsStore.allBooks()
          <li key={book.id}><BookLink book={book} /></li>}
      </BS.DropdownButton>
    </BS.Nav>

  setContentShowing: (visible) ->
    @setState(isShowingBook: visible.book)

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderBook: ->
    section = @props.section or ReferenceBookStore.getFirstSection(@props.bookId).join('.')
    contentComponent = if @state.isShowingBook then QAContent else QAExercises
    <div className="qa">
      <ReferenceBook
          pageNavRouterLinkTarget='QAViewBookSection'
          menuRouterLinkTarget='QAViewBookSection'
          navbarControls={@renderNavbarControls()}
          section={section}
          className={classnames('is-teacher')}
          className={classnames('is-teacher': @state.isShowingTeacherContent)}
          ecosystemId={@props.bookId}
          contentComponent={contentComponent}
      />
    </div>

  render: ->
    <LoadableItem
      id={@props.bookId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={@renderBook}
    />



module.exports = QAViewBook
