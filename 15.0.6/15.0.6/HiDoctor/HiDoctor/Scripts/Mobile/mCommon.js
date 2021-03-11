/*
Common js file for mobile
*/
var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";
var maxSpalshCount = 0;
var currentSplashNo = 0;

function fnmGetAllPrivileges() {

    $.ajax({
        type: 'POST',
        url: '/Master/GetPrivileges',
        data: "a",
        success: function (response) {
            // we have the response
            privilegeContainer_g = response;           
            // fnShowSplashScreen();
            $.mobile.changePage("../Home/SplashScreen", {
                type: "post",
                reverse: false,
                changeHash: false
            });
            //$.mobile.changePage("../HiDoctor_Activity/MobileMenu/Index", {
            //    type: "post",
            //    reverse: false,
            //    changeHash: false
            //});
        },
        error: function (e) {
            alert('error')
        }
    });
}
function fnShowSplashScreen() {
    //  $("#dvAjaxLoad").show();
    $.ajax({
        url: '../Home/GetSplashScreenForMobile/',
        type: "POST",
        data: "splashNo=" + currentSplashNo,
        success: function (jsonResult) {
            
            if (jsonResult != null && jsonResult != '' && jsonResult != false) {
                var content = "<div class='col-lg-12' style='text-align:right;'><a href='#' class='lnkClose' style='vertical-align: top;'><img class='closeImg' src='../../Content/images/cross.png'/></a></div>";
                content += "<div class='dvbtnPreNext'><div class='bx-prev'></div><div class='bx-next'></div></div>";
                content += "<ul class='bxslider'>";
                //  $.each(jsonResult, function (index, value) {
                var url = jsonResult[0].Mobile_Attachment_Url;
                if (url != '' && url != null && url != undefined) {
                    content += "<li><div class='col-lg-12'><p class='splashTitle'>" + jsonResult[0].Title + "</p></div><div class='splashImg col-lg-12'>";
                    content += "<img src='" + url + "' /></div><div class='col-lg-12'><div class='splashContent'>" + jsonResult[0].Description_HTML + "</div><div class='clearfix'></div></div></li>";
                }
                else {
                    content += "<li><div class='col-lg-12'><p class='splashTitle'>" + jsonResult[0].Title + "</p></div><div class='splashImg col-lg-12'>";
                    content += "</div><div class='col-lg-12'><div class='splashContent'>" + jsonResult[0].Description_HTML + "</div><div class='clearfix'></div></div></li>";
                }
                maxSpalshCount = jsonResult[0].Splash_Count;
                content += "</ul>";
                content += "<div class='dvbtnPreNext'><div class='bx-prev'></div><div class='bx-next'></div></div>";
                //  });
                $("#divSplash").html(content);
                //$('.bxslider').bxSlider({
                //    minSlides: 1
                //    //mode: 'fade',
                //    //auto: true,
                //    //autoStart: true,
                //    //autoDirection: 'next',
                //    //pause: 10000,
                //    //captions: true
                //});
                if (maxSpalshCount > 1 && ((currentSplashNo + 1) != maxSpalshCount)) {
                    $('.bx-next').show();
                    $('.bx-next').removeClass('disabled');
                }
                else {
                    $('.bx-next').hide();
                    $('.bx-next').addClass('disabled');
                }
                if (currentSplashNo > 0) {
                    $('.bx-prev').show();
                    $('.bx-prev').removeClass('disabled');
                }
                else {
                    $('.bx-prev').hide();
                    $('.bx-prev').addClass('disabled');
                }
                $('.bx-prev').unbind('click').bind('click', function () {
                    if (currentSplashNo != 0) {
                        currentSplashNo = (currentSplashNo - 1);
                        fnShowSplashScreen();
                    }
                    if (currentSplashNo == 0) {
                        $('.bx-prev').hide();
                    }
                    else {
                        $('.bx-prev').show();
                    }

                });
                $('.bx-next').unbind('click').bind('click', function () {
                    if (currentSplashNo < maxSpalshCount) {
                        currentSplashNo = currentSplashNo + 1;
                        fnShowSplashScreen();
                    }
                });

                //ShowModalPopup("modalSplash");
                $('#modalSplash').show();
                $('.closeImg').unbind('click').bind('click', function () {
                    $.mobile.changePage("../HiDoctor_Activity/MobileMenu/Index", {
                        type: "post",
                        reverse: false,
                        changeHash: false
                    });
                    $('#modalSplash').hide();

                });
            }
            else {
                $.mobile.changePage("../HiDoctor_Activity/MobileMenu/Index", {
                    type: "post",
                    reverse: false,
                    changeHash: false
                });
                $('#modalSplash').hide();
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}
function fnMsgAlert(type, screentitle, text) {
    alert(text);
}

function fnGetPrivilegeValue(privilegeName, defaultValue) {
    if (privilegeContainer_g != null) {
        if (privilegeName != "") {
            var selectedValue = jsonPath(privilegeContainer_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}

function fnCheckRemarksSpecialChar(id) {
    if ($(id).val() != "") {
        $(id).val($(id).val().replace(/\n/g, ''))
        $(id).val($(id).val().replace(/\r/g, ''))
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?<>]+$");
        if (!specialCharregex.test($(id).val())) {
            fnMsgAlert('info', 'DCR', 'The follwing charcters not allowed in this system. ~^+$<>"');
            //$.msgbox('The follwing charcters not allowed in this system. ~^+$<>');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true
}

//Newly added for restrict the special characters in DCR and it's related approval Remarks field
function fnCheckRemarksSpecialCharforDCR(id) {
    if ($(id).val() != "") {
        var specialCharregexfordcr = new RegExp(/^[a-zA-Z0-9-_.?,;:&*()[\] ]+$/);
        if (!specialCharregexfordcr.test($(id).val())) {
            fnMsgAlert('info', 'DCR', 'Please Remove the following special characters ' + restrictedSpecialchar_g + ' .');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true
}


function fnErrorIndicator(id) {
    $(id).css('border', '1px solid red');
    $(id).focus();
}

function fnRemoveErrorIndicatior(id) {
    $(id).css('background', 'transparent');
}

function fnGetDateDifference(d1, d2) {
    return (d2 - d1) / 1000 / 60 / 60 / 24;
}

function fnDateConvert(date, format) {
    var returnDate = date;
    if (format == "dd-mm-yyy") {
        var da = date.getDate();
        var mo = date.getMonth() + 1;
        var ye = date.getFullYear();

        da = da.toString().length == 1 ? "0" + da : da;
        mo = mo.toString().length == 1 ? "0" + mo : mo;
        returnDate = da + "-" + mo + "-" + ye;
    }
    return returnDate;
}

function fnGoToMenu() {

    $.mobile.changePage("/HiDoctor_Activity/MobileMenu/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnCheckNumeric(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'DCR', 'Please enter numeric value only.');
            //$.msgbox('Please enter numeric value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    else {
        return true;
    }
}

function fnCurrencyFormat(id, text) {
    //return /^\d{3,5}(\.\d{1,3})?$/.test($(id).val());
    //var currencyregex = new RegExp("^ddddd+(\.[0-9]{1,2})?$");
    if ($.trim($(id).val()).length > 0) {
        if (!/^\d{1,5}(\.\d{1,3})?$/.test($(id).val())) {
            fnMsgAlert('info', 'DCR', 'Invalid ' + text + ' amount.');
            //$.msgbox('Invalid ' + text + ' amount.');
            // $(id).val('');
            //fnErrorIndicator(id);
            return false;
        }
        else {
            //fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true;
}

function fnEnterKeyPrevent(event) {
    var keynum;
    var keychar;
    var numcheck;
    if (window.event) // IE8 and earlier
    {
        keynum = event.keyCode;
    }
    else if (event.which) // IE9/Firefox/Chrome/Opera/Safari
    {
        keynum = event.which;
    }
    if (keynum == 10) {
        return false;
    }
    return true;
}