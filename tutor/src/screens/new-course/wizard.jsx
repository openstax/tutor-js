import { React, observer, cn, observable } from '../../helpers/react';
import { Button, Panel } from 'react-bootstrap';
import { isFunction } from 'lodash';
import CourseOfferingTitle from './offering-title';
import OXFancyLoader from '../../components/ox-fancy-loader';

import * as Steps from './steps';
const componentFor = key => Steps[ key ];

import BuilderUX from './ux';

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

  @observable ux = new BuilderUX(this.context.router);

  static contextTypes = {
    router: React.PropTypes.object,
  }

  render() {
    const wizardClasses = cn('new-course-wizard', this.ux.stage, {
      'is-loading': this.ux.isBusy,
      'is-building': this.ux.isBuilding,
    });
    const Component = componentFor(this.ux.stage);

    return (
      <Panel
        header={<Title ux={this.ux} />}
        className={wizardClasses}
        footer={<Footer ux={this.ux} />}
      >
        <div className="panel-content">
          <OXFancyLoader
            isLoading={this.ux.isBusy}
            message={this.ux.isBuilding ? 'Building your course' : 'Loading…'}
          />
          {this.ux.isBusy ? undefined : <Component ux={this.ux} />}
        </div>
      </Panel>
    );
  }
}
