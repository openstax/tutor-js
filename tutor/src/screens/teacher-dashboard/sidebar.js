import { React, observable, observer, action, cn, styled, modelize } from 'vendor';
import { partial } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Overlay, Popover, Button } from 'react-bootstrap';
import UiSettings from 'shared/model/ui-settings';
import { AddAssignmentLink } from './task-dnd';
import PastAssignments from './past-assignments';
import TourAnchor from '../../components/tours/anchor';
import { Course } from '../../models';
import AddMenu from './add-menu';
import GradingTemplateLink from '../grading-templates/link';
import CalendarHelper from './helper';
import { colors } from 'theme';

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

const GradingTemplateLinkWrapper = styled.div`
  margin-top: -0.75rem;

  a {
    padding: 1rem;
    display: block;
  }
`;
const Separator = styled.div`
  border-top: 1px solid ${colors.neutral.pale};
  margin: 0.6rem 1rem 1.7rem;
`;

@observer
@withRouter
export default class AddAssignmentSidebar extends React.Component {
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

    constructor(props) {
        super(props);
        modelize(this);
    }

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

    @action renderMenuLink = (link, goToBuilder) => {
        return (
            <TourAnchor tag="li" key={link.type} id={`sidebar-add-${link.type}-assignment`}>
                <AddAssignmentLink link={link} goToBuilder={partial(goToBuilder, link.pathname, null)} onDrag={this.onPopoverClose} />
            </TourAnchor>
        );
    }


    addMenu = new AddMenu({
        history: this.props.history, renderMenuLink: this.renderMenuLink,
        isSidebar: true,
    });


    render() {
        return (
            <div
                className={cn('add-assignment-sidebar', { 'is-open': this.props.isOpen })}
            >
                <TourAnchor id="sidebar-add-tasks" className="sidebar-section">
                    <GradingTemplateLinkWrapper>
                        <GradingTemplateLink course={this.props.course} />
                        <Separator />
                    </GradingTemplateLinkWrapper>
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
