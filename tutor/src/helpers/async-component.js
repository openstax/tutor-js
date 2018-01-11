import React from 'react';
import { Button } from 'react-bootstrap';
import { asyncComponent as asyncLoader } from 'react-async-component';
import OXColoredStripe from 'shared/src/components/ox-colored-stripe';
import LoadingScreen from '../components/loading-screen';

const ErrorComponent = ({ error, retry }) => (
  <div className="invalid-page">
    <OXColoredStripe />
    <h1>
      Uh-oh, the page failed to load
    </h1>
    <p>{String(error)}</p>
    <Button bsStyle="primary" onClick={retry}>Retry</Button>
  </div>
);


export function asyncComponent(resolve) {
  return asyncLoader({
    resolve,
    LoadingComponent: LoadingScreen,
    ErrorComponent,
  });
}

export function loadAsync(resolve) {
  // return a function so the router will only evaluate it when it's needed
  // in the future we can insert role dependant logic here
  return () => asyncComponent(resolve);
}
