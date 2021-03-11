var acc_Rows = $('#tbl_DoctorAccDetails_Chemist tr');
var accAutoFill_g = new Array();
var doctorAccRowIndexCV_g = 0;
var FollowUpRowIndex_g = 0;
var AccompanistMandatory_g_CV = "";
var chemistName = fnGetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist ");
var AccomplishmentDetails = {


    fnGetAccompanistAutofill: function () {
        if (acc_g != null) {
            for (var a = 0; a < acc_g.length; a++) {
                var acc = {};
                acc.label = acc_g[a].accName;
                acc.value = acc_g[a].accCode;
                accAutoFill_g.push(acc);
            }
        }
        try {
            //Bind current userCode
            fnGetCurrentUserCode();
        }
        catch (err) {
        }
        //Bind user and Acc_name Line of business
        try {
            fnGetLineOfBusiness();
        }
        catch (err) {
        }
        try {
            //Bind user and Acc_name Line of Stockist
            fnGetAccompaistStockist();
        }
        catch (err) {
        }
        try {
            // fnPrivilegeValueforHeaderName();
        }
        catch (err) {

        }

    },
    fnBindAccName: function () {

        $('#tbl_DoctorAccDetails_Chemist').html("");
        $('#tbl_DoctorAccDetails_Chemist').append('<tr><td>Accompanist Name</td><td style="text-align:center;display:none;">Independent Call</td><td></td><td class="deleteRowIcon"></td><td>Accompanied call?</td></tr>')
        for (var i = 1; i <= acc_g.length; i++) {
            AccomplishmentDetails.fnAddAccompanist(null, "txtChemistAccName_" + i);
            var Acc_EntryMode = $('#hdnAccEntryMode_' + i).val();
            $('#hdnAccEntryModeChemist_' + i).val(Acc_EntryMode);

            $("#txtChemistAccName_" + i).val(acc_g[i - 1].accName);
            $("#hdnChemistAccName_" + i).val(acc_g[i - 1].accCode);
            var Is_Comp = acc_g[i - 1].accOnlyDoc;
            if (Is_Comp == "checked") {
                $("input[name='ChemistAccompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');


                $('#chkChemistindependentcall_' + i).attr('disabled', false);
                $('#chkChemistindependentcall_' + i).attr('checked', true);
                $('#chkChemistindependentcall_' + i).attr('disabled', 'disabled');
                $("input[name='ChemistAccompaniedcall_" + i + "'][value='NO']").attr('checked', true);
                $("input[name='ChemistAccompaniedcall_" + i + "']").attr('disabled', 'disabled');


            }
        }
    },
    fnSetAccDivCollapse: function () {
        $('#tbl_DoctorAccDetails').fadeOut('slow');
        $('#spnAccDetails').removeClass('collapse');
        $('#spnAccDetails').addClass('expand');
    },
    fnAddAccompanist: function (isDraft, curAccObj) {
        debugger

        doctorAccRowIndexCV_g++;
        var tblAccLength = $('#tbl_DoctorAccDetails_Chemist tr').length;
        var newAccRow = document.getElementById('tbl_DoctorAccDetails_Chemist').insertRow(parseInt(tblAccLength));
        newAccRow.id = "AccRowChemist_" + doctorAccRowIndexCV_g;

        // Product Name.
        var td1 = newAccRow.insertCell(0);
        $(td1).css("width", "75%;");
        var htmlvalue = "";
        if (isDraft) {
            htmlvalue = "<input style='width: 100%;border: none;background: none;font-size: 11px;' type='text' id='txtChemistAccName_" + doctorAccRowIndexCV_g + "'   onblur='AccomplishmentDetails.fnSetOnlyForDoc(this);' class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtChemistAccName_\",\"hdnChemistAccName_\");fnSetOnlyForDoc(this);' /><input type='hidden' id='hdnChemistAccName_" + doctorAccRowIndexCV_g + "'  />";
        }
        else {
            htmlvalue = "<input style='width: 100%;border: none;background: none;font-size: 11px;' type='text' id='txtChemistAccName_" + doctorAccRowIndexCV_g + "'  class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtChemistAccName_\",\"hdnChemistAccName_\");AccomplishmentDetails.fnSetOnlyForDoc(this);'";
            htmlvalue += " ondblclick='AccomplishmentDetails.fnAddAccompanist(null,this)'  onkeyup='AccomplishmentDetails.fnAddAccompanist(null,this)' disabled='disabled' />";
            htmlvalue += "<input type='hidden' id='hdnChemistAccName_" + doctorAccRowIndexCV_g + "'  />";
        }
        $(td1).html(htmlvalue);

        var td2 = newAccRow.insertCell(1);
        $(td2).css("textAlign", "center");
        htmlvalue = "<input style='display:none;' type='checkbox' id='chkChemistindependentcall_" + doctorAccRowIndexCV_g + "' disabled='disabled' />";
        $(td2).html(htmlvalue);

        var td3 = newAccRow.insertCell(2);
        htmlvalue = "<input type='hidden' id='hdnAccEntryModeChemist_Chemist_" + doctorAccRowIndexCV_g + "' />"
        $(td3).html(htmlvalue);

        // Remove icon.
        var td4 = newAccRow.insertCell(3);
        $(td4).addClass('deleteRowIcon hidden')
        $(td4).html("<img id='accRemove" + doctorAccRowIndexCV_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' onclick='fnDeleteAccRow(" + doctorAccRowIndexCV_g + ");' style='cursor:pointer' >");
        if (curAccObj != null) {
            curAccObj.onkeyup = null;
            curAccObj.ondblclick = null;
        }
        var td5 = newAccRow.insertCell(4);
        $(td5).html("<input type='radio' name='ChemistAccompaniedcall_" + doctorAccRowIndexCV_g + "' value='YES'>Yes<input type='radio' name='ChemistAccompaniedcall_" + doctorAccRowIndexCV_g + "' value='NO'>No");
        if (accAutoFill_g != null && accAutoFill_g.length > 0) {
            autoComplete(accAutoFill_g, "txtChemistAccName", "hdnChemistAccName", "autoacc");
        }
        $(".setfocus").click(function () { $(this).select(); });

    },
    fnSetAccDivExpand: function () {
        $('#tbl_DoctorAccDetails_Chemist').fadeIn('slow');
        $('#spnAccDetails').removeClass('expand');
        $('#spnAccDetails').addClass('collapse');
    },
    fnDeleteAccRow: function (index) {
        var rowLength = $('#tbl_DoctorAccDetails_Chemist tr').length - 1;
        if (index == rowLength) {
            //$.msgbox("You are not allowed to delete this row!");
            fnMsgAlert('info', docAccAlertTitle, 'You are not allowed to delete this row!');
            //alert("You didnt delete this row!");
        }
        else {
            if (confirm('Do you wish to delete the Accompanist?')) {
                $('#AccRowChemist_' + index).css('display', 'none');
            }
        }
    },
    fnGetAccompanistRegionCodes: function () {
        if (acc_g != null) {
            for (var a = 0; a < acc_g.length; a++) {
                acc_Regions_g = acc_Regions_g + acc_g[a].accCode + "^";
            }
        }
    },
    fnBindAccNameInObject: function (obj) {
        debugger
        $('#tbl_DoctorAccDetails_Chemist tr').remove();
        $('#tbl_DoctorAccDetails_Chemist').append('<tr><td>Accompanist Name</td><td style="text-align:center;display:none;">Independent Call</td><td></td><td class="deleteRowIcon"></td><td>Accompanied call?</td></tr>')
        doctorAccRowIndexCV_g = 0;
        var prefill_Acc = obj;
        obj = acc_g
        for (var i = 1; i <= obj.length; i++) {
            var accobj = jsonPath(prefill_Acc, "$[?(@.Acc_Region_Code=='" + obj[i - 1].accCode + "')]");
            //   var accobj = jsonPath(prefill_Acc, "$.[?(@.Acc_User_Name=='" + obj[i - 1].accName + "')]");

            AccomplishmentDetails.fnAddAccompanist(null, "txtChemistAccName_" + i);

            $("#txtChemistAccName_" + i).val(obj[i - 1].accName);
            $("#hdnChemistAccName_" + i).val(obj[i - 1].accCode);
            if (accobj.length > 0) {
                if (accobj[0].Is_Accompanied_call != null) {
                    if (accobj[0].Is_Accompanied_call == "YES") {

                        $('input[name=ChemistAccompaniedcall_' + i + '][value=YES]').attr('checked', true);
                    }
                    else if (accobj[0].Is_Accompanied_call == "NO") {
                        $('input[name=ChemistAccompaniedcall_' + i + '][value=NO]').attr('checked', true);
                    }
                    // document.getElementById("txtChemistAccName_" + i).onblur();
                }
            }
            var ofd = obj[i - 1].accOnlyDoc;
            if (ofd == undefined || ofd == null) {
                ofd = "";
            }
            if (ofd.toUpperCase() == "CHECKED") {
                $('#chkChemistindependentcall_' + i).attr('disabled', false);
                $('#chkChemistindependentcall_' + i).attr('checked', true);
                $('#chkChemistindependentcall_' + i).attr('disabled', 'disabled');
                $('input[name=ChemistAccompaniedcall_' + i + '][value=NO]').attr('checked', true);
                $("input[name='ChemistAccompaniedcall_" + i + "']").attr('disabled', 'disabled');

            }

        }

        AccomplishmentDetails.fnDiasbleAccName();
    },


    GetAccompanistmandatoryvalue: function () {
        if (AccompanistMandatory_g_CV == "")
            AccompanistMandatory_g_CV = fnGetPrivilegeValue("ACCOMPANISTS_VALID_IN_CHEMIST_VISITS", "NO");
        if (AccompanistMandatory_g_CV == 'NO') {
            var tblLength = $("#tbl_DoctorAccDetails_Chemist tr").length;
            for (var i = 1; i <= tblLength; i++) {
                var accompaniedCall = $('input[name=ChemistAccompaniedcall_' + i + ']:checked').val();
                if (accompaniedCall == undefined || accompaniedCall == '') {
                    $("input[name='ChemistAccompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');
                }
            }
        }
    },
    GetAccompanistmandatoryCheck: function () {
        if (AccompanistMandatory_g_CV == "") {
            AccompanistMandatory_g_CV = fnGetPrivilegeValue("ACCOMPANISTS_VALID_IN_CHEMIST_VISITS", "NO");
        }
        if (AccompanistMandatory_g_CV == 'YES') {
            var tblLength = $("#tbl_DoctorAccDetails_Chemist tr").length;
            var count = 0;
            for (var i = 1; i < tblLength; i++) {
                var accompaniedCall = $('input[name=ChemistAccompaniedcall_' + i + ']:checked').val();
                if (accompaniedCall == undefined || accompaniedCall == '') {
                    //$("input[name='ChemistAccompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');

                    fnMsgAlert('error', docAccAlertTitle, 'Please choose Accompanied call  - YES or No ');
                    return false;
                }
            }
            return true;
        }
        else
            return true;
    },
    GetAccompanistMandatoryInDoctorVisit: function () {
        var rValue = false;
        $.ajax({
            type: 'POST',
            data: "dcr_date=" + dcrActualDate_g,
            url: '../DCRV4ChemistVisit/GetAccompanistMandatoryInChemistVisit',
            async: false,
            success: function (response) {
                if (response == 'NO') {
                    rValue = true;
                }
                else {
                    var acc_name = response.split('^');
                    var name = "";
                    for (var i = 0; i < acc_name.length; i++) {
                        if (name == '')
                            name = acc_name[i];
                        else
                            name = name + ', ' + acc_name[i];
                    }
                    fnMsgAlert('error', docAccAlertTitle, 'All the accompanist who are selected in the first screen should be a part of at least one ' + ChemistVisit.defaults.Chemist_Caption + ' visit.Following Accompanist not part of any Accompanied call(YES).' + name + ' is missing');
                    rValue = false;
                }

            }
        });
        return rValue;
    },

    fnGetAccomplist: function () {
        var Chemist_Accomp = new Array();
        var ChemistAccomp = {};
        debugger
        var accArray = new Array();
        var tblAccLength = $('#tbl_DoctorAccDetails_Chemist tr').length;
        var mand_Acc = AccomplishmentDetails.GetAccompanistmandatoryCheck();
        if (mand_Acc) {
            for (var accrindex = 1; accrindex <= acc_g.length; accrindex++) {
                if ($('#AccRowChemist_' + accrindex).css('display') == 'none') {
                    continue;
                }
                if ($.trim($('#txtChemistAccName_' + accrindex).val()).length > 0) {
                    var region_code = $('#hdnChemistAccName_' + accrindex).val();
                    var accompaniedCall = $('input[name=ChemistAccompaniedcall_' + accrindex + ']:checked').val();
                    if (accompaniedCall != null && accompaniedCall != undefined && accompaniedCall != '') {
                        acc_user_Name = $('#txtChemistAccName_' + accrindex).val();
                        var only_for_doc = $('#chkChemistindependentcall_' + accrindex).attr('checked') == "checked" ? "Y" : "N";

                        if ($.trim(region_code).length == 0) {
                            fnMsgAlert('info', docAccAlertTitle, 'Invalid accompanist.');
                            return false;
                        }
                        if ($.inArray(acc_user_Name, accArray) > -1) {
                            fnMsgAlert('info', docAccAlertTitle, 'Accompanist name duplicate.');
                            return false;
                        }
                        accArray.push(acc_user_Name);
                        ChemistAccomp = {};
                        var k = accrindex;
                        var txtAccName = $("#txtChemistAccName_" + k).val().split(',')[1];
                        var acc = txtAccName.split('(')[0];
                        ChemistAccomp.Acc_User_Name = acc;
                        ChemistAccomp.Acc_Region_Code = $('#hdnChemistAccName_' + k).val();
                        ChemistAccomp.Is_Only_For_Chemisit = only_for_doc
                        //acc_g[k].accCode;
                        //ChemistAccomp.Mode_Of_Entry = $('#hdnAccEntryModeChemist_' + k).val();
                        ChemistAccomp.Is_Accompanied_call = $('input[name=ChemistAccompaniedcall_' + k + ']:checked').val();


                        Chemist_Accomp.push(ChemistAccomp);
                    }
                }
            }
            return Chemist_Accomp;
        }
        else {
            return false;
        }

    },
    fnClear: function () {
        $('#tbl_DoctorAccDetails_Chemist tr').remove();
        $('#tbl_DoctorAccDetails_Chemist').append('<tr><td>Accompanist Name</td><td style="text-align:center;display:none;">Independent Call</td><td></td><td class="deleteRowIcon"></td><td>Accompanied call?</td></tr>')
        $('#cheForm input[type="radio"]').each(function () {
            $(this).attr('checked', false);
        });
        doctorAccRowIndexCV_g = 0;
        AccomplishmentDetails.fnBindAccName();
        AccomplishmentDetails.GetAccompanistmandatoryvalue();

        //   AccomplishmentDetails.fnDiasbleAccName();
    },
    fnDiasbleAccName: function () {
        for (var i = 1; i <= accAutoFill_g.length; i++) {
            $("#txtChemistAccName_" + i).prop('disabled', true);
        }
    },

    fnSetOnlyForDoc: function (obj) {
        try {
            if (obj != null && $('#' + obj.id).val().length > 0 && $('#' + obj.id).val().indexOf(',') > -1 && $('#' + obj.id).val().indexOf('(') > -1) {
                var index = obj.id.split('_')[1];
                if (docdetails_g != null && docdetails_g.length > 4) {
                    $('#chkChemistindependentcall_' + index).attr('disabled', false);
                    var accdata = jsonPath(docdetails_g[4], "$.[?(@.Doctor_Visit_Code=='" + $('#spnDVCode_' + $('#hdnbindRowNumber').val()).html() + "' )]");
                    if (accdata != false) {
                        for (var i = 0; i < accdata.length; i++) {
                            if (accdata[i].Acc_User_Name.toUpperCase() == $('#' + obj.id).val().split(',')[1].split('(')[0].toUpperCase()) {
                                if (accdata[i].Is_Only_For_Doctor == "Y") {
                                    $('#chkChemistindependentcall_' + index).attr('checked', 'checked');
                                    $('#chkChemistindependentcall_' + index).attr('disabled', 'disabled');
                                    $("input[name='ChemistAccompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                    $("input[name='ChemistAccompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                    return;
                                }
                            }
                        }
                        if (acc_g != null && acc_g.length > 0) {
                            for (var i = 0; i < acc_g.length; i++) {
                                if (acc_g[i].accName.toUpperCase() == $('#' + obj.id).val().toUpperCase()) {
                                    if (acc_g[i].accOnlyDoc == "checked") {
                                        $('#chkChemistindependentcall_' + index).attr('checked', 'checked');
                                        $('#chkChemistindependentcall_' + index).attr('disabled', 'disabled');
                                        $("input[name='ChemistAccompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                        $("input[name='ChemistAccompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                        return;
                                    }
                                }
                            }
                        }

                    }
                    else {
                        if (acc_g != null && acc_g.length > 0) {
                            for (var i = 0; i < acc_g.length; i++) {
                                if (acc_g[i].accName.toUpperCase() == $('#' + obj.id).val().toUpperCase()) {
                                    if (acc_g[i].accOnlyDoc == "checked") {
                                        $('#chkChemistindependentcall_' + index).attr('checked', 'checked');
                                        $('#chkChemistindependentcall_' + index).attr('disabled', 'disabled');
                                        $("input[name='ChemistAccompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                        $("input[name='ChemistAccompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    $('#chkChemistindependentcall_' + index).attr('checked', false);
                    $('#chkChemistindependentcall_' + index).attr('disabled', 'disabled');
                    $("input[name='ChemistAccompaniedcall_" + index + "'][value='NO']").attr('checked', false);
                }
                else {
                    if (acc_g != null && acc_g.length > 0) {
                        for (var i = 0; i < acc_g.length; i++) {
                            if (acc_g[i].accName.toUpperCase() == $('#' + obj.id).val().toUpperCase()) {
                                if (acc_g[i].accOnlyDoc == "checked") {
                                    $('#chkChemistindependentcall_' + index).attr('checked', 'checked');
                                    $('#chkChemistindependentcall_' + index).attr('disabled', 'disabled');
                                    $("input[name='ChemistAccompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                    $("input[name='ChemistAccompaniedcall_" + index + "']").attr('disabled', 'disabled');
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
    },

    fnChemistAccMandatory: function () {
        var accMand = true;

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/DCRV4ChemistVisit/GetChemistAccMandatory',
            data: 'DCR_Date=' + dcrActualDate_g,
            async: false,
            success: function (result) {

                if (result != "No") {
                    fnMsgAlert('info', docAccAlertTitle, result);
                    accMand = false;
                }
            }
        });
        return accMand;
    }

}

function fnTableShowHide(tableid, spnid) {
    if ($('#' + tableid).css("display") == "none") {
        $('#' + tableid).fadeIn('slow');
        $('#' + spnid).removeClass('expand');
        $('#' + spnid).addClass('collapse');
    }
    else {
        $('#' + tableid).fadeOut('slow');
        $('#' + spnid).removeClass('collapse');
        $('#' + spnid).addClass('expand');
    }

}
