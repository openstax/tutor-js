React = require 'react'
Joyride = require('react-joyride').default


Tour = React.createClass

  contextTypes:
    router: React.PropTypes.object

  propTypes:
    identifier: React.PropTypes.string.isRequired


  render: ->

    <Joyride ref="joyride"
      debug={true}
      steps={STEPS} type='continuous'
      showStepsProgress={true} />


module.export = Tour
