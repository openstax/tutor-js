import React from 'react';

// A simple base class that can be inherited by static components
// like SVG Icons that should never re-render.
export default class StaticComponent extends React.PureComponent {

  shouldComponentUpdate() {
    return false;
  }

}
