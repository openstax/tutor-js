import { React, PropTypes, observer, cn, observable } from 'vendor';
import { Button, Card } from 'react-bootstrap';
import { pick, isFunction } from 'lodash';
import { withRouter } from 'react-router-dom';
import BackButton from './back-button';
import CourseOfferingTitle from './offering-title';
import OXFancyLoader from 'shared/components/staxly-animation';
import BuilderUX from './ux';
import * as Steps from './steps';

const componentFor = key => Steps[ key ];

const Footer = observer(({ ux }) => {
    const Component = componentFor(ux.stage);
    if (Component.Footer) {
        return <Component.Footer ux={ux} />;
    }
    return (
        <div className="controls">
            <Button
                variant="default"
                hidden={!ux.canCancel}
                onClick={ux.onCancel}
                className="cancel"
            >
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

Footer.propTypes = {
    ux: PropTypes.object,
};

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

Title.propTypes = {
    ux: PropTypes.object,
};


@withRouter
@observer
export default
class NewCourseWizard extends React.Component {

  static propTypes = {
      ux: PropTypes.object,
  }

  @observable ux = this.props.ux || new BuilderUX({
      router: pick(this.props, 'history', 'match'),
  });

  render() {
      const wizardClasses = cn('new-course-wizard', this.ux.stage, {
          'is-loading': this.ux.isBusy,
          'is-building': this.ux.isBuilding,
      });
      const Component = componentFor(this.ux.stage);

      return (
          <Card
              className={wizardClasses}
          >
              <Card.Header>
                  <Title ux={this.ux} />
              </Card.Header>
              <Card.Body>
                  <OXFancyLoader
                      isLoading={this.ux.isBusy}
                      message={this.ux.isBuilding ? 'Building your course' : 'Loading…'}
                  />
                  {!this.ux.isBusy && <Component ux={this.ux} />}
              </Card.Body>
              <Card.Footer>
                  <Footer ux={this.ux} />
              </Card.Footer>
          </Card>
      );
  }
}
