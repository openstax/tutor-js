# coffeelint: disable=max_line_length
React = require 'react'

CLASSNAME_BASE = 'openstax-graphics-coach'

class CoachGraphic extends React.Component
  @displayName: 'CoachGraphic'
  render: ->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 435 289.71" className={CLASSNAME_BASE}>
      <CoachGraphic.Coach/>
    </svg>

CoachGraphic.Coach = ->
  <g className="#{CLASSNAME_BASE}-wrapper">
    <g className="#{CLASSNAME_BASE}-browser">
      <rect className="#{CLASSNAME_BASE}-browser-base" width="435" height="289.71" rx="3" ry="3"/>
      <path className="#{CLASSNAME_BASE}-browser-bar" d="M3,0H432a3,3,0,0,1,3,3V16.5a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V3A3,3,0,0,1,3,0Z"/>
      <g className="#{CLASSNAME_BASE}-browser-ui">
        <circle className="#{CLASSNAME_BASE}-browser-ui-button" cx="9.72" cy="8.25" r="2.62"/>
        <circle className="#{CLASSNAME_BASE}-browser-ui-button" cx="18.69" cy="8.25" r="2.62"/>
        <circle className="#{CLASSNAME_BASE}-browser-ui-button" cx="27.66" cy="8.25" r="2.62"/>
      </g>
    </g>

    <g className="#{CLASSNAME_BASE}-navbar">
      <rect className="#{CLASSNAME_BASE}-navbar-base" y="16.63" width="435" height="18.85"/>
      <rect className="#{CLASSNAME_BASE}-navbar-ui" x="7.09" y="22.87" width="9.14" height="1.23"/>
      <rect className="#{CLASSNAME_BASE}-navbar-ui" x="7.09" y="25.44" width="9.14" height="1.23"/>
      <rect className="#{CLASSNAME_BASE}-navbar-ui" x="7.09" y="28.01" width="9.14" height="1.23"/>
      <path className="#{CLASSNAME_BASE}-navbar-ui" d="M425.49,27.81l-2.34-2.18a.25.25,0,1,1,.34-.36l2,1.87,2-1.87a.25.25,0,1,1,.34.36Z"/>
      <rect className="#{CLASSNAME_BASE}-navbar-ui" x="394.92" y="24.38" width="24.51" height="4.25"/>
    </g>

    <g className="#{CLASSNAME_BASE}-coach">
      <rect className="#{CLASSNAME_BASE}-coach-wrapper" x="50.53" y="63.12" width="333.93" height="197.58"/>
      <rect className="#{CLASSNAME_BASE}-coach-ui" x="58.73" y="71.78" width="43.94" height="6.19"/>
      <rect className="#{CLASSNAME_BASE}-coach-ui" x="107.27" y="71.78" width="9.14" height="6.19"/>
      <line className="#{CLASSNAME_BASE}-coach-bar" x1="50.53" y1="85.1" x2="384.47" y2="85.1"/>
    </g>

    <g className="#{CLASSNAME_BASE}-question">
      <circle className="#{CLASSNAME_BASE}-question-circle" cx="106.38" cy="114.97" r="10.03"/>
      <rect className="#{CLASSNAME_BASE}-question-text" x="123.82" y="107.75" width="190.52" height="5.29"/>
      <rect className="#{CLASSNAME_BASE}-question-text" x="123.82" y="116.91" width="115.15" height="5.29"/>
      <path className="#{CLASSNAME_BASE}-question-label" d="M109.22,119.48a2.94,2.94,0,0,1-1.2.21,3.09,3.09,0,0,1-2.95-1.76c-1.45-.29-2.4-1.52-2.4-3.39,0-2.16,1.26-3.4,3.1-3.4s3.1,1.25,3.1,3.4a3.15,3.15,0,0,1-2.17,3.34,1.77,1.77,0,0,0,1.5.62,2.28,2.28,0,0,0,.75-.12Zm-3.45-2.76c.93,0,1.52-.84,1.52-2.17s-.59-2.11-1.52-2.11-1.52.79-1.52,2.11S104.84,116.72,105.77,116.72Z"/>
    </g>

    <g className="#{CLASSNAME_BASE}-answer">
      <circle className="#{CLASSNAME_BASE}-answer-circle" cx="110.09" cy="143.64" r="7.96"/>
      <path className="#{CLASSNAME_BASE}-answer-label" d="M110,144.08a2.24,2.24,0,0,0,.56-.12.42.42,0,0,0,.3-.4.47.47,0,0,0-.23-.46A1.46,1.46,0,0,0,110,143a.9.9,0,0,0-.71.25,1,1,0,0,0-.2.49h-1.35a2,2,0,0,1,.4-1.16,2.31,2.31,0,0,1,1.92-.71,3.43,3.43,0,0,1,1.57.35,1.34,1.34,0,0,1,.69,1.32V146c0,.17,0,.38,0,.62a.79.79,0,0,0,.08.37.5.5,0,0,0,.21.16v.21h-1.53A1.58,1.58,0,0,1,111,147c0-.1,0-.2,0-.33a2.9,2.9,0,0,1-.67.54,2,2,0,0,1-1,.26,1.78,1.78,0,0,1-1.21-.42,1.48,1.48,0,0,1-.48-1.18,1.53,1.53,0,0,1,.77-1.43,3.42,3.42,0,0,1,1.24-.34Zm.86.65a1.54,1.54,0,0,1-.27.14,2.27,2.27,0,0,1-.38.1l-.32.06a2.12,2.12,0,0,0-.65.19.64.64,0,0,0-.33.6.62.62,0,0,0,.2.52.77.77,0,0,0,.49.16,1.46,1.46,0,0,0,.85-.27,1.13,1.13,0,0,0,.4-1Z"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="137.91" width="125.67" height="4.2"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="145.17" width="91.37" height="4.2"/>
    </g>

    <g className="#{CLASSNAME_BASE}-answer">
      <circle className="#{CLASSNAME_BASE}-answer-circle" cx="110.09" cy="167.84" r="7.96"/>
      <path className="#{CLASSNAME_BASE}-answer-label" d="M112.51,166.74a3.09,3.09,0,0,1,.6,2,3.45,3.45,0,0,1-.59,2.07,2.16,2.16,0,0,1-2.73.56,2.15,2.15,0,0,1-.53-.55v.67h-1.38v-7.25h1.4v2.58a2.07,2.07,0,0,1,.59-.57,1.77,1.77,0,0,1,1-.25A2,2,0,0,1,112.51,166.74ZM111.33,170a2,2,0,0,0,.3-1.15,2.58,2.58,0,0,0-.15-.95,1,1,0,0,0-1-.71,1.05,1.05,0,0,0-1.06.69,2.59,2.59,0,0,0-.15,1,2,2,0,0,0,.31,1.14,1.06,1.06,0,0,0,.94.45A1,1,0,0,0,111.33,170Z"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="162.11" width="151.18" height="4.2"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="169.37" width="111.23" height="4.2"/>
    </g>

    <g className="#{CLASSNAME_BASE}-answer-active">
      <circle className="#{CLASSNAME_BASE}-answer-circle" cx="110.09" cy="192.03" r="7.96"/>
      <path className="#{CLASSNAME_BASE}-answer-label" d="M111.14,191.34a1.26,1.26,0,0,0-.2-.54.85.85,0,0,0-.74-.33,1,1,0,0,0-1,.7,2.92,2.92,0,0,0-.14,1,2.68,2.68,0,0,0,.14.95.94.94,0,0,0,.95.67.84.84,0,0,0,.7-.27,1.32,1.32,0,0,0,.25-.69h1.43a2.34,2.34,0,0,1-.46,1.21,2.25,2.25,0,0,1-2,.92,2.29,2.29,0,0,1-1.91-.77,3.11,3.11,0,0,1-.61-2,3.15,3.15,0,0,1,.68-2.15,2.35,2.35,0,0,1,1.86-.77,2.81,2.81,0,0,1,1.65.45,2.11,2.11,0,0,1,.76,1.6Z"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="186.3" width="142.89" height="4.2"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="193.57" width="86.36" height="4.2"/>
    </g>

    <g className="#{CLASSNAME_BASE}-answer">
      <circle className="#{CLASSNAME_BASE}-answer-circle" cx="110.09" cy="216.23" r="7.96"/>
      <path className="#{CLASSNAME_BASE}-answer-label" d="M110.77,214.58a1.69,1.69,0,0,1,.62.59v-2.56h1.42v7.25h-1.37v-.74a2,2,0,0,1-.68.69,1.92,1.92,0,0,1-1,.22,2,2,0,0,1-1.58-.76,2.92,2.92,0,0,1-.64-2,3.36,3.36,0,0,1,.63-2.16,2.06,2.06,0,0,1,1.69-.79A1.72,1.72,0,0,1,110.77,214.58Zm.35,3.82a2,2,0,0,0,.31-1.15,1.76,1.76,0,0,0-.5-1.41,1.07,1.07,0,0,0-.71-.26,1,1,0,0,0-.9.47,2.51,2.51,0,0,0,0,2.34,1,1,0,0,0,.89.45A1,1,0,0,0,111.12,218.4Z"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="210.5" width="138.46" height="4.2"/>
      <rect className="#{CLASSNAME_BASE}-answer-text" x="123.93" y="217.76" width="66.87" height="4.2"/>
    </g>
  </g>

module.exports = CoachGraphic
