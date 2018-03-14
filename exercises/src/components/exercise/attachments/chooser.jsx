import React from 'react';
import Exercise from '../../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import createReactClass from 'create-react-class';
import { Button, ProgressBar } from 'react-bootstrap';
import { first } from 'lodash';
import classnames from 'classnames';
import api from 'api';

@observer
class AttachmentChooser extends React.Component {

  displayName: 'AttachmentChooser'

  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  }

  @observable imageData;
  @observable progress;
  @observable file;
  @observable error;

  @action.bound updateUploadStatus(status) {
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
    }
  }
  //
  //   uploadImage() {
  //     if (ExerciseStore.isNew(this.props.exerciseId)) {
  //       ExerciseActions.create(this.props.exerciseId, ExerciseStore.get(this.props.exerciseId));
  //     } else {
  //       ExerciseActions.save(this.props.exerciseId);
  //     }
  //     return (
  //       ExerciseStore.once('updated', id => {
  //         api.uploadExerciseImage(this.props.exerciseId, this.state.file, this.updateUploadStatus)
  //       );
  //         return (
  //           this.setState({progress: 0})
  //         );
  //       });
  //   }

  renderUploadStatus() {
    if (!this.progress) { return; }
    return (
      <ProgressBar now={this.progress} />
    );
  }

  onImageChange(ev) {
    ev.preventDefault();
    const file = first(ev.target.files);
    if (!file) { return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      this.file = file;
      this.imageData = reader.result;
    };
    return (
      reader.readAsDataURL(file)
    );
  }

  renderUploadBtn() {
    if (!this.imageData || !!this.progress) { return; }
    return (
      <Button
        onClick={this.uploadImage}
        disabled={!ExerciseStore.isSavedOrSavable(this.props.exerciseId) || !this.file}>
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
      'with-image': image
    });
    return (
      <div className={classNames}>
        {image}
        <div className="controls">
          <label className="selector">
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
