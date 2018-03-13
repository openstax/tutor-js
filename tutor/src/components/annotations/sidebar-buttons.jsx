import React from 'react';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { get, map, filter } from 'lodash';
import './highlighter';
import Icon from '../icon';
import Annotation from '../../models/annotations/annotation';

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
      parentRect, onClick, activeAnnotation,
    } = this.props;
    const isActive = note === activeAnnotation;

    return (
      <Icon
        type={isActive ? 'comment' : 'comment-o'}
        key={note.id}
        className={
          cn('sidebar-button', { active: isActive })
        }
        style={{
          top: get(note.selection, 'bounds.top', 0) - parentRect.top,
        }}
        alt="View annotation"
        onClick={() => onClick(note)}
      />
    );
  }

  render() {

    return (
      <div className="annotation-edit-buttons">
        {map(filter(this.props.annotations, 'text'), this.renderAnnotation)}
      </div>
    );

  }

}
