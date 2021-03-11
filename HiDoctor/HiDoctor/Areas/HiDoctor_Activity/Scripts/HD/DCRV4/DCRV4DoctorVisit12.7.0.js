var productRowIndex_g = 0;
var chemistRowIndex_g = 0;
var detailedRowIndex_g = 0;
var doctorAccRowIndex_g = 0;
var FollowUpRowIndex_g = 0;
var SalesProductTableIndex = 0;
var Survey_Id = '';
var CompanyId = '';
var UserCode = '';
var UserName = '';
var RegionCode = '';
var RegionName = '';
var lschemist_CV = [];
POBRowIndex_g = 0;
var Comptetitorcount_g = 0;
var spc = '';
var hdncompdetails = '';
var compProductName = '';
var prefilldata = '';
var addnewcomp = 1;
var prodcode = '';
var detailedCompprod_g = '';
var specialityCode = '';
SalesProductTableIndex = 0;
var maxCode_g = "";
var gridRowNo_g = 0;
var cpDoctorSave_g = false;
var screenTitle = "Doctor/Customer & Sample/Promotional items";
var docAlertTitle = "Doctor/Customer Details";
var docAccAlertTitle = "Accompanist Details";
var docSampleAlertTitle = "Sample/Promotional items";
var docDetProdAlertTitle = "Detailed Products";
var docCheRCPAAlertTitle = "Chemist/RCPA Details";
var docFollowUps = 'Follow-Ups';
var docActivityTitle = 'Activity';
var dcoSalesProductsTitle = 'Product Name';
var compAutoFill_g = new Array();
var accAutoFill_g = new Array();
var doc_Visit_Controls_g = new Array();
var ActivityAutoFill_g = new Array();
var MCDetails_g = new Array();
var CMEDetails_g = new Array();
var MCActivityDetails_g = new Array();
var CallObjective_g = new Array();
//var detailedProductsAutoFillWithColor_g = new Array();
var acc_privilege_name = "ACCOMPANIST";
var sample_privilege_name = "SAMPLES";
var detailing_privilege_name = "DETAILING";
var chemist_privilege_name = "RCPA";
var pob_privilege_name = "POB";
var attachment_privilege_name = "ATTACHMENTS";
var followup_privilege_name = "FOLLOW-UP";
var activity_privilege_name = "ACTIVITY";
var Product_BusinessStatus = new Array();
var Under_Region_list_g;
var doctors_g = "";
var docdetails_g = "";
var acc_Regions_g = "";
var StockistHeader_g = "Stockist";
var allowCharacterinRemarks = "-_.,()@";
var restrictedSpecialchar_g = "/\+^%$#@!~{}'><=";
var rcpaTableString_g = "<table id='tblchem_prod_CHNUM_RCPANUM' cellpadding='0' cellspacing='0' border='0' style='width:99%;overflow:hidden' class='rcpaTable'  >";
rcpaTableString_g += "<tr class='rcpaheader'><td><label>Own Product</label></td><td><label>Quantity</label></td><td><label>Competitor Product</label></td><td><label>Quantity</label></td></tr>";
rcpaTableString_g += "<tr><td class='tdsaleprod' style='width:40%'><input type='text' id='txtchem_prod_CHNUM_RCPANUM' onkeyup='fnAddSaleProductRow(this)' ondblclick='fnAddSaleProductRow(this)' onblur ='fnValidateAutofill(this," + 'RCPAProductAutofill_g' + ",\"txtchem_prod_\",\"hdnchem_prod_\");fnGetCompetitors(this);' ";
rcpaTableString_g += "class='txtsaleprod autoRCPA  setfocus'  maxlength='299' style='width:94% !important;'  /></td>";
rcpaTableString_g += "<td style='width:10% !important'><input type='text' id='txtchem_prodQty_CHNUM_RCPANUM' onkeyup='return fnIsNumber(event)' style='width:75% !important;' class='checkinteger setfocus' maxlength='3' /></td>";
rcpaTableString_g += "<td class='tdcomp' style='width:40%'><input type='text' id='txtchem_prod_comp_CHNUM_RCPANUM_1' class='autoComp_CHNUM_RCPANUM' onkeyup='fnAddCompRow(this)' onblur='fnValidateComp(this)' class=' txtcomp' maxlength='50' style='width:94%;' />";
rcpaTableString_g += "<input type='hidden' id='hdnchem_prod_CHNUM_RCPANUM' /></td>";
rcpaTableString_g += "<td><input type='text' id='txtchem_prod_compQty_CHNUM_RCPANUM_1' class='checkinteger txtcompqty setfocus' onkeyup='return fnIsNumber(event)' maxlength='3' style='width:35% !important; '  />";
rcpaTableString_g += "<input type='hidden' id='hdnchem_prod_comp_CHNUM_RCPANUM_1'  /></td></tr>";
rcpaTableString_g += "</table>";
var aRESULT = {};
aRESULT.Result_Code = 0;
aRESULT.Result_Text = "";
aRESULT.ResultPass = "PASS";
aRESULT.ResultFail = "FAIL";
var CompanyCode = '';
var doctorjson_g = '';
var objColorPrivilege = "";
var id = "";

function fnGetAccompanistAutofill() {
    if (acc_g != null) {
        for (var a = 0; a < acc_g.length; a++) {
            var acc = {};
            acc.label = acc_g[a].accName;
            acc.value = acc_g[a].accCode;
            accAutoFill_g.push(acc);
        }
    }
    try {
        //Bind current userCode
        fnGetCurrentUserCode();
    }
    catch (err) {
    }
    //Bind user and Acc_name Line of business
    try {
        fnGetLineOfBusiness();
    }
    catch (err) {
    }
    try {
        //Bind user and Acc_name Line of Stockist
        fnGetAccompaistStockist();
    }
    catch (err) {
    }
    try {
        // fnPrivilegeValueforHeaderName();
        //fnBindCompetitorMasterData();
    }
    catch (err) {

    }

}
//Attendance
function GetUnderRegionDetails() {
    debugger;
    $.ajax({
        type: 'get',
        url: 'HiDoctor_Master/PatientTracking/GetAllRegionUsers',
        data: 'excludeParentLevel=a&includeOneLevelParent=1',
        async: false,
        success: function (result) {
            Under_Region_list_g = result;
        }
    });
}

function fnGetAccompanistRegionCodes() {
    if (flag_g == 'F') {
        if (acc_g != null) {
            for (var a = 0; a < acc_g.length; a++) {
                acc_Regions_g = acc_Regions_g + acc_g[a].accCode + "^";
            }
        }
    }
    else {
        GetUnderRegionDetails();
        for (var a = 0; a < Under_Region_list_g.length; a++) {
            acc_Regions_g = acc_Regions_g + Under_Region_list_g[a].Region_Code + "^";
        }
    }
}

function setMaxCodes(maxCodeJson) {
    debugger;
    if (flag_g == 'F') {
        $('#hdnDocMaxCode').val(maxCodeJson.Doctor_Vist_Max_Code);
        $('#hdnDocAccMaxCode').val(maxCodeJson.Doc_Acc_Max_Code);
        $('#hdnInputsMaxCode').val(maxCodeJson.Inputs_Max_Code);
        $('#hdnDetailedMaxCode').val(maxCodeJson.Detailed_Max_Code);
        $('#hdnChemMaxCode').val(maxCodeJson.Chemist_Max_Code);
        $('#hdnRCPAMaxCode').val(maxCodeJson.RCPA_Max_Code);
    }
    else {
        $('#hdnDocMaxCode').val('0');
        $('#hdnDocAccMaxCode').val('0');
        $('#hdnInputsMaxCode').val('0');
        $('#hdnDetailedMaxCode').val('0');
        $('#hdnChemMaxCode').val('0');
        $('#hdnRCPAMaxCode').val('0');
    }
}
function fnGetMaxCodes() {
    maxCode_g = "";
    $.ajax({
        type: 'POST',
        data: "DCR_Actual_Date=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetDCRDoctorVisitMaxCodes',
        async: false,
        success: function (response) {

            // we have the response
            maxCode_g = response;
            setMaxCodes(maxCode_g);
        },
        error: function (e) {
            // alert(e.responseText);
        }
    });
}

function fnGetDoctorsAndSetAutoFill() {
    debugger;
    $.ajax({
        type: 'POST',
        data: 'acc_Regions=' + acc_Regions_g + "&showAccDataValue=" + showAccData_g + "&dcrActualDate=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetDoctorsList',
        async: false,
        success: function (response) {
            // we have the response
            var result = response.Data;
            if (result != null) {
                doctorAutoFill_g = result;
                autoComplete(doctorAutoFill_g, "txtDocName", "hdnDocName", "dcr_doctor_name_doc");

            }

        },
        error: function (e) {
            // alert(e.responseText);
        }
    });
}

function fnGetSpecialityAndSetAutoFill() {
    $.ajax({
        type: 'POST',
        url: '../DCRV4DoctorVisit/GetSpecialityList',
        async: false,
        success: function (response) {
            // we have the response
            if (response != null && response.length > 0) {
                specialityAutoFill_g = response;
                autoComplete(specialityAutoFill_g, "txtDocSpeciality", "hdnspecname", "dcr_doc_spec_name");
            }
        },
        error: function (e) {
            // alert(e.responseText);
        }
    });
}

function fnGetAllSaleProductsAndSetAutoFill() {
    debugger;
    $('#imgloaddetailed').css('display', '');
    $('#detailedLoadingTitle').css('display', '');
    $.ajax({
        type: 'POST',
        data: "dcrDate=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetAllSaleProductsForDetails',
        async: false,
        success: function (response) {
            debugger;
            // we have the response
            if (response != null && response.length > 0) {
                detailedProductsAutoFill_g = response;
                $('#imgloaddetailed').css('display', 'none');
                $('#detailedLoadingTitle').css('display', 'none');
                //autoComplete(specialityAutoFill_g, "txtDocSpeciality", "hdnspecname", "dcr_doc_spec_name");
            }
            else {
                $('#imgloaddetailed').css('display', 'none');
                $('#detailedLoadingTitle').css('display', 'none');
            }
        },
        error: function (e) {
            // alert(e.responseText);
            $('#imgloaddetailed').css('display', 'none');
            $('#detailedLoadingTitle').css('display', 'none');
        }
    });
}


function fnGetUserProductsAndSetAutoFill() {
    debugger;
    $('#imgloadInputs').css('display', '');
    $('#inputsLoadingTitle').css('display', '')
    $.ajax({
        type: 'POST',
        data: "prdBringType=" + escape(productBringType_g) + "&searchWord=&DCR_Date=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetUserProductsList',
        async: false,
        success: function (response) {
            debugger;
            // we have the response
            if (response != null && response.length > 0) {
                productAutoFill_g = response;
                productAutoFillOri_g = JSON.stringify(productAutoFill_g);
                autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
                $('#imgloadInputs').css('display', 'none');
                $('#inputsLoadingTitle').css('display', 'none')
            }
            else {
                $('#imgloadInputs').css('display', 'none');
                $('#inputsLoadingTitle').css('display', 'none')
            }
        },
        error: function (e) {
            $('#imgloadInputs').css('display', 'none');
            $('#inputsLoadingTitle').css('display', 'none')
            // alert(e.responseText);
        }
    });
}

function fnGetChemistsAndSetAutoFill() {
    $('#imgloadchemist').css('display', '');
    $('#chemistLoadingTitle').css('display', '');
    $.ajax({
        type: 'POST',
        data: 'acc_Regions=' + acc_Regions_g + "&showAccDataValue=" + showAccData_g,
        url: '../DCRV4DoctorVisit/GetChemistsList',
        async: false,
        success: function (response) {
            // we have the response
            if (response != null && response.length > 0) {
                chemistAutoFill_g = response;
                lschemist_CV = response;
                $('#imgloadchemist').css('display', 'none');
                $('#chemistLoadingTitle').css('display', 'none');
                //autoComplete(specialityAutoFill_g, "txtDocSpeciality", "hdnspecname", "dcr_doc_spec_name");
            }
            else {
                $('#imgloadchemist').css('display', 'none');
                $('#chemistLoadingTitle').css('display', 'none');
            }
        },
        error: function (e) {
            $('#imgloadchemist').css('display', 'none');
            $('#chemistLoadingTitle').css('display', 'none');
            //  alert(e.responseText);
        }
    });
}

function fnGetSaleProductsAndSetAutoFill() {
    $.ajax({
        type: 'POST',
        data: "dcrActualDate=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetSaleProductsList',
        async: false,
        success: function (response) {
            // we have the response
            if (response != null && response.length > 0) {
                RCPAProductAutofill_g = response;
                //autoComplete(specialityAutoFill_g, "txtDocSpeciality", "hdnspecname", "dcr_doc_spec_name");
            }
        },
        error: function (e) {
            // alert(e.responseText);
        }
    });
}

function fnGetDoctorVisitDetailsPerDay() {
    debugger;
    $('#imgloaddDOCLST').css('dispaly', '');
    $('#docLSTLoadingTitle').css('display', '');
    var tpid = "";
    if (queryString_g.split('&')[2] == null || queryString_g.split('&')[2] == "" || queryString_g.split('&')[2] == "undefined") {
        tpid = -1;
    }
    else {
        tpid = queryString_g.split('&')[2];
    }
    if (flag_g == 'A') {
        if (tpid == 'null') {
            tpid = -1;
        }
    }
    var dcr_Date = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
    $.ajax({
        type: 'POST',
        data: "DCR_Actual_Date=" + dcrActualDate_g + "&TP_Id=" + tpid + "&CP_Code=" + escape(queryString_g.split('&')[1]) + "&request_From=''&flag=" + flag_g,
        url: '../DCRV4DoctorVisit/GetDoctorVisitDetailsPerDay',
        async: false,
        success: function (response) {
            debugger;
            // we have the response
            $('#imgloaddDOCLST').css('display', 'none');
            $('#docLSTLoadingTitle').css('display', 'none');
            $("#tbl_doctorvisit_list").html('');
            docdetails_g = "";
            dcrDoctorVisit_g = "";
            if (response != null && response.length > 0) {
                docdetails_g = response;
                dcrDoctorVisit_g = docdetails_g
                fnCreateDoctorList(docdetails_g);

            }
        },
        error: function (e) {
            $('#imgloaddDOCLST').css('display', 'none');
            $('#docLSTLoadingTitle').css('display', 'none');
            // alert(e.responseText);
        }
    });
}

// Grid Row Creation
function fnCreateDoctorList(detailsJSON_g) {
    debugger;
    gridRowNo_g = 0;
    if (dcrDoctorVisit_g != null && dcrDoctorVisit_g.length > 0) {
        var listLength = dcrDoctorVisit_g[0].Data.length;
        if (listLength > 0) {
            for (var i = 0; i < listLength; i++) {
                fnRowCreation(dcrDoctorVisit_g, i)
            }
            GetDoctorVisitPOBCount();
            fnFillForm("1");
        }
        else {
            fnClear();
        }
    }
    else {
        fnClear();
    }
}

function fnRowCreation(jsonContent, index) {
    debugger;
    var dvcode = "";
    dvcode = jsonContent[0].Data[index].Doctor_Visit_Code;
    var detailsJSON = "";
    detailsJSON = jsonContent[0].Data[index];
    var docName = "";
    docName = jsonContent[0].Data[index].Doctor_Name;
    var docCode = "";
    docCode = jsonContent[0].Data[index].Doctor_Code;
    var doctorRegionCode = "";
    doctorRegionCode = jsonContent[0].Data[index].Doctor_Region_Code;

    // Inputs.
    var productsJSONData = "";
    var sampleCount = 0;
    var samplesJson = {};
    if (jsonContent[1].Data != null) {
        productsJSONData = jsonContent[1].Data;
        if (dvcode != null) {
            samplesJson = jsonPath(productsJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
        }
        else {
            samplesJson = jsonPath(productsJSONData, "$.[?(@.Doctor_Code=='" + docCode + "'& @.Doctor_Region_Code=='" + doctorRegionCode + "')]");
        }
        sampleCount = samplesJson == "false" ? 0 : samplesJson.length;
    }
    //competitor






    // Chemists.
    var chemistJSONData = "";
    var chemistJson = {};
    var chemistCount = 0;
    if (jsonContent[2].Data != null) {
        chemistJSONData = jsonContent[2].Data;
        chemistJson = jsonPath(chemistJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
        chemistCount = chemistJson == "false" ? 0 : chemistJson.length;
    }

    // RCPA.
    var rcpaJSON = {};
    var rcpaCount = 0;
    rcpaJSON = jsonPath(jsonContent[3].Data, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;

    // Accompanist.
    var docAccJSON = {};
    var docAccCount = 0;
    if (jsonContent[4].Data != null) {
        docAccJSON = jsonPath(jsonContent[4].Data, "$.[?(@.Doctor_Visit_Code=='" + dvcode + "')]");
        docAccCount = docAccJSON == "false" ? 0 : docAccJSON.length;
    }

    // Detailed Products.
    var detprodJSON = {};
    var detprodCount = 0;
    if (jsonContent[5].Data != null) {
        detprodJSON = jsonPath(jsonContent[5].Data, "$.[?(@.Doctor_Visit_Code=='" + dvcode + "')]");
        detprodCount = detprodJSON == "false" ? 0 : detprodJSON.length;
    }

    //follow ups
    var followUpJSON = {};
    var followUpCount = 0;
    if (jsonContent[6].Data != null) {
        followUpJSON = jsonPath(jsonContent[6].Data, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
        //convert date
        for (var i = 0; i < followUpJSON.length; i++) {
            var Due_Date = new Date(eval(followUpJSON[i].Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
            //fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
            var _day = Due_Date.getDate();
            var _month = Due_Date.getMonth();
            var _year = Due_Date.getFullYear();
            _month = _month + 1;
            if (_month.toString().length == 1)
                _month = "0" + _month;
            if (_day.toString().length == 1)
                _day = "0" + _day;
            followUpJSON[i].Due_Date = (_day + '/' + (_month) + '/' + _year);

        }
        followUpCount = followUpJSON == "false" ? 0 : followUpJSON.length;
    }
    // Attachment
    var AttachmentJSON = {};
    if (jsonContent[7].Data != null) {
        AttachmentJSON = jsonPath(jsonContent[7].Data, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
    }

    // Detailed Competitor Products.
    //var CompProductJSONArray = {};
    //var detcompprodCount = 0;
    //if (jsonContent[8].Data != null) {
    //    CompProductJSONArray = jsonPath(jsonContent[8].Data, "$.[?(@.Doctor_Visit_Code=='" + dvcode + "')]");
    //    detcompprodCount = CompProductJSONArray == "false" ? 0 : CompProductJSONArray.length;
    //}



    RowCreation(dvcode, detailsJSON, samplesJson, chemistJson, rcpaJSON, docAccJSON, detprodJSON, followUpJSON, AttachmentJSON, 0);
}

function RowCreation(dvcode, detailsJSON, samplesJson, chemistJson, rcpaJSON, docAccJSON, detprodJSON, followUpJSON, AttachmentJSON, pob_Count) {
    debugger;
    gridRowNo_g++;
    var rowIndex = $('#tbl_doctorvisit_list tr').length;
    var newListRow = document.getElementById('tbl_doctorvisit_list').insertRow(parseInt(rowIndex++));
    var sampleCount = samplesJson == "false" ? 0 : samplesJson.length;
    var chemistCount = chemistJson == "false" ? 0 : chemistJson.length;
    var rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;
    var docAccCount = docAccJSON == "false" ? 0 : docAccJSON.length;
    var detprodCount = detprodJSON == "false" ? 0 : detprodJSON.length;
    var followUpCount = followUpJSON == "false" ? 0 : followUpJSON.length;
    var AttachmentCount = AttachmentJSON == "false" ? 0 : AttachmentJSON.length;
    //var detcompprodCount = CompProductJSONArray == "false" ? 0 : CompProductJSONArray.length;

    var docName = detailsJSON.label;
    detailsJSON.Doctor_Name = docName;
    newListRow.id = "doc_List_" + gridRowNo_g;
    $(newListRow).addClass("grdRow");
    $("#doc_List_" + gridRowNo_g).click(function () { fnFillForm(this.id.split('_')[2]) });

    // Row No.
    var td1 = newListRow.insertCell(0);
    var waimg = '<img src="../Images/circle.png" title="WideAngle" alt="WideAngle" id="imgWideAngle">';
    var offlineimg = '<img src="../Images/offline.png" title="Offline" alt="Offline" id="imgoffline">';
    if (detailsJSON.Source_of_Entry.toUpperCase() != "TABLET") {
        if (detailsJSON.Source_of_Entry.toUpperCase() != "OFFLINE") {
            $(td1).html(gridRowNo_g);
        }
        else {
            $(td1).html(gridRowNo_g + offlineimg);
        }
    }
    else {
        $(td1).html(gridRowNo_g + waimg);
    }

    // DvCode
    var td2 = newListRow.insertCell(1);
    dvcode = dvcode == null ? "" : dvcode
    var Mode_Of_Entry = detailsJSON.Mode_Of_Entry == null ? "" : detailsJSON.Mode_Of_Entry;
    var recordStatus = detailsJSON.Record_Status;
    $(td2).html('<span id="spnDVCode_' + gridRowNo_g + '">' + dvcode + '</span><input type="hidden" id="hdndocModeofEntry_' + gridRowNo_g + '" value="' + Mode_Of_Entry + '" /><input type="hidden" id="hdnDocRecordStatus_' + gridRowNo_g + '" value="' + recordStatus + '" />');
    $(td2).css('display', 'none');

    //  Doctor JSON Content
    var td3 = newListRow.insertCell(2);
    detailsJSON = JSON.stringify(detailsJSON)
    $(td3).html('<input type="hidden" id="hdnDoctorJson_' + gridRowNo_g + '" value=\'' + detailsJSON + '\' />');
    $(td3).css('display', 'none');

    //  Sample JSON Content
    var td4 = newListRow.insertCell(3);
    samplesJson = samplesJson == false ? "{}" : JSON.stringify(samplesJson)
    $(td4).html('<input type="hidden" id="hdnSampleJson_' + gridRowNo_g + '" value=\'' + samplesJson + '\' />');
    $(td4).css('display', 'none');

    // Chemist JSON Content
    var td5 = newListRow.insertCell(4);
    chemistJson = chemistJson == false ? "{}" : JSON.stringify(chemistJson)
    $(td5).html('<input type="hidden" id="hdnChemistJson_' + gridRowNo_g + '" value=\'' + chemistJson + '\' />');
    $(td5).css('display', 'none');

    // RCPA JSON Content
    var td6 = newListRow.insertCell(5);
    rcpaJSON = rcpaJSON == "" ? "{}" : JSON.stringify(rcpaJSON)
    $(td6).html('<input type="hidden" id="hdnRCPAJson' + gridRowNo_g + '" value=\'' + rcpaJSON + '\' />');
    $(td6).css('display', 'none');

    var td7 = newListRow.insertCell(6);
    docAccJSON = JSON.stringify(docAccJSON)
    $(td7).html('<input type="hidden" id="hdndocAccJson' + gridRowNo_g + '" value=\'' + docAccJSON + '\' />');
    $(td7).css('display', 'none');

    var td8 = newListRow.insertCell(7);
    detprodJSON = JSON.stringify(detprodJSON)
    $(td8).html('<input type="hidden" id="hdndetProdJson' + gridRowNo_g + '" value=\'' + detprodJSON + '\' />');
    $(td8).css('display', 'none');

    // Doctor Name
    var td9 = newListRow.insertCell(8);
    var imgtick = "";
    if (recordStatus == "3") {
        imgtick = '<img id="imgSelected' + gridRowNo_g + '"  src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" alt="Selected" style="border:0px;" />';
    }
    else {
        imgtick = '<img id="imgSelected' + gridRowNo_g + '"  src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" alt="Selected" style="border:0px;display:none" />';
    }
    $(td9).html(imgtick + '<span id="spnDocName_' + gridRowNo_g + '">' + docName + '</span>');
    $(td9).css('width', '90%');
    $(td9).css('verticalAlign', 'top');

    // Acc
    var td10 = newListRow.insertCell(9);
    $(td10).css('width', '10px')
    var accid = "docacc_" + gridRowNo_g;
    var docAccDiv = ""; //'<div id="divsamptoltip_' + gridRowNo_g + '" class="sampletooltip">'
    //var ind = 0;
    //for (var da = 0; da < eval('(' + docAccJSON + ')').length; da++) {
    //    ind = da + 1;
    //    //docAccDiv += ind + "." + eval('(' + docAccJSON + ')')[da].Acc_User_Name.toString() + "\n";
    //}

    //docAccDiv += '"'//"</div>";
    //docAccDiv = ind == 0 ? '' : docAccDiv;
    if (docAccJSON != "false") {
        JSON.parse(docAccJSON).map(function (i, e) {
            docAccDiv += (e + 1) + "." + i.Acc_User_Name.toString() + "\n";
        })
    }

    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/acc.png" alt="acc" />';
    docAccCount > 0 ? $(td10).html('<a id=' + accid + ' title=' + unescape(docAccDiv) + ' class="sampletooltip" >' + img + '</a>') : $(td10).html('<a id=' + accid + ' class="sampletooltip"></a>' + docAccDiv);

    // Sample
    var td11 = newListRow.insertCell(10);
    $(td11).css('width', '10px')
    var sampleid = "Sample_" + gridRowNo_g;
    var sampleDiv = "";

    for (var s = 0; s < eval('(' + samplesJson + ')').length; s++) {
        sampleDiv += (s + 1) + "." + unescape(eval('(' + samplesJson + ')')[s].Product_Name.toString()) + "\n";
    }


    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sample/Promotional items" />';
    sampleCount > 0 ? $(td11).html('<a id=' + sampleid + ' title=' + unescape(sampleDiv) + ' class="sampletooltip" >' + img + '</a>') : $(td11).html('<a id=' + sampleid + ' class="sampletooltip"></a>' + sampleDiv);
    //$("#" + sampleid).tooltip({ effect: 'toggle' });


    // Detailed Products
    var td12 = newListRow.insertCell(11);
    $(td12).css('width', '10px')
    var detailedid = "detailed_" + gridRowNo_g;
    var detprodDiv = "";  //'<div  id="divchemtoltip_' + gridRowNo_g + '" class="tooltip">'
    //var ind = 0;
    //for (var dp = 0; dp < eval('(' + detprodJSON + ')').length; dp++) {
    //    ind = dp + 1;
    //    //detprodDiv += +ind + "." + eval('(' + detprodJSON + ')')[dp].Sale_Product_Name + "\n";
    //}
    //detprodDiv += '"';
    //detprodDiv = ind == 0 ? '' : detprodDiv;
    if (detprodJSON != "false") {
        JSON.parse(detprodJSON).map(function (i, e) {
            detprodDiv += (e + 1) + "." + i.Sale_Product_Name.toString() + "\n";
        })
    }
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/detailed.png" alt="Detail" />';
    detprodCount > 0 ? $(td12).html('<a id=' + detailedid + ' title=' + unescape(detprodDiv) + ' class="sampletooltip">' + img + '</a>') : $(td12).html('<a id=' + detailedid + ' class="sampletooltip"></a>' + detprodDiv);
    // $("#" + chemistid).tooltip({ effect: 'toggle' });

    // Chemist
    var td13 = newListRow.insertCell(12);
    $(td13).css('width', '10px')
    var chemistid = "chemist_" + gridRowNo_g;
    var chemistDiv = "";
    for (var c = 0; c < eval('(' + chemistJson + ')').length; c++) {
        chemistDiv += (c + 1) + "." + eval('(' + chemistJson + ')')[c].Chemist_Name + "\n";
    }

    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/chemis16x16.png" alt="Chemist" />';
    chemistCount > 0 ? $(td13).html('<a id=' + chemistid + ' title=' + unescape(chemistDiv) + ' class="sampletooltip">' + img + '</a>') : $(td13).html('<a id=' + chemistid + ' class="sampletooltip"></a>' + chemistDiv);
    // $("#" + chemistid).tooltip({ effect: 'toggle' });

    // RCPA
    var td14 = newListRow.insertCell(13);
    $(td14).attr('id', 'grdRCPA_' + gridRowNo_g);
    $(td14).css('width', '10px')
    if (RCPA_g == "R") {
        var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/rcpa.png" alt="RCPA" />';
        rcpaCount > 0 ? $(td14).html(img) : $(td14).html("&nbsp;");
    }
    else {
        $(td14).css('display', 'none');
    }

    //pob
    var td19 = newListRow.insertCell(14);
    $(td19).attr('id', 'pobImgRow_' + gridRowNo_g);
    var img = "<input type='hidden' id='hdnPOBCount_" + gridRowNo_g + "' value='0'></input><div id='pobImg_" + gridRowNo_g + "' style='display:none;'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/pob.png' alt='POB' /></div>";
    $(td19).css('width', '10px')
    $(td19).html(img);
    if (pob_Count > 0)
        $("#pobImg_" + gridRowNo_g).show();
    //attachment
    var td20 = newListRow.insertCell(15);
    AttachmentJSON = JSON.stringify(AttachmentJSON)
    $(td20).attr('id', 'attachImg_' + gridRowNo_g);
    var img = "<img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/attachment.png' alt='attachment' />";
    if (eval('(' + AttachmentJSON + ')').length > 0) {
        $(td20).html(img);
        $(td20).css('width', '10px')
    }

    var td21 = newListRow.insertCell(16);
    followUpJSON = JSON.stringify(followUpJSON)
    $(td21).attr('id', 'followImg_' + gridRowNo_g);
    var img = " <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/follow-up.png' alt='follow-up' />";
    if (eval('(' + followUpJSON + ')').length > 0) {
        $(td21).html(img);
        $(td21).css('width', '10px');
    }

    // Remove Icon. 
    var td15 = newListRow.insertCell(17);
    $(td15).attr('id', "delete_" + gridRowNo_g);
    $(td15).css('width', '10px');
    if (recordStatus == "3") {
        if (Mode_Of_Entry != "A") {
            $(td15).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" onclick="fnDeleteGridRow(\'' + dvcode + '\',\'' + newListRow.id + '\')" />')
        }
        else {
            $(td15).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="display:none"/>')
        }
    }
    else {
        $(td15).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="display:none" />')
    }

    var td16 = newListRow.insertCell(18);
    $(td16).css('width', '10px');
    $(td16).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/arrow.png" id="grdSelectArrow_' + gridRowNo_g + '" alt="Select" style="display:none;"  />')

    if ($('#tbl_doctorvisit_list tr').length > 1) {
        $('#btnSave').val('Save & Next ' + DoctorHeader_g + '');
    }
    //follow ups
    var td17 = newListRow.insertCell(19);
    $(td17).html('<input type="hidden" id="hdnfollowUp' + gridRowNo_g + '" value=\'' + followUpJSON + '\' />');
    $(td17).css('display', 'none');

    //Attachment
    var td18 = newListRow.insertCell(20);
    $(td18).html('<input type="hidden" id="hdnAttachment' + gridRowNo_g + '" value=\'' + AttachmentJSON + '\' />');
    $(td18).css('display', 'none');

    //Detailed Competitor Product
    //var td19 = newListRow.insertCell(21);
    //$(td19).html('<input type="hidden" id="hdnCompetitordetails_' + gridRowNo_g + '" value=\'' + CompProductJSONArray + '\' />');
    //$(td19).css('display', 'none');



}

function fnRowUpdation(dvcode, detailsJSON, samplesJson, chemistJson, rcpaJSON, docAccJSON, detProdJSON, rowNum, followUpJSON, AttachmentJSON, pob_Count, CompProductJSONArray) {
    debugger;
    sampleCount = samplesJson == "false" ? 0 : samplesJson.length;
    chemistCount = chemistJson == "false" ? 0 : chemistJson.length;
    rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;
    var docName = detailsJSON.label;

    // DvCode
    dvcode = dvcode == null ? "" : dvcode
    var modeofentry = detailsJSON.Mode_Of_Entry == null ? "" : detailsJSON.Mode_Of_Entry;
    var rs = detailsJSON.Record_Status;
    $('#spnDVCode_' + rowNum).html(dvcode);
    $('#hdndocModeofEntry_' + rowNum).val(modeofentry);
    $('#hdnDocRecordStatus_' + rowNum).val(rs);
    $('#imgSelected' + rowNum).css('display', '');

    //  Doctor JSON Content
    detailsJSON.Doctor_Name = docName;
    detailsJSON = JSON.stringify(detailsJSON)
    $('#hdnDoctorJson_' + rowNum).val(detailsJSON);

    //  Sample JSON Content
    samplesJson = samplesJson == false ? "{}" : JSON.stringify(samplesJson);
    $('#hdnSampleJson_' + rowNum).val(samplesJson);

    // Chemist JSON Content
    chemistJson = chemistJson == false ? "{}" : JSON.stringify(chemistJson);
    $('#hdnChemistJson_' + rowNum).val(chemistJson);

    // RCPA JSON Content
    rcpaJSON = rcpaJSON == "" ? "{}" : JSON.stringify(rcpaJSON);
    $('#hdnRCPAJson' + rowNum).val(rcpaJSON);

    docAccJSON = JSON.stringify(docAccJSON)
    $('#hdndocAccJson' + rowNum).val(docAccJSON);


    detProdJSON = JSON.stringify(detProdJSON)
    $('#hdndetProdJson' + rowNum).val(detProdJSON);

    // Doctor Name
    $('#spnDocName_' + rowNum).html(docName);

    //FollowUps
    for (var i = 0; i < followUpJSON.length; i++) {
        followUpJSON[i].Due_Date = followUpJSON[i].Due_Date.split('-')[2] + '/' + followUpJSON[i].Due_Date.split('-')[1] + '/' + followUpJSON[i].Due_Date.split('-')[0];
    }
    followUpJSON = followUpJSON == "" ? "{}" : JSON.stringify(followUpJSON);

    $('#hdnfollowUp' + rowNum).val(followUpJSON);

    //Attachment
    AttachmentJSON = AttachmentJSON == "" ? "{}" : JSON.stringify(AttachmentJSON);
    $('#hdnAttachment' + rowNum).val(AttachmentJSON);

    //Detailed Competitor Product
    //CompProductJSONArray = CompProductJSONArray == "" ? "{}" : JSON.stringify(CompProductJSONArray);
    //$('#hdnCompetitordetails_' + rowNum).val(CompProductJSONArray);
    // Sample

    var sampleDiv = "";

    var si = 0;
    for (var s = 0; s < eval('(' + samplesJson + ')').length; s++) {
        si++;
        sampleDiv += (si).toString() + "." + unescape(eval('(' + samplesJson + ')')[s].Product_Name) + "\n";
    }
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sample/Promotional items" />';
    if (sampleCount > 0)
    { $('#Sample_' + rowNum).attr('title', sampleDiv); $('#Sample_' + rowNum).html(img); }
    else { $('#Sample_' + rowNum).html("") };

    // Chemist
    var ci = 0;
    var chemistDiv = "";
    for (var c = 0; c < eval('(' + chemistJson + ')').length; c++) {
        ci++;
        chemistDiv += (ci).toString() + ". " + unescape(eval('(' + chemistJson + ')')[c].Chemist_Name) + "\n";
    }
    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/chemis16x16.png" alt="Chemist" />';
    if (chemistCount > 0) {
        $('#chemist_' + rowNum).attr('title', unescape(chemistDiv)); $('#chemist_' + rowNum).html(img);;
    } else { $('#chemist_' + rowNum).html("") };

    if (RCPA_g == "R") {
        if (rcpaCount > 0) {
            var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/rcpa.png" alt="RCPA" />';
            $('#grdRCPA_' + rowNum).html(img);
        } else { $('#grdRCPA_' + rowNum).html(""); };
    }

    var detProdJSON_temp = detProdJSON
    var detproddiv = "";
    var pi = 0;
    for (var p = 0; p < eval('(' + detProdJSON_temp + ')').length; p++) {
        pi++;
        detproddiv += (pi).toString() + "." + unescape(eval('(' + detProdJSON_temp + ')')[p].Sale_Product_Name) + "\n";
    }

    var img = '<img  title="' + detproddiv + '" src="../Areas/HiDoctor_Activity/Content/images/Web/hd/detailed.png" alt="Detail" />';
    if (detProdJSON != null && eval('(' + detProdJSON_temp + ')').length > 0) {
        $('#detailed_' + rowNum).html(img);
    }
    else {
        $('#detailed_' + rowNum).html("");
    }

    var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/acc.png" alt="acc" />';
    var docAccJSON_temp = docAccJSON;
    if (docAccJSON_temp != null) {
        if (eval('(' + docAccJSON_temp + ')').length > 0) {
            $('#docacc_' + rowNum).html(img);
        }
        else {
            $('#docacc_' + rowNum).html("");
        }
    }
    else {
        $('#docacc_' + rowNum).html("");
    }

    if (pob_Count > 0) {
        var img = "<input type='hidden' id='hdnPOBCount_" + rowNum + "' value='" + pob_Count + "'></input><div id='pobImg_" + rowNum + "' style=''><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/pob.png' alt='POB' /></div>";
        $("#pobImgRow_" + rowNum).html(img);
    }
    else {
        $("#pobImgRow_" + rowNum).html('');
        $("#pobImgRow_" + rowNum).html("<input type='hidden' id='hdnPOBCount_" + rowNum + "' value='0'></input>");
    }
    if (eval('(' + followUpJSON + ')').length > 0) {
        var img = " <img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/follow-up.png' alt='follow-up' />";
        $("#followImg_" + rowNum).html(img);
    }
    else
        $("#followImg_" + rowNum).html('');
    var att_Count = 0;
    var AttachmentJSON = eval('(' + AttachmentJSON + ')');
    for (var i = 0; i < AttachmentJSON.length; i++) {
        if (AttachmentJSON[i].Status == '1')
            att_Count++;
    }
    if (att_Count > 0) {
        var img = "<img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/attachment.png' alt='attachment' />";
        $("#attachImg_" + rowNum).html(img);
    }
    else
        $("#attachImg_" + rowNum).html('');

    $('#delete_' + rowNum).html('');
    if (modeofentry != "A") {
        $('#delete_' + rowNum).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" onclick="fnDeleteGridRow(\'' + dvcode + '\',\'' + "doc_List_" + rowNum + '\')" />');
    }
}

function fnFillForm(rowPosition, doctorjson, productJson, chemistJson, rcpaJson, docAccJson, detProdJson, CompProductJSONArray) {
    debugger;
    $("#div_Hospitalvisit_form").hide();
    $("#div_doctorvisit_form").show();
    if ($('#doc_List_' + rowPosition).css('display') == 'none') {
        fnClear();
        return false;
    }

    if ($("#txtDocName").val().trim() == "")
        formMode_g = "";

    if (formMode_g == "Edit" && flag_g != 'F') {
        var result = confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.');
        if (!result) {
            return false;
        }
        else {
            fnInsertDoctorVisitData(false, rowPosition);
        }
    }
    else {
        fnFillFormEdit(rowPosition, doctorjson, productJson, chemistJson, rcpaJson, docAccJson, detProdJson, hdncompdetails);

    }

}
//var rowPosition = 0;
function fngetCompdetails(Doctor_Visit_Code, detProdJson) {
    debugger;
    $.ajax({
        url: 'HiDoctor_Activity/DCRV4DoctorVisit/GetAllCompetitorDetails',
        type: "GET",
        data: "DCR_Visit_Code=" + Doctor_Visit_Code,
        //"&DCRvisitCode=" + doctorjson.Doctor_Visit_Code + "&DCRdetailedproductCode=" + '' +
        //"&Sale_Product_Code=" + hdncompdetails[id].Sale_Product_Code,
        // data: "DoctorCode=" + Doctor_Code,
        success: function (response) {
            // var compProductName = {}
            // var doccompcode = doctorjson.Doctor_Code;
            // var dcrcode = doctorjson.Doctor_Visit_Code;
            detailedCompprod_g = response;
            //compProductName = jsonPath(detailedCompprod_g, "$.[?(@.Doctor_Code=='" + doccompcode + "'&@.DCR_Visit_Code=='" + dcrcode + "'&@.Sale_Product_code=='" + $("#hdnproductDetailed_" + id).val() + "')]");
            compProductName = response;
            // -----------------Com-------------------------
            var prod = $.grep(compProductName, function (element, index) {
                return element.DCR_Visit_Code == Doctor_Visit_Code;
            });
            for (var dpRIndex = 0; dpRIndex < detProdJson.length; dpRIndex++) {
                var Sale_Product_code = $("#hdnproductDetailed_" + (dpRIndex + 1)).val();
                //  for (var pro = 0; pro < prod.length; pro++) {
                //    if (Sale_Product_code = prod[pro].Sale_Product_code) {

                var sale_prod = $.grep(prod, function (element, index) {
                    return element.Sale_Product_code == Sale_Product_code;
                });
                if (sale_prod.length > 0)
                    $("#hdnCompetitordetails_" + (dpRIndex + 1)).val(JSON.stringify(sale_prod));
                //  }
                //}
            }
            //--------------------------
        }
    });

}

function fnFillFormEdit(rowPosition, doctorjson, productJson, chemistJson, rcpaJson, docAccJson, detProdJson, hdncompdetails) {
    debugger;
    //Hide and Show

    $("#frm1").show();
    $("#div_Chevisit_form").hide();
    $("#div_Hospitalvisit_form").hide();
    //CV_Visit
    if (ChemistsPrivilege.toUpperCase() == ChemistsPrivilege_Value.toUpperCase()) {
        ChemistVisit.defaults.formMode_g = "NO";
    }
    productAutoFill_g = eval('(' + productAutoFillOri_g + ')');
    autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
    formMode_g = "";
    var followUpJSON = '';
    var AttachmentJSON = '';
    if (rowPosition != 'default') {
        $('#hdnbindRowNumber').val(rowPosition);
        debugger;
        doctorjson = eval('(' + $('#hdnDoctorJson_' + rowPosition).val() + ')');
        productJson = eval('(' + $('#hdnSampleJson_' + rowPosition).val() + ')');
        chemistJson = eval('(' + $('#hdnChemistJson_' + rowPosition).val() + ')');
        rcpaJson = eval('(' + $('#hdnRCPAJson' + rowPosition).val() + ')');
        docAccJson = eval('(' + $('#hdndocAccJson' + rowPosition).val() + ')');

        detProdJson = eval('(' + $('#hdndetProdJson' + rowPosition).val() + ')');
        followUpJSON = eval('(' + $('#hdnfollowUp' + rowPosition).val() + ')');
        AttachmentJSON = eval('(' + $('#hdnAttachment' + rowPosition).val() + ')');
        // CompProductJSONArray = eval('(' + $('#hdndetailedcompetitor' + rowPosition).val() + ')');

        //fngetCompdetails(doctorjson, rowPosition);
        //fngetCompdetails(detProdJson);
    }
    else {
        $('#hdnbindRowNumber').val('1');
    }
    fnDeleteRows();
    if (doctorjson != null) {

        rowPosition = rowPosition == 'default' ? "1" : rowPosition;
        $('#hdnRecord_Status').val(doctorjson.Record_Status);
        $('#hdnDoc_EntryMode').val(doctorjson.Mode_Of_Entry);
        $('#hdnsoe').val(doctorjson.Source_of_Entry == null ? "" : doctorjson.Source_of_Entry);
        $('#hdnlat').val(doctorjson.Lattitude == null ? "" : doctorjson.Lattitude);
        $('#hdnlon').val(doctorjson.Longtitude == null ? "" : doctorjson.Longtitude);
        $('#hdnloc').val(doctorjson.Location == null ? "" : doctorjson.Location);
        $('#hdnedt').val(doctorjson.Entered_Date_Time == null ? "" : doctorjson.Entered_Date_Time);
        fnhighlightRowColor(rowPosition);
        var dvcode = $('#spnDVCode_' + rowPosition).html();
        $('#hdnDoctorVisitCode').val(dvcode);
        if (doctorEntryMode_g.toUpperCase() == "NO") {
            if (doctorjson.Doctor_Code == null || doctorjson.Doctor_Code.length == 0) {
                var doc_name = doctorjson.Doctor_Name.split('_')[0];
                var doc_code = doctorjson.Doctor_Code;
                var speciality = doctorjson.Speciality_Name;

                $('#txtDocName').val("");
                $('#hdnDocName').val("");
                $('#txtDocSpeciality').val("");
                $('#txtDocName').val(doc_name);
                $('#hdnDocName').val(doc_code);
                $('#txtDocSpeciality').val(speciality);
                var specialityCode = jsonPath(specialityAutoFill_g, "$.[?(@.label=='" + speciality + "')]");
                if (specialityCode != false) {
                    $('#hdnspecname').val(specialityCode[0].value);
                }
                else {
                    $('#hdnspecname').val('');
                }
            }
            else {
                $('#txtDocName').val(doctorjson.Doctor_Name);
                $('#hdnDocName').val(doctorjson.Doctor_Code);
                $('#txtDocSpeciality').val("");
                $('#hdnspecname').val("");
            }
        }
        else { // Rigid
            $('#txtDocName').val(doctorjson.Doctor_Name);
            $('#hdnDocName').val(doctorjson.Doctor_Code);
        }

        doctorjson_g = doctorjson;
        fnGetMCDetailsforDropdown();

        if (doctorjson.Mode_Of_Entry == "A") {
            $('#txtDocName').attr('disabled', 'disabled');
            $('#txtDocSpeciality').attr('disabled', 'disabled');
        }
        else {
            $('#txtDocName').attr('disabled', false);
            $('#txtDocSpeciality').attr('disabled', false);
        }
        // Is CP Doctor

        $('#hdnIsCPDoc').val(doctorjson.Is_CPDoc);

        // POB Amount.
        if (doctorPOBAmount_g.toUpperCase() == "YES") {
            $('#txtDocPOB').val(doctorjson.POB_Amount);
        }
        if (fnCheckValueExistDropDown('ddlDBStatus', doctorjson.Business_Status_ID)) {
            $('#ddlDBStatus').val(doctorjson.Business_Status_ID);
        }
        else {
            var ddl = "";
            for (var s = 0; s < DoctorBusinessList_g.length; s++) {
                if (DoctorBusinessList_g[s].Business_Status_ID == doctorjson.Business_Status_ID) {
                    ddl += '<option value=' + DoctorBusinessList_g[s].Business_Status_ID + '>' + DoctorBusinessList_g[s].Status_Name + '</option>';
                }
            }
            $("#ddlDBStatus").append(ddl);
            $('#ddlDBStatus').val(doctorjson.Business_Status_ID);
            $("#divBusinessStatus").show();
        }
        fnAddActivityRow(null);
        fnAddMCActivityRow(null);
        GeMCDetails('1');
        //fnGetCMECampaigns('1');

        debugger;

        //if (inputs_mandatory_number_g == "0") {
        //    $("#lblSampleMand").hide();
        //}
        //else {
        //    $("#lblSampleMand").show();
        //}

        //if (detailProdMandatoryCheck == "0") {          
        //    $("#lbldetailMand").hide();
        //}
        //else {
        //    $("#lbldetailMand").show();
        //}

        //if (chemists_mandatory_number_g == "0") {
        //    $("#lblChemistMand").hide();
        //}
        //else {
        //    $("#lblChemistMand").show();
        //}


        var callObjectivePrivilege = fnGetPrivilegeValue("DCR_BUSINESS_STATUS_MANDATORY_FOR", "NO");

        if (fnCheckValueExistDropDown("ddlcallObjetive", doctorjson.Call_Objective_ID)) {
            $("#ddlcallObjetive").val(doctorjson.Call_Objective_ID);
        }
        else {
            debugger;
            var ddl = "";
            for (var i = 0; i < CallObjective_g.length; i++) {
                if (CallObjective_g[i].Call_Objective_ID == doctorjson.Call_Objective_ID)
                    ddl += '<option value=' + CallObjective_g[i].Call_Objective_ID + '>' + CallObjective_g[i].Call_Objective_Name + '</option>';
            }
            $("#ddlcallObjetive").append(ddl);
            $("#ddlcallObjetive").val(doctorjson.Call_Objective_ID);
            $("#divCallObjective").show();
        }
        fnBindDCRActivity(doctorjson.Doctor_Visit_Code);
        fnSetSpeciality(doctorjson.Speciality_Name);
        // Visit Time or Visit Mode.
        $('#timepicker').attr('disabled', false);
        if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
            if (dvcode != null && $.trim(dvcode).length > 0) {
                var visitmode = doctorjson.Visit_Mode == null ? "AM" : $.trim(doctorjson.Visit_Mode).length == 0 ? "AM" : doctorjson.Visit_Mode;
                if (doctorjson.Doctor_Visit_Time != null && $.trim(doctorjson.Doctor_Visit_Time).length > 0) {
                    $('#timepicker').val(doctorjson.Doctor_Visit_Time + " " + visitmode);
                    if (doctorjson.Mode_Of_Entry == "A") {
                        $('#timepicker').attr('disabled', 'disabled');
                    }
                }
                //else {
                //    $('#timepicker').val("");
                //    $('#timepicker').attr('disabled', '');
                //}
            }
            else {
                $('#timepicker').val("");
            }
            // Set Server Time.
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                if (doctorjson.Doctor_Visit_Time != null && $.trim(doctorjson.Doctor_Visit_Time).length > 0) {
                    $('#lbltimepicker').html(doctorjson.Doctor_Visit_Time + " " + visitmode);
                }
                else {
                    fnSetServerTime();
                }
            }
        }
        else {
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                if (doctorjson.Visit_Mode != null && $.trim(doctorjson.Visit_Mode).length > 0) {
                    $('#lblvisitmode').html(doctorjson.Visit_Mode);
                }
                else {
                    fnSetServerTime();
                }
            }
            else {
                if (doctorjson.Visit_Mode == "PM") {
                    $('#rdpm').attr('checked', 'checked');
                }
                else {
                    $('#rdam').attr('checked', 'checked');
                }
            }
        }
        $('#txtDocRemarks').val(unescape(doctorjson.Remarks == null ? "" : doctorjson.Remarks));

        if (flag_g == "F") {

            var doctor_capcture = fnGetPrivilegeValue("DOCTOR_VISITS_CAPTURE_CONTROLS", '');

            //////////////////Sample/promotion Mandatory ///////////////////////
            var Sample_Check = false;
            if (doctor_capcture.indexOf("SAMPLES") > -1) {
                Sample_Check = true;
            }
            if (Sample_Check && inputs_mandatory_number_g != "0" && doctorjson.Is_Sample_not_Mandatory == 1) {
                $("#SampleMandatory").prop("checked", true);
                $("#SAMPLES").show();
            }
            else {
                $('#SampleMandatory').prop('checked', false);
                $('#SAMPLES').show();
            }

            //////////////////Detailed Mandatory ///////////////////////////////////

            var Detailing_Check = false;
            if (doctor_capcture.indexOf("DETAILING") > -1) {
                Detailing_Check = true;
            }
            if (Detailing_Check && detailProdMandatoryCheck != "0" && doctorjson.Detail_NotGiven_Check == 1) {
                $("#DetailedMandatory").prop("checked", true);
                $("#DETAILING").show();
            }
            else {
                $('#DetailedMandatory').prop('checked', false);
                $('#DETAILING').show();
            }
            //////////////////Chemist Mandatory ///////////////////////////////////

            var Chemist_Check = false;
            if (doctor_capcture.indexOf("RCPA") > -1) {
                Chemist_Check = true;
                $('#DVChemistBlock').show();
            }
            if (doctorjson.No_ChemistVisit_Check == 1 && chemists_mandatory_number_g != "0" && Chemist_Check) {
                $("#chemistMandatory").prop("checked", true);
                $("#DVChemistBlock").show();
            }
            else {
                $('#chemistMandatory').prop('checked', false);
                // $('#DVChemistBlock').show();
            }



            ////////////////////POB Mandatory///////////////////////////////////
            var pobMandatory = fnGetPrivilegeValue('DOCTOR_POB_ENTER_MIN', '');
            if (doctorjson.Doctor_Visit_Without_POB == 1 && pobMandatory != '' && pobMandatory != '0') {
                $('#POBMandatory').prop('checked', true);
                $('#POB').show();
            }
            else {
                $('#POBMandatory').prop('checked', false);
                $('#POB').show();
            }

            ////////////////RCPA Chemist ////////////////////
            var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');

            if (doctorjson.Chemist_Visit_WithoutRCPA_Check == 1 && rcpaMandatory != "0") {
                $("#RcpaMandatory").prop("checked", true);
                var len = $('#tbl_chemist tr.rcpaheader').length;
                if (len > 0) {
                    for (var i = 1; i <= len; i++) {
                        $("#divRCPA" + i).hide();
                    }

                }
            }
            else {
                $("#RcpaMandatory").prop("checked", false);
                var len = $('#tbl_chemist tr.rcpaheader').length;
                if (len > 0) {
                    for (var i = 1; i <= len; i++) {
                        $("#divRCPA" + i).show();
                    }
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////

        fnGetDoctorandCustomerSalesProducts();

        var accIndex = 0;
        if (docAccJson != null && docAccJson.length > 0) {
            fnSetAccDivExpand()
            for (var accrowIndex = 0; accrowIndex < docAccJson.length; accrowIndex++) {
                accIndex = accrowIndex;
                accIndex = accIndex + 1;
                fnAddAccompanist(true, 'txtAccName_' + accIndex);
                var acc1 = jsonPath(acc_g, "$[?(@.accCode=='" + docAccJson[accrowIndex].Acc_Region_Code + "')]");
                var accName = jsonPath(accAutoFill_g, "$[?(@.value=='" + docAccJson[accrowIndex].Acc_Region_Code + "')]");
                for (var j = 0; j < acc_g.length; j++) {
                    if (acc_g[j].accCode == docAccJson[accrowIndex].Acc_Region_Code && acc_g[j].accName.split(',')[1].split('(')[0] == docAccJson[accrowIndex].Acc_User_Name) {
                        var mde = docAccJson[accrowIndex].Mode_Of_Entry;
                        var ofd = docAccJson[accrowIndex].Is_Only_For_Doctor;
                        $('#txtAccName_' + accIndex).val(acc_g[j].accName);
                        $('#hdnAccName_' + accIndex).val(acc_g[j].accCode)
                        $('#hdnAccEntryMode_' + accIndex).val(mde);
                        var Is_Accompanied_call = docAccJson[accIndex - 1].Is_Accompanied_call;
                        if (Is_Accompanied_call == "YES")
                            $("input[name='Accompaniedcall_" + accIndex + "'][value='YES']").attr('checked', 'checked');
                        else if (Is_Accompanied_call == "NO")
                            $("input[name='Accompaniedcall_" + accIndex + "'][value='NO']").attr('checked', 'checked');
                        if (ofd.toUpperCase() == "Y") {
                            $('#chkindependentcall_' + accIndex).attr('disabled', false);
                            $('#chkindependentcall_' + accIndex).attr('checked', 'checked');
                            $('#chkindependentcall_' + accIndex).attr('disabled', 'disabled');
                            $("input[name='Accompaniedcall_" + accIndex + "'][value='NO']").attr('checked', 'checked');
                            $("input[name='Accompaniedcall_" + accIndex + "']").attr('disabled', 'disabled');

                        }
                        if (mde.toUpperCase() == "A") {
                            $('#txtAccName_' + accIndex).attr('disabled', 'disabled');
                            $('#chkindependentcall_' + accIndex).attr('disabled', 'disabled');
                            $('#accRemove' + accIndex).css('display', 'none');
                        }
                        else {
                            $('#txtAccName_' + accIndex).attr('disabled', false);
                            $('#accRemove' + accIndex).css('display', '');
                        }
                    }
                }
            }
            //fnAddAccompanist(null, 'txtAccName_' + (++accIndex).toString());
            //fnBindAccName();
            //Add newly added Accname in first screen
            var docAccJson_miss = new Array();
            for (var i = 0; i < acc_g.length; i++) {
                var tru_status = 0;
                var tblAccLength = $('#tbl_DoctorAccDetails tr').length;
                for (var j = 1; j < tblAccLength; j++) {
                    var txtAccName = $("#txtAccName_" + j).val();
                    if (acc_g[i].accName == txtAccName)
                        tru_status++;
                }
                if (tru_status == 0)
                    docAccJson_miss.push(acc_g[i]);
            }
            if (docAccJson_miss.length > 0)
                fnBindAccNameInObject(docAccJson_miss);
            fnDiasbleAccName();
        }
        else {
            //fnAddAccompanist(null, 'txtAccName_0');
            //fnSetAccDivCollapse()
            fnBindAccName();
            fnDiasbleAccName();
        }

        var pindex = 0;
        if (productJson && productJson.length > 0) {
            for (var prIndex = 0; prIndex < productJson.length; prIndex++) {
                pindex = prIndex;
                pindex = pindex + 1;
                fnAddProductRow(true, $('#txtProd_' + pindex.toString())[0]);
                if (productAutoFill_g != null && productAutoFill_g.length > 0) {
                    // only for saved doctors.
                    if (dvcode.length > 0 && $('#hdnRecord_Status').val() == "3") {
                        for (var pi = 0; pi < productAutoFill_g.length; pi++) {
                            if (productAutoFill_g[pi].value.split('_')[0] == productJson[prIndex].Product_Code) {
                                var avQty = productAutoFill_g[pi].label.substring(productAutoFill_g[pi].label.lastIndexOf('(') + 1).replace(')', '');
                                var gQty = productJson[prIndex].Quantity_Provided
                                var qty = parseInt(avQty) + parseInt(gQty);
                                productAutoFill_g[pi].label = productAutoFill_g[pi].label.substring(0, productAutoFill_g[pi].label.lastIndexOf('(')) + '(' + qty.toString() + ')';
                            }
                        }
                    }
                    var products = jsonPath(productAutoFill_g, "$[?(@.Product_Code=='" + productJson[prIndex].Product_Code + "')]");
                    if (products) {
                        $('#' + 'txtProd_' + pindex).val(products[0].label);
                        $('#' + 'hdnProd_' + pindex).val(products[0].value);
                    }
                    else {
                        $('#' + 'txtProd_' + pindex).val(productJson[prIndex].Product_Name);
                    }
                }
                else {
                    if (productJson[prIndex].Product_Name != null) {
                        $('#' + 'txtProd_' + pindex).val(productJson[prIndex].Product_Name);
                    }
                }

                var Batches = "";
                Batches = fnGetProductBatch(productJson[prIndex].Product_Code, 'D', dvcode);
                if (Batches.length > 0) {
                    var strhtml = "";
                    for (var i = 0; i < Batches.length; i++) {
                        strhtml += "<option value='" + Batches[i].Batch_Number + "'>" + Batches[i].Batch_Number + "</option>";
                    }
                    $("#selBatch_" + pindex.toString()).html(strhtml);
                    $("#selBatch_" + pindex.toString()).val(productJson[prIndex].Batch_Number);
                    $("#hdnBatches_" + pindex.toString()).val(JSON.stringify(Batches));
                }
                else {
                    $("#selBatch_" + pindex.toString()).html("<option value=''>-No Batch Found-</option>");
                    $("#hdnBatches_" + pindex.toString()).val("");
                }

                $('#' + 'selBatch_' + pindex).val(productJson[prIndex].Batch_Number);
                $('#' + 'txtProdQty_' + pindex).val(productJson[prIndex].Quantity_Provided);
                if (productJson[prIndex].Is_Detailed == "1") {
                    $('#chkProdDetail' + pindex).attr('checked', true);
                }
                $('#txtProd_' + pindex).onkeyup = null;
            }
        }
        fnAddProductRow(null, 'txtProd_' + (++pindex).toString());


        // TO DO: Detailed Row Add.
        var detpindex = 0
        if (detProdJson != null && detProdJson.length > 0) {
            fnSetDetDivExpand();
            for (var dpRIndex = 0; dpRIndex < detProdJson.length; dpRIndex++) {
                detpindex = dpRIndex;
                detpindex = detpindex + 1;
                fnAddDetailedProductsRow(true, 'txtproductDetailed_' + detpindex);
                var saleProductName = jsonPath(detailedProductsAutoFill_g, "$[?(@.value=='" + detProdJson[dpRIndex].Sale_Product_Code + "')]");
                if (saleProductName != null && saleProductName != false) {
                    $('#txtproductDetailed_' + detpindex).val(saleProductName[0].label);
                    $('#hdnproductDetailed_' + detpindex).val(saleProductName[0].value);
                    //prodcode = $('#hdnproductDetailed_' + detpindex).val(saleProductName[0].value);
                }
                else {
                    $('#txtproductDetailed_' + detpindex).val(detProdJson[dpRIndex].Sale_Product_Name)
                }
                // -------------------
                if (fnCheckValueExistDropDown(("ddlBusineesStatus_" + detpindex), detProdJson[dpRIndex].Business_Status_ID))
                    $("#ddlBusineesStatus_" + detpindex).val(detProdJson[dpRIndex].Business_Status_ID);
                else {
                    var ddl = "";
                    for (var s = 0; s < DoctorBusiness_g.length; s++) {
                        if (DoctorBusiness_g[s].Business_Status_ID == detProdJson[dpRIndex].Business_Status_ID) {
                            ddl += '<option value=' + DoctorBusiness_g[s].Business_Status_ID + '>' + DoctorBusiness_g[s].Status_Name + '</option>';
                        }
                    }
                    $("#ddlBusineesStatus_" + detpindex).append(ddl);
                    $("#ddlBusineesStatus_" + detpindex).val(detProdJson[dpRIndex].Business_Status_ID);
                    $("#divBusineesStatus_" + detpindex).show();
                    $("#divBusinessHeader").show();
                    $("#divDetailProd_" + detpindex).css("width", "50%");
                }
                //-----------------------
                //if (detProdJson[dpRIndex].Business_Status_ID != '' && detProdJson[dpRIndex].Business_Status_ID != '0') {
                //$("#divProductRemark_" + detpindex).show();
                $("#txtDetailProductRemark_" + detpindex).val(detProdJson[dpRIndex].Business_Status_Remarks);
                if (parseInt(detProdJson[dpRIndex].BusinessPotential) >= 0)
                    $("#txtBusinessPotential_" + detpindex).val(detProdJson[dpRIndex].BusinessPotential);
                //}
                $('#hdnDetEntryMode_' + detpindex).val(detProdJson[dpRIndex].Mode_Of_Entry);
                if (detProdJson[dpRIndex].Mode_Of_Entry == "A") {
                    $('#txtproductDetailed_' + detpindex).attr('disabled', 'disabled');
                    $('#DetailedprodRemove' + detpindex).css('display', 'none');
                }
                else {
                    $('#txtproductDetailed_' + detpindex).attr('disabled', false);
                    $('#DetailedprodRemove' + detpindex).css('display', '');
                }
            }
            fnAddDetailedProductsRow(null, 'txtproductDetailed_' + (++detpindex).toString());
            var privilege = fnGetPrivilegeValue("COLLECT_RETAIL_COMPETITOR_INFO", "0");
            if (privilege == 1) {
                fngetCompdetails(doctorjson.Doctor_Visit_Code, detProdJson);

            }


        }
        else {
            fnAddDetailedProductsRow(null, 'txtproductDetailed_' + detpindex);
            //fnSetDetDivCollapse();
        }


        var cindex = 0;
        if (chemistJson && chemistJson.length > 0) {
            // looping the chemists.

            var cindex = 0;
            for (var crIndex = 0; crIndex < chemistJson.length; crIndex++) {
                cindex = crIndex;
                cindex = cindex + 1;
                fnAddChemistRow(true, 'txtChem_' + cindex);
                $('#' + 'txtChem_' + cindex).val(unescape(chemistJson[crIndex].Chemist_Name));
                $('#' + 'hdnChem_' + cindex).val(chemistJson[crIndex].Chemist_Code);
                $('#' + 'txtChemPOB_' + cindex).val(chemistJson[crIndex].POB_Amount);

                // Retrieves the chemist visit code.
                var chemistVisitCode = chemistJson[crIndex].DCR_Chemists_Code;

                if (RCPA_g == "R") {
                    // Retrieves the given chemist rcpa details.
                    var rcpaList = jsonPath(rcpaJson, "$.[?(@.Chemist_Visit_Code=='" + chemistVisitCode + "')]");

                    if (rcpaList && rcpaList.length > 0) {
                        // declare the variables.
                        var prevProductCode;
                        var saleProductRowIndex = 0;

                        // looping the rcpa details.                
                        for (var rcIndex = 0; rcIndex < rcpaList.length; rcIndex++) {

                            // The 0 th index have default a rcpa sale product table, so we do not create a sale product table.
                            // and the 0 th product code set the previous product code.
                            // then check the next index dcr product code is same the previous product code, if same, we assume they are competitor row. so continue the statement.
                            // if not equal we assume next product comming and create a sale product row.
                            if (rcIndex != 0) {
                                if (prevProductCode != rcpaList[rcIndex].DCR_Product_Code) {
                                    fnAddSaleProductRow($('#txtchem_prod_' + cindex + '_' + saleProductRowIndex)[0]);
                                    saleProductRowIndex++;
                                    $('#' + 'txtchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Product_Name);
                                    $('#' + 'txtchem_prodQty_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Suuport_Qty);
                                    $('#' + 'hdnchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].DCR_Product_Code);
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                saleProductRowIndex++;
                                $('#' + 'txtchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Product_Name);
                                $('#' + 'txtchem_prodQty_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].Suuport_Qty);
                                $('#' + 'hdnchem_prod_' + cindex + '_' + saleProductRowIndex).val(rcpaList[rcIndex].DCR_Product_Code);
                            }

                            // Retrieve the competitors for selected product.

                            var compJSON = jsonPath(rcpaList, "$.[?(@.DCR_Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "')]");
                            // set the prev product code. this is important.
                            var prevProductCode = rcpaList[rcIndex].DCR_Product_Code;

                            // Remove the product name as competitor.
                            for (var i = 0; i < compJSON.length; i++) {
                                if (compJSON[i].Competitor_Product_Name == rcpaList[rcIndex].Product_Name) {
                                    compJSON.splice(i, 1);
                                }
                            }

                            // looping the competitors.
                            var compRowIndex = 0;
                            for (var compIndex = 0; compIndex < compJSON.length; compIndex++) {
                                var compRowIndex = compIndex + 1;
                                // In 0 th index we have default competitor row. so we do not create competitor row.
                                if (compIndex == 0) {
                                    $('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name)
                                    $('#txtchem_prod_compQty_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Suuport_Qty)
                                    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
                                    if (compautoFill) {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
                                    }
                                    else {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
                                    }
                                }
                                else {
                                    var preCompRowIndex = compRowIndex - 1;
                                    fnAddCompRow($('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + preCompRowIndex)[0]);
                                    $('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Competitor_Product_Name);
                                    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + rcpaList[rcIndex].DCR_Product_Code + "' & @.label=='" + compJSON[compIndex].Competitor_Product_Name + "')]");
                                    if (compautoFill) {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compautoFill[0].value);
                                    }
                                    else {
                                        $('#hdnchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val('');
                                    }
                                    $('#txtchem_prod_compQty_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex).val(compJSON[compIndex].Suuport_Qty)
                                }
                            }

                            // Creates a empty competitor row.
                            if (compJSON.length > 0) {
                                fnAddCompRow($('#txtchem_prod_comp_' + cindex + '_' + saleProductRowIndex + '_' + compRowIndex)[0]);
                            }
                        }

                        // Creates a empty sale product row.
                        fnAddSaleProductRow($('#txtchem_prod_' + cindex + '_' + saleProductRowIndex)[0]);
                    }
                }
                $('#divRCPA_' + crIndex).next().hide();
            }
        }
        fnAddChemistRow(null, 'txtChem_' + (++cindex));
        //Follow_Up
        var follow_index = 1;
        if (followUpJSON != undefined && followUpJSON.length > 0) {
            for (var i = 1; i <= followUpJSON.length; i++) {
                fnAddFollowUp(null, 'txt_Follow_taskName_' + follow_index);
                $("#txt_Follow_taskName_" + i).val(followUpJSON[(i - 1)].Tasks);
                $("#txtdueDate_" + i).val(followUpJSON[(i - 1)].Due_Date);
                follow_index++;
            }

        }
        fnAddFollowUp(null, 'txt_Follow_taskName_' + follow_index);

        //Attachment
        // DoctorAttJSONArray = '';
        DoctorAttJSONArray = [];

        var myDropzone = Dropzone.forElement("#dZUpload");
        if (AttachmentJSON != undefined && AttachmentJSON.length > 0) {

            var imgName = "";
            for (var i = 0; i < AttachmentJSON.length; i++) {
                if (AttachmentJSON[i].Status == "1") {
                    var DoctorAttArray = {};
                    DoctorAttArray.Blob_Url = AttachmentJSON[i].Blob_Url;
                    DoctorAttArray.Filename = AttachmentJSON[i].Filename;
                    DoctorAttArray.Status = "1";
                    DoctorAttJSONArray.push(DoctorAttArray);
                    imgName += '<div class="attachementDisplay"><span class="attachementImgname">' + AttachmentJSON[i].Filename + "</span><span class='attachementImgDel'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick=fnRemoveAttachment('" + i + "',this) </span></div>";
                }

            }
            //file_Max_Count = 5 - (AttachmentJSON.length);

            myDropzone.options.maxFiles = (5 - DoctorAttJSONArray.length);
            $("#dZUpload").append('<div class="fileCont">' + imgName + '</div>');
        }
        else
            myDropzone.options.maxFiles = 5;
        //Stockist
        var Stockist_index = 1;
        var pobCount = $("#hdnPOBCount_" + rowPosition).val();
        if (parseInt(pobCount) > 0) {
            fnGetDCRPOBDetailsByVisitCode($('#hdnDoctorVisitCode').val().trim());
            $("#POB").show();
        }
        else if (doc_Visit_Controls_g.indexOf(pob_privilege_name) < 0)
            $("#POB").hide();
        else
            fnAddStockist(false, null);

        GetAccompanistmandatoryvalue();

    }
    else {
        if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
            fnSetServerTime();
        }
        fnAddAccompanist(null);
        fnAddProductRow(null);
        fnAddDetailedProductsRow(null);
        fnAddChemistRow(null);
    }
}


function fnAddAccompanist(isDraft, curAccObj) {
    doctorAccRowIndex_g++;
    var tblAccLength = $('#tbl_DoctorAccDetails tr').length;
    var newAccRow = document.getElementById('tbl_DoctorAccDetails').insertRow(parseInt(tblAccLength));
    newAccRow.id = "AccRow_" + doctorAccRowIndex_g;

    // Product Name.
    var td1 = newAccRow.insertCell(0);
    $(td1).css("width", "75%;");
    var htmlvalue = "";
    if (isDraft) {
        htmlvalue = "<input style='width: 100%;border: none;background: none;font-size: 11px;' type='text' id='txtAccName_" + doctorAccRowIndex_g + "'   onblur='fnSetOnlyForDoc(this);' class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtAccName_\",\"hdnAccName_\");fnSetOnlyForDoc(this);' /><input type='hidden' id='hdnAccName_" + doctorAccRowIndex_g + "'  />";
    }
    else {
        htmlvalue = "<input style='width: 100%;border: none;background: none;font-size: 11px;' type='text' id='txtAccName_" + doctorAccRowIndex_g + "'  class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtAccName_\",\"hdnAccName_\");fnSetOnlyForDoc(this);'";
        htmlvalue += " ondblclick='fnAddAccompanist(null,this)'  onkeyup='fnAddAccompanist(null,this)'/>";
        htmlvalue += "<input type='hidden' id='hdnAccName_" + doctorAccRowIndex_g + "'  />";
    }
    $(td1).html(htmlvalue);

    var td2 = newAccRow.insertCell(1);
    $(td2).css("textAlign", "center");
    htmlvalue = "<input style='display:none;' type='checkbox' id='chkindependentcall_" + doctorAccRowIndex_g + "' disabled='disabled' />";
    $(td2).html(htmlvalue);

    var td3 = newAccRow.insertCell(2);
    htmlvalue = "<input type='hidden' id='hdnAccEntryMode_" + doctorAccRowIndex_g + "' />"
    $(td3).html(htmlvalue);

    // Remove icon.
    var td4 = newAccRow.insertCell(3);
    $(td4).addClass('deleteRowIcon hidden')
    $(td4).html("<img id='accRemove" + doctorAccRowIndex_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' onclick='fnDeleteAccRow(" + doctorAccRowIndex_g + ");' style='cursor:pointer' >");
    if (curAccObj != null) {
        curAccObj.onkeyup = null;
        curAccObj.ondblclick = null;
    }
    var td5 = newAccRow.insertCell(4);
    $(td5).html("<input type='radio' name='Accompaniedcall_" + doctorAccRowIndex_g + "' value='YES'>Yes<input type='radio' name='Accompaniedcall_" + doctorAccRowIndex_g + "' value='NO'>No");
    if (accAutoFill_g != null && accAutoFill_g.length > 0) {
        autoComplete(accAutoFill_g, "txtAccName_", "hdnAccName_", "autoacc");
    }
    $(".setfocus").click(function () { $(this).select(); });

}
function fnAddFollowUp(isDraft, curAccObj) {
    FollowUpRowIndex_g++;
    var tblFollowLength = $('#tbl_Followup tr').length;
    var newFollowRow = document.getElementById('tbl_Followup').insertRow(parseInt(tblFollowLength));
    newFollowRow.id = "Follow_up_Row_" + FollowUpRowIndex_g;

    // Product Name.
    var td1 = newFollowRow.insertCell(0);
    //$(td1).html(tblFollowLength + '.');
    $(td1).html('');
    // $(td1).css("display", "none");
    var td2 = newFollowRow.insertCell(1);

    $(td2).css("width", "75%;");
    var htmlvalue = "";
    if (isDraft) {
        htmlvalue = "<input style='width: 100%;' class='followClass' type='text' id='txt_Follow_taskName_" + FollowUpRowIndex_g + "' />";
    }
    else {
        htmlvalue = "<input style='width: 100%;' class='followClass'  type='text' id='txt_Follow_taskName_" + FollowUpRowIndex_g + "' style='width:95%' ";
        htmlvalue += " ondblclick='fnAddFollowUp(null)'  onkeyup='fnAddFollowUp(null,this)'/>";
    }
    $(td2).html(htmlvalue);

    var td3 = newFollowRow.insertCell(2);
    $(td3).css("padding-left", "21px");
    htmlvalue = "<input type='text' id='txtdueDate_" + FollowUpRowIndex_g + "'  class='form-control datepicker'/>";
    $(td3).html(htmlvalue);
    // Remove Icon.
    var td4 = newFollowRow.insertCell(3);
    $(td4).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteFollowUpRow(' + FollowUpRowIndex_g + ')" />');
    $(td4).addClass('valign-top');
    $(td4).addClass('deleteRowIcon');
    if (curAccObj != null) {
        curAccObj.onkeyup = null;
        curAccObj.ondblclick = null;
    }
    $(".datepicker").datepicker({
        dateFormat: 'dd/mm/yy',
        numberOfMonths: 1,
        //showButtonPanel: true
        minDate: new Date(dcrActualDate_g)
    });
}
function fnAddActivityRow(curObj, isDraft) {
    debugger;
    var id = 0;
    if (curObj != null)
        id = parseInt(curObj.id.split('_')[3]);
    else if (isDraft == null) {
        $("#tbl_Activity tbody").html('');
    }
    else if (isDraft > 0) {
        id = isDraft;
    }
    var row = "<tr><td style='width: 40%;'><input style='bottom: 25px;position: relative;width: 89%;' class='autoActivity' id='txt_Activity_Name_" + (id + 1) + "' type='text' ondblclick='fnAddActivityRow(this)'  onkeyup='fnAddActivityRow(this)' onblur='fnValidateActivity(this)'/>";
    row += "<input type='hidden' id='hdnActivity_Code_" + (id + 1) + "' /> <input type='hidden' id='hdnActivityType_" + (id + 1) + "' /> </td>";
    row += "<td><div id='divRemark_" + (id + 1) + "'><textarea maxlength='250' id='txtRemark_" + (id + 1) + "' /></div></td>";
    row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteactivity(this)"/> </td>';
    row += "</tr>";

    $("#tbl_Activity").append(row);
    autoComplete(ActivityAutoFill_g, "txt_Activity_Name_", "hdnActivity_Code_", "autoActivity");
    for (var i = 1; i < $("#tbl_Activity tr").length - 1; i++) {
        $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("onkeyup");
        $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("ondblclick");
    }
}
function fnAddMCActivityRow(curObj, isDraft) {
    debugger;
    var id = 0;
    if (curObj != null)
        id = parseInt(curObj.id.split('_')[3]);
    else if (isDraft == null) {
        $("#tbl_MC_Activity tbody").html('');
    }
    else if (isDraft > 0) {
        id = isDraft;
    }
    if (id != 0) {
        $("#txt_MCActivity_Name_" + (id) + "").removeAttr("onkeyup");
        $("#txt_MCActivity_Name_" + (id) + "").removeAttr("ondblclick");
    }
    var row = "<tr class='mcandcmeactivity'><td style='width:30%;bottom: 25px;position: relative;'><input style='width:95%;' class='autoMCActivity' id='txt_MCActivity_Name_" + (id + 1) + "' type='text' ondblclick='fnAddMCActivityRow(this)'  onkeyup='fnAddMCActivityRow(this)' onblur='fnMCValidateActivity(this)'/>";
    row += "<input type='hidden' id='hdnMCActivity_Code_" + (id + 1) + "' /> <input type='hidden' id='hdnMCActivityType_" + (id + 1) + "' /> </td>";
    row += "<td style='width:30%;bottom: 25px;position: relative;'><div style='' id='divMC_" + (id + 1) + "'><select style='width: 95%;' id='ddlMC_" + (id + 1) + "' onchange='ValidateCME()'><option>-select-</option></select> </div></td>";
    row += "<td style='width:40%;'><textarea maxlength='250' id='txtMCRemark_" + (id + 1) + "'></textarea></td>";
    row += "</tr>";
    row += "<tr class='sales' id='CMESales_" + (id + 1) + "'></tr>";
    //row += "<tr class='sales' id='CMESales_" + (id + 1) + "'></tr>";
    //row += "<tr class='sales'><td><input style='width:40%;position: relative;margin-bottom:7px;' id='txt_Currentsales_" + (id + 1) + "' type='text' placeholder='Current monthly sales'/></td>";
    //row += "<td><input style='width:40%;position: relative;margin-bottom:7px;' id='txt_Expectedsales_" + (id + 1) + "' type='text' placeholder='Expected monthly sales'/></td>"
    //row += "<td><input style='width:40%;position: relative;margin-bottom:7px;' id='txt_Noofmonths_" + (id + 1) + "' type='text' placeholder='No of months' disabled/></td>"
    //row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteMCActivity(this)"/> </td></tr>';

    $("#tbl_MC_Activity").append(row);
    autoComplete(MCDetails_g, "txt_MCActivity_Name_", "hdnMCActivity_Code_", "autoMCActivity");
    //for (var i = 1; i < $("#tbl_MC_Activity tbody tr.mcandcmeactivity").length - 1; i++) {
    //    $("#tbl_MC_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("onkeyup");
    //    $("#tbl_MC_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("ondblclick");
    //}
}
function bindCME(id, response) {
    var row = "";
    var CME_ID = 0;
    if (response.length > 0) {
        CME_ID = response[0].Campaign_Code;
        debugger;
        row += "<td colspan=3><table id='tableCME_" + id + "' style='border: none;'><tr class=" + CME_ID + "><td><label>No Of Month</label><input style='position: relative;margin-bottom:7px;' id='txt_Month_" + (id) + "' type='text' value=" + response[0].No_Of_Months + "  placeholder='No_Of_Month'/></td></tr>"

        for (var i = 0; i < response.length; i++) {

            row += "<tr class=" + CME_ID + "><td><input id='hdtxt_Product_" + i + '_' + (id) + "' type='hidden'  Value='" + response[i].Product_Code + "'/><input style='width:90%;position: relative;margin-bottom:7px;' id='txt_Product_" + i + '_' + (id) + "' type='text' placeholder='Product Name' Value='" + response[i].Product_Name + "' readonly/></td>"
            row += "<td><input style='width:90%;position: relative;margin-bottom:7px;' id='txt_Currentsales_" + i + '_' + (id) + "' type='number' placeholder='Current monthly sales' value='" + response[i].Current_Sales + "' onkeypress='return fnValidateBudget(this,event);'/></td>"
            row += "<td><input style='width:90%;position: relative;margin-bottom:7px;' id='txt_Expectedsales_" + i + '_' + (id) + "' type='number' placeholder='Expected monthly sales'  value='" + response[i].Expected_Sales + "' onkeypress='return fnValidateBudget(this,event);'/></td></tr>"

        }
        row += '</table></td>';
    }
    //row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteMCActivity(this)"/> </td></tr>';
    $('.' + CME_ID).remove();
    $('#CMESales_' + id).html(row);

}
function fnPrefillMonth(curObj) {
    debugger;
    if (curObj != null) {
        id = parseInt(curObj.id.split('_')[3]);
    }
    var mcDetails = $.grep(MCDetails_g, function (element, index) {
        return element.Campaign_Code == $("#hdnMCActivity_Code_" + id).val();
    });
    if (mcDetails.length > 0) {
        $("#txt_Noofmonths_" + id).val(mcDetails[0].TrackMonth);
    }
}
function fnDeleteactivity(curObj) {
    debugger;
    var index = $(curObj).parent().parent().index() + 1;
    var tblIndex = $("#tbl_Activity tbody tr").length;
    if (index == tblIndex) {
        fnMsgAlert('info', docActivityTitle, 'You are not allowed to delete this row!');
    }
    else {
        $(curObj).parent().parent().remove();
    }
}
function fnDeleteMCActivity(curObj) {
    debugger;
    var index = $(curObj).parent().parent().index() + 1;
    var tblIndex = $("#tbl_MC_Activity tbody tr").length;
    if (index == tblIndex) {
        fnMsgAlert('info', docActivityTitle, 'You are not allowed to delete this row!');
    }
    else {
        $(curObj).parent().parent().closest('tr').prev().remove();
        $(curObj).parent().parent().remove();
    }
}
function fnValidateActivity(curObj) {
    fnValidateAutofill(curObj, ActivityAutoFill_g, "txt_Activity_Name_", "hdnActivity_Code_");
    var id = parseInt(curObj.id.split('_')[3]);
    //for (var i = 0; i < ActivityAutoFill_g.length; i++) {
    //    if (ActivityAutoFill_g[i].value == $("#hdnActivity_Code_" + id).val()) {
    //        $("#hdnActivityType_" + id).val(ActivityAutoFill_g[i].Activity_Type);
    //    }
    //}
    //if ($("#hdnActivityType_" + id).val() == 'A') {
    //    $("#txtRemark_" + id).val('');
    //    $("#divRemark_" + id).show();
    //    $("#divMC_" + id).hide();
    //}
    //else {
    //    var opt = "<option value='0'>-select-</option>";
    //    var mcDetails = $.grep(MCDetails_g, function (element, index) {
    //        return element.Campaign_Code == $("#hdnActivity_Code_" + id).val();
    //    });
    //    for (var j = 0; j < mcDetails.length; j++) {
    //        opt += "<option value=" + mcDetails[j].Campaign_Code + ">" + mcDetails[j].Campaign_Name + "</option>";
    //    }
    //    $("#ddlMC_" + id).html('');
    //    $("#ddlMC_" + id).html(opt);
    //    $("#divRemark_" + id).hide();
    //    $("#divMC_" + id).show();
    //}

}
function fnMCValidateActivity(curObj) {
    debugger;
    fnValidateAutofill(curObj, MCDetails_g, "txt_MCActivity_Name_", "hdnMCActivity_Code_");
    id = parseInt(curObj.id.split('_')[3]);


    var mcDetails = $.grep(MCActivityDetails_g, function (element, index) {
        return element.Campaign_Code == $("#hdnMCActivity_Code_" + id).val();
    });
    var opt = '';
    if (mcDetails.length == 1) {
        opt += "<option value=" + mcDetails[0].MC_Activity_Id + ">" + mcDetails[0].Activity_Name + "</option>";
    }
    else {
        opt += "<option value='0'>-select-</option>";
        for (var j = 0; j < mcDetails.length; j++) {
            opt += "<option value=" + mcDetails[j].MC_Activity_Id + ">" + mcDetails[j].Activity_Name + "</option>";
        }

    }
    $("#ddlMC_" + id).html('');
    $("#ddlMC_" + id).html(opt);

    var value = $("#txt_MCActivity_Name_" + id).val()
    if (value != undefined || value != null) {
        value = value.split('-')[1]
        $('#tableCME_' + id).remove();
        if (value == "CME") {
            debugger;
            // getCMEProduct(id, $("#hdnMCActivity_Code_" + id).val());

        }
        else {
            fnPrefillMonth(curObj);

        }
    }

    // }
}
function getCMEProduct(CME_ID, activityid) {
    debugger;
    var Doctor_Code = $("#hdnDocName").val().trim();
    $.ajax({
        url: 'HiDoctor_Activity/DCRV4DoctorVisit/GetCMEProduct',
        type: "GET",
        data: "CME_ID=" + $("#hdnMCActivity_Code_" + id + "").val() + "&Doctor_Code=" + Doctor_Code + "&Activity_Id=" + $("#ddlMC_" + id + "").val(),
        success: function (response) {
            var row = "";
            if (response.length > 0) {

                debugger;
                row += "<td colspan=3><table id='tableCME_" + id + "' style='border: none;'><tr class=" + CME_ID + "><td><label>No Of Month</label><input style='position: relative;margin-bottom:7px;' id='txt_Month_" + (id) + "' type='text' value=" + response[0].No_Of_Month + "  placeholder='No_Of_Month'/></td></tr>"

                for (var i = 0; i < response.length; i++) {

                    row += "<tr class=" + CME_ID + "_" + id + "><td><input id='hdtxt_Product_" + i + '_' + (id) + "' type='hidden'  Value='" + response[i].Product_code + "'/><input style='width:90%;position: relative;margin-bottom:7px;' id='txt_Product_" + i + '_' + (id) + "' type='text' placeholder='Product Name' Value='" + response[i].Product_Name + "' readonly/></td>"
                    row += "<td><input style='width:90%;position: relative;margin-bottom:7px;' id='txt_Currentsales_" + i + '_' + (id) + "' type='number' placeholder='Current monthly sales' onkeypress='return fnValidateBudget(this,event);'/></td>"
                    row += "<td><input style='width:90%;position: relative;margin-bottom:7px;' id='txt_Expectedsales_" + i + '_' + (id) + "' type='number' placeholder='Expected monthly sales' onkeypress='return fnValidateBudget(this,event);'/></td></tr>"

                }
                row += '</table></td>';
                $('.' + CME_ID + '_' + id).remove();
                $('#CMESales_' + id).html(row);
                // $('#CMEMonths_' + id).html(Months);
            }
            //row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteMCActivity(this)"/> </td></tr>';

        },
        error: function () {

        }

    });
}
function ValidateCME() {
    debugger;
    var Doctor_Code = $("#hdnDocName").val().trim();
    $.ajax({
        url: 'HiDoctor_Activity/DCRV4DoctorVisit/ValidateCME',
        type: "GET",
        data: "CME_ID=" + $("#hdnMCActivity_Code_" + id + "").val() + "&Doctor_Code=" + Doctor_Code + "&Activity_Id=" + $("#ddlMC_" + id + "").val(),
        success: function (response) {
            debugger;
            if (response == "0") {
                getCMEProduct();
            }
            else {
                fnMsgAlert('info', 'info', 'Same activity and cme combination is present.');
            }
        }
    });
}
function fnAddStockist(isDraft, curAccObj) {
    //debugger;
    POBRowIndex_g++;

    //Stockist Header
    var tblPOBLength = $('#tbl_POB tr').length;
    var newPOBRow = document.getElementById('tbl_POB').insertRow(parseInt(tblPOBLength));
    newPOBRow.id = "POB_Row_" + POBRowIndex_g;
    if (POBRowIndex_g != 1)
        newPOBRow.style = "border-top:  2px solid #000 !important;";
    var td1 = newPOBRow.insertCell(0);
    var htmlvalue = StockistHeader_g + ' Name';
    td1.style.width = "67%";
    $(td1).html(htmlvalue);
    var td2 = newPOBRow.insertCell(1);
    var htmlvalue = "Due Date";
    $(td2).html(htmlvalue);
    var td3 = newPOBRow.insertCell(2);
    var htmlvalue = "";
    $(td3).html(htmlvalue);

    POBRowIndex_g++;
    var tblPOBLength = $('#tbl_POB tr').length;
    var newPOBRow = document.getElementById('tbl_POB').insertRow(parseInt(tblPOBLength));
    newPOBRow.id = "POB_Row_" + POBRowIndex_g;

    //Stockist Name
    var td1 = newPOBRow.insertCell(0);
    var htmlvalue = "";
    if (isDraft) {
        //htmlvalue = "<input style='width: 100%;  border: none;background: none;font-size: 11px;' type='text' id='txtAccName_" + doctorAccRowIndex_g + "'   onblur='fnSetOnlyForDoc(this);' class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtAccName_\",\"hdnAccName_\");fnSetOnlyForDoc(this);' /><input type='hidden' id='hdnAccName_" + doctorAccRowIndex_g + "'  />";
        htmlvalue = "<input onblur='fnValidateStockistName(this)' style='width: 96%; font-size: 11px; ' type='text' id='txt_Stockist_Name_" + POBRowIndex_g + "'class='autoStockist setfocus' style='width:95%' />";
        //onblur='fnValidateAutofill(this," + 'StockistAutoFill_g' + ",\"txt_Stockist_Name_\",\"hdnStockist_Name\");fnSetOnlyForDoc(this);' />

    }
    else {
        //htmlvalue = "<input style='width: 100%;  border: none;background: none;font-size: 11px;' type='text' id='txtAccName_" + doctorAccRowIndex_g + "'  class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtAccName_\",\"hdnAccName_\");fnSetOnlyForDoc(this);'";
        htmlvalue = "<input style='width: 96%;' type='text' id='txt_Stockist_Name_" + POBRowIndex_g + "' class='autoStockist setfocus' style='width:95%' onblur='fnValidateStockistName(this)' />";
        //htmlvalue += " ondblclick='fnAddStockist(null)'  onkeyup='fnAddStockist(null,this)'/>";

    }
    htmlvalue += "<input type='hidden' id='hdnStockist_Code_" + POBRowIndex_g + "'  />";
    htmlvalue += "<input type='hidden' id='hdnOrder_Id_" + POBRowIndex_g + "'  />";
    htmlvalue += "<input type='hidden' id='hdnOrder_Number_" + POBRowIndex_g + "'  />";
    htmlvalue += "<input type='hidden' id='hdnOrder_Status_" + POBRowIndex_g + "'  />";
    td1.style.width = "67%;";
    $(td1).html(htmlvalue);

    //Due Date
    var td2 = newPOBRow.insertCell(1);
    //$(td2).css("padding-left", "21px");
    htmlvalue = "<input type='text' id='txtStockistdueDate_" + POBRowIndex_g + "'  class='form-control datepicker'/>";
    $(td2).html(htmlvalue);

    // Remove Icon.
    var td3 = newPOBRow.insertCell(2);
    $(td3).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteStockist(' + POBRowIndex_g + ')" />');
    $(td3).addClass('valign-top');
    $(td3).addClass('deleteRowIcon');
    if (curAccObj != null) {
        curAccObj.onkeyup = null;
        curAccObj.ondblclick = null;
        if (curAccObj.length == undefined)
            curAccObj.style.display = 'none';
    }
    //Child Table create
    SalesProductTableIndex++;
    var newPOBRow = document.getElementById('tbl_POB').insertRow(parseInt((tblPOBLength + 1)));
    POBRowIndex_g++;
    newPOBRow.id = "POB_Row_" + POBRowIndex_g;
    var td1 = newPOBRow.insertCell(0);
    td1.colSpan = 3;
    td1.style.width = "100%";
    td1.className = "salesProduct";
    $(td1).html('<div id="tblSalesProduct_' + SalesProductTableIndex + '" style="width: 100%;"></div>');
    $("#tblSalesProduct_" + SalesProductTableIndex).append("<div style='width: 100%;float: left;margin: 5px 0px;'><div style='width: 50%;' class='left'>Product Name</div><div class='left' style='width: 15%;text-align: center;'>Quantity</div><div class='left' style='width: 15%;text-align: center;'>Unit Rate</div><div style='width: 15%;text-align: center;' class='left'>Amount</div></div>");



    //Child Table create
    var newPOBRow = document.getElementById('tbl_POB').insertRow(parseInt((tblPOBLength + 2)));
    //newPOBRow.colspan = 3;
    POBRowIndex_g++;
    newPOBRow.id = "POB_Row_" + POBRowIndex_g;
    var td1 = newPOBRow.insertCell(0);
    td1.style.width = "100%";
    td1.colSpan = 3;
    td1.className = "salesRemark";

    var html = "<div style='padding: 5px;border-top: 1px solid #aaa !important;'><div style='float: left; width: 68%;'> No. of Product(s):<lable style='padding-left: 1%;' id=lblprodutCount_" + SalesProductTableIndex + ">0</lable></div>";
    html += "<div>Total POB Value : <lable style='padding-left: 1%;' id=lblTotalPOBAmount_" + SalesProductTableIndex + ">0</lable></div></div>";
    html += "<div><div padding: 5px;    border-top: 1px solid #aaa !important;>Remarks (Optional)<div><div><textarea id=txtReamrk_" + SalesProductTableIndex + " maxlength='500'></textarea></div></div>";
    if (!isDraft) {
        html += '<div class="addNewBtn" ><input type="button" onclick="fnAddStockist(false,this);" value="Add New POB"></div>';
    }
    $(td1).html(html);


    autoComplete(StockistAutoFill_g, "txt_Stockist_Name_", "hdnStockist_Code_", "autoStockist");

    fnAddSalesProduct(isDraft, '0', SalesProductTableIndex);

    $(".datepicker").datepicker({
        dateFormat: 'dd/mm/yy',
        numberOfMonths: 1,
        //showButtonPanel: true
        minDate: new Date(dcrActualDate_g)
    });

}

function fnAddSalesProduct(isDraft, rowId, mainID, curAccObj) {
    debugger;
    var nextrowId = (parseInt(rowId) + 1);
    /// privilege value for ALLOW_SS_PRICE_EDIT_IN_DCR
    //var Privilege_Value = "";
    //var htmlvalue = "";
    //var Privilege_Value = fnGetPrivilegeValue("ALLOW_SS_PRICE_EDIT_IN_DCR", "");
    //var DoctorEditPrivilegeArr = Privilege_Value.split(',');
    //if (DoctorEditPrivilegeArr.length > 0) {
    //    for (var i = 0; i < DoctorEditPrivilegeArr.length; i++) {

    //        if (DoctorEditPrivilegeArr[i] == "DOCTOR") {
    //           // Privilege_Value = "DOCTOR";

    //            htmlvalue = "<input style='width: 80%;cursor: not-allowed;' class='textalignRight' type='text' id='txt_SUnit_" + mainID + "_" + rowId + "'/>";
    //            $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'>" + htmlvalue + "</div>");
    //        }

    //        else {

    //            htmlvalue = "<input style='width: 80%;cursor: not-allowed;' class='textalignRight' type='text' id='txt_SUnit_" + mainID + "_" + rowId + "' disabled/>";
    //            $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'>" + htmlvalue + "</div>");

    //        }
    //    }
    //}
    $("#tblSalesProduct_" + mainID).append("<div class='productHeader' id='proDiv_" + mainID.toString() + "_" + rowId.toString() + "'></div>");
    var htmlvalue = "";

    if (isDraft) {
        htmlvalue = "<input class='autoSSalesProducts setfocus' style='width: 94%;'  type='text' id='txt_SSalesProducts_" + mainID + "_" + rowId + "' onblur=fnValidateSalesProducts(this); />";
        htmlvalue += htmlvalue = "<input type='hidden' id='hdnSSales_Products_" + mainID + "_" + rowId + "'  />";
    }
    else {
        htmlvalue = "<input class='autoSSalesProducts setfocus'   type='text' id='txt_SSalesProducts_" + mainID + "_" + rowId + "' style='width:94%' ";
        htmlvalue += " ondblclick=fnAddSalesProduct(null," + nextrowId + "," + mainID + ",this)  onkeyup=fnAddSalesProduct(null," + nextrowId + "," + mainID + ",this) onblur=fnValidateSalesProducts(this); />";
        htmlvalue += htmlvalue = "<input type='hidden' id='hdnSSales_Products_" + mainID + "_" + rowId + "'  />";
    }
    $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div style='width:50%;' class='left'>" + htmlvalue + "</div>");

    htmlvalue = "";
    htmlvalue = "<input style='width: 80%;' class='SalesProductsQty textalignRight' type='text' id='txt_SQty_" + mainID + "_" + rowId + "' onkeyup=fnSalesProductsAmountCal(this,event); onkeypress='return isNumberKey(event,this);' onpaste='event.returnValue=false' ondrop='event.returnValue=false' maxlength='6' />";
    $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'> " + htmlvalue + "</div>");

    htmlvalue = "";
    var Privilege_Value = fnGetPrivilegeValue("ALLOW_POB_PRICE_EDIT", "");
    var DoctorEditPrivilegeArr = Privilege_Value.split(',');
    var Privilege_Value = fnGetPrivilegeValue("ALLOW_POB_PRICE_EDIT", "");
    var DoctorEditPrivilegeArr = Privilege_Value.split(',');
    if (DoctorEditPrivilegeArr.length > 0) {
        var disjson = $.grep(DoctorEditPrivilegeArr, function (ele, index) {
            return ele == "DOCTOR";
        })
        //for (var i = 0; i < DoctorEditPrivilegeArr.length; i++) {

        if (disjson.length > 0) {
            // Privilege_Value = "DOCTOR";

            htmlvalue = "<input style='width: 80%;' class='textalignRight' type='text' id='txt_SUnit_" + mainID + "_" + rowId + "' onkeyup=fnSalesProductsAmount(this,event); onkeypress='return isNumberKey(event,this);' enabled/>";
            $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'>" + htmlvalue + "</div>");
        }
        else {
            htmlvalue = "<input style='width: 80%;cursor: not-allowed;' class='textalignRight' type='text' id='txt_SUnit_" + mainID + "_" + rowId + "' disabled/>";
            $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'>" + htmlvalue + "</div>");
        }
    }

    htmlvalue = "";
    htmlvalue = "<input style='width: 80%;cursor: not-allowed;' class='textalignRight' type='text' id='txt_SAmount_" + mainID + "_" + rowId + "' disabled/>";
    $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div style='width:15%;' class='left'>" + htmlvalue + "</div>");

    // Remove Icon.
    htmlvalue = "";
    htmlvalue = '<img  onclick=fnDeleteSalesProduct("' + +mainID.toString() + "_" + rowId.toString() + '") class="valign-top deleteRowIcon" src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer"  />';
    $("#proDiv_" + mainID.toString() + "_" + rowId.toString()).append("<div style='width: 5%; margin-top: 5px; float: left;'> " + htmlvalue + "</div>");

    autoComplete(SalesProductsAutoFill_g, "txt_SSalesProducts", "hdnSSales_Products", "autoSSalesProducts");

    if (curAccObj != null) {
        curAccObj.onkeyup = null;
        curAccObj.ondblclick = null;
    }


}


// Creates the Product Row. A row contains 4 cells.
// ProductName, Qty, Detailed and RemoveIcon.
function fnAddProductRow(isDraft, curProdObject) {
    debugger;
    // Increment the row Index. Retrieve the row length and insert a new row.
    productRowIndex_g++;

    var tblProductRowLength = $('#tbl_Produts tr').length;
    var newProductRow = document.getElementById('tbl_Produts').insertRow(parseInt(tblProductRowLength));
    newProductRow.id = "ProdRow" + productRowIndex_g;

    // Product Name.
    var td0 = newProductRow.insertCell(0);

    var htmlvalue = "";
    if (isDraft) {
        htmlvalue = "<input type='text' id='txtProd_" + productRowIndex_g + "' class='autoProduct txtproduct setfocus' maxlength='299'  onblur='fnDCRProductBlur(" + productRowIndex_g + ")'  /><input type='hidden' id='hdnProd_" + productRowIndex_g + "'  />";
    }
    else {
        htmlvalue = "<input type='text' id='txtProd_" + productRowIndex_g + "' ondblclick='fnAddProductRow(null,this)'  onkeyup='fnAddProductRow(null,this)' maxlength='299' ";
        htmlvalue += "class='autoProduct txtproduct setfocus'  onblur='fnDCRProductBlur(" + productRowIndex_g + ")'  /><input type='hidden' id='hdnProd_" + productRowIndex_g + "' />";
    }


    $(td0).html(htmlvalue);
    $(td0).addClass("txtproduct");


    var td1 = newProductRow.insertCell(1);
    $(td1).append("<select onchange='fnSampleQtyChange(" + productRowIndex_g + ");' style='width:120px;' id='selBatch_" + productRowIndex_g + "' > </select>")

    $(td1).addClass("selBatch");

    // Product Qty.
    var td2 = newProductRow.insertCell(2);
    var qtydefault = input_qty_default_g == "NO" ? "" : "0";
    $(td2).html("<input type='text' align='center' maxlength='3' onchange='fnSampleQtyChange(" + productRowIndex_g + ")' id='txtProdQty_" + productRowIndex_g + "' class='checkinteger' value='" + qtydefault + "' />")
    $(td2).addClass("txtqty");
    $(td2).attr('align', 'center');

    // Detailed Check box.
    var td3 = newProductRow.insertCell(3);
    if ($('#hdnsoe').val().toUpperCase() != "TABLET") {
        $(td3).html("<input type='checkbox' id='chkProdDetail" + productRowIndex_g + "'  />");
        //$('#hdr_detailed').css('display', '');
        $("#chkProdDetail" + productRowIndex_g).css('display', '');
    }
    else {
        $(td3).html("<input type='checkbox' id='chkProdDetail" + productRowIndex_g + "' style='display:none' />");
        //$('#hdr_detailed').css('display', 'none');
        $("#chkProdDetail" + productRowIndex_g).css('display', 'none');
        //$('#hdr_detailed').css('display', 'none');
    }
    $(td3).append("<input type='hidden' id='hdnBatches_" + productRowIndex_g + "' /> ")
    $(td3).addClass('txtqty');
    $(td3).attr('align', 'left');
    $(td3).css('display', 'none');

    // Remove icon.
    var td4 = newProductRow.insertCell(3);
    $(td4).html("<img id='prodRemove" + productRowIndex_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick='fnDeleteProductRow(" + productRowIndex_g + ")' />");
    if (curProdObject != null) {
        curProdObject.onkeyup = null;
        curProdObject.ondblclick = null;
    }
    if (productAutoFill_g != null && productAutoFill_g.length > 0) {
        autoComplete(productAutoFill_g, "txtProd_", "hdnProd_", "autoProduct");
    }
    $(".setfocus").click(function () {
        $(this).select();
    });
    $(".checkinteger").blur(function () {
        $(this).blur(function () {
            fnChekInteger(this)
        });
    });

}

function fnDCRProductBlur(index) {
    debugger;
    var text = $("#txtProd_" + index).val();
    var arr = $.grep(productAutoFill_g, function (ele) {
        return ele.label == text;
    });

    if (arr.length <= 0) {
        //fnValidateAutofill(this, productAutoFill_g, "txtProd_" + index, "hdnProd_" + index);
        $("#hdnProd_" + index).val("");
    }
    else {
        $("#hdnProd_" + index).val(arr[0].Product_Code);
    }
    fnSampleProductChange(index)
}

function fnSampleProductChange(index) {
    debugger;
    if ($("#hdnProd_" + index.toString()).val().trim() != "") {
        var productCode = $("#hdnProd_" + index.toString()).val().trim().split("_")[0];
        var Batches = "";
        Batches = fnGetProductBatch(productCode, 'D', $('#hdnDoctorVisitCode').val());
        if (Batches.length > 0) {
            var strhtml = "";
            for (var i = 0; i < Batches.length; i++) {
                strhtml += "<option value='" + Batches[i].Batch_Number + "'>" + Batches[i].Batch_Number + "</option>";
            }
            $("#selBatch_" + index.toString()).html(strhtml);
            $("#selBatch_" + index.toString()).val($("#hdnProd_" + index).val());
            $("#hdnBatches_" + index.toString()).val(JSON.stringify(Batches));
        }
        else {
            $("#selBatch_" + index.toString()).html("<option value=''>-No Batch Found-</option>");
            $("#hdnBatches_" + index.toString()).val("");
            $("#txtProdQty_" + index).val('0');
        }
    }
    else {
        $("#selBatch_" + index.toString()).html("<option value=''>-No Batch Found-</option>");
        $("#hdnBatches_" + index.toString()).val("");
        $("#txtProdQty_" + index).val('0');
    }
}

function fnSampleQtyChange(index) {
    if ($("#hdnBatches_" + index).val().trim().length > 0) {
        var batches = eval($("#hdnBatches_" + index).val());
        var stock = 0;
        if (batches.length > 0) {
            var res = $.grep(batches, function (ele) {
                return ele.Batch_Number == $("#selBatch_" + index.toString() + " option:selected").val();
            });
            if (res.length > 0)
                stock = res[0].Current_Stock;
        }
        if (parseInt($("#txtProdQty_" + index.toString()).val()) > stock) {
            fnMsgAlert('info', 'error', 'Quantity exceeds the available stock for this batch.');
            $("#txtProdQty_" + index.toString()).val(stock);
        }
    }
}

function fnGetspecialty() {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Master/ProductMaster/GetAllSpeciality',
        type: "GET",
        // data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            spclresp = response;
            fnBindspl();

        }
    });

}
function fnBindspl() {
    //var speciallist=''
    var content = '';
    //  spclresp = JSON.parse(spclresp);
    //categoryresp = categoryresp.Tables[0].Rows;
    if (typeof spclresp === 'string')
        spclresp = JSON.parse(spclresp);
    var special = spclresp.Tables[0].Rows;
    var content = '';
    content += '<option value="0" disabled selected hidden>Select Speciality</option>';
    for (var i = 0; i < special.length; i++) {
        content += '<option  style="width:20%;"  value=' + special[i].Speciality_Code + '|' + special[i].Speciality_Name + '>' + special[i].Speciality_Name + '</option>';

    }
    $('#spcl_' + addnewcomp + '').html(content);
}

function fnchk(value) {
    var specialityCode = '';
    var specialityname = '';
    // var s='';
    var sp = value;
    specialityCode = sp.split('|')[0];
    specialityname = sp.split('|')[1];

}
function fnGetcategory(val) {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Master/ProductMaster/GetAllCategory',
        type: "GET",
        // data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            categoryresp = response;
            fnBindcategory();
        }
    });

}
function fnBindcategory() {
    //var speciallist=''
    var content = '';
    if (typeof categoryresp === 'string')
        categoryresp = JSON.parse(categoryresp);
    var category = categoryresp.Tables[0].Rows;

    //  categoryresp = JSON.parse(categoryresp);
    //categoryresp = categoryresp.Tables[0].Rows;
    var content = '';
    content += '<option value="0" disabled selected hidden>Select Category</option>';
    for (var i = 0; i < category.length; i++) {
        content += '<option  value=' + category[i].Category_Code + '|' + category[i].Category_Name + '>' + category[i].Category_Name + '</option>';

    }
    $('#category_' + addnewcomp + '').html(content);
}

function fnchkcat(value) {
    var categoryCode = '';
    var categoryname = '';
    // var s='';
    var categoryval = value;
    categoryCode = categoryval.split('|')[0];
    categoryname = categoryval.split('|')[1];

}
function fngetbrand() {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Master/ProductMaster/GetAllBrand',
        type: "GET",
        // data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            brandresp = response;
            fnBindbrand();
        }
    });

}
function fnBindbrand() {
    //var speciallist=''
    var content = '';
    if (typeof brandresp === 'string')
        brandresp = JSON.parse(brandresp);
    var brand = brandresp.Tables[0].Rows;

    // brandresp = JSON.parse(brandresp);
    //brandresp = brandresp.Tables[0].Rows;
    var content = '';
    content += '<option value="0" disabled selected hidden>Select Brand</option>';
    for (var i = 0; i < brand.length; i++) {
        content += '<option  value=' + brand[i].Brand_Code + '|' + brand[i].Brand_Name + '>' + brand[i].Brand_Name + '</option>';

    }
    $('#brand_' + addnewcomp + '').html(content);
}

function fnchkbrand(value) {
    var barndCode = '';
    var brandname = '';
    // var s='';
    var brandval = value;
    barndCode = brandval.split('|')[0];
    brandname = brandval.split('|')[1];

}
function fngetuom() {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Master/ProductMaster/GetAllUOM',
        type: "GET",
        // data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            uomresp = response;
            fnBindUOM();
        }
    });

}
function fnBindUOM() {
    //var speciallist=''
    var content = '';
    if (typeof uomresp === 'string')
        uomresp = JSON.parse(uomresp);
    var uom = uomresp.Tables[0].Rows;
    //  uomresp = JSON.parse(uomresp);
    //uomresp = uomresp.Tables[0].Rows;
    var content = '';
    content += '<option value="0" disabled selected hidden>Select UOM</option>';
    for (var i = 0; i < uom.length; i++) {
        content += '<option  value=' + uom[i].UOM_Code + '|' + uom[i].UOM_Name + '>' + uom[i].UOM_Name + '</option>';

    }
    $('#uom_' + addnewcomp + '').html(content);
}

function fnchkuom(value) {
    var uomCode = '';
    var uomname = '';
    // var s='';
    var uomval = value;
    uomCode = uomval.split('|')[0];
    uomname = uomval.split('|')[1];

}
function fngetuomtype() {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Master/ProductMaster/GetAllUOMType',
        type: "GET",
        // data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            uomtyperesp = response;
            fnBindUOMType();
        }
    });

}
function fnBindUOMType() {
    //var speciallist=''
    var content = '';
    if (typeof uomtyperesp === 'string')
        uomtyperesp = JSON.parse(uomtyperesp);
    var uomtype = uomtyperesp.Tables[0].Rows;
    //uomtyperesp = JSON.parse(uomtyperesp);
    //uomtyperesp = uomtyperesp.Tables[0].Rows;
    var content = '';
    content += '<option value="0" disabled selected hidden>Select UOM Type</option>';
    for (var i = 0; i < uomtype.length; i++) {
        content += '<option  value=' + uomtype[i].UOM_Type_Code + '|' + uomtype[i].UOM_Type_Name + '>' + uomtype[i].UOM_Type_Name + '</option>';

    }
    $('#uomtype_' + addnewcomp + '').html(content);
}

function fnchkuomtype(value) {
    // var s='';
    var uomtypeCode = '';
    var uomtypename = '';
    var uomtypeval = value;
    uomtypeCode = uomtypeval.split('|')[0];
    uomtypename = uomtypeval.split('|')[1];

}
function fngetproductname() {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Activity/DCRV4DoctorVisit/Getproductnames',
        type: "GET",
        //data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            Productresp = response;

        }
    });

}
var ProdList = '';
var masterProList = '';
function fnBindProductName(id) {
    //var speciallist=''
    var content = '';
    var comp_code = $("#hdn_comp" + id).val();
    var sampleProd = "[";
    var samp_master = "[";
    for (var i = 0; i < Productresp.length; i++) {
        samp_master += "{label:" + '"' + "" + Productresp[i].Product_Name + "" + '",' + "value:" + '"' + "" + Productresp[i].Product_Code + "" + '"' + "}";
        if (comp_code == Productresp[i].Competitor_Code) {
            sampleProd += "{label:" + '"' + "" + Productresp[i].Product_Name + "" + '",' + "value:" + '"' + "" + Productresp[i].Product_Code + "" + '"' + "}";

            if (i < Productresp.length - 1) {
                sampleProd += ",";

            }

        }
        if (i < Productresp.length - 1) {
            samp_master += ",";
        }
    }
    sampleProd += "];";
    samp_master += "];";
    ProdList = eval(sampleProd);
    masterProList = eval(samp_master);
    autoComplete(ProdList, "selprod_", "hdn_prod", 'autoprod_' + id);
}
function fnchkproduct(id) {
    var content = '';
    var ProductName = $("#txtprod_" + id).val();
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Activity/DCRV4DoctorVisit/Getchkprod',
        type: "GET",
        data: "ProductName=" + $("#txtprod_" + id).val(),
        success: function (response) {
            if ($("#txtprod_" + id).val() != '') {


                if (response == 0) {
                    fnMsgAlert('info', '', 'Product Name already exists.');
                    $("#txtprod_" + id).val('');
                }
            }
        }
    });
}

function fnchkcompetitor(id) {
    var content = '';
    //$("#dvAjaxLoad").show();

    $.ajax({
        url: 'HiDoctor_Activity/DCRV4DoctorVisit/GetchkComp',
        type: "GET",
        data: "CompetitorName=" + $("#txtcomp_" + id).val(),
        success: function (response) {
            if ($("#txtcomp_" + id).val() != '') {
                if (response == 0) {
                    fnMsgAlert('info', '', 'Competitor Name already exists.');
                    $("#txtcomp_" + id).val('');
                }
            }
        }
    });
}
function fngetcompetitorname() {
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: 'HiDoctor_Master/ProductMaster/GetAllCompetitoractive',
        type: "GET",
        //data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            Competitorresp = response;
            fnBindCompetitorName();
        }
    });

}
var CompList = '';
function fnBindCompetitorName(val) {
    //var speciallist=''
    var content = '';
    var sampleComp = "[";
    if (typeof Competitorresp === 'string')
        Competitorresp = JSON.parse(Competitorresp);
    var Compresponse = Competitorresp.Tables[0].Rows;

    //Competitorresp = JSON.parse(Competitorresp);
    //Competitorresp = Competitorresp.Tables[0].Rows;
    for (var i = 0; i < Compresponse.length; i++) {
        sampleComp += "{label:" + '"' + "" + Compresponse[i].Competitor_Name + "" + '",' + "value:" + '"' + "" + Compresponse[i].Competitor_Code + "" + '"' + "}";
        if (i < Compresponse.length - 1) {
            sampleComp += ",";
        }
    }

    sampleComp += "];";
    CompList = eval(sampleComp);

}

function fnUpdateProdAndComList() {
    fnBindProductName();
    fnBindCompetitorName();
}
function fnaddcomp(val) {
    $("#txtcomp_" + val).show();
    $("#selcomp_" + val).hide();
    $("#pluscomp_" + val).hide();
    $("#txtprod_" + val).show();
    $("#selprod_" + val).hide();
    $("#plusprod_" + val).hide();
    $("#additionalinfo_" + val).show();
    $("#additionalinfocol_" + val).show();
    $("#hdn_comp" + val).val('');
    $("#hdn_prod" + val).val('');
    $("#selcomp_" + val).val('');
    $("#selprod_" + val).val('');
}
function fnaddprod(val) {
    $("#txtprod_" + val).show();
    $("#selprod_" + val).hide();
    $("#plusprod_" + val).hide();
    $("#additionalinfo_" + val).show();
    $("#additionalinfocol_" + val).show();
    $("#selprod_" + val).val('');
    $("#hdn_prod" + val).val('');
}
function fnadd() {
    $("#addnew").hide();
    fnaddcompetitor();
}
function fnviewcompetitor() {
    $("[name='divcontent']").show();
}
function fndeletecomp(id) {
    $("#divHeader_" + id).hide();
    $("#divContent_" + id).hide();
}

function fnToggle(divId) {
    $("[name='divcontent']").each(function () {
        var id = this.id;
        if (divId != id)
            $(this).css("display", "none");
    });
    var currentState = $("#" + divId).css("display");
    if (currentState == "grid") {
        $("#" + divId).slideUp();
        // $("#" + iconId).html("<i class='fa fa-plus' aria-hidden='true'></i>");
    }
    else {
        $("#" + divId).slideDown();
        $("#" + divId).css("display", "grid");
        //$("#" + iconId).html('<i class="fa fa-minus" aria-hidden="true"></i>');
    }
}
var divarray = [];
function fnget(id) {
    for (var i = 1; i < id; i++) {
        $("#selcomp_" + id).html(prefilldata[i].Competitor_Name);
        $("#selprod_" + id).html(prefilldata[i].Product_Name);
        $("#value" + id).html(prefilldata[i].Remarks);
        $("#probability" + id).html(prefilldata[i].Value);
        $("#Remarks" + id).html(prefilldata[i].Probability);

    }
}
function fnClearcomp(id) {
    // var g = 1;
    for (var i = 1; i < id; i++) {
        $("#selcomp_" + i).val('');
        $("#selprod_" + i).val('');
        $("#value" + i).val('');
        $("#probability" + i).val('');
        $("#Remarks" + i).val('');

    }
}
function AddBtn(id) {
    var content = "";
    $("#addnew").html('');
    content += '<div id="divCompetitor">';
    //content += fnAddComp()

    content += '</div>'
    content += '<div class="col-lg-12" id="addnewone">';
    content += '</div>';
    content += ' <div class="col-lg-12">';
    //content += ' <button class="btn btn-primary"  onclick="fnaddcompetitor();return false;" id="addnewone" style="margin-left:15px;margin-top:40px;" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Add New</button>';
    content += '<button class="btn btn-primary" type="button" onclick="fnaddcompetitorproduct();" id="addnewone" style="margin-left:15px;margin-top:40px;">Add New</button>';
    content += '<button class="btn btn-primary" type="button" onclick="fnsavecompetitor(' + id + ');" style="float:right;margin-right:39px;margin-top:45px;" id="compsave">Save</button>';
    content += '</div>';
    $("#addnew").append(content);

}
function fnaddcompetitor(id, resetglobalcount, compProductName) {
    // $.blockUI();
    addnewcomp = 0;
    AddBtn(id);

    if ($("#hdnCompetitordetails_" + id).val().trim().length > 0) {
        var single_com = eval($("#hdnCompetitordetails_" + id).val());
        if (single_com.length == 0) {
            fnaddcompetitorproduct();
        }
        for (var z = 0; z < single_com.length; z++) {
            fnaddcompetitorproduct();

            if (single_com[z].Product_Code == '' && single_com[z].Competitor_Code == '') {
                $("#plusprod_" + (z + 1)).hide();
                $("#pluscomp_" + (z + 1)).hide();
                $("#selcomp_" + (z + 1)).hide();
                $("#selprod_" + (z + 1)).hide();
                $("#txtcomp_" + (z + 1)).show();
                $("#txtprod_" + (z + 1)).show();
                $("#additionalinfo_" + (z + 1)).show();
                $("#additionalinfocol_" + (z + 1)).show();
                $("#txtcomp_" + (z + 1)).val(single_com[z].Competitor_Name);
                $("#txtprod_" + (z + 1)).val(single_com[z].Product_Name);
                if (single_com[z].Speciality_Code != null && single_com[z].Speciality_Code != 0) {
                    //fnBindspl();
                    var value = single_com[z].Speciality_Code + "|" + single_com[z].Speciality_Name;
                    $("#spcl_" + (z + 1)).val(value);
                }
                else {
                    $("#spcl_" + (z + 1)).val(0);
                }

                $//("#spcl_" + (z + 1)).val(single_com[z].Speciality_Name);
                $("#category_" + (z + 1)).val(single_com[z].Category_Name);
                $("#brand_" + (z + 1)).val(single_com[z].Brand_Name);
                $("#uom_" + (z + 1)).val(single_com[z].UOM_Name);
                $("#uomtype_" + (z + 1)).val(single_com[z].UOM_Type_Name);
                $("#value" + (z + 1)).val(single_com[z].Value);
                $("#probability" + (z + 1)).val(single_com[z].Probability);
                $("#Remarks" + (z + 1)).text(single_com[z].Remarks);
            }
            else if (single_com[z].Product_Code == '' && single_com[z].Competitor_Code != '') {
                $("#plusprod_" + (z + 1)).hide();
                $("#hdn_comp" + (z + 1)).val(single_com[z].Competitor_Code);
                $("#selprod_" + (z + 1)).hide();
                $("#txtprod_" + (z + 1)).show();
                $("#selcomp_" + (z + 1)).val(single_com[z].Competitor_Name);
                $("#txtprod_" + (z + 1)).val(single_com[z].Product_Name);
                if (single_com[z].Speciality_Code != null && single_com[z].Speciality_Code != 0) {
                    //fnBindspl();
                    var value = single_com[z].Speciality_Code + "|" + single_com[z].Speciality_Name;
                    $("#spcl_" + (z + 1)).val(value);
                }
                else {
                    $("#spcl_" + (z + 1)).val(0);
                }

                $//("#spcl_" + (z + 1)).val(single_com[z].Speciality_Name);
                $("#category_" + (z + 1)).val(single_com[z].Category_Name);
                $("#brand_" + (z + 1)).val(single_com[z].Brand_Name);
                $("#uom_" + (z + 1)).val(single_com[z].UOM_Name);
                $("#uomtype_" + (z + 1)).val(single_com[z].UOM_Type_Name);
                $("#value" + (z + 1)).val(single_com[z].Value);
                $("#probability" + (z + 1)).val(single_com[z].Probability);
                $("#Remarks" + (z + 1)).text(single_com[z].Remarks);
            }
            else {
                $("#hdn_comp" + (z + 1)).val(single_com[z].Competitor_Code);
                $("#hdn_prod" + (z + 1)).val(single_com[z].Product_Code);
                $("#selcomp_" + (z + 1)).val(single_com[z].Competitor_Name);
                $("#selprod_" + (z + 1)).val(single_com[z].Product_Name);
                $("#value" + (z + 1)).val(single_com[z].Value);
                $("#probability" + (z + 1)).val(single_com[z].Probability);
                $("#Remarks" + (z + 1)).text(single_com[z].Remarks);

            }
            fnBindProductName((z + 1));
        }
    }
    else {
        fnaddcompetitorproduct();
    }

    // $("#addnew").html('');
    //Comptetitorcount_g=1;


    $("#myModalcompetitor1").overlay().load();
}
function masterdata() {
    fnGetspecialty();
    // fnBindspl();
    fngetcompetitorname();
    fngetproductname();
    fnGetcategory();
    fngetbrand();
    fngetuom();
    fngetuomtype();
}

function fnValidateCompetitorName(cur, id) {
    //fnValidateAutofill(cur, "selcomp_", "hdn_comp", 'autocomp');
    //autoComplete(CompList, "selcomp_", "hdn_comp", 'autocomp');

    fnValidateAutofill(cur, CompList, "selcomp_", "hdn_comp");
    fnBindProductName(id);
}
function fnValidateProductName(cur) {

    //fnValidateAutofill(cur, ProdList, "selprod_", "hdn_prod");
    fnValidateAutofill(cur, masterProList, "selprod_", "hdn_prod");

}
function fnaddcompetitorproduct() {
    addnewcomp = addnewcomp + 1;
    var content = "";
    content += ' <div class="col-lg-12"  name="divHeader" id="divHeader_' + addnewcomp + '" onclick="fnToggle(\'divContent_' + addnewcomp + '\')">';
    content += '<h4 style="background-color:grey;line-height: 3.25 !important;color:white;cursor:pointer;"> Competitor ' + addnewcomp + ' <h4>';
    content += ' </div>';

    content += ' <div class="col-lg-12"  name="divcontent" id="divContent_' + addnewcomp + '"><h5 style="color:red;cursor:pointer;width: 20px;" onclick="fndeletecomp(' + addnewcomp + ');">DELETE</h5>';
    //  content += '<div class="col-lg-12">';
    //content += '<h5 style="float:right;color:red;" onclick="fndelete(' + Comptetitorcount_g + ');">DELETE</h5>';
    // content += '</div>';
    content += '<div class="col-lg-12">';
    content += ' <label style="padding-left:1%;font-size:14px;">Competitor Name' + addnewcomp + '</label>';
    content += '<input type="text" style="display:none;" onblur="fnchkcompetitor(' + addnewcomp + ');" id="txtcomp_' + addnewcomp + '" />';
    content += ' <input type="text" id="selcomp_' + addnewcomp + '" class="input-xlarge form-control autocomp ac_input" autocomplete="off"  onblur="fnValidateCompetitorName(this,' + addnewcomp + ');"/><input type="hidden" id="hdn_comp' + addnewcomp + '" >';
    content += ' <i class="fa fa-plus" style="padding-left:12px;cursor:pointer;" title="Add Competitor" onclick="fnaddcomp(' + addnewcomp + ');" id="pluscomp_' + addnewcomp + '"></i>';


    content += ' <label style="font-size:14px;">Product Name' + addnewcomp + '</label>';
    content += '<input type="text" style="display:none;" onblur="fnchkproduct(' + addnewcomp + ');" id="txtprod_' + addnewcomp + '" />';
    content += '<input type="text" id="selprod_' + addnewcomp + '"  class="input-xlarge form-control autoprod_' + addnewcomp + ' ac_input" autocomplete="off"  onblur="fnValidateProductName(this);" /><input type="hidden" id="hdn_prod' + addnewcomp + '">';
    content += ' <i class="fa fa-plus" style="padding-left:12px;cursor:pointer;" title="Add Product" onclick="fnaddprod(' + addnewcomp + ');" id="plusprod_' + addnewcomp + '"></i>';
    content += ' </div>';

    content += ' <div class="col-lg-12" id="additionalinfo_' + addnewcomp + '" style="display:none;margin-top:38px;">';
    content += '<h3 style="text-align:center;">Additional Info</h3>';
    content += ' <label style="padding-left:2%;font-size:14px;">Speciality</label>';
    content += '<select id="spcl_' + addnewcomp + '" onchange="fnchk(this.value);"></select>';
    content += ' <label style="font-size:14px;padding-left:19%;">Category</label>';
    content += '<select  id="category_' + addnewcomp + '" onchange="fnchkcat(this.value);"></select>';
    content += '<div class="col-lg-12" style="margin-top:5%;" id="additionalinfobrand_' + addnewcomp + '">';
    content += '<label style="padding-left:2%;font-size:14px;">Brand</label>';
    content += '<select   style="margin-left:3%;"  id="brand_' + addnewcomp + '" onchange="fnchkbrand(this.value);"></select>';
    content += '<label style="padding-left:16%;font-size:14px;">UOM</label>';
    content += '<select   style="margin-left:3%;"  id="uom_' + addnewcomp + '" onchange="fnchkuom(this.value);"></select>';
    content += '</div>';
    content += '</div>';
    content += ' <div class="col-lg-12" id="additionalinfocol_' + addnewcomp + '" style="display:none;margin-top:38px;">';

    content += '<label style="padding-left:13px;font-size:14px;">UOM Type</label>';
    content += '<select   id="uomtype_' + addnewcomp + '" onchange="fnchkuomtype(this.value);"></select>';
    content += '</div>';
    content += '<div class="col-lg-12" style="margin-top:38px;">';
    content += ' <label style="padding-left:46px;font-size:14px;">Value</label>';
    content += '<input type="number" min="0" style="margin-left: 6%;" onpaste="return false;" onkeydown="return fnvalidatenumbervalue(this,event,' + addnewcomp + ');"id="value' + addnewcomp + '"/>';
    content += '<label style="padding-left:23px;font-size:14px;">Probability</label>';
    content += '<input type="text" min="0" style="margin-left: 2%;" onpaste="return false;" onkeydown="return fnvalidatenumber(this,event,' + addnewcomp + ');"  id="probability' + addnewcomp + '"/>';
    content += '</div>';
    content += ' <div class="col-lg-12" style="margin-top:38px;">';
    content += '<label style="padding-left:44px;font-size:14px;">Remarks</label>';
    content += '<textarea cols="500" style="width:65%;margin-left:4%;" id="Remarks' + addnewcomp + '"></textarea>';
    content += '</div>';
    content += '</div>';
    $("#addnewone").append(content);
    autoComplete(CompList, "selcomp_", "hdn_comp", 'autocomp');
    //fngetcompetitorname();
    //fngetproductname();
    fnBindspl();
    fnBindcategory();
    fnBindbrand();
    fnBindUOM();
    fnBindUOMType();
    //autoComplete(Productresp, "selprod_", "hdn_prod", 'autoprod');

}

function fnvalidatenumbervalue(id, evt, val) {
    var values = $("#value" + val).val();

    if (evt.keyCode == 8)
        return true;

    if ((evt.keyCode <= 105 && evt.keyCode >= 96) || (evt.keyCode <= 57 && evt.keyCode >= 48) || evt.keyCode == 190 || evt.keyCode == 110 || evt.keyCode == 46) {
        if ($("#value" + val).val().length >= 7) {
            fnMsgAlert('info', 'error', 'Max length exceeded for value');
            return false;
        }
    }
    else {
        return false;
    }


}
function fnvalidatenumber(id, evt, val) {
    var probablty = $("#probability" + val).val();

    if (evt.keyCode == 8)
        return true;

    if ((evt.keyCode <= 105 && evt.keyCode >= 96) || (evt.keyCode <= 57 && evt.keyCode >= 48) || evt.keyCode == 190 || evt.keyCode == 110 || evt.keyCode == 46) {
        if (probablty != "") {

            if (isNaN(parseFloat(probablty)) == false) {

                if (probablty.split(".").length - 1 == 1 && (evt.keyCode == 190 || evt.keyCode == 110))
                    return false;

                probablty = parseFloat(probablty);

                if ($("#probability" + val).val().length >= 7) {
                    fnMsgAlert('info', 'error', 'Max length exceeded for probability');
                    return false;
                }
                var probdec = $("#probability" + val).val().split('.');
                var p = probdec[1];
                var po = probdec[0];
                if (po.length >= 4) {
                    if (isNaN(parseInt(p)) == true) {
                        return true;
                    }
                    else if (p.length >= 2) {
                        fnMsgAlert('info', 'error', 'Cannot enter more than 2 values after decimal');
                        return false;
                    }
                }
                if (p.length >= 2) {
                    fnMsgAlert('info', 'error', 'Cannot enter more than 2 values after decimal');
                    return false;
                }
            }
            else if (evt.keyCode == 190 || evt.keyCode == 110)
                return false;
            else {
                return true;
            }
        }
        //}
    }
    else {
        return false;
    }
    return true;
}

var scomp = '';
function fnsavecompetitor(id) {
    var flagvalue = '';
    var compname = '';
    var prodname = '';
    var isValidCand = true;

    var proArray = new Array();


    var complength = $("#addnewone>div").length;
    var compval = complength / 2;

    for (var i = 1; i <= compval; i++) {
        if ($('#divHeader_' + i).css('display') != 'none') {
            var addCompProduct = [];
            var empty = false;
            if ($('#selcomp_' + i + '').val() == "" && $('#selprod_' + i + '').val() == "" && $('#txtcomp_' + i + '').val() == "" && $('#txtprod_' + i + '').val() == "") {
                empty = true
            }
            var probblty = $("#probability" + i).val();
            probblty = parseInt(probblty);
            if (probblty > 10000) {
                fnMsgAlert('info', 'error', 'Max length exceeded for probability');
                return false;
            }
            var values = $("#value" + i).val();
            values = parseInt(values);
            if (values > 9999999) {
                fnMsgAlert('info', 'error', 'Max length exceeded for value');
                return false;
            }
            if ($('#selcomp_' + i + '').val() != '' && $('#hdn_comp' + i + '').val() == '') {
                fnMsgAlert('info', '', 'Invalid Competitor Name');
                isValidCand = false;
                return false;
            }
            if ($('#selprod_' + i + '').val() != '' && $('#hdn_prod' + i + '').val() == '') {
                fnMsgAlert('info', '', 'Invalid Product Name');
                isValidCand = false;
                return false;
            }
            if (!empty) {
                var addcompetitor = {}
                if ($('#hdn_comp' + i + '').val() == "" && $('#hdn_prod' + i + '').val() == "" && $('#txtcomp_' + i + '').val() == "" && $('#txtprod_' + i + '').val() == "" || $('#hdn_comp' + i + '').val() == undefined && $('#hdn_prod' + i + '').val() == undefined) {
                    fnMsgAlert('info', '', 'Entered Competitor and Product details');

                    compname = $('#txtcomp_' + i + '').val();
                    if (compname.trim() == '') {
                        fnMsgAlert('info', 'error', 'Enter the Competitor Name');
                        isValidCand = false;
                        return false;
                    }
                    prodname = $('#txtprod_' + i + '').val();
                    if (prodname.trim() == '') {
                        fnMsgAlert('info', 'error', 'Enter the Product Name');
                        isValidCand = false;
                        return false;
                    }
                    flagvalue = 1;
                    //return false;

                }
                else if ($('#hdn_comp' + i + '').val() == "" && $('#hdn_prod' + i + '').val() == "" || $('#hdn_comp' + i + '').val() == undefined && $('#hdn_prod' + i + '').val() == undefined) {

                    compname = $('#txtcomp_' + i + '').val();
                    if (compname.trim() == '') {
                        fnMsgAlert('info', '', 'Enter the Competitor Name');
                        isValidCand = false;
                        return false;
                    }
                    prodname = $('#txtprod_' + i + '').val();
                    if (prodname.trim() == '') {
                        fnMsgAlert('info', '', 'Enter the Product Name');
                        isValidCand = false;
                        return false;
                    }
                    flagvalue = 1;

                }
                else if ($('#hdn_comp' + i + '').val() != "" && $('#hdn_prod' + i + '').val() == "") {
                    prodname = $('#txtprod_' + i + '').val();
                    if (prodname.trim() == '') {
                        fnMsgAlert('info', '', 'Enter the Product Name');
                        isValidCand = false;
                        return false;
                    }
                    compname = $('#selcomp_' + i + '').val();
                    flagvalue = 2;
                }
                else {

                    prodname = $('#selprod_' + i + '').val();
                    if (prodname.trim() == '') {
                        fnMsgAlert('info', '', 'Enter the Product Name');
                        isValidCand = false;
                        return false;
                    }
                    compname = $('#selcomp_' + i + '').val();
                    if (compname.trim() == '') {
                        fnMsgAlert('info', '', 'Enter the CompetitorName');
                        isValidCand = false;
                        return false;
                    }

                    flagvalue = 3;
                }
                var specialitydet = $("#spcl_" + i + " :selected").val();

                var competitordet = $("#category_" + i + " :selected").val();
                var branddet = $("#brand_" + i + " :selected").val();
                var uomdet = $("#uom_" + i + " :selected").val();
                var uomtypedet = $("#uomtype_" + i + " :selected").val();

                //if (specialitydet != undefined && competitordet != undefined && branddet != undefined && uomdet != undefined && uomtypedet != undefined && specialitydet != "0" && competitordet != "0" && branddet != "0" && uomdet != "0" && uomtypedet != "0") {
                if (flagvalue == 1 || flagvalue == 2) {
                    isValidCand = false;
                    isValidCand = fnCandidateValidation(i);
                    var spname = specialitydet.split('|')[1];
                    var spcode = specialitydet.split('|')[0];
                    var catname = competitordet.split('|')[1]
                    var catcode = competitordet.split('|')[0]
                    var braname = branddet.split('|')[1]
                    var brancode = branddet.split('|')[0]
                    var uoname = uomdet.split('|')[1]
                    var uocode = uomdet.split('|')[0]
                    var uomtname = uomtypedet.split('|')[1]
                    var uomtcode = uomtypedet.split('|')[0]
                }

                if (isValidCand == true) {
                    var addcompetitor = {

                        Sale_Product_Code: "",
                        DCR_Visit_Code: "",
                        // DCR_Code :"",
                        Doctor_Code: "",
                        Competitor_Code: $('#hdn_comp' + i + '').val(),
                        Competitor_Name: compname,
                        Product_Name: prodname,
                        Product_Code: $('#hdn_prod' + i + '').val(),
                        Value: $('#value' + i + '').val(),
                        Probability: $('#probability' + i + '').val() == "" ? 0 : $('#probability' + i + '').val(),
                        Remarks: $('#Remarks' + i + '').val(),
                        Speciality_Name: spname,
                        Speciality_Code: spcode,
                        Category_Name: catname,
                        Category_Code: catcode,
                        Brand_Name: braname,
                        Brand_Code: brancode,
                        UOM_Name: uoname,
                        UOM_Code: uocode,
                        UOM_Type_Name: uomtname,
                        UOM_Type_Code: uomtcode,
                        Product_Type_Name: "Competitor",
                        flag: flagvalue,
                        rowId: id

                    }

                }

                proArray.push(addcompetitor);
                console.log(proArray);
                console.log(i);
                prefilldata = addCompProduct;
            }
        }

        addcompetitor = "";
    }
    for (var first = 0; first < proArray.length; first++) {
        for (var second = (first + 1) ; second < proArray.length; second++) {
            if (proArray[first].Competitor_Code == proArray[second].Competitor_Code && proArray[first].Product_Code == proArray[second].Product_Code) {
                fnMsgAlert('info', '', 'Same Product and Competitor cannot be duplicated');
                isValidCand = false;
            }
        }
    }
    if (isValidCand == true) {

        var is_Master_Need = false;
        var is_pro_master_need = false;
        var new_pro = new Array();
        var data = eval($("#hdnCompetitordetails_" + id).val());
        for (var i = 0; i < proArray.length; i++) {
            if (proArray[i].flag == '1') {
                var com_id = fnsaveProdAndComp(proArray[i]);
                if (com_id != false && com_id.length > 0) {
                    com_id = com_id.split('^');
                    proArray[i].Competitor_Code = com_id[0];
                    proArray[i].Product_Code = com_id[1];
                    is_Master_Need = true;
                }

            } else if (proArray[i].flag == '2') {
                var com_id = fnsaveProdAndComp(proArray[i]).split('^');
                // proArray[i].Competitor_Code = id[0];
                proArray[i].Product_Code = com_id[1];
                is_pro_master_need = true;
            } else if (proArray[i].flag == '3') {

            }
            proArray[i].flag = '3';


        }
        $("#hdnCompetitordetails_" + id).val(JSON.stringify(proArray));
        prefilldata = addCompProduct;
        //if (prefilldata!='') {
        //    $("#myModalcompetitor1").hide();
        //}
        if (com_id == false) {

        }
        else {
            $("#myModalcompetitor1").overlay().close();
        }
        // $.unblockUI();
        if (is_Master_Need) {
            fngetcompetitorname();
            fngetproductname();
        } else if (is_pro_master_need) {
            fngetproductname();
        }
    }

}
function fnsaveProdAndComp(obj) {
    var code = false;
    //var controlvalidation = new Array();
    var validation = {
        Competitor_Code: obj.Competitor_Code,
        Competitor_Name: obj.Competitor_Name,
        Product_Name: obj.Product_Name,
        Speciality_Code: obj.Speciality_Code,
        Brand_Code: obj.Brand_Code,
        Category_Code: obj.Category_Code,
        UOM_Code: obj.UOM_Code,
        UOM_Type_Code: obj.UOM_Type_Code,
        Competitor_Code: obj.Competitor_Code
    }
    //controlvalidation.push(validation);
    $.ajax({
        type: 'POST',
        url: '../DCRV4DoctorVisit/SaveProductAndCompetitorDetails',
        data: JSON.stringify({
            'objComp': obj
        }),
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (response) {
            if (response != '') {
                code = response;

            }
            else {
                fnMsgAlert('info', '', 'error occured');
            }
        }
    });
    return code;
}
function fnCandidateValidation(id) {
    var validationflag = true;
    if ($("#spcl_" + id).val() == "0") {
        fnMsgAlert('info', '', 'Please enter Speciality for product ' + $("#txtprod_" + id).val());
        validationflag = false;
        return;
    }
    else if ($("#category_" + id).val() == "0") {
        fnMsgAlert('info', '', 'Please enter Category for product ' + $("#txtprod_" + id).val());
        validationflag = false;
        return;
    }
    else if ($("#brand_" + id).val() == "0") {
        fnMsgAlert('info', '', 'Please enter Brand for product ' + $("#txtprod_" + id).val());
        validationflag = false;
        return;
    }

    else if ($("#uom_" + id).val() == "0") {
        fnMsgAlert('info', '', 'Please enter UOM for product ' + $("#txtprod_" + id).val());
        validationflag = false;
        return;
    }
    else if ($("#uomtype_" + id).val() == "0") {
        fnMsgAlert('info', '', 'Please enter UOM Type for product ' + $("#txtprod_" + id).val());
        validationflag = false;
        return;
    }
    return validationflag;
}

function fnAddDetailedProductsRow(isDraft, curDetailedObj) {
    var content = '';
    var privilege = parseInt(fnGetPrivilegeValue("COLLECT_RETAIL_COMPETITOR_INFO", "0"));

    detailedRowIndex_g++;
    var tblDetailedProductsRowLength = $('#tbl_DetailedProducts tr').length;
    var newDetailedProductRow = document.getElementById('tbl_DetailedProducts').insertRow(parseInt(tblDetailedProductsRowLength));
    newDetailedProductRow.id = "DeatailedProdRow" + detailedRowIndex_g;

    var count = DoctorBusiness_g.length;
    var width = '90%';
    //if (count > 0)
    //   width = '50%';
    // Product Name.
    var td1 = newDetailedProductRow.insertCell(0);

    var htmlvalue = "";
    if (isDraft) {
        htmlvalue = "<div id='divDetailProd_" + detailedRowIndex_g + "' style='width: " + width + ";float: left;'><input style='width:90%;' type='text' id='txtproductDetailed_" + detailedRowIndex_g + "' class='autoDetailedProduct setfocus' maxlength='299'  onblur='fnValidateDetailedProd(this);' /><input type='hidden' class='hdnproddetail_" + detailedRowIndex_g + "' id='hdnproductDetailed_" + detailedRowIndex_g + "'  /><input type='hidden' id='hdnCompetitordetails_" + detailedRowIndex_g + "'  /></div>";
        //if (count > 0) {
        //prodcode = $("#hdnproductDetailed_" + detailedRowIndex_g).val();
        htmlvalue += "<div id='divBusineesStatus_" + detailedRowIndex_g + "' style='float: left;width: 47%;'><select style='width: 93%;' id='ddlBusineesStatus_" + detailedRowIndex_g + "' onChange='fnshowDetailProductRemark(" + detailedRowIndex_g + ");'></select><input type='hidden' id='hdnvalue_" + detailedRowIndex_g + "' value='0'/></div>";

        //htmlvalue += '<div title="click to remark"  style="float: left;cursor: pointer;"><img src="Content/images/Add.png"></div>';
        htmlvalue += "<div  style='float: left;width: 94%;padding: 5px;'  id='divProductRemark_" + detailedRowIndex_g + "' style='float: left;width: 100%;padding: 1%;'>";
        htmlvalue += "<div style='float: left;width: 35%;'><input type='text' id='txtBusinessPotential_" + detailedRowIndex_g + "' onkeypress='return isNumberKey(event,this);' onpaste='return false' maxlength='6' placeholder='Business Potential'/></div>";
        htmlvalue += "<div style='float: left;width: 64%;'><textarea id='txtDetailProductRemark_" + detailedRowIndex_g + "' placeholder='Enter remark' maxlength='100'></textarea></div>";
        if (privilege == 1)
            htmlvalue += "<a href='#' id='compadd" + detailedRowIndex_g + "'  onclick='fnaddcompetitor(" + detailedRowIndex_g + ",true,compProductName);'>Add Competitor</a></div>";
        // }
    }
    else {
        htmlvalue = "<div id='divDetailProd_" + detailedRowIndex_g + "' style='width: " + width + ";float: left;'><input style='width:90%;' type='text' id='txtproductDetailed_" + detailedRowIndex_g + "' ondblclick='fnAddDetailedProductsRow(null,this)'  onkeyup='fnAddDetailedProductsRow(null,this)' maxlength='299' ";
        htmlvalue += "class='autoDetailedProduct setfocus' style='display:none;'   onblur='fnValidateDetailedProd(this);' /><input type='hidden' class='hdnproddetail_" + detailedRowIndex_g + "' id='hdnproductDetailed_" + detailedRowIndex_g + "' /><input type='hidden' id='hdnCompetitordetails_" + detailedRowIndex_g + "'  /></div>";
        //prodcode = $("#hdnproductDetailed_" + detailedRowIndex_g).val();
        //if (count > 0) {
        htmlvalue += "<div id='divBusineesStatus_" + detailedRowIndex_g + "' style='float: left;width: 47%;'><select style='width: 93%;' id='ddlBusineesStatus_" + detailedRowIndex_g + "'  onChange='fnshowDetailProductRemark(" + detailedRowIndex_g + ");'></select><input type='hidden' id='hdnvalue_" + detailedRowIndex_g + "' value='0'/></div>";

        // htmlvalue += '<div title="click to remark" onclick="fnshowDetailProductRemark(' + detailedRowIndex_g + ');" style="float: left;cursor: pointer;"><img src="Content/images/Add.png"></div>';
        htmlvalue += "<div style='float: left;width: 91%;padding: 5px;'  id='divProductRemark_" + detailedRowIndex_g + "' style='float: left;width: 100%;padding: 1%;'>";
        htmlvalue += "<div style='float: left;width: 35%;'><input type='text' id='txtBusinessPotential_" + detailedRowIndex_g + "' onkeypress='return isNumberKey(event,this);' onpaste='return false' maxlength='6' placeholder='Business Potential' /></div>";
        htmlvalue += "<div style='float: left;width: 64%;'><textarea id='txtDetailProductRemark_" + detailedRowIndex_g + "'  placeholder='Enter remark' maxlength='100'></textarea></div>";
        if (privilege == 1)
            htmlvalue += "<a href='#' id='compadd" + detailedRowIndex_g + "'  style='display:none;' onclick='fnaddcompetitor(" + detailedRowIndex_g + ",true,compProductName);'>Add Competitor</a></div>";
        // }
    }
    $(td1).css('width', '95%');
    $(td1).css('textAlign', 'left');
    $(td1).html(htmlvalue);

    var td2 = newDetailedProductRow.insertCell(1);
    htmlvalue = "<input type='hidden' id='hdnDetEntryMode_" + detailedRowIndex_g + "'>";
    $(td2).css('textAlign', 'left');
    $(td2).html(htmlvalue)

    var td3 = newDetailedProductRow.insertCell(2);
    $(td3).html("&nbsp;")

    // Remove icon.
    var td4 = newDetailedProductRow.insertCell(3);
    $(td4).addClass('deleteRowIcon')
    $(td4).html("<img id='DetailedprodRemove" + detailedRowIndex_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick='fnDeleteDetailedProductRow(" + detailedRowIndex_g + ")' />");
    if (curDetailedObj != null) {
        curDetailedObj.onkeyup = null;
        curDetailedObj.ondblclick = null;
    }
    if (detailedProductsAutoFill_g != null && detailedProductsAutoFill_g.length > 0) {
        autoComplete(detailedProductsAutoFill_g, "txtproductDetailed_", "hdnproductDetailed_", "autoDetailedProduct");

    }
    //
    var ddlCount = 0;
    var opt = "<option value='0'>-select-</option>";
    for (var i = 0; i < DoctorBusiness_g.length; i++) {
        if (DoctorBusiness_g[i].Status == "1") {
            ddlCount++;
            opt += "<option value='" + DoctorBusiness_g[i].Business_Status_ID + "'>" + DoctorBusiness_g[i].Status_Name + "</option>";
        }
    }
    $("#ddlBusineesStatus_" + detailedRowIndex_g).html(opt);
    if (ddlCount > 0) {

        $("#divDetailProd_" + detailedRowIndex_g).css("width", "50%");
        $("#divBusineesStatus_" + detailedRowIndex_g).show();
        // $("#addcompetitor").show();
        $("#divBusinessHeader").show();
    }
    else {
        $("#divDetailProd_" + detailedRowIndex_g).css("width", "90%");
        $("#divBusineesStatus_" + detailedRowIndex_g).hide();
        if ($("#divBusinessHeader").css("display") != 'block')
            $("#divBusinessHeader").hide();
    }
    $(".setfocus").click(function () { $(this).select(); });
}

function fnshowDetailProductRemark(index) {
    if ($("#ddlBusineesStatus_" + index).val() != '0') {
        //$("#divProductRemark_" + index).show();
    } else {
        //$("#txtDetailProductRemark_" + index).val('');
        //$("#divProductRemark_" + index).hide();
    }
}
// Creates the Chemist Row. A row contains 3 cells.
// ChmeistName, POB and RemoveIcon.
function fnAddChemistRow(isDraft, curChemObject) {
    debugger;
    // Increment the row Index. Retrieve the row length and insert a new row.
    chemistRowIndex_g++;
    var tblChemistRowLength = $('#tbl_chemist tr').length;

    var newChemistRow = document.getElementById('tbl_chemist').insertRow(chemistRowIndex_g);
    newChemistRow.id = "chemRow" + chemistRowIndex_g;
    if (chemistRowIndex_g != 1)
        newChemistRow.style = "border-top: 1px solid rgb(0, 0, 0) !important;";
    // Chemist Name.
    var td1 = newChemistRow.insertCell(0);

    if (RCPA_g == "N") {
        if (isDraft) {
            $(td1).html("<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus'  maxlength='50' onblur='fnValidateAutofill(this," + 'chemistAutoFill_g' + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />");
        }
        else {
            //$(td1).html("<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' onkeyup='fnAddChemistRow(null,this)' ondblclick='fnAddChemistRow(null,this)'  maxlength='50' onblur='fnValidateAutofill(this," + 'chemistAutoFill_g' + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />");
            $(td1).html("<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus'  maxlength='50' onblur='fnValidateAutofill(this," + 'chemistAutoFill_g' + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />");
        }
    }
    else if (RCPA_g.toUpperCase() == "R" && $("#RcpaMandatory").prop("checked") == false) {
        if (isDraft) {
            var rcpaJSON = "";
            var htmlvalue = "<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:97%' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            htmlvalue += '<div id="divRCPA' + chemistRowIndex_g + '" style="background-color:#f7f7e7;width:99%;" >' + fnCreateRCPA(chemistRowIndex_g, rcpaJSON) + '</div>';
            $(td1).html(htmlvalue);
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }
        else {
            var rcpaJSON = "";
            //var htmlvalue = '<input type="text" id="txtChem_' + chemistRowIndex_g + '"  class="autoChemist txtchemisticon setfocus"  style="width:75%"  maxlength="50" onkeyup="fnAddChemistRow(null,this)" ondblclick="fnAddChemistRow(null,this)" onfocus="hideRCPA(\'' + chemistRowIndex_g + '\')" /><input type="hidden" id="hdnChem_' + chemistRowIndex_g + '" />';
            //var htmlvalue = '<input type="text" id="txtChem_' + chemistRowIndex_g + '"  class="autoChemist txtchemisticon setfocus"  style="width:75%"  maxlength="50"  onfocus="hideRCPA(\'' + chemistRowIndex_g + '\')" /><input type="hidden" id="hdnChem_' + chemistRowIndex_g + '" />';
            //var htmlvalue = "<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:97%' onkeyup='fnAddChemistRow(null,this)' ondblclick='fnAddChemistRow(null,this)' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            var htmlvalue = "<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:97%' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            htmlvalue += '<div id="divRCPA' + chemistRowIndex_g + '" style="background-color:#f7f7e7;width:95%;;" >' + fnCreateRCPA(chemistRowIndex_g, rcpaJSON) + '</div>';
            htmlvalue += '<div class="addNewBtnDoc"><input style="width: 23% !important;" type="button" onclick="fnAddChemistRow(null,this);" value="Add New RCPA"></div>';
            $(td1).html(htmlvalue + "</div>");
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }

    }
    else if (RCPA_g.toUpperCase() == "R" && $("#RcpaMandatory").prop("checked") == true) {
        if (isDraft) {
            var rcpaJSON = "";
            var htmlvalue = "<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:97%' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            //  htmlvalue += '<div id="divRCPA' + chemistRowIndex_g + '" style="background-color:#f7f7e7;width:99%;" >' + fnCreateRCPA(chemistRowIndex_g, rcpaJSON) + '</div>';
            $(td1).html(htmlvalue);
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }
        else {
            var rcpaJSON = "";
            //var htmlvalue = '<input type="text" id="txtChem_' + chemistRowIndex_g + '"  class="autoChemist txtchemisticon setfocus"  style="width:75%"  maxlength="50" onkeyup="fnAddChemistRow(null,this)" ondblclick="fnAddChemistRow(null,this)" onfocus="hideRCPA(\'' + chemistRowIndex_g + '\')" /><input type="hidden" id="hdnChem_' + chemistRowIndex_g + '" />';
            //var htmlvalue = '<input type="text" id="txtChem_' + chemistRowIndex_g + '"  class="autoChemist txtchemisticon setfocus"  style="width:75%"  maxlength="50"  onfocus="hideRCPA(\'' + chemistRowIndex_g + '\')" /><input type="hidden" id="hdnChem_' + chemistRowIndex_g + '" />';
            //var htmlvalue = "<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:97%' onkeyup='fnAddChemistRow(null,this)' ondblclick='fnAddChemistRow(null,this)' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            var htmlvalue = "<div style='float: left;margin-bottom: 7px; background-color: #e4ecf3; width: 124%;min-height: 25px;'> Name</div><div><input type='text' id='txtChem_" + chemistRowIndex_g + "'  class='autoChemist txtchemisticon setfocus' maxlength='50'  style='width:97%' onfocus='hideRCPA(\"" + chemistRowIndex_g + "\")' onblur='fnValidateAutofill(this," + chemistAutoFill_g + ",\"txtChem_\",\"hdnChem_\");' /><input type='hidden' id='hdnChem_" + chemistRowIndex_g + "' />";
            //    htmlvalue += '<div id="divRCPA' + chemistRowIndex_g + '" style="background-color:#f7f7e7;width:95%;;" >' + fnCreateRCPA(chemistRowIndex_g, rcpaJSON) + '</div>';
            htmlvalue += '<div class="addNewBtnDoc"><input style="width: 23% !important;" type="button" onclick="fnAddChemistRow(null,this);" value="Add New RCPA"></div>';
            $(td1).html(htmlvalue + "</div>");
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }
    }
    $(td1).addClass('txtchemist');

    // Chemist POB.
    var td2 = newChemistRow.insertCell(1);
    $(td2).html('<div style="margin-bottom: 10px;background-color: #e4ecf3;width: 100%;">POB</div><div><input type="text" id="txtChemPOB_' + chemistRowIndex_g + '" style="vertical-align:top;"  valign="top" onblur="return fnCurrencyFormatNew(this, \'POB\')" />');
    $(td2).addClass('txtpob');
    $(td2).attr('align', 'center');

    // Remove Icon.
    var td3 = newChemistRow.insertCell(2);
    $(td3).html('<div style="vertical-align: top;"></div><div><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="fnDeleteChemistRow(' + chemistRowIndex_g + ')" /></div>');
    $(td3).addClass('valign-top');
    $(td3).addClass('deleteRowIcon');
    if (curChemObject != null) {
        curChemObject.onkeyup = null;
        curChemObject.ondblclick = null;
        if (curChemObject.length == undefined)
            curChemObject.style.display = 'none';
    }
    if (chemistAutoFill_g != null) {
        autoComplete(chemistAutoFill_g, "txtChem_", "hdnChem_", "autoChemist");
    }

    $(".setfocus").click(function () {
        $(this).select();
    });

}

function fnCreateRCPA(chemistIndex, rcpaJSON) {
    var rcpaTableIndex = 1;
    var rcpatable = "";
    if (rcpaJSON != null && rcpaJSON.length > 0) {
        // TO DO: Create a RCPA table in Draft mode.

    }
    else {
        rcpatable = rcpaTableString_g.replace(/CHNUM/g, chemistIndex).replace(/RCPANUM/g, rcpaTableIndex);
        if (RCPAProductAutofill_g != null) {
            autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
        }
    }
    return rcpatable;
}

function fnAddSaleProductRow(salProdRow) {
    //tblchem_prod_CHNUM_RCPANUM
    var idArr = salProdRow.id.split('_');
    var chemistIndex = idArr[2];
    var rcpaIndex = idArr[3]
    var rcpaTable = rcpaTableString_g.replace(/CHNUM/g, chemistIndex).replace(/RCPANUM/g, ++rcpaIndex);
    var div1 = document.createElement('div');
    div1.innerHTML = rcpaTable;
    document.getElementById('divRCPA' + chemistIndex).appendChild(div1);
    if (salProdRow != null) {
        salProdRow.onkeyup = null;
        salProdRow.ondblclick = null;
    }
    autoComplete(RCPAProductAutofill_g, "txtchem_prod", "hdnchem_prod", "autoRCPA");
    $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });

}

function fnAddCompRow(ctl) {
    debugger;
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
    $(tdcomp3).html('<input type="text" id="' + newcompId + '" onkeyup="fnAddCompRow(this)" onblur="fnValidateComp(this)" class="checkspecialchar txtcomp newAddCompRow setfocus autoComp_' + compIdArr[3] + '_' + compIdArr[4] + '"  />');


    var tdcomp4 = newCompRow.insertCell(3);
    var newcompQtyId = compIdArr[0] + "_" + compIdArr[1] + "_" + compIdArr[2] + "Qty_" + compIdArr[3] + "_" + compIdArr[4] + "_" + compRow.toString();
    var hdnCompId = newcompId.replace('txt', 'hdn');
    $(tdcomp4).html('<input type="text" id="' + newcompQtyId + '" class="setfocus" style="width:25px !important; " /><input type="hidden" onblur="fnValidateComp(this)" id="' + hdnCompId + '"  />');

    if (!$("#" + newcompQtyId).hasClass("checkinteger")) {
        $("#" + newcompQtyId).addClass("checkinteger");
    }

    $("#" + newcompQtyId).keyup(function () {
        return fnIsNumber(event)
    });
    autoComplete(chemistAutoFill_g, "txtChem_", "hdnChem_", "autoChemist");
    var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "')]");
    var lst = $.grep(compAutoFill_g[0], function (v) {
        return v.Product_Code == $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() && v.Record_Status == 1;
    });
    autoComplete(lst, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + compIdArr[3] + '_' + compIdArr[4]);
    ctl.onkeyup = null;
    $(".checkspecialchar").blur(function () {
        fnCheckSpecialChar(this);
    });
    $(".checkinteger").blur(function () {
        $(this).blur(function () {
            fnChekInteger(this)
        });
    });
    $(".setfocus").click(function () {
        this.select;
    });


}

function fnshowRCPA(index) {
    document.getElementById("divRCPA" + index).style.display = '';
}

function hidePrev(ctl) {
    var pTbl = ctl.id.replace('txt', 'tbl');
    $('#' + pTbl + ' tr').fadeIn('fast');
    var pTbl = ctl.id.replace('txt', 'tbl');
    if (pTbl != "tblchem1_prod1") {
        pTbl = pTbl.substring(0, pTbl.length - 1) + (parseInt(pTbl.split('_')[1].replace('prod', '')) - 1).toString();
        $('#' + pTbl + ' tr:gt(1)').fadeOut('fast');
    }
}

function hideRCPA(index) {
    //for (var rIndex = 1; rIndex <= chemistRowIndex_g; rIndex++) {
    //    if (index != rIndex) {
    //        if ($('#divRCPA' + rIndex) != null) {
    //            $('#divRCPA' + rIndex).fadeOut("fast");
    //        }
    //    }
    //    else {
    //        if ($('#divRCPA' + rIndex) != null) {
    //            $('#divRCPA' + rIndex).fadeIn("fast");
    //        }
    //    }
    //}
}

function fnOnInit() {
    debugger;
    fnAddAccompanist(null);
    fnAddFollowUp(null);
    fnAddActivityRow(null);
    fnAddMCActivityRow(null);
    fnAddStockist(null);
    debugger;
    fnCreateDoctorList("");
    fnAddProductRow(null);
    fnAddDetailedProductsRow(null);
    fnAddChemistRow(null);
    if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
        fnSetServerTime();
    }
    HideModalPopup('dvLoading');
    GetAccompanistmandatoryvalue();
    $('#divPage').css('display', '');

}

function fnDeleteProductRow(index) {
    var rowLength = $('#tbl_Produts tr').length - 1;
    if (index == rowLength) {
        //$.msgbox("You are not allowed to delete this row!");
        fnMsgAlert('info', docSampleAlertTitle, 'You are not allowed to delete this row!');
        //alert("You didnt delete this row!");
    }
    else {
        if (confirm('Do you wish to delete the Sample/Promotional item?')) {
            $('#ProdRow' + index).css('display', 'none');
        }
    }
}


function fnDeleteDetailedProductRow(index) {
    var rowLength = $('#tbl_DetailedProducts tr').length - 1;
    if (index == rowLength) {
        //$.msgbox("You are not allowed to delete this row!");
        fnMsgAlert('info', docDetProdAlertTitle, 'You are not allowed to delete this row!');
        //alert("You didnt delete this row!");
    }
    else {
        if (confirm('Do you wish to delete the detailed product?')) {
            $('#DeatailedProdRow' + index).css('display', 'none');
        }
    }
}

function fnDeleteAccRow(index) {
    var rowLength = $('#tbl_DoctorAccDetails tr').length - 1;
    if (index == rowLength) {
        //$.msgbox("You are not allowed to delete this row!");
        fnMsgAlert('info', docAccAlertTitle, 'You are not allowed to delete this row!');
        //alert("You didnt delete this row!");
    }
    else {
        if (confirm('Do you wish to delete the Accompanist?')) {
            $('#AccRow_' + index).css('display', 'none');
        }
    }
}

function fnDeleteChemistRow(index) {
    if (index == $('.autoChemist').length) {
        //$.msgbox("You are not allowed to delete this row!");
        fnMsgAlert('info', docCheRCPAAlertTitle, 'You are not allowed to delete this row!');
        //alert("You didnt delete this row!");
    }
    else {
        if (confirm('Do you wish to delete the ' + chemistName + '?')) {
            $('#chemRow' + index).css('display', 'none');
            try {
                $('#chemRowRCPA' + (index + 1)).removeAttr('style');
            }
            catch (e) {
            }
        }
    }
}
function fnDeleteFollowUpRow(index) {
    var rowLength = $('#tbl_Followup tr').length - 1;
    if (index == rowLength) {
        //if ($('#tbl_Followup tr:visible').length == '') {
        fnMsgAlert('info', docFollowUps, 'You are not allowed to delete this row!');
    }
    else {
        if (confirm('Do you wish to delete the Follow-Ups?')) {
            $('#Follow_up_Row_' + index).css('display', 'none');
        }
    }
}
function fnDeleteStockist(index) {
    var tblLength = 0;
    tblLength = $('#tbl_POB tr').length;
    var count = 0;
    count = index + 2;
    if (tblLength == count) {
        fnMsgAlert('info', 'POB', 'You are not allowed to delete this row!');
    }
    else {
        if (confirm('Do you wish to delete the POB?')) {
            //header
            $('#POB_Row_' + (index - 1)).css('display', 'none');
            $('#POB_Row_' + index).css('display', 'none');
            //product
            $('#POB_Row_' + (index + 1)).css('display', 'none');
            $('#POB_Row_' + (index + 2)).css('display', 'none');
            try {
                $('#POB_Row_' + (index + 3)).removeAttr('style');
            }
            catch (e) {
            }
        }
    }
}
function fnDeleteSalesProduct(index) {
    var id = index.split('_');
    var count = 0;
    var tblLength = $('#tblSalesProduct_' + id[0]).children().length;
    //tblLength--;
    //for (var i = 0; i < tblLength; i++) {
    //    if ($("#proDiv_" + id[0] + "_" + i).css('display') != 'none')
    //        count++;
    //}
    //if (count >= 2) {
    count = parseInt(id[1]) + 2;
    if (count == tblLength) {
        fnMsgAlert('info', dcoSalesProductsTitle, 'You are not allowed to delete this row!');
    }
    else {
        if (confirm('Do you wish to delete the POB?')) {
            //header
            $('#proDiv_' + id[0] + "_" + id[1]).css('display', 'none');
            var obj = Array();
            obj.id = '_empty_' + index;
            fnSalesProductsTotalAmountCal(obj);
        }

    }
}


function fnDeleteGridRow(dvCode, id) {
    debugger;
    if (dvCode != null && dvCode != "") {
        if (confirm('Do you wish to delete the ' + DoctorHeader_g + ' and related details?')) {
            ShowModalPopup('dvLoading');

            // HD Error Audit Log.
            try {


                var objDeleteData = {};
                objDeleteData.doctor_Visit_Code = dvCode;
                objDeleteData.DCR_Actual_Date = dcrActualDate_g;
                objDeleteData.flag = flag_g;

                var objdata = {
                    PartitionKey: "HiDoctor",
                    Type: "DCRLog",
                    CompanyCode: CompanyCode,
                    UserCode: UserCode,
                    RegionCode: RegionCode,
                    ActionDateTime: new Date().toLocaleString(),
                    ModuleName: "DCR",
                    SubModuleName: "Doctor Visit Details",
                    ActionTaken: "Delete Doctor Visit Details",
                    ErrorCode: "",
                    ErrorMessage: "",
                    Data: "POST DATA",
                    Json: JSON.stringify(objDeleteData),
                    SourceOfEntry: "WEB",
                    VersionName: "14.4.3",
                    VersionCode: "14.4.3"
                };
                var context = ["api", "HDLogServices"];
                ErrorLogCoreRest.post(context, objdata, fnSucessCallBack, fnFailureCallback);
            }
            catch (ex) {

            }
            // End.

            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Activity/DCRV4DoctorVisit/DeleteDoctorVisitData',
                data: 'doctor_Visit_Code=' + dvCode + "&DCR_Actual_Date=" + dcrActualDate_g + "&flag=" + flag_g,
                success: function (response) {
                    try {
                        // we have the response
                        var result = response;
                        if ($.trim(result).toUpperCase() == "SUCCESS") {
                            fnGetUserProductsAndSetAutoFill();
                            fnGetDoctorVisitDetailsPerDay();
                            HideModalPopup('dvLoading');
                        }
                        else {
                            fnMsgAlert('error', screenTitle, result);
                            HideModalPopup('dvLoading');
                            return false;
                        }
                    }
                    catch (e) {
                        HideModalPopup('dvLoading');
                        alert(e.message);
                    }
                },
                error: function (e) {
                    //$.msgbox('Delete Transaction Failed.', { type: "error" });
                    fnMsgAlert('error', screenTitle, e.responseText);
                    HideModalPopup('dvLoading');
                    //alert("Page Error");
                }
            });
        }
    }
}

function sampleToolTip(sid) {
    $('#' + sid).tooltip({
        effect: 'slide'
    });
}

function fnDeleteRows() {
    debugger;
    productRowIndex_g = 0;
    chemistRowIndex_g = 0;
    detailedRowIndex_g = 0;
    doctorAccRowIndex_g = 0;
    FollowUpRowIndex_g = 0;

    $('#tbl_Produts').html('<tr><td class="dcr_product_header" style="text-align:left;">Input Name</td><td >Batch Number</td><td class="dcr_product_header txtqty" style="text-align:left;">Quantity</td><td  id="hdr_detailed" class="dcr_product_header txtqty" style="text-align:left;padding-left:23px;display:none"></td><td  class="dcr_product_header"></td></tr>');
    $("#tbl_chemist").html('<tr  style="display:none;"><td class="dcr_chemist_header" style="text-align:left;">Name</td><td class="dcr_chemist_header txtpob" style="text-align:left;padding-left:11px;">POB</td><td class="dcr_chemist_header"></td></tr>');
    var count = DoctorBusiness_g.length;
    if (count > 0)
        $("#tbl_DetailedProducts").html('<tr><td><div style="float: left;width: 50%;">Product Name</div><div style="display:none;" id="divBusinessHeader">Business Status</div></td><td>&nbsp;</td><td>&nbsp;</td><td class="deleteRowIcon">&nbsp</td></tr>');
    else
        $("#tbl_DetailedProducts").html('<tr><td>Product Name</td></tr>');
    $('#tbl_DoctorAccDetails').html('<tr><td>Accompanist Name</td><td style="text-align:center;display:none;">Independent Call</td><td>&nbsp;</td><td class="deleteRowIcon">&nbsp</td><td>Accompanied call?</td></tr>');
    $('#tbl_Followup').html('<tr><td class="dcr_product_header" style=""></td><td style="width: 57%;">Tasks</td><td class="dcr_product_header" style="text-align:left;padding-left:19px">Due Date</td><td style="width:4px;"></td></tr>');

    $('#tbl_POB').html('');
    $('#dZUpload').html('');
    $("#dZUpload").append("<div class='dz-default dz-message'><span>Drag and drop files to upload (*.png ,*.jpg,*.gif,*.bmp,*.pdf)</span></div> <div id='spFileUpload' style='display:none;' class='fileCont'><b>Uploading....<span id='spFileUploadCount'>(1/1)</span>files</b></div>");
    file_Com_count = 0;
    file_total_count = 0;
    //file_Max_Count = 5;
    //POB
    $("#tbl_POB").html('');
    POBRowIndex_g = 0;
    SalesProductTableIndex = 0;
    Doctor_Customer_LOB = "";
    SalesProductsAutoFill_g = [];
    // fnSetDoctorCoustomerLineofBusiness('');
    file_queue_count = 0;
    DoctorAttJSONArray = [];
    var myDropzone = Dropzone.forElement("#dZUpload");
    try {
        if (myDropzone.files.length > 0) {
            var file_length = myDropzone.files.length;
            for (var K = 0; K < file_length; K++) {
                try {
                    myDropzone.removeAllFiles(true);
                }
                catch (e) {
                }
            }
        }

    }
    catch (e) {
    }
    try {
        myDropzone.options.maxFiles = 5
    } catch (e) {
    }
    fnPerfillCallObjectiveAndBusinessStatus();
}

// Get DoctorVisitData.
function fnGetDoctorVisitData(calTime) {
    var month = dcrActualDate_g.split('-')[1];
    var year = dcrActualDate_g.split('-')[0];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/GetDoctorVisitData',
        data: "dcrActualDate=" + dcrActualDate_g + '&tpname=' + escape(queryString_g.split('&')[2]) + '&cpname=' + escape(queryString_g.split('&')[1]) + "&month=" + month + "&year=" + year,
        success: function (response) {
            // set the ViewBag.
            dcrDoctorVisit_g = response.Data;
            if (calTime != 1) {
                $('#tbl_doctorvisit_list').html("");
                gridRowNo_g = 0;
                if (RCPA_g.toUpperCase() == "R") {
                    if (dcrDoctorVisit_g.length == 5 && dcrDoctorVisit_g[4].Data != null && dcrDoctorVisit_g[4].Data.length > 0) {
                        compAutoFill_g = dcrDoctorVisit_g[4].Data
                    }
                }
                fnCreateDoctorList(dcrDoctorVisit_g);
            }
            else {
                fnOnInit();

            }
        },
        error: function (e) {
            //$.msgbox('Get Doctor Visit Data Failed.', { type: "error" });
            fnMsgAlert('info', screenTitle, 'Get ' + headerName + ' Visit Data Failed.');
            //alert("Page Error");
        }
    });
}

// Insert.
function fnInsertDoctorVisitData(isRedirecttoStockiest, rowpos) {
    debugger;
    if (GetAccompanistmandatoryCheck()) {
        if (file_Uploading_Status == "NO") {
            $('#buttondiv').css('display', 'none');
            fnBlockDiv('div_doctorvisit', 'Please wait, Saving Your DCR information....');
            //ShowModalPopup('dvLoading');
            if (!fnValidate(isRedirecttoStockiest, rowpos)) {
                $('#buttondiv').css('display', '');
                fnUnBlockDiv('div_doctorvisit');
            }
        }
        else {
            fnMsgAlert('info', "File Upload", 'Please wait.. file is uploading...');
        }
    }
}

// Validate.
function fnValidate(isRedirecttoStockiest, rowpos) {
    debugger;
    try {
        var dcr_visit_code = "";
        var doc_Name = "";
        var doc_code = "";
        var spec_name = "";
        var spec_code = "";
        var visit_mode = "";
        var visit_time = "";
        var remarks = "";
        var doc_pob = "0";
        var doc_string = "";
        var doc_category = "";
        var MDL_Number = "";
        var is_Acc_Doctor = 0;
        var Region_Code = "";
        var soe = "WEB";
        var lat = null;
        var long = null;
        var loc = null;
        var edt = null;
        var Category_Name = "";
        var Category_Code = "";
        var doctor = {};
        var doctorArray = new Array();
        // Doctor Name Required.
        if (!fnCheckIsNull($('#txtDocName'), '' + DoctorHeader_g + ' Name', docAlertTitle)) {
            return false;
        }

        // duplicate doctor
        var doc_count = 0;
        var tempdvCode = "";
        for (var rowIndex = 0; rowIndex < $('#tbl_doctorvisit_list tr').length; rowIndex++) {
            var rowNum = rowIndex + 1;
            if ($.trim($('#txtDocName').val()) == $.trim($('#spnDocName_' + rowNum).html())) {
                doc_count++;
                if ($('#hdnDoctorVisitCode').val().length > 0) {
                    tempdvCode = $('#spnDVCode_' + rowNum).html();
                }
            }
        }

        var rowNum = $('#hdnbindRowNumber').val();
        var record_status = $('#hdnRecord_Status').val()
        if ($('#hdnDoctorVisitCode').val().length > 0) {
            if (tempdvCode == $('#hdnDoctorVisitCode').val()) {
                if (doc_count > 1) {
                    //$.msgbox('This doctor already entered.');
                    fnMsgAlert('info', docAlertTitle, 'This ' + DoctorHeader_g + ' already entered.');
                    //alert("This doctor already entered.");
                    return false;
                }
            }
            else {
                if (doc_count == 1) {
                    fnMsgAlert('info', docAlertTitle, 'This ' + DoctorHeader_g + ' already entered.');
                    return false;
                }
            }
        }
        else if ($('#hdnIsCPDoc').val() == 1 && doc_count > 1) {
            fnMsgAlert('info', docAlertTitle, 'This ' + DoctorHeader_g + ' already entered.');
            return false;
        }
        else if ($('#hdnIsCPDoc').val() != 1 && doc_count == 1) {
            fnMsgAlert('info', docAlertTitle, 'This ' + DoctorHeader_g + ' already entered.');
            return false;
        }
        debugger;
        //check Business Status and Call Objective privilege
        var businessPrivilege = new Array();
        var callPrivilege = new Array();
        var businessStatusPrivilege = fnGetPrivilegeValue("DCR_BUSINESS_STATUS_MANDATORY_FOR", " ");
        var callObjectivePrivilege = fnGetPrivilegeValue("DCR_CALL_OBJECTIVE_MANDATORY_FOR", " ");

        businessPrivilege = businessStatusPrivilege.split(',');
        callPrivilege = callObjectivePrivilege.split(',');

        var doctorBusinessCount = $.grep(DoctorBusinessList_g, function (v) {
            return v.Status == '1'
        })

        var callObjectiveCount = $.grep(CallObjective_g, function (v) {
            return v.Status == '1'
        })

        if (flag_g == "F") {
            if (doctorBusinessCount.length > 0) {
                if ($.inArray("FIELD", businessPrivilege) > -1) {
                    if ($("#ddlDBStatus").val() == '0') {
                        fnMsgAlert('info', 'Info', "Please select Business Status");
                        return false;
                    }
                }
            }
            if (callObjectiveCount.length > 0) {
                if ($.inArray("FIELD", callPrivilege) > -1) {
                    if ($("#ddlcallObjetive").val() == '0') {
                        fnMsgAlert('info', 'Info', "Please select Call Objective");
                        return false;
                    }
                }
            }
        }

        if (flag_g == "A") {
            if (doctorBusinessCount.length > 0) {
                if ($.inArray("ATTENDANCE", businessPrivilege) > -1) {
                    if ($("#ddlDBStatus").val() == '0') {
                        fnMsgAlert('info', 'Info', "Please select Business Status");
                        return false;
                    }
                }
            }
            if (callObjectiveCount.length > 0) {
                if ($.inArray("ATTENDANCE", callPrivilege) > -1) {
                    if ($("#ddlcallObjetive").val() == '0') {
                        fnMsgAlert('info', 'Info', "Please select Call Objective");
                        return false;
                    }
                }
            }
        }

        // Check Doctor Entry Mode.
        // doctor name and speciality name.
        var docPrivilege = fnGetPrivilegeValue("RIGID_ATTENDANCE_DOCTOR_ENTRY", "YES");
        spec_code = $('#hdnspecname').val();
        if ((doctorEntryMode_g.toUpperCase() == 'YES' && flag_g == 'F') || (docPrivilege.toUpperCase() == 'YES' && flag_g == 'A')) {
            if ($.trim($('#hdnDocName').val()).length == 0) {
                fnMsgAlert('info', docAlertTitle, 'Invalid ' + DoctorHeader_g + ' Name.');
                return false;
            }
            else {
                var docvalidJSON = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + $('#hdnDocName').val() + "')]");//& @.label=='" + $('#txtDocName').val().trim() + "'
                if (!docvalidJSON) {
                    fnMsgAlert('info', docAlertTitle, 'Invalid ' + DoctorHeader_g + ' Name.');
                    return false;
                }
            }
            doc_code = $('#hdnDocName').val();
            var doc_json = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + $('#txtDocName').val().trim() + "')]");
            if (doc_json && doc_json.length > 0) {
                doc_category = doc_json[0].Category_Code;
                is_Acc_Doctor = doc_json[0].Is_Acc_Doctor;
                Region_Code = doc_json[0].Doctor_Region_Code;
                MDL_Number = doc_json[0].MDL_Number;
                Category_Name = doc_json[0].Category;
                Category_Code = doc_json[0].Category_Code;
                // Json
            }
            doc_Name = $.trim($('#txtDocName').val()).split('_')[0];
            spec_name = $.trim($('#txtDocName').val()).split('_')[2];
        }
        else {
            if ($.trim($('#hdnDocName').val()).length == 0) {
                if ($.trim($('#txtDocName').val().length > 0)) {
                    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroupFlexi($('#txtDocName'))) {
                        fnMsgAlert('info', docAlertTitle, "Dear User, <br/>Please remove the special character in the " + DoctorHeader_g + " name.<br/> The following characters are only allowed <b>.-|</b>.");
                        return false;
                    }
                }

                if (!fnCheckIsNull($('#txtDocSpeciality'), 'Speciality Name', docAlertTitle)) {
                    return false;
                }
                else {
                    if ($.trim($('#hdnspecname').val()).length == 0) {
                        //$.msgbox($('#hdnspecname').val() + 'is invalid Speciality Name.');
                        fnMsgAlert('info', docAlertTitle, $('#hdnspecname').val() + 'is invalid Speciality Name.');
                        // alert("Invalid Speciality Name.");
                        return false;
                    }
                    spec_code = $('#hdnspecname').val();
                    doc_Name = $.trim($('#txtDocName').val());
                    spec_name = $.trim($('#txtDocSpeciality').val());
                }
            }
            else {
                //doc_code = $('#hdnDocName').val();
                doc_Name = $.trim($('#txtDocName').val()).split('_')[0];
                spec_name = $.trim($('#txtDocName').val()).split('_')[2];
                var doc_json = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + $('#txtDocName').val().trim() + "')]");
                if (doc_json && doc_json.length > 0) {
                    doc_category = doc_json[0].Category_Code;
                    is_Acc_Doctor = doc_json[0].Is_Acc_Doctor;
                    Region_Code = doc_json[0].Doctor_Region_Code;
                    doc_code = doc_json[0].value;
                    MDL_Number = doc_json[0].MDL_Number;
                    Category_Name = doc_json[0].Category;
                    Category_Code = doc_json[0].Category_Code;
                    $('#hdnDocName').val(doc_code);
                }
                else {
                    fnMsgAlert('info', docAlertTitle, 'Invalid ' + DoctorHeader_g + ' Name.');
                    return false;
                }
            }
        }

        // Visit Time or Visit Mode.
        if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME") {
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                visit_time = $('#lbltimepicker').html().split(' ')[0];
                visit_mode = $('#lbltimepicker').html().split(' ')[1];
            }
            else {
                if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY" && !fnCheckIsNull($('#timepicker'), 'Visit Time', docAlertTitle)) {
                    return false;
                }

                if (fnChekTimeformat('timepicker')) {
                    if ($('#timepicker').val().length > 0) {
                        visit_time = $('#timepicker').val().split(' ')[0];
                        visit_mode = $('#timepicker').val().split(' ')[1];
                    }
                    else {
                        visit_mode = "AM";
                    }
                }
                else {
                    //$.msgbox('Please enter valid Time format.');
                    fnMsgAlert('info', docAlertTitle, 'Please enter valid Time format.');
                    //alert("Please enter valid Time format.");
                    return false;
                }
            }
        }
        else {
            if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
                visit_mode = $('#lblvisitmode').html();
                visit_time = $('#lbltimepicker').html();
            }
            else {
                if ($('#rdam').attr('checked') == 'checked') {
                    visit_mode = "AM";
                }
                else {
                    visit_mode = "PM";
                }
            }
        }

        // POB.
        if (doctorPOBAmount_g.toUpperCase() == "YES") {
            if ($.trim($('#txtDocPOB').val()).length != 0) {
                if (fnCurrencyFormatNew($('#txtDocPOB'), "POB")) {
                    //doc_pob = Math.round($('#txtDocPOB').val());
                    doc_pob = $('#txtDocPOB').val();
                }
                else {
                    return false;
                }
            }
            else {
                doc_pob = "0.00";
            }
        }

        // Is CP Doctor.
        var isCpDoc = $('#hdnIsCPDoc').val();

        var dcr_visit_code = $('#hdnDoctorVisitCode').val()
        // remarks
        $('#txtDocRemarks').val($.trim($('#txtDocRemarks').val()));
        var remarks = $('#txtDocRemarks').val();

        ////var result = fnCheckRemarksSpecialChar('#txtDocRemarks');
        //if (!(fnCheckRemarksSpecialChar("#txtDocRemarks"))) {
        //    return false;
        //}
        // $("#txtDocRemarks").val($.trim($("#txtDocRemarks").val().replace(/\'/g, ' ')));
        var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtDocRemarks"));
        if (!res) {
            fnMsgAlert("info", docAlertTitle, "Please remove the special characters in Remarks. <br/>The following charactres are only allowed <b>[ -_.,()@ ]</b>.");
            return false;
        }

        if ($.trim($('#txtDocRemarks').val()).length > 500) {
            //alert("You have entered more than 500 chars in Remarks. which is not allowed.");
            //$.msgbox('You have entered more than 500 chars in Remarks. which is not allowed.');
            fnMsgAlert('info', docAlertTitle, 'You have entered more than 500 chars in Remarks. which is not allowed.');
            return false;
        }

        lat = null;
        long = null;
        loc = null;
        soe = "";
        edt = null;
        if ($('#hdnsoe').val().toUpperCase() == "TABLET" || $('#hdnsoe').val().toUpperCase() == "OFFLINE") {
            soe = $('#hdnsoe').val().toUpperCase();
            lat = $('#hdnlat').val();
            long = $('#hdnlon').val();
            loc = encodeURIComponent($('#hdnloc').val());
            edt = $('#hdnedt').val();
        }
        else {
            soe = "WEB"
        }

        var Sample;
        // Mandatory field not check if Is_Sample_Not_Mandatory checked
        if ($("#SampleMandatory").prop("checked") == true) {
            Sample = 1;
        }

        var DetailedMan;
        if ($("#DetailedMandatory").prop("checked") == true) {
            DetailedMan = 1;
        }

        var chemistMand;
        if ($("#chemistMandatory").prop("checked") == true) {
            chemistMand = 1;
        }

        var RcpaMand;
        if ($("#RcpaMandatory").prop("checked") == true) {
            RcpaMand = 1;
        }

        var pobMand;
        if ($("#POBMandatory").prop("checked") == true) {
            pobMand = 1;
        }
        // doctor string.

        doc_string = escape(doc_Name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time +
         "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + soe + "^" + doc_category + "^" + is_Acc_Doctor +
         "^" + Region_Code + "^";

        // JSON.
        debugger;
        var ddlcallObjetive = '0';
        var ddlMC = '0';
        ddlcallObjetive = $("#ddlcallObjetive").val();
        if (ddlcallObjetive == '0' || ddlcallObjetive == '')
            ddlcallObjetive = null;
        ddlMC = $('#ddlMC').val();
        var Campaigntype = $('#ddlMC :selected').text().split('-');
        if (ddlMC == '0' || ddlMC == '')
            ddlMC = null;
        doctor.Doctor_Visit_Code = dcr_visit_code;
        doctor.Doctor_Name = $.trim($('#txtDocName').val().split('_')[0]);
        doctor.label = $.trim($('#txtDocName').val());
        doctor.Doctor_Code = $.trim(doc_code) == "" ? null : doc_code;
        doctor.Speciality_Name = $.trim(spec_name) == "" ? null : spec_name;
        doctor.Speciality_Code = spec_code;
        doctor.Visit_Mode = $.trim(visit_mode) == "" ? "AM" : visit_mode;
        doctor.Doctor_Visit_Time = $.trim(visit_time) == "" ? null : visit_time;
        doctor.POB_Amount = $.trim(doc_pob) == "" ? null : doc_pob;
        doctor.Is_CPDoc = isCpDoc;
        doctor.Remarks = $.trim(escape(remarks)) == "" ? null : escape(remarks);
        doctor.Category = $.trim(doc_category) == "" ? null : doc_category;
        doctor.Is_Acc_Doctor = $.trim(is_Acc_Doctor) == "" ? null : is_Acc_Doctor;
        doctor.Doctor_Region_Code = $.trim(Region_Code) == "" ? null : Region_Code;
        doctor.Mode_Of_Entry = $('#hdnDoc_EntryMode').val();
        doctor.Record_Status = record_status;
        doctor.Source_of_Entry = soe;
        doctor.Location = encodeURIComponent(loc);
        doctor.Lattitude = lat;
        doctor.Longtitude = long;
        doctor.Entered_Date_Time = edt;
        doctor.Call_Objective_ID = ddlcallObjetive;
        doctor.Marketing_Campaign_ID = ddlMC;
        doctor.CampaignType = Campaigntype[1];
        doctor.MDL_Number = MDL_Number;
        doctor.Category_Name = Category_Name;
        doctor.Category_Code = Category_Code;
        doctor.Is_Sample_not_Mandatory = Sample;
        doctor.Detail_NotGiven_Check = DetailedMan;
        doctor.No_ChemistVisit_Check = chemistMand;
        doctor.Chemist_Visit_WithoutRCPA_Check = RcpaMand;
        doctor.Doctor_Visit_Without_POB = pobMand;
        doctorArray.push(doctor);

        // Acc String.
        var acc_Rows = $('#tbl_DoctorAccDetails tr');
        var acc_string = "";
        var acc_user_Name = "";
        var acc_user_Code = "";
        var acc_region_Code = "";
        var only_for_doc = "";
        var mode_of_entry = "";
        var acc_user_type = "";
        var accArray = new Array();
        var docAccArray = new Array();
        if (doc_Visit_Controls_g.indexOf(acc_privilege_name) >= 0) {
            for (var accrindex = 0; accrindex <= doctorAccRowIndex_g; accrindex++) {
                var docAcc = {};
                var acc = "";
                if (accrindex == 0) {
                    continue;
                }
                // check the row is exist. if not continue the next row.
                if ($('#AccRow_' + accrindex).css('display') == 'none') {
                    continue;
                }
                if ($.trim($('#txtAccName_' + accrindex).val()).length > 0) {
                    var region_code = $('#hdnAccName_' + accrindex).val();
                    var accompaniedCall = $('input[name=Accompaniedcall_' + accrindex + ']:checked').val();
                    if (accompaniedCall != null && accompaniedCall != undefined && accompaniedCall != '') {
                        acc_user_Name = $('#txtAccName_' + accrindex).val();
                        var only_for_doc = $('#chkindependentcall_' + accrindex).attr('checked') == "checked" ? "Y" : "N";

                        if ($.trim(region_code).length == 0) {
                            fnMsgAlert('info', docAccAlertTitle, 'Invalid accompanist.');
                            return false;
                        }
                        if ($.inArray(acc_user_Name, accArray) > -1) {
                            fnMsgAlert('info', docAccAlertTitle, 'Accompanist name duplicate.');
                            return false;
                        }
                        accArray.push(acc_user_Name);

                        docAcc.Doctor_Visit_Code = dcr_visit_code;
                        docAcc.Acc_User_Name = acc_user_Name.split('(')[0].split(',')[1];
                        docAcc.Acc_User_Code = null;
                        docAcc.Acc_Region_Code = region_code;
                        docAcc.Is_Only_For_Doctor = $.trim(only_for_doc) == "" ? "0" : only_for_doc;
                        docAcc.Mode_Of_Entry = $('#hdnAccEntryMode_' + accrindex).val();
                        docAcc.Acc_User_Type_Name = acc_user_Name.split('(')[1].replace(')', '');
                        docAcc.Is_Accompanied_call = accompaniedCall;
                        docAccArray.push(docAcc);

                        acc = acc_user_Name + "^" + only_for_doc + "^" + region_code + "^";
                    }

                    acc_string += acc;
                }
            }
        }

        var Mode_Of_Form = $("input[name='Mode_Of_Form']:checked").val();
        //Mode of form 1-Phrma/ 2-OTC
        // Products.
        var prod_Rows = $('#tbl_Produts tr');
        var prodString = "";
        var prod_code = "";
        var prod_spec_code = "";
        var prod_name = "";
        var batch_Number = "";
        var prod_spec_code = "";
        var prod_qty = "";
        var product_count = 0;
        var prodArray = new Array();
        var prodValidation = [];
        var prodMaster = {
            Product_Code: "",
            Product_Name: "",
            Entered_Qty: 0,
            Min_Qty: 0,
            Max_Qty: 0
        }
        // looping the row collection.
        //if (Mode_Of_Form == '1') {
        if (doc_Visit_Controls_g.indexOf(sample_privilege_name) >= 0) {
            for (var prowIndex = 0; prowIndex < productRowIndex_g; prowIndex++) {
                prod_spec_code = "";
                prod_name = "";
                batch_Number = "";
                prod_code = "";
                prod_qty = "";
                var prod = {
                };

                if ($("#hdnBatches_" + (prowIndex + 1)).val().trim().length > 0) {
                    var batches = eval($("#hdnBatches_" + (prowIndex + 1)).val());
                    var stock = 0;
                    if (batches.length > 0) {
                        var res = $.grep(batches, function (ele) {
                            return ele.Batch_Number == $("#selBatch_" + (prowIndex + 1).toString() + " option:selected").val();
                        });
                        if (res.length > 0)
                            stock = res[0].Current_Stock;
                    }
                    if (parseInt($("#txtProdQty_" + (prowIndex + 1).toString()).val()) > stock) {
                        fnMsgAlert('info', 'error', 'Quantity exceeds the available stock for this batch.');
                        $("#txtProdQty_" + (prowIndex + 1).toString()).val(stock);
                        return false;
                    }
                }
                if (prowIndex == 0) {
                    continue;
                }

                // check the row is exist. if not continue the next row.
                if ($('#ProdRow' + prowIndex).css('display') == 'none') {
                    continue;
                }

                // Retrieves the row input collection.
                var inp_array = $('#ProdRow' + prowIndex + ' input'); //prod_Rows[prowIndex].getElementsByTagName('input');

                // Product Name and Product Code.
                if ($.trim($(inp_array[0]).val()).length != 0) {
                    if ($.trim($('#' + inp_array[1].id).val()).length == 0) {
                        //$.msgbox('The input ' + $(inp_array[0]).val() + ' is invalid.');
                        fnMsgAlert('info', docSampleAlertTitle, 'The Sample/Promotional item ' + $(inp_array[0]).val() + ' is invalid.');
                        //alert("The product " + $(inp_array[0]).val() + " is invalid.");
                        return false;
                    }
                    else {
                        prod_code = $(inp_array[1]).val().split('_')[0];
                        prod_spec_code = $(inp_array[1]).val().split('_')[1]
                        prod_name = $(inp_array[0]).val();
                        var index = inp_array[1].id.split("_")[1];
                        batch_Number = $("#selBatch_" + index + " option:selected").val() == undefined ? "" : $("#selBatch_" + index + " option:selected").val();
                    }

                    //*************
                    var prod_count = 0;
                    for (var i = 1; i < $('#tbl_Produts tr').length - 1; i++) {

                        if ($.trim($('#txtProd_' + i).val()).length != 0
                                && prod_name == $('#txtProd_' + i).val()
                                && batch_Number == ($("#selBatch_" + i + " option:selected").val() == undefined ? "" : $("#selBatch_" + i + " option:selected").val())
                            ) {
                            if ($('#ProdRow' + i).css('display') != 'none') {
                                prod_count++;
                                if (prod_count > 1) {
                                    //$.msgbox('The input ' + prod_name + ' already entered.');
                                    if (batch_Number != '')
                                        fnMsgAlert('error', docSampleAlertTitle, 'The Sample/Promotional item ' + prod_name + (($("#selBatch_" + i + " option:selected").val() != undefined) ? (' and batch ' + batch_Number) : "") + ' is already entered.');
                                    else
                                        fnMsgAlert('error', docSampleAlertTitle, 'The Sample/Promotional item ' + prod_name + ' already entered.');
                                    return false;
                                }
                            }
                        }
                    }

                    var qtydefault = input_qty_default_g == "NO" ? "" : "0";
                    // Product Qty.

                    // Product Qty.
                    if ($.trim($(inp_array[2]).val()).length != 0) {
                        if (!fnChekInteger(inp_array[2])) {
                            return false;
                        }
                        else {
                            prod_qty = $(inp_array[2]).val();
                        }
                    }
                    else {
                        if (qtydefault.length == 0) {
                            fnMsgAlert('info', docSampleAlertTitle, 'Please enter QTY for the Product ' + prod_name);
                            return false;
                        }
                        else {
                            prod_qty = 0;
                        }
                    }

                    //if (prod_qty == 0) {
                    //    fnMsgAlert('info', screenTitle, 'For Sample/Promotional items (' + prod_name+') given Qty must be greater than 0.');
                    //    return false;
                    //}
                    // isDetailed
                    debugger;
                    var isDetailed = $(inp_array[3]).attr('checked');
                    isDetailed = isDetailed ? '1' : '0';
                    product_count++;
                    prodString += escape(prod_name) + "^" + prod_code + "^" + prod_qty + "^" + isDetailed + "^" + doc_code + "^" + Region_Code + "^";

                    prod.DCR_Visit_Code = dcr_visit_code;
                    prod.Doctor_Code = $.trim(doc_code) == "" ? null : doc_code;
                    prod.Quantity_Provided = prod_qty;
                    prod.Product_Name = escape(prod_name);
                    prod.Product_Code = prod_code;
                    prod.Batch_Number = batch_Number;
                    prod.Speciality_Code = prod_spec_code;
                    prod.Is_Detailed = isDetailed == null ? "0" : isDetailed == "" ? "0" : isDetailed;
                    prod.Doctor_Region_Code = Region_Code;
                    Doctor_Name = doctor.Doctor_Name;

                    prodArray.push(prod);
                }
            }
        }

        for (var pI = 0; pI < prodArray.length; pI++) {
            var product = $.grep(prodValidation, function (ele) {
                return ele.Product_Code == prodArray[pI].Product_Code
            });
            if (product.length > 0) {
                $.grep(prodValidation, function (ele) {
                    if (ele.Product_Code == prodArray[pI].Product_Code)
                        ele.Entered_Qty = parseInt(ele.Entered_Qty) + parseInt(prodArray[pI].Quantity_Provided);
                });
            }
            else {
                //var temp = prodMaster;
                var temp = [];
                var minCount = 0;
                var maxCount = 0;
                var Current_Stock = 0;
                temp.Product_Code = prodArray[pI].Product_Code;
                temp.Product_Name = prodArray[pI].Product_Name;
                temp.Entered_Qty = parseInt(prodArray[pI].Quantity_Provided);
                $.grep(productAutoFill_g, function (ele) {
                    if (ele.Product_Code == prodArray[pI].Product_Code) {
                        minCount = ele.Min_Count;
                        maxCount = ele.Max_Count;
                        Current_Stock = parseInt(ele.Current_Stock);
                    }
                });
                if (isNaN(parseInt(minCount)) == false && parseInt(minCount) > 0)
                    temp.Min_Qty = parseInt(minCount);
                if (isNaN(parseInt(maxCount)) == false && parseInt(maxCount) > 0)
                    temp.Max_Qty = parseInt(maxCount);
                temp.Current_Stock = Current_Stock;
                prodValidation.push(temp);
            }
        }

        for (var pI = 0; pI < prodValidation.length; pI++) {
            var message = "";
            debugger;
            if (Sample != 1) {
                if (prodValidation[pI].Current_Stock > 0) {
                    if (prodValidation[pI].Min_Qty > 0 && prodValidation[pI].Entered_Qty < prodValidation[pI].Min_Qty) {
                        message = "You need to enter minimum of " + prodValidation[pI].Min_Qty.toString() + " for Sample/Promotional items " + unescape(prodValidation[pI].Product_Name) + ".";
                        fnMsgAlert('error', "DCR Sample Products", message);
                        return false;
                    }
                    else if (prodValidation[pI].Max_Qty > 0 && prodValidation[pI].Entered_Qty > prodValidation[pI].Max_Qty) {
                        message = "You can enter only maximum of " + prodValidation[pI].Max_Qty.toString() + " for Sample/Promotional items " + unescape(prodValidation[pI].Product_Name) + " .";
                        fnMsgAlert('error', "DCR Sample Products", message);
                        return false;
                    }
                }
            }
        }

        debugger;
        // if (Mode_Of_Form == '1') {
        if (Sample != '1' || Sample != 1) {
            if (doc_Visit_Controls_g.indexOf(sample_privilege_name) >= 0 && flag_g == 'F') {
                if (inputs_mandatory_number_g > 0) {
                    if (inputs_mandatory_number_g > product_count) {
                        //$.msgbox('You need to enter minimum of ' + inputs_mandatory_number_g + ' inputs.');
                        fnMsgAlert('info', docSampleAlertTitle, ' You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items.');
                        return false;
                    }
                }
            }
        }

        // Detailed Products.
        var detailed_Rows = $('#tbl_DetailedProducts tr');
        var detail_string = "";
        var det_prd_Name = "";
        var det_prd_Code = "";
        var det_mode_of_entry = "";
        var detprdArray = new Array();

        var detComArray = new Array();

        var detProdJsonArray = new Array();
        var CompProductJSONArray = new Array();
        //if (Mode_Of_Form == '1') {
        if (doc_Visit_Controls_g.indexOf(detailing_privilege_name) >= 0) {
            for (var detprindex = 0; detprindex < detailedRowIndex_g; detprindex++) {

                var detprdobj = {
                };
                var detprd = "";
                if (detprindex == 0) {
                    continue;
                }
                // check the row is exist. if not continue the next row.
                if ($('#DeatailedProdRow' + detprindex).css('display') == 'none') {
                    continue;
                }

                if ($.trim($('#txtproductDetailed_' + detprindex).val()).length > 0) {
                    det_prd_Name = $('#txtproductDetailed_' + detprindex).val();
                    det_prd_code = $('#hdnproductDetailed_' + detprindex).val();


                    if ($.trim(det_prd_code).length == 0) {
                        fnMsgAlert('info', docDetProdAlertTitle, 'Invalid Product Name in Detailed box.');
                        return false;
                    }
                    if ($.inArray(det_prd_Name, detprdArray) > -1) {
                        fnMsgAlert('info', docDetProdAlertTitle, 'Detailed Product Name is duplicate.');
                        return false;
                    }
                    detprdArray.push(det_prd_Name);

                    detprd = $.trim(det_prd_Name) + "^" + det_prd_code + "^";
                    detprdobj.Sale_Product_Code = det_prd_code;
                    detprdobj.Sale_Product_Name = det_prd_Name;
                    detprdobj.Mode_Of_Entry = $('#hdnDetEntryMode_' + detprindex).val();
                    if (DoctorBusiness_g.length > 0) {
                        var bId = $("#ddlBusineesStatus_" + detprindex).val();
                        if (bId != '' && bId != '0')

                            detprdobj.Business_Status_ID = bId;
                        else
                            detprdobj.Business_Status_ID = null;
                    }
                    if ($("#txtDetailProductRemark_" + detprindex).val() != '') {
                        var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtDetailProductRemark_" + detprindex));
                        if (!res) {
                            fnMsgAlert('info', 'Detail Product Remark', 'Please remove the special characters in Detail Product Remarks. <br/>The following charactres are only allowed <b>-_.,()@</b>.');
                            return false;
                        }
                        else {
                            detprdobj.Business_Status_Remarks = $("#txtDetailProductRemark_" + detprindex).val();
                        }
                    }
                    else {
                        detprdobj.Business_Status_Remarks = null;
                    }
                    if ($("#txtBusinessPotential_" + detprindex).val() != '' && parseInt($("#txtBusinessPotential_" + detprindex).val()) >= 0)
                        detprdobj.BusinessPotential = $("#txtBusinessPotential_" + detprindex).val();
                    else
                        detprdobj.BusinessPotential = null;


                    detProdJsonArray.push(detprdobj);
                }
                detail_string += detprd;
                //-----------------------------com---------

                // var complength = $("#divCompetitor div").length;
                //var compval = detailedRowIndex_g / 2;
            }
            for (var comp = 1; comp <= detailedRowIndex_g; comp++) {
                debugger;
                if ($("#hdnCompetitordetails_" + comp).val() != '') {
                    var addcompetitor = {
                    }
                    //hdncompdetails = $("#hdnCompetitordetails_" + comp).val();
                    var single_com = eval($("#hdnCompetitordetails_" + comp).val());
                    // single_com[comp].Sale_Product_Code = $('#hdnproductDetailed_' + comp).val();

                    for (var compdetails = 0; compdetails < single_com.length; compdetails++) {


                        var addcompetitor = {

                            Sale_Product_Code: $('#hdnproductDetailed_' + comp).val(),
                            DCR_Visit_Code: single_com[compdetails].DCR_Visit_Code,
                            // DCR_Code :single_com[0].,
                            Doctor_Code: single_com[compdetails].Doctor_Code,
                            Competitor_Code: single_com[compdetails].Competitor_Code == "" ? 0 : single_com[compdetails].Competitor_Code,
                            Competitor_Name: single_com[compdetails].Competitor_Name,
                            Product_Name: single_com[compdetails].Product_Name,
                            Product_Code: single_com[compdetails].Product_Code,
                            Value: single_com[compdetails].Value,
                            Probability: single_com[compdetails].Probability,
                            Remarks: single_com[compdetails].Remarks,
                            Speciality_Name: single_com[compdetails].Speciality_Name,
                            Speciality_Code: single_com[compdetails].Speciality_Code,
                            Category_Name: single_com[compdetails].Category_Name,
                            Category_Code: single_com[compdetails].Category_Code,
                            Brand_Name: single_com[compdetails].Brand_Name,
                            Brand_Code: single_com[compdetails].Brand_Code,
                            UOM_Name: single_com[compdetails].UOM_Name,
                            UOM_Code: single_com[compdetails].UOM_Code,
                            UOM_Type_Name: single_com[compdetails].UOM_Type_Name,
                            UOM_Type_Code: single_com[compdetails].UOM_Type_Code,
                            Product_Type_Name: single_com[compdetails].Product_Type_Name,
                            Flag: single_com[compdetails].flag,
                            rowId: comp

                        }

                        CompProductJSONArray.push(addcompetitor);
                    }
                }
            }
            hdncompdetails = CompProductJSONArray;
            addcompetitor = "";
            spc = $('#hdnproductDetailed_' + comp).val();
            //----------------------------------------

        }
        // if (Mode_Of_Form == '1') {
        if (DetailedMan != "1" || DetailedMan != 1) {
            if (doc_Visit_Controls_g.indexOf(detailing_privilege_name) >= 0) {
                var detailProdMandatory = fnGetPrivilegeValue('DCR_DETAILING_MANDATORY_NUMBER', '0');
                if (detProdJsonArray.length < parseInt(detailProdMandatory)) {
                    fnMsgAlert('info', docDetProdAlertTitle, 'You should enter at least ' + detailProdMandatory + ' detailing products for this ' + DoctorHeader_g + ' visit..');
                    return false;
                }
            }
        }

        // Chemist.
        var chem_Rows = $('#tbl_chemist tr');
        var chem_name = "";
        var chem_code = "";
        var chem_pob = "0";
        var chemistString = "";
        var rcpaString = "";
        var chem_count = 0;
        var is_Acc_Chemist = '0'
        var chemJsonArray = new Array();
        var rcpaJSONArray = new Array();
        //Check for Chemist vist
        if ((ChemistsPrivilege != ChemistsPrivilege_Value) && (doc_Visit_Controls_g.indexOf(chemist_privilege_name) >= 0)) {
            //if (Mode_Of_Form == '1') {
            for (var crowIndex = 0; crowIndex <= chemistRowIndex_g; crowIndex++) {
                var chemobj = {};
                // Skip the header row.
                if (crowIndex == 0) {
                    continue;
                }

                // check, the row is exist, if not continue the loop.
                if ($('#chemRow' + crowIndex).css('display') == 'none') {
                    continue;
                }

                // Retrieves the inputs collection.
                // We have chemist row id.
                var chemNum = crowIndex;
                var inp_array = $('#chemRow' + crowIndex + ' input');
                // Chemist Name and Chemist Code.
                if ($.trim($(inp_array[0]).val()).length != 0) {
                    chem_name = $(inp_array[0]).val();
                    chem_code = $('#hdnChem_' + crowIndex).val();

                    chem_pob = $('#txtChemPOB_' + crowIndex).val();

                    chem_count++;

                    //var specialCharregex = new RegExp("^[a-zA-Z0-9()._& ]+$");
                    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($(inp_array[0]))) {
                        //$.msgbox('Please remove the special characters for chemist.' + chem_name);
                        fnMsgAlert('info', docCheRCPAAlertTitle, 'Please remove the special characters for "' + chemistName +
                            " - " + chem_name + '". <br/> The following characters are only allowed -_.().');
                        fnErrorIndicator(inp_array[0]);
                        return false
                    }
                    else {
                        fnRemoveErrorIndicatior(inp_array[0]);
                    }
                    if (!fnCurrencyFormatNew($('#txtChemPOB_' + crowIndex), "Chemist POB")) {
                        return false;
                    }
                    if (!fnCurrencyFormatNew($('#txtChemPOB_' + crowIndex), "Chemist POB")) {
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
                        //chem_pob = Math.round(chem_pob).toString();
                        chem_pob = chem_pob;
                    }

                    var chemname_count = 0;
                    for (var i = 1; i < $('#tbl_chemist tr').length - 1; i++) {
                        if (chem_name == $('#txtChem_' + i).val() && $('#txtChem_' + i).val().length != 0) {
                            if ($('#chemRow' + i).css('display') != 'none') {
                                chemname_count++;
                                if (chemname_count > 1) {
                                    //$.msgbox('The chemist ' + chem_name + ' already entered.');
                                    fnMsgAlert('info', docCheRCPAAlertTitle, 'The ' + chemistName + ' - ' + chem_name + ' already entered.');
                                    //alert('The chemist ' + chem_name + ' already entered.');
                                    return false;
                                }
                            }
                        }
                    }

                    // Build the Chemist String.
                    chemistString += escape(chem_name) + "^" + chem_code + "^" + chem_pob + "^" + visit_mode + "^" + is_Acc_Chemist + "^";

                    chemobj.DCR_Visit_Code = dcr_visit_code;
                    chemobj.DCR_Chemists_Code = crowIndex;
                    chemobj.Chemist_Name = escape(chem_name);
                    chemobj.Chemist_Code = $.trim(chem_code) == "" ? null : chem_code;
                    chemobj.POB_Amount = $.trim(chem_pob) == "" ? null : chem_pob;
                    chemobj.Is_Acc_Chemist = $.trim(is_Acc_Chemist) == "" ? "0" : "1";
                    chemobj.Local_Ref_Code = crowIndex;
                    chemJsonArray.push(chemobj);
                }

                // Check the RCPA is R, Read the RCPA details.
                if ($.trim($(inp_array[0]).val()).length != 0) {
                    if (RCPA_g.toUpperCase() == "R") {
                        var rcpaobj = {
                        };
                        var rcpaResult = fnReadRcpaDetails(chemNum, chem_name, rcpaJSONArray, dcr_visit_code);
                        if (rcpaResult.toString().length > 0) {
                            if (rcpaResult == false) {
                                return false;
                            }
                            else {
                                rcpaString += rcpaResult;
                                //rcpaJSONArray.push(rcpaobj);
                            }
                        }

                    }
                }
            }
            //}
        }
        //Follow_up
        var fllow_Rows = $('#tbl_Followup tr').length;
        var Tasks = "";
        var Due_Date = "";

        var fllowJSONArray = new Array();
        if (doc_Visit_Controls_g.indexOf(followup_privilege_name) >= 0) {
            for (var i = 1; i < fllow_Rows; i++) {
                if ($('#Follow_up_Row_' + i).css('display') != 'none')
                    if ($('#txt_Follow_taskName_' + i).val().trim() != '') {
                        if ($('#txtdueDate_' + i).val().trim() != '') {

                            var Tasks = $('#txt_Follow_taskName_' + i).val().trim();
                            var fllowArray = {
                            };
                            fllowArray.Tasks = Tasks;
                            fllowArray.Due_Date = $.trim($('#txtdueDate_' + i).val().split('/')[2]) + "-" + $.trim($('#txtdueDate_' + i).val().split('/')[1]) + "-" + $.trim($('#txtdueDate_' + i).val().split('/')[0]);
                            if (!(fnValidateDateFormate(('#txtdueDate_' + i), 'Due Date'))) {
                                return false;
                            }
                            //date check
                            if (fllowArray.Due_Date < dcrActualDate_g) {
                                fnMsgAlert('info', 'Information', 'Follow-Ups - Due Date (' + $('#txtdueDate_' + i).val() + ') Should be greater than DCR date');
                                return false;
                            }
                            // remarks special char check.
                            var res = SpecialCharacterGroup("#txt_Follow_taskName_" + i);
                            if (!res) {
                                fnMsgAlert('info', 'Information', 'Please Enter the following characters only <b>[ ' + allowCharacterinRemarks + ' ]</b> in Follow-Ups - Tasks');
                                return false;
                            }
                            fllowJSONArray.push(fllowArray);

                        }
                        else {
                            fnMsgAlert('info', 'Information', 'Please Enter Follow-Ups Due Date');
                            return false;
                        }
                    }
            }
        }
        //if (Mode_Of_Form == '1' && ChemistsPrivilege != ChemistsPrivilege_Value) {
        if ((ChemistsPrivilege != ChemistsPrivilege_Value) && (doc_Visit_Controls_g.indexOf(chemist_privilege_name) >= 0)) {
            if ($("#chemistMandatory").prop("checked") == false) {
                if (chemists_mandatory_number_g > 0) {
                    if (chemists_mandatory_number_g > chem_count) {
                        // $.msgbox('You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
                        fnMsgAlert('info', docCheRCPAAlertTitle, 'You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
                        // alert("You should be entered the " + chemists_mandatory_number_g + ' chemists.');
                        return false;
                    }
                }
            }
        }

        //Activity

        var InsertActivityJSON = new Array();
        var InsertCMETracking = new Array();

        if (doc_Visit_Controls_g.indexOf(activity_privilege_name) >= 0) {

            for (var i = 1; i < $("#tbl_Activity tr").length - 1; i++) {
                var activity = {};
                var tracker = {};
                activity.Customer_Activity_ID = $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input:nth-child(2)').val();
                if (activity.Customer_Activity_ID != '') {
                    activity.Activity_Name = $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input').val();
                    //Inactive Status
                    var single_activity = $.grep(ActivityAutoFill_g, function (element, index) {
                        return element.value == activity.Customer_Activity_ID && element.Status == "1";
                    });
                    if (single_activity.length == 0) {
                        fnMsgAlert('info', docActivityTitle, 'Invalid Call Type - (' + activity.Activity_Name + ')');
                        return false;
                    }
                    //activity.Activity_Type = $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input:nth-child(3)').val();
                    activity.Activity_Type = 'A';
                    // if (activity.Activity_Type == 'A') {
                    activity.Activity_Remarks = $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(2)").find('textarea:nth-child(1)').val();
                    var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2("#txtRemark_" + i);
                    if (!res) {
                        fnMsgAlert("info", docAlertTitle, "Please remove the special characters in Call Activity Remarks. <br/>The following charactres are only allowed <b>[ -_.,()@ ]</b>.");
                        return false;
                    }
                    //}
                    //else {
                    //    activity.Activity_Remarks = $("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(2)").find('select:nth-child(1)').val();
                    //}
                    activity.Created_By = "ad";
                    for (var a = 0; a < InsertActivityJSON.length; a++) {
                        if (InsertActivityJSON[a].Customer_Activity_ID == activity.Customer_Activity_ID && InsertActivityJSON[a].Activity_Type == 'A') {
                            fnMsgAlert('info', 'Activity', 'Call Activity Name is duplicate');
                            return false;
                        }
                    }
                    InsertActivityJSON.push(activity);
                }
                else {
                    if ($("#tbl_Activity tr:nth-child(" + i + ") td:nth-child(1)").find('input').val().trim() != '') {
                        fnMsgAlert('info', docActivityTitle, 'Invalid Call Activity Name');
                        return false;
                    }
                }
            }


            for (var i = 0; i < $("#tbl_MC_Activity tbody tr.mcandcmeactivity").length - 1; i++) {
                var activity = {
                };

                if (i == 0) {

                    activity.Campaign_Code = $("#tbl_MC_Activity tr.mcandcmeactivity:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input:nth-child(2)').val();


                    if (activity.Campaign_Code != '' && activity.Campaign_Code != undefined) {
                        //Inactive Status
                        var single_mc = $.grep(MCDetails_g, function (element, index) {
                            return element.value == activity.Campaign_Code;
                        });
                        if (single_mc.length == 0) {
                            var mcName = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input:nth-child(1)').val();
                            if (flag_g == 'A') {
                                fnMsgAlert('info', docActivityTitle, 'Invalid MC/CME - (' + mcName + ')');
                            }
                            else {
                                fnMsgAlert('info', docActivityTitle, 'Invalid Marketing Campaign - (' + mcName + ')');
                            }

                            return false;
                        }
                        activity.Activity_Name = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input').val();
                        activity.Activity_Type = 'MC';
                        activity.MC_Activity_Id = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(2)").find('select:nth-child(1)').val();
                        if (activity.MC_Activity_Id == '' || activity.MC_Activity_Id == '0') {
                            var mcName = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input:nth-child(1)').val();
                            if (flag_g == 'A') {
                                fnMsgAlert('info', docActivityTitle, 'Please Select Activity for MC/CME - (' + mcName + ')');
                            }
                            else {
                                fnMsgAlert('info', docActivityTitle, 'Please Select Activity for Marketing Campaign - (' + mcName + ')');
                            }
                            return false;
                        }
                        activity.Created_By = "ad";
                        activity.Activity_Remarks = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(3)").find('textarea:nth-child(1)').val();
                        var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2($("#txtMCRemark_" + i));
                        if (!res) {
                            fnMsgAlert("info", docAlertTitle, "Please remove the special characters in Marketing Activity Remarks. <br/>The following charactres are only allowed <b>[ -_.,()@ ]</b>.");
                            return false;
                        }
                        //activity.Campaign_Type = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input').val().split('-')[1];
                        var str = single_mc[0].Campaign_Name
                        var indexValue = str.lastIndexOf('-')
                        var isCME = str.substring((parseInt(indexValue) + parseInt(1)), str.length)
                        activity.Campaign_Type = isCME;
                        for (var a = 0; a < InsertActivityJSON.length; a++) {
                            if (InsertActivityJSON[a].Campaign_Code == activity.Campaign_Code && InsertActivityJSON[a].MC_Activity_Id == activity.MC_Activity_Id && InsertActivityJSON[a].Activity_Type == 'MC') {
                                if (flag_g == 'A') {
                                    fnMsgAlert('info', docActivityTitle, 'MC/CME - Activity Name is duplicate');
                                }
                                else {
                                    fnMsgAlert('info', docActivityTitle, 'Marketing Activity Name is duplicate');
                                }
                                return false;
                            }
                        }
                        if ($("#txt_Currentsales_" + (i + 1)).val() == 0 || $("#txt_Currentsales_" + (i + 1)).val() == null) {
                            activity.Current_Sales = 0
                        }
                        else {
                            activity.Current_Sales = $("#txt_Currentsales_" + (i + 1)).val();
                        }
                        if ($("#txt_Expectedsales_" + (i + 1)).val() == 0 || $("#txt_Expectedsales_" + (i + 1)).val() == null) {
                            activity.Expected_Sales = 0
                        }
                        else {
                            activity.Expected_Sales = $("#txt_Expectedsales_" + (i + 1)).val();
                        }
                        if ($("#txt_Noofmonths_" + (i + 1)).val() == 0 || $("#txt_Noofmonths_" + (i + 1)).val() == null) {
                            activity.NoofMonths = 0
                        }
                        else {
                            activity.NoofMonths = $("#txt_Noofmonths_" + (i + 1)).val();
                        }
                        if (isCME == 'CME') {
                            for (var j = 0; j < $("#tableCME_" + (i + 1) + " tbody tr").length - 1; j++) {
                                var tracking = {};
                                tracking.Campaign_Code = activity.Campaign_Code;
                                tracking.Customer_Code = $.trim(doc_code);
                                tracking.Product_Code = $("#hdtxt_Product_" + j + '_' + (i + 1)).val();
                                tracking.No_Of_Month = $("#txt_Month_" + (i + 1)).val();
                                if ($("#txt_Currentsales_" + j + '_' + (i + 1)).val() == 0 || $("#txt_Currentsales_" + j + '_' + (i + 1)).val() == null) {
                                    tracking.Current_Sales = 0
                                }
                                else {
                                    tracking.Current_Sales = $("#txt_Currentsales_" + j + '_' + (i + 1)).val();
                                }
                                if ($("#txt_Expectedsales_" + j + '_' + (i + 1)).val() == 0 || $("#txt_Expectedsales_" + j + '_' + (i + 1)).val() == null) {
                                    tracking.Expected_Sales = 0
                                }
                                else {
                                    tracking.Expected_Sales = $("#txt_Expectedsales_" + j + '_' + (i + 1)).val();
                                }
                                InsertCMETracking.push(tracking);

                            }
                        }
                        //tracking.Product_Code= tableCME_
                        //for (var a = 0; a < InsertActivityJSON.length; a++) {
                        //    if (InsertActivityJSON[a].Campaign_Code == activity.Campaign_Code && InsertActivityJSON[a].MC_Activity_Id == activity.MC_Activity_Id && InsertActivityJSON[a].Activity_Type == 'MC') {
                        //        fnMsgAlert('info', docActivityTitle, 'Marketing Activity Name is duplicate');
                        //        return false;
                        //    }
                        //}
                        InsertActivityJSON.push(activity);

                    }


                    else {

                        if ($('#txt_MCActivity_Name_' + (i + 1) + '').val() != '') {
                            if (flag_g == 'A') {
                                fnMsgAlert('info', docActivityTitle, 'Invalid MC/CME Name');
                            }
                            else {
                                fnMsgAlert('info', docActivityTitle, 'Invalid Marketing Campaign Name');
                            }
                            return false;
                        }
                        //else if ($('#txt_MCActivity_Name_' + (i + 1) + '').val() = undefined) {
                        //    if (flag_g == 'A') {
                        //        fnMsgAlert('info', docActivityTitle, 'Invalid MC/CME Name');
                        //    }
                        //    else {
                        //        fnMsgAlert('info', docActivityTitle, 'Invalid Marketing Campaign Name');
                        //    }
                        //    return false;
                        //}
                    }
                }


                else {

                    //activity.Campaign_Code = $("#tbl_MC_Activity tr.mcandcmeactivity:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input:nth-child(2)').val();
                    activity.Campaign_Code = $("#hdnMCActivity_Code_" + (i + 1)).val();

                    if (activity.Campaign_Code != '' && activity.Campaign_Code != undefined) {
                        //Inactive Status
                        var single_mc = $.grep(MCDetails_g, function (element, index) {
                            return element.value == activity.Campaign_Code;
                        });
                        if (single_mc.length == 0) {
                            var mcName = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input:nth-child(1)').val();
                            fnMsgAlert('info', docActivityTitle, 'Invalid Marketing Campaign - (' + mcName + ')');
                            return false;
                        }
                        activity.Activity_Name = $("#tbl_MC_Activity tr:nth-child(" + (i + 1) + ") td:nth-child(1)").find('input').val();
                        activity.Activity_Type = 'MC';
                        if (i == 1) {

                            activity.MC_Activity_Id = $("#tbl_MC_Activity tr:nth-child(" + (i + 2) + ") td:nth-child(2)").find('select:nth-child(1)').val();
                            if (activity.MC_Activity_Id == '' || activity.MC_Activity_Id == '0') {
                                var mcName = $("#tbl_MC_Activity tr:nth-child(" + (i + 2) + ") td:nth-child(1)").find('input:nth-child(1)').val();
                                if (flag_g == 'A') {
                                    fnMsgAlert('info', docActivityTitle, 'Please Select Activity for MC/CME - (' + mcName + ')');
                                }
                                else {
                                    fnMsgAlert('info', docActivityTitle, 'Please Select Activity for Marketing Campaign - (' + mcName + ')');
                                }
                                return false;
                            }
                            activity.Activity_Remarks = $("#tbl_MC_Activity tr:nth-child(" + (i + 2) + ") td:nth-child(3)").find('textarea:nth-child(1)').val();

                        }
                        else {

                            activity.MC_Activity_Id = $("#tbl_MC_Activity tr:nth-child(" + (i + (i + 1)) + ") td:nth-child(2)").find('select:nth-child(1)').val();
                            if (activity.MC_Activity_Id == '' || activity.MC_Activity_Id == '0') {
                                var mcName = $("#tbl_MC_Activity tr:nth-child(" + (i + (i + 1)) + ") td:nth-child(1)").find('input:nth-child(1)').val();
                                if (flag_g == 'A') {
                                    fnMsgAlert('info', docActivityTitle, 'Please Select Activity for MC/CME - (' + mcName + ')');
                                }
                                else {
                                    fnMsgAlert('info', docActivityTitle, 'Please Select Activity for Marketing Campaign - (' + mcName + ')');
                                }

                                return false;
                            }
                            activity.Activity_Remarks = $("#tbl_MC_Activity tr:nth-child(" + (i + (i + 1)) + ") td:nth-child(3)").find('textarea:nth-child(1)').val();

                        }
                        activity.Created_By = "ad";
                        var str = single_mc[0].Campaign_Name
                        var indexValue = str.lastIndexOf('-')
                        var isCME = str.substring((parseInt(indexValue) + parseInt(1)), str.length)
                        activity.Campaign_Type = isCME;

                        for (var a = 0; a < InsertActivityJSON.length; a++) {
                            if (InsertActivityJSON[a].Campaign_Code == activity.Campaign_Code && InsertActivityJSON[a].MC_Activity_Id == activity.MC_Activity_Id && InsertActivityJSON[a].Activity_Type == 'MC') {
                                if (flag_g == 'A') {
                                    fnMsgAlert('info', docActivityTitle, 'MC/CME Activity Name is duplicate');
                                }
                                else {
                                    fnMsgAlert('info', docActivityTitle, 'Marketing Activity Name is duplicate');
                                }
                                return false;
                            }
                        }
                        if ($("#txt_Currentsales_" + (i + 1)).val() == 0 || $("#txt_Currentsales_" + (i + 1)).val() == null) {
                            activity.Current_Sales = 0
                        }
                        else {
                            if ($("#txt_Currentsales_" + (i + 1)).val() < 0) {
                                fnMsgAlert('info', docActivityTitle, 'Current Sales should not be negative');
                                return false;
                            }
                            else {
                                activity.Current_Sales = $("#txt_Currentsales_" + (i + 1)).val();
                            }

                        }
                        if ($("#txt_Expectedsales_" + (i + 1)).val() == 0 || $("#txt_Expectedsales_" + (i + 1)).val() == null) {
                            activity.Expected_Sales = 0
                        }
                        else {
                            if ($("#txt_Expectedsales_" + (i + 1)).val() < 0) {
                                fnMsgAlert('info', docActivityTitle, 'Expected Sales should not be negative');
                                return false;
                            }
                            else {
                                activity.Expected_Sales = $("#txt_Expectedsales_" + (i + 1)).val();
                            }

                        }
                        if ($("#txt_Noofmonths_" + (i + 1)).val() == 0 || $("#txt_Noofmonths_" + (i + 1)).val() == null) {
                            activity.NoofMonths = 0
                        }
                        else {
                            activity.NoofMonths = $("#txt_Noofmonths_" + (i + 1)).val();
                        }
                        if (isCME == 'CME') {
                            for (var j = 0; j < $("#tableCME_" + (i + 1) + " tbody tr").length - 1; j++) {
                                var tracking = {};
                                tracking.Campaign_Code = activity.Campaign_Code;
                                tracking.Customer_Code = $.trim(doc_code);
                                tracking.Product_Code = $("#hdtxt_Product_" + j + '_' + (i + 1)).val();
                                if ($("#txt_Currentsales_" + j + '_' + (i + 1)).val() == 0 || $("#txt_Currentsales_" + j + '_' + (i + 1)).val() == null) {
                                    tracking.Current_Sales = 0
                                }
                                else {
                                    tracking.Current_Sales = $("#txt_Currentsales_" + j + '_' + (i + 1)).val();
                                }
                                if ($("#txt_Expectedsales_" + j + '_' + (i + 1)).val() == 0 || $("#txt_Expectedsales_" + j + '_' + (i + 1)).val() == null) {
                                    tracking.Expected_Sales = 0
                                }
                                else {
                                    tracking.Expected_Sales = $("#txt_Expectedsales_" + j + '_' + (i + 1)).val();
                                }
                                tracking.No_Of_Month = $("#txt_Month_" + (i + 1)).val();
                                InsertCMETracking.push(tracking);

                            }
                        }
                        InsertActivityJSON.push(activity);

                    }
                    else {

                        if ($('#txt_MCActivity_Name_' + (i + 1) + '').val() != '') {
                            if (flag_g == 'A') {
                                fnMsgAlert('info', docActivityTitle, 'Invalid MC/CME Name');
                            }
                            else {
                                fnMsgAlert('info', docActivityTitle, 'Invalid Marketing Campaign Name');
                            }
                            return false;
                        }
                        else if ($('#txt_MCActivity_Name_' + (i + 1) + '').val() == undefined) {
                            if (flag_g == 'A') {
                                fnMsgAlert('info', docActivityTitle, 'Invalid MC/CME Name');
                            }
                            else {
                                fnMsgAlert('info', docActivityTitle, 'Invalid Marketing Campaign Name');
                            }
                            return false;
                        }
                    }
                }
            }
        }



        //POB Header
        //----------------------------------------------------------------------
        var Stockist_Rows = $('#tbl_POB tr').length;
        var InsertStockistJSON = new Array();
        var InsertSProductJSON = new Array();
        var Client_Order_ID = 1;
        var SalesProductTableID = 1;
        var ID = 1;
        //if (Mode_Of_Form == '2') {
        var pobCount = 0;
        if (rowpos != undefined && rowpos > 0)
            pobCount = $("#hdnPOBCount_" + rowpos).val();
        else
            pobCount = $('#hdnbindRowNumber').val();
        if (doc_Visit_Controls_g.indexOf(pob_privilege_name) >= 0 || pobCount > 0) {
            var accom_Regioncodes = jsonPath(doctorAutoFill_g, "$[?(@.value=='" + $("#hdnDocName").val().trim() + "')]");
            for (var i = 1; i < Stockist_Rows; i++) {
                i++;
                if ($('#POB_Row_' + i).css('display') != 'none') {
                    if (($('#hdnStockist_Code_' + i).val().trim() != '') && ($('#hdnStockist_Code_' + i).val() != undefined)) {
                        //if (($('#txtStockistdueDate_' + i).val().trim() != '') && ($('#txtStockistdueDate_' + i).val() != undefined)) {
                        //dont read DCR is applied status
                        if ($("#hdnOrder_Status_" + i).val().trim() != "2") {

                            //check Sctockist-available or not
                            var St_Region_Code = jsonPath(StockistAuto_master_g, "$[?(@.StockiestCode=='" + $("#hdnStockist_Code_" + i).val() + "')]")
                            if (St_Region_Code <= 0 || St_Region_Code == false) {
                                fnMsgAlert('info', 'Purchase Order Booking', 'Invalid ' + StockistHeader_g + ' - ' + $('#txt_Stockist_Name_' + i).val().trim());
                                return false;
                            }
                            var Stockist_Name = $('#txt_Stockist_Name_' + i).val().trim();
                            var Stockist = {
                            };
                            if ($('#txtStockistdueDate_' + i).val().trim() != '')
                                Stockist.Order_Due_Date = $.trim($('#txtStockistdueDate_' + i).val().split('/')[2]) + "-" + $.trim($('#txtStockistdueDate_' + i).val().split('/')[1]) + "-" + $.trim($('#txtStockistdueDate_' + i).val().split('/')[0]);
                            else
                                Stockist.Order_Due_Date = dcrActualDate_g;

                            //
                            if (Stockist.Order_Due_Date < dcrActualDate_g) {
                                fnMsgAlert('info', 'Information', StockistHeader_g + ' - Due Date (' + $('#txtStockistdueDate_' + i).val() + ') Should be greater than DCR date');
                                return false;
                            }
                            Stockist.Stockist_Name = Stockist_Name;
                            Stockist.Client_Order_ID = Client_Order_ID;
                            Stockist.Stockist_Code = $("#hdnStockist_Code_" + i).val();

                            Stockist.Stockist_Region_Code = St_Region_Code[0].StockiestRegionCode;
                            if (accom_Regioncodes.length > 0) {
                                Stockist.Customer_Code = $("#hdnDocName").val().trim();
                                Stockist.Customer_Region_Code = accom_Regioncodes[0].Doctor_Region_Code;
                                Stockist.Customer_Name = accom_Regioncodes[0].label.split('_')[0];
                                Stockist.Customer_Speciality = accom_Regioncodes[0].Speciality_Name;
                                Stockist.MDL_Number = accom_Regioncodes[0].label.split('_')[1];
                                Stockist.Customer_Category_Code = accom_Regioncodes[0].Category_Code;
                            }
                            else {
                                Stockist.Customer_Code = '';
                                Stockist.Customer_Region_Code = Region_code_g;
                                Stockist.Customer_Name = $("#txtDocName").val().trim();
                                Stockist.Customer_Speciality = $("#txtDocSpeciality").val().trim();
                                Stockist.MDL_Number = '';
                                Stockist.Customer_Category_Code == '';
                            }
                            if ($("#hdnOrder_Id_" + i).val().trim() != '')
                                Stockist.Order_Id = $("#hdnOrder_Id_" + i).val();
                            else
                                Stockist.Order_Id = '-1';
                            if ($("#hdnOrder_Number_" + i).val().trim() != '')
                                Stockist.Order_Number = $("#hdnOrder_Number_" + i).val().trim();
                            else
                                Stockist.Order_Number = "-1";
                            //-1 New
                            if ($("#hdnOrder_Status_" + i).val().trim() != '')
                                Stockist.Order_Status = $("#hdnOrder_Status_" + i).val();
                            else
                                Stockist.Order_Status = "3";
                            Stockist.Order_Mode = "0";
                            Stockist.Source_Of_Entry = "1";
                            if (!(fnValidateDateFormate(('#txtStockistdueDate_' + i), StockistHeader_g + ' Due Date'))) {
                                return false;
                            }
                            //Product
                            var Product_Rows = $('#tblSalesProduct_' + SalesProductTableID).children().length;
                            //For Remove the Header
                            Product_Rows--;
                            var Total_Qty = 0;
                            var Total_POB_Value = 0;
                            var No_Of_Products = 0;

                            for (var k = 0; k < Product_Rows; k++) {
                                var txtId = SalesProductTableID + "_" + k;
                                if ($('#proDiv_' + txtId).css('display') != 'none') {
                                    if ($("#txt_SSalesProducts_" + txtId).val() != '') {
                                        //$("#hdnSSales_Products_" + txtId).val() != '' &&
                                        //check Product-available or not
                                        var single_Product = jsonPath(SalesProductsAutoFill_g, "$[?(@.value=='" + $("#hdnSSales_Products_" + txtId).val() + "')]")
                                        if (single_Product <= 0 || single_Product == false) {
                                            fnMsgAlert('info', 'Purchase Order Booking', 'Invalid Product Name : ' + $("#txt_SSalesProducts_" + txtId).val().trim());
                                            return false;
                                        }
                                        if ($("#txt_SQty_" + txtId).val() == '') {
                                            $("#txt_SSalesProducts_" + txtId).focus();
                                            fnMsgAlert('info', 'Purchase Order Booking', ' Product quantity should be greater then zero for [ ' + $("#txt_SSalesProducts_" + txtId).val().trim() + ' ]');
                                            return false;
                                        }
                                        else {
                                            if (parseFloat($("#txt_SQty_" + txtId).val()) <= 0 || $("#txt_SQty_" + txtId).val().trim() == '.') {
                                                $("#txt_SSalesProducts_" + txtId).focus();
                                                fnMsgAlert('info', 'Purchase Order Booking', ' Product quantity should be greater then zero for [ ' + $("#txt_SSalesProducts_" + txtId).val().trim() + ' ]');
                                                return false;
                                            }
                                        }
                                        var product = {
                                        };
                                        product.ID = ID;
                                        ID++;
                                        product.Client_Order_ID = Stockist.Client_Order_ID;
                                        product.Product_Code = $("#hdnSSales_Products_" + txtId).val();
                                        product.Product_Name = $("#txt_SSalesProducts_" + txtId).val();
                                        product.Product_Qty = $("#txt_SQty_" + txtId).val();
                                        product.Unit_Rate = $("#txt_SUnit_" + txtId).val();
                                        product.Amount = $("#txt_SAmount_" + txtId).val();
                                        InsertSProductJSON.push(product);

                                        Total_Qty += parseFloat(product.Product_Qty);
                                        Total_POB_Value += parseFloat(product.Amount);
                                        No_Of_Products++;

                                    }
                                }
                            }

                            Stockist.Remarks = $("#txtReamrk_" + SalesProductTableID).val().trim();

                            // remarks special char check.
                            var res = SpecialCharacterGroup("#txtReamrk_" + SalesProductTableID);
                            if (!res) {
                                fnMsgAlert('info', 'Information', 'Please enter allowed characters <b>[ ' + allowCharacterinRemarks + ' ]</b> in ' + StockistHeader_g + ' (' + Stockist.Stockist_Name + ') remarks ');
                                return false;
                            }
                            Stockist.Action = '0';
                            Stockist.Total_POB_Value = Total_POB_Value;
                            Stockist.Total_Qty = Total_Qty;
                            Stockist.No_Of_Products = No_Of_Products;
                            Stockist.DCR_Actual_Date = dcrActualDate_g;
                            Stockist.Customer_Visit_Code = dcr_visit_code;


                            Client_Order_ID++;
                            InsertStockistJSON.push(Stockist);

                        }

                        // }
                    }
                    else {
                        var Product_Rows = $('#tblSalesProduct_' + SalesProductTableID).children().length;

                        for (var k = 0; k < Product_Rows; k++) {
                            var txtId = SalesProductTableID + "_" + k;
                            if ($('#proDiv_' + txtId).css('display') != 'none') {
                                if ($("#txt_SSalesProducts_" + txtId).val() != undefined && $("#txt_SSalesProducts_" + txtId).val() != '') {
                                    fnMsgAlert('info', 'POB', 'Stockist name is mandatory for POB <br/> Please Enter Stockist Name for the product: <b>' + $("#txt_SSalesProducts_" + txtId).val().trim() + '</b>');
                                    return false;
                                }
                            }
                        }

                        if ($('#txt_Stockist_Name_' + i).val().trim() != '') {
                            fnMsgAlert('info', 'Purchase Order Booking', 'Invalid ' + StockistHeader_g + ' : ' + $('#txt_Stockist_Name_' + i).val().trim());
                            return false;
                        }
                    }
                }
                    //disabled product
                else {
                    if ($("#hdnOrder_Id_" + i).val().trim() != '') {
                        var Stockist = {
                        };
                        Stockist.Client_Order_ID = Client_Order_ID;
                        Stockist.Order_Id = $("#hdnOrder_Id_" + i).val();
                        Stockist.Total_POB_Value = '0';
                        Stockist.Total_Qty = '0';
                        Stockist.No_Of_Products = '0';
                        Stockist.Action = '1';
                        Client_Order_ID++;
                        InsertStockistJSON.push(Stockist);
                    }
                }
                i = i + 2;
                SalesProductTableID++;
            }
            debugger;
            var POB_Enter_Min = fnGetPrivilegeValue("DOCTOR_POB_ENTER_MIN", "");
            var POB_Enter_Max = fnGetPrivilegeValue("DOCTOR_POB_ENTER_MAX", "");
            var POB_Min_Product = fnGetPrivilegeValue("DOCTOR_POB_PRODUCT_ENTER_MIN", "");
            var POB_Max_Product = fnGetPrivilegeValue("DOCTOR_POB_PRODUCT_ENTER_MAX", "");
            var istrue = true;
            debugger;

            if (flag_g == "F") {
                if (document.getElementById("POBMandatory").checked == false && $("#POB").css('display') == "block") {
                    if (POB_Enter_Min != "" && POB_Enter_Min != false && POB_Enter_Min != undefined && POB_Enter_Min != "0") {
                        if (InsertStockistJSON.length < POB_Enter_Min) {
                            fnMsgAlert('info', 'Purchase Order Booking', 'Please enter a minimum of ' + POB_Enter_Min + ' stockist in POB.');
                            istrue = false;
                            return false;
                        }
                    }
                    if (POB_Enter_Max != "" && POB_Enter_Max != false && POB_Enter_Max != undefined && POB_Enter_Max != "0") {
                        if (InsertStockistJSON.length > POB_Enter_Max) {
                            fnMsgAlert('info', 'Purchase Order Booking', 'You can enter a maximum of ' + POB_Enter_Max + ' stockist in POB.');
                            istrue = false;
                            return false;
                        }
                    }
                    var product_list = "";
                    if (istrue) {
                        for (var st = 0; st < InsertStockistJSON.length; st++) {
                            if (InsertStockistJSON[st].Action != '1') {
                                var stockList = jsonPath(InsertStockistJSON, "$[?(@.Stockist_Code=='" + InsertStockistJSON[st].Stockist_Code + "')]")
                                if (stockList.length > 1) {
                                    fnMsgAlert('info', 'Purchase Order Booking', 'The ' + StockistHeader_g + '-' + stockList[0].Stockist_Name + ' already entered.');
                                    return false;
                                }
                                product_list = jsonPath(InsertSProductJSON, "$[?(@.Client_Order_ID=='" + InsertStockistJSON[st].Client_Order_ID + "')]")
                                for (var pr = 0; pr < product_list.length; pr++) {
                                    var single_product = jsonPath(product_list, "$[?(@.Product_Code=='" + product_list[pr].Product_Code + "')]")
                                    if (single_product.length > 1) {
                                        fnMsgAlert('info', 'Purchase Order Booking', 'The product name ' + single_product[0].Product_Name + ' already entered.');
                                        return false;
                                    }
                                }
                                debugger;
                                if (product_list != false) {
                                    if (POB_Min_Product != "" && POB_Min_Product != false && POB_Min_Product != undefined && POB_Min_Product != "0") {
                                        if (product_list.length < POB_Min_Product) {
                                            fnMsgAlert("info", "Purchase Order Booking", "Please select a minimum  of " + POB_Min_Product + " products under '" + InsertStockistJSON[st].Stockist_Name + "'.");
                                            return false;
                                        }
                                    }
                                    if (POB_Max_Product != "" && POB_Max_Product != false && POB_Max_Product != undefined && POB_Max_Product != "0") {
                                        if (product_list.length > POB_Max_Product) {
                                            fnMsgAlert("info", "Purchase Order Booking", "You can select a maximum of " + POB_Max_Product + " products under '" + InsertStockistJSON[st].Stockist_Name + "'.");
                                            return false;
                                        }
                                    }
                                }
                                if (product_list.length <= 0 || product_list == false) {
                                    fnMsgAlert("info", "Purchase Order Booking", "Please select atleast one product under '" + InsertStockistJSON[st].Stockist_Name + "'.");
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        //return false;
        //-----------------------------------------------------------------------
        // Doctor Name Change Validation.
        if ($('#hdnbindRowNumber').val() != "0" && $('#hdnbindRowNumber').val().length > 0 && $('#spnDocName_' + rowNum).html() != null) {
            if (doc_code.length > 0) {
                if ($.trim($('#txtDocName').val()) != $.trim($('#spnDocName_' + rowNum).html()) && (prodString.length > 0 || (chemistString.length > 0 || rcpaString.length > 0))) {
                    var oldname = $.trim($('#spnDocName_' + rowNum).html());
                    var newname = $.trim($('#txtDocName').val());
                    if (!confirm("You have changed the " + DoctorHeader_g + " name from " + oldname + " to " + newname + ".\nDo you wish to retain the " + chemistName + " entry and Sample/Promotional items entry?")) {
                        prodString = "";
                        chemistString = "";
                        rcpaString = "";
                        prodArray = new Array();
                        chemJsonArray = new Array();
                        rcpaJSONArray = new Array();
                        docAccArray = new Array();
                        detProdJsonArray = new Array();
                        fnInsertDoctor(dcr_visit_code, doc_string, prodString, chemistString, rcpaString, acc_string, detail_string, isRedirecttoStockiest, rowNum,
                        doctorArray, prodArray, chemJsonArray, rcpaJSONArray, docAccArray, detProdJsonArray);
                        return;
                    }

                }
            }
            else {
                if ($('#spnDocName_' + rowNum).html() != null && $.trim($('#txtDocName').val()) != $.trim($('#spnDocName_' + rowNum).html().split('_')[0]) && (prodString.length > 0 || (chemistString.length > 0 || rcpaString.length > 0))) {
                    var oldname = $.trim($('#spnDocName_' + rowNum).html());
                    var newname = $.trim($('#txtDocName').val());
                    if (!confirm("You have changed the " + DoctorHeader_g + " name from " + oldname + " to " + newname + ".\nDo you wish to retain the " + chemistName + " entry and Sample/Promotional items entry?")) {
                        // doc_string = escape(doc_Name) + "^" + doc_code + "^" + spec_name + "^" + spec_code + "^" + visit_mode + "^" + visit_time + "^" + doc_pob + "^" + isCpDoc + "^" + escape(remarks) + "^" + source_of_entry + "^";
                        prodArray = new Array();
                        chemJsonArray = new Array();
                        rcpaJSONArray = new Array();
                        docAccArray = new Array();
                        detProdJsonArray = new Array();

                        chemistString = "";
                        rcpaString = "";
                        fnInsertDoctor(dcr_visit_code, doc_string, prodString, chemistString, rcpaString, acc_string, detail_string, isRedirecttoStockiest, rowNum,
                            doctorArray, prodArray, chemJsonArray, rcpaJSONArray, docAccArray, detProdJsonArray);
                        return;
                    }

                }
            }
        }
        // if (Mode_Of_Form == '1' && ChemistsPrivilege != ChemistsPrivilege_Value) {
        if ((ChemistsPrivilege != ChemistsPrivilege_Value) && (doc_Visit_Controls_g.indexOf(chemist_privilege_name) >= 0)) {
            // RCPA Mandatoty Check.
            if (RCPA_g.toUpperCase() == "R" && ($("#RcpaMandatory").prop("checked") == false) && $("#chemistMandatory").prop("checked") == false) {
                if (RCPA_g.toUpperCase() == "R") {
                    if (rcpaString.length == 0) {
                        var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
                        if (rcpaMandatory.length > 0) {
                            var rcapCategoryArray = rcpaMandatory.split(',');
                            var doctorCategory = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + $('#hdnDocName').val() + "')]");
                            if (doctorCategory && doctorCategory[0].Category != null) {
                                if ($.inArray(doctorCategory[0].Category.toUpperCase(), rcapCategoryArray) > -1) {
                                    fnMsgAlert('info', docCheRCPAAlertTitle, "For " + rcpaMandatory + " " + DoctorHeader_g + ", you need to enter minimum of one RCPA entry.")
                                    HideModalPopup('dvLoading');
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        HideModalPopup('dvLoading');
        fnInsertDoctor(dcr_visit_code, doc_string, prodString, chemistString, rcpaString, acc_string, detail_string, isRedirecttoStockiest, rowNum,
                doctorArray, prodArray, chemJsonArray, rcpaJSONArray, docAccArray, detProdJsonArray, fllowJSONArray, DoctorAttJSONArray, InsertStockistJSON, InsertSProductJSON, InsertActivityJSON, CompProductJSONArray, InsertCMETracking);
        return true;
    }
    catch (e) {
        fnUnBlockDiv('div_doctorvisit');
        HideModalPopup('dvLoading');
        alert(e.message);
    }
}

function fnReadRcpaDetails(chemRowNum, chem_name, rcpaJSONArray, dcr_visit_code) {
    debugger;
    var rcpastr = "";
    var rcpaObject = $('#divRCPA' + chemRowNum + ' table')

    // RCPA Tables Count.
    var rcpaTablesCount = $('#divRCPA' + chemRowNum + ' table').length;
    for (var rcpaRowIndex = 0; rcpaRowIndex < rcpaTablesCount; rcpaRowIndex++) {
        var rcpaProduct = "";
        var rcpaComp = "";
        var rcpaCompQty = "";

        var compCodes = new Array();
        //tblchem_prod_CHNUM_RCPANUM
        var rcpaIndex = rcpaRowIndex + 1;

        // Retrieves the each table row length.(including competitor rows).
        var rcpaRowLength = $('#tblchem_prod_' + chemRowNum + "_" + rcpaIndex + ' tr').length;
        for (var rindex = 0; rindex < rcpaRowLength; rindex++) {
            var rcpaobj = {
            };
            //txtchem_prod_CHNUM_RCPANUM
            // Skip the header.
            if (rindex == 0) {
                continue;
            }

            var rcpaNum = rindex;
            // if row no is 1.
            // Read the Product and the same product as competitor and read the first row competitor.
            if (rcpaNum == 1) {

                if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex)) {
                    // if product name length is not equal is 0. we read the product.
                    if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).val().length != 0) {

                        // Retrieve the product name.
                        rcpaProduct = $('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).val();

                        // Retrieve the Product code and check is valid.
                        rcpaProductCode = $('#hdnchem_prod_' + chemRowNum + '_' + rcpaIndex).val();
                        if (rcpaProductCode.length == 0) {
                            fnMsgAlert('info', docCheRCPAAlertTitle, "Invalid Own Product " + rcpaProduct + " for " + chemistName + " - " + chem_name + ".");
                            return false;
                        }

                        // set the product as competitor.
                        rcpaComp = rcpaProduct;

                        // Retrieve the Product Qty.
                        // txtchem_prodQty_CHNUM_RCPANUM
                        rcpaCompQty = $('#txtchem_prodQty_' + chemRowNum + '_' + rcpaIndex).val();
                        if (rcpaCompQty.length == 0) {
                            if (rcpaProduct.length > 0) {
                                fnMsgAlert('info', 'Info', 'Own product quantity cannot be empty');
                                return false;
                            }
                        }
                        else {
                            var specialCharregex = new RegExp("^[0-9]+$");
                            if (!specialCharregex.test(rcpaCompQty)) {
                                fnMsgAlert('error', docCheRCPAAlertTitle, 'Please remove the special characters in Own Product Qty box for Product' + rcpaProduct + '.');
                                fnErrorIndicator($('#txtchem_prodQty_' + chemRowNum + '_' + rcpaIndex));
                                return false
                            }
                            else {
                                fnRemoveErrorIndicatior($('#txtchem_prodQty_' + chemRowNum + '_' + rcpaIndex));
                            }
                        }

                        var rcpaProdCount = 0;
                        for (var index = 1; index <= rcpaTablesCount - 1; index++) {
                            if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).val() == $('#txtchem_prod_' + chemRowNum + '_' + index).val()) {
                                rcpaProdCount++;
                                if (rcpaProdCount > 1) {
                                    fnMsgAlert('info', docCheRCPAAlertTitle, 'The Own Product ' + rcpaProduct + ' already entered for ' + chemistName + ' - ' + chem_name + '.');
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

                        // Read the first row competitor name and qty.
                        if ($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {

                            var rcpaComp = $('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            var rcpaCompCode = $('#hdnchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            var rcpaCompQty = $('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                            if (rcpaComp.length > 0) {
                                if ($('#txtchem_prod_' + chemRowNum + '_' + rcpaIndex).length == 0) {
                                    fnMsgAlert('info', 'Info', 'Competitor product cannot be entered without sales product');
                                    return false;
                                }
                            }
                            if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup1($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum))) {
                                fnMsgAlert("info", docCheRCPAAlertTitle, "Please remove the special characters in Competitor Product " + rcpaComp + ". <br/>The following characters are only allowed <b>-_.</b>");
                                return false;
                            }
                            compCodes.push(rcpaCompCode);
                            if (rcpaCompQty.length == 0) {
                                if (rcpaComp.length > 0) {
                                    fnMsgAlert('info', 'Info', 'Competitor product quantity cannot be empty if competitor product name is entered');
                                    return false;
                                }
                            }
                            else {
                                var specialCharregex = new RegExp("^[0-9]+$");
                                if (!specialCharregex.test(rcpaCompQty)) {
                                    fnMsgAlert('error', docCheRCPAAlertTitle, 'Please remove the special characters in Competitor Product Quantity box for competitor Competitor Product.' + rcpaComp);
                                    fnErrorIndicator($('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                    return false;
                                }
                                else {
                                    fnRemoveErrorIndicatior($('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                                }
                            }
                        }
                        else {
                            // if first row competitor length is 0. loop is continue.
                            continue;
                        }
                    }
                    else {
                        // if first row product length is 0. loop is continue go to next product.
                        if ($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {
                            fnMsgAlert('info', 'Info', 'You cannot enter competitor products without entering sales products');
                            return false;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            else {
                //txtchem_prod_compQty_CHNUM_RCPANUM_1
                // Read the other competitors row.
                if ($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val().length > 0) {
                    var rcpaComp = $('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                    var rcpaCompCode = $('#hdnchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                    var rcpaCompQty = $('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum).val();
                    if (rcpaComp.lenght > 0) {
                        if (rcpaProduct.length == 0) {
                            fnMsgAlert('info', 'Info', 'Competitor Product cannot be entered without sales product');
                            return false;
                        }
                    }
                    if (rcpaCompCode.length > 0) {
                        if ($.inArray(rcpaCompCode, compCodes) > -1) {
                            fnMsgAlert('info', docCheRCPAAlertTitle, 'The ' + rcpaComp + ' Competitor Product name more than once for product ' + rcpaProduct + '.');
                            return false;
                        }
                        else {
                            compCodes.push(rcpaCompCode);
                        }
                        //compCodes.push(rcpaCompCode);
                    }
                    var specialCharregex = new RegExp("^[-a-zA-Z0-9 _().]+$");
                    rcpaComp = rcpaComp.replace(/\'/g, ' ');
                    if (!specialCharregex.test(rcpaComp)) {
                        fnMsgAlert('info', docCheRCPAAlertTitle, 'Please remove the special characters for Competitor Product.' + rcpaComp);
                        fnErrorIndicator($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                        return false
                    }
                    else {
                        fnRemoveErrorIndicatior($('#txtchem_prod_comp_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                    }
                    if (rcpaCompQty.length == 0) {
                        if (rcpaComp.length > 0) {
                            fnMsgAlert('info', 'Info', 'Competitor product quantity cannot be empty');
                            return false;
                        }
                    }
                    else {
                        var specialCharregex = new RegExp("^[0-9]+$");
                        if (!specialCharregex.test(rcpaCompQty)) {
                            fnMsgAlert('error', docCheRCPAAlertTitle, 'Please remove the special characters in competitor Quantity box for competitor.' + rcpaComp);
                            fnErrorIndicator($('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                            return false
                        }
                        else {
                            fnRemoveErrorIndicatior($('#txtchem_prod_compQty_' + chemRowNum + '_' + rcpaIndex + '_' + rcpaNum));
                        }
                    }

                }
                else {
                    // if competitor row length is 0. Continue next row.
                    continue;
                }
            }
            rcpaobj = {
            };
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

}

function fnInsertDoctor(dcrVisitCode, docString, productString, chemistString, rcpaString, accstring, detailstring, isRedirecttoStockiest, rowpos,
doctor, prodArrobj, chemArrobj, rcpaArrobj, docAccArrobj, detaprdArrobj, fllowJSONArray, DoctorAttJSONArray, InsertStockistJSON, InsertSProductJSON, InsertActivityJSON, CompProductJSONArray, InsertCMETracking) {

    if (DCR_CATEGORY_VISIT_COUNT_RESTRICTION_G == "YES" && doctor[0].Doctor_Code != null && $.trim(doctor[0].Doctor_Code).length > 0 && doctor[0].Category != null && $.trim(doctor[0].Category).length > 0 && flag_g == 'F') {
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/DCRV4DoctorVisit/ValidateCategoryVisitCountRestriction',
            data: "Doctor_Code=" + doctor[0].Doctor_Code + "&Category_Code=" + doctor[0].Category + "&DCR_Actual_Date=" + dcrActualDate_g,
            success: function (response) {
                if (response != null && response.Result == aRESULT.ResultPass) {
                    fnInsertDoctorFinal(dcrVisitCode, docString, productString, chemistString, rcpaString, accstring, detailstring, isRedirecttoStockiest, rowpos,
                        doctor, prodArrobj, chemArrobj, rcpaArrobj, docAccArrobj, detaprdArrobj, fllowJSONArray, DoctorAttJSONArray, InsertStockistJSON, InsertSProductJSON, InsertActivityJSON, CompProductJSONArray, InsertCMETracking)
                }
                else {
                    fnUnBlockDiv('div_doctorvisit');
                    $('#buttondiv').css('display', '');
                    var Result_txt = response.Result_Text;
                    Result_txt = 'This ' + DoctorHeader_g + ' exceeds the visit count limit for the month.';
                    fnMsgAlert("info", screenTitle, Result_txt);
                    return false;
                }
            },
            error: function (e) {
                fnUnBlockDiv('div_doctorvisit');
                $('#buttondiv').css('display', '');
                fnMsgAlert("Error", screenTitle, e.responseText);
                return false;
            }
        });
    }
    else {
        fnInsertDoctorFinal(dcrVisitCode, docString, productString, chemistString, rcpaString, accstring, detailstring, isRedirecttoStockiest, rowpos,
doctor, prodArrobj, chemArrobj, rcpaArrobj, docAccArrobj, detaprdArrobj, fllowJSONArray, DoctorAttJSONArray, InsertStockistJSON, InsertSProductJSON, InsertActivityJSON, CompProductJSONArray, InsertCMETracking)
    }
}

function fnInsertDoctorFinal(dcrVisitCode, docString, productString, chemistString, rcpaString, accstring, detailstring, isRedirecttoStockiest, rowpos,
doctor, prodArrobj, chemArrobj, rcpaArrobj, docAccArrobj, detaprdArrobj, fllowJSONArray, DoctorAttJSONArray, InsertStockistJSON, InsertSProductJSON, InsertActivityJSON, CompProductJSONArray, InsertCMETracking) {
    debugger;
    var result = "";
    if (InsertActivityJSON.length > 0 || prodArrobj.length > 0 || flag_g == 'F') {
        var dcrDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
        var Mode_Of_Form = $("input[name='Mode_Of_Form']:checked").val();
        var business_Status_ID = null;
        var Marketing_Campaign_ID = null;

        debugger;
        if ($("#ddlDBStatus").val() != '0')
            business_Status_ID = $("#ddlDBStatus").val();

        if ($("#ddlMC").val() != '0')
            Marketing_Campaign_ID = $("#ddlMC").val();
        var _objDateDetails = CommonDateDetails.fnGetTodaysDateNew();

        // HD Error Audit Log.
        try {
            var Doctor_Visit_Obj = {};
            Doctor_Visit_Obj.DCRVisitCode = dcrVisitCode
            Doctor_Visit_Obj.DCRActualDate = dcrActualDate_g;
            Doctor_Visit_Obj.rcpaFlag = RCPA_g;
            Doctor_Visit_Obj.prodBringType = productBringType_g;
            Doctor_Visit_Obj.sourceOfEntry = 'WEB';
            Doctor_Visit_Obj.doctorJson = JSON.stringify(doctor);
            Doctor_Visit_Obj.prodJson = JSON.stringify(prodArrobj);
            Doctor_Visit_Obj.chemArrobj = JSON.stringify(chemArrobj);
            Doctor_Visit_Obj.rcpaJson = JSON.stringify(rcpaArrobj);
            Doctor_Visit_Obj.docAccJson = JSON.stringify(docAccArrobj);
            Doctor_Visit_Obj.detailprd = JSON.stringify(detaprdArrobj);
            Doctor_Visit_Obj.doc_Max_Code = $('#hdnDocMaxCode').val();
            Doctor_Visit_Obj.doc_Acc_Max_Code = $('#hdnDocAccMaxCode').val()
            Doctor_Visit_Obj.inputs_Max_Code = $('#hdnInputsMaxCode').val();
            Doctor_Visit_Obj.detailed_Max_Code = $('#hdnDetailedMaxCode').val();
            Doctor_Visit_Obj.chemist_Max_Code = $('#hdnChemMaxCode').val();
            Doctor_Visit_Obj.rcpa_Max_Code = $('#hdnRCPAMaxCode').val();
            Doctor_Visit_Obj.fllowJSON = JSON.stringify(fllowJSONArray);
            Doctor_Visit_Obj.Attachment_Json = JSON.stringify(DoctorAttJSONArray);
            Doctor_Visit_Obj.InsertStockistJSON = JSON.stringify(InsertStockistJSON);
            Doctor_Visit_Obj.InsertSProductJSON = JSON.stringify(InsertSProductJSON);
            Doctor_Visit_Obj.Mode_Of_Form = Mode_Of_Form;
            Doctor_Visit_Obj.business_Status_ID = business_Status_ID;
            Doctor_Visit_Obj.InsertActivityJSON = JSON.stringify(InsertActivityJSON);
            Doctor_Visit_Obj.CompProductJSONArray = JSON.stringify(CompProductJSONArray);
            Doctor_Visit_Obj.flag = flag_g;
            Doctor_Visit_Obj._objDateDetails = JSON.stringify(_objDateDetails);
            Doctor_Visit_Obj.CMETracking = JSON.stringify(InsertCMETracking)

            var objdata = {
                PartitionKey: "HiDoctor",
                Type: "DCRLog",
                CompanyCode: CompanyCode,
                UserCode: UserCode,
                RegionCode: RegionCode,
                ActionDateTime: new Date().toLocaleString(),
                ModuleName: "DCR",
                SubModuleName: "Doctor Visit Details",
                ActionTaken: "Add Doctor",
                ErrorCode: "",
                ErrorMessage: "",
                Data: "POST DATA",
                Json: JSON.stringify(Doctor_Visit_Obj),
                SourceOfEntry: "WEB",
                VersionName: "14.4.4",
                VersionCode: "14.4.4"
            };
            var context = ["api", "HDLogServices"];
            ErrorLogCoreRest.post(context, objdata, fnSucessCallBack, fnFailureCallback);
        }
        catch (ex) {

        }
        // End.

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/DCRV4DoctorVisit/InsertDCRDoctorVisitData',
            data: "DCRVisitCode=" + dcrVisitCode + "&DCRActualDate=" + dcrActualDate_g + "&rcpaFlag=" + RCPA_g + "&prodBringType=" + productBringType_g + "&sourceOfEntry=WEB"
            + "&doctorJson=" + JSON.stringify(doctor) + "&prodJson=" + JSON.stringify(prodArrobj) + "&chemArrobj=" + JSON.stringify(chemArrobj) + "&rcpaJson=" + JSON.stringify(rcpaArrobj) +
            "&docAccJson=" + JSON.stringify(docAccArrobj) + "&detailprd=" + JSON.stringify(detaprdArrobj) + "&doc_Max_Code=" + $('#hdnDocMaxCode').val() + "&doc_Acc_Max_Code=" + $('#hdnDocAccMaxCode').val()
            + "&inputs_Max_Code=" + $('#hdnInputsMaxCode').val() + "&detailed_Max_Code=" + $('#hdnDetailedMaxCode').val() + "&chemist_Max_Code=" + $('#hdnChemMaxCode').val() + "&rcpa_Max_Code=" + $('#hdnRCPAMaxCode').val() + "&fllowJSON=" + JSON.stringify(fllowJSONArray) + "&Attachment_Json=" + JSON.stringify(DoctorAttJSONArray) + "&InsertStockistJSON=" + JSON.stringify(InsertStockistJSON) + "&InsertSProductJSON=" + JSON.stringify(InsertSProductJSON) + "&Mode_Of_Form=" + Mode_Of_Form + "&business_Status_ID=" + business_Status_ID + "&InsertActivityJSON=" + JSON.stringify(InsertActivityJSON)
            + "&CompProductJSONArray=" + JSON.stringify(CompProductJSONArray) + "&flag=" + flag_g + "&_objDateDetails=" + JSON.stringify(_objDateDetails) + "&CMETracking=" + JSON.stringify(InsertCMETracking),

            success: function (response) {
                $('#buttondiv').css('display', '');
                fnUnBlockDiv('div_doctorvisit');
                if (response.Error_Message == "-1") {

                    // empty the form mode.
                    formMode_g = "";
                    // set maxcodes.
                    setMaxCodes(response);
                    // if flexi doctor add speciality name.
                    if (doctor[0].Doctor_Code == null) {
                        doctor[0].label = doctor[0].Doctor_Name + "__" + doctor[0].Speciality_Name;
                        doctor[0].Doctor_Name = doctor[0].Doctor_Name + "__" + doctor[0].Speciality_Name;
                    }
                    var dvcode = response.Doctor_Visit_Code;
                    doctor[0].Doctor_Visit_Code = dvcode;
                    doctor[0].Record_Status = "3";
                    var Mode_Of_Form = $("input[name='Mode_Of_Form']:checked").val();
                    doctor[0].Mode_Of_Form = Mode_Of_Form;
                    doctor[0].Business_Status_ID = business_Status_ID == null ? 0 : business_Status_ID;
                    if (rowpos == "0") {
                        RowCreation(dvcode, doctor[0], prodArrobj, chemArrobj, rcpaArrobj, docAccArrobj, detaprdArrobj, fllowJSONArray, DoctorAttJSONArray, InsertStockistJSON.length);
                    }
                    else {
                        var pob_Count = 0;
                        for (var i = 0; i < InsertStockistJSON.length; i++) {
                            if (InsertStockistJSON[i].Action != '1')
                                pob_Count++;
                        }
                        fnRowUpdation(dvcode, doctor[0], prodArrobj, chemArrobj, rcpaArrobj, docAccArrobj, detaprdArrobj, rowpos, fllowJSONArray, DoctorAttJSONArray, pob_Count);
                    }
                    fnGetUserProductsAndSetAutoFill();
                    $('#hdnbindRowNumber').val('');
                    fnClear();

                    if (isRedirecttoStockiest) {
                        fnRedirectTostockiestVisit();
                    }
                    else {
                        if (rowpos != "0") {
                            rowpos++
                            if (parseInt(rowpos) <= parseInt(gridRowNo_g)) {
                                fnFillFormEdit(rowpos)
                            }
                            else {
                                fnClear();
                            }
                        }
                    }
                    //Ignored Order List
                    if (response.IgnoredOrderList != '' && response.IgnoredOrderList != null && response.IgnoredOrderList != undefined) {
                        fnMsgAlert('error', screenTitle, response.IgnoredOrderList);
                    }
                }
                else {
                    fnUnBlockDiv('div_doctorvisit');
                    $('#buttondiv').css('display', '');
                    fnMsgAlert('error', screenTitle, response.Error_Message);
                    return false;
                }
                HideModalPopup('dvLoading');
            },
            error: function (e) {
                $('#buttondiv').css('dispaly', '');
                fnUnBlockDiv('div_doctorvisit');
                fnMsgAlert('error', screenTitle, e.responseText);
                HideModalPopup('dvLoading');
            }
        });
    }
    else {
        $('#buttondiv').css('dispaly', '');
        $('#buttondiv').show();
        fnUnBlockDiv('div_doctorvisit');
        HideModalPopup('dvLoading');
        fnMsgAlert('error', screenTitle, 'You need to enter sample or activity details');

    }
}

function fnSucessCallBack(response) {
    debugger;
}
function fnFailureCallback() {
    debugger;
}
function fnBindNextRow() {
    var rowNo = parseInt($('#hdnbindRowNumber').val()) + 1;
    if (rowNo <= $('#tbl_doctorvisit_list tr').length) {
        fnFillForm(rowNo);
    }
    else {
        fnFillForm("1");
    }
}

function fncancel() {
    if (formMode_g == "Edit") {
        if (confirm('Do you wish to cancel the changes?')) {
            if ($('#hdnbindRowNumber').val().length > 0) {
                if ($('#hdnbindRowNumber').val() != "0") {
                    formMode_g = "";
                    var rowNo = parseInt($('#hdnbindRowNumber').val());
                    fnFillForm(rowNo);
                }
                else {
                    fnClear();
                }
            }
            else {
                fnFillForm('default');
            }
        }
    }
}

function fnClear() {
    debugger;
    $("#surveylink").hide();
    $("#surveyviewlink").hide();
    $('#hdnbindRowNumber').val("0");
    $('#hdnDoctorVisitCode').val("");
    $('#hdnIsCPDoc').val("");
    $('#txtDocName').val("");
    $('#txtDocName').attr('disabled', false);
    $('#hdnDocName').val("");
    $('#txtDocPOB').val("");
    $('#txtDocSpeciality').val("");
    $('#txtDocSpeciality').attr('disabled', false);
    $('#timepicker').attr('disabled', false);
    $('#timepicker').val("");
    $('#txtDocRemarks').val("");
    $('#hdnRecord_Status').val("1");
    $('#hdnDoc_EntryMode').val("");
    $('#hdnsoe').val("");
    $('#hdnlat').val("");
    $('#hdnlon').val("");
    $('#hdnloc').val("");
    $('#hdnedt').val("");
    $("#txtcomp_").val('');
    $("#txtprod_").val('');
    $("#selcomp_").val('');
    $("#selprod_").val('');
    $("#value").val('');
    $("#probability").val('');
    $("#Remarks").val('');
    $("#SampleMandatory").prop("checked", false);
    $("#DetailedMandatory").prop("checked", false);
    $("#chemistMandatory").prop("checked", false);
    $("#RcpaMandatory").prop("checked", false);
    $('#POBMandatory').prop("checked", false);
    //if (flag_g == "F" && ChemistsPrivilege != "CHEMIST_DAY") {
    //    if ($("#SampleMandatory").prop("checked") == false) {
    //        $("#SAMPLES").show();
    //    }
    //    if ($("#DetailedMandatory").prop("checked") == false) {
    //        $("#DETAILING").show();
    //    }
    //    if ($("#chemistMandatory").prop("checked") == false) {
    //        $("#DVChemistBlock").show();
    //    }
    //    if ($("#RcpaMandatory").prop("checked") == false) {
    //        var len = $('#tbl_chemist tr.rcpaheader').length;
    //        if (len > 0) {
    //            for (var i = 1; i <= len; i++) {
    //                $("#divRCPA" + i).hide();
    //            }
    //        }
    //    }
    //}
    fnDeleteRows();
    //fnAddAccompanist(null, 'txtAccName_1');
    fnAddProductRow(null, 'txtprod1');
    fnAddDetailedProductsRow(null, 'txtDetailedprod_1');
    fnAddChemistRow(null, 'txtchem1');
    fnAddFollowUp(null, 'txt_Follow_taskName_1');
    fnAddActivityRow(null);
    fnAddMCActivityRow(null);
    fnAddStockist(null, 'txt_Stockist_Name__1');
    //fnSetAccDivCollapse();
    //fnSetDetDivCollapse();
    fnhighlightRowColor("-1");
    formMode_g = "";
    fnPerfillCallObjectiveAndBusinessStatus();
    $("#ddlMC").val('0');
    $("#ddlDBStatus").val('0');
    $("#ddlcallObjetive").val('0');
    $('#hdnspecname').val("");
    $("#divBusinessHeader").hide();
    productAutoFill_g = eval('(' + productAutoFillOri_g + ')');
    if (dcrDoctorVisitTimeEntryModeValue_g.toUpperCase() == "SERVER_TIME") {
        $('#timepicker').css('display', 'none');
        fnSetServerTime();
    }
    fnBindAccName();
    fnDiasbleAccName();
    GetAccompanistmandatoryvalue();

    //Hide Chemist visit
    $("#frm1").show();
    if (doc_Visit_Controls_g.indexOf(pob_privilege_name) < 0)
        $("#POB").hide();
    $("#div_Chevisit_form").hide();
    $("#div_Hospitalvisit_form").hide();
    $("#div_doctorvisit_form").show();

}

function fnInsertCPDoctors() {
    debugger;
    if (file_Uploading_Status == "NO") {
        if (formMode_g == "Edit") {
            if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
                fnInsertDoctorVisitData(true);
            }
        }
        else {
            //fnInsertDoctorVisitData(true);
            fnRedirectTostockiestVisit();
            HideModalPopup('dvLoading');
        }
    }
    else {
        fnMsgAlert('info', "File Upload", 'Please wait.. file is uploading...');
    }
}


//No Need to check
function fnDrAccMandatory() {
    var accMand = true;

    //$.ajax({
    //    type: 'POST',
    //    url: '../HiDoctor_Activity/DCRV4DoctorVisit/GetDrAccMandatory',
    //    data: 'DCR_Date=' + dcrActualDate_g,
    //    async: false,
    //    success: function (result) {

    //        if (result != "No") {
    //            fnMsgAlert('info', docAccAlertTitle, result);
    //            accMand = false;
    //        }
    //    }
    //});
    return accMand;
}

function fnhighlightRowColor(index) {
    for (var i = 0; i < $('#tbl_doctorvisit_list tr').length; i++) {
        var rowIndex = i + 1;
        if (rowIndex == index) {
            // $('#rowSelected_' + index).css('display', '');
            $('#doc_List_' + index).addClass('grdRowSelected');
            $('#grdSelectArrow_' + rowIndex).css('display', '');

        }
        else {
            //$('#rowSelected_' + index).css('display', 'none');
            $('#doc_List_' + rowIndex).removeClass('grdRowSelected');
            $('#grdSelectArrow_' + rowIndex).css('display', 'none');
        }
    }
}


function fnRedirectToHeader() {
    fnGoToHeader()
}

function fnGoToHeader() {
    if (RCPA_g == "N") {
        $('#main').load('../HiDoctor_Activity/DCRV4Header/Index/?dcrDate=' + dcrDate + '&dcrStatus=' + status_g + '&isrcpa=N&source=TAB_DOCTOR&flag=' + flag_g);
    }
    if (RCPA_g == "R") {
        $('#main').load('../HiDoctor_Activity/DCRV4Header/Index/?dcrDate=' + dcrDate + '&dcrStatus=' + status_g + '&isrcpa=Y&source=TAB_DOCTOR&flag=' + flag_g);
    }
}

function fnSetFormMode(event) {

    if (event != null && event.target != null && event.target.value == "Reset") {
        return true;
    }
    else {
        if (event.target.id != 'btnInsertCP')
            formMode_g = "Edit";
    }
}

function fnCheckQuantity() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/CheckQuantity',
        data: 'dcrActualDate=' + dcrActualDate_g,
        success: function (response) {
            // we have the response
            var result = response;
            if (result == "0") {
                //var rcpaValue = RCPA_g.toUpperCase() == "R" ? "Y" : "N";
                $('#main').load('../DCRStockiestExpense/Create/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + status_g + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + '&accRegions=' + escape(queryString_g.split('&')[0]) + "&flag=" + flag_g);
                HideModalPopup('dvLoading');
            }
            else {
                var dvcode = result.split('^')[0];
                var product = result.split('^')[1];
                if ($('#tbl_doctorvisit_list tr').length > 0) {
                    var tableLength = $('#tbl_doctorvisit_list tr').length;
                    for (var i = 1; i <= tableLength; i++) {
                        if ($('#spnDVCode_' + i).html() == dvcode) {
                            $.msgbox("The Product " + product + " quantity exceeded for " + DoctorHeader_g + " " + $('#spnDocName_' + i).html());
                            //alert("The Product " + product + " quantity exceeded for doctor " + $('#spnDocName_' + i).html());
                            break;
                        }
                    }
                }

            }
        },
        error: function (e) {
            $.msgbox("Product quantity check failed.");
            HideModalPopup('dvLoading');
            //fnMsgAlert('error', 'Error', 'Redirection Failed.');
        }
    });
}

function fnCheckMandatoryFields(rowNum) {
    debugger;
    // Check Doctor Entry Mode.
    // doctor name and speciality name.
    var doctorJSON = eval('(' + $('#hdnDoctorJson_' + rowNum).val() + ')');
    var productJSON = eval('(' + $('#hdnSampleJson_' + rowNum).val() + ')');
    var chemistJSON = eval('(' + $('#hdnChemistJson_' + rowNum).val() + ')');
    var rcpaJSON = eval('(' + $('#hdnRCPAJson' + rowNum).val() + ')');
    if (doctorEntryMode_g.toUpperCase() == 'YES') {
        var doc_codeJSON = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + doctorJSON.Doctor_Code + "')]");
        if (doc_codeJSON.toString() == "false" || doc_codeJSON.length == 0) {
            $.msgbox(' The ' + DoctorHeader_g + '' + $('#spnDocName_' + rowNum).html() + ' is invalid.');
            return false;
        }
    }
    // Visit Time or Visit Mode.
    if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
        if (doctorJSON.Doctor_Visit_Time == null || doctorJSON.Doctor_Visit_Time.length == 0) {
            $.msgbox('please enter the visit time for the ' + DoctorHeader_g + '' + $('#spnDocName_' + rowNum).html() + '.');
            return false;
        }
    }
    if (inputs_mandatory_number_g > 0) {
        if (productJSON.length == null) {
            $.msgbox('You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items for the ' + DoctorHeader_g + ' ' + $('#spnDocName_' + rowNum).html() + '.');
            return false;
        }
        if (inputs_mandatory_number_g > productJSON.length) {
            $.msgbox('You need to enter minimum of ' + inputs_mandatory_number_g + ' Sample/Promotional items for the ' + DoctorHeader_g + ' ' + $('#spnDocName_' + rowNum).html() + '.');
            //fnMsgAlert('error', 'Error', ' You need to enter minimum of ' + inputs_mandatory_number_g + ' inputs.');
            return false;
        }

    }


    if ($("#chemistMandatory").prop("checked") == false) {
        if (chemists_mandatory_number_g > 0) {
            if (chemistJSON.length == null) {
                $.msgbox('You need to enter minimum of ' + chemists_mandatory_number_g + ' ' + chemistName + ' for the ' + DoctorHeader_g + ' ' + $('#spnDocName_' + rowNum).html() + '.');
                return false;
            }
            if (chemists_mandatory_number_g > chemistJSON.length) {
                $.msgbox('You need to enter minimum of ' + chemists_mandatory_number_g + ' ' + chemistName + ' for the ' + DoctorHeader_g + ' ' + $('#spnDocName_' + rowNum).html() + '.');
                //fnMsgAlert('error', 'Error', 'You need to enter minimum of ' + chemists_mandatory_number_g + ' chemists.');
                // alert("You should be entered the " + chemists_mandatory_number_g + ' chemists.');
                return false;
            }
        }
    }


    // RCPA Mandatoty Check.
    if (RCPA_g.toUpperCase() == "R" && ($("#RcpaMandatory").prop("checked") == false) && $("#chemistMandatory").prop("checked") == false) {
        if (RCPA_g.toUpperCase() == "R") {
            if (rcpaJSON.length == null || rcpaJSON.length == 0) {
                var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
                if (rcpaMandatory.length > 0) {
                    var rcapCategoryArray = rcpaMandatory.split(',');
                    var doctorCategory = jsonPath(doctorAutoFill_g, "$.[?(@.value=='" + doctorJSON.Doctor_Code + "')]");
                    if (doctorCategory && doctorCategory[0].Category != null) {
                        if ($.inArray(doctorCategory[0].Category, rcapCategoryArray) > -1) {
                            $.msgbox("For " + $('#spnDocName_' + rowNum).html() + "(" + rcpaMandatory + ")" + " " + DoctorHeader_g + ", you need to enter minimum of one RCPA entry.");
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function fnRedirectTostockiestVisit() {
    debugger;
    if (flag_g == "F") {
        var isThereAnyOneDoctorSaved = false;
        var error_msg = DoctorHeader_g;

        var InDoctorVisit = true;
        //if no doctor- Dont Check
        for (rdindex = 1; rdindex <= gridRowNo_g; rdindex++) {
            if ($('#hdnDocRecordStatus_' + rdindex).val() == '3' && $('#spnDVCode_' + rdindex).html().length > 0) {
                isThereAnyOneDoctorSaved = true;
                InDoctorVisit = GetAccompanistMandatoryInDoctorVisit();
                break;
            }
        }

        if (InDoctorVisit) {
            //Chemist visit validation
            var CV_Acc_Mandatory = true;
            var CV_RCPA_mandatory = true;
            if (ChemistsPrivilege == ChemistsPrivilege_Value) {
                //Any one doctor saved in doc visit. Then only we want to check
                if (isThereAnyOneDoctorSaved)
                    CV_RCPA_mandatory = ChemistRCPA.fnCheckRCPA();
                if (CV_RCPA_mandatory) {
                    error_msg = error_msg + " / " + ChemistVisit.defaults.Chemist_Caption;
                    for (var rowIndex = 0; rowIndex < $('#tbl_Chemistvisit_list tr').length; rowIndex++) {
                        var rowNum = rowIndex + 1;
                        if ($("#tbl_Chemistvisit_list tr:nth-child(" + rowNum + ")").attr('style') != 'display: none;') {
                            if (ACCOMPANIST.toUpperCase() == "ACCOMPANIST") {
                                CV_Acc_Mandatory = AccomplishmentDetails.GetAccompanistMandatoryInDoctorVisit();
                            }
                            isThereAnyOneDoctorSaved = true;
                            break;
                        }
                    }
                }
            }
            debugger;
            if (CV_Acc_Mandatory && CV_RCPA_mandatory) {
                if (fnDrAccMandatory()) {
                    for (rindex = 1; rindex <= gridRowNo_g; rindex++) {
                        if ($('#hdnDocRecordStatus_' + rindex).val() == '1' && $('#hdndocModeofEntry_' + rindex).val() == "A") {
                            fnMsgAlert('info', screenTitle, "Please save the " + DoctorHeader_g + " " + $('#spnDocName_' + rindex).html() + ". Because this is A type " + DoctorHeader_g + ".");
                            return false;
                        }
                    }
                    if (!isThereAnyOneDoctorSaved) {
                        fnMsgAlert('info', screenTitle, "Please enter and save atleast one " + error_msg + ".")
                        return false;
                    }
                    // }
                    $.unblockUI();
                    $('#main').load('../HiDoctor_Activity/DCRV4StockiestExpense/Index/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + status_g + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + '&accRegions=' + escape(queryString_g.split('&')[0]) + "&flag=" + flag_g + '&cpCode=' + escape(queryString_g.split('&')[1]) + '&tpCode=' + escape(queryString_g.split('&')[2]));
                    //fnCheckQuantity();
                }
            }
            else {
                $.unblockUI();
                //Hide Chemist block screen
            }
        }
        else {
            $.unblockUI();
            //Hide Chemist block screen
        }
    }
    else if (flag_g == "A") {
        var isThereAnyOneDoctorSavedA = false;
        var error_msg = DoctorHeader_g;

        var InDoctorVisit = true;
        //if no doctor- Dont Check
        if ($(".grdRow").length > 0 || $("#tbl_hospitalvisit_list tbody tr").length > 0 || $("#txtDocName").val() != "") {
            isThereAnyOneDoctorSavedA = true;
        }

        if (isThereAnyOneDoctorSavedA == false) {
            fnMsgAlert('info', screenTitle, "Please enter and save atleast one doctor or hospital.")
            return false;
        }
        else {
            //$('#prog-bar').css('display', '');
            //$('#prog-bar-att').css('display', 'none');
            $.unblockUI();
            $('#main').load('../HiDoctor_Activity/DCRV4StockiestExpense/Index/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + status_g + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + '&accRegions=' + escape(queryString_g.split('&')[0]) + "&flag=" + flag_g + "&actvity=" + escape(At_actvity) + '&cpCode=' + escape(queryString_g.split('&')[1]) + '&tpCode=' + escape(queryString_g.split('&')[2]) + '&isThereAnyOneDoctorSavedA=' + isThereAnyOneDoctorSavedA);
        }

    }
    else {
        dcrActualDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
        $('#main').load('../HiDoctor_Activity/DCRV4StockiestExpense/Index/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + dcrStatus + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + "&flag=" + flag_g + "&actvity=" + escape(actvity_att.slice(0, -1) + '&isThereAnyOneDoctorSavedA=' + isThereAnyOneDoctorSavedA));
    }
}

function fnTableShowHide(tableid, spnid) {
    if ($('#' + tableid).css("display") == "none") {
        $('#' + tableid).fadeIn('slow');
        $('#' + spnid).removeClass('expand');
        $('#' + spnid).addClass('collapse');
    }
    else {
        $('#' + tableid).fadeOut('slow');
        $('#' + spnid).removeClass('collapse');
        $('#' + spnid).addClass('expand');
    }
}


function fnGetCompetitors(obj) {
    debugger;
    var saleProductCode = $('#' + obj.id.replace('txt', 'hdn')).val();
    var tblObj = $('#' + obj.id.replace('txt', 'tbl'))
    var indexArray = tblObj[0].id.split('_');
    var cheindex = indexArray[2];
    var rcpaindex = indexArray[3];

    $('#txtchem_prodQty_' + cheindex + '_' + rcpaindex).val('');
    for (var i = 1; i < tblObj[0].rows.length; i++) {
        $('#txtchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).unautocomplete();
        $('#txtchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
        $('#hdnchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
        $('#txtchem_prod_compQty_' + cheindex + '_' + rcpaindex + '_' + i).val('');
    }
    var lst = $.grep(compAutoFill_g[0], function (v) {
        return v.Product_Code == saleProductCode && v.Record_Status == 1;
    });
    if (lst != null && lst.length > 0) {
        autoComplete(lst, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
    }
        //var objComp = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + saleProductCode + "')]");
        //if (!objComp) {
        //    debugger;
        //    $.ajax({
        //        type: 'POST',
        //        url: '../HiDoctor_Activity/DCRDoctorVisit/GetCompetitorsName',
        //        data: 'saleproductcode=' + saleProductCode + '^' + '&dcrActualDate=' + dcrActualDate_g,
        //        success: function (response) {
        //            compAutoFill_g = [];
        //            // we have the response
        //            compAutoFill_g.push(response);
        //            res_g = response;
        //            autoComplete(response, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
        //        },
        //        error: function (e) {
        //            //$.msgbox();
        //            fnMsgAlert('error', screenTitle, 'Retrieve the Competitor failed.');
        //        }
        //    });
        //}
    else {
        var cheindex = indexArray[2];
        var rcpaindex = indexArray[3];
        autoComplete(lst, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
    }
}

function fnGetCompetitorsFromSales(obj) {
    debugger;
    $.blockUI();
    obj = obj.id.split('_')[0] + '_' + obj.id.split('_')[1] + '_' + obj.id.split('_')[3] + '_' + obj.id.split('_')[4];
    obj = obj.replace('txt', 'hdn');
    var saleProductCode = $('#' + obj.replace('txt', 'hdn')).val();
    var tblObj = $('#' + obj.replace('txt', 'tbl'))
    var indexArray = tblObj[0].id.split('_');
    var cheindex = indexArray[2];
    var rcpaindex = indexArray[3];

    //for (var i = 1; i < tblObj[0].rows.length; i++) {
    //    $('#txtchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).unautocomplete();
    //    $('#txtchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
    //    $('#hdnchem_prod_comp_' + cheindex + '_' + rcpaindex + '_' + i).val('');
    //}
    var lst = $.grep(compAutoFill_g[0], function (v) {
        return v.Product_Code == saleProductCode;
    });
    //var objComp = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + saleProductCode + "')]");
    if (lst != null && lst.length > 0) {
        autoComplete(lst, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
    }
        //if (!objComp) {
        //    debugger;
        //    $.ajax({
        //        type: 'POST',
        //        url: '../HiDoctor_Activity/DCRDoctorVisit/GetCompetitorsName',
        //        data: 'saleproductcode=' + saleProductCode + '^' + '&dcrActualDate=' + dcrActualDate_g,
        //        success: function (response) {
        //            compAutoFill_g = [];
        //            // we have the response
        //            compAutoFill_g.push(response);
        //            res_g = response;

        //            autoComplete(response, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);

        //        },
        //        error: function (e) {
        //            //$.msgbox();

        //            fnMsgAlert('error', screenTitle, 'Retrieve the Competitor failed.');
        //        }
        //    });
        //}
    else {
        var cheindex = indexArray[2];
        var rcpaindex = indexArray[3];
        autoComplete(lst, 'txtchem_prod_comp_', 'hdnchem_prod_comp_', 'autoComp_' + cheindex + '_' + rcpaindex);
    }
    $.unblockUI();
}

function fnValidateComp(ctl) {
    debugger;
    var compIdArr = ctl.id.split('_');
    var cheindex = compIdArr[3];
    var rcpaindex = compIdArr[4];
    //fnGetCompetitorsFromSales(compIdArr[0] + '_' + compIdArr[1] + '_' + compIdArr[3] + '_' + compIdArr[4]);
    if (ctl.value != '') {
        // var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
        var compautoFill = jsonPath(compAutoFill_g, "$.[?(@.Product_Code=='" + $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val() + "' & @.label=='" + ctl.value + "')]");
        if (compautoFill) {
            $('#' + ctl.id.replace('txt', 'hdn')).val(compautoFill[0].value);
            //ctl.id.replace('txt', 'hdn').value = compautoFill[0].value;
        }
        else {
            var pc = $('#hdnchem_prod_' + compIdArr[3] + '_' + compIdArr[4]).val();
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
}

function fnSetServerTime() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/DCRDoctorVisit/GetServerTime',
        success: function (response) {
            // we have the response
            if (doctotVisitTime_g.toUpperCase() == "VISIT_TIME" || doctotVisitTime_g.toUpperCase() == "VISIT_TIME_MANDATORY") {
                $('#lbltimepicker').html(response);
                var mode = response.split(' ')[1];
                $('#lblvisitmode').html(mode);
            }
            else {
                var mode = response.split(' ')[1];
                $('#lblvisitmode').html(mode);
                $('#lbltimepicker').html(response);
            }
        },
        error: function (e) {
        }
    });
}
function fnBlockDiv(divid, message) {
    $('#' + divid).block({
        message: message,
        css: {
            border: '3px solid #89C33F', padding: '7px'
        }
    });
}

function fnUnBlockDiv(divid) {
    $('#' + divid).unblock();
}

function fnSetOnlyForDocDisabled(obj) {

}

function fnSetOnlyForDoc(obj) {
    try {
        if (obj != null && $('#' + obj.id).val().length > 0 && $('#' + obj.id).val().indexOf(',') > -1 && $('#' + obj.id).val().indexOf('(') > -1) {
            var index = obj.id.split('_')[1];
            if (docdetails_g != null && docdetails_g.length > 4) {
                $('#chkindependentcall_' + index).attr('disabled', false);
                var accdata = jsonPath(docdetails_g[4], "$.[?(@.Doctor_Visit_Code=='" + $('#spnDVCode_' + $('#hdnbindRowNumber').val()).html() + "' )]");
                if (accdata != false) {
                    for (var i = 0; i < accdata.length; i++) {
                        if (accdata[i].Acc_User_Name.toUpperCase() == $('#' + obj.id).val().split(',')[1].split('(')[0].toUpperCase()) {
                            if (accdata[i].Is_Only_For_Doctor == "Y") {
                                $('#chkindependentcall_' + index).attr('checked', 'checked');
                                $('#chkindependentcall_' + index).attr('disabled', 'disabled');
                                $("input[name='Accompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                $("input[name='Accompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                return;
                            }
                        }
                    }
                    if (acc_g != null && acc_g.length > 0) {
                        for (var i = 0; i < acc_g.length; i++) {
                            if (acc_g[i].accName.toUpperCase() == $('#' + obj.id).val().toUpperCase()) {
                                if (acc_g[i].accOnlyDoc == "checked") {
                                    $('#chkindependentcall_' + index).attr('checked', 'checked');
                                    $('#chkindependentcall_' + index).attr('disabled', 'disabled');
                                    $("input[name='Accompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                    $("input[name='Accompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                    return;
                                }
                            }
                        }
                    }

                }
                else {
                    if (acc_g != null && acc_g.length > 0) {
                        for (var i = 0; i < acc_g.length; i++) {
                            if (acc_g[i].accName.toUpperCase() == $('#' + obj.id).val().toUpperCase()) {
                                if (acc_g[i].accOnlyDoc == "checked") {
                                    $('#chkindependentcall_' + index).attr('checked', 'checked');
                                    $('#chkindependentcall_' + index).attr('disabled', 'disabled');
                                    $("input[name='Accompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                    $("input[name='Accompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                    return;
                                }
                            }
                        }
                    }
                }
                $('#chkindependentcall_' + index).attr('checked', false);
                $('#chkindependentcall_' + index).attr('disabled', 'disabled');
                $("input[name='Accompaniedcall_" + index + "'][value='NO']").attr('checked', false);
            }
            else {
                if (acc_g != null && acc_g.length > 0) {
                    for (var i = 0; i < acc_g.length; i++) {
                        if (acc_g[i].accName.toUpperCase() == $('#' + obj.id).val().toUpperCase()) {
                            if (acc_g[i].accOnlyDoc == "checked") {
                                $('#chkindependentcall_' + index).attr('checked', 'checked');
                                $('#chkindependentcall_' + index).attr('disabled', 'disabled');
                                $("input[name='Accompaniedcall_" + index + "'][value='NO']").attr('checked', 'checked');
                                $("input[name='Accompaniedcall_" + index + "']").attr('disabled', 'disabled');
                                return;
                            }
                        }
                    }
                }
            }

        }
    }
    catch (e) {
        alert("fnSetOnlyForDoc()" + e.message);
    }
}

function fnSetSpeciality(spec) {
    var doctobj = jsonPath(doctorAutoFill_g, "$.[?(@.label=='" + $('#txtDocName').val().trim() + "')]");
    if (doctobj != null && doctobj != false) {
        $('#txtDocSpeciality').val(doctobj[0].Speciality_Name);
        $('#hdnspecname').val(doctobj[0].Speciality_Code);
        $('#txtDocSpeciality').attr('disabled', 'disabled');
        $('#txtDocSpeciality').css('backgroundColor', '#f0f0f0');
    }
    else {
        if (spec != null && spec.length > 0) {
            $('#txtDocSpeciality').val(spec);
            var specialityCode = jsonPath(specialityAutoFill_g, "$.[?(@.label=='" + spec + "')]");
            $('#hdnspecname').val(specialityCode);
            $('#txtDocSpeciality')[0].removeAttribute('disabled')
            $('#txtDocSpeciality').css('backgroundColor', '#fff');
        }
        else {
            $('#txtDocSpeciality').val("");
            $('#hdnspecname').val("");
            $('#txtDocSpeciality')[0].removeAttribute('disabled')
            $('#txtDocSpeciality').css('backgroundColor', '#fff');
        }
    }
}
function fnSetAccDivCollapse() {
    $('#tbl_DoctorAccDetails').fadeOut('slow');
    $('#spnAccDetails').removeClass('collapse');
    $('#spnAccDetails').addClass('expand');
}

function fnSetAccDivExpand() {
    $('#tbl_DoctorAccDetails').fadeIn('slow');
    $('#spnAccDetails').removeClass('expand');
    $('#spnAccDetails').addClass('collapse');
}

function fnSetDetDivCollapse() {
    $('#tbl_DetailedProducts').fadeOut('slow');
    $('#spndetailedproducts').removeClass('collapse');
    $('#spndetailedproducts').addClass('expand');
}

function fnSetDetDivExpand() {
    $('#tbl_DetailedProducts').fadeIn('slow');
    $('#spndetailedproducts').removeClass('expand');
    $('#spndetailedproducts').addClass('collapse');
}

function fnValidateDoctor(obj) {
    debugger;
    $("#divSurvey").hide();
    $("#surveylink").hide();
    fnValidateAutofill(obj, doctorAutoFill_g, "txtDocName", "hdnDocName");
    fnSetSpeciality(true);
    fnGetDoctorandCustomerSalesProducts(obj);
    GeMCDetails('0');
    //fnGetCMECampaigns('0');
    fnGetDoctorBusinessStatus();
    fnGetMCDetailsforDropdown();
    //GetAllSaleProductsForDetailsWithColor();
    //fnSetDoctorCoustomerLineofBusiness('doctor');
}
function fnValidateDetailedProd(obj) {
    debugger;
    var id = obj.id.split('_')[1];
    fnValidateAutofill(obj, detailedProductsAutoFill_g, "txtproductDetailed_", "hdnproductDetailed_");
    if ($("#divBusineesStatus_" + id).val() != undefined) {
        var single_pro = $.grep(Product_BusinessStatus, function (element, index) {
            return element.Sale_Product_Code == $("#hdnproductDetailed_" + id).val();
        });
        if (single_pro.length > 0) {
            $("#ddlBusineesStatus_" + id).val(single_pro[0].Business_Status_ID);
            $("#txtBusinessPotential_" + id).val(single_pro[0].BusinessPotential);
        }
    }
    if ($("#txtproductDetailed_" + id).val() != '') {
        $("#compadd" + id).show();
    }
    //else{
    //     $("#compadd").hide();
    // }
}
//Newly added for restrict the special characters in DCR and it's related approval Remarks field
function fnCheckRemarksSpecialCharforDCRDoctor(id) {
    if ($(id).val() != "") {
        var specialCharregexfordcr = new RegExp(/^[a-zA-Z0-9-_.?,;:&*()[\] ]+$/);
        if (!specialCharregexfordcr.test($(id).val())) {
            fnMsgAlert('info', docAlertTitle, 'Please Remove the following special characters ' + restrictedSpecialchar_g + '');
            fnErrorIndicator(id);
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true
}

function fnCheckDoctorNameSpecialCharacters(id) {
    if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup0($(id))) {
        fnMsgAlert('info', docAlertTitle, 'Please remove the special characters in ' + DoctorHeader_g + ' Name. <br/> The following characters are only allowed <b>-.|</b>.');
        return false;
    }
    else {
        return true;
    }

    //var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._|]+$");
    //if ($.trim($(id).val()).length > 0) {
    //    if (!specialCharregex.test($(id).val())) {
    //        fnMsgAlert('info', 'Information', 'Please remove the special characters.');
    //        $(id).val('');
    //        fnErrorIndicator(id);
    //        return false;
    //    }
    //}
    //else {
    //    return true;
    //}
    //fnRemoveErrorIndicatior(id);
}

function fncheckColorPrivelegeForDetailedProdcutsPopup() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Activity/DCRV4DoctorVisit/checkColorPrivelegeForDetailedProdcutsPopup',
        type: "GET",
        //data: "usertypename=" + usertypecode,
        async: false,
        success: function (result) {
            debugger;
            objColorPrivilege = result;
        },
        error: function (result) {
            debugger;
        }
    });
}

function fnShowDetailedProductsPopup() {
    debugger;
    var i = 0;
    var selectedProducts = fnGetSelectedDetailedProducts();

    if (selectedProducts) {
        GetAllSaleProductsForDetailsWithColor();
        debugger;
        $("#dvAllPro").html("");
        var detailedProductsTable = "";
        var selectedProductsString = "";

        fncheckColorPrivelegeForDetailedProdcutsPopup();
        debugger;
        if (detailedProductsAutoFill_g.length > 0) {
            detailedProductsTable += "<table><tbody>";
            for (i = 0; i < detailedProductsAutoFill_g.length; i++) {
                var isSelectedProduct = false;
                var mode_of_Entry = "";
                var business_StatusId = "";
                var remark = "";
                var businessPotential = "";
                if (selectedProducts.length > 0) {
                    var j = 0;
                    for (j = 0; j < selectedProducts.length; j++) {
                        if (detailedProductsAutoFill_g[i].value == selectedProducts[j].Sale_Product_Code) {
                            selectedProductsString += "<div>" + selectedProducts[j].Sale_Product_Name + "</div>";
                            mode_of_Entry = selectedProducts[j].Mode_Of_Entry;
                            business_StatusId = selectedProducts[j].Business_Status_ID;
                            remark = selectedProducts[j].Remark;
                            businessPotential = selectedProducts[j].BusinessPotential;
                            isSelectedProduct = true;
                            break;
                        }
                    }
                }
                var productRowColor = "";
                var ProductMappingType = "";
                ProductMappingType = detailedProductsAutoFill_g[i].ProductMappingType;
                if (objColorPrivilege.length > 0) {
                    if (objColorPrivilege[0].Privilege_Name == "SHOW_DETAILED_PRODUCTS_WITH_TAGS") {
                        if (objColorPrivilege[0].Privilege_Value_Name == "YES") {
                            $('#color_Details').show();
                            if (ProductMappingType == "1-MC")
                                productRowColor = "background-color: #f47b7b;";
                            else if (ProductMappingType == "2-T")
                                productRowColor = "background-color: #8bc59c;";
                            else if (ProductMappingType == "3-D")
                                productRowColor = "background-color: #bab8e3;";
                        }
                        else if (objColorPrivilege[0].Privilege_Value_Name == "NO") {
                            if (ProductMappingType == "1-MC")
                                productRowColor = "background-color: none";
                            else if (ProductMappingType == "2-T")
                                productRowColor = "background-color: none";
                            else if (ProductMappingType == "3-D")
                                productRowColor = "background-color: none";
                        }
                    }
                }
                else {
                    $('#color_Details').show();
                    if (ProductMappingType == "1-MC")
                        productRowColor = "background-color: #f47b7b;";
                    else if (ProductMappingType == "2-T")
                        productRowColor = "background-color: #8bc59c;";
                    else if (ProductMappingType == "3-D")
                        productRowColor = "background-color: #bab8e3;";
                }
                //if (ProductMappingType == "1-MC")
                //    productRowColor = "background-color: #f47b7b;";
                //else if (ProductMappingType == "2-T")
                //    productRowColor = "background-color: #8bc59c;";
                //else if (ProductMappingType == "3-D")
                //    productRowColor = "background-color: #bab8e3;";
                detailedProductsTable += "<tr style='" + productRowColor + "'><td>" + detailedProductsAutoFill_g[i].label + "</td>";
                // var disabled = mode_of_Entry == null ? "" : mode_of_Entry.length == 0 ? "" : mode_of_Entry == "A" ? "disabled=true" : "";

                if (isSelectedProduct) {
                    detailedProductsTable += "<td><input type='checkbox' class='cls_detPrdcheckbox' onclick='fnSetSelectedProductString(this)' checked='checked' data-modeentry='" + mode_of_Entry + "' data-pname='" + detailedProductsAutoFill_g[i].label + "' data-BPotential='" + businessPotential + "' data-BStatus='" + business_StatusId + "' data-Remark='" + remark + "' value='" + detailedProductsAutoFill_g[i].value + "'  /></td></tr>";
                }
                else {
                    detailedProductsTable += "<td><input type='checkbox'  class='cls_detPrdcheckbox' onclick='fnSetSelectedProductString(this)' data-pname='" + detailedProductsAutoFill_g[i].label + "' data-BStatus='0' value='" + detailedProductsAutoFill_g[i].value + "'  /></td></tr>";
                }
            }
            detailedProductsTable += "</tbody></table>";

            $(".cls_selectedProdList").html("<div style='max-height: 50px;overflow-y: auto;'>" + selectedProductsString + "</div>");
            $("#dvAllPro").html(detailedProductsTable);
        }
        else {
            $("#dvAllPro").html('No Date Found');
        }
        var selctedobjects = $('#dvAllPro input[type="checkbox"]:checked');
        var i = 0;
        for (i = 0; i < selctedobjects.length; i++) {
            var mode = $(selctedobjects[i]).attr("data-modeentry");
            if (mode == "A") {
                $(selctedobjects[i]).attr("disabled", true);
            }
        }
        $("#dvAllDetailedProduct").show();
        $("#dvAllDetailedProduct").overlay().load();
    } else {
        //alert(1);
        //fnTableShowHide('tbl_DetailedProducts', 'spndetailedproducts');
    }
}
function fnGetSelectedDetailedProducts() {
    var detProdJsonArray = new Array();
    var productCodeArray = new Array();
    for (var detprindex = 0; detprindex < detailedRowIndex_g; detprindex++) {

        var detprdobj = {
        };
        var detprd = "";
        if (detprindex == 0) {
            continue;
        }
        // check the row is exist. if not continue the next row.
        if ($('#DeatailedProdRow' + detprindex).css('display') == 'none') {
            continue;
        }

        if ($.trim($('#txtproductDetailed_' + detprindex).val()).length > 0) {
            det_prd_Name = $('#txtproductDetailed_' + detprindex).val();
            det_prd_code = $('#hdnproductDetailed_' + detprindex).val();

            if (productCodeArray.indexOf(det_prd_code) > -1) {
                fnMsgAlert("info", "DCR - Detailed Products", "The Product Name : <b>" + det_prd_Name + "</b> duplicated in the Detailed Products grid. Once remove the duplicate product then try again. ");
                return false;
            } else {
                productCodeArray.push(det_prd_code);
            }
            detprdobj.Business_Status_ID = $("#ddlBusineesStatus_" + detprindex).val();
            detprdobj.Remark = $("#txtDetailProductRemark_" + detprindex).val();
            detprdobj.BusinessPotential = $("#txtBusinessPotential_" + detprindex).val();
            detprdobj.Sale_Product_Code = det_prd_code;
            detprdobj.Sale_Product_Name = det_prd_Name;
            detprdobj.Mode_Of_Entry = $('#hdnDetEntryMode_' + detprindex).val();

            detProdJsonArray.push(detprdobj);
        }
    }
    return detProdJsonArray;
}

function fnSetSelectedProductString(obj) {

    var selprodlist = "";
    var selctedobjects = $('#dvAllPro input[type="checkbox"]:checked');
    var i = 0;
    for (i = 0; i < selctedobjects.length; i++) {
        selprodlist += "<div>" + $(selctedobjects[i]).attr("data-pname") + "</div>";
    }

    $(".cls_selectedProdList").html("<div style='max-height: 50px;overflow-y: auto;'>" + selprodlist + "</div>");
}

function fnBindDetailedProducts() {
    var tblDetailedProductsRows = $('#tbl_DetailedProducts tr');

    var i = 0;
    for (i = 0; i < tblDetailedProductsRows.length; i++) {
        if (i == 0) {
            continue;
        }
        $(tblDetailedProductsRows[i]).remove();
        detailedRowIndex_g--;
    }
    //fnAddDetailedProductsRow(true, 'txtproductDetailed_' + detpindex);
    var selctedobjects = $('#dvAllPro input[type="checkbox"]:checked');
    var i = 0;
    var rowIndex = 0;
    for (i = 0; i < selctedobjects.length; i++) {
        var selprodname = $(selctedobjects[i]).attr("data-pname");
        var selprodCode = $(selctedobjects[i]).attr("value");
        var selModeOfEntry = $(selctedobjects[i]).attr("data-modeentry");
        var business_StatusId = $(selctedobjects[i]).attr("data-BStatus");
        var remark = $(selctedobjects[i]).attr("data-Remark");
        var businessPotential = $(selctedobjects[i]).attr("data-BPotential");
        rowIndex++;
        fnAddDetailedProductsRow(true, 'txtproductDetailed_' + rowIndex);
        $('#txtproductDetailed_' + rowIndex).val(selprodname);
        $('#hdnproductDetailed_' + rowIndex).val(selprodCode);
        $('#hdnDetEntryMode_' + rowIndex).val(selModeOfEntry);
        $("#txtBusinessPotential_" + rowIndex).val(businessPotential);
        if (selModeOfEntry == "A") {
            $('#txtproductDetailed_' + rowIndex).attr('disabled', 'disabled');
            $('#DetailedprodRemove' + rowIndex).css('display', 'none');
        }
        else {
            $('#txtproductDetailed_' + rowIndex).attr('disabled', false);
            $('#DetailedprodRemove' + rowIndex).css('display', '');
        }
        $("#ddlBusineesStatus_" + rowIndex).val(business_StatusId);
        //if (business_StatusId != 0) {
        $("#txtDetailProductRemark_" + rowIndex).val(remark);
        //$("#divProductRemark_" + rowIndex).show();
        // }
    }

    fnAddDetailedProductsRow(null, 'txtproductDetailed_' + (++rowIndex).toString());
    $("#dvAllDetailedProduct").overlay().close();
    //fnTableShowHide('tbl_DetailedProducts', 'spndetailedproducts');

}

function fnresetAll() {
    var selprodlist = "";
    var selctedobjects = $('#dvAllPro input[type="checkbox"]:checked');
    if (selctedobjects.length > 0) {
        if (confirm("Do you wish to deselect the all selected products ?")) {
            $(".cls_selectedProdList").html("");
            for (i = 0; i < selctedobjects.length; i++) {
                console.log($(selctedobjects[i]).attr("disabled"));
                if ($(selctedobjects[i]).attr("disabled") == null || $(selctedobjects[i]).attr("disabled") == '') {
                    $(selctedobjects[i]).attr("checked", false);
                }
                if ($(selctedobjects[i]).attr("disabled") == "disabled" && $(selctedobjects[i]).attr("checked") == "checked") {
                    selprodlist += $(selctedobjects[i]).attr("data-pname") + ", ";
                }
                $(".cls_selectedProdList").html(selprodlist);
            }
        }
    }
}
function fnBindAccName() {
    for (var i = 1; i <= accAutoFill_g.length; i++) {
        fnAddAccompanist(null, "txtAccName_" + i);
        $("#txtAccName_" + doctorAccRowIndex_g).val(accAutoFill_g[i - 1].label);
        document.getElementById("txtAccName_" + doctorAccRowIndex_g).onblur();
    }
}
function fnBindAccNameInObject(obj) {
    for (var i = 1; i <= obj.length; i++) {
        fnAddAccompanist(null, "txtAccName_" + i);
        $("#txtAccName_" + doctorAccRowIndex_g).val(obj[i - 1].accName);
        document.getElementById("txtAccName_" + doctorAccRowIndex_g).onblur();
    }
}
function fnDiasbleAccName() {
    for (var i = 1; i <= accAutoFill_g.length; i++) {
        $("#txtAccName_" + i).prop('disabled', true);
    }
}
function fnRemoveAttachment(index, current) {
    current.parentNode.parentNode.style.display = "none"
    try {
        DoctorAttJSONArray[index].Status = '0';
    } catch (e) {
    }
    var myDropzone = Dropzone.forElement("#dZUpload");
    myDropzone.options.maxFiles = (myDropzone.options.maxFiles + 1);
}

var StockistAutoFill_g = new Array();
var StockistAuto_master_g = new Array();
var SalesProductsAutoFill_g = new Array();
var LineOfBusiness_g = new Array();
var Doctor_Customer_LOB = "";
var Region_code_g = "";
var AccompanistMandatory_g = "";
var DoctorBusiness_g = new Array();
var DoctorBusinessList_g = new Array();
//
function fnValidateSalesProducts(obj) {
    fnValidateAutofill(obj, SalesProductsAutoFill_g, "txt_SSalesProducts", "hdnSSales_Products");
    var id = obj.id.split('_')
    var txtId = id[2] + "_" + id[3];
    var product_code = $("#hdnSSales_Products_" + txtId).val();
    var SalesProducts = jsonPath(SalesProductsAutoFill_g, "$[?(@.value=='" + product_code + "')]");
    if (SalesProducts.length > 0) {
        $("#txt_SUnit_" + txtId).val(SalesProducts[0].Unit_Rate);
        if ($("#txt_SQty_" + txtId).val().trim() == '')
            $("#txt_SQty_" + txtId).val('0');
        if ($("#txt_SAmount_" + txtId).val() == '')
            $("#txt_SAmount_" + txtId).val('0');
    }
    if ($("#hdnSSales_Products_" + txtId).val() == '') {
        $("#txt_SQty_" + txtId).val('');
        $("#txt_SAmount_" + txtId).val('');
        $("#txt_SUnit_" + txtId).val('');
    }
    //Total Amount Cal
    var qty = $("#txt_SQty_" + txtId).val();
    if (qty != '' && qty != '.') {
        var unit = $("#txt_SUnit_" + txtId).val();
        $("#txt_SAmount_" + txtId).val(fnRound(parseFloat(qty) * parseFloat(unit), 2));
    }
    else
        $("#txt_SAmount_" + txtId).val('0');
    fnSalesProductsTotalAmountCal(obj);
}
//Total Amount Cal
function fnSalesProductsAmountCal(obj, event) {
    debugger;
    var id = obj.id.split('_');
    var txtId = id[2] + "_" + id[3];
    //if (isNumberKey(event)) {
    var qty = obj.value;
    if (qty != '' && qty != '.') {
        var unit = $("#txt_SUnit_" + txtId).val();
        $("#txt_SAmount_" + txtId).val(fnRound(parseFloat(qty) * parseFloat(unit), 2));
    }
    else
        $("#txt_SAmount_" + txtId).val('0');
    //}
    //else {
    //    $("#txt_SUnit_" + txtId).val('0');
    //    $("#txt_SAmount_" + txtId).val('0');
    //    event.preventDefault();
    //}
    fnSalesProductsTotalAmountCal(obj);
}
function fnSalesProductsAmount(obj, event) {
    debugger;
    var id = obj.id.split('_');
    var txtId = id[2] + "_" + id[3];
    //if (isNumberKey(event)) {
    var qty = obj.value;
    if (qty != '' && qty != '.') {
        var unit = $("#txt_SQty_" + txtId).val();
        $("#txt_SAmount_" + txtId).val(fnRound(parseFloat(qty) * parseFloat(unit), 2));
    }
    else
        $("#txt_SAmount_" + txtId).val('0');
    //}
    //else {
    //    $("#txt_SUnit_" + txtId).val('0');
    //    $("#txt_SAmount_" + txtId).val('0');
    //    event.preventDefault();
    //}
    fnSalesProductsAmount(obj);
}
function fnSalesProductsTotalAmountCal(obj) {
    var id = obj.id.split('_')

    var salesProductRowCount = $("#tblSalesProduct_" + id[2]).children().length;

    //For Header
    salesProductRowCount--;
    var totAmount = 0
    var pro_Count = 0;
    for (var i = 0; i < salesProductRowCount; i++) {
        var txtId = id[2] + "_" + i;
        if ($("#proDiv_" + txtId).css("display") != "none") {
            if ($("#hdnSSales_Products_" + txtId).val() != '' && $("#txt_SSalesProducts_" + txtId).val() != '') {
                totAmount += parseFloat($("#txt_SAmount_" + txtId).val());
                pro_Count++;
            }
        }
    }
    $("#lblTotalPOBAmount_" + id[2]).text(fnRound(totAmount, 2));
    $("#lblprodutCount_" + id[2]).text(pro_Count);
}
//Validation
function isNumberKey(evt, element) {
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
}
function fnRound(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
//POB---Get
function fnGetDCRPOBDetailsByVisitCode(customer_Visit_Code) {
    // if ($("#hdnDocName").val().trim() != '') {
    //if ($("input[name='Mode_Of_Form']:checked").val() == "2") {
    var accom_Regioncodes = jsonPath(doctorAutoFill_g, "$[?(@.value=='" + $("#hdnDocName").val().trim() + "')]");
    var Customer_Code = "";
    var Customer_Name = "";
    var Customer_Speciality = "";
    if (accom_Regioncodes != undefined) {
        if (accom_Regioncodes.length > 0) {
            Customer_Code = $("#hdnDocName").val().trim();
            Customer_Region_Code = accom_Regioncodes[0].Doctor_Region_Code;
            Customer_Name = accom_Regioncodes[0].label.split('_')[0];
            Customer_Speciality = accom_Regioncodes[0].Speciality_Name;
        }
        else {
            Customer_Code = "";
            Customer_Region_Code = Region_code_g;
            Customer_Name = $("#txtDocName").val().trim();
            Customer_Speciality = $("#txtDocSpeciality").val().trim();
        }
    }
    else {
        Customer_Code = "";
        Customer_Region_Code = Region_code_g;
        Customer_Name = $("#txtDocName").val().trim();
        Customer_Speciality = $("#txtDocSpeciality").val().trim();
    }
    if (Customer_Name != '') {
        //reset  pob Header
        $("#tbl_POB").html('');
        POBRowIndex_g = 0;
        SalesProductTableIndex = 0;
        $.ajax({
            type: 'POST',
            data: "Order_Date=" + dcrActualDate_g + "&Customer_Code=" + Customer_Code + "&Customer_Region_Code=" + Customer_Region_Code + "&Customer_Name=" + Customer_Name + "&Customer_Speciality=" + Customer_Speciality,
            url: '../DCRV4DoctorVisit/GetDCRPOBDetailsByVisitCode',
            async: false,
            success: function (response) {
                var table = eval('(' + response + ')');
                var dco_Stockist_Name = table.Tables[0].Rows;
                var dco_Sales_Products = table.Tables[1].Rows;
                //var Mode_Of_Form = table.Tables[2].Rows;
                var totaltableRow = dco_Stockist_Name.length * 4;
                var dco_Stockist_count = 0;
                var SalesProductTableID = 1;

                for (var i = 1; i < totaltableRow; i++) {
                    i++;
                    fnAddStockist(true, null);
                    if (dco_Stockist_Name[dco_Stockist_count].Order_Status == "2") {
                        $('#txt_Stockist_Name_' + i).attr("disabled", true);
                        $('#txtStockistdueDate_' + i).attr("disabled", true);
                    }
                    $('#txt_Stockist_Name_' + i).val(dco_Stockist_Name[dco_Stockist_count].Stockist_Name);
                    //$('#txtStockistdueDate_' + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Due_Date);
                    $('#txtStockistdueDate_' + i).val(dco_Stockist_Name[dco_Stockist_count].Due_Date);
                    $("#hdnStockist_Code_" + i).val(dco_Stockist_Name[dco_Stockist_count].Stockiest_Code);
                    //Stockist.Stockist_Region_Code = "";
                    // Stockist.Customer_Code = $("#hdnDocName").val().trim();
                    //Stockist.Customer_Region_Code = accom_Regioncodes[0].Doctor_Region_Code;


                    $("#hdnOrder_Id_" + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Id);
                    $("#hdnOrder_Number_" + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Number);
                    $("#hdnOrder_Status_" + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Status);


                    var Total_Qty = 0;
                    var Total_POB_Value = 0;
                    var ProductJSON = new Array();
                    ProductJSON = jsonPath(dco_Sales_Products, "$[?(@.Order_Id=='" + dco_Stockist_Name[dco_Stockist_count].Order_Id + "')]");
                    var TotalPOBAmount = 0;
                    for (var k = 0; k < ProductJSON.length; k++) {
                        var Stockist_index = 1;
                        var txtId = SalesProductTableID + "_" + k;
                        if (dco_Stockist_Name[dco_Stockist_count].Order_Status == "2") {
                            $("#txt_SSalesProducts_" + txtId).attr("disabled", true);
                            $("#hdnSSales_Products_" + txtId).attr("disabled", true);
                            $("#txt_SQty_" + txtId).attr("disabled", true);
                            $("#txt_SUnit_" + txtId).attr("disabled", true);
                            $("#txt_SAmount_" + txtId).attr("disabled", true);
                            $("#txtReamrk_" + SalesProductTableID).attr("disabled", true);
                        }
                        $("#txt_SSalesProducts_" + txtId).val(ProductJSON[k].Product_Name);
                        $("#hdnSSales_Products_" + txtId).val(ProductJSON[k].Product_Code);
                        $("#txt_SQty_" + txtId).val(ProductJSON[k].Product_Qty);
                        $("#txt_SUnit_" + txtId).val(ProductJSON[k].Product_Unit_Rate);
                        $("#txt_SAmount_" + txtId).val(ProductJSON[k].Product_Amount);
                        TotalPOBAmount += parseFloat(ProductJSON[k].Product_Amount);
                        //For Draft
                        if (k < (ProductJSON.length - 1))
                            fnAddSalesProduct(true, (k + 1), SalesProductTableID, null)
                        else {
                            if (dco_Stockist_Name[dco_Stockist_count].Order_Status != "2")
                                fnAddSalesProduct(false, (k + 1), SalesProductTableID, null)
                        }
                    }
                    $("#txtReamrk_" + SalesProductTableID).val(dco_Stockist_Name[dco_Stockist_count].Remarks);

                    $("#lblprodutCount_" + SalesProductTableID).text((ProductJSON.length));
                    $("#lblTotalPOBAmount_" + SalesProductTableID).text(fnRound(TotalPOBAmount, 2));


                    i = i + 2;
                    SalesProductTableID++;
                    dco_Stockist_count++;
                }
            }
        });
        //create Empty Row
        fnAddStockist(false, null);
    }
    //}
}


//Find Doctor_customer Line of Business
function fnSetDoctorCoustomerLineofBusiness(reqFrom) {
    var accom_Regioncodes = "";
    var acc_region_lob = "";
    if (reqFrom == 'doctor') {
        accom_Regioncodes = jsonPath(doctorAutoFill_g, "$[?(@.value=='" + $("#hdnDocName").val().trim() + "')]");
        if (accom_Regioncodes.length > 0) {
            acc_region_lob = jsonPath(LineOfBusiness_g, "$[?(@.Entity_Code=='" + accom_Regioncodes[0].Doctor_Region_Code + "')]");
        }
        else {
            acc_region_lob = jsonPath(LineOfBusiness_g, "$[?(@.Entity_Code=='" + Region_code_g + "')]");
        }
    }
    else {
        acc_region_lob = jsonPath(LineOfBusiness_g, "$[?(@.Entity_Code=='" + Region_code_g + "')]");
    }
    //Incase user mapped otc and phrma
    //Set Default Value
    Doctor_Customer_LOB = "1";
    $("input[name=Mode_Of_Form]").attr("disabled", true);
    if (acc_region_lob.length == 1) {
        Doctor_Customer_LOB = acc_region_lob[0].Line_Of_Business;

    }
    else if (acc_region_lob.length > 1) {
        var div1LineOfBusiness = acc_region_lob[0].Line_Of_Business;
        var div2LineOfBusiness = acc_region_lob[1].Line_Of_Business;
        if (div1LineOfBusiness == div2LineOfBusiness) {
            Doctor_Customer_LOB = div1LineOfBusiness;
        }
        else {
            Doctor_Customer_LOB = "1";
            $("input[name=Mode_Of_Form]").attr("disabled", false);
        }
    }

    $("input[name=Mode_Of_Form][value='" + Doctor_Customer_LOB + "']").attr('checked', 'checked');
    fnLineofBusinessChange();

}
function fnLineofBusinessChange() {
    //diplsay Block
    var Mode_Of_Form = $("input[name='Mode_Of_Form']:checked").val();
    if (Mode_Of_Form == "1") {
        $(".OTC/PharmaBlock").css("display", "block");
        $(".PharmaBlock").css("display", "block");
        $(".OTCBlock").css("display", "none");
    } else if (Mode_Of_Form == "2") {
        $(".OTC/PharmaBlock").css("display", "block");
        $(".PharmaBlock").css("display", "none");
        $(".OTCBlock").css("display", "block");
    }
    //line of bus hidden
    var count = 0;
    for (var i = 0; i < LineOfBusiness_g.length; i++) {
        for (var k = 0; k < LineOfBusiness_g.length; k++) {
            if (i != k)
                if (LineOfBusiness_g[i].Line_Of_Business != LineOfBusiness_g[k].Line_Of_Business) {
                    count++;
                }
        }
    }
    //user and acc same line of business - Hide Mode Of Entry option
    if (count == 0)
        $("#divModeOfEntry").css("display", "none");
    else
        $("#divModeOfEntry").css("display", "block");
    fnGetDCRPOBDetailsByVisitCode('');

    //Chemist visit 
    if (ChemistsPrivilege == ChemistsPrivilege_Value) {
        $("#DVChemistBlock").hide();
    }
}
//-----------Master-------
function fnGetLineOfBusiness() {
    var accom_Regioncodes = "";
    for (var i = 0; i < accAutoFill_g.length; i++) {
        accom_Regioncodes += accAutoFill_g[i].value + "^";
    }
    $.ajax({
        type: 'POST',
        data: "region_code=" + accom_Regioncodes,
        url: '../DCRV4DoctorVisit/GetLineOfBusiness',
        async: false,
        success: function (response) {
            if (response != '' && response != undefined) {
                var table = eval('(' + response + ')');
                LineOfBusiness_g = table.Tables[0].Rows;

            }
        }
    });

}
function fnGetAccompaistStockist() {
    var accom_Regioncodes = "";
    for (var i = 0; i < accAutoFill_g.length; i++) {
        accom_Regioncodes = accom_Regioncodes + "^" + accAutoFill_g[i].value;
    }
    $.ajax({
        type: 'POST',
        data: "accom_Regioncodes=" + accom_Regioncodes,
        url: '../DCRV4DoctorVisit/GetStockist',
        async: false,
        success: function (response) {
            if (response != '' && response != undefined)
                StockistAuto_master_g = response;
            for (var i = 0; i < StockistAuto_master_g.length; i++) {
                var acc = {
                };
                acc.label = StockistAuto_master_g[i].StockiestName;
                acc.value = StockistAuto_master_g[i].StockiestCode;
                StockistAutoFill_g.push(acc);
            }
            // autoComplete(StockistAutoFill, "txt_Stockist_Name_", "hdnStockist_Code_", "autoStockist");
        }
    });

}
function fnGetDoctorandCustomerSalesProducts(obj) {
    var accom_Regioncodes = "";
    var sales_Product_Region_code = "";
    accom_Regioncodes = jsonPath(doctorAutoFill_g, "$[?(@.value=='" + $("#hdnDocName").val().trim() + "')]");
    if (accom_Regioncodes.length > 0) {
        sales_Product_Region_code = accom_Regioncodes[0].Doctor_Region_Code;
    }
    else
        sales_Product_Region_code = Region_code_g;
    if (sales_Product_Region_code != '') {
        $.ajax({
            type: 'POST',
            data: "accom_Regioncodes=" + sales_Product_Region_code + "&dcrDate=" + dcrActualDate_g,
            url: '../DCRV4DoctorVisit/GetSalesProducts  ',
            async: false,
            success: function (response) {
                if (response != '' && response != undefined) {
                    SalesProductsAutoFill_g = response;
                }
                else {
                    SalesProductsAutoFill_g = [];
                }
                autoComplete(SalesProductsAutoFill_g, "txt_SSalesProducts", "hdnSSales_Products", "autoSSalesProducts")
            }
        });
    }

}
//
function fnGetCurrentUserCode() {
    $.ajax({
        type: 'POST',
        url: '../DCRV4DoctorVisit/fnGetCurrentUserCode',
        async: false,
        success: function (response) {
            if (response != '') {
                var code = response.split('^');
                Region_code_g = code[1];
            }
        }
    });
}

var headerName = "";
var DoctorHeader_g = "";
var chemistName = "";

function fnPrivilegeValueforHeaderName() {
    StockistHeader_g = fnGetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist ");
    if (StockistHeader_g.length >= 20) {
        StockistHeader_g = StockistHeader_g.substr(0, 20) + "...";

    }
    if (StockistHeader_g != '') {
        $("#spnStockist").text(StockistHeader_g);
    }

    chemistName = fnGetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist ");
    if (chemistName.length >= 20) {
        chemistName = chemistName.substr(0, 20) + "...";
    }
    if (chemistName != '') {
        $("#divChemist").text(chemistName);
    }
    DoctorHeader_g = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor ");
    var cv_Header = fnGetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist ")
    var headerName = DoctorHeader_g + ' & ' + cv_Header;
    if (headerName.length >= 20) {
        headerName = headerName.substr(0, 20) + "...";
    }
    $('.spnDcoCustitle').text(headerName);
    if (chemistName != '')
        $("#divChemist").text();

    var accom_Regioncodes = "";
    for (var i = 0; i < accAutoFill_g.length; i++) {
        if (accom_Regioncodes == '')
            accom_Regioncodes = accAutoFill_g[i].value;
        else
            accom_Regioncodes += "^" + accAutoFill_g[i].value;
    }
    var DoctorHeader = '';
    DoctorHeader = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor ");
    $('.spnDcoCus').text(DoctorHeader);
    //$('#btnInsertCP').val('Go to ' + StockistHeader_g + ' Visit >>');
    //$('.btninsertdoctor').val('Go to ' + StockistHeader_g + ' Visit >>');
    docAlertTitle = DoctorHeader_g;
    screenTitle = DoctorHeader_g + " & Sample/Promotional items";
    docCheRCPAAlertTitle = chemistName + "/RCPA Details";

}

//Va
function SpecialCharacterGroup(inputObject) {
    if ($.trim($(inputObject).val()).length > 0) {
        var DCRGROUP2CHARS = new RegExp("^[a-zA-Z0-9 _().-@,\n\r\r\n]+$");
        if (!DCRGROUP2CHARS.test($(inputObject).val())) {
            return false;
        }
        return true;
    }
    else {
        return true;
    }
}
function fnValidateStockistName(obj) {
    fnValidateAutofill(obj, StockistAutoFill_g, "txt_Stockist_Name_", "hdnStockist_Code_");
}

//ACCOMPANISTS_VALID_IN_DOC_VISITS
function GetAccompanistmandatoryvalue() {
    if (AccompanistMandatory_g == "")
        AccompanistMandatory_g = fnGetPrivilegeValue("ACCOMPANISTS_VALID_IN_DOC_VISITS", "NO");
    if (AccompanistMandatory_g == 'NO') {
        var tblLength = $("#tbl_DoctorAccDetails tr").length;
        for (var i = 1; i < tblLength; i++) {
            var accompaniedCall = $('input[name=Accompaniedcall_' + i + ']:checked').val();
            if (accompaniedCall == undefined || accompaniedCall == '') {
                $("input[name='Accompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');
            }
        }
    }
}
function GetAccompanistmandatoryCheck() {
    debugger;
    if (AccompanistMandatory_g == 'YES' && doc_Visit_Controls_g.indexOf(acc_privilege_name) >= 0 && flag_g == 'F') {
        var tblLength = $("#tbl_DoctorAccDetails tr").length;
        var count = 0;
        for (var i = 1; i < tblLength; i++) {
            var accompaniedCall = $('input[name=Accompaniedcall_' + i + ']:checked').val();
            if (accompaniedCall == undefined || accompaniedCall == '') {
                //$("input[name='Accompaniedcall_" + i + "'][value='YES']").attr('checked', 'checked');

                fnMsgAlert('error', docAccAlertTitle, 'Please choose Accompanied call  - YES or No ');
                return false;
            }
        }
        return true;
    }
    else
        return true;
}
function GetAccompanistMandatoryInDoctorVisit() {

    var rValue = true;
    if (doc_Visit_Controls_g.indexOf(acc_privilege_name) >= 0) {
        rValue = false;
        $.ajax({
            type: 'POST',
            data: "dcr_date=" + dcrActualDate_g,
            url: '../DCRV4DoctorVisit/GetAccompanistMandatoryInDoctorVisit',
            async: false,
            success: function (response) {
                if (response == 'NO') {
                    rValue = true;
                }
                else {
                    var acc_name = response.split('^');
                    var name = "";
                    for (var i = 0; i < acc_name.length; i++) {
                        if (name == '')
                            name = acc_name[i];
                        else
                            name = name + ', ' + acc_name[i];
                    }
                    fnMsgAlert('error', docAccAlertTitle, 'All the accompanist who are selected in the first screen should be a part of at least one ' + DoctorHeader_g + ' visit.Following Accompanist not part of any Accompanied call(YES).' + name + ' is missing');
                    rValue = false;
                }

            }
        });
    }
    return rValue;
}

//POB
function GetDoctorVisitPOBCount() {
    $.ajax({
        type: 'POST',
        data: "dcr_date=" + dcrActualDate_g,
        url: '../DCRV4DoctorVisit/GetDoctorVisitPOBCount',
        async: false,
        success: function (response) {
            debugger;
            for (var i = 0; i < $('#tbl_doctorvisit_list tr').length; i++) {
                $("#spnPOBCount_" + (i + 1)).val('0');
                for (var j = 0; j < response.length; j++) {
                    if ($("#spnDVCode_" + (i + 1)).text().trim() == response[j].Doctor_Visit_Code) {
                        if (response[j].POB_Count > 0) {
                            $("#pobImg_" + (i + 1)).show();
                            $("#hdnPOBCount_" + (i + 1)).val(response[j].POB_Count);
                        }
                    }
                }

            }
        }
    });
}

//Doctor Visit Controls
function fnDoctorVisitControlsVisibility() {
    debugger;
    $("#divModeOfEntry").hide();

    if (flag_g == 'F') {
        $("input[name=Mode_Of_Form][value='1']").attr('checked', 'checked');
        var doc_capcture = fnGetPrivilegeValue("DOCTOR_VISITS_CAPTURE_CONTROLS", '');
        debugger;
        var pob_Mandatory = fnGetPrivilegeValue("DOCTOR_POB_ENTER_MIN", '0');
        var rcpaMandatory = fnGetPrivilegeValue('RCPA_MANDATORY_DOCTOR_CATEGORY', '');
        if (doc_capcture.length > 0) {
            doc_Visit_Controls_g = doc_capcture.split(',');
            $("#ACCOMPANIST").hide();
            $("#SAMPLES").hide();
            $("#DETAILING").hide();
            $("#DVChemistBlock").hide();
            $("#ATTACHMENTS").hide();
            $("#POB").hide();
            $("#FOLLOW-UP").hide();
            $("#ACTIVITY").hide();
            for (var i = 0; i < doc_Visit_Controls_g.length; i++) {
                if (doc_Visit_Controls_g[i] == chemist_privilege_name) {
                    $("#DVChemistBlock").show();

                    if (chemists_mandatory_number_g == "0" && doc_Visit_Controls_g[i] == "RCPA") {
                        $("#lblChemistMand").hide();
                        // $("#lblRCPAMand").hide();

                    }
                    else if (chemists_mandatory_number_g != "0" && doc_Visit_Controls_g[i] == "RCPA") {
                        if (ChemistsPrivilege != "CHEMIST_DAY") {
                            $("#lblChemistMand").show();
                        }

                    }
                    if (rcpaMandatory.length > 0 && doc_Visit_Controls_g[i] == "RCPA") {

                        $("#lblRCPAMand").show();

                    }


                }

                else {
                    $("#" + doc_Visit_Controls_g[i]).show();
                    if (inputs_mandatory_number_g == "0" && doc_Visit_Controls_g[i] == "SAMPLES") {
                        $("#lblSampleMand").hide();
                    }
                    else if (inputs_mandatory_number_g != "0" && doc_Visit_Controls_g[i] == "SAMPLES") {
                        $("#lblSampleMand").show();
                    }

                    if (detailProdMandatoryCheck == "0" && doc_Visit_Controls_g[i] == "DETAILING") {
                        $("#lbldetailMand").hide();
                    }
                    else if (detailProdMandatoryCheck != "0" && doc_Visit_Controls_g[i] == "DETAILING") {
                        $("#lbldetailMand").show();
                    }
                    if (pob_Mandatory != "0" && doc_Visit_Controls_g[i] == "POB") {
                        $('#lblPOBMand').show();
                    }
                    else if (pob_Mandatory == "0" && doc_Visit_Controls_g[i] == "POB") {
                        $('#lblPOBMand').hide();
                    }
                }
            }
        }
        else {
            $("#ACCOMPANIST").show();
            $("#SAMPLES").show();
            $("#DETAILING").show();
            $("#DVChemistBlock").show();
            $("#ATTACHMENTS").show();
            $("#POB").show();
            $("#FOLLOW-UP").show();
            $("#ACTIVITY").show();
            doc_Visit_Controls_g.push("ACCOMPANIST");
            doc_Visit_Controls_g.push("SAMPLES");
            doc_Visit_Controls_g.push("DETAILING");
            doc_Visit_Controls_g.push("ATTACHMENTS");
            doc_Visit_Controls_g.push("POB");
            doc_Visit_Controls_g.push("FOLLOW-UP");
            doc_Visit_Controls_g.push("RCPA");
            doc_Visit_Controls_g.push("ACTIVITY");
        }
    }
    else {
        $("#ACCOMPANIST").hide();
        // $("#SAMPLES").hide();
        $("#DETAILING").hide();
        $("#DVChemistBlock").hide();
        $("#ATTACHMENTS").hide();
        $("#POB").hide();
        $("#FOLLOW-UP").hide();
        // $("#ACTIVITY").hide();
        doc_Visit_Controls_g.push("SAMPLES");
        doc_Visit_Controls_g.push("ACTIVITY");
        $('#imgloaddDOCLST').css('dispaly', '');
        $('#docLSTLoadingTitle').css('display', '');
    }
}
//Get bussiness
function GetDoctorBusinessAndActivityMaster() {

    //ActivityAutoFill_g.push({ label: 'test', value: '1' });
    // ActivityAutoFill_g.push({ label: 'test2', value: '2' });
    //ActivityAutoFill_g.push({ label: 'test3', value: '3' });
    var activity = 0;
    if (doc_Visit_Controls_g.indexOf(activity_privilege_name) >= 0)
        activity = 1;
    $.ajax({
        type: 'GET',
        url: '../DCRV4DoctorVisit/GetDoctorBusinessAndActivityMaster',
        date: 'activity=' + activity,
        async: false,
        success: function (result) {
            $("#divBusinessStatus").hide();
            if (result.lsBusinessStatus != null && result.lsBusinessStatus.length > 0) {
                var product = $.grep(result.lsBusinessStatus, function (element, index) {
                    return element.Entity_Type == 2;
                });
                if (product.length > 0)
                    DoctorBusiness_g = product;
                else
                    DoctorBusiness_g = [];
                var doctor = $.grep(result.lsBusinessStatus, function (element, index) {
                    return element.Entity_Type == 1;
                });
                if (doctor.length > 0)
                    DoctorBusinessList_g = doctor;
                else
                    DoctorBusinessList_g = [];
            }
            else {
                DoctorBusiness_g = [];
                DoctorBusinessList_g = [];
            }
            if (result.lsDCRActivity != null)
                ActivityAutoFill_g = result.lsDCRActivity;
            else
                ActivityAutoFill_g = [];

            if (result.lsCallObjective != null)
                CallObjective_g = result.lsCallObjective;
            else
                CallObjective_g = [];


        }
    });
}
function fnPerfillCallObjectiveAndBusinessStatus() {
    $("#ddlDBStatus").html("");
    $("#ddlcallObjetive").html("");
    if (CallObjective_g.length > 0) {
        var count = 0;
        var ddl = '<option value="0">-select-</option>';
        for (var i = 0; i < CallObjective_g.length; i++) {
            if (CallObjective_g[i].Status == "1") {
                count++;
                ddl += '<option value=' + CallObjective_g[i].Call_Objective_ID + '>' + CallObjective_g[i].Call_Objective_Name + '</option>';
            }
        }
        $("#ddlcallObjetive").html("");
        $("#ddlcallObjetive").html(ddl);
        if (count > 0)
            $("#divCallObjective").show();
        else
            $("#divCallObjective").hide();
    }
    else
        $("#divCallObjective").hide();
    if (DoctorBusinessList_g.length > 0) {
        var count = 0;
        var ddl = '<option value="0">-select-</option>';
        for (var i = 0; i < DoctorBusinessList_g.length; i++) {
            if (DoctorBusinessList_g[i].Entity_Type == 1 && DoctorBusinessList_g[i].Status == "1") {
                count++;
                ddl += '<option value=' + DoctorBusinessList_g[i].Business_Status_ID + '>' + DoctorBusinessList_g[i].Status_Name + '</option>';
            }
        }
        $("#ddlDBStatus").html("");
        $("#ddlDBStatus").html(ddl);
        if (count > 0)
            $("#divBusinessStatus").show();
        else
            $("#divBusinessStatus").hide();
    }
    else
        $("#divBusinessStatus").hide();
}
function fnBindDCRActivity(Visit_code) {
    debugger;
    if (flag_g == 'A') {
        if (Visit_code != null) {
            $.ajax({
                type: 'GET',
                url: '../DCRV4DoctorVisit/GetDCRActivity',
                data: 'Visit_code=' + Visit_code + "&flag=" + flag_g,
                success: function (result) {
                    debugger;
                    var lsCallActivity = result.lsCallActivity;
                    var lsMCActivityDetails = result.lsMCActivityDetails;
                    var CME = result.lsttracking;

                    if (lsCallActivity != null && lsCallActivity.length > 0)
                        for (var i = 0; i < lsCallActivity.length; i++) {
                            //var count = 0;
                            //var Status_Name = "";
                            //for (var k = 0; k < ActivityAutoFill_g.length; k++) {
                            //    if (ActivityAutoFill_g[k].value == lsCallActivity[i].Customer_Activity_ID) {
                            //        Status_Name = ActivityAutoFill_g[k].label;
                            //        count++;
                            //    }
                            //}
                            // if (count > 0) {
                            $("#txt_Activity_Name_" + (i + 1)).val(lsCallActivity[i].Activity_Name);
                            $("#txtRemark_" + (i + 1)).val(lsCallActivity[i].Activity_Remarks);
                            $("#hdnActivity_Code_" + (i + 1)).val(lsCallActivity[i].Customer_Activity_ID);


                            //}
                            fnAddActivityRow(null, (i + 1));
                        }
                    debugger;
                    if (lsMCActivityDetails != null && lsMCActivityDetails.length > 0)
                        for (var i = 0; i < lsMCActivityDetails.length; i++) {
                            //var count = 0;
                            //var Status_Name = "";
                            //for (var k = 0; k < MCDetails_g.length; k++) {
                            //    if (MCDetails_g[k].value == lsMCActivityDetails[i].Campaign_Code) {
                            //        Status_Name = MCDetails_g[k].label;
                            //        count++;
                            //    }
                            //}
                            // if (count > 0) {
                            $("#txt_MCActivity_Name_" + (i + 1)).val(lsMCActivityDetails[i].Campaign_Name + '_' + lsMCActivityDetails[i].Campaign_Type);
                            $("#hdnMCActivity_Code_" + (i + 1)).val(lsMCActivityDetails[i].Campaign_Code);
                            var Details = $.grep(CME, function (v) {
                                return v.Campaign_Code == lsMCActivityDetails[i].Campaign_Code;
                            });
                            ///$.trim(doc_code)
                            bindCME((i + 1), Details);
                            var opt = '';
                            var mcDetails = $.grep(MCActivityDetails_g, function (element, index) {
                                return element.Campaign_Code == lsMCActivityDetails[i].Campaign_Code;
                            });
                            if (mcDetails.length == 1) {
                                opt += "<option value=" + mcDetails[0].MC_Activity_Id + ">" + mcDetails[0].Activity_Name + "</option>";
                            }
                            else {
                                opt += "<option value='0'>-select-</option>";

                                for (var j = 0; j < mcDetails.length; j++) {
                                    opt += "<option value=" + mcDetails[j].MC_Activity_Id + ">" + mcDetails[j].Activity_Name + "</option>";
                                }
                            }

                            $("#txtMCRemark_" + (i + 1)).val(lsMCActivityDetails[i].Activity_Remarks);
                            $("#txt_Currentsales_" + (i + 1)).val(lsMCActivityDetails[i].Current_Sales);
                            $("#txt_Expectedsales_" + (i + 1)).val(lsMCActivityDetails[i].Expected_Sales);
                            $("#txt_Noofmonths_" + (i + 1)).val(lsMCActivityDetails[i].NoofMonths);
                            $("#ddlMC_" + (i + 1)).html('');
                            $("#ddlMC_" + (i + 1)).html(opt);
                            $("#ddlMC_" + (i + 1)).val(lsMCActivityDetails[i].MC_Activity_Id);
                            fnAddMCActivityRow(null, (i + 1));
                            // }

                        }
                }
            });
        }
    }
    else {
        $.ajax({
            type: 'GET',
            url: '../DCRV4DoctorVisit/GetDCRActivity',
            data: 'Visit_code=' + Visit_code + "&flag=" + flag_g,
            success: function (result) {
                debugger;
                var lsCallActivity = result.lsCallActivity;
                var lsMCActivityDetails = result.lsMCActivityDetails;
                var CME = result.lsttracking;

                if (lsCallActivity != null && lsCallActivity.length > 0)
                    for (var i = 0; i < lsCallActivity.length; i++) {
                        //var count = 0;
                        //var Status_Name = "";
                        //for (var k = 0; k < ActivityAutoFill_g.length; k++) {
                        //    if (ActivityAutoFill_g[k].value == lsCallActivity[i].Customer_Activity_ID) {
                        //        Status_Name = ActivityAutoFill_g[k].label;
                        //        count++;
                        //    }
                        //}
                        // if (count > 0) {
                        $("#txt_Activity_Name_" + (i + 1)).val(lsCallActivity[i].Activity_Name);
                        $("#txtRemark_" + (i + 1)).val(lsCallActivity[i].Activity_Remarks);
                        $("#hdnActivity_Code_" + (i + 1)).val(lsCallActivity[i].Customer_Activity_ID);


                        //}
                        fnAddActivityRow(null, (i + 1));
                    }
                debugger;
                if (lsMCActivityDetails != null && lsMCActivityDetails.length > 0)
                    for (var i = 0; i < lsMCActivityDetails.length; i++) {
                        //var count = 0;
                        //var Status_Name = "";
                        //for (var k = 0; k < MCDetails_g.length; k++) {
                        //    if (MCDetails_g[k].value == lsMCActivityDetails[i].Campaign_Code) {
                        //        Status_Name = MCDetails_g[k].label;
                        //        count++;
                        //    }
                        //}
                        // if (count > 0) {
                        $("#txt_MCActivity_Name_" + (i + 1)).val(lsMCActivityDetails[i].Campaign_Name);
                        $("#hdnMCActivity_Code_" + (i + 1)).val(lsMCActivityDetails[i].Campaign_Code);
                        var Details = $.grep(CME, function (v) {
                            return v.Campaign_Code == lsMCActivityDetails[i].Campaign_Code;
                        });
                        ///$.trim(doc_code)
                        bindCME((i + 1), Details);
                        var opt = '';
                        var mcDetails = $.grep(MCActivityDetails_g, function (element, index) {
                            return element.Campaign_Code == lsMCActivityDetails[i].Campaign_Code;
                        });
                        if (mcDetails.length == 1) {
                            opt += "<option value=" + mcDetails[0].MC_Activity_Id + ">" + mcDetails[0].Activity_Name + "</option>";
                        }
                        else {
                            opt += "<option value='0'>-select-</option>";

                            for (var j = 0; j < mcDetails.length; j++) {
                                opt += "<option value=" + mcDetails[j].MC_Activity_Id + ">" + mcDetails[j].Activity_Name + "</option>";
                            }
                        }

                        $("#txtMCRemark_" + (i + 1)).val(lsMCActivityDetails[i].Activity_Remarks);
                        $("#txt_Currentsales_" + (i + 1)).val(lsMCActivityDetails[i].Current_Sales);
                        $("#txt_Expectedsales_" + (i + 1)).val(lsMCActivityDetails[i].Expected_Sales);
                        $("#txt_Noofmonths_" + (i + 1)).val(lsMCActivityDetails[i].NoofMonths);
                        $("#ddlMC_" + (i + 1)).html('');
                        $("#ddlMC_" + (i + 1)).html(opt);
                        $("#ddlMC_" + (i + 1)).val(lsMCActivityDetails[i].MC_Activity_Id);
                        fnAddMCActivityRow(null, (i + 1));
                        // }

                    }
            }
        });
    }
}
function fnGetCMECampaigns() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/MarketingCampaign/GetCMECampaigns/',
        type: "POST",
        data: "",
        success: function (jsData) {
            debugger;
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                CMEDetails_g = jsData;
            }
            if (CMEDetails_g != '') {
                $("#tbl_CME").show();
            }
            else {
                $("#tbl_CME").hide();
            }
        }
    });
}
function fnRecordCME() {
    debugger;
    $("#myCMEModal").overlay().load();
    // $("#myCMEModal").modal('show');
}
function fnCampaignsFailureCallback() {

}
function GeMCDetails(isDraft) {
    var docDetails = $.grep(doctorAutoFill_g, function (element, index) {
        return element.value == $("#hdnDocName").val().trim();
    });
    if ($("#hdnDocName").val().trim() != '' && docDetails.length > 0) {
        var category_Code = docDetails[0].Category_Code;
        var speciality_Code = docDetails[0].Speciality_Code;
        var customer_code = docDetails[0].value;
        var dcrDate = dcrActualDate_g;
        $.ajax({
            type: 'GET',
            url: '../DCRV4DoctorVisit/GeMCDetails',
            data: "customer_code=" + customer_code + "&dcrDate=" + dcrDate,
            async: false,
            success: function (result) {
                if (result.lsMCDetails != null && result.lsMCDetails.length > 0) {
                    var lstmcdetails = [];
                    for (var i = 0; i < result.lsMCDetails.length; i++) {
                        var str = result.lsMCDetails[i].Campaign_Name
                        var indexValue = str.lastIndexOf('-')
                        var isCME = str.substring((parseInt(indexValue) + parseInt(1)), str.length)
                        if (flag_g == 'F') {
                            if (isCME.toUpperCase() != 'CME') {
                                lstmcdetails.push(result.lsMCDetails[i]);

                            }
                        }
                        else {
                            lstmcdetails.push(result.lsMCDetails[i]);
                        }
                    }
                    MCDetails_g = lstmcdetails;

                }
                else
                    MCDetails_g = [];
                if (result.lsMCActivityDetails != null && result.lsMCActivityDetails.length > 0)
                    MCActivityDetails_g = result.lsMCActivityDetails;
                else
                    MCActivityDetails_g = [];
            }
        });
    }
    else {
        MCDetails_g = [];
        MCActivityDetails_g = [];
    }
    if (isDraft == '0') {
        //Clear activity and MC
        // $("#tbl_Activity tbody").html('');
        // fnAddActivityRow(null);
        $("#tbl_MC_Activity tbody").html('');
        fnAddMCActivityRow(null);
    }
}
function fnCheckValueExistDropDown(id, value) {
    var exists = false;
    if (value != null && value != '') {
        var ddlopt = $('#' + id + " option");
        for (var i = 0; i < ddlopt.length; i++) {
            if (ddlopt[i].value == value.toString())
                exists = true;
        }
    }
    else
        exists = true;
    return exists;
}
function GetAllSaleProductsForDetailsWithColor() {
    debugger;
    var single_Doc = $.grep(doctorAutoFill_g, function (element, index) {
        return element.value == $("#hdnDocName").val();
    });
    if (single_Doc.length > 0) {
        var Doctor_code = single_Doc[0].value;
        var Doc_Region_Code = single_Doc[0].Doctor_Region_Code;
        $.ajax({
            type: "POST",
            url: "../DCRV4DoctorVisit/GetAllSaleProductsForDetailsWithColor",
            data: "Doc_Region_Code=" + Doc_Region_Code + "&Doctor_code=" + Doctor_code + "&dcrDate=" + dcrActualDate_g,
            async: false,
            success: function (response) {
                detailedProductsAutoFill_g = response;
            }
        });
    }
    //else
    //   detailedProductsAutoFillWithColor_g = [];
}

function fnGetDoctorBusinessStatus() {
    var single_Doc = $.grep(doctorAutoFill_g, function (element, index) {
        return element.value == $("#hdnDocName").val();
    });
    if (single_Doc.length > 0) {
        var Doctor_code = single_Doc[0].value;
        var Doc_Region_Code = single_Doc[0].Doctor_Region_Code;
        $.ajax({
            type: 'get',
            url: '../DCRV4DoctorVisit/GetDoctorBusinessStatus',
            data: 'doctor_code=' + Doctor_code + '&dcr_date=' + dcrActualDate_g + '&doctor_region_code=' + Doc_Region_Code,
            success: function (result) {
                debugger;
                if (result.Item1.length > 0) {
                    if ($("#divBusinessStatus").css("display") == 'block') {
                        var docBusinessStatus = result.Item1;
                        $("#ddlDBStatus").val(docBusinessStatus[0].Business_Status_ID);
                    }
                }
                Product_BusinessStatus = result.Item2;
            }
        });
    }
}

function fnGetProductBatch(productCode, entity, cv_visit_id) {
    debugger;
    var result;
    $.ajax({
        type: "POST",
        url: '../DCRV4DoctorVisit/GetDCRProductBatch',
        async: false,
        data: 'product_Code=' + productCode + '&dcr_date=' + dcrActualDate_g + '&entity=' + entity + "&cv_visit_id=" + cv_visit_id + "&Flag=" + flag_g,
        success: function (_result) {
            result = _result;
        },
        error: function (result) {
            console.log(result);
            result = "";
        },
    });
    return result;
}
//function fnBindCompetitorMasterData() {
//    fngetcompetitorname();
//    fngetproductname();
//}
function fnGetSurveyResponse() {
    debugger;
    Method_params = ["SurveyAPI/GetSurveyResponse", CompanyCode, RegionCode, UserCode, $("#hdnDocName").val(), Survey_Id, flag_g];
    SurveyCoreREST.get(null, Method_params, null, fnSurveyResponseSuccessCallback, fnSurveyResponseFailureCallback);
}
function fnSurveyResponseSuccessCallback(result) {
    debugger;
    if (result == 1) {
        debugger;
        $("#surveylink").hide();
        $("#divSurvey").show();
        $("#surveyviewlink").show();

    }
    else {
        $("#surveylink").show();
        $("#divSurvey").show();
        $("#surveyviewlink").hide();
    }

}
function fnSurveyResponseFailureCallback() {
    debugger;
}
function fngetUsertype() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../DCRV4DoctorVisit/Getsurvey',
        data: "UserCode=" + '' + "&CampaignCode=" + $('#ddlMC :selected').val(),
        success: function (result) {
            debugger;
            if (result == 1) {
                $("#divSurvey").show();
                $("#surveylink").show();
                fngetSurveyDetails();
            }
            else {
                $("#divSurvey").hide();
                $("#surveylink").hide();
            }
        }
    });
}
function fnviewsurvey() {
    debugger;
    var subdomainName = '';
    var Survey_User_Assignment_Id = 0;
    var Survey_Publish_Group_Id = 0;
    var qeyString = accKey + '/Survey/KASurveyResultPage?CompanyCode=' + CompanyCode + '&ChecklistId=' + Survey_Id + '&CompanyId=' + CompanyId + '&UserId=' + UserCode + '&CustomerCode=' + $("#hdnDocName").val() + '';
    $("#mySurveyViewModal").show();
    $("#surveyviewbody").html('<iframe src=' + qeyString + ' id="isurvey" style="width:100%;height:500px;"></iframe>');
}
function fngetSurveyDetails() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../DCRV4DoctorVisit/GetsurveyDetails',
        data: "CompanyCode=" + '' + "&CampaignCode=" + $('#ddlMC :selected').val(),
        success: function (result) {
            debugger;
            Survey_Id = result[0].Survey;
            var validto = result[0].Survey_ValidTo;
            var date = validto.split('-')[0] + '-' + validto.split('-')[1] + '-' + validto.split('-')[2];
            var surveydate = new Date(date);
            var dcrdate = new Date(dcrActualDate_g);
            if (dcrdate <= surveydate) {
                $("#divSurvey").show();
                $("#surveylink").show();
                fnGetSurveyResponse();
            }
            else {
                $("#divSurvey").hide();
                $("#surveylink").hide();
            }
        }
    });
}
//function fnshowsurvey()
//{
//    debugger;
//    $("#mySurveyModal").show();
//}
function fnsurveyclose() {
    debugger;
    $("#mySurveyModal").hide();
    fngetUsertype();
}
function fnsurveyresponseclose() {
    debugger;
    $("#mySurveyViewModal").hide();
}

function fnshowsurvey() {
    debugger;
    //  ShowModalPopup('dvLoading');
    var CName = $("#txtDocName").val().split('_');
    var CustomerName = CName[0];
    $("#Userids").val("");
    $("#ChecklistId").val($.trim(Survey_Id));
    $("#publishId").val('0');
    $("#al").val('0');
    $("#cl").val('0');
    $("#layout").val('0');
    $("#coId").val(CompanyId);
    $("#uId").val('0');
    $("#rCode").val(RegionCode);
    $("#sdn").val('0');
    $("#lang").val('0');
    $("#cumid").val('0');
    $("#Ref_Id").val(0);
    $("#DraftId").val(0);
    $("#EncypURL").val('1');
    $("#CompanyCode").val(CompanyCode);
    $("#UserCode").val(UserCode);
    $("#UserName").val(UserName);
    // $("#RegionCode").val(RegionCode);
    $("#RegionName").val(RegionName);
    $("#CustomerCode").val($("#hdnDocName").val());
    $("#CustomerName").val(CustomerName);
    var qeyString = accKey + '/Survey/KASurveyQuestionAnswers';
    $("#mySurveyModal").show();
    //   $("#dvLoading").show();
    $('#multiselectformdiv').attr('action', qeyString);
    $("#multiselectformdiv").submit();
    // HideModalPopup('dvLoading');
    //$("#surveybody").html('<iframe src='+qeyString+' id="isurvey" height="200" width="300"></iframe>');
}
// MC Dropdown Section
function fnGetMCDetailsforDropdown() {
    debugger
    $("#ddlMC").html('');
    var opt = "<option value='0'>-select-</option>";
    var docDetails = $.grep(doctorAutoFill_g, function (element, index) {
        return element.value == $("#hdnDocName").val().trim();
    });
    if ($("#hdnDocName").val().trim() != '' && docDetails.length > 0) {
        var customer_code = docDetails[0].value;
        var regioncode = docDetails[0].Doctor_Region_Code;
        var dcrDate = dcrActualDate_g;
        //dcrDate =dcrDate.split
        $.ajax({
            type: 'GET',
            url: '../DCRV4DoctorVisit/GetMCDetailsforDropdown',
            data: "customer_code=" + customer_code + "&regioncode=" + regioncode + "&dcrDate=" + dcrDate,
            success: function (result) {
                debugger;

                $("#ddlMC").html('');
                var ddlCount = 0;
                var opt = "<option value='0'>-select-</option>";

                if (result.length > 0) {
                    debugger;
                    //MCResultJson = result;
                    for (var i = 0; i < result.length; i++) {
                        ddlCount++;
                        var str = result[i].Campaign_Name
                        var indexValue = str.lastIndexOf('-')
                        var isCME = str.substring((parseInt(indexValue) + parseInt(1)), str.length)
                        if (flag_g == 'F') {
                            if (isCME.toUpperCase() != 'CME') {
                                opt += "<option value=" + result[i].Campaign_Code + ">" + result[i].Campaign_Name + "</option>";
                            }
                        }
                        else {
                            opt += "<option value=" + result[i].Campaign_Code + ">" + result[i].Campaign_Name + "</option>";
                        }
                    }

                    $("#ddlMC").html(opt);
                    $("#divMC").show();
                }
                else {
                    $("#ddlMC").html('');
                    var opt = "<option value='0'>-select-</option>";
                    $("#ddlMC").html(opt);
                    $("#divMC").hide();
                }

                // MC DETAILS
                if (doctorjson_g.Marketing_Campaign_ID != '' && doctorjson_g.Marketing_Campaign_ID != null && doctorjson_g.Marketing_Campaign_ID != undefined && doctorjson_g.Doctor_Code == $('#hdnDocName').val()) {
                    debugger
                    $('#ddlMC').val("");
                    $('#ddlMC').val(doctorjson_g.Marketing_Campaign_ID);
                    fngetUsertype();
                    var content = '';
                    var ddlCount = 0;

                    var mcDetails = $.grep(result, function (element, index) {
                        return element.Campaign_Code == doctorjson_g.Marketing_Campaign_ID;
                    });
                    content = "<option value='0'>-select-</option>";
                    if (mcDetails.length > 0) {

                        content += '<option value = ' + doctorjson_g.Marketing_Campaign_ID + '>' + mcDetails[0].Campaign_Name + '</option>'
                    }
                    //else {
                    //    content += '<option value = ' + doctorjson_g.Marketing_Campaign_ID + '>' + doctorjson_g.Campaign_Name + '</option>'
                    //}
                    for (var i = 0; i < result.length; i++) {
                        ddlCount++;
                        if (result[i].Campaign_Code != doctorjson_g.Marketing_Campaign_ID) {
                            var str = result[i].Campaign_Name
                            var indexValue = str.lastIndexOf('-')
                            var isCME = str.substring((parseInt(indexValue) + parseInt(1)), str.length)
                            if (flag_g == 'F') {
                                if (isCME.toUpperCase() != 'CME') {
                                    content += "<option value=" + result[i].Campaign_Code + ">" + result[i].Campaign_Name + "</option>";
                                }
                            }
                            else {
                                content += "<option value=" + result[i].Campaign_Code + ">" + result[i].Campaign_Name + "</option>";
                            }
                        }

                    }
                    $("#ddlMC").html(content);
                    if (mcDetails.length > 0) {
                        // content += '<option value = ' + doctorjson_g.Marketing_Campaign_ID + '>' + mcDetails[0].Campaign_Name + '</option>'
                        $('#ddlMC').val("");
                        var str = mcDetails[0].Campaign_Name
                        var indexValue = str.lastIndexOf('-')
                        var isCME = str.substring((parseInt(indexValue) + parseInt(1)), str.length)
                        if (flag_g == 'F') {
                            if (isCME.toUpperCase() != 'CME') {
                                $('#ddlMC').val(doctorjson_g.Marketing_Campaign_ID);
                            }
                        }
                        else {
                            $('#ddlMC').val(doctorjson_g.Marketing_Campaign_ID);
                        }

                    }
                    $("#divMC").show();
                }
                //else {
                //    $("#ddlMC").html('');
                //    var opt = "<option value='0'>-select-</option>";
                //    $("#ddlMC").html(opt);
                //}
            }
        });
    }
    else {
        $("#ddlMC").html('');
        var opt = "<option value='0'>-select-</option>";
        $("#ddlMC").html(opt);
        $("#divMC").hide();
    }
}
function fnCurrencyFormatNew(id, text) {
    debugger

    if ($.trim($(id).val()).length > 0) {
        if (!/^\d{1,11}(\.\d{1,2})?$/.test($(id).val())) {
            fnMsgAlert('info', 'Information', 'Entered ' + text + ' amount exceeded');
            $(id).val('');
            fnErrorIndicator(id);
            return false;
        }
        else {

            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    return true;
}
function fnErrorIndicator(id) {
    $(id).css('backgroundColor', '#efefef');
    $(id).focus();
}
function fnRemoveErrorIndicatior(id) {
    $(id).css('backgroundColor', '#fff');
}
function fnValidateBudget(Id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 10) {
            return false;

        }
    }
}