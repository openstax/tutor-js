import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import cn from 'classnames';
import './highlighter';
import Icon from '../icon';
import Annotation from '../../models/annotations/annotation';

@observer
export default class EditBox extends React.Component {

  static propTypes = {
    annotation: React.PropTypes.instanceOf(Annotation),
    onHide: React.PropTypes.func.isRequired,
    next: React.PropTypes.instanceOf(Annotation),
    previous: React.PropTypes.instanceOf(Annotation),
    goToAnnotation: React.PropTypes.func.isRequired,
    seeAll: React.PropTypes.func.isRequired,
  }

  @action.bound onDelete() {
    this.props.annotation.destroy().then(
      this.props.onHide
    );
  }

  @action.bound onUpdate(ev) {
    this.props.annotation.text = ev.target.value;
  }

  @action.bound onSave() {
    this.props.annotation.save().then(
      this.props.onHide
    );
  }

  @action.bound goPrevious() {
    this.props.goToAnnotation(this.props.previous);
  }

  @action.bound goNext() {
    this.props.goToAnnotation(this.props.next);
  }

  render() {
    const { props: {
      annotation, onHide, previous, next, seeAll,
    } } = this;

    if (!annotation) { return null; }
    const show = !!annotation;

    return (
      <div
        className={cn('slide-out-edit-box', { open: show, closed: !show })}
      >
        <textarea
          autoFocus
          value={annotation.text}
          onChange={this.onUpdate}
        />

        <div className="button-row">
          <div className="button-group">
            <button aria-label="save" className="primary" onClick={this.onSave}>
              <Icon type="check" />
            </button>
            <button aria-label="delete" className="secondary" onClick={this.onDelete}>
              <Icon type="trash" />
            </button>
          </div>
          <div className="button-group">
            <button aria-label="previous annotation"
              disabled={!previous}
              onClick={this.goPrevious}
            >
              <Icon type="chevron-up" />
            </button>
            <button aria-label="next annotation"
              disabled={!next}
              onClick={this.goNext}
            >
              <Icon type="chevron-down" />
            </button>
            <button onClick={seeAll}>See all</button>
          </div>
        </div>
      </div>
    );
  }
}
