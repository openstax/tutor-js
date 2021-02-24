import { React, PropTypes } from 'vendor';
import { Button } from 'react-bootstrap';

const ScoresPublishedToast = ({ dismiss }) => {
    return (
        <div className="toast success" data-test-id="published-scores-toast">
            <div className="title">
                <span>Scores Published</span>
            </div>
            <div className="body">
                <p>
          Assignment scores are now available to students.
                </p>
                <Button className="dismiss" onClick={dismiss}>Close</Button>
            </div>
        </div>
    );
};

ScoresPublishedToast.propTypes = {
    dismiss: PropTypes.func.isRequired,
};
export default ScoresPublishedToast;
