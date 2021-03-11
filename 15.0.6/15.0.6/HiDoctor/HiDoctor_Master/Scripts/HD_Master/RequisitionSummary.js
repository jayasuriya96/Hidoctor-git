var Selection = ''; PRList = ''; POList = '';
var RecList = '';

var RequisitionSummary = {
    defaults: {

    },
    Init: function () {
        RequisitionSummary.fnOnLoadActivities();
        RequisitionSummary.fnGetAllCampaigns();        
        RequisitionSummary.fnGetAllRequisitions();
    },

    fnOnLoadActivities:function(){
        debugger;
        var today=new Date();
        var cdd = today.getDate();
        var cmm = today.getMonth() + 1;
        var cyy = today.getFullYear();
        var currentDate = cdd + '/' + cmm + '/' + cyy;
        today.setDate(today.getDate() - 30);
        var pdd = today.getDate();
        var pmm = today.getMonth() + 1;
        var pyy = today.getFullYear();
        var prevDate = pdd + '/' + pmm + '/' + pyy;     
       

        $('#fromDate').val(prevDate);
        $('#toDate').val(currentDate);
    },
    fnGetGrid: function (value) {
        debugger;
        Selection = $('input[name=type]:checked').val();
        if (value == 0) {
            $('#MCList').attr('disabled', false);
            RequisitionSummary.fnGetAllCampaigns();
        } else if (value == 1) {
            $('#MCList').attr('disabled', false);
            RequisitionSummary.fnGetAllCampaigns();
        } else {
            $('#MCList').val(0);
            $('#MCList').attr('disabled', true);
        }
    },
    fnGetAllCampaigns: function () {
        debugger;
        Selection = $('input[name=type]:checked').val();
        var UserSelType = $('input[name="user"]:checked').val();
       
        var SDate = $('#fromDate').val();
        if (SDate != "" && SDate != undefined) {
            SDate = SDate.split('/')[2] + '/' + SDate.split('/')[1] + '/' + SDate.split('/')[0];
        }
        var EDate = $('#toDate').val();
        if (EDate != "" && EDate != undefined) {
            EDate = EDate.split('/')[2] + '/' + EDate.split('/')[1] + '/' + EDate.split('/')[0];
        }
        $.ajax({
            type: "GET",
            data: "Code=" + UserSelType + "&mode=" + Selection + "&startDate=" + SDate + "&endDate=" + EDate,
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllMarketingCampaignsFromRequisitions",
            success: function (resp) {
                RequisitionSummary.fnBindCampaignsHTML(resp);
            }

        });
    },
    fnBindCampaignsHTML: function (resp) {
        debugger;
        var content = '';
        content += '<option value="0">All</option>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                content += '<option value=' + resp[i].Campaign_Code + '>' + resp[i].Campaign_Name + '</option>';
            }
        }
        $('#MCList').html(content);
    },
    fnValidateInputs:function(){
        debugger;
        var flag=true;
        if ($('#MCList :selected').val() == '' || $('#MCList :selected').val() == undefined) {
            fnMsgAlert('info', 'Purchase Requisition Summary', 'Please Select Marketing Campaign');
            flag = false;
            return;
        }
        var fromDate = '';
        var fDate = '';
        fromDate = $('#fromDate').val();
        if (fromDate != "") {          
            fromDate = fromDate.split('/')[2] + '/' + fromDate.split('/')[1] + '/' + fromDate.split('/')[0];
            fDate = new Date(fromDate);
        }
        var toDate = '';
        var tDate = '';
        toDate = $('#toDate').val();
        if (toDate != "") {
            toDate = toDate.split('/')[2] + '/' + toDate.split('/')[1] + '/' + toDate.split('/')[0];
            tDate = new Date(toDate);
        }
        if (tDate != "" && fDate != "") {
            if (fDate > tDate) {
                fnMsgAlert('info', 'Purchase Requisition Summary', 'To Date should be greater than the From Date.');
                flag = false;
                return;
            }
        }
        return flag;
    },
    fnGetAllRequisitions: function () {
        debugger;
        Selection = $('input[name=type]:checked').val();
        var UserSelType = $('input[name="user"]:checked').val();
        //var chkbox_lngth = $('input[name="user"]').length;
        //var chckd_length = $('input[name="user"]:checked').length;
        //if ($('input[name="user"]:checked').length >= 1) {
        //    for (var i = 0; i < chckd_length; i++) {
        //        UserSelType += $('input[name="user"]:checked').val();
        //        if (i < chckd_length - 1) {
        //            UserSelType += ',';
        //        }
        //    }
        //} else {
        //    UserSelType = '0';
        //}
        
        var SDate = $('#fromDate').val();
        if (SDate != "" && SDate != undefined) {
            SDate = SDate.split('/')[2] + '/' + SDate.split('/')[1] + '/' + SDate.split('/')[0];
        }
        var EDate = $('#toDate').val();
        if (EDate != "" && EDate != undefined) {
            EDate = EDate.split('/')[2] + '/' + EDate.split('/')[1] + '/' + EDate.split('/')[0];
        }
        if (Selection!=2) {
            RequisitionSummary.fnGetAllCampaigns();
        }        
        var result = RequisitionSummary.fnValidateInputs();
        if (result) {
            $.blockUI();
            $.ajax({
                type: "GET",
                data: "Code=" + UserSelType + "&mode=" + Selection + "&startDate=" + SDate + "&endDate=" + EDate,
                url: "../HiDoctor_Master/PurchaseRequisition/GetAllRequisitionstoSummary",
                success: function (resp) {
                    PRList = resp;
                    RequisitionSummary.fnBindRequisitonsListHTML(resp);
                   
                }
            });
        }
    },

    fnBindRequisitonsListHTML: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th>S.No</th>';
        content += '<th>Requisition Id</th>';
        content += '<th>Requisition Date</th>';
        content += '<th>Associated To(Campaign)</th>';
        content += '<th>Procurement Status</th>';
        content += '<th>Dispatch Status</th>';
        content += '<th>Acknowledgement Status</th>';
        content += '<th>Product Track(Dispatched/Requested)</th>';
        content += '</tr></thead><tbody>';
        if (resp.lstSummary.length >= 1) {
            for (var i = 0; i < resp.lstSummary.length; i++) {
                sno++;
                var Pending_Quantity = resp.lstSummary[i].Requested_Quantity - resp.lstSummary[i].Dispatched_Quantity;
                var PQ_Percent = (resp.lstSummary[i].Dispatched_Quantity / resp.lstSummary[i].Requested_Quantity) * 100;
                var PQ_Pen_Percent = 100 - PQ_Percent;
                PQ_Percent = parseFloat(PQ_Percent).toFixed(2);
                content += '<tr style="text-align:center;">';
                content += '<td>' + sno + '</td>';
                content += '<td>' + resp.lstSummary[i].Requisition_Id + '</td>';
                content += '<td>' + resp.lstSummary[i].Requisition_Date + '</td>';
                if (resp.lstSummary[i].Campaign_Code != 0) {
                    content += '<td style="word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">' + resp.lstSummary[i].Campaign_Name + '</td>';
                } else {
                    content += '<td style="word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">General</td>';
                }
                if (parseInt(resp.lstSummary[i].Requested_Quantity) == parseInt(resp.lstSummary[i].Received_Quantity)) {
                    content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png" title="Total Quantity Procured"></td>';
                } else {
                    content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png" title="Pending Procurement"></td>';
                }
                if (parseInt(resp.lstSummary[i].Received_Quantity) > parseInt(resp.lstSummary[i].Dispatched_Quantity) || (resp.lstSummary[i].Received_Quantity == 0 && resp.lstSummary[i].Dispatched_Quantity == 0)) {
                    content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png" title="Dispatch pending from Procured Quantity"></td>';
                } else {
                    content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png" title="Total Procured Quantity is Dispatched"></td>';
                }
                //if (resp.lstSummary[i].Dispatched_Quantity>0) {
                content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png" title="Acknowledgemt pending"></td>';
                //} else {
                //    content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png"></td>';
                //}
                content += '<td><div class="progress" onclick="RequisitionSummary.fnGetProdDetails(\'' + resp.lstSummary[i].Requisition_Id + '\',\'' + i + '\');">';
                content += '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + PQ_Percent + '" aria-valuemin="0" aria-valuemax="100" style="width:' + PQ_Percent + '%" onclick="RequisitionSummary.fnGetProdDetails(\'' + resp.lstSummary[i].Requisition_Id + '\',\'' + i + '\')">';
                content += '<span class="show">' + PQ_Percent + '%</span></div></div></td>';
                content += '</tr>';
                content += '<tr id="rowData' + i + '" class="RowData" style="display:none;"><td colspan="8">';
                content += '<div  id="detmain' + i + '">';
                content += '<div class="form-group" id="detailsProd' + i + '">';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Requistion By</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="ReqBy' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += ' <div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Requistion On</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="ReqOn' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Reference Type</span></p>';
                content += ' </div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += ' <p><span id="RefType' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row genorcamp">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Campaign Start Date</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="CamSDate' + i + '"></span></p>';
                content += '</div>';
                content += '</div></div>';
                content += '<div class="row genorcamp">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Campaign End Date</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="CamEDate' + i + '"></span></p>';
                content += '</div>';
                content += '</div></div>';
                content += '<div class="col-xs-12" id="prodtable' + i + '">';
                content += '</div>';
                content += '<div class="col-xs-12" id="actnbtns' + i + '">';
                content += '<div class="col-xs-6"></div>';
                content += '<div class="col-xs-6">';
                content += '<input type="button" class="btn" value="Close" style="float:right;" onclick="RequisitionSummary.fnCloseProdDetails(' + i + ');" />';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</td></tr>';

            }
            content += '</tbody></table>';
        } else {
            content += '<td colspan="8" style="text-align:center;font-style:italic;">No Purchase Requisition(s) available for the inputs given.</td>';
        }
        $('#PRtbldiv').html(content);
        $.unblockUI();
    },

    fnGetProdDetails: function (Req_Id, rowId) {
        debugger;
        var disjsonProd = '';
        var disjsonHedr = '';
        var content = '';
        var sno = 0;
        if ($('.RowData').is(':visible')) {
            $('.RowData').hide();
        }
        if (Req_Id != "" && Req_Id != undefined) {
            disjsonHedr = jsonPath(PRList.lstSummary, "$.[?(@.Requisition_Id=='" + Req_Id + "')]");
            $('#ReqBy'+rowId).html(disjsonHedr[0].Requisition_By);
            $('#ReqOn' + rowId).html(disjsonHedr[0].Requisition_Date);
            if (disjsonHedr[0].Campaign_Code == 0) {
                $('#RefType' + rowId).html("General");
            } else {
                $('#RefType' + rowId).html(disjsonHedr[0].Campaign_Name);
            }
            if (disjsonHedr[0].Campaign_Code == 0) {
                $('.genorcamp').hide();                
            } else {
                $('#CamSDate' + rowId).html(disjsonHedr[0].Start_Date);
                $('#CamEDate' + rowId).html(disjsonHedr[0].End_Date);
                $('.genorcamp').show();
            }           
        }
        if (Req_Id != "" && Req_Id != undefined) {
            disjsonProd = jsonPath(PRList.lstProducts, "$.[?(@.Requisition_Id=='" + Req_Id + "')]");
        }
        if (disjsonProd.length >= 1) {
            content += '<table class="table table-hover">';
            content += '<thead style="text-align:center;">';
            content += '<tr>';
            content += '<th width="5%;">S.No</th>';
            content += '<th width="30%;">Product</th>';
            content += '<th width="10%;">Requested Quantity</th>';
            content += '<th width="10%;">Procured Quantity</th>';
            content += '<th width="10%;">Dispatched Quantity</th>';
            content += '<th width="10%;">Acknowledged Quantity</th>';
            content += '<th width="10%;">Balance Quantity</th>';
            content += '</tr>';
            content += '</thead><tbody>';
            for (var i = 0; i < disjsonProd.length; i++) {
                sno++;
                var pending_quantity = disjsonProd[i].Requested_Quantity - disjsonProd[i].Dispatched_Quantity;
                content += '<tr style="text-align:center;">';
                content += '<td>' + sno + '</td>';
                content += '<td>' + disjsonProd[i].Product_Name + '</td>';
                content += '<td>' + disjsonProd[i].Requested_Quantity + '</td>';
                if (disjsonProd[i].Received_Quantity > 0) {
                    content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="RequisitionSummary.fnViewOrderedItem(\'' + disjsonProd[i].Requisition_Details_Id + '\');">' + disjsonProd[i].Received_Quantity + '</td>';
                } else {
                    content += '<td>' + disjsonProd[i].Received_Quantity + '</td>';
                }
                if (disjsonProd[i].Dispatched_Quantity > 0) {
                    content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="RequisitionSummary.fnViewDispatched(\'' + disjsonProd[i].Requisition_Details_Id + '\');">' + disjsonProd[i].Dispatched_Quantity + '</td>';
                } else {
                    content += '<td>' + disjsonProd[i].Dispatched_Quantity + '</td>';
                }             
                
                content += '<td>0</td>';
                content += '<td>' + pending_quantity + '</td>';
                content += '</tr>';
            }
            content += '</tbody></table>';
        }
        $('#prodtable' + rowId).html(content);
        $('#detailsProd' + rowId).show();
        $('#rowData' + rowId).show();
    },
    fnCloseProdDetails: function (value) {
        $('#detailsProd' + value).hide();
        $('#rowData' + value).hide();
    },
    fnGetRequisitionsByCampaign: function (value) {
        debugger;
        var disjson = '';
        var resp = {};
        if (value != "" && value != undefined && value != 0) {
            disjson = jsonPath(PRList.lstSummary, "$.[?(@.Campaign_Code=='" + value + "')]");
        } else {
            if (Selection == 0) {
                RequisitionSummary.fnBindRequisitonsListHTML(PRList);
            } else if (Selection == 1) {
                disjson = jsonPath(PRList.lstSummary, "$.[?(@.Campaign_Code>=0)]");
                resp = {
                    lstSummary: disjson,
                };
                RequisitionSummary.fnBindRequisitonsListHTML(resp);
            } else {
                disjson = jsonPath(PRList.lstSummary, "$.[?(@.Campaign_Code==0)]");
                resp = {
                    lstSummary: disjson,
                };
                RequisitionSummary.fnBindRequisitonsListHTML(resp);
            }

        }
        if (disjson.length >= 1) {
            resp = {
                lstSummary: disjson,
            };
            RequisitionSummary.fnBindRequisitonsListHTML(resp);
        }
    },
    fnViewOrderedItem: function (req_det_Id) {
        debugger;
        $.ajax({
            type: "GET",
            data: "Requisition_Details_Id=" + req_det_Id,
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllOrdersProductWise",
            success: function (resp) {
                POList = resp;
                RequisitionSummary.fnBindOrderDetailsHTML(resp);
            }
        });
    },
    fnBindOrderDetailsHTML: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th width="5%;">S.No</th>';
        content += '<th width="30%;">Product</th>';
        content += '<th width="10%;">Ordered Quantity</th>';
        content += '<th width="10%;">Received Quantity</th>';
        content += '<th width="10%;">Balance Quantity</th>';
        content += '<th width="10%;">Action</th>';
        content += '</tr>';
        content += '</thead><tbody>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                sno++;
                var pending_quantity = resp[i].Quantity - resp[i].Received_Quantity;
                content += '<tr style="text-align:center;">';
                content += '<td>' + sno + '</td>';
                content += '<td>' + resp[i].Product_Name + '</td>';
                content += '<td>' + resp[i].Quantity + '</td>';
                content += '<td>' + resp[i].Received_Quantity + '</td>';
                content += '<td>' + pending_quantity + '</td>';
                content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="RequisitionSummary.fnViewReceived(\'' + resp[i].Order_Id + '\',\'' + i + '\');">View</td>';
                content += '</tr>';
                content += '<tr id="rowData_' + i + '" class="RowDataPO" style="display:none;"><td colspan="6">';
                content += '<div  id="detmainPO' + i + '">';
                content += '<div class="form-group" id="detailsProdPO' + i + '">';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Product</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="Prod' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += ' <div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Total Quantity Ordered</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="TQO' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Received Quantity</span></p>';
                content += ' </div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += ' <p><span id="RQ' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Balance Quantity</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="BQ' + i + '"></span></p>';
                content += '</div>';
                content += '</div></div>';
                content += '<div class="col-xs-12" id="prodtablePOR' + i + '">';
                content += '</div>';
                content += '<div class="col-xs-12" id="actnbtnsPOR' + i + '">';
                content += '<div class="col-xs-6"></div>';
                content += '<div class="col-xs-6">';
                content += '<input type="button" class="btn" value="Close" style="float:right;" onclick="RequisitionSummary.fnCloseRecDetails(' + i + ');" />';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</td></tr>';

            }
        } else {
            content += '<td colspan="6" style="text-align:center;font-style:italic;">No Place Orders(s) available for the selected Product.</td>';
        }
        content += '</tbody></table>';
        $('#HistoryOrdersbody').html(content);
        $('#ModalPlaceOrder').modal('show');
    },
    fnViewReceived: function (Ord_Id,rowId) {
        debugger;
        var disjson = '';
        if (Ord_Id != "" && Ord_Id != undefined) {
            disjson = jsonPath(POList, "$.[?(@.Order_Id=='" + Ord_Id + "')]");
        }
        if (disjson.length >= 1) {
            $('#Prod'+rowId).html(disjson[0].Product_Name);
            $('#TQO' + rowId).html(disjson[0].Quantity);
            $('#RQ' + rowId).html(disjson[0].Received_Quantity);
            var PQ_Quantity = disjson[0].Quantity - disjson[0].Received_Quantity;
            $('#BQ' + rowId).html(PQ_Quantity);
        }
        $.ajax({
            type: "GET",
            data: "Order_Id=" + Ord_Id,
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllReceiptsOrderWise",
            success: function (resp) {
                RecList = resp;
                RequisitionSummary.fnBindReceiptsHTML(resp,rowId);
            }
        });
    },
    fnBindReceiptsHTML: function (resp, rowid) {
        debugger;
        //if($('#'))
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th width="5%;">S.No</th>';
        content += '<th width="30%;">Receipt Id</th>';
        content += '<th width="10%;">Invoice Number</th>';
        content += '<th width="10%;">Invoice Date</th>';
        content += '<th width="10%;">Received Quantity</th>';
        content += '<th width="10%;">Dispatched Quantity</th>';
        content += '<th width="10%;">Balance Quantity</th>';        
        content += '</tr>';
        content += '</thead><tbody>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                sno++;
                var pending_quantity = resp[i].Quantity - resp[i].Dispatched_Quantity;
                content += '<tr style="text-align:center;">';
                content += '<td>' + sno + '</td>';
                content += '<td>' + resp[i].Receipt_Id + '</td>';
                content += '<td>' + resp[i].Invoice_Number + '</td>';
                content += '<td>' + resp[i].Invoice_Date + '</td>';
                content += '<td>' + resp[i].Quantity + '</td>';
                content += '<td>' + resp[i].Dispatched_Quantity + '</td>';
                content += '<td>' + pending_quantity + '</td>';
                content += '</tr>';
            }
        }
        else {
            content += '<td colspan="7" style="text-align:center;font-style:italic;">No Receipts(s) available for the selected Order.</td>';
        }
        content += '</tbody></table>';
        $('#prodtablePOR' + rowid).html(content);
        $('#rowData_' + rowid).show();
    },
    fnCloseRecDetails: function (rowid) {
        debugger;
        $('#rowData_' + rowid).hide();
    },
    fnViewDispatched: function (Req_Det_Id) {
        debugger;
        $.ajax({
            type: "GET",
            data: "Requisition_Details_Id=" + Req_Det_Id,
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllDispatchDetailsProductWise",
            success: function (resp) {
                RequisitionSummary.fnBindDispatchDetailsHTML(resp);
            }
        })
    },
    fnBindDispatchDetailsHTML: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th width="5%;">S.No</th>';
        content += '<th width="5%;">Dispatch Id</th>';
        content += '<th width="10%;">Dispatched To</th>';
        content += '<th width="10%;">Dispatched Date</th>';
        content += '<th width="10%;">Dispatched Quantity</th>';
        content += '<th width="10%;">Challan Number</th>';        
        content += '</tr>';
        content += '</thead><tbody>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                sno++;
                var pending_quantity = resp[i].Quantity - resp[i].Dispatched_Quantity;
                content += '<tr style="text-align:center;">';
                content += '<td>' + sno + '</td>';
                content += '<td>' + resp[i].Dispatch_Id + '</td>';
                content += '<td>' + resp[i].Employee_Name + " (" + resp[i].User_Name + "," + resp[i].Region_Name + ")" + '</td>';
                content += '<td>' + resp[i].Dispatch_Date + '</td>';
                content += '<td>' + resp[i].Quantity + '</td>';
                content += '<td>' + resp[i].Challan_Number + '</td>';                
                content += '</tr>';
            }
        }
        else {
            content += '<td colspan="7" style="text-align:center;font-style:italic;">No Dispatch Detail available for the selected Product.</td>';
        }
        content += '</tbody></table>';
        $('#HistoryDispatchbody').html(content);
        $('#ModalDispatch').modal('show');
    },
}