(function() {
  "use strict";

  var root = this;

  var previousChatops = root.$$;

  // 未来考虑改成构造函数
  var $$ = new Object();

  root.$$ = root.Chatops = $$;

  // Current version
  $$.VERSION = '0.0.9';

  $$.Origin = (function() {

    var URL = '*';
    var URL_REGEXP = /^((http|https):\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    var getUrl = function() {
      return URL;
    }

    var setUrl = function(url) {
      if (URL_REGEXP.test(url)) {
        URL = url;
      } else {
        throw new Error(url + 'is not the right url.')
      }
    }

    return {
      get: getUrl,
      set: setUrl
    }
  })();

  $$.postMessage = {

    send: function(originData, originUrl) {
      var data = originData || '';
      var url = originUrl || $$.Origin.get();
      root.parent.postMessage(data, url);
    }
  }

  $$.dialog = {

    type: 'dialog',

    open: function(key, url) {
      $$.postMessage.send({
        key: key || '',
        type: this.type,
        show: true
      });
    },

    close: function(key) {
      $$.postMessage.send({
        key: key || '',
        type: this.type,
        show: false
      });
    }
  }

  $$.noConflict = function() {
    root.$$ = previousChatops;
    return this;
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('Chatops', [], function() {
      return $$;
    });
  }
}.call(this));
