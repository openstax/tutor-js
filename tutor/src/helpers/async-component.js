import React from 'react';
import AsyncErrorBoundary from '../components/error-monitoring/async-load-error';
import Loading from 'shared/components/loading-animation';


export function asyncComponent(loader, name = '') {
  const Component = React.lazy(loader);
  const loading = <Loading message={`Loading ${name}…`} />;

  const Loader = (props) => (
    <AsyncErrorBoundary>
      <React.Suspense fallback={loading}>
        <Component {...props} />
      </React.Suspense>
    </AsyncErrorBoundary>
  );

  return (props) => <Loader {...props} />;
}


export function loadAsync(resolve, name) {
  // return a function so the router will only evaluate it when it's needed
  // in the future we may insert role dependant logic here
  return () => asyncComponent(resolve, name);
}
