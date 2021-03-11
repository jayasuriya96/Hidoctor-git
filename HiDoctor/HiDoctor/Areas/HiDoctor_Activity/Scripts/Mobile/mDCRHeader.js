/*
DCR Header for Mobile
Date : 28-12-2012
*/

//string for accompanist new row
//<span class="ui-icon ui-icon-delete ui-icon-shadow" style="float:right;height:18px;width:18px" onclick="fnAccompanistDelete(DNUM)" id="spnAccomDelete_DNUM">&nbsp;</span>
//<a href="#" data-role="button" data-icon="delete" data-iconpos="notext" onclick="alert(1)">Delete</a>
//<a href="#" style="float:right;" onclick="fnAccompanistDelete(DNUM)" id="spnAccomDelete_DNUM">Delete</a>
//<input name="mode6" id="txtStartTime_DNUM" style="display: inline-block" type="text" data-role="datebox" data-options=\'{"mode":"timebox", "useNewStyle":true}\' />
//<input name="mode6" id="txtEndTime_DNUM" type="text" data-role="datebox" data-options=\'{"mode":"timebox", "useNewStyle":true}\' />

var accString = '<div id="dvAccomp_DNUM" style="border-bottom:1px solid #efefef"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnAccompanistDelete(DNUM)" id="spnAccomDelete_DNUM">Delete</a><table style="width: 100%;"><tbody><tr><td><h5>Accompanist Name</h5></td><td style="display:block"><select name="" style="display:block" data-rel="external" data-inset="true" data-mini="true" id="drpAccompanist_DNUM" class="classaccomp"><option value="0">Select Accompanist</option>';
accString += '</select><input type="hidden" id="hdnAccompanistCode_DNUM" /><a href="" id="aAccom" data-transition="fade" onclick="fnOpenAccompanistPopUp(DNUM)" data-mini="true">Choose Accompanist</a></td></tr><tr><td colspan="2"><div id="dvAccompPop_DNUM" style="display:none"></div></td></tr><tr><td></td><td><input type="checkbox" name="checkbox_DNUM" id="checkbox_DNUM" class="custom" data-mini="true" /><label for="checkbox_DNUM">Independent Call</label>';
accString += '</td></tr>';
accString += '<tr><td><h5>Start Time</h5></td><td>';
accString += '<div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlStartHour_DNUM"><option value="">HH</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlStartMin_DNUM"></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlStartMode_DNUM"><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td></tr>';

accString += '<tr><td><h5>End Time</h5></td><td>';
accString += '<div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlEndHour_DNUM"><option value="">HH</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlEndMin_DNUM"></select></div>';
accString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlEndMode_DNUM"><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td></tr>';
accString += '</tbody></table></div>';

//<span class="ui-icon ui-icon-delete ui-icon-shadow" style="float:right;height:18px;width:18px" onclick="fnSFCDelete(DNUM)" id="spnSFCDelete_DNUM">&nbsp;</span>
//<a href="#" style="float:right;" onclick="fnSFCDelete(DNUM)" id="spnSFCDelete_DNUM">Delete</a>
var sfcString = '<div id="divsfc_DNUM" data-inset="true" style="border-bottom:1px solid gray"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnSFCDelete(DNUM)" id="spnSFCDelete_DNUM">Delete</a><table style="width: 100%"><tr><td><h5>From Place</h5></td><td><select name="" data-mini="true" id="ddlFromPlace_DNUM" class="clsFromPlace"><option value="0">Select FromPlace</option>';
sfcString += '</select><input name="" id="txtFromPlace_DNUM" placeholder="If not listed type here" value="" maxlength="50" type="text" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset fillDist"></td>';
sfcString += '</tr><tr><td><h5>To Place</h5></td><td><select name="" data-mini="true" id="ddlToPlace_DNUM" class="clsToPlace fillDist"><option value="0">Select ToPlace</option>';
sfcString += '</select><input name="" id="txtToPlace_DNUM" maxlength="50" placeholder="If not listed type here" value="" type="text" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset fillDist"></td></tr><tr>';
sfcString += '<td><h5>Travel Mode</h5></td><td><select name="" data-mini="true" id="ddlTravelMode_DNUM" class="clsTravelMode"><option value="0">Select TravelMode</option>';
sfcString += '</select></td></tr><tr><td><h5>Distance</h5></td><td><input name="" class="clsCheckNumeric" maxlength="4" id="txtDistance_DNUM" placeholder="Distance" value="" type="text" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"><input type="hidden" id="hdnDistanceFareCode_DNUM"/>';
sfcString += '<input type="hidden" id="hdnRouteWay_DNUM" /><input type="hidden" id="hdnFromPlace_DNUM" /><input type="hidden" id="hdnToPlace_DNUM" /> ';
sfcString += '</td></tr></table></div>';

//<span class="ui-icon ui-icon-delete ui-icon-shadow" style="float:right;height:18px;width:18px" onclick="fnActivityDelete(DNUM)" id="spnActivityDelete_DNUM">&nbsp;</span>
//<input name="mode6" id="txtstarttime_DNUM" type="text" data-role="datebox" data-options=\'{"mode":"timebox", "useNewStyle":true}\' />
//<input name="mode6" id="txtendtime_DNUM" type="text" data-role="datebox" data-options=\'{"mode":"timebox", "useNewStyle":true}\' />
//<a href="#" style="float:right;" onclick="fnActivityDelete(DNUM)" id="spnActivityDelete_DNUM">Delete</a>

var activityString = '<div id="divactivity_DNUM" data-inset="true" style="border-bottom:1px solid gray"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext" style="float:right;" onclick="fnActivityDelete(DNUM)" id="spnActivityDelete_DNUM">Delete</a><table><tr><td><h5>Activity Name</h5> </td><td><select name="" data-mini="true" id="drpactivity_DNUM" onchange=""><option value="0">Select Activity</option>'
activityString += '</select></td></tr><tr><td><h5>Start Time</h5> </td><td>';
activityString += '<div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActStartHour_DNUM"><option value="">hh</option><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActStartMin_DNUM"></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActStartMode_DNUM"><option value="">--</option><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td>';

activityString += '</tr><tr><td><h5>End Time</h5> </td><td>';
activityString += '<div style="width: 100%; float: left;"><div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActEndHour_DNUM"><option value="">hh</option><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActEndMin_DNUM"></select></div>';
activityString += '<div style="width: 30%; float: left;"><select name="" data-inline="true" data-mini="true" id="ddlActEndMode_DNUM"><option value="">--</option><option value="AM">AM</option><option value="PM">PM</option></select></div></div></td></tr>';
activityString += '<tr><td><h5>Remarks</h5> </td><td><textarea name="" id="txtRemarks_DNUM" placeholder=""></textarea></td></tr></table></div>';



var accompanistPopUp = '<div id="dvAccompPopUp" style="background-color:white;padding:8px">Enter minimum of 3 characters from user name or region name<input id="txtMatching" type="text" /><a href="" id="aGo" data-transition="fade" onclick="fnGetAccompPopup()">Go</a><div id="dvAccompSelectPopUpSub"></div></div>'

var Header_g = "";
var cpJson_g = "", accompanistJson_g = "", travelModeJson_g = "", intermediate_g = "", allUser_g = "";
var accompRow = "", interRow = "";
var otherAccomp = new Array();

// Privilege value variables.
var intermediateNeed = "", accompanistNeed = "", categoryCheckNeeded = "", accMandatory = "";
var sfcValidation = new Array();

//function to include category
function fnCategory() {
    for (var i = 0; i < category_g.length; i++) {
        $('#ddlCategory').append('<option value="' + category_g[i].Value + '" >' + category_g[i].Text + '</option>');
    }
}

//function to set the privileges
function fnSetHeaderPrivileges() {
    var hopNeeded = "", accomp = "", categoryCheck = "", sfcValid = "";
    var hopArr = new Array();

    var accompArr = new Array();
    var categoryArr = new Array();

    // geting privilege value.
    hopNeeded = fnGetPrivilegeValue("DCR_INTERMEDIATE_PLACES", "");
    accomp = fnGetPrivilegeValue("SHOW_ACCOMPANISTS_DATA", "");
    categoryCheck = fnGetPrivilegeValue("SFC_CATEGORY_DONT_CHECK", "");
    sfcValid = fnGetPrivilegeValue("SFC_VALIDATION", "");
    accMandatory = fnGetPrivilegeValue("DCR_ACCOMPANIST_MANDATORY", "0");

    // set the value for validation.
    hopArr = hopNeeded.split(',');
    accompArr = accomp.split(',');
    categoryArr = categoryCheck.split(',');
    sfcValidation = sfcValid.split(',');

    if ($.inArray("DCR", hopArr) > -1) { // check whether the privilege DCR_INTERMEDIATE_PLACES is mapped with the value "DCR".
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
}

//function call from page load
function GetHeaderDetails() {
    
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRHeader/GetHeaderDetails',
            data: "dcrStatus=" + dcrStatus + "&dcrDate=" + dcrDate + "&source=" + source + "&flag=" + flag_g,
            success: function (jsHeaderData) {
                Header_g = jsHeaderData.data;
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
                        cp += "{label:" + '"' + "" + Header_g[0].Data[1].Data[i].CP_No + "" + '",' + "value:" + '"' + "" + Header_g[0].Data[1].Data[i].CP_Code + "" + '"' + "}";
                        if (i < Header_g[0].Data[1].Data.length - 1) {
                            cp += ",";
                        }
                    }
                    cp += "];";
                    cpJson_g = eval(cp);
                }

                //enable autofill for CP and Work Place and validation.
                if (cpNeed != "NO") {
                    fnEnableCPDetails();
                }

                //// generate json for SFC
                fnGenerateSFCJson("LOAD");

                // generate json for travel mode.
                var travelModeArr = new Array("BIKE", "BUS", "TRAIN", "CAR", "TAXI", "AIR", "ROAD");
                var travelMode = "[";
                for (var i = 0; i < travelModeArr.length; i++) {
                    travelMode += "{label:" + '"' + "" + travelModeArr[i] + "" + '",' + "value:" + '"' + "" + travelModeArr[i] + "" + '"' + "}";
                    if (i < travelModeArr.length - 1) {
                        travelMode += ",";
                    }
                }
                travelMode += "];";
                travelModeJson_g = eval(travelMode);

                // Prefill Data.b
                if (!(Header_g[1].Data[0].Data[0] === undefined)) {
                    fnPrefillData();
                }

                else {
                    fnCreateAccompanistTable("N");
                    fnCreateIntermediatePlaceTable("LOAD");
                }

                if (flag_g.toUpperCase() == "A") {
                    fnGetAttendanceDetails();
                }
                //to hide when the intermediate privilege not mapped to DCR
                if (intermediateNeed == "NO") {
                    $("#aAddSFC").css('display', 'none');
                }
                //to remove delete icon for first row in accompansit / SFC
                $("#spnAccomDelete_1").css('display', 'none')
                $("#spnSFCDelete_1").css('display', 'none')

                if ($("#ddlCategory :selected").text().toUpperCase() == "HQ") {
                    $("#aAddSFC").css('display', 'none');
                }
                
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
        $('.classaccomp').blur(function () { fnGetAccompanistSFC(this) });
        $(".classaccomp").focus(function () { fnRemoveSFC(this); });
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
        $('#drpAccompanist_' + rowIndex).blur(function () { fnGetAccompanistSFC(this) });
        $('#drpAccompanist_' + rowIndex).focus(function () { fnRemoveSFC(this); });
    }

}

function fnGetAccompanistSFC(id) {
    if ($(id).val() != "") {
        var row = (id.id).split('_')[1];
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
                url: '/HiDoctor_Activity/DCRHeader/GetSFCData',
                data: "region=" + $("#drpAccompanist_" + row).val(),
                success: function (jsonSFCresult) {
                    var jsonSFC = jsonSFCresult.data;
                    if (jsonSFC != null && jsonSFC != "") {
                        if (Header_g[0].Data[3].Data == "") {
                            Header_g[0].Data[3].Data = jsonSFC;
                            fnGenerateSFCJson("EVENT");
                        }
                        else {
                            var sfc = jsonSFC;
                            for (var j = 0; j < sfc.length; j++) {
                                Header_g[0].Data[3].Data.push(sfc[j]);
                            }
                            fnGenerateSFCJson("EVENT");
                        }
                    }
                    else {
                        fnGenerateSFCJson("EVENT");
                    }
                }
            });
        }
    }
    else {
        fnGenerateSFCJson("EVENT");
    }
}

function fnRemoveSFC(id) {
    var rw = (id.id).split('_')[1];
    if ($("#drpAccompanist_" + rw).val() != "") {
        Header_g[0].Data[3].Data.remove("Region_Code", $("#drpAccompanist_" + rw).val());
    }
}

//Function to enable CP Details
function fnEnableCPDetails() {
    for (var i = 0; i < cpJson_g.length; i++) {
        $('#drpCP').append('<option value="' + cpJson_g[i].value + '" >' + cpJson_g[i].label + '</option>');
        $("#drpCP").selectmenu('refresh');
    }
}

function fnGenerateSFCJson(callFrom) {

    var regionCodeArr = new Array();

    // SFC mapped for his region will come in all the scenarios. And the DCR have no TP or drafted/Unapproved details, no if condition is satisfied.
    // because the SFC mapped for the current region only come in auto fill.
    regionCodeArr.push(currentRegion);
    if (Header_g[1].Data[0] != "" && callFrom == "LOAD") { // if the dcr have TP or drafted/unapproved details
        if (!(Header_g[1].Data[0] == null)) {
            if (accompanistNeed == "YES") { // only if SHOW_ACCOMPANISTS_DATA mapped as "SFC"

                // SFC mapped for the accompanist in TP or Drafted/Unapproved and the current region will come in auto fill.
                if (Header_g[1].Data[0].Data.length > 0 && Header_g[1].Data[0].Data[0] != null) {
                    if (Header_g[1].Data[0].Data[0].Acc1_Name != "") {
                        regionCodeArr.push(Header_g[1].Data[0].Data[0].Acc1_Code);
                    }
                    if (Header_g[1].Data[0].Data[0].Acc2_Name != "") {
                        regionCodeArr.push(Header_g[1].Data[0].Data[0].Acc2_Code);
                    }
                    if (Header_g[1].Data[0].Data[0].Acc3_Name != "") {
                        regionCodeArr.push(Header_g[1].Data[0].Data[0].Acc3_Code);
                    }
                    if (Header_g[1].Data[0].Data[0].Acc4_Name != "") {
                        regionCodeArr.push(Header_g[1].Data[0].Data[0].Acc4_Code);
                    }
                }
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
            sfcJson = jsonPath(Header_g[0].Data[3], "$.Data[?(@.Region_Code=='" + regionCodeArr[i] + "' & @.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
        }
        else {
        sfcJson = jsonPath(Header_g[0].Data[3], "$.Data[?(@.Region_Code=='" + regionCodeArr[i] + "')]");
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
    }
    else {
        if (!isCP) {
            var sfcNewHTML = "";
            sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
            $("#dvSFC").append(sfcNewHTML).trigger('create');

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
            }
            if (objData.Travel_Mode != null) {
                $("#ddlTravelMode_" + parseInt(tbllength + 1)).val(objData.Travel_Mode.toUpperCase());
            }
            $("#txtDistance_" + parseInt(tbllength + 1)).val(objData.Distance);

            $("#ddlTravelMode_" + parseInt(tbllength + 1)).selectmenu('refresh');

            if (hdnRouteWay != "") {
                $("#hdnRouteWay_" + parseInt(tbllength + 1)).val(hdnRouteWay);
            }

        }
        else {
            var sfcNewHTML = "";
            sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
            $("#dvSFC").append(sfcNewHTML).trigger('create');

            fnEnableSFCDetails(parseInt(tbllength + 1), false);

            // to check numeric for distance.
            $(".clsCheckNumeric").blur(function () { return fnCheckNumeric(this) });

            var toPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objCP[0].To_Place + "')]");
            var fromPlace = jsonPath(intermediate_g, "$.[?(@.label=='" + objCP[0].From_Place + "')]");

            //prefill the details
            if (isrouteWay == "R") {
                if (toPlace != false) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(objCP[0].To_Place);
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).val(objCP[0].To_Place);
                }
                if (fromPlace != false) {
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).val(objCP[0].From_Place);
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtToPlace_" + parseInt(tbllength + 1)).val(objCP[0].From_Place);
                }
            }
            else {
                if (fromPlace != false) {
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).val(objCP[0].From_Place);
                    $("#ddlFromPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtFromPlace_" + parseInt(tbllength + 1)).val(objCP[0].From_Place);
                }
                if (toPlace != false) {
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).val(objCP[0].To_Place);
                    $("#ddlToPlace_" + parseInt(tbllength + 1)).selectmenu('refresh');
                }
                else {
                    $("#txtToPlace_" + parseInt(tbllength + 1)).val(objCP[0].To_Place);
                }
            }
            $("#ddlTravelMode_" + parseInt(tbllength + 1)).val(objCP[0].Travel_Mode.toUpperCase());
            $("#txtDistance_" + parseInt(tbllength + 1)).val(objCP[0].Distance);

            $("#ddlTravelMode_" + parseInt(tbllength + 1)).selectmenu('refresh');

            if (hdnRouteWay != "") {
                $("#hdnRouteWay_" + parseInt(tbllength + 1)).val(hdnRouteWay);
            }
        }
        //distance read only
        if (isDistanceReadOnly) {
            $("#txtDistance_" + parseInt(tbllength + 1)).attr('readOnly', 'readOnly')
        }


    }
}

function fnCreateIntermediatePlaceTable(isPrefill) {
    // Readonly assignment for distance
    var isDisReadOnly = false;
    var hdnRouteWay = "";
    var style = "";
    if (Header_g[2].Data.length > 0) {

        var distanceEditJson = jsonPath(Header_g[2], "$.Data[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");
        if (distanceEditJson.length > 0) {
            if (distanceEditJson[0].Distance_Edit == 'R') {
                isDisReadOnly = true;
            }
        }
    }

    //for tp data.
    if (dcrStatus == "1" && source != "TAB" && isPrefill == "Y") {
        // old logic
        if (Header_g[1].Data[1].Data.length <= 0) {
            if (Header_g[1].Data[0].Data[0].Route_Way != null) {
                if (Header_g[1].Data[0].Data[0].Route_Way.toUpperCase() != "R") {
                    fnSFC(Header_g[1].Data[0].Data[0], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                }
                else {
                    fnSFC(Header_g[1].Data[0].Data[0], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                }
            }
            else {
                fnSFC(Header_g[1].Data[0].Data[0], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
            }
            interRow = 2;
        }
            //new logic
        else {
            if (intermediateNeed == "NO") {
                if (Header_g[1].Data[1].Data.length > 0) {
                    //to get the route way.
                    var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + Header_g[1].Data[1].Data[0].To_Place + "' & @.To_Place == '" + Header_g[1].Data[1].Data[0].From_Place + "')");
                    if (distanceJson != false) {
                        fnSFC(Header_g[1].Data[1].Data[0], "D", false, false, isDisReadOnly, "R", false, "");
                    }
                    else {
                        fnSFC(Header_g[1].Data[1].Data[0], "D", false, false, isDisReadOnly, "D", false, "");
                    }
                    interRow = 2;
                }
                else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                    fnSFC("", "", "", "", "", "", true);
                    interRow = 2;
                }
            }
            else {
                if (Header_g[1].Data[1].Data.length > 0) {
                    var count = Header_g[1].Data[1].Data.length;
                    for (var i = 1; i <= count; i++) {
                        //to get the route way.
                        var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' & @.To_Place == '" + Header_g[1].Data[1].Data[i - 1].From_Place + "')");
                        if (distanceJson != false) {
                            fnSFC(Header_g[1].Data[1].Data[i - 1], "D", false, false, isDisReadOnly, "R", false, "");
                        }
                        else {
                            fnSFC(Header_g[1].Data[1].Data[i - 1], "D", false, false, isDisReadOnly, "R", false, "");
                        }
                    }
                    //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                    if ($("#ddlCategory :selected").text() != "HQ") {
                        fnSFC("", "D", false, false, false, "", true, "");
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

    }
        // for prefill data with category "HQ"
    else if ($("#ddlCategory :selected").text() == "HQ" && isPrefill == "Y") {
        if (Header_g[1].Data[0].Data[0].Route_Way.toUpperCase() != "R") {
            fnSFC(Header_g[1].Data[0].Data[0], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
        }
        else {
            fnSFC(Header_g[1].Data[0].Data[0], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
        }
        interRow = 2;
    }
    else if (isPrefill == "Y") {
        // privilege check - "DCR_INTERMEDIATE_PLACES". if it is not mapped with the value "DCR", and the drafted value has the intermediate place, show only the frst record.
        if (intermediateNeed == "NO") {
            if (Header_g[1].Data[0].Data.length > 0) {
                if (Header_g[1].Data[0].Data[0].Route_Way.toUpperCase() != "R") {
                    fnSFC(Header_g[1].Data[0].Data[0], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                }
                else {
                    fnSFC(Header_g[1].Data[0].Data[0], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                }
                interRow = 2;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                fnSFC("", "D", "", "", "", "", true, "");
                interRow = 2;
            }
        }
        else {
            if (Header_g[1].Data[1].Data.length > 0) {
                var count = Header_g[1].Data[1].Data.length;
                for (var i = 1; i <= count; i++) {
                    if (Header_g[1].Data[1].Data[i - 1].Route_Way.toUpperCase() != "R") {
                        fnSFC(Header_g[1].Data[1].Data[i - 1], "D", false, false, isDisReadOnly, hdnRouteWay, false, "");
                    }
                    else {
                        fnSFC(Header_g[1].Data[1].Data[i - 1], "R", false, false, isDisReadOnly, hdnRouteWay, false, "");
                    }
                }
                //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                interRow = parseInt(i) + 1;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                fnSFC("", "D", "", "", "", "", true, "");
                interRow = 2;
            }
        }
    }
        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CP") {
        var cpJson = jsonPath(Header_g[0].Data[1], "$.Data[?(@.CP_No=='" + $("#drpCP :selected").text().toString() + "')]");
        if (cpJson[0].Route_Way.toUpperCase() != "R") {
            fnSFC(cpJson, "D", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
        }
        else {
            fnSFC(cpJson, "R", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
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
        var cpJson = jsonPath(Header_g[0].Data[2], "$.Data[?(@.CP_No=='" + $("#drpCP :selected").text().toString() + "')]");
        if (cpJson.length > 0) {
            $("#drpWorkPlace").val(cpJson[0].Work_Place);
            for (var i = 0; i < cpJson.length; i++) {
                if (cpJson[i].From_Place != "") {
                    if (cpJson[0].Route_Way.toUpperCase() != "R") {
                        fnSFC(cpJson, "D", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
                    }
                    else {
                        fnSFC(cpJson, "R", true, cpJson, isDisReadOnly, hdnRouteWay, false, "");
                    }
                    j++;
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
    }
        // to create empty rows
    else {
        if (isPrefill == "LOAD") {
            fnSFC("", "D", "", "", "", "", true, currRegionName);
        }
        else {
            fnSFC("", "D", "", "", "", "", true, "");
        }
        interRow = 2;
    }

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
    $(".clsFromPlace").blur(function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
    $(".fillDist").blur(function () { if ($(this).val() != "") { fnFillDistanceTravelMode(this.id); } });
}

//CP change
function fnFillCpDetails() {
    $("#dvSFC").empty();
    if (cpNeed == "YES" || cpNeed == "OPTIONAL") { // check the privilege value for CAMPAIGN_PLANNER
        if ($("#drpCP").val() != "") {
            if (Header_g[0].Data[1] != "" || !(Header_g[0].Data[1] === undefined)) {
                var cpJson = jsonPath(Header_g[0].Data[1], "$.Data[?(@.CP_No=='" + $("#drpCP :selected").text().toString() + "')]");
                if (cpJson.length > 0) {
                    $("#ddlCategory").val(cpJson[0].Category);
                    $('#ddlCategory').selectmenu('refresh');
                    $('#drpWorkPlace').val(cpJson[0].Work_Place);
                    fnGenerateSFCJson("EVENT");

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
                    if (cpJson[0].From_Place != "") {
                        fnCreateIntermediatePlaceTable("Y_CP");
                    }
                        // for hop places in CP
                    else if (Header_g[0].Data[2] != "" && cpJson[0].From_Place == "" && Header_g[0].Data[2].Data.length > 0) {
                        fnCreateIntermediatePlaceTable("Y_CPHOP");
                    }

                        // if the hop place and the fromplace to place in CP Master ,both are empty.
                    else {
                        sfnCreateIntermediatePlaceTable("N");
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

function fnPrefillData() {
    if (dcrStatus == "0" && source != "TAB") {
        //$('#divUnapprove').html("Unapproved by: " + Header_g[1].Data[0].Data[0].UnApproveBy + "<br />Unapproval reason: " + Header_g[1].Data[0].Data[0].UnApprovalReason);
        //$('#divUnapprove').css('display', '');
    }

    $("#ddlCategory").val(Header_g[1].Data[0].Data[0].Category);
    $("#ddlCategory").selectmenu('refresh');

    if (cpNeed != "NO") { // check the privilege value
        $("#drpCP").val(Header_g[1].Data[0].Data[0].CP_Code);
        $("#drpCP").selectmenu('refresh');
    }

    if (dcrStatus == "3") {// if it is not a drafted da, it might be TP data. For tp, the work place should be current region in paga load. so don update it.
        $("#drpWorkPlace").val(Header_g[1].Data[0].Data[0].Work_Place);
    }


    var startTime1 = (Header_g[1].Data[0].Data[0].Start_Time == null) ? "" : Header_g[1].Data[0].Data[0].Start_Time;
    var endTime1 = (Header_g[1].Data[0].Data[0].End_Time == null) ? "" : Header_g[1].Data[0].Data[0].End_Time;

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

    fnCreateAccompanistTable("Y");
    fnGenerateSFCJson("EVENT");
    fnCreateIntermediatePlaceTable("Y");

    //To hide the flexi text box in SFC
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        for (var s = 1; s <= $("#dvSFC table").length; s++) {
            $("#txtFromPlace_" + s).css('display', 'none');
            $("#txtToPlace_" + s).css('display', 'none');
        }
    }
   
}

function fnAccompanistTableBind(accName, accCode, isDoctorOnly, startTime, endTime) {
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
        if ($.trim(accName) != "") {
            $('#drpAccompanist_' + parseInt(length + 1) + ' option').map(function () {
                if ($(this).text() == accName) return this;
            }).attr('selected', 'selected');

            //$("#drpAccompanist_" + parseInt(length + 1)).val(accCode);
            $("#drpAccompanist_" + parseInt(length + 1)).selectmenu('refresh');
            if (isDoctorOnly) {
                $("#checkbox_" + parseInt(length + 1)).attr('checked', true);
                if (accName.indexOf('VACANT') > -1 || accName.indexOf('NOT ASSIGNED') > -1) {
                    $("#checkbox_" + parseInt(length + 1)).attr('disabled', true);
                }
                $("#checkbox_" + parseInt(length + 1)).checkboxradio("refresh");
            }

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
        if (isPrefill == "Y") {
            // for applied dcr which have TP data.
            if (dcrStatus == "1" && Header_g[1].Data[0] != "" && source != "TAB") {

                // Old logic
                if (Header_g[1].Data[1].Data.length <= 0) {
                    for (var i = 1; i <= 2; i++) {
                        if (i == 1) {
                            if (!(Header_g[1].Data[0] === undefined)) {
                                fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc1_Name, Header_g[1].Data[0].Data[0].Acc1_Code, false, "", "");
                            }
                        }
                    }
                    accompRow = parseInt(i);
                }
                    //New Logic
                else {
                    var k = 0;
                    for (var i = 1; i <= 4; i++) {
                        if (i == 1 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc1_Name != "" && Header_g[1].Data[0].Data[0].Acc1_Name != 'null') {
                            k++;
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc1_Name, Header_g[1].Data[0].Data[0].Acc1_Code, false, "", "");
                        }
                        else if (i == 2 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc2_Name != "" && Header_g[1].Data[0].Data[0].Acc2_Name != 'null') {
                            k++;
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc2_Name, Header_g[1].Data[0].Data[0].Acc2_Code, false, "", "");
                        }
                        else if (i == 3 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc3_Name != "" && Header_g[1].Data[0].Data[0].Acc3_Name != 'null') {
                            k++;
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc3_Name, Header_g[1].Data[0].Data[0].Acc3_Code, false, "", "");
                        }
                        else if (i == 4 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc4_Name != "" && Header_g[1].Data[0].Data[0].Acc4_Name != 'null') {
                            k++;
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc4_Name, Header_g[1].Data[0].Data[0].Acc4_Code, false, "", "");
                        }
                    }

                    if (k != 4 && k != 0) {
                        fnAccompanistTableBind("", "", false, "", "");
                        accompRow = parseInt(k) + 2;
                    }

                    else if (k == 0) {
                        for (var i = 1; i <= 2; i++) {
                            fnAccompanistTableBind("", "", false, "", "");
                        }
                        accompRow = parseInt(i);
                    }
                }
            }
            // for drafted or un approved data.
            if ((dcrStatus == "3" || dcrStatus == "0" || source == "TAB") && Header_g[1].Data[0] != "") {
                var k = 0;

                for (var i = 1; i <= 4; i++) {
                    if (i == 1 && Header_g[1].Data[0].Data[0].Acc1_Name != "" && Header_g[1].Data[0].Data[0].Acc1_Name != 'null') {
                        k++;
                        if (Header_g[1].Data[0].Data[0].Acc1_Only_For_Doctor.length > 0) {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc1_Name, Header_g[1].Data[0].Data[0].Acc1_Code, true, Header_g[1].Data[0].Data[0].Acc1_Start_Time, Header_g[1].Data[0].Data[0].Acc1_End_Time);
                        }
                        else {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc1_Name, Header_g[1].Data[0].Data[0].Acc1_Code, false, Header_g[1].Data[0].Data[0].Acc1_Start_Time, Header_g[1].Data[0].Data[0].Acc1_End_Time);
                        }
                    }
                    else if (i == 2 && Header_g[1].Data[0].Data[0].Acc2_Name != "" && Header_g[1].Data[0].Data[0].Acc2_Name != 'null') {
                        k++;
                        if (Header_g[1].Data[0].Data[0].Acc2_Only_For_Doctor.length > 0) {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc2_Name, Header_g[1].Data[0].Data[0].Acc2_Code, true, Header_g[1].Data[0].Data[0].Acc2_Start_Time, Header_g[1].Data[0].Data[0].Acc2_End_Time);
                        }
                        else {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc2_Name, Header_g[1].Data[0].Data[0].Acc2_Code, false, Header_g[1].Data[0].Data[0].Acc2_Start_Time, Header_g[1].Data[0].Data[0].Acc2_End_Time);
                        }
                    }
                    else if (i == 3 && Header_g[1].Data[0].Data[0].Acc3_Name != "" && Header_g[1].Data[0].Data[0].Acc3_Name != 'null') {
                        k++;
                        if (Header_g[1].Data[0].Data[0].Acc3_Only_For_Doctor.length > 0) {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc3_Name, Header_g[1].Data[0].Data[0].Acc3_Code, true, Header_g[1].Data[0].Data[0].Acc3_Start_Time, Header_g[1].Data[0].Data[0].Acc3_End_Time);
                        }
                        else {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc3_Name, Header_g[1].Data[0].Data[0].Acc3_Code, false, Header_g[1].Data[0].Data[0].Acc3_Start_Time, Header_g[1].Data[0].Data[0].Acc3_End_Time);
                        }
                    }
                    else if (i == 4 && Header_g[1].Data[0].Data[0].Acc4_Name != "" && Header_g[1].Data[0].Data[0].Acc4_Name != 'null') {
                        k++;
                        if (Header_g[1].Data[0].Data[0].Acc4_Only_For_Doctor.length > 0) {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc4_Name, Header_g[1].Data[0].Data[0].Acc4_Code, true, Header_g[1].Data[0].Data[0].Acc4_Start_Time, Header_g[1].Data[0].Data[0].Acc4_End_Time);
                        }
                        else {
                            fnAccompanistTableBind(Header_g[1].Data[0].Data[0].Acc4_Name, Header_g[1].Data[0].Data[0].Acc4_Code, false, Header_g[1].Data[0].Data[0].Acc4_Start_Time, Header_g[1].Data[0].Data[0].Acc4_End_Time);
                        }
                        accompRow = k + 1;
                    }
                }
                if (k != 4 && k != 0) {
                    fnAccompanistTableBind("", "", false, "", "");
                    accompRow = parseInt(k) + 2;
                }

                else if (k == 0) {
                    for (var i = 1; i <= 2; i++) {
                        fnAccompanistTableBind("", "", false, "", "");
                    }
                    accompRow = parseInt(i);
                }
            }
        }
        else {
            for (var i = 1; i <= 2; i++) {
                fnAccompanistTableBind("", "", false, "", "");
            }
            accompRow = parseInt(i);
        }
    }
}

//function to create new accompanist row
function fnCreateNewRowInAccompanist() {
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
    if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        var sfcNewHTML = "";
        sfcNewHTML = sfcString.replace(/DNUM/g, parseInt(tbllength + 1));
        $("#dvSFC").append(sfcNewHTML).trigger('create');
        fnEnableSFCDetails(parseInt(tbllength + 1), false);

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
    if (Header_g[2].Data.length > 0) {
        var distanceEditJson = jsonPath(Header_g[2], "$.Data[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");
        if (distanceEditJson.length > 0) {
            if (distanceEditJson[0].Distance_Edit == 'R') {
                $("#txtDistance_" + parseInt(tbllength + 1)).attr('readOnly', 'readOnly')
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
                if ($("#drpCP").val() == "0") {
                    fnMsgAlert("info", "DCR Header", "Please enter the field 'Cp No'.");
                    $("#drpCP").focus();
                    return false;
                }
            }

            if (Header_g[0].Data[1] != null && !(Header_g[0].Data[1] === undefined) && Header_g[0].Data[1] != "") {
                if (Header_g[0].Data[1].Data.length > 0) {
                    var cpJson = jsonPath(Header_g[0].Data[1], "$.Data[?(@.CP_No=='" + $("#drpCP").val() + "')]");
                    if (cpJson.length > 0) {
                        if (cpJson[0].Category_Name != null && cpJson[0].Category_Name != "") {
                            if (cpJson[0].Category_Name.toUpperCase() != $("#ddlCategory :selected").text().toUpperCase()) {
                                fnMsgAlert('info', 'DCR Header', 'The Entered CP No "' + $("#CP_No").val() + '" does not belong to category ' + $("#ddlCategory :selected").text() + ' . Please check the CP master for correct CP No.');
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

    // for all the category, atleast one record is mandatory for the following fields.
    if ($("#ddlFromPlace_1").val() == "0") {
        if ($("#txtFromPlace_1").val() == "") {
            fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
            $("#ddlFromPlace_1").focus();
            $("#txtFromPlace").focus();
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
                            if ($("#txtFromPlace_" + i).val() == "") {
                                fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
                                $("#ddlFromPlace_" + i).focus();
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
                        }
                        if ($("#ddlToPlace_" + i).val() == "0") {
                            if ($("#txtToPlace_" + i).val() == "") {
                                fnMsgAlert("info", "DCR Header", "Please enter the field 'To Place'. ");
                                $("#ddlToPlace_" + i).focus();
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
    alert(1);
    for (var i = 1; i <= $("#dvSFC table").length; i++) {

        if ($("#divsfc_" + i).is(":visible")) {
            if ($("#ddlFromPlace_" + i).val() != "0") {
                
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (Header_g[0].Data[3] != "" || !(Header_g[0].Data[3] === undefined)) {
                        var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + $("#ddlFromPlace_" + i).val() + "' & @.To_Place == '" + $("#ddlToPlace_" + i).val() + "' & @.Distance == '" + $("#txtDistance_" + i).val() + "') | (@.From_Place=='" + $("#ddlToPlace_" + i).val() + "' & @.To_Place == '" + $("#ddlFromPlace_" + i).val() + "' & @.Distance == '" + $("#txtDistance_" + i).val() + "'))]");
                        if (!(distanceJson === undefined) && distanceJson.length > 0) {
                            if (categoryCheckNeeded == "YES") { // SFC_CATEGORY_DON_CHECK privilege.
                                if ($("#ddlCategory :selected").text().toUpperCase() != distanceJson[0].Category_Name.toUpperCase()) {
                                    fnMsgAlert('info', 'DCR Header', 'The entered route is not available in your SFC master.');
                                    $("#txtToPlace_" + i).focus();
                                    $("#txtFromPlace_" + i).focus();
                                    return false;
                                }
                            }
                        }
                        else {
                            fnMsgAlert('info', 'DCR Header', 'The entered route is not available in your SFC master.');
                            $("#txtToPlace_" + i).focus();
                            $("#txtFromPlace_" + i).focus();
                            return false;
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
            if (accompcount <= accMandatory) { // DCR_ACCOMPANIST_MANDATORY privilege check.
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
        if ($('#ddlEndHour').val() != "") {
            fnMsgAlert('info', 'DCR Header', 'Please choose the hour in To Time.');
            return false;
        }
        if ($('#ddlEndMin').val() != "") {
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
                        if (!(fnCheckRemarksSpecialChar("#txtRemarks_" + i))) {
                            fnMsgAlert('info', 'DCR Header', "Please remove remarks special character for the activity " + $("#txtactivity_" + i + " :selected").text());
                            return false;
                        }
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
    var isTrue = Boolean(true);
    isTrue = fnValidateHeader();
    if (isTrue) {
        var cpCode = "null", cpName = "null", workPlace = "null", fromPlace = "null", toPlace = "null", travelMode = "null", distance = "null", startTime = "null", endTime = "null", distanceFareCode = "null", routeWay = "null";
        var acc1Name = "null", acc1Type = "null", acc1StartTime = "null", acc1EndTime = "null", acc1OnlyDoctor = "";
        var acc2Name = "null", acc2Type = "null", acc2StartTime = "null", acc2EndTime = "null", acc2OnlyDoctor = "";
        var acc3Name = "null", acc3Time = "null", acc3OnlyDoctor = "";
        var acc4Name = "null", acc4Time = "null", acc4OnlyDoctor = "";
        var category = "", entityCode = "";
        var intermediateData = "";

        // get CP values
        if (flag_g.toUpperCase() != "A") {
            if (cpNeed == "YES") {
                cpCode = $("#drpCP").val();
                cpName = $("#drpCP :selected").text();
            }
            else if (cpNeed == "OPTIONAL") {
                if ($("#hdnCPCode").val() != "") {
                    cpCode = $("#drpCP").val();
                    cpName = $("#drpCP :selected").text();
                }
                else {
                    cpCode = $("#drpCP").val();
                    cpName = $("#drpCP").val();
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
        }
        else {
            if (intermediateNeed == "NO") {
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
                distance = travelKm.toString();
            }
        }

        if (flag_g.toUpperCase() != "A") {
            //get accompanist value
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
                            if ($("#checkbox_" + i + "").attr('checked')) {
                                //acc1OnlyDoctor = acc1Name;
                                acc1OnlyDoctor = $("#drpAccompanist_" + i + " :selected").val();
                                acc1Name = "";
                                acc1Type = "";
                            }
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

        if (dcrStatus == "1") {
            var tpDeviation = 'Y';
            var cpDeviation = 'N';
            if (Header_g[1].Data != null && Header_g[1].Data[0].Data != null > 0 && Header_g[1].Data[0].Data.length > 0) {

                // Only for new TP
                if (Header_g[1].Data[1].Data.length > 0) {
                    cpDeviation = (Header_g[1].Data[0].Data[0].CPDeviation == null) ? "N" : Header_g[1].Data[0].Data[0].CPDeviation;

                    // tp deviation for sfc

                    var tpSFCArr = new Array();
                    for (k = 0; k < Header_g[1].Data[1].Data.length; k++) {

                        //to get the route way.
                        var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + Header_g[1].Data[1].Data[k].To_Place + "' & @.To_Place == '" + Header_g[1].Data[1].Data[k].From_Place + "')");
                        if (distanceJson != false) {
                            tpSFCArr.push(Header_g[1].Data[1].Data[k].From_Place + '_' + Header_g[1].Data[1].Data[k].To_Place + '_R');
                        }
                        else {
                            tpSFCArr.push(Header_g[1].Data[1].Data[k].From_Place + '_' + Header_g[1].Data[1].Data[k].To_Place + '_D');
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
                        if (Header_g[1].Data[0].Data[0].CP_No == tpCPName) {  // CP check  
                            //TP accompanist
                            var tpAccompanistArr = new Array();

                            if ((Header_g[1].Data[0].Data[0].Acc1_Code != null && Header_g[1].Data[0].Data[0].Acc1_Code != '') || Header_g[1].Data[0].Data[0].Acc1_Only_For_Doctor.length > 0) {
                                tpAccompanistArr.push(Header_g[1].Data[0].Data[0].Acc1_Code + '_' + ((Header_g[1].Data[0].Data[0].Acc1_Only_For_Doctor.length > 0) ? "Y" : "N"));
                            }
                            if ((Header_g[1].Data[0].Data[0].Acc2_Code != null && Header_g[1].Data[0].Data[0].Acc2_Code != '') || Header_g[1].Data[0].Data[0].Acc2_Only_For_Doctor.length > 0) {
                                tpAccompanistArr.push(Header_g[1].Data[0].Data[0].Acc2_Code + '_' + ((Header_g[1].Data[0].Data[0].Acc2_Only_For_Doctor.length > 0) ? "Y" : "N"));
                            }
                            if ((Header_g[1].Data[0].Data[0].Acc3_Code != null && Header_g[1].Data[0].Data[0].Acc3_Code != '') || Header_g[1].Data[0].Data[0].Acc3_Only_For_Doctor.length > 0) {
                                tpAccompanistArr.push(Header_g[1].Data[0].Data[0].Acc3_Code + '_' + ((Header_g[1].Data[0].Data[0].Acc3_Only_For_Doctor.length > 0) ? "Y" : "N"));
                            }
                            if ((Header_g[1].Data[0].Data[0].Acc4_Code != null && Header_g[1].Data[0].Data[0].Acc4_Code != '') || Header_g[1].Data[0].Data[0].Acc4_Only_For_Doctor.length > 0) {
                                tpAccompanistArr.push(Header_g[1].Data[0].Data[0].Acc4_Code + '_' + ((Header_g[1].Data[0].Data[0].Acc4_Only_For_Doctor.length > 0) ? "Y" : "N"));
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

                    // for old TP
                else {
                    cpDeviation = 'N';
                    var tempTPDeviation = "N";
                    for (var i = 1; i <= $("#dvSFC table").length; i++) {
                        var fromPlaceTPDev = "";
                        var toPlaceTPDev = "";
                        //check for if not list type here

                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) == -1) {
                            if ($("#ddlFromPlace_" + i).val() == "0") {
                                fromPlaceTPDev = $('#txtFromPlace_' + i).val();
                            }
                            else {
                                fromPlaceTPDev = $("#ddlFromPlace_" + i).val();
                            }
                            if ($("#ddlToPlace_" + i).val() == "0") {
                                toPlaceTPDev = $('#txtToPlace_' + i).val();
                            }
                            else {
                                toPlaceTPDev = $("#ddlToPlace_" + i).val();
                            }
                        }
                        else {
                            fromPlaceTPDev = $('#ddlFromPlace_' + i).val();
                            toPlaceTPDev = $('#ddlToPlace_' + i).val();
                        }

                        if (Header_g[1].Data[0].Data[0].Route_Way == "R") {
                            if (Header_g[1].Data[0].Data[0].From_Place != toPlaceTPDev || Header_g[1].Data[0].Data[0].To_Place != fromPlaceTPDev) {
                                tempTPDeviation = 'Y';
                                break;
                            }
                        }
                        else {
                            if (Header_g[1].Data[0].Data[0].From_Place != fromPlaceTPDev || Header_g[1].Data[0].Data[0].To_Place != toPlaceTPDev) {
                                tempTPDeviation = 'Y';
                                break;
                            }
                        }
                    }
                    if (tempTPDeviation == "N") {
                        tpDeviation = 'N';
                    }

                    if (flag_g.toUpperCase() == "F" && tpDeviation == 'N') {
                        var tpCPName = cpName == "null" ? "" : cpName;
                        if (Header_g[1].Data[0].Data[0].CP_No == tpCPName) {  // CP check   
                            if (Header_g[1].Data[0].Data[0].Acc1_Name == $("#drpAccompanist_1 :selected").text() || Header_g[1].Data[0].Data[0].Acc1_Name == $("#drpAccompanist_2 :selected").text() || Header_g[1].Data[0].Data[0].Acc1_Name == $("#drpAccompanist_3 :selected").text() || Header_g[1].Data[0].Data[0].Acc1_Name == $("#drpAccompanist_4 :selected").text()) {
                                tpDeviation = 'N';
                            }
                            else {
                                tpDeviation = 'Y';
                            }
                        }
                        else {
                            tpDeviation = 'Y';
                        }
                    }
                }

            }
            else {
                tpDeviation = 'N';
            }
        }
        else {
            if (Header_g[1].Data != null && Header_g[1].Data[0].Data != null > 0 && Header_g[1].Data[0].Data.length > 0) {
                var tpDeviation = Header_g[1].Data[0].Data[0].TPDeviation;
                var cpDeviation = Header_g[1].Data[0].Data[0].CPDeviation;
            }
        }

        //call insert
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRHeader/InsertHeader',
            data: "dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&cpCode=" + escape(cpCode) + "&cpName=" + escape(cpName) + "&workPlace=" + escape(workPlace) +
            "&fromPlace=" + escape(fromPlace) + "&toPlace=" + escape(toPlace) + "&travelMode=" + travelMode + "&distance=" + distance + "&startTime=" + startTime +
            "&endTime=" + endTime + "&distanceFareCode=" + distanceFareCode + "&routeWay=" + routeWay + "&acc1Name=" + acc1Name + "&acc1Type=" + acc1Type +
            "&acc1StartTime=" + escape(acc1StartTime) + "&acc1EndTime=" + escape(acc1EndTime) + "&acc1OnlyDoctor=" + acc1OnlyDoctor + "&acc2Name=" + acc2Name +
            "&acc2Type=" + acc2Type + "&acc2StartTime=" + escape(acc2StartTime) + "&acc2EndTime=" + escape(acc2EndTime) + "&acc2OnlyDoctor=" + acc2OnlyDoctor +
            "&acc3Name=" + acc3Name + "&acc3Time=" + escape(acc3Time) + "&acc3OnlyDoctor=" + acc3OnlyDoctor + "&acc4Name=" + acc4Name + "&acc4Time=" + escape(acc4Time) +
            "&acc4OnlyDoctor=" + acc4OnlyDoctor + "&intermediateData=" + escape(intermediateData) + "&isrcpa=" + isrcpa + "&category=" + escape(category) +
            "&categoryCode=" + entityCode + "&activityString=" + activityString + "&flag=" + flag_g + "&tpDeviation=" + tpDeviation + "&cpDeviation=" + cpDeviation + "&entryMode=MOBILE",
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

    if (dcrStatus == '1') {// tp data exist oly when dcr is in applied mode.
        if (Header_g[1].Data[0] != "" && !(Header_g[1].Data[0] === undefined)) {
            if (!(Header_g[1].Data[0].Data[0] === undefined)) {
                tpCode = Header_g[1].Data[0].Data[0].Tp_Code;
            }
        }
    }

    // get cpCode
    if ($("#drpCP").val() != "0") {
        cpCode = $("#drpCP").val();
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
        $.mobile.changePage("/HiDoctor_Activity/MobileHome/Index/?dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&isrcpa=" + isrcpa + "&source=TAB&flag=A&travelKm=" + travelKm, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
    else {
        $.mobile.changePage("/HiDoctor_Activity/MobileHome/Index/?dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&isrcpa=" + isrcpa + "&source=TAB&flag=F&travelKm=" + travelKm, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }

}

//on blur of to place this function call
function fnFillDistanceTravelMode(id) {
    // SFC autofill = Header_g[0].Data[3]   
    var rCnt = id.split('_')[1];
    if (Header_g[0].Data[3] != "" || !(Header_g[0].Data[3] === undefined)) {

        var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlToPlace_" + rCnt + " :selected").text() + "') | (@.From_Place=='" + $("#ddlToPlace_" + rCnt + " :selected").text() + "' & @.To_Place == '" + $("#ddlFromPlace_" + rCnt + " :selected").text() + "'))]");

        if (!(distanceJson === undefined) && distanceJson.length > 0) {
            if (categoryCheckNeeded == "YES") {
                if ($("#ddlCategory :selected").text().toUpperCase() == distanceJson[0].Category_Name.toUpperCase()) {
                    $("#txtDistance_" + rCnt).val(distanceJson[0].Distance);

                    $("#ddlTravelMode_" + rCnt).val(distanceJson[0].Travel_Mode.toUpperCase());
                    $("#ddlTravelMode_" + rCnt).selectmenu('refresh');

                    $("#hdnDistanceFareCode_" + rCnt).val(distanceJson[0].Distance_Fare_Code);
                    if ($("#ddlFromPlace_" + rCnt + " :selected").text() == distanceJson[0].To_Place && $("#ddlToPlace_" + rCnt + " :selected").text() == distanceJson[0].From_Place) {
                        $("#hdnRouteWay_" + rCnt).val("R");
                    }
                    else {
                        $("#hdnRouteWay_" + rCnt).val("D");
                    }
                }
                else {
                    $("#txtDistance_" + rCnt).val("0");
                    $("#ddlTravelMode_" + rCnt).val("0");
                    $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

                    $("#hdnDistanceFareCode_" + rCnt).val("");
                    $("#hdnRouteWay_" + rCnt).val("");
                }
            }
            else {
                $("#txtDistance_" + rCnt).val(distanceJson[0].Distance);
                $("#ddlTravelMode_" + rCnt).val(distanceJson[0].Travel_Mode.toUpperCase());
                $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

                $("#hdnDistanceFareCode_" + rCnt).val(distanceJson[0].Distance_Fare_Code);
                if ($("#txtFromPlace_" + rCnt).val() == distanceJson[0].To_Place && $("#txtToPlace_" + rCnt).val() == distanceJson[0].From_Place) {
                    $("#hdnRouteWay_" + rCnt).val("R");
                }
                else {
                    $("#hdnRouteWay_" + rCnt).val("D");
                }
            }
        }

            // if no from place to place combination found.
        else {
            $("#txtDistance_" + rCnt).val("0");
            $("#ddlTravelMode_" + rCnt).val("0");
            $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

            $("#hdnDistanceFareCode_" + rCnt).val("");
            $("#hdnRouteWay_" + rCnt).val("");
        }
    }
        // if no from place to place combination found.
    else {
        $("#txtDistance_" + rCnt).val("0");
        $("#ddlTravelMode_" + rCnt).val("0");
        $("#ddlTravelMode_" + rCnt).selectmenu("refresh");

        $("#hdnDistanceFareCode_" + rCnt).val("");
        $("#hdnRouteWay_" + rCnt).val("");
    }
}

function fnCategorySelected() {
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
        $("#aAddSFC").css('display', '');
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
}

//function to delete accompanist row
function fnAccompanistDelete(rowIndex) {
    if (rowIndex == "1") {
        fnMsgAlert("info", "DCR Header", "You can't delete this row");
    }
    else {
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
                Header_g[0].Data[3].Data.remove("Region_Code", $("#drpAccompanist_" + rowIndex).val());
            }
            fnGenerateSFCJson("EVENT");
        }

        $("#dvAccomp_" + rowIndex).css('display', 'none');

        if ($("#dvAccompanist table:visible").length < 4) {
            $("#aAddAccomp").css('display', '');
        }
    }
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
        url: '/HiDoctor_Activity/DCRHeader/GetAccompanistPopUpData',
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
        Header_g[0].Data[3].Data.remove("Region_Code", $('#drpAccompanist_' + accId).val());
    }

    //to append the new accompanist and select the name
    $('#drpAccompanist_' + accId).append('<option value="' + $("#lblAcc_" + row).html().split('^')[0] + '" >' + $("#lblAcc_" + row).html().split('^')[1] + '</option>');
    $('#drpAccompanist_' + accId).selectmenu('refresh');

    $('#drpAccompanist_' + accId + ' option').map(function () {
        if ($(this).text() == $("#lblAcc_" + row).html().split('^')[1]) return this;
    }).attr('selected', 'selected');
    $('#drpAccompanist_' + accId).selectmenu('refresh');

    $('#txtMatching').val('');
    $("#hdnAccompPopUP").val('');
    otherAccomp.push($("#lblAcc_" + row).html().split('^')[1]);


    $("#dvAccompPopUp").css('display', 'none');
    if (accompanistNeed == "YES") {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/DCRHeader/GetSFCData',
            data: "region=" + $('#drpAccompanist_' + accId).val(),
            success: function (jsonSFCresult) {
                var jsonSFC = jsonSFCresult.data;
                if (jsonSFC != null && jsonSFC != "") {
                    if (Header_g[0].Data[3].Data == "") {
                        Header_g[0].Data[3].Data = jsonSFC;
                        fnGenerateSFCJson("EVENT");
                    }
                    else {
                        var sfc = jsonSFC;
                        for (var j = 0; j < sfc.length; j++) {
                            Header_g[0].Data[3].Data.push(sfc[j]);
                        }
                        fnGenerateSFCJson("EVENT");
                    }
                }
            }
        });
    }
}

//Attendance
function fnGetAttendanceDetails() {

    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRHeader/GetActivityJSON',
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
    for (var i = 0; i < Header_g[3].Data.length; i++) {
        fnGenerateActivitytable(Header_g[3].Data[i]);
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
            $("#ddlActStartMin_" + parseInt(length + 1)).val(startTime1.split(':')[1].split(' ')[0]);
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

            $("#ddlActEndMin_" + parseInt(length + 1)).val(endTime1.split(':')[1].split(' ')[0]);
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