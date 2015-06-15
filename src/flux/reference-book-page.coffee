{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

ReferenceBookPageConfig = {



}

extendConfig(ReferenceBookPageConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookPageConfig)
module.exports = {ReferenceBookPageActions:actions, ReferenceBookPageStore:store}
