var AjaxGlobalHandler = { Initiate: function (e) { $.ajaxSetup({ cache: false }); $(document).ajaxStart(function () { }).ajaxSend(function (e, t, n) { }).ajaxError(function (e, t, n) { if ("590" == t.status) { window.location.href = "../Home/SessionExpiry/"; return } }).ajaxSuccess(function (e, t, n) { }).ajaxComplete(function (e, t, n) { }).ajaxStop(function () { }) } }



var sn = "../../";
var HDAjax = {
    requestInvoke: function (ctn, actn, parms, method, successcallback, failurecallback) {
        debugger;
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
        var aurl = sn + ctn + "/" + actn;
        $.ajax({
            type: method,
            url: aurl,
            data: datapara,
            async: false,
            cache: false,
            success: function (response) {
                successcallback(response);
            },
            error: function (e) {
                failurecallback(e);
            }
        });
    }
}
