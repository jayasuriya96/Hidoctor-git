var count = 1;
var QuestionID = '';
var AddArray = [];

function GetActiveUserTypes() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/FeedBack/GetActiveUserTypes',
        type: "GET",     
        success: function (jsonData) {
            fnUsertypeDropdown(jsonData);
        },
        error: function (resp) {
            console.log(resp);
        }
    });
}
function fnUsertypeDropdown(jsonData) {
    debugger;
    var content = "";
    content += "<option maxlength='25' style='text-align:left;' value='0'>Please Select User Type</option>";
    if (jsonData != ''&& jsonData.length > 0) {
        jsonData = eval(jsonData);        
        for (var i = 0; i < jsonData.length; i++) {
            content += "<option value='" + jsonData[i].User_Type_Code + "'>" + jsonData[i].User_Type_Name + "</option>";            
        }
    }
    $('#usertype').html(content);
    $('#dvAjaxLoad').hide();
}

function fnSaveQuestion() {
    debugger;
    var Question = [];
    var QSCount = 0;
    var result = fnValidateMapping();
    var usertypeCode = $('#usertype').val();
    if (result == true) {
        $.blockUI();
        $('.RowData:visible').each(function (index, obj) {
            debugger;
            var sRCount = obj.id.replace("tableRow", "");
            var question = $.trim($('#inpttextarea' + sRCount).val());

            if (question != "" || question != undefined || question != null) {
                Question[QSCount] = $.trim($('#inpttextarea' + sRCount).val());
            }
            QSCount++;
        });

        if (Question.length >= 1) {
            var question = JSON.stringify(Question);
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/FeedBack/InsertNewMappingQuestions",
                data: "usertypeCode=" + usertypeCode + "&Questions=" + question,
                async: false,
                success: function (resp) {
                    console.log(resp);
                    $.unblockUI();
                    if (resp == "True") {
                        fnInputHTML();
                        fnGetUserMappedQstns();
                        fnClearInputs();
                        fnMsgAlert('info', 'ICE Competencies Mapping', 'Successfully mapped Competencies.');
                        return false;
                    }
                    else {
                        fnMsgAlert('info', 'ICE Competencies Mapping', 'Failed to map Competencies.Please try after sometime');
                        return false;
                    }

                    //$('#dvaddqstn').show();
                }
            });
        }
    }
}





function fnClearInputs() {   
    //$('#dvInputarea').hide();
    $('.RowData').each(function (index, obj) {
        debugger;
        var sRCount = obj.id.replace("tableRow", "");
        $('#inpttextarea' + sRCount).val(''); 
        if (sRCount > 1) {
            $('#tableRow' + sRCount).remove();
        }
    });
    count = 1;
    $('#tableRow1').show();
    $('#inpttextarea1').show();
    $('#Removerow1').hide();
    $('#add1').show();
}



function fnGetUserMappedQstns() {
    debugger;
    var usertypeCode = $('#usertype').val();
    if (usertypeCode != 0) {

        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/FeedBack/GetICEQuestions",
            data: "usertypeCode=" + usertypeCode,
            success: function (resp) {
                console.log(resp);
                if (resp == 0 || resp == null || resp == '' || resp.length == 0) {
                    $('#ActiveQstns').hide();
                }
                fnBindQuestionsHTML(resp);
                
            },
            error: function (resp) {
                console.log(resp);
            }

        });
    }
    else {
        $('#ActiveQstns').hide();
        $('#dvInputarea').hide();      
        fnMsgAlert('info', 'ICE Questions Mapping', 'Please select user type.');
        return false;
      
    }
}



function fnBindQuestionsHTML(resp) {
    debugger;
    var content = '';
    var sNo = 0;
    if (resp != 0 && resp != null && resp != '' && resp.length > 0) {
        content += '<div style="width:100%;">';
        content += '<table class="table table-hover" style="padding:15px;width:100%">';
        content += '<thead> <tr style="text-align:center;">';
        content += '<th style="width:100px;">S.No</th>';
        content += '<th style="width:70%;">Competencies</th>';
        content +='<th>Action</th>';
        content += '</tr></thead><tbody>';
        for (i = 0; i < resp.length; i++) {
            sNo++;
            content += '<tr>';
            content += '<td style="text-align:center;">' + sNo + '</td>';
            content += '<td id=' + resp[i].Question_Id + ' style="white-space:normal;word-wrap:break-word;word-break:break-all;">' + resp[i].Questions + '</td>';
            content+='<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="fnCnfrmChangeStatus(\'' + resp[i].Question_Id + '\');">Change Status</td>';
            content += '</tr>';
        }
        content += '</tbody></table></div>';
    
    }
    else {
        content = '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Mapped Competencies</b></div></div>';
    }
    $('#qstnstable').html(content);
    $('#ActiveQstns').show();

   
}
function fnCnfrmChangeStatus(QuestionId) {
    debugger;
   
    if (QuestionId != '') {
        $('#mycnfrmtnModal').modal('show');
        QuestionID = QuestionId;
    }
}

function fnChangeStatus(QuestionID) {
    debugger;
    $.blockUI();
    var usertypeCode = $('#usertype').val();   
    $.ajax({
        type: "PUT",
        url: "../HiDoctor_Master/FeedBack/UpdateQuestionStatus",
        data: "usertypeCode=" + usertypeCode + "&questionId=" + QuestionID,
        success: function (resp) {
            debugger;
            console.log(resp);
            $.unblockUI();
            fnGetUserMappedQstns();
            fnInActiveQuestions();
        },
        error: function (resp) {
            console.log(resp)
        }
    });
}


function AddRow(RCount) {
    debugger;
    var arrQuestions = [];
    var QCount = 0;
    var content = '';
    var question = '';
    var tbl_length = $('#dvtxtareainpt tr').length;
    if (tbl_length == 1) {
        $('#Removerow1').show();
    }
    $('.RowData').each(function (index, obj) {
        debugger;
        var sRCount = obj.id.replace("tableRow", "");
        question = $.trim($('#inpttextarea' + sRCount).val());
        if (question == "" || question == undefined || question == null) {
            QCount++;
        }


    });
    if (QCount >= 1) {
        QCount = 0;
        fnMsgAlert('info', 'ICE Competencies Mapping', 'Please enter Competencies.');
        return false;
       
    
    } else if (RCount == 1) {
        debugger;
        AddArray.push(RCount);
        $('#RemoveRow' + RCount).show();
       // $('#RemoveRow' + RCount).show();
        $('#add' + RCount).hide();
        count++;
        content += '<tr id="tableRow' + count + '" class="RowData" style="Width:100%">';
        content += '<td style="width: 90%;"><label id="lblqstn' + count + '">Competencies</label><textarea id="inpttextarea' + count + '" rows="4" style="width:100%; resize:none;" placeholder="Please Enter Competencies Here..."></textarea></td>';
        content += '<td style="width: 5%;" id="RemoveRow' + count + '"><br /><br /><span class="close_btn" id="RemoveRow' + count + '"><i style="font-size:22px; color:red;padding:10px;" id="remove' + count + '" onclick="RemoveRow(' + count + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
        content += '<td style="width: 5%;"><br /><br /><span class="addRow" id="addrow' + count + '"><i title="Add Row" id="add' + count + '"  onclick="AddRow(' + count + ');"style="font-size:22px;padding:10px;" class="fa fa-plus-circle" aria-hidden="true"></i></span></td>';
        content += '</tr>';
    }
    else {
        AddArray.push(RCount);
        $('#RemoveRow' + RCount).show();
        $('#add' + RCount).hide();
        count++;
        content += '<tr id="tableRow' + count + '" class="RowData" style="Width:100%">';
        content += '<td style="width: 90%;"><label id="lblqstn' + count + '">Competencies</label><textarea id="inpttextarea' + count + '" rows="4" style="width:100%; resize:none;" placeholder="Please Enter Competencies Here..."></textarea></td>';
        content += '<td style="width: 5%;" id="RemoveRow' + count + '"><br /><br /><span class="close_btn" id="RemoveRow' + count + '"><i style="font-size:22px; color:red;padding:10px;" id="remove' + count + '" onclick="RemoveRow(' + count + ')" title="Remove Row" class="fa fa-times-circle" aria-hidden="true"></i></span></td>';
        content += '<td style="width: 5%;"><br /><br /><span class="addRow" id="addrow' + count + '"><i title="Add Row" id="add' + count + '"  onclick="AddRow(' + count + ');"style="font-size:22px;padding:10px;" class="fa fa-plus-circle" aria-hidden="true"></i></span></td>';
        content += '</tr>';
    }


    $('#dvtblbody').append(content)

}
function fnValidateMapping() {
    flag = true;
    debugger;
    var QCount=0;
    var result = '';

    $('.RowData:visible').each(function (index, obj) {
        debugger;
        var sRCount = obj.id.replace("tableRow", "");
        var question = $.trim($('#inpttextarea' + sRCount).val());
        if (question == "" || question == undefined || question == null) {
            QCount++;
        }
        else if (question.length > 250) {
            fnMsgAlert('info', 'ICE Competencies Mapping', 'Competence should not be more than 250 characters.');
            flag=false; 
            return;
        }
        else if (question !== '') {
            result = regExforAlphaNumericSpecificQuestions(question);
            if (result == false) {
                fnMsgAlert('info', 'ICE Competencies Mapping', "Only (a-z A-Z 0-9 (){}'/@!?\:;.,-_) special characters are allowed in the Competence.");
                flag = false;
                return;
            }
        }

      
    });
    if (QCount >= "1") {
        QCount=0;
        fnMsgAlert('info', 'ICE Competencies Mapping', 'Please enter the Competencies.');
        flag=false;
        return;
    }
    return flag;
}




function RemoveRow(rcount) {
    debugger;
    var tbl_length = $('#dvtxtareainpt tr').length;
    var value = '';
    var cmax = count;
    var RemoveCount = rcount;
    if (tbl_length == 1) {
        $('.RowData').each(function (index, obj) {
            debugger;
            var sRCount = obj.id.replace("tableRow", "");
            $('#RemoveRow' + sRCount).hide();
            $('#add' + sRCount).show();
        });
    }
    else if (RemoveCount != '') {
        debugger;
        //if (RemoveCount == 1) {
        //    $('#tableRow' + RemoveCount).hide();
        //    $('#inpttextarea' + RemoveCount).val('');
        //    $('#RemoveRow' + RemoveCount).hide();
        //    $('#add' + RemoveCount).show();
        //}
        //else {
            debugger;
            if (RemoveCount <= cmax) {
                $('#tableRow' + RemoveCount).remove();
                RemoveCount--;
                // AddArray.remove(RemoveCount);                
                //var tbl_length_Row = $('#dvtxtareainpt tr:visible').length;
                var arrCount = [];
                $('.RowData:visible').each(function (index, obj) {
                    debugger;
                    var sRCount = obj.id.replace("tableRow", "");
                    arrCount.push(sRCount);
                });
                
                var MAxGetCount = Math.max.apply(Math, arrCount);
                if (arrCount.length == 1) {
                    var GetMinCount = Math.min.apply(Math, arrCount);
                   
                    $('#RemoveRow' + MAxGetCount).hide();
                    $('#RemoveRow' + (MAxGetCount+1)).hide();
                }
              
                $('#add' + MAxGetCount).show();
                arrCount = [];
            }
            else {
                $('#tableRow' + RemoveCount).remove();
                // AddArray.remove(RemoveCount);
                //  value = Math.max(AddArray);
                //  $('#add' + value).show();
            }
          
        //}
    }
}




function fnGetMappedQstns(value) {
    var sRCount = 0;
    debugger;

    if (Values != value) {
        count = 1;
        $('#dvtblbody').remove();
        fnInputHTML();

      
       // $('#tableRow1').show();
       // $('#inpttextarea1').show();
       // $('#Removerow1').hide();
       // $('#add1').show();
       // $('#dvaddqstn').hide();
        fnGetUserMappedQstns();
        fnInActiveQuestions();
        usertypecode = $('#usertype').val();
        var usertypename = $("#usertype :selected").text();
        //$('#mapdata').html(usertypename);
        //$('#mapActdata').html(usertypename);
        //$('#mapinActdata').html(usertypename);
        $('.RowData').each(function (index, obj) {
            debugger;
            var sRCount = obj.id.replace("tableRow", "");
            $('#inpttextarea' + sRCount).val('');
            if (sRCount > 1) {
                $('#tableRow' + sRCount).remove();
            }
        });
        Values = value;
    }
}
function fnInActiveQuestions() {
    debugger;
    var usertypeCode = $('#usertype').val();
    if (usertypeCode != 0) {
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/FeedBack/GetInActiveMappedQuestions",
            data: "usertypeCode=" + usertypeCode,
            success: function (resp) {
                console.log(resp);
                if (resp == 0 || resp == null || resp == '' || resp.length == 0) {
                    $('#InActiveQstns').hide();
                }
                fnBindInActiveQuestionsHTML(resp);
            }
        });
    }
    else {
        $('#InActiveQstns').hide();
        return false;
    }

}
function fnBindInActiveQuestionsHTML(resp) {
    debugger;
    var content = '';
    var sNo = 0;
    if (resp != 0 && resp != null && resp != '' && resp.length > 0) {
        content += '<table class="table table-hover" style="padding:15px;">';
        content += '<thead> <tr style="text-align:center;">';
        content += '<th style="width:100px;">S.No</th>';
        content += '<th style="width:70%;">Competencies</th>';
        content +='<th>Action</th>';
        content += '</tr></thead><tbody>';
        for (i = 0; i < resp.length; i++) {
            sNo++;
            content += '<tr>';
            content += '<td style="text-align:center;">' + sNo + '</td>';
            content += '<td id=' + resp[i].Question_Id + ' style="white-space:normal;word-wrap:break-word;word-break:break-all;">' + resp[i].Questions + '</td>';
            content+='<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="fnCnfrmChangeStatusActive(\'' + resp[i].Question_Id + '\');">Change Status</td>';
            content += '</tr>';
        }
        content += '</tbody></table>';
       
    }
    else {
        content = '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Mapped Competencies</b></div></div>';
    }
    $('#qstnsInActivetable').html(content);
    if (content != '') {
        $('#InActiveQstns').show();
    }
    
}


function fnCnfrmChangeStatusActive(QuestionId) {
    debugger;
    if (QuestionId != '') {
        $('#mycnfrmtnActvModal').modal('show');
        QuestionID = QuestionId;
    }
}



function fnChangeStatusActive(QuestionID) {
    $.blockUI();
    var usertypeCode = $('#usertype').val();
    $.ajax({
        type: "PUT",
        url: "../HiDoctor_Master/FeedBack/UpdateQuestionStatusToActive",
        data: "usertypeCode=" + usertypeCode + "&questionId=" + QuestionID,
        success: function (resp) {
            debugger;
            console.log(resp);
            $.unblockUI();
            fnGetUserMappedQstns();
            fnInActiveQuestions();
        }
    });
}
function fnInputHTML() {
    var content = '';
    content += '<tbody id="dvtblbody" style="width:100%;">';
    content += '<tr id="tableRow1" class="RowData" style="Width:100%">';
    content += '<td style="width: 90%;">';
    content += '<label id="lblqstn1">Competencies</label>';
    content += '<textarea id="inpttextarea1" rows="4" style="width:100%; resize:none;" placeholder="Please Enter Competencies Here..."></textarea>';
    content += '</td>';
    content += '<td id="RemoveRow1" style="display:none;width: 5%;">';
    content += '<br /><br />';
    content += '<span class="close_btn" id="Removerow1">';
    content += '<i style="font-size:22px; color:red;padding:10px;" onclick="RemoveRow(1)" id="remove1" title="Remove Row" class="fa fa-times-circle"></i>';

    content += '</span>';
    content += '</td>';
    content += '<td>';
    content += '<br /><br />';
    content += '<span class="close_btn" id="Add1"sstyle="width: 5%;">';
    content += '<i Onclick="AddRow(1)" title="Add Row" class="fa fa-plus-circle" style="font-size:22px;padding:10px;" id="add1"></i>';
    content += '</span>';
    content += '</td>';
    content += '</tr>';
    content += '</tbody>';
    $('#dvtxtareainpt').html(content);
    $('#dvInputarea').show();

}
function regExforAlphaNumericSpecificQuestions(value) {

   // var specialCharregex = new RegExp("^[a-zA-Z0-9(){}'/@!?\:;.,-_ ]+$");
    //var specialCharregex = new RegExp("^[0-9''@#$%^*+=|]+$");
    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
    
    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}

