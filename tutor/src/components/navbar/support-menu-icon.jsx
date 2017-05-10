import React from 'react';
import StaticComponent from 'shared/src/components/static';

export default class SupportMenu extends StaticComponent {

  render() {
    return (
      <svg
        width="24" height="24" viewBox="0 0 12 14" version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={[
          'M6.795,6.795l2.58,-1.17l-2.58,-1.17l-1.17,-2.58l-1.17,2.58l-2.58,1.17l2.58,',
          '1.17l1.17,2.58l1.17,-2.58Zm3.195,-6.795c0.34,0 0.635,0.12 0.885,0.36c0.25,',
          '0.24 0.375,0.53 0.375,0.87l0,8.76c0,0.34 -0.125,0.635 -0.375,0.885c-0.25,',
          '0.25 -0.545,0.375 -0.885,0.375l-2.49,0l-1.875,1.875l-1.875,-1.875l-2.49,0c',
          '-0.34,0 -0.635,-0.125 -0.885,-0.375c-0.25,-0.25 -0.375,-0.545 -0.375,-0.885l0,',
          '-8.76c0,-0.34 0.125,-0.63 0.375,-0.87c0.25,-0.24 0.545,-0.36 0.885,-0.36l8.73,0Z'].join('')}
        />
      </svg>
    );
  }
}
