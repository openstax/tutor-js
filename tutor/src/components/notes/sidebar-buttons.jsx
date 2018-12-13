import PropTypes from 'prop-types';
import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import cn from 'classnames';
import { get, map, filter } from 'lodash';
import { Icon } from 'shared';
import Note from '../../models/notes/note';
import getRangeRect from './getRangeRect';

@observer
class NoteButton extends React.Component {

  calculateTop() {
    const { windowImpl, containerTop, note, parentRect, highlighter } = this.props ;

    const highlight = highlighter.getHighlight(note.id);
    if (!highlight || !parentRect) {
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
    const {
      note, isActive, containerTop,
    } = this.props;

    if (highlightTop == null || containerTop == null) { return null; }

    const top = this.highlightTop - containerTop + 85;

    return (
      <Icon
        type={isActive ? 'comment-solid' : 'comment'}
        key={note.id}
        className={cn('sidebar-button', { active: isActive })}
        buttonProps={{ style: { top } }}
        alt="View note"
        onClick={this.onClick}
      />
    );
  }
}

export default
@observer
class SidebarButtons extends React.Component {
  static propTypes = {
    editing: PropTypes.instanceOf(Note),
    notes: PropTypes.arrayOf(
      PropTypes.instanceOf(Note)
    ).isRequired,
    parentRect: PropTypes.shape({
      top: PropTypes.number,
    }),
    onClick: PropTypes.func.isRequired,
    activeNote: PropTypes.instanceOf(Note),
  }

  @observable containerTop;

  @action.bound setParentRef(r) {
    this.containerTop = r ? r.getBoundingClientRect().top : 0;
  }

  render() {
    if (!this.props.highlighter) { return null; }

    return (
      <div className="note-edit-buttons" ref={this.setParentRef}>
      {filter(this.props.notes, 'text').map(note =>
        <NoteButton
          key={note.id}
          {...this.props}
          containerTop={this.containerTop}
          note={note}
        />
      )}
      </div>
    );

  }

};
