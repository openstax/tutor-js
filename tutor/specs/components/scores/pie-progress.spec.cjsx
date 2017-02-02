{React, SnapShot} = require '../helpers/component-testing'

COURSE_ID = '1'
DATA = require   '../../../api/courses/1/performance.json'

PieProgress = require '../../../src/components/scores/pie-progress'

describe 'Scores Report: pie progress SVG icon', ->

  beforeEach ->
    @props =
      size: 28
      value: 28


  it 'renders < 50% quarters', ->
    wrapper = shallow(<PieProgress {...@props} />)
    expect(wrapper).toHaveRendered('g#q1')
    expect(wrapper).not.toHaveRendered('g#q2')
    expect(wrapper).not.toHaveRendered('g#q3')
    expect(wrapper).not.toHaveRendered('g#q4')
    expect(SnapShot.create(<PieProgress {...@props} />).toJSON()).toMatchSnapshot()

  it 'renders 50% > 75% quarters', ->
    @props.value = 58
    wrapper = shallow(<PieProgress {...@props} />)
    expect(wrapper).not.toHaveRendered('g#q1')
    expect(wrapper).toHaveRendered('g#q2')
    expect(wrapper).not.toHaveRendered('g#q3')
    expect(wrapper).not.toHaveRendered('g#q4')
    expect(SnapShot.create(<PieProgress {...@props} />).toJSON()).toMatchSnapshot()

  it 'renders 75% > 100% quarters', ->
    @props.value = 78
    wrapper = shallow(<PieProgress {...@props} />)
    expect(wrapper).not.toHaveRendered('g#q1')
    expect(wrapper).not.toHaveRendered('g#q2')
    expect(wrapper).toHaveRendered('g#q3')
    expect(wrapper).not.toHaveRendered('g#q4')
    expect(SnapShot.create(<PieProgress {...@props} />).toJSON()).toMatchSnapshot()

  it 'renders 100% quarters', ->
    @props.value = 100
    wrapper = shallow(<PieProgress {...@props} />)
    expect(wrapper).not.toHaveRendered('g#q1')
    expect(wrapper).not.toHaveRendered('g#q2')
    expect(wrapper).not.toHaveRendered('g#q3')
    expect(wrapper).toHaveRendered('g#q4')
    expect(SnapShot.create(<PieProgress {...@props} />).toJSON()).toMatchSnapshot()
