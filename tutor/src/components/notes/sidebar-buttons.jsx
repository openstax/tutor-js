import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import cn from 'classnames';
import { Icon } from 'shared';
import { Note, PageNotes } from '../../models/notes';
import getRangeRect from './getRangeRect';

@observer
class NoteButton extends React.Component {

  static propTypes = {
    isActive: PropTypes.bool,
    note: PropTypes.instanceOf(Note).isRequired,
    highlighter: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    activeNote: PropTypes.instanceOf(Note),
    containerTop: PropTypes.number.isRequired,
    windowImpl: PropTypes.object,
  }

  calculateTop() {
    const { note, highlighter, windowImpl } = this.props ;
    const highlight = highlighter.getHighlight(note.id);
    if (!highlight) {
      return null;
    }
    const { top } = getRangeRect(windowImpl, highlight.range);
    return top;
  }

  @action.bound onClick() {
    this.props.onClick(this.props.note);
  }

  render() {

    const { note, isActive, containerTop } = this.props;
    const highlightTop = this.calculateTop();
    if (highlightTop == null) { return null; }

    const top = highlightTop - containerTop - 5;

    return (
      <Icon
        type="comment-solid"
        key={note.id}
        className={cn('sidebar-button', { active: isActive })}
        buttonProps={{ style: { top } }}
        title="View note"
        onClick={this.onClick}
      />
    );
  }
}

export default
@observer
class SidebarButtons extends React.Component {
  static propTypes = {
    notes: PropTypes.instanceOf(PageNotes).isRequired,
    parentRect: PropTypes.shape({
      top: PropTypes.number,
    }),
    highlighter: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    activeNote: PropTypes.instanceOf(Note),
    windowImpl: PropTypes.object,
  }

  @observable containerTop = null;
  // Add a resize dummy listener to listen again and get the new container rect specs
  @observable fakeRender = false;

  componentDidMount() {
    window.addEventListener('resize', () => this.fakeRender = !this.fakeRender);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.fakeRender = !this.fakeRender);
  }

  @action.bound setContainerRef(el) {
    this.containerTop = el ? getRangeRect(this.props.windowImpl, el).top : null;
  }

  renderNotes() {
    return this.props.notes.array.map(note =>
      note.annotation && (
        <NoteButton
          key={note.id}
          isActive={this.props.activeNote === note}
          containerTop={this.containerTop}
          {...this.props}
          note={note}
        />
      )
    );
  }

  render() {
    if (!this.props.highlighter) { return null; }

    return (
      <div className="note-edit-buttons" ref={this.setContainerRef} key={this.fakeRender}>
        {this.containerTop && this.renderNotes()}
      </div>
    );

  }

}
