import React from 'react';
import { asyncComponent } from 'react-async-component';

const LoadingComponent = () => (
  <h1>loading</h1>
);

const ErrorComponent = () => (
  <h1>error</h1>
);

export function loadAsync(resolve) {
  return asyncComponent({
    resolve,
    LoadingComponent,
    ErrorComponent,
  });
}
