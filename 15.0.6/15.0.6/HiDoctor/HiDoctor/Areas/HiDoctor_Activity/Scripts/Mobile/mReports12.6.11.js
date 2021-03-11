var upd_g = "";
function fnGetTPHeaderDetails(userCode) {
    //call insert
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetTPHeader',
        data: "userCode=" + userCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                fnGetTPHeaderReport(jsonData);
            }
        }
    });
}

var result = "";

function fnGetTPHeaderReport(jsonData) {
    var content = "";
    // content += ' <div data-theme="b" data-role="header"><h3>Header</h3> </div><div data-role="content"></div>';
    //var content = "";// "<div style='width:100%' data-role='field-contain'>";
    if (jsonData.Tables[0].Rows.length > 0) {
        for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {

            // $('#dvReport').prepend('<div data-role="header"  class="ui-header ui-bar-b" data-mini="true" role="banner"><h1>Dyn Header</h1></div>');
            //  $('#content').append('<a href="#" data-role="button" >Dyn Button</a>');
            var content = "";
            var tpId = jsonData.Tables[0].Rows[i].TP_Id;
            var date = new Date(jsonData.Tables[0].Rows[i].TP_Date).getDate() + "-" + (parseInt(new Date(jsonData.Tables[0].Rows[i].TP_Date).getMonth()) + 1) + "-" + new Date(jsonData.Tables[0].Rows[i].TP_Date).getFullYear();
            content += "<div class='dvWidth'><div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'><h3 class='ui-title' role='heading' aria-level='1'>TP " + date + "</h3></div>";
            content += "<div class='dvWidth'><div class='dvWidth'><div style='float: left; width: 40%;'>Call Objective</div>";
            content += "<div style='float: left; width: 50%;'>" + jsonData.Tables[0].Rows[i].Project_Name + "</div><div style='clear: both;'></div></div>";
            content += "<div class='dvWidth'><div style='float: left; width: 40%;'>Category</div>";
            content += "<div style='float: left; width: 50%;'>" + jsonData.Tables[0].Rows[i].Category + "</div><div style='clear: both;'></div></div>";
            content += "<div class='dvWidth'><div style='float: left; width: 40%;'>SFC</div><div style='float: left; width: 50%;'>";
            if (jsonData.Tables[3] != undefined) {
                var disJson = jsonPath(jsonData, "$.Tables[3].Rows[?(@.TP_Id=='" + tpId + "')]");
                if (disJson != false) {
                    for (var j = 0; j < disJson.length; j++) {
                        content += "<div>" + (parseInt(j) + 1) + " . " + disJson[j].From_Place + " - " + disJson[j].To_Place + "</div>";

                    }
                }
            }
            content += "</div><div style='clear: both;'></div></div>";
            content += "<div class='dvWidth'><div style='float: left; width: 40%;'>No of Doctors<br />Planned</div><div style='float: left; width: 50%;'>";
            if (jsonData.Tables[2] != undefined) {
                var disJson = jsonPath(jsonData, "$.Tables[2].Rows[?(@.TP_Id=='" + tpId + "')]");
                if (disJson != false) {
                    content += "<span onclick='fnGoToTPDetails(" + tpId + ")' style='cursor: pointer; text-decoration: underline'>";
                    content += "" + disJson.length + "</span>";
                }
                else {
                    content += "<span >0</span>";
                }
            }
            content += "</div><div style='clear: both;'></div></div>";
            content += "<div class='dvWidth'><div style='float: left; width: 40%;'>Status</div>";
            content += "<div style='float: left; width: 50%;'>" + jsonData.Tables[0].Rows[i].TP_Status + "</div>";
            content += "<div style='clear: both;'></div></div></div><div style='clear: both;'></div></div>";
            $("#dvReport").prepend(content);
        }
    }
    else {
        $("#dvReport").prepend('No data available');
    }
    //content += "</div>";
    $("#dvReport").trigger('create');

}

function fnGoToTPDetails(tpId) {
    $.mobile.changePage("/HiDoctor_Activity/MobileReports/TPDetails/?tpId=" + tpId + "&userCode=" + userCode + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGetTPDetails() {
    //call insert
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetTPHeader',
        data: "userCode=" + userCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                result = jsonData;
                fnGetTPDetailsReport(jsonData);
            }
        }
    });
}


function fnGetTPDetailsReport(jsonData) {
    var content = "";
    if (jsonData.Tables[0] != undefined) {
        var disJson = jsonPath(jsonData, "$.Tables[0].Rows[?(@.TP_Id=='" + tpId + "')]");
        if (disJson != false) {
            content += "<div class='dvWidth'>";
            content += "<div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'>";
            content += "<h3 class='ui-title' role='heading' aria-level='1'>TP (" + disJson[0].User_Name + " - " + jsonData.Tables[5].Rows[0].User_Type_Name + ")</h3></div>";
            content += "<div class='dvWidth'>";
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>TP Date</div>";
            content += "<div style='width: 50%; float: left;'>" + new Date(disJson[0].TP_Date).getDate() + "/" + (parseInt(new Date(disJson[0].TP_Date).getMonth()) + 1) + "/"
                                            + new Date(disJson[0].TP_Date).getFullYear() + "</div>";
            content += "<div style='clear:both'></div></div>";
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>Call Objective</div>";
            content += "<div style='width: 50%; float: left;'>" + disJson[0].Project_Name + "</div><div style='clear:both'></div></div>";
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>Activity Name </div>";
            if (disJson[0].Activity_Name == null) {
                content += "<div style='width: 50%; float: left;'>" + disJson[0].Project_Name + "</div><div style='clear:both'></div></div>";
            }
            else {
                content += "<div style='width: 50%; float: left;'>" + disJson[0].Activity_Name + "</div><div style='clear:both'></div></div>";
            }
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>Category </div>";
            content += "<div style='width: 50%; float: left;'>" + disJson[0].Category + "</div><div style='clear:both'></div></div>";
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>SFC</div>";
            content += "<div style='width: 50%; float: left;'>";
            var disSFCJson = jsonPath(jsonData, "$.Tables[3].Rows[?(@.TP_Id=='" + tpId + "')]");
            if (disSFCJson != false) {
                for (var i = 0; i < disSFCJson.length; i++) {
                    content += "<div class='dvWidth'>" + parseInt(parseInt(i) + 1) + " . " + disSFCJson[i].From_Place + " - " + disSFCJson[i].To_Place + "</div>";
                }
            }
            content += " </div><div style='clear:both'></div></div>";
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>Accompanist Name </div>";
            content += "<div style='width: 50%; float: left;'>";
            var disAccJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.TP_Id=='" + tpId + "')]");
            if (disAccJson != false) {

                if (disAccJson[0].Accomp_Name != '' && disAccJson[0].Accomp_Name != null) {
                    content += "<div class='dvWidth'>1. " + disAccJson[0].Accomp_Name + "</div>";
                }
                if (disAccJson[0].Accompanist2_Name != '' && disAccJson[0].Accompanist2_Name != null) {
                    content += "<div class='dvWidth'>2. " + disAccJson[0].Accompanist2_Name + "</div>";
                }
                if (disAccJson[0].Accompanist3_Name != '' && disAccJson[0].Accompanist3_Name != null) {
                    content += "<div class='dvWidth'>3. " + disAccJson[0].Accompanist3_Name + "</div>";
                }
                if (disAccJson[0].Accompanist4_Name != '' && disAccJson[0].Accompanist4_Name != null) {
                    content += "<div class='dvWidth'>4. " + disAccJson[0].Accompanist4_Name + "</div>";
                }

            }
            content += "</div><div style='clear: both;width:100%;'></div></div>";
            content += "<div class='dvWidth'><div style='width: 40%; float: left;'>Status</div>";
            content += "<div style='width: 50%; float: left;'>" + disJson[0].TP_Status + "</div><div style='clear: both;'></div></div></div>";
            //Doctor Details
            content += "<div class='dvWidth'>";
            content += "<div data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'><h3 class='ui-title' role='heading' aria-level='1'>Doctor Details</h3></div>";
            content += "<div style='width: 100%'>";
            var disDocJson = jsonPath(jsonData, "$.Tables[2].Rows[?(@.TP_Id=='" + tpId + "')]");
            if (disDocJson != false) {
                for (var j = 0; j < disDocJson.length; j++) {
                    var tpDoctorId = disDocJson[j].TP_Doctor_Id;
                    var mcName = "";
                    if (jsonData.Tables[6] != undefined) {
                        var disMCJson = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Doctor_Code=='" + disDocJson[j].Customer_Code + "')]");
                        if (disMCJson != false && disMCJson != undefined) {
                            for (var k = 0; k < disMCJson.length; k++) {
                                mcName += disMCJson[k].Campaign_Name + ",";
                            }
                            mcName = mcName.slice(0, -1);
                        }
                    }
                    var doctorName = disDocJson[j].Customer_Name + '-' + disDocJson[j].Category_Name + '-' + disDocJson[j].Speciality_Name + '-' + disDocJson[j].Region_Name;
                    if (mcName != '') {
                        doctorName = doctorName + '(' + mcName + ')';
                    }
                    content += "<div class='dvWidth'>";
                    content += "<a onclick='fnGoToDoctor360Page(\"" + disDocJson[j].Doctor_Region_Code + '_' + disDocJson[j].User_Code + '_' + disDocJson[j].Customer_Code + "\")' style='cursor: pointer;width:100%;text-decoration:underline;'>" + doctorName + "</a>";
                    var disProJson = jsonPath(jsonData, "$.Tables[4].Rows[?(@.TP_Id=='" + tpId + "' & @.TP_Doctor_Id=='" + tpDoctorId + "')]");
                    if (disProJson != false) {
                        for (var k = 0; k < disProJson.length; k++) {
                            content += "<div class='dvWidth dvPadding '>" + disProJson[k].Product_Name + " (" + disProJson[k].Quantity + ")</div>";
                        }
                    }
                    content += "</div>";
                }
            }
            content += "</div>"
            content += "<div style='clear: both;'></div>";
            content += "</div>";
        }
        else {
            content = "No data available";
        }
    }
    else {
        content = "No data available";
    }
    $("#dvTpDetailsReport").html(content).trigger('create');
}

function fnGoToDoctor360Page(docCode) {
    $.mobile.changePage("/HiDoctor_Activity/MobileReports/Doctor360/?doctorCode=" + docCode + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}
function fnGetDoctor360() {
    //call insert
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetDoctor360Details',
        data: "doctorCode=" + doctorCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                result = jsonData;
                fnGetDoctor360Report(jsonData);
            }
        }
    });
}


function fnGetDoctor360Report(jsonData) {
    var content = "";
    
    if (jsonData.Tables[0].Rows.length > 0) {
        content += "<div  data-role='header' data-mini='true' data-theme='b' class='ui-header ui-bar-b' role='banner'>";
        content += "<h2 data-mini='true' class='ui-title' role='heading' aria-level='1'>Doctor Details</h2></div>";

        content += "<div class='dvWidth'>";
        content += "<div class='dvWidth'>";
        content += "<div class='dvWidth fontBold'>" + jsonData.Tables[0].Rows[0].Customer_Name + " - " + jsonData.Tables[0].Rows[0].MDL_Number + " - "
        + jsonData.Tables[0].Rows[0].Category_Name + " - " + jsonData.Tables[0].Rows[0].Speciality_Name + " - DOB : " +
        new Date(jsonData.Tables[0].Rows[0].DOB).getDate() + "-" + (parseInt(new Date(jsonData.Tables[0].Rows[0].DOB).getMonth()) + 1) + "-" + new Date(jsonData.Tables[0].Rows[0].DOB).getFullYear() + "</div></div>";
        //Campaign List
        content += "<div class='dvWidth'><div class='dvWidth fontBold'>Campaign List</div>";
        if (jsonData.Tables[1] != undefined) {
            if (jsonData.Tables[1].Rows.length > 0) {
                for (var i = 0; i < jsonData.Tables[1].Rows.length; i++) {
                    content += "<div class='dvWidth dvPadding'>" + jsonData.Tables[1].Rows[i].Campaign_Name + "</div>";
                }
            }
            else {
                content += "<div class='dvWidth dvPadding'>No campaigns mapped for this doctor.</div>";
            }
        }
        content += "</div>";
        //Last three visit
        content += "<div class='dvWidth'><div class='dvWidth fontBold'>Last 3 Visited Dates:</div>";
        content += "<div class='dvWidth dvPadding'>";
        if (jsonData.Tables[2] != undefined) {
            var date = "";
            if (jsonData.Tables[2].Rows.length == 3) {
                var date1 = jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[1] + "/" + jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[0] + "/" + jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[2];
                var date2 = jsonData.Tables[2].Rows[1].DCR_Actual_Date.split('/')[1] + "/" + jsonData.Tables[2].Rows[1].DCR_Actual_Date.split('/')[0] + "/" + jsonData.Tables[2].Rows[1].DCR_Actual_Date.split('/')[2];
                var date3 = jsonData.Tables[2].Rows[2].DCR_Actual_Date.split('/')[1] + "/" + jsonData.Tables[2].Rows[2].DCR_Actual_Date.split('/')[0] + "/" + jsonData.Tables[2].Rows[2].DCR_Actual_Date.split('/')[2];
                // date = jsonData.Tables[2].Rows[0].DCR_Actual_Date + ',' + jsonData.Tables[2].Rows[1].DCR_Actual_Date + ',' + jsonData.Tables[2].Rows[2].DCR_Actual_Date;
                date = date1 + ',' + date2 + ',' + date3;
                content += date;
            }
            if (jsonData.Tables[2].Rows.length == 2) {
                var date1 = jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[1] + "/" + jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[0] + "/" + jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[2];
                var date2 = jsonData.Tables[2].Rows[1].DCR_Actual_Date.split('/')[1] + "/" + jsonData.Tables[2].Rows[1].DCR_Actual_Date.split('/')[0] + "/" + jsonData.Tables[2].Rows[1].DCR_Actual_Date.split('/')[2];
                // date = jsonData.Tables[2].Rows[0].DCR_Actual_Date + ',' + jsonData.Tables[2].Rows[1].DCR_Actual_Date;
                date = date1 + ',' + date2;
                content += date;
            }
            if (jsonData.Tables[2].Rows.length == 1) {
                var date1 = jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[1] + "/" + jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[0] + "/" + jsonData.Tables[2].Rows[0].DCR_Actual_Date.split('/')[2];
                // date = jsonData.Tables[2].Rows[0].DCR_Actual_Date;
                content += date1;
            }
            if (jsonData.Tables[2].Rows.length == 0) {
                content += date;
            }
        }
        content += "</div>";
        //Product Sample details
        content += "<div class='dvWidth'>";
        content += "<div class='dvWidth fontBold'> Products Samples & Details:</div>";
        if (jsonData.Tables[3] != undefined) {
            for (var j = 0; j < jsonData.Tables[3].Rows.length; j++) {
                var product = jsonData.Tables[3].Rows[j].Product_Name + '-' + jsonData.Tables[3].Rows[j].Quantity_Provided + ' Nos.(' + jsonData.Tables[3].Rows[j].DCR_Date + ')';
                content += "<div class='dvWidth dvPadding'>" + (parseInt(j) + 1) + '. ' + product + "</div>";
            }
        }
        content += "</div>";
        //Chemist Visited

        content += "<div class='dvWidth'>";
        content += "<div class='dvWidth fontBold'> Chemist Visited:</div>";
        if (jsonData.Tables[5] != undefined) {
            for (var k = 0; k < jsonData.Tables[5].Rows.length; k++) {
                var chemistName = jsonData.Tables[5].Rows[k].Chemists_Name + '-' + jsonData.Tables[5].Rows[k].DCR_Date + ' POB (' + jsonData.Tables[5].Rows[k].PO_Amount + ')';
                content += "<div class='dvWidth dvPadding'>" + (parseInt(k) + 1) + '. ' + chemistName + "</div>";
            }
        }
        content += "</div>";
        //Product Mapping Details
        content += "<div class='dvWidth'>";
        content += "<div class='dvWidth fontBold'>Product Mapping Details:</div>";
        if (jsonData.Tables[7] != undefined) {
            for (var n = 0; n < jsonData.Tables[7].Rows.length; n++) {
                var productmapping = jsonData.Tables[7].Rows[n].Product_Name + '- Yield : ' + jsonData.Tables[7].Rows[n].Support_Quantity + ',Potential:-' + jsonData.Tables[7].Rows[n].Potential_Quantity + ' - (' + jsonData.Tables[7].Rows[n].Date + ')';
                content += "<div class='dvWidth dvPadding'>" + (parseInt(n) + 1) + '. ' + productmapping + "</div>";
            }
        }
        //<div style="width: 100%;">1. LORUP PLUS 10T -Yield : 0,Potentail :0 - ( 25/12/2012)</div>
        //<div style="width: 100%;">2. ZIFI 200MG 10T -Yield : 2,Potentail :5 - ( 25/12/2012)</div>
        //<div style="width: 100%;">3. ZIFI CV 200 10T -Yield : 1,Potentail :2 - ( 25/12/2012)</div>
        content += " </div>";
        //Yield Potential

        content += " <div class='dvWidth'>";
        content += "<div class='dvWidth fontBold'>Yield &  Potential</div>";

        if (jsonData.Tables[6] != undefined) {
            var arMyProduct = new Array();
            for (var l = 0; l < jsonData.Tables[6].Rows.length; l++) {
                if ($.inArray(jsonData.Tables[6].Rows[l].Product_Code, arMyProduct) == -1) {
                    arMyProduct.push(jsonData.Tables[6].Rows[l].Product_Code);
                    // var rcpaProd = jsonData.Tables[6].Rows[l].Product_Name + ' - ' + jsonData.Tables[6].Rows[l].MyQty;
                    // content += "<div class='dvWidth'>" + rcpaProd + " </div>";
                }
            }
            if (arMyProduct.length > 0) {
                for (var p = 0; p < arMyProduct.length; p++) {
                    var disComProJson = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Product_Code=='" + arMyProduct[p] + "')]");
                    if (disComProJson.length > 0) {
                        var rcpaProd = disComProJson[0].Product_Name + ' - ' + disComProJson[0].MyQty;
                        content += "<div class='dvWidth'> My Product</div>";
                        content += "<div class='dvWidth'>" + rcpaProd + " </div>";
                        content += "<div class='dvWidth'>Competitor Product Name</div>";
                        for (var q = 0; q < disComProJson.length; q++) {
                            var comPro = disComProJson[q].Competitor_Product_Name + ' - ' + disComProJson[q].Comp_Qty;
                            content += "<div class='dvWidth dvPadding'>" + comPro + " </div>";
                        }
                    }
                }
            }
        }
        content += "</div>";
        //Remarks
        content += "<div class='dvWidth'>";
        content += "<div class='dvWidth fontBold'>Remarks: </div>";
        if (jsonData.Tables[8] != undefined) {
            for (var m = 0; m < jsonData.Tables[8].Rows.length; m++) {
                if (jsonData.Tables[8].Rows[m].Remarks_By_User != null && jsonData.Tables[8].Rows[m].Remarks_By_User != '') {
                    content += "<div class='dvWidth'>" + (parseInt(m) + 1) + "." + jsonData.Tables[8].Rows[m].Remarks_By_User + "-(" + jsonData.Tables[8].Rows[m].Date + ")</div>";
                }
            }
        }
        content += "</div></div>";
    }
    else {
        content = "No data available";
    }

    $("#dvReport360").html(content).trigger('create');
}

function fnGetChildUser() {
    $.mobile.loading('show');
    $("#dvUserList").html("")
    var userName = $('#UserName').val();
    if ($("#UserName").val() == "") {
        fnMsgAlert('info', 'Report Home', 'please enter 3 letters.');
        fnErrorIndicator("#UserName");
        $.mobile.loading('hide');
        return false;
    }
    if ($('#UserName').val().length < 3) {
        fnMsgAlert('info', 'Report Home', 'please enter 3 letters.');
        fnErrorIndicator("#UserName");
        $.mobile.loading('hide');
        return false;
    }
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetChildUserDetails',
        data: "userName=" + userName,
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');

            if (jsonData.Tables[0].Rows.length > 0) {

                lstCustCont = '<div data-role="content">';
                lstCustCont += '<ul id="lstCustomer" data-role="listview" data-divider-theme="a" data-inset="true">';
                lstCustCont += ' <li data-role="list-divider" role="heading">Child User Name</li>';
                for (var i = 0; i < jsonData.Tables[0].Rows.length; i++) {

                    lstCustCont += '<li data-theme="c">';
                    lstCustCont += '<a href="#" data-transition="turn" onclick="fnGetUserCode(\'' + jsonData.Tables[0].Rows[i]["User_Code"] + '\',this)">' + jsonData.Tables[0].Rows[i]["User_Name"] + '</a>';
                    lstCustCont += '</li>';
                }
                lstCustCont += '</ul>';
                lstCustCont += '</div>';
                $("#dvUserList").html(lstCustCont).trigger('create');

            }
            else {
                $("#dvUserList").html("<span style='color:red;'>No search result found.</span>").trigger('create');
            }
            $.mobile.loading('hide');
        },
        error: function (e) {
            $.mobile.loading('hide');
        }

    });
}




function fnGetUserCode(userCode, id) {
    if ($("#radio-choice-1").attr('checked') == "checked") {
        $.mobile.changePage("/HiDoctor_Activity/MobileReports/TPHeader/?userCode=" + userCode + "", {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
    else if ($("#radio-choice-2").attr('checked') == "checked") {
        $.mobile.loading('show');
        $.mobile.changePage("/HiDoctor_Activity/MobileReports/ActivitySummaryHeader/?userCode=" + userCode + "", {
            type: "post",
            reverse: false,
            changeHash: false
        });
        $.mobile.loading('hide');
    }
    else if ($("#radio-choice-3").attr('checked') == "checked") {
        $.mobile.loading('show');
        $.mobile.changePage("/HiDoctor_Activity/MobileReports/UserPerDayReort/?userCode=" + userCode + "&userName=" + $(id).html(), {
            type: "post",
            reverse: false,
            changeHash: false
        });
        $.mobile.loading('hide');
    }
}

function fnActivitySummaryHeader(userCode) {
    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetActivitySummarReport',
        data: "userCode=" + userCode + "",
        success: function (jsonData) {
            if (jsonData != '') {
                $("#dvReportActivitySummaryHeader").html(jsonData).trigger('create');
            }
            else {
                $.mobile.loading('hide');
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
        }

    });
}

function fnGoToActivitySummaryDetail(val) {

    $.mobile.changePage("/HiDoctor_Activity/MobileReports/ActivitySummaryDetail/?userDetails=" + val + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnActivitySummaryDetail(userDetail) {
    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetActivitySummarDetailReport',
        data: "userDetails=" + userDetail + "",
        success: function (jsonData) {
            if (jsonData != '') {
                $("#dvReportActivitySummaryDetails").html(jsonData);
                $("#dvReportActivitySummaryDetails").trigger('create');
                $.mobile.loading('hide');
            }
            else {
                $.mobile.loading('hide');
            }
        },
        error: function (e) {
            $.mobile.loading('hide');
        }
    });
}

function fnGoToActivitySummary() {
    $.mobile.changePage("/HiDoctor_Activity/MobileReports/ActivitySummaryHeader/?userCode=" + userDetail.split('_')[0] + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnTourPlannerHeader() {
    $.mobile.changePage("/HiDoctor_Activity/MobileReports/TPHeader/?userCode=" + userCode + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnGetChildUserCheck() {

    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileReports/GetChildUserCheck',
        data: "A",
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');
            if (jsonData.Tables[0].Rows.length > 1) {
                $("#dvChildUser").show();
            }
            else {
                $("#dvChildUser").hide();

            }
        },
        error: function (e) {
            $.mobile.loading('hide');
        }

    });
}


//**************** USER PER DAY REPORT - START *********************************

function fnBindMobileUserPerDayReport() {
    if ($.trim($("#txtReportDate").val()) == "") {
        fnMsgAlert('error', 'DCR Approval', 'Please enter date');
        return false;
    }
    if ($.trim($("#txtReportMonth").val()) == "") {
        fnMsgAlert('error', 'DCR Approval', 'Please enter month');
        return false;
    }
    if ($.trim($("#txtReportYear").val()) == "") {
        fnMsgAlert('error', 'DCR Approval', 'Please enter year');
        return false;
    }
    var date = $("#txtReportYear").val() + "-" + $("#txtReportMonth").val() + "-" + $("#txtReportDate").val();
    var dateObj = new Date(date);
    if (dateObj == "Invalid Date") {
        fnMsgAlert('error', 'DCR Approval', 'Please enter valid DCR Date');
        return false;
    }

    if (($("#txtReportMonth").val() == 4 || $("#txtReportMonth").val() == 6 || $("#txtReportMonth").val() == 9 || $("#txtReportMonth").val() == 11) && $("#txtReportDate").val() == 31) {
        fnMsgAlert('error', 'DCR Leave', 'Please enter valid To Date.');
        return false;
    }
    if ($("#txtReportMonth").val() == 2) {
        var isleap = ($("#txtReportYear").val() % 4 == 0 && ($("#txtReportYear").val() % 100 != 0 || $("#txtReportYear").val() % 400 == 0));
        if ($("#txtReportDate").val() > 29 || ($("#txtReportDate").val() == 29 && !isleap)) {
            fnMsgAlert('error', 'DCR Leave', 'Please enter valid To Date.');
            return false;
        }
    }

    fnBindUserPerDayDCRDetails();

    // end
}

function fnBindUserPerDayDCRDetails() {
    $("#dv-dcrappliedusers").css('display', 'none');
    var flag = "";
    if ($('#drpUserPerDayFlag').val().toUpperCase() == "FIELD") {
        flag = "F"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "ATTENDANCE") {
        flag = "A"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "FIELD_RCPA") {
        flag = "F"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "LEAVE") {
        flag = "L"
    }

    var date = $("#txtReportYear").val() + "-" + $("#txtReportMonth").val() + "-" + $("#txtReportDate").val();
    $.ajax({
        type: 'POST',
        data: 'dcrActualDate=' + date + "&flag=" + flag + "&username=" + $("#hdnUserPerDayUserName").val() + "&usercode=" + $("#hdnUserPerDayUserCode").val() + "&regioncode=" + $("#hdnUserPerDayRegionCode").val() + "",
        url: '/HiDoctor_Activity/DCRApproval/GetUserInstantReport',
        success: function (response) {
            // we have the response
            fnUserPerDayDCRDeatils(eval('(' + response + ')'));
        },
        error: function (e) {
            alert("Eror" + e);
        }
    });
}

function fnUserPerDayDCRDeatils(jsonData) {
    debugger;
    upd_g = jsonData;
    var flag = "";

    if ($('#drpUserPerDayFlag').val().toUpperCase() == "FIELD") {
        flag = "F"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "ATTENDANCE") {
        flag = "A"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "FIELD_RCPA") {
        flag = "F"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "LEAVE") {
        flag = "L"
    }
    $("#dv-alert").css('display', 'none');
    $("#dv-dcrdetails").css('display', '');
    $('#dvDCRDate').css('display', '');
    $('#dvDCRStatus').css('display', '');
    $('#dvDCRActicity').css('display', '');
    $('#dvDCREnteredDate').css('display', '');
    
    if (jsonData != null && jsonData != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            if (flag == "F") {
                $("#dv-dcrSubDetails").css('display', '');
                $("#dv-result").css('display', 'none');

                $("#spnDCRDate").html(jsonData.Tables[0].Rows[0].DCR_Actual_Date)
                if (jsonData.Tables[0].Rows[0].DCR_Status == '1') {
                    $("#spnDCRStatus").html('Applied');
                }
                else if (jsonData.Tables[0].Rows[0].DCR_Status == '2') {
                    $("#spnDCRStatus").html('Approved');
                }
                else if (jsonData.Tables[0].Rows[0].DCR_Status == '0') {
                    $("#spnDCRStatus").html('Unapproved');
                }
                else if (jsonData.Tables[0].Rows[0].DCR_Status == '3') {
                    $("#spnDCRStatus").html('Drafted');
                }

                if (jsonData.Tables[0].Rows[0].Flag == 'F') {
                    if (jsonData.Tables[0].Rows[0].Is_RCPA == 'Y') {
                        $("#spnDCRActicity").html('Field RCPA');
                    }
                    else {
                        $("#spnDCRActicity").html('Field');
                    }
                }
                else if (jsonData.Tables[0].Rows[0].Flag == 'A') {
                    $("#spnDCRActicity").html('Attendance');
                }
                else if (jsonData.Tables[0].Rows[0].Flag == 'L') {
                    $("#spnDCRActicity").html('Leave');
                }
                $("#spnDCREnteredDate").html(jsonData.Tables[0].Rows[0].DCR_Entered_Date)

                $('#dvCP').css('display', '');
                $("#spnCPName").html(jsonData.Tables[0].Rows[0].CP_Name)
                $("#spnCategory").html(jsonData.Tables[0].Rows[0].Category)
                $("#spnWorkPlace").html(jsonData.Tables[0].Rows[0].Place_Worked)
                var startTime = jsonData.Tables[0].Rows[0].User_Start_Time == null ? 'N/A' : jsonData.Tables[0].Rows[0].User_Start_Time;
                var endTime = jsonData.Tables[0].Rows[0].User_End_Time == null ? 'N/A' : jsonData.Tables[0].Rows[0].User_End_Time;

                $("#spnTiming").html(startTime + " - " + endTime)


                var DcrcommonRemarks = "";
                if (jsonData.Tables[0].Rows[0].DCR_general_Remarks == null || jsonData.Tables[0].Rows[0].DCR_general_Remarks == "" || jsonData.Tables[0].Rows[0].DCR_general_Remarks == "^" || jsonData.Tables[0].Rows[0].DCR_general_Remarks == "^^" || jsonData.Tables[0].Rows[0].DCR_general_Remarks == "^^^") {
                    var DcrcommonRemarks = ""

                }
                else {

                    DcrcommonRemarks = jsonData.Tables[0].Rows[0].DCR_general_Remarks
                    DcrcommonRemarks = DcrcommonRemarks.replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                    DcrcommonRemarks = DcrcommonRemarks.replace("^", "<br />");//.replace(/\^/g, '<br />');
                    DcrcommonRemarks = DcrcommonRemarks.replace("~", " - ");//.replace(/~/g, ' - ');
                    DcrcommonRemarks = DcrcommonRemarks.replace(/\^/g, '<br />');
                }


                $("#spnDCRRemarks").html(DcrcommonRemarks)

                $("#hdnUserPerDayDCRCode").val(jsonData.Tables[0].Rows[0].DCR_Code);

                $('#dv-Accomp').css('display', '');
                var accompanist = "";
                if (jsonData.Tables[0].Rows[0].Person_Code != null && jsonData.Tables[0].Rows[0].Person_Code != "") {
                    accompanist = jsonData.Tables[0].Rows[0].Person_Code + " (" + jsonData.Tables[0].Rows[0].Accomp_Start_Time + " - " + jsonData.Tables[0].Rows[0].Accomp_End_Time + ") ,";
                }
                if (jsonData.Tables[0].Rows[0].Acc2_User_Code != null && jsonData.Tables[0].Rows[0].Acc2_User_Code != "") {
                    accompanist += jsonData.Tables[0].Rows[0].Acc2_User_Code + " (" + jsonData.Tables[0].Rows[0].Acc2_Start_Time + " - " + jsonData.Tables[0].Rows[0].Acc2_End_Time + ") ,";
                }
                if (jsonData.Tables[0].Rows[0].Acc_3_Person != null && jsonData.Tables[0].Rows[0].Acc_3_Person != "") {
                    accompanist += jsonData.Tables[0].Rows[0].Acc_3_Person + " (" + jsonData.Tables[0].Rows[0].Acc_3_Time.split('_')[0] + " - " + jsonData.Tables[0].Rows[0].Acc_3_Time.split('_')[1] + ") ,";
                }
                if (jsonData.Tables[0].Rows[0].Acc_4_Person != null && jsonData.Tables[0].Rows[0].Acc_4_Person != "") {
                    accompanist += jsonData.Tables[0].Rows[0].Acc_4_Person + " (" + jsonData.Tables[0].Rows[0].Acc_4_Time.split('_')[0] + " - " + jsonData.Tables[0].Rows[0].Acc_4_Time.split('_')[1] + ") ,";
                }

                if (accompanist == "") {
                    accompanist = "- No accompanist details found -"
                }
                $("#spnAccompanist").html(accompanist);

                //Only for field
                if (flag == "F") {
                    $("#dv-Accomp").css('display', '');
                    $("#dvcategory").css('display', '');
                    $("#dvworkplace").css('display', '');
                    $("#dvTime").css('display', '');
                    $("#dvCP").css('display', '');
                    $("#dvDoctor").css('display', '');
                    $("#dvChemist").css('display', '');
                    $("#dvStockiest").css('display', '');
                    $("#dvExpense").css('display', '');
                    $("#dvSFC").css('display', '');

                    $("#dvLeave").css('display', 'none');
                    $("#dvactivity").css('display', 'none');

                    $("#dv-doctors").html('');
                    $("#dv-stockiest").html('');
                    $("#dv-chemist").html('');
                    $("#dv-expenses").html('');
                    $("#dv-sfc").html('');

                    var sfcContent = "";
                    if (jsonData.Tables[0].Rows[0].Category == "HQ") {
                        sfcContent += '<div style="clear:both"></div><div class="dv-comp-border">'
                        sfcContent += '<div class="ui-block-a dv-bold-width">1 . From Place : ' + jsonData.Tables[0].Rows[0].From_Place + '</div><div style="clear:both"></div>';
                        sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[0].Rows[0].To_Place + '</div><div style="clear:both"></div>';
                        sfcContent += '<div class="ui-block-a" style="width:100%">Distance : ' + jsonData.Tables[0].Rows[0].Travelled_Kms + '</div><div style="clear:both"></div>';
                        sfcContent += '<div class="ui-block-a" style="width:100%">Travel Mode : ' + jsonData.Tables[0].Rows[0].Travel_Mode + '</div><div style="clear:both"></div>';
                        sfcContent += '</div><div style="clear:both"></div>'
                    }
                    else {
                        if (jsonData.Tables[1].Rows.length > 0) {
                            for (var s = 0; s < jsonData.Tables[1].Rows.length; s++) {
                                sfcContent += '<div style="clear:both"></div><div class="dv-comp-border">'
                                if (jsonData.Tables[1].Rows[s].Route_Way == "R") {
                                    sfcContent += '<div class="ui-block-a dv-bold-width">' + (s + 1) + ' . From Place : ' + jsonData.Tables[1].Rows[s].To_Place + '</div><div style="clear:both"></div>';
                                    sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[1].Rows[s].From_Place + '</div><div style="clear:both"></div>';
                                }
                                else {
                                    sfcContent += '<div class="ui-block-a dv-bold-width">' + (s + 1) + ' . From Place : ' + jsonData.Tables[1].Rows[s].From_Place + '</div><div style="clear:both"></div>';
                                    sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[1].Rows[s].To_Place + '</div><div style="clear:both"></div>';
                                }
                                sfcContent += '<div class="ui-block-a" style="width:100%">Distance : ' + jsonData.Tables[1].Rows[s].Distance + '</div><div style="clear:both"></div>';
                                sfcContent += '<div class="ui-block-a" style="width:100%">Travel Mode : ' + jsonData.Tables[1].Rows[s].Travel_Mode + '</div><div style="clear:both"></div>';
                                sfcContent += '</div><div style="clear:both"></div>'
                            }
                        }
                    }
                    if (sfcContent != "") {
                        $("#dv-sfc").html(sfcContent);
                    }
                    else {
                        $("#dv-sfc").html('<div class="dv-comp-border">No SFC Details found</div>');
                    }


                    var doccontent = ""
                    var siNo = 1;
                    if (jsonData.Tables[2].Rows.length > 0) {
                        //to bind the doctos details
                        for (var d = 0; d < jsonData.Tables[2].Rows.length; d++) {
                            var doctor_visit_code = jsonData.Tables[2].Rows[d].DCR_Visit_Code;
                            var pob = 0;
                            if (jsonData.Tables[2].Rows[d].PO_Amount != null) {
                                pob = jsonData.Tables[2].Rows[d].PO_Amount;
                            }
                            
                            var vTvm = "AM";
                            var vistTime = jsonData.Tables[2].Rows[d].Doctor_Visit_Time == null ? '' : jsonData.Tables[2].Rows[d].Doctor_Visit_Time;
                            if (vistTime.length > 0) {
                                var varr = vistTime.split(' ');
                                if (varr.length > 1) {
                                    if (varr[1].toUpperCase() == "PM" || varr[1].toUpperCase() == "AM") {
                                        vTvm = jsonData.Tables[2].Rows[d].Doctor_Visit_Time;
                                    }
                                }
                                else {
                                    vTvm = vistTime + ' ' + jsonData.Tables[2].Rows[d].Visit_Mode
                                }
                            }
                            else {
                                vTvm = jsonData.Tables[2].Rows[d].Visit_Mode == null ? "AM" : jsonData.Tables[2].Rows[d].Visit_Mode;
                            }

                            doccontent += '<div class="ui-block-a" style="border:1px solid #999;background-color:#fbfbcb;width:93%"><div class="ui-block-a dv-bold-width" >' + siNo + ' . ' + jsonData.Tables[2].Rows[d].Doctor_Name + ',' + jsonData.Tables[2].Rows[d].MDL_Number + ',' + jsonData.Tables[2].Rows[d].Speciality_Name + '<br />POB Amount: ' + pob + ' <br />Visit Time: ' + vTvm + '<br />Remarks: ' + jsonData.Tables[2].Rows[d].Remarks_By_User + '</div>';

                            var onlyAccName = jsonPath(jsonData, "$.Tables[9].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                            if (onlyAccName != false) {
                                var Accslno = 0;
                                doccontent += '<div class="ui-block-a dv-bold-width">Accompanist(s):</div>';
                                for (var o = 0; o < onlyAccName.length; o++) {
                                    Accslno++
                                    if (onlyAccName[o].Is_Only_For_Doctor.toUpperCase() == "Y") {
                                        doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '(only for doctor) </div>';
                                    }
                                    else {
                                        doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '</div>';
                                    }
                                }
                            }


                            //to get the products fro the doctor
                            if (jsonData.Tables[4].Rows.length > 0) {
                                var product = jsonPath(jsonData, "$.Tables[4].Rows[?(@.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                                if (product != false) {
                                    doccontent += '<div class="ui-block-a dv-bold-width">Sample/Promotional items:</div>';
                                    for (var p = 0; p < product.length; p++) {
                                        doccontent += '<div class="ui-block-a dv-product">' + product[p].Product_Name + '(' + product[p].Quantity_Provided + ')' + '</div>';
                                    }

                                }
                            }

                            var productDetail = jsonPath(jsonData, "$.Tables[10].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                            if (productDetail != false) {
                                doccontent += '<div class="ui-block-a dv-bold-width">Detailed Products:</div>';
                                var slno = 0;
                                for (var x = 0; x < productDetail.length; x++) {
                                    slno++
                                    doccontent += '<div class="ui-block-a dv-product">' + slno + ' . ' + productDetail[x].Product_Name + '</div>';
                                }
                            }

                            var chemist = jsonPath(jsonData, "$.Tables[5].Rows[?(@.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                            if (chemist != false) {
                                doccontent += '<div class="ui-block-a dv-bold-width">' + chemist_caption + ':</div>';

                                var saleProduct = new Array();
                                for (var c = 0; c < chemist.length; c++) {
                                    var chemist_visit_code = chemist[c].DCR_Chemists_Code
                                    doccontent += '<div class="ui-block-a dv-product">' + chemist[c].Chemists_Name + '</div><div class="ui-block-a dv-product">POB : ' + chemist[c].PO_Amount + '</div>';

                                    if (jsonData.Tables[6].Rows.length > 0) {
                                        var rcpasalesprod = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Chemist_Visit_Code=='" + chemist_visit_code + "' & @.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                                        if (rcpasalesprod != false) {
                                            //to get the sales products
                                            for (var r = 0; r < rcpasalesprod.length; r++) {
                                                if ($.inArray(rcpasalesprod[r].DCR_Product_Code, saleProduct) == -1) {
                                                    saleProduct.push(rcpasalesprod[r].DCR_Product_Code)
                                                }
                                            }
                                        }
                                        if (saleProduct.length > 0) {
                                            for (var p = 0; p < saleProduct.length; p++) {
                                                //var rcpasalesprod = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Chemist_Visit_Code=='" + jsonData.Tables[5].Rows[c].DCR_Chemists_Code + "' & @.Product_Code=='" + saleProduct[p].toString() + "')]");
                                                var rcpa = jsonPath(rcpasalesprod, "$.[?( @.DCR_Product_Code=='" + saleProduct[p].toString() + "')]");
                                                if (rcpa != null && rcpa != false) {

                                                    doccontent += '<div class="ui-block-a dv-bold-width" style="margin-left:2%;">RCPA : ' + rcpa[0].Product_Name + "</div>";

                                                    doccontent += '<div style="clear:both"></div><div class="dv-comp-border" style="margin-left:3%;">'
                                                    for (r = 1; r < rcpa.length; r++) {
                                                        doccontent += '<div class="ui-block-a" style="width:100%">Comp : ' + rcpa[r].Competitor_Product_Name + " (" + rcpa[r].Support_Qty + ") </div><br />";
                                                    }
                                                    doccontent += '</div><div style="clear:both"></div>'
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        doccontent += '<div class="ui-block-a dv-bold-width" style="margin-left:2%;">RCPA : No RCPA Found.</div>';
                                    }


                                }
                            }
                            else {
                                doccontent += '<div class="ui-block-a dv-bold-width">'+chemist_caption+':</div><div>No '+chemist_caption+' Details Found.</div>';
                            }

                            doccontent += "</div>"
                            siNo++;
                        }
                    }

                    if (jsonData.Tables[3].Rows.length > 0) {

                        //to bind the doctos details
                        for (var d = 0; d < jsonData.Tables[3].Rows.length; d++) {
                            var pob = 0;
                            var doctor_visit_code = jsonData.Tables[3].Rows[d].DCR_Visit_Code;
                            if (jsonData.Tables[3].Rows[d].PO_Amount != null) {
                                pob = jsonData.Tables[3].Rows[d].PO_Amount;
                            }

                            var vTvm = "AM";
                            var vistTime = jsonData.Tables[3].Rows[d].Doctor_Visit_Time == null ? '' : jsonData.Tables[3].Rows[d].Doctor_Visit_Time;
                            if (vistTime.length > 0) {
                                var varr = vistTime.split(' ');
                                if (varr.length > 1) {
                                    if (varr[1].toUpperCase() == "PM" || varr[1].toUpperCase() == "AM") {
                                        vTvm = jsonData.Tables[3].Rows[d].Doctor_Visit_Time;
                                    }
                                }
                                else {
                                    vTvm = vistTime + ' ' + jsonData.Tables[3].Rows[d].Visit_Mode
                                }
                            }
                            else {
                                vTvm = jsonData.Tables[3].Rows[d].Visit_Mode == null ? "AM" : jsonData.Tables[3].Rows[d].Visit_Mode;
                            }
                            doccontent += '<div class="ui-block-a" style="border:1px solid #999;background-color:#fbfbcb;width:93%"><div class="ui-block-a dv-bold-width">' + siNo + ' . ' + jsonData.Tables[3].Rows[d].Doctor_Name + ',' + jsonData.Tables[3].Rows[d].MDL_Number + ',' + jsonData.Tables[3].Rows[d].Speciality_Name + '<br />POB Amount: ' + pob + ' <br />Visit Time: ' + vTvm + '<br />Remarks: ' + jsonData.Tables[3].Rows[d].Remarks_By_User + '</div>';

                            // Accompanist
                            var onlyAccName = jsonPath(jsonData, "$.Tables[9].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                            if (onlyAccName != false) {
                                var Accslno = 0;
                                doccontent += '<div class="ui-block-a dv-bold-width">Accompanist(s):</div>';
                                for (var o = 0; o < onlyAccName.length; o++) {
                                    Accslno++
                                    if (onlyAccName[o].Is_Only_For_Doctor.toUpperCase() == "Y") {
                                        doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '(only for doctor) </div>';
                                    }
                                    else {
                                        doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '</div>';
                                    }
                                }
                            }

                            //to get the products fro the doctor
                            if (jsonData.Tables[4].Rows.length > 0) {
                                var product = jsonPath(jsonData, "$.Tables[4].Rows[?(@.DCR_Visit_Code=='" + jsonData.Tables[3].Rows[d].DCR_Visit_Code + "')]");
                                if (product != false) {
                                    doccontent += '<div class="ui-block-a dv-bold-width">Sample/Promotional items</div>';
                                    for (var p = 0; p < product.length; p++) {
                                        doccontent += '<div class="ui-block-a dv-product">' + product[p].Product_Name + '(' + product[p].Quantity_Provided + ')' + '</div>';
                                    }
                                }
                            }

                            var productDetail = jsonPath(jsonData, "$.Tables[10].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                            if (productDetail != false) {
                                doccontent += '<div class="ui-block-a dv-bold-width">Detailed Products:</div>';
                                var slno = 0;
                                for (var x = 0; x < productDetail.length; x++) {
                                    slno++
                                    doccontent += '<div class="ui-block-a dv-product">' + slno + ' . ' + productDetail[x].Product_Name + '</div>';
                                }
                            }

                            var chemist = jsonPath(jsonData, "$.Tables[5].Rows[?(@.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                            if (chemist != false) {
                                doccontent += '<div class="ui-block-a dv-bold-width">Chemists:</div>';

                                var saleProduct = new Array();
                                for (var c = 0; c < chemist.length; c++) {
                                    var chemist_visit_code = chemist[c].DCR_Chemists_Code
                                    doccontent += '<div class="ui-block-a dv-product">' + chemist[c].Chemists_Name + '</div><div class="ui-block-a dv-product">POB : ' + chemist[c].PO_Amount + '</div>';
                                    // RCPA Details.
                                    if (jsonData.Tables[6].Rows.length > 0) {
                                        var rcpasalesprod = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Chemist_Visit_Code=='" + chemist_visit_code + "' & @.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                                        if (rcpasalesprod != false) {
                                            //to get the sales products
                                            for (var r = 0; r < rcpasalesprod.length; r++) {
                                                if ($.inArray(rcpasalesprod[r].DCR_Product_Code, saleProduct) == -1) {
                                                    saleProduct.push(rcpasalesprod[r].DCR_Product_Code)
                                                }
                                            }
                                        }
                                        if (saleProduct.length > 0) {
                                            for (var p = 0; p < saleProduct.length; p++) {
                                                //var rcpasalesprod = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Chemist_Visit_Code=='" + jsonData.Tables[5].Rows[c].DCR_Chemists_Code + "' & @.Product_Code=='" + saleProduct[p].toString() + "')]");
                                                var rcpa = jsonPath(rcpasalesprod, "$.[?( @.DCR_Product_Code=='" + saleProduct[p].toString() + "')]");
                                                if (rcpa != false) {

                                                    doccontent += '<div class="ui-block-a dv-bold-width" style="margin-left:2%;">RCPA : ' + rcpa[0].Product_Name + "</div>";

                                                    doccontent += '<div style="clear:both"></div><div style="margin-left:3%;">'
                                                    for (r = 1; r < rcpa.length; r++) {
                                                        doccontent += '<div class="ui-block-a" style="width:100%">Comp : ' + rcpa[r].Competitor_Product_Name + " (" + rcpa[r].Support_Qty + ") </div><br />";
                                                    }
                                                    doccontent += '</div><div style="clear:both"></div>'
                                                }
                                            }

                                        }
                                        else {
                                            doccontent += '<div class="ui-block-a dv-bold-width" style="margin-left:2%;">RCPA : No RCPA Found.</div>';
                                        }
                                    }
                                    else {

                                    }

                                }
                            }
                            else {
                                doccontent += '<div class="ui-block-a dv-bold-width">' + chemist_caption + ':</div><div>No ' + chemist_caption + ' Details Found.</div>';
                            }
                            doccontent += "</div>"
                            siNo++
                        }

                    }
                }
                if (doccontent != "") {
                    $("#dv-doctors").html(doccontent).trigger('create');
                }
                else {
                    $("#dv-doctors").html('<div class="">No '+doctor_caption+' Details found</div>')
                }
            }
            else {
                // Attendance
                if (flag == "A") {
                    $("#spnDCRDate").html(jsonData.Tables[0].Rows[0].DCR_Actual_Date)
                    if (jsonData.Tables[0].Rows[0].DCR_Status == '1') {
                        $("#spnDCRStatus").html('Applied');
                    }
                    else if (jsonData.Tables[0].Rows[0].DCR_Status == '2') {
                        $("#spnDCRStatus").html('Approved');
                    }
                    else if (jsonData.Tables[0].Rows[0].DCR_Status == '0') {
                        $("#spnDCRStatus").html('Unapproved');
                    }
                    else if (jsonData.Tables[0].Rows[0].DCR_Status == '3') {
                        $("#spnDCRStatus").html('Drafted');
                    }

                    if (jsonData.Tables[0].Rows[0].Flag == 'A') {
                        $("#spnDCRActicity").html('Attendance');
                    }
                    $("#spnDCREnteredDate").html(jsonData.Tables[0].Rows[0].DCR_Entered_Date)
                    $('#dvCP').css('display', 'none');
                    $("#spnCPName").html("");
                    $("#spnCategory").html(jsonData.Tables[0].Rows[0].Category)
                    $("#spnWorkPlace").html(jsonData.Tables[0].Rows[0].Place_Worked)
                    var startTime = jsonData.Tables[0].Rows[0].User_Start_Time == null ? 'N/A' : jsonData.Tables[0].Rows[0].User_Start_Time;
                    var endTime = jsonData.Tables[0].Rows[0].User_End_Time == null ? 'N/A' : jsonData.Tables[0].Rows[0].User_End_Time;
                    $('#spnAccompanist').html('');
                    $('#dv-Accomp').css('display', 'none');
                    $("#spnTiming").html(startTime + " - " + endTime);
                    $("#hdnUserPerDayDCRCode").val(jsonData.Tables[0].Rows[0].DCR_Code);
                }
            }
        }
        else {
            $("#dv-result").html('No DCR Details found');
            $("#dv-result").css('display', '');
            $('#dv-dcrSubDetails').css('display', 'none');
        }


        //stockiest visit
        if (flag == "F") {
            var stockiestContent = "";
            if (jsonData.Tables.length > 0 && jsonData.Tables[7] != null && jsonData.Tables[7].Rows != null && jsonData.Tables[7].Rows.length > 0) {
                for (var s = 0; s < jsonData.Tables[7].Rows.length; s++) {
                    stockiestContent += '<div class="ui-block-a" style="width:100%">' + (s + 1) + ' . ' + jsonData.Tables[7].Rows[s].Stockiest_Name + '<br />POB: ' + jsonData.Tables[7].Rows[s].PO_Amount + '<br />Collection: ' + jsonData.Tables[7].Rows[s].Collection_Amount + '<br />Remarks: ' + jsonData.Tables[7].Rows[s].Remarks_By_User + '</div>';
                }
            }
            if (stockiestContent != "") {
                $("#dv-stockiest").html(stockiestContent);
            }
            else {
                $("#dv-stockiest").html('<div class="dv-comp-border">No ' + stockist_caption + ' Details found</div>');
            }
        }

        //stockiest visit
        if (flag != "L") {
            var expenseContent = "";
            if (jsonData.Tables.length > 0 && jsonData.Tables[8] != null && jsonData.Tables[8].Rows != null && jsonData.Tables[8].Rows.length > 0) {
                for (var e = 0; e < jsonData.Tables[8].Rows.length; e++) {
                    expenseContent += '<div class="ui-block-a" style="width:100%">' + (e + 1) + ' . ' + jsonData.Tables[8].Rows[e].Expense_Type_Name + ' - ' + jsonData.Tables[8].Rows[e].Expense_Amount + '<br />Remarks: ' + jsonData.Tables[8].Rows[e].Expense_Remarks + '</div>';
                }
            }
            if (expenseContent != "") {
                $("#dv-expenses").html(expenseContent);
            }
            else {
                $("#dv-expenses").html('<div class="dv-comp-border">No Expense Details found</div>');
            }

        }

        if (flag == "A") {
            $("#dvCP").css('display', 'none');
            $("#dvDoctor").css('display', 'none');
            $("#dvChemist").css('display', 'none');
            $("#dvStockiest").css('display', 'none');
            $("#dvExpense").css('display', 'none');
            $("#dvLeave").css('display', 'none');
            $("#dv-Accomp").css('display', 'none');
            $("#dv-doctors").html('');
            $("#dvSFC").css('display', '');
            $("#dvcategory").css('display', '');
            $("#dvworkplace").css('display', '');
            $("#dvTime").css('display', '');
            $("#dvactivity").css('display', '');
            $("#dv-sfc").html('');


            var sfcContent = "";
            if (jsonData.Tables[0].Rows[0].Category == "HQ") {
                sfcContent += '<div style="clear:both"></div><div class="dv-comp-border">'
                sfcContent += '<div class="ui-block-a dv-bold-width">1 . From Place : ' + jsonData.Tables[0].Rows[0].From_Place + '</div><div style="clear:both"></div>';
                sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[0].Rows[0].To_Place + '</div><div style="clear:both"></div>';
                sfcContent += '<div class="ui-block-a" style="width:100%">Distance : ' + jsonData.Tables[0].Rows[0].Travelled_Kms + '</div><div style="clear:both"></div>';
                sfcContent += '<div class="ui-block-a" style="width:100%">Travel Mode : ' + jsonData.Tables[0].Rows[0].Travel_Mode + '</div><div style="clear:both"></div>';
                sfcContent += '</div><div style="clear:both"></div>'
            }
            else {
                if (jsonData.Tables[1].Rows.length > 0) {
                    for (var s = 0; s < jsonData.Tables[1].Rows.length; s++) {
                        sfcContent += '<div style="clear:both"></div><div class="dv-comp-border">'
                        if (jsonData.Tables[1].Rows[s].Route_Way == "R") {
                            sfcContent += '<div class="ui-block-a dv-bold-width">' + (s + 1) + ' . From Place : ' + jsonData.Tables[1].Rows[s].To_Place + '</div><div style="clear:both"></div>';
                            sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[1].Rows[s].From_Place + '</div><div style="clear:both"></div>';
                        }
                        else {
                            sfcContent += '<div class="ui-block-a dv-bold-width">' + (s + 1) + ' . From Place : ' + jsonData.Tables[1].Rows[s].From_Place + '</div><div style="clear:both"></div>';
                            sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[1].Rows[s].To_Place + '</div><div style="clear:both"></div>';
                        }
                        sfcContent += '<div class="ui-block-a" style="width:100%">Distance : ' + jsonData.Tables[1].Rows[s].Distance + '</div><div style="clear:both"></div>';
                        sfcContent += '<div class="ui-block-a" style="width:100%">Travel Mode : ' + jsonData.Tables[1].Rows[s].Travel_Mode + '</div><div style="clear:both"></div>';
                        sfcContent += '</div><div style="clear:both"></div>'
                    }
                }
            }
            if (sfcContent != "") {
                $("#dv-sfc").html(sfcContent);
            }
            else {
                $("#dv-sfc").html('<div class="dv-comp-border">No SFC Details found</div>');
            }
            if (jsonData.Tables.length > 0) {
                if (jsonData.Tables[2] != null && jsonData.Tables[2].Rows != null && jsonData.Tables[2].Rows.length > 0) {
                    $("#dv-expenses").html('');
                    var expenseContent = "";
                    for (var e = 0; e < jsonData.Tables[2].Rows.length; e++) {
                        expenseContent += '<div class="ui-block-a" style="width:100%">' + (e + 1) + ' . ' + jsonData.Tables[2].Rows[e].Expense_Type_Name + ' - ' + jsonData.Tables[2].Rows[e].Expense_Amount + '<br />Remarks: ' + jsonData.Tables[2].Rows[e].Expense_Remarks + '</div>';
                    }
                }
                if (expenseContent != "") {
                    $("#dv-expenses").html(expenseContent);
                }
                else {
                    $("#dv-expenses").html('<div class="dv-comp-border">No Expense Details found</div>');
                }
            }
            else {
                $("#dv-expenses").html('<div class="dv-comp-border">No Expense Details found</div>');
            }
            $("#dv-expenses").css('display', '');
            $("#dvExpense").css('display', '');

            var expenseContent = "";
            if (jsonData.Tables[3].Rows.length > 0) {
                for (var a = 0; a < jsonData.Tables[3].Rows.length; a++) {
                    var remarks = jsonData.Tables[3].Rows[a].Remarks == null ? "" : jsonData.Tables[3].Rows[a].Remarks;
                    expenseContent += '<div style="clear:both"></div><div class="dv-comp-border">'
                    expenseContent += '<div class="ui-block-a dv-bold-width">' + (a + 1) + ' . ' + jsonData.Tables[3].Rows[a].Activity_Name + '(' + jsonData.Tables[3].Rows[a].Project_Name + ')</div><div style="clear:both"></div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%">Start Time : ' + jsonData.Tables[3].Rows[a].StartTime + '</div><div style="clear:both"></div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%">End Time : ' + jsonData.Tables[3].Rows[a].EndTime + '</div><div style="clear:both"></div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%">Remarks : ' + jsonData.Tables[3].Rows[a].Remarks + '</div><div style="clear:both"></div>';
                    expenseContent += '</div><div style="clear:both"></div>'
                }
            }

            $("#dv-activity").html(expenseContent);
        }
        if (flag == "L") {
            $("#dv-Accomp").css('display', 'none');
            $("#dvCP").css('display', 'none');
            $("#dvDoctor").css('display', 'none');
            $("#dvChemist").css('display', 'none');
            $("#dvStockiest").css('display', 'none');
            $("#dvExpense").css('display', 'none');
            $("#dvcategory").css('display', 'none');
            $("#dvworkplace").css('display', 'none');
            $("#dvTime").css('display', 'none');
            $("#dvactivity").css('display', 'none');
            $("#dvSFC").css('display', 'none');
            $('#dvDCRDate').css('display', 'none');
            $('#dvDCRStatus').css('display', 'none');
            $('#dvDCRActicity').css('display', 'none');
            $('#dvDCREnteredDate').css('display', 'none');

            $("#dvLeave").css('display', '');

            if (jsonData.Tables[0].Rows.length > 0) {
                $("#dv-Leave-header").html("<div style='clear:both'></div><div class='ui-block-a dv-bold-width'>DCR Date : " + jsonData.Tables[0].Rows[0].Date + "</div><div style='claer:both'></div>");
                $("#dv-Leave-header").append("<div class='ui-block-a dv-bold-width'>Reason : " + jsonData.Tables[0].Rows[0].Reason + "</div><div style='claer:both'></div>");
            }
            if (jsonData.Tables[1].Rows.length > 0) {
                $("#dv-Leave").html("<div class='ui-block-a dv-bold-width' id='dv-LeaveType'>" + jsonData.Tables[1].Rows[0].Leave_Type_Name + "</div><div style='claer:both'></div>");
            }
        }
    }

    else {
        $("#dv-dcrSubDetails").css('display', 'none');
        $("#dv-result").css('display', '');
        $("#dv-result").html('No DCR Details found');
    }
}


function fnNextDate(mode) {

    var flag = "";

    if ($('#drpUserPerDayFlag').val().toUpperCase() == "FIELD") {
        flag = "F"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "ATTENDANCE") {
        flag = "A"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "FIELD_RCPA") {
        flag = "F"
    }
    else if ($('#drpUserPerDayFlag').val().toUpperCase() == "LEAVE") {
        flag = "L"
    }

    var date = $("#txtReportYear").val() + "-" + $("#txtReportMonth").val() + "-" + $("#txtReportDate").val();

    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRApproval/GetPrevNextDCRDate',
        data: "Date=" + date + "&Flag=" + flag + "&Mode=" + mode + "&usercode=" + $("#hdnUserPerDayUserCode").val() + "",
        success: function (result) {
            result = eval('(' + result + ')');
            if (result.Tables[0].Rows[0].Date != "" && result.Tables[0].Rows[0].Date != null) {
                //var dcrDate = result.Tables[0].Rows[0].Date.split('/')[2].toString() + "-" + result.Tables[0].Rows[0].Date.split('/')[1].toString() + "-" + result.Tables[0].Rows[0].Date.split('/')[0].toString();
                //$("#txtDCRDate").val(dcrDate);

                $("#txtReportDate").val(result.Tables[0].Rows[0].Date.split('/')[0].toString());
                $("#txtReportMonth").val(result.Tables[0].Rows[0].Date.split('/')[1].toString());
                $("#txtReportYear").val(result.Tables[0].Rows[0].Date.split('/')[2].toString());

                var date = $("#txtReportYear").val() + "-" + $("#txtReportMonth").val() + "-" + $("#txtReportDate").val();

                $.ajax({
                    type: 'POST',
                    data: 'dcrActualDate=' + date + "&flag=" + flag + "&username=" + $("#hdnUserPerDayUserName").val() + "&usercode=" + $("#hdnUserPerDayUserCode").val() + "&regioncode=" + $("#hdnUserPerDayRegionCode").val() + "",
                    url: '/HiDoctor_Activity/DCRApproval/GetUserInstantReport',
                    success: function (response) {
                        // we have the response
                        fnUserPerDayDCRDeatils(eval('(' + response + ')'));
                    },
                    error: function (e) {
                        alert("Eror" + e);
                    }
                });
            }
            else {
                $("#dv-dcrSubDetails").css('display', 'none');
                $("#dv-result").css('display', '');
                $("#dv-result").html('No DCR Details found');
            }
        }
    });
}


//**************** USER PER DAY REPORT - END ***********************************