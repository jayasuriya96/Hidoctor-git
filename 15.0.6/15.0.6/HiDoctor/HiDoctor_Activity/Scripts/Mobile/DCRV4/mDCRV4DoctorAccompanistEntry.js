var acclist_g;
function fnGetDoctorAccompanist() {
    var dvCode = "";
    if (codes_g.length > 0) {
        dvCode = codes_g.split('^')[0];
    }
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/GetDCRDoctorAccompanistForADoctor',
        data: "DCR_Actual_Date=" + dcrDate_g + '&DCR_Visit_Code=' + dvCode,
        async: false,
        success: function (response) {
            // we have the response
            acclist_g = response;
            fnSetAcclist(acclist_g);
            $.mobile.loading('show');
        },
        error: function (e) {
            fnMsgAlert('error', screenTitle, e.responseText);
            $.mobile.loading('hide');
        }
    });
}

function fnSetAccompanistAutoFill() {
    debugger;
    var accOpt = "";

    if (acc_g != null) {
        for (var ai = 0; ai < acc_g.length; ai++) {
            if (acc_g[ai].accName.length > 0) {
                accOpt += '<option value="' + acc_g[ai].accCode + '" >' + acc_g[ai].accName + '</option>';
            }
        }
        if (accOpt.length > 0) {
            accOpt = '<option value="0" >Select Accompanist</option>' + accOpt;
            $('#selectdocAcc_1').append(accOpt);
            $('#selectdocAcc_2').append(accOpt);
            $('#selectdocAcc_3').append(accOpt);
            $('#selectdocAcc_4').append(accOpt);

        }
        else {
            var emptyaccOpt = '<option value="-1" >No Accompanist</option>'
            $('#selectdocAcc_1').append(emptyaccOpt);
            $('#selectdocAcc_2').append(emptyaccOpt);
            $('#selectdocAcc_3').append(emptyaccOpt);
            $('#selectdocAcc_4').append(emptyaccOpt);
        }
        $('#selectdocAcc_1').selectmenu();
        $('#selectdocAcc_1').selectmenu('refresh');
        $('#selectdocAcc_2').selectmenu();
        $('#selectdocAcc_2').selectmenu('refresh');
        $('#selectdocAcc_3').selectmenu();
        $('#selectdocAcc_3').selectmenu('refresh');
        $('#selectdocAcc_4').selectmenu();
        $('#selectdocAcc_4').selectmenu('refresh');
    }
}

function fnSetAcclist(acclist) {
    debugger;
    if (acclist != null) {
        for (var ai = 0; ai < acclist.length; ai++) {
            var accIndex = 0;
            accIndex = ai;
            accIndex = accIndex + 1;
            var acc1 = jsonPath(acc_g, "$[?(@.accCode=='" + acclist[ai].Acc_Region_Code + "')]");
            for (var ac = 0; ac < acc_g.length; ac++) {
                if (acc_g[ac].accCode == acclist[ai].Acc_Region_Code && acc_g[ac].accName.split(',')[1].split('(')[0] == acclist[ai].Acc_User_Name) {
                    var mde = acclist[ai].Mode_Of_Entry
                    var Is_Accompanied_call = acclist[ai].Is_Accompanied_call;
                    $('#hdnAccEntry_' + accIndex).val(acclist[ai].DCR_Doctor_Acc_Code)
                    //$('#selectdocAcc_' + accIndex.toString()+" option").text(acc_g[ac].accName);
                    $('#selectdocAcc_' + accIndex.toString()).val(acc_g[ac].accCode);
                    $('#hdnAccEntryMode_' + accIndex.toString()).val(acclist[ai].Mode_Of_Entry);
                    $('#selectdocAcc_' + accIndex.toString()).selectmenu('refresh');
                    debugger;
                    var ofd = acclist[ai].Is_Only_For_Doctor;
                    if (acclist[ai].Is_Only_For_Doctor == 'Y') {
                        ofd = '1';
                    } else if (acclist[ai].Is_Only_For_Doctor == 'N') {
                        ofd = '0';
                    }
                    if (Is_Accompanied_call == "YES") {
                        $("input[name='Accompaniedcall_" + accIndex + "'][value='YES']").attr('checked', 'checked');
                    }
                    else if (Is_Accompanied_call == "NO") {
                        $("input[name='Accompaniedcall_" + accIndex + "'][value='NO']").attr('checked', 'checked');
                    }

                    if (ofd.toUpperCase() == "1") {
                        $('#toggonlyfordoc_' + accIndex).attr('disabled', false);
                        $('#toggonlyfordoc_' + accIndex).val('1');
                        $('#toggonlyfordoc_' + accIndex).attr('disabled', 'disabled');
                        $('#toggonlyfordoc_' + accIndex).slider();
                        $('#toggonlyfordoc_' + accIndex).slider('refresh');

                    }
                    if (ofd.toUpperCase() == "0") {
                        $('#toggonlyfordoc_' + accIndex).attr('disabled', false);
                        $('#toggonlyfordoc_' + accIndex).val('0');
                        //$('#toggonlyfordoc_' + accIndex).attr('disabled', 'disabled');
                        $('#toggonlyfordoc_' + accIndex).slider();
                        $('#toggonlyfordoc_' + accIndex).slider('refresh');

                    }
                    if (mde.toUpperCase() == "A") {
                        $('#selectdocAcc_' + accIndex).attr('disabled', 'disabled');
                        $('#selectdocAcc_' + accIndex).selectmenu();
                        $('#selectdocAcc_' + accIndex).selectmenu('refresh');
                        $('#toggonlyfordoc_' + accIndex).attr('disabled', 'disabled');
                        $('#toggonlyfordoc_' + accIndex).slider();
                        $('#toggonlyfordoc_' + accIndex).slider('refresh');
                    }
                    else {
                        $('#selectdocAcc_' + ai).attr('disabled', false);
                        $('#selectdocAcc_' + accIndex).selectmenu();
                        $('#selectdocAcc_' + accIndex).selectmenu('refresh');

                    }
                    if (ofd.toUpperCase() == "1") {
                        $("input[name='Accompaniedcall_" + accIndex + "'][value='NO']").attr('checked', 'checked');
                        $("input[name='Accompaniedcall_" + accIndex + "']").attr('disabled', 'disabled');
                    }
                }
            }
        }
        debugger;
        var docAccJson_miss = new Array();
        for (var i = 0; i < acc_g.length; i++) {
            var tru_status = 0;
            var tblAccLength = 4;
            for (var j = 1; j < tblAccLength; j++) {
                var txtAccName = $("#selectdocAcc_" + j + " option:selected").text();
                if (acc_g[i].accName == txtAccName)
                    tru_status++;
            }
            if (tru_status == 0)
                docAccJson_miss.push(acc_g[i]);
        }
        var count = 0;
        for (var j = 1; j <= 4; j++) {
            var txtAccName = $("#selectdocAcc_" + j + " option:selected").text();
            if (txtAccName.trim() == "Select Accompanist" || txtAccName == undefined || txtAccName == "") {
                //$("#selectdocAcc_" + j).val(docAccJson_miss[count].accName);
                $("#selectdocAcc_" + j + " option").filter(function () {
                    return this.textContent == docAccJson_miss[count].accName;
                }).attr('selected', true);
                if (docAccJson_miss[count].accOnlyDoc == 'checked') {
                    $("input[name='Accompaniedcall_" + j + "'][value='NO']").attr('checked', 'checked');
                    $("input[name='Accompaniedcall_" + j + "']").attr('disabled', 'disabled');
                    $('#toggonlyfordoc_' + j).val('1');
                }
                count++;
                $('#selectdocAcc_' + j).selectmenu();
                $('#selectdocAcc_' + j).selectmenu('refresh');
                //fnSetAccValues(j);
            }

        }
    }
    fnBindAccName();
    GetAccompanistmandatoryvalue();
}

function fnGoToBack() {
    var manCheck = GetAccompanistmandatoryCheck();
    if (manCheck) {
        var result = fnSave();

        var docname = $('#docnamevalue').html();
        var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

        if (result) {

            $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname, {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
    }
}

function fnGoToHome(source) {
    if (source.toUpperCase() == "ACTION") {
        var result = fnSave();
        if (result) {
            $.mobile.changePage("../DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
                type: "post",
                reverse: false,
                changeHash: false
            });
        }
    }
    else {
        $.mobile.changePage("../DCRV4MobileHome/Index/?dcrDate=" + dcrDate_g + "&dcrStatus=3&isrcpa=Y&source=CALENDAR&flag=F&travelKm=0", {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }

}

function fnSave() {
    var acc_string = "";
    var acc_user_Name = "";
    var acc_user_Code = "";
    var acc_region_Code = "";
    var only_for_doc = "";
    var mode_of_entry = "";
    var acc_user_type = "";
    var dcr_doc_Acc_code = "";
    var accArray = new Array();
    var docAccArray = new Array();

    for (var accrindex = 0; accrindex < 5; accrindex++) {
        var docAcc = {};
        if (accrindex == 0) {
            continue;
        }
        debugger;
        if ($('#selectdocAcc_' + accrindex + ' :selected').text().length > 0 && $('#selectdocAcc_' + accrindex + ' :selected').val() != "0" && $('#selectdocAcc_' + accrindex + ' :selected').val() != "-1") {
            var accompaniedCall = $('input[name=Accompaniedcall_' + accrindex + ']:checked').val();
            if (accompaniedCall != null && accompaniedCall != undefined && accompaniedCall != '') {
                dcr_doc_Acc_code = $('#hdnAccEntry_' + accrindex).val().length == 0 ? null : $('hdnAccEntry_' + accrindex).val();
                acc_user_name = $('#selectdocAcc_' + accrindex + ' :selected').text();
                var only_for_doc = $('#toggonlyfordoc_' + accrindex).val();
                var regionCode = $('#selectdocAcc_' + accrindex + ' :selected').val();

                if (regionCode.length == 0) {
                    fnMsgAlert('info', screenTitle, 'Invalid accompanist');
                    return false;
                }
                if ($.inArray(acc_user_name, accArray) > -1) {
                    fnMsgAlert('info', screenTitle, 'Accompanist name duplicate.');
                    return false;
                }
                accArray.push(acc_user_name);
                docAcc.DCR_Doctor_Acc_Code = dcr_doc_Acc_code == null ? '-1' : dcr_doc_Acc_code.length == 0 ? '-1' : dcr_doc_Acc_code;
                //docAcc.Doctor_Visit_Code = dcr_visit_code;
                docAcc.Acc_User_Name = acc_user_name.split('(')[0].split(',')[1];
                docAcc.Acc_User_Code = null;
                docAcc.Acc_Region_Code = regionCode;
                var Is_Only_For_Doctor = 'Y';
                if ($.trim(only_for_doc) == '1') {
                    Is_Only_For_Doctor = 'Y';
                }
                else if ($.trim(only_for_doc) == '0') {
                    Is_Only_For_Doctor = 'N';
                }
                docAcc.Is_Only_For_Doctor = Is_Only_For_Doctor;
                //docAcc.Is_Only_For_Doctor = $.trim(only_for_doc) == "" ? "0" : only_for_doc;
                docAcc.Mode_Of_Entry = $('#hdnAccEntryMode_' + accrindex).val();
                docAcc.Acc_User_Type_Name = acc_user_name.split('(')[1].replace(')', '');
                docAcc.Is_Accompanied_call = accompaniedCall;
                docAccArray.push(docAcc);
            }
        }

    }
    fnSaveAcc(docAccArray);
    return true;
    // END : Accompanist.
}

function fnSaveAcc(docAccArray) {
    codeArr = codes_g.split('^');
    var dvCode = codeArr[0];
    $.ajax({
        type: 'POST',
        url: '/HiDoctor_Activity/DCRV4DoctorVisit/InsertDoctorAccompanist',
        data: 'DCR_Actual_Date=' + dcrDate_g + '&DCR_Visit_Code=' + dvCode + "&docAccJSON=" + JSON.stringify(docAccArray),
        async: false,
        success: function (response) {
            // we have the response
            $.mobile.loading('show');
        },
        error: function (e) {
            fnMsgAlert('error', "Doctor Accompanist", e.responseText);
            $.mobile.loading('hide');
        }
    });
}

function fnSetAccValues(index) {
    try {
        var accCode = $('#selectdocAcc_' + index + ' :selected').val();
        var accText = $('#selectdocAcc_' + index + ' :selected').text();
        if (accCode != null && accText != null && accText.length > 0) {

            if (doclist_g != null && doclist_g.length > 4) {

                $('#toggonlyfordoc_' + index).attr('disabled', false);
                var accdata = jsonPath(acclist, "$.[?(@.Doctor_Visit_Code=='" + $('#hdnDVCode').val() + "' )]");
                if (accdata != false) {
                    for (var i = 0; i < accdata.length; i++) {
                        if (accdata[i].Acc_User_Name.toUpperCase() == accText.split(',')[1].split('(')[0].toUpperCase()) {
                            if (accdata[i].Is_Only_For_Doctor == "Y") {
                                $('#toggonlyfordoc_' + index).attr('disabled', false);
                                $('#toggonlyfordoc_' + index).val('1')
                                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                $('#toggonlyfordoc_' + index).slider('refresh');

                                return;
                            }
                            else {
                                $('#toggonlyfordoc_' + index).attr('disabled', false);
                                $('#toggonlyfordoc_' + index).val('0')
                                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                $('#toggonlyfordoc_' + index).slider('refresh');
                                return;
                            }
                        }
                    }
                }
                else {
                    if (acc_g != null && acc_g.length > 0) {
                        for (var i = 0; i < acc_g.length; i++) {
                            if (acc_g[i].accName.toUpperCase() == accText.toUpperCase()) {
                                if (acc_g[i].accOnlyDoc == "checked") {
                                    $('#toggonlyfordoc_' + index).attr('disabled', false);
                                    $('#toggonlyfordoc_' + index).val('1');
                                    $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                    $('#toggonlyfordoc_' + index).slider('refresh');
                                    return;
                                }
                                else {
                                    $('#toggonlyfordoc_' + index).attr('disabled', false);
                                    $('#toggonlyfordoc_' + index).val('0');
                                    $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                    $('#toggonlyfordoc_' + index).slider('refresh');
                                    return;
                                }
                            }
                        }
                    }
                }
                $('#toggonlyfordoc_' + index).val('0');
                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                $('#toggonlyfordoc_' + index).slider('refresh');
            }
            else {
                if (acc_g != null && acc_g.length > 0) {
                    for (var i = 0; i < acc_g.length; i++) {
                        if (acc_g[i].accName.toUpperCase() == accText.toUpperCase()) {
                            if (acc_g[i].accOnlyDoc == "checked") {
                                $('#toggonlyfordoc_' + index).attr('disabled', false);
                                $('#toggonlyfordoc_' + index).val('1');
                                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                $('#toggonlyfordoc_' + index).slider('refresh');
                                return;
                            }
                            else {
                                $('#toggonlyfordoc_' + index).attr('disabled', false);
                                $('#toggonlyfordoc_' + index).val('0');
                                $('#toggonlyfordoc_' + index).attr('disabled', 'disabled');
                                $('#toggonlyfordoc_' + index).slider('refresh');
                                return;
                            }
                        }
                    }
                }
            }

        }
    }
    catch (e) {
        alert("fnSetOnlyForDoc()" + e.message);
    }
}

function fnCancel() {
    if (confirm("Do you wish to cancel the page?")) {
        var docname = $('#docnamevalue').html();
        var rcpa = isRCPA_g.toUpperCase() == "N" ? "N" : "R";

        $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=" + dcrStatus_g + "&flagRCPA=" + rcpa + "&accUsers=" + accRegions_g + "&cp=&tp=&dcrActualDate=" + dcrDate_g + "&category=&travelledkms=" + travelKMS_g + "&source=&flag=&codes=&doctorName=" + docname, {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }

}
function fnBindAccName() {
    debugger;
    for (var j = 1; j <= 4; j++) {
        var txtAccName = $("#selectdocAcc_" + j + " option:selected").text();
        if (txtAccName.trim() != "Select Accompanist" && txtAccName != undefined && txtAccName != "" && txtAccName.trim() != "No Accompanist") {
            $("#lbldocAcc_" + j).text(txtAccName);

        }
        else
            $("#docAcc_" + j).hide();
    }

}
//ACCOMPANISTS_VALID_IN_DOC_VISITS
var AccompanistMandatory_g = "";
function GetAccompanistmandatoryvalue() {
    debugger;
    if (AccompanistMandatory_g == "")
        AccompanistMandatory_g = fnGetPrivilegeValue("ACCOMPANISTS_VALID_IN_DOC_VISITS", "NO");
    if (AccompanistMandatory_g == 'NO') {
        var tblLength = doclist_g.length;
        for (var i = 1; i <= tblLength; i++) {
            var accompaniedCall = $('input[name=Accompaniedcall_' + i + ']:checked').val();
            if (accompaniedCall == undefined || accompaniedCall == '') {
                $("input[name='Accompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');
            }
        }
    }
}
function GetAccompanistmandatoryCheck() {
    debugger;
    if (AccompanistMandatory_g == 'YES') {
        var tblLength = doclist_g.length;
        var count = 0;
        for (var i = 1; i <= tblLength; i++) {
            var accompaniedCall = $('input[name=Accompaniedcall_' + i + ']:checked').val();
            if (accompaniedCall == undefined || accompaniedCall == '') {
                //$("input[name='Accompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');
                fnMsgAlert('error', 'Doctor Visit', 'Please  select at least one option (i.e. eitherYES or NO) in Accompanist Details');
                return false;
            }
        }
        return true;
    }
    else
        return true;
}
