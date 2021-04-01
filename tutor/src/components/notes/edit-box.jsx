import PropTypes from 'prop-types';
import React from 'react';
import { defer } from 'lodash';
import { observer } from 'mobx-react';
import { action, observable, computed, modelize } from 'shared/model'
import cn from 'classnames';
import { Icon } from 'shared';
import { Form } from 'react-bootstrap';
import Note from '../../models/notes/note';
import Responsive from '../responsive';

@observer
class EditBox extends React.Component {
    static propTypes = {
        note: PropTypes.instanceOf(Note),
        onHide: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        next: PropTypes.instanceOf(Note),
        previous: PropTypes.instanceOf(Note),
        goToNote: PropTypes.func.isRequired,
        seeAll: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onDelete() {
        this.props.note.destroy().then(() => {
            this.props.onHide();
            this.props.onDelete(this.props.note);
        });
    }

    @observable annotation = this.props.note ? this.props.note.annotation : '';

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.note !== this.props.note) {
            this.annotation = nextProps.note ? nextProps.note.annotation : '';
            defer(() => this.input.focus());
        }
    }

    componentWillUnmount() {
        if (!this.isDeleted && (this.annotation !== this.props.note.annotation)) {
            this.props.note.annotation = this.annotation;
            this.props.note.save();
        }
    }

    @action.bound onUpdate(ev) {
        this.annotation = ev.target.value;
    }

    @action.bound onSave() {
        this.props.note.annotation = this.annotation;
        this.props.note.save().then(
            this.props.onHide
        );
    }

    @action.bound goPrevious() {
        this.props.goToNote(this.props.previous);
    }

    @action.bound goNext() {
        this.props.goToNote(this.props.next);
    }

    @computed get isDeleted() {
        return this.props.note.api.isDeleted;
    }

    renderWarning() {
        if (this.annotation.length > Note.MAX_TEXT_LENGTH) {
            return <Form.Label variant="danger">Text cannot be longer than {Note.MAX_TEXT_LENGTH} characters</Form.Label>;
        }
        return null;
    }

    render() {
        const { annotation, props: {
            previous, next, seeAll,
        } } = this;

        const { textAreaDisabled } = this.props;

        return (
            <div className="edit-box">
                <textarea
                    autoFocus
                    ref={i => this.input = i}
                    value={annotation}
                    onChange={this.onUpdate}
                    disabled={textAreaDisabled || false}
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
                        <button aria-label="previous note"
                            disabled={!previous}
                            onClick={this.goPrevious}
                        >
                            <Icon type="chevron-up" />
                        </button>
                        <button aria-label="next note"
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
EditBox.propTypes = {
    textAreaDisabled: PropTypes.boolean,
};

const renderDesktop = (props) => {
    return <EditBox {...props} textAreaDisabled={false} />;
};

const renderTablet = (props) => {
    return <EditBox {...props} textAreaDisabled={true} />;
};


export default function EditBoxWrapper(props) {
    const show = !!props.note;
    return (
        <div className={cn('slide-out-edit-box', { open: show, closed: !show })}>
            {props.note && 
        <Responsive desktop={renderDesktop(props)} tablet={renderTablet(props)} mobile={renderTablet(props)}/>
            }
        </div>
    );
}

EditBoxWrapper.propTypes = {
    note: PropTypes.instanceOf(Note),
};
