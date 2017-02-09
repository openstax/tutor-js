React = require 'react'
BS = require 'react-bootstrap'
delay = require 'lodash/delay'
Braintree = require './braintree'

module.exports = React.createClass

  displayName: 'PaymentsModal'

  getInitialState: ->
    showModal: false
    message: ''
    processor: new Braintree()

  closeModal: ->
    @setState(showModal: false)

  openModal: ->
    @setState(showModal: true)

  updateProcessingState: (state) ->
    @setState(state)

  startProcessing: ->
    @state.processor.attach(this.refs.cardbody, {
      callback: @updateProcessingState
    })

  stopProcessing: ->
    @state.processor.detach(this.refs.cardbody)

  onSuccess: (state) ->
    @setState(message: "Processed successfully!  Authorization # is #{state.nonce}")
    delay(@props.onSuccess, 8000)

  onFailure: (state) ->
    @setState(state)

  submitCharge: (ev) ->
    @state.processor.submit(ev).then(@onSuccess, @onFailure)

  render: ->
    {Modal} = BS

    <div>
      <a
        className='action'
        onClick={@openModal}
      >
        Pay Course Tuition
      </a>
      <Modal

        onEntered={@startProcessing}
        onExit={@stopProcessing}
        show={@state.showModal} onHide={@closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay course fees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<BS.Alert bsStyle="danger">{@state.message}</BS.Alert> if @state.message}
          <form ref="cardbody">
            <div className="row">
              <div className="form-group col-xs-8">
                <label className="control-label">Card Number</label>
                <div className="form-control" id="card-number"></div>
                <span className="helper-text"></span>
              </div>
              <div className="form-group col-xs-4">
                <div className="row">
                  <label className="control-label col-xs-12">Expiration Date</label>
                  <div className="col-xs-6">
                    <div className="form-control" id="expiration-month"></div>
                  </div>
                  <div className="col-xs-6">
                    <div className="form-control" id="expiration-year"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-xs-6">
                <label className="control-label">Security Code</label>
                <div className="form-control" id="cvv"></div>
              </div>
              <div className="form-group col-xs-6">
                <label className="control-label">Zipcode</label>
                <div className="form-control" id="postal-code"></div>
              </div>
            </div>


            <button value="submit" id="submit" className="btn btn-success btn-lg center-block"
              onClick={@submitCharge}
            >
              Pay with <span id="card-type">Card</span>
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
