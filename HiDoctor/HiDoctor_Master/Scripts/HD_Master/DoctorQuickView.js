//Created By : Sumathi M
//Date : 31/7/2015

var CUSTOMER = {

    fnInitializeEvents: function () {
        $('#btnGotoDoctorView').unbind('click').bind('click', function () {
            { CUSTOMER.fnGetDoctorDetails(1); }
        });
        $('#btnClearDoctorView').unbind('click').bind('click', function () {
            { CUSTOMER.fnClear(); }
        });
        $('#chkEqual').unbind('click').bind('click', function () {
            { CUSTOMER.fnGetCheckMDlNo(); }
        });
        $('#chkBetween').unbind('click').bind('click', function () {
            { CUSTOMER.fnGetCheckMDlNo(); }
        });
        $('#chkContains').unbind('click').bind('click', function () {
            { CUSTOMER.fnGetCheckMDlNo(); }
        });
        CUSTOMER.fnGetSpeciality();
    },

    fnGetSpeciality: function () {
        $.ajax({
            url: 'DoctorMaster/GetSpeciality/',
            type: 'POST',
            success: function (result) {
                if (result != null && result != '' && result != undefined) {
                    jsonresult = eval('(' + result + ')');
                    if (jsonresult.length > 0) {
                        var selectCoumn = $('#ddlspeciality');
                        $('#ddlspeciality option').remove();
                        selectCoumn.append('<option value="0">-Select Specialty-</option>');
                        for (var s = 0 ; s < jsonresult.length; s++) {
                            selectCoumn.append('<option value=' + jsonresult[s].Speciality_Code + '>' + jsonresult[s].Speciality_Name + '</option>');
                        }
                    }
                }
            }

        });
    },

    fnGetDoctorDetails: function (pageNo, searchName) {
        $('#dvDoctordetails').empty();
        $('#dvDoctorVisitDetails').empty();
        $('#dvProductMappingDetails').empty();
        $('#dvDoctorProductHeader').empty();
        $('#dvdoctorVisitHeader').empty();
        var mdlNo2 = "";
        var result = CUSTOMER.fnValidation();
        var mdlCheck = "";
        if (result) {
            $('#dvDoctorView').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });

            var regionCode = $('#hdnRegionCode').val();
            var speciality = $('#ddlspeciality option:selected').text();
            var doctorName = $('#txtDoctorName').val();
            mdlCheck = $('input:radio[name=chkMDl]:checked').val();
            var mdlNo1 = $('#txtMdlNo1').val();
            if ($('#txtMdlNo2').is('[readonly]')) {
                mdlNo2 = "";
            }
            else {
                mdlNo2 = $('#txtMdlNo2').val();;
            }

            var tblsearchContent = "";
            $.ajax({
                type: 'POST',
                data: "regionCode=" + regionCode + "&specialityName=" + speciality + "&doctorName=" + doctorName + "&mdlNo1=" + mdlNo1 + "&mdlNo2=" + mdlNo2 + "&mdlCheck=" + mdlCheck + "&pageNo=" + pageNo + "&searchName=" + searchName,
                url: 'DoctorMaster/GetDoctorDetailsforQuickView/',
                success: function (response) {
                    if (response != null && response != '') {
                        tblsearchContent = "<input type='text' id='txtsearch' placeholder='Search Doctor Name'/>";
                        tblsearchContent += "&nbsp;&nbsp;&nbsp;<button type='button' id='btnsearch' onclick='CUSTOMER.fnsearch();' value='Search' class='btn btn-primary'>Search</button>";
                        $('#dvSearch').html(tblsearchContent);
                        if (searchName != '') {
                            $('#txtsearch').val(searchName);
                        }
                        $('#dvDoctorViewdetails').html(response);
                        $('#dvDoctorView').unblock();
                    }
                    $('#dvDoctorView').unblock();
                },
                error: function (e) {
                    $('#dvDoctorView').unblock();
                }
            });
        }
    },

    fnClear: function () {
        $('#hdnRegionCode').val('');
        $('#ddlspeciality').val('0');
        $('#txtDoctorName').val('');
        $('input[type=radio][value="B"]').first().attr('checked', 'checked');
        $('#txtMdlNo1').val('');
        if ($('#txtMdlNo2').hasClass('clsDisabletxtBox')) {
            $('#txtMdlNo2').attr('readonly', false);
            $('#txtMdlNo2').removeClass('clsDisabletxtBox');
            $('#txtMdlNo2').val('');
        }
        else {
            $('#txtMdlNo2').val('');
        }
        $('#dvDoctorViewdetails').empty();
        $('#dvDoctordetails').empty();
        $('#dvDoctorVisitDetails').empty();
        $('#dvProductMappingDetails').empty();
        $('#dvDoctorProductHeader').empty();
        $('#dvdoctorVisitHeader').empty();
        $('#dvSearch').empty();
        $('#divRegionName').hide();
        //Replace to the orginal tree
        fnRegionTreePosition("regiontree");
        fnGetRegionTreeByRegion(currentRegionCode_g, "dvRegionTree", "dvFilteredNode");
        $('#dvPreviousNode').click(function () { fnBindRegionWithOneLevelParent(); });
        $('#txtSearchNode').bind("keypress", function (e) {
            if (e.keyCode == 13) {
                fnSearchRegions();
                return false;
            }
        });
    },

    fnGetCheckMDlNo: function () {
        mdlCheck = $('input:radio[name=chkMDl]:checked').val();
        if (mdlCheck.toUpperCase() == 'C' || mdlCheck.toUpperCase() == 'E') {
            $('#txtMdlNo2').attr('readonly', true);
            $('#txtMdlNo2').addClass('clsDisabletxtBox');
        }
        else {
            $('#txtMdlNo2').attr('readonly', false);
            $('#txtMdlNo2').removeClass('clsDisabletxtBox');
        }
    },

    fnValidation: function () {
        var flag = true;
        var errMsg = "";
        var regionCode = $('#hdnRegionCode').val();
        var speciality = $('#ddlspeciality option:selected').val();
        var doctorName = $('#txtDoctorName').val();
        mdlCheck = $('input:radio[name=chkMDl]:checked').val();
        var mdlNo1 = $('#txtMdlNo1').val();
        var mdlNo2 = $('#txtMdlNo2').val();
        //if (regionCode == '' && speciality == '0' && doctorName == '' && mdlNo1 == '' && mdlNo2 == '') {
        //    errMsg = "Please Choose Region Name or. <br/>";
        //    errMsg += "Please Enter Doctor Name or. <br/>";
        //    errMsg += "Please Choose Specialty Name or. <br/>";
        //    errMsg += "Please Enter MDL Number: <br/>";
        //    flag = false;
        //}

        if ($("#txtRegionName").val() == "") {
            //fnMsgAlert('info', screenName, 'Please Choose Region Name.');
            errMsg += "Please Choose Region Name. <br/>";
            //errMsg = "Please Choose Region Name. <br/>";
            flag = false;
            //return;
        }

        if ($('#txtDoctorName').val() != '') {
            if ($.trim($('#txtDoctorName').val()).length > 300) {
                errMsg += "Doctor Name length should not exceed 300 characters. <br/>";
                flag = false;
            }

            var result = CUSTOMER.fnAlphaCheck($('#txtDoctorName'))
            if (!result) {
                errMsg += "Please Enter Valid Doctor Name.";
                flag = false;
            }

        }

        //if ($('#txtSpeciality').val() != '') {
        //    if ($.trim($('#txtSpeciality').val()).length > 30) {
        //        errMsg += "Doctor Lenth Name should not exceed 30 characters. <br/>";
        //        flag = false;
        //    }

        //    var result = CUSTOMER.fnAlphaCheck($('#txtSpeciality'))
        //    if (!result) {
        //        errMsg += "Please Enter Valid Specialty Name.";
        //        flag = false;
        //    }
        //}
        if (mdlNo1 != '' || mdlNo2 != '') {
            if (mdlCheck.toUpperCase() == 'B') {
                if (mdlNo1 == '' || mdlNo2 == '') {
                    errMsg += "Please Enter any one of MDL Num1 or MDL Num2. <br/>";
                    flag = false;
                }

                var result = CUSTOMER.fnCheckNumericMDlNo($('#txtMdlNo1'))
                if (!result) {
                    errMsg += "Please Enter Numeric only in MDL Num1.<br/>";
                    flag = false;
                }
                var result = CUSTOMER.fnCheckNumericMDlNo($('#txtMdlNo2'))
                if (!result) {
                    errMsg += "Please Enter Numeric only in MDL Num2.<br/>";
                    flag = false;
                }
            }




            if ($('#txtMdlNo1').val() != '') {
                if ($.trim($('#txtMdlNo1').val()).length > 30) {
                    errMsg += "MDL Num1 Length should not exceed 30 characters. <br/>";
                    flag = false;
                }

                var result = CUSTOMER.fnAlphaNumericCheck($('#txtMdlNo1'))
                if (!result) {
                    errMsg += "Please Enter Valid MDL Num1.<br/>";
                    flag = false;
                }
            }

            if ($('#txtMdlNo2').val() != '') {
                if ($.trim($('#txtMdlNo2').val()).length > 30) {
                    errMsg += "MDL Num2 Length should not exceed 30 characters. <br/>";
                    flag = false;
                }
                var result = CUSTOMER.fnAlphaNumericCheck($('#txtMdlNo2'))
                if (!result) {
                    errMsg += "Please Enter Valid MDL Num2.<br/>";
                    flag = false;
                }
            }
        }

        if (errMsg.length > 0) {
            fnMsgAlert("info", "Doctor Quick View", errMsg);
            return false;
        }

        return flag;
    },

    fnAlphaNumericCheck: function (id) {
        if ($.trim($(id).val()) != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9()]+$");
            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },
    fnAlphaCheck: function (id) {
        if ($.trim($(id).val()) != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9-. ]+$");
            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },

    fnCheckNumericMDlNo: function (id) {
        if ($.trim($(id).val()) != "") {
            var specialCharregex = new RegExp("^[0-9]+$");
            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },

    fnGetDoctorDetailsbyDoctorCode: function (val) {
        var doctorCode = val.split('-')[0];
        var regionCode = val.split('-')[1];
        if (val != null && val != '' && val != undefined) {
            CUSTOMER.fnGetDoctorDetailsView(doctorCode, regionCode);
            CUSTOMER.fnGetDoctorVisitDetails(doctorCode, regionCode);
            CUSTOMER.fnGetDoctorProductMappingdetails(doctorCode, regionCode);
        }
        $('#leftNav').hide();
        $('#regiontree').hide();
        $('#leftNav').removeClass('col-xs-3');
        $("#divMain").removeClass('col-xs-9');
        $("#divMain").addClass('col-xs-12');
        $('#dvSearch').removeClass('col-xs-5');
        $('#dvSearch').addClass('col-xs-6');
        $("#spnTreeToggle").html('Show Tree');
    },

    fnGetDoctorDetailsView: function (doctorCode, regionCode) {
        $('#dvDoctorView').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            type: 'POST',
            data: 'doctorCode=' + doctorCode + "&regionCode=" + regionCode,
            url: 'DoctorMaster/GetDoctorDetailsbyDoctorCode/',
            success: function (result) {
                if (result != '' && result != null) {
                    $('#dvDoctordetails').focus();
                    $('#dvDoctordetails').html(result);
                    $('#dvDoctorView').unblock();
                    window.location.hash = "#";
                    window.location.hash = "dvDoctordetails";
                }
                $('#dvDoctorView').unblock();
            },
            error: function (e) {
                $('#dvDoctorView').unblock();
            }
        });
    },
    fnGetDoctorVisitDetails: function (doctorCode, regionCode) {
        $('#dvDoctorView').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            type: 'POST',
            data: 'doctorCode=' + doctorCode + "&regionCode=" + regionCode,
            url: 'DoctorMaster/GetDoctorVisitDetails/',
            success: function (result) {
                if (result != '' && result != null) {
                    $('#dvdoctorVisitHeader').html("<div class='clsProductHeader'>Doctor Visit Details (Past 6 months)</div>");
                    $('#dvDoctorVisitDetails').html(result);
                    $('#dvDoctorView').unblock();
                }
                $('#dvDoctorView').unblock();
            },
            error: function (e) {
                $('#dvDoctorView').unblock();
            }
        });
    },
    fnGetDoctorProductMappingdetails: function (doctorCode, regionCode) {
        $('#dvDoctorView').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            type: 'POST',
            data: 'doctorCode=' + doctorCode + "&regionCode=" + regionCode,
            url: 'DoctorMaster/GetDoctorProductMapingDetails/',
            success: function (result) {
                if (result != '' && result != null) {
                    $('#dvDoctorProductHeader').html("<div class='clsProductHeader'>Product Details</div>");
                    $('#dvProductMappingDetails').html(result);
                    $('#dvDoctorView').unblock();
                }
                $('#dvDoctorView').unblock();
            },
            error: function (e) {
                $('#dvDoctorView').unblock();
            }
        });
    },

    fnsearch: function () {
        var searchName = $('#txtsearch').val();
        CUSTOMER.fnGetDoctorDetails(1, searchName);
    },
}

function fnGoToPrevPage() {
    var pno = parseInt($('#pageno').html()) - 1;//Created By : Sumathi M
    //Date : 31/7/2015

    var CUSTOMER = {

        fnInitializeEvents: function () {
            $('#btnGotoDoctorView').unbind('click').bind('click', function () {
                { CUSTOMER.fnGetDoctorDetails(1); }
            });
            $('#btnClearDoctorView').unbind('click').bind('click', function () {
                { CUSTOMER.fnClear(); }
            });
            $('#chkEqual').unbind('click').bind('click', function () {
                { CUSTOMER.fnGetCheckMDlNo(); }
            });
            $('#chkBetween').unbind('click').bind('click', function () {
                { CUSTOMER.fnGetCheckMDlNo(); }
            });
            $('#chkContains').unbind('click').bind('click', function () {
                { CUSTOMER.fnGetCheckMDlNo(); }
            });
            CUSTOMER.fnGetSpeciality();
        },

        fnGetSpeciality: function () {
            $.ajax({
                url: 'DoctorMaster/GetSpeciality/',
                type: 'POST',
                success: function (result) {
                    if (result != null && result != '' && result != undefined) {
                        jsonresult = eval('(' + result + ')');
                        if (jsonresult.length > 0) {
                            var selectCoumn = $('#ddlspeciality');
                            $('#ddlspeciality option').remove();
                            selectCoumn.append('<option value="0">-Select Specialty-</option>');
                            for (var s = 0 ; s < jsonresult.length; s++) {
                                selectCoumn.append('<option value=' + jsonresult[s].Speciality_Code + '>' + jsonresult[s].Speciality_Name + '</option>');
                            }
                        }
                    }
                }

            });
        },

        fnGetDoctorDetails: function (pageNo, searchName) {
            $('#dvDoctordetails').empty();
            $('#dvDoctorVisitDetails').empty();
            $('#dvProductMappingDetails').empty();
            $('#dvDoctorProductHeader').empty();
            $('#dvdoctorVisitHeader').empty();
            var mdlNo2 = "";
            var result = CUSTOMER.fnValidation();
            var mdlCheck = "";
            if (result) {
                $('#dvDoctorView').block({
                    message: '<h3>Loading...</h3>',
                    css: { border: '2px solid #ddd' }
                });

                var regionCode = $('#hdnRegionCode').val();
                var speciality = $('#ddlspeciality option:selected').text();
                var doctorName = $('#txtDoctorName').val();
                mdlCheck = $('input:radio[name=chkMDl]:checked').val();
                var mdlNo1 = $('#txtMdlNo1').val();
                if ($('#txtMdlNo2').is('[readonly]')) {
                    mdlNo2 = "";
                }
                else {
                    mdlNo2 = $('#txtMdlNo2').val();;
                }

                var tblsearchContent = "";
                $.ajax({
                    type: 'POST',
                    data: "regionCode=" + regionCode + "&specialityName=" + speciality + "&doctorName=" + doctorName + "&mdlNo1=" + mdlNo1 + "&mdlNo2=" + mdlNo2 + "&mdlCheck=" + mdlCheck + "&pageNo=" + pageNo + "&searchName=" + searchName,
                    url: 'DoctorMaster/GetDoctorDetailsforQuickView/',
                    success: function (response) {
                        if (response != null && response != '') {
                            tblsearchContent = "<input type='text' id='txtsearch' placeholder='Search Doctor Name'/>";
                            tblsearchContent += "&nbsp;&nbsp;&nbsp;<button type='button' id='btnsearch' onclick='CUSTOMER.fnsearch();' value='Search' class='btn btn-primary'>Search</button>";
                            $('#dvSearch').html(tblsearchContent);
                            if (searchName != '') {
                                $('#txtsearch').val(searchName);
                            }
                            $('#dvDoctorViewdetails').html(response);
                            $('#dvDoctorView').unblock();
                        }
                        $('#dvDoctorView').unblock();
                    },
                    error: function (e) {
                        $('#dvDoctorView').unblock();
                    }
                });
            }
        },

        fnClear: function () {
            $('#hdnRegionCode').val('');
            $('#ddlspeciality').val('0');
            $('#txtDoctorName').val('');
            $('input[type=radio][value="B"]').first().attr('checked', 'checked');
            $('#txtMdlNo1').val('');
            if ($('#txtMdlNo2').hasClass('clsDisabletxtBox')) {
                $('#txtMdlNo2').attr('readonly', false);
                $('#txtMdlNo2').removeClass('clsDisabletxtBox');
                $('#txtMdlNo2').val('');
            }
            else {
                $('#txtMdlNo2').val('');
            }
            $('#dvDoctorViewdetails').empty();
            $('#dvDoctordetails').empty();
            $('#dvDoctorVisitDetails').empty();
            $('#dvProductMappingDetails').empty();
            $('#dvDoctorProductHeader').empty();
            $('#dvdoctorVisitHeader').empty();
            $('#dvSearch').empty();
            $('#divRegionName').hide();
            //Replace to the orginal tree
            fnRegionTreePosition("regiontree");
            fnGetRegionTreeByRegion(currentRegionCode_g, "dvRegionTree", "dvFilteredNode");
            $('#dvPreviousNode').click(function () { fnBindRegionWithOneLevelParent(); });
            $('#txtSearchNode').bind("keypress", function (e) {
                if (e.keyCode == 13) {
                    fnSearchRegions();
                    return false;
                }
            });
        },

        fnGetCheckMDlNo: function () {
            mdlCheck = $('input:radio[name=chkMDl]:checked').val();
            if (mdlCheck.toUpperCase() == 'C' || mdlCheck.toUpperCase() == 'E') {
                $('#txtMdlNo2').attr('readonly', true);
                $('#txtMdlNo2').addClass('clsDisabletxtBox');
            }
            else {
                $('#txtMdlNo2').attr('readonly', false);
                $('#txtMdlNo2').removeClass('clsDisabletxtBox');
            }
        },

        //fnValidation: function () {
        //    var flag = true;
        //    var errMsg = "";
        //    var regionCode = $('#hdnRegionCode').val();
        //    var speciality = $('#ddlspeciality option:selected').val();
        //    var doctorName = $('#txtDoctorName').val();
        //    mdlCheck = $('input:radio[name=chkMDl]:checked').val();
        //    var mdlNo1 = $('#txtMdlNo1').val();
        //    var mdlNo2 = $('#txtMdlNo2').val();
        //    //if (regionCode == '' && speciality == '0' && doctorName == '' && mdlNo1 == '' && mdlNo2 == '') {
        //    //    errMsg = "Please Choose Region Name or. <br/>";
        //    //    errMsg += "Please Enter Doctor Name or. <br/>";
        //    //    errMsg += "Please Choose Specialty Name or. <br/>";
        //    //    errMsg += "Please Enter MDL Number: <br/>";
        //    //    flag = false;
        //    //}

        //    if ($("#txtRegionName").val() == "") {
        //        fnMsgAlert('info', screenName, 'Please Choose Region Name.');
        //        //errMsg += "Please Choose Region Name. <br/>";
        //        //errMsg = "Please Choose Region Name. <br/>";
        //        flag = false;
        //        //return;
        //    }c

        //    if ($('#txtDoctorName').val() != '') {
        //        if ($.trim($('#txtDoctorName').val()).length > 300) {
        //            errMsg += "Doctor Name length should not exceed 300 characters. <br/>";
        //            flag = false;
        //        }

        //        var result = CUSTOMER.fnAlphaCheck($('#txtDoctorName'))
        //        if (!result) {
        //            errMsg += "Please Enter Valid Doctor Name.";
        //            flag = false;
        //        }

        //    }

        //    //if ($('#txtSpeciality').val() != '') {
        //    //    if ($.trim($('#txtSpeciality').val()).length > 30) {
        //    //        errMsg += "Doctor Lenth Name should not exceed 30 characters. <br/>";
        //    //        flag = false;
        //    //    }

        //    //    var result = CUSTOMER.fnAlphaCheck($('#txtSpeciality'))
        //    //    if (!result) {
        //    //        errMsg += "Please Enter Valid Specialty Name.";
        //    //        flag = false;
        //    //    }
        //    //}
        //    if (mdlNo1 != '' || mdlNo2 != '') {
        //        if (mdlCheck.toUpperCase() == 'B') {
        //            if (mdlNo1 == '' || mdlNo2 == '') {
        //                errMsg += "Please Enter any one of MDL Num1 or MDL Num2. <br/>";
        //                flag = false;
        //            }

        //            var result = CUSTOMER.fnCheckNumericMDlNo($('#txtMdlNo1'))
        //            if (!result) {
        //                errMsg += "Please Enter Numeric only in MDL Num1.<br/>";
        //                flag = false;
        //            }
        //            var result = CUSTOMER.fnCheckNumericMDlNo($('#txtMdlNo2'))
        //            if (!result) {
        //                errMsg += "Please Enter Numeric only in MDL Num2.<br/>";
        //                flag = false;
        //            }
        //        }




        //        if ($('#txtMdlNo1').val() != '') {
        //            if ($.trim($('#txtMdlNo1').val()).length > 30) {
        //                errMsg += "MDL Num1 Length should not exceed 30 characters. <br/>";
        //                flag = false;
        //            }

        //            var result = CUSTOMER.fnAlphaNumericCheck($('#txtMdlNo1'))
        //            if (!result) {
        //                errMsg += "Please Enter Valid MDL Num1.<br/>";
        //                flag = false;
        //            }
        //        }

        //        if ($('#txtMdlNo2').val() != '') {
        //            if ($.trim($('#txtMdlNo2').val()).length > 30) {
        //                errMsg += "MDL Num2 Length should not exceed 30 characters. <br/>";
        //                flag = false;
        //            }
        //            var result = CUSTOMER.fnAlphaNumericCheck($('#txtMdlNo2'))
        //            if (!result) {
        //                errMsg += "Please Enter Valid MDL Num2.<br/>";
        //                flag = false;
        //            }
        //        }
        //    }

        //    if (errMsg.length > 0) {
        //        fnMsgAlert("info", "Doctor Quick View", errMsg);
        //        return false;
        //    }

        //    return flag;
        //},

        fnAlphaNumericCheck: function (id) {
            if ($.trim($(id).val()) != "") {
                var specialCharregex = new RegExp("^[a-zA-Z0-9()]+$");
                if (!specialCharregex.test($.trim($(id).val()))) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return true
        },
        fnAlphaCheck: function (id) {
            if ($.trim($(id).val()) != "") {
                var specialCharregex = new RegExp("^[a-zA-Z0-9-. ]+$");
                if (!specialCharregex.test($.trim($(id).val()))) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return true
        },

        fnCheckNumericMDlNo: function (id) {
            if ($.trim($(id).val()) != "") {
                var specialCharregex = new RegExp("^[0-9]+$");
                if (!specialCharregex.test($.trim($(id).val()))) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return true
        },

        fnGetDoctorDetailsbyDoctorCode: function (val) {
            var doctorCode = val.split('-')[0];
            var regionCode = val.split('-')[1];
            if (val != null && val != '' && val != undefined) {
                CUSTOMER.fnGetDoctorDetailsView(doctorCode, regionCode);
                CUSTOMER.fnGetDoctorVisitDetails(doctorCode, regionCode);
                CUSTOMER.fnGetDoctorProductMappingdetails(doctorCode, regionCode);
            }
            $('#leftNav').hide();
            $('#regiontree').hide();
            $('#leftNav').removeClass('col-xs-3');
            $("#divMain").removeClass('col-xs-9');
            $("#divMain").addClass('col-xs-12');
            $('#dvSearch').removeClass('col-xs-5');
            $('#dvSearch').addClass('col-xs-6');
            $("#spnTreeToggle").html('Show Tree');
        },

        fnGetDoctorDetailsView: function (doctorCode, regionCode) {
            $('#dvDoctorView').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                type: 'POST',
                data: 'doctorCode=' + doctorCode + "&regionCode=" + regionCode,
                url: 'DoctorMaster/GetDoctorDetailsbyDoctorCode/',
                success: function (result) {
                    if (result != '' && result != null) {
                        $('#dvDoctordetails').focus();
                        $('#dvDoctordetails').html(result);
                        $('#dvDoctorView').unblock();
                        window.location.hash = "#";
                        window.location.hash = "dvDoctordetails";
                    }
                    $('#dvDoctorView').unblock();
                },
                error: function (e) {
                    $('#dvDoctorView').unblock();
                }
            });
        },
        fnGetDoctorVisitDetails: function (doctorCode, regionCode) {
            $('#dvDoctorView').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                type: 'POST',
                data: 'doctorCode=' + doctorCode + "&regionCode=" + regionCode,
                url: 'DoctorMaster/GetDoctorVisitDetails/',
                success: function (result) {
                    if (result != '' && result != null) {
                        $('#dvdoctorVisitHeader').html("<div class='clsProductHeader'>Doctor Visit Details (Past 6 months)</div>");
                        $('#dvDoctorVisitDetails').html(result);
                        $('#dvDoctorView').unblock();
                    }
                    $('#dvDoctorView').unblock();
                },
                error: function (e) {
                    $('#dvDoctorView').unblock();
                }
            });
        },
        fnGetDoctorProductMappingdetails: function (doctorCode, regionCode) {
            $('#dvDoctorView').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                type: 'POST',
                data: 'doctorCode=' + doctorCode + "&regionCode=" + regionCode,
                url: 'DoctorMaster/GetDoctorProductMapingDetails/',
                success: function (result) {
                    if (result != '' && result != null) {
                        $('#dvDoctorProductHeader').html("<div class='clsProductHeader'>Product Details</div>");
                        $('#dvProductMappingDetails').html(result);
                        $('#dvDoctorView').unblock();
                    }
                    $('#dvDoctorView').unblock();
                },
                error: function (e) {
                    $('#dvDoctorView').unblock();
                }
            });
        },

        fnsearch: function () {
            var searchName = $('#txtsearch').val();
            CUSTOMER.fnGetDoctorDetails(1, searchName);
        },
    }

    function fnGoToPrevPage() {
        var pno = parseInt($('#pageno').html()) - 1;
        var searchName = $('#txtsearch').val();
        CUSTOMER.fnGetDoctorDetails(pno, searchName);
    }
    function fnGoToNextPage() {
        var pno = parseInt($('#pageno').html()) + 1;
        var searchName = $('#txtsearch').val();
        CUSTOMER.fnGetDoctorDetails(pno, searchName);
    }
    function fnGoToPage() {
        var pno = $('#drpPaging :selected').val();
        var searchName = $('#txtsearch').val();
        CUSTOMER.fnGetDoctorDetails(pno, searchName);
    }
    var searchName = $('#txtsearch').val();
    CUSTOMER.fnGetDoctorDetails(pno, searchName);
}
function fnGoToNextPage() {
    var pno = parseInt($('#pageno').html()) + 1;
    var searchName = $('#txtsearch').val();
    CUSTOMER.fnGetDoctorDetails(pno, searchName);
}
function fnGoToPage() {
    var pno = $('#drpPaging :selected').val();
    var searchName = $('#txtsearch').val();
    CUSTOMER.fnGetDoctorDetails(pno, searchName);
}