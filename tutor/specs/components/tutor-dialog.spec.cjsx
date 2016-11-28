{React, Testing} = require './helpers/component-testing'
{Promise} = require 'es6-promise'

TutorDialog = require '../../src/components/tutor-dialog'

describe 'TutorDialog', ->

  it 'can be shown multiple times', ->
    promises = for i in [1..3]
      new Promise( (resolve) ->
        title = "dialog title #{i}"
        body  = "dialog body #{i}"
        TutorDialog.show({title, body}).then( ->
          resolve()
        )
        dialogs = document.body.querySelectorAll(".tutor-dialog")
        expect(dialogs).to.have.length(1)
        el = document.body.querySelector(".tutor-dialog")
        expect(el.querySelector('.modal-title').textContent).to.equal(title)
        expect(el.querySelector('.modal-body').textContent).to.equal(body)
        Testing.actions.click(document.body.querySelector('.tutor-dialog button.ok'))
      )
    Promise.all promises
