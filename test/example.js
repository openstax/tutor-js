window.config = {
  logic: {
    inputs: {
      scale: {
        start: 1,
        end: 3
      },
      mass: {
        start: 1,
        end: 3
      },
      speed: {
        start: 1,
        end: 3
      }
    },
    outputs: {
      ship_mass: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass);
      },
      ship_speed: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(10, speed);
      },
      ship_force: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass) * scale * Math.pow(10, speed);
      },
      ship_mass_grams: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass) * 1000;
      },
      ship_mass_div_speed: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass) / scale * Math.pow(10, speed);
      }
    }
  },
  stimulus_html: 'This exercise has many parts. Each one is a different type of question. Einstein makes a {{ ship_mass }} kg spaceship',
      questions: [
        {
          formats: ['short-answer'],
          stimulus_html: 'The spaceship moves at <span data-math="{{ ship_speed }}">{{ ship_speed }}</span> m/s',
          stem_html: 'What is the rest mass in kg?',
          answers: [
            {
              content_html: '{{ ship_mass }}'
            }
          ]
        }, {
          formats: ['multiple-choice', 'multiple-select', 'short-answer'],
          stem_html: 'What is the force if it slams into a wall?',
          short_stem_html: 'Enter your answer in N',
          answers: [
            {
              id: 'id1',
              value: '{{ ship_force }}',
              content_html: '{{ ship_force }} N'
            }, {
              id: 'id2',
              value: '{{ ship_mass }}',
              content_html: '{{ ship_mass }} N',
              hint: 'Remember 1 Newton (N) is 1 kg*m/s'
            }
          ],
          correct: 'id1'
        }, {
          formats: ['multiple-select', 'multiple-choice', 'short-answer'],
          stem_html: 'What is the force if it slams into a wall? (this has (a) and (b) options)',
          short_stem_html: 'Enter your answer in N',
          answers: [
            {
              id: 'wrong',
              content_html: '0'
            }, {
              id: 'wrong2',
              content_html: '1'
            }, {
              id: 'id123',
              content_html: '{{ ship_force }} N'
            }, {
              id: 'id456',
              content_html: '{{ ship_force }} + 0 <br/> + 0 <br/> + 0 N'
            }, {
              id: 'id567',
              values: ['id456', 'id123']
            }
          ],
          correct: 'id567'
        },
        {
          formats: ['fill-in-the-blank', 'true-false', 'multiple-choice'],
          stimulus_html: 'Simple fill-in-the-blank questions',
          stem_html: 'If the ship is traveling {{ ship_speed }} m/s and slams into a wall, the impact force is ____ N.',
          answers: [
            {
              content_html: '{{ ship_force }}'
            }, {
              content_html: '{{ ship_mass_div_speed }}',
              hint: 'Remember 1 Newton (N) is 1 kg*m/s'
            }
          ],
          correct: '{{ ship_force }}'
        }, {
          formats: ['fill-in-the-blank', 'true-false'],
          stem_html: 'Photosynthesis ____ ATP',
          answers: [
            {
              content_html: 'creates'
            }, {
              content_html: 'smells like'
            }
          ],
          correct: 'creates'
        },
        {
          formats: ['matching'],
          stimulus_html: 'Matching question (for draw-a-line-to-match)',
          stem_html: 'Match the words on the left with words on the right by drawing a line',
          items: ['foot', 'head', 'hand'],
          answers: [
            {
              credit: 1,
              content_html: 'sock'
            }, {
              credit: 1,
              content_html: 'hat'
            }, {
              credit: 1,
              content_html: 'glove'
            }
          ]
        },
        {
          formats: ['short-answer'],
          stimulus_html: 'These questions have aleady been answered by the student and are meant to test that the Exercise knows not to render radio buttons, input boxes, etc',
          stem_html: 'What is 2+2?',
          answer: '42'
        }, {
          formats: ['fill-in-the-blank'],
          stem_html: '2+2 is ____',
          answer: '0',
          correct: '4'
        }, {
          formats: ['multiple-choice'],
          stem_html: 'What is 2+2?',
          answers: [
            {
              id: 'id1',
              content_html: '4'
            }, {
              id: 'id2',
              content_html: '42'
            }
          ],
          correct: 'id1',
          answer: 'id1'
        }
      ]
};
