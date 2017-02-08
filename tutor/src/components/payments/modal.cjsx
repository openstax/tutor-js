React = require 'react'
BS = require 'react-bootstrap'

Braintree = require './braintree'

module.exports = React.createClass

  displayName: 'PaymentsModal'

  getInitialState: ->
    showModal: false
    processor: new Braintree()

  closeModal: ->
    @setState(showModal: false)

  openModal: ->
    @setState(showModal: true)

  startProcessing: ->
    @state.processor.attach(this.refs.cardbody)

  stopProcessing: ->
    @state.processor.detach(this.refs.cardbody)

  submitCharge: (ev) ->
    @state.processor.submit(ev).then(
      => @setState(showModal: false) # save token to flux store

    )

  render: ->
    {Modal} = BS

    <div>
      <BS.Button
          bsStyle="primary"
          bsSize="large"
          onClick={@openModal}
      >
        Pay Course Tuition
      </BS.Button>
      <Modal
        container={@}
        onEntered={@startProcessing}
        onExit={@stopProcessing}
        show={@state.showModal} onHide={@closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay course fees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="panel-body" ref="cardbody">
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
        <Modal.Footer>
          <BS.Button onClick={@closeModal}>Close</BS.Button>
        </Modal.Footer>
      </Modal>
    </div>
