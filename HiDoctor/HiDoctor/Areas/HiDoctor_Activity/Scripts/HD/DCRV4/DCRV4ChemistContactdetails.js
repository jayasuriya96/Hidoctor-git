var dcrActualDate_g;
var ChemistContactAutoFill_g = new Array();
var ChemistCategoryAutoFill_g = new Array();
var categoryId = "";
var catlst = "";
var mobres = "";
var emailres = "";
var Contact = {
    defaults: {
        "formMode_g": "",
        "gridRowNo_g": "0",
        "dcrDoctorVisit_g": "",
        "FollowUpRowIndex_gl": "0"

    },
    initializing: function () {
        Contact.fngetbusinesscategory();
        Contact.fnAddContacts(null);
    },

    fnAddContacts: function (curObj, isDraft) {
        debugger;
        var id = 0;
        if (curObj != null)
            id = parseInt(curObj.id.split('_')[3]);
        else if (isDraft == null) {
            $("#tbl_DoctorContactDetails_Chemist tbody").html('');
        }
        else if (isDraft > 0) {
            id = isDraft;
        }
        var row = "<tr><td style='width: 40%;'><input style='position: relative;width: 89%;' class='autoChemistcontact' id='txt_Chemistcontact_Name_" + (id + 1) + "' type='text' ondblclick='Contact.fnAddContacts(this)'  onkeyup='Contact.fnAddHospitalContactRow(this)'  onblur='Contact.fnonchangeChemistcontact(this);'/>";//onblur=' HospitalVisit.fnValidateContact(this)'
        row += "<input type='hidden' id='hdnChemistcontact_Code_" + (id + 1) + "' /></td>";
        row += "<td><div id='divmobile_" + (id + 1) + "'><input class='numbersOnly' type='number' id='txtChemistmobile_" + (id + 1) + "' /></div></td>";
        row += "<td><div id='divemail_" + (id + 1) + "'><input type='text' id='txtChemistemail_" + (id + 1) + "' /></div></td>";
        row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="Contact.fnDeletecontact(this)"/> </td>';
        row += "</tr>";

        $("#tbl_DoctorContactDetails_Chemist").append(row);
        autoComplete(ChemistContactAutoFill_g, "txt_Chemistcontact_Name_", "hdnChemistcontact_Code_", "autoChemistcontact");
        for (var i = 1; i < $("#tbl_DoctorContactDetails_Chemist tr").length - 1; i++) {
            $("#tbl_DoctorContactDetails_Chemist tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("onkeyup");
            $("#tbl_DoctorContactDetails_Chemist tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("ondblclick");
        }

    },

    fnDeletecontact: function (curObj) {
        debugger;
        var index = $(curObj).parent().parent().index() + 1;
        var tblIndex = $("#tbl_DoctorContactDetails_Chemist tbody tr").length;
        if (index == tblIndex) {
            fnMsgAlert('info', docActivityTitle, 'You are not allowed to delete this row!');
        }
        else {
            $(curObj).parent().parent().remove();
        }
    },
    fngetbusinesscategory: function () {
        debugger;
        Method_params = ["DCRChemist/GetChemistBusinessCategory", CompanyCode];
        CoreREST.get(null, Method_params, null, Contact.BindChemistCategorySuccessData, Contact.BindChemistCategoryFailure);
    },
    BindChemistCategorySuccessData: function (response) {
        catlst = response.list;
    },
    BindChemistCategoryFailure: function () {

    },
    fngetcontact: function () {
        debugger;
        if ($("#hdnChemistCode").val() == "") {
            var ChemistCode = 0;
        }
        else {
            var ChemistCode = $("#hdnChemistCode").val();
        }
        Method_params = ["DCRChemist/GetChemistContact", CompanyCode, ChemistCode, RegionCode];
        CoreREST.get(null, Method_params, null, Contact.BindContactSuccessData, Contact.BindContactFailure);
    },
    BindContactSuccessData: function (response) {
        debugger;
        ChemistContactAutoFill_g = response.list.lstContact;
        ChemistCategoryAutoFill_g = response.list.lstCategory;
        if (ChemistCategoryAutoFill_g.length>0) {
            categoryId = ChemistCategoryAutoFill_g[0].Business_Category_Id;
            if (categoryId != 0) {
                var categorylist = jsonPath(catlst, "$.[?(@.Business_Category_Id=='" + categoryId + "')]");
            }
            if (categorylist != undefined) {
                $('select option[value="' + categorylist[0].Business_Category_Id + '"]').attr("selected", true);
                $("#bCategory").attr("disabled", "disabled")
            }
            else {
                $("#bCategory").prop("disabled", false);
            }
        }
        else {
            $("#bCategory").prop("disabled", false);
        }
     
        autoComplete(ChemistContactAutoFill_g, "txt_Chemistcontact_Name_", "hdnChemistcontact_Code_", "autoChemistcontact");
    },
    BindContactFailure: function () {

    },
    fnonchangeChemistcontact: function (curObj) {
        debugger;
        if (curObj != null) {
            id = parseInt(curObj.id.split('_')[3]);
        }
        var Contactdetails = $.grep(ChemistContactAutoFill_g, function (element, index) {
            return element.value == $("#hdnChemistcontact_Code_" + id + "").val();
        });

        $("#txtChemistmobile_" + id + "").val(Contactdetails[0].Mobile);
        $("#txtChemistemail_" + id + "").val(Contactdetails[0].Email_Id);
        if ($("#txtChemistmobile_" + id + "") != "") {
            $("#txtChemistmobile_" + id + "").attr('disabled', true);
        }
        else {
            $("#txtChemistmobile_" + id + "").attr('disabled', false);
        }
        if ($("#txtChemistemail_" + id + "") != "") {
            $("#txtChemistemail_" + id + "").attr('disabled', true);
        }
        else {
            $("#txtChemistemail_" + id + "").attr('disabled', false);
        }
    },
    fnValidateMobileNumber: function (obj) {
        debugger;
        if ($.trim(obj) != '' && $.trim(obj) != undefined) {
            var phoneNumberPattern = /^\d+$%/
          //  return phoneNumberPattern.test($.trim(obj));
            if (phoneNumberPattern.test($.trim(obj))==false) {
               // fnMsgAlert('info', 'Chemist', 'Invalid Mobile Pattern');
                mobres = false;
                return false;
            }
        }
        mobres = true;
        return true;
    },
    validateEmail: function (emailField) {
        debugger;
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (emailField != "" && emailField != undefined) {
            if (reg.test(emailField) == false) {
                //fnMsgAlert('info', 'Chemist', 'Invalid Email Address');
                emailres = false
                return false;
            }

        }
        emailres = true
        return true;

    },
    fnGetContactlist: function () {
        debugger;
        var Chemist_Contact = new Array();
        var tblContactLength = $('#tbl_DoctorContactDetails_Chemist tbody tr').length;
        if (tblContactLength > 0) {
            for (var i = 0; i < tblContactLength; i++) {
                var ChemistContact = {};
                ChemistContact.Contact_Name = $("#txt_Chemistcontact_Name_" + (i+1) + "").val();
                ChemistContact.Contact_Id = $("#hdnChemistcontact_Code_" + (i + 1) + "").val();
                ChemistContact.Mobile = $("#txtChemistmobile_" + (i + 1) + "").val();
                ChemistContact.Email_Id = $("#txtChemistemail_" + (i + 1) + "").val();
                
                if ($("#txt_Chemistcontact_Name_" + (i + 1) + "").val() != undefined && $("#txt_Chemistcontact_Name_" + (i + 1) + "").val() != "") {
                    Chemist_Contact.push(ChemistContact);
                }
             
            }
           
            return Chemist_Contact;
        }
        else {
            return false;
        }
    },
    fnClear: function () {
        Contact.fnAddContacts(null);
    },
    fnBindContactDetails: function (obj) {
        debugger;
        Contact.fngetcontact();
      //  Contact.fnAddContacts(null);
        for (var i = 0; i < obj.length; i++) {
            $("#txt_Chemistcontact_Name_" + (i+1) + "").val(obj[i].Contact_Name);
            $("#hdnChemistcontact_Code_" + (i + 1) + "").val(obj[i].Contact_Id);
            //$("#txtChemistmobile_" + i + "").val(obj[i].Mobile);
            //$("#txtChemistemail_" + i + "").val(obj[i].Email);
            if (obj[i].Contact_Id != 0) {
                $("#txtChemistmobile_" + (i + 1) + "").val(obj[i].Mobile).attr('disabled', true);
                $("#txtChemistemail_" + (i + 1) + "").val(obj[i].Email).attr('disabled', true);
            }
            else {
                $("#txtChemistmobile_" + (i + 1) + "").val(obj[i].Mobile);
                $("#txtChemistemail_" + (i + 1) + "").val(obj[i].Email);
            }
            Contact.fnAddContacts(null, (i + 1));
        }
    }
}