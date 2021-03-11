var Users_g = "";
var i = 0;
var j = 0;
var k = 0;
var privilege_g = "";
var doc_g = "";
var spcl_g = "";
var b = "";
var paramval = "";

var DieticianAPPReporting = {
    defaults: {
        //companyCode: "",
        //regionCode: "",
        //userCode: "",
        //userTypeCode: ""
    },
    Init: function () {
        debugger;
        DieticianAPPReporting.fngetusers();
        DieticianAPPReporting.fngetActivity();
        DieticianAPPReporting.fnadddoctor();
        //DieticianAPPReporting.fnaddpatient();
        //DieticianAPPReporting.fnaddprescription();
        //DieticianAPPReporting.fnonloadgetSpeciality(i);
        DieticianAPPReporting.fngetAccompanist();
        $("#filledby").val(UserName).attr('disabled', true);
        $("#startdate").val(dcrdate).attr('disabled', true);
        if (headerid != 0) {
            DieticianAPPReporting.fngetDieticiandata();
        }
    },
    fngetusers: function () {
        debugger;
        var divisioncode = $('#ddldivision option:selected').val();
        if (divisioncode == "") {
            var divisioncode = 0;
        }
        var details = DieticianAPPReporting.defaults.companyCode + '/' + UserCode + '/' + RegionCode;
        RPAREST.requestInvoke("DieticianReporting/GetUsersbasedondivision", details, null, "GET", DieticianAPPReporting.fngetusersSuccessCallback, DieticianAPPReporting.fngetusersFailureCallback, null);
    },
    fngetusersSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddluser"  onchange="DieticianAPPReporting.fngetdata();">';
            content += '<option value="-1" selected disabled>Select Region</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Region_Code + '">' + response.list[i].Region_Name + '-' + response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name + '</option>'
            }
            content += '</select>';
            $('#dvusers').html(content);
            $("#ddluser").val(selectedregionname).attr('disabled', false);
            //DieticianAPPReporting.fngetskudetails(k);
            DieticianAPPReporting.fngetdocdetails(i);
        }
    },
    fngetusersFailureCallback: function () {

    },
    fngetdata: function () {
        //DieticianAPPReporting.fngetskudetails(k);
        DieticianAPPReporting.fngetdocdetails(i);
    },
    fngetActivity: function () {
        debugger;
        var details = DieticianAPPReporting.defaults.companyCode;
        RPAREST.requestInvoke("DieticianReporting/GetActivityforDR", details, null, "GET", DieticianAPPReporting.fngetActivitySuccessCallback, DieticianAPPReporting.fngetActivityFailureCallback, null);
    },
    fngetActivitySuccessCallback: function (response, CompanyCode) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddlActivity" onchange="DieticianAPPReporting.fngetsubActivity();">';
            content += '<option value="-1" selected disabled>Select Activity</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Activity_Code + '">' + response.list[i].Activity_Name + '</option>'
            }
            content += '</select>';
            $('#Activity').html(content);
            $("#ddlActivity").val(activitycode).attr('disabled', true);
            DieticianAPPReporting.fngetsubActivity();
        }
    },
    fngetActivityFailureCallback: function () {

    },
    fngetsubActivity: function () {
        debugger;
        var ActivityCode = $('#ddlActivity option:selected').val();
        var details = DieticianAPPReporting.defaults.companyCode + '/' + ActivityCode;
        RPAREST.requestInvoke("DieticianReporting/GetSubActivity", details, null, "GET", DieticianAPPReporting.fngetsubactivitySuccessCallback, DieticianAPPReporting.fngetsubactivityFailureCallback, null);

    },
    fngetsubactivitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddlsubActivity" onchange="DieticianAPPReporting.fngetParametertype(1)">';
            content += '<option value="-1" selected disabled>Select SubActivity</option>'
            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].SubActivity_Code + '">' + response.list[i].SubActivity_Name + '</option>';
            }
            content += '</select>';
            $('#subactivity').html(content);
            $("#ddlsubActivity").val(subactivitycode).attr('disabled', true);
            DieticianAPPReporting.fngetParametertype(1);

        }
    },
    fngetsubactivityFailureCallback: function () {

    },
    fnadddoctor: function () {
        debugger;
        i = i + 1;
        if (i != 1) {
            $("#plus" + (i - 1) + "").hide();
        }
        var content = "";
        content += '<form>';
        content += '<div class="form-row docgrid" id="doctorgrid' + i + '">';
        content += '<div class="form-group col-md-2">';
        content += '<label for="StockistName"><b>Stockist Name</b></label>';
        content += '<div class="col-sm-12" id="dvdoctor' + i + '">';
        content += '<input class="form-control" type="text" id="ddldoctor_' + i + '" tabindex="1"/>';

        //content += '<select class="form-control" id="ddldoctor' + i + '">';
        //content += '<option value="-1" selected disabled>Select Stockist</option>';
        //content += '</select>';
        content += '</div>';
        content += '</div>';
        /*content += '<div class="form-group col-md-2">';
        content += '<label for="Speciality"><b>Speciality</b></label>';
        content += '<div class="col-sm-12" id="dvspeciality' + i + '">';
        content += '<select class="form-control"  id="Speciality' + i + '">';
        content += '<option value="-1" selected disabled>Select Speciality</option>';
        content += '</select>';
        content += '</div>';*/
        //content += '<input type="text" class="form-control" id="Speciality' + i + '">';
        //content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="Prescription"><b>POB Value</b></label>';
        content += '<input type="number" min="0" class="form-control" id="Prescription' + i + '" onkeypress = "return DieticianAPPReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-3">';
        content += '<label for="Remarks"><b>Remarks</b></label>';
        content += '<textarea class="form-control" maxlength="500" class="form-control" id="remarks' + i + '" style="resize:none;"></textarea>';
        content += '</div>';
        content += '<div class="col-md-3 plusminus">';
        content += '<label for="inputPassword4"></label>';
        content += '<i class="fa fa-plus" aria-hidden="true" style="margin-top:41px;" id="plus' + i + '" onclick="DieticianAPPReporting.fnadddoctor(' + i + ');"></i>';
        content += '<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:26px;" id="minus' + i + '" onclick="DieticianAPPReporting.fnremovedoctor(' + i + ');"></i>';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        $("#dvMainDoctorBody").append(content);
        DieticianAPPReporting.fngetdocdetails(i);
        //DieticianAPPReporting.fnonloadgetSpeciality(i);
        if (i == 1) {
            $("#minus" + i + "").hide();
        }
    },
    fnremovedoctor: function (rowId) {
        debugger;
        if (rowId != 1) {
            $('#doctorgrid' + rowId + '').remove();
        }
        if (rowId != 1) {
            $("#plus" + (rowId - 1) + "").show();
        }
    },
    fnaddpatient: function () {
        j = j + 1;
        if (j != 1) {
            $("#patplus" + (j - 1) + "").hide();
        }
        var content = "";
        content += '<form>';
        content += '<div class="form-row pgrid" id="patientgrid' + j + '">';
        content += '<div class="form-group col-md-2">';
        content += '<label for="Type"><b>Parameter Value</b></label>';
        content += '<div class="col-sm-12" id="dvtype">';
        content += '<select class="form-control" id="ddltype' + j + '">';
        content += '<option value="-1" selected disabled>Select Type</option>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="patientname"><b>Patient Name</b></label>';
        content += '<input type="text" class="form-control" id="Patientname' + j + '">';
        content += '</div>';
        content += '<div class="form-group col-md-1">';
        content += '<label for="age"><b>Age</b></label>';
        content += '<input type="number" min="0" class="form-control" id="age' + j + '" onkeypress = "return DieticianAPPReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="gender"><b>Gender</b></label>';
        content += '<select class="form-control" id="gender' + j + '">';
        content += '<option value="-1" selected disabled>Select Gender</option>';
        content += '<option value="male">Male</option>';
        content += '<option value="female">Female</option>';
        content += '<option value="others">Others</option>';
        content += '</select>';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="pvalue" onkeypress = "return DieticianAPPReporting.isNumber(event)"><b>Total Prescription Value</b></label>';
        content += '<input type="number" min="0" class="form-control" id="pvalue' + j + '">';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="notes"><b>Notes</b></label>';
        content += '<textarea class="form-control" maxlength="500" id="notes' + j + '" style="resize:none;"></textarea>';
        content += '</div>';
        content += '<div class="col-md-2 plusminus">';
        content += '<label for="inputPassword4"></label>';
        content += '<i class="fa fa-plus" aria-hidden="true" style="margin-top:41px;" id="patplus' + j + '" onclick="DieticianAPPReporting.fnaddpatient(' + j + ');"></i>';
        content += '<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:26px;" id="patminus' + j + '" onclick="DieticianAPPReporting.fnremovepatient(' + j + ')"></i>';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        $("#dvMainPatientdetBody").append(content);
        DieticianAPPReporting.fngetParametertype(j);
        if (j == 1) {
            $("#patminus" + j + "").hide();
        }
    },
    fnremovepatient: function (val) {
        debugger;
        if (val != 1) {
            $('#patientgrid' + val + '').remove();
        }
        if (val != 1) {
            $("#patplus" + (val - 1) + "").show();
        }
    },
    fnaddprescription: function () {
        k = k + 1;
        if (k != 1) {
            $("#preplus" + (k - 1) + "").hide();
        }
        var content = "";
        content += '<form>';
        content += '<div class="form-row pregrid" id="prescriptiongrid' + k + '">';
        content += '<div class="form-group col-md-2">';
        content += '<label for="sku"><b>SKU</b></label>';
        content += '<div class="col-sm-12" id="dvsku' + k + '">';
        content += '<input class="ddlsku" type="text" id="ddlsku' + k + '" tabindex="1" onkeypress="return false;"/>';
        content += '</select>';
        content += '</div>';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="noofprescriptions"><b>Prescription Qty</b></label>';
        content += '<input type="number" min="0" class="form-control" id="noofprescriptions' + k + '" onkeypress = "return DieticianAPPReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="noofprescriptionsValue"><b>Prescription Value</b></label>';
        content += '<input type="number" min="0" class="form-control" id="noofprescriptionsValue' + k + '" onkeypress = "return DieticianAPPReporting.isNumber(event)">';
        content += '</div>';
        content += '<div class="form-group col-md-2">';
        content += '<label for="note"><b>Notes</b></label>';
        content += '<textarea class="form-control" maxlength="500" id="note' + k + '" style="resize:none;"></textarea>';
        content += '</div>';
        content += '<div class="col-md-2 plusminus">';
        content += '<label for="inputPassword4"></label>';
        content += '<i class="fa fa-plus" aria-hidden="true" style="margin-top:41px;" id="preplus' + k + '" onclick="DieticianAPPReporting.fnaddprescription(' + k + ');"></i>';
        content += '<i class="fa fa-minus-circle" aria-hidden="true" style="margin-left:26px;" id="preminus' + k + '" onclick="DieticianAPPReporting.fnremoveprescription(' + k + ');"></i>';
        content += '</div>';
        content += '</div>';
        content += '</form>';
        $("#dvMainprescriptionBody").append(content);
        //DieticianAPPReporting.fngetskudetails(k);
        if (k == 1) {
            $("#preminus" + k + "").hide();
        }
    },
    fnremoveprescription: function (val) {
        debugger;
        if (val != 1) {
            $('#prescriptiongrid' + val + '').remove();
        }
        if (val != 1) {
            $("#preplus" + (val - 1) + "").show();
        }
    },

    fngetParametertype: function (val) {
        debugger;
        paramval = val;
        var ActivityCode = $('#ddlActivity option:selected').val();
        var SubActivityCode = $('#ddlsubActivity option:selected').val();
        var details = DieticianAPPReporting.defaults.companyCode + '/' + ActivityCode + '/' + SubActivityCode;
        RPAREST.requestInvoke("DieticianReporting/Getparametertype", details, null, "GET", DieticianAPPReporting.fngetParametertypeSuccessCallback, DieticianAPPReporting.fngetParametertypeFailureCallback, null);

    },
    fngetParametertypeSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="ddltype' + paramval + '">';
            content += '<option value="-1" selected disabled>Select Type</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Parametertype_Code + '">' + response.list[i].Parametertype_Name + '</option>';
            }
            content += '</select>';
            $('#ddltype' + paramval + '').html(content);
        }
    },
    fngetParametertypeFailureCallback: function () {

    },

    fngetdocdetails: function (val) {
        debugger;
        doc_g = val;
        if (CompanyCode == "") {
            var compcode = DieticianAPPReporting.defaults.companyCode;
        }
        else {
            var compcode = CompanyCode;
        }
        var details = DieticianAPPReporting.defaults.companyCode + '/' + $("#ddluser").val() + '/' + dcrdate;
        RPAREST.requestInvoke("DieticianReporting/GetStockiestDetails", details, null, "GET", DieticianAPPReporting.fngetdocdetailsSuccessCallback, DieticianAPPReporting.fngetdocdetailsFailureCallback, null);

    },
    fngetdocdetailsSuccessCallback: function (response) {
        debugger;
        var data2 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].Customer_Code),
                        name: $.trim(response.list[i].Customer_Name)
                    };
                    data2.push(_obj);
                }
            }
            debugger;
            $('#dvdoctor' + doc_g + '').empty();
            $('#dvdoctor' + doc_g + '').html('<input class="form-control" type="text" id="ddldoctor_' + doc_g + '" tabindex="1" />');
            var Doctors = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Stockist',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'

                //change: DieticianAPPReporting.fngetSpeciality
            });
            Doctors.appendTo('#ddldoctor_' + doc_g + '');
        } else {
            $('#dvdoctor' + doc_g + '').empty();
            $('#dvdoctor' + doc_g + '').html('<input class="form-control" type="text" id="ddldoctor_' + doc_g + '" tabindex="1" />');
            var WorkAreas = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Stockist',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'

                //change: DieticianAPPReporting.fngetSpeciality()
            });
            Doctors.appendTo('#ddldoctor_' + doc_g + '');
        }
    },
    fngetdocdetailsFailureCallback: function () {
        
    },
    fngetSpeciality: function (args) {
        debugger;
        //  spcl_g = val;
        if (args != null) {
            var a = args.element.id;
            b = a.split('_');
        }
        var Customercode = $("select[name='ddldoctor_" + b[1] + "']").val();
        if ($("select[name='ddldoctor_" + b[1] + "']").val() == undefined) {
            var Customercode = 0;
        }
            // }
        else {
            var Customercode = $("select[name='ddldoctor_" + b[1] + "']").val();
        }
        var details = DieticianAPPReporting.defaults.companyCode + '/' + Customercode + '/' + RegionCode;
        RPAREST.requestInvoke("DieticianReporting/GetSpecialityforDR", details, null, "GET", DieticianAPPReporting.fngetSpecialitySuccessCallback, DieticianAPPReporting.fngetSpecialityFailureCallback, null);

    },
    fngetSpecialitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="Speciality' + b[1] + '">';
            content += '<option value="-1" selected disabled>Select Speciality</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Speciality_Code + '">' + response.list[i].Speciality_Name + '</option>';
            }
            content += '</select>';
            $('#dvspeciality' + b[1] + '').html(content);
            if ($("select[name='ddldoctor_" + b[1] + "']").val() != null) {
                $("#Speciality" + b[1] + "").val(response.list[0].Speciality_Code).attr('disabled', true);
            }
        }
    },
    fngetSpecialityFailureCallback: function () {

    },
    fngetAccompanist: function () {
        debugger;
        var details = DieticianAPPReporting.defaults.companyCode + '/' + RegionCode + '/' + '0' + '/' + UserCode + '/' + '0';
        RPAREST.requestInvoke("DieticianReporting/GetAccompanistdetails", details, null, "GET", DieticianAPPReporting.fngetAccompanistSuccessCallback, DieticianAPPReporting.fngetAccompanistFailureCallback, null);
    },
    fngetAccompanistSuccessCallback: function (response) {
        debugger;
        var data1 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].User_Code),
                        name: $.trim(response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name)
                    };
                    data1.push(_obj);
                }
            }
            Users_g = data1;

            $('#dvadditionalusers').empty();
            $('#dvadditionalusers').html('<input type="text" id="additionalusers" name="additionalusers" class="form-control" maxlength="" />');
            var Users = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select joint work with',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'
            });
            Users.appendTo('#additionalusers');
        } else {
            $('#dvadditionalusers').empty();
            $('#dvadditionalusers').html('<input type="text" id="additionalusers" name="additionalusers" class="form-control" maxlength="" />');
            var WorkAreas = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select joint work with',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'
            });
            Users.appendTo('#additionalusers');
        }
    },
    fngetAccompanistFailureCallback: function () {

    },
    fngetskudetails: function (val) {
        debugger;
        sku_g = val;
        if (CompanyCode == "") {
            var compcode = DieticianAPPReporting.defaults.companyCode;
        }
        else {
            var compcode = CompanyCode;
        }
        debugger;
        var details = DieticianAPPReporting.defaults.companyCode + '/' + $("#ddluser").val();
        RPAREST.requestInvoke("DieticianReporting/Getsaleproduct", details, null, "GET", DieticianAPPReporting.fngetskudetailsSuccessCallback, DieticianAPPReporting.fngetskudetailsFailureCallback, null);

    },
    fngetskudetailsSuccessCallback: function (response) {
        debugger;
        var data2 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].Product_Code),
                        name: $.trim(response.list[i].Product_Name)
                    };
                    data2.push(_obj);
                }
            }
            $('#dvsku' + sku_g + '').empty();
            $('#dvsku' + sku_g + '').html('<input class="ddlsku" type="text" id="ddlsku' + sku_g + '" tabindex="1" onkeypress="return false;"/>');
            var Doctors = new ej.dropdowns.DropDownList({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Product',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

            });
            Doctors.appendTo('#ddlsku' + sku_g + '');
        } else {
            $('#dvsku' + sku_g + '').empty();
            $('#dvsku' + sku_g + '').html('<input class="ddlsku" type="text" id="ddlsku' + sku_g + '" tabindex="1" onkeypress="return false;"/>');
            var Doctors = new ej.dropdowns.DropDownList({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Product',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

            });
            Doctors.appendTo('#ddlsku' + sku_g + '');
        }

    },
    fngetskudetailsFailureCallback: function () {

    },
    fnonloadgetSpeciality: function (val) {
        debugger;
        spcl_g = val;

        var Customercode = $("select[name='ddldoctor_" + spcl_g + "']").val();
        if ($("select[name='ddldoctor_" + spcl_g + "']").val() == undefined) {
            var Customercode = 0;
        }
            // }
        else {
            var Customercode = $("select[name='ddldoctor_" + spcl_g + "']").val();
        }
        var details = DieticianAPPReporting.defaults.companyCode + '/' + Customercode + '/' + RegionCode;
        RPAREST.requestInvoke("DieticianReporting/GetSpecialityforDR", details, null, "GET", DieticianAPPReporting.fnonloadgetSpecialitySuccessCallback, DieticianAPPReporting.fnonloadgetSpecialityFailureCallback, null);

    },
    fnonloadgetSpecialitySuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            content += '<select class="form-control" id="Speciality' + spcl_g + '">';
            content += '<option value="-1" selected disabled>Select Speciality</option>'

            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Speciality_Code + '">' + response.list[i].Speciality_Name + '</option>';
            }
            content += '</select>';
            $('#dvspeciality' + spcl_g + '').html(content);
        }
    },
    fnonloadgetSpecialityFailureCallback: function () {

    },
    fnsubmit: function (status) {
        debugger;
        $("#loader").show();
        if ($("#starttime").val() == "") {
            $("#loader").hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Please select start time.',
                button: "Ok",
            })
            return false;
        }
        if ($("#endtime").val() == "") {
            $("#loader").hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Please select end time.',
                button: "Ok",
            })
            return false;
        }
        if ($("#endtime").val() < $("#starttime").val()) {
            $("#loader").hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Start time should be greater than end time.',
                button: "Ok",
            })
            return false;
        }
        if ($("#doctorcount").val().length > 5) {
            $("#loader").hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Total calls count should not be greater than 5 digits.',
                button: "Ok",
            })
            return false;
        }
        if ($("#patientcount").val().length > 5) {
            $("#loader").hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Productive calls count should not be greater than 5 digits.',
                button: "Ok",
            })
            return false;
        }
        if ($("#Prescription").val().length > 8) {
            $("#loader").hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Total POB count should not be greater than 8 digits.',
                button: "Ok",
            })
            return false;
        }
        var header = [];
        var headerdet = {};
        var headerdet = {
            filledby: $("#filledby").val(),
            foruser: $("#ddluser").val(),
            startdate: $("#startdate").val(),
            starttime: $("#starttime").val(),
            endtime: $("#endtime").val(),
            camptype: $("#ddlActivity").val(),
            campsubtype: $("#ddlsubActivity").val(),
            Location: "",
            doctorcount: $("#doctorcount").val(),
            patientcount: $("#patientcount").val(),
            prescriptioncount: $("#Prescription").val()

        };
        header.push(headerdet)

        var Accompanist = [];
        var accomp = {};
        var accCode = $("select[name=additionalusers]").val();

        if (accCode != undefined) {
            for (var i = 0; i < accCode.length; i++) {
                var accomp = {
                    Accompanist_Code: accCode[i],
                };
                Accompanist.push(accomp)
            }
        }
        var docdetails = [];
        var doc = {};
        for (var i = 0; i < $(".docgrid").length; i++) {
            if ((DoctorEntryMode_g.toUpperCase() != "YES")) {
                if (isNaN(parseInt($("select[name='ddldoctor_" + (i + 1) + "']").val())) == true) {
                    $("#submit").show();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please enter valid Stockist name.',
                        button: "Ok",
                    });
                    // swal('info', 'Info', 'Please enter valid DOCTOR name');
                    return false;
                }
            }
            if (docdetails.length > 0) {
                var disjson = $.grep(docdetails, function (ele, index) {
                    return ele.Doctor_Code == $("select[name='ddldoctor_" + (i + 1) + "']").val();
                });
                if (disjson.length > 0) {
                    for (var f = 0; f < disjson.length; f++) {
                        if ($("select[name='ddldoctor_" + (f + 1) + "']").val() != null) {
                            if ($("select[name='ddldoctor_" + (f + 1) + "']").val() == disjson[f].Doctor_Code) {
                                $("#loader").hide();
                                swal({
                                    icon: "info",
                                    title: "Info",
                                    text: 'Same Stockist name could not be entered twice.',
                                    button: "Ok",
                                });
                                return false;
                            }
                        }
                    }
                }

            }
            /*if ($("#Prescription" + (i + 1) + "").val() != "" && $("#Prescription" + (i + 1) + "").val() != undefined) {
                if ($("#Prescription" + (i + 1) + "").val().length > 5) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Doctor Prescription should not be greater than 5 digits .',
                        button: "Ok",
                    })
                    return false;
                }
            }*/
            if (isNaN(parseInt($("select[name='ddldoctor_" + (i + 1) + "']").val())) == true) {
                var Doctor_Code = null;
            }
            else {
                var Doctor_Code = $("select[name='ddldoctor_" + (i + 1) + "']").val()
            }
            doc = {
                Doctor_Code: Doctor_Code,
                Doctor_Name: $("#ddldoctor_" + (i + 1) + "").val(),
                //Speciality_Code: $("#Speciality" + (i + 1) + "").val(''),
                Speciality_Code: 0,
                Prescription_Value: $("#Prescription" + (i + 1) + "").val(),
                Notes: $("#remarks" + (i + 1) + "").val()
            };
            if ($("select[name='ddldoctor_" + (i + 1) + "']").val() != null || $("#remarks" + (i + 1) + "").val() != "") {
                //if ($("select[name='ddldoctor_" + (i + 1) + "']").val() != null || $("#Speciality" + (i + 1) + "").val() != null || $("#Prescription" + (i + 1) + "").val() != "" || $("#remarks" + (i + 1) + "").val() != "") {
                if ($("#doctorgrid" + (i + 1) + "").is(":visible") == true) {
                    if ($("select[name='ddldoctor_" + (i + 1) + "']").val() == "" && $("#remarks" + (i + 1) + "").val() == "") {
                        //if ($("#ddldoctor_" + (i + 1) + "").val() == "" && ($("#Speciality" + (i + 1) + "").val() != null || $("#Prescription" + (i + 1) + "").val() != "" || $("#remarks" + (i + 1) + "").val() != "")) {
                        $("#loader").hide();
                        swal({
                            icon: "info",
                            title: "Info",
                            text: 'Please enter stockist name / remarks.',
                            button: "Ok",
                        });
                        return false;
                    }
                }
                /*if ($("select[name='ddldoctor_" + (i + 1) + "']").val() != null && ($("#Speciality" + (i + 1) + "").val() == -1 || $("#Speciality" + (i + 1) + "").val() == null)) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please enter Speciality.',
                        button: "Ok",
                    });
                    return false;
                }
                else {*/
                    if ($("#doctorgrid" + (i + 1) + "").is(":visible") == true && ($("select[name='ddldoctor_" + (i + 1) + "']").val() != null || $("select[name='ddldoctor_" + (i + 1) + "']").val() != "")) {
                        docdetails.push(doc);
                        $("#loader").hide();
                    }
                //}
            }
        }

        var patientdetails = [];
        var patient = {};
        /*for (var i = 0; i < $(".pgrid").length; i++) {
            if ($("#pvalue" + (i + 1) + "").val() != "" && $("#pvalue" + (i + 1) + "").val() != undefined) {
                if ($("#pvalue" + (i + 1) + "").val().length > 5) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Patient Prescription should not be greater than 5 digits .',
                        button: "Ok",
                    })
                    return false;
                }
            }
            patient = {
                Parameter_Value: $("#ddltype" + (i + 1) + "").val(),
                Patient_Name: $("#Patientname" + (i + 1) + "").val(),
                Age: $("#age" + (i + 1) + "").val(),
                Gender: $("#gender" + (i + 1) + "").val(),
                Total_Prescription_Value: $("#pvalue" + (i + 1) + "").val(),
                Notes: $("#notes" + (i + 1) + "").val()
            };
            if ($("#ddltype" + (i + 1) + "").val() != -1 || $("#ddltype" + (i + 1) + "").val() == undefined || $("#Patientname" + (i + 1) + "").val() != "" || $("#age" + (i + 1) + "").val() != 0 || $("#gender" + (i + 1) + "").val() != -1 || $("#pvalue" + (i + 1) + "").val() != "" || $("#notes" + (i + 1) + "").val() != "") {
                if (($("#ddltype" + (i + 1) + "").val() != -1 && $("#ddltype" + (i + 1) + "").val() != null) && $("#Patientname" + (i + 1) + "").val() == "") {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please enter patient name .',
                        button: "Ok",
                    })
                    return false;
                }
                if ($("#ddltype" + (i + 1) + "").val() != -1 && $("#ddltype" + (i + 1) + "").val() != null && $("#age" + (i + 1) + "").val() == "") {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please enter Age .',
                        button: "Ok",
                    })
                    return false;
                }
                if (($("#ddltype" + (i + 1) + "").val() != -1 && $("#ddltype" + (i + 1) + "").val() != null) && ($("#gender" + (i + 1) + "").val() == -1 || $("#gender" + (i + 1) + "").val() == "" || $("#gender" + (i + 1) + "").val() == null)) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please select Gender .',
                        button: "Ok",
                    })
                    return false;
                }
                else if (($("#ddltype" + (i + 1) + "").val() == -1 && $("#ddltype" + (i + 1) + "").val() != undefined) && (($("#Patientname" + (i + 1) + "").val() != "" || $("#age" + (i + 1) + "").val() != 0 || $("#gender" + (i + 1) + "").val() != -1 || $("#pvalue" + (i + 1) + "").val() != "" || $("#notes" + (i + 1) + "").val() != ""))) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please enter parameter value.',
                        button: "Ok",
                    })
                    return false;
                }
                else {
                    if ($("#patientgrid" + (i + 1) + "").is(":visible") == true && $("#ddltype" + (i + 1) + "").val() != null) {
                        patientdetails.push(patient);
                    }
                }
            }
        }*/

        var prescriptiondetails = [];
        var prescription = {};
        /*for (var i = 0; i < $(".pregrid").length; i++) {
            if (prescriptiondetails.length > 0) {
                var disjson = $.grep(prescriptiondetails, function (ele, index) {
                    return ele.Product_Code == $("select[name='ddlsku" + (i + 1) + "']").val();
                });
                if (disjson.length > 0) {
                    for (var i = 0; i < disjson.length; i++) {
                        if ($("select[name='ddlsku" + (i + 1) + "']").val() == disjson[i].Product_Code) {
                            $("#loader").hide();
                            swal({
                                icon: "info",
                                title: "Info",
                                text: 'Same product name cannot not be entered twice.',
                                button: "Ok",
                            })
                            return false;
                        }
                    }
                }

            }
            if ($("#noofprescriptions" + (i + 1) + "").val() != "" && $("#noofprescriptions" + (i + 1) + "").val() != undefined) {
                if ($("#noofprescriptions" + (i + 1) + "").val().length > 5) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Prescription qty should not be greater than 5 digits .',
                        button: "Ok",
                    })
                    return false;
                }
            }
            if ($("#noofprescriptionsValue" + (i + 1) + "").val() != "" && $("#noofprescriptionsValue" + (i + 1) + "").val() != undefined) {
                if ($("#noofprescriptionsValue" + (i + 1) + "").val().length > 5) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Prescription value should not be greater than 5 digits .',
                        button: "Ok",
                    })
                    return false;
                }
            }
            prescription = {
                Product_Code: $("select[name='ddlsku" + (i + 1) + "']").val(),
                No_of_Prescriptions: $("#noofprescriptions" + (i + 1) + "").val(),
                No_of_PrescriptionValue: $("#noofprescriptionsValue" + (i + 1) + "").val(),
                Notes: $("#note" + (i + 1) + "").val()
            };
            if ($("select[name='ddlsku" + (i + 1) + "']").val() != null || $("select[name='ddlsku" + (i + 1) + "']").val() != undefined || $("#noofprescriptions" + (i + 1) + "").val() != "" || $("#noofprescriptionsValue" + (i + 1) + "").val() != "" || $("#note" + (i + 1) + "").val() != "") {
                if (($("select[name='ddlsku" + (i + 1) + "']").val() == null && $("select[name='ddlsku" + (i + 1) + "']").val() != undefined) && ($("#noofprescriptions" + (i + 1) + "").val() != "" || $("#noofprescriptionsValue" + (i + 1) + "").val() != "" || $("#note" + (i + 1) + "").val() != "")) {
                    $("#loader").hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please enter Product Name.',
                        button: "Ok",
                    })
                    return false;
                }
                else {
                    if ($("#prescriptiongrid" + (i + 1) + "").is(":visible") == true && $("select[name='ddlsku" + (i + 1) + "']").val() != null) {
                        prescriptiondetails.push(prescription);
                    }
                }
            }
        }*/

        var objdieticianreprting = {
            CompanyCode: DieticianAPPReporting.defaults.companyCode,
            RegionCode: RegionCode,
            UserCode: UserCode,
            headerid: headerid,
            DCR_Date: dcrdate,
            status: status,
            latitude: DieticianAPPReporting.defaults.latitude,
            longitude: DieticianAPPReporting.defaults.longitude,
            header: header,
            Accompanist: Accompanist,
            docdetails: docdetails,
            patientdetails: patientdetails,
            prescriptiondetails: prescriptiondetails
        };

        Method_params = ["DieticianReporting/InsertAPPDieticianReporting", DieticianAPPReporting.defaults.companyCode, RegionCode, UserCode, headerid, dcrdate, status, DieticianAPPReporting.defaults.latitude, DieticianAPPReporting.defaults.longitude];
        CoreREST.post(null, Method_params, objdieticianreprting, DieticianAPPReporting.BindpostSuccessData, DieticianAPPReporting.BindpostFailure);
    },
    BindpostSuccessData: function (response) {
        debugger;
        $("#loader").hide();
        $("#save").hide();
        $("#submit").hide();
        if (response == "Success") {
            swal({
                icon: "success",
                title: "Success",
                text: 'Saved successfully.Please click on back arrow to go back.',
                button: "Ok",
            });
        }
        else {
            swal({
                icon: "info",
                title: "Info",
                text: response,
                button: "Ok",
            });
        }
    },
    BindpostFailure: function () {

    },
    fngetDieticiandata: function () {
        var details = DieticianAPPReporting.defaults.companyCode + '/' + RegionCode + '/' + headerid;
        RPAREST.requestInvoke("DieticianReporting/GetAPPDieticianReportingdetails", details, null, "GET", DieticianAPPReporting.fngetDieticiandataSuccessCallback, DieticianAPPReporting.fngetDieticiandataFailureCallback, null);
    },
    fngetDieticiandataSuccessCallback: function (response) {
        debugger;
        if (response != null) {
            resp_g = response;
            if (response.list.lstheaderdetails[0].status == 1) {
                $("#save").hide();
                $("#submit").hide();
                $("#ddluser").val(response.list.lstheaderdetails[0].User_Code).attr('disabled', true);
                var a = response.list.lstheaderdetails[0].Start_date.split("T");
                var b = a[0].split("/");
                $("#startdate").val(b).attr('disabled', true);
                $("#starttime").val(response.list.lstheaderdetails[0].Start_Time).attr('disabled', true);
                $("#endtime").val(response.list.lstheaderdetails[0].End_Time).attr('disabled', true);
                if (response.list.lstheaderdetails[0].Noofdoctors != 0) {
                    $("#doctorcount").val(response.list.lstheaderdetails[0].Noofdoctors).attr('disabled', true);
                }
                else {
                    $("#doctorcount").val("");
                }
                if (response.list.lstheaderdetails[0].Noofpatients != 0) {
                    $("#patientcount").val(response.list.lstheaderdetails[0].Noofpatients).attr('disabled', true);
                }
                else {
                    $("#patientcount").val("");
                }
                if (response.list.lstheaderdetails[0].Noofprescriptions != 0) {
                    $("#Prescription").val(response.list.lstheaderdetails[0].Noofprescriptions).attr('disabled', true);
                }
                else {
                    $("#Prescription").val("");
                }
                if (response.list.lstheaderdetails[0].User_Code != 0) {
                    rcode = response.list.lstheaderdetails[0].User_Code;
                    DieticianAPPReporting.fngetdocdetails(1, rcode);
                    DieticianAPPReporting.fngetParametertype();
                    //DieticianAPPReporting.fngetskudetails(k, rcode);
                }
                if (response.list.lstAccompdetails.length > 0) {
                    var lstarr = [];
                    for (var i = 0; i < response.list.lstAccompdetails.length; i++) {
                        lstarr.push(response.list.lstAccompdetails[i].Accompanist_Code);
                    }
                    var msObject = document.getElementById("additionalusers").ej2_instances[0];
                    msObject.value = lstarr;
                }

                /*if (response.list.lstpatientdetails.length > 0) {
                    for (var i = 0; i < response.list.lstpatientdetails.length; i++) {
                        $("#ddltype" + (i + 1) + "").val(response.list.lstpatientdetails[i].Parameter_Value).attr('disabled', true);
                        $("#Patientname" + (i + 1) + "").val(response.list.lstpatientdetails[i].Patient_Name).attr('disabled', true);
                        if (response.list.lstpatientdetails[i].Age != 0) {
                            $("#age" + (i + 1) + "").val(response.list.lstpatientdetails[i].Age).attr('disabled', true);
                        }
                        else {
                            $("#age" + (i + 1) + "").val("");
                        }
                        $("#gender" + (i + 1) + "").val(response.list.lstpatientdetails[i].Gender).attr('disabled', true);
                        if (response.list.lstpatientdetails[i].Total_Prescription_Value != 0) {
                            $("#pvalue" + (i + 1) + "").val(response.list.lstpatientdetails[i].Total_Prescription_Value).attr('disabled', true);
                        }
                        else {
                            $("#pvalue" + (i + 1) + "").val("");
                        }
                        $("#notes" + (i + 1) + "").val(response.list.lstpatientdetails[i].Notes).attr('disabled', true);
                        DieticianAPPReporting.fnaddpatient((i + 1));
                        $(".plusminus").hide();

                    }
                }*/

                if (resp_g != null) {
                    if (resp_g.list.lstdoctordetails.length > 0) {
                        var lstdoct = [];
                        for (var i = 0; i < resp_g.list.lstdoctordetails.length; i++) {
                            var doctcode = resp_g.list.lstdoctordetails[i].Doctor_Code;
                            var msObject = document.getElementById("ddldoctor_" + (i + 1) + "").ej2_instances[0];
                            msObject.value = doctcode;
                            $("#ddldoctor_" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Doctor_Name)
                            //$("#Speciality" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Speciality_Code).attr('disabled', true);
                            if (resp_g.list.lstdoctordetails[i].Prescription_Value != 0) {
                                $("#Prescription" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Prescription_Value).attr('disabled', true);
                            }
                            else {
                                $("#Prescription" + (i + 1) + "").val("");
                            }
                            $("#remarks" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Notes).attr('disabled', true);
                            DieticianAPPReporting.fnadddoctor((i + 1));
                            $(".plusminus").hide();

                        }
                    }
                }
                /*if (resp_g != null) {
                    if (resp_g.list.lstprescriptiondetails.length > 0) {
                        for (var i = 0; i < resp_g.list.lstprescriptiondetails.length; i++) {
                            var skucode = resp_g.list.lstprescriptiondetails[i].Product_Code;
                            var msObject = document.getElementById("ddlsku" + (i + 1) + "").ej2_instances[0];
                            msObject.value = skucode;
                            if (resp_g.list.lstprescriptiondetails[i].No_of_Prescriptions != 0) {
                                $("#noofprescriptions" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].No_of_Prescriptions).attr('disabled', true);
                            }
                            else {
                                $("#noofprescriptions" + (i + 1) + "").val("");
                            }
                            if (resp_g.list.lstprescriptiondetails[i].No_of_PrescriptionValue != 0) {
                                $("#noofprescriptionsValue" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].No_of_PrescriptionValue).attr('disabled', true);
                            }
                            else {
                                $("#noofprescriptionsValue" + (i + 1) + "").val("");
                            }
                            $("#note" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].Notes).attr('disabled', true);
                            DieticianAPPReporting.fnaddprescription((i + 1));
                            $(".plusminus").hide();

                        }
                    }
                }*/
            }
            else {
                $("#ddluser").val(response.list.lstheaderdetails[0].User_Code);
                var a = response.list.lstheaderdetails[0].Start_date.split("T");
                var b = a[0].split("/");
                $("#startdate").val(b);
                $("#starttime").val(response.list.lstheaderdetails[0].Start_Time);
                $("#endtime").val(response.list.lstheaderdetails[0].End_Time);
                if (response.list.lstheaderdetails[0].Noofdoctors != 0) {
                    $("#doctorcount").val(response.list.lstheaderdetails[0].Noofdoctors);
                }
                else {
                    $("#doctorcount").val("");
                }
                if (response.list.lstheaderdetails[0].Noofpatients != 0) {
                    $("#patientcount").val(response.list.lstheaderdetails[0].Noofpatients);
                }
                else {
                    $("#patientcount").val("");
                }
                if (response.list.lstheaderdetails[0].Noofprescriptions != 0) {
                    $("#Prescription").val(response.list.lstheaderdetails[0].Noofprescriptions);
                }
                else {
                    $("#Prescription").val("");
                }
                if (response.list.lstheaderdetails[0].User_Code != 0) {
                    rcode = response.list.lstheaderdetails[0].User_Code;
                    DieticianAPPReporting.fngetdocdetails(1, rcode);
                    DieticianAPPReporting.fngetParametertype();
                    //DieticianAPPReporting.fngetskudetails(k, rcode);
                }
                if (response.list.lstAccompdetails.length > 0) {
                    var lstarr = [];
                    for (var i = 0; i < response.list.lstAccompdetails.length; i++) {
                        lstarr.push(response.list.lstAccompdetails[i].Accompanist_Code);
                    }
                    var msObject = document.getElementById("additionalusers").ej2_instances[0];
                    msObject.value = lstarr;
                }

                /*if (response.list.lstpatientdetails.length > 0) {
                    for (var i = 0; i < response.list.lstpatientdetails.length; i++) {
                        $("#ddltype" + (i + 1) + "").val(response.list.lstpatientdetails[i].Parameter_Value);
                        $("#Patientname" + (i + 1) + "").val(response.list.lstpatientdetails[i].Patient_Name);
                        if (response.list.lstpatientdetails[i].Age != 0) {
                            $("#age" + (i + 1) + "").val(response.list.lstpatientdetails[i].Age);
                        }
                        else {
                            $("#age" + (i + 1) + "").val("");
                        }
                        $("#gender" + (i + 1) + "").val(response.list.lstpatientdetails[i].Gender);
                        if (response.list.lstpatientdetails[i].Total_Prescription_Value != 0) {
                            $("#pvalue" + (i + 1) + "").val(response.list.lstpatientdetails[i].Total_Prescription_Value);
                        }
                        else {
                            $("#pvalue" + (i + 1) + "").val("");
                        }
                        $("#notes" + (i + 1) + "").val(response.list.lstpatientdetails[i].Notes);
                        DieticianAPPReporting.fnaddpatient((i + 1));
                    }
                }*/

                if (resp_g != null) {
                    if (resp_g.list.lstdoctordetails.length > 0) {
                        var lstdoct = [];
                        for (var i = 0; i < resp_g.list.lstdoctordetails.length; i++) {
                            var doctcode = resp_g.list.lstdoctordetails[i].Doctor_Code;
                            var msObject = document.getElementById("ddldoctor_" + (i + 1) + "").ej2_instances[0];
                            msObject.value = doctcode;
                            $("#ddldoctor_" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Doctor_Name);
                            //$("#Speciality" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Speciality_Code);
                            if (resp_g.list.lstdoctordetails[i].Prescription_Value != 0) {
                                $("#Prescription" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Prescription_Value);
                            }
                            else {
                                $("#Prescription" + (i + 1) + "").val("");
                            }
                            $("#remarks" + (i + 1) + "").val(resp_g.list.lstdoctordetails[i].Notes);
                            DieticianAPPReporting.fnadddoctor((i + 1));
                        }
                    }
                }
                /*if (resp_g != null) {
                    if (resp_g.list.lstprescriptiondetails.length > 0) {
                        for (var i = 0; i < resp_g.list.lstprescriptiondetails.length; i++) {
                            var skucode = resp_g.list.lstprescriptiondetails[i].Product_Code;
                            var msObject = document.getElementById("ddlsku" + (i + 1) + "").ej2_instances[0];
                            msObject.value = skucode;
                            if (resp_g.list.lstprescriptiondetails[i].No_of_Prescriptions != 0) {
                                $("#noofprescriptions" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].No_of_Prescriptions);
                            }
                            else {
                                $("#noofprescriptions" + (i + 1) + "").val("");
                            }
                            if (resp_g.list.lstprescriptiondetails[i].No_of_PrescriptionValue != 0) {
                                $("#noofprescriptionsValue" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].No_of_PrescriptionValue);
                            }
                            else {
                                $("#noofprescriptionsValue" + (i + 1) + "").val("");
                            }
                            $("#note" + (i + 1) + "").val(resp_g.list.lstprescriptiondetails[i].Notes);
                            DieticianAPPReporting.fnaddprescription((i + 1));
                        }
                    }
                }*/
            }

        }
    },
    fngetDieticianReportingdetailsFailure: function () {

    },
    isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },
    isNumberKey: function (evt, obj) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        var value = obj.value;
        var dotcontains = value.indexOf(".") != -1;
        if (dotcontains)
            if (charCode == 46) return false;
        if (charCode == 46) return true;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },
    fnback: function () {
        $('#main').load('../HiDoctor_Activity/DieticianReporting/DieticianAPPLanding/?dcrActualDate=' + dcrdate);
    },
}