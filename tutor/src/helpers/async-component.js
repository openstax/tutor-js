import React from 'react';
import Loadable from 'react-loadable';
import ErrorComponent from '../components/error-monitoring/async-load-error';
import Loading from 'shared/components/loading-animation';

export function asyncComponent(loader, name = '') {
  const loading = ({ error }) => {
    return (
      error ? <ErrorComponent error={error} />
        : <Loading message={`Loading ${name}…`} />
    );
  };
  return Loadable({
    loader, loading,
  });

}

export function loadAsync(resolve, name) {
  // return a function so the router will only evaluate it when it's needed
  // in the future we can insert role dependant logic here
  return () => asyncComponent(resolve, name);
}
