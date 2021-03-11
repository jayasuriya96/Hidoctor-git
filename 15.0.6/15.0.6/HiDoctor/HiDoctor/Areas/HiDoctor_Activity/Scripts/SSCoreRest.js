//var apiSn = "http://localhost:5000/";
//var apiSn = "http://localhost:5001/";
var apiSn = "https://hdcoreapi.hidoctor.me/";
//var apiSn = "https://hdcore-prodapi.hidoctor.me/";
 
var SSCoreREST = {

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
                url: aurl,
                type: method,
                crossDomain: true,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(parms),
                async: true, 
                success: function (response) {                    
                    successcallback(response, successCallbackExtraparams);
                },
                complete: function (e, t, n) { 
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
                async: false,
                cache: false,
                success: function (response) {                 
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