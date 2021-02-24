import { React, observer } from 'vendor';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';

const Footer = observer(({ ux }) => {
    return (
        <Card.Footer className="controls">
            <Button onClick={ux.goBackward} className="back">
        Back
            </Button>
            <Button
                onClick={ux.goForward}
                variant="primary"
                className="next"
                disabled={!ux.canGoForward}
            >
        Continue
            </Button>
        </Card.Footer>
    );
});


@observer
export default
class ExistingCourse extends React.Component {

  static propTypes = {
      ux: PropTypes.object.isRequired,
  }

  render() {
      const { ux } = this.props;

      return (
          <Card className={'new-course-wizard'}>
              <Card.Header>
          Choose course to pair with
              </Card.Header>
              <Card.Body>
                  <Listing>
                      {ux.courses.array.map(course => (
                          <Choice
                              key={`course-choice-${course.id}`}
                              data-appearance={course.appearance_code}
                              active={(course === ux.pairedCourse)}
                              onClick={partial(ux.pairCourse, course)}
                          >
                              {course.name}
                          </Choice>
                      ))}
                  </Listing>
              </Card.Body>
              <Footer ux={ux} />
          </Card>
      );
  }
}
