//Default Variable and values
var EditCount = 1;
var Count = 1;
var AddbindproductCount = 1;
var max = '';
var Editmax = '';
var objDoctorDetails = "";
var objProductDetails = "";
var objEditProductDetails = "";
var ViewStosCount = 0;
var STOSInsertReturnCount = 0;
var ProductReturnValue = '';
var EditClickInputID = '';
var HistoryID = '';
var OldDoctorcodeArray = [];
var getNewaddProduct = '';
var SelecteditDoctorcode = 1;
var ReturnDraft = "";
var EditSTOS_Doctor_Id = "";
var EditObjList = [];
var RetuRnObjList = [];
var EditDoctorValidation = 0;
var selectCsa = "";
var csaval = "";
var Totallist = "";
var SpecialityjsonString
var URMdata;
//var flexidocpriv = "";
//var EdtiProductNamMe = [];
//Init Function
var STOS = {
    defaults: {
        CompanyCode: "",
        RequestRegionCode: "",
        RequestRegionName: "",
        RequestUserCode: "",
        RequestUserName: "",
        OrderStatusData: "",
        RequestUserTypeName: "",
        ShowTeam: "",
        jsonActiveUserDetails: null,
        SelectedUser: "",
        RequestUserTypeCode: "",
        UrlStosID: "",
        hdnCSACode: ""
    },
    init: function () {
        OldDoctorcodeArray = [];
        AddEditProductcodeArray = [];
        AddProductCode = [];
        debugger;
        STOS.ViewSTOS("SELF");
        if (STOS.defaults.ShowTeam == "YES") {
            $('#ShowteamSelectBox').show();
            $('#CreateMyTeam').show();
            STOS.defaults.ShowTeam = 1;
        }
        //STOS.WeeklyMilDetails();
        STOS.GetPendingApprovalData();
        $('#CreateStosMsg').show();
    },
    RequestInit: function () {
        $('#SaveDetails').click(function () {
            STOS.GetProductData();
        });
        STOS.fnActiveUser();
        STOS.OrderStatusDetailsRequest();
        if (STOS.defaults.UrlStosID > 0) {
            debugger;
            STOS.fnSTOSReturnSucess(STOS.defaults.UrlStosID);
            //STOS.fnUploadedImages(STOS.defaults.UrlStosID);
        }

    },
    fnddRequest: function (data) {
        STOS.ViewSTOS(escape(data.value));
    },
    OrderStatusDetailsRequest: function () {
        var mode = "";
        if (STOS.defaults.SelectedUser == STOS.defaults.RequestRegionCode) {
            mode = "SELF";
        } else {
            mode = "TEAM";
        }
        STOSServices.getOrderStatusDetailsRequest(STOS.defaults.CompanyCode, STOS.defaults.RequestUserTypeName, mode, STOS.fngetOrderStatusDataSucess, STOS.fngetOrderStatusDataFailure);
    },
    fngetOrderStatusDataSucess: function (data) {
        debugger;
        if (data.list == '') {
            $.unblockUI();
            $.msgAlert({
                type: 'info',
                title: 'STOS',
                text: 'Status cycle not mapped for this user. Please contact your administrator',
                callback: function () {
                    $('.modal-backdrop').css("display", "none");
                    fnLoadBody('HiDoctor_Activity/Stos/Index');
                }
            });
            return false;
        }
        console.log(data);
        STOS.defaults.OrderStatusData = data;
    },
    fnActiveUser: function () {
        debugger;
        STOSServices.getActiveUser(STOS.defaults.CompanyCode, STOS.defaults.SelectedUser, STOS.fngetActiveUserDataSucess, STOS.fngetActiveUserDataFailure);
    },
    fngetActiveUserDataSucess: function (data) {
        debugger;
        console.log(data);
        STOS.defaults.jsonActiveUserDetails = data;
        var BindContent = 'You are creating a STOS for <b>' + data.list[0].Region_Name + '</b> - <b>' + data.list[0].User_Name + '</b>';
        $('#BindUserDetails').html(BindContent);
    },
    ViewSTOS: function (data) {
        debugger;
        $.blockUI({
            message: '<h1>Please Wait</h1>'
        });
        var mode = data;
        STOSServices.getSTOSViewDetails(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, STOS.defaults.RequestUserTypeName, mode, STOS.fnSTOSViewDetailsSucess, STOS.fnSTOSViewDetailsFailure);
    },
    fnSTOSViewDetailsSucess: function (data) {
        var Content = '';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            var STOSviewData = data;

            Content += '<table class="table table-striped">';
            Content += '<thead> <tr>';
            Content += '<th>STOS ID</th>';
            Content += '<th>Requested by</th>';
            Content += '<th>Requested for</th>';
            Content += '<th>Requested date</th>';
            Content += '<th>Status</th>';
            Content += '<th>View STOS</th>';
            Content += '<th>History</th></tr>';
            Content += '</thead>';
            Content += ' <tbody>';
            for (var i = 0; i < STOSviewData.list.length; i++) {
                ViewStosCount++;
                Content += '<tr>';
                Content += '<td data-title="Request ID">' + STOSviewData.list[i].STOS_Id + '</td>';
                Content += '<td data-title="Request By">' + STOSviewData.list[i].Requested_By + ',' + STOSviewData.list[i].Requested_User_Type_Name + ' (' + STOSviewData.list[i].Requested_Region_Name + ')</td>';
                Content += '<td data-title="Request for">' + STOSviewData.list[i].User_Name + ',' + STOSviewData.list[i].User_Type_Name + '(' + STOSviewData.list[i].Region_Name + ')</td>';
                Content += '<td data-title="Request Date">' + STOSviewData.list[i].Formated_Requested_Date + '</td>';
                //Content += '<td data-title="Doctor Name">' + STOSviewData.list[i].User_Name + '</td>';
                if (STOSviewData.list[i].Order_No_Status_Name == 'Cancelled') {
                    Content += '<td  data-title="Status" style="color: red;">' + STOSviewData.list[i].Order_No_Status_Name + '</td>';

                } else if (STOSviewData.list[i].Order_No_Status_Name == 'Approve') {
                    Content += '<td  data-title="Status" style="color: green;">' + STOSviewData.list[i].Order_No_Status_Name + '</td>';
                } else {
                    Content += '<td data-title="Status" style="color: green;">' + STOSviewData.list[i].Order_No_Status_Name + '</td>';
                }

                Content += '<td data-title="View" style="text-align:center;">';
                Content += '<span class="View_Btn' + ViewStosCount + '" style="margin: 10px;"><span style="cursor: pointer;" Onclick="STOS.ViewSTOSData(' + STOSviewData.list[i].STOS_Id + ')"><i class="fa fa-eye" aria-hidden="true"></i></span></span>';
                if (STOSviewData.list[i].isEdit == "YES") {
                    Content += '<span class="Edit_Btn' + ViewStosCount + '" style="margin: 10px;"><span style="cursor: pointer;" Onclick="STOS.EditSTOSData(\'' + STOSviewData.list[i].STOS_Id + '\',\'' + STOSviewData.list[i].Region_Code + '\')"><i class="fa fa-pencil" aria-hidden="true"></i></span></span>';
                }
                Content += '</td>';
                Content += '<td data-title="History" style="text-align:center;"><span class="History_Btn' + ViewStosCount + '" style="margin: 10px;"><span style="cursor: pointer;" Onclick="STOS.HistorySTOSData(' + STOSviewData.list[i].STOS_Id + ')"><i class="fa fa-history" aria-hidden="true"></i></span></span></td>';
                Content += ' </tr>';
            }
            Content += '</tbody>';
            Content += '</table>';

        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;margin-top: 10%;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No STOS has been raised. Click on Create Request to raise a STOS.</p></div>';
        }
        $('#ViewRequesttable').html(Content);
        $.unblockUI();
        //STOS.WeeklyMilDetails(data);
    },
    HistorySTOSData: function (stosid) {
        STOSServices.getHistoryHeader(STOS.defaults.CompanyCode, stosid, STOS.fnSTOSHistoryHeaderSucess, STOS.fnSTOSHistoryHeaderFailure);
    },
    fnSTOSHistoryHeaderSucess: function (data) {
        debugger;
        var Content = '';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            Content += '<table class="table table-hover">';
            Content += '<thead> <tr>';
            Content += '<th>STOS ID</th>';
            Content += '<th>Requested by</th>';
            Content += '<th>Requested for</th>';
            Content += '<th>Requested date</th>';
            Content += '<th>Status</th>';
            Content += '<th>Action by</th>';
            Content += '<th>Action date</th>';
            Content += '<th>View</th>';
            Content += '<th>Remarks</th>';
            Content += '</tr></thead>';
            Content += ' <tbody>';
            for (var i = 0; i < data.list.length; i++) {
                ViewStosCount++;
                Content += '<tr style="cursor: pointer;">';
                Content += '<td>' + data.list[i].STOS_Id + '</td>';
                Content += '<td data-title="Request By">' + data.list[i].Requested_By + ',' + data.list[i].Requested_User_Type_Name + ' (' + data.list[i].Requested_Region_Name + ')</td>';
                Content += '<td data-title="Request for">' + data.list[i].User_Name + ',' + data.list[i].User_Type_Name + '(' + data.list[i].Region_Name + ')</td>';
                Content += '<td>' + data.list[i].Formated_Requested_Date + '</td>';
                Content += '<td>' + data.list[i].Order_No_Status_Name + '</td>';
                Content += '<td>' + data.list[i].Approved_By + '</td>';
                if (data.list[i].Approved_By != "") {
                    Content += '<td>' + data.list[i].Formated_Approved_Date + '</td>';
                } else {
                    Content += '<td></td>';
                }
                Content += '<td style="text-align: center;"><span style="cursor: pointer;text-align: center;" Onclick="STOS.fnViewHistoryDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].STOS_History_Id + '\')"><i class="fa fa-eye" aria-hidden="true"></i></span></td>';
                Content += '<td style="text-align: center;"><span style="cursor: pointer;text-align: center;" Onclick="STOS.fnViewRemarksDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].STOS_History_Id + '\')"><i class="fa fa-eye" aria-hidden="true"></i></span></td>';
                Content += ' </tr>';
            }
            Content += '</tbody>';
            Content += '</table>';
        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }

        $('#HistoryDetails').html(Content);
        $('#BackHistory').hide();
        $('#HistoryDetails').show();
        $('#HistoryFullDetails').hide();
        $('#HistoryRemarks').hide();
        $('#HistoryRemarks').hide();
        $('#ViewHistoryDetails').modal("show");
    },
    fnViewHistoryDetails: function (stosid, stoshistoryid) {
        debugger;
        HistoryID = stosid;
        STOSServices.getSTOSDocProductHistory(STOS.defaults.CompanyCode, stosid, stoshistoryid, STOS.fnHistoryDetailsSucess, STOS.fnHistoryDetailsFailure);
    },
    fnHistoryDetailsSucess: function (data) {
        debugger;
        console.log("history");
        console.log(data);
        var Content = '';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            Content += '<table class="table table-striped")">';
            Content += '<thead> <tr>';
            Content += '<th>Doctor Name</th>';
            Content += '<th>Doctor Specialty Name</th>';
            Content += '<th>No Of Units</th>';
            Content += '<th>Pack Size</th>';
            Content += '<th>Product Name</th>';
            //Content += '<th>Remarks</th>';
            Content += '</tr></thead>';
            Content += ' <tbody>';
            for (var i = 0; i < data.list.length; i++) {
                ViewStosCount++;
                Content += '<tr>';
                Content += '<td>' + data.list[i].Doctor_Name + '</td>';
                Content += '<td>' + data.list[i].Doctor_Specialty_Name + '</td>';
                Content += '<td>' + data.list[i].Approved_Units + '</td>';
                Content += '<td>' + data.list[i].Pack_Size + '</td>';
                Content += '<td> ' + data.list[i].Product_Name + '</td>';
                //Content += '<td> ' + data.list[i].Remarks + '</td>';
                Content += ' </tr>';
            }
            Content += '</tbody>';
            Content += '</table>';
        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        $('#BackHistory').show();
        $('#HistoryDetails').hide();
        $('#HistoryFullDetails').html(Content);

        var HistoryHeading = '';
        HistoryHeading += 'History request for STOS request ID - ' + HistoryID;
        $('HistoryHeading').html();
        $('#HistoryRemarks').hide();
        $('#HistoryRemarks').hide();
        $('#HistoryFullDetails').show();
    },
    fnViewRemarksDetails: function (stosid, stoshistoryid) {
        STOSServices.getSTOSRemarks(STOS.defaults.CompanyCode, stosid, stoshistoryid, STOS.fnHRemarksDetailsSucess, STOS.fnRemarksDetailsFailure);
    },
    fnHRemarksDetailsSucess: function (data) {
        debugger;
        debugger;

        console.log(data);
        var Content = '';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            for (var i = 0; i < data.list.length; i++) {
                if ((data.list[i].length - 1) == i) {
                    Content += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 16px;margin-top: 0px;margin-right: 5px;"><i class="fa fa-user" aria-hidden="true"></i></div>';
                    Content += '<div class="media-body" style="float: left;"><span style="margin-right:5px;"><b>' + data.list[i].Remarks_By + '</b></span><span style="margin-left:5px;">' + data.list[i].Formated_Remarks_Datetime + '</span>';
                    if (data.list[i].Remarks != 'null' || data.list[i].Remarks != '') {
                        Content += '<p style="margin-top:5px;">' + data.list[i].Remarks + '</p>';
                    } else {
                        Content += '<textarea class="form-control" rows="5" id="Approvalremarks"></textarea>';
                    }
                    Content += ' </div> </div></div>';

                } else {
                    Content += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 16px;margin-top: 0px;margin-right: 5px;"><i class="fa fa-user" aria-hidden="true"></i></div>';
                    Content += '<div class="media-body" style="float: left;"><span style="margin-right:5px;"><b>' + data.list[i].Remarks_By + '</b></span><span style="margin-left:5px;">' + data.list[i].Formated_Remarks_Datetime + '</span>';
                    if (data.list[i].Remarks == 'null' || data.list[i].Remarks == '' || data.list[i].Remarks == null) {
                        Content += '<p style="margin-top:5px;">No remarks</p>';
                    } else {
                        Content += '<p style="margin-top:5px;">' + data.list[i].Remarks + '</p>';

                    }

                    Content += ' </div> </div></div>';
                }
            }
            Content += '</tbody>';
            Content += '</table>';
        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        $('#BackHistory').show();
        $('#HistoryDetails').hide();
        $('#HistoryFullDetails').hide();
        $('#HistoryRemarks').html(Content);
        $('#HistoryRemarks').show();
    },
    ViewSTOSData: function (STOSid) {
        debugger;
        STOSServices.getSTOSView(STOS.defaults.CompanyCode, STOSid, STOS.fnSTOSViewPopupDetailsSucess, STOS.fnSTOSViewPopupDetailsFailure);
    },
    fnSTOSViewPopupDetailsSucess: function (data) {
        debugger;
        console.log(data);
        var Content = '';

        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            Content += '<table class="table table-striped">';
            Content += '<thead> <tr>';
            Content += '<th>Doctor Name</th>';
            Content += '<th>Product Name</th>';
            Content += '<th>Doctor Specialty Name</th>';
            Content += '<th>No Of Units</th>';
            Content += '<th>Pack Size</th>';
            Content += '</tr></thead>';
            Content += ' <tbody>';
            for (var i = 0; i < data.list.length; i++) {
                ViewStosCount++;
                Content += '<tr>';
                Content += '<td data-title="Doctor Name">' + data.list[i].Doctor_Name + '</td>';
                Content += '<td data-title="Product Name">' + data.list[i].Product_Name + '</td>';
                Content += '<td data-title="Doctor Specialty Name">' + data.list[i].Doctor_Specialty_Name + '</td>';
                Content += '<td data-title="No Of Units">' + data.list[i].Approved_Units + '</td>';
                Content += '<td data-title="Pack Size">' + data.list[i].Pack_Size + '</td>';
                Content += ' </tr>';
            }
            Content += '</tbody>';
            Content += '</table>';
        } else {
            Content = '<div class="col-xs-12"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }

        $('#BindViewPopupData').html(Content);
        $('#ViewPopupDetails').modal('show');

    },
    EditSTOSData: function (StosID, regionCode) {
        debugger;
        $('#main').load('../HiDoctor_Activity/Stos/Request/?regionCode=' + regionCode + '&stosId=' + StosID);
    },
    addProductDr: function () {
        EditDoctorValidation = 1;
        Count = 1;
        max = "";
        getNewaddProduct = 0;
        $('#hdnAddProduct').val("INSERT");
        debugger;
        STOSServices.getSTOSDoctorDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSDoctorDetailsSucess, STOS.fnSTOSDoctorDetailsFailure);
        debugger;
        STOSServices.getSTOSProductDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSProductDetailsSucess, STOS.fnSTOSProductDetailsFailure);
        var Content = '';
        Content += '<table class="table table-hover">';
        Content += '<thead>';
        Content += '<tr>';
        Content += '<th>Product Name</th>';
        Content += '<th>Pack Size</th>';
        Content += '<th>Unit</th>';
        Content += '<th></th>';
        Content += '<th></th>';
        Content += '</tr>';
        Content += '</thead>';
        Content += '<tbody id="AddNewRowTable">';
        Content += '<tr id="tableRow' + Count + '" class="RowData">';
        Content += '<td data-title="Product Name"><input type="text" class="form-control clsProductName' + Count + '" id="ProductName' + Count + '" onblur="STOS.fnProductDetails()" placeholder="Start typing product name"><input type="hidden" id="hdnProductName' + Count + '"><input type="hidden" id="hdnProductCode' + Count + '"></td>';
        Content += '<td data-title="Pack Size"><input type="text" min="0" class="form-control" id="PackSize' + Count + '" disabled></td>';
        Content += '<td data-title="Unit"><input type="number" min="0" class="form-control" id="Unit' + Count + '" onkeypress="return STOS.isNumberKey(event);"></td>';
        Content += '<td data-title="Remove"><span class="close_btn" id="RemoveRow' + Count + '"><i Onclick="STOS.RemoveRow(' + Count + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
        Content += '<td data-title="AddRow" id="AddRow' + Count + '"><span class="addRow" Onclick="STOS.AddNewRow(' + Count + ');"><i title="Add Row" class="fa fa-plus" aria-hidden="true"></i></span></td>';
        Content += '</tr>';

        Content += '</tbody>';
        Content += '</table>';

        $('#AddProductDR').html(Content);
        $('#txtDoctorName').val('');
        $('#Town').val('');
        $('#Speciality').val('');
        $('#RemoveRow1').hide();
        $('#ViewAddProductDR').modal("show");
    },
    fnSTOSDoctorDetailsSucess: function (data) {
        debugger;
        console.log(data);
        var flexidocpriv = fnGetPrivilegeValue('RIGID_ATTENDANCE_DOCTOR_ENTRY', 'YES')
        if (data.list == '' && flexidocpriv == 'YES') {
            //fnMsgAlert('info', 'STOS', 'Doctor details not avaliable');
            //fnLoadBody('HiDoctor_Activity/Stos/Index');
            $.msgAlert({
                type: 'info',
                title: 'STOS',
                text: 'Doctor details not avaliable',
                callback: function () {
                    $('.modal-backdrop').css("display", "none");
                    fnLoadBody('HiDoctor_Activity/Stos/Index');
                }
            });


            return false;
        }

        // Remove Space
        if (flexidocpriv == 'NO') {
            $("#Speciality").removeAttr('disabled');
            $("#Town").removeAttr('disabled');
        }
        var resultSet = $.grep(data.list, function (e) {
            //return regex.test(e.code);
            e.Customer_Name = e.Customer_Name.replace(/^\s+|\s+$/g, '');
            return e.Customer_Name;
        });

        objDoctorDetails = {
            "DoctorDetails": resultSet
        };

        var NameOfDoctor = "[";
        for (var i = 0; i < data.list.length; i++) {
            NameOfDoctor += "{label:" + '"' + "" + data.list[i].Customer_Name + "" + '",' + "value:" + '"' + "" + data.list[i].Customer_Code + "" + '"' + "}";
            if (i < data.list.length - 1) {
                NameOfDoctor += ",";
            }
        }
        NameOfDoctor += "];";
        var DoctorjsonString = eval(NameOfDoctor);
        $("#txtDoctorName").unautocomplete();
        autoComplete(DoctorjsonString, "txtDoctorName", "hdnDoctorName", "clsCustomer");

        STOSServices.getSTOSSpeciality(STOS.defaults.CompanyCode, STOS.fnSTOSSpecialitySucess, STOS.fnSTOSSpecialityFailure);

    },
    fnSTOSSpecialitySucess: function (data) {
        debugger;
        Speciality = "[";
        for (var i = 0; i < data.list.length; i++) {
            Speciality += "{label:" + '"' + "" + data.list[i].Speciality_Name + "" + '",' + "value:" + '"' + "" + data.list[i].Speciality_Code + "" + '"' + "}";
            if (i < data.list.length - 1) {
                Speciality += ",";
            }
        }
        Speciality += "];";
        SpecialityjsonString = eval(Speciality);
        $("#Speciality").unautocomplete();
        autoComplete(SpecialityjsonString, "Speciality", "hdnSpecialityCode", "clsspeciality");
    },
    fnSTOSProductDetailsSucess: function (data) {
        debugger;
        RetuRnObjList = [];
        if (data.list == '') {
            //fnMsgAlert('info', 'STOS', 'Product details not avaliable');

            $.msgAlert({
                type: 'info',
                title: 'STOS',
                text: 'Product details not avaliable',
                callback: function () {
                    $('.modal-backdrop').css("display", "none");
                    fnLoadBody('HiDoctor_Activity/Stos/Index');
                }
            });
            return false;
        }

        // Remove Space
        var resultSet = $.grep(data.list, function (e) {
            //return regex.test(e.code);
            e.Product_Name = e.Product_Name.replace(/^\s+|\s+$/g, '');
            RetuRnObjList.push(e.Product_Name);
            return e.Product_Name;
        });


        objProductDetails = {
            "ProductDetails": resultSet
        };

        var NameOfProduct = "[";
        for (var i = 0; i < data.list.length; i++) {
            NameOfProduct += "{label:" + '"' + "" + data.list[i].Product_Name + "" + '",' + "value:" + '"' + "" + data.list[i].Product_Code + "" + '"' + "}";
            if (i < data.list.length - 1) {
                NameOfProduct += ",";
            }
        }
        NameOfProduct += "];";
        var ProductjsonString = eval(NameOfProduct);
        $("#ProductName" + Count).unautocomplete();
        autoComplete(ProductjsonString, "ProductName" + Count, "hdnProductName" + Count, "clsProductName" + Count);

    },
    fnSTOSDoctorDetailsFailure: function () {
        console.log("fail");
    },
    AddNewRow: function (data) {
        debugger;

        var UnitValidation = $('#Unit' + data).val();
        if (UnitValidation == '' || UnitValidation == undefined || UnitValidation == null) {
            fnMsgAlert('info', 'STOS', 'Please Enter Unit');
            //alert('Please Enter Unit');
            return false;
        }
        //Same Stockist Validation 
        var arrStockist = [];
        var stCount = 0;
        $('.RowData').each(function (index, obj) {
            debugger;
            var sRCount = obj.id.replace("tableRow", "");;

            if ($('#hdnProductCode' + sRCount).val() != '' && $('#hdnProductCode' + sRCount).val() != undefined) {
                arrStockist[stCount] = $('#hdnProductCode' + sRCount).val();
            }
            stCount++;
        });

        var sorted_arr = arrStockist.slice().sort();
        var results = [];
        for (var i = 0; i < arrStockist.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        $('#RemoveRow' + data).show();
        if (results.length > 0) {
            fnMsgAlert('info', 'STOS', 'Please Avoid Same Product');
            //alert("Please Avoid Same Product");
            return false;
        }
        $('#RemoveRow1').show();
        STOSServices.getSTOSProductDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSProductDetailsSucess, STOS.fnSTOSProductDetailsFailure);
        debugger;
        var DataCount = data;
        var Content = '';
        var ProductName = $('#ProductName' + DataCount).val();
        var PackSize = $('#PackSize' + DataCount).val();
        var Unit = $('#Unit' + DataCount).val();
        if (ProductName == '' || Unit == '') {
            fnMsgAlert('info', 'STOS', 'Please Fill Empty Row');
            return false();
        }
        $('#AddRow' + Count).hide();
        $('#AddRow' + max).hide();
        Count++;
        Content += '<tr id="tableRow' + Count + '" class="RowData">';
        Content += '<td data-title="Product Name"><input type="text" class="form-control clsProductName' + Count + '" id="ProductName' + Count + '" onblur="STOS.fnProductDetails()"><input type="hidden" id="hdnProductName' + Count + '"><input type="hidden" id="hdnProductCode' + Count + '"></td>';
        Content += '<td data-title="Pack Size"><input type="text" min="0" class="form-control" id="PackSize' + Count + '" disabled></td>';
        Content += '<td data-title="Unit"><input type="number" min="0" class="form-control" id="Unit' + Count + '" onkeypress="return STOS.isNumberKey(event);"></td>';
        Content += '<td data-title="Remove"><span class="close_btn" id="RemoveRow' + Count + '"><i Onclick="STOS.RemoveRow(' + Count + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
        Content += '<td data-title="AddRow" id="AddRow' + Count + '"><span class="addRow"  Onclick="STOS.AddNewRow(' + Count + ');"><i title="Add Row" class="fa fa-plus" aria-hidden="true"></i></span></td>';
        Content += '</tr>';

        $("#AddNewRowTable").fadeIn(3000);
        $('#AddNewRowTable').append(Content);
        if (Count == 1) {
            $('#EditRemoveRow1').hide();
        }
    },

    RemoveRow: function (data) {
        debugger;
        var RemoveCount = data;
        var ProductName = $('#ProductName' + RemoveCount).val();
        var PackSize = $('#PackSize' + RemoveCount).val();
        var Unit = $('#Unit' + RemoveCount).val();
        $('#RemoveRow' + RemoveCount).closest('tr').remove();

        var TableRowCount = [];
        $('.RowData').each(function (index, obj) {
            var rNo = obj.id.replace("tableRow", "");
            TableRowCount.push(rNo);
        });
        max = -Infinity;
        for (var i = 0; i < TableRowCount.length; i++) {
            if (TableRowCount[i] > max) {
                max = TableRowCount[i];
            }
        }
        $('#AddRow' + max).show();
        $('#RemoveRow' + max).hide();

    },
    GetPendingApprovalData: function () {
        var Content = '';
        Content += '<h4>Pending for Approval <b>(12)</b></h4>';
        $('#ViewPendingApproval').html(Content);
    },

    fnDoctorLocation: function () {
        debugger;
        var dRLocation = $("#txtDoctorName").val();
        doctorLocation = dRLocation.replace(/^\s+|\s+$/g, '');
        if (doctorLocation != '' && doctorLocation.length != 1) {
            doctorLocation = jsonPath(objDoctorDetails, "$.DoctorDetails[?(@.Customer_Name=='" + doctorLocation + "')]");
            if (doctorLocation == false) {
                //fnMsgAlert('info', 'STOS', 'Doctor Name Not available');
                //alert("DoctorName Not available");

                var flexidoc = fnGetPrivilegeValue('RIGID_ATTENDANCE_DOCTOR_ENTRY', 'YES')
                if (flexidoc == 'YES') {
                    $("#txtDoctorName").val('');
                    $("#hdnDoctorCode").val('')
                }

                $("#Town").val('');
                $("#Speciality").val('');
                $("#hdnCategoryName").val('');
                $("#hdnCategoryCode").val('');
                $("#hdnDoctorCode").val('');
                return false;
            } else {
                $("#Town").val(doctorLocation[0].Local_Area);
                $("#Speciality").val(doctorLocation[0].Speciality_Name);
                $("#hdnSpecialityCode").val(doctorLocation[0].Speciality_Code)
                $("#hdnDoctorCode").val(doctorLocation[0].Customer_Code);
                $("#hdnCategoryName").val(doctorLocation[0].Category_Name);
                $("#hdnCategoryCode").val(doctorLocation[0].Category_Code);
            }
        } else {
            $("#Town").val('');
            $("#Speciality").val('');
            $("#hdnDoctorCode").val('');
            $("#hdnCategoryName").val('');
            $("#hdnCategoryCode").val('');
            $("#txtDoctorName").val('');
            $("#hdnSpecialityCode").val('');
            var flexidoc = fnGetPrivilegeValue('RIGID_ATTENDANCE_DOCTOR_ENTRY', 'YES')
            if (flexidoc == 'YES') {
                $("#txtDoctorName").val('');
                $("#hdnDoctorCode").val('')
            }
            //fnMsgAlert('info', 'STOS', 'Doctor Name Not available');
            return false;
        }

    },
    fnProductDetails: function () {
        debugger;
        var PRDetails = $("#ProductName" + Count).val();
        ProductDetails = PRDetails.replace(/^\s+|\s+$/g, '');
        if (ProductDetails != '' && ProductDetails.length != 1) {
            //if (ProductDetails != '') {
            ProductDetails = jsonPath(objProductDetails, "$.ProductDetails[?(@.Product_Name=='" + ProductDetails + "')]");
            if (ProductDetails == false) {
                //fnMsgAlert('info', 'STOS', 'ProductName Not available');
                //alert("ProductName Not available");
                $("#PackSize" + Count).val('');
                $("#hdnProductCode" + Count).val('');
                $("#ProductName" + Count).val('');
                $("#Unit" + Count).val('');
                return false;
            } else {
                $("#PackSize" + Count).val(ProductDetails[0].UOM_Type);
                $("#hdnProductCode" + Count).val(ProductDetails[0].Product_Code);
                //AddProductCode.push(ProductDetails[0].Product_Code);
            }
        } else {
            $("#PackSize" + Count).val('');
            $("#hdnProductCode" + Count).val('');
            $("#ProductName" + Count).val('');
            $("#Unit" + Count).val('');
            //fnMsgAlert('info', 'STOS', 'ProductName Not available');
            return false;
        }


        $('.RowData').each(function (index, obj) {
            debugger;
            var rNo = obj.id.replace("tableRow", "");
            // AddEditProductcodeArray.push($("#hdnProductCode" + rNo).val());
            var ProductNamMe = $("#ProductName" + rNo).val();
            if (ProductNamMe != "") {
                ProductDetails = jsonPath(objProductDetails, "$.ProductDetails[?(@.Product_Name=='" + ProductNamMe + "')]");
                if (ProductDetails == false) {
                    $("#PackSize" + rNo).val('');
                    $("#hdnProductCode" + rNo).val('');
                    $("#ProductName" + rNo).val('');
                    $("#Unit" + rNo).val('');
                    return false;
                } else {
                    $("#PackSize" + rNo).val(ProductDetails[0].UOM_Type);
                    $("#hdnProductCode" + rNo).val(ProductDetails[0].Product_Code);
                    //AddEditProductcodeArray.push(ProductDetails[0].Product_Code);

                }
            }

            if ($.inArray($("#ProductName" + rNo).val(), RetuRnObjList) > -1) {
            } else {
                $("#ProductName" + rNo).val('');
                $("#PackSize" + rNo).val('');
                $("#hdnProductCode" + rNo).val('');
                $("#Unit" + rNo).val('');
                return false;
            }
        });
    },

    //Get data and push data to DB
    GetProductData: function () {
        debugger;
        var mode = $('#hdnAddProduct').val();
        var productCount = 0;
        if (ProductReturnValue == '') {
            debugger;

            var Doctorname = $('#txtDoctorName').val();
            var Productname = $('#ProductName1').val();
            if (Doctorname == '') {
                fnMsgAlert('info', 'STOS', 'Please enter doctor name');
                //alert('Please enter Doctorname');
                return false;
            } else
                if (Productname == '') {
                    fnMsgAlert('info', 'STOS', 'Please enter valid product name');
                    //alert('Please enter Productname');
                    return false;
                }
            var flexidoc = fnGetPrivilegeValue('RIGID_ATTENDANCE_DOCTOR_ENTRY', 'YES')
            if (flexidoc == 'NO') {
                //if ($('#Town').val() == '') {
                //    fnMsgAlert('info', 'STOS', 'Please enter Town');
                //    return false;
                //}
                if ($('#Speciality').val() == '') {
                    fnMsgAlert('info', 'STOS', 'Please choose speciality');
                    return false;
                }
            }

            var AddEditProductcodeArray = [];
            $('.RowDataEdit').each(function (index, obj) {
                var rNo = obj.id.replace("EdittableRow", "");
                AddEditProductcodeArray.push($("#hdnProductCode" + rNo).val());
            });

            var AddProductCode = [];
            $('.RowData').each(function (index, obj) {
                var rNo = obj.id.replace("tableRow", "");
                AddProductCode.push($("#hdnProductCode" + rNo).val());
            });



            //Validation
            //var ProductCodeHdn = $("#hdnProductCode" + EditCount).val();
            if (AddEditProductcodeArray != '') {
                var sorted_AddEditProductcodeArray = AddEditProductcodeArray.slice().sort();
                for (var i = 0; i < AddEditProductcodeArray.length - 1; i++) {
                    if (sorted_AddEditProductcodeArray[i] != '') {
                        if (sorted_AddEditProductcodeArray[i + 1] == sorted_AddEditProductcodeArray[i]) {
                            fnMsgAlert('info', 'STOS', 'Product name already exits. Please choose a different product.');
                            //alert('Product name already exits. Please choose a different product.');
                            return false;
                        }
                    } else {
                        fnMsgAlert('info', 'STOS', 'Please enter valid product name.');
                        //alert('Please enter product name.');
                        return false;
                    }
                }
            }
            if (AddProductCode != '') {
                var sorted_AddProductcodeArray = AddProductCode.slice().sort();
                for (var i = 0; i < AddProductCode.length - 1; i++) {
                    if (sorted_AddProductcodeArray[i] != '') {
                        if (sorted_AddProductcodeArray[i + 1] == sorted_AddProductcodeArray[i]) {
                            fnMsgAlert('info', 'STOS', 'Product name already exits. Please choose a different product.');
                            //alert('Product name already exits. Please choose a different product.');
                            return false;
                        }
                    } else {
                        fnMsgAlert('info', 'STOS', 'Please enter valid product name.');
                        //alert('Please enter product name.');
                        return false;
                    }
                }
            }

            if (OldDoctorcodeArray != '') {
                //var AddProductCode = [];
                //$('.RowEditData').each(function (index, obj) {
                //    debugger;
                //    var rNo = obj.id.replace("tableRowData", "");
                //    AddProductCode.push($("#EdithiddenDc" + rNo).val());
                //});
                var hddnDoctorCode = $('#hdnDoctorCode').val();
                for (var i = 0; i < OldDoctorcodeArray.length; i++) {
                    if (OldDoctorcodeArray[i] == hddnDoctorCode) {
                        fnMsgAlert('info', 'STOS', 'Doctor name already exits. Please choose a different Doctor');
                        //alert('Doctor name already exits. Please choose a different Doctor');
                        $("#Town").val('');
                        $("#Speciality").val('');
                        $("#hdnDoctorCode").val('');
                        $("#txtDoctorName").val('');
                        return false;
                    }
                }
            }

            $.blockUI({
                message: '<h6>Please Wait</h6>'
            });
            AddEditProductcodeArray = [];
            AddProductCode = [];
            var LastProductRow = $('.clsProductName' + Count).val()
            if (LastProductRow == '') {
                $('#RemoveRow' + Count).closest('tr').remove();
                Count--;
                $('#AddRow' + Count).show();
            } else
                if (LastProductRow == undefined) {
                    Count--;
                    $('#AddRow' + Count).show();
                }
            var ProductRequest = [];
            var STOSRequestModel = new Object();

            STOSRequestModel = {
                STOS_Id: null,
                Company_Code: STOS.defaults.CompanyCode,
                User_Code: STOS.defaults.jsonActiveUserDetails.list[0].User_Code,
                Region_Code: STOS.defaults.jsonActiveUserDetails.list[0].Region_Code,
                User_Name: STOS.defaults.jsonActiveUserDetails.list[0].User_Name,
                Region_Name: STOS.defaults.jsonActiveUserDetails.list[0].Region_Name,
                User_Type_Name: STOS.defaults.jsonActiveUserDetails.list[0].User_Type_Name,
                User_Type_Code: STOS.defaults.jsonActiveUserDetails.list[0].User_Type_Code,
                Status_Code: STOS.defaults.OrderStatusData.list[0].Status_Code,
                Cycle_Code: STOS.defaults.OrderStatusData.list[0].Cycle_Code,
                Requested_By: STOS.defaults.RequestUserName,
                Request_User_Code: STOS.defaults.RequestUserCode,
                Request_Region_Code: STOS.defaults.RequestRegionCode,
                Request_Region_Name: STOS.defaults.RequestRegionName,
                Request_User_Type_Name: STOS.defaults.RequestUserTypeName,
                Order_No: STOS.defaults.OrderStatusData.list[0].Order_No,
                Move_Order_No: STOS.defaults.OrderStatusData.list[0].Move_Order,
                Record_Status: 3,
                Order_No_Status_Name: STOS.defaults.OrderStatusData.list[0].Status_Name,
                CSA_Code: csaval,
                lstProductRequest: ProductRequest,
                lstDoctorRequest: {

                    Doctor_Code: "" + $('#hdnDoctorCode').val() + "",
                    Doctor_Name: "" + $('#txtDoctorName').val() + "",
                    Local_Area: "" + $('#Town').val() + "",
                    Doctor_Specialty_Code: "" + $('#hdnSpecialityCode').val() + "",
                    Doctor_Specialty_Name: "" + $('#Speciality').val() + "",
                    Doctor_Category_Code: "" + $('#hdnCategoryCode').val() + "",
                    Doctor_Category_Name: "" + $('#hdnCategoryName').val() + "",
                    Requested_By: STOS.defaults.RequestUserName,

                }
            };
            var ReturnValidationData = 1;
            $('.RowData').each(function (index, obj) {
                var rNo = obj.id.replace("tableRow", "");
                var lstProductRequest = {
                    Product_Name: "" + $('#ProductName' + rNo).val() + "",
                    Product_Code: "" + $("#hdnProductCode" + rNo).val() + "",
                    Pack_Size: "" + $('#PackSize' + rNo).val() + "",
                    No_Of_Units: "" + $('#Unit' + rNo).val() + "",
                    Approved_Units: "" + $('#Unit' + rNo).val() + "",
                    STOS_Doctor_Id: "" + $('#hdnDoctorCode').val() + "",
                    Doctor_Code: "" + $('#hdnDoctorCode').val() + "",
                    Doctor_Name: "" + $('#txtDoctorName').val() + "",
                };
                var UnitValidation = $('#Unit' + rNo).val();
                if (UnitValidation <= 0) {
                    productCount++;
                    fnMsgAlert('info', 'STOS', 'Unit must be greater than 0');
                    //alert('Unit must be greater than 0');
                    return false;
                }
                if (UnitValidation == '') {
                    ReturnValidationData = 2;
                }
                ProductRequest.push(lstProductRequest);
            });
            if (productCount > 0) {
                $.unblockUI();
                return false;
            }

            if (ReturnValidationData == 1) {
                STOSServices.postSTOSProductData(STOS.defaults.CompanyCode, STOSRequestModel, STOS.fnSTOSReturnSucess, STOS.fnSTOSDoctorDetailsFailure);
            } else {
                $.unblockUI();
                fnMsgAlert('info', 'STOS', 'Please enter value in unit');
                //alert('Please enter value in unit');
                return false;
            }
            //STOS.fnSTOSReturnSucess();
            //var STOSObj = {};
            //STOSObj.STOSRequestModel = JSON.stringify(STOSRequestModel);

        } else {

            debugger;

            var Doctorname = $('#txtDoctorName').val();

            var Productname = $('#ProductName1').val();

            if (Doctorname == '') {
                fnMsgAlert('info', 'STOS', 'Please enter doctor name');
                //alert('Please enter Doctorname');
                return false;
            } else
                if (Productname == '') {
                    fnMsgAlert('info', 'STOS', 'Please enter product name');
                    //alert('Please enter Productname');
                    return false;
                } else
                    if (Productname == undefined) {
                        fnMsgAlert('info', 'STOS', 'Please enter product name');
                        //alert('Please enter Productname');
                        return false;
                    }
            var flexidoc = fnGetPrivilegeValue('RIGID_ATTENDANCE_DOCTOR_ENTRY', 'YES')
            if (flexidoc == 'NO') {
                //if ($('#Town').val() == '') {
                //    fnMsgAlert('info', 'STOS', 'Please enter Town');
                //    return false;
                //}
                if ($('#Speciality').val() == '') {
                    fnMsgAlert('info', 'STOS', 'Please choose speciality');
                    return false;
                }
            }

            var AddEditProductcodeArray = [];
            $('.RowDataEdit').each(function (index, obj) {
                var rNo = obj.id.replace("EdittableRow", "");
                AddEditProductcodeArray.push($("#hdnProductCode" + rNo).val());

            });

            var AddProductCode = [];
            $('.RowData').each(function (index, obj) {
                var rNo = obj.id.replace("tableRow", "");
                AddProductCode.push($("#hdnProductCode" + rNo).val());
            });

            //Validation
            //var ProductCodeHdn = $("#hdnProductCode" + EditCount).val();
            if (AddEditProductcodeArray != '') {
                var sorted_AddEditProductcodeArray = AddEditProductcodeArray.slice().sort();
                for (var i = 0; i < AddEditProductcodeArray.length - 1; i++) {
                    if (sorted_AddEditProductcodeArray[i] != '') {
                        if (sorted_AddEditProductcodeArray[i + 1] == sorted_AddEditProductcodeArray[i]) {
                            fnMsgAlert('info', 'STOS', 'Product name already exits. Please choose a different product.');
                            //alert('Product name already exits. Please choose a different product.');
                            return false;
                        }
                    } else {
                        fnMsgAlert('info', 'STOS', 'Please enter valid product name.');
                        //alert('Please enter product name.');
                        return false;
                    }
                }
            }

            if (AddProductCode != '') {
                var sorted_AddProductcodeArray = AddProductCode.slice().sort();
                for (var i = 0; i < AddProductCode.length - 1; i++) {
                    if (sorted_AddProductcodeArray[i] != '') {
                        if (sorted_AddProductcodeArray[i + 1] == sorted_AddProductcodeArray[i]) {
                            fnMsgAlert('info', 'STOS', 'Product name already exits. Please choose a different product.');
                            //alert('Product name already exits. Please choose a different product.');
                            return false;
                        }
                    } else {
                        fnMsgAlert('info', 'STOS', 'Please enter valid product name.');
                        //alert('Please enter product name.');
                        return false;
                    }

                }
            }

            if (EditDoctorValidation == 1) {
                if (OldDoctorcodeArray != '') {
                    //var AddOldProductCode = [];
                    //$('.RowEditData').each(function (index, obj) {
                    //    var rNo = obj.id.replace("tableRowData", "");
                    //    AddOldProductCode.push($("#EdithiddenDc" + rNo).val());
                    //});
                    var hddnDoctorCode = $('#hdnDoctorCode').val();

                    for (var i = 0; i < OldDoctorcodeArray.length; i++) {
                        if (OldDoctorcodeArray[i] == hddnDoctorCode) {

                            fnMsgAlert('info', 'STOS', 'Doctor name already exits. Please choose a different Doctor');
                            //alert('Doctor name already exits. Please choose a different Doctor');
                            $("#Town").val('');
                            $("#Speciality").val('');
                            $("#hdnDoctorCode").val('');
                            $("#txtDoctorName").val('');
                            return false;


                        }

                    }
                }
            } else if (EditDoctorValidation == 2) {
                if (OldDoctorcodeArray != '') {
                    //var AddOldProductCode = [];
                    //$('.RowEditData').each(function (index, obj) {
                    //    var rNo = obj.id.replace("tableRowData", "");
                    //    AddOldProductCode.push($("#EdithiddenDc" + rNo).val());
                    //});
                    var hddnDoctorCode = $('#hdnDoctorCode').val();
                    //var hdnDoctorCount = 0;

                    var arrStrDoctor = [];
                    for (var i = 0; i < OldDoctorcodeArray.length; i++) {
                        if (OldDoctorcodeArray[i] != SelecteditDoctorcode) {
                            arrStrDoctor[i] = OldDoctorcodeArray[i];
                        }
                    }

                    //for (var i = 0; i < arrStrDoctor.length; i++) {
                    //    // if (arrStrDoctor[i] == hddnDoctorCode) {
                    //    if (arrStrDoctor[i] == hddnDoctorCode) {
                    //        // hdnDoctorCount++;
                    //        //if (hdnDoctorCount > 1) {
                    //      //  fnMsgAlert('info', 'STOS', 'Doctor name already exits. Please choose a different Doctor');
                    //        //alert('Doctor name already exits. Please choose a different Doctor');
                    //        $("#Town").val('');
                    //        $("#Speciality").val('');
                    //        $("#hdnDoctorCode").val('');
                    //        $("#txtDoctorName").val('');
                    //        return false;
                    //        //} else {
                    //        //    hdnDoctorCount = 0;
                    //        //}

                    //    }
                    //    //}

                    //}
                }
            }
            $.blockUI({
                message: '<h1>Please Wait</h1>'
            });
            AddProductCode = [];
            AddEditProductcodeArray = [];
            var LastProductRow = $('.clsProductName' + Count).val()
            if (LastProductRow == '') {
                $('#RemoveRow' + Count).closest('tr').remove();
                Count--;
                $('#AddRow' + Count).show();
            } else
                if (LastProductRow == undefined) {
                    Count--;
                    $('#AddRow' + Count).show();
                }

            var ProductRequest = [];
            var STOSRequestModel = new Object();

            STOSRequestModel = {
                STOS_Id: ProductReturnValue,
                User_Code: STOS.defaults.jsonActiveUserDetails.list[0].User_Code,
                User_Name: STOS.defaults.jsonActiveUserDetails.list[0].User_Name,
                Region_Code: STOS.defaults.jsonActiveUserDetails.list[0].Region_Code,
                lstProductRequest: ProductRequest,
                lstDoctorRequest: {

                    Doctor_Code: "" + $('#hdnDoctorCode').val() + "",
                    Doctor_Name: "" + $('#txtDoctorName').val() + "",
                    Local_Area: "" + $('#Town').val() + "",
                    Doctor_Specialty_Code: "" + $('#hdnSpecialityCode').val() + "",
                    Doctor_Specialty_Name: "" + $('#Speciality').val() + "",
                    Doctor_Category_Code: "" + $('#hdnCategoryCode').val() + "",
                    Doctor_Category_Name: "" + $('#hdnCategoryName').val() + "",
                    STOS_Doctor_Id: "" + $('#hdnSTOSDoctorId').val() + "",
                    Requested_By: STOS.defaults.RequestUserName,
                    Request_User_Code: STOS.defaults.RequestUserCode,
                    Request_Region_Code: STOS.defaults.RequestRegionCode,

                }
            };

            var ReturnValidationData = 1;

            if (getNewaddProduct == 0) {
                $('.RowData').each(function (index, obj) {

                    var rNo = obj.id.replace("tableRow", "");
                    var lstProductRequest = {
                        Product_Name: "" + $('#ProductName' + rNo).val() + "",
                        Product_Code: "" + $("#hdnProductCode" + rNo).val() + "",
                        Pack_Size: "" + $('#PackSize' + rNo).val() + "",
                        No_Of_Units: "" + $('#Unit' + rNo).val() + "",
                        Approved_Units: "" + $('#Unit' + rNo).val() + "",
                        STOS_Doctor_Id: "" + $('#hdnDoctorCode').val() + "",
                        Doctor_Code: "" + $('#hdnDoctorCode').val() + "",
                        Requested_By: STOS.defaults.RequestUserName,
                        Request_User_Code: STOS.defaults.RequestUserCode,
                        Request_Region_Code: STOS.defaults.RequestRegionCode,
                        Doctor_Name: "" + $('#txtDoctorName').val() + "",
                    };
                    var UnitValidation = $('#Unit' + rNo).val();
                    if (UnitValidation <= 0) {
                        productCount++
                        fnMsgAlert('info', 'STOS', 'Unit must be greater than 0');
                        //alert('Unit must be greater than 0');
                        return false;
                    }
                    if (UnitValidation == '') {
                        ReturnValidationData = 2;
                        return false;
                    }
                    ProductRequest.push(lstProductRequest);
                });
            } else {
                $('.RowDataEdit').each(function (index, obj) {
                    debugger;
                    var rNo = obj.id.replace("EdittableRow", "");
                    var lstProductRequest = {
                        Product_Name: "" + $('#ProductName' + rNo).val() + "",
                        Product_Code: "" + $("#hdnProductCode" + rNo).val() + "",
                        Pack_Size: "" + $('#PackSize' + rNo).val() + "",
                        No_Of_Units: "" + $('#Unit' + rNo).val() + "",
                        Approved_Units: "" + $('#Unit' + rNo).val() + "",
                        STOS_Doctor_Id: "" + $('#hdnDoctorCode').val() + "",
                        Doctor_Code: "" + $('#hdnDoctorCode').val() + "",
                        Doctor_Name: "" + $('#txtDoctorName').val() + "",
                        Requested_By: STOS.defaults.RequestUserName,
                        Request_User_Code: STOS.defaults.RequestUserCode,
                        Request_Region_Code: STOS.defaults.RequestRegionCode,
                    };
                    var UnitValidation = $('#Unit' + rNo).val();
                    if (UnitValidation <= 0) {
                        productCount++
                        fnMsgAlert('info', 'STOS', 'Unit must be greater than 0');
                        //alert('Unit must be greater than 0');
                        return false;
                    }
                    if (UnitValidation == '') {
                        ReturnValidationData = 2;
                        return false;
                    }
                    ProductRequest.push(lstProductRequest);
                });
            }
            if (productCount > 0) {
                $.unblockUI();
                return false;
            }

            if (ReturnValidationData == 1) {
                STOSServices.postSTOSDocProductData(STOS.defaults.CompanyCode, mode, STOSRequestModel, STOS.fnSTOSReturnSucess, STOS.fnSTOSDoctorDetailsFailure);
            } else {
                $.unblockUI();
                fnMsgAlert('info', 'STOS', 'Please enter value in unit');
                //alert('Please enter value in unit');
                return false;
            }
            //STOS.fnSTOSReturnSucess();
            //var STOSObj = {};
            //STOSObj.STOSRequestModel = JSON.stringify(STOSRequestModel);
        }
    },
    fnSTOSReturnSucess: function (data) {
        debugger;
        ProductReturnValue = data;
        $('#hdnDoctorName').val('');
        $('#hdnDoctorCode').val('');
        $('#hdnCategoryName').val('');
        $('#hdnCategoryCode').val('');
        $('#hdnSTOSDoctorId').val('');
        $('#hdnSpecialityCode').val('');
        STOSServices.getSTOSDepot(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, STOS.fngetSTOSDepotSucess, STOS.fngetSTOSDepotFailure);
        //STOSServices.getParticularSTOSDetails(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, ProductReturnValue, STOS.fnSTOSInsertReturnSucess, STOS.fnSTOSInsertReturnFailure);
    },
    fnSTOSInsertReturnSucess: function (data) {
        debugger;
        SelecteditDoctorcode = 1;
        OldDoctorcodeArray = [];
        console.log(data);
        var ReturnData = data;
        var Content = '';
        Content += '<table class="table table-striped">';
        Content += '<thead><tr>';
        Content += '<th>STOS ID</th>';
        Content += '<th>Requested by</th>';
        Content += '<th>Requested for</th>';
        Content += '<th>Requested date</th>';
        Content += '<th>Doctor Name</th>';
        Content += '<th>Specialty Name</th>';
        //Content += '<th>View</th>';
        Content += '<th>Edit</th>';
        Content += '<th>Delete</th>';
        Content += '</tr></thead>';
        Content += '<tbody>';

        for (var i = 0; i < ReturnData.list.length; i++) {
            STOSInsertReturnCount++;
            Content += '<tr id="tableRowData' + AddbindproductCount + '" class="RowEditData">';
            Content += '<td data-title="Request ID">' + ReturnData.list[i].Stos_Id + '</td>';
            Content += '<td data-title="Request By">' + ReturnData.list[i].Requested_By + ',' + ReturnData.list[i].Requested_User_Type_Name + ' (' + ReturnData.list[i].Requested_Region_Name + ')</td>';
            Content += '<td data-title="Request By">' + ReturnData.list[i].User_Name + ',' + ReturnData.list[i].User_Type_Name + '(' + ReturnData.list[i].Region_Name + ')</td>';
            Content += '<td data-title="Request By">' + ReturnData.list[i].Formated_Request_Date + '</td>';
            Content += '<input type="hidden" id="EdithiddenDc' + AddbindproductCount + '" value="' + ReturnData.list[i].Doctor_Code + '"/>';
            Content += '<td data-title="Doctor Name">' + ReturnData.list[i].Doctor_Name + '</td>';
            Content += '<td data-title="Doctor Name">' + ReturnData.list[i].Doctor_Specialty_Name + '</td>';
            //Content += '<td data-title="View"><span class="View_btn' + STOSInsertReturnCount + '"><span onclick="STOS.fnViewProduct(' + ReturnData.list[i].Stos_Id + ')" style="cursor: pointer;"><i class="fa fa-eye" aria-hidden="true"></i></span></span></td>';
            Content += '<td data-title="Edit"><span class="Edit_Btn' + STOSInsertReturnCount + '"><span onclick="STOS.fnEditProduct(' + ReturnData.list[i].Stos_Id + ', \'' + ReturnData.list[i].Doctor_Name + '\',\'' + STOSInsertReturnCount + '\')" style="cursor: pointer;"><i class="fa fa-pencil" aria-hidden="true"></i></span></span></td>';
            Content += '<td data-title="Remove" style="text-align: center;"><span class="close_btn" id="RemoveRowData' + AddbindproductCount + '"><i Onclick="STOS.RequestRemoveRow(\'' + ReturnData.list[i].Stos_Id + '\',\'' + ReturnData.list[i].Doctor_Code + '\',\'' + ReturnData.list[i].Doctor_Name + '\',\'' + ReturnData.list[i].Doctor_Specialty_Name + '\')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
            Content += '</tr>';
            OldDoctorcodeArray.push(ReturnData.list[i].Doctor_Code);
        }
        Content += '</tbody>';
        Content += '</table>';
        Content += '<div class="col-xs-6 form-group" id="dvNew" style="background: #eee;padding: 10px;">';
        Content += '<div>';
        Content += '<label id="referal">Attachments</label></div>';
        Content += '<div id="BoxUpload" style="margin-bottom: 10px;">';
        Content += '<div id="attachment"></div>';
        Content += '</div>';
        Content += '<div id="Expbutton" style="margin-bottom: 10px;">';
        Content += '<div id="uploadfile" style="margin-bottom: 10px;">';
        Content += '</div>';
        Content += '<input type="button" value="Upload" class="btn btn-primary" id="btupload" onclick="fnUploadImage()" />';
        Content += '</div>';
        Content += '</div>';
        Content += '<div class="col-xs-6" id="selectcsa">';
        Content += selectCsa;
        Content += '</div>'
        // Content += '<h5 style="margin-top:0px;">Remarks :</h5><textarea class="form-control" rows="4" id="Requestremarks" maxlength="500"></textarea></div>';
        Content += '<div class="col-xs-12" style="text-align: right;margin-top: 23px;"><div class="col-xs-7" style="text-align: right;padding: 0px;"><span class="MyTeam" style="border: 1px solid red;border: 1px solid red;position: relative;left: 19px;" onclick="STOS.fnInsertReturnCancel();">Cancel STOS</span></div><div class="col-xs-5" style="text-align: right;padding: 0px;"> <span class="MyTeam" onclick="STOS.fnInsertReturnSave();" style:"position:bottom: -15px;">Apply STOS</span> </div></div>';

        //<span class="MyTeam" onclick="STOS.fnInsertReturnDraft();">Draft STOS</span>
        $('#CreateStosMsg').hide();
        $('#ViewAddProductDR').modal("hide");
        $('#Bindproductdata').html(Content);

        for (var i = 0; i < ReturnData.list.length; i++) {
            if (i == 0 && ReturnData.list[i].Remarks != 'null') {
                $("#Requestremarks").val(ReturnData.list[i].Remarks);
            }
        }
        var choosebutton = "";
        choosebutton += "<input type='file' value='ChooseFile' id='ChooseFile'  />";
        $("#uploadfile").html(choosebutton);

        if (ReturnData.list.length == 1) {
            $('#RemoveRowData1').hide();
        }
        $.unblockUI();
        if (STOS.defaults.UrlStosID > 0) {
            STOS.fnUploadedImages(STOS.defaults.UrlStosID);
        } else {
            STOSServices.getUploadedImages(STOS.defaults.CompanyCode, ProductReturnValue, STOS.fngetUploadedImagesUserDataSucess, STOS.fngetUploadedImagesDataFailure);
        }
    },
    fngetSTOSDepotSucess: function (data) {
        debugger;
        var Content = '';
        if (data.list != null) {
            Content += '<h5 style="margin-top:0px;">Select CSA :</h5><span><select id="depotvalue">';
            Content += '<option value="">-- Please Select CSA --</option>';
            for (var i = 0; i < data.list.length; i++) {
                Content += '<option value=' + data.list[i].Depot_Code + '>' + data.list[i].Depot_Name + '</option>';
            }
            Content += '</select></span>';
            Content += '<h5 style="margin-top:0px;">Remarks :</h5><textarea class="form-control" rows="4" id="Requestremarks" maxlength="500"></textarea>';
            //$('#selectcsa').html(Content);
            selectCsa = Content;
            csaval = $("#depotvalue").val();
            if (STOS.defaults.hdnCSACode != '') {
                $("#depotvalue").val(STOS.defaults.hdnCSACode);
            }
        }
        else {
            fnMsgAlert('info', 'STOS', 'CSA Name not available for this company');
            // $('.ApplyBtn').hide();
        }
        // Content += '<h5 style="margin-top:0px;">Remarks :</h5><textarea class="form-control" rows="4" id="Requestremarks" maxlength="500"></textarea></div>';
        STOSServices.getParticularSTOSDetails(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, ProductReturnValue, STOS.fnSTOSInsertReturnSucess, STOS.fnSTOSInsertReturnFailure);
    },
    fngetSTOSDepotFailure: function () {

    },
    RequestRemoveRow: function (stosid, DoctorCode, DoctorName, Speciality_Name) {
        debugger;
        var DeleteConform = confirm(" Are you sure Delete?");
        if (DeleteConform == false) {
            return false;
        }
        var DeleteDocProduct = new Object();
        DeleteDocProduct = {
            STOS_Id: stosid,
            Doctor_Code: DoctorCode,
            Doctor_Name: DoctorName,
            Speciality_Name: Speciality_Name,
            Row_status: 0,
            Updated_By: STOS.defaults.RequestUserName,
            Updated_User_Code: STOS.defaults.RequestUserCode,
        }

        STOSServices.PostDeleteDocProduct(STOS.defaults.CompanyCode, DeleteDocProduct, STOS.fnSTOSRequestRemoveRowSucess, STOS.fnSTOSRequestRemoveRowFailure);
    },
    fnSTOSRequestRemoveRowSucess: function (data) {
        debugger;
        console.log(data);
        STOSServices.getParticularSTOSDetails(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, ProductReturnValue, STOS.fnSTOSInsertReturnSucess, STOS.fnSTOSInsertReturnFailure);
    },
    fnEditProduct: function (STOS_Id, Doctor_Name, getCount) {
        debugger;
        EditDoctorValidation = 2;
        SelecteditDoctorcode = Doctor_Name;
        STOSServices.getSTOSEdit(STOS.defaults.CompanyCode, Doctor_Name, STOS_Id, STOS.fnSTOSEditReturnSucess, STOS.fnSTOSEditReturnFailure);
    },
    fnSTOSEditReturnSucess: function (data) {
        getNewaddProduct = 1;
        debugger;
        $('#hdnAddProduct').val("EDIT");
        EditCount = 0;
        console.log(data);
        var Content = '';
        Content += '<table class="table table-hover">';
        Content += '<thead>';
        Content += '<tr>';
        Content += '<th>Product Name</th>';
        Content += '<th>Pack Size</th>';
        Content += '<th>Unit</th>';
        Content += '<th></th>';
        Content += '<th></th>';
        Content += '</tr>';
        Content += '</thead>';
        Content += '<tbody id="AddNewRowTable">';
        for (var i = 0; i < data.list.length; i++) {
            for (var j = 0; j < data.list[i].lstDoctor.length; j++) {
                $('#txtDoctorName').val(data.list[i].lstDoctor[j].Doctor_Name);
                $('#hdnDoctorName').val(data.list[i].lstDoctor[j].Doctor_Name);
                $('#hdnDoctorCode').val(data.list[i].lstDoctor[j].Doctor_Code);
                $('#hdnCategoryName').val(data.list[i].lstDoctor[j].Doctor_Category_Name);
                $('#hdnCategoryCode').val(data.list[i].lstDoctor[j].Doctor_Category_Code);
                $('#Town').val(data.list[i].lstDoctor[j].Local_Area);
                $('#Speciality').val(data.list[i].lstDoctor[j].Doctor_Specialty_Name);
                $('#hdnSpecialityCode').val(data.list[i].lstDoctor[j].Doctor_Specialty_Code);
                $('#hdnSTOSDoctorId').val(data.list[i].lstDoctor[j].STOS_Doctor_Id);

            }
            for (var k = 0; k < data.list[i].lstProduct.length; k++) {
                EditCount++;
                if ((data.list[i].lstProduct.length - 1) == k) {
                    Content += '<tr id="EdittableRow' + EditCount + '" class="RowDataEdit">';
                    Content += '<td data-title="Product Name"><input type="text" class="form-control clsProductName' + EditCount + '" value="' + data.list[i].lstProduct[k].Product_Name + '" Onclick="STOS.BindAutoComplete(' + EditCount + ');" id="ProductName' + EditCount + '" onblur="STOS.fnEditProductDetails()"><input type="hidden" id="hdnProductName' + EditCount + '"><input type="hidden" id="hdnProductCode' + EditCount + '" value=' + data.list[i].lstProduct[k].Product_Code + '></td>';
                    Content += '<td data-title="Pack Size"><input type="text" min="0" class="form-control" value="' + data.list[i].lstProduct[k].Pack_Size + '" id="PackSize' + EditCount + '" disabled></td>';
                    Content += '<td data-title="Unit"><input type="number" min="0" class="form-control" value="' + data.list[i].lstProduct[k].No_Of_Units + '" id="Unit' + EditCount + '" onkeypress="return STOS.isNumberKey(event);"></td>';
                    Content += '<td data-title="Remove"><span class="close_btn" id="EditRemoveRow' + EditCount + '"><i Onclick="STOS.EditRemoveRow(' + EditCount + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
                    Content += '<td data-title="AddRow" id="EditAddRow' + EditCount + '"><span class="EditaddRow" style="position: relative;top: 6px;cursor: pointer;" Onclick="STOS.EditAddNewRow(' + EditCount + ');"><i title="Add Row" class="fa fa-plus" aria-hidden="true"></i></span></td>';
                    Content += '</tr>';
                    //AddEditProductcodeArray.push(data.list[i].lstProduct[k].Product_Code);
                } else {
                    Content += '<tr id="EdittableRow' + EditCount + '" class="RowDataEdit">';
                    Content += '<td data-title="Product Name"><input type="text" class="form-control clsProductName' + EditCount + '" value="' + data.list[i].lstProduct[k].Product_Name + '" Onclick="STOS.BindAutoComplete(' + EditCount + ');" id="ProductName' + EditCount + '" onblur="STOS.fnEditProductDetails()"><input type="hidden" id="hdnProductName' + EditCount + '"><input type="hidden" id="hdnProductCode' + EditCount + '" value=' + data.list[i].lstProduct[k].Product_Code + '></td>';
                    Content += '<td data-title="Pack Size"><input type="text" min="0" class="form-control" value="' + data.list[i].lstProduct[k].Pack_Size + '" id="PackSize' + EditCount + '" disabled></td>';
                    Content += '<td data-title="Unit"><input type="number" min="0" class="form-control" value="' + data.list[i].lstProduct[k].No_Of_Units + '" id="Unit' + EditCount + '" onkeypress="return STOS.isNumberKey(event);"></td>';
                    Content += '<td data-title="Remove"><span class="close_btn" id="EditRemoveRow' + EditCount + '"><i Onclick="STOS.EditRemoveRow(' + EditCount + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
                    Content += '<td data-title="AddRow" style="display:none;" id="EditAddRow' + EditCount + '"><span class="EditaddRow" Onclick="STOS.EditAddNewRow(' + EditCount + ');"><i title="Add Row" class="fa fa-plus" aria-hidden="true"></i></span></td>';
                    Content += '</tr>';
                    //AddEditProductcodeArray.push(data.list[i].lstProduct[k].Product_Code);
                }
            }
        }
        Content += '</tbody>';
        Content += '</table>';
        debugger;

        $('#AddProductDR').html(Content);
        $('#EditRemoveRow1').hide();
        $('#ViewAddProductDR').modal("show");
        STOSServices.getSTOSDoctorDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSDoctorDetailsSucess, STOS.fnSTOSDoctorDetailsFailure);
        STOSServices.getSTOSProductDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSEditProductDetailsSucess, STOS.fnSTOSProductDetailsFailure);
    },
    fnViewProduct: function (ViewStosId) {
        STOSServices.getParticularSTOSDetails(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, ViewStosId, STOS.fnSTOSViewReturnSucess, STOS.fnSTOSInsertReturnFailure);
    },
    fnSTOSViewReturnSucess: function (data) {
        var Content = '';
        for (var i = 0; i < data.list.length; i++) {
            Content += '<div class="col-xs-12" style="padding:0px;">';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>Request Id</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;">' + data.list[i].Stos_Id + '</div></div>';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>Doctor Name</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;"> ' + data.list[i].Doctor_Name + '</div></div>';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>Specialty Name</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;">' + data.list[i].Doctor_Specialty_Name + ' </div></div>';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>User Name</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;">' + data.list[i].User_Name + ' </div></div>';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>Region Name</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;"> ' + data.list[i].Region_Name + '</div></div>';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>Requested By</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;"> ' + data.list[i].Requested_By + '</div></div>';
            Content += '<div class="col-xs-12" style="padding:0px;border: 1px solid #bbb;"><div class="col-xs-6" style="padding:10px;text-align: center;"><b>Requested Date</b></div><div class="col-xs-6" style="border-left: 1px solid #ddd;padding: 10px;"> ' + data.list[i].Formated_Request_Date + '</div></div>';
            Content += '</div>';
        }

        $('#ViewDetails').html(Content);
        $('#ViewEditDetails').modal("show");
    },
    fnEditProductDetails: function () {
        debugger;
        var PREDetails = $("#ProductName" + EditCount).val();
        ProductDetails = PREDetails.replace(/^\s+|\s+$/g, '');
        //if (ProductDetails != '' && ProductDetails.length != 1) {
        if (ProductDetails != '') {
            ProductDetails = jsonPath(objEditProductDetails, "$.ProductDetails[?(@.Product_Name=='" + ProductDetails + "')]");
            if (ProductDetails != undefined) {
                if (ProductDetails == false) {
                    //fnMsgAlert('info', 'STOS', 'ProductName Not available');
                    //alert("ProductName Not available");

                    $("#PackSize" + EditCount).val('');
                    $("#hdnProductCode" + EditCount).val('');
                    $("#ProductName" + EditCount).val('');
                    $("#Unit" + EditCount).val('');
                    return false;
                } else {
                    $("#PackSize" + EditCount).val(ProductDetails[0].UOM_Type);
                    $("#hdnProductCode" + EditCount).val(ProductDetails[0].Product_Code);
                    //AddEditProductcodeArray.push(ProductDetails[0].Product_Code);

                }
            } else {

                $("#ProductName" + EditCount).val('');
                $("#PackSize" + EditCount).val('');
                $("#hdnProductCode" + EditCount).val('');
                $("#Unit" + EditCount).val('');
                return false;
            }
        } else {

            $("#ProductName" + EditCount).val('');
            $("#PackSize" + EditCount).val('');
            $("#hdnProductCode" + EditCount).val('');
            $("#Unit" + EditCount).val('');
            //fnMsgAlert('info', 'STOS', 'ProductName Not available');
            return false;
        }

        var ProductRNo = 1;
        $('.RowDataEdit').each(function (index, obj) {
            var rNo = obj.id.replace("EdittableRow", "");
            //AddEditProductcodeArray.push($("#hdnProductCode" + rNo).val());
            var EdtiProductNamMe = $("#ProductName" + rNo).val();
            if (EdtiProductNamMe != "") {
                ProductDetails = jsonPath(objEditProductDetails, "$.ProductDetails[?(@.Product_Name=='" + EdtiProductNamMe + "')]");
                if (ProductDetails == false) {
                    $("#PackSize" + rNo).val('');
                    $("#hdnProductCode" + rNo).val('');
                    $("#ProductName" + rNo).val('');
                    $("#Unit" + rNo).val('');
                    return false;
                } else {
                    $("#PackSize" + rNo).val(ProductDetails[0].UOM_Type);
                    $("#hdnProductCode" + rNo).val(ProductDetails[0].Product_Code);
                    //AddEditProductcodeArray.push(ProductDetails[0].Product_Code);
                }
            }
            if ($.inArray($("#ProductName" + rNo).val(), EditObjList) > -1) {
            } else {
                $("#ProductName" + rNo).val('');
                $("#PackSize" + rNo).val('');
                $("#hdnProductCode" + rNo).val('');
                $("#Unit" + rNo).val('');
                ProductRNo = 2;
                return false;
            }
        });

        if (ProductRNo == 2) {
            return false;
        }

    },
    EditAddNewRow: function (data) {
        debugger;
        //Same Stockist Validation 
        //var arrStockist = [];
        //var stCount = 0;
        //$('.RowData').each(function (index, obj) {
        //    debugger;
        //    var sRCount = obj.id.replace("tableRow", "");;

        //    if ($('#hdnProductName' + sRCount).val() != '' && $('#hdnProductName' + sRCount).val() != undefined) {
        //        arrStockist[stCount] = $('#hdnProductName' + sRCount).val();
        //    }
        //    stCount++;
        //});

        //var sorted_arr = arrStockist.slice().sort();
        //var results = [];
        //for (var i = 0; i < arrStockist.length - 1; i++) {
        //    if (sorted_arr[i + 1] == sorted_arr[i]) {
        //        results.push(sorted_arr[i]);
        //    }
        //}

        //if (results.length > 0) {
        //    alert("Product name already enterd for same doctor.");
        //    return false;
        //}

        STOSServices.getSTOSProductDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSEditProductDetailsSucess, STOS.fnSTOSProductDetailsFailure);
        debugger;
        var DataCount = data;
        var Content = '';
        var ProductName = $('#ProductName' + DataCount).val();
        var PackSize = $('#PackSize' + DataCount).val();
        var Unit = $('#Unit' + DataCount).val();
        if (ProductName == '' || Unit == '') {
            fnMsgAlert('info', 'STOS', 'Please Fill Empty Row');
            return false;
        }
        $('#RemoveRow' + data).show();
        $('#EditAddRow' + EditCount).hide();
        $('#EditAddRow' + Editmax).hide();
        EditCount++;
        Content += '<tr id="EdittableRow' + EditCount + '" class="RowDataEdit">';
        Content += '<td data-title="Product Name"><input type="text" class="form-control clsProductName' + EditCount + '" id="ProductName' + EditCount + '" onblur="STOS.fnEditProductDetails()"><input type="hidden" id="hdnProductName' + EditCount + '"><input type="hidden" id="hdnProductCode' + EditCount + '"></td>';
        Content += '<td data-title="Pack Size"><input type="text" min="0" class="form-control" id="PackSize' + EditCount + '" disabled></td>';
        Content += '<td data-title="Unit"><input type="number" min="0" class="form-control" id="Unit' + EditCount + '" onkeypress="return STOS.isNumberKey(event);"></td>';
        //Content += '<td data-title="Remove"><span class="close_btn" id="RemoveRow' + EditCount + '"><i Onclick="STOS.RemoveRow(' + EditCount + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
        //Content += '<td data-title="AddRow" id="AddRow' + EditCount + '"><span class="addRow"  Onclick="STOS.AddNewRow(' + EditCount + ');"><i title="Add Row" class="fa fa-plus" aria-hidden="true"></i></span></td>';
        Content += '<td data-title="Remove"><span class="close_btn" id="EditRemoveRow' + EditCount + '"><i Onclick="STOS.EditRemoveRow(' + EditCount + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
        Content += '<td data-title="AddRow" id="EditAddRow' + EditCount + '"><span class="EditaddRow" style="position: relative;top: 8px;" Onclick="STOS.EditAddNewRow(' + EditCount + ');"><i title="Add Row" class="fa fa-plus" aria-hidden="true"></i></span></td>';
        Content += '</tr>';


        //$("#AddNewRowTable").fadeIn(3000);
        $('#AddNewRowTable').append(Content);
    },
    fnSTOSEditProductDetailsSucess: function (data) {
        EditObjList = [];
        debugger;
        console.log(data);
        if (data.list == '') {
            fnMsgAlert('info', 'STOS', 'Product not avaliable');
            return false;
            console.log(data);
        }
        // Remove Space
        var resultSet = $.grep(data.list, function (e) {
            //return regex.test(e.code);
            debugger;
            e.Product_Name = e.Product_Name.replace(/^\s+|\s+$/g, '');
            EditObjList.push(e.Product_Name);
            return e.Product_Name;
        });


        objEditProductDetails = {
            "ProductDetails": resultSet
        };

        var NameOfProduct = "[";
        for (var i = 0; i < data.list.length; i++) {
            NameOfProduct += "{label:" + '"' + "" + data.list[i].Product_Name + "" + '",' + "value:" + '"' + "" + data.list[i].Product_Code + "" + '"' + "}";
            if (i < data.list.length - 1) {
                NameOfProduct += ",";
            }
        }
        NameOfProduct += "];";
        var ProductjsonString = eval(NameOfProduct);
        $("#ProductName" + EditCount).unautocomplete();
        autoComplete(ProductjsonString, "ProductName" + EditCount, "hdnProductName" + EditCount, "clsProductName" + EditCount);

    },

    BindAutoComplete: function (EditCount) {
        EditClickInputID = EditCount;
        STOSServices.getSTOSProductDetails(STOS.defaults.CompanyCode, STOS.defaults.jsonActiveUserDetails.list[0].Region_Code, STOS.fnSTOSBindEditProductDetailsSucess, STOS.fnSTOSBindEditProductDetailsFailure);
    },
    fnSTOSBindEditProductDetailsSucess: function (data) {
        debugger;
        EditObjList = [];
        if (data.list == '') {
            //fnMsgAlert('info', 'STOS', 'Doctor details not avaliable');
            // fnLoadBody('HiDoctor_Activity/Stos/Index');

            $.msgAlert({
                type: 'info',
                title: 'STOS',
                text: 'Doctor details not avaliable',
                callback: function () {
                    $('.modal-backdrop').css("display", "none");
                    fnLoadBody('HiDoctor_Activity/Stos/Index');
                }
            });
            return false;
            console.log(data);
        }
        debugger;
        var resultSet = $.grep(data.list, function (e) {
            //return regex.test(e.code);
            debugger;
            e.Product_Name = e.Product_Name.replace(/^\s+|\s+$/g, '');
            EditObjList.push(e.Product_Name);
            return e.Product_Name;
        });

        objEditProductDetails = {
            "ProductDetails": resultSet
        };

        var NameOfProduct = "[";
        for (var i = 0; i < data.list.length; i++) {
            NameOfProduct += "{label:" + '"' + "" + data.list[i].Product_Name + "" + '",' + "value:" + '"' + "" + data.list[i].Product_Code + "" + '"' + "}";
            if (i < data.list.length - 1) {
                NameOfProduct += ",";
            }
        }
        NameOfProduct += "];";
        var ProductjsonString = eval(NameOfProduct);
        $("#ProductName" + EditClickInputID).unautocomplete();
        autoComplete(ProductjsonString, "ProductName" + EditClickInputID, "hdnProductName" + EditClickInputID, "clsProductName" + EditClickInputID);

    },
    EditRemoveRow: function (data) {
        debugger;


        var RemoveCount = data;
        var ProductName = $('#ProductName' + RemoveCount).val();
        var PackSize = $('#PackSize' + RemoveCount).val();
        var Unit = $('#Unit' + RemoveCount).val();
        $('#EditRemoveRow' + RemoveCount).closest('tr').remove();

        var TableRowCount = [];
        $('.RowDataEdit').each(function (index, obj) {
            var rNo = obj.id.replace("EdittableRow", "");
            TableRowCount.push(rNo);
        });
        Editmax = -Infinity;
        for (var i = 0; i < TableRowCount.length; i++) {
            if (TableRowCount[i] > Editmax) {
                Editmax = TableRowCount[i];
            }
        }
        EditCount--;
        $('#EditAddRow' + Editmax).show();
    },
    fnInsertReturnSave: function () {
        debugger;
        if ($('#attachment table tr').length == 0) {
            fnMsgAlert('info', 'STOS', 'Please attach the file');
            return false;
        }
        if ($('#depotvalue').val() == '') {
            fnMsgAlert('info', 'STOS', 'Please select CSA');
            return false;
        }

        STOS.fnUpdateRequestStatus(1);
    },
    fnInsertReturnCancel: function () {
        debugger;
        var Content = '';
        Content += '<h5 style="margin: 0px;">Enter cancellation remarks</h5>';
        Content += '<div class="col-xs-12" id="RemarksTextBox" style="padding:0px;"><div class="form-group"><textarea class="form-control" rows="2" id="STOSRemarks" maxlength="500"></textarea></div>';
        $('#STOSRemarks').val('');
        $('#RemarkTextMsg').html(Content);
        $('#RemarkMsg').modal('show');
    },
    fnCancelConform: function (data) {
        debugger;
        //$('#conformMSG').hide();
        var STOSRemarks = $('#STOSRemarks').val();
        if (STOSRemarks == '') {
            fnMsgAlert('info', 'STOS', 'Remarks empty. Please fill remarks');
            //alert('Remarks empty. Please fill remarks');
            return false;
        }
        if (data == 1) {
            var Cancel = new Object();
            Cancel = {
                STOS_Id: ProductReturnValue,
                Approved_By: STOS.defaults.RequestUserName,
                Remarks: STOSRemarks,
                Record_Status: 0,
                Approved_User_Code: STOS.defaults.RequestUserCode,
                Approved_Region_Code: STOS.defaults.RequestRegionCode,
                Approved_Region_Name: STOS.defaults.RequestRegionName,
            }

            STOSServices.postSTOSCancel(STOS.defaults.CompanyCode, ProductReturnValue, Cancel, STOS.fnSTOSCancelReturnSucess, STOS.fnSTOSCancelReturnFailure);
            $('#RemarkMsg').modal('hide');
            $('.modal-backdrop fade in').removeAttr("style").hide();

        }

    },
    fnSTOSCancelReturnSucess: function (data) {

        if (data == 1) {
            $('#RemarkMsg').modal('hide');
            $('.modal-backdrop fade in').removeAttr("style").hide();
            fnLoadBody('HiDoctor_Activity/Stos/Index');
            fnMsgAlert('info', 'STOS', 'Your request has been cancelled');


            return false;
            //alert('Your request has been cancelled');fnInsertReturnSave
        } else {
            fnLoadBody('HiDoctor_Activity/Stos/Index');
            fnMsgAlert('info', 'STOS', 'Your request not cancelled. Please try again');
            return false;
            //alert('Your request not cancelled. Please try again');
        }

    },
    fnInsertReturnDraft: function () {
        ReturnDraft = 3;
        STOS.fnUpdateRequestStatus(3);
    },
    fnUpdateRequestStatus: function (status) {
        debugger;
        var Requestremarks = $('#Requestremarks').val();
        csaval = $("#depotvalue").val();
        var lstImages = [];
        var STOSRequest = new Object();

        STOSRequest = {
            STOS_Id: ProductReturnValue,
            Record_Status: status,
            Remarks: Requestremarks,
            Status_Code: STOS.defaults.OrderStatusData.list[0].Status_Code,
            Cycle_Code: STOS.defaults.OrderStatusData.list[0].Cycle_Code,
            Order_No: STOS.defaults.OrderStatusData.list[0].Order_No,
            Move_Order_No: STOS.defaults.OrderStatusData.list[0].Move_Order,
            Order_No_Status_Name: STOS.defaults.OrderStatusData.list[0].Status_Name,
            Requested_By: STOS.defaults.RequestUserName,
            Requested_User_Code: STOS.defaults.RequestUserCode,
            Requested_Region_Code: STOS.defaults.RequestRegionCode,
            Requested_Region_Name: STOS.defaults.RequestRegionName,
            Requested_User_Type_Name: STOS.defaults.RequestUserTypeName,
            CSA_Code: csaval,
            lstImage: lstImages
        };

        if (uploadFileName.length >= 1) {
            for (var i = 0; i < uploadFileName.length; i++) {
                var imageUrl = uploadFileName[i];
                var lstUploadedImage = {
                    File_Name: imageUrl.split("#")[1],
                    Image_File_Path: imageUrl.split("#")[0],
                    STOS_Id: ProductReturnValue,
                    Uploaded_User_Code: STOS.defaults.RequestUserCode,
                    Updated_User_Code: STOS.defaults.RequestUserCode,
                };
                lstImages.push(lstUploadedImage);
            }
        }
        STOSServices.postUpdateSTOS(STOS.defaults.CompanyCode, STOSRequest, STOS.fnSTOSUpdateSucess, STOS.fnSTOSDoctorDetailsFailure);
    },
    fnSTOSUpdateSucess: function (data) {
        if (ReturnDraft == 3) {
            fnMsgAlert('info', 'STOS', 'Request has been drafted');
            //alert("Request has been created");
            ReturnDraft == "";
            $('#main').load('../HiDoctor_Activity/Stos/Index');
        } else {
            fnMsgAlert('info', 'STOS', 'Request has been created');
            //STOSServices.getSTOSViewDetails(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, STOS.defaults.RequestUserTypeName, mode, STOS.fnSTOSViewDetailsSucess, STOS.fnSTOSViewDetailsFailure);
            STOS.fnMailTrigger(data);
            //alert("Request has been created");
            $('#main').load('../HiDoctor_Activity/Stos/Index');
        }

    },

    //WeeklyMilDetails: function () {
    //    debugger;



    //    STOSServices.getdetailsformail(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, STOS.defaults.RequestUserTypeName, STOS.fngetmailDataSucess, STOS.fngetmailDataFailure);
    //},
    //fngetmailDataSucess: function (data) {
    //    debugger;
    //    var content = '';

    //    if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {

    //        debugger
    //        //data=res;
    //        $("#ViewStostable").html('');
    //        var content = '';
    //        Totallist = [];
    //        Totallist = data;
    //        URMdata = data;
    //        var unique = data.list.reduce(function (item, e1) {
    //            var matches = item.filter(function (e2)
    //            { return e1.User_Name == e2.User_Name });
    //            if (matches.length == 0) {
    //                item.push(e1);
    //            }
    //            return item;
    //        }, []);
    //        if (unique.length > 0) {
    //            debugger
    //            for (var i = 0; i < unique.length; i++) {
    //                content += '<div class="panel-group">';
    //                content += '<div class="panel panel-default">';
    //                content += '<div class="panel-heading" style="background-color: cornflowerblue;color: white;">';
    //                content += '<h4 class="panel-title">';
    //                content += '<a data-toggle="collapse" href="#collapse_' + i + '" onclick="STOS.fnopentable(\'' + unique[i].User_Name + '\',\'' + i + '\');">' + unique[i].User_Name + '</a>';
    //                if (unique[i].Status_Name == 'Applied')
    //                {
    //                    content += '<a><span onclick="STOS.fnMailTrigger(\'' + unique[i].User_Name + '\');" style="margin-left: 75%;text-decoration:underline;cursor:pointer;">Send Mail</span></a>';
    //                }                    
    //                content += '</h4>';
    //                content += '</div>';
    //                content += '<div id="collapse_' + i + '" class="panel-collapse collapse">';
    //                content += '<div class="panel-body" id="Sign_' + i + '">';
    //                content += '</div></div>';
    //                content += '</div>';
    //                content += '</div>';
    //            }
    //            $('#ViewStostable').html(content);
    //        }
    //    }
    //},


    //fnopentable: function (userName, index) {
    //    debugger;
    //    var Content = '';
      

    //    if (URMdata.list.length != 0 && URMdata.list.length != undefined && URMdata.list.length != null && URMdata.list.length != '') {
    //        debugger;
    //        Content += '<table class="table table-striped">';
    //        Content += '<thead> <tr>';
    //        Content += '<th>Stos Id</th>';
    //        Content += '<th>StoS Date</th>';
    //        Content += '<th>User_Name</th>';
    //        Content += '<th>User Type Name</th>';
    //        Content += '<th>Region Name</th>';
    //        Content += '<th>Order No Status Name </th>';
    //        Content += '<th>Pending with</th>';
    //        Content += '<th>Pending Since</th>';
    //        Content += '<th> Email Id</th>';
    //        //Content += '<th>Send Email</th>';
    //        Content += '</tr></thead>';
    //        Content += ' <tbody>';

    //        var userList = $.grep(URMdata.list, function (v) {
    //            return v.User_Name == userName;
    //        });

    //        for (var i = 0; i < userList.length; i++) {
    //            Content += '<tr>';
    //            Content += '<td data-title="Stos Id">' + userList[i].STOS_Id + '</td>';
    //            Content += '<td data-title="StoS_Date">' + userList[i].STOS_Date + '</td>';
    //            Content += '<td data-title="User_Name">' + userList[i].User_Name + '</td>';
    //            Content += '<td data-title="User Type Name">' + userList[i].User_Type_Name + '</td>';
    //            Content += '<td data-title="Region Name">' + userList[i].Region_Name + '</td>';
    //            Content += '<td data-title="Status Name">' + userList[i].Status_Name + '</td>';
    //            Content += '<td data-title="Pending With">' + userList[i].Pending_With + '</td>';
    //            Content += '<td data-title="Pending Since">' + userList[i].Pending_Since + '</td>';
    //            Content += '<td data-title="Email Id">' + userList[i].Email_Id + '</td>';
    //           // Content += "<td><span onclick='STOS.fnMailTrigger(\"" + userList[i].STOS_Id + "\",\"" + userList[i].STOS_Date + "\",\"" + userList[i].User_Name + "\",\"" + userList[i].Region_Name + "\",\"" + userList[i].Status_Name + "\",\"" + userList[i].User_Type_Name + "\",\"" + userList[i].Pending_With + "\",\"" + userList[i].Pending_Since + "\",\"" + userList[i].Email_Id + "\")' style='text-decoration:underline;cursor:pointer'>Send Mail</span></td>";
    //            Content += ' </tr>';
    //        }

    //        Content += '</tbody>';
    //        Content += '</table>';
    //    } else {
    //        Content = '<div class="col-xs-12"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
    //    }
    //    $('#Sign_' + index).html(Content);
    //},

    
    //fngetmailDataFailure: function () {

    //},

    //fnMailTrigger: function (userName) {
    //    debugger;
        


    //    //var MailBody = mailContent

    //    var userList = $.grep(URMdata.list, function (v) {
    //        return v.User_Name == userName;
    //    });

    //    var obj = {
    //        Email_Id: userList[0].Email_Id,
    //        Subject: " Pending STOS Mail",
    //        lstdata: userList
    //    }

    //    STOSServices.getEmailtrigger(STOS.defaults.CompanyCode,obj, STOS.getmailDataSucess, STOS.fngetmailDataFailure);
    //},
    //getmailDataSucess: function (data) {
    //    debugger;
    //    fnMsgAlert("Success", "Successfully Sent Email ", "STOS Email Send Successfully");
    //    return true;
 

    //},
    //fngetmailDataFailure: function (data) {
    //    //if (data.list.length == 0) {

    //    fnMsgAlert("Info", " Failed to send Email ", " Failed to send Email. ");
    //    return true;
    //    //}
    //},

    fnUploadedImages: function (stosId) {
        STOSServices.getUploadedImages(STOS.defaults.CompanyCode, stosId, STOS.fngetUploadedImagesUserDataSucess, STOS.fngetUploadedImagesDataFailure);
    },
    fnSpeciality: function () {
        debugger;
        var Specialitytext = $("#Speciality").val();
        var spec = Specialitytext.replace(/^\s+|\s+$/g, '');
        if (spec != '' && spec.length != 1) {
            var specialitytxt = $.grep(SpecialityjsonString, function (ele, index) { return ele.label == spec; });
            if (specialitytxt == '') {
                $("#Speciality").val('');
                $("#hdnSpecialityCode").val('')
            }
        }
    },
    fngetUploadedImagesUserDataSucess: function (data) {
        var attachment = "";
        var choose = "";
        choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
        uploadFileName = new Array();
        attachment += "<table class='table table-hover'>";
        //attachment += "<thead>";
        for (var i = 0; i < data.list.length; i++) {
            var MyArray = data.list[i].Image_File_Path + "#" + data.list[i].File_Name;

            uploadFileName.push(MyArray);
            attachment += "<tr class='attachmentsimg'><td style='word-wrap: break-word;word-break: break-all;'>Attachment " + [i + 1] + ":</td><td style='word-wrap: break-word;word-break: break-all;'>" + data.list[i].File_Name + "</td><td style='word-wrap: break-word;word-break: break-all;'><a href='" + data.list[i].Image_File_Path + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ",1)' /></td></tr>";
        }
        //attachment += "</thead>";
        attachment += "</table>";
        $("#uploadfile").html('');
        $("#uploadfile").html(choose);
        $("#attachment").html(attachment);
        $("#btupload").show();
        // $("#attachment").unblock();
    },
    isNumberKey: function (evt) {

        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },
};