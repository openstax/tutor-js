var steps = [{ "id": "step-id-9-1",
    "type": "exercise",
    "correct_answer_id": "id2",
    "is_in_multipart": true,
    "content": {
      "uid": "120@1",
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
    }
  },
  { "id": "step-id-9-2",
    "type": "exercise",
    "correct_answer_id": "id3",
    "is_in_multipart": true,
    "content": {
      "uid": "120@1",
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
    }
  },
  { "id": "step-id-9-3",
    "type": "exercise",
    "correct_answer_id": "idn2",
    "is_in_multipart": true,
    "has_recovery": true,
    "feedback_html": "Two apples and then <span data-math='2'>2</span> more apples is <strong>four</strong>",
    "content": {
      "uid": "120@1",
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
    }
  }
];

module.exports = steps;
