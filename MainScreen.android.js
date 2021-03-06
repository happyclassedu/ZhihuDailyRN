'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  DrawerLayoutAndroid,
  ToolbarAndroid,
} from 'react-native';

import DrawerMenu from './DrawerMenu';
import DataRepository from './DataRepository';

var data_repository = new DataRepository();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  toolbar: {
    backgroundColor: '#00a2ed',
    height: 56,
  }
});

var DRAWER_REF = 'drawer';
var DRAWER_WIDTH = Dimensions.get('window').width - 60;

export default class MainScreen extends Component {
    static propTypes = {
    };

    constructor(props){
        super(props);
        this.state = {
            toolbarTitle: '首页',
            theme: null,
            actions: [],
            updateThemeList: new Date(),
        };
    }

    _unSubscribeTheme = () => {
      data_repository.unSubscribeTheme(this.state.theme.id).then(() => {
        this.state.theme.subscribed = false;
        this.setState({theme: this.state.theme, updateThemeList:new Date()});
      }).done();
    }

    _subscribeTheme = () => {
      data_repository.subscribeTheme(this.state.theme.id).then(() => {
        this.state.theme.subscribed = true;
        this.setState({theme: this.state.theme, updateThemeList:new Date()});
      }).done();
    }

    _genToolbarActions = () => {
      var actions = [];
      var toolbar_actions = [
        {title: '提醒', icon: require('./images/ic_message_white.png'), show: 'always', func: function(){}},
        {title: '夜间模式', show: 'never', func: function(){}},
        {title: '设置选项', show: 'never', func: function(){}},
      ];
      var toolbar_actions_follow = [
        {title: '添加收藏', icon: require('./images/ic_theme_add.png'), show: 'always', func: this._subscribeTheme},
      ];
      var toolbar_actions_del = [
        {title: '删除收藏', icon: require('./images/ic_theme_remove.png'), show: 'always', func: this._unSubscribeTheme},
      ];
      if(!this.state.theme) {
        actions = toolbar_actions;
      } else {
        actions = this.state.theme.subscribed ? toolbar_actions_del : toolbar_actions_follow;
      }
      this.state.actions = actions;
      return actions;
    }

    _renderDrawerView = () => {
      return (
        <DrawerMenu
          onThemeSelected={this._onThemeSelected}
          updateThemeList={this.state.updateThemeList}
        />
      );
    }

    _showDrawer = () => {
      this.refs[DRAWER_REF].openDrawer();
    }

    _onActionSelected = (actionOffset) => {
      // TODO
      this.state.actions[actionOffset].func();
    }

    _onThemeSelected = (theme) => {
      // TODO
      this.refs[DRAWER_REF].closeDrawer();
      this.setState({theme: theme});
    }

    render() {
        return (
          <DrawerLayoutAndroid
            ref = {DRAWER_REF}
            drawerWidth = {DRAWER_WIDTH}
            keyboardDismissMode = 'on-drag'
            drawerPosition = {DrawerLayoutAndroid.positions.Left}
            renderNavigationView = {this._renderDrawerView}
          >
            <ToolbarAndroid
              navIcon = {require('./images/ic_menu_white.png')}
              style = {styles.toolbar}
              onIconClicked = {this._showDrawer}
              title = {this.state.theme ? this.state.theme.name : this.state.toolbarTitle}
              titleColor = 'white'
              actions = {this._genToolbarActions()}
              overflowIcon = {require('./images/ic_menu_moreoverflow.png')}
              onActionSelected={this._onActionSelected}
            />
            <View style={styles.container}>
              <Text style={styles.welcome}>
                Welcome to MainScreen!
              </Text>
              <Text style={styles.instructions}>
                This is MainScreen.
              </Text>
            </View>
          </DrawerLayoutAndroid>
        );
    }
}


