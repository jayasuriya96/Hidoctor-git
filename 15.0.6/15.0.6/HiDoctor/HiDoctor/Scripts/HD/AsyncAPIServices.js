//Global string
var dataArr = new Array();
var csvArr = new Array();
var sessionBtnCount = '';
function fnBindAPIServices() {
    debugger;
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
    console.log(serviceName);
    $('#main').load('HDAPI/AsyncAPIDetails/?apiId=' + apiId + '&ServiceId=' + escape(sericeID) + '&serviceName=' + escape(serviceName));
}

//function fnShowUI(apiId, sericeID, serviceName) {
//    $("#dvURL").hide();
//    $("#hdnAPIId").val(apiId);
//    $("#hdnServiceId").val(sericeID);
//    $("#dvSerName").html(serviceName);
//    $("#dvXLAPIQueue").html("");
//    dataArr = new Array();
//    csvArr = new Array();

//    $.ajax({
//        type: "POST",
//        url: '../HDAPI/GetAPIUI',
//        data: "APIId=" + apiId + "",
//        success: function (jsData) {
//            if (jsData != null) {
//                jsData = eval('(' + jsData + ')');
//                var content = "";
//                if (jsData.Tables[0].Rows.length > 0) {
//                    var showInUI = jsonPath(jsData, "$.Tables[0].Rows[?(@.Show_In_UI=='Y')]");
//                    if (showInUI != false && showInUI !== undefined && showInUI.length > 0) {
//                        content += "<table style='width:100%'>";
//                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
//                            if (jsData.Tables[0].Rows[i].Show_In_UI == "Y") {

//                                if (jsData.Tables[0].Rows[i].Type == "AUTO") {
//                                    content += "<tr>";
//                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
//                                    content += "<td style='width:70%'><input type='hidden' id='hdn" + jsData.Tables[0].Rows[i].InputParam + "' /> ";
//                                    //content += "<input type='text' maxlength='50' placeholder='Auto' id='" + jsData.Tables[0].Rows[i].InputParam + "' class='cls" + jsData.Tables[0].Rows[i].Session_Key + "' data-value='" + jsData.Tables[0].Rows[i].InputParam + "'  data-name='" + jsData.Tables[0].Rows[i].Session_Key + "' onkeyup='fnGetSessionKey(this);' /><input type='button' id='" + jsData.Tables[0].Rows[i].Session_Key + "' value='Go' data-value='" + jsData.Tables[0].Rows[i].InputParam + "'  data-name='" + jsData.Tables[0].Rows[i].Session_Key + "' onclick='fnGetOpenModel(this);' />  <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
//                                    content += "<input type='text' maxlength='50' placeholder='Auto' id='" + jsData.Tables[0].Rows[i].InputParam + "' class='cls" + jsData.Tables[0].Rows[i].Session_Key + "' data-value='" + jsData.Tables[0].Rows[i].InputParam + "'  data-name='" + jsData.Tables[0].Rows[i].Session_Key + "' onkeyup='fnGetSessionKey(this);' /><br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
//                                    content += "</tr>";
//                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
//                                }
//                                else if (jsData.Tables[0].Rows[i].Type == "TEXT") {
//                                    content += "<tr>";
//                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
//                                    content += "<td style='width:70%'><input type='text' id='" + jsData.Tables[0].Rows[i].InputParam + "' /> <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
//                                    content += "</tr>";
//                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
//                                }
//                                else if (jsData.Tables[0].Rows[i].Type == "DATE") {
//                                    content += "<tr>";
//                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
//                                    content += "<td><input type='text' class='datepicker' id='" + jsData.Tables[0].Rows[i].InputParam + "' /> <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
//                                    content += "</tr>";
//                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
//                                }
//                                else if (jsData.Tables[0].Rows[i].Type == "TEXT_CSV") {
//                                    content += "<tr>";
//                                    content += "<td style='vertical-align: top;'>" + jsData.Tables[0].Rows[i].InputParam + "</td>";
//                                    content += "<td style='width:70%'><input type='text' id='" + jsData.Tables[0].Rows[i].InputParam + "' /> <br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
//                                    content += "</tr>";
//                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
//                                    csvArr.push(jsData.Tables[0].Rows[i].InputParam);
//                                }
//                            }
//                        }
//                        content += "</table>";


//                        $("#dvElements").html(content);


//                        $("#btnExecService").show();
//                        $("#dvAPIUI").overlay().load();

//                        $(".datepicker").datepicker({
//                            dateFormat: 'yy-mm-dd',
//                            numberOfMonths: 1
//                        });
//                        fnRefreshReportQueueStatus(apiId);
//                        // initialize token input for TEXT_CSV
//                        for (var j = 0; j < csvArr.length; j++) {
//                            $("#" + csvArr[j]).tokenInput(
//                            null, {
//                                allowFreeTagging: true, preventDuplicates: true, theme: "facebook", onAdd: function (item) {

//                                },
//                                onDelete: function (item) {

//                                }
//                            }
//                            );
//                        }
//                    }
//                    else {
//                        $("#dvElements").html("No user input required for this report.Kindly click on 'Get Report' to continue.");
//                        $("#btnExecService").show();
//                        $("#dvAPIUI").overlay().load();
//                    }
//                }
//                else {
//                    $("#dvElements").html("An error occured in configuring this request. Please contact the administrator for additional help.");
//                    $("#btnExecService").hide();
//                    $("#dvAPIUI").overlay().load();
//                }
//            }
//            else {
//                $("#dvElements").html("An error occured in configuring this request. Please contact the administrator for additional help..");
//                $("#btnExecService").hide();
//                $("#dvAPIUI").overlay().load();
//            }
//        }
//    });
//}

//function fnGetOpenModel(id)
//{
//    alert(1);
//   $("#dvAPIUIPOP").overlay().load();
//    //ShowModalPopup("dvAPIUIPOP");


//}


function fnGetSessionKey(id) {

    var sessionkey = $(id).attr("data-value");
    var sessionname = $(id).attr("data-name");
    var content = "";
    if (sessionname == "Region_Name" || sessionname == "User_Name") {
        if ($.trim($("#" + sessionkey).val()).length < 3) {
            alert("please enter at least 3 characters in  '" + sessionkey + "' name");
            return false;
        }
    }
    else {
        if ($.trim($("#" + sessionkey).val()) == "") {
            alert("Please enter '" + sessionkey + "' name");
            return false;
        }
    }
    // var SearchKey = $('#Region_Name').val();
    $("#btnPopSelect").show();
    $("#hdnCurrentId").val(sessionkey);
    $.ajax({
        type: 'GET',
        data: "sessionkey=" + sessionname + "&searchKey=" + $.trim($("#" + sessionkey).val()),
        url: '../HDAPI/GetExcelApiInputData',
        success: function (response) {
            debugger;
            sessionBtnCount = 1;
            var sessionKeyDatas = eval(response);
            if (sessionKeyDatas.length && sessionKeyDatas != null) {
                content = "<div style='text-align: center;'><span style='font-weight: bold;'>Search text : </span><span style='font-weight: bold;margin-left: 10px;'>'" + $.trim($("#" + sessionkey).val()) + "'</span></div>";
                content += "<table class='table' style='width: 100%;'><thead><tr ><td style='text-align: center;'>Select</td><td style='text-align: left;padding-left: 8px;'>Name</td></tr></thead><tbody>";
                for (var i = 0; i < sessionKeyDatas.length; i++) {
                    sessionBtnCount++;
                    content += "<tr><th style='border: 1px solid #e2e1e1;padding: 0px 5px;text-align: center;'><input id='sessionBtnCount" + sessionBtnCount + "' type='radio' name='SessionKeyName' value=\"" + sessionKeyDatas[i].label + "\" ></th><th  style='text-align: left;border: 1px solid #e2e1e1;padding: 0px 5px;'>" + sessionKeyDatas[i].label + "</th>";
                }
                content += "</tbody></table>";
                $("#dvAutofill").html(content)
                // autoComplete(JSON.parse(response), sessionkey, 'hdn' + sessionkey, 'cls' + sessionname);
            }
            else {
                $("#dvAutofill").html("<div style='font-size: 24px;position: absolute;top: 40%;left: 40%;display: inline-block;'>No data found</div>");
                $("#btnPopSelect").hide();
            }
            $("#dvAPIPOP").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Loading report queue', 'Error.');
            $("#dvAjaxLoad").hide();

        }
    });

}



function fnExecuteAPI() {
    IsIntervel = true;
    $("#dvload").show();
    var data = "";
    data += "ServiceId=" + $("#hdnServiceId").val() + "&isExcel=" + $("#hdnReportType").val() + "&APIId=" + $("#hdnAPIId").val() + "&";
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
        url: '../HDAPI/AsyncExecuteAPI',
        data: data,
        success: function (jsData) {

            if ($("#hdnReportType").val() == 1) {
                if (jsData != null) {
                    if (jsData.split(":")[0] != "FAIL") {
                        //$("#dvAsynMsg").html("Click the URL to download the CSV file :: <a href=" + jsData + ">" + jsData + "</a>")
                        $("#dvAsynMsg").html("Excel API submitted for processing...your request reference number" + jsData + ". Please check below request grid for status.");
                        fnRefreshReportQueueStatus($("#hdnAPIId").val());
                    }
                    else {
                        alert(jsData)
                        $("#dvAsynMsg").html(jsData);                       
                        //$('#tblDoctorMaster').dataTable({
                        //    "bFilter": false,
                        //    "bPaginate": true,
                        //    "sPaginationType": "full_numbers",
                        //    "bInfo": false,
                        //    // "sScrollX": "100%",
                        //    "bSort": false
                        //});

                        //if ($.fn.dataTable) {
                        //    $('#tblDoctorMaster').dataTable({
                        //        "oLanguage": {
                        //            "sEmptyTable": "No Data Available"
                        //        },
                        //        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                        //    });
                        //    $(".dataTables_filter").hide();
                        //    $(".TableTools_button.TableTools_clipboard").hide();
                        //    $(".TableTools_button.TableTools_csv").hide();
                        //    $(".TableTools_button.TableTools_print").hide();
                        //};
                    }
                }
                $("#dvXLAPIQueuePanel").show();
                $('.details').hide();
                $('#Btnshowhide').val('Show Search Box');
                $("#dvAsynMsg").show();
                $("#dvload").hide();
            }
            else {
                $("#dvReportGridPanel").html(jsData);
                if ($.fn.dataTable) {
                    $('#tblDoctorMaster').dataTable({ "sPaginationType": "full_numbers" });
                };
               
                $('#dvXLAPIQueuePanel').hide();
                $("#dvload").hide();
            }
        }
    });
}

function fnFocusDescriptionDiv(Cnt) {
    $(window).scrollTop($('#dv_' + Cnt).offset().top, 500);
    //$('body,html').animate({ scrollTop: 0 }, 500);
}

function fnRefreshReportQueueStatus(val) {

    $('#dvAsynMsg').html();
    $('#dvAsynMsg').hide();
    fnGetAsynReportstatus(val);
}

function fnGetAsynReportstatus(val) {

    $('#dvXLAPIQueue').show();
    $('#dvXLAPIQueue').html('');
    //var API_ID = val;
    //$("#ReportName").val(API_ID);
    $.ajax({
        type: 'GET',
        data: "API_ID=" + val,
        url: '../HDAPI/GetExcelAPIProcessQueueStatus',
        success: function (response) {
            if (response != '' && response != null) {
                $('#dvXLAPIQueue').html(response);
            }
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            fnMsgAlert('info', 'Loading report queue', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnGetDetailInfo(apiId, sericeID, serviceName) {
    $("#dvURL").hide();
    $("#hdnAPIId").val(apiId);
    $("#hdnServiceId").val(sericeID);
    $("#dvSerName").html(serviceName);
    $("#dvXLAPIQueue").html("");
    dataArr = new Array();
    csvArr = new Array();
    $.ajax({
        type: "POST",
        url: '../HDAPI/GetAPIUI',
        data: "APIId=" + apiId + "",
        success: function (jsData) {
            debugger;
            if (jsData != null) {
                jsData = eval('(' + jsData + ')');
                var content = "";
                if (jsData.Tables[0].Rows.length > 0) {
                    var showInUI = jsonPath(jsData, "$.Tables[0].Rows[?(@.Show_In_UI=='Y')]");
                    if (showInUI != false && showInUI !== undefined && showInUI.length > 0) {
                        content += "<div class='col-xs-12 clearfix'>";
                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                            if (jsData.Tables[0].Rows[i].Show_In_UI == "Y") {

                                if (jsData.Tables[0].Rows[i].Type == "AUTO") {
                                    content += "<div class='col-xs-6 clearfix'>";
                                    content += "<label  class='col-sm-3 control-label'>" + jsData.Tables[0].Rows[i].InputParam + "</label>";
                                    //content += "<div class='col-xs-6' style='text-align: left;font-weight: bold;'>" + jsData.Tables[0].Rows[i].InputParam + "</div>";
                                    content += "<div class='col-xs-9'>";
                                    content += "<input type='hidden' id='hdn" + jsData.Tables[0].Rows[i].InputParam + "' /> ";
                                    content += "<input type='text' style='width: 85% !important;' maxlength='50' placeholder='Auto' id='" + jsData.Tables[0].Rows[i].InputParam + "' class='cls" + jsData.Tables[0].Rows[i].Session_Key + "  form-control' data-value='" + jsData.Tables[0].Rows[i].InputParam + "'  data-name='" + jsData.Tables[0].Rows[i].Session_Key + "'  /><input type='button' id='" + jsData.Tables[0].Rows[i].Session_Key + "' class='btn btn-primary' value='Go' style='float: right;position: absolute;top: 1px;right: 15px;padding: 3px 12px;' data-value='" + jsData.Tables[0].Rows[i].InputParam + "'  data-name='" + jsData.Tables[0].Rows[i].Session_Key + "' onclick='fnGetSessionKey(this);' />";
                                    if (jsData.Tables[0].Rows[i].Help_Description != "") {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span>";
                                    } else {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'></span>";
                                    }
                                    content += "</div>";
                                    //content += "<input type='text' maxlength='50' placeholder='Auto' id='" + jsData.Tables[0].Rows[i].InputParam + "' class='cls" + jsData.Tables[0].Rows[i].Session_Key + "' data-value='" + jsData.Tables[0].Rows[i].InputParam + "'  data-name='" + jsData.Tables[0].Rows[i].Session_Key + "' onkeyup='fnGetSessionKey(this);' /><br /><span style='font-style: italic;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span></td>";
                                    content += "</div>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                                else if (jsData.Tables[0].Rows[i].Type == "TEXT") {
                                    content += "<div class='col-xs-6 clearfix'>";
                                    content += "<label  class='col-sm-3 control-label'>" + jsData.Tables[0].Rows[i].InputParam + "</label>";
                                    //content += "<div class='col-xs-3' style='text-align: left;font-weight: bold;'>" + jsData.Tables[0].Rows[i].InputParam + "</div>";
                                    content += "<div class='col-xs-9'>";
                                    content += "<input type='text' id='" + jsData.Tables[0].Rows[i].InputParam + "' class='form-control'/>";
                                    if (jsData.Tables[0].Rows[i].Help_Description != "") {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span>";
                                    } else {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'></span>";
                                    }
                                    content += "</div>";
                                    content += "</div>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                                else if (jsData.Tables[0].Rows[i].Type == "DATE") {
                                    content += "<div class='col-xs-6 clearfix'>";
                                    content += "<label  class='col-sm-3 control-label'>" + jsData.Tables[0].Rows[i].InputParam + "</label>";
                                    //content += "<div class='col-xs-3' style='text-align: left;font-weight: bold;'>" + jsData.Tables[0].Rows[i].InputParam + "</div>";
                                    content += "<div class='col-xs-9'>";
                                    content += "<input type='text' class='datepicker form-control' id='" + jsData.Tables[0].Rows[i].InputParam + "' />";
                                    if (jsData.Tables[0].Rows[i].Help_Description != "") {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span>";
                                    } else {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'></span>";
                                    }
                                    content += "</div>";
                                    content += "</div>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                                else if (jsData.Tables[0].Rows[i].Type == "TEXT_CSV") {
                                    content += "<div class='col-xs-6 clearfix'>";
                                    content += "<label  class='col-sm-3 control-label'>" + jsData.Tables[0].Rows[i].InputParam + "</label>";
                                    //content += "<div class='col-xs-3' style='text-align: left;font-weight: bold;'>" + jsData.Tables[0].Rows[i].InputParam + "</div>";
                                    content += "<div class='col-xs-9'>";
                                    content += "<input type='text' id='" + jsData.Tables[0].Rows[i].InputParam + "' class='form-control'/>";
                                    if (jsData.Tables[0].Rows[i].Help_Description != "") {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'>(" + jsData.Tables[0].Rows[i].Help_Description + ")</span>";
                                    } else {
                                        content += "<span style='font-style: italic;padding-bottom:5px;display: block;height: 25px;'></span>";
                                    }
                                    content += "</div>";
                                    content += "</div>";
                                    dataArr.push(jsData.Tables[0].Rows[i].InputParam);
                                    csvArr.push(jsData.Tables[0].Rows[i].InputParam);
                                }
                            }
                        }
                        content += "</div>";


                        $("#dvElements").html(content);
                        // $("#dvXLAPIQueuePanel").hide();
                        $("#btnExecService").show();
                        $(".datepicker").datepicker({
                            dateFormat: 'yy-mm-dd',
                            numberOfMonths: 1
                        });
                        fnRefreshReportQueueStatus(apiId);
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

                    }
                }
                else {
                    $("#dvElements").html("An error occured in configuring this request. Please contact the administrator for additional help.");
                    $("#btnExecService").hide();

                }
            }
            else {
                $("#dvElements").html("An error occured in configuring this request. Please contact the administrator for additional help..");
                $("#btnExecService").hide();
            }
        }
    });
}

function fnCancel() {
    $("#dvAPIPOP").overlay().close();
}
function fnSelect() {
    if ($('input[name=SessionKeyName]:checked').length == 0) {
        alert("Please select atleast one");
        return false;
    }
    else {
        var sessionselectName = $('input[name=SessionKeyName]:checked').val();
        var sessionId = $("#hdnCurrentId").val();
        $("#" + sessionId).val(sessionselectName);
        $("#dvAPIPOP").overlay().close();
    }

}
function fnBack() {
    $('#main').load('HDAPI/AsyncAPIHome');
}


