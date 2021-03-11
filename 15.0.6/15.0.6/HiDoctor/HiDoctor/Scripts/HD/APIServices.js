//Global string
var dataArr = new Array();
var csvArr = new Array();

function fnBindAPIServices() {
    $.ajax({
        type: 'POST',
        url: '../HDAPI/GetAPIServices',
        data: "a",
        success: function (response) {
            var jsMenu = eval('(' + response + ')');
            if (!(jsMenu.Tables === undefined) && jsMenu.Tables.length > 0 && jsMenu.Tables[0].Rows.length > 0) {
                var subMenu = "", detailMenu = "";

                // For Side Menu
                subMenu = "<ul>";
                for (var i = 0; i < jsMenu.Tables[0].Rows.length; i++) {
                    subMenu += "<li onclick='fnFocusDescriptionDiv(" + i + ")'><div class='parentMenu'>" + jsMenu.Tables[0].Rows[i].API_Category_Name + "</div>";

                    var childCount = jsonPath(jsMenu, "$.Tables[1].Rows[?(@.API_Category_Code=='" + jsMenu.Tables[0].Rows[i].API_Category_Code + "')]");
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

                    var childMenu = jsonPath(jsMenu, "$.Tables[1].Rows[?(@.API_Category_Code=='" + jsMenu.Tables[0].Rows[j].API_Category_Code + "')]");

                    if (childMenu != false && childMenu !== undefined && childMenu.length > 0) {
                        detailMenu += "<div id='dv_" + j + "' class='descMain'>";
                        detailMenu += "<div class='descTitle'>" + jsMenu.Tables[0].Rows[j].API_Category_Name;
                        detailMenu += " (" + childMenu.length + ")<div class='descTextTitle'>( " + jsMenu.Tables[0].Rows[j].API_Category_Description + " )</div></div>";
                        detailMenu += "<div>";
                        detailMenu += "<ul>";

                        for (var l = 0; l < childMenu.length; l++) {
                            if (l % 2 == 0) {
                                alterRow = "class='liLeft'";
                            }
                            else {
                                alterRow = "class='liRight'";
                            }

                            limethod = "onclick='fnShowUI(\"" + childMenu[l].API_ID + "\",\"" + childMenu[l].ServiceId + "\",\"" + childMenu[l].ServiceName + "\");'";
                            //method = "onclick='fnLoadBody(\"" + childMenu[l].Menu_URL + "\",this,\"" + childMenu[l].Menu_Id + "\");'";
                            detailMenu += "<li " + alterRow + " " + limethod + "><div class='childText' " + method + ">" + childMenu[l].ServiceName;
                            detailMenu += "<br /><span class='descText'>( " + childMenu[l].ServiceDescrn + " )</span></div>";
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

function fnShowUI(apiId, sericeID, serviceName) {
    $("#dvURL").hide();
    $("#hdnAPIId").val(apiId);
    $("#hdnServiceId").val(sericeID);
    $("#dvSerName").html(serviceName)
    dataArr = new Array();
    csvArr = new Array();

    $.ajax({
        type: "POST",
        url: '../HDAPI/GetAPIUI',
        data: "APIId=" + apiId + "",
        success: function (jsData) {
            if (jsData != null) {
                jsData = eval('(' + jsData + ')');
                var content = "";
                if (jsData.Tables[0].Rows.length > 0) {
                    var showInUI = jsonPath(jsData, "$.Tables[0].Rows[?(@.Show_In_UI=='Y')]");
                    if (showInUI != false && showInUI !== undefined && showInUI.length > 0) {
                        content += "<table style='width:100%'>";
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            if (jsData.Tables[0].Rows[i].Show_In_UI == "Y") {

                                if (jsData.Tables[0].Rows[i].Type == "DATE") {
                                    content += "<tr>";
                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
                                    content += "<td><input type='text' class='datepicker' id='" + jsData.Tables[0].Rows[i].InputParam + "' /> <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
                                    content += "</tr>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                                else if (jsData.Tables[0].Rows[i].Type == "TEXT_CSV") {
                                    content += "<tr>";
                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
                                    content += "<td style='width:70%'><input type='text' id='" + jsData.Tables[0].Rows[i].InputParam + "' /> <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
                                    content += "</tr>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                    csvArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                                else {
                                    content += "<tr>";
                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
                                    content += "<td style='width:70%'><input type='text' id='" + jsData.Tables[0].Rows[i].InputParam + "' /> <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
                                    content += "</tr>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                            }
                        }
                        content += "</table>";


                        $("#dvElements").html(content);


                        $("#btnExecService").show();
                        $("#dvAPIUI").overlay().load();

                        $(".datepicker").datepicker({
                            dateFormat: 'yy-mm-dd',
                            numberOfMonths: 1
                        });
                        // initialize token input for TEXT_CSV
                        for (var j = 0; j < csvArr.length; j++) {
                            $("#" + csvArr[j]).tokenInput(
                            null, {
                                allowFreeTagging: true, preventDuplicates: true, theme: "facebook", onAdd: function (item) {

                                },
                                onDelete: function (item) {

                                }
                            }
                            );
                        }
                    }
                    else {
                        $("#dvElements").html("No user input required for this report.Kindly click on 'Get Report' to continue.");
                        $("#btnExecService").show();
                        $("#dvAPIUI").overlay().load();
                    }
                }
                else {
                    $("#dvElements").html("An error occured in configuring this request. Please contact the administrator for additional help.");
                    $("#btnExecService").hide();
                    $("#dvAPIUI").overlay().load();
                }
            }
            else {
                $("#dvElements").html("An error occured in configuring this request. Please contact the administrator for additional help..");
                $("#btnExecService").hide();
                $("#dvAPIUI").overlay().load();
            }
        }
    });
}

function fnExecuteAPI() {
    $("#dvload").show();
    var data = "";
    data += "ServiceId=" + $("#hdnServiceId").val() + "&APIId=" + $("#hdnAPIId").val() + "&";
    for (var i = 0; i < dataArr.length; i++) {
        if ($.inArray(dataArr[i], csvArr) == -1) {
            data += dataArr[i] + '=' + $("#" + dataArr[i]).val() + "&";
        }
        else {
            // read token input
            var tokObj = $("#" + dataArr[i]).tokenInput('get');
            var tokanValue = "";

            for (var s = 0; s < tokObj.length; s++) {
                tokanValue += tokObj[s].id + '^';
            }
            tokanValue = tokanValue.slice(0, -1);
            data += dataArr[i] + '=' + tokanValue + "&";
        }
    }
    data = data.slice(0, -1);

    $.ajax({
        type: "POST",
        url: '../HDAPI/ExecuteAPI',
        data: data,
        success: function (jsData) {
            if (jsData != null) {
                if (jsData.split(":")[0] != "FAIL") {
                    $("#dvURL").html("Click the URL to download the CSV file :: <a href=" + jsData + ">" + jsData + "</a>")
                }
                else {
                    $("#dvURL").html(jsData);
                }
            }
            $("#dvURL").show();
            $("#dvload").hide();
        }
    });
}

function fnFocusDescriptionDiv(Cnt) {
    $(window).scrollTop($('#dv_' + Cnt).offset().top, 500);
    //$('body,html').animate({ scrollTop: 0 }, 500);
}


