/*
Created for mobile DCR Approval
Created Date : 2013-01-05
*/

//function to get the dcr applied users for the date
var flag = "";
var userPrivilege_g = "";
var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";
var DCRDate = "";
var UserName = "";
var regionCode = "";
var userCode = "";
var dcrFlg = "";
function fnGetDCRAppliedUsers() {
    debugger;
    //if ($("#txtDCRDate").val() == "") {
    //    fnMsgAlert('error', 'DCR Approval', 'Please enter DCR Date');
    //    return false;
    //}
    $("#dv-dcrappliedusers").html('')
    $("#dv-dcrappliedusers").css('display', '');
    $("#dv-alert").css('display', 'none');
    $("#dv-dcrdetails").css('display', 'none');
    $("#dv-result").css('display', 'none');
    $("#dv-dcrDCRAppliedDates").css('display', 'none');

  
    var date = $.trim($("#txtMonth").val());
    var result = fnGetDate();
    if (!result) {
        return false
    }
    var date = result;
    var selection="";
    if ($(":checkbox[name=chkstatus]:checked").length > 0) {
        selection="M";
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        if ($('#txtUserName').val() == "") {
            fnMsgAlert('error', 'DCR Approval', 'Kindly enter the user name');
            return false;
        }
    }

    debugger;
    var month = fnMonthNumber($('#txtMonth').val().split('-')[0]);
    //if (month.length == 1) {
    //    month = '0' + month;
    //}
    var year = $('#txtMonth').val().split('-')[1];
    debugger;
    $.mobile.loading('show');

    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRApproval/GetDCRAppliedUsers',
        data: "DCRActualMonth=" + month+"&DCRActualYear="+year + "&Status=" + $('#ddlStatus').val() + "&Selection=" + selection + "&UserName=" + $('#txtUserName').val(),
        success: function (result) {
            debugger;
            result = eval('(' + result + ')');
            $.mobile.loading('hide');

            if (result.Tables[0].Rows.length == 0) {
                $("#dv-result").css('display', 'block');
                $("#dv-result").html("No user details found for this date")
                return;
            }

            var content = '<ul data-role="listview" data-divider-theme="b" data-inset="true" >';
            if($('#ddlStatus').val()=="1")
            {
                content += '<li data-role="list-divider" role="heading">Applied Users</li>';
            }
            else{
                content += '<li data-role="list-divider" role="heading">Approved Users</li>';
            }
            for (var j = 0; j < result.Tables[0].Rows.length; j++) {
                debugger;
                var user_Code = result.Tables[0].Rows[j].User_Code == null ? "" : result.Tables[0].Rows[j].User_Code;
                var region_Code = result.Tables[0].Rows[j].Region_Code == null ? "" : result.Tables[0].Rows[j].Region_Code;
                var user_Name = result.Tables[0].Rows[j].User_Name == null ? "" : result.Tables[0].Rows[j].User_Name;



                content += '<li data-theme="c">';
                content += '<a href="#" data-transition="slide" onclick="fngetDCRDetails(' + j + ')">';
                content += '<input type="hidden" id="hdnUserCode_' + j + '" value="' + user_Code + '" />';
                content += '<input type="hidden" id="hdnRegionCode_' + j + '" value="' + region_Code + '" />';
                content += '<span id="spnUserName_' + j + '">' + user_Name + '</span>';
                content += '</a>';
                content += '</li>';

                //content += "<tr><td onclick='fnFillAccomp(" + (j + 1) + ")' " + alterRow + ">" + allUser_g[j].Accompanist_Name + "<label id='lblAcc_" + (j + 1) + "' style='display:none;'>" + allUser_g[j].Accompanist_Region_Code + "^" + allUser_g[j].Accompanist_Name + "</label></td></tr>";
            }
            content += "</ul>";

            $("#dv-dcrappliedusers").html(content).trigger('create');

        }
    });
}
function fnMonthNumber(monthName) {
    debugger;
    if (monthName.toUpperCase() == "JAN" || monthName.toUpperCase() == "JANUARY") {
        return "01";
    }
    if (monthName.toUpperCase() == "FEB" || monthName.toUpperCase() == "FEBRUARY") {
        return "02";
    }
    if (monthName.toUpperCase() == "MAR" || monthName.toUpperCase() == "MARCH") {
        return "03";
    }
    if (monthName.toUpperCase() == "APR" || monthName.toUpperCase() == "APRIL") {
        return "04";
    }
    if (monthName.toUpperCase() == "MAY") {
        return "05";
    }
    if (monthName.toUpperCase() == "JUN" || monthName.toUpperCase() == "JUNE") {
        return "06";
    }
    if (monthName.toUpperCase() == "JUL" || monthName.toUpperCase() == "JULY") {
        return "07";
    }
    if (monthName.toUpperCase() == "AUG" || monthName.toUpperCase() == "AUGUST") {
        return "08";
    }
    if (monthName.toUpperCase() == "SEP" || monthName.toUpperCase() == "SEPTEMBER") {
        return "09";
    }
    if (monthName.toUpperCase() == "OCT" || monthName.toUpperCase() == "OCTOBER") {
        return "10";
    }
    if (monthName.toUpperCase() == "NOV" || monthName.toUpperCase() == "NOVEMBER") {
        return "11";
    }
    if (monthName.toUpperCase() == "DEC" || monthName.toUpperCase() == "DECEMBER") {
        return "12";
    }
}

function fngetDCRDetails(rowIndex) {
    debugger;
    var userCode=$("#hdnUserCode_" + rowIndex).val();
    var month = fnMonthNumber($('#txtMonth').val().split('-')[0]);
    var year = $('#txtMonth').val().split('-')[1];
    $.mobile.loading('show');
    $.ajax({
        type:'POST',
        url:'/HiDoctor_Master/Approval/GetMonthExpenseStatus',
        data:'userCode='+userCode+'&month='+month+'&year='+year,
        success: function (response) {
            if (response.toUpperCase() == "NO") {
                $.ajax({
                    type: 'POST',
                    data: 'userCode=' + userCode + '&DCRActualMonth=' + month + '&DCRActualYear=' + year + '&status=' + $('#ddlStatus').val(),
                    url: '/HiDoctor_Activity/DCRApproval/GetDCRDetails',
                    success: function (result) {
                        result = eval('(' + result + ')');

                        $.mobile.loading('hide');

                        var content = '<ul data-role="listview" data-divider-theme="b" data-inset="true" >';
                        content += '<li data-role="list-divider" role="heading">DCR Dates for  ' + $("#spnUserName_" + rowIndex).html() + ' </li>';
                        UserName = $("#spnUserName_" + rowIndex).html();
                        for (var j = 0; j < result.Tables[0].Rows.length; j++) {
                            debugger;

                            var dcrAppliedDates = result.Tables[0].Rows[j].DCR_Date;

                            var rowDetails = [];
                            rowDetails.push(j);
                            rowDetails.push(userCode);
                            rowDetails.push(result.Tables[0].Rows[j].DCR_Actual_Date.split('T')[0]);
                            rowDetails.push(result.Tables[0].Rows[j].flag);

                            content += '<li data-theme="c">';
                            content += '<a href="#" data-transition="slide" onclick="fnBindDCRDateDetails(' + j + ',' + rowIndex + ')">';
                            content += '<span id="DCRAppliedDates' + j + '">' + dcrAppliedDates + '</span>';
                            content += '<input type="hidden" id="hdn_DCRDate_' + j + '" value=' + result.Tables[0].Rows[j].DCR_Actual_Date.split('T')[0] + '>';
                            content += '<input type="hidden" id="hdn_Flag_' + j + '" value=' + result.Tables[0].Rows[j].flag + '>';
                            content += '</a>';
                            content += '</li>';
                        }
                        content += "</ul>";

                        $("#dv-dcrDCRAppliedDates").html(content).trigger('create');
                        $("#dv-dcrDCRAppliedDates").css('display', 'block');

                    }

                });
            }
            else {
                debugger;
                //$("#dv-dcrDCRAppliedDates").simpledialog2("Expense is being claimed for the selected month. No modification allowed");
                //alert("Expense is being claimed for the selected month. No modification allowed");
                $("#dv-dcrDCRAppliedDates").simpledialog2({
                    mode: 'blank',
                    headerText: 'Alert',
                    blankContent:
                      "<h3>Expense claimed for the selected month. No modification allowed</h3>" +
                      // NOTE: the use of rel="close" causes this button to close the dialog.
                      "<a rel='close' data-role='button' href='#'>Close</a>",
                    width: '430px'
                })
            }
        },
        error: function () {
            $.mobile.loading('hide');
        },
        complete: function () {
            $.mobile.loading('hide');
        }
        });
}
function fnBindDCRDateDetails(j,rowIndex) {
    debugger;
    $.mobile.loading('show');
    $("#dv-alert").html('');
    userCode = $("#hdnUserCode_" + rowIndex).val();
    $("#hdnUserCode").val(userCode);
    dcrFlg = $('#hdn_Flag_' + j).val();
    var dcrDate = $('#hdn_DCRDate_' + j).val();
    UserName = $("#spnUserName_" + rowIndex).html();

    $.ajax({
        type: 'POST',
        data: 'dcrActualDate=' + dcrDate + "&flag=" + dcrFlg + "&username=" + $("#spnUserName_" + rowIndex).html() + "&usercode=" + userCode + "&regioncode=" + $("#hdnRegionCode_" + rowIndex).val() + "",
        url: '/HiDoctor_Activity/DCRApproval/GetUserInstantReport',
        success: function (response) {
            // we have the response
            fnDCRDeatils(eval('(' + response + ')'));
            fnGetAllPrivileges($("#hdnUserCode").val());
        },
        error: function (e) {
            alert("Eror" + e);
        }
    });
    DCRDate = "";
    DCRDate = $('#hdn_DCRDate_' + j).val();
    $("#hdnUserCode").val(userCode);
    regionCode = $("#hdnRegionCode_" + rowIndex).val();
}



function fnBindDCRDetails(rowIndex) {
    debugger;
    $("#dv-dcrappliedusers").css('display', 'none');
    var flag = "";
    if ($('#drpFlag').val() == "FIELD") {
        flag = "F"
    }
    else if ($('#drpFlag').val() == "ATTENDANCE") {
        flag = "A"
    }
    else if ($('#drpFlag').val() == "FIELD_RCPA") {
        flag = "F"
    }
    else if ($('#drpFlag').val() == "Leave") {
        flag = "L"
    }
    $("#spnUsername").html($("#spnUserName_" + rowIndex).html());
    $("#hdnUserCode").val($("#hdnUserCode_" + rowIndex).val());
    $("#hdnRegionCode").val($("#hdnRegionCode_" + rowIndex).val());
    $("#txtRemarks").val('');

    //var date = $("#txtDCRDate").val().split('/')[2] + "-" + $("#txtDCRDate").val().split('/')[1] + "-" + $("#txtDCRDate").val().split('/')[0];
    //var date = $("#txtDCRDate").val();
    var result = fnGetDate();
    if (!result) {
        return false
    }
    var date = result;
    $.ajax({
        type: 'POST',
        data: 'dcrActualDate=' + date + "&flag=" + flag + "&username=" + $("#spnUserName_" + rowIndex).html() + "&usercode=" + $("#hdnUserCode_" + rowIndex).val() + "&regioncode=" + $("#hdnRegionCode_" + rowIndex).val() + "",
        url: '/HiDoctor_Activity/DCRApproval/GetUserInstantReport',
        success: function (response) {
            // we have the response
            fnDCRDeatils(eval('(' + response + ')'));
            fnGetAllPrivileges($("#hdnUserCode").val());
        },
        error: function (e) {
            alert("Eror" + e);
        }
    });
    flag = $('#hdn_Flag_' + rowIndex).val();
}

function fnDCRDeatils(jsonData) {
    debugger;
    $("#dv-alert").css('display', 'none');
    $("#dv-dcrdetails").css('display', '');
    if (jsonData != null && jsonData != undefined) {
        if (jsonData.Tables[0].Rows.length > 0) {
            debugger;
            $("#hdnDCRCode").val('');
            $("#spnDCRDate").html('');
            $("#spnDCRDate").html('');
            $("#spnDCREnteredDate").html('');
            $("#spnDCRDate").html('');
            $("#spnDCREnteredDate").html('');
            $("#spnCPName").html('');
            $("#spnCategory").html('');
            $("#spnWorkPlace").html('');
            $('#dv-result').hide();
            $('#spnUsername').html(UserName + '-' + DCRDate);
            $("#hdnDCRCode").val(jsonData.Tables[0].Rows[0].DCR_Code);
            $("#spnDCRDate").html(jsonData.Tables[0].Rows[0].DCR_Actual_Date)
            if (flag != "L") {
                $('#dvDCRDate').css('display', '');
                $('#dvDCREnteredDate').css('display', '');

                $("#spnDCRDate").html(jsonData.Tables[0].Rows[0].DCR_Actual_Date)
                $("#spnDCREnteredDate").html(jsonData.Tables[0].Rows[0].DCR_Entered_Date)

                $("#spnCPName").html(jsonData.Tables[0].Rows[0].CP_Name)
                $("#spnCategory").html(jsonData.Tables[0].Rows[0].Category)
                $("#spnWorkPlace").html(jsonData.Tables[0].Rows[0].Place_Worked)
                var startTime = jsonData.Tables[0].Rows[0].User_Start_Time == null ? 'N/A' : jsonData.Tables[0].Rows[0].User_Start_Time;
                var endTime = jsonData.Tables[0].Rows[0].User_End_Time == null ? 'N/A' : jsonData.Tables[0].Rows[0].User_End_Time;

                $("#spnTiming").html(startTime + " - " + endTime)

                var accompanist = "";
                if (jsonData.Tables[0].Rows[0].Person_Code != null) {
                    accompanist = jsonData.Tables[0].Rows[0].Person_Code + " (" + jsonData.Tables[0].Rows[0].Accomp_Start_Time + " - " + jsonData.Tables[0].Rows[0].Accomp_End_Time + ") ,";
                }
                if (jsonData.Tables[0].Rows[0].Acc2_User_Code != null) {
                    accompanist += jsonData.Tables[0].Rows[0].Acc2_User_Code + " (" + jsonData.Tables[0].Rows[0].Acc2_Start_Time + " - " + jsonData.Tables[0].Rows[0].Acc2_End_Time + ") ,";
                }
                if (jsonData.Tables[0].Rows[0].Acc_3_Person != null) {
                    accompanist += jsonData.Tables[0].Rows[0].Acc_3_Person + " (" + jsonData.Tables[0].Rows[0].Acc_3_Time.split('_')[0] + " - " + jsonData.Tables[0].Rows[0].Acc_3_Time.split('_')[1] + ") ,";
                }
                if (jsonData.Tables[0].Rows[0].Acc_4_Person != null) {
                    accompanist += jsonData.Tables[0].Rows[0].Acc_4_Person + " (" + jsonData.Tables[0].Rows[0].Acc_4_Time.split('_')[0] + " - " + jsonData.Tables[0].Rows[0].Acc_4_Time.split('_')[1] + ") ,";
                }

                if (accompanist == "") {
                    accompanist = "- No accompanist details found -"
                }
                $("#spnAccompanist").html(accompanist);

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

                $('#txtRemarks').val(jsonData.Tables[0].Rows[0].DCR_general_Remarks);
                //$("#dv-remarks").html(jsonData.Tables[0].Rows[0].DCR_general_Remarks);
            }
        }
        if (jsonData.Tables[0].Rows[0].Flag != "" || jsonData.Tables[0].Rows[0].Flag != undefined) {
            flag = jsonData.Tables[0].Rows[0].Flag;
        }
        else if (jsonData.Tables[0].Rows[0].Flag != "" || jsonData.Tables[0].Rows[0].Flag != undefined) {
            flag = jsonData.Tables[0].Rows[0].Flag;
        }
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
            debugger;
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
                        sfcContent += '<div class="ui-block-a dv-bold-width">' + (s + 1) + ' . From Place : ' + jsonData.Tables[1].Rows[s].From_Place + '</div><div style="clear:both"></div>';
                        sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[1].Rows[s].To_Place + '</div><div style="clear:both"></div>';
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
                debugger;
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
                    var docname = jsonData.Tables[2].Rows[d].Doctor_Name;
                    var mdl = jsonData.Tables[2].Rows[d].MDL_Number;
                    var spec = jsonData.Tables[2].Rows[d].Speciality_Name;
                    var doc = "";
                    if (mdl != null && mdl.length > 0) {
                        doc = docname + ", " + mdl + ", " + spec;
                    }
                    else {
                        doc = docname + ", " + spec;
                    }
                    doccontent += '<div class="ui-block-a" style="border:1px solid #999;background-color:#fbfbcb;width:100%"><div class="ui-block-a dv-bold-width" >' + siNo + ' . ' + doc + '<br />POB Amount: ' + pob + ' <br />Visit Time: ' + vTvm + '<br />Remarks: ' + jsonData.Tables[2].Rows[d].Remarks_By_User + '</div>';

                    //to get the products fro the doctor
                    if (jsonData.Tables[4].Rows.length > 0) {
                        var product = jsonPath(jsonData, "$.Tables[4].Rows[?(@.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                        if (product != false) {
                            doccontent += '<div class="ui-block-a dv-bold-width">Sample/Promotional items</div>';
                            for (var p = 0; p < product.length; p++) {
                                doccontent += '<div class="ui-block-a dv-product">' + product[p].Product_Name + '(' + product[p].Quantity_Provided + ')' + '</div>';
                            }

                        }
                    }
                    debugger;
                    // Accompanist
                    var acc = "";
                    var onlyAccName = jsonPath(jsonData, "$.Tables[9].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                    if (onlyAccName != false) {
                        var Accslno = 0;
                        doccontent += '<div class="ui-block-a dv-bold-width">Accompanist(s):</div>';
                        for (var o = 0; o < onlyAccName.length; o++) {
                            if (onlyAccName[o].Acc_User_Name.toUpperCase().indexOf("VACANT") > -1) {
                                continue;
                            }
                            Accslno++
                            if (onlyAccName[o].Is_Only_For_Doctor.toUpperCase() == "Y") {
                                doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '(only for doctor) </div>';
                            }
                            else {
                                doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '</div>';
                            }
                        }
                    }

                    // Detailed Products.
                    var productDetail = jsonPath(jsonData, "$.Tables[10].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                    if (productDetail != false) {
                        doccontent += '<div class="ui-block-a dv-bold-width">Detailed Products:</div>';
                        var slno = 0;
                        for (var x = 0; x < productDetail.length; x++) {
                            slno++
                            doccontent += '<div class="ui-block-a dv-product">' + slno + ' . ' + productDetail[x].Product_Name + '</div>';
                        }
                    }

                    // Chemists
                    var chemist = jsonPath(jsonData, "$.Tables[5].Rows[?(@.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                    if (chemist != false) {
                        doccontent += '<div class="ui-block-a dv-bold-width">' + chemist_caption + ':</div>';

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
                                        if (rcpa != null && rcpa != false) {

                                            doccontent += '<div class="ui-block-a dv-bold-width" style="margin-left:2%;">RCPA : <br /> <span class="cls_spnRCPAIndent"> ' + rcpa[0].Product_Name + "</span></div>";

                                            doccontent += '<div style="clear:both"></div><div class="dv-comp-border" style="margin-left:3%;">'
                                            for (r = 1; r < rcpa.length; r++) {
                                                doccontent += '<div class="ui-block-a" style="width:100%"> <span class="cls_spnRCPAIndent">Comp : ' + rcpa[r].Competitor_Product_Name + " (" + rcpa[r].Support_Qty + ") </span></div><br />";
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
                        doccontent += '<div class="ui-block-a dv-bold-width">' + chemist_caption + ':</div><div>No ' + chemist_caption + ' Details Found.</div>';
                    }

                    doccontent += "</div>"
                    siNo++;
                }
            }
            debugger;
            if (jsonData.Tables[3].Rows.length > 0) {
                debugger;
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

                    var docname = jsonData.Tables[3].Rows[d].Doctor_Name;
                    var mdl = jsonData.Tables[3].Rows[d].MDL_Number;
                    var spec = jsonData.Tables[3].Rows[d].Speciality_Name;
                    var doc = "";
                    if (mdl != null && mdl.length > 0) {
                        doc = docname + ", " + mdl + ", " + spec;
                    }
                    else {
                        doc = docname + ", " + spec;
                    }
                    doccontent += '<div class="ui-block-a" style="border:1px solid #999;background-color:#fbfbcb;width:93%"><div class="ui-block-a dv-bold-width">' + siNo + ' . ' + doc + '<br />POB Amount: ' + pob + ' <br />Visit Time: ' + vTvm + '<br />Remarks: ' + jsonData.Tables[3].Rows[d].Remarks_By_User + '</div>';

                    // Accompanist
                    var acc = "";
                    var onlyAccName = jsonPath(jsonData, "$.Tables[9].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                    if (onlyAccName != false) {
                        var Accslno = 0;
                        doccontent += '<div class="ui-block-a dv-bold-width">Accompanist(s):</div>';
                        for (var o = 0; o < onlyAccName.length; o++) {
                            if (onlyAccName[o].Acc_User_Name.toUpperCase().indexOf("VACANT") > -1) {
                                continue;
                            }
                            Accslno++
                            if (onlyAccName[o].Is_Only_For_Doctor.toUpperCase() == "Y") {
                                doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '(only for doctor) </div>';
                            }
                            else {
                                doccontent += '<div class="ui-block-a dv-product">' + Accslno + ' . ' + onlyAccName[o].Acc_User_Name + '</div>';
                            }
                        }
                    }

                    // Detailed Products.
                    var productDetail = jsonPath(jsonData, "$.Tables[10].Rows[?(@.Doctor_Visit_Code=='" + doctor_visit_code + "')]");
                    if (productDetail != false) {
                        doccontent += '<div class="ui-block-a dv-bold-width">Detailed Products:</div>';
                        var slno = 0;
                        for (var x = 0; x < productDetail.length; x++) {
                            slno++
                            doccontent += '<div class="ui-block-a dv-product">' + slno + ' . ' + productDetail[x].Product_Name + '</div>';
                        }
                    }


                    //to get the products fro the doctor
                    if (jsonData.Tables[4].Rows.length > 0) {
                        var product = jsonPath(jsonData, "$.Tables[4].Rows[?(@.DCR_Visit_Code=='" + jsonData.Tables[3].Rows[d].DCR_Visit_Code + "')]");
                        if (product != false) {
                            doccontent += '<div class="ui-block-a dv-bold-width">Sample/Promotional items:</div>';
                            for (var p = 0; p < product.length; p++) {
                                doccontent += '<div class="ui-block-a dv-product">' + product[p].Product_Name + '(' + product[p].Quantity_Provided + ')' + '</div>';
                            }
                        }
                    }
                    if (jsonData.Tables[5].Rows.length > 0) {
                        var chemist = jsonPath(jsonData, "$.Tables[5].Rows[?(@.DCR_Visit_Code=='" + doctor_visit_code + "')]");
                        if (chemist != false) {
                            doccontent += '<div class="ui-block-a dv-bold-width">' + doctor_caption + ':</div>';

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
                                            if (rcpa != null && rcpa != false) {

                                                doccontent += '<div class="ui-block-a dv-bold-width" style="margin-left:3%;">RCPA :  <br /> <span class="cls_spnRCPAIndent">' + rcpa[0].Product_Name + "</span></div>";

                                                doccontent += '<div style="clear:both"></div><div style="margin-left:3%;">'
                                                for (r = 1; r < rcpa.length; r++) {
                                                    doccontent += '<div class="ui-block-a" style="width:100%"><span class="cls_spnRCPAIndent">Comp : ' + rcpa[r].Competitor_Product_Name + " (" + rcpa[r].Support_Qty + ") </span></div><br />";
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
                            doccontent += '<div class="ui-block-a dv-bold-width">' + chemist_caption + ':</div><div>No ' + chemist_caption + ' Details Found.</div>';
                        }
                    }
                    doccontent += "</div>"
                    siNo++
                }
            }
            if (doccontent != "") {
                $("#dv-doctors").html(doccontent).trigger('create');
            }
            else {
                $("#dv-doctors").html('<div class="">No ' + doctor_caption + ' Details found</div>')
            }
            //var chemistcontent = "";
            ////to bind the chemist details
            // if (jsonData.Tables[5].Rows.length > 0) {
            //     for (var c = 0; c < jsonData.Tables[5].Rows.length; c++) {
            //         var saleProduct = new Array();
            //         chemistcontent += '<div class="ui-block-a dv-bold-width">' + (c + 1) + ' . ' + jsonData.Tables[5].Rows[c].Chemists_Name + '<br />POB : ' + jsonData.Tables[5].Rows[c].PO_Amount + '</div>';
            //         if ($('#drpFlag').val() == "FIELD_RCPA") {// to remove rcpa details for Field
            //             //to get the RCPA Details
            //             if (jsonData.Tables[6].Rows.length > 0) {
            //                 var rcpasalesprod = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Chemist_Visit_Code=='" + jsonData.Tables[5].Rows[c].DCR_Chemists_Code + "')]");
            //                 if (rcpasalesprod != false) {
            //                     //to get the sales products
            //                     for (var r = 0; r < rcpasalesprod.length; r++) {
            //                         if ($.inArray(rcpasalesprod[r].DCR_Product_Code, saleProduct) == -1) {
            //                             saleProduct.push(rcpasalesprod[r].DCR_Product_Code)
            //                         }
            //                     }
            //                 }
            //                 //to get the competator details
            //                 if (saleProduct.length > 0) {
            //                     for (var p = 0; p < saleProduct.length; p++) {
            //                         //var rcpasalesprod = jsonPath(jsonData, "$.Tables[6].Rows[?(@.Chemist_Visit_Code=='" + jsonData.Tables[5].Rows[c].DCR_Chemists_Code + "' & @.Product_Code=='" + saleProduct[p].toString() + "')]");
            //                         var rcpa = jsonPath(rcpasalesprod, "$.[?( @.DCR_Product_Code=='" + saleProduct[p].toString() + "')]");
            //                         if (rcpa != false) {

            //                             chemistcontent += '<div class="ui-block-a dv-bold-width">Input : ' + rcpa[0].Product_Name + "</div>";

            //                             chemistcontent += '<div style="clear:both"></div><div class="dv-comp-border">'
            //                             for (r = 0; r < rcpa.length; r++) {
            //                                 chemistcontent += '<div class="ui-block-a" style="width:100%">Comp : ' + rcpa[r].Competitor_Product_Name + " (" + rcpa[r].Support_Qty + ") </div><br />";
            //                             }
            //                             chemistcontent += '</div><div style="clear:both"></div>'
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     if (chemistcontent != "") {
            //         $("#dv-chemist").html(chemistcontent).trigger('create');
            //     }
            //     else {
            //         $("#dv-chemist").html('<div class="dv-comp-border">No Chemist Details found</div>');
            //     }
            // }
            //stockiest visit
            var stockiestContent = "";
            if (jsonData.Tables[7].Rows.length > 0) {
                debugger;
                for (var s = 0; s < jsonData.Tables[7].Rows.length; s++) {
                    var stock_Name = jsonData.Tables[7].Rows[s].Stockiest_Name;
                    var stock_POAmount = jsonData.Tables[7].Rows[s].PO_Amount;
                    var stock_ColAmt = jsonData.Tables[7].Rows[s].Collection_Amount;
                    var stock_Remarks = jsonData.Tables[7].Rows[s].Remarks_By_User;
                    stock_POAmount = stock_POAmount == null ? "0" : $.trim(stock_POAmount).length == 0 ? "0" : stock_POAmount;
                    stock_ColAmt = stock_ColAmt == null ? "0" : $.trim(stock_ColAmt).length == 0 ? "0" : stock_ColAmt;
                    stock_Remarks = stock_Remarks == null ? "-" : $.trim(stock_Remarks).length == 0 ? "-" : stock_Remarks;


                    stockiestContent += '<div class="ui-block-a" style="width:100%"><span>Name :</span>' + stock_Name + '</div>';
                    stockiestContent += '<div class="ui-block-a" style="width:100%"><span>POB :</span>' + stock_POAmount + '</div>';
                    stockiestContent += '<div class="ui-block-a" style="width:100%"><span>Collection :</span>' + stock_ColAmt + '</div>';
                    stockiestContent += '<div class="ui-block-a" style="width:100%"><span>Remarks :</span>' + stock_Remarks + '</div>';
                    stockiestContent += '<div class="ui-block-a cls_stockEnd" style="width:100%"></div>';
                }
            }
            if (stockiestContent != "") {
                $("#dv-stockiest").html(stockiestContent);
            }
            else {
                $("#dv-stockiest").html('<div class="dv-comp-border">No ' + stockist_caption + ' Details found</div>');
            }

            //stockiest visit
            var expenseContent = "";
            $("#dvExpense").css('display', '');
            $("#dv-expenses").css('display', '');
            if (jsonData.Tables[8].Rows.length > 0) {
                for (var e = 0; e < jsonData.Tables[8].Rows.length; e++) {
                    expenseContent += '<div class="ui-block-a" style="width:100%">' + (e + 1) + ' . ' + jsonData.Tables[8].Rows[e].Expense_Type_Name + ' - ' + jsonData.Tables[8].Rows[e].Expense_Amount + '</div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%"><span>Remarks :</span>' + jsonData.Tables[8].Rows[e].Expense_Remarks + '</div>';
                }
            }
            if (expenseContent != "") {
                $("#dv-expenses").html(expenseContent);
            }
            else {
                $("#dv-expenses").html('<div class="dv-comp-border">No Expense Details found</div>');
            }
            $('#txtRemarks').val(jsonData.Tables[0].Rows[0].DCR_general_Remarks);

            if ($('#ddlStatus').val() == "1") {
                $('#btnApprove').css('display', 'block');
                $('#btnUnApprove').css('display', 'block');

            }
            else {
                $('#btnUnApprove').css('display', 'block');
                $('#btnApprove').css('display', 'none');

            }

        }
        if (flag == "A") {
            $("#dvCP").css('display', 'none');
            $("#dvDoctor").css('display', 'none');
            $("#dvChemist").css('display', 'none');
            $("#dvStockiest").css('display', 'none');
            //$("#dvExpense").css('display', 'none');
            $("#dvLeave").css('display', 'none');
            $("#dv-Accomp").css('display', 'none');

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
                        sfcContent += '<div class="ui-block-a dv-bold-width">' + (s + 1) + ' . From Place : ' + jsonData.Tables[1].Rows[s].From_Place + '</div><div style="clear:both"></div>';
                        sfcContent += '<div class="ui-block-a" style="width:100%">To Place : ' + jsonData.Tables[1].Rows[s].To_Place + '</div><div style="clear:both"></div>';
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

            var expenseContent = "";
            $("#dvExpense").css('display', '');
            $("#dv-expenses").css('display', '');
            if (jsonData.Tables[3].Rows.length > 0) {
                for (var a = 0; a < jsonData.Tables[3].Rows.length; a++) {
                    var remarks = jsonData.Tables[3].Rows[a].Remarks == null ? "" : jsonData.Tables[3].Rows[a].Remarks;

                    expenseContent += '<div style="clear:both"></div><div class="dv-comp-border">'
                    expenseContent += '<div class="ui-block-a dv-bold-width">' + (a + 1) + ' . ' + jsonData.Tables[3].Rows[a].Activity_Name + '(' + jsonData.Tables[3].Rows[a].Project_Name + ')</div><div style="clear:both"></div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%">Start Time : ' + jsonData.Tables[3].Rows[a].StartTime + '</div><div style="clear:both"></div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%">End Time : ' + jsonData.Tables[3].Rows[a].EndTime + '</div><div style="clear:both"></div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%">Remarks : ' + remarks + '</div><div style="clear:both"></div>';
                    expenseContent += '</div><div style="clear:both"></div>'
                }
            }
            $("#dv-activity").html(expenseContent);
            var expenseContent = "";
            if (jsonData.Tables[2] != null && jsonData.Tables[2].Rows.length > 0) {
                for (var e = 0; e < jsonData.Tables[2].Rows.length; e++) {
                    expenseContent += '<div class="ui-block-a" style="width:100%">' + (e + 1) + ' . ' + jsonData.Tables[2].Rows[e].Expense_Type_Name + ' - ' + jsonData.Tables[2].Rows[e].Expense_Amount + '</div>';
                    expenseContent += '<div class="ui-block-a" style="width:100%"><span>Remarks :</span>' + jsonData.Tables[2].Rows[e].Expense_Remarks + '</div>';
                }
            }
            $('#txtRemarks').val(jsonData.Tables[0].Rows[0].DCR_general_Remarks);

            if (expenseContent != "") {
                $("#dv-expenses").html(expenseContent);
            }
            else {
                $("#dv-expenses").html('<div class="dv-comp-border">No Expense Details found</div>');
            }
            if ($('#ddlStatus').val() == "1") {
                $('#btnApprove').css('display', 'block');
                $('#btnUnApprove').css('display', 'block');

            }
            else {
                $('#btnUnApprove').css('display', 'block');
                $('#btnApprove').css('display', 'none');

            }

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
            $('#dvDCREnteredDate').css('display', 'none');

            $("#dvLeave").css('display', '');

            if (jsonData.Tables[0].Rows.length > 0) {
                $("#dv-Leave-header").html("<div style='clear:both'></div><div class='ui-block-a dv-bold-width'>DCR Date : " + jsonData.Tables[0].Rows[0].Date + "</div><div style='claer:both'></div>");
                $("#dv-Leave-header").append("<div class='ui-block-a dv-bold-width'>Reason : " + jsonData.Tables[0].Rows[0].Reason + "</div><div style='claer:both'></div>");
            }
            if (jsonData.Tables[1].Rows.length > 0) {
                $("#dv-Leave").html("<div class='ui-block-a dv-bold-width' id='dv-LeaveType'>" + jsonData.Tables[1].Rows[0].Leave_Type_Name + "</div><div style='claer:both'></div>");
            }
            $('#txtRemarks').val(jsonData.Tables[0].Rows[0].DCR_general_Remarks);

            if ($('#ddlStatus').val() == "1") {
                $('#btnApprove').css('display', 'block');
                $('#btnUnApprove').css('display', 'block');

            }
            else {
                $('#btnUnApprove').css('display', 'block');
                $('#btnApprove').css('display', 'none');

            }
        }
    }
    $('#dv-dcrdetails').css('display', 'block');
    $('#spnUsername').val(UserName + '-' + DCRDate);
    $.mobile.loading('hide');
}

function fnNextDate(mode) {
    debugger;
    //var date = $("#txtDCRDate").val().split('/')[2] + "-" + $("#txtDCRDate").val().split('/')[1] + "-" + $("#txtDCRDate").val().split('/')[0];
    //var date = $("#txtDCRDate").val();
    var result = fnGetDate();
    if (!result) {
        return false
    }
    var status = $('#ddlStatus').val();
    var date = result;
    date = DCRDate;
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRApproval/GetPrevNextDCRDate',
        data: "Date=" + date + "&Flag=" + flag +"&status="+status +"&Mode=" + mode + "&usercode=" + $("#hdnUserCode").val() + "",
        success: function (result) {
            result = eval('(' + result + ')');
            if (result.Tables[0].Rows[0].Date != "" && result.Tables[0].Rows[0].Date != null) {
                //var dcrDate = result.Tables[0].Rows[0].Date.split('/')[2].toString() + "-" + result.Tables[0].Rows[0].Date.split('/')[1].toString() + "-" + result.Tables[0].Rows[0].Date.split('/')[0].toString();
                //$("#txtDCRDate").val(dcrDate);

                //$("#txtDate").val(result.Tables[0].Rows[0].Date.split('/')[0].toString());
                //$("#txtMonth").val(result.Tables[0].Rows[0].Date.split('/')[1].toString());
                //$("#txtYear").val(result.Tables[0].Rows[0].Date.split('/')[2].toString());

                //var date = $("#txtDCRDate").val().split('/')[2] + "-" + $("#txtDCRDate").val().split('/')[1] + "-" + $("#txtDCRDate").val().split('/')[0];
                //var date = $("#txtDCRDate").val();
                //var result = fnGetDate();
                //if (!result) {
                //    return false
                //}
                date = result.Tables[0].Rows[0].Date.split('/')[2].toString() + '-' + result.Tables[0].Rows[0].Date.split('/')[1].toString() + '-' + result.Tables[0].Rows[0].Date.split('/')[0].toString();
                DCRDate = date;

                $.mobile.loading('show');
                $.ajax({
                    type: 'POST',
                    data: 'dcrActualDate=' + date + "&flag=" + flag + "&username=" + UserName + "&usercode=" + $("#hdnUserCode").val() + "&regioncode=" + $("#hdnRegionCode").val() + "",
                    url: '/HiDoctor_Activity/DCRApproval/GetUserInstantReport',
                    success: function (response) {
                        // we have the response
                        fnDCRDeatils(eval('(' + response + ')'));
                    },
                    error: function (e) {
                        alert("Eror" + e);
                    }
                });
            }
            else {
                $("#dv-dcrdetails").css('display', 'none');
                $("#dv-result").css('display', '');
                $("#dv-result").html('No DCR Details found');
            }
        }
    });

}

function fnChangeStatus(status) {
    debugger;

    if ($("#txtRemarks").val() != "") {
        var specialCharregex = new RegExp(/^[a-zA-Z0-9-_.?,;:&*()[\] ]+$/);
        $('#txtRemarks').val($('#txtRemarks').val().replace(/\n/g, ''))
        $('#txtRemarks').val($('#txtRemarks').val().replace(/\r/g, ''))
        if (!specialCharregex.test($("#txtRemarks").val())) {
            $("#dv-alert").css('display', '');
            $("#dv-alert").html('Please Remove the following special characters ' + restrictedSpecialchar_g + '');
            return;
        }
    }
    debugger;
    if (status == '0') {
        if ($('#txtRemarks').val() == "") {
            $("#dv-alert").css('display', '');
            $("#dv-alert").html('Reason must be given for unapproval');
            $.mobile.loading('hide');
            return false;
        }
    }
    var leaveValidation = fnGetPrivilegeVal("LEAVE_ENTRY_VALIDATION_REQUIRED_LEAVES", "");
    var DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK = fnGetPrivilegeVal("DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK", "DISABLED");
    var twoActivityExpenseValidation = fnGetPrivilegeVal("VALIDATE_TWO_ACTIVITY_EXPENSES","YES");
    var fareDailyAllowance = fnGetPrivilegeVal("FARE_DAILY_ALLOWANCE","");

    var dateArr = $('#spnDCRDate').html().split('/');
    var date = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
    //var date = fnGetDate();
    //for calci fields
    
    var leaveTypename = "";
    if ($("#dv-LeaveType").html() != "" || $("#dv-LeaveType").html() != undefined) {
        leaveTypename = $("#dv-LeaveType").html();
    }
    var calcFieldsStatus = fnGetPrivilegeValue("CALC_FIELD_STATUS", "APPROVED");
    $.mobile.loading('show');

    debugger;
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRApproval/ChangeStatus',
        async: false,
        data: "DCRCode=" + $("#hdnDCRCode").val() + "&Flag=" + flag + "&LeaveTypeName=" + $("#dv-LeaveType").html() + "&UserCode=" + $("#hdnUserCode").val() + "&Remarks=" + $("#txtRemarks").val() + "&Status=" + status + "&LeaveValidation=" + leaveValidation +
            "&CalcFields=" + calcFieldsStatus + "&DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK=" + DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK + "&DCR_Actual_Date=" + date + "&twoActivityExpenseValidation=" + twoActivityExpenseValidation + "&fareDailyAllowance=" + fareDailyAllowance,
        success: function (result) {
            debugger;
            if (result.split(':')[0] == "SUCCESS") {
                $("#dv-dcrappliedusers").css('display', '');
                $("#dv-dcrdetails").css('display', 'none');
                debugger;
                if (status == "2") {
                    //$("#dv-result").html("DCR Approved successfully");
                    $("#dv-dcrDCRAppliedDates").css('display', 'none');
                    fnGetDCRAppliedUsers();
                    $.mobile.loading('hide');
                    $("#dv-result").simpledialog2({
                        mode: 'blank',
                        headerText: 'Alert',
                        blankContent:
                          "<h3>DCR Approved successfully</h3>" +
                          // NOTE: the use of rel="close" causes this button to close the dialog.
                          "<a rel='close' data-role='button' href='#'>Close</a>",
                        width: '430px'
                    })
                }
                else {                  
                    //$("#dv-result").html("DCR unapproved successfully");
                    $("#dv-dcrDCRAppliedDates").css('display', 'none');
                    fnGetDCRAppliedUsers();
                    $.mobile.loading('hide');
                    $("#dv-result").simpledialog2({
                        mode: 'blank',
                        headerText: 'Alert',
                        blankContent:
                          "<h3>DCR unapproved successfully</h3>" +
                          // NOTE: the use of rel="close" causes this button to close the dialog.
                          "<a rel='close' data-role='button' href='#'>Close</a>",
                        width: '430px'
                    })
                }
            }
            else if (result.split(':')[0] == "FAIL") {
                $("#dv-dcrappliedusers").css('display', '');
                $("#dv-dcrdetails").css('display', 'none');
               // $("#dv-result").html(result.split(':')[1]);
                $("#dv-dcrDCRAppliedDates").css('display', 'none');
                fnGetDCRAppliedUsers();
                $.mobile.loading('hide');
                $("#dv-result").simpledialog2({
                    mode: 'blank',
                    headerText: 'Alert',
                    blankContent:
                      "<h3>" + result.split(':')[1] + "</h3>" +
                      // NOTE: the use of rel="close" causes this button to close the dialog.
                      "<a rel='close' data-role='button' href='#'>Close</a>",
                    width: '430px'
                })
            }
            else {
                $("#dv-alert").css('display', '');
                $.mobile.loading('hide');
            }
        }
    });
}
//To Get the all the privilege which is mapped to the user
function fnGetAllPrivileges(userCode) {
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/Master/GetPrivilegesByUser',
        data: "UserCode=" + userCode + "",
        success: function (response) {
            userPrivilege_g = response;
        },
        error: function (e) {
        }
    });
}
function fnGetPrivilegeVal(privilegeName, defaultValue) {
    if (userPrivilege_g != null) {
        if (privilegeName != "") {
            var selectedValue = jsonPath(userPrivilege_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}
function fnGetDate() {
    var date=$.trim($("#txtMonth").val());
    if ($.trim($("#txtMonth").val()) == "") {
        fnMsgAlert('error', 'DCR Approval', 'Please select month and year');
        return false;
    }
    // end

    return date;
}