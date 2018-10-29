import { React, observer, cn, observable } from '../../helpers/react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { isFunction } from 'lodash';
import BackButton from './back-button';
import CourseOfferingTitle from './offering-title';
import OXFancyLoader from '../../components/ox-fancy-loader';

import * as Steps from './steps';
const componentFor = key => Steps[ key ];

import BuilderUX from './ux';

const Footer = observer(({ ux }) => {
  const Component = componentFor(ux.stage);
  if (Component.Footer) {
    return <Component.Footer ux={ux} />;
  }
  return (
    <div className="controls">
      <Button hidden={!ux.canCancel} onClick={ux.onCancel} className="cancel">
        Cancel
      </Button>
      <BackButton ux={ux} />
      <Button
        onClick={ux.goForward}
        variant="primary"
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
  if (isFunction(title)) { title = title(ux); }
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


export default
@observer
class NewCourseWizard extends React.Component {

  @observable ux = this.props.ux || new BuilderUX(this.context.router);

  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    const wizardClasses = cn('new-course-wizard', this.ux.stage, {
      'is-loading': this.ux.isBusy,
      'is-building': this.ux.isBuilding,
    });
    const Component = componentFor(this.ux.stage);

    return (
      <Card
        header={<Title ux={this.ux} />}
        className={wizardClasses}
        footer={<Footer ux={this.ux} />}
      >
        <div className="panel-content">
          <OXFancyLoader
            isLoading={this.ux.isBusy}
            message={this.ux.isBuilding ? 'Building your course' : 'Loading…'}
          />
          {!this.ux.isBusy && <Component ux={this.ux} />}
        </div>
      </Card>
    );
  }
};
