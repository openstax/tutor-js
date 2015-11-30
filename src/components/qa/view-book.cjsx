React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'
{SpyMode} = require 'openstax-react-components'

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

  propTypes:
    section: React.PropTypes.string
    ecosystemId: React.PropTypes.string.isRequired

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
      <BS.DropdownButton title="Available Books" className="available-books">
        {for book in EcosystemsStore.allBooks()
          <li key={book.id} className={'active' if @props.ecosystemId is book.ecosystemId}>
            <BookLink book={book} />
          </li>}
      </BS.DropdownButton>
      <UserActionsMenu />
    </BS.Nav>

  setContentShowing: (visible) ->
    @setState(isShowingBook: visible.book)

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderBook: ->
    section = @props.section or ReferenceBookStore.getFirstSection(@props.ecosystemId).join('.')
    contentComponent = if @state.isShowingBook then QAContent else QAExercises
    <SpyMode.Wrapper>
      <div className="qa">
        <ReferenceBook
            pageNavRouterLinkTarget='QAViewBookSection'
            menuRouterLinkTarget='QAViewBookSection'
            navbarControls={@renderNavbarControls()}
            section={section}
            className={classnames('is-teacher')}
            className={classnames('is-teacher': @state.isShowingTeacherContent)}
            ecosystemId={@props.ecosystemId}
            contentComponent={contentComponent}
        />
      </div>
    </SpyMode.Wrapper>

  render: ->
    <LoadableItem
      id={@props.ecosystemId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={@renderBook}
    />

module.exports = QAViewBook
