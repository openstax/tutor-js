import React from 'react';
import { asyncComponent as asyncLoader } from 'react-async-component';
import ErrorComponent from '../components/error-monitoring/async-load-error';
import LoadingComponent from '../components/loading-screen';

export function asyncComponent(resolve) {
  return asyncLoader({
    resolve,
    LoadingComponent,
    ErrorComponent,
  });
}

export function loadAsync(resolve) {
  // return a function so the router will only evaluate it when it's needed
  // in the future we can insert role dependant logic here
  return () => asyncComponent(resolve);
}
