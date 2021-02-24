import React from 'react';

// idea from https://gist.github.com/gaearon/fbd581089255cd529e62

// This renders a simple loading message while webpack loads the code
// and then displays the component that was exported
const createAsyncHandler = function(getHandlerAsync, exportedObjectName) {

    return (
    // idea from https://gist.github.com/gaearon/fbd581089255cd529e62

    // This renders a simple loading message while webpack loads the code
    // and then displays the component that was exported
        class extends React.Component {
      static displayName = 'WebPackAsyncLoader';

      UNSAFE_componentWillMount() {
          return getHandlerAsync().then(resolvedHandler => {
              return this.setState({ component: resolvedHandler[exportedObjectName] });
          });
      }

      render() {
          if ((this.state != null ? this.state.component : undefined)) {
              return React.createElement(this.state.component, this.props);
          } else {
              return <h1 children="Loading..." />;
          }
      }
        }
    );
};


export default createAsyncHandler;
