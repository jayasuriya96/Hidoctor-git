var commonValues = {
    defaults: {
        timeZoneOffSet: new Date().getTimezoneOffset()
    },
    getUTCOffset: function () {
        var offset = (new Date()).getTimezoneOffset();
        if (offset < 0) {
            offset = 10000 + Math.abs(offset);
        }
        return offset;
    },
}

var ADCourseDetails = {
    defaults: {
        subdomainName: HDNG_gSubdomain,
        companyId: HDNG_gCompanyId,
        userId: HDNG_gUserId,
        empName: HDNG_gEmpName,
        utcOffset: commonValues.getUTCOffset(),
    },
    context: {
        user: 'User',
        adCourse: 'WebApi',
        adCourseApi: 'AdCourseApi',
    },
    getAvailableAdCourses: function (companyId, userId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'GetAvailableCourses', _this.defaults.subdomainName, companyId, userId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdCourseSections: function (companyId, userId, courseId, publishId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'GetSectionDetailsOfCourse', _this.defaults.subdomainName, companyId, userId, courseId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getQuestionAnswerDetails: function (companyId, userId, courseId, sectionId, publishId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'getAdQuestionAnswerDetails', _this.defaults.subdomainName, companyId, userId, courseId, sectionId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    // for admin module
    getAdCourseQuestionAnswerDetails: function (companyId, userId, courseId, sectionId, publishId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'getAdCourseQuestionAnswerDetails', _this.defaults.subdomainName, companyId, userId, courseId, sectionId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertCourseResponse: function (answerObj, companyId, userId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'insertAdCourseResponse', _this.defaults.subdomainName, companyId, userId];
        CoreREST.postArray(_this, context, answerObj, success, failure);
    },
    insertAdCourseSectionUserExamHeader: function (courseId, courseUserAssignMentId, couseUserSectionId, publishId,
        userId, companyId, sectionId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'insertAdCourseSectionUserExamHeader', _this.defaults.subdomainName, courseId,
            courseUserAssignMentId, couseUserSectionId, publishId, userId, companyId, sectionId];
        CoreREST.post(_this, context, null, success, failure);
    },
    insertCourseUserExam: function (examObj, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'insertCourseUserExam', _this.defaults.subdomainName];
        CoreREST.post(_this, context, examObj, success, failure);
    },
    getAdSectionQuestionDetails: function (examId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'getAdSectionQuestionDetails', _this.defaults.subdomainName, examId, _this.defaults.utcOffset, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdSectionReportHeader: function (courseId, userId, publishId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'getAdSectionReportHeader', _this.defaults.subdomainName, courseId, userId, publishId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdSectionAttemptDetails: function (courseId, sectionId, userId, publishId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'getAdSectionAttemptDetails', _this.defaults.subdomainName, _this.defaults.companyId, courseId, userId, publishId, sectionId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAdAssetsByCourseId: function (companyId, courseId, sectionId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'GetAdAssetsByCourseId', _this.defaults.subdomainName, companyId, courseId, sectionId];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertAdCourseViewAnalytics: function (data, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'InsertAdCourseViewAnalytics', _this.defaults.subdomainName];
        CoreREST.post(_this, context, data, success, failure);
    },
    getAdCourseCertificate: function (companyId, courseUserAssignmentId, success, failure) {
        var _this = ADCourseDetails;
        var context = [_this.context.adCourseApi, 'GetAdCourseCertificate', _this.defaults.subdomainName, companyId, courseUserAssignmentId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    }

};
var fnSetFooter = function (divfooter) {
    var Services = ADCourseDetails;
    var footer = $('.footer');
    footer.remove();
    var footerstyle = '<div class="footer">';
    footerstyle += '<p> &copy; Powered by <span> SwaaS</span> - v' + appVersion + '</p>';
    if (Services.defaults.supportEmail != null && Services.defaults.supportEmail != '' && Services.defaults.supportPhone != null && Services.defaults.supportPhone != '') {
        footerstyle += '<div id="support">';
        footerstyle += '<span class="fa fa-support"></span><span>&nbsp;support</span>';
        footerstyle += '</div>';
        footerstyle += '<br />';
        footerstyle += '<div id="mail"><span class="fa fa-envelope"></span>&nbsp; ' + Services.defaults.supportEmail + '</div>';
        footerstyle += '<div id="numbr"><span class="fa fa-phone"></span>&nbsp; ' + Services.defaults.supportPhone + '</div>';
        footerstyle += '</div>';
        divfooter.append(footerstyle);
        $('.footer').bind('click', function () {
            if ($('.footer').height() >= 55) {
                $('.footer').css("height", "20px");
            } else {
                $('.footer').css("height", "60px");
            }
        });
    } else {
        divfooter.append(footerstyle);
    }
};
var sendUserTrack = function (pageName, position, success, failure) {
    try {
        var Services = ADCourseDetails;
        var data = {};
        data.CompanyId = Services.defaults.companyId;
        data.UserId = Services.defaults.userId;
        data.RegionCode = regionCode_g;
        data.Module = pageName;
        data.Devicetype = window.jscd.deviceType;
        data.DeviceModel = "N/A";
        data.AppVersion = appVersion;
        var getBrowPlatform = $.pgwBrowser();
        data.Device_OS_Type = getBrowPlatform.os.name;
        data.Browser = getBrowPlatform.browser.name;
        data.OSBrowserVersion = window.jscd.browserVersion;
        data.OSVersion = window.jscd.osVersion;
        data.UserAnonymous = "";
        data.OtherData1 = "";
        data.OtherData2 = "";
        data.lattitude = position.coords.latitude;
        data.longitude = position.coords.longitude;
        data.Address = "";
        console.log(data);
        Services.insertUserTracker(data, success, failure);
    } catch (e) {
        failure(e);
    }
};
var insertUserTrack = function (pageName, success, failure) {
    try {
        navigator.geolocation.getCurrentPosition(function (position) {
            sendUserTrack(pageName, position, success, failure);
        }, function () {
            var position = {};
            position.coords = {};
            position.coords.latitude = 0;
            position.coords.longitude = 0;
            sendUserTrack(pageName, position, success, failure);
        });
    } catch (e) {
        failure(e);
    }
};

var setLeftSecUserName = function (dvElementId, userName, profilePic) {
    var dvElement = $('#' + dvElementId);
    dvElement.html(userName);
    if (profilePic == null || profilePic == '')
        profilePic = 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg';
    dvElement.css('background', 'url("' + profilePic + '") no-repeat scroll 0 0 / 35px 35px rgba(0, 0, 0, 0)');
    dvElement.unbind('click').bind('click', function (e) {
        window.location.href = '/User/UserProfile';
    });
};

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};