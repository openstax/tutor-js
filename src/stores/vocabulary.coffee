_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'


VocabularyConfig = {

  createBlank: (id) ->
    template = @exports.getTemplate.call(@)
    @loaded(template, id)


  exports:
    getTemplate: (id) ->
      {}


}


extendConfig(VocabularyConfig, new CrudConfig())
{actions, store} = makeSimpleStore(VocabularyConfig)

module.exports = {VocabularyActions:actions, VocabularyStore:store}
