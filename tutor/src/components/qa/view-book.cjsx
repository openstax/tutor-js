React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'
{SpyMode} = require 'shared'

Router = require '../../helpers/router'

{EcosystemsStore} = require '../../flux/ecosystems'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

ReferenceBook        = require '../reference-book/reference-book'
TeacherContentToggle = require '../reference-book/teacher-content-toggle'
LoadableItem         = require '../loadable-item'
QAContent            = require './content'
QAExercises          = require './exercises'
BookLink             = require './book-link'
QAContentToggle      = require './content-toggle'
UserActionsMenu      = require '../navbar/user-actions-menu'

QAViewBook = React.createClass
  displayName: 'QAViewBook'
  getInitialState: ->
    isShowingTeacherContent: true, isShowingBook: false

  renderNavbarControls: ->
    {ecosystemId, section} = Router.currentParams()
    if @state.isShowingBook
      teacherContent = <TeacherContentToggle isShowing={@state.isShowingTeacherContent}
        onChange={@setTeacherContent} />

    <BS.Nav navbar pullRight>
      {teacherContent}
      <BS.NavDropdown title="Available Books" id='available-books' className="available-books">
        {for book in EcosystemsStore.allBooks()
          <li key={book.id} className={'active' if ecosystemId is book.ecosystemId}>
            <BookLink book={book} />
          </li>}
      </BS.NavDropdown>
      <UserActionsMenu />
      <QAContentToggle isShowingBook={@state.isShowingBook} onChange={@setContentShowing}/>
    </BS.Nav>


  setContentShowing: (visible) ->
    @setState(isShowingBook: visible.book)

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderBook: ->
    {ecosystemId, section} = Router.currentParams()
    section = section or ReferenceBookStore.getFirstSection(ecosystemId).join('.')
    contentComponent = if @state.isShowingBook then QAContent else QAExercises

    <ReferenceBook
      pageNavRouterLinkTarget='QAViewBookSection'
      menuRouterLinkTarget='QAViewBookSection'
      navbarControls={@renderNavbarControls()}
      section={section}
      className={classnames('qa', 'is-teacher': @state.isShowingTeacherContent)}
      ecosystemId={ecosystemId}
      contentComponent={contentComponent}
    />


  render: ->
    {ecosystemId, section} = Router.currentParams()

    <LoadableItem
      id={ecosystemId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={@renderBook}
    />

module.exports = QAViewBook
