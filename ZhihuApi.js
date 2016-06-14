'use strict';

var React = require('react-native');

var {
  AsyncStorage,
} = React;

var API_URL_START_IMAGE = 'http://news-at.zhihu.com/api/4/start-image/1080*1776';

var KEY_START_IMAGE = '@START_IMAGE';

var ZhihuApi = function () {
  if(typeof ZhihuApi.instance !== 'object') {
    ZhihuApi.instance = this;
  }
  return ZhihuApi.instance;
};

ZhihuApi.prototype._getItem = function (key: string) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key, (error, result) => {
      var data = null;
      if(!result) {
        return resolve(null);
      }
      if(error) {
        return reject(error);
      }
      try {
        data = JSON.parse(result);
      } catch(e) {
        return reject(e);
      }
      return resolve(data);
    });
  });
};

ZhihuApi.prototype.getStartImage = function() {
  return this._getItem(KEY_START_IMAGE);
};

ZhihuApi.prototype.updateStartImage = function() {
  fetch(API_URL_START_IMAGE)
    .then((response) => response.json())
    .then((responseData) => {
      AsyncStorage.setItem(KEY_START_IMAGE, JSON.stringify(responseData));
    })
    .catch((error) => {
      console.error(error);
    })
    .done();
};


module.exports = ZhihuApi;


