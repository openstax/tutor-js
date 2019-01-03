import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import Exercises, { Exercise, ExercisesMap } from '../../../models/exercises';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Button, ProgressBar } from 'react-bootstrap';
import { first, partial } from 'lodash';
import classnames from 'classnames';

@withRouter
@observer
class AttachmentChooser extends React.Component {

  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
    exercises: PropTypes.instanceOf(ExercisesMap),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    exercises: Exercises,
  }

  @observable imageData;
  @observable progress;
  @observable file;
  @observable error;

  @action.bound updateUploadStatus(status, redirect) {
    if (status.error) {
      this.error = status.error;
    }
    if (status.progress != null) {
      this.progress = status.progress;
      this.error = false;
    }
    if (status.response) { // 100%, we're done
      this.progress = null;
      this.error = false;
      this.imageData = null;
      if (redirect) {
        this.props.history.push(`/exercise/${this.props.exercise.uid}`);
      }
    }
  }

  @action.bound uploadImage() {
    const { exercise } = this.props;

    if (exercise.isNew) {
      this.props.exercises.saveDraft(exercise)
        .then(() => {
          exercise.uploadImage(this.file, partial(this.updateUploadStatus, partial.placeholder, true));
        });
      return;
    }
    exercise.uploadImage(this.file, this.updateUploadStatus);
  }

  renderUploadStatus() {
    if (!this.progress) { return null; }
    return <ProgressBar now={this.progress} />;
  }

  @action.bound onImageChange(ev) {
    ev.preventDefault();
    const file = first(ev.target.files);
    if (!file) { return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      this.file = file;
      this.imageData = reader.result;
    };
    reader.readAsDataURL(file);
  }

  renderUploadBtn() {
    const { exercise } = this.props;
    if (!this.imageData || !!this.progress) { return null; }
    return (
      <Button
        onClick={this.uploadImage}
        disabled={exercise.api.isPending || !this.file}
      >
        Upload
      </Button>
    );
  }

  renderErrors() {
    if (!this.error) { return null; }
    return (
      <div className="error">
        {this.error}
      </div>
    );
  }

  render() {
    let image;
    if (this.imageData) {
      image = <img className="preview" src={this.imageData} />;
    }
    const classNames = classnames('attachment', {
      'with-image': image,
    });
    return (
      <div className={classNames}>
        {image}
        <div className="controls">
          <label className="btn btn-secondary selector">
            {image ? 'Choose different image' : 'Add new image'}
            <input id="file" className="file" type="file" onChange={this.onImageChange} />
          </label>
          {this.renderUploadBtn()}
        </div>
        {this.renderErrors()}
        {this.renderUploadStatus()}
      </div>
    );
  }

}

export default AttachmentChooser;
