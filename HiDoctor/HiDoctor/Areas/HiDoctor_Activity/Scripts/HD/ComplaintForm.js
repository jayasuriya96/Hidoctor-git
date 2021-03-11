var Sel_Region_Code = '';
var selected = [];
//function fnRegionTreeActivate(node) {
//    debugger;
//    //fnGetCustomerCountControl(1);
//    $('#hdnRegionCode').val(node.data.title);
//    Sel_Region_Code = node.data.key;
//    //fnGetRegionTreeByRegionWithCheckBoxMC(node.data.key,"treebody","");
//    //fnGetAllRegionUsers(node.data.key);
//    //fnCancelMarketingCampaignDefiner();
//    //fnLoadMarketingCampaignDefiner();
//    //fnGetMarketingCampaignDetails();
//    //fnGetActivities();
//    //$('#dataDiv').show();
//    fnCloseTree();
//}

function fnopencomp(flag) {
    debugger;
    $("#open").show();
    $("#close").hide();
    $("#resolve").show();
    document.getElementById('closeradio').checked = false;
    if (Sel_Region_Code == "") {
        Method_params = ["CustomerApi/Customer/GetOpenclosecomplaints", Company_Code, Region_Code, flag]
        CoreREST.get(null, Method_params, null, GetOpenSuccessData, GetOpenFailureData);
    }
    else {
        Method_params = ["CustomerApi/Customer/GetOpenclosecomplaints", Company_Code, Sel_Region_Code, flag]
        CoreREST.get(null, Method_params, null, GetOpenSuccessData, GetOpenFailureData);
    }

}
function GetOpenSuccessData(response) {
    debugger;
    var content = '';

    for (var i = 0; i < response.list.length; i++) {
        if (response.list[i].Complaint_Status == 1) {
            content += '<tr class="tabledata">';
            content += '<td><input type="checkbox" name="chkbxopn" value="' + i + '"></td>'
            content += '<td><label id="complaint' + i + '" style="font-weight: 400;text-transform:capitalize;min-width:97px;">' + response.list[i].Complaint_Id + '</label></td>'
            content += '<td><label id="raisedby' + i + '" style="font-weight: 400;text-transform:capitalize;min-width:97px;">' + response.list[i].User_Name + '</label></td>'
            content += '<td><label id="Compdate' + i + '" style="font-weight: 400;text-transform:capitalize;min-width:157;">' + response.list[i].Complaint_Date + '</label></td>'
            content += '<td><label id="regionname' + i + '" style="font-weight: 400;text-transform:capitalize;min-width:157px;">' + response.list[i].Region_Name + '</label></td>'
            content += '<td><label id="customer' + i + '" style="font-weight: 400;text-transform:capitalize;min-width:166px;">' + response.list[i].Customer_Name + '</label></td>'
            content += '<td><label id="customerentity' + i + '" style="font-weight: 400;text-transform:capitalize;min-width:118px;">' + response.list[i].Customer_Entity_Type + '</label></td>'
            content += '<td><label id="customerreg' + i + '"style="font-weight:400;text-transform:capitalize;min-width:167px;">' + response.list[i].Customer_Region_Name + '</label></td>'
            content += '<td><label id="problem' + i + '" style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Problem_Short_Description + '</label></td>'
            content += '<td><label id="problem' + i + '" style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Problem_Description + '</label></td>'
            content += '<td><textarea id="open' + i + '" maxlength:"500" style="resize:none;"></textarea></td>'
            content += '</tr>'
        }
    }
    $("#opentab").html(content);
}
function GetOpenFailureData() {

}
function fnclosecomp(flag) {
    debugger;
    $("#open").hide();
    $("#close").show();
    $("#resolve").hide();
    document.getElementById('openradio').checked = false;
    if (Sel_Region_Code == "") {
        Method_params = ["CustomerApi/Customer/GetOpenclosecomplaints", Company_Code, Region_Code, flag]
        CoreREST.get(null, Method_params, null, GetCloseSuccessData, GetCloseFailureData);
    }
    else {
        Method_params = ["CustomerApi/Customer/GetOpenclosecomplaints", Company_Code, Sel_Region_Code, flag]
        CoreREST.get(null, Method_params, null, GetCloseSuccessData, GetCloseFailureData);
    }

}
function GetCloseSuccessData(response) {
    debugger;
    debugger;
    var content = '';
    for (var i = 0; i < response.list.length; i++) {
        if (response.list[i].Complaint_Status == 0)
            content += '<tr>';
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Complaint_Id + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].User_Name + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Complaint_Date + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Region_Name + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Customer_Name + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Customer_Entity_Type + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;"> ' + response.list[i].Customer_Region_Name + ' </td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Problem_Short_Description + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Problem_Description + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Resolution_By + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Resolution_Date + '</td>'
        content += '<td style="font-weight: 400;text-transform:capitalize;">' + response.list[i].Resolution_Remarks + '</td>'

        content += '</tr>'
    }
    $("#closetab").html(content);
}
function GetCloseFailureData() {

}
function fnsave() {
    debugger;
    $("input:checkbox[name=chkbxopn]:checked").each(function () {
        var CheckVal = $(this).val();
        selected.push(CheckVal);
    });
    if (Sel_Region_Code == "") {
        Method_params = ["CustomerApi/Customer/GetOpenclosecomplaints", Company_Code, Region_Code, 1]
        CoreREST.get(null, Method_params, null, GetOpenCompSuccessData, GetOpenCompFailureData);
    }
    else {
        Method_params = ["CustomerApi/Customer/GetOpenclosecomplaints", Company_Code, Sel_Region_Code, 1]
        CoreREST.get(null, Method_params, null, GetOpenCompSuccessData, GetOpenCompFailureData);
    }


}
function GetOpenCompSuccessData(resp) {
    debugger;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear();
    var lstSaveComplaints = []
    today = yyyy + "-" + mm + "-" + dd;

    for (var j = 0; j < selected.length; j++) {

        if (Sel_Region_Code == "") {

            var InsertComplaintdetails = {
                Complaint_Id: resp.list[selected[j]].Complaint_Id,
                Company_Code: Company_Code,
                User_Code: resp.list[selected[j]].User_Code,
                Region_Code: Region_Code,
                Customer_Name: resp.list[selected[j]].Customer_Name,
                Complaint_Status: 0,
                Resolution_By: User_Code,
                Resolution_date: today,
                Resolution_Remarks: $("#open" + selected[j] + "").val()
            };
            if (InsertComplaintdetails.Resolution_Remarks == "") {
                alert("Please enter solution");
                return false;
            }
            lstSaveComplaints.push(InsertComplaintdetails);
        }
        else {
            var InsertComplaintdetails = {
                Complaint_Id: resp.list[selected[j]].Complaint_Id,
                Company_Code: Company_Code,
                User_Code: resp.list[selected[j]].User_Code,
                Region_Code: Sel_Region_Code,
                Customer_Name: resp.list[selected[j]].Customer_Name,
                Complaint_Status: 0,
                Resolution_By: User_Code,
                Resolution_date: today,
                Resolution_Remarks: $("#open" + selected[j] + "").val()
            };
            lstSaveComplaints.push(InsertComplaintdetails);
            if (InsertComplaintdetails.Resolution_Remarks == "") {
                alert("Please enter solution");
                return false;
            }
        }

        var obj = {};

    }
    var objSvaCompl = {
        lstInsertComplaintdetails: lstSaveComplaints
    };
    Method_params = ["CustomerApi/PostComplaints", Company_Code];
    CoreREST.post(null, Method_params, objSvaCompl, fnSaveCompaintSuccess, fnSaveComplaintFailure);


    selected = [];

}
function GetOpenCompFailureData() {

}
function fnSaveCompaintSuccess() {
    debugger;
    fnopencomp(1);
}
function fnSaveComplaintFailure() {
    alert("error");
}
