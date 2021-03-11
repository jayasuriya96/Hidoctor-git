
var division_g
function fnGetDivision() {
    $.ajax({
        url: '../HiDoctor_Master/DoctorCategoryMaster/GetDivisionName',
        type: "POST",
        success: function (JsonResult) {
            division_g = JsonResult;
            if (division_g != null) {
                if (division_g.length > 0) {
                    fnAddOptionToSelect("ddlDivision", "-Select Division-", "0");
                    for (var di = 0; di < division_g.length; di++) {
                        fnAddOptionToSelect("ddlDivision", division_g[di].Division_Name, division_g[di].Division_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlDivision", "-No Division-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlDivision", "-No Division-", "0");
            }
        },
        error: function () {
            fnMsgAlert("Get Divisions failed.")
        }
    });
}

function fnAddOptionToSelect(id, text, value) {
    if ($.msie) {
        var option = document.createElement('option');
        jQuery(option).appendTo('#' + id);
        option.text = text;
        option.value = value;
    }
    else {
        $('#' + id).append("<option value='" + value + "'>" + text + "</option>");
    }
}

function fnGetDoctorCategoryDetails() {
    $.ajax({
        url: '../HiDoctor_Master/DoctorCategoryMaster/GetDoctorCatgegory',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divdoccategory").html(result);
            }
        }
    });
}

function fnEdit(obj) {
    if (obj.id != null) {
        var tblcategorycode = obj.id.replace('E', 'Category_Code');
        var tblcategoryname = obj.id.replace('E', 'Category_Name');
        var tblvisitcount = obj.id.replace('E', 'Visit_Count');
        var tbldoctorcount = obj.id.replace('E', 'Doctor_Count');
        var tbldivisionCode = obj.id.replace('E', 'Division_Code');
        var tbldivisionanme = obj.id.replace('E', 'Division_Name');
        var tbleffectivefrom = obj.id.replace('E', 'Effective_From');
        var tbleffectiveto = obj.id.replace('E', 'Effective_To');

        var Categorycodeval = $("#" + tblcategorycode).text();
        var categoryname = $("#" + tblcategoryname).text();
        var visitcount = $("#" + tblvisitcount).text();
        var divisionCode = $("#" + tbldivisionCode).text();
        var doctorcount = $("#" + tbldoctorcount).text();
        var divisioname = $("#" + tbldivisionanme).text();
        var effectivefrom = $("#" + tbleffectivefrom).text();
        var effectiveto = $("#" + tbleffectiveto).text();

        $("#txtcategoryname").focus();
        $('#hdndoccategoryval').val(Categorycodeval);
        $("#txtcategoryname").val(categoryname);
        $("#txtvisitcount").val(visitcount);
        $("#txtdoctcount").val(doctorcount);
        $("#hdnDivisionCode").val(divisionCode);
        $("#ddlDivision").val(divisionCode);
        $("#txtFromDate").val(effectivefrom);
        $("#txtToDate").val(effectiveto);

        $("#btnsave").val('Update');
        $("#hdnMode").val("E");
    }
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Status');
        var tblcategorycode = obj.id.replace('C', 'Category_Code');
        var status = $("#" + tblchange).text();
        var Categorycode = $("#" + tblcategorycode).text();
        $.ajax({
            url: '../HiDoctor_Master/DoctorCategoryMaster/ChangestatusforDoctorCategoryMaster',
            type: "POST",
            data: { 'status': status, 'doctorCategoryCode': Categorycode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'somethinf went wrong');
                }
                fnGetDoctorCategoryDetails();
            }
        });
    }
}

function fnClearAll() {
    $("#txtcategoryname").val('');
    $("#txtvisitcount").val('');
    $("#txtdoctcount").val('');
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $("#ddlDivision").val('0');
    $("#ddlDivision option:selected").selectindex = "";
    $("#btnsave").attr("disabled", false);
    $("#btnsave").attr("disabled", false);
    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
    else {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
   
}

function fnSubmit() {
    var result = fnsubvalidate();
    if (result) {
        $("#btnsave").attr("disabled", true);
        $("#btnsave").attr("disabled", true);
        var CategoryName = $.trim($("#txtcategoryname").val());        
        var DoctorCount = $.trim($("#txtdoctcount").val());
        var VisitCount = $.trim($("#txtvisitcount").val())
        var DivisionName = $("#ddlDivision option:selected").val();
        var EffectiveFromdate = $("#txtFromDate").val();       

        var day = $("#txtFromDate").val().split('/')[0];
        var month = $('#txtFromDate').val().split('/')[1];
        var year = $('#txtFromDate').val().split('/')[2];
        var EffectiveFrom = year + '-' + month + '-' + day;

        var day = $("#txtToDate").val().split('/')[0];
        var month = $('#txtToDate').val().split('/')[1];
        var year = $('#txtToDate').val().split('/')[2];
        var EffectiveTo = year + '-' + month + '-' + day;

        $.ajax({
            url: '../HiDoctor_Master/DoctorCategoryMaster/InsertandUpdateforDoctorcategoryMaster',
            type: "POST",
            data: {
                'CategoryName': CategoryName, 'VisitCount': VisitCount, 'DoctorCount': DoctorCount,

                'divisionCode': DivisionName, 'EffectiveFrom': EffectiveFrom, 'EffectiveTo': EffectiveTo, 'mode': $("#hdnMode").val(), 'Doccategotycodeval': $("#hdndoccategoryval").val()
            },
            success: function (data) {
                if(data != '')
                {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#txtcategoryname").val('');
                            $("#txtvisitcount").val('');
                            $("#txtdoctcount").val('');
                            $("#txtFromDate").val('');
                            $("#txtToDate").val('');
                            $("#ddlDivision").val('0');
                            $("#hdndoccategoryval").val('');

                            $("#btnsave").val('Save');  //Button Value Change From Update To Save
                            $("#hdnMode").val("I");
                            fnGetDoctorCategoryDetails();
                            $("#btnsave").attr("disabled", false);
                            $("#btnsave").attr("disabled", false);
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                            $("#btnsave").attr("disabled", false);
                            $("#btnsave").attr("disabled", false);
                        }
                    }
                    
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Something went Wrong');
                    $("#btnsave").attr("disabled", false);
                    $("#btnsave").attr("disabled", false);
                }
            }
        });
    }
}

function fnsubvalidate() {
    if ($.trim($("#txtcategoryname").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please enter The Category Name');
        return false;
    }

    if ($.trim($("#txtcategoryname").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Enter The Category Name');
        return false;
    }

    if ($.trim($("#txtvisitcount").val()) == "" || $.trim($("#txtvisitcount").val()) == "0") {
        fnMsgAlert('info', 'Info', 'Please enter The Visit Count');
        return false;
    }
   
    if ($.trim($("#txtvisitcount").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please enter The Visit Count');
        return false;
    }
    
    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Enter the Effective From Date');
        return false;
    }


    if ($.trim($("#txtToDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Enter The Effective To Date');
        return false;
    }

    if (!(isNaN($("#txtcategoryname").val()))) {
        fnMsgAlert('info', 'Info', 'Please Enter The valid Category Name');
        return false;
    }   

    if (!regExforAlphaNumeric($("#txtcategoryname").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Category Name');
        return false;
    }

    if ($.trim($("#txtcategoryname").val()).length > 50) {
        fnMsgAlert('info', 'Info', 'Category Name should not exceed 50 Characters');
        return false;
    }

    //int range check
    $("#txtvisitcount").blur(function () {
        if ($(this).val() != "") {
            if (fnCheckSmallInt(this)) {
                var value = parseInt($(this).val());
                $(this).val(value);
            }
        }
    });

    $("#txtdoctcount").blur(function () {
        if ($(this).val() != "") {
            if (fnCheckSmallInt(this)) {
                var value = parseInt($(this).val());
                $(this).val(value);
            }
        }
    });

    $("#txtvisitcount").blur(function () {
        if ($(this).val() != "") {
            if (fnCheckInt(this)) {
                var value = parseInt($(this).val());
                $(this).val(value);
            }
        }
    });

    $("#txtdoctcount").blur(function () {
        if ($(this).val() != "") {
            if (fnCheckInt(this)) {
                var value = parseInt($(this).val());
                $(this).val(value);
            }
        }
    });

    //numeric value check   

    if (isNaN($("#txtvisitcount").val())) {
        fnMsgAlert('info', 'Info', 'Please Enter the Numeric Value For Visit Count');
        return false;
    }

    if (isNaN($("#txtdoctcount").val())) {
        fnMsgAlert('info', 'Info', 'Please Enter the Numeric Value For Doctor Count');
        return false;
    }
    if (parseInt($("#txtvisitcount").val()) < 0) {
        fnMsgAlert('info', 'Info', 'Negative numbers are not allowed for Visit Count.');
        return false;
    }

    if (parseInt($("#txtdoctcount").val()) < 0) {
        fnMsgAlert('info', 'Info', 'Negative numbers are not allowed for Doctor Count.');
        return false;
    }

    if ($.trim($("#txtvisitcount").val()).length > 2) {
        fnMsgAlert('info', 'Info', 'Visit Count Lenth size should not exceed 2');
        return false;
    }

    if ($.trim($("#txtdoctcount").val()).length > 4) {
        fnMsgAlert('info', 'Info', 'Doctor Count length size should not exceed 4');
        return false;
    }    

    //Date Validation
    if (!(fnValidateDateFormate($("#txtFromDate"),"FromDate"))) {        
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"),"ToDate"))) {     
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'From Date Can not be Greater than the To Date');
        return false;
    }
    
    if ($("#hdnMode").val() == "I") {
        var DivisioonCode = $("#ddlDivision option:selected").val();
        var CategoryName = $.trim($("#txtcategoryname").val().toUpperCase());
        if (DivisioonCode == '0') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Category_Name" + i).html().toUpperCase() == CategoryName) {
                        fnMsgAlert('info', 'Info', 'CategoryName Already Exists');
                        return false;
                    }
                }
            }
        }
        else {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Category_Name" + i).html().toUpperCase() == CategoryName && $("#Division_Code" + i).html() == DivisioonCode) {
                        fnMsgAlert('info', 'Info', 'CategoryName Already Exists for The Division');
                        return false;
                    }
                }
            }

        }
    }

    if ($("#hdnMode").val() == "E") {
        var DivisioonCode = $.trim($("#hdnDivisionCode").val());
        var CategoryName = $.trim($("#txtcategoryname").val().toUpperCase());
        var CategoryCode = $.trim($("#hdndoccategoryval").val());
        if (DivisioonCode == '0') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i < $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Category_Name" + i).html().toUpperCase() == CategoryName && $("#Category_Code" + i).html() != CategoryCode) {
                        fnMsgAlert('info', 'Info', 'CategoryName Already Exists');
                        return false;
                    }
                }
            }
        }
        else {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i < $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Category_Name" + i).html().toUpperCase() == CategoryName && $("#Division_Code" + i).html() == DivisioonCode && $("#Category_Code" + i).html() != CategoryCode) {
                        fnMsgAlert('info', 'Info', 'CategoryName Already Exists for The Division');
                        return false;
                    }
                }
            }
        }
    }
return true;
}