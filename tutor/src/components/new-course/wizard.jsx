import React from 'react';
import { observer } from 'mobx-react';
import { Button, Panel } from 'react-bootstrap';
import classnames from 'classnames';
import { isFunction } from 'lodash';
import { observable, computed } from 'mobx';

import CourseOfferingTitle from './offering-title';
import OXFancyLoader from '../ox-fancy-loader';

import * as Steps from './steps';
const componentFor = key => Steps[ key ];

import CourseBuilderUX from '../../models/course/builder-ux';

const BackButton = observer(({ ux }) => {
  if (!ux.canGoBackward) { return null; }
  return (
    <Button onClick={ux.goBackward} className="back">
      Back
    </Button>
  );
});

const Footer = observer(({ ux }) => {
  const Component = componentFor(ux.stage);
  if (Component.Footer) {
    return <Component.Footer ux={ux} />;
  }
  return (
    <div className="controls">
      <Button onClick={ux.onCancel} className="cancel">
        Cancel
      </Button>
      <BackButton ux={ux} />
      <Button
        onClick={ux.goForward}
        bsStyle="primary"
        className="next"
        disabled={!ux.canGoForward}
      >
        Continue
      </Button>
    </div>
  );
});

const Title = observer(({ ux }) => {
  let { title } = componentFor(ux.stage);
  if (isFunction(title)) { title = title(); }
  if (ux.hasOfferingTitle) {
    return (
      <CourseOfferingTitle offering={ux.offering}>
        {title}
      </CourseOfferingTitle>
    );
  }
  return (
    <div>{title}</div>
  );
});


@observer
export default class NewCourseWizard extends React.PureComponent {

  static propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
  }

  @observable ux = new CourseBuilderUX(this.context.router);

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @computed get isBusy() {
    return Boolean(this.props.isLoading || this.ux.newCourse.hasApiRequestPending);
  }

  render() {
    const wizardClasses = classnames('new-course-wizard', this.ux.stage, {
      'is-loading': this.isBusy,
      'is-building': this.ux.newCourse.api.requestsInProgress,
    });
    const Component = componentFor(this.ux.stage);

    return (
      <Panel
        header={<Title ux={this.ux} />}
        className={wizardClasses}
        footer={<Footer ux={this.ux} />}>
        <div className="panel-content">
          <OXFancyLoader isLoading={this.isBusy} />
          {this.isBusy ? undefined : <Component ux={this.ux} />}
        </div>
      </Panel>
    );
  }
}
