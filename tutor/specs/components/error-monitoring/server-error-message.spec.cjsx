{React} = require '../helpers/component-testing'

ErrorMessage = require '../../../src/components/error-monitoring/server-error-message'


describe 'Error monitoring: server-error message', ->
  props = {}
  beforeEach ->
    props =
      status: 404
      statusMessage: "Not Found"
      config:
        method: 'none'
        url: 'non-url'
        data: 'code: Red'

  it 'renders for errors with status 500', ->
    props.status = 500
    wrapper = shallow(<ErrorMessage {...props} />)
    expect(wrapper.text()).to.include('500')
    undefined
