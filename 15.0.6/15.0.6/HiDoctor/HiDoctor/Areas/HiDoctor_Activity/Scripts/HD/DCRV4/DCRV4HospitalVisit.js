var producthsptlRowIndex_g = 0;
var ActivityAutoFill_g = new Array();
var DoctorBusiness_g = new Array();
var HospitalAutoFill_g = new Array();
var HospitalContactAutoFill_g = new Array();
var screenTitle = "Doctor/Customer & Sample/Promotional items";
var docAlertTitle = "Doctor/Customer Details";
var docAccAlertTitle = "Accompanist Details";
var docSampleAlertTitle = "Sample/Promotional items";
var docDetProdAlertTitle = "Detailed Products";
var docCheRCPAAlertTitle = "Chemist/RCPA Details";
var docFollowUps = 'Follow-Ups';
var docActivityTitle = 'Activity';
var dcrHospitalVisit_g = "";
var dcoSalesProductsTitle = 'Product Name';
var dvcode = "";
var prodvalue = "";
var details_g = "";
var contacts_g = "";
var activity_g = "";
var product_g = "";
var res = "";
var saveval = "";
var visitresult = "";
var lstbatch = "";
var intres = "";
var batches = "";
var stock = "";
var samplevalidate = "";
var isThereAnyOneDoctorSavedH = "";
var HospitalVisit = {
    defaults: {
        //CompanyCode: "",
        //CompanyId: "",
        //RegionCode: "",
        //UserCode: "",
        "formMode_g": "",
    },

    Onit: function () {
        //$('#txthsptlname').change(function () {
        //    debugger;
        //    HospitalVisit.GetHospitalContactdetails();
        //});
        // HospitalVisit.fnonchangecontact(id);
        HospitalVisit.GetHospitaldetails();
        HospitalVisit.fnAddHospitalContactRow(null);
        HospitalVisit.fnGetHospitalVisitdetails();
        // HospitalVisit.GetHospitalActivitydetails();
        HospitalVisit.fnAddHospitalActivityRow(null);
        HospitalVisit.fnGetUserProductsAndSetAutoFill();
        HospitalVisit.fnAddHospitalproductRow(null);
    },
    fnHospitalcancel: function () {
        HospitalVisit.fnHospitalClearForm();
    },
    fnSetFormMode: function (event) {
        debugger;
        if (event != null && event.target != null && event.target.value == "Reset") {
            return true;
        }
        else {
            if (event.target.id != 'btnHsptlInsertCP')
                formMode_g = "Edit";
        }
    },
    fngetcontact: function () {
        debugger;
        HospitalVisit.GetHospitalContactdetails();
    },
    fnonchangecontact: function (curObj) {
        debugger;
        if (curObj != null) {
            id = parseInt(curObj.id.split('_')[3]);
        }
        var Contactdetails = $.grep(HospitalContactAutoFill_g, function (element, index) {
            return element.value == $("#hdncontact_Code_" + id + "").val();
        });
        $("#txtmobile_" + id + "").val(Contactdetails[0].Mobile_Number);
        $("#txtemail_" + id + "").val(Contactdetails[0].Email_Id);
        if ($("#txtmobile_" + id + "") != "") {
            $("#txtmobile_" + id + "").attr('disabled', true);
        }
        else {
            $("#txtmobile_" + id + "").attr('disabled', false);
        }
        if ($("#txtemail_" + id + "") != "") {
            $("#txtemail_" + id + "").attr('disabled', true);
        }
        else {
            $("#txtemail_" + id + "").attr('disabled', false);
        }
    },
    GetHospitaldetails: function () {
        debugger;
        Method_params = ["DCRHospitalVisit/GetHospitaldetails", CompanyCode, RegionCode];
        CoreREST.get(null, Method_params, null, HospitalVisit.BindSuccessData, HospitalVisit.BindFailure);
    },
    BindSuccessData: function (response) {
        debugger;
        HospitalAutoFill_g = response.list;
        autoComplete(HospitalAutoFill_g, "txthsptlname", "hdnHospitalCode", "autoHospital");
    },
    BindFailure: function () {

    },
    GetHospitalContactdetails: function () {
        debugger;
        Method_params = ["DCRHospitalVisit/GetHospitalcontactdetails", CompanyCode, RegionCode, $("#hdnHospitalCode").val()];
        CoreREST.get(null, Method_params, null, HospitalVisit.BindContactSuccessData, HospitalVisit.BindContactFailure);
    },
    BindContactSuccessData: function (response) {
        debugger;
        HospitalContactAutoFill_g = response.list;
        autoComplete(HospitalContactAutoFill_g, "txt_contact_Name_", "hdncontact_Code_", "autocontact");
    },
    BindContactFailure: function () {

    },
    GetHospitalActivitydetails: function () {
        debugger;
        Method_params = ["DCRHospitalVisit/GetDoctorBusinessAndActivityMaster", CompanyCode, RegionCode, $("#hdnHospitalCode").val()];
        CoreREST.get(null, Method_params, null, HospitalVisit.BindActivitySuccessData, HospitalVisit.BindActivityFailure);
    },
    BindActivitySuccessData: function (response) {
        debugger;
        ActivityAutoFill_g = response.list;
        // autoComplete(ActivityAutoFill_g, "txt_contact_Name_", "hdncontact_Code_", "autocontact");
    },
    BindActivityFailure: function () {

    },
    GetProductdetails: function () {
        debugger;
        Method_params = ["DCRHospitalVisit/GetSaleProductsList", CompanyCode, RegionCode, $("#hdnHospitalCode").val()];
        CoreREST.get(null, Method_params, null, HospitalVisit.BindActivitySuccessData, HospitalVisit.BindActivityFailure);
    },
    BindActivitySuccessData: function (response) {
        debugger;
        ActivityAutoFill_g = response.list;
        // autoComplete(ActivityAutoFill_g, "txt_contact_Name_", "hdncontact_Code_", "autocontact");
    },
    BindActivityFailure: function () {

    },
    //GetDoctorBusinessAndActivityMaster: function () {
    //    var activity = 0;
    //    if (doc_Visit_Controls_g.indexOf(activity_privilege_name) >= 0)
    //        activity = 1;
    //    $.ajax({
    //        type: 'GET',
    //        url: '../DCRV4DoctorVisit/GetDoctorBusinessAndActivityMaster',
    //        date: 'activity=' + activity,
    //        async: false,
    //        success: function (result) {
    //            $("#divBusinessStatus").hide();
    //            if (result.lsBusinessStatus != null && result.lsBusinessStatus.length > 0) {
    //                var product = $.grep(result.lsBusinessStatus, function (element, index) {
    //                    return element.Entity_Type == 2;
    //                });
    //                if (product.length > 0)
    //                    DoctorBusiness_g = product;
    //                else
    //                    DoctorBusiness_g = [];
    //                var doctor = $.grep(result.lsBusinessStatus, function (element, index) {
    //                    return element.Entity_Type == 1;
    //                });
    //                if (doctor.length > 0)
    //                    DoctorBusinessList_g = doctor;
    //                else
    //                    DoctorBusinessList_g = [];
    //            }
    //            else {
    //                DoctorBusiness_g = [];
    //                DoctorBusinessList_g = [];
    //            }
    //            if (result.lsDCRActivity != null)
    //                ActivityAutoFill_g = result.lsDCRActivity;
    //            else
    //                ActivityAutoFill_g = [];

    //            if (result.lsCallObjective != null)
    //                CallObjective_g = result.lsCallObjective;
    //            else
    //                CallObjective_g = [];


    //        }
    //    });
    //},
    fnAddHospitalActivityRow: function (curObj, isDraft) {
        debugger;
        var id = 0;
        if (curObj != null)
            id = parseInt(curObj.id.split('_')[3]);
        else if (isDraft == null) {
            $("#tbl_HospitalActivity tbody").html('');
        }
        else if (isDraft > 0) {
            id = isDraft;
        }
        var row = "<tr><td style='width: 40%;'><input style='bottom: 25px;position: relative;width: 89%;' class='autoActivity' id='txt_HospitalActivity_Name_" + (id + 1) + "' type='text' ondblclick='HospitalVisit.fnAddHospitalActivityRow(this)' />";
        row += "<input type='hidden' id='hdnHospitalActivity_Code_" + (id + 1) + "' /> <input type='hidden' id='hdnHospitalActivityType_" + (id + 1) + "' /> </td>";
        row += "<td><div id='divRemark_" + (id + 1) + "'><textarea maxlength='250' id='txtHospitalRemark_" + (id + 1) + "' /></div></td>";
        row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="HospitalVisit.fnDeleteHospitalactivity(this)"/> </td>';
        row += "</tr>";

        $("#tbl_HospitalActivity").append(row);
        autoComplete(ActivityAutoFill_g, "txt_HospitalActivity_Name_", "hdnHospitalActivity_Code_", "autoActivity");
        for (var i = 1; i < $("#tbl_Activity tr").length - 1; i++) {
            $("#tbl_HospitalActivity tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("onkeyup");
            $("#tbl_HospitalActivity tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("ondblclick");
        }
    },
    fnDeleteHospitalactivity: function (curObj) {
        debugger;
        var index = $(curObj).parent().parent().index() + 1;
        var tblIndex = $("#tbl_HospitalActivity tbody tr").length;
        if (index == tblIndex) {
            fnMsgAlert('info', docActivityTitle, 'You are not allowed to delete this row!');
        }
        else {
            $(curObj).parent().parent().remove();
        }
    },
    fnAddHospitalContactRow: function (curObj, isDraft) {
        debugger;
        var id = 0;
        if (curObj != null)
            id = parseInt(curObj.id.split('_')[3]);
        else if (isDraft == null) {
            $("#tbl_Contacts tbody").html('');
        }
        else if (isDraft > 0) {
            id = isDraft;
        }
        var row = "<tr><td style='width: 40%;'><input style='position: relative;width: 89%;' class='autocontact' id='txt_contact_Name_" + (id + 1) + "' type='text' ondblclick='HospitalVisit.fnAddHospitalContactRow(this)'  onkeyup='HospitalVisit.fnAddHospitalContactRow(this)'  onblur='HospitalVisit.fnonchangecontact(this);'/>";//onblur=' HospitalVisit.fnValidateContact(this)'
        row += "<input type='hidden' id='hdncontact_Code_" + (id + 1) + "' /> <input type='hidden' id='hdncontactType_" + (id + 1) + "' /> </td>";
        row += "<td><div id='divmobile_" + (id + 1) + "'><input type='text' id='txtmobile_" + (id + 1) + "' /></div></td>";
        row += "<td><div id='divemail_" + (id + 1) + "'><input type='text' id='txtemail_" + (id + 1) + "' /></div></td>";
        row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="HospitalVisit.fnDeleteHospitalcontact(this)"/> </td>';
        row += "</tr>";

        $("#tbl_Contacts").append(row);
        autoComplete(HospitalContactAutoFill_g, "txt_contact_Name_", "hdncontact_Code_", "autocontact");
        for (var i = 1; i < $("#tbl_Contacts tr").length - 1; i++) {
            $("#tbl_Contacts tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("onkeyup");
            $("#tbl_Contacts tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("ondblclick");
        }
    },
    fnDeleteHospitalcontact: function (curObj) {
        debugger;
        var index = $(curObj).parent().parent().index() + 1;
        var tblIndex = $("#tbl_Contacts tbody tr").length;
        if (index == tblIndex) {
            fnMsgAlert('info', docActivityTitle, 'You are not allowed to delete this row!');
        }
        else {
            $(curObj).parent().parent().remove();
        }
    },


    fnGetUserProductsAndSetAutoFill: function () {
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
                    autoComplete(productAutoFill_g, "txtHospitalProd_", "hdnHospitalProd_", "autoHospitalProduct");
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
    },
    fnvalidate: function (ele, e) {
        debugger;
        //alert(e.keyCode);
        if (e.charCode == 45) {
            // $('#name_err').hide();
            return false;
        }
        else if (e.charCode == 8 ||
                e.charCode == 9 ||
                e.charCode == 46 ||
                (e.charCode >= 37 && e.charCode <= 40) ||
                (e.charCode >= 48 && e.charCode <= 57) ||
                (e.charCode >= 65 && e.charCode <= 90) ||
                (e.charCode >= 96 && e.charCode <= 105)) {
            return false;
        }
        else {
            //  $('#name_err').show();
            return true;
        }
    },
    fnAddHospitalproductRow: function (isDraft, curProdObject) {
        debugger;
        //if (isDraft == null) {
        //     $("#tbl_HospitalProducts tr").html('');
        //}
        // Increment the row Index. Retrieve the row length and insert a new row.
        producthsptlRowIndex_g++;

        var tblProductRowLength = $('#tbl_HospitalProducts tr').length;
        var newProductRow = document.getElementById('tbl_HospitalProducts').insertRow(parseInt(tblProductRowLength));
        newProductRow.id = "ProdHsptlRow" + producthsptlRowIndex_g;

        // Product Name.
        var td0 = newProductRow.insertCell(0);
        var htmlvalue = "";


        if (isDraft) {
            htmlvalue = "<input type='text' id='txtHospitalProd_" + producthsptlRowIndex_g + "' class='autoHospitalProduct txtHospitalproduct setfocus' maxlength='299'  onblur='HospitalVisit.fnDCRProductBlur(" + producthsptlRowIndex_g + ")'  /><input type='hidden' id='hdnHospitalProd_" + producthsptlRowIndex_g + "'  />";
        }
        else {
            htmlvalue = "<input type='text' id='txtHospitalProd_" + producthsptlRowIndex_g + "' ondblclick='HospitalVisit.fnAddHospitalproductRow(null,this)'  onkeyup='HospitalVisit.fnAddHospitalproductRow(null,this)' maxlength='299' ";
            htmlvalue += "class='autoHospitalProduct txtHospitalproduct setfocus'  onblur='HospitalVisit.fnDCRProductBlur(" + producthsptlRowIndex_g + ")'  /><input type='hidden' id='hdnHospitalProd_" + producthsptlRowIndex_g + "' />";
        }


        $(td0).html(htmlvalue);
        $(td0).addClass("txtHospitalproduct");


        var td1 = newProductRow.insertCell(1);
        $(td1).append("<select onchange='HospitalVisit.fnSamplehsptlQtyChange(" + producthsptlRowIndex_g + ",1);' style='width:120px;' id='selHospitalBatch_" + producthsptlRowIndex_g + "' > </select>")

        $(td1).addClass("selHospitalBatch");

        // Product Qty.
        var td2 = newProductRow.insertCell(2);
        var qtydefault = input_hsptlqty_default_g == "NO" ? "" : "0";
        $(td2).html("<input type='text' align='center' maxlength='3' onchange='HospitalVisit.fnSamplehsptlQtyChange(" + producthsptlRowIndex_g + ",1)' id='txthsptlProdQty_" + producthsptlRowIndex_g + "' class='checkhsptlinteger' value='" + qtydefault + "'/>")
        $(td2).addClass("txtqty");
        $(td2).attr('align', 'center');

        // Detailed Check box.
        var td3 = newProductRow.insertCell(3);
        if ($('#hdnsoe').val().toUpperCase() != "TABLET") {
            $(td3).html("<input type='checkbox' id='chkProdDetail" + producthsptlRowIndex_g + "'  />");
            //$('#hdr_detailed').css('display', '');
            $("#chkProdDetail" + producthsptlRowIndex_g).css('display', '');
        }
        else {
            $(td3).html("<input type='checkbox' id='chkProdDetail" + producthsptlRowIndex_g + "' style='display:none' />");
            //$('#hdr_detailed').css('display', 'none');
            $("#chkProdDetail" + producthsptlRowIndex_g).css('display', 'none');
            //$('#hdr_detailed').css('display', 'none');
        }
        $(td3).append("<input type='hidden' id='hdnhsptlBatches_" + producthsptlRowIndex_g + "' /> ")
        $(td3).addClass('txtqty');
        $(td3).attr('align', 'left');
        $(td3).css('display', 'none');

        // Remove icon.
        var td4 = newProductRow.insertCell(3);
        $(td4).html("<img id='prodRemove" + producthsptlRowIndex_g + "' src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick='HospitalVisit.fnDeleteHospitalproduct(" + producthsptlRowIndex_g + ")' />");
        if (curProdObject != null) {
            curProdObject.onkeyup = null;
            curProdObject.ondblclick = null;
        }
        if (productAutoFill_g != null && productAutoFill_g.length > 0) {
            autoComplete(productAutoFill_g, "txtHospitalProd_", "hdnHospitalProd_", "autoHospitalProduct");
        }
        $(".setfocus").click(function () {
            $(this).select();
        });
        //$(".checkhsptlinteger").blur(function () {
        //    $(this).blur(function () {
        //        HospitalVisit.fnhsptlChekInteger(this)
        //    });
        //});

    },
    fnTableShowHide: function (tableid, spnid) {
        debugger;
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
    },

    fnhsptlChekInteger: function (id) {
        debugger;
        var intregex = new RegExp("^[0-9]+$");
        if (id != undefined || id != "") {
            if (!intregex.test(id)) {
                fnMsgAlert('info', 'Information', 'Please enter integer value only.');
                $(id).val('');
                HospitalVisit.fnErrorIndicator(id);
                intres = false;
                return false;
            }
            else {
                HospitalVisit.fnRemoveErrorIndicatior(id);
                intres = true;
                return true;
            }
        }
        return true;
    },
    fnErrorIndicator: function (id) {
        $(id).css('backgroundColor', '#efefef');
        $(id).focus();
    },
    fnErrorIndicatorforSFC: function (id) {
        $(id).css('backgroundColor', '#efefef');
    },
    fnRemoveErrorIndicatior: function (id) {
        $(id).css('backgroundColor', '#fff');
    },
    fnSamplehsptlQtyChange: function (index, val) {
        debugger;
        if ($("#hdnhsptlBatches_" + index).val().trim().length > 0) {
            batches = eval('(' + $("#hdnhsptlBatches_" + index).val() + ')');
            stock = 0;
            if (val == 1) {
                if (batches.list.length > 0) {
                    var res = $.grep(batches.list, function (ele) {
                        return ele.Batch_Number == $("#selHospitalBatch_" + index.toString() + " option:selected").val();
                    });
                    if (res.length > 0)
                        stock = res[0].Current_Stock;
                }
            }
            else {
                if (batches.list.length > 0) {
                    var res = $.grep(batches.list, function (ele) {
                        return ele.Batch_Number == $("#selHospitalBatch_" + index.toString() + " option:selected").val();
                    });
                    if (res.length > 0)
                        stock = res[0].Current_Stock;
                }
            }
            if (parseInt($("#txthsptlProdQty_" + index.toString()).val()) > stock) {
                HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                fnMsgAlert('info', 'error', 'Quantity exceeds the available stock for this batch.');
                $("#txthsptlProdQty_" + index.toString()).val(stock);
                //  return false;
                samplevalidate = false;
            }
            else {
                samplevalidate = true;
            }
        }
    },
    fnSampleProductChange: function (index) {
        debugger;
        prodvalue = index;
        if ($("#hdnHospitalProd_" + prodvalue.toString()).val().trim() != "") {
            var productCode = $("#hdnHospitalProd_" + prodvalue.toString()).val().trim().split("_")[0];
            var Batches = "";
            HospitalVisit.fnGetProductBatch(productCode, 'H', dvcode);

        }
        else {
            $("#selHospitalBatch_" + prodvalue.toString()).html("<option value=''>-No Batch Found-</option>");
            $("#hdnhsptlBatches_" + prodvalue.toString()).val("");
            $("#txthsptlProdQty_" + prodvalue).val('0');
        }
    },

    fnDCRProductBlur: function (index) {
        debugger;
        var text = $("#txtHospitalProd_" + index).val();
        var arr = $.grep(productAutoFill_g, function (ele) {
            return ele.label == text;
        });

        if (arr.length <= 0) {
            //fnValidateAutofill(this, productAutoFill_g, "txtProd_" + index, "hdnProd_" + index);
            $("#hdnHospitalProd_" + index).val("");
        }
        else {
            $("#hdnHospitalProd_" + index).val(arr[0].Product_Code);
        }
        HospitalVisit.fnSampleProductChange(index)
    },
    fnGetProductBatch: function (productCode, entity, dvcode) {
        debugger;
        if (dvcode == "") {
            dvcode = 0
        }
        Method_params = ["DCRHospitalVisit/GetHospitalproductBatch", CompanyCode, productCode, dcrActualDate_g, UserCode, 'H', dvcode, flag_g];
        CoreREST.getsync(null, Method_params, null, HospitalVisit.BindProductBatchSuccessData, HospitalVisit.BindProductBatchFailure);
    },
    BindProductBatchSuccessData: function (response) {
        debugger;
        lstbatch = response.list;
        // if (dvcode=="") {
        if (response.list.length > 0) {
            var strhtml = "";
            for (var i = 0; i < response.list.length; i++) {
                strhtml += "<option value='" + response.list[i].Batch_Number + "'>" + response.list[i].Batch_Number + "</option>";
            }
            $("#selHospitalBatch_" + prodvalue.toString()).html(strhtml);
            $("#selHospitalBatch_" + prodvalue.toString()).val($("#hdnHospitalProd_" + prodvalue).val());
            $("#hdnhsptlBatches_" + prodvalue.toString()).val(JSON.stringify(response));
        }
        else {
            $("#selHospitalBatch_" + prodvalue.toString()).html("<option value=''>-No Batch Found-</option>");
            $("#hdnhsptlBatches_" + prodvalue.toString()).val("");
            $("#txthsptlProdQty_" + prodvalue).val('0');
        }
        //   }

    },
    BindProductBatchFailure: function () {

    },
    //fnAddHospitalproductRow: function (curObj, isDraft) {
    //    debugger;
    //    var id = 0;
    //    if (curObj != null)
    //        id = parseInt(curObj.id.split('_')[3]);
    //    else if (isDraft == null) {
    //        $("#tbl_HospitalProducts tbody").html('');
    //    }
    //    else if (isDraft > 0) {
    //        id = isDraft;
    //    }
    //    var row = "<tr><td style='width: 40%;'><input style='position: relative;width: 89%;' class='autoproduct' id='txt_product_Name_" + (id + 1) + "' type='text' ondblclick='HospitalVisit.fnAddHospitalproductRow(this)'  onkeyup='HospitalVisit.fnAddHospitalproductRow(this)' onblur=' HospitalVisit.fnValidateproduct(this)'/>";
    //    row += "<input type='hidden' id='hdnproduct_Code_" + (id + 1) + "' /> <input type='hidden' id='hdnproductType_" + (id + 1) + "' /> </td>";
    //    row += "<td><div id='divbatch_" + (id + 1) + "'><input type='text' id='txtbatch_" + (id + 1) + "' /></div></td>";
    //    row += "<td><div id='divqnty_" + (id + 1) + "'><input type='text' id='txtqnty_" + (id + 1) + "' /></div></td>";
    //    row += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="HospitalVisit.fnDeleteHospitalproduct(this)"/> </td>';
    //    row += "</tr>";

    //    $("#tbl_HospitalProducts").append(row);
    //    // autoComplete(ActivityAutoFill_g, "txt_Activity_Name_", "hdnActivity_Code_", "autoActivity");
    //    for (var i = 1; i < $("#tbl_HospitalProducts tr").length - 1; i++) {
    //        $("#tbl_HospitalProducts tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("onkeyup");
    //        $("#tbl_HospitalProducts tr:nth-child(" + i + ") td:nth-child(1)").find('input').removeAttr("ondblclick");
    //    }
    //},
    //fnDeleteHospitalproduct: function (curObj) {
    //    debugger;
    //    var index = $(curObj).parent().parent().index() + 1;
    //    var tblIndex = $("#tbl_HospitalProducts tr").length;
    //    if (index == tblIndex) {
    //        fnMsgAlert('info', "Products", 'You are not allowed to delete this row!');
    //    }
    //    else {
    //        $(curObj).parent().parent().remove();
    //    }
    //},
    fnDeleteHospitalproduct: function (index) {
        var rowLength = $('#tbl_HospitalProducts tr').length - 1;
        if (index == rowLength) {
            //$.msgbox("You are not allowed to delete this row!");
            fnMsgAlert('info', docSampleAlertTitle, 'You are not allowed to delete this row!');
            //alert("You didnt delete this row!");
        }
        else {
            if (confirm('Do you wish to delete the Sample/Promotional item?')) {
                $('#ProdHsptlRow' + index).css('display', 'none');
            }
        }
    },
    fnClearForm: function () {

        CV_Visit_Id_g = 0;
        HospitalVisit.defaults.formMode_g = "NO";


        //if (SAMPLES == "SAMPLES") {
        //    ChemistProductDetails.fnClear();
        //}

        //Doctor entry screen this array set empty after save doctor
        if (SalesProductsAutoFill_g.length == 0)
            fnGetDoctorandCustomerSalesProducts();

        HospitalVisit.fnHospitalClear();
    },
    fnHospitalClear: function () {
        $("#frm1").hide();
        $("#div_Hospitalvisit_form").show();
        fnhighlightRowColor(0);
        //Reset Doctor Visit
        formMode_g = '';
        //Use for reset the form
        HospitalVisit.fnClearForm();
    },
    fnvisittime: function () {
        debugger;
        if (Visitmode == "VISIT_TIME_MANDATORY") {
            if ($("#timepicker_cv").val() == "") {
                HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                fnMsgAlert('info', 'Hospital', 'Please enter Visit Time');
                visitresult = false;
                return false;
            }
        }
        else {
            visitresult = true;
            return true;
        }
    },
    fnInserthospitalVisitData: function (val) {
        debugger;
        HospitalVisit.fnhsptlBlockDiv('div_doctorvisit', 'Please wait, Saving Your DCR information....');
        saveval = val;
        if ((HospitalEntryMode_g.toUpperCase() == 'YES')) {
            if ($.trim($('#hdnHospitalCode').val()).length == 0) {
                HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                fnMsgAlert('info', 'Hospital', 'Invalid Hospital Name.');
                return false;
            }
            else {
                var hsptlvalidJSON = jsonPath(HospitalAutoFill_g, "$.[?(@.value=='" + $('#hdnHospitalCode').val() + "' & @.label=='" + $('#txthsptlname').val().trim() + "')]");
                if (!hsptlvalidJSON) {
                    HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                    fnMsgAlert('info', 'Hospital', 'Invalid Hospital Name.');
                    return false;
                }
            }
        }
        if ($("#txthsptlname").val() == "") {
            HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
            fnMsgAlert('info', 'Hospital', 'Please enter hospital name.');
            return false;
        }
        //if (Hsptldetails_g != "") {
        //    var hsptl = jsonPath(Hsptldetails_g, "$.[?(@.Hospital_Name=='" + $("#txthsptlname").val() + "')]");
        //    if (hsptl.length > 0 && $("#hdnDVHospitalCode").val() == "") {
        //        fnMsgAlert('info', 'Hospital', 'Hospital name already exists.');
        //        return false;
        //    }
        //}

        var HospitalArray = [];
        var contactarray = [];
        var ActivityArray = [];
        var ProductArray = [];
        var ProductvalidateArray = [];
        var objHospital = {}
        if ($("#timepicker_cv").val() != "") {
            var visittime = $("#timepicker_cv").val().split(' ');
            var visitmode = visittime[1];
        }
        else {
            var visitmode = $("input[name='rdhsptlvisitmode_cv']:checked").val();
        }
        var hptlname = $("#txthsptlname").val().split('_')
        objHospital.Hospital_Name = hptlname[0];
        objHospital.Hospital_Id = $("#hdnHospitalCode").val();
        if ($("#timepicker_cv").val() != "") {
            objHospital.Visit_Time = visittime[0];
        }
        objHospital.Visit_Mode = visitmode;
        objHospital.Remarks = $("#txtHospitalRemarks").val();
        HospitalArray.push(objHospital);

        for (var i = 0; i < $("#tbl_Contacts tbody tr").length; i++) {
            var objContacts = {}
            //if ($("#txt_contact_Name_" + i + "").val() != undefined) {
            //    if (contactarray.length > 0) {
            //        if ($("#txt_contact_Name_" + i + "").val() == contactarray[i - 2].Contact_Name) {
            //            fnMsgAlert('info', 'Hospital', 'Contact name already exists.');
            //            return false;
            //        }
            //    }
            //}
            objContacts.Contact_Name = $("#txt_contact_Name_" + i + "").val();
            objContacts.Contact_Id = $("#hdncontact_Code_" + i + "").val();
            objContacts.Mobile_Number = $("#txtmobile_" + i + "").val();
            objContacts.Email_Id = $("#txtemail_" + i + "").val();
            if ($("#txt_contact_Name_" + i + "").val() != undefined && $("#txt_contact_Name_" + i + "").val() != "") {
                contactarray.push(objContacts);
            }
        }

        for (var i = 0; i < $("#tbl_HospitalActivity tbody tr").length; i++) {
            var objActivity = {}
            if ($("#txt_HospitalActivity_Name_" + (i + 1) + "").val() != undefined) {
                if (ActivityArray.length > 0) {
                    if ($("#txt_HospitalActivity_Name_" + (i + 1) + "").val() == ActivityArray[i - 1].Activity_Name) {
                        HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                        fnMsgAlert('info', 'Hospital', 'Activity name already exists.');
                        return false;
                    }
                }
            }
            objActivity.Activity_Name = $("#txt_HospitalActivity_Name_" + (i + 1) + "").val();
            objActivity.Activity_Id = $("#hdnHospitalActivity_Code_" + (i + 1) + "").val();
            objActivity.Activity_Remarks = $("#txtHospitalRemark_" + (i + 1) + "").val();
            if ($("#hdnHospitalActivity_Code_" + (i + 1) + "").val() == "" && $("#txt_HospitalActivity_Name_" + (i + 1) + "").val() != "") {
                HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                fnMsgAlert('info', 'Hospital', 'Invalid Activity.');
                return false;
            }
            if ($("#txt_HospitalActivity_Name_" + (i + 1) + "").val() != undefined && $("#txt_HospitalActivity_Name_" + (i + 1) + "").val() != "") {
                ActivityArray.push(objActivity);
            }
        }

        for (var i = 0; i < $('#tbl_HospitalProducts tr').length - 1; i++) {
            var objProduct = {}
            if ($("#txtHospitalProd_" + i + "").val() != undefined && $("#ProdHsptlRow" + i + "").css('display') != "none" && $("#txtHospitalProd_" + i + "").val() != "") {
                if (ProductArray.length > 0) {
                    if ($("#txtHospitalProd_" + i + "").val() == ProductvalidateArray[i - 2].Product_Name && $("#selHospitalBatch_" + i + "").val() == ProductvalidateArray[i - 2].Batch_Number) {
                        HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                        fnMsgAlert('info', 'Hospital', 'Product name already exists.');
                        return false;
                    }
                }
                var a = $("#txthsptlProdQty_" + i + "").val();
                HospitalVisit.fnhsptlChekInteger(a);
                if (intres == false) {
                    HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                    fnMsgAlert('info', 'Information', 'Please enter integer value only.');
                    return false;
                }
            }

            //if (productdetails_g != "") {
            //    var hsptlprod = jsonPath(productdetails_g, "$.[?(@.Product_Code=='" + $("#hdnHospitalProd_" + i + "").val() + "')]");
            //    if (hsptlprod.length > 0) {
            //        fnMsgAlert('info', 'Hospital', 'Product name already exists.');
            //        return false;
            //    }
            //}
            if ($("#ProdHsptlRow" + i + "").css('display') != "none") {
                if ($("#selHospitalBatch_" + i + "").val() == "") {
                    var batch = 0;
                }
                else {
                    var batch = $("#selHospitalBatch_" + i + "").val();
                }

                objProduct.Product_Name = $("#txtHospitalProd_" + i + "").val();
                objProduct.Product_Code = $("#hdnHospitalProd_" + i + "").val();
                objProduct.Product_Batch = batch;
                objProduct.Product_Quantity = $("#txthsptlProdQty_" + i + "").val();
                objProduct.Batch_Number = batch;
                if (batch != undefined && batch != 0) {
                    HospitalVisit.fnSamplehsptlQtyChange(i, 2);
                    if (samplevalidate == false) {
                        $("#txthsptlProdQty_" + i).val(stock);
                        HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                        fnMsgAlert('info', 'error', 'Quantity exceeds the available stock for this batch.');
                        return false;
                    }

                }

                if ($("#hdnHospitalProd_" + (i + 1) + "").val() == "" && $("#txtHospitalProd_" + (i + 1) + "").val() != "") {
                    HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                    fnMsgAlert('info', 'Hospital', 'Invalid Product.');
                    return false;
                }
                ProductvalidateArray.push(objProduct);
                if ($("#txtHospitalProd_" + i + "").val() != undefined && $("#txtHospitalProd_" + i + "").val() != "") {
                    ProductArray.push(objProduct);
                }
            }

        }

        var objHsptldetails = {
            lsthospitaldetails: HospitalArray,
            lstContactdetails: contactarray,
            lstActivitydetails: ActivityArray,
            lstproductdetails: ProductArray
        }


        //if (ActivityArray.length != 0) {
        //    for (var i = 0; i < ActivityArray.length; i++) {
        //        if (ActivityArray[i].Activity_Id == "") {
        //            fnMsgAlert('info', 'Hospital', 'Invalid Activity.');
        //            return false;
        //        }
        //    }
        //}
        //if (ProductArray.length != 0) {
        //    for (var i = 0; i < ProductArray.length; i++) {
        //        if (ProductArray[i].Product_Code == "") {
        //            fnMsgAlert('info', 'Hospital', 'Invalid Product.');
        //            return false;
        //        }
        //    }
        //}
        if ($("#txthsptlname").val() != "" && ActivityArray.length == 0 && ProductArray.length == 0) {
            HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
            fnMsgAlert('info', 'Hospital', 'You need to enter sample or activity details');
            return false;
        }
        if ($("#timepicker_cv").val() == "") {
            HospitalVisit.fnvisittime()
            if (visitresult == false) {
                HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                return false;
            }
        }

        if (contactarray.length != 0) {
            for (var i = 0; i < contactarray.length; i++) {
                //if (HospitalContactAutoFill_g != "") {
                // //   var cont = jsonPath(HospitalContactAutoFill_g, "$.[?(@.Contact_Id=='" + contactarray[i].Contact_Id + "')]");
                //    if (contactarray[i].Contact_Name == contactarray[i].Contact_Name) {
                //        fnMsgAlert('info', 'Hospital', 'Contact name already exists.');
                //        return false;
                //    }
                //}
                if (contactarray[i].Mobile_Number != "") {
                    HospitalVisit.fnValidateMobileNumber(contactarray[i].Mobile_Number);
                    if (contactarray[i].Mobile_Number.length > 10 || contactarray[i].Mobile_Number.length < 10) {
                        HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                        fnMsgAlert('info', 'Hospital', 'Mobile number should be 10 digits.');
                        return false;
                    }
                }
                if (contactarray[i].Email_Id != "") {
                    HospitalVisit.validateEmail(contactarray[i].Email_Id);
                    if (res == false) {
                        HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                        fnMsgAlert('info', 'Hospital', 'Invalid Email Address');
                        return false;
                    }
                }


            }
        }


        if ($("#hdnDVHospitalCode").val() == "") {
            visitcode = 0
        }
        else {
            visitcode = $("#hdnDVHospitalCode").val()
        }
        var dcrDate_Hsptlinsert = dcrDate.split('-')[2] + "-" + dcrDate.split('-')[1] + "-" + dcrDate.split('-')[0];
        Method_params = ["DCRHospitalVisit/InsertDCRHospitalVisitdetails", CompanyCode, UserCode, CompanyId, dcrDate, UserName, RegionCode, visitcode];
        CoreREST.post(null, Method_params, objHsptldetails, HospitalVisit.BindpostSuccessData, HospitalVisit.BindpostFailure);
    },
    BindpostSuccessData: function (response) {
        debugger;
        //  $('#buttondiv').css('display', '');
        // fnUnBlockDiv('div_Hospitalvisit_form');
        //ShowModalPopup('dvLoading');
        var msg = response.split('^')
        if (msg[2] == "") {
            if ($("#hdnDVHospitalCode").val() != "" && saveval == 2) {
                HospitalVisit.fnRedirectTostockiestVisit();
            }
            else if ($("#hdnDVHospitalCode").val() == "" && saveval == 2) {
                HospitalVisit.fnRedirectTostockiestVisit();
            }
            else {
                HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
                fnMsgAlert('success', 'Hospital', 'Hospital Visit is inserted sucessfully');
                HospitalVisit.fnHospitalClearForm();
                HospitalVisit.fnGetHospitalVisitdetails();
            }
        }
        else {
            HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
            fnMsgAlert('info', 'Hospital', msg[2]);
        }
    },
    BindpostFailure: function () {

    },
    fnhsptlBlockDiv: function (divid, message) {
        debugger;
        $('#' + divid).block({
            message: message,
            css: {
                border: '3px solid #89C33F', padding: '7px'
            }
        });
    },
    fnhsptlUnBlockDiv: function (divid) {
        debugger;
        $('#' + divid).unblock();
    },
    fnValidateMobileNumber: function (obj) {
        if ($.trim($(obj).val()) != '' && $.trim($(obj).val()) != undefined) {
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
            fnMsgAlert('info', 'Hospital', 'Invalid Mobile Pattern');
            return false;
        }
        return true;
    },
    validateEmail: function (emailField) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (emailField != "" && emailField != undefined) {
            if (reg.test(emailField) == false) {
                fnMsgAlert('info', 'Hospital', 'Invalid Email Address');
                res = false
                return false;
            }

        }
        res = true
        return true;

    },
    fnGetHospitalVisitdetails: function () {
        debugger;
        var ConfigValue = "A";
        var dcrDate_Hsptl = dcrDate.split('-')[2] + "-" + dcrDate.split('-')[1] + "-" + dcrDate.split('-')[0];
        Method_params = ["DCRHospitalVisit/GetHospitalVisitData", CompanyCode, UserCode, dcrDate_Hsptl, ConfigValue, 'A', UserName];
        CoreREST.get(null, Method_params, null, HospitalVisit.BindHospitaldetailsSuccessData, HospitalVisit.BindHospitaldetailsFailure);
    },
    BindHospitaldetailsSuccessData: function (response) {
        debugger;
        //$('#imgloaddDOCLST').css('display', 'none');
        //$('#docLSTLoadingTitle').css('display', 'none');
        $("#tbl_hospitalvisit_list").html('');

        Hsptldetails_g = "";
        productdetails_g = "";
        dcrDoctorVisit_g = "";
        if (response != null && response.list.lsthospitaldetails.length > 0) {
            Hsptldetails_g = response.list.lsthospitaldetails;
            productdetails_g = response.list.lstproductdetails;
            dcrHospitalVisit_g = Hsptldetails_g
            HospitalVisit.fnCreateHospitalList(Hsptldetails_g, productdetails_g);

        }
    },
    BindHospitaldetailsFailure: function () {

    },
    fnCreateHospitalList: function (detailsJSON_g, samplejson_g) {
        debugger;
        gridRowNo_g = 0;
        if (dcrHospitalVisit_g != null && dcrHospitalVisit_g.length > 0) {
            var listLength = dcrHospitalVisit_g.length;

            if (listLength > 0) {
                //if (listLength == 1) {
                //    for (var i = 0; i < listLength; i++) {
                //        HospitalVisit.fnHospitalRowCreation(dcrHospitalVisit_g, i)
                //    }
                //}
                //else {
                //for (var i = 0; i < listLength ; i++) {
                HospitalVisit.fnHospitalRowCreation(dcrHospitalVisit_g, samplejson_g)
                //}
                // }

                // HospitalVisit.fnfillform("1");
            }
            else {
                HospitalVisit.fnClearForm();
            }
        }
        else {
            HospitalVisit.fnClearForm();
        }
    },

    fnHospitalRowCreation: function (jsonContent, samplejson_g) {
        debugger;
        for (var i = 0; i < jsonContent.length; i++) {
            dvcode = jsonContent[i].Hospital_Visit_Code;
            var detailsJSON = "";
            detailsJSON = jsonContent[i];
            var docName = "";
            docName = jsonContent[i].Hospital_Name;
            var docCode = "";
            docCode = jsonContent[i].Hospital_Id;
            var doctorRegionCode = "";
            doctorRegionCode = jsonContent[i].Hospital_Region_Code;
            HospitalVisit.RowHospitalCreation(dvcode, detailsJSON, samplejson_g);
        }

        //// Inputs.
        //var productsJSONData = "";
        //var sampleCount = 0;
        //var samplesJson = {};
        //if (jsonContent[1].Data != null) {
        //    productsJSONData = jsonContent[1].Data;
        //    if (dvcode != null) {
        //        samplesJson = jsonPath(productsJSONData, "$.[?(@.DCR_Visit_Code=='" + dvcode + "')]");
        //    }
        //    else {
        //        samplesJson = jsonPath(productsJSONData, "$.[?(@.Doctor_Code=='" + docCode + "'& @.Doctor_Region_Code=='" + doctorRegionCode + "')]");
        //    }
        //    sampleCount = samplesJson == "false" ? 0 : samplesJson.length;
        //}
        ////competitor







        //// Detailed Products.
        //var detprodJSON = {};
        //var detprodCount = 0;
        //if (jsonContent[5].Data != null) {
        //    detprodJSON = jsonPath(jsonContent[5].Data, "$.[?(@.Doctor_Visit_Code=='" + dvcode + "')]");
        //    detprodCount = detprodJSON == "false" ? 0 : detprodJSON.length;
        //}

    },

    RowHospitalCreation: function (dvcode, detailsJSON, samplejson_g) {
        debugger;
        gridRowNo_g++;
        //for (var i = 0; i < detailsJSON.length; i++) {

        //}
        var rowIndex = $('#tbl_hospitalvisit_list tr').length;
        var newListRow = document.getElementById('tbl_hospitalvisit_list').insertRow(parseInt(rowIndex++));
        var sampleCount = samplejson_g == "false" ? 0 : samplejson_g.length;
        //var chemistCount = chemistJson == "false" ? 0 : chemistJson.length;
        //var rcpaCount = rcpaJSON == "false" ? 0 : rcpaJSON.length;
        //var docAccCount = docAccJSON == "false" ? 0 : docAccJSON.length;
        //var detprodCount = detprodJSON == "false" ? 0 : detprodJSON.length;
        //var followUpCount = followUpJSON == "false" ? 0 : followUpJSON.length;
        //var AttachmentCount = AttachmentJSON == "false" ? 0 : AttachmentJSON.length;
        //var detcompprodCount = CompProductJSONArray == "false" ? 0 : CompProductJSONArray.length;

        var HospitalName = detailsJSON.Hospital_Name;
        detailsJSON.Doctor_Name = HospitalName;
        newListRow.id = "hsptl_List_" + gridRowNo_g;
        $(newListRow).addClass("grdRow");
        $("#hsptl_List_" + gridRowNo_g).click(
            function () {
                HospitalVisit.fnGetHospitalVisitdetailsperhospital(dvcode)
            });

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
        // dvcode = dvcode == null ? "" : dvcode
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
        samplejson_g = samplejson_g == false ? "{}" : JSON.stringify(samplejson_g)
        $(td4).html('<input type="hidden" id="hdnSampleJson_' + gridRowNo_g + '" value=\'' + samplejson_g + '\' />');
        $(td4).css('display', 'none');


        // Doctor Name
        var td5 = newListRow.insertCell(4);
        var imgtick = "";
        if (recordStatus == "3") {
            imgtick = '<img id="imgSelected' + gridRowNo_g + '"  src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" alt="Selected" style="border:0px;" />';
        }
        else {
            imgtick = '<img id="imgSelected' + gridRowNo_g + '"  src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tickIcon.png" alt="Selected" style="border:0px;display:none" />';
        }
        $(td5).html(imgtick + '<span id="spnDocName_' + gridRowNo_g + '">' + HospitalName + '</span>');//onclick="HospitalVisit.fnGetHospitalVisitdetailsperhospital(' + dvcode + ')"
        $(td5).css('width', '90%');
        $(td5).css('verticalAlign', 'top');

        // Acc
        var td6 = newListRow.insertCell(5);
        $(td6).css('width', '10px')
        var accid = "docacc_" + gridRowNo_g;
        var docAccDiv = ""; //'<div id="divsamptoltip_' + gridRowNo_g + '" class="sampletooltip">'
        // Sample
        var td7 = newListRow.insertCell(6);
        $(td7).css('width', '10px')
        var sampleid = "Sample_" + gridRowNo_g;
        var sampleDiv = "";
        var jsonsample = eval('(' + samplejson_g + ')');
        var sample = [];
        sample.push(jsonsample);
        if (dvcode != null) {
            samplesJson = jsonPath(sample[0], "$.[?(@.DCR_Attendance_Hospital_Id=='" + dvcode + "')]");
        }
        for (var s = 0; s < samplesJson.length; s++) {
            sampleDiv += (s + 1) + "." + unescape(samplesJson[s].Product_Name) + "\n";
        }


        var img = '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/Green-Capsule16.png" alt="Sample/Promotional items" />';
        sample[0].length > 0 ? $(td7).html('<a id=' + sampleid + ' title=\'' + unescape(sampleDiv) + '\' class="sampletooltip" >' + img + '</a>') : $(td7).html('<a id=' + sampleid + ' class="sampletooltip"></a>' + sampleDiv);
        //$("#" + sampleid).tooltip({ effect: 'toggle' });

        // Remove Icon. 
        var td8 = newListRow.insertCell(7);
        $(td8).attr('id', "delete_" + gridRowNo_g);
        $(td8).css('width', '10px');
        if (recordStatus == "3") {
            //  if (Mode_Of_Entry != "A") {
            $(td8).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" onclick="HospitalVisit.fnDeletehospitalGridRow(\'' + dvcode + '\',\'' + newListRow.id + '\')" />')
            //}
            //else {
            //    $(td15).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="display:none"/>')
            //}
        }
        else {
            $(td8).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="display:none" />')
        }

        var td9 = newListRow.insertCell(8);
        $(td9).css('width', '10px');
        $(td9).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/arrow.png" id="grdSelectArrow_' + gridRowNo_g + '" alt="Select" style="display:none;"  />')

        if ($('#tbl_hospitalvisit_list tr').length > 1) {
            $('#btnSave').val('Save & Next ' + DoctorHeader_g + '');
        }

    },
    fnGetHospitalVisitdetailsperhospital: function (dvcode) {
        debugger;
        var dcrDate_Hsptl = dcrDate.split('-')[2] + "-" + dcrDate.split('-')[1] + "-" + dcrDate.split('-')[0];
        Method_params = ["DCRHospitalVisit/GetHospitalDetailsperhospital", CompanyCode, UserCode, dvcode, RegionCode, dcrDate_Hsptl, UserName];
        CoreREST.get(null, Method_params, null, HospitalVisit.BindHospitaldetailsperhospitalSuccessData, HospitalVisit.BindHospitaldetailsperhospitalFailure);
    },
    BindHospitaldetailsperhospitalSuccessData: function (response) {
        details_g = response.list.lsthospitaldetails;
        contacts_g = response.list.lstcontactdetails;
        activity_g = response.list.lstActivitydetails;
        product_g = response.list.lstproductdetails;
        HospitalVisit.fnfillform(details_g, contacts_g, activity_g, product_g);
    },
    BindHospitaldetailsperhospitalFailure: function () {

    },
    fnfillform: function (details_g, contacts_g, activity_g, product_g) {
        debugger;
        $("#div_doctorvisit_form").hide();
        $("#div_Hospitalvisit_form").show();
        $("#txthsptlname").val(details_g[0].Hospital_Name);
        $("#hdnHospitalCode").val(details_g[0].Hospital_Id);
        $("#hdnDVHospitalCode").val(details_g[0].Hospital_Visit_Code);
        $("input[name='rdhsptlvisitmode_cv'][value=" + details_g[0].Visit_Mode + "]").prop('checked', true)
        $("#timepicker_cv").val(details_g[0].Visit_Time);
        $("#txtHospitalRemarks").val(details_g[0].Remarks);
        HospitalVisit.GetHospitalContactdetails();
        HospitalVisit.fnAddHospitalContactRow(null);


        for (var i = 0; i < contacts_g.length; i++) {
            $("#txt_contact_Name_" + (i + 1) + "").val(contacts_g[i].Contact_Name)
            $("#hdncontact_Code_" + (i + 1) + "").val(contacts_g[i].Contact_Id)
            if (contacts_g[i].Contact_Id != 0) {
                $("#txtmobile_" + (i + 1) + "").val(contacts_g[i].Mobile_Number).attr('disabled', true);
                $("#txtemail_" + (i + 1) + "").val(contacts_g[i].Email_Id).attr('disabled', true);
            }
            else {
                $("#txtmobile_" + (i + 1) + "").val(contacts_g[i].Mobile_Number)
                $("#txtemail_" + (i + 1) + "").val(contacts_g[i].Email_Id)
            }
            HospitalVisit.fnAddHospitalContactRow(null, (i + 1));
        }
        // HospitalVisit.GetHospitalActivitydetails();
        HospitalVisit.fnAddHospitalActivityRow(null);
        for (var i = 0; i < activity_g.length; i++) {
            $("#txt_HospitalActivity_Name_" + (i + 1) + "").val(activity_g[i].Activity_Name)
            $("#hdnHospitalActivity_Code_" + (i + 1) + "").val(activity_g[i].Activity_Id)
            $("#txtHospitalRemark_" + (i + 1) + "").val(activity_g[i].Activity_Remarks)
            HospitalVisit.fnAddHospitalActivityRow(null, (i + 1));
        }
        HospitalVisit.fnGetUserProductsAndSetAutoFill();
        // HospitalVisit.fnDeleteRows();
        // HospitalVisit.fnAddHospitalproductRow(null);

        for (var i = 0; i < product_g.length; i++) {
            $("#txtHospitalProd_" + (i + 1) + "").val(product_g[i].Product_Name + "(" + (product_g[i].Current_Stock) + ")")
            $("#hdnHospitalProd_" + (i + 1) + "").val(product_g[i].Product_Code)
            // $("#selHospitalBatch_" + (i + 1) + "").val(product_g[i].Product_Batch)
            // $("#txthsptlProdQty_" + (i + 1) + "").val(product_g[i].Product_Quantity)
            HospitalVisit.fnAddHospitalproductRow(null, "txtHospitalProd" + (i + 1) + "");
            HospitalVisit.fnDCRProductBlur((i + 1));
            $("#selHospitalBatch_" + (i + 1)).val(product_g[i].Batch_Number);
            $("#txthsptlProdQty_" + (i + 1) + "").val(product_g[i].Product_Quantity)
            //if (lstbatch.length > 0) {
            //    debugger;
            //    var strhtml = "";
            //    for (var j = 0; j < lstbatch.length; j++) {
            //        strhtml += "<option value='" + lstbatch[j].Batch_Number + "'>" + lstbatch[j].Batch_Number + "</option>";
            //    }
            //    $("#selHospitalBatch_" + prodvalue.toString()).html(strhtml);
            //   // $("#hdnhsptlBatches_" + prodvalue.toString()).val(JSON.stringify(lstbatch));
            //    $("#txthsptlProdQty_" + (i + 1) + "").val(product_g[i].Product_Quantity)
            //}
            //else {
            //    $("#selHospitalBatch_" + prodvalue.toString()).html("<option value=''>-No Batch Found-</option>");
            //    $("#hdnhsptlBatches_" + prodvalue.toString()).val("");
            //    if (product_g[i].Product_Quantity == 0) {
            //        $("#txthsptlProdQty_" + prodvalue).val('0');
            //    }
            //}
        }

    },
    fnClearForm: function () {
        debugger;
        $("#txthsptlname").val('');
        $("#hdnHospitalCode").val('');
        $("#hdnDVHospitalCode").val('');
        $("input[name='rdvisitmode_cv']:checked").val('');
        $("#timepicker_cv").val('');
        $("#txtHospitalRemarks").val('');
        //$("#txtHospitalProd_1").val("");
        HospitalVisit.GetHospitalContactdetails();
        HospitalVisit.fnAddHospitalContactRow(null);
        //HospitalVisit.GetHospitalActivitydetails();
        HospitalVisit.fnAddHospitalActivityRow(null);
        HospitalVisit.fnGetUserProductsAndSetAutoFill();
        HospitalVisit.fnDeleteRows();
        HospitalVisit.fnAddHospitalproductRow(null, 'txtHospitalProd1');
    },
    fnHospitalClearForm: function () {
        debugger;
        $("#txthsptlname").val('');
        $("#hdnHospitalCode").val('');
        $("#hdnDVHospitalCode").val('');
        $("input[name='rdvisitmode_cv']:checked").val('');
        $("#timepicker_cv").val('');
        $("#txtHospitalRemarks").val('');
        //$("#txtHospitalProd_1").val("");
        HospitalVisit.GetHospitalContactdetails();
        HospitalVisit.fnAddHospitalContactRow(null);
        //HospitalVisit.GetHospitalActivitydetails();
        HospitalVisit.fnAddHospitalActivityRow(null);
        HospitalVisit.fnGetUserProductsAndSetAutoFill();
        HospitalVisit.fnDeleteRows();
        HospitalVisit.fnAddHospitalproductRow(null, 'txtHospitalProd1');
    },
    fnInserthospital: function (val) {
        debugger;
        isThereAnyOneDoctorSavedH = false;
        if ($(".grdRow").length > 0 || $("#tbl_hospitalvisit_list tbody tr").length > 0 || $("#txthsptlname").val() != "") {
            isThereAnyOneDoctorSavedH = true;
        }
        if (isThereAnyOneDoctorSavedH == false) {
            HospitalVisit.fnhsptlUnBlockDiv('div_doctorvisit');
            fnMsgAlert('info', 'Hospital', "Please enter and save atleast one doctor or hospital.")
            return false;
        }
        if ($("#hdnDVHospitalCode").val() != "") {
            if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
                if (HospitalVisit.fnInserthospitalVisitData(val)) {
                    $.blockUI();
                    HospitalVisit.fnRedirectTostockiestVisit();
                }
                else
                    HideModalPopup('dvLoading');
            }
        }
        else if ($("#hdnDVHospitalCode").val() == "" && val == 2) {
            if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
                if (HospitalVisit.fnInserthospitalVisitData(val)) {
                    $.blockUI();
                    HospitalVisit.fnRedirectTostockiestVisit();
                }
                else
                    HideModalPopup('dvLoading');
            }
        }
        else {
            HospitalVisit.fnRedirectTostockiestVisit();
        }
    },
    fnRedirectTostockiestVisit: function () {
        dcrActualDate = dcrActualDate_g.split('-')[2] + "-" + dcrActualDate_g.split('-')[1] + "-" + dcrActualDate_g.split('-')[0];
        $('#main').load('../HiDoctor_Activity/DCRV4StockiestExpense/Index/?dcrDate=' + dcrActualDate_g + '&dcrStatus=' + dcrStatus + '&entity=' + escape(category_g) + '&travelkm=' + travelledKMS_g + '&isRCPA=' + RCPA_g + "&flag=" + flag_g + "&actvity=" + escape(actvity_att.slice(0, -1)) + '&isThereAnyOneDoctorSavedA=' + isThereAnyOneDoctorSavedH);
    },
    fnDeletehospitalGridRow: function (dvhsptlCode, id) {
        debugger;
        if (dvhsptlCode != null && dvhsptlCode != "") {
            if (confirm('Do you wish to delete the Hospital and related details?')) {

                // HD Error Audit Log.
                try {


                    var objDeleteData = {};
                    objDeleteData.Hospital_Visit_Code = dvhsptlCode;
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
                        SubModuleName: "Hosital Visit Details",
                        ActionTaken: "Delete Hosital Visit Details",
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
                debugger;
                var dcrDate_Hsptl = dcrDate.split('-')[2] + "-" + dcrDate.split('-')[1] + "-" + dcrDate.split('-')[0];
                Method_params = ["DCRHospitalVisit/Deletehospital", CompanyCode, UserCode, dvhsptlCode, RegionCode, dcrActualDate_g, UserName];
                CoreREST.get(null, Method_params, null, HospitalVisit.BinddeleteSuccessData, HospitalVisit.BinddeleteFailure);

            }
        }
    },
    BinddeleteSuccessData: function (response) {
        debugger;
        var result = response;
        if ($.trim(result).toUpperCase() == "") {
            fnMsgAlert('success', "Hospital", 'Hospital details deleted successfully.')
            HospitalVisit.fnGetHospitalVisitdetails();
            HospitalVisit.fnHospitalClear();
        }
        else {
            fnMsgAlert('error', screenTitle, result);
            return false;
        }
    },
    BinddeleteFailure: function () {

    },

    fnDeleteRows: function () {
        debugger;
        producthsptlRowIndex_g = 0;
        $('#tbl_HospitalProducts').html('<tr><td class="dcr_Hopsitalproduct_header" style="text-align:left;">Input Name</td><td >Batch Number</td><td class="dcr_Hopsitalproduct_header txtqty" style="text-align:left;">Quantity</td><td  id="hdr_detailed" class="dcr_Hopsitalproduct_header txtqty" style="text-align:left;padding-left:23px;display:none"></td><td  class="dcr_Hopsitalproduct_header"></td></tr>');

    },

}