import React from 'react';
import { defer } from 'lodash';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import cn from 'classnames';
import Icon from '../icon';
import { Label } from 'react-bootstrap';
import Annotation from '../../models/annotations/annotation';

@observer
class EditBox extends React.Component {

  static propTypes = {
    annotation: React.PropTypes.instanceOf(Annotation),
    onHide: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    next: React.PropTypes.instanceOf(Annotation),
    previous: React.PropTypes.instanceOf(Annotation),
    goToAnnotation: React.PropTypes.func.isRequired,
    seeAll: React.PropTypes.func.isRequired,
  }

  @action.bound onDelete() {
    this.props.annotation.destroy().then(() => {
      this.props.onHide()
      this.props.onDelete(this.props.annotation);
    });
  }

  @observable text = this.props.annotation ? this.props.annotation.text : '';

  componentWillReceiveProps(nextProps) {
    if (nextProps.annotation !== this.props.annotation) {
      this.text = nextProps.annotation ? nextProps.annotation.text : '';
      defer(() => this.input.focus());
    }
  }

  componentWillUnmount() {
    if (this.text !== this.props.annotation.text) {
      this.props.annotation.text = this.text;
      this.props.annotation.save();
    }
  }

  @action.bound onUpdate(ev) {
    this.text = ev.target.value;
  }

  @action.bound onSave() {
    this.props.annotation.text = this.text;
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

  renderWarning() {
    if (this.text.length > Annotation.MAX_TEXT_LENGTH) {
      return <Label bsStyle="danger">Text cannot be longer than {Annotation.MAX_TEXT_LENGTH} characters</Label>;
    }
    return null;
  }

  render() {
    const { text, props: {
      annotation, previous, next, seeAll,
    } } = this;

    return (
      <div className="edit-box">
        <textarea
          autoFocus
          ref={i => this.input = i}
          value={text}
          onChange={this.onUpdate}
        />
        {this.renderWarning()}
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


export default function EditBoxWrapper(props) {
  const show = !!props.annotation;
  return (
    <div className={cn('slide-out-edit-box', { open: show, closed: !show })}>
      {props.annotation && <EditBox {...props} />}
    </div>
  );
}
