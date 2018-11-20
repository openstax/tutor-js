import { React, observer } from '../../helpers/react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { partial } from 'lodash';
import { Listing, Choice } from '../../components/choices-listing';

const Footer = observer(({ ux }) => {
  return (
    <div className="controls">
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
    </div>
  );
});


export default
@observer
class ExistingCourse extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <Card
        header="Choose course to pair with"
        className={'new-course-wizard'}
        footer={<Footer ux={ux} />}
      >
        <div className="panel-content">
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
        </div>
      </Card>
    );
  }
};
