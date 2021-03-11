
var grid;
var ReconApproval = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        UserCode: "",
    },
    init:function()
    {},
    fnGetApprovalList: function () {
        $.blockUI();
        var objParam = ["Api/ReconApi/GetApprovalList", ReconApproval.defaults.CompanyCode, ReconApproval.defaults.UserCode];
        ReconApproval.GetCore(objParam, ReconApproval.fnBindApprovalList, ReconApproval.fnFailure);
    },
    fnFailure: function (data) {
        $.unblockUI();
    },
    fnBindApprovalList: function (AprrovalData) {
       
        $('#ProductApproval').html('').show();
        grid = new ej.grids.Grid({
            dataSource: AprrovalData.list,
            showColumnChooser: true,
            allowPaging: true,
            allowGrouping: true,
            allowSorting: true,
            allowFiltering: true,
            allowResizing: true,
            allowCellMerging: true,
            allowScrolling: true,
            allowExcelExport: true, 
            selectionSettings: { type: 'Multiple', checkboxOnly: true },
            pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
            filterSettings: { type: 'CheckBox' },

            toolbar: ['Search', 'ColumnChooser'],
            aggregates: [],
            columns: [
                    { type: 'checkbox', allowFiltering: false, allowSorting: false, width: '60' },
                    { headerText: 'Remarks', template: "     <textarea class=\"e-input\"  maxlength=\"500\" placeholder=\"Enter Remark\"/>", width: 200, textAlign: 'center' },
                    { field: 'Employee_Name', headerText: 'Employee Name', width: 200, textAlign: 'center' },
                    { field: 'For_The_Month', headerText: 'For the month', width: 200, textAlign: 'center' },
                    { field: 'Created_Date', headerText: 'Created Date', width: 200, textAlign: 'center' },
                    { field: 'Product_Recon_Status_Display_Name', headerText: 'Recon Status', width: 200, textAlign: 'center' },

                    { field: 'Is_Variation', headerText: 'Is variation found', width: 200, textAlign: 'center' },
                    { field: 'Last_Approval_By', headerText: 'Last action by', width: 200, textAlign: 'center' },
                    { field: 'Last_Approval_Remarks', headerText: 'Last action remarks', width: 200, textAlign: 'center' },
                    { headerText: 'View', template: "<a href=#;>View</a>", width: 150, textAlign: 'center' },
                    { headerText: 'History', template: "<a href=#;>View History</a>", width: 150, textAlign: 'center' },

            ],
            queryCellInfo: ReconApproval.fnqueryCellInfo,
        });
        grid.appendTo('#ProductApproval');
        $("#ViewTransfer").hide();
        $("#ViewTransfers").hide();
        $.unblockUI();
    },
    fnAjaxcalls: function (Success, failure, RouteURL, Param, ActionType) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: ActionType,
            url: RouteURL,
            async: true,
            data: Param,
            success: function (data) {
                debugger;
                Success(data);
            },
            failure: function (response) {
                debugger;
                failure(data);
            }
        });
    },
    fnView: function (data) {
        var HeaderId = parseInt(data.Product_Recon_Id);
        fnLoadBody("HiDoctor_Master/Recon/ReconSummary?IsEdit=true&HeaderId=" + HeaderId, this, "1119");
    },
    fnViewHistory: function (data) {
        var HeaderId = parseInt(data.Product_Recon_Id);
        var objParam = ["Api/ReconApi/GetApprovalHistory", ReconApproval.defaults.CompanyCode, HeaderId];
        ReconApproval.GetCore(objParam, ReconApproval.fnGetViewHistory, ReconApproval.fnFailure);
    },
    fnGetViewHistory: function (results) {

        var jsHistory = results.list;
        var Content = "";
        Content += "<div style=\"padding-right: 3%;\">";
        Content += "<table class='data display datatable' style='width:100%'>";
        Content += "<thead>";
        Content += "<tr>";
        Content += "<th >Employee Name</th>";
        Content += "<th >Action Taken</th>";
        Content += "<th >Action Date</th>";
        Content += "<th >Remarks</th>";
        Content += "</tr>";
        Content += "</thead>";
        Content += "<tbody>";
        if (results.Count > 0) {
            $.each(jsHistory, function (index, value) {
                Content += "<tr>";
                Content += "<td>" + value["Employee_Name"] + "</td>";
                Content += "<td>" + value["Action_Taken"] + "</td>";
                Content += "<td>" + value["Action_Date"] + "</td>";
                Content += "<td>" + value["Remarks_Given"] + "</td></tr>";
            });

        } else {
            Content += "<tr><td colspan='4' style=\"text-align:center\">No Approval</td></tr>";
        }
        $("#dvView").html("").html(Content);

        $.modal({ div: '#dvView', title: 'Approval History Details', overlayClose: false });

    },

    //RESTApi Common method
    GetCore: function (Param, Success, Failure) {
        CoreREST.get(ReconApproval, Param, null, Success, Failure);
    },
    _addContext: function (url, context) {
        if (context != null && context.length > 0) {
            for (var i = 0; i < context.length; i++) {
                url += context[i] + '/';
            }
        }
        return url;
    },
    PostCore: function (Param, data, Success, Failure) {
        debugger;
        CoreREST.post(null, Param, data, Success, Failure);
    },
    fnApproved: function () {
        $.blockUI();
        ReconApproval.fnInsetedAppoveReject(true);
    },
    fnReject: function () {
        $.blockUI();
        ReconApproval.fnInsetedAppoveReject(false);
    },
    fnInsetedAppoveReject: function (Status) {
        $(':input[type="button"]').prop('disabled', true);
        var selectedrecords = grid.getSelectedRecords();
        var selectedrowindex = grid.getSelectedRowIndexes();

        var lstApproveReject = new Object();
        var ObjApproveList = new Array();

        var RemarksElement = document.querySelectorAll('.e-input');
        if (selectedrecords.length > 0) {
            var Remarks = "";
            var RowIndex = 0;
            var flag = false;

            for (var itr = 0; itr <= selectedrecords.length - 1; itr++) {
                if (RemarksElement.length > 0) {
                    RowIndex = selectedrowindex[itr] + 1;
                    Remarks = $.trim(RemarksElement[RowIndex].value);
                    if (Status == false && Remarks == "") {
                        flag = true;
                        $(RemarksElement).eq(RowIndex).css({ 'border-color': '#FF0000' });
                    }
                }

                lstApproveReject = {
                    Row_Id: itr + 1,
                    User_Code: selectedrecords[itr].User_Code,
                    Product_Recon_Id: selectedrecords[itr].Product_Recon_Id,
                    Remarks: Remarks,
                }
                ObjApproveList.push(lstApproveReject);
            }


            if (Status == false && flag) {
                fnMsgAlert('error', 'Recon', 'Please enter the remarks field.');
                $(':input[type="button"]').prop('disabled', false);
                $.unblockUI();
                return false;
            } else {
                //Update Action for RESTAPI 
                var ApprovedStatus = (Status == true ? 1 : 0);
                var ObjApprove = new Object();
                ObjApprove = {
                    lstApproveRejectModel: ObjApproveList
                }

                ReconApproval.fnUpdateStatus(ApprovedStatus, ObjApprove);


            }
        }
        else {
            fnMsgAlert('error', 'Recon', 'Please select atleast one checkbox.');
            $(':input[type="button"]').prop('disabled', false);
            $.unblockUI();
            return false;
        }
    },
    fnUpdateStatus: function (ApproveStatus, data) {
        var objParam = ["Api/ReconApi/InsertedApproveReject", ReconApproval.defaults.CompanyCode, ReconApproval.defaults.CompanyId, ReconApproval.defaults.UserCode, ApproveStatus];
        ReconApproval.PostCore(objParam, data, ReconApproval.fuUpdateSuccess, ReconApproval.fnFailure);

    },
    fuUpdateSuccess: function (data) {
        $(':input[type="button"]').prop('disabled', false);
        var Message = data.list; 
        if (Message) {
            if (Message.indexOf(":") > 0) {
                var Msg = Message.split(':')[0];
                Msg = Msg.toLowerCase();
                if (Msg == "success") {
                    fnMsgAlert('success', 'Recon', Message.split(':')[1]);
                    $.unblockUI();
                    ReconApproval.fnGetApprovalList();
                }
                else {
                    fnMsgAlert('error', 'Recon', Message.split(':')[1]);
                    if (Message.split(':')[1] == "Insufficient Stock balance.")
                      ReconApproval.fnGetApprovalList();
                    $.unblockUI();
                }
            }
        } else {
            fnMsgAlert('error', 'Recon', data.Message);
            $.unblockUI();
        }

    },
    fnqueryCellInfo: function (args) {

        if (args.column.headerText == "View") {
            if (args.cell.innerText == "[View]") {
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='ReconApproval.fnView(" + args + ")'>Change Status</a>"
            }
            $(args.cell).bind("click", function () {
                ReconApproval.fnView(args.data);
            });
        }
        else if (args.column.headerText == "History") {
            if (args.cell.innerText == "[History]") {
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='ReconApproval.fnViewHistory(" + args.data + ")'>Change Status</a>"
            }
            $(args.cell).bind("click", function () {
                ReconApproval.fnViewHistory(args.data);
            });
        }
        else if (args.column.headerText == "Remarks") {
            $(args.cell).bind("keypress", function (r) {
                $(r.currentTarget)[0].childNodes[0].style = null;
            });
        }

    }

}



