import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { modelize } from 'shared/model'
import { DirectUpload } from '@rails/activestorage';
import Exercises, { Exercise, ExercisesMap } from '../../../models/exercises';
import Image from '../../../models/exercises/image';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { ProgressBar } from 'react-bootstrap';
import { first } from 'lodash';
import classnames from 'classnames';

const STORAGE_PATH = '/rails/active_storage';

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

    constructor(props) {
        super(props);
        modelize(this);
    }

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

    processImage(file) {
        return new Promise((resolve, reject) => {
            const upload = new DirectUpload(file, Image.directUploadURL);
            upload.create((error, blob) => {
                if (error) {
                    reject(error);
                } else {
                    this.props.exercise.images.push({ signed_id: blob.signed_id })
                    resolve({
                        id: blob.id,
                        width: 0,
                        height: 0,
                        src: Image.urlFromBlob(blob),
                    });
                }
            });
        });
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
        reader.onloadend = (async () => {
            this.file = file;
            const image = await this.processImage(file);
            // adjust url to match what it'll be once exercise is saved
            this.imageData = window.location.origin + encodeURI(image.src.replace(/storage\/blobs/, 'storage/blobs/proxy'));
        });
        reader.readAsDataURL(file);
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
        const copypaste = this.imageData ? `<img src="${this.imageData}" alt="">` : '';
        return (
            <div className={classNames}>
                {image}
                {copypaste && <textarea value={copypaste} readOnly={true} className="copypaste" />}
                <div className="controls">
                    <label className="btn btn-secondary selector">
                        {image ? 'Choose different image' : 'Add new image'}
                        <input id="file" className="file" type="file" onChange={this.onImageChange} />
                    </label>
                </div>
                {this.renderErrors()}
                {this.renderUploadStatus()}
            </div>
        );
    }

}

export default AttachmentChooser;
