
var companyCode = "";
var userCode = "";
var uniqueData = "";
var User_Claim_Code = "";
var User_From_Date = "";
var User_To_Date = "";
var ReportUserTypeID = "";
var divId = "";
var ExpenseUser = "";
var EClaim_Code = "";
var Database_Value = "";
var startDate = "";
var endDate = "";
var Report_Type = "Transaction";
var ExpenseClaimRequest = {
    _defaults: {

    },

    PrintReport: function (reportHtml) {
        debugger;
        // var container = document.getElementById(reportDivId);
        //var container = reportDivId;
        var popupWin = window.open('', '_blank', 'width=1020px,height=800px,location=no,left=200px');
        if (!popupWin || popupWin.closed || typeof popupWin.closed == 'undefined') {
            alert("Popup blocker is on. please allow popup for this site.");
            return;
        }
        popupWin.document.open();
        var htmlToPrint = '';
        htmlToPrint += ("<html><title></title>")
        htmlToPrint +=
        '<style type="text/css">' +
        '.table th, .table td, .table tr, .table {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        'border-collapse:collapse;' +
        'font-size:12px;line-height:12px;' +
        '} body{font-family:sans-serif;} .bold{font-weight:bold;} .tableDcr td{ padding:2px; } .tableDcr{ width:auto; word-break: break-word; }</style>';
        htmlToPrint += "</head><body onload='window.print();' >";
        htmlToPrint += reportHtml;
        htmlToPrint += ('</body></html>');
        popupWin.document.write(htmlToPrint)
        popupWin.document.close();
    },
  

    GettingFailed: function (response) {
        $('#dvloading').hide();
        //console.log(response);
        var html = $.parseHTML(response.responseText);
        var filePath = html[9].childNodes[21].nodeValue.split('\\');
        var excepname = html[9].childNodes[7].nodeValue.split(':');
        var obj = new Object();
        obj.ExceptionName = excepname[0].split('.')[1];
        obj.ExceptionMessage = excepname[1];
        obj.ExceptionSource = filePath[filePath.length - 2] + '\/' + filePath[filePath.length - 1] + ",Line No: " + html[9].childNodes[23].nodeValue.trim();
        $.ajax({
            url: '../Home/DoRecordExceptionLog',
            data: obj,
            method: 'POST',
            success: function (response) { debugger; console.log(response); },
            error: function (err) { console.log(err); }
        });
        fnBootBoxAlert();
    },


      ConvertDate: function (dateValue, format) {
        var CDate;
        var arrDate = [];
        if (format == 1) {  //1 : dd-MM-yyyy to MM-dd-yyyy   or mm-dd-yyyy to dd-mm-yyyy
            arrDate = dateValue.split("-");
            CDate = arrDate[1] + '-' + arrDate[0] + '-' + arrDate[2];
        }
        else if (format == 2) {  //2 : MM/dd/yyyy to dd/MM/yyyy
            arrDate = dateValue.split("/");
            CDate = arrDate[1] + '/' + arrDate[0] + '/' + arrDate[2];
        }
        else if (format == 3) // 3 : yyyy-mm-dd to MM-dd-yyyy
        {
            arrDate = dateValue.split("-");
            CDate = arrDate[1] + '-' + arrDate[2] + '-' + arrDate[0];
        }
        else if (format == 4) { // yyyy-mm-dd  to  yyyy/mm/dd
            arrDate = dateValue.split("-");
            CDate = arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2];
        }
        else if (format == 5) { // yyyy/mm/dd  to  yyyy-mm-dd
            arrDate = dateValue.split("/");
            CDate = arrDate[0] + '-' + arrDate[1] + '-' + arrDate[2];
        }
        else if (format == 6) { //yyyy-mm-dd to dd/mm/yyyy
            arrDate = dateValue.split("-");
            CDate = arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0];
        }
        else if (format == 7) { //dd/mm/yyyy to yyyy-mm-dd
            arrDate = dateValue.split("/");
            CDate = arrDate[2] + '-' + arrDate[1] + '-' + arrDate[0];
        }
        else if (format == 8) { // mm-dd-yyyy to dd-mm-yyyy
            arrDate = dateValue.split("-");
            CDate = arrDate[1] + '-' + arrDate[0] + '-' + arrDate[2];
        }
        else if (format == 9) { //dd-mm-yyyy to yyyy-mm-dd
            arrDate = dateValue.split("-");
            CDate = arrDate[2] + '-' + arrDate[1] + '-' + arrDate[0];
        }
        else if (format == 10) { // mm-dd-yyyy to dd-mm-yyyy
            arrDate = dateValue.split("/");
            CDate = arrDate[1] + '-' + arrDate[0] + '-' + arrDate[2];
        }
        return CDate
    },



      AddDay: function (strDate, intNum) {
          sdate = new Date(strDate);
          sdate.setDate(sdate.getDate() + intNum);
          return ("0" + (sdate.getMonth() + 1)).slice(-2) + "-" + ("0" + sdate.getDate()).slice(-2) + "-" + sdate.getFullYear();
      },
    fnSuccessCallBack: function (response) {
        debugger;
        var lstUserDetails = "";
        var hasDoc = true;
        var hasChem = false;
        var hasAcc = true;
        var hasStk = false;
        var showDocPob = false;
        var showChemPob = false;
        var showStkPob = false;

        var sbTbl = "";
        var otherExpensesHeader = "";
        var otherExpensesBody = "";
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var dcrStatusForReport = 'Applied';
        var colSpanCount = 4; // total expense column and Remarks

        var datesplit = $('#spnDcrDate').text();      

        startDate = datesplit.split(' to ')[0];
        endDate = datesplit.split(' to ')[1];
        var Includes = "Doctor , Accompanist";
        if (response.lstUserDetails != null && response.lstUserDetails.length > 0) {
            lstUserDetails = response.lstUserDetails[0];

            //var staus = $.grep(uniqueData, function (v) {
            //    return v.Claim_Code == User_Claim_Code;
            //});
          

            var sbTbl = "";
            sbTbl += ("<table class='table table-bordered' style='border-size:1px;border-collapsed:collapse;width:100%;'>")

            sbTbl += ("<tr style='height:50px;'>")
            sbTbl += ("<td align='left' colspan='2' style='vertical-align:middle;'><span style='font-weight:bold; font-size:18px;'>Expense Claim Report </span> </td>");
            sbTbl += ("<td> </td>");
            sbTbl += ("</tr>")

            sbTbl += ("<tr>")
            sbTbl += ("<td align='left'><span class='bold'>User Name : </span>" + lstUserDetails.User_Name + "</td>");
            sbTbl += ("<td align='left'><span class='bold'>Employee Name : </span>" + lstUserDetails.Employee_Name + "</td>");
            sbTbl += ("<td align='left'><span class='bold'>Employee Number : </span>" + lstUserDetails.Employee_Number + "</td>");
            sbTbl += ("</tr>")

            sbTbl += ("<tr>")
            sbTbl += ("<td align='left'><span class='bold'>Designation : </span>" + lstUserDetails.User_Type_Name + "</td>");
            sbTbl += ("<td align='left'><span class='bold'>Region Name : </span>" + lstUserDetails.Region_Name + "</td>");
            sbTbl += ("<td align='left'><span class='bold'>Division : </span>" + lstUserDetails.Division_Name + "</td>");
            sbTbl += ("</tr>")

            sbTbl += ("<tr>")
            sbTbl += ("<td align='left'><span class='bold'>Date Of Joining : </span>" + lstUserDetails.Date_of_Joining + "</td>");
            sbTbl += ("<td align='left'><span class='bold'>Manager Name : </span>" + lstUserDetails.Manager_Emp_Name + "(" + lstUserDetails.Manager_Name + ")</td>");
            sbTbl += ("<td align='left'><span class='bold'>Manager Region Name : </span>" + lstUserDetails.Manager_Region_Name + "</td>");
            sbTbl += ("</tr>")

            sbTbl += ("<tr>")
        
            sbTbl += ("<td align='left'><span class='bold'>Period : </span>" + startDate + " - " + endDate + "</td>");
            sbTbl += ("<td align='left'><span class='bold'>Includes : </span> " + Includes + " </td>");
            sbTbl += ("<td align='left'><span class='bold'>Status : </span>" + dcrStatusForReport + "</td>");
            sbTbl += ("</tr>")
            sbTbl += '<tr><td align="left"><span class="bold">Other Deduction : </span>0</td></tr>';

            sbTbl += ("<tr style='height:30px;'>")
            sbTbl += ("<td align='left' colspan='3'><span style='font-size:20px;font-weight:bold' id='totExpense'>Total Expense: ###TotalExpense###  </span> </td>");
            sbTbl += ("</tr>");

            sbTbl += ("</table>");
            if (response.lstDCRDetials != null && response.lstDCRDetials.length > 0) {
                sbTbl += "<div>";
                sbTbl += ("<table class='table table-bordered tableDcr' style='margin-top: 10px;text-align:center;'>");
                sbTbl += ("<thead class='thead' >");
                sbTbl += ("<tr>");
                sbTbl += ("<th style='min-width:70px;'>Date</th>");
                sbTbl += ("<th style='min-width: 50px;'>Activity Name</th>");
                sbTbl += ("<th style='min-width: 55px;'>DCR Status</th>");
                sbTbl += ("<th style='min-width: 50px;'>Category</th>");
                sbTbl += ("<th style='min-width: 50px;'>Work Place</th>");
                sbTbl += ("<th style='min-width: 80px;'>From - To, Mode </th>");
                sbTbl += ("<th style='text-align:center;min-width: 50px; '>Distance</th>");              
                    sbTbl += ("<th style='text-align:center;min-width: 50px;'>Doctors Met</th>");           
                
                    sbTbl += ("<th style='text-align:center;min-width: 50px;'>Accompanist Count</th>");
                
                //Bind Dynamic Expense Column.
                var lstOtherExpense = "";
                if (response.lstExpenseDetials != null && response.lstExpenseDetials.length > 0) {
                    var arrOtherExpense = response.lstExpenseDetials.map(a => a.Expense_Type_Name);
                    lstOtherExpense = arrOtherExpense.reduce(function (item, e1) {
                        var matches = item.filter(function (e2)
                        { return e1 == e2 });
                        if (matches.length == 0) {
                            item.push(e1);
                        }
                        return item;
                    }, []);

                    for (var a = 0; a < lstOtherExpense.length; a++) {
                        sbTbl += ("<th style='text-align:center;min-width:50px;'>" + lstOtherExpense[a] + "</th>");
                    }
                }

                sbTbl += ("<th style='text-align:center;min-width:50px;'>Total Expense</th>");
                sbTbl += ("<th style='min-width:150px;'>Remarks</th>");

                sbTbl += ("</tr>");
                sbTbl += ("</thead>");
                sbTbl += ("<tbody>");
                var totDoctorMet = 0;
                var totChemistMet = 0;
                var totDoctorPOB = 0;
                var totChemistPOB = 0;
                var totStockiestMet = 0;
                var totStockiestPOB = 0;
                var totAccompanist = 0;
                var totDistance = 0;
                var totTotalExpense = 0;
                var totTravelAllowance = 0;
                var totDailyAllowance = 0;

                var tempDate = ExpenseClaimRequest.ConvertDate(startDate, 10);
                var tempEndDate = ExpenseClaimRequest.ConvertDate(endDate, 10);
                while (new Date(tempDate) <= new Date(tempEndDate)) {
                    var OtherStatus = true;
                    var AttendanceStatus = true;
                    var totalExpense = 0;
                    var countDistance = 0;
                    var rowObj = $.grep(response.lstDCRDetials, function (v) {
                        return v.DCR_Actual_Date == ExpenseClaimRequest.ConvertDate(tempDate, 8);
                    });
                    if (rowObj != null && rowObj.length > 0) {
                        var rowObjField = $.grep(rowObj, function (v) {
                            return v.Flag == "Field";
                        });
                        var rowObjAttendance = $.grep(rowObj, function (v) {
                            return v.Flag == "Attendance";
                        });
                        var rowObjLeave = $.grep(rowObj, function (v) {
                            return v.Flag == "Leave";
                        });
                        if (rowObjField != null && rowObjField.length > 0) {
                            OtherStatus = false;
                            //AttendanceStatus = false;
                            sbTbl += "<tr>";
                            sbTbl += "<td>" + ExpenseClaimRequest.ConvertDate(tempDate, 8) + "</td>";
                            sbTbl += "<td>" + rowObjField[0].Activity_Type + "</td>";
                            sbTbl += "<td>" + rowObjField[0].DCR_Status + "</td>";
                            sbTbl += "<td>" + rowObjField[0].Category + "</td>";
                            sbTbl += "<td>" + rowObjField[0].WorkPlace + "</td>";
                            var fromToMode = "";
                            for (var i = 0; i < rowObjField.length; i++) {
                                fromToMode += rowObjField[i].FromPlace + "," + rowObjField[i].ToPlace + "," + rowObjField[0].Mode + "</br>";
                                countDistance += parseInt(rowObjField[i].Distance != null ? rowObjField[i].Distance : 0);
                            }
                            sbTbl += "<td>" + fromToMode + "</td>";

                            sbTbl += "<td>" + countDistance + "</td>";
                         
                                sbTbl += "<td>" + rowObjField[0].DoctorCount + "</td>";                         
                         
                            
                                sbTbl += "<td>" + rowObjField[0].AccompanistCount + "</td>";
                            


                            var Remark = "";
                            for (var i = 0; i < lstOtherExpense.length; i++) {
                                var totExpenseTypeAmount = 0;
                                var objExepense = $.grep(response.lstExpenseDetials, function (v) {
                                    return v.Expense_Type_Name == lstOtherExpense[i] && v.DCR_Actual_Date == ExpenseClaimRequest.ConvertDate(tempDate, 8) && v.DCR_Activity_Flag == 'Field';
                                });
                                if (objExepense != null && objExepense.length > 0) {

                                    //for (var l = 0; l < objExepense.length; l++) {
                                    //    totalExpense += objExepense[l].Expense_Amount;
                                    //    totExpenseTypeAmount += objExepense[l].Expense_Amount;
                                    //}
                                    if (objExepense[0].Remarks != '') {
                                        Remark += objExepense[0].Remarks + ",";
                                    }

                                    var exptotamount = 0;
                                    for (var k = 0 ; k < objExepense.length; k++) {
                                        exptotamount = exptotamount + objExepense[k].Expense_Amount;
                                    }


                                    totalExpense += exptotamount;

                                    // sbTbl += "<td>" + objExepense[0].Expense_Type_Name + "</td>";
                                    sbTbl += "<td style='text-align:right;'>" + exptotamount + "</td>";
                                }
                                else {
                                    sbTbl += "<td style='text-align:right;'>-</td>";
                                }
                            }
                            sbTbl += "<td>" + totalExpense + "</td>";
                            sbTbl += "<td>" + Remark + "</td>";
                            totTotalExpense += totalExpense;
                            sbTbl += "</tr>";
                        }
                        if (rowObjAttendance != null && rowObjAttendance.length > 0) {
                            OtherStatus = false;
                            sbTbl += "<tr>";
                            sbTbl += "<td>" + ExpenseClaimRequest.ConvertDate(tempDate, 8) + "</td>";
                            sbTbl += "<td>" + rowObjAttendance[0].Activity_Type + "</td>";
                            sbTbl += "<td>" + rowObjAttendance[0].DCR_Status + "</td>";
                            sbTbl += "<td>" + rowObjAttendance[0].Category + "</td>";
                            sbTbl += "<td>" + rowObjAttendance[0].WorkPlace + "</td>";
                            var fromToMode = "";
                            for (var i = 0; i < rowObjAttendance.length; i++) {
                                fromToMode += rowObjAttendance[i].FromPlace + "," + rowObjAttendance[i].ToPlace + "," + rowObjAttendance[0].Mode + "</br>";

                            }
                            sbTbl += "<td>" + fromToMode + "</td>";
                            countDistance += parseInt(rowObjAttendance[0].Distance != null ? rowObjAttendance[0].Distance : 0);
                            sbTbl += "<td>" + parseInt(rowObjAttendance[0].Distance != null ? rowObjAttendance[0].Distance : 0) + "</td>";
                            if (AttendanceStatus) {
                              
                                    sbTbl += "<td>" + rowObjAttendance[0].DoctorCount + "</td>";
                                
                             
                                    sbTbl += "<td>" + rowObjAttendance[0].AccompanistCount + "</td>";
                      


                                var Remark = "";
                                totalExpense = 0;

                                for (var i = 0; i < lstOtherExpense.length; i++) {
                                    var objExepense = $.grep(response.lstExpenseDetials, function (v) {
                                        return v.Expense_Type_Name == lstOtherExpense[i] && v.DCR_Actual_Date == ExpenseClaimRequest.ConvertDate(tempDate, 8) && v.DCR_Activity_Flag == 'Attendance';
                                    });
                                    if (objExepense != null && objExepense.length > 0) {
                                        if (objExepense[0].Remarks != '') {
                                            Remark += objExepense[0].Remarks + ",";
                                        }
                                        var exptotamount = 0;
                                        for (var k = 0 ; k < objExepense.length; k++) {
                                            exptotamount = exptotamount + objExepense[k].Expense_Amount;
                                        }

                                        totalExpense += exptotamount;
                                        // sbTbl += "<td>" + objExepense[0].Expense_Type_Name + "</td>";
                                        sbTbl += "<td style='text-align:right;'>" + exptotamount.toFixed(2) + "</td>";
                                    }
                                    else {
                                        sbTbl += "<td style='text-align:right;'>-</td>";
                                    }
                                }
                                sbTbl += "<td>" + totalExpense + "</td>";
                                sbTbl += "<td>" + Remark + "</td>";
                                totTotalExpense += totalExpense;
                            }
                            else {


                            
                                    sbTbl += "<td>-</td>";
                    
                               
                               
                                    sbTbl += "<td>-</td>";
                            
                                for (var i = 0; i < lstOtherExpense.length; i++) {
                                    sbTbl += "<td style='text-align:right;'>-</td>";
                                }
                                sbTbl += "<td>-</td>";
                                sbTbl += "<td>-</td>";

                            }
                            sbTbl += "</tr>";
                        }
                        if (rowObjLeave != null && rowObjLeave.length > 0) {
                            OtherStatus = false;
                            sbTbl += "<tr>";
                            sbTbl += "<td>" + ExpenseClaimRequest.ConvertDate(tempDate, 8) + "</td>";
                            sbTbl += "<td>" + rowObjLeave[0].Flag + "</td>";
                            sbTbl += "<td>" + rowObjLeave[0].DCR_Status + "</td>";
                            sbTbl += "<td>-</td>";
                            sbTbl += "<td>-/td>";

                            sbTbl += "<td>-</td>";
                            sbTbl += "<td>-</td>";

                          
                                sbTbl += "<td>-</td>";
                        
                           
                           
                                sbTbl += "<td>-</td>";
                            for (var i = 0; i < lstOtherExpense.length; i++) {
                                sbTbl += "<td style='text-align:right;'>-</td>";
                            }
                            sbTbl += "<td>-</td>";
                            sbTbl += "<td>-</td>";

                            sbTbl += "</tr>";
                        }
                        if (OtherStatus) {
                            sbTbl += "<tr>";
                            sbTbl += "<td>" + ExpenseClaimRequest.ConvertDate(tempDate, 8) + "</td>";
                            sbTbl += "<td>" + rowObj[0].Activity_Type + "</td>";
                            sbTbl += "<td>" + (rowObj[0].DCR_Status != null ? rowObj[0].DCR_Status : "") + "</td>";
                            sbTbl += "<td>" + (rowObj[0].Category != null ? rowObj[0].Category : "") + "</td>";
                            sbTbl += "<td>" + (rowObj[0].WorkPlace != null ? rowObj[0].WorkPlace : "") + "</td>";
                            var fromToMode = "";
                            for (var i = 0; i < rowObj.length; i++) {
                                fromToMode += (rowObj[0].FromPlace != null ? rowObj[0].FromPlace : "") + "," + (rowObj[0].ToPlace != null ? rowObj[0].ToPlace : "") + "," + (rowObj[0].Mode != null ? rowObj[0].Mode : "") + "</br>";
                                countDistance += parseInt(rowObj[0].Distance != null ? rowObj[0].Distance : 0);
                            }
                            sbTbl += "<td>" + (fromToMode == "" ? '-' : fromToMode) + "</td>";

                            sbTbl += "<td>" + countDistance + "</td>";

                      
                                sbTbl += "<td>-</td>";
                 
                      
                                sbTbl += "<td>-</td>";
                      
                            for (var i = 0; i < lstOtherExpense.length; i++) {
                                sbTbl += "<td style='text-align:right;'>-</td>";
                            }
                            sbTbl += "<td>-</td>";
                            sbTbl += "<td>-</td>";

                            sbTbl += "</tr>";
                        }
                    }
                    else {
                        sbTbl += "<tr>";
                        sbTbl += "<td>" + ExpenseClaimRequest.ConvertDate(tempDate, 8) + "</td>";
                        sbTbl += "</tr>";
                    }
                    totDistance += countDistance;
                    totDoctorMet += (rowObjField != null && rowObjField.length > 0 ? rowObjField[0].DoctorCount : 0);
                    totAccompanist += (rowObjField != null && rowObjField.length > 0 ? rowObjField[0].AccompanistCount : 0);
                    // totTotalExpense += totalExpense;  Commented by Manju on 22-08-2019 TS-823
                    tempDate = ExpenseClaimRequest.AddDay(tempDate, 1);
                }
                sbTbl += "<tr style='height:40px;'>";
                sbTbl += "<td colspan='6' style='font-size: 16px;font-weight: 600;' >Total</td>";
                sbTbl += "<td>" + totDistance + "</td>";
           
                    sbTbl += "<td>" + totDoctorMet + "</td>";
               
            
                    sbTbl += "<td>" + totAccompanist + "</td>";
         

                for (var i = 0; i < lstOtherExpense.length; i++) {
                    var tExpense = 0;
                    var objExepense = $.grep(response.lstExpenseDetials, function (v) {
                        return v.Expense_Type_Name == lstOtherExpense[i];
                    });
                    if (objExepense != null && objExepense.length > 0) {

                        for (var l = 0; l < objExepense.length; l++) {
                            tExpense += objExepense[l].Expense_Amount;
                        }
                        sbTbl += "<td>" + parseFloat(tExpense.toFixed(2)) + "</td>";
                    }
                    else {
                        sbTbl += "<td>-</td>";
                    }
                }
                //sbTbl += "<td></td>";
                //sbTbl += "<td></td>";
                //sbTbl += "<td></td>";
                //sbTbl += "<td></td>";
                //sbTbl += "<td>" + totDoctorMet + "</td>";
                //sbTbl += "<td>" + totDoctorMet + "</td>";
                //sbTbl += "<td>" + totDoctorMet + "</td>";
                //sbTbl += "<td>" + totDoctorMet + "</td>";
                var otherExpenseDeduction = 0;
                otherExpenseDeduction = (-(parseFloat(otherExpenseDeduction))) + parseFloat(totTotalExpense);
                sbTbl += "<td>" + otherExpenseDeduction.toFixed(2) + "</td>";
                sbTbl += "<td>-</td>";
                sbTbl += "</tr>";
                sbTbl += "</tbody>";
                sbTbl += "</table>";
                sbTbl += "</div>";

                sbTbl = sbTbl.replace("###TotalExpense###", otherExpenseDeduction.toFixed(2));

              
                    sbTbl += ("<div id='Summary' style='padding:0px; text-align:center;width:100%;margin-top: 5%;'>");
                    sbTbl += ("<table class='table table-bordered' style='font-weight:bold;width:30%;float:left;'>");
                    sbTbl += ("<tr>") + ("<td colspan='2' style='text-align:center;font-size:15px;padding: 15px 10px;'> Activity Summary </td>") + ("</tr>");
                    sbTbl += ("<tr>") + ("<td style='text-align:left'> Distance </td>") + ("<td style='text-align:center'> " + parseFloat(totDistance).toFixed(2) + " </td>") + ("</tr>");
                    if (hasDoc == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Doctor Visit count </td>") + ("<td style='text-align:center'> " + totDoctorMet.toString() + " </td>") + ("</tr>");
                    if (showDocPob == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Doctor POB Amount </td>") + ("<td style='text-align:center'> " + parseFloat(totDoctorPOB).toFixed(2) + " </td>") + ("</tr>");
                    if (hasChem == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Chemist Visit count </td>") + ("<td style='text-align:center'> " + totChemistMet.toString() + " </td>") + ("</tr>");
                    if (showChemPob == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Chemist POB Amount </td>") + ("<td style='text-align:center'> " + parseFloat(totChemistPOB).toFixed(2) + " </td>") + ("</tr>");
                    if (hasStk == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Stockist Visit count </td>") + ("<td style='text-align:center'> " + totStockiestMet.toString() + " </td>") + ("</tr>");
                    if (showStkPob == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Stockist POB Amount </td>") + ("<td style='text-align:center'> " + parseFloat(totStockiestPOB).toFixed(2) + " </td>") + ("</tr>");
                    if (hasAcc == true)
                        sbTbl += ("<tr>") + ("<td style='text-align:left'> Accompanist Count </td>") + ("<td style='text-align:center'> " + totAccompanist.toString() + " </td>") + ("</tr>");

                    sbTbl += ("</table>");
                    sbTbl += ("<table class='table table-bordered' style='font-weight:bold;width:45%; float:right; text-align:left;'>");
                    sbTbl += ("<tr>") + ("<td colspan='2' style='text-align:center;font-size:15px;padding: 15px 10px;'> Expense Summary </td>") + ("</tr>");


                    for (var i = 0; i < lstOtherExpense.length; i++) {
                        var tExpense = 0;
                        var objExepense = $.grep(response.lstExpenseDetials, function (v) {
                            return v.Expense_Type_Name == lstOtherExpense[i];
                        });
                        if (objExepense != null && objExepense.length > 0) {

                            for (var l = 0; l < objExepense.length; l++) {
                                tExpense += objExepense[l].Expense_Amount;
                            }

                            sbTbl += ("<tr>") + ("<td > " + lstOtherExpense[i] + " </td>") + ("<td style='text-align:center'> " + parseFloat(tExpense.toFixed(2)) + " </td>") + ("</tr>");

                        }

                    }
                    sbTbl += ("<tr>") + ("<td> Total Expense </td>") + ("<td  style='text-align:center'> " + otherExpenseDeduction.toFixed(2) + " </td>") + ("</tr>");

                    sbTbl += ("</table>");
                    sbTbl += ("</div> <br/><br/>");
                

                sbTbl += "<div class='col-sm-12' style='margin-top:15%;font-weight: 600;'>";
                sbTbl += "<div class='col-sm-12'>";
                sbTbl += "<div style='width: 50%;float: left;text-align: center;'>";
                sbTbl += "Signature";
                sbTbl += "</div>";
                sbTbl += "<div style='text-align:center;'>";
                sbTbl += "Signature";
                sbTbl += "</div>";
                sbTbl += "</div>";
                sbTbl += "<div class='col-sm-12' style='margin-top: 50px;font-size: 14px;'>";
                sbTbl += "<div style='width: 50%;float: left;text-align: center;>";
                sbTbl += "<span id='UserName'>" + lstUserDetails.User_Name + "</span>";
                sbTbl += "</div>";
                sbTbl += "<div style='text-align:center;'>";
                sbTbl += "<span id='ManagerName'>" + lstUserDetails.Manager_Emp_Name + "</span>";
                sbTbl += "</div>";
                sbTbl += "</div>";

                sbTbl += "</div>";
                debugger;
                ExpenseClaimRequest.PrintReport(sbTbl);
            }
        }
    },

}
