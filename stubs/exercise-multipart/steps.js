var steps = [{ "id": "step-id-9-1",
    "type": "exercise",
    "correct_answer_id": "id2",
    "is_in_multipart": true,
    "content_url": "https://exercises-dev.openstax.org/exercises/120@1",
    "content": {
      "stimulus_html": "Addition is fun",
      "questions":[
        {
          "id": "987",
          "formats": ["multiple-choice", "free-response"],
          "stem_html":"What is <span data-math='2+2'>2+2</span>?",
          "answers":[
            {"id":"id1","content_html":"22"},
            {"id":"id2","content_html":"4"}
          ]
        }
      ]
    },
    "group": "core"
  },
  { "id": "step-id-9-2",
    "type": "exercise",
    "correct_answer_id": "id3",
    "is_in_multipart": true,
    "content_url": "https://exercises-dev.openstax.org/exercises/120@1",
    "content": {
      "stimulus_html": "Stimulus for Second Exercise",
      "questions":[
        {
          "id": "876",
          "formats": ["multiple-choice", "free-response"],
          "stem_html":"Is the glass half full or half empty?",
          "answers":[
            {"id":"id3","content_html":"Half Full"},
            {"id":"id4","content_html":"Half Empty"}
          ]
        }
      ]
    },
    "group": "core",
    "related_content": [{
        "title": "Physics is cool, yo",
        "chapter_section": "1.3"
    }]
  },
  { "id": "step-id-9-3",
    "type": "exercise",
    "correct_answer_id": "idn2",
    "is_in_multipart": true,
    "has_recovery": true,
    "content_url": "https://exercises-dev.openstax.org/exercises/120@1",
    "feedback_html": "Two apples and then <span data-math='2'>2</span> more apples is <strong>four</strong>",
    "content": {
      "stimulus_html": "Multiplication is fun",
      "questions":[
        {
          "id": "990",
          "formats": ["multiple-choice", "free-response"],
          "stem_html":"What is <span data-math='4+4'>4+4</span>?",
          "answers":[
            {"id":"idn1","content_html":"222"},
            {"id":"idn2","content_html":"42"}
          ]
        }
      ]
    },
    "group": "core"
  }
];

module.exports = steps;
