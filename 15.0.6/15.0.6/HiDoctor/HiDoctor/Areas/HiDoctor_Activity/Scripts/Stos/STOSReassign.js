var ApprovalCount = 0;
var STOSReassign = {
    defaults: {
        CompanyCode: "",
        RegionCode: "",
        RegionName: "",
        UserCode: "",
        UserName: "",
        UserTypeName: "",
        hdnSTOSId: "",
        hdnApprovedDate: ""
    },


    init: function () {
        debugger;
      
        STOSReassign.STOSRequestByUser();
        $('#Gethistory').click(function () {
            STOSReassign.HistorySTOSData();
        });
    },
    STOSRequestByUser: function () {
        debugger;
        STOSServices.getSTOSRequestByUser(STOSReassign.defaults.CompanyCode, STOSReassign.defaults.RegionCode, STOSReassign.defaults.UserTypeName, STOSReassign.fngetSTOSRequestByUserSucess, STOSReassign.fngetSTOSRequestByUserFailure);
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
                Content += '<td style="cursor: pointer;text-decoration: underline;color: blue;" Onclick="STOSReassign.RequestByUserRow(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].Cycle_Code + '\',\'' + data.list[i].Move_Order + '\')">Reassign</td>';
                Content += '</tr>';

            }

            Content += '</tbody></table>';
        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        $('#RequestByUser').html(Content);
        $('#showhideBtn').hide();
    },

    STOSRequestByUser: function () {
        STOSServices.getSTOSRequestByUser(STOSReassign.defaults.CompanyCode, STOSReassign.defaults.RegionCode, STOSReassign.defaults.UserTypeName, STOSReassign.fngetSTOSRequestByUserSucess, STOSReassign.fngetSTOSRequestByUserFailure);
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
                Content += '<td style="cursor: pointer;text-decoration: underline;color: blue;" Onclick="STOSReassign.RequestByUserRow(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].Cycle_Code + '\',\'' + data.list[i].Move_Order + '\')">Reassign</td>';
                Content += '</tr>';

            }

            Content += '</tbody></table>';
        } else {
            Content = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        $('#RequestByUser').html(Content);
        $('#showhideBtn').hide();
    },
    RequestByUserRow: function (stosId, Cycle_Code, Move_Order) {
        debugger;
        $('#hdnCycleCode').val(Cycle_Code);
        $('#hdnMoveOrder').val(Move_Order);
        STOSServices.getSTOSUserRequestDetails(STOSReassign.defaults.CompanyCode, stosId, STOSReassign.fngetSTOSUserRequestDetailsSucess, STOSReassign.fngetSTOSUserRequestDetailsFailure);
    },
    fngetSTOSUserRequestDetailsSucess: function (data) {
        debugger;
        $('#RequestByUserExpense').hide();
        $('#UserRequestDetails').show();
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
        ProductRequestcontent += '<th width="20%">Doctor Specialty Name</th>';
        ProductRequestcontent += '<th width="20%">Doctor Category Name</th>';
        ProductRequestcontent += '<th width="20%">Product Name</th>';
        //ProductRequestcontent += ' <th>Product Code</th>';
        ProductRequestcontent += '<th width="10%">Pack Size</th>';
        ProductRequestcontent += '<th width="10%">No Of Units</th>';
        ProductRequestcontent += ' </tr>';
        ProductRequestcontent += '</thead>';
        ProductRequestcontent += '<tbody>';

        for (var i = 0; i < data.list.length; i++) {

            if (data.list[i].lstSTOSSummary.length != 0 && data.list[i].lstSTOSSummary.length != undefined && data.list[i].lstSTOSSummary.length != null && data.list[i].lstSTOSSummary.length != '') {
                for (var k = 0; k < data.list[i].lstSTOSSummary.length; k++) {
                    debugger;
                    STOSReassign.defaults.hdnSTOSId = data.list[i].lstSTOSSummary[k].STOS_Id;
                    STOSReassign.defaults.hdnApprovedDate = data.list[i].lstSTOSSummary[k].Approved_Date;
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
                        Remarkscontent += '<div class="media-body" style="width: 80%;float: left;"><span style="margin-right:5px;"><b>' + STOSReassign.defaults.UserName + '</b></span>';

                        //  Remarkscontent += '<span style="margin-right:5px;padding:5px 0px;"><span style="margin-left:5px;">' + data.list[i].lstSTOSRemarks[m].Remarks + '</span></span>';
                        if (data.list[i].Remarks != null) {
                            Remarkscontent += '<p>' + data.list[i].Remarks + '</p>';
                        } else {
                            Remarkscontent += '<textarea class="form-control" rows="5" id="Approvalremarks"></textarea>';
                        }
                        Remarkscontent += '</div></div></div>';
                    } else {
                        Remarkscontent += '<div class="col-xs-12" style="padding:0px;">';
                        Remarkscontent += '<div class="col-xs-12" style="margin: 5px 0px;padding: 0px;"><div class="media" style="background: #ddd;padding: 5px;"><div class="media-left" style="display: inline-block;float: left;font-size: 16px;margin-top: 0px;margin-right: 5px;"><i class="fa fa-user" aria-hidden="true"></i></div>';
                        Remarkscontent += '<div class="media-body" style="width: 80%;float: left;"><span style="margin-right:5px;"><b>' + data.list[i].lstSTOSRemarks[m].Remarks_By + '</b> | </span><span style="margin-left:5px;">' + data.list[i].lstSTOSRemarks[m].Formated_Remarks_Datetime + '</span>';

                        //  Remarkscontent += '<span style="margin-right:5px;padding:5px 0px;"><span style="margin-left:5px;">' + data.list[i].lstSTOSRemarks[m].Remarks + '</span></span>';                       
                        Remarkscontent += '<label for="Remarks">' + data.list[i].lstSTOSRemarks[m].Remarks + '</label>';
                        Remarkscontent += '</div></div></div>';
                    }

                }
            } else {
                Remarkscontent = '<div class="col-xs-12" style="background: #f8f8f8;padding: 5px;"><p style="text-align:center;font-weight:bold;margin:15px 0px;">Remarks</p><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
            }


        }
        ProductRequestcontent += '</tbody>';
        ProductRequestcontent += '</table>';

        //var ReassignBtn = '';
        //ReassignBtn += '<span class="MyTeam" style="font-weight: bold;float: left;border: 1px solid red;" onclick="STOSReassign.fnApproveCancel();">Cancel</span>';
        //ReassignBtn += '<span class="MyTeam" id="reassignusertree" style="font-weight: bold;float: right;" onclick="STOSReassign.fnUserhierarchy();">Reassign</span>';

        //    $('#EmployeeDetails').html(Employeecontent);
        $('#STOSSummary').html(STOSSummarycontent);
        $('#ProductRequest').html(ProductRequestcontent);
        $('#Remarks').html(Remarkscontent);
        $('#showhideBtn').show();           
        //$('#UserRequestDetails').hide();


        var Cycle_Code = $('#hdnCycleCode').val();
        var Move_Order = $('#hdnMoveOrder').val();

        //STOSServices.getSTOSOrderStatusDetails(STOSReassign.defaults.CompanyCode, Cycle_Code, Move_Order, STOSReassign.defaults.UserTypeName, STOSReassign.fngetSTOSrderStatusDetailsSucess, STOSReassign.fngetSTOSOrderStatusDetailsFailure);

    },
    //fngetSTOSrderStatusDetailsSucess: function (data) {
        //debugger;
        //console.log(data);
        //var Content = '';
        //Content += '<span class="MyTeam" style="font-weight: bold;float: left;border: 1px solid red;" onclick="STOSReassign.fnApproveCancel();">Cancel</span>';
        //Content += '<span class="MyTeam" id="reassignusertree" style="font-weight: bold;float: right;" onclick="STOSReassign.fnUserhierarchy();">Reassign</span>';


        //$('#TopApprovedUnapproved').html(Content);
       // $('#BottomApprovedUnapproved').html(Content);
        //$('#UserRequestDetails').show();
    //},
    fnReassign: function () {
        STOSServices.getSTOSRequestByUser(STOSReassign.defaults.CompanyCode, STOSApprovallModel, STOSReassign.fngetSTOSStatusDetailsSucess, STOSReassign.fngetSTOSStatusDetailsFailure);
    },
    HistorySTOSData: function () {
        STOSServices.getHistoryHeader(STOSReassign.defaults.CompanyCode, STOSReassign.defaults.hdnSTOSId, STOSReassign.fnSTOSHistoryHeaderSucess, STOSReassign.fnSTOSHistoryHeaderFailure);
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
                Content += '<td data-title="Request By">' + data.list[i].Requested_By + ',' + data.list[i].User_Type_Name + ' (' + data.list[i].Requested_Region_Name + ')</td>';
                Content += '<td data-title="Request for">' + data.list[i].User_Name + ',' + data.list[i].Requested_User_Type_Name + '(' + data.list[i].Region_Name + ')</td>';
                Content += '<td>' + data.list[i].Formated_Requested_Date + '</td>';
                Content += '<td>' + data.list[i].Order_No_Status_Name + '</td>';
                Content += '<td>' + data.list[i].Approved_By + '</td>';
                if (data.list[i].Approved_By != "") {
                    Content += '<td>' + data.list[i].Formated_Approved_Date + '</td>';
                } else {
                    Content += '<td></td>';
                }
                Content += '<td><span style="cursor: pointer;" Onclick="STOSReassign.fnViewHistoryDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].STOS_History_Id + '\')"><i class="fa fa-eye" aria-hidden="true"></i></span></td>';
                Content += '<td><span style="cursor: pointer;" Onclick="STOSReassign.fnViewRemarksDetails(\'' + data.list[i].STOS_Id + '\',\'' + data.list[i].STOS_History_Id + '\')"><i class="fa fa-eye" aria-hidden="true"></i></span></td>';
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
        STOSServices.getSTOSDocProductHistory(STOSReassign.defaults.CompanyCode, stosid, stoshistoryid, STOSReassign.fnHistoryDetailsSucess, STOSReassign.fnHistoryDetailsFailure);
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
                Content += '<td>' + data.list[i].No_Of_Units + '</td>';
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
        STOSServices.getSTOSRemarks(STOSReassign.defaults.CompanyCode, stosid, stoshistoryid, STOSReassign.fnHRemarksDetailsSucess, STOSReassign.fnRemarksDetailsFailure);
    },
    fnHRemarksDetailsSucess: function (data) {
        debugger;


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
    //fngetSTOSStatusDetailsSucess: function (data) {
    //    debugger;
    //    if (Move_Order_No < Order_No) {
    //        alert("Status Successfully Changed");
    //        $("#RequestByUserExpense").show();
    //        STOSApproval.init();
    //    }
    //    else{
    //        STOSServices:GetReassignSTOS(Reassign.defaults.CompanyCode, STOSReassignlModel, Reassign.fngetSTOSStatusDetailsSucess, Reassign.fngetSTOSStatusDetailsFailure);
    //        fngetSTOSStatusDetailsSucess: function(data) {
    //            alert("Status Successfully Changed");
    //            $("#RequestByUserExpense").show();
    //            STOSReassign.init();
    //        }
    //    }
    //}
    fnUserhierarchy: function () {

    },
}

