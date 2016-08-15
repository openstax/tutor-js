const React = require('react');
const BS = require('react-bootstrap');

const Sandbox = React.createClass({
  render: () => {
    return (
      <div className='sandbox'>
        <h1 className='container'>Sandbox</h1>
        <div className='banner'></div>
        <div className='container-fluid'>
          <BS.Panel>Here's a fluid container</BS.Panel>
        </div>
        <div className='container'>
          <BS.Panel>
            We can have panels here too!
          </BS.Panel>
          To edit markup go to <pre>/src/sandbox.coffee</pre>
          To edit styles go to <pre>/styles/sandbox.less</pre>
        </div>
      </div>
    );
  }
});

module.exports = Sandbox;
