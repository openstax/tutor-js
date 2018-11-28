import PropTypes from 'prop-types';
import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { get, map, filter } from 'lodash';
import { Icon } from 'shared';
import Note from '../../models/notes/note';
import getRangeRect from './getRangeRect';

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

  @autobind renderNote(note) {
    const {
      parentRect, onClick, activeNote, highlighter, windowImpl,
    } = this.props;
    const isActive = note === activeNote;
    const highlight = highlighter.getHighlight(note.id);
    if (!highlight || !parentRect) {
      return null;
    }
    const { top } = getRangeRect(windowImpl, highlight.range);

    return (
      <Icon
        type={isActive ? 'comment-solid' : 'comment'}
        key={note.id}
        className={
          cn('sidebar-button', { active: isActive })
        }
        buttonProps={{
          style: { top: top - parentRect.top },
        }}
        alt="View note"
        onClick={() => onClick(note)}
      />
    );
  }

  render() {
    if (!this.props.highlighter) {
      return null;
    }

    return (
      <div className="note-edit-buttons">
        {map(filter(this.props.notes, 'text'), this.renderNote)}
      </div>
    );

  }

};
