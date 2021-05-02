import { React, observer } from 'vendor';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { Listing, Choice } from '../../components/choices-listing';

const Footer = observer(({ ux }) => {
    return (
        <Card.Footer className="controls">
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
class NewOrExisting extends React.Component {

    static propTypes = {
        ux: PropTypes.object.isRequired,
    }

    render() {
        const { ux } = this.props;

        return (
            <Card
                className={'new-course-wizard'}
            >
                <Card.Header>
                    <h3>Do you want to use a new or existing Tutor Course with your LMS?</h3>
                </Card.Header>
                <Card.Body className="panel-content">
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
                </Card.Body>
                <Footer ux={ux} />
            </Card>
        );
    }
}
