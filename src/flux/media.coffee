_ = require 'underscore'
htmlparser = require 'htmlparser'

{makeSimpleStore} = require './helpers'

mediaLinkRegex = /<a\s+(?:[^>]*?\s+)?href="(#[^"]*)"/g
mediaDOMRegex = (idString) ->
  new RegExp('<[figure|table][^>]*id="+' + idString + '+".*?>+[\s\S]+[<\/figure|table]>', 'g')


# # builder = new htmlparser.HtmlBuilder()
# window.htmlparser = htmlparser

# parseHandler = new htmlparser.DefaultHandler (error, dom) ->
# #  id = htmlparser.DomUtils.getElementById("fs-id1167066794530", dom)
#   id = htmlparser.DomUtils.getElementById("Figure_03_01_Car", dom)
#   # idDOM = builder.write(id)
#   console.info(id)
#   # console.info(idDOM)

# parser = new htmlparser.Parser(parseHandler)

MediaConfig =

  _local: {}


  parse: (htmlString) ->
    # parser.parseComplete(htmlString)
    console.info(htmlString)
    mediaLinks = htmlString.match(mediaLinkRegex)
    _.each(mediaLinks, (mediaLink) ->
      console.info(mediaLink)
      link = _.last(mediaLink.split(' href="#'))
      link = link.replace('"', '')
      console.info(link)
      console.info(mediaDOMRegex(link))
      # mediaDOM = htmlString.match(mediaDOMRegex(link))
      # console.info(mediaDOM)
    )

  _get: (id) ->
    @_local[id]

  exports:
    get: (id) -> @_get(id)

{actions, store} = makeSimpleStore(MediaConfig)
module.exports = {MediaActions:actions, MediaStore:store}