

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

var Header_g = "";
var cpJson_g = "", sfcJson_g = "", accompanistJson_g = "", travelModeJson_g = "", intermediate_g = "", allUser_g = "";
var accompRow = "", interRow = "";
var otherAccomp = new Array();

// Privilege value variables.
var intermediateNeed = "", accompanistNeed = "", categoryCheckNeeded = "", accMandatory = "", isRouteComplete = "";
var sfcValidation = new Array();
var hopRouteCategory = new Array();

function GetHeaderDetails() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRHeader/GetHeaderDetails',
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
            // generate json for SFC
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

            //enable autofill for CP and Work Place and validation.
            if (cpNeed != "NO") {
                autoComplete(cpJson_g, "CP_No", "hdnCPCode", 'autoCP');
            }
            autoComplete(intermediate_g, "Work_Place", "hdnWorkPlace", 'autoIntermediateWork');

            // Prefill Data.
            if (!(Header_g[1].Data[0].Data[0] === undefined)) {
                fnPrefillData();
                HideModalPopup('dvLoading');
                $('#divHeaderLoad').css('display', '');
            }
            else {
                fnCreateAccompanistTable("N");
                fnCreateIntermediatePlaceTable("LOAD");
                HideModalPopup('dvLoading');
                $('#divHeaderLoad').css('display', '');
            }

            if (flag_g.toUpperCase() == "A") {
                fnGetAttendanceDetails();
            }
        }
    });
}

function fnGetAttendanceDetails() {

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRHeader/GetActivityJSON',
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
            $('#dvactivity').css('display', '');
            if (dcrStatus == '1' && source != 'TAB') {
                fnGetActivityDetails();
                //                if (Header_g[1].Data[0].Data != null && Header_g[1].Data[0].Data[0] != null) {
                //                    var activityValue = Header_g[1].Data[0].Data[0].ActivityCode + '_' + Header_g[1].Data[0].Data[0].ProjectCode;
                //                    var activityName = jsonPath(activityJSON_g, "$.[?(@.value=='" + activityValue + "')]");
                //                    $('#txtactivity_1').val(activityName[0].label);
                //                    $('#hdnactivity_1').val(activityValue);
                //                }
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
    for (var i = 0; i < Header_g[3].Data.length; i++) {
        fnGenerateActivitytable(Header_g[3].Data[i]);
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
        $(td1).html("<input type='text' id='txtactivity_" + rowIndex + "' class='autoactivity' style='width:300px' onclick='$(this).select();'  onkeypress='fnactivityRowCreation(this)' ondblclick='fnactivityRowCreation(this)' /><input type='hidden' id='hdnactivity_" + rowIndex + "' valign='top'  />");
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
            curObj.onkeypress = null;
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

        $("#Work_Place").unautocomplete();
        autoComplete(intermediate_g, "Work_Place", "hdnWorkPlace", 'autoIntermediateWork');
        //$("#Work_Place").blur(function () { return fnCheckRemarksSpecialChar(this) });

        for (var k = 1; k < interRow; k++) {
            $("#txtFromPlace_" + k).unautocomplete();
            $("#txtToPlace_" + k).unautocomplete();
        }
        autoComplete(intermediate_g, "txtFromPlace", "hdnFromPlace", 'autoIntermediate');
        autoComplete(intermediate_g, "txtToPlace", "hdnToPlace", 'autoIntermediate');
        fnIntermediateEventBinder();
    }
}


function fnPrefillData() {
    if (dcrStatus == "0" && source != "TAB") {
        var unapprovalReason = Header_g[1].Data[0].Data[0].UnApprovalReason;
        unapprovalReason = unapprovalReason.replace(/~\^/g, ' - N/A<br />');
        unapprovalReason = unapprovalReason.replace(/\^/g, '<br />');
        unapprovalReason = unapprovalReason.replace(/~/g, ' - ');

        $('#divUnapprove').html(unapprovalReason);
        $('#divUnapprove').css('display', '');
    }
    $("#ddlCategory").val(Header_g[1].Data[0].Data[0].Category);

    if (cpNeed != "NO") { // check the privilege value
        $("#CP_No").val(Header_g[1].Data[0].Data[0].CP_No);
    }
    $("#hdnCPCode").val(Header_g[1].Data[0].Data[0].CP_Code);

    //if (dcrStatus == "3") {// if it is not a drafted da, it might be TP data. For tp, the work place should be current region in paga load. so don update it.
    $("#Work_Place").val(Header_g[1].Data[0].Data[0].Work_Place);
    //}
    $("#Start_Time").val(Header_g[1].Data[0].Data[0].Start_Time);
    $("#End_Time").val(Header_g[1].Data[0].Data[0].End_Time);

    fnCreateAccompanistTable("Y");
    fnGenerateSFCJson("EVENT");
    fnCreateIntermediatePlaceTable("Y");
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
        tableContent += "</tr>";
        tableContent += "</thead>";

        if (isPrefill == "Y") {
            // for applied dcr which have TP data.
            if (dcrStatus == "1" && Header_g[1].Data[0] != "" && source != "TAB") {

                // Old logic
                if (Header_g[1].Data[1].Data.length <= 0) {
                    for (var i = 1; i <= 2; i++) {
                        tableContent += "<tr>";
                        tableContent += "<td>" + i + "</td>";
                        if (i == 1) {
                            if (!(Header_g[1].Data[0] === undefined)) {
                                tableContent += "<td><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc1_Name + "'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + i + "' value='" + Header_g[1].Data[0].Data[0].Acc1_Code + "'/><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            }
                            else {
                                tableContent += "<td><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + i + "' /><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            }
                        }
                        else {
                            tableContent += "<td><input type='text' id='txtAccompanist_2'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_2'/><span id='popup_2' class='accPopup'>&nbsp&#62&#62</span></td>";
                        }
                        tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + i + "' class='accompchk' />Yes</td>";
                        tableContent += "<td><input type='text' id='txtStartTime_" + i + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + i + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                    }
                    accompRow = parseInt(i);
                }

                    //New Logic
                else {
                    var k = 0;
                    for (var i = 1; i <= 4; i++) {
                        if (i == 1 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc1_Name != "" && Header_g[1].Data[0].Data[0].Acc1_Name != 'null') {
                            k++;
                            tableContent += "<tr>";
                            tableContent += "<td>" + k + "</td>";
                            tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc1_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc1_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            if (Header_g[1].Data[0].Data[0].Acc1_Only_For_Doctor.length > 0) {
                                tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                            }
                            else {
                                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                            }
                            tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp'  onclick= '$(this).select();' /></td>";
                            tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp'  onclick= '$(this).select();'/></td>";
                            tableContent += "</tr>";
                        }
                        else if (i == 2 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc2_Name != "" && Header_g[1].Data[0].Data[0].Acc2_Name != 'null') {
                            k++;
                            tableContent += "<tr>";
                            tableContent += "<td>" + k + "</td>";
                            tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc2_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc2_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            if (Header_g[1].Data[0].Data[0].Acc2_Only_For_Doctor.length > 0) {
                                tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                            }
                            else {
                                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "'  class='accompchk'/>Yes</td>";
                            }
                            tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp'  onclick= '$(this).select();' /></td>";
                            tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp'   onclick= '$(this).select();'/></td>";
                            tableContent += "</tr>";
                        }
                        else if (i == 3 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc3_Name != "" && Header_g[1].Data[0].Data[0].Acc3_Name != 'null') {
                            k++;
                            tableContent += "<tr>";
                            tableContent += "<td>" + k + "</td>";
                            tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist'  value='" + Header_g[1].Data[0].Data[0].Acc3_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc3_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            if (Header_g[1].Data[0].Data[0].Acc3_Only_For_Doctor.length > 0) {
                                tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                            }
                            else {
                                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "'  class='accompchk'/>Yes</td>";
                            }
                            tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp'  onclick= '$(this).select();' /></td>";
                            tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp'  onclick= '$(this).select();'/></td>";
                            tableContent += "</tr>";
                        }
                        else if (i == 4 && !(Header_g[1].Data[0] === undefined) && Header_g[1].Data[0].Data[0].Acc4_Name != "" && Header_g[1].Data[0].Data[0].Acc4_Name != 'null') {
                            k++;
                            tableContent += "<tr>";
                            tableContent += "<td>" + k + "</td>";
                            tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc4_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc4_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            if (Header_g[1].Data[0].Data[0].Acc4_Only_For_Doctor.length > 0) {
                                tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                            }
                            else {
                                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "'  class='accompchk'/>Yes</td>";
                            }
                            tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                            tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                            tableContent += "</tr>";
                            accompRow = k + 1;
                        }
                    }

                    if (k != 4 && k != 0) {
                        tableContent += "<tr>";
                        tableContent += "<td>" + (k + 1) + "</td>";
                        tableContent += "<td><input type='text' id='txtAccompanist_" + (k + 1) + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + (k + 1) + "'/><span id='popup_" + (k + 1) + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                        tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + (k + 1) + "' class='accompchk' />Yes</td>";
                        tableContent += "<td><input type='text' id='txtStartTime_" + (k + 1) + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + (k + 1) + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                        accompRow = parseInt(k) + 2;
                    }

                    else if (k == 0) {
                        for (var i = 1; i <= 2; i++) {
                            tableContent += "<tr>";
                            tableContent += "<td>" + i + "</td>";
                            tableContent += "<td><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + i + "'/><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                            tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + i + "' class='accompchk' />Yes</td>";
                            tableContent += "<td><input type='text' id='txtStartTime_" + i + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                            tableContent += "<td><input type='text' id='txtEndTime_" + i + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                            tableContent += "</tr>";
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
                        tableContent += "<tr>";
                        tableContent += "<td>" + k + "</td>";
                        tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc1_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc1_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";

                        if (Header_g[1].Data[0].Data[0].Acc1_Only_For_Doctor.length > 0) {
                            tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                        }
                        else {
                            tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                        }
                        tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp' value='" + Header_g[1].Data[0].Data[0].Acc1_Start_Time + "' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp' value='" + Header_g[1].Data[0].Data[0].Acc1_End_Time + "' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                    }
                    else if (i == 2 && Header_g[1].Data[0].Data[0].Acc2_Name != "" && Header_g[1].Data[0].Data[0].Acc2_Name != 'null') {
                        k++;
                        tableContent += "<tr>";
                        tableContent += "<td>" + k + "</td>";
                        tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc2_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc2_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                        if (Header_g[1].Data[0].Data[0].Acc2_Only_For_Doctor.length > 0) {
                            tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "'  class='accompchk'/>Yes</td>";
                        }
                        else {
                            tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "'  class='accompchk'/>Yes</td>";
                        }
                        tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp' value='" + Header_g[1].Data[0].Data[0].Acc2_Start_Time + "' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp'  value='" + Header_g[1].Data[0].Data[0].Acc2_End_Time + "' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                    }
                    else if (i == 3 && Header_g[1].Data[0].Data[0].Acc3_Name != "" && Header_g[1].Data[0].Data[0].Acc3_Name != 'null') {
                        k++;
                        tableContent += "<tr>";
                        tableContent += "<td>" + k + "</td>";
                        tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist'  value='" + Header_g[1].Data[0].Data[0].Acc3_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc3_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                        if (Header_g[1].Data[0].Data[0].Acc3_Only_For_Doctor.length > 0) {
                            tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                        }
                        else {
                            tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                        }
                        tableContent += "<td><input type='text' id='txtStartTime_" + k + "'  class='time accomp' value='" + Header_g[1].Data[0].Data[0].Acc3_Start_Time.split('_')[0] + "' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  class='time accomp' value='" + Header_g[1].Data[0].Data[0].Acc3_Start_Time.split('_')[1] + "' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                    }
                    else if (i == 4 && Header_g[1].Data[0].Data[0].Acc4_Name != "" && Header_g[1].Data[0].Data[0].Acc4_Name != 'null') {
                        k++;
                        tableContent += "<tr>";
                        tableContent += "<td>" + k + "</td>";
                        tableContent += "<td><input type='text' id='txtAccompanist_" + k + "'  class='autoAccompanist' value='" + Header_g[1].Data[0].Data[0].Acc4_Name + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Acc4_Code + "' id='hdnAccompanistCode_" + k + "'/><span id='popup_" + k + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                        if (Header_g[1].Data[0].Data[0].Acc4_Only_For_Doctor.length > 0) {
                            tableContent += "<td><input type='checkbox' checked='checked' id='chkOnlyDoctor_" + k + "'  class='accompchk'/>Yes</td>";
                        }
                        else {
                            tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + k + "' class='accompchk' />Yes</td>";
                        }
                        tableContent += "<td><input type='text' id='txtStartTime_" + k + "' value='" + Header_g[1].Data[0].Data[0].Acc4_Start_Time.split('_')[0] + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + k + "'  value='" + Header_g[1].Data[0].Data[0].Acc4_Start_Time.split('_')[1] + "' class='time accomp' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                        accompRow = k + 1;
                    }
                }

                if (k != 4 && k != 0) {
                    tableContent += "<tr>";
                    tableContent += "<td>" + (k + 1) + "</td>";
                    tableContent += "<td><input type='text' id='txtAccompanist_" + (k + 1) + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + (k + 1) + "'/><span id='popup_" + (k + 1) + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                    tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + (k + 1) + "' class='accompchk' />Yes</td>";
                    tableContent += "<td><input type='text' id='txtStartTime_" + (k + 1) + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                    tableContent += "<td><input type='text' id='txtEndTime_" + (k + 1) + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                    tableContent += "</tr>";
                    accompRow = parseInt(k) + 2;
                }

                else if (k == 0) {
                    for (var i = 1; i <= 2; i++) {
                        tableContent += "<tr>";
                        tableContent += "<td>" + i + "</td>";
                        tableContent += "<td><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + i + "'/><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                        tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + i + "' class='accompchk' />Yes</td>";
                        tableContent += "<td><input type='text' id='txtStartTime_" + i + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                        tableContent += "<td><input type='text' id='txtEndTime_" + i + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                        tableContent += "</tr>";
                    }
                    accompRow = parseInt(i);
                }
            }
        }
        else {
            for (var i = 1; i <= 2; i++) {
                tableContent += "<tr>";
                tableContent += "<td>" + i + "</td>";
                tableContent += "<td><input type='text' id='txtAccompanist_" + i + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + i + "'/><span id='popup_" + i + "' class='accPopup'>&nbsp&#62&#62</span></td>";
                tableContent += "<td><input type='checkbox' id='chkOnlyDoctor_" + i + "'  class='accompchk'/>Yes</td>";
                tableContent += "<td><input type='text' id='txtStartTime_" + i + "'  class='time accomp' onclick= '$(this).select();' /></td>";
                tableContent += "<td><input type='text' id='txtEndTime_" + i + "'  class='time accomp' onclick= '$(this).select();'/></td>";
                tableContent += "</tr>";
            }
            accompRow = parseInt(i);
        }
        $('#accompanistDetail').html(tableContent + "</table>");
        autoComplete(accompanistJson_g, "txtAccompanist", "hdnAccompanistCode", 'autoAccompanist');
        fnAccompanistEventBinder();
    }
}

function fnCreateIntermediatePlaceTable(isPrefill) {

    // Readonly assignment for distance
    var style = "";
    var draftedIsRoute = new Boolean(false);
    if (Header_g[2].Data.length > 0) {

        var distanceEditJson = jsonPath(Header_g[2], "$.Data[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");
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
    tableContent += "<th>Distance</th>";
    tableContent += "<th>Travel Mode</th>";
    tableContent += "</tr>";
    tableContent += "</thead>";

    //for tp data.
    if (dcrStatus == "1" && source != "TAB" && isPrefill == "Y") {
        var isRouteCompleteFlag = new Boolean(false);

        // old logic
        if (Header_g[1].Data[1].Data.length <= 0) {
            tableContent += "<tr>";
            if (Header_g[1].Data[0].Data[0].Route_Way == null || Header_g[1].Data[0].Data[0].Route_Way.toUpperCase() != "R") {
                var fromplace = Header_g[1].Data[0].Data[0].From_Place == null ? "" : Header_g[1].Data[0].Data[0].From_Place;
                var toplace = Header_g[1].Data[0].Data[0].To_Place == null ? "" : Header_g[1].Data[0].Data[0].To_Place;
                tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + fromplace + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].From_Place + "' id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + toplace + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].To_Place + "' id='hdnToPlace_1'/></td>";
            }
            else {
                var fromplace = Header_g[1].Data[0].Data[0].From_Place == null ? "" : Header_g[1].Data[0].Data[0].From_Place;
                var toplace = Header_g[1].Data[0].Data[0].To_Place == null ? "" : Header_g[1].Data[0].Data[0].To_Place;
                tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + toplace + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].To_Place + "' id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + fromplace + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].From_Place + "' id='hdnToPlace_1'/></td>";
            }
            var distance = Header_g[1].Data[0].Data[0].Distance == null ? "" : Header_g[1].Data[0].Data[0].Distance;
            var travelMode = Header_g[1].Data[0].Data[0].Travel_Mode == null ? "" : Header_g[1].Data[0].Data[0].Travel_Mode;
            tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Route_Way + "' id='hdnRouteWay_1'/></td>";
            tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + travelMode + "' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
            tableContent += "</tr>";
            interRow = 2;

            // HOP Route Complete
            if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                        isRouteCompleteFlag = true;
                    }
                }
            }
        }

            //new logic
        else {
            if (intermediateNeed == "NO") {
                if (Header_g[1].Data[1].Data.length > 0) {
                    tableContent += "<tr>";
                    tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + Header_g[1].Data[1].Data[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[0].From_Place + "' id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + Header_g[1].Data[1].Data[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[0].To_Place + "' id='hdnToPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + Header_g[1].Data[1].Data[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/>";

                    //to get the route way.
                    var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + Header_g[1].Data[1].Data[0].To_Place + "' & @.To_Place == '" + Header_g[1].Data[1].Data[0].From_Place + "')");
                    if (distanceJson != false) {
                        tableContent += "<input type='hidden' value='R' id='hdnRouteWay_1'/></td>";
                    }
                    else {
                        tableContent += "<input type='hidden' value='D' id='hdnRouteWay_1'/></td>";
                    }
                    tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + Header_g[1].Data[1].Data[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[1].Data[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
                    tableContent += "</tr>";
                    interRow = 2;
                }
                else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                    tableContent += "<tr>";
                    tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
                    tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                    tableContent += "</tr>";
                    interRow = 2;
                }
            }
            else {
                if (Header_g[1].Data[1].Data.length > 0) {
                    var count = Header_g[1].Data[1].Data.length;

                    //TP COMPLETE
                    var isRouteCompleteinTP = new Boolean(false);

                    var tpFrom = Header_g[1].Data[1].Data[0].From_Place;
                    var tpTo = Header_g[1].Data[1].Data[count - 1].To_Place;

                    // HOP Route Complete
                    if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                            if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
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
                    for (var k = 1; k <= count; k++) {

                        if (k == count && isRouteCompleteinTP == true) { // TP data has route completed data
                            tableContent += "<tr id='trInterAuto'>";

                            tableContent += "<td><label id='lblFromPlace_Auto'>" + Header_g[1].Data[1].Data[k - 1].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + Header_g[1].Data[1].Data[k - 1].From_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + Header_g[1].Data[1].Data[k - 1].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + Header_g[1].Data[1].Data[k - 1].To_Place + "'/></td>";
                            tableContent += "<td><label id='lblDistance_Auto'>" + Header_g[1].Data[1].Data[k - 1].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + Header_g[1].Data[1].Data[k - 1].Distance_Fare_Code + "'/>";

                            //to get the route way.
                            var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + Header_g[1].Data[1].Data[k - 1].To_Place + "' & @.To_Place == '" + Header_g[1].Data[1].Data[k - 1].From_Place + "')");
                            if (distanceJson != false) {
                                tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='R'/></td>";
                            }
                            else {
                                tableContent += "<input type='hidden' id='hdnRouteWay_Auto'  value='D'/></td>";
                            }

                            tableContent += "<td><label id='lblTravelMode_Auto'>" + Header_g[1].Data[1].Data[k - 1].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + Header_g[1].Data[1].Data[k - 1].Travel_Mode + "'/></td>";
                            tableContent += "</tr>";
                            $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                        }
                        else {
                            tableContent += "<tr>";
                            tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + Header_g[1].Data[1].Data[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/>";
                            //to get the route way.
                            var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' & @.To_Place == '" + Header_g[1].Data[1].Data[i - 1].From_Place + "')");
                            if (distanceJson != false) {
                                tableContent += "<input type='hidden' value='R' id='hdnRouteWay_" + i + "'/></td>";
                            }
                            else {
                                tableContent += "<input type='hidden' value='D' id='hdnRouteWay_" + i + "'/></td>";
                            }

                            tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";
                            tableContent += "</tr>";
                            i++;
                        }
                    }

                    //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                    if ($("#ddlCategory :selected").text() != "HQ") {
                        tableContent += "<tr>";
                        tableContent += "<td><input type='text' id='txtFromPlace_" + i + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtToPlace_" + i + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + i + "'/><input type='hidden' id='hdnRouteWay_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtTravelMode_" + i + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + i + "'/></td>";
                        tableContent += "</tr>";
                        interRow = parseInt(i) + 1;
                    }
                    else {
                        interRow = 2;
                    }
                }
                else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                    tableContent += "<tr>";
                    tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
                    tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                    tableContent += "</tr>";
                    interRow = 2;
                }
            }
        }
    }

        // for prefill data with category "HQ"
    else if ($("#ddlCategory :selected").text() == "HQ" && isPrefill == "Y") {
        tableContent += "<tr>";
        if (Header_g[1].Data[0].Data[0].Route_Way.toUpperCase() != "R") {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + Header_g[1].Data[0].Data[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].From_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + Header_g[1].Data[0].Data[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].To_Place + "' id='hdnToPlace_1'/></td>";
        }
        else {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + Header_g[1].Data[0].Data[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].To_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + Header_g[1].Data[0].Data[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].From_Place + "' id='hdnToPlace_1'/></td>";
        }
        tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + Header_g[1].Data[0].Data[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Route_Way + "' id='hdnRouteWay_1'/></td>";
        tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + Header_g[1].Data[0].Data[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
        tableContent += "</tr>";
        interRow = 2;
    }
    else if (isPrefill == "Y") {


        // privilege check - "DCR_INTERMEDIATE_PLACES". if it is not mapped with the value "DCR", and the drafted value has the intermediate place, show only the frst record.
        if (intermediateNeed == "NO") {
            if (Header_g[1].Data[0].Data.length > 0) {
                tableContent += "<tr>";
                if (Header_g[1].Data[0].Data[0].Route_Way.toUpperCase() != "R") {
                    tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + Header_g[1].Data[0].Data[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].From_Place + "' id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + Header_g[1].Data[0].Data[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].To_Place + "' id='hdnToPlace_1'/></td>";
                }
                else {
                    tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + Header_g[1].Data[0].Data[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].To_Place + "' id='hdnFromPlace_1'/></td>";
                    tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + Header_g[1].Data[0].Data[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].From_Place + "' id='hdnToPlace_1'/></td>";
                }
                tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + Header_g[1].Data[0].Data[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Route_Way + "' id='hdnRouteWay_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + Header_g[1].Data[0].Data[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[0].Data[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
        }

        else {
            if (Header_g[1].Data[1].Data.length > 0) {
                var count = Header_g[1].Data[1].Data.length;
                var isRouteCompleteFlag = new Boolean(false);

                //HOP Route Complete
                if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                        if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                            isRouteCompleteFlag = true;
                        }
                    }
                }
                if (isRouteCompleteFlag == true) {
                    for (var i = 1; i <= count; i++) {
                        tableContent += "<tr>";
                        if (Header_g[1].Data[1].Data[i - 1].Is_Route_Complete != "Y") {
                            if (Header_g[1].Data[1].Data[i - 1].Route_Way.toUpperCase() != "R") {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                            }
                            else {
                                tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                                tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' id='hdnToPlace_" + i + "'/></td>";
                            }
                            tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + Header_g[1].Data[1].Data[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/><input type='hidden'  value='" + Header_g[1].Data[1].Data[i - 1].Route_Way + "' id='hdnRouteWay_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";
                        }
                        tableContent += "</tr>";
                    }

                    //Row for route complete
                    var routeCompleteJson = jsonPath(Header_g[1].Data[1], "$.Data[?(@.Is_Route_Complete=='Y')]");
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
                        tableContent += "<td><label id='lblDistance_Auto'>" + routeCompleteJson[0].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + routeCompleteJson[0].Distance_Fare_Code + "'/><input type='hidden' id='hdnRouteWay_Auto'  value='" + routeCompleteJson[0].Route_Way + "'/></td>";
                        tableContent += "<td><label id='lblTravelMode_Auto'>" + routeCompleteJson[0].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + routeCompleteJson[0].Travel_Mode + "'/></td>";
                        tableContent += "</tr>";
                        $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                    }
                    else {
                        draftedIsRoute = true;
                    }
                }
                else {// if no route complete
                    for (var i = 1; i <= count; i++) {
                        tableContent += "<tr>";
                        if (Header_g[1].Data[1].Data[i - 1].Route_Way.toUpperCase() != "R") {
                            tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' id='hdnToPlace_" + i + "'/></td>";
                        }
                        else {
                            tableContent += "<td><input type='text' id='txtFromPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].To_Place + "' id='hdnFromPlace_" + i + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].From_Place + "' id='hdnToPlace_" + i + "'/></td>";
                        }
                        tableContent += "<td><input type='text' id='txtDistance_" + i + "' " + style + " value='" + Header_g[1].Data[1].Data[i - 1].Distance + "'  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + i + "'/><input type='hidden'  value='" + Header_g[1].Data[1].Data[i - 1].Route_Way + "' id='hdnRouteWay_" + i + "'/></td>";
                        tableContent += "<td><input type='text' id='txtTravelMode_" + i + "' value='" + Header_g[1].Data[1].Data[i - 1].Travel_Mode + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden' value='" + Header_g[1].Data[1].Data[i - 1].Travel_Mode + "' id='hdnTravelMode_" + i + "'/></td>";
                    }
                    tableContent += "</tr>";
                }

                var d = 0;
                if (isRouteCompleteFlag == true) {
                    if (draftedIsRoute == true) {
                        d = i;
                        interRow = parseInt(i) + 1;
                    }
                    else {
                        d = (i - 1);
                        interRow = parseInt(i);
                    }
                }
                else {
                    d = i;
                    interRow = parseInt(i) + 1;
                }


                //extra row to enter intermediate place if the privilege "DCR_INTERMEDIATE_PLACES" mapped as "DCR".
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_" + d + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_" + d + "'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_" + d + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + d + "'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_" + d + "' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + d + "'/><input type='hidden' id='hdnRouteWay_" + d + "'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_" + d + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + d + "'/></td>";
                tableContent += "</tr>";

            }
            else { //  for prefill data and category is other than "HQ", if no intermediate data exisit.
                tableContent += "<tr>";
                tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
                tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
                tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
                tableContent += "</tr>";
                interRow = 2;
            }
        }
    }

        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CP") {
        var cpJson = jsonPath(Header_g[0].Data[1], "$.Data[?(@.CP_No=='" + $("#CP_No").val().toString() + "')]");
        tableContent += "<tr>";
        if (cpJson[0].Route_Way.toUpperCase() != "R") {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + cpJson[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].From_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + cpJson[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].To_Place + "' id='hdnToPlace_1'/></td>";
        }
        else {
            tableContent += "<td><input type='text' id='txtFromPlace_1'  class='autoIntermediate newInter' value='" + cpJson[0].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].To_Place + "' id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  value='" + cpJson[0].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].From_Place + "' id='hdnToPlace_1'/></td>";
        }
        tableContent += "<td><input type='text' id='txtDistance_1' " + style + "  class='numeric fromPlace' value='" + cpJson[0].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[0].Distance_Fare_Code + "' id='hdnDistanceFareCode_1'/><input type='hidden' value='" + cpJson[0].Route_Way + "' id='hdnRouteWay_1'/></td>";
        tableContent += "<td><input type='text' id='txtTravelMode_1'  class='autotravel fromPlace' value='" + cpJson[0].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + cpJson[0].Travel_Mode + "' id='hdnTravelMode_1'/></td>";
        tableContent += "</tr>";

        // to create extra empty row.
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text() != "HQ") {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtFromPlace_2'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_2'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_2'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_2'/></td>";
            tableContent += "<td><input type='text' id='txtDistance_2' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_2'/><input type='hidden' id='hdnRouteWay_2'/></td>";
            tableContent += "<td><input type='text' id='txtTravelMode_2'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_2'/></td>";
            tableContent += "</tr>";
            interRow = 3;
        }
        else {
            interRow = 2;
        }
    }

        // prefill data in cp onblur event.
    else if (isPrefill == "Y_CPHOP") {
        var j = 1;
        var cpJson = jsonPath(Header_g[0].Data[2], "$.Data[?(@.CP_No=='" + $("#CP_No").val().toString() + "')]");
        if (cpJson.length > 0) {
            $("#Work_Place").val(cpJson[0].Work_Place);
            var isRouteCompleteFlag = new Boolean(false);
            var isRouteCompleteinCP = new Boolean(false);
            var cpFrom = ((cpJson[0].Route_Way.toUpperCase() != 'R') ? cpJson[0].From_Place : cpJson[0].To_Place);
            var cpTo = ((cpJson[cpJson.length - 1].Route_Way.toUpperCase() != 'R') ? cpJson[cpJson.length - 1].To_Place : cpJson[cpJson.length - 1].From_Place);

            // HOP Route Complete
            if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                        //if ((cpJson[0].From_Place == cpJson[cpJson.length - 1].From_Place && cpJson[0].To_Place == cpJson[cpJson.length - 1].To_Place) || (cpJson[0].From_Place == cpJson[cpJson.length - 1].To_Place && cpJson[0].To_Place == cpJson[cpJson.length - 1].From_Place)) {
                        if (cpFrom == cpTo) {
                            isRouteCompleteinCP = true;
                        }

                        else {
                            isRouteCompleteFlag = true;
                        }
                    }
                }
            }

            for (var i = 0; i < cpJson.length; i++) {
                if (cpJson[i].From_Place != "") {
                    if (i == (cpJson.length - 1) && isRouteCompleteinCP == true) { // CP data has route completed data
                        tableContent += "<tr id='trInterAuto'>";
                        if (cpJson[i].Route_Way.toUpperCase() != "R") {
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + cpJson[i].From_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + cpJson[i].From_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + cpJson[i].To_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + cpJson[i].To_Place + "'/></td>";
                        }
                        else {
                            tableContent += "<td><label id='lblFromPlace_Auto'>" + cpJson[i].To_Place + "</label><input type='hidden'  id='hdnFromPlace_Auto' value='" + cpJson[i].To_Place + "'/></td>"
                            tableContent += "<td><label id='lblToPlace_Auto'>" + cpJson[i].From_Place + "</label><input type='hidden'  id='hdnToPlace_Auto' value='" + cpJson[i].From_Place + "'/></td>";
                        }
                        tableContent += "<td><label id='lblDistance_Auto'>" + cpJson[i].Distance + "</label><input type='hidden' id='hdnDistanceFareCode_Auto' value='" + cpJson[i].Distance_Fare_Code + "'/><input type='hidden' id='hdnRouteWay_Auto'  value='" + cpJson[i].Route_Way + "'/></td>";
                        tableContent += "<td><label id='lblTravelMode_Auto'>" + cpJson[i].Travel_Mode + "</label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'  value='" + cpJson[i].Travel_Mode + "'/></td>";
                        tableContent += "</tr>";
                        $("#lblRCHelp").html("Green highlighted row is auto generated that enables circle route completion.");
                    }
                    else {
                        tableContent += "<tr>";
                        if (cpJson[i].Route_Way.toUpperCase() != "R") {
                            tableContent += "<td><input type='text' id='txtFromPlace_" + j + "'  class='autoIntermediate newInter' value='" + cpJson[i].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].From_Place + "' id='hdnFromPlace_" + j + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + j + "'  class='autoIntermediate fillDist fromPlace'  value='" + cpJson[i].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].To_Place + "' id='hdnToPlace_" + j + "'/></td>";
                        }
                        else {
                            tableContent += "<td><input type='text' id='txtFromPlace_" + j + "'  class='autoIntermediate newInter' value='" + cpJson[i].To_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].To_Place + "' id='hdnFromPlace_" + j + "'/></td>";
                            tableContent += "<td><input type='text' id='txtToPlace_" + j + "'  class='autoIntermediate fillDist fromPlace'  value='" + cpJson[i].From_Place + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].From_Place + "' id='hdnToPlace_" + j + "'/></td>";
                        }
                        tableContent += "<td><input type='text' id='txtDistance_" + j + "' " + style + "  class='numeric fromPlace' value='" + cpJson[i].Distance + "' onclick= '$(this).select();' /><input type='hidden' value='" + cpJson[i].Distance_Fare_Code + "' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' value='" + cpJson[i].Route_Way + "' id='hdnRouteWay_" + j + "'/></td>";
                        tableContent += "<td><input type='text' id='txtTravelMode_" + j + "'  class='autotravel fromPlace' value='" + cpJson[i].Travel_Mode + "' onclick= '$(this).select();'/><input type='hidden' value='" + cpJson[i].Travel_Mode + "' id='hdnTravelMode_" + j + "'/></td>";
                        tableContent += "</tr>";
                        j++;
                    }
                }
            }

            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtFromPlace_" + j + "'  class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_" + j + "'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_" + j + "' class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + j + "'/></td>";
            tableContent += "<td><input type='text' id='txtDistance_" + j + "'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + j + "'/><input type='hidden' id='hdnRouteWay_" + j + "'/></td>";
            tableContent += "<td><input type='text' id='txtTravelMode_" + j + "'  class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + j + "'/></td>";
            tableContent += "</tr>";
            interRow = parseInt(j) + 1;
        }
        else {
            tableContent += "<tr>";
            tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_" + i + "'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + i + "'/></td>";
            tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
            tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + i + "'/></td>";
            tableContent += "</tr>";
            interRow = 2;
        }
    }

        // Page load no tp found
    else if (isPrefill == "LOAD") {
        tableContent += "<tr>";
        tableContent += "<td><input type='text' id='txtFromPlace_1' value='" + currRegionName + "'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + currRegionName + "  id='hdnFromPlace_1'/></td>";
        tableContent += "<td><input type='text' id='txtToPlace_1' value='" + currRegionName + "'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + currRegionName + "  id='hdnToPlace_1'/></td>";
        tableContent += "<td><input type='text' id='txtDistance_1' " + style + "   class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
        tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
        tableContent += "</tr>";
        interRow = 2;
    }

        // to create empty rows
    else {
        tableContent += "<tr>";
        if (isPrefill == "LOAD") {
            tableContent += "<td><input type='text' id='txtFromPlace_1' value='" + currRegionName + "'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden' value='" + currRegionName + "  id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1' value='" + currRegionName + "'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden' value='" + currRegionName + "  id='hdnToPlace_1'/></td>";
        }
        else {
            tableContent += "<td><input type='text' id='txtFromPlace_1'   class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_1'/></td>";
            tableContent += "<td><input type='text' id='txtToPlace_1'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_1'/></td>";
        }
        tableContent += "<td><input type='text' id='txtDistance_1'  " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_1'/><input type='hidden' id='hdnRouteWay_1'/></td>";
        tableContent += "<td><input type='text' id='txtTravelMode_1'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_1'/></td>";
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
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    if (isRouteCompleteFlag == true) {
                        fnHOPRouteComplete("1");
                    }
                }
            }
        }
    }

    // for drafted data- route complete
    if (draftedIsRoute == true) {
        fnHOPRouteComplete("1");
    }

    // for cp hop - route complete
    if (isPrefill == "Y_CPHOP" && isRouteCompleteFlag == true) {
        fnHOPRouteComplete("1");
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

        $(tdSNo).html(accompRow);
        $(tdAccompanist).html("<input type='text' id='txtAccompanist_" + accompRow + "'  class='autoAccompanist'  onclick= '$(this).select();' /><input type='hidden' id='hdnAccompanistCode_" + accompRow + "'/><span id='popup_" + accompRow + "' class='accPopup'>&nbsp&#62&#62</span>");
        $(tdOnlyDoctor).html("<input type='checkbox' id='chkOnlyDoctor_" + accompRow + "' class='accompchk' />Yes");
        $(tdStartTime).html("<input type='text' id='txtStartTime_" + accompRow + "'  class='time accomp' onclick= '$(this).select();' />");
        $(tdEndTime).html("<input type='text' id='txtEndTime_" + accompRow + "'  class='time accomp' onclick= '$(this).select();'/>");

        autoComplete(accompanistJson_g, "txtAccompanist", "hdnAccompanistCode", 'autoAccompanist');
        fnAccompanistEventBinder();

        accompRow = parseInt(accompRow) + 1;
    }
}

function fnCreateNewRowInIntermediate(e) {
    if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        var id = "txtFromPlace_" + (interRow - 1) + "";

        if (e.id != id) {
            return;
        }

        var rCnt = $("#tblIntermediate tr").length;
        var newRow = document.getElementById("tblIntermediate").insertRow(parseInt(rCnt));

        var tdFromPlace = newRow.insertCell(0);
        var tdToPlace = newRow.insertCell(1);
        var tdDistance = newRow.insertCell(2);
        var tdTravelMode = newRow.insertCell(3);

        // Readonly assignment for distance
        var style = "";
        if (Header_g[2].Data.length > 0) {

            var distanceEditJson = jsonPath(Header_g[2], "$.Data[?(@.Category=='" + $("#ddlCategory").val().toString() + "' & @.SFC_Type!='E' & @.Is_Prefill!='N')]");

            if (distanceEditJson.length > 0) {
                if (distanceEditJson[0].Distance_Edit == 'R') {
                    style = "readonly='readonly'";
                }
            }
        }

        $(tdFromPlace).html("<input type='text' id='txtFromPlace_" + interRow + "' class='autoIntermediate newInter'  onclick= '$(this).select();' /><input type='hidden'  id='hdnFromPlace_" + interRow + "'/>");
        $(tdToPlace).html("<input type='text' id='txtToPlace_" + interRow + "'  class='autoIntermediate fillDist fromPlace'  onclick= '$(this).select();' /><input type='hidden'  id='hdnToPlace_" + interRow + "'/>");
        $(tdDistance).html("<input type='text' id='txtDistance_" + interRow + "' " + style + "  class='numeric fromPlace' onclick= '$(this).select();' /><input type='hidden' id='hdnDistanceFareCode_" + interRow + "'/><input type='hidden' id='hdnRouteWay_" + interRow + "'/>");
        $(tdTravelMode).html("<input type='text' id='txtTravelMode_" + interRow + "'   class='autotravel fromPlace' onclick= '$(this).select();'/><input type='hidden'  id='hdnTravelMode_" + interRow + "'/>");

        autoComplete(intermediate_g, "txtFromPlace", "hdnFromPlace", 'autoIntermediate');
        autoComplete(intermediate_g, "txtToPlace", "hdnToPlace", 'autoIntermediate');
        autoComplete(travelModeJson_g, "txtTravelMode", "hdnTravelMode", 'autotravel');
        fnIntermediateEventBinder();

        interRow = parseInt(interRow) + 1;
    }
}


function fnHOPRouteComplete(rCnt) {

    // Only for rigid entry
    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) {
        if ($("#txtToPlace_" + rCnt).val() != "" && $("#txtFromPlace_" + rCnt).val() != "") {

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
            var tdDistance = newRow.insertCell(2);
            var tdTravelMode = newRow.insertCell(3);

            $(tdFromPlace).html("<label id='lblFromPlace_Auto'></label><input type='hidden'  id='hdnFromPlace_Auto'/>");
            $(tdToPlace).html("<label id='lblToPlace_Auto'></label><input type='hidden'  id='hdnToPlace_Auto'/>");
            $(tdDistance).html("<label id='lblDistance_Auto'></label><input type='hidden' id='hdnDistanceFareCode_Auto'/><input type='hidden' id='hdnRouteWay_Auto'/>");
            $(tdTravelMode).html("<label id='lblTravelMode_Auto'></label><div class='routeCompHelp' title='Green highlighted row is auto generated that enables circle route completion. If you add any intermediate places below this, system will ignore this route and will create a new route to complete the circle route.'></div><input type='hidden'  id='hdnTravelMode_Auto'/>");

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

            var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + autoFromPlace + "' & @.To_Place == '" + autoToPlace + "') | (@.From_Place=='" + autoToPlace + "' & @.To_Place == '" + autoFromPlace + "'))]");

            if (!(distanceJson === undefined) && distanceJson.length > 0) {
                if (categoryCheckNeeded == "YES") {
                    if ($("#ddlCategory :selected").text().toUpperCase() == distanceJson[0].Category_Name.toUpperCase()) {
                        $("#lblDistance_Auto").html(distanceJson[0].Distance);
                        $("#lblTravelMode_Auto").html(distanceJson[0].Travel_Mode);
                        $("#hdnDistanceFareCode_Auto").val(distanceJson[0].Distance_Fare_Code);
                        if (autoFromPlace == distanceJson[0].To_Place && autoToPlace == distanceJson[0].From_Place) {
                            $("#hdnRouteWay_Auto").val("R");
                        }
                        else {
                            $("#hdnRouteWay_Auto").val("D");
                        }
                    }
                    else {
                        $("#lblDistance_Auto").html("0");
                        $("#lblTravelMode_Auto").html("");
                        $("#hdnDistanceFareCode_Auto").val("");
                        $("#hdnRouteWay_Auto").val("");
                    }
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
                }
            }

                // if no from place to place combination found.
            else {
                $("#lblDistance_Auto").html("0");
                $("#lblTravelMode_Auto").html("");
                $("#hdnDistanceFareCode_Auto").val("");
                $("#hdnRouteWay_Auto").val("");
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
    $(".autoAccompanist").keypress(function () { fnCreateNewRowInAccompanist(this.id); });
    $(".autoAccompanist").dblclick(function () { fnCreateNewRowInAccompanist(this.id); });

    $(".accPopup").click(function () { fnAccompanistPopUp(this); });

    // Valid data check and SFC auto fill JSON generation method.
    //$(".autoAccompanist").blur(function () { if (fnValidateAccompanist(this)) { fnGenerateSFCJson("EVENT"); } });
    $(".autoAccompanist").blur(function () { if (fnValidateAccompanist(this)) { fnGetAccompanistSFC(this); } });
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
}

function fnDisableOnlyForDoctor() {
    for (var i = 1; i < accompRow; i++) {
        if ($("#txtAccompanist_" + i).val() != "") {
            if ($("#txtAccompanist_" + i).val().split('(')[0].split(',')[1] == "VACANT" || $("#txtAccompanist_" + i).val().split('(')[0].split(',')[1] == "NOT ASSIGNED") {
                $("#chkOnlyDoctor_" + i).attr('checked', 'checked');
                $("#chkOnlyDoctor_" + i).attr('disabled', true);
            }
        }
    }
}

function fnIntermediateEventBinder() {
    // New row Creation - Intermediate Table
    $(".newInter").keypress(function () { fnCreateNewRowInIntermediate(this); });
    $(".newInter").dblclick(function () { fnCreateNewRowInIntermediate(this); });
    $(".newInter").blur(function () { fnFillDistanceTravelMode(this.id); });

    // to fill distance ,travel mode in to_place blur event.
    $(".fillDist").blur(function () { fnFillDistanceTravelMode(this.id); });


    // to check 1st row empty.
    $(".fromPlace").blur(function () { if ($(this).val() != "") { return fnCheckFromPlace(this.id) } });


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

function fnSetHeaderPrivileges() {
    var hopNeeded = "", accomp = "", categoryCheck = "", sfcValid = "", hopRouteComplete = "";
    var hopArr = new Array();

    var accompArr = new Array();
    var categoryArr = new Array();

    // geting privilege value.
    hopNeeded = fnGetPrivilegeValue("DCR_INTERMEDIATE_PLACES", "");
    accomp = fnGetPrivilegeValue("SHOW_ACCOMPANISTS_DATA", "");
    categoryCheck = fnGetPrivilegeValue("SFC_CATEGORY_DONT_CHECK", "");
    sfcValid = fnGetPrivilegeValue("SFC_VALIDATION", "");
    accMandatory = fnGetPrivilegeValue("DCR_ACCOMPANIST_MANDATORY", "0");
    isRouteComplete = fnGetPrivilegeValue("HOP_GRID_ROUTE_COMPLETE", "NO");
    hopRouteComplete = fnGetPrivilegeValue("CIRCLE_ROUTE_APPLICABLE_CATEGORY", "");

    // set the value for validation.
    hopArr = hopNeeded.split(',');
    accompArr = accomp.split(',');
    categoryArr = categoryCheck.split(',');
    sfcValidation = sfcValid.split(',');
    hopRouteCategory = hopRouteComplete.split(',');

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

function fnCategorySelected() {
    fnGenerateSFCJson("EVENT");
    fnCreateIntermediatePlaceTable("N");
}

function fnFillCpDetails() {
    if (cpNeed == "YES" || cpNeed == "OPTIONAL") { // check the privilege value for CAMPAIGN_PLANNER
        if ($("#CP_No").val() != "") {
            if (Header_g[0].Data[1] != "" || !(Header_g[0].Data[1] === undefined)) {
                var cpJson = jsonPath(Header_g[0].Data[1], "$.Data[?(@.CP_No=='" + $("#CP_No").val().toString() + "')]");
                if (cpJson.length > 0) {
                    $("#hdnCPCode").val(cpJson[0].CP_Code);
                    $("#ddlCategory").val(cpJson[0].Category);
                    $("#Work_Place").val(cpJson[0].Work_Place);
                    fnGenerateSFCJson("EVENT");
                    var isCPHOP = "";

                    // only one from place to place in cp.                
                    if (cpJson[0].From_Place != "") {
                        fnRemoveErrorIndicatior("#CP_No");
                        fnCreateIntermediatePlaceTable("Y_CP");
                    }

                        // for hop places in CP
                    else if (Header_g[0].Data[2] != "" && cpJson[0].From_Place == "" && Header_g[0].Data[2].Data.length > 0) {
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
                        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                                if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
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
                else { // valid cp data check only when CAMPAIGN_PLANNER privilege set to "YES".
                    //fnMsgAlert('error', 'Error', $("#CP_No").val()+'is invalid CP Name. ');
                    //fnErrorIndicator("#CP_No");
                    //$("#hdnCPCode").focus();
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
    if ($("#txtFromPlace_" + rCnt).val() != "" || $("#txtToPlace_" + rCnt).val() != "") {


        // SFC autofill = Header_g[0].Data[3]   


        if (Header_g[0].Data[3] != "" || !(Header_g[0].Data[3] === undefined)) {

            var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + $("#txtFromPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + rCnt).val() + "'))]");

            if (!(distanceJson === undefined) && distanceJson.length > 0) {
                if (categoryCheckNeeded == "YES") {
                    if ($("#ddlCategory :selected").text().toUpperCase() == distanceJson[0].Category_Name.toUpperCase()) {
                        $("#txtDistance_" + rCnt).val(distanceJson[0].Distance);
                        $("#txtTravelMode_" + rCnt).val(distanceJson[0].Travel_Mode);
                        $("#hdnDistanceFareCode_" + rCnt).val(distanceJson[0].Distance_Fare_Code);
                        if ($("#txtFromPlace_" + rCnt).val() == distanceJson[0].To_Place && $("#txtToPlace_" + rCnt).val() == distanceJson[0].From_Place) {
                            $("#hdnRouteWay_" + rCnt).val("R");
                        }
                        else {
                            $("#hdnRouteWay_" + rCnt).val("D");
                        }
                    }
                    else {
                        $("#txtDistance_" + rCnt).val("0");
                        $("#txtTravelMode_" + rCnt).val("");
                        $("#hdnDistanceFareCode_" + rCnt).val("");
                        $("#hdnRouteWay_" + rCnt).val("");
                    }
                }
                else {
                    $("#txtDistance_" + rCnt).val(distanceJson[0].Distance);
                    $("#txtTravelMode_" + rCnt).val(distanceJson[0].Travel_Mode);
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
                $("#txtTravelMode_" + rCnt).val("");
                $("#hdnDistanceFareCode_" + rCnt).val("");
                $("#hdnRouteWay_" + rCnt).val("");
            }
            if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                    if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                        fnHOPRouteComplete(rCnt);
                    }
                }
            }
        }
            // if no from place to place combination found.
        else {
            $("#txtDistance_" + rCnt).val("0");
            $("#txtTravelMode_" + rCnt).val("");
            $("#hdnDistanceFareCode_" + rCnt).val("");
            $("#hdnRouteWay_" + rCnt).val("");
        }
    }
    else {

        $("#txtDistance_" + rCnt).val("");
        $("#txtTravelMode_" + rCnt).val("");
        $("#hdnDistanceFareCode_" + rCnt).val("");
        $("#hdnRouteWay_" + rCnt).val("");
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                    fnHOPRouteComplete(rCnt);
                }
            }
        }
    }
}


function fnReadIntermediateData() {
    var intermediatePlace = "";

    for (var i = 1; i < interRow; i++) {
        if ($("#txtFromPlace_" + i).val() != "") {
            intermediatePlace += $("#txtFromPlace_" + i).val() + '^';
            intermediatePlace += $("#txtToPlace_" + i).val() + '^';
            intermediatePlace += $("#txtDistance_" + i).val() + '^';
            intermediatePlace += $("#txtTravelMode_" + i).val() + '^';
            intermediatePlace += $("#hdnDistanceFareCode_" + i).val() + '^';
            intermediatePlace += $("#hdnRouteWay_" + i).val() + '^';
            intermediatePlace += 'N^';
        }
    }

    if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                if ($("#trInterAuto") != null) {
                    intermediatePlace += $("#lblFromPlace_Auto").html() + '^';
                    intermediatePlace += $("#lblToPlace_Auto").html() + '^';
                    intermediatePlace += $("#lblDistance_Auto").html() + '^';
                    intermediatePlace += $("#lblTravelMode_Auto").html() + '^';
                    intermediatePlace += $("#hdnDistanceFareCode_Auto").val() + '^';
                    intermediatePlace += $("#hdnRouteWay_Auto").val() + '^';
                    intermediatePlace += 'Y^';
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
                    if ($("#hdnCPCode").val().length == 0) {
                        //fnBarAlert("Error", "Error", "Invalid CP Name");
                        //$.msgbox('Invalid CP Name.');
                        fnMsgAlert("info", "DCR Header", "Invalid CP Name.");
                        fnErrorIndicator("#CP_No");
                        return false;
                    }
                }
            }

            if (Header_g[0].Data[1] != null && !(Header_g[0].Data[1] === undefined) && Header_g[0].Data[1] != "") {
                if (Header_g[0].Data[1].Data.length > 0) {
                    var cpJson = jsonPath(Header_g[0].Data[1], "$.Data[?(@.CP_No=='" + $("#CP_No").val() + "')]");
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
    if ($("#Work_Place").val() == "") {
        fnMsgAlert("info", "DCR Header", "Please enter the field 'Work Place'. ");
        //$.msgbox("Please enter the field 'Work Place'. ");
        fnErrorIndicator("#Work_Place");
        return false;
    }

    // Special char check.
    if (!(fnCheckRemarksSpecialChar("#Work_Place"))) {
        return false;
    }
    if (cpNeed != "NO") {
        if (!(fnCheckRemarksSpecialChar("#CP_No"))) {
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
    if ($("#ddlCategory :selected").text() != "HQ") {
        for (var i = 2; i < interRow; i++) {
            if ($("#txtFromPlace_" + i).val() != "" || $("#txtToPlace_" + i).val() != "") {

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

    // special char check
    for (var i = 1; i < interRow; i++) {
        if ($("#txtFromPlace_" + i).val() != "" || $("#txtToPlace_" + i).val() != "") {
            if (!(fnCheckRemarksSpecialChar("#txtFromPlace_" + i))) {
                return false;
            }
            if (!(fnCheckRemarksSpecialChar("#txtToPlace_" + i))) {
                return false;
            }
        }
    }

    // sfc validation.
    //var routeCompleteValid = "^^";
    //var distPlaces = new Array();
    for (var i = 1; i < interRow; i++) {

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


                if (Header_g[0].Data[3] != "" || !(Header_g[0].Data[3] === undefined)) {

                    var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + $("#txtFromPlace_" + i).val() + "' & @.To_Place == '" + $("#txtToPlace_" + i).val() + "' & @.Distance == '" + $("#txtDistance_" + i).val() + "') | (@.From_Place=='" + $("#txtToPlace_" + i).val() + "' & @.To_Place == '" + $("#txtFromPlace_" + i).val() + "' & @.Distance == '" + $("#txtDistance_" + i).val() + "'))]");

                    if (!(distanceJson === undefined) && distanceJson.length > 0) {
                        if (categoryCheckNeeded == "YES") { // SFC_CATEGORY_DON_CHECK privilege.
                            var isplaceExist = jsonPath(distanceJson, "$.[?(@.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
                            if (!isplaceExist) {
                                //$.msgbox("The entered route is not available in your SFC master.");
                                fnMsgAlert('info', 'DCR Header', 'The entered route is not available in your SFC master.');
                                fnErrorIndicatorforSFC("#txtToPlace_" + i);
                                fnErrorIndicatorforSFC("#txtFromPlace_" + i);
                                fnErrorIndicatorforSFC("#txtDistance_" + i);
                                return false;
                            }
                        }
                    }
                    else {
                        fnMsgAlert('info', 'DCR Header', 'The entered route is not available in your SFC master.');
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
    if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
        if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
            if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                if ($("#trInterAuto") != null) {

                    //// to check route complete
                    //routeCompleteValid += $("#lblFromPlace_Auto").html() + "^^";
                    //routeCompleteValid += $("#lblToPlace_Auto").html() + "^^";

                    if (Header_g[0].Data[3] != "" || !(Header_g[0].Data[3] === undefined)) {

                        var distanceJson = jsonPath(Header_g[0].Data[3], "$.Data[?((@.From_Place=='" + $("#lblFromPlace_Auto").html() + "' & @.To_Place == '" + $("#lblToPlace_Auto").html() + "' & @.Distance == '" + $("#lblDistance_Auto").html() + "') | (@.From_Place=='" + $("#lblToPlace_Auto").html() + "' & @.To_Place == '" + $("#lblFromPlace_Auto").html() + "' & @.Distance == '" + $("#lblDistance_Auto").html() + "'))]");

                        if (!(distanceJson === undefined) && distanceJson.length > 0) {
                            if (categoryCheckNeeded == "YES") { // SFC_CATEGORY_DON_CHECK privilege.
                                var isplaceExist = jsonPath(distanceJson, "$.[?(@.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
                                if (!isplaceExist) {
                                    //$.msgbox("The entered route is not available in your SFC master.");
                                    fnMsgAlert('info', 'DCR Header', 'The entered route is not available in your SFC master.');
                                    $("#lblFromPlace_Auto").css('color', 'coral !important');
                                    $("#lblToPlace_Auto").css('color', 'coral !important');
                                    $("#lblDistance_Auto").css('color', 'coral !important');
                                    return false;
                                }
                            }
                        }
                        else {
                            fnMsgAlert('info', 'DCR Header', 'The entered route is not available in your SFC master.');
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
                    fnMsgAlert('info', 'DCR Header', $("#txtAccompanist_" + i).val() + " is invalid accomapnist name.");
                    //alert($("#txtAccompanist_" + i).val() + " is invalid accomapnist name.");
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


                if ($.trim($('#txtRemarks_' + i.toString()).val()).length > 0) {
                    if (!(fnCheckRemarksSpecialChar("#txtRemarks_" + i))) {
                        HideModalPopup('dvLoading');
                        return false;
                    }
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
    ShowModalPopup('dvLoading');
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
                cpCode = $("#hdnCPCode").val();
                cpName = $("#CP_No").val();
            }
            else if (cpNeed == "OPTIONAL") {
                if ($("#hdnCPCode").val() != "") {
                    cpCode = $("#hdnCPCode").val();
                    cpName = $("#CP_No").val();
                }
                else {
                    cpCode = $("#CP_No").val();
                    cpName = $("#CP_No").val();
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
        }
        else {
            if (intermediateNeed == "NO") {
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
            }

            else {
                intermediateData = fnReadIntermediateData();
                var travelKm = 0;
                for (var i = 1; i < interRow; i++) {
                    if ($("#txtFromPlace_" + i).val() != "") {
                        travelKm += parseInt($("#txtDistance_" + i).val());
                    }
                }

                if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
                    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                        if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
                            if ($("#trInterAuto") != null) {
                                travelKm += parseInt($("#lblDistance_Auto").html());
                            }
                        }
                    }
                }
                distance = travelKm.toString();
            }
        }

        if (flag_g.toUpperCase() != "A") {
            //get accompanist value
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
                            if (totalAcc < tpAccompanistArr.length)
                            {
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
                    for (var i = 0; i < $('#tblIntermediate tr').length; i++) {
                        if (i == 0) {
                            continue;
                        }
                        var fromPlaceTPDev = $('#txtFromPlace_' + i).val();
                        var toPlaceTPDev = $('#txtToPlace_' + i).val();
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
                            if (Header_g[1].Data[0].Data[0].Acc1_Name == $("#txtAccompanist_1").val() || Header_g[1].Data[0].Data[0].Acc1_Name == $("#txtAccompanist_2").val() || Header_g[1].Data[0].Data[0].Acc1_Name == $("#txtAccompanist_3").val() || Header_g[1].Data[0].Data[0].Acc1_Name == $("#txtAccompanist_4").val()) {
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
            url: '../HiDoctor_Activity/DCRHeader/InsertHeader',
            data: "dcrDate=" + dcrDate + "&dcrStatus=" + dcrStatus + "&cpCode=" + escape(cpCode) + "&cpName=" + escape(cpName) + "&workPlace=" + escape(workPlace) +
            "&fromPlace=" + escape(fromPlace) + "&toPlace=" + escape(toPlace) + "&travelMode=" + travelMode + "&distance=" + distance + "&startTime=" + startTime +
            "&endTime=" + endTime + "&distanceFareCode=" + distanceFareCode + "&routeWay=" + routeWay + "&acc1Name=" + acc1Name + "&acc1Type=" + acc1Type +
            "&acc1StartTime=" + escape(acc1StartTime) + "&acc1EndTime=" + escape(acc1EndTime) + "&acc1OnlyDoctor=" + acc1OnlyDoctor + "&acc2Name=" + acc2Name +
            "&acc2Type=" + acc2Type + "&acc2StartTime=" + escape(acc2StartTime) + "&acc2EndTime=" + escape(acc2EndTime) + "&acc2OnlyDoctor=" + acc2OnlyDoctor +
            "&acc3Name=" + acc3Name + "&acc3Time=" + escape(acc3Time) + "&acc3OnlyDoctor=" + acc3OnlyDoctor + "&acc4Name=" + acc4Name + "&acc4Time=" + escape(acc4Time) +
            "&acc4OnlyDoctor=" + acc4OnlyDoctor + "&intermediateData=" + escape(intermediateData) + "&isrcpa=" + isrcpa + "&category=" + escape(category) +
            "&categoryCode=" + entityCode + "&activityString=" + activityString + "&flag=" + flag_g + "&tpDeviation=" + tpDeviation + "&cpDeviation=" + cpDeviation + "&entryMode=WEB",
            success: function (isTrue) {
                if (isTrue.toUpperCase() == "TRUE") {
                    fnRedirectToDoctorVisit(isrcpa);
                }
                else {
                    HideModalPopup('dvLoading');
                    fnMsgAlert('info', 'DCR Header', 'Insertion Failed.');
                    //$.msgbox("Insertion Failed.", { type: "error" });
                    //fnMsgAlert('error', 'Error', 'Insertion Failed.');
                }
            }
        });
    }

    else {
        HideModalPopup('dvLoading');
    }
}


function fnRedirectToDoctorVisit(isrcpa) {

    //build the query strings needed for doctor visit.    
    var cpCode = "", tpCode = "", flagRCPA = "", accRegions = "", dcrActualDate = "", category = "", travelKm = "";

    dcrActualDate = dcrDate.split('-')[2] + '-' + dcrDate.split('-')[1] + '-' + dcrDate.split('-')[0];
    category = $("#ddlCategory :selected").text();
    //category = category.replace(' ', '_');

    // tp data exist oly when dcr is in applied mode.
    if (Header_g[1].Data[0] != "" && !(Header_g[1].Data[0] === undefined)) {
        if (!(Header_g[1].Data[0].Data[0] === undefined)) {
            tpCode = Header_g[1].Data[0].Data[0].Tp_Code;
        }
    }

    // get cpCode
    if ($("#hdnCPCode").val() != "") {
        cpCode = $("#hdnCPCode").val();
        //cpCode = cpCode.replace(' ', '_');
    }

    //check is rcpa.
    if (isrcpa == "Y") {
        flagRCPA = "R";
    }
    else {
        flagRCPA = "N";
    }

    // get accompanist region code
    for (var i = 1; i < accompRow; i++) {
        if ($("#txtAccompanist_" + i).val() != "") {
            accRegions += $("#hdnAccompanistCode_" + i).val() + '^';
        }
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
        if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
            if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
                if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
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

        $('#main').load('../HiDoctor_Activity/DCRStockiestExpense/Create/?dcrDate=' + dcrActualDate + '&dcrStatus=' + dcrStatus + '&entity=' + escape(category) + '&travelkm=' + travelKm + '&isRCPA=' + flagRCPA + "&accRegions=" + accRegions + "&flag=" + flag_g + "&actvity=" + escape(activityString.slice(0, -1)));
    }
    else {
        $('#main').load('../HiDoctor_Activity/DCRDoctorVisit/Create/?status=' + dcrStatus + '&flagRCPA=' + flagRCPA + '&accUsers=' + accRegions + '&cp=' + escape(cpCode) + '&tp=' + escape(tpCode) + '&dcrActualDate=' + dcrActualDate + '&category=' + escape(category) + '&travelledkms=' + travelKm + '&source=' + sourceString + "&flag=" + flag_g);
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
    $("#Start_Time").val("");
    $("#End_Time").val("");
    for (var i = 1; i < accompRow; i++) {
        $("#txtAccompanist_" + i).val("");
        fnRemoveErrorIndicatior("#txtAccompanist_" + i);

        $("#hdnAccompanistCode_" + i).val("");
        $("#chkOnlyDoctor_" + i).attr('checked', false);
        $("#txtStartTime_" + i).val("");
        $("#txtEndTime_" + i).val("");
    }
    fnCreateIntermediatePlaceTable("");

    //    for (var i = 1; i < interRow; i++) {
    //        $("#txtFromPlace_" + i).val("");
    //        fnRemoveErrorIndicatior("#txtFromPlace_" + i);

    //        $("#txtToPlace_" + i).val("");
    //        fnRemoveErrorIndicatior("#txtToPlace_" + i);

    //        $("#txtDistance_" + i).val("");
    //        fnRemoveErrorIndicatior("#txtDistance_" + i);

    //        $("#txtTravelMode_" + i).val("");
    //        fnRemoveErrorIndicatior("#txtTravelMode_" + i);

    //        $("#hdnDistanceFareCode_" + i).val("");
    //        $("#hdnRouteWay_" + i).val("");
    //        }

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
        url: '../HiDoctor_Activity/DCRHeader/GetAccompanistPopUpData',
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
            url: '../HiDoctor_Activity/DCRHeader/GetSFCData',
            data: "region=" + $("#hdnAccompanistCode_" + accId).val(),
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
    HideModalPopup('dvAccPopUp');
    $("#dvAccPopUp").hide();
}

function fnGetAccompanistSFC(id) {
    if ($(id).val() != "") {
        if (accompanistNeed == "YES") {
            var row = (id.id).split('_')[1];
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Activity/DCRHeader/GetSFCData',
                data: "region=" + $("#hdnAccompanistCode_" + row).val(),
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
    else {
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
            Header_g[0].Data[3].Data.remove("Region_Code", $("#hdnAccompanistCode_" + rw).val());
        }
    }
}