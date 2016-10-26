{Testing, expect, sinon, _, React, ReactTestUtils} = require 'shared/specs/helpers'
{Promise} = require 'es6-promise'

SafariWarning = require '../../src/concept-coach/safari-warning'

# coffeelint: disable=max_line_length
BROWSERS =
  chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36"
  safari10: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Safari/602.1.50"
  firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:48.0) Gecko/20100101 Firefox/48.0"
  ie: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; GWX:RED; rv:11.0) like Gecko"

SAFARI9 = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7"
# coffeelint: enable=max_line_length

describe 'Safari Warning Component', ->
  beforeEach ->
    @props =
      windowImpl:
        navigator:
          userAgent: ''

  it 'does not render for other web-browsers', ->
    Promise.all(
      for name, agent of BROWSERS
        @props.windowImpl.navigator.userAgent = agent
        Testing.renderComponent( SafariWarning, props: @props ).then  ({dom}) ->
          expect(dom).not.to.exist
    )

  it 'renders for safari 9', ->
    @props.windowImpl.navigator.userAgent = SAFARI9
    Testing.renderComponent( SafariWarning, props: @props ).then  ({dom}) ->
      expect(dom).to.exist
      expect(dom.querySelector("a[href*='mozilla.org']")).to.exist
      expect(dom.querySelector("a[href*='google.com']")).to.exist
      expect(dom.querySelector("a[href*='apple.com']")).to.exist
