React = require 'react'
SnapShot = require 'react-test-renderer'

OXColoredStripe = require '../../src/components/ox-colored-stripe'

describe 'OX Colored Stripe', ->

  it 'renders and matches snapshot', ->
    expect(SnapShot.create(<OXColoredStripe />).toJSON()).toMatchSnapshot()
