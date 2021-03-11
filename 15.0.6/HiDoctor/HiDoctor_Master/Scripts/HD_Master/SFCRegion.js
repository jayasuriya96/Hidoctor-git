var userPrivilege_g = '';
var cate_g = ''
var ALPHAREGX_g = new RegExp("([a-zA-Z].*?){1}");
var ALPHANUMERICREGX_g = new RegExp("^[a-zA-Z0-9 _]+$");
var WHOLENUMBERREGEX_g = new RegExp("^[0-9]+$");

var travelModeArr = new Array();


var SFC_TABLE_HEADER_STRING = "<div><table id='tblSFCVersion' cellspacing='0' cellpadding='0' style='border:1px solid #ddd' class='table table-stripped'><thead><tr><th>From Place</th><th>To Place</th><th>Category</th><th>Distance</th><th>Amount</th>";
SFC_TABLE_HEADER_STRING += "<th>Travel Mode</th><th>Date From</th><th>Date To</th><th>SFC Min Visit Count</th><th>SFC Max Visit Count</th></tr></thead><tbody>";

var SFC_TABLE_EDIT_HEADER_STRING = "<div><table id='tblSFCEdit' style='border:1px solid #ddd' cellspacing='0' cellpadding='0' class='table table-stripped'><thead><tr><th>From Place</th><th>To Place</th><th>Category</th><th>Travel Mode</th><th class='distanceEdit'>Distance</th><th class='amtEdit'>Amount</th>";
SFC_TABLE_EDIT_HEADER_STRING += "<th>Date From</th><th>Date To</th><th>SFC Min Visit Count</th><th>SFC Max Visit Count</th></tr></thead><tbody>";

var SFC_ADD_VERSION_ROW_STRING = "<tr id='SFCADDROW_SNUG'><td id='TDFP_SNUG' class='col-lg-1'><span  id='FP_SNUG'></span><span id='DFC_SNUG' style='display:none'></span><span id='SFCV_SNUG' style='display:none'></span><span id='SPNARC_SNUG' style='display:none'></span></td><td id='TDTP_SNUG' class='col-lg-1'><span id='TP_SNUG'></span></td><td id='TDCAT_SNUG' class='col-lg-1'><span id='CAT_SNUG'></span></td><td id='TDDIS_SNUG' class='col-lg-1'><span id='DIS_SNUG'></span></td><td id='TDAMT_SNUG' class='col-lg-1'><span id='AMT_SNUG'></span></td>";
SFC_ADD_VERSION_ROW_STRING += "<td id='TDTM_SNUG' class='col-lg-1'><span id='TM_SNUG'></span></td><td id='TDDF_SNUG' class='col-lg-1'><span id='DF_SNUG'></span></td><td id='TDDT_SNUG' class='col-lg-1'><span id='DT_SNUG'></span><span id='SPNADT_SNUG' style='display:none'></span></td><td id='TDSFCMinVC_SNUG' class='col-lg-1'><span id='SFCMinVC_SNUG'></span></td><td id='TDSFCVC_SNUG' class='col-lg-1'><span id='SFCVC_SNUG'></span></td></tr>";

var SFC_ADD_VERSION_EDIT_ROW_STRING = "<td id='TDFP_SNUG' class='col-lg-1'><span id='FP_SNUG'></span><span id='SPNADFC_SNUG' style='display:none'></span><span id='SPNASFCV_SNUG' style='display:none'></span><span id='SPNARC_SNUG' style='display:none'></span></td><td id='TDTP_SNUG' class='col-lg-1'><span id='TP_SNUG'></span></td><td id='TDCAT_SNUG' class='col-lg-1'><span id='CAT_SNUG'></span></td><td id='TDDIS_SNUG' class='col-lg-1'><input type='text' style='width:55px'  maxlength='4'  id='TXTDIS_SNUG'></td><td id='AMT_SNUG' class='col-lg-1'><input type='text' style='width:60px' maxlength='7' id='TXTAMT_SNUG'></td>";
SFC_ADD_VERSION_EDIT_ROW_STRING += "<td id='TDTM_SNUG' class='col-lg-1'><span id='TM_SNUG'><span></td><td id='TDDF_SNUG' class='col-lg-1'><input type='text' class='dateSFC' onchange='fnSetDateToPreviousVersion(SNUG)' style='width:80px' id='TXTDF_SNUG'></td><td id='TDDT_SNUG' class='col-lg-1'><input type='text' style='width:80px' class='dateSFC' id='TXTDT_SNUG'></td><td id='TDSFCMinVC_SNUG' class='col-lg-1'><input type='text' maxlength='3' id='TXTSFCMinVC_SNUG'  onchange='fnCheckCount(this,SNUG);' /></td><td id='TDSFCVC_SNUG' class='col-lg-1'><input type='text' maxlength='3' id='TXTSFCVC_SNUG'  onchange='fnCheckCount(this,SNUG);' /></td>";

var SFC_ADD_VERSION_END_STRING = "</tbody></table></div><div><input type='button' class=' btn btn-primary btn-success' value='Save' onclick='fnSaveSFCVersion()'/></div>";
var SFC_EDIT_TABLE_END_STRING = "</tbody></table></div><div style='clear:both'></div><div><input type='button' class=' btn btn-primary btn-success' value='Save' onclick='fnSaveEditSFC()'/></div>";

var SFC_EDIT_GRID_STRING = "<tr>"
                        + "<td id='TDFP_SNUG' style='width:150px;'>"
                            + "<input type='text' id='TXTFP_SNUG' onchange='fnSetCombinationValue(1,SNUG)'  /><br />"
                            + "<span id='SPNFP_SNUG' ></span><span id='SPNDFC_SNUG' style='display:none'></span>"
                            + "<span id='SPNSFCV_SNUG' style='display:none'></span>"
                            + "<span id='SPNRC_SNUG' style='display:none'></span>"
                        + "</td>";
SFC_EDIT_GRID_STRING += "<td id='TDTP_SNUG' style='width:150px;'>"
                            + "<input type='text' id='TXTTP_SNUG' onchange='fnSetCombinationValue(2,SNUG)'  /><br />"
                            + "<span id='SPNTP_SNUG' ></span>"
                        + "</td>"
                        + "<td id='TDCAT_SNUG' style='width:300px;'>"
                            + "<select id='SELCAT_SNUG' class='col-lg-12 clscate'  onchange='fnSetCombinationValue(3,SNUG)'></select><br />"
                            + "<span id='SPNCAT_SNUG' ></span>"
                        + "</td>"
SFC_EDIT_GRID_STRING += "<td id='TDTM_SNUG' style='width:100px;'>"
                            + "<select id='SELTM_SNUG' class='clstm' onchange='fnSetCombinationValue(4,SNUG)'></select>"
                            + "<span id='SPNTM_SNUG' ></span>"
                      + "</td>";
SFC_EDIT_GRID_STRING += "<td id='TDDIS_SNUG' style='width:100px;' >"
                            + "<input type='text' maxlength='4' class='distanceEdit form-control'  id='TXTDIS_SNUG'>"
                            + "<span id='SPNDIS_SNUG'></span>"
                     + "</td>"
                     + "<td id='AMT_SNUG' style='width:100px;'>"
                            + "<input type='text' class='form-control' maxlength='7' id='TXTAMT_SNUG'><span id='SPNAMT_SNUG'></span>"
                     + "</td>";
SFC_EDIT_GRID_STRING += " <td id='TDDF_SNUG' style='width:150px;' >"
                            + "<input type='text' class='dateSFCED form-control' onchange='fnDateFromEdit(SNUG)' id='TXTDF_SNUG' >"
                            + "<span id='SPNDF_SNUG'></span>"
                     + "</td>";
SFC_EDIT_GRID_STRING += "<td id='TDDT_SNUG' style='width:150px;' >"
                            + "<input type='text' class='dateSFCED form-control' id='TXTDT_SNUG' onchange='fnDateToEdit(SNUG)'>"
                            + "<span id='SPNDT_SNUG'></span>"
                     + "</td>"
SFC_EDIT_GRID_STRING += "<td id='TDSFCMinVC_SNUG' style='width:80px;'>"
                            + "<input type='text' maxlength='3' id='TXTSFCMinVC_SNUG' onchange='fnCheckCount(this,SNUG);' class='form-control ' />"
                            + "<span id='SPNSFCMinVC_SNUG'></span>"
                     + "</td>"
                     + "<td id='TDSFCVC_SNUG' style='width:80px;'>"
                            + "<input type='text' maxlength='3' id='TXTSFCVC_SNUG' onchange='fnCheckCount(this,SNUG);' class='form-control ' />"
                            + "<span id='SPNSFCVC_SNUG'></span>"
                     + "</td>"
                     + "</tr>";

function fnOpenTree() {
    $("#regiontree").slideDown();
    $("#imggr").hide();
    $("#imgless").show()
    $('#divleft').addClass('col-lg-3')
    $('#dataDiv').removeClass('col-lg-12')
    $('#dataDiv').addClass('col-lg-9')
}
function fnCloseTree() {
    $("#regiontree").slideUp();
    $("#imggr").show();
    $("#imgless").hide()
    $('#divleft').removeClass('col-lg-3')
    $('#dataDiv').addClass('col-lg-12')
    $('#dataDiv').removeClass('col-lg-9')
}





function fnGetSFCRegions(pageNumber, showmsg) {
    debugger;
    try {

        $('#dvSFC').block({
            message: 'Retrieving the SFC data.',
            css: { border: '1px solid #ddd' }
        });

        var serachregion = $('#txtRegionSearch').val();
        var searchFromPlace = $('#txtFromSearch').val();
        var searchToPlace = $('#txttoSearch').val();
        var showArchived = $(":radio[name='rdoShowArchived']:checked").val();
        if ($(":checkbox[name=SFCStatus]:checked").length == 0) {
            fnMsgAlert('info', 'SFC -DistanceBased', 'Please select SFC status.');
            $('#dvSFC').unblock();
            return false;

        }

        var option = "";
        $('input:checkbox[name=SFCStatus]').each(function () {
            if ($(this).is(':checked')) { option += $(this).val() + ","; }
        });


        //     fnClear();
        if (!showmsg) {
            fnShowMessage('', '');
            $('#lblmessage').html('')
        }
        var sfc_approval_req = "YES";//fnGetPrivilegeVal('SFC_APPROVAL_REQUIRED', 'YES');  // modified since been asked to remove approval button in sfc screen
        $('#dvApprovebtnArea').html('');
        //if (sfc_approval_req == "NO") {
        //    var btnHTML = '<button id="btnApprove" style="margin-right: 5px;" type="button" class="btn btn-primary" style="display: none" onclick="fnSFCApprove()">Approve</button>';
        //    btnHTML += '<button id="btnUnapprove" style="margin-right: 5px;" type="button" class="btn btn-primary" style="display: none" onclick="fnSFCUnapprove()">Un Approve</button>';
        //    $('#dvApprovebtnArea').html(btnHTML);
        //}

        $.ajax({
            type: 'POST',
            data: "region_code=" + $("#hdnRegionCode").val() + "&SFC_Approval_REQ_PRIV=" + sfc_approval_req + "&pageNumber=" + pageNumber + "&excelDownload=false" + "&searchregion=" + serachregion + "&searchFromPlace=" + searchFromPlace + "&searchToPlace=" + searchToPlace + "&SFCStatus=" + option + "&showArchived=" + showArchived,
            url: '../SFCRegion/GetSFCRegionsHTMLFormat',
            success: function (response) {
                $('#dvSFC').unblock();
                if (response.indexOf('table') > -1) {
                    $('#dvSFCGridData').html(response);
                    $('#SFCExcellink').css('display', '');
                    if (sfc_approval_req.toUpperCase() == "NO") {
                        $('#btnApprove').css('display', '')
                        $('#btnUnapprove').css('display', '')
                    }
                }
                else {
                    $('#dvSFCGridData').html(response);
                    $('#SFCExcellink').css('display', 'none');
                    if (sfc_approval_req.toUpperCase() == "NO") {
                        $('#btnApprove').css('display', '')
                        $('#btnUnapprove').css('display', '')
                    }
                }
            },
            error: function (e) {
                $('#dvSFC').unblock();
                if (sfc_approval_req.toUpperCase() == "NO") {
                    $('#btnApprove').css('display', '')
                    $('#btnUnapprove').css('display', '')
                    $('#SFCExcellink').css('display', 'none');
                }

                $('#errormsg').html('OOPS! ' + e.responseText)
                $('#errormsg').css('display', '');
            }
        });
    }
    catch (err) {
        fnShowMessage('WARNING', err.message);
        $('#dvSFC').unblock();
    }
}

function fnGetAllPrivileges(region_Code) {
    userPrivilege_g = '';
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/Master/GetUserPrivileges',
        data: "regionCode=" + region_Code,
        async: false,
        success: function (response) {
            debugger;
            userPrivilege_g = response[0].Data;
        },
        error: function (e) {
        }
    });
}

function fnGetPrivilegeVal(privilegeName, defaultValue) {
    debugger;
    if (userPrivilege_g != null) {
        if (privilegeName != "") {
            var selectedValue = jsonPath(userPrivilege_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue != null && selectedValue && selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}

function GetRegionTreeLength() {
    var regionTreelength = 0;
    $("#regiontree").dynatree("getRoot").visit(function (node) {
        $("#hdnRegionCode").val(node.data.key)
        regionTreelength++;
    });
    if (regionTreelength > 1) {
        $("#hdnRegionCode").val('');
    }
    return regionTreelength;
}

function fnFormValidation() {
    $('#approved').attr('checked', 'checked');
    var ermsg = '';
    if ($('#hdnRegionCode').val().length == 0) {
        ermsg += "Please choose the atleast one region.<br />"
    }
    if ($.trim($('#txtfrmplace').val()).length == 0) {
        ermsg += "Please enter the From Place.<br />"
    }
    else {
        if ($.trim($('#txtfrmplace').val()).length > 0) {
            if (!ALPHANUMERICREGX_g.test($.trim($('#txtfrmplace').val()))) {
                ermsg += "Invalid From Place. Please remove the special characters. <br />"
            }
            if (!ALPHAREGX_g.test($.trim($('#txtfrmplace').val()))) {
                ermsg += "Please atleast enter one Alpha character in From Place. <br />"
            }
        }
    }
    if ($.trim($('#txttoplace').val()).length == 0) {
        ermsg += "Please enter the To Place.<br />"
    }
    else {
        if ($.trim($('#txttoplace').val()).length > 0) {
            if (!ALPHANUMERICREGX_g.test($.trim($('#txttoplace').val()))) {
                ermsg += "Invalid To Place. Please remove the special characters.<br />"
            }
            if (!ALPHAREGX_g.test($.trim($('#txttoplace').val()))) {
                ermsg += "Please atleast enter one Alpha character in To Place. <br />"
            }

        }
    }
    if ($.trim($('#drpCategory :selected').text()).length == 0) {
        ermsg += "Please choose the category.<br />"
    }
    if ($.trim($('#txtDistance').val()).length == 0) {
        ermsg += "Please enter the Distance.<br />"
    }
    else {
        if (!WHOLENUMBERREGEX_g.test($('#txtDistance').val())) {
            ermsg += "Please enter the valid Distance.<br />"
        }
    }

    if ($.trim($('#txtAmount').val()).length > 0) {
        if (isNaN($.trim($('#txtAmount').val()))) {
            ermsg += "Please enter the valid Amount.<br />"
        }
        else {
            if (parseFloat($('#txtAmount').val()) < 0) {
                ermsg += "Please enter the valid Amount.<br />"
            }
        }
    }

    if ($(':checkbox[name=chkSelectUsers]:checked').length == 0) {
        ermsg += "Please select any one Travel Mode.<br/>";
    }


    if ($.trim($('#txtSFCVisitCount').val()).length > 0) {
        if (!WHOLENUMBERREGEX_g.test($('#txtSFCVisitCount').val())) {
            ermsg += "Please enter the valid SFC Max Visit Count.<br />";
        }
    }

    if ($.trim($('#txtSFCMinVisitCount').val()).length > 0) {
        if (!WHOLENUMBERREGEX_g.test($('#txtSFCMinVisitCount').val())) {
            ermsg += "Please enter the valid SFC Min Visit Count.<br />";
        }
    }


    if ($.trim($('#txtSFCVisitCount').val()).length > 0 && $.trim($('#txtSFCMinVisitCount').val()).length > 0) {
        if (WHOLENUMBERREGEX_g.test($('#txtSFCVisitCount').val()) == true && WHOLENUMBERREGEX_g.test($('#txtSFCMinVisitCount').val()) == true) {
            var minCount = parseInt($('#txtSFCMinVisitCount').val());
            var maxCount = parseInt($('#txtSFCVisitCount').val());
            if (minCount > 0 && maxCount > 0) {
                if (minCount > maxCount)
                    ermsg += "SFC Min Visit count cannot be greater than max visit count.<br />";
            }
        }
    }

    if ($('#txtDateFrom').val().length == 0) {
        ermsg += "Please enter the Date From value.<br />";
    }
    if ($('#txtDateTo').val().length == 0) {
        ermsg += "Please enter the Date To value.<br />";
    }

    if ($('#txtDateFrom').val().length > 0) {
        var date1 = $('#txtDateFrom').val().split('/')[1] + '/' + $('#txtDateFrom').val().split('/')[0] + '/' + $('#txtDateFrom').val().split('/')[2];
        if (!fnDateFormatValidation(date1)) {
            ermsg += "Please enter the correct date format in Date From.<br />";
        }
    }

    if ($('#txtDateTo').val().length > 0) {
        var date2 = $('#txtDateTo').val().split('/')[1] + '/' + $('#txtDateTo').val().split('/')[0] + '/' + $('#txtDateTo').val().split('/')[2];
        if (!fnDateFormatValidation(date2)) {
            ermsg += "Please enter the correct date format in Date To.<br />";
        }
    }

    if (!fnDateValidation()) {
        ermsg += "Date from should not be greater than Date to.<br />";
    }

    if (!fnDateRangeValidation($('#txtDateFrom').val())) {
        ermsg += "Invalid Day, Month, or Year range detected in Date From.<br />";
    }

    if (!fnDateRangeValidation($('#txtDateTo').val())) {
        ermsg += "Invalid Day, Month, or Year range detected in Date to.<br />";
    }

    // validate from place.
    if (ermsg.length > 0) {
        fnShowMessage("WARNING", ermsg);
        return false;
    }
    else {
        fnShowMessage('', '');
    }
    return true;
}

function fnGetAndFillCategory() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SFCRegion/GetCategory',
        async: false,
        success: function (response) {
            cate_g = response;
            for (var i = 0; i < response.length; i++) {
                $("#drpCategory").append("<option value='" + response[i].text + "'>" + response[i].text + "</option>");
            }
        },
        error: function (e) {

        }
    });
}

function fnInsertSFC() {
    debugger;
    try {
        $('#dvSFC').block({
            message: 'Save the SFC Details, Please wait',
            css: { border: '1px solid #ddd' }
        });


        if (fnFormValidation()) {


            var checkboxValues = [];
            $('input[name=chkSelectUsers]:checked').map(function () {
                checkboxValues.push($(this).val());
            });
            var SFCArray = new Array();
            var SFC = {};
            var sfc_approval_req = fnGetPrivilegeVal('SFC_APPROVAL_REQUIRED', 'YES');
            var status = sfc_approval_req.toUpperCase() == "NO" ? "1" : "2";
            SFC.Distance_Fare_Code = $('#hdnSFCCode').val();
            SFC.Region_Code = $("#hdnRegionCode").val();
            SFC.SFC_Version_No = $('#hdnSFCVersionNo').val();
            SFC.From_Region_Name = $.trim($('#txtfrmplace').val().toUpperCase());
            SFC.To_Region_Name = $.trim($('#txttoplace').val().toUpperCase());
            SFC.Category_Name = $('#drpCategory :selected').text();
            SFC.Distance = $('#txtDistance').val();
            SFC.Fare_Amount = $.trim($('#txtAmount').val()).length > 0 ? $('#txtAmount').val() : "0";
            if ($('#hdnSFCCode').val() == "") {
                SFC.Action = "INSERT";
            }
            else {
                SFC.Action = "EDIT";
            }

            if ($('#txtDateFrom').val().length > 0) {
                SFC.Date_From = $('#txtDateFrom').val().split('/')[1] + '/' + $('#txtDateFrom').val().split('/')[0] + '/' + $('#txtDateFrom').val().split('/')[2];
            }
            else {
                SFC.Date_From = null;
            }
            if ($('#txtDateTo').val().length > 0) {
                SFC.Date_To = $('#txtDateTo').val().split('/')[1] + '/' + $('#txtDateTo').val().split('/')[0] + '/' + $('#txtDateTo').val().split('/')[2];
            }
            else {
                SFC.Date_To = null;
            }
            SFC.Status = status;

            var checkboxValues = "";
            $("#divTravelMode").find("input:checked").each(function () {
                checkboxValues = checkboxValues + $(this).val() + ",";
            });
            var selectedTravelmodes = checkboxValues.slice(0, -1);
            $('#hdnmultravelmode').val('');

            SFC.Travel_Mode = selectedTravelmodes;

            SFC.SFC_Visit_Count = $('#txtSFCVisitCount').val() == "" ? 0 : $('#txtSFCVisitCount').val();
            SFC.Minimum_Count = $('#txtSFCMinVisitCount').val() == "" ? 0 : $('#txtSFCMinVisitCount').val();
            SFCArray.push(SFC);
            //  for (var i = 0; i < mode.length; i++) {
            // $('#hdnmultravelmode').val(mode[i]);

            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Master/SFCRegion/CheckExistingSFCforRegion',

                data: { regionCode: $("#hdnRegionCode").val(), fromPlace: $.trim($('#txtfrmplace').val()), toPlace: $.trim($('#txttoplace').val()), categoryName: $('#drpCategory :selected').text(), travelMode: selectedTravelmodes },
                success: function (response) {
                    debugger;

                    $('#dvSFC').unblock();
                    if (response != null) {
                        var travelMode = "";
                        var message = "";
                        var mode = selectedTravelmodes.split(',');
                        for (travelMode in mode) {
                            if (response[mode[travelMode]] > 0) {

                                message += 'The travel mode ' + mode[travelMode] + ' SFC combination already exists.If you wish to add the same SFC combination,please use the Add SFC Version from the list. <br/>';
                            }
                        }
                    }

                    if (message.length > 0) {
                        fnShowMessage('WARNING', message);
                    }
                    else {
                        fnInsertandUpdateSFC(SFCArray);
                    }
                    //if (response == "0") {

                    //    fnInsertandUpdateSFC(SFCArray);
                    //    
                    //    fnGetSfc();
                    //    fnGetSfcTo();
                    //}
                    //else {
                    //    
                    //    alert('The travel mode ' + $('#hdnmultravelmode').val() + ' SFC combination already exists.If you wish to add the same SFC combination,please use the Add SFC Version from the list. ');
                    //    return;
                    //}
                },
                error: function (e) {

                    $('#dvSFC').unblock();
                    fnShowMessage('ERROR', e.responseText);
                }

            });
            // }

            //
            //$.ajax({
            //    type: 'POST',
            //    url: '../HiDoctor_Master/SFCRegion/CheckExistingSFCforRegion',
            //    data: { regionCode: $("#hdnRegionCode").val(), fromPlace: $.trim($('#txtfrmplace').val()), toPlace: $.trim($('#txttoplace').val()), categoryName: $('#drpCategory :selected').text(), travelMode: selectedTravelmodes },
            //    success: function (response) {
            //        $('#dvSFC').unblock();
            //        if (response == 'SUCCESS') {
            //            fnInsertandUpdateSFC(SFCArray);
            //            
            //            fnGetSfc();
            //           fnGetSfcTo();
            //        }
            //        else {
            //            fnMsgAlert('info', 'SFC Master', response);
            //            return;
            //        }
            //    },
            //    error: function (e) {
            //        
            //        $('#dvSFC').unblock();
            //        fnShowMessage('ERROR', e.responseText);
            //    }
            //});
        }
        else {
            $('#dvSFC').unblock();
        }
    }
    catch (err) {
        fnShowMessage('WARNING', err.message);
        $('#dvSFC').unblock();
    }
}
//--------------------START - Added for Existing sfc Record for same Region---------------------//
function fnInsertandUpdateSFC(SFCArray) {
    debugger;
    var saveType = "Save";
    try {
        $('#dvSFC').block({
            message: 'Save the SFC Details, Please wait',
            css: { border: '1px solid #ddd' }
        });
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/SFCRegion/SaveSFCMaster',
            data: "SFCJson=" + JSON.stringify(SFCArray) + "&SaveType=" + saveType,
            success: function (response) {
                $('#dvSFC').unblock();


                var travelModes = SFCArray[0].Travel_Mode.split(',')
                var travelMode = "";
                var savedMessage = "";
                var index = 0;
                for (index = 0; index < travelModes.length; index++) {
                    if (response[travelModes[index]] == "0") {
                        savedMessage += "Travel Mode <b>" + travelModes[index] + "</b> Saved successfully.<br/>";
                    }
                    else {
                        savedMessage += "Travel Mode <b>" + travelModes[index] + "</b>" + response[travelModes[index]] + " .<br/>";
                    }
                }


                fnShowMessage("WARNING", savedMessage);
                fnGetSFCRegions('1', true);
                fnClear();
                //if (response != null && typeof response == "string" && response == "0") {
                //    fnShowMessage('SUCCESS', "SFC saved successfully.");
                //    fnGetSFCRegions('1', true);
                //    fnClear();
                //}
                //else {
                //    fnShowMessage('WARNING', response);
                //    return false;
                //}
            },
            error: function (e) {
                $('#dvSFC').unblock();
                fnShowMessage('ERROR', e.responseText);
            }
        });
    }
    catch (err) {
        fnShowMessage('WARNING', err.message);
        $('#dvSFC').unblock();
    }

}
//--------------------END - Added for Existing sfc Record for same Region---------------------//

function fnShowMessage(messageType, Msg) {
    if (messageType == "SUCCESS") {
        fnMsgAlert('success', 'SFC - Region Based', Msg);
        //$('#warningmessage').html('');
        //$('#warningmessage').css('display', 'none')
        //$('#errormsg').html('');
        //$('#errormsg').css('display', 'none');
        //$('#successmsg').html(Msg);
        //$('#successmsg').css('display', '');
    }
    else if (messageType == "WARNING") {
        fnMsgAlert('info', 'SFC - Region Based', Msg);
        //$('#warningmessage').html(Msg);
        //$('#warningmessage').css('display', '')
        //$('#errormsg').html('');
        //$('#errormsg').css('display', 'none');
        //$('#successmsg').html();
        //$('#successmsg').css('display', 'none');
    }
    else if (messageType == "ERROR") {
        fnMsgAlert('error', 'SFC - Region Based', Msg);
        //$('#warningmessage').html('');
        //$('#warningmessage').css('display', 'none')
        //$('#errormsg').html(Msg);
        //$('#errormsg').css('display', '');
        //$('#successmsg').html('');
        //$('#successmsg').css('display', 'none');
    }
    else {
        $('#warningmessage').html('');
        $('#warningmessage').css('display', 'none')
        $('#errormsg').html();
        $('#errormsg').css('display', 'none');
        $('#successmsg').html('');
        $('#successmsg').css('display', 'none');
    }
}

function fnGoToPrevPage() {
    var pno = parseInt($('#pageno').html()) - 1;
    fnGetSFCRegions(pno);
}
function fnGoToNextPage() {
    var pno = parseInt($('#pageno').html()) + 1;
    fnGetSFCRegions(pno);
}
function fnGoToPage() {
    var pno = $('#drpPaging :selected').val();
    fnGetSFCRegions(pno);
}

function fnGetFareAmount() {
    if ($.trim($('#txtDistance').val()).length > 0) {
        if (!WHOLENUMBERREGEX_g.test($('#txtDistance').val())) {
            fnShowMessage('WARNING', "Please enter the valid Distance.<br />");
            return;
        }
        else {
            fnShowMessage('', "");
        }

        $('#spnamountloading').css('display', '');
        var distance = $.trim($('#txtDistance').val());
        var userTypeCode = '';
        if (userPrivilege_g != null && userPrivilege_g.length > 0) {
            var userTypeCode = userPrivilege_g[0].UsertypeCode;
        }
        var entity = $.trim($('#drpCategory :selected').text());
        if (distance.length > 0 && userTypeCode.length > 0 && entity.length > 0) {
            $.ajax({
                type: 'POST',
                async: false,
                url: '../HiDoctor_Master/SFCRegion/GetFareAmount',
                data: "distance=" + distance + "&userTypeCode=" + userTypeCode + "&entity=" + entity,
                success: function (response) {
                    $('#txtAmount').val(response);
                    $('#spnamountloading').css('display', '');
                },
                error: function (e) {
                    $('#spnamountloading').css('display', '');
                    fnShowMessage('ERROR', e.responseText);
                }
            });
        }
    }
}


function fnAmountCalc() {
    var SFC_TO_REFER_DFC = fnGetPrivilegeVal('SFC_TO_REFER_DFC', '');
    if (SFC_TO_REFER_DFC == "YES") {
        fnGetFareAmount();
    }
}

function fnBindSFCDetailsToForm(rowNo) {
    fnShowMessage('', "");
    fnHighlighttheRow(rowNo);
    $('#hdnBindRowNo').val(rowNo);
    $('#hdnSFCCode').val($('#spnDFCCode_' + rowNo).html());
    $('#hdnSFCVersionNo').val($('#spnSFCVersion_' + rowNo).html());
    $('#txtfrmplace').val($('#spnFromPlace_' + rowNo).html());
    $('#txttoplace').val($('#spnToRegionName_' + rowNo).html());
    $("#drpCategory").val($('#spnCategory_' + rowNo).html());
    $('#txtDistance').val($('#spnDistance_' + rowNo).html());
    $('#txtAmount').val($('#spnFareAmount_' + rowNo).html());
    if ($.trim($('#spnTravelMode_' + rowNo).html()).length > 0) {
        $("#drpTravelMode").val($('#spnTravelMode_' + rowNo).html().toUpperCase())
    }
    else {
        $("#drpTravelMode").val($('#drpTravelMode option')[0].innerHTML)
    }
    $('#txtDateFrom').val($('#spnDateFrom_' + rowNo).html());
    $('#txtDateTo').val($('#spnDateTo_' + rowNo).html());
    $('#txtSFCVisitCount').val($('#spnSFCVisitCount_' + rowNo).html());
    $('#txtSFCMinVisitCount').val($('#spnSFCMinVisitCount_' + rowNo).html());
    $('#txtfrmplace').focus();
    $('#dataDiv').tabs('option', 'selected', 0);

}

function fnHighlighttheRow(rowNo) {
    $('#tblSFCRegions tr').removeClass('highlight');
    $('#row_' + rowNo).addClass('highlight');
}

function fnCancel() {
    var rowNo = $('#hdnBindRowNo').val();
    if (rowNo != null && rowNo.length > 0) {
        fnBindSFCDetailsToForm(rowNo)
    }
}

function fnClear() {
    $('#hdnBindRowNo').val('');
    $('#hdnSFCCode').val('');
    $('#hdnSFCVersionNo').val('');
    $('#txtfrmplace').val('');
    $('#txttoplace').val('');
    $('#drpCategory').val($('#drpCategory option')[0].innerHTML);
    $('#txtDistance').val('');
    $('#txtAmount').val('');
    //  $('#drpTravelMode').val($('#drpTravelMode option')[0].innerHTML);
    $('input[name = chkSelectUsers]').removeAttr('checked');
    $('#txtDateFrom').val(sfcFromdate);
    $('#txtDateTo').val(sfcTodate);
    $('#txtDateTo').val("31/12/2099");
    $('#txtSFCVisitCount').val('0');
    $('#txtSFCMinVisitCount').val('0');
}



function fnSFCUnapprove(status) {
    sfcdata_g = "";
    var codes = fnCheckedRows();
    var regionCodes = fnCheckedRegions();
    if (codes.length > 0) {

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/Approval/SFCBulkUnapproval',
            data: "regionCode=" + regionCodes + "&dfcCode=" + codes + "&mode=" + status,
            success: function (response) {
                if (response.toUpperCase() == "UNAPPROVED") {
                    fnGetSFCRegions(1);
                    $('#lblmessage').html("SFC Unapproved successfully.");
                }
                else {
                    sfcdata_g = response;
                    $('#lblmessage').html("Since the selected SFC is used in CP/TP/DCR, you are not able to unapprove the selected SFC. <a href='#' onclick='showDetailsTable();'>Click here</a> to see more details");
                }
            },
            error: function (e) {
                $('#lblmessage').html("");
                fnShowMessage("ERROR", e.responseText);
            }
        });
    }
}

function fnSFCApprove() {
    var codes = fnCheckedRows();
    var status = "APPROVE";
    //var regionCode = $("#hdnRegionCode").val();
    var regionCodes = fnCheckedRegions();
    if (codes.length > 0) {
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/Approval/SFCBulkApproval',
            data: "regionCode=" + regionCodes + "&dfcCode=" + codes + "&mode=" + status,
            success: function (response) {
                if (response.toUpperCase() == "APPROVED") {
                    $('#lblmessage').html("SFC Approved Successfully.");
                    fnGetSFCRegions(1, true);
                }
            },
            error: function (e) {
                $('#lblmessage').html("");
                fnShowMessage("ERROR", e.responseText);
            }
        });
    }
}

function showDetailsTable() {
    ShowModalPopup("dvloading");
    $("#divModel").html(sfcdata_g);
    $("#dvOverlay").overlay().load();
    HideModalPopup("dvloading");
}


function fnCheckOrUncheckHeaderRow() {
    var allCheckBoxChecked = true;
    $.each($('.table tbody tr  input'), function (index, value) {
        if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == null) {
            $('#hdrCheckBox').attr('checked', false)
            allCheckBoxChecked = false;
            return false;
        }

    });
    if (allCheckBoxChecked) {
        $('#hdrCheckBox').attr('checked', true);
    }
}

function fnCheckOrUncheckRowsCheckbox() {
    if ($('#hdrCheckBox').attr('checked') == 'checked') {
        $.each($('.table tbody tr  input'), function (index, value) {
            ($('#rowcheckbox_' + (index + 1)).attr('checked', 'checked'))
        });
    }
    else {
        $.each($('.table tbody tr  input'), function (index, value) {
            ($('#rowcheckbox_' + (index + 1)).attr('checked', false))
        });

    }
}

function fnCheckedRows() {
    var fareCodes = "";
    $.each($('.table tbody tr  input'), function (index, value) {
        if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == "checked") {
            fareCodes += $('#spnDFCCode_' + (index + 1)).html() + "_" + $('#spnSFCVersion_' + (index + 1)).html() + "^";
        }
    });
    return fareCodes;
}

function fnCheckedRegions() {
    var regionCodes = "";
    $.each($('.table tbody tr  input'), function (index, value) {
        if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == "checked") {
            regionCodes += $('#spnRegionCode_' + (index + 1)).html() + "^";
        }
    });
    return regionCodes;
}

function fnDateValidation() {
    if ($('#txtDateFrom').val().length > 0 && $('#txtDateTo').val().length > 0) {
        var date1 = $('#txtDateFrom').val().split('/')[1] + '/' + $('#txtDateFrom').val().split('/')[0] + '/' + $('#txtDateFrom').val().split('/')[2]
        var date2 = $('#txtDateTo').val().split('/')[1] + '/' + $('#txtDateTo').val().split('/')[0] + '/' + $('#txtDateTo').val().split('/')[2]
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        if ((d2 - d1) < 0) {
            return false;
        }
        return true;
    }
    return true;
}

function fnDateFormatValidation(dateval) {
    if (dateval.length > 0) {
        if (new Date(dateval) == "Invalid Date") {
            return false;
        }
    }
    return true;
}

function fnAddSFCVersion(rowno) {


    var DFCCode = $('#spnDFCCode_' + rowno).html();
    var regionCode = $('#spnRegionCode_' + rowno).html();
    $('#divAddSFCVesrionContent').html('');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SFCRegion/GetSelectedSFC',
        data: "regionCode=" + regionCode + "&SFCCode=" + DFCCode,
        success: function (response) {
            fnBuildTableForAddSFCVesrion(response, regionCode);
        },
        error: function (e) {
            $('#lblmessage').html("");
            fnShowMessage("ERROR", e.responseText);
        }
    });
}

function fnEditSFCSet(rowno) {
    var DFCCode = $('#spnDFCCode_' + rowno).html();
    var regionCode = $('#spnRegionCode_' + rowno).html();
    $('#divAddSFCVesrionContent').html('');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SFCRegion/GetSelectedSFC',
        data: "regionCode=" + regionCode + "&SFCCode=" + DFCCode,
        success: function (response) {
            fnBuildTableForEditSFC(response, regionCode);
        },
        error: function (e) {
            $('#lblmessage').html("");
            fnShowMessage("ERROR", e.responseText);
        }
    });
}

function fnBuildTableForEditSFC(SFCRows, regionCode) {
    debugger;
    if (SFCRows != null && SFCRows.length > 0) {
        var SFC_EDIT_GRID = "";
        var EDIT_TABLE = "";
        for (var s = 0; s < SFCRows.length; s++) {
            EDIT_TABLE = '';
            EDIT_TABLE = s == 0 ? SFC_TABLE_EDIT_HEADER_STRING + SFC_EDIT_GRID_STRING.replace(/SNUG/g, (s + 1)) :
                SFC_EDIT_GRID_STRING.replace(/SNUG/g, (s + 1));
            EDIT_TABLE = s == (SFCRows.length - 1) ? EDIT_TABLE + SFC_EDIT_TABLE_END_STRING : EDIT_TABLE;

            SFC_EDIT_GRID += EDIT_TABLE;
        }
        $('#divEditSFCContent').html(SFC_EDIT_GRID);
        $('.dateSFCED').datepicker({
            dateFormat: 'dd/mm/yy',
        });
        for (var c = 0; c < cate_g.length; c++) {
            $('.clscate').append("<option value='" + cate_g[c].text + "'>" + cate_g[c].text + "</option>");
        }

        for (var t = 0; t < travelModeArr.length; t++) {
            $('.clstm').append("<option value='" + travelModeArr[t].value + "'>" + travelModeArr[t].label + "</option>");
        }
        for (var k = 0; k < SFCRows.length; k++) {
            var rn = k + 1;
            var sfc = SFCRows[k];
            $('#SPNDFC_' + rn).html(sfc.Distance_Fare_Code);
            $('#SPNSFCV_' + rn).html(sfc.SFC_Version_No);
            $('#TXTFP_' + rn).val(sfc.From_Region_Name);
            $('#SPNFP_' + rn).html(sfc.From_Region_Name);
            $('#SPNRC_' + rn).html(regionCode);
            $('#TXTTP_' + rn).val(sfc.To_Region_Name);
            $('#SPNTP_' + rn).html(sfc.To_Region_Name);

            $('#SELCAT_' + rn).val(sfc.Category_Name);
            $('#SPNCAT_' + rn).html(sfc.Category_Name);

            $('#TXTAMT_' + rn).val(sfc.Fare_Amount);
            $('#SPNAMT_' + rn).html(sfc.Fare_Amount);

            $('#TXTDIS_' + rn).val(sfc.Distance);
            $('#SPNDIS_' + rn).html(sfc.Distance);

            $('#SELTM_' + rn).val(sfc.Travel_Mode);
            $('#SPNTM_' + rn).html(sfc.Travel_Mode);

            $('#TXTDF_' + rn).val(sfc.Date_From);
            $('#SPNDF_' + rn).html(sfc.Date_From);

            $('#TXTDT_' + rn).val(sfc.Date_To);
            $('#SPNDT_' + rn).html(sfc.Date_To);

            $('#TXTSFCMinVC_' + rn).val(sfc.Minimum_Count);
            $('#SPNSFCMinVC_' + rn).html(sfc.Minimum_Count);

            var sfcMaxCount = 0;
            if (sfc.SFC_Visit_Count != "" && isNaN(parseInt(sfc.SFC_Visit_Count)) == false)
            {
                sfcMaxCount = parseInt(sfc.SFC_Visit_Count);
            }
            $('#TXTSFCVC_' + rn).val(sfcMaxCount);
            $('#SPNSFCVC_' + rn).html(sfcMaxCount);
            var day = sfc.Date_To.split("/")[0];
            var month = sfc.Date_To.split("/")[1];
            var year = sfc.Date_To.split("/")[2];
            var DateTo = new Date(month + "/" + day + "/" + year);
            day = sfc.Date_From.split("/")[0];
            month = sfc.Date_From.split("/")[1];
            year = sfc.Date_From.split("/")[2];
            var DateFrom = new Date(month + "/" + day + "/" + year);
            var cDay = new Date().getDate();
            var cMonth = new Date().getMonth() + 1;
            var cYear = new Date().getFullYear();
            var CDate = new Date(cMonth + "/" + cDay + "/" + cYear);
            // allowing to edit only current record. disabling remaining.
            if ((rn < SFCRows.length && DateTo < CDate)) {
                $('#TXTFP_' + rn).prop("disabled", true);
                $('#TXTTP_' + rn).prop("disabled", true);
                $('#SELCAT_' + rn).prop("disabled", true);
                $('#TXTAMT_' + rn).prop("disabled", true);
                $('#TXTDIS_' + rn).prop("disabled", true);
                $('#SELTM_' + rn).prop("disabled", true);
                $('#TXTDF_' + rn).prop("disabled", true);
                $('#TXTDT_' + rn).prop("disabled", true);
                $('#TXTSFCMinVC_' + rn).prop("disabled", true);
                $('#TXTSFCVC_' + rn).prop("disabled", true);
            }
        }

        $('#dvEditSFC').overlay().load();
        $('#dvEditSFC').css("left", "12%");
    }
}


var r = "";
var SFC_VERSION_TABLE = "";
function fnBuildTableForAddSFCVesrion(SFCobject, regionCode) {
    debugger;
    SFC_VERSION_TABLE = '';
    var TABLE_STRING = '';
    if (SFCobject != null && SFCobject.length > 0) {
        for (var i = 0; i < SFCobject.length; i++) {
            TABLE_STRING = '';
            TABLE_STRING = i == 0 ? SFC_TABLE_HEADER_STRING + SFC_ADD_VERSION_ROW_STRING.replace(/SNUG/g, (i + 1)) :
                SFC_ADD_VERSION_ROW_STRING.replace(/SNUG/g, (i + 1));
            TABLE_STRING = i == (SFCobject.length - 1) ? TABLE_STRING + SFC_ADD_VERSION_END_STRING : TABLE_STRING;

            SFC_VERSION_TABLE += TABLE_STRING;
        }
        $('#divAddSFCVesrionContent').html(SFC_VERSION_TABLE);
        //var newVersion = 0;
        var sfc;
        for (var j = 0; j < SFCobject.length; j++) {
            var rowno = j + 1;
            sfc = SFCobject[j];
            sfc.Status = sfc.Status.toUpperCase() == "APPROVED" ? "1" : sfc.Status.toUpperCase() == "APPLIED" ? "2" : "0";
            $('#DFC_' + rowno).html(sfc.Distance_Fare_Code + "-" + sfc.Status);
            $('#SFCV_' + rowno).html(sfc.SFC_Version_No);
            //newVersion = sfc.SFC_Version_No + 1;
            $('#FP_' + rowno).html(sfc.From_Region_Name);
            $('#TP_' + rowno).html(sfc.To_Region_Name);
            $('#CAT_' + rowno).html(sfc.Category_Name);
            $('#AMT_' + rowno).html(sfc.Fare_Amount);
            $('#DIS_' + rowno).html(sfc.Distance);
            $('#SPNARC_' + rowno).html(regionCode);
            $('#TM_' + rowno).html(sfc.Travel_Mode);
            $('#DF_' + rowno).html(sfc.Date_From);
            $('#DT_' + rowno).html(sfc.Date_To);
            $('#SPNADT_' + rowno).html(sfc.Date_To);
            $('#SFCMinVC_' + rowno).html(sfc.Minimum_Count);
            var sfcMaxCount = 0;
            if (sfc.SFC_Visit_Count != "" && isNaN(parseInt(sfc.SFC_Visit_Count)) == false) {
                sfcMaxCount = parseInt(sfc.SFC_Visit_Count);
            }
            $('#SFCVC_' + rowno).html(sfcMaxCount);
        }

        var newRowId = SFCobject.length + 1;
        var newListRow = document.getElementById('tblSFCVersion').insertRow(parseInt(newRowId))
        var lastRowIndex = SFCobject.length - 1;
        var newVersion = parseInt(SFCobject[lastRowIndex].SFC_Version_No) + 1;
        var Edit_TABLE_STRING = SFC_ADD_VERSION_EDIT_ROW_STRING.replace(/SNUG/g, newRowId);
        $(newListRow).html(Edit_TABLE_STRING);

        $('#SPNADFC_' + newRowId).html(sfc.Distance_Fare_Code);
        $('#SPNASFCV_' + newRowId).html("-1");
        $('#FP_' + newRowId).html(sfc.From_Region_Name);
        $('#TP_' + newRowId).html(sfc.To_Region_Name);
        $('#CAT_' + newRowId).html(sfc.Category_Name);
        //$('#TXTAMT_' + newRowId).html(sfc.Fare_Amount);
        //$('#TXTDIS_' + newRowId).html(sfc.Distance);
        $('#TM_' + newRowId).html(sfc.Travel_Mode);
        $('#SPNARC_' + newRowId).html(regionCode);
        //$('#TXTDF_' + newRowId).html(sfc.Date_From);
        //$('#TXTDT_' + newRowId).html(sfc.Date_To);
        //$('#TXTSFCMinVC_' + newRowId).html(sfc.Minimum_Count);
        //$('#TXTSFCVC_' + newRowId).html(sfc.SFC_Visit_Count);
        var DateFrom = sfc.Date_From.split("/")
        DateFrom = new Date(DateFrom[2] + "-" + DateFrom[1] + "-" + DateFrom[0]);
        DateFrom.setDate(DateFrom.getDate() + 1);
        $('.dateSFC').datepicker({
            dateFormat: 'dd/mm/yy',
            minDate: DateFrom,
        });

    }
    $("#dvAddSFCVersion").overlay().load();
}


function fnSetDateToPreviousVersion(rowno) {
    debugger;
    var ch = rowno - 1;
    var dateString = $('#TXTDF_' + rowno).val();
    var dateObj = new Date(dateString.split('/')[2], (parseInt(dateString.split('/')[1]) - 1), dateString.split('/')[0]);

    // get previous version date to check if expired or not.
    var previousToDate = $('#SPNADT_' + ch).html(); // previous rows date value. should not take value from label which often changes by n-1 date value.
    var prevDateObj = new Date(previousToDate.split('/')[2], (parseInt(previousToDate.split('/')[1]) - 1), previousToDate.split('/')[0]);
    var previousFromDate = $("#DF_" + ch).html();
    var prevFDateObj = new Date(previousFromDate.split('/')[2], (parseInt(previousFromDate.split('/')[1]) - 1), previousFromDate.split('/')[0]);

    var CurrentDate = new Date();

    // date of previous row with n + 1 
    var date = new Date(dateObj.setDate(dateObj.getDate() - 1));
    var updateDate = new Date(date);
    var chDate = updateDate.getDate().toString().length == 1 ? "0" + updateDate.getDate().toString() : updateDate.getDate();
    var chMonth = (updateDate.getMonth() + 1).toString().length == 1 ? "0" + (updateDate.getMonth() + 1).toString() : (updateDate.getMonth() + 1).toString();
    var chYear = updateDate.getFullYear();
    var updDateObj = new Date(chYear + '/' + chMonth + '/' + chDate);
    var updateDataString = chDate + '/' + chMonth + '/' + chYear;

    // conidtion to check if Auto Changing To Date Value is less than or equal to Date From .
    if (prevFDateObj > updDateObj) {
        fnMsgAlert('error', 'SFC Master', "Invalid Date due to To_Date of Row " + ch.toString() + " goes less than From_Date. ");
        $('#TXTDF_' + rowno).val("");
    }
    else {
        if (dateObj <= prevDateObj ) { // if previous version is not expired. allow to change the to date with N-1 date.
            $('#DT_' + ch).html(updateDataString);
        }
    }
    //else if (updDateObj >= CurrentDate)
    //{
    //    $('#DT_' + ch).html(updateDataString);
    //}

}

function fnSaveSFCVersionValidation(rowNo) {
    var ermsg = '';
    if ($.trim($('#TXTDIS_' + rowNo).val()).length == 0) {
        ermsg += "Please enter the Distance.<br />"
    }
    else {
        if (!WHOLENUMBERREGEX_g.test($('#TXTDIS_' + rowNo).val())) {
            ermsg += "Please enter the valid Distance.<br />"
        }
    }

    if ($.trim($('#TXTAMT_' + rowNo).val()).length > 0) {
        if (isNaN($.trim($('#TXTAMT_' + rowNo).val()))) {
            ermsg += "Please enter the valid Amount.<br />"
        }
        else {
            if (parseFloat($.trim($('#TXTAMT_' + rowNo).val())) < 0) {
                ermsg += "Please enter the valid Amount.<br />"
            }
        }
    }

    if ($.trim($('#TXTSFCMinVC_' + rowNo).val()).length > 0) {
        if (!WHOLENUMBERREGEX_g.test($('#TXTSFCMinVC_' + rowNo).val())) {
            ermsg += "Please enter the valid SFC Minimum Count.<br />";
        }
    }
    else {
        $('#TXTSFCMinVC_' + rowNo).val('0');
    }

    if ($.trim($('#TXTSFCVC_' + rowNo).val()).length > 0) {
        if (!WHOLENUMBERREGEX_g.test($('#TXTSFCVC_' + rowNo).val())) {
            ermsg += "Please enter the valid SFC maximum Count.<br />";
        }
    }
    else {
        $('#TXTSFCVC_' + rowNo).val('0');
    }
    if ($('#TXTDF_' + rowNo).val().length > 0) {
        var date1 = $('#TXTDF_' + rowNo).val().split('/')[1] + '/' + $('#TXTDF_' + rowNo).val().split('/')[0] + '/' + $('#TXTDF_' + rowNo).val().split('/')[2];
        if (!fnDateFormatValidation(date1)) {
            ermsg += "Please enter the correct date format in Date From.<br />";
        }
    }
    else {
        ermsg += "Please enter the Date From.<br />";
    }

    if ($('#TXTDT_' + rowNo).val().length > 0) {
        var date2 = $('#TXTDT_' + rowNo).val().split('/')[1] + '/' + $('#TXTDT_' + rowNo).val().split('/')[0] + '/' + $('#TXTDT_' + rowNo).val().split('/')[2];
        if (!fnDateFormatValidation(date2)) {
            ermsg += "Please enter the correct date format in Date To.<br />";
        }
    }
    else {
        ermsg += "Please enter the Date To.<br />";
    }


    if ($('#TXTDT_' + rowNo).val().length > 0 && $('#TXTDF_' + rowNo).val().length > 0) {
        var dateFrom = $.trim($('#TXTDF_' + rowNo).val());
        var dateTo = $.trim($('#TXTDT_' + rowNo).val());
        var date1 = dateFrom.split('/')[1] + '/' + dateFrom.split('/')[0] + '/' + dateFrom.split('/')[2]
        var date2 = dateTo.split('/')[1] + '/' + dateTo.split('/')[0] + '/' + dateTo.split('/')[2]
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        if ((d2 - d1) < 0) {
            ermsg += "Date from should not be greater than Date to.<br />";
        }

        if (!fnDateRangeValidation($.trim($('#TXTDF_' + (rowNo)).val()))) {
            ermsg += "Invalid Day, Month, or Year range detected in Date From to row number " + rowNo + ".<br />";
        }

        if (!fnDateRangeValidation($.trim($('#TXTDT_' + (rowNo)).val()))) {
            ermsg += "Invalid Day, Month, or Year range detected in Date to to row number " + rowNo + ".<br />";
        }

    }

    if ($('#DT_' + (rowNo - 1)).html().length > 0 && $('#DF_' + (rowNo - 1)).html().length > 0) {
        var dateFrom = $.trim($('#DF_' + (rowNo - 1)).html());
        var dateTo = $.trim($('#DT_' + (rowNo - 1)).html());
        var date1 = dateFrom.split('/')[1] + '/' + dateFrom.split('/')[0] + '/' + dateFrom.split('/')[2]
        var date2 = dateTo.split('/')[1] + '/' + dateTo.split('/')[0] + '/' + dateTo.split('/')[2]
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        if ((d2 - d1) < 0) {
            ermsg += "Date from should not be greater than Date to row number " + (rowNo - 1) + ".<br />";
        }
        if (!fnDateRangeValidation($.trim($('#DF_' + (rowNo - 1)).html()))) {
            ermsg += "Invalid Day, Month, or Year range detected in Date From to row number " + (row - 1) + ".<br />";
        }

        if (!fnDateRangeValidation($.trim($('#DT_' + (rowNo - 1)).html()))) {
            errmsg += "Invalid Day, Month, or Year range detected in Date to to row number " + (row - 1) + ".<br />";
        }
    }



    // validate from place.
    if (ermsg.length > 0) {
        fnMsgAlert('info', 'SFC Master', ermsg);
        //fnShowMessage("WARNING", ermsg);
        return false;
    }
    else {
        //fnShowMessage('', '');
    }
    return true;
}


function fnSaveSFCVersion() {
    var saveType = "Version";
    try {
        var SFCArray = new Array();
        $('#dvSFC').block({
            message: 'Save the SFC Details, Please wait',
            css: { border: '1px solid #ddd' }
        });

        // subtract the header row.
        var rowno = $('#tblSFCVersion tr').length - 1;
        if (fnSaveSFCVersionValidation(rowno)) {
            for (var j = 0; j < (rowno - 1) ; j++) {
                var a = j + 1;
                var sd = fnGetPreviousRowVals(a)
                SFCArray.push(sd);
            }
            var SFCNewVersionRow = fnGetInsertRow(rowno);
            SFCArray.push(SFCNewVersionRow);
            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Master/SFCRegion/SaveSFCMaster',
                data: "SFCJson=" + JSON.stringify(SFCArray) + "&SaveType=" + saveType,
                success: function (response) {
                    debugger;
                    $('#dvSFC').unblock();
                    if (response != null && typeof response == "string" && response != "0") {
                        debugger;
                        fnMsgAlert('info', 'SFC Master', response);
                    }
                    if ((response["Message"] != "") && (response["Message"] != undefined)) {
                        if (response["Message"] != "0") {
                            fnMsgAlert('info', 'SFC Master', response["Message"]);
                        }
                        else {
                            fnMsgAlert('success', 'SFC Master', 'Saved successfully.');
                            fnGetSFCRegions('1', true);
                            $('#dvAddSFCVersion').overlay().close();

                        }
                    }
                    else {
                        debugger;
                        fnMsgAlert('success', 'SFC Master', 'Saved successfully.');
                        fnGetSFCRegions('1', true);
                        $('#dvAddSFCVersion').overlay().close();

                    }
                },
                error: function (e) {
                    $('#dvSFC').unblock();
                    fnMsgAlert('ERROR', 'SFC Master', e.responseText);
                }
            });
        }
        else {
            $('#dvSFC').unblock();
        }
    }
    catch (err) {
        $('#dvSFC').unblock();
        fnMsgAlert('info', 'SFC Master', err.message)
    }
}

function fnGetPreviousRowVals(ri) {
    debugger;
    var SFC = {};
    var sfc_approval_req = fnGetPrivilegeVal('SFC_APPROVAL_REQUIRED', 'YES');
    // var status = sfc_approval_req.toUpperCase() == "NO" ? "1" : "2";
    SFC.Distance_Fare_Code = $.trim($('#DFC_' + ri).html().split('-')[0]);
    SFC.Region_Code = $('#SPNARC_' + ri).html()
    SFC.SFC_Version_No = $('#SFCV_' + ri).html();
    SFC.From_Region_Name = $.trim($('#FP_' + ri).html());
    SFC.To_Region_Name = $.trim($('#TP_' + ri).html());
    SFC.Category_Name = $('#CAT_' + ri).html();
    SFC.Distance = $('#DIS_' + ri).html();
    SFC.Fare_Amount = $('#AMT_' + ri).html();
    var rowno = $('#tblSFCVersion tr').length - 1;
    if ((rowno - 1) == ri) {
        if ($.trim($('#SFCV_' + ri).html()) == "") {
            SFC.Action = "INSERT";
        }
        else {
            SFC.Action = "EDIT";
        }
    }
    else {
        SFC.Action = "NO";
    }

    if ($('#DF_' + ri).html().length > 0) {
        var df = $.trim($('#DF_' + ri).html());
        SFC.Date_From = df.split('/')[1] + '/' + df.split('/')[0] + '/' + df.split('/')[2];
    }
    else {
        SFC.Date_From = null;
    }
    if ($.trim($('#DT_' + ri).html()).length > 0) {
        var dt = $.trim($('#DT_' + ri).html());
        SFC.Date_To = dt.split('/')[1] + '/' + dt.split('/')[0] + '/' + dt.split('/')[2];
    }
    else {
        SFC.Date_To = null;
    }
    SFC.Status = $.trim($('#DFC_' + ri).html().split('-')[1]);
    SFC.Travel_Mode = $.trim($('#TM_' + ri).html());
    SFC.Minimum_Count = $.trim($('#SFCMinVC_' + ri).html());
    SFC.SFC_Visit_Count = $.trim($('#SFCVC_' + ri).html());

    return SFC;
}

function fnGetInsertRow(ri) {
    debugger;
    var SFC = {};
    var sfc_approval_req = fnGetPrivilegeVal('SFC_APPROVAL_REQUIRED', 'YES');
    var status = sfc_approval_req.toUpperCase() == "NO" ? "1" : "2";
    SFC.Distance_Fare_Code = $.trim($('#SPNADFC_' + ri).html());
    SFC.Region_Code = $('#SPNARC_' + ri).html();
    SFC.SFC_Version_No = $('#SPNASFCV_' + ri).html();
    SFC.From_Region_Name = $.trim($('#FP_' + ri).html());
    SFC.To_Region_Name = $.trim($('#TP_' + ri).html());
    SFC.Category_Name = $('#CAT_' + ri).html();
    SFC.Distance = $.trim($('#TXTDIS_' + ri).val());
    SFC.Fare_Amount = $.trim($('#TXTAMT_' + ri).val()).length == 0 ? "0" : $.trim($('#TXTAMT_' + ri).val());
    if ($.trim($('#SFCV_' + ri).html()) == "") {
        SFC.Action = "INSERT";
    }
    else {
        SFC.Action = "EDIT";
    }

    if ($.trim($('#TXTDF_' + ri).val()).length > 0) {
        var df = $.trim($('#TXTDF_' + ri).val());
        SFC.Date_From = df.split('/')[1] + '/' + df.split('/')[0] + '/' + df.split('/')[2];
    }
    else {
        SFC.Date_From = null;
    }
    if ($.trim($('#TXTDT_' + ri).val()).length > 0) {
        var dt = $.trim($('#TXTDT_' + ri).val());
        SFC.Date_To = dt.split('/')[1] + '/' + dt.split('/')[0] + '/' + dt.split('/')[2];
    }
    else {
        SFC.Date_To = null;
    }
    SFC.Status = status;
    SFC.Travel_Mode = $.trim($('#TM_' + ri).html());
    SFC.Minimum_Count = $.trim($('#TXTSFCMinVC_' + ri).val());
    SFC.SFC_Visit_Count = $.trim($('#TXTSFCVC_' + ri).val());

    return SFC;
}

function fnSetCombinationValue(obj, rowno) {
    return;
    // do not change value for expired.
    //var tablerows = $('#tblSFCEdit tr').length - 1;
    //if (obj == 1) {
    //    //for (var i = 0; i < tablerows; i++) {
    //        var sno = i + 1;
    //        if ($('#SPNFP_' + rowno).html().toUpperCase() != $('#TXTFP_' + rowno).val().toUpperCase()) {
    //            if (rowno == sno) {
    //                //continue;
    //            }
    //            $('#TXTFP_' + sno).val($('#TXTFP_' + rowno).val());
    //            $('#TXTFP_' + sno).css("backgroundColor", '#d0d0d0');
    //        }
    //        else {
    //            $('#TXTFP_' + sno).val($('#TXTFP_' + rowno).val())
    //            $('#TXTFP_' + sno).css("backgroundColor", '');
    //        }
    //    //}

    //}
    //else if (obj == 2) {

    //    //for (var i = 0; i < tablerows; i++) {
    //        var sno = i + 1;
    //        if ($('#SPNTP_' + rowno).html().toUpperCase() != $('#TXTTP_' + rowno).val().toUpperCase()) {
    //            if (rowno == sno) {
    //                //continue;
    //            }
    //            $('#TXTTP_' + sno).val($('#TXTTP_' + rowno).val())
    //            $('#TXTTP_' + sno).css("backgroundColor", "#d0d0d0");
    //        }
    //        else {
    //            $('#TXTTP_' + sno).val($('#TXTTP_' + rowno).val())
    //            $('#TXTTP_' + sno).css("backgroundColor", "");
    //        }
    //    //}
    //}
    //else if (obj == 3) {

    //    //for (var i = 0; i < tablerows; i++) {
    //        var sno = i + 1;
    //        if ($('#SPNCAT_' + rowno).html().toUpperCase() != $('#SELCAT_' + rowno).val().toUpperCase()) {
    //            if (rowno == sno) {
    //                //continue;
    //            }
    //            $('#SELCAT_' + sno).val($('#SELCAT_' + rowno).val());
    //            $('#SELCAT_' + sno).css('backgroundColor', '#d0d0d0');
    //        }
    //        else {
    //            $('#SELCAT_' + sno).val($('#SELCAT_' + rowno).val());
    //            $('#SELCAT_' + sno).css('backgroundColor', '');
    //        }
    //    //}
    //}
    //else if (obj == 4) {

    //    //for (var i = 0; i < tablerows; i++) {
    //        var sno = i + 1;
    //        if ($('#SPNTM_' + rowno).html().toUpperCase() != $('#SELTM_' + rowno).val().toUpperCase()) {
    //            if (rowno == sno) {
    //                //continue;
    //            }
    //            $('#SELTM_' + sno).val($('#SELTM_' + rowno).val())
    //            $('#SELTM_' + sno).css('backgroundColor', "#d0d0d0");
    //        }
    //        else {
    //            $('#SELTM_' + sno).val($('#SELTM_' + rowno).val())
    //            $('#SELTM_' + sno).css('backgroundColor', "");
    //        }
    //    //}
    //}
}
function fnDateToEdit(r) {
    var tablerows = $('#tblSFCEdit tr').length - 1;
    if (tablerows != r) {
        var ch = r + 1;
        var dateString = $('#TXTDT_' + r).val();
        var dateObj = new Date(dateString.split('/')[2], (parseInt(dateString.split('/')[1]) - 1), dateString.split('/')[0]);

        var date = new Date(dateObj.setDate(dateObj.getDate() + 1));
        var updateDate = new Date(date);
        var chdate = updateDate.getDate().toString().length == 1 ? "0" + updateDate.getDate().toString() : updateDate.getDate();
        var chmonth = (updateDate.getMonth() + 1).toString().length == 1 ? "0" + (updateDate.getMonth() + 1).toString() : (updateDate.getMonth() + 1).toString();
        var updateDataString = chdate + '/' + chmonth + '/' + updateDate.getFullYear();
        $('#TXTDF_' + ch).val(updateDataString);
        if ($('#SPNDF_' + ch).html() == $('#TXTDF_' + ch).val()) {
            $('#TXTDF_' + ch).css('backgroundColor', '');
        }
        else {
            $('#TXTDF_' + ch).css('backgroundColor', '#d0d0d0')
        }
    }
}
function fnDateFromEdit(r) {
    debugger;
    var tablerows = $('#tblSFCEdit tr').length - 1;
    if (r != 1) {
        var ch = r - 1;
        var dateString = $('#TXTDF_' + r).val();
        var dateObj = new Date(dateString.split('/')[2], (parseInt(dateString.split('/')[1]) - 1), dateString.split('/')[0]);

        var previousToDate = $('#SPNDT_' + ch).html();
        var prevDateObj = new Date(previousToDate.split('/')[2], (parseInt(previousToDate.split('/')[1]) - 1), previousToDate.split('/')[0]);
        var CurrentDate = new Date();

        var date = new Date(dateObj.setDate(dateObj.getDate() - 1));
        var updateDate = new Date(date);
        var chdate = updateDate.getDate().toString().length == 1 ? "0" + updateDate.getDate().toString() : updateDate.getDate();
        var chmonth = (updateDate.getMonth() + 1).toString().length == 1 ? "0" + (updateDate.getMonth() + 1).toString() : (updateDate.getMonth() + 1).toString();

        var updateDataString = chdate + '/' + chmonth + '/' + updateDate.getFullYear();

        if (prevDateObj >= CurrentDate) {
            $('#TXTDT_' + ch).val(updateDataString);
        }
        else if (updateDate < prevDateObj) {
            fnMsgAlert("info", "SFC Master", "Invalid date due to Date_From Overlaps with Previous Row's Date.");
            $('#TXTDF_' + r).val("");
        }

        if ($('#SPNDT_' + ch).html() == $('#TXTDT_' + ch).val()) {
            $('#TXTDT_' + ch).css('backgroundColor', '');
        }
        else {
            $('#TXTDT_' + ch).css('backgroundColor', '#d0d0d0')
        }

    }
}

function fnValidateSFCEdit() {
    var SFCEditRows = $('#tblSFCEdit tr');
    var ermsg = "";
    for (var i = 0; i < (SFCEditRows.length - 1) ; i++) {
        var ri = i + 1;
        var fromPlace = $.trim($('#TXTFP_' + ri).val());
        var toplace = $.trim($('#TXTTP_' + ri).val());
        var cat = $.trim($('#SELCAT_' + ri + ' :selected').text())
        var tm = $.trim($('#SELTM_' + ri + ' :selected').text())
        var dis = $.trim($('#TXTDIS_' + ri).val());
        var amt = $.trim($('#TXTAMT_' + ri).val());
        var df = $.trim($('#TXTDF_' + ri).val());
        var dt = $.trim($('#TXTDT_' + ri).val());
        var SFCMinVC = $.trim($('#TXTSFCMinVC_' + ri).val());
        var SFCVC = $.trim($('#TXTSFCVC_' + ri).val());

        if (fromPlace.length == 0) {
            ermsg += "Please enter the From Place at row no: " + ri + ".<br />"
        }
        else {
            if (fromPlace.length > 0) {
                if (!ALPHANUMERICREGX_g.test(fromPlace)) {
                    ermsg += "Invalid From Place. Please remove the special characters at row no: " + ri + ". <br />"
                }
                if (!ALPHAREGX_g.test(fromPlace)) {
                    ermsg += "Please atleast enter one Alpha character in From Place at row no: " + ri + ". <br />"
                }
            }
        }
        if (toplace.length == 0) {
            ermsg += "Please enter the To Place at row no: " + ri + ".<br />"
        }
        else {
            if (toplace.length > 0) {
                if (!ALPHANUMERICREGX_g.test(toplace)) {
                    ermsg += "Invalid To Place. Please remove the special characters at row no: " + ri + ".<br />"
                }
                if (!ALPHAREGX_g.test(toplace)) {
                    ermsg += "Please atleast enter one Alpha character in To Place at row no: " + ri + ". <br />"
                }

            }
        }
        if (cat.length == 0) {
            ermsg += "Please choose the category at row no: " + ri + ".<br />"
        }
        if (dis.length == 0) {
            ermsg += "Please enter the Distance at row no: " + ri + ".<br />"
        }
        else {
            if (!WHOLENUMBERREGEX_g.test(dis)) {
                ermsg += "Please enter the valid Distance at row no: " + ri + ".<br />"
            }
        }

        if (amt.length > 0) {
            if (isNaN(amt)) {
                ermsg += "Please enter the valid Amount at row no: " + ri + ".<br />"
            }
            else {
                if (parseFloat(amt) < 0) {
                    ermsg += "Please enter the valid Amount at row no: " + ri + ".<br />"
                }
            }
        }
        else {
            ermsg += "Please enter the amount at row no: " + ri + ".<br />";
        }

        if (SFCMinVC.length > 0) {
            if (!WHOLENUMBERREGEX_g.test(SFCMinVC)) {
                ermsg += "Please enter the valid SFC Min Visit Count at row no: " + ri + ".<br />";
            }
        }
        if (SFCVC.length > 0) {
            if (!WHOLENUMBERREGEX_g.test(SFCVC)) {
                ermsg += "Please enter the valid SFC Max Visit Count at row no: " + ri + ".<br />";
            }
        }
        if (df.length > 0) {
            var date1 = df.split('/')[1] + '/' + df.split('/')[0] + '/' + df.split('/')[2];
        }
        else {
            ermsg += "Please enter the date in to the Date From field at row number: " + ri + ".<br />";
        }

        if (dt.length > 0) {
            var date2 = dt.split('/')[1] + '/' + dt.split('/')[0] + '/' + dt.split('/')[2];
            if (!fnDateFormatValidation(date2)) {
                ermsg += "Please enter the correct date format in Date To.<br />";
            }
        }
        else {
            ermsg += "Please enter the date in to the Date to field at row number: " + ri + ".<br />";
        }

        if (df.length > 0 && dt.length > 0) {
            var date1 = df.split('/')[1] + '/' + df.split('/')[0] + '/' + df.split('/')[2]
            var date2 = dt.split('/')[1] + '/' + dt.split('/')[0] + '/' + dt.split('/')[2]
            var d1 = new Date(date1);
            var d2 = new Date(date2);
            if ((d2 - d1) < 0) {
                ermsg += "Date from should not be greater than Date to at row no " + ri + ".<br />";
            }

            if (!fnDateRangeValidation(df)) {
                ermsg += "Invalid Day, Month, or Year range detected in Date From to row number " + ri + ".<br />";
            }

            if (!fnDateRangeValidation(dt)) {
                ermsg += "Invalid Day, Month, or Year range detected in Date to to row number " + ri + ".<br />";
            }
        }
    }
    if (ermsg.length > 0) {
        fnMsgAlert("info", "SFC Master", ermsg);
        return false;
    }
    return true;
}

function fnSFCGetEditedRows() {
    debugger;
    var SFCEditRows = $('#tblSFCEdit tr');
    var SFCEditArray = new Array();
    for (var i = 0; i < (SFCEditRows.length - 1) ; i++) {
        var ri = i + 1;
        debugger;
        var DFC = $('#SPNDFC_' + ri).html();
        var SFCV = $('#SPNSFCV_' + ri).html();
        var regionCode = $('#SPNRC_' + ri).html();
        var fromPlace = $.trim($('#TXTFP_' + ri).val());
        var toplace = $.trim($('#TXTTP_' + ri).val());
        var cat = $.trim($('#SELCAT_' + ri).val())
        var tm = $.trim($('#SELTM_' + ri).val())
        var dis = $.trim($('#TXTDIS_' + ri).val());
        var amt = $.trim($('#TXTAMT_' + ri).val()).length == 0 ? "0" : $.trim($('#TXTAMT_' + ri).val());
        var df = $.trim($('#TXTDF_' + ri).val());
        var dt = $.trim($('#TXTDT_' + ri).val());
        var SFCMinVC = $.trim($('#TXTSFCMinVC_' + ri).val());
        var SFCVC = $.trim($('#TXTSFCVC_' + ri).val());

        var dbfromPlace = $.trim($('#SPNFP_' + ri).html());
        var dbtoplace = $.trim($('#SPNTP_' + ri).html());
        var dbcat = $.trim($('#SPNCAT_' + ri).html())
        var dbtm = $.trim($('#SPNTM_' + ri).html())
        var dbdis = $.trim($('#SPNDIS_' + ri).html());
        var dbamt = $.trim($('#SPNAMT_' + ri).html()).length == 0 ? "0" : $.trim($('#SPNAMT_' + ri).html());
        var dbdf = $.trim($('#SPNDF_' + ri).html());
        var dbdt = $.trim($('#SPNDT_' + ri).html());
        var dbSFCMinVC = $.trim($('#SPNSFCMinVC_' + ri).html());
        var dbSFCVC = $.trim($('#SPNSFCVC_' + ri).html());

        var SFC = {};
        if (!(fromPlace == dbfromPlace && toplace == dbtoplace
            && cat == dbcat && tm == dbtm && dis == dbdis
            && amt == dbamt && df == dbdf && dt == dbdt && SFCMinVC == dbSFCMinVC && SFCVC == dbSFCVC)) {
            SFC.Action = "EDIT";
        }
        else {
            SFC.Action = "NO";
        }
        var sfc_approval_req = fnGetPrivilegeVal('SFC_APPROVAL_REQUIRED', 'YES');
        var status = sfc_approval_req.toUpperCase() == "NO" ? "1" : "2";

        SFC.Distance_Fare_Code = DFC;
        SFC.Region_Code = regionCode;
        SFC.SFC_Version_No = SFCV;
        SFC.From_Region_Name = fromPlace;
        SFC.To_Region_Name = toplace;
        SFC.Category_Name = cat;
        SFC.Distance = dis;
        SFC.Fare_Amount = amt;
        SFC.Date_From = df.split('/')[1] + '/' + df.split('/')[0] + '/' + df.split('/')[2];
        SFC.Date_To = dt.split('/')[1] + '/' + dt.split('/')[0] + '/' + dt.split('/')[2];
        SFC.Status = status;
        SFC.Travel_Mode = tm;
        SFC.Minimum_Count = SFCMinVC;
        SFC.SFC_Visit_Count = SFCVC;
        SFCEditArray.push(SFC);

    }
    return SFCEditArray;
}

var SFC1;
function fnSaveEditSFC() {
    debugger;
    var saveType = "Edit";
    if (fnValidateSFCEdit()) {
        debugger;
        var SFCEditedRows = fnSFCGetEditedRows();
        debugger;

        var s = jsonPath(SFCEditedRows, "$[?(@.Action!='NO')]");
        if (s != null && s.length > 0) {
            if (SFCEditedRows.length > 0) {
                SFC1 = SFCEditedRows;
                $.ajax({
                    type: 'POST',
                    url: '../HiDoctor_Master/SFCRegion/SaveSFCMaster',
                    data: "SFCJson=" + JSON.stringify(SFCEditedRows) + "&SaveType=" + saveType,
                    success: function (response) {
                        debugger;
                        $('#dvSFC').unblock();
                        //if (response != null  && response.SFCEdit != "0") {
                        //    debugger;
                        //    fnMsgAlert('info', 'SFC Master', response.SFCEdit);
                        //}
                        if ((response["Travel_Mode"] != "") && (response["Travel_Mode"] != undefined)) {
                            debugger;
                            fnMsgAlert('info', 'SFC Master', response["Travel_Mode"]);
                        }
                        else if ((response["Message"] != "") && (response["Message"] != undefined)) {
                            if (response["Message"] != "0") {
                                fnMsgAlert('info', 'SFC Master', response["Message"]);
                            }
                            else {
                                fnMsgAlert('success', 'SFC Master', 'Saved successfully.');
                                fnGetSFCRegions('1', true);
                                $('#dvEditSFC').overlay().close();
                            }
                        }
                        else if (response["Message"] != null && response["Message"] == "0") {
                            debugger;
                            fnMsgAlert('success', 'SFC Master', 'Saved successfully.');
                            fnGetSFCRegions('1', true);
                            $('#dvEditSFC').overlay().close();
                        }
                    },
                    error: function (e) {
                        $('#dvSFC').unblock();
                        fnMsgAlert('ERROR', 'SFC Master', e.responseText);
                    }
                });
            }
            else {
                fnMsgAlert("info", "SFC Master", "No rows are changed.");
            }
        }
        else {
            fnMsgAlert("info", "SFC Master", "No rows are changed.");
        }
    }
}

function fnDateRangeValidation(input) {
    var monthfield = input.split("/")[1]
    var dayfield = input.split("/")[0]
    var yearfield = input.split("/")[2]
    var dayobj = new Date(yearfield, monthfield - 1, dayfield)
    if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield)) {
        return false;
    }
    return true;

}


function fnSearchClear() {
    $('#txtRegionSearch').val('');
    $('#txtFromSearch').val('');
    $('#txttoSearch').val('');
    $('#approved').attr('checked', 'checked');
    $('#applied').removeAttr('checked', 'checked');
    $('#unapproved').removeAttr('checked', 'checked');

    fnGetSFCRegions(1);
}

var regionSfcDetails = "";
var sfcjsonString = "";
var sfcjsonstringToplace = "";
function fnGetSfc() {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SFCRegion/GetSfc',
        data: "regionCode=" + $("#hdnRegionCode").val(),
        success: function (response) {

            regionSfcDetails = response;
            sfcjsonString = "";
            var sfcFromplace = "[";
            for (var i = 0; i < regionSfcDetails.length; i++) {
                sfcFromplace += "{label:" + '"' + "" + regionSfcDetails[i].From_Region_Name + "" + '",' + "value:" + '"' + "" + regionSfcDetails[i].From_Region_Name + "" + '"' + "}";
                if (i < regionSfcDetails.length - 1) {
                    sfcFromplace += ",";
                }
                if (regionSfcDetails[i].Travel_Mode != null) {
                    alert(regionSfcDetails[i].Travel_Mode);
                }
            }
            sfcFromplace += "];";
            sfcjsonString = eval(sfcFromplace);
            $("#txtfrmplace").unautocomplete();
            autoComplete(sfcjsonString, "txtfrmplace", "hdnSFC", 'autoSFC');

        },
        error: function (e) {

            fnMsgAlert('ERROR', 'SFC Master', e.responseText);
        }
    });

}



function fnGetSfcTo() {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SFCRegion/GetSfcToPlace',
        data: "regionCode=" + $("#hdnRegionCode").val(),
        success: function (response) {

            regionSfcDetails = response;
            sfcjsonstringToplace = "";
            var Sfctoplace = "[";
            for (var i = 0; i < regionSfcDetails.length; i++) {
                Sfctoplace += "{label:" + '"' + "" + regionSfcDetails[i].To_Region_Name + "" + '",' + "value:" + '"' + "" + regionSfcDetails[i].To_Region_Name + "" + '"' + "}";
                if (i < regionSfcDetails.length - 1) {
                    Sfctoplace += ",";
                }
            }
            Sfctoplace += "];";
            sfcjsonstringToplace = eval(Sfctoplace);
            $("#txttoplace").unautocomplete();
            autoComplete(sfcjsonstringToplace, "txttoplace", "hdnSFCtoplace", 'autoSfcToplace');
        },
        error: function (e) {

            fnMsgAlert('ERROR', 'SFC Master', e.responseText);
        }
    });

}

function fnGetTravelModes() {
    $.ajax({
        type: 'POST',
        url: '../SFCRegion/GetTravelModes',
        success: function (response) {
            if (response != "") {
                var content = "";
                for (var i = 0; i < response.length; i++) {

                    var tm = {};
                    tm.label = response[i].TravelMode_Name;
                    tm.value = response[i].TravelMode_Name;
                    travelModeArr.push(tm);
                    var control = "<div class='checkbox checkbox-primary'>"
	                        + "<input type='checkbox' id='chkSelectUsers_" + i + "' name='chkSelectUsers' value='" + response[i].TravelMode_Name + "'>"
	                        + "<label for='chkSelectUsers_" + i + "'>" + response[i].TravelMode_Name + "</label>"
                            + "</div>";
                    content += control;
                }
                $('#divTravelMode').html(content);
            }
        },
        error: function (e) {
            travelModeArr.clear();
        }
    });
}

function fnCheckCount(ele, index) {
    var minCount = $("#TXTSFCMinVC_" + index.toString()).val();
    var maxCount = $("#TXTSFCVC_" + index.toString()).val();
    if (parseInt(minCount) > 0 && parseInt(maxCount) > 0) {
        if (parseInt(minCount) > parseInt(maxCount)) {
            fnMsgAlert('ERROR', 'SFC Master', "If max count is not zero, minimum count cannot be greater than max count.");
            $(ele).val("0");
        }
    }
}
