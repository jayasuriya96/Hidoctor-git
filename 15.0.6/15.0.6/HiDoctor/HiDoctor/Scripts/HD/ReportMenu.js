

function fnBindReportMenu() {
    $.ajax({
        type: 'POST',
        url: '../Menu/GetReportsMenu',
        data: "a",
        success: function (response) {
            var jsMenu = eval('(' + response + ')');
            if (!(jsMenu.Tables === undefined) && jsMenu.Tables.length > 0 && jsMenu.Tables[0].Rows.length > 0) {
                var subMenu = "", detailMenu = "";

                // For Side Menu
                subMenu = "<ul>";
                for (var i = 0; i < jsMenu.Tables[0].Rows.length; i++) {
                    subMenu += "<li onclick='fnFocusDescriptionDiv(" + i + ")'><div class='parentMenu'>" + ((jsMenu.Tables[0].Rows[i].Report_Category != null) ? jsMenu.Tables[0].Rows[i].Report_Category : "") + jsMenu.Tables[0].Rows[i].Menu_Text + "</div>";

                    var childCount = jsonPath(jsMenu, "$.Tables[1].Rows[?(@.Menu_ParentID=='" + jsMenu.Tables[0].Rows[i].Menu_Id + "')]");
                    if (childCount != false && childCount !== undefined) {
                        subMenu += "<div class='childCnt' >" + childCount.length + "</div><div style='clear:both;'></div></li>";
                    }
                    else {
                        subMenu += "<div class='childCnt' >0</div><div style='clear:both;'></div></li>";
                    }
                }
                subMenu += "</ul>";

                $("#dvSideMenuContent").html(subMenu);


                // for description
                var alterRow = "";
                var method = "";
                var limethod = "";
                for (var j = 0; j < jsMenu.Tables[0].Rows.length; j++) {

                    var childMenu = jsonPath(jsMenu, "$.Tables[1].Rows[?(@.Menu_ParentID=='" + jsMenu.Tables[0].Rows[j].Menu_Id + "')]");

                    if (childMenu != false && childMenu !== undefined && childMenu.length > 0) {
                        detailMenu += "<div id='dv_" + j + "' class='descMain'>";
                        detailMenu += "<div class='descTitle'>" + ((jsMenu.Tables[0].Rows[j].Report_Category != null) ? jsMenu.Tables[0].Rows[j].Report_Category : "") + jsMenu.Tables[0].Rows[j].Menu_Text;
                        detailMenu += " (" + childMenu.length + ")</div>";
                        detailMenu += "<div>";
                        detailMenu += "<ul>";

                        for (var l = 0; l < childMenu.length; l++) {
                            if (l % 2 == 0) {
                                alterRow = "class='liLeft'";
                            }
                            else {
                                alterRow = "class='liRight'";
                            }

                            limethod = "onclick='fnLoadBodyReportMenu(\"" + childMenu[l].Menu_URL + "\",\"" + childMenu[l].Menu_Text + "\",\"" + childMenu[l].Menu_Id + "\");'";
                            //method = "onclick='fnLoadBody(\"" + childMenu[l].Menu_URL + "\",this,\"" + childMenu[l].Menu_Id + "\");'";
                            detailMenu += "<li " + alterRow + " " + limethod + "><div class='childText' " + method + ">" + childMenu[l].Menu_Text + "</div>";

                            // For Images
                            if (childMenu[l].IsExcelExport != null && childMenu[l].IsExcelExport !== undefined && childMenu[l].IsExcelExport == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescexcel'></div>";
                            }
                            if (childMenu[l].IsPrint != null && childMenu[l].IsPrint !== undefined && childMenu[l].IsPrint == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescprint'></div>";
                            }
                            if (childMenu[l].IsChart != null && childMenu[l].IsChart !== undefined && childMenu[l].IsChart == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescchart'></div>";
                            }
                            if (childMenu[l].IsMultiUser != null && childMenu[l].IsMultiUser !== undefined && childMenu[l].IsMultiUser == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescuser'></div>";
                            }
                            if (childMenu[l].IsDrillDown != null && childMenu[l].IsDrillDown !== undefined && childMenu[l].IsDrillDown == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescdrildown'></div>";
                            }

                            detailMenu += "</li>";
                        }
                        detailMenu += "</ul>";
                        detailMenu += "<div style='clear:both'></div>";
                        detailMenu += "</div>";

                        detailMenu += "</div>";
                    }
                }
                $("#dvDescContent").html(detailMenu);

                // setting width
                $("#dvSideMenu").height($("#dvDesc").height())
            }

        },
        error: function (e) {
            fnMsgAlert("info", "Information", "Failed to get Reports Menu.");
        }
    });
}


function fnFocusDescriptionDiv(Cnt) {
    $(window).scrollTop($('#dv_' + Cnt).offset().top, 500);
    //$('body,html').animate({ scrollTop: 0 }, 500);
}


function fnBindNewReportMenu() {
    $.ajax({
        type: 'POST',
        url: '../Menu/GetNewReportsMenu',
        data: "a",
        success: function (response) {
            var jsMenu = eval('(' + response + ')');
            if (!(jsMenu.Tables === undefined) && jsMenu.Tables.length > 0 && jsMenu.Tables[0].Rows.length > 0) {
                var subMenu = "", detailMenu = "";
                var jsonParentStr = '[{"Menu_Text":"Administration","Menu_ID":"M"},{"Menu_Text":"Compliance","Menu_ID":"C"},{"Menu_Text":"Field Analysis","Menu_ID":"A"},{"Menu_Text":"Marketing Analysis","Menu_ID":"R"}]';
                var jsonParent = eval(jsonParentStr);

                // For Side Menu
                subMenu = "<ul>";
                for (var i = 0; i < jsonParent.length; i++) {
                    subMenu += "<li onclick='fnFocusDescriptionDiv(" + i + ")'><div class='parentMenu'>" + jsonParent[i].Menu_Text + "</div>";

                    var childCount = jsonPath(jsMenu, "$.Tables[0].Rows[?(@.Report_Category=='" + jsonParent[i].Menu_ID + "')]");
                    if (childCount != false && childCount !== undefined) {
                        subMenu += "<div class='childCnt' >" + childCount.length + "</div><div style='clear:both;'></div></li>";
                    }
                    else {
                        subMenu += "<div class='childCnt' >0</div><div style='clear:both;'></div></li>";
                    }
                }
                subMenu += "</ul>";

                $("#dvSideMenuContent").html(subMenu);


                // for description
                var alterRow = "";
                var method = "";
                var limethod = "";
                for (var j = 0; j < jsonParent.length; j++) {

                    var childMenu = jsonPath(jsMenu, "$.Tables[0].Rows[?(@.Report_Category=='" + jsonParent[j].Menu_ID + "')]");

                    if (childMenu != false && childMenu !== undefined && childMenu.length > 0) {
                        detailMenu += "<div id='dv_" + j + "' class='descMain'>";
                        detailMenu += "<div class='descTitle'>" + jsonParent[j].Menu_Text;
                        detailMenu += " (" + childMenu.length + ")</div>";
                        detailMenu += "<div>";
                        detailMenu += "<ul>";

                        for (var l = 0; l < childMenu.length; l++) {
                            if (l % 2 == 0) {
                                alterRow = "class='liLeft'";
                            }
                            else {
                                alterRow = "class='liRight'";
                            }


                            var liThis = $('<div>' + childMenu[l].Menu_Text + '</div>');

                            limethod = "onclick='fnLoadBodyReportMenu(\"" + childMenu[l].Menu_URL + "\",\"" + childMenu[l].Menu_Text + "\",\"" + childMenu[l].Menu_ID + "\");'";
                            //method = "onclick='fnLoadBody(\"" + childMenu[l].Menu_URL + "\",this,\"" + childMenu[l].Menu_Id + "\");'";
                            detailMenu += "<li " + alterRow + " " + limethod + "><div class='childText' " + method + ">" + childMenu[l].Menu_Text + "</div>";

                            // For Images
                            if (childMenu[l].IsExcelExport != null && childMenu[l].IsExcelExport !== undefined && childMenu[l].IsExcelExport == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescexcel'></div>";
                            }
                            if (childMenu[l].IsPrint != null && childMenu[l].IsPrint !== undefined && childMenu[l].IsPrint == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescprint'></div>";
                            }
                            if (childMenu[l].IsChart != null && childMenu[l].IsChart !== undefined && childMenu[l].IsChart == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescchart'></div>";
                            }
                            if (childMenu[l].IsMultiUser != null && childMenu[l].IsMultiUser !== undefined && childMenu[l].IsMultiUser == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescuser'></div>";
                            }
                            if (childMenu[l].IsDrillDown != null && childMenu[l].IsDrillDown !== undefined && childMenu[l].IsDrillDown == 'Y') {
                                detailMenu += "<div class='divdescIcon divdescdrildown'></div>";
                            }

                            detailMenu += "</li>";
                        }
                        detailMenu += "</ul>";
                        detailMenu += "<div style='clear:both'></div>";
                        detailMenu += "</div>";

                        detailMenu += "</div>";
                    }
                }
                $("#dvDescContent").html(detailMenu);

                // setting width
                $("#dvSideMenu").height($("#dvDesc").height())
            }

        },
        error: function (e) {
            fnMsgAlert("info", "Information", "Failed to get Reports Menu.");
        }
    });
}


function fnLoadBodyReportMenu(url, obj, menuId) {

    $('.active').removeClass('active');
    $("#divPageHeader").html("");
    $("#dvAjaxLoad").show();
    $("#main").html("");

    if (url.toUpperCase().indexOf('.ASPX') > -1) {
        $("#main").load("Home/SFAWA/" + menuId);
        // $("#main").load("Home/SFAWA/HTML/SessionExpired.html");
        fnScreensVisitedStatistics(menuId);
    }
    else if (url.toUpperCase().indexOf('HTTP') > -1) {
        window.open(url, "_blank");
    }
    else {
        
        var sessionLiveFlag = false;
            for(var i=0;i<DO_NOT_SESSION_EXPIRED_PAGES.length;i++)
            {
                if(url.toUpperCase().indexOf(DO_NOT_SESSION_EXPIRED_PAGES[i]) > -1)
                {
                    sessionLiveFlag = true;
                    break;
                }
            
            }
            if (sessionLiveFlag) {
                sessionLive();

            }
            else {
                if (sessionLive_g != null) {
                    clearInterval(sessionLive_g);
                    sessionLive_g = null;
                }
            }

        $("#page-header").show();
        $("#divPageHeader").html("" + obj + "");
        $("#main").load(url);
        fnScreensVisitedStatistics(menuId);
    }

}

function fnScreensVisitedStatistics(menuid) {
    //get the applied users
    $.ajax({
        type: "POST",
        url: 'ChangePassword/InsertMenuVistDetails',
        data: 'menuID=' + menuid,
        success: function (result) {
            if (result = "0") {

            }
        }
    });
}