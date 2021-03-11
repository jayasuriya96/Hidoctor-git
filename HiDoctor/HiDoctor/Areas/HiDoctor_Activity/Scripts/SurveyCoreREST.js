SurveyCoreREST = {
    //_defaultServer: "http://hdtest-c3.hidoctor.me/",
    //_defaultServer: "http://hdsurveyapi.kangle.me/",
    _defaultServer: "https://hdsurveyapi.hidoctor.me/",

    // _defaultServer: "https://Hdwebapi.hidoctor.me/",
    //_defaultServer: "http://localhost:50918/",
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
            async: false,
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