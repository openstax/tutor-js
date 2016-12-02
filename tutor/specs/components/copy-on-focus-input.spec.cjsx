{React} = require './helpers/component-testing'


jest.mock('../../src/helpers/clipboard')

Clipboard = require '../../src/helpers/clipboard'

CopyOnFocusInput = require '../../src/components/copy-on-focus-input'


describe 'CopyOnFocusInput', ->
  beforeEach ->
    Clipboard.copy.mockClear()
    @props =
      value: 'a string that is important'

  afterEach
  it 'renders and copys when focused', ->
    wrapper = mount(<CopyOnFocusInput {...@props} />)
    expect(Clipboard.copy).not.toHaveBeenCalled()
    wrapper.simulate('focus')
    expect(Clipboard.copy).toHaveBeenCalled()

  it 'can auto-focus', ->
    @props.focusOnMount = true
    expect(Clipboard.copy).not.toHaveBeenCalled()
    wrapper = mount(<CopyOnFocusInput {...@props} />)
    expect(Clipboard.copy).toHaveBeenCalled()
