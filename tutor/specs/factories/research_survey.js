const {
  Factory, sequence, fake, APPEARANCE_CODES,
} = require('./helpers');

Factory.define('ResearchSurvey')
  .id(sequence)
  .title(() => `Do you like ${fake.commerce.productName()}`)
  .model(
    `{
        pages: [
          {
            name: "page1",
            elements: [
              { name: "name", type: "text", title: "Please enter your name:", placeHolder: "Jon Snow", isRequired: true },
              { name: "email", type: "text", inputType: "email", title: "Your e-mail:", placeHolder: "jon.snow@nightwatch.org" },
                {
                type: "radiogroup",
                name: "bananas",
                title: "Do you like to eat bananas?",
                isRequired: true,
                choices: [
                  {
                    value: "no",
                    text: "No"
                  },
                  {
                    value: "yes",
                    text: "Yes, they're great!"
                  }
                ]
              },
              {
     type: "comment",
     name: "WHY?",
     title: "Why?"
    },
    {
     type: "checkbox",
     name: "other-fruits",
     title: "Check other types of fruit you like",
     choices: [
      {
       value: "apples",
       text: "Apples"
      },
      {
       value: "mango",
       text: "Mango"
      },
      {
       value: "steak",
       text: "STEAK!"
      }
     ]
    },
    {
     type: "comment",
     name: "What else would you like to say?"
}
]
}
]
}`
  );
