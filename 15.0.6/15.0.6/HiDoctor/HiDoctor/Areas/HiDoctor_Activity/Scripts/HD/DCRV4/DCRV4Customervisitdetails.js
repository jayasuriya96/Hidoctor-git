

//***** JSON string detail *****

// AutoFill data = Header_g[0]
// Prefill data = Header_g[1].Data[0] (either tp detail or drafted detail.)
// Intermediate = Header_g[1].Data[1]
// Accompanist autofill = Header_g[0].Data[0]
// CP autofill = Header_g[0].Data[1]
// CP Hop Validation = Header_g[0].Data[2]
// SFC autofill = Header_g[0].Data[3]
// Expense Mapping = Header[2],

//******** END ********
var prefill_g = "", prefillHop_g = "", sfc_g = "", atten_g = "", cp_g = "", cpHop_g = "", distEdit = "", docAccomp_g = "", TP_g = "", TPSFC_g = ""; AccompMsg = "";
var Acc_Id_g = [];
var allowCharacterinAttendatesDCR = "-_.,()";
var chemist_visit_check = true;
var chemist_dco_count_g = 0;
var cpJson_g = "", accompanistJson_g = "", travelModeJson_g = "", travelModeFullJson_g = "", intermediate_g = "", allUser_g = "";
var accompRow = "", interRow = "";
var otherAccomp = new Array();
// Privilege value variables.
var intermediateNeed = "", accompanistNeed = "", accompanistCPNeed = "", categoryCheckNeeded = "", accMandatory = "", isRouteComplete = "";
var sfcValidation = new Array();
var hopRouteCategory = new Array();
var accRegions_g = [];
var accAutoFill_g = new Array();
function fnBindCategory(category) {
    if (category.length > 0) {
        for (var c = 0; c < category.length; c++) {
            $("#ddlCategory").append("<option value=" + category[c].value + ">" + category[c].text + "</option>");
        }
    }
}

function GetHeaderDetails() {
    try {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/GetHeaderDetails',
            data: "dcrStatus=" + dcrStatus + "&dcrDate=" + dcrDate + "&source=" + source + "&flag=" + flag_g,
            success: function (jsHeaderData) {
                debugger;
                var Header_g = "";
                Header_g = jsHeaderData.data;
                if (Header_g[1].Data[0] !== undefined && Header_g[1].Data[0].Data !== undefined && Header_g[1].Data[0].Data != null && Header_g[1].Data[0].Data.length > 0) {
                    prefill_g = Header_g[1].Data[0].Data;

                }
                if (Header_g[1].Data[1] !== undefined && Header_g[1].Data[1].Data !== undefined && Header_g[1].Data[1].Data != null && Header_g[1].Data[1].Data.length > 0) {
                    prefillHop_g = Header_g[1].Data[1].Data;
                }
                if (Header_g[0].Data[3] !== undefined && Header_g[0].Data[3].Data !== undefined && Header_g[0].Data[3].Data != null && Header_g[0].Data[3].Data.length > 0) {
                    sfc_g = Header_g[0].Data[3].Data;
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
                if (Header_g[5] != undefined && Header_g[5].Data !== undefined && Header_g[5].Data.length > 0) {
                    AccompMsg = Header_g[5].Data;
                }

                if (flag_g.toUpperCase() == 'A' && atten_g != "") {
                    if (atten_g[0].Data_From != 'WA') {
                        prefill_g = [];
                        prefill_g.push({
                            From_Place: atten_g[0].From_Place,
                            To_Place: atten_g[0].To_Place,
                            Route_Way: atten_g[0].Route_Way,
                            Distance: atten_g[0].Distance,
                            Travel_Mode: atten_g[0].Travel_Mode,
                            Distance_Fare_Code: atten_g[0].Distance_Fare_Code,
                            Data_From: atten_g[0].Data_From,
                            SFC_Version_No: atten_g[0].SFC_Version_No,
                            SFC_Region_Code: atten_g[0].SFC_Region_Code,
                            SFC_Category_Name: atten_g[0].SFC_Category_Name
                        });

                    }
                    else {
                        prefill_g = [];
                        prefill_g.push({
                            From_Place: "", To_Place: "", Route_Way: "", Distance: "0",
                            Travel_Mode: "", Distance_Fare_Code: "", Data_From: atten_g[0].Data_From,
                            SFC_Version_No: "0",
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

                // generate json for cp.
                if (cpNeed != "NO") {
                    var cp = "[";
                    for (var i = 0; i < Header_g[0].Data[1].Data.length; i++) {
                        cp += "{label:" + '"' + "" + Header_g[0].Data[1].Data[i].CP_No + "_" + Header_g[0].Data[1].Data[i].Region_Name + '",' + "value:" + '"' + "" + Header_g[0].Data[1].Data[i].CP_Code + "" + '"' + "}";
                        if (i < Header_g[0].Data[1].Data.length - 1) {
                            cp += ",";
                        }
                    }
                    cp += "];";
                    cpJson_g = eval(cp);
                }

                // generate json for SFC
                fnGenerateSFCJson("LOAD");



                //enable autofill for CP and Work Place and validation.
                if (cpNeed != "NO") {
                    autoComplete(cpJson_g, "CP_No", "hdnCPCode", 'autoCP');
                }
                autoComplete(intermediate_g, "Work_Place", "hdnWorkPlace", 'autoIntermediateWork');

                // Prefill Data.
                if (flag_g.toUpperCase() != "A") {
                    if (!(prefill_g[0] === undefined)) {
                        fnPrefillData();
                        HideModalPopup('dvLoading');
                        $('#divHeaderLoad').css('display', '');
                    }
                    else {
                        fnSetIntermediatePrivilege();
                        fnCreateAccompanistTable("N");

                        fnCreateIntermediatePlaceTable("LOAD");
                        HideModalPopup('dvLoading');
                        $('#divHeaderLoad').css('display', '');
                    }
                }
                else {

                    fnGetAttendanceDetails();
                    if (atten_g != "") {
                        fnPrefillAttendance();
                        HideModalPopup('dvLoading');
                        $('#divHeaderLoad').css('display', '');
                    }
                    else {
                        fnCreateIntermediatePlaceTable("LOAD");
                        HideModalPopup('dvLoading');
                        $('#divHeaderLoad').css('display', '');
                    }
                }

                //
                fnDeleteAccSFC();
                GetDCRFreezeStatus();
                fnFreezeDCR();
            },
            error: function (e) {
                fnMsgAlert('error', 'DCR Header', 'Error. ' + e.Message);
            }
        });
        //Freeze Start

    }
    catch (e) {
        alert("Error:" + e.message);
    }
}
function fnGetAccompanistRegionCodes() {
    if (acc_g != null) {
        for (var a = 0; a < acc_g.length; a++) {
            acc_Regions_g = acc_Regions_g + acc_g[a].accCode + "^";
        }
    }
}
function fnGetAttendanceDetails() {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRV4Header/GetActivityJSON',
        success: function (response) {
            var result = eval('(' + response + ')');
            var actvistyJSON = "[";

            for (var i = 0; i < result.Rows.length; i++) {
                var activityName = result.Rows[i].Activity_Name + "(" + result.Rows[i].Project_Name + ")";
                actvistyJSON += "{label:" + '"' + "" + activityName + "" + '",' + "value:" + '"' + "" + result.Rows[i].Activity_Code + "_" + result.Rows[i].Project_Code + "" + '"' + "},";
            }
            actvistyJSON = actvistyJSON.slice(0, -1);
            actvistyJSON += "]";
            debugger;
            try {
                activityJSON_g = eval(actvistyJSON);
                $('#dvactivity').css('display', '');
            }
            catch (e) {
                $("#lblActivity").hide();
            }
            if (dcrStatus == '1' && source != 'TAB') {
                fnGetActivityDetails();
            }
            else if (dcrStatus == '3' || source == 'TAB' || dcrStatus == '0') {

                fnGetActivityDetails();
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'DCR Header', 'Error.');
            // $.msgbox("Get Activity Failed.", { type: "error" });
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

    var rowIndex = $('#tblActivity tr').length - 1;
    rowIndex = rowIndex + 1;
    var newListRow = document.getElementById('tblActivity').insertRow(parseInt(rowIndex));
    if (activityJson != null) {
        var td1 = newListRow.insertCell(0);
        $(td1).html("<input type='text' id='txtactivity_" + rowIndex + "' value='" + activityJson.Activity_Name + "' class='autoactivity' onclick='$(this).select();' style='width:300px'   /><input type='hidden' id='hdnactivity_" + rowIndex + "' value='" + activityJson.Activity_Code + "' />");
        $(td1).css('vertical-align', 'top');

        var td2 = newListRow.insertCell(1);
        $(td2).html("<input type='text' id='txtstarttime_" + rowIndex + "' value='" + activityJson.Start_Time + "' style='width:100%' onclick='$(this).select();' class='time'  />");
        $(td2).css('vertical-align', 'top');

        var td3 = newListRow.insertCell(2);
        $(td3).html("<input type='text' id='txtendtime_" + rowIndex + "' value='" + activityJson.End_Time + "' style='width:100%' onclick='$(this).select();'  class='time'  />");
        $(td3).css('vertical-align', 'top');

        var td4 = newListRow.insertCell(3);
        $(td4).html("<textarea id='txtRemarks_" + rowIndex + "' style='width:300px' class='checkspecialchar'  onclick='$(this).select();' >" + activityJson.Remarks + "</textarea>");
    }
    else {
        var td1 = newListRow.insertCell(0);
        $(td1).html("<input type='text' id='txtactivity_" + rowIndex + "' class='autoactivity' style='width:300px' onclick='$(this).select();'  onkeyup='fnactivityRowCreation(this)' ondblclick='fnactivityRowCreation(this)' /><input type='hidden' id='hdnactivity_" + rowIndex + "' valign='top'  />");
        $(td1).css('vertical-align', 'top');

        var td2 = newListRow.insertCell(1);
        $(td2).html("<input type='text' id='txtstarttime_" + rowIndex + "' style='width:100%' class='time' onclick='$(this).select();' valign='top' />");
        $(td2).css('vertical-align', 'top');

        var td3 = newListRow.insertCell(2);
        $(td3).html("<input type='text' id='txtendtime_" + rowIndex + "' style='width:100%' class='time' onclick='$(this).select();' valign='top'  />");
        $(td3).css('vertical-align', 'top');

        var td4 = newListRow.insertCell(3);
        $(td4).html("<textarea id='txtRemarks_" + rowIndex + "' style='width:300px' class='checkspecialchar' onclick='$(this).select();'></textarea>");
        if (curObj != null) {
            curObj.onkeyup = null;
            curObj.ondblclick = null;
        }
    }
    $(".checkspecialchar").blur(function () { fnCloseTextarea(this); fnRemoveErrorIndicatior(this); });
    $(".checkspecialchar").focus(function () { fnExpandTextarea(this); });
    autoComplete(activityJSON_g, "txtactivity", "hdnactivity", 'autoactivity');
    fnSetTimePicker();
}

function fnactivityRowCreation(curObj) {
    fnGenerateActivitytable(null, curObj);
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
        accRegions_g = regionCodeArr;
    }

    // accompanist text box blur and category change event.        
    if (callFrom == "EVENT") {
        if (accompanistNeed == "YES") { // only if SHOW_ACCOMPANISTS_DATA mapped as "SFC"
            if (accompRow >= 3) { // take region code from Accompanist table value.
                for (var i = 1; i <= (accompRow - 1) ; i++) {
                    if ($("#txtAccompanist_" + i).val() != "") {
                        regionCodeArr.push($("#hdnAccompanistCode_" + i).val());
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
        //$("#Work_Place").unautocomplete();
        autoComplete(intermediate_g, "Work_Place", "hdnWorkPlace", 'autoIntermediateWork');

        for (var k = 1; k < interRow; k++) {
            $("#txtFromPlace_" + k).unautocomplete();
            $("#txtToPlace_" + k).unautocomplete();
        }
        autoComplete(intermediate_g, "txtFromPlace", "hdnFromPlace", 'autoIntermediate');
        autoComplete(intermediate_g, "txtToPlace", "hdnToPlace", 'autoIntermediate');
        fnIntermediateEventBinder();
    }
}

function fnPrefillAttendance() {
    if (dcrStatus == "0" && source != "TAB") {
        var unapprovalReason = atten_g[0].UnApprovalReason;
        unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
        unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
        unapprovalReason = unapprovalReason.replace(/~/g, ' - ');

        $('#divUnapprove').html(unapprovalReason);
        $('#divUnapprove').css('display', '');
    }

    $("#Start_Time").val(atten_g[0].Start_Time_Main);
    $("#End_Time").val(atten_g[0].End_Time_Main);

    if (atten_g[0].Data_From != 'WA') {
        $("#ddlCategory").val(atten_g[0].Category);
        $("#Work_Place").val(atten_g[0].Work_Place);
    }
    else if (TP_g != "" && dcrStatus == "1") { // WA TP data should be prefilled
        $("#ddlCategory").val(TP_g[0].Category);
        $("#Work_Place").val(TP_g[0].Work_Place);
    }

    if (dcrStatus == "3") {// if it is not a drafted da, it might be TP data. For tp, the work place should be current region in paga load. so don update it.
        $("#Work_Place").val(atten_g[0].Work_Place);
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
}


function fnPrefillData() {
    if (dcrStatus == "0" && source != "TAB") {
        var unapprovalReason = prefill_g[0].UnApprovalReason;
        unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
        unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
        unapprovalReason = unapprovalReason.replace(/~/g, ' - ');

        $('#divUnapprove').html(unapprovalReason);
        $('#divUnapprove').css('display', '');
    }
    unapprovereason_g = prefill_g[0].UnApprovalReason == null ? "" : prefill_g[0].UnApprovalReason;
    if (prefill_g[0].Data_From != 'WA' && prefill_g[0].Data_From != 'TP') {
        $("#Start_Time").val(prefill_g[0].Start_Time);
        $("#End_Time").val(prefill_g[0].End_Time);
    }

    if (prefill_g[0].Data_From != 'WA') {
        $("#ddlCategory").val(prefill_g[0].Category);

        if (cpNeed != "NO") { // check the privilege value
            var cpName = "";
            if (prefill_g[0].CP_No != null && prefill_g[0].CP_No != '') {
                cpName = prefill_g[0].CP_No + "_" + prefill_g[0].Region_Name;
            }
            else {
                cpName = "";
            }
            $("#CP_No").val(cpName);
        }
        $("#hdnCPCode").val(prefill_g[0].CP_Code);
        $("#Work_Place").val(prefill_g[0].Work_Place);
    }
    else if (TP_g != "" && dcrStatus == "1") { // TP data in WA entry
        $("#ddlCategory").val(TP_g[0].Category);

        if (cpNeed != "NO") { // check the privilege value
            var cpName = "";
            if (TP_g[0].CP_No != null && TP_g[0].CP_No != '') {
                cpName = TP_g[0].CP_No + "_" + TP_g[0].Region_Name;
            }
            else {
                cpName = "";
            }
            $("#CP_No").val(TP_g[0].CP_No);
        }
        $("#hdnCPCode").val(TP_g[0].CP_Code);
        $("#Work_Place").val(TP_g[0].Work_Place);
    }

    if (dcrStatus == "3") {// if it is not a drafted da, it might be TP data. For tp, the work place should be current region in paga load. so don update it.
        $("#Work_Place").val(prefill_g[0].Work_Place);
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
}

function fnCreateAccompanistTable(isPrefill) {
    if (flag_g != "A") {
        var tableContent = "";
        tableContent += "<table cellspacing='0' cellpadding='0' id='tblAccompanist' width='100%'>";
        tableContent += "<thead>";
        tableContent += "<tr><th>S.No</th>";
        tableContent += "<th>Accompanist Name</th>";
        tableContent += "<th>Independent Call</th>";
        tableContent += "<th>Start Time</th>";
        tableContent += "<th>End Time</th>";
        tableContent += "<th></th>";
        tableContent += "</tr>";
        tableContent += "</thead>";

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
                    accObj.push({ accName: prefill_g[0].Acc3_Name, accCode: prefill_g[0].Acc3_Code, accOnlyDoc: prefill_g[0].Acc3_Only_For_Doctor, st: ((prefill_g[0].Acc3_Start_Time == null) ? null : prefill_g[0].Acc3_Start_Time.split('_')[0]), et: ((prefill_g[0].Acc3_Start_Time == null) ? null : prefill_g[0].Acc3_Start_Time.split('_')[1]), accMode: prefill_g[0].Acc3_Mode_Of_Entry });
                }
                else if (i == 4 && prefill_g != "" && prefill_g[0].Acc4_Name != "" && prefill_g[0].Acc4_Name != 'null') {
                    accObj.push({ accName: prefill_g[0].Acc4_Name, accCode: prefill_g[0].Acc4_Code, accOnlyDoc: prefill_g[0].Acc4_Only_For_Doctor, st: ((prefill_g[0].Acc4_Start_Time == null) ? null : prefill_g[0].Acc4_Start_Time.split('_')[0]), et: ((prefill_g[0].Acc4_Start_Time == null) ? null : prefill_g[0].Acc4_Start_Time.split('_')[1]), accMode: prefill_g[0].Acc4_Mode_Of_Entry });
                }
            }

            var k = 0;
            for (var k = 0; k < accObj.length; k++) {
                tableContent += "<tr>";
                tableContent += "<td>" + (k + 1) + "</td>";

                tableContent += "<td style='width: 200px;'><input type='text' id='txtAccompanist_" + (k + 1) + "'  class='autoAccompanist' value='" + accObj[k].accName + "' onclick= '$(this).select();'/>";
                tableContent += "<input type='hidden' value='" + accObj[k].accCode + "' id='hdnAccompanistCode_" + (k + 1) + "'/>";
                tableContent += "<input type='hidden' value='" + accObj[k].accMode + "' id='hdnAccompMode_" + (k + 1) + "'/>";
                tableContent += "<span id='popup_" + (k + 1) + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                if (accObj[k].accOnlyDoc.length > 0) {
                    tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + (k + 1) + "' class='accompchk' />Yes</td>";
                }
                else {
                    tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + (k + 1) + "' class='accompchk' />Yes</td>";
                }
                tableContent += "<td><input type='text' id='txtStartTime_" + (k + 1) + "'  class='time accomp' value='" + ((accObj[k].st == null) ? "" : accObj[k].st) + "' onclick= '$(this).select();' /></td>";
                tableContent += "<td><input type='text' id='txtEndTime_" + (k + 1) + "'  class='time accomp' value='" + ((accObj[k].et == null) ? "" : accObj[k].et) + "' onclick= '$(this).select();'/></td>";
                //tableContent += "<td><img style='display:none;' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer;display:none;' id='btnRemoveAccompanist_" + (k + 1) + "' onclick='fnRemoveAccompanist(" + (k + 1) + ");' /></td>";
                tableContent += "<td><div id='btnRemoveAccompanist_" + (k + 1) + "' class='accRemoveIconBlack' ><div class='fa fa-close' onclick='fnRemoveAccompanist(" + (k + 1) + ");'/></div></td>";
                tableContent += "</tr>";

            }

            if (k == 4) {
                accompRow = k + 1;
            }
            else if (k != 4 && k != 0) {
                tableContent += "<tr>";
                tableContent += "<td>" + (k + 1) + "</td>";
                tableContent += "<td style='width: 200px;'><input type='text' id='txtAccompanist_" + (k + 1) + "'  class='autoAccompanist'  onclick= '$(this).select();'/><input type='hidden' id='hdnAccompanistCode_" + (k + 1) + "'/><input type='hidden' id='hdnAccompMode_" + (k + 1) + "'/><span id='popup_" + (k + 1) + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + (k + 1) + "' class='accompchk' />Yes</td>";
                tableContent += "<td><input type='text' id='txtStartTime_" + (k + 1) + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                tableContent += "<td><input type='text' id='txtEndTime_" + (k + 1) + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                //tableContent += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer;display:none;'  id='btnRemoveAccompanist_" + (k + 1) + "' onclick='fnRemoveAccompanist(" + (k + 1) + ");' /></td>";
                tableContent += "<td><div id='btnRemoveAccompanist_" + (k + 1) + "' class='accRemoveIconBlack' ><div class='fa fa-close' onclick='fnRemoveAccompanist(" + (k + 1) + ");'/></div></td>";
                tableContent += "</tr>";
                accompRow = parseInt(k) + 2;
            }
            else if (k == 0) {
                for (var i = 1; i <= 2; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td>" + i + "</td>";
                    tableContent += "<td style='width: 200px;'><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist'  onclick= '$(this).select();'/><input type='hidden' id='hdnAccompanistCode_" + i + "'/><input type='hidden' id='hdnAccompMode_" + i + "'/><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                    tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + i + "' class='accompchk' />Yes</td>";
                    tableContent += "<td><input type='text' id='txtStartTime_" + i + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                    tableContent += "<td><input type='text' id='txtEndTime_" + i + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                    //tableContent += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer;display:none;'  id='btnRemoveAccompanist_" + (k + 1) + "' onclick='fnRemoveAccompanist(" + (k + 1) + ");' /></td>";
                    tableContent += "<td><div id='btnRemoveAccompanist_" + (k + 1) + "' class='accRemoveIconBlack' ><div class='fa fa-close' onclick='fnRemoveAccompanist(" + (k + 1) + ");'/></div></td>";
                    tableContent += "</tr>";
                }
                accompRow = parseInt(i);
            }
        }
        else {
            for (var i = 1; i <= 2; i++) {
                tableContent += "<tr>";
                tableContent += "<td>" + i + "</td>";
                tableContent += "<td style='width: 200px;'><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist'  onclick= '$(this).select();'/><input type='hidden' id='hdnAccompanistCode_" + i + "'/><input type='hidden' id='hdnAccompMode_" + i + "'/><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + i + "'  class='accompchk'/>Yes</td>";
                tableContent += "<td><input type='text' id='txtStartTime_" + i + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                tableContent += "<td><input type='text' id='txtEndTime_" + i + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                //tableContent += "<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer;display:none;' id='btnRemoveAccompanist_" + (k + 1) + "' onclick='fnRemoveAccompanist(" + (k + 1) + ");' /></td>"; s
                tableContent += "<td><div id='btnRemoveAccompanist_" + (k + 1) + "' class='accRemoveIconBlack' ><div class='fa fa-close' onclick='fnRemoveAccompanist(" + (k + 1) + ");'/></div></td>";
                tableContent += "</tr>";
            }
            accompRow = parseInt(i);
        }
        $('#accompanistDetail').html(tableContent + "</table>");
        autoComplete(accompanistJson_g, "txtAccompanist", "hdnAccompanistCode", 'autoAccompanist');
        fnAccompanistEventBinder();
        //Afetr Completed the Accompanist name bind call for the header text name

    }
}

function fnCreateIntermediatePlaceTable(isPrefill) {
    debugger;
    // Readonly assignment for distance
    var style = "";
    var draftedIsRoute = new Boolean(false);
    if (distEdit != "" && distEdit.length > 0) {

        var distanceEditJson = jsonPath(distEdit, "$.[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");
        if (distanceEditJson.length > 0) {
            if (distanceEditJson[0].Distance_Edit == 'R') {
                style = "readonly='readonly'";
            }
        }
    }
    var tableContent = "";
    tableContent += "<table cellspacing='0' cellpadding='0' id='tblIntermediate' width='100%'>";
    tableContent += "<thead>";
    tableContent += "<tr><th>From Place</th>";
    tableContent += "<th>To Place</th>";
    tableContent += "<th>Travel Mode</th>";
    tableContent += "<th>Distance</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";
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

        /********************************************************************* START PREFILL DETAILS FILL ***************************************************************/
        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() == "HQ") {
            if (tpSFCPrefill != "" && tpSFCPrefill.length > 0) {
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + tpSFCPrefill[0].From_Place + "'  /><input type='hidden' value='" + tpSFCPrefill[0].From_Place + "' id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()'  class='autoIntermediate fillDist fromPlace newInter'  value='" + tpSFCPrefill[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[0].To_Place + "' id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + tpSFCPrefill[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + tpSFCPrefill[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
                if (tpSFCPrefill[0].Distance_Fare_Code != "") {
                    tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  disabled='disabled' class='numeric fromPlace' value='" + tpSFCPrefill[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/>";
                }
                else {
                    tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + tpSFCPrefill[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/>";
                }
                //to get the route way.
                var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + tpSFCPrefill[0].To_Place + "' & @.To_Place == '" + tpSFCPrefill[0].From_Place + "')");
                if (distanceJson != false) {
                    tableContent += "<input type='hidden' value='R' id='hdnRouteWay_1'/>";
                }
                else {
                    tableContent += "<input type='hidden' value='D' id='hdnRouteWay_1'/>";
                }
                tableContent += "<input type='hidden' value='1' id='hdnIs_TP_SFC_1'/>";
                tableContent += "<input type='hidden' value='" + tpSFCPrefill[0].SFC_Region_Code + "' id='hdnSFCRegion_1'/><input type='hidden' value='" + tpSFCPrefill[0].SFC_Version_No + "' id='hdnSFCVersion_1'/><input type='hidden' value='" + tpSFCPrefill[0].SFC_Category_Name + "' id='hdnSFCCategory_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate fillDist changeEvent'  /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/><input type='hidden' id='hdnSFCRegion_1'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden'  id='hdnSFCCategory_1'/> <input type='hidden' value='1' id='hdnIs_TP_SFC_1'/></td>";
                tableContent += "</tr>";
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
                        if (k == count && isRouteCompleteinTP && intermediateNeed == "No") { // TP data has route completed data
                            tableContent += "<tr id='trInterAuto'>";
                            var sfcCode = tpSFCPrefill[k - 1].Distance_Fare_Code == null ? "-1" : tpSFCPrefill[k - 1].Distance_Fare_Code
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + tpSFCPrefill[k - 1].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + tpSFCPrefill[k - 1].From_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + tpSFCPrefill[k - 1].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + tpSFCPrefill[k - 1].To_Place + "'/></td>";
                            tableContent += "<td><label id='lblTravelMode_Auto'>" + tpSFCPrefill[k - 1].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + tpSFCPrefill[k - 1].Travel_Mode + "'/></td>";
                            tableContent += "<td><label id='lblDistance_Auto'>" + tpSFCPrefill[k - 1].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + sfcCode + "'/></td>";

                            //to get the route way.
                            var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[k - 1].To_Place + "' & @.To_Place == '" + tpSFCPrefill[k - 1].From_Place + "')]");
                            if (distanceJson != false) {
                                tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='R'/>";
                            }
                            else {
                                tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='D'/>";
                            }

                            tableContent += "<input type='hidden' value='" + tpSFCPrefill[k - 1].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + tpSFCPrefill[k - 1].SFC_Version_No + "' id='hdnSFCVersion_Auto'/><input type='hidden' value='" + tpSFCPrefill[k - 1].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                            tableContent += "</tr>";
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                        }
                        else if (k == count && !isRouteCompleteinTP && intermediateNeed == "No") {
                            tableContent += "<tr id='trInterAuto'>";
                            var sfcCode = tpSFCPrefill[k - 1].Distance_Fare_Code == null ? "-1" : tpSFCPrefill[k - 1].Distance_Fare_Code
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + tpSFCPrefill[k - 1].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + tpSFCPrefill[k - 1].From_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + tpSFCPrefill[k - 1].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + tpSFCPrefill[k - 1].To_Place + "'/></td>";
                            tableContent += "<td><label id='lblTravelMode_Auto'>" + tpSFCPrefill[k - 1].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + tpSFCPrefill[k - 1].Travel_Mode + "'/></td>";
                            tableContent += "<td><label id='lblDistance_Auto'>" + tpSFCPrefill[k - 1].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + sfcCode + "'/></td>";

                            //to get the route way.
                            var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[k - 1].To_Place + "' & @.To_Place == '" + tpSFCPrefill[k - 1].From_Place + "')]");
                            if (distanceJson != false) {
                                tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='R'/>";
                            }
                            else {
                                tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='D'/>";
                            }
                            tableContent += "<input type='hidden' value='" + tpSFCPrefill[k - 1].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + tpSFCPrefill[k - 1].SFC_Version_No + "' id='hdnSFCVersion_Auto'/><input type='hidden' value='" + tpSFCPrefill[k - 1].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                            tableContent += "</tr>";
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                        }
                        else {

                            var fromPlaceDisabled = "disabled=true";
                            if (i == 1) {
                                fromPlaceDisabled = "";
                            }
                            tableContent += "<tr>";
                            tableContent += "<td><input type='text' " + fromPlaceDisabled + " id='txtFromPlace_" + i + "' value='" + tpSFCPrefill[i - 1].From_Place + "'  class='autoIntermediate fillDist changeEvent'   /><input type='hidden' value='" + tpSFCPrefill[i - 1].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + tpSFCPrefill[i - 1].To_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + tpSFCPrefill[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + tpSFCPrefill[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";
                            if (tpSFCPrefill[i - 1].Distance_Fare_Code != "") {
                                tableContent += "<td><input type='text'  disabled='disabled'  id='txtDistance_" + i + "' " + style + " value='" + tpSFCPrefill[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/>";
                            } else {
                                tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + tpSFCPrefill[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/>";
                            }
                            tableContent += "<input type='hidden' value='1' id='hdnIs_TP_SFC_" + i + "'/>";
                            //to get the route way.
                            var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[i - 1].To_Place + "' & @.To_Place == '" + tpSFCPrefill[i - 1].From_Place + "')]");
                            if (distanceJson != false) {
                                tableContent += "<input type='hidden' value='R' id='hdnRouteWay_" + i + "'/>";
                            }
                            else {
                                tableContent += "<input type='hidden' value='D' id='hdnRouteWay_" + i + "'/>";
                            }
                            tableContent += "<input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Region_Code + "' id='hdnSFCRegion_" + i + "'/><input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Version_No + "' id='hdnSFCVersion_" + i + "'/><input value='" + tpSFCPrefill[k - 1].SFC_Category_Name + "' type='hidden' id='hdnSFCCategory_" + i + "'/></td>";
                            tableContent += "</tr>";
                            i++;
                        }
                    }
                }
                else {// Default show the First Row. if selected Category applicable for Circleroute Compete that also enable. in this section.
                    tableContent += "<tr>";
                    tableContent += "<td><input type='text' " + fromPlaceDisabled + " id='txtFromPlace_" + i + "' value='" + tpSFCPrefill[0].From_Place + "'  class='autoIntermediate fillDist changeEvent'   /><input type='hidden' value='" + tpSFCPrefill[0].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + tpSFCPrefill[0].To_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                    tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + tpSFCPrefill[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + tpSFCPrefill[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";
                    if (tpSFCPrefill[i - 1].Distance_Fare_Code != "") {

                        tableContent += "<td><input type='text' disabled='disabled' id='txtDistance_" + i + "' " + style + " value='" + tpSFCPrefill[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/>";
                    }
                    else {

                        tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + tpSFCPrefill[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + tpSFCPrefill[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/>";
                    }
                    tableContent += "<input type='hidden' value='1' id='hdnIs_TP_SFC_" + i + "'/>";
                    //to get the route way.
                    var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[i - 1].To_Place + "' & @.To_Place == '" + tpSFCPrefill[i - 1].From_Place + "')]");
                    if (distanceJson != false) {
                        tableContent += "<input type='hidden' value='R' id='hdnRouteWay_" + i + "'/>";
                    }
                    else {
                        tableContent += "<input type='hidden' value='D' id='hdnRouteWay_" + i + "'/>";
                    }
                    tableContent += "<input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Region_Code + "' id='hdnSFCRegion_" + i + "'/><input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Version_No + "' id='hdnSFCVersion_" + i + "'/><input value='" + tpSFCPrefill[i - 1].SFC_Category_Name + "' type='hidden' id='hdnSFCCategory_" + i + "'/></td>";
                    tableContent += "</tr>";
                    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                tableContent += "<tr id='trInterAuto'>";
                                var sfcCode = tpSFCPrefill[i - 1].Distance_Fare_Code == null ? "-1" : tpSFCPrefill[i - 1].Distance_Fare_Code
                                tableContent += "<td><label id='lblFromPlace_Auto'>" + tpSFCPrefill[i - 1].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + tpSFCPrefill[i - 1].To_Place + "'/></td>"
                                tableContent += "<td><label id='lblToPlace_Auto'>" + tpSFCPrefill[i - 1].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + tpSFCPrefill[i - 1].From_Place + "'/></td>";
                                tableContent += "<td><label id='lblTravelMode_Auto'>" + tpSFCPrefill[i - 1].Travel_Mode + "</label>";
                                tableContent += " <div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div>";
                                tableContent += "    <input type='hidden'  id='hdnTravelMode_Auto'  value='" + tpSFCPrefill[i - 1].Travel_Mode + "'/></td>";
                                tableContent += "<td><label id='lblDistance_Auto'>" + tpSFCPrefill[i - 1].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + sfcCode + "'/></td>";

                                //to get the route way.
                                var distanceJson = jsonPath(sfc_g, "$.[?(@.From_Place=='" + tpSFCPrefill[i - 1].To_Place + "' & @.To_Place == '" + tpSFCPrefill[i - 1].From_Place + "')]");
                                if (distanceJson != false) {
                                    tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='R'/>";
                                }
                                else {
                                    tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='D'/>";
                                }
                                tableContent += "<input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Version_No + "' id='hdnSFCVersion_Auto'/><input type='hidden' value='" + tpSFCPrefill[i - 1].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                                tableContent += "</tr>";
                                $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                            }
                        }
                    }

                    interRow = 2;


                }

                //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                if ($("#ddlCategory :selected").text() != "HQ" && intermediateNeed == "YES") {
                    tableContent += "<tr class='newRow'>";
                    tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + tpTo + "' disabled=true class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_" + i + "'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_" + i + "'  class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + i + "'/></td>";
                    tableContent += "<td><input type='text' id='txtTravelMode_" + i + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + i + "'/></td>";
                    tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + i + "'/><input type='hidden' id='hdnRouteWay_" + i + "'/>";
                    tableContent += "<input type='hidden' id='hdnSFCRegion_" + i + "'/><input type='hidden' id='hdnSFCVersion_" + i + "'/><input type='hidden' id='hdnSFCCategory_" + i + "'/><span id='spnDelSFCRow_" + i + "' onclick='fnDeleteSFCRow(this)' style='font-weight:bold;cursor:pointer'>&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</span></td>";
                    tableContent += "</tr>";
                    interRow = parseInt(i) + 1;
                }
                else {
                    interRow = 2;
                }
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/>";
                tableContent += "<input type='hidden' id='hdnSFCRegion_1'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden' id='hdnSFCCategory_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
        }
    }
        /********************************************************************* END PREFILL DETAILS FILL ***************************************************************/
        /********************************************************************* START DRFAT DETAILS FILL ***************************************************************/
        // draft mode.
        // for prefill data with category "HQ"
    else if ($("#ddlCategory :selected").text() == "HQ" && isPrefill == "Y") {
        tableContent += "<tr>";
        if (prefill_g[0].Route_Way.toUpperCase() != "R") {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + prefill_g[0].From_Place + "' /><input type='hidden' value='" + prefill_g[0].From_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  value='" + prefill_g[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].To_Place + "' id='hdnToPlace_1'/></td>";
        }
        else {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + prefill_g[0].To_Place + "'  /><input type='hidden' value='" + prefill_g[0].To_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  value='" + prefill_g[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].From_Place + "' id='hdnToPlace_1'/></td>";
        }
        tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + prefill_g[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + prefill_g[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
        if (prefill_g[0].Distance_Fare_Code != "") {
            tableContent += "<td><input type='text' disabled='disabled' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + prefill_g[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + prefill_g[0].Route_Way + "' id='hdnRouteWay_1'/>";
        } else {

            tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + prefill_g[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + prefill_g[0].Route_Way + "' id='hdnRouteWay_1'/>";
        }

        tableContent += "<input type='hidden' value='" + prefill_g[0].SFC_Region_Code + "' id='hdnSFCRegion_1'/><input type='hidden' value='" + prefill_g[0].SFC_Version_No + "' id='hdnSFCVersion_1'/><input type='hidden' value='" + prefill_g[0].SFC_Category_Name + "' id='hdnSFCCategory_1'/></td>";
        tableContent += "</tr>";
        interRow = 2;
    }
    else if (isPrefill == "Y") {
        // privilege check - "INTERMEDIATE_PLACES". if it is not mapped with the value "DCR", and the drafted value has the intermediate place, show only the frst record.
        if ($("#ddlCategory :selected").text().toUpperCase() == "HQ") {
            if (prefill_g.length > 0) {
                tableContent += "<tr>";
                if (prefill_g[0].Route_Way.toUpperCase() != "R") {
                    tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + prefill_g[0].From_Place + "'  /><input type='hidden' value='" + prefill_g[0].From_Place + "' id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  value='" + prefill_g[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].To_Place + "' id='hdnToPlace_1'/></td>";
                }
                else {
                    tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + prefill_g[0].To_Place + "'  /><input type='hidden' value='" + prefill_g[0].To_Place + "' id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  value='" + prefill_g[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].From_Place + "' id='hdnToPlace_1'/></td>";
                }
                tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + prefill_g[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + prefill_g[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + prefill_g[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + prefill_g[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + prefill_g[0].Route_Way + "' id='hdnRouteWay_1'/>";
                tableContent += "<input type='hidden' value='" + prefill_g[0].SFC_Region_Code + "' id='hdnSFCRegion_1'/><input type='hidden' value='" + prefill_g[0].SFC_Version_No + "' id='hdnSFCVersion_1'/><input type='hidden' value='" + prefill_g[0].SFC_Category_Name + "' id='hdnSFCCategory_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/>";
                tableContent += "<input type='hidden' id='hdnSFCRegion_1'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden' id='hdnSFCCategory_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
        }

        else {
            if (prefillHop_g.length > 0) {
                var count = prefillHop_g.length;
                var isRouteCompleteFlag = new Boolean(false);
                var autoFromPlace = "";
                //HOP Route Complete
                if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                        if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                            isRouteCompleteFlag = true;
                        }
                    }
                }
                // If Intermediate Place is No and Circle Route applicable is true
                if (isRouteCompleteFlag == true && intermediateNeed == "NO") {
                    /* First we get the without route complete data and bind the 0 the place data in the first row. Because intermediate is No.--SFCWithoutRouteComplete
                       Second we get routeComplete the data from prfilll hop then bind the route complete data using auto label.--routeCompleteJson
                       Some times the draft prefill hop object has no route complete the data, then system bind the route complete data automatiaclly. routeCompleteJson else part.
                    */
                    var SFCWithoutRouteComplete = jsonPath(prefillHop_g, "$.[?(@.Is_Route_Complete!='Y')]");
                    if (SFCWithoutRouteComplete != null && SFCWithoutRouteComplete && SFCWithoutRouteComplete.length > 0) {
                        tableContent += "<tr>";

                        if (SFCWithoutRouteComplete[0].Route_Way.toUpperCase() == "R") {
                            tableContent += "<td><input type='text' id='txtFromPlace_1' value='" + SFCWithoutRouteComplete[0].To_Place + "'  class='autoIntermediate fillDist changeEvent'   /><input type='hidden' value='" + SFCWithoutRouteComplete[0].To_Place + "' id='hdnFromPlace_1'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' value='" + SFCWithoutRouteComplete[0].From_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + SFCWithoutRouteComplete[0].From_Place + "' id='hdnToPlace_1'/></td>";

                        }
                        else {
                            tableContent += "<td><input type='text' id='txtFromPlace_1' value='" + SFCWithoutRouteComplete[0].From_Place + "'  class='autoIntermediate fillDist changeEvent '   /><input type='hidden' value='" + SFCWithoutRouteComplete[0].From_Place + "' id='hdnFromPlace_1'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' value='" + SFCWithoutRouteComplete[0].To_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + SFCWithoutRouteComplete[0].To_Place + "' id='hdnToPlace_1'/></td>";
                        }
                        tableContent += "<td><input type='text' id='txtTravelMode_1' value='" + SFCWithoutRouteComplete[0].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + SFCWithoutRouteComplete[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
                        tableContent += "<td><input type='text' id='txtDistance_1' " + style + " value='" + SFCWithoutRouteComplete[0].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + SFCWithoutRouteComplete[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden'  value='" + SFCWithoutRouteComplete[0].Route_Way + "' id='hdnRouteWay_1'/>";
                        tableContent += "<input type='hidden' value='" + SFCWithoutRouteComplete[0].SFC_Region_Code + "' id='hdnSFCRegion_1'/><input type='hidden' value='" + SFCWithoutRouteComplete[0].SFC_Version_No + "' id='hdnSFCVersion_1'/><input type='hidden' value='" + SFCWithoutRouteComplete[0].SFC_Category_Name + "' id='hdnSFCCategory_1'/></td>";
                        tableContent += "<input type='hidden' value='" + SFCWithoutRouteComplete[0].Is_TP_SFC + "' id='hdnIs_TP_SFC_1'/>";
                        tableContent += "</tr>";
                    }


                    //Row for route complete
                    var routeCompleteJson = jsonPath(prefillHop_g, "$.[?(@.Is_Route_Complete=='Y')]");
                    if (routeCompleteJson != false && routeCompleteJson !== undefined && routeCompleteJson.length > 0) {
                        tableContent += "<tr id='trInterAuto'>";
                        if (routeCompleteJson[0].Route_Way.toUpperCase() != "R") {
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + routeCompleteJson[0].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + routeCompleteJson[0].From_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + routeCompleteJson[0].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + routeCompleteJson[0].To_Place + "'/></td>";
                        }
                        else {
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + routeCompleteJson[0].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + routeCompleteJson[0].To_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + routeCompleteJson[0].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + routeCompleteJson[0].From_Place + "'/></td>";
                        }
                        tableContent += "<td><label id='lblTravelMode_Auto'>" + routeCompleteJson[0].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + routeCompleteJson[0].Travel_Mode + "'/></td>";
                        tableContent += "<td><label id='lblDistance_Auto'>" + routeCompleteJson[0].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + routeCompleteJson[0].Distance_Fare_Code + "'/><input type='hidden' id='hdnRouteWay_Auto'  value='" + routeCompleteJson[0].Route_Way + "'/>";
                        tableContent += "<input type='hidden' value='" + routeCompleteJson[0].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + routeCompleteJson[0].SFC_Version_No + "' id='hdnSFCVersion_Auto'/><input type='hidden' value='" + routeCompleteJson[0].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                        tableContent += "</tr>";
                        $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                    }
                    else {

                        tableContent += "<tr id='trInterAuto'>";
                        if (SFCWithoutRouteComplete[0].Route_Way.toUpperCase() == "R") {
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + SFCWithoutRouteComplete[0].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + SFCWithoutRouteComplete[0].From_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + SFCWithoutRouteComplete[0].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + SFCWithoutRouteComplete[0].To_Place + "'/></td>";
                        }
                        else {
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + SFCWithoutRouteComplete[0].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + SFCWithoutRouteComplete[0].To_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + SFCWithoutRouteComplete[0].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + SFCWithoutRouteComplete[0].From_Place + "'/></td>";
                        }
                        tableContent += "<td><label id='lblTravelMode_Auto'>" + SFCWithoutRouteComplete[0].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div>";
                        tableContent += "<input type='hidden'  id='hdnTravelMode_Auto'  value='" + SFCWithoutRouteComplete[0].Travel_Mode + "'/></td>";
                        tableContent += "<td><label id='lblDistance_Auto'>" + SFCWithoutRouteComplete[0].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + SFCWithoutRouteComplete[0].Distance_Fare_Code + "'/>";
                        tableContent += " <input type='hidden' id='hdnRouteWay_Auto'  value='" + SFCWithoutRouteComplete[0].Route_Way + "'/>";
                        tableContent += "<input type='hidden' value='" + SFCWithoutRouteComplete[0].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + SFCWithoutRouteComplete[0].SFC_Version_No + "' id='hdnSFCVersion_Auto'/>";
                        tableContent += " <input type='hidden' value='" + SFCWithoutRouteComplete[0].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                        tableContent += "</tr>";
                        $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                    }
                    interRow = 2;
                }
                else {// if no route complete
                    if (intermediateNeed == "YES") {
                        for (var i = 1; i <= count; i++) {
                            var fromPlaceDisabled = "disabled=true";
                            if (i == 1) {
                                fromPlaceDisabled = "";
                            }
                            tableContent += "<tr>";
                            if (prefillHop_g[i - 1].Route_Way.toUpperCase() != "R") {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' " + fromPlaceDisabled + " value='" + prefillHop_g[i - 1].From_Place + "'  class='autoIntermediate fillDist '  /><input type='hidden' value='" + prefillHop_g[i - 1].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + prefillHop_g[i - 1].To_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                                autoFromPlace = prefillHop_g[i - 1].To_Place;
                            }
                            else {
                                tableContent += "<td><input type='text' " + fromPlaceDisabled + " id='txtFromPlace_" + i + "'  value='" + prefillHop_g[i - 1].To_Place + "'  class='autoIntermediate fillDist '   /><input type='hidden' value='" + prefillHop_g[i - 1].To_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + prefillHop_g[i - 1].From_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].From_Place + "' id='hdnToPlace_" + i + "'/></td>";
                                autoFromPlace = prefillHop_g[i - 1].From_Place;
                            }
                            tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + prefillHop_g[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + prefillHop_g[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";

                            if (prefillHop_g[i - 1].Distance_Fare_Code != "") {
                                tableContent += "<td><input type='text' disabled='disabled' id='txtDistance_" + i + "' " + style + " value='" + prefillHop_g[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/><input type='hidden'  value='" + prefillHop_g[i - 1].Route_Way + "' id='hdnRouteWay_" + i + "'/>";
                            } else {
                                tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + prefillHop_g[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/><input type='hidden'  value='" + prefillHop_g[i - 1].Route_Way + "' id='hdnRouteWay_" + i + "'/>";
                            }

                            tableContent += "<input type='hidden' value='" + prefillHop_g[i - 1].Is_TP_SFC + "' id='hdnIs_TP_SFC_" + i + "'/>";
                            tableContent += "<input type='hidden' value='" + prefillHop_g[i - 1].SFC_Region_Code + "' id='hdnSFCRegion_" + i + "'/><input type='hidden' value='" + prefillHop_g[i - 1].SFC_Version_No + "' id='hdnSFCVersion_" + i + "'/><input type='hidden' value='" + prefillHop_g[i - 1].SFC_Category_Name + "' id='hdnSFCCategory_" + i + "'/></td>";
                            tableContent += "</tr>";
                        }
                    }
                    else {
                        // if intermedaite is no , then we bind 0 th index data.
                        for (var i = 1; i <= 1; i++) {
                            tableContent += "<tr>";
                            if (prefillHop_g[i - 1].Route_Way.toUpperCase() != "R") {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + prefillHop_g[i - 1].From_Place + "'  class='autoIntermediate fillDist '   /><input type='hidden' value='" + prefillHop_g[i - 1].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + prefillHop_g[i - 1].To_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                                autoFromPlace = prefillHop_g[i - 1].To_Place;
                            }
                            else {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + prefillHop_g[i - 1].To_Place + "'  class='autoIntermediate fillDist '   /><input type='hidden' value='" + prefillHop_g[i - 1].To_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + prefillHop_g[i - 1].From_Place + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].From_Place + "' id='hdnToPlace_" + i + "'/></td>";
                                autoFromPlace = prefillHop_g[i - 1].From_Place;
                            }
                            tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + prefillHop_g[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + prefillHop_g[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";

                            if (prefillHop_g[i - 1].Distance_Fare_Code != "") {
                                tableContent += "<td><input type='text' disabled='disabled' id='txtDistance_" + i + "' " + style + " value='" + prefillHop_g[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/><input type='hidden'  value='" + prefillHop_g[i - 1].Route_Way + "' id='hdnRouteWay_" + i + "'/>";
                            } else {

                                tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + prefillHop_g[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + prefillHop_g[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/><input type='hidden'  value='" + prefillHop_g[i - 1].Route_Way + "' id='hdnRouteWay_" + i + "'/>";
                            }
                            tableContent += "<input type='hidden' value='" + prefillHop_g[i - 1].Is_TP_SFC + "' id='hdnIs_TP_SFC_" + i + "'/>";
                            tableContent += "<input type='hidden' value='" + prefillHop_g[i - 1].SFC_Region_Code + "' id='hdnSFCRegion_" + i + "'/><input type='hidden' value='" + prefillHop_g[i - 1].SFC_Version_No + "' id='hdnSFCVersion_" + i + "'/><input type='hidden' value='" + prefillHop_g[i - 1].SFC_Category_Name + "' id='hdnSFCCategory_" + i + "'/></td>";
                            tableContent += "</tr>";
                        }
                        interRow = i;
                    }

                    //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                    if (intermediateNeed == "YES") {

                        tableContent += "<tr class='newRow'>";
                        tableContent += "<td><input type='text' disabled=true id='txtFromPlace_" + i + "' value='" + autoFromPlace + "'  class='autoIntermediate fillDist changeEvent '  /><input type='hidden'  id='hdnFromPlace_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtToPlace_" + i + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtTravelMode_" + i + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + i + "'/><input type='hidden' id='hdnRouteWay_" + i + "'/>";
                        tableContent += "<input type='hidden' id='hdnSFCRegion_" + i + "'/><input type='hidden' id='hdnSFCVersion_" + i + "'/><input type='hidden' id='hdnSFCCategory_" + i + "'/><span id='spnDelSFCRow_" + i + "' onclick='fnDeleteSFCRow(this)' style='font-weight:bold;cursor:pointer'>&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</span></td>";
                        tableContent += "</tr>";
                        i++;
                        interRow = i;
                    }

                }






            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/>";
                tableContent += "<input type='hidden' id='hdnSFCRegion_1'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden' id='hdnSFCCategory_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
        }
    }
        /********************************************************************* END DRFAT DETAILS FILL ***************************************************************/

        /********************************************************************** START CP ON DETAILS FILL*************************************************************/
        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CP") {
        var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $("#CP_No").val().split('_')[0].toString() + "'& @.Region_Name=='" + $("#CP_No").val().split('_')[1].toString() + "')]");
        var autoFromPlace = "";
        tableContent += "<tr>";
        if (cpJson[0].Route_Way.toUpperCase() == "R") {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent ' value='" + cpJson[0].To_Place + "'  /><input type='hidden' value='" + cpJson[0].To_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace'  value='" + cpJson[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].From_Place + "' id='hdnToPlace_1'/></td>";
            autoFromPlace = cpJson[0].From_Place;

        }
        else {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + cpJson[0].From_Place + "' /><input type='hidden' value='" + cpJson[0].From_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  value='" + cpJson[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].To_Place + "' id='hdnToPlace_1'/></td>";
            autoFromPlace = cpJson[0].To_Place;
        }
        tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + cpJson[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + cpJson[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";

        if (cpJson[0].Distance_Fare_Code != "") {
            tableContent += "<td><input type='text' disabled='disabled' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + cpJson[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + cpJson[0].Route_Way + "' id='hdnRouteWay_1'/>";
        } else {
            tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + cpJson[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + cpJson[0].Route_Way + "' id='hdnRouteWay_1'/>";
        }

        tableContent += "<input type='hidden' id='hdnSFCRegion_1' value='" + cpJson[0].SFC_Region_Code + "'/><input type='hidden' id='hdnSFCVersion_1' value='" + cpJson[0].SFC_Version_No + "'/><input type='hidden' id='hdnSFCCategory_1' value='" + cpJson[0].SFC_Category_Name + "'/></td>";
        tableContent += "</tr>";

        // to create extra empty row.
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text() != "HQ") {
            tableContent += "<tr class='newRow'>";
            tableContent += "<td><input type='text' id='txtFromPlace_2' value='" + autoFromPlace + "'  class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_2'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_2'  class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_2'/></td>";
            tableContent += "<td><input type='text' id='txtTravelMode_2'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_2'/></td>";
            tableContent += "<td><input type='text' id='txtDistance_2' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_2'/><input type='hidden' id='hdnRouteWay_2'/>";
            tableContent += "<input type='hidden' id='hdnSFCRegion_2'/><input type='hidden' id='hdnSFCVersion_2'/><input type='hidden' id='hdnSFCCategory_2'/><span id='spnDelSFCRow_2' onclick='fnDeleteSFCRow(this)' style='font-weight:bold;cursor:pointer'>&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</span></td>";
            tableContent += "</tr>";
            interRow = 3;
        }
        else {
            interRow = 2;
        }
        $('#Work_Place').val(cpJson[0].Work_Place);
    }

        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CPHOP") {
        var j = 1;
        var cpJson = jsonPath(cpHop_g, "$.[?(@.CP_No=='" + $("#CP_No").val().split('_')[0].toString() + "'& @.Region_Name=='" + $("#CP_No").val().split('_')[1].toString() + "')]");
        if (cpJson.length > 0) {
            $("#Work_Place").val(cpJson[0].Work_Place);

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
                        var autoFromPlace = "";
                        //Added for validate the NUll distance fare code
                        cpJson[i].Distance_Fare_Code = cpJson[i].Distance_Fare_Code == null ? "" : cpJson[i].Distance_Fare_Code;
                        cpJson[i].SFC_Version_No = cpJson[i].SFC_Version_No == null ? "" : cpJson[i].SFC_Version_No;

                        if (i == (cpJson.length - 1) && isRouteCompleteinCP == true && intermediateNeed == "NO") { // CP data has route completed data
                            tableContent += "<tr id='trInterAuto'>";
                            if (cpJson[i].Route_Way.toUpperCase() != "R") {
                                tableContent += "<td><label id='lblFromPlace_Auto'>" + cpJson[i].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + cpJson[i].From_Place + "'/></td>"
                                tableContent += "<td><label id='lblToPlace_Auto'>" + cpJson[i].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + cpJson[i].To_Place + "'/></td>";
                            }
                            else {
                                tableContent += "<td><label id='lblFromPlace_Auto'>" + cpJson[i].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + cpJson[i].To_Place + "'/></td>"
                                tableContent += "<td><label id='lblToPlace_Auto'>" + cpJson[i].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + cpJson[i].From_Place + "'/></td>";
                            }
                            tableContent += "<td><label id='lblTravelMode_Auto'>" + cpJson[i].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + cpJson[i].Travel_Mode + "'/></td>";
                            tableContent += "<td><label id='lblDistance_Auto'>" + cpJson[i].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + cpJson[i].Distance_Fare_Code + "'/><input type='hidden' id='hdnRouteWay_Auto'  value='" + cpJson[i].Route_Way + "'/>";
                            tableContent += "<input type='hidden' value='" + cpJson[i].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + cpJson[i].SFC_Version_No + "' id='hdnSFCVersion_Auto'/><input type='hidden' value='" + cpJson[i].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                            tableContent += "</tr>";
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                        }
                        else {
                            var fromPlaceDisabled = "disabled=true";
                            if (j == 1) {
                                fromPlaceDisabled = "";
                            }
                            tableContent += "<tr>";
                            if (cpJson[i].Route_Way.toUpperCase() == "R") {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + j + "' " + fromPlaceDisabled + "  class='autoIntermediate fillDist changeEvent' value='" + cpJson[i].To_Place + "'  /><input type='hidden' value='" + cpJson[i].To_Place + "' id='hdnFromPlace_" + j + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + j + "'  class='autoIntermediate fillDist fromPlace newInter'  value='" + cpJson[i].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].From_Place + "' id='hdnToPlace_" + j + "'/></td>";
                                autoFromPlace = cpJson[i].From_Place;
                            }
                            else {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + j + "' " + fromPlaceDisabled + " class='autoIntermediate fillDist changeEvent' value='" + cpJson[i].From_Place + "'  /><input type='hidden' value='" + cpJson[i].From_Place + "' id='hdnFromPlace_" + j + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + j + "'  class='autoIntermediate fillDist fromPlace newInter'  value='" + cpJson[i].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].To_Place + "' id='hdnToPlace_" + j + "'/></td>";
                                autoFromPlace = cpJson[i].To_Place;
                            }
                            tableContent += "<td><input type='text' id='txtTravelMode_" + j + "'  class='autotravel fromPlace' value='" + cpJson[i].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + cpJson[i].Travel_Mode + "' id='hdnTravelMode_" + j + "'/></td>";

                            if (cpJson[i].Distance_Fare_Code != "") {

                                tableContent += "<td><input type='text' disabled='disabled'  id='txtDistance_" + j + "' " + style + "  class='numeric fromPlace' value='" + cpJson[i].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' value='" + cpJson[i].Route_Way + "' id='hdnRouteWay_" + j + "'/>";
                            } else {

                                tableContent += "<td><input type='text' id='txtDistance_" + j + "' " + style + "  class='numeric fromPlace' value='" + cpJson[i].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' value='" + cpJson[i].Route_Way + "' id='hdnRouteWay_" + j + "'/>";
                            }

                            tableContent += "<input type='hidden' value='" + cpJson[i].SFC_Region_Code + "' id='hdnSFCRegion_" + j + "'/><input type='hidden' value='" + cpJson[i].SFC_Version_No + "' id='hdnSFCVersion_" + j + "'/><input type='hidden' value='" + cpJson[i].SFC_Category_Name + "' id='hdnSFCCategory_" + j + "'/></td>";
                            tableContent += "</tr>";
                            j++;
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < 1; i++) {
                    if (cpJson[i].From_Place != "") {
                        var autoFromPlace = "";
                        //Added for validate the NUll distance fare code
                        cpJson[i].Distance_Fare_Code = cpJson[i].Distance_Fare_Code == null ? "" : cpJson[i].Distance_Fare_Code;
                        cpJson[i].SFC_Version_No = cpJson[i].SFC_Version_No == null ? "" : cpJson[i].SFC_Version_No;

                        tableContent += "<tr>";
                        if (cpJson[i].Route_Way.toUpperCase() == "R") {
                            tableContent += "<td><input type='text' id='txtFromPlace_" + j + "'  class='autoIntermediate fillDist changeEvent' value='" + cpJson[i].To_Place + "'  /><input type='hidden' value='" + cpJson[i].To_Place + "' id='hdnFromPlace_" + j + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + j + "'  class='autoIntermediate fillDist fromPlace newInter'  value='" + cpJson[i].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].From_Place + "' id='hdnToPlace_" + j + "'/></td>";
                            autoFromPlace = cpJson[i].From_Place;
                        }
                        else {
                            tableContent += "<td><input type='text' id='txtFromPlace_" + j + "'  class='autoIntermediate fillDist changeEvent' value='" + cpJson[i].From_Place + "'  /><input type='hidden' value='" + cpJson[i].From_Place + "' id='hdnFromPlace_" + j + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + j + "'  class='autoIntermediate fillDist fromPlace newInter'  value='" + cpJson[i].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].To_Place + "' id='hdnToPlace_" + j + "'/></td>";
                            autoFromPlace = cpJson[i].To_Place;
                        }
                        tableContent += "<td><input type='text' id='txtTravelMode_" + j + "'  class='autotravel fromPlace' value='" + cpJson[i].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + cpJson[i].Travel_Mode + "' id='hdnTravelMode_" + j + "'/></td>";

                        if (cpJson[i].Distance_Fare_Code != "") {

                            tableContent += "<td><input type='text'  disabled='disabled'  id='txtDistance_" + j + "' " + style + "  class='numeric fromPlace' value='" + cpJson[i].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' value='" + cpJson[i].Route_Way + "' id='hdnRouteWay_" + j + "'/>";
                        } else {

                            tableContent += "<td><input type='text' id='txtDistance_" + j + "' " + style + "  class='numeric fromPlace' value='" + cpJson[i].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' value='" + cpJson[i].Route_Way + "' id='hdnRouteWay_" + j + "'/>";
                        }

                        tableContent += "<input type='hidden' value='" + cpJson[i].SFC_Region_Code + "' id='hdnSFCRegion_" + j + "'/><input type='hidden' value='" + cpJson[i].SFC_Version_No + "' id='hdnSFCVersion_" + j + "'/><input type='hidden' value='" + cpJson[i].SFC_Category_Name + "' id='hdnSFCCategory_" + j + "'/></td>";
                        tableContent += "</tr>";
                        j++;

                    }
                }
                if (isRouteComplete == true) {
                    tableContent += "<tr id='trInterAuto'>";
                    if (cpJson[0].Route_Way.toUpperCase() != "R") {
                        tableContent += "<td><label id='lblFromPlace_Auto'>" + cpJson[0].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + cpJson[0].From_Place + "'/></td>"
                        tableContent += "<td><label id='lblToPlace_Auto'>" + cpJson[0].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + cpJson[0].To_Place + "'/></td>";
                    }
                    else {
                        tableContent += "<td><label id='lblFromPlace_Auto'>" + cpJson[0].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + cpJson[0].To_Place + "'/></td>"
                        tableContent += "<td><label id='lblToPlace_Auto'>" + cpJson[0].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + cpJson[0].From_Place + "'/></td>";
                    }
                    tableContent += "<td><label id='lblTravelMode_Auto'>" + cpJson[0].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + cpJson[i].Travel_Mode + "'/></td>";
                    tableContent += "<td><label id='lblDistance_Auto'>" + cpJson[0].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + cpJson[0].Distance_Fare_Code + "'/><input type='hidden' id='hdnRouteWay_Auto'  value='" + cpJson[0].Route_Way + "'/>";
                    tableContent += "<input type='hidden' value='" + cpJson[0].SFC_Region_Code + "' id='hdnSFCRegion_Auto'/><input type='hidden' value='" + cpJson[0].SFC_Version_No + "' id='hdnSFCVersion_Auto'/><input type='hidden' value='" + cpJson[0].SFC_Category_Name + "' id='hdnSFCCategory_Auto'/></td>";
                    tableContent += "</tr>";
                    $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                }
            }

            if (intermediateNeed == "YES") {
                tableContent += "<tr class='newRow'>";
                tableContent += "<td><input type='text' disabled=true id='txtFromPlace_" + j + "' value='" + autoFromPlace + "'  class='autoIntermediate fillDist'   /><input type='hidden'  id='hdnFromPlace_" + j + "'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_" + j + "' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + j + "'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_" + j + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + j + "'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_" + j + "'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' id='hdnRouteWay_" + j + "'/>";
                tableContent += "<input type='hidden' id='hdnSFCRegion_" + j + "'/><input type='hidden' id='hdnSFCVersion_" + j + "'/><input type='hidden' id='hdnSFCCategory_" + j + "'/><span id='spnDelSFCRow_" + j + "' onclick='fnDeleteSFCRow(this)' style='font-weight:bold;cursor:pointer'>&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</span></td>";
                tableContent += "</tr>";
                interRow = parseInt(j) + 1;
            }
            else {
                interRow = parseInt(j);
            }

        }
        else {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate fillDist changeEvent'  /><input type='hidden'  id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
            tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/>";
            tableContent += "<input type='hidden' id='hdnSFCRegion_1'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden' id='hdnSFCCategory_1'/></td>";
            tableContent += "</tr>";
            interRow = 2;
        }
    }

        // Page load no tp found
    else if (isPrefill == "LOAD") {
        //currRegionName
        //currentRegion
        tableContent += "<tr>";
        tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + currRegionName + "'   /><input type='hidden' value='" + currRegionName + "' id='hdnFromPlace_1'/></td>";
        tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter' value='" + currRegionName + "'  onclick= '$(this).select();' /><input type='hidden' value='" + currRegionName + "' id='hdnToPlace_1'/></td>";
        tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
        tableContent += "<td><input type='text' id='txtDistance_1' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/>";
        tableContent += "<input type='hidden' id='hdnSFCRegion_1' value='" + currentRegion + "'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden' id='hdnSFCCategory_1' value='HQ'/></td>";
        tableContent += "</tr>";
        interRow = 2;
    }
        /**************************************************************** END CP DETAILS FILL**********************************************************/
        // to create empty rows
    else {
        tableContent += "<tr >";
        if (isPrefill == "LOAD") {
            //currRegionName
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate fillDist changeEvent' value='" + currRegionName + "'  /><input type='hidden' value='" + currRegionName + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter' value='" + currRegionName + "'  onclick= '$(this).select();' /><input type='hidden' value='" + currRegionName + "' id='hdnToPlace_1'/></td>";
        }
        else {
            tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' onblur='fnTxtToPlaceOnBlur()' class='autoIntermediate fillDist fromPlace newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
        }
        tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
        tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/>";
        tableContent += "<input type='hidden' id='hdnSFCRegion_1' value='" + currentRegion + "'/><input type='hidden' id='hdnSFCVersion_1'/><input type='hidden' id='hdnSFCCategory_1' value='HQ'/></td>";
        tableContent += "</tr>";
        interRow = 2;
        $("#lblRCHelp").html("");
        fnGenerateSFCJson("EVENT");
    }
    $('#intermediatePlace').html(tableContent + "</table>");
    autoComplete(intermediate_g, "txtFromPlace", "hdnFromPlace", 'autoIntermediate');
    autoComplete(intermediate_g, "txtToPlace", "hdnToPlace", 'autoIntermediate');

    autoComplete(travelModeJson_g, "txtTravelMode", "hdnTravelMode", 'autotravel');
    fnIntermediateEventBinder();

    //for tp data.
    if (dcrStatus == "1" && source != "TAB" && isPrefill == "Y") {
        //HOP Route Complete
        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    if (isRouteCompleteFlag == true) {
                        //  fnHOPRouteComplete("1");
                    }
                }
            }
        }
    }

    // for drafted data- route complete
    if (draftedIsRoute == true) {
        //  fnHOPRouteComplete("1");
    }

    // for cp hop - route complete
    if (isPrefill == "Y_CPHOP" && isRouteCompleteFlag == true) {
        //   fnHOPRouteComplete("1");
    }

    // check SFC Details
    fnCheckSFDatainLoad();
    //Call Accompanist selection data here
    debugger;
    CheckAccompanistChange();
}

function CheckAccompanistChange() {
    if (AccompMsg != undefined && AccompMsg.length > 0) {
        var alert = "";
        for (var a = 0; a < AccompMsg.length; a++) {
            if (AccompMsg[a] != "") {
                alert += AccompMsg[a] + "</br>";
            }
        }
        if (alert != "") {
            fnMsgAlert('info', 'DCR Header', alert);
            return false;
        }
    }
}

function fnTxtToPlaceOnBlur() {
    if ($('#Work_Place').val() == "") {
        $('#Work_Place').val($('#txtToPlace_1').val());
    }
}
function fnCreateNewRowInAccompanist(e) {
    var id = "txtAccompanist_" + (accompRow - 1) + "";
    if (accompRow <= 4) {
        if (e != id) {
            return;
        }
        var rCnt = $("#tblAccompanist tr").length;
        var newRow = document.getElementById("tblAccompanist").insertRow(parseInt(rCnt));

        var tdSNo = newRow.insertCell(0);
        var tdAccompanist = newRow.insertCell(1);
        var tdOnlyDoctor = newRow.insertCell(2);
        var tdStartTime = newRow.insertCell(3);
        var tdEndTime = newRow.insertCell(4);
        var tdRemoveBtn = newRow.insertCell(5);
        $(tdSNo).html(accompRow);
        $(tdAccompanist).html("<input type='text' id='txtAccompanist_" + accompRow + "'  class='autoAccompanist'  onclick= '$(this).select();'/><input type='hidden' id='hdnAccompanistCode_" + accompRow + "'/><input type='hidden' id='hdnAccompMode_" + accompRow + "'/><span id='popup_" + accompRow + "' class='accPopup'>&nbsp&#62&#62</span>");
        //$(tdRemoveBtn).html("<img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer;display:none;' id='btnRemoveAccompanist_" + accompRow + "' onclick='fnRemoveAccompanist(" + accompRow + ");' />");
        $(tdOnlyDoctor).html("<input type='checkbox' id='chkOnlyDoctor_" + accompRow + "' class='accompchk' />Yes");
        $(tdStartTime).html("<input type='text' id='txtStartTime_" + accompRow + "'  class='time accomp' onclick= '$(this).select();' />");
        $(tdEndTime).html("<input type='text' id='txtEndTime_" + accompRow + "'  class='time accomp' onclick= '$(this).select();'/>");
        $(tdRemoveBtn).html("<div id='btnRemoveAccompanist_" + accompRow + "' class='accRemoveIconBlack' ><div class='fa fa-close' onclick='fnRemoveAccompanist(" + accompRow + ");'/></div>");
        autoComplete(accompanistJson_g, "txtAccompanist", "hdnAccompanistCode", 'autoAccompanist');
        fnAccompanistEventBinder();

        accompRow = parseInt(accompRow) + 1;
    }
}

function fnCreateNewRowInIntermediate(e) {
    if ($.trim($(e).val()).length > 0) {
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            var id = "txtToPlace_" + (interRow - 1) + "";

            var preRowToPlaceId = e.id.split('_')[1];
            var preToPlace = $("#txtToPlace_" + preRowToPlaceId).val();

            var newRowId = parseInt(preRowToPlaceId) + 1;
            if ($("#txtFromPlace_" + newRowId).length > 0) {
                $("#txtFromPlace_" + newRowId).val(preToPlace);
                fnFillDistanceTravelMode($("#txtFromPlace_" + newRowId)[0].id);
            }
            else {


                var rCnt = $("#tblIntermediate tr").length;
                var newRow = document.getElementById("tblIntermediate").insertRow(parseInt(rCnt));
                $(newRow).addClass("newRow");
                $($("#tblIntermediate tr")[rCnt - 1]).removeClass("newRow");
                var tdFromPlace = newRow.insertCell(0);
                var tdToPlace = newRow.insertCell(1);
                var tdTravelMode = newRow.insertCell(2);
                var tdDistance = newRow.insertCell(3);


                // Readonly assignment for distance
                var style = "";
                if (distEdit != "" && distEdit.length > 0) {

                    var distanceEditJson = jsonPath(distEdit, "$.[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");

                    if (distanceEditJson.length > 0) {
                        if (distanceEditJson[0].Distance_Edit == 'R') {
                            style = "readonly='readonly'";
                        }
                    }
                }
                $("#spnDelSFCRow_" + preRowToPlaceId).css("display", "none");

                $(tdFromPlace).html("<input type='text' disabled=true value='" + preToPlace + "' id='txtFromPlace_" + interRow + "' class='autoIntermediate fillDist changeEvent'   /><input type='hidden'  id='hdnFromPlace_" + interRow + "'/>");
                $(tdToPlace).html("<input type='text'  id='txtToPlace_" + interRow + "'  class='autoIntermediate fillDist fromPlace newInter '  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + interRow + "'/>");
                $(tdTravelMode).html("<input type='text' id='txtTravelMode_" + interRow + "'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + interRow + "'/>");
                $(tdDistance).html("<input type='text' id='txtDistance_" + interRow + "' " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + interRow + "'/><input type='hidden' id='hdnRouteWay_" + interRow + "'/><input type='hidden' id='hdnSFCRegion_" + interRow + "'/><input type='hidden' id='hdnSFCVersion_" + interRow + "'/><input type='hidden' id='hdnSFCCategory_" + interRow + "'/><span id='spnDelSFCRow_" + interRow + "' onclick='fnDeleteSFCRow(this)' style='font-weight:bold;cursor:pointer'>&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</span>");

                autoComplete(intermediate_g, "txtFromPlace", "hdnFromPlace", 'autoIntermediate');
                autoComplete(intermediate_g, "txtToPlace", "hdnToPlace", 'autoIntermediate');
                autoComplete(travelModeJson_g, "txtTravelMode", "hdnTravelMode", 'autotravel');
                fnIntermediateEventBinder();

                interRow = parseInt(interRow) + 1;
            }
        }

    }
    else {
        var preRowToPlaceId = e.id.split('_')[1];
        $("#spnDelSFCRow_" + preRowToPlaceId).css("display", "block");
        var startId = parseInt(preRowToPlaceId) + 1;
        var rowCount = interRow;
        for (var i = startId; i < rowCount; i++) {
            $("#txtToPlace_" + i).parent().parent().remove();
            interRow--;
        }

    }
}

function fnDeleteSFCRow(obj) {
    $(obj).parent().parent().remove();
    interRow--;
}

function fnHOPRouteComplete(rCnt) {

    // Only for rigid entry
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1 && intermediateNeed == "NO") {
        if ($("#txtToPlace_" + rCnt).val() != "" && $("#txtFromPlace_" + rCnt).val() != "" && $("#txtTravelMode_" + rCnt).val() != "") {

            if ($("#trInterAuto") != null) {
                $("#trInterAuto").remove();
                $("#lblRCHelp").html("");
            }

            var rowCount = 0;
            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
                if ($("#txtFromPlace_" + j).val() != "" || $("#txtToPlace_" + j).val() != "") {
                    rowCount = j;
                    break;
                }
            }
            if (rowCount == 0) {
                return false;
            }

            var newRow = document.getElementById("tblIntermediate").insertRow(parseInt(rowCount) + 1);

            $(newRow).attr('id', 'trInterAuto');

            var tdFromPlace = newRow.insertCell(0);
            var tdToPlace = newRow.insertCell(1);
            var tdTravelMode = newRow.insertCell(2);
            var tdDistance = newRow.insertCell(3);

            $(tdFromPlace).html("<label id='lblFromPlace_Auto'></label><input type='hidden'  id='hdnFromPlace_Auto'/>");
            $(tdToPlace).html("<label id='lblToPlace_Auto'></label><input type='hidden'  id='hdnToPlace_Auto'/>");
            $(tdTravelMode).html("<label id='lblTravelMode_Auto'></label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'/>");
            $(tdDistance).html("<label id='lblDistance_Auto'></label><input type='hidden' id='hdnDistanceFareCode_Auto'/><input type='hidden' id='hdnRouteWay_Auto'/><input type='hidden' id='hdnSFCRegion_Auto'/><input type='hidden' id='hdnSFCVersion_Auto'/><input type='hidden' id='hdnSFCCategory_Auto'/>");

            var autoFromPlace = "";
            var autoToPlace = "";

            for (var i = 1; i < interRow; i++) {
                if ($("#txtFromPlace_" + i).val() != "") {
                    autoToPlace = $("#txtFromPlace_" + i).val();
                    break;
                }
            }

            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
                if ($("#txtToPlace_" + j).val() != "") {
                    autoFromPlace = $("#txtToPlace_" + j).val();
                    break;
                }
            }

            // fill from and To place          

            $("#lblFromPlace_Auto").html(autoFromPlace);
            $("#lblToPlace_Auto").html(autoToPlace);
            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");

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
        else if ($("#txtToPlace_" + rCnt).val() == "" && $("#txtFromPlace_" + rCnt).val() == "") {

            var rowCount = 0;
            for (var j = (parseInt(interRow) - 1) ; j >= 1; j--) {
                if ($("#txtFromPlace_" + j).val() != "" || $("#txtToPlace_" + j).val() != "") {
                    rowCount = j;
                    break;
                }
            }
            if (rowCount == 0) {
                if ($("#trInterAuto") != null) {
                    $("#trInterAuto").remove();
                    $("#lblRCHelp").html("");
                }
            }
        }
    }
}

function fnAccompanistEventBinder() {
    // New row Creation - Accompanist Table
    $(".autoAccompanist").keyup(function () { fnCreateNewRowInAccompanist(this.id); });
    $(".autoAccompanist").dblclick(function () { fnCreateNewRowInAccompanist(this.id); });

    //$(".accPopup").click(function () { fnAccompanistPopUp(this); });
    $(".accPopup").unbind('click').bind('click', function () { fnAccompanistPopUp(this); });
    // Valid data check and SFC auto fill JSON generation method.   
    //$(".autoAccompanist").unbind('blur').bind('blur', function () { if (fnValidateAccompanist(this)) { fnIncludeAccompanistCP(this), fnGetAccompanistSFC(this); } });
    $(".autoAccompanist").unbind('blur').bind('blur', function () { fnAccompanistAdd(this); });
    $(".autoAccompanist").focus(function () { fnRemoveSFC(this); });

    // to check 1st text box empty.
    $(".accomp").blur(function () { if ($(this).val() != "") { return fnCheckAccompanist(this.id) } });

    $(".accompchk").click(function () { if ($(this).attr('checked')) { return fnCheckAccompanist(this.id) } });

    $(".accPopup").attr('title', 'More accompanists');
    //assign timepicker for accompanist start time and end time.
    $('.time').timepicker({
        showPeriod: true,
        showLeadingZero: true
    });
    fnDisableOnlyForDoctor();
    fnDisableBasedOnModeOfEntry();
    fnDisableBasedOnDoctorVisit();
}

function fnDisableOnlyForDoctor() {
    for (var i = 1; i < accompRow; i++) {
        if ($("#txtAccompanist_" + i).val() != "") {
            if ($("#txtAccompanist_" + i).val().split('(')[0].split(',')[1] == "VACANT" || $("#txtAccompanist_" + i).val().split('(')[0].split(',')[1] == "NOT ASSIGNED") {
                $("#chkOnlyDoctor_" + i).attr('checked', 'checked');
                $("#chkOnlyDoctor_" + i).attr('disabled', true);
                //$("#btnRemoveAccompanist_" + i).css("display", "block");
                $("#btnRemoveAccompanist_" + i).removeClass('accRemoveIconBlack');
                $("#btnRemoveAccompanist_" + i).addClass('accRemoveIcon');
            }
        }
    }
}

function fnDisableBasedOnModeOfEntry() {
    for (var i = 1; i < accompRow; i++) {
        if ($("#txtAccompanist_" + i).val() != "" && $("#hdnAccompMode_" + i).val() == "A") {
            $("#chkOnlyDoctor_" + i).attr('disabled', true);
            $("#txtAccompanist_" + i).attr('disabled', true);
            $("#txtAccompanist_" + i).css("background", "#A5D16C");
            //$("#popup_" + i).hide();
            $("#popup_" + i).removeClass("accPopup");
            $("#popup_" + i).removeAttr("title");
            $("#popup_" + i).unbind();
            //$("#btnRemoveAccompanist_" + i).css("display", "block");
            $("#btnRemoveAccompanist_" + i).removeClass('accRemoveIconBlack');
            $("#btnRemoveAccompanist_" + i).addClass('accRemoveIcon');
        }
    }
}

function fnDisableBasedOnDoctorVisit() {
    debugger;
    // this check is based on region code. if the user takes more than 1 accp in a same region and entered doctor for that accompanist or any one of the accompanist has taken as doctor accompanist
    // , both will be disabled in this screen.
    var acc_entry_count = 0;
    for (var i = 1; i < accompRow; i++) {
        var docAccJson = jsonPath(docAccomp_g, "$.[?(@.Acc_Region_Code=='" + $("#hdnAccompanistCode_" + i).val() + "')]");
        if (docAccJson !== undefined && docAccJson != false && docAccJson.length > 0) {
            acc_entry_count++;
            $("#chkOnlyDoctor_" + i).attr('disabled', true);
            $("#txtAccompanist_" + i).attr('disabled', true);
            //$("#popup_" + i).hide();
            $("#popup_" + i).removeClass("accPopup");
            $("#popup_" + i).removeAttr("title");
            $("#popup_" + i).unbind();
            //Error
            //$("#btnRemoveAccompanist_" + i).css("display", "block");
            $("#btnRemoveAccompanist_" + i).removeClass('accRemoveIconBlack');
            $("#btnRemoveAccompanist_" + i).addClass('accRemoveIcon');
        }
    }
    debugger;
    //Multiple time this method called 
    //For First time only
    if (chemist_visit_check) {
        chemist_visit_check = false;
        if (acc_entry_count == 0)
            fnGetDoctorVisitCount();
        //For Total the doctor and chemist count
        chemist_dco_count_g = parseInt(chemist_dco_count_g) + parseInt(acc_entry_count);
        //If doctor exist no need check chemist vist
        if (acc_entry_count == 0)
            //Contain total doc and CV count
            if (chemist_dco_count_g > 0) {
                for (var i = 1; i <= 4; i++) {
                    if ($("#txtAccompanist_" + i).val() != undefined) {
                        if ($("#txtAccompanist_" + i).val().trim() != '') {
                            $("#chkOnlyDoctor_" + i).attr('disabled', true);
                            $("#txtAccompanist_" + i).attr('disabled', true);
                            //$("#popup_" + i).hide();
                            $("#popup_" + i).removeClass("accPopup");
                            $("#popup_" + i).removeAttr("title");
                            $("#popup_" + i).unbind();
                            //Error
                            //$("#btnRemoveAccompanist_" + i).css("display", "block");
                            $("#btnRemoveAccompanist_" + i).removeClass('accRemoveIconBlack');
                            $("#btnRemoveAccompanist_" + i).addClass('accRemoveIcon');
                        }
                    }

                }
            }
    }
}

function fnIntermediateEventBinder() {
    // New row Creation - Intermediate Table
    // $(".newInter").keyup(function () { fnCreateNewRowInIntermediate(this); });
    $(".newInter").dblclick(function () { fnCreateNewRowInIntermediate(this); });
    $(".newInter").blur(function () { fnCreateNewRowInIntermediate(this); fnFillDistanceTravelMode(this.id); });

    // to fill distance ,travel mode in to_place blur event.
    $(".fillDist").blur(function () { fnFillDistanceTravelMode(this.id); });
    $(".autotravel").blur(function () { fnFillDistanceTravelMode(this.id); });

    //if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
    //    $(".changeEvent").unbind("change").bind("change", function () { alert(1);fnFillDistanceTravelMode(this.id);})
    //}

    // to check 1st row empty.
    // $(".fromPlace").blur(function () { if ($(this).val() != "") { return fnCheckFromPlace(this.id) } });


    // to check numeric for distance.
    $(".numeric").blur(function () { return fnCheckNumeric(this) });

    // Valid name check for from place to place.
    //    $(".autoIntermediate").blur(function () {
    //        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { return fnValidateValue(this, intermediate_g, "SFC Place") }
    //        else { fnRemoveErrorIndicatior(this); }
    //    });

    // Validate travel mode data.
    //$(".autotravel").blur(function () { return fnValidateValue(this, travelModeJson_g, "Travel Mode") });

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


function fnSetHeaderPrivileges() {
    debugger;
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
    //isRouteComplete = fnGetPrivilegeValue("HOP_GRID_ROUTE_COMPLETE", "NO");
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

function fnCategorySelected() {
    fnGenerateSFCJson("EVENT");
    fnCreateIntermediatePlaceTable("N");
}

function fnFillCpDetails() {
    if (cpNeed == "YES" || cpNeed == "OPTIONAL") { // check the privilege value for CAMPAIGN_PLANNER
        if ($("#CP_No").val() != "") {
            if (cp_g != "" || cp_g.length > 0) {
                var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $("#CP_No").val().split('_')[0].toString() + "'& @.Region_Name=='" + $("#CP_No").val().split('_')[1].toString() + "')]");
                if (cpJson.length > 0) {
                    $("#hdnCPCode").val(cpJson[0].CP_Code);
                    $("#ddlCategory").val(cpJson[0].Category);
                    fnSetIntermediatePrivilege();
                    $("#Work_Place").val(cpJson[0].Work_Place);
                    fnGenerateSFCJson("EVENT");
                    var isCPHOP = "";
                    cpJson[0].From_Place = cpJson[0].From_Place == null ? "" : cpJson[0].From_Place;
                    // only one from place to place in cp.                
                    if (cpJson[0].From_Place.length > 0) {
                        fnRemoveErrorIndicatior("#CP_No");
                        fnCreateIntermediatePlaceTable("Y_CP");
                    }

                        // for hop places in CP
                    else if (cpHop_g != "" && cpHop_g.length > 0 && cpJson[0].From_Place.length == 0) {
                        fnRemoveErrorIndicatior("#CP_No");
                        fnCreateIntermediatePlaceTable("Y_CPHOP");
                        isCPHOP = "YES";
                    }

                        // if the hop place and the fromplace to place in CP Master ,both are empty.
                    else {
                        fnRemoveErrorIndicatior("#CP_No");
                        fnCreateIntermediatePlaceTable("N");
                    }

                    //HOP Route Complete
                    if (isCPHOP != "YES") {
                        if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {

                                    fnHOPRouteComplete("1");
                                }
                            }
                        }
                    }
                }
                else if (cpNeed == "OPTIONAL") {
                    $("#hdnCPCode").val("");
                    fnRemoveErrorIndicatior("#CP_No");
                    fnCreateIntermediatePlaceTable("N");
                }
                else {
                    $("#hdnCPCode").val("");
                    fnRemoveErrorIndicatior("#CP_No");
                    return false;
                }
            }
        }
        else {
            $("#hdnCPCode").val("");
            fnRemoveErrorIndicatior("#CP_No");
        }
    }
}

function fnFillDistanceTravelMode(id) {
    var rCnt = id.split('_')[1];

    // Start: if no SFC Vaidation is there, System sholud allows to travel mode any one. so we include the travel mode in the condition.
    // user selected the master from place and To Place 
    if ($("#txtFromPlace_" + rCnt).val() != "" && $("#txtToPlace_" + rCnt).val() != "" && $("#txtTravelMode_" + rCnt).val() != "") {
        if (sfc_g != "") {
            var distanceJson = []
            for (var i = 0; i < Acc_Id_g.length; i++) {
                var result = "";
                // filter the auto fill based on the category selection
                if (($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) && categoryCheckNeeded == "YES") {
                    result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "'  & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + rCnt).val() + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                    if (result != null && result != undefined && result != false)
                        distanceJson.push(result);
                }
                else if (Acc_Id_g[i].trim() == currentRegion.trim() && categoryCheckNeeded == "NO" && ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1)) {
                    result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "'  & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + rCnt).val() + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                    if (result != null && result != undefined && result != false)
                        distanceJson.push(result);
                }
                else {
                    result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' ) & @.Travel_Mode == '" + $("#txtTravelMode_" + rCnt).val() + "'& @.Region_Code=='" + Acc_Id_g[i] + "' | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "'& @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                    if (result != null && result != undefined && result != false)
                        distanceJson.push(result);
                }
            }
            //
            if (distanceJson != null && distanceJson.length > 0) {
                var cur_sfc = distanceJson[0];
                $("#txtDistance_" + rCnt).val(cur_sfc[0].Distance);
                $("#txtTravelMode_" + rCnt).val(cur_sfc[0].Travel_Mode);
                $("#hdnDistanceFareCode_" + rCnt).val(cur_sfc[0].Distance_Fare_Code);
                // Change attribute Disabled to Distance based on hdnDistanceFareCode
                if ($("#hdnDistanceFareCode_" + rCnt).val() != "") {
                    $("#txtDistance_" + rCnt).attr("disabled", "disabled");
                }
                $("#hdnSFCRegion_" + rCnt).val(cur_sfc[0].SFC_Region_Code);
                $("#hdnSFCVersion_" + rCnt).val(cur_sfc[0].SFC_Version_No);
                $("#hdnSFCCategory_" + rCnt).val(cur_sfc[0].SFC_Category_Name);
                if ($("#txtFromPlace_" + rCnt).val() == cur_sfc[0].To_Place && $("#txtToPlace_" + rCnt).val() == cur_sfc[0].From_Place) {
                    $("#hdnRouteWay_" + rCnt).val("R");
                }
                else {
                    $("#hdnRouteWay_" + rCnt).val("D");
                }
                //HOP Route Complete
                if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                        if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                            fnHOPRouteComplete(rCnt);
                        }
                    }
                }
                return;
            }
            else {
                $("#txtDistance_" + rCnt).val("0");
                // $("#txtTravelMode_" + rCnt).val("");
                $("#hdnDistanceFareCode_" + rCnt).val("");

                // Change attribute Disabled to Distance based on hdnDistanceFareCode
                if ($("#hdnDistanceFareCode_" + rCnt).val() == "") {
                    $("#txtDistance_" + rCnt).removeAttr("disabled");
                }

                $("#hdnRouteWay_" + rCnt).val("");
                $("#hdnSFCRegion_" + rCnt).val(currentRegion);
                $("#hdnSFCVersion_" + rCnt).val("");
                $("#hdnSFCCategory_" + rCnt).val($("#ddlCategory :selected").text().toUpperCase());
                return;
            }
        }
    }

    if ($("#txtFromPlace_" + rCnt).val() != "" || $("#txtToPlace_" + rCnt).val() != "") {

        // SFC autofill
        if ($("#txtFromPlace_" + rCnt).val() != "" && $("#txtToPlace_" + rCnt).val() != "") {

            if (sfc_g != "") {
                var distanceJson = [];
                //if (categoryCheckNeeded == "YES") { // sfc category check
                //    var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "'  & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' ) | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "'))]");
                //}
                //else {
                //    var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' ) | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "'))]");
                //}
                for (var i = 0; i < Acc_Id_g.length; i++) {
                    var result = "";
                    // filter the auto fill based on the category selection
                    if (($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) && categoryCheckNeeded == "YES") {
                        result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "'  & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                    else if (Acc_Id_g[i].trim() == currentRegion.trim() && categoryCheckNeeded == "NO" && ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1)) {
                        result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "'  & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "'& @.SFC_Category_Name == '" + $("#ddlCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                    else {
                        result = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' ) &  @.Region_Code=='" + Acc_Id_g[i] + "' | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "'& @.Region_Code=='" + Acc_Id_g[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                }
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
                    if (f_distanceJson.length > 1) { // if more than one sfc data available show pop up
                        fnSFCOptionPopup(f_distanceJson, rCnt);
                    }
                    else {
                        var cur_sfc = f_distanceJson[0];
                        $("#txtDistance_" + rCnt).val(cur_sfc.Distance);
                        $("#txtTravelMode_" + rCnt).val(cur_sfc.Travel_Mode);
                        $("#hdnDistanceFareCode_" + rCnt).val(cur_sfc.Distance_Fare_Code);
                        // Change attribute Disabled to Distance based on hdnDistanceFareCode
                        if ($("#hdnDistanceFareCode_" + rCnt).val() != "") {
                            $("#txtDistance_" + rCnt).attr("disabled", "disabled");
                        }
                        $("#hdnSFCRegion_" + rCnt).val(cur_sfc.SFC_Region_Code);
                        $("#hdnSFCVersion_" + rCnt).val(cur_sfc.SFC_Version_No);
                        $("#hdnSFCCategory_" + rCnt).val(cur_sfc.SFC_Category_Name);
                        if ($("#txtFromPlace_" + rCnt).val() == cur_sfc.To_Place && $("#txtToPlace_" + rCnt).val() == cur_sfc.From_Place) {
                            $("#hdnRouteWay_" + rCnt).val("R");
                        }
                        else {
                            $("#hdnRouteWay_" + rCnt).val("D");
                        }
                        //HOP Route Complete
                        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                    fnHOPRouteComplete(rCnt);
                                }
                            }
                        }
                    }
                }
                    // if no from place to place combination found.
                else {
                    $("#txtDistance_" + rCnt).val("0");
                    //  $("#txtTravelMode_" + rCnt).val("");
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
                    if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                                fnHOPRouteComplete(rCnt);
                            }
                        }
                    }
                }

            }
                // if no from place to place combination found.
            else {
                $("#txtDistance_" + rCnt).val("0");
                // $("#txtTravelMode_" + rCnt).val("");
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
            // $("#txtTravelMode_" + rCnt).val("");
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

        $("#txtDistance_" + rCnt).val("");
        //  $("#txtTravelMode_" + rCnt).val("");
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
        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    fnHOPRouteComplete(rCnt);
                }
            }
        }
    }
}


function fnReadIntermediateData() {
    var intermediatePlace = "";
    var val = true;
    for (var x = 1; x < interRow; x++) {
        if ($("#txtFromPlace_" + x).val() != "") {
            fromPlace = $("#txtFromPlace_" + x).val();
            toPlace = $("#txtToPlace_" + x).val();

            for (var j = 1; j < interRow; j++) {
                var fp = $("#txtFromPlace_" + j).val();
                var tp = $("#txtToPlace_" + j).val();

                if (fromPlace == fp && toPlace == tp && x != j) {
                    //fnMsgAlert('info', 'Tour Planner', 'You are already entered this rout,please select the another rout');
                    // val = false;
                    return false;
                }

            }
        }
    }
    for (var i = 1; i < interRow; i++) {
        if (!$("#txtFromPlace_" + i).parent().parent().hasClass("newRow")) {
            if ($("#txtFromPlace_" + i).val() != "") {
                intermediatePlace += $("#txtFromPlace_" + i).val() + '^';
                intermediatePlace += $("#txtToPlace_" + i).val() + '^';
                intermediatePlace += $("#txtDistance_" + i).val() + '^';
                intermediatePlace += $("#txtTravelMode_" + i).val() + '^';
                intermediatePlace += $("#hdnDistanceFareCode_" + i).val() + '^';
                intermediatePlace += $("#hdnRouteWay_" + i).val() + '^';
                intermediatePlace += 'N^';
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

    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1) && intermediateNeed == "NO") {
                if ($("#trInterAuto") != null) {
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
                    if ($("#hdnIs_TP_SFC_" + i).val() != undefined && $("#hdnIs_TP_SFC_" + i).val() != '' && $("#hdnIs_TP_SFC_" + i).val() != 'null')
                        intermediatePlace += $("#hdnIs_TP_SFC_" + i).val() + '^';
                    else
                        intermediatePlace += '0^';
                }
            }
        }
    }
    return intermediatePlace;
}

function fnValidateHeader() {
    // for CP
    if (flag_g.toUpperCase() != "A") {
        if (cpNeed == "YES" || cpNeed == "OPTIONAL") {
            if (cpNeed == "YES") {
                if ($("#CP_No").val() == "") {
                    fnMsgAlert("info", "DCR Header", "Please enter the field 'Cp No'.");
                    //$.msgbox('Please enter the field Cp No.');
                    fnErrorIndicator("#CP_No");
                    return false;
                }
                else {
                    var disJson = jsonPath(cpJson_g, "$.[?(@.label=='" + $("#CP_No").val() + "')]");

                    if (disJson != false) {
                        $("#hdnCPCode").val(disJson[0].value)
                    }
                    else {
                        $("#hdnCPCode").val('');
                    }

                    if ($("#CP_No").val() != '') {
                        if ($("#hdnCPCode").val() == '' || $("#hdnCPCode").val().length == 0) {
                            fnMsgAlert("info", "DCR Header", "Invalid CP Name.");
                            fnErrorIndicator("#CP_No");
                            return false;
                        }
                    }

                    //if ($("#hdnCPCode").val().length == 0) {
                    //    //fnBarAlert("Error", "Error", "Invalid CP Name");
                    //    //$.msgbox('Invalid CP Name.');
                    //    fnMsgAlert("info", "DCR Header", "Invalid CP Name.");
                    //    fnErrorIndicator("#CP_No");
                    //    return false;
                    //}
                }
            }

            if (cp_g != "" && cp_g.length > 0) {
                var cpJson = jsonPath(cp_g, "$.[?(@.CP_No=='" + $("#CP_No").val().split('_')[0] + "')]");
                {
                    if (cpJson.length > 0) {
                        if (cpJson[0].Category_Name != null && cpJson[0].Category_Name != "") {
                            if (cpJson[0].Region_Code == currentRegion) {
                                if (cpJson[0].Category_Name.toUpperCase() != $("#ddlCategory :selected").text().toUpperCase()) {
                                    fnMsgAlert('info', 'DCR Header', 'The Entered CP No "' + $("#CP_No").val().split('_')[0] + '" does not belong to Work Category ' + $("#ddlCategory :selected").text() + ' . Please check the CP master for correct CP No.');
                                    //$.msgbox('The Entered CP No "' + $("#CP_No").val() + '" does not belong to category ' + $("#ddlCategory :selected").text() + ' . Please check the CP master for correct CP No.');
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        // end CP
    }


    // Mandatory fields check.
    if ($("#Work_Place").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'Work Place'. ");
        //$.msgbox("Please enter the field 'Work Place'. ");
        fnErrorIndicator("#Work_Place");
        return false;
    }

    // Special char check.
    //if (!(fnCheckRemarksSpecialChar("#Work_Place"))) {
    //    return false;
    //}
    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#Work_Place"))) {
        fnMsgAlert('info', 'Information', 'Please remove the special characters in Work Place. <br/> The following characters are only allowed _().');
        fnErrorIndicator("#Work_Place");
        return false;
    }



    if (cpNeed != "NO") {
        //if (!(fnCheckRemarksSpecialChar("#CP_No"))) {
        //    return false;
        //}
        if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#CP_No"))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters in CP. <br/> The following characters are only allowed _().');
            fnErrorIndicator("#CP_No");
            return false;
        }
    }

    // for all the category, atleast one record is mandatory for the following fields.
    if ($("#txtFromPlace_1").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
        //$.msgbox("Please enter the field 'From Place'.");
        fnErrorIndicator("#txtFromPlace_1");
        return false;
    }

    if ($("#txtToPlace_1").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'To Place'. ");
        // $.msgbox("Please enter the field 'To Place'.");
        fnErrorIndicator("#txtToPlace_1");
        return false;
    }

    if ($("#txtDistance_1").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'Distance'. ");
        //$.msgbox("Please enter the field 'Distance'.");

        fnErrorIndicator("#txtDistance_1");
        return false;
    }

    if ($("#txtTravelMode_1").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'Travel Mode'. ");
        //$.msgbox("Please enter the field 'Travel Mode'.");
        fnErrorIndicator("#txtTravelMode_1");
        return false;
    }
    else {
        if (!fnValidateValue($("#txtTravelMode_1"), travelModeJson_g, "Travel Mode")) {
            return false;
        }
    }

    // for categories other than HQ have the intermediate record. validation for that fields.
    if ($("#ddlCategory :selected").text() != "HQ" && intermediateNeed == "YES") {
        for (var i = 2; i < interRow; i++) {
            if ($("#txtFromPlace_" + i).val() != "" || $("#txtToPlace_" + i).val() != "") {

                if (!$("#txtFromPlace_" + i).parent().parent().hasClass("newRow")) {
                    // empty check
                    if ($("#txtFromPlace_" + i).val() == "") {
                        fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'. ");
                        //$.msgbox("Please enter the field 'From Place'. ");
                        fnErrorIndicator("#txtToPlace_" + i);
                        return false;
                    }
                    if ($("#txtToPlace_" + i).val() == "") {
                        fnMsgAlert("info", "DCR Header", "Please enter the field 'To Place'. ");
                        //$.msgbox("Please enter the field 'To Place'.");
                        fnErrorIndicator("#txtToPlace_" + i);
                        return false;
                    }
                    if ($("#txtDistance_" + i).val() == "") {
                        fnMsgAlert("info", "DCR Header", "Please enter the field 'Distance'. ");
                        //$.msgbox("Please enter the field 'Distance'.");
                        fnErrorIndicator("#txtDistance_" + i);
                        return false;
                    }
                    if ($("#txtTravelMode_" + i).val() == "") {
                        fnMsgAlert("info", "DCR Header", "Please enter the field 'Travel Mode'. ");
                        //$.msgbox("Please enter the field 'Travel Mode'.");
                        fnErrorIndicator("#txtTravelMode_" + i);
                        return false;
                    }
                    else {
                        if (!fnValidateValue($("#txtTravelMode_" + i), travelModeJson_g, "Travel Mode")) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    // special char check
    for (var i = 1; i < interRow; i++) {
        if ($("#txtFromPlace_" + i).val() != "" || $("#txtToPlace_" + i).val() != "") {
            //if (!(fnCheckRemarksSpecialChar("#txtFromPlace_" + i))) {
            //    return false;
            //}

            //if (!(fnCheckRemarksSpecialChar("#txtToPlace_" + i))) {
            //    return false;
            //}
            if (!$("#txtFromPlace_" + i).parent().parent().hasClass("newRow")) {
                if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#txtFromPlace_" + i))) {
                    fnMsgAlert('info', 'Information', 'Please remove the special characters in From Place. <br/> The following characters are only allowed _().');
                    return false;
                }
                if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#txtToPlace_" + i))) {
                    fnMsgAlert('info', 'Information', 'Please remove the special characters in To Place. <br/> The following characters are only allowed _().');
                    return false;
                }
            }
        }
    }

    // Intermediate check.
    if (intermediateNeed == "YES" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        for (var i = 1; i < interRow; i++) {
            var nxtRow = parseInt(i) + 1;
            if ($("#txtFromPlace_" + nxtRow).length > 0) {
                if ($("#txtToPlace_" + i).val() != $("#txtFromPlace_" + nxtRow).val()) {
                    alert("Dear user, The Row no: " + nxtRow + " FromPlace and Row no:" + i + " To Place does not matched. Please correct then continue your DCR.");
                    return false;
                }
            }
        }
        if ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1 && $("#ddlCategory :selected").text().toUpperCase() != "HQ" && $.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
            var FrmPlaceArray = new Array()
            FrmPlaceArray.clear();
            var ToPlaceArray = new Array()
            ToPlaceArray.clear();
            for (var i = 1; i < interRow; i++) {
                if (!$("#txtFromPlace_" + i).parent().parent().hasClass("newRow")) {
                    FrmPlaceArray.push($("#txtFromPlace_" + i).val());
                    ToPlaceArray.push($("#txtToPlace_" + i).val());
                }
            }

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



    // sfc validation.
    //var routeCompleteValid = "^^";
    //var distPlaces = new Array();

    for (var i = 1; i < interRow; i++) {
        if (!$("#txtFromPlace_" + i).parent().parent().hasClass("newRow")) {
            if ($("#txtFromPlace_" + i).val() != "") {

                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (!fnValidateValue($("#txtFromPlace_" + i), intermediate_g, "From Place")) {
                        return false;
                    }

                    if (!fnValidateValue($("#txtToPlace_" + i), intermediate_g, "To Place")) {
                        return false;
                    }

                    //// to check route complete
                    //routeCompleteValid += $("#txtFromPlace_" + i).val() + "^^";
                    //routeCompleteValid += $("#txtToPlace_" + i).val() + "^^";

                    //if (!($.inArray($("#txtFromPlace_" + i).val(), distPlaces) > -1)) {
                    //    distPlaces.push($("#txtFromPlace_" + i).val());
                    //}
                    //if (!($.inArray($("#txtToPlace_" + i).val(), distPlaces) > -1)) {
                    //    distPlaces.push($("#txtToPlace_" + i).val());
                    //}

                    if (sfc_g != "") {
                        var distanceJson = "";
                        if (categoryCheckNeeded == "YES") { // sfc category check
                            distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + i).val()
                                                               + "' & @.To_Place == '" + $("#txtToPlace_" + i).val()
                                                               + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + i).val()
                                                               + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                               + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val()
                                                               + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_" + i).val()
                                                               + "' ) | (@.From_Place=='" + $("#txtToPlace_" + i).val()
                                                                  + "' & @.To_Place == '" + $("#txtFromPlace_" + i).val()
                                                                  + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + i).val()
                                                                  + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                                  + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val()
                                                                  + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_" + i).val() + "'))]");
                        }
                        else {
                            distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + i).val()
                                                               + "' & @.To_Place == '" + $("#txtToPlace_" + i).val()
                                                               + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + i).val()
                                                               + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                               + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val()
                                                               + "') | (@.From_Place=='" + $("#txtToPlace_" + i).val()
                                                                 + "' & @.To_Place == '" + $("#txtFromPlace_" + i).val()
                                                                 + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + i).val()
                                                                 + "' & @.Distance == '" + $("#txtDistance_" + i).val()
                                                                 + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + i).val() + "'))]");
                        }
                        if (!distanceJson) {
                            //if (distanceJson == null || !distanceJson) {
                            fnMsgAlert('info', 'DCR Header', 'One of the required route is not defined in SFC Master.Request you to contact the salesadmin to continue with DCR.');
                            //$.msgbox("The entered route is not available in your SFC master.");
                            fnErrorIndicatorforSFC("#txtToPlace_" + i);
                            fnErrorIndicatorforSFC("#txtFromPlace_" + i);
                            fnErrorIndicatorforSFC("#txtDistance_" + i);
                            return false;
                        }
                    }
                }

            }
        }
        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {

            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    if ($("#trInterAuto") != null) {

                        //// to check route complete
                        //routeCompleteValid += $("#lblFromPlace_Auto").html() + "^^";
                        //routeCompleteValid += $("#lblToPlace_Auto").html() + "^^";

                        if (sfc_g != "") {
                            var distanceJson = "";
                            //var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#lblFromPlace_Auto").html() + "' & @.To_Place == '" + $("#lblToPlace_Auto").html() + "' & @.Distance == '" + $("#lblDistance_Auto").html() + "') | (@.From_Place=='" + $("#lblToPlace_Auto").html() + "' & @.To_Place == '" + $("#lblFromPlace_Auto").html() + "' & @.Distance == '" + $("#lblDistance_Auto").html() + "'))]");
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

                            if (distanceJson == null || !distanceJson) {
                                fnMsgAlert('info', 'DCR Header', 'One of the required route is not defined in SFC Master.Request you to contact the salesadmin to continue with DCR.');
                                //$.msgbox("The entered route is not available in your SFC master.");
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
    }

    ////route complete Check
    //for (var a = 0; a < distPlaces.length; a++) {
    //    var place = '^' + distPlaces[a] + '^';
    //    if ((routeCompleteValid.split(place).length - 1) % 2 == 1) {// Mismatched route
    //        for (var m = 1; m < interRow; m++) {                
    //            if ($("#txtFromPlace_" + m).val() == distPlaces[a]) {
    //                fnMsgAlert('info', 'DCR Header', 'Incomplete Route.'); 
    //                fnErrorIndicatorforSFC("#txtFromPlace_" + m);
    //                return false;
    //            }
    //            if ($("#txtToPlace_" + m).val() == distPlaces[a]) {
    //                fnMsgAlert('info', 'DCR Header', 'Incomplete Route.');
    //                fnErrorIndicatorforSFC("#txtToPlace_" + m);
    //                return false;
    //            }
    //        }
    //    }
    //}
    // sfc validation end.

    // accompnist validation
    if (flag_g.toUpperCase() != "A") {
        var accompcount = 0;
        var accArr = [];
        for (var i = 1; i < accompRow; i++) {
            if ($("#txtAccompanist_" + i).val() != "") {
                if ($('#hdnAccompanistCode_' + i).val() == "") {
                    //$.msgbox($("#txtAccompanist_" + i).val() + " is invalid accomapnist name.");
                    fnMsgAlert('info', 'DCR Header', $("#txtAccompanist_" + i).val() + " is invalid accompanist name. <br />Reason: <br /> 1.Either you have entered WRONG accompanist name; <br/> 2.Prefilled accompanist may NOT be active in the system.<br />Please check the entered/prefiled accompanist name.");
                    fnErrorIndicator("#txtAccompanist_" + i);
                    return false;
                }

                // Start Time and End Time Madatory validation.
                if ($('#txtEndTime_' + i).val().length > 0) {
                    if ($('#txtStartTime_' + i).val().length == 0) {
                        //$.msgbox("Please enter the start time for accompanist " + $("#txtAccompanist_" + i).val());
                        fnMsgAlert('info', 'DCR Header', "Please enter the start time for accompanist " + $("#txtAccompanist_" + i).val());
                        return false;
                    }
                }

                if ($('#txtStartTime_' + i).val().length > 0) {
                    if ($('#txtEndTime_' + i).val().length == 0) {
                        //$.msgbox("Please enter the end time for accompanist " + $("#txtAccompanist_" + i).val());
                        fnMsgAlert('info', 'DCR Header', "Please enter the end time for accompanist " + $("#txtAccompanist_" + i).val());
                        return false;
                    }
                }

                if (Date.parse("2001/01/01 " + $('#txtStartTime_' + i).val()) > Date.parse("2001/01/01 " + $('#txtEndTime_' + i).val())) {
                    fnMsgAlert('info', 'DCR Header', "Start time cannot be greater than end time.");
                    $('#txtStartTime_' + i).focus();
                    return false;
                }

                // Check for Stockiest name repeatation
                if ($.inArray($("#txtAccompanist_" + i).val(), accArr) > -1) {
                    fnMsgAlert('info', 'DCR Header', 'The accompanist name ' + $("#txtAccompanist_" + i).val() + ' is entered more than one time. It is not allowed.');
                    //$.msgbox('The accompanist name ' + $("#txtAccompanist_" + i).val() + ' is entered more than one time. It is not allowed.');
                    fnErrorIndicator("#txtAccompanist_" + i);
                    return false;
                }
                accArr.push($("#txtAccompanist_" + i).val());
                accompcount++;

            }
        }

        if (accompcount < accMandatory) { // DCR_ACCOMPANIST_MANDATORY privilege check.
            //$.msgbox('Please enter atleast ' + accMandatory + ' accompanist name(s).');
            fnMsgAlert('info', 'DCR Header', 'Please enter atleast ' + accMandatory + ' accompanist name(s).');
            return false;
        }
    }
    // accompanist validation end

    // Time validation
    var dcrtimeMandatory = fnGetPrivilegeValue("DCR_WORK_TIME_MANDATORY", "OPTIONAL");
    if (dcrtimeMandatory == "MANDATORY") {
        if ($.trim($('#Start_Time').val()).length == 0) {
            fnMsgAlert('info', 'DCR Header', 'Please enter the start time.');
            return false;
        }

        if ($.trim($('#End_Time').val()).length == 0) {
            fnMsgAlert('info', 'DCR Header', 'Please enter the end time.');
            return false;
        }
    }
    if ($.trim($('#End_Time').val()).length > 0 && $.trim($('#Start_Time').val()).length > 0) {
        if (Date.parse("2001/01/01 " + $('#Start_Time').val()) > Date.parse("2001/01/01 " + $('#End_Time').val())) {
            fnMsgAlert('info', 'DCR Header', "Start time cannot be greater than end time.");
            $('#Start_Time').focus();
            return false;
        }
    }

    if (flag_g.toUpperCase() == "A") {
        var rowLength = $('#tblActivity tr').length;
        var cntActive = 0;
        for (var i = 0; i < rowLength; i++) {
            // skip the header row.
            if (i == 0) {
                continue;
            }
            if ($.trim($('#txtactivity_' + i.toString()).val()).length > 0) {
                cntActive = parseInt(cntActive) + 1;
                var entryCount = 0;
                for (j = 0; j < rowLength; j++) {
                    if ($.trim($('#txtactivity_' + i.toString()).val()) == $.trim($('#txtactivity_' + j.toString()).val())) {
                        entryCount++;
                        if (entryCount > 1) {
                            //$.msgbox("The activity " + $.trim($('#txtactivity_' + j.toString()).val()) + " has multiple entries.");
                            fnMsgAlert('info', 'DCR Header', "The activity " + $.trim($('#txtactivity_' + j.toString()).val()) + " has multiple entries.");
                            return false;
                        }
                    }
                }
                $('#hdnactivity_' + i.toString()).val('');
                for (var index = 0; index < activityJSON_g.length; index++) {
                    if ($.trim(activityJSON_g[index].label) == $.trim($('#txtactivity_' + i.toString()).val())) {
                        $('#hdnactivity_' + i.toString()).val($.trim(activityJSON_g[index].value));
                        break;
                    }
                }
                if ($('#hdnactivity_' + i.toString()).val().length == 0) {
                    // $.msgbox($.trim($('#txtactivity_' + i.toString()).val()) + ' is invalid Activity.');
                    fnMsgAlert('info', 'DCR Header', $.trim($('#txtactivity_' + i.toString()).val()) + ' is invalid Activity.');
                    return false;
                }

                if ($.trim($('#txtstarttime_' + i).val()).length == 0) {
                    $.msgbox("Please enter the start time for the activity " + $("#txtactivity_" + i).val());
                    return false;
                }

                if ($.trim($('#txtendtime_' + i).val()).length == 0) {
                    $.msgbox("Please enter the end time for the activity " + $("#txtactivity_" + i).val());
                    return false;
                }
                // Start Time and End Time Madatory validation.
                if ($('#txtendtime_' + i).val().length > 0) {
                    if ($('#txtstarttime_' + i).val().length == 0) {
                        //$.msgbox("Please enter the start time for the activity " + $("#txtactivity_" + i).val());
                        fnMsgAlert('info', 'DCR Header', "Please enter the start time for the activity " + $("#txtactivity_" + i).val());
                        return false;
                    }
                }

                if ($('#txtstarttime_' + i).val().length > 0) {
                    if ($('#txtendtime_' + i).val().length == 0) {
                        fnMsgAlert('info', 'DCR Header', "Please enter the end time for the activity " + $("#txtactivity_" + i).val());
                        return false;
                    }
                }

                if ($.trim($('#txtendtime_' + i).val()).length > 0 && $.trim($('#txtstarttime_' + i).val()).length > 0) {
                    if (Date.parse("2001/01/01 " + $('#txtstarttime_' + i).val()) > Date.parse("2001/01/01 " + $('#txtendtime_' + i).val())) {
                        fnMsgAlert('info', 'DCR Header', "Start time cannot be greater than end time.");
                        $('#txtstarttime_' + i).focus();
                        return false;
                    }
                }

                if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($("#Work_Place"))) {
                    fnMsgAlert('info', 'Information', 'Please remove the special characters in Work Place. <br/> The following characters are only allowed _().');
                    fnErrorIndicator("#Work_Place");
                    return false;
                }

                if ($.trim($('#txtRemarks_' + i.toString()).val()).length > 0) {
                    //if (!(fnCheckRemarksSpecialCharforDCR("#txtRemarks_" + i))) {
                    //    HideModalPopup('dvLoading');
                    //    return false;
                    //}                 
                    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtRemarks_" + i))) {

                        fnMsgAlert('info', 'Information', 'Please Enter the following characters only ' + allowCharacterinAttendatesDCR + ' in activity remarks ' + i + '');
                        // fnErrorIndicator("#Work_Place");
                        return false;
                    }
                    //if (!(fnCheckRemarksSpecialChar("#txtRemarks_" + i))) {
                    //    HideModalPopup('dvLoading');
                    //    return false;
                    //}
                    if ($.trim($('#txtRemarks_' + i.toString()).val()).length > 500) {
                        HideModalPopup('dvLoading');
                        fnMsgAlert('info', 'DCR Header', 'You have entered more then 500 character in remarks. That is not allowed.');
                        //$.msgbox('You have entered more then 500 character in remarks. That is not allowed.');
                        fnErrorIndicator("#txtExpenseRemark_" + i);
                        return false;
                    }
                }
            }

            if (cntActive == 0) {
                HideModalPopup('dvLoading');
                $.msgbox('Please Enter atleast one activity.');
                return false;
            }
        }
    }

    return true;
}


function fnSubmitHeader() {
    debugger;
    if ($('#Work_Place').val() == "") {
        $('#Work_Place').val($('#txtToPlace_1').val());
    }

    ShowModalPopup('dvLoading');
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
                cpCode = $("#hdnCPCode").val();
                cpName = $("#CP_No").val().split('_')[0];
            }
            else if (cpNeed == "OPTIONAL") {
                if ($("#hdnCPCode").val() != "") {
                    cpCode = $("#hdnCPCode").val();
                    cpName = $("#CP_No").val().split('_')[0];
                }
                else {
                    cpCode = $("#CP_No").val();
                    cpName = $("#CP_No").val().split('_')[0];
                }
            }
        }

        //get other text box values.       
        workPlace = $("#Work_Place").val();
        if ($("#Start_Time").val() != "") {
            startTime = $("#Start_Time").val();
        }
        if ($("#End_Time").val() != "") {
            endTime = $("#End_Time").val();
        }
        category = $("#ddlCategory :selected").text();
        entityCode = $("#ddlCategory").val();

        // get Place Values
        if (category == "HQ") {
            if ($("#hdnRouteWay_1").val() == "R") {
                fromPlace = $("#txtToPlace_1").val();
                toPlace = $("#txtFromPlace_1").val();
            }
            else {
                fromPlace = $("#txtFromPlace_1").val();
                toPlace = $("#txtToPlace_1").val();
            }
            distance = $("#txtDistance_1").val();
            travelMode = $("#txtTravelMode_1").val();
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
            if ($("#ddlCategory :selected").text().toUpperCase() == "HQ") {
                if ($("#hdnRouteWay_1").val() == "R") {
                    fromPlace = $("#txtToPlace_1").val();
                    toPlace = $("#txtFromPlace_1").val();
                }
                else {
                    fromPlace = $("#txtFromPlace_1").val();
                    toPlace = $("#txtToPlace_1").val();
                }
                distance = $("#txtDistance_1").val();
                travelMode = $("#txtTravelMode_1").val();
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
                if (intermediateData != "") {
                    var travelKm = 0;
                    for (var i = 1; i < interRow; i++) {
                        if (!$("#txtFromPlace_" + i).parent().parent().hasClass("newRow")) {
                            if ($("#txtFromPlace_" + i).val() != "") {
                                travelKm += parseInt($("#txtDistance_" + i).val());
                            }
                        }
                    }

                    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1) && intermediateNeed == "NO") {
                                if ($("#trInterAuto") != null) {
                                    travelKm += parseInt($("#lblDistance_Auto").html());
                                }
                            }
                        }
                    }
                    distance = travelKm.toString();
                }
                else {
                    HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'DCR', 'Duplicate From & To Place exist in Place details. Please remove one then click the Go Doctor Visit.');
                    return false;
                }
            }
        }

        if (flag_g.toUpperCase() != "A") {
            //get accompanist value
            acc_g = [];
            for (var i = 1; i < accompRow; i++) {
                if ($("#txtAccompanist_" + i).val() != "") {

                    switch (i) {
                        case 1:
                            acc1Type = $("#txtAccompanist_1").val().split('(')[1].split(')')[0];
                            acc1StartTime = $("#txtStartTime_1").val();
                            acc1EndTime = $("#txtEndTime_1").val();
                            if ($("#chkOnlyDoctor_1").attr('checked')) {
                                acc1OnlyDoctor = $("#hdnAccompanistCode_1").val();
                                acc1Name = "";
                                acc1Type = "";
                            }
                            else {
                                acc1Name = $("#txtAccompanist_1").val().split('(')[0].split(',')[1];
                            }
                            if ($("#hdnAccompMode_1").val() != "") {
                                acc1Mode = $("#hdnAccompMode_1").val();
                            }
                            acc_g.push({ accName: $("#txtAccompanist_1").val(), accCode: $("#hdnAccompanistCode_1").val(), accOnlyDoc: $("#chkOnlyDoctor_1").attr('checked'), accMode: acc1Mode });
                            break;
                        case 2:
                            acc2Type = $("#txtAccompanist_2").val().split('(')[1].split(')')[0];
                            acc2StartTime = $("#txtStartTime_2").val();
                            acc2EndTime = $("#txtEndTime_2").val();
                            if ($("#chkOnlyDoctor_2").attr('checked')) {
                                acc2OnlyDoctor = $("#hdnAccompanistCode_2").val();
                                acc2Name = "";
                                acc2Type = "";
                            }
                            else {
                                acc2Name = $("#txtAccompanist_2").val().split('(')[0].split(',')[1];
                            }
                            if ($("#hdnAccompMode_2").val() != "") {
                                acc2Mode = $("#hdnAccompMode_2").val();
                            }
                            acc_g.push({ accName: $("#txtAccompanist_2").val(), accCode: $("#hdnAccompanistCode_2").val(), accOnlyDoc: $("#chkOnlyDoctor_2").attr('checked'), accMode: acc2Mode });
                            break;
                        case 3:

                            acc3Time = $("#txtStartTime_3").val() + '_' + $("#txtEndTime_3").val();
                            if ($("#chkOnlyDoctor_3").attr('checked')) {
                                acc3OnlyDoctor = $("#hdnAccompanistCode_3").val();
                                acc3Name = "";
                            }
                            else {
                                acc3Name = $("#txtAccompanist_3").val().split('(')[0].split(',')[1];
                            }
                            if ($("#hdnAccompMode_3").val() != "") {
                                acc3Mode = $("#hdnAccompMode_3").val();
                            }
                            acc_g.push({ accName: $("#txtAccompanist_3").val(), accCode: $("#hdnAccompanistCode_3").val(), accOnlyDoc: $("#chkOnlyDoctor_3").attr('checked'), accMode: acc3Mode });
                            break;
                        case 4:

                            acc4Time = $("#txtStartTime_4").val() + '_' + $("#txtEndTime_4").val();
                            if ($("#chkOnlyDoctor_4").attr('checked')) {
                                acc4OnlyDoctor = $("#hdnAccompanistCode_4").val();
                                acc4Name = "";
                            }
                            else {
                                acc4Name = $("#txtAccompanist_4").val().split('(')[0].split(',')[1];
                            }
                            if ($("#hdnAccompMode_4").val() != "") {
                                acc4Mode = $("#hdnAccompMode_4").val();
                            }
                            acc_g.push({ accName: $("#txtAccompanist_4").val(), accCode: $("#hdnAccompanistCode_4").val(), accOnlyDoc: $("#chkOnlyDoctor_4").attr('checked'), accMode: acc4Mode });
                            break;
                        default:
                            break;
                    }
                }
            }
        }


        if (flag_g.toUpperCase() == "A") {
            var rowLength = $('#tblActivity tr').length;
            var activityString = "";
            for (var i = 0; i < rowLength; i++) {
                // skip the header row.
                if (i == 0) {
                    continue;
                }
                if ($.trim($('#txtactivity_' + i.toString()).val()).length > 0) {
                    var projectCode = $('#hdnactivity_' + i.toString()).val().split('_')[1];
                    var activityCode = $('#hdnactivity_' + i.toString()).val().split('_')[0];
                    var astartTime = $('#txtstarttime_' + i.toString()).val();
                    var aendTime = $('#txtendtime_' + i.toString()).val();
                    var remarks = $.trim($('#txtRemarks_' + i.toString()).val());
                    activityString += projectCode + "^" + activityCode + "^" + astartTime + "^" + aendTime + "^" + escape(remarks) + "^";
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

            for (var i = 0; i < $('#tblIntermediate tr').length; i++) {
                if (i == 0) {
                    continue;
                }
                var fromPlaceTPDev = $('#txtFromPlace_' + i).val();
                var toPlaceTPDev = $('#txtToPlace_' + i).val();

                if (fromPlaceTPDev != "" && toPlaceTPDev != "") {
                    if ($('#hdnRouteWay_' + i).val() == "R") {
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
                    for (var i = 1; i < accompRow; i++) {
                        if ($("#txtAccompanist_" + i).val() != "") {
                            if ($("#chkOnlyDoctor_" + i).attr('checked')) {
                                //Y
                                if ($.inArray($("#hdnAccompanistCode_" + i).val() + '_Y', tpAccompanistArr) == -1) {
                                    tpDeviation = 'Y';
                                    break;
                                }
                                else {
                                    tpDeviation = 'N';
                                }
                            }
                            else {
                                //N
                                if ($.inArray($("#hdnAccompanistCode_" + i).val() + '_N', tpAccompanistArr) == -1) {
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

        //Check for SFC Expired status-- Fix for TS-241 
        var SFCStatus = "";
        var SFCInterData = fnReadIntermediateData();
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/CheckSFCStatus',
            data: "&intermediateDate=" + SFCInterData + "&dcrDate=" + dcrDate,
            async: false,
            success: function (result) {
                if (typeof result == "object") {
                    result = "";
                }
                if (result != "") {
                    SFCStatus = result;
                }
            }
        });

        if (SFCStatus != "") {
            HideModalPopup('dvLoading');
            fnMsgAlert('info', 'DCR Header', SFCStatus);
            return false;
        }
        else {

            //DCR Freeze
            var DCR_Freeze = 'false';
            if (g_DCR_Freeze_Status == 'YES')
                DCR_Freeze = 'true';
            //call insert
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Activity/DCRV4Header/InsertHeader',
                data: "dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&cpCode=" + escape(cpCode) + "&cpName=" + escape(cpName) + "&workPlace=" + escape(workPlace) +
                "&fromPlace=" + escape(fromPlace) + "&toPlace=" + escape(toPlace) + "&travelMode=" + travelMode + "&distance=" + distance + "&startTime=" + startTime +
                "&endTime=" + endTime + "&distanceFareCode=" + distanceFareCode + "&routeWay=" + routeWay + "&acc1Name=" + acc1Name + "&acc1Type=" + acc1Type +
                "&acc1StartTime=" + escape(acc1StartTime) + "&acc1EndTime=" + escape(acc1EndTime) + "&acc1OnlyDoctor=" + acc1OnlyDoctor + "&acc1Mode=" + acc1Mode +
                "&acc2Name=" + acc2Name + "&acc2Type=" + acc2Type + "&acc2StartTime=" + escape(acc2StartTime) + "&acc2EndTime=" + escape(acc2EndTime) + "&acc2OnlyDoctor=" + acc2OnlyDoctor + "&acc2Mode=" + acc2Mode +
                "&acc3Name=" + acc3Name + "&acc3Time=" + escape(acc3Time) + "&acc3OnlyDoctor=" + acc3OnlyDoctor + "&acc3Mode=" + acc3Mode +
                "&acc4Name=" + acc4Name + "&acc4Time=" + escape(acc4Time) + "&acc4OnlyDoctor=" + acc4OnlyDoctor + "&acc4Mode=" + acc4Mode +
                "&intermediateData=" + escape(intermediateData) + "&isrcpa=" + isrcpa + "&category=" + escape(category) +
                "&categoryCode=" + entityCode + "&activityString=" + activityString + "&flag=" + flag_g + "&tpDeviation=" + tpDeviation + "&cpDeviation=" + cpDeviation +
                "&entryMode=WEB&dateFrom=" + dataFrom + "&sfcRegionCode=" + sfcRegionCode + "&sfcVersionNo=" + sfcVersionNo + "&sfcCategoryName=" + sfcCategoryName + "&dcr_Freeze=" + DCR_Freeze,
                success: function (isTrue) {
                    if (isTrue.toUpperCase() == "TRUE") {
                        fnRedirectToDoctorVisit(isrcpa);
                    }
                    else {
                        HideModalPopup('dvLoading');
                        fnMsgAlert('info', 'DCR Header', 'Insertion Failed.');
                    }
                }
            });
        }
    }
    else {
        HideModalPopup('dvLoading');
    }
}


function fnRedirectToDoctorVisit(isrcpa) {
    debugger
    //build the query strings needed for doctor visit.    
    var cpCode = "", tpCode = "", flagRCPA = "", dcrActualDate = "", category = "", travelKm = "";

    dcrActualDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];
    category = $("#ddlCategory :selected").text();
    //category = category.replace(' ', '_');

    // tp data exist oly when dcr is in applied mode.
    if (prefill_g != "" && !(prefill_g[0] === undefined) && prefill_g[0].Data_From != "WA") {
        tpCode = prefill_g[0].Tp_Code;
    }

    // get cpCode
    if ($("#hdnCPCode").val() != "") {
        cpCode = $("#hdnCPCode").val();
    }

    //check is rcpa.
    if (isrcpa == "Y") {
        flagRCPA = "R";
    }
    else {
        flagRCPA = "N";
    }

    // get travelled km.
    if ($("#ddlCategory :selected").text() == "HQ") {
        if ($("#txtFromPlace_1").val() != "") {
            travelKm = $("#txtDistance_1").val();
        }
    }
    else {
        var distance = 0;
        for (var i = 1; i < interRow; i++) {
            if ($("#txtFromPlace_" + i).val() != "") {
                distance += parseInt($("#txtDistance_" + i).val());
            }
        }
        if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    if ($("#trInterAuto") != null) {
                        distance += parseInt($("#lblDistance_Auto").html());
                    }
                }
            }
        }
        travelKm = distance.toString();
    }

    HideModalPopup('dvLoading');
    if (flag_g == "A") {
        dcrActualDate = dcrActualDate.split('-')[2] + "-" + dcrActualDate.split('-')[1] + "-" + dcrActualDate.split('-')[0];
        var rowLength = $('#tblActivity tr').length;
        var activityString = "";
        for (var i = 0; i < rowLength; i++) {
            if ($.trim($('#txtactivity_' + i.toString()).val()).length > 0) {
                if ($.trim($('#txtactivity_' + i.toString()).val()).indexOf('(')) {
                    activityString += $.trim($('#txtactivity_' + i.toString()).val()).split('(')[0] + ",";
                }
                else {
                    activityString += $.trim($('#txtactivity_' + i.toString()).val()) + ",";
                }
            }
        }

        $('#main').load('../HiDoctor_Activity/DCRV4StockiestExpense/Index/?dcrDate=' + dcrActualDate + '&dcrStatus=' + dcrStatus + '&entity=' + escape(category) + '&travelkm=' + travelKm + '&isRCPA=' + flagRCPA + "&flag=" + flag_g + "&actvity=" + escape(activityString.slice(0, -1)));
    }
        //else if() {
        //    debugger
        //    ShowModalPopup('dvLoading');
        //   // $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=' + flagRCPA + '&cp=' + escape(cpCode) + '&tp=' + escape(tpCode) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(category) + '&travelledkms=' + travelKm + '&source=' + sourceString + "&flag=" + flag_g);
        //    $('#main').load('../HiDoctor_Activity/DCRV4ChemistVisit/DCRV4CustomerDetails/?status=' + dcrStatus + '&flagRCPA=' + flagRCPA + '&cp=' + escape(cpCode) + '&tp=' + escape(tpCode) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(category) + '&travelledkms=' + travelKm + '&source=' + sourceString + "&flag=" + flag_g);


        //}
    else {
        debugger
        ShowModalPopup('dvLoading');
        $('#main').load('../HiDoctor_Activity/DCRV4DoctorVisit/Index/?status=' + dcrStatus + '&flagRCPA=' + flagRCPA + '&cp=' + escape(cpCode) + '&tp=' + escape(tpCode) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(category) + '&travelledkms=' + travelKm + '&source=' + sourceString + "&flag=" + flag_g);
        //  $('#main').load('../HiDoctor_Activity/DCRV4ChemistVisit/DCRV4CustomerDetails/?status=' + dcrStatus + '&flagRCPA=' + flagRCPA + '&cp=' + escape(cpCode) + '&tp=' + escape(tpCode) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(category) + '&travelledkms=' + travelKm + '&source=' + sourceString + "&flag=" + flag_g);


    }

}

// functions for common validation.
function fnCheckFromPlace(id) {
    var rCnt = id.split('_')[1];

    if ($("#txtFromPlace_" + rCnt).val() == "") {
        $("#" + id).val("");
        fnMsgAlert("info", "DCR Header", "Please enter the field 'From Place'.");
        //$.msgbox("Please enter the field 'From Place'.");
        fnErrorIndicator("#txtFromPlace_" + rCnt);
        return false;
    }
    return true;
}

function fnCheckAccompanist(id) {
    var rCnt = id.split('_')[1];

    if ($("#txtAccompanist_" + rCnt).val() == "") {
        if (id.split('_')[0] == "chkOnlyDoctor") {
            $("#" + id).attr('checked', false);
        }
        else {
            $("#" + id).val("");
        }
        //$.msgbox("Please enter Accompanist Name.");
        fnMsgAlert("info", "DCR Header", "Please enter Accompanist Name.");
        fnErrorIndicator("#txtAccompanist_" + rCnt);
        return false;
    }
    return true;
}

function fnValidateValue(id, jsonName, txtName) {
    if ($(id).val() != "") {
        if (jsonName != null || !(jsonName === undefined)) {
            if (txtName == "Travel Mode") {
                var selectedValue = jsonPath(jsonName, "$.[?(@.label=='" + $(id).val().toString().toUpperCase() + "')]");
            }
            else {
                var selectedValue = jsonPath(jsonName, "$.[?(@.label=='" + $(id).val().toString() + "')]");
            }
            if (!(selectedValue.length > 0)) {
                fnErrorIndicator(id);
                fnMsgAlert('info', 'DCR Header', $(id).val() + ' is invalid ' + txtName + '.');
                //$.msgbox($(id).val() + ' is invalid ' + txtName + '.')
                $(id).val("");
                return false;
            }
            else {
                fnRemoveErrorIndicatior(id);
                return true;
            }
        }
        fnRemoveErrorIndicatior(id);
        return true;
    }
    fnRemoveErrorIndicatior(id);
    return true;
}

function fnValidateAccompanist(id) {
    if ($(id).val() != "") {
        $("#hdnAccompMode_" + i).val('');
        if ($.inArray($(id).val(), otherAccomp) > -1) {
            if ($(id).val().split('(')[0].split(',')[1] == "VACANT" || $(id).val().split('(')[0].split(',')[1] == "NOT ASSIGNED") {
                $("#chkOnlyDoctor_" + (id.id).split('_')[1]).attr('checked', 'checked');
                $("#chkOnlyDoctor_" + (id.id).split('_')[1]).attr('disabled', true);
            }
            else {
                $("#chkOnlyDoctor_" + (id.id).split('_')[1]).removeAttr('checked');
                $("#chkOnlyDoctor_" + (id.id).split('_')[1]).attr('disabled', false);
            }
            fnRemoveErrorIndicatior(id);
            return true;
        }
        else {
            if (accompanistJson_g != null || !(accompanistJson_g === undefined)) {
                for (var i = 0; i < accompanistJson_g.length; i++) {
                    if ($(id).val() == accompanistJson_g[i].label) {
                        if ($(id).val().split('(')[0].split(',')[1] == "VACANT" || $(id).val().split('(')[0].split(',')[1] == "NOT ASSIGNED") {
                            $("#chkOnlyDoctor_" + (id.id).split('_')[1]).attr('checked', 'checked');
                            $("#chkOnlyDoctor_" + (id.id).split('_')[1]).attr('disabled', true);
                        }
                        else {
                            $("#chkOnlyDoctor_" + (id.id).split('_')[1]).removeAttr('checked');
                            $("#chkOnlyDoctor_" + (id.id).split('_')[1]).attr('disabled', false);
                        }
                        fnRemoveErrorIndicatior(id);
                        return true;
                    }
                }
                fnErrorIndicator(id);
                //fnMsgAlert('error', 'Error', $(id).val() + ' is invalid Accompanist name.');            
                $('#hdnAccompanistCode_' + id.id.split('_')[1]).val('');
                return false;
            }
            fnErrorIndicator(id);
            //fnMsgAlert('error', 'Error', $(id).val() + ' is invalid Accompanist name.');
            $('#hdnAccompanistCode_' + id.id.split('_')[1]).val('');
            return false;
        }
    }
    $('#hdnAccompanistCode_' + id.id.split('_')[1]).val('');
    fnRemoveErrorIndicatior(id);
    return true;
}

function fnClearHeader() {
    // clear and remove the gray out.
    $("#CP_No").val("");
    fnRemoveErrorIndicatior("#CP_No");

    $("#Work_Place").val("");
    fnRemoveErrorIndicatior("#Work_Place");

    $("#ddlCategory").val("HQ");
    fnSetIntermediatePrivilege();
    $("#Start_Time").val("");
    $("#End_Time").val("");
    for (var i = 1; i < accompRow; i++) {
        var docAccJson = jsonPath(docAccomp_g, "$.[?(@.Acc_Region_Code=='" + $("#hdnAccompanistCode_" + i).val() + "')]");
        if (docAccJson == false && $("#hdnAccompMode_" + i).val() != "A") {
            $("#txtAccompanist_" + i).val("");
            fnRemoveErrorIndicatior("#txtAccompanist_" + i);

            $("#hdnAccompanistCode_" + i).val("");
            $("#chkOnlyDoctor_" + i).attr('checked', false);
        }
        $("#txtStartTime_" + i).val("");
        $("#txtEndTime_" + i).val("");
    }
    fnCreateIntermediatePlaceTable("");

    if (flag_g == "A") {
        var activityRow = $('#tblActivity tr').length - 1
        for (var i = 1; i < activityRow; i++) {
            $("#txtactivity_" + i).val("");
            fnRemoveErrorIndicatior("#txtactivity_" + i);

            $("#hdnactivity_" + i).val("");

            $("#txtstarttime_" + i).val("");
            $("#txtendtime_" + i).val("");
            $("#txtRemarks_" + i).val("");
        }
    }
}

function fnHideUnapprove() {
    $('#divUnapprove').fadeOut("slow");
}

function fnAccompanistPopUp(id) {
    ShowModalPopup('dvAccPopUp');
    $("#txtMatching").focus();
    $("#hdnAccompPopUP").val((id.id).split('_')[1]);
}

function fnCloseAccPopUP() {
    HideModalPopup('dvAccPopUp');
    $("#dvAccPopUp").hide();
    $('#txtMatching').val('');
    $("#hdnAccompPopUP").val('');
    $('#dvAccompSelectPopUpSub').css('display', 'none');
}

function fnGetAccompPopup() {
    $("#divAccMessage").html("");
    var matchingString = "";
    var isSFC = "";

    if ($("#txtMatching").val() == "") {
        $("#divAccMessage").html("Please Enter the Matching string");
        //$.msgbox("Please Enter the Matching string.", { type: "error" });
        return;
    }

    if ($("#txtMatching").val().length < 3) {
        $("#divAccMessage").html("Please Enter atleast 3 char.");
        //$.msgbox("Please Enter atleast 3 char.", { type: "error" });
        return;
    }

    matchingString = $("#txtMatching").val();
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4Header/GetAccompanistPopUpData',
        data: "matchingString=" + escape(matchingString),
        success: function (jsonPopup) {
            if (jsonPopup != null && jsonPopup != "") {
                allUser_g = jsonPopup;

                var content = "";
                var alterRow = "";
                if (allUser_g.length > 0 && !(allUser_g.length === undefined)) {
                    content = "<table id='tblAccompPopup' cellpadding='0px' cellspacing='2px'>";
                    for (var j = 0; j < allUser_g.length; j++) {
                        if (j % 2 == 0) {
                            alterRow = "style=' background-color:#fff'";
                        }
                        else {
                            //alterRow = "style=' background-color:#F2E3CF'";
                            alterRow = "style=' background-color:#EEEEFC'";
                        }
                        content += "<tr><td onclick='fnFillAccomp(" + (j + 1) + ")' " + alterRow + ">" + allUser_g[j].Accompanist_Name + "<label id='lblAcc_" + (j + 1) + "' style='display:none;'>" + allUser_g[j].Accompanist_Region_Code + "^" + allUser_g[j].Accompanist_Name + "</label></td></tr>";
                    }
                    content += "</table>";
                    $('#dvAccompSelectPopUpSub').html(content);
                    $('#dvAccompSelectPopUpSub').css('display', '');
                    $("#divAccMessage").html("");
                }
                else {
                    //content += "<tr><td>No matchiing data found.</td></tr>";
                    $('#dvAccompSelectPopUpSub').css('display', 'none');
                    $("#divAccMessage").html("No matching data found.");
                }

            }
            else {
                $("#divAccMessage").html("No matching data found.");
                $('#dvAccompSelectPopUpSub').css('display', 'none');
                //$.msgbox("No matching data found.", { type: "error" });                
            }
        }
    });
}

function fnFillAccomp(row) {
    HideModalPopup('dvAccPopUp');
    $("#dvAccPopUp").hide();
    var accId = $("#hdnAccompPopUP").val();
    $("#txtAccompanist_" + accId).val($("#lblAcc_" + row).html().split('^')[1]);
    $("#hdnAccompanistCode_" + accId).val($("#lblAcc_" + row).html().split('^')[0]);
    $("#hdnAccompMode_" + accId).val('');

    $('#txtMatching').val('');
    $("#hdnAccompPopUP").val('');
    if ($("#txtAccompanist_" + accId).val().split('(')[0].split(',')[1] == "VACANT" || $("#txtAccompanist_" + accId).val().split('(')[0].split(',')[1] == "NOT ASSIGNED") {
        $("#chkOnlyDoctor_" + accId).attr('checked', 'checked');
        $("#chkOnlyDoctor_" + accId).attr('disabled', true);
    }
    else {
        $("#chkOnlyDoctor_" + accId).removeAttr('checked');
        $("#chkOnlyDoctor_" + accId).attr('disabled', false);
    }

    otherAccomp.push($("#lblAcc_" + row).html().split('^')[1]);
    fnCreateNewRowInAccompanist("txtAccompanist_" + accId);

    $('#dvAccompSelectPopUpSub').css('display', 'none');

    if (accompanistNeed == "YES") {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/GetSFCData',
            data: "region=" + $("#hdnAccompanistCode_" + accId).val() + "&dcrDate=" + dcrDate,
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
    HideModalPopup('dvAccPopUp');
    $("#dvAccPopUp").hide();
}

function fnGetAccompanistSFC(id) {
    if ($(id).val() != "") {
        if (accompanistNeed == "YES") {
            var row = (id.id).split('_')[1];
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Activity/DCRV4Header/GetSFCData',
                data: "region=" + $("#hdnAccompanistCode_" + row).val() + "&dcrDate=" + dcrDate,
                success: function (jsonSFCresult) {
                    var jsonSFC = jsonSFCresult.data;
                    if (jsonSFC != null && jsonSFC != "") {
                        if (sfc_g == "") {
                            sfc_g = jsonSFC;
                            fnGenerateSFCJson("EVENT");
                        }
                        else {
                            var sfc = jsonSFC;
                            for (var j = 0; j < sfc.length; j++) {
                                sfc_g.push(sfc[j]);
                            }
                            fnGenerateSFCJson("EVENT");
                        }
                    }
                    fnDeleteAccSFC();
                }
            });
        }
    }
    else {
        var row = (id.id).split('_')[1];
        fnDeleteAccSFC();
        fnGenerateSFCJson("EVENT");

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

function fnRemoveSFC(id) {
    var rw = (id.id).split('_')[1];
    var isTrue = Boolean(true);
    if ($("#hdnAccompanistCode_" + rw).val() != "") {
        for (var i = 1; i < accompRow; i++) {
            if ($("#txtAccompanist_" + i).val() != "") {
                if ($("#hdnAccompanistCode_" + rw).val() == $("#hdnAccompanistCode_" + i).val()) {
                    isTrue = false;
                }
            }
        }
        if (isTrue) {
            sfc_g.remove("Region_Code", $("#hdnAccompanistCode_" + rw).val());
        }
    }
}

function fnCheckSFDatainLoad() {
    var sfcData = [];

    for (var i = 1; i < interRow; i++) {
        if ($("#txtFromPlace_" + i).val() != "") {

            sfcData.push({
                From_Place: (($("#hdnRouteWay_" + i).val() == "R") ? $("#txtToPlace_" + i).val() : $("#txtFromPlace_" + i).val())
                , To_Place: (($("#hdnRouteWay_" + i).val() == "R") ? $("#txtFromPlace_" + i).val() : $("#txtToPlace_" + i).val())
                , Distance: $("#txtDistance_" + i).val() == null ? "0" : $("#txtDistance_" + i).val()
                , Travel_Mode: $("#txtTravelMode_" + i).val() == null ? "" : $("#txtTravelMode_" + i).val()
                , Route_Way: $("#hdnRouteWay_" + i).val() == null ? "D" : $("#hdnRouteWay_" + i).val()
                , Distance_Fare_Code: $("#hdnDistanceFareCode_" + i).val()
                , Is_Route_Complete: "N"
                , SFC_Region_Code: $("#hdnSFCRegion_" + i).val() == null ? -1 : $("#hdnSFCRegion_" + i).val()
                , SFC_Version_No: $("#hdnSFCVersion_" + i).val() == null ? -1 : $("#hdnSFCVersion_" + i).val()
                , SFC_Category_Name: $("#hdnSFCCategory_" + i).val() == null ? "" : $("#hdnSFCCategory_" + i).val()
            });
        }
    }

    if ($("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                if ($("#trInterAuto") != null) {

                    sfcData.push({
                        From_Place: (($("#hdnRouteWay_Auto").val() == "R") ? $("#lblToPlace_Auto").html() : $("#lblFromPlace_Auto").html())
                       , To_Place: (($("#hdnRouteWay_Auto").val() == "R") ? $("#lblFromPlace_Auto").html() : $("#lblToPlace_Auto").html())
                       , Distance: $("#lblDistance_Auto").html() == null ? "0" : $("#lblDistance_Auto").html()
                       , Travel_Mode: $("#lblTravelMode_Auto").html() == null ? "" : $("#lblTravelMode_Auto").html()
                       , Route_Way: $("#hdnRouteWay_Auto").val() == null ? "D" : $("#hdnRouteWay_Auto").val()
                       , Distance_Fare_Code: $("#hdnDistanceFareCode_Auto").val() == null ? "-1" : $("#hdnDistanceFareCode_Auto").val()
                       , Is_Route_Complete: "Y"
                       , SFC_Region_Code: $("#hdnSFCRegion_Auto").val() == null ? "" : $("#hdnSFCRegion_Auto").val()
                       , SFC_Version_No: $("#hdnSFCVersion_Auto").val() == null ? "0" : $("#hdnSFCVersion_Auto").val()
                       , SFC_Category_Name: $("#hdnSFCCategory_Auto").val() == null ? "" : $("#hdnSFCCategory_Auto").val()
                    });
                }
            }
        }
    }
    if (sfcData != null && sfcData.length > 0) {
        // check sfc data      
        fnBlockDiv("div_Header", "Checking updated SFC....");
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/CheckSFCData',
            data: "sfcData=" + JSON.stringify(sfcData) + "&dcrDate=" + dcrDate,
            async: false,
            success: function (result) {
                fnUnBlockDiv("div_Header");
                if (result.split('^')[0] != "FAIL") {
                    if (result.split('$')[1] == "Y") {

                        alert("Your SFC is changed after you have defined CP/TP. System will fill the updated SFC now.");
                        var sfcTble = "";

                        var sfcObj = eval('(' + result.split('$')[0] + ')');
                        for (var a = 0; a < sfcObj.length; a++) {
                            var dis = "0";
                            if (sfcObj[a].Distance != null && sfcObj[a].Distance.length == 0) {
                                if (sfcObj[a].Distance.indexOf('.') == -1) {
                                    dis = sfcObj[a].Distance + ".00";
                                }
                            }
                            else {
                                if (sfcObj[a].Distance.indexOf('.') == -1) {
                                    dis = sfcObj[a].Distance + ".00";
                                }
                            }

                            if (sfcObj[a].Is_Route_Complete != "Y") {
                                $("#txtFromPlace_" + (a + 1)).val(sfcObj[a].From_Place);
                                $("#txtToPlace_" + (a + 1)).val(sfcObj[a].To_Place);
                                $("#txtDistance_" + (a + 1)).val(dis);
                                $("#txtTravelMode_" + (a + 1)).val(sfcObj[a].Travel_Mode);
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
                                $("#lblDistance_Auto").html(dis);
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
                    fnUnBlockDiv("div_Header");
                    fnMsgAlert('error', 'DCR Header', 'Error. ' + result.split('^')[1]);
                }
            },
            error: function (e) {
                fnUnBlockDiv("div_Header");
                fnMsgAlert('error', 'DCR Header', 'Error. ' + e.Message);
            }
        });
    }

}


function fnSFCOptionPopup(disJson, rCnt) {
    if (disJson != null && disJson !== undefined && disJson.length > 0) {
        var content = "";
        if (rCnt == "Auto") {
            content += "<div style='background-color:#A5D16C;height:30px;width:98%;padding:5px;'><span>This is for Route Complete</span></div>"
        }
        content += "<table style='width:97%;margin:10px;' > <thead><tr><th>Select</th><th>Category Name</th><th>From Place</th>";
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
            content += " <tr><td> <input type='radio'  name='chkSFCSelect' id='chkSFCSelect_" + i + "' value='"
                + disJson[i].Distance_Fare_Code + "_" + disJson[i].Distance + "_" + disJson[i].Fare_Amount + "_" + disJson[i].SFC_Category_Name + "_" + disJson[i].SFC_Version_No + "_" + disJson[i].SFC_Region_Code + "_" + rCnt + "_" + routeWay + "_" + disJson[i].Travel_Mode + "' /> </td>";
            content += "<td>" + disJson[i].SFC_Category_Name + "</td>";
            content += "<td>" + disJson[i].From_Place + "</td>";
            content += "<td>" + disJson[i].To_Place + "</td>";
            content += "<td>" + disJson[i].Travel_Mode + "</td>";

            if (disJson[i].SFC_Region_Code == currentRegion) {
                content += "<td>" + currRegionName + "</td>";
            }
            else {
                var regionName = jsonPath(accompanistJson_g, "$.[?(@.value=='" + disJson[i].SFC_Region_Code + "')]");
                if (regionName != null && regionName !== undefined && regionName.length > 0) {
                    content += "<td>" + regionName[0].label.split(',')[0] + "</td>";
                }
                else {
                    content += "<td></td>";
                }
            }
            content += "<td>" + disJson[i].Distance + "</td>";
            content += "</tr>";
        }
        content += "</tbody> </table>";
        $('#dvAllSFC').html(content);
        $("#dvSFCPopUp").overlay().load();
    }
}

function fnBindSelectedSFCCode() {
    //Distance_Fare_Code|Distance|Fare_Amount |SFC_Category_Name|SFC_Version_No|SFC_Region_Code| rCnt |D|TrvelMode
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
        $("#txtTravelMode_" + currentSFCRow).val(selectedVal.split('_')[8]);
        $("#hdnRouteWay_" + currentSFCRow).val(selectedVal.split('_')[7]);
        $("#hdnSFCRegion_" + currentSFCRow).val(selectedVal.split('_')[5]);
        $("#hdnSFCVersion_" + currentSFCRow).val(selectedVal.split('_')[4]);
        $("#hdnSFCCategory_" + currentSFCRow).val(selectedVal.split('_')[3]);
    }
    $("#dvSFCPopUp").overlay().close();

    if (currentSFCRow != "Auto") {
        //HOP Route Complete
        if (intermediateNeed == "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    fnHOPRouteComplete(currentSFCRow);
                }
            }
        }
    }
}


////------------------------------ Start travel mode autofill -----------------------------
//if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.

//    if ($("#txtFromPlace_" + rCnt).val() != "" && $("#txtToPlace_" + rCnt).val() != "") {
//        if (sfc_g != "") {
//            if (categoryCheckNeeded == "YES") {// sfc category dont check privilege
//                var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.SFC_Category_Name=='" + $("#ddlCategory :selected").text().toUpperCase() + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "' & @.SFC_Category_Name=='" + $("#ddlCategory :selected").text().toUpperCase() + "'))]");
//                if (!(distanceJson === undefined) && distanceJson.length > 0) {
//                    var travelMode = "[";
//                    for (var i = 0; i < distanceJson.length; i++) {
//                        travelMode += "{label:" + '"' + "" + distanceJson[i].Travel_Mode + "" + '",' + "value:" + '"' + "" + distanceJson[i].Travel_Mode + "" + '"' + "}";
//                        if (i < distanceJson.length - 1) {
//                            travelMode += ",";
//                        }
//                    }
//                    travelMode += "];";
//                    travelModeJson_g = eval(travelMode);
//                }
//                else {
//                    travelModeJson_g = "";
//                }
//            }
//            else {
//                var distanceJson = jsonPath(sfc_g, "$.[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "'))]");
//                if (!(distanceJson === undefined) && distanceJson.length > 0) {
//                    var travelMode = "[";
//                    for (var i = 0; i < distanceJson.length; i++) {
//                        travelMode += "{label:" + '"' + "" + distanceJson[i].Travel_Mode + "" + '",' + "value:" + '"' + "" + distanceJson[i].Travel_Mode + "" + '"' + "}";
//                        if (i < distanceJson.length - 1) {
//                            travelMode += ",";
//                        }
//                    }
//                    travelMode += "];";
//                    travelModeJson_g = eval(travelMode);
//                }
//                else {
//                    travelModeJson_g = "";
//                }
//            }
//        }
//        else {
//            travelModeJson_g = travelModeFullJson_g;
//        }
//    }
//    else {
//        $("#txtTravelMode_" + rCnt).val("");
//        travelModeJson_g = travelModeFullJson_g;
//    }
//}
//else {
//    travelModeJson_g = travelModeFullJson_g;
//}

//autoComplete(travelModeJson_g, "txtTravelMode", "hdnTravelMode", 'autotravel');

////------------------------------ End travel mode autofill -----------------------------


////------------------------START - PREFILL THE CP FOR SELECTED ACCOMPANIST--------------------------------/////
function fnIncludeAccompanistCP() {
    ShowModalPopup('dvLoading');
    var regionCodes = "";
    var accObj = "";
    var priv = "", accom_regionCode = "", Accom_Id = '';
    var privArr = new Array();
    var cur_RegionCode = currentRegion;
    if (accompanistCPNeed == "YES" && flag_g.toUpperCase() != "A") {
        for (var i = 0 ; i <= ($('#tblAccompanist tr').length) - 1 ; i++) {
            if ($('#hdnAccompanistCode_' + i).val() != null && $('#hdnAccompanistCode_' + i).val() != '') {
                accObj += $('#hdnAccompanistCode_' + i).val() + ',';
            }
        }
    }

    if ($.inArray($("#hdnAccompanistCode_" + i).val(), accObj) > -1) {
        fnMsgAlert('info', 'DCR Header', 'The accompanist name ' + $("#txtAccompanist_" + i).val() + ' is entered more than one time. It is not allowed.');
        HideModalPopup('dvLoading');
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
            url: '../HiDoctor_Activity/DCRV4Header/GetCpforAccompanist',
            data: "accomRegionCode=" + regionCodes,
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
                    HideModalPopup('dvLoading');
                    //Clear field
                    //$("#CP_No").val("");
                    //$("#Work_Place").val("");
                    //$("#ddlCategory").val("HQ");
                    //$("#Start_Time").val("");
                    //$("#End_Time").val("");
                    //fnCreateIntermediatePlaceTable("");
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                HideModalPopup('dvLoading');
            }
        });
    }
    else {
        HideModalPopup('dvLoading');
    }
}


//Prefill the the Selectd Accompanist CP
function fnPrefillAccompanistCp(obj) {
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
            $("#CP_No").unautocomplete();
            $("#CP_No").blur(function () { fnFillCpDetails(); });
            autoComplete(cpJson, "CP_No", "hdnCPCode", 'autoCP');
            HideModalPopup('dvLoading');
        }
    }
    else {
        // $("#txtCPName").unautocomplete();
    }
}

function fnDeleteAccSFC() {
    try {
        var sfc = [];
        var deletedRegionCode = "";
        var acc1 = [];
        if (accompRow >= 3) { // take region code from Accompanist table value.
            for (var i = 1; i <= (accompRow - 1) ; i++) {
                if ($("#txtAccompanist_" + i).val() != "") {
                    acc1.push($("#hdnAccompanistCode_" + i).val());
                }
            }
        }
        acc1.push(currentRegion);
        Acc_Id_g = [];
        Acc_Id_g = acc1;
        for (var i = 0; i < sfc_g.length; i++) {
            for (var j = 0; j < acc1.length; j++) {
                if (acc1[j] == sfc_g[i].Region_Code) {
                    sfc.push(sfc_g[i]);
                }
            }
        }

        sfc_g = sfc;
    }
    catch (e) {
        alert(e.message);
    }
}

function fnBlockDiv(divid, message) {
    $('#' + divid).block({
        message: message,
        css: { border: '3px solid #89C33F', padding: '7px' }
    });
}

function fnUnBlockDiv(divid) {
    $('#' + divid).unblock();
}

function fnGetTravelMode() {
    // generate json for travel mode.
    var travelModeArr = new Array();
    $.ajax({
        type: 'POST',
        url: '../SFCRegion/GetTravelModes',
        async: false,
        success: function (response) {
            travelModeArr.clear();
            for (var i = 0; i < response.length; i++) {

                var tm = {};
                tm.label = response[i].TravelMode_Name;
                tm.value = response[i].TravelMode_Name;
                travelModeArr.push(tm);

            }
            //var travelMode = "[";
            //for (var i = 0; i < travelModeArr.length; i++) {
            //    travelMode += "{label:" + '"' + "" + travelModeArr[i] + "" + '",' + "value:" + '"' + "" + travelModeArr[i] + "" + '"' + "}";
            //    if (i < travelModeArr.length - 1) {
            //        travelMode += ",";
            //    }
            //}
            //travelMode += "];";
            travelModeJson_g = travelModeArr;//eval(travelMode);
            travelModeFullJson_g = travelModeJson_g;
        },
        error: function (e) {
            travelModeArr.clear();
        }
    });
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
//-------------------------------------------------------------------------------------------------
var g_acc_id = "";
var g_acc_remove_id = "";
function fnRemoveAccompanist(id) {
    g_acc_remove_id = id;
    $("#pEmpName").text("Dear " + $("#spnUser").text().split('(')[0]);
    $("#pRemoveAccName").text($("#txtAccompanist_" + id).val().split(',')[1].split('(')[0] + " (" + $("#txtAccompanist_" + id).val().split(',')[0] + ")");
    //$("#Acc_Delete_Modal").modal('show');
    $.blockUI();
    $("#Acc_Delete_Modal").overlay().load();
}
function fnAcc_Remove() {
    if (g_acc_remove_id != '') {

        var msg_txt = '';
        var acc_id = g_acc_remove_id;
        var id = g_acc_remove_id;
        var acc_UserName = $("#txtAccompanist_" + id).val().split('(')[0].split(',')[1];
        var acc_Region_Code = $("#hdnAccompanistCode_" + id).val();
        var rowIndex = '0';
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/RemoveAccompanist',
            data: "acc_id=" + rowIndex + "&dcrDate=" + dcrDate + "&acc_UserName=" + acc_UserName + "&acc_Region_Code=" + acc_Region_Code,
            success: function (result) {
                if (result == 'Success') {
                    $('#Acc_Delete_Modal').overlay().close();
                    $.unblockUI();
                    // $("#Acc_Delete_Modal").modal('hide');
                    $("#txtAccompanist_" + id).css("background-color", "");
                    $("#txtAccompanist_" + id).val('');
                    $("#btnRemoveAccompanist_" + id).removeClass('accRemoveIcon');
                    $("#btnRemoveAccompanist_" + id).addClass('accRemoveIconBlack');
                    $("#txtStartTime_" + id).val('');
                    $("#txtEndTime_" + id).val('');
                    //$("#btnRemoveAccompanist_" + id).hide();
                    $("#txtAccompanist_" + id).attr("disabled", false);
                    $("#chkOnlyDoctor_" + id).attr("disabled", false);
                    $('#chkOnlyDoctor_' + id).attr('checked', false);
                    //$("#popup_" + i).show();
                    $("#popup_" + id).addClass("accPopup");
                    $("#popup_" + id).unbind('click').bind('click', function () { fnAccompanistPopUp(this); });
                    g_acc_remove_id = '';
                    //remove SFC
                    var removeIndex = new Array();
                    var region_code = $("#hdnAccompanistCode_" + id).val();
                    for (var i = 0; i < sfc_g.length; i++) {
                        if (sfc_g[i].Region_Code == region_code)
                            removeIndex.push(i);

                    }
                    for (var i = 0; i < removeIndex.length; i++) {
                        sfc_g.splice(removeIndex[i], 1);
                        for (var j = (i + 1) ; j < removeIndex.length; j++) {
                            removeIndex[j] = removeIndex[j] - 1;
                        }
                    }
                    fnGenerateSFCJson("EVENT");

                    //Remove CP
                    var cp_remove;
                    var category_remove;
                    var removeIndexCP = new Array();
                    for (var i = 0; i < cp_g.length; i++) {
                        if (cp_g[i].Region_Code == region_code)
                            removeIndexCP.push(i);
                        if ($("#hdnCPCode").val() == cp_g[i].CP_Code)
                            cp_remove = 1;
                        if ($("#ddlCategory").val() == cp_g[i].Category)
                            category_remove = 1;

                    }
                    for (var i = 0; i < removeIndexCP.length; i++) {
                        cp_g.splice(removeIndexCP[i], 1);
                        for (var j = (i + 1) ; j < removeIndexCP.length; j++) {
                            removeIndexCP[j] = removeIndexCP[j] - 1;
                        }
                    }
                    //Remove cpHop_g
                    var removeIndexcpHop = new Array();
                    for (var i = 0; i < cpHop_g.length; i++) {
                        if (cpHop_g[i].Region_Code == region_code)
                            removeIndexcpHop.push(i);
                        if ($("#hdnCPCode").val() == cpHop_g[i].CP_Code)
                            cp_remove = 1;

                    }
                    for (var i = 0; i < removeIndexcpHop.length; i++) {
                        cpHop_g.splice(removeIndexcpHop[i], 1);
                        for (var j = (i + 1) ; j < removeIndexcpHop.length; j++) {
                            removeIndexcpHop[j] = removeIndexcpHop[j] - 1;
                        }
                    }
                    fnPrefillAccompanistCp(cp_g);
                    if (cp_remove == '1') {
                        $("#hdnCPCode").val('');
                        $("#CP_No").val('')
                    }
                    if (category_remove == '1')
                        $("#ddlCategory").val($("#ddlCategory option:first").val());
                }
                else {
                    fnMsgAlert('Error', 'DCR Header', 'Error');

                }
            },
            error: function (e) {
                fnMsgAlert('Error', 'DCR Header', 'Error');
                g_acc_remove_id = '';
                $.unblockUI();
            }

        });
        //HideModalPopup('dvLoading');
    }

}
function fnAcc_Remove_Cancel() {
    // $("#Acc_Delete_Modal").modal('hide');
    $.unblockUI();
    $('#Acc_Delete_Modal').overlay().close();
    g_acc_remove_id = '';
}

function fnAccompanistAdd(id) {
    var rvalue = fnCheckAccDuplicateName();
    if (rvalue == 0) {
        g_acc_id = id;
        if ($("#" + g_acc_id.id).val().trim() != "") {
            $("#pDel_User_name").text("Dear " + $("#spnUser").text().split('(')[0]);
            $("#pAcc_name").text($("#" + g_acc_id.id).val().split(',')[1].split('(')[0] + "( " + $("#" + g_acc_id.id).val().split(',')[2].split(')')[0] + ")");
            if (parseInt(chemist_dco_count_g) == 0) {
                if (fnValidateAccompanist(id)) {
                    fnIncludeAccompanistCP(id);
                    fnGetAccompanistSFC(id);
                }
            }
            else {
                $.blockUI();
                $("#AccModal").overlay().load();
                //$('#AccModal').modal('show');
                var result = false;

            }
        }
    }
    else {
        fnMsgAlert('info', 'DCR Header', 'The accompanist name ' + $("#txtAccompanist_" + rvalue).val() + ' is entered more than one time. It is not allowed.');
        $("#txtAccompanist_" + rvalue).val('');

    }
}
function fnCheckAccDuplicateName() {
    var accName = new Array();
    for (var i = 1; i <= 4; i++) {
        var name = $("#txtAccompanist_" + i).val();
        if (name != '' && name != undefined)
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
function fnAcc_Visits_Save() {
    //$('#AccModal').modal('hide');
    $("#AccModal").overlay().close();
    $.blockUI();
    if (fnValidateAccompanist(g_acc_id)) {
        var chk_mark_all_acc = $("#chk_mark_all_acc").prop('checked');
        var lbl_acc_name = $("#" + g_acc_id.id).val();
        var Is_Accompanied_call = '';
        if (chk_mark_all_acc)
            Is_Only_For_Doctor = "Y";
        else
            Is_Only_For_Doctor = "N";
        var acc_index = g_acc_id.id.split('_')[1];
        //Save To Data base
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/InsertDoctorVisit',
            data: "lbl_acc_name=" + lbl_acc_name + "&dcrDate=" + dcrDate + "&Is_Only_For_Doctor=" + Is_Only_For_Doctor + "&acc_index=" + acc_index,
            success: function (result) {
                if (result == "success") {
                    if (chk_mark_all_acc)
                        $("#chkOnlyDoctor_" + acc_index).attr('checked', true);
                    $("#chkOnlyDoctor_" + acc_index).attr('disabled', true);
                    $("#txtAccompanist_" + acc_index).attr('disabled', true);
                    $("#txtAccompanist_" + acc_index).css("background-color", "rgb(235, 235, 228)");
                    //$("#popup_" + acc_index).hide();
                    $("#popup_" + acc_index).removeClass("accPopup");
                    $("#popup_" + acc_index).removeAttr("title");
                    $("#popup_" + acc_index).unbind();
                    $("#btnRemoveAccompanist_" + acc_index).addClass('accRemoveIcon');
                    $("#btnRemoveAccompanist_" + acc_index).removeClass('accRemoveIconBlack');
                    //$("#btnRemoveAccompanist_" + acc_index).css("display", "block");
                    //Per Functions
                    fnIncludeAccompanistCP(g_acc_id);
                    fnGetAccompanistSFC(g_acc_id);
                    $.unblockUI();
                }
                else {
                    fnMsgAlert('Error', 'DCR Header', 'Error');
                    $.unblockUI();
                }
            },
            error: function () {
                fnMsgAlert('Error', 'DCR Header', 'Error');
                $.unblockUI();
            }
        });
    }
    //Resut
    $("#chk_mark_all_acc").attr('checked', false);

}
function fnAcc_Visits_Cancel() {
    $("#" + g_acc_id.id).val('');
    g_acc_id = "";
    $("#chk_mark_all_acc").attr('checked', false);
    $.unblockUI();
    $("#AccModal").overlay().close()
    //$('#AccModal').modal('hide');
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
            chemist_dco_count_g = parseInt(count);
        }
    });
    return count;
}
//--------------------DCR Freeze--------------------------
var g_DCR_Freeze_Status = 'NO';
function GetDCRFreezeStatus() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRV4Header/BindDCRFreezeStatus',
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
        $("#divFreezeDCRMsg").show();
        var acc_tbl_row_count = $('#tblAccompanist tr').length;
        for (var i = 1; i <= acc_tbl_row_count; i++) {
            $("#txtAccompanist_" + i).attr("disabled", true);
            $("#txtAccompanist_" + i).css("background-color", "rgb(235, 235, 228)");
            // $("#popup_" + i).hide();
            $("#popup_" + i).attr("disabled", true);
            $("#popup_" + i).removeAttr("title");
            $("#popup_" + i).removeAttr("class");
            $("#popup_" + i).unbind();
            $("#btnRemoveAccompanist_" + i).removeClass('accRemoveIcon');
            $("#btnRemoveAccompanist_" + i).addClass('accRemoveIconBlack');
        }
        $("#CP_No").attr("disabled", true);
        $("#CP_No").css("background-color", "rgb(235, 235, 228)");
        $("#ddlCategory").attr("disabled", true);
        $("#ddlCategory").css("background-color", "rgb(235, 235, 228)");
        $("#Work_Place").attr("disabled", true);
        // $("#txtFromPlace_1").attr("disabled", true);
        //$("#txtToPlace_1").attr("disabled", true);
        //$("#txtTravelMode_1").attr("disabled", true);
        if (acc_tbl_row_count != 5)
            acc_tbl_row_count = acc_tbl_row_count - 1;
        $("#tblAccompanist tr:eq(" + acc_tbl_row_count + ")").hide();
        //SFC Freeze
        var tblLenght = $("#tblIntermediate tr").length;
        //Get Distance disabled status
        var txtDistance = $("#txtDistance_1").prop("disabled");

        var empty_count = 0;
        try {
            for (var k = 1; k < tblLenght; k++) {
                var Is_TP_SFC = '0';
                if ($("#hdnIs_TP_SFC_" + k).val() != undefined && $("#hdnIs_TP_SFC_" + k).val() != '') {
                    Is_TP_SFC = $("#hdnIs_TP_SFC_" + k).val();
                }
                empty_count = 0;
                if ($("#txtFromPlace_" + k).val() != '')
                    $("#txtFromPlace_" + k).attr("disabled", true);
                if ($("#txtToPlace_" + k).val() != '') {
                    if (Is_TP_SFC == '1')
                        $("#txtToPlace_" + k).attr("disabled", true);
                }
                else
                    empty_count++;
                if ($("#txtTravelMode_" + k).val() != '') {
                    if (Is_TP_SFC == '1')
                        $("#txtTravelMode_" + k).attr("disabled", true);
                }
                else
                    empty_count++;

                if (txtDistance)
                    $("#txtDistance_" + k).attr("disabled", true);
                //If ToPlace and TravelMode is empty that is CIRCLE_ROUTE_APPLICABLE_CATEGORY so hide the last row
                if (empty_count == 2) {
                    if (intermediateNeed == "YES")
                        if ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) == '-1') {
                            interRow--;
                            $("#tblIntermediate tr:eq(" + k + ")").remove();
                        }
                }

            }
        } catch (e) {
        }
    }
    else {
        $("#divFreezeDCRMsg").hide();
    }
}
var headerName = "";
var DoctorHeader_g = "";
var Region_code_g = "";
var stockistHeaderName = "";
var Medicaldeviceflag = "";
function fnPrivilegeValueforHeaderName() {
    debugger
    stockistHeaderName = fnGetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist ");
    if (stockistHeaderName != '')
        if (stockistHeaderName.length >= 20) {
            stockistHeaderName = stockistHeaderName.substr(0, 20) + "...";

        }
    $("#spnStockist").text(stockistHeaderName);
    DoctorHeader_g = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");
    var cv_Header = fnGetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist")
    var headerName = DoctorHeader_g + ' & ' + cv_Header;
    if (headerName.length >= 20) {
        headerName = headerName.substr(0, 20) + "...";
    }
    $('#spnDcoCus').text(headerName);
    if (flag_g.toUpperCase() == "A") {
        $('#btnHeaderSubmit').val("Go to Expense");
    }
}
////------------------------END - PREFILL THE CP FOR SELECTED ACCOMPANIST--------------------------------/////
function fnPrivilegeValueDoctorHeader() {
    var accom_Regioncodes = "";
    for (var i = 1; i < accompRow; i++) {
        if ($('#hdnAccompanistCode_' + i).val() != '') {
            if (accom_Regioncodes == '')
                accom_Regioncodes = $('#hdnAccompanistCode_' + i).val();
            else
                accom_Regioncodes += "^" + $('#hdnAccompanistCode_' + i).val();
        }
    }
    var headerName = '';
    $.ajax({
        type: 'POST',
        url: '../DCRV4DoctorVisit/GetDCRHeaderName',
        data: 'RegionCodes=' + accom_Regioncodes,
        async: false,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                if (headerName == '')
                    headerName = response[i].Privilege_Value_Name;
                else
                    headerName += ',' + response[i].Privilege_Value_Name;
            }
            if (headerName == '')
                $('#spnDcoCus').text('Doctors / Customers');
            else {
                $('#spnDcoCus').text(headerName);
                $("#btnHeaderSubmit").val('Go To ' + headerName + ' & Sample/Promotional items');
            }
        }
    });
}