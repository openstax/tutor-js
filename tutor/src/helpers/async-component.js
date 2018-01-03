import React from 'react';
import { asyncComponent } from 'react-async-component';

const LoadingComponent = () => (
  <h1>loading</h1>
);

const ErrorComponent = () => (
  <h1>error</h1>
);

export function loadAsync(resolve) {
  // return a function so the router will only evaluate it when it's needed
  // in the future we can insert role dependant logic here
  return () => (
    asyncComponent({
      resolve,
      LoadingComponent,
      ErrorComponent,
    })
  );
}
