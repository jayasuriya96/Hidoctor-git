//CREATED BY: SRISUDHAN//
//Date : 16/04/2013//
//Marketing Campaign Report//
var aaa = "";

function fnGetMarketingCampaign() {


    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');
    $("#MaindivReport").empty();
    $("#divTrackerReport").empty();
    $("#divTrackerHeader").empty();
    $("#divVisitHeader").empty();
    $("#divVisitReport").empty();
    $("#SubdivReport").empty();
    $("#divCamDetail").empty();
    $("#divsubpopupReport").empty();
    
    
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'MarketingCampaign', 'Select start Date.');

        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'MarketingCampaign', 'Select End Date.');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {

        fnMsgAlert('info', 'MarketingCampaign', 'Start Month&Year should be less than End Month&Year');
        HideModalPopup("dvloading");
        return false;
    }

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetMarketingCampaign',
        type: "POST",
        data: "Usercode=" + $("#hdnMainUserCode").val() + '&sd=' + startDate + '&ed=' + endDate,
        success: function (response) {
            jsData = eval('(' + response + ')');
            aaa = jsData;
            var content = "";

            if (jsData.Tables !== undefined && jsData.Tables.length > 0 && jsData.Tables[1].Rows.length > 0) {
                content += "<table class='data display datatable' id='tbl_Campaignlist'>";
                content += "<thead>";
                content += "<tr style='display: none;' id='tblTr'>";
                content += "<th>Campaign Name</th>";
                content += "<th>Start Date</th>";
                content += "<th>End Date</th>";
                content += "<th>No of Months Marketing Campaign Planned</th>";
                content += "<th>Cycle Name</th>";
                content += "<th>Customer Category</th>";
                content += "<th>SpecialityName</th>";
                content += "<th>Customer Count</th>";
                content += "<th>Created Date</th>";
                content += "<th>No of Products specified in Marketing Campaign</th>";
                var type = '[{type : "text"},{type : "text"},{type : "text"},{ type: "number-range" },{type : "text"},{type : "text"},{type : "text"},{ type: "number-range" },{type : "text"},{ type: "number-range" }';

                if (jsData.Tables[0].Rows.length > 0) {
                    for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                        type += ', { type: "number-range" }';
                        content += "<th align='left'>No of " + jsData.Tables[0].Rows[j].User_Type_Name + " Participated </th>";
                    }
                }
                type += ', { type: "text" }]';
                content += "</tr>";
                content += "<tr>";
                content += "<th>Campaign Name</th>";
                content += "<th>Start Date</th>";
                content += "<th>End Date</th>";
                content += "<th>No of Months Marketing Campaign Planned</th>";
                content += "<th>Cycle Name</th>";
                content += "<th>Customer Category</th>";
                content += "<th>SpecialityName</th>";
                content += "<th>Customer Count</th>";
                content += "<th>Created Date</th>";
                content += "<th>No of Products specified in Marketing Campaign</th>";
                var iRow = 10;
                if (jsData.Tables[0].Rows.length > 0) {
                    for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                        iRow++;
                        content += "<th align='left'>No of " + jsData.Tables[0].Rows[j].User_Type_Name + " Participated </th>";
                    }
                }
                content += "</tr>";
                content += "<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                content += "</thead>";
                content += "<tbody>";
                for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td>" + jsData.Tables[1].Rows[i]["Campaign_Name"] + "</td>";
                    content += "<td>" + jsData.Tables[1].Rows[i]["Start_Date"] + "</td>";
                    content += "<td>" + jsData.Tables[1].Rows[i]["End_Date"] + "</td>";
                    //var diffMonth = monthDiff(jsData.Tables[1].Rows[i]["Start_Date"], jsData.Tables[1].Rows[i]["End_Date"]);
                    camstartDate = jsData.Tables[1].Rows[i]["Start_Date"].split('/')[2] + "-" + jsData.Tables[1].Rows[i]["Start_Date"].split('/')[1] + "-10";
                    camendDate = jsData.Tables[1].Rows[i]["End_Date"].split('/')[2] + "-" + jsData.Tables[1].Rows[i]["End_Date"].split('/')[1] + "-" + jsData.Tables[1].Rows[i]["End_Date"].split('/')[0];


                    var diffMonth = monthDiff(camstartDate, camendDate);
                    content += "<td  align='center'>" + diffMonth + "</td>";

                    content += "<td>" + ((jsData.Tables[1].Rows[i]["Cycle_Name"] == null) ? "" : jsData.Tables[1].Rows[i]["Cycle_Name"]) + "</td>";
                    content += "<td>" + jsData.Tables[1].Rows[i]["Customer_Category_Code"] + "</td>";
                    content += "<td>" + jsData.Tables[1].Rows[i]["Customer_Speciality_Code"] + "</td>";
                    content += "<td  align='center'>" + jsData.Tables[1].Rows[i]["Customer_Count"] + "</td>";
                    content += "<td>" + jsData.Tables[1].Rows[i]["Created_Date"] + "</td>";

                    var prodCnt = jsonPath(jsData, "$.Tables[2].Rows[?(@.Campaign_Code=='" + jsData.Tables[1].Rows[i]["Campaign_Code"] + "')]");
                    if (prodCnt != false && prodCnt !== undefined) {
                        content += "<td align='center' class='td-a' onclick='fnBrandInformation(\"" + jsData.Tables[1].Rows[i].Campaign_Code + "\")' >" + prodCnt[0]["Product_Count"] + "</td>";

                    }
                    else {
                        content += "<td align='center'></td>";
                    }



                    if (jsData.Tables[0].Rows.length > 0) {
                        for (var m = 0; m < jsData.Tables[0].Rows.length; m++) {
                            var userTypeCnt = jsonPath(jsData, "$.Tables[3].Rows[?(@.Campaign_Code=='" + jsData.Tables[1].Rows[i]["Campaign_Code"] + "' & @.User_Type_Code=='" + jsData.Tables[0].Rows[m]["User_Type_Code"] + "')]");
                            if (userTypeCnt != false && userTypeCnt !== undefined && userTypeCnt.length > 0) {
                                // content += "<td>" + userTypeCnt[0]["User_type_count"] + "</td>";
                                content += "<td align='center' class='td-a' onclick='fnCampaignInformation(\"" + jsData.Tables[1].Rows[i].Campaign_Code + "_" + jsData.Tables[0].Rows[m]["User_Type_Code"] + "\")' >" + userTypeCnt[0]["User_type_count"] + "</td>";
                            }
                            else {
                                content += "<td align='center'>0</td>";
                            }
                        }
                    }
                    content += "</tr>";
                }
                content += "</tbody>";
                content += "</table>";
                var jsonType = eval(type)
                //            if ($.fn.dataTable) { $('#tbl_Target').dataTable({ "sPaginationType": "full_numbers" }); };
                $("#MaindivReport").html(content);
                $("#divmainPrint").html(content);
                if ($.fn.dataTable) {
                    $('#tbl_Campaignlist').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });

                };


                fninializePrint("divmainPrint", "ifrmmainPrint", "MaindivReport");
                $("#MaindivReport").show();
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Report', 'No data found.');
                HideModalPopup("dvloading");
            }

        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}


function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}



function fnBrandInformation(val) {
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetCampaign',
        type: "POST",
        data: 'campaignCode=' + val,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = ""
            var visitOrder = 0;

            if (jsData.Tables[0].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' width='50%' id='tblCampaignProductDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<td style='text-align:left'>Sale Product</td>";
                tableContent += "<td style='text-align:left'>Input Mapped</td>";
                tableContent += "<td style='text-align:left'>Qty</td>";
                tableContent += "<td style='text-align:left'>VisitOrder</td>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                var saleProdArr = new Array();

                for (var l = 0; l < jsData.Tables[0].Rows.length; l++) {
                    if (jQuery.inArray(jsData.Tables[0].Rows[l].Product_Code, saleProdArr) === -1) {
                        saleProdArr.push(jsData.Tables[0].Rows[l].Product_Code);

                        tableContent += "<tr>";
                        var saleJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Product_Code=='" + jsData.Tables[0].Rows[l].Product_Code + "')]");
                        if (saleJson != false && saleJson !== undefined) {

                            tableContent += "<td rowspan='" + saleJson.length + "' style='text-align:left'>" + saleJson[0].Sale_Product + "</td>";
                            tableContent += "<td style='text-align:left'>" + saleJson[0].Sample_Product + "</td>";
                            tableContent += "<td style='text-align:center'>" + saleJson[0].Quantity + "</td>";
                            tableContent += "<td style='text-align:center'>" + saleJson[0].Visit_Order + "</td></tr>";
                            if (parseInt(saleJson[0].Visit_Order) > visitOrder) {
                                visitOrder = parseInt(saleJson[0].Visit_Order);
                            }

                            if (saleJson.length > 1) {
                                for (var m = 1; m < saleJson.length; m++) {
                                    tableContent += "<tr>";
                                    tableContent += "<td style='text-align:left'>" + saleJson[m].Sample_Product + "</td>";
                                    tableContent += "<td style='text-align:center'>" + saleJson[m].Quantity + "</td>";
                                    tableContent += "<td style='text-align:center'>" + saleJson[m].Visit_Order + "</td>";
                                    tableContent += "</tr>";
                                    if (parseInt(saleJson[m].Visit_Order) > visitOrder) {
                                        visitOrder = parseInt(saleJson[m].Visit_Order);
                                    }
                                }
                            }
                        }
                    }
                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                tableContent += "</div>";
                // alert(content);
                $("#divModel").html(tableContent);
                $("#divsubPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tbl_CampaignInformation').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };
                fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
                $("#divModel").show();
                ShowModalPopup('modal');
            }
            else {
                alert("No data found");
            }
        },
        error: function () {
            alert("error");
        }
    });
}

function fnCampaignInformation(val) {


    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetCampaignDetail',
        type: "POST",
        data: 'campaignCode=' + val.split('_')[0],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var content = ""
            if (jsData.Tables[0].Rows.length > 0) {
                content += "<table  id='tbl_CampDetail'>";
                content += "<thead><tr>";
                content += "<tr><td style='text-align:left'><b> Marketing Campaign Name : <b></td><td style='text-align:left' > " + jsData.Tables[0].Rows[0].Campaign_Name + " </td></tr>";
                content += "<tr><td style='text-align:left'><b> Campaign Period :<b> </td><td style='text-align:left' >" + jsData.Tables[0].Rows[0].Start_Date + " - " + jsData.Tables[0].Rows[0].End_Date + " </td></tr>";
                content += "<tr><td style='text-align:left'><b> Cycle Name :<b> </td><td style='text-align:left' > " + ((jsData.Tables[0].Rows[0]["Cycle_Name"] == null) ? "" : jsData.Tables[0].Rows[0]["Cycle_Name"]) + " </td></tr>";
                content += "<tr><td style='text-align:left'><b>Customer Category:<b></td><td style='text-align:left' > " + jsData.Tables[0].Rows[0].Customer_Category.slice(0, -2) + " </td></tr>";
                content += "<tr><td style='text-align:left'><b> Speciality Name:<b></td><td style='text-align:left' >" + jsData.Tables[0].Rows[0].Customer_Speciality.slice(0, -2) + "</td></tr>";
                content += "<tr><td style='text-align:left'><b> Customer Count:<b></td><td style='text-align:left' > " + jsData.Tables[0].Rows[0].Customer_Count + " </td></tr>";
                content += "<tr><td style='text-align:left'><b> Created Date:<b></td><td style='text-align:left' >" + jsData.Tables[0].Rows[0].Created_Date + "</td></tr>";
                content += "<tr><td style='text-align:left'><b>No of Products Mapped in MC:<b></td><td style='text-align:left' > " + jsData.Tables[0].Rows[0].Brand_Count + " </td></tr>";
                content += "</tbody>";
                content += "</table>";
                // alert(content);
                $("#divCamDetail").html(content);
                //$("#divPrint").html(content);
                if ($.fn.dataTable) {
                    $('#tbl_CampDetail')
                };

            }
            else {
                alert("No data found");
            }
        },
        error: function () {
            alert("error");
        }
    });

    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetCampaign',
        type: "POST",
        data: 'campaignCode=' + val.split('_')[0],
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = ""
            var visitOrder = 0;

            if (jsData.Tables[0].Rows.length > 0) {
                tableContent += "<table cellspacing='0' cellpadding='0' width='50%' id='tblCampaignProductDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<td style='text-align:left'>Sale Product</td>";
                tableContent += "<td style='text-align:left'>Input Mapped</td>";
                tableContent += "<td style='text-align:left'>Qty</td>";
                tableContent += "<td style='text-align:left'>VisitOrder</td>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";

                var saleProdArr = new Array();

                for (var l = 0; l < jsData.Tables[0].Rows.length; l++) {
                    if (jQuery.inArray(jsData.Tables[0].Rows[l].Product_Code, saleProdArr) === -1) {
                        saleProdArr.push(jsData.Tables[0].Rows[l].Product_Code);

                        tableContent += "<tr>";
                        var saleJson = jsonPath(jsData, "$.Tables[0].Rows[?(@.Product_Code=='" + jsData.Tables[0].Rows[l].Product_Code + "')]");
                        if (saleJson != false && saleJson !== undefined) {

                            tableContent += "<td rowspan='" + saleJson.length + "' style='text-align:left'>" + saleJson[0].Sale_Product + "</td>";
                            tableContent += "<td style='text-align:left'>" + saleJson[0].Sample_Product + "</td>";
                            tableContent += "<td style='text-align:center'>" + saleJson[0].Quantity + "</td>";
                            tableContent += "<td style='text-align:center'>" + saleJson[0].Visit_Order + "</td></tr>";
                            if (parseInt(saleJson[0].Visit_Order) > visitOrder) {
                                visitOrder = parseInt(saleJson[0].Visit_Order);
                            }

                            if (saleJson.length > 1) {
                                for (var m = 1; m < saleJson.length; m++) {
                                    tableContent += "<tr>";
                                    tableContent += "<td style='text-align:left'>" + saleJson[m].Sample_Product + "</td>";
                                    tableContent += "<td style='text-align:center'>" + saleJson[m].Quantity + "</td>";
                                    tableContent += "<td style='text-align:center'>" + saleJson[m].Visit_Order + "</td>";
                                    tableContent += "</tr>";
                                    if (parseInt(saleJson[m].Visit_Order) > visitOrder) {
                                        visitOrder = parseInt(saleJson[m].Visit_Order);
                                    }
                                }
                            }
                        }
                    }
                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                // alert(content);
                $("#divsubpopupReport").html(tableContent);
                //$("#divPrint").html(content);
                if ($.fn.dataTable) {
                    $('#tbl_CampaignInformation')
                };

            }
            else {
                alert("No data found");
            }
        },
        error: function () {
            alert("error");
        }
    });
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
    $.ajax({
        url: '../HiDoctor_Reports/Reports/GetCampaignInfo',
        type: "POST",
        data: 'campaignCode=' + val.split('_')[0] + '&userTypeCode=' + val.split('_')[1],
        success: function (response) {

            jsData = eval('(' + response + ')');
            var content = ""
            if (jsData.Tables[0].Rows.length > 0) {
                content += "<table class='data display datatable' id='tbl_CampaignInfoDetail'>";
                content += "<thead>";
                content += "<tr style='display: none;' id='tblTrCampaignInfoDetail'>";
                content += "<th>UserID</th>";
                content += "<th>Territory Name</th>";
                content += "<th>User Type</th>";
                content += "<th>Division Name</th>"
                content += "<th>Reporting HQ</th>"
                content += "<th>Reporting Manager</th>"
                content += "<th>Total Approved Drs</th>"
                content += "<th>Mapped doctors for the Campaign</th>"
                var type = '[{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{ type: "number-range" }';
                if (jsData.Tables[5].Rows.length > 0) {
                    for (var j = 0; j < jsData.Tables[5].Rows.length; j++) {
                        type += ', { type: "number-range" }';
                        content += "<th align='left'>No of Drs chosen for the Campaign - " + jsData.Tables[5].Rows[j].Product_Name + "  </th>";
                    }
                }
                type += ', { type: "text" }]';
                content += "</tr>";
                content += "<tr>";
                content += "<th>UserID</th>";
                content += "<th>Territory Name</th>";
                content += "<th>User Type</th>";
                content += "<th>Division Name</th>"
                content += "<th>Reporting HQ</th>"
                content += "<th>Reporting Manager</th>"
                content += "<th>Total Approved Drs</th>"
                content += "<th>Mapped doctors for the Campaign</th>"
                var iRow = 8;
                if (jsData.Tables[5].Rows.length > 0) {
                    for (var j = 0; j < jsData.Tables[5].Rows.length; j++) {
                        iRow++;
                        content += "<th align='left'> No of Drs chosen for the Campaign - " + jsData.Tables[5].Rows[j].Product_Name + " </th>";
                    }
                }
                content += "</tr>";
                content += "<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaCampaign()'>Show Filter</span></th>";
                content += "</thead>";

                content += "</thead>";
                content += "<tbody>";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td>" + jsData.Tables[0].Rows[i].User_Name + "</td>";
                    content += "<input type='hidden' id='txt_user_" + i + "'value='" + jsData.Tables[0].Rows[i].User_Code + "'/>";
                    content += "<td align='center' class='td-a'  onclick='fnMarketingCampaignopenTracker(\"" + val.split('_')[0] + '_' + jsData.Tables[0].Rows[i].User_Code + '_' + startDate + '_' + endDate + "\")'>" + jsData.Tables[0].Rows[i].Region_Name + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].User_Type_Name + "</td>";
                    if (jsData.Tables[0].Rows.length > 0) {
                        var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        divisionName = "";
                        if (dJsonData != false) {
                            for (var j = 0; j < dJsonData.length; j++) {
                                divisionName += dJsonData[j].Division_Name + "";
                            }
                            content += "<td >" + divisionName + "</td>";
                        }
                        else {
                            content += "<td> </td>  ";
                        }
                    }
                    else {
                        content += "<td> </td>  ";
                    }
                    content += "<td>" + jsData.Tables[0].Rows[i].Manager_Region_Name + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Manager_Name + "</td>";
                    if (jsData.Tables[0].Rows.length > 0) {
                        var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        doctorCount = "";
                        if (dJsonData != false) {
                            for (var j = 0; j < dJsonData.length; j++) {
                                doctorCount += dJsonData[j].Doctor_count + "";
                            }
                            content += "<td align='center'>" + doctorCount + "</td>";
                        }
                        else {
                            content += "<td> </td>  ";
                        }
                    }
                    else {
                        content += "<td> </td>  ";
                    }

                    //AVAILABLE DOCTORS
                    if (jsData.Tables[0].Rows.length > 0) {
                        var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        doctorCampaign = "";
                        if (dJsonData != false) {
                            for (var j = 0; j < dJsonData.length; j++) {
                                doctorCampaign += dJsonData[j].Customer_Code + "";
                            }
                            content += "<td align='center'>" + doctorCampaign + "</td>";
                        }
                        else {
                            content += "<td> </td>  ";
                        }
                    }
                    else {
                        content += "<td> </td>  ";
                    }


                    if (jsData.Tables[5].Rows.length > 0) {
                        for (var j = 0; j < jsData.Tables[5].Rows.length; j++) {
                            var userproduct = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i]["Region_Code"] + "' && @.Product_Code=='" + jsData.Tables[5].Rows[j]["Product_Code"] + "')]");
                            if (userproduct != false && userproduct !== undefined && userproduct.length > 0) {
                                content += "<td align='center' class='td-a' onclick='fnOpenMarketingVisitsDetails(\"" + val.split('_')[0] + '_' + jsData.Tables[0].Rows[i].User_Code + "\")' >" + userproduct[0].Customer_Code + "</td>";
                            }
                            else {

                                content += "<td>0</td>";
                            }
                        }
                    }


                    //if (jsData.Tables[0].Rows.length > 0) {
                    //    //  for (var k = 0; k < jsData.Tables[4].Rows.length; k++) {
                    //    var userproduct = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i]["Region_Code"] + "')]");
                    //    customerCount = "";
                    //    if (userproduct != false) {
                    //        for (var j = 0; j < userproduct.length; j++) {
                    //            customerCount = userproduct[j].Customer_Code;
                    //            content += "<td align='center' class='td-a' onclick='fnOpenMarketingVisitsDetails(\"" + val + '_' + jsData.Tables[0].Rows[i].User_Code + "\")' >" + customerCount + "</td>";
                    //        }

                    //    }
                    //    else {
                    //        content += "<td align='center' class='td-a' onclick='fnOpenMarketingVisitsDetails(\"" + val + '_' + jsData.Tables[0].Rows[i].User_Code + "\")' >0</td>";
                    //    }

                    //    //  }
                    //}
                    content += "</tr>";
                }
                content += "</tbody>";
                content += "</table>";
                var jsonType = eval(type)
                $("#SubdivReport").html(content);
                $("#divPrintsub").html(content);
                if ($.fn.dataTable) {
                    $('#tbl_CampaignInfoDetail').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divPrintsub", "ifrmPrintsub", "SubdivReport");
                $("#SubdivReport").show();

            }
            else {
                alert("No data found");
            }
        },
        error: function () {
            alert("error");
        }
    });
}
function fnToggleTreeaCampaign() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrCampaignInfoDetail").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrCampaignInfoDetail").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnMarketingCampaignopenTracker(val) {
  
    $("#divTrackerReport").empty();
    $("#divTrackerHeader").empty();
    fnMarketingCampaignTrackerReport(val.split('_')[0], val.split('_')[1], "", "");   
}

function fnOpenMarketingVisitsDetails(val) {
    $("#divVisitHeader").empty();
    $("#divVisitReport").empty();
    $("#hdnVisitUserCode").val(val.split('_')[1]);
    fnMarketingCampaignVisitsDetails(val.split('_')[0]);
    $("#divVisitHeader").css('display', 'none');
}




function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}
