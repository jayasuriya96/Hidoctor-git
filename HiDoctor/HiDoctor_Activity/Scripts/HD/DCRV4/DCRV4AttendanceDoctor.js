var AttendanceDoctor = {
    defaults: {
        "Row_Index": "0",
        "Region_list_g": [],
        "Doctor_list_g": [],
        "Doctor_list_all_g": [],
        "Doctor_Speciality_g": [],
        "productAutoFill_g": [],
        "qty": [],
        "productDetail": []
    },
    initialize: function () {
        $("#divAttendanceDetails").show();
        AttendanceDoctor.fnGetSpecialityList();
        AttendanceDoctor.GetUnderRegionDetails();
        AttendanceDoctor.fnGetSaleProductsAndSetAutoFill();
        //AttendanceDoctor.GetRegionDoctorList();
        AttendanceDoctor.fnBindDoctorProductDetails();


    },
    GetUnderRegionDetails: function () {
        debugger;
        $.ajax({
            type: 'get',
            url: 'HiDoctor_Master/PatientTracking/GetAllRegionUsers',
            data: 'excludeParentLevel=a&includeOneLevelParent=1',
            async: false,
            success: function (result) {
                AttendanceDoctor.defaults.Region_list_g = result;
            }
        });
    },
    GetRegionDoctorList: function (id) {
        debugger;
        var regionCode = $("#ddlRegionId_" + id).val();
        if (regionCode != '0') {
            $.ajax({
                type: 'get',
                url: 'HiDoctor_Master/PatientTracking/GetAllDoctorsByRegion',
                data: 'regionCode=' + regionCode,
                async: false,
                success: function (result) {
                    ////var doc = new Array();
                    ////for (var i = 0; i < result.length; i++) {
                    ////    var single_doc = {
                    ////        label:result[i].docr
                    ////    };
                    ////}
                    AttendanceDoctor.defaults.Doctor_list_g = result;
                    AttendanceDoctor.defaults.Doctor_list_all_g = AttendanceDoctor.defaults.Doctor_list_all_g.concat(result);
                    autoComplete(AttendanceDoctor.defaults.Doctor_list_g, "txtDocName", "hdnDoctorCode", "autoDoctor_" + id);
                    $("#txtDocName_" + id).val('');
                    $("#hdnDoctorCode_" + id).val('');
                }
            });
        }
        else {
            AttendanceDoctor.defaults.Doctor_list_g = [];
            autoComplete(AttendanceDoctor.defaults.Doctor_list_g, "txtDocName", "hdnDoctorCode", "autoDoctor" + id);
            $("#txtDocName_" + id).val('');
            $("#ddlSpeciality_" + id).val('0');
            $("#hdnDoctorCode_" + id).val('');
        }
    },
    SaveRowDetails: function (id, mode) {
        debugger;

        //Validation

        if ($("#ddlRegionId_" + id).val() == '0') {
            fnMsgAlert('error', 'error', 'Select Region Name');
            return false;
        }
        if ($("#txtDocName_" + id).val() == '') {
            fnMsgAlert('error', 'error', 'Enter Doctor Name for region' + $("#ddlRegionId_" + id + " option:selected").text());
            return false;
        } else if ($("#hdnDoctorCode_" + id).val() == '' && $("#txtDocName_" + id).val() != '') {
            var doc = fnGetPrivilegeValue("RIGID_ATTENDANCE_DOCTOR_ENTRY", "YES");
            if (doc == 'YES') {
                fnMsgAlert('error', 'error', 'Enter Valid Doctor Name (' + $("#txtDocName_" + id).val() + ")");
                return false;
            }
            else {
                if ($("#ddlSpeciality_" + id).val() == '0') {
                    fnMsgAlert('error', 'error', 'Select Speciality Name  for Doctor(' + $("#txtDocName_" + id).val() + ")");
                    return false;
                }
            }
        }
        if ($("#txtProd_" + id).val() == '') {
            fnMsgAlert('error', 'error', 'Enter Input Name for Doctor (' + $("#txtDocName_" + id).val() + ')');
            return false;
        } else if ($("#hdnProductCode_" + id).val() == '' && $("#txtProd_" + id).val() != '') {
            fnMsgAlert('error', 'error', 'Enter Valid Input Name for (' + $("#txtDocName_" + id).val() + ")");
            return false;
        }


        var user_entered_qty = $("#txtProdQty_" + id).val();
        if (user_entered_qty == '') {
            user_entered_qty = 0;
            $("#txtProdQty_" + id).val('0');
        }
        var product_code = $("#hdnProductCode_" + id).val();
        var rValue = false;
        if (mode == 1)
            rValue = AttendanceDoctor.fnProductQtyUpdate(user_entered_qty, 1, product_code);
        else if (mode == 2)
            rValue = true; // Prefill

        if (rValue) {
            $("#deletelink_" + id).show();
            $("#btnAddNew_" + id).show();
            $("#editlink_" + id).show();
            $("#btnSave_" + id).hide();
            $("#updatelink_" + id).hide();
            $("#Cancellink_" + id).hide();
            $("#ddlRegionId_" + id).prop("disabled", true);
            $("#txtDocName_" + id).prop("disabled", true);
            $("#txtProd_" + id).prop("disabled", true);
            $("#txtProdQty_" + id).prop("disabled", true);
            $("#txtRemark_" + id).prop("disabled", true);
            $("#ddlSpeciality_" + id).prop("disabled", true);
            $("#hdnMode_" + id).val('1');
        }

    },
    UpdateRowDetails: function (id) {
        debugger;
        //Roll back
        if ($("#ddlRegionId_" + id).val() == '0') {
            fnMsgAlert('error', 'error', 'Select the Region');
            return false;
        }
        if ($("#txtDocName_" + id).val() == '') {
            fnMsgAlert('error', 'error', 'Enter Doctor Name for region' + $("#ddlRegionId_" + id + " option:selected").text());
            return false;
        } else if ($("#hdnDoctorCode_" + id).val() == '' && $("#txtDocName_" + id).val() != '') {
            var doc = fnGetPrivilegeValue("RIGID_ATTENDANCE_DOCTOR_ENTRY", "YES");
            if (doc == 'YES') {
                fnMsgAlert('error', 'error', 'Enter Valid Doctor Name (' + $("#txtDocName_" + id).val() + ")");
                return false;
            }
            else {
                if ($("#ddlSpeciality_" + id).val() == '0') {
                    fnMsgAlert('error', 'error', 'Select Speciality Name  for Doctor(' + $("#txtDocName_" + id).val() + ")");
                    return false;
                }
            }
        }
        var user_entered_qty = $("#txtProdQty_" + id).val();
        if (user_entered_qty == '')
            user_entered_qty = 0
        var product_code = $("#hdnProductCode_" + id).val();
        AttendanceDoctor.fnProductQtyUpdate(AttendanceDoctor.defaults.qty, 2, product_code);
        var rvalue = AttendanceDoctor.fnProductQtyUpdate(user_entered_qty, 1, product_code);
        if (rvalue) {
            for (var i = 1; i <= ($("#tblSamples tr").length - 1) ; i++) {
                //if (id != i) {
                $("#editlink_" + i).show();
                $("#deletelink_" + i).show();
                //}
            }
            // $("#btnAddNew_" + id).show();
            // $("#editlink_" + id).show();
            // $("#btnSave_" + id).hide();
            $("#updatelink_" + id).hide();
            $("#Cancellink_" + id).hide();
            $("#ddlRegionId_" + id).prop("disabled", true);
            $("#ddlSpeciality_" + id).prop("disabled", true);
            $("#txtDocName_" + id).prop("disabled", true);
            $("#txtProd_" + id).prop("disabled", true);
            $("#txtProdQty_" + id).prop("disabled", true);
            $("#txtRemark_" + id).prop("disabled", true);
            var lastid = $("#tblSamples tr").length - 1;
            var btnstatus = $("#ddlRegionId_" + lastid).prop('disabled');
            if (btnstatus) {
                $("#btnAddNew_" + lastid).show();
                $("#editlink_" + lastid).show();
                $("#deletelink_" + lastid).show();
            } else {
                $("#btnSave_" + lastid).show();
                $("#editlink_" + lastid).hide();
                $("#deletelink_" + lastid).hide();
            }
            AttendanceDoctor.defaults.qty = 0;
            $("#hdnMode_" + id).val('1');
        }

    },
    RowEdit: function (id) {
        debugger;
        for (var i = 1; i <= ($("#tblSamples tr").length - 1) ; i++) {
            if (id != i) {
                $("#editlink_" + i).hide();
            }
            $("#deletelink_" + i).hide();
        }
        $("#editlink_" + id).hide();
        $("#updatelink_" + id).show();
        $("#Cancellink_" + id).show();

        $("#ddlRegionId_" + id).prop("disabled", false);
        $("#txtDocName_" + id).prop("disabled", false);
        var docPrivilege = fnGetPrivilegeValue("RIGID_ATTENDANCE_DOCTOR_ENTRY", "YES");
        //if (docPrivilege == 'YES')
        if ($("#hdnDoctorCode_" + id).val() == '')
            $("#ddlSpeciality_" + id).prop("disabled", false);
        // $("#txtProd_" + id).prop("disabled", false);
        $("#txtProdQty_" + id).prop("disabled", false);
        $("#txtRemark_" + id).prop("disabled", false);
        var lastid = $("#tblSamples tr").length - 1;
        $("#btnAddNew_" + lastid).hide();
        $("#btnSave_" + lastid).hide();
        if ($("#txtProdQty_" + id).val().trim() == '')
            AttendanceDoctor.defaults.qty = 0;
        else
            AttendanceDoctor.defaults.qty = $("#txtProdQty_" + id).val();
        AttendanceDoctor.defaults.productDetail = {
            Region_code: $("#ddlRegionId_" + id).val(),
            Doctor_Code: $("#hdnDoctorCode_" + id).val(),
            Doctor_Name: $("#txtDocName_" + id).val(),
            Product_Code: $("#hdnProductCode_" + id).val(),
            Quantity_Provided: $("#txtProdQty_" + id).val(),
            Remark: $("#txtRemark_" + id).val(),
            Speciality: $("#ddlSpeciality_" + id).val()
        };
        $("#ddlRegionId_" + id).focus();
        $("#hdnMode_" + id).val('2');
    },
    RowCancel: function (id) {
        for (var i = 1; i <= ($("#tblSamples tr").length - 1) ; i++) {
            //if (id != i) {
            $("#editlink_" + i).show();
            $("#deletelink_" + i).show();
            //}
        }
        // $("#btnAddNew_" + id).show();
        // $("#editlink_" + id).show();
        // $("#btnSave_" + id).hide();
        $("#updatelink_" + id).hide();
        $("#Cancellink_" + id).hide();
        $("#ddlRegionId_" + id).val(AttendanceDoctor.defaults.productDetail.Region_code);
        $("#hdnDoctorCode_" + id).val(AttendanceDoctor.defaults.productDetail.Doctor_Code);
        $("#txtDocName_" + id).val(AttendanceDoctor.defaults.productDetail.Doctor_Name);
        $("#txtProdQty_" + id).val(AttendanceDoctor.defaults.productDetail.Quantity_Provided);
        $("#txtRemark_" + id).val(AttendanceDoctor.defaults.productDetail.Remark);
        $("#ddlSpeciality_" + id).val(AttendanceDoctor.defaults.productDetail.Speciality);

        $("#ddlRegionId_" + id).prop("disabled", true);
        $("#txtDocName_" + id).prop("disabled", true);
        $("#ddlSpeciality_" + id).prop("disabled", true);
        $("#txtProd_" + id).prop("disabled", true);
        $("#txtProdQty_" + id).prop("disabled", true);
        $("#txtRemark_" + id).prop("disabled", true);
        var lastid = $("#tblSamples tr").length - 1;
        var btnstatus = $("#ddlRegionId_" + lastid).prop('disabled');
        if (btnstatus) {
            $("#btnAddNew_" + lastid).show();
            $("#editlink_" + lastid).show();
            $("#deletelink_" + lastid).show();
        } else {
            $("#btnSave_" + lastid).show();
            $("#editlink_" + lastid).hide();
            $("#deletelink_" + lastid).hide();
        }
        $("#ddlRegionId_" + id).focus();
        $("#hdnMode_" + id).val('2');
    },
    RowDelete: function (id) {
        debugger;
        var count = 0;
        for (var i = 1; i <= ($("#tblSamples tr").length - 1) ; i++) {
            if ($("#rowId_" + i).css('display') != 'none') {
                count++;
            }
        }
        if (count > 1 && ($("#tblSamples tr").length - 1) != id)
            $("#rowId_" + id).hide();
        var user_entered_qty = $("#txtProdQty_" + id).val();
        if (user_entered_qty == '')
            user_entered_qty = 0;
        var product_code = $("#hdnProductCode_" + id).val();
        var rValue = AttendanceDoctor.fnProductQtyUpdate(parseInt(user_entered_qty), 2, product_code);
        AttendanceDoctor.defaults.qty = 0;
    },
    RowCreation: function (id) {
        debugger;
        if (id != 1) {
            $("#btnAddNew_" + (id - 1)).hide();
        }
        var row = "<tr id='rowId_" + id + "'>";
        row += "<td><select id='ddlRegionId_" + id + "' onChange='AttendanceDoctor.GetRegionDoctorList(" + id + ");'><option value=0>-Select-</option>";
        for (var i = 0; i < AttendanceDoctor.defaults.Region_list_g.length; i++) {
            row += "<option value=" + AttendanceDoctor.defaults.Region_list_g[i].Region_Code + ">" + AttendanceDoctor.defaults.Region_list_g[i].Region_Name + "</option>";
        }
        row += "</select></td>";
        row += "<td style='width:35%;'><input style='width:40%;' type='text' id='txtDocName_" + id + "' class='autoDoctor_" + id + " setfocus' onblur='AttendanceDoctor.fnvalidateDoctorName(this);'/>";
        // row += "<div><input type='hidden' id='hdnDoctorCode_" + id + " ></div>";
        row += "<select style='margin-left: 11px;width: 40%;' id='ddlSpeciality_" + id + "' ><option value=0>-Select-</option>";
        for (var sp = 0; sp < AttendanceDoctor.defaults.Doctor_Speciality_g.length; sp++) {
            row += "<option value=" + AttendanceDoctor.defaults.Doctor_Speciality_g[sp].value + ">" + AttendanceDoctor.defaults.Doctor_Speciality_g[sp].label + "</option>";
        }
        row += "</select>";
        row += "<input type='hidden' id='hdnDoctorCode_" + id + "' >";
        row += "</td>";
        row += "</td>";
        row += "<td style='width:30%;'><input type='text' style='width:90%;' class='autoProd setfocus' id='txtProd_" + id + "' onblur='AttendanceDoctor.fnvalidateProductname(this);'/></td>";
        row += "<input type='hidden' id='hdnProductCode_" + id + "' >";
        row += "<td><input type='text' id='txtProdQty_" + id + "' onkeypress='return AttendanceDoctor.isNumberKey(event,this);' />";
        row += "</td>";
        // row += "<td><input type='textarea' id='txtRemark_" + id + "'/></td>";
        row += "<td style='width: 27%;'><textarea id='txtRemark_" + id + "'/></td>";

        row += "<td><a href='#' style='display:none;' id='editlink_" + id + "' onClick='AttendanceDoctor.RowEdit(" + id + ");'  class='actionLink' >Edit</a>";
        row += "<a href='#' style='display:none;' id='updatelink_" + id + "' onClick='AttendanceDoctor.UpdateRowDetails(" + id + ");' class='actionLink'>Update</a>";
        row += "<a href='#' style='display:none;' id='Cancellink_" + id + "' onClick='AttendanceDoctor.RowCancel(" + id + ");' class='actionLink'>Cancel</a>";

        row += "<a href='#' style='display:none;' id='deletelink_" + id + "' onClick='AttendanceDoctor.RowDelete(" + id + ");' class='actionLink'>Delete</a>";
        row += "</td>";
        row += "<td><input type='button' id='btnSave_" + id + "' onClick='AttendanceDoctor.SaveRowDetails(" + id + ",1);' value='Save'class='actionLink' />";
        row += "<input type='button' style='display:none;' id='btnAddNew_" + id + "' onClick='AttendanceDoctor.RowCreation(" + (id + 1) + ");' value='Add New' class='actionLink' />";
        row += "<input type='hidden' id='hdnMode_" + id + "' value='0'/></td>";
        $("#tblSamplesbody").append(row);
        autoComplete(AttendanceDoctor.defaults.productAutoFill_g, "txtProd", "hdnProductCode", "autoProd");
        if (AttendanceDoctor.defaults.Region_list_g.length == 1) {
            $("#ddlRegionId_" + id).val(AttendanceDoctor.defaults.Region_list_g[0].Region_Code);
            AttendanceDoctor.GetRegionDoctorList(id);
        }
    },
    fnGetSaleProductsAndSetAutoFill: function () {
        var productBringType = fnGetPrivilegeValue('DCR_PRODUCTS_BRING_TYPE', '') + "^";
        productBringType_g = productBringType.replace(/,/g, '^');
        $.ajax({
            type: 'POST',
            data: "prdBringType=" + escape(productBringType_g) + "&searchWord=&DCR_Date=" + dcrDate,
            url: '../DCRV4DoctorVisit/GetUserProductsList',
            async: false,
            success: function (response) {
                // we have the response
                if (response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++)
                        response[i].label = response[i].label.split('(')[0];
                    AttendanceDoctor.defaults.productAutoFill_g = response;
                    autoComplete(AttendanceDoctor.defaults.productAutoFill_g, "txtProd", "hdnProductCode", "autoProd");
                }
            }
        });
    },
    fnvalidateDoctorName: function (cur) {
        debugger;
        fnValidateAutofill(cur, AttendanceDoctor.defaults.Doctor_list_all_g, "txtDocName_", "hdnDoctorCode_");
        var id = cur.id.split('_')[1];
        var Doctor_Code = $("#hdnDoctorCode_" + id).val();
        //doctor.Doctor_Name = $("#txtDocName_" + i).val();
        var doc = $.grep(AttendanceDoctor.defaults.Doctor_list_all_g, function (element, index) {
            return element.value == Doctor_Code;
        });

        if (doc != null && doc.length > 0) {
            $("#ddlSpeciality_" + id).val(doc[0].Speciality_Code);
            $("#ddlSpeciality_" + id).prop("disabled", true);
        } else {
            $("#ddlSpeciality_" + id).val('0');
            $("#ddlSpeciality_" + id).prop("disabled", false);
        }
    },
    fnvalidateProductname: function (cur) {
        debugger;
        var id = parseInt(cur.id.split('_')[1]);
        var qty = $("#txtProdQty_" + id).val();
        //  fnValidateAutofill(cur, AttendanceDoctor.defaults.productAutoFill_g, "txtProd_", "hdnProductCode_");
        //  for (var i = 0; i < AttendanceDoctor.defaults.productAutoFill_g.length; i++) {
        //      if (AttendanceDoctor.defaults.productAutoFill_g[i].value == $("#hdnProductCode_" + 1).val()) {
        //          var proCode = AttendanceDoctor.defaults.productAutoFill_g[i].label.split('(')[1];
        //         var qty = parseInt(proCode.split(')')[0]);
        //
        //     }
        //  }
        fnValidateAutofill(cur, AttendanceDoctor.defaults.productAutoFill_g, "txtProd_", "hdnProductCode_");

    },
    fnSaveProduct: function () {
        debugger;
        var error = true;
        var lsAttendance_Doctor_Details = new Array();
        var lsAttendance_Samples_Details = new Array();
        for (var i = 1; i <= ($("#tblSamples tr").length - 1) ; i++) {

            if ($("#ddlRegionId_" + i).val() != '0' && $("#rowId_" + i).css('display') != 'none' && $("#hdnMode_" + i).val() != '0') {
                if ($("#hdnMode_" + i).val() == '2') {
                    AttendanceDoctor.RowCancel(i);
                }
                var doctor = {};
                var sample = {};
                doctor.Doctor_Code = $("#hdnDoctorCode_" + i).val();
                //doctor.Doctor_Name = $("#txtDocName_" + i).val();
                var doc = $.grep(AttendanceDoctor.defaults.Doctor_list_all_g, function (element, index) {
                    return element.value == doctor.Doctor_Code;
                });
                var docPrivilege = fnGetPrivilegeValue("RIGID_ATTENDANCE_DOCTOR_ENTRY", "YES");
                if (docPrivilege == 'YES') {
                    doctor.Doctor_Name = doc[0].Customer_Name;
                    doctor.Speciality_Name = doc[0].Speciality_Name;
                    doctor.Speciality_Code = doc[0].Speciality_Code;
                    doctor.Category_Code = doc[0].Category_Code;
                    doctor.Category_Name = doc[0].Category_Name;
                    doctor.MDL_Number = doc[0].MDL_Number;
                    doctor.Doctor_Region_Code = doc[0].Region_Code;
                    doctor.Doctor_Region_Name = doc[0].Region_Name;
                } else {
                    if (doc.length > 0) {
                        doctor.Doctor_Name = doc[0].Customer_Name;
                        doctor.Speciality_Name = doc[0].Speciality_Name;
                        doctor.Speciality_Code = doc[0].Speciality_Code;
                        doctor.Category_Code = doc[0].Category_Code;
                        doctor.Category_Name = doc[0].Category_Name;
                        doctor.MDL_Number = doc[0].MDL_Number;
                        doctor.Doctor_Region_Code = doc[0].Region_Code;
                        doctor.Doctor_Region_Name = doc[0].Region_Name;
                    } else {
                        doctor.Doctor_Name = $("#txtDocName_" + i).val().trim();
                        doctor.Speciality_Name = $("#ddlSpeciality_" + i + " :selected").text();
                        doctor.Speciality_Code = $("#ddlSpeciality_" + i).val();
                        doctor.Category_Code = "";
                        doctor.Category_Name = "";
                        doctor.MDL_Number = "";
                        doctor.Doctor_Region_Code = $("#ddlRegionId_" + i).val();
                        doctor.Doctor_Region_Name = $("#ddlRegionId_" + i + " :selected").text();

                    }
                }
                if ($("#rowId_" + i).css('display') != 'none')
                    doctor.Status = 1;
                else
                    doctor.Status = 0;

                doctor.DCR_Actual_Date = dcrDate;
                doctor.DCR_Code = dcrCode;
                doctor.id = i;
                lsAttendance_Doctor_Details.push(doctor);
                sample.Product_Code = $("#hdnProductCode_" + i).val().split('_')[0];
                sample.Quantity_Provided = $("#txtProdQty_" + i).val();
                sample.Doctor_Name = doctor.Doctor_Name;
                sample.Speciality_Name = $("#ddlSpeciality_" + i + " :selected").text();
                sample.DCR_Actual_Date = dcrDate;
                sample.DCR_Code = dcrCode;
                if ($("#txtRemark_" + i).val() != '') {
                    var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtRemark_" + i));
                    if (!res) {
                        fnMsgAlert('info', 'Remark', 'Please remove the special characters in Remarks. <br/>The following charactres are only allowed <b>-_.,()@</b>.');
                        return false;
                    }
                    else {
                        sample.Remark = $("#txtRemark_" + i).val();
                    }
                }
                //sample.Remark = $("#txtRemark_" + i).val();
                lsAttendance_Samples_Details.push(sample);
            }
        }
        //Check duplicate

        for (var first = 0; first < lsAttendance_Samples_Details.length; first++) {
            for (var second = (first + 1) ; second < lsAttendance_Samples_Details.length; second++) {
                if (lsAttendance_Samples_Details[first].Doctor_Name == lsAttendance_Samples_Details[second].Doctor_Name && lsAttendance_Samples_Details[first].Speciality_Name == lsAttendance_Samples_Details[second].Speciality_Name && lsAttendance_Samples_Details[first].Product_Code == lsAttendance_Samples_Details[second].Product_Code) {
                    fnMsgAlert("error", "Errro", "Same doctor (" + lsAttendance_Samples_Details[first].Doctor_Name + ") with same product more than one time");
                    error = false;
                }
            }
        }
        if (error) {
            $.ajax({
                type: 'post',
                url: '../DCRV4StockiestExpense/InsertAttendanceDoctor',
                data: JSON.stringify({ 'lsAttendance_Doctor_Details': lsAttendance_Doctor_Details, 'lsAttendance_Samples_Details': lsAttendance_Samples_Details, 'dcr_code': dcrCode, 'dcr_date': dcrDate }),
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (result) {
                    if (result == 1) {
                        fnMsgAlert("success", "Success", "Form Controls Saved successfully");
                        FormControls.ResetControls();
                        $("#btnBack").trigger('click');
                    }
                    else {
                        //Error
                    }
                }
            });
        }
        return error;
    },
    fnProductQtyUpdate: function (user_entered_qty, action, ProductCode) {
        var rValue = false;
        debugger;
        user_entered_qty = parseInt(user_entered_qty);
        for (var i = 0; i < AttendanceDoctor.defaults.productAutoFill_g.length; i++) {
            if (AttendanceDoctor.defaults.productAutoFill_g[i].value == ProductCode) {
                var proCode = AttendanceDoctor.defaults.productAutoFill_g[i].label.split('(')[1];

                // var qty_new = parseInt(proCode.split(')')[0]);
                var qty_new = parseInt(AttendanceDoctor.defaults.productAutoFill_g[i].Current_Stock);
                //add
                if (action == 1)
                    qty = qty_new - user_entered_qty;
                else {
                    //delete
                    qty = qty_new + user_entered_qty;
                }
                console.log("user_entered_qty:" + user_entered_qty + ",proQty:" + qty_new + "finalqty" + qty);
                if (qty < 0) {
                    fnMsgAlert('error', 'error', 'The Sample/Promotional item Quantity is Exceeded');
                    autoComplete(AttendanceDoctor.defaults.productAutoFill_g, "txtProd", "hdnProductCode", "autoProd");
                    rValue = false;
                }
                else {
                    // proCode = AttendanceDoctor.defaults.productAutoFill_g[i].label.split('(')[0] + "(" + qty + ")";
                    // AttendanceDoctor.defaults.productAutoFill_g[i].label = proCode;
                    AttendanceDoctor.defaults.productAutoFill_g[i].Current_Stock = qty;
                    autoComplete(AttendanceDoctor.defaults.productAutoFill_g, "txtProd", "hdnProductCode", "autoProd");
                    rValue = true;
                }

            }
        }
        return rValue;
    },
    fnBindDoctorProductDetails: function () {
        $.ajax({
            type: 'post',
            url: '../DCRV4StockiestExpense/GetDoctorProductDetails',
            data: 'dcr_date=' + dcrDate + '&dcr_code=' + dcrCode,
            async: false,
            success: function (result) {
                debugger;
                var list = result;
                if (list.length > 0) {
                    AttendanceDoctor.RowCreation(1);
                    for (var i = 0; i < list.length; i++) {
                        var id = i + 1;
                        $("#ddlRegionId_" + id).val(list[i].Doctor_Region_Code);
                        AttendanceDoctor.GetRegionDoctorList(id);
                        if (list[i].MDL_Number != null && list[i].MDL_Number != '')
                            $("#txtDocName_" + id).val((list[i].Doctor_Name) + '(' + list[i].MDL_Number + ')');
                        else
                            $("#txtDocName_" + id).val((list[i].Doctor_Name));
                        $("#ddlSpeciality_" + id).val(list[i].Speciality_Code);
                        $("#hdnDoctorCode_" + id).val(list[i].Doctor_Code);
                        //var pro = $.grep(AttendanceDoctor.defaults.productAutoFill_g, function (element, index) {
                        //    return element.value == list[i].Product_Code;
                        //});
                        //if (pro.length > 0) {
                        //var qty = pro[0].label.split('(')[1].split(')')[0];
                        //qty = parseInt(qty) + parseInt(list[i].Quantity_Provided);
                        // $("#txtProd_" + id).val(list[i].ProductName + '(' + qty + ')');
                        $("#txtProd_" + id).val(list[i].ProductName);
                        $("#hdnProductCode_" + id).val(list[i].Product_Code);
                        $("#txtProdQty_" + id).val(list[i].Quantity_Provided);
                        $("#txtRemark_" + id).val(list[i].Remark);
                        AttendanceDoctor.SaveRowDetails(id, 2);
                        AttendanceDoctor.RowCreation((id + 1));
                        //}
                    }
                }
                else
                    AttendanceDoctor.RowCreation(1);
            }
        });

    },
    isNumberKey: function (evt, element) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31
          && (charCode < 48 || charCode > 57))
            return false;

        var charCode = (evt.which) ? evt.which : event.keyCode
        if (
            //(charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
            (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },
    fnGetSpecialityList: function () {
        $.ajax({
            type: 'post',
            url: '../DCRV4DoctorVisit/GetSpecialityList',
            data: 'dcr_date=' + dcrDate + '&dcr_code=' + dcrCode,
            async: false,
            success: function (result) {
                AttendanceDoctor.defaults.Doctor_Speciality_g = result;
            }
        });
    }

}