import PropTypes from 'prop-types';
import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import cn from 'classnames';
import { get, map, filter } from 'lodash';
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

  highlightTop = this.calculateTop()

  @action.bound onClick() {
    this.props.onClick(this.props.note);
  }

  render() {
    const { highlightTop } = this;
    const { note, isActive, containerTop } = this.props;

    if (highlightTop == null) { return null; }

    const top = this.highlightTop - containerTop;

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
  }


  @observable containerTop = null;

  @action.bound setContainerRef(el) {
    this.containerTop = el ? getRangeRect(this.props.windowImpl, el).top : null
  }

  renderNotes() {
    return filter(this.props.notes, 'text').map(note =>
      <NoteButton
        key={note.id}
        isActive={this.props.activeNote === note}
        containerTop={this.containerTop}
        {...this.props}
        note={note}
      />
    );
  }

  render() {
    if (!this.props.highlighter) { return null; }

    return (
      <div className="note-edit-buttons" ref={this.setContainerRef}>
        {this.containerTop && this.renderNotes()}
      </div>
    );

  }

};
