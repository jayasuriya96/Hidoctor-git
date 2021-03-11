var MTOReports = {
    defaults: {
        subDomainName: '',
        CompanyId: '',
        UserCode:'',
        RegionCode: '',
        Header: '',
        SalesAndSamples: '',
        CustomerHeader: '',
        CustomerProductInfo: '',
        SelectedUser:'',
        LID: ''
    },
    fnBack: function (Screen)
    {
        debugger
        var Userstatus = fnuserstatus();
        debugger
       
        if (Screen == 'Dates') {
           debugger
           if (navigator.onLine == true) {
               if (Userstatus) {
                   window.location.href = '../MTO/MTOReports?LID=' + LID;
               }
               else {
                   swal("Info!", "Your account has been deactivated.", "info");
               }
            }
            else {
                swal("", "Please connect to the internet.", "");
                return false;
            }
        }
        else if (Screen == 'Details') {
            debugger
            if (navigator.onLine == true) {
                var Userstatus = fnuserstatus();
                debugger
                if (Userstatus) {
                    window.location.href = '../MTO/MTODates?User_Code=' + SelUserCode + '&LID=' + LID + '&UserName=' + UserName;
                }
                else {
                    swal("Info!", "Your account has been deactivated.", "info");
                }
            }
            else {
                swal("", "Please connect to the internet.", "");
                return false;
            }
        }
    },
    GetUserDetails: function () {
        debugger
        if (navigator.onLine == true) {
            MTOReports.defaults.subDomainName = subDomainName;
            MTOReports.defaults.CompanyId = CompanyId;
            MTOReports.defaults.UserCode = LoginUserCode;
            MTOReports.defaults.RegionCode = LoginRegionCode;
            MTOReports.defaults.LID = LID;
            $.ajax({
                type: 'GET',
                data: 'subDomainName=' + MTOReports.defaults.subDomainName + '&UserCode=' + MTOReports.defaults.UserCode,
                url: '../../HiDoctor_Activity/MTO/GetUserDetails',
                success: function (flddata) {
                    var response = flddata.reduce(function (item, e1) {
                        var matches = item.filter(function (e2)
                        { return e1.User_Name == e2.User_Name });
                        if (matches.length == 0) {
                            item.push(e1);
                        }
                        return item;
                    }, []);
                    if (response.length > 0) {
                        var content = '';
                        var str = '';
                        var str1 = '';
                        var res = '';
                        if (response.length == 1) {
                            debugger;
                            MTOReports.GetMTODates(response[0].User_Code, 'SingleUser');
                        }
                        else {
                            for (var i = 0; i < response.length; i++) {
                                str = response[i].Employee_Name;
                                str1 = str.toLowerCase();
                                res = str1.substring(0, 1);
                                content += '<div class="align col-xs-12" style="border-bottom:1px solid #ddd;padding:10px;" onclick="MTOReports.GetMTODates(\'' + response[i].User_Code + '\',\'' + response[i].User_Name + '\')">';
                                content += '<div class="col-xs-2"><span id="Initial">' + res + '</span></div>';
                                content += '<div class="col-xs-10" style="font-size:12px;margin: 0px;">';
                                content += '<input id="Usercode_"' + i + ' type="hidden" value="' + response[i].User_Code + '" />';
                                if (i == 0) {
                                    content += '<p style="font-size: 12px;font-weight: 600;">Mine</p>';
                                } else {
                                    content += '<p style="font-size: 12px;font-weight: 600;">' + response[i].Employee_Name + '</p>';
                                }
                                content += '<p>' + response[i].User_Name + ' | ' + response[i].User_Type_Name + '</p>';
                                content += '<p>' + response[i].Region_Name + '</p>';
                                content += '</div></div>';
                            }
                            $('#userdet').html(content);
                        }
                    }
                    else {

                    }
                }
            })
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
    GetMTODates: function (SelUser,UserName) {
        debugger;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                window.location.href = '../MTO/MTODates?User_Code=' + SelUser + '&LID=' + MTOReports.defaults.LID + '&UserName=' + UserName;
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },

    fnchildcountcheck: function (subDomainName, LoggedUserCode, UserName)
    {
        debugger
        var Userstatus = fnuserstatus();
        debugger
        if (Userstatus) {
            $.ajax({
                type: 'GET',
                data: 'subDomainName=' + subDomainName + '&User_Code=' + LoggedUserCode,
                url: '../../HiDoctor_Activity/MTO/GetChildcount',
                success: function (response) {
                    if (response[0].count == 1) {
                        $('#spnback').hide();
                        $('#dvname').hide();
                    }
                    else {
                        $('#spnback').show();
                        $('#dvname').show();
                    }
                }
            })
            MTOReports.GetUserMTODates(subDomainName, SelUserCode, UserName);
        }
        else {
            swal("Info!", "Your account has been deactivated.", "info");
        }
    },

    GetUserMTODates: function (subDomainName, SelUserCode, UserName) {
        debugger
        $.ajax({
            type:'GET',
            data: 'subDomainName=' + subDomainName + '&UserCode=' + SelUserCode,
            url: '../../HiDoctor_Activity/MTO/GetUserMtoDates',
            success: function (response) {
                debugger
                //var UserName = '';
                if (response.length > 0) {
                    var content = '';
                    for (var i = 0; i < response.length; i++) {
                        //UserName = response[0].User_Name;
                        var date = response[i].MTO_Date;
                        date = date.replace(/ /g, "-");
                        content += '<div class="rcorners col-xs-12" style="background-color: mediumslateblue;color: white;" onclick="MTOReports.GetMTODetails(\'' + response[i].MTO_Id + '\',\'' + SelUserCode + '\',\'' + UserName + '\')">';
                        content += '<div class="col-xs-2"><i class="fa fa-calendar-o" aria-hidden="true"></i></div>';
                        content += '<div class="col-xs-10" style="font-size:12px;margin: 0px;">';
                        if (response[i].Activity == 1)
                        {
                            content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Field</p>';
                        }
                        else if (response[i].Activity == 2) {
                            content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Attendance</p>';
                        }
                        else if (response[i].Activity == 3) {
                            content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Leave</p>';
                        }
                        content += '<input id="MTOid_"' + i + ' type="hidden" value="' + response[i].MTO_Id + '" />';
                        content += '</div></div>';
                    }
                    $('#userMTOdates').html(content);
                    $('#dvUserName').html(UserName);
                    if (UserName == 'SingleUser') {
                        $('#dvname').hide();
                    }
                }
                else {
                    content = '';
                    content += "<div style='text-align: center;'>";
                    content += "<label>No records found</label></div>";
                    $('#userMTOdates').html(content);
                    $('#dvUserName').html(UserName);
                    if (UserName == 'SingleUser') {
                        $('#dvname').hide();
                    }
                }
            }
        })
    },
    GetMTODetails: function (MTO_Id, User_Code, UserName) {
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
            window.location.href = '../MTO/MTODetails?User_Code=' + User_Code + '&MTO_Id=' + MTO_Id + '&UserName=' + UserName + '&LID=' + LID;
            }
       
        else {
            swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
    GetUserMTODetails: function (subDomainName, MTO_Id)
    {
        debugger
        $.ajax({
            type:'GET',
            data: 'subDomainName=' + subDomainName + '&MTO_ID=' + MTO_Id,
            url: '../../HiDoctor_Activity/MTO/GetUserMtoDetails',
            success: function (response) {
                debugger
                console.log(response);
                var StoreDetails=response.Header;
                var Accompanist=response.AccompanistList;
                var Product=response.SalesAndSamples;
                var Customer=response.CustomerHeader;
                var CustomerProducts = response.CustomerProductInfo;
                var Attendance = response.AttendanceDetail;
                var FileDetails = response.FileDetail;
                var UserDetails = '';
                var StrDetails = '';
                var AccDetails = '';
                var ProdDetails = '';
                var SalesProdDetails = '';
                var SampleProdDetails = '';
                var CustDetails = '';
                var CustProdDetails = '';
                var Attendancelst = '';
                var Leavedetails = '';
                var GenRemarks = '';
                if (StoreDetails[0].Activity == 1)
                {
                    if (FileDetails.length > 0) {
                        $('#spnfilename').show();
                        $('#spnfilename').html(FileDetails[0].File_Name);
                        $('#spnfilename').attr('href', FileDetails[0].File_Path);
                        $('#spnfilename').val(FileDetails[0].File_Path);
                    }
                    $('#MTOid').html(StoreDetails[0].MTO_Id);
                    $('#dvField').show();
                    if (StoreDetails.length > 0) {
                        UserDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        UserDetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                        UserDetails += '<p style="font-size: 12px;font-weight: 600;">User Name</p>';
                        UserDetails += '<p style="font-size: 12px;">' + StoreDetails[0].User_Name + '</p></div>';
                        UserDetails += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Date</p>';
                        UserDetails += '<p style="font-size: 12px;">' + StoreDetails[0].MTO_Date + '</p></div></div>';
                        UserDetails += '</div></br>';
                        $('#dvUserDetails').html(UserDetails);

                        StrDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        StrDetails += '<p style="font-size: 12px;font-weight: 600;">Store Name</p>';
                        StrDetails += '<p style="font-size: 12px;">' + StoreDetails[0].Store_Name + '</p>';
                        StrDetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                        StrDetails += '<p style="font-size: 12px;font-weight: 600;">In Time</p>';
                        StrDetails += '<p style="font-size: 12px;">' + StoreDetails[0].In_time + '</p></div>';
                        StrDetails += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Out Time</p>';
                        StrDetails += '<p style="font-size: 12px;">' + StoreDetails[0].Out_time + '</p></div></div>';
                        StrDetails += '</div></br>';
                        $('#StoreDetails').html(StrDetails);
                    }
                    if (Accompanist.length > 0) {
                        for (var i = 0; i < Accompanist.length; i++) {
                            AccDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                            AccDetails += '<p style="font-size: 12px;font-weight: 600;">Accompanist Name</p>';
                            AccDetails += '<p style="font-size: 12px;">' + Accompanist[i].Accompanist_Name + '</p>';
                            AccDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Start Time</p>';
                            AccDetails += '<p style="font-size: 12px;">' + Accompanist[i].Start_Time + '</p></div>';
                            AccDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">End Time</p>';
                            AccDetails += '<p style="font-size: 12px;">' + Accompanist[i].End_Time + '</p></div>';
                            AccDetails += '</div></br>';
                        }
                        $('#spnAccDetails').html(AccDetails);
                    }
                    else {
                        AccDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        AccDetails += '<p style="font-size: 12px;font-weight: 600;">Accompanist Name</p>';
                        AccDetails += '<p style="font-size: 12px;">-</p>';
                        AccDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Start Time</p>';
                        AccDetails += '<p style="font-size: 12px;">-</p></div>';
                        AccDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">End Time</p>';
                        AccDetails += '<p style="font-size: 12px;">-</p></div>';
                        AccDetails += '</div></br>';
                        $('#spnAccDetails').html(AccDetails);
                    }
                    if (Product.length > 0) {
                        debugger;
                        var SaleProd = $.grep(Product, function (v) {
                            return v.Entity == 'Sales';
                        })
                        if (SaleProd.length > 0) {
                            for (var i = 0; i < SaleProd.length; i++) {
                                SalesProdDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                                SalesProdDetails += '<div class="col-xs-12 clearfix" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                                SalesProdDetails += '<p style="font-size: 12px;">' + SaleProd[i].Product_Name + '</p>';
                                SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Opening</p>';
                                SalesProdDetails += '<p style="font-size: 12px;">' + SaleProd[i].Opening + '</p></div>';
                                SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Receipt</p>';
                                SalesProdDetails += '<p style="font-size: 12px;">' + SaleProd[i].Receipt + '</p></div>';
                                SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Sales</p>';
                                SalesProdDetails += '<p style="font-size: 12px;">' + SaleProd[i].Sales + '</p></div>';
                                SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Closing</p>';
                                SalesProdDetails += '<p style="font-size: 12px;">' + SaleProd[i].Closing + '</p></div></div>';
                                SalesProdDetails += '</div></br>';
                            }
                            $('#spnSalesDetails').html(SalesProdDetails);
                        }
                        else {
                            SalesProdDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                            SalesProdDetails += '<div class="col-xs-12 clearfix " style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                            SalesProdDetails += '<p style="font-size: 12px;">-</p>';
                            SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Opening</p>';
                            SalesProdDetails += '<p style="font-size: 12px;">-</p></div>';
                            SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Receipt</p>';
                            SalesProdDetails += '<p style="font-size: 12px;">-</p></div>';
                            SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Sales</p>';
                            SalesProdDetails += '<p style="font-size: 12px;">-</p></div>';
                            SalesProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Closing</p>';
                            SalesProdDetails += '<p style="font-size: 12px;">-</p></div></div></br>';
                            $('#spnSalesDetails').html(SalesProdDetails);
                        }


                        var SampleProd = $.grep(Product, function (v) {
                            return v.Entity == 'Sample';
                        })
                        if (SampleProd.length > 0) {
                            for (var i = 0; i < SampleProd.length; i++) {
                                SampleProdDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                                SampleProdDetails += '<div class="col-xs-12 clearfix" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                                SampleProdDetails += '<p style="font-size: 12px;">' + SampleProd[i].Product_Name + '</p>';
                                SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Opening</p>';
                                SampleProdDetails += '<p style="font-size: 12px;">' + SampleProd[i].Opening + '</p></div>';
                                SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Receipt</p>';
                                SampleProdDetails += '<p style="font-size: 12px;">' + SampleProd[i].Receipt + '</p></div>';
                                SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Sales</p>';
                                SampleProdDetails += '<p style="font-size: 12px;">' + SampleProd[i].Sales + '</p></div>';
                                SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Closing</p>';
                                SampleProdDetails += '<p style="font-size: 12px;">' + SampleProd[i].Closing + '</p></div></div>';
                                SampleProdDetails += '</div></br>';
                            }
                            $('#spnSampleDetails').html(SampleProdDetails);
                        }
                        else {
                            SampleProdDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                            SampleProdDetails += '<div class="col-xs-12 clearfix " style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                            SampleProdDetails += '<p style="font-size: 12px;">-</p>';
                            SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Opening</p>';
                            SampleProdDetails += '<p style="font-size: 12px;">-</p></div>';
                            SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Receipt</p>';
                            SampleProdDetails += '<p style="font-size: 12px;">-</p></div>';
                            SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Sales</p>';
                            SampleProdDetails += '<p style="font-size: 12px;">-</p></div>';
                            SampleProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Closing</p>';
                            SampleProdDetails += '<p style="font-size: 12px;">-</p></div></div></br>';
                            $('#spnSampleDetails').html(SampleProdDetails);
                        }
                    }
                    else {
                        ProdDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        ProdDetails += '<div class="col-xs-12 clearfix " style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                        ProdDetails += '<p style="font-size: 12px;">-</p>';
                        ProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Opening</p>';
                        ProdDetails += '<p style="font-size: 12px;">-</p></div>';
                        ProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Receipt</p>';
                        ProdDetails += '<p style="font-size: 12px;">-</p></div>';
                        ProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Sales</p>';
                        ProdDetails += '<p style="font-size: 12px;">-</p></div>';
                        ProdDetails += '<div class="col-xs-6" style="padding:0px;"><p style="font-size: 12px;font-weight: 600;">Closing</p>';
                        ProdDetails += '<p style="font-size: 12px;">-</p></div></div></br>';
                        $('#spnSalesDetails').html(ProdDetails);
                        $('#spnSampleDetails').html(ProdDetails);
                    }
                    if (Customer.length > 0) {
                        for (var i = 0; i < Customer.length; i++) {
                            CustDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                            CustDetails += '<p style="font-size: 12px;font-weight: 600;">Customer Name</p>';
                            if (Customer[i].Customer_Name != '') {
                                CustDetails += '<p style="font-size: 12px;">' + Customer[i].Customer_Name + '</p>';
                            }
                            else {
                                CustDetails += '<p style="font-size: 12px;">-</p>';
                            }
                            CustDetails += '<p style="font-size: 12px;font-weight: 600;">Mobile Number</p>';
                            if (Customer[i].MobileNumber != '0')
                            {
                                CustDetails += '<p style="font-size: 12px;">' + Customer[i].MobileNumber + '</p>';
                            }
                            else {
                                CustDetails += '<p style="font-size: 12px;">-</p>';
                            }
                            CustDetails += '<p style="font-size: 12px;font-weight: 600;">Remarks</p>';
                            if (Customer[i].Remark != '') {
                                CustDetails += '<p style="font-size: 12px;">' + Customer[i].Remark + '</p>';
                            }
                            else {
                                CustDetails += '<p style="font-size: 12px;">-</p>';
                            }
                            CustDetails += '</div></br>';

                            var Prods = $.grep(CustomerProducts, function (v) {
                                return v.Customer_Id == Customer[i].Customer_Id;
                            })

                            if (Prods.length > 0) {
                                for (var j = 0; j < Prods.length; j++) {
                                    CustDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                                    CustDetails += '<p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                                    CustDetails += '<p style="font-size: 12px;">' + Prods[j].Product_Name + '</p>';
                                    CustDetails += '<p style="font-size: 12px;font-weight: 600;">Quantity</p>';
                                    CustDetails += '<p style="font-size: 12px;">' + Prods[j].Quantity + '</p>';
                                    CustDetails += '<p style="font-size: 12px;font-weight: 600;">Product Type</p>';
                                    CustDetails += '<p style="font-size: 12px;">' + Prods[j].Entity + '</p>';
                                    CustDetails += '</div></br>';
                                }
                            }
                            else {
                                CustDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                                CustDetails += '<p style="font-size: 12px;font-weight: 600;">Product Name</p>';
                                CustDetails += '<p style="font-size: 12px;">-</p>';
                                CustDetails += '<p style="font-size: 12px;font-weight: 600;">Quantity</p>';
                                CustDetails += '<p style="font-size: 12px;">-</p>';
                                CustDetails += '<p style="font-size: 12px;font-weight: 600;">Product Type</p>';
                                CustDetails += '<p style="font-size: 12px;">-</p>';
                                CustDetails += '</div></br>';
                            }
                        }
                        $('#spnCustDetails').html(CustDetails);
                        
                    }
                    else
                    {
                        CustDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        CustDetails += '<p style="font-size: 12px;font-weight: 600;">Customer Name</p>';
                        CustDetails += '<p style="font-size: 12px;">-</p>';
                        CustDetails += '<p style="font-size: 12px;font-weight: 600;">Mobile Number</p>';
                        CustDetails += '<p style="font-size: 12px;">-</p>';
                        CustDetails += '<p style="font-size: 12px;font-weight: 600;">Remarks</p>';
                        CustDetails += '<p style="font-size: 12px;">-</p>';
                        CustDetails += '</div></br>';
                        $('#spnCustDetails').html(CustDetails);
                    }
                    GenRemarks += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                    GenRemarks += '<p style="font-size: 12px;">' + StoreDetails[0].GeneralRemarks + '</p>';
                    GenRemarks += '</div></br>';
                    $('#spnRemarks').html(GenRemarks);
                }
                if (StoreDetails[0].Activity == 2) {
                    $('#dvAttend').show();
                    if (FileDetails.length > 0) {
                        $('#spnAttfilename').show();
                        $('#spnAttfilename').html(FileDetails[0].File_Name);
                        $('#spnAttfilename').attr('href', FileDetails[0].File_Path);
                    }
                    UserDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                    UserDetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                    UserDetails += '<p style="font-size: 12px;font-weight: 600;">User Name</p>';
                    UserDetails += '<p style="font-size: 12px;">' + StoreDetails[0].User_Name + '</p></div>';
                    UserDetails += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Date</p>';
                    UserDetails += '<p style="font-size: 12px;">' + StoreDetails[0].MTO_Date + '</p></div></div>';
                    UserDetails += '</div></br>';
                    $('#dvAttUserDetails').html(UserDetails);

                    if (Attendance.length > 0) {
                        Attendancelst += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        Attendancelst += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                        Attendancelst += '<p style="font-size: 12px;font-weight: 600;">In Time</p>';
                        Attendancelst += '<p style="font-size: 12px;">' + StoreDetails[0].In_time + '</p></div>';
                        Attendancelst += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Out Time</p>';
                        Attendancelst += '<p style="font-size: 12px;">' + StoreDetails[0].Out_time + '</p></div></div>';
                        Attendancelst += '</div></br>';
                        for (var i = 0; i < Attendance.length; i++) {
                            Attendancelst += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                            Attendancelst += '<p style="font-size: 12px;font-weight: 600;">Attendance Activity</p>';
                            Attendancelst += '<p style="font-size: 12px;">' + Attendance[i].Activity_Name + '</p>';
                            Attendancelst += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                            Attendancelst += '<p style="font-size: 12px;font-weight: 600;">Start Time</p>';
                            Attendancelst += '<p style="font-size: 12px;">' + Attendance[i].From_Time + '</p></div>';
                            Attendancelst += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">End Time</p>';
                            Attendancelst += '<p style="font-size: 12px;">' + Attendance[i].To_Time + '</p></div></div>';
                            Attendancelst += '<p style="font-size: 12px;font-weight: 600;">Remarks</p>';
                            Attendancelst += '<p style="font-size: 12px;">' + Attendance[i].Remark + '</p>';
                            Attendancelst += '</div></br>';
                        }
                        $('#spnAttendance').html(Attendancelst);
                    }
                    else {
                        Attendancelst += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        Attendancelst += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                        Attendancelst += '<p style="font-size: 12px;font-weight: 600;">In Time</p>';
                        Attendancelst += '<p style="font-size: 12px;">-</p></div>';
                        Attendancelst += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Out Time</p>';
                        Attendancelst += '<p style="font-size: 12px;">-</p></div></div>';
                        Attendancelst += '</div></br>';
                        Attendancelst += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        Attendancelst += '<p style="font-size: 12px;font-weight: 600;">Accompanist Name</p>';
                        Attendancelst += '<p style="font-size: 12px;">-</p>';
                        Attendancelst += '<p style="font-size: 12px;font-weight: 600;">Start Time</p>';
                        Attendancelst += '<p style="font-size: 12px;">-</p>';
                        Attendancelst += '<p style="font-size: 12px;font-weight: 600;">End Time</p>';
                        Attendancelst += '<p style="font-size: 12px;">-</p>';
                        Attendancelst += '<p style="font-size: 12px;font-weight: 600;">Remarks</p>';
                        Attendancelst += '<p style="font-size: 12px;">-</p>';
                        Attendancelst += '</div></br>';
                        $('#spnAttendance').html(Attendancelst);
                    }
                    GenRemarks += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                    GenRemarks += '<p style="font-size: 12px;">' + StoreDetails[0].GeneralRemarks + '</p>';
                    GenRemarks += '</div></br>';
                    $('#spnAttRemarks').html(GenRemarks);
                }
                if (StoreDetails[0].Activity == 3)
                {
                    $('#dvLeave').show();
                    if (StoreDetails.length > 0) {
                        UserDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        UserDetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                        UserDetails += '<p style="font-size: 12px;font-weight: 600;">User Name</p>';
                        UserDetails += '<p style="font-size: 12px;">' + StoreDetails[0].User_Name + '</p></div>';
                        UserDetails += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Date</p>';
                        UserDetails += '<p style="font-size: 12px;">' + StoreDetails[0].MTO_Date + '</p></div></div>';
                        UserDetails += '</div></br>';
                        $('#dvLvUserDetails').html(UserDetails);
                     for (var i = 0; i < StoreDetails.length; i++) {
                         Leavedetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                         Leavedetails += '<p style="font-size: 12px;font-weight: 600;">Leave Type</p>';
                         Leavedetails += '<p style="font-size: 12px;">' + StoreDetails[i].Leave_Type_Name + '</p>';
                         Leavedetails += '<p style="font-size: 12px;font-weight: 600;">Reason</p>';
                         Leavedetails += '<p style="font-size: 12px;">' + StoreDetails[i].LeaveReason + '</p>';
                         Leavedetails += '</div></br>';
                     }
                     $('#spnLeave').html(Leavedetails);
                }
                    else {
                        Leavedetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                        Leavedetails += '<p style="font-size: 12px;font-weight: 600;">Leave Type</p>';
                        Leavedetails += '<p style="font-size: 12px;">-</p>';
                        Leavedetails += '<p style="font-size: 12px;font-weight: 600;">Reason</p>';
                        Leavedetails += '<p style="font-size: 12px;">-</p>';
                        Leavedetails += '</div></br>';
                        $('#spnLeave').html(Leavedetails);
                    }
                   
                }
            }
        })
    },
    fnopenattachment: function (urllnk)
    {
        debugger;
        window.open(urllnk, '_blank');
    }
}