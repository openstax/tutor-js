!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Exercise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var $ex, Compiler, DOMHelper, a, answer, b, background, choices, config, domify, exercise, hooks, i, keepBlankIndex, key, makeDiv, makeInput, makeRadioDiv, nextId, part, partIndex, parts, question, questionIndex, questions, randRange, state, val, _ref, _ref1;

config = {
  short_answer: prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
};

exercise = {
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
  background: 'This exercise has many parts. Each one is a different type of question. Einstein makes a {{ ship_mass }} kg spaceship',
  parts: [
    {
      background: 'The spaceship moves at {{ ship_speed }} m/s',
      questions: [
        {
          stem: 'What is the rest mass? (Short answer)',
          short_stem: 'Enter your answer in kg',
          answers: [
            {
              credit: 1,
              value: '{{ ship_mass }}'
            }
          ]
        }, {
          stem: 'What is the rest mass?',
          short_stem: 'Enter your answer in kg',
          answers: [
            {
              credit: 1,
              value: '{{ ship_mass }}'
            }, {
              credit: 0,
              value: '{{ ship_mass_grams }}',
              hint: 'Check the units'
            }
          ]
        }, {
          stem: 'What is the force if it slams into a wall?',
          short_stem: 'Enter your answer in N',
          answers: [
            {
              credit: 1,
              value: '{{ ship_force }}',
              content: '{{ ship_force }} N'
            }, {
              credit: 0,
              value: '{{ ship_mass_div_speed }}',
              content: '{{ ship_mass_div_speed }} N',
              hint: 'Remember 1 Newton (N) is 1 kg*m/s'
            }
          ]
        }
      ]
    }, {
      background: 'Simple fill-in-the-blank questions',
      questions: [
        {
          stem: 'Photosynthesis ____ ATP',
          answers: [
            {
              credit: 1,
              value: 'creates'
            }
          ]
        }
      ]
    }, {
      background: 'Fill in this table (this is a multi-fill-in-the-blank):\n\n<table>\n  <tr><th>Time</th><th>Distance</th><th>Velocity</th></tr>\n  <tr><td>t<sub>0</sub></td><td>____1</td><td>____2</td></tr>\n  <tr><td>t<sub>1</sub></td><td>____3</td><td>____4</td></tr>\n  <tr><td>t<sub>2</sub></td><td>____5</td><td>____6</td></tr>\n</table>',
      questions: [
        {
          answers: [
            {
              credit: 1,
              value: 0
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: -1,
              content: '{{ ship_mass }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: '{{ ship_force }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: 10,
              content: '{{ ship_speed }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: 100,
              content: '{{ ship_force }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: 1000,
              content: '{{ ship_mass_grams }}'
            }
          ]
        }
      ]
    }
  ]
};

Compiler = requireModule('htmlbars-compiler/compiler');

DOMHelper = requireModule('morph').DOMHelper;

hooks = requireModule('htmlbars-runtime').hooks;

randRange = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

state = {};

_ref = exercise.logic.inputs;
for (key in _ref) {
  val = _ref[key];
  state[key] = randRange(val.start, val.end);
}

_ref1 = exercise.logic.outputs;
for (key in _ref1) {
  val = _ref1[key];
  val = val(state);
  try {
    val = parseInt(val);
    val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (_error) {
    '';
  }
  state[key] = val;
}

domify = function(source, data) {
  var dom, template;
  template = Compiler.compile(source);
  dom = template(data, {
    hooks: hooks,
    dom: new DOMHelper()
  });
  return dom;
};

makeDiv = function(name, text, children) {
  if (children == null) {
    children = [];
  }
  text = text.replace(/____(\d+)?/g, '<input type="text"/>');
  return "<div class='" + name + "'>" + text + (children.join('')) + "</div>";
};

makeInput = function(name, text) {
  text = text.replace(/____(\d+)?/g, '<input type="text"/>');
  return "<input type='text' class='" + name + "' placeholder=\"" + text + "\"/>";
};

nextId = 0;

makeRadioDiv = function(questionId, name, value, text) {
  var id;
  id = "id-" + (nextId++);
  text = text.replace(/____(\d+)?/g, '<input type="text"/>');
  return "<div class='" + name + "'><input type='radio' name='" + questionId + "' id='" + id + "' value='" + value + "'/> <label for='" + id + "'>" + text + "</label></div>";
};

parts = (function() {
  var _i, _j, _len, _len1, _ref2, _ref3, _results;
  _ref2 = exercise.parts;
  _results = [];
  for (partIndex = _i = 0, _len = _ref2.length; _i < _len; partIndex = ++_i) {
    part = _ref2[partIndex];
    if (part.background && part.background.split('____').length > 2 && config.short_answer) {
      background = part.background;
      keepBlankIndex = randRange(0, part.questions.length - 1);
      _ref3 = part.questions;
      for (i = _j = 0, _len1 = _ref3.length; _j < _len1; i = ++_j) {
        question = _ref3[i];
        if (i !== keepBlankIndex) {
          answer = question.answers[0].content || question.answers[0].value;
          background = background.replace("____" + (i + 1), answer);
        }
      }
      _results.push(makeDiv('part', background));
    } else {
      questions = (function() {
        var _k, _len2, _ref4, _results1;
        _ref4 = part.questions;
        _results1 = [];
        for (questionIndex = _k = 0, _len2 = _ref4.length; _k < _len2; questionIndex = ++_k) {
          question = _ref4[questionIndex];
          if (/____(\d+)?/.test(question.stem)) {
            _results1.push(makeDiv('question', question.stem));
          } else if (question.answers.length > 1 && !config.short_answer) {
            choices = (function() {
              var _l, _len3, _ref5, _results2;
              _ref5 = question.answers;
              _results2 = [];
              for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
                answer = _ref5[_l];
                if (answer.content) {
                  _results2.push(makeRadioDiv("id-" + partIndex + "-" + questionIndex, 'choice', answer.value, answer.content));
                } else {
                  _results2.push(makeRadioDiv("id-" + partIndex + "-" + questionIndex, 'choice', answer.value, answer.value));
                }
              }
              return _results2;
            })();
            _results1.push(makeDiv('question', question.stem, choices));
          } else {
            if (question.short_stem) {
              a = makeDiv('question', question.stem);
              b = makeInput('question', question.short_stem);
              _results1.push("" + a + b);
            } else if (question.stem) {
              a = makeDiv('question', question.stem);
              b = makeInput('question', '');
              _results1.push("" + a + b);
            } else {
              _results1.push('');
            }
          }
        }
        return _results1;
      })();
      _results.push(makeDiv('part', part.background, questions));
    }
  }
  return _results;
})();

$ex = document.getElementById('exercise');

$ex.innerHTML = '';

$ex.appendChild(domify(makeDiv('background', exercise.background, parts), state));



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9waGlsL2dpdGh1Yi9vcGVuc3RheC9leGVyY2lzZS1tYWtlci1qcy9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3BoaWwvZ2l0aHViL29wZW5zdGF4L2V4ZXJjaXNlLW1ha2VyLWpzL3NyYy9leGVyY2lzZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLDhQQUFBOztBQUFBLE1BQUEsR0FDRTtBQUFBLEVBQUEsWUFBQSxFQUFjLE1BQUEsQ0FBTyx5RUFBUCxFQUFrRixFQUFsRixDQUFkO0NBREYsQ0FBQTs7QUFBQSxRQUlBLEdBQ0U7QUFBQSxFQUFBLEtBQUEsRUFDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU87QUFBQSxRQUFFLEtBQUEsRUFBTyxDQUFUO0FBQUEsUUFBWSxHQUFBLEVBQUssQ0FBakI7T0FBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPO0FBQUEsUUFBRSxLQUFBLEVBQU8sQ0FBVDtBQUFBLFFBQVksR0FBQSxFQUFLLENBQWpCO09BRFA7QUFBQSxNQUVBLEtBQUEsRUFBTztBQUFBLFFBQUUsS0FBQSxFQUFPLENBQVQ7QUFBQSxRQUFZLEdBQUEsRUFBSyxDQUFqQjtPQUZQO0tBREY7QUFBQSxJQUlBLE9BQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUFXLFNBQUMsSUFBRCxHQUFBO0FBQTBCLFlBQUEsa0JBQUE7QUFBQSxRQUF4QixhQUFBLE9BQU8sWUFBQSxNQUFNLGFBQUEsS0FBVyxDQUFBO2VBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxFQUFjLElBQWQsRUFBbEM7TUFBQSxDQUFYO0FBQUEsTUFDQSxVQUFBLEVBQVksU0FBQyxJQUFELEdBQUE7QUFBMEIsWUFBQSxrQkFBQTtBQUFBLFFBQXhCLGFBQUEsT0FB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Q0FBTyxPQUFBLENBQVEsWUFBUixFQUFzQixRQUFRLENBQUMsVUFBL0IsRUFBMkMsS0FBM0MsQ0FBUCxFQUEwRCxLQUExRCxDQUFoQixDQXZLQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbmZpZyA9XG4gIHNob3J0X2Fuc3dlcjogcHJvbXB0KCdEbyB5b3UgcHJlZmVyIHNob3J0IGFuc3dlciBxdWVzdGlvbnMgKFwiXCIgZm9yIG5vLCBhbnl0aGluZyBlbHNlIGZvciB5ZXMpJywgJycpXG4gICAjbXVsdGlwbGVfY2hvaWNlOiB0cnVlXG5cbmV4ZXJjaXNlID1cbiAgbG9naWM6XG4gICAgaW5wdXRzOlxuICAgICAgc2NhbGU6IHsgc3RhcnQ6IDEsIGVuZDogMyB9XG4gICAgICBtYXNzOiAgeyBzdGFydDogMSwgZW5kOiAzIH1cbiAgICAgIHNwZWVkOiB7IHN0YXJ0OiAxLCBlbmQ6IDMgfVxuICAgIG91dHB1dHM6XG4gICAgICBzaGlwX21hc3M6ICh7c2NhbGUsIG1hc3MsIHNwZWVkfSkgLT4gc2NhbGUgKiBNYXRoLnBvdygxMDAsIG1hc3MpXG4gICAgICBzaGlwX3NwZWVkOiAoe3NjYWxlLCBtYXNzLCBzcGVlZH0pIC0+IHNjYWxlICogTWF0aC5wb3coMTAsIHNwZWVkKVxuICAgICAgc2hpcF9mb3JjZTogKHtzY2FsZSwgbWFzcywgc3BlZWR9KSAtPiBzY2FsZSAqIE1hdGgucG93KDEwMCwgbWFzcykgKiBzY2FsZSAqIE1hdGgucG93KDEwLCBzcGVlZClcbiAgICAgIHNoaXBfbWFzc19ncmFtczogKHtzY2FsZSwgbWFzcywgc3BlZWR9KSAtPiBzY2FsZSAqIE1hdGgucG93KDEwMCwgbWFzcykgKiAxMDAwXG4gICAgICBzaGlwX21hc3NfZGl2X3NwZWVkOiAoe3NjYWxlLCBtYXNzLCBzcGVlZH0pIC0+IHNjYWxlICogTWF0aC5wb3coMTAwLCBtYXNzKSAvIHNjYWxlICogTWF0aC5wb3coMTAsIHNwZWVkKVxuXG4gIGJhY2tncm91bmQ6ICdUaGlzIGV4ZXJjaXNlIGhhcyBtYW55IHBhcnRzLiBFYWNoIG9uZSBpcyBhIGRpZmZlcmVudCB0eXBlIG9mIHF1ZXN0aW9uLiBFaW5zdGVpbiBtYWtlcyBhIHt7IHNoaXBfbWFzcyB9fSBrZyBzcGFjZXNoaXAnXG4gIHBhcnRzOiBbXG4gICAge1xuICAgICAgYmFja2dyb3VuZDogJ1RoZSBzcGFjZXNoaXAgbW92ZXMgYXQge3sgc2hpcF9zcGVlZCB9fSBtL3MnXG4gICAgICBxdWVzdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0ZW06ICdXaGF0IGlzIHRoZSByZXN0IG1hc3M/IChTaG9ydCBhbnN3ZXIpJ1xuICAgICAgICAgIHNob3J0X3N0ZW06ICdFbnRlciB5b3VyIGFuc3dlciBpbiBrZydcbiAgICAgICAgICBhbnN3ZXJzOiBbXG4gICAgICAgICAgICB7IGNyZWRpdDogMSwgdmFsdWU6ICd7eyBzaGlwX21hc3MgfX0nIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHN0ZW06ICdXaGF0IGlzIHRoZSByZXN0IG1hc3M/J1xuICAgICAgICAgIHNob3J0X3N0ZW06ICdFbnRlciB5b3VyIGFuc3dlciBpbiBrZydcbiAgICAgICAgICBhbnN3ZXJzOiBbXG4gICAgICAgICAgICB7IGNyZWRpdDogMSwgdmFsdWU6ICd7eyBzaGlwX21hc3MgfX0nIH1cbiAgICAgICAgICAgIHsgY3JlZGl0OiAwLCB2YWx1ZTogJ3t7IHNoaXBfbWFzc19ncmFtcyB9fScsIGhpbnQ6ICdDaGVjayB0aGUgdW5pdHMnIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHN0ZW06ICdXaGF0IGlzIHRoZSBmb3JjZSBpZiBpdCBzbGFtcyBpbnRvIGEgd2FsbD8nXG4gICAgICAgICAgc2hvcnRfc3RlbTogJ0VudGVyIHlvdXIgYW5zd2VyIGluIE4nXG4gICAgICAgICAgYW5zd2VyczogW1xuICAgICAgICAgICAgeyBjcmVkaXQ6IDEsIHZhbHVlOiAne3sgc2hpcF9mb3JjZSB9fScsICAgICAgICAgIGNvbnRlbnQ6ICd7eyBzaGlwX2ZvcmNlIH19IE4nIH1cbiAgICAgICAgICAgIHsgY3JlZGl0OiAwLCB2YWx1ZTogJ3t7IHNoaXBfbWFzc19kaXZfc3BlZWQgfX0nLCBjb250ZW50OiAne3sgc2hpcF9tYXNzX2Rpdl9zcGVlZCB9fSBOJywgaGludDogJ1JlbWVtYmVyIDEgTmV3dG9uIChOKSBpcyAxIGtnKm0vcycgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgICAjIEZpbGwgaW4gdGhlIGJsYW5rc1xuICAgIHtcbiAgICAgIGJhY2tncm91bmQ6ICdTaW1wbGUgZmlsbC1pbi10aGUtYmxhbmsgcXVlc3Rpb25zJ1xuICAgICAgcXVlc3Rpb25zOiBbXG4gICAgICAgIHsgc3RlbTogJ1Bob3Rvc3ludGhlc2lzIF9fX18gQVRQJywgYW5zd2VyczogW3sgY3JlZGl0OiAxLCB2YWx1ZTogJ2NyZWF0ZXMnIH1dIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgYmFja2dyb3VuZDogJycnRmlsbCBpbiB0aGlzIHRhYmxlICh0aGlzIGlzIGEgbXVsdGktZmlsbC1pbi10aGUtYmxhbmspOlxuXG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dHI+PHRoPlRpbWU8L3RoPjx0aD5EaXN0YW5jZTwvdGg+PHRoPlZlbG9jaXR5PC90aD48L3RyPlxuICAgICAgICAgIDx0cj48dGQ+dDxzdWI+MDwvc3ViPjwvdGQ+PHRkPl9fX18xPC90ZD48dGQ+X19fXzI8L3RkPjwvdHI+XG4gICAgICAgICAgPHRyPjx0ZD50PHN1Yj4xPC9zdWI+PC90ZD48dGQ+X19fXzM8L3RkPjx0ZD5fX19fNDwvdGQ+PC90cj5cbiAgICAgICAgICA8dHI+PHRkPnQ8c3ViPjI8L3N1Yj48L3RkPjx0ZD5fX19fNTwvdGQ+PHRkPl9fX182PC90ZD48L3RyPlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgJycnXG4gICAgICBxdWVzdGlvbnM6IFtcbiAgICAgICAgeyBhbnN3ZXJzOiBbeyBjcmVkaXQ6IDEsIHZhbHVlOiAwIH1dIH1cbiAgICAgICAgeyBhbnN3ZXJzOiBbeyBjcmVkaXQ6IDEsIHZhbHVlOiAtMSwgY29udGVudDogJ3t7IHNoaXBfbWFzcyB9fScgfV0gfVxuICAgICAgICB7IGFuc3dlcnM6IFt7IGNyZWRpdDogMSwgdmFsdWU6ICd7eyBzaGlwX2ZvcmNlIH19JyB9XSB9XG4gICAgICAgIHsgYW5zd2VyczogW3sgY3JlZGl0OiAxLCB2YWx1ZTogMTAsIGNvbnRlbnQ6ICd7eyBzaGlwX3NwZWVkIH19JyB9XSB9XG4gICAgICAgIHsgYW5zd2VyczogW3sgY3JlZGl0OiAxLCB2YWx1ZTogMTAwLCBjb250ZW50OiAne3sgc2hpcF9mb3JjZSB9fScgfV0gfVxuICAgICAgICB7IGFuc3dlcnM6IFt7IGNyZWRpdDogMSwgdmFsdWU6IDEwMDAsIGNvbnRlbnQ6ICd7eyBzaGlwX21hc3NfZ3JhbXMgfX0nIH1dIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuQ29tcGlsZXIgICAgICA9IHJlcXVpcmVNb2R1bGUoJ2h0bWxiYXJzLWNvbXBpbGVyL2NvbXBpbGVyJylcbntET01IZWxwZXJ9ICAgPSByZXF1aXJlTW9kdWxlKCdtb3JwaCcpXG57aG9va3N9ICAgICAgID0gcmVxdWlyZU1vZHVsZSgnaHRtbGJhcnMtcnVudGltZScpXG5cblxucmFuZFJhbmdlID0gKG1pbiwgbWF4KSAtPlxuICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluXG5cbiMgR2VuZXJhdGUgdGhlIHZhcmlhYmxlc1xuc3RhdGUgPSB7fVxuZm9yIGtleSwgdmFsIG9mIGV4ZXJjaXNlLmxvZ2ljLmlucHV0c1xuICBzdGF0ZVtrZXldID0gcmFuZFJhbmdlKHZhbC5zdGFydCwgdmFsLmVuZClcblxuZm9yIGtleSwgdmFsIG9mIGV4ZXJjaXNlLmxvZ2ljLm91dHB1dHNcbiAgdmFsID0gdmFsKHN0YXRlKVxuICB0cnlcbiAgICB2YWwgPSBwYXJzZUludCh2YWwpXG4gICAgIyBJbmplY3QgY29tbWFzXG4gICAgdmFsID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKVxuICBjYXRjaFxuICAgICcnXG4gIHN0YXRlW2tleV0gPSB2YWxcblxuXG5cbmRvbWlmeSA9IChzb3VyY2UsIGRhdGEpIC0+XG4gIHRlbXBsYXRlICAgICA9IENvbXBpbGVyLmNvbXBpbGUoc291cmNlKVxuICBkb20gICAgICAgICAgPSB0ZW1wbGF0ZShkYXRhLCB7aG9va3M6IGhvb2tzLCBkb206IG5ldyBET01IZWxwZXIoKX0pXG4gIGRvbVxuXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgR2VuZXJhdGUgdGhlIEhUTUxcblxuIyBVbmVzY2FwZSBhIHN0cmluZyB3aXRoIGhhbmRsZWJhcnMgYHt7IC4uLiB9fWAgdGVtcGxhdGVzXG5tYWtlRGl2ID0gKG5hbWUsIHRleHQsIGNoaWxkcmVuPVtdKSAtPlxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9fX19fKFxcZCspPy9nLCAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpXG4gIFwiPGRpdiBjbGFzcz0nI3tuYW1lfSc+I3t0ZXh0fSN7Y2hpbGRyZW4uam9pbignJyl9PC9kaXY+XCJcblxubWFrZUlucHV0ID0gKG5hbWUsIHRleHQpIC0+XG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoL19fX18oXFxkKyk/L2csICc8aW5wdXQgdHlwZT1cInRleHRcIi8+JylcbiAgXCI8aW5wdXQgdHlwZT0ndGV4dCcgY2xhc3M9JyN7bmFtZX0nIHBsYWNlaG9sZGVyPVxcXCIje3RleHR9XFxcIi8+XCJcblxubmV4dElkID0gMFxubWFrZVJhZGlvRGl2ID0gKHF1ZXN0aW9uSWQsIG5hbWUsIHZhbHVlLCB0ZXh0KSAtPlxuICBpZCA9IFwiaWQtI3tuZXh0SWQrK31cIlxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9fX19fKFxcZCspPy9nLCAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpXG4gIFwiPGRpdiBjbGFzcz0nI3tuYW1lfSc+PGlucHV0IHR5cGU9J3JhZGlvJyBuYW1lPScje3F1ZXN0aW9uSWR9JyBpZD0nI3tpZH0nIHZhbHVlPScje3ZhbHVlfScvPiA8bGFiZWwgZm9yPScje2lkfSc+I3t0ZXh0fTwvbGFiZWw+PC9kaXY+XCJcblxuXG5cbnBhcnRzID0gZm9yIHBhcnQsIHBhcnRJbmRleCBpbiBleGVyY2lzZS5wYXJ0c1xuICBpZiBwYXJ0LmJhY2tncm91bmQgYW5kIHBhcnQuYmFja2dyb3VuZC5zcGxpdCgnX19fXycpLmxlbmd0aCA+IDIgYW5kIGNvbmZpZy5zaG9ydF9hbnN3ZXJcbiAgICBiYWNrZ3JvdW5kID0gcGFydC5iYWNrZ3JvdW5kXG4gICAga2VlcEJsYW5rSW5kZXggPSByYW5kUmFuZ2UoMCwgcGFydC5xdWVzdGlvbnMubGVuZ3RoIC0gMSlcbiAgICBmb3IgcXVlc3Rpb24sIGkgaW4gcGFydC5xdWVzdGlvbnNcbiAgICAgIGlmIGkgaXNudCBrZWVwQmxhbmtJbmRleFxuICAgICAgICBhbnN3ZXIgPSBxdWVzdGlvbi5hbnN3ZXJzWzBdLmNvbnRlbnQgb3IgcXVlc3Rpb24uYW5zd2Vyc1swXS52YWx1ZVxuICAgICAgICAjIGFuc3dlciA9IG1ha2VEaXYoJ2Fuc3dlcicsIGFuc3dlcilcbiAgICAgICAgYmFja2dyb3VuZCA9IGJhY2tncm91bmQucmVwbGFjZShcIl9fX18je2kgKyAxfVwiLCBhbnN3ZXIpXG5cbiAgICBtYWtlRGl2KCdwYXJ0JywgYmFja2dyb3VuZClcblxuICBlbHNlXG4gICAgcXVlc3Rpb25zID0gZm9yIHF1ZXN0aW9uLCBxdWVzdGlvbkluZGV4IGluIHBhcnQucXVlc3Rpb25zXG4gICAgICBpZiAvX19fXyhcXGQrKT8vLnRlc3QocXVlc3Rpb24uc3RlbSlcbiAgICAgICAgbWFrZURpdigncXVlc3Rpb24nLCBxdWVzdGlvbi5zdGVtKVxuXG4gICAgICBlbHNlIGlmIHF1ZXN0aW9uLmFuc3dlcnMubGVuZ3RoID4gMSBhbmQgbm90IGNvbmZpZy5zaG9ydF9hbnN3ZXJcbiAgICAgICAgIyBNdWx0aXBsZSBDaG9pY2VcbiAgICAgICAgY2hvaWNlcyA9IGZvciBhbnN3ZXIgaW4gcXVlc3Rpb24uYW5zd2Vyc1xuICAgICAgICAgIGlmIGFuc3dlci5jb250ZW50XG4gICAgICAgICAgICBtYWtlUmFkaW9EaXYoXCJpZC0je3BhcnRJbmRleH0tI3txdWVzdGlvbkluZGV4fVwiLCAnY2hvaWNlJywgYW5zd2VyLnZhbHVlLCBhbnN3ZXIuY29udGVudClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBtYWtlUmFkaW9EaXYoXCJpZC0je3BhcnRJbmRleH0tI3txdWVzdGlvbkluZGV4fVwiLCAnY2hvaWNlJywgYW5zd2VyLnZhbHVlLCBhbnN3ZXIudmFsdWUpXG4gICAgICAgIG1ha2VEaXYoJ3F1ZXN0aW9uJywgcXVlc3Rpb24uc3RlbSwgY2hvaWNlcylcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgcXVlc3Rpb24uc2hvcnRfc3RlbVxuICAgICAgICAgIGEgPSBtYWtlRGl2KCdxdWVzdGlvbicsIHF1ZXN0aW9uLnN0ZW0pXG4gICAgICAgICAgYiA9IG1ha2VJbnB1dCgncXVlc3Rpb24nLCBxdWVzdGlvbi5zaG9ydF9zdGVtKVxuICAgICAgICAgIFwiI3thfSN7Yn1cIlxuICAgICAgICBlbHNlIGlmIHF1ZXN0aW9uLnN0ZW1cbiAgICAgICAgICBhID0gbWFrZURpdigncXVlc3Rpb24nLCBxdWVzdGlvbi5zdGVtKVxuICAgICAgICAgIGIgPSBtYWtlSW5wdXQoJ3F1ZXN0aW9uJywgJycpXG4gICAgICAgICAgXCIje2F9I3tifVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAnJ1xuXG4gICAgbWFrZURpdigncGFydCcsIHBhcnQuYmFja2dyb3VuZCwgcXVlc3Rpb25zKVxuXG5cbiRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGVyY2lzZScpXG4kZXguaW5uZXJIVE1MID0gJydcbiRleC5hcHBlbmRDaGlsZChkb21pZnkgbWFrZURpdignYmFja2dyb3VuZCcsIGV4ZXJjaXNlLmJhY2tncm91bmQsIHBhcnRzKSwgc3RhdGUpXG4iXX0=
(1)
});
