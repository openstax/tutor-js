import { React, observer } from '../../helpers/react';
import { Button, Panel } from 'react-bootstrap';
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
        bsStyle="primary"
        className="next"
        disabled={!ux.canGoForward}
      >
        Continue
      </Button>
    </div>
  );
});


@observer
export default class ExistingCourse extends React.PureComponent {

  static propTypes = {
    ux: React.PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <Panel
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
      </Panel>
    );
  }
}
