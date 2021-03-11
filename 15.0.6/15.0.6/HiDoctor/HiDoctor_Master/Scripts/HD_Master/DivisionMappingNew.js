function fnGetDivisionsByRegions() {
    debugger;
    var jsonDivision_g = '';
    $.ajax({
        url: '../HiDoctor_Master/UsersDivisionMapping/GetDivisionsBasedonLoggedUserdivision/',
        type: "POST",
        data: "A",
        success: function (jsData) {

            fnBindEntity(jsData);

        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function fnBindEntity(jsonDivison_g) {
    debugger;
    if (jsonDivison_g != '') {
        var divisions = "";
        var entityEdit = "";
        var tblContent = "<table class='table table-striped'><thead><tr><th>Entity</th>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            //  if (jsonDivison_g[i].Record_Status == "1") {
            divisions += "<th>" + jsonDivison_g[i].Division_Name + "</th>";
            //}
        }
        tblContent += divisions + "</tr></thead><tbody>";
        tblContent += "<tr><td id='td_USER'>USER</td>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            // if (jsonDivison_g[i].Record_Status == "1") {
            tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
                + "\",\"USER\");'>Edit</a></td>";
            // }
        }
        tblContent += "</tr>";
        tblContent += "<tr><td id='td_REGION'>REGION</td>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            // if (jsonDivison_g[i].Record_Status == "1") {
            tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
                + "\",\"REGION\");'>Edit</a></td>";
            // }
        }
        tblContent += "</tr>";
        tblContent += "</tbody></table>";
    }
    $("#dvEntity").html(tblContent);
}
function fnEditEntity(divisionCode, divisionName, entity) {
    debugger;
    $("#hdnEntity").val(entity);
    $("#hdnDivisionCode").val(divisionCode);
    $("#dvSelectedDivName").html(divisionName);
    $("#dvSelectedEntityName").html(entity);
    $("#dvDoctor").html('');
    $("#dvEntityDetails").html('');

    $.blockUI();

    $.ajax({
        url: '../HiDoctor_Master/Division/GetGetDivisionEntityDetails/',
        type: "POST",
        data: "divisionCode=" + divisionCode + "&entityType=" + entity + "",
        success: function (jsData) {
            entityDetails_g = '';
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                if (jsData != '') {
                    entityDetails_g = jsData;
                }
                if (entity == "USER") {
                    fnBindFullUserTreeWithCheckBox("dvEntityDetails");
                    $("#dvEntityMapping").overlay().load();
                }
                else if (entity == "REGION") {
                    fnBindRegionTreeWithCheckBox("dvEntityDetails")
                    $("#dvEntityMapping").overlay().load();
                }
            }

        },
        error: function () {
        },
        complete: function () {

            //$('#main').unblock();

        }
    });


}
function fnSubmitMapping() {
    debugger;
    var entity = $("#hdnEntity").val();
    var entityCode = "";
    if (entity == "USER") {
        if (selectedUserCodes.length > 0) {
            for (var a = 0; a < selectedUserCodes.length; a++) {
                entityCode += selectedUserCodes[a] + '^';
            }
        }
        else {
            fnMsgAlert('info', 'Info', 'Please select atleast any one user');
            return;
        }
    }
    else if (entity == "REGION") {
        if (selectedRegionCodes.length > 0) {
            for (var a = 0; a < selectedRegionCodes.length; a++) {
                entityCode += selectedRegionCodes[a] + '^';
            }
        }
        else {
            fnMsgAlert('info', 'Info', 'Please select atleast any one region');
            return;
        }
    }
    else if (entity != "USER" && entity != "REGION") {
        var i = 0;
        $("input:checkbox[name=chkSelect]").each(function () {
            var tdName = this.value;
            if (this.checked) {
                i = parseInt(i) + 1;
                entityCode += this.value + "^";
            }
        });
        if (i == 0) {
            fnMsgAlert('info', 'Info', 'Please select atleast any one' + entity);
            return;
        }
    }
    $.ajax({
        url: '../HiDoctor_Master/Division/InsertDivisionEntityMapping/',
        type: "POST",
        data: "divisionCode=" + $("#hdnDivisionCode").val() + "&entityCode=" + entityCode + "&entityName=" + $("#hdnEntity").val() + "",
        success: function (result) {
            $.unblockUI();
            if (result != '') {
                if (!isNaN(result)) {
                    if (parseInt(result) > 0) {
                        fnMsgAlert('success', 'Success', $("#hdnEntity").val() + ' successfully mapped to division');
                        fnClearMapping();
                        if (entity == "DOCTOR") {
                            $("#dvDoctorEntityMapping").unblock();
                            $('#dvDocEntityDetails').show();
                            $("#dvDocTree").html('Hide Tree');
                            //fnHideDoctorTree();
                            $("#dvDoctorEntityMapping").overlay().close();
                        }
                        else {
                            $('#dvEntityMapping').unblock();
                            $("#dvEntityMapping").overlay().close();
                        }
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'Error occured while mapping the division');
                        if (entity == "DOCTOR") {
                            $("#dvDoctorEntityMapping").unblock();
                            $("#dvDoctorEntityMapping").overlay().close();
                        }
                        else {
                            $('#dvEntityMapping').unblock();
                            $("#dvEntityMapping").overlay().close();
                        }
                    }
                }
            }

        },
        error: function () {
            $.unblockUI();
            $('#dvEntityMapping').unblock();
        }
    });
}
function fnClearMapping() {
    $("#dvSelectedDivName").html('');
    $("#dvSelectedEntityName").html('');
    $("#dvEntityDetails").html('');
    // $("#dvDocEntityDetails").html('');
    // $("#dvDoctor").html('');
    // $("#dvDocSelectedDivName").html('');
    //$("#dvDocSelectedEntityName").html('');
    //$("#dvDocEntityDetails").html('');
}