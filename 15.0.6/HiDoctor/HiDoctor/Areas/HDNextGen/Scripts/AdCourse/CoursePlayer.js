var firstPlay = true;
var Player = function (options) {
    this.options = options;
    this.selectedAsset = null;
    this.selectedAssetStartTime = null;
    this.onSlideChange = options.onSlideChange;
};

Player.prototype.init = function () {
    this.hide();
    var html = $('<div class="container player_container">');
    //html += this.createPanel();
    //html += this.createTray();
    //html += '</div>';
    html.append(this.createPanel());
    html.append(this.createTray());
    window.scrollTo(0, 0);
    $('body').append(html);
    this.createFrame(this.options.assets[0]);
    this.actions();
};
Player.prototype.createPanel = function () {
    var html = '<div class="panel">';
    //html += '<ul class="tabs-nav"><li class="brand-logo"><img height="50px" alt="" src=""></li></ul>';
    html += '<div class="tabs-stage"><div id="tab-1" class="tabs-cont" style="display: block; min-height: 100%;">';
    html += '<iframe id="myIframe" style="background:#fff; display: none;" frameborder="0" scrolling="auto" ></iframe>';
    html += '<img id="img-viewer" alt="" height="100%" style="display: none;"/>';
    html += '<video autoplay ' +
        'controls="" id="video" tabindex="0" style="display:none; width: 100%;" preload="true">' +
        //'<source type="video/mp4" id="vdo" /><source type="video/x-ms-wmv" id="vdomwv" />' +
        '<p>Your user agent does not support the HTML5 Video element.</p>' +
        '</video>';
    html += '<object type="application/x-shockwave-flash" id="objSwf" style="width: 100%; ">' +
        '<param name="allowfullscreen" value="true">' +
        '<param name="allowscriptaccess" value="always">' +
        '</object>';
    html += '</div><div id="tab-2" class="tabs-cont" style="display: none;">' +
        '</div></div>';
    html += '</div>';
    return html;
};
Player.prototype.createTray = function () {
    var $tray = $('<div class="tray">');
    var $assetAction = $('<div class="asset_action">');
    $assetAction.append('<div id="player_back" title="Back" onclick="return false"></div>');
    var $assetSlider = $('<div class="asset_slider">');
    var $itemDiv = $('<ul class="item_div">');
    var assets = this.options.assets;
    for (var i = 0; i <= assets.length - 1; i++) {
        var $item = $('<li class="item' + (i==0?' active':'') + '" id="' + assets[i].DA_Code + '" onclick="return false"><img class="asset_thumb" src="' + assets[i].DA_Thumbnail_URL + '" /><p class="item-description" style="margin: 0px; font-size: 11px; width: 60px; text-overflow: ellipsis; overflow: hidden;">' + assets[i].Asset_Name + '</p></li>');
        $item.data('asset', assets[i]);
        $itemDiv.append($item);
    }
    $assetSlider.append($itemDiv);
    $tray.append($assetAction);
    $tray.append($assetSlider);
    //$tray.append('<p class="copy_right"> © Powered by SwaaS - v' + '</p>');

    /*var html = '<div class="tray"><div class="asset_action"><div id="player_back" onclick="return false"></div>' +
	    '</div><div class="asset_slider"><ul class="item_div">';
    html += '<li class="item" id="' + this.options.asset.daCode + '" onclick="return false"><img class="asset_thumb" src="' + this.options.asset.thumbnailURL + '" /></li>';
    html += '</ul></div><span class="toggle-tray"></span><p class="copy_right"> © Powered by SwaaS - v' + '</p></div>';*/
    //var html = '<div class="tray"><div class="asset_action"><div id="player_back" onclick="return false"></div>' +
	//    '</div><p class="copy_right"> © Powered by SwaaS</p>';
    return $tray;
};
Player.prototype.createFrame = function (asset) {
    var _this = this;
    
    if (_this.selectedAsset != null) {
        _this.insertAnalytics();
    }

    _this.selectedAsset = asset;
    _this.selectedAssetStartTime = new Date().getTime();
    
    var ext = this.getExtension(asset);
    var hgt = $('.tabs-stage').height() - 90;
    //var hgt = $(window).height() - 131;
    $('#img-viewer, #myIframe, #video, #objSwf').hide();
    $('#video').removeAttr('src');
    //if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
    //    localStorage.setItem("mviewer", "false"); 
    //    localStorage.setItem("mObj", undefined);
    //}
    if (ext == 'pdf')
        $("#myIframe").show().attr('src', 'https://docs.google.com/viewer?url=' + asset.File_Path + '&embedded=true');
    else if (ext == 'docx' || ext == 'doc' || ext == 'ppt' || ext == 'pptx' || ext == 'xlsx' || ext == 'xls') {
        //if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        //    localStorage.setItem("mviewer", "true");
        //    localStorage.setItem("daCode", this.options.asset.daCode);
        //    localStorage.setItem("startTime", this.options.startTime);
        //}
        //$("#myIframe").show().attr('src', );
        window.open('http://view.officeapps.live.com/op/view.aspx?src=' + asset.File_Path, '_blank');
    } else if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp') {
        var img = $('<img/>');
        img.load(function () {
            //if (this.width > this.height) {
            //    $("#img-viewer").show().attr('src', _this.options.asset.onlineURL).height(hgt);
            //} else {
            //    $("#img-viewer").show().attr('src', _this.options.asset.onlineURL).width($('.tabs-stage').width());
            //}
            var imgWid = this.width,
            imgHgt = this.height;
            var tWid = $('.tabs-stage').outerWidth(),
             tHgt = $('.tabs-stage').height();
            if (imgWid < tWid) {
                $("#img-viewer").show().attr('src', asset.File_Path).width(imgWid);
                if (imgHgt > tHgt) {
                    var hgt = imgWid / imgHgt;
                    $("#img-viewer").show().attr('src', asset.File_Path).height(tHgt);
                }
            } else {
                if (imgHgt > tHgt) {
                    $("#img-viewer").show().attr('src', asset.File_Path).height(tHgt);
                    //$("#img-viewer").css('max-width', "100%");
                }
            }
        }).attr('src', asset.File_Path);
    } else if (ext == 'zip') {
        //$("#myIframe").show().attr('src', '');
        alert('This asset can only be viewed on offline mode.');
    } else if (ext == 'html') {
        //$("#myIframe").show().attr('src', '');
        alert('This asset can only be viewed on offline mode.');
    } else if (ext == 'mp4') {
        $('#video').attr('src', asset.File_Path).show();
        $('#video').attr('type', 'video/mp4');
        //$('#video #vdo').attr('src', asset.File_Path);
    } else if (ext == 'wmv') {
        $('#video').attr('src', asset.File_Path).show();
        $('#video').attr('type', 'video/x-ms-wmv');
        //$('#video #vdomwv').attr('src', asset.File_Path);
    } else if (ext == 'swf') {
        $('#objSwf').show();
        $('#objSwf').attr('data', asset.File_Path);
    }
    var hgtChkInt = setInterval(function () {
        if ($('.tabs-stage').height() == 200) {
            //alert(1);
        } else {
            var hgt = $('.tabs-stage').height() - 90;
            $('#myIframe,#objSwf').width('100%').height(hgt);
            $('#video').height(hgt);
            clearInterval(hgtChkInt);
        }
    }, 500);
    $('#myIframe,#objSwf').width('100%').height(hgt);
    $('#video').height(hgt);
};
Player.prototype.insertAnalytics = function (onSuccess) {
    var _this = this;
    if (_this.selectedAsset != null) {
        if (_this.onSlideChange) {
            _this.onSlideChange(_this);
        } else {
            var analytics = {};
            analytics.Course_ID = _this.options.course.Course_ID;
            analytics.Publish_ID = _this.options.course.Publish_ID;
            analytics.DA_Code = _this.selectedAsset.DA_Code;
            analytics.Publish_ID = _this.options.course.Publish_ID;
            analytics.Play_Time = new Date().getTime() - _this.selectedAssetStartTime;
            analytics.Offline_Play = 0;
            analytics.Online_Play = 1;
            analytics.Is_Preview = false;

            var courseViewJson = new Array();
            courseViewJson.push(analytics);
            var param = {};
            param.name = 'courseViewJson';
            param.value = courseViewJson;
            param.type = 'JSON';

            var pstAry = new Array();
            pstAry.push(param);

            DPAjax.requestInvoke('Course', 'InsertCourseViewAnalytics', pstAry, "POST", function (data) {
                if (onSuccess) onSuccess();
            }, function (e) { });
        }
    }
};
Player.prototype.actions = function () {
    var _this = this;

    //var ext = this.getExtension();
    $('#player_back').bind('click', function () {
        _this.hide();
        _this.insertAnalytics(function () {
            window.location.reload();
        });
        return false;
    });
    //$('#tab_flip').unbind('click').bind('click', function () {
    //    var actEl = $('.tabs-cont:visible'), nxtEl = $('.tabs-cont:hidden');
    //    actEl.hide();
    //    nxtEl.show();
    //});
    $('.item_div .item').unbind().bind('click', function (e) {
        $('.item').removeClass('active');
        $(this).addClass('active');
        _this.createFrame($(this).data('asset'));
    });

    $(window).on("orientationchange", function (event) {
        $("#orientation").text("This device is in " + event.orientation + " mode!");
    });

    var maxSlides = 7;
    if ($(window).width() <= 800) maxSlides = 5;
    if ($(window).width() <= 700) maxSlides = 3;
    if ($(window).width() <= 400) maxSlides = 1;
    $('.item_div').bxSlider({
        minSlides: 1,
        maxSlides: maxSlides,
        slideWidth: 65,
        slideMargin: 10,
        height: 75,
        controls: true
    });
};
Player.prototype.getExtension = function (asset) {
    //var asset = this.options.asset;
    var index = asset.File_Path.lastIndexOf(".");
    var ext = asset.File_Path.substring(index + 1);

    return ext;
};
Player.prototype.show = function () {
    /*if (firstPlay && this.options.asset.downloaded == 'Y') {
        alert("Due to privacy policy, we donot allow loading assets offline when in online mode. Anyway this asset is downloaded and can be viewed in offline mode.");
        firstPlay = false;
    }*/
    //if (!this.options.asset.onlineURL.endsWith('.zip')) {
    //    this.init();
    //    $('body').addClass('page-player');
    //} else {
    //    alert('This asset can only be viewed on offline mode.');
    //}
    this.init();
    $('body').addClass('page-player');
};
Player.prototype.hide = function () {
    $('body').removeClass('page-player');
    $('.container.player_container').remove();
};