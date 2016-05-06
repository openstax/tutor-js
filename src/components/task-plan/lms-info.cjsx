React = require 'react'
BS = require 'react-bootstrap'

# TODO drag and drop, and resize behavior
LmsInfo = React.createClass

  getInitialState: ->
    isShowing: false

  propTypes:
    plan: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      title: React.PropTypes.string.isRequired
      shareable_url: React.PropTypes.string
    ).isRequired

  togglePopover: ->
    @setState(isShowing: not @state.isShowing)

  onInputFocus: (ev) ->
    ev.target.select()

  renderPopOver: ->
    {title, description, shareable_url} = @props.plan

    l = window.location
    url = "#{l.protocol}//#{l.host}#{shareable_url}"
    if description
      description = <p>{description}</p>

    <BS.Popover
      className="sharable-link"
      id={_.uniqueId('sharable-link-popover')}
      arrowOffsetLeft={-120} # seems to have no effect?
    >
      <div className='body'>
        <h4>Copy information for your LMS</h4>
        <p>{title}</p>
        <input value={url} readOnly={true} onClick={@onInputFocus}/>
        {description}
      </div>
    </BS.Popover>

  render: ->
    return null unless @props.plan.shareable_url

    <div className="lms-info">
      <BS.OverlayTrigger trigger="click"
        placement="top"
        container={this}
        arrowOffsetLeft={-120} # seems to have no effect?
        overlay={@renderPopOver()}
      >
        <a onClick={@togglePopover} className="get-link">Get assignment link</a>
      </BS.OverlayTrigger>

    </div>


module.exports = LmsInfo
