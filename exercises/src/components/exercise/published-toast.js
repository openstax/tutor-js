import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'react-bootstrap';

@observer
class PublishedToast extends React.Component {

  static propTypes = {
      dismiss: PropTypes.func.isRequired,
      toast: PropTypes.object.isRequired,
  }

  render() {
      const { dismiss, toast: { info: { isDraft, exercise } } }= this.props;

      const message = isDraft ?
          `Your changes to ${exercise.uid} were saved` :
          `Exercise ${exercise.uid} was published successfully`;

      return (
          <div className="toast success">
              <div className="title">
                  <span>Save Complete</span>
              </div>
              <div className="body">
                  <p>
                      {message}
                  </p>
                  <Button
                      variant="primary"
                      size="small"
                      onClick={dismiss}
                  >
            OK
                  </Button>
              </div>

          </div>
      );
  }

}

export default PublishedToast;
