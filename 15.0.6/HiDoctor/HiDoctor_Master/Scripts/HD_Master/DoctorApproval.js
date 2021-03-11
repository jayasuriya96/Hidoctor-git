function fnCheckUnapproveStatus() {
    debugger;
    var treeobj = $("#dvRegionTree").dynatree("getTree");
    var regionCode = treeobj.getActiveNode().data.key;
    if ($('#cboMode').val() == '1' || $('#cboMode').val() == 'ALL') {
        var Customer_Code = "";

        $("input:checkbox[name=chkSelect]").each(function () {
            if (this.checked) {
                var id = this.id;
                Customer_Code += $("#" + id.replace("chkSelect", "hdnCustomerCode")).val() + "^";
            }
        });
        var DoctorUnapproveData = "";
        var MCData = "";
        var CRMData = "";

        $.ajax({
            url: '../HiDoctor_Master/Approval/GetDoctorUnapproveStatus/',
            type: 'POST',
            data: 'Customer_Code=' + Customer_Code + "&regionCode=" + regionCode,
            async: false,
            success: function (result) {
                if (result != undefined) {
                    debugger;
                    MCData = result[0].Data;
                    CRMData = result[1].Data;

                    var content = "";
                    var MCarr = [];
                    var CRMArr = [];

                    if (MCData.length > 0 || CRMData.length > 0)
                    {
                        //Bind Marketting Campaign data.
                        if (MCData != undefined && MCData.length > 0) {
                            for (var i = 0; i < MCData.length; i++) {
                                var MC = {};
                                MC["Doctor_Code"] = MCData[i].Doctor_Code;
                                MCarr.push(MC);
                            }
                            content += "<div> <h3 style='width: 99.5%;margin:0px auto'>Selected doctors for unapproval are used in marketing campaign."
                            content += " If they are unapproved, those doctors will get removed from marketing campaingn list.</h3><br/>";
                            content += "<table id='tblDoctorMCDetails' class='table table-striped'>";
                            content += "<thead><tr>";
                            content += "<th style='text-align:center'><input id='chkSelect_MCAll' name='chkSelectAll' type='checkbox' onClick='fnSelectMCAll()' checked='checked'/></th>";
                            content += "<th>Doctor Name</th>";
                            content += "<th>MDL Number</th>";
                            content += "<th>Category Name</th>";
                            content += "<th>Speciality Name</th>";
                            content += "<th>Marketting Campaign Name</th></tr></thead>";

                            var uniquearr = jsonPath(MCarr, "$..Doctor_Code").unique();

                            for (var i = 0; i < uniquearr.length; i++) {
                                var MCJson = jsonPath(MCData, "$.[?(@.Doctor_Code=='" + uniquearr[i] + "')]");

                                if (MCJson != undefined) {
                                    content += "<tr data-rowcount='" + i + "'><td rowspan='" + MCJson.length + "'style='text-align:center'><input id='chkMCSelect_" + i + "' name='chkMCSelect' class='chkSelect' type='checkbox' checked='checked'/></th>"

                                    var Doctor_Name = jsonPath(MCData, "$.[?(@.Doctor_Code=='" + uniquearr[i] + "')]");

                                    content += "<td rowspan='" + MCJson.length + "'>" + Doctor_Name[0].Doctor_Name + "</td><input type='hidden' id='hdnMCDocCode_" + i + "' value='" + uniquearr[i] + "'  >";
                                    content += "<td rowspan='" + MCJson.length + "'>" + MCJson[0].MDL_Number + "</td>";
                                    content += "<td rowspan='" + MCJson.length + "'>" + MCJson[0].Category_Name + "</td>";
                                    content += "<td rowspan='" + MCJson.length + "'>" + MCJson[0].Speciality_Name + "</td>";

                                    for (var j = 0; j < MCJson.length; j++) {
                                        content += "<td style='width: '105pt'>" + MCJson[j].Campaign_Name + "</td></tr><tr>";
                                    }

                                    content += "</tr>";
                                }
                            }
                            content += "</table></div>";
                        }
                        //Bind CRM Data
                        if (CRMData != undefined && CRMData.length > 0) {
                            for (var i = 0; i < CRMData.length; i++) {
                                var CRM = {};
                                CRM["Doctor_Code"] = CRMData[i].Doctor_Code;
                                CRM["Doctor_Name"] = CRMData[i].Doctor_Name;
                                CRMArr.push(CRM);
                            }
                            debugger;
                            content += "<div> <h3 style='width: 99.5%;margin:0px auto'>Selected doctors for unapproval are used in CRM Claim."
                            content += " If they are unapproved, those doctors will get removed from CRM Claim.</h3><br/>";
                            content += "<table id='tblDoctorCRMDetails' class='table table-striped'>";
                            content += "<thead><tr>";
                            content += "<th style='text-align:center'><input id='chkSelect_CRMAll' name='chkSelectAll' type='checkbox' onClick='fnSelectCRMAll()' checked='checked'/></th>";
                            content += "<th>Doctor Name</th>";
                            content += "<th>MDL Number</th>";
                            content += "<th>Category Name</th>";
                            content += "<th>Speciality Name</th>";
                            content += "<th>Claim Codes</th></tr></thead>";

                            var uniquearr = jsonPath(CRMArr, "$..Doctor_Code").unique();
                            debugger;

                            for (var i = 0; i < uniquearr.length; i++) {
                                var CRMJson = jsonPath(CRMData, "$.[?(@.Doctor_Code=='" + uniquearr[i] + "')]");

                                if (CRMJson != undefined) {
                                    content += "<tr data-rowcount='" + i + "'><td rowspan='" + CRMJson.length + "'style='text-align:center'><input id='chkCRMSelect_" + i + "' name='chkCRMSelect' class='chkSelect' type='checkbox' checked='checked'/></th>"

                                    var Doctor_Name = jsonPath(CRMData, "$.[?(@.Doctor_Code=='" + uniquearr[i] + "')]");

                                    content += "<td style='width:'105pt' rowspan='" + CRMJson.length + "'>" + Doctor_Name[0].Doctor_Name + "</td><input type='hidden' id='hdnCRMDocCode_" + i + "' value='" + uniquearr[i] + "' >";
                                    content += "<td rowspan='" + CRMJson.length + "'>" + CRMJson[0].MDL_Number + " </td>"
                                    content += "<td rowspan='" + CRMJson.length + "'>" + CRMJson[0].Category_Name + "</td>"
                                    content += "<td rowspan='" + CRMJson.length + "'>" + CRMJson[0].Speciality_Name + "</td>"

                                    for (var j = 0; j < CRMJson.length; j++) {
                                        content += "<td>" + CRMJson[j].Claim_Code + "</td></tr><tr>";
                                    }
                                    content += "<tr>";

                                }
                            }
                            content += "</tr></table></div>";
                        }
                        debugger;
                        if (content != '') {
                            $('#dvDetails').html(content);
                            $("#dvDoctorUnapprove").overlay().load();
                        }
                    }//If there is no data in MC and CRM , then directly unapprove the selected doctors.
                    else {
                        fnUnApprove("", "U");
                        return false;
                    }
                }//If there is no data in MC and CRM , then directly unapprove the selected doctors.
                else {
                    fnUnApprove("", "U");
                    return false;
                }
            },
            error: function () {
                alert("error");

            }, complete: function () {

                $('.chkSelect').click(function () {
                    debugger;

                    var id = this.id;
                    var SelectedRowCount = id.split('_')[1];

                    var selectedTableId = $(this).closest('table').attr('id');
                    var selectedHdnCustomerVal = $(this).closest('tr').find('input[type=hidden]').val();
                    if (selectedTableId != 'tblDoctorMCDetails') {

                        $('#tblDoctorMCDetails tbody tr').each(function () {
                            debugger;
                            var rowCount = $(this).attr("data-rowcount");
                            if ($('#hdnMCDocCode_' + rowCount).val() == selectedHdnCustomerVal) {
                                if ($('#chkMCSelect_' + rowCount).prop("checked")) {
                                    $('#chkMCSelect_' + rowCount).prop('checked', false);
                                } else {
                                    $('#chkMCSelect_' + rowCount).prop('checked', true);
                                }
                                return false;
                            }

                        });

                    } else {

                        $('#tblDoctorCRMDetails tbody tr').each(function () {
                            debugger;
                            var rowCount = $(this).attr("data-rowcount");
                            if ($('#hdnCRMDocCode_' + rowCount).val() == selectedHdnCustomerVal) {
                                if ($('#chkCRMSelect_' + rowCount).prop("checked")) {
                                    $('#chkCRMSelect_' + rowCount).prop('checked', false);
                                } else {
                                    $('#chkCRMSelect_' + rowCount).prop('checked', true);
                                }
                                return false;
                            }

                        });
                    }

                });
            }
        });
    }
    else {
        fnUnApprove("", "U");
    }
}


Array.prototype.unique = function () {
    debugger;
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};


function fnDoctorClose() {
    content = "";
    $('#dvDoctorUnapprove').overlay().close();
    return false;
}

function fnExcludeDoctors() {
    debugger;
    var CustomerCodes = [];

    $("input:checkbox[name=chkCRMSelect]").each(function () {
        //if ($(this).attr('checked') == false) {
        if ($(this).prop('checked') == true) {
            var id = this.id;
            if (id != '') {
                var id = this.id;
                var rowcount = id.split('_')[1];
                CustomerCodes.push($("#hdnCRMDocCode_" + rowcount).val());
            }
        }
    });
    $("input:checkbox[name=chkMCSelect]").each(function () {
        //if ($(this).attr('checked') == false) {
        if ($(this).prop('checked') == true) {
            var id = this.id;
            if (id != '') {
                var id = this.id;
                var rowcount = id.split('_')[1];
                CustomerCodes.push($("#hdnMCDocCode_" + rowcount).val());
            }
        }
    });

    CustomerCodes = CustomerCodes.unique();

    if (CustomerCodes.length == 0 || CustomerCodes == undefined) {
        fnMsgAlert('info', 'Doctor UnApproval ', 'Select any one doctor to execlude.');
        return false;
    }
    else {
        if (confirm('Do you wish to exclude the selected doctors?')) {
            fnUnApprove(CustomerCodes, "E");
        }
    }
}

function fnUnapproveAll() {
    debugger;
    $("input:checkbox[name=chkCRMSelect]").attr('checked', 'checked');
    $("input:checkbox[name=chkMCSelect]").attr('checked', 'checked');
    

    if (confirm('Do you wish to unapprove the selected doctors?')) {
        fnUnApprove("", "U");
    }
}

function fnSelectMCAll() {
    if ($('#chkSelect_MCAll').is(":checked")) {
        $("input:checkbox[name=chkMCSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkMCSelect]").removeAttr('checked');
    }
}

function fnSelectCRMAll() {
    if ($('#chkSelect_CRMAll').is(":checked")) {
        $("input:checkbox[name=chkCRMSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkCRMSelect]").removeAttr('checked');
    }
}

function fnUnApprove(customerCodes, typeOfUnapprove) {
    debugger;
    var CustomerCode = [];
    CustomerCode = customerCodes;
    var type = typeOfUnapprove;
    var treeobj = $("#dvRegionTree").dynatree("getTree");
    var regionCode = treeobj.getActiveNode().data.key;
    var tblContent = "";
    var unapproveDoct = [];
    var count = 0;
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            count = parseInt(count) + 1;
            var id = this.id;
            var customer_Code = $("#" + id.replace("chkSelect", "hdnCustomerCode")).val();

            if (type == "E") {
                for (var i = 0; i < CustomerCode.length; i++) {
                    var js = jsonPath(CustomerCode, "$.[?(@=='" + customer_Code + "')]");
                    if (js == false) {
                        if (tblContent.indexOf(customer_Code + "^") == -1) {
                            tblContent += customer_Code + "^";
                            tblContent += regionCode + "^";
                            tblContent += entity + "^";
                            tblContent += "" + $("#" + id.replace("chkSelect", "hdnMDLNumber")).html() + "" + "^";
                            tblContent += "0^";
                            tblContent += $("#" + id.replace("chkSelect", "hdnCustomerName")).html() + "^";
                            tblContent += $("#" + id.replace("chkSelect", "hdnCategorycode")).val() + "^~";
                        }
                    }
                }
            }
            else if (type = "U") {
                debugger;
                tblContent += $("#" + id.replace("chkSelect", "hdnCustomerCode")).val() + "^";
                tblContent += regionCode + "^";
                tblContent += entity + "^";
                tblContent += "" + $("#" + id.replace("chkSelect", "hdnMDLNumber")).html() + "" + "^";
                tblContent += "0^";
                tblContent += $("#" + id.replace("chkSelect", "hdnCustomerName")).html() + "^";
                tblContent += $("#" + id.replace("chkSelect", "hdnCategorycode")).val() + "^~";
            }
        }
    });
    //alert(tblContent);
    if (count == 0) {
        if ($("#tblCustomer tbody tr").length > 1) {
            fnMsgAlert('info', 'Info', 'Please select atleast any one ' + entity);
            return;
        }
        else {
            fnMsgAlert('info', 'Info', '' + entity + ' details not found for the selected region');
            return;
        }
    }

    var result = "";
    if (fnIsCheckApproveOrUnapprove("UNAPPROVED")) {
        debugger;
        $.ajax({
            url: '../HiDoctor_Master/Approval/CustomerBulkApproval/',
            type: "POST",
            data: "tblContent=" + tblContent + "&action=UNAPPROVE&entity=" + entity + "",
            success: function (result) {
                if (result.split(":")[0] == "SUCCESS") {
                    fnMsgAlert('success', 'Success', entity + ' UnApproval done');
                    $('#dvDoctorUnapprove').overlay().close();
                    fnGetCustomerData();
                }
                else {
                    fnMsgAlert('info', 'Error', 'Error while Unapprove the ' + entity);
                }
            },
            error: function () {
            }
        });
    }
    else {
        fnMsgAlert('info', 'Info', 'Please do not select UnApproved Items');
        return;
    }

}
