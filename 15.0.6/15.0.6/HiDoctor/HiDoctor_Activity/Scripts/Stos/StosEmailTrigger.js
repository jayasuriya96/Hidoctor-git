var Totallist = "";
var SpecialityjsonString
var URMdata;

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
        LogUserCode: "",
        hdnCSACode: "",
        UserCode:""
    },

    //init: function () {
    //    STOS.WeeklyMilDetails();
    //},


    WeeklyMilDetails: function () {
        debugger;
        STOSServices.getdetailsformail(STOS.defaults.CompanyCode, STOS.defaults.RequestRegionCode, STOS.defaults.RequestUserCode, STOS.fngetmailDataSucess, STOS.fngetmailDataFailure);
    },
    fngetmailDataSucess: function (data) {
        debugger;
        var content = '';

        if (data.list.length != 0 && data.list.length != undefined && data.list.length != null && data.list.length != '') {

            debugger
            //data=res;
            $("#ViewStostable").html('');
            var content = '';
           // var usercode = LogUserCode;
            Totallist = [];
            Totallist = data;
            URMdata = data;
            var unique = data.list.reduce(function (item, e1) {
                var matches = item.filter(function (e2)
                { return e1.Pending_With == e2.Pending_With });
                if (matches.length == 0) {
                    item.push(e1);
                }
                return item;
            }, []);
            if (unique.length > 0) {
                debugger
                for (var i = 0; i < unique.length; i++) {
                    content += '<div class="panel-group">';
                    content += '<div class="panel panel-default">';
                    content += '<div class="panel-heading" style="background-color: cornflowerblue;color: white;">';
                    content += '<h4 class="panel-title">';
                    content += '<div class="col-sm-8"><a data-toggle="collapse" href="#collapse_' + i + '" onclick="STOS.fnopentable(\'' + unique[i].Pending_With + '\',\'' + i + '\');">' + unique[i].Pending_With + '</a></div>';
                    if (unique[i].Email_Id != ""&&unique[i].Email_Id !=null ) {
                        content += '<div class="col-sm-4"><a><span onclick="STOS.fnMailTrigger(\'' + unique[i].Pending_With + '\',\'' + unique[i].Email_Id + '\',\'' + unique[i].Employee_Name + '\');" style="margin-left: 75%;text-decoration:underline;cursor:pointer;">Send Mail</span></a></div>';
                    }
                    
                    else {
                        content += '</div></div>';

                    }
                    content += '</h4>';
                    content += '</div>';
                    content += '<div id="collapse_' + i + '" class="panel-collapse collapse">';
                    content += '<div class="panel-body" id="Sign_' + i + '">';
                    content += '</div></div>';
                    content += '</div>';
                    content += '</div>';
                 
                }
                $('#ViewStostable').html(content);
            }
        }
    },
    fnopentable: function (PendingWith, index) {
        debugger;
        var Content = '';
        if (URMdata.list.length != 0 && URMdata.list.length != undefined && URMdata.list.length != null && URMdata.list.length != '') {
            debugger;
            Content += '<table class="table table-striped">';
            Content += '<thead> <tr>';
            Content += '<th>Stos Id</th>';
            Content += '<th>StoS Date</th>';
            Content += '<th>User_Name</th>';
            Content += '<th>User Type Name</th>';
            Content += '<th>Region Name</th>';
            Content += '<th>Order No Status Name </th>';
            Content += '<th>Pending with</th>';
            Content += '<th>Pending Since</th>';
            Content += '<th> Email Id</th>';
            //Content += '<th>Send Email</th>';
            Content += '</tr></thead>';
            Content += ' <tbody>';

            var userList = $.grep(URMdata.list, function (v) {
                return v.Pending_With == PendingWith;
            });

            for (var i = 0; i < userList.length; i++) {
                Content += '<tr>';
                Content += '<td data-title="Stos Id">' + userList[i].STOS_Id + '</td>';
                Content += '<td data-title="StoS_Date">' + userList[i].STOS_Date + '</td>';
                Content += '<td data-title="User_Name">' + userList[i].User_Name + '</td>';
                Content += '<td data-title="User Type Name">' + userList[i].User_Type_Name + '</td>';
                Content += '<td data-title="Region Name">' + userList[i].Region_Name + '</td>';
                Content += '<td data-title="Status Name">' + userList[i].Status_Name + '</td>';
                Content += '<td data-title="Pending With">' + userList[i].Pending_With + '</td>';
                Content += '<td data-title="Pending Since">' + userList[i].Pending_Since + '</td>';
                Content += '<td data-title="Email Id">' + userList[i].Email_Id + '</td>';
                // Content += "<td><span onclick='STOS.fnMailTrigger(\"" + userList[i].STOS_Id + "\",\"" + userList[i].STOS_Date + "\",\"" + userList[i].User_Name + "\",\"" + userList[i].Region_Name + "\",\"" + userList[i].Status_Name + "\",\"" + userList[i].User_Type_Name + "\",\"" + userList[i].Pending_With + "\",\"" + userList[i].Pending_Since + "\",\"" + userList[i].Email_Id + "\")' style='text-decoration:underline;cursor:pointer'>Send Mail</span></td>";
                Content += ' </tr>';
            }

            Content += '</tbody>';
            Content += '</table>';
        } else {
            Content = '<div class="col-xs-12"><p style="text-align:center;font-weight:bold;margin:15px 0px;">No Data Found</p></div>';
        }
        $('#Sign_' + index).html(Content);
    },
    fngetmailDataFailure: function () {

    },

    fnMailTrigger: function (PendingWith, Emailid, Employee_Name) {
        debugger;
        //var MailBody = mailContent

        var userList = $.grep(URMdata.list, function (v) {
            return v.Pending_With == PendingWith;
        });

        var obj = {
            Email_Id: userList[0].Email_Id,
            Subject: " Pending STOS Mail",
            lstdata: userList,
          //userName: STOS.defaults.RequestUserName,
        }

        STOSServices.getEmailtrigger(STOS.defaults.CompanyCode, STOS.defaults.RequestUserName, obj, STOS.getmailDataSucess, STOS.fngetmailDataFailure);
    },
    getmailDataSucess: function (data) {
        debugger;
        fnMsgAlert("Success", "Successfully Sent Email ", "STOS Email Send Successfully");
        return true;


    },
    fngetmailDataFailure: function (data) {
        //if (data.list.length == 0) {

        fnMsgAlert("Info", " Failed to send Email ", " Failed to send Email. ");
        return true;
        //}
    },
}