{Converter} = require('showdown')
converter = new Converter()

module.exports = React.createClass
  render: ->
    {converter.makeHtml(this.props.children.toString())}
