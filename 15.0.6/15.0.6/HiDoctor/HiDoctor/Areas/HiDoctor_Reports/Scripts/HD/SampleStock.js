function fnGetsamplestock() {
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Sample stock statement', 'Select start Date.');

        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Sample stock statement', 'Select End Date.');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {

        fnMsgAlert('info', 'Sample stock statement', 'Start Month&Year should be less than End Month&Year');
        HideModalPopup("dvloading");
        return false;
    }

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Reports/Reports/Getsamplestockstatement',
        type: "POST",
        data: "Usercode=" + $("#hdnUserCode").val() + '&sd=' + startDate + '&ed=' + endDate,
        success: function (response) {

            jsData = eval('(' + response + ')');
            var content = "";
            var dJsonData = jsData.Tables[3].Rows;
            var content = ""
            //if (jsData != false && jsData.length > 0) {

            if (dJsonData.length > 0) {
                content += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >";
                content += "<thead><tr>";
                content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
                content += "<tbody>";
                content += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].User_Name + "</td>";
                content += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsData.Tables[1].Rows[0].Region_Name + " </td>";
                content += "<td align='left' ><b>Date Period</b></td><td align='left' >" + $('#txtFromDate').val() + " to " + $('#txtToDate').val() + " </td></tr>";
                content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' > " + jsData.Tables[1].Rows[0].Employee_Name + " </td>";
                if (jsData.Tables[1].Rows.length > 0) {
                    var jsUserDiv = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[0].Region_Code + "')]");
                    divisionName = "";
                    if (jsUserDiv != false) {
                        for (var j = 0; j < jsUserDiv.length; j++) {
                            divisionName += jsUserDiv[j].Division_Name + ",";
                        }

                        if (divisionName != "") {
                            divisionName = divisionName.substring(0, divisionName.length - 1);
                        }
                        content += "<td align='left' ><b>Division</b></td><td align='left' > " + divisionName + "</td>";
                    }
                    else {
                        content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                    }
                }
                else {
                    content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
                }
                content += "<td align='left' ><b>Reporting To</b></td><td align='left' >  " + jsData.Tables[1].Rows[0].Manager_Name + " </td></tr>";
                var lastReceiptDate = "-";
                if (jsData.Tables[4].Rows.length > 0)
                    lastReceiptDate = jsData.Tables[4].Rows[0].Inward_Date;
                content += "<tr><td align='left' ><b>User type Name</b></td><td align='left' > " + jsData.Tables[1].Rows[0].User_Type_Name + " </td><td ><b>No of Product(s)</b></td><td align='left' > " + dJsonData.length + " </td><td><b>LastReceipt Date</b></td><td>" + lastReceiptDate + "</td></tr>";
                content += "</tbody>";
                content += "</table>";
                content += "<table class='data display datatable' id='tbl_ACCDetails'>";
                content += "<thead>";
                content += "<tr style='display: none;' id='tblTrpop'>";
                content += "<th style='display:none'>Region Name</th>";
                content += "<th style='display:none'>User Name</th>";
                content += "<th style='display:none'>Employee Name</th>";
                content += "<th style='display:none'>Reporting To</th>";
                content += "<th>Product Name</th>";
                content += "<th>Product Type Name</th>";
                content += "<th>Brand Name</th>";
                content += "<th>Product Category</th>";
                content += "<th>Opening</th>"
                content += "<th>Inward taken</th>"
                content += "<th>Issue</th>"
                content += "<th>Closing</th>"
                content += "<th>Closing Amount</th>"
                content += "</tr>";
                var type = '[{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "number-range"},{type : "number-range"},{type : "number-range"},{type : "number-range"},{type : "number-range"}]';
                content += "<tr>";
                content += "<th style='display:none'>Region Name</th>";
                content += "<th style='display:none'>User Name</th>";
                content += "<th style='display:none'>Employee Name</th>";
                content += "<th style='display:none'>Reporting To</th>";
                content += "<th>Product Name</th>";
                content += "<th>Product Type Name</th>";
                content += "<th>Brand Name</th>";
                content += "<th>Product Category</th>";
                content += "<th>Opening</th>"
                content += "<th>Inward taken</th>"
                content += "<th>Issue</th>"
                content += "<th>Closing</th>"
                content += "<th>Closing Amount</th>"
                content += "</tr>";
                content += "<th colspan= '13' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapop()'>Show Filter</span></th>";
                content += "</thead>";
                content += "<tbody>";
                for (var i = 0; i < dJsonData.length; i++) {
                    content += "<tr>";
                    content += "<td style='display:none'>" + jsData.Tables[1].Rows[0].Region_Name + "  </td>";
                    content += "<td style='display:none'>" + jsData.Tables[1].Rows[0].User_Name + " </td>";
                    content += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Employee_Name + "</td>";
                    content += "<td style='display:none'> " + jsData.Tables[1].Rows[0].Manager_Name + "  </td>";
                    content += "<td>" + dJsonData[i].Product_Name + "</td>";
                    content += "<td>" + dJsonData[i].Product_Type_Name + "</td>";
                    content += "<td>" + dJsonData[i].Brand_Name + "</td>";
                    content += "<td>" + dJsonData[i].Category_Name + "</td>";
                    //content += "<td>" + ((dJsonData[i].Opening == null) ? "-" : dJsonData[i].Opening) + "</td>";
                    content += "<td>" + (dJsonData[i].Opening) + "</td>";
                    content += "<td>" + (dJsonData[i].Inward_Taken) + "</td>";
                    content += "<td>" + (dJsonData[i].Issued) + "</td>";
                    content += "<td>" + (dJsonData[i].Closing) + "</td>";
                    content += "<td>" + (dJsonData[i].ClosingAmount) + "</td>";
                    // content += "<td>0</td>";

                    //inward taken//

                    //var jinwardtakenproduct = jsonPath(jsData, "$.Tables[6].Rows[?(@.User_Code=='" + val.split('_')[0] + "' & @.Product_Code=='" + dJsonData[i].Product_Code + "')]");
                    //if (jinwardtakenproduct != false) {
                    //    //var opening = ((jsData.Tables[2].Rows[i].Opening == null) ? "0" : jsData.Tables[2].Rows[i].Opening);
                    //    content += "<td>" + jinwardtakenproduct[0].Qty + "</td>";

                    //}
                    //else {
                    //    content += "<td>0</td>";
                    //}

                    //issued
                    //var issue = 0;
                    //var jIssued = jsonPath(jsData, "$.Tables[5].Rows[?(@.User_Code=='" + val.split('_')[0] + "' & @.Product_Code=='" + dJsonData[i].Product_Code + "')]");
                    //if (jIssued != false) {

                    //    content += "<td>" + jIssued[0].Qty + "</td>";
                    //    //issue = ((jIssued[0].Qty == null) ? "0" : jIssued[0].Qty);
                    //}
                    //else {
                    //    content += "<td>0</td>";
                    //}
                    ////closing
                    //content += "<td>" + dJsonData[i].Closing + "</td>";
                    content += "</tr>";
                }

                content += "</tbody>";
                content += "</table>";
                // alert(content);

                //  }
                // }
                var jsonType = eval(type)
                $("#divReport").html(content);
                $("#divPrint").html(content);
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    $('#tbl_ACCDetails').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType

                    });

                };
            }
            else {
                content += "<div style='border: 1px solid; background-color: dimgray; padding: 2%;'>";
                content += "<span style='font-weight: bold;border: 1%;color: white; font-size: initial;'>No Data Found</span>"
                content += "</div>";
                $("#divReport").html(content);
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divReport").show();
            HideModalPopup("dvloading");

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

function fnproduct(val) {
    var jsUserDetail = jsonPath(jsData, "$.Tables[1].Rows[?(@.User_Code=='" + val.split('_')[0] + "')]");

    // var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.User_Code=='" + val.split('_')[0] + "' &  (@.Closing!='0' & @.Closing!=null))]");

    var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.User_Code=='" + val.split('_')[0] + "')]");


    var content = ""
    if (dJsonData != false && dJsonData.length > 0) {
        content += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='80%' id='tblHeader' >";
        content += "<thead><tr>";
        content += "<th align='left' colspan='6' >User Details</th></tr></thead>";
        content += "<tbody>";
        content += "<tr><td align='left' ><b>User Name</b></td><td align='left' >" + jsUserDetail[0].User_Name + "</td>";
        content += "<td align='left' ><b>Region Name</b></td><td align='left' >" + jsUserDetail[0].Region_Name + " </td>";
        content += "<td align='left' ><b>Date Period</b></td><td align='left' >" + $('#txtFromDate').val() + " to " + $('#txtToDate').val() + " </td></tr>";
        content += "<tr><td align='left' ><b>Employee Name</b></td><td align='left' > " + jsUserDetail[0].Employee_Name + " </td>";
        if (jsData.Tables[1].Rows.length > 0) {
            var jsUserDiv = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsUserDetail[0].Region_Code + "')]");
            divisionName = "";
            if (jsUserDiv != false) {
                for (var j = 0; j < jsUserDiv.length; j++) {
                    divisionName += jsUserDiv[j].Division_Name + ",";
                }

                if (divisionName != "") {
                    divisionName = divisionName.substring(0, divisionName.length - 1);
                }
                content += "<td align='left' ><b>Division</b></td><td align='left' > " + divisionName + "</td>";
            }
            else {
                content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
            }
        }
        else {
            content += "<td align='left' ><b>Division</b></td><td align='left' > </td>  ";
        }
        content += "<td align='left' ><b>Reporting To</b></td><td align='left' >  " + jsUserDetail[0].Manager_Name + " </td></tr>";
        content += "</tbody>";
        content += "</table>";
        content += "<table class='data display datatable' id='tbl_ACCDetails'>";
        content += "<thead>";
        content += "<tr style='display: none;' id='tblTrpop'>";
        content += "<th style='display:none'>Region Name</th>";
        content += "<th style='display:none'>User Name</th>";
        content += "<th style='display:none'>Employee Name</th>";
        content += "<th style='display:none'>Reporting To</th>";
        content += "<th>Product Name</th>";
        content += "<th>Product Type Name</th>";
        content += "<th>Brand Name</th>";
        content += "<th>Product Category</th>";
        content += "<th>Opening</th>"
        content += "<th>Inward taken</th>"
        content += "<th>Issue</th>"
        content += "<th>Closing</th>"
        content += "</tr>";
        var type = '[{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "number-range"},{type : "number-range"},{type : "number-range"},{type : "number-range"}]';
        content += "<tr>";
        content += "<th style='display:none'>Region Name</th>";
        content += "<th style='display:none'>User Name</th>";
        content += "<th style='display:none'>Employee Name</th>";
        content += "<th style='display:none'>Reporting To</th>";
        content += "<th>Product Name</th>";
        content += "<th>Product Type Name</th>";
        content += "<th>Brand Name</th>";
        content += "<th>Product Category</th>";
        content += "<th>Opening</th>"
        content += "<th>Inward taken</th>"
        content += "<th>Issue</th>"
        content += "<th>Closing</th>"
        content += "</tr>";
        content += "<th colspan= '12' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeapop()'>Show Filter</span></th>";
        content += "</thead>";
        content += "<tbody>";

        for (var i = 0; i < dJsonData.length; i++) {
            content += "<tr>";
            content += "<td style='display:none'>" + jsUserDetail[0].Region_Name + "  </td>";
            content += "<td style='display:none'>" + jsUserDetail[0].User_Name + " </td>";
            content += "<td style='display:none'> " + jsUserDetail[0].Employee_Name + "</td>";
            content += "<td style='display:none'> " + jsUserDetail[0].Manager_Name + "  </td>";
            content += "<td>" + dJsonData[i].Product_Name + "</td>";
            content += "<td>" + dJsonData[i].Product_Type_Name + "</td>";
            content += "<td>" + dJsonData[i].Brand_Name + "</td>";
            content += "<td>" + dJsonData[i].Category_Name + "</td>";
            //content += "<td>" + ((dJsonData[i].Opening == null) ? "-" : dJsonData[i].Opening) + "</td>";
            content += "<td>" + (dJsonData[i].Opening) + "</td>";
            content += "<td>" + (dJsonData[i].Inward_Taken) + "</td>";
            content += "<td>" + (dJsonData[i].Issued) + "</td>";
            content += "<td>" + (dJsonData[i].Closing) + "</td>";
            // content += "<td>0</td>";

            //inward taken//

            //var jinwardtakenproduct = jsonPath(jsData, "$.Tables[6].Rows[?(@.User_Code=='" + val.split('_')[0] + "' & @.Product_Code=='" + dJsonData[i].Product_Code + "')]");
            //if (jinwardtakenproduct != false) {
            //    //var opening = ((jsData.Tables[2].Rows[i].Opening == null) ? "0" : jsData.Tables[2].Rows[i].Opening);
            //    content += "<td>" + jinwardtakenproduct[0].Qty + "</td>";

            //}
            //else {
            //    content += "<td>0</td>";
            //}

            //issued
            //var issue = 0;
            //var jIssued = jsonPath(jsData, "$.Tables[5].Rows[?(@.User_Code=='" + val.split('_')[0] + "' & @.Product_Code=='" + dJsonData[i].Product_Code + "')]");
            //if (jIssued != false) {

            //    content += "<td>" + jIssued[0].Qty + "</td>";
            //    //issue = ((jIssued[0].Qty == null) ? "0" : jIssued[0].Qty);
            //}
            //else {
            //    content += "<td>0</td>";
            //}
            ////closing
            //content += "<td>" + dJsonData[i].Closing + "</td>";
            content += "</tr>";
        }

        content += "</tbody>";
        content += "</table>";
        // alert(content);
        $("#divModel").html(content);
        $("#divsubPrint").html(content);
        var jsonType = eval(type)
        if ($.fn.dataTable) {
            $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
            $.datepicker.setDefaults($.datepicker.regional['']);
            $('#tbl_ACCDetails').dataTable({
                "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            }).dataTable().columnFilter({
                sPlaceHolder: "head:after",
                aoColumns: jsonType


            });
        };
        fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
        $("#divModel").show();
        ShowModalPopup('modal');
    }
    else {
        alert("No data found");
    }

}


function fnToggleTreeapop() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrpop").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrpop").show();
        $("#spnDivToggle").html('Hide Filter');
    }
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