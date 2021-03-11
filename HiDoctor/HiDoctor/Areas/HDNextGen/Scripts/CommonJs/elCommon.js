var appVersion = "4.0";
var emailId = "";
var phoneNo = "";

var networkProblemError = "Problem connecting to network, please check your internet.";

function fnFileSelectedThumbnail(obj) {
    var ext = $(obj).val().match(/\.([^\.]+)$/)[1];
    switch (ext) {
        case 'jpg':
            break;
        case 'png':
            break;
        default:
            fnMsgAlert('info', 'File Type', 'Following extension only allowed :*.jpg,*.png');
            $(obj).val('');
    }
}

function fnGetDocumentType(ext) {
    var documentType = ""

    switch (ext) {
        case 'jpg':
            documentType = "IMAGE";
            break;
        case 'bmp':
            documentType = "IMAGE";
            break;
        case 'jpeg':
            documentType = "IMAGE";
            break;
        case 'gif':
            documentType = "IMAGE";
            break;
        case 'tiff':
            documentType = "IMAGE";
            break;
        case 'png':
            documentType = "IMAGE";
            break;
        case 'doc':
            documentType = "DOCUMENT";
            break;
        case 'docx':
            documentType = "DOCUMENT";
            break;
        case 'xls':
            documentType = "DOCUMENT";
            break;
        case 'xlsx':
            documentType = "DOCUMENT";
            break;
        case 'ppt':
            documentType = "DOCUMENT";
            break;
        case 'tif':
            documentType = "DOCUMENT";
            break;
        case 'pptx':
            documentType = "DOCUMENT";
            break;
        case 'ppts':
            documentType = "DOCUMENT";
            break;
        case 'pdf':
            documentType = "DOCUMENT";
            break;
        case 'mp4':
            documentType = "VIDEO";
            break;
        case 'wmv':
            documentType = "VIDEO";
            break;
        case 'swf':
            documentType = "DOCUMENT";
            break;
        case 'flv':
            documentType = "VIDEO";
            break;
        case 'zip':
            documentType = "DOCUMENT";
            break;
        default:
            documentType = "DOCUMENT";
            break;
    }

    return documentType;
}

function fnValidateSpecialChar(val) {
    var ALPHANUMERICREGX_g = new RegExp("^[a-zA-Z0-9 _]+$");
    if (!ALPHANUMERICREGX_g.test($.trim(val))) {
        return false;
    }
    return true;
}

function fnLoginLoad() {
    window.location.href = document.domain;
    window.location.href = "http://" + document.domain;
}

function fnPutPageHeader(pageHeader) {
    $.ajax({
        type: "POST",
        async: false,
        url: '../Infrastructure/PutPageHeader/',
        data: "pageHeader=" + pageHeader + "",
        success: function (message) {

        }
    });

}


function regExforAlphaNumeric(value) {
    var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
    // var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
    if (!specialCharregex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

function regExforAlphaNumericWithSlash(value) {
    var specialCharregex = new RegExp("^[a-zA-Z0-9/]+$");
    // var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
    if (!specialCharregex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}


function regExforUserPassword(value) {
    var specialCharregex = new RegExp("^[a-zA-Z0-9/*()_.]+$");
    // var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
    if (!specialCharregex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}
function isValidDateFormat(id) {
    if ($.trim($(id).val()).length > 0) {
        var date = $(id).val();
        if (date.split('/').length == 3) {
            var day = date.split('/')[0];
            var month = date.split('/')[1];
            var year = date.split('/')[2];
            if (day.length == 2 && month.length == 2 && year.length == 4) {

                var dateObj = new Date(year + '-' + month + '-' + day);
                if (dateObj == "Invalid Date") {
                    return false;
                }

                var dayI = parseInt(day);
                var monthI = parseInt(month);
                var yearI = parseInt(year);

                if (dayI == 0 || monthI == 0 || yearI == 0) {
                    return false;
                }
                if (dayI > 31 || monthI > 12) {
                    return false;
                }

                if ((monthI == 4 || monthI == 6 || monthI == 9 || monthI == 11) && dayI == 31) {
                    return false;
                }
                if (monthI == 2) {
                    var isleap = (yearI % 4 == 0 && (yearI % 100 != 0 || yearI % 400 == 0));
                    if (dayI > 29 || (dayI == 29 && !isleap)) {
                        return false;
                    }
                }

                // date range check
                var sqlDateObj = new Date('1753-01-01');
                if (dateObj < sqlDateObj) {
                    return false;
                }

            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    return true;
}
function fnValidateDateDiff(startDateObj, endDateObj) {
    var startDate = $(startDateObj).val().split('/')[2] + '/' + $(startDateObj).val().split('/')[1] + '/' + $(startDateObj).val().split('/')[0];
    var enddDate = $(endDateObj).val().split('/')[2] + '/' + $(endDateObj).val().split('/')[1] + '/' + $(endDateObj).val().split('/')[0];
    var start = new Date(dob);
    var end = new Date(doj);
    if (start > end) {
        fnMsgAlert('info', 'Validate', 'Start date must be greater than or equal to end date');
        return false;
    }
    return true;
}


function emailIdValidation(value) {
    email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}



function fnEmailCheck(id) {
    if ($.trim($(id).val()) != "") {
        var email = $(id).val(),
        emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (!emailReg.test(email) || email == '') {
            $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}


function fnIsNumeric(e) {
    var keynum;
    var keychar;
    var numcheck;

    if (window.event) // IE8 and earlier
    {
        keynum = event.keyCode;
    }
    else if (e.which) // IE9/Firefox/Chrome/Opera/Safari
    {
        keynum = event.which;
    }
    if (!(keynum <= 57 && keynum >= 48 || event.keyCode == 46)) {
        return false;
    }
    return true;

}


//Allowing Alphanumeric Minus,Full stop,Slash and question Mark
function regExforAllowingSpecCharaforMenu(value) {
    var specialcharregwithUnderscore = new RegExp(/^[a-zA-Z0-9-./?_]+$/);
    if (!specialcharregwithUnderscore.test(value)) {
        return false;
    }
    else {
        return true;
    }
}


// DIV SEARCH
jQuery.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};


jQuery.fn.removeHighlight = function () {
    return this.find("span.highlight").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};

//Allowing Alphanumeric and Underscore only
function regExforAllowingUnderscorewithoutSpace(value) {
    var specialcharregwithUnderscore = new RegExp(/^[a-zA-Z0-9_]+$/);
    if (!specialcharregwithUnderscore.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

/*function fnSetFooter(appendToBody) {
    var footer = $('.footer');
    footer.remove();
    var footerHtml = '<div class="footer"><p>&copy; Powered by <span>SwaaS</span> - v' + appVersion + '</p></div>';
    appendToBody.append(footerHtml);
}*/
var fnSetFooter = function (divfooter) {
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

function fnSetSettingsGear() {
    var homeAry =  [
            {
                displaytitle: "Kangle Home",
                iconclass: 'arrow-wire',
                onclick: function () {
                    //RedirectWire();
                    window.location.href = '/Home/HomePage'
                },
                isVisible: true
            }
    ];

    var backObj = {
        displaytitle: "Back",
        iconclass: 'arrow-wire',
        onclick: function () {
            window.history.back();
        },
        isVisible: true
    };
    var pathName = window.location.pathname;
    if (pathName != null) {
        /*if (pathName.toLowerCase().indexOf("/rxbook/") >= 0 ||
                pathName.toLowerCase().indexOf("/user/userprofile/") >= 0) {*/
        if (pathName.toLowerCase().indexOf("/rxbook/") >= 0) {
            backObj.displaytitle = "Enterprise Chat";
            backObj.onclick = function () {
                window.location.href = "/RxBook/";
            }
        } else if (pathName.toLowerCase().indexOf("/assetupload/") >= 0) {
            backObj.displaytitle = "Asset Page";
            backObj.onclick = function () {
                window.location.href = "/AssetUpload/AssetWeb";
            }
        } else if (pathName.toLowerCase().indexOf("/meeting/") >= 0) {
            backObj.displaytitle = "Goto Calendar";
            backObj.onclick = function () {
                window.location.href = "/Meeting/MeetingHome";
            }
        } else if (pathName.toLowerCase().indexOf("/course/") >= 0) {
            backObj.displaytitle = "Course Page";
            backObj.onclick = function () {
                window.location.href = "/Course/UserCourseDetails";
            }
        } else if (pathName.toLowerCase().indexOf("/adcourse/") >= 0) {
            backObj.displaytitle = "Course Page";
            backObj.onclick = function () {
                window.location.href = "/AdCourse/UserAdCourseDetails";
            }
        }
    }

    homeAry.push(backObj);

    var arrowPopup = new ArrowPopup($('#home-btn'), {
        container: "headersection",
        bodyDiv: "home",
        contents: homeAry
    });

    var arrowPopup = new ArrowPopup($('#pop-settings'), {
        container: "headersection",
        bodyDiv: "settings",
        contents: [
            {
                displaytitle: "My Profile",
                iconclass: 'arrow-profile',
                onclick: function () {
                    //RedirectWire();
                    window.location.href = '/User/UserProfile'
                },
                isVisible: true
            }, {
                displaytitle: "Change Password",
                iconclass: 'arrow-offline',
                onclick: function () {
                    //RedirectWire();
                    window.location.href = '/ChangePassword/Index'
                },
                isVisible: true
            },
            {
                displaytitle: "Change Logo",
                iconclass: 'arrow-logo fa fa-pencil',
                onclick: function () {
                    if (!window.jscd.mobile) {
                        cropLogoImage.init();
                    } else {
                        window.location.href = '/SelfSignOn/LogoPicture'
                    }
                    return false;
                },
                isVisible: true
            },
            {
                displaytitle: "Logout",
                iconclass: 'arrow-exit',
                onclick: function () {
                    //window.location.href = '/Home/LogOff';
                    $.ajax({
                        type: "POST",
                        url: '/Home/LogOff/',
                        data: "A",
                        success: function (returnURL) {
                            if (returnURL != null && returnURL != "" && returnURL.length > 0) {
                                window.location.href = "http://" + returnURL;
                            }
                            else {
                                window.location.href = "../Home/SessionExpiry/";
                            }
                        }
                    });
                },
                isVisible: true
            }
        ]
    });
    var isHiDoctorCustomer = Services.defaults.isHiDoctorCustomer == 0 ? $(".arrow-offline").show() : $(".arrow-offline").hide();
    var isAdmin = cropLogoImage.defaults.isAdmin == "True" ? $(".arrow-logo").show() : $(".arrow-logo").hide();
  
}

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

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

/* user track javascript */
var PAGE_NAMES = {
    home: "Landing",
    asset: "Bookshelf",
    social: "RxBook",
    meeting: "Meeting",
    course: "Course",
    advancedCourse: "Advanced Course"
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

var sendUserTrack = function (pageName, position, success, failure) {
    try {
      
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
/**
 * JavaScript Client Detection
 * (coffee) viazenetti GmbH (Christian Ludwig)
 */
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        //browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
            // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
            // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
            // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
            // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
            // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
            // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            { s: 'Windows 3.11', r: /Win16/ },
            { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
            { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
            { s: 'Windows 98', r: /(Windows 98|Win98)/ },
            { s: 'Windows CE', r: /Windows CE/ },
            { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
            { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
            { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
            { s: 'Windows Vista', r: /Windows NT 6.0/ },
            { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
            { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
            { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
            { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
            { s: 'Windows ME', r: /Windows ME/ },
            { s: 'Android', r: /Android/ },
            { s: 'Open BSD', r: /OpenBSD/ },
            { s: 'Sun OS', r: /SunOS/ },
            { s: 'Linux', r: /(Linux|X11)/ },
            { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
            { s: 'Mac OS X', r: /Mac OS X/ },
            { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
            { s: 'QNX', r: /QNX/ },
            { s: 'UNIX', r: /UNIX/ },
            { s: 'BeOS', r: /BeOS/ },
            { s: 'OS/2', r: /OS\/2/ },
            { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else {
                flashVersion = unknown;
            }
        }
    }

    var splitSize = screenSize.split("x");
    var xSize = 0;
    var ySize = 0;
    if (splitSize != null && splitSize.length == 2) {
        xSize = splitSize[0];
        ySize = splitSize[1];
    }

    var deviceType = "PC";
    if (mobile) {
        deviceType = "Mobile";
        if (xSize >= 480) {
            deviceType = "Tablet";
        }
    }

    window.jscd = {
        screen: screenSize,
        screenX: xSize,
        screenY: ySize,
        browser: browser,
        browserVersion: version,
        mobile: mobile,
        deviceType: deviceType,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
}(this));
/* user track javascript */