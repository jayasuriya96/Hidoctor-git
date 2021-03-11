/*
DCR Header for Mobile
Date : 31-03-2014
*/


var accString = '<div id="dvAccomp_DNUM" style="border-bottom:1px solid #efefef"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnAccompanistDelete(DNUM)" id="spnAccomDelete_DNUM">Delete</a>'
accString += "<div style='display:none;' id='div_DB_Stored_Flag_DNUM'>0</div>";
accString += '<table style="width: 100%;"><tbody><tr><td><label>Accompanist Name</label><select data-theme="c" name="" style="display:block" data-rel="external" data-mini="true" id="drpAccompanist_DNUM" class="classaccomp"  onChange="fnAccompanistAdd(DNUM);"><option value="0">Select Accompanist</option>';
accString += '</select><input type="hidden" id="hdnAccompanistCode_DNUM" /><input type="hidden" id="hdnAccompMode_DNUM" /><a href="" id="aAccom_DNUM" data-transition="fade" onclick="fnOpenAccompanistPopUp(DNUM)" data-mini="true">Choose Accompanist</a></td></tr><tr><td><div id="dvAccompPop_DNUM" style="display:none"></div></td></tr><tr><td><fieldset data-role="controlgroup"><input type="checkbox" data-theme="d" name="checkbox_DNUM" id="checkbox_DNUM" class="custom" data-mini="true" /><label for="checkbox_DNUM">Independent Call</label></fieldset>';
accString += '</td></tr>';
accString += '<tr><td>';
accString += '<label>Start Time</label><div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" data-theme="d" id="ddlStartHour_DNUM"><option value="">HH</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-theme="d" data-mini="true" id="ddlStartMin_DNUM"></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-theme="d" data-mini="true" id="ddlStartMode_DNUM"><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td></tr>';
accString += '<tr><td>';
accString += '<label>End Time</label><div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-theme="d" data-inline="true" data-mini="true" id="ddlEndHour_DNUM"><option value="">HH</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-theme="d" data-inline="true" data-mini="true" id="ddlEndMin_DNUM"></select></div>';
accString += '<div style="width: 30%; float: left;"><select name=""  data-theme="d" data-inline="true" data-mini="true" id="ddlEndMode_DNUM"><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td></tr>';
accString += '</tbody></table></div>';

var sfcString = '<div id="divsfc_DNUM" data-inset="true" style="border-bottom:1px solid gray"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnSFCDelete(DNUM)" id="spnSFCDelete_DNUM">Delete</a><table style="width: 100%"><tr><td><label>From Place</label><select name="" data-mini="true" id="ddlFromPlace_DNUM" data-theme="c" class="clsFromPlace"><option value="0">Select FromPlace</option>';
sfcString += '</select><input name="" id="txtFromPlace_DNUM" placeholder="If not listed type here" value="" maxlength="50" type="text" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"></td>';
sfcString += '</tr><tr><td><label>To Place</label><select name="" data-mini="true" data-theme="c" id="ddlToPlace_DNUM"  class="clsToPlace fillDist"><option value="0">Select ToPlace</option>';
sfcString += '</select><input name="" id="txtToPlace_DNUM" onblur="fnTxtToPlaceOnBlur()" maxlength="50" placeholder="If not listed type here" value="" type="text" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"></td></tr><tr>';
sfcString += '<td><label>Travel Mode</label><select name="" data-theme="c" data-mini="true" id="ddlTravelMode_DNUM" class="clsTravelMode"><option value="0">Select TravelMode</option>';
sfcString += '</select></td></tr><tr><td><label>Distance</label><input name="" class="clsCheckNumeric" maxlength="4" id="txtDistance_DNUM" placeholder="Distance" value="" type="text" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"><input type="hidden" id="hdnDistanceFareCode_DNUM"/>';
sfcString += '<input type="hidden" id="hdnRouteWay_DNUM" /><input type="hidden" id="hdnFromPlace_DNUM" /><input type="hidden" id="hdnToPlace_DNUM" /> ';
sfcString += "<input type='hidden' id='hdnSFCRegion_DNUM'/><input type='hidden' id='hdnSFCVersion_DNUM'/><input type='hidden' id='hdnSFCCategory_DNUM'/>";
sfcString += "<input type='hidden' value='' id='hdnIs_TP_SFC_DNUM'/>";
sfcString += '</td></tr></table></div>';



var activityString = '<div id="divactivity_DNUM" data-inset="true" style="border-bottom:1px solid gray"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnActivityDelete(DNUM)" id="spnActivityDelete_DNUM">Delete</a><table><tr><td><h5>Activity Name</h5> </td><td><select name=""  data-mini="true" id="drpactivity_DNUM" onchange=""><option value="0">Select Activity</option>'
activityString += '</select></td></tr><tr><td><h5>Start Time</h5> </td><td>';
activityString += '<div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActStartHour_DNUM"><option value="">hh</option><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option>12</option></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActStartMin_DNUM"></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActStartMode_DNUM"><option value="">--</option><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td>';
activityString += '</tr><tr><td><h5>End Time</h5> </td><td>';
activityString += '<div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActEndHour_DNUM"><option value="">hh</option><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option>12</option></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActEndMin_DNUM"></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActEndMode_DNUM"><option value="">--</option><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td></tr>';
activityString += '<tr><td><h5>Remarks</h5> </td><td><textarea name="" id="txtRemarks_DNUM" placeholder=""></textarea></td></tr></table></div>';



var accompanistPopUp = '<div id="dvAccompPopUp" style="background-color:white;padding:8px">Enter minimum of 3 characters from user name or region name<input id="txtMatching" type="text" /><a href="" id="aGo" data-transition="fade" onclick="fnGetAccompPopup()">Go</a><div id="dvAccompSelectPopUpSub"></div></div>'
//***** JSON string detail *****

// AutoFill data = Header_g[0]
// Prefill data = Header_g[1].Data[0] (either tp detail or drafted detail.)
// Intermediate = Header_g[1].Data[1]
// Accompanist autofill = Header_g[0].Data[0]
// CP autofill = Header_g[0].Data[1]
// CP Hop Validation = Header_g[0].Data[2]
// SFC autofill = Header_g[0].Data[3]
// Expense Mapping = Header[2]

//******** END ********

var prefill_g = "", prefillHop_g = "", sfc_g = "", atten_g = "", cp_g = "", cpHop_g = "", distEdit = "", docAccomp_g = "", TP_g = "", TPSFC_g = "";
var Acc_Id_g = [];
var cpJson_g = "", accompanistJson_g = "", travelModeJson_g = "", intermediate_g = "", allUser_g = "";
var accompRow = "", interRow = "";
var hopRouteCategory = new Array();
var otherAccomp = new Array();

// Privilege value variables.
var intermediateNeed = "", accompanistNeed = "", accompanistCPNeed = "", categoryCheckNeeded = "", accMandatory = "", isRouteComplete = "";
var sfcValidation = new Array();


//function to include category
function fnBindCategory(category) {
    if (category.length > 0) {
        for (var c = 0; c < category.length; c++) {
            $("#ddlCategory").append("<option value=" + category[c].value + ">" + category[c].text + "</option>");
        }
    }
}

function fnSetIntermediatePrivilege() {
    hopNeeded = fnGetPrivilegeValue("INTERMEDIATE_PLACES", "");
    hopArr = hopNeeded.split(',');
    var selectedCategory = $("#ddlCategory :selected").text();
    if ($.inArray(selectedCategory, hopArr) > -1) { // check whether the privilege DCR_INTERMEDIATE_PLACES is mapped with the value "DCR".
        intermediateNeed = "YES";
    }
    else {
        intermediateNeed = "NO";
    }
}
function fnTxtToPlaceOnBlur() {
    if ($('#drpWorkPlace').val() == "0" || $('#drpWorkPlace').val() == "") {
        if ($('#ddlToPlace_1').val() != "" && $('#ddlToPlace_1').val() != "0") {
            $("#drpWorkPlace").val($('#ddlToPlace_1').val());
        }
        else {
            $('#drpWorkPlace').val($('#txtToPlace_1').val());
        }
    }
}
//function to set the privileges
function fnSetHeaderPrivileges() {
    var hopNeeded = "", accomp = "", categoryCheck = "", sfcValid = "", hopRouteComplete = "";
    var hopArr = new Array();

    var accompArr = new Array();
    var categoryArr = new Array();

    // geting privilege value.
    hopNeeded = fnGetPrivilegeValue("INTERMEDIATE_PLACES", "");
    accomp = fnGetPrivilegeValue("SHOW_ACCOMPANISTS_DATA", "");
    categoryCheck = fnGetPrivilegeValue("SFC_CATEGORY_DONT_CHECK", "");
    sfcValid = fnGetPrivilegeValue("SFC_VALIDATION", "");
    accMandatory = fnGetPrivilegeValue("DCR_ACCOMPANIST_MANDATORY", "0");
    //  isRouteComplete = fnGetPrivilegeValue("HOP_GRID_ROUTE_COMPLETE", "NO");
    hopRouteComplete = fnGetPrivilegeValue("CIRCLE_ROUTE_APPLICABLE_CATEGORY", "");

    // set the value for validation.
    hopArr = hopNeeded.split(',');
    accompArr = accomp.split(',');
    categoryArr = categoryCheck.split(',');
    sfcValidation = sfcValid.split(',');
    hopRouteCategory = hopRouteComplete.split(',');
    var selectedCategory = $("#ddlCategory :selected").text();

    if ($.inArray(selectedCategory, hopArr) > -1) { // check whether the privilege DCR_INTERMEDIATE_PLACES is mapped with the value "DCR".
        intermediateNeed = "YES";
    }
    else {
        intermediateNeed = "NO";
    }

    if ($.inArray("SFC", accompArr) > -1) { // check whether the privilege SHOW_ACCOMPANISTS_DATA is mapped with the value "SFC".
        accompanistNeed = "YES";
    }
    else {
        accompanistNeed = "NO";
    }

    if ($.inArray("DCR", categoryArr) > -1) { // don check the sfc data with category, if it is mapped with DCR.
        categoryCheckNeeded = "NO";
    }
    else {
        categoryCheckNeeded = "YES";
    }

    if ($.inArray("CP", accompArr) > -1) { // To check the SHOW_ACCOMPANIST_DATA is mapped with th "CP".
        accompanistCPNeed = "YES";
    }
    else {
        accompanistCPNeed = "NO";
    }
}

function fnGetTravelModes() {
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Master/SFCRegion/GetTravelModes',
        success: function (response) {
            travelMode_g = "";
            for (var i = 0; i < response.length; i++) {
                var travelMode = "[";
                for (var i = 0; i < response.length; i++) {
                    travelMode += "{label:" + '"' + "" + response[i].TravelMode_Name + "" + '",' + "value:" + '"' + "" + response[i].TravelMode_Name + "" + '"' + "},";
                }
                travelMode += "];";
                travelModeJson_g = eval(travelMode);
            }
        },
        error: function (e) {

        }
    });
}

//function call from page load
function GetHeaderDetails() {
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRV4Header/GetHeaderDetails',
            data: "dcrStatus=" + dcrStatus + "&dcrDate=" + dcrDate + "&source=" + source + "&flag=" + flag_g,
            success: function (jsHeaderData) {
                var Header_g = "";
                debugger;
                Header_g = jsHeaderData.data;
                if (Header_g[1].Data[0] !== undefined && Header_g[1].Data[0].Data !== undefined && Header_g[1].Data[0].Data != null && Header_g[1].Data[0].Data.length > 0) {
                    prefill_g = Header_g[1].Data[0].Data;
                }
                if (Header_g[1].Data[1] !== undefined && Header_g[1].Data[1].Data !== undefined && Header_g[1].Data[1].Data != null && Header_g[1].Data[1].Data.length > 0) {
                    prefillHop_g = Header_g[1].Data[1].Data;
                }
                if (Header_g[0].Data[3] !== undefined && Header_g[0].Data[3].Data !== undefined && Header_g[0].Data[3].Data != null && Header_g[0].Data[3].Data.length > 0) {
                    sfc_g = Header_g[0].Data[3].Data;
                    //console.log(sfc_g);
                }

                if (flag_g.toUpperCase() == 'A' && Header_g[3] !== undefined && Header_g[3].Data !== undefined && Header_g[3].Data.length > 0) {
                    atten_g = Header_g[3].Data;
                }
                if (Header_g[0].Data[1] !== undefined && Header_g[0].Data[1].Data !== undefined && Header_g[0].Data[1].Data != null && Header_g[0].Data[1].Data.length > 0) {
                    cp_g = Header_g[0].Data[1].Data;
                }
                if (Header_g[0].Data[2] !== undefined && Header_g[0].Data[2].Data !== undefined && Header_g[0].Data[2].Data != null && Header_g[0].Data[2].Data.length > 0) {
                    cpHop_g = Header_g[0].Data[2].Data;
                }
                if (Header_g[2] !== undefined && Header_g[2].Data !== undefined && Header_g[2].Data.length > 0) {
                    distEdit = Header_g[2].Data;
                }


                if (flag_g.toUpperCase() == 'A' && atten_g != "") {
                    if (atten_g[0].Data_From != 'WA') {
                        prefill_g = [];
                        prefill_g.push({
                            From_Place: atten_g[0].From_Place, To_Place: atten_g[0].To_Place,
                            Route_Way: atten_g[0].Route_Way, Distance: atten_g[0].Distance,
                            Travel_Mode: atten_g[0].Travel_Mode, Distance_Fare_Code: atten_g[0].Distance_Fare_Code,
                            Data_From: atten_g[0].Data_From, SFC_Version_No: atten_g[0].SFC_Version_No,
                            SFC_Region_Code: atten_g[0].SFC_Region_Code,
                            SFC_Category_Name: atten_g[0].SFC_Category_Name
                        });
                    }
                    else {
                        prefill_g = [];
                        prefill_g.push({
                            From_Place: "", To_Place: "", Route_Way: "", Distance: "0", Travel_Mode: "", Distance_Fare_Code: "", Data_From: atten_g[0].Data_From, SFC_Version_No: "",
                            SFC_Region_Code: "",
                            SFC_Category_Name: ""
                        });
                    }
                }
                if (flag_g.toUpperCase() == 'F' && Header_g[3] !== undefined && Header_g[3].Data !== undefined && Header_g[3].Data.length > 0) {
                    docAccomp_g = Header_g[3].Data;
                }

                // TP data--> if the date has WA data also
                if (Header_g[4].Data[0] !== undefined && Header_g[4].Data[0].Data !== undefined && Header_g[4].Data[0].Data != null && Header_g[4].Data[0].Data.length > 0) {
                    TP_g = Header_g[4].Data[0].Data;
                }
                // TP sfc  data--> if the date has WA data also
                if (Header_g[4].Data[1] !== undefined && Header_g[4].Data[1].Data !== undefined && Header_g[4].Data[1].Data != null && Header_g[4].Data[1].Data.length > 0) {
                    TPSFC_g = Header_g[4].Data[1].Data;
                }

                // generate json for accompanist
                var accompanist = "[";
                for (var i = 0; i < Header_g[0].Data[0].Data.length; i++) {
                    accompanist += "{label:" + '"' + "" + Header_g[0].Data[0].Data[i].Accompanist_Name + "" + '",' + "value:" + '"' + "" + Header_g[0].Data[0].Data[i].Accompanist_Region_Code + "" + '"' + "}";
                    if (i < Header_g[0].Data[0].Data.length - 1) {
                        accompanist += ",";
                    }
                }
                accompanist += "];";
                accompanistJson_g = eval(accompanist);
                fnEnableAccompanistDetails("", "ALL");

                // generate json for cp.
                if (cpNeed != "NO") {
                    var cp = "[";
                    for (var i = 0; i < Header_g[0].Data[1].Data.length; i++) {
                        cp += "{label:" + '"' + "" + Header_g[0].Data[1].Data[i].CP_No + "_" + Header_g[0].Data[1].Data[i].Region_Name + "" + '",' + "value:" + '"' + "" + Header_g[0].Data[1].Data[i].CP_Code + "" + '"' + "}";
                        if (i < Header_g[0].Data[1].Data.length - 1) {
                            cp += ",";
                        }
                    }
                    cp += "];";
                    cpJson_g = eval(cp);
                }

                //enable autofill for CP and Work Place and validation.
                if (cpNeed != "NO") {
                    // fnEnableCPDetails();
                }

                //// generate json for SFC
                fnGenerateSFCJson("LOAD");

                // generate json for travel mode.
                // var travelModeArr = new Array("BIKE", "BUS", "TRAIN", "CAR", "TAXI", "AIR", "ROAD");
                //var travelMode = "[";
                //for (var i = 0; i < travelModeArr.length; i++) {
                //    travelMode += "{label:" + '"' + "" + travelModeArr[i] + "" + '",' + "value:" + '"' + "" + travelModeArr[i] + "" + '"' + "}";
                //    if (i < travelModeArr.length - 1) {
                //        travelMode += ",";
                //    }
                //}
                //travelMode += "];";
                //travelModeJson_g = eval(travelMode);

                // Prefill Data.
                if (flag_g.toUpperCase() != "A") {
                    if (!(prefill_g[0] === undefined)) {
                        fnPrefillData();
                    }
                    else {
                        fnSetIntermediatePrivilege();
                        fnCreateAccompanistTable("N");
                        fnCreateIntermediatePlaceTable("LOAD");
                        if (prefill_g.length != 0) {
                            $("#drpWorkPlace").val(prefill_g[0].Work_Place);
                        }
                        else {
                            $("#drpWorkPlace").val('');
                        }
                    }
                }
                else {
                    fnGetAttendanceDetails();
                    if (atten_g != "") {
                        fnPrefillAttendance();
                    }
                    else {
                        fnCreateIntermediatePlaceTable("LOAD");
                        if (prefill_g.length != 0) {
                            $("#drpWorkPlace").val(prefill_g[0].Work_Place);
                        }
                        else {
                            $("#drpWorkPlace").val('');
                        }
                    }
                }



                //to remove delete icon for first row in accompansit / SFC
                // $("#spnAccomDelete_1").css('display', 'none')
                // $("#spnSFCDelete_1").css('display', 'none')

                if ($("#ddlCategory :selected").text().toUpperCase() == "HQ") {
                    $("#aAddSFC").css('display', 'none');
                }
                //to hide when the intermediate privilege not mapped to DCR
                if (intermediateNeed == "NO") {
                    $("#aAddSFC").css('display', 'none');
                }
                if (dcrStatus == "3" || dcrStatus == "0") {
                    if ($('#drpWorkPlace').val() == "0" || $('#drpWorkPlace').val() == "") {
                        $("#drpWorkPlace").val(atten_g[0].Work_Place);
                    }
                }
                fnDeleteAccSFC();
                GetDCRFreezeStatus();
                fnFreezeDCR();
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetHeaderDetails Failed.');
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}


//Function to enable accompanist details
function fnEnableAccompanistDetails(rowIndex, isAll) {
    if (isAll == "ALL") {
        var select = $('.classaccomp');
        $('option', select).remove();

        if (accompanistJson_g.length == 0) {
            $('.classaccomp').append('<option value="0" >No Accompanist found</option>');
            return;
        }

        $('.classaccomp').append('<option value="0" >Select Accompanist</option>');
        for (var i = 0; i < accompanistJson_g.length; i++) {
            $('.classaccomp').append('<option value="' + accompanistJson_g[i].value + '" >' + accompanistJson_g[i].label + '</option>');
        }

        // $('.classaccomp').blur(function () { fnGetAccompanistSFC(this) });
        // $(".classaccomp").focus(function () { fnRemoveSFC(this); });

        //Adding Accompanist SFC and CP Details
        $('.classaccomp').unbind('blur').bind('blur', function () {
            debugger;
            $.mobile.loading('show');
            fnGetAccompanistSFC(this);
            fnIncludeAccompanistCP(this);
            $.mobile.loading('hide');
        });
        //Removing accompanist SFC
        $('.classaccomp').unbind('focus').bind('focus', function () {
            debugger;
            fnRemoveSFC(this);

        });
    }
    else {
        var select = $('#drpAccompanist_' + rowIndex);
        $('option', select).remove();

        if (accompanistJson_g.length == 0) {
            $('#drpAccompanist_' + rowIndex).append('<option value="0" >No Accompanist found</option>');
            return;
        }

        $('#drpAccompanist_' + rowIndex).append('<option value="0" >Select Accompanist</option>');
        for (var i = 0; i < accompanistJson_g.length; i++) {
            $('#drpAccompanist_' + rowIndex).append('<option value="' + accompanistJson_g[i].value + '" >' + accompanistJson_g[i].label + '</option>');
        }

        $('.classaccomp').unbind('focus').bind('focus', function () {
            fnRemoveSFC(this)
        });
        // $('#drpAccompanist_' + rowIndex).blur(function () { fnGetAccompanistSFC(this) });
        // $('#drpAccompanist_' + rowIndex).change(function () { fnRemoveSFC(this); });


        ////Adding Accompanist SFC and CP Details
        $('.classaccomp').unbind('blur').bind('blur', function () {
            fnGetAccompanistSFC(this);
            fnIncludeAccompanistCP(this);
            // fnAccompanistAdd(this);
        });
        //Removing accompanist SFC
        $('.classaccomp').unbind('focus').bind('focus', function () {
            fnRemoveSFC(this);
            fnIncludeAccompanistCP(this);
        });
    }
}

function fnGetAccompanistSFC(id) {
    debugger;
    if ($(id).val() != "") {
        var row = (id.id).split('_')[1];

        $("#hdnAccompMode_" + row).val('');

        // default checked the only for doctor check box for vacan users.
        if ($('#' + id.id + " option:selected").text().indexOf('VACANT') > -1 || $('#' + id.id + " option:selected").text().indexOf('NOT ASSIGNED') > -1) {
            $("#checkbox_" + row).attr('checked', true);
            $("#checkbox_" + row).attr('disabled', true);
            $("#checkbox_" + row).checkboxradio("refresh");
        }
        else {
            $("#checkbox_" + row).attr('disabled', false);
            $("#checkbox_" + row).attr('checked', false);
            $("#checkbox_" + row).checkboxradio("refresh");
        }
        if (accompanistNeed == "YES") {
            var row = (id.id).split('_')[1];
            $.ajax({
                type: "POST",
                url: '/HiDoctor_Activity/DCRV4Header/GetSFCData',
                data: "region=" + $("#drpAccompanist_" + row).val() + "&dcrDate=" + dcrDate,
                success: function (jsonSFCresult) {

                    var jsonSFC = jsonSFCresult.data;
                    if (jsonSFC != null && jsonSFC != "") {
                        if (sfc_g == "") {

                            sfc_g = jsonSFC;

                            fnDeleteAccSFC();

                            fnGenerateSFCJson("EVENT");
                        }
                        else {
                            var sfc = jsonSFC;
                            for (var j = 0; j < sfc.length; j++) {
                                sfc_g.push(sfc[j]);
                            }

                            fnDeleteAccSFC();

                            fnGenerateSFCJson("EVENT");
                        }
                    }
                    else {
                        fnDeleteAccSFC();
                        fnGenerateSFCJson("EVENT");
                    }
                    $.mobile.loading('hide');
                }
            });
        }
    }
    else {
        fnDeleteAccSFC();
        fnGenerateSFCJson("EVENT");
    }
}

function fnRemoveSFC(id) {
    var rw = (id.id).split('_')[1];

    var isTrue = Boolean(true);
    if ($("#drpAccompanist_" + rw).val() != "") {
        for (var i = 1; i < accompRow; i++) {
            if ($("#drpAccompanist_" + i).val() != "") {
                if ($("#drpAccompanist_" + rw).val() == $("#drpAccompanist_" + i).val()) {
                    isTrue = false;
                }
            }
        }
        if (isTrue) {
            sfc_g.remove("Region_Code", $("#drpAccompanist_" + rw).val());
        }
    }
}

//Function to enable CP Details
function fnEnableCPDetails() {
    try {
        $.mobile.loading('show');
        //fnIncludeAccompanistCP();
        $('#ulCP').html('');

        for (var i = 0; i < cpJson_g.length; i++) {
            $('#ulCP').append('<li cp-value="' + cpJson_g[i].value + '" onclick="fncloseCPPopup(this)" >' + cpJson_g[i].label + '</li>');
        }
        if ($('#ulCP').hasClass("ui-listview")) {
            $('#ulCP').listview("refresh");
        }
        else {
            $('#ulCP').trigger('create');
        }
        $('#dvCPList').simpledialog2();
        $.mobile.loading('hide');
    }
    catch (e) {

        $.mobile.loading('hide');
        alert(e.message);
    }
}

function fncloseCPPopup(obj) {
    $('#txtCP').val($(obj).html());
    //alert($(obj).attr("cp-value"));
    $('#hiddenCP').val($(obj).attr("cp-value"));
    fnFillCpDetails();
    $('#dvCPList').simpledialog2('close');
}

function fnGenerateSFCJson(callFrom) {

    var regionCodeArr = new Array();

    // SFC mapped for his region will come in all the scenarios. And the DCR have no TP or drafted/Unapproved details, no if condition is satisfied.
    // because the SFC mapped for the current region only come in auto fill.
    regionCodeArr.push(currentRegion);

    if (accompanistNeed == "YES" && flag_g.toUpperCase() != "A") { // only if SHOW_ACCOMPANISTS_DATA mapped as "SFC"

        // SFC mapped for the accompanist in TP or Drafted/Unapproved and the current region will come in auto fill.
        if (prefill_g.length > 0 && prefill_g[0] != null) {
            if (prefill_g[0].Acc1_Name != "") {
                regionCodeArr.push(prefill_g[0].Acc1_Code);
            }
            if (prefill_g[0].Acc2_Name != "") {
                regionCodeArr.push(prefill_g[0].Acc2_Code);
            }
            if (prefill_g[0].Acc3_Name != "") {
                regionCodeArr.push(prefill_g[0].Acc3_Code);
            }
            if (prefill_g[0].Acc4_Name != "") {
                regionCodeArr.push(prefill_g[0].Acc4_Code);
            }
        }
    }

    // accompanist text box blur and category change event.        
    if (callFrom == "EVENT") {
        if (accompanistNeed == "YES") { // only if SHOW_ACCOMPANISTS_DATA mapped as "SFC"
            var length = $("#dvAccompanist table").length;
            for (var i = 1; i <= length ; i++) {
                if ($("#drpAccompanist_" + i).is(":visible")) {
                    if ($("#drpAccompanist_" + i).val() != "") {
                        regionCodeArr.push($("#drpAccompanist_" + i).val());
                    }
                }
            }
        }
    }
    // loop through the regionCodeArr and get the auto fill data.
    var intermediateArr = new Array();

    for (var i = 0; i < regionCodeArr.length; i++) {
        var sfcJson = "";
        // filter the auto fill based on the category selection
        if (($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) && categoryCheckNeeded == "YES") {
            sfcJson = jsonPath(sfc_g, "$.[?(@.Region_Code=='" + regionCodeArr[i] + "' & @.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
        }
        else if (regionCodeArr[i].trim() == currentRegion.trim() && categoryCheckNeeded == "NO" && ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1)) {
            sfcJson = jsonPath(sfc_g, "$.[?(@.Region_Code=='" + regionCodeArr[i] + "' & @.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
        }
        else {
            sfcJson = jsonPath(sfc_g, "$.[?(@.Region_Code=='" + regionCodeArr[i] + "')]");
        }


        if (sfcJson != false && !(sfcJson === undefined)) {
            if (sfcJson.length > 0) {
                // to get unique place.
                for (var j = 0; j < sfcJson.length; j++) {
                    // check from place
                    if (!($.inArray(sfcJson[j].From_Place, intermediateArr) > -1)) {
                        intermediateArr.push(sfcJson[j].From_Place);
                    }

                    // check to place
                    if (!($.inArray(sfcJson[j].To_Place, intermediateArr) > -1)) {
                        intermediateArr.push(sfcJson[j].To_Place);
                    }
                }
            }
        }
    }

    // generate json for work place,from place, to place.

    var intermegiate = "[";
    for (var i = 0; i < intermediateArr.length; i++) {
        intermegiate += "{label:" + '"' + "" + intermediateArr[i] + "" + '",' + "value:" + '"' + "" + intermediateArr[i] + "" + '"' + "}";
        if (i < intermediateArr.length - 1) {
            intermegiate += ",";
        }
    }
    intermegiate += "];";


    intermediate_g = eval(intermegiate);
    if (callFrom == "EVENT") {
        fnEnableSFCDetails("", true);
    }
}

//function to create SFC rows and values
function fnSFC(objData, isrouteWay, isCP, objCP, isDistanceReadOnly, hdnRouteWay, isEmpty, currentRegionName) {
    debugger;
    var tbllength = $("#dvSFC table").length;
    if (isEmpty) {
        var sfcNewHTML = "";
        sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
        $("#dvSFC").append(sfcNewHTML).trigger('create');

        fnEnableSFCDetails(parseInt(tbllength + 1), false);

        // to check numeric for distance.
        $(".clsCheckNumeric").blur(function () { return fnCheckNumeric(this) });

        //to set the currendt region Name

        var toPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + currentRegionName.toUpperCase() + "')]");
        var fromPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + currentRegionName.toUpperCase() + "')]");

        if (fromPlace != false) {
            $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(currentRegionName.toUpperCase());
            $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
        }
        else {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) == -1) {
                $("#txtFromPlace_" + parseInt(tbllength + 1)).val(currentRegionName)
            }
        }
        if (toPlace != false) {
            $("#ddlToPlace_" + parseInt(tbllength + 1)).val(currentRegionName.toUpperCase());
            $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh')
        }
        else {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) == -1) {
                $("#txtToPlace_" + parseInt(tbllength + 1)).val(currentRegionName)
            }
        }
        if (isDistanceReadOnly) {
            $("#txtDistance_" + parseInt(tbllength + 1)).attr('readOnly', 'readOnly')
        }
        ////To Populate Work Place
        //if (dcrStatus != "1") {
        //    if ($('#ddlToPlace_1').val() != "" || $('#ddlToPlace_1').val() != undefined) {
        //        $("#drpWorkPlace").val($('#ddlToPlace_1').val());
        //    }
        //    else {
        //        $('#drpWorkPlace').val($('#txtToPlace_1').val());
        //    }
        //}
        $("#hdnSFCCategory_" + parseInt(tbllength + 1)).val('HQ');
        $("#hdnSFCVersion_" + parseInt(tbllength + 1)).val('');
    }
    else {
        if (!isCP) {
            var sfcNewHTML = "";
            sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
            $("#dvSFC").append(sfcNewHTML).trigger('create');
            var rowLength = parseInt(tbllength + 1);
            fnEnableSFCDetails(parseInt(tbllength + 1), false);

            // to check numeric for distance.
            $(".clsCheckNumeric").blur(function () { return fnCheckNumeric(this) });

            //prefill the details
            if (isrouteWay == "R") {
                var toPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objData.To_Place + "')]");
                if (toPlace != false) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                }

                var fromPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objData.From_Place + "')]");
                if (fromPlace != false) {
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtToPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                }

                if (rowLength > 1) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                }

            }
            else {
                var fromPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objData.From_Place + "')]");
                if (fromPlace != false) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                }
                var toPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objData.To_Place + "')]");
                if (toPlace != false) {
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtToPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                }
                if (rowLength > 1) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                }
            }
            if (objData.Travel_Mode != null) {
                $("#ddlTravelMode_" + parseInt(tbllength + 1)).val(objData.Travel_Mode.toUpperCase());
            }
            $("#txtDistance_" + parseInt(tbllength + 1)).val(objData.Distance);

            $("#ddlTravelMode_" + parseInt(tbllength + 1)).selectmenu('refresh');

            if (hdnRouteWay != "") {
                $("#hdnRouteWay_" + parseInt(tbllength + 1)).val(hdnRouteWay);
            } else {
                $("#hdnRouteWay_" + parseInt(tbllength + 1)).val("D");
            }

            $("#hdnSFCCategory_" + parseInt(tbllength + 1)).val(objData.SFC_Category_Name);
            $("#hdnSFCRegion_" + parseInt(tbllength + 1)).val(objData.SFC_Region_Code);
            $("#hdnDistanceFareCode_" + parseInt(tbllength + 1)).val(objData.Distance_Fare_Code);

            // Change attribute Disabled to Distance based on hdnDistanceFareCode
            if ($("#hdnDistanceFareCode_" + parseInt(tbllength + 1)).val() != "") {
                $("#txtDistance_" + parseInt(tbllength + 1)).attr("disabled", "disabled");
            }

            $("#hdnSFCVersion_" + parseInt(tbllength + 1)).val(objData.SFC_Version_No);
            $("#hdnIs_TP_SFC_" + parseInt(tbllength + 1)).val(objData.Is_TP_SFC);
            //To Populate Work Place
            //if (dcrStatus != "1") {
            //    if ($('#ddlToPlace_1').val() != "" || $('#ddlToPlace_1').val() != undefined) {
            //        $("#drpWorkPlace").val($('#ddlToPlace_1').val());
            //    }
            //    else {
            //        $('#drpWorkPlace').val($('#txtToPlace_1').val());
            //    }
            //}
        }
        else {
            var sfcNewHTML = "";
            sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
            $("#dvSFC").append(sfcNewHTML).trigger('create');

            fnEnableSFCDetails(parseInt(tbllength + 1), false);

            // to check numeric for distance.
            $(".clsCheckNumeric").blur(function () { return fnCheckNumeric(this) });

            var toPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objData.To_Place + "')]");
            var fromPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objData.From_Place + "')]");

            //prefill the details
            if (isrouteWay == "R") {
                if (toPlace != false) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                }
                if (fromPlace != false) {
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtToPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                }
                if (tbllength > 1) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                }
            }
            else {
                if (fromPlace != false) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).val(objData.From_Place);
                }
                if (toPlace != false) {
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtToPlace_" + parseInt(tbllength + 1)).val(objData.To_Place);
                }
                if (rowLength > 1) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
                }
            }
            $("#ddlTravelMode_" + parseInt(tbllength + 1)).val(objData.Travel_Mode.toUpperCase());
            $("#txtDistance_" + parseInt(tbllength + 1)).val(objData.Distance);

            $("#ddlTravelMode_" + parseInt(tbllength + 1)).selectmenu('refresh');

            if (hdnRouteWay != "") {
                $("#hdnRouteWay_" + parseInt(tbllength + 1)).val(hdnRouteWay);
            }
            else {
                $("#hdnRouteWay_" + parseInt(tbllength + 1)).val("D");
            }

            $("#hdnSFCCategory_" + parseInt(tbllength + 1)).val(objData.SFC_Category_Name);
            $("#hdnSFCRegion_" + parseInt(tbllength + 1)).val(objData.SFC_Region_Code);
            $("#hdnDistanceFareCode_" + parseInt(tbllength + 1)).val(objData.Distance_Fare_Code);
            // Change attribute Disabled to Distance based on hdnDistanceFareCode
            if ($("#hdnDistanceFareCode_" + parseInt(tbllength + 1)).val() != "") {
                $("#txtDistance_" + parseInt(tbllength + 1)).attr("disabled", "disabled");
            }
            $("#hdnSFCVersion_" + parseInt(tbllength + 1)).val(objData.SFC_Version_No);
            $("#hdnIs_TP_SFC_" + parseInt(tbllength + 1)).val(objData.Is_TP_SFC);
        }
        //distance read only
        if (isDistanceReadOnly) {
            $("#txtDistance_" + parseInt(tbllength + 1)).attr('readOnly', 'readOnly')
        }


    }
    //To Populate Work Place
    //if (dcrStatus != "1") {
    //    if ($('#ddlToPlace_1').val() != "" || $('#ddlToPlace_1').val() != undefined) {
    //        $("#drpWorkPlace").val($('#ddlToPlace_1').val());
    //    }
    //    else {
    //        $('#drpWorkPlace').val($('#txtToPlace_1').val());
    //    }
    //}

}

function fnCreateIntermediatePlaceTable(isPrefill) {

    //Route complete
    var draftedIsRoute = new Boolean(false);
    // Readonly assignment for distance
    var isDisReadOnly = false;
    var hdnRouteWay = "";
    var style = "";
    if (distEdit != "" && distEdit.length > 0) {
        var distanceEditJson = jsonPath(distEdit, "$.[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");
        if (distanceEditJson.length > 0) {
            if (distanceEditJson[0].Distance_Edit == 'R') {
                isDisReadOnly = true;
            }
        }
    }

    //for tp data.
    if (dcrStatus == "1" && source != "TAB" && isPrefill == "Y") {
        var isRouteCompleteFlag = new Boolean(false);
        var tpSFCPrefill = "";
        if (prefill_g[0].Data_From == 'WA') {
            tpSFCPrefill = TPSFC_g;
        }
        else {
            tpSFCPrefill = prefillHop_g;
        }

        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text() == "HQ") {
            if (tpSFCPrefill != "" && tpSFCPrefill.length > 0) {
                //to get the route way.
                var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[0].To_Place + "' & @.To_Place == '" + tpSFCPrefill[0].From_Place + "')]");
                fnSFC(tpSFCPrefill[0], "D", false, false, isDisReadOnly, "D", false, "");
                //if (distanceJson != false) {
                //    fnSFC(tpSFCPrefill[0], "R", false, false, isDisReadOnly, "R", false, "");
                //}
                //else {
                //    fnSFC(tpSFCPrefill[0], "D", false, false, isDisReadOnly, "D", false, "");
                //}
                interRow = 2;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                fnSFC("", "", "", "", "", "", true);
                interRow = 2;
            }
        }
        else {
            if (tpSFCPrefill != "" && tpSFCPrefill.length > 0) {
                var count = tpSFCPrefill.length;
                //TP COMPLETE
                var isRouteCompleteinTP = new Boolean(false);

                var tpFrom = tpSFCPrefill[0].From_Place;
                var tpTo = tpSFCPrefill[count - 1].To_Place;

                // HOP Route Complete
                if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                        if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                            if (tpFrom == tpTo) {
                                isRouteCompleteinTP = true;
                            }

                            else {
                                isRouteCompleteFlag = true;
                            }
                        }
                    }
                }

                var i = 1;
                if (intermediateNeed == "YES") {
                    for (var k = 1; k <= count; k++) {
                        if (k == count && isRouteCompleteinTP == true && intermediateNeed == "No") { // TP data has route completed data

                            $("#lblFromPlace_Auto").html(tpSFCPrefill[k - 1].From_Place);
                            $("#lblToPlace_Auto").html(tpSFCPrefill[k - 1].To_Place);
                            $("#lblDistance_Auto").html(tpSFCPrefill[k - 1].Distance);
                            $("#lblTravelMode_Auto").html(tpSFCPrefill[k - 1].Travel_Mode);
                            $("#hdnDistanceFareCode_Auto").val(tpSFCPrefill[k - 1].Distance_Fare_Code);
                            $("#hdnSFCRegion_Auto").val(tpSFCPrefill[k - 1].SFC_Region_Code);
                            $("#hdnSFCVersion_Auto").val(tpSFCPrefill[k - 1].SFC_Version_No);
                            $("#hdnSFCCategory_Auto").val(tpSFCPrefill[k - 1].SFC_Category_Name);

                            //to get the route way.
                            var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[k - 1].From_Place + "' & @.To_Place == '" + tpSFCPrefill[k - 1].To_Place + "')]");
                            if (distanceJson != false) {
                                $("#hdnRouteWay_Auto").val("R");
                            }
                            else {
                                $("#hdnRouteWay_Auto").val("D");
                            }
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                            $("#trInterAuto").show();
                        }

                        else {
                            //to get the route way.                       
                            var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[i - 1].From_Place + "' & @.To_Place == '" + tpSFCPrefill[i - 1].To_Place + "')]");
                            fnSFC(tpSFCPrefill[i - 1], "D", false, false, isDisReadOnly, "D", false, "");
                            //if (distanceJson != false) {
                            //    fnSFC(tpSFCPrefill[i - 1], "D", false, false, isDisReadOnly, "D", false, "");
                            //}
                            //else {
                            //    fnSFC(tpSFCPrefill[i - 1], "R", false, false, isDisReadOnly, "R", false, "");
                            //}
                            i++;
                        }
                    }
                }
                else {
                    //var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[0].From_Place + "' & @.To_Place == '" + tpSFCPrefill[0].To_Place + "')]");
                    fnSFC(tpSFCPrefill[0], "D", false, false, isDisReadOnly, "D", false, "");
                    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                $("#lblFromPlace_Auto").html(tpSFCPrefill[0].To_Place);
                                $("#lblToPlace_Auto").html(tpSFCPrefill[0].From_Place);
                                $("#lblDistance_Auto").html(tpSFCPrefill[0].Distance);
                                $("#lblTravelMode_Auto").html(tpSFCPrefill[0].Travel_Mode);
                                $("#hdnDistanceFareCode_Auto").val(tpSFCPrefill[0].Distance_Fare_Code);
                                $("#hdnSFCRegion_Auto").val(tpSFCPrefill[0].SFC_Region_Code);
                                $("#hdnSFCVersion_Auto").val(tpSFCPrefill[0].SFC_Version_No);
                                $("#hdnSFCCategory_Auto").val(tpSFCPrefill[0].SFC_Category_Name);

                                //to get the route way.
                                var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[0].From_Place + "' & @.To_Place == '" + tpSFCPrefill[0].To_Place + "')]");
                                if (distanceJson != false) {
                                    $("#hdnRouteWay_Auto").val("R");
                                }
                                else {
                                    $("#hdnRouteWay_Auto").val("D");
                                }
                                $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                                $("#trInterAuto").show();
                            }
                        }
                    }
                }
                //if (isRouteCompleteinTP == false && intermediateNeed == "NO") {
                //    $("#lblFromPlace_Auto").html(tpSFCPrefill[count - 1].To_Place);
                //    $("#lblToPlace_Auto").html(tpSFCPrefill[count - 1].From_Place);
                //    $("#lblDistance_Auto").html(tpSFCPrefill[count - 1].Distance);
                //    $("#lblTravelMode_Auto").html(tpSFCPrefill[count - 1].Travel_Mode);
                //    $("#hdnDistanceFareCode_Auto").val(tpSFCPrefill[count - 1].Distance_Fare_Code);
                //    $("#hdnSFCRegion_Auto").val(tpSFCPrefill[count - 1].SFC_Region_Code);
                //    $("#hdnSFCVersion_Auto").val(tpSFCPrefill[count - 1].SFC_Version_No);
                //    $("#hdnSFCCategory_Auto").val(tpSFCPrefill[count - 1].SFC_Category_Name);

                //    //to get the route way.
                //    var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[count - 1].To_Place + "' & @.To_Place == '" + tpSFCPrefill[count - 1].From_Place + "')]");
                //    if (distanceJson != false) {
                //        $("#hdnRouteWay_Auto").val("R");
                //    }
                //    else {
                //        $("#hdnRouteWay_Auto").val("D");
                //    }
                //    $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                //    $("#trInterAuto").show();
                //}
                //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                if ($("#ddlCategory :selected").text() != "HQ" && intermediateNeed == "YES") {
                    // fnSFC("", "D", false, false, false, "", true, "");
                    interRow = parseInt(i) + 1;
                }
                else {
                    interRow = 2;
                }
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.        
                fnSFC("", "D", false, false, false, "", true, "");
                interRow = 2;
            }
        }


    }

        // for prefill data with category "HQ"
    else if ($("#ddlCategory :selected").text() == "HQ" && isPrefill == "Y") {
        if (prefill_g[0].Route_Way.toUpperCase() != "R") {
            fnSFC(prefill_g[0], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
        }
        else {
            fnSFC(prefill_g[0], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
        }
        interRow = 2;
    }

    else if (isPrefill == "Y") {
        // privilege check - "DCR_INTERMEDIATE_PLACES". if it is not mapped with the value "DCR", and the drafted value has the intermediate place, show only the frst record.
        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text() == "HQ") {
            if (prefill_g.length > 0) {
                if (prefill_g[0].Route_Way.toUpperCase() != "R") {
                    fnSFC(prefill_g[0], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                }
                else {
                    fnSFC(prefill_g[0], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                }
                interRow = 2;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                fnSFC("", "D", "", "", "", "", true, "");
                interRow = 2;
            }
        }
        else {
            if (prefillHop_g.length > 0) {
                var count = prefillHop_g.length;
                var isRouteCompleteFlag = new Boolean(false);

                //HOP Route Complete
                if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                        if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                            isRouteCompleteFlag = true;
                        }
                    }
                }
                if (isRouteCompleteFlag == true) {
                    if (intermediateNeed == "YES") {
                        for (var i = 1; i <= count; i++) {

                            if (prefillHop_g[i - 1].Route_Way.toUpperCase() != "R") {
                                fnSFC(prefillHop_g[i - 1], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                            }
                            else {
                                fnSFC(prefillHop_g[i - 1], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                            }


                        }

                    }
                    else if (intermediateNeed == "NO") {
                        var retrunRoute = 0;
                        for (var i = 1; i <= count; i++) {
                            if (prefillHop_g[i - 1].Is_Route_Complete != "Y") {

                                if (prefillHop_g[i - 1].Route_Way.toUpperCase() != "R") {
                                    fnSFC(prefillHop_g[i - 1], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");

                                }
                                else {
                                    fnSFC(prefillHop_g[i - 1], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                                    retrunRoute = 1;
                                }
                                break;
                            }
                        }

                        //Row for route complete
                        var routeCompleteJson = jsonPath(prefillHop_g, "$.[?(@.Is_Route_Complete=='Y')]");
                        if (routeCompleteJson != false && routeCompleteJson !== undefined && routeCompleteJson.length > 0) {
                            $("#lblDistance_Auto").html(routeCompleteJson[0].Distance);
                            $("#lblTravelMode_Auto").html(routeCompleteJson[0].Travel_Mode);
                            $("#hdnDistanceFareCode_Auto").val(routeCompleteJson[0].Distance_Fare_Code);
                            $("#hdnSFCRegion_Auto").val(routeCompleteJson[0].SFC_Region_Code);
                            $("#hdnSFCVersion_Auto").val(routeCompleteJson[0].SFC_Version_No);
                            $("#hdnSFCCategory_Auto").val(routeCompleteJson[0].SFC_Category_Name);


                            //to get the route way.                       
                            if (routeCompleteJson[0].Route_Way.toUpperCase() != "R") {
                                $("#hdnRouteWay_Auto").val("D");
                                $("#lblFromPlace_Auto").html(routeCompleteJson[0].From_Place);
                                $("#lblToPlace_Auto").html(routeCompleteJson[0].To_Place);
                            }
                            else {
                                $("#lblFromPlace_Auto").html(routeCompleteJson[0].To_Place);
                                $("#lblToPlace_Auto").html(routeCompleteJson[0].From_Place);
                                $("#hdnRouteWay_Auto").val("R");
                            }
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                            $("#trInterAuto").show();
                            interRow = 2;
                        }
                        else {
                            $("#lblDistance_Auto").html(prefillHop_g[0].Distance);
                            $("#lblTravelMode_Auto").html(prefillHop_g[0].Travel_Mode);
                            $("#hdnDistanceFareCode_Auto").val(prefillHop_g[0].Distance_Fare_Code);
                            $("#hdnSFCRegion_Auto").val(prefillHop_g[0].SFC_Region_Code);
                            $("#hdnSFCVersion_Auto").val(prefillHop_g[0].SFC_Version_No);
                            $("#hdnSFCCategory_Auto").val(prefillHop_g[0].SFC_Category_Name);


                            //to get the route way.                       
                            if (retrunRoute == 0) {
                                $("#hdnRouteWay_Auto").val("D");
                                $("#lblFromPlace_Auto").html(prefillHop_g[0].From_Place);
                                $("#lblToPlace_Auto").html(prefillHop_g[0].To_Place);
                            }
                            else {
                                $("#lblFromPlace_Auto").html(prefillHop_g[0].To_Place);
                                $("#lblToPlace_Auto").html(prefillHop_g[0].From_Place);
                                $("#hdnRouteWay_Auto").val("R");
                            }
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                            $("#trInterAuto").show();
                            interRow = 2;
                        }
                    }

                }
                else {
                    if (intermediateNeed == "YES") {
                        for (var i = 1; i <= count; i++) {
                            if (prefillHop_g[i - 1].Route_Way.toUpperCase() != "R") {
                                fnSFC(prefillHop_g[i - 1], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                            }
                            else {
                                fnSFC(prefillHop_g[i - 1], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                            }
                        }
                        interRow = parseInt(i);
                    }
                    else {
                        for (var i = 1; i <= 1; i++) {
                            if (prefillHop_g[i - 1].Route_Way.toUpperCase() != "R") {
                                fnSFC(prefillHop_g[i - 1], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                            }
                            else {
                                fnSFC(prefillHop_g[i - 1], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                            }
                        }
                        interRow = parseInt(i);
                    }
                }
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                fnSFC("", "D", "", "", "", "", true, "");
                interRow = 2;
            }
        }
    }
        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CP") {
        var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $('#txtCP').val().split('_')[0] + "'& @.Region_Name=='" + $('#txtCP').val().split('_')[1] + "')]");
        if (cpJson[0].Route_Way == null && cpJson[0].Route_Way == '' && cpJson[0].Route_Way.toUpperCase() != "R") {
            fnSFC(cpJson, "D", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
        }
        else {
            fnSFC(cpJson[0], "R", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
        }
        // to create extra empty row.
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text() != "HQ") {
            fnSFC("", "R", true, "", "", "", true, "");
            interRow = 3;
        }
        else {
            interRow = 2;
        }
    }
        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CPHOP") {
        var j = 1;
        var cpJson = jsonPath(cpHop_g, "$.[?(@.CP_No=='" + $('#txtCP').val().split('_')[0] + "'& @.Region_Name=='" + $('#txtCP').val().split('_')[1] + "')]");
        if (cpJson.length > 0) {
            $("#drpWorkPlace").val(cpJson[0].Work_Place);

            var isRouteCompleteFlag = new Boolean(false);
            var isRouteCompleteinCP = new Boolean(false);
            var cpFrom = ((cpJson[0].Route_Way.toUpperCase() != 'R') ? cpJson[0].From_Place : cpJson[0].To_Place);
            var cpTo = ((cpJson[cpJson.length - 1].Route_Way.toUpperCase() != 'R') ? cpJson[cpJson.length - 1].To_Place : cpJson[cpJson.length - 1].From_Place);

            // HOP Route Complete
            if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                        //if ((cpJson[0].From_Place == cpJson[cpJson.length - 1].From_Place && cpJson[0].To_Place == cpJson[cpJson.length - 1].To_Place) || (cpJson[0].From_Place == cpJson[cpJson.length - 1].To_Place && cpJson[0].To_Place == cpJson[cpJson.length - 1].From_Place)) {
                        isRouteCompleteFlag = true;
                    }
                }
            }

            if (intermediateNeed == "YES") {
                for (var i = 0; i < cpJson.length; i++) {
                    if (cpJson[i].From_Place != "") {
                        //Added for validate the NUll distance fare code
                        cpJson[i].Distance_Fare_Code = cpJson[i].Distance_Fare_Code == null ? "" : cpJson[i].Distance_Fare_Code;
                        cpJson[i].SFC_Version_No = cpJson[i].SFC_Version_No == null ? "" : cpJson[i].SFC_Version_No;

                        if (i == (cpJson.length - 1) && isRouteCompleteinCP == true && intermediateNeed == "No") { // CP data has route completed data
                            $("#lblDistance_Auto").html(cpJson[i].Distance);
                            $("#lblTravelMode_Auto").html(cpJson[i].Travel_Mode);
                            $("#hdnDistanceFareCode_Auto").val(cpJson[i].Distance_Fare_Code);
                            $("#hdnSFCRegion_Auto").val(cpJson[i].SFC_Region_Code);
                            $("#hdnSFCVersion_Auto").val(cpJson[i].SFC_Version_No);
                            $("#hdnSFCCategory_Auto").val(cpJson[i].SFC_Category_Name);


                            //to get the route way.                       
                            if (cpJson[i].Route_Way.toUpperCase() != "R") {
                                $("#hdnRouteWay_Auto").val("D");
                                $("#lblFromPlace_Auto").html(cpJson[i].From_Place);
                                $("#lblToPlace_Auto").html(cpJson[i].To_Place);
                            }
                            else {
                                $("#lblFromPlace_Auto").html(cpJson[i].To_Place);
                                $("#lblToPlace_Auto").html(cpJson[i].From_Place);
                                $("#hdnRouteWay_Auto").val("R");
                            }
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                            $("#trInterAuto").show();
                        }
                        else if (i == (cpJson.length - 1) && !isRouteCompleteinCP && intermediateNeed == "No") {
                            $("#lblDistance_Auto").html(cpJson[i].Distance);
                            $("#lblTravelMode_Auto").html(cpJson[i].Travel_Mode);
                            $("#hdnDistanceFareCode_Auto").val(cpJson[i].Distance_Fare_Code);
                            $("#hdnSFCRegion_Auto").val(cpJson[i].SFC_Region_Code);
                            $("#hdnSFCVersion_Auto").val(cpJson[i].SFC_Version_No);
                            $("#hdnSFCCategory_Auto").val(cpJson[i].SFC_Category_Name);


                            //to get the route way.                       
                            if (cpJson[i].Route_Way.toUpperCase() != "R") {
                                $("#hdnRouteWay_Auto").val("D");
                                $("#lblFromPlace_Auto").html(cpJson[i].From_Place);
                                $("#lblToPlace_Auto").html(cpJson[i].To_Place);
                            }
                            else {
                                $("#lblFromPlace_Auto").html(cpJson[i].To_Place);
                                $("#lblToPlace_Auto").html(cpJson[i].From_Place);
                                $("#hdnRouteWay_Auto").val("R");
                            }
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                            $("#trInterAuto").show();
                        }
                        else {
                            if (cpJson[i].Route_Way.toUpperCase() != "R") {
                                fnSFC(cpJson[i], "D", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
                            }
                            else {
                                fnSFC(cpJson[i], "R", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
                            }
                            j++;
                        }
                    }
                }
            }
            else {
                if (cpJson[0].Route_Way.toUpperCase() != "R") {
                    fnSFC(cpJson[0], "D", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
                }
                else {
                    fnSFC(cpJson[0], "R", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
                }
                if (isRouteCompleteFlag == true) {
                    $("#lblDistance_Auto").html(cpJson[0].Distance);
                    $("#lblTravelMode_Auto").html(cpJson[0].Travel_Mode);
                    $("#hdnDistanceFareCode_Auto").val(cpJson[0].Distance_Fare_Code);
                    $("#hdnSFCRegion_Auto").val(cpJson[0].SFC_Region_Code);
                    $("#hdnSFCVersion_Auto").val(cpJson[0].SFC_Version_No);
                    $("#hdnSFCCategory_Auto").val(cpJson[0].SFC_Category_Name);


                    //to get the route way.                       
                    if (cpJson[0].Route_Way.toUpperCase() != "R") {
                        $("#hdnRouteWay_Auto").val("D");
                        $("#lblFromPlace_Auto").html(cpJson[0].From_Place);
                        $("#lblToPlace_Auto").html(cpJson[0].To_Place);
                    }
                    else {
                        $("#lblFromPlace_Auto").html(cpJson[0].To_Place);
                        $("#lblToPlace_Auto").html(cpJson[0].From_Place);
                        $("#hdnRouteWay_Auto").val("R");
                    }
                    $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                    $("#trInterAuto").show();
                }

            }
            interRow = parseInt(j) + 1;
        }
        else {
            fnSFC("", "D", "", "", "", "", true, "");
            interRow = 2;
        }
    }
        // Page load no tp found
    else if (isPrefill == "LOAD") {
        fnSFC("", "D", "", "", isDisReadOnly, "", true, currRegionName);
        interRow = 2;
        $("#lblRCHelp").html("");
        $("#trInterAuto").hide();
    }
        // to create empty rows
    else {
        if (isPrefill == "LOAD") {
            fnSFC("", "D", "", "", "", "", true, currRegionName);
        }
        else {
            fnSFC("", "D", "", "", isDisReadOnly, "", true, "");
        }
        interRow = 2;
        $("#lblRCHelp").html("");
        $("#trInterAuto").hide();
    }

    //for tp data.
    //if (dcrStatus == "1" && source != "TAB" && isPrefill == "Y") {
    //    //HOP Route Complete
    //    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
    //        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
    //            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
    //                if (isRouteCompleteFlag == true) {
    //                    fnHOPRouteComplete("1");
    //                }
    //            }
    //        }
    //    }
    //}

    // for drafted data- route complete
    if (draftedIsRoute == true) {
        //fnHOPRouteComplete("1");
    }

    // for cp hop - route complete
    if (isPrefill == "Y_CPHOP" && isRouteCompleteFlag == true) {
        //fnHOPRouteComplete("1");
    }

    //if ($("#ddlCategory :selected").text() == "HQ") {
    //    $("#lblRCHelp").html("");
    //    $("#trInterAuto").hide();
    //}

    // check SFC Details
    fnCheckSFDatainLoad();

    $.mobile.loading('hide');
}

//function to enable SFC Details
function fnEnableSFCDetails(ctrlIndex, isEvent) {
    if (isEvent) {
        for (var s = 1; s <= $("#dvSFC table").length; s++) {
            var fromPlace = $('#ddlFromPlace_' + s).val();
            var toPlace = $('#ddlToPlace_' + s).val();
            var travelMode = $('#ddlTravelMode_' + s).val();

            var select = $('#ddlFromPlace_' + s);
            $('option', select).remove();
            var select1 = $('#ddlToPlace_' + s);
            $('option', select1).remove();
            var select2 = $('#ddlTravelMode_' + s);
            $('option', select2).remove();

            $('#ddlTravelMode_' + s).append('<option value="0" >-Select TravelMode-</option>');
            for (var i = 0; i < travelModeJson_g.length; i++) {
                $('#ddlTravelMode_' + s).append('<option value="' + travelModeJson_g[i].value + '" >' + travelModeJson_g[i].label + '</option>');
            }

            if (intermediate_g.length == 0) {
                $('#ddlFromPlace_' + s).append('<option value="0" >No SFC found</option>');
                $('#ddlToPlace_' + s).append('<option value="0" >No SFC found</option>');
                $('#ddlFromPlace_' + s).selectmenu('refresh')
                $('#ddlToPlace_' + s).selectmenu('refresh')
                return;
            }

            $('#ddlFromPlace_' + s).append('<option value="0" >Select FromPlace</option>');
            $('#ddlToPlace_' + s).append('<option value="0" >Select ToPlace</option>');
            $('#ddlTravelMode' + s).append('<option value="0" >Select TravelMode</option>');

            for (var i = 0; i < intermediate_g.length; i++) {
                $('#ddlFromPlace_' + s).append('<option value="' + intermediate_g[i].value + '" >' + intermediate_g[i].label + '</option>');

                $('#ddlToPlace_' + s).append('<option value="' + intermediate_g[i].value + '" >' + intermediate_g[i].label + '</option>');
            }


            //reselect the values
            var objtoPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + toPlace.toUpperCase() + "')]");
            var objfromPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + fromPlace.toUpperCase() + "')]");
            var objTravelMode = jsonPath(travelModeJson_g, "$.[?(@.label=='" + travelMode.toUpperCase() + "')]");
            if (objfromPlace != false) {
                $('#ddlFromPlace_' + s).val(fromPlace)
            }
            else {
                $('#ddlFromPlace_' + s).val("0")
            }
            if (objtoPlace != false) {
                $('#ddlToPlace_' + s).val(toPlace)
            }
            else {
                $('#ddlToPlace_' + s).val("0")
            }
            if (objTravelMode != false) {
                $('#ddlTravelMode_' + s).val(travelMode)
            }
            else {
                $('#ddlTravelMode_' + s).val("0")
            }
            $('#ddlFromPlace_' + s).selectmenu('refresh')
            $('#ddlToPlace_' + s).selectmenu('refresh')
            $('#ddlTravelMode_' + s).selectmenu('refresh')
        }
        //To hide the flexi text box in SFC
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
            for (var s = 1; s <= $("#dvSFC table").length; s++) {
                $("#txtFromPlace_" + s).css('display', 'none');
                $("#txtToPlace_" + s).css('display', 'none');
            }
        }
    }
    else {

        var select = $('#ddlFromPlace_' + ctrlIndex);
        $('option', select).remove();
        var select1 = $('#ddlToPlace_' + ctrlIndex);
        $('option', select1).remove();
        var select2 = $('#ddlTravelMode_' + ctrlIndex);
        $('option', select2).remove();

        $('#ddlTravelMode_' + ctrlIndex).append('<option value="0" >-Select TravelMode-</option>');
        for (var i = 0; i < travelModeJson_g.length; i++) {
            $('#ddlTravelMode_' + ctrlIndex).append('<option value="' + travelModeJson_g[i].value + '" >' + travelModeJson_g[i].label + '</option>');
        }

        if (intermediate_g.length == 0) {
            $('#ddlFromPlace_' + ctrlIndex).append('<option value="0" >No SFC found</option>');
            $('#ddlToPlace_' + ctrlIndex).append('<option value="0" >No SFC found</option>');
            $('#ddlFromPlace_' + ctrlIndex).selectmenu('refresh')
            $('#ddlToPlace_' + ctrlIndex).selectmenu('refresh')
            return;
        }

        $('#ddlFromPlace_' + ctrlIndex).append('<option value="0" >Select FromPlace</option>');
        $('#ddlToPlace_' + ctrlIndex).append('<option value="0" >Select ToPlace</option>');
        $('#ddlTravelMode' + ctrlIndex).append('<option value="0" >Select TravelMode</option>');

        for (var i = 0; i < intermediate_g.length; i++) {
            $('#ddlFromPlace_' + ctrlIndex).append('<option value="' + intermediate_g[i].value + '" >' + intermediate_g[i].label + '</option>');
            $('#ddlToPlace_' + ctrlIndex).append('<option value="' + intermediate_g[i].value + '" >' + intermediate_g[i].label + '</option>');
        }


        $('#ddlFromPlace_' + ctrlIndex).selectmenu('refresh')
        $('#ddlToPlace_' + ctrlIndex).selectmenu('refresh')
        $('#ddlTravelMode_' + ctrlIndex).selectmenu('refresh')

        //To hide the flexi text box in SFC
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
            for (var s = 1; s <= $("#dvSFC table").length; s++) {
                $("#txtFromPlace_" + s).css('display', 'none');
                $("#txtToPlace_" + s).css('display', 'none');
            }
        }
    }
    $(".clsFromPlace").unbind('change').bind('change', function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    $(".clsToPlace").unbind('change').bind('change', function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    $(".fillDist").unbind('change').bind('change', function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    $(".clsTravelMode").unbind('change').bind('change', function () { fnFillDistanceTravelMode(this.id); });
    //$(".clsFromPlace").change(function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    //$(".clsToPlace").change(function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    //$(".fillDist").change(function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    //$(".clsTravelMode").change(function () { fnFillDistanceTravelMode(this.id); });
}

//CP change
function fnFillCpDetails() {
    $("#dvSFC").empty();
    if (cpNeed == "YES" || cpNeed == "OPTIONAL") { // check the privilege value for CAMPAIGN_PLANNER
        if ($("#txtCP").val() != "") {
            if (cp_g != "" || cp_g !== undefined) {
                var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $('#txtCP').val().split('_')[0] + "'& @.Region_Name=='" + $('#txtCP').val().split('_')[1] + "')]");
                if (cpJson.length > 0) {
                    $("#ddlCategory").val(cpJson[0].Category);
                    $('#ddlCategory').selectmenu('refresh');
                    fnSetIntermediatePrivilege();
                    $('#drpWorkPlace').val(cpJson[0].Work_Place);
                    fnGenerateSFCJson("EVENT");

                    var isCPHOP = "";
                    cpJson[0].From_Place = cpJson[0].From_Place == null ? "" : cpJson[0].From_Place;

                    if ($("#ddlCategory :selected").text().toUpperCase() == "HQ") {
                        $("#aAddSFC").css('display', 'none');
                    }
                    else {
                        $("#aAddSFC").css('display', '');
                    }
                    if (intermediateNeed == "NO") {
                        $("#aAddSFC").css('display', 'none');
                    }
                    // only one from place to place in cp.                
                    if (cpJson[0].From_Place.length > 0) {
                        fnCreateIntermediatePlaceTable("Y_CP");
                    }
                        // for hop places in CP
                    else if (cpHop_g != "" && cpHop_g.length > 0 && cpJson[0].From_Place.length == 0) {
                        fnCreateIntermediatePlaceTable("Y_CPHOP");
                        isCPHOP = "YES";
                    }

                        // if the hop place and the fromplace to place in CP Master ,both are empty.
                    else {
                        sfnCreateIntermediatePlaceTable("N");
                    }

                    //HOP Route Complete
                    if (isCPHOP != "YES") {
                        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                    fnHOPRouteComplete("1");
                                }
                            }
                        }
                    }
                }
                else if (cpNeed == "OPTIONAL") {
                    fnCreateIntermediatePlaceTable("N");
                }
                else { // valid cp data check only when CAMPAIGN_PLANNER privilege set to "YES".
                    return false;
                }
            }
        }
        else {
        }
    }
}

function fnPrefillAttendance() {
    // prefill start time end time
    var startTime1 = (atten_g[0].Start_Time_Main == null) ? "" : atten_g[0].Start_Time_Main;
    var endTime1 = (atten_g[0].End_Time_Main == null) ? "" : atten_g[0].End_Time_Main;

    if (startTime1 != "" && startTime1.split(':')[1] !== undefined && startTime1.split(':')[1].split(' ')[1] !== undefined) {
        $("#ddlStartHour").val(startTime1.split(':')[0]);
        $("#ddlStartHour").selectmenu('refresh');

        $("#ddlStartMin").val(startTime1.split(':')[1].split(' ')[0]);
        $("#ddlStartMin").selectmenu('refresh');
        if ($("#ddlStartMin").val() == "") {
            $('#ddlStartMin').append('<option value="' + startTime1.split(':')[1].split(' ')[0] + '" >' + startTime1.split(':')[1].split(' ')[0] + '</option>');
            $("#ddlStartMin").val(startTime1.split(':')[1].split(' ')[0]);
            $("#ddlStartMin").selectmenu('refresh');
        }

        $("#ddlStartMode").val(startTime1.split(':')[1].split(' ')[1]);
        $("#ddlStartMode").selectmenu('refresh');
    }
    else {

        $("#ddlStartHour").val("");
        $("#ddlStartHour").selectmenu('refresh');
        $("#ddlStartMin").val("");
        $("#ddlStartMin").selectmenu('refresh');
        $("#ddlStartMode").val("");
        $("#ddlStartMode").selectmenu('refresh');
    }
    if (endTime1 != "" && endTime1.split(':')[1] !== undefined && endTime1.split(':')[1].split(' ')[1] !== undefined) {
        $("#ddlEndHour").val(endTime1.split(':')[0]);
        $("#ddlEndHour").selectmenu('refresh');

        $("#ddlEndMin").val(endTime1.split(':')[1].split(' ')[0]);
        $("#ddlEndMin").selectmenu('refresh');
        if ($("#ddlEndMin").val() == "") {
            $('#ddlEndMin').append('<option value="' + endTime1.split(':')[1].split(' ')[0] + '" >' + endTime1.split(':')[1].split(' ')[0] + '</option>');
            $("#ddlEndMin").val(endTime1.split(':')[1].split(' ')[0]);
            $("#ddlEndMin").selectmenu('refresh');
        }

        $("#ddlEndMode").val(endTime1.split(':')[1].split(' ')[1]);
        $("#ddlEndMode").selectmenu('refresh');
    }
    else {
        $("#ddlEndHour").val("");
        $("#ddlEndHour").selectmenu('refresh');
        $("#ddlEndMin").val("");
        $("#ddlEndMin").selectmenu('refresh');
        $("#ddlEndMode").val("");
        $("#ddlEndMode").selectmenu('refresh');
    }

    if (atten_g[0].Data_From != 'WA') {
        $("#ddlCategory").val(atten_g[0].Category);
        $("#ddlCategory").selectmenu('refresh');
    }
    else if (TP_g != "" && dcrStatus == "1") { // WA TP data should be prefilled
        $("#ddlCategory").val(TP_g[0].Category);
        $("#ddlCategory").selectmenu('refresh');
    }

    if (dcrStatus == "3") {// if it is not a drafted da, it might be TP data. For tp, the work place should be current region in paga load. so don update it.        
        $("#drpWorkPlace").val(atten_g[0].Work_Place);
    }
    fnSetIntermediatePrivilege();
    fnGenerateSFCJson("EVENT");
    if (atten_g[0].Data_From != 'WA') {
        fnCreateIntermediatePlaceTable("Y");
    }
    else if (TPSFC_g != "" && dcrStatus == "1") { // for WA date, if TP SFC available, it should be prefilled
        fnCreateIntermediatePlaceTable("Y");
    }
    else {
        fnCreateIntermediatePlaceTable("LOAD");
    }

    //To hide the flexi text box in SFC
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        for (var s = 1; s <= $("#dvSFC table").length; s++) {
            $("#txtFromPlace_" + s).css('display', 'none');
            $("#txtToPlace_" + s).css('display', 'none');
        }
    }
}

function fnPrefillData() {

    // prefill start time end time.
    if (prefill_g[0].Data_From != 'WA' && prefill_g[0].Data_From != 'TP') {
        var startTime1 = (prefill_g[0].Start_Time == null) ? "" : prefill_g[0].Start_Time;
        var endTime1 = (prefill_g[0].End_Time == null) ? "" : prefill_g[0].End_Time;

        if (startTime1 != "" && startTime1.split(':')[1] !== undefined && startTime1.split(':')[1].split(' ')[1] !== undefined) {
            $("#ddlStartHour").val(startTime1.split(':')[0]);
            $("#ddlStartHour").selectmenu('refresh');

            $("#ddlStartMin").val(startTime1.split(':')[1].split(' ')[0]);
            $("#ddlStartMin").selectmenu('refresh');
            if ($("#ddlStartMin").val() == "") {
                $('#ddlStartMin').append('<option value="' + startTime1.split(':')[1].split(' ')[0] + '" >' + startTime1.split(':')[1].split(' ')[0] + '</option>');
                $("#ddlStartMin").val(startTime1.split(':')[1].split(' ')[0]);
                $("#ddlStartMin").selectmenu('refresh');
            }

            $("#ddlStartMode").val(startTime1.split(':')[1].split(' ')[1]);
            $("#ddlStartMode").selectmenu('refresh');
            $("#drpWorkPlace").val(prefill_g[0].Work_Place);
        }
        else {
            $("#ddlStartHour").val("");
            $("#ddlStartHour").selectmenu('refresh');
            $("#ddlStartMin").val("");
            $("#ddlStartMin").selectmenu('refresh');
            $("#ddlStartMode").val("");
            $("#ddlStartMode").selectmenu('refresh');
        }
        if (endTime1 != "" && endTime1.split(':')[1] !== undefined && endTime1.split(':')[1].split(' ')[1] !== undefined) {
            $("#ddlEndHour").val(endTime1.split(':')[0]);
            $("#ddlEndHour").selectmenu('refresh');

            $("#ddlEndMin").val(endTime1.split(':')[1].split(' ')[0]);
            $("#ddlEndMin").selectmenu('refresh');
            if ($("#ddlEndMin").val() == "") {
                $('#ddlEndMin').append('<option value="' + endTime1.split(':')[1].split(' ')[0] + '" >' + endTime1.split(':')[1].split(' ')[0] + '</option>');
                $("#ddlEndMin").val(endTime1.split(':')[1].split(' ')[0]);
                $("#ddlEndMin").selectmenu('refresh');
            }

            $("#ddlEndMode").val(endTime1.split(':')[1].split(' ')[1]);
            $("#ddlEndMode").selectmenu('refresh');
            $("#drpWorkPlace").val(prefill_g[0].Work_Place);
        }
        else {
            $("#ddlEndHour").val("");
            $("#ddlEndHour").selectmenu('refresh');
            $("#ddlEndMin").val("");
            $("#ddlEndMin").selectmenu('refresh');
            $("#ddlEndMode").val("");
            $("#ddlEndMode").selectmenu('refresh');
        }
    }
    if (prefill_g[0].Data_From != 'WA') {
        $("#ddlCategory").val(prefill_g[0].Category);
        $("#ddlCategory").selectmenu('refresh');

        if (cpNeed != "NO") { // check the privilege value           
            var cp = prefill_g[0].CP_No == null ? "" : prefill_g[0].CP_No;
            var regionName = prefill_g[0].Region_Name == null ? "" : prefill_g[0].Region_Name;
            var cpName = cp + "_" + regionName;
            var cp_code = prefill_g[0].CP_Code == null ? "" : prefill_g[0].CP_Code;
            $('#txtCP').val(cpName);
            $('#hiddenCP').val(cp_code)
            //$("#drpCP").val(prefill_g[0].CP_Code);
            //$("#drpCP").selectmenu('refresh');
        }
    }
    else if (TP_g != "" && dcrStatus == "1") { // TP data in WA entry
        $("#ddlCategory").val(TP_g[0].Category);
        $("#ddlCategory").selectmenu('refresh');

        if (cpNeed != "NO") { // check the privilege value        
            var cp = TP_g[0].CP_No == null ? "" : TP_g[0].CP_No;
            var regionName = TP_g[0].Region_Name == null ? "" : TP_g[0].Region_Name;
            var cpName = cp + "_" + regionName;
            var cp_code = TP_g[0].CP_Code == null ? "" : TP_g[0].CP_Code;
            $('#txtCP').val(cpName);
            $('#hiddenCP').val(cp_code)

            //$("#drpCP").val(TP_g[0].CP_Code);
            //$("#drpCP").selectmenu('refresh');
        }
    }

    if (dcrStatus == "3") {// if it is not a drafted da, it might be TP data. For tp, the work place should be current region in paga load. so don update it.      
        $("#drpWorkPlace").val(prefill_g[0].Work_Place);
    }
    fnSetIntermediatePrivilege();
    fnCreateAccompanistTable("Y");

    fnGenerateSFCJson("EVENT");

    if (prefill_g[0].Data_From != 'WA') {
        fnCreateIntermediatePlaceTable("Y");
    }
    else if (TPSFC_g != "" && dcrStatus == "1") { // for WA date, if TP SFC available, it should be prefilled
        fnCreateIntermediatePlaceTable("Y");
    }
    else {
        fnCreateIntermediatePlaceTable("LOAD");
    }

    //To hide the flexi text box in SFC
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        for (var s = 1; s <= $("#dvSFC table").length; s++) {
            $("#txtFromPlace_" + s).css('display', 'none');
            $("#txtToPlace_" + s).css('display', 'none');
        }
    }
    $("#drpWorkPlace").val(prefill_g[0].Work_Place);
}



function fnAccompanistTableBind(accName, accCode, isDoctorOnly, startTime, endTime, accMode) {
    var length = $("#dvAccompanist table").length;
    if (parseInt(length) < 4) {
        var accomNewHTML = "";
        accomNewHTML = accString.replace(/DNUM/g, parseInt(length + 1));
        $("#dvAccompanist").append(accomNewHTML).trigger('create');


        $("#dvAccompanist").trigger('create');

        fnEnableAccompanistDetails(parseInt(length + 1), "");

        //check for picking the accompanist from outside of the hirerarchy
        if (accName != "") {
            var accompanist = jsonPath(accompanistJson_g, "$.[?(@.label=='" + accName + "')]");
            if (accompanist == false) {
                $('.classaccomp').append('<option value="' + accCode + '" >' + accName + '</option>');
            }
        }

        // bind Accompanist start time end time
        fnBindTimeBox("ddlStartMin_" + parseInt(length + 1));
        fnBindTimeBox("ddlEndMin_" + parseInt(length + 1));
        //prefill details
        debugger;
        if ($.trim(accName) != "") {
            // Accompanist name
            $('#drpAccompanist_' + parseInt(length + 1) + ' option').map(function () {
                if ($(this).text() == accName) return this;
            }).attr('selected', 'selected');
            $("#drpAccompanist_" + parseInt(length + 1)).selectmenu('refresh');
            // Accompanist only for doctor
            if (isDoctorOnly != null && isDoctorOnly.length > 0) {
                $("#checkbox_" + parseInt(length + 1)).attr('checked', true);
                if (accName.indexOf('VACANT') > -1 || accName.indexOf('NOT ASSIGNED') > -1) {
                    $("#checkbox_" + parseInt(length + 1)).attr('disabled', true)
                }
                $("#checkbox_" + parseInt(length + 1)).checkboxradio("refresh");
            }
            //Store acc name whare form came
            $("#div_DB_Stored_Flag_" + (length + 1)).text('1');
            // Accompanist mode of entry
            $("#hdnAccompMode_" + parseInt(length + 1)).val(accMode);
            if (accName != "" && accMode == "A") {
                $("#checkbox_" + parseInt(length + 1)).attr('disabled', true);
                $("#checkbox_" + parseInt(length + 1)).checkboxradio("refresh");

                $("#drpAccompanist_" + parseInt(length + 1)).attr('disabled', true);
                $("#drpAccompanist_" + parseInt(length + 1)).closest('div').css("background", "#A5D16C");
                $("#drpAccompanist_" + parseInt(length + 1)).selectmenu('refresh');

                $("#aAccom_" + parseInt(length + 1)).unbind();
                $("#aAccom_" + parseInt(length + 1)).css('display', 'none');

                $("#spnAccomDelete_" + parseInt(length + 1)).unbind();
                $("#spnAccomDelete_" + parseInt(length + 1)).css('display', 'none');
            }

            // this check is based on region code. if the user takes more than 1 accp in a same region and entered doctor for that accompanist or any one of the accompanist has taken as doctor accompanist
            // , both will be disabled in this screen.
            if (docAccomp_g != "" && docAccomp_g.length > 0) {

                var docAccJson = jsonPath(docAccomp_g, "$.[?(@.Acc_Region_Code=='" + accCode + "')]");
                if (docAccJson !== undefined && docAccJson != false && docAccJson.length > 0) {
                    $("#checkbox_" + parseInt(length + 1)).attr('disabled', true);
                    $("#checkbox_" + parseInt(length + 1)).checkboxradio("refresh");

                    $("#drpAccompanist_" + parseInt(length + 1)).attr('disabled', true);
                    $("#drpAccompanist_" + parseInt(length + 1)).selectmenu('refresh');

                    $("#aAccom_" + parseInt(length + 1)).unbind();
                    $("#aAccom_" + parseInt(length + 1)).css('display', 'none');

                    //$("#spnAccomDelete_" + parseInt(length + 1)).unbind();
                    //$("#spnAccomDelete_" + parseInt(length + 1)).css('display', 'none');
                }
            }

            // Start time End Time
            if (parseInt(length + 1) <= 2) {
                startTime = (startTime == null) ? "" : startTime;
                endTime = (endTime == null) ? "" : endTime;

            }
            else {
                if (startTime != "" && startTime != null) {
                    endTime = startTime.split('_')[1].toString();
                    startTime = startTime.split('_')[0].toString();
                }
            }
            if (startTime != "" && startTime.split(':')[1] !== undefined && startTime.split(':')[1].split(' ')[1] !== undefined) {
                $("#ddlStartHour_" + parseInt(length + 1)).val(startTime.split(':')[0]);
                $("#ddlStartHour_" + parseInt(length + 1)).selectmenu('refresh');

                $("#ddlStartMin_" + parseInt(length + 1)).val(startTime.split(':')[1].split(' ')[0]);
                $("#ddlStartMin_" + parseInt(length + 1)).selectmenu('refresh');
                if ($("#ddlStartMin_" + parseInt(length + 1)).val() == "") {
                    $("#ddlStartMin_" + parseInt(length + 1)).append('<option value="' + startTime.split(':')[1].split(' ')[0] + '" >' + startTime.split(':')[1].split(' ')[0] + '</option>');
                    $("#ddlStartMin_" + parseInt(length + 1)).val(startTime.split(':')[1].split(' ')[0]);
                    $("#ddlStartMin_" + parseInt(length + 1)).selectmenu('refresh');
                }

                $("#ddlStartMode_" + parseInt(length + 1)).val(startTime.split(':')[1].split(' ')[1]);
                $("#ddlStartMode_" + parseInt(length + 1)).selectmenu('refresh');
            }
            else {
                $("#ddlStartHour_" + parseInt(length + 1)).val('');
                $("#ddlStartHour_" + parseInt(length + 1)).selectmenu('refresh');
                $("#ddlStartMin_" + parseInt(length + 1)).val('');
                $("#ddlStartMin_" + parseInt(length + 1)).selectmenu('refresh');
                $("#ddlStartMode_" + parseInt(length + 1)).val('');
                $("#ddlStartMode_" + parseInt(length + 1)).selectmenu('refresh');
            }

            if (endTime != "" && endTime.split(':')[1] !== undefined && endTime.split(':')[1].split(' ')[1] !== undefined) {
                $("#ddlEndHour_" + parseInt(length + 1)).val(endTime.split(':')[0]);
                $("#ddlEndHour_" + parseInt(length + 1)).selectmenu('refresh');

                $("#ddlEndMin_" + parseInt(length + 1)).val(endTime.split(':')[1].split(' ')[0]);
                $("#ddlEndMin_" + parseInt(length + 1)).selectmenu('refresh');
                if ($("#ddlEndMin_" + parseInt(length + 1)).val() == "") {
                    $("#ddlEndMin_" + parseInt(length + 1)).append('<option value="' + endTime.split(':')[1].split(' ')[0] + '" >' + endTime.split(':')[1].split(' ')[0] + '</option>');
                    $("#ddlEndMin_" + parseInt(length + 1)).val(endTime.split(':')[1].split(' ')[0]);
                    $("#ddlEndMin_" + parseInt(length + 1)).selectmenu('refresh');
                }

                $("#ddlEndMode_" + parseInt(length + 1)).val(endTime.split(':')[1].split(' ')[1]);
                $("#ddlEndMode_" + parseInt(length + 1)).selectmenu('refresh');
            }
            else {
                $("#ddlEndHour_" + parseInt(length + 1)).val('');
                $("#ddlEndHour_" + parseInt(length + 1)).selectmenu('refresh');
                $("#ddlEndMin_" + parseInt(length + 1)).val('');
                $("#ddlEndMin_" + parseInt(length + 1)).selectmenu('refresh');
                $("#ddlEndMode_" + parseInt(length + 1)).val('');
                $("#ddlEndMode_" + parseInt(length + 1)).selectmenu('refresh');
            }
        }

    }
    if (parseInt(length) == 3) {
        $("#aAddAccomp").css('display', 'none');
    }
    else {
        $("#aAddAccomp").css('display', '');
    }

}

function fnCreateAccompanistTable(isPrefill) {
    if (flag_g != "A") {
        if (isPrefill == "Y" && prefill_g != "") {
            // for applied dcr which have TP data ,Drafted data, WA data.
            //j=[{id:'aaa',ko:'fff'},{id:'bbb',ko:'ccc'}]
            var accObj = [];
            for (var i = 1; i <= 4; i++) {
                if (i == 1 && prefill_g[0].Acc1_Name != "" && prefill_g[0].Acc1_Name != 'null') {
                    accObj.push({ accName: prefill_g[0].Acc1_Name, accCode: prefill_g[0].Acc1_Code, accOnlyDoc: prefill_g[0].Acc1_Only_For_Doctor, st: prefill_g[0].Acc1_Start_Time, et: prefill_g[0].Acc1_End_Time, accMode: prefill_g[0].Acc1_Mode_Of_Entry });
                }
                else if (i == 2 && prefill_g != "" && prefill_g[0].Acc2_Name != "" && prefill_g[0].Acc2_Name != 'null') {
                    accObj.push({ accName: prefill_g[0].Acc2_Name, accCode: prefill_g[0].Acc2_Code, accOnlyDoc: prefill_g[0].Acc2_Only_For_Doctor, st: prefill_g[0].Acc2_Start_Time, et: prefill_g[0].Acc2_End_Time, accMode: prefill_g[0].Acc2_Mode_Of_Entry });
                }
                else if (i == 3 && prefill_g != "" && prefill_g[0].Acc3_Name != "" && prefill_g[0].Acc3_Name != 'null') {
                    accObj.push({ accName: prefill_g[0].Acc3_Name, accCode: prefill_g[0].Acc3_Code, accOnlyDoc: prefill_g[0].Acc3_Only_For_Doctor, st: ((prefill_g[0].Acc3_Start_Time == null || prefill_g[0].Acc3_Start_Time == "") ? "" : prefill_g[0].Acc3_Start_Time.split('_')[0]), et: ((prefill_g[0].Acc3_Start_Time == null || prefill_g[0].Acc3_Start_Time == "") ? "" : prefill_g[0].Acc3_Start_Time.split('_')[1]), accMode: prefill_g[0].Acc3_Mode_Of_Entry });
                }
                else if (i == 4 && prefill_g != "" && prefill_g[0].Acc4_Name != "" && prefill_g[0].Acc4_Name != 'null') {
                    accObj.push({ accName: prefill_g[0].Acc4_Name, accCode: prefill_g[0].Acc4_Code, accOnlyDoc: prefill_g[0].Acc4_Only_For_Doctor, st: ((prefill_g[0].Acc4_Start_Time == null || prefill_g[0].Acc4_Start_Time == "") ? "" : prefill_g[0].Acc4_Start_Time.split('_')[0]), et: ((prefill_g[0].Acc4_Start_Time == null || prefill_g[0].Acc4_Start_Time == "") ? "" : prefill_g[0].Acc4_Start_Time.split('_')[1]), accMode: prefill_g[0].Acc4_Mode_Of_Entry });
                }
            }

            var k = 0;
            for (var k = 0; k < accObj.length; k++) {
                fnAccompanistTableBind(accObj[k].accName, accObj[k].accCode, accObj[k].accOnlyDoc, accObj[k].st, accObj[k].et, accObj[k].accMode);
            }

            if (k == 4) {
                accompRow = k + 1;
            }
            else if (k != 4 && k != 0) {
                fnAccompanistTableBind("", "", "", "", "", "");
                accompRow = parseInt(k) + 2;
            }
            else if (k == 0) {
                for (var i = 1; i <= 2; i++) {
                    fnAccompanistTableBind("", "", "", "", "", "");
                }
                accompRow = parseInt(i);
            }
        }
        else {
            for (var i = 1; i <= 2; i++) {
                fnAccompanistTableBind("", "", "", "", "", "");
            }
            accompRow = parseInt(i);
        }
    }
}

//function to create new accompanist row
function fnCreateNewRowInAccompanist() {
    debugger;
    var length = $("#dvAccompanist table:visible").length;
    var tbllength = $("#dvAccompanist table").length;
    if (parseInt(length) < 4) {
        var accomNewHTML = "";
        accomNewHTML = accString.replace(/DNUM/g, parseInt(tbllength + 1));
        $("#dvAccompanist").append(accomNewHTML).trigger('create');

        // bind Accompanist start time end time
        fnBindTimeBox("ddlStartMin_" + parseInt(tbllength + 1));
        fnBindTimeBox("ddlEndMin_" + parseInt(tbllength + 1));

        fnEnableAccompanistDetails(parseInt(tbllength + 1), "");
        fnBindTimeBox("accTimeGap");
        $("#dvAccompanist").trigger('create');

    }
    //to disable add accompanist link
    var length = $("#dvAccompanist table:visible").length;
    if (parseInt(length) == 4) {
        $("#aAddAccomp").css('display', 'none');
    }
}

//function to create new SFC Row
function fnCreateNewRowInIntermediate() {
    var tbllength = $("#dvSFC table").length;
    if (intermediateNeed == "YES" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        var sfcNewHTML = "";
        sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
        $("#dvSFC").append(sfcNewHTML).trigger('create');
        fnEnableSFCDetails(parseInt(tbllength + 1), false);
        var preToPlaceMaster = "";
        var preToPlaceFlexi = "";
        var preDistance = "";
        for (var s = $("#dvSFC table").length - 1; s >= 1; s--) {
            if ($("#divsfc_" + s).css("display") == "none") {
                continue;
            }
            else {
                if ($("#ddlToPlace_" + s + " :selected").text().length > 0 && $("#ddlToPlace_" + s + " :selected").val() != 0) {
                    preToPlaceMaster = $("#ddlToPlace_" + s + " :selected").text();
                }
                else if ($("#txtToPlace_" + s).val().length > 0) {
                    preToPlaceFlexi = $("#txtToPlace_" + s).val();
                    if ($("#txtDistance_" + s).val().length > 0) {
                        preDistance = $("#txtDistance_" + s).val();
                    }
                }
                break;
            }
        }
        $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(preToPlaceMaster);
        $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu("refresh");
        $("#txtFromPlace_" + parseInt(tbllength + 1)).val(preToPlaceFlexi);

        $("#txtDistance_" + parseInt(tbllength + 1)).val(preDistance);

        $("#ddlFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);
        $("#txtFromPlace_" + parseInt(tbllength + 1)).attr("disabled", true);



        // to check numeric for distance.
        $(".clsCheckNumeric").blur(function () { return fnCheckNumeric(this) });

        //To hide the flexi text box in SFC
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
            for (var s = 1; s <= $("#dvSFC table").length; s++) {
                $("#txtFromPlace_" + parseInt(tbllength + 1)).css('display', 'none');
                $("#txtToPlace_" + parseInt(tbllength + 1)).css('display', 'none');
            }
        }
    }

    if (distEdit.length > 0) {
        var distanceEditJson = jsonPath(distEdit, "$.[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");
        if (distanceEditJson.length > 0) {
            if (distanceEditJson[0].Distance_Edit == 'R') {
                $("#txtDistance_" + parseInt(tbllength + 1)).attr('readOnly', 'readOnly')
            }
        }
    }
    interRow++;
}

function fnHOPRouteComplete(rCnt) {
    // Only for rigid entry
    //console.log(1);
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        if ($("#ddlToPlace_" + rCnt).val() != "0" && $("#ddlFromPlace_" + rCnt).val() != "0") {

            if ($("#trInterAuto").is(":visible")) {
                $("#trInterAuto").hide();
                $("#lblRCHelp").html("");
            }

            var rowCount = 0;
            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
                if ($("#ddlFromPlace_" + j).val() != "0" || $("#ddlToPlace_" + j).val() != "0") {
                    rowCount = j;
                    break;
                }
            }
            if (rowCount == 0) {
                return false;
            }
            var autoFromPlace = "";
            var autoToPlace = "";
            for (var i = 1; i < interRow; i++) {
                //console.log($("#divsfc_" + i).is(":visible"));
                if ($("#divsfc_" + i).is(":visible")) {
                    //  console.log("autosfc");
                    //console.log($("#ddlFromPlace_" + i).val());
                    if ($("#ddlFromPlace_" + i).val() != "0") {
                        autoToPlace = $("#ddlFromPlace_" + i).val();
                        break;
                    }
                }
            }

            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
                if ($("#divsfc_" + j).is(":visible")) {
                    if ($("#ddlToPlace_" + j).val() != "0") {
                        autoFromPlace = $("#ddlToPlace_" + j).val();
                        break;
                    }
                }
            }

            // fill from and To place          
            //console.log(autoFromPlace);
            $("#lblFromPlace_Auto").html(autoFromPlace);
            $("#lblToPlace_Auto").html(autoToPlace);
            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
            $("#trInterAuto").show();

            // fill distance travell mode
            if (categoryCheckNeeded == "YES") { // sfc category check
                var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + autoFromPlace + "' & @.To_Place == '" + autoToPlace + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' ) | (@.From_Place=='" + autoToPlace + "' & @.To_Place == '" + autoFromPlace + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "'))]");
            }
            else {
                var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + autoFromPlace + "' & @.To_Place == '" + autoToPlace + "' ) | (@.From_Place=='" + autoToPlace + "' & @.To_Place == '" + autoFromPlace + "' ))]");
            }

            if (!(distanceJson === undefined) && distanceJson.length > 0) {

                if (distanceJson.length > 1) {
                    fnSFCOptionPopup(distanceJson, "Auto");
                }
                else {
                    $("#lblDistance_Auto").html(distanceJson[0].Distance);
                    $("#lblTravelMode_Auto").html(distanceJson[0].Travel_Mode);
                    $("#hdnDistanceFareCode_Auto").val(distanceJson[0].Distance_Fare_Code);
                    if (autoFromPlace == distanceJson[0].To_Place && autoToPlace == distanceJson[0].From_Place) {
                        $("#hdnRouteWay_Auto").val("R");
                    }
                    else {
                        $("#hdnRouteWay_Auto").val("D");
                    }
                    $("#hdnSFCRegion_Auto").val(distanceJson[0].SFC_Region_Code);
                    $("#hdnSFCVersion_Auto").val(distanceJson[0].SFC_Version_No);
                    $("#hdnSFCCategory_Auto").val(distanceJson[0].SFC_Category_Name);
                }
            }

                // if no from place to place combination found.
            else {
                $("#lblDistance_Auto").html("0");
                $("#lblTravelMode_Auto").html("");
                $("#hdnDistanceFareCode_Auto").val("");
                $("#hdnRouteWay_Auto").val("");
                $("#hdnSFCRegion_Auto").val("");
                $("#hdnSFCVersion_Auto").val("");
                $("#hdnSFCCategory_Auto").val("");
            }
        }
        else if ($("#ddlToPlace_" + rCnt).val() == "0" && $("#ddlFromPlace_" + rCnt).val() == "0") {

            var rowCount = 0;
            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
                if ($("#ddlFromPlace_" + j).val() != "0" || $("#ddlToPlace_" + j).val() != "0") {
                    rowCount = j;
                    break;
                }
            }
            if (rowCount == 0) {
                if ($("#trInterAuto").is(":visible")) {
                    $("#trInterAuto").hide();
                    $("#lblRCHelp").html("");
                }
            }
        }
    }
}

//function to validate header
function fnValidateHeader() {
    // for CP
    if (flag_g.toUpperCase() != "A") {
        if (cpNeed == "YES" || cpNeed == "OPTIONAL") {
            if (cpNeed == "YES") {
                if ($.trim($("#txtCP").val()).length == "0") {
                    fnMsgAlert("info", "DCR Header", "Please enter the field 'Cp No'.");
                    $("#txtCP").focus();
                    return false;
                }
                else {
                    if (cp_g.length > 0) {
                        var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $("#txtCP").val().split('_')[0] + "')]");
                        if (cpJson == null || !cpJson) {
                            fnMsgAlert("info", "DCR Header", "Please enter the valid CP No.");
                            $("#txtCP").focus();
                            return false;
                        }
                    }
                }
            }


            if (cp_g != "" && cp_g.length > 0) {
                var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $("#txtCP").val().split('_')[0] + "')]");
                if (cpJson.length > 0) {
                    if (cpJson[0].Category_Name != null && cpJson[0].Category_Name != "") {
                        if (cpJson[0].Region_Code == currentRegion) {
                            if (cpJson[0].Category_Name.toUpperCase() != $("#ddlCategory :selected").text().toUpperCase()) {
                                fnMsgAlert('info', 'DCR Header', 'The Entered CP Name "' + $("#txtCP").val().split('_')[0] + '" does not belong to category ' + $("#ddlCategory :selected").text() + ' . Please check the CP master for correct CP Name.');
                                //$.msgbox('The Entered CP No "' + $("#CP_No").val() + '" does not belong to category ' + $("#ddlCategory :selected").text() + ' . Please check the CP master for correct CP No.');
                                return false;
                            }
                        }
                    }
                }
            }

        }
        // end CP
    }

    // Mandatory fields check.
    if ($("#drpWorkPlace").val() == "") {

        fnMsgAlert("info", "DCR Header", "Please enter the field 'Work Place'. ");
        return false;
    }

    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#drpWorkPlace"))) {
        fnMsgAlert('info', 'Information', 'Please remove the special characters in Work Place.The following characters are only allowed _().');

        return false;
    }

    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        if ($("#ddlFromPlace_1").val() == "0") {
            fnMsgAlert("info", "DCR Header", "Please select the field 'From Place'. ");
            $("#ddlFromPlace_1").focus();
            $("#txtFromPlace").focus();
            return false;
        }
    }

    // for all the category, atleast one record is mandatory for the following fields.
    if ($("#ddlFromPlace_1").val() == "0") {
        if ($("#txtFromPlace_1").val() == "") {
            fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
            $("#ddlFromPlace_1").focus();
            $("#txtFromPlace").focus();
            return false;
        }

        if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#txtFromPlace_1"))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters in From Place.The following characters are only allowed _().');
            $("#txtFromPlace_1").focus();
            return false;
        }
    }

    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        if ($("#ddlToPlace_1").val() == "0") {
            fnMsgAlert("info", "DCR Header", "Please select the field 'To Place'. ");
            $("#ddlToPlace_1").focus();
            $("#txtToPlace").focus();
            return false;
        }
    }

    if ($("#ddlToPlace_1").val() == "0") {
        if ($("#txtToPlace_1").val() == "") {
            fnMsgAlert("info", "DCR Header", "Please enter the field 'To Place'. ");
            $("#ddlToPlace_1").focus();
            $("#txtToPlace").focus();
            return false;
        }

        if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#txtToPlace_1"))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters in to Place.The following characters are only allowed _().');
            $("#txtToPlace").focus();
            return false;
        }
    }
    if ($("#txtDistance_1").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'Distance'. ");
        $("#txtDistance_1").focus();
        return false;
    }
    if ($("#ddlTravelMode_1").val() == "0") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'Travel Mode'. ");
        $("#ddlTravelMode_1").focus();
        return false;
    }

    // for categories other than HQ have the intermediate record. validation for that fields.
    if ($("#ddlCategory :selected").text() != "HQ") {
        for (var i = 1; i <= $("#dvSFC table").length; i++) {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
                if ($("#ddlFromPlace_" + i).is(":visible")) {
                    if ($("#ddlFromPlace_" + i).val() != "0" || $("#ddlToPlace_" + i).val() != "0") {
                        // empty check
                        if ($("#ddlFromPlace_" + i).val() == "0") {
                            //  if ($("#txtFromPlace_" + i).val() == "") {
                            fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
                            $("#ddlFromPlace_" + i).focus();
                            $("#txtFromPlace_" + i).focus();
                            return false;
                            //}
                        }
                        if ($("#ddlToPlace_" + i).val() == "0") {
                            // if ($("#txtToPlace_" + i).val() == "") {
                            fnMsgAlert("info", "DCR Header", "Please enter the field 'To Place'. ");
                            $("#ddlToPlace_" + i).focus();
                            $("#txtToPlace_" + i).focus();
                            return false;
                            // }
                        }
                        if ($("#txtDistance_" + i).val() == "") {
                            fnMsgAlert("info", "DCR Header", "Please enter the field 'Distance'. ");
                            $("#txtDistance_" + i).focus();
                            return false;
                        }
                        if ($("#ddlTravelMode_" + i).val() == "0") {
                            fnMsgAlert("info", "DCR Header", "Please enter the field 'Travel Mode'. ");
                            $("#ddlTravelMode_" + i).focus();
                            return false;
                        }
                    }
                }
            }
            else {
                if ($("#ddlFromPlace_" + i).is(":visible")) {
                    if ($("#ddlFromPlace_" + i).val() != "0" || $("#ddlToPlace_" + i).val() != "0" || $("#txtFromPlace_" + i).val() != "" || $("#txtToPlace_" + i).val() != "") {
                        // empty check
                        if ($("#ddlFromPlace_" + i).val() == "0") {
                            if ($("#txtFromPlace_" + i).val() == "") {
                                fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
                                $("#ddlFromPlace_" + i).focus();
                                $("#txtFromPlace_" + i).focus();
                                return false;
                            }


                            if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#txtFromPlace_" + i))) {
                                fnMsgAlert('info', 'Information', 'Please remove the special characters in from Place.The following characters are only allowed _().');
                                $("#txtFromPlace_" + i).focus();
                                return false;
                            }

                        }
                        if ($("#ddlToPlace_" + i).val() == "0") {
                            if ($("#txtToPlace_" + i).val() == "") {
                                fnMsgAlert("info", "DCR Header", "Please enter the field 'To Place'. ");
                                $("#ddlToPlace_" + i).focus();
                                $("#txtToPlace_" + i).focus();
                                return false;
                            }

                            if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#txtToPlace_" + i))) {
                                fnMsgAlert('info', 'Information', 'Please remove the special characters in to Place.The following characters are only allowed _().');
                                $("#txtToPlace_" + i).focus();
                                return false;
                            }

                        }
                        if ($("#txtDistance_" + i).val() == "") {
                            fnMsgAlert("info", "DCR Header", "Please enter the field 'Distance'. ");
                            $("#txtDistance_" + i).focus();
                            return false;
                        }
                        if ($("#ddlTravelMode_" + i).val() == "0") {
                            fnMsgAlert("info", "DCR Header", "Please enter the field 'Travel Mode'. ");
                            $("#ddlTravelMode_" + i).focus();
                            return false;
                        }

                    }
                }
            }
        }
    }
    // sfc validation.

    for (var i = 1; i <= $("#dvSFC table").length; i++) {
        if ($("#ddlFromPlace_" + i).is(":visible")) {
            if ($("#ddlFromPlace_" + i).val() != "0") {
                fromPlace = $("#ddlFromPlace_" + i).val();
                toPlace = $("#ddlToPlace_" + i).val();
                var len = $("#dvSFC table").length;
                for (var j = 1; j <= len; j++) {
                    if ($("#ddlFromPlace_" + j).is(":visible")) {
                        var fp = $("#ddlFromPlace_" + j).val();
                        var tp = $("#ddlToPlace_" + j).val();


                        if (fromPlace == fp && toPlace == tp && i != j) {

                            fnMsgAlert('info', 'DCR Header', "Duplicate From & To Place exist in Place details. Please remove one then click Save.");
                            return false;
                        }

                    }
                }
            }
        }
    }
    for (var i = 1; i <= $("#dvSFC table").length; i++) {

        if ($("#divsfc_" + i).is(":visible")) {
            if ($("#ddlFromPlace_" + i).val() != "0") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (sfc_g != "" || !(sfc_g === undefined)) {

                        var fromPlaceVal = "";
                        var toPlaceVal = "";

                        if ($("#ddlFromPlace_" + i).val() != "0") {
                            fromPlaceVal = $("#ddlFromPlace_" + i).val();
                        }
                        else {
                            fromPlaceVal = $("#txtFromPlace_" + i).val();
                        }

                        if ($("#ddlToPlace_" + i).val() != "0") {
                            toPlaceVal = $("#ddlToPlace_" + i).val();
                        }
                        else {
                            toPlaceVal = $("#txtToPlace_" + i).val();
                        }

                        if (categoryCheckNeeded == "YES") { // sfc category check
                            var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + fromPlaceVal
                                                               + "' & @.To_Place == '" + toPlaceVal
                                                               + "' & @.Travel_Mode == '" + $("#ddlTravelMode_" + i).val()
                                                               + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                               + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val()
                                                               + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_" + i).val()
                                                               + "' ) | (@.From_Place=='" + toPlaceVal
                                                                  + "' & @.To_Place == '" + fromPlaceVal
                                                                  + "' & @.Travel_Mode == '" + $("#ddlTravelMode_" + i).val()
                                                                  + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                                  + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val()
                                                                  + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_" + i).val() + "'))]");
                        }
                        else {
                            var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + fromPlaceVal
                                                               + "' & @.To_Place == '" + toPlaceVal
                                                               + "' & @.Travel_Mode == '" + $("#ddlTravelMode_" + i).val()
                                                               + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                               + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val()
                                                               + "') | (@.From_Place=='" + toPlaceVal
                                                                 + "' & @.To_Place == '" + fromPlaceVal
                                                                 + "' & @.Travel_Mode == '" + $("#ddlTravelMode_" + i).val()
                                                                 + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                                 + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val() + "'))]");
                        }
                        if (!distanceJson) {
                            //if (distanceJson == null || !distanceJson || distanceJson.length <= 0) {
                            fnMsgAlert('info', 'DCR Header', 'One of the required route is not defined in SFC Master.Request you to contact the salesadmin to continue with DCR.');
                            $("#txtToPlace_" + i).focus();
                            $("#txtFromPlace_" + i).focus();
                            return false;
                        }
                    }
                }
            }
        }
    }

    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (intermediateNeed == "NO" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                if ($("#trInterAuto").is(":visible")) {

                    //// to check route complete
                    //routeCompleteValid += $("#lblFromPlace_Auto").html() + "^^";
                    //routeCompleteValid += $("#lblToPlace_Auto").html() + "^^";

                    if (sfc_g != "") {
                        var distanceJson = "";
                        if (categoryCheckNeeded == "YES") { // sfc category check
                            distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#lblFromPlace_Auto").html()
                                                              + "' & @.To_Place == '" + $("#lblToPlace_Auto").html()
                                                              + "' & @.Travel_Mode == '" + $("#lblTravelMode_Auto").html()
                                                              + "' & @.Distance == '" + $("#lblDistance_Auto").html()
                                                              + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_Auto").val()
                                                              + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_Auto").val()
                                                              + "' ) | (@.From_Place=='" + $("#lblToPlace_Auto").html()
                                                                 + "' & @.To_Place == '" + $("#lblFromPlace_Auto").html()
                                                                 + "' & @.Travel_Mode == '" + $("#lblTravelMode_Auto").html()
                                                                 + "' & @.Distance == '" + $("#lblDistance_Auto").html()
                                                                 + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_Auto").val()
                                                                 + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_Auto").val() + "'))]");
                        }
                        else {
                            distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#lblFromPlace_Auto").html()
                                                              + "' & @.To_Place == '" + $("#lblToPlace_Auto").html()
                                                              + "' & @.Travel_Mode == '" + $("#lblTravelMode_Auto").html()
                                                              + "' & @.Distance == '" + $("#lblDistance_Auto").html()
                                                              + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_Auto").val()
                                                              + "') | (@.From_Place=='" + $("#lblToPlace_Auto").html()
                                                                + "' & @.To_Place == '" + $("#lblFromPlace_Auto").html()
                                                                + "' & @.Travel_Mode == '" + $("#lblTravelMode_Auto").html()
                                                                + "' & @.Distance == '" + $("#lblDistance_Auto").html()
                                                                + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_Auto").val() + "'))]");
                        }

                        if (distanceJson == null || !distanceJson || distanceJson.length <= 0) {
                            fnMsgAlert('info', 'DCR Header', 'One of the required route is not defined in SFC Master.Request you to contact the salesadmin to continue with DCR.');
                            $("#lblFromPlace_Auto").css('color', 'coral !important');
                            $("#lblToPlace_Auto").css('color', 'coral !important');
                            $("#lblDistance_Auto").css('color', 'coral !important');
                            return false;
                        }
                    }
                }
            }
        }
    }

    if (intermediateNeed == "YES" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        for (var i = 1; i <= $("#dvSFC table").length; i++) {
            if ($("#ddlFromPlace_" + i).is(":visible")) {
                var nxtRowNo = fnGetNextRow(i);
                if ($("#ddlFromPlace_" + nxtRowNo).length > 0) {
                    toPlaceTxt = fnGetToPlaceText(i);//$("#ddlToPlace_" + i + " :selected").text();

                    var fromPlaceTxt = fnGetFromPlaceText(nxtRowNo); //$("#ddlFromPlace_" + nxtRowNo + " :selected").text();
                    if (fromPlaceTxt != toPlaceTxt) {
                        alert("Dear user, The Row no: " + nxtRowNo + " FromPlace and Row no:" + i + " To Place does not matched. Please correct then continue your DCR.");
                        return false;
                    }
                }
            }
        }
    }

    if ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1 && $.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1 && $("#ddlCategory :selected").text().toUpperCase() != "HQ") { // SFC_VALIDATION privilege check.
        if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
            var FrmPlaceArray = new Array()
            FrmPlaceArray.clear();
            var ToPlaceArray = new Array()
            ToPlaceArray.clear();
            for (var i = 1; i <= $("#dvSFC table").length; i++) {
                if ($("#ddlFromPlace_" + i).is(":visible")) {
                    if ($("#ddlFromPlace_" + i).val() != "0" && $("#ddlToPlace_" + i).val() != "0") {
                        if ($("#ddlFromPlace_" + i).length > 0) {
                            FrmPlaceArray.push($("#ddlFromPlace_" + i + " :selected").text());
                            ToPlaceArray.push($("#ddlToPlace_" + i + " :selected").text());
                        }
                    }
                }
            }



            if (FrmPlaceArray.length > 0) {
                if (intermediateNeed == "YES") {
                    for (var k = 0; k < FrmPlaceArray.length; k++) {
                        if ($.inArray(FrmPlaceArray[k], ToPlaceArray) == -1) {
                            alert("Dear User, As Circle Route Completion is enabled, all the routes entered in SFC needs to be completed.");
                            return false;
                        }
                    }

                    for (var t = 0; t < ToPlaceArray.length; t++) {
                        if ($.inArray(ToPlaceArray[t], FrmPlaceArray) == -1) {
                            alert("Dear User, As Circle Route Completion is enabled, all the routes entered in SFC needs to be completed.");
                            return false;
                        }
                    }
                }

                var FromPlaceObj = ArrayToJSonWithCount(FrmPlaceArray);
                var toPlaceObj = ArrayToJSonWithCount(ToPlaceArray);

                for (var p = 0; p < FromPlaceObj.length; p++) {
                    for (var q = 0; q < toPlaceObj.length; q++) {
                        if (FromPlaceObj[p].value == toPlaceObj[q].value) {
                            if (FromPlaceObj[p].count != toPlaceObj[q].count) {
                                alert("Dear User, As Circle Route Completion is enabled, all the routes entered in SFC needs to be completed.");
                                return false;
                            }
                        }
                    }

                }
            }
        }
    }




    // sfc validation end.
    // accompnist validation
    if (flag_g.toUpperCase() != "A") {
        var accompcount = 0;
        var accArr = [];
        for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
            if ($("#dvAccomp_" + i).is(":visible")) {
                if ($("#drpAccompanist_" + i).val() != "0") {
                    // Start Time and End Time Madatory validation.

                    if ($('#ddlStartHour_' + i).val() != "") {
                        if ($('#ddlStartMin_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the mintues in start time for accompanist " + $("#drpAccompanist_" + i + " :selected").text());
                            return false;
                        }
                    }
                    if ($('#ddlStartMin_' + i).val() != "") {
                        if ($('#ddlStartHour_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the hours in start time for accompanist " + $("#drpAccompanist_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlEndHour_' + i).val() != "") {
                        if ($('#ddlEndMin_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the mintues in end time for accompanist " + $("#drpAccompanist_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlEndMin_' + i).val() != "") {
                        if ($('#ddlEndHour_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the hours in end time for accompanist " + $("#drpAccompanist_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlEndHour_' + i).val() != "" || $('#ddlEndMin_' + i).val() != "") {
                        if ($('#ddlStartHour_' + i).val() == "" || $('#ddlStartMin_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please enter the start time for accompanist " + $("#drpAccompanist_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlStartHour_' + i).val() != "" || $('#ddlStartMin_' + i).val() != "") {
                        if ($('#ddlEndHour_' + i).val() == "" || $('#ddlEndMin_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please enter the end time for accompanist " + $("#drpAccompanist_" + i + " :selected").text());
                            return false;
                        }
                    }


                    var tempStart = "", tempEnd = "";
                    if ($('#ddlStartHour_' + i).val() != "") {
                        tempStart = $('#ddlStartHour_' + i).val() + ":" + $('#ddlStartMin_' + i).val() + " " + $('#ddlStartMode_' + i).val();
                        tempEnd = $('#ddlEndHour_' + i).val() + ":" + $('#ddlEndMin_' + i).val() + " " + $('#ddlEndMode_' + i).val();
                    }

                    if (tempStart.length > 0 && tempEnd.length > 0) {
                        if (Date.parse("2001/01/01 " + tempStart) > Date.parse("2001/01/01 " + tempEnd)) {
                            fnMsgAlert('info', 'DCR Header', "Start time cannot be greater than end time.");
                            $('#ddlStartHour_' + i).focus();
                            return false;
                        }
                    }

                    // Check for name repeatation
                    if ($.inArray($("#drpAccompanist_" + i + " :selected").text(), accArr) > -1) {
                        fnMsgAlert('info', 'DCR Header', 'The accompanist name ' + $("#drpAccompanist_" + i + " :selected").text() + ' is entered more than one time. It is not allowed.');
                        $("#drpAccompanist_" + i).focus();
                        return false;
                    }
                    accArr.push($("#drpAccompanist_" + i + " :selected").text());
                    accompcount++;
                }
            }
        }
        if (accMandatory != 0) {
            if (accompcount < accMandatory) { // DCR_ACCOMPANIST_MANDATORY privilege check.
                fnMsgAlert('info', 'DCR Header', 'Please enter atleast ' + accMandatory + ' accompanist name(s).');
                return false;
            }
        }
    }
    // accompanist validation end
    // Time validation
    var dcrtimeMandatory = fnGetPrivilegeValue("DCR_WORK_TIME_MANDATORY", "OPTIONAL");
    if (dcrtimeMandatory == "MANDATORY") {
        if ($('#ddlStartHour').val() == "") {
            fnMsgAlert('info', 'DCR Header', 'Please choose hour in From Time.');
            return false;
        }
        if ($('#ddlStartMin').val() == "") {
            fnMsgAlert('info', 'DCR Header', 'Please choose mintues in From Time.');
            return false;
        }
        if ($('#ddlEndHour').val() == "") {
            fnMsgAlert('info', 'DCR Header', 'Please choose the hour in To Time.');
            return false;
        }
        if ($('#ddlEndMin').val() == "") {
            fnMsgAlert('info', 'DCR Header', 'Please choose the minutes in To Time.');
            return false;
        }
    }
    else {

        if ($('#ddlStartHour').val() != '') {
            if ($('#ddlStartMin').val() == "") {
                fnMsgAlert('info', 'DCR Header', "Please choose the minutes in From Time.");
                return false;
            }
        }
        if ($('#ddlStartMin').val() != '') {
            if ($('#ddlStartHour').val() == "") {
                fnMsgAlert('info', 'DCR Header', "Please choose the hours in From Time.");
                return false;
            }
        }

        if ($('#ddlEndHour').val() != '') {
            if ($('#ddlEndMin').val() == "") {
                fnMsgAlert('info', 'DCR Header', "Please choose the minutes in To Time.");
                return false;
            }
        }
        if ($('#ddlEndMin').val() != '') {
            if ($('#ddlEndHour').val() == "") {
                fnMsgAlert('info', 'DCR Header', "Please choose the hours in To Time.");
                return false;
            }
        }

        if ($('#ddlEndHour').val() != "" || $('#ddlEndMin').val() != "") {
            if ($('#ddlStartHour').val() == "" || $('#ddlStartMin').val() == "") {
                fnMsgAlert('info', 'DCR Header', "Please choose the From Time.");
                return false;
            }
        }

        if ($('#ddlStartHour').val() != "" || $('#ddlStartMin').val() != "") {
            if ($('#ddlEndHour').val() == "" || $('#ddlEndMin').val() == "") {
                fnMsgAlert('info', 'DCR Header', "Please choose the To Time.");
                return false;
            }
        }



    }

    var tempStartMain = "", tempEndMain = "";
    if ($('#ddlStartHour').val() != "") {
        tempStartMain = $('#ddlStartHour').val() + ":" + $('#ddlStartMin').val() + " " + $('#ddlStartMode').val();
        tempEndMain = $('#ddlEndHour').val() + ":" + $('#ddlEndMin').val() + " " + $('#ddlEndMode').val();
    }

    if (tempStartMain.length > 0 && tempEndMain.length > 0) {
        if (Date.parse("2001/01/01 " + tempStartMain) > Date.parse("2001/01/01 " + tempEndMain)) {
            fnMsgAlert('info', 'DCR Header', "Start time cannot be greater than end time.");
            $('#ddlStartHour').focus();
            return false;
        }
    }


    if (flag_g.toUpperCase() == "A") {
        var rowLength = $('#dvActivity table').length;
        var cntActive = 0;
        for (var i = 1; i <= rowLength; i++) {
            if ($("#divactivity_" + i).is(":visible")) {
                if ($.trim($('#drpactivity_' + i.toString()).val()) != "0") {
                    cntActive = parseInt(cntActive) + 1;
                    var entryCount = 0;
                    for (j = 1; j <= rowLength; j++) {
                        if ($("#divactivity_" + j).is(":visible")) {
                            if ($.trim($('#drpactivity_' + i.toString()).val()) == $.trim($('#drpactivity_' + j.toString()).val())) {
                                entryCount++;
                                if (entryCount > 1) {
                                    fnMsgAlert('info', 'DCR Header', "The activity " + $.trim($('#drpactivity_' + j.toString() + ' :selected').text()) + " has multiple entries.");
                                    return false;
                                }
                            }
                        }
                    }


                    // Start Time and End Time Madatory validation.

                    if ($('#ddlActStartHour_' + i).val() == "" && $('#ddlActStartMin_' + i).val() == "" && $('#ddlActStartMode_' + i).val() == "") {
                        fnMsgAlert('info', 'DCR Header', "Please choose the start time for the activity " + $("#drpactivity_" + i + " :selected").text());
                        return false;
                    }
                    else {
                        if ($('#ddlActStartHour_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the start hour for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                        else if ($('#ddlActStartMin_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the start minitue for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                        else if ($('#ddlActStartMode_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the start mode for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlActEndHour_' + i).val() == "" && $('#ddlActEndMin_' + i).val() == "" && $('#ddlActEndMode_' + i).val() == "") {
                        fnMsgAlert('info', 'DCR Header', "Please choose the end time for the activity " + $("#drpactivity_" + i + " :selected").text());
                        return false;
                    }
                    else {
                        if ($('#ddlActEndHour_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the end hour for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                        else if ($('#ddlActEndMin_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the end minitue for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                        else if ($('#ddlActEndMode_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please choose the end mode for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlActEndHour_' + i).val() != "" || $('#ddlActEndMin_' + i).val() != "" || $('#ddlActEndMode_' + i).val() != "") {
                        if ($('#ddlActStartHour_' + i).val() == "" || $('#ddlActStartMin_' + i).val() == "" || $('#ddlActStartMode_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please enter the start time for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                    }

                    if ($('#ddlActStartHour_' + i).val() != "" || $('#ddlActStartMin_' + i).val() != "" || $('#ddlActStartMode_' + i).val() != "") {
                        if ($('#ddlActEndHour_' + i).val() == "" || $('#ddlActEndMin_' + i).val() == "" || $('#ddlActEndMode_' + i).val() == "") {
                            fnMsgAlert('info', 'DCR Header', "Please enter the end time for the activity " + $("#drpactivity_" + i + " :selected").text());
                            return false;
                        }
                    }

                    var tempStart = "", tempEnd = "";
                    if ($('#ddlActStartHour_' + i).val() != "") {
                        tempStart = $('#ddlActStartHour_' + i).val() + ":" + $('#ddlActStartMin_' + i).val() + " " + $('#ddlActStartMode_' + i).val();
                        tempEnd = $('#ddlActEndHour_' + i).val() + ":" + $('#ddlActEndMin_' + i).val() + " " + $('#ddlActEndMode_' + i).val();
                    }

                    if (tempStart.length > 0 && tempEnd.length > 0) {
                        if (Date.parse("2001/01/01 " + tempStart) > Date.parse("2001/01/01 " + tempEnd)) {
                            fnMsgAlert('info', 'DCR Header', "Start time cannot be greater than end time.");
                            $('#ddlActStartHour_' + i).focus();
                            return false;
                        }
                    }

                    if ($.trim($('#txtRemarks_' + i.toString()).val()).length > 0) {
                        if (!(fnCheckRemarksSpecialCharforDCR("#txtRemarks_" + i))) {
                            return false;
                        }
                        //if (!(fnCheckRemarksSpecialChar("#txtRemarks_" + i))) {
                        //    fnMsgAlert('info', 'DCR Header', "Please remove remarks special character for the activity " + $("#txtactivity_" + i + " :selected").text());
                        //    return false;
                        //}
                        if ($.trim($('#txtRemarks_' + i.toString()).val()).length > 500) {
                            fnMsgAlert('info', 'DCR Header', 'You have entered more then 500 character in remarks. That is not allowed.');
                            return false;
                        }
                    }

                }

                if (cntActive == 0) {
                    fnMsgAlert('info', 'DCR Header', 'Please Enter atleast one activity.');
                    return false;
                }
            }
        }
    }

    return true;
}


function fnSubmitHeader() {
    if ($('#drpWorkPlace').val() == "0" || $('#drpWorkPlace').val() == "") {
        if ($('#ddlToPlace_1').val() != "" && $('#ddlToPlace_1').val() != "0") {
            $("#drpWorkPlace").val($('#ddlToPlace_1').val());
        }
        else {
            $('#drpWorkPlace').val($('#txtToPlace_1').val());
        }
    }
    var isTrue = Boolean(true);
    isTrue = fnValidateHeader();
    if (isTrue) {
        var cpCode = "null", cpName = "null", workPlace = "null", fromPlace = "null", toPlace = "null", travelMode = "null", distance = "null", startTime = "null", endTime = "null", distanceFareCode = "null", routeWay = "null";
        var acc1Name = "null", acc1Type = "null", acc1StartTime = "null", acc1EndTime = "null", acc1OnlyDoctor = "", acc1Mode = "null";
        var acc2Name = "null", acc2Type = "null", acc2StartTime = "null", acc2EndTime = "null", acc2OnlyDoctor = "", acc2Mode = "null";
        var acc3Name = "null", acc3Time = "null", acc3OnlyDoctor = "", acc3Mode = "null";
        var acc4Name = "null", acc4Time = "null", acc4OnlyDoctor = "", acc4Mode = "null";
        var sfcRegionCode = "null", sfcVersionNo = "null", sfcCategoryName = "";
        var category = "", entityCode = "";
        var intermediateData = "";

        // get CP values
        if (flag_g.toUpperCase() != "A") {
            if (cpNeed == "YES") {
                cpCode = $("#hiddenCP").val();
                cpName = $("#txtCP").val().split('_')[0];
            }
            else if (cpNeed == "OPTIONAL") {
                if ($("#hdnCPCode").val() != "") {
                    cpCode = $("#hiddenCP").val();
                    cpName = $("#txtCP").val().split('_')[0];
                }
                else {
                    cpCode = $("#hiddenCP").val();
                    cpName = $("#txtCP").val().split('_')[0];
                }
            }
        }

        //get other text box values.  
        workPlace = $("#drpWorkPlace").val();

        if ($('#ddlStartHour').val() != "") {
            startTime = $('#ddlStartHour').val() + ":" + $('#ddlStartMin').val() + " " + $('#ddlStartMode').val();
            endTime = $('#ddlEndHour').val() + ":" + $('#ddlEndMin').val() + " " + $('#ddlEndMode').val();
        }
        category = $("#ddlCategory :selected").text();
        entityCode = $("#ddlCategory").val();

        // get Place Values
        if (category == "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) == -1) {
                if ($("#ddlFromPlace_1").val() == "0") {
                    fromPlace = $("#txtFromPlace_1").val();
                }
                else {
                    fromPlace = $("#ddlFromPlace_1").val();
                }
                if ($("#ddlToPlace_1").val() == "0") {
                    toPlace = $("#txtToPlace_1").val();
                }
                else {
                    toPlace = $("#ddlToPlace_1").val();
                }
            }
            else {
                fromPlace = $("#ddlFromPlace_1").val();
                toPlace = $("#ddlToPlace_1").val();
            }

            distance = $("#txtDistance_1").val();
            travelMode = $("#ddlTravelMode_1").val();
            if ($("#hdnDistanceFareCode_1").val() != "") {
                distanceFareCode = $("#hdnDistanceFareCode_1").val();
            }
            if ($("#hdnRouteWay_1").val() != "") {
                routeWay = $("#hdnRouteWay_1").val();
            }
            sfcRegionCode = $("#hdnSFCRegion_1").val();
            sfcVersionNo = $("#hdnSFCVersion_1").val();
            sfcCategoryName = $("#hdnSFCCategory_1").val();
        }
        else {

            intermediateData = fnReadIntermediateData();
            var travelKm = 0;
            for (var i = 1; i <= $("#dvSFC table").length; i++) {
                if ($("#ddlFromPlace_" + i).is(":visible")) {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) == -1) {
                        if ($("#ddlFromPlace_" + i).val() != "0" || $("#txtFromPlace_" + i).val() != "") {
                            travelKm += parseInt($("#txtDistance_" + i).val());
                        }
                    }
                    else {
                        if ($("#ddlFromPlace_" + i).val() != "0") {
                            travelKm += parseInt($("#txtDistance_" + i).val());
                        }
                    }
                }
            }

            if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                        if ($("#trInterAuto").is(":visible")) {
                            travelKm += parseInt($("#lblDistance_Auto").html());
                        }
                    }
                }
            }

            distance = travelKm.toString();

        }

        if (flag_g.toUpperCase() != "A") {
            //get accompanist value  

            acc_g = [];
            for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
                if ($("#dvAccomp_" + i).is(":visible")) {

                    if ($("#drpAccompanist_" + i).val() != "0") {
                        if ($.trim(acc1Name) == "null") {
                            acc1Name = $("#drpAccompanist_" + i + " :selected").text().split('(')[0].split(',')[1];
                            acc1Type = $("#drpAccompanist_" + i + " :selected").text().split('(')[1].split(')')[0];

                            if ($('#ddlStartHour_' + i).val() != "") {
                                acc1StartTime = $('#ddlStartHour_' + i).val() + ":" + $('#ddlStartMin_' + i).val() + " " + $('#ddlStartMode_' + i).val();
                                acc1EndTime = $('#ddlEndHour_' + i).val() + ":" + $('#ddlEndMin_' + i).val() + " " + $('#ddlEndMode_' + i).val();
                            }
                            else {
                                acc1StartTime = "";
                                acc1EndTime = "";
                            }
                            if ($("#checkbox_" + i).attr('checked')) {
                                //acc1OnlyDoctor = acc1Name;
                                acc1OnlyDoctor = $("#drpAccompanist_" + i + " :selected").val();
                                acc1Name = "";
                                acc1Type = "";
                            }
                            if ($("#hdnAccompMode_1").val() != "") {
                                acc1Mode = $("#hdnAccompMode_1").val();
                            }
                            acc_g.push({ accName: $("#drpAccompanist_" + i + " :selected").text(), accCode: $("#drpAccompanist_" + i).val(), accOnlyDoc: $("#checkbox_" + i).attr('checked'), accMode: $("#hdnAccompMode_" + i).val() });
                            continue;
                        }
                        else if ($.trim(acc2Name) == "null") {
                            acc2Name = $("#drpAccompanist_" + i + " :selected").text().split('(')[0].split(',')[1];
                            acc2Type = $("#drpAccompanist_" + i + " :selected").text().split('(')[1].split(')')[0];
                            if ($('#ddlStartHour_' + i).val() != "") {
                                acc2StartTime = $('#ddlStartHour_' + i).val() + ":" + $('#ddlStartMin_' + i).val() + " " + $('#ddlStartMode_' + i).val();
                                acc2EndTime = $('#ddlEndHour_' + i).val() + ":" + $('#ddlEndMin_' + i).val() + " " + $('#ddlEndMode_' + i).val();
                            }
                            else {
                                acc2StartTime = "";
                                acc2EndTime = "";
                            }
                            if ($("#checkbox_" + i + "").attr('checked')) {
                                //acc2OnlyDoctor = acc2Name;
                                acc2OnlyDoctor = $("#drpAccompanist_" + i + " :selected").val();
                                acc2Name = "";
                                acc2Type = "";
                            }

                            if ($("#hdnAccompMode_1").val() != "") {
                                acc2Mode = $("#hdnAccompMode_1").val();
                            }
                            acc_g.push({ accName: $("#drpAccompanist_" + i + " :selected").text(), accCode: $("#drpAccompanist_" + i).val(), accOnlyDoc: $("#checkbox_" + i).attr('checked'), accMode: $("#hdnAccompMode_" + i).val() });
                            continue;
                        }
                        else if ($.trim(acc3Name) == "null") {
                            acc3Name = $("#drpAccompanist_" + i + " :selected").text().split('(')[0].split(',')[1];
                            if ($('#ddlStartHour_' + i).val() != "") {
                                acc3Time = $('#ddlStartHour_' + i).val() + ":" + $('#ddlStartMin_' + i).val() + " " + $('#ddlStartMode_' + i).val() + '_' + $('#ddlEndHour_' + i).val() + ":" + $('#ddlEndMin_' + i).val() + " " + $('#ddlEndMode_' + i).val();
                            }
                            else {
                                acc3Time = "";
                            }

                            if ($("#checkbox_" + i + "").attr('checked')) {
                                //acc3OnlyDoctor = acc3Name;
                                acc3OnlyDoctor = $("#drpAccompanist_" + i + " :selected").val();
                                acc3Name = "";
                            }

                            if ($("#hdnAccompMode_1").val() != "") {
                                acc3Mode = $("#hdnAccompMode_1").val();
                            }
                            acc_g.push({ accName: $("#drpAccompanist_" + i + " :selected").text(), accCode: $("#drpAccompanist_" + i).val(), accOnlyDoc: $("#checkbox_" + i).attr('checked'), accMode: $("#hdnAccompMode_" + i).val() });
                            continue;
                        }
                        else if ($.trim(acc4Name) == "null") {
                            acc4Name = $("#drpAccompanist_" + i + " :selected").text().split('(')[0].split(',')[1];
                            if ($('#ddlStartHour_' + i).val() != "") {
                                acc4Time = $('#ddlStartHour_' + i).val() + ":" + $('#ddlStartMin_' + i).val() + " " + $('#ddlStartMode_' + i).val() + '_' + $('#ddlEndHour_' + i).val() + ":" + $('#ddlEndMin_' + i).val() + " " + $('#ddlEndMode_' + i).val();
                            }
                            else {
                                acc4Time = "";
                            }

                            if ($("#checkbox_" + i + "").attr('checked')) {
                                //acc4OnlyDoctor = acc4Name;
                                acc4OnlyDoctor = $("#drpAccompanist_" + i + " :selected").val();
                                acc4Name = "";
                            }

                            if ($("#hdnAccompMode_1").val() != "") {
                                acc4Mode = $("#hdnAccompMode_1").val();
                            }
                            acc_g.push({ accName: $("#drpAccompanist_" + i + " :selected").text(), accCode: $("#drpAccompanist_" + i).val(), accOnlyDoc: $("#checkbox_" + i).attr('checked'), accMode: $("#hdnAccompMode_" + i).val() });
                            continue;
                        }
                    }
                }
            }
        }

        if (flag_g.toUpperCase() == "A") {
            var rowLength = $("#dvActivity table").length;
            var activityString = "";
            for (var i = 1; i <= rowLength; i++) {
                if ($("#divactivity_" + i).is(":visible")) {
                    if ($.trim($('#drpactivity_' + i.toString()).val()) != 0) {
                        var projectCode = $('#drpactivity_' + i.toString()).val().split('_')[1];;
                        var activityCode = $('#drpactivity_' + i.toString()).val().split('_')[0];
                        if ($('#ddlActStartHour_' + i).val() != "") {
                            var astartTime = $('#ddlActStartHour_' + i).val() + ":" + $('#ddlActStartMin_' + i).val() + " " + $('#ddlActStartMode_' + i).val();
                            var aendTime = $('#ddlActEndHour_' + i).val() + ":" + $('#ddlActEndMin_' + i).val() + " " + $('#ddlActEndMode_' + i).val();
                        }
                        else {
                            var astartTime = "";
                            var aendTime = "";
                        }


                        var remarks = $.trim($('#txtRemarks_' + i.toString()).val());
                        activityString += projectCode + "^" + activityCode + "^" + astartTime + "^" + aendTime + "^" + escape(remarks) + "^";
                    }
                }
            }
        }


        var tpDeviation = '';
        var cpDeviation = '';

        if (TP_g != "") {
            tpDeviation = 'Y';
            cpDeviation = 'N';
            cpDeviation = (TP_g[0].CPDeviation == null) ? "N" : TP_g[0].CPDeviation;

            // tp deviation for sfc

            var tpSFCArr = new Array();
            for (k = 0; k < TPSFC_g.length; k++) {

                //to get the route way.
                var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + TPSFC_g[k].To_Place + "' & @.To_Place == '" + TPSFC_g[k].From_Place + "')");
                if (distanceJson != false) {
                    tpSFCArr.push(TPSFC_g[k].From_Place + '_' + TPSFC_g[k].To_Place + '_R');
                }
                else {
                    tpSFCArr.push(TPSFC_g[k].From_Place + '_' + TPSFC_g[k].To_Place + '_D');
                }
            }

            for (var i = 1; i <= $("#dvSFC table").length; i++) {
                if ($("#divsfc_" + i).is(":visible")) {
                    var fromPlaceTPDev = $("#ddlFromPlace_" + i).val();
                    var toPlaceTPDev = $("#ddlToPlace_" + i).val();
                    if (fromPlaceTPDev != "0" && toPlaceTPDev != "0") {
                        if ($("#hdnRouteWay_" + i).val() == "R") {
                            if ($.inArray(toPlaceTPDev + '_' + fromPlaceTPDev + '_R', tpSFCArr) == -1) {
                                tpDeviation = 'Y';
                                break;
                            }
                            else {
                                tpDeviation = 'N';
                            }
                        }
                        else {
                            if ($.inArray(fromPlaceTPDev + '_' + toPlaceTPDev + '_D', tpSFCArr) == -1) {
                                tpDeviation = 'Y';
                                break;
                            }
                            else {
                                tpDeviation = 'N';
                            }
                        }
                    }
                }
            }

            if (flag_g.toUpperCase() == "F") {
                var tpCPName = cpName == "null" ? "" : cpName;
                if (TP_g[0].CP_No == tpCPName) {  // CP check  
                    //TP accompanist
                    var tpAccompanistArr = new Array();

                    if ((TP_g[0].Acc1_Code != null && TP_g[0].Acc1_Code != '') || TP_g[0].Acc1_Only_For_Doctor.length > 0) {
                        tpAccompanistArr.push(TP_g[0].Acc1_Code + '_' + ((TP_g[0].Acc1_Only_For_Doctor.length > 0) ? "Y" : "N"));
                    }
                    if ((TP_g[0].Acc2_Code != null && TP_g[0].Acc2_Code != '') || TP_g[0].Acc2_Only_For_Doctor.length > 0) {
                        tpAccompanistArr.push(TP_g[0].Acc2_Code + '_' + ((TP_g[0].Acc2_Only_For_Doctor.length > 0) ? "Y" : "N"));
                    }
                    if ((TP_g[0].Acc3_Code != null && TP_g[0].Acc3_Code != '') || TP_g[0].Acc3_Only_For_Doctor.length > 0) {
                        tpAccompanistArr.push(TP_g[0].Acc3_Code + '_' + ((TP_g[0].Acc3_Only_For_Doctor.length > 0) ? "Y" : "N"));
                    }
                    if ((TP_g[0].Acc4_Code != null && TP_g[0].Acc4_Code != '') || TP_g[0].Acc4_Only_For_Doctor.length > 0) {
                        tpAccompanistArr.push(TP_g[0].Acc4_Code + '_' + ((TP_g[0].Acc4_Only_For_Doctor.length > 0) ? "Y" : "N"));
                    }

                    //tp deviation for accompanist
                    var totalAcc = 0;
                    for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
                        if ($("#dvAccomp_" + i).is(":visible")) {
                            if ($("#drpAccompanist_" + i).val() != "0") {
                                if ($("#checkbox_" + i + "").attr('checked')) {
                                    //Y
                                    if ($.inArray($("#drpAccompanist_" + i + " :selected").val() + '_Y', tpAccompanistArr) == -1) {
                                        tpDeviation = 'Y';
                                        break;
                                    }
                                    else {
                                        tpDeviation = 'N';
                                    }
                                }
                                else {
                                    //N
                                    if ($.inArray($("#drpAccompanist_" + i + " :selected").val() + '_N', tpAccompanistArr) == -1) {
                                        tpDeviation = 'Y';
                                        break;
                                    }
                                    else {
                                        tpDeviation = 'N';
                                    }
                                }
                                totalAcc++;
                            }
                        }
                    }

                    // if tp accompanist not entered in dcr
                    if (totalAcc < tpAccompanistArr.length) {
                        tpDeviation = 'Y';
                    }
                }
                else {
                    tpDeviation = 'Y';
                }
            }
        }
        else {
            tpDeviation = 'N';
            cpDeviation = 'N';
        }



        //prefill_g[0].Data_From Origin
        var dataFrom = "";
        if (prefill_g != "") {
            dataFrom = prefill_g[0].Data_From;
        }

        if ($.trim(category).length == 0) {
            fnMsgAlert("info", "DCR Header", "Please select catgeory.");
            return false;
        }
        //DCR Freeze
        var DCR_Freeze = 'false';
        if (g_DCR_Freeze_Status == 'YES')
            DCR_Freeze = 'true';
        //call insert
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRV4Header/InsertHeader',
            data: "dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&cpCode=" + escape(cpCode) + "&cpName=" + escape(cpName) + "&workPlace=" + escape(workPlace) +
            "&fromPlace=" + escape(fromPlace) + "&toPlace=" + escape(toPlace) + "&travelMode=" + travelMode + "&distance=" + distance + "&startTime=" + startTime +
            "&endTime=" + endTime + "&distanceFareCode=" + distanceFareCode + "&routeWay=" + routeWay + "&acc1Name=" + acc1Name + "&acc1Type=" + acc1Type +
            "&acc1StartTime=" + escape(acc1StartTime) + "&acc1EndTime=" + escape(acc1EndTime) + "&acc1OnlyDoctor=" + acc1OnlyDoctor + "&acc1Mode=" + acc1Mode +
            "&acc2Name=" + acc2Name + "&acc2Type=" + acc2Type + "&acc2StartTime=" + escape(acc2StartTime) + "&acc2EndTime=" + escape(acc2EndTime) + "&acc2OnlyDoctor=" + acc2OnlyDoctor + "&acc2Mode=" + acc2Mode +
            "&acc3Name=" + acc3Name + "&acc3Time=" + escape(acc3Time) + "&acc3OnlyDoctor=" + acc3OnlyDoctor + "&acc3Mode=" + acc3Mode +
            "&acc4Name=" + acc4Name + "&acc4Time=" + escape(acc4Time) + "&acc4OnlyDoctor=" + acc4OnlyDoctor + "&acc4Mode=" + acc4Mode +
            "&intermediateData=" + escape(intermediateData) + "&isrcpa=" + isrcpa + "&category=" + escape(category) +
            "&categoryCode=" + entityCode + "&activityString=" + activityString + "&flag=" + flag_g + "&tpDeviation=" + tpDeviation + "&cpDeviation=" + cpDeviation +
            "&entryMode=MOBILE&dateFrom=" + dataFrom + "&sfcRegionCode=" + sfcRegionCode + "&sfcVersionNo=" + sfcVersionNo + "&sfcCategoryName=" + sfcCategoryName + "&dcr_Freeze=" + DCR_Freeze,
            success: function (isTrue) {
                if (isTrue.toUpperCase() == "TRUE") {
                    fnRedirectToDoctorVisit(isrcpa);
                }
                else {
                    //HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'DCR Header', 'Insertion Failed.');
                }
            }
        });
    }
}

function fnReadIntermediateData() {
    var intermediatePlace = "";

    for (var i = 1; i <= $("#dvSFC table").length; i++) {
        if ($("#divsfc_" + i).is(":visible")) {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) == -1) {
                if ($("#ddlFromPlace_" + i).val() != "0" || $("#txtFromPlace_" + i).val() != "") {
                    var fromPlace = "";
                    var toPlace = "";
                    if ($("#ddlFromPlace_" + i).val() == "0") {
                        fromPlace = $("#txtFromPlace_" + i).val()
                    }
                    else {
                        fromPlace = $("#ddlFromPlace_" + i).val()
                    }

                    if ($("#ddlToPlace_" + i).val() == "0") {
                        toPlace = $("#txtToPlace_" + i).val()
                    }
                    else {
                        toPlace = $("#ddlToPlace_" + i).val()
                    }

                    intermediatePlace += fromPlace + '^';
                    intermediatePlace += toPlace + '^';

                    intermediatePlace += $("#txtDistance_" + i).val() + '^';
                    intermediatePlace += $("#ddlTravelMode_" + i).val() + '^';
                    intermediatePlace += $("#hdnDistanceFareCode_" + i).val() + '^';
                    intermediatePlace += $("#hdnRouteWay_" + i).val() + '^';
                    intermediatePlace += 'N^';// for Route complete
                    intermediatePlace += $("#hdnSFCRegion_" + i).val() + '^';
                    intermediatePlace += $("#hdnSFCVersion_" + i).val() + '^';
                    intermediatePlace += $("#hdnSFCCategory_" + i).val() + '^';
                    if ($("#hdnIs_TP_SFC_" + i).val() != undefined && $("#hdnIs_TP_SFC_" + i).val() != '' && $("#hdnIs_TP_SFC_" + i).val() != 'null')
                        intermediatePlace += $("#hdnIs_TP_SFC_" + i).val() + '^';
                    else
                        intermediatePlace += '0^';
                }
            }
            else {
                if ($("#ddlFromPlace_" + i).val() != "0") {
                    intermediatePlace += $("#ddlFromPlace_" + i).val() + '^';
                    intermediatePlace += $("#ddlToPlace_" + i).val() + '^';
                    intermediatePlace += $("#txtDistance_" + i).val() + '^';
                    intermediatePlace += $("#ddlTravelMode_" + i).val() + '^';
                    intermediatePlace += $("#hdnDistanceFareCode_" + i).val() + '^';
                    intermediatePlace += $("#hdnRouteWay_" + i).val() + '^';
                    intermediatePlace += 'N^';// for Route complete
                    intermediatePlace += $("#hdnSFCRegion_" + i).val() + '^';
                    intermediatePlace += $("#hdnSFCVersion_" + i).val() + '^';
                    intermediatePlace += $("#hdnSFCCategory_" + i).val() + '^';
                    if ($("#hdnIs_TP_SFC_" + i).val() != undefined && $("#hdnIs_TP_SFC_" + i).val() != '' && $("#hdnIs_TP_SFC_" + i).val() != 'null')
                        intermediatePlace += $("#hdnIs_TP_SFC_" + i).val() + '^';
                    else
                        intermediatePlace += '0^';
                }
            }
        }
    }

    if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                if ($("#trInterAuto").is(":visible")) {
                    intermediatePlace += $("#lblFromPlace_Auto").html() + '^';
                    intermediatePlace += $("#lblToPlace_Auto").html() + '^';
                    intermediatePlace += $("#lblDistance_Auto").html() + '^';
                    intermediatePlace += $("#lblTravelMode_Auto").html() + '^';
                    intermediatePlace += $("#hdnDistanceFareCode_Auto").val() + '^';
                    intermediatePlace += $("#hdnRouteWay_Auto").val() + '^';
                    intermediatePlace += 'Y^';
                    intermediatePlace += $("#hdnSFCRegion_Auto").val() + '^';
                    intermediatePlace += $("#hdnSFCVersion_Auto").val() + '^';
                    intermediatePlace += $("#hdnSFCCategory_Auto").val() + '^';
                }
            }
        }
    }
    return intermediatePlace;
}

function fnRedirectToDoctorVisit(isrcpa) {

    //build the query strings needed for doctor visit.    
    var cpCode = "", tpCode = "", flagRCPA = "", accRegions = "", dcrActualDate = "", category = "";
    var travelKm = "";

    dcrActualDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];
    category = $("#ddlCategory :selected").text();

    // tp data exist oly when dcr is in applied mode.
    if (prefill_g != "" && !(prefill_g[0] === undefined) && prefill_g[0].Data_From != "WA") {
        tpCode = prefill_g[0].Tp_Code;
    }

    // get cpCode
    if ($("#txtCP").val() != "0") {
        cpCode = $("#hiddenCP").val();
    }

    //check is rcpa.
    if (isrcpa == "Y") {
        flagRCPA = "R";
    }
    else {
        flagRCPA = "N";
    }

    // get accompanist region code
    for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
        if ($("#dvAccomp_" + i).is(":visible")) {
            if ($("#drpAccompanist_" + i).val() != "0") {
                accRegions += $("#drpAccompanist_" + i).val() + '^';
            }
        }
    }

    // get travelled km.
    if ($("#ddlCategory :selected").text() == "HQ") {
        if ($("#ddlFromPlace_1").val() != "0") {
            travelKm = $("#ddlDistance_1").val();
        }
    }
    else {
        var distance = 0;
        for (var i = 1; i <= $("#dvSFC table").length; i++) {
            if ($("#ddlFromPlace_" + i).val() != "0") {
                distance += parseInt($("#txtDistance_" + i).val());
            }
        }
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    if ($("#trInterAuto").is(":visible")) {
                        distance += parseInt($("#lblDistance_Auto").html());
                    }
                }
            }
        }
        travelKm = distance.toString();
    }

    if (flag_g == "A") {
        dcrActualDate = dcrActualDate.split('-')[2] + "-" + dcrActualDate.split('-')[1] + "-" + dcrActualDate.split('-')[0];
        var rowLength = $('#dvActivity tr').length;
        var activityString = "";
        for (var i = 1; i <= rowLength; i++) {
            if ($("#divactivity_" + i).is(":visible")) {
                if ($.trim($('#drpactivity_' + i.toString()).val()).length != "0") {
                    if ($.trim($('#drpactivity_' + i.toString()).val()).indexOf('(')) {
                        activityString += $.trim($('#drpactivity_' + i.toString() + " :selected").text()).split('(')[0] + ",";
                    }
                    else {
                        activityString += $.trim($('#drpactivity_' + i.toString() + " :selected").text()) + ",";
                    }
                }
            }
        }
        $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&isrcpa=" + isrcpa + "&source=TAB&flag=A&travelKm=" + travelKm, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
    else {
        $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&isrcpa=" + isrcpa + "&source=TAB&flag=F&travelKm=" + travelKm, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }

}

function fnSetNextFromPlace(id) {
    var rCnt = id.split('_')[1];
    var tbllength = $("#dvSFC table").length;
    var startIndex = parseInt(rCnt) + 1;
    for (var p = startIndex; p <= tbllength; p++) {
        if ($("#divsfc_" + p).length > 0 && $("#divsfc_" + p).css("display") != "none") {
            var preToPlaceMaster = $("#ddlToPlace_" + rCnt + " :selected").text();
            var preToPlaceFlexi = $("#txtToPlace_" + rCnt).val();

            $("#ddlFromPlace_" + p).attr("disabled", false);
            $("#ddlFromPlace_" + p).val(preToPlaceMaster);
            $("#ddlFromPlace_" + p).selectmenu("refresh");
            $("#ddlFromPlace_" + p).attr("disabled", true);

            $("#txtFromPlace_" + p).attr("disabled", false);
            $("#txtFromPlace_" + p).val(preToPlaceFlexi);
            $("#txtFromPlace_" + p).attr("disabled", true);

            break;

        }
    }
    fnFillDistanceTravelMode("#txtFromPlace_" + p, true);

}

//on blur of to place this function call
function fnFillDistanceTravelMode(id, callSetFromPlace) {

    var rCnt = id.split('_')[1];
    $("#ddlFromPlace_" + rCnt).selectmenu('refresh');
    $("#ddlToPlace_" + rCnt).selectmenu('refresh');
    if ($("#ddlFromPlace_" + rCnt).val() != "0" || $("#ddlToPlace_" + rCnt).val() != "0") {
        if ($("#ddlFromPlace_" + rCnt).val() != "" && $("#ddlToPlace_" + rCnt).val() != "") {
            if (sfc_g != "") {

                var distanceJson = []
                for (var i = 0; i < Acc_Id_g.length; i++) {
                    var result = "";
                    // filter the auto fill based on the category selection
                    if (($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) && categoryCheckNeeded == "YES") {
                        result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text()
                                                + "'  & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text()
                                                + "' &  @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase()
                                                + "' & @.Region_Code=='" + Acc_Id_g[i] + "') | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text()
                                                + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text()
                                                + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase()
                                                + "' & @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                    else if (Acc_Id_g[i].trim() == currentRegion.trim() && categoryCheckNeeded == "NO" && ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1)) {
                        result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text()
                                                + "'  & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text()
                                                + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase()
                                                + "' & @.Region_Code=='" + Acc_Id_g[i] + "') | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text()
                                                + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text()
                                                + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase()
                                                + "' & @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                    else {
                        result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text()
                                                 + "' & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text()
                                                 + "' ) & @.Region_Code=='" + Acc_Id_g[i] + "' | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text()
                                                 + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text()
                                                 + "'& @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                }

                //if (categoryCheckNeeded == "YES") { // sfc category check
                //    var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' ) | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "'))]");
                //}
                //else {
                //    var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text() + "') | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "' ))]");
                //}

                //var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text() + "') | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "'))]");

                var f_distanceJson = [];
                var arrCount = 0;
                if (distanceJson.length > 0 && distanceJson != null) {//No valus found - Clear Textbox
                    for (var i = 0; i < distanceJson.length; i++) {
                        var c_distanceJson = distanceJson[i];
                        for (var j = 0; j < c_distanceJson.length; j++) {
                            f_distanceJson[arrCount] = c_distanceJson[j];
                            arrCount++;
                        }
                    }
                    if (f_distanceJson.length > 1 && !callSetFromPlace) { // if more than one sfc data available show pop up
                        fnSFCOptionPopup(f_distanceJson, rCnt);
                    }
                    else {
                        var cur_sfc = f_distanceJson[0];
                        $("#txtDistance_" + rCnt).val(cur_sfc.Distance);
                        //$("#txtTravelMode_" + rCnt).val(distanceJson[0].Travel_Mode);
                        $("#ddlTravelMode_" + rCnt).val(cur_sfc.Travel_Mode);
                        $("#ddlTravelMode_" + rCnt).selectmenu("refresh");
                        $("#hdnDistanceFareCode_" + rCnt).val(cur_sfc.Distance_Fare_Code);
                        // Change attribute Disabled to Distance based on hdnDistanceFareCode
                        if ($("#hdnDistanceFareCode_" + rCnt).val() != "") {
                            $("#txtDistance_" + rCnt).attr("disabled", "disabled");
                        }
                        $("#hdnSFCRegion_" + rCnt).val(cur_sfc.SFC_Region_Code);
                        $("#hdnSFCVersion_" + rCnt).val(cur_sfc.SFC_Version_No);
                        $("#hdnSFCCategory_" + rCnt).val(cur_sfc.SFC_Category_Name);
                        if ($("#ddlFromPlace_" + rCnt + " :selected").text() == cur_sfc.To_Place && $("#ddlToPlace_" + rCnt + " :selected").text() == cur_sfc.From_Place) {
                            $("#hdnRouteWay_" + rCnt).val("R");
                        }
                        else {
                            $("#hdnRouteWay_" + rCnt).val("D");
                        }

                        //HOP Route Complete
                        if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                                if (intermediateNeed == "NO" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                    fnHOPRouteComplete(rCnt);
                                }
                            }
                        }
                    }
                }
                    // if no from place to place combination found.
                else {
                    $("#txtDistance_" + rCnt).val("0");
                    //$("#ddlTravelMode_" + rCnt).val("0");
                    $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

                    $("#hdnDistanceFareCode_" + rCnt).val("");

                    // Change attribute Disabled to Distance based on hdnDistanceFareCode
                    if ($("#hdnDistanceFareCode_" + rCnt).val() == "") {
                        $("#txtDistance_" + rCnt).removeAttr("disabled");
                    }

                    $("#hdnRouteWay_" + rCnt).val("");
                    $("#hdnSFCRegion_" + rCnt).val(currentRegion);
                    $("#hdnSFCVersion_" + rCnt).val("");
                    $("#hdnSFCCategory_" + rCnt).val($("#ddlCategory :selected").text().toUpperCase());

                    //HOP Route Complete
                    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                            if (intermediateNeed == "NO" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                fnHOPRouteComplete(rCnt);
                            }
                        }
                    }
                }
            }
                // if no from place to place combination found.
            else {
                $("#txtDistance_" + rCnt).val("0");
                //$("#ddlTravelMode_" + rCnt).val("0");
                $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

                $("#hdnDistanceFareCode_" + rCnt).val("");
                // Change attribute Disabled to Distance based on hdnDistanceFareCode
                if ($("#hdnDistanceFareCode_" + rCnt).val() == "") {
                    $("#txtDistance_" + rCnt).removeAttr("disabled");
                }

                $("#hdnRouteWay_" + rCnt).val("");
                $("#hdnSFCRegion_" + rCnt).val(currentRegion);
                $("#hdnSFCVersion_" + rCnt).val("");
                $("#hdnSFCCategory_" + rCnt).val($("#ddlCategory :selected").text().toUpperCase());
            }
        }
        else {
            $("#txtDistance_" + rCnt).val("0");
            //$("#ddlTravelMode_" + rCnt).val("0");
            $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

            $("#hdnDistanceFareCode_" + rCnt).val("");
            // Change attribute Disabled to Distance based on hdnDistanceFareCode
            if ($("#hdnDistanceFareCode_" + rCnt).val() == "") {
                $("#txtDistance_" + rCnt).removeAttr("disabled");
            }

            $("#hdnRouteWay_" + rCnt).val("");
            $("#hdnSFCRegion_" + rCnt).val(currentRegion);
            $("#hdnSFCVersion_" + rCnt).val("");
            $("#hdnSFCCategory_" + rCnt).val($("#ddlCategory :selected").text().toUpperCase());
        }
    }
    else {

        $("#txtDistance_" + rCnt).val("0");
        //$("#ddlTravelMode_" + rCnt).val("0");
        $("#ddlTravelMode_" + rCnt).selectmenu("refresh");
        $("#hdnDistanceFareCode_" + rCnt).val("");
        // Change attribute Disabled to Distance based on hdnDistanceFareCode
        if ($("#hdnDistanceFareCode_" + rCnt).val() == "") {
            $("#txtDistance_" + rCnt).removeAttr("disabled");
        }

        $("#hdnRouteWay_" + rCnt).val("");
        $("#hdnSFCRegion_" + rCnt).val("");
        $("#hdnSFCVersion_" + rCnt).val("");
        $("#hdnSFCCategory_" + rCnt).val("");

        //HOP Route Complete
        if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (intermediateNeed == "NO" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    fnHOPRouteComplete(rCnt);
                }
            }
        }
    }
    if (!callSetFromPlace) {
        fnSetNextFromPlace(id);
    }
}

function fnCategorySelected() {
    fnSetIntermediatePrivilege();
    $("#dvSFC").html('');
    fnGenerateSFCJson("EVENT");
    fnCreateIntermediatePlaceTable("N");

    //To hide the flexi text box in SFC
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        for (var s = 1; s <= $("#dvSFC table").length; s++) {
            $("#txtFromPlace_" + s).css('display', 'none');
            $("#txtToPlace_" + s).css('display', 'none');
        }
    }
    if ($("#ddlCategory :selected").text().toUpperCase() == "HQ") {
        $("#aAddSFC").css('display', 'none');
    }
    else {
        if (intermediateNeed == "YES") {
            $("#aAddSFC").css('display', '');
        }
        else {
            $("#aAddSFC").css('display', 'none');
        }
    }
    if (intermediateNeed == "NO") {
        $("#aAddSFC").css('display', 'none');
    }

}

//function call from SFC block delete
function fnSFCDelete(rowIndex) {
    if (rowIndex == "1") {
        fnMsgAlert("info", "DCR Header", "You can't delete this row,atleast one SFC need to be enter");
    }
    else {
        $("#divsfc_" + rowIndex).css("display", "none");
    }

    //if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
    //    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
    //        if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
    //            // fill route complete
    //            var autoFromPlace = "";
    //            var autoToPlace = "";

    //            for (var i = 1; i < interRow; i++) {
    //                if ($("#divsfc_" + i).is(":visible")) {
    //                    if ($("#ddlFromPlace_" + i).val() != "0") {
    //                        autoToPlace = $("#ddlFromPlace_" + i).val();
    //                        break;
    //                    }
    //                }
    //            }

    //            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
    //                if ($("#divsfc_" + j).is(":visible")) {
    //                    if ($("#ddlToPlace_" + j).val() != "0") {
    //                        autoFromPlace = $("#ddlToPlace_" + j).val();
    //                        break;
    //                    }
    //                }
    //            }

    //            // fill from and To place          



    //            // fill distance travell mode

    //            var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + autoFromPlace + "' & @.To_Place == '" + autoToPlace + "') | (@.From_Place=='" + autoToPlace + "' & @.To_Place == '" + autoFromPlace + "'))]");

    //            if (!(distanceJson === undefined) && distanceJson.length > 0) {
    //                if (categoryCheckNeeded == "YES") {
    //                    if ($("#ddlCategory :selected").text().toUpperCase() == distanceJson[0].Category_Name.toUpperCase()) {
    //                        $("#lblDistance_Auto").html(distanceJson[0].Distance);
    //                        $("#lblTravelMode_Auto").html(distanceJson[0].Travel_Mode);
    //                        $("#hdnDistanceFareCode_Auto").val(distanceJson[0].Distance_Fare_Code);
    //                        if (autoFromPlace == distanceJson[0].To_Place && autoToPlace == distanceJson[0].From_Place) {
    //                            $("#hdnRouteWay_Auto").val("R");
    //                        }
    //                        else {
    //                            $("#hdnRouteWay_Auto").val("D");
    //                        }
    //                    }
    //                    else {
    //                        $("#lblDistance_Auto").html("0");
    //                        $("#lblTravelMode_Auto").html("");
    //                        $("#hdnDistanceFareCode_Auto").val("");
    //                        $("#hdnRouteWay_Auto").val("");
    //                    }
    //                }
    //                else {
    //                    $("#lblDistance_Auto").html(distanceJson[0].Distance);
    //                    $("#lblTravelMode_Auto").html(distanceJson[0].Travel_Mode);
    //                    $("#hdnDistanceFareCode_Auto").val(distanceJson[0].Distance_Fare_Code);
    //                    if (autoFromPlace == distanceJson[0].To_Place && autoToPlace == distanceJson[0].From_Place) {
    //                        $("#hdnRouteWay_Auto").val("R");
    //                    }
    //                    else {
    //                        $("#hdnRouteWay_Auto").val("D");
    //                    }
    //                }
    //            }

    //                // if no from place to place combination found.
    //            else {
    //                $("#lblDistance_Auto").html("0");
    //                $("#lblTravelMode_Auto").html("");
    //                $("#hdnDistanceFareCode_Auto").val("");
    //                $("#hdnRouteWay_Auto").val("");
    //            }
    //        }
    //    }
    //}
}

//Remove an item from JSON Array
Array.prototype.remove = function (name, value) {
    array = this;
    var rest = $.grep(this, function (item) {
        return (item[name] != value);
    });

    array.length = rest.length;
    $.each(rest, function (n, obj) {
        array[n] = obj;
    });
};

function fnOpenAccompanistPopUp(rowIndex) {
    for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
        if (i != rowIndex) {
            $("#dvAccompPop_" + i).html('');
            $("#dvAccompPop_" + i).css('display', 'none')
        }
    }

    if ($("#dvAccompPop_" + rowIndex).is(":visible")) {
        $("#dvAccompPop_" + rowIndex).css('display', 'none')
    }
    else {
        $("#dvAccompPop_" + rowIndex).css('display', '')
        $("#dvAccompPop_" + rowIndex).trigger('refresh');
    }
    var accomNewHTML = "";
    accomNewHTML = accompanistPopUp.replace(/DNUM/g, parseInt(length + 1));
    $("#dvAccompPop_" + rowIndex).html(accomNewHTML).trigger('create');
    $("#hdnAccompPopUP").val(rowIndex);
}

function fnGetAccompPopup() {
    $('#dvAccompSelectPopUpSub').html('');
    var matchingString = "";
    var isSFC = "";

    if ($("#txtMatching").val() == "") {
        $('#dvAccompSelectPopUpSub').html('Please enter user name or region name to search');
        $('#dvAccompSelectPopUpSub').css('display', '');
        return;
    }

    if ($("#txtMatching").val().length < 3) {
        $('#dvAccompSelectPopUpSub').html('Please enter minimum of 3 characters to search');
        $('#dvAccompSelectPopUpSub').css('display', '');
        return;
    }

    matchingString = $("#txtMatching").val();
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4Header/GetAccompanistPopUpData',
        data: "matchingString=" + escape(matchingString),
        success: function (jsonPopup) {
            if (jsonPopup != null && jsonPopup != "") {
                allUser_g = jsonPopup;

                var content = "";
                var alterRow = "";
                if (allUser_g.length > 0 && !(allUser_g.length === undefined)) {
                    content = '<ul data-role="listview" data-divider-theme="b" data-inset="true">';
                    for (var j = 0; j < allUser_g.length; j++) {
                        content += '<li data-theme="c">';
                        content += '<a href="#" data-transition="slide" onclick="fnFillAccomp(' + (j + 1) + ')"><label id="lblAcc_' + (j + 1) + '" style="display:none;">' + allUser_g[j].Accompanist_Region_Code + "^" + allUser_g[j].Accompanist_Name + '</label>';
                        content += allUser_g[j].Accompanist_Name;
                        content += '</a>';
                        content += '</li>';
                    }
                    content += "</ul>";

                    $('#dvAccompSelectPopUpSub').html(content).trigger('create');
                    $('#dvAccompSelectPopUpSub').css('display', '');
                    $('#dvAccompSelectPopUpSub').css('height', '200px');
                    $('#dvAccompSelectPopUpSub').css('overflow', 'auto');
                    $("#divAccMessage").html("");
                }
                else {
                    $('#dvAccompSelectPopUpSub').css('display', 'none');
                }

            }
            else {
                $('#dvAccompSelectPopUpSub').html('No accompanist details found');
                $('#dvAccompSelectPopUpSub').css('display', '');
            }
        }
    });
}

function fnFillAccomp(row) {
    var accId = $("#hdnAccompPopUP").val();

    //to remove the SFC
    if ($('#drpAccompanist_' + accId).val() != "0") {
        sfc_g.remove("Region_Code", $('#drpAccompanist_' + accId).val());
    }

    //to append the new accompanist and select the name
    $('#drpAccompanist_' + accId).append('<option value="' + $("#lblAcc_" + row).html().split('^')[0] + '" >' + $("#lblAcc_" + row).html().split('^')[1] + '</option>');
    $('#drpAccompanist_' + accId).selectmenu('refresh');

    $('#drpAccompanist_' + accId + ' option').map(function () {
        if ($(this).text() == $("#lblAcc_" + row).html().split('^')[1]) return this;
    }).attr('selected', 'selected');
    $('#drpAccompanist_' + accId).selectmenu('refresh');
    $("#hdnAccompMode_" + accId).val('');

    $('#txtMatching').val('');
    $("#hdnAccompPopUP").val('');
    otherAccomp.push($("#lblAcc_" + row).html().split('^')[1]);


    $("#dvAccompPopUp").css('display', 'none');
    if (accompanistNeed == "YES") {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRV4Header/GetSFCData',
            data: "region=" + $('#drpAccompanist_' + accId).val() + "&dcrDate=" + dcrDate,
            success: function (jsonSFCresult) {
                var jsonSFC = jsonSFCresult.data;
                if (jsonSFC != null && jsonSFC != "") {
                    if (sfc_g == "") {
                        sfc_g = jsonSFC;
                        //Adding accompanist Cp details
                        fnIncludeAccompanistCP();
                        fnGenerateSFCJson("EVENT");
                    }
                    else {
                        var sfc = jsonSFC;
                        for (var j = 0; j < sfc.length; j++) {
                            sfc_g.push(sfc[j]);
                        }
                        //Adding accompanist Cp details
                        fnIncludeAccompanistCP();
                        fnGenerateSFCJson("EVENT");
                    }
                }
                fnDeleteAccSFC();
            }
        });
    }
    //user came under seach option show pop up
    fnAccompanistAdd(accId);
}

//Attendance
function fnGetAttendanceDetails() {

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4Header/GetActivityJSON',
        success: function (response) {
            var result = eval('(' + response + ')');
            var actvistyJSON = "[";

            for (var i = 0; i < result.Rows.length; i++) {
                var activityName = result.Rows[i].Activity_Name + "(" + result.Rows[i].Project_Name + ")";
                actvistyJSON += "{label:" + '"' + "" + activityName + "" + '",' + "value:" + '"' + "" + result.Rows[i].Activity_Code + "_" + result.Rows[i].Project_Code + "" + '"' + "},";
            }
            actvistyJSON = actvistyJSON.slice(0, -1);
            actvistyJSON += "]";
            activityJSON_g = eval(actvistyJSON);

            if (dcrStatus == '1' && source != 'TAB') {
                fnGetActivityDetails();
            }
            else if (dcrStatus == '3' || source == 'TAB' || dcrStatus == '0') {

                fnGetActivityDetails();
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'DCR Header', 'Error.');
        }
    });
}

function fnGetActivityDetails() {
    if (atten_g != "" && atten_g.length > 0) {
        for (var i = 0; i < atten_g.length; i++) {
            fnGenerateActivitytable(atten_g[i]);
        }
    }
    fnGenerateActivitytable(null);
}

function fnGenerateActivitytable(activityJson, curObj) {
    var length = $("#dvActivity table").length;
    var acctivityNewHTML = "";
    acctivityNewHTML = activityString.replace(/DNUM/g, parseInt(length + 1));
    $("#dvActivity").append(acctivityNewHTML).trigger('create');
    $("#txtRemarks_" + parseInt(length + 1)).keypress(function () { return fnEnterKeyPrevent(event) });
    // bind Activity start time end time
    fnBindTimeBox("ddlActStartMin_" + parseInt(length + 1));
    fnBindTimeBox("ddlActEndMin_" + parseInt(length + 1));

    fnEnableActivityDetails(parseInt(length + 1));
    $("input[type='time']").each(function () {
        var $this = $(this);
        if (!$(this).hasClass("easytimepicker-haspicker")) {
            $.options = {
                'interval': $(this).attr('data-interval'),
                'nativeMenu': $(this).attr('data-native-menu'),
                'display24Hour': $(this).attr('data-display-24hour'),
                'value24Hour': $(this).attr('data-value-24hour')
            };
            $(this).easytimepicker($options);
        }
    });
    $("#dvActivity").trigger('create');

    if (activityJson != null) {
        $("#drpactivity_" + parseInt(length + 1)).val(activityJson.Activity_Code + "_" + activityJson.Project_Code);
        $("#drpactivity_" + parseInt(length + 1)).selectmenu('refresh');

        var startTime1 = (activityJson.Start_Time == null) ? "" : activityJson.Start_Time;
        var endTime1 = (activityJson.End_Time == null) ? "" : activityJson.End_Time;
        if (startTime1 != "" && startTime1.split(':')[1] !== undefined && startTime1.split(':')[1].split(' ')[1] !== undefined) {
            $("#ddlActStartHour_" + parseInt(length + 1)).val(startTime1.split(':')[0]);
            $("#ddlActStartHour_" + parseInt(length + 1)).selectmenu('refresh');

            var min = startTime1.split(':')[1].split(' ')[0];
            if ($("ddlActStartMin_" + parseInt(length + 1) + " option[value='" + min + "']").length > 0) {
                $("#ddlActStartMin_" + parseInt(length + 1)).val(min);
                $("#ddlActStartMin_" + parseInt(length + 1)).selectmenu();
            }
            else {
                if (min != null && min.length > 0) {
                    $("#ddlActStartMin_" + parseInt(length + 1)).append('<option value="' + min + '">' + min + '</option>');
                    $("#ddlActStartMin_" + parseInt(length + 1)).val(min);
                }
            }

            $("#ddlActStartMin_" + parseInt(length + 1)).selectmenu('refresh');
            $("#ddlActStartMode_" + parseInt(length + 1)).val(startTime1.split(':')[1].split(' ')[1]);
            $("#ddlActStartMode_" + parseInt(length + 1)).selectmenu('refresh');
        }
        else {
            $("#ddlActStartHour_" + parseInt(length + 1)).val('');
            $("#ddlActStartHour_" + parseInt(length + 1)).selectmenu('refresh');
            $("#ddlActStartMin_" + parseInt(length + 1)).val('');
            $("#ddlActStartMin_" + parseInt(length + 1)).selectmenu('refresh');
            $("#ddlActStartMode_" + parseInt(length + 1)).val('');
            $("#ddlActStartMode_" + parseInt(length + 1)).selectmenu('refresh');
        }
        if (endTime1 != "" && endTime1.split(':')[1] !== undefined && endTime1.split(':')[1].split(' ')[1] !== undefined) {
            $("#ddlActEndHour_" + parseInt(length + 1)).val(endTime1.split(':')[0]);
            $("#ddlActEndHour_" + parseInt(length + 1)).selectmenu('refresh');
            var emin = endTime1.split(':')[1].split(' ')[0];

            if ($("#ddlActEndMin_" + parseInt(length + 1) + " option[value='" + emin + "']").length > 0) {
                $("#ddlActEndMin_" + parseInt(length + 1)).val(emin);
                $("#ddlActEndMin_" + parseInt(length + 1)).selectmenu();
            }
            else {
                if (emin != null && emin.length > 0) {
                    $("#ddlActEndMin_" + parseInt(length + 1)).append('<option value="' + emin + '">' + emin + '</option>');
                    $("#ddlActEndMin_" + parseInt(length + 1)).val(emin);
                }
            }
            $("#ddlActEndMin_" + parseInt(length + 1)).selectmenu('refresh');
            if ($("#ddlActEndMin_" + parseInt(length + 1)).val() == "") {
                $('#ddlActEndMin_' + parseInt(length + 1)).append('<option value="' + endTime1.split(':')[1].split(' ')[0] + '" >' + endTime1.split(':')[1].split(' ')[0] + '</option>');
                $("#ddlActEndMin_" + parseInt(length + 1)).val(endTime1.split(':')[1].split(' ')[0]);
                $("#ddlActEndMin_" + parseInt(length + 1)).selectmenu('refresh');
            }

            $("#ddlActEndMode_" + parseInt(length + 1)).val(endTime1.split(':')[1].split(' ')[1]);
            $("#ddlActEndMode_" + parseInt(length + 1)).selectmenu('refresh');
        }
        else {
            $("#ddlActEndHour_" + parseInt(length + 1)).val('');
            $("#ddlActEndHour_" + parseInt(length + 1)).selectmenu('refresh');
            $("#ddlActEndMin_" + parseInt(length + 1)).val('');
            $("#ddlActEndMin_" + parseInt(length + 1)).selectmenu('refresh');
            $("#ddlActEndMode_" + parseInt(length + 1)).val('');
            $("#ddlActEndMode_" + parseInt(length + 1)).selectmenu('refresh');
        }

        $("#txtRemarks_" + parseInt(length + 1)).val(activityJson.Remarks);
    }
}

function fnEnableActivityDetails(rowIndex) {
    for (var a = 0; a < activityJSON_g.length; a++) {
        $("#drpactivity_" + rowIndex).append('<option value="' + activityJSON_g[a].value + '" >' + activityJSON_g[a].label + '</option>');
        $("#drpactivity_" + rowIndex).selectmenu('refresh');
    }
}

function fnActivityDelete(rowIndex) {
    if (rowIndex == "1") {
        fnMsgAlert("info", "DCR Header", "You can't delete this row,atleast one activity need to enter");
    }
    else {
        $("#divactivity_" + rowIndex).css("display", "none");
    }
}

function fnAddNewActivity() {
    var length = $("#dvActivity table").length;
    var acctivityNewHTML = "";
    acctivityNewHTML = activityString.replace(/DNUM/g, parseInt(length + 1));
    $("#dvActivity").append(acctivityNewHTML).trigger('create');
    // bind Activity start time end time
    fnBindTimeBox("ddlActStartMin_" + parseInt(length + 1));
    fnBindTimeBox("ddlActEndMin_" + parseInt(length + 1));

    $("#txtRemarks_" + parseInt(length + 1)).keypress(function () { return fnEnterKeyPrevent(event) });
    fnEnableActivityDetails(parseInt(length + 1));

    $("input[type='time']").each(function () {
        var $this = $(this);
        if (!$(this).hasClass("easytimepicker-haspicker")) {
            $.options = {
                'interval': $(this).attr('data-interval'),
                'nativeMenu': $(this).attr('data-native-menu'),
                'display24Hour': $(this).attr('data-display-24hour'),
                'value24Hour': $(this).attr('data-value-24hour')
            };
            $(this).easytimepicker($options);
        }
    });
    $("#dvActivity").trigger('create');
}

function fnClear() {
    $("#dvAccompanist").empty();
    $("#dvSFC").empty();
    if (flag_g.toUpperCase() == "A") {
        $("#dvActivity").html('');
    }
    GetHeaderDetails();
}


function fnBindTimeBox(minId) {
    $('#' + minId).append('<option value="" >MM</option>');
    $('#' + minId).append('<option value="00" >00</option>');
    var dcrTimeGapStart = parseInt(dcrTimeGap_g);
    //var dcrTimeInterval = parseInt(dcrTimeGap_g);

    for (var i = dcrTimeGapStart; i < 60; i = i + dcrTimeGapStart) {
        $('#' + minId).append('<option value="' + ((i < 10) ? '0' + i.toString() : i) + '" >' + ((i < 10) ? '0' + i.toString() : i) + '</option>');
    }

    if (minId.indexOf('_') > 0) {
        $('#' + minId).selectmenu('refresh');
    }
}

function fnGoToHome() {
    if (flag_g != "A") {
        $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=" + isrcpa + "&source=TAB&flag=F&travelKm=", {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
    else {
        $.mobile.changePage("/HiDoctor_Activity/DCRV4MobileHome/Index/?dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&isrcpa=" + isrcpa + "&source=TAB&flag=A&travelKm=" + travelKm, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
}

function fnGoToCalendar() {
    $.mobile.changePage("/HiDoctor_Activity/DCRCalendar/Index", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


function fnCheckSFDatainLoad() {
    var sfcData = [];

    for (var i = 1; i <= interRow - 1; i++) {
        if ($("#ddlFromPlace_" + i).val() != "0") {
            sfcData.push({
                From_Place: (($("#hdnRouteWay_" + i).val() == "R") ? $("#ddlToPlace_" + i).val() : $("#ddlFromPlace_" + i).val())
                , To_Place: (($("#hdnRouteWay_" + i).val() == "R") ? $("#ddlFromPlace_" + i).val() : $("#ddlToPlace_" + i).val())
                , Distance: $("#txtDistance_" + i).val()
                , Travel_Mode: $("#ddlTravelMode_" + i).val()
                , Route_Way: $("#hdnRouteWay_" + i).val()
                , Distance_Fare_Code: $("#hdnDistanceFareCode_" + i).val()
                , Is_Route_Complete: "N"
                , SFC_Region_Code: $("#hdnSFCRegion_" + i).val()
                , SFC_Version_No: $("#hdnSFCVersion_" + i).val()
                , SFC_Category_Name: $("#hdnSFCCategory_" + i).val()
            });
        }
    }

    if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                if ($("#trInterAuto") != null) {

                    sfcData.push({
                        From_Place: (($("#hdnRouteWay_Auto").val() == "R") ? $("#lblToPlace_Auto").html() : $("#lblFromPlace_Auto").html())
                       , To_Place: (($("#hdnRouteWay_Auto").val() == "R") ? $("#lblFromPlace_Auto").html() : $("#lblToPlace_Auto").html())
                       , Distance: $("#lblDistance_Auto").html()
                       , Travel_Mode: $("#lblTravelMode_Auto").html()
                       , Route_Way: $("#hdnRouteWay_Auto").val()
                       , Distance_Fare_Code: $("#hdnDistanceFareCode_Auto").val()
                       , Is_Route_Complete: "Y"
                       , SFC_Region_Code: $("#hdnSFCRegion_Auto").val()
                       , SFC_Version_No: $("#hdnSFCVersion_Auto").val()
                       , SFC_Category_Name: $("#hdnSFCCategory_Auto").val()
                    });
                }
            }
        }
    }
    if (sfcData != null && sfcData.length > 0) {
        // check sfc data
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRV4Header/CheckSFCData',
            data: "sfcData=" + JSON.stringify(sfcData) + "&dcrDate=" + dcrDate,
            async: false,
            success: function (result) {
                if (result.split('^')[0] != "FAIL") {
                    if (result.split('$')[1] == "Y") {
                        alert("SFC Changed");
                        var sfcTble = "";
                        var sfcObj = eval('(' + result.split('$')[0] + ')');
                        for (var a = 0; a < sfcObj.length; a++) {
                            if (sfcObj[a].Distance == null) {
                                sfcObj[a].Distance = "0";
                            }
                            if (sfcObj[a].Distance != null && sfcObj[a].Distance.length == 0) {
                                sfcObj[a].Distance = "0";
                            }
                            if (sfcObj[a].Distance.indexOf('.') == -1) {
                                sfcObj[a].Distance = sfcObj[a].Distance + ".00"
                            }
                            if (sfcObj[a].Is_Route_Complete != "Y") {
                                if (sfcObj[a].Distance_Fare_Code != null && sfcObj[a].Distance_Fare_Code != 'null' && sfcObj[a].Distance_Fare_Code != "") {

                                    $("#txtFromPlace_" + (a + 1)).val("");
                                    $("#txtToPlace_" + (a + 1)).val("");
                                    $("#ddlFromPlace_" + (a + 1)).val(sfcObj[a].From_Place);
                                    $("#ddlFromPlace_" + (a + 1)).selectmenu('refresh');
                                    $("#ddlToPlace_" + (a + 1)).val(sfcObj[a].To_Place);
                                    $("#ddlToPlace_" + (a + 1)).selectmenu('refresh');
                                }
                                else {
                                    $("#txtFromPlace_" + (a + 1)).val(sfcObj[a].From_Place);
                                    $("#txtToPlace_" + (a + 1)).val(sfcObj[a].To_Place);
                                    $("#ddlFromPlace_" + (a + 1)).val("0");
                                    $("#ddlFromPlace_" + (a + 1)).selectmenu('refresh');
                                    $("#ddlToPlace_" + (a + 1)).val("0");
                                    $("#ddlToPlace_" + (a + 1)).selectmenu('refresh');
                                }

                                $("#txtDistance_" + (a + 1)).val(sfcObj[a].Distance);
                                $("#ddlTravelMode_" + (a + 1)).val(sfcObj[a].Travel_Mode);
                                $("#hdnRouteWay_" + (a + 1)).val(sfcObj[a].Route_Way);
                                $("#hdnDistanceFareCode_" + (a + 1)).val(sfcObj[a].Distance_Fare_Code);

                                // Change attribute Disabled to Distance based on hdnDistanceFareCode
                                if ($("#hdnDistanceFareCode_" + (a + 1)).val() != "") {
                                    $("#txtDistance_" + (a + 1)).attr("disabled", "disabled");
                                }

                                $("#hdnSFCRegion_" + (a + 1)).val(sfcObj[a].SFC_Region_Code);
                                $("#hdnSFCVersion_" + (a + 1)).val(sfcObj[a].SFC_Version_No);
                                $("#hdnSFCCategory_" + (a + 1)).val(sfcObj[a].SFC_Category_Name);
                            }
                            else {
                                $("#lblFromPlace_Auto").html(sfcObj[a].From_Place);
                                $("#lblToPlace_Auto").html(sfcObj[a].To_Place);
                                $("#lblDistance_Auto").html(sfcObj[a].Distance);
                                $("#lblTravelMode_Auto").html(sfcObj[a].Travel_Mode);
                                $("#hdnRouteWay_Auto").val(sfcObj[a].Route_Way);
                                $("#hdnDistanceFareCode_Auto").val(sfcObj[a].Distance_Fare_Code);
                                $("#hdnSFCRegion_Auto").val(sfcObj[a].SFC_Region_Code);
                                $("#hdnSFCVersion_Auto").val(sfcObj[a].SFC_Version_No);
                                $("#hdnSFCCategory_Auto").val(sfcObj[a].SFC_Category_Name);
                            }
                        }
                    }
                }
                else {
                    fnMsgAlert('error', 'DCR Header', 'Error. ' + result.split('^')[1]);
                }
            },
            error: function (e) {
                fnMsgAlert('error', 'DCR Header', 'Error. ' + e.Message);
            }
        });
    }

}


function fnSFCOptionPopup(disJson, rCnt) {
    try {
        $.mobile.loading('show');

        if (disJson != null && disJson !== undefined && disJson.length > 0) {
            var content = "";
            if (rCnt == "Auto") {
                content += "<div style='background-color:#A5D16C;height:30px;width:98%;padding:5px;'><span>This is for Route Complete</span></div>"
            }
            content += "<table class='table table-striped'> <thead><tr><th>Select</th><th>Category Name</th><th>From Place</th>";
            content += "<th>To Place </th><th>Travel Mode</th><th>Region Name</th><th>Distance</th></tr> </thead><tbody>";

            var routeWay = "D";
            if (rCnt == "Auto") {
                if ($("#lblFromPlace_Auto").html() == disJson[0].To_Place && $("#lblToPlace_Auto").html() == disJson[0].From_Place) {
                    routeWay = "R";
                }
            }
            else {
                if ($("#txtFromPlace_" + rCnt).val() == disJson[0].To_Place && $("#txtToPlace_" + rCnt).val() == disJson[0].From_Place) {
                    routeWay = "R";
                }
            }

            for (var i = 0; i < disJson.length; i++) {
                content += " <tr onclick='fnSFCSelectRow(this)' class='cls_bottomrow'><td> <input type='radio' name='chkSFCSelect'  id='chkSFCSelect_" + i + "' value='"
                    + disJson[i].Distance_Fare_Code + "_" + disJson[i].Distance + "_" + disJson[i].Fare_Amount + "_" + disJson[i].SFC_Category_Name + "_" + disJson[i].SFC_Version_No + "_" + disJson[i].SFC_Region_Code + "_" + rCnt + "_" + routeWay + "_" + disJson[i].Travel_Mode + "' /> </td>";
                content += "<td><div class='cls_padding3px'>" + disJson[i].SFC_Category_Name + "</div></td>";
                content += "<td><div class='cls_padding3px'>" + disJson[i].From_Place + "</div></td>";
                content += "<td><div class='cls_padding3px'>" + disJson[i].To_Place + "</div></td>";
                content += "<td><div class='cls_padding3px'>" + disJson[i].Travel_Mode + "</div></td>";

                if (disJson[i].SFC_Region_Code == currentRegion) {
                    content += "<td><div class='cls_padding3px'>" + currRegionName + "</div></td>";
                }
                else {
                    var regionName = jsonPath(accompanistJson_g, "$.[?(@.value=='" + disJson[i].SFC_Region_Code + "')]");
                    if (regionName != null && regionName !== undefined && regionName.length > 0) {
                        content += "<td><div class='cls_padding3px'>" + regionName[0].label.split(',')[0] + "</div></td>";
                    }
                    else {
                        content += "<td></td>";
                    }
                }
                content += "<td ><div class='cls_padding3px'>" + disJson[i].Distance + "</div></td>";
                content += "</tr>";
            }
            content += "</tbody> </table>";
            content += "<div class='cls_popupbtnwidth'><input type='button' value='Submit' onclick='fnBindSelectedSFCCode()'></div>"
            $('#dvAllSFC').html(content);

            $('#dvSFCPopUp').simpledialog2();
            $.mobile.loading('hide');
        }
    }
    catch (e) {
        $.mobile.loading('hide');
        alert(e.message);

    }
}
function fnSFCSelectRow(obj) {


}

function fnBindSelectedSFCCode() {
    //Distance_Fare_Code|Distance|Fare_Amount |SFC_Category_Name|SFC_Version_No|SFC_Region_Code| rCnt |D|TrvelMode
    //$("#dvSFCPopUp").simpledialog2('close');
    if ($('input:radio[name=chkSFCSelect]:checked').length > 0) {
        $.mobile.loading('hide');
        $('#dvSFCPopUp').simpledialog2('close');

        var selectedVal = $('input:radio[name=chkSFCSelect]:checked').val();


        var currentSFCRow = selectedVal.split('_')[6]
        if (currentSFCRow == "Auto") {
            $("#lblDistance_Auto").html(selectedVal.split('_')[1]);
            $("#lblTravelMode_Auto").html(selectedVal.split('_')[8]);
            $("#hdnDistanceFareCode_Auto").val(selectedVal.split('_')[0]);
            $("#hdnRouteWay_Auto").val(selectedVal.split('_')[7]);
            $("#hdnSFCRegion_Auto").val(selectedVal.split('_')[5]);
            $("#hdnSFCVersion_Auto").val(selectedVal.split('_')[4]);
            $("#hdnSFCCategory_Auto").val(selectedVal.split('_')[3]);
        }
        else {
            $("#hdnDistanceFareCode_" + currentSFCRow).val(selectedVal.split('_')[0]);
            $("#txtDistance_" + currentSFCRow).val(selectedVal.split('_')[1]);
            // Change attribute Disabled to Distance based on hdnDistanceFareCode
            if ($("#hdnDistanceFareCode_" + currentSFCRow).val() != "") {
                $("#txtDistance_" + currentSFCRow).attr("disabled", "disabled");
            }
            $("#ddlTravelMode_" + currentSFCRow).val(selectedVal.split('_')[8]);
            $("#ddlTravelMode_" + currentSFCRow).selectmenu("refresh");
            $("#hdnRouteWay_" + currentSFCRow).val(selectedVal.split('_')[7]);
            $("#hdnSFCRegion_" + currentSFCRow).val(selectedVal.split('_')[5]);
            $("#hdnSFCVersion_" + currentSFCRow).val(selectedVal.split('_')[4]);
            $("#hdnSFCCategory_" + currentSFCRow).val(selectedVal.split('_')[3]);
        }


        if (currentSFCRow != "Auto") {
            //HOP Route Complete
            if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                        fnHOPRouteComplete(currentSFCRow);
                    }
                }
            }
            else {

            }
        }
    }
    else {
        alert("Please choose the one SFC Row.");
    }
}


////------------------------START - PREFILL THE CP FOR SELECTED ACCOMPANIST--------------------------------/////
function fnIncludeAccompanistCP() {
    debugger;
    var regionCodes = "";
    var accObj = "";
    var priv = "", accom_regionCode = "", Accom_Id = '';
    var privArr = new Array();
    var cur_RegionCode = currentRegion;

    if (accompanistCPNeed == "YES" && flag_g.toUpperCase() != "A") {
        for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
            if ($("#dvAccomp_" + i).is(":visible")) {
                if ($("#drpAccompanist_" + i).val() != "0") {
                    accObj += $("#drpAccompanist_" + i).val() + ',';
                }
            }
        }
    }

    if ($.inArray($("#hdnAccompanistCode_" + i).val(), accObj) > -1) {
        fnMsgAlert('info', 'DCR Header', 'The accompanist name ' + $("#txtAccompanist_" + i).val() + ' is entered more than one time. It is not allowed.');
        fnErrorIndicator("#txtAccompanist_" + i);
        return false;
    }

    if (accObj.length > 0) {
        regionCodes = cur_RegionCode + ',' + accObj;
    }

    else {
        regionCodes = cur_RegionCode + ',';
    }



    //Clear the current User plus Accompanist CP Details
    cp_g = [];
    cpHop_g = [];



    if (cpNeed == "YES" || cpNeed == "OPTIONAL") {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRV4Header/GetCpforAccompanist',
            data: "accomRegionCode=" + regionCodes,
            async: false,
            success: function (jsdata) {
                if (jsdata != null && jsdata != "") {
                    if (jsdata[0].lstAccomCP != null && jsdata[0].lstAccomCP != '' && jsdata[0].lstAccomCP.length > 0) {
                        cp_g.push(jsdata[0].lstAccomCP);
                        //cpAccompanistJson_g.push(jsdata[0].lstAccomCP);                     
                    }
                    if (jsdata[0].lstAccomCPHOP != null && jsdata[0].lstAccomCPHOP != '' && jsdata[0].lstAccomCPHOP.length > 0) {
                        cpHop_g.push(jsdata[0].lstAccomCPHOP);
                    }
                    fnPrefillAccompanistCp(cp_g);
                    //Clear field
                    //$("#drpCP").val(0);
                    //$("#drpCP").selectmenu('refresh');
                    //$("#ddlCategory").val(0);
                    //$("#ddlCategory").selectmenu('refresh');
                    //$("#drpWorkPlace").val(currRegionName);
                    //$("#ddlStartHour").val("");
                    //$("#ddlStartHour").selectmenu('refresh');
                    //$("#ddlStartMin").val("");
                    //$("#ddlStartMin").selectmenu('refresh');
                    //$("#ddlStartMode").val("");
                    //$("#ddlStartMode").selectmenu('refresh');
                    //$("#ddlEndHour").val("");
                    //$("#ddlEndHour").selectmenu('refresh');
                    //$("#ddlEndMin").val("");
                    //$("#ddlEndMin").selectmenu('refresh');
                    //$("#ddlEndMode").val("");
                    //$("#ddlEndMode").selectmenu('refresh');
                    //$("#dvSFC").empty();                                   
                    //fnCreateIntermediatePlaceTable("");
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });
    }
    else {
        accom_regionCode = "";
    }
}

//Prefill the the Selectd Accompanist CP
function fnPrefillAccompanistCp(obj) {
    // $('#drpCP option').remove()
    // $("#drpCP").selectmenu('refresh');
    var cpJsonforAccom = obj;
    if (cpJsonforAccom != null && cpJsonforAccom.length > 0) {
        if (cpJsonforAccom != null && cpJsonforAccom != "") {
            var cp = "[";
            for (var i = 0; i < cpJsonforAccom[0].length; i++) {
                cp += "{label:" + '"' + "" + cpJsonforAccom[0][i].CP_No + "_" + cpJsonforAccom[0][i].Region_Name + "" + '",' + "value:" + '"' + "" + cpJsonforAccom[0][i].CP_Code + "" + '"' + "}";
                if (i < cpJsonforAccom[0].length - 1) {
                    cp += ",";
                }
            }
            cp += "];";
            var cpJson = eval(cp);
            cpJson_g = cpJson;
            //fnEnableCPDetails();
            //$('#drpCP').append('<option value="0" >Select CP</option>');
            //for (var i = 0; i < cpJson_g.length; i++) {
            //    $('#drpCP').append('<option value="' + cpJson_g[i].value + '" >' + cpJson_g[i].label + '</option>');
            //    $("#drpCP").selectmenu('refresh');
            //}
        }
    }
    else {
        $('#drpCP option').remove()
        $("#drpCP").selectmenu('refresh');
    }
}


function fnDeleteAccSFC() {
    try {
        var sfc = [];
        var deletedRegionCode = "";
        var acc1 = [];
        for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
            if ($("#dvAccomp_" + i).is(":visible")) {
                if ($("#drpAccompanist_" + i).val() != "0") {
                    acc1.push($("#drpAccompanist_" + i).val());
                }
            }
        }
        //if (accompRow >= 3) { // take region code from Accompanist table value.
        //    for (var i = 1; i <= (accompRow - 1) ; i++) {
        //        if ($("#txtAccompanist_" + i).val() != "") {
        //            acc1.push($("#hdnAccompanistCode_" + i).val());
        //        }
        //    }
        //}
        acc1.push(currentRegion);
        Acc_Id_g = [];
        Acc_Id_g = acc1;
        //console.log(acc1);
        for (var i = 0; i < sfc_g.length; i++) {
            for (var j = 0; j < acc1.length; j++) {
                if (acc1[j] == sfc_g[i].Region_Code) {
                    sfc.push(sfc_g[i]);
                }
            }
        }

        sfc_g = sfc;
        //console.log("After Delete");
        //console.log(sfc_g);
    }
    catch (e) {
        alert(e.message);
    }
}

function ArrayToJSonWithCount(singleArray) {
    var compressed = [];
    // make a copy of the input array
    var copy = singleArray.slice(0);

    // first loop goes over every element
    for (var i = 0; i < singleArray.length; i++) {

        var myCount = 0;
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
            if (singleArray[i] == copy[w]) {
                // increase amount of times duplicate is found
                myCount++;
                // sets item to undefined
                delete copy[w];
            }
        }

        if (myCount > 0) {
            var a = new Object();
            a.value = singleArray[i];
            a.count = myCount;
            compressed.push(a);
        }
    }

    return compressed;
}

function fnGetNextRow(i) {
    var startIndex = parseInt(i) + 1;
    for (var j = startIndex; j <= $("#dvSFC table").length; j++) {
        if ($("#ddlFromPlace_" + j).is(":visible")) {
            return j;
        }
    }
}

function fnGetFromPlaceText(index) {
    if ($("#ddlFromPlace_" + index + " :selected").text().length > 0 && $("#ddlFromPlace_" + index + " :selected").val() != "0") {
        return $("#ddlFromPlace_" + index + " :selected").text();
    }
    else {
        return $("#txtFromPlace_" + index).val();
    }


}

function fnGetToPlaceText(index) {

    if ($("#ddlToPlace_" + index + " :selected").text().length > 0 && $("#ddlToPlace_" + index + " :selected").val() != "0") {
        return $("#ddlToPlace_" + index + " :selected").text()
    }
    else {
        return $("#txtToPlace_" + index).val();
    }
}


Array.prototype.clear = function () {
    while (this.length) {
        this.pop();
    }
};


//function to delete accompanist row
function fnAccompanistDelete(rowIndex) {
    debugger;
    //get it's stored in local or DB
    var div_DB_Stored_Flag = $("#div_DB_Stored_Flag_" + rowIndex).text().trim();
    var acc_UserName = $("#drpAccompanist_" + rowIndex + " :selected").text().split('(')[0].split(',')[1];
    var acc_Region_Code = $("#drpAccompanist_" + rowIndex).val();
    // 1 is value is not stored in DB. So no need for delete
    if (div_DB_Stored_Flag == '1' & acc_Region_Code != undefined && acc_Region_Code != '0') {
        var user_name = $("#loginUserName").text().trim();
        var msg = '<div class="">Dear ' + user_name + ', </div><div style="margin-bottom: 10px;">You are trying to remove ' + $("#drpAccompanist_" + rowIndex + " :selected").text().split(',')[1].split('(')[0] + " (" + $("#drpAccompanist_" + rowIndex + " :selected").text().split(',')[0] + ") from the accompanist list.</div><div><div class='con'>1. If any visit of doctor that belongs to this accompanist or this region is avaliable in this DCR, system will remove that doctor visit from this DCR;and</div><div class='con'>2. If you have marked this accompanist/region against any other doctor visits,the accompanist/region name will be removed.</div><div class='con'>3. The CP,SFC records and visits of chemist who belongs to this accompanist / this region will also be removed.</div></div><div style='margin-bottom: 10px;'>Click OK to continue</div><div style='margin-bottom: 10px;'>Click CANCEL to retain this accompanist / region and related doctor visits.</div>";
        var ddl_Disable = $('#drpAccompanist_' + rowIndex).prop('disabled');
        //if not disabled no need for pop up box
        if (ddl_Disable) {
            $('<div>').simpledialog2({
                mode: 'button',
                headerText: 'Alert',
                headerClose: true,
                buttonPrompt: msg,
                buttons: {
                    'OK': {
                        click: function () {
                            fnAccDelete(rowIndex, acc_UserName, acc_Region_Code);
                        }
                    }, 'Cancel': {
                        click: function () {
                        }
                    }
                },
                width: '500px'
            })
        }
        else
            fnAccDelete(rowIndex, acc_UserName, acc_Region_Code);
    }
    else
        if (rowIndex != '1')
            fnResetDDlAccName(rowIndex);
        else {
            $("#drpAccompanist_" + rowIndex).val('0');
            $("#drpAccompanist_" + rowIndex).selectmenu('refresh');
            $("#drpAccompanist_" + rowIndex).attr('disabled', false);
        }
}
function fnAccDelete(rowIndex, acc_UserName, acc_Region_Code) {
    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4Header/RemoveAccompanist',
        data: "acc_id=" + rowIndex + "&dcrDate=" + dcrDate + "&acc_UserName=" + acc_UserName + "&acc_Region_Code=" + acc_Region_Code,
        asysc: false,
        success: function (result) {
            if (result != 'Error') {
                $("#div_DB_Stored_Flag_" + rowIndex).text('0');
                //Remove- Deleted Acc_SFC
                sfc_g.remove("Region_Code", $("#drpAccompanist_" + rowIndex).val());
                //  Rebind SFC in auto fill
                fnGenerateSFCJson('');
                fnEnableSFCDetails('', true);
                // First acc selection - no need for hide acc_1
                $("#drpAccompanist_" + rowIndex).val('0');
                if (rowIndex == '1') {
                    $("#drpAccompanist_" + rowIndex).selectmenu('refresh');
                    $("#drpAccompanist_" + rowIndex).attr('disabled', false);
                }
                else {
                    fnResetDDlAccName(rowIndex);
                }
                //Bind  Selected All Acc_name Cp details
                fnIncludeAccompanistCP();

            }
            $.mobile.loading('hide');
        }

    });
}
//function- Add Acc_Name in DB through the POPUP
function fnAccompanistAdd(id) {
    debugger;
    var rowIndex = id;
    // Check acc_name allready selected or not
    var rvalue = fnCheckAccDuplicateName();
    if (rvalue == 0) {
        //check doctor count in DB. Doctor is avaliable show popup
        var doc_count = fnGetDoctorVisitCount();
        var user_name = $("#loginUserName").text().trim();
        if (doc_count > 0) {
            var msg = "<div class='empName'>Dear " + user_name + "<div><div>All the Doctor visits of this DCR will be marked as 'Accompanied Call' with this accompanist name<span>" + $("#drpAccompanist_" + rowIndex + " :selected").text().split(',')[1].split('(')[0] + "( " + $("#drpAccompanist_" + rowIndex + " :selected").text().split(',')[2].split(')')[0] + ")</span>.</br>If you wish to mark any visit as independent visit, Please go the doctor visit screen and modify that doctor visit.</div></div><div style='float: left;margin-right: 10px;width: 95%;margin-top: 10px;'><input type='checkbox' name='name' value='Yes' id='chk_mark_all_acc' style='height: 20px;width: 16px;margin-top: 0px;'/><div style='display: inline-block;margin-left: 13%;vertical-align: top;'>Mark all doctor visits as 'independent visits'</div></div></div>";
            $('<div>').simpledialog2({
                mode: 'button',
                headerText: 'Alert',
                //headerClose: true,
                buttonPrompt: msg,
                buttons: {
                    'OK': {
                        click: function () {
                            debugger;
                            $.mobile.loading('show');
                            var chk_mark_all_acc = $("#chk_mark_all_acc").prop('checked');
                            var lbl_acc_name = $("#drpAccompanist_" + rowIndex + " :selected").text();
                            var Is_Accompanied_call = '';
                            if (chk_mark_all_acc)
                                Is_Only_For_Doctor = "Y";
                            else
                                Is_Only_For_Doctor = "N";
                            var acc_index = rowIndex;
                            //Save To Data base
                            $.ajax({
                                type: "POST",
                                url: '/HiDoctor_Activity/DCRV4Header/InsertDoctorVisit',
                                data: "lbl_acc_name=" + lbl_acc_name + "&dcrDate=" + dcrDate + "&Is_Only_For_Doctor=" + Is_Only_For_Doctor + "&acc_index=" + acc_index,
                                asysc: false,
                                success: function (result) {
                                    debugger;
                                    if (result == "success") {
                                        if (chk_mark_all_acc)
                                            $("#checkbox_" + acc_index).attr('checked', true);
                                        $("#checkbox_" + acc_index).attr('disabled', true);
                                        $("#drpAccompanist_" + rowIndex).attr('disabled', true);
                                        $("#div_DB_Stored_Flag_" + rowIndex).text('1');
                                        // Per_Acc_Name_Status += 1;
                                        //Per Functions
                                        //fnIncludeAccompanistCP(g_acc_id);
                                        //fnGetAccompanistSFC(g_acc_id);
                                    }
                                    else {
                                        fnMsgAlert('Error', 'DCR Header', 'Error');
                                    }
                                    fnIncludeAccompanistCP();
                                    fnGetAccompanistSFCByID(id);
                                    $.mobile.loading('hide');
                                },
                                error: function () {
                                    fnMsgAlert('Error', 'DCR Header', 'Error');
                                }

                            });
                        }
                    },
                    'Cancel': {
                        click: function () {
                            debugger;
                            $("#drpAccompanist_" + rowIndex).val('0');
                            $("#drpAccompanist_" + rowIndex).selectmenu('refresh');
                            fnIncludeAccompanistCP();
                        }
                    }
                },
                callbackClose: function () {


                },
                width: '350px'
            });
        }
    } else {
        alert('The accompanist name ' + $("#drpAccompanist_" + rowIndex + " :selected").text().trim() + ' is entered more than one time. It is not allowed.');
        $("#drpAccompanist_" + rowIndex).val('0');
        $("#drpAccompanist_" + rowIndex).selectmenu('refresh');
        $("#drpAccompanist_" + rowIndex).attr('disabled', false);

    }
}
//Check Acc_name Duplication
function fnCheckAccDuplicateName() {
    var accName = new Array();
    for (var i = 1; i <= 4; i++) {
        var name = $("#drpAccompanist_" + i + " :selected").text().trim();
        if (name != '' && name != undefined && name != 'Select Accompanist')
            accName.push(name);
    }
    var count = 0;
    for (var i = 0; i < accName.length; i++) {
        for (var j = (i + 1) ; j < accName.length; j++) {
            if (accName[i] == accName[j])
                count = (j + 1);
        }
    }
    if (count == 0)
        return 0;
    else
        return count;

}
//Get Doctor available in DCR 2 screen or not
function fnGetDoctorVisitCount() {
    var count = 0;
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4Header/GetDoctorVisitCount',
        data: "dcr_Date=" + dcrDate,
        async: false,
        success: function (result) {
            count = result;
        }
    });
    return count;
}
function fnResetDDlAccName(rowIndex) {
    // if Region code exist for another acc, we deleted only div not sfc places.
    var isRegionCodeExistForAnotherAcc = false;
    for (var i = 1; i <= $("#dvAccompanist table").length; i++) {
        if ($("#dvAccomp_" + i).is(":visible") && rowIndex != i) {
            if ($("#drpAccompanist_" + i).val() == $("#drpAccompanist_" + rowIndex).val()) {
                isRegionCodeExistForAnotherAcc = true
            }
        }
    }
    if (!isRegionCodeExistForAnotherAcc) {
        if ($("#drpAccompanist_" + rowIndex).val() != "") {
            //sfc_g.remove("Region_Code", $("#drpAccompanist_" + rowIndex).val());
            //Remove the Accompanist CP details 
            //cp_g.remove("", $("#drpAccompanist_" + rowIndex).val());
            //cpHop_g.remove("", $("#drpAccompanist_" + rowIndex).val());
        }

    }

    $("#dvAccomp_" + rowIndex).css('display', 'none');

    if ($("#dvAccompanist table:visible").length < 4) {
        $("#aAddAccomp").css('display', '');
    }
    fnGenerateSFCJson("EVENT");
    fnIncludeAccompanistCP();
}
//New function SFC details
// Old function Get SFC based on ddl this property
function fnGetAccompanistSFCByID(id) {
    debugger;
    if ($(id).val() != "") {
        var row = id;
        var ddlId = 'drpAccompanist_' + id;
        $("#hdnAccompMode_" + row).val('');

        // default checked the only for doctor check box for vacan users.
        if ($('#' + ddlId + " option:selected").text().indexOf('VACANT') > -1 || $('#' + ddlId + " option:selected").text().indexOf('NOT ASSIGNED') > -1) {
            $("#checkbox_" + row).attr('checked', true);
            $("#checkbox_" + row).attr('disabled', true);
            $("#checkbox_" + row).checkboxradio("refresh");
        }
        else {
            $("#checkbox_" + row).attr('disabled', false);
            $("#checkbox_" + row).attr('checked', false);
            $("#checkbox_" + row).checkboxradio("refresh");
        }
        if (accompanistNeed == "YES") {
            var row = id;
            $.ajax({
                type: "POST",
                url: '/HiDoctor_Activity/DCRV4Header/GetSFCData',
                data: "region=" + $("#drpAccompanist_" + row).val() + "&dcrDate=" + dcrDate,
                success: function (jsonSFCresult) {

                    var jsonSFC = jsonSFCresult.data;
                    if (jsonSFC != null && jsonSFC != "") {
                        if (sfc_g == "") {

                            sfc_g = jsonSFC;

                            fnDeleteAccSFC();

                            fnGenerateSFCJson("EVENT");
                        }
                        else {
                            var sfc = jsonSFC;
                            for (var j = 0; j < sfc.length; j++) {
                                sfc_g.push(sfc[j]);
                            }

                            fnDeleteAccSFC();

                            fnGenerateSFCJson("EVENT");
                        }
                    }
                    else {
                        fnDeleteAccSFC();
                        fnGenerateSFCJson("EVENT");
                    }
                    $.mobile.loading('hide');
                }
            });
        }
    }
    else {
        fnDeleteAccSFC();
        fnGenerateSFCJson("EVENT");
    }
}

//--------------------DCR Freeze--------------------------
var g_DCR_Freeze_Status = 'NO';
function GetDCRFreezeStatus() {
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/DCRV4Header/BindDCRFreezeStatus',
        data: "dcr_Date=" + dcrDate,
        async: false,
        success: function (result) {
            if (result != '' && result != undefined)
                g_DCR_Freeze_Status = result;
        },
        error: function () {
        }
    });
}
function fnFreezeDCR() {
    if (g_DCR_Freeze_Status == "YES") {
        //var acc_tbl_row_count = $('#tblAccompanist tr').length;
        for (var i = 1; i <= 4; i++) {
            $("#drpAccompanist_" + i).attr("disabled", true);
            $("#aAccom_" + i).hide();
            $("#spnAccomDelete_" + i).hide();
        }
        $("#txtCP").attr("disabled", true);
        $("#txtCP").css("background-color", "rgb(235, 235, 228)");
        $("#ddlCategory").attr("disabled", true);
        $("#drpWorkPlace").css("background-color", "rgb(235, 235, 228)");
        $("#drpWorkPlace").attr("disabled", true);
        $("#ddlFromPlace_1").attr("disabled", true);
        $("#ddlToPlace_1").attr("disabled", true);
        $("#ddlTravelMode_1").attr("disabled", true);
        $("#aAddAccomp").hide();

        //acc_tbl_row_count = acc_tbl_row_count - 1;
        //$("#tblAccompanist tr:eq(" + acc_tbl_row_count + ")").hide();

        ////SFC Freeze
        var tblLenght = $("#dvSFC > div").length;
        ////Get Distance disabled status
        var txtDistance = $("#txtDistance_1").prop("disabled");

        var empty_count = 0;
        try {
            for (var k = 1; k <= tblLenght; k++) {
                if ($("#hdnIs_TP_SFC_" + k).val() != undefined && $("#hdnIs_TP_SFC_" + k).val() != '' && $("#hdnIs_TP_SFC_" + k).val() == '1') {
                    //hide delete but
                    $("#spnSFCDelete_" + k).hide();

                    empty_count = 0;
                    $("#ddlFromPlace_" + k).attr("disabled", true);
                    if ($("#ddlToPlace_" + k + " :selected").val() != '0')
                        $("#ddlToPlace_" + k).attr("disabled", true);
                    else
                        empty_count++;
                    if ($("#ddlTravelMode_" + k + " :selected").val() != '0')
                        $("#ddlTravelMode_" + k).attr("disabled", true);
                    else
                        empty_count++;

                    if (txtDistance)
                        $("#txtDistance_" + k).attr("disabled", true);

                }
            }
            //If ToPlace and TravelMode is empty that is CIRCLE_ROUTE_APPLICABLE_CATEGORY so hide the last row
            if (intermediateNeed == "YES")
                if ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) == '-1') {
                    //Hide add sfc link
                    $("#aAddSFC").hide();
                }
        }
        catch (e) {
        }
    }
}

////------------------------END - PREFILL THE CP FOR SELECTED ACCOMPANIST--------------------------------/////