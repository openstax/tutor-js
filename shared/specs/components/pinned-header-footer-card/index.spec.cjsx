React = require 'react'
{Testing, sinon, _} = require 'shared/specs/helpers'

PinnedHeaderFooterCard = require 'components/pinned-header-footer-card'

TestChildComponent = React.createClass
  displayName: 'TestChildComponent'
  render: -> <span>i am a test</span>

describe 'Pinned Header/Footer Card Component', ->
  props = null

  beforeEach ->
    props =
      cardType: 'test'


  it 'renders child components', ->
    wrapper = shallow(
      <PinnedHeaderFooterCard {...props}><TestChildComponent /></PinnedHeaderFooterCard>
    )
    expect(wrapper.find('TestChildComponent')).to.have.length(1)
    undefined


  it 'sets/unsets body class', ->
    testClass = 'foo-test-bar'
    document.body.classList.add(testClass)
    wrapper = mount(
      <PinnedHeaderFooterCard {...props}><TestChildComponent /></PinnedHeaderFooterCard>
    )
    expect(document.body.classList.contains(testClass)).to.be.true
    expect(document.body.classList.contains('test-view')).to.be.true
    expect(document.body.classList.contains('pinned-view')).to.be.true
    expect(document.body.classList.contains('pinned-force-shy')).to.be.false
    wrapper.unmount()
    expect(document.body.classList.contains(testClass)).to.be.true
    undefined


  it 'unsets pinned-shy when scrolled down', ->
    props.header = React.createElement('span', {}, 'i am header')
    wrapper = mount(
      <PinnedHeaderFooterCard {...props}><TestChildComponent /></PinnedHeaderFooterCard>
    )
    expect(document.body.classList.contains('pinned-shy')).toBe(true)
    wrapper.setState(offset: 400) # imitate react-scroll-components
    expect(document.body.classList.contains('pinned-shy')).toBe(false)
    undefined
