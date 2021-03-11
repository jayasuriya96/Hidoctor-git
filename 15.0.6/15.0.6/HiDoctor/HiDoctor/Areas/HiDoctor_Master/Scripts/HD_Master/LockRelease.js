var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var regionCode_g = "";
var regionName_g = "";
var globalurl = "";
var SSLock = 'SSNonEntrylock'
var CompanyCode="";
var LockRelease = {
    defaults: {
        
        LogRegionCode: "",
        LoginUserCode: "",
        CompanyCode: "",
        CompanyId: "",
        Month: "",
        Year: "",
        RegionDetails: "",
        lstLockedDetails: "",
        lstRegionDetails:"",
      
        

    },
    initialize: function () {
        debugger;
        globalurl = window.location.origin;
        var SSLock = $('input[name="inputs"]:checked').val();
        if ($('input[name="inputEntity"]:checked').val() == "SSNonEntrylock") {
            $("#REntry").show();
            $("#Entry").show();
            //$('#btnrelease').show();
           
            GetAllRegion();
        }
        $("#Entry").hide();
        
    },
    fnselect: function () {
        if ($('input[name="inputEntity"]:checked').val() == "SSNonEntrylock") {
            var SSLock = 'SSNonEntrylock';
            $("#Entry").show();
            //$('#btnrelease').show();
            GetAllRegion();
        }

    },
    fnlock: function () {
        debugger;
        $('.def').addClass('active');
        $('.sum').removeClass('active');
        $("#Entry").show();
        $("#radiobtn").show()
        //$('#btnrelease').show();
        $('#lockeddata').show();
        $("#Release").hide();
        $("#releaseddata").hide();
        LockRelease.GetLockedDetails();
      
      


    },
    fnReleaseDetails: function () {
        debugger; 
        $("#Release").show();
        LockRelease.GetAllRegionrelease();
        $('.def').removeClass('active');
        $('.sum').addClass('active');
        $("#Entry").hide();
        $("#lockeddata").hide();
        $('#btnrelease').hide();
        $("#radiobtn").hide()
        //$("#Release").show();
        //$("#detailedlist").show();
        $('#Frmdate').val('');
        $('#Todate').val('');
    },
    GetAllRegionrelease :function () {
    debugger;
var url = '../HiDoctor_Master/SSLockRelease/GetAllRegionName'
if (isResponsive.toUpperCase() == "YES") {
    url = globalurl + '/HiDoctor_Master/MissedDoctor/GetAllRegionName';
}
$.ajax(
         {
             type: 'POST',
             url: url,
             data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + LoginRegionCode,
             success: function (response) {
                 debugger;
                 var indexDet = 0;
                 $('#dvtxtRegionName').html('<input type="text" class="" id="RegionName">');
                 if (response != null && response.length > 0) {
                     var lstRegion = [];
                     for (var i = 0; i < response.length; i++) {
                         if (i == 0) {
                             indexDet = 0;
                             var regioncode = response[0].Region_Code;
                             $('#RegionName').val(response[0].Region_Name)
                         }
                         var _obj = {
                             label: response[i].Region_Name,
                             id: response[i].Region_Code,
                             index: i

                         }
                         lstRegion.push(_obj)
                     }
                     LockRelease.defaults.RegionDetails = '';
                     LockRelease.defaults.RegionDetails = lstRegion;

                     var atcObj = new ej.dropdowns.DropDownList({
                         dataSource: lstRegion,
                         fields: { text: 'label', value: 'id' },
                         filterBarPlaceholder: 'Search',
                         showClearButton: true,
                         allowFiltering: true,
                         placeholder: 'Select a Region',
                       
                         index: indexDet,
                       
                         filtering: function (e) {
                             var dropdown_query = new ej.data.Query();
                             dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                             e.updateData(lstRegion, dropdown_query);
                         },

                     });
                     atcObj.appendTo('#RegionName');
                     atcObj.id = LoginRegionCode;
                     regionCode_g = LoginRegionCode;

                 }
             },
             error: function () {

             }
         });

    },
   
    fnstart: function () {
        debugger;
        var RegionName = $('select[name="regionname"]').text();
      
       
        var regName = RegionName
        $('#regName').text('RegionName');
        if ($('select[name="regionname"]').text() == "") {
            fnMsgAlert('info', 'Lock Release', 'Please select the valid Region Name');
            return false;
        }
        LockRelease.GetLockedDetails();
    },
   
    GetLockedDetails: function () {
        debugger;
        var RegionCode = $('select[name="regionname"]').val();
        var url = '../HiDoctor_Master/SSLockRelease/GetAllLockedDetails'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/SSLockRelease/GetAllLockedDetails'
        }
        $('#btnrelease').show();
        $.ajax(
        {
            type: "GET",
            data: "subDomainName=" + subDomainName + '&Region_Code=' + RegionCode ,
            url: url,
            success: function (response) {
                debugger;
                LockRelease.defaults.lstLockedDetails = response;
              
                var lstRegionDetails = LockRelease.defaults.lstRegionDetails;
                debugger;
                    debugger;
                    var content = "";
                    if (response != null && response.length > 0) {
                        content += "<table class='table table-striped'>";
                    content += "<thead>";
                    content += "<tr>";
                    content += "<th><input type='checkbox' id='bulkSScheckDetails' name='chkSSSelectS' onclick='LockRelease.fnSelectAll()'/></th>";
                    content += "<th>Month</th>";
                    content += "<th>Year</th>";
                    content += "<th>Locked Data </th>";
                    content += "<th>View</th>";
                    content += "<th style='width:10px;'>Actual Released By</th>";
                    content += "<th>Remarks</th>";
                    content += "</tr></thead><tbody>";
                    for (var i = 0; i < response.length; i++) {
                        content += "<tr>";
                            content += "<td><input type='checkbox' id='bulkSScheckDetails_" + i + "' name='chkSSSelect' /></td>";
                            content += "<input type='hidden' id='hdlockdetails_" + i + "' value='" + response[i].Region_Code + "|" + response[i].Month + "|" + response[i].Year + "'/></td>";
                            content += "<td>" + response[i].MonthName + "</td>";
                            content += "<td>" + response[i].Year + "</td>";
                            content += "<td>" + response[i].Lock_Date + "</td>";
                          
                            //if (response[i].Stockist_Code != null && response[i].Stockist_Code != "") {
                            content += "<td><span onclick='LockRelease.fnView(\"" + response[i].Region_Code + "\",\"" + response[i].Month + "\",\"" + response[i].Year + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";
                            //}
                            //else {
                            //    content += "<td></td>";
                        //}
                           
                            content += "<td>";
                           
                            content += "<select id='reason_" + i + "'>";
                            content += "<option value=''>Select Actual Released By</option>"
                           
                            for (var r = 0; r < lstRegionDetails.length; r++) {
                                //var Reasonvalue = r + 1;
                                content += '<option value='+ lstRegionDetails[r].Region_Code + '>' + lstRegionDetails[r].Region_Name + '</option>';
                                
                            }
                            content += '</select>';
                            content += "</td>";
                            content += "<td><textarea rows='2' cols='3' maxlength='500' style='width:100%;' id='txtRemarks_" + i + "'/></td>";
                            
                            content += "</tr>";

                    }
                    
                    content += '</tbody></table>';
                    content += '<button type="button" class="btn btn-primary input-sm" id="btnrelease" onclick="LockRelease.fnRelease();">Release</button>'
                       
                    $('#Lockeddetails').html(content)
                    
                    }

              
                    else {
                       
                        $('#Lockeddetails').html('No Records Found');
                        
                      
                }
            },
            error: function () {

            }
        });
    },
    fnSelectAll: function () {
        debugger;
        if ($('#bulkSScheckDetails').is(":checked")) {
            $("input:checkbox[name=chkSSSelect]").attr('checked', 'checked');
        }
        else {
            $("input:checkbox[name=chkSSSelect]").removeAttr('checked');
        }
    },
    fnView: function (Region_Code, Month, Year) {
        debugger;
        LockRelease.ViewSsDetails(Region_Code, Month, Year);
    },
    ViewSsDetails: function (Region_Code, Month, Year) {
        debugger;
        var url = '../../HiDoctor_Master/SSLockRelease/GetStockistDetails'
        var RegionCode = $('select[name="regionname"]').val()

        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/SSLockRelease/GetStockistDetails ';
        }

        $.ajax(
                {
                    async: false,
                    type: 'GET',
                    data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + Region_Code +  '&Year=' + Year+'&Month=' + Month ,
                    async: false,
                    url: url,
                    success: function (response) {
                        debugger;
                        if (response != null && response.length > 0) {
                            var content = "";
                            content += ' <table class="table table-bordered" ><thead><tr><th>Stockist_Name</th><th>Ref Key</th><th>Status</th></tr></thead>';
                            for (var i = 0; i < response.length; i++) {
                                content += '<tr>';
                                content += '<td>' + response[i].Stockist_Name + '</td>';
                                content += '<td>' + response[i].Ref_Key1 + '</td>';
                                content += '<td>' + response[i].Current_status +'</td>';
                                //content += '<td>' + response[i].UpdatedDatetime + '</td>';
                                content += '</tr>';
                            }
                            content += '  </tbody></table>';
                         
                            $('#prefildetailedlist').html(content);
                        }

                        else {
                            $('#list').show();
                            $('#prefildetailedlist').html('No Records Found');
                        }
                        $('#list').show();
                    },
                    error: function () {

                    }
                });
    },
    fnRelease: function () {
        var RegionName = $('select[name="regionname"]').val();
        var SelRegion = RegionName;
        //if ($('input[name="inputEntity"]:checked').val() == "SSNonEntrylock")
        debugger;
        var arr = [];
        $('input[name="chkSSSelect"]:checked').each(function () {
            if (this.checked) {
                debugger;
                var id = this.id;
                var idval = id.split('_')[1];
                var det = $("#hdlockdetails_" + idval).val();
                var obj = {
                    Region_Code: det.split('|')[0],
                    Month: det.split('|')[1],
                    Year: det.split('|')[2],
                    Actual_released_By: $('#reason_' + idval + ' option:selected').val(),
                    Remarks: $('#txtRemarks_' + idval).val()

                }

                arr.push(obj);
            }
        });
        if (arr.length == 0) {
            fnMsgAlert('info', 'Lock Release', 'Please select atleast one Record');
            return false;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Remarks == 0) {
                fnMsgAlert('info', 'Lock Release', 'Please Enter Remarks' );
                return false;
            }
        }
        
       
        var _objData = new Object();
        _objData.User_Code = LoginUserCode;
        _objData.Company_Code =Company_Code;
        _objData.lstLockedDetails = arr;
        _objData.LockType = SSLock;
        _objData.RegionName = SelRegion;
        _objData.subDomainName = subDomainName;
        var url = '../HiDoctor_Master/SSLockRelease/UpdateLockStatus'
        if (isResponsive.toUpperCase() == "YES") {
            url = globalurl + '/HiDoctor_Master/SSLockRelease/UpdateLockStatus';
        }
        $.ajax(
        {
            type: "Post",
            url: url,
            dataType: 'json',
            data: JSON.stringify(_objData),
            contentType: "application/json utf-8",
            success: function (response) {
                if (response >= 1) {
                    fnMsgAlert('success', 'Lock Release', 'Successfully  Released.');
                    LockRelease.GetLockedDetails();
                   
                }

            },

        });
    },
    fnShowDetails:function () {
    debugger;
    var RegionName = $('select[name="RegionName"]').text();
    var RegionCode = $('select[name="RegionName"]').val();
var regName = RegionName
$('#regName').text('RegionName');
if ($('select[name="RegionName"]').text() == "") {
    fnMsgAlert('info', 'Lock Release', 'Please select the valid Region Name');
    return false;

}


var FromDate = $('#Frmdate').val();
var ToDate = $('#Todate').val();

if (FromDate != "" && FromDate != undefined && FromDate != null) {
    FromDate = FromDate.split('-')[2] + '-' + FromDate.split('-')[1] + '-' + FromDate.split('-')[0];
}
if (ToDate != "" && ToDate != undefined && ToDate != null) {
    ToDate = ToDate.split('-')[2] + '-' + ToDate.split('-')[1] + '-' + ToDate.split('-')[0];
}

if ($('#Frmdate').val() != "" && $('#Todate').val() == "") {
    fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  To Date.');
    return false;
}
if ($('#Frmdate').val() == "" && $('#Todate').val() != "") {
    fnMsgAlert('info', 'Dcr Lock Release', 'Please Select  From Date.');
    return false;
}



    if (FromDate > ToDate) {
        fnMsgAlert('info', 'Lock Release', 'To date should be greater than From date');
        return false;
    }

    var url = "../../HiDoctor_Master/SSLockRelease/GetAllReleasedDetails"
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/SSLockRelease/GetAllReleasedDetails';
    }

    $('#releaseddata').show();
    $.ajax(
       {
           type: "GET",
           data: "subDomainName=" + subDomainName + '&Region_Code=' + RegionCode + '&FromDate=' + FromDate + '&ToDate=' + ToDate,
           url: url,
           success: function (response) {
               debugger;
               if (response && response.length > 0) {
                   debugger;

                   $('#detailedlist').html('');
                   var grid = new ej.grids.Grid({
                       dataSource: response,
                       queryCellInfo: queryCellInfo,
                       showColumnChooser: true,
                       allowPaging: true,
                       allowGrouping: true,
                       allowSorting: true,
                       allowFiltering: true,
                       allowResizing: true,
                       allowCellMerging: true,
                       allowScrolling: true,
                       // allowExcelExport: true,
                       pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                       filterSettings: { type: 'CheckBox' },
                       toolbar: ['Search', 'ColumnChooser'],

                       aggregates: [],
                       columns: [
                               
                              { field: 'MonthName', headerText: 'Month', width: 150, textAlign: 'center' },
                               { field: 'Year', headerText: 'Year', width: 150, textAlign: 'center' },
                               { field: 'Remarks', headerText: 'Remarks', width: 150, textAlign: 'center' },
                                { field: 'Released_Date', headerText: 'Released Date', width: 150, textAlign: 'center' },
                               { field: 'Released_By', headerText: 'Released By', width: 150, textAlign: 'center' },
                                { field: 'Actual_Released_By', headerText: 'Actual Released By', width: 150, textAlign: 'center' },
                                { headerText: 'View', template: "<a href=#;>View</a>", width: 150, textAlign: 'center' },
                               
                       ],
                     
                   });
                   grid.appendTo('#detailedlist');

               }
               else {
                
                   $('#detailedlist').html('No Record Found');
               }
           },
           error: function () {

          
               $('#detailedlist').html('No Record Found');
           }
       });


    }

}

function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "View") {
        if (args.cell.innerText == "View") {
            args.data.Status
            args.cell.innerHTML = "<a href='#'onclick=fnviewdata(\"" + args.data.Region_Code + "\",\"" + args.data.Month + "\",\"" + args.data.Year + "\")>View</a>"

        }
        //if (args.data.Stockist_Code == null)
        //    args.cell.innerHTML = "<a></a>";
    }
}
function fnviewdata(Region_Code, Month, Year) {
    debugger;
    LockRelease.ViewSsDetails(Region_Code, Month, Year);
}
//function ViewSsDetailsrelease (Region_Code, Month, Year) {
//    debugger;
//    var url = '../../HiDoctor_Master/SSLockRelease/GetStockistDetailsrelease'
//    var RegionCode = $('select[name="regionname"]').val()

//    if (isResponsive.toUpperCase() == "YES") {
//        url = globalurl + '/HiDoctor_Master/SSLockRelease/GetStockistDetailsrelease ';
//    }

//    $.ajax(
//            {
//                async: false,
//                type: 'GET',
//                data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + Region_Code +  '&Year=' + Year+'&Month=' + Month ,
//                async: false,
//                url: url,
//                success: function (response) {
//                    debugger;
//                    if (response != null && response.length > 0) {
//                        var content = "";
//                        content += ' <table class="table table-bordered" ><thead><tr><th>Stockist_Name</th><th>Ref Key</th><th>Status</th></tr></thead>';
//                        for (var i = 0; i < response.length; i++) {
//                            content += '<tr>';
//                            content += '<td>' + response[i].Stockist_Name + '</td>';
//                            content += '<td>' + response[i].Ref_Key1 + '</td>';
//                            content += '<td>' + response[i].Current_status +'</td>';
//                            //content += '<td>' + response[i].UpdatedDatetime + '</td>';
//                            content += '</tr>';
//                        }
//                        content += '  </tbody></table>';
                         
//                        $('#prefildetailedlist').html(content);
//                    }

//                    else {
//                        $('#list').show();
//                        $('#prefildetailedlist').html('No Records Found');
//                    }
//                    $('#list').show();
//                },
//                error: function () {

//                }
//            });
//}
function GetAllRegion() {
    debugger;
    var url = '../HiDoctor_Master/SSLockRelease/GetAllRegionName'
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/GetAllRegionName';
    }
    $.ajax(
             {
                 type: 'POST',
                 url: url,
                 data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + LoginRegionCode,
                 success: function (response) {
                     debugger;
                   
                     var indexDet = 0;
                     $('#dvtxtregionName').html('<input type="text" class="" id="regionname">');
                     if (response != null && response.length > 0) {
                         var lstRegions = [];
                         for (var i = 0; i < response.length; i++) {
                             if (i == 0) {
                                 indexDet = 0;
                                 var regioncode = response[0].Region_Code;
                                 $('#regionname').val(response[0].Region_Name)
                             }
                             var _obj = {
                                 label: response[i].Region_Name,
                                 id: response[i].Region_Code,
                                 index: i

                             }
                             lstRegions.push(_obj)
                         }
                       
                         LockRelease.defaults.RegionDetails = '';
                         LockRelease.defaults.RegionDetails = lstRegions;

                         var atcObj = new ej.dropdowns.DropDownList({
                             dataSource: lstRegions,
                             fields: { text: 'label', value: 'id' },
                             filterBarPlaceholder: 'Search',
                             showClearButton: true,
                             allowFiltering: true,
                             placeholder: 'Select a Region',
                             index: indexDet,
                             change: fnSelectActualRegion,
                             filtering: function (e) {
                                 var dropdown_query = new ej.data.Query();
                                 dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                                 e.updateData(lstRegions, dropdown_query);
                             },

                         });
                         atcObj.appendTo('#regionname');
                         atcObj.id = LoginRegionCode;
                         regionCode_g = LoginRegionCode;
                         fnRegionsBySelectedRegion();
                     }

                 },
                 error: function () {

                 }
             });

}
function fnSelectActualRegion(args) {
    if (args.isInteracted && args.itemData != null) {
        fnRegionsBySelectedRegion()
    } else {
        return true;
    }
}
function fnRegionsBySelectedRegion () {

    debugger;
    var RegionCode = $('select[name="regionname"]').val();
    var url = '../HiDoctor_Master/SSLockRelease/GetActualRegionName'
    if (isResponsive.toUpperCase() == "YES") {
        url = globalurl + '/HiDoctor_Master/MissedDoctor/GetActualRegionName';
    }
    $.ajax(
             {
                 type: 'POST',
                 url: url,
                 data: "subDomainName=" + subDomainName + "&Company_Code=" + CompanyCode + '&Region_Code=' + RegionCode + '&login_Region=' + LoginUserCode,
                 success: function (response) {
                     debugger;
                     LockRelease.defaults.lstRegionDetails = response;
                     //var indexDet = 0;
                     //$('#dvtxtreportingregionName').html('<input type="text" class="" id="reportingregionname">');
                     //if (response != null && response.length > 0) {
                     //    var lstReportRegion = [];
                     //    for (var i = 0; i < response.length; i++) {
                     //        if (i == 0) {
                     //            indexDet = 0;
                     //            var regioncode = response[0].Region_Code;
                     //            $('#reportingregionname').val(response[0].Region_Name)
                     //        }
                     //        var _obj = {
                     //            label: response[i].Region_Name,
                     //            id: response[i].Region_Code,
                     //            index: i

                     //        }
                     //        lstReportRegion.push(_obj)
                     //    }
                     //    LockRelease.defaults.RegionDetails = '';
                     //    LockRelease.defaults.RegionDetails = lstReportRegion;

                     //    var atcObj = new ej.dropdowns.DropDownList({
                     //        dataSource: lstReportRegion,
                     //        fields: { text: 'label', value: 'id' },
                     //        filterBarPlaceholder: 'Search',
                     //        showClearButton: true,
                     //        allowFiltering: true,
                     //        placeholder: 'Select a Region',
                     //        index: indexDet,
                     //        // change: fnChangeUnderRegionsBySelectedRegion,
                     //        filtering: function (e) {
                     //            var dropdown_query = new ej.data.Query();
                     //            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                     //            e.updateData(lstReportRegion, dropdown_query);
                     //        },

                     //    });
                     //    atcObj.appendTo('#reportingregionname');
                     //    atcObj.id = LoginRegionCode;
                     //    regionCode_g = LoginRegionCode;

                     //}
                 },
                 error: function () {

                 }
             });


   
}