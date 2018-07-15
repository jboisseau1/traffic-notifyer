var PushBullet = (function() {
  var pb = {};
  var pbURL = 'https://api.pushbullet.com/v2/';
  var pbPush = pbURL + 'pushes';
  var pbContact = pbURL + 'contacts';
  var pbDevice = pbURL + 'devices';
  var pbUser = pbURL + 'users/me';
  var pbUpReq = pbURL + 'upload-request';
  var httpReqDone = 4;
  var httpResGood = 200;
  var httpResNoCont = 204;
  var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

  pb.APIKey = process.env.PUSHBULLET_API_KEY;

  pb.push = function(pushType, devId, email, data, callback) {
    var parameters = { type: pushType.toLowerCase() };
    if (email && devId) {
      var err = new Error('Cannot push to both device and contact');
      if (callback) {
        return callback(err);
      } else {
        throw err;
      }
    } else if (email) {
      parameters.email = email;
    } else if (devId) {
      parameters.device_iden = devId;
    }
    switch (pushType.toLowerCase()) {
      case 'note':
        parameters.title = data.title;
        parameters.body = data.body;
        break;
      case 'link':
        parameters.title = data.title;
        parameters.url = data.url;
        if (data.body) {
          parameters.body = data.body;
        }
        break;
      case 'address':
        parameters.name = data.name;
        parameters.address = data.address;
        break;
      case 'list':
        parameters.title = data.title;
        parameters.items = data.items;
        break;
      default:
        var err = new Error('Invalid type');
        if (callback) {
          return callback(err);
        } else {
          throw err;
        }
        break;
    }
    var res = ajaxReq(pbPush, 'POST', parameters, false, callback);
    if (!callback) {
      return res;
    }
  };

  var ajaxReq = function(url, verb, parameters, fileUpload, callback) {
    if (!pb.APIKey) {
      var err = new Error('API Key for Pushbullet not set');
      if (callback) {
        return callback(err);
      } else {
        throw err;
      }
    } else {
      var ajax = new XMLHttpRequest();
      var async = false;
      if (callback) {
        async = true;
        ajax.onreadystatechange = function() {
          if (ajax.readyState === httpReqDone) {
            var res = null;
            try {
              res = handleResponse(ajax);
            } catch (err) {
              return callback(err);
            }
            return callback(null, res);
          }
        };
      }
      if (verb === 'GET') {
        var queryParams = [];
        for (var key in parameters) {
          queryParams.push(key + '=' + parameters[key]);
        }
        var queryString = queryParams.join('&');
        url += '?' + queryString;
        parameters = null;
      }
      ajax.open(verb, url, async);
      if (!fileUpload) {
        ajax.setRequestHeader('Access-Token', pb.APIKey);
        ajax.setRequestHeader('Content-Type', 'application/json');
        parameters = JSON.stringify(parameters);
      }
      if (parameters) {
        ajax.send(parameters);
      } else {
        ajax.send();
      }

      if (!async) {
        return handleResponse(ajax);
      }
    }
  };

  var handleResponse = function(ajax) {
    if (ajax.status !== httpResGood && ajax.status !== httpResNoCont) {
      throw new Error(ajax.status + ': ' + ajax.response);
    }
    try {
      return JSON.parse(ajax.response);
    } catch (err) {
      return ajax.response;
    }
  };

  return pb;
})();
module.exports = { PushBullet };
