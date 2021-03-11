var jsonDivison_g = "";

function fnGetDivisions() {
    $.ajax({
        url: '../HiDoctor_Master/Division/GetDivisions/',
        type: "POST",
        data: "A",
        async: false,
        success: function (jsData) {
            if (jsData != '') {
                $("#dvDivision").html(jsData.split('$')[0]);
                jsonDivison_g = eval(jsData.split('$')[1]);
                fnBindEntity();
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function fnValidateDivisionName() {
    var flag = true;
    if ($("#hdnMode").val() == "EDIT") {
        if (jsonDivison_g != '') {
            var disJson = jsonPath(jsonDivison_g, "$.[?(@.Division_Name=='" + $("#txtDivisionName").val().toUpperCase() + "')]");
            if (disJson != false) {
                if ($("#hdnDivisionCode").val() != disJson[0].Division_Code) {
                    //$("#txtDivisionName").addClass("errorIndicator");
                    //$("#txtDivisionName").attr("title", "DivisionName already exists");
                    fnMsgAlert('info', 'Validate', 'DivisionName already exists');
                    flag = false;
                }
            }
        }
    }
    else {
        var disJson = jsonPath(jsonDivison_g, "$.[?(@.Division_Name=='" + $("#txtDivisionName").val().toUpperCase() + "')]");
        if (disJson != false) {
            $("#txtDivisionName").addClass("errorIndicator");
            $("#txtDivisionName").attr("title", "DivisionName already exists");
            fnMsgAlert('info', 'Validate', 'DivisionName already exists');
            flag = false;
        }
        else {
            $("#txtDivisionName").removeClass("errorIndicator");
            $("#txtDivisionName").removeAttr("title");
        }
    }
    if (!fnCheckSpecialCharacter($("#txtDivisionName"))) {
        $("#txtDivisionName").addClass("errorIndicator");
        $("#txtDivisionName").attr("title", "Please remove the special characters");
        fnMsgAlert('info', 'Validate', 'Please remove the special characters');
        flag = false;
    }

    return flag;
}

function fnSubmit() {
    var result = fnValidateDivisionName();
    var divisionline = $('input:radio[name=Pharmaotc]:checked').val();
    if (result) {
        if ($.trim($("#txtDivisionName").val()) == '') {
            fnMsgAlert('info', 'Validate', 'Please enter the division name');
            return;
        }
        else {
            $('#dvRightPanel').block({
                message: '<h3>Loading...Please wait...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../HiDoctor_Master/Division/InsertDivision/',
                type: "POST",
                data: "divisionCode=" + $("#hdnDivisionCode").val() + "&divisionName=" + $.trim($("#txtDivisionName").val()) + "&mode=" + $("#hdnMode").val() + "&divisionline=" + divisionline + "",
                success: function (result) {
                    if (result != '') {
                        if (!isNaN(result)) {
                            if (parseInt(result) > 0) {
                                fnMsgAlert('success', 'Success', 'Division saved successfully');
                                var divisionCode = $.trim($("#hdnDivisionCode").val());
                                var mode = $("#hdnMode").val();
                                var divisionName = $.trim($("#txtDivisionName").val());
                                fnClearAll();
                                fnGetDivisions();
                                $('#dvRightPanel').tabs('option', 'selected', 1);

                                if (mode.toUpperCase() == "EDIT") {
                                    var division = {
                                        divisionCode: divisionCode,
                                        divisionName: divisionName,
                                        mode: "EDIT",
                                        CompanyCode: CompanyCode_g,
                                        UserName: UserName_g,
                                    };
                                    KangleIntegration.requestInvoke("UserMigration", "ManageDivisionHiDoctor", division, "POST");
                                }
                                else {
                                    var div = $.grep(jsonDivison_g, function (e, i) {
                                        if (e.Division_Name.toUpperCase() == divisionName.toUpperCase())
                                            return e;
                                    });
                                    if (div.length > 0) {
                                        var division = {
                                            divisionCode: div[0].Division_Code,
                                            divisionName: divisionName.toUpperCase(),
                                            mode: "INSERT",
                                            CompanyCode: CompanyCode_g,
                                            UserName: UserName_g,
                                        };
                                        KangleIntegration.requestInvoke("UserMigration", "ManageDivisionHiDoctor", division, "POST");
                                    }
                                }
                            }
                            else {
                                fnMsgAlert('error', 'Error', 'Error occured while saving the division');
                            }
                        }
                    }
                },
                error: function () {
                },
                complete: function () {
                    $('#dvRightPanel').unblock();
                }
            });
        }
    }
}
function fnDeleteDivision(divisionCode, status) {
    if (confirm("Are you sure you want to change the status ?")) {
        var divisionStatus = "";
        if (status == "1") {
            divisionStatus = "0";
        }
        else {
            divisionStatus = "1";
        }
        $('#dvRightPanel').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/Division/DeleteDivision/',
            type: "POST",
            data: "divisionCode=" + divisionCode + "&status=" + divisionStatus + "",
            success: function (result) {
                if (result != '') {
                    if (!isNaN(result)) {
                        if (parseInt(result) > 0) {
                            fnMsgAlert('success', 'Success', 'Division status changed successfully');
                            fnGetDivisions();
                            $('#dvRightPanel').tabs('option', 'selected', 1);
                            var division = {
                                divisionCode: divisionCode,
                                divisionName: "",
                                mode: (divisionStatus == "1" ? "ACTIVE" : "DEACTIVE"),
                                CompanyCode: CompanyCode_g,
                                UserName: UserName_g,
                            };
                            KangleIntegration.requestInvoke("UserMigration", "ManageDivisionHiDoctor", division, "POST");
                        }
                        else {
                            fnMsgAlert('error', 'Error', 'Error occured while changing the status');
                        }
                    }
                }
            },
            error: function () {
            },
            complete: function () {
                $('#dvRightPanel').unblock();
            }
        });
    }
}

function fnBindEntity() {
    if (jsonDivison_g != '') {
        var divisions = "";
        var entityEdit = "";
        var tblContent = "<table class='table table-striped'><thead><tr><th>Entity</th>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            if (jsonDivison_g[i].Record_Status == "1") {
                divisions += "<th>" + jsonDivison_g[i].Division_Name + "</th>";
            }
        }
        tblContent += divisions + "</tr></thead><tbody>";
        tblContent += "<tr><td id='td_USER'>USER</td>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            if (jsonDivison_g[i].Record_Status == "1") {
                tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
                    + "\",\"USER\");'>Edit</a></td>";
            }
        }
        tblContent += "</tr>";
        tblContent += "<tr><td id='td_REGION'>REGION</td>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            if (jsonDivison_g[i].Record_Status == "1") {
                tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
                    + "\",\"REGION\");'>Edit</a></td>";
            }
        }
        tblContent += "</tr>";
        tblContent += "<tr><td id='td_PRODUCT'>PRODUCT</td>";
        for (var i = 0; i < jsonDivison_g.length; i++) {
            if (jsonDivison_g[i].Record_Status == "1") {
                tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
                    + "\",\"PRODUCT\");'>Edit</a></td>";
            }
        }
        tblContent += "</tr>";
        //tblContent += "<tr><td id='td_DOCTOR'>DOCTOR</td>";
        //for (var i = 0; i < jsonDivison_g.length; i++) {
        //    if (jsonDivison_g[i].Record_Status == "1") {
        //        tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
        //            + "\",\"DOCTOR\");'>Edit</a></td>";
        //    }
        //}
        //tblContent += "</tr>";
        //tblContent += "<tr><td id='td_SPECIALITY'>PRODUCT SPECIALITY</td>";
        //for (var i = 0; i < jsonDivison_g.length; i++) {
        //    if (jsonDivison_g[i].Record_Status == "1") {
        //        tblContent += "<td id='td_" + i + "'><a onclick='fnEditEntity(\"" + jsonDivison_g[i].Division_Code + "\",\"" + jsonDivison_g[i].Division_Name
        //            + "\",\"SPECIALITY\");'>Edit</a></td>";
        //    }
        //}
        //tblContent += "</tr>";
        tblContent += "</tbody></table>";
    }
    $("#dvEntity").html(tblContent);
}

function fnEditDivision(divisionCode) {
    if ($("#dvInsertDivision .errorIndicator").length > 0) {
        $("#dvInsertDivision .errorIndicator").removeClass('errorIndicator');
    }
    if (divisionCode != '') {
        if (jsonDivison_g != '') {
            var disJson = jsonPath(jsonDivison_g, "$.[?(@.Division_Code=='" + divisionCode + "')]");
            if (disJson != false) {
                $("#txtDivisionName").val(disJson[0].Division_Name);
                $("#hdnDivisionCode").val(divisionCode);
                var value = disJson[0].divisionline;
                $('input[type=radio][value="' + value + '"]').first().attr('checked', 'checked');
                $("input[type=radio]").attr('disabled', true);
                $("#hdnMode").val("EDIT");
                $('#dvRightPanel').tabs('option', 'selected', 0);
            }
        }
    }
}

function fnClearAll() {
    $("#dvInsertDivision .errorIndicator").removeAttr('title');
    $("#dvInsertDivision .errorIndicator").removeClass('errorIndicator');
    $("#txtDivisionName").val('');
    $("#hdnDivisionCode").val('');
    $("#hdnMode").val("INSERT");
    $('input[type=radio][value="1"]').first().attr('checked', 'checked');
    $("input[type=radio]").attr('disabled', false);
}
var entityDetails_g = "";
function fnEditEntity(divisionCode, divisionName, entity) {
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
                else if (entity == "PRODUCT") {
                    fnGetProducts();
                    $("#dvEntityMapping").overlay().load();
                }
                else if (entity == "DOCTOR") {
                    $("#dvDocSelectedDivName").html(divisionName);
                    $("#dvDocSelectedEntityName").html(entity);
                    fnBindRegionTree("dvDocEntityDetails");
                    $("#dvDoctorEntityMapping").overlay().load();
                }
                else {
                    fnGetSpeciality();
                    $("#dvEntityMapping").overlay().load();
                }
                //if (entity == "DOCTOR") {
                //    $("#dvDoctorEntityMapping").unblock();
                //}
                //else {
                //    $('#dvEntityMapping').unblock();
                //}
            }

        },
        error: function () {
        },
        complete: function () {

            //$('#main').unblock();

        }
    });


}
function fnGetDoctors() {
    var tblContent = "";
    $("#dvDoctor").html('');
    var regionTree = $("#dvDocEntityDetails").dynatree("getTree");
    if (regionTree.getActiveNode() != null) {
        var regionCode = regionTree.getActiveNode().data.key;
        $.ajax({
            url: '../HiDoctor_Master/Division/GetApprovedDoctorsByRegion/',
            type: "POST",
            data: "regionCode=" + regionCode + "",
            success: function (jsData) {
                if (jsData != '') {
                    jsData = eval('(' + jsData + ')');
                    tblContent += "<table class='table table-striped'><thead><tr><td>Select <input type='checkbox' name='chkSelectAll'onclick='fnSelectAll();' /></td>";
                    tblContent += "<td>Doctor Name</td><td>Speciality Name</td>";
                    tblContent += "<td>Category Name</td><td>Qualification</td></tr></thead><tbody>";
                    for (var i = 0; i < jsData.length; i++) {
                        var disJson = jsonPath(entityDetails_g, "$.[?(@.Entity_Code=='" + jsData[i].Customer_Code + "')]");
                        if (disJson != false && disJson != undefined) {
                            tblContent += "<tr><td><input type='checkbox' checked='checked' name='chkSelect'  value='" + jsData[i].Customer_Code + "'/></td>";
                        }
                        else {
                            tblContent += "<tr><td><input type='checkbox' name='chkSelect'  value='" + jsData[i].Customer_Code + "'/></td>";
                        }
                        tblContent += "<td>" + jsData[i].Customer_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Speciality_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Category_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Qualification + "</td></tr>";
                    }
                    tblContent += "</tbody></table>";
                    $("#dvDoctor").html(tblContent);

                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }
}
function fnGetSpeciality() {
    var tblContent = "";
    $("#dvEntityDetails").html('');
    $.ajax({
        url: '../HiDoctor_Master/Division/GetSpeciality/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                if (jsData != '') {
                    tblContent += "<table class='table table-striped'><thead><tr><td>Select<input type='checkbox' name='chkSelectAll'onclick='fnSelectAll();' /></td>";
                    tblContent += "<td>Speciality Name</td></tr></thead><tbody>";
                    for (var i = 0; i < jsData.length; i++) {
                        var disJson = jsonPath(entityDetails_g, "$.[?(@.Entity_Code=='" + jsData[i].Speciality_Code + "')]");
                        if (disJson != false && disJson != undefined) {
                            tblContent += "<tr><td><input type='checkbox' checked='checked' name='chkSelect'  value='" + jsData[i].Speciality_Code + "'/></td>";
                        }
                        else {
                            tblContent += "<tr><td><input type='checkbox' name='chkSelect'  value='" + jsData[i].Speciality_Code + "'/></td>";
                        }
                        tblContent += "<td>" + jsData[i].Speciality_Name + "</td></tr>";
                    }
                    tblContent += "</tbody></table>";
                    $("#dvEntityDetails").html(tblContent);
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });

}
function fnGetProducts() {
    var tblContent = "";
    $("#dvEntityDetails").html('');
    $.ajax({
        url: '../HiDoctor_Master/Division/GetAllActiveProducts/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                if (jsData != '') {
                    tblContent += "<table class='table table-striped'><thead><tr><td>Select<input type='checkbox' name='chkSelectAll'onclick='fnSelectAll();' /></td>";
                    tblContent += "<td>Product Name</td>";
                    tblContent += "<td>Product Type Name</td><td>Brand Name</td>";
                    tblContent += "<td>Speciality Name</td><td>Category Name</td><td>UOM Name</td><td>UOM Type Name</td><td>Ref Key</td>";
                    tblContent += "</tr></thead><tbody>";
                    for (var i = 0; i < jsData.length; i++) {
                        var disJson = jsonPath(entityDetails_g, "$.[?(@.Entity_Code=='" + jsData[i].Product_Code + "')]");
                        if (disJson != false && disJson != undefined) {
                            tblContent += "<tr><td><input type='checkbox' checked='checked' name='chkSelect'  value='" + jsData[i].Product_Code + "'/></td>";
                        }
                        else {
                            tblContent += "<tr><td><input type='checkbox' name='chkSelect'  value='" + jsData[i].Product_Code + "'/></td>";
                        }
                        tblContent += "<td>" + jsData[i].Product_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Product_Type_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Brand_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Speciality_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Category_Name + "</td>";
                        tblContent += "<td>" + jsData[i].UOM_Type_Name + "</td>";
                        tblContent += "<td>" + jsData[i].UOM_Name + "</td>";
                        tblContent += "<td>" + jsData[i].Ref_Key1 + "</td></tr>";
                    }
                    tblContent += "</tbody></table>";
                    $("#dvEntityDetails").html(tblContent);
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function fnSubmitMapping() {
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

    //InsertDivisionEntityMapping
    if (entity == "DOCTOR") {
        $('#dvDoctorEntityMapping').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
    }
    else {
        $('#dvEntityMapping').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
    }
    $.ajax({
        url: '../HiDoctor_Master/Division/InsertDivisionEntityMapping/',
        type: "POST",
        data: "divisionCode=" + $("#hdnDivisionCode").val() + "&entityCode=" + entityCode + "&entityName=" + $("#hdnEntity").val() + "",
        success: function (result) {
            $('#dvDoctorEntityMapping').unblock();
            if (result != '') {
                if (!isNaN(result)) {
                    if (parseInt(result) > 0) {
                        fnMsgAlert('success', 'Success', $("#hdnEntity").val() + ' successfully mapped to division');
                        if (entity == "USER" || entity == "REGION") {
                            var DivisionEntity = {
                                divisionCode: $("#hdnDivisionCode").val(),
                                //entityCode: entityCode.replace(/^/g, ","),
                                entityCode: entityCode.substring(0, entityCode.length - 1),
                                entityName: $("#hdnEntity").val(),
                                CompanyCode: CompanyCode_g,
                                UserName: UserName_g,
                                Region_Code: Region_Code_G_K,
                                User_Code : User_Code_G_K
                            };
                            var objDivisionEntity = [];
                            objDivisionEntity.push(DivisionEntity);
                            var obj = {
                                LstDivisionEntity: objDivisionEntity
                            }
                            //objDivisionEntity = JSON.stringify({ 'objDivisionEntity': objDivisionEntity });

                            KangleIntegration.requestInvoke("UserMigration", "ManageDivisionEntityMappingHiDoctor", obj, "POST");
                        }
                        fnClearMapping();
                        if (entity == "DOCTOR") {
                            $("#dvDoctorEntityMapping").unblock();
                            $('#dvDocEntityDetails').show();
                            $("#dvDocTree").html('Hide Tree');
                            fnHideDoctorTree();
                            $("#dvDoctorEntityMapping").overlay().close();
                        }
                        else {
                            $('#dvEntityMapping').unblock();
                            $("#dvEntityMapping").overlay().close();
                        }
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'Erro occured while mapping the division');
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
            if (entity == "DOCTOR") {
                $("#dvDoctorEntityMapping").unblock();
            }
            else {
                $('#dvEntityMapping').unblock();
            }
        }
    });

}

function fnClearMapping() {
    $("#dvSelectedDivName").html('');
    $("#dvSelectedEntityName").html('');
    $("#dvDocSelectedDivName").html('');
    $("#dvDocSelectedEntityName").html('');
    $("#dvDocEntityDetails").html('');
    $("#dvEntityDetails").html('');
    $("#dvDocEntityDetails").html('');
    $("#dvDoctor").html('');
}



function fnSelectAll() {
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false;
        });
    }
}


function fnCheckSpecialCharacter(id) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9' '.]+$");
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true
}
