//NEW//

function fnGetStockiest()
{
    var regionCode = $('#hdnRegionCode').val();
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SecondarySalesNew/GetSSStockiestDetails',
        data: 'regionCode=' + regionCode ,
        success: function (response) {
            fnBindStockiestList(response);
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        },
        complete: function (e) {
            $.unblockUI();
        }
    });
}
function fnBindStockiestList(resp) {
    debugger;
    var content = '';
    //var today = new Date();
    //var dd = today.getDate();
   // var mm = today.getMonth() + 1;
   // var yy = today.getFullYear();
   // var curreDate = yy + '/' + mm + '/' + dd;
    var CDate = new Date(curreDate);
    $('option', $("#ddlStockiest")).remove();
    content += "<option value='0'>-Select-</option>";
    if (resp.length > 0) {
        for (var i = 0; i < resp.length; i++) {
            var Effct_To = resp[i].Effective_To;
            Effct_To = Effct_To.split('/')[2] + '/' + Effct_To.split('/')[1] + '/' + Effct_To.split('/')[0];
            var EffDate = new Date(Effct_To);
            if (resp[i].Ref_Key1 == 0) {
                if (EffDate >= CDate) {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(No Ref Key)-(' + resp[i].Effective_From + '-Active...)' + "</option>";
                } else {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(No Ref Key)-(' + resp[i].Effective_From + '-' + resp[i].Effective_To + ')' + "</option>";
                }
            }
            else {
                if (EffDate >= CDate) {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(' + resp[i].Ref_Key1 + ')-(' + resp[i].Effective_From + '-Active...)' + "</option>";
                } else {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(' + resp[i].Ref_Key1 + ')-(' + resp[i].Effective_From + '-' + resp[i].Effective_To + ')' + "</option>";
                }
            }
        }
        $("#ddlStockiest").html(content);
        $('#tblInputDet').show();
        $("#ddlStockiest").val('0');
        $('#divReportHeader').hide();
        $('#txtarea').hide();
        $('#buttonsTwo').hide();
    }
}