import React from "react";
import ReactDom from "react-dom";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import {
    HashRouter as Router,
    Route,
    Link
} from "react-router-dom";

import "./index.less";

import { ajv, schemaFormOptions } from "./init";
import { reducer as arrayReducer, ArraySchemaFormComponent } from "./array";
import { reducer as normalReducer, NormalSchemaFormComponent } from "./normal";
import { reducer as objectReducer, ObjectSchemaFormComponent } from "./object";
import { reducer as cushocReducer, CustomHocSchemaFormComponent } from "./custom.hoc";

import { Menu, Icon } from "antd";

let store = createStore<any>(combineReducers({
    "array": arrayReducer.reducer,
    "normal": normalReducer.reducer,
    "object": objectReducer.reducer,
    "custom.hoc": cushocReducer.reducer
}));

store.subscribe(() => {
    console.log(store.getState());
});

ReactDom.render(
    <Provider store={store}>
        <Router>
            <div>
                <Menu mode="horizontal" theme="dark">
                    <Menu.Item key="home">
                        <Link to="/"><Icon type="mail" />主页</Link>
                    </Menu.Item>
                    <Menu.Item key="array">
                        <Link to="/array"><Icon type="mail" />无限极数组</Link>
                    </Menu.Item>
                    <Menu.Item key="object">
                        <Link to="/object"><Icon type="mail" />对象类型</Link>
                    </Menu.Item>
                    <Menu.Item key="custom.hoc">
                        <Link to="/custom.hoc"><Icon type="mail" />自定义HOC</Link>
                    </Menu.Item>
                </Menu>

                <Route exact path="/" component={NormalSchemaFormComponent} />
                <Route path="/array" component={ArraySchemaFormComponent} />
                <Route path="/object" component={ObjectSchemaFormComponent} />
                <Route path="/custom.hoc" component={CustomHocSchemaFormComponent} />
            </div>
        </Router>
    </Provider>
    , document.getElementById("root"), console.log);
