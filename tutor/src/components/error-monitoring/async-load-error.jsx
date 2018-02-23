import React from 'react';
import { Button } from 'react-bootstrap';
import OXColoredStripe from 'shared/components/ox-colored-stripe';
import { forceReload } from '../../helpers/reload';

export default class AsyncLoadError extends React.PureComponent {

  static propTypes = {
    error: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="invalid-page">
        <OXColoredStripe />
        <h1>
          Uh-oh, the page failed to load
        </h1>
        <p>{String(this.props.error)}</p>
        <Button bsStyle="primary" onClick={forceReload}>Retry</Button>
      </div>
    );
  }

}
