React = require 'react'
Notifications = require '../../model/notifications'

Modal = require '../payments/modal'

MakePaymentNotification = React.createClass
  displayName: 'MakePaymentNotification'
  propTypes:
    callbacks: React.PropTypes.shape(
      onCCSecondSemester: React.PropTypes.func.isRequired
    )
    notice: React.PropTypes.shape(
      id: React.PropTypes.oneOfType([
        React.PropTypes.number, React.PropTypes.string
      ])
    )

  onSuccess: ->
    Notifications.acknowledge(@props.notice)

  actionsLink: ->
    <a className='action' onClick={@makePayment}>
      Pay Now
    </a>

  render: ->
    <div className='notification'>
      <span className="body">
        <i className="icon fa fa-info-circle" />
        <span>Your demo period has ended, please make a payment</span>
        <Modal onSuccess={@onSuccess} />
      </span>
    </div>

module.exports = MakePaymentNotification
