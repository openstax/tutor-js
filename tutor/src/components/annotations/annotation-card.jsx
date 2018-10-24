import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Label } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { ArbitraryHtmlAndMath } from 'shared';
import Courses from '../../models/courses-map';
import Annotation from '../../models/annotations/annotation';
import Icon from '../icon';
import SuretyGuard from 'shared/components/surety-guard';

@observer
class EditBox extends React.Component {

  static propTypes = {
    text: React.PropTypes.string.isRequired,
    dismiss: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
  };

  @observable text = this.props.text;

  @action.bound onUpdate(ev) {
    this.text = ev.target.value;
  }

  renderWarning() {
    if (this.text.length > Annotation.MAX_TEXT_LENGTH) {
      return <Label bsStyle="danger">Text cannot be longer than {Annotation.MAX_TEXT_LENGTH} characters</Label>;
    }
    return null;
  }

  @autobind
  callUpdateText() {
    this.props.save(this.text);
    this.props.dismiss();
  }

  render() {
    const { text, props: { dismiss } } = this;
    return (
      <div className="edit-box">
        <textarea autoFocus ref="textarea" onChange={this.onUpdate} value={text}></textarea>
        {this.renderWarning()}
        <div className="button-group">
          <button title="Save" onClick={this.callUpdateText}><Icon type="check" /></button>
          <button title="Cancel editing" onClick={dismiss}><Icon type="times" /></button>
        </div>
      </div>
    );
  }
}


@observer
export default class AnnotationCard extends React.Component {

  static propTypes = {
    onDelete: React.PropTypes.func.isRequired,
    annotation: React.PropTypes.instanceOf(Annotation).isRequired,
  };

  @observable editing = false;

  @action.bound
  startEditing() {
    this.editing = true;
  }

  @action.bound
  stopEditing() {
    this.editing = false;
  }

  @action.bound
  saveAnnotation(newText) {
    this.props.annotation.text = newText;
    this.props.annotation.save();
  }

  @action.bound doDelete() {
    this.props.annotation.destroy().then(
      this.props.onDelete
    );
  }

  @computed get course() {
    return Courses.get(this.props.annotation.courseId);
  }

  @autobind
  openPage() {
    const { id, chapter, section } = this.props.annotation;
    let url = `/book/${this.course.ecosystem_id}/section/${chapter}`;
    if (section) {
      url += `.${section}`;
    }
    url += `?highlight=${id}`;
    window.open(url, '_blank');
  }

  render() {
    const { annotation } = this.props;
    return (
      <div className="annotation-card">
        <div className="annotation-body">
          <div className="annotation-content">
            <blockquote className="selected-text">
              <ArbitraryHtmlAndMath html={this.props.annotation.content} />
            </blockquote>
            {this.editing ? (
               <EditBox
                 text={annotation.text}
                 dismiss={this.stopEditing}
                 save={this.saveAnnotation}
               />
            ) : (
               <div className="plain-text">
                 {annotation.text}
               </div>
            )}
          </div>
          <div className="controls">
            {!this.editing && <button title="Edit" onClick={this.startEditing}><Icon type="edit" /></button>}

            <button title="View in book" onClick={this.openPage}><Icon type="external-link" /></button>
            <SuretyGuard
              title="Are you sure you want to delete this note?"
              message="If you delete this note, your work cannot be recovered."
              okButtonLabel="Delete"
              onConfirm={this.doDelete}
            >
              <button title="Delete"><Icon type="trash" /></button>
            </SuretyGuard>
          </div>
        </div>
      </div>
    );
  }
}
