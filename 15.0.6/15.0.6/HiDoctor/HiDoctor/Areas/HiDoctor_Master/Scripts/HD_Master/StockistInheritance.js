//Created By Ramya
//02-08-2016


var Is_Inherited = "";

function fnGetStockistData() {
    debugger;
    var treeobj = $("#SourceRegionTree").dynatree("getTree");
    if (treeobj.getActiveNode() != null) {
        ShowModalPopup("dvloading");
        var regionCode = treeobj.getActiveNode().data.key;
        $.ajax({
            url: '../HiDoctor_Master/StockistInheritance/GetCustomers/',
            type: "POST",
            data: "Mode=" + "^1^" + "&DateTime=" + new Date().getTime() + "&RegionCode=" + regionCode + "&EntityName=" + "STOCKIEST" + "&PageName=SINGLE",
            success: function (jsData) {
                $('#dvGrid').show();
                $('#dvGrid').html(jsData);
                $('#dvStockiest').show();
                $('#btnShift').show();
                $('#btnInherit').show();
                HideModalPopup("dvloading");
            }
        });
    }
}

function fnCheckAll() {
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false; 
        });
    }
}


function CheckISInherited(customerCode, customerName) {
    var treeobj = $("#SourceRegionTree").dynatree("getTree");
    var regionCode = treeobj.getActiveNode().data.key;
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/StockistInheritance/GetStokiestInheritanceStatus/',
        type: "POST",
        async: false,
        data: "&customerCode=" + customerCode + "&customerName=" + customerName + "&region_Code=" + regionCode,
        success: function (jsData) {
            debugger;
            if (jsData == "true") {
                Is_Inherited = "0";
            }
            else {
                Is_Inherited = jsData;
            }
        }
    });
}


function fnShiftStockiest() {
    var treeobj = $("#SourceRegionTree").dynatree("getTree");
    var regionCode = treeobj.getActiveNode().data.key;
    var regionodes = "";
    var tblContent = "";
    var cust = new Array();
    var count = 0;
    if (selKeys.length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select atleast one Target Region');
        return false;
    }
    var TargetUserCodes = "";
    for (var i = 0; i < selKeys.length; i++) {
        TargetUserCodes += selKeys[i] + '^';
    }

    var tarRegionArr = [];
    tarRegionArr = TargetUserCodes.split('^');
    for (var i = 0; i < tarRegionArr.length; i++) {
        if (regionCode == tarRegionArr[i]) {
            fnMsgAlert('info', 'Info', 'Source Region Code is equal to Target Region Code');
            return false;
        }

    }

    var colData = "";
    var rowData = "";
    var headers = [];
    var a = [];

    a = rowData.split('^');
    for (var i = 1; i < a.length; i++) {
        cust.push(a[i].split(','));
    }
    var regionCode = treeobj.getActiveNode().data.key;
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/StockistInheritance/GetCustomerHeaders/',
        type: "POST",
        async: false,
        data: "Mode=" + "^1^" + "&DateTime=" + new Date().getTime() + "&RegionCode=" + regionCode + "&entity=" + "STOCKIEST" + "&PageName=SINGLE",
        success: function (jsData) {
            debugger;
            headers = jsData;
        }
    });

    var rowArray = new Array();
    var rowData = "";
    var col = [];
    var obj = [];
    var id = "";
    var rowCount = "";
    var customerCode = [];
    var RegionTypeCode = [];
    var Row_Status = [];
    var Row_Version_No = [];
    var CCM_Customer_ID = [];
    var Contact_Relation = [];
    var is_Inherit = [];
    var is_Billable = [];
    var Effective_From = [];
    var Region_Code = [];
    var Category = [];
    var Speciality_Code = [];
    var Ref_Key1 = [];
    var Ref_Key2 = [];
    var Depot_Code = [];
    var Registration_Number = [];
    var SubRegion_Code = [];

    $("input:checkbox[name=chkSelect]:checked").each(function () {
        id = this.id.split('_')[1];

        if (id.toString() != "All") {
            rowCount = rowCount + 1;
            customerCode.push($('#hdnCustomerCode_' + id).val());
            RegionTypeCode.push($('#hdnRegion_Type_Code_' + id).val());
            Row_Status.push($('#hdnRow_Status_' + id).val());
            CCM_Customer_ID.push($('#hdnCCM_Customer_ID_' + id).val());
            Row_Version_No.push($('#hdnRow_Version_No_' + id).val());
            Contact_Relation.push($('#hdnContact_Relation_' + id).val());
            is_Inherit.push($('#hdnIs_Inherited_' + id).val());
            is_Billable.push($('#hdnisBillable_' + id).val());
            Effective_From.push($('#hdnEffectiveFrom_' + id).val());
            Region_Code.push($('#hdnRegionCode_' + id).val());
            Category.push($('#hdnCategory_' + id).val());
            Speciality_Code.push($('#hdnSpecialityCode_' + id).val());
            Ref_Key1.push($('#hdnRefKey1_' + id).val());
            Ref_Key2.push($('#hdnRefKey2_' + id).val());
            Depot_Code.push($('#hdnDepotCode_' + id).val());
            Registration_Number.push($('#hdnRegistrationNumber_' + id).val());
            SubRegion_Code.push($('#hdnSubRegionCode_' + id).val());

            debugger;
            var tdLen = $('#tblDoctor #tr_' + id).find("td").length;
            //for (var r = 0; r < parseInt(id) + 1 ; r++) {
            for (var j = 1; j < tdLen; j++) {
                colData = colData + "!!" + $('#tblDoctor #tr_' + id).find("td")[j].innerHTML;
                col = colData.split('!!');
            }
            obj.push(col);
            col = "";
            colData = "";
            //}
        }
    });

    if (id == "") {
        fnMsgAlert('info', 'Info', 'Please select atleast one stockiest');
        return false;
    }
    debugger;
    for (var r = 0; r < obj.length; r++) {
        debugger;
        var ob = new Object();
        for (var i = 0; i < headers.length; i++) {
            ob["Customer_Code"] = customerCode[r];
            ob["Is_Billable"] = is_Billable[r];
            ob["Region_Code"] = Region_Code[r];
            ob["Region_Type_Code"] = RegionTypeCode[r];
            ob["Customer_Status"] = "1";
            ob["Customer_Entity_Type"] = "STOCKIEST";
            ob["Row_Status"] = Row_Status[r];
            ob["Row_Version_No"] = Row_Version_No[r];
            ob["CCM_Customer_ID"] = CCM_Customer_ID[r];
            ob["Contact_Relation"] = Contact_Relation[r];
            ob["Is_Inherited"] = is_Inherit[r];
            ob["Source_Region_Code"] = regionCode;
            ob["Effective_From"] = Effective_From[r];
            ob["Category"] = Category[r];
            ob["Speciality_Code"] = Speciality_Code[r];
            ob["Ref_Key1"] = Ref_Key1[r];
            ob["Ref_Key2"] = Ref_Key2[r];
            ob["Depot_Code"] = Depot_Code[r];
            ob["Registration_Number"] = Registration_Number[r];
            ob["SubRegion_Code"]=SubRegion_Code[r];

            if (headers[i] == "Special_Discount_Rate") {
                debugger;
                if (obj[r][i + 1] != "") {
                    debugger;
                    ob["Special_Discount_Rate"] = parseFloat(obj[r][i + 1]);
                }
                else {
                    ob["Special_Discount_Rate"] = 0.0;
                }
            }
            else if (headers[i] == "Octroi_Rate") {
                if (obj[r][i + 1] != "") {
                    debugger;
                    ob["Octroi_Rate"] = parseFloat(obj[r][i + 1]);
                }
                else {
                    ob["Octroi_Rate"] = 0.0;
                }
            }
            else {
                ob[headers[i]] = obj[r][i + 1];
            }
        }
        rowArray.push(ob);
        ob = "";

    }
    debugger;
    rowArray = JSON.stringify(rowArray);
    //ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Master/StockistInheritance/ShiftStockiest/',
        type: "POST",
        async: false,
        data: "stockiestArray=" + rowArray + "&TargetRegionCode=" + TargetUserCodes + "&customerCodes=" + customerCode,
        success: function (jsData) {
            if (jsData == "Inserted Successfully") {
                //HideModalPopup("dvloading");
                fnMsgAlert('info', 'Info', 'Selected stockiest are shifted from source region to target region');
                //fnGetStockistData();
                Is_Inherited = "";
                fnTreeWithChkBoxChildSelction("TargetRegionTree");
                $('#dvGrid').hide();
                $('#dvStockiest').hide();
                $('#btnShift').hide();
                $('#btnInherit').hide();
                return false;
            }
            else {
                //HideModalPopup("dvloading");
                fnMsgAlert('info', 'Info', jsData);
                return false;
            }
        }
    });
}

function fnInheritStockiest() {
    var treeobj = $("#SourceRegionTree").dynatree("getTree");
    var regionCode = treeobj.getActiveNode().data.key;
    var regionodes = "";
    var tblContent = "";
    var cust = new Array();
    if (selKeys.length == 0) {
        fnMsgAlert('info', 'Info', 'Please select atleast one Target Region');
        return false;
    }
    var TargetUserCodes = "";
    for (var i = 0; i < selKeys.length; i++) {
        TargetUserCodes += selKeys[i] + '^';
    }

    var tarRegionArr = [];
    tarRegionArr = TargetUserCodes.split('^');
    for (var i = 0; i < tarRegionArr.length; i++) {
        if (regionCode == tarRegionArr[i]) {
            fnMsgAlert('info', 'Info', 'Source Region Code is equal to Target Region Code');
            return false;
        }

    }


    var colData = "";
    var rowData = "";
    var headers = [];
    var a = [];

    a = rowData.split('^');
    for (var i = 1; i < a.length; i++) {
        cust.push(a[i].split(','));
    }
    var regionCode = treeobj.getActiveNode().data.key;
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/StockistInheritance/GetCustomerHeaders/',
        type: "POST",
        async: false,
        data: "Mode=" + "^1^" + "&DateTime=" + new Date().getTime() + "&RegionCode=" + regionCode + "&entity=" + "STOCKIEST" + "&PageName=SINGLE",
        success: function (jsData) {
            debugger;
            headers = jsData;
        }
    });

    var rowArray = new Array();
    var rowData = "";
    var col = [];
    var obj = [];
    var id = "";
    var rowcount = 0;
    var customerCode = [];
    var RegionTypeCode = [];
    var Row_Status = [];
    var Row_Version_No = [];
    var CCM_Customer_ID = [];
    var Contact_Relation = [];
    var is_Inherit = [];
    var Customer_Name = [];
    var is_Billable = [];
    var Effective_From = [];
    var Category = [];
    var Speciality_Code = [];
    var Ref_Key1 = [];
    var Ref_Key2 = [];
    var Depot_Code = [];
    var Registration_Number = [];
    var SubRegion_Code=[];

    $("input:checkbox[name=chkSelect]:checked").each(function () {
        rowcount = rowcount + 1;
        id = this.id.split('_')[1];

        customerCode.push($('#hdnCustomerCode_' + id).val());
        RegionTypeCode.push($('#hdnRegion_Type_Code_' + id).val());
        Row_Status.push($('#hdnRow_Status_' + id).val());
        CCM_Customer_ID.push($('#hdnCCM_Customer_ID_' + id).val());
        Row_Version_No.push($('#hdnRow_Version_No_' + id).val());
        Contact_Relation.push($('#hdnContact_Relation_' + id).val());
        is_Inherit.push($('#hdnIs_Inherited_' + id).val());
        Customer_Name.push($('#hdnCustomer_Name_' + id).val());
        is_Billable.push($('#hdnisBillable_' + id).val());
        Effective_From.push($('#hdnEffectiveFrom_' + id).val());
        Category.push($('#hdnCategory_' + id).val());
        Speciality_Code.push($('#hdnSpecialityCode_' + id).val());
        Ref_Key1.push($('#hdnRefKey1_' + id).val());
        Ref_Key2.push($('#hdnRefKey2_' + id).val());
        Depot_Code.push($('#hdnDepotCode_' + id).val());
        Registration_Number.push($('#hdnRegistrationNumber_' + id).val());
        SubRegion_Code.push($('#hdnSubRegionCode_' + id).val());

        debugger;
        var tdLen = $('#tblDoctor #tr_' + id).find("td").length;
        //for (var r = 0; r < parseInt(rowcount) ; r++) {
        for (var j = 1; j < tdLen; j++) {
            colData = colData + "!!" + $('#tblDoctor #tr_' + id).find("td")[j].innerHTML;
            col = colData.split('!!');
        }
        obj.push(col);
        col = "";
        colData = "";
        //}
        debugger;
    });
    if (id == "") {
        fnMsgAlert('info', 'Info', 'Please select atleast one stockiest');
        return false;
    }
    debugger;
    for (var r = 0; r < obj.length; r++) {
        var ob = new Object();
        for (var i = 0; i < headers.length; i++) {
            ob["Customer_Code"] = customerCode[r];
            ob["Region_Code"] = "";
            ob["Region_Type_Code"] = RegionTypeCode[r];
            ob["Customer_Status"] = "1";
            ob["Customer_Entity_Type"] = "STOCKIEST";
            ob["Row_Status"] = Row_Status[r];
            ob["Row_Version_No"] = Row_Version_No[r];
            ob["CCM_Customer_ID"] = CCM_Customer_ID[r];
            ob["Contact_Relation"] = Contact_Relation[r];
            ob["Is_Inherited"] = 1;
            ob["Source_Region_Code"] = regionCode;
            ob["Is_Billable"] = is_Billable[r];
            ob["Effective_From"] = Effective_From[r];
            ob["Category"] = Category[r];
            ob["Speciality_Code"] = Speciality_Code[r];
            ob["Ref_Key1"] = Ref_Key1[r];
            ob["Ref_Key2"] = Ref_Key2[r];
            ob["Depot_Code"] = Depot_Code[r];
            ob["Registration_Number"] = Registration_Number[r];
            ob["SubRegion_Code"] = SubRegion_Code[r];


            if (headers[i] == "Special_Discount_Rate") {
                if (obj[r][i + 1] != "") {
                    ob["Special_Discount_Rate"] = parseFloat(obj[r][i + 1]);
                }
                else {
                    ob["Special_Discount_Rate"] = 0.0;
                }
            }
            else if (headers[i] == "Octroi_Rate") {
                if (obj[r][i + 1] != "") {
                    ob["Octroi_Rate"] = parseFloat(obj[r][i + 1]);
                }
                else {
                    ob["Octroi_Rate"] = 0.0;
                }
            }
            else {
                ob[headers[i]] = obj[r][i + 1];
            }
        }
        rowArray.push(ob);
        ob = "";
    }
    debugger;
    rowArray = JSON.stringify(rowArray);


    CheckISInherited(customerCode, Customer_Name);
    if (Is_Inherited == "0") {
        debugger;
        ShowModalPopup("dvloading");
        $.ajax({
            url: '../HiDoctor_Master/StockistInheritance/InheritStockiest/',
            type: "POST",
            async: false,
            data: "stockiestArray=" + rowArray + "&TargetRegionCode=" + TargetUserCodes,
            success: function (jsData) {
                if (jsData == "Inserted Successfully") {
                    fnMsgAlert('info', 'Info', 'Selected stockiest are inherited from source region to target region');
                    HideModalPopup('dvLoading');
                    fnTreeWithChkBoxChildSelction("TargetRegionTree");
                    Is_Inherited = "";
                    $('#dvGrid').hide();
                    $('#dvStockiest').hide();
                    $('#btnShift').hide();
                    $('#btnInherit').hide();
                    return false;
                }
                else {
                    HideModalPopup("dvloading");
                    fnMsgAlert('info', 'Info', jsData);
                    return false;
                }
            }
        });
    }
    else {
        fnMsgAlert('info', 'Info', Is_Inherited);
        Is_Inherited = "";
        return false;
    }

}




















