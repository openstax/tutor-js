{React, SnapShot, Wrapper} = require './helpers/component-testing'

InvalidPage = require '../../src/components/invalid-page'
EnzymeContext = require './helpers/enzyme-context'

describe 'Invalid Page', ->


  it 'renders and matches snapshot', ->
    wrapper = shallow(<InvalidPage />)
    expect(wrapper).toHaveRendered('OXColoredStripe')

    expect(SnapShot.create(
      <Wrapper _wrapped_component={InvalidPage} noReference />).toJSON()
    ).toMatchSnapshot()
