import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { get, map, filter } from 'lodash';
import Icon from '../icon';
import Annotation from '../../models/annotations/annotation';
import getRangeRect from './getRangeRect';

@observer
export default class SidebarButtons extends React.Component {
  static propTypes = {
    editing: React.PropTypes.instanceOf(Annotation),
    annotations: React.PropTypes.arrayOf(
      React.PropTypes.instanceOf(Annotation)
    ).isRequired,
    parentRect: React.PropTypes.shape({
      top: React.PropTypes.number,
    }),
    onClick: React.PropTypes.func.isRequired,
    activeAnnotation: React.PropTypes.instanceOf(Annotation),
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
        {filter(map(filter(this.props.annotations, annotation => annotation.text), this.renderAnnotation))}
      </div>
    );

  }

}
