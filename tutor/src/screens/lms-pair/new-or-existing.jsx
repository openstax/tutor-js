import { React, observer } from '../../helpers/react';
import { Button, Panel } from 'react-bootstrap';
import { Listing, Choice } from '../../components/choices-listing';

const Footer = observer(({ ux }) => {
  return (
    <div className="controls">
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
export default class NewOrExisting extends React.PureComponent {

  static propTypes = {
    ux: React.PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <Panel
        header={"Do you want to use a new or existing Tutor Course with your LMS?"}
        className={'new-course-wizard'}
        footer={<Footer ux={ux} />}
      >
        <div className="panel-content">
          <Listing>
            <Choice
              key="course-new"
              active={ux.newOrExisting === 'new'}
              onClick={ux.onSelectNew}
            >
              Create a new course
            </Choice>
            <Choice
              key="course-copy"
              active={ux.newOrExisting === 'existing'}
              onClick={ux.onSelectExisting}
            >
              Pair LMS to an existing course
            </Choice>
          </Listing>
        </div>
      </Panel>
    );
  }
}
