


var CommonDateDetails = {

    defaults: {
        CompanyCode: "",
        CompanyId: "",
        logUserCode: "",
        logRegionCode: "",
    },
    Init: function () {

    },

    fnGetTodaysDateNew: function () {
        //Get Local Date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yy = today.getFullYear()
        var time = today.toLocaleTimeString();
        var todaysdate = yy + '-' + mm + '-' + dd + ' ' + time;
        var timeZone = today.toTimeString();
        var mainTimeZone = timeZone.slice(timeZone.lastIndexOf('(') + 1, timeZone.lastIndexOf(')'));
        var timeZoneOffSet = today.getTimezoneOffset();

        //Get UTC Date
        var todayUTC = new Date();
        var ddutc = todayUTC.getUTCDate();
        var mmutc = todayUTC.getUTCMonth() + 1;
        var yyutc = todayUTC.getUTCFullYear();
        var timeUTC = todayUTC.toUTCString().split(' ')[4];
        var todaysdateutc = yyutc + '-' + mmutc + '-' + ddutc + ' ' + timeUTC;

        var _obj = {
            Date: todaysdate,
            TimeZone: mainTimeZone,
            Off_Set: CommonDateDetails.fnGetOffSet(),
            Date_Format: "yyyy-mm-dd hh:mm:ss:mode",
            UTC_Date: todaysdateutc
        };
        console.log(_obj);
        return _obj;
    },
    fnGetOffSet: function () {
        var currentTime = new Date();
        var currentTimezone = currentTime.getTimezoneOffset();
        currentTimezone = (currentTimezone / 60) * -1;
        var gmt = '';
        if (currentTimezone !== 0) {
            if (currentTimezone.toString().lastIndexOf('.') == -1) {
                gmt += currentTimezone > 0 ? '+' + currentTimezone + ':00' : '' + currentTimezone + ':00';
            }
            else {
                var decimaltoMinutes = CommonDateDetails.fnDecimaltoMinutes(currentTimezone);
                gmt += currentTimezone > 0 ? '+' + currentTimezone.toString().split('.')[0] + ':' + decimaltoMinutes + '' : '' + currentTimezone.toString().split('.')[0] + ':' + decimaltoMinutes + '';
            }
        }
        return gmt;
    },
    fnDecimaltoMinutes: function (values) {
        var arrvalues = [];
        var decimaltoMinutes = 0;
        if (values != null && values != "" && values != undefined) {
            arrvalues = values.toString().split('.')

        }
        if (arrvalues.length > 0) {
            decimaltoMinutes = parseInt(arrvalues[1]) * 6;
        }
        return decimaltoMinutes;
    }

}