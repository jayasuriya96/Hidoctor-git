var leaveprivilege_g = "";
var document_Url = "";
var uploaded_files = "";
var drawleaveTable = "";
var resp_g = "";
var drawleaveGrid = "";
var leavegrid_g = "";
var NewLeaveEntry = {
    defaults: {
    },
    Init: function () {
        debugger;
        NewLeaveEntry.fngetusers();
        NewLeaveEntry.fnGetAllPrivileges();
    },
    fngetusers: function () {
        debugger;
        Method_params = ["NewDCRLeave/GetDCRusers", NewLeaveEntry.defaults.companyCode, NewLeaveEntry.defaults.regionCode, NewLeaveEntry.defaults.userCode];
        CoreREST.get(null, Method_params, null, NewLeaveEntry.fnGetusersSucesscallback, NewLeaveEntry.fnGetusersFailurecallback);
    },
    fnGetusersSucesscallback: function (response) {
        debugger;
        var data2 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].User_Code),
                        name: $.trim(response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name)
                    };
                    data2.push(_obj);
                }
            }
            $('#user').empty();
            $('#user').html('<input type="text" id="ddluser" tabindex="1" />');
            var Users = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select User',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: NewLeaveEntry.fngetleavetype,

                allowFiltering: true,

                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('name', 'contains', e.text, true) : dropdown_query;
                    e.updateData(data2, dropdown_query);
                },
            });
            Users.appendTo('#ddluser');
        } else {
            $('#user').empty();
            $('#user').html('<input type="text" id="ddluser" tabindex="1" />');
            var Users = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select User',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',
                change: NewLeaveEntry.fngetleavetype,
                allowFiltering: true,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('name', 'contains', e.text, true) : dropdown_query;
                    e.updateData(data2, dropdown_query);
                },
            });
            Users.appendTo('#ddluser');
        }
        var username = response.list[0].User_Name + '-' + response.list[0].Employee_Name + '-' + response.list[0].User_Type_Name;
        var msObject = document.getElementById("ddluser").ej2_instances[0];
        msObject.value = username;
    },
    fnGetusersFailurecallback: function () {

    },
    fngetleavetype: function () {
        debugger;
        Method_params = ["NewDCRLeave/GetLeavetype", NewLeaveEntry.defaults.companyCode, $("select[name='ddluser']").val()];
        CoreREST.get(null, Method_params, null, NewLeaveEntry.fngetleavetypeSucesscallback, NewLeaveEntry.fngetleavetypeFailurecallback);
    },
    fngetleavetypeSucesscallback: function (response) {
        debugger;
        $('#Submit').show();
        $('#Reset').show();
        resp_g = response.list;
        var data2 = new Array();

        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].Leave_Type_Code),
                        name: $.trim(response.list[i].Leave_Type_Name)
                    };
                    data2.push(_obj);
                }
            }
            $('#leavetype').empty();
            $('#leavetype').html('<input type="text" id="ddlleavetype" tabindex="1" />');
            var leavetype = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Leavetype',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: NewLeaveEntry.fngetdata


            });
            leavetype.appendTo('#ddlleavetype');
        } else {
            $('#leavetype').empty();
            $('#leavetype').html('<input type="text" id="ddlleavetype" tabindex="1" />');
            var leavetype = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Leavetype',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: NewLeaveEntry.fngetdata
            });
            leavetype.appendTo('#ddlleavetype');
        }

    },
    fngetleavetypeFailurecallback: function () {

    },
    fngetdata: function () {
        debugger;
        NewLeaveEntry.fngetleavetypedata();
        NewLeaveEntry.fngettableprivilege();
    },
    fngetleavetypedata: function () {
        debugger;
        Method_params = ["NewDCRLeave/GetLeavetype", NewLeaveEntry.defaults.companyCode, $("select[name='ddluser']").val()];
        CoreREST.get(null, Method_params, null, NewLeaveEntry.fngetleavetypedataSucesscallback, NewLeaveEntry.fngetleavetypedataFailurecallback);
    },
    fngetleavetypedataSucesscallback: function (response) {
        debugger;
        $('#Submit').show();
        $('#Reset').show();
        resp_g = response.list;
    },
    fngetleavetypedataFailurecallback: function () {

    },
    fnGetAllPrivileges: function () {
        debugger;
        $.ajax({
            type: 'POST',
            url: '../Master/GetPrivileges',
            data: "a",
            async: false,
            success: function (response) {
                debugger;
                privilegeContainer_g = response;
                NewLeaveEntry.fnGetPrivilegeValue('LEAVE_VALIDATION_FOR_SUPERIOR', 'NO LEAVE VALIDATION');
            },
            error: function (e) {
                fnMsgAlert("info", "Information", "Calendar Loads failed.");
            }
        });
    },
    fngettableprivilege: function () {
        debugger;
        Method_params = ["NewDCRLeave/Getprivilegeforleave", NewLeaveEntry.defaults.companyCode, $("select[name='ddluser']").val()];
        CoreREST.get(null, Method_params, null, NewLeaveEntry.fngettableprivilegeSucesscallback, NewLeaveEntry.fngettableprivilegeFailurecallback);
    },
    fngettableprivilegeSucesscallback: function (response) {
        debugger;
        leavegrid_g = response.list;
        for (var j = 0; j < leavegrid_g.length; j++) {
            if (leavegrid_g[j].Privilege_Name == "SHOW_LEAVE_BALANCE") {
                drawleaveGrid = "YES";
            }
        }
        if (drawleaveGrid == "YES") {
            NewLeaveEntry.fnCreateLeaveBalanceTable();
        }
    },
    fngettableprivilegeFailurecallback: function () {

    },
    // Retrives the Privilege Value.
    fnGetPrivilegeValue: function (privilegeName, defaultValue) {
        debugger;
        if (privilegeContainer_g != null) {
            if (privilegeName != "") {
                var disjson = $.grep(privilegeContainer_g, function (ele, index) {
                    return index == privilegeContainer_g;
                });
                for (var i = 0; i < privilegeContainer_g.length; i++) {
                    if (privilegeContainer_g[i].PrivilegeName == "LEAVE_VALIDATION_FOR_SUPERIOR") {
                        leaveprivilege_g = privilegeContainer_g[i].PrivilegeValue;
                    }

                }

                //drawleaveGrid = "YES";
                //var selectedValue = jsonPath(privilegeContainer_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
                //if (selectedValue.length > 0) {
                //    defaultValue = selectedValue[0].PrivilegeValue;
                //}
            }
        }
        return defaultValue;
    },
    fnUploadAttachment: function () {
        debugger;
        var details = document.getElementById('leave_doc_upload');
        var files = details.files;
        var file_Name = "";

        // Create FormData object  
        var fileData = new FormData();

        // Looping over all files and add it to FormData object  
        for (var i = 0; i < files.length; i++) {
            fileData.append(files[i].name, files[i]);
            file_Name = files[i].name;
            if (uploaded_files != "") {
                uploaded_files = uploaded_files + "," + file_Name;
            }
            else {
                uploaded_files = file_Name;
            }
        }

        if (files.length > 5) {
            HideModalPopup('dvLoading');
            $('#ddlLeaveType').val('');
            $("#Reason").val('');
            $("#leave_doc_upload").val('');
            uploaded_files = "";
            fnMsgAlert("info", "Info", "You cannot attach more than 5 files");
            return false;
        }
        else {
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Activity/DCRLeaveEntry/UploadAttachment",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    debugger;
                    document_Url = result;
                    if (leaveprivilege_g == "LEAVE BALANCE CHECK") {
                        NewLeaveEntry.fncheckleavebalance();
                    }
                    else if (leaveprivilege_g == "CHECK ALL LEAVE VALIDATIONS") {
                        NewLeaveEntry.fncheckallvalidations();
                    }
                    else {
                        NewLeaveEntry.fninsert();
                    }
                    // fnLeaveSubmit();
                }
            })
        }
    },
    fnsubmit: function () {
        debugger;
        if ($("select[name='ddluser']").val() == null) {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select User",
                button: "Ok",
            });
            return false;
        }
        if ($("#frmdate").val() == "") {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select From date",
                button: "Ok",
            });
            return false;
        }
        if ($("#tdate").val() == "") {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select to date",
                button: "Ok",
            });
            return false;
        }
        if ($("#tdate").val() < $("#frmdate").val()) {
            swal({
                icon: "info",
                title: "Info",
                text: "To date should be greater than from date.",
                button: "Ok",
            });
            return false;
        }
        if ($("select[name='ddlleavetype']").val() == null) {
            swal({
                icon: "info",
                title: "Info",
                text: "Please select leave type",
                button: "Ok",
            });
            return false;
        }
        if ($("#remarks").val() == "") {
            swal({
                icon: "info",
                title: "Info",
                text: "Please enter reason.",
                button: "Ok",
            });
            return false;
        }
        NewLeaveEntry.fnUploadAttachment();

    },
    fninsert: function () {
        debugger;
        if (document_Url == "") {
            document_Url = 0;
        }
        if (uploaded_files == "") {
            uploaded_files = 0;
        }
        var objleave = {
            usercode: $("select[name='ddluser']").val(),
            fromdate: $("#frmdate").val(),
            todate: $("#tdate").val(),
            leavetypecode: $("select[name='ddlleavetype']").val(),
            docurl: document_Url,
            uploaded_files: uploaded_files,
            reason: $("#remarks").val()
        }
        Method_params = ["NewDCRLeave/Insertleavefornew", NewLeaveEntry.defaults.companyCode, NewLeaveEntry.defaults.userCode];
        CoreREST.post(null, Method_params, objleave, NewLeaveEntry.BindpostSuccessData, NewLeaveEntry.BindpostFailure);
    },
    BindpostSuccessData: function (response) {
        debugger;
        if (response == 'SUCCESS') {
            swal({
                icon: "success",
                title: "Success",
                text: 'Saved successfully.',
                button: "Ok",
            }).then(function () {
                NewLeaveEntry.fnreset();
                $('#leaveBalanceTable').html('');
                //if (drawleaveGrid == "YES") {
                //    NewLeaveEntry.fnCreateLeaveBalanceTable();
                //}
            });
        }
        else {
            swal({
                icon: "info",
                title: "Info",
                text: response,
                button: "Ok",
            });
        }
        if (response == "You cannot enter leave for this date period.") {
            debugger;
            $("#tblLeaveBalance").hide();
        }
    },
    BindpostFailure: function () {

    },
    fncheckleavebalance: function () {
        debugger;
        Method_params = ["NewDCRLeave/OnlyLeavebalanceValidationfornewleaveentry", NewLeaveEntry.defaults.companyCode, $("select[name='ddluser']").val(), $("#frmdate").val(), $("#tdate").val(), $("select[name='ddlleavetype']").val()];
        CoreREST.post(null, Method_params, null, NewLeaveEntry.BindpostcheckleavebalanceSuccessData, NewLeaveEntry.BindpostcheckleavebalanceFailure);
    },
    BindpostcheckleavebalanceSuccessData: function (response) {
        debugger;
        if (response == "NO ISSUE") {
            NewLeaveEntry.fninsert();
        }
        else {
            swal({
                icon: "info",
                title: "Info",
                text: response,
                button: "Ok",
            });
        }
    },
    BindpostcheckleavebalanceFailure: function () {

    },
    fncheckallvalidations: function () {
        debugger;
        if (uploaded_files == "") {
            uploaded_files = 0
        }
        Method_params = ["NewDCRLeave/LeaveValidation", NewLeaveEntry.defaults.companyCode, $("select[name='ddluser']").val(), $("#frmdate").val(), $("#tdate").val(), $("select[name='ddlleavetype']").val(), uploaded_files];
        CoreREST.post(null, Method_params, null, NewLeaveEntry.BindpostcheckallvalidationsSuccessData, NewLeaveEntry.BindpostcheckallvalidationsFailure);
    },
    BindpostcheckallvalidationsSuccessData: function (response) {
        debugger;
        if (response == "NO ISSUE") {
            NewLeaveEntry.fninsert();
        }
        else {
            swal({
                icon: "info",
                title: "Info",
                text: response,
                button: "Ok",
            });
        }
    },
    BindpostcheckallvalidationsFailure: function () {

    },
    fnCreateLeaveBalanceTable: function () {
        debugger;
        var tableContent = "";
        var leave_Type = [];
        if (resp_g.length > 0 && !(resp_g.length === undefined)) {
            //var currentYear = (new Date).getFullYear();
            //var previousYear = currentYear - 1;

            tableContent = "<table class='table table-bordered' id='tblLeaveBalance' width='100%'>";
            tableContent += "<thead>";
            tableContent += "<tr><th>Leave Type</th>";
            tableContent += "<th>Carryforward Leave Balance</th>";
            tableContent += "<th>Entitled Leave</th>";
            tableContent += "<th style=display:none;'>Lapsed Num</th>";
            tableContent += "<th>Total Leaves Count</th>";
            tableContent += "<th>Leave Taken</th>";
            tableContent += "<th style=display:none;'>Leaves Pending for Approval Num</th>";
            tableContent += "<th>Balance Leave</th>";
            tableContent += "</tr>";
            tableContent += "</thead>";

            for (var i = 0; i < resp_g.length; i++) {
                tableContent += "<tr>";
                tableContent += "<td>" + resp_g[i].Leave_Type_Name + "</td>";
                leave_Type.push(resp_g[i].Leave_Type_Name);
                tableContent += "<td class='leaveBalanceAlign'>" + resp_g[i].Balance_CF + "</td>";
                tableContent += "<td class='leaveBalanceAlign'>" + resp_g[i].Leave_Eligible + "</td>";
                tableContent += "<td style=display:none;'>" + resp_g[i].Lapsed + "</td>";
                tableContent += "<td class='leaveBalanceAlign'>" + resp_g[i].Opening_Balance + "</td>";
                tableContent += "<td class='leaveBalanceAlign'>" + resp_g[i].Leave_Taken + "</td>";
                tableContent += "<td style=display:none;'>" + resp_g[i].Leave_Taken_Applied + "</td>";
                tableContent += "<td class='leaveBalanceAlign'>" + resp_g[i].Leave_Balance + "</td>";
                tableContent += "</tr>";
            }
            tableContent += "</table>";
        }
        else {
            tableContent = "<span class='leaveMeassage'>You don't have any active leave types.</span>";
        }
        $('#leaveBalanceTable').html(tableContent);
        debugger;
        var current = null;
        var cnt = 0;
        var number_Of_Times = "";
        for (var i = 0; i < leave_Type.length; i++) {
            if (leave_Type[i] != current) {
                if (cnt > 1) {
                    $('#Submit').hide();
                    $('#Reset').hide();
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Same leave type is present more than once. Please contact salesadmin',
                        button: "Ok",
                    });
                    return false;
                }
                current = leave_Type[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 1) {
            $('#Submit').hide();
            $('#Reset').hide();
            swal({
                icon: "info",
                title: "Info",
                text: 'Same leave type is present more than once. Please contact salesadmin',
                button: "Ok",
            });
            //  fnMsgAlert('info', 'Info', 'Same leave type is present more than once. Please contact sales admin');
            return false;
        }
    },
    fnreset: function () {
        debugger;
        resp_g = "";
        $("#ddluser").val('');
        $("#frmdate").val('');
        $("#tdate").val('');
        $("#ddlleavetype").val('');
        $("#remarks").val('');
        $("#leave_doc_upload").val('');
    },
}

//leaveprivilege_g = fnGetPrivilegeValue('LeaveValidationForAboveHierarchy', '');


