var ApprovalCount = 0;
var STOSApproval = {
    defaults: {
        CompanyCode: "",
        RegionCode: "",
        RegionName: "",
        UserCode: "",
        UserName: "",
        OrderStatusData: "",
        UserTypeName: "",
        ShowTeam: "",
        hdnSTOSId: "",
        hdnApprovedDate: "",

        hdnApprovedStatus_Code: "",
        hdnApprovedOrder_No: "",
        hdnApprovedMove_Order: "",
        hdnApprovedStatus_Owner_Type: "",
        hdnApprovedStatus_Name: "",
        hdnApprovedCycle_Code: ""

    },
    init: function () {
        debugger;
        STOSApproval.STOSRequestByUser();
        $('#Gethistory').click(function () {
            STOSApproval.HistorySTOSData();
        });
    },
    STOSRequestByUser: function () {
        STOSServices.getSTOSRequestByUser(STOSApproval.defaults.CompanyCode, STOSApproval.defaults.RegionCode, STOSApproval.defaults.UserTypeName, STOSApproval.fngetSTOSRequestByUserSucess, STOSApproval.fngetSTOSRequestByUserFailure);
    },
    fngetSTOSRequestByUserSucess(data) {
        debugger;
        $('#UserRequestDetails').hide();
        console.log(data);
        var Content = '';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            Content += '<table class="table table-hover">';
            Content += '<thead><tr>';
            //Content += '<th>Select All<input style="margin-left: 10px;position: relative;top: 2px;"   type="checkbox" value=""></th>';          
            Content += '<th style="text-align: center;">Stos Id</th>';
            Content += '<th>Requested by</th>';
            Content += '<th>Requested for</th>';
            Content += '<th>Requested Date</th>';
            Content += '<th>Current Status</th>';
            Content += '<th>Action</th>';
            Content += '</tr>';
            Content += '</thead>';
            Content += '<tbody>';
            for (var i = 0; i < data.list.length; i++) {
                Content += '<tr>';
                Content += '<td style="text-align: center;">' + data.list[i].STOS_Id + '</td>';
                Content += '<td data-title="Request By">' + data.list[i].Requested_By + ',' + data.list[i].User_Type_Name + ' (' + data.list[i].Requested_Region_Name + ')</td>';
                Content += '<td data-title="Request By">' + data.list[i].User_Name + ',' + data.list[i].Requested_User_Type_Name + '(' + data.list[i].Region_Name + ')</td>';
                Content += '<td><span>' + data.list[i].Formated_Requested_Date + '</span></td>';
                Content += '<td>' + data.list[i].Order_No_Status_Name + '</td>';
                Content += '<td style="cursor: pointer;text-decoration: underline;color: blue;" Onclick="STOSApproval.RequestByUserRow(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].Cycle_Code + '\',\'' + data.list[i].Move_Order + '\',\'' + data.list[i].User_Code + '\')">Action</td>';
                Content += '</tr>';

            }

            Content += '</tbody></table>';
        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        $('#RequestByUser').html(Content);
        $('#showhideBtn').hide();
    },
    RequestByUserRow: function (stosId, Cycle_Code, Move_Order, SelectUserCode) {
        debugger;
        $('#hdnCycleCode').val(Cycle_Code);
        $('#hdnMoveOrder').val(Move_Order);
        $('#hdnSelectUserCode').val(SelectUserCode);
        STOSServices.getSTOSUserRequestDetails(STOSApproval.defaults.CompanyCode, stosId, STOSApproval.fngetSTOSUserRequestDetailsSucess, STOSApproval.fngetSTOSUserRequestDetailsFailure);
    },
    fngetSTOSUserRequestDetailsSucess: function (data) {
        debugger;
        $('#RequestByUserExpense').hide();
        $('#showhideBtn').val('Show Summary');
        console.log(data);
        //var Employeecontent = '';
        //Employeecontent += '<h3 style="margin-bottom: 0px;padding:10px;background: #999999;color: #fff;font-weight: bold;">Employee Details</h3>';

        var STOSSummarycontent = '';
        STOSSummarycontent += '<h3 style="margin-bottom: 0px;padding:10px;background: #999999;color: #fff;font-weight: bold;">STOS Summary </h3>';

        var Remarkscontent = '';
        Remarkscontent += '<h3 style="margin-bottom: 0px;padding:10px;background: #999999;color: #fff;font-weight: bold;">Remarks</h3>';

        var ProductRequestcontent = '';
        ProductRequestcontent += '<h3 style="margin-bottom: 0px;padding:10px;background: #999999;color: #fff;font-weight: bold;">Product Details</h3>';
        ProductRequestcontent += '<table class="table table-bordered">';
        ProductRequestcontent += '<thead><tr>';
        ProductRequestcontent += '<th width="20%">Doctor Name</th>';
        ProductRequestcontent += '<th width="5%">Doctor Type</th>';
        ProductRequestcontent += '<th width="20%">Doctor Specialty Name</th>';
        ProductRequestcontent += '<th width="10%">Doctor Category Name</th>';
        ProductRequestcontent += '<th width="20%">Product Name</th>';
        //ProductRequestcontent += ' <th>Product Code</th>';
        ProductRequestcontent += '<th width="10%">Pack Size</th>';
        ProductRequestcontent += '<th width="10%">No Of Units</th>';
        ProductRequestcontent += ' </tr>';
        ProductRequestcontent += '</thead>';
        ProductRequestcontent += '<tbody>';

        for (var i = 0; i < data.list.length; i++) {
            //if (data.list[i].lstSTOSUserModel.length != 0 && data.list[i].lstSTOSUserModel.length != undefined && data.list[i].lstSTOSUserModel.length != null && data.list[i].lstSTOSUserModel.length != '') {
            //    for (var j = 0; j < data.list[i].lstSTOSUserModel.length; j++) {
            //        Employeecontent += '<div class="col-xs-12 clearfix">';
            //        Employeecontent += '<div class="col-xs-6" style="padding: 0px;">';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Employee Number:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].Employee_Number + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Employee Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].Employee_Name + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">User Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].User_Name + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">User Type Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].User_Type_Name + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Date of Birth:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].DOB + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Date Of joining:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].DOJ + '</span></p>';
            //        Employeecontent += '</div>';

            //        Employeecontent += '<div class="col-xs-6" style="padding: 0px;">';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Reporting Manager Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].Reporting_Manager_Name + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Reporting Manager Region Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].Reporting_Manager_Region_Name + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Region Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].Region_Name + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Region Code:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].Region_Code + '</span></p>';
            //        Employeecontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">User Mobile Number:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSUserModel[j].User_Mobile_Number + '</span></p>';
            //        Employeecontent += '</div>';
            //        Employeecontent += '</div>';

            //    }
            //} else {
            //    Employeecontent = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">Employee Details</p><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
            //}
            if (data.list[i].lstSTOSSummary.length != 0 && data.list[i].lstSTOSSummary.length != undefined && data.list[i].lstSTOSSummary.length != null && data.list[i].lstSTOSSummary.length != '') {
                for (var k = 0; k < data.list[i].lstSTOSSummary.length; k++) {
                    debugger;
                    STOSApproval.defaults.hdnSTOSId = data.list[i].lstSTOSSummary[k].STOS_Id;
                    STOSApproval.defaults.hdnApprovedDate = data.list[i].lstSTOSSummary[k].Approved_Date;
                    STOSSummarycontent += '<div class="col-xs-12 clearfix">';
                    STOSSummarycontent += '<div class="col-xs-6" style="padding: 0px;">';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Stos Id:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].STOS_Id + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested for User Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].User_Name + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested for Region Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Region_Name + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested for User Type Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].User_Type_Name + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Action:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Order_No_Status_Name + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Action by:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Approved_By + '</span></p>';
                    STOSSummarycontent += '</div>';
                    STOSSummarycontent += '<div class="col-xs-6" style="padding: 0px;">';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested by:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Requested_By + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested by Region Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Requested_Region_Name + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested by User Type Name:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Requested_User_Type_Name + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Requested date:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Formated_Requested_Date + '</span></p>';
                    STOSSummarycontent += '<p style="margin:5px 0px;"><span style="font-weight:bold;margin:0px 5px;">Action date:</span><span style="margin:0px 5px;">' + data.list[i].lstSTOSSummary[k].Formated_Approved_Date + '</span></p>';
                    STOSSummarycontent += '</div>';
                    STOSSummarycontent += '</div>';
                }
            } else {
                STOSSummarycontent = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">STOS Summary</p><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
            }
            if (data.list[i].lstProductRequest.length != 0 && data.list[i].lstProductRequest.length != undefined && data.list[i].lstProductRequest.length != null && data.list[i].lstProductRequest.length != '') {
                for (var l = 0; l < data.list[i].lstProductRequest.length; l++) {
                    debugger;
                    ApprovalCount++;
                    ProductRequestcontent += '<tr class="ApprovalRowData" id="ApprovalTabel' + ApprovalCount + '">';
                    ProductRequestcontent += '<input type="hidden" id="hdnStosID' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].STOS_Id + '"/>';
                    ProductRequestcontent += '<input type="hidden" id="hdnStosProductID' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].STOS_Product_Id + '"/>';
                    ProductRequestcontent += '<input type="hidden" id="hdnStosApprovedUnits' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].Approved_Units + '"/>';
                    ProductRequestcontent += '<input type="hidden" id="hdnSTOSDoctorId' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].STOS_Doctor_Id + '"/>';
                    ProductRequestcontent += '<input type="hidden" id="hdnUpdatedBy' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].Updated_By + '"/>';
                    ProductRequestcontent += '<input type="hidden" id="hdnUpdatedUserCode' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].Updated_User_code + '"/>';
                    ProductRequestcontent += '<input type="hidden" id="hdnUpdateDateTime' + ApprovalCount + '" value="' + data.list[i].lstProductRequest[l].Update_DateTime + '"/>';
                    ProductRequestcontent += '<td>' + data.list[i].lstProductRequest[l].Doctor_Name + '</td>';
                    if (data.list[i].lstProductRequest[l].Doctor_Code != null) {
                        ProductRequestcontent += '<td>Rigid</td>';
                    } else {
                        ProductRequestcontent += '<td>Flexi</td>';
                    }
                    ProductRequestcontent += '<td>' + data.list[i].lstProductRequest[l].Doctor_Specialty_Name + '</td>';
                    ProductRequestcontent += '<td>' + data.list[i].lstProductRequest[l].Doctor_Category_Name + '</td>';
                    ProductRequestcontent += '<td>' + data.list[i].lstProductRequest[l].Product_Name + '</td>';
                    //ProductRequestcontent += '<td>' + data.list[i].lstProductRequest[l].Product_Code + '</td>';
                    ProductRequestcontent += '<td>' + data.list[i].lstProductRequest[l].Pack_Size + '</td>';
                    ProductRequestcontent += '<td><input type="text" class="form-control" value="' + data.list[i].lstProductRequest[l].Approved_Units + '" id="STOS_Product_Id' + ApprovalCount + '"></td>';
                    ProductRequestcontent += '</tr>';
                }
            } else {
                ProductRequestcontent = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">Product Details</p><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
            }
            debugger;
            if (data.list[i].lstImages.length != 0 && data.list[i].lstImages.length != undefined && data.list[i].lstImages.length != null && data.list[i].lstImages.length != '') {
                $("#dvImages").html('');
                var stosImagesContent = '';
                stosImagesContent += '<h3 style="margin-bottom: 0px;padding:10px;background: #999999;color: #fff;font-weight: bold;">Attached Referral Document</h3>';
                for (var l = 0; l < data.list[i].lstImages.length; l++) {
                    stosImagesContent += "Attachment " + [l + 1] + " : <a href='" + data.list[i].lstImages[l].Image_File_Path + "'>" + data.list[i].lstImages[l].File_Name + "</a><br/>";
                }
                $("#dvImages").html(stosImagesContent);
            } else {
                $("#dvImages").html('');
            }

            if (data.list[i].lstSTOSRemarks.length != 0 && data.list[i].lstSTOSRemarks.length != undefined && data.list[i].lstSTOSRemarks.length != null && data.list[i].lstSTOSRemarks.length != '') {
                for (var m = 0; m < data.list[i].lstSTOSRemarks.length; m++) {
                    if ((data.list[i].lstSTOSRemarks.length - 1) == m) {
                        Remarkscontent += '<div class="col-xs-12" style="padding:0px;">';
                        Remarkscontent += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 16px;margin-top: 0px;margin-right: 5px;"><i class="fa fa-user" aria-hidden="true"></i></div>';


                        //  Remarkscontent += '<span style="margin-right:5px;padding:5px 0px;"><span style="margin-left:5px;">' + data.list[i].lstSTOSRemarks[m].Remarks + '</span></span>';
                        if (data.list[i].lstSTOSRemarks[m].Remarks == 'null' || data.list[i].lstSTOSRemarks[m].Remarks == '') {
                            Remarkscontent += '<div class="media-body" style="width: 80%;float: left;"><span style="margin-right:5px;"><b>' + STOSApproval.defaults.UserName + '</b></span>';
                            //Remarkscontent += '<p>No Remarks</p>';
                            Remarkscontent += '<textarea class="form-control" rows="5" id="Approvalremarks" maxlength="500"></textarea>';
                        } else {
                            Remarkscontent += '<div class="media-body" style="width: 80%;float: left;"><span style="margin-right:5px;"><b>' + data.list[i].lstSTOSRemarks[m].Remarks_By + '</b></span>';
                            Remarkscontent += '<p>' + data.list[i].lstSTOSRemarks[m].Remarks + '</p>';
                            Remarkscontent += '<div class="media-body" style="width: 80%;float: left;"><span style="margin-right:5px;"><b>' + STOSApproval.defaults.UserName + '</b></span>';

                            Remarkscontent += '<textarea class="form-control" rows="5" id="Approvalremarks" maxlength="500"></textarea>';
                        }


                        Remarkscontent += '</div></div></div>';
                    } else {
                        Remarkscontent += '<div class="col-xs-12" style="padding:0px;">';
                        Remarkscontent += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 16px;margin-top: 0px;margin-right: 5px;"><i class="fa fa-user" aria-hidden="true"></i></div>';
                        Remarkscontent += '<div class="media-body" style="width: 80%;float: left;"><span style="margin-right:5px;"><b>' + data.list[i].lstSTOSRemarks[m].Remarks_By + '</b> | </span><span style="margin-left:5px;">' + data.list[i].lstSTOSRemarks[m].Formated_Remarks_Datetime + '</span>';

                        //  Remarkscontent += '<span style="margin-right:5px;padding:5px 0px;"><span style="margin-left:5px;">' + data.list[i].lstSTOSRemarks[m].Remarks + '</span></span>';  
                        if (data.list[i].lstSTOSRemarks[m].Remarks == 'null' || data.list[i].lstSTOSRemarks[m].Remarks == '') {
                            Remarkscontent += '<p for="Remarks">No Remarks</p>';
                        } else {
                            Remarkscontent += '<p for="Remarks">' + data.list[i].lstSTOSRemarks[m].Remarks + '</p>';
                        }

                        Remarkscontent += '</div></div></div>';
                    }

                }
            } else {
                Remarkscontent = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">Remarks</p><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
            }


        }
        ProductRequestcontent += '</tbody>';
        ProductRequestcontent += '</table>';
        //    $('#EmployeeDetails').html(Employeecontent);
        $('#STOSSummary').html(STOSSummarycontent);
        $('#ProductRequest').html(ProductRequestcontent);
        $('#Remarks').html(Remarkscontent);
        $('#showhideBtn').show();
        $('#UserRequestDetails').hide();


        var Cycle_Code = $('#hdnCycleCode').val();
        var Move_Order = $('#hdnMoveOrder').val();

        STOSServices.getSTOSOrderStatusDetails(STOSApproval.defaults.CompanyCode, Cycle_Code, Move_Order, STOSApproval.defaults.UserTypeName, STOSApproval.fngetSTOSrderStatusDetailsSucess, STOSApproval.fngetSTOSOrderStatusDetailsFailure);

    },
    fngetSTOSrderStatusDetailsSucess: function (data) {
        debugger;
        console.log(data);
        var Content = '';
        Content += '<span class="MyTeam" style="font-weight: bold;float: left;border: 1px solid red;" onclick="STOSApproval.fnApproveCancel();">Cancel</span>';
        for (var i = 0; i < data.list.length; i++) {
            Content += '<span class="MyTeam" style="font-weight: bold;" id="dv+' + data.list[i].Status_Name + '" onClick="STOSApproval.fnApproveClaimCheckUser(\'' + data.list[i].Status_Code + '\',\'' + data.list[i].Order_No + '\',\'' + data.list[i].Move_Order + '\',\'' + data.list[i].Status_Owner_Type + '\',\'' + data.list[i].Status_Name + '\',\'' + data.list[i].Cycle_Code + '\');">' + data.list[i].Status_Name + '</span>';
        }

        $('#TopApprovedUnapproved').html(Content);
        $('#BottomApprovedUnapproved').html(Content);
        $('#UserRequestDetails').show();
    },
    fnApproveClaimCheckUser: function (Status_Code, Order_No, Move_Order, Status_Owner_Type, Status_Name, Cycle_Code) {
        var productCount = 0;
        STOSApproval.defaults.hdnApprovedStatus_Code = Status_Code;
        STOSApproval.defaults.hdnApprovedOrder_No = Order_No;
        STOSApproval.defaults.hdnApprovedMove_Order = Move_Order;
        STOSApproval.defaults.hdnApprovedStatus_Owner_Type = Status_Owner_Type;
        STOSApproval.defaults.hdnApprovedStatus_Name = Status_Name;
        STOSApproval.defaults.hdnApprovedCycle_Code = Cycle_Code;
        var SelectUserCode = $('#hdnSelectUserCode').val();
        if (Move_Order < Order_No) {
            STOSServices.getCheckActiveUserStatus(STOSApproval.defaults.CompanyCode, SelectUserCode, STOSApproval.fnApproveClaimSucess, STOSApproval.fnApproveClaimFailure);
        } else {
            debugger;
            var ApproveClaimTableData = [];
            var STOSApprovalModel = new Object();
            var remarks = $('#Approvalremarks').val();
            if (remarks == undefined || remarks == '') {
                remarks = null;
            }
            STOSApprovalModel = {
                STOS_Id: STOSApproval.defaults.hdnSTOSId,
                Cycle_Code: Cycle_Code,
                Order_No: Order_No,
                Move_Order_No: Move_Order,
                Status_Code: Status_Code,
                Order_No_Status_Name: Status_Name,
                Approved_By: STOSApproval.defaults.UserName,
                Approved_User_Code: STOSApproval.defaults.UserCode,
                Approved_Region_Code: STOSApproval.defaults.RegionCode,
                Approved_Region_Name: STOSApproval.defaults.RegionName,
                Approved_Date: STOSApproval.defaults.hdnApprovedDate,
                lstProduct: ApproveClaimTableData,
                Remarks: remarks,
            }

            $('.ApprovalRowData').each(function (index, obj) {
                var rNo = obj.id.replace("ApprovalTabel", "");
                if ($('#STOS_Product_Id' + rNo).val() == "") {
                    alert('Please enter No of units for product');
                    return false;
                    productCount++;

                }
                if ($('#STOS_Product_Id' + rNo).val() <= 0) {
                    productCount++
                    fnMsgAlert('info', 'STOS', 'Unit must be greater than 0');
                    //alert('Unit must be greater than 0');
                    return false;
                }
                var lstProductRequest = {
                    STOS_Product_Id: "" + $('#hdnStosProductID' + rNo).val() + "",
                    STOS_Id: "" + $("#hdnStosID" + rNo).val() + "",
                    Approved_Units: "" + $('#STOS_Product_Id' + rNo).val() + "",
                    STOS_Doctor_Id: "" + $('#hdnSTOSDoctorId' + rNo).val() + "",
                    Updated_By: STOSApproval.defaults.UserName,
                    Updated_User_Code: STOSApproval.defaults.UserCode,
                };
                ApproveClaimTableData.push(lstProductRequest);
            });
            if (productCount > 0) {
                return false;
            }

            STOSServices.postSTOSStatusChange(STOSApproval.defaults.CompanyCode, STOSApprovalModel, STOSApproval.fngetSTOSStatusDetailsSucess, STOSApproval.fngetSTOSStatusDetailsFailure);

        }
    },
    fnApproveClaimSucess: function (data) {
        debugger;
        var productCount = 0;
        if (data == 1) {
            var hdnStatus_Code = STOSApproval.defaults.hdnApprovedStatus_Code;
            var hdnOrder_No = STOSApproval.defaults.hdnApprovedOrder_No;
            var hdnMove_Order = STOSApproval.defaults.hdnApprovedMove_Order;
            var hdnStatus_Owner_Type = STOSApproval.defaults.hdnApprovedStatus_Owner_Type;
            var hdnStatus_Name = STOSApproval.defaults.hdnApprovedStatus_Name;
            var hdnCycle_Code = STOSApproval.defaults.hdnApprovedCycle_Code;

            var ApproveClaimTableData = [];
            var STOSApprovalModel = new Object();
            var remarks = $('#Approvalremarks').val();
            if (remarks == undefined || remarks == '') {
                remarks = null;
            }
            STOSApprovalModel = {
                STOS_Id: STOSApproval.defaults.hdnSTOSId,
                Cycle_Code: hdnCycle_Code,
                Order_No: hdnOrder_No,
                Move_Order_No: hdnMove_Order,
                Status_Code: hdnStatus_Code,
                Order_No_Status_Name: hdnStatus_Name,
                Approved_By: STOSApproval.defaults.UserName,
                Approved_User_Code: STOSApproval.defaults.UserCode,
                Approved_Region_Code: STOSApproval.defaults.RegionCode,
                Approved_Region_Name: STOSApproval.defaults.RegionName,
                Approved_Date: STOSApproval.defaults.hdnApprovedDate,
                lstProduct: ApproveClaimTableData,
                Remarks: remarks,
            }

            $('.ApprovalRowData').each(function (index, obj) {
                var rNo = obj.id.replace("ApprovalTabel", "");
                if ($('#STOS_Product_Id' + rNo).val() == "") {
                    productCount++;
                    fnMsgAlert('info', 'STOS', 'Please enter No of units for product');
                    //alert('Please enter No of units for product');
                    return false;

                }
                if ($('#STOS_Product_Id' + rNo).val() <= 0) {
                    productCount++
                    fnMsgAlert('info', 'STOS', 'Unit must be greater than 0');
                    //alert('Unit must be greater than 0');
                    return false;
                }
                var lstProductRequest = {
                    STOS_Product_Id: "" + $('#hdnStosProductID' + rNo).val() + "",
                    STOS_Id: "" + $("#hdnStosID" + rNo).val() + "",
                    Approved_Units: "" + $('#STOS_Product_Id' + rNo).val() + "",
                    STOS_Doctor_Id: "" + $('#hdnSTOSDoctorId' + rNo).val() + "",
                    Updated_By: STOSApproval.defaults.UserName,
                    Updated_User_Code: STOSApproval.defaults.UserCode,
                };
                ApproveClaimTableData.push(lstProductRequest);
            });
            if (productCount > 0) {
                return false;
            }

        } else {
            alert("User is Deactivated.Please assign to another user for further action.");
            return false;
            STOSReassign.init();
        }

        STOSServices.postSTOSStatusChange(STOSApproval.defaults.CompanyCode, STOSApprovalModel, STOSApproval.fngetSTOSStatusDetailsSucess, STOSApproval.fngetSTOSStatusDetailsFailure);
    },
    fngetSTOSStatusDetailsSucess: function (data) {
        if (data == 1) {
            fnMsgAlert('info', 'STOS', 'Status Successfully Changed');
            // alert("Status Successfully Changed");
            $("#RequestByUserExpense").show();
            STOSApproval.init();
        }
    },
    HistorySTOSData: function () {
        STOSServices.getHistoryHeader(STOSApproval.defaults.CompanyCode, STOSApproval.defaults.hdnSTOSId, STOSApproval.fnSTOSHistoryHeaderSucess, STOSApproval.fnSTOSHistoryHeaderFailure);
    },
    fnSTOSHistoryHeaderSucess: function (data) {
        var ViewStosCount = 0;
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
                Content += '<td><span style="cursor: pointer;" Onclick="STOSApproval.fnViewHistoryDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].STOS_History_Id + '\')"><i class="fa fa-eye" aria-hidden="true"></i></span></td>';
                Content += '<td><span style="cursor: pointer;" Onclick="STOSApproval.fnViewRemarksDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].STOS_History_Id + '\')"><i class="fa fa-eye" aria-hidden="true"></i></span></td>';
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
        STOSServices.getSTOSDocProductHistory(STOSApproval.defaults.CompanyCode, stosid, stoshistoryid, STOSApproval.fnHistoryDetailsSucess, STOSApproval.fnHistoryDetailsFailure);
    },
    fnHistoryDetailsSucess: function (data) {
        debugger;
        console.log("history");
        console.log(data);
        var ViewStosCount = 0;
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
        $('#HistoryRemarks').hide();
        $('#HistoryRemarks').hide();
        $('#HistoryFullDetails').show();
    },
    fnViewRemarksDetails: function (stosid, stoshistoryid) {
        STOSServices.getSTOSRemarks(STOSApproval.defaults.CompanyCode, stosid, stoshistoryid, STOSApproval.fnHRemarksDetailsSucess, STOSApproval.fnRemarksDetailsFailure);
    },
    fnHRemarksDetailsSucess: function (data) {

        console.log(data);
        var Content = '';
        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {
            for (var i = 0; i < data.list.length; i++) {
                if ((data.list[i].length - 1) == i) {
                    Content += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 30px;margin-top: 8px;margin-right: 10px;"><i class="fa fa-user" aria-hidden="true"></i></div>';
                    Content += '<div class="media-body" style="float: left;"><span style="margin-right:5px;">' + data.list[i].Remarks_By + '</span><span style="margin-left:5px;">' + data.list[i].Formated_Remarks_Datetime + '</span>';
                    if (data.list[i].Remarks != null) {
                        Content += '<p style="margin-top:5px;">' + data.list[i].Remarks + '</p>';
                    } else {
                        Content += '<textarea class="form-control" rows="2" id="Historyremarks"></textarea>';
                    }
                    Content += ' </div> </div></div>';
                } else {
                    Content += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 30px;margin-top: 8px;margin-right: 10px;"><i class="fa fa-user" aria-hidden="true"></i></div>';
                    Content += '<div class="media-body" style="float: left;"><span style="margin-right:5px;">' + data.list[i].Remarks_By + '</span><span style="margin-left:5px;">' + data.list[i].Formated_Remarks_Datetime + '</span>';
                    if (data.list[i].Remarks != null) {
                        Content += '<p style="margin-top:5px;">' + data.list[i].Remarks + '</p>';
                    } else {
                        Content += '<p style="margin-top:5px;">No remarks</p>';
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
    fnApproveCancel: function () {
        debugger;
        var Content = '';
        Content += '<h5 style="margin: 0px;">Enter cancellation remarks</h5>';
        Content += '<div class="col-xs-12" id="RemarksTextBox" style="padding:0px;"><div class="form-group"><textarea class="form-control" rows="5" id="STOSRemarks"></textarea></div>';
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
                STOS_Id: STOSApproval.defaults.hdnSTOSId,
                Approved_By: STOSApproval.defaults.UserName,
                Remarks: STOSRemarks,
                Record_Status: 0,
                Approved_User_Code: STOSApproval.defaults.UserCode,
                Approved_Region_Code: STOSApproval.defaults.RegionCode,
                Approved_Region_Name: STOSApproval.defaults.RegionName,
            }
            $('#RemarkMsg').modal('hide');
            $.blockUI({
                message: '<h6>Please Wait</h6>'
            });
            STOSServices.postSTOSCancel(STOSApproval.defaults.CompanyCode, STOSApproval.defaults.hdnSTOSId, Cancel, STOSApproval.fnSTOSCancelReturnSucess, STOSApproval.fnSTOSCancelReturnFailure);

        }

    },
    fnSTOSCancelReturnSucess: function (data) {
        $('#STOSRemarks').val('');
        $.unblockUI();
        if (data == 1) {
            fnMsgAlert('info', 'STOS', 'Your request has been cancelled');
            //alert('Your request has been cancelled');
        } else {
            fnMsgAlert('info', 'STOS', 'Your request not cancelled. Please try again');
            //alert('Your request not cancelled. Please try again');
        }

        $('#RequestByUserExpense').show();
        $('#UserRequestDetails').hide();
        $('#showhideBtn').val('Hide Summary');
        $('#showhideBtn').show();
        STOSApproval.STOSRequestByUser();
        //fnLoadBody('HiDoctor_Activity/Stos/Index');
    },
}


