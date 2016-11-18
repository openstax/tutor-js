React = require 'react'
extend = require 'lodash/extend'

OXFancyLoader = React.createClass
  displayName: 'OXFancyLoader'
  propTypes:
    isLoading: React.PropTypes.bool.isRequired
  render: ->
    {isLoading} = @props
    return null unless isLoading
    <div className='ox-loader'>
      <div className='ox-loader--inner'>
        <svg width='100%' height='100%' viewBox='0 -38 110 108' version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          fillRule='evenodd'
          clipRule='evenodd'
          strokeLinejoin='round'
          strokeMiterlimit=1.41421
        >
          <g>
            <path
              className='ox-green'
              d="M108.856,15.051c-0.092,1.963 -1.756,3.484 -3.723,3.387l-83.052,-3.942c-1.96,-0.099 -3.473,-1.769 -3.379,-3.728l0.352,-7.375c0.087,-1.965 1.759,-3.483 3.716,-3.389l83.051,3.945c1.961,0.097 3.48,1.765 3.389,3.73l-0.354,7.372Z"
              fill='#79b142'
              fillRule='nonzero'
            />
            <path
              className='ox-orange'
              d="M93.975,24.261c0,0.867 -1.296,1.578 -2.883,1.578l-88.215,0c-1.586,0 -2.877,-0.711 -2.877,-1.578l0,-3.418c0,-0.869 1.291,-1.576 2.877,-1.576l88.215,0c1.587,0 2.883,0.707 2.883,1.576l0,3.418Z"
              fill='#f47842'
              fillRule='nonzero'
            />
            <path
              className='ox-gray'
              d="M81.564,42.039c0,1.185 -0.959,2.139 -2.138,2.139l-67.547,0c-1.176,0 -2.134,-0.953 -2.134,-2.139l0,-10.56c0,-1.176 0.957,-2.13 2.134,-2.13l67.547,0c1.179,0 2.138,0.954 2.138,2.13l0,10.56Z"
              fill='#5f6062'
              fillRule='nonzero'
            />
            <path
              className='ox-yellow'
              d="M102.332,53.464c0.038,1.175 -0.853,2.164 -1.996,2.204l-76.206,2.376c-1.137,0.032 -2.094,-0.898 -2.131,-2.073l-0.198,-6.273c-0.038,-1.179 0.861,-2.162 2.004,-2.202l76.204,-2.376c1.141,-0.038 2.095,0.894 2.131,2.069l0.192,6.275Z"
              fill='#f5d019'
              fillRule='nonzero'
            />
            <path
              className='ox-blue'
              d="M92.099,66.213c-0.001,1.179 -0.9,2.139 -2.006,2.139l-72.746,0c-1.104,0 -2.003,-0.96 -2.003,-2.139l0,-4.191c0,-1.175 0.899,-2.135 2.003,-2.135l72.746,0c1.106,0 2.005,0.959 2.005,2.135l0.001,4.191Z"
              fill='#232e66'
              fillRule='nonzero'
            />
          </g>
        </svg>
      </div>
    </div>

module.exports = OXFancyLoader
