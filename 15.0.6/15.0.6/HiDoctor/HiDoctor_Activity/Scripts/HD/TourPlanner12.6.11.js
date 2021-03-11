//Global variables
var lstAccompanistsRegions = [];
var currentRegionDoc_g = "";
var userPrivilege_g = "";
var sfcJson_g = "";
var doctor_g = "";
var cpJson_g = "";
var accSFCJson_g = "";
var cpDetailsJSON_g = "";
var accomp = "";
var accompArr = new Array();
var productJson_g = "";
var tokendoctor_g = "";
var allsfc_g = "";
var doctorJSON_g = [{ id: 0 }];
var doctorProductJSON_g = [{ id: 0 }];
var eaccompanistName_g = "";
var eaccompanistRegions_g = "";
var leaveTypeCode = "";
var curdate_g = "";
var tpDaysJSON = "";
var activityCode_g = "";
var weekend = "";
var HiDoctorStartDate_g = ""
var jsData_g = "";
var shortmonthArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var cpAccompanistJson_g = [];
var UserCpcodes = "", AccomCpCodes = "";
var travelModeJson_g = "";
var AccompnistDoctor = [];
var TPAccMandatoryFlag = 0;
var selecteduserPrivilege = "";
var SFC_COUNTVALID_IN_TP = "SFC_MINCOUNTVALID_IN_TP"; // SFC_MINCOUNTVALID_IN_TP  SFC_COUNTVALID_IN_TP
var DOCTOR_CAPTION_DISPLAY_NAME = "DOCTOR_CAPTION_DISPLAY_NAME";
var DoctorLabel = "";
var privVisitCount;
var MinVisitCountDetail = "";
var IsMonthlyTPCompleted = false;
var batch_val = [];
var acoompanistData = "";
var outsideAccomapnist = [];
var workPlace_g = [];
var work_Area_g = [];
var workArea = "";
var ObjMoreInfo = {
    AccompanistInfo: "",
    CustomerInfo: "",
    FollowUpInfo: ""
}
var TPPrefillSchedule = [];
var accompanist_max_value = "";
$("#myInput").on("keyup", function () {
    debugger;
    var value = $(this).val().toLowerCase();
    var noRecord = true;
    //$("tblBatchInfo tr").filter(function () {
    $(".fnsearch tbody tr").filter(function () {
        debugger;
        length = $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        if (length && $(this).text().search(new RegExp(value, 'i')) < 0) {
            noRecord = true;
        } else {
            noRecord = false;
        }
    });
    if (noRecord)
        $('.norecords').html('No Results Found');
});


//$("a[href='#browseTab']").on('shown.bs.tab', function (e) {
//    fnBindSelectedDoctors();
//});
//function to call while the page load default load of session user code
function fnLoadSessionUser(userCod, userName) {
    //debugger;
    $("#dvJointAccompContent").hide();
    $("#dvtopAlert").hide();

    $("#spnDay").removeClass('spn-deep-Black');
    $("#spnWeek").removeClass('spn-deep-Black');
    $("#spnMonth").removeClass('spn-deep-Black');
    $("#spndashBoard").removeClass('spn-deep-Black');
    $("#spnMonth").addClass('spn-deep-Black');

    tokendoctor_g = "";
    $("#spnMonth").addClass('spn-deep-Black');
    $("#txtDoctor").prev().detach();
    $(".accompanist-input-token").prev().detach();

    //function to get all the user type privilege
    fnGetAllPrivileges(userCod);

    $("#hdnUserCode").val(userCod);
    $("#hdnUserName").val(userName);
    $("#spnName").html(userName);

    var year = $.datepicker.formatDate('yy', $("#dvDatePicker").datepicker('getDate'));
    var month = $.datepicker.formatDate('m', $("#dvDatePicker").datepicker('getDate'));
    fetchTPDays(year, month);
    $("#dvDatePicker").datepicker("refresh");

    $('#dvCalendar').fullCalendar('refetchEvents');
    $("#dvDashBoard").css('display', 'none');

    //unselect the selected date while change the user name 
    //$('#dvDatePicker').datepicker('setDate', null);

    $("#dvTPDate").html('');
    $("#dvBigDate").html('');
    $("#dvday").html('');

    //To get the session region code CP details 
    //  fnGetSelectedAccomCp($("#hdnRegionCode").val());
}


//function to call get the user information
function fnGetuserInfo(userCode) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetUserInfo',
        data: "UserCode=" + userCode + "",
        success: function (userInfo) {
            //Tour Planner
            priv = fnGetPrivilegeVal("TOUR_PLANNER", "NO");
            privArr = priv.split(',');

            if ($.inArray("YES", privArr) > -1) {
                $("#tblTP").hide();
                $('#dvCalendar').fullCalendar('refetchEvents');
                $("#dvCalendar").css('display', '');
                $("#dvAccessDenied").hide();
                $("#divLeft").show();
                $("#divHeader").show();
                fnShowTPExcelLink();
            }
            else {
                $("#tblTP").hide();
                $("#dvAccessDenied").show();
                $("#divHeader").hide();
                $("#spnUserName").html($("#hdnUserName").val());
                $("#divLeft").hide();
                $("#dvCalendar").hide();
                $("#dvTPExcelExport").hide();
                return;
            }

            userInfo = eval('(' + userInfo + ')');

            //function to call to enable SFC autofill
            $("#hdnRegionCode").val(userInfo.Tables[0].Rows[0].Region_Code);
            $("#hdnRegionName").val(userInfo.Tables[0].Rows[0].Region_Name);

            currentRegion = $("#hdnRegionCode").val();
            currRegionName = $("#hdnRegionName").val();

            //function to bind call objectives
            fnBindCallObjective();

            //Function to enable accompanist autofill
            debugger;
            fnAccompanistAutofill()

            //function to enable CP Autofill           
            fnCPDetails();

            //SFC HOP
            fnCreateSFCHOP(2);


            //to check the Tour planner & campaign planner privilegeis mapping to the user
            var priv = "";
            var privArr = new Array();

            priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
            privArr = priv.split(',');

            if ($.inArray("YES", privArr) > -1 || $.inArray("OPTIONAL", privArr) > -1) {
                $("#txtCPName").show();
                $("#tdCPName").show();
                $("#tdCPName").html('Beat / Patch Plan Name');
            }
            else {
                $("#txtCPName").hide();
                $("#tdCPName").hide();
            }
        },
        error: function (e) {
        }
    });
}

//function to bind call objectives
function fnBindCallObjective() {
    //debugger;
    var dcrEntry = "";
    var dcrEntryArr = new Array();

    dcrEntry = fnGetPrivilegeVal("TP_ENTRY_OPTIONS", "FIELD_RCPA,ATTENDANCE,LEAVE");
    dcrEntryArr = dcrEntry.split(',');

    for (var i = 0; i < dcrEntryArr.length; i++) {
        //To remove all the options
        var select = $('#drpCallObj');
        $('option', select).remove();
        for (var j = 0; j < dcrEntryArr.length; j++) {
            $('#drpCallObj').append("<option value='" + dcrEntryArr[j].toString().toUpperCase() + "'>" + dcrEntryArr[j].toString().toUpperCase() + "</option>");
        }
    }
}
//function to call when call objective is changed
function fnCallObjChange() {
    //debugger;
    if ($("#drpCallObj").val().toUpperCase() == "ATTENDANCE") {
        accSFCJson_g = "";
        fnIncludeCurrentSFC($("#hdnRegionCode").val(), $("#drpCallObj").val().toUpperCase());
        $("#drpCategory").val('0');
        fnCategoryChange();
        $("#txtCPName").hide();
        $("#tdCPName").html('Activity Name');
        $("#drpActivity").show();
        $("#drpLeaveTypes").hide();

        $("#trAccompanist").hide();

        $("#trDoctor").hide();
        $("#trhr1").hide();

        $("#tdCPName").show();
        $("#trCategory").show();
        $("#trWorkPlace").show();
        $("#trFTPlace").show();

        //Meeting Time and meeting Place Control hide
        $("#trMeetingPoint").hide();
        $("#trMeetingTime").hide();
        fnActivity();
    }
    else if ($("#drpCallObj").val().toUpperCase() == "FIELD" || $("#drpCallObj").val().toUpperCase() == "FIELD_RCPA") {
        $("#trAccompanist").show();
        $("#trDoctor").show();
        $("#trhr1").show();

        $("#trCategory").show();
        $("#trWorkPlace").show();
        $("#trFTPlace").show();
        $("#drpLeaveTypes").hide();


        //Meeting Time and meeting Place Control Show
        $("#trMeetingPoint").show();
        $("#trMeetingTime").show();

        var priv = "";
        var privArr = new Array();
        priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
        privArr = priv.split(',');
        if ($.inArray("YES", privArr) > -1 || $.inArray("OPTIONAL", privArr) > -1) {
            $("#txtCPName").show();
            $("#tdCPName").show();
            $("#tdCPName").html('Beat / Patch Plan Name');
            $("#drpActivity").hide();
        }
        else {
            $("#txtCPName").hide();
            $("#tdCPName").hide();
            $("#drpActivity").hide();
        }
        accSFCJson_g = "";
        fnIncludeCurrentSFC($("#hdnRegionCode").val(), $("#drpCallObj").val().toUpperCase());
        //fnIncludeAccompanistSFC($("#hdnRegionCode").val());
        //for (var r = 0; r < accRegions.length; r++) {
        //    fnIncludeAccompanistSFC(accRegions[r].id);
        //}

        $("#drpCategory").val('0');
        fnCategoryChange();
        $("#txtMeetingPoint").val('');
        $("#txtMeetingTime").val('');
        $("#trCategory").val('');
        $("#txtCPName").val('');


    }
    else if ($("#drpCallObj").val().toUpperCase() == "LEAVE") {
        // here
        var date = parseInt($("#txtTpDate").val().split('/')[0]);
        var month = parseInt($("#txtTpDate").val().split('/')[1]);
        var year = parseInt($("#txtTpDate").val().split('/')[2]);

        var sundayObj = jsonPath(weekend, "$.Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='S' & @.Type=='S')]");
        if (sundayObj != false && sundayObj != undefined) {
            if (sundayObj.length > 0) {
                fnMsgAlert('info', 'Tour Planner', 'You cannot plan Leave on weekend.');
                $("#drpCallObj").val("");
                return false;
            }
        }

        $("#txtCPName").hide();
        $("#drpActivity").hide();

        $("#tdCPName").show();
        $("#tdCPName").html('Leave Type')
        $("#drpLeaveTypes").show();

        $("#trAccompanist").hide();
        $("#trDoctor").hide();
        $("#trhr1").hide();

        $("#trCategory").hide();
        $("#trWorkPlace").hide();
        $("#trFTPlace").hide();

        //Meeting Time and meeting Place Control hide
        $("#trMeetingPoint").hide();
        $("#trMeetingTime").hide();

        fnBindLeaveType()

    }
}
//function to get the Activity
function fnActivity() {
    //debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetActivity',
        data: "UserCode=" + $("#hdnUserCode").val() + "",
        success: function (jsData) {
            if (jsData.length > 0) {
                jsData = eval('(' + jsData + ')');
                //To remove all the options
                var select = $('#drpActivity');
                $('option', select).remove();
                for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                    $('#drpActivity').append("<option value='" + jsData.Tables[0].Rows[j].Activity_Code + "_" + jsData.Tables[0].Rows[j].Project_Code + "'>" + jsData.Tables[0].Rows[j].Activity_Name + "</option>");
                }
                if (activityCode_g != "") {
                    $("#drpActivity").val(activityCode_g);
                }
            }
            else {
                fnMsgAlert('info', 'Tour Planner', 'Activity has not mapped,Please contact the system admin to map activity');
                return false;
            }
        }
    });
}

//function to bind the leave type to drop down when we pick the LEAVE from call objective
function fnBindLeaveType() {
    //debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetLeaveTypes',
        data: "UserCode=" + $("#hdnUserCode").val() + "&tpDate=" + $("#hdnTPDate").val() + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            //To remove all the options
            var select = $('#drpLeaveTypes');
            $('option', select).remove();
            $('#drpLeaveTypes').append("<option value='0'>- Select Leave Type -</option>");
            for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                $('#drpLeaveTypes').append("<option value='" + jsData.Tables[0].Rows[j].Leave_Type_Code + "'>" + jsData.Tables[0].Rows[j].Leave_Type_Name + "</option>");
            }
            $('#drpLeaveTypes').attr('selectedIndex', 0);

            if (leaveTypeCode != "") {
                $('#drpLeaveTypes').val(leaveTypeCode);
            }
        }
    });
}

//$("input[id$=token-input-txtAccompaninst]").onDelete(function () {
//    $("#txtDoctor").tokenInput('clear');
//});

var Show_outside_accompanist_privilege = "";

//Function is to enable accompanist autofill
function fnAccompanistAutofill() {
    debugger;
    var userCode = "";
    $("#outsideAccompanist").hide();
    Show_outside_accompanist_privilege = fnGetPrivilegeVal("ALLOW_OTHER_HIERARCHY_IN_ACCOMPANIST_IN_APP", "NO");
    if (Show_outside_accompanist_privilege == "YES") {
        $("#outsideAccompanist").show();
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetAccompanistDetails',
        data: "RegionCode=" + $("#hdnRegionCode").val() + "&User_Code=" + $("#hdnUserCode").val() + "&TP_Date=" + $("#hdnTPDate").val(),
        success: function (jsData) {
            debugger;
            jsData = eval('(' + jsData + ')');
            acoompanistData = jsData;
            var content = "";
            var data = "";
            var data1 = new Array();
            //debugger;
            content = "[";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "{id:\"" + jsData.Tables[0].Rows[i].Region_Code + "\",name:\"" + jsData.Tables[0].Rows[i].User_Name + "\",value:\"" + jsData.Tables[0].Rows[i].User_Code + "\"},";
            }
            content = content.slice(0, -1) + "]";
            if (jsData.Tables[0].Rows.length == 0) {
                content = "[]";
            }
            data1 = eval('(' + content + ')');

            //to enable tag type input control
            $(".accompanist-input-token").tokenInput(
            [data1], {
                preventDuplicates: true, tokenLimit: 4, theme: "facebook", onAdd: function (item) {
                    fnAccompanistAdd(item.id);
                    userCode = item.value;
                    //$('#hdnAccomp').val( $('#hdnAccomp').val()+","+item.value);
                    $('#hdnAccomp').val(userCode + "," + $('#hdnAccomp').val());
                    userCode = "";
                    // fnGetSelectedAccomCp(item.id);
                    //                //function to add accompanist SFC
                    //                accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
                    //                accompArr = accomp.split(',');

                    //                if ($.inArray("SFC", accompArr) > -1) {
                    //                    fnIncludeAccompanistSFC(item.id);
                    //                }
                },
                onDelete: function (item) {
                    //function to remove accompanist SFC
                    if (accSFCJson_g != "") {
                        accSFCJson_g.remove("Region_Code", item.id);
                    }
                    // function to remove accompanist CP
                    //function to add accompanist CP
                    accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
                    accompArr = accomp.split(',');

                    if ($.inArray("CP", accompArr) > -1) {
                        fnIncludeAccompanistCP();
                    }

                    fnEnableSFCAutocomplete();
                    //Function to re initialize doctor autofill
                    accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
                    accompArr = accomp.split(',');
                    if ($.inArray("DOCTOR", accompArr) > -1) {
                        tokendoctor_g = $("#txtDoctor").tokenInput('get');
                        $("#txtDoctor").prev().detach();
                        fnDoctorAutofill();
                        fnBindSelectedDoctors();
                        // fnGetWorkAreas(regionCode);
                        //fnCPDetails();
                    }
                    //debugger;
                    fnClearAccompanistDetails();
                    fngetBatchInformation();
                },
                Blur: function (item) {
                },
                onLostFocus: function (item) {
                },
            }

        );
            fnDoctorAutofill();
            fnGetSFCAutoFillData();
            fnBindSelectedDoctors();
            fnGetWorkAreas(currentRegion);
        }
    });
}

$(".accompanist-input-token").tokenInput
({
    Blur: function (event) { console.log("left for gooooood"); }
});

//$(".accompanist-input-token").blur(function () {

//    //debugger;
//    $.ajax({
//        type: "POST",
//        url: '../HiDoctor_Activity/TourPlanner/GetTPAccompPopUpData',
//        data: "&User_Code=" + $('#hdnAccomp').val() + "&TP_Date=" + $("#hdnTPDate").val(),
//        success: function (jsData) {
//            //debugger;
//            var result = jsData.split('-');
//            $('#dvAccompData').html(result[0]);
//            $('#dvAccompData').append("<br/><input type='button' style='margin-left: 165px;' id='btnSelect' value='Submit' onclick='fnAccompDataPrefill()'/>&nbsp &nbsp <input type='button'value='Cancel' id='btnCancel' onclick='fnAccompClose()'/>");
//            $("#dvAccomppopup").overlay().load();
//            var temp = eval(result[1]);
//            AccompnistDoctor = result[1];
//        }
//    });
//});

//$('#txtMeetingPoint').focus(function () {
//    if ($(".accompanist-input-token").val() != "")
//    {
//        var usercode = "";

//        var acc = $(".accompanist-input-token").tokenInput('get');

//        for (var i = 0; i < acc.length; i++) {
//            usercode = usercode + "," + acc[i].value;
//        }
//        usercode=usercode.replace(',', '');
//        //debugger;
//        $.ajax({
//            type: "POST",
//            url: '../HiDoctor_Activity/TourPlanner/GetTPAccompPopUpData',
//            data: "&User_Code=" + usercode + "&TP_Date=" + $("#hdnTPDate").val() + "&Tp_UserCode=" + $('#hdnUserCode').val(),
//            success: function (jsData) {
//                //debugger;
//                var result = jsData;
//                $('#dvAccompData').html(jsData);
//                if ($('#tblAccompData tr').length > 1) {
//                    $('#dvAccompData').append("<br/><input type='button' style='margin-left: 165px;' id='btnSelect' value='Submit' onclick='fnAccompDataPrefill()'/>&nbsp &nbsp <input type='button'value='Cancel' id='btnCancel' onclick='fnAccompClose()'/>");
//                    $("#dvAccomppopup").overlay().load();
//                }

//                var temp = eval(result[1]);
//            }
//        });
//    }
//});




function fnGetAccompanistDetails() {
    debugger;
    if ($(".accompanist-input-token").val() != "") {
        var usercode = "";

        var acc = $(".accompanist-input-token").tokenInput('get');
        var AccRegionCode = "";


        for (var i = 0; i < acc.length; i++) {
            usercode = usercode + "," + acc[i].value;
            AccRegionCode = AccRegionCode + "," + acc[i].id;
        }
        usercode = usercode.replace(',', '');
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/TourPlanner/GetTPAccompPopUpData',
            data: "&User_Code=" + usercode + "&TP_Date=" + $("#hdnTPDate").val() + "&Tp_UserCode=" + $('#hdnUserCode').val() + "&AccRegionCodes=" + AccRegionCode,
            success: function (jsData) {
                debugger;
                if (jsData.trim() == "Accompanist cannot be selected,since privilege is not mapped") {
                    fnMsgAlert('info', 'Tour Planner', 'Accompanist details cannot be selected,since "SHOW_ACCOMPANISTS_DATA" privilege is not mapped');
                    return false;
                }

                //debugger;
                if (jsData != "False") {
                    var result = jsData;
                    $('#dvAccompData').html(jsData);
                    if ($('#tblAccompData tr').length > 1) {
                        //debugger;
                        $('#dvAccompData').append("<br/><input type='button' style='margin-left: 252px;' id='btnSelect' value='Select' onclick='fnAccompDataPrefill()'/>&nbsp &nbsp <input type='button'value='Cancel' id='btnCancel' onclick='fnAccompClose()'/>");
                        $("#dvAccomppopup").overlay().load();
                    }
                    else {
                        fnMsgAlert('info', 'Tour Planner', 'No Accompanist details found');
                        return false;

                    }
                    var temp = eval(result[1]);
                    $("[name='spnDoctorLabel']").html(DoctorLabel);
                }
                else {
                    fnMsgAlert('info', 'Tour Planner', 'No Accompanist details found');

                    return false;

                }
            }
        });
    }
}


function fnAccompClose() {
    $('#dvAccomppopup').overlay().close();
}

function fnAccompDataPrefill() {
    debugger;
    //  workPlace_g = [];
    // $("#txtWorkPlace").tokenInput('clear');
    var tablLength = $('#tblAccompData tr').length;
    var category = "";
    var col1 = $('input[name=holidayList]:checked').parent().parent().children()[1].innerHTML;
    var col2 = $('input[name=holidayList]:checked').parent().parent().children()[2].innerHTML;
    var col3 = $('input[name=holidayList]:checked').parent().parent().children()[3].innerHTML;
    var col4 = $('input[name=holidayList]:checked').parent().parent().children()[4].innerHTML;
    var col5 = $('input[name=holidayList]:checked').parent().parent().children()[5].innerHTML;
    var col6 = $('input[name=holidayList]:checked').parent().parent().children()[6].innerHTML;
    var col8 = $('input[name=holidayList]:checked').parent().parent().find("#hdnTPPlannedDoct").val();
    category = $("td input[name='holidayList']:checked").parent().parent().find("#hdnCategory").val();
    var CPCode = $("td input[name='holidayList']:checked").parent().parent().find("#hdnAccCP").val();
    var CPName = $("td input[name='holidayList']:checked").parent().parent().find("#hdnAccCPName").val();
    var SelectedAcc = $("td input[name='holidayList']:checked").parent().parent().find("#hdnSelectedAcc").val();

    $("#txtCPName").val(CPName);
    $("#hdnCPCode").val(CPCode);
    $('#drpCategory').val(category);
    //  $('#txtWorkPlace').val(col6);
    fnGetWorkAreas(currentRegion);
    $("#txtWorkPlace").tokenInput("add", { id: col6, name: col6 });
    var tempSFCDetails = jsonPath(cpDetailsJSON_g, "$.Tables[1].Rows[?(@.CP_Code=='" + $("#hdnCPCode").val() + "')]");
    //filter the value from main array
    var hopdetails = new Array();
    if (tempSFCDetails != null && tempSFCDetails != undefined && tempSFCDetails != false) {
        {
            for (var i = 0; i < tempSFCDetails.length; i++) {
                var tempSFC = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + tempSFCDetails[i].From_Place
                                                                + "'  & @.To_Place == '" + tempSFCDetails[i].To_Place
                                                                + "'  & @.Travel_Mode == '" + tempSFCDetails[i].Travel_Mode
                                                                + "'  & @.SFC_Category_Name == '" + tempSFCDetails[i].SFC_Category_Name
                                                                + "'  & @.Distance_Fare_Code == '" + tempSFCDetails[i].Distance_Fare_Code + "')| (@.From_Place=='" + tempSFCDetails[i].To_Place
                                                                + "'  & @.To_Place == '" + tempSFCDetails[i].From_Place
                                                                + "'  & @.Travel_Mode == '" + tempSFCDetails[i].Travel_Mode
                                                                + "'  & @.SFC_Category_Name == '" + tempSFCDetails[i].SFC_Category_Name
                                                                + "'  & @.Distance_Fare_Code == '" + tempSFCDetails[i].Distance_Fare_Code + "'))]");
                if (tempSFC && tempSFC.length > 0) {
                    //Get Distance amount for.00 problem
                    hopdetails[i] = tempSFCDetails[i];
                    hopdetails[i].Distance = tempSFC[0].Distance;
                    hopdetails[i].SFC_Version_No = tempSFC[0].SFC_Version_No;
                }
                else {
                    //SFC Experiod -- Fill the from and top lace
                    hopdetails[i] = tempSFCDetails[i];
                }
            }
        }

    }

    if (hopdetails != null && hopdetails && hopdetails != undefined && hopdetails.length > 0) {
        var count = hopdetails.length + 1;
        fnCreateSFCHOP(count);
    }
    else {
        fnCreateSFCHOP(2);
    }
    var tpInter = "";
    var tpInterArr = new Array();


    tpInter = fnGetPrivilegeVal("INTERMEDIATE_PLACES", "");
    tpInterArr = tpInter.split(',');

    if ($.inArray($('#drpCategory :selected').text().toUpperCase(), tpInterArr) > -1) {
        debugger;
        for (var k = 0; k < hopdetails.length; k++) {
            if (hopdetails.length > 0) {
                if (hopdetails[k].Route_Way == null || hopdetails[k].Route_Way == "D") {
                    $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                    $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);

                }
                else if (hopdetails[k].Route_Way == "R") {
                    $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);
                    $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                }

                $("#txtTravelMode_" + (k + 1) + "").val(hopdetails[k].Travel_Mode);

                $("#hdnDistance_" + (k + 1)).val(hopdetails[k].Distance);
                $("#hdnFare_" + (k + 1)).val(hopdetails[k].Fare_Amount);
                $("#hdnDistanceFareCode_" + (k + 1)).val(hopdetails[k].Distance_Fare_Code);
                $("#hdnSFCRegion_" + (k + 1)).val(hopdetails[k].SFC_Region_Code);
                $("#hdnSFCVersion_" + (k + 1)).val(hopdetails[k].SFC_Version_No);
                $("#hdnSFCCategory_" + (k + 1)).val(hopdetails[k].SFC_Category_Name);
                $("#hdnSFCVisitCount_" + (k + 1)).val(hopdetails[k].SFC_Visit_Count);
            }
        }
    }
    else {
        for (var k = 0; k < 1; k++) {
            debugger;
            if (hopdetails.length > 0) {
                if (hopdetails[k].Route_Way == null || hopdetails[k].Route_Way == "D") {
                    $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                    $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);

                }
                else if (hopdetails[k].Route_Way == "R") {
                    $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);
                    $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                }

                $("#txtTravelMode_" + (k + 1) + "").val(hopdetails[k].Travel_Mode);

                $("#hdnDistance_" + (k + 1)).val(hopdetails[k].Distance);
                $("#hdnFare_" + (k + 1)).val(hopdetails[k].Fare_Amount);
                $("#hdnDistanceFareCode_" + (k + 1)).val(hopdetails[k].Distance_Fare_Code);
                $("#hdnSFCRegion_" + (k + 1)).val(hopdetails[k].SFC_Region_Code);
                $("#hdnSFCVersion_" + (k + 1)).val(hopdetails[k].SFC_Version_No);
                $("#hdnSFCCategory_" + (k + 1)).val(hopdetails[k].SFC_Category_Name);
                $("#hdnSFCVisitCount_" + (k + 1)).val(hopdetails[k].SFC_Visit_Count);
            }
        }
    }

    $('#dvAccomppopup').overlay().close();
    var usercode = "";
    var AccregionCodes = "";
    var acc = $(".accompanist-input-token").tokenInput('get');

    for (var i = 0; i < acc.length; i++) {
        usercode = usercode + "," + acc[i].value;
        AccregionCodes = AccregionCodes + "," + acc[i].id
    }
    usercode = usercode.replace(',', '');
    if (col8 != "" && col8 != undefined) {
        //debugger;
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/TourPlanner/GetTPDoctorDetails',
            async: false,
            data: "&userCode=" + usercode + "&tpDate=" + $("#hdnTPDate").val() + "&tpUserCode=" + $('#hdnUserCode').val() + "&AccregionCodes=" + AccregionCodes,
            success: function (jsData) {
                debugger;
                $("#txtDoctor").tokenInput('clear');
                for (var i = 0; i < jsData.length; i++) {
                    //debugger;
                    if (jsData[i].UserCode == SelectedAcc) {
                        //debugger;
                        //$("#txtDoctor").tokenInput("add", { id: docDetails[0].Customer_Code + "_" + docDetails[0].Region_Code, name: doctorName });
                        $("#txtDoctor").tokenInput("add", { id: jsData[i].Doctor_Code + "_" + jsData[i].Region_Code, name: jsData[i].Doctor_Name + "_" + jsData[i].MDL_Number + "_" + jsData[i].RegionName });
                    }
                }
            }

        });
    }
}

//function calling when accompanist add
function fnAccompanistAdd(regionCode, userCode) {
    debugger;

    var acc = $(".accompanist-input-token").tokenInput('get');
    var accArr = new Array();
    for (var ac = 0; ac < acc.length; ac++) {
        if ($.inArray(acc[ac].name, accArr) == -1) {
            accArr.push(acc[ac].name);
        }
        else {
            fnMsgAlert('error', 'Error', 'Accompanist name already exist');
            return false;
        }
    }

    accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    accompArr = accomp.split(',');

    //if ($("#txtDoctor").val() == "") {
    if ($.inArray("DOCTOR", accompArr) > -1) {
        tokendoctor_g = $("#txtDoctor").tokenInput('get');

        $("#txtDoctor").prev().detach();
        fnDoctorAutofill();
    }
    //}

    //function to add accompanist SFC
    accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    accompArr = accomp.split(',');

    if ($.inArray("SFC", accompArr) > -1) {
        fnIncludeAccompanistSFC(regionCode);
    }

    //function to add accompanist CP
    accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    accompArr = accomp.split(',');

    if ($.inArray("CP", accompArr) > -1) {
        fnIncludeAccompanistCP();
        fnBindCPReference();
    }
    var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");
    if (batchPrivellage == 'YES') {
        fngetBatchInformation();
    }
}

//function to enable CP AutoFill
function fnCPDetails() {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetCPDetails',
        data: "UserCode=" + $("#hdnUserCode").val() + "&RegionCode=" + $("#hdnRegionCode").val() + "&AccompanistName=" + eaccompanistName_g + "&AccompanistRegion=" + eaccompanistRegions_g + "&tpDate=" + $("#hdnTPDate").val(),
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            cpDetailsJSON_g = jsData;

            var cp = "[";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                UserCpcodes += jsData.Tables[0].Rows[i].CP_Code;
                cp += "{label:" + '"' + "" + jsData.Tables[0].Rows[i].CP_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[0].Rows[i].CP_Code + "" + '"' + "}";
                if (i < jsData.Tables[0].Rows.length - 1) {
                    cp += ",";
                }
            }
            cp += "];";
            var cpJson = eval(cp);
            cpJson_g = cpJson;
            $("#txtCPName").unautocomplete();
            $("#txtCPName").blur(function () { fnGetCPDoctors(this); });
            autoComplete(cpJson, "txtCPName", "hdnCPCode", "cpauto");
            fnBindCPReference();
        }
    });
}

//Function to bind Category
function fnBindCategory() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetCategory',
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            //To remove all the options
            var select = $('#drpCategory');
            $('option', select).remove();

            $('#drpCategory').append("<option value='0'>-Select Category-</option>");
            for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                $('#drpCategory').append("<option value='" + jsData.Tables[0].Rows[j].Expense_Entity_Code + "'>" + jsData.Tables[0].Rows[j].Expense_Entity_Name + "</option>");
            }
        }
    });
}
//function when call category is changed
function fnCategoryChange() {
    fnCreateSFCHOP(2);  //function to clear and create default one row for SFC HOP
    workPlace_g = [];
    //$("#txtWorkPlace").tokenInput('clear');
    fnEnableSFCAutocomplete();
    $("#txtWorkPlace").val('');
    fnGetWorkAreas(currentRegion)
}
//function to bind the travelmodes
function fnGetTravelModes() {
    $.ajax({
        type: 'POST',
        url: '../SFCRegion/GetTravelModes',
        success: function (response) {
            travelMode_g = "";
            for (var i = 0; i < response.length; i++) {
                var travelMode = "[";
                for (var i = 0; i < response.length; i++) {
                    travelMode += "{label:" + '"' + "" + response[i].TravelMode_Name + "" + '",' + "value:" + '"' + "" + response[i].TravelMode_Name + "" + '"' + "},";
                }
                travelMode += "];";
                travelModeJson_g = eval(travelMode);
                $('.travelModeauto').unautocomplete();
                autoComplete(travelModeJson_g, "txtTravelMode", "", 'travelModeauto');
            }
        },
        error: function (e) {
            travelModeArr.clear();
        }
    });
}
//Functioon validate the travle mode
function fnValidateTravelMode(obj) {
    var travelmodeId = obj.id;
    var travelmode = $.trim($('#' + travelmodeId).val());
    if (travelmode != "") {
        var result = jsonPath(travelModeJson_g, "$.[?(@.value == '" + travelmode + "')]");
        if (!result) {
            fnMsgAlert('info', 'Tour Planner', 'Please Enter the Valid Travel Mode.');
            return false;
        }
    }
    return true;
}

//function to include CP doctos
function fnGetCPDoctors(obj) {
    debugger;
    fnValidateAutofill(obj, cpJson_g, "txtCPName", "hdnCPCode");
    $("#txtDoctor").tokenInput('clear') //for clear all the doctors when cp name is changed
    doctorProductJSON_g = [{ id: 0 }]; //for clear the doctor product mapping details

    tokendoctor_g = $("#txtDoctor").tokenInput('get');
    $("#txtDoctor").prev().detach();
    //debugger;
    //if($("#txtDoctor").val()=="")
    //    {
    fnDoctorAutofill();
    //}

    if ($("#hdnCPCode").val() != "") {
        if ($("#hdnCPCode").val() == "") {
            $("#spnCPError").html('Please enter valid CP');
            return false;
        }
        else {
            $("#spnCPError").html('');
        }
    }
    else {
        $("#spnCPError").html('');
        $("#txtWorkPlace").tokenInput('clear');
    }

    //Bind Work Place From Place & To Place
    var cpdetails = jsonPath(cpDetailsJSON_g, "$.Tables[0].Rows[?(@.CP_Code=='" + $("#hdnCPCode").val() + "')]");

    var placeFrom = "";
    var placeTo = "";
    var categoryCode = "";
    var categoryName = "";

    $("#txtWorkPlace").val('');
    // $("#txtWorkPlace").tokenInput('clear');
    $("#drpCategory").val(0);

    if (!(cpdetails == undefined) && cpdetails != null && cpdetails != false) {
        debugger;
        workArea = cpdetails[0].Work_Area;
        placeFrom = cpdetails[0].Place_From;
        placeTo = cpdetails[0].Place_To;
        categoryCode = cpdetails[0].Category_Code;
        categoryName = cpdetails[0].Expense_Entity_Name;
        route_Way = cpdetails[0].Route_Way;
        //Bind Work Place,category
        //s$("#txtWorkPlace").val(workArea);

        $("#drpCategory").val(categoryCode);
        fnGetWorkAreas(currentRegion);
        $("#txtWorkPlace").tokenInput("add", { id: workArea, name: workArea });
    }


    //Bind From place and to place
    if ($.trim(placeFrom) == "") {
        //get the value from cp sfc
        var tempSFCDetails = jsonPath(cpDetailsJSON_g, "$.Tables[1].Rows[?(@.CP_Code=='" + $("#hdnCPCode").val() + "')]");
        //filter the value from main array
        var hopdetails = new Array();
        if (tempSFCDetails != null && tempSFCDetails != undefined && tempSFCDetails != false) {
            {
                for (var i = 0; i < tempSFCDetails.length; i++) {
                    var tempSFC = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + tempSFCDetails[i].From_Place
                                                                    + "'  & @.To_Place == '" + tempSFCDetails[i].To_Place
                                                                    + "'  & @.Travel_Mode == '" + tempSFCDetails[i].Travel_Mode
                                                                    + "'  & @.SFC_Category_Name == '" + tempSFCDetails[i].SFC_Category_Name
                                                                    + "'  & @.Distance_Fare_Code == '" + tempSFCDetails[i].Distance_Fare_Code + "')| (@.From_Place=='" + tempSFCDetails[i].To_Place
                                                                    + "'  & @.To_Place == '" + tempSFCDetails[i].From_Place
                                                                    + "'  & @.Travel_Mode == '" + tempSFCDetails[i].Travel_Mode
                                                                    + "'  & @.SFC_Category_Name == '" + tempSFCDetails[i].SFC_Category_Name
                                                                    + "'  & @.Distance_Fare_Code == '" + tempSFCDetails[i].Distance_Fare_Code + "'))]");
                    if (tempSFC && tempSFC.length > 0) {
                        //Get Distance amount for.00 problem
                        hopdetails[i] = tempSFCDetails[i];
                        hopdetails[i].Distance = tempSFC[0].Distance;
                        hopdetails[i].SFC_Version_No = tempSFC[0].SFC_Version_No;
                    }
                    else {
                        //SFC Experiod -- Fill the from and top lace
                        hopdetails[i] = tempSFCDetails[i];
                    }
                }
            }

        }

        if (hopdetails != null && hopdetails && hopdetails != undefined) {
            var count = hopdetails.length + 1;
            fnCreateSFCHOP(count);
        }
        else {
            fnCreateSFCHOP(2);
        }
        var tpInter = "";
        var tpInterArr = new Array();


        tpInter = fnGetPrivilegeVal("INTERMEDIATE_PLACES", "");
        tpInterArr = tpInter.split(',');

        if ($.inArray($('#drpCategory :selected').text().toUpperCase(), tpInterArr) > -1) {
            for (var k = 0; k < hopdetails.length; k++) {
                if (hopdetails.length > 0) {
                    if (hopdetails[k].Route_Way == null || hopdetails[k].Route_Way == "D") {
                        $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                        $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);

                    }
                    else if (hopdetails[k].Route_Way == "R") {
                        $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);
                        $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                    }

                    $("#txtTravelMode_" + (k + 1) + "").val(hopdetails[k].Travel_Mode);

                    $("#hdnDistance_" + (k + 1)).val(hopdetails[k].Distance);
                    $("#hdnFare_" + (k + 1)).val(hopdetails[k].Fare_Amount);
                    $("#hdnDistanceFareCode_" + (k + 1)).val(hopdetails[k].Distance_Fare_Code);
                    $("#hdnSFCRegion_" + (k + 1)).val(hopdetails[k].SFC_Region_Code);
                    $("#hdnSFCVersion_" + (k + 1)).val(hopdetails[k].SFC_Version_No);
                    $("#hdnSFCCategory_" + (k + 1)).val(hopdetails[k].SFC_Category_Name);
                    $("#hdnSFCVisitCount_" + (k + 1)).val(hopdetails[k].SFC_Visit_Count);
                }
            }
        }
        else {
            for (var k = 0; k < 1; k++) {
                debugger;
                if (hopdetails.length > 0) {
                    if (hopdetails[k].Route_Way == null || hopdetails[k].Route_Way == "D") {
                        $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                        $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);

                    }
                    else if (hopdetails[k].Route_Way == "R") {
                        $("#txtFormPlace_" + (k + 1) + "").val(hopdetails[k].To_Place);
                        $("#txtToPlace_" + (k + 1) + "").val(hopdetails[k].From_Place);
                    }

                    $("#txtTravelMode_" + (k + 1) + "").val(hopdetails[k].Travel_Mode);

                    $("#hdnDistance_" + (k + 1)).val(hopdetails[k].Distance);
                    $("#hdnFare_" + (k + 1)).val(hopdetails[k].Fare_Amount);
                    $("#hdnDistanceFareCode_" + (k + 1)).val(hopdetails[k].Distance_Fare_Code);
                    $("#hdnSFCRegion_" + (k + 1)).val(hopdetails[k].SFC_Region_Code);
                    $("#hdnSFCVersion_" + (k + 1)).val(hopdetails[k].SFC_Version_No);
                    $("#hdnSFCCategory_" + (k + 1)).val(hopdetails[k].SFC_Category_Name);
                    $("#hdnSFCVisitCount_" + (k + 1)).val(hopdetails[k].SFC_Visit_Count);
                }
            }
        }

        if ($.trim(workArea) == "") {
            if (hopdetails != false && hopdetails != undefined) {
                workArea = hopdetails[0].Work_Place;
            }
            $("#txtWorkPlace").val(workArea);
        }
    }
    else {
        //CP master sfc
        fnCreateSFCHOP(2);
        if (route_Way == "R") {
            $("#txtFormPlace_1").val(placeTo);
            $("#txtToPlace_1").val(placeFrom);
        }
        else {
            $("#txtFormPlace_1").val(placeFrom);
            $("#txtToPlace_1").val(placeTo);
        }

        if (!(cpdetails == undefined) && cpdetails != null && cpdetails != false) {
            var sfc_details = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + cpdetails[0].Place_From
                                                 + "'  & @.To_Place == '" + cpdetails[0].Place_To
                                                 + "'  & @.Travel_Mode == '" + cpdetails[0].Travel_Mode
                                                 + "'  & @.SFC_Category_Name == '" + cpdetails[0].SFC_Category_Name
                                                 + "'  & @.Distance_Fare_Code == '" + cpdetails[0].Distance_Fare_Code
                                                 + "'  & @.SFC_Version_No == '" + cpdetails[0].SFC_Version_No + "'))]");
            if (sfc_details != null > 0 && sfc_details != false) {
                $("#txtTravelMode_1").val(sfc_details[0].Travel_Mode);
                $("#hdnDistance_1").val(sfc_details[0].Distance);
                $("#hdnFare_1").val(sfc_details[0].Fare_Amount);
                $("#hdnDistanceFareCode_1").val(sfc_details[0].Distance_Fare_Code);
                $("#hdnSFCRegion_1").val(sfc_details[0].SFC_Region_Code);
                $("#hdnSFCVersion_1").val(sfc_details[0].SFC_Version_No);
                $("#hdnSFCCategory_1").val(sfc_details[0].SFC_Category_Name);
                $("#hdnSFCVisitCount_1").val(sfc_details[0].SFC_Visit_Count);
            }
            else {
                $("#txtTravelMode_1").val("");
                $("#hdnDistance_1").val("0");
                $("#hdnFare_1").val("0");
                $("#hdnDistanceFareCode_1").val("");
                $("#hdnSFCRegion_1").val(currentRegion);
                $("#hdnSFCVersion_1").val("");
                $("#hdnSFCCategory_1").val($("#drpCategory :selected").text().toUpperCase());
                $("#hdnSFCVisitCount_1").val("0");
            }
        }
        else {
            $("#txtTravelMode_1").val("");
            $("#hdnDistance_1").val("0");
            $("#hdnFare_1").val("0");
            $("#hdnDistanceFareCode_1").val("");
            $("#hdnSFCRegion_1").val(currentRegion);
            $("#hdnSFCVersion_1").val("");
            $("#hdnSFCCategory_1").val($("#drpCategory :selected").text().toUpperCase());
            $("#hdnSFCVisitCount_1").val("0");
        }
    }
    //to enable SFC autofill
    fnEnableSFCAutocomplete();

    $("#txtWorkPlace").attr('disabled', false);
    $("#drpCategory").attr('disabled', false);

    //to disable category and sfc if the CAMPAIGN_PLANNER is YES
    if ($("#hdnCPCode").val() != "") {
        var priv = "";
        var privArr = new Array();
        priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
        privArr = priv.split(',');
        //if ($.inArray("YES", privArr) > -1) {
        //    $("#drpCategory").attr('disabled', true);
        //    $("#txtWorkPlace").attr('disabled', true);

        //    for (var s = 1; s <= $("#tblSFCHOP tr").length; s++) {
        //        $("#txtFormPlace_" + s).attr('disabled', true);
        //        $("#txtToPlace_" + s).attr('disabled', true);
        //    }
        //}
    }
}

//Function to enable Doctor Autofill
function fnDoctorAutofill() {
    debugger;
    var regionCodes = "";
    var accObj = "";
    var curRegionCode = $("#hdnRegionCode").val();
    //regionCodes += "'" + $("#hdnRegionCode").val() + "',";
    if ($(".accompanist-input-token").tokenInput('get') != undefined && $(".accompanist-input-token").tokenInput('get') != null) {
        accObj = $(".accompanist-input-token").tokenInput('get');
    }
    for (var i = 0; i < accObj.length; i++) {
        regionCodes += "''" + accObj[i].id + "'',";
    }

    if (accObj.length > 0) {
        regionCodes = "'''" + curRegionCode + "''," + "" + regionCodes.slice(0, -1) + "',";
    }
    else {
        regionCodes = "'''" + curRegionCode + "''',";
    }

    regionCodes = regionCodes.slice(0, -1);

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetTPDoctors',
        data: "RegionCode=" + regionCodes + "&CPCode=" + $("#hdnCPCode").val() + "",
        async: false,
        success: function (jsData) {
            debugger;
            jsData = eval('(' + jsData + ')');
            doctor_g = jsData;
            var content = "";
            var data = "";
            var data1 = new Array();
            content = "[";
            var mdlNumber;
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                mdlNumber = jsData.Tables[0].Rows[i].MDL_Number;

                content += "{id:\"" + jsData.Tables[0].Rows[i].Customer_Code + "_" + jsData.Tables[0].Rows[i].Region_Code + "\",name:\"" + jsData.Tables[0].Rows[i].Customer_Name + "_" + mdlNumber + "_" + jsData.Tables[0].Rows[i].Region_Name + "\"},";
            }
            content = content.slice(0, -1) + "]";

            if (jsData.Tables[0].Rows.length == 0) {
                content = "[]";
            }

            data1 = eval('(' + content + ')');
            //debugger;
            //if ($("#txtDoctor").val() == "") {
            //to enable tag type input control
            $("#txtDoctor").prev().detach();
            $("#txtDoctor").tokenInput(
            [data1], {
                preventDuplicates: true, theme: "facebook", onAdd: function (item) {
                    doctorJSON_g.push(eval({ "id": item.id }));
                },
                onDelete: function (item) {
                    doctorJSON_g.remove("id", item.id);
                }
            }

            );
            if (tokendoctor_g != "") {
                if (tokendoctor_g.length > 0) {
                    doctorJSON_g = [{ id: 0 }]; //to clear the doctorJSON
                    for (var a = 0; a < tokendoctor_g.length; a++) {
                        var doc = jsonPath(doctor_g, "$.Tables[0].Rows[?(@.Customer_Code=='" + tokendoctor_g[a].id.split('_')[0].toString() + "' & @.Region_Code=='" + tokendoctor_g[a].id.split('_')[1].toString() + "')]");
                        if (doc != false && doc != undefined && doc.length > 0) {
                            $("#txtDoctor").tokenInput("add", { id: tokendoctor_g[a].id, name: tokendoctor_g[a].name });
                        }
                    }
                }
            }
            //debugger;
            //prefill cp doctors
            var doctr = $("#txtDoctor").tokenInput("get");
            if (doctr.length == 0 && $("#hdnCPCode").val() != "") {
                //debugger;
                var cpdoc = jsonPath(doctor_g, "$.Tables[0].Rows[?(@.CP_Code=='" + $("#hdnCPCode").val() + "')]");//$("#hdnCPCode").val()txtCPName
                //debugger;
                if (cpdoc != false && cpdoc != undefined && cpdoc.length > 0) {
                    doctorJSON_g = [{ id: 0 }]; //to clear the doctorJSON
                    for (var cpd = 0; cpd < cpdoc.length; cpd++) {
                        var doctorName = cpdoc[cpd].Customer_Name + "_" + cpdoc[cpd].MDL_Number + "_" + cpdoc[cpd].Region_Name;

                        $("#txtDoctor").tokenInput("add", { id: cpdoc[cpd].Customer_Code + "_" + cpdoc[cpd].Region_Code, name: doctorName });
                    }
                }
            }
            $(".token-input-dropdown-facebook").css('display', 'none');
            //$("#txtDoctor").blur();
        }
        //}
    });
}
//CP Reference
var cpRefJson_g = "";
function fnBindCPReference() {
    debugger;
    //var regionCodesArr = new Array();
    //var sfcArr = new Array();
    //var currentRegionCode = $("#hdnRegionCode").val();
    //var accRegions = "";
    ////Check wheather the accompanist SFC privilege is ON for SFC
    //accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    //accompArr = accomp.split(',');

    //regionCodesArr.push(currentRegionCode); //By default add the current region code
    //if ($.inArray("CP", accompArr) > -1) {   
    //    if ($(".accompanist-input-token").tokenInput('get') != undefined && $(".accompanist-input-token").tokenInput('get') != null) {
    //        accRegions = $(".accompanist-input-token").tokenInput('get')
    //    }
    //    for (var r = 0; r < accRegions.length; r++) {
    //        if ($.inArray(accRegions[r].id, regionCodesArr) == -1) {
    //            regionCodesArr.push(accRegions[r].id);
    //        }
    //    }

    $("#dvCPRef").html('');
    $('#dvloadcpref').css('display', '');
    var cpCodes = "";
    var userCodes = $("#hdnUserCode").val() + "^";
    for (var c = 0; c < cpJson_g.length; c++) {
        cpCodes += "''" + cpJson_g[c].value.toString() + "'',";
    }

    cpCodes = "'" + cpCodes.slice(0, -1) + "'";

    if (cpJson_g.length == 0) {
        cpCodes = "''''''";
    }

    var accompanists = $('#txtAccompaninst').tokenInput('get')
    for (var i = 0; i < accompanists.length; i++) {
        userCodes += accompanists[i].value + "^";
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetCPDocCount',
        data: "CPCode=" + cpCodes + "&UserCode=" + userCodes + "",
        async: false,
        success: function (cpRefJson) {
            debugger;
            $("#dvCPRef").html('');
            if (cpRefJson.length == 0) {
                $("#dvCPRef").html("<span>No Beat/Patch found.</span>");
                return;
            }
            cpRefJson = eval('(' + cpRefJson + ')');
            var content = "";

            content += "<table class='table table-striped' ID='tblCpRef' style='position:relative;'>";
            content += "<thead style='background-color:#c7daf7;'>";
            content += "<tr>";
            content += "<td style='min-width: 100px; max-width: 100px; word-wrap: break-word;'>Beat/Patch Code</td>";
            content += "<td style='min-width: 100px; max-width: 100px; word-wrap: break-word;'>Region Name</td>";
            for (var c = 0; c < cpRefJson.Tables[1].Rows.length; c++) {
                content += "<td style='min-width: 80px; max-width: 80px; word-wrap: break-word;'>"
                    + cpRefJson.Tables[1].Rows[c].Category_Name + "</td>";
            }
            content += "<td style='min-width: 50px; max-width: 50px;'>Total</td>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody style='position:absolute;overflow-y:auto;height:110px;'>";
            for (var cp = 0; cp < cpRefJson.Tables[0].Rows.length; cp++) {
                var total = 0;
                content += "<tr>";
                content += "<td style='min-width: 100px; max-width: 100px; word-wrap: break-word;'>" + cpRefJson.Tables[0].Rows[cp].CP_Name + "</td>";
                content += "<td style='min-width: 100px; max-width: 100px; word-wrap: break-word;'>" + cpRefJson.Tables[0].Rows[cp].Region_Name + "</td>";
                for (var c = 0; c < cpRefJson.Tables[1].Rows.length; c++) {
                    content += "<td style='min-width: 80px; max-width: 80px; word-wrap: break-word;'>" + cpRefJson.Tables[0].Rows[cp][cpRefJson.Tables[1].Rows[c].Category_Name] + "</td>";
                    total += parseInt(cpRefJson.Tables[0].Rows[cp][cpRefJson.Tables[1].Rows[c].Category_Name]);
                }
                content += "<td style='min-width: 50px; max-width: 50px;'>" + total + "</td>";
                content += "</tr>";
            }
            content += "</tbody>";

            content += "</table>";

            $("#dvCPRef").html(content);
            $("#tblCpRef tr:has(td)").each(function () {
                var t = $(this).text().toLowerCase(); //all row text
                $("<td class='indexColumn'></td>")
                 .hide().text(t).appendTo(this);
            }); //each tr
            $("#txtCPRefSearch").keyup(function () {
                var s = $(this).val().toLowerCase().split(" ");
                //show all rows.
                $("#tblCpRef tr:hidden").show();
                $.each(s, function () {
                    $("#tblCpRef tbody tr:visible .indexColumn:not(:contains('"
                + this + "'))").parent().hide();
                }); //each
            }); //key up.

            $('#dvloadcpref').css('display', 'none');
        },
        error: function (e) {
        }
    });
}



//*************************** SFC starts here ****************************//
//function to get SFC Data
function fnGetSFCAutoFillData(source) {
    if (source != "A") {
        $('#dvloadsfcref').css('display', '');
        $.ajax({
            type: 'POST',
            url: 'TourPlanner/GetSFC',
            async: false,
            data: "UserCode=" + $("#hdnUserCode").val() + "&AccompanistName=" + eaccompanistName_g + "&AccompanistRegion=" + eaccompanistRegions_g + "&tpDate=" + $("#hdnTPDate").val(),
            success: function (sfc) {
                //debugger;
                sfcJson_g = sfc;
                accSFCJson_g = sfc;
                fnEnableSFCAutocomplete();

            },
            error: function (e) {
            }
        });
    }
    else {
        $('#dvloadsfcref').css('display', '');
        $.ajax({
            type: 'POST',
            url: 'TourPlanner/GetSFC',
            async: false,
            data: "UserCode=" + $("#hdnUserCode").val() + "&AccompanistName=" + '' + "&AccompanistRegion=" + '' + "&tpDate=" + $("#hdnTPDate").val(),
            success: function (sfc) {
                //debugger;
                sfcJson_g = sfc;
                accSFCJson_g = sfc;
                fnEnableSFCAutocomplete();

            },
            error: function (e) {
            }
        });

    }
}
//Function to create HOP
function fnCreateSFCHOP(noOfRow) {
    var tableContent = "";
    var tpInter = "";
    var tpInterArr = new Array();

    tpInter = fnGetPrivilegeVal("INTERMEDIATE_PLACES", "");
    tpInterArr = tpInter.split(',');

    if ($.inArray($('#drpCategory :selected').text().toUpperCase(), tpInterArr) > -1) {
        if (noOfRow > 0) {
            tableContent += "<table id='tblSFCHOP'>";
            for (var i = 1; i < noOfRow; i++) {
                var fromPlaceDisabled = 'disabled=true';
                if (i == 1) {
                    fromPlaceDisabled = "";
                }
                tableContent += "<tr><td><input id='txtFormPlace_" + i + "'  class='sfcauto sfcplace' " + fromPlaceDisabled + " /> </td>";
                tableContent += "<td><input id='txtToPlace_" + i + "'  class='sfcauto sfcplace newRow'  /></td>";
                tableContent += "<td><input id='txtTravelMode_" + i + "'  class='travelModeauto sfcauto'  />";
                tableContent += "<input id='hdnDistance_" + i + "'  type='hidden' />";
                tableContent += "<input id='hdnFare_" + i + "'  type='hidden' />";
                tableContent += "<input id='hdnDistanceFareCode_" + i + "'  type='hidden' />";
                tableContent += "<input id='hdnSFCRegion_" + i + "'  type='hidden' />";
                tableContent += "<input id='hdnSFCVersion_" + i + "'  type='hidden' />";
                tableContent += "<input id='hdnSFCCategory_" + i + "'  type='hidden' />";
                tableContent += "<input id='hdnSFCVisitCount_" + i + "'  type='hidden' />";
                tableContent += "</td></tr>";

            }
            tableContent += "</table>";
        }

    }
    else {
        debugger;
        tableContent += "<table id='tblSFCHOP'>";
        for (var i = 1; i <= 1; i++) {
            var fromPlaceDisabled = 'disabled=true';
            if (i == 1) {
                fromPlaceDisabled = "";
            }
            tableContent += "<tr><td><input id='txtFormPlace_" + i + "'  class='sfcauto sfcplace' " + fromPlaceDisabled + " /> </td>";
            tableContent += "<td><input id='txtToPlace_" + i + "'  class='sfcauto sfcplace newRow'  /></td>";
            tableContent += "<td><input id='txtTravelMode_" + i + "'  class='travelModeauto sfcauto'  />";
            tableContent += "<input id='hdnDistance_" + i + "'  type='hidden' />";
            tableContent += "<input id='hdnFare_" + i + "'  type='hidden' />";
            tableContent += "<input id='hdnDistanceFareCode_" + i + "'  type='hidden' />";
            tableContent += "<input id='hdnSFCRegion_" + i + "'  type='hidden' />";
            tableContent += "<input id='hdnSFCVersion_" + i + "'  type='hidden' />";
            tableContent += "<input id='hdnSFCCategory_" + i + "'  type='hidden' />";
            tableContent += "<input id='hdnSFCVisitCount_" + i + "'  type='hidden' />";
            tableContent += "</td></tr>";

        }
        tableContent += "</table>";
    }


    $("#dvSFCHOP").html(tableContent);
    fnEnableSFCAutocomplete();
}
//function to add new row in SFC HOP
function fnAddNewRowSFCHOP(obj) {
    if ($('#drpCategory :selected').text().toUpperCase() != "HQ" && $("#drpCategory").val() != "0") { // Check wheather the Category is not HQ then only HOP will create
        if ($.trim($(obj).val()) != "") { // to check the previous text box value if the user enter some value then only have to create the new row
            var tpInter = "";
            var tpInterArr = new Array();

            tpInter = fnGetPrivilegeVal("INTERMEDIATE_PLACES", "");
            tpInterArr = tpInter.split(',');

            if ($.inArray($('#drpCategory :selected').text().toUpperCase(), tpInterArr) > -1) { // check if the privilege is mapped for the usertype
                var rowIndex = obj.id.split('_')[1].toString();
                var rCnt = $("#tblSFCHOP tr").length;
                if (rowIndex == rCnt) {
                    var newRow = document.getElementById("tblSFCHOP").insertRow(parseInt(rCnt));
                    rCnt++;

                    var preToPlaceRowNo = "";
                    preToPlaceRowNo = rCnt - 1;
                    var preToPlace = $("#txtToPlace_" + preToPlaceRowNo).val();
                    var tdFrom = newRow.insertCell(0);
                    $(tdFrom).html("<input id='txtFormPlace_" + rCnt + "' value='" + preToPlace + "' disabled=true  class='sfcauto sfcplace' /> ");
                    var tdTo = newRow.insertCell(1);
                    $(tdTo).html("<input id='txtToPlace_" + rCnt + "'  class='sfcauto sfcplace newRow'  />");
                    var tdTravelMode = newRow.insertCell(2);
                    $(tdTravelMode).html("<input id='txtTravelMode_" + rCnt + "'  class='travelModeauto sfcauto' />");

                    $(tdTravelMode).append("<input id='hdnDistance_" + rCnt + "'  type='hidden' />");
                    $(tdTravelMode).append("<input id='hdnFare_" + rCnt + "'  type='hidden' />");
                    $(tdTravelMode).append("<input id='hdnDistanceFareCode_" + rCnt + "'  type='hidden' />");
                    $(tdTravelMode).append("<input id='hdnSFCRegion_" + rCnt + "'  type='hidden' />");
                    $(tdTravelMode).append("<input id='hdnSFCVersion_" + rCnt + "'  type='hidden' />");
                    $(tdTravelMode).append("<input id='hdnSFCCategory_" + rCnt + "'  type='hidden' />");
                    $(tdTravelMode).append("<input id='hdnSFCVisitCount_" + rCnt + "'  type='hidden' />");

                    fnEnableSFCAutocomplete();
                    //obj[0].onblur = null;
                }
                else {
                    var nxtFromPlaceRowNo = parseInt(rowIndex) + 1;
                    //  preToPlaceRowNo = parseInt(rowIndex) - 1;

                    var preToPlace = $("#txtToPlace_" + rowIndex).val();
                    $("#txtFormPlace_" + nxtFromPlaceRowNo).val(preToPlace);

                }
            }
        }
        else {
            if ($(obj).length > 0) {
                var preRowToPlaceId = $(obj)[0].id.split('_')[1];
                //$("#spnDelSFCRow_" + preRowToPlaceId).css("display", "block");
                var startId = parseInt(preRowToPlaceId) + 1;
                var rowCount = $("#tblSFCHOP tr").length;
                for (var i = startId; i <= rowCount; i++) {
                    $("#txtToPlace_" + i).parent().parent().remove();

                }
            }

        }
    }
}
//function to include accompanist SFC
function fnIncludeAccompanistSFC(regionCode) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRV4Header/GetSFCData',
        data: "region=" + regionCode + "&dcrDate=" + $("#hdnTPDate").val(),
        success: function (accSFC) {
            //debugger;
            if (accSFCJson_g == "") {
                if (accSFC != null) {
                    accSFCJson_g = accSFC.data
                    sfcJson_g = accSFCJson_g;
                }
            }
            else {
                if (accSFC.data != null) {
                    for (var k = 0; k < accSFC.data.length; k++) {
                        // accSFCJson_g.push(accSFC.data[k]);
                        sfcJson_g.push(accSFC.data[k])
                        accSFCJson_g = sfcJson_g;
                    }

                }
            }
            fnEnableSFCAutocomplete();
            fnGetWorkAreas(currentRegion);
        },
        error: function (e) {
        }
    });
}

function fnGetWorkAreas(regionCode) {
    debugger
    var beatPlan_SFCValidatPriv_g = fnGetPrivilegeVal("SFC_VALIDATION", "");
    var value = 0;
    var workCategoryName = $('#drpCategory').val();
    var workCategory = $("#drpCategory option:selected").text();
    if (beatPlan_SFCValidatPriv_g.indexOf(",") > -1) {
        var Privivalue = beatPlan_SFCValidatPriv_g.split(',')
    }
    else {
        var Privivalue = beatPlan_SFCValidatPriv_g;
    }
    if (workCategoryName != 0) {
        if (beatPlan_SFCValidatPriv_g != "" && beatPlan_SFCValidatPriv_g != undefined && beatPlan_SFCValidatPriv_g != null && Privivalue.indexOf(workCategory) > -1) {
            value = 1;
            $('#tdworkplace').hide();
        } else {
            value = 0;
            $('#tdworkplace').show();
        }
        lstAccompanistsRegions = [];
        var accompanists = $('#txtAccompaninst').tokenInput('get')
        for (var i = 0; i < accompanists.length; i++) {
            lstAccompanistsRegions.push(accompanists[i].id);
        }
        lstAccompanistsRegions.push(currentRegion);
        var regionCodes = lstAccompanistsRegions.toString();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/BeatPlan/GetAllWorAreas',
            async: false,
            data: "companyCode=0&regionCode=" + regionCodes + "&workCategoryCode=" + workCategoryName + "&sfcValidation=" + value,
            success: function (accWork) {
                debugger;
                for (var k = 0; k < accWork.length; k++) {
                    // accSFCJson_g.push(accSFC.data[k]);
                    workPlace_g.push(accWork[k])

                }
                var sfcWorkplace = [];
                for (var k = 0; k < workPlace_g.length; k++) {
                    // check from place
                    if (!($.inArray(workPlace_g[k].Work_Area, workPlace_g) > -1)) {
                        sfcWorkplace.push(workPlace_g[k].Work_Area);
                    }
                }
                // Work Place
                //var Wsfc = "[";
                //for (var i = 0; i < sfcWorkplace.length; i++) {
                //    Wsfc += "{label:" + '"' + "" + sfcWorkplace[i] + "" + '",' + "value:" + '"' + "" + sfcWorkplace[i] + "" + '"' + "}";
                //    if (i < sfcWorkplace.length - 1) {
                //        Wsfc += ",";
                //    }
                //}
                //Wsfc += "];";
                //convert string to JSON
                //var sfcworkplaceAuto = eval(Wsfc);
                //$("#txtWorkPlace").unautocomplete();
                //autoComplete(sfcworkplaceAuto, "txtWorkPlace", "", "sfcWorkplace");



                //////////// token Work Place ///////////////

                var jsData = sfcWorkplace;
                var content = "";
                var data = "";
                var data1 = new Array();
                content = "[";
                for (var i = 0; i < jsData.length; i++) {


                    content += "{id:\"" + jsData[i] + "\",name:\"" + jsData[i] + "\"},";
                }
                content = content.slice(0, -1) + "]";

                if (jsData.length == 0) {
                    content = "[]";
                }

                data1 = eval('(' + content + ')');
                //debugger;

                //to enable tag type input control
                // $("#txtWorkPlace").tokenInput('clear');
                $("#txtWorkPlace").prev().detach();
                $("#txtWorkPlace").tokenInput(
                [data1], {
                    preventDuplicates: true, theme: "facebook", onAdd: function (item) {
                        sfcWorkplace.push(eval({ "id": item.id }));
                    },
                    onDelete: function (item) {
                        sfcWorkplace.remove("id", item.id);
                    }
                }

                );


                $(".token-input-dropdown-facebook").css('display', 'none');
                //if (work_Area_g.length > 1) {
                //    work_Area_g = [];
                //}
                if (workArea != undefined) {
                    if (workArea != "") {
                        work_Area_g = [];
                        work_Area_g.push(workArea);
                        //for (var w = 0; w < work_area_g.length; w++) {
                        //    debugger;
                        //    $("#txtWorkPlace").tokenInput("add", { id: work_area_g[w], name: work_area_g[w] });
                        //}
                    }
                }
                //else {
                //    for (var w = 0; w < work_Area_g.length; w++) {
                //        debugger;
                //        $("#txtWorkPlace").tokenInput("add", { id: work_Area_g[w], name: work_Area_g[w] });
                //    }
                //}
                for (var w = 0; w < work_Area_g.length; w++) {
                    debugger;
                    $("#txtWorkPlace").tokenInput("add", { id: work_Area_g[w], name: work_Area_g[w] });
                }
            },
            error: function () {

            }
        });
    }
}
//function to enable SFC Autocomplete
function fnEnableSFCAutocomplete() {
    debugger;
    try {
        //debugger;
        var regionCodesArr = new Array();
        var sfcArr = new Array();

        var sfcRefContent = "";
        sfcRefContent += "<table class='table table-striped' id='tblSFCRef' style='position:relative;'>";
        sfcRefContent += "<thead style='background-color:#c7daf7;'><tr><td style='min-width:80px;max-width:80px;'>"
        + "Region</td><td style='min-width:80px;max-width:80px;'>Category</td><td style='min-width:100px;max-width:100px;'>Place</td>"
        + "<td style='min-width:60px;max-width:60px;'>Mode</td><td style='min-width:50px;max-width:50px;'>Distance</td><td style='min-width:40px;max-width:40px;'>Min Visit Count</td>"
        + "<td style='min-width:40px;max-width:40px;'>Max Visit Count</td></tr></thead><tbody style='position:absolute;overflow-y:auto;height:110px;'>";
        $("#dvSFCRef").html('');
        var sfcc = 1;

        var currentRegionCode = $("#hdnRegionCode").val();
        var accRegions = "";

        //Check wheather the accompanist SFC privilege is ON for SFC
        accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
        accompArr = accomp.split(',');

        regionCodesArr.push(currentRegionCode); //By default add the current region code

        if ($.inArray("SFC", accompArr) > -1) {
            if ($(".accompanist-input-token").tokenInput('get') != undefined && $(".accompanist-input-token").tokenInput('get') != null) {
                accRegions = $(".accompanist-input-token").tokenInput('get')
            }
            for (var r = 0; r < accRegions.length; r++) {
                if ($.inArray(accRegions[r].id, regionCodesArr) == -1) {
                    regionCodesArr.push(accRegions[r].id);
                }
            }
        }

        for (var z = 0; z < regionCodesArr.length; z++) {
            // filter the auto fill based on the category selection
            if (($.inArray($("#drpCategory :selected").text(), sfcValidation) > -1) && categoryCheckNeededTP == "YES") {
                sfcJson = jsonPath(accSFCJson_g, "$.[?(@.Region_Code=='" + regionCodesArr[z] + "' & @.Category_Name=='" + $("#drpCategory :selected").text() + "')]");
            }
            else if (regionCodesArr[z].trim() == currentRegionCode.trim() && categoryCheckNeededTP == "NO" && ($.inArray($("#drpCategory :selected").text(), sfcValidation) > -1)) {
                sfcJson = jsonPath(accSFCJson_g, "$.[?(@.Region_Code=='" + regionCodesArr[z] + "' & @.Category_Name=='" + $("#drpCategory :selected").text() + "')]");
            }
            else {
                sfcJson = jsonPath(accSFCJson_g, "$.[?(@.Region_Code=='" + regionCodesArr[z] + "')]");
            }

            if (sfcJson != false && !(sfcJson === undefined)) {
                for (var j = 0; j < sfcJson.length; j++) {
                    // check from place
                    if (!($.inArray(sfcJson[j].From_Place, sfcArr) > -1)) {
                        sfcArr.push(sfcJson[j].From_Place);
                    }

                    // check to place
                    if (!($.inArray(sfcJson[j].To_Place, sfcArr) > -1)) {
                        sfcArr.push(sfcJson[j].To_Place);
                    }

                    //for sfc reference
                    sfcRefContent += "<tr>";
                    sfcRefContent += "<td style='min-width:80px;max-width:80px;'>";
                    sfcRefContent += sfcJson[j].Region_Name;
                    sfcRefContent += "</td>";
                    sfcRefContent += "<td style='min-width:80px;max-width:80px;'>";
                    sfcRefContent += sfcJson[j].Category_Name;
                    sfcRefContent += "</td>";
                    sfcRefContent += "<td style='min-width:100px;max-width:100px;'>";
                    sfcRefContent += sfcJson[j].From_Place + " | " + sfcJson[j].To_Place;
                    sfcRefContent += "</td>";
                    sfcRefContent += "<td style='min-width:60px;max-width:60px;'>";
                    sfcRefContent += sfcJson[j].Travel_Mode
                    sfcRefContent += "</td>";
                    sfcRefContent += "<td style='min-width:50px;max-width:50px;'>";
                    sfcRefContent += sfcJson[j].Distance + "<br />";
                    sfcRefContent += "</td>";
                    sfcRefContent += "<td style='min-width:40px;max-width:40px;'>";
                    sfcRefContent += sfcJson[j].Minimum_Count + "<br />";
                    sfcRefContent += "</td>";
                    sfcRefContent += "<td style='min-width:40px;max-width:40px;'>";
                    sfcRefContent += sfcJson[j].SFC_Visit_Count + "<br />";
                    sfcRefContent += "</td>";
                    sfcRefContent += "</tr>";
                    sfcc++;

                }
            }

        }


        // generate json for work place,from place, to place.
        var sfc = "[";
        for (var i = 0; i < sfcArr.length; i++) {
            sfc += "{label:" + '"' + "" + sfcArr[i] + "" + '",' + "value:" + '"' + "" + sfcArr[i] + "" + '"' + "}";
            if (i < sfcArr.length - 1) {
                sfc += ",";
            }
        }
        sfc += "];";
        //convert string to JSON
        var sfcAuto = eval(sfc);
        allsfc_g = sfcAuto;

        ///

        //unautocomplete to the SFC to avoid multiple autofill
        $("#txtWorkPlace").unautocomplete();
        var rCnt = $("#tblSFCHOP tr").length;
        for (var k = 1; k <= rCnt; k++) {
            $("#txtFormPlace_" + k).unautocomplete();
            $("#txtToPlace_" + k).unautocomplete();
            $("#txtTravelMode").unautocomplete();
        }
        // autoComplete(sfcworkplaceAuto, "txtWorkPlace", "", "sfcWorkplace");
        autoComplete(sfcAuto, "txtFormPlace", "", "sfcplace");
        //Function to bind the Travel Mode
        fnGetTravelModes();
        // generate json for travel mode.
        //var travelModeArr = new Array("BIKE", "BUS", "TRAIN", "CAR", "TAXI", "AIR", "ROAD");
        //var travelMode = "[";
        //for (var i = 0; i < travelModeArr.length; i++) {
        //    travelMode += "{label:" + '"' + "" + travelModeArr[i] + "" + '",' + "value:" + '"' + "" + travelModeArr[i] + "" + '"' + "}";
        //    if (i < travelModeArr.length - 1) {
        //        travelMode += ",";
        //    }
        //}
        //travelMode += "];";
        //var travelModeJson_g = eval(travelMode);
        //autoComplete(travelModeJson_g, "txtTravelMode", "", 'travelModeauto');



        sfcRefContent += "</tbody>";
        sfcRefContent += "</table>";


        $("#dvSFCRef").html(sfcRefContent);
        fnTPSFCEventBinder();
        //if ($.fn.dataTable) { $('.datatable').dataTable({ bPaginate: false }); };
        $("#tblSFCRef tr:has(td)").each(function () {
            var t = $(this).text().toLowerCase(); //all row text
            $("<td class='indexColumn'></td>")
             .hide().text(t).appendTo(this);
        }); //each tr
        $("#txtSFCRefSearch").keyup(function () {
            var s = $(this).val().toLowerCase().split(" ");
            //show all rows.
            $("#tblSFCRef tr:hidden").show();
            $.each(s, function () {
                $("#tblSFCRef tbody tr:visible .indexColumn:not(:contains('"
            + this + "'))").parent().hide();
            }); //each
        }); //key up.

        $('#dvloadsfcref').css('display', 'none');
    } catch (e) {
        alert(e.message);
    }
}

//*************************** SFC ends here ****************************//



//*******************Overlay functions starts here******************//

//function call when the user click accompanist
var OutSideAccNameArr_g = [];
function fnAccompanistSearch() {
    var matchCase = $("#txtAccSearch").val();
    if (matchCase.length < 3) {
        $("#spnError").html('Enter minimun of 3 character to search');
        return false;
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetAccompanistPopUpData',
        data: "matchingString=" + escape(matchCase) + "&RegionCode=" + $("#hdnRegionCode").val() + "",
        success: function (jsonPopup) {
            debugger;
            jsonPopup.map(function (i, e) {
                debugger;
                if ($.inArray(i.Accompanist_Name, OutSideAccNameArr_g) == -1) {
                    outsideAccomapnist.push(i);
                    OutSideAccNameArr_g.push(i.Accompanist_Name);
                }
            });
            if (jsonPopup != null && jsonPopup != "") {
                var content = "";
                content = "<table id='tblAccPopup' class='data display datatable'>";
                content += "<thead><tr><th>Accompanist Name</th></tr><thead>";
                content += "<tbody>";

                for (var j = 0; j < jsonPopup.length; j++) {
                    //debugger;
                    content += "<tr><td onclick='fnFillAccomp(" + j + ")'>" + jsonPopup[j].Accompanist_Name + "<label id='lblAcc_" + j + "' style='display:none;'>" + jsonPopup[j].Accompanist_Region_Code.split(',')[0] + "^" + jsonPopup[j].Accompanist_Region_Code.split(',')[1] + "^" + jsonPopup[j].Accompanist_Name + "^" + jsonPopup[j].User_Code + "</label></td></tr>";
                }
                content += "<tbody>";
                content += "</table>";
                $("#dvAccompaninstPopUp").html(content);
                $("#spnError").html('');
            }
            else {
                $("#dvAccompaninstPopUp").html('No accompanist details found for - <b>' + matchCase + '</b>');
                $("#spnError").html('');
            }
        }
    });
}

//Function to bind the accompanist name in to token control
function fnFillAccomp(row) {
    //debugger;
    $("#mies1").overlay().close();
    var accName = $("#lblAcc_" + row).html().split('^')[2];
    var regionCode = $("#lblAcc_" + row).html().split('^')[0];
    var userCode = $("#lblAcc_" + row).html().split('^')[1];
    //var acc = accName.split(',')[1].toString();
    //var acName = acc.split('(')[0].toString();
    var acName = accName;

    $(".accompanist-input-token").tokenInput("add", { id: regionCode, name: acName, value: userCode });

    //function to add accompanist SFC
    accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    accompArr = accomp.split(',');

    if ($.inArray("SFC", accompArr) > -1) {
        // fnIncludeAccompanistSFC(regionCode);
    }
}

//function to bind all the doctors in doctor overlay
function fnBindDoctors() {
    debugger;
    var isCp = false;
    if ($("#hdnCPCode").val() != "") {
        isCp = true;
    }
    //to clear error message in doctor overlay
    $("#spnDocOverLayError").html('');
    var mdlNumber;
    var content = "";

    //to get the doctors which is selected
    var docObj = $("#txtDoctor").tokenInput('get');
    var isChecked = "";

    content += "<table class='data display datatable' id='tblDoctors'>";
    content += "<thead><tr><th style='width: 5%;'>Select</th><th>" + DoctorLabel + " Name</th><th>Category Name</th><th>Speciality Name</th></tr></thead>";
    content += "<tbody>";
    for (var k = 0; k < doctor_g.Tables[0].Rows.length; k++) {
        if (isCp) { } else { if (doctor_g.Tables[0].Rows[k].TYPE == "C") { continue; } }
        var docJson = jsonPath(docObj, "$.[?(@.id=='" + doctor_g.Tables[0].Rows[k].Customer_Code + "_" + doctor_g.Tables[0].Rows[k].Region_Code + "')]");
        if (docJson != false) {
            if (docJson.length > 0) {
                isChecked = "checked";
            }
        }

        content += "<tr id='trDoc_" + k + "'>";
        content += "<td><input type='checkbox' id='chkDoc_" + k + "' " + isChecked + "/><input type='hidden' id='hdnCustomerCode_" + k + "' value='" + doctor_g.Tables[0].Rows[k].Customer_Code + "_" + doctor_g.Tables[0].Rows[k].Region_Code + "' /></td>";
        content += "<td id='tdCustomerName_" + k + "'>" + doctor_g.Tables[0].Rows[k].Customer_Name + "_" + doctor_g.Tables[0].Rows[k].MDL_Number + "_" + doctor_g.Tables[0].Rows[k].Region_Name + "</td>";
        //content += "<td>" + doctor_g.Tables[0].Rows[k].Region_Name + "</td>";


        mdlNumber = doctor_g.Tables[0].Rows[k].MDL_Number;

        //content += "<td>" + mdlNumber + "</td>";
        content += "<td>" + doctor_g.Tables[0].Rows[k].Category_Name + "</td>";
        content += "<td>" + doctor_g.Tables[0].Rows[k].Speciality_Name + "</td>";
        content += "</tr>";
        isChecked = "";
    }
    content += "</tbody>";
    content += "</table>";
    $("#dvdoctorSelection").html(content);
}

//function to filter the CP doctors alone from doctor_g string
function fnFilterDoctor(mode) {
    var content = "";
    //to get the doctors which is selected
    var docObj = $("#txtDoctor").tokenInput('get');
    var isChecked = "";

    if (mode == "CP") {
        content += "<table class='data display datatable' id='tblDoctors'>";
        content += "<thead><tr><th style='width: 5%;'>Select</th><th>Doctor Name</th><th>Category Name</th><th>Speciality Name</th></tr></thead>";
        content += "<tbody>";
        for (var k = 0; k < doctor_g.Tables[0].Rows.length; k++) {
            if (doctor_g.Tables[0].Rows[k].NAME == $("#txtCPName").val()) {
                var docJson = jsonPath(docObj, "$.[?(@.id=='" + doctor_g.Tables[0].Rows[k].Customer_Code + "_" + doctor_g.Tables[0].Rows[k].Region_Code + "')]");
                if (docJson != false) {
                    if (docJson.length > 0) {
                        isChecked = "checked";
                    }
                }

                content += "<tr id='trDoc_" + k + "'>";
                content += "<td><input type='checkbox' id='chkDoc_" + k + "' " + isChecked + " /><input type='hidden' id='hdnCustomerCode_" + k + "' value='" + doctor_g.Tables[0].Rows[k].Customer_Code + "_" + doctor_g.Tables[0].Rows[k].Region_Code + "' /></td>";
                content += "<td id='tdCustomerName_" + k + "'>" + doctor_g.Tables[0].Rows[k].Customer_Name + "_" + doctor_g.Tables[0].Rows[k].MDL_Number + "_" + doctor_g.Tables[0].Rows[k].Region_Name + "</td>";
                //content += "<td>" + doctor_g.Tables[0].Rows[k].Region_Name + "</td>";
                //content += "<td>" + doctor_g.Tables[0].Rows[k].MDL_Number + "</td>";
                content += "<td>" + doctor_g.Tables[0].Rows[k].Category_Name + "</td>";
                content += "<td>" + doctor_g.Tables[0].Rows[k].Speciality_Name + "</td>";
                content += "</tr>";

                isChecked = "";

            }
        }
        content += "</tbody>";
        content += "</table>";
        $("#dvdoctorSelection").html(content);
    }
    else if (mode == "OT") {
        content += "<table class='data display datatable' id='tblDoctors'>";
        content += "<thead><tr><th style='width: 5%;'>Select</th><th>Doctor Name</th><th>Category Name</th><th>Speciality Name</th></tr></thead>";
        content += "<tbody>";
        for (var k = 0; k < doctor_g.Tables[0].Rows.length; k++) {
            if (doctor_g.Tables[0].Rows[k].NAME != $("#hdnCPCode").val()) {
                var docJson = jsonPath(docObj, "$.[?(@.id=='" + doctor_g.Tables[0].Rows[k].Customer_Code + "_" + doctor_g.Tables[0].Rows[k].Region_Code + "')]");
                if (docJson != false) {
                    if (docJson.length > 0) {
                        isChecked = "checked";
                    }
                }

                content += "<tr id='trDoc_" + k + "'>";
                content += "<td><input type='checkbox' id='chkDoc_" + k + "' " + isChecked + " /><input type='hidden' id='hdnCustomerCode_" + k + "' value='" + doctor_g.Tables[0].Rows[k].Customer_Code + "_" + doctor_g.Tables[0].Rows[k].Region_Code + "' /></td>";
                content += "<td id='tdCustomerName_" + k + "'>" + doctor_g.Tables[0].Rows[k].Customer_Name + "_" + doctor_g.Tables[0].Rows[k].MDL_Number + "_" + doctor_g.Tables[0].Rows[k].Region_Name + "</td>";
                //content += "<td>" + doctor_g.Tables[0].Rows[k].Region_Name + "</td>";
                //content += "<td>" + doctor_g.Tables[0].Rows[k].MDL_Number + "</td>";
                content += "<td>" + doctor_g.Tables[0].Rows[k].Category_Name + "</td>";
                content += "<td>" + doctor_g.Tables[0].Rows[k].Speciality_Name + "</td>";
                content += "</tr>";
                isChecked = "";
            }
        }
        content += "</tbody>";
        content += "</table>";
        $("#dvdoctorSelection").html(content);
    }
}

//function to add the doctors in token
function fnAddDoctorTokens() {
    var rCnt = $("#tblDoctors tr").length;
    //check is the doctor is already exist
    //var repeatedDocs = "";
    //for (var z = 0; z < rCnt; z++) {
    //    if ($("#chkDoc_" + z).attr('checked')) {
    //        var customerCode = $("#hdnCustomerCode_" + z).val();
    //        var customerName = $("#tdCustomerName_" + z).html();

    //        var docObj = jsonPath(doctorJSON_g, "$.[?(@.id=='" + customerCode + "')]");
    //        if (docObj != false && docObj.length > 0) {
    //            repeatedDocs += customerName + " ,";
    //        }

    //    }
    //}
    //if ($.trim(repeatedDocs) != "") {
    //    $("#spnDocOverLayError").html("Doctor Name(s) : <b>" + repeatedDocs + " </b> already exist");
    //    return false;
    //}

    $("#txtDoctor").tokenInput('clear')
    for (var d = 0; d < rCnt; d++) {
        if ($("#chkDoc_" + d).attr('checked')) {
            var customerCode = $("#hdnCustomerCode_" + d).val();
            var customerName = $("#tdCustomerName_" + d).html();
            $("#txtDoctor").tokenInput("add", { id: customerCode, name: customerName });
        }
    }
    $("#dvDoctors").overlay().close();
}
//function to bind selected doctors in doctor product overlay
function fnBindSelectedDoctors() {
    debugger;
    // fngetBatchInformation();
    var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");

    var mdlNumber;
    var doc = "[";
    for (var i = 0; i < doctor_g.Tables[0].Rows.length; i++) {

        mdlNumber = doctor_g.Tables[0].Rows[i].MDL_Number;

        doc += "{label:" + '"' + "" + doctor_g.Tables[0].Rows[i].Customer_Name + "_" + mdlNumber + "_" + doctor_g.Tables[0].Rows[i].Region_Name + "" + '",' + "value:" + '"' + "" + doctor_g.Tables[0].Rows[i].Customer_Code + "_" + doctor_g.Tables[0].Rows[i].Region_Code + "" + '"' + "}";
        if (i < doctor_g.Tables[0].Rows.length - 1) {
            doc += ",";
        }
    }
    doc += "];";
    var docJson = eval(doc);
    autoComplete(docJson, "txtDocNameOverlay", "hdnDocCodeOverlay", "docauto");

    var objselectedDoc = $("#txtDoctor").tokenInput('get');

    //to get the mapped campaign for the doctor
    var doctorCodes = "";
    for (var c = 0; c < objselectedDoc.length; c++) {
        doctorCodes += "''" + objselectedDoc[c].id.split('_')[0].toString() + "'',";
    }

    if (objselectedDoc.length == 1) {
        doctorCodes = "'''" + objselectedDoc[0].id.split('_')[0].toString() + "'''";
    }
    else {
        doctorCodes = "'" + doctorCodes.slice(0, -1) + "'";
    }

    if (doctorCodes == "''") {
        doctorCodes = "''''''";
    }
    //to get the campaign name from the DB
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetCampaignByDoctors',
        data: "DoctorCode=" + doctorCodes + "&TpDate=" + $("#hdnTPDate").val(),
        success: function (response) {
            debugger;
            response = eval('(' + response + ')');
            //Build the table string with campaign names  
            var content = "<table id='tblOverlayDoc' style='width:100%'>";

            content += "<thead><tr><th><b>" + DoctorLabel + "</b></th></tr></thead>";
            content += "<tbody>";

            for (var z = 0; z < objselectedDoc.length; z++) {
                var docDetails = jsonPath(doctor_g, "$.Tables[0].Rows[?(@.Customer_Code=='" + objselectedDoc[z].id.split('_')[0].toString() + "' & @.Region_Code=='" + objselectedDoc[z].id.split('_')[1].toString() + "')]");
                var campaignNameobj = jsonPath(response, "$.Tables[0].Rows[?(@.Customer_Code=='" + objselectedDoc[z].id.split('_')[0].toString() + "')]");

                var campaignName = "";
                if (campaignNameobj.length > 0) {
                    var campaignName = "<section><h5 style='color:black;margin:0px;padding:0px;'> Mapped Marketing Campaign :</h5>  <ul style='padding-left:20px;'>";
                    for (var t = 0; t < campaignNameobj.length; t++) {
                        campaignName += "<li>" + campaignNameobj[t].Campaign_Name.toString() + "</li>";
                    }
                    campaignName += "</ul></section>";
                }
                content += "<tr id='trDoct_" + z + "'>";
                content += "<td id='tdDoct_" + z + "' onclick='fnDoctorNameClick(" + z + ")' style='cursor:pointer'>" + docDetails[0].Customer_Name + " | " + docDetails[0].Category_Name + " | " + docDetails[0].Speciality_Name + " | " + docDetails[0].Region_Name + "<br /><font style='color:#3C81EF'>" + campaignName + "</font><input type='hidden' id='hdnDocCode_" + z + "' value='" + docDetails[0].Customer_Code + "_" + docDetails[0].Region_Code + "' /><input type='hidden' id='hdnProductDet_" + z + "' /></td>"; /// <img src="../../Content/themes/base/images/hd/load.gif" />
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
            if (batchPrivellage == 'YES') {
                $("#dvDocs").html(content);
            }
            else
                $("#dvDoc").html(content);


            fnShowSampleIcon();
            //  $('#batchmodel').overlay().close();
        },
        error: function (e) {
        }
    });
}

//function to add the doctor to the table
function fnAddDoctorsOverlay() {
    debugger;
    if ($("#hdnDocCodeOverlay").val() != "") {

        //check if the doctor already exist
        $("#spnDocDuplicateError").html('');
        for (var d = 0; d < $("#tblOverlayDoc tr").length; d++) {
            if ($("#trDoct_" + d + "").is(":visible")) {
                var docCod = $("#hdnDocCode_" + d).val();
                if ($("#hdnDocCodeOverlay").val() == docCod) {
                    $("#spnDocDuplicateError").html('Doctor name already exist');
                    return false;
                }
            }
        }

        var doctorCodes = "";
        doctorCodes = "'''" + $("#hdnDocCodeOverlay").val().split('_')[0].toString() + "'''";

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/TourPlanner/GetCampaignByDoctors',
            data: "DoctorCode=" + doctorCodes + "&TpDate=" + $("#hdnTPDate").val(),
            success: function (response) {
                response = eval('(' + response + ')');
                //var campaignName = "";
                //if (response.Tables[0].Rows.length > 0) {
                //    for (var t = 0; t < response.Tables[0].Rows.length; t++) {
                //        campaignName += response.Tables[0].Rows[t].Campaign_Name.toString() + ",";
                //    }
                //}

                var campaignName = "";
                if (response.Tables[0].Rows.length > 0) {
                    campaignName = "<section><h5 style='color:black;margin:0px;padding:0px;'> Mapped Marketing Campaign :</h5>  <ul style='padding-left:20px;'>";
                    for (var t = 0; t < response.Tables[0].Rows.length; t++) {
                        campaignName += "<li>" + response.Tables[0].Rows[t].Campaign_Name.toString() + "</li>";
                    }
                    campaignName += "</ul></section>";
                }

                var docDetails = jsonPath(doctor_g, "$.Tables[0].Rows[?(@.Customer_Code=='" + $("#hdnDocCodeOverlay").val().split('_')[0].toString() + "' & @.Region_Code=='" + $("#hdnDocCodeOverlay").val().split('_')[1].toString() + "')]");
                var rCnt = $("#tblOverlayDoc tr").length;
                var newRow = document.getElementById("tblOverlayDoc").insertRow(parseInt(rCnt));
                newRow.id = "trDoct_" + (rCnt - 1);
                var tddoc = newRow.insertCell(0);
                tddoc.id = "tdDoct_" + (rCnt - 1);
                $(tddoc).html(docDetails[0].Customer_Name + " | " + docDetails[0].Category_Name + " | " + docDetails[0].Speciality_Name + " | " + docDetails[0].Region_Name + "<br /><font style='color:#3C81EF'>" + campaignName + "</font>");
                $(tddoc).css('cursor', 'pointer');
                $(tddoc).click(function () { fnDoctorNameClick((rCnt - 1)) });
                var tddelete = newRow.insertCell(1);
                tddelete.id = "tdDoctDel_" + (rCnt - 1);
                $(tddelete).html("<img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tablet-16.png' id='imgSample_" + (rCnt - 1) + "' style='display:none' /><span style='cursor:pointer' onclick='fnDeleteDocOverlay(" + (rCnt - 1) + ")'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/delete_cross.gif' /><input type='hidden' id='hdnDocCode_" + (rCnt - 1) + "' value='" + docDetails[0].Customer_Code + "_" + docDetails[0].Region_Code + "' /><input type='hidden' id='hdnProductDet_" + (rCnt - 1) + "' /></span>");

                //Add doctors to the token input
                var doctorName = docDetails[0].Customer_Name + "_" + docDetails[0].MDL_Number + "_" + docDetails[0].Region_Name;
                $("#txtDoctor").tokenInput("add", { id: docDetails[0].Customer_Code + "_" + docDetails[0].Region_Code, name: doctorName });

                $("#txtDocNameOverlay").val('');
                $("#hdnDocCodeOverlay").val('');
            },
            error: function (e) {
            }
        });
    }
}
//function to delete the doctors in overlay
function fnDeleteDocOverlay(rowIndex) {
    for (var d = rowIndex; d < $("#tblOverlayDoc tr").length; d++) {
        //if ($("#trDoct_" + d + "").is(":visible")) {
        var docCod = $("#hdnDocCode_" + d).val();
        if ($("#hdnDocCodeOverlay").val() == docCod) {
            $("#spnDocDuplicateError").html('Doctor name already exist');
            return false;
        }
        //}
    }
    $("#trDoct_" + rowIndex).fadeOut('slow', function () { });

    //fnfindAndRemove(doctorJSON_g, "id", $("#hdnDocCode_" + rowIndex).val());
    doctorJSON_g.remove("id", $("#hdnDocCode_" + rowIndex).val());

    //remove the token from doctor token input
    $("#txtDoctor").tokenInput("remove", { id: $("#hdnDocCode_" + rowIndex).val() });
}
//function call when doctor name click in oberlay
function fnDoctorNameClick(rowIndex) {
    debugger;
    var rCnt = $("#tblOverlayDoc tr").length;
    for (var z = 0; z < rCnt; z++) {
        $("#tdDoct_" + z).css('font-weight', 'normal');
        $("#tdDoct_" + z).css('background', '#FFF');
        $("#tdDoctDel_" + z).css('background', '#FFF');
    }
    $("#tdDoct_" + rowIndex).css('font-weight', 'bold');
    $("#tdDoct_" + rowIndex).css('background', '#EFEFEF');
    $("#tdDoctDel_" + rowIndex).css('background', '#EFEFEF');
    //debugger;
    fnBindProductTable(rowIndex)
}

//function to generate product table
function fnBindProductTable(rowIndex) {
    //get the doctor Code
    debugger;
    var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");

    var doctorCode = $("#hdnDocCode_" + rowIndex).val().split('_')[0].toString();
    var regionCode = $("#hdnDocCode_" + rowIndex).val().split('_')[1].toString();
    var docDet = $("#tdDoct_" + rowIndex).html();
    var prodDetails = $("#hdnProductDet_" + rowIndex).val();
    $("#imgProc").css('display', '');
    $("#imgDocHis").css('display', '');

    $("#divProc").css('display', '');
    $("#divProcs").css('display', '');
    $("#dvDocHistory").css('display', '');
    $("#dvDocHistorys").css('display', '');
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetProductsForTP',
        data: "DoctorCode=" + doctorCode + "&UserCode=" + $("#hdnUserCode").val() + "&TpDate=" + $("#hdnTPDate").val(),
        success: function (response) {
            debugger;
            response = eval('(' + response + ')');
            var product = "[";
            for (var i = 0; i < response.Tables[0].Rows.length; i++) {
                product += "{label:" + '"' + "" + response.Tables[0].Rows[i].Product_Name + "" + '",' + "value:" + '"' + "" + response.Tables[0].Rows[i].Sample_Code + "" + '"' + "}";
                if (i < response.Tables[0].Rows.length - 1) {
                    product += ",";
                }
            }
            product += "];";
            var productJson = eval(product);
            productJson_g = productJson;

            //Generate Product table
            var tableContent = "";
            //tableContent += "<span class='doc-detail-head-overlay'>" + docDet + "</span>"

            var docPro = jsonPath(doctorProductJSON_g, "$.[?(@.id=='" + doctorCode + "_" + regionCode + "' )]");

            if (docPro == false || docPro == undefined) {
                tableContent += "<table id='tblProduct'>";
                tableContent += "<thead><tr><th><b>Products</b></th><th><b>Qty</b></th></tr></thead>";
                tableContent += "<tbody>";
                for (var i = 0; i < 3; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td><input style='width:180px' id='txtProduct_" + i + "' class='productauto' onblur='fnProductCreateNew(this," + rowIndex + ")' /><input type='hidden' id='hdnProCode_" + i + "' /></td>";
                    tableContent += "<td><input style='width:50px' id='txtQty_" + i + "' onblur='fnProductCreateNew(this," + rowIndex + ")' /></td>";
                    tableContent += "</tr>";
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
            }
            else {
                tableContent += "<table id='tblProduct'>";
                tableContent += "<thead><tr><th><b>Products</b></th><th><b>Qty</b></th></tr></thead>";
                tableContent += "<tbody>";

                for (var i = 0; i < docPro.length; i++) {
                    tableContent += "<tr>";
                    tableContent += "<td><input style='width:180px' id='txtProduct_" + i + "' class='productauto' onblur='fnProductCreateNew(this," + rowIndex + ")' value='" + docPro[i].ProductName + "' /><input type='hidden' id='hdnProCode_" + i + "' value='" + docPro[i].ProductCode + "' /></td>";
                    tableContent += "<td><input style='width:50px' id='txtQty_" + i + "' value='" + docPro[i].Qty + "' onblur='fnProductCreateNew(this," + rowIndex + ")' /></td>";
                    tableContent += "</tr>";
                }

                tableContent += "<tr>";
                tableContent += "<td><input style='width:180px' id='txtProduct_" + i + "' class='productauto' onblur='fnProductCreateNew(this," + rowIndex + ")' /><input type='hidden' id='hdnProCode_" + i + "' /></td>";
                tableContent += "<td><input style='width:50px' id='txtQty_" + i + "' onblur='fnProductCreateNew(this," + rowIndex + ")' /></td>";
                tableContent += "</tr>";

                tableContent += "</tbody>";
                tableContent += "</table>";
            }
            if (batchPrivellage == 'YES') {
                $("#dvProcs").html(tableContent);
            }
            else {
                $("#dvProc").html(tableContent);
            }
            for (var j = 0; j < $("#tblProduct tr").length; j++) {
                $("#txtProduct_" + j).unautocomplete();
            }

            autoComplete(productJson, "txtProduct", "hdnProCode", "productauto");


            ////Doctor Visit History Div
            //$("#dvDocDetails").html(docDet);
            //var dcrRemarks = "<b>Remarks :</b>"
            //var lastVisitContent = "<b>Last 3 Visits : </b>";
            //for (var i = 0; i < response.Tables[1].Rows.length; i++) {
            //    lastVisitContent += response.Tables[1].Rows[i].DCR_Actual_Date.toString() + " ;";
            //    dcrRemarks += response.Tables[1].Rows[i].Remarks_By_User + " ,";
            //}
            //$("#dvLastVisit").html(lastVisitContent);

            //if (dcrRemarks == "<b>Remarks :</b> , , ,") {
            //    dcrRemarks = "<b>Remarks :</b> No Remarks";
            //}

            //$("#dvRemarks").html(dcrRemarks);

            ////Last 3 visit sample given
            //var proArr = new Array();
            //for (var j = 0; j < response.Tables[2].Rows.length; j++) {
            //    if ($.inArray(response.Tables[2].Rows[j].Product_Code, proArr) == -1) {
            //        proArr.push(response.Tables[2].Rows[j].Product_Code);
            //    }
            //}

            //var productContent = "<b>Product Sample & Details (last 3 visits)</b><br />";
            //for (var p = 0; p < proArr.length; p++) {
            //    var proDet = jsonPath(response, "$.Tables[2].Rows[?(@.Product_Code=='" + proArr[p].toString() + "')]");
            //    var qtySum = 0;
            //    var splitQty = "";
            //    var prodetail = "";
            //    for (var x = 0; x < proDet.length; x++) {
            //        qtySum += proDet[x].Quantity_Provided;
            //        splitQty += proDet[x].Quantity_Provided + " Nos " + proDet[x].DCR_Actual_Date + " ;";

            //    }

            //    if (proDet[0].Is_Detailed == "1") {
            //        prodetail = "Detailed";
            //    }
            //    else {
            //        prodetail = "Not-Detailed";
            //    }

            //    productContent += "<font style='color: #A30303'>" + (parseInt(p) + 1) + " . " + proDet[0].Product_Name.toString() + "</font>" + "(" + prodetail + ") - " + qtySum + " Nos ; (" + splitQty + ")<br />";
            //}
            //$("#dvSamples").html(productContent);

            ////Doctor product mapping
            //var docProd = "<b>Product Mapping Details :</b></br>";

            //for (var i = 0; i < response.Tables[3].Rows.length; i++) {
            //    docProd += (i + 1) + ". " + response.Tables[3].Rows[i].Product_Name.toString() + " <br />";
            //}

            //$("#dvDocProc").html(docProd);

            $("#divProc").css('display', '');
            $("#divProcs").css('display', '');
            $("#dvProc").css('display', '');
            $("#dvProcs").css('display', '');
            //$("#dvDocHistory").css('display', '')


            $("#imgProc").css('display', 'none');
            //$("#imgDocHis").css('display', 'none');

            fnShowSampleIcon();
            //debugger;
            //     var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");

            if (batchPrivellage == 'YES') {
                $('#imgDocHis').hide();
                $('#historydocs').html('Batch Details');
                $("#batchdetails").html('');
                $("#batchdetailsss").html('');
                $("#dvDocDetails").html('');
                $("#dvDocDetailss").html('');
                $("#dvLastVisit").html('');
                $("#dvSamples").html('');
                $("#dvSampless").html('');
                $("#dvRemarks").html('');
                $("#dvRemarkss").html('');
                $("#dvDoctorProduct").hide();
                fnBindBatchDetails(rowIndex);
                $("#imageTP").hide();
            }
            else {
                //   $("#dvDoctorProduct").show();
                $("#batchdetails").html('');
                $("#batchdetailsss").html('');
                $("#dvDocDetailss").html('');
                $("#dvSampless").html('');
                $("#dvRemarkss").html('');
                $("#imageTP").show();
                $('#historydoc').html(' <span name="spnDoctorLabel">Doctor</span> Visit History');
                fnBindDoctorHistory(doctorCode, docDet);
            }

        },
        error: function (e) {
        }
    });
}
//FUNCTION TO BIND THE DOCTOR VISIT DETAILS
function fnBindDoctorHistory(doctorCode, docDet) {
    debugger;
    var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");


    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetDoctorVisitHistory',
        data: "DoctorCode=" + doctorCode + "&UserCode=" + $("#hdnUserCode").val() + "",
        success: function (response) {
            try {
                debugger;
                response = eval('(' + response + ')');
                //Doctor Visit History Div
                if (batchPrivellage == 'YES') {
                    $("#dvDocDetailss").html(docDet);
                }
                else {
                    $("#dvDocDetails").html(docDet);
                }

                var dcrRemarks = "<b>Remarks :</b>"
                var lastVisitContent = "<b>Last 3 Visits : </b>";
                for (var i = 0; i < response.Tables[0].Rows.length; i++) {
                    lastVisitContent += response.Tables[0].Rows[i].DCR_Actual_Date.toString() + " ;";
                    if (response.Tables[0].Rows[i].Remarks_By_User != null && response.Tables[0].Rows[i].Remarks_By_User != '') {
                        dcrRemarks += response.Tables[0].Rows[i].Remarks_By_User + " ,";
                    }
                    else {
                        dcrRemarks += '';
                    }
                }

                if (batchPrivellage == 'YES') {
                    $("#dvLastVisits").html(lastVisitContent);
                }
                else {
                    $("#dvLastVisit").html(lastVisitContent);
                }

                if (dcrRemarks == "<b>Remarks :</b> , , ,") {
                    dcrRemarks = "<b>Remarks :</b> No Remarks";
                }

                if (batchPrivellage == 'YES') {
                    $("#dvRemarkss").html(dcrRemarks);
                }
                else {
                    $("#dvRemarks").html(dcrRemarks);
                }


                //Last 3 visit sample given
                var proArr = new Array();
                for (var j = 0; j < response.Tables[1].Rows.length; j++) {
                    if ($.inArray(response.Tables[1].Rows[j].Product_Code, proArr) == -1) {
                        proArr.push(response.Tables[1].Rows[j].Product_Code);
                    }
                }

                var productContent = "<b>Product Sample & Details (last 3 visits)</b><br />";
                for (var p = 0; p < proArr.length; p++) {
                    var proDet = jsonPath(response, "$.Tables[1].Rows[?(@.Product_Code=='" + proArr[p].toString() + "')]");
                    var qtySum = 0;
                    var splitQty = "";
                    var prodetail = "";
                    for (var x = 0; x < proDet.length; x++) {
                        qtySum += proDet[x].Quantity_Provided;
                        splitQty += proDet[x].Quantity_Provided + " Nos " + proDet[x].DCR_Actual_Date + " ;";

                    }

                    if (proDet[0].Is_Detailed == "1") {
                        prodetail = "Detailed";
                    }
                    else {
                        prodetail = "Not-Detailed";
                    }

                    productContent += "<font style='color: #A30303'>" + (parseInt(p) + 1) + " . " + proDet[0].Product_Name.toString() + "</font>" + "(" + prodetail + ") - " + qtySum + " Nos ; (" + splitQty + ")<br />";
                }
                if (batchPrivellage == 'YES') {
                    $("#dvSampless").html(productContent);
                }
                else {
                    $("#dvSamples").html(productContent);
                }

                //Doctor product mapping
                var docProd = "<b>Product Mapping Details :</b></br>";

                for (var i = 0; i < response.Tables[2].Rows.length; i++) {
                    docProd += (i + 1) + ". " + response.Tables[2].Rows[i].Product_Name.toString() + " <br />";
                }
                if (batchPrivellage == 'YES') {
                    $("#dvDocProcs").html(docProd);
                } else {
                    $("#dvDocProc").html(docProd);
                }

                $("#dvDocHistory").css('display', '');
                $("#dvDocHistorys").css('display', '');

                $("#imgDocHis").css('display', 'none');
            }
            catch (e) {
                $("#imgDocHis").css('display', 'none');
            }
        },
        error: function (x, t, m) {
            if (t === "timeout") {
                alert("got timeout");
            } else {
                alert(t);
            }
        }
    });
}

//function to create new product row
function fnProductCreateNew(obj, doctorrowIndex) {
    //debugger;
    if (obj.id.split('_')[0] == "txtProduct") {
        fnValidateAutofill(obj, productJson_g, 'txtProduct_', 'hdnProCode_');
    }
    //function to read the product table and put it in doctor table 
    fnReadProductTable(doctorrowIndex);

    var rowIndex = obj.id.split('_')[1].toString();
    var rCnt = $("#tblProduct tr").length - 2;
    if (rowIndex == rCnt) {
        var newRow = document.getElementById("tblProduct").insertRow($("#tblProduct tr").length);
        var tdProduct = newRow.insertCell(0);
        $(tdProduct).html("<input style='width:180px' id='txtProduct_" + (parseInt(rowIndex) + 1) + "' class='productauto' onblur='fnProductCreateNew(this," + doctorrowIndex + ")' /><input type='hidden' id='hdnProCode_" + (parseInt(rowIndex) + 1) + "' />");
        var tdQty = newRow.insertCell(1);
        $(tdQty).html("<input style='width:50px' id='txtQty_" + (parseInt(rowIndex) + 1) + "' onblur='fnProductCreateNew(this," + doctorrowIndex + ")' />");

        autoComplete(productJson_g, "txtProduct", "hdnProCode", "productauto");
    }
}
var content_g = "";
//function to read the product table and put it in doctor table hidden
function fnReadProductTable(doctorrowIndex) {
    debugger;
    //get the doctor code
    if ($("#hdnDocCode_" + doctorrowIndex).val() != null || $("#hdnDocCode_" + doctorrowIndex).val() != "") {
        var doctorCode = $("#hdnDocCode_" + doctorrowIndex).val().split('_')[0].toString();
        var regionCode = $("#hdnDocCode_" + doctorrowIndex).val().split('_')[1].toString();

        //Remove all products for the doctor and rebind
        //fnfindAndRemove(doctorProductJSON_g, "id", doctorCode);
        doctorProductJSON_g.remove("id", doctorCode + "_" + regionCode);
    }
    var rCnt = $("#tblProduct tr").length - 2;
    var content = "";
    for (var r = 0; r <= rCnt; r++) {
        if ($("#hdnProCode_" + r).val() != "") {
            //content = "{\"id\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Doctor_Code + "" + '",' + "\"ProductCode\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Code + "" + '",' + "\"ProductName\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Name + "" + '",' + "\"Qty\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Quantity + "" + "\"Region_Code\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Doctor_Region_Code + "" + '"' + "}";
            content = "{\"id\"" + ":" + '"' + "" + $("#hdnDocCode_" + doctorrowIndex).val() + "" + '",' + "\"ProductCode\"" + ":" + '"' + "" + $("#hdnProCode_" + r).val() + "" + '",' + "\"ProductName\"" + ":" + '"' + "" + $("#txtProduct_" + r).val() + "" + '",' + "\"Qty\"" + ":" + '"' + "" + $("#txtQty_" + r).val() + "" + '"' + "}";

            //product duplication validation check
            var prod = jsonPath(doctorProductJSON_g, "$[?(@.id=='" + $("#hdnDocCode_" + doctorrowIndex).val() + "' && @.ProductCode=='" + $("#hdnProCode_" + r).val() + "')]");
            if (prod != false) {
                $("#spnDocDuplicateError").html('Product Name: <b>' + $("#txtProduct_" + r + "").val() + '</b> already exists');
                $("#txtProduct_" + r + "").val('');
                $("#txtProduct_" + r + "").focus();
                return false;
            }
            //Qty negative check
            if ($.trim($("#txtQty_" + r).val() != "")) {
                if (isNaN($("#txtQty_" + r).val())) {
                    $("#spnDocDuplicateError").html('Please enter valid Qty');
                    $("#txtQty_" + r).val('');
                    $("#txtQty_" + r).focus();
                    return false;
                }
                if ($("#txtQty_" + r).val() < 0) {
                    $("#spnDocDuplicateError").html('Please enter valid Qty');
                    $("#txtQty_" + r).val('');
                    $("#txtQty_" + r).focus();
                    return false;
                }
            }

            $("#spnDocDuplicateError").html('');
            doctorProductJSON_g.push(eval('(' + content + ')'));
        }
        else {
            if ($.trim($("#txtProduct_" + r).val()) != "") {
                $("#spnDocDuplicateError").html('Please enter valid product');
                $("#txtProduct_" + r).val('');
                $("#txtProduct_" + r).focus();
                return false;
            }
        }
    }

    //hold the product content in doctor table row hidden textbox
    $("#hdnProductDet_" + doctorrowIndex).val(content);
}
//function to show the sample given icon
function fnShowSampleIcon() {
    debugger;
    if (doctorProductJSON_g.length > 0) {
        for (var d = 0; d < $("#tblOverlayDoc tr").length - 1; d++) {
            var prod = jsonPath(doctorProductJSON_g, "$[?(@.id=='" + $("#hdnDocCode_" + d).val().split('_')[0].toString() + "_" + $("#hdnDocCode_" + d).val().split('_')[1].toString() + "')]");
            if (prod != false && prod.length > 0) {
                $("#imgSample_" + d).css('display', '');
            }
            else {
                $("#imgSample_" + d).css('display', 'none');
            }
        }
    }

}

//******************* Overlay functions ends here ******************//
//********************* Common Functions starts here *************************//
//To Get the all the privilege which is mapped to the user
function fnGetAllPrivileges(userCode) {
    //debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/Master/GetPrivilegesByUser',
        data: "UserCode=" + userCode + "",
        async: false,
        success: function (response) {
            userPrivilege_g = response;

            //Get the user information all the page events fired from here
            fnGetuserInfo(userCode);
        },
        error: function (e) {
        }
    });
}
// Retrives the Privilege Value.
function fnGetPrivilegeVal(privilegeName, defaultValue) {
    if (userPrivilege_g != null) {
        if (privilegeName != "") {
            var selectedValue = jsonPath(userPrivilege_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue != null && selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}
//********************* Common Functions ends here *************************//

//**************** TP Insertion starts here ****************************//


//function to insert the TP
function fnSubmit(status) {
    //debugger;
    $("#btnSaveTP").hide();
    $("#btnSaveasDraft").hide();
    if (fnValidateSFC()) {
        debugger;
        //tp date
        var tpDate = $("#hdnTPDate").val();
        //call objective
        var callObj = $("#drpCallObj").val();
        //accompanist
        var accObj = $(".accompanist-input-token").tokenInput('get');
        var accompanistRegionCode = "";
        var accompanistUserCode = "";
        var docCount = "0";
        var accomapnistCount = 0;
        debugger;
        for (var i = 0; i < accObj.length; i++) {
            var acccount = $.grep(acoompanistData.Tables[0].Rows, function (v) {
                return v.User_Code == accObj[i].value && v.Region_Code == accObj[i].id && v.Customer_Count_Per_Region > 0;
            });
            accomapnistCount = accomapnistCount + acccount.length;

            if (acccount.length == 0) {
                var OutAccCount = $.grep(outsideAccomapnist, function (v) {
                    return v.User_Code == accObj[i].value && v.Region_Code == accObj[i].id && v.Customer_Count_Per_Region > 0;
                });
                accomapnistCount = accomapnistCount + OutAccCount.length;
            }
        }
        var accompContent = "";

        var accompanist_min_value = parseInt(fnGetPrivilegeVal("ACCOMPANIST_ENTER_MIN_IN_TP", "0"));
        if (accompanist_min_value != "0") {
            if (accomapnistCount < accompanist_min_value) {
                fnMsgAlert('info', 'info', 'You need to enter atleast ' + accompanist_min_value + ' accompanist that have atleast 1 doctor.');
                if (privVisitCount == "YES") {
                    $("#btnSaveTP").hide();
                }
                else {
                    $("#btnSaveTP").show();
                    $("#btnSaveasDraft").show();
                }
                return false;
            }
        }
        var accompanist_max_value = parseInt(fnGetPrivilegeVal("ACCOMPANIST_ENTER_MAX_IN_TP", "4"));
        if (accompanist_max_value > 4) {
            accompanist_max_value = 4;
        }
        if (accompanist_max_value != "0") {
            if (accomapnistCount > accompanist_max_value) {
                fnMsgAlert('info', 'info', 'You can enter a maximum of ' + accompanist_max_value + ' accompanist that have atleast 1 doctor.');
                if (privVisitCount == "YES") {
                    $("#btnSaveTP").hide();
                }
                else {
                    $("#btnSaveTP").show();
                    $("#btnSaveasDraft").show();
                }
                return false;
            }
        }

        var acount = 0;
        var aOnlycount = 0;
        for (var a = 0; a < accObj.length; a++) {
            if (accObj[a].name.split(',')[1].split('(')[0].toString().toUpperCase() != "VACANT" && accObj[a].name.split(',')[1].split('(')[0].toString().toUpperCase() != "NOT ASSIGNED") {
                acount++;
                accompContent += "acc_" + parseInt(a + 1) + "=" + accObj[a].name.split(',')[1].split('(')[0].toString() + "&";
            }
            else if (accObj[a].name.split(',')[1].split('(')[0].toString().toUpperCase() == "VACANT" || accObj[a].name.split(',')[1].split('(')[0].toString().toUpperCase() == "NOT ASSIGNED") {
                aOnlycount++;
                accompContent += "accOnly_" + parseInt(a + 1) + "=" + accObj[a].id + "&";
            }
        }

        //for (var a = 0; a < accObj.length; a++) {
        //    if (accObj[a].name.split(',')[1].split('(')[0].toString().toUpperCase() == "VACANT" || accObj[a].name.split(',')[1].split('(')[0].toString().toUpperCase() == "NOT ASSIGNED") {
        //        aOnlycount++;
        //        accompContent += "accOnly_" + aOnlycount + "=" + accObj[a].id + "&";
        //    }
        //}

        accompContent = accompContent.slice(0, -1);

        //Cp Code
        var cpCode = $("#hdnCPCode").val();
        //category
        var category = $("#drpCategory :selected").text();
        //workplace
        if ($("#drpCallObj").val() != "LEAVE") {
            var objWP = $("#txtWorkPlace").tokenInput('get');
            var workPlace = "";
            var wlength = (objWP.length) - 1;
            for (var w = 0; w < objWP.length; w++) {
                if (w == wlength) {
                    workPlace += objWP[w].id.toString();
                }
                else {
                    workPlace += objWP[w].id.toString() + ",";
                }
            }
            if (workPlace.length > 100) {
                fnMsgAlert('info', 'DCR Header', "Please enter minimum 100 character in Work Place");
                if (privVisitCount == "YES") {
                    $("#btnSaveTP").hide();
                }
                else {
                    $("#btnSaveTP").show();
                    $("#btnSaveasDraft").show();
                }
                return false;
            }
        }

        //sfc hop
        var length = $("#tblSFCHOP tr").length;
        var fromPlace = "";
        var toPlace = "";
        var travelm = "";
        var sfcCount = length;
        var sfcContent = "";

        for (var i = 1; i <= length; i++) {
            SFCVersionNo = ""; TravelMode = ""; SFCCategoryName = ""; Distance = "0"; FareAmount = "0"; SFCVisitCount = "0"; SFCRegionCode = "";
            fromPlace = $("#txtFormPlace_" + i).val();
            toPlace = $("#txtToPlace_" + i).val();
            travelm = $("#txtTravelMode_" + i).val();
            if ($.trim(fromPlace) != "" && $.trim(toPlace) != "" && $.trim(travelm).length > 0) {
                sfcContent += "fromPlace_" + i + "=" + fromPlace + "&";
                sfcContent += "toPlace_" + i + "=" + toPlace + "&";
                sfcContent += "sfcCode_" + i + "=" + $("#hdnDistanceFareCode_" + i).val() + "&";
                sfcContent += "SFCVersionNo_" + i + "=" + $("#hdnSFCVersion_" + i).val() + "&";
                sfcContent += "TravelMode_" + i + "=" + $("#txtTravelMode_" + i).val() + "&";
                sfcContent += "SFCCategoryName_" + i + "=" + $("#hdnSFCCategory_" + i).val() + "&";
                sfcContent += "Distance_" + i + "=" + $("#hdnDistance_" + i).val() + "&";
                sfcContent += "FareAmount_" + i + "=" + $("#hdnFare_" + i).val() + "&";
                sfcContent += "SFCVisitCount_" + i + "=" + $("#hdnSFCVisitCount_" + i).val() + "&";
                sfcContent += "SFCRegionCode_" + i + "=" + $("#hdnSFCRegion_" + i).val() + "&";
            }
        }
        sfcContent = sfcContent.slice(0, -1)
        if ((sfcContent == null || sfcContent.length == 0) && callObj != "LEAVE") {
            // $("#dvinprogtext").html('saving tour planner information');
            $("#dvInProgress").css('display', 'none');
            if (privVisitCount == "YES")
                $("#btnSaveTP").hide();
            else
                $("#btnSaveTP").show();
            $("#btnSaveasDraft").show();
            fnMsgAlert("info", "Tour Planner", "Please enter atlease one SFC Route.");
            return false;
        }

        //Doctors
        var docObj = $("#txtDoctor").tokenInput('get');
        var docCount = docObj.length;
        var docContent = "";

        for (var d = 0; d < docObj.length; d++) {
            docContent += "doc_" + (d + 1) + "=" + docObj[d].id + "&";
        }

        //Remarks
        var remarks = $("#txtRemarks").val();
        if (remarks == "Remarks") {
            remarks = "";
        }
        // Meeting Point
        var meetingPoint = "", meetingTime = "";
        if ($("#txtMeetingPoint").val() != "" && $("#txtMeetingPoint").val() != null) {
            meetingPoint = $("#txtMeetingPoint").val();
        }

        // Meeting Time       
        if ($("#txtMeetingTime").val() != "" && $("#txtMeetingTime").val() != null) {
            meetingTime = $("#txtMeetingTime").val();
        }

        var tp_Approval_needed = fnGetPrivilegeVal('DCR_ENTRY_TP_APPROVAL_NEEDED', 'NO');

        doctorJSON_g.remove("id", 0);
        doctorProductJSON_g.remove("id", 0);
        //debugger;
        if ($("#drpCallObj").val().toUpperCase() == "FIELD_RCPA") {
            fnValidateDocMandatory();
        }
        if ($("#drpCallObj").val().toUpperCase() == "ATTENDANCE") {
            if ($("#drpActivity").val() == null) {
                fnMsgAlert('info', 'Tour Planner', 'Activity has not mapped,Please contact the system admin to map activity');
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
                return false;
            }
        }
        //debugger;
        if (TPAccMandatoryFlag == 0) {
            $("#dvinprogtext").html('saving tour planner information');
            $("#dvInProgress").css('display', '');
            //Generate data for save
            var tpContent = "TPDate=" + tpDate + "&CallObjective=" + callObj + "&" + accompContent + "&NoOfAccompanist=" + acount + "&AccompanistOnlyDocCount=" + aOnlycount + "&";
            tpContent += "&CPCode=" + cpCode + "&Category=" + category + "&WorkPlace=" + workPlace + "&" + sfcContent + "&SFCCount=" + sfcCount + "&Doctors=" + JSON.stringify(doctorJSON_g) + "";
            tpContent += "&DoctorProduct=" + JSON.stringify(doctorProductJSON_g) + "&UserCode=" + $("#hdnUserCode").val() + "&Remarks=" + remarks + "&ActivityCode=" + $("#drpActivity").val() + "&LeaveTypeCode=" + $("#drpLeaveTypes").val();
            tpContent += "&meeingPoint=" + meetingPoint + "&meetingTime=" + meetingTime + "&tp_Approval_Nedded=" + tp_Approval_needed + "&TPStatus=" + status + "&TPBatch=" + JSON.stringify(batch_val);

            //Insert TP
            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Activity/TourPlanner/InsertTP',
                data: tpContent,
                async: false,
                success: function (response) {
                    if (response.split(':')[0] == "PASS") {
                        fnMsgAlert('success', 'Tour Planner', 'Tour planner saved successfully');
                        var year = tpDate.split('-')[0].toString();
                        var month = tpDate.split('-')[1].toString();
                        fetchTPDays(year, month);
                        $("#dvDatePicker").datepicker("refresh");
                        //$('#dvCalendar').fullCalendar('refetchEvents');
                        fnClearAll();
                        $('.productauto ').val('');
                        $('.quality').val('');
                        $("#txtTpDate").val('');
                        //to clear tp-date
                        $("#dvTPDate").html('');
                        $("#dvBigDate").html('');
                        $("#dvday").html('');
                        $("#hdnTPDate").val('')
                        $("#txtMeetingTime").val('')
                        $("#txtMeetingPoint").val('')

                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                    }
                    else {
                        fnMsgAlert('error', 'Tour Planner', response.split(':')[1]);
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                    }
                    $("#dvInProgress").css('display', 'none');
                    //fnMonthClick();
                },
                complete: function (respon) {
                    //re fetching the events
                    //$('#dvCalendar').fullCalendar('refetchEvents');
                },
                error: function (e) {
                }
            });
        }
    }
}

//Validations
//function to validate SFC
function fnValidateSFC() {
    debugger;
    //controls validations
    if ($.trim($("#txtTpDate").val()) == '') {
        $("#spnTpDateError").html('Please select TP Date');
        if (privVisitCount == "YES")
            $("#btnSaveTP").hide();
        else
            $("#btnSaveTP").show();
        $("#btnSaveasDraft").show();
        return false;
    }

    if ($("#drpCallObj").val().toUpperCase() == "FIELD" || $("#drpCallObj").val().toUpperCase() == "FIELD_RCPA" || $("#drpCallObj").val().toUpperCase() == "ATTENDANCE") {
        if ($("#drpCategory").val() == "0") {
            fnMsgAlert('info', 'Tour Planner', 'Please select "Category"');
            if (privVisitCount == "YES")
                $("#btnSaveTP").hide();
            else
                $("#btnSaveTP").show();
            $("#btnSaveasDraft").show();
            return false;
        }
    }
    else {
        if ($("#drpLeaveTypes").val() == "0" || $.trim($("#drpLeaveTypes").val()).length == 0 || $("#drpLeaveTypes").val() == null || $("#drpLeaveTypes").val() == 'null') {
            //$("#spnCPError").html('Please select leave type');
            fnMsgAlert('info', 'Tour Planner', 'Please select leave type');
            if (privVisitCount == "YES")
                $("#btnSaveTP").hide();
            else
                $("#btnSaveTP").show();
            $("#btnSaveasDraft").show();
            return false;
        }
    }

    //cp validation
    if ($("#drpCallObj").val().toUpperCase() == "FIELD" || $("#drpCallObj").val().toUpperCase() == "FIELD_RCPA") {
        if ($("#txtCPName").val() != "") {
            if ($("#hdnCPCode").val() == "") {
                fnMsgAlert('info', 'Tour Planner', 'Please enter valid "CP"');
                //$("#spnCPError").html('Please enter valid CP');
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
                return false;
            }
            else {
                $("#spnCPError").html('');
            }
        }
    }
    //special char check for work area
    //var result = fnChkSplChar("txtWorkPlace");
    //if (!result) {
    //    $("#txtWorkPlace").addClass('error');
    //    fnMsgAlert('error', 'Error', 'Please remove special character from "Work Place"');
    //    if (privVisitCount == "YES")
    //        $("#btnSaveTP").hide();
    //    else
    //        $("#btnSaveTP").show();
    //    $("#btnSaveasDraft").show();
    //    return false;
    //}
    if ($("#drpCallObj").val().toUpperCase() == "FIELD" || $("#drpCallObj").val().toUpperCase() == "FIELD_RCPA" || $("#drpCallObj").val().toUpperCase() == "ATTENDANCE") {
        debugger;
        var work_place = $("#txtWorkPlace").tokenInput('get');
        if (work_place == "") {
            if (privVisitCount == "YES")
                $("#btnSaveTP").hide();
            else
                $("#btnSaveTP").show();
            $("#btnSaveasDraft").show();
            fnMsgAlert('info', 'Tour Planner', 'Please enter "Work place"');
            return false;
        }

        if ($("#tblSFCHOP tr").length == 1) {
            for (var index = 1; index <= $("#tblSFCHOP tr").length ; index++) {

                $("#txtFormPlace_" + index).removeClass('error');
                $("#txtToPlace_" + index).removeClass('error');


                var fromPlace = $("#txtFormPlace_" + index).val();
                var toPlace = $("#txtToPlace_" + index).val();
                var TravelMode = $("#txtTravelMode_" + index).val();
                // From and to place empty validation 
                if ($.trim(fromPlace).length > 0 && $.trim(toPlace).length > 0) {
                    if ($("#txtFormPlace_" + index).val() == "") {
                        $("#txtFormPlace_" + index).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        fnMsgAlert('info', 'Tour Planner', 'Please enter "From place"');
                        return false;
                    }

                    if ($("#txtToPlace_" + index).val() == "") {
                        $("#txtToPlace_" + index).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        fnMsgAlert('info', 'Tour Planner', 'Please enter "To place"');
                        return false;
                    }

                    if ($.trim($("#txtTravelMode_" + index).val()).length == 0) {
                        $("#txtTravelMode_" + index).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        fnMsgAlert('info', 'Tour Planner', 'Please enter Travel Mode');
                        return false;
                    }
                    else {
                        if (!fnValidateTravelMode($("#txtTravelMode_" + index)[0])) {
                            $("#txtTravelMode_" + index).addClass('error');
                            if (privVisitCount == "YES")
                                $("#btnSaveTP").hide();
                            else
                                $("#btnSaveTP").show();
                            $("#btnSaveasDraft").show();
                            return false;
                        }
                    }


                }
            }
        }
        else {
            for (var index = 1; index <= $("#tblSFCHOP tr").length - 1; index++) {
                $("#txtFormPlace_" + index).removeClass('error');
                $("#txtToPlace_" + index).removeClass('error');

                var fromPlace = $("#txtFormPlace_" + index).val();
                var toPlace = $("#txtToPlace_" + index).val();
                var TravelMode = $("#txtTravelMode_" + index).val();
                // From and to place empty validation 
                if ($.trim(fromPlace).length > 0 && $.trim(toPlace).length > 0) {
                    if ($("#txtFormPlace_" + index).val() == "") {
                        $("#txtFormPlace_" + index).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        fnMsgAlert('info', 'Tour Planner', 'Please enter "From place"');
                        return false;
                    }

                    if ($("#txtToPlace_" + index).val() == "") {
                        $("#txtToPlace_" + index).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        fnMsgAlert('info', 'Tour Planner', 'Please enter "To place"');
                        return false;
                    }
                    if ($.trim($("#txtTravelMode_" + index).val()).length == 0) {
                        $("#txtTravelMode_" + index).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        fnMsgAlert('info', 'Tour Planner', 'Please enter Travel Mode');
                        return false;
                    }
                    else {
                        if (!fnValidateTravelMode($("#txtTravelMode_" + index)[0])) {
                            $("#txtTravelMode_" + index).addClass('error');
                            if (privVisitCount == "YES")
                                $("#btnSaveTP").hide();
                            else
                                $("#btnSaveTP").show();
                            $("#btnSaveasDraft").show();
                            return false;
                        }
                    }
                }
            }
        }
    }

    var length = $("#tblSFCHOP tr").length;

    for (var i = 1; i <= length; i++) {

        fromPlace = $("#txtFormPlace_" + i).val();
        toPlace = $("#txtToPlace_" + i).val();
        var TravelMode = $("#txtTravelMode_" + i).val();

        if ($.trim(fromPlace).length > 0 && $.trim(toPlace).length > 0 && $.trim(TravelMode).length > 0) {
            for (var j = 1; j < length; j++) {
                var fp = $("#txtFormPlace_" + j).val();
                var tp = $("#txtToPlace_" + j).val();

                if (fromPlace == fp && toPlace == tp && i != j) {
                    fnMsgAlert('info', 'Tour Planner', 'Duplicate From & To Place exist in Place details. Please remove one then click the Save/Save as draft.');
                    if (privVisitCount == "YES")
                        $("#btnSaveTP").hide();
                    else
                        $("#btnSaveTP").show();
                    $("#btnSaveasDraft").show();
                    return false;
                }

            }
        }
    }

    //Tour Planner
    var priv = "";
    var privArr = new Array();

    //CP mandatory validation
    //debugger;
    if ($("#drpCallObj").val().toUpperCase() != "LEAVE" && $("#drpCallObj").val().toUpperCase() != "ATTENDANCE") {
        priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO");
        privArr = priv.split(',');
        if ($.inArray("YES", privArr) > -1) {
            if ($("#hdnCPCode").val() == "") {
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
                fnMsgAlert('info', 'Tour Planner', 'Please enter "Beat / Patch Plan Name"');
                return false;
            }
        }
    }

    priv = fnGetPrivilegeVal("SFC_VALIDATION", "");
    privArr = priv.split(',');
    if ($.inArray($("#drpCategory :selected").text(), privArr) > -1) {
        for (var s = 1; s <= $("#tblSFCHOP tr").length; s++) {
            $("#txtFormPlace_" + s).removeClass('error');
            $("#txtToPlace_" + s).removeClass('error');

            var fromPlace = $("#txtFormPlace_" + s).val();
            var toPlace = $("#txtToPlace_" + s).val();

            // From and to place empty validation            
            if ($.trim(fromPlace).length > 0 && $.trim(toPlace).length > 0) {
                if ($.trim(fromPlace) != "") {
                    //special char check for from place and to place
                    var result = fnChkSplChar("txtFormPlace_" + s);
                    if (!result) {
                        $("#txtFormPlace_" + s).addClass('error');
                        fnMsgAlert('error', 'Error', 'Please remove special character from "from place"');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;
                    }
                    else {
                        $("#txtFormPlace_" + s).removeClass('error');
                    }

                    var result = fnChkSplChar("txtToPlace_" + s);
                    if (!result) {
                        $("#txtToPlace_" + s).addClass('error');
                        fnMsgAlert('error', 'Error', 'Please remove specail character from "to place"');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;
                    }
                    else {
                        $("#txtToPlace_" + s).removeClass('error');
                    }

                    //From place validation
                    var sfcJson = jsonPath(allsfc_g, "$.[?(@.value=='" + fromPlace.toUpperCase() + "')]");
                    if (sfcJson == false || sfcJson == undefined) {
                        $("#txtFormPlace_" + s).addClass('error');
                        fnMsgAlert('error', 'Error', 'Please validate from place');
                        $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;


                    }
                    else {
                        $("#txtFormPlace_" + s).removeClass('error');
                    }

                    //to place validation
                    var sfcJson = jsonPath(allsfc_g, "$.[?(@.value=='" + toPlace.toUpperCase() + "')]");
                    if (sfcJson == false || sfcJson == undefined) {
                        $("#txtToPlace_" + s).addClass('error');
                        fnMsgAlert('error', 'Error', 'Please validate to place');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;

                    }
                    else {
                        $("#txtToPlace_" + s).removeClass('error');
                    }

                    //SFC_VALIDATION Check
                    //to check my own SFC & my accomapnist sfc
                    var distanceSfc = "0.00";
                    var distanceJson = "";
                    if ($("#hdnDistance_" + s).val() != null && $("#hdnDistance_" + s).val().length > 0) {
                        distanceSfc = $("#hdnDistance_" + s).val();
                    }
                    if (categoryCheckNeededTP == "YES") { // sfc category check
                        distanceJson = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + $("#txtFormPlace_" + s).val().toUpperCase()
                                                           + "' & @.To_Place == '" + $("#txtToPlace_" + s).val().toUpperCase()
                                                           + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + s).val().toUpperCase()
                                                           + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + s).val()
                                                           + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_" + s).val()
                                                           + "' ) | (@.From_Place=='" + $("#txtToPlace_" + s).val()
                                                              + "' & @.To_Place == '" + $("#txtFormPlace_" + s).val()
                                                              + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + s).val()
                                                              + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + s).val()
                                                              + "' & @.SFC_Category_Name == '" + $("#hdnSFCCategory_" + s).val() + "'))]");
                    }
                    else {
                        distanceJson = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + $("#txtFormPlace_" + s).val().toUpperCase()
                                                           + "' & @.To_Place == '" + $("#txtToPlace_" + s).val().toUpperCase()
                                                           + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + s).val().toUpperCase()
                                                           + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + s).val()
                                                           + "') | (@.From_Place=='" + $("#txtToPlace_" + s).val()
                                                             + "' & @.To_Place == '" + $("#txtFormPlace_" + s).val()
                                                             + "' & @.Travel_Mode == '" + $("#txtTravelMode_" + s).val()
                                                             + "' & @.SFC_Region_Code == '" + $("#hdnSFCRegion_" + s).val() + "'))]");
                    }
                    debugger;
                    if (distanceJson.length > 0 && $("#hdnDistanceFareCode_" + s).val() == '') {
                        fnMsgAlert('info', 'Tour Planner', 'You have not selected SFC from the master.Please select the SFC from the master');
                        $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;
                    }
                    if (!distanceJson) {
                        //if (distanceJson == null || !distanceJson) {
                        fnMsgAlert('info', 'Tour Planner', 'The entered route is not available in your SFC master.');
                        //$.msgbox("The entered route is not available in your SFC master.");
                        $("#txtFormPlace_" + s).addClass('error');
                        $("#txtToPlace_" + s).addClass('error');
                        $("#txtTravelMode_" + s).addClass('error');
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;
                    }
                    else {
                        $("#txtFormPlace_" + s).removeClass('error');
                        $("#txtToPlace_" + s).removeClass('error');
                        $("#txtTravelMode_" + s).removeClass('error');
                    }
                    //var sfcplaceJson = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + fromPlace.toUpperCase() + "' & @.To_Place == '" + toPlace.toUpperCase() + "') | (@.From_Place=='" + toPlace.toUpperCase() + "' & @.To_Place == '" + fromPlace.toUpperCase() + "'))]");

                    //if (sfcplaceJson == false || sfcplaceJson == undefined) {
                    //    //check to select the accompanist from overlay
                    //    sfcplaceJson = jsonPath(accSFCJson_g, "$.[?((@.From_Place=='" + fromPlace.toUpperCase() + "' & @.To_Place == '" + toPlace.toUpperCase() + "') | (@.From_Place=='" + toPlace.toUpperCase() + "' & @.To_Place == '" + fromPlace.toUpperCase() + "'))]");
                    //    if (sfcplaceJson == false || sfcplaceJson == undefined) {
                    //        fnMsgAlert('error', 'Error', 'The entered route is not available in your SFC master');
                    //        $("#txtFormPlace_" + s).addClass('error');
                    //        $("#txtToPlace_" + s).addClass('error');
                    //        return false;
                    //    }
                    //    else {
                    //        $("#txtFormPlace_" + s).removeClass('error');
                    //        $("#txtToPlace_" + s).removeClass('error');
                    //    }
                    //}
                    //else {
                    //    //to check the SFC_CATEGORY_DONT_CHECK
                    //    priv = fnGetPrivilegeVal("SFC_CATEGORY_DONT_CHECK", "");
                    //    privArr = priv.split(',');

                    //    var categoryCheckNeeded = "YES";
                    //    if ($.inArray("TP", privArr) > -1) { // don check the sfc data with category, if it is mapped with DCR.
                    //        categoryCheckNeeded = "NO";
                    //    }

                    //    if (categoryCheckNeeded == "YES") { // SFC_CATEGORY_DON_CHECK privilege.
                    //        if ($("#drpCategory :selected").text().toUpperCase() != sfcplaceJson[0].Category_Name.toUpperCase()) {
                    //            fnMsgAlert('error', 'Error', 'The entered route & category is not available in your SFC master.');
                    //            $("#txtFormPlace_" + s).addClass('error');
                    //            $("#txtToPlace_" + s).addClass('error');
                    //            return false;
                    //        }
                    //        else {
                    //            $("#txtFormPlace_" + s).removeClass('error');
                    //            $("#txtToPlace_" + s).removeClass('error');
                    //        }
                    //    }
                    //}

                }
            }
        }
    }

    //Common validation

    for (var s = 1; s <= $("#tblSFCHOP tr").length; s++) {
        $("#txtFormPlace_" + s).removeClass('error');
        $("#txtToPlace_" + s).removeClass('error');

        var fromPlace = $("#txtFormPlace_" + s).val();
        var toPlace = $("#txtToPlace_" + s).val();

        // From and to place empty validation            



        if ($.trim(fromPlace) != "") {
            //special char check for from place and to place


            var results = fnChkSplChar("txtFormPlace_" + s);
            if (!results) {
                $("#txtFormPlace_" + s).addClass('error');
                fnMsgAlert('error', 'Error', 'Please remove special character from "from place"');
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
                return false;
            }
            else {
                $("#txtFormPlace_" + s).removeClass('error');
            }

            var results = fnChkSplChar("txtToPlace_" + s);
            if (!results) {
                $("#txtToPlace_" + s).addClass('error');
                fnMsgAlert('error', 'Error', 'Please remove special character from "to place"');
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
                return false;
            }
            else {
                $("#txtToPlace_" + s).removeClass('error');
            }

            var results = fnChkSplChar("txtTravelMode_" + s);
            if (!results) {
                $("#txtTravelMode_" + s).addClass('error');
                fnMsgAlert('error', 'Error', 'Please remove special character from Travel mode');
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
                return false;
            }
            else {
                $("#txtTravelMode_" + s).removeClass('error');
            }

        }
    }

    //var result = fnChkSplChar("txtRemarks");
    //if (!result) {
    //    $("#spnRemarksError").html('Please enter valid remarks');
    //    if (privVisitCount == "YES")
    //        $("#btnSaveTP").hide();
    //    else
    //        $("#btnSaveTP").show();
    //    $("#btnSaveasDraft").show();
    //    return false;
    //}

    //var res = fnChkSplChar("txtWorkPlace");
    //if (!res) {
    //    fnMsgAlert('error', 'Error', 'Please remove special character from Work Place');
    //    return false;
    //}

    var r = fnChkSplChar("txtMeetingPoint");
    if (!r) {
        fnMsgAlert('error', 'Error', 'Please remove special character from Meeting Point');
        return false;
    }

    var result = fnChkSplCharForRemarks("txtRemarks");
    if (!result) {
        //$("#spnRemarksError").html('Only (a-z A-Z 0-9 ().,-_) special characters are allowed in the Remarks.');
        fnMsgAlert('info', 'Info', 'Special characters <b>( ~`^&<>\ )</b> are not allowed in the remarks.');
        if (privVisitCount == "YES") {
            $("#btnSaveTP").hide();
        }
        else {
            $("#btnSaveTP").show();
        }
        $("#btnSaveasDraft").show();
        return false;
    }

    return true;
}

//function to check SFC_COUNT_CHECK_IN_TP
function fnSFCCountCheck(status) {
    //debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetTPSFC',
        data: "TPDate=" + $("#hdnTPDate").val() + "&UserCode=" + $("#hdnUserCode").val() + "",
        success: function (response) {
            response = eval('(' + response + ')');
            //sfc hop           
            var length = $("#tblSFCHOP tr").length;
            var fromPlace = "";
            var toPlace = "";
            var sfcCode = "";
            var travelMode = "";
            var sfcFromPlace = ""
            var sfcToPlace = ""
            var sfcCategory = ""
            for (var i = 1; i <= length; i++) {
                sfcCode = "";
                sfcVersion = "";
                fromPlace = $("#txtFormPlace_" + i).val();
                toPlace = $("#txtToPlace_" + i).val();
                travelMode = $('#txtTravelMode_' + i).val();
                if ($.trim(fromPlace) != "" && $.trim(toPlace) != "") {
                    //to get the sfc code
                    var sfcplaceJson = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + fromPlace.toUpperCase() + "' & @.To_Place == '" + toPlace.toUpperCase() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "') | (@.From_Place=='" + toPlace.toUpperCase() + "' & @.To_Place == '" + fromPlace.toUpperCase() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "'))]");
                    if (sfcplaceJson == false || sfcplaceJson == undefined) {
                        //check to select the accompanist from overlay
                        sfcplaceJson = jsonPath(accSFCJson_g, "$.[?((@.From_Place=='" + fromPlace.toUpperCase() + "' & @.To_Place == '" + toPlace.toUpperCase() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "')  | (@.From_Place=='" + toPlace.toUpperCase() + "' & @.To_Place == '" + fromPlace.toUpperCase() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "'))]");
                        if (sfcplaceJson != false && sfcplaceJson != undefined) {

                            sfcCode = sfcplaceJson[0].Distance_Fare_Code;
                            sfcVersion = sfcplaceJson[0].SFC_Version_No;
                        }
                    }
                    else {
                        sfcFromPlace = sfcplaceJson[0].From_Place;
                        sfcToPlace = sfcplaceJson[0].To_Place;
                        sfcCategory = sfcplaceJson[0].Category_Name;
                        sfcCode = sfcplaceJson[0].Distance_Fare_Code;
                        sfcVersion = sfcplaceJson[0].SFC_Version_No;
                    }

                    for (var j = 1; j < length; j++) {
                        var fp = $("#txtFormPlace_" + j).val();
                        var tp = $("#txtToPlace_" + j).val();

                        if (fromPlace == fp && toPlace == tp && i != j) {
                            fnMsgAlert('info', 'Tour Planner', 'Duplicate From & To Place exist in Place details. Please remove one then submit.');
                            if (privVisitCount == "YES")
                                $("#btnSaveTP").hide();
                            else
                                $("#btnSaveTP").show();
                            $("#btnSaveasDraft").show();
                            return false;
                        }

                    }

                    if (sfcCode != "") {
                        var sfc = jsonPath(response, "$.Tables[0].Rows[?(@.From_Place =='" + sfcFromPlace + "' & @.To_Place =='" + sfcToPlace + "' & @.Category_Name =='" + sfcCategory + "' )]");
                        if (sfc != false) {
                            var sfcCount = 0;
                            $.grep(sfc, function (e, i) {
                                sfcCount += e.Count;
                            });
                            var tpSFCCount = parseInt(sfcCount) + 1;
                            var sfcvisit = jsonPath(response, "$.Tables[1].Rows[?(@.From_Place =='" + sfcFromPlace + "' & @.To_Place =='" + sfcToPlace + "' & @.Category_Name =='" + sfcCategory + "' )]");
                            if (sfcvisit != false && sfcvisit != null && sfcvisit[0].SFC_Visit_Count != null) {
                                if (sfcvisit[0].SFC_Visit_Count > 0) {
                                    if (tpSFCCount > sfcvisit[0].SFC_Visit_Count) {
                                        $("#spnSFCError").html(fromPlace + ' to ' + toPlace + ' , exceeds monthly visit limit count.(Allowed visit count : ' + sfcvisit[0].SFC_Visit_Count + ')')
                                        if (privVisitCount == "YES")
                                            $("#btnSaveTP").hide();
                                        else
                                            $("#btnSaveTP").show();
                                        $("#btnSaveasDraft").show();
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }


            //calling submit
            fnSubmit(status);

        },
        complete: function (respon) {
        },
        error: function (e) {
        }
    });
}

//function to call save
function fnSaveTP(status) {
    //debugger;
    var cp_code_Status = true;
    var curRegionCode = $("#hdnRegionCode").val();
    var sfcRegionCode = "";
    if ($("[name='chkSFCSelect']:checked").length > 0)
        sfcRegionCode = $("[name='chkSFCSelect']:checked").val().split('_')[5];
    if ($("#drpCallObj").val().toUpperCase() == "FIELD" || $("#drpCallObj").val().toUpperCase() == "FIELD_RCPA")
        if ($("#hdnCPCode").val() != undefined && $("#hdnCPCode").val() != "" && $("#hdnCPCode").val() != "0")
            cp_code_Status = fnCheckCpLastEnteredDate()
    if (cp_code_Status) {
        //for SFC Count check

        var sfcCnt = "";
        sfcCnt = fnGetPrivilegeVal("SFC_COUNT_CHECK_IN_TP", "NO");
        $("#spnSFCError").html('');
        // Validate meeting palce and time method

        if (fnValidateMeetingPlace()) {
            if (fnCheckHiDoctorStartDateforDay()) {
                if (sfcCnt == "YES" && (sfcRegionCode == "" || (sfcRegionCode == curRegionCode))) {
                    fnSFCCountCheck(status); //calling sfc count check then call submit function
                }
                else {
                    fnSubmit(status); //calling function submit
                }
            }
            else {
                if (privVisitCount == "YES")
                    $("#btnSaveTP").hide();
                else
                    $("#btnSaveTP").show();
                $("#btnSaveasDraft").show();
            }
        }
        else {
            if (privVisitCount == "YES")
                $("#btnSaveTP").hide();
            else
                $("#btnSaveTP").show();
            $("#btnSaveasDraft").show();
        }
    }
}

function fnValidateDocMandatory() {
    var accUserCode = "";
    var accRegionCode = "";

    var acc = $(".accompanist-input-token").tokenInput('get');

    for (var i = 0; i < acc.length; i++) {
        accUserCode = accUserCode + "," + acc[i].value;
        if (acc[i].id != '') {
            accRegionCode = accRegionCode + "," + acc[i].id;
        }
    }
    accUserCode = accUserCode.replace(',', '');



    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetTPMandatoryDetails',
        data: "UserCode=" + $("#hdnUserCode").val() + "&accRegionCode=" + accRegionCode,
        async: false,
        success: function (result) {
            var tpDocMandatory;
            var tpDocMandatory = "";
            var tpPrevilege = [];
            var tpPrevilegeValue = "";
            var privilgeValueArr = [];
            var tpDoctor = [];
            var tpAccomp = [];
            var AccompUsers = "";

            if (result != "") {
                tpDocMandatory = eval('(' + result + ')');

                if (tpDocMandatory != 0) {

                    TPAccMandatoryFlag = 0;
                    if (tpDocMandatory.Tables.length != 0) {
                        if (tpDocMandatory.Tables[1].Rows.length != 0) {
                            tpPrevilege.push(tpDocMandatory.Tables[1]);
                            tpPrevilegeValue = tpPrevilege[0].Rows[0].Privilege_Value_Name;
                        }
                    }

                    if (privilgeValueArr != "" || privilgeValueArr != null) {
                        privilgeValueArr = tpPrevilegeValue.split('_');
                    }

                    if ($('#txtDoctor').val() != "") {
                        tpDoctor = $('#txtDoctor').val().split(',');
                    }

                    if ($('#txtAccompaninst').val() != "") {
                        tpAccomp = $('#txtAccompaninst').val().split(',');
                    }
                    //debugger;
                    var jsonData = [];

                    for (var i = 0; i < acc.length; i++) {
                        var accdetails = {
                            AccUserCode: "" + acc[i].value + "",
                            AccRegionCode: acc[i].id
                        };
                        jsonData.push(accdetails);
                    }

                    if (jsonData.length > 0) {
                        jsonData = JSON.stringify({ 'lstAccomp': jsonData });
                    }

                    //debugger;

                    $.ajax({
                        contentType: 'application/json; charset=utf-8',
                        type: 'POST',
                        dataType: 'json',
                        url: '../HiDoctor_Activity/TourPlanner/GetTPMandatoryAccompCount',
                        data: jsonData,
                        async: false,
                        success: function (response) {
                            AccompUsers = response;
                        }
                    });

                    if ((privilgeValueArr[2] == "YES") && (accUserCode == "")) {
                        fnMsgAlert('info', 'Tour Planner', 'Please save your TP with atleast one Accompanist');
                        TPAccMandatoryFlag = 1;
                        if (privVisitCount == "YES")
                            $("#btnSaveTP").hide();
                        else
                            $("#btnSaveTP").show();
                        $("#btnSaveasDraft").show();
                        return false;
                    }
                    var Acc = [];
                    Acc = AccompUsers.split(',');
                    var uniAcc = Acc.unique();
                    var hasLeafUser = "";

                    for (var i = 0; i < uniAcc.length; i++) {
                        if (uniAcc[i] != '') {
                            if (uniAcc[i] == "Select a LEAF NODE USER") {
                                hasLeafUser = hasLeafUser + "," + "N";
                            }
                            else {
                                hasLeafUser = hasLeafUser + "," + "Y";
                            }
                        }

                    }


                    //debugger;
                    if (privilgeValueArr[2] == "YES") {
                        if (hasLeafUser.indexOf("Y") > -1) {
                            //debugger;
                            if (parseInt(privilgeValueArr[6]) == 0) {
                                TPAccMandatoryFlag = 0;
                                return true;
                            }
                            if (tpDocMandatory.Tables[0].Rows.length != 0) {
                                if (parseInt(privilgeValueArr[6]) <= tpDoctor.length) {
                                    TPAccMandatoryFlag = 0
                                    return true;
                                }
                                else {//Throws a error msg if the lesser number doctors selected.
                                    TPAccMandatoryFlag = 1;
                                    fnMsgAlert('info', 'Tour Planner', 'Please save your TP with atleast ' + privilgeValueArr[6] + ' Doctor(s)');
                                    if (privVisitCount == "YES")
                                        $("#btnSaveTP").hide();
                                    else
                                        $("#btnSaveTP").show();
                                    $("#btnSaveasDraft").show();
                                    return false;
                                }
                            }
                            else {//Throws a error msg if there is no doctors for the TP user region.
                                TPAccMandatoryFlag = 1;
                                fnMsgAlert('info', 'Tour Planner', 'Minimum one doctor available region needs to be selected');
                                if (privVisitCount == "YES")
                                    $("#btnSaveTP").hide();
                                else
                                    $("#btnSaveTP").show();
                                $("#btnSaveasDraft").show();
                                return false;
                            }
                        }
                        else {//Throws a error msg if managers are alone selected as accompanist.
                            fnMsgAlert('info', 'Tour Planner', 'Please select a LEAF LEVEL USER');
                            TPAccMandatoryFlag = 1;
                            if (privVisitCount == "YES")
                                $("#btnSaveTP").hide();
                            else
                                $("#btnSaveTP").show();
                            $("#btnSaveasDraft").show();
                            return false;
                        }
                    }
                    else if (privilgeValueArr[2] == "NO") {//If doctor mandatory is 0 and there is no need to check futher.
                        if (privilgeValueArr[6] == 0) {
                            TPAccMandatoryFlag = 0;
                            return true;
                        }

                        //debugger;
                        if (parseInt(privilgeValueArr[6]) <= tpDoctor.length) {
                            TPAccMandatoryFlag = 0;
                            return true;
                        }
                        else {//Throws a error msg if there is less doctors in for the selected user region.
                            TPAccMandatoryFlag = 1;
                            fnMsgAlert('info', 'Tour Planner', 'Please save your TP with atleast ' + privilgeValueArr[6] + ' Doctor(s)');
                            if (privVisitCount == "YES")
                                $("#btnSaveTP").hide();
                            else
                                $("#btnSaveTP").show();
                            $("#btnSaveasDraft").show();
                            return false;
                        }
                    }
                    return true;
                }

            }
        }

    });
}
Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};


function fnValidateMeetingPlace() {
    //cp validation 
    if ($("#drpCallObj").val().toUpperCase() == "FIELD" || $("#drpCallObj").val().toUpperCase() == "FIELD_RCPA") {

        var meetingPlacePriv = fnGetPrivilegeVal("TP_MEETING_PLACE_TIME_MANDATORY", "NO");
        if (meetingPlacePriv.toUpperCase() == "YES") {
            // Meeting place
            if ($("#txtMeetingPoint").val() == "") {
                $("#txtMeetingPoint").addClass('error');
                fnMsgAlert('info', 'Tour Planner', 'Enter Meeting Point');
                return false;
            }

            if ($("#txtMeetingTime").val() == "") {
                $("#txtMeetingTime").addClass('error');
                fnMsgAlert('info', 'Tour Planner', 'Enter Meeting Time');
                return false;
            }
        }
    }
    return true;
}


//function to clear all the controls
function fnClearAll() {
    debugger;
    //enabling and disabling controls for FIELD & Field RCPA
    workArea = "";
    work_Area_g = [];
    $("#trAccompanist").show();
    $("#trDoctor").show();
    $("#trhr1").show();

    $("#trCategory").show();
    $("#trWorkPlace").show();
    $("#trFTPlace").show();
    $("#drpLeaveTypes").hide();

    $("#txtQty_0").val('');
    $("#txtQty_1").val('');
    $("#txtQty_2").val('');
    $("#txtQty_3").val('');
    $("#tdDoct_0").val('');
    $("#tdDoct_1").val('');
    $("#tdDoct_2").val('');
    $("#tdDoct_3").val('');

    //Meeting Time and meeting Place Control show
    $("#trMeetingPoint").show();
    $("#trMeetingTime").show();
    //$("#txtWorkPlace").tokenInput('clear');
    //to remove error class
    $("#txtWorkPlace").removeClass('error');
    $("#spnRemarksError").html('');
    $("#UnapprovalRemarks").html('');
    //$("#dvDoc").val('');
    //$("#dvProc").val('');
    //$("#batchdetails").val('');

    var priv = "";
    var privArr = new Array();
    priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
    privArr = priv.split(',');
    if ($.inArray("YES", privArr) > -1 || $.inArray("OPTIONAL", privArr) > -1) {
        $("#txtCPName").show();
        $("#tdCPName").show();
        $("#tdCPName").html('Beat / Patch Plan Name');
        $("#drpActivity").hide();
    }
    else {
        $("#txtCPName").hide();
        $("#tdCPName").hide();
        $("#drpActivity").hide();
    }
    $("#spnTpDateError").html('');
    $("#spnCategoryError").html('');
    $("#spnCPError").html('');

    $("#txtWorkPlace").attr('disabled', false);
    $("#drpCategory").attr('disabled', false);

    doctorJSON_g = [{ id: 0 }];
    doctorProductJSON_g = [{ id: 0 }];

    var dcrEntry = "";
    var dcrEntryArr = new Array();

    dcrEntry = fnGetPrivilegeVal("TP_ENTRY_OPTIONS", "FIELD_RCPA,ATTENDANCE,LEAVE");
    dcrEntryArr = dcrEntry.split(',');
    if ($.inArray("FIELD", dcrEntryArr) > -1) {
        $("#drpCallObj").val("FIELD");
    }
    else if ($.inArray("FIELD_RCPA", dcrEntryArr) > -1) {
        $("#drpCallObj").val("FIELD_RCPA");
    }

    $("#drpCallObj").attr('selectedIndex', 0);
    $("#txtDoctor").tokenInput('clear');
    //$("#txtDoctor").blur();
    $(".accompanist-input-token").tokenInput('clear');
    //$(".accompanist-input-token").blur();
    //  var accompanistObj = $(".accompanist-input-token").tokenInput('get');

    //for (var a = 0; a < accompanistObj.length; a++) {
    //    $(".accompanist-input-token").tokenInput("remove", { id: accompanistObj[a].id });
    //}
    $("#dvSFCHOP").html('');
    $("#txtCPName").val('');
    $("#txtDoctor").tokenInput('clear');
    $("#hdnCPCode").val('');
    $("#spnCPError").html('');
    $("#drpCategory").val(0)
    $("#txtWorkPlace").val('');
    $("#drpLeaveTypes").val(0);
    $("#txtMeetingTime").val('');
    $("#txtMeetingPoint").val('');

    fnCreateSFCHOP(2);

    $("#txtRemarks").val('Remarks');

    //   $(".token-input-dropdown-facebook").css('display', 'none');

    $("#dvJointAccompContent .panel-body").html('');
    $("#dvJointAccompContent").css('display', 'none');

    $("#dvtopAlert").hide();
    $("#spnSFCError").html('');
    if (privVisitCount == "YES")
        $("#btnSaveTP").hide();
    else
        $("#btnSaveTP").show();
    $("#btnSaveasDraft").show();
    fnCallObjChange();
}
//**************** TP Insertion ends here ****************************//

//******************** Datepicker Events Starts here *******************//
// runs for every day displayed in datepicker, adds class and tooltip if matched to days in freeDays array

function highlightDays(date) {
    if (tpDaysJSON != "") {
        if (tpDaysJSON.Tables[0].Rows.length > 0) {
            var tpDays = jsonPath(tpDaysJSON, "$.Tables[0].Rows[?(@.Day=='" + date.getDate() + "' & @.Month=='" + (date.getMonth() + 1) + "' & @.Year=='" + date.getFullYear() + "')]");
            if (tpDays != false && tpDays != undefined) {
                if (tpDays[0].Type == "S") {
                    return [true, 'tpsunday', 'weekend'];
                }
                if (tpDays[0].Type == "H") {
                    return [true, 'tpholiday', 'holiday'];
                }
                if (tpDays[0].Type == "L") {
                    if (tpDays[0].Status == "1") {
                        return [true, 'tpsunday', 'leave applied'];
                    }
                    else if (tpDays[0].Status == "2") {
                        return [true, 'tpsunday', 'leave approved'];
                    }
                    else if (tpDays[0].Status == "0") {
                        return [true, 'tpsunday', 'leave unapproved'];
                    }
                }
                if (tpDays[0].Type == "D") {
                    if (tpDays[0].Status == "1") {
                        return [true, 'tpsunday', 'leave applied'];
                    }
                    else if (tpDays[0].Status == "2") {
                        return [true, 'tpsunday', 'leave approved'];
                    }
                    else {
                        return [true, ''];
                    }
                }
                if (tpDays[0].Type == "T") {
                    if (tpDays[0].Mode == "LEAVE") {
                        return [true, 'tpsunday', 'leave'];
                    }
                    else {
                        if (tpDays[0].Status == "2") {
                            return [true, 'tpapplied', 'tp applied'];
                        }
                        else if (tpDays[0].Status == "1") {
                            return [true, 'tpapproved', 'tp approved'];
                        }
                        else if (tpDays[0].Status == "0") {
                            return [true, 'tpunapprove', 'tp un-approved'];
                        }
                        else if (tpDays[0].Status == "3") {
                            return [true, 'tpdrafted', 'tp drafted'];
                        }
                    }
                }

            }
            else {
                return [true, ''];
            }
        }
        else {
            return [true, ''];
        }
    }
    else {
        return [true, ''];
    }
}


//// for tp calendar
//function fetchTPDaysTpCalendar(year, month) {
//    
//    var date = $('#dvDatePicker').datepicker('getDate');
//    var sideCalMonth = date.getMonth() + 1;
//    var sideCalYear = date.getFullYear();
//    if (month != sideCalMonth || sideCalYear != year) {
//        $('#dvDatePicker').datepicker('setDate', new Date(year, month, "1"));
//    }

//    //fetchTPDays(year, month);
//}
//// for side calendar
//function fetchTPDaysSideCalendar(year, month) {
//    
//    //var date = $('#txtTpDate').datepicker('getDate');
//    //var tpCalMonth = date.getMonth() + 1;
//    //var tpCalYear = date.getFullYear();
//    //if (month != tpCalMonth || tpCalYear != year) {
//        $('#txtTpDate').datepicker('setDate', new Date(year, month, "1"));
//    //}
//    //fetchTPDays(year, month);
//}
// query for free days in datepicker
function fetchTPDays(year, month) {
    var calMonth;
    var calYear;
    if (month == 1) {
        calMonth = 12;
        calYear = year - 1;
    }
    else {
        calMonth = month - 1;
        calYear = year;
    }
    $('#dvCalendar').fullCalendar('gotoDate', calYear, calMonth);
    // for side calendar;
    //$('#dvDatePicker').datepicker('setDate', new Date(year, month, "1"));
    //$('#txtTpDate').datepicker('setDate', new Date(year, month, "1"));
    if (year !== undefined && month !== undefined) {
        $.ajax({
            type: 'POST',
            async: false,
            url: '../HiDoctor_Activity/TourPlanner/GetTPDaysByMonth',
            data: "UserCode=" + $("#hdnUserCode").val() + "&Month=" + month + "&Year=" + year + "",
            success: function (response) {
                tpDaysJSON = "";
                tpDaysJSON = eval('(' + response + ')');
                if (tpDaysJSON != "" && tpDaysJSON !== undefined) {
                    weekend = tpDaysJSON.Tables[0];
                }
                else {
                    weekend = "";
                }
                fnTPLockIntimation()
                $('#txtTPMonth').val(month + "-" + year);//bind the changed month details
            },
            error: function (e) {
            }
        });
    }
}
//function to validate from the small calendar
function fnValidateDate(year, month, date) {
    var response = tpDaysJSON;
    if (response.Tables[0].Rows.length > 0) {
        //TP APPLIED CHECK
        var tpapplied = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='2' & @.Type=='T')]");
        if (tpapplied != false && tpapplied != undefined) {
            if (tpapplied.length > 0) {
                fnMsgAlert('info', 'Caution', 'Your Tour plan is applied for this date , so you can not change the plan')
                $("#txtTpDate").val('');
                return false;
            }
        }
        //TP APPROVED CHECK
        var tpapproved = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='1' & @.Type=='T')]");
        if (tpapproved != false && tpapproved != undefined) {
            if (tpapproved.length > 0) {
                fnMsgAlert('info', 'Caution', 'Your Tour plan is approved for this date , so you can not change the plan')
                $("#txtTpDate").val('');
                return false;
            }
        }
        //DCR LEAVE APPROVED CHECK
        var dcrleaveapproved = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='2' & @.Type=='D')]");
        if (dcrleaveapproved != false && dcrleaveapproved != undefined) {
            if (dcrleaveapproved.length > 0) {
                fnMsgAlert('info', 'Caution', 'In DCR Leave is approved for this date, so you can not plan for this date')
                $("#txtTpDate").val('');
                return false;
            }
        }

        //HOLIDAY CHECK
        var holidayObj = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='H' & @.Type=='H')]");
        if (holidayObj != false && holidayObj != undefined) {
            if (holidayObj.length > 0) {
                if (!confirm('Dear ' + $("#hdnUserName").val() + ', Selected date is a holiday, ' + holidayObj[0].Holiday + '  do you want to enter TP for this day?')) {
                    return false;
                }
            }
        }

        var privWeekendLock = fnGetPrivilegeVal("CP_VISIT_FREQENCY_IN_TP", 0)
        if (privWeekendLock != 0) {
            //sunday CHECK
            var sundayObj = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='S' & @.Type=='S')]");
            if (sundayObj != false && sundayObj != undefined) {
                if (sundayObj.length > 0) {
                    fnMsgAlert('error', 'Error', 'Dear ' + $("#hdnUserName").val() + ',Tour planner entry not allowed on weekends');
                    return false;

                }
            }
        }
    }
    return true
}


//function to validate the date , when the date pick from the form datepicker
function fnfetchTPDays(year, month, date, response) {
    var privWeekendLock = fnGetPrivilegeVal("CP_VISIT_FREQENCY_IN_TP", 0)
    if (privWeekendLock != 0) {
        var sundayObj = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='S' & @.Type=='S')]");
        if (sundayObj != false && sundayObj != undefined) {
            if (sundayObj.length > 0) {
                fnMsgAlert('error', 'Error', 'Dear ' + $("#hdnUserName").val() + ',Tour planner entry not allowed on weekends');
                return false;
                ////if (!confirm('Dear ' + $("#hdnUserName").val() + ', Selected day is Weekend, do you want to enter TP for this day?')) {
                //    return false;
                //}
            }
        }
    }

    if (response.Tables[0].Rows.length > 0) {
        //TP APPLIED CHECK
        var tpapplied = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='2' & @.Type=='T')]");
        if (tpapplied != false && tpapplied != undefined) {
            if (tpapplied.length > 0) {
                fnMsgAlert('info', 'Caution', 'Your Tour plan is applied for this date , so you can not change the plan')
                $("#txtTpDate").val('');
                return false;
            }
        }
        //TP APPROVED CHECK
        var tpapproved = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='1' & @.Type=='T')]");
        if (tpapproved != false && tpapproved != undefined) {
            if (tpapproved.length > 0) {
                fnMsgAlert('info', 'Caution', 'Your Tour plan is approved for this date , so you can not change the plan')
                $("#txtTpDate").val('');
                return false;
            }
        }
        //DCR LEAVE APPROVED CHECK
        var dcrleaveapproved = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='2' & @.Type=='D')]");
        if (dcrleaveapproved != false && dcrleaveapproved != undefined) {
            if (dcrleaveapproved.length > 0) {
                fnMsgAlert('info', 'Caution', 'In DCR Leave is approved for this date, so you can not plan for this date')
                $("#txtTpDate").val('');
                return false;
            }
        }
        //HOLIDAY CHECK
        var holidayObj = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='H' & @.Type=='H')]");
        if (holidayObj != false && holidayObj != undefined) {
            if (holidayObj.length > 0) {
                if (!confirm('Dear ' + $("#hdnUserName").val() + ', Selected date is a holiday, ' + holidayObj[0].Holiday + '  do you want to enter TP for this day?')) {
                    return false;
                }
            }
        }
        //sunday CHECK
        var sundayObj = jsonPath(response, "$.Tables[0].Rows[?(@.Day=='" + date + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Status=='S' & @.Type=='S')]");
        if (sundayObj != false && sundayObj != undefined) {
            if (sundayObj.length > 0) {
                if (!confirm('Dear ' + $("#hdnUserName").val() + ', Selected day is Weekend, do you want to enter TP for this day?')) {
                    return false;
                }
            }
        }

        return true;
    }
    else {
        return true;
    }
}
//******************** Datepicker Events ends here *******************//

//******************* Tab Navigation starts here *********************//

function fnDayClick() {
    if ($("#hdnUserCode").val() == "") {
        fnMsgAlert('error', 'Error', 'Please select the user to enter tour plan');
        return;
    }
    $("#tblTP").css('display', '');
    $("#dvGlobalSubmit").hide();
    $("#GlobalSubmitInfo").hide();
    $("#GlobalSubmitError").html("");
    $("#UnapprovalRemarks").html("");
    $("#dvCalendar").css('display', 'none');
    $("#dvDashBoard").css('display', 'none');
    $("#spnDay").removeClass('spn-deep-Black');
    $("#spnWeek").removeClass('spn-deep-Black');
    $("#spnMonth").removeClass('spn-deep-Black');
    $("#spndashBoard").removeClass('spn-deep-Black');
    $("#spnDay").addClass('spn-deep-Black');
    $("#dvTPExcelExport").hide();
    //var privDocLabel = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor ");

    $("[name='spnDoctorLabel']").html(DoctorLabel);
}

function fnMonthClick() {
    $('#dvCalendar').fullCalendar('refetchEvents');
    $("#tblTP").css('display', 'none');
    $("#GlobalSubmitInfo").hide();
    $("#dvGlobalSubmit").hide();
    $("#GlobalSubmitError").html("");
    $("#UnapprovalRemarks").html("");
    if (privVisitCount == "YES") {
        var IsMonthlyTPCompleted = fnCheckTPComplete();
        if (IsMonthlyTPCompleted == true) {
            $("#dvGlobalSubmit").show();
        }
        else {
            $("#GlobalSubmitInfo").show();
        }
    }

    $("#dvCalendar").css('display', '');
    $('#dvCalendar').fullCalendar('changeView', 'month')
    $("#dvDashBoard").css('display', 'none');
    $("#spnDay").removeClass('spn-deep-Black');
    $("#spnWeek").removeClass('spn-deep-Black');
    $("#spnMonth").removeClass('spn-deep-Black');
    $("#spndashBoard").removeClass('spn-deep-Black');
    $("#spnMonth").addClass('spn-deep-Black');
}
function fnWeekClick() {
    $("#tblTP").css('display', 'none');
    $("#dvGlobalSubmit").hide();
    $("#GlobalSubmitInfo").hide();
    $("#GlobalSubmitError").html("");
    $("#UnapprovalRemarks").html("");
    $("#dvCalendar").css('display', '');
    $('#dvCalendar').fullCalendar('changeView', 'basicWeek')
    $("#dvDashBoard").css('display', 'none');
    $("#spnDay").removeClass('spn-deep-Black');
    $("#spnWeek").removeClass('spn-deep-Black');
    $("#spnMonth").removeClass('spn-deep-Black');
    $("#spndashBoard").removeClass('spn-deep-Black');
    $("#spnWeek").addClass('spn-deep-Black');
    $('#dvCalendar').fullCalendar('refetchEvents');
}
function fnDashBoardClick() {
    $("#tblTP").css('display', 'none');
    $("#dvCalendar").css('display', 'none');
    $("#UnapprovalRemarks").html("");
    $("#dvDashBoard").css('display', '');
    $("#spnDay").removeClass('spn-deep-Black');
    $("#spnWeek").removeClass('spn-deep-Black');
    $("#spnMonth").removeClass('spn-deep-Black');
    $("#spndashBoard").removeClass('spn-deep-Black');
    $("#spndashBoard").addClass('spn-deep-Black');
    fnTPDashBoard();
    $("#dvGlobalSubmit").hide();
    $("#GlobalSubmitInfo").hide();
}
//******************* Tab Navigation ends here *********************//

//******************* Full Calendar Starts Here ********************//
function fnFullCalendar() {

    $('#dvCalendar').fullCalendar({
        header: {
            left: '',//prev,next today
            center: 'title',
            right: ''
        },
        editable: false,
        weekMode: 'variable',
        events: function (start, end, callback) {
            //debugger;
            var fullMonth = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
            var fullYear = $('#dvCalendar').fullCalendar('getDate').getFullYear();
            //var endDate = new Date(end).getDate() - 1;
            //$("#hdnTPDate").val(fullYear + "-" + fullMonth + "-" + endDate);
            IsMonthlyTPCompleted = fnCheckTPComplete();
            $("#GlobalSubmitInfo").hide();
            $("#dvGlobalSubmit").hide();
            $("#GlobalSubmitError").html("");
            $("#UnapprovalRemarks").html("");
            if (privVisitCount == "YES") {
                if (IsMonthlyTPCompleted == true) {
                    $("#dvGlobalSubmit").show();
                }
                else {
                    $("#GlobalSubmitInfo").show();
                }
            }
            $("[name='spnDoctorLabel']").html(DoctorLabel);
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Activity/TourPlanner/GetTPDetailsByMonth',
                data: "UserCode=" + $("#hdnUserCode").val() + "&Month=" + fullMonth + "&Year=" + fullYear + "",
                success: function (jsData) {

                    jsData = eval('(' + jsData + ')');
                    jsData_g = jsData;
                    var events = [];

                    HiDoctorStartDate_g = jsData_g.Tables[4].Rows[0].HiDOCTOR_Start_Date;
                    //var unapprovalRemarks = jsData_g.Tables[1].Rows[0].Unapprove_Reason;
                    for (var t = 0; t < jsData.Tables[0].Rows.length; t++) {
                        var imgSrc = "";
                        var tit = "";
                        if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "FIELD" || jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "FIELD_RCPA") {
                            if (jsData.Tables[0].Rows[t].Status == "2") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapplied.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "1") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tptick.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "0") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpCross.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "3") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpDraft.png'/>"
                            }
                            tit = jsData.Tables[0].Rows[t].Project_Code + " | " + jsData.Tables[0].Rows[t].CP_name + " | " + jsData.Tables[0].Rows[t].Category + " | " + jsData.Tables[0].Rows[t].Work_Area;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "ATTENDANCE") {
                            if (jsData.Tables[0].Rows[t].Status == "2") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapplied.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "1") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tptick.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "0") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpCross.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "3") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpDraft.png'/>"
                            }
                            tit = jsData.Tables[0].Rows[t].Project_Name + " | " + jsData.Tables[0].Rows[t].Activity_Name + " | " + jsData.Tables[0].Rows[t].Category;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "LEAVE") {
                            if (jsData.Tables[0].Rows[t].Status == "2") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapplied.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "1") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tptick.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "0") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpCross.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "3") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpDraft.png'/>"
                            }
                            tit = jsData.Tables[0].Rows[t].Project_Name + " | " + jsData.Tables[0].Rows[t].Activity_Name;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "DCRLEAVE") {
                            if (jsData.Tables[0].Rows[t].Status == "2") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tptick.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "1") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapplied.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "0") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpCross.png'/>"
                            }
                            else if (jsData.Tables[0].Rows[t].Status == "3") {
                                imgSrc = "<img src = '../Areas/HiDoctor_Activity/Content/images/Web/hd/tpDraft.png'/>"
                            }
                            tit = "Dcr leave";
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "HOLIDAY") {
                            tit = "Holiday :" + jsData.Tables[0].Rows[t].Activity_Name;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "WEEKEND") {
                            tit = "Weekend";
                        }
                        var unapprovalRemarks = jsonPath(jsData, "$.Tables[1].Rows[?(@.TP_Date=='" + jsData.Tables[0].Rows[t].TP_Date + "')]");
                        var weekhtml = "";
                        //for week html
                        if (jsData.Tables[0].Rows[t].Status == "2") {
                            weekhtml += "<span style='font-weight:bold'>Applied</span> <br/>";
                        }
                        else if (jsData.Tables[0].Rows[t].Status == "1") {
                            weekhtml += "<span style='font-weight:bold'>Approved</span><br/>";
                        }
                        else if (jsData.Tables[0].Rows[t].Status == "0") {
                            weekhtml += "<span style='font-weight:bold'>Un-approved</span><br/>";
                            if (unapprovalRemarks != null && unapprovalRemarks) {
                                weekhtml += "<span>" + unapprovalRemarks[0].Unapprove_Reason + "</span><br/>"
                            }
                        }
                        else if (jsData.Tables[0].Rows[t].Status == "3") {
                            weekhtml += "<span style='font-weight:bold'>Drafted</span><br/>";
                        }

                        if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "FIELD" || jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "FIELD_RCPA") {
                            weekhtml += jsData.Tables[0].Rows[t].Project_Name + "<br />";
                            weekhtml += jsData.Tables[0].Rows[t].Category + "<br />";
                            weekhtml += jsData.Tables[0].Rows[t].Work_Area + "<br />";
                            var tpSFC = jsonPath(jsData, "$.Tables[3].Rows[?(@.TP_Date=='" + jsData.Tables[0].Rows[t].TP_Date + "')]");
                            if (tpSFC != false) {
                                for (var d = 0; d < tpSFC.length; d++) {
                                    weekhtml += tpSFC[d].From_Place + " to " + tpSFC[d].To_Place + "<br />";
                                }
                            }
                            weekhtml += "<br />";
                            var tpaccompanist = jsonPath(jsData, "$.Tables[1].Rows[?(@.TP_Date=='" + jsData.Tables[0].Rows[t].TP_Date + "')]");
                            if (tpaccompanist != false) {
                                if (tpaccompanist[0].Accomp_Name != null && tpaccompanist[0].Accomp_Name != "") {
                                    weekhtml += tpaccompanist[0].Accomp_Name + "<br />";
                                }
                                if (tpaccompanist[0].Accompanist2_Name != null && tpaccompanist[0].Accompanist2_Name != "") {
                                    weekhtml += tpaccompanist[0].Accompanist2_Name + "<br />";
                                }
                                if (tpaccompanist[0].Accompanist3_Name != null && tpaccompanist[0].Accompanist3_Name != "") {
                                    weekhtml += tpaccompanist[0].Accompanist3_Name + "<br />";
                                }
                                if (tpaccompanist[0].Accompanist4_Name != null && tpaccompanist[0].Accompanist4_Name != "") {
                                    weekhtml += tpaccompanist[0].Accompanist4_Name + "<br />";
                                }
                            }
                            weekhtml += "<br />";
                            weekhtml += "<span style='font-weight:bold'>Doctor List</span> <br />";
                            var tpdoctors = jsonPath(jsData, "$.Tables[2].Rows[?(@.TP_Date=='" + jsData.Tables[0].Rows[t].TP_Date + "')]");
                            if (tpdoctors != false) {
                                for (var d = 0; d < tpdoctors.length; d++) {
                                    weekhtml += tpdoctors[d].Customer_Name + "<br />";
                                }
                            }
                            else {
                                weekhtml += "- No Doctors -";
                            }
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "ATTENDANCE") {
                            var UnaprovalReasonAtten = "";
                            if (jsData.Tables[0].Rows[t].Unapprove_Reason != "" && jsData.Tables[0].Rows[t].Unapprove_Reason != null) {
                                UnaprovalReasonAtten = jsData.Tables[0].Rows[t].Unapprove_Reason;
                            }
                            weekhtml += jsData.Tables[0].Rows[t].Project_Name + " | " + jsData.Tables[0].Rows[t].Activity_Name + " | " + jsData.Tables[0].Rows[t].Category + "|" + UnaprovalReasonAtten;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "LEAVE") {
                            var UnaprovalReasonLeave = "";
                            if (jsData.Tables[0].Rows[t].Unapprove_Reason != "" && jsData.Tables[0].Rows[t].Unapprove_Reason != null) {
                                UnaprovalReasonLeave = jsData.Tables[0].Rows[t].Unapprove_Reason;
                            }
                            weekhtml += jsData.Tables[0].Rows[t].Project_Name + " | " + jsData.Tables[0].Rows[t].Activity_Name + "|" + UnaprovalReasonLeave;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "DCRLEAVE") {
                            weekhtml += "Dcr leave";
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "HOLIDAY") {
                            weekhtml += "Holiday :" + jsData.Tables[0].Rows[t].Activity_Name;
                        }
                        else if (jsData.Tables[0].Rows[t].Project_Name.toUpperCase() == "WEEKEND") {
                            weekhtml += "WEEKEND";
                        }

                        events.push({
                            title: tit,
                            start: jsData.Tables[0].Rows[t].TP_Date, // will be parsed
                            imageAfterTitle: $(imgSrc),
                            weekHTML: weekhtml,
                            //editable: false,
                        });
                    }
                    //fnShowTPExcelLink();
                    events_g = events;
                    callback(events);
                }
            });
        },
        eventClick: function (event) {
            debugger;
            work_Area_g = [];
            var date = event.start;
            if (event.title.toString().toLowerCase().includes("weekend") == true
                || event.title.toString().toLowerCase().includes("holiday") == true) {
                return false;
            }
            $("#GlobalSubmitError").html("");
            //check if tree node is selected 
            if ($("#hdnUserCode").val() == "") {
                fnMsgAlert('error', 'Error', 'Please select the user to enter tour plan');
                return;
            }
            $("#spnDay").removeClass('spn-deep-Black');
            $("#spnWeek").removeClass('spn-deep-Black');
            $("#spnMonth").removeClass('spn-deep-Black');
            $("#spndashBoard").removeClass('spn-deep-Black');
            $("#spnDay").addClass('spn-deep-Black');

            IsMonthlyTPCompleted = fnCheckTPComplete();
            var tpDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            $("#tblTP").css('display', '');
            $("#dvCalendar").css('display', 'none');
            $("#dvTPExcelExport").hide();

            $('#dvDatePicker').datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), date.getDate()));

            var theDate = new Date(Date.parse($('#dvDatePicker').datepicker('getDate')));
            var dateFormatted = $.datepicker.formatDate('D, MM d, yy', theDate);
            $("#dvTPDate").html(dateFormatted);
            $("#txtTpDate").val($.datepicker.formatDate('dd/mm/yy', theDate));//to bind the selected date to the control

            //tp date
            $("#hdnTPDate").val($.datepicker.formatDate('yy-mm-dd', theDate));
            $("#dvBigDate").html($.datepicker.formatDate('d', theDate));
            $("#dvday").html($.datepicker.formatDate('D, MM, yy', theDate));
            $("#txtWorkPlace").prev().detach();
            $("#txtWorkPlace").tokenInput([], {
                preventDuplicates: true, theme: "facebook", onAdd: function (item) {

                },
                onDelete: function (item) {

                }
            });


            $(".token-input-dropdown-facebook").css('display', 'none');
            //clear all
            fnClearAll();
            fnGetWorkAreas(currentRegion)
            fnPrefillTP(tpDate);

            //prefill the details           
            //debugger;

            if (privVisitCount == "YES") {
                $("#btnSaveTP").hide();
            }
            else {
                $("#btnSaveTP").show();
            }
            $("#dvGlobalSubmit").hide()
            $("#GlobalSubmitInfo").hide();
            var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");

            if (batchPrivellage == 'YES') {
                //$("#dvBatchInfo").overlay().load();
                $('#linkforbatch').html('<span onclick="fngetBatchOverlay();">Click Here To View Batch Details</span>');
                //  $('#imageTP').html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/eggs.jpg" style="cursor: pointer;width: 22px;"onclick="fnDoctorBatchOverLay()" title="Click To Enter Batch" />');
                $('#tblBatchOverlay').html('');
                fngetBatchInformation();
            }
            else {
                //  $("#dvDoctorProduct").show();
                $("#imageTP").show();
                $('#linkforbatch').html('');
                $('#imageTP').html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/capsule.png" style="cursor: pointer"onclick="fnDoctorProductOverLay()" title="Click To Enter Product" />');
            }
        },
        dayClick: function (date, allDay, jsEvent, view) {
            debugger;
            // DAY click
            //check if tree node is selected           
            if ($("#hdnUserCode").val() == "") {
                fnMsgAlert('error', 'Error', 'Please select the user to enter tour plan');
                return;
            }

            if (fnGetDateDifference(new Date(HiDoctorStartDate_g), date) < 0) {
                alert("Dear User, TP can't be entered before joining date.");
                $('#btnSaveMyPlan').css('display', 'none');
                return false;
            }
            else {
                $('#btnSaveMyPlan').css('display', '');
            }
            $("[name='spnDoctorLabel']").html(DoctorLabel);
            //to validate the selected date
            $("#dvGlobalSubmit").hide();
            $("#GlobalSubmitInfo").hide();
            $("#GlobalSubmitError").html("");
            $("#UnapprovalRemarks").html("");
            //debugger;
            var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");

            $.ajax({
                type: 'POST',
                async: false,
                url: 'TourPlanner/GetTPDaysByMonth',
                data: "UserCode=" + $("#hdnUserCode").val() + "&Month=" + (date.getMonth() + 1) + "&Year=" + date.getFullYear() + "",
                success: function (response1) {
                    debugger;
                    response1 = eval('(' + response1 + ')');
                    if (response1 != "" && response1 !== undefined) {
                        weekend = response1.Tables[0];
                    }
                    else {
                        weekend = "";
                    }

                    if (fnfetchTPDays(date.getFullYear(), (date.getMonth() + 1), date.getDate(), response1)) {
                        $("#hdnTPDate").val($.datepicker.formatDate('yy-mm-dd', theDate));

                        $("#spnDay").removeClass('spn-deep-Black');
                        $("#spnWeek").removeClass('spn-deep-Black');
                        $("#spnMonth").removeClass('spn-deep-Black');
                        $("#spndashBoard").removeClass('spn-deep-Black');
                        $("#spnDay").addClass('spn-deep-Black');

                        var tpDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        $("#tblTP").css('display', '');
                        $("#dvCalendar").css('display', 'none');
                        $("#dvTPExcelExport").hide();

                        $('#dvDatePicker').datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                        $("#txtTpDate").val($.datepicker.formatDate('dd/mm/yy', date));//to bind the selected date to the control

                        var theDate = new Date(Date.parse($('#dvDatePicker').datepicker('getDate')));
                        var dateFormatted = $.datepicker.formatDate('D, MM d, yy', theDate);
                        $("#dvTPDate").html(dateFormatted);

                        //tp date
                        $("#hdnTPDate").val($.datepicker.formatDate('yy-mm-dd', theDate));
                        $("#dvBigDate").html($.datepicker.formatDate('d', theDate));
                        $("#dvday").html($.datepicker.formatDate('D, MM, yy', theDate));
                        //clear all
                        fnClearAll();
                        fnGetWorkAreas(currentRegion)
                        fnPrefillTP(tpDate);

                        //debugger;
                        //prefill the details                       

                        if (privVisitCount == "YES") {
                            $("#btnSaveTP").hide();
                        }
                        else {
                            $("#btnSaveTP").show();
                        }
                        if (batchPrivellage == 'YES') {
                            //$("#dvBatchInfo").overlay().load();
                            $('#linkforbatch').html('<span onclick="fngetBatchOverlay();">Click Here To View Batch Details</span>');
                            //     $('#imageTP').html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/eggs.jpg" style="cursor: pointer;width: 22px;" onclick="fnDoctorBatchOverLay()" title="Click To Enter Batch" />');
                            fngetBatchInformation();
                            $("#imageTP").hide();
                        }
                        else {
                            //     $("#dvDoctorProduct").show();
                            $("#imageTP").show();
                            $('#linkforbatch').html('');
                            $('#imageTP').html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/capsule.png" style="cursor: pointer"onclick="fnDoctorProductOverLay()" title="Click To Enter Product" />');
                        }
                    }
                    else {
                        if (privVisitCount == "YES") {
                            //if all the Tour plan's are completed for the month. show Global Submit button, Else show message to complete plan.
                            IsMonthlyTPCompleted = fnCheckTPComplete();
                            if (IsMonthlyTPCompleted == true) {
                                $("#dvGlobalSubmit").show();
                                $("#GlobalSubmitInfo").hide();
                                $("#spnInfo").hide();
                            }
                            else {
                                $("#GlobalSubmitInfo").show();
                                $("#dvGlobalSubmit").hide();
                                $("#spnInfo").show();
                            }
                        }
                        else {
                            $("#dvGlobalSubmit").hide();
                            $("#GlobalSubmitInfo").hide();
                            $("#spnInfo").hide();
                        }
                        $("#txtTpDate").val("");
                    }
                    //var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");
                    //if (batchPrivellage == 'YES') {
                    //    fngetBatchInformation();
                    //}
                },
                error: function (e) {
                }
            });
        },
        eventRender: function (event, eventElement) {
            //debugger;
            eventElement.on('click', function (e) {
                if (eventElement.closest('.fc-event-title').length > 0) {
                    e.preventDefault();
                }
            });
            if (event.imageAfterTitle) {
                eventElement.find('span.fc-event-title').before($(event.imageAfterTitle));
                if ($('#dvCalendar').fullCalendar('getView').name == "basicWeek") {
                    eventElement.find('span.fc-event-title').html("<div>" + event.weekHTML + "</div>");
                }
            }
        }
    });
}

//******************* Full Calendar Ends Here ********************//



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

jQuery.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function () {
    return this.find("span.highlight").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};
//************************** Prefill the TP For Edit Starts Here ****************************************//

function fnPrefillTP(tpDate) {
    debugger;
    $("#UnapprovalRemarks").show();
    batch_val = [];
    $.ajax({
        async: false,
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetTPDetailsByDay',
        data: "UserCode=" + $("#hdnUserCode").val() + "&TPDate=" + tpDate + "",
        success: function (tpPrefillJson) {
            debugger;
            tpPrefillJson = eval('(' + tpPrefillJson + ')');
            if (tpPrefillJson.Tables != null && tpPrefillJson.Tables[0].Rows != null &&
                tpPrefillJson.Tables[0].Rows.length > 0 && tpPrefillJson.Tables[0].Rows[0].Unapprove_Reason.length > 0) {
                $("#UnapprovalRemarks").html("Unapproval Remarks-" + tpPrefillJson.Tables[0].Rows[0].Unapprove_Reason)
            }

            //to check the privilege , for alert show or not
            var showJointWorkAccAlert = fnGetPrivilegeVal("TP_SHOW_JOINT_WORK_ACCOMPANIST_ALERT", "YES");
            if (showJointWorkAccAlert.toUpperCase() == "YES") {
                $("#dvJointAccompContent").show();
            }
            else {
                $("#dvJointAccompContent").hide();
            }

            //to bind the doctors token
            $("#txtDoctor").tokenInput('clear');
            for (var d = 0; d < tpPrefillJson.Tables[1].Rows.length; d++) {
                $("#txtDoctor").tokenInput("add", { id: tpPrefillJson.Tables[1].Rows[d].Doctor_Code + "_" + tpPrefillJson.Tables[1].Rows[d].Doctor_Region_Code, name: tpPrefillJson.Tables[1].Rows[d].Customer_Name + "_" + tpPrefillJson.Tables[1].Rows[d].MDL + "_" + tpPrefillJson.Tables[1].Rows[d].Region_Name });
            }

            if (tpPrefillJson.Tables[0].Rows.length > 0) {
                //to get the header information
                if (tpPrefillJson.Tables[0].Rows[0].Status == "1" || tpPrefillJson.Tables[0].Rows[0].Status == "2") {
                    $("#dvtopAlert").show();
                    $("#divHeader").hide();
                    if (tpPrefillJson.Tables[0].Rows[0].Status == "1") {
                        $("#dvtopAlert").html('Your Tour plan is approved for this date , so you can not change the plan');
                    }
                    else {
                        $("#dvtopAlert").html('Your Tour plan is applied for this date , so you can not change the plan');
                    }
                    $("#tblTP").hide();
                    $("#dvInProgress").css('display', 'none');
                    return;
                }

                var projectCode = tpPrefillJson.Tables[0].Rows[0].Project_Code;
                var activityCode = tpPrefillJson.Tables[0].Rows[0].Activity_Code;
                var cpCode = tpPrefillJson.Tables[0].Rows[0].CP_Code;
                var cpName = tpPrefillJson.Tables[0].Rows[0].CP_name;
                var category = tpPrefillJson.Tables[0].Rows[0].Category;
                var acc1name = tpPrefillJson.Tables[0].Rows[0].Accomp_Name;
                var acc2name = tpPrefillJson.Tables[0].Rows[0].Accompanist2_Name;
                var acc3name = tpPrefillJson.Tables[0].Rows[0].Accompanist3_Name;
                var acc4name = tpPrefillJson.Tables[0].Rows[0].Accompanist4_Name;


                var acc1Only = tpPrefillJson.Tables[0].Rows[0].Acc1_Only_For_Doctor;
                var acc2Only = tpPrefillJson.Tables[0].Rows[0].Acc2_Only_For_Doctor;
                var acc3Only = tpPrefillJson.Tables[0].Rows[0].Acc3_Only_For_Doctor;
                var acc4Only = tpPrefillJson.Tables[0].Rows[0].Acc4_Only_For_Doctor;
                var workArea = tpPrefillJson.Tables[0].Rows[0].Work_Area;
                var remarks = tpPrefillJson.Tables[0].Rows[0].Remarks;
                var meetingPoint = tpPrefillJson.Tables[0].Rows[0].Meeting_Point;
                var meetingTime = tpPrefillJson.Tables[0].Rows[0].Meeting_Time;

                if (projectCode.toUpperCase() == "FIELD" || projectCode.toUpperCase() == "FIELD_RCPA") {

                    //enabling and disabling controls for FIELD & Field RCPA
                    $("#trAccompanist").show();
                    $("#trDoctor").show();
                    $("#trhr1").show();

                    $("#trMeetingPoint").show();
                    $("#trMeetingTime").show();

                    $("#trCategory").show();
                    $("#trWorkPlace").show();
                    $("#trFTPlace").show();
                    $("#drpLeaveTypes").hide();

                    var priv = "";
                    var privArr = new Array();
                    priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
                    privArr = priv.split(',');
                    if ($.inArray("YES", privArr) > -1 || $.inArray("OPTIONAL", privArr) > -1) {
                        $("#txtCPName").show();
                        $("#tdCPName").show();
                        $("#tdCPName").html('Beat / Patch Plan Name');
                        $("#drpActivity").hide();
                    }
                    else {
                        $("#txtCPName").hide();
                        $("#tdCPName").hide();
                        $("#drpActivity").hide();
                    }

                    //bind the details
                    $("#drpCallObj").val(projectCode.toUpperCase());
                    $("#txtCPName").val(cpName);
                    $("#hdnCPCode").val(cpCode);

                    if (meetingPoint != "") {
                        $("#txtMeetingPoint").val(meetingPoint);
                    }
                    else {
                        $("#txtMeetingPoint").val('');
                    }

                    if (meetingTime != "") {
                        $("#txtMeetingTime").val(meetingTime);
                    }
                    else {
                        $("#txtMeetingTime").val('');
                    }

                    $("#drpCategory option").each(function () {
                        if ($(this).text() == category) {
                            $(this).attr('selected', 'selected');
                        }
                    });

                    // $("#txtWorkPlace").val(workArea);
                    // Work Place
                    //   $("#txtWorkPlace").tokenInput('clear');
                    fnGetWorkAreas(currentRegion);
                    debugger;
                    work_Area_g = [];
                    if (workArea.lastIndexOf(',') > -1) {
                        debugger;
                        work_Area_g = workArea.split(',');
                    }
                    else {
                        work_Area_g.push(workArea);
                    }
                    for (var w = 0; w < work_Area_g.length; w++) {
                        debugger;
                        $("#txtWorkPlace").tokenInput("add", { id: work_Area_g[w], name: work_Area_g[w] });
                    }

                    //if (workArea.lastIndexOf(',') > -1) {
                    //    debugger;
                    //    work_Area_g = workArea.split(',');

                    //}
                    //else {
                    //    debugger;
                    //    work_Area_g = workArea;
                    //    // for (var w = 0; w < workArea.length; w++) {
                    //    debugger;
                    //    $("#txtWorkPlace").tokenInput("add", { id: workArea, name: workArea });
                    //    //}

                    //}

                    $("#txtRemarks").val(remarks);


                    //bind SFC
                    tpInter = fnGetPrivilegeVal("INTERMEDIATE_PLACES", "");
                    tpInterArr = tpInter.split(',');


                    var tableContent = "";
                    tableContent += "<table id='tblSFCHOP'>";

                    if ($.inArray($('#drpCategory :selected').text().toUpperCase(), tpInterArr) > -1) {
                        for (var i = 0; i < tpPrefillJson.Tables[3].Rows.length; i++) {
                            var fromPalceReadonly = "";
                            if (i > 0) {
                                fromPalceReadonly = "disabled=true"
                            }

                            var SFCCode = tpPrefillJson.Tables[3].Rows[i].SFC_Code == null ? "-1" : tpPrefillJson.Tables[3].Rows[i].SFC_Code;
                            tableContent += "<tr><td><input " + fromPalceReadonly + " id='txtFormPlace_" + (i + 1) + "'  class='sfcauto sfcplace' value='" + tpPrefillJson.Tables[3].Rows[i].From_Place + "' /></td>";
                            tableContent += "<td><input id='txtToPlace_" + (i + 1) + "'  class='sfcauto sfcplace newRow'  value='" + tpPrefillJson.Tables[3].Rows[i].To_Place + "' /></td>";
                            tableContent += "<td><input id='txtTravelMode_" + (i + 1) + "'   class='travelModeauto sfcauto' value='" + tpPrefillJson.Tables[3].Rows[i].Travel_Mode + "' /></td></tr>";
                            tableContent += "<input id='hdnDistance_" + (i + 1) + "'  type='hidden' value='" + tpPrefillJson.Tables[3].Rows[i].Distance + "' />";
                            tableContent += "<input id='hdnFare_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].Fare_Amount + "' />";
                            tableContent += "<input id='hdnDistanceFareCode_" + (i + 1) + "'  type='hidden'  value='" + SFCCode + "'/>";
                            tableContent += "<input id='hdnSFCRegion_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Region_Code + "'/>";
                            tableContent += "<input id='hdnSFCVersion_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Version_No + "'/>";
                            tableContent += "<input id='hdnSFCCategory_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Category_Name + "'/>";
                            tableContent += "<input id='hdnSFCVisitCount_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Visit_Count + "'/>";
                            tableContent += "</td></tr>";
                        }
                        tableContent += "</table>";
                    }
                    else {
                        var SFCCode = tpPrefillJson.Tables[3].Rows[0].SFC_Code == null ? "-1" : tpPrefillJson.Tables[3].Rows[0].SFC_Code;
                        tableContent += "<tr><td><input id='txtFormPlace_1'  class='sfcauto sfcplace' value='" + tpPrefillJson.Tables[3].Rows[0].From_Place + "' /></td>";
                        tableContent += "<td><input id='txtToPlace_1'  class='sfcauto sfcplace newRow'  value='" + tpPrefillJson.Tables[3].Rows[0].To_Place + "' /></td>";
                        tableContent += "<td><input id='txtTravelMode_1'  class='travelModeauto sfcauto' value='" + tpPrefillJson.Tables[3].Rows[0].Travel_Mode + "' /></td></tr>";
                        tableContent += "<input id='hdnDistance_1'  type='hidden' value='" + tpPrefillJson.Tables[3].Rows[0].Distance + "' />";
                        tableContent += "<input id='hdnFare_1'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[0].Fare_Amount + "' />";
                        tableContent += "<input id='hdnDistanceFareCode_1'  type='hidden'  value='" + SFCCode + "'/>";
                        tableContent += "<input id='hdnSFCRegion_1'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[0].SFC_Region_Code + "'/>";
                        tableContent += "<input id='hdnSFCVersion_1'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[0].SFC_Version_No + "'/>";
                        tableContent += "<input id='hdnSFCCategory_1'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[0].SFC_Category_Name + "'/>";
                        tableContent += "<input id='hdnSFCVisitCount_1'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[0].SFC_Visit_Count + "'/>";
                        tableContent += "</td></tr>";
                        tableContent += "</table>";
                    }

                    $("#dvSFCHOP").html('');
                    $("#dvSFCHOP").html(tableContent);

                    //if no sfc bind default rows
                    if (tpPrefillJson.Tables[3].Rows.length == 0) {
                        fnCreateSFCHOP(2);
                    }



                    //to bind the accompanist token input
                    //adding for accompanist changes
                    //var arrregionCode = new Array();
                    //var aregionCode = new Array();
                    //
                    //for (var a = 0; a < tpPrefillJson.Tables[4].Rows.length; a++) {
                    //    if (tpPrefillJson.Tables[4].Rows[a].Type == "AO") {
                    //        if (tpPrefillJson.Tables[4].Rows[a].User_Name.split(',')[1].split('(')[0].toUpperCase() == "VACANT") {
                    //            if ($.inArray(tpPrefillJson.Tables[4].Rows[a].Region_Code, aregionCode) == -1) {
                    //                arrregionCode.push(tpPrefillJson.Tables[4].Rows[a].Region_Code + "_" + tpPrefillJson.Tables[4].Rows[a].User_Name);
                    //                aregionCode.push(tpPrefillJson.Tables[4].Rows[a].Region_Code);
                    //            }
                    //        }
                    //    }
                    //    else {
                    //        arrregionCode.push(tpPrefillJson.Tables[4].Rows[a].Region_Code + "_" + tpPrefillJson.Tables[4].Rows[a].User_Name);
                    //        //aregionCode.push(tpPrefillJson.Tables[4].Rows[a].Region_Code);
                    //    }
                    //}
                    var accomp1Name = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Name=='" + acc1name + "')]");
                    var accomp2Name = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Name=='" + acc2name + "')]");
                    var accomp3Name = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Name=='" + acc3name + "')]");
                    var accomp4Name = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Name=='" + acc4name + "')]");


                    var accomp1Doc = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Region_Code=='" + acc1Only + "' & @.Type=='AO')]");
                    var accomp2Doc = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Region_Code=='" + acc2Only + "' & @.Type=='AO')]");
                    var accomp3Doc = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Region_Code=='" + acc3Only + "' & @.Type=='AO')]");
                    var accomp4Doc = jsonPath(tpPrefillJson, "$.Tables[4].Rows[?(@.Region_Code=='" + acc4Only + "' & @.Type=='AO')]");

                    //to get the SFC and Accompanist details
                    //get the accompanist details
                    var accompanistName = acc1name + "^" + acc2name + "^" + acc3name + "^" + acc4name + "^";
                    var accompanistRegion = acc1Only + "^" + acc2Only + "^" + acc3Only + "^" + acc4Only + "^";
                    eaccompanistName_g = accompanistName;
                    eaccompanistRegions_g = accompanistRegion;

                    fnGetSFCAutoFillData("A");


                    $(".accompanist-input-token").tokenInput('clear')
                    if (accomp1Name != false && accomp1Name != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp1Name[0].Region_Code, name: accomp1Name[0].User_Name, value: accomp1Name[0].User_Code });
                    }
                    if (accomp2Name != false && accomp2Name != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp2Name[0].Region_Code, name: accomp2Name[0].User_Name, value: accomp2Name[0].User_Code });
                    }
                    if (accomp3Name != false && accomp3Name != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp3Name[0].Region_Code, name: accomp3Name[0].User_Name, value: accomp3Name[0].User_Code });
                    }
                    if (accomp4Name != false && accomp4Name != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp4Name[0].Region_Code, name: accomp4Name[0].User_Name, value: accomp4Name[0].User_Code });
                    }


                    if (accomp1Doc != false && accomp1Doc != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp1Doc[0].Region_Code, name: accomp1Doc[0].User_Name });
                    }
                    if (accomp2Doc != false && accomp2Doc != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp2Doc[0].Region_Code, name: accomp2Doc[0].User_Name });
                    }
                    if (accomp3Doc != false && accomp3Doc != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp3Doc[0].Region_Code, name: accomp3Doc[0].User_Name });
                    }
                    if (accomp4Doc != false && accomp4Doc != undefined) {
                        $(".accompanist-input-token").tokenInput("add", { id: accomp4Doc[0].Region_Code, name: accomp4Doc[0].User_Name });
                    }

                    //$(".accompanist-input-token").tokenInput('clear')
                    //for (var a = 0; a < tpPrefillJson.Tables[4].Rows.length; a++) {
                    //    $(".accompanist-input-token").tokenInput("add", { id: tpPrefillJson.Tables[4].Rows[a].Region_Code, name: tpPrefillJson.Tables[4].Rows[a].User_Name });
                    //}

                    //generate doctor product JSON
                    var content = "";
                    //var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");

                    //if (batchPrivellage == 'YES') {
                    //    for (var r = 0; r < tpPrefillJson.Tables[2].Rows.length; r++) {
                    //        //content = "{\"id\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Doctor_Code + "_" + tpPrefillJson.Tables[2].Rows[r].Region_Code + "" + '",' + "\"ProductCode\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Code + "" + '",' + "\"ProductName\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Name + "" + '",' + "\"Qty\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Quantity + "" + "\"Region_Code\"" + ":" + '"' + "}";
                    //        content = "{\"id\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Doctor_Code + "_" + tpPrefillJson.Tables[2].Rows[r].Doctor_Region_Code + "_" + tpPrefillJson.Tables[2].Rows[r].Batch_Id + "_" + tpPrefillJson.Tables[2].Rows[r].Schedule_Id + "" + '",' + "\"ProductCode\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Code + "" + '",' + "\"ProductName\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Name + "" + '",' + "\"Qty\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Quantity + "" + '"' + "}";
                    //        doctorProductJSON_g.push(eval('(' + content + ')'));
                    //    }
                    //}
                    //else {
                    for (var r = 0; r < tpPrefillJson.Tables[2].Rows.length; r++) {
                        //content = "{\"id\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Doctor_Code + "_" + tpPrefillJson.Tables[2].Rows[r].Region_Code + "" + '",' + "\"ProductCode\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Code + "" + '",' + "\"ProductName\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Name + "" + '",' + "\"Qty\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Quantity + "" + "\"Region_Code\"" + ":" + '"' + "}";
                        content = "{\"id\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Doctor_Code + "_" + tpPrefillJson.Tables[2].Rows[r].Doctor_Region_Code + "" + '",' + "\"ProductCode\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Code + "" + '",' + "\"ProductName\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Product_Name + "" + '",' + "\"Qty\"" + ":" + '"' + "" + tpPrefillJson.Tables[2].Rows[r].Quantity + "" + '"' + "}";
                        doctorProductJSON_g.push(eval('(' + content + ')'));
                    }

                    //}
                    //to get the Accompanist cp details
                    fnCPDetails();

                    //to disable category and sfc if the CAMPAIGN_PLANNER is YES
                    if ($.trim($("#hdnCPCode").val()) != "") {
                        var priv = "";
                        var privArr = new Array();
                        priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
                        privArr = priv.split(',');
                        //if ($.inArray("YES", privArr) > -1) {
                        //    $("#drpCategory").attr('disabled', true);
                        //    $("#txtWorkPlace").attr('disabled', true);

                        //    for (var s = 1; s <= $("#tblSFCHOP tr").length; s++) {
                        //        $("#txtFormPlace_" + s).attr('disabled', true);
                        //        $("#txtToPlace_" + s).attr('disabled', true);
                        //    }
                        //}
                    }

                    fnCheckSFDatainLoad();
                }
                else if (projectCode != "LEAVE") {
                    //enabling and disabling controls for attendance

                    $("#txtCPName").hide();
                    $("#tdCPName").html('Activity Name');
                    $("#drpActivity").show();
                    $("#drpLeaveTypes").hide();

                    $("#trAccompanist").hide();
                    $("#trDoctor").hide();
                    $("#trhr1").hide();

                    $("#trMeetingPoint").hide();
                    $("#trMeetingTime").hide();

                    $("#tdCPName").show();
                    $("#trCategory").show();
                    $("#trWorkPlace").show();
                    $("#trFTPlace").show();

                    var code = activityCode + "_" + projectCode;
                    activityCode_g = code;

                    fnActivity();

                    //bind details for atendance
                    $("#drpCallObj").val("ATTENDANCE");

                    $("#drpCategory option").each(function () {
                        if ($(this).text() == category) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                    fnGetWorkAreas(currentRegion);
                    debugger;
                    work_Area_g = [];
                    if (workArea.lastIndexOf(',') > -1) {
                        debugger;
                        work_Area_g = workArea.split(',');
                    }
                    else {
                        work_Area_g.push(workArea);
                    }
                    for (var w = 0; w < work_Area_g.length; w++) {
                        debugger;
                        $("#txtWorkPlace").tokenInput("add", { id: work_Area_g[w], name: work_Area_g[w] });
                    }

                    //if (workArea.lastIndexOf(',') > -1) {
                    //    debugger;
                    //    work_Area_g = workArea.split(',');

                    //}
                    //else {
                    //    debugger;
                    //    work_Area_g = workArea;
                    //    // for (var w = 0; w < workArea.length; w++) {
                    //    debugger;
                    //    $("#txtWorkPlace").tokenInput("add", { id: workArea, name: workArea });
                    //    //}

                    //}
                    //$("#txtWorkPlace").val(workArea);

                    //bind SFC
                    var tableContent = "";
                    tableContent += "<table id='tblSFCHOP'>";
                    for (var i = 0; i < tpPrefillJson.Tables[3].Rows.length; i++) {
                        var fromPalceDisabled = "disabled=true";
                        if (i == 0) {
                            fromPalceDisabled = "";
                        }

                        tableContent += "<tr><td><input id='txtFormPlace_" + (i + 1) + "' " + fromPalceDisabled + "  class='sfcauto sfcplace' value='" + tpPrefillJson.Tables[3].Rows[i].From_Place + "' /></td>";
                        tableContent += "<td><input id='txtToPlace_" + (i + 1) + "'  class='sfcauto sfcplace newRow'  value='" + tpPrefillJson.Tables[3].Rows[i].To_Place + "' /></td>";
                        tableContent += "<td><input id='txtTravelMode_" + (i + 1) + "'  class='travelModeauto sfcauto' value='" + tpPrefillJson.Tables[3].Rows[i].Travel_Mode + "' /></td></tr>";
                        tableContent += "<input id='hdnDistance_" + (i + 1) + "'  type='hidden' value='" + tpPrefillJson.Tables[3].Rows[i].Distance + "' />";
                        tableContent += "<input id='hdnFare_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].Fare_Amount + "' />";
                        tableContent += "<input id='hdnDistanceFareCode_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Code + "'/>";
                        tableContent += "<input id='hdnSFCRegion_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Region_Code + "'/>";
                        tableContent += "<input id='hdnSFCVersion_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Version_No + "'/>";
                        tableContent += "<input id='hdnSFCCategory_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Category_Name + "'/>";
                        tableContent += "<input id='hdnSFCVisitCount_" + (i + 1) + "'  type='hidden'  value='" + tpPrefillJson.Tables[3].Rows[i].SFC_Visit_Count + "'/>";
                        tableContent += "</td></tr>";
                    }
                    tableContent += "</table>";

                    $("#dvSFCHOP").html('');
                    $("#dvSFCHOP").html(tableContent);
                    fnGetSFCAutoFillData();
                    //if no sfc bind default rows
                    if (tpPrefillJson.Tables[3].Rows.length == 0) {
                        fnCreateSFCHOP(2);
                    }

                    $("#txtRemarks").val(remarks);
                }
                else {
                    //enable and disable controls
                    $("#txtCPName").hide();
                    $("#drpActivity").hide();

                    $("#tdCPName").show();
                    $("#tdCPName").html('Leave Type')
                    $("#drpLeaveTypes").show();

                    $("#trAccompanist").hide();
                    $("#trDoctor").hide();
                    $("#trhr1").hide();

                    $("#trCategory").hide();
                    $("#trWorkPlace").hide();
                    $("#trFTPlace").hide();

                    $("#trMeetingPoint").hide();
                    $("#trMeetingTime").hide();

                    leaveTypeCode = activityCode;

                    fnBindLeaveType();
                    fnGetSFCAutoFillData();
                    //bind details for atendance
                    $("#drpCallObj").val("LEAVE");
                    $("#txtRemarks").val(remarks);
                }
            }
            else {
                eaccompanistName_g = "";
                eaccompanistRegions_g = "";
                fnGetSFCAutoFillData();
                workArea = "";
                fnCPDetails();
            }
            $("#dvInProgress").css('display', 'none');
            $("#btnShowAccomp").trigger("click");
            if (tpPrefillJson.Tables[8] != null || tpPrefillJson.Tables[8] != undefined) {
                //debugger;
                if (tpPrefillJson.Tables[8].Rows.length > 0) {
                    for (var b = 0; b < tpPrefillJson.Tables[8].Rows.length; b++) {
                        batch_val.push(tpPrefillJson.Tables[8].Rows[b].Doctor_Code + '_' + tpPrefillJson.Tables[8].Rows[b].Doctor_Region_Code + '_' + tpPrefillJson.Tables[8].Rows[b].Batch_Id + '_' + tpPrefillJson.Tables[8].Rows[b].Schedule_Id);
                    }

                }
                TPPrefillSchedule = tpPrefillJson.Tables[8].Rows;
            }
            if (tpPrefillJson.Tables[9] != null || tpPrefillJson.Tables[9] != undefined) {
                if (tpPrefillJson.Tables[9].Rows.length > 0) {
                    var dcrStatus = tpPrefillJson.Tables[9].Rows[0].DCR_Status.toString();
                    if (dcrStatus == "1") {
                        $("#dvJointAccompContent .panel-body").html('In DCR Leave is applied for this date');
                    }
                    else if (dcrStatus == "2") {
                        $("#dvtopAlert").show();
                        $("#divHeader").hide();
                        $("#dvtopAlert").html('In DCR Leave is approved for this date, so you can not plan for this date');
                        $("#tblTP").hide();
                    }
                    else if (dcrStatus == "0") {
                        $("#dvJointAccompContent .panel-body").html('In DCR Leave is unapproved for this date');
                    }

                    $("#dvJointAccompContent").css('display', '');
                }
            }
            //to bind the doctors token
            $("#txtDoctor").tokenInput('clear');
            for (var d = 0; d < tpPrefillJson.Tables[1].Rows.length; d++) {
                $("#txtDoctor").tokenInput("add", { id: tpPrefillJson.Tables[1].Rows[d].Doctor_Code + "_" + tpPrefillJson.Tables[1].Rows[d].Doctor_Region_Code, name: tpPrefillJson.Tables[1].Rows[d].Customer_Name + "_" + tpPrefillJson.Tables[1].Rows[d].MDL + "_" + tpPrefillJson.Tables[1].Rows[d].Region_Name });
            }

        },
        error: function (e) {
        }
    });
}

//************************** Prefill the TP For Edit Ends Here ****************************************//

//************************** Highlight CP, SFC Reference starts here ****************************************//

//highlight CP Reference
function fnHighlightCP(obj) {
    var text = $(obj).val();
    $('#dvCPRef').removeHighlight().highlight(text);
}

//highlight SFC Reference
function fnHighlightSFC(obj) {
    var text = $(obj).val();
    $('#dvSFCRef').removeHighlight().highlight(text);
}

//highlight cp when type in cp name text box
function fnHighlightCPN(obj) {
    var text = $(obj).val();
    $("#txtCPRefSearch").val(text);

    $('#dvCPRef').removeHighlight().highlight(text);
}

//************************** Highlight CP, SFC Reference ends here ****************************************//


//function to show the tp lock alert
function fnTPLockIntimation() {
    //debugger;
    $("#dvLockIntimate").html('');
    $("#dvLockIntimate").css('display', 'none');
    //if (tpDaysJSON.Tables[1].Rows.length > 0) {
    //    var tplok = tpDaysJSON.Tables[1].Rows[0].IS_LOCK;
    //    if (tplok == "0") {
    //        var tplockDay = "";
    //        tplockDay = tpDaysJSON.Tables[2].Rows[0].TP_LOCK_DAY;
    //        if (tplockDay != "") {
    //            var mon = new Date(curdate_g).getMonth() + 1;
    //            var tplock = new Date(new Date(curdate_g).getFullYear() + "/" + mon + "/" + tplockDay);

    //            var notifyDate = new Date(new Date(tplock).setDate(new Date(tplock).getDate() - 10))
    //            var nextMonthYear = new Date(new Date(curdate_g).setMonth(new Date(curdate_g).getMonth() + 1));
    //            //array ["Jan","Feb",'''''] -- array[(new Date(nextMonthYear).getMonth())]
    //            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    //            var month = monthname[(new Date(nextMonthYear).getMonth())]
    //            if (new Date(curdate_g) > new Date(notifyDate)) {
    //                // $("#dvLockIntimate").html('Dear <b>' + $("#hdnUserName").val() + ' </b>, Please enter your tour plan for <b>' + (new Date(nextMonthYear).getMonth() + 1) + '-' + new Date(nextMonthYear).getFullYear() + ' </b>on or before <b>' + $.datepicker.formatDate('dd M yy', tplock) + '</b>.  Otherwise , the system will lock your DCR entry <div onclick="fnCloseAccomAlert()" style="text-decoration:underline;cursor:pointer"> Close </div>');
    //                $("#dvLockIntimate").html('Dear <b>' + $("#hdnUserName").val() + ' </b>, Please enter your tour plan for <b>' + (month) + '-' + new Date(nextMonthYear).getFullYear() + ' </b>on or before <b>' + $.datepicker.formatDate('dd M yy', tplock) + '</b>.  Otherwise , the system will lock your DCR entry <div onclick="fnCloseAccomAlert()" style="text-decoration:underline;cursor:pointer"> Close </div>');
    //                $("#dvLockIntimate").css('display', 'block');
    //            }
    //        }
    //    }
    //}
}

//function to close accompanist alert
function fnCloseAccomAlert() {
    $("#dvLockIntimate").slideUp();
}

//*********************************** TP DashBoard starts here ***************************************************//
function fnTPDashBoard() {
    //debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetTPDashBoard',
        data: "UserCode=" + $("#hdnUserCode").val() + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            var tbldocCovContent = "";
            tbldocCovContent += "<table cellpadding='2' cellspacing='2'>";
            for (var dc = 0; dc < jsData.Tables[0].Rows.length; dc++) {
                tbldocCovContent += "<tr>";
                tbldocCovContent += "<td>" + jsData.Tables[0].Rows[dc].Category_Name + "</td>";

                var tpdocCov = jsonPath(jsData, "$.Tables[1].Rows[?(@.Category=='" + jsData.Tables[0].Rows[dc].Category + "')]");
                var actualVisit = 0;

                if (tpdocCov != false) {
                    actualVisit = tpdocCov[0].Count;
                }
                var docCovPer = (parseInt(actualVisit) / parseInt(jsData.Tables[0].Rows[dc].Count)) * 100;

                tbldocCovContent += "<td><span  class='td-dashboard'>" + docCovPer.toFixed(2) + "%  (" + actualVisit + "/" + jsData.Tables[0].Rows[dc].Count + ")</span></td>";

                tbldocCovContent += "</tr>";
            }
            tbldocCovContent += "</table>";
            $("#dvDoctorCoverage").html(tbldocCovContent);

            //Missed Doctors Count
            $("#spn3Mnth").html(jsData.Tables[2].Rows[0].Count + " -" + DoctorLabel);
            $("#spn6Mnth").html(jsData.Tables[3].Rows[0].Count + " -" + DoctorLabel);
            $("#spn9Mnth").html(jsData.Tables[4].Rows[0].Count + " -" + DoctorLabel);
            $("#spn12Mnth").html(jsData.Tables[5].Rows[0].Count + " -" + DoctorLabel);

            //product bind
            var tblProdContent = "";
            tblProdContent += "<table>"

            for (var pd = 0; pd < jsData.Tables[6].Rows.length; pd++) {
                tblProdContent += "<tr>";
                tblProdContent += "<td>" + jsData.Tables[6].Rows[pd].Product_Name + "</td>";
                tblProdContent += "<td><span  class='td-dashboard'>" + jsData.Tables[6].Rows[pd].Count + " - Drs</span></td>";
                tblProdContent += "</tr>";
            }

            tblProdContent += "</table>"

            $("#dvProdDoctor").html(tblProdContent);

        }
    });
}
//*********************************** TP DashBoard ends here ***************************************************//
//toggle tree
function fnOpenTree() {
    //debugger;
    $("#dvTPMonth").slideDown()
    $("#dvUserTree").slideDown();
    $("#divleft").css('width', '15%');
    $("#imggr").hide();
    $("#imgless").show()
    $("#divCenter").css('width', '60%');
}
function fnCloseTree() {
    //debugger;
    $("#dvTPMonth").slideUp()
    $("#dvUserTree").slideUp();
    $("#divleft").css('width', '3%');
    $("#imggr").show();
    $("#imgless").hide()
    $("#divCenter").css('width', '70%');
}

//Special char check 
function fnChkSplChar(id) {
    if ($("#" + id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9 _]+$");
        if (!specialCharregex.test($("#" + id).val())) {
            return false;
        }
    }
    return true
}

function fnChkSplCharForRemarks(id) {
    if ($("#" + id).val() != "") {
        var specialCharregex = new RegExp(/[~`^&<>\\]/g);
        if (specialCharregex.test($("#" + id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}


//************************************ TP Reports Navigation ***************************************************//
function fnTPReport() {
    $.modal({ ajax: '/HiDoctor_Reports/Reports/TourPlanner', title: 'Tour Planner Report', overlayClose: true });
    $("#divReport").css('width', '900px');

}


// ************************** TP EXCEL EXPORT ******************************************//
function fnGetTPExcelLink() {
    //check if tree node is selected 
    if ($("#hdnUserCode").val() == "") {
        fnMsgAlert('error', 'Error', 'Please select the user to enter tour plan');
        return false;
    }

    var month = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
    var year = $('#dvCalendar').fullCalendar('getDate').getFullYear();
    var monthName = monthArray[$('#dvCalendar').fullCalendar('getDate').getMonth()];

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetTourPlannerExcelLink',
        data: "UserCode=" + $("#hdnUserCode").val() + "&month=" + month + "&year=" + year + "&monthName=" + monthName,
        success: function (result) {
            if (result.split('^')[0] != 'FAIL') {
                $("#aTPExcelExportLink").attr('href', result);
                $("#aTPExcelExportLink").css('display', '');
                $("#aTPExcelExport").css('display', 'none');
                $("#dvTPExcelExport").show();
            }
            else {
                fnMsgAlert('error', 'Error', 'Error:' + result.split('^')[1]);
                return false;
            }
            $("#main").unblock();
        },
        error: function (e) {
            $("#main").unblock();
        }
    });
}

function fnShowTPExcelLink() {
    $("#aTPExcelExportLink").css('display', 'none');
    $("#aTPExcelExport").css('display', '');
    $("#dvTPExcelExport").show();
}

function fnGetDateDifference(d1, d2) {
    return (d2 - d1) / 1000 / 60 / 60 / 24;
}

function fnCheckHiDoctorStartDate() {
    var dateText = new Date($('#txtTpDate').val());
    if (fnGetDateDifference(new Date(HiDoctorStartDate_g), new Date(dateText)) < 0) {
        alert("Dear User, TP can't be entered before joining date.");
        return false;
    }
}

function fnCheckHiDoctorStartDateforDay() {
    var flag = true;
    var tpDate = $('#txtTpDate').val().split('/');
    if (fnGetDateDifference(new Date(HiDoctorStartDate_g), new Date(tpDate[2], tpDate[1] - 1, tpDate[0])) < 0) {
        alert("Dear User, TP can't be entered before joining date.");
        flag = false;
    }
    return flag;
}

function fnConvertDateFormat(d, currentFormat) {
    var daArr = d.split('/');
    var d1 = "";
    if (currentFormat == "dd/mm/yyyy") {
        d1 = daArr[0] + "/" + shortmonthArray[daArr[1] - 1] + "/" + daArr[2];
    }
    else if (currentFormat == "mm/dd/yyyy") {
        d1 = daArr[1] + "/" + shortmonthArray[daArr[0] - 1] + "/" + daArr[2];
    }
    return d1;
}

function fnTPSFCEventBinder() {
    $(".sfcauto").blur(function () { fnFillDistanceTravelMode(this.id); if (this.id.indexOf("txtToPlace_") > -1) { fnAddNewRowSFCHOP(this); } });

    $(".travelModeauto").dblclick(function () { fnFillDistanceTravelMode(this.id); });
}


function fnFillDistanceTravelMode(id) {
    //debugger;
    if (id == "txtWorkPlace") return;
    var rCnt = id.split('_')[1];
    var regionCodesArr = new Array();
    regionCodesArr.push($("#hdnRegionCode").val()); //By default add the current region code
    var accRegions = "";
    if ($.inArray("SFC", accompArr) > -1) {
        if ($(".accompanist-input-token").tokenInput('get') != undefined && $(".accompanist-input-token").tokenInput('get') != null) {
            accRegions = $(".accompanist-input-token").tokenInput('get')
        }
        for (var r = 0; r < accRegions.length; r++) {
            if ($.inArray(accRegions[r].id, regionCodesArr) == -1) {
                regionCodesArr.push(accRegions[r].id);
            }
        }
    }
    //tableContent += "<tr><td><input id='txtFormPlace_" + i + "' onblur='fnAddNewRowSFCHOP(this)' class='sfcauto' /> </td>";
    //tableContent += "<td><input id='txtToPlace_" + i + "'  class='sfcauto' /></td>";
    //tableContent += "<td><input id='txtTravelMode_" + i + "'  class='travelModeauto' /></td></tr>";
    $("#txtFormPlace_" + rCnt).val($("#txtFormPlace_" + rCnt).val().replace("'", ""));
    $("#txtToPlace_" + rCnt).val($("#txtToPlace_" + rCnt).val().replace("'", ""));
    $("#txtTravelMode_" + rCnt).val($("#txtTravelMode_" + rCnt).val().replace("'", ""));
    if ($("#txtFormPlace_" + rCnt).val() != "" || $("#txtToPlace_" + rCnt).val() != "" || $("#txtTravelMode_" + rCnt).val() != "") {

        // SFC autofill
        if ($("#txtFormPlace_" + rCnt).val() != "" && $("#txtToPlace_" + rCnt).val() != "") {
            if (sfcJson_g != "") {
                var distanceJson = []
                for (var i = 0; i < regionCodesArr.length; i++) {
                    var result = "";
                    //debugger;
                    // filter the auto fill based on the category selection
                    if (($.inArray($("#drpCategory :selected").text(), sfcValidation) > -1) && categoryCheckNeededTP == "YES") {
                        result = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + $("#txtFormPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "'  & @.Region_Code=='" + regionCodesArr[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFormPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "'& @.Region_Code=='" + regionCodesArr[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                    else if (regionCodesArr[i].trim() == currentRegion.trim() && categoryCheckNeededTP == "NO" && ($.inArray($("#drpCategory :selected").text(), sfcValidation) > -1)) {
                        result = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + $("#txtFormPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "' & @.Region_Code=='" + regionCodesArr[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFormPlace_" + rCnt).val() + "' & @.SFC_Category_Name == '" + $("#drpCategory :selected").text().toUpperCase() + "'& @.Region_Code=='" + regionCodesArr[i] + "'))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                    else {
                        result = jsonPath(sfcJson_g, "$.[?((@.From_Place=='" + $("#txtFormPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtToPlace_" + rCnt).val() + "' & @.Region_Code=='" + regionCodesArr[i] + "') | (@.From_Place=='" + $("#txtToPlace_" + rCnt).val() + "' & @.To_Place == '" + $("#txtFormPlace_" + rCnt).val() + "' & @.Region_Code=='" + regionCodesArr[i] + "' ))]");
                        if (result != null && result != undefined && result != false)
                            distanceJson.push(result);
                    }
                }
                var f_distanceJson = [];
                var arrCount = 0;
                if (distanceJson.length > 0 && distanceJson != null) {
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
                        $("#hdnDistance_" + rCnt).val(cur_sfc.Distance);
                        $("#hdnFare_" + rCnt).val(cur_sfc.Fare_Amount);
                        $("#hdnDistanceFareCode_" + rCnt).val(cur_sfc.Distance_Fare_Code);
                        $("#hdnSFCRegion_" + rCnt).val(cur_sfc.SFC_Region_Code);
                        $("#hdnSFCVersion_" + rCnt).val(cur_sfc.SFC_Version_No);
                        $("#hdnSFCCategory_" + rCnt).val(cur_sfc.SFC_Category_Name);
                        $("#hdnSFCVisitCount_" + rCnt).val(cur_sfc.SFC_Visit_Count);
                        $("#txtTravelMode_" + rCnt).val(cur_sfc.Travel_Mode);
                        $("#lblTravelMode_Auto").html(cur_sfc.Travel_Mode);
                    }
                }
                    // if no from place to place combination found.
                else {
                    $("#hdnDistance_" + rCnt).val("0");
                    $("#hdnFare_" + rCnt).val("0");
                    $("#hdnDistanceFareCode_" + rCnt).val("");
                    $("#hdnSFCRegion_" + rCnt).val(currentRegion);
                    $("#hdnSFCVersion_" + rCnt).val("");
                    $("#hdnSFCCategory_" + rCnt).val($("#drpCategory :selected").text().toUpperCase());
                    $("#hdnSFCVisitCount_" + rCnt).val("0");
                }
            }
                // if no from place to place combination found.
            else {
                $("#hdnDistance_" + rCnt).val("0");
                $("#hdnFare_" + rCnt).val("0");
                $("#hdnDistanceFareCode_" + rCnt).val("");
                $("#hdnSFCRegion_" + rCnt).val(currentRegion);
                $("#hdnSFCVersion_" + rCnt).val("");
                $("#hdnSFCCategory_" + rCnt).val($("#drpCategory :selected").text().toUpperCase());
                $("#hdnSFCVisitCount_" + rCnt).val("0");
            }
        }
        else {
            $("#hdnDistance_" + rCnt).val("0");
            $("#hdnFare_" + rCnt).val("0");
            $("#hdnDistanceFareCode_" + rCnt).val("");
            $("#hdnSFCRegion_" + rCnt).val(currentRegion);
            $("#hdnSFCVersion_" + rCnt).val("");
            $("#hdnSFCCategory_" + rCnt).val($("#drpCategory :selected").text().toUpperCase());
            $("#hdnSFCVisitCount_" + rCnt).val("0");
        }
    }
    else {

        $("#hdnDistance_" + rCnt).val("");
        $("#hdnFare_" + rCnt).val("0");
        $("#hdnDistanceFareCode_" + rCnt).val("");
        $("#hdnSFCRegion_" + rCnt).val("");
        $("#hdnSFCVersion_" + rCnt).val("");
        $("#hdnSFCCategory_" + rCnt).val("");
        $("#hdnSFCVisitCount_" + rCnt).val("0");
    }
}

function fnSFCOptionPopup(disJson, rCnt) {
    debugger;
    $('#dvAllSFC').html('');
    if (disJson != null && disJson !== undefined && disJson.length > 0) {
        var content = "";
        content += "<table> <thead><tr><th>Select</th><th>Category Name</th><th>From Place</th>";
        content += "<th>To Place </th><th>Travel Mode</th><th>Region Name</th><th>Distance</th><th>Fare</th>"
        if (privVisitCount == "YES")
            content += "<th>Min Visit Count</th>"
        var sfcCnt = "";
        sfcCnt = fnGetPrivilegeVal("SFC_COUNT_CHECK_IN_TP", "NO");
        if (sfcCnt == "YES")
            content += "<th>Max Visit Count</th>"
        content += "</tr> </thead><tbody>";

        var routeWay = "D";
        if ($("#txtFormPlace_" + rCnt).val() == disJson[0].To_Place && $("#txtToPlace_" + rCnt).val() == disJson[0].From_Place) {
            routeWay = "R";
        }

        for (var i = 0; i < disJson.length; i++) {
            content += " <tr><td> <input type='radio' name='chkSFCSelect' id='chkSFCSelect_" + i + "' value='"
                + disJson[i].Distance_Fare_Code + "_" + disJson[i].Distance + "_" + disJson[i].Fare_Amount + "_" + disJson[i].SFC_Category_Name
                + "_" + disJson[i].SFC_Version_No + "_" + disJson[i].SFC_Region_Code + "_" + rCnt + "_" + routeWay + "_" + disJson[i].Travel_Mode
                + "_" + disJson[i].SFC_Visit_Count + "' /> </td>";
            content += "<td>" + disJson[i].SFC_Category_Name + "</td>";
            content += "<td>" + disJson[i].From_Place + "</td>";
            content += "<td>" + disJson[i].To_Place + "</td>";
            content += "<td>" + disJson[i].Travel_Mode + "</td>";

            if (disJson[i].SFC_Region_Code == currentRegion) {
                content += "<td>" + currRegionName + "</td>";
            }
            else {

                var accRegionName = $('#txtAccompaninst').tokenInput('get');
                var regionName = jsonPath(accRegionName, "$.[?(@.id=='" + disJson[i].SFC_Region_Code + "')]");
                if (regionName != null && regionName !== undefined && regionName.length > 0) {
                    content += "<td>" + regionName[0].name.split(',')[0] + "</td>";
                }
                else {

                    content += "<td></td>";
                }
                //var regionName = jsonPath(accompanistJson_g, "$.[?(@.value=='" + disJson[i].SFC_Region_Code + "')]");
                //if (regionName != null && regionName !== undefined && regionName.length > 0) {
                //    content += "<td>" + regionName[0].label.split(',')[0] + "</td>";
                //}
                //else {
                // content += "<td>" + disJson[i].SFC_Region_Name + "</td>";
                //}
            }
            if (disJson[i].Distance != null && disJson[i].Distance != "") {
                content += "<td>" + parseInt(disJson[i].Distance) + "</td>";
            }
            else {
                content += "<td>0</td>";

            }

            content += "<td>" + disJson[i].Fare_Amount + "</td>";
            if (privVisitCount == "YES")
                content += "<td>" + disJson[i].Minimum_Count + "</td>";
            if (sfcCnt == "YES")
                content += "<td>" + disJson[i].SFC_Visit_Count + "</td>";
            content += "</tr>";
        }
        content += "</tbody> </table>";
        $('#dvAllSFC').html(content);
        $("#dvSFCPopUp").overlay().load();
        if (($.inArray($("#drpCategory :selected").text(), sfcValidation) > -1)) {
            $('.close').hide();
            $('.sfcoverlayclose').hide();
        }
        else {
            $('.close').show();
            $('.sfcoverlayclose').show();
        }

    }
}


function fnBindSelectedSFCCode() {
    //debugger;
    //Distance_Fare_Code|Distance|Fare_Amount |SFC_Category_Name|SFC_Version_No|SFC_Region_Code| rCnt |D|TrvelMode

    var selectedVal = $('input:radio[name=chkSFCSelect]:checked').val();
    if ($('input:radio[name=chkSFCSelect]:checked').val() != undefined) {
        $('.close').show();
        $('.sfcoverlayclose').show();
    }
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
        $("#hdnDistance_" + currentSFCRow).val(selectedVal.split('_')[1]);
        $("#hdnFare_" + currentSFCRow).val(selectedVal.split('_')[2]);
        $("#hdnSFCRegion_" + currentSFCRow).val(selectedVal.split('_')[5]);
        $("#hdnSFCVersion_" + currentSFCRow).val(selectedVal.split('_')[4]);
        $("#hdnSFCCategory_" + currentSFCRow).val(selectedVal.split('_')[3]);
        $("#txtTravelMode_" + currentSFCRow).val(selectedVal.split('_')[8]);
        $("#lblTravelMode_Auto").html(selectedVal.split('_')[8]);
        $("#hdnSFCVisitCount_" + currentSFCRow).val(selectedVal.split('_')[9]);
    }
    $("#dvSFCPopUp").overlay().close();
    if (privVisitCount == "YES")
        $("#btnSaveTP").hide();
    else
        $("#btnSaveTP").show();
}

function fnCheckSFDatainLoad() {
    //debugger;
    var sfcData = [];
    var length = $("#tblSFCHOP tr").length;
    for (var i = 1; i <= length; i++) {
        if ($("#txtFormPlace_" + i).val() != "") {
            sfcData.push({
                From_Place: (($("#hdnRouteWay_" + i).val() == "R") ? $("#txtToPlace_" + i).val() : $("#txtFormPlace_" + i).val())
                , To_Place: (($("#hdnRouteWay_" + i).val() == "R") ? $("#txtFormPlace_" + i).val() : $("#txtToPlace_" + i).val())
                , Distance: $("#hdnDistance_" + i).val()
                , Travel_Mode: $("#txtTravelMode_" + i).val()
                , Route_Way: $("#hdnRouteWay_" + i).val()
                , Distance_Fare_Code: $("#hdnDistanceFareCode_" + i).val()
                , Is_Route_Complete: "N"
                , SFC_Region_Code: $("#hdnSFCRegion_" + i).val()
                , SFC_Version_No: $("#hdnSFCVersion_" + i).val()
                , SFC_Category_Name: $("#hdnSFCCategory_" + i).val()
            });
        }
    }

    //if (intermediateNeed != "NO" && $("#ddlCategory :selected").text().toUpperCase() != "HQ") {
    //    if ($.inArray($("#ddlCategory :selected").text(), sfcValidation) > -1) { // SFC_VALIDATION privilege check.
    //        if (isRouteComplete == "YES" && ($.inArray($("#ddlCategory :selected").text(), hopRouteCategory) > -1)) {
    //            if ($("#trInterAuto") != null) {

    //                sfcData.push({
    //                    From_Place: $("#lblFromPlace_Auto").html()
    //                   , To_Place: $("#lblToPlace_Auto").html()
    //                   , Distance: $("#lblDistance_Auto").html()
    //                   , Travel_Mode: $("#lblTravelMode_Auto").html()
    //                   , Route_Way: $("#hdnRouteWay_Auto").val()
    //                   , Distance_Fare_Code: $("#hdnDistanceFareCode_Auto").val()
    //                   , Is_Route_Complete: "Y"
    //                   , SFC_Region_Code: $("#hdnSFCRegion_Auto").val()
    //                   , SFC_Version_No: $("#hdnSFCVersion_Auto").val()
    //                   , SFC_Category_Name: $("#hdnSFCCategory_Auto").val()
    //                });
    //            }
    //        }
    //    }
    //}

    if (sfcData != null && sfcData.length > 0) {
        // check sfc data
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRV4Header/CheckSFCData',
            data: "sfcData=" + JSON.stringify(sfcData) + "&dcrDate=" + $("#hdnTPDate").val(),
            success: function (result) {
                if (result.split('^')[0] != "FAIL") {
                    if (result.split('$')[1] == "Y") {
                        var sfcTble = "";

                        var sfcObj = eval('(' + result.split('$')[0] + ')');
                        for (var a = 0; a < sfcObj.length; a++) {
                            if (sfcObj[a].Is_Route_Complete != "Y") {
                                $("#txtFormPlace_" + (a + 1)).val(sfcObj[a].From_Place);
                                $("#txtToPlace_" + (a + 1)).val(sfcObj[a].To_Place);
                                $("#hdnDistance_" + (a + 1)).val(sfcObj[a].Distance);
                                $("#txtTravelMode_" + (a + 1)).val(sfcObj[a].Travel_Mode);
                                $("#hdnRouteWay_" + (a + 1)).val(sfcObj[a].Route_Way);
                                $("#hdnDistanceFareCode_" + (a + 1)).val(sfcObj[a].Distance_Fare_Code);
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

//Used to Get the Selected Accompanist Cp Details
function fnIncludeAccompanistCP() {
    debugger;
    var regionCodes = "";
    var accObj = "";
    var priv = "";
    var privArr = new Array();
    var curRegionCode = $("#hdnRegionCode").val();

    if ($(".accompanist-input-token").tokenInput('get') != undefined && $(".accompanist-input-token").tokenInput('get') != null) {
        accObj = $(".accompanist-input-token").tokenInput('get');
    }
    for (var i = 0; i < accObj.length; i++) {
        regionCodes += accObj[i].id + ',';
    }
    if (accObj.length > 0) {
        regionCodes = curRegionCode + ',' + regionCodes.slice(0, -1) + ',';
    }
    else {
        regionCodes = curRegionCode + ',';
    }

    regionCodes = regionCodes;

    priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
    privArr = priv.split(',');

    //Clear the current User plus Accompanist CP Details     
    //cpDetailsJSON_g.Tables[0].Rows = [];
    //cpDetailsJSON_g.Tables[1].Rows = [];
    cpDetailsJSON_g = "";
    cpAccompanistJson_g = [];


    if ($.inArray("YES", privArr) > -1 || $.inArray("OPTIONAL", privArr) > -1) {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/TourPlanner/GetCpforAccompanist',
            data: "accomcurrentregionCode=" + regionCodes + "&UserCode=" + $("#hdnUserCode").val(),
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                if (jsData != null && jsData != "") {
                    cpDetailsJSON_g = jsData;
                    if (jsData.Tables[0] != '' && jsData.Tables[0] != null && jsData.Tables[0].Rows.length > 0) {
                        for (var k = 0 ; k < jsData.Tables[0].Rows.length; k++) {
                            //  cpDetailsJSON_g.Tables[0].Rows.push(jsData.Tables[0].Rows[k]);
                            cpAccompanistJson_g.push(jsData.Tables[0].Rows[k]);
                        }
                        //if (jsData.Tables[1] != '' && jsData.Tables[1] != null && jsData.Tables[1].Rows.length > 0) {
                        //    for (var k = 0 ; k < jsData.Tables[1].Rows.length; k++) {
                        //        cpDetailsJSON_g.Tables[1].Rows.push(jsData.Tables[1].Rows[k]);
                        //    }
                        //}
                        fnPrefillAccompanistCp(cpAccompanistJson_g);
                    }
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
    debugger;
    cpJson_g = ""; //Clear the page Load Cp   
    var cpJsonaccom = obj;
    if (cpJsonaccom != null && cpJsonaccom.length > 0) {
        if (cpJsonaccom != null && cpJsonaccom != "") {
            var cp = "[";
            for (var i = 0; i < cpJsonaccom.length; i++) {
                cp += "{label:" + '"' + "" + cpJsonaccom[i].CP_Name + "" + '",' + "value:" + '"' + "" + cpJsonaccom[i].CP_Code + "" + '"' + "}";
                if (i < cpJsonaccom.length - 1) {
                    cp += ",";
                }
            }
            cp += "];";
            var cpJson = eval(cp);
            cpJson_g = cpJson;
            $("#txtCPName").unautocomplete();
            $("#txtCPName").blur(function () { fnGetCPDoctors(this); });
            autoComplete(cpJson, "txtCPName", "hdnCPCode", 'cpauto');
            fnBindCPReference();
        }
    }
    else {
        $("#txtCPName").unautocomplete();
    }
}



//function to clear all the controls
function fnClearAccompanistDetails() {
    debugger;
    //enabling and disabling controls for FIELD & Field RCPA
    $("#trAccompanist").show();
    $("#trDoctor").show();
    $("#trhr1").show();

    $("#trCategory").show();
    $("#trWorkPlace").show();
    $("#trFTPlace").show();
    $("#drpLeaveTypes").hide();


    //Meeting Time and meeting Place Control show
    $("#trMeetingPoint").show();
    $("#trMeetingTime").show();

    //to remove error class
    $("#txtWorkPlace").removeClass('error');
    $("#spnRemarksError").html('');

    var priv = "";
    var privArr = new Array();
    priv = fnGetPrivilegeVal("CAMPAIGN_PLANNER", "NO,");
    privArr = priv.split(',');
    if ($.inArray("YES", privArr) > -1 || $.inArray("OPTIONAL", privArr) > -1) {
        $("#txtCPName").show();
        $("#tdCPName").show();
        $("#tdCPName").html('Beat / Patch Plan Name');
        $("#drpActivity").hide();
    }
    else {
        $("#txtCPName").hide();
        $("#tdCPName").hide();
        $("#drpActivity").hide();
    }
    $("#spnTpDateError").html('');
    $("#spnCategoryError").html('');
    $("#spnCPError").html('');

    $("#txtWorkPlace").attr('disabled', false);
    $("#drpCategory").attr('disabled', false);

    doctorJSON_g = [{ id: 0 }];
    doctorProductJSON_g = [{ id: 0 }];

    var dcrEntry = "";
    var dcrEntryArr = new Array();

    dcrEntry = fnGetPrivilegeVal("TP_ENTRY_OPTIONS", "FIELD_RCPA,ATTENDANCE,LEAVE");
    dcrEntryArr = dcrEntry.split(',');
    if ($.inArray("FIELD", dcrEntryArr) > -1) {
        $("#drpCallObj").val("FIELD");
    }
    else if ($.inArray("FIELD_RCPA", dcrEntryArr) > -1) {
        $("#drpCallObj").val("FIELD_RCPA");
    }

    $("#drpCallObj").attr('selectedIndex', 0);
    var accompanistObj = $(".accompanist-input-token").tokenInput('get');
    //debugger;
    $("#dvSFCHOP").html('');
    $("#txtCPName").val('');
    $("#hdnCPCode").val('');
    $("#spnCPError").html('');
    $("#drpCategory").val(0)
    $("#txtWorkPlace").val('');
    if ($("#txtAccompaninst").val() == "") {
        $("#txtWorkPlace").tokenInput('clear');
    }
    $("#txtWorkPlace").tokenInput('clear');
    $("#drpLeaveTypes").val(0);
    $("#txtMeetingTime").val('');
    $("#txtMeetingPoint").val('');
    //$('#txtDoctor').val('');

    fnCreateSFCHOP(2);
    // fnIncludeAccompanistCP();
    //fnBindCPReference();
    $("#dvCPRef").html('');
    $(".token-input-dropdown-facebook").css('display', 'none');
    $("#txtRemarks").val('Remarks');
    $("#txtDoctor").tokenInput('clear');


    $("#dvtopAlert").hide();
    $("#spnSFCError").html('');
}
function fnIncludeCurrentSFC(regionCode, drpCallObj) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRV4Header/GetSFCData',
        data: "region=" + regionCode + "&dcrDate=" + $("#hdnTPDate").val(),
        async: false,
        success: function (accSFC) {
            if (accSFC != null) {
                accSFCJson_g = accSFC.data
                sfcJson_g = accSFCJson_g;
                fnGetWorkAreas(currentRegion)
                if (drpCallObj == "FIELD_RCPA") {
                    try {
                        //Fill the Array 
                        if ($.inArray("SFC", accompArr) > -1) {
                            if ($(".accompanist-input-token").tokenInput('get') != undefined && $(".accompanist-input-token").tokenInput('get') != null) {
                                accRegions = $(".accompanist-input-token").tokenInput('get')
                            }
                        }
                        if (accRegions != undefined)
                            for (var r = 0; r < accRegions.length; r++) {
                                fnIncludeAccompanistSFC(accRegions[r].id);
                            }
                    }
                    catch (e) {
                    }
                }
            }
            fnEnableSFCAutocomplete();
        },
        error: function (e) {
        }
    });
}

function fnCheckCpLastEnteredDate() {
    //debugger;
    var rValue = true;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetCpLastEnteredDate',
        async: false,
        data: "usercode=" + $("#hdnUserCode").val() + "&cpcode=" + $("#hdnCPCode").val() + "&tp_date=" + $("#hdnTPDate").val(),
        success: function (result) {
            if (result != "NO") {
                fnMsgAlert('error', 'Tour Planner', result);
                rValue = false;
            }
        }
    });
    return rValue;

}

function fnGlobalSubmit() {
    //debugger;
    $("#GlobalSubmitError").html("");
    if (privVisitCount == "YES") {
        //debugger;
        var month = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
        var year = $('#dvCalendar').fullCalendar('getDate').getFullYear();

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/TourPlanner/GetMonthlyTP',
            data: "Month=" + month + "&Year=" + year + "&UserCode=" + $("#hdnUserCode").val() + "",
            success: function (response) {
                //debugger;
                response = eval('(' + response + ')');
                var valid = true;
                var message = response.Tables[1].Rows[0].Message;
                response = response.Tables[0].Rows;
                if (message.toLowerCase() == "submitted") {
                    fnMsgAlert('info', 'Tour Planner', 'you have already submitted TP for all days in this months');
                    return false;
                }
                MinVisitCountDetail = response;
                for (var i = 0; i < response.length; i++) {
                    if (response[i].Visit_Count < response[i].Minimum_Count) {
                        valid = false;
                        break;
                    }
                }

                if (valid == true) {
                    $.ajax({
                        type: 'POST',
                        url: '../HiDoctor_Activity/TourPlanner/GlobalSubmit',
                        data: "Month=" + month + "&Year=" + year + "&UserCode=" + $("#hdnUserCode").val() + "",
                        success: function (response) {
                            if (response == "SUCCESS") {
                                fnMsgAlert('success', 'Tour Planner', 'Successfully Submitted');
                                $('#dvCalendar').fullCalendar('refetchEvents');
                            }
                        },
                        complete: function (respon) {
                        },
                        error: function (e) {
                        }
                    });
                }
                else {
                    $("#GlobalSubmitError").html("You cannot submit since SFC minimum visit count has not been met. <a href=''  onclick='showMinCount(event)' >Click Here </a> to see SFC Minimum visit count details.")
                }
            },
            complete: function (respon) {
            },
            error: function (e) {
            }
        });
    }
}

function showMinCount(eve) {
    //debugger;
    eve.preventDefault();
    var html = "<table style='width:100%;'>";
    html += "<tr><th>From Place</th><th>To Place</th><th>Category</th><th>Minimum Count</th><th>Visit Count</th></tr>"
    for (var i = 0; i < MinVisitCountDetail.length; i++) {
        html += "<tr>";
        html += "<tr><td>" + MinVisitCountDetail[i].From_Region_Name + "</td><td>" + MinVisitCountDetail[i].To_Region_Name + "</td><td>" + MinVisitCountDetail[i].Category_Name + "</td><td>" + MinVisitCountDetail[i].Minimum_Count + "</td><td>" + MinVisitCountDetail[i].Visit_Count + "</td></tr>"
        html += "</tr>";
    }
    html += "</table>"
    $("#dvSFCData").html(html);
    $("#dvMinVCpopup").overlay().load();
    $("#dvMinVCpopup").overlay().load();
}

function fnCheckTPComplete() {
    //debugger;
    var month = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
    var year = $('#dvCalendar').fullCalendar('getDate').getFullYear();
    var result = false;

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/CheckTPofMonthCompleted',
        async: false,
        data: "Month=" + month + "&Year=" + year + "&UserCode=" + $("#hdnUserCode").val() + "",
        success: function (response) {
            if (response == "YES") {
                result = true;
            }
            else {
                result = false;
            }
        },
        error: function (response) {
            result = false;
        },
    });
    return result;
}
////////////////////////// Batch ///////////////////////////
function fngetBatchInformation() {
    debugger;
    var AccRegionCode = "";
    var accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    var accompArr = accomp.split(',');
    if ($.inArray("BATCH", accompArr) > -1 && $.inArray("DOCTOR", accompArr) > -1) {
        if ($(".accompanist-input-token").val() != "") {
            var acc = $(".accompanist-input-token").tokenInput('get');
            for (var i = 0; i < acc.length; i++) {
                AccRegionCode += acc[i].id + ",";
            }
        }
    }
    var TpDate = $("#hdnTPDate").val();
    $.ajax(
        {
            async: false,
            type: 'post',
            data: "AccRegionCode=" + AccRegionCode + "&TpDate=" + TpDate + "&UserCode=" + $('#hdnUserCode').val(),
            url: '../HiDoctor_Activity/TourPlanner/GetBatchInformation',
            success: function (jsonResult) {
                debugger;
                $('#tblBatchInfo').html('');
                var str = '';
                var response = jsonResult.current;
                if (jsonResult.current != undefined) {
                    if (response.length != 0) {

                        str += ' <table id="tblBatchData" class="table table-striped fnsearch" cellspacing="0" style="margin-bottom: 0px;border: 1px solid #aaa;font-size: 11px;">';
                        str += '<thead><tr><th class="thcolor">Select</th><th class="thcolor">Region Name</th><th class="thcolor">Location</th><th class="thcolor">' + DoctorLabel + '</th><th class="thcolor">Batch Name</th><th class="thcolor">Schedule Name</th><th class="thcolor">Start Date</th><th class="thcolor">End Date</th><th class="thcolor">No. of Weeks</th><th class="thcolor">Product</th></tr></thead>';
                        for (var i = 0; i < response.length; i++) {
                            var prefSchedule = $.grep(TPPrefillSchedule, function (ele, ind) {
                                if (ele.Batch_Id == response[i].Batch_Id && ele.Schedule_Id == response[i].Schedule_Id)
                                    return ele;
                            });
                            var hospital = response[i].Hospital_Name == null ? "NA" : response[i].Hospital_Name;
                            str += '<tbody><tr><td><input ' + (prefSchedule.length > 0 ? "checked" : "") + ' type="checkbox" class="Batch" id="Bcheck_' + i + '"/><input type="hidden" id="BhCustomerCode_' + i + '" value="' + response[i].Customer_Code + '"/><input type="hidden" id="BhCustomerRegion_' + i + '" value="' + response[i].Doctor_RegionName + '"/>';
                            str += '<input type="hidden" id="BhCustomerMDL_' + i + '" value="' + response[i].MDL_Number + '"/><input type="hidden" id="BhCustomerReg_' + i + '" value="' + response[i].Customer_RegionCode + '"/><input type="hidden" id="Bhbatchdetails_' + i + '" value="' + response[i].Batch_Id + "_" + response[i].Schedule_Id + '"/></td>';
                            str += '<td>' + response[i].Region_Name + '</td><td>' + hospital + '</td><td id="BhCustomerName_' + i + '">' + response[i].Customer_Name + '</td><td>' + response[i].Batch_Name + '</td>';
                            str += '<td>' + response[i].Schedule_Name + '</td><td>' + response[i].Start_Date + '</td><td>' + response[i].End_Date + '</td><td>' + response[i].Num_of_Weeks + '</td><td><a href="#dvBatchProductInfo" data-toggle="modal" onclick="fnbatchProduct(' + response[i].Schedule_Id + ')">Click Here</a></td>  </tr>'
                        }
                        str += '</tbody></table>'

                    }
                }
                else {
                    str += '<lable>No Data Found</lable>';
                }
                $('#tblBatchInfo').html(str);

                $("#tblFutureBatchInfo").html('');
                var str3 = '';
                var response2 = jsonResult.future;
                if (jsonResult.future != undefined) {
                    if (response2.length > 0) {
                        str3 += ' <table id="tblBatchDatafuture" class="table table-striped fnsearch" cellspacing="0" style="margin-bottom: 0px;border: 1px solid #aaa;font-size: 11px;">';
                        str3 += '<thead><tr><th class="thcolor">Select</th><th class="thcolor">Region Name</th><th class="thcolor">Location</th><th class="thcolor">' + DoctorLabel + '</th><th class="thcolor">Batch Name</th><th class="thcolor">Schedule Name</th><th class="thcolor">Start Date</th><th class="thcolor">End Date</th><th class="thcolor">No. of Weeks</th><th class="thcolor">Product</th></tr></thead>';
                        for (var i = 0; i < response2.length; i++) {
                            var prefSchedule = $.grep(TPPrefillSchedule, function (ele, ind) {
                                //debugger;
                                if (ele.Batch_Id == response2[i].Batch_Id && ele.Schedule_Id == response2[i].Schedule_Id)
                                    return ele;
                            });

                            var hospital = response2[i].Hospital_Name == null ? "NA" : response2[i].Hospital_Name;
                            str3 += '<tbody> <tr><td><input ' + (prefSchedule.length > 0 ? "checked" : "") + ' type="checkbox" class="Batch" id="BcheckFut_' + i + '"/><input type="hidden" id="BhCustomerCodeFut_' + i + '" value="' + response2[i].Customer_Code + '"/><input type="hidden" id="BhCustomerRegionFut_' + i + '" value="' + response2[i].Doctor_RegionName + '"/>';
                            str3 += '<input type="hidden" id="BhCustomerMDLFut_' + i + '" value="' + response2[i].MDL_Number + '"/><input type="hidden" id="BhCustomerRegFut_' + i + '" value="' + response2[i].Customer_RegionCode + '"/><input type="hidden" id="BhbatchdetailsFut_' + i + '" value="' + response2[i].Batch_Id + "_" + response2[i].Schedule_Id + '"/></td>';
                            str3 += '<td>' + response2[i].Region_Name + '</td><td>' + hospital + '</td><td id="BhCustomerNameFut_' + i + '">' + response2[i].Customer_Name + '</td><td>' + response2[i].Batch_Name + '</td>';
                            str3 += '<td>' + response2[i].Schedule_Name + '</td><td>' + response2[i].Start_Date + '</td><td>' + response2[i].End_Date + '</td><td>' + response2[i].Num_of_Weeks + '</td><td><a href="#dvBatchProductInfo" data-toggle="modal" onclick="fnbatchProduct(' + response2[i].Schedule_Id + ')">Click Here</a></td>  </tr>'
                        }
                        str3 += '</tbody></table>'

                    }
                }
                else {
                    str3 += '<lable>No Data Found</lable>';
                }
                $('#tblFutureBatchInfo').html(str3);

                $('#tblBatchInfoPre').html('');
                var str1 = '';
                var response1 = jsonResult.previous;
                if (jsonResult.previous != undefined) {
                    if (response1.length > 0) {
                        str1 += ' <table id="tblBatchDataPre" class="table table-striped fnsearch" cellspacing="0" style="margin-bottom: 0px;border: 1px solid #aaa;font-size: 11px;">';
                        str1 += '<thead><tr><th class="thcolor">Select</th><th class="thcolor">Region Name</th><th class="thcolor">Location</th><th class="thcolor">' + DoctorLabel + '</th><th class="thcolor">Batch Name</th><th class="thcolor">Schedule Name</th><th class="thcolor">Start Date</th><th class="thcolor">End Date</th><th class="thcolor">No. of Weeks</th><th class="thcolor">Product</th></tr></thead>';
                        for (var i = 0; i < response1.length; i++) {
                            var prefSchedule = $.grep(TPPrefillSchedule, function (ele, ind) {
                                //debugger;
                                if (ele.Batch_Id == response1[i].Batch_Id && ele.Schedule_Id == response1[i].Schedule_Id)
                                    return ele;
                            });

                            var hospital = response1[i].Hospital_Name == null ? "NA" : response1[i].Hospital_Name;
                            str1 += '<tbody><tr><td><input ' + (prefSchedule.length > 0 ? "checked" : "") + ' type="checkbox" class="Batch" id="BcheckPre_' + i + '"/><input type="hidden" id="BhCustomerCodePre_' + i + '" value="' + response1[i].Customer_Code + '"/><input type="hidden" id="BhCustomerRegionPre_' + i + '" value="' + response1[i].Doctor_RegionName + '"/>';
                            str1 += '<input type="hidden" id="BhCustomerMDLPre_' + i + '" value="' + response1[i].MDL_Number + '"/><input type="hidden" id="BhCustomerRegPre_' + i + '" value="' + response1[i].Customer_RegionCode + '"/><input type="hidden" id="BhbatchdetailsPre_' + i + '" value="' + response1[i].Batch_Id + "_" + response1[i].Schedule_Id + '"/></td>';
                            str1 += '<td>' + response1[i].Region_Name + '</td><td>' + hospital + '</td><td id="BhCustomerNamePre_' + i + '">' + response1[i].Customer_Name + '</td><td>' + response1[i].Batch_Name + '</td>';
                            str1 += '<td>' + response1[i].Schedule_Name + '</td><td>' + response1[i].Start_Date + '</td><td>' + response1[i].End_Date + '</td><td>' + response1[i].Num_of_Weeks + '</td><td><a href="#dvBatchProductInfo" data-toggle="modal" onclick="fnbatchProduct(' + response1[i].Schedule_Id + ')">Click Here</a></td>  </tr>'
                        }
                        str1 += '</tbody></table>'
                    }
                }
                else {
                    str1 += '<lable>No Data Found</lable>';
                }
                $('#tblBatchInfoPre').html(str1);

            },
            error: function () {

            }
        }
        );
}
function fngetBatchOverlay() {
    debugger;
    $("#batchmodel").show();
    $("#myInput").val('');
    var value = $("#myInput").val().toLowerCase();
    var noRecord = true;
    //$("tblBatchInfo tr").filter(function () {
    $(".fnsearch tbody tr").filter(function () {
        debugger;
        length = $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        if (length && $(this).text().search(new RegExp(value, 'i')) < 0) {
            noRecord = true;
        } else {
            noRecord = false;
        }
    });
    if (noRecord)
        $('.norecords').html('No Results Found');

    fnBindSelectedDoctors();
}
function fnbatchProduct(Schedule_Id) {
    $.ajax(
        {
            type: 'post',
            data: "Schedule_Id=" + Schedule_Id,
            url: '../HiDoctor_Activity/TourPlanner/GetBatchProduct',
            success: function (response) {
                debugger;
                //$("#dvBatchProductInfo").show();
                var content = "";
                content += '<div class="container ullist"><ul class="list-group" style="width: 360px; margin-left: 85px;">';
                content += ' <li class="list-group-item active" style="background-color: #007bff!important;color: white;">Product</li>';
                for (var i = 0; i < response.length; i++) {
                    content += '<li class="list-group-item">' + response[i].Product_Name + '</li>'

                }
                content += '</ul></div>';
                $('#tblProductBatchInfo').html(content);
            },
            error: function () {

            }
        });
}
function fnFillBatchDoctor(val) {
    debugger;

    if (val == 'cancel') {
        batch_val = [];
        $('.Batch').prop("checked", false);
        $(".search").val('');
        var value = $(".search").val().toLowerCase();
        var noRecord = true;
        //$("tblBatchInfo tr").filter(function () {
        $(".fnsearch tbody tr").filter(function () {
            debugger;
            length = $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            if (length && $(this).text().search(new RegExp(value, 'i')) < 0) {
                noRecord = true;
            } else {
                noRecord = false;
            }
        });
    }
    else {
        batch_val = [];
        $("#batchmodel").hide();
        $("#txtDoctor").tokenInput("remove", {});
        // ---- current Batch.
        var rCnt = $("#tblBatchData tbody tr").length;
        //$("#txtDoctor").tokenInput('clear')

        for (var d = 0; d < rCnt; d++) {
            var customerCode = $("#BhCustomerCode_" + d).val();
            var customerName = $("#BhCustomerName_" + d).html();
            var Region = $("#BhCustomerRegion_" + d).val();
            var MDL = $("#BhCustomerMDL_" + d).val();
            var CustomerRegion = $("#BhCustomerReg_" + d).val();
            var customer = customerName + '_' + MDL + '_' + Region;
            var id = customerCode + '_' + CustomerRegion
            // $("#txtDoctor").tokenInput("remove", { id: id, name: customer });
            if ($("#Bcheck_" + d).attr('checked')) {
                batch_val.push(id + '_' + $("#Bhbatchdetails_" + d).val());
                $("#txtDoctor").tokenInput("add", { id: id, name: customer });
            }
        }
        // -----Future Batch

        var rCnt = $("#tblBatchDatafuture tbody tr").length;
        //$("#txtDoctor").tokenInput('clear')

        for (var d = 0; d < rCnt; d++) {
            var customerCode = $("#BhCustomerCodeFut_" + d).val();
            var customerName = $("#BhCustomerNameFut_" + d).html();
            var CustomerRegion = $("#BhCustomerRegFut_" + d).val();
            var Region = $("#BhCustomerRegionFut_" + d).val();
            var MDL = $("#BhCustomerMDLFut_" + d).val();
            var id = customerCode + '_' + CustomerRegion
            var customer = customerName + '_' + MDL + '_' + Region;
            if ($("#BcheckFut_" + d).attr('checked')) {
                batch_val.push(id + '_' + $("#BhbatchdetailsFut_" + d).val());
                $("#txtDoctor").tokenInput("add", { id: id, name: customer });
            }
        }

        // ---- Previous Batches
        var rCnt = $("#tblBatchDataPre tbody tr").length;

        for (var d = 0; d < rCnt; d++) {
            var customerCode = $("#BhCustomerCodePre_" + d).val();
            var customerName = $("#BhCustomerNamePre_" + d).html();
            var CustomerRegion = $("#BhCustomerRegPre_" + d).val();
            var Region = $("#BhCustomerRegionPre_" + d).val();
            var MDL = $("#BhCustomerMDLPre_" + d).val();
            var id = customerCode + '_' + CustomerRegion
            var customer = customerName + '_' + MDL + '_' + Region;
            if ($("#BcheckPre_" + d).attr('checked')) {
                batch_val.push(id + '_' + $("#BhbatchdetailsPre_" + d).val());
                $("#txtDoctor").tokenInput("add", { id: id, name: customer });
            }
        }
    }
}


function fngetCampaignDocs() {
    var campaigns = [];


    var User_Codes = "";
    var CreatedUserCode = selectedUserCode;
    var accompanists = $('#txtAccompaninst').tokenInput('get')
    var vacantRegions = "";
    for (var i = 0; i < accompanists.length; i++) {
        if (accompanists[i].value == undefined || accompanists[i].value == "VACANT") {
            vacantRegions += accompanists[i].id + ",";
        }
        else {
            User_Codes += accompanists[i].value + ",";
        }
    }
    User_Codes += CreatedUserCode;
    var TP_Date = $("#txtTpDate").val();
    TP_Date = TP_Date.split("/")[2] + "-" + TP_Date.split("/")[1] + "-" + TP_Date.split("/")[0];
    $.ajax(
        {
            type: 'post',
            data: "UserCodes=" + User_Codes + "&CreatedUserCode=" + selectedUserCode + "&TP_Date=" + TP_Date + "&VacantRegions=" + vacantRegions,
            url: '../HiDoctor_Activity/TourPlanner/GetCampaignDoctors',
            success: function (response) {
                //debugger;
                var content = "";
                if (response.length > 0) {
                    $.grep(response, function (ele) {
                        var isExists = false;
                        for (var i = 0; i < campaigns.length; i++) {
                            if (campaigns[i] == ele.Campaign_Name) {
                                isExists = true;
                            }
                        }
                        if (isExists == false)
                            campaigns.push(ele.Campaign_Name);
                    });

                    for (var c = 0; c < campaigns.length; c++) {
                        var arrDocs = "";

                        arrDocs = $.grep(response, function (ele) {
                            if (campaigns[c] == ele.Campaign_Name)
                                return ele;
                        });


                        content += '<div class="col-md-12">';
                        content += '<div class="panel panel-success">';
                        content += '<div class="panel-heading" style="padding:5px;">';
                        content += '<span class="panel-title">' + campaigns[c] + '</span>';
                        content += '<span class="pull-right clickable" style="position:relative;height:-15px;"><i class="glyphicon glyphicon-minus" style="padding:3px;"></i></span>';
                        content += '</div>';
                        content += '<div class="panel-body">';
                        if (arrDocs != "") {
                            content += "<table class='table table-striped'>"
                            content += "<thead>"
                            content += "<tr><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;text-align:center'> # </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Region Name </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> " + DoctorLabel + " Name </th></tr>"
                            content += "<thead>"
                            content += "<tbody>"

                            for (var doc = 0 ; doc < arrDocs.length; doc++) {
                                content += "<tr>"
                                content += "<td scope='row'>";
                                content += "<label class='customcheck'>";
                                content += "<input name='chkCampDoc' type='checkbox' id='chk_" + arrDocs[doc].Customer_Code + "_" + arrDocs[doc].Customer_Name + "_" + arrDocs[doc].Region_Code + "_" + arrDocs[doc].MDL_Number + "_" + arrDocs[doc].Region_Name + "' >";
                                content += "<span class='checkmark'></span>";
                                content += "</label>";
                                content += "</td>";
                                content += "<td>";
                                content += arrDocs[doc].Region_Name;
                                content += "</td>";
                                content += "<td>";
                                content += arrDocs[doc].Customer_Name;
                                content += "</td>";
                                content += "<tr>"
                            }
                            content += "</tbody>"
                            content += "</table>"
                        }
                        else {
                            content += "No " + DoctorLabel;
                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                }
                else {
                    content = "No Campaign Found!";
                }
                $("#dvCampaignContent").html(content);
                $("#dvCampaignContent .panel-heading span.clickable").bind('click', function (eve) { CollapseHeader(this, eve) });
                var Styles = $("#styleCampaignCheckbox").html();
                $("#styleCampaignCheckbox").html(Styles);
                //$('.panel-heading span.clickable').click(); // for hiding the detail div initially.
            },
            error: function (errs) {
                $("#dvCampaignContent").html("Getting Campaign's Failed.");
                console.log(err);
            }
        });
}

function CollapseHeader(ele, eve) {
    var $this = $(ele);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
}

function fnSetCampaignDoctor() {
    $("#campaignModal input[name='chkCampDoc']:checked").each(function (index, ele) {

        var arrId = $(ele)[0].id.split("_");
        var customer_code = arrId[1];
        var customer_Name = arrId[2];
        var Region_Code = arrId[3];
        var MDL_Number = arrId[4];
        var Region_Name = arrId[5];
        $("#txtDoctor").tokenInput("add", { id: customer_code + '_' + Region_Code, name: customer_Name + '_' + MDL_Number + '_' + Region_Name });
    });
}
function fnDoctorBatchOverLay() {
    debugger;
    $("#dvDoctorProduct").overlay().load();
    $("[name='spnDoctorLabel']").html(DoctorLabel);
}

function fnBindBatchDetails(rowIndex) {
    debugger;
    var batchPrivellage = fnGetPrivilegeVal("TP_BATCH_AVAILABILITY", "NO");
    var doctorCode = $("#hdnDocCode_" + rowIndex).val().split('_')[0].toString();
    var regionCode = $("#hdnDocCode_" + rowIndex).val().split('_')[1].toString();
    var docDet = $("#tdDoct_" + rowIndex).html();
    var prodDetails = $("#hdnProductDet_" + rowIndex).val();

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/TourPlanner/GetBatchForDoctors',
        data: 'DoctorCode=' + doctorCode + "&DoctorRegion=" + regionCode + "&TpDate=" + $("#hdnTPDate").val(),
        success: function (response) {
            debugger;
            var current = response.current;
            var previous = response.previous;
            var future = response.future;
            var content = "";
            content += "<h5>Prevailing</h5>";
            var uniqueData = current.reduce(function (item, e1) {
                var matches = item.filter(function (e2)
                { return e1.Batch_Name == e2.Batch_Name });
                if (matches.length == 0) {
                    item.push(e1);
                }
                return item;
            }, []);
            if (uniqueData.length == 0) {
                content += "<b>No Record Found<b>";
                content += "<hr>";
            }
            else {
                for (var z = 0; z < uniqueData.length; z++) {
                    content += ' <div >Batch Name : ' + uniqueData[z].Batch_Name + '</div>';
                    // content += '<div>No. of Weeks :' + uniqueData[z].Num_of_Weeks + '</div>';
                    // content += "<td id='tdDoctBatch_" + z + "'><b>Batch Name : </b>" + uniqueData[z].Batch_Name + "<br />"; /// <img src="../../Content/themes/base/images/hd/load.gif" />
                    var lst = $.grep(current, function (v) {
                        return v.Batch_Name == uniqueData[z].Batch_Name;
                    });
                    content += "<ul>";
                    for (var i = 0; i < lst.length; i++) {
                        var index = batch_val.indexOf($("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id);
                        if (index != -1) {
                            content += "<li><input  id='current" + i + "' type='checkbox' disabled='disabled' onclick=fnbatch('current" + i + "','" + $('#hdnDocCode_' + rowIndex).val() + '_' + uniqueData[z].Batch_ID + '_' + lst[i].Schedule_Id + "') class='batch' checked value='" + $("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id + " '/>" + lst[i].Schedule_Name + " <span> - " + lst[i].Num_of_Weeks + "  Weeks </span> </li>";
                        }
                        else {
                            content += "<li><input  id='current" + i + "' type='checkbox' disabled='disabled' onclick=fnbatch('current" + i + "','" + $('#hdnDocCode_' + rowIndex).val() + '_' + uniqueData[z].Batch_ID + '_' + lst[i].Schedule_Id + "') class='batch' value='" + $("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id + "'/>" + lst[i].Schedule_Name + "  <span> - " + lst[i].Num_of_Weeks + "  Weeks </span></li>";
                        }
                        // content += "</td>"
                    }
                    content += "</ul>";
                    content += "<hr>";
                }
            }

            /////////////////////////////////////////Future Batch Shown ////////////////////////////////////////////
            content += "<h5>Upcoming</h5>";
            var uniqueData = future.reduce(function (item, e1) {
                var matches = item.filter(function (e2)
                { return e1.Batch_Name == e2.Batch_Name });
                if (matches.length == 0) {
                    item.push(e1);
                }
                return item;
            }, []);
            if (uniqueData.length == 0) {
                content += "<b>No Record Found<b>";
                content += "<hr>";
            }
            else {
                for (var z = 0; z < uniqueData.length; z++) {
                    content += ' <div>Batch Name : ' + uniqueData[z].Batch_Name + '</div>';
                    //   content += '<div>No. of Weeks :' + uniqueData[z].Num_of_Weeks + '</div>';
                    // content += "<td id='tdDoctBatch_" + z + "'><b>Batch Name : </b>" + uniqueData[z].Batch_Name + "<br />"; /// <img src="../../Content/themes/base/images/hd/load.gif" />
                    var lst = $.grep(future, function (v) {
                        return v.Batch_Name == uniqueData[z].Batch_Name;
                    });
                    content += "<ul>";
                    for (var i = 0; i < lst.length; i++) {
                        var index = batch_val.indexOf($("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id);
                        if (index != -1) {
                            content += "<li><input id='future" + i + "' type='checkbox' disabled='disabled' onclick=fnbatch('future" + i + "','" + $('#hdnDocCode_' + rowIndex).val() + '_' + uniqueData[z].Batch_ID + '_' + lst[i].Schedule_Id + "') class='batch' checked value='" + $("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id + " '/>" + lst[i].Schedule_Name + "  <span> - " + lst[i].Num_of_Weeks + "  Weeks </span> </li>";
                        }
                        else {
                            content += "<li><input id='future" + i + "' type='checkbox' disabled='disabled' onclick=fnbatch('future" + i + "','" + $('#hdnDocCode_' + rowIndex).val() + '_' + uniqueData[z].Batch_ID + '_' + lst[i].Schedule_Id + "') class='batch' value='" + $("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id + "'/>" + lst[i].Schedule_Name + "  <span> -  " + lst[i].Num_of_Weeks + "  Weeks </span></li>";
                        }
                        // content += "</td>"
                    }
                    content += "</ul>";
                    content += "<hr>";
                }
            }

            var uniqueData = previous.reduce(function (item, e1) {
                var matches = item.filter(function (e2)
                { return e1.Batch_Name == e2.Batch_Name });
                if (matches.length == 0) {
                    item.push(e1);
                }
                return item;
            }, []);
            content += "<h5>Sculled</h5>";
            if (uniqueData.length == 0) {
                content += "<b>No Record Found</b>";
                content += "<hr>";
            }
            else {
                for (var z = 0; z < uniqueData.length; z++) {
                    content += ' <div >Batch Name : ' + uniqueData[z].Batch_Name + '</div>';
                    //    content += '<div>No. of Weeks :' + uniqueData[z].Num_of_Weeks + '</div>';
                    var lst = $.grep(previous, function (v) {
                        return v.Batch_Name == uniqueData[z].Batch_Name;
                    });
                    content += "<ul>";
                    for (var i = 0; i < lst.length; i++) {
                        var index = batch_val.indexOf($("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id);
                        if (index != -1) {
                            content += "<li><input type='checkbox' id='previous" + i + "' disabled='disabled' onclick=fnbatch('previous" + i + "','" + $('#hdnDocCode_' + rowIndex).val() + '_' + uniqueData[z].Batch_ID + '_' + lst[i].Schedule_Id + "') class='batch' checked value='" + $("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id + " '/>" + lst[i].Schedule_Name + "   <span> -  " + lst[i].Num_of_Weeks + " Weeks </span></li>";
                        }
                        else {
                            content += "<li><input type='checkbox' id='previous" + i + "' disabled='disabled' onclick=fnbatch('previous" + i + "','" + $('#hdnDocCode_' + rowIndex).val() + '_' + uniqueData[z].Batch_ID + '_' + lst[i].Schedule_Id + "') class='batch' value='" + $("#hdnDocCode_" + rowIndex).val() + "_" + uniqueData[z].Batch_ID + "_" + lst[i].Schedule_Id + "'/>" + lst[i].Schedule_Name + "  <span> - " + lst[i].Num_of_Weeks + " Weeks </span></li>";
                        }

                    }
                    content += "</ul>";
                    content += "<hr>";
                }
            }


            if (batchPrivellage == 'YES') {
                $('#batchdetail').css('display', 'block');
                $("#batchdetail").html('');
                $("#batchdetail").html(content);
                $("#imageTP").hide();
            }
            else {
                $("#batchdetails").html('');
                $('#batchdetails').css('display', 'block');
                $("#batchdetails").html(content);
                $("#imageTP").show();
            }


        },
        error: function () {

        }

    });
}
function fnbatch(val, batchdetails) {
    //debugger;
    var isExist = false;
    if ($('#' + val).prop('checked') == true) {
        for (var i = 0; i < batch_val.length; i++) {
            if (batch_val[i] == batchdetails) {
                isExist = true;
                continue;
            }
        }
        if (isExist == false)
            batch_val.push(batchdetails);
    }
    else {
        batch_val.pop(batchdetails);
    }
}

function fnGetTPMoreInfo() {
    var fullMonth = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
    var fullYear = $('#dvCalendar').fullCalendar('getDate').getFullYear();
    var accUserCodes = "";
    var arrtpDate = $("#txtTpDate").val().split("/");
    var tpDate = arrtpDate[2] + "-" + arrtpDate[1] + "-" + arrtpDate[0];
    var accompanists = $('#txtAccompaninst').tokenInput('get');
    var vacantRegions = "";
    for (var i = 0; i < accompanists.length; i++) {
        if (accompanists[i].value == undefined || accompanists[i].value == "VACANT") {
            vacantRegions += accompanists[i].id + ",";
        }
        else {
            accUserCodes += accompanists[i].value + ",";
        }
    }

    $("#dvJointAccompContent .panel-body").html("");
    $("#dvFollowUpContent .panel-body").html("");
    $("#dvBirthdayContent .panel-body").html("");
    $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/TourPlanner/GetTPDayMoreInfo',
        data: "UserCode=" + $("#hdnUserCode").val() + "&TPDate=" + tpDate + "&AccUserCodes=" + accUserCodes + "&VacantRegions=" + vacantRegions,
        success: function (result) {
            result = eval('(' + result + ')');
            var obj = new Object(ObjMoreInfo);
            obj.AccompanistInfo = result.Tables[0].Rows;
            obj.CustomerInfo = result.Tables[1].Rows;
            obj.FollowUpInfo = result.Tables[2].Rows;
            fnBindMoreInfo(obj);
            $("#dvAjaxLoad").hide();
        },
        error: function (result) {
            console.log(result);
            fnMsgAlert('Error', 'Tour Planner', 'Getting More Info Failed.');
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnBindMoreInfo(objMoreInfo) {
    //To show the accompanist name which is used the user as accompanist
    var content = "";
    var accomp = fnGetPrivilegeVal("SHOW_ACCOMPANISTS_DATA", "");
    var accompArr = accomp.split(',');

    if ($('#dvJointAccompContent .panel-body').attr("display") == "none")
        $('#dvJointAccompContent .panel-heading span.clickable').removeClass('panel-collapsed').addClass('panel-collapse');
    if ($('#dvBirthdayContent .panel-body').attr("display") == "none")
        $('#dvBirthdayContent .panel-heading span.clickable').removeClass('panel-collapsed').addClass('panel-collapse');
    if ($('#dvFollowUpContent .panel-body').attr("display") == "none")
        $('#dvFollowUpContent .panel-heading span.clickable').removeClass('panel-collapsed').addClass('panel-collapse');

    // binding Accompanist info
    if (objMoreInfo.AccompanistInfo.length > 0) {
        $("#dvJointAccompContent").show();
        content += "<table class='table table-striped'> "
        content += "<thead> "
        content += "<tr>"
        content += "<th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Accompanist Name </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Region Name </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Designation </th>"
        content += "</tr>"
        content += "</thead> "
        content += "<tbody> "
        for (var acc = 0; acc < objMoreInfo.AccompanistInfo.length; acc++) {
            content += "<tr>"
            content += "<td scope='row'>" + objMoreInfo.AccompanistInfo[acc].User_Name + "</td><td>" + objMoreInfo.AccompanistInfo[acc].Region_Name + "</td><td>" + objMoreInfo.AccompanistInfo[acc].User_Type_Name + "</td>"
            content += "</tr>"
        }
        content += "</tbody> "
        content += "</table> "
        $("#dvJointAccompContent .panel-body").html(content);
    }
    else {
        $("#dvJointAccompContent").hide();
    }

    // binding Birthday Anniversary Info
    content = "";
    var arrCustomerInfo = [];
    if ($.inArray("DOCTOR", accompArr) <= -1) {
        arrCustomerInfo = $.grep(objMoreInfo.CustomerInfo, function (ele, index) {
            if (ele.User_Code == selectedUserCode)
                return ele;
        });
    }
    else {
        arrCustomerInfo = objMoreInfo.CustomerInfo;
    }

    if (arrCustomerInfo.length > 0) {
        content += "<table class='table table-striped'>"
        content += "<thead>"
        content += "<tr>"
        content += "<th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Region Name</th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> " + DoctorLabel + " Name </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Birthday/Wedding Anniversary </th>"
        content += "</tr>"
        content += "</thead>"
        content += "<tbody>"
        for (var accDoc = 0 ; accDoc < arrCustomerInfo.length; accDoc++) {
            content += "<tr>"
            content += "<td scope='row'>" + arrCustomerInfo[accDoc].Region_Name + "</td><td>" + arrCustomerInfo[accDoc].Doctor_Name + "</td><td>" + arrCustomerInfo[accDoc].Celebration + "</td>"
            content += "</tr>"
        }
        content += "</tbody>"
        content += "</table>"
    }
    else {
        content += "No " + DoctorLabel + " has Birthday/Anniversary on this day."
    }
    $("#dvBirthdayContent .panel-body").html(content);

    // binding FollowUp Task Info
    content = "";
    if (objMoreInfo.FollowUpInfo.length > 0) {
        content += "<table class='table table-striped'>"
        content += "<thead>"
        content += "<tr>"
        content += "<th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Region Name</th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> FollowUp Task Name </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> Task Description </th><th scope='col' style='color: #615858;font-weight: bold;font-size: 12px;'> " + DoctorLabel + " Name </th>"
        content += "</tr>"
        content += "</thead>"
        content += "<tbody>"
        for (var accFollow = 0 ; accFollow < objMoreInfo.FollowUpInfo.length; accFollow++) {
            content += "<tr>"
            content += "<td scope='row'>" + objMoreInfo.FollowUpInfo[accFollow].Region_Name + "</td><td>" + objMoreInfo.FollowUpInfo[accFollow].Task_Name + "</td><td>" + objMoreInfo.FollowUpInfo[accFollow].Task_Description + "</td><td>" + objMoreInfo.FollowUpInfo[accFollow].Customer_Name + "</td>"
            content += "</tr>"
        }
        content += "</tbody>"
        content += "</table>"
    }
    else {
        content += "No Pending Follow Up Task for this day."
    }
    $("#dvFollowUpContent .panel-body").html(content);

    $('#dvJointAccompContent .panel-heading span.clickable').unbind('click');
    $('#dvBirthdayContent .panel-heading span.clickable').unbind('click');
    $('#dvFollowUpContent .panel-heading span.clickable').unbind('click');

    $('#dvJointAccompContent .panel-heading span.clickable').bind('click', function (eve) { CollapseHeader(this, eve) });
    $('#dvBirthdayContent .panel-heading span.clickable').bind('click', function (eve) { CollapseHeader(this, eve) });
    $('#dvFollowUpContent .panel-heading span.clickable').bind('click', function (eve) { CollapseHeader(this, eve) });

    var Styles = $("#styleCampaignCheckbox").html();
    $("#styleCampaignCheckbox").html(Styles);
}

function fnGetUserTreeBySearchUser(userCode, treeId, filterId) {
    //debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
    if (userCode == curUserCode_g) {
        $('#dvPreviousNode').hide();
        $(".dynatree-expander").hide();
        $(".dynatree-icon").hide();
    }
    else {
        $('#dvPreviousNode').show();
        $(".dynatree-expander").show();
        $(".dynatree-icon").show();
    }
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode_New',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                strTree = jsData;
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(strTree);

                $("#" + treeId).dynatree({
                    checkbox: false,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },

                    onClick: function (node, event) {
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },

                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                });

                $("#dvAjaxLoad").hide();
                var dynamicStyle = $("#dynamicStyle").html();
                $("#dynamicStyle").html(dynamicStyle);
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}

var fnGetUsersByUserNameEmployeeName = function (userName, treeId, filterId) {
    //debugger;
    $.ajax({
        type: "POST",
        url: 'Master/GetUsersByUserName_TP',
        data: "userName=" + userName + "&treeId=" + treeId + "&filterId=" + filterId + "",
        success: function (result) {
            //debugger;
            if (result != "") {
                $('#' + filterId).html(result);
                $('#' + treeId).hide();
                $('#' + filterId).show();

            }
            else {
                //debugger;
                fnGenerateUserTree("dvUserTree");
                $('#' + treeId).show();
                $('#' + filterId).hide();
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function AddWorkPlace() {
    $('#Flxworkplace').overlay().load();
}
function fnaddworkpalces() {
    var value = $('#flexWP').val();
    var r = fnChkSplChar("flexWP");
    if (!r) {
        fnMsgAlert('error', 'Error', 'Please remove special character ');
        return false;
    }
    else {
        $("#txtWorkPlace").tokenInput("add", { id: value, name: value });
        $('#flexWP').val('');
        $('#Flxworkplace').overlay().close();
    }

}