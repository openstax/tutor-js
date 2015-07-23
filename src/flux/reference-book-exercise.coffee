{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

ReferenceBookExerciseConfig = {

}

extendConfig(ReferenceBookExerciseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookExerciseConfig)
module.exports = {ReferenceBookExerciseActions:actions, ReferenceBookExerciseStore:store}
