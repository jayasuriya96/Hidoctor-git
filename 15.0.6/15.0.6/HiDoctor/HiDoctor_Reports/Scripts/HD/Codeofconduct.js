function GetAckRecords()
{
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/CodeOfConduct/GetAckRecords/',
        type: "GET",
        data: "A",
        success: function (result) {
            debugger
          
            $('#dvCCGrid').html('');
            var content = '';
            content += "<table class='table'>";
            content += "<thead><tr style='text-align:left;'>";
            content += "<th>S.no</th><th style='padding-left: 45px;'>Acknowledged Date</th>";
            content += "<th style='padding-left:176px;'>File Name</th></tr></thead><tbody>";

            var sno = 0;
            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    sno++;
                    content += "<tr style='text-align:left;'>";
                    content += "<td>" + sno + "</td>";
                    content += "<input type=hidden value=" + result[i].Company_Code + " class='hdncomp_" + sno + "'/>";
                    content += "<td style='padding-left: 60px;'>" + result[i].Acknowledged_Date + "</td>";
                    content += "<td style='padding-left: 221px; cursor: pointer;text-decoration: underline;color: blue;text-align:center' id='show_" + sno + "' Onclick=fnViewCC(\"" + result[i].File_Id + "\",\"" + result[i].File_Name + "\",\"" + result[i].Company_Code + "\",\"" + result[i].Acknowledged_Date + "\");>" + result[i].File_Name + "</td>";
                    content += "</tr>";
                }
            }
            else {
                content += "<td colspan=3 style='text-align:center;'>No Records Found</td>";
            }
            content += "</tbody></table>";
            $("#dvCCGrid").html(content);
        },
        error: function () {
            $.unblockUI();
        }
    });
    $.unblockUI();
}

function fnViewCC(Fileid, Filename, ComCode, ackdate)
{
    $.blockUI();
    //$("#dvCCForm").attr("url", "about:blank");
    $("#dvCCForm").attr("src", "about:blank");
    $('#spndate').html('');
    $('#spndate').html(ackdate);
    $('#ackcontent').show();
    debugger;
    $.ajax({
        url: "Content/CodeofContent/" + ComCode.toLowerCase() + "/" + Filename + "",
        type: 'get',
        error: function () {
            debugger
            $("#dvCCForm").attr("src", "Content/CodeofContent/404-error-page.jpg");
            $('img').attr({ width: '571px', height: '438px' });
            //  return false;
        },
        success: function () {
            $("#dvCCForm").attr("src", "Content/CodeofContent/" + ComCode.toLowerCase() + "/" + Filename + "");
            //$("#CCOverlay").overlay().load();
        }
    });
    $.unblockUI();
}