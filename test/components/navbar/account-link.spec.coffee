{Testing, expect, sinon, _} = require '../helpers/component-testing'

Link = require '../../../src/components/navbar/account-link'
USER = require '../../../api/user.json'
{CurrentUserActions} = require '../../../src/flux/current-user'
{TransitionAssistant} = require '../../../src/components/unsaved-state'

describe 'Account Link', ->

  it 'only renders if account profile_url is present', ->
    CurrentUserActions.reset() # just in case another spec has loaded
    Testing.renderComponent( Link ).then ({root}) ->
      expect(root.querySelector('a')).to.be.null

  it 'does not use TransitionAssistant when redirecting', ->
    sinon.stub TransitionAssistant, 'checkTransitionStateTo', ->
      # We do not want to resolve the promise because that causes the test runner to redirect and mucks up the specs
      return Promise.reject()
    CurrentUserActions.loaded(USER)
    Testing.renderComponent( Link ).then ({dom}) ->
      Testing.actions.click(dom.querySelector('a'))
      expect(TransitionAssistant.checkTransitionStateTo).not.to.have.been.called
