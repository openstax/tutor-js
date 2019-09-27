import { React, observable, observer, action, cn } from 'vendor';
import { partial } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Overlay, Popover, Button } from 'react-bootstrap';
import UiSettings from 'shared/model/ui-settings';
import { AddAssignmentLink } from './task-dnd';
import PastAssignments from './past-assignments';
import TourAnchor from '../../components/tours/anchor';
import Course from '../../models/course';
import AddMenu from './add-menu';
import CalendarHelper from './helper';

const IS_INTRO_VIEWED = 'viewed-plan-dnd-intro';
const USE_SETTINGS = false;

// eslint-disable-next-line
const IntroPopover = ({ show, onClose }) => (
  <Overlay
    show={show}
    placement="right"
    container={document.querySelector('.new-assignments')}>
    <Popover id="drag-intro">
      <Popover.Content>
        <p>
          Click to add, or just drag to calendar.
        </p>
        <Button size="small" onClick={onClose}>
          Got it
        </Button>
      </Popover.Content>
    </Popover>
  </Overlay>
);

export default
@observer
@withRouter
class AddAssignmentSidebar extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    isOpen: PropTypes.bool.isRequired,
    cloningPlanId: PropTypes.string,
    history: PropTypes.object.isRequired,
  }

  @observable shouldshowIntro = false;
  @observable shouldShowPopover = false;
  @observable pendingIntroTimeout;
  @observable willShowIntro = Boolean(
    CalendarHelper.shouldIntro() && !(USE_SETTINGS ? UiSettings.get(IS_INTRO_VIEWED) : false)
  )

  addMenu = new AddMenu({
    history: this.props.history, renderMenuLink: this.renderMenuLink,
  });

  componentDidUpdate(oldProps) {
    // kickoff intro if we're opening after being closed
    if (this.willShowIntro && !oldProps.isOpen && this.props.isOpen) {
      this.pendingIntroTimeout = CalendarHelper.scheduleIntroEvent(this.showIntro);
    }
  }

  componentWillUnmount() {
    CalendarHelper.clearScheduledEvent(this.pendingIntroTimeout);
  }

  @action.bound showIntro() {
    this.shouldShowIntro = true;
    this.willShowIntro = false;
    this.pendingIntroTimeout = CalendarHelper.scheduleIntroEvent(this.showPopover);
  }

  @action.bound showPopover() {
    this.shouldShowPopover = true;
    this.pendingIntroTimeout = false;
  }

  @action.bound onPopoverClose() {
    if (USE_SETTINGS) { UiSettings.set(IS_INTRO_VIEWED, true); }
    this.shouldShowPopover = false;
    this.shouldShowIntro = false;
  }

  @action.bound renderMenuLink(link, goToBuilder) {
    return (
      <TourAnchor tag="li" key={link.type} id={`sidebar-add-${link.type}-assignment`}>
        <AddAssignmentLink link={link} goToBuilder={partial(goToBuilder, link.pathname, null)} onDrag={this.onPopoverClose} />
      </TourAnchor>
    );
  }

  render() {
    return (
      <div
        className={cn('add-assignment-sidebar', { 'is-open': this.props.isOpen })}
      >
        <TourAnchor id="sidebar-add-tasks" className="sidebar-section">
          <div className="section-label">
            New
          </div>
          <ul
            className={cn('new-assignments', { 'is-intro': this.shouldShowIntro })}
            ref="newAssignments"
          >
            {this.addMenu.render(this.props)}
          </ul>
          <IntroPopover
            onClose={this.onPopoverClose}
            show={this.shouldShowPopover && this.props.isOpen}
          />
        </TourAnchor>
        <PastAssignments
          className="sidebar-section"
          course={this.props.course}
          cloningPlanId={this.props.cloningPlanId} />
      </div>
    );
  }
}
