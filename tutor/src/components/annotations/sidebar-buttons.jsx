import PropTypes from 'prop-types';
import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { get, map, filter } from 'lodash';
import Icon from '../icon';
import Annotation from '../../models/annotations/annotation';
import getRangeRect from './getRangeRect';

export default
@observer
class SidebarButtons extends React.Component {
  static propTypes = {
    editing: PropTypes.instanceOf(Annotation),
    annotations: PropTypes.arrayOf(
      PropTypes.instanceOf(Annotation)
    ).isRequired,
    parentRect: PropTypes.shape({
      top: PropTypes.number,
    }),
    onClick: PropTypes.func.isRequired,
    activeAnnotation: PropTypes.instanceOf(Annotation),
  }

  @autobind renderAnnotation(note) {
    const {
      parentRect, onClick, activeAnnotation, highlighter, windowImpl
    } = this.props;
    const isActive = note === activeAnnotation;
    const highlight = highlighter.getHighlight(note.id);

    if (!highlight || !parentRect) {
      return null;
    }

    const {top} = getRangeRect(windowImpl, highlight.range);

    return (
      <Icon
        type={isActive ? 'comment' : 'comment-o'}
        key={note.id}
        className={
          cn('sidebar-button', { active: isActive })
        }
        style={{top: top - parentRect.top}}
        alt="View annotation"
        onClick={() => onClick(note)}
      />
    );
  }

  render() {
    if (!this.props.highlighter) {
      return null;
    }

    return (
      <div className="annotation-edit-buttons">
        {map(filter(this.props.annotations, 'text'), this.renderAnnotation)}
      </div>
    );

  }

};
