Braintree    = require 'braintree-web/client'
HostedFields = require 'braintree-web/hosted-fields'

{Promise} = require 'es6-promise'

class BraintreeClient

  constructor: ->
    Braintree.create(
      {
        # FIXME: this code is from their public samples, will need our own
        authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
      },
      (err, @clientInstance) => @onError(err)
    )


  onError: (err) ->
    return unless (err)
    this.callback(err) if this.callback

  detach: ->
    this.hostedFields?.teardown()

  attach: (@dom, options = {}) ->
    this.callback = options.callback
    HostedFields.create({
      client: @clientInstance,
      styles: {
        'input': {
          'font-size': '14px',
          'font-family': 'helvetica, tahoma, calibri, sans-serif',
          'color': '#3a3a3a'
        },
        ':focus': {
          'color': 'black'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123'
        },
        expirationMonth: {
          selector: '#expiration-month',
          placeholder: 'MM'
        },
        expirationYear: {
          selector: '#expiration-year',
          placeholder: 'YY'
        },
        postalCode: {
          selector: '#postal-code',
          placeholder: '90210'
        }
      }
    },
      (err, @hostedFields) =>
        @hostedFields.on 'validityChange', @onValidityChange
        @hostedFields.on 'cardTypeChange', @onCardTypeChange
        @onError(err)
    )


  # translated from the jquery sample code
  onValidityChange: (event) =>
    field = event.fields[event.emittedBy]
    if field.isValid
      if event.emittedBy is 'expirationMonth' or event.emittedBy is 'expirationYear'
        if not event.fields.expirationMonth.isValid or not event.fields.expirationYear.isValid
          return
      else if event.emittedBy is 'number'
        @dom.querySelector('#card-number + span').innerHTML = ''
      field.container.parentElement.classList.add('has-success')
    else if field.isPotentiallyValid
      field.container.parentElement.classList.remove('has-warning')
      field.container.parentElement.classList.remove('has-success')
      if event.emittedBy is 'number'
        @dom.querySelector('#card-number + span').innerHTML = ''
    else
      for el in this.dom.querySelectorAll('.form-group')
        el.classList.add('has-warning')
      if event.emittedBy is 'number'
        @dom.querySelector('#card-number + span').innerHTML = 'Looks like this card number has an error.'

  onCardTypeChange: (event) =>
    # Handle a field's change, such as a change in validity or credit card type
    @dom.querySelector('#card-type')
      .innerHTML = if event.cards.length is 1
        event.cards[0].niceType
      else
        'Card'

  submit: (ev) ->
    ev.preventDefault()
    return new Promise((resolve, reject) =>
      @hostedFields.tokenize( (err, payload) =>
        if (err)
          @onError(err)
          reject(err)
        else
          console.log(payload)
          resolve(payload)
      )
    )

module.exports = BraintreeClient
