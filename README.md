# Shared FE things across OpenStax repos

## How to use in another repo

### Install

You can install from npm (or bower) like so:

```bash
npm install --save openstax/react-components#v0.0.0
```

This will add the following line to your `package.json`:

```js
  "openstax-react-components": "github:openstax/react-components#v0.0.0"
```

For Travis to be able to install, you will need to change this to:

```js
  "openstax-react-components": "openstax/react-components#v0.0.0"
```

### Use

Once installed, you need only to require it and use it like so:

```coffeescript
{ArbitraryHtmlAndMath, Question, CardBody, FreeResponse} = require 'openstax-react-components'

<ArbitraryHtmlAndMath html={"..."}/>

```

Should you be using this in a project without React, you can require it like this:

```coffeescript
{ArbitraryHtmlAndMath, Question, CardBody, FreeResponse} = require 'openstax-react-components\full-build.min'

# Mount like this
FreeResponse(DOMNode, props)

```

## Current exposed things

As [seen here](https://github.com/openstax/react-components/blob/master/index.cjsx)

### Exercise related components

* Exercise
* ExerciseGroup
* FreeResponse

### Pinned card set components

* PinnedHeaderFooterCard
* PinnedHeader
* CardBody
* PinnableFooter

### Smaller display components

* Question
* ArbitraryHtmlAndMath

### Button Components

* RefreshButton
* AsyncButton

### Mixins

* ChapterSectionMixin
* GetPositionMixin
* ResizeListenerMixin
