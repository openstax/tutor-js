{expect} = require 'chai'
_ = require 'underscore'

React = require 'react/addons'

{componentStub, commonActions}   = require './helpers/utilities'

{TutorDateInput} = require '../../src/components/tutor-input'
TimeHelper = require '../../src/helpers/time'

checkForClosedDatepicker = ->
  datepickerContainers = Array.prototype.slice.call(document.querySelectorAll('.datepicker__container'))
  expect(datepickerContainers.length).to.equal(0)

triggerAndCheckDatePicker = (dateInput) ->
  React.addons.TestUtils.Simulate.focus(dateInput.getDOMNode().querySelector('.datepicker__input'))
  dateInput.expandCalendar()
  datepickerContainers = Array.prototype.slice.call(document.querySelectorAll('.datepicker__container'))
  hasDatepicker = datepickerContainers.length > 0
  expect(hasDatepicker).to.be.true

describe 'One Tutor Date Input', ->
  # Don't need to render on each since no actions are being performed between each task
  before (done) ->

    @originalLocale = TimeHelper.getCurrentLocales()

    SingleDateInput = React.createClass
      render: ->
        <div>
          <TutorDateInput ref='dateInput' />
        </div>

    componentStub
      .render(<SingleDateInput />)
      .then((result) =>
        @result = result
        done()
      , done)

  it 'should be able to open when triggered', ->
    {component} = @result
    checkForClosedDatepicker()

    _.each(component.refs, triggerAndCheckDatePicker)

  it 'should revert moment to full locale when unmount', (done) ->
    componentStub.unmount()
    {originalLocale} = @
    currentLocale = TimeHelper.getCurrentLocales()

    expect(currentLocale.weekdaysMin).to.be.a('array')
    expect(currentLocale).to.deep.equal(originalLocale)

    done()



describe 'Multiple Date Inputs', ->
  # Don't need to render on each since no actions are being performed between each task
  before (done) ->

    @originalLocale = TimeHelper.getCurrentLocales()

    MultipleDateInputs = React.createClass
      render: ->
        <div>
          <TutorDateInput currentLocale={@originalLocale} ref='dateInputOne' />
          <TutorDateInput currentLocale={@originalLocale} ref='dateInputTwo' />
          <TutorDateInput currentLocale={@originalLocale} ref='dateInputThree' />
        </div>

    componentStub
      .render(<MultipleDateInputs />)
      .then((result) =>
        @result = result
        done()
      , done)

  it 'should be able to open when triggered', ->
    {component} = @result
    checkForClosedDatepicker()

    _.each(component.refs, triggerAndCheckDatePicker)


  it 'should revert moment to full locale when unmount', (done) ->
    componentStub.unmount()
    {originalLocale} = @
    currentLocale = TimeHelper.getCurrentLocales()

    expect(currentLocale.weekdaysMin).to.be.a('array')
    expect(currentLocale).to.deep.equal(originalLocale)

    done()

