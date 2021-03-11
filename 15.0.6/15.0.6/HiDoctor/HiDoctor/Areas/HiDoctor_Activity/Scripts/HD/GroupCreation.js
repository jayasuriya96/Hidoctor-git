var GroupDetails = "";
var Grpstatus = "";
var Groupname = "";
var GroupNames = "";
var usercode = "";
var GroupId = "";
var flag = "";
var GroupNameArr = new Array();
var Edit = "";
function fnSaveGroupName() {
    Groupname = $("#txtGroupName").val();
    debugger;
    usercode = JSON.stringify(selKeys);
    Groupname = $.trim($("#txtGroupName").val());

    var result = regExforAlphaNumericSpecificRemarks(Groupname);
    if (result == false) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Group Name field');
        $("#txtGroupName").val('');
        return false;
    }
    if ($.trim($("#txtGroupName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Enter the Group Name');
        $('#txtGroupName').val('');
        return false;
    }
    if (Groupname.length > 30) {
        fnMsgAlert("info", "Alert Screen", "Only 30 Characters are allowed!");
        $("#txtGroupName").val('');
        return false;
    }
    if (Groupname.length < 3) {
        fnMsgAlert("info", "Alert Screen", "Please Enter Atleast 3 characters!");
        $("#txtGroupName").val('');
        return false;
    }
    var GroupNamesmatch = 0;
    
        GroupNamesmatch = GroupNameArr.indexOf(Groupname.trim());
        if (GroupNamesmatch != -1) {
           fnMsgAlert('info', 'Info', 'Entered Group Name Already Exists');
           $('#txtGroupName').val('');
        }
    else {
        $.ajax({
            type: "POST",
            url: '../Hidoctor_Activity/NoticeBoard/InsertNewGroup',
            data: "UserCodes=" + usercode + "&GroupName=" + Groupname,
            async: false,
            success: function (resp) {
                if (resp) {
                    fnMsgAlert('info', 'Success', 'Group Created successfully!');
                    $("#txtGroupName").val('');
                    $("span").removeClass("dynatree-selected");
                    selKeys = "";
                    $("#dvusertree").dynatree("getRoot").visit(function (node) {
                        node.select(false);
                    });
                    fnEditGroupDetails();
                }
                else {
                    fnMsgAlert('info', 'Info', 'Try Again Later');
                    selKeys = "";
                }
            },
            error: function (e) {
                fnMsgAlert("error", "NewGroup", e.responseText);
                return false;
            }
        });
    }
        //$("#dvUserTree").html();
        //fnBindUserTreeWithCheckBoxDoubleClick("dvusertree");
}

function fnEditGroupDetails() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/GetGroupNames',
        type: "POST",
        data: "",
        success: function (resp) {
            GroupDetails = resp;
            debugger;
            var Edit = '';
            var tblData = '';
            tblData += "<table id='myTable' class='table table-striped' border=1><thead><tr class='header'><th class='ColorTxt '>S.No</th>";
            tblData += "<th class='ColorTxt'>Group Name</th><th class='ColorTxt'>Members</th><th class='ColorTxt'>Status</th><th class='ColorTxt'>Created By</th><th class='ColorTxt'>Created Date</th><th class='ColorTxt'>Action</th><th class='ColorTxt'>Status</th></tr></thead><tbody>";
            var i = 1;
            for (var l = 0; l < resp.length; l++) {
                debugger;
                Edit = resp[l].Edit;
                GroupNameArr.push(resp[l].Group_Name);
                tblData += "<tr>";
                tblData += "<td>" + i + "</td>";
                tblData += "<td><span>" + resp[l].Group_Name + "</span></td>";
                if (Edit == 1)
                {
                    tblData += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center' Onclick=fnGetGrpMembers(\"" + resp[l].Group_ID + "\",\"" + encodeURIComponent(resp[l].Group_Name) + "\");>View Members</td>";
                }
                else{
                    tblData += "<td style='text-align:center';'>View Members</td>";
                }
                if (resp[l].Status == 1) {
                    tblData += "<td>Active</td>";
                }
                else {
                    tblData += "<td>InActive</td>";
                }
                tblData += "<td>" + resp[l].Created_By + "</td>";
                tblData += "<td>" + resp[l].Created_Date + "</td>";
                if (Edit == 1) {
                    tblData += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center' Onclick='fnEditGroup(" + resp[l].Group_ID + ");'>Edit</td>";
                }
                else {
                    tblData += "<td style='text-align:center';'>Edit</td>"
                }
                if (Edit == 1) {
                    tblData += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center' Onclick='fnChangeGrpStatus(" + resp[l].Group_ID + " ," + resp[l].Status + ");'>Change Status</td>";
                }
                else {
                    tblData += "<td style='text-align:center';'>Change Status</td>"
                }
                tblData += "</tr>";
                i++;
            }
            tblData += "</tbody></table>";
            $("#tblGrpRecords").html(tblData);
        }
    });
}

function fnGetGrpMembers(GroupId, GrpName) {
    debugger;
    $.blockUI({ message: '<h3> Just a moment...</h3>' });
    var GrpName = decodeURIComponent(GrpName);
    var content = '';
    var tbldata = '';
    var UserStatus = '';
    $("#ModalGrpMembers").empty();
    $("#ModalGrpMembersHistory").empty(); 
    $("#spnGroupName").empty();
    selKeys = "";
    $.ajax({
        url: '../HiDoctor_Activity/NoticeBoard/GetGroupmembers',
        type: "POST",
        data: "Group_Id=" + GroupId + "&Group_Name=" + GrpName,
        success: function (resp) {
            debugger;
            content += "<table class=table table-hover border=1><thead><tr><th>S.No</th>";
            content += "<th>User Name</th><th>Employee Name</th><th>Employee Number</th><th>Designation</th>";
            content += "<th>Status</th></tr></thead><tbody>";
            var sno = 0;
            for (var i = 0; i < resp.User_Name.length; i++) {
                sno++;
                UserStatus = resp.User_Name[i].User_Status;
                if (UserStatus == 1) {
                    content += "<tr>";
                    content += "<td>" + sno + "</td>";
                    content += "<td>" + resp.User_Name[i].User_Name + "</td><td>" + resp.User_Name[i].Employee_Name + "</td>";
                    content += "<td>" + resp.User_Name[i].Employee_Number + "</td><td>" + resp.User_Name[i].User_Type_Name + "</td>";
                    content += "<td> Active </td>";
                    content += "</tr>";
                }
                else {
                    content += "<tr class='InactiveUser'>";
                    content += "<td>" + i + "</td>";
                    content += "<td>" + resp.User_Name[i].User_Name + "</td><td>" + resp.User_Name[i].Employee_Name + "</td>";
                    content += "<td>" + resp.User_Name[i].Employee_Number + "</td><td>" + resp.User_Name[i].User_Type_Name + "</td>";
                    content += "<td> InActive </td>";
                    content += "</tr>";
                }
            }
            content += "</tbody></table>";
            if (resp.GROUP_SEQ.length == 0)
            {
                tbldata += "<div style='text-align:center;'><h5>No Records Found</h5></div>";
            }
            else {
                tbldata += "<table class=table table-hover>";
                for (var i = 0; i < resp.GROUP_SEQ.length; i++) {
                    tbldata += "<tbody>";
                    tbldata += "<tr>";
                    tbldata += "<td id='grphistory_" + parseInt(i + 1) + "'><span onclick=fnOpenModel(\"" + GroupId + "\",\"" + encodeURIComponent(resp.GROUP_SEQ[i].GROUP_SEQ) + "\",\"" + encodeURIComponent(GrpName) + "\",\"" + parseInt(i + 1) + "\") id=UpdDate style=color:blue;cursor:pointer;text-decoration:underline;>" + resp.GROUP_SEQ[i].GROUP_SEQ + " - "+ resp.GROUP_SEQ[i].Updated_Date+"</span><div id='seqdv_" + parseInt(i + 1) + "' style='display:none'></div></td>";
                    tbldata += "</tr>";

                }
                tbldata += "</tbody></table>";
            }
            $("#ModalGrpMembers").html(content);
            $("#ModalGrpMembersHistory").html(tbldata);
            $("#spnGroupName").html(GrpName);
            $('#myGrpModal').modal('show');
            $.unblockUI();
        }
    });
}
function fnOpenModel(GroupId, GROUP_SEQ, GrupName, selId) {
    debugger;
    if ($('#seqdv_' + selId + '').is(':visible') == true) {
        $("#seqdv_" + selId + "").hide();
    }
    else {
        var content = '';
        var GrupName = decodeURIComponent(GrupName);
        $.ajax({
            url: '../HiDoctor_Activity/NoticeBoard/GetMembsUpdDateWise',
            type: "POST",
            data: "Group_Id=" + GroupId + "&GROUP_SEQ=" + GROUP_SEQ,
            success: function (resp) {
                debugger;
                //content += "<h4 ><b><span id='spnHisUpdDate'></span></b></h4>";
                content += "<table id='GrpHistry'class=table table-hover border=1><thead><tr><th>S.No</th>";
                content += "<th>User Name</th><th>Employee Name</th><th>Employee Number</th><th>Designation</th>";
                content += "<th>Status</th></tr></thead><tbody>";
                var l = 0;
                for (var i = 0; i < resp.length; i++) {
                    var UsrStatus = resp[i].User_Status;
                    l++;
                    content += "<tr >";
                    content += "<td>" + l + "</td><td>" + resp[i].User_Name + "</td>";
                    content += "<td>" + resp[i].Employee_Name + "</td><td>" + resp[i].Employee_Number + "</td>";
                    content += "<td>" + resp[i].User_Type_Name + "</td>";
                    if (UsrStatus == 1) {
                        content += "<td>Active</td>";
                    }
                    else {
                        content += "<td>InActive</td>";
                    }
                    content += "</tr>";
                    UpdatedDate = resp[i].Updated_Date;
                }
                content += "</tbody></table>";
                $("#seqdv_" + selId + "").html(content);
                $("#spnHisGroupName").html(GrupName);
                $("#spnHisUpdDate").html(UpdatedDate);
                //$('#myHistoryModal').modal('show');
                $("#seqdv_" + selId + "").slideToggle('slow');
            }
        })
    }
}
function fnEditGroup(GroupId) {
    debugger;

    $.blockUI({ message: '<h3> Just a moment...</h3>' });
    $("#dvUserTree").html();
    fnBindUserTreeWithCheckBoxDoubleClick("dvusertree");
    selkeys = "";
    $("span").removeClass("dynatree-selected");
    $("#btnSubmit").hide();
    $("#btnUpdate").show();
    $("#lnkEdit").show();

    $("#liEdit").removeClass("active");
    $(" #liNew").addClass("active");
    $("#New1").css("display", "block");
    $("#Edit2").css("display", "none");

    if (GroupDetails != null || GroupDetails != '') {
        var disJson = jsonPath(GroupDetails, "$.[?(@.Group_ID=='" + GroupId + "')]");
        if (disJson != false) {
            $("#txtGroupName").val(disJson[0].Group_Name);
            $("#GrpID").val(GroupId);
            $("#txtGroupName").attr("disabled", "disabled");
            $.ajax({
                type: "POST",
                url: '../Hidoctor_Activity/NoticeBoard/GetUserCodesForTree',
                data: "Group_Id=" + GroupId,
                async:false,
                success: function (resp) {
                    debugger;
                    entityDetails_g = '';
                        if (resp != '') {
                            entityDetails_g = resp;
                        }
                    CheckedUser();
                }
            })
        }
    }
    $.unblockUI();

}
function fnUpdateGroupDetails() {
    debugger;
    usercode = JSON.stringify(selKeys);
    GroupId = $("#GrpID").val();
    $.ajax({
        type: "POST",
        url: '../Hidoctor_Activity/NoticeBoard/UpdateGroupDetails',
        data: "UserCodes=" + usercode + "&GroupName=" + Groupname + "&Group_Id=" + GroupId,
        success: function (resp) {
            if (resp) {
                fnMsgAlert('info', 'Success', 'Group Updated successfully!');
                $("#txtGroupName").val('');
                $("span").removeClass("dynatree-selected");
                selKeys = "";
                $("#dvusertree").dynatree("getRoot").visit(function (node) {
                    node.select(false);
                });
                $('#txtGroupName').prop('disabled', false);
                $("#btnUpdate").hide();
                $("#btnSubmit").show();
                $("#lnkEdit").hide();
                fnEditGroupDetails();
            }
        }
    })
}
function myFunction() {
    debugger;
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("span")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
function fnChangeGrpStatus(GroupId, status) {
    //UpdateGroupStatus
    var Grpstatus = status;

    if (confirm("Do you want to change the status of this group?")) {

        $("#tabGroup").block();
        debugger;
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/NoticeBoard/UpdateGroupStatus',
            data: "Group_Id=" + GroupId + "&Status=" + Grpstatus,
            success: function (result) {
                debugger;
                if (result == 1) {

                    fnMsgAlert('success', 'Success', 'Group status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Error', 'Failed to change the Group status');
                }
                fnEditGroupDetails();
            },
            error: function () {
                $("#tabGroup").unblock();
            },
            complete: function () {
                $("#tabGroup").unblock();
            }
        });
    }
}

function regExforAlphaNumericSpecificRemarks(value) {
    var specialCharregex = new RegExp(/[!@*&%$^#<>+=~`""|]/g);
    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}
$("#lnkEdit").click(function () {
    $("#liEdit").addClass("active");
    $(" #liNew").removeClass("active");
    $("#New1").css("display", "none");
    $("#Edit2").css("display", "block");
    $("span").removeClass("dynatree-selected");
    $('#txtGroupName').prop('disabled', false);
    $('#txtGroupName').val('');
    $('#lnkEdit').hide();
    $("#btnUpdate").hide();
    $("#btnSubmit").show();
   
});

$("#NewClk").click(function () {
    $("#liEdit").removeClass("active");
    $(" #liNew").addClass("active");
    $("#New1").css("display", "block");
    $("#Edit2").css("display", "none");
});

$("#EditClk").click(function () {
    $("#liEdit").addClass("active");
    $(" #liNew").removeClass("active");
    $("#New1").css("display", "none");
    $("#Edit2").css("display", "block");
});