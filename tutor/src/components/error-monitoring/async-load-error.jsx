import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import OXColoredStripe from 'shared/components/ox-colored-stripe';
import { isReloaded, reloadOnce, forceReload } from '../../helpers/reload';

export default class AsyncLoadError extends React.Component {

  static propTypes = {
    error: PropTypes.object.isRequired,
  }

  UNSAFE_componentWillMount() {
    reloadOnce();
  }

  render() {
    if (!isReloaded()) { return null; }
    // eslint-disable-next-line no-console
    console.warn(this.props.error);

    return (
      <div className="invalid-page">
        <OXColoredStripe />
        <h1>
          Uh-oh, the page failed to load
        </h1>
        <p>{String(this.props.error)}</p>
        <Button variant="primary" onClick={forceReload}>Retry</Button>
      </div>
    );
  }

}
