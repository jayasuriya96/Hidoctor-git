var chemistRowIndexRCPA_g = 0;
//var DoctorAutofill_CV = "";
var rcpaJSONArray = new Array();
var rcpaTableStringRCP_g
var ChemAlertTitle = "Chemist Visit";
var DoctorHeader_g = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor ");
if (DoctorHeader_g.length >= 20) {
    DoctorHeader_g = DoctorHeader_g.substr(0, 20) + "...";
}
var ChemistRCPA = {


    fnGetSaleProductsAndSetAutoFill: function () {
        $.ajax({
            type: 'POST',
            data: "dcrActualDate=" + dcrActualDate_g,
            url: '../DCRV4DoctorVisit/GetSaleProductsList',
            async: false,
            success: function (response) {
                // we have the response
                if (response != null && response.length > 0) {
                    RCPAProductAutofill_g = response;
                    //autoComplete(specialityAutoFill_g, "txtDocSpeciality", "hdnspecname", "dcr_doc_spec_name_cv");
                }
            },
            error: function (e) {
                // alert(e.responseText);
            }
        });
    },
    fnSetSpeciality: function (spec, txtname, hdnname) {
        var doctobj = jsonPath(DoctorAutofill_CV, "$.[?(@.label=='" + $('#' + txtname).val() + "')]");
        var id = txtname.split('_');
        $('#div_doc_speciality_Chemist_' + id[1]).show();
        if (doctobj != null && doctobj != false) {
            $('#txtDocSpeciality_Chemist_' + id[1]).val(doctobj[0].Speciality_Name);
            $('#hdnspecname_Chemist_' + id[1]).val(doctobj[0].Speciality_Code);
            $('#txtDocSpeciality_Chemist_' + id[1]).attr('disabled', 'disabled');
            $('#txtDocSpeciality_Chemist_' + id[1]).css('backgroundColor', '#f0f0f0');
            //$('#div_doc_speciality_Chemist_' + id[1]).hide();
            $("#lblCategory_" + id[1]).text(doctobj[0].Category);
        }
        else {
            if (spec != null && spec.length > 0) {
                $('#txtDocSpeciality_Chemist_' + id[1]).val(spec);
                var specialityCode = jsonPath(specialityAutoFill_g, "$.[?(@.label=='" + spec + "')]");
                $('#hdnspecname_Chemist_' + id[1]).val(specialityCode);
                $('#txtDocSpeciality_Chemist_' + id[1]).removeAttribute('disabled')
                $('#txtDocSpeciality_Chemist_' + id[1]).css('backgroundColor', '#fff');
                $('#hdnname' + id[1]).val("");
                $("#lblCategory_" + id[1]).text('-');

            }
            else {
                $('#txtDocSpeciality_Chemist_' + id[1]).val("");
                $('#hdnspecname_Chemist_' + id[1]).val("");
                $('#txtDocSpeciality_Chemist_' + id[1])[0].removeAttribute('disabled')
                $('#txtDocSpeciality_Chemist_' + id[1]).css('backgroundColor', '#fff');
                $('#hdnname' + id[1]).val("");
                $("#lblCategory_" + id[1]).text('-');
            }
        }
    },
    fnValidateChemist: function (obj) {
        debugger
        $('#txtChemistPOB_' + obj.id.split('_')[1]).focus();
        fnValidateAutofill(obj, DoctorAutofill_CV, 'txtChemRCPA', 'hdnChemRCPA');

        // 
        ChemistRCPA.fnSetSpeciality(true, obj.id, 'hdnChemRCPA_' + obj.id.split('_')[1])
        //if (doctorEntryMode_g.toUpperCase() == 'YES') {
        //    if ($.trim($('#hdnChemRCPA_' + obj.id.split('_')[1]).val()).length == 0 || $.trim($('#hdnChemRCPA_' + obj.id.split('_')[1]).val())=="" || $.trim($('#hdnChemRCPA_' + obj.id.split('_')[1]).val())==undefined) {
        //        fnMsgAlert('info', ChemAlertTitle, '' + DoctorHeader_g + ' Name.');
        //        return false;
        //    }
        //else {
        //    var docid=$.trim($('#hdnChemRCPA_' + obj.id.split('_')[1]).val()).trim();
        //    var docvalidJSON = jsonPath(DoctorAutofill_CV, "$.[?(@.value=='" + docid + "']");
        //        //& @.label=='" +  ($.trim$('#txtDocName').val() + "')]")));
        //    if (!docvalidJSON) {
        //        fnMsgAlert('info', ChemAlertTitle, 'Invalid ' + DoctorHeader_g + ' Name.');
        //        return false;
        //    }
        //}

        //   fnSetSpeciality(true,txtname,);
        //fnGetDoctorandCustomerSalesProducts(obj);
        //fnSetDoctorCoustomerLineofBusiness('doctor');
    },

    fnAddChemistRow: function (isDraft, curChemObject) {
        // Increment the row Index. Retrieve the row length and insert a new row.
        chemistRowIndexRCPA_g++;
        var tblChemistRowLength = $('#tbl_chemist_RCPA tr').length;

        var newChemistRow = document.getElementById('tbl_chemist_RCPA').insertRow(chemistRowIndexRCPA_g);
        newChemistRow.id = "chemRowRCPA" + chemistRowIndexRCPA_g;
        if (chemistRowIndexRCPA_g != 1)
            newChemistRow.style = "border-top: 1px solid rgb(0, 0, 0) !important;";
        // Chemist Name.
        var td1 = newChemistRow.insertCell(0);

        if (RCPA_g == "N") {
            if (isDraft) {
                $(td1).html("<div style='float: left;margin-right: 5px;'>" + DoctorHeader + " Name</div><div><input type='text' id='txtChemRCPA_" + chemistRowIndexRCPA_g + "'  class='autoChemist_cv txtchemisticon setfocus'  maxlength='50' onblur='ChemistRCPA.fnValidateChemist(this);' /><input type='hidden' id='hdnChemRCPA_" + chemistRowIndexRCPA_g + "' />");
            }
            else {
                // $(td1).html("<div style='float: left;margin-right: 5px;'>" + DoctorHeader + " Name</div><div><input type='text' id='txtChemRCPA_" + chemistRowIndexRCPA_g + "'  class='autoChemist_cv txtchemisticon setfocus' onkeyup='ChemistRCPA.fnAddChemistRow(null,this);' ondblclick='ChemistRCPA.fnAddChemistRow(null,this)'  maxlength='50' onblur='ChemistRCPA.fnValidateChemist(this);' /><input type='hidden' id='hdnChemRCPA_" + chemistRowIndexRCPA_g + "' />");
                $(td1).html("<div style='float: left;margin-right: 5px;'>" + DoctorHeader + " Name</div><div><input type='text' id='txtChemRCPA_" + chemistRowIndexRCPA_g + "'  class='autoChemist_cv txtchemisticon setfocus' maxlength='50' onblur='ChemistRCPA.fnValidateChemist(this);' /><input type='hidden' id='hdnChemRCPA_" + chemistRowIndexRCPA_g + "' />");
            }
        }
        else if (RCPA_g.toUpperCase() == "R") {
            if (isDraft) {
                var rcpaJSON = "";
                var htmlvalue = "<div style='float: left;margin-right: 5px;'>" + DoctorHeader + " Name</div><div><input type='text' id='txtChemRCPA_" + chemistRowIndexRCPA_g + "'  class='autoChemist_cv txtchemisticon setfocus' maxlength='50'  style='width:97%' onfocus='ChemistRCPA.hideRCPA(\"" + chemistRowIndexRCPA_g + "\")' onblur='ChemistRCPA.fnValidateChemist(this);' /><input type='hidden' id='hdnChemRCPA_" + chemistRowIndexRCPA_g + "' />";
                htmlvalue += "<div id='div_doc_speciality_Chemist_" + chemistRowIndexRCPA_g + "' class='rowdiv rcpa' style='display: none'> <div  class='column3' >";
                htmlvalue += " <label>Speciality </label> </div><div class='cloumn2' style='float:left;'> ";
                htmlvalue += "<input type='text' id='txtDocSpeciality_Chemist_" + chemistRowIndexRCPA_g + "' onblur='return fnCheckSpecialChar(this)' class='dcr_doc_spec_name_cv setfocus' /><input type='hidden' id='hdnspecname_Chemist_" + chemistRowIndexRCPA_g + "' />";
                htmlvalue += "</div> ";
                htmlvalue += "<div style='margin-left: 50%;'><label>Category : </label><abel id='lblCategory_" + chemistRowIndexRCPA_g + "'></label></div>";
                htmlvalue += "</div><br/>";
                htmlvalue += '<div id="divRCPAChemist_' + chemistRowIndexRCPA_g + '" style="background-color:#e4ecf3;width:99%;" >' + ChemistRCPA.fnCreateRCPA_CV(chemistRowIndexRCPA_g, rcpaJSON) + '</div>';
                //  htmlvalue += '<div class="addNewBtn"><input type="button" onclick="ChemistRCPA.fnAddChemistRow(null,this);" value="Add New RCPA"></div>';
                htmlvalue += '';
                $(td1).html(htmlvalue + "</div>");
                autoComplete(DoctorAutofill_CV, "txtChemRCPA", "hdnChemRCPA", "dcr_doctor_name");
            }
            else {
                var rcpaJSON = "";
                //var htmlvalue = '<input type="text" id="txtChemRCPA_' + chemistRowIndexRCPA_g + '"  class="autoChemist_cv txtchemisticon setfocus"  style="width:75%"  maxlength="50" onkeyup="fnAddChemistRow(null,this)" ondblclick="fnAddChemistRow(null,this)" onfocus="hideRCPA(\'' + chemistRowIndexRCPA_g + '\')" /><input type="hidden" id="hdnChemRCPA_' + chemistRowIndexRCPA_g + '" />';
                //var htmlvalue = '<input type="text" id="txtChemRCPA_' + chemistRowIndexRCPA_g + '"  class="autoChemist_cv txtchemisticon setfocus"  style="width:75%"  maxlength="50"  onfocus="hideRCPA(\'' + chemistRowIndexRCPA_g + '\')" /><input type="hidden" id="hdnChemRCPA_' + chemistRowIndexRCPA_g + '" />';
                //var htmlvalue = "<div style='float: left;margin-right: 5px;'>" + DoctorHeader + " Name</div><div><input type='text' id='txtChemRCPA_" + chemistRowIndexRCPA_g + "'  class='autoChemist_cv txtchemisticon setfocus' maxlength='50'  style='width:97%' onkeyup='ChemistRCPA.fnAddChemistRow(null,this)' ondblclick='ChemistRCPA.fnAddChemistRow(null,this)' onfocus='ChemistRCPA.hideRCPA(\"" + chemistRowIndexRCPA_g + "\")' onblur='ChemistRCPA.fnValidateChemist(this);' /><input type='hidden' id='hdnChemRCPA_" + chemistRowIndexRCPA_g + "' />";
                var htmlvalue = "<div style='float: left;margin-right: 5px;'>" + DoctorHeader + " Name</div><div><input type='text' id='txtChemRCPA_" + chemistRowIndexRCPA_g + "'  class='autoChemist_cv txtchemisticon setfocus' maxlength='50'  style='width:97%' onfocus='ChemistRCPA.hideRCPA(\"" + chemistRowIndexRCPA_g + "\")' onblur='ChemistRCPA.fnValidateChemist(this);' /><input type='hidden' id='hdnChemRCPA_" + chemistRowIndexRCPA_g + "' />";
                htmlvalue += "<div id='div_doc_speciality_Chemist_" + chemistRowIndexRCPA_g + "' class='rowdiv rcpa' style='display: none'> <div  class='column3' >";
                htmlvalue += " <label>Speciality </label> </div><div class='cloumn2' style='float:left;'>";
                htmlvalue += "<input type='text' id='txtDocSpeciality_Chemist_" + chemistRowIndexRCPA_g + "' onblur='return fnCheckSpecialChar(this)' class='dcr_doc_spec_name_cv setfocus' /><input type='hidden' id='hdnspecname_Chemist_" + chemistRowIndexRCPA_g + "' />";
                htmlvalue += "</div>";
                htmlvalue += "<div style='margin-left: 50%;'><label>Category : </label><abel id='lblCategory_" + chemistRowIndexRCPA_g + "'></label></div>";
                htmlvalue += "</div><br/>";
                htmlvalue += '<div id="divRCPAChemist_' + chemistRowIndexRCPA_g + '" style="background-color:#e4ecf3;width:95%;;" >' + ChemistRCPA.fnCreateRCPA_CV(chemistRowIndexRCPA_g, rcpaJSON) + '</div>';
                htmlvalue += '<div class="addNewBtn"><input type="button" onclick="ChemistRCPA.fnAddChemistRow(null,this);" value="Add New RCPA"></div>';
                $(td1).html(htmlvalue + "</div>");
                autoComplete(DoctorAutofill_CV, "txtChemRCPA", "hdnChemRCPA", "dcr_doctor_name");
            }

        }
        //$(td1).addClass('txtchemist');
        //td1.style.width = "100% !important";
        // Chemist POB.
        var td2 = newChemistRow.insertCell(1);
        $(td2).html('<input type="text" onfocus="ChemistRCPA.nxtfocus(' + chemistRowIndexRCPA_g + ')" id="txtChemistPOB_' + chemistRowIndexRCPA_g + '"style="vertical-align:top;"  valign="top" onblur="return fnCurrencyFormat(this, \'POB\')" />');
        $(td2).addClass('txtpob');
        $(td2).attr('align', 'center');
        td2.style.display = 'none';
        // Remove Icon.
        var td3 = newChemistRow.insertCell(2);
        $(td3).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="ChemistRCPA.fnDeleteChemistRow(' + chemistRowIndexRCPA_g + ')" />');
        $(td3).addClass('valign-top');
        $(td3).addClass('deleteRowIcon');

        if (curChemObject != null) {
            curChemObject.style.display = 'none';
            curChemObject.onkeyup = null;
            curChemObject.ondblclick = null;
        }
        if (DoctorAutofill_CV != null) {
            autoComplete(DoctorAutofill_CV, "txtChemRCPA", "hdnChemRCPA", "autoChemist_cv");
        }
        autoComplete(specialityAutoFill_g, "txtDocSpeciality_Chemist_", "hdnspecname_Chemist_", "dcr_doc_spec_name_cv");
        $(".setfocus").click(function () { $(this).select(); });

    },
    nxtfocus: function (id) {
        $('#divRCPAChemist_' + id).css('display', '');
        $('#txtchemRCPA_Prod_' + id + '1').focus();
    },
    fnshowRCPA: function (index) {
        document.getElementById("divRCPAChemist_" + index).style.display = '';
    },
    hideRCPA: function (index) {
        //for (var rIndex = 1; rIndex <= chemistRowIndexRCPA_g; rIndex++) {
        //    if (index != rIndex) {
        //        if ($('#divRCPAChemist_' + rIndex) != null) {
        //            $('#divRCPAChemist_' + rIndex).fadeOut("fast");
        //        }
        //    }
        //    else {
        //        if ($('#divRCPAChemist_' + rIndex) != null) {
        //            $('#divRCPAChemist_' + rIndex).fadeIn("fast");
        //        }
        //    }
        //}
    },

    fnRCPAInitialize: function () {

        DoctorAutofill_CV = doctorAutoFill_g;

        //for (var i = 0; i < DoctorAutofill_CV.length; i++) {
        //    DoctorAutofill_CV[i].label=doctorAutoFill_g[i].label.split('_')[0];

        //    }

        //fnGetDoctorsAndSetAutoFill();
        ChemistRCPA.fnAddChemistRow(null);
        try {
            $("#DocDisplayName").text(DoctorHeader);
        }
        catch (e) {
            //alert(e);
        }
    },
    fnDeleteChemistRow: function (index) {
        if (index == $('.autoChemist_cv').length) {
            //$.msgbox("You are not allowed to delete this row!");
            fnMsgAlert('info', ChemAlertTitle, 'You are not allowed to delete this row!');
            //alert("You didnt delete this row!");
        }
        else {
            if (confirm('Do you wish to delete the ' + DoctorHeader + '?')) {
                $('#chemRowRCPA' + index).css('display', 'none');
                try {
                    $('#chemRowRCPA' + (index + 1)).removeAttr('style');
                }
                catch (e) {
                }
            }

        }
    },
    fnAutoFillRCPA: function (listChemistRCPA) {
        if (listChemistRCPA != null) {

            for (var i = 1; i < listChemistRCPA.length; i++) {
                ChemistRCPA.fnAddChemistRow(null);
                $('#txtChemRCPA_' + i).val(listChemistRCPA[i - 1].Doctor_Name);
                $('#hdnChemRCPA_' + i).val(listChemistRCPA[i - 1].Doctor_Id);
                $('#txtChemistPOB_' + i).val(listChemistRCPA[i - 1].POB);
            }
        }
    },

    fnGetSaleProductsAndSetAutoFill: function () {
        $.ajax({
            type: 'POST',
            data: "dcrActualDate=" + dcrActualDate_g,
            url: '../DCRV4DoctorVisit/GetSaleProductsList',
            async: false,
            success: function (response) {
                // we have the response
                if (response != null && response.length > 0) {
                    RCPAProductAutofill_g = response;
                    //autoComplete(specialityAutoFill_g, "txtDocSpeciality", "hdnspecname", "dcr_doc_spec_name_cv");
                }
            },
            error: function (e) {
                // alert(e.responseText);
            }
        });
    },

    fnPrefill: function (chemistJson, rcpaJson, CompetitorJson) {

        //if (rcpaJson.length > 0) {
        //    for (var k = 0; k < rcpaJson.length; i++) {
        //        rcpaJson[k].Customer_Name = rcpaJson[k].Customer_Name.trim();

        //    }
        //}
        if (chemistJson.length > 0) {

            for (var crIndex = 1; crIndex <= chemistJson.length; crIndex++) {
                $('#divRCPAChemist_' + crIndex).next().hide();
                $('#' + 'txtChemRCPA_' + crIndex).val(unescape(chemistJson[crIndex - 1].Customer_Name));
                $('#' + 'hdnChemRCPA_' + crIndex).val(chemistJson[crIndex - 1].Customer_Code);
                $('#' + 'txtChemistPOB_' + crIndex).val(chemistJson[crIndex - 1].POB);
                $('#div_doc_speciality_Chemist_' + crIndex).show();
                var doctr = jsonPath(DoctorAutofill_CV, "$.[?(@.value =='" + chemistJson[crIndex - 1].Customer_Code + "')]");
                if (doctr != false) {


                    $('#txtDocSpeciality_Chemist_' + crIndex).val(doctr[0].Speciality_Name);
                    $('#txtDocSpeciality_Chemist_' + crIndex).attr('disabled', 'disabled');
                    $('#lblCategory_' + crIndex).text(doctr[0].Category);
                    //  $('#' + 'txtChemRCPA_' + crIndex).val((unescape(chemistJson[crIndex - 1].Customer_Name).concat("_" ,chemistJson[crIndex-1].Customer_Speciality_Name)));
                    $('#' + 'txtChemRCPA_' + crIndex).val((unescape(doctr[0].label)));
                    $('#' + 'txtChemRCPA_' + crIndex).css('backgroundColor', '#f0f0f0');
                }
                else {
                    $('#txtDocSpeciality_Chemist_' + crIndex).val(chemistJson[crIndex - 1].Customer_Speciality_Name);
                    $('#lblCategory_' + crIndex).text('-');
                }

                var chemistVisitCode = chemistJson[crIndex - 1].Customer_Name;
                var rcpaList = jsonPath(rcpaJson, "$.[?(@.Customer_Name =='" + chemistVisitCode + "')]");
                var saleProductRowIndex = 0;
                for (var rcIndex = 1; rcIndex <= rcpaList.length; rcIndex++) {
                    saleProductRowIndex++;

                    ChemistRCPA.fnAddSaleProductRow($('#txtchemRCPA_Prod_' + crIndex + '_' + saleProductRowIndex)[0]);


                    $('#' + 'txtchemRCPA_Prod_' + crIndex + '_' + saleProductRowIndex).val(rcpaList[rcIndex - 1].Product_Name);
                    $('#' + 'txtchemRCPA_Prod_Qty_' + crIndex + '_' + saleProductRowIndex).val(rcpaList[rcIndex - 1].Qty);
                    $('#' + 'hdnchemRCPA_Prod_' + crIndex + '_' + saleProductRowIndex).val(rcpaList[rcIndex - 1].Product_Code);
                    $('#' + 'txtremarks_' + crIndex + '_' + saleProductRowIndex).val(rcpaList[rcIndex - 1].Remarks);
                    $('#' + 'rxnumber_' + crIndex + '_' + saleProductRowIndex).val(rcpaList[rcIndex - 1].Rxnumber);
                    var compJSON = jsonPath(CompetitorJson, "$.[?(@.RCPA_OWN_Product_Id =='" + rcpaList[rcIndex - 1].RCPA_OWN_Product_Id + "')]")

                    if (compJSON.length > 0) {
                        var compRowIndex = 0;
                        for (var compIndex = 0; compIndex < compJSON.length; compIndex++) {
                            var compRowIndex = compIndex + 1;
                            if (compIndex == 0) {
                                $('#txtchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name)
                                $('#txtchemRCPA_Prod_compQty_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Qty)
                                var compautoFill = ""
                                //jsonPath(compAutoFill_g, "$.[?(@.RCPA_OWN_Product_Id=='" + rcpaList[rcIndex].RCPA_OWN_Product_Id + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
                                if (compautoFill) {
                                    $('#hdnchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
                                }
                                else {
                                    $('#hdnchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
                                }
                            }
                            else {
                                var preCompRowIndex = compRowIndex - 1;
                                ChemistRCPA.fnAddCompRow($('#txtchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + preCompRowIndex)[0])
                                $('#txtchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name);
                                var compautoFill = "";
                                //jsonPath(compAutoFill_g, "$.[?(@.RCPA_OWN_Product_Id=='" + rcpaList[rcIndex].RCPA_OWN_Product_Id + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
                                if (compautoFill) {
                                    $('#hdnchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
                                }
                                else {
                                    $('#hdnchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
                                }
                                $('#txtchemRCPA_Prod_compQty_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Qty)
                            }
                        }
                    }
                    if (compJSON.length > 0) {
                        ChemistRCPA.fnAddCompRow($('#txtchemRCPA_Prod_comp_' + crIndex + '_' + saleProductRowIndex + '_' + compRowIndex)[0])
                    }
                }
                //   ChemistRCPA.fnAddSaleProductRow($('#txtchemRCPA_Prod_' + crIndex + '_' + saleProductRowIndex+1)[0]);
                ChemistRCPA.hideRCPA(crIndex);
                ChemistRCPA.fnAddChemistRow(null);
            }


        }

    },


    //for (var crIndex = 0; crIndex < chemistJson.length; crIndex++) {
    //    cindex = crIndex;
    //    cindex = cindex + 1;
    //    // Doc(true, 'txtChem_' + cindex);
    //    $('#' + 'txtChemRCPA_' + cindex).val(unescape(chemistJson[crIndex].Chemist_Name));
    //    $('#' + 'hdnChemRCPA_' + cindex).val(chemistJson[crIndex].Chemist_Code);
    //    $('#' + 'txtChemistPOB_' + cindex).val(chemistJson[crIndex].POB_Amount);

    //    // Retrieves the chemist visit code.
    //    var chemistVisitCode = chemistJson[crIndex].DCR_Chemists_Code;

    //    if (RCPA_g == "R") {
    //        // Retrieves the given chemist rcpa details.
    //        var rcpaList = jsonPath(rcpaJson, "$.[?(@.Chemist_Visit_Code=='" + chemistVisitCode + "')]");

    //        if (rcpaList && rcpaList.length > 0) {
    //            // declare the variables.
    //            var prevProductCode;
    //            var saleProductRowIndex = 0;

    //            // looping the rcpa details.                
    //            for (var rcIndex = 0; rcIndex < rcpaList.length; rcIndex++) {

    //                // The 0 th index have default a rcpa Own Producttable, so we do not create a Own Producttable.
    //                // and the 0 th product code set the previous product code.
    //                // then check the next index dcr product code is same the previous product code, if same, we assume they are competitor row. so continue the statement.
    //                // if not equal we assume next product comming and create a Own Productrow.
    //                if (rcIndex != 0) {
    //                    if (prevProductCode != rcpaList[rcIndex].DCR_Product_Code) {
    //                        ChemistRCPA.fnAddSaleProductRow($('#txtchemRCPA_Prod_' + cindex + '_' + saleProductRowIndex)[0]);
    //                        saleProductRowIndex++;
    //                        $('#' + 'txtchemRCPA_Prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Product_Name);
    //                        $('#' + 'txtchemRCPA_prodQty_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Suuport_Qty);
    //                        $('#' + 'hdnchemRCPA_Prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].DCR_Product_Code);
    //                    }
    //                    else {
    //                        continue;
    //                    }
    //                }
    //                else {
    //                    saleProductRowIndex++;
    //                    $('#' + 'txtchemRCPA_Prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Product_Name);
    //                    $('#' + 'txtchemRCPA_prodQty_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Suuport_Qty);
    //                    $('#' + 'hdnchemRCPA_Prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].DCR_Product_Code);
    //                }

    //                // Retrieve the competitors for selected product.

    //                var compJSON = jsonPath(rcpaList, "$.[?(@.DCR_Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "')]");
    //                // set the prev product code. this is important.
    //                var prevProductCode = rcpaList[rcIndex].DCR_Product_Code;

    //                // Remove the product name as competitor.
    //                for (var i = 0; i < compJSON.length; i++) {
    //                    if (compJSON[i].Competitor_Product_Name == rcpaList[rcIndex].Product_Name) {
    //                        compJSON.splice(i, 1);
    //                    }
    //                }

    //                // looping the competitors.
    //                var compRowIndex = 0;
    //                for (var compIndex = 0; compIndex < compJSON.length; compIndex++) {
    //                    var compRowIndex = compIndex + 1;
    //                    // In 0 th index we have default competitor row. so we do not create competitor row.
    //                    if (compIndex == 0) {
    //                        $('#txtchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name)
    //                        $('#txtchemRCPA_Prod_compQty_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Suuport_Qty)
    //                        var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
    //                        if (compautoFill) {
    //                            $('#hdnchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
    //                        }
    //                        else {
    //                            $('#hdnchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
    //                        }
    //                    }
    //                    else {
    //                        var preCompRowIndex = compRowIndex - 1;
    //                        ChemistRCPA.fnAddCompRow($('#txtchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + preCompRowIndex)[0])
    //                        $('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name);
    //                        var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
    //                        if (compautoFill) {
    //                            $('#hdnchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
    //                        }
    //                        else {
    //                            $('#hdnchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
    //                        }
    //                        $('#txtchemRCPA_Prod_compQty_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Suuport_Qty)
    //                    }
    //                }

    //                // Creates a empty competitor row.
    //                if (compJSON.length > 0) {
    //                    ChemistRCPA.fnAddCompRow($('#txtchemRCPA_Prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex)[0])
    //                }
    //            }

    //            // Creates a empty Own Productrow.
    //            ChemistRCPA.fnAddSaleProductRow($('#txtchemRCPA_Prod_' + cindex + '_' + saleProductRowIndex)[0]);
    //        }
    //    }


    fnGetChemistRCPA: function () {
        debugger;
        var RCPAChemist = new Array();
        var RCPA = new Array();
        var Chemist = [];
        var PRod = [];
        //var Comperrtiors = [];
        var chem_Rows = $('#tbl_chemist tr');
        var chem_name = "";
        var chem_code = "";
        var chem_pob = "0";
        var chemistString = "";
        var rcpaString = "";
        var chem_count = 0;
        var is_Acc_Chemist = '0'
        var dcr_visit_code = '';
        var Docarr = new Array();
        var clientId = 0;
        var POB_CV = 0;
        debugger;

        for (var crowIndex = 1; crowIndex <= chemistRowIndexRCPA_g; crowIndex++) {

            POB_CV = 0;

            if (crowIndex == 0) {
                continue;
            }

            //    // check, the row is exist, if not continue the loop.
            if ($('#chemRowRCPA' + crowIndex).css('display') == 'none') {
                continue;
            }
            var chemNum = crowIndex;
            var inp_array = $('#chemRowRCPA' + crowIndex + ' input');
            // Chemist Name and Chemist Code.
            var compCodes = new Array();
            if ($.trim($(inp_array[0]).val()).length != 0) {
                chem_name = $(inp_array[0]).val();
                chem_code = $('#hdnChemRCPA_' + crowIndex).val();

                chem_pob = $('#txtChemistPOB_' + crowIndex).val();

                chem_count++;
                var chemNum = crowIndex;
                var inp_array = $('#chemRowRCPA' + crowIndex + ' input');
                // Chemist Name and Chemist Code.
                if ($.trim($(inp_array[0]).val()).length != 0) {
                    chem_name = $(inp_array[0]).val();
                    chem_code = $('#hdnChemRCPA_' + crowIndex).val();

                    chem_pob = $('#txtChemistPOB_' + crowIndex).val();

                    chem_count++;

                    //var specialCharregex = new RegExp("^[a-zA-Z0-9()._& ]+$");
                    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup0($(inp_array[0]))) {
                        //$.msgbox('Please remove the special characters for chemist.' + chem_name);
                        fnMsgAlert('info', ChemAlertTitle, 'Please remove the special characters for "' + chemistName +
                            " - " + chem_name + '". <br/> The following characters are only allowed -_.().');
                        fnErrorIndicator(inp_array[0]);
                        return false
                    }
                    else {
                        fnRemoveErrorIndicatior(inp_array[0]);
                    }
                    if (!fnCurrencyFormat($('#txtChemistPOB_' + crowIndex), "Chemist POB")) {
                        return false;
                    }
                    if (!fnCurrencyFormat($('#txtChemistPOB_' + crowIndex), "Chemist POB")) {
                        return false;
                    }


                    if (chem_code.length > 0) {
                        var chem_json = jsonPath(chemistAutoFill_g, "$.[?(@.value=='" + chem_code + "')]");
                        if (chem_json && chem_json.length > 0) {
                            is_Acc_Chemist = chem_json[0].Is_Acc_Chemist;
                        }
                    }

                    chem_pob = chem_pob.length > 0 ? chem_pob : 0;
                    if (chem_pob != null && chem_pob.length > 0) {
                        chem_pob = Math.round(chem_pob).toString();
                    }
                    var chemname_count = 0;
                    for (var i = 1; i <= $('#tbl_chemist_RCPA tr').length; i++) {
                        if (chem_name == $('#txtChemRCPA_' + i).val() && $('#txtChemRCPA_' + i).val().length != 0) {
                            if ($('#tbl_chemist_RCPA tr').length > 0 && $('#tbl_chemist_RCPA tr').length != null) {


                                if ($('#chemRowRCPA' + i).css('display') != 'none') {
                                    chemname_count++;
                                    if (chemname_count > 1) {
                                        //$.msgbox('The chemist ' + chem_name + ' already entered.');
                                        fnMsgAlert('info', ChemAlertTitle, 'The ' + chemistName + ' - ' + chem_name + ' already entered.');
                                        //alert('The chemist ' + chem_name + ' already entered.');
                                        return false;
                                    }
                                    //if ($('#hdnChemRCPA_' + crowIndex).val() == null || $('#hdnChemRCPA_' + crowIndex).val() == undefined || $('#hdnChemRCPA_' + crowIndex).val() == "") {

                                    Docarr.push(crowIndex);
                                    //}
                                    // else {
                                    //   Docarr.push($('#hdnChemRCPA_' + crowIndex).val());
                                    //}
                                }


                            }
                        }
                    }

                    //    RCPAChemist.push(Chemist);
                    var rcpaTablesCount = $('#divRCPAChemist_' + crowIndex + ' table').length;
                    //Hide add new row Btn

                    if (rcpaTablesCount == 1) {
                        if ($('#txtChemRCPA_' + crowIndex).val() != null && $('#txtChemRCPA_' + crowIndex).val() != "" && $('#txtChemRCPA_' + crowIndex).val() != undefined) {
                            var rcpaProduct = $('#txtchemRCPA_Prod_' + crowIndex + '_1').val();
                            if (rcpaProduct.length == 0 || rcpaProduct == "" || rcpaProduct == null) {
                                fnMsgAlert('info', ChemAlertTitle, "Enter  Own Product " + rcpaProduct + " for " + DoctorHeader_g + " - " + chem_name + ".");
                                return false;
                            }
                        }
                    }
                    else {
                        for (var rcpaRowIndex = 0; rcpaRowIndex < rcpaTablesCount; rcpaRowIndex++) {
                            var rcpaProduct = "";
                            var rcpaComp = "";
                            var rcpaCompQty = "";

                            var compCodes = new Array();
                            var chemist_Doc_RegionCode = Region_code_g;
                            //tblchem_prod_CHNUM_RCPANUM
                            var rcpaIndex = rcpaRowIndex + 1;
                            if ($('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val() != null && $('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val() != "" && $('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val() != undefined) {
                                var doctr = jsonPath(DoctorAutofill_CV, "$.[?(@.value =='" + $.trim($('#hdnChemRCPA_' + crowIndex).val()) + "')]");
                                if (doctr.length > 0)
                                    chemist_Doc_RegionCode = doctr[0].Doctor_Region_Code;
                                if (doctorEntryMode_g.toUpperCase() == 'YES') {

                                    if ($.trim($('#hdnChemRCPA_' + crowIndex).val()).length == 0 || $.trim($('#hdnChemRCPA_' + crowIndex).val()) == "" || $.trim($('#hdnChemRCPA_' + crowIndex).val()) == undefined) {
                                        // fnMsgAlert('info', ChemAlertTitle, '' + DoctorHeader_g + ' Name.');
                                        fnMsgAlert('info', ChemAlertTitle, "Invalid " + DoctorHeader_g + " - " + chem_name + ".");
                                        return false;
                                    }
                                }

                                Chemist = {};

                                var rcpaProductCode = $('#hdnchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val();
                                var rcpaProduct = $('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val();
                                if (rcpaProductCode.length == 0) {
                                    fnMsgAlert('info', ChemAlertTitle, "Invalid Own Product " + rcpaProduct + " for " + DoctorHeader_g + " - " + chem_name + ".");
                                    return false;
                                }
                                var rcpaComp = rcpaProduct;

                                // Retrieve the Product Qty.
                                // txtchem_prodQty_CHNUM_RCPANUM
                                rcpaCompQty = $('#txtchemRCPA_Prod_Qty_' + crowIndex + '_' + rcpaIndex).val();
                                //if (rcpaCompQty == 0 || rcpaCompQty == "0" || rcpaCompQty == "" || rcpaCompQty == null) {
                                //    debugger;
                                //    // rcpaCompQty = "0";
                                //    fnMsgAlert('info', ChemAlertTitle, " Please enter Quantity for Product " + rcpaProduct + ".");
                                //    return false;
                                //}
                                if (rcpaCompQty == "" || rcpaCompQty == null) {
                                    debugger;
                                    // rcpaCompQty = "0";
                                    fnMsgAlert('info', ChemAlertTitle, " Please enter Quantity for Product " + rcpaProduct + ".");
                                    return false;
                                }
                                else {
                                    var specialCharregex = new RegExp("^[0-9]+$");
                                    if (!specialCharregex.test(rcpaCompQty)) {
                                        fnMsgAlert('error', ChemAlertTitle, 'Please remove the special characters in Own Product Quantity box for Product' + rcpaProduct + '.');
                                        fnErrorIndicator($('#txtchemRCPA_Prod_Qty_' + crowIndex + '_' + rcpaIndex));
                                        return false
                                    }
                                    else {
                                        fnRemoveErrorIndicatior($('#txtchemRCPA_Prod_Qty_' + crowIndex + '_' + rcpaIndex));
                                    }
                                }
                                var rcpaProdCount = 0;
                                for (var index = 1; index <= rcpaTablesCount; index++) {
                                    if ($('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val() == $('#txtchemRCPA_Prod_' + crowIndex + '_' + index).val()) {
                                        rcpaProdCount++;
                                        if (rcpaProdCount > 1) {
                                            fnMsgAlert('info', ChemAlertTitle, 'The Own Product ' + rcpaProduct + ' already entered for ' + DoctorHeader_g + ' - ' + chem_name + '.');
                                            return false;
                                        }
                                    }
                                }
                                clientId++;
                                if (doctorEntryMode_g.toUpperCase() == "NO") {
                                    if ($('#txtDocSpeciality_Chemist_' + crowIndex).val() == "" || $('#txtDocSpeciality_Chemist_' + crowIndex).val() == undefined || $('#txtDocSpeciality_Chemist_' + crowIndex).val() == null) {

                                        fnMsgAlert('info', ChemAlertTitle, 'Please Enter Speciality for ' + DoctorHeader_g + ' - ' + chem_name + '.');
                                        return false;
                                    }
                                }
                                var doctr = jsonPath(doctorAutoFill_g, "$.[?(@.value =='" + $('#hdnChemRCPA_' + crowIndex).val() + "')]");
                                if (doctr == false) {
                                    if (doctorEntryMode_g.toUpperCase() == "YES") {
                                        fnMsgAlert('info', ChemAlertTitle, 'Please Select  ' + DoctorHeader_g + ' from the list .');
                                        return false;

                                    }
                                }
                                Chemist.Customer_Name = $('#txtChemRCPA_' + crowIndex).val().split('_')[0];
                                Chemist.Customer_Code = $('#hdnChemRCPA_' + crowIndex).val();
                                Chemist.Region_Code = chemist_Doc_RegionCode;
                                Chemist.Chemist_No = crowIndex;
                                Chemist.Customer_Speciality_Name = $('#txtDocSpeciality_Chemist_' + crowIndex).val();
                                if (POB_CV == 0) {
                                    Chemist.POB = $('#txtChemistPOB_' + crowIndex).val();
                                    POB_CV = 1;
                                }
                                else {
                                    Chemist.POB = 0;
                                }
                                if (doctr == false) {
                                    Chemist.Customer_Category_Name = "";
                                    Chemist.Customer_MDLNumber = "";
                                }
                                else {
                                    Chemist.Customer_Category_Name = doctr[0].Category;
                                    Chemist.Customer_MDLNumber = "";
                                }
                                debugger;
                                clientId.clientId = clientId;
                                Chemist.Product_Code = $('#hdnchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val();
                                Chemist.Product_Name = $('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).val();
                                Chemist.Qty = $('#txtchemRCPA_Prod_Qty_' + crowIndex + '_' + rcpaIndex).val();
                                Chemist.clientId = clientId;
                                Chemist.Remarks = $('#txtremarks_' + crowIndex + '_' + rcpaIndex).val();
                                Chemist.Rxnumber = $('#rxnumber_' + crowIndex + '_' + rcpaIndex).val();
                                RCPAChemist.push(Chemist);
                            }


                            // Retrieves the each table row length.(including competitor rows).
                            var rcpaRowLength = $('#tblchemRCPA_Prod_' + crowIndex + "_" + rcpaIndex + ' tr').length;
                            for (var k = 1; k < rcpaRowLength; k++) {
                                var j = k;
                                //if (k == 1) {
                                //    PRod = {};


                                //    PRod.Competitor_Product_Name = $('#txtchemRCPA_Prod_comp_' + crowIndex + '_' + k + '_' + k).val();
                                //    PRod.Competitor_Product_Code = $('#hdnchemRCPA_Prod_comp_' + crowIndex + '_' + k + '_' + k).val();
                                //    PRod.Qty = $('#txtchemRCPA_Prod_compQty_' + crowIndex + '_' + k + '_' + k).val();
                                //    PRod.clientId = clientId;
                                //    RCPA.push(PRod);
                                //}
                                j = k;
                                if (j < $('#tblchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex + ' tr').length) {
                                    if ($('#txtchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + k).val().length > 0) {
                                        //  for (j = 1; j <= $('#txtchemRCPA_Prod_comp_' + k + '_' + k + '_' + j).val().length; j++) {
                                        // j = j + 1;
                                        var rcpaComp = $('#txtchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + k).val();
                                        var rcpaCompCode = $('#hdnchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + k).val();
                                        var rcpaCompQty = $('#txtchemRCPA_Prod_compQty_' + crowIndex + '_' + rcpaIndex + '_' + k).val();

                                        if (rcpaComp.length > 0) {
                                            if ($('#txtchemRCPA_Prod_' + crowIndex + '_' + rcpaIndex).length == 0) {
                                                fnMsgAlert('info', 'Info', 'You cannot enter competitor prodcuts without sales product');
                                                return false;
                                            }
                                        }
                                        if (rcpaCompCode.length > 0) {
                                            if ($.inArray(rcpaCompCode, compCodes) > -1) {
                                                fnMsgAlert('info', ChemAlertTitle, 'The ' + rcpaComp + ' Competitor Product name more than once for product ' + rcpaProduct + '.');
                                                return false;
                                            }
                                            else {
                                                compCodes.push(rcpaCompCode);
                                            }
                                        }

                                        if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($('#txtchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + k))) {
                                            fnMsgAlert("info", ChemAlertTitle, "Please remove the special characters in Competitor Product " + rcpaComp + ". <br/>The following characters are only allowed <b>-_.</b>");
                                            return false;
                                        }
                                        if (rcpaCompCode.length > 0) {
                                            compCodes.push(rcpaCompCode);
                                        }
                                        if (rcpaCompQty.length == 0) {
                                            if (rcpaComp.length > 0) {
                                                fnMsgAlert('info', 'Info', 'Competitor product quantity cannot be empty if competitor name is present');
                                                return false;
                                            }
                                            else {
                                                rcpaCompQty = '';
                                            }
                                        }
                                        else {
                                            var specialCharregex = new RegExp("^[0-9]+$");
                                            if (!specialCharregex.test(rcpaCompQty)) {
                                                fnMsgAlert('error', ChemAlertTitle, 'Please remove the special characters in Competitor Product Qty box for Competitor Product.' + rcpaComp);
                                                fnErrorIndicator($('#txtchem_prod_compQty_' + crowIndex + '_' + rcpaIndex + '_' + k));
                                                return false
                                            }
                                            else {
                                                fnRemoveErrorIndicatior($('#txtchem_prod_compQty_' + crowIndex + '_' + rcpaIndex + '_' + k));
                                            }
                                        }

                                        PRod = {};
                                        //PRod.Product_Code = $('#hdnchemRCPA_Prod_' + crowIndex + '_' + k).val();
                                        //PRod.Product_Name = $('#txtchemRCPA_Prod_' + crowIndex + '_' + k).val();
                                        //PRod.Qty = $('#txtchemRCPA_Prod_Qty_' + crowIndex + '_' + k).val();
                                        if ($('#txtchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + j).val() != '') {
                                            debugger;
                                            if (Chemist.Product_Name != '') {
                                                PRod.Competitor_Product_Name = $('#txtchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + j).val();
                                                PRod.Competitor_Product_Code = $('#hdnchemRCPA_Prod_comp_' + crowIndex + '_' + rcpaIndex + '_' + j).val();
                                                PRod.Qty = $('#txtchemRCPA_Prod_compQty_' + crowIndex + '_' + rcpaIndex + '_' + j).val();
                                                PRod.clientId = clientId;
                                                //PRod.Remarks = $('#txtremarks_' + crowIndex + '_' + rcpaIndex + '_' + j).val();
                                                //PRod.Rxnumber = $('#rxnumber_' + crowIndex + '_' + rcpaIndex + '_' + j).val();
                                                RCPA.push(PRod);
                                            }
                                            else {
                                                fnMsgAlert('info', 'Info', 'There cannot be a competitor product wihout a sales product');
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                        }



                        //if ($.trim ($(inp_array [0]).val()).length != 0) {
                        //    if (RCPA_g.toUpperCase() == "R") {
                        //        var rcpaobj = {};
                        //        var rcpaResult = ChemkstRCPA.ReadRC(chemNum, chem_name, rcpaJSONArray, dcr_vkskt_code);
                        //        if (rcpaResult.toStrkng().length > 0) {
                        //            if (rcpaResult == false) {
                        //                return false;
                        //            }
                        //            else {
                        //                rcpaStrkng += rcpaResult;
                        //                //rcpaJSONArray.push(rcpaobj);
                        //            }
                        //        }

                        //    }
                        //}
                    }

                }

            }
        }
        if (Docarr.length > 0) {
            for (var docind = 0; docind < Docarr.length; docind++) {

                var Doc_SalProd = jsonPath(RCPAChemist, "$.[?(@.Chemist_No=='" + Docarr[docind] + "')]");
                if (Doc_SalProd == false) {
                    fnMsgAlert('info', ChemAlertTitle, 'Enter Own Product for ' + DoctorHeader_g + '-' + $('#txtChemRCPA_' + (docind + 1)).val());
                    return false;
                }

            }


        }
        //var rcpaMandatory = 1;
        ////= fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '0');
        //if (RCPAChemist.length < rcpaMandatory) {

        //    fnMsgAlert('info', ChemAlertTitle, "For " + rcpaMandatory + " " + DoctorHeader_g + ", you need to enter minimum of one RCPA entry.");
        //    return false;
        //}
        //else if (RCPAChemist.length < RCPA) {
        //    fnMsgAlert('info', ChemAlertTitle, "For " + rcpaMandatory + " " + DoctorHeader_g + ", you need to enter minimum of one RCPA entry.");
        //    return false;
        //}
        return [RCPAChemist, RCPA];
    },


    fnReadRcpaDetails: function (chemRowNum, chem_name, rcpaJSONArray, dcr_visit_code) {

        var rcpastr = "";
        var rcpaObject = $('#divRCPAChemist_' + chemRowNum + ' table')

        // RCPA Tables Count.
        var rcpaTablesCount = $('#divRCPAChemist_' + chemRowNum + ' table').length;
        for (var rcpaRowIndex = 0; rcpaRowIndex < rcpaTablesCount; rcpaRowIndex++) {
            var rcpaProduct = "";
            var rcpaComp = "";
            var rcpaCompQty = "";

            var compCodes = new Array();
            //tblRchemRCPA_Prod_CHNUM_RCPANUM
            var rcpaIndex = rcpaRowIndex + 1;

            // Retrieves the each table row length.(including Competitor Product rows).
            var rcpaRowLength = $('#tblchemRCPA_Prod_' + chemRowNum + "_" + rcpaIndex + ' tr').length;
            for (var rindex = 0; rindex < rcpaRowLength; rindex++) {
                var rcpaobj = {};
                //txtchem_prod_CHNUM_RCPANUM
                // Skip the header.
                if (rindex == 0) {
                    continue;
                }

                var rcpaNum = rindex;
                // if row no is 1.
                // Read the Product and the same product as Competitor Product and read the first row Competitor Product.
                if (rcpaNum == 1) {

                    if ($('#txtchemRCPA_Prod_' + chemRowNum + '_' + rcpaIndex)) {
                        // if product name length is not equal is 0. we read the product.
                        if ($('#txtchemRCPA_Prod_' + chemRowNum + '_' + rcpaIndex).val().length != 0) {

                            // Retrieve the product name.
                            rcpaProduct = $('#txtchemRCPA_Prod_' + chemRowNum + '_' + rcpaIndex).val();

                            // Retrieve the Product code and check is valid.
                            rcpaProductCode = $('#hdnchemRCPA_Prod_' + chemRowNum + '_' + rcpaIndex).val();
                            if (rcpaProductCode != undefined)
                                if (rcpaProductCode.length == 0) {
                                    fnMsgAlert('info', ChemAlertTitle, "Invalid Own Product " + rcpaProduct + " for " + chemistName + " - " + chem_name + ".");
                                    return false;
                                }

                            // set the product as Competitor Product.
                            rcpaComp = rcpaProduct;

                            // Retrieve the Product Qty.
                            // txtchem_prodQty_CHNUM_RCPANUM
                            rcpaCompQty = $('#txtchemRCPA_Prod_Qty_' + chemRowNum + '_' + rcpaIndex).val();
                            if (rcpaCompQty != undefined)
                                if (rcpaCompQty.length == 0) {
                                    rcpaCompQty = "0";
                                }
                                else {
                                    var specialCharregex = new RegExp("^[0-9]+$");
                                    if (!specialCharregex.test(rcpaCompQty)) {
                                        fnMsgAlert('error', ChemAlertTitle, 'Please remove the special characters in Own Product Quantity box for Product' + rcpaProduct + '.');
                                        fnErrorIndicator($('#txtchemRCPA_Prod_Qty_' + chemRowNum + '_' + rcpaIndex));
                                        return false
                                    }
                                    else {
                                        fnRemoveErrorIndicatior($('#txtchemRCPA_Prod_Qty_' + chemRowNum + '_' + rcpaIndex));
                                    }
                                }

                            var rcpaProdCount = 0;
                            for (var index = 1; index <= rcpaTablesCount - 1; index++) {
                                if ($('#txtchemRCPA_Prod_' + chemRowNum + '_' + rcpaIndex).val() == $('#txtchemRCPA_Prod_' + chemRowNum + '_' + index).val()) {
                                    rcpaProdCount++;
                                    if (rcpaProdCount > 1) {
                                        fnMsgAlert('info', ChemAlertTitle, 'The Own Product ' + rcpaProduct + ' already entered for ' + chemistName + ' - ' + chem_name + '.');
                                        return false;
                                    }
                                }
                            }

                            rcpaobj = {};
                            rcpaobj.DCR_Visit_Code = dcr_visit_code == "" ? null : dcr_visit_code;
                            rcpaobj.DCR_Product_Code = rcpaProductCode;// Product Code.
                            rcpaobj.Product_Name = rcpaProduct; // RCPA Product Name.
                            rcpaobj.Chemist_Visit_Code = chemRowNum; // chemist visit code.
                            rcpaobj.Product_Code = rcpaProductCode;// Product Code.
                            rcpaobj.Competitor_Product_Name = $.trim(rcpaProduct) == "" ? null : rcpaProduct; // rcpa comp name.
                            rcpaobj.Competitor_Product_Code = null;// rcpa comp code.
                            rcpaobj.Suuport_Qty = $.trim(rcpaCompQty) == "" ? "0" : rcpaCompQty// Qty.
                            // Concatenate the string.
                            rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaProductCode + "^";
                            rcpaJSONArray.push(rcpaobj);

                            // Read the first row Competitor Product name and qty.
                            if ($('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {


                                var rcpaComp = $('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                                var rcpaCompCode = $('#hdnchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                                var rcpaCompQty = $('#txtchemRCPA_Prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                                if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum))) {
                                    fnMsgAlert("info", ChemAlertTitle, "Please remove the special characters in Competitor Product " + rcpaComp + ". <br/>The following characters are only allowed <b>-_.</b>");
                                    return false;
                                }

                                if (rcpaCompCode.length > 0) {
                                    compCodes.push(rcpaCompCode);
                                }
                                if (rcpaCompQty.length == 0) {
                                    rcpaCompQty = "0";
                                }
                                else {
                                    var specialCharregex = new RegExp("^[0-9]+$");
                                    if (!specialCharregex.test(rcpaCompQty)) {
                                        fnMsgAlert('error', ChemAlertTitle, 'Please remove the special characters in Competitor Product Qty box for Competitor .' + rcpaComp);
                                        fnErrorIndicator($('#txtchemRCPA_Prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                        return false
                                    }
                                    else {
                                        fnRemoveErrorIndicatior($('#txtchemRCPA_Prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                    }
                                }
                            }
                            else {
                                // if first row Competitor Product length is 0. loop is continue.
                                continue;
                            }
                        }
                        else {
                            // if first row product length is 0. loop is continue go to next product.

                            break;
                        }
                    }
                }
                else {
                    //txtchem_prod_compQty_CHNUM_RCPANUM_1
                    // Read the other competitors row.
                    try {
                        if ($('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {
                            var rcpaComp = $('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            var rcpaCompCode = $('#hdnchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            var rcpaCompQty = $('#txtchemRCPA_Prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            if (rcpaCompCode.length > 0) {
                                if ($.inArray(rcpaCompCode, compCodes) > -1) {
                                    fnMsgAlert('info', ChemAlertTitle, 'The ' + rcpaComp + ' Competitor Product name more than once for product ' + rcpaProduct + '.');
                                    return false;
                                }
                                else {
                                    compCodes.push(rcpaCompCode);
                                }
                            }
                            var specialCharregex = new RegExp("^[-a-zA-Z0-9 _().]+$");
                            rcpaComp = rcpaComp.replace(/\'/g, ' ');
                            if (!specialCharregex.test(rcpaComp)) {
                                fnMsgAlert('info', ChemAlertTitle, 'Please remove the special characters for Competitor Product.' + rcpaComp);
                                fnErrorIndicator($('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                return false
                            }
                            else {
                                fnRemoveErrorIndicatior($('#txtchemRCPA_Prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                            }
                            if (rcpaCompQty.length == 0) {
                                rcpaCompQty = "0";
                            }
                            else {
                                var specialCharregex = new RegExp("^[0-9]+$");
                                if (!specialCharregex.test(rcpaCompQty)) {
                                    fnMsgAlert('error', ChemAlertTitle, 'Please remove the special characters in competitor Qty box for competitor.' + rcpaComp);
                                    fnErrorIndicator($('#txtchemRCPA_Prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                    return false
                                }
                                else {
                                    fnRemoveErrorIndicatior($('#txtchemRCPA_Prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                }
                            }

                        }
                        else {
                            // if competitor row length is 0. Continue next row.
                            continue;
                        }
                    } catch (e) {
                    }
                }
                rcpaobj = {};
                rcpaobj.DCR_Visit_Code = dcr_visit_code == "" ? null : dcr_visit_code;
                rcpaobj.DCR_Product_Code = rcpaProductCode;// Product Code.
                rcpaobj.Product_Name = rcpaProduct; // RCPA Product Name.
                rcpaobj.Chemist_Visit_Code = chemRowNum; // chemist visit code.
                rcpaobj.Product_Code = null;// Product Code.
                rcpaobj.Competitor_Product_Name = $.trim(rcpaComp) == "" ? null : rcpaComp; // rcpa comp name.
                rcpaobj.Competitor_Product_Code = rcpaCompCode == "" ? null : rcpaCompCode// rcpa comp code.
                rcpaobj.Suuport_Qty = $.trim(rcpaCompQty) == "" ? "0" : rcpaCompQty;// Qty.
                rcpaJSONArray.push(rcpaobj);
                rcpastr += escape(chem_name) + "^" + escape(rcpaProduct) + "^" + rcpaProductCode + "^" + escape(rcpaComp) + "^" + rcpaCompQty + "^" + rcpaCompCode + "^";
            }
        }
        return rcpastr;

    },

    fnValidateComp: function (ctl) {
        debugger;
        var compIdArr = ctl.id.split('_');
        var cheindex = compIdArr[3];
        var rcpaindex = compIdArr[4];
        //ChemistRCPA.fnGetCompetitorsFromSales(compIdArr[0] + '_' + compIdArr[1] + '_' + compIdArr[3] + '_' + compIdArr[4]);
        if (ctl.value != '') {
            // var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
            var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
            if (compautoFill) {
                $('#' + ctl.id.replace('txt', 'hdn')).val(compautoFill[0].value);
                //ctl.id.replace('txt', 'hdn').value = compautoFill[0].value;
            }
            else {
                var pc = $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val();
                var lst = $.grep(compAutoFill_g[0], function (v) {
                    return v.Product_Code == pc && v.Record_Status == 1;
                });
                if (lst.length > 0) {
                    $('#' + ctl.id).val('');
                    $('#' + ctl.id.replace('txt', 'hdn')).val('');
                    //fnMsgAlert('info', 'Info', 'You cannot enter flexi products when competitor products are present');
                    //return false;
                }
                else {
                    $('#' + ctl.id.replace('txt', 'hdn')).val('');
                }
            }
        }
        else {
            $('#' + ctl.id.replace('txt', 'hdn')).val('');
        }
    },

    //fnValidateComp: function (ctl) {
    //    debugger;
    //    var compIdArr = ctl.id.split('_');
    //    var cheindex = compIdArr[3];
    //    var rcpaindex = compIdArr[4];
    //    //fnGetCompetitorsFromSales(compIdArr[0] + '_' + compIdArr[1] + '_' + compIdArr[3] + '_' + compIdArr[4]);
    //    if (ctl.value != '') {
    //        // var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
    //        var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
    //        if (compautoFill) {
    //            $('#' + ctl.id.replace('txt', 'hdn')).val(compautoFill[0].value);
    //            //ctl.id.replace('txt', 'hdn').value = compautoFill[0].value;
    //        }
    //        else {
    //            var pc = $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val();
    //            var lst = $.grep(compAutoFill_g[0], function (v) {
    //                return v.Product_Code == pc && v.Record_Status == 1;
    //            });
    //            if (lst.length > 0) {
    //                $('#' + ctl.id).val('');
    //                $('#' + ctl.id.replace('txt', 'hdn')).val('');
    //                //fnMsgAlert('info', 'Info', 'You cannot enter flexi products when competitor products are present');
    //                //return false;
    //            }
    //            else {
    //                $('#' + ctl.id.replace('txt', 'hdn')).val('');
    //            }
    //        }
    //    }
    //    else {
    //        $('#' + ctl.id.replace('txt', 'hdn')).val('');
    //    }
    //},

    //fnAddCompRow: function (ctl) {
    //    debugger;
    //    var compIdArr = ctl.id.split('_');
    //    var compRow = compIdArr[5];
    //    var prodTblId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[3] + "_" + compIdArr[4]; //ctl.id.replace('txt', 'tbl').substring(0, ctl.id.lastIndexOf('_'));
    //    prodTblId = prodTblId.replace('txt', 'tbl');

    //    var tblCompRowLength = $('#' + prodTblId + ' tr').length;
    //    var newCompRow = document.getElementById(prodTblId).insertRow(parseInt(tblCompRowLength));
    //    var tdcomp1 = newCompRow.insertCell(0);
    //    $(tdcomp1).html('&nbsp;');

    //    var tdcomp2 = newCompRow.insertCell(1);
    //    $(tdcomp2).html('&nbsp;');

    //    var tdcomp3 = newCompRow.insertCell(2);
    //    compRow = parseInt(compRow) + 1;
    //    var newcompId = ctl.id.substring(0, ctl.id.lastIndexOf('_')) + "_" + compRow.toString();
    //    $(tdcomp3).html('<input type="text" id="' + newcompId + '" onkeyup="fnAddCompRow(this)" onblur="fnValidateComp(this)" class="checkspecialchar txtcomp newAddCompRow setfocus autoComp_' + compIdArr[3] + '_' + compIdArr[4] + '"  />');


    //    var tdcomp4 = newCompRow.insertCell(3);
    //    var newcompQtyId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[2] + "Qty_" + compIdArr[3] + "_" + compIdArr[4] + "_" + compRow.toString();
    //    var hdnCompId = newcompId.replace('txt', 'hdn');
    //    $(tdcomp4).html('<input type="text" id="' + newcompQtyId + '" class="setfocus" style="width:25px !important; " /><input type="hidden" onblur="fnValidateComp(this)" id="' + hdnCompId + '"  />');

    //    if (!$("#" + newcompQtyId).hasClass("checkinteger")) {
    //        $("#" + newcompQtyId).addClass("checkinteger");
    //    }

    //    $("#" + newcompQtyId).keyup(function () {
    //        return fnIsNumber(event)
    //    });
    //    autoComplete(chemistAutoFill_g, "txtChem_", "hdnChem_", "autoChemist");
    //    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "')]");
    //    var lst = $.grep(compAutoFill_g[0], function (v) {
    //        return v.Product_Code == $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() && v.Record_Status == 1;
    //    });
    //    autoComplete(lst, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + compIdArr[3] + '_' + compIdArr[4]);
    //    ctl.onkeyup = null;
    //    $(".checkspecialchar").blur(function () {
    //        fnCheckSpecialChar(this);
    //    });
    //    $(".checkinteger").blur(function () {
    //        $(this).blur(function () {
    //            fnChekInteger(this)
    //        });
    //    });
    //    $(".setfocus").click(function () {
    //        this.select;
    //    });


    //},
    fnAddCompRow: function (ctl) {
        debugger
        var compIdArr = ctl.id.split('_');
        var compRow = compIdArr[5];
        var prodTblId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[3] + "_" + compIdArr[4]; //ctl.id.replace('txt', 'tbl').substring(0, ctl.id.lastIndexOf('_'));
        prodTblId = prodTblId.replace('txt', 'tbl');

        var tblCompRowLength = $('#' + prodTblId + ' tr').length;
        var newCompRow = document.getElementById(prodTblId).insertRow(parseInt(tblCompRowLength));
        var tdcomp1 = newCompRow.insertCell(0);
        $(tdcomp1).html('&nbsp;');

        var tdcomp2 = newCompRow.insertCell(1);
        $(tdcomp2).html('&nbsp;');

        var tdcomp3 = newCompRow.insertCell(2);
        compRow = parseInt(compRow) + 1;
        var newcompId = ctl.id.substring(0, ctl.id.lastIndexOf('_')) + "_" + compRow.toString();
        $(tdcomp3).html('<input type="text" id="' + newcompId + '" onkeyup="ChemistRCPA.fnAddCompRow(this)" onblur="ChemistRCPA.fnValidateComp(this)" class="checkspecialchar txtcomp newAddCompRow setfocus autoComp_' + compIdArr[3] + '_' + compIdArr[4] + '"  />');


        var tdcomp4 = newCompRow.insertCell(3);
        var newcompQtyId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[2] + "Qty_" + compIdArr[3] + "_" + compIdArr[4] + "_" + compRow.toString();
        var hdnCompId = newcompId.replace('txt', 'hdn');
        $(tdcomp4).html('<input type="text" id="' + newcompQtyId + '" class="setfocus" style="width:25px !important; " /><input type="hidden" onblur="ChemistRCPA.fnValidateComp(this)" id="' + hdnCompId + '"  />');

        if (!$("#" + newcompQtyId).hasClass("checkinteger")) {
            $("#" + newcompQtyId).addClass("checkinteger");
        }

        $("#" + newcompQtyId).keyup(function () { return ChemistRCPA.fnIsNumber(event) });
        autoComplete(DoctorAutofill_CV, "txtChemRCPA", "hdnChemRCPA", "autoChemist_cv");
        //var compautoFill = jsonPath(lst, "$.[?(@.Product_Code=='" + $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "')]");

        var lst = $.grep(compAutoFill_g[0], function (v) {
            return v.Product_Code == $('#hdnchemRCPA_Prod_' + compIdArr[3] + '_' + compIdArr[4]).val() && v.Record_Status == 1;
        });
        autoComplete(lst, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + compIdArr[3] + '_' + compIdArr[4]);
        ctl.onkeyup = null;
        $(".checkspecialchar").blur(function () { fnCheckSpecialChar(this); });
        $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });
        $(".setfocus").click(function () { this.select; });


    },
    fnAddSaleProductRow: function (salProdRow) {
        //tblRchemRCPA_Prod_CHNUM_RCPANUM
        var idArr = salProdRow.id.split('_');
        debugger;
        var chemistIndex = idArr[2];
        var rcpaIndex = idArr[3]
        var rcpaTable = rcpaTableStringRCP_g.replace(/CHNUM/g, chemistIndex).replace(/RCPANUM/g, ++rcpaIndex);
        var div1 = document.createElement('div');
        div1.innerHTML = rcpaTable;
        document.getElementById('divRCPAChemist_' + chemistIndex).appendChild(div1);
        if (salProdRow != null) {
            salProdRow.onkeyup = null;
            salProdRow.ondblclick = null;
        }
        $('#divRCPAChemist_' + chemistIndex).show();
        autoComplete(RCPAProductAutofill_g, "txtchemRCPA_Prod", "hdnchemRCPA_Prod", "autoRCPA");
        $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });

    },
    fnIsNumber: function (evt) {
        debugger;
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },
    fnCreateRCPA_CV: function (chemistIndex, rcpaJSON) {
        var rcpaTableIndex = 1;
        var rcpatable = "";

        var rcpaCount = 0;
        rcpaJSON = "";
        // jsonPath(jsonContent[3].Data, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
        //rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;

        var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";
        rcpaTableStringRCP_g = "<table id='tblchemRCPA_Prod_CHNUM_RCPANUM' cellpadding='0' cellspacing='0' border='0' style='width:100%;overflow:hidden' class='rcpaTable_CV'  >";
        rcpaTableStringRCP_g += "<tr class='rcpaheader'><td><label>Own Product</label></td><td><label>Quantity</label></td><td><label>Competitor Product</label></td><td><label>Quantity</label></td><td><label>Remarks</label></td><td><label>Rx Number</label></td></tr>";
        rcpaTableStringRCP_g += "<tr><td class='tdsaleprod chemistDay' style='width:40%'><input type='text' id='txtchemRCPA_Prod_CHNUM_RCPANUM' onkeyup='ChemistRCPA.fnAddSaleProductRow(this)' ondblclick='ChemistRCPA.fnAddSaleProductRow(this)' onblur ='fnValidateAutofill(this," + 'RCPAProductAutofill_g' + ",\"txtchemRCPA_Prod_\",\"hdnchemRCPA_Prod_\");ChemistRCPA.fnGetCompetitors(this);' ";
        rcpaTableStringRCP_g += "class='txtsaleprod autoRCPA  setfocus'  maxlength='299' style='width:94% !important;'  /></td>";
        rcpaTableStringRCP_g += "<td style='width:10% !important'><input type='text' id='txtchemRCPA_Prod_Qty_CHNUM_RCPANUM' onkeyup='return ChemistRCPA.fnIsNumber(event)' style='width:75% !important;' class='checkinteger setfocus' maxlength='3' /></td>";
        rcpaTableStringRCP_g += "<td class='tdcomp' style='width:40%'><input type='text' id='txtchemRCPA_Prod_comp_CHNUM_RCPANUM_1' class='autoComp_CHNUM_RCPANUM' onkeyup='ChemistRCPA.fnAddCompRow(this)' onblur='ChemistRCPA.fnValidateComp(this)' class=' txtcomp' maxlength='50' style='width:94%;' />";
        rcpaTableStringRCP_g += "<input type='hidden' id='hdnchemRCPA_Prod_CHNUM_RCPANUM' /></td>";
        rcpaTableStringRCP_g += "<td><input type='text' id='txtchemRCPA_Prod_compQty_CHNUM_RCPANUM_1' class='checkinteger txtcompqty setfocus' onkeyup='return ChemistRCPA.fnIsNumber(event)' maxlength='3' style='width: 38% !important;'  />";
        rcpaTableStringRCP_g += "<input type='hidden' id='hdnchemRCPA_Prod_comp_CHNUM_RCPANUM_1'  /></td>";
        rcpaTableStringRCP_g += "<td><textarea id='txtremarks_CHNUM_RCPANUM' style='margin-left:-15px;margin-bottom:-15px;'></textarea></td>";
        rcpaTableStringRCP_g += "<td><input type='text' id='rxnumber_CHNUM_RCPANUM' class='checkinteger txtcompqty setfocus' onkeyup='return ChemistRCPA.fnIsNumber(event)' maxlength='6' style='width: 79% !important;'></td>";
        rcpaTableStringRCP_g += "</tr>";
        rcpaTableStringRCP_g += "</table>";
        var aRESULT = {};
        if (rcpaJSON != null && rcpaJSON.length > 0) {
            // TO DO: Create a RCPA table in Draft mode.

        }
        else {
            rcpatable = rcpaTableStringRCP_g.replace(/CHNUM/g, chemistIndex).replace(/RCPANUM/g, rcpaTableIndex);
            if (RCPAProductAutofill_g != null) {
                autoComplete(RCPAProductAutofill_g, "txtchemRCPA_Prod", "hdnchemRCPA_Prod", "autoRCPA");
            }
        }
        return rcpatable;
    },

    fnGetCompetitors: function (obj) {

        debugger;
        var saleProductCode = $('#' + obj.id.replace('txt', 'hdn')).val();
        var tblObj = $('#' + obj.id.replace('txt', 'tbl'))
        var indexArray = tblObj["selector"].split('_');
        //tblObj[0].id.split('_');
        var cheindex = indexArray[2];
        var rcpaindex = indexArray[3];

        $('#txtchemRCPA_Prod_Qty_' + cheindex + '_' + rcpaindex).val('');
        for (var i = 1; i < tblObj[0].rows.length; i++) {
            $('#txtchemRCPA_Prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).unautocomplete();
            $('#txtchemRCPA_Prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
            $('#hdnchemRCPA_Prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
            $('#txtchemRCPA_Prod_compQty_' + cheindex + '_' + rcpaindex + '_' + i).val('');
        }

        var lst = $.grep(compAutoFill_g[0], function (v) {
            return v.Product_Code == saleProductCode && v.Record_Status == 1;
        });
        if (lst != null && lst.length > 0) {

            
            
            autoComplete(lst, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
            //$.ajax({
            //    type: 'POST',
            //    url: '../HiDoctor_Activity/DCRDoctorVisit/GetCompetitorsName',
            //    data: 'saleproductcode=' + saleProductCode + '^' + '&dcrActualDate=' + dcrActualDate_g,
            //    success: function (response) {
            //        compAutoFill_g = [];
            //        // we have the response
            //        compAutoFill_g.push(response)
            //        res_g = response;

            //        autoComplete(response, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);

            //    },
            //    error: function (e) {
            //        //$.msgbox();

            //        fnMsgAlert('error', screenTitle, 'Retrieve the Competitor failed.');
            //    }
            //});
        }
        else {
            var cheindex = indexArray[2];
            var rcpaindex = indexArray[3];
            autoComplete(lst, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
            //autoComplete(lst, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
        }
    },

    fnGetCompetitorsFromSales: function (obj) {

        debugger;
        $.blockUI();
        obj = obj.id.split('_')[0] + '_' + obj.id.split('_')[1] + '_' + obj.id.split('_')[3] + '_' + obj.id.split('_')[4];
        obj = obj.replace('txt', 'hdn');
        var saleProductCode = $('#' + obj.replace('txt', 'hdn')).val();
        var tblObj = $('#' + obj.replace('txt', 'tbl'))
        var indexArray = tblObj["selector"].split('_');
        //tblObj[0].id.split('_');
        var cheindex = indexArray[2];
        var rcpaindex = indexArray[3];
        //for (var i = 1; i < tblObj[0].rows.length; i++) {
        //    $('#txtchemRCPA_Prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).unautocomplete();
        //    $('#txtchemRCPA_Prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
        //    $('#hdnchemRCPA_Prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
        //}

        var lst = $.grep(compAutoFill_g[0], function (v) {
            return v.Product_Code == saleProductCode && Record_Status == 1;
        });
        if (lst != null && lst.length > 0) {
            autoComplete(lst, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
            //$.ajax({
            //    type: 'POST',
            //    url: '../HiDoctor_Activity/DCRDoctorVisit/GetCompetitorsName',
            //    data: 'saleproductcode=' + saleProductCode + '^' + '&dcrActualDate=' + dcrActualDate_g,
            //    success: function (response) {
            //        compAutoFill_g = [];
            //        // we have the response
            //        compAutoFill_g.push(response)
            //        res_g = response;

            //        autoComplete(response, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);

            //    },
            //    error: function (e) {
            //        //$.msgbox();

            //        fnMsgAlert('error', screenTitle, 'Retrieve the Competitor failed.');
            //    }
            //});
        }
        else {
            var cheindex = indexArray[2];
            var rcpaindex = indexArray[3];
            autoComplete(lst, 'txtchemRCPA_Prod_comp_', 'hdnchemRCPA_Prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
        }
        $.unblockUI();
    },
    fnClear: function () {
        //$('#RCPA_Chemist').hide();
        //$('#tbl_chemist_RCPA tr').remove();
        //chemistRowIndexRCPA_g = 0;
        $("#tbl_chemist_RCPA").find("tr:gt(0)").remove();
        chemistRowIndexRCPA_g = 0;
        ChemistRCPA.fnRCPAInitialize();
    },
    fnCheckRCPA: function () {
        var rValue = true;
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/DCRV4ChemistVisit/GetRCPA_ChemistPrevilageCheck',
            data: 'DCR_Date=' + dcrActualDate_g,
            async: false,
            success: function (response) {
                if (response == 0) {
                    fnMsgAlert('info', ChemAlertTitle, "For " + fnGetPrivilegeValue("RCPA_MANDATORY_DOCTOR_CATEGORY", "") + " " + DoctorHeader_g + "" + " ,you need to enter minimum of one RCPA entry.");
                    rValue = false;
                }

            }

        });
        return rValue;
    }

}