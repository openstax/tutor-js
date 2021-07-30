import { React, PropTypes, observable, observer, action, styled, modelize } from 'vendor';
import { map, values } from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import RadioInput from '../components/radio-input';
import classnames from 'classnames';
import moment from 'moment-timezone';
import TimeHelper from '../helpers/time';
import S from '../helpers/string';
import { Course } from '../models';

const timezonePropType = PropTypes.oneOf(values(TimeHelper.getTimezones()));

const StyledAsyncButton = styled(AsyncButton)`
  min-width: 7rem;
`;

const PreviewWrapper = styled.div`
  margin-top: 2.4rem;

  time {
    margin-left: 0.5rem;
    font-weight: bold;
  }
`;

const StyledText = styled.div`
  line-height: 2.4rem;
`;

@observer
class TimezonePreview extends React.Component {
    static propTypes = {
        timezone: timezonePropType,
        interval: PropTypes.number,
    };

    static defaultProps = {
        time: moment(),
        interval: 60000,
    }

    @observable time = moment();
    @observable timeout;

    constructor(props) {
        super(props);
        modelize(this);
    }

    UNSAFE_componentWillMount() {
        this.update();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    update() {
        const { interval } = this.props;

        this.timeout = setTimeout(() => {
            this.updateTime();
            this.update();
        }, interval);
    }

    updateTime() {
        const { props: { interval } } = this;
        this.time = moment().add(interval, 'ms');
    }

    render() {
        let { time, props: { timezone } } = this;
        if (!timezone) { timezone = moment.tz.guess(); }
        const timePreview = time.tz(timezone).format('h:mm a');

        return (
            <time>
                {timePreview}
            </time>
        );
    }
}

@observer
class SetTimezoneField extends React.Component {
    static propTypes = {
        courseId: PropTypes.string,
        name: PropTypes.string.isRequired,
        defaultValue: timezonePropType,
        onChange: PropTypes.func.isRequired,
        validate: PropTypes.func.isRequired,
    }

    @observable courseTimezone = this.props.defaultValue;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onChange(e) {
        const value = e.target.value;
        this.courseTimezone = value;
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        const timezones = TimeHelper.getTimezones();

        const { courseTimezone, props: { name } } = this;

        const timezonesToPick = map(timezones, timezone => {
            const identifier = S.dasherize(timezone);

            return (
                <div key={`timezone-choice-${identifier}`}>
                    <RadioInput
                        id={identifier}
                        value={timezone}
                        name={name}
                        label={timezone}
                        defaultChecked={timezone === courseTimezone}
                        onChange={this.onChange}
                        standalone={true}
                    />
                </div>
            );
        });

        return (
            <>
                {timezonesToPick}
                <PreviewWrapper>
          Your course time will be:
                    <TimezonePreview timezone={courseTimezone} />
                </PreviewWrapper>
            </>
        );
    }
}

@observer
export default class TimezoneModal extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
        onClose: PropTypes.func.isRequired,
        show: PropTypes.bool.isRequired,
    }

    @observable invalid = false;
    @observable course_timezone = this.props.course.timezone;
    @observable showingConfirm = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound close() {
        this.showingConfirm = false;
        this.props.onClose();
    }

    @action.bound validate(timezone) {
        this.invalid = !TimeHelper.isTimezoneValid(timezone);
    }

    @action.bound showConfirm() {
        this.showingConfirm = true;
    }

    @action.bound performUpdate() {
        if (this.invalid) { return; }
        this.props.course.timezone = this.course_timezone;
        this.props.course.save().then(this.close);
    }

    @action.bound renderModal() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.close}
                className="settings-edit-course-modal">
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                      Change Course Timezone
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={classnames({ 'is-invalid-form': this.invalid })}>
                    <SetTimezoneField
                        name="course-timezone"
                        defaultValue={this.props.course.timezone}
                        onChange={val => this.course_timezone = val}
                        validate={this.validate}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={this.close}
                        variant="outline-secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={this.showConfirm}
                        disabled={this.invalid}
                    >
                      Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    @action.bound renderConfirmModal() {
        return (
            <Modal
                show
                onHide={this.close}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                      Warning
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StyledText>
                      Your assignment open/due/close times will change.
                      This will also affect the times displayed to students and late work.
                    </StyledText>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={this.close}
                        variant="outline-secondary"
                    >
                      Cancel
                    </Button>
                    <StyledAsyncButton
                        onClick={this.performUpdate}
                        isWaiting={this.props.course.api.isPending}
                        waitingText="Saving..."
                        disabled={this.invalid}
                    >
                      Change Course Timezone
                    </StyledAsyncButton>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return this.showingConfirm ? this.renderConfirmModal() : this.renderModal();
    }
}
