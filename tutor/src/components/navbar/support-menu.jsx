import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { Dropdown } from 'react-bootstrap';
import { delay, get } from 'lodash';
import { action, computed, observable, when } from 'mobx';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import TourAnchor from '../tours/anchor';
import Chat from '../../models/chat';
import UserMenu from '../../models/user/menu';
import { Icon } from 'shared';
import SupportDocument from './support-document-link';
import BestPracticesGuide from './best-practices-guide';
import TourContext from '../../models/tour/context';
import Course from '../../models/course';
import Theme from '../../theme';
import Responsive from '../../components/responsive';

// eslint-disable-next-line no-unused-vars
const PageTips = observer(({ onPlayClick, tourContext, staticContext, ...props }) => {
    if (!get(tourContext, 'hasTriggeredTour', false)){ return null; }
    return (
        <Dropdown.Item
            className="page-tips"
            {...props}
            onSelect={onPlayClick}
        >
            <TourAnchor id="menu-option-page-tips">
        Page Tips
            </TourAnchor>
        </Dropdown.Item>
    );
});


@withRouter
@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default
class SupportMenu extends React.Component {
    static propTypes = {
        tourContext: PropTypes.instanceOf(TourContext),
        course: PropTypes.instanceOf(Course),
        onClose:  PropTypes.func,
        history: PropTypes.object.isRequired,
    }

    @observable chatEnabled;
    @observable chatDisabled;

    // trick react-bootstrap into adding the menu to the DOM but really hide it
    @observable show = true;
    @observable hide = true;

    constructor(props) {
        super(props);
        modelize(this);
    }

    renderChat() {
        if (!Chat.isEnabled) { return null; }
        return [
            <Dropdown.Item
                style={{ display: 'none' }}
                key="chat-enabled"
                className="chat enabled"
                ref={opt => this.chatEnabled = opt}
                onSelect={this.onSelect}
                onClick={Chat.start}
            >
                <Icon type='comments-solid' color={Theme.colors.controls.active} /><span>Chat Support (9 - 5 CT)</span>
            </Dropdown.Item>,
            <Dropdown.Item
                style={{ display: 'none' }}
                key="chat-disabled"
                className="chat disabled"
                onSelect={this.onSelect}
                ref={opt => this.chatDisabled = opt}
            >
                <Icon type='comments' color={Theme.colors.states.disabled} /><span>Chat Support Offline</span>
            </Dropdown.Item>,
        ];
    }

    @action.bound
    onSelect() {
        this.props.onClose && this.props.onClose();
    }


    @action.bound
    onPlayTourClick() {
        this.onSelect();
        this.props.tourContext.playTriggeredTours();
    }

    @action.bound
    goToAccessibility(ev) {
        ev.preventDefault();
        this.props.history.push(this.accessibilityLink);
    }

    @computed
    get accessibilityLink() {
        return `/accessibility-statement/${(this.props.course && this.props.course.id) || ''}`;
    }

    @action.bound
    onToggle(show) {
        this.show = show;
    }

    componentDidMount() {
        // the delay is necessary for the menu to actually be placed in the DOM
        delay(() => {
        // now that the menu is in the DOM, close it but allow it to be shown in the future
            this.onToggle(false);
            this.hide = false;
        }, 0);

        when(
            () => this.chatEnabled && this.chatDisabled,
            () => Chat.setElementVisiblity(
                findDOMNode(this.chatEnabled),
                findDOMNode(this.chatDisabled)
            ),
        );
    }

    renderDesktop() {
        return (
            <Dropdown show={this.show} onToggle={this.onToggle}>
                <Dropdown.Toggle
                    id="support-menu"
                    ref={m => (this.dropdownToggle = m)}
                    aria-label="Page tips and support"
                    variant="ox"
                >
                    <TourAnchor
                        id="support-menu-button"
                        aria-labelledby="support-menu"
                        onSelect={this.onSelect}
                    >
                        <Icon type="question-circle" />
                        <span title="Page tips and support" className="control-label">Help</span>
                    </TourAnchor>
                </Dropdown.Toggle>
                <Dropdown.Menu className={this.hide ? ' hide' : null}>
                    {this.renderItems()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    renderItems() {
        const { course } = this.props;
        return (
        <>
          <PageTips onPlayClick={this.onPlayTourClick} {...this.props} />
          <Dropdown.Item
              key="nav-help-link"
              className="-help-link"
              target="_blank"
              onSelect={this.onSelect}
              href={UserMenu.helpLinkForCourse(course)}
          >
              <span>Help Articles</span>
          </Dropdown.Item>
          <SupportDocument course={course} />
          <BestPracticesGuide course={course} />
          <Dropdown.Item
              key="nav-keyboard-shortcuts"
              className="-help-link"
              onSelect={this.onSelect}
              href={this.accessibilityLink}
              onClick={this.goToAccessibility}
          >
              <span>Accessibility Statement</span>
          </Dropdown.Item>
          {this.renderChat()}
        </>
        );
    }

    render() {
        return (
            <Responsive
                desktop={this.renderDesktop()}
                mobile={this.renderItems()}
            />
        );
    }
}
