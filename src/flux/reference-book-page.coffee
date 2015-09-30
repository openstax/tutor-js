{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

{MediaActions} = require './media'

ReferenceBookPageConfig = {

  _loaded: (obj, id) ->
    MediaActions.parse(obj.content_html)
    obj

}

extendConfig(ReferenceBookPageConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookPageConfig)
module.exports = {ReferenceBookPageActions:actions, ReferenceBookPageStore:store}
