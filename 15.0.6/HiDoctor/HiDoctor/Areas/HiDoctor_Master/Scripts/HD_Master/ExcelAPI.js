//Created By :SRISUDHAN
//Created Date:08/04/2014
//Screen Name: Excel API
var apiCategoryCode = "";
var check = "";
function fnSaveCategoryMaster() {
    if ($('#txtCategoryName').val() == "") {
        fnMsgAlert('info', 'Info', 'Enter The CategoryName');
        return false;
    }

    if ($.trim($("#txtCategoryName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The CategoryName');
        return false;
    }

    if (!(isNaN($("#txtCategoryName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid RequestCategoryName');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtCategoryName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the CategoryName');
        return false;
    }

    if ($.trim($("#txtCategoryName").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Request Name should not exceed 100 Characters');
        return false;
    }

    //if ($('#txtDescription').val() == "") {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}

    //if ($.trim($("#txtDescription").val()).length == 0) {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}



    var CategoryName = $.trim($("#txtCategoryName").val());
    var description = $.trim($("#txtDescription").val());
    var status = $("input[name='rptCat']:checked").val();
    if (check == "1") {
        fnMsgAlert('success', 'Category Master', 'Already Mapped');
        return false;
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/InsertAPICategory',
        data: "CategoryName=" + CategoryName + "&status=" + status + "&Description=" + description,
        success: function (data) {
            if (data == "1") {
                fnMsgAlert('success', 'Category Master', 'Saved Sucessfully');
                fnCancelCategoryMaster();
            }
            else if (data == "2") {
                fnMsgAlert('info', 'Error', 'Saved Failure');
            }
            else if (data == "6") {
                fnMsgAlert('info', 'Caution', 'Category Name Already Exists');
            }

            else if (data == "3") {
                fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
            }
        }

    });


}

function fnCancelCategoryMaster() {
    $("#txtCategoryName").val("");
    $("#txtDescription").val("");
    $('input:radio[name=rptCat][value=1]').prop('checked', true);
    $('input:radio[name=rptCat][value=0]').prop('checked', false);
    $('#btnSave').show();
    $('#btnUpdate').hide();
    $("#dvTable").html("");
}

function fnShowinlist() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetCategoryDetail',
        data: "A",
        success: function (result) {
            resultData = (result.split('*')[1]);
            if (result != '') {
                $("#dvTable").html(result.split('*')[0]);

            }
        }
    });
}

function fnEdit(val) {
    $('#btnSave').hide();
    apiCategoryCode = val.split('_')[0]
    var apiCategoryName = val.split('_')[1]
    var apiDiscription = val.split('_')[2]
    var apiStatus = val.split('_')[3]


    if (apiStatus == 'Enabled') {
        apiStatus = '1'
    }
    else {
        apiStatus = '0'
    }

    $("#txtCategoryName").val(apiCategoryName);
    $("#txtDescription").val(apiDiscription);
    $('input:radio[name=rptCat][value="' + apiStatus + '"]').prop('checked', true);
    $('#btnUpdate').show();

}



function fnUpdateCategoryMaster() {
    if ($('#txtCategoryName').val() == "") {
        fnMsgAlert('info', 'Info', 'Enter The Category Name');
        return false;
    }

    if ($.trim($("#txtCategoryName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Category Name');
        return false;
    }

    if (!(isNaN($("#txtCategoryName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Category Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtCategoryName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Category Name');
        return false;
    }

    if ($.trim($("#txtCategoryName").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Category Name should not exceed 100 Characters');
        return false;
    }

    //if ($('#txtDescription').val() == "") {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}

    //if ($.trim($("#txtDescription").val()).length == 0) {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}


    var CategoryName = $.trim($("#txtCategoryName").val());
    var description = $.trim($("#txtDescription").val());
    var status = $("input[name='rptCat']:checked").val();

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/UpdateAPICategory',
        data: "CategoryName=" + CategoryName + "&status=" + status + "&Description=" + description + "&APIcategoryID=" + apiCategoryCode,

        success: function (data) {
            if (data == "1") {
                fnMsgAlert('info', 'Category Master', 'Updated Sucessfully.');
                fnCancelCategoryMaster();
                $('#btnSave').show();
                $('#btnUpdate').hide();
            }
            else if (data == "2") {
                fnMsgAlert('info', 'Category Master', 'Sorry an error occured. Please try again later.');

            }
            else if (data == "6") {
                fnMsgAlert('info', 'Category Master', 'Category Name Already Exists.');

            }
          
        }
    });
}


//Excel API Service Definition Screen//

var categoryDrop = "";
//category dropdown
function fnGetAPICategory() {
    $('option', $("#ddlAPICategoryName")).remove()
    $.ajax({
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPICategory',
        type: "POST",
        success: function (JsonResult) {
            categoryDrop = JsonResult;
            if (categoryDrop != null) {
                if (categoryDrop.length > 0) {
                    fnAddOptionToSelect("ddlAPICategoryName", "-Select-", "0");
                    for (var i = 0; i < categoryDrop.length; i++) {
                        fnAddOptionToSelect("ddlAPICategoryName", categoryDrop[i].API_Category_Name, categoryDrop[i].API_Category_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlAPICategoryName", "-No CategoryName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlAPICategoryName", "-No CategoryName-", "0");
            }
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


function fnSaveService() {

    if (categoryDrop.length > 0) {
        if ($("#ddlAPICategoryName").val() == "0") {
            fnMsgAlert('info', 'Service', 'Please Select Category Name.');
            return false;
        }
    }
    if ($('#txtAPIServiceId').val() == "") {
        fnMsgAlert('info', 'Info', 'Enter The Service Id');
        return false;
    }

    if ($.trim($("#txtAPIServiceId").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Id');
        return false;
    }

    if (!(isNaN($("#txtAPIServiceId").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Service Id');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtAPIServiceId").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Service Id');
        return false;
    }

    //if ($('#txtAPIDescription').val() == "") {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}

    //if ($.trim($("#txtAPIDescription").val()).length == 0) {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}

    if ($('#txtAPIServiceType').val() == "") {
        fnMsgAlert('info', 'Info', 'Please enter the service type');
        return false;
    }

    if (!(isNaN($("#txtAPIServiceType").val()))) {
        fnMsgAlert('info', 'Info', 'Please enter the valid service type');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtAPIServiceType").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the service type');
        return false;
    }


    if ($('#txtAPIServiceParamNos').val() == " ") {
        fnMsgAlert('info', 'Info', 'Please enter the Service Param Nos');
        return false;
    }

    if ($.trim($("#txtAPIServiceParamNos").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please enter the Service Param Nos');
        return false;
    }

    if (isNaN($("#txtAPIServiceParamNos").val())) {
        fnMsgAlert('info', 'Info', 'Please enter the valid Service Param Nos');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtAPIServiceParamNos").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Service Param Nos');
        return false;
    }

    if ($('#txtAPIServiceParams').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Params');
        return false;
    }

    if ($.trim($("#txtAPIServiceParams").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Params');
        return false;
    }

    if ($('#txtAPIExcelOutputHeaders').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Excel Output Headers');
        return false;
    }

    if ($.trim($("#txtAPIExcelOutputHeaders").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Excel Output Headers');
        return false;
    }


    if ($('#txtAPIServiceInternalName').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The API Service Internal Name');
        return false;
    }

    if ($.trim($("#txtAPIServiceInternalName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The API Service Internal Name');
        return false;
    }

    if ($('#txtAPIServiceTypeMappingClassName').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Type Mapping Class Name');
        return false;
    }

    if ($.trim($("#txtAPIServiceTypeMappingClassName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Type Mapping Class Name');
        return false;
    }


    if ($('#txtAPIServiceName').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Name');
        return false;
    }

    if ($.trim($("#txtAPIServiceName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Name');
        return false;
    }

    var apiCategoryCode = $.trim($("#ddlAPICategoryName").val());
    var serviceId = $.trim($("#txtAPIServiceId").val());
    var serviceDescription = $.trim($("#txtAPIDescription").val());
    var servicetype = $.trim($("#txtAPIServiceType").val());
    var serviceParamNos = $.trim($("#txtAPIServiceParamNos").val());
    var serviceParams = $.trim($("#txtAPIServiceParams").val());
    var excelOutPutHeaders = $.trim($("#txtAPIExcelOutputHeaders").val());
    var serviceInternalSPName = $.trim($("#txtAPIServiceInternalName").val());
    var serviceTypeMappingClassName = $.trim($("#txtAPIServiceTypeMappingClassName").val());
    var serviceName = $.trim($("#txtAPIServiceName").val());
    var isVisible = $("input[name='rptOptions']:checked").val();

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/InsertAPIService',
        data: "APICategoryCode=" + apiCategoryCode + "&ServiceId=" + serviceId + "&ServiceDescription=" + serviceDescription + "&ServiceType=" +
        servicetype + "&ServiceParamNos=" + serviceParamNos + "&ServiceParams=" + serviceParams + "&ExcelOutPutHeaders=" + excelOutPutHeaders + "&ServiceInternalSPName=" +
        serviceInternalSPName + "&serviceTypeMappingClassName=" + serviceTypeMappingClassName + "&serviceName=" + serviceName + "&IsVisible=" + isVisible,
        success: function (data) {
            if (data == "1") {
                fnMsgAlert('success', 'Service', 'Saved Sucessfully');
                fnCancelservice();
            }
            else if (data == "2") {
                fnMsgAlert('info', 'Error', 'Saved Failure');
            }
            else if (data == "6") {
                fnMsgAlert('info', 'Caution', 'Service Name Already Exists');
            }

            else if (data == "3") {
                fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
            }
        }

    });


}



function fnShowAPIservicelist() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPIServiceDetail',
        data: "A",
        success: function (result) {
            resultData = (result.split('*')[1]);
            if (result != '') {
                $("#dvAPIServiceTable").html(result.split('*')[0]);

            }
        }
    });
}

//service edit//
var apiId = "";
function fnServiceEdit(val) {
    $('#btnServiceSave').hide();
    apiId = val;
    var categorycode = '';
    var status = '';
    if (val != '') {
        categorycode = $('#API_CategoryCode_' + apiId).html()
        $("#ddlAPICategoryName").val(categorycode);
        $('#txtAPIServiceId').val($('#API_ServiceId_' + apiId).html());
        $("#txtAPIDescription").val($('#API_ServiceDescrn_' + apiId).html());
        $("#txtAPIServiceType").val($('#API_ServiceType_' + apiId).html());
        $("#txtAPIServiceParamNos").val($('#API_ServiceParamNos_' + apiId).html());
        $("#txtAPIServiceParams").val($('#API_ServiceParams_' + apiId).html());
        $("#txtAPIExcelOutputHeaders").val($('#API_ServiceOutputHeaders_' + apiId).html());
        $("#txtAPIServiceInternalName").val($('#API_ServiceInternalName_' + apiId).html());
        $("#txtAPIServiceTypeMappingClassName").val($('#API_ServiceTypeMappingClassName_' + apiId).html());
        $("#txtAPIServiceName").val($('#API_ServiceName_' + apiId).html());
        status = $('#API_Is_Visible_' + apiId).html();
        if (status == 'YES') {
            status = '1'
        }
        else {
            status = '0'
        }
        $('input:radio[name=rptOptions][value="' + status + '"]').prop('checked', true);
        $('#btnserviceUpdate').show();
    }
}


function fnCancelservice() {
    $("#ddlAPICategoryName").val("0");
    $("#txtAPIServiceId").val(" ");
    $("#txtAPIDescription").val(" ");
    $("#txtAPIServiceType").val(" ");
    $("#txtAPIServiceParamNos").val(" ");
    $("#txtAPIServiceParams").val(" ");
    $("#txtAPIExcelOutputHeaders").val(" ");
    $("#txtAPIServiceInternalName").val(" ");
    $("#txtAPIServiceTypeMappingClassName").val(" ");
    $("#txtAPIServiceName").val(" ");
    $("#txtAPIServiceId").val(" ");
    $("#txtAPIServiceId").val(" ");
    $('input:radio[name=rptOptions][value=1]').prop('checked', true);
    $('input:radio[name=rptOptions][value=0]').prop('checked', false);
    $("#dvAPIServiceTable").html("");
    $('#btnserviceUpdate').hide();
    $('#btnServiceSave').show();
}


function fnUpdateService() {


    if (categoryDrop.length > 0) {
        if ($("#ddlAPICategoryName").val() == "0") {
            fnMsgAlert('info', 'Service', 'Please Select Category Name.');
            return false;
        }
    }
    if ($('#txtAPIServiceId').val() == "") {
        fnMsgAlert('info', 'Info', 'Enter The Service Id');
        return false;
    }

    if ($.trim($("#txtAPIServiceId").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Id');
        return false;
    }

    if (!(isNaN($("#txtAPIServiceId").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid ServiceId');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtAPIServiceId").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Service Id');
        return false;
    }

    //if ($('#txtAPIDescription').val() == "") {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}

    //if ($.trim($("#txtAPIDescription").val()).length == 0) {
    //    fnMsgAlert('info', 'Info', 'Enter The Description');
    //    return false;
    //}

    if ($('#txtAPIServiceType').val() == "") {
        fnMsgAlert('info', 'Info', 'Please enter the service type');
        return false;
    }

    if (!(isNaN($("#txtAPIServiceType").val()))) {
        fnMsgAlert('info', 'Info', 'Please enter the valid service type');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtAPIServiceType").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the service type');
        return false;
    }


    if ($('#txtAPIServiceParamNos').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Param Nos');
        return false;
    }

    if ($.trim($("#txtAPIServiceParamNos").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Param Nos');
        return false;
    }

    if (isNaN($("#txtAPIServiceParamNos").val())) {
        fnMsgAlert('info', 'Info', 'Please enter the valid Service Param Nos');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtAPIServiceParamNos").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Service Param Nos');
        return false;
    }

    if ($('#txtAPIServiceParams').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Params');
        return false;
    }

    if ($.trim($("#txtAPIServiceParams").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Params');
        return false;
    }

    if ($('#txtAPIExcelOutputHeaders').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Excel Output Headers');
        return false;
    }

    if ($.trim($("#txtAPIExcelOutputHeaders").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Excel Output Headers');
        return false;
    }


    if ($('#txtAPIServiceInternalName').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The API Service Internal Name');
        return false;
    }

    if ($.trim($("#txtAPIServiceInternalName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The API Service Internal Name');
        return false;
    }

    if ($('#txtAPIServiceTypeMappingClassName').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Type Mapping Class Name');
        return false;
    }

    if ($.trim($("#txtAPIServiceTypeMappingClassName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Type Mapping Class Name');
        return false;
    }


    if ($('#txtAPIServiceName').val() == " ") {
        fnMsgAlert('info', 'Info', 'Enter The Service Name');
        return false;
    }

    if ($.trim($("#txtAPIServiceName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Service Name');
        return false;
    }





    var apiCategoryCode = $.trim($("#ddlAPICategoryName").val());
    var serviceId = $.trim($("#txtAPIServiceId").val());
    var serviceDescription = $.trim($("#txtAPIDescription").val());
    var servicetype = $.trim($("#txtAPIServiceType").val());
    var serviceParamNos = $.trim($("#txtAPIServiceParamNos").val());
    var serviceParams = $.trim($("#txtAPIServiceParams").val());
    var excelOutPutHeaders = $.trim($("#txtAPIExcelOutputHeaders").val());
    var serviceInternalSPName = $.trim($("#txtAPIServiceInternalName").val());
    var serviceTypeMappingClassName = $.trim($("#txtAPIServiceTypeMappingClassName").val());
    var serviceName = $.trim($("#txtAPIServiceName").val());
    var isVisible = $("input[name='rptOptions']:checked").val();

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/UpdateAPIService',
        data: "APICategoryCode=" + apiCategoryCode + "&ServiceId=" + serviceId + "&ServiceDescription=" + serviceDescription + "&ServiceType=" +
        servicetype + "&ServiceParamNos=" + serviceParamNos + "&ServiceParams=" + serviceParams + "&ExcelOutPutHeaders=" + excelOutPutHeaders + "&ServiceInternalSPName=" +
        serviceInternalSPName + "&serviceTypeMappingClassName=" + serviceTypeMappingClassName + "&serviceName=" + serviceName + "&IsVisible=" + isVisible + "&apiID=" + apiId,

        success: function (data) {
            if (data == "1") {
                fnMsgAlert('info', 'Service Master', 'Updated Sucessfully.');
                fnCancelservice();
                $('#btnServiceSave').show();
                $('#btnserviceUpdate').hide();
            }
            else if (data == "2") {
                fnMsgAlert('info', 'Service Master', 'Sorry an error occured. Please try again later.');

            }
            else if (data == "6") {
                fnMsgAlert('info', 'Service Master', 'Service Name Already Exists.');

            }
           
        }
    });
}



var serviceIdDrop = "";
//category dropdown
function fnGetAPIServiceID() {
    $('option', $("#ddlAPIServiceID")).remove()
    $("#dvAPIServiceDefiTable").html("");
    $("#btnDefserviceServiceSave").hide();
    $.ajax({
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPIServiceID',
        type: "POST",
        success: function (JsonResult) {
            serviceIdDrop = JsonResult;
            if (serviceIdDrop != null) {
                if (serviceIdDrop.length > 0) {
                    fnAddOptionToSelect("ddlAPIServiceID", "-Select-", "0");
                    for (var i = 0; i < serviceIdDrop.length; i++) {
                        fnAddOptionToSelect("ddlAPIServiceID", serviceIdDrop[i].ServiceId, serviceIdDrop[i].API_ID);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlAPIServiceID", "-No ServiceName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlAPIServiceID", "-No ServiceName-", "0");
            }
        }
    });
}

function fngo() {
    $("#dvAPIServiceDefiTable").html("");
    if (serviceIdDrop.length > 0) {
        if ($("#ddlAPIServiceID").val() == "0") {
            fnMsgAlert('info', 'Service', 'Please Select Service Name.');
            return false;
        }
    }
    var apiServiceId = $.trim($("#ddlAPIServiceID").val());

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPIServiceDefinInputDetail',
        data: "APIServiceId=" + apiServiceId,
        success: function (result) {
            resultData = (result.split('*')[1]);
            if (result != '') {
                $("#dvAPIServiceDefiTable").html(result.split('*')[0]);
                $("#btnDefserviceServiceSave").show();
            }
        }
    });

}

function fnGetSession() {
    var table = $('#tblAPIInputs tr');
    for (var i = 0; i < table.length; i++) {
        if ($("#Chk_getsession_" + i).attr('checked')) {
            $("#Chk_UI_" + i).prop('disabled', true);
            $("#ddlControl_" + i).prop('disabled', true);
        }
        else {
            $("#Chk_UI_" + i).prop('disabled', false);
            $("#ddlControl_" + i).prop('disabled', false);
        }
    }
}

function fnGetUI() {

    var table2 = $('#tblAPIInputs tr');
    for (var i = 0; i < table2.length; i++) {
        if ($("#Chk_UI_" + i).attr('checked')) {
            $("#Chk_getsession_" + i).prop('disabled', true);
            $("#ddlSessionSelection_" + i).prop('disabled', true);
        }
        else {
            $("#Chk_getsession_" + i).prop('disabled', false);
            $("#ddlSessionSelection_" + i).prop('disabled', false);
        }
    }
}

function fnMapService() {

    if (serviceIdDrop.length > 0) {
        if ($("#ddlAPIServiceID").val() == "0") {
            fnMsgAlert('info', 'Service', 'Please Select Service Name.');
            return false;
        }
    }

    var DefdetailedRow = $('#tblAPIInputs tr');
    var DefapiUiid = $.trim($("#ddlAPIServiceID").val());
    var serviceID = $("#ddlAPIServiceID :selected").text()
    var apiArray = new Array();
    for (var i = 0; i < DefdetailedRow.length; i++) {
        if (i > 0) {

            var serviceParem = $('#splitParam_' + i).html();
            var displayOrder = $('#paramOrder_' + i).val();
            var sessionKey = $('#ddlSessionSelection_' + i).val();
            //var showinUi = "";

            var showinUi = (($("#Chk_UI_" + i).attr('checked')) ? "Y" : "N");
            var sessionGet = (($("#Chk_getsession_" + i).attr('checked')) ? "Y" : "N");



            if (showinUi == "N" && sessionGet == "N") {
                fnMsgAlert('info', 'Service', 'Please select session Key and control type.');
                return false;
            }

            if ($('#ddlSessionSelection_' + i).val() == "0" && $('#ddlControl_' + i).val() == "0") {
                fnMsgAlert('info', 'Service', 'Please select session Key and control type.');
                return false;
            }

            var controlType = $('#ddlControl_' + i).val();


            if (controlType == "0") {
                controlType = "TEXT";
            }

            if (sessionKey == "0") {
                sessionKey = "";
            }

            var description = $('#Description_' + i).val();
            var ServiceId = serviceID;
            var API_ID = DefapiUiid;

            var api = {};
            api.InputParam = serviceParem;
            api.ParamOrder = displayOrder;
            api.Session_Key = sessionKey;
            api.Type = controlType;
            api.Help_Description = description;
            api.serviceID = serviceID;
            api.API_ID = API_ID;
            api.Show_In_UI = showinUi;
            apiArray.push(api);

        }
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/InsertAPIUIDef',
        data: "APIJson=" + JSON.stringify(apiArray),

        success: function (data) {
            if (data != " ") {
                fnMsgAlert('info', 'Service', 'Mapped Sucessfully.');

            }
            else {
                fnMsgAlert('info', 'service', 'Sorry an error occured. Please try again later.');

            }
        }
    });


}

//function fnCancelUI() {
//    $("#ddlAPIServiceID").val("0");
//    $("#ddlSessionSelection_").val("0");
//    $("#ddlControl_").val("0");
//}


//ddlAPICompanyServiceID

function fnGetAPICompanyServiceID() {
    $('option', $("#ddlAPICompanyServiceID")).remove()
    $.ajax({
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPIServiceID',
        type: "POST",
        success: function (JsonResult) {
            serviceIdDrop = JsonResult;
            if (serviceIdDrop != null) {
                if (serviceIdDrop.length > 0) {
                    fnAddOptionToSelect("ddlAPICompanyServiceID", "-Select-", "0");
                    for (var i = 0; i < serviceIdDrop.length; i++) {
                        fnAddOptionToSelect("ddlAPICompanyServiceID", serviceIdDrop[i].ServiceId, serviceIdDrop[i].API_ID);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlAPICompanyServiceID", "-No ServiceName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlAPICompanyServiceID", "-No ServiceName-", "0");
            }
            fnUsertyprGrid();
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


function fnUsertyprGrid() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPIServiceUserType',
        data: "A",
        success: function (result) {
            resultData = (result.split('*')[1]);
            if (result != '') {
                $("#dvAPIAccessTable").html(result.split('*')[0]);

            }
        }
    });

}

function fnselectall() {
    if ($('#bulkcheck').is(":checked")) {
        $("input:checkbox[name=chk_Access]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chk_Access]").removeAttr('checked');
    }
}


function fnMapCompanyService() {
    if (serviceIdDrop.length > 0) {
        if ($("#ddlAPICompanyServiceID").val() == "0") {
            fnMsgAlert('info', 'Service', 'Please Select Service Name.');
            return false;
        }
    }

    if (!$("input[name='chk_Access']").is(":checked")) {
        fnMsgAlert('info', 'API', 'Please select alteast user type');
        HideModalPopup("dvloading");
        return false;
    }

    var detailedmapRow = $('#tblAPIUserType tr');
    var apiUimapid = $.trim($("#ddlAPICompanyServiceID").val());
    var apimapArray = new Array();
    for (var i = 0; i < detailedmapRow.length; i++) {

        if ($("#Chk_Access_" + i).attr('checked')) {
            var userTypeName = $('#userTypeName_' + i).html();
            var usertypeCode = $('#userTypeCode_' + i).html();
            var API_ID = apiUimapid;

            var api = {};
            api.User_Type_Code = usertypeCode;
            api.User_Type_Name = userTypeName;
            api.API_ID = API_ID;
            apimapArray.push(api);
        }
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/InsertAPICompanyAccess',
        data: "APICompanyJson=" + JSON.stringify(apimapArray),

        success: function (data) {
            if (data != " ") {
                fnMsgAlert('info', 'Service', 'Mapped Sucessfully.');

            }
            else {
                fnMsgAlert('info', 'service', 'Sorry an error occured. Please try again later.');

            }

        }
    });


}


function fnComapanygo() {
    if (serviceIdDrop.length > 0) {
        if ($("#ddlAPICompanyServiceID").val() == "0") {
            fnMsgAlert('info', 'Service', 'Please Select Service Name.');
            return false;
        }
    }

    var apiComServiceId = $.trim($("#ddlAPICompanyServiceID").val());

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/ExcelAPIConfiquration/GetAPIServiceMappedDetail',
        data: "APIServiceId=" + apiComServiceId,
        success: function (result) {
            resultData = (result);
            var length = $("#tblAPIUserType tr").length
            for (var i = 0; i < length ; i++) {
                var userTypeCode = $("#userTypeCode_" + i).html();
                var apiId = apiComServiceId;
                var companyCode = $("#companyCode_" + i).html();
                var dJsonData = jsonPath(result, "$.[?(@.User_Type_Code=='" + userTypeCode + "' & @.Company_Code=='" + companyCode + "')]");

                if (dJsonData != false && dJsonData.length > 0) {
                    $("#Chk_Access_" + i).attr('checked', true);
                }

            }
        }
    });
}


