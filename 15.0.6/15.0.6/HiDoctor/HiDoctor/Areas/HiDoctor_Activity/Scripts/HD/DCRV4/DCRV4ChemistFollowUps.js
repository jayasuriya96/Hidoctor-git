var dcrActualDate_g;
var FollowUps = {
    defaults: {
        "formMode_g": "",
        "gridRowNo_g": "0",
        "dcrDoctorVisit_g": "",
        "FollowUpRowIndex_gl": "0"

    },

    initializing: function () {

        FollowUps.fnAddFollowUps();

    },


    fnDeleteRows: function () {
        FollowUps.defaults.FollowUpRowIndex_gl = 0;
        $('#tbl_Followup_Cv').html('<tr><td class="dcr_product_header_Cv" style=""></td><td style="width: 57%;">Tasks</td><td class="dcr_product_header_Cv" style="text-align:left;padding-left:19px">Due Date</td><td style="width:4px;"></td></tr>');
    },






    //fnAddFollowUp: function (isDraft, curAccObj) {
    fnAddFollowUps: function (isDraft, curAccObj) {


        FollowUps.defaults.FollowUpRowIndex_gl++;
        var tblFollowLength = $('#tbl_Followup_Cv tr').length;
        var newFollowRow = document.getElementById('tbl_Followup_Cv').insertRow(parseInt(tblFollowLength));
        newFollowRow.id = "Cv_Follow_up_Row_" + FollowUps.defaults.FollowUpRowIndex_gl;

        // Product Name.
        var td1 = newFollowRow.insertCell(0);
        // $(td1).html(tblFollowLength + '.');
        $(td1).html('');
        //$(td1).css("display", "none");
        var td2 = newFollowRow.insertCell(1);

        $(td2).css("width", "75%;");
        var htmlvalue = "";
        if (isDraft) {

            htmlvalue = "<input style='width: 100%;' class='followClass' type='text' id='Cv_txt_Follow_taskName_" + FollowUps.defaults.FollowUpRowIndex_gl + "' />";
        }
        else {

            htmlvalue = "<input style='width: 100%;' class='followClass'  type='text' id='Cv_txt_Follow_taskName_" + FollowUps.defaults.FollowUpRowIndex_gl + "' style='width:95%' ";
            htmlvalue += " ondblclick='FollowUps.fnAddFollowUps(null)'  onkeyup='FollowUps.fnAddFollowUps(null,this)'/>";

        }
        $(td2).html(htmlvalue);

        var td3 = newFollowRow.insertCell(2);
        $(td3).css("padding-left", "21px");
        htmlvalue = "<input type='text' id='Cv_txtdueDate_" + FollowUps.defaults.FollowUpRowIndex_gl + "'  class='form-control datepicker'/>";
        $(td3).html(htmlvalue);
        // Remove Icon.
        var td4 = newFollowRow.insertCell(3);
        $(td4).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="FollowUps.fnDeleteFollowUpRow(' + FollowUps.defaults.FollowUpRowIndex_gl + ')" />');
        $(td4).addClass('valign-top');
        $(td4).addClass('deleteRowIcon');
        if (curAccObj != null) {
            curAccObj.onkeyup = null;
            curAccObj.ondblclick = null;
            //FollowUps.fnAddFollowUps();
        }
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy',
            numberOfMonths: 1,
            //showButtonPanel: true
            minDate: new Date(dcrActualDate_g)
        });

    },

    fnDeleteFollowUpRow: function (index) {

        var rowLength = $('#tbl_Followup_Cv tr').length - 1;
        if (index == rowLength) {
            //if ($('#tbl_Followup tr:visible').length == '') {
            fnMsgAlert('info', docFollowUps, 'You are not allowed to delete this row!');
        }
        else {
            if (confirm('Do you wish to delete the Follow-Ups?')) {
                $('#Cv_Follow_up_Row_' + index).css('display', 'none');
            }
        }
    },


    //Follow_up
    fnValidate_Cv: function (isRedirecttoStockiest, rowpos) {
        var fllow_Rows = $('#tbl_Followup_Cv tr').length;
        var Tasks = "";
        var Due_Date = "";

        var fllowJSONArray = new Array();
        for (var i = 1; i < fllow_Rows; i++) {
            if ($('#Cv_Follow_up_Row_' + i).css('display') != 'none')
                if ($('#Cv_txt_Follow_taskName_' + i).val().trim() != '') {
                    if ($('#Cv_txtdueDate_' + i).val().trim() != '') {

                        var Tasks = $('#Cv_txt_Follow_taskName_' + i).val().trim();
                        var fllowArray = {};
                        fllowArray.Tasks = Tasks;
                        fllowArray.Due_Date = $.trim($('#Cv_txtdueDate_' + i).val().split('/')[2]) + "-" + $.trim($('#Cv_txtdueDate_' + i).val().split('/')[1]) + "-" + $.trim($('#Cv_txtdueDate_' + i).val().split('/')[0]);
                        if (!(fnValidateDateFormate(('#Cv_txtdueDate_' + i), 'Due Date'))) {
                            return false;
                        }
                        //date check
                        if (fllowArray.Due_Date < dcrActualDate_g) {
                            fnMsgAlert('info', 'Information', 'Follow-Ups - Due Date (' + $('#Cv_txtdueDate_' + i).val() + ') Should be greater than DCR date');
                            return false;
                        }
                        // remarks special char check.
                        var res = SpecialCharacterGroup("#Cv_txt_Follow_taskName_" + i);
                        if (!res) {
                            fnMsgAlert('info', 'Information', 'Please Enter the following characters only <b>[ ' + allowCharacterinRemarks + ' ]</b> in Follow-Ups - Tasks');
                            return false;
                        }
                        fllowJSONArray.push(fllowArray);

                    }
                    else {
                        fnMsgAlert('info', 'Information', 'Please Enter Follow-Ups Due Date');
                        return false;
                    }
                }
        }
    },

    fnGetCVFollowUpslist: function () {

        var fllow_Rows = $('#tbl_Followup_Cv tr').length;
        var Tasks = "";
        var Due_Date = "";

        var fllowJSONArray = new Array();
        for (var i = 1; i < fllow_Rows; i++) {
            if ($('#Cv_Follow_up_Row_' + i).css('display') != 'none')
                if ($('#Cv_txt_Follow_taskName_' + i).val().trim() != '') {
                    if ($('#Cv_txtdueDate_' + i).val().trim() != '') {

                        var Tasks = $('#Cv_txt_Follow_taskName_' + i).val().trim();
                        var fllowArray = {};
                        fllowArray.Tasks = Tasks;
                        fllowArray.Due_Date = $.trim($('#Cv_txtdueDate_' + i).val().split('/')[2]) + "-" + $.trim($('#Cv_txtdueDate_' + i).val().split('/')[1]) + "-" + $.trim($('#Cv_txtdueDate_' + i).val().split('/')[0]);
                        if (!(fnValidateDateFormate(('#Cv_txtdueDate_' + i), 'Due Date'))) {
                            return false;
                        }
                        //date check
                        if (fllowArray.Due_Date < dcrActualDate_g) {
                            fnMsgAlert('info', 'Information', 'Follow-Ups - Due Date (' + $('#Cv_txtdueDate_' + i).val() + ') Should be greater than DCR date');
                            return false;
                        }
                        // remarks special char check.
                        var res = SpecialCharacterGroup("#Cv_txt_Follow_taskName_" + i);
                        if (!res) {
                            fnMsgAlert('info', 'Information', 'Please Enter the following characters only ' + allowCharacterinRemarks + ' in Follow-Ups - Tasks');
                            return false;
                        }
                        fllowJSONArray.push(fllowArray);

                    }
                    else {
                        fnMsgAlert('info', 'Information', 'Please Enter Follow-Ups Due Date');
                        return false;
                    }
                }
        }
        return fllowJSONArray;
    },

    fnClear: function () {

        FollowUps.fnDeleteRows();
        FollowUps.fnAddFollowUps(null, 'Cv_txt_Follow_taskName_1');
    },

    fnEditFollowups: function (fllowJSONArray) {


        FollowUps.fnDeleteRows();
        //Follow_Up
        var follow_index = 1;
        if (fllowJSONArray != undefined && fllowJSONArray.length > 0) {
            for (var i = 1; i <= fllowJSONArray.length; i++) {
                FollowUps.fnAddFollowUps(null, 'Cv_txt_Follow_taskName_' + follow_index);
                $("#Cv_txt_Follow_taskName_" + i).val(fllowJSONArray[(i - 1)].Tasks);
                // Coverting the date format              
                var Due_Date = new Date(eval(fllowJSONArray[(i - 1)].Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
                //fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                var _day = Due_Date.getDate();
                var _month = Due_Date.getMonth();
                var _year = Due_Date.getFullYear();
                _month = _month + 1;
                if (_month.toString().length == 1)
                    _month = "0" + _month;
                if (_day.toString().length == 1)
                    _day = "0" + _day;
                fllowJSONArray[(i - 1)].Due_Date = (_day + '/' + (_month) + '/' + _year);
                $("#Cv_txtdueDate_" + i).val(fllowJSONArray[(i - 1)].Due_Date);
                follow_index++;
            }

        }
        FollowUps.fnAddFollowUps(null, 'Cv_txt_Follow_taskName_' + follow_index);

    },
}