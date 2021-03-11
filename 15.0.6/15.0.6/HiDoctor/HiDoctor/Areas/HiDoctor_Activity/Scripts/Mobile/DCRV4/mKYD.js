var KYDLIST_STR = ' <li id="DOCLIST_KLNUM" data-unique="" data-primary="">';
KYDLIST_STR += '<div class="cls_fontbold"><span class="cls_Filled cls_displaynone"></span><span class="cls_Duplicate cls_displaynone"></span><span id="DocName_KLNUM"></span></div>';
/*KYDLIST_STR += '<div><span class="cls_padding"></span><label>MDL</label>:<span id="MDL_KLNUM"></span></div>';*/
KYDLIST_STR += '<div><span class="cls_padding"></span><span id="Region_KLNUM"></span></div>';
KYDLIST_STR += '<div><span class="cls_padding"></span><span id="Spec_KLNUM"></span></div>';
KYDLIST_STR += '</li>'
var WHOLENUMBERREGEX_g = new RegExp("^[0-9]+$");
var ALPHANUMERICREGX_g = new RegExp("^[a-zA-Z0-9 _]+$");
var SPECIAL_CHAR_REGEX_FOR_REGISTRATION = new RegExp(/^[a-zA-Z0-9-_()/']+$/);
var SPECIAL_CHAR_REGEX_FOR_LOCALAREA = new RegExp(/^[a-zA-Z0-9,&._() '-]+$/);
var SPECIAL_CHAR_REGEX_FOR_PLACE_TYPE = new RegExp(/^[a-zA-Z0-9._() '-]+$/);
var SPECIAL_CHAR_REGEX_FOR_EMAIL_ID = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
var ALLOEWD_SPECIAL_CHARACTERS = "-_()/";
var PLACE_TYPE = "Med. Council"
var PLACE_TYPE_ORI_NAME = "PLACE_TYPE"
var mKYD = {
    config: {
        DISPLAY_COLUMNS: "",
        MANDATORY_COLUMNS: "",
        DUPLICATECHECK_COLUMN: "",
    },
    Columns:
        {
            REGISTRATION_NO: "REGISTRATION_NO",
            LOCAL_AREA: "LOCAL_AREA",
            MOBILE: "MOBILE",
            PIN_CODE: "PIN_CODE",
            HOSPITAL_NAME: "HOSPITAL_NAME",
            MEDICAL_COUNCIL: "MEDICAL_COUNCIL",
            EMAIL_ID: "EMAIL_ID"
        },
    Data: {
        KYDOBJ: null,
    },
    Privileges:
        {
            KYD_MINIMUM_DOCTOR_ENTRY_PERCENTAGE: "0",
            SHOULD_BE_FILLED: 0,
        },
    init: function () {
        mKYD.fnGetKYDConfigValues();
        mKYD.fnGetDoctorListforKYD();
        $('#btn_Done').unbind("click").bind("click", function () { mKYD.fnUpdateKYDObj(); });
        $('#btn_Back').unbind("click").bind("click", function () { mKYD.fnBackToList(); });
        $('#btn_SaveList').unbind("click").bind("click", function () { mKYD.fnCheckDuplicateDB() });
        $('#btn_Skip').unbind("click").bind("click", function () { mKYD.fnGoToCalendar() });
        mKYD.Privileges.KYD_MINIMUM_DOCTOR_ENTRY_PERCENTAGE = fnGetPrivilegeValue("KYD_MINIMUM_DOCTOR_ENTRY_PERCENTAGE", "0")
        if (mKYD.Privileges.KYD_MINIMUM_DOCTOR_ENTRY_PERCENTAGE != "0") {
            var per = (parseInt(mKYD.Privileges.KYD_MINIMUM_DOCTOR_ENTRY_PERCENTAGE) * parseInt(mKYD.Data.KYDOBJ.length)) / parseInt(100)
            $('#spnperValue').html(Math.ceil(per));
            mKYD.Privileges.SHOULD_BE_FILLED = Math.ceil(per)
            $('#dvSkip').addClass('cls_displaynone');
            $('#dvInfo').removeClass("cls_displaynone");
        }
        else {
            $('#dvInfo').addClass("cls_displaynone");
            $('#dvSkip').removeClass('cls_displaynone');
        }
    },
    fnGetKYDConfigValues: function () {
        $.ajax({
            url: '/HiDoctor_Activity/DCRV4KYD/GetConfigurationValues',
            type: "POST",
            async: false,
            success: function (jsData) {
                if (jsData != null && jsData != '') {
                    var jsonforDesignation = jsData[0].configvalueforDesignation;
                    var jsonDisplaycolumn = jsData[0].Config_DisplayColumns;
                    var jsonMandatorycolumn = jsData[0].Config_MandatoryColumns;
                    var jsonDuplicatecheckvalue = jsData[0].Config_DuplicatecheckColumn;

                    mKYD.config.DISPLAY_COLUMNS = jsonDisplaycolumn.split(',');
                    mKYD.config.MANDATORY_COLUMNS = jsonMandatorycolumn.split(',');
                    mKYD.config.DUPLICATECHECK_COLUMN = jsonDuplicatecheckvalue.split(',')[0];
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });

    },

    fnGetDoctorListforKYD: function () {
        var KeyColumn = mKYD.config.DUPLICATECHECK_COLUMN;
        $.ajax({
            url: '/HiDoctor_Activity/DCRV4KYD/GetKYDDoctorJsonList',
            type: "POST",
            data: 'dcrDate=' + dcrDate_g + '&Key_Column=' + KeyColumn,
            async: false,
            success: function (jsData) {
                if (jsData != null && jsData != '') {
                    mKYD.Data.KYDOBJ = jsData;
                    mKYD.fnBuildKYDList(jsData);
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });
    },

    fnBuildKYDList: function (jKYDList) {  
        $('#ulDocList').html('');
        for (var i = 0; i < jKYDList.length; i++) {
            var index = i + 1;
            var string = KYDLIST_STR.replace(/KLNUM/g, index);

            $('#ulDocList').append(string);
            //$('#ulDocList').listview("refresh");

            var Doctor_Name = jKYDList[i].Doctor_Name;
            var Doctor_Code = jKYDList[i].Doctor_Code;
            var Region_Name = jKYDList[i].Region_Name;
            var Doctor_Region_Code = jKYDList[i].Doctor_Region_Code;
            var Spec_Name = jKYDList[i].Speciality_Name;
            var MDL = jKYDList[i].MDL_Number;
            var emailId = jKYDList[i].Email_Id;

            var isFilled = false;
            Doctor_Name = Doctor_Name + " (" + MDL + ")";
            if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == "EMAIL_ID") {
                if (jKYDList[i].Email_Id != null && jKYDList[i].Email_Id.length > 0) {
                    $('#DOCLIST_' + index).attr('data-unique', jKYDList[i].Email_Id);
                    isFilled = true;
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == "MOBILE") {
                if (jKYDList[i].Mobile != null && jKYDList[i].Mobile.length > 0) {
                    $('#DOCLIST_' + index).attr('data-unique', jKYDList[i].Mobile);
                    isFilled = true;
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == "REGISTRATION_NO") {
                if (jKYDList[i].Registration_No != null && jKYDList[i].Registration_No.length > 0) {
                    $('#DOCLIST_' + index).attr('data-unique', jKYDList[i].Registration_No);
                    isFilled = true;
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == "EMAIL_ID") {
                if (jKYDList[i].Email_Id != null && jKYDList[i].Email_Id.length > 0) {
                    $('#DOCLIST_' + index).attr('data-unique', jKYDList[i].Email_Id);
                    isFilled = true;
                }
            }
            $('#DOCLIST_' + index).attr('data-primary', Doctor_Code + "_" + Doctor_Region_Code);
            $('#DocName_' + index).html(Doctor_Name);
            $('#MDL_' + index).html(MDL);
            $('#Region_' + index).html(Region_Name);
            $('#Spec_' + index).html(Spec_Name);

            $("#DOCLIST_" + index).unbind("click").bind("click", function () { mKYD.fnShowEntryForm(this); });

            // is Filled based on config.
            if (isFilled) {
                $('#DOCLIST_' + index + ' .cls_Filled').removeClass('cls_displaynone')
            }
        }
        if ($('#ulDocList').hasClass("ui-listview")) {
            $('#ulDocList').listview("refresh");
        }
        else {
            $('#ulDocList').trigger('create');
        }
        mKYD.fnToggleListAndForm();
    },
    fnShowEntryForm: function (obj) {      
        var idnum = obj.id.split('_')[1];
        var docName = $('#DocName_' + idnum).html();
        var reginName = $('#Region_' + idnum).html();
        var Spec_Name = $('#Spec_' + idnum).html();
        var primary = obj.getAttribute("data-primary");
        // Bind the Values.

        mKYD.fnToggleListAndForm();

        mKYD.fnFilltheForm(docName, reginName, Spec_Name, primary);

        mKYD.fnShowColumns();
        var jobj = mKYD.Data.KYDOBJ;
        var region_Code = primary.split('_')[1];
        var Doctor_Code = primary.split('_')[0];
        for (var i = 0; i < jobj.length; i++) {
            if (jobj[i].Doctor_Code == Doctor_Code && jobj[i].Doctor_Region_Code == region_Code) {
                $('#txtEmail').val(jobj[i].Email_Id);
                $('#txtRegNo').val(jobj[i].Registration_No);
                $('#txtMobile').val(jobj[i].Mobile);
                $('#txtPinCode').val(jobj[i].Pin_Code);
                $('#txtHosName').val(jobj[i].Hospital_Name);
                $('#txtLocalArea').val(jobj[i].Local_Area);
                $('#txtMedCoun').val(jobj[i].Medical_Council);
                break;
            }
        }
    },
    fnToggleListAndForm: function () {     
        if ($('#dvKYDList').hasClass('cls_displaynone')) {
            $('#dvKYDList').removeClass('cls_displaynone');
            $('#dvKYDEntryForm').addClass('cls_displaynone');
            mKYD.fnHighlightDuplicateStatus();
            mKYD.fnHighlightFilledStatus();
        }
        else {
            $('#dvKYDList').addClass('cls_displaynone');
            $('#dvKYDEntryForm').removeClass('cls_displaynone');
        }
    },
    fnShowColumns: function () {  
        var Display_Columns = mKYD.config.DISPLAY_COLUMNS;
        for (var i = 0; i < Display_Columns.length; i++) {
            if (Display_Columns[i].toUpperCase() == mKYD.Columns.EMAIL_ID) {
                $('#dvEmail').removeClass("cls_displaynone");
            }
            else if (Display_Columns[i].toUpperCase() == mKYD.Columns.REGISTRATION_NO) {
                $('#dvRegNo').removeClass("cls_displaynone");
            }
            else if (Display_Columns[i].toUpperCase() == mKYD.Columns.MOBILE) {
                $('#dvMobile').removeClass("cls_displaynone");
            }
            else if (Display_Columns[i].toUpperCase() == mKYD.Columns.PIN_CODE) {
                $('#dvPinCode').removeClass("cls_displaynone");
            }
            else if (Display_Columns[i].toUpperCase() == mKYD.Columns.HOSPITAL_NAME) {
                $('#dvHosName').removeClass("cls_displaynone");
            }
            else if (Display_Columns[i].toUpperCase() == mKYD.Columns.LOCAL_AREA) {
                $('#dvLocalArea').removeClass("cls_displaynone");
            }
            else if (Display_Columns[i].toUpperCase() == PLACE_TYPE_ORI_NAME) {
                $('#dvMedCoun').removeClass("cls_displaynone");
            }
        }
    },
    fnFilltheForm: function (docName, region_Name, spec_Name, primary_Code) {
        $('#dvKYDEntryForm').attr("data-primary", primary_Code);
        $('#spndocName').html(docName);
        $('#spnRegionName').html(region_Name);
        $('#spnSpec').html(spec_Name);
        mKYD.fnShowMandatorySymbol();
        mKYD.fnClearForm();

    },
    fnClearForm: function () {
        $('#txtEmail').val('');
        $('#txtRegNo').val('')
        $('#txtMobile').val('');
        $('#txtPinCode').val('');
        $('#txtHosName').val('');
        $('#txtLocalArea').val('');
    },
    fnHighlightFilledStatus: function () {

    },
    fnHighlightDuplicateStatus: function () {  
        for (var d = 0; d < mKYD.Data.KYDOBJ.length; d++) {

            if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.MOBILE) {
                if (mKYD.Data.KYDOBJ[d].Mobile.length > 0) {
                    if ($('#ulDocList li[data-unique="' + mKYD.Data.KYDOBJ[d].Mobile + '"]').length > 1) {
                        $('#ulDocList li[data-unique="' + mKYD.Data.KYDOBJ[d].Mobile + '"] .cls_Duplicate').removeClass('cls_displaynone');
                    }
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.REGISTRATION_NO) {
                if (mKYD.Data.KYDOBJ[d].Registration_No.length > 0) {
                    if ($('#ulDocList li[data-unique="' + mKYD.Data.KYDOBJ[d].Registration_No + '"]').length > 1) {
                        $('#ulDocList li[data-unique="' + mKYD.Data.KYDOBJ[d].Registration_No + '"] .cls_Duplicate').removeClass('cls_displaynone');
                    }
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.EMAIL_ID) {
                if (mKYD.Data.KYDOBJ[d].Email_Id.length > 0) {
                    if ($('#ulDocList li[data-unique="' + mKYD.Data.KYDOBJ[d].Email_Id + '"]').length > 1) {
                        $('#ulDocList li[data-unique="' + mKYD.Data.KYDOBJ[d].Email_Id + '"] .cls_Duplicate').removeClass('cls_displaynone');
                    }
                }
            }
        }
    },
    fnUpdateKYDObj: function () {     
        if (mKYD.fnValidateForm()) {
            if (mKYD.fnDuplicateValidation()) {
                var jobj = mKYD.Data.KYDOBJ;
                var Primary = $('#dvKYDEntryForm').attr('data-primary');
                var region_Code = Primary.split('_')[1];
                var Doctor_Code = Primary.split('_')[0];
                for (var i = 0; i < jobj.length; i++) {
                    if (jobj[i].Doctor_Code == Doctor_Code && jobj[i].Doctor_Region_Code == region_Code) {
                        jobj[i].Email_Id = $.trim($('#txtEmail').val());
                        jobj[i].Registration_No = $.trim($('#txtRegNo').val());
                        jobj[i].Mobile = $.trim($('#txtMobile').val());
                        jobj[i].Pin_Code = $.trim($('#txtPinCode').val());
                        jobj[i].Hospital_Name = $.trim($('#txtHosName').val());
                        jobj[i].Local_Area = $.trim($('#txtLocalArea').val());
                        jobj[i].Medical_Council = $.trim($('#txtMedCoun').val());
                        break;
                    }
                }
                mKYD.Data.KYDOBJ = jobj;
                mKYD.fnBuildKYDList(jobj);
                mKYD.fnHighlightDuplicateStatus();
            }
        }
    },
    fnShowMandatorySymbol: function () { 
        for (var i = 0; i < mKYD.config.MANDATORY_COLUMNS.length; i++) {
            if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.config.MANDATORY_COLUMNS[i]) {
                if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.MOBILE) {
                    $('#spnKeyMobile').removeClass('cls_displaynone');
                }
                else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.REGISTRATION_NO) {
                    $('#spnKeyRegNo').removeClass('cls_displaynone');
                }
                else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.EMAIL_ID) {
                    $('#spnKeyEmail').removeClass('cls_displaynone');
                }
                continue;
            }
            if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == mKYD.Columns.REGISTRATION_NO) {
                $('#spnMandRegNo').removeClass("cls_displaynone");
            }
            else if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == mKYD.Columns.LOCAL_AREA) {
                $('#spnMandLocalArea').removeClass("cls_displaynone");
            }
            else if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == mKYD.Columns.MOBILE) {
                $('#spnMandMobile').removeClass("cls_displaynone");
            }
            else if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == mKYD.Columns.PIN_CODE) {
                $('#spnMandPinCode').removeClass("cls_displaynone");
            }
            else if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == mKYD.Columns.HOSPITAL_NAME) {
                $('#spnMandHosName').removeClass("cls_displaynone");
            }
            else if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == PLACE_TYPE_ORI_NAME) {
                $('#spnMedCouncil').removeClass("cls_displaynone");
            }
            else if (mKYD.config.MANDATORY_COLUMNS[i].toUpperCase() == mKYD.Columns.EMAIL_ID) {
                $('#spnMandEmail').removeClass("cls_displaynone");
            }
        }
    },
    fnBackToList: function () {
        mKYD.fnToggleListAndForm();
    },
    fnValidateForm: function () {
        var IsKeyColumnEntered = false;
        if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.MOBILE) {
            if ($.trim($('#txtMobile').val()).length > 0) {
                IsKeyColumnEntered = true;
                //return false;
            }
        }
        else if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.REGISTRATION_NO) {
            if ($.trim($('#txtRegNo').val()).length > 0) {
                IsKeyColumnEntered = true;
            }
        }
        else if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.EMAIL_ID) {
            if ($.trim($('#txtEmail').val()).length > 0) {
                IsKeyColumnEntered = true;
            }
        }
        if (IsKeyColumnEntered) {
            for (var i = 0; i < mKYD.config.MANDATORY_COLUMNS.length; i++) {
                var col_Name = mKYD.config.MANDATORY_COLUMNS[i].toUpperCase();

                // register no
                if (col_Name == mKYD.Columns.REGISTRATION_NO) {
                    if ($.trim($('#txtRegNo').val()).length == 0) {
                        alert("Please fill the Registration No.");
                        return false;
                    }
                }

                // Mobile 
                if (col_Name == mKYD.Columns.MOBILE) {
                    if ($.trim($('#txtMobile').val()).length == 0) {
                        alert("Please fill the Mobile No.");
                        return false;
                    }
                }

                // Email 
                if (col_Name == mKYD.Columns.EMAIL_ID) {
                    if ($.trim($('#txtEmail').val()).length == 0) {
                        alert("Please fill the Email Id.");
                        return false;
                    }
                }

                // Local Area
                if (col_Name == mKYD.Columns.LOCAL_AREA) {
                    if ($.trim($('#txtLocalArea').val()).length == 0) {
                        alert("Please fill the Local Area.");
                        return false;
                    }
                }

                // Pin Code
                if (col_Name == mKYD.Columns.PIN_CODE) {
                    if ($.trim($('#txtPinCode').val()).length == 0) {
                        alert("Please fill the Pin Code.");
                        return false;
                    }
                }

                if (col_Name == PLACE_TYPE_ORI_NAME) {
                    if ($.trim($('#txtMedCoun').val()).length == 0) {
                        alert("Please fill the" + PLACE_TYPE + ".");
                        return false;
                    }
                }

                // Hos Name
                if (col_Name == mKYD.Columns.HOSPITAL_NAME) {
                    if ($.trim($('#txtHosName').val()).length == 0) {
                        alert("Please fill the Hospital Name.");
                        return false;
                    }
                }
            }
        }

        // Mobile Number Validation.
        if ($.trim($('#txtMobile').val()).length > 0) {
            if ($.trim($('#txtMobile').val()).length < 10) {
                alert("Invalid Mobile Number.");
                return false;
            }
            if (!WHOLENUMBERREGEX_g.test($.trim($('#txtMobile').val()))) {
                alert("Invalid Mobile Number.");
                return false;
            }
        }

        // Registration No.
        if ($.trim($('#txtRegNo').val()).length > 0) {
            if (!SPECIAL_CHAR_REGEX_FOR_REGISTRATION.test($.trim($('#txtRegNo').val()))) {
                alert("Please reomve the special characters in Registration No. The following special characters only allowed " + ALLOEWD_SPECIAL_CHARACTERS + ".");
                return false;
            }
        }

        // Email length check
        if ($.trim($('#txtEmail').val()).length > 0) {
            if ($.trim($('#txtEmail').val()) > 100) {
                alert("Email id length should not be greater than the 100.");
                return false;
            }
            if (!SPECIAL_CHAR_REGEX_FOR_EMAIL_ID.test($.trim($('#txtEmail').val()))) {
                alert("Please Enter the Valid Email Id.");
                return false;
            }
        }
        // Pin Code
        if ($.trim($('#txtPinCode').val()).length > 0) {
            if ($.trim($('#txtPinCode').val()) < 6) {
                alert("Invalid Pin Code. Please enter 6 digits.");
                return false;
            }
        }

        // Pin Code
        if ($.trim($('#txtPinCode').val()).length > 0) {
            if (!WHOLENUMBERREGEX_g.test($.trim($('#txtPinCode').val()))) {
                alert("Invalid Pin Code. Please enter only numeric.");
                return false;
            }
        }


        // Local Area
        if ($.trim($('#txtLocalArea').val()).length > 0) {
            if (!SPECIAL_CHAR_REGEX_FOR_LOCALAREA.test($.trim($('#txtLocalArea').val()))) {
                alert("Please reomve the special characters in Local Area. The following special characters only allowed " + ALLOEWD_SPECIAL_CHARACTERS + ".");
                return false;
            }
        }

        // PLACE TYPE
        if ($.trim($('#txtMedCoun').val()).length > 0) {
            if (!SPECIAL_CHAR_REGEX_FOR_PLACE_TYPE.test($.trim($('#txtMedCoun').val()))) {
                alert("Please reomve the special characters in " + PLACE_TYPE + ". The following special characters only allowed " + ALLOEWD_SPECIAL_CHARACTERS + ".");
                return false;
            }
        }

        // Hospital Name.
        if ($.trim($('#txtHosName').val()).length > 0) {
            if (!SPECIAL_CHAR_REGEX_FOR_LOCALAREA.test($.trim($('#txtHosName').val()))) {
                alert("Please reomve the special characters in Hospital Name. The following special characters only allowed " + ALLOEWD_SPECIAL_CHARACTERS + ".");
                return false;
            }
        }
        return true;
    },
    fnDuplicateValidation: function () {  
        for (var i = 0; i < mKYD.Data.KYDOBJ.length; i++) {

            // The already entered doctor.
            if (mKYD.Data.KYDOBJ[i].Doctor_Code + "_" + mKYD.Data.KYDOBJ[i].Doctor_Region_Code == $('#dvKYDEntryForm').attr('data-primary')) {
                continue;
            }

            // Mobile.
            if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.MOBILE) {
                if (mKYD.Data.KYDOBJ[i].Mobile == $.trim($('#txtMobile').val()) && $.trim($('#txtMobile').val()).length > 0) {
                    if (!confirm('The same Mobile number is already entered for Doctor "' + mKYD.Data.KYDOBJ[i].Doctor_Name + '". Do you wish to continue?')) {
                        return false;
                    }
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.REGISTRATION_NO) {
                if (mKYD.Data.KYDOBJ[i].Registration_No == $.trim($('#txtRegNo').val()) && $.trim($('#txtRegNo').val()).length > 0) {
                    if (!confirm('The same Registration No is already entered for Doctor "' + mKYD.Data.KYDOBJ[i].Doctor_Name + '". Do you wish to continue?')) {
                        return false;
                    }

                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.EMAIL_ID) {
                if (mKYD.Data.KYDOBJ[i].Email_Id == $.trim($('#txtEmail').val()) && $.trim($('#txtEmail').val()).length > 0) {
                    if (!confirm('The same Email id is already entered for Doctor "' + mKYD.Data.KYDOBJ[i].Doctor_Name + '". Do you wish to continue?')) {
                        return false;
                    }

                }
            }
        }
        return true;
    },

    PercentageValidation: function () {  
        var obj = mKYD.fnGetFilledObj();
        if (mKYD.Privileges.SHOULD_BE_FILLED <= obj.length) {
            return true;
        }
        else {
            alert("You need to fill Doctor details till to reach the desired percentage.Please enter the '" + mKYD.config.DUPLICATECHECK_COLUMN + "'.");
            return false;
        }
    },
    fnGetFilledObj: function () {    
        var Obj = [];
        for (var i = 0; i < mKYD.Data.KYDOBJ.length; i++) {
            if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.MOBILE) {
                if (mKYD.Data.KYDOBJ[i].Mobile.length > 0) {
                    Obj.push(mKYD.Data.KYDOBJ[i]);
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.REGISTRATION_NO) {
                if (mKYD.Data.KYDOBJ[i].Registration_No.length > 0) {
                    Obj.push(mKYD.Data.KYDOBJ[i]);
                }
            }
            else if (mKYD.config.DUPLICATECHECK_COLUMN.toUpperCase() == mKYD.Columns.EMAIL_ID) {
                if (mKYD.Data.KYDOBJ[i].Email_Id.length > 0) {
                    Obj.push(mKYD.Data.KYDOBJ[i]);
                }
            }
        }
        return Obj;
    },

    fnGetAllObj: function () {    
        var Obj = [];
        for (var i = 0; i < mKYD.Data.KYDOBJ.length; i++) {
            var obj = mKYD.Data.KYDOBJ[i];
            if (mKYD.fnCheckValidObj(obj)) {
                Obj.push(mKYD.Data.KYDOBJ[i]);
            }
        }
        return Obj;
    },
    fnCheckValidObj: function (obj) {       
        return obj.Registration_No.length > 0 || obj.Mobile.length > 0 || obj.Local_Area.length > 0 || obj.Pin_Code.length > 0 || obj.Hospital_Name.length > 0
            || obj.Medical_Council.length > 0 || obj.Email_Id.length > 0;

    },
    fnCheckDuplicateDB: function () {       
        if (mKYD.PercentageValidation()) {
            var obj = mKYD.fnGetFilledObj();
            $.ajax({
                url: '/HiDoctor_Activity/DCRV4KYD/DuplicateValidationOnKYD',
                type: "POST",
                data: "KYDDoctordetails_arr=" + JSON.stringify(obj) + '&duplicateKeycolumn=' + mKYD.config.DUPLICATECHECK_COLUMN,
                success: function (jsData) {
                    var doctorNames = "";
                    debugger;
                    if (jsData == null || jsData.length == 0) {
                        mKYD.fnSaveKYDObj();
                    }
                    else if (jsData.length > 0) {
                        for (var i = 0; i < jsData.length; i++) {
                            if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.REGISTRATION_NO) {
                                doctorNames = jsData[i].Registration_No + "\n";
                            }
                            else if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.MOBILE) {
                                doctorNames = jsData[i].Mobile + "\n";
                            }
                            else if (mKYD.config.DUPLICATECHECK_COLUMN == mKYD.Columns.EMAIL_ID) {
                                doctorNames = jsData[i].Email_Id + "\n";
                            }
                            if (jsData[i].Doctor_Code && jsData[i].Doctor_Region_Code) {
                                var primary = jsData[i].Doctor_Code + "_" + jsData[i].Doctor_Region_Code;
                                $('#ulDocList li[data-primary="' + primary + '"] .cls_Duplicate').removeClass('cls_displaynone');
                            }
                        }
                        if (doctorNames.length > 0) {
                            if (!confirm("The following " + mKYD.config.DUPLICATECHECK_COLUMN + "(s) are duplicate in DB.\n" + doctorNames + " \n Do you wish to continue?")) {
                                return false;
                            }
                            else {
                                mKYD.fnSaveKYDObj(obj);
                            }
                        }
                    }
                },
                error: function (e) {
                    fnMsgAlert('info', '', 'Error.' + e.responseText);

                }
            });
        }
        else {
            alert('Please fill the atleast "' + mKYD.Privileges.SHOULD_BE_FILLED + '" Doctors.');
            return false;
        }
    },

    fnSaveKYDObj: function () {       
        var obj = mKYD.fnGetAllObj();
        $.ajax({
            url: '/HiDoctor_Activity/DCRV4KYD/SaveKYDInfo',
            type: "POST",
            data: "KYDDoctordetails_arr=" + JSON.stringify(obj) + '&duplicateKeycolumn=' + mKYD.config.DUPLICATECHECK_COLUMN,
            success: function (result) {
                if (result == '0') {
                    mKYD.fnGoToCalendar();
                }
                else {
                    fnMsgAlert('info', '', 'Error.' + result);
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.responseText);
            }
        });
    },
    fnGoToCalendar: function () {       
        $.mobile.changePage("/HiDoctor_Activity/DCRCalendar/Index", {
            type: "post",
            reverse: false,
            changeHash: false
        });
    }
};