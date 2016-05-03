React  = require 'react'

PieProgress = React.createClass

  propTypes:
    size: React.PropTypes.number.isRequired
    value: React.PropTypes.number.isRequired

  roundToQuarters: (value) ->
    if value <= 49
      25
    else if value >= 50 and value < 75
      50
    else if value >= 75 and value < 100
      75
    else
      100

  render: ->
    {size, value, isConceptCoach, isLate} = @props
    progress = @roundToQuarters(value)
    lateClass = if isLate and not isConceptCoach then 'late' else ''
    q1 =
      <g>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(1 -1) rotate(0)"></path>
      </g>
    q2 =
      <g>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(1 -1) rotate(0)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(25 0) rotate(90)"></path>
      </g>
    q3 =
      <g>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
          transform="translate(1 -1) rotate(0)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(25 0) rotate(90)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(24 24) rotate(180)"></path>
      </g>
    q4 =
      <g>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(1 -1) rotate(0)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(25 0) rotate(90)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(24 24) rotate(180)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="slice #{lateClass}"
        transform="translate(0 23) rotate(270)"></path>
      </g>
    backCircle =
      <g>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="backdrop"
        transform="translate(1 -1) rotate(0)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="backdrop"
        transform="translate(25 0) rotate(90)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="backdrop"
        transform="translate(24 24) rotate(180)"></path>
        <path d="M12 12 L12 0 A12 12 0 0 1 24 12 z"
        className="backdrop"
        transform="translate(0 23) rotate(270)"></path>
      </g>
    pieCircle =
      <svg width="#{size}" height="#{size}" className='pie-progress'>
        {backCircle}
        {if progress is 25 then q1}
        {if progress is 50 then q2}
        {if progress is 75 then q3}
        {if progress is 100 then q4}
      </svg>
    finishedIcon =
      <svg className='finished'>
        <path
        d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12c6.628 0 12-5.373 12-12C24 5.373 18.628 0 12 0z
          M10.557 19.455l-7.042-7.042l2.828-2.828l4.243 4.242l7.07-7.071l2.829 2.829L10.557 19.455z" />
      </svg>
    notStarted = <span className='not-started'>---</span>
    
    if value >= 100
      if isConceptCoach then finishedIcon else pieCircle
    else if value <= 0
      notStarted
    else
      pieCircle



module.exports = PieProgress
