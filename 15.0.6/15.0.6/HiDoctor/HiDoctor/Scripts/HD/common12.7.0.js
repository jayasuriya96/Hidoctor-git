var privilegeContainer_g;
var _autoComplete_g;
var companyCode_g;
var menuContent_g = "";

var monthArray = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];
var shortMonthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var monthNumArray = ["1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10", "11", "12"];
var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";

// User Authendication and get current information.
function fnUserAuthendication(companyCode, userCode, sessionID, source) {

    $.ajax({
        type: 'GET',
        url: "../CurrentInfo/UserAuthendication/?companyCode=" + companyCode + "&userCode=" + userCode + "&sessionID=" + sessionID,
        success: function (response) {
            $(document).idleTimeout({ inactivity: 600000 })

            fnGetAllPrivileges(source);
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'UserAuthendication Failed.');
        }
    });
}

// Retrives the all privileges.
function fnGetAllPrivileges() {
    $.ajax({
        type: 'POST',
        url: '../Master/GetPrivileges',
        data: "a",
        async: false,
        success: function (response) {
            // we have the response
            privilegeContainer_g = response;

            // Done redirection.

        },
        error: function (e) {
            fnMsgAlert("info", "Information", "Calendar Loads failed.");
        }
    });
}

// Retrives the Privilege Value.
function fnGetPrivilegeValue(privilegeName, defaultValue) {
    var caption_Array = new Array();
    caption_Array.push('STOCKIEST_CAPTION_DISPLAY_NAME');
    caption_Array.push('DOCTOR_CAPTION_DISPLAY_NAME');
    caption_Array.push('CHEMIST_CAPTION_DISPLAY_NAME');
    if (privilegeContainer_g != null) {
        if (privilegeName != "") {
            var selectedValue = jsonPath(privilegeContainer_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue.length > 0) {
                if (caption_Array.indexOf(privilegeName) >= 0) {
                    defaultValue = selectedValue[0].PrivilegeValue.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                }
                else {
                    defaultValue = selectedValue[0].PrivilegeValue;
                }
            }
        }
    }
    return defaultValue;
}

function fnErrorIndicator(id) {
    $(id).css('backgroundColor', '#efefef');
    $(id).focus();
}
function fnErrorIndicatorforSFC(id) {
    $(id).css('backgroundColor', '#efefef');
}
function fnRemoveErrorIndicatior(id) {
    $(id).css('backgroundColor', '#fff');
}

function fnCheckNumeric(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {

            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
}

function fnCurrencyFormat(id, text) {
    //return /^\d{3,5}(\.\d{1,3})?$/.test($(id).val());
    //var currencyregex = new RegExp("^ddddd+(\.[0-9]{1,2})?$");
    if ($.trim($(id).val()).length > 0) {
        if (!/^\d{1,5}(\.\d{1,3})?$/.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'Invalid ' + text + ' amount.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {

            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true;
}

function fnChekInteger(id) {
    var intregex = new RegExp("^[0-9]+$");
    if ($.trim($(id).val()).length > 0) {
        if (!intregex.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter integer value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true;
}

function fnIsNumber(e) {
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
    if (!(keynum <= 57 && keynum >= 48)) {
        return false;
    }
    return true;

}

function fnCheckSpecialChar(id) {

    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        if (!specialCharregex.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            if (id.id == "txtDocSpeciality") {
                if (id.getAttribute('readonly') == "readonly") {
                    return true;
                }
            }
            else {
                fnRemoveErrorIndicatior(id);
            }
        }
    }
    return true
}

function fnCheckRemarksSpecialChar(id) {
    if ($(id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#@!;{}*-\/,`=?]+$");
        if (!specialCharregex.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'The following charcters not allowed in this system. ~^+$"');
            fnErrorIndicator(id);
            return false;
        }
        else {
            if ($(id).parent().parent() != null) {
                if ($(id).parent().parent().hasClass("autoRouteComplete")) {
                    return true;
                }
            }
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
            fnMsgAlert('info', 'Information', 'Please Remove the following special characters ' + restrictedSpecialchar_g + '');
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

function fnCheckIsNull(id, name, title) {
    if ($.trim($(id).val()).length == 0) {
        var screenTitle = title == null ? "Information" : $.trim(title).length == 0 ? "Information" : title;
        fnMsgAlert('info', screenTitle, 'Please enter the ' + name + ' value.');
        fnErrorIndicator(id);
        return false;
    }
    else {
        fnRemoveErrorIndicatior(id);
        return true;
    }
    return true;
}

function fnCheckMaxLength(field, maxChars) {
    if (field.val().length >= maxChars) {
        event.returnValue = false;
        fnMsgAlert('info', 'Information', 'You have entered more than ' + maxChars + ' chars which is not allowed.');
        return false;
    }
    return true;
}

function fnCheckMaxLengthPaste(field, maxChars) {
    event.returnValue = false;
    if ((field.value.length + window.clipboardData.getData("Text").length) > maxChars) {
        fnMsgAlert('info', 'Information', 'You have entered more than ' + maxChars + ' chars which is not allowed.');
        return false;
    }
    event.returnValue = true;
}

function fnChekTimeformat(id) {
    return true;
}

// To check whether the entered value is in the given json.
function fnCheckValidData(id, jsonData, name, msgStr) {
    var value = $(id).val();
    if (jsonData != null) {
        if (value != "") {
            var selectedValue = jsonPath(jsonData, "$.Data[?(@." + name + "=='" + value + "')]");
            if (!(selectedValue.length > 0)) {
                fnMsgAlert(value + ' is invalid ' + msgStr + '.');
                $(id).val('');
                fnErrorIndicator(id);
                return false;
            }
            else {
                fnRemoveErrorIndicatior(id);
                return true;
            }
        }
    }
    else {
        return true;
    }
}

function fnExpandTextarea(id) {
    $(id).addClass("textareaexpand");
}

function fnCloseTextarea(id) {
    $(id).removeClass("textareaexpand");
}

function fnGetDateDifference(d1, d2) {
    return (d2 - d1) / 1000 / 60 / 60 / 24;
}

function fnGetQueryStringValue(key, defaultValue) {
    var url = window.location.href.indexOf('?') > -1 ? window.location.href.substring(window.location.href.indexOf('?') + 1, window.location.href.length) : "";
    if (url.length > 0) {
        var param = url.split('&');
        for (var i = 0; i < param.length; i++) {
            if (param[i].toUpperCase().split('=')[0] == key.toUpperCase()) {
                var pvalue = param[i].split('=')[1];
                if (pvalue.length > 0) {
                    defaultValue = pvalue;
                    break;
                }
            }
        }
    }

    return defaultValue;
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

function fnSetTimePicker() {
    $('.time').timepicker({
        showPeriod: true,
        showLeadingZero: true
    });
}

//******************* Method to convert html table to JSON*****************//
(function ($) {
    $.fn.tabletojson = function (options) {
        var defaults = {
            headers: null,
            attribHeaders: null,
            returnElement: null,
            complete: null
        };

        var options = $.extend(defaults, options);
        var selector = this;
        var jsonRowItem = "";
        var jsonItem = new Array();
        var jsonRow = new Array();
        var heads = [];
        var rowCounter = 1;
        var comma = ",";
        var json = "";

        if (options.headers != null) {
            options.headers = options.headers.split(' ').join('');
            heads = options.headers.split(",");
        }

        var rows = $(":not(tfoot) > tr", this).length;
        $(":not(tfoot) > tr", this).each(function (i, tr) {
            jsonRowItem = "";

            if (this.parentNode.tagName == "TFOOT") {
                return;
            }
            if (this.parentNode.tagName == "THEAD") {
                if (options.headers == null) {
                    $('th', tr).each(function (i, th) {
                        heads[heads.length] = $(th).html();
                    });
                }
            }
            else {

                if (options.attribHeaders != null) {
                    var h = eval("(" + options.attribHeaders + ")");

                    for (z in h) {
                        heads[heads.length] = h[z];
                    }
                }

                rowCounter++
                var headCounter = 0;
                jsonRowItem = "{";
                jsonItem.length = 0;
                $('td', tr).each(function (i, td) {
                    var re = /&nbsp;/gi;
                    var v = $(td).html().replace(re, '')
                    jsonItem[jsonItem.length] = "\"" + heads[headCounter] + "\":\"" + v + "\"";
                    headCounter++;
                });

                if (options.attribHeaders != null) {
                    for (z in h) {
                        jsonItem[jsonItem.length] = "\"" + heads[headCounter] + "\":\"" + tr[z] + "\"";
                        headCounter++;
                    }
                }

                jsonRowItem += jsonItem.join(",");
                jsonRowItem += "}";
                jsonRow[jsonRow.length] = jsonRowItem;
            }
        });
        json += "[" + jsonRow.join(",") + "]";

        if (options.complete != null) {
            options.complete(json);
        }

        if (options.returnElement == null)
            return json;
        else {
            $(options.returnElement).val(json);
            return this;
        }

    }
})(jQuery)

function add_placeholder(id, placeholder) {

    if ($.browser.msie) {
        var el = document.getElementById(id);
        el.placeholder = placeholder;

        el.onfocus = function () {

            if (this.value == this.placeholder) {
                this.value = '';
                el.style.cssText = 'border: solid 1px #ccc';
            }
            if (this.placeholder == "Chemist Name") {
                if (RCPA_g == "R") {
                    var i = id.split('_')[1];
                    hideRCPA(i);
                }
            }
        };

        el.onblur = function () {
            if (this.value.length == 0) {
                if (this.value == this.placeholder) {
                    el.style.cssText = 'color:#AF8F99; border: solid 1px #ccc';
                }
                else {
                    el.style.cssText = 'color:#222; border: solid 1px #ccc';
                }
                this.value = this.placeholder;
            }
        };

        el.onblur();
        if (this.value == this.placeholder) {
            el.style.cssText = 'color:#AF8F99; border: solid 1px #ccc';
        }
    }
    else {
        $('#' + id).attr('placeholder', placeholder);
    }
}

//modal
(function ($) {
    $.modal = function (config) {

        var defaults, options, modal, header, content, footer, close, overlay, width, centerOffset;

        defaults = {
            title: ''
			, byline: ''

			, ajax: ''
			, div: ''

			, slide: false
			, slideEl: '.slide'

			, btnClass: 'btn small secondary'

			, overlay: true
			, overlayClose: true

			, beforeOpen: function () { }
			, afterOpen: function () { }

			, debug: false
        };

        options = $.extend(defaults, config);

        $.modal.forceClose();

        modal = $('<div>', { 'id': 'modal' });
        header = $('<div>', { 'id': 'modal_header' });
        content = $('<div>', { 'id': 'modal_content' });
        overlay = $('<div>', { 'id': 'modal_overlay' });
        close = $('<div>', { 'id': 'modal_close', 'html': 'x' });

        header.appendTo(modal);
        content.appendTo(modal);
        close.appendTo(modal);

        options.beforeOpen(modal);

        modal.appendTo('body').hide().fadeIn(500);

        if (options.overlay) {
            overlay.appendTo('body');
        }

        if (options.overlayClose) {
            overlay.bind('click', function (e) { $.modal.close(); });
        }

        close.bind('click', function (e) { $.modal.close(); });

        (options.title !== '') ? header.append('<h3>' + options.title + '</h3>') : '';
        (options.byline !== '') ? header.append('<div class="byline">' + options.byline + '</div>') : '';

        if (options.ajax !== '') {
            content.html('<div id="modal_loader"><img src="../Content/images/mba/ajax-loader.gif" /></div>');
            $.modal.reposition();
            $.get(options.ajax, function (response) {
                content.html(response);
                handleContent();
            });
        }

        if (options.div !== '') {
            content.html($(options.div).html());
            handleContent();
        }

        function handleContent() {
            $.modal.reposition();
            if (options.slide) { handleSlides(); }

            setTimeout(function () {
                options.afterOpen(modal);
            }, 1000);
        }

        function handleSlides() {
            var slides = modal.find(options.slideEl);
            slides.hide().eq(0).show().addClass('current_slide');
            var footer = $('<div>', { id: 'modal_footer' }).appendTo(modal);
            var prev = $('<button>', { id: 'prev', html: '<u>P</u>revious' }).addClass(options.btnClass).appendTo(footer);
            var display = $('<span>', { id: 'display' }).appendTo(footer);
            var next = $('<button>', { id: 'next', html: '<u>N</u>ext' }).addClass(options.btnClass).appendTo(footer);
            display.html('<span class="current_page">1</span> of ' + slides.length);
            prev.attr('disabled', 'disabled');

            $(document).bind('keyup.modal', function (e) {
                if (e.keyCode == 78 || e.keyCode == 39) { navigateSlides('forward', slides); }
                if (e.keyCode == 80 || e.keyCode == 37) { navigateSlides('backward', slides); }
            });

            footer.find('button').bind('click', function (e) {
                var direction = ($(this).is('#next')) ? 'forward' : 'backward';
                navigateSlides(direction, slides);
            });

        }

        function navigateSlides(direction, slides) {
            var currentSlide, nextSlide, next, prev;
            next = $('#next');
            prev = $('#prev');
            currentSlide = content.find('.current_slide');
            nextSlide = (direction == 'forward') ? currentSlide.next(options.slideEl) : currentSlide.prev(options.slideEl);

            if (nextSlide.length > 0) {
                nextSlide.addClass('current_slide').show().siblings(options.slideEl).hide().removeClass('current_slide');
                $('#display .current_page').text(nextSlide.index() + 1);

                (nextSlide.index() === 0) ? prev.attr('disabled', 'disabled') : prev.removeAttr('disabled');
                (nextSlide.index() === slides.length - 1) ? next.attr('disabled', 'disabled') : next.removeAttr('disabled');

                var contentWidth = nextSlide.outerWidth();
                content.width(contentWidth + 30);
                //$.modal.reposition ();	
            }
        }

        $(document).bind('keyup.modal', function (e) {
            if (e.keyCode == 27) { $.modal.close(); }
        });

    };

    $.modal.reposition = function () {
        var width = $('#modal').outerWidth();
        var centerOffset = width / 2;
        var pageScroll = getPageScroll();
        $('#modal').css({ 'left': '50%', 'top': pageScroll[1] + 100, 'margin-left': '-' + centerOffset + 'px' });
    };

    $.modal.close = function () {
        $('#modal').fadeOut('medium', function () { $(this).remove(); });
        $('#modal_overlay').fadeOut('medium', function () { $(this).remove(); });
        $(document).unbind('keyup.modal');
    };

    $.modal.forceClose = function () {
        $('#modal').remove();
        $('#modal_overlay').remove();
        $(document).unbind('keyup.modal');
    };

    $.modal.setTitle = function (title) {
        var h3 = $('#modal_header').find('h3');
        if (h3.length > 0) {
            h3.html(title);
        } else {
            $('<h3>', { html: title }).prependTo('#modal_header');
        }
    };

    $.modal.setByline = function (text) {
        var el = $('#modal_header').find('.byline');
        if (el.length > 0) {
            el.html(text);
        } else {
            $('<div>', { 'class': 'byline', html: text }).appendTo('#modal_header');
        }
    };

    // getPageScroll() by quirksmode.com
    function getPageScroll() {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }
        return new Array(xScroll, yScroll);
    }
})(jQuery);

function _escapeRegex(str) {
    /*jshint regexdash:true */
    return (str + "").replace(/([.?*+\^\$\[\]\\(){}|-])/g, "\\$1");
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

//Allowing Alphanumeric and Underscore with space,Comma,PLus,Minus,Slash and question Mark
function regExforAllowingsomeSpeCharacter(value) {
    var specialcharregwithUnderscore = new RegExp(/^[a-zA-Z0-9-_+./,? ]+$/);
    if (!specialcharregwithUnderscore.test(value)) {
        return false;
    }
    else {
        return true;
    }
}
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

function emailIdValidation(value) {
    email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

/*function fnCheckSpecialChar(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '.,]+$");
        if (!specialCharregex.test($(id).val())) {
            fnMsgAlert(msgType, msgTitle, msg);
            //$.msgbox('Please remove the special characters.');
            $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}*/



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



function fnGetMenuContent() {
    debugger;
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '/Home/GetMenuContent/',
        type: "POST",
        data: "A",
        success: function (jsMenu) {
            jsMenu = eval('(' + jsMenu + ')');
            menuContent_g = jsMenu;
            fnGetMenuAccess(jsMenu);
            fnCreateQuickLinks();
            fnEncodingUrl();
            fnHrmsEncodngURL();
            fnGetKRAAccess();
            fnGetCRMAccess();
            fnGetGrievanceAccess();
            fnShowNoticeTicker();         
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnShowNoticeTicker() {
    $.ajax({
        url: '/Home/GetUnreadNotification/',
        type: "POST",
        data: "",
        success: function (result) {
            if (result != "NO") {
                $('#dvTicker').html("<marquee scrollamount='1' style='padding-top: 9px; cursor: pointer;'>" + result + "</marquee>");
                $('marquee').marquee().mouseover(function () {
                    $(this).trigger('stop');
                }).mouseout(function () {
                    $(this).trigger('start');
                });
            }
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

var menuContent = "";
function fnGetMenuAccess(jsData) {
    menuContent = '<div id="main-nav" ><ul id="marketing-nav">';
    var parentJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_ParentId=='' | @.Menu_ParentId==null | @.Menu_ParentId=='NULL')]");
    for (var a = 0; a < parentJson.length; a++) {
        menuContent += '<li class="" style="background-color: transparent;">';
        menuContent += '<a href="#" class="toplevel">' + parentJson[a].Menu_Text + '</a>';
        menuContent += '<div class="pullquote" style="z-index: 511;">';
        menuContent += '<p>' + parentJson[a].Description + '</p>';
        menuContent += '</div>';

        var levelOneJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + parentJson[a].Menu_Id + "')]");
        if (levelOneJson != false && levelOneJson !== undefined && levelOneJson.length > 0) {
            fnLevelOneMenu(levelOneJson, parentJson[a].Menu_Id);
        }

        menuContent += '<span class="navCloser"></span>';
        menuContent += '</li>';
    }
    menuContent += '</ul></div>';

    //menuContent = "<ul id='css3menu1' class='topmenu' style='width: 100%;'>";
    //var parentJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Menu_ParentId=='' | @.Menu_ParentId==null | @.Menu_ParentId=='NULL')]");
    //for (var a = 0; a < parentJson.length; a++) {
    //    var disJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + parentJson[a].Menu_Id + "')]");
    //    menuContent += "<li class='topmenu'><a href='javascript:;'><span><img class='" + parentJson[a].Menu_Text.toUpperCase().split(' ')[0] + " MENU'>" + parentJson[a].Menu_Text + "</span></a>";
    //    if (disJson != false) {
    //        if (disJson.length > 0) {
    //            menuContent += "<div class='submenu'><div class='column' style='width: 100%'><ul>";
    //            fnSubMenu(jsData, parentJson[a].Menu_Id);
    //            menuContent += "</ul></div></div>";
    //        }
    //    }
    //    menuContent += "</li>";
    //}
    //menuContent += "<li style='margin-right: 20px;'>";
    //menuContent += "<div id='dvScroll' onclick='fnHideMenu();' class='dvScrollUp' style='cursor: pointer; float:left;'>";
    //menuContent += "</div>";
    //menuContent += "<div id='dvLogOut' onclick='fnLogOut();' style='cursor: pointer;float:left;'>";
    //menuContent += "</div>";
    //menuContent += "</li>";
    //menuContent += "</ul>"; 

    menuContent += "<div style='float:right;cursor:pointer;width:100%;margin-top:8px;' onclick='fnLoadMenu()'><img src='../Images/Tablet_Menu.png' style='padding-right:5px;float:right' /></div>";

    $("#menu1").html(menuContent);
    menu = menuContent.replace(/id="main-nav"/g, "");
    menu = menu.replace(/id="marketing-nav"/g, "");


    $("#menu1").html(menuContent);
}

function fnLevelOneMenu(levelOneJson, parentOne) {
    var lstClass = "";
    var method = "";
    menuContent += '<ul id="mnucont">';
    for (var b = 0; b < levelOneJson.length; b++) {
        var levelTwoJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + levelOneJson[b].Menu_Id + "')]");
        if (levelTwoJson != false && levelTwoJson !== undefined && levelTwoJson.length > 0) {
            lstClass = "has-children";
            method = "";
        }
        else {
            lstClass = "";
            method = "onclick='fnLoadBody(\"" + levelOneJson[b].Menu_URL + "\",this,\"" + levelOneJson[b].Menu_Id + "\");'";
        }
        menuContent += '<li class="' + lstClass + '" style="background-color: transparent;">';
        menuContent += "<a href='#' " + method + ">" + levelOneJson[b].Menu_Text + "</a>";
        menuContent += '<div class="pullquote">';
        menuContent += '<p>' + levelOneJson[b].Description + '</p>';
        menuContent += '</div>';

        if (levelTwoJson != false && levelTwoJson !== undefined && levelTwoJson.length > 0) {

            // to get splicolumn class
            var splitClass = "";
            for (var c = 0; c < levelTwoJson.length; c++) {
                var levelThreeJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + levelTwoJson[c].Menu_Id + "')]");
                if (levelThreeJson != false && levelThreeJson !== undefined && levelThreeJson.length > 0) {
                    splitClass = "splitColumn";
                    break;
                }
            }

            fnLevelTwoMenu(levelTwoJson, levelOneJson[b].Menu_Id, splitClass);
        }
        menuContent += '</li>';
    }
    menuContent += '</ul>';
}

function fnLevelTwoMenu(levelTwoJson, parentTwo, splitClass) {
    var lstClass = "";
    var method = "";

    menuContent += '<ul class="' + splitClass + '">';
    for (var d = 0; d < levelTwoJson.length; d++) {
        var levelThreeJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + levelTwoJson[d].Menu_Id + "')]");
        if (levelThreeJson != false && levelThreeJson !== undefined && levelThreeJson.length > 0) {
            lstClass = "has-children";
            method = "";
        }
        else {
            lstClass = "";
            method = "onclick='fnLoadBody(\"" + levelTwoJson[d].Menu_URL + "\",this,\"" + levelTwoJson[d].Menu_Id + "\");'";
        }
        menuContent += '<li class="' + lstClass + '" style="background-color: transparent;">';
        menuContent += "<a href='#' " + method + ">" + levelTwoJson[d].Menu_Text + "</a>";
        menuContent += '<div class="pullquote">';
        menuContent += '<p>' + levelTwoJson[d].Description + '</p>';
        menuContent += '</div>';

        if (levelThreeJson != false && levelThreeJson !== undefined && levelThreeJson.length > 0) {
            fnLevelTwoMenu(levelThreeJson, levelTwoJson[d].Menu_Id, '');
        }
        menuContent += '</li>';
    }
    menuContent += '</ul>';
}




function fnSubMenu(jsonData, parentId) {
    var dJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + parentId + "')]");
    if (dJson != false) {
        for (var j = 0; j < dJson.length; j++) {
            var dsJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + dJson[j].Menu_Id + "')]");
            menuContent += "<li >";
            if (dsJson != false) {
                if (dsJson.length > 0) {
                    menuContent += "<a href='#'><span>" + dJson[j].Menu_Text + "</span></a>";
                }
            }
            else {
                menuContent += "<a href='#' onclick='fnLoadBody(\"" + dJson[j].Menu_URL + "\",this,\"" + dJson[j].Menu_Id + "\");'>" + dJson[j].Menu_Text + "</a>";
            }
            if (dsJson != false) {
                if (dsJson.length > 0) {
                    menuContent += "<div class='submenu'><div class='column' style='width: 100%'><ul>";
                    fnSubMenu(jsonData, dJson[j].Menu_Id);
                    menuContent += "</ul></div></div>";
                }
            }
            menuContent += "</li>";
        }
    }
}


//function fnGetMenuAccess(jsData) {
//    //  $("#dvLoading").show();
//    menuContent = "<ul id='marketing-nav' style='width: 100%;'>";
//    var parentJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Menu_ParentId=='' | @.Menu_ParentId==null | @.Menu_ParentId=='NULL')]");
//    for (var a = 0; a < parentJson.length; a++) {
//        var disJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + parentJson[a].Menu_Id + "')]");
//        menuContent += "<li style='background-color: transparent;' ><a href='javascript:;' class='toplevel'>" + parentJson[a].Menu_Text + "</a>";
//        if (disJson != false) {
//            if (disJson.length > 0) {
//                menuContent += "<div class='pullquote'><p>" + parentJson[a].Menu_Text + "</p><ul>";
//                fnSubMenu(jsData, parentJson[a].Menu_Id);
//                menuContent += "</ul></div>";
//            }
//        }
//        menuContent += "</li>";
//    }
//    //menuContent += "<li style='margin-right: 20px;'>";
//    //menuContent += "<div id='dvScroll' onclick='fnHideMenu();' class='dvScrollUp' style='cursor: pointer'>";
//    //menuContent += "</div>";
//    //menuContent += "</li>";
//    menuContent += "</ul>";
//    $("#main-nav").html(menuContent);
//}

//function fnSubMenu(jsonData, parentId) {
//    var dJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + parentId + "')]");
//    if (dJson != false) {
//        for (var j = 0; j < dJson.length; j++) {
//            var dsJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.Menu_ParentId=='" + dJson[j].Menu_Id + "')]");
//            menuContent += "<li style='background-color: transparent;'>";
//            if (dsJson != false) {
//                if (dsJson.length > 0) {
//                    menuContent += "<a href='#'>" + dJson[j].Menu_Text + "</a>";
//                }
//            }
//            else {
//                menuContent += "<a href='#' onclick='fnLoadBody(\"" + dJson[j].Menu_URL + "\",this,\"" + dJson[j].Menu_Id + "\");'>" + dJson[j].Menu_Text + "</a>";
//            }
//            if (dsJson != false) {
//                if (dsJson.length > 0) {
//                    menuContent += "<div class='pullquote'><p>" + dJson[j].Menu_Text + "</p><ul>";
//                    fnSubMenu(jsonData, dJson[j].Menu_Id);
//                    menuContent += "</ul></div>";
//                }
//            }
//            menuContent += "</li>";
//        }
//    }
//}


function fnHideMenu() {
    $("#dvTopHeader").slideToggle("slow", function () {
        if ($('#dvScroll').hasClass("dvScrollUp")) {
            $('#dvScroll').removeClass("dvScrollUp");
            $('#dvScroll').addClass("dvScrollDown");
        }
        else {
            $('#dvScroll').removeClass("dvScrollDown");
            $('#dvScroll').addClass("dvScrollUp");
        }
    });
}


function fnCreateQuickLinks() {
    debugger
    var content = "";
    content += "<div  class='dvQuickImgs'>";
    if (menuContent_g != '') {
        //DCR 
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/DCRCalendar/Index')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/DCRCalendar/Index\",\"Enter DCR\");'>";
            content += "<img style='width:24px;cursor:pointer;' src='../Images/DCREntry.png' title='Enter DCR' /> </div>";
        }

        //Doctor Master
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/DoctorMaster/SingleAdd/HD_Doctor')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Master/DoctorMaster/SingleAdd/HD_Doctor\",\"View/Update My Doctor List\");'>";
            content += " <img  style='width:24px;cursor:pointer;'  src='../Images/Doctor_List.png' title='View/Update My Doctor List' /> </div>";
        }

        //Print Expense Report
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='~/ScreensReport/ExpenseDailyMonthlyTabular.aspx')]");
        if (disDCRJson != false) {
            content += " <div class='quickLinks' onclick='fnLoadBody(\"" + disDCRJson[0].Menu_URL + "\",\"\",\"" + disDCRJson[0].Menu_Id + "\");'>";
            content += " <img style='width:24px;cursor:pointer;'  src='../Images/icon_print.png' title='Print Expense Report' /> </div>";
        }

        //CP
        var priValue = fnGetPrivilegeValue("CAMPAIGN_PLANNER", "");
        if (priValue.toUpperCase() != "NO") {
            var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/CampaignPlanner/Index')]");
            if (disDCRJson != false) {
                content += " <div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/CampaignPlanner/Index\",\"Campaign Planner\");'>";
                content += " <img style='width:24px;cursor:pointer;'  src='../Images/CP.png' title='Create CP' /> </div>";
            }
        }

        //Tour Planner
        var priValue = fnGetPrivilegeValue("TOUR_PLANNER", "");
        if (priValue.toUpperCase() != "NO") {
            var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/TourPlanner/Index')]");
            if (disDCRJson != false) {
                content += "<div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/TourPlanner/Index\",\"Tour Planner\");'>";
                content += "<img style='width:24px;cursor:pointer;'  src='../Images/TP.png'  title='Create TP'/></div>";
            }
        }

        //Inward Master
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Inward/Create')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Master/Inward/Create\",\"Update Input Inward\");'>";
            content += " <img style='width:24px;cursor:pointer;'  src='../Images/input.png'  title='Update Input Inward'/> </div>";
        }

        //DCR Approval
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Approval/DCRApproval')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Master/Approval/DCRApproval\",\"DCR Approval\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/DCR_approval.png' title='Click here to approve DCRs' /></div>";
        }

        //CP Approval
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/Approval/CPApproval')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadQuickLinkPage(\"HiDoctor_Master/Approval/CPApproval\",\"CP Approval\");'>";
            content += " <img style='width:24px;cursor:pointer;'  src='../Images/cp_approval.png' title='Click here to approve CPs' /> </div>";
        }

        //Tour Planner Approval
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/TourPlanner/TPApproval')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks'  onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/TourPlanner/TPApproval\",\"Tour Planner Approval\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/tp approval.png' title='Click here to approve TPs' /></div>";
        }

        //Doctor Approval
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='~/ScreensApproval/DoctorApproval.aspx')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadBody(\"" + disDCRJson[0].Menu_URL + "\",\"\",\"" + disDCRJson[0].Menu_Id + "\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/doctor_approval.png' title='Click here to approve Doctors' /></div>";
        }

        //SFC Approval
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='~/ScreensApproval/SFCApproval.aspx')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks' onclick='fnLoadBody(\"" + disDCRJson[0].Menu_URL + "\",\"\",\"" + disDCRJson[0].Menu_Id + "\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/Road.png' title='Click here to approve SFCs' /></div>";
        }

        //Secondary Sales
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/SecondarySales/Create')]");
        var disDCRJson1 = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Activity/SecondarySales/SecondarySalesEntryRevamp')]");
        if (disDCRJson != false && disDCRJson1 != false) {
            content += "<div class='quickLinks'  onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/SecondarySales/SecondarySalesEntryRevamp\",\"Secondary Sales\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/SecondarySales.png' title='Click here to view Secondary Sales' /></div>";
        }
        else if (disDCRJson != false) {
            content += "<div class='quickLinks'  onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/SecondarySales/Create\",\"Secondary Sales\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/SecondarySales.png' title='Click here to view Secondary Sales' /></div>";
        }
        else if (disDCRJson1 != false) {
            content += "<div class='quickLinks'  onclick='fnLoadQuickLinkPage(\"HiDoctor_Activity/SecondarySales/SecondarySalesEntryRevamp\",\"Secondary Sales\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/SecondarySales.png' title='Click here to view Secondary Sales' /></div>";
        }
        //Reports New
        var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='Menu/NewReportMenu')]");
        if (disDCRJson != false) {
            content += "<div class='quickLinks'  onclick='fnLoadQuickLinkPage(\"Menu/NewReportMenu\",\"NG Report\");'>";
            content += "<img style='width:24px;cursor:pointer;'  src='../Images/Report.png' title='Click here to view Reports' /></div>";
        }

        //Grievance
        var grievurl = $.grep(menuContent_g.Tables[0].Rows, function (ele, index) {
            return ele.Menu_URL == "http://localhost:64700/Home/landing" || ele.Menu_URL == "http://grievance-uat.hidoctor.me/Home/landing" || ele.Menu_URL == "http://Grievance-hd.hidoctor.me/Home/landing";
        })
        
        if (grievurl.length > 0) {
            content += "<div class='quickLinks'  onclick='fnLoadGrievance(\"" + grievurl[0].Menu_URL + "\");'>";
            content += "<img style='width:24px;cursor:pointer;' src='../Images/2473images.png'  title='Click here to open 24*7 Problem Solver' /></div>";
        }

        // ----------- payroll integration -----------------//
        $.ajax({
            url: '/Home/IsPayrollEnabled/',
            type: "POST",
            data: "A",
            success: function (result) {
                if (result != 'E') {
                    content += "<div class='quickLinks'  onclick='fnOpenPayrollUrl();'>";
                    content += "<img style='width:24px;cursor:pointer;'  src='../Images/LeaveActivity24x24.png' title='Leave Activities' /></div>";
                }
            },
            error: function () {
                $("#dvAjaxLoad").hide();
            },
            complete: function () {
                content += "</div>";
                $("#dvQuickLinks").html(content);
            }
        });

    }
}
var prres = "";
function fnOpenPayrollUrl() {
    $.ajax({
        url: '/Home/GetPayrollDetails/',
        type: "POST",
        data: "A",
        success: function (jsonResult) {
            if (jsonResult[0].API_Status == 'EX') {
                var errorWindow = window.open();
                errorWindow.document.write("<span style='font-size:20px;'>" + jsonResult[0].message + "</span>");
            }
            else {
                if (jsonResult[0].API_Status != 'E') {
                    if (jsonResult[0].API_Status == "S") {
                        // window.location.href = "https://" + jsonResult[0].domainName + "/rest/authenticate.ftl?guid=" + jsonResult[0].guid;
                        window.open("https://" + jsonResult[0].domainName + "/rest/authenticate.ftl?guid=" + jsonResult[0].guid);
                    }
                    else {
                        var errorWindow = window.open();
                        //  errorWindow.document.write("<span style='font-size:20px;'>Access denied.Please contact your administrator</span>");
                        errorWindow.document.write("<span style='font-size:20px;'>Message from Grey Tip: " + jsonResult[0].message + "</span>");
                    }
                }
                else {
                    var errorWindow = window.open();
                    errorWindow.document.write("<span style='font-size:20px;'>Message from Grey Tip: " + jsonResult[0].message + "</span>");
                }
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        },
        complete: function () {
        }
    });

    // window.open(url);
}
function fnLoadQuickLinkPage(pageName, title) {
    $("#page-header").show();
    $("#divPageHeader").html(title);

    $("#main").load(pageName);
}
function fnLoadGrievance(url) {
    debugger
    var newUrl = url + '?GRISSID=' + GrievanceEncodingURL;
    window.open(newUrl, "_blank");
}

function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId) {
    $('#dvPrint').remove();
    $(".TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

//Function to check decimal

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

function fnCheckIsEDAvailable() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '/WideAngle/IsEDMenuAvaailable/',
        type: "POST",
        data: "A",
        success: function (isWDAvailable) {
            if (isWDAvailable == "Y") {
                $('#aWA').show();
                $("#imgWideAngle").show();
                $("#spnline").show();
            }
            else {
                $('#aWA').hide();
                $("#imgWideAngle").hide();
                $("#spnline").hide();
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}



(function ($) {
    $.modalWithoutHeader = function (config) {

        var defaults, options, modal, header, content, footer, close, overlay, width, centerOffset;

        defaults = {
            title: ''
			, byline: ''

			, ajax: ''
			, div: ''

			, slide: false
			, slideEl: '.slide'

			, btnClass: 'btn small secondary'

			, overlay: true
			, overlayClose: true

			, beforeOpen: function () { }
			, afterOpen: function () { }

			, debug: false
        };

        options = $.extend(defaults, config);

        $.modal.forceClose();

        modal = $('<div>', { 'id': 'modal' });
        //  header = $('<div>', { 'id': 'modal_header' });
        content = $('<div>', { 'id': 'modal_content' });
        overlay = $('<div>', { 'id': 'modal_overlay' });
        close = $('<div>', { 'id': 'modal_close', 'html': 'x' });

        // header.appendTo(modal);
        content.appendTo(modal);
        close.appendTo(modal);

        options.beforeOpen(modal);

        modal.appendTo('body').hide().fadeIn(500);

        if (options.overlay) {
            overlay.appendTo('body');
        }

        if (options.overlayClose) {
            overlay.bind('click', function (e) { $.modal.close(); });
        }

        close.bind('click', function (e) { $.modal.close(); });

        // (options.title !== '') ? header.append('<h3>' + options.title + '</h3>') : '';
        (options.byline !== '') ? header.append('<div class="byline">' + options.byline + '</div>') : '';

        if (options.ajax !== '') {
            content.html('<div id="modal_loader"><img src="../Content/images/mba/ajax-loader.gif" /></div>');
            $.modal.reposition();
            $.get(options.ajax, function (response) {
                content.html(response);
                handleContent();
            });
        }

        if (options.div !== '') {
            content.html($(options.div).html());
            handleContent();
        }

        function handleContent() {
            $.modal.reposition();
            if (options.slide) { handleSlides(); }

            setTimeout(function () {
                options.afterOpen(modal);
            }, 1000);
        }

        function handleSlides() {
            var slides = modal.find(options.slideEl);
            slides.hide().eq(0).show().addClass('current_slide');
            var footer = $('<div>', { id: 'modal_footer' }).appendTo(modal);
            var prev = $('<button>', { id: 'prev', html: '<u>P</u>revious' }).addClass(options.btnClass).appendTo(footer);
            var display = $('<span>', { id: 'display' }).appendTo(footer);
            var next = $('<button>', { id: 'next', html: '<u>N</u>ext' }).addClass(options.btnClass).appendTo(footer);
            display.html('<span class="current_page">1</span> of ' + slides.length);
            prev.attr('disabled', 'disabled');

            $(document).bind('keyup.modal', function (e) {
                if (e.keyCode == 78 || e.keyCode == 39) { navigateSlides('forward', slides); }
                if (e.keyCode == 80 || e.keyCode == 37) { navigateSlides('backward', slides); }
            });

            footer.find('button').bind('click', function (e) {
                var direction = ($(this).is('#next')) ? 'forward' : 'backward';
                navigateSlides(direction, slides);
            });

        }

        function navigateSlides(direction, slides) {
            var currentSlide, nextSlide, next, prev;
            next = $('#next');
            prev = $('#prev');
            currentSlide = content.find('.current_slide');
            nextSlide = (direction == 'forward') ? currentSlide.next(options.slideEl) : currentSlide.prev(options.slideEl);

            if (nextSlide.length > 0) {
                nextSlide.addClass('current_slide').show().siblings(options.slideEl).hide().removeClass('current_slide');
                $('#display .current_page').text(nextSlide.index() + 1);

                (nextSlide.index() === 0) ? prev.attr('disabled', 'disabled') : prev.removeAttr('disabled');
                (nextSlide.index() === slides.length - 1) ? next.attr('disabled', 'disabled') : next.removeAttr('disabled');

                var contentWidth = nextSlide.outerWidth();
                content.width(contentWidth + 30);
                //$.modal.reposition ();	
            }
        }

        $(document).bind('keyup.modal', function (e) {
            if (e.keyCode == 27) { $.modal.close(); }
        });

    };

    $.modal.reposition = function () {
        var width = $('#modal').outerWidth();
        var centerOffset = width / 2;
        var pageScroll = getPageScroll();
        $('#modal').css({ 'left': '50%', 'top': pageScroll[1] + 100, 'margin-left': '-' + centerOffset + 'px' });
    };

    $.modal.close = function () {
        $('#modal').fadeOut('medium', function () { $(this).remove(); });
        $('#modal_overlay').fadeOut('medium', function () { $(this).remove(); });
        $(document).unbind('keyup.modal');
    };

    $.modal.forceClose = function () {
        $('#modal').remove();
        $('#modal_overlay').remove();
        $(document).unbind('keyup.modal');
    };

    $.modal.setTitle = function (title) {
        var h3 = $('#modal_header').find('h3');
        if (h3.length > 0) {
            h3.html(title);
        } else {
            $('<h3>', { html: title }).prependTo('#modal_header');
        }
    };

    $.modal.setByline = function (text) {
        var el = $('#modal_header').find('.byline');
        if (el.length > 0) {
            el.html(text);
        } else {
            $('<div>', { 'class': 'byline', html: text }).appendTo('#modal_header');
        }
    };

    // getPageScroll() by quirksmode.com
    function getPageScroll() {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }
        return new Array(xScroll, yScroll);
    }
})(jQuery);

// For Help Description
function fnHelp(pageId, ControlId) {
    var w = 600;
    var h = 500;
    window.open('Home/Help/?pageId=' + pageId + '&controlId=' + ControlId + '', 'Popup', 'toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + w + ',height=' + h + ',top=200,left=350');
}
function fnInsertHelpDescrip() {
    var pageId = $("#hdnPageId").val();
    var controlId = $("#hdnControlId").val();
    var helpDescrip = $("#txtAreaHelpDescrip").val();

    helpDescrip = helpDescrip.replace(/>/g, "grt")
    helpDescrip = helpDescrip.replace(/</g, "lst")
    helpDescrip = helpDescrip.replace(/&/g, "~")


    $.ajax({
        type: "POST",
        url: '../InsertHelpItems',
        data: "PageId=" + pageId + "&ControlId=" + controlId + "&HelpDescrip=" + helpDescrip + "",
        success: function (jsData) {
            if (jsData == "Y") {
                fnMsgAlert('success', 'Success', 'Help description saved successfully');
                $("#txtAreaHelpDescrip").val('');
                fnGetHelpItem();
            }
            else {
                fnMsgAlert('info', 'Caution', jsData);
            }
        },
        error: function (jsData) {
            fnMsgAlert('info', 'Caution', jsData.toString());
        },
        complete: function (jsData) {

        }

    });

}

function fnGetHelpItem() {
    var pageId = $("#hdnPageId").val();
    var controlId = $("#hdnControlId").val();

    $.ajax({
        type: "POST",
        url: '../GetHelpItems',
        data: "PageId=" + pageId + "&ControlId=" + controlId + "",
        success: function (jsData) {
            if (jsData != null && jsData != "") {

                var response = jQuery.parseJSON(jsData);
                if (typeof response == 'object') {
                    jsData = eval('(' + jsData + ')');
                    if (jsData.Tables[0].Rows.length > 0) {
                        $("#dvHelpText").html(jsData.Tables[0].Rows[0].HelpItemDescription);
                    }
                    else {
                        $("#dvHelpText").html(" -- No help description found -- ");
                    }
                }
                else {
                    $("#dvHelpText").html(response);
                }
            }
        },
        error: function (jsData) {
            fnMsgAlert('info', 'Caution', jsData.toString());
        },
        complete: function (jsData) {
        }
    });
}

// Get Month val();
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN" || monthName.toUpperCase() == "JANUARY") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB" || monthName.toUpperCase() == "FEBRUARY") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR" || monthName.toUpperCase() == "MARCH") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR" || monthName.toUpperCase() == "APRIL") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN" || monthName.toUpperCase() == "JUNE") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL" || monthName.toUpperCase() == "JULY") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG" || monthName.toUpperCase() == "AUGUST") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP" || monthName.toUpperCase() == "SEPTEMBER") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT" || monthName.toUpperCase() == "OCTOBER") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV" || monthName.toUpperCase() == "NOVEMBER") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC" || monthName.toUpperCase() == "DECEMBER") {
        return 12;
    }
}

//data type validations
function fnCheckBigInt(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            if (parseInt($(id).val()) > 9223372036854775807 || parseInt($(id).val()) < -9223372036854775808) {
                fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                $(id).val('');
                fnErrorIndicator(id);
                return false;
            }
            else {
                fnRemoveErrorIndicatior(id);
                return true;
            }
        }
    }
    return true;
}

function fnCheckInt(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            if (parseInt($(id).val()) > 2147483647 || parseInt($(id).val()) < -2147483648) {
                fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                $(id).val('');
                fnErrorIndicator(id);
                return false;
            }
            else {
                fnRemoveErrorIndicatior(id);
                return true;
            }
        }
    }
    return true;
}

function fnCheckSmallInt(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            if (parseInt($(id).val()) > 32767 || parseInt($(id).val()) < -32768) {
                fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                $(id).val('');
                fnErrorIndicator(id);
                return false;
            }
            else {
                fnRemoveErrorIndicatior(id);
                return true;
            }
        }
    }
    return true;
}

function fnCheckNumericWithPrecScale(id, prec, scal) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {
            if ($.trim($(id).val().split('.')[0]).length > (parseInt(prec) - parseInt(scal))) {
                fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                $(id).val('');
                fnErrorIndicator(id);
                return false;
            }
            else {
                fnRemoveErrorIndicatior(id);
                return true;
            }
        }
    }
    return true;
}

function fnCheckMaxLimit(obj, dataType) {

    if (obj != null && obj != undefined) {
        var enteredValue = $.trim($(obj).val());
        if (!isNaN(enteredValue)) {
            if (dataType.toUpperCase() == "INT") {
                if (enteredValue > 2147483647 || enteredValue < -2147483648) {
                    fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                    return false;
                }
            }
            else if (dataType.toUpperCase() == "BIGINT") {
                if (enteredValue > 9223372036854775807 || enteredValue < -9223372036854775808) {
                    fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                    return false;
                }
            }
            else if (dataType.toUpperCase() == "SMALLINT") {
                if (enteredValue > 32767 || enteredValue < -32768) {
                    fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                    return false;
                }
            }
            else if (dataType.toUpperCase() == "FLOAT") {
                if (enteredValue > 9223372036854775807 || enteredValue < -9223372036854775808) {
                    fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                    return false;
                }
            }
            else if (dataType.toUpperCase() == "NUMERIC") {
                if (enteredValue > 9223372036854775807 || enteredValue < -9223372036854775808) {
                    fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                    return false;
                }
            }
            else if (dataType.toUpperCase() == "DECIMAL") {
                if (enteredValue > 9223372036854775807 || enteredValue < -9223372036854775808) {
                    fnMsgAlert('info', 'Information', 'Entered value exceeds the maximum limit.');
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            fnMsgAlert('info', 'Information', 'Please enter numbers alone');
            return false;
        }
    }
    return true;
}


// input formate ('dd/MM/yyyy')
function fnValidateDateFormate(id, text) {
    if ($.trim($(id).val()).length > 0) {
        var date = $(id).val();
        if (date.split('/').length == 3) {
            var day = date.split('/')[0];
            var month = date.split('/')[1];
            var year = date.split('/')[2];
            if (day.length == 2 && month.length == 2 && year.length == 4) {

                var dateObj = new Date(year + '-' + month + '-' + day);
                if (dateObj == "Invalid Date") {
                    fnMsgAlert('info', 'Information', 'Please Enter valid date in ' + text + '.');
                    $(id).val('');
                    return false;
                }

                var dayI = parseInt(day, 10);
                var monthI = parseInt(month, 10);
                var yearI = parseInt(year);

                if (dayI == 0 || monthI == 0 || yearI == 0) {
                    fnMsgAlert('info', 'Information', 'Please Enter valid date in ' + text + '.');
                    $(id).val('');
                    return false;
                }
                if (dayI > 31 || monthI > 12) {
                    fnMsgAlert('info', 'Information', 'Please Enter valid date in ' + text + '.');
                    $(id).val('');
                    return false;
                }

                if ((monthI == 4 || monthI == 6 || monthI == 9 || monthI == 11) && dayI == 31) {
                    fnMsgAlert('info', 'Info', 'Please enter valid date in ' + text + '.');
                    $(id).val('');
                    return false;
                }
                if (monthI == 2) {
                    var isleap = (yearI % 4 == 0 && (yearI % 100 != 0 || yearI % 400 == 0));
                    if (dayI > 29 || (dayI == 29 && !isleap)) {
                        fnMsgAlert('info', 'Info', 'Please enter valid date in ' + text + '.');
                        $(id).val('');
                        return false;
                    }
                }

                // date range check
                var sqlDateObj = new Date('1753-01-01');
                if (dateObj < sqlDateObj) {
                    fnMsgAlert('info', 'Info', 'Please enter date above 01/01/1753 in ' + text + '.');
                    $(id).val('');
                    return false;
                }

            }
            else {
                fnMsgAlert('info', 'Information', 'Please Enter valid date format(dd/MM/yyyy) in ' + text + '.');
                $(id).val('');
                return false;
            }
        }
        else {
            fnMsgAlert('info', 'Information', 'Please Enter valid date format(dd/MM/yyyy) in ' + text + '.');
            $(id).val('');
            return false;
        }
    }
    return true;
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


function fnOpenTree() {
    $("#dvregionTree").slideDown();

    $('#dvTree').addClass('col-lg-3')
    $('#dvdata').removeClass('col-lg-12')
    $('#dvdata').addClass('col-lg-9')
}
function fnCloseTree() {
    $("#dvregionTree").slideUp();

    $('#dvTree').removeClass('col-lg-3')
    $('#dvdata').addClass('col-lg-12')
    $('#dvdata').removeClass('col-lg-9')
}

function fnToggleInputs() {
    if ($("#rptInputs").hasClass('col-lg-11')) {
        $("#rptInputs").hide();
        $("#rptInputs").removeClass('col-lg-11')
    }
    else {
        $("#rptInputs").show();
        $("#rptInputs").addClass('col-lg-11');
    }
}

function fnToggleTree() {
    if ($('#dvTree').hasClass('col-lg-3')) {
        fnCloseTree();
    }
    else {
        fnOpenTree();
    }
}

//Allowing Alphanumeric and Underscore
function regExforAllowingUnderscore(value) {
    var specialcharregwithUnderscore = new RegExp("^[a-zA-Z0-9_]+$");
    //var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
    // var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
    if (!specialcharregwithUnderscore.test(value)) {
        return false;
    }
    else {
        return true;
    }
}


function fnGetSelectedActivityFullName(activityShortName, rcpaflag) {
    if (activityShortName.toUpperCase() == "F") {
        if (rcpaflag.toUpperCase() == "R" || rcpaflag.toUpperCase() == "Y") {
            return "Field-RCPA";
        }
        else {
            return "Field";
        }
    }
    else if (activityShortName.toUpperCase() == "A") {
        return "Attendance";
    }
    else if (activityShortName.toUpperCase() == "L") {
        return "Leave";
    }

}
function fnIsOneLibAvailable() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '/OneLib/IsOneLibAvailable/',
        type: "POST",
        data: "A",
        success: function (isWLAvailable) {
            if (isWLAvailable == "1") {
                $("#aOneLib").show();
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

// DCR Doctor Name.
function CheckDCRSpecialCharacterGroup0(inputObject) {
    var DCRGROUP0CHARS = new RegExp("^[-a-zA-Z0-9 .]+$");
    if ($.trim($(inputObject).val()).length > 0) {
        if (!DCRGROUP0CHARS.test($(inputObject).val())) {
            return false;
        }
        return true;
    }
    return false;
}

// DCR Flexi TextBoxes Eg: CP, SFC, Chemist, Competitor Product.
function CheckDCRSpecialCharacterGroup1(inputObject) {
    var DCRGROUP1CHARS = new RegExp("^[-a-zA-Z0-9 _().]+$");
    if ($.trim($(inputObject).val()).length > 0) {
        if (!DCRGROUP1CHARS.test($(inputObject).val())) {
            return false;
        }
        return true;
    }
    else {
        return false;
    }
}

function fnGetGrievanceAccess() {
    debugger
    $.ajax({
        url: '/OneLib/GetGrievanceURL/',
        type: "POST",
        data: "A",
        success: function (GrievanceURL) {
            if (GrievanceURL != null && GrievanceURL != "" && GrievanceURL.length > 0) {
                //window.open(kraURL, '_blank');
                GrievanceEncodingURL = GrievanceURL;
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Grievance', e.responseText);
        }
    });
}

// DCR 3 screens Remarks.
function CheckDCRSpecialCharacterGroup2(inputObject) {
    if ($.trim($(inputObject).val()).length > 0) {
        var DCRGROUP2CHARS = new RegExp("^[-a-zA-Z0-9 _().,]+$");
        if (!DCRGROUP2CHARS.test($(inputObject).val())) {
            return false;
        }
        return true;
    }
    else {
        return true;
    }
}

// DCR Time Pickers : and Space only allowed.
function CheckDCRSpecialCharacterGroup3(inputObject) {
    if ($.trim($(inputObject).val()).length > 0) {
        var DCRGROUP3CHARS = new RegExp("^[0-9 :]+$");
        if (!DCRGROUP2CHARS.test($(inputObject).val())) {
            return false;
        }
        return true;
    }
    else {
        return true;
    }
}
Array.prototype.clear = function () {
    while (this.length) {
        this.pop();
    }
};