React = require 'react'
BS = require 'react-bootstrap'
Icon = require '../icon'
BuildCourse = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    onCancel: React.PropTypes.func.isRequired

  render: ->
    <BS.Panel>
      <h4>We’re building your Tutor course…</h4>
      <p>Should take about 10 seconds</p>
      <div className="text-center">
        <Icon type='spinner' spin className="fa-5x" />
      </div>
    </BS.Panel>


module.exports = BuildCourse
