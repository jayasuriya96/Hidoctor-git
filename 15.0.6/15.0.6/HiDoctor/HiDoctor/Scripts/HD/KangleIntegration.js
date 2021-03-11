//var apiSn = "http://localhost:64404/";
//var apiSn = "https://api.kangle.me/";
//var apiSn = "http://swaaskangleqa.cloudapp.net/";
var apiSn = "https://pharmakangleapi.kangle.me/";

//var apiSn = "../../";

var KangleIntegration = {
    _defaults: {
        ctn: '',
        actn: '',
        parms: '',
        method: '',
    },
    requestInvoke: function (ctn, actn, parms, method) {
        var datapara = "";
        KangleIntegration._defaults.ctn = ctn;
        KangleIntegration._defaults.actn = actn;
        KangleIntegration._defaults.parms = parms;
        KangleIntegration._defaults.method = method;
        KangleIntegration.CheckKangleAccess();
    },
    LogRequest: function (methodName, data, status, message) {
        $.ajax({
            url: "KangleIntegration/KangleRequestLog",
            data: "methodName=" + methodName + "&data=" + data + "&status=" + status + "&message=" + message,
            success: function (response) {
                console.log(response);
            },
            error: function (response) {
                console.log(response);
            },
        });
    },
    CheckKangleAccess: function () {
        var res = 0;
        $.ajax({
            url: "KangleIntegration/CheckKangleAccess",
            asyn: false,
            success: function (response) {
                if (response == '1') {
                    KangleIntegration.ProceedRequest()
                }
                else {
                    KangleIntegration.LogRequest(KangleIntegration._defaults.ctn + "/" + KangleIntegration._defaults.actn, JSON.stringify(KangleIntegration._defaults.parms), "Request Aborted", "No Kangle Access.");
                }

            },
            error: function (response) {
                return false;
            },
        });
        if (res == '1')
            return true;
        else
            return false;
    },
    ProceedRequest: function () {
        var ctn = KangleIntegration._defaults.ctn;
        var actn = KangleIntegration._defaults.actn;
        var parms = KangleIntegration._defaults.parms;
        var method = KangleIntegration._defaults.method;
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
        datapara = parms;
        var start_time = new Date().getTime();
        $.ajax({
            type: method,
            url: aurl,
            crossDomain: true,
            data: datapara,
            success: function (response) {
                var status = response;
                var message = response;
                if (response.split(":").length > 0) {
                    status = response.split(":")[0];
                    message = response.split(":")[1];
                }
                KangleIntegration.LogRequest(ctn + "/" + actn, JSON.stringify(parms), status, message);
            },
            complete: function (response) {
            },
            error: function (response) {
                KangleIntegration.LogRequest(ctn + "/" + actn, JSON.stringify(parms), response.status, response.statusText);
            }
        });
    },

}

