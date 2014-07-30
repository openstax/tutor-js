# HTMLBars is a bit annoying to shim in to browserify:
# - it concatenates several modues into one file (deamdify does not like that)
# - it uses a custom loader

# When concatenating the files together you will need to include the loader and htmlbars files ahead of time

Compiler = requireModule('htmlbars-compiler/compiler')
{hooks} = requireModule('htmlbars-runtime')
{DOMHelper} = requireModule('morph')

module.exports = {Compiler, hooks, DOMHelper}
