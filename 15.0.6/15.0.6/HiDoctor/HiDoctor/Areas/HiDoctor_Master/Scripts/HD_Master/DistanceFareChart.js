var DFCROW_STRING = '<td><span id="spnSno_DFNUM">DFNUM.</span><span id="SPNDFCCode_DFNUM" style="display:none" ></span></td><td><input type="text" id="txtFromKm_DFNUM" maxlength="4" /></td>';
DFCROW_STRING += '<td><input type="text" id="txtToKm_DFNUM" maxlength="4"  /></td><td><input type="text" id="txtFare_DFNUM" maxlength="5" /></td>';
DFCROW_STRING += '<td><span id="spnDele_DFNUM" onclick="fnDeleteRow(DFNUM)">X</span></td><td>&nbsp;</td>';
var WHOLENUMBERREGEX_g = new RegExp("^[0-9]+$");
var CURRENCYFORMAT_G = new RegExp("^\d{1,5}(\.\d{1,3})?$")

var travelModeArr = new Array();

function fnBindEntityAndUsertype() {
    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Master/DistanceFareChart/GetEntityAndUserType',
        success: function (response) {
            if (response != "" && response != null) {
                var jData = response;
                if (jData !== undefined && jData.length > 0) {
                    // Bind Entity
                    $("#ddlEntity").append("<option value=0>-Entity-</option>");
                    $("#ddlFilterEntity").append("<option value=0>-Entity-</option>");
                    $("#ddlFilterEntity").append("<option value=ALL>All</option>");
                    if (jData[0].Data != undefined && jData[0].Data.length > 0) {
                        for (var i = 0; i < jData[0].Data.length; i++) {
                            $("#ddlEntity").append("<option value=" + jData[0].Data[i].value + ">" + jData[0].Data[i].text + "</option>");
                            $("#ddlFilterEntity").append("<option value=" + jData[0].Data[i].value + ">" + jData[0].Data[i].text + "</option>");
                        }
                    }
                    $("#ddlEntity").attr('selectedIndex', 0);
                    $("#ddlFilterEntity").attr('selectedIndex', 0);

                    // Bind user type
                    $("#ddlUserType").append("<option value=0>-User Type-</option>");
                    $("#ddlFilterUserType").append("<option value=0>-User Type-</option>");
                    $("#ddlFilterUserType").append("<option value=ALL>All</option>");
                    if (jData[1].Data != undefined && jData[1].Data.length > 0) {
                        for (var i = 0; i < jData[1].Data.length; i++) {
                            $("#ddlUserType").append("<option value=" + jData[1].Data[i].value + ">" + jData[1].Data[i].text + "</option>");
                            $("#ddlFilterUserType").append("<option value=" + jData[1].Data[i].value + ">" + jData[1].Data[i].text + "</option>");
                        }
                    }
                    $("#ddlUserType").attr('selectedIndex', 0);
                    $("#ddlFilterUserType").attr('selectedIndex', 0);
                }
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#main").unblock();
        }
    });
}
//Function to bind the Travel mode places
function fnGetTravelModes() {
    travelModeArr = [];
    $.ajax({
        type: 'POST',
        url: '../SFCRegion/GetTravelModes',
        success: function (response) {           
            for (var i = 0; i < response.length; i++) {                
                var tm = {};
                tm.label = response[i].TravelMode_Name;
                tm.value = response[i].TravelMode_Name;
                travelModeArr.push(tm);
            }

            $('#drpTravelMode').append("<option value='0'>-Select Travel Mode-</option>");
            $('#drpFilterTravelMode').append("<option value='0'>-Select Travel Mode-</option>");
            for (var t = 0; t < travelModeArr.length; t++) {
                $('#drpTravelMode').append("<option value='" + travelModeArr[t].value + "'>" + travelModeArr[t].label + "</option>");
            }
            for (var t = 0; t < travelModeArr.length; t++) {
                $('#drpFilterTravelMode').append("<option value='" + travelModeArr[t].value + "'>" + travelModeArr[t].label + "</option>");
            }
        },
        error: function (e) {
            travelModeArr.clear();
        }
    });
}

function fnBindDistanceFareChart() {
    $('#dvTablePrint').hide();
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "a",
        url: '../HiDoctor_Master/DistanceFareChart/GetDistanceFareChart',
        success: function (response) {
            if (response != "" && response != null) {
                if (response.split('^')[0] != 'ERROR') {
                    //$("#lnkExcel").attr('href', response.split('$')[1]);
                    $('#dvTablePrint').show();
                    $("#dvDFC").html(response);
                }
                else {
                    fnMsgAlert('info', '', 'Error:' + response.split('^')[1]);
                    $("#main").unblock();
                }
            }
            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error:' + e.Message);
            $("#main").unblock();
        }
    });
}


function fnGetDFCRecords() {

    var userTypeCode = $('#ddlFilterUserType').val();
    var entity = $('#ddlFilterEntity').val();
    var travelMode = $('#drpFilterTravelMode').val();
    $.ajax({
        type: 'POST',
        data: "userTypeCode=" + userTypeCode + "&travelMode=" + travelMode + "&category=" + entity,
        url: '../HiDoctor_Master/DistanceFareChart/GetDFCHTMLTableFormat',
        success: function (response) {            
            if (response != null && response != "") {
                if (response.length == 0) {
                    fnMsgAlert('info', 'DFC Master', "No DFC Records Found given combination.");
                }
                else if (response.length > 0) {
                    $("#dvDFCGrid").html(response);
                }
                else {
                    fnMsgAlert('info', '', 'Error:' + response.split('^')[1]);
                    $("#main").unblock();
                }
            }
            else {
                fnMsgAlert('info', 'DFC Master', "No DFC Records Found given combination.");
            }
            $("#main").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error:' + e.Message);
            $("#main").unblock();
        }
    });
}

function fnDFCTableShowHide(divid, spnid) {
    if ($('.' + divid).css("display") == "none") {
        $('.' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expandDFC');
        $('#' + spnid).addClass('collapseDFC');
    }
    else {
        $('.' + divid).fadeOut('slow');
        $('#' + spnid).removeClass('collapseDFC');
        $('#' + spnid).addClass('expandDFC');
    }

    if ($("#hdnDistanceRangeCode").val() != "") {
        $("#" + $("#hdnDistanceRangeCode").val()).css('display', 'none'); // display none  the hidden row while editing       
    }
}

function fnSaveDistanceFareChart() {
    debugger;
    ShowModalPopup("dvloading");
    var DFCArray = new Array();
    var isOneRow = false;
    if (fnValidateDistanceFareChart()) {
        var userTypeCode = $("#ddlUserType").val();
        var userTypeName = $("#ddlUserType :selected").text();
        var entityCode = $("#ddlEntity").val();
        var entityName = $("#ddlEntity :selected").text();
        var dateFrom = $("#txtDateFrom").val();
        var dateTo = $("#txtDateTo").val();
        var tm = $('#drpTravelMode :selected').text();
        var status = '1';
        dateFrom = dateFrom.split('/')[2] + '-' + dateFrom.split('/')[1] + '-' + dateFrom.split('/')[0];
        dateTo = dateTo.split('/')[2] + '-' + dateTo.split('/')[1] + '-' + dateTo.split('/')[0];


        for (var i = 0; i < $('#tbl_DFCEntry tr').length - 1; i++) {
            var rindex = i + 1;

            var fromKm = $.trim($('#txtFromKm_' + rindex).val());
            var toKm = $.trim($('#txtToKm_' + rindex).val());
            var fare = $.trim($('#txtFare_' + rindex).val());
            var isAmountFixed = $.trim($('#isFixed_' + rindex).attr('checked') == "checked" ?"1":"0");

            if (fromKm.length > 0 && toKm.length > 0 && fare.length > 0) {
                isOneRow = true;
                var DFC = {}; var DFCCode = $.trim($('#SPNDFCCode_' + rindex).html()); DFC.Distance_Range_Code = DFCCode; DFC.From_Km = fromKm; DFC.To_Km = toKm;
                DFC.Fare_Amount = fare; DFC.User_Type_Code = userTypeCode; DFC.User_Type_Name = userTypeCode; DFC.Date_From = dateFrom; DFC.Date_To = dateTo;
                DFC.Status = status; DFC.Is_Amount_Fixed = isAmountFixed; DFC.Entity_Name = entityName; DFC.Entity_Code = entityCode; DFC.Travel_Mode = tm;
                DFC.Action = DFCCode.length > 0 ? $('#DFCRow_' + rindex).hasClass('DeleteDFRow') ? "DELETE" : "UPDATE" : $('#DFCRow_' + rindex).hasClass('DeleteDFRow') ? "DELETE":"INSERT";
                DFCArray.push(DFC);
            }
            else {
                if ( fromKm.length == 0 && toKm.length == 0 && fare.length == 0 && $.trim($('#SPNDFCCode_' + rindex).html()).length > 0) {
                    var DFC = {}; var DFCCode = $.trim($('#SPNDFCCode_' + rindex).html()); DFC.Distance_Range_Code = DFCCode; DFC.From_Km = 0; DFC.To_Km = 0;
                    DFC.Fare_Amount = 0; DFC.User_Type_Code = userTypeCode; DFC.User_Type_Name = userTypeCode; DFC.Date_From = dateFrom; DFC.Date_To = dateTo;
                    DFC.Status = status; DFC.Is_Amount_Fixed = isAmountFixed; DFC.Entity_Name = entityName; DFC.Entity_Code = entityCode; DFC.Travel_Mode = tm;
                    DFC.Action = "DELETE";
                    DFCArray.push(DFC);
                }
            }
        }
        if (DFCArray.length == 0) {
            fnMsgAlert('info', 'DFC Master', "Please enter atleast one row in distance table.");
            HideModalPopup("dvloading");
            return false;
        }
        if (!isOneRow) {
            fnMsgAlert('info', 'DFC Master', "Please enter atleast one row in distance table.");
            HideModalPopup("dvloading");
            return false;
        }
        //var action = 'INSERT';
        //var distanceRangeCode = '';
        //if ($("#hdnDistanceRangeCode").val() != "") {
        //    action = "UPDATE";
        //    distanceRangeCode = $("#hdnDistanceRangeCode").val();
        //}

        
        HideModalPopup("dvloading");
            
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $("#main").unblock();
        $.ajax({
            type: 'POST',
            data: "DFCJson="+JSON.stringify(DFCArray),
            url: '../HiDoctor_Master/DistanceFareChart/InsertDistanceFareChart',
            success: function (response) {
                if (response != "" && response != null && response == 'SUCCESS') {
                    fnMsgAlert('success', 'Distance Fare Chart', 'Distance Range saved successfully.');
                   // fnBindDistanceFareChart();
                    fnCancelDistanceFareChart();
                    fnGetDFCRecords();
                    $("#main").unblock();
                }
                else {
                    if (response.indexOf('^') > -1) {
                        fnMsgAlert('info', '', 'Error:' + response.split('^')[1]);
                    }
                    else {
                        fnMsgAlert('info', 'Distance Fare Chart', response);
                    }
                    $("#main").unblock();
                }
            },
            error: function (e) {
                fnMsgAlert('error', 'Distance Fare Chart', 'Error:' + e.Message);
                $("#main").unblock();
            }
        });
    }
}

function fnValidateDistanceFareChart() {    
    var auserName = $("#spnUser").html().split("(")[0];
    // Empty Check

    var errmsg = "";
    if ($("#ddlUserType").val() == "0" || $("#ddlUserType").val() == null) {
        errmsg = "Please select User Type.<br />"
        //fnMsgAlert('info', 'Distance Fare Chart', 'Please select User Type.');
        //HideModalPopup("dvloading");
        //return false;
    }  

    if ($("#ddlEntity").val() == "0" || $("#ddlEntity").val() == null) {
        errmsg += 'Please select Entity. <br />'
    }

    if ($("#drpTravelMode").val() == "0" || $("#drpTravelMode").val() == null) {
        errmsg += 'Please select Travel Mode. <br />'
    }

    if ($.trim($("#txtDateFrom").val()) == "") {
        errmsg += "Please select Date From. <br />";
    }
    if ($.trim($("#txtDateTo").val()) == "") {
        errmsg += "Please select Date To. <br />";
    }
    // From Date To Date check
    var fromDate = $("#txtDateFrom").val().split('/')[2] + '/' + $("#txtDateFrom").val().split('/')[1] + '/' + $("#txtDateFrom").val().split('/')[0];
    var toDate = $("#txtDateTo").val().split('/')[2] + '/' + $("#txtDateTo").val().split('/')[1] + '/' + $("#txtDateTo").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    ////Invalid Date
    //if (!(fnValidateDateFormate($("#txtDateFrom"), "Date From"))) {
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //if (!(fnValidateDateFormate($("#txtDateTo"), "Date To"))) {
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    if (startDate > endDate) {
        errmsg += 'End date can not be less than start date.';
    }

    var preToKm = null;

    for (var i = 0; i < $('#tbl_DFCEntry tr').length - 1; i++) {
        var rindex = i + 1;
        if ($('#DFCRow_' + rindex).hasClass('DeleteDFRow')) {
            continue;
        }
        var fromKm = $.trim($('#txtFromKm_' + rindex).val());
        var toKm = $.trim($('#txtToKm_' + rindex).val());
        var fare = $.trim($('#txtFare_' + rindex).val());

        if (fromKm.length > 0 || toKm.length > 0 || fare.length > 0) {

            if (fromKm.length == 0) {
                errmsg += "Please enter From Km at row no: " + rindex + ".<br />";
            }
            if (!WHOLENUMBERREGEX_g.test(fromKm)) {
                errmsg += "Invalid From Km at row no: " + rindex + ".<br />";
            }
            if (toKm.length == 0) {
                errmsg += "Please enter To Km at row no: " + rindex + ".<br />";
            }
            if (!WHOLENUMBERREGEX_g.test(toKm)) {
                errmsg += "Invalid To Km at row no: " + rindex + ".<br />";
            }
            if (fare.length == 0) {
                errmsg += "Please enter the fare value at row no: " + rindex + ".<br />";
            }
            if (CURRENCYFORMAT_G.test(fare)) {
                errmsg += "Invalid fare value at row no: " + rindex + ".<br />";
            }

            // Kms starts with 0 validation.
            if (preToKm == null) {
                if (fromKm != 0) {
                    errmsg += "In this DFC the row no "+rindex+" From Km starts with 0. <br />";
                }
            }

            if (WHOLENUMBERREGEX_g.test(toKm) && WHOLENUMBERREGEX_g.test(fromKm) && parseInt(fromKm) > parseInt(toKm)) {
                errmsg += "To Km should be greater than From Km at row no: " + rindex + ".<br />";
            }

            // KMS gap validation.
            if (preToKm != null && WHOLENUMBERREGEX_g.test(preToKm)) {
                if (parseInt(preToKm) + 1 != parseInt(fromKm)) {
                    errmsg += "In this DFC the Kms gap between for row nos:" + (rindex - 1) + "&" + (rindex) + ".<br />";
                }
            }
            preToKm = toKm;

        }
        else {
        }
    }

    if (errmsg.length > 0) {
        fnMsgAlert('info', 'DFC', errmsg);
        HideModalPopup("dvloading");
        return false;
    }
    return true;

    // from km  To km check
    //var curFrom = parseInt($("#txtFromKm").val());
    //var curTo = parseInt($("#txtToKm").val());
    //var fare = parseFloat($("#txtFare").val());

    //// negative value check
    //if (curFrom < 0) {
    //    fnMsgAlert('info', 'Distance Fare Chart', 'From Km cannot be a negative value.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //if (curTo < 0) {
    //    fnMsgAlert('info', 'Distance Fare Chart', 'To Km cannot be a negative value.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //if (fare < 0) {
    //    fnMsgAlert('info', 'Distance Fare Chart', 'Fare amount cannot be a negative value.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    //// from km  To km check
    //if (!(curFrom < curTo)) {
    //    fnMsgAlert('info', 'Distance Fare Chart', 'To Km should be greater than From Km.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}



    //// From Date To Date chack
    //var fromDate = $("#txtDateFrom").val().split('/')[2] + '/' + $("#txtDateFrom").val().split('/')[1] + '/' + $("#txtDateFrom").val().split('/')[0];
    //var toDate = $("#txtDateTo").val().split('/')[2] + '/' + $("#txtDateTo").val().split('/')[1] + '/' + $("#txtDateTo").val().split('/')[0];
    //var startDate = new Date(fromDate);
    //var endDate = new Date(toDate);

    ////Invalid Date
    //if (!(fnValidateDateFormate($("#txtDateFrom"), "Date From"))) {
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //if (!(fnValidateDateFormate($("#txtDateTo"), "Date To"))) {
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    //if (startDate > endDate) {
    //    fnMsgAlert('info', 'Distance Fare Chart', 'End date can not be less than start date.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //var curUserType = $("#ddlUserType").val();
    //var curEntity = $("#ddlEntity").val();

    //if ($(".dv_" + curUserType + " .dv_" + curEntity).length > 0) { // if the user type already has any distance record
    //    var maxKm = 0.0;
    //    var oldDFC = [];

    //    $(".dv_" + curUserType + " .dv_" + curEntity).each(function () {
    //        var distRangeCode = $(this).attr('id').split('_')[1];
    //        if ($("#hdnDistanceRangeCode").val() == "" || $("#hdnDistanceRangeCode").val() != distRangeCode) { // for edit mode it should skip the edited record
    //            if ($("#status_" + distRangeCode).html() == 'Enabled') { // only for enabled records
    //                var fromKm = parseInt($("#from_" + distRangeCode).html());
    //                var toKm = parseInt($("#to_" + distRangeCode).html());
    //                maxKm = ((maxKm < toKm) ? toKm : maxKm);
    //                oldDFC.push({ fromKm: fromKm, toKm: toKm });
    //            }
    //        }
    //    });



    //    if ($("#hdnDistanceRangeCode").val() == "") { // for new insert from km check
    //        if (oldDFC.length > 0) {
    //            //start with zero check
    //            var zeroFromJson = jsonPath(oldDFC, "$.[?(@.fromKm=='0')]");


    //            if (zeroFromJson == false && curFrom != 0.0) {
    //                //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
    //                fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, at least anyone of ‘From KM’ should start with 0 (Zero)');
    //                HideModalPopup("dvloading");
    //                return false;
    //            }
    //            else if (zeroFromJson != false && curFrom == 0.0) {
    //                //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
    //                fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, only one ‘From KM’ can be start with 0 (Zero)');
    //                HideModalPopup("dvloading");
    //                return false;
    //            }
    //            else { // if the set of record don hav a value start with 0 we hav to allow it
    //                if (curFrom != 0.0) {
    //                    if (!(curFrom == (maxKm + 1))) {
    //                        //fnMsgAlert('info', 'Distance Fare Chart', 'From Km Should start from the next number of the Last greater limit.');
    //                        fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', The entered ‘From KM’ is not valid. It should be the next number of the greatest ‘To KM’ value of this DFC. Greatest ‘To KM’ value available for this DFC is ' + maxKm + '. You should enter <Value> ' + (maxKm + 1) + ' as From KM.');
    //                        HideModalPopup("dvloading");
    //                        return false;
    //                    }
    //                }
    //            }
    //        }
    //        else {
    //            if (curFrom != 0.0) {
    //                //fnMsgAlert('info', 'Distance Fare Chart', 'from km should start from 0.');
    //                fnMsgAlert('info', 'Distance Fare Chart', ' Dear ' + auserName + ', ‘From KM’ should start from 0 (Zero)');
    //                HideModalPopup("dvloading");
    //                return false;
    //            }
    //        }
    //    }
    //    else { // for edit
    //        //start with zero check
    //        var zeroFromJson = jsonPath(oldDFC, "$.[?(@.fromKm=='0')]");
    //        if (zeroFromJson == false && curFrom != 0.0) {
    //            //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
    //            fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, at least anyone of ‘From KM’ should start with 0 (Zero)');
    //            HideModalPopup("dvloading");
    //            return false;
    //        }
    //        else if (zeroFromJson != false && curFrom == 0.0) {
    //            //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
    //            fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, only one ‘From KM’ can be start with 0 (Zero)');
    //            HideModalPopup("dvloading");
    //            return false;
    //        }
    //    }

    //    if (oldDFC.length > 0) {

    //        // check limit.
    //        var checkLimitJson = jsonPath(oldDFC, "$.[?((@.fromKm<='" + curFrom + "' & @.toKm>='" + curFrom + "') | (@.fromKm<='" + curTo + "' & @.toKm>='" + curTo + "') | (@.fromKm>='" + curFrom + "' & @.toKm<='" + curTo + "') )]");
    //        if (checkLimitJson != false && checkLimitJson.length > 0) {
    //            //fnMsgAlert('info', 'Distance Fare Chart', 'You Cannot insert this limit.');
    //            fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', You cannot save this record. Either the ‘From KM’ or the ‘To KM’ which you have entered falls in between the already entered ‘From Km’ and ‘To KM’ values. Please modify the same.');

    //            HideModalPopup("dvloading");
    //            return false;
    //        }

    //        // Continues limit check    
    //        maxKm = ((maxKm < curTo) ? curTo : maxKm);
    //        oldDFC.push({ fromKm: curFrom, toKm: curTo });
    //        for (var p = 0; p < oldDFC.length; p++) {
    //            if (oldDFC[p].toKm != maxKm) {
    //                var continLimitJson = jsonPath(oldDFC, "$.[?(@.fromKm=='" + (oldDFC[p].toKm + 1) + "')]");
    //                if (continLimitJson == false || continLimitJson === undefined || continLimitJson.length < 1) {
    //                    //fnMsgAlert('info', 'Distance Fare Chart', 'Continuous limit error.');
    //                    fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ',‘From KM’ and ‘To KM’ record continuity is missing. The ‘From KM’ should start from <Value> (i.e. ' + oldDFC[p].toKm + ' + 1). You cannot skip any ‘From KM’ and ‘To KM’ records’ continuity.');
    //                    HideModalPopup("dvloading");
    //                    return false;
    //                }
    //            }
    //        }
    //    }

    //}
    //else {
    //    if (parseInt($("#txtFromKm").val()) != 0) {
    //        //fnMsgAlert('info', 'Distance Fare Chart', 'For new User Type and Entity Combination, the distance limit should start from 0.');
    //        fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', To enter DFC records for any new User Type and Entity Combination, ‘From KM’ should start with 0 (Zero)');
    //        HideModalPopup("dvloading");
    //        return false;
    //    }
    //}
    //return true;
}

function fnCancelDistanceFareChart() {
    $("#ddlUserType").val("0");
    $("#ddlEntity").val("0");
    $("#txtDateFrom").val("");
    $("#txtDateTo").val("");
    $('#drpTravelMode').val("0");
    //$("#chkFixedAmount").attr('checked', false);
    for (var i = 0; i < $('#tbl_DFCEntry tr').length - 1; i++) {
        var r=i+1;
        $('#DFCRow_' + r).removeClass('DeleteDFRow');
        $('#SPNDFCCode_' + r).html('');
        $('#txtFromKm_' + r).val('');
        $('#txtToKm_' + r).val('');
        $('#txtFare_' + r).val('');
        $('#isFixed_' + r).attr('checked', false);
    }
}

function fnEditDFC(distRangeCode, userType, entityType, tm, dateFrom, dateTo) {
    var rowbindingno = 0;
    var rowlength = $('#tblDFC tr').length;
    fnCancelDistanceFareChart();
    var cob_key = userType + "_" + entityType + "_" + tm + "_" + dateFrom + "_" + dateTo;
    var rcnt = 0;
    for (var i = 0; i < rowlength; i++) {
        var row_key_value = $($('#tblDFC tr')[i]).attr('combination_key')
        if (row_key_value != null && row_key_value.length > 0 && cob_key == row_key_value) {
            rcnt++;
            if (rcnt> $('#tbl_DFCEntry tbody tr').length) {
                fnAddDFCRow();
            }
            var id = $($('#tblDFC tr')[i]).attr('id');
            //var userType = $.trim($('#userType_' + id).html());
            // var entity = $.trim($('#entity_' + id).html());
            // var tm = $.trim($('#TM_' + id).html());
            //var dfrom = $.trim($('#dFrom_' + id).html());

            //var dto = $.trim($('#dTo_' + id).html());
            var fkm = $.trim($('#from_' + id).html());
            var tokm = $.trim($('#to_' + id).html());
            var fare = $.trim($('#fare_' + id).html());
            var isfixed = $.trim($('#isFixed_' + id).html());
            var status = $.trim($('#status_' + id).html());
            rowbindingno = rowbindingno + 1;

            $('#ddlUserType').val(userType);
            $('#ddlEntity').val(entityType);
            $('#drpTravelMode').val(tm);
            $('#txtDateFrom').val(dateFrom);
            $('#txtDateTo').val(dateTo);

            $('#SPNDFCCode_' + rowbindingno).html(id);
            $('#txtFromKm_' + rowbindingno).val(fkm);
            $('#txtToKm_' + rowbindingno).val(tokm);
            $('#txtFare_' + rowbindingno).val(fare);
            if (isfixed.toUpperCase() == "YES") {
                $('#isFixed_' + rowbindingno).attr('checked', 'checked');
            }

        }
    }

    ShowModalPopup("dvloading");
    //if ($("#hdnDistanceRangeCode").val() != "") {
    //    $("#" + $("#hdnDistanceRangeCode").val()).css('display', '');
    //}
    //$("#hdnDistanceRangeCode").val(distRangeCode);
    //$("#" + $("#hdnDistanceRangeCode").val()).css('display', 'none');

    //$("#txtFromKm").val($("#from_" + distRangeCode).html());
    //$("#txtToKm").val($("#to_" + distRangeCode).html());
    //$("#txtFare").val($("#fare_" + distRangeCode).html());
    //$("#ddlUserType").val(userType);
    //$("#ddlEntity").val(entityType);
    //$("#txtDateFrom").val($("#dFrom_" + distRangeCode).html());
    //$("#txtDateTo").val($("#dTo_" + distRangeCode).html());

    //if ($("#isFixed_" + distRangeCode).html() == "Yes") {
    //    $("#chkFixedAmount").attr('checked', 'checked');
    //}
    //else {
    //    $("#chkFixedAmount").attr('checked', false);
    //}
    HideModalPopup("dvloading");
    $('#dvDFCDataDiv').tabs('option', 'selected', 0);
    //$(window).scrollTop($('#dvDFCInput').offset().top, 500);
}

function fnChangeStatusDFCValidation(distRangeCode, userType, entityType) {
    ShowModalPopup("dvloading");
    var curUserType = userType;
    var curEntity = entityType;
    var curFrom = parseInt($("#from_" + distRangeCode).html());
    var curTo = parseInt($("#to_" + distRangeCode).html());
    var curStatus = $("#status_" + distRangeCode).html();
    curStatus = ((curStatus == "Enabled") ? "1" : "0");
    $("#hdnDistanceRangeCode").val(distRangeCode);


    if ($(".dv_" + curUserType + " .dv_" + curEntity).length > 1) {
        var maxKm = 0.0;
        var oldDFC = [];

        $(".dv_" + curUserType + " .dv_" + curEntity).each(function () {
            var distRangeCodeOld = $(this).attr('id').split('_')[1];
            if ($("#hdnDistanceRangeCode").val() == "" || $("#hdnDistanceRangeCode").val() != distRangeCodeOld) { // for edit mode it should skip the edited record
                if ($("#status_" + distRangeCodeOld).html() == 'Enabled') { // only for enabled records
                    var fromKm = parseInt($("#from_" + distRangeCodeOld).html());
                    var toKm = parseInt($("#to_" + distRangeCodeOld).html());
                    maxKm = ((maxKm < toKm) ? toKm : maxKm);
                    oldDFC.push({ fromKm: fromKm, toKm: toKm });
                }
            }
        });

        var auserName = $("#spnUser").html().split("(")[0];
        if (curStatus == '0') { // enabling record
            //start with zero check
            var zeroFromJson = jsonPath(oldDFC, "$.[?(@.fromKm=='0')]");
            if (zeroFromJson == false && curFrom != 0.0) {
                //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
                fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, at least anyone of ‘From KM’ should start with 0 (Zero)');
                HideModalPopup("dvloading");
                return false;
            }
            else if (zeroFromJson != false && curFrom == 0.0) {
                //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
                fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, only one ‘From KM’ can be start with 0 (Zero)');
                HideModalPopup("dvloading");
                return false;
            }

            // check limit.
            var checkLimitJson = jsonPath(oldDFC, "$.[?((@.fromKm<='" + curFrom + "' & @.toKm>='" + curFrom + "') | (@.fromKm<='" + curTo + "' & @.toKm>='" + curTo + "') | (@.fromKm>='" + curFrom + "' & @.toKm<='" + curTo + "') )]");
            if (checkLimitJson != false && checkLimitJson.length > 0) {
                //fnMsgAlert('info', 'Distance Fare Chart', 'You Cannot insert this limit.');
                fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', You cannot save this record. Either the ‘From KM’ or the ‘To KM’ which you have entered falls in between the already entered ‘From Km’ and ‘To KM’ values. Please modify the same.');
                HideModalPopup("dvloading");
                return false;
            }

            // Continues limit check       
            maxKm = ((maxKm < curTo) ? curTo : maxKm);
            oldDFC.push({ fromKm: curFrom, toKm: curTo });
            for (var p = 0; p < oldDFC.length; p++) {
                if (oldDFC[p].toKm != maxKm) {
                    var continLimitJson = jsonPath(oldDFC, "$.[?(@.fromKm=='" + (oldDFC[p].toKm + 1) + "')]");
                    if (continLimitJson == false || continLimitJson === undefined || continLimitJson.length < 1) {
                        //fnMsgAlert('info', 'Distance Fare Chart', 'Continuous limit error.');
                        fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ',‘From KM’ and ‘To KM’ record continuity is missing. The ‘From KM’ should start from <Value> (i.e. ' + oldDFC[p].toKm + ' + 1). You cannot skip any ‘From KM’ and ‘To KM’ records’ continuity.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }


        }
        else { // disabling record
            // Continues limit check    
            for (var p = 0; p < oldDFC.length; p++) {
                if (oldDFC[p].toKm != maxKm) {
                    var continLimitJson = jsonPath(oldDFC, "$.[?(@.fromKm=='" + (oldDFC[p].toKm + 1) + "')]");
                    if (continLimitJson == false || continLimitJson === undefined || continLimitJson.length < 1) {
                        //fnMsgAlert('info', 'Distance Fare Chart', 'Continuous limit error.');
                        fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ',‘From KM’ and ‘To KM’ record continuity is missing. The ‘From KM’ should start from <Value> (i.e. ' + oldDFC[p].toKm + ' + 1). You cannot skip any ‘From KM’ and ‘To KM’ records’ continuity.');
                        HideModalPopup("dvloading");
                        return false;
                    }
                }
            }

            if (oldDFC.length > 0) {
                //start with zero check
                var zeroFromJson = jsonPath(oldDFC, "$.[?(@.fromKm=='0')]");
                if (zeroFromJson == false) {
                    //fnMsgAlert('info', 'Distance Fare Chart', 'Anyone of the from place start with 0.');
                    fnMsgAlert('info', 'Distance Fare Chart', 'Dear ' + auserName + ', In this DFC, at least anyone of ‘From KM’ should start with 0 (Zero)');
                    HideModalPopup("dvloading");
                    return false;
                }
            }
        }
        fnChangeStatusDFC(distRangeCode);
    }
    else {
        // change status. No validation needed.
        fnChangeStatusDFC(distRangeCode);
    }
}

function fnChangeStatusDFC(distRangeCode) {
    fnCancelDistanceFareChart();
    var fromKm = '0';
    var toKm = '0';
    var fareAmount = '0';
    var userTypeCode = '';
    var entityCode = '';
    var entityName = '';
    var dateFrom = '';
    var dateTo = '';
    var isAmountFixed = '';

    var status = $("#status_" + distRangeCode).html();
    status = ((status == "Enabled") ? "0" : "1");
    var action = 'STATUS';
    var distanceRangeCode = distRangeCode;

    HideModalPopup("dvloading");

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        data: "userTypeCode=" + userTypeCode + "&entityCode=" + entityCode + "&entityName=" + entityName + "&fromKm=" + fromKm + "&toKm=" + toKm + "&fareAmount=" + fareAmount + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&isAmountFixed=" + isAmountFixed + "&distanceRangeCode=" + distanceRangeCode + "&status=" + status + "&action=" + action,
        url: '../HiDoctor_Master/DistanceFareChart/InsertDistanceFareChart',
        success: function (response) {
            if (response != "" && response != null && response == 'SUCCESS') {
                fnMsgAlert('success', 'Distance Fare Chart', 'Distance Range status changed successfully.');
                fnBindDistanceFareChart();

                $("#main").unblock();
            }
            else {
                fnMsgAlert('info', '', 'Error:' + response.split('^')[1]);
                $("#main").unblock();
            }

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error:' + e.Message);
            $("#main").unblock();
        }
    });
}


function fnAddDFCRow() {
    var rowNo = $('#hdnDFCRowNo').val();
    var newRow = document.getElementById("tbl_DFCEntry").insertRow((parseInt(rowNo) + 1));
    $(newRow).attr('id', "DFCRow_" + (parseInt(rowNo) + 1));
    var rowContent = DFCROW_STRING.replace(/DFNUM/g, (parseInt(rowNo) + 1));
    $(newRow).html(rowContent);
    $('#hdnDFCRowNo').val(parseInt(rowNo) + 1);
}

function fnDeleteRow(rno) {
    $('#DFCRow_' + rno).addClass('DeleteDFRow');
}

