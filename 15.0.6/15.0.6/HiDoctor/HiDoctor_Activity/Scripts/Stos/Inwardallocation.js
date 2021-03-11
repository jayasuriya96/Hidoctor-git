var InputCount = 0;
var Stopservice = 0;
var TreeuserCode = "";
var Flagmode = "INSERT"
var InwardAllocation = {
    defaults: {
        CompanyCode: "",
        RegionCode: "",
        RegionName: "",
        UserCode: "",
        UserName: "",
        UserTypeName: "",
        hdnUser_Name: "",
        hdnRegion_Name: "",
        hdnRequested_By: "",
        hdnApproved_Date: "",
        hdnApproved_By: "",
        hdnOrder_No_Status_Name: "",
        hdnSTOS: "",
        hdnUser_Code: "",
        hdnRegion_Code: "",
        hdnRequestRegion_Name: "",
        hdnRequestUser_Type_Name: "",
        hdnUser_Type_Name: "",
        hdnReqDate: "",
        hdnCSACode: "",
        hdnInwardUserCode: "",
        STOS_Id: "",
        RUser_Code: "",
    },
    init: function () {

        InwardAllocation.fnSTOSFinalStage();
        $('#InwardSave').click(function () {
            //InwardAllocation.fnInwardPostData();
            InwardAllocation.fnCheckActiveUserStatus();
        });
        $('#TreeUserData').click(function () {
            debugger;
            TreeuserCode = $('#hdntreeSelectUserCode').val();
            if (TreeuserCode == '') {
                fnMsgAlert('info', 'STOS', 'Please select user');
                //alert('Please select user');
                $.unblockUI();
                return false;
            } else {
                $('#docDetail').overlay().close();
                STOSServices.getCheckActiveUserStatus(InwardAllocation.defaults.CompanyCode, TreeuserCode, InwardAllocation.fnCheckActiveUserStatusSucess, InwardAllocation.CheckActiveUserStatusFailure);
            }
        })
    },
    fnSTOSFinalStage: function () {
        $.blockUI({
            message: '<h1>Please Wait</h1>'
        });
        STOSServices.getSTOSFinalStage(InwardAllocation.defaults.CompanyCode, InwardAllocation.fnSTOSFinalStageSucess, InwardAllocation.fnSTOSFinalStageFailure);
    },
    fnSTOSFinalStageSucess: function (data) {
        debugger;
        console.log(data);
        var Content = '';
        $.unblockUI();
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            Content += '<table class="table table-hover" style="margin-bottom:0px;">';
            Content += '<thead><tr>';
            Content += '<th>STOS ID</th>';
            Content += '<th>Requested by</th>';
            Content += '<th>Requested for</th>';
            Content += '<th>Requested date</th>';
            Content += '<th>Approved By</th>';
            Content += '<th>Approved date</th>';
            Content += '<th>Current Status</th>';
            Content += '<th>Action</th>';
            Content += '</tr>';
            Content += '</thead>';
            Content += '<tbody>';
            for (var i = 0; i < data.list.length; i++) {

                Content += '<tr>';
                //Content += '<input type="hidden" id="HdnCSACode" value=' + data.list[i].CSA_Code + '>';
                //Content += '<input type="hidden" id="HdnCSACode" value=' + data.list[i].Inward_User_Code + '>';
                //Content +='<td></td>';
                Content += '<td>' + data.list[i].STOS_Id + '</td>';
                Content += '<td>' + data.list[i].Requested_By + ',' + data.list[i].Requested_User_Type_Name + '(' + data.list[i].Requested_Region_Name + ')</td>';
                Content += '<td>' + data.list[i].User_Name + ',' + data.list[i].User_Type_Name + '(' + data.list[i].Region_Name + ')</td>';
                Content += '<td>' + data.list[i].Formated_Requested_Date + '</td>';
                Content += '<td>' + data.list[i].Approved_By + '</td>';
                Content += '<td>' + data.list[i].Formated_Approved_Date + '</td>';
                Content += '<td>' + data.list[i].Order_No_Status_Name + '</td>';
                Content += '<td style="cursor: pointer;text-decoration: underline;color: blue;font-weight: bold;"';
                Content += ' Onclick="InwardAllocation.fnFinalDocProductDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].User_Name + '\',\'' + data.list[i].Region_Name + '\',';
                Content += '\'' + data.list[i].Requested_By + '\',\'' + data.list[i].Formated_Approved_Date + '\',\'' + data.list[i].Approved_By + '\',\'' + data.list[i].Order_No_Status_Name + '\',';
                Content += '\'' + data.list[i].User_code + '\',\'' + data.list[i].Region_Code + '\',\'' + data.list[i].Requested_User_Type_Name + '\',\'' + data.list[i].Requested_Region_Name + '\',\'' + data.list[i].User_Type_Name + '\',\'' + data.list[i].Formated_Requested_Date + '\',\'' + data.list[i].CSA_Code + '\',\''+data.list[i].Requested_User_Code+ '\')">Action</td>';
                Content += '</tr >';
                //,\'' + data.list[i].Inward_User_Code + '\'
            }

        }

        else {
            Content = '<div class="col-xs-12"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        Content += '</tbody></table>';
        $('#STOSFinalStage').html(Content);
        $('#showhideBtn').hide();
        $('#BindFinalDocProductDetails').hide();

        $.unblockUI();
    },
    fnFinalDocProductDetails: function (STOSId, User_Name, Region_Name, Requested_By, Approved_Date, Approved_By, Order_No_Status_Name, User_Code, Region_Code, rUserTypeName, rRegionName, userTypeName, requestedDate, CSACode, InwardUserCode) {
        debugger;
        InwardAllocation.defaults.hdnSTOS = STOSId;
        InwardAllocation.defaults.hdnUser_Name = User_Name;
        InwardAllocation.defaults.hdnRegion_Name = Region_Name;
        InwardAllocation.defaults.hdnRequested_By = Requested_By;
        InwardAllocation.defaults.hdnApproved_Date = Approved_Date;
        InwardAllocation.defaults.hdnApproved_By = Approved_By;
        InwardAllocation.defaults.hdnOrder_No_Status_Name = Order_No_Status_Name;
        InwardAllocation.defaults.hdnUser_Code = User_Code;
        InwardAllocation.defaults.hdnRegion_Code = Region_Code;
        InwardAllocation.defaults.hdnRequestRegion_Name = rRegionName;
        InwardAllocation.defaults.hdnRequestUser_Type_Name = rUserTypeName;
        InwardAllocation.defaults.hdnUser_Type_Name = userTypeName;
        InwardAllocation.defaults.hdnReqDate = requestedDate;
       
        if (CSACode != '') {
            InwardAllocation.defaults.hdnCSACode = CSACode;
            InwardAllocation.defaults.hdnInwardUserCode = InwardUserCode;
            Flagmode = "EDIT"
        } else {
            InwardAllocation.defaults.hdnCSACode = '';
            InwardAllocation.defaults.hdnInwardUserCode = '';
            Flagmode = "INSERT"
        }
        STOSServices.getSTOSFinalDocProductDetails(InwardAllocation.defaults.CompanyCode, STOSId, InwardAllocation.fnSTOSFinalDocProductDetailsSucess, InwardAllocation.fnSTOSFinalDocProductDetailsFailure);
        STOSServices.getSTOSinwardDepot(InwardAllocation.defaults.CompanyCode, InwardAllocation.defaults.RegionCode, InwardAllocation.fnSTOSinwardDepotSucess, InwardAllocation.fnSTOSDepotFailure);

    },
    fnSTOSinwardDepotSucess: function (data) {
        debugger;
        console.log(data);
        var Content = '';


        if (data.list != null) {
            Content += '<select class="form-control" id="SelectDepotValue">';
            Content += '<option value="0">-- Please Select CSA --</option>';
            for (var i = 0; i < data.list.length; i++) {
                Content += '<option value=' + data.list[i].Depot_Code + '>' + data.list[i].Depot_Name + '</option>';
            }
            Content += '</select>';
            $('#selectDepot').html(Content);
            if (InwardAllocation.defaults.hdnCSACode != '') {
                $("#SelectDepotValue").val(InwardAllocation.defaults.hdnCSACode);
            }
        }
        else {
            fnMsgAlert('info', 'STOS', 'CSA Name not available for this company');
            $('.ApplyBtn').hide();
        }


    },
    fnSTOSFinalDocProductDetailsSucess: function (data) {
        debugger;
        console.log(data);
        var Content = '';
        var FinalStageContent = '';

        $('#FinalDocProductDetails').html('');
        FinalStageContent += '<div class="col-xs-12 clearfix">';
        FinalStageContent += '<div class="col-xs-4" style="padding: 0px;">';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested for User Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnUser_Name + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested for Region Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnRegion_Name + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested for User Type Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnUser_Type_Name + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested Date:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnReqDate + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Current Status:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnOrder_No_Status_Name + '</span></p>';
        FinalStageContent += '</div>';
        FinalStageContent += '<div class="col-xs-4" style="padding: 0px;">';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested by User Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnRequested_By + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested by Region Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnRequestRegion_Name + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested by User Type Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnRequestUser_Type_Name + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Approved by User Name:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnApproved_By + '</span></p>';
        FinalStageContent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Approved date:</span><span style="margin:0px 5px;">' + InwardAllocation.defaults.hdnApproved_Date + '</span></p>';
        FinalStageContent += '</div>';
        FinalStageContent += '<div class="col-xs-4" style="padding: 0px;">';
        //FinalStageContent += '<label class="col-xs-4 control-label"> Select CSA </label>';
        //FinalStageContent += '<div class="col-xs-8" style="padding: 0px;" id="selectDepot">';
        //FinalStageContent += '</div>';
        FinalStageContent += '</div>';
        FinalStageContent += '</div>';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {

            Content += '<table class="table table-striped">';
            Content += '<thead><tr>';
            Content += '<th width="40%">Product Name</th>';
            Content += '<th width="10%">UAM</th>';
            Content += '<th width="10%">Requested Quantity</th>';
            Content += '<th width="10%">Approved Quantity</th>';
            Content += '<th width="10%">Dispatched Quantity</th>';
            Content += '<th width="20%">To be dispatched</th>';
            //Content += '<th width="10%">Pending Units</th>';
            Content += '</tr>';
            Content += '</thead>';
            Content += '<tbody>';
            for (var i = 0; i < data.list.length; i++) {
                InputCount++;
                if (data.list[i].Pending_Units > 0) {
                    Content += '<tr class="InwardRowData" id="InwardTrRowData' + InputCount + '">';
                    Content += '<input type="hidden" id="stosID' + InputCount + '" value=' + data.list[i].STOS_Id + '>';
                    Content += '<input type="hidden" id="ProductCode' + InputCount + '" value=' + data.list[i].Product_Code + '>';
                    Content += '<input type="hidden" id="ProductName' + InputCount + '" value="' + data.list[i].Product_Name + '">';
                    Content += '<input type="hidden" id="ApprovedUnits' + InputCount + '" value=' + data.list[i].Approved_Units + '>';
                    Content += '<input type="hidden" id="PendingUnits' + InputCount + '" value=' + data.list[i].Pending_Units + '>';
                    Content += '<input type="hidden" id="NoOfUnits' + InputCount + '" value=' + data.list[i].No_Of_Units + '>';
                    Content += '<input type="hidden" id="TotalAllocatedUnits' + InputCount + '" value=' + data.list[i].Total_Allocated_Units + '>';

                    Content += '<td>' + data.list[i].Product_Name + '</td>';
                    Content += '<td>' + data.list[i].Pack_Size + '</td>';
                    Content += '<td>' + data.list[i].No_Of_Units + '</td>';
                    Content += '<td>' + data.list[i].Approved_Units + '</td>';
                    Content += '<td>' + data.list[i].Total_Allocated_Units + '</td>';

                    Content += '<td><input type="number"  class="form-control" id="txt' + InputCount + '" value="' + data.list[i].Pending_Units + '"></td>';
                    //Content += '<input type="hidden" id="PendingUnits" value=' + data.list[i].Pending_Units + ' >';
                    Content += '</tr>';
                }
                else {
                    Content += '<tr class="InwardRowData" hidden id="InwardTrRowData' + InputCount + '">';
                    Content += '<input type="hidden" id="stosID' + InputCount + '" value=' + data.list[i].STOS_Id + '>';
                    Content += '<input type="hidden" id="ProductCode' + InputCount + '" value=' + data.list[i].Product_Code + '>';
                    Content += '<input type="hidden" id="ProductName' + InputCount + '" value="' + data.list[i].Product_Name + '">';
                    Content += '<input type="hidden" id="ApprovedUnits' + InputCount + '" value=' + data.list[i].Approved_Units + '>';
                    Content += '<input type="hidden" id="PendingUnits' + InputCount + '" value=' + data.list[i].Pending_Units + '>';
                    Content += '<input type="hidden" id="NoOfUnits' + InputCount + '" value=' + data.list[i].No_Of_Units + '>';
                    Content += '<input type="hidden" id="TotalAllocatedUnits' + InputCount + '" value=' + data.list[i].Total_Allocated_Units + '>';

                    Content += '<td>' + data.list[i].Product_Name + '</td>';
                    Content += '<td>' + data.list[i].Pack_Size + '</td>';
                    Content += '<td>' + data.list[i].No_Of_Units + '</td>';
                    Content += '<td>' + data.list[i].Approved_Units + '</td>';
                    Content += '<td>' + data.list[i].Total_Allocated_Units + '</td>';

                    Content += '<td><input type="number"  class="form-control textbx1" onkeypress="javascript:return fnvalidateqty(this,event);"id="txt' + InputCount + '" value="' + data.list[i].Pending_Units + '"></td>';
                    //Content += '<input type="hidden" id="PendingUnits" value=' + data.list[i].Pending_Units + ' >';
                    Content += '</tr>';
                }
            }
            Content += '</tbody></table>';
            $('#STOSFinalStageBind').html(FinalStageContent);
            $('#FinalDocProductDetails').html(Content);
            $('#DocProductDetails').hide();
            $('#showhideBtn').val('Show Summary');
            $('#showhideBtn').show();
            $('#BindFinalDocProductDetails').show();
            $('.ApplyBtn').show();
        } else {
            //Content = '<div class="col-xs-12"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
            $('.ApplyBtn').hide();
            $('#STOSFinalStageBind').html(FinalStageContent);
            //$('#FinalDocProductDetails').html(Content);
            $('#DocProductDetails').hide();
            $('#showhideBtn').val('Show Summary');
            $('#showhideBtn').show();
            $('#BindFinalDocProductDetails').show();
        }
    },
    fnCheckActiveUserStatus: function () {
        // if (TreeuserCode != '') {
        STOSServices.getCheckActiveUserStatus(InwardAllocation.defaults.CompanyCode, InwardAllocation.defaults.hdnUser_Code, InwardAllocation.fnCheckActiveUserStatusSucess, InwardAllocation.CheckActiveUserStatusFailure);
        //} else {
        //    STOSServices.getCheckActiveUserStatus(InwardAllocation.defaults.CompanyCode, InwardAllocation.defaults.hdnUser_Code, InwardAllocation.fnCheckActiveUserStatusSucess, InwardAllocation.CheckActiveUserStatusFailure);
        //}
    },
    fnCheckActiveUserStatusSucess: function (data) {
        debugger;
        $.blockUI({
            message: '<h1>Please Wait</h1>'
        });
        if (data == 0) {
            fnMsgAlert('info', 'STOS', 'User in deactivated. Please select user in tree');
            //alert("User in deactivated. Please select user in tree");
            $.unblockUI();
            return false;
        }
        debugger;
        var SelectDepoval = $("#SelectDepotValue option:selected").val();
        if (SelectDepoval == 0) {
            fnMsgAlert('info', 'STOS', 'Please Select CSA');
            //alert('Please Select CSA');
            $.unblockUI();
            return false;
        }
        var InwardProductAllocation = [];
        var InwardAllocations = new Object();
        var currentUserCode = "";
        if (TreeuserCode != '') {
            currentUserCode = TreeuserCode;
        } else if (InwardAllocation.defaults.hdnInwardUserCode != "null") {
            currentUserCode = InwardAllocation.defaults.hdnInwardUserCode;
        } else {
            currentUserCode = InwardAllocation.defaults.hdnUser_Code;
        }

        InwardAllocations = {
            //STOS_Inward_Id: STOSApproval.defaults.hdnSTOSId,
            STOS_Id: InwardAllocation.defaults.hdnSTOS,
            User_Code: currentUserCode,
            Region_Code: InwardAllocation.defaults.hdnRegion_Code,
            Allocated_By: InwardAllocation.defaults.UserName,
            Allocated_User_Code: InwardAllocation.defaults.UserCode,
            Record_Status: 1,
            CSA_Code: SelectDepoval,
           
            lstInwardProductAllocation: InwardProductAllocation
        }
        var IsAllocated = 1;
        var count = 0;
        $('.InwardRowData').each(function (index, obj) {
            debugger;
            var rNo = obj.id.replace("InwardTrRowData", "");

            var InputValCheck = $('#txt' + rNo).val();
            if (InputValCheck != 0 && InputValCheck != undefined && InputValCheck != '' && InputValCheck != null) {
                IsAllocated = 1;
                count++;
            } 
            
            //else {
            //    IsAllocated = 0;
            //}
            var AddTotalAllocatedUnits = $('#TotalAllocatedUnits' + rNo).val();
            var AddAllocated_Units = $('#txt' + rNo).val();
            var AddallocatedPending = parseInt(AddTotalAllocatedUnits) + parseInt(AddAllocated_Units);

            var AddApprovedUnits = $('#ApprovedUnits' + rNo).val();
            var TextBoxval = $('#txt' + rNo).val();
            var ValidationCheck = parseInt(AddTotalAllocatedUnits) + parseInt(TextBoxval);
            if (AddApprovedUnits < ValidationCheck) {
                fnMsgAlert('info', 'STOS', 'Entered quantity more then approved quantity');
                //alert('Entered quantity more then approved quantity');
                Stopservice = 1;
                $.unblockUI();
                return false;
            }

            var lstProductRequest = {
                //STOS_Inward_Id: "" + $('#hdnStosProductID' + rNo).val() + "",
                Product_Code: "" + $('#ProductCode' + rNo).val() + "",
                Product_Name: "" + $('#ProductName' + rNo).val() + "",
                Approved_Units: "" + $('#NoOfUnits' + rNo).val() + "",
                Allocated_Units: "" + $('#txt' + rNo).val() + "",
                Allocated_By: InwardAllocation.defaults.UserCode,
                Allocated_User_Code: InwardAllocation.defaults.UserCode,
                Row_Status: 1,
                Update_By: InwardAllocation.defaults.UserName,
                Updated_User_Code: InwardAllocation.defaults.UserCode,
                STOS_Id: "" + $('#stosID' + rNo).val() + "",
                Applied_Units: "" + $('#NoOfUnits' + rNo).val() + "",
                Total_Allocated_Units: AddallocatedPending,
                Is_Allocated: IsAllocated,
            };

            InwardProductAllocation.push(lstProductRequest);
        });

        if (Stopservice == 1) {
            $.unblockUI();
            return false;
        } else {
            Stopservice == 0;
        }

        if (count == 0) {
            fnMsgAlert('info', 'STOS', 'Please enter atleast one dispatch qty.');
            //alert("Please enetr atleast one dispatch qty.");
            $.unblockUI();
            return false;
        }

        STOSServices.postInsertInwardAllocation(InwardAllocation.defaults.CompanyCode,Flagmode,InwardAllocation.defaults.UserName, InwardAllocations, InwardAllocation.fnInsertInwardAllocationSucess, InwardAllocation.fnInsertInwardAllocationFailure);


    },
    fnInsertInwardAllocationSucess: function (data) {
        $.unblockUI();
        $('#DocProductDetails').show()
        $('#showhideBtn').show();
        $('#showhideBtn').val('Hide Summary');
        InwardAllocation.fnSTOSFinalStage();
    },

   
}
function fnvalidateqty(ele,e) {
    if (e.keyCode == 45) {
        return false;
    }
}