{React, SnapShot} = require '../helpers/component-testing'

Content = require '../../../src/components/qa/content'

{EcosystemsActions, EcosystemsStore} = require '../../../src/flux/ecosystems'
{ReferenceBookActions, ReferenceBookStore} = require '../../../src/flux/reference-book'

ECOSYSTEMS = require '../../../api/ecosystems.json'
PAGE = require '../../../api/ecosystems/3/readings.json'
ECOSYSTEM_ID = '3'
CNX_ID = '17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'


xdescribe 'QA Exercises Content', ->

  beforeEach ->
    EcosystemsActions.loaded(ECOSYSTEMS)
    ReferenceBookActions.loaded(PAGE, ECOSYSTEM_ID)
    @props =
      cnxId: CNX_ID

  it 'renders a book page', ->
    wrapper = shallow(<Content {...@props} />)
    expect(wrapper).toHaveRendered('ReferenceBookPage')

  it 'matches snapshot', ->
    expect(SnapShot.create(<Content {...@props} />).toJSON()).toMatchSnapshot()
