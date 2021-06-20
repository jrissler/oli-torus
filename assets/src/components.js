"use strict";
exports.__esModule = true;
exports.registry = void 0;
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var tsmonad_1 = require("tsmonad");
var Editor_1 = require("components/editing/editor/Editor");
var store_1 = require("state/store");
var ResourceEditor_1 = require("components/resource/resourceEditor/ResourceEditor");
var ActivityEditor_1 = require("components/activity/ActivityEditor");
var CreateAccountPopup_1 = require("components/messages/CreateAccountPopup");
exports.registry = {
    Editor: Editor_1.Editor,
    ResourceEditor: ResourceEditor_1["default"],
    ActivityEditor: ActivityEditor_1.ActivityEditor,
    CreateAccountPopup: CreateAccountPopup_1.CreateAccountPopup
};
var store = store_1.configureStore();
// Expose React/Redux APIs to server-side rendered templates
window.component = {
    mount: function (componentName, element, context) {
        if (context === void 0) { context = {}; }
        tsmonad_1.maybe(exports.registry[componentName]).lift(function (Component) {
            ReactDOM.render(<react_redux_1.Provider store={store}>
          <Component {...context}/>
        </react_redux_1.Provider>, element);
        });
    }
};
// Expose other libraries to server-side rendered templates
window.Maybe = tsmonad_1.Maybe;
