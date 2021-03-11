var CV_Visit_Id_g = 0;
var chemistAutoFill_g_CV;
var RIGID_CHEMIST_ENTRY = "YES";
var cheAlertTitle = "Chemist/Customer Details";


var ChemistVisit = {
    defaults: {
        "formMode_g": "",
        "file_Uploading_Status_CV": "NO",
        "ChemistVisitTime_g": "",
        "ChemistEntryMode_g": "NO",
        "StockistHeader_ch": "Stockiest",
        "Chemist_Caption": "CHEMIST"
    },
    initialize: function () {
        debugger;
        var chemistName_sufix = ChemistVisit.fnGetDoctorSufPreColumns();
        var chemistName_sufix_array = chemistName_sufix.split(',')
        var sur_Name_status = 0;
        var local_Area_status = 0;
        for (var i = 0; i < chemistName_sufix_array.length; i++) {
            if (chemistName_sufix_array[i].toUpperCase() == 'SUR_NAME')
                sur_Name_status = 1;
            else if (chemistName_sufix_array[i].toUpperCase() == 'LOCAL_AREA')
                local_Area_status = 1;
        }
        ChemistVisit.defaults.ChemistVisitTime_g = fnGetPrivilegeValue('DCR_CHEMIST_VISIT_MODE', '');
        ChemistVisit.defaults.ChemistEntryMode_g = fnGetPrivilegeValue('RIGID_CHEMIST_ENTRY', 'NO');
        ChemistVisit.defaults.StockistHeader_ch = fnGetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist ");
        //$('#btnCheInsertCP').val('Go to ' + ChemistVisit.defaults.StockistHeader_ch + ' Visit >>');
        // $('.btnCheinsertdoctor').val('Go to ' + ChemistVisit.defaults.StockistHeader_ch + ' Visit >>');
        ChemistVisit.defaults.Chemist_Caption = fnGetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist ");
        // $('#btnCheClear').val('Add ' + ChemistVisit.defaults.Chemist_Caption + ' Visit');
        //chemistAutoFill_g_CV = chemistAutoFill_g;
        chemistAutoFill_g_CV = lschemist_CV;
        for (var i = 0; i < chemistAutoFill_g_CV.length; i++) {
            chemistAutoFill_g_CV[i].label = chemistAutoFill_g_CV[i].Chemist_Name;
            if (chemistAutoFill_g_CV[i].Sur_Name != null && chemistAutoFill_g_CV[i].Sur_Name != '' && sur_Name_status == 1)
                chemistAutoFill_g_CV[i].label = chemistAutoFill_g_CV[i].label + "_" + chemistAutoFill_g_CV[i].Sur_Name;
            chemistAutoFill_g_CV[i].label = chemistAutoFill_g_CV[i].label + "_" + chemistAutoFill_g_CV[i].Region_Name;
            if (chemistAutoFill_g_CV[i].Local_Area != null && chemistAutoFill_g_CV[i].Local_Area != '' && local_Area_status == 1)
                chemistAutoFill_g_CV[i].label = chemistAutoFill_g_CV[i].label + "_" + chemistAutoFill_g_CV[i].Local_Area;
            if (chemistAutoFill_g_CV[i].MDL_Number != null && chemistAutoFill_g_CV[i].MDL_Number != '')
                chemistAutoFill_g_CV[i].label = chemistAutoFill_g_CV[i].label + "_" + chemistAutoFill_g_CV[i].MDL_Number;
        }
        autoComplete(chemistAutoFill_g, "txtChemistName", "hdnChemistCode", "auto_Chemist_Visit");
        ChemistVisit.fnGetChemistVisit();
        //For POB Detailed Products product(default get current region product)
        fnGetDoctorandCustomerSalesProducts();
        if (ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME" || ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
            $('#div_doc_visitmode_cv').css('display', 'none');
            $('#div_doc_visittime_cv').css('display', 'block');

        }
        else {
            $('#div_doc_visitmode_cv').css('display', 'block');
            $('#div_doc_visittime_cv').css('display', 'none');
        }
        ////////////////////POB Mandatory///////////////////////////////////
        var pobMandatory = fnGetPrivilegeValue('CHEMIST_POB_ENTER_MIN', '');
        var ShowPOB = fnGetPrivilegeValue('CHEMIST_VISITS_CAPTURE_CONTROLS', '');
        if (ShowPOB.indexOf("POB") > -1) {
            if (pobMandatory != '' && pobMandatory != '0') {
                //$('#CPOBMandatory').prop('checked', true);
                $('#ClblPOBMand').show();
            }
            else {
                //$('#CPOBMandatory').prop('checked', false);
                $('#ClblPOBMand').hide();
            }
        }

    },
    fnSetFormMode: function (event) {
        if (event.target.id != 'btnCheSave' && event.target.id != 'btnCheInsertCV') {
            if (event != null && event.target != null && event.target.value == "Reset") {
                return true;
            }
            else {
                ChemistVisit.defaults.formMode_g = "Edit";
            }
        }
    },

    //After Insert Clear data
    fnClearForm: function () {

        CV_Visit_Id_g = 0;
        ChemistVisit.defaults.formMode_g = "NO";
        if (CONTACT == "CONTACT") {
            Contact.fnClear();
        }
        if (ACCOMPANIST == "ACCOMPANIST") {
            AccomplishmentDetails.fnClear();
        }
        if (SAMPLES == "SAMPLES") {
            ChemistProductDetails.fnClear();
        }
        if (DETAILING == "DETAILING")
            ChemistDetailProductDetails.fnClear();
        {
        }
        if (RCPA == "RCPA") {
            ChemistRCPA.fnClear();
        }
        if (POB == "POB") {
            ChemistPOB.fnclear();
        }
        if (ATTACHMENTS == "ATTACHMENTS") {
            attachments.fnClear();
        }
        if (FOLLOW == "FOLLOW-UP") {
            FollowUps.fnClear();
        }
        //Doctor entry screen this array set empty after save doctor
        if (SalesProductsAutoFill_g.length == 0)
            fnGetDoctorandCustomerSalesProducts();

        ChemistVisit.fnChemistClear();
        $('#CPOBMandatory').prop('checked', false);
    },
    //fnChFillForm: function () {

    //},

    //---------Com--------------------------------------
    fnCheClear: function () {
        $("#frm1").hide();
        $("#div_Chevisit_form").show();
        fnhighlightRowColor(0);
        //Reset Doctor Visit
        formMode_g = '';
        //Use for reset the form
        ChemistVisit.fnClearForm();
    },
    //
    fnFillForm: function () {

    },

    fnInsertChemist: function () {
        if (ChemistVisit.defaults.file_Uploading_Status_CV == "NO") {
            if (ChemistVisit.defaults.formMode_g == "Edit") {
                if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
                    if (ChemistVisit.fnInsertChemistVisitData()) {
                        $.blockUI();
                        fnRedirectTostockiestVisit();
                    }
                    else
                        HideModalPopup('dvLoading');
                }
            }
            else {
                fnRedirectTostockiestVisit();
            }
        }
        else {
            fnMsgAlert('info', "File Upload", 'Please wait.. file is uploading...');
        }
    },
    // Insert.
    fnInsertChemistVisitData: function () {
        //if (GetAccompanistmandatoryCheck()) {
        if (ChemistVisit.defaults.file_Uploading_Status_CV == "NO") {
            $('#buttonChediv').css('display', 'none');
            //fnBlockDiv('div_doctorvisit', 'Please wait, Saving Your DCR information....');
            $('#div_doctorvisit').block({
                message: 'Please wait, Saving Your DCR information....',
                css: { border: '3px solid #89C33F', padding: '7px' }
            });
            //ShowModalPopup('dvLoading');
            if (ChemistVisit.fnSaveChemistVisit()) {
                $('#buttonChediv').css('display', '');
                fnUnBlockDiv('div_doctorvisit');
                $("#txtChemistName").focus();
                return true;
            }
            else {
                $('#buttonChediv').css('display', '');
                fnUnBlockDiv('div_doctorvisit');
                return false;
            }
        }
        else {
            fnMsgAlert('info', "File Upload", 'Please wait.. file is uploading...');
            return false;
        }
        // }
    },
    //Save ch_visit
    fnSaveChemistVisit: function () {
        debugger
        var rValue = true;
        var ChemistName = "";
        var Chemists_MDL_Number = "";
        var Chemists_Region_Code = "";
        // Chemist Name Required.
        if (!fnCheckIsNull($('#txtChemistName'), '' + ChemistVisit.defaults.Chemist_Caption + ' Name', ChemistVisit.defaults.Chemist_Caption)) {
            return false;
        }
        // duplicate Chemist
        var chemistName_dis = $("#txtChemistName").val().trim();

        if (chemistName_dis.split('_').length > 0)
            ChemistName = chemistName_dis.split('_')[0].trim();
        else
            ChemistName = chemistName_dis;

        for (var rowIndex = 0; rowIndex < $('#tbl_Chemistvisit_list tr').length; rowIndex++) {
            var rowNum = rowIndex + 1;
            if ($("#tbl_Chemistvisit_list tr:nth-child(" + rowNum + ")").attr('style') != 'display: none;') {
                if (chemistName_dis == $.trim($('#spnChemistName_' + rowNum).text())) {
                    //Edit Mode
                    var visit_id = $("#spnCv_Visit_Id_" + rowNum).text().trim();
                    if (visit_id != CV_Visit_Id_g) {
                        fnMsgAlert('info', ChemistVisit.defaults.Chemist_Caption, 'This ' + ChemistVisit.defaults.Chemist_Caption + ' already entered.');
                        return false;
                    }
                }
            }
        }

        //flexi Doctor Validation Validation
        if (ChemistVisit.defaults.ChemistEntryMode_g.toUpperCase() == "YES") {
            var DocData = [];
            if (chemistAutoFill_g_CV != undefined)
                if (chemistAutoFill_g_CV.length > 0) {
                    var data = { "item": chemistAutoFill_g_CV };
                    DocData = $.grep(data.item, function (element, index) {
                        return element.value == $("#hdnChemistCode").val().trim();
                    });
                }
            if (DocData.length < 1) {
                fnMsgAlert('info', ChemistVisit.defaults.Chemist_Caption, 'Invalid ' + ChemistVisit.defaults.Chemist_Caption + ' Name.');
                return false;
            }


        }

        var DocData = [];
        if (chemistAutoFill_g_CV != undefined)
            if (chemistAutoFill_g_CV.length > 0) {
                var data = { "item": chemistAutoFill_g_CV };
                DocData = $.grep(data.item, function (element, index) {
                    return element.value == $("#hdnChemistCode").val().trim();
                });
            }
        if (DocData != undefined && DocData.length > 0) {
            Chemists_MDL_Number = DocData[0].MDL_Number;
            Chemists_Region_Code = DocData[0].Chemists_Region_Code;
        }
        else {
            //Enter only flexi mode
            Chemists_Region_Code = Region_code_g;
        }
        var visit_mode = "";
        var visit_time = "";

        try {
            // Visit Time or Visit Mode.
            if (ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" || ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME") {
                if (fnChekTimeformat('timepicker_cv')) {
                    if ($('#timepicker_cv').val().length > 0) {
                        visit_time = $('#timepicker_cv').val().split(' ')[0];
                        visit_mode = $('#timepicker_cv').val().split(' ')[1];
                    }
                }
                else {
                    fnMsgAlert('info', cheAlertTitle, 'Please enter valid Time format.');
                    return false;
                }
                if (ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" && !fnCheckIsNull($('#timepicker_cv'), 'Visit Time', ChemistVisit.defaults.Chemist_Caption)) {
                    return false;
                }
            }
            else {
                visit_mode = $('input[name=rdvisitmode_cv]:checked').val();
                visit_time = '';
            }
        }
        catch (e) {
            console.log(e);
        }
        var lsContact = true
        if (CONTACT.toUpperCase() == "CONTACT") {
            lsContact = Contact.fnGetContactlist();
        }
        if (!lsContact)
            return false;
        for (var i = 0; i < lsContact.length; i++) {
            if (lsContact[i].Mobile != '' && lsContact[i].Mobile != undefined) {
                Contact.fnValidateMobileNumber(lsContact[i].Mobile);
                //if (mobres == false) {
                //    fnMsgAlert('info', 'Chemist', 'Invalid mobile format.');
                //    return false;
                //}
                if (lsContact[i].Mobile.length != 10) {
                    fnMsgAlert('info', 'Chemist', 'Mobile Number should be 10 digits');
                    return false;
                }
            }
            if (lsContact[i].Email_Id != '' || lsContact[i].Email_Id != undefined) {
                Contact.validateEmail(lsContact[i].Email_Id);
                if (emailres == false) {
                    fnMsgAlert('info', 'Chemist', 'Invalid Email Address');
                    return false;
                }
            }
        }
        var lsAcc = true
        if (ACCOMPANIST.toUpperCase() == "ACCOMPANIST") {
            lsAcc = AccomplishmentDetails.fnGetAccomplist();
        }
        if (!lsAcc)
            return false;
        var lsFollowUps = true;
        if (FOLLOW.toUpperCase() == "FOLLOW-UP") {
            lsFollowUps = FollowUps.fnGetCVFollowUpslist();
        }

        if (!lsFollowUps)
            return false;
        var lsAttachment = true;
        if (ATTACHMENTS == "ATTACHMENTS") {
            lsAttachment = attachments.fnGetAttachmentlist();
        }
        if (!lsAttachment)
            return false;
        var lsSample_Promotion = true;
        if (SAMPLES == "SAMPLES") {
            lsSample_Promotion = ChemistProductDetails.fnGetChemistProduct();
        }
        if (!lsSample_Promotion)
            return false;

        var pob = true;
        var lsPOBOrderHeader = null;
        var lsPOBOrderDetails = null;
        if (POB == "POB") {
            pob = ChemistPOB.fnGetChemistPOB();
            if (!pob)
                return false;
            lsPOBOrderHeader = pob[0];
            lsPOBOrderDetails = pob[1];
        }

        var lsDetailed_Product = true;
        if (DETAILING == "DETAILING") {
            lsDetailed_Product = ChemistDetailProductDetails.fnGetChemistDetailProduct();
        }
        if (!lsDetailed_Product)
            return false;
        var rcpa = true;
        var lsRCPA_Own_Products = null;
        var lsRCPA_Competitor_Products = null;
        if (RCPA == "RCPA") {
            rcpa = ChemistRCPA.fnGetChemistRCPA();

            lsRCPA_Own_Products = rcpa[0];
            lsRCPA_Competitor_Products = rcpa[1];
        }
        if (!rcpa)
            return false;

        //Update Chemist name in POB
        if (lsPOBOrderHeader != null && lsPOBOrderHeader.length > 0) {
            for (var i = 0; i < lsPOBOrderHeader.length; i++) {
                lsPOBOrderHeader[i].Customer_Name = ChemistName;
            }
        }
        // POB Mandatory Check
        var POBMandatory = 1;
        var POB_Enter_Min = fnGetPrivilegeValue("CHEMIST_POB_ENTER_MIN", "");
        var POB_Enter_Max = fnGetPrivilegeValue("CHEMIST_POB_ENTER_MAX", "");
        var POB_Min_Product = fnGetPrivilegeValue("CHEMIST_POB_PRODUCT_ENTER_MIN", "");
        var POB_Max_Product = fnGetPrivilegeValue("CHEMIST_POB_PRODUCT_ENTER_MAX", "");
        var istrue = true;
        if (document.getElementById("CPOBMandatory").checked == false && $("#ClblPOBMand").css('display') == "block") {
            POBMandatory = 0;
            if (POB_Enter_Min != "" && POB_Enter_Min != false && POB_Enter_Min != undefined && POB_Enter_Min != "0") {
                if (lsPOBOrderHeader.length < POB_Enter_Min) {
                    fnMsgAlert('info', 'Purchase Order Booking', 'Please enter a minimum of ' + POB_Enter_Min + ' stockist in POB.');
                    istrue = false;
                    return false;
                }
            }
            if (POB_Enter_Max != "" && POB_Enter_Max != false && POB_Enter_Max != undefined && POB_Enter_Max != "0") {
                if (lsPOBOrderHeader.length > POB_Enter_Max) {
                    fnMsgAlert('info', 'Purchase Order Booking', 'You can enter a maximum of ' + POB_Enter_Max + ' stockist in POB.');
                    istrue = false;
                    return false;
                }
            }

            if (lsPOBOrderDetails != false) {
                for (var i = 0; i < lsPOBOrderHeader.length; i++) {
                    var productlst = $.grep(lsPOBOrderDetails, function (ele, index) {
                        return ele.Client_Order_ID == lsPOBOrderHeader[i].Client_Order_ID;
                    })
                    if (POB_Min_Product != "" && POB_Min_Product != false && POB_Min_Product != undefined && POB_Min_Product != "0") {

                        if (productlst.length < POB_Min_Product) {
                            fnMsgAlert("info", "Purchase Order Booking", "Please select a minimum  of " + POB_Min_Product + " products under '" + lsPOBOrderHeader[i].Stockist_Name + "'.");
                            return false;
                        }
                    }
                    if (POB_Max_Product != "" && POB_Max_Product != false && POB_Max_Product != undefined && POB_Max_Product != "0") {
                        if (productlst.length > POB_Max_Product) {
                            fnMsgAlert("info", "Purchase Order Booking", "You can select a maximum of " + POB_Max_Product + " products under '" + lsPOBOrderHeader[i].Stockist_Name + "'.");
                            return false;
                        }
                    }
                }
            }
        }

        //
        var _objdateDetails = CommonDateDetails.fnGetTodaysDateNew();
        console.log(_objdateDetails);
        if (visit_mode.trim() == '')
            visit_mode = 'AM';
        debugger;
        var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtCheRemarks"));
        if (!res) {
            fnMsgAlert('info', 'Chemist Remarks', 'Please remove the special characters in Remarks. <br/>The following charactres are only allowed <b>-_.,()@</b>.');
            return false;
        }
        else {
            var Chemistvisit = {
                Chemist_Code: $("#hdnChemistCode").val(),
                Chemists_Name: ChemistName,
                Visit_Mode: visit_mode,
                Visit_Time: visit_time,
                Chemists_Region_Code: Chemists_Region_Code,
                Chemists_MDL_Number: Chemists_MDL_Number,
                Remarks_By_User: $("#txtCheRemarks").val().trim(),
                Business_Category_Id: $("#bCategory").val(),
                DCR_Actual_Date: dcrActualDate_g,
                CV_Visit_Id: CV_Visit_Id_g,
                lstContact: lsContact,
                lsAccompanist: lsAcc,
                lsFollowUp: lsFollowUps,
                lsAttachment: lsAttachment,
                lsSample_Promotion: lsSample_Promotion,
                lsPOBOrderHeader: lsPOBOrderHeader,
                lsPOBOrderDetails: lsPOBOrderDetails,
                lsDetailed_Product: lsDetailed_Product,
                lsRCPA_Own_Products: lsRCPA_Own_Products,
                lsRCPA_Competitor_Products: lsRCPA_Competitor_Products,
                _objDateDetails: _objdateDetails,
                POBMandatory: POBMandatory
            }
            $.ajax({
                type: 'POST',
                url: '../DCRV4ChemistVisit/InsertDCRChemistVisitData',
                data: JSON.stringify({ 'objChemistVisit': Chemistvisit }),
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (response) {
                    debugger;
                    if (response.SysErrorMsg == "") {
                        if (response.CusErrorMsg == "") {
                            //Insert
                            ChemistVisit.defaults.formMode_g = "NO";
                            var lsCount = new Array();
                            lsCount.push({ 'lstContact': lsContact });
                            lsCount.push({ 'lsAccompanist': lsAcc });
                            lsCount.push({ 'lsSample_Promotion': lsSample_Promotion });
                            lsCount.push({ 'lsDetailed_Product': lsDetailed_Product });
                            lsCount.push({ 'lsRCPA_Doctor': lsRCPA_Own_Products });
                            //-----
                            lsCount.push({ 'lsPOBOrderHeader': lsPOBOrderHeader });
                            lsCount.push({ 'lsAttachment': lsAttachment });
                            lsCount.push({ 'lsFollowUps': lsFollowUps });
                            if (CV_Visit_Id_g == 0) {
                                ChemistVisit.RowCreation(chemistName_dis, response.CV_Visit_Id, lsCount);
                            }
                            else {
                                for (var rowIndex = 0; rowIndex < $('#tbl_Chemistvisit_list tr').length; rowIndex++) {
                                    var rowNum = rowIndex + 1;
                                    if ($("#spnCv_Visit_Id_" + rowNum).text().trim() == CV_Visit_Id_g) {
                                        $("#spnChemistName_" + rowNum).text(chemistName_dis);
                                        $("#cv_Sno_" + rowNum).next().next().next().html('');
                                        $("#cv_Sno_" + rowNum).next().next().next().html(ChemistVisit.RowUpdation(chemistName_dis, response.CV_Visit_Id, lsCount));
                                    }
                                }

                            }
                            ChemistVisit.fnCheClear();
                            fnGetUserProductsAndSetAutoFill();
                        }
                        else {
                            fnMsgAlert('error', cheAlertTitle, response.CusErrorMsg);
                            rValue = false;
                        }
                    }
                    else {
                        alert(response.SysErrorMsgs);
                        rValue = false;
                    }

                }
            });
            return rValue;
        }
    },
    //Delete
    fnDeleteChemistVisit: function (CV_Visit_Id, cur) {
        debugger;
        if (confirm('Do you wish to delete the ' + ChemistVisit.defaults.Chemist_Caption + ' and related details ?')) {
            $.blockUI();
            $.ajax({
                type: 'POST',
                url: '../DCRV4ChemistVisit/DeleteChemistVisitData',
                data: { 'CV_Visit_Id': CV_Visit_Id },
                success: function (responce) {
                    if (responce.toLowerCase() == "success") {
                        cur.parentElement.parentElement.style = "display:none";
                        ChemistVisit.RowSnoCreation();
                        ChemistVisit.fnCheClear();
                        fnGetUserProductsAndSetAutoFill();
                        $.unblockUI();
                    }
                },
            });
        }
    },

    RowCreation: function (ChemistName, cv_id, lsCount) {
        debugger;
        var rowLength = $('#tbl_Chemistvisit_list tr').length;
        var selImg = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" />';
        var contact = "";
        var Accimg = '';
        var Sampleimg = '';
        var detailimg = '';
        var Rcpaimg = '';
        var name = '';
        var pob = '';
        var att = '';
        var follow_up = '';
        if (lsCount[0].lstContact != null && lsCount[0].lstContact.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[0].lstContact.length; i++) {
                //name += (i + 1) + '.' + lsCount[6].lsFollowUps[i].Tasks + '&#013;';
            }
            follow_up = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/follow-up.png' alt='contact' /></a></span>";
        }
        if (lsCount.length > 0 && lsCount[1].lsAccompanist != null && lsCount[1].lsAccompanist.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[1].lsAccompanist.length; i++) {
                //name += (i + 1) + '.' + lsCount[0].lsAccompanist[i].Acc_User_Name + '&#013;';
            }
            Accimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/acc.png" alt="acc" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[2].lsSample_Promotion != null && lsCount[2].lsSample_Promotion.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[2].lsSample_Promotion.length; i++) {
                // name += (i + 1) + '.' + lsCount[1].lsSample_Promotion[i].Product_Name + '&#013;';
            }
            Sampleimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sample/Promotional items" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[3].lsDetailed_Product != null && lsCount[3].lsDetailed_Product.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[3].lsDetailed_Product.length; i++) {
                // name += (i + 1) + '.' + lsCount[2].lsDetailed_Product[i].Sales_Product_Name + '&#013;';
            }
            detailimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/detailed.png" alt="Detail" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[4].lsRCPA_Doctor != null && lsCount[4].lsRCPA_Doctor.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[4].lsRCPA_Doctor.length; i++) {
                //name += (i + 1) + '.' + lsCount[3].lsRCPA_Doctor[i].Customer_Name + '&#013;';
            }
            Rcpaimg = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/rcpa.png' alt='RCPA' /></a></span>";
        }
        //----------------
        if (lsCount[5].lsPOBOrderHeader != null && lsCount[5].lsPOBOrderHeader.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[5].lsPOBOrderHeader.length; i++) {
                //name += (i + 1) + '.' + lsCount[4].lsPOBOrderHeader[i].Customer_Name + '&#013;';
            }
            pob = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/pob.png' alt='POB' /></a></span>";
        }
        if (lsCount[6].lsAttachment != null && lsCount[6].lsAttachment.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[6].lsAttachment.length; i++) {
                //name += (i + 1) + '.' + lsCount[5].lsAttachment[i].Uploaded_File_Name + '&#013;';
            }
            att = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/attachment.png' alt='attachment' /></a></span>";
        }
        if (lsCount[7].lsFollowUps != null && lsCount[7].lsFollowUps.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[7].lsFollowUps.length; i++) {
                //name += (i + 1) + '.' + lsCount[6].lsFollowUps[i].Tasks + '&#013;';
            }
            follow_up = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/follow-up.png' alt='follow-up' /></a></span>";
        }
        var img = Accimg + Sampleimg + detailimg + Rcpaimg + pob + att + follow_up;
        $('#tbl_Chemistvisit_list').append('<tr style="cursor: pointer";  ><td id=cv_Sno_' + (rowLength + 1) + '></td><td>' + selImg + '</td><td onClick="ChemistVisit.fnGetChemistVisitDatils(' + cv_id + ')"><span style="display:none" id=spnCv_Visit_Id_' + (rowLength + 1) + '>' + cv_id + '</span><span id=spnChemistName_' + (rowLength + 1) + '>' + ChemistName + '</span></td><td>' + img + '</td><td> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" title="Delete" alt="Remove" onclick="ChemistVisit.fnDeleteChemistVisit(' + cv_id + ',this)"</td></tr>');
        ChemistVisit.RowSnoCreation();
    },
    RowUpdation: function (ChemistName, cv_id, lsCount) {
        var contact = "";
        var Accimg = '';
        var Sampleimg = '';
        var detailimg = '';
        var Rcpaimg = '';
        var pob = '';
        var att = '';
        var follow_up = '';
        if (lsCount.length > 0 && lsCount[0].lstContact.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[0].lstContact.length; i++) {
                //name += (i + 1) + '.' + lsCount[0].lsAccompanist[i].Acc_User_Name + '&#013;';
            }
            Accimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/acc.png" alt="contact" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[1].lsAccompanist.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[1].lsAccompanist.length; i++) {
                //name += (i + 1) + '.' + lsCount[0].lsAccompanist[i].Acc_User_Name + '&#013;';
            }
            Accimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/acc.png" alt="acc" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[2].lsSample_Promotion != null && lsCount[2].lsSample_Promotion.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[2].lsSample_Promotion.length; i++) {
                //name += (i + 1) + '.' + lsCount[1].lsSample_Promotion[i].Product_Name + '&#013;';
            }
            Sampleimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sample/Promotional items" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[3].lsDetailed_Product != null && lsCount[3].lsDetailed_Product.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[3].lsDetailed_Product.length; i++) {
                //name += (i + 1) + '.' + lsCount[2].lsDetailed_Product[i].Sales_Product_Name + '&#013;';
            }
            detailimg = '<span class="cvImg"><a title="' + unescape(name) + '"> <img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/detailed.png" alt="Detail" /></a></span>';
        }
        if (lsCount.length > 0 && lsCount[4].lsRCPA_Doctor != null && lsCount[4].lsRCPA_Doctor.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[4].lsRCPA_Doctor.length; i++) {
                //name += (i + 1) + '.' + lsCount[3].lsRCPA_Doctor[i].Customer_Name + '&#013;';
            }
            Rcpaimg = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/rcpa.png' alt='RCPA' /></a></span>";
        }
        //----------------
        if (lsCount[5].lsPOBOrderHeader != null && lsCount[5].lsPOBOrderHeader.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[5].lsPOBOrderHeader.length; i++) {
                //name += (i + 1) + '.' + lsCount[4].lsPOBOrderHeader[i].Customer_Name + '&#013;';
            }
            pob = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/pob.png' alt='POB' /></a></span>";
        }
        if (lsCount[6].lsAttachment != null && lsCount[6].lsAttachment.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[6].lsAttachment.length; i++) {
                //name += (i + 1) + '.' + lsCount[5].lsAttachment[i].Uploaded_File_Name + '&#013;';
            }
            att = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/attachment.png' alt='attachment' /></a></span>";
        }
        if (lsCount[7].lsFollowUps != null && lsCount[7].lsFollowUps.length > 0) {
            name = '';
            for (var i = 0; i < lsCount[7].lsFollowUps.length; i++) {
                // name += (i + 1) + '.' + lsCount[6].lsFollowUps[i].Tasks + '&#013;';
            }
            follow_up = "<span class='cvImg'><a title='" + unescape(name) + "'> <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/follow-up.png' alt='follow-up' /></a></span>";
        }
        var img = Accimg + Sampleimg + detailimg + Rcpaimg + pob + att + follow_up;
        return img;
    },
    RowSnoCreation: function () {
        var sno = 1;
        for (var rowIndex = 0; rowIndex < $('#tbl_Chemistvisit_list tr').length; rowIndex++) {
            var rowNum = rowIndex + 1;
            if ($("#tbl_Chemistvisit_list tr:nth-child(" + rowNum + ")").attr('style') != 'display: none;') {
                $("#cv_Sno_" + rowNum).text(sno);
                sno++;
            }
        }
    },
    //Bind
    fnGetChemistVisit: function () {
        $.ajax({
            type: 'POST',
            url: '../DCRV4ChemistVisit/GetChemistVisitDatils',
            data: JSON.stringify({ 'type': 'ID', 'DCR_Date': dcrActualDate_g, 'CV_Visit_Id': '0' }),
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (response) {
                debugger;
                var Dcodata = { "item": chemistAutoFill_g_CV };
                var data = new Array();
                var lsCount = new Array();
                var cvCount = new Array();
                for (var i = 0; i < response.length; i++) {
                    var DocData = $.grep(Dcodata.item, function (element, index) {
                        return element.value == response[i].Chemist_Code;
                    });
                    lsCount = [];
                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lstContact };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lstContact': cvCount });
                    else
                        lsCount.push({ 'lstContact': '' });

                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsAccompanist };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsAccompanist': cvCount });
                    else
                        lsCount.push({ 'lsAccompanist': '' });

                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsSample_Promotion };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsSample_Promotion': cvCount });
                    else
                        lsCount.push({ 'lsSample_Promotion': '' });

                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsDetailed_Product };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsDetailed_Product': cvCount });
                    else
                        lsCount.push({ 'lsDetailed_Product': '' });

                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsRCPA_Doctor };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsRCPA_Doctor': cvCount });
                    else
                        lsCount.push({ 'lsRCPA_Doctor': '' });
                    //----------------------------------------
                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsPOBOrderHeader };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsPOBOrderHeader': cvCount });
                    else
                        lsCount.push({ 'lsPOBOrderHeader': '' });

                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsAttachment };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsAttachment': cvCount });
                    else
                        lsCount.push({ 'lsAttachment': '' });

                    data = [];
                    cvCount = [];
                    data = { "item": response[0].lsFollowUp };
                    cvCount = $.grep(data.item, function (element, index) {
                        return element.CV_Visit_Id == response[i].CV_Visit_Id;
                    });
                    if (cvCount.length > 0)
                        lsCount.push({ 'lsFollowUps': cvCount });
                    else
                        lsCount.push({ 'lsFollowUps': '' });

                    if (DocData.length > 0)
                        ChemistVisit.RowCreation(DocData[0].label, response[i].CV_Visit_Id, lsCount);
                    else
                        ChemistVisit.RowCreation(response[i].Chemists_Name, response[i].CV_Visit_Id, lsCount);
                }
            }
        });
    },
    fnGetChemistVisitDatils: function (id) {
        //Clear All Data
        $('#div_doctorvisit').block({
            message: 'Please wait, Retrieve Chemist visit information....',
            css: { border: '3px solid #89C33F', padding: '7px' }
        });
        ChemistVisit.fnCheClear();
        $.ajax({
            type: 'POST',
            url: '../DCRV4ChemistVisit/GetChemistVisitDatils',
            data: JSON.stringify({ 'type': '', 'DCR_Date': '', 'CV_Visit_Id': id }),
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (response) {
                debugger;
                if (response.length > 0) {
                    var ChemistVisitData = response;

                    var data = { "item": chemistAutoFill_g_CV };
                    var DocData = $.grep(data.item, function (element, index) {
                        return element.value == ChemistVisitData[0].Chemist_Code;
                    });
                    if (DocData.length > 0) {
                        $("#txtChemistName").val(DocData[0].label);
                        $("#hdnChemistCode").val(DocData[0].Chemist_Code);
                    }
                    else
                        $("#txtChemistName").val(ChemistVisitData[0].Chemists_Name);
                    $("#txtCheRemarks").val(ChemistVisitData[0].Remarks_By_User);
                    $("#bCategory").val(ChemistVisitData[0].Business_Category_Id);
                    if (ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME" || ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
                        if (ChemistVisitData[0].Visit_Time != null && ChemistVisitData[0].Visit_Time != '')
                            $('#timepicker_cv').val(ChemistVisitData[0].Visit_Time + ' ' + ChemistVisitData[0].Visit_Mode);
                    }
                    else
                        $("input[name='rdvisitmode_cv'][value='" + ChemistVisitData[0].Visit_Mode + "']").prop('checked', true);
                    CV_Visit_Id_g = ChemistVisitData[0].CV_Visit_Id;
                    $("#hdnChemistCode").val(ChemistVisitData[0].Chemist_Code);
                    debugger;
                    if (ChemistVisitData[0].POBMandatory == 1) {
                        $("#CPOBMandatory").prop("checked", true);
                    }
                    else {
                        $("#CPOBMandatory").prop("checked", false);
                    }

                    if (CONTACT == "CONTACT") {
                        try {
                            Contact.fnBindContactDetails(ChemistVisitData[0].lstContact);
                        } catch (e) {
                        }
                    }
                    if (ACCOMPANIST == "ACCOMPANIST") {
                        try {
                            AccomplishmentDetails.fnBindAccNameInObject(ChemistVisitData[0].lsAccompanist);
                        } catch (e) {
                        }
                    }
                    if (SAMPLES == "SAMPLES") {
                        try {
                            ChemistProductDetails.fnPrefill(ChemistVisitData[0].lsSample_Promotion);
                        } catch (e) {
                        }
                    } if (ATTACHMENTS == "ATTACHMENTS") {
                        try {
                            attachments.fnAttachmentEdit(ChemistVisitData[0].lsAttachment);
                        } catch (e) {
                        }
                    }
                    if (FOLLOW == "FOLLOW-UP") {
                        try {
                            FollowUps.fnEditFollowups(ChemistVisitData[0].lsFollowUp);
                        } catch (e) {
                        }
                    } if (POB == "POB") {
                        try {
                            ChemistPOB.fnPrefillPOB(ChemistVisitData[0].lsPOBOrderHeader, ChemistVisitData[0].lsPOBOrderDetails);
                        }
                        catch (e) {

                        }
                    }
                    if (DETAILING == "DETAILING") {
                        try {
                            ChemistDetailProductDetails.fnPrefill(ChemistVisitData[0].lsDetailed_Product)
                        }
                        catch (e) {
                        }
                    }
                    if (RCPA == "RCPA") {
                        try {
                            ChemistRCPA.fnPrefill(ChemistVisitData[0].lsRCPA_Doctor, ChemistVisitData[0].lsRCPA_Own_Products, ChemistVisitData[0].lsRCPA_Competitor_Products)
                        }
                        catch (e) {
                        }
                    }
                    $("#txtChemistName").focus();
                }
                else {
                    ChemistVisit.fnClearForm();
                }
                fnUnBlockDiv('div_doctorvisit');
            },
            error: function () {
                fnUnBlockDiv('div_doctorvisit');
            }

        });
    },

    fnCheckFormMode: function () {
    },
    //--------------------------Validation-------------------

    //fnValidateChemist: function (obj) {
    //    debugger;
    //    $('#RCPA_Chemist').show();
    //    ChemistRCPA.fnRCPAInitialize();
    //    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1(obj)) {
    //        //$.msgbox('Please remove the special characters for chemist.' + chem_name);
    //        fnMsgAlert('info', 'Information', 'Please remove the special characters for "' + ChemistVisit.defaults.Chemist_Caption +
    //            " - " + $("#txtChemistName").val() + '". <br/> The following characters are only allowed -_.().');
    //        $("#txtChemistName").val('');
    //        return false
    //    }
    //},
    fnChemistcancel: function () {
        ChemistVisit.fnCheClear();
    },
    fnChemistClear: function () {
        $("#txtChemistName").val('');
        $("#hdnChemistCode").val('');
        $("#txtCheRemarks").val('');
        $('#timepicker_cv').val('');
        $("#bCategory").val(0);
        if (ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME" || ChemistVisit.defaults.ChemistVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
            $('#div_doc_visitmode_cv').css('display', 'none');
            $('#div_doc_visittime_cv').css('display', 'block');

        }
        else {
            $('#div_doc_visitmode_cv').css('display', 'block');
            $('#div_doc_visittime_cv').css('display', 'none');
        }
        $("input[name='rdvisitmode_cv'][value='AM']").prop('checked', true);
    },
    fnValidateChemist: function (obj) {
        fnValidateAutofill(obj, chemistAutoFill_g_CV, "txtChemistName", "hdnChemistCode");
        if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1(obj)) {
            //$.msgbox('Please remove the special characters for chemist.' + chem_name);
            fnMsgAlert('info', 'Information', 'Please remove the special characters for "' + ChemistVisit.defaults.Chemist_Caption +
                " - " + $("#txtChemistName").val() + '". <br/> The following characters are only allowed -_.().');
            $("#txtChemistName").val('');
            return false
        }
        Contact.fngetcontact();
    },
    fnGetDoctorSufPreColumns: function () {
        var rValue = "";
        $.ajax({
            type: 'POST',
            url: '../DCRV4ChemistVisit/GetDoctorSufPreColumns',
            data: '',
            async: false,
            success: function (responce) {
                if (responce != undefined)
                    rValue = responce;
            }
        });
        return rValue;
    },
    fngetChemistbusinesscategory: function () {
        debugger;
        Method_params = ["DCRChemist/GetChemistBusinessCategory", CompanyCode];
        CoreREST.get(null, Method_params, null, ChemistVisit.BindCategorySuccessData, ChemistVisit.BindCategoryFailure);
    },
    BindCategorySuccessData: function (response) {
        debugger;
        var content = "";
        if (response.list.length > 0) {
            $("#Category").show();
            content += '<option value="0">--Select Business Category--</option>';
            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Business_Category_Id + '">' + response.list[i].Business_Category_Name + '</option>';
            }
            $("#bCategory").append(content);
        }
    },
    BindCategoryFailure: function () {
        debugger;

    },
}