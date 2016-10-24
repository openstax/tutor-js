{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

{MediaActions} = require './media'
{StepTitleActions} = require './step-title'

ReferenceBookPageConfig = {

  _loaded: (obj, id) ->
    MediaActions.parse(obj.content_html)
    StepTitleActions.parseMetaOnly(id, obj.content_html)
    obj

  loadSilent: (id) ->
    @load(id)

}

extendConfig(ReferenceBookPageConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookPageConfig)
module.exports = {ReferenceBookPageActions:actions, ReferenceBookPageStore:store}
