CoreREST = {
    //_defaultServer: "http://hdtest-c3.hidoctor.me/",
    //_defaultServer: "http://hdsurveyapi.kangle.me/",

    _defaultServer: "https://hdwebapi.hidoctor.me/",
    //_defaultServer: "https://dev-webapi-ios.hidoctor.me",
    accessKey: "dummy",

    _addContext: function (url, context) {
        if (context != null && context.length > 0) {
            for (var i = 0; i < context.length; i++) {
                url += context[i] + '/';
            }
        }
        return url;
    },

    _raw: function (url, requestType, context, data, success, failure) {
        debugger;
        //TODO $.mobile.allowCrossDomainPages = true; un - comment code
        //$.support.cors = true;
        url = this._addContext(url, context);
        url = url.substring(0, url.length - 1);
        if (data == null) {
            data = {};
        }
        data.accessKey = this.accessKey;
        $.ajax({
            url: url,
            type: requestType,
            data: data,
            dataType: "json",
            async: true,
            crossDomain: true,
            success: function (response) {
                debugger;
                success(response);

            },
            error: function (a, b, c) {
                console.log(JSON.stringify(a) + " - " + JSON.stringify(b) + " - " + JSON.stringify(c));
                failure(a);
            }
        });
    },
    _rawsync: function (url, requestType, context, data, success, failure) {
        debugger;
        //TODO $.mobile.allowCrossDomainPages = true; un - comment code
        //$.support.cors = true;
        url = this._addContext(url, context);
        url = url.substring(0, url.length - 1);
        if (data == null) {
            data = {};
        }
        data.accessKey = this.accessKey;
        $.ajax({
            url: url,
            type: requestType,
            data: data,
            dataType: "json",
            async: false,
            crossDomain: true,
            success: function (response) {
                debugger;
                success(response);

            },
            error: function (a, b, c) {
                console.log(JSON.stringify(a) + " - " + JSON.stringify(b) + " - " + JSON.stringify(c));
                failure(a);
            }
        });
    },
    _rawPostFile: function (url, requestType, context, data, success, failure) {
        $.support.cors = true;
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            contentType: false,
            processData: false,
            dataType: 'json',
            data: data,
            async: true,
            cache: false,
            success: function (response) {
                success(response);
            },
            error: function (a, b, c) {
                if (failure) failure(angel);
            }
        });
    },
    post: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },
    postFile: function (restClass, context, data, success, failure) {
        this._rawPostFile(this._defaultServer, 'POST', context, data, success, failure);
    },
    put: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },

    remove: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'DELETE', context, data, success, failure);
    },

    get: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'GET', context, data, success, failure);
    },
    getsync: function (restClass, context, data, success, failure) {
        this._rawsync(this._defaultServer, 'GET', context, data, success, failure);
    }

};

ErrorLogCoreRest = {
    defaultServer: "https://hdlog.hidoctor.me/",
    //defaultServer: "http://localhost:5000/",// /api/HDLogServices
    _addContext: function (url, context) {
        if (context != null && context.length > 0) {
            for (var i = 0; i < context.length; i++) {
                url += context[i] + '/';
            }
        }
        return url;
    },
    _raw: function (url, requestType, context, data, success, failure) {
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            async: true,

            success: function (response) {
                success(response);
            },
            error: function (ex) {
                console.log();
            }
        });
    },
    post: function (context, data, success, failure) {
        this._raw(this.defaultServer, 'POST', context, data, success, failure);
    }
}
//var apiSn = "http://localhost:14829/";
//var apiSn="http://192.168.0.114:1414/";
//var apiSn = "http://124.153.111.201:1313
//var apiSn = "https://hdreportsdevapi.hidoctor.me/"
var apiSn = "https://hdreportsprodapi.hidoctor.me/";
//var apiSn = "http://hdreportsqaqpi.hidoctor.me:1313/";
var HDWebApiAjax = {
    requestInvoke: function (ctn, actn, parms, method, successcallback, failurecallback, successCallbackExtraparams, type) {
        var datapara = "";
        if (parms != null) {
            for (var j = 0; j < parms.length; j++) {
                var value = parms[j].value;
                if (parms[j].type == "JSON") {
                    value = JSON.stringify(value);
                }

                if (j == 0) {
                    datapara = parms[j].name + "=" + value;
                }
                else {
                    datapara += "&" + parms[j].name + "=" + value;
                }
            }
        }
        var aurl = apiSn + ctn + "/" + actn;

        var start_time = new Date().getTime();
        if (type == "JSON") {
            $.ajax({
                type: method,
                url: aurl,
                data: parms[0].value,
                dataType: 'json',
                //async: false,
                cache: false,
                success: function (response) {
                    var request_time = new Date().getTime() - start_time;
                    $("#servertimer").html(request_time);
                    successcallback(response, successCallbackExtraparams);
                },
                complete: function (e, t, n) {

                    //$("#spnintimate").html("Binding");
                },
                error: function (e) {
                    failurecallback(e);
                }
            });
        }
        else {
            $.ajax({
                type: method,
                url: aurl,
                data: datapara,

                //async: false,
                cache: false,
                success: function (response) {
                    var request_time = new Date().getTime() - start_time;
                    $("#servertimer").html(request_time);
                    successcallback(response, successCallbackExtraparams);
                },
                complete: function (e, t, n) {

                },
                error: function (e) {
                    failurecallback(e);
                }
            });
        }
    }
}
var AjaxGlobalHandler = { Initiate: function (e) { $.ajaxSetup({ cache: false }); $(document).ajaxStart(function () { }).ajaxSend(function (e, t, n) { }).ajaxError(function (e, t, n) { if ("590" == t.status) { window.location.href = "../../Home/SessionExpiry/"; return } }).ajaxSuccess(function (e, t, n) { }).ajaxComplete(function (e, t, n) { }).ajaxStop(function () { }) } }





var Ajax = {
    requestInvoke: function (ctn, actn, parms, method, successcallback, failurecallback, successCallbackExtraparams, type) {
        var datapara = "";
        if (parms != null) {
            for (var j = 0; j < parms.length; j++) {
                var value = parms[j].value;
                if (parms[j].type == "JSON") {
                    value = JSON.stringify(value);
                }

                if (j == 0) {
                    datapara = parms[j].name + "=" + value;
                }
                else {
                    datapara += "&" + parms[j].name + "=" + value;
                }
            }
        }
        var sn = "../../";
        var aurl = sn + ctn + "/" + actn;

        var start_time = new Date().getTime();
        if (type == "JSON") {
            $.ajax({
                type: method,
                url: aurl,
                data: parms[0].value,
                dataType: 'json',
                //async: false,
                cache: false,
                success: function (response) {
                    var request_time = new Date().getTime() - start_time;
                    $("#servertimer").html(request_time);
                    successcallback(response, successCallbackExtraparams);
                },
                complete: function (e, t, n) {

                    //$("#spnintimate").html("Binding");
                },
                error: function (e) {
                    failurecallback(e);
                }
            });
        }
        else {
            $.ajax({
                type: method,
                url: aurl,
                data: parms,

                //async: false,
                cache: false,
                success: function (response) {
                    var request_time = new Date().getTime() - start_time;
                    $("#servertimer").html(request_time);
                    successcallback(response, successCallbackExtraparams);
                },
                complete: function (e, t, n) {

                },
                error: function (e) {
                    failurecallback(e);
                }
            });
        }
    }
}
