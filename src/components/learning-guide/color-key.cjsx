React = require 'react'

module.exports = React.createClass

  displayName: 'LearningGuideColorKey'

  render: ->
    <div className='guide-key'>
      <div className='item'>
        <div className='box high'></div>
        <span className='title'>looking good</span>
      </div>
      <div className='item'>
        <div className='box medium'></div>
        <span className='title'>almost there</span>
      </div>
      <div className='item'>
        <div className='box low'></div>
        <span className='title'>keep trying</span>
      </div>
    </div>
