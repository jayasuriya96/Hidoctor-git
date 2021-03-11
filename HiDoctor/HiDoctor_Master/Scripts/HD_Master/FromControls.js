var FormControls = {
    defaults: {
        "control_Master_g": [],
        "validation_Master_g": [],
        "form_Master_g": [],
        "form_ID_g": "0"
    },
    initialize: function () {
        FormControls.GetFormMasterData();

    },
    GetFormMasterData: function () {
        $.ajax({
            url: "../FormControl/GetFormMasterData",
            type: "Get",
            success: function (result) {
                if (result.Status == 1) {
                    var list = result.list;
                    FormControls.defaults.form_Master_g = list.ls_Form_Master;
                    FormControls.defaults.validation_Master_g = list.lsForm_Validation_Master;
                    FormControls.defaults.control_Master_g = list.lsForm_Control_Master;

                    var content = "<ul class='list-group'>";
                    for (var i = 0; i < FormControls.defaults.form_Master_g.length; i++) {
                        content += "<li class='list-group-item'><a href='#' data='1_" + FormControls.defaults.form_Master_g[i].Form_ID + "' onclick='fnShowPanel(this);'>" + FormControls.defaults.form_Master_g[i].Form_Name + "</a></li>";
                    }
                    $("#divFormMaster").html(content);
                }
            }
        });
    },
    SaveFormName: function () {
        var txtformName = $("#txtformName").val().trim();
        for (var i = 0; i < FormControls.defaults.form_Master_g.length; i++) {
            if (txtformName == FormControls.defaults.form_Master_g[i].Form_Name) {
                fnMsgAlert('error', 'Error', 'Form name already exist :' + txtformName);
                return false;
            }
        }
        if (txtformName.trim() == '') {
            fnMsgAlert('error', 'Error', 'Enter Form name');
            return false;
        }
        if ($("#txtformCusName").val().trim() == '') {
            fnMsgAlert('error', 'Error', 'Enter Form Prefix name');
            return false;
        }
        $.ajax({
            type: 'post',
            url: '../FormControl/SaveFormName',
            data: 'formName=' + txtformName + "&formCusName=" + $("#txtformCusName").val(),
            success: function (result) {
                if (result != '' && parseInt(result) > 0) {
                    var form = { Form_ID: result, Form_Name: txtformName };
                    FormControls.defaults.form_Master_g.push(form);
                    $("#divFormMaster").html('');
                    $("#txtformName").val('');
                    var content = "<ul class='list-group'>";
                    for (var i = 0; i < FormControls.defaults.form_Master_g.length; i++) {
                        content += "<li class='list-group-item'><a href='#' data='1_" + FormControls.defaults.form_Master_g[i].Form_ID + "' onclick='fnShowPanel(this);'>" + FormControls.defaults.form_Master_g[i].Form_Name + "</a></li>";
                    }
                    $("#divFormMaster").html(content);
                }
                else {
                    fnMsgAlert('error', 'Error', 'Form name saved failure');
                }
            }

        });
    },
    FormControlCreation: function () {
        var tblLength = $("#tblControl tr").length;
        var control = "<tr id='controlRow_" + tblLength + "'>";
        //lable
        control += "<td><input type='textbox' id='txtlbl_" + tblLength + "' class='form-control' />";
        control += "<input type='hidden' value='0' id='hdnFormControlId_" + tblLength + "'  /></td>";
        //Control
        var ddl = "<select id='ddlControl_" + tblLength + "' class='form-control' onchange='FormControls.BindControlValues(" + tblLength + ")'>";
        ddl += "<option value='0'>-Select-</option>";
        for (var i = 0; i < FormControls.defaults.control_Master_g.length; i++) {
            ddl += "<option  value='" + FormControls.defaults.control_Master_g[i].Control_ID + "_" + FormControls.defaults.control_Master_g[i].Control_Ref_Name + "'>" + FormControls.defaults.control_Master_g[i].Control_Name + "</option>"
        }
        control += "<td>" + ddl + "<input type='hidden' id='hdnValue_" + tblLength + "' value='' /></td>";
        //Values get run time
        control += "<td id='tdControlvalues_" + tblLength + "'></td>";
        //Validation
        //var val = "<select id='ddlValidation_" + tblLength + "'>";
        //val += "<option value='0'>-Select-</option>";
        var val = "";
        for (var i = 0; i < FormControls.defaults.validation_Master_g.length; i++) {
            // val += "<option value='" + FormControls.defaults.validation_Master_g[i].Validation_ID + "_" + FormControls.defaults.validation_Master_g[i].Validation_Ref_Name + "'>" + FormControls.defaults.validation_Master_g[i].Validation_Name + "</option>"
            val += "<input type='checkbox' onClick='FormControls.ValidationAttr(this," + FormControls.defaults.validation_Master_g[i].Validation_Ref_Name + "," + tblLength + ");' name='chk_Validation_" + tblLength + "' value='" + FormControls.defaults.validation_Master_g[i].Validation_ID + "_" + FormControls.defaults.validation_Master_g[i].Validation_Ref_Name + "' />" + FormControls.defaults.validation_Master_g[i].Validation_Name + "<br />";
            //RequireField-1,
            //Maximum And Minimum Value-2,
            //Maximum And Minimum Length-3

            if (FormControls.defaults.validation_Master_g[i].Validation_Ref_Name == 1) {
                val += "";
            } else if (FormControls.defaults.validation_Master_g[i].Validation_Ref_Name == 2) {
                val += "<div id='divValidationValue_" + tblLength + "' style='display:none;'>";
                val += "<p>Minimum <input id='txtMinValue_" + tblLength + "' type='text' /></p>Maximum <input id='txtMaxValue_" + tblLength + "' type='text' />";
                val += "</div>";
            }
            else if (FormControls.defaults.validation_Master_g[i].Validation_Ref_Name == 3) {
                val += "<div id='divValidationLength_" + tblLength + "'style='display:none;'>";
                val += "<p>Minimum <input id='txtMinLength_" + tblLength + "' type='text' /></p>Maximum <input id='txtMaxLength_" + tblLength + "' type='text' />";
                val += "</div>";
            }
        }
        control += "<td>" + val + "</td>";
        control += "<td><input class='form-control' type='textbox' id='txtDisplayOrder_" + tblLength + "' /></td>";
        control += "<td><a href='#' onclick='FormControls.DeleteRow(" + tblLength + ");'>Delete</a></td>";
        control += "</tr>";

        $("#tblControl").append(control);
    },
    SaveFormDetails: function () {
        debugger;
        var tblLength = $("#tblControl tr").length - 1;
        if (tblLength == 0) {
            fnMsgAlert("error", "Error", "Please Add at least one control");
            return false;
        }
        var Controls = new Array();
        var controlvalidation = new Array();
        var Controlvalues = new Array();
        var formId = FormControls.defaults.form_ID_g;
        for (var i = 1; i <= tblLength; i++) {
            if ($("#controlRow_" + i).css("display") != "none") {
                //form details
                var formControl = {}
                formControl.Form_Control_Id = $("#hdnFormControlId_" + i).val();
                formControl.Control_Id = parseInt($("#ddlControl_" + i).val().split('_')[0]);

                formControl.Label_Value = $("#txtlbl_" + i).val();
                formControl.Display_Order = parseInt($("#txtDisplayOrder_" + i).val());


                //validation
                //TextBox - 1,
                //RadioButton - 2,
                //DropDown - 3,
                //CheckBox - 4,
                //TextArea - 5,
                //Label - 6
                if ($("#ddlControl_" + i).val() == '0') {
                    fnMsgAlert("error", "Error", "Please Select Control Type");
                    return false;
                }
                if ($("#txtlbl_" + i).val().trim() == '' && $("#ddlControl_" + i).val().split('_')[1] != '7' && $("#ddlControl_" + i).val().split('_')[1] != '6') {
                    fnMsgAlert("error", "Error", "Please Enter Label Name");
                    return false;
                }
                var control_ref_name = $("#ddlControl_" + i).val().split('_')[1];
                if (control_ref_name == 1) {
                    formControl.InputType = $("#ddlInputType_" + i).val();
                } else if (control_ref_name == 2 || control_ref_name == 3 || control_ref_name == 4) {

                    if ($("#hdnValue_" + i).val().trim() == "") {
                        fnMsgAlert("error", "Error", "Please Enter Control ( " + $("#ddlControl_" + i + " option:selected").text() + " ) values ");
                        return false;
                    }
                    var hdnvalues = $("#hdnValue_" + i).val().split('$');
                    for (var k = 0; k < hdnvalues.length; k++) {
                        var values = {};
                        values.Form_Control_Value_Id = "";
                        values.Form_Control_Id = i;
                        values.Control_values = hdnvalues[k];
                        Controlvalues.push(values);
                    }
                }
                //validation
                var chkValidation = new Array();
                $('input[name="chk_Validation_' + i + '"]:checked').each(function () {
                    chkValidation.push(this.value);
                });
                //0-Validation_ID
                //1-Validation_Ref_Name

                for (var j = 0; j < chkValidation.length; j++) {
                    var validation = {};
                    validation.Form_Id = parseInt(formId);
                    validation.Form_Control_Id = i;
                    validation.Validation_ID = parseInt(chkValidation[j].split('_')[0]);
                    var validationValues = "";
                    if (chkValidation[j].split('_')[1] == 2) {
                        validationValues = $("#txtMinValue_" + i).val() + "&" + $("#txtMaxValue_" + i).val();
                    }
                    else if (chkValidation[j].split('_')[1] == 3) {
                        validationValues = $("#txtMinLength_" + i).val() + "&" + $("#txtMaxLength_" + i).val();
                    }
                    validation.Validation_Values = validationValues;
                    controlvalidation.push(validation);
                }
                Controls.push(formControl);
            }
        }
        var FormControlDetails = {
            Form_ID: formId,
            lsFormvalidation: controlvalidation,
            lsFormControlsValues: Controlvalues,
            lsFormControls: Controls,
        }
        $.ajax({
            type: 'post',
            url: '../FormControl/SaveFormControl',
            data: JSON.stringify({ 'objFormControlDetails': FormControlDetails }),
            contentType: "application/json; charset=utf-8",
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

    },
    BindControlValues: function (rowId) {
        debugger;
        //TextBox - 1,
        //RadioButton - 2,
        //DropDown - 3,
        //CheckBox - 4,
        //TextArea - 5,
        //Label - 6
        var ddlControl_ = $("#ddlControl_" + rowId).val();
        var Control_Ref_Name = ddlControl_.split('_')[1];
        $("#tdControlvalues_" + rowId).html('');
        if (Control_Ref_Name == "1") {
            var ddl = "<select class='form-control' id='ddlInputType_" + rowId + "'>";
            ddl += "<option value='text'>Text</option>";
            ddl += "<option value='number'>Number</option>";
            ddl += "<option value='date'>Date</option>";
            // ddl += "<option value='Decimal'>Decimal</option>";
            ddl += "</select>";
            $("#tdControlvalues_" + rowId).html(ddl);
        }
        else if (Control_Ref_Name == "2" || Control_Ref_Name == "3" || Control_Ref_Name == "4") {
            var tbl = "<table id='tblValues'><tr><th>Values</th><th></th></tr>";
            var id = 1;
            var hdnValue = $("#hdnValue_" + rowId).val();
            var valueArr = [];
            if (hdnValue != '')
                valueArr = hdnValue.split('$');
            for (var i = 0; i < valueArr.length; i++) {
                tbl += "<tr style='height: 46px;'><td><input type='text' id='txtvalue_" + id + "' value=" + valueArr[i] + " class='form-control'/></td>";
                id++;
            }
            tbl += "<tr style='height: 46px;'><td><input type='text' id='txtvalue_" + id + "' class='form-control'/></td>";
            tbl += "<td><input type='button' value='Add'  onclick='FormControls.AddValueTextBox(this);' style='margin-left: 52%;' class='btn' /></td></tr>";
            tbl += "</table>";
            tbl += "<div style='margin-left: 37%;margin-top: 10%;'><input type='button' onclick='FormControls.GetControlValues(" + rowId + ");' value='Save'  class='btn btn-success'/></div>";
            bootbox.alert(tbl);
        }
        else if (Control_Ref_Name == "5") {

        }
        else if (Control_Ref_Name == "6") {

        }
    },
    GetControlValues: function (rowId) {

        var tblLength = $("#tblValues tr").length - 1;
        var values = "";
        var id = "";
        for (var i = 1; i <= tblLength; i++) {
            if ($("#txtvalue_" + i).val().trim() != "") {
                values += "<p>" + $("#txtvalue_" + i).val() + "</p>";
                if (id == "")
                    id = $("#txtvalue_" + i).val();
                else
                    id = id + "$" + $("#txtvalue_" + i).val();
            }
        }
        values += "<p><input type='button' value='Add' class='btn btn-primary' onclick='FormControls.BindControlValues(" + rowId + ");' /></p>";
        $("#hdnValue_" + rowId).val(id);
        $("#tdControlvalues_" + rowId).html('');
        $("#tdControlvalues_" + rowId).html(values);
        bootbox.hideAll();
    },
    Addvalues: function (id) {
        var value = $("#ddlControl_" + id).val();
        FormControls.BindControlValues(value.split('_')[0]);
    },
    AddValueTextBox: function (obj) {
        debugger;
        var tblLength = $("#tblValues tr").length;
        var txt = "<tr style='height: 46px;'><td>"
        txt += "<input type='text' id='txtvalue_" + tblLength + "' class='form-control' />";
        txt += "</td><td><input type='button' value='Add'  onclick='FormControls.AddValueTextBox(this);' style='margin-left: 52%;' class='btn'/></td></tr>";
        $("#tblValues").append(txt);
        $(obj).hide()
    },
    ValidationAttr: function (obj, Validation_Ref_Name, id) {
        //RequireField-1,
        //Maximum And Minimum Value-2,
        //Maximum And Minimum Length-3
        var checked = obj.checked;
        if (Validation_Ref_Name == 1) {

        } else if (Validation_Ref_Name == 2) {
            if (checked)
                $("#divValidationValue_" + id).show();
            else
                $("#divValidationValue_" + id).hide();

        }
        else if (Validation_Ref_Name == 3) {
            if (checked)
                $("#divValidationLength_" + id).show();
            else
                $("#divValidationLength_" + id).hide();
        }
    },
    ResetControls: function () {
        $("#tblControl tbody").html('')

    },
    DeleteRow: function (id) {
        $("#controlRow_" + id).hide();
    },
    BindFormControls: function () {
        FormValues.ResetControls();
        var id = 0;
        $.ajax({
            url: '../FormControl/BindFormControls',
            type: 'post',
            data: 'formId=' + FormControls.defaults.form_ID_g + "&Form_Value_Id=" + id,
            success: function (result) {
                debugger;
                if (result.Status == 1) {
                    var list = result.list;
                    var lsFormControls = list.lsFormControls;
                    var lsFormControlsValues = list.lsFormControlsValues;
                    var lsFormvalidation = list.lsFormvalidation;
                    var lsFormValue = list.lsFormValue;
                    if (lsFormControls.length > 0)
                        for (var i = 0; i < lsFormControls.length; i++) {
                            FormControls.FormControlCreation()
                            var tblLength = $("#tblControl tr").length - 1;
                            $("#txtlbl_" + tblLength).val(lsFormControls[i].Label_Value);
                            $("#hdnFormControlId_" + tblLength).val(lsFormControls[i].Form_Control_Id);
                            $("#txtDisplayOrder_" + tblLength).val(lsFormControls[i].Display_Order);
                            $("#ddlControl_" + tblLength).val(lsFormControls[i].Control_Id + "_" + lsFormControls[i].Control_Ref_Name);
                            var Control_Ref_Name = lsFormControls[i].Control_Ref_Name;
                            if (Control_Ref_Name == "1") {
                                var ddl = "<select class='form-control' id='ddlInputType_" + tblLength + "'>";
                                ddl += "<option value='text'>Text</option>";
                                ddl += "<option value='number'>Number</option>";
                                ddl += "<option value='date'>Date</option>";
                                // ddl += "<option value='Decimal'>Decimal</option>";
                                ddl += "</select>";
                                $("#tdControlvalues_" + tblLength).html(ddl);
                                $("#ddlInputType_" + tblLength).val(lsFormControls[i].InputType);
                            }
                            else if (Control_Ref_Name == "2" || Control_Ref_Name == "3" || Control_Ref_Name == "4") {
                                var data = $.grep(lsFormControlsValues, function (element, index) {
                                    return element.Form_Control_Id == lsFormControls[i].Form_Control_Id;
                                });
                                var id = "";
                                var values = "";
                                for (var j = 0; j < data.length; j++) {
                                    values += "<p>" + data[j].Control_values + "</p>";
                                    if (id == "")
                                        id = data[j].Control_values;
                                    else
                                        id = id + "$" + data[j].Control_values;
                                }
                                values += "<p><input type='button' value='Add' class='btn btn-primary' onclick='FormControls.BindControlValues(" + tblLength + ");' /></p>";
                                $("#hdnValue_" + tblLength).val(id);
                                $("#tdControlvalues_" + tblLength).html(values);
                            }

                            //validation
                            var data = $.grep(lsFormvalidation, function (element, index) {
                                return element.Form_Control_Id == lsFormControls[i].Form_Control_Id;
                            });
                            for (var l = 0; l < data.length; l++) {
                                var Validation_Ref_Name = data[l].Validation_Ref_Name;
                                var Validation_Values = data[l].Validation_Values;
                                if (Validation_Ref_Name == 1) {

                                } else if (Validation_Ref_Name == 2) {
                                    $("#txtMinValue_" + tblLength).val(Validation_Values.split('&')[0]);
                                    $("#txtMaxValue_" + tblLength).val(Validation_Values.split('&')[1]);
                                    $("#divValidationValue_" + tblLength).show();
                                }
                                else if (Validation_Ref_Name == 3) {
                                    $("#divValidationLength_" + tblLength).show();
                                    $("#txtMinLength_" + tblLength).val(Validation_Values.split('&')[0]);
                                    $("#txtMaxLength_" + tblLength).val(Validation_Values.split('&')[1]);

                                }
                                $('input[name="chk_Validation_' + tblLength + '"]').each(function () {
                                    debugger;
                                    if ($(this).attr('value') == "" + data[l].Validation_ID + "_" + data[l].Validation_Ref_Name + "") {
                                        $(this).attr('checked', true);
                                    }
                                });
                            }

                        }
                }
            }
        });
    },
}
var FormValues = {
    defaults: {
        "control_Master_g": [],
        "validation_Master_g": [],
        "form_Master_g": [],
        "form_ID_g": "0",
        "lsFormControls": [],
        "lsFormControlsValues": [],
        "lsFormvalidation": [],
        "lsFormValue": []
    },
    initialize: function () {
        FormValues.GetFormMasterData();
    },
    GetFormMasterData: function () {
        $.ajax({
            url: "../FormControl/GetFormMasterData",
            type: "Get",
            success: function (result) {
                if (result.Status == 1) {
                    var list = result.list;
                    FormValues.defaults.form_Master_g = list.ls_Form_Master;
                    FormValues.defaults.validation_Master_g = list.lsForm_Validation_Master;
                    FormValues.defaults.control_Master_g = list.lsForm_Control_Master;

                    var content = "<ul class='list-group'>";
                    for (var i = 0; i < FormValues.defaults.form_Master_g.length; i++) {
                        content += "<li class='list-group-item'><a href='#' data='1_" + FormValues.defaults.form_Master_g[i].Form_ID + "' onclick='fnShowPanel(this);'>" + FormValues.defaults.form_Master_g[i].Form_Name + "</a></li>";
                    }
                    $("#divFormMaster").html(content);
                }
            }
        });
    },
    ResetControls: function () {
        $("#tblUserForm tbody").html('')
    },
    BindFormControls: function () {
        FormValues.ResetControls();
        var id = 0;
        $.ajax({
            url: '../FormControl/BindFormControls',
            type: 'post',
            data: 'formId=' + FormValues.defaults.form_ID_g + "&Form_Value_Id=" + id,
            success: function (result) {
                debugger;
                if (result.Status == 1) {
                    var list = result.list;
                    FormValues.defaults.lsFormControls = list.lsFormControls;
                    FormValues.defaults.lsFormControlsValues = list.lsFormControlsValues;
                    FormValues.defaults.lsFormvalidation = list.lsFormvalidation;
                    FormValues.defaults.lsFormValue = list.lsFormValue;

                    if (PageType == 1) {
                        FormValues.DataPrefill(FormValues.defaults.lsFormControls, FormValues.defaults.lsFormControlsValues, FormValues.defaults.lsFormvalidation);

                        var formdata = $.grep(FormValues.defaults.form_Master_g, function (element, index) {
                            return element.Form_ID == FormValues.defaults.form_ID_g;
                        });
                        var data = $.grep(FormValues.defaults.lsFormValue, function (element, index) {
                            return element.Form_ID == FormValues.defaults.form_ID_g;
                        });
                        var count = data.length;
                        if (count == undefined)
                            count = 0;

                        $("#txtFormCustomname").val(formdata[0].Form_Custom_Name + "-" + (count + 1));
                        $("#txtFormCustomname").attr('disabled', true);
                        $("#btn").show();
                    }
                    else {
                        FormValues.BindFormCusName();
                    }
                }
            }
        });
    },
    DataPrefill: function (lsFormControls, lsFormControlsValues, lsFormvalidation) {
        debugger;
        $("#tblUserForm tbody").html('');
        var tbl = "<tr>";
        var trCount = 0;
        for (var i = 0; i < lsFormControls.length; i++) {
            var colspan = 0;
            var width = "20%";
            if (lsFormControls[i].Control_Ref_Name == 6) {
                colspan = 2;
                width = "50%";
            } else if (lsFormControls[i].Control_Ref_Name == 7) {
                colspan = 4;
                width = "100%;height: 35px";
            }
            tbl += "<td  style='width: 4%; display: none;'>" + (i + 1) + "</td>";
            if (lsFormControls[i].Control_Ref_Name != 7)
                tbl += "<td colspan=" + colspan + " style='width: " + width + "; font-weight: bold;text-align: center;'>" + lsFormControls[i].Label_Value;
            else
                tbl += "<td colspan=" + colspan + " style='width: " + width + "; font-weight: bold;'><label style='margin-left: 7%;'>" + lsFormControls[i].Label_Value + "</label>";
            tbl += "<input type='hidden' id='hdnControlType_" + i + "' value='" + lsFormControls[i].Control_Ref_Name + "' />";
            tbl += "<input type='hidden' id='hdnControlID_" + i + "' value='" + lsFormControls[i].Control_Id + "' />";
            tbl += "<input type='hidden' id='hdnFormControlId_" + i + "' value='" + lsFormControls[i].Form_Control_Id + "' />";
            tbl += "</td>";
            //control
            //TextBox - 1,
            //RadioButton - 2,
            //DropDown - 3,
            //CheckBox - 4,
            //TextArea - 5,
            //Label - 6
            if (lsFormControls[i].Control_Ref_Name != 6 && lsFormControls[i].Control_Ref_Name != 7) {
                tbl += "<td  style='width: 30%;' >";
                var conValues = $.grep(lsFormControlsValues, function (element, index) {
                    return element.Form_Control_Id == lsFormControls[i].Form_Control_Id
                });
                var conValidation = $.grep(lsFormvalidation, function (element, index) {
                    return element.Form_Control_Id == lsFormControls[i].Form_Control_Id
                });
                var required = "";
                var maxlength = "";
                var minlength = "";
                var maxvalue = "";
                var minvalue = "";
                //RequireField-1,
                //Maximum And Minimum Value-2,
                //Maximum And Minimum Length-3

                for (var v = 0; v < conValidation.length; v++) {
                    if (conValidation[v].Validation_Ref_Name == 1) {
                        required = " required ";
                    } else if (conValidation[v].Validation_Ref_Name == 2 && conValidation[v].Validation_Values != '') {
                        var temp = conValidation[v].Validation_Values.split('&');
                        if (temp.length >= 1) {
                            minvalue = " min='" + conValidation[v].Validation_Values.split('&')[0] + "' ";
                            maxvalue = " max='" + conValidation[v].Validation_Values.split('&')[1] + "' ";
                        }
                    } else if (conValidation[v].Validation_Ref_Name == 3 && conValidation[v].Validation_Values != '') {
                        var temp = conValidation[v].Validation_Values.split('&');
                        if (temp.length >= 1) {
                            maxlength = " minlength='" + conValidation[v].Validation_Values.split('&')[0] + "' ";
                            minlength = " maxlength='" + conValidation[v].Validation_Values.split('&')[1] + "' ";
                        }
                    }
                }
                if (lsFormControls[i].Control_Ref_Name == 1) {
                    var value = "";
                    if (PageType == 1)
                        tbl += "<input tabindex='" + i + "' class='form-control' type='" + lsFormControls[i].InputType + "' id='controlID_" + i + "' " + required + " " + minvalue + " " + maxvalue + " " + maxlength + " " + minlength + "/></td>";
                    else
                        tbl += lsFormControls[i].Form_Control_values;
                }
                else if (lsFormControls[i].Control_Ref_Name == 2) {
                    var checked = false;
                    var chk = "";
                    if (PageType == 1) {
                        for (var k = 0; k < conValues.length; k++) {
                            if (k == 0)
                                chk += "<div style='margin-left: 10%;' class='radio'>";
                            chk += "<input " + required + " tabindex='" + i + "' type='radio' name='controlName_" + i + "' value='" + conValues[k].Control_values + "'> " + conValues[k].Control_values + "<br>";
                            checked = false;
                        }

                        if (chk != "") {
                            chk += "</div>";
                        }
                        tbl += chk;
                    }
                    else
                        tbl += lsFormControls[i].Form_Control_values;

                }
                else if (lsFormControls[i].Control_Ref_Name == 3) {
                    var value = "";
                    var selected = "";
                    if (PageType == 1) {
                        var ddl = "<select tabindex='" + i + "' class='form-control' id=controlID_" + i + " " + required + ">";
                        ddl += "<option value='' >-Select-</option>";
                        for (var k = 0; k < conValues.length; k++) {
                            if (conValues[k].Control_values == value)
                                selected = "selected";
                            ddl += "<option " + selected + " value=" + conValues[k].Control_values + ">" + conValues[k].Control_values + "</option>";
                            selected = "";
                        }
                        ddl += "</select>";
                        tbl += ddl;
                    }
                    else
                        tbl += ":" + lsFormControls[i].Form_Control_values;
                } else if (lsFormControls[i].Control_Ref_Name == 4) {
                    var value = "";
                    var checked = "";
                    if (PageType == 1) {
                        var chk = "<div style='margin-left: 10%;' class='checkbox'>";
                        for (var k = 0; k < conValues.length; k++) {
                            if (conValues[k].Control_values == value)
                                checked = "checked";
                            chk += "<input " + required + " tabindex='" + i + "'  type='checkbox' name='controlName_" + i + "' value='" + conValues[k].Control_values + "'" + checked + ">" + conValues[k].Control_values + "<br>";
                            checked = "";
                        }
                        if (chk != '')
                            chk += "</div>";
                        tbl += chk;
                    }
                    else
                        tbl += lsFormControls[i].Form_Control_values;

                } else if (lsFormControls[i].Control_Ref_Name == 5) {
                    var value = "";
                    if (PageType == 1)
                        tbl += "<textarea " + required + " tabindex='" + i + "' class='form-control' id='controlID_" + i + "'>" + value + "</textarea>";
                    else
                        tbl += lsFormControls[i].Form_Control_values;
                } else if (lsFormControls[i].Control_Ref_Name == 6) {

                }
            }
            if (lsFormControls[i].Control_Ref_Name == 7)
                trCount++;
            if (((trCount + 1) % 2) == 0 || i == (lsFormControls.length - 1)) {
                //) {
                tbl += "</tr>";
                $("#tblUserForm").append(tbl);
                tbl = "<tr>"
            }
            trCount++;

        }

    },
    SaveFormData: function () {
        debugger;
        var tblLength = $("#tblUserForm tbody tr").length;
        if (tblLength == 0)
            return false;
        tblLength = tblLength * 2;
        var lsFormValueDetails = new Array();
        for (var i = 0; i < tblLength; i++) {
            var FormValueDetails = {}
            var ControlType = $("#hdnControlType_" + i).val();
            if (ControlType != undefined) {
                FormValueDetails.Form_ID = FormValues.defaults.form_ID_g;
                FormValueDetails.Form_Control_Id = $("#hdnFormControlId_" + i).val();
                //control //TextBox - 1, //RadioButton - 2,//DropDown - 3,  //CheckBox - 4,//TextArea - 5,//Label - 6
                if (ControlType == '1' || ControlType == '3' | ControlType == '5') {
                    FormValueDetails.Form_Control_values = $("#controlID_" + i).val();
                }
                else if (ControlType == '2') {
                    FormValueDetails.Form_Control_values = $("input[name='controlName_" + i + "']:checked").val();
                }
                else if (ControlType == '4') {
                    var chk = "";
                    $('input[name="controlName_' + i + '"]:checked').each(function () {
                        if (chk == "")
                            chk = this.value;
                        else
                            chk = chk + "," + this.value;
                    });
                    FormValueDetails.Form_Control_values = chk;
                }

                lsFormValueDetails.push(FormValueDetails);
            }
        }
        var Form_Value = {
            Form_ID: FormValues.defaults.form_ID_g,
            Form_Custom_name: $("#txtFormCustomname").val(),
            lsFormValueDetails: lsFormValueDetails

        }
        $.ajax({
            url: '../FormControl/SaveFormValue',
            type: 'post',
            data: JSON.stringify({ 'objFormValue': Form_Value }),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                fnMsgAlert("success", "Success", "Form Details Saved successfully");
                $("#btnBack").trigger("click");
            }
        });
        return false;
    },
    BindFormCusName: function () {
        $("#userForm").hide();
        var cusName = "<table class='table table-bordered'><thead><th>Form Prefix Name</th>";
        if (PageType == 2) {
            cusName += "<th>Entered By</th><th>Entered Date</th>";
        }
        cusName += "</thead><body>";
        var data = $.grep(FormValues.defaults.lsFormValue, function (element, index) {
            return element.Form_ID == FormValues.defaults.form_ID_g;
        });

        for (var i = 0; i < data.length; i++) {
            cusName += " <tr><td><a href='#' onclick='FormValues.FormDataPrefill(" + data[i].Form_Value_Id + ")'>" + data[i].Form_Custom_name + "</a></td>";
            if (PageType == 2) {
                cusName += " <td>" + data[i].Created_By + "</td>";
                cusName += " <td>" + data[i].Created_Date + "</td>";
            }
            cusName += "</tr>";
        }
        cusName += '</body></html>';
        $("#divCusName").html("<div style='width: 599px;'>" + cusName + "</div>");
        $("#divCusName").show();


    },
    FormDataPrefill: function (Form_Value_Id) {
        $.ajax({
            url: '../FormControl/BindFormControls',
            type: 'post',
            data: 'formId=' + FormValues.defaults.form_ID_g + "&Form_Value_Id=" + Form_Value_Id,
            success: function (result) {
                debugger;
                if (result.Status == 1) {
                    var list = result.list;
                    FormValues.defaults.lsFormControls = list.lsFormControls;
                    FormValues.DataPrefill(FormValues.defaults.lsFormControls, FormValues.defaults.lsFormControlsValues, FormValues.defaults.lsFormvalidation);
                    $("input[type=text]").attr('disabled', true);
                    $("input[type=radio]").attr('disabled', true);
                    $("input[type=checkbox]").attr('disabled', true);
                    $("input[type=textarea]").attr('disabled', true);
                    $("#txtFormCustomname").val('');
                    var data = $.grep(FormValues.defaults.lsFormValue, function (element, index) {
                        return element.Form_Value_Id == Form_Value_Id;
                    });
                    $("#txtFormCustomname").val(data[0].Form_Custom_name);
                    $("#btn").hide();
                    fninializePrint("usertable", "ifrmPrint", "tblUserForm");
                    $("#userForm").show();
                }
            }
        });
    }

}