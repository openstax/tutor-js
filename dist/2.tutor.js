webpackJsonp([2],{

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	var QABook, QADashboard;
	
	QADashboard = __webpack_require__(261);
	
	QABook = __webpack_require__(581);
	
	module.exports = {
	  QADashboard: QADashboard,
	  QABook: QABook
	};


/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	var BindStore, BookLink, EcosystemsActions, EcosystemsStore, LoadableItem, QADashboard, React, RouteHandler, ref;
	
	React = __webpack_require__(262);
	
	RouteHandler = __webpack_require__(413).RouteHandler;
	
	ref = __webpack_require__(452), EcosystemsStore = ref.EcosystemsStore, EcosystemsActions = ref.EcosystemsActions;
	
	LoadableItem = __webpack_require__(459);
	
	BindStore = __webpack_require__(530);
	
	BookLink = __webpack_require__(580);
	
	QADashboard = React.createClass({displayName: "QADashboard",
	  mixins: [BindStore],
	  bindStore: EcosystemsStore,
	  bindEvent: 'loaded',
	  componentWillMount: function() {
	    if (!EcosystemsStore.isLoading()) {
	      return EcosystemsActions.load();
	    }
	  },
	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  render: function() {
	    var params;
	    if (EcosystemsStore.isLoaded()) {
	      params = _.clone(this.context.router.getCurrentParams());
	      if (params.ecosystemId == null) {
	        params.ecosystemId = "" + (EcosystemsStore.first().id);
	      }
	      return React.createElement(RouteHandler, React.__spread({}, params));
	    } else {
	      return React.createElement("h3", null, "Loading ...");
	    }
	  }
	});
	
	module.exports = QADashboard;


/***/ },

/***/ 580:
/***/ function(module, exports, __webpack_require__) {

	var BookLink, React, Router;
	
	React = __webpack_require__(262);
	
	Router = __webpack_require__(413);
	
	BookLink = React.createClass({displayName: "BookLink",
	  propTypes: {
	    book: React.PropTypes.shape({
	      ecosystemId: React.PropTypes.string,
	      ecosystemComments: React.PropTypes.string,
	      id: React.PropTypes.number,
	      title: React.PropTypes.string,
	      uuid: React.PropTypes.string,
	      version: React.PropTypes.string
	    }).isRequired
	  },
	  render: function() {
	    return React.createElement(Router.Link, {
	      "to": 'QAViewBook',
	      "className": "book",
	      "params": {
	        ecosystemId: this.props.book.ecosystemId
	      }
	    }, React.createElement("div", {
	      "className": "title-version"
	    }, React.createElement("span", null, this.props.book.title), React.createElement("span", null, this.props.book.version)), React.createElement("span", {
	      "className": "comments"
	    }, this.props.book.ecosystemComments));
	  }
	});
	
	module.exports = BookLink;


/***/ },

/***/ 581:
/***/ function(module, exports, __webpack_require__) {

	var BS, BookLink, EcosystemsStore, LoadableItem, QAContent, QAContentToggle, QAExercises, QAViewBook, React, ReferenceBook, ReferenceBookActions, ReferenceBookStore, SpyMode, TeacherContentToggle, UserActionsMenu, classnames, ref;
	
	React = __webpack_require__(262);
	
	classnames = __webpack_require__(464);
	
	BS = __webpack_require__(461);
	
	SpyMode = __webpack_require__(531).SpyMode;
	
	EcosystemsStore = __webpack_require__(452).EcosystemsStore;
	
	ref = __webpack_require__(582), ReferenceBookActions = ref.ReferenceBookActions, ReferenceBookStore = ref.ReferenceBookStore;
	
	ReferenceBook = __webpack_require__(584);
	
	TeacherContentToggle = __webpack_require__(880);
	
	LoadableItem = __webpack_require__(459);
	
	QAContent = __webpack_require__(881);
	
	QAExercises = __webpack_require__(882);
	
	BookLink = __webpack_require__(580);
	
	QAContentToggle = __webpack_require__(888);
	
	UserActionsMenu = __webpack_require__(771);
	
	QAViewBook = React.createClass({displayName: "QAViewBook",
	  propTypes: {
	    section: React.PropTypes.string,
	    ecosystemId: React.PropTypes.string.isRequired
	  },
	  getInitialState: function() {
	    return {
	      isShowingTeacherContent: true,
	      isShowingBook: false
	    };
	  },
	  renderNavbarControls: function() {
	    var book, teacherContent;
	    if (this.state.isShowingBook) {
	      teacherContent = React.createElement(TeacherContentToggle, {
	        "isShowing": this.state.isShowingTeacherContent,
	        "onChange": this.setTeacherContent
	      });
	    }
	    return React.createElement(BS.Nav, {
	      "navbar": true,
	      "right": true
	    }, React.createElement(BS.NavItem, null, teacherContent, React.createElement(QAContentToggle, {
	      "isShowingBook": this.state.isShowingBook,
	      "onChange": this.setContentShowing
	    })), React.createElement(BS.DropdownButton, {
	      "title": "Available Books",
	      "className": "available-books"
	    }, (function() {
	      var i, len, ref1, results;
	      ref1 = EcosystemsStore.allBooks();
	      results = [];
	      for (i = 0, len = ref1.length; i < len; i++) {
	        book = ref1[i];
	        results.push(React.createElement("li", {
	          "key": book.id,
	          "className": (this.props.ecosystemId === book.ecosystemId ? 'active' : void 0)
	        }, React.createElement(BookLink, {
	          "book": book
	        })));
	      }
	      return results;
	    }).call(this)), React.createElement(UserActionsMenu, null));
	  },
	  setContentShowing: function(visible) {
	    return this.setState({
	      isShowingBook: visible.book
	    });
	  },
	  setTeacherContent: function(isShowing) {
	    return this.setState({
	      isShowingTeacherContent: isShowing
	    });
	  },
	  renderBook: function() {
	    var contentComponent, section;
	    section = this.props.section || ReferenceBookStore.getFirstSection(this.props.ecosystemId).join('.');
	    contentComponent = this.state.isShowingBook ? QAContent : QAExercises;
	    return React.createElement(SpyMode.Wrapper, null, React.createElement("div", {
	      "className": "qa"
	    }, React.createElement(ReferenceBook, {
	      "pageNavRouterLinkTarget": 'QAViewBookSection',
	      "menuRouterLinkTarget": 'QAViewBookSection',
	      "navbarControls": this.renderNavbarControls(),
	      "section": section,
	      "className": classnames('is-teacher'),
	      "className": classnames({
	        'is-teacher': this.state.isShowingTeacherContent
	      }),
	      "ecosystemId": this.props.ecosystemId,
	      "contentComponent": contentComponent
	    })));
	  },
	  render: function() {
	    return React.createElement(LoadableItem, {
	      "id": this.props.ecosystemId,
	      "store": ReferenceBookStore,
	      "actions": ReferenceBookActions,
	      "renderItem": this.renderBook
	    });
	  }
	});
	
	module.exports = QAViewBook;


/***/ },

/***/ 881:
/***/ function(module, exports, __webpack_require__) {

	var QAContent, React, ReferenceBookPage;
	
	React = __webpack_require__(262);
	
	ReferenceBookPage = __webpack_require__(650);
	
	QAContent = React.createClass({displayName: "QAContent",
	  propTypes: {
	    cnxId: React.PropTypes.string.isRequired
	  },
	  render: function() {
	    return React.createElement("div", null, React.createElement(ReferenceBookPage, {
	      "cnxId": this.props.cnxId
	    }));
	  }
	});
	
	module.exports = QAContent;


/***/ },

/***/ 882:
/***/ function(module, exports, __webpack_require__) {

	var BS, BindStoreMixin, EcosystemsStore, ExerciseActions, ExerciseCard, ExerciseStore, MultiSelect, QAExercises, React, ReferenceBookStore, SpyMode, String, _, classnames, ref;
	
	_ = __webpack_require__(453);
	
	BS = __webpack_require__(461);
	
	React = __webpack_require__(262);
	
	classnames = __webpack_require__(464);
	
	SpyMode = __webpack_require__(531).SpyMode;
	
	ReferenceBookStore = __webpack_require__(582).ReferenceBookStore;
	
	ref = __webpack_require__(883), ExerciseStore = ref.ExerciseStore, ExerciseActions = ref.ExerciseActions;
	
	EcosystemsStore = __webpack_require__(452).EcosystemsStore;
	
	String = __webpack_require__(653);
	
	BindStoreMixin = __webpack_require__(530);
	
	ExerciseCard = __webpack_require__(885);
	
	MultiSelect = __webpack_require__(887);
	
	QAExercises = React.createClass({displayName: "QAExercises",
	  propTypes: {
	    cnxId: React.PropTypes.string.isRequired,
	    ecosystemId: React.PropTypes.string.isRequired,
	    section: React.PropTypes.string.isRequired
	  },
	  getInitialState: function() {
	    return {
	      pageId: 0,
	      ignored: {}
	    };
	  },
	  mixins: [BindStoreMixin],
	  bindStore: ExerciseStore,
	  componentWillMount: function() {
	    return this.loadPage(this.props);
	  },
	  componentWillReceiveProps: function(nextProps) {
	    if (nextProps.cnxId !== this.props.cnxId) {
	      return this.loadPage(nextProps);
	    }
	  },
	  loadPage: function(props) {
	    var page;
	    page = ReferenceBookStore.getPageInfo(props);
	    this.setState({
	      pageId: page.id
	    });
	    if (page && !ExerciseStore.isLoaded([page.id])) {
	      return ExerciseActions.load(this.props.ecosystemId, [page.id], '');
	    }
	  },
	  renderSpyInfo: function() {
	    var book;
	    book = EcosystemsStore.getBook(this.props.ecosystemId);
	    return React.createElement(SpyMode.Content, {
	      "className": "ecosystem-info"
	    }, "Page: ", this.props.cnxId, " :: Book: ", book.uuid, "@", book.version);
	  },
	  onSelectPoolType: function(selection) {
	    var ignored;
	    ignored = _.clone(this.state.ignored);
	    ignored[selection.id] = !ignored[selection.id];
	    return this.setState({
	      ignored: ignored
	    });
	  },
	  on2StepPreviewChange: function(ev) {
	    return this.setState({
	      isShowing2StepPreview: ev.target.checked
	    });
	  },
	  renderExerciseContent: function(exercises) {
	    var classNames, selections;
	    exercises = _.map(exercises, (function(_this) {
	      return function(exercise) {
	        var hideAnswers;
	        hideAnswers = _this.state.isShowing2StepPreview && ExerciseStore.hasQuestionWithFormat('free-response', {
	          exercise: exercise
	        });
	        return React.createElement(ExerciseCard, {
	          "key": exercise.id,
	          "exercise": exercise,
	          "hideAnswers": hideAnswers,
	          "ignoredPoolTypes": _this.state.ignored
	        });
	      };
	    })(this));
	    selections = _.map(ExerciseStore.getPagePoolTypes(this.state.pageId), (function(_this) {
	      return function(pt) {
	        return {
	          id: pt,
	          title: String.titleize(pt),
	          selected: !_this.state.ignored[pt]
	        };
	      };
	    })(this));
	    classNames = classnames("exercises", {
	      'show-2step': this.state.isShowing2StepPreview
	    });
	    return React.createElement("div", {
	      "className": classNames
	    }, React.createElement("div", {
	      "className": "heading"
	    }, React.createElement("label", null, "Show 2-Step Preview", React.createElement("input", {
	      "type": 'checkbox',
	      "className": 'preview2step',
	      "checked": this.state.isShowing2StepPreview,
	      "onChange": this.on2StepPreviewChange
	    })), React.createElement(MultiSelect, {
	      "title": 'Exercise Types',
	      "selections": selections,
	      "onSelect": this.onSelectPoolType
	    })), exercises);
	  },
	  render: function() {
	    var content, exercises;
	    content = ExerciseStore.isLoaded([this.state.pageId]) ? (exercises = ExerciseStore.allForPage(this.state.pageId), _.isEmpty(exercises) ? React.createElement("h3", null, "No exercises found for section ", this.props.section) : this.renderExerciseContent(exercises)) : React.createElement("h3", null, "Loading...");
	    return React.createElement("div", {
	      "className": "page-wrapper"
	    }, React.createElement("div", {
	      "className": "exercises center-panel"
	    }, content, (this.state.pageId ? this.renderSpyInfo() : void 0)));
	  }
	});
	
	module.exports = QAExercises;


/***/ },

/***/ 885:
/***/ function(module, exports, __webpack_require__) {

	var Exercise, ExerciseCard, ExerciseStore, React, String, _, classnames;
	
	_ = __webpack_require__(453);
	
	React = __webpack_require__(262);
	
	classnames = __webpack_require__(464);
	
	ExerciseStore = __webpack_require__(883).ExerciseStore;
	
	String = __webpack_require__(653);
	
	ExerciseCard = __webpack_require__(886);
	
	Exercise = React.createClass({displayName: "Exercise",
	  propTypes: {
	    exercise: React.PropTypes.object.isRequired,
	    ignoredPoolTypes: React.PropTypes.object.isRequired
	  },
	  renderHeader: function() {
	    var className, pool;
	    return React.createElement("div", {
	      "className": 'pools'
	    }, (function() {
	      var i, len, ref, results;
	      ref = ExerciseStore.poolTypes(this.props.exercise);
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        pool = ref[i];
	        className = classnames(pool, {
	          'is-ignored': this.props.ignoredPoolTypes[pool]
	        });
	        results.push(React.createElement("span", {
	          "key": pool,
	          "className": className
	        }, String.titleize(pool)));
	      }
	      return results;
	    }).call(this));
	  },
	  render: function() {
	    var editUrl;
	    if (_.every(ExerciseStore.poolTypes(this.props.exercise), (function(_this) {
	      return function(pt) {
	        return _this.props.ignoredPoolTypes[pt];
	      };
	    })(this))) {
	      return null;
	    }
	    editUrl = this.props.exercise.url.replace(/@\d+/, '@draft');
	    return React.createElement(ExerciseCard, React.__spread({}, this.props, {
	      "header": this.renderHeader(),
	      "displayAllTags": true,
	      "displayFeedback": true
	    }), React.createElement("a", {
	      "target": "_blank",
	      "className": "edit-link",
	      "href": editUrl
	    }, "edit"));
	  }
	});
	
	module.exports = Exercise;


/***/ },

/***/ 887:
/***/ function(module, exports, __webpack_require__) {

	var BS, Icon, MultiSelect, React, classnames;
	
	React = __webpack_require__(262);
	
	BS = __webpack_require__(461);
	
	classnames = __webpack_require__(464);
	
	Icon = __webpack_require__(779);
	
	MultiSelect = React.createClass({displayName: "MultiSelect",
	  propTypes: {
	    title: React.PropTypes.string.isRequired,
	    className: React.PropTypes.string,
	    selections: React.PropTypes.arrayOf(React.PropTypes.shape({
	      id: React.PropTypes.string,
	      title: React.PropTypes.string,
	      selected: React.PropTypes.bool
	    })).isRequired,
	    onSelect: React.PropTypes.func
	  },
	  onSelect: function(selection) {
	    var base;
	    return typeof (base = this.props).onSelect === "function" ? base.onSelect(_.findWhere(this.props.selections, {
	      id: selection
	    })) : void 0;
	  },
	  renderMenuSelection: function(selection) {
	    return React.createElement(BS.MenuItem, {
	      "key": selection.id,
	      "eventKey": selection.id
	    }, React.createElement(Icon, {
	      "type": (selection.selected ? 'check-square-o' : 'square-o')
	    }), selection.title);
	  },
	  render: function() {
	    var classNames, selection;
	    classNames = classnames('multi-select', this.props.className);
	    return React.createElement(BS.DropdownButton, {
	      "navItem": this.props.navItem,
	      "className": classNames,
	      "onSelect": this.onSelect,
	      "title": this.props.title
	    }, (function() {
	      var i, len, ref, results;
	      ref = this.props.selections;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        selection = ref[i];
	        results.push(this.renderMenuSelection(selection));
	      }
	      return results;
	    }).call(this));
	  }
	});
	
	module.exports = MultiSelect;


/***/ },

/***/ 888:
/***/ function(module, exports, __webpack_require__) {

	var BS, QAContentToggle, React;
	
	React = __webpack_require__(262);
	
	BS = __webpack_require__(461);
	
	QAContentToggle = React.createClass({displayName: "QAContentToggle",
	  propTypes: {
	    onChange: React.PropTypes.func.isRequired,
	    isShowingBook: React.PropTypes.bool.isRequired
	  },
	  onClick: function() {
	    return this.props.onChange({
	      book: !this.props.isShowingBook,
	      exercises: this.props.isShowingBook
	    });
	  },
	  render: function() {
	    var text;
	    text = this.props.isShowingBook ? 'Show Exercises' : 'Show Content';
	    return React.createElement(BS.NavItem, {
	      "className": 'teacher-edition',
	      "onClick": this.onClick
	    }, text);
	  }
	});
	
	module.exports = QAContentToggle;


/***/ }

});
//# sourceMappingURL=2.tutor.js.map