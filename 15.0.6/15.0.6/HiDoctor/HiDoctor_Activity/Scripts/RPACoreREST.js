var apiURL = "http://localhost:14829/";
RPAREST = {
    //"https://hdwebapi-dev.hidoctor.me/",
    requestInvoke: function (ctn, actn, parms, method, successcallback, failurecallback, successCallbackExtraparams) {
        var datapara = "";
        debugger;
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
        var aurl = apiURL + ctn + "/" + actn;
        datapara = parms;
        var start_time = new Date().getTime();
        $.ajax({
            url: aurl,
            type: method,
            crossDomain: true,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(datapara),
            async: false,
            success: function (response) {
                successcallback(response, successCallbackExtraparams);
            },
            complete: function (e, t, n) {
                //console.log(e);
                //console.log(t);
                //console.log(n);
                //$("#spnintimate").html("Binding");
            },
            error: function (e) {
                failurecallback(e);
            }
        });
    }
};