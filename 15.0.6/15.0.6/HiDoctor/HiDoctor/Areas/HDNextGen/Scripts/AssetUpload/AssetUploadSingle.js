
var ASSETS = {
    defaults: {
        "Asset_PageSize": 20,
        "Asset_Page_No": 1,
        "Asset_loading": false,
        "Assigned_Assets_Json": null,
        "Tags_Json": null,
        "Assigned_Category_Json": null,
        "Total_Page_Count": 1,
        "Page_No": 1,
        "Total_Asset_Count": 0,
        "Assigned_Users": null,
        "file_Accepted_Extension": ['BMP', 'JPG', 'JPEG', 'GIF', 'PNG', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'PDF', 'MP4', 'ZIP'],
        "Date_Format": "dd-MM-yyyy",
        "loading": false,
        "User_Page_No": 1,
        "User_Page_Size": 20,
        "Share_Not_Allowed_Ext": ["xls", "xlsx", "zip"],
        "Customer_Shareable": "N",
        "Customer_Page_Count": 0,
        "Customer_Total_Records": 0,
        "Customer_Page_No": 1,
        "Is_First_Time_Share_Open": 0,
        "Entity_Common_Name": "Category",
        "Asset_No": 1,
        "Is_Pharma_Customer": 1,
        "Can_Show_Speciality": "Y",
        "Filter_Text": "",
    },
    filterSelection: { category: new Array(), types: new Array(), users: new Array(), tags: new Array() },
    filterEl: null,
    init: function () {
        //ASSETS.getCustomerDomain();
        // ASSETS.checkCustomerSharable();
        ASSETS.getAssetGroupCount();
        ASSETS.firstTimeAssetLoad();
        ASSETS.getDateFormat();
        ASSETS.getCategory();
        ASSETS.getTagNames();
        //ASSETS.getSpecialities();
        //ASSETS.getCustomerSpeciality();
        //  ASSETS.canShowSpecialityForAssetMapping();
        // ASSETS.getAssetPaging();

        var year = new Date(UploadServices.currentDate.split('-')[2] + '-' + UploadServices.currentDate.split('-')[1] + '-' + UploadServices.currentDate.split('-')[0]).getFullYear();
        $(".date-picker").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            yearRange: (year - 150) + ':' + (year + 0)
        });
        $('input[id=txtThumbImg]').change(function () {
            ASSETS.showThumbnailChange(this);
        });
        $('.cls-thum-change .cls-foot-upload').unbind('click').bind('click', function () {
            ASSETS.saveThumbnail();
        });
        $('.cls-thum-change .cls-foot-cancel').unbind('click').bind('click', function () {
            //$('#dvUnAssinThumbChange').modal('hide');
            HideModalPopup('dvUnAssinThumbChange');
        });
        $('#lnkAddCategory').unbind('click').bind('click', function () {
            ASSETS.showAddCategory();
        });
        $('.cls-file-cat .cls-foot-cancel').unbind('click').bind('click', function () {
            $('#dvAddCat').hide();
            $('#dvAddPro').show();
        });
        $('.cls-file-cat .cls-foot-upload').unbind('click').bind('click', function () {
            ASSETS.saveCategory();
        });
        $('.cls-file-pro-act .cls-foot-cancel').unbind('click').bind('click', function () {
            HideModalPopup('dvFileProperty');
        });
        $('.cls-file-pro-act .cls-foot-upload').unbind('click').bind('click', function () {
            ASSETS.updateFileProperties();
        });
        $('input[id=txtCatThumbImg]').change(function () {
            ASSETS.showCatThumbnailChange(this);
        });
        $('#btnMulProperty').unbind('click').bind('click', function () {
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset.');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                var flag = false;
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        flag = true;
                    }
                });
                if (flag) {
                    $('.cls-share-dis').show();
                    ASSETS.showConfirmPopUp('P', '');
                }
                else {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Since, you are not owner of all the assets that you have selected, you cannot modify the details.');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
            }
        });
        $('#btnMulDelete').unbind('click').bind('click', function () {
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                var flag = false;
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        flag = true;
                    }
                });
                if (flag) {
                    ASSETS.showConfirmPopUp('R', '');
                }
                else {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Since Selected asset(s) have not uploaded by you, can not retire.');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
            }
        });
        $('#btnMulSpec').unbind('click').bind('click', function () {
            $('input[type=checkbox][name=chkAllSpec]').attr('checked', false);
            $('input[type=checkbox][name=chkSpec]').attr('checked', false);
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                ShowModalPopup('dvAssetSpec');
            }
        });
        $('#lnkQuickShare').unbind('click').bind('click', function () {
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                $('.cls-share-dis').show();
                var stagingCode = "";
                var flag = false;
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        flag = true;
                    }
                });
                if (flag) {
                    ASSETS.showConfirmPopUp('S', 'Q');
                }
                else {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Since, you are not owner of all the assets that you have selected, you cannot share them with your employess');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
            }

        });
        $('#lnkShareCustomer').unbind('click').bind('click', function () {
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                var flag = false;
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('ICS').toUpperCase() == "Y") {
                        flag = true;
                    }
                });
                if (flag) {
                    ASSETS.showConfirmPopUp('C');
                }
                else {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Since, all the assets that you have selected are non-shareable, you cannot share them with your customers.');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
            }
            if ($('input[type=checkbox].stagingcheck:checked').length > 1) {
                $('.cls-Retain').hide();
            }
        });
        $('#lnkBtnAssignAll').unbind('click').bind('click', function () {
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                $('.cls-share-dis').show();
                var stagingCode = "";
                var flag = false;
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        flag = true;
                    }
                });
                if (flag) {
                    ASSETS.showConfirmPopUp('S', 'A'); // assign with all users
                }
                else {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Since, you are not owner of all the assets that you have selected, you cannot share them with your employess');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
            }
        });
        $('#lnkShareUsers').unbind('click').bind('click', function () {
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one asset');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            else {
                $('.cls-share-dis').show();
                var stagingCode = "";
                var flag = false;
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        flag = true;
                    }
                });
                if (flag) {
                    ASSETS.showConfirmPopUp('S', 'S'); // assign with all users
                }
                else {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Since, you are not owner of all the assets that you have selected, you cannot share them with your employess');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
            }
        });
        $('.cls-delete-action .cls-foot-upload').unbind('click').bind('click', function () {
            var stagingCode = $('#hdnStagingCode').val();
            ASSETS.deleteAsset(stagingCode);
        });
        $('.cls-delete-action .cls-foot-cancel').unbind('click').bind('click', function () {
            ASSETS.Closemodel();
        });
        $('.cls-Assign-action .cls-foot-upload').unbind('click').bind('click', function () {
            // $('#dvAssignAssetModal').modal('show');
            $('#dvAssign').html('');
            ShowModalPopup('dvAssignAssetModal');
        });
        $('.cls-Assign-action .cls-foot-cancel').unbind('click').bind('click', function () {
            //$('#dvAssignAssetModal').modal('hide');
            HideModalPopup('dvAssignAssetModal');
        });
        $('.cls-mul-pro-action .cls-foot-upload').unbind('click').bind('click', function () {
            // $('#dvMulProModal').modal('hide');
            //$('#dvFileProperty').modal('show');
            HideModalPopup('dvMulProModal');
            // ShowModalPopup('dvFileProperty');
            ASSETS.openFileProperties('');
        });
        $('#dvFileChange .cls-foot-cancel').unbind('click').bind('click', function () {
            // $('#dvFileChange').modal('hide');
            $('#txtAssetChange').val('');
            $("#txtFile").val('');
            $('#dvFileMsg').html('');
            HideModalPopup('dvFileChange');
        });
        $('#dvFileChange .cls-foot-upload').unbind('click').bind('click', function () {
            ASSETS.saveChangedFile();
        });
        $('.cls-mul-pro-action .cls-foot-cancel').unbind('click').bind('click', function () {
            //$('#dvMulProModal').modal('hide');
            HideModalPopup('dvMulProModal');
        });
        $('#txtFile').change(function () {
            //  $('body').css('overflow', 'hidden');
            // $('#txtFile').val('');
            $('#txtAssetChange').val('');
            ASSETS.showFileChange(this);
        });
        $('.lnkAssignAll').unbind('click').bind('click', function () {

            ASSETS.assignToAllUsersPopUp('');
        });
        $('#btnSearch').unbind('click').bind('click', function () {
            ASSETS.defaults.Asset_Page_No = 1;
            var searchText = $('#txtAssignSearch').val();
            if (searchText == '') {
                searchText = null;
            }
            var sortMode = 'ASC';
            if ($('.cls-sort i').hasClass('fa-sort-alpha-asc')) {
                sortMode = 'ASC';
            }
            else {
                sortMode = 'DESC';
            }
            var categoryFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.category.join(',');
            var typeFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.types.join(',');
            var uploadedByFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.users.join(',')
            var tagsFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.tags.join(',')

            if (categoryFilter == '') { categoryFilter = null };
            if (typeFilter == '') { typeFilter = null };
            if (uploadedByFilter == '') { uploadedByFilter = null };
            if (tagsFilter == '') { tagsFilter = null };

            if (categoryFilter != null || typeFilter != null || uploadedByFilter != null || tagsFilter != null || searchText != null) {
                $('#dvUnassigned').html('');
            }
            $('.cls-asset-action').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
        });
        $("#txtAssignSearch").keypress(function (e) {
            if ($.trim($("#txtAssignSearch").val() != '')) {
                $('.searchclear').show();
            }
            else {
                $('.searchclear').hide();
            }

        }).keydown(function (e) {
            if ($.trim($("#txtAssignSearch").val() != '')) {
                $('.searchclear').show();
            }
            else {
                $('.searchclear').hide();
            }
        });
        $('.searchclear').unbind('click').bind('click', function () {
            $("#txtAssignSearch").val('');
            $("#txtAssignSearch").focus();
        });
        $("#txtAssignSearch").keydown(function (e) {
            if (e.keyCode == 13) {
                $('#btnSearch').click();
            }
        });
        $('.cls-unass-filters').unbind('click').bind('click', function () {
            ASSETS.showFilters();
        });
        $('.cls-sort').unbind('click').bind('click', function () {
            $('.cls-asset-action').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            if ($('.cls-sort i').hasClass('fa-sort-asc')) {
                $('.cls-sort i').removeClass('fa-sort-asc');
                $('.cls-sort i').addClass('fa-sort-desc');
                setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            }
            else {
                $('.cls-sort i').removeClass('fa-sort-desc');
                $('.cls-sort i').addClass('fa-sort-asc');
                setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            }
        });
        $('#dvRetailsPrevious .fa-question-circle').unbind('click').bind('click', function () {
            if ($('.cls-retain-desc').is(":visible")) {
                $('.cls-retain-desc').hide();
            }
            else {
                $('.cls-retain-desc').show();
            }
        });
        $('#btnShareCust').unbind('click').bind('click', function () {
            if ($('#dvCategory').hasClass('active')) {
                if ($('input[type=checkbox][name=chkCat]:checked').length == 0) {
                    //  alert('Please select atleast one ' + ASSETS.defaults.Entity_Common_Name);
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one ' + ASSETS.defaults.Entity_Common_Name);
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
                $('#dvCustPnl').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.saveCategoryCustomer(); }, 10);
            }
            else {
                if ($('input[type=checkbox][name=chkCus]:checked').length == 0) {
                    // alert('Please select atleast one customers');
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one customers');
                    ShowModalPopup('dvCommonMsgModal');
                    $('#dvCustPnl').unblock();
                    return;
                }
                $('#dvCustPnl').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.saveAssetCustomer(); }, 10);
            }
        });
        $('#lnkCusFilter').unbind('click').bind('click', function () {
            if ($('.cls-filter-customer').is(':visible')) {
                $('.cls-filter-customer').hide();
                $('#dvFilterStatus').show();
                $('#dvAssetCus').show();
                $('#dvSearchCus').show();
                $('#dvShareCustomer .modal-footer').show();
                $('#dvCutAssFilter').show();
                // $('#txtSearchCust').val('');
            }
            else {
                $('.cls-filter-customer').show();
                $('#dvFilterStatus').hide();
                $('#dvAssetCus').hide();
                $('#dvSearchCus').hide();
                $('#dvShareCustomer .modal-footer').hide();
                $('#dvCutAssFilter').hide();
                //$('#txtSearchCust').val('');
            }
        });
        $('#btnApply').unbind('click').bind('click', function () {
            $('#dvCustPnl').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getCustomerPagingDetails(); }, 10);
            $('.cls-filter-customer').hide();
            $('#dvFilterStatus').show();
            $('#dvAssetCus').show();
            $('#dvSearchCus').show();
            $('#dvShareCustomer .modal-footer').show();
        });
        $('#btnCustFilterCancel').unbind('click').bind('click', function () {
            $('#txtFName').val('');
            $('#txtLName').val('');
            $('#cboCustSpeciality').val('0');
            $('#txtEmailId').val('');
            $("#cboSpeciality option:selected").removeAttr("selected");
            $("#cboSpeciality").multiselect('refresh');
        });
        $('#btnCustSearch').unbind('click').bind('click', function () {
            ASSETS.defaults.Customer_Page_No = 1;
            $('#dvCustPnl').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getCustomerPagingDetails(); }, 10);
            $('.cls-filter-customer').hide();
            $('#dvFilterStatus').show();
            $('#dvAssetCus').show();
        });
        if (UploadServices.is_share_Count_g > 0) {
            $('#lnkMainShareCust').show();
        }
        else {
            $('#lnkMainShareCust').hide();
        }
        $('#txtSearchCust').keydown(function (e) {
            if (e.keyCode == 13) {
                $('#btnCustSearch').click();
            }
        });

        $('.asset-group a').unbind('click').bind('click', function () {
            $('.asset-group a').removeClass('active');
            $(this).addClass('active');
            $('.asset-group a i').hide();
            $('i', this).show();
            $('.btn-asset-group').html($('span', this).html());
            $('#spnPaging').html('<b>Showing: ' + $('label', this).html().replace('(', '').replace(')', '') + '</b> assets');
            $('#hdnAssetGroupCount').val($('label', this).html().replace('(', '').replace(')', ''));
            ASSETS.defaults.Total_Asset_Count = $.trim($('#hdnAssetGroupCount').val());
            $('#dvUnassigned').html('');
            $('#dvUnassigned').unbind('scroll');
            ASSETS.defaults.Asset_Page_No = 1;
            $('.cls-asset-action').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            if ($('#hdnAssetGroup').val() == 'UPLOADED BY OTHERS') {
                $('#btnMulDelete').hide();
                $('#btnMulProperty').hide();
            }
            else {
                $('#btnMulDelete').show();
                $('#btnMulProperty').show();
            }
        });
        $('.asset-sort a').unbind('click').bind('click', function () {
            $('.asset-sort a').removeClass('active');
            $(this).addClass('active');
            $('.asset-sort a i').hide();
            $('i', this).show();
            $('#dvUnassigned').html('');
            ASSETS.defaults.Asset_Page_No = 1;
            $('.cls-asset-action').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
        });
        $('#btnUploadAsset').unbind('click').bind('click', function () {
            //$('.cls-asset-action').hide();
            //$('.cls-main-upload').show();
            $('.notification').show();
            //$("#dvThirdPty").show();
            $("#dvURL").html("");
            $("#btnDownload").hide();
            $('.cls-disclaim-upload').show(); $('.cls-upload-content').show();
            ASSETS.getThirdPartyAccess();
            ShowModalPopup('dvUpload');
        });
        $('#btnInvertSelAllAsset').unbind('click').bind('click', function () {
            ASSETS.invertSelection();
        });
        $('#btnSelAllAsset').unbind('click').bind('click', function () {
            ASSETS.selectAllAssets();
        });
        $('#btnUnSelAllAsset').unbind('click').bind('click', function () {
            ASSETS.unSelectAllAssets();
        });
        $('#btnShowSelAllAsset').unbind('click').bind('click', function () {
            ASSETS.showOnlySelectedAssets(this);
        });

    },
    canShowSpecialityForAssetMapping: function () {
        if (ASSETS.defaults.Can_Show_Speciality == "Y") {
            $('#btnMulSpec').show();
        }
        else {
            $('#btnMulSpec').hide();
        }
    },
    getThirdPartyAccess: function () {
        UploadServices.getThirdPartyAccess(function (result) {
            if (result > 0) {
                $("#dvThirdPty").show();
                $("#dvbox").show();
                $("#dvdpbox").show();
            }
            else {
                $("#dvThirdPty").hide();
                $("#dvbox").hide();
                $("#dvdpbox").hide();
            }
        },
        function (result) {
        });
    },
    firstTimeAssetLoad: function () {
        UploadServices.getAssetGroupingCount(function (result) {
            if (result.length > 0) {
                if (result[0].Has_Customer_Share_Access) {
                    $('#lnkShareable').show();
                    $('#lnkNonShareable').show();
                }
                else {
                    $('#lnkShareable').hide();
                    $('#lnkNonShareable').hide();
                }
                $('#lblG1').html(' (' + result[0].Total_Assets_Count + ')');
                $('#lblG2').html(' (' + result[0].Uploaded_Me_Count + ')');
                $('#lblG3').html(' (' + result[0].Uploaded_By_Others_Count + ')');
                $('#lblG4').html(' (' + result[0].Shareable_With_Customers_Count + ')');
                $('#lblG5').html(' (' + result[0].Non_Shareable_With_Customers_Count + ')');
                $('#lblG6').html(' (' + result[0].Downloadable_Asset_Count + ')');
                $('#lblG7').html(' (' + result[0].Non_Downloadable_Asset_Count + ')');
                $('#lblG8').html(' (' + result[0].In_Progress_Assets_Count + ')');
                $('#lblG9').html(' (' + result[0].Not_Yet_Shared_Assets_Count + ')');
                var count = $('label', $('.asset-group a.active')).html().replace('(', '').replace(')', '')
                $('#spnPaging').html('<b>Showing:   ' + count + '</b> assets');
                $('#hdnAssetGroupCount').val(count);
                ASSETS.defaults.Total_Asset_Count = count;
                $('.cls-asset-action').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            }
        }, function (result) { });
    },
    getAssetGroupCount: function () {
        UploadServices.getAssetGroupingCount(function (result) {
            if (result.length > 0) {
                if (result[0].Has_Customer_Share_Access) {
                    $('#lnkShareable').show();
                    $('#lnkNonShareable').show();
                }
                else {
                    $('#lnkShareable').hide();
                    $('#lnkNonShareable').hide();
                }
                $('#lblG1').html(' (' + result[0].Total_Assets_Count + ')');
                $('#lblG2').html(' (' + result[0].Uploaded_Me_Count + ')');
                $('#lblG3').html(' (' + result[0].Uploaded_By_Others_Count + ')');
                $('#lblG4').html(' (' + result[0].Shareable_With_Customers_Count + ')');
                $('#lblG5').html(' (' + result[0].Non_Shareable_With_Customers_Count + ')');
                $('#lblG6').html(' (' + result[0].Downloadable_Asset_Count + ')');
                $('#lblG7').html(' (' + result[0].Non_Downloadable_Asset_Count + ')');
                $('#lblG8').html(' (' + result[0].In_Progress_Assets_Count + ')');
                $('#lblG9').html(' (' + result[0].Not_Yet_Shared_Assets_Count + ')');
                var count = $('label', $('.asset-group a.active')).html().replace('(', '').replace(')', '')
                $('#spnPaging').html('<b>Showing:   ' + count + '</b> assets');
                $('#hdnAssetGroupCount').val(count);
                ASSETS.defaults.Total_Asset_Count = count;
            }
        }, function (result) { });
    },
    getDateFormat: function () {
        UploadServices.getDateFormat(function (jsonData) {
            ASSETS.setDateFormat(jsonData);
        },
           function () {
           });
    },
    setDateFormat: function (result) {
        if (result != null && result != undefined && result != '') {
            ASSETS.defaults.Date_Format = result;
        }
    },
    getCategory: function (catId, catName) {
        UploadServices.getCategory(function (jsonData) {
            ASSETS.bindCategory(jsonData, catId, catName);
        },
          function () {
          });
    },
    bindCategory: function (res, catId, catName) {
        ASSETS.defaults.Assigned_Category_Json = res;
        var content = "<option value=''>Select Category</option>";
        $.each(res, function (Index, itemresult) {
            content += "<option value=" + itemresult.DA_Category_Code + " title='" + itemresult.DA_Category_Name + "'>" + itemresult.DA_Category_Name + "</option>";
        });

        $('#cboCategory').html(content);
        if (catId != '') {
            //  $('#cboCategory').append('<option value=' + catId + ' selected=selected title=' + catName + '>' + catName + '</option>');
            $('#cboCategory').val(catId);
        }
    },
    checkCustomerSharable: function () {
        UploadServices.checkCustomerSharable(function (jsonData) {
            ASSETS.bindAllowCustomerShare(jsonData);
        },
        function () {
        });
    },
    bindAllowCustomerShare: function (res) {
        debugger;
        if (res[0].Customer_Shareable == "Y") {
            ASSETS.defaults.Customer_Shareable = "Y";
            $('.cls-allow-share').show();
        }
        else {
            ASSETS.defaults.Customer_Shareable = "N";
            $('.cls-allow-share').hide();
        }
        if (res[0].Specility == "Y") {
            ASSETS.defaults.Can_Show_Speciality = "Y";
            $('#btnMulSpec').show();
        }
        else {
            ASSETS.defaults.Can_Show_Speciality = "N";
            $('#btnMulSpec').hide();
        }

    },
    getTagNames: function () {
        UploadServices.getTagNames(function (jsonData) {
            ASSETS.bindTags(jsonData);
        },
       function () {
       });
    },
    bindTags: function (result) {
        ASSETS.defaults.Tags_Json = result;
        var content = "";
        var data = new Array();
        content = "[";
        for (var i = 0; i < result.length; i++) {
            content += "{id:\"" + result[i].Real_Tag_Name + "\",name:\"" + result[i].Real_Tag_Name + "\"},";
        }
        content = content.slice(0, -1) + "]";
        if (result.length == 0) {
            content = "[]";
        }
        data = eval('(' + content + ')');

        $('.tagdetails').prev().detach();
        $(".token-input-list-facebook").prev().detach();
        $('.tagdetails').tokenInput([data], {
            theme: "facebook",
            allowFreeTagging: true,
            preventDuplicates: true
        });
    },
    getAssetPaging: function () {
        var pageSize = ASSETS.defaults.Asset_PageSize;
        var pageNo = ASSETS.defaults.Asset_Page_No;
        var searchText = $('#txtAssignSearch').val();
        if (searchText == '') {
            searchText = null;
        }
        var categoryFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.category.join(',');
        var typeFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.types.join(',');
        var uploadedByFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.users.join(',')
        var tagsFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.tags.join(',')

        if (categoryFilter == '') { categoryFilter = null };
        if (typeFilter == '') { typeFilter = null };
        if (uploadedByFilter == '') { uploadedByFilter = null };
        if (tagsFilter == '') { tagsFilter = null };

        var obj = {};
        obj.Group_Name = $('#hdnAssetGroup').val();
        obj.Category_Filters = categoryFilter;
        obj.File_Type_Filters = typeFilter
        obj.Tag_Filters = tagsFilter
        obj.Uploaded_By_User_Filters = uploadedByFilter
        obj.Search_Text = searchText

        UploadServices.getAssetPaging(pageSize, obj,
            function (jsonData) {
                ASSETS.getAssignedAssets();
            },
            function () {
                $('.cls-asset-action').unblock();
            });
    },
    getAssignedAssets: function () {
        $('.cls-selection').hide();
        if (ASSETS.defaults.Asset_Page_No == 1) {
            $('#dvUnassigned').html('');
        }
        var pageSize = ASSETS.defaults.Asset_PageSize;
        var pageNo = ASSETS.defaults.Asset_Page_No;
        var searchText = $('#txtAssignSearch').val();
        if (searchText == '') {
            searchText = null;
        }

        var categoryFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.category.join(',');
        var typeFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.types.join(',');
        var uploadedByFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.users.join(',')
        var tagsFilter = (ASSETS.filterEl == null) ? '' : ASSETS.filterEl.selectedAssets.tags.join(',')

        if (categoryFilter == '') { categoryFilter = null };
        if (typeFilter == '') { typeFilter = null };
        if (uploadedByFilter == '') { uploadedByFilter = null };
        if (tagsFilter == '') { tagsFilter = null };

        var obj = {};
        obj.Group_Name = $('#hdnAssetGroup').val();
        obj.Category_Filters = categoryFilter;
        obj.File_Type_Filters = typeFilter
        obj.Tag_Filters = tagsFilter
        obj.Uploaded_By_User_Filters = uploadedByFilter
        obj.Search_Text = searchText
        if (categoryFilter != null || typeFilter != null || uploadedByFilter != null || tagsFilter != null || searchText != null) {
            debugger;
            UploadServices.getAssetPaging(pageSize, obj,
          function (jsonData) {
              if (jsonData.Total_Assets_Count > 0) {
                  $('.cls-dv-page').show();
                  ASSETS.defaults.Filter_Text = 'Showing: ' + jsonData.Total_Assets_Count + ' of ' + $('#hdnAssetGroupCount').val() + ' Assets   <span class="label label-default" style="margin-right:5px;border-radius: 15px;">Clear Filter <i class="fa fa-times clear-asset-filter" style="cursor:pointer;"></i></span>';

                  $('#spnPaging').html('<div class="cls-show-fil-msg"><b>Showing: ' + jsonData.Total_Assets_Count + ' of ' + $('#hdnAssetGroupCount').val() + '</b> Assets </div><div class="clear-asset-filter"> <img src="../../Areas/HDNextGen/Content/AssetUpload/imgs/Clear_Button.png" title="Clear Filter"/> </div>');
                  ASSETS.defaults.Total_Asset_Count = jsonData.Total_Assets_Count;
                  UploadServices.getAssignedAssets(pageNo, pageSize, $('#hdnSort').val().split('_')[0], $('#hdnSort').val().split('_')[1], obj,
                   function (jsonData) {
                       if (jsonData.length > 0) {
                           // ASSETS.defaults.Assigned_Assets_Json.items.push(jsonData);
                           if (ASSETS.defaults.Asset_Page_No == 1) {
                               ASSETS.defaults.Assigned_Assets_Json = jsonData;
                           }
                           else {
                               ASSETS.defaults.Assigned_Assets_Json = ASSETS.defaults.Assigned_Assets_Json.concat(jsonData);
                               //  ASSETS.defaults.Assigned_Assets_Json = $.extend(ASSETS.defaults.Assigned_Assets_Json, jsonData);
                           }
                           ASSETS.defaults.Asset_loading = false;
                       }
                       ASSETS.bindAssetView(jsonData);
                   },
                   function () {
                       $('.cls-asset-action').unblock();
                       $('.cls-main-content').unblock();
                   });
              }
              else {
                  $('.cls-asset-action').unblock();
                  $('.cls-main-content').unblock();
                  $('#dvUnassigned').html('<div style="text-align:center;font-size:18px;padding-top: 5%;">Asset details not found</div>');
                  $('.cls-dv-page').hide();
              }
          },
          function () {
              $('.cls-asset-action').unblock();
          });
        }
        else {
            ASSETS.defaults.Filter_Text = 'Showing: ' + $('#hdnAssetGroupCount').val() + ' Assets';
            $('#spnPaging').html('<b>Showing:' + $('#hdnAssetGroupCount').val() + '</b> Assets');
            ASSETS.defaults.Total_Asset_Count = $('#hdnAssetGroupCount').val();
            UploadServices.getAssignedAssets(pageNo, pageSize, $('#hdnSort').val().split('_')[0], $('#hdnSort').val().split('_')[1], obj,
                function (jsonData) {
                    if (jsonData.length > 0) {
                        $('.cls-dv-page').show();
                        // ASSETS.defaults.Assigned_Assets_Json.items.push(jsonData);
                        if (ASSETS.defaults.Asset_Page_No == 1) {
                            ASSETS.defaults.Assigned_Assets_Json = jsonData;
                        }
                        else {
                            ASSETS.defaults.Assigned_Assets_Json = ASSETS.defaults.Assigned_Assets_Json.concat(jsonData);
                            //  ASSETS.defaults.Assigned_Assets_Json = $.extend(ASSETS.defaults.Assigned_Assets_Json, jsonData);
                        }
                        ASSETS.defaults.Asset_loading = false;
                        ASSETS.bindAssetView(jsonData);
                    }
                    else {
                        if (ASSETS.defaults.Asset_Page_No == 1) {
                            $('.cls-asset-action').unblock();
                            $('#dvUnassigned').unblock();
                            $('.cls-main-content').unblock();
                            $('#dvUnassigned').html('<div style="text-align:center;font-size:18px;padding-top: 5%;">Asset details not found</div>');
                            $('.cls-dv-page').hide();
                        }
                    }

                },
                function () {
                    $('.cls-asset-action').unblock();
                    $('.cls-main-content').unblock();
                    $('#dvUnassigned').unblock();
                });
        }
    },
    bindAssetView: function (res) {
        var content = "";
        var flag = false;
        $.each(res, function (Index, itemresult) {
            var i = ASSETS.defaults.Asset_No;
            var img = ASSETS.getFileExtension(itemresult.DA_File_Name);
            var daName = itemresult.DA_Name;
            if (daName.length > 35) {
                daName = daName.substring(0, 32) + "...";
            }
            content += "<div class='upfront verifycheck cls-asset' asset_id=" + itemresult.DA_Code + " >";
            content += "<div class='col-lg-12 cls-main-asset'> ";
            content += "<div class='post-container'> <div class='post-option'> ";
            content += "<ul class='list-options'> <li class='cls-check'><div class='checkbox checkbox-primary'> ";
            content += " <input type='checkbox' id='chk_" + i + "' ";
            content += " class='checkbox stagingcheck' file-ext=" + itemresult.File_Extension + " own-asset=" + itemresult.Is_Uploaded_By_Me + " ICS=" + itemresult.Is_Customer_Sharable + " ";
            content += " data-checkedid=" + itemresult.DA_Code + " /><label for='chk_" + i + "'></label></div> </li>";
            content += " <li class='dropdown pull-right cls-settings'><a href='#' class='dropdown-toggle' ";
            content += " data-toggle='dropdown'><i class='fa fa-lg fa-gear'></i> </a>";
            content += " <ul class='dropdown-menu cls-drp-mnu'> ";
            //if (itemresult.Is_Uploaded_By_Me) {
            //    flag = true;
            //    content += " <li class='cls-quick-share'><a href='#' onclick=$('#hdnStagingCode').val(" + itemresult.DA_Code + ") data-whatever='mdo'";
            //    content += " data-toggle='modal'><i class='fa fa-share-alt'></i>&nbsp; Quick Share</a></li> ";
            //}
            //if (UploadServices.is_share_Count_g > 0 && ASSETS.defaults.Customer_Shareable == "Y" && itemresult.Is_Customer_Sharable == "Y") {

            //    flag = true;
            //    //if ($.inArray(itemresult.File_Extension.toLowerCase(), ASSETS.defaults.Share_Not_Allowed_Ext) == -1) {
            //    content += " <li class='cls-share-customer'><a href='#' onclick=$('#hdnStagingCode').val(" + itemresult.DA_Code + ")  data-whatever='mdo' ";
            //    content += " data-toggle='modal'><i class='fa fa-share-alt'></i>&nbsp; Share with Customers</a></li> ";

            //}
            if (itemresult.Is_Uploaded_By_Me) {
                flag = true;
                //content += "<li><a href='#' onclick=ASSETS.assignToAllUsersPopUp(" + itemresult.DA_Code + ") class='lnkAssignAll'>";
                //content += " <i class='fa fa-users'></i>&nbsp; Share with all users</a></li>";
                //content += "<li><a href='#' onclick=$('#hdnStagingCode').val(" + itemresult.DA_Code + ") class='lnkAssignUsers'><img src='../../Content/SelfSignOn/dashboard/images/user-group-icon.png' /> &nbsp; Share with selective users</a></li>";
                //content += " <li onclick='ASSETS.getAssigendUsersForSelectedAsset(" + itemresult.DA_Code + ")'><a href='#' class='lnkShowAssigned'>";
                //content += " <i class='fa fa-user'></i> &nbsp; Show shared users</a>";
                ////content += " <ul class='dropdown-menu'><li>";
                ////content += " <a href='#' onclick=ASSETS.assignToAllUsersPopUp(" + itemresult.DA_Code + ") class='lnkAssignAll'> &nbsp; Assign to all users</a></li>";
                //////content += "<li> <a href='#'>&nbsp; Assign to all groups</a></li>";
                ////content += " <li><a href='#' onclick=$('#hdnStagingCode').val(" + itemresult.DA_Code + ") class='lnkAssignUsers'>&nbsp; Assign to selective users</a>";
                ////content += "</li></ul>"
                //content += " </li><li class='divider'></li> ";
                content += " <li><a href='#' data-whatever='mdo'";
                content += " data-toggle='modal' onclick=ASSETS.setCode(" + itemresult.DA_Code + ",'" + itemresult.DA_File_Name + "')>";
                content += " <i class='fa fa-photo ' ></i> &nbsp; Change thumbnail</a></li> ";
                content += " <li><a href='#' onclick=ASSETS.showFileDetails(" + itemresult.DA_Code + ") class='cls-file-change'><i class='fa fa-file'></i> &nbsp; Change File</a></li>";
                content += " <li><a href='#' data-whatever='mdo' ";
                content += " data-toggle='modal' class='examplecat ' onclick=ASSETS.openFileProperties("
                    + itemresult.DA_Code + ")>";
                content += " <i class='fa fa-list-ul '  ></i> &nbsp; Asset Properties</a></li> <li class='divider'></li>";
                content += " <li style='display:none;'><a href='#'><i class='fa fa-play-circle-o'></i> &nbsp; Preview</a></li><li class='divider'  style='display:none;'></li> ";
                content += "<li><a href='#' onclick='ASSETS.deleteAssetConfirm(" + itemresult.DA_Code + ",\"" + daName + "\")' >";
                content += " <i class='fa fa-trash'></i> &nbsp; Retire</a></li>";
            }
            content += "</ul> </li></ul></div>";
            content += " <div class='post-image'> <a href='img/fransisca-post-image03-big.jpg' ";
            content += " class='img-group-gallery' title='Lorem ipsum dolor sit amet'>";
            content += " <img data-post-id=" + itemresult.DA_Code + " src='" + itemresult.DA_Thumbnail_URL + "' class='img-responsive'";
            content += " alt=''>";
            content += "</a></div>";
            content += "<div class='asset-name'>";

            content += "<div class='col-lg-12 cls-padding-none cls-asset-desc'><div class='col-xs-2 cls-i asset-thumb'><img src='../../Areas/HDNextGen/Content/AssetUpload/doctype/" + img + "''/></div>";
            content += "<div class='col-xs-10 cls-i-txt asset-descr'><span class='cls-i-txt-name'><p>" + daName.toLowerCase() + "</p></span>";
            content += "<span class='cls-i-txt-category'><p>" + itemresult.DA_Category_Name.toLowerCase() + "</p></span></div></div>";
            //content += " <div class='rating_div'><div class='rating fa fa-star'>" + itemresult.Star_Count + "</div>";
            //content += "<div class='views fa fa-eye'>" + itemresult.Views_Count + "</div>";
            //content += " <div class='like fa fa-heart'>" + itemresult.Likes_Count + "</div>";
            //content += "</div><div class='clearfix'></div>";
            content += " </div></div><div class='col-lg-12 cls-padding-none cls-post-desc-wrapper' style='clear:both;'>";
            if (itemresult.Is_Media_Processed == 1) {
                content += " <div class='col-xs-5 post-desc-assigned a-align'> <p>" + itemresult.DA_Size_In_MB + " ";
                if (itemresult.Is_Downloadable == "Y") {
                    content += "<i class='fa fa-download'> </i>";
                }
                else {
                    content += "<i class='fa fa-globe margin-right-3'> </i>";
                }
                // if (itemresult.Is_Customer_Sharable == "Y") {
                if (UploadServices.is_share_Count_g > 0 && ASSETS.defaults.Customer_Shareable == "Y" && itemresult.Is_Customer_Sharable == "Y") {
                    content += "<i class='fa fa-share-alt'></i>";
                }

                content += "</p></div>";
            }
            else {
                content += " <div class='col-xs-5 post-desc-assigned a-align'><i class='fa fa-spinner fa-spin'></i> Processing... </div>";
            }
            var uploadedByname = itemresult.Uploaded_By_Name;
            if (uploadedByname.length > 18) {
                uploadedByname = uploadedByname.substring(0, 18) + "...";
            }
            content += "<div class='col-xs-7 post-desc-assigned'> <p> " + uploadedByname
                + " <br>" + itemresult.Last_Modified_Date + "</p></div></div></div></div></div>";
            ASSETS.defaults.Asset_No = parseInt(ASSETS.defaults.Asset_No) + 1;
        });
        if (content != '') {
            $('#dvUnassigned').append(content);
        }
        //$('#dvUnassigned').unbind('scroll').bind('scroll', function () {
        $('#dvUnassigned').on('scroll', function () {
            //if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            if ($(this).scrollTop() == $(this)[0].scrollHeight - $(this).height()) {
                if (!ASSETS.defaults.Asset_loading) {
                    //debugger;
                    if ($.trim($('#hdnAssetGroupCount').val()) > parseInt($('.cls-asset').length)) {
                        // alert(ASSETS.defaults.Asset_Page_No);
                        ASSETS.defaults.Asset_loading = true;
                        ASSETS.defaults.Asset_Page_No = parseInt(ASSETS.defaults.Asset_Page_No) + 1;
                        $('.cls-main-content').block({
                            message: 'Processing...',
                            css: { border: '2px solid #DDD' }
                        });
                        setTimeout(function () { ASSETS.getAssignedAssets(); }, 100);
                    }

                }

            }
        });
        //$(window).scroll(function () {
        //    if ($(window).scrollTop() == $(document).height() - $(window).height()) {

        ASSETS.bindAssetEvents();
        $('.cls-asset-action').unblock();
        $('.cls-main-content').unblock();
        $('#dvUnassigned').unblock();
    },
    getFileExtension: function (fileName) {
        if (fileName == null || fileName === undefined || fileName == '')
            return 'INVALID';
        var parts = fileName.split('.'), ext = parts[parts.length - 1].toLowerCase();
        if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp')
            extIcon = 'image.png';
        else if (ext == 'pdf')
            extIcon = 'pdf.png';
        else if (ext == 'docx' || ext == 'doc')
            extIcon = 'docx.png';
        else if (ext == 'ppt' || ext == 'pptx')
            extIcon = 'pptx.png';
        else if (ext == 'xls' || ext == 'xlsx')
            extIcon = 'xlsx.png';
        else if (ext == 'zip')
            extIcon = 'html5.png';
        else
            extIcon = 'video.png';

        return extIcon;
    },
    bindAssetEvents: function () {
        $('.stagingcheck').unbind('change').bind('change', function () {
            ASSETS.showAllUnchecked(this);
        });
        $('.lnkAssignUsers').unbind('click').bind('click', function () {
            var stagingCode = "";
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                stagingCode = $('#hdnStagingCode').val() + ",";
                if (stagingCode.slice(0, -1) == '') {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast any one asset.');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
                noOfAssets_g = 1;
            }
            else {
                $('.cls-share-dis').show();
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        stagingCode += $(val).attr('data-checkedid') + ',';
                    }
                });
                noOfAssets_g = $('input[type=checkbox].stagingcheck:checked').length;
            }
            if (stagingCode.slice(0, -1) != '') {
                $('#hdnStagingCode').val(stagingCode.slice(0, -1));
                daCode_g = stagingCode.slice(0, -1);
                $('#dvAssign').html('');
                ShowModalPopup('dvAssignAssetModal');
                $('#dvAssign').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () {
                    USER_ASSIGNMENT.getAllActiveUsers();
                }, 10);

            }
            else {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> you cannot share the assets that are not uploaded by you. Those assets will be automatically removed from your selection.');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }

        });

        $('.cls-quick-share').unbind('click').bind('click', function () {
            ASSETS.getAllActiveUsers();
        });
        $('.cls-share-customer').unbind('click').bind('click', function () {
            ASSETS.showShareCustomerPopUp();
        });
        $.each($('.cls-settings'), function (index, ele) {
            if ($('.cls-drp-mnu li', $(ele)).length > 0) {
                $(ele).show();
            }
            else {
                $(ele).hide();
            }
        });
        $('.clear-asset-filter').unbind('click').bind('click', function () {
            $('#dvUnassigned').html('');
            $('.filter-details ul li input').each(function (i, el) {
                el.checked = false;
                $('a .filter-count').hide().text(0);
            });
            if (ASSETS.filterEl != null) {
                ASSETS.filterEl.selectedAssets["category"] = new Array();
                ASSETS.filterEl.selectedAssets["tags"] = new Array();
                ASSETS.filterEl.selectedAssets["types"] = new Array();
                ASSETS.filterEl.selectedAssets["users"] = new Array();
            }
            ASSETS.defaults.Total_Asset_Count = $('#hdnAssetGroupCount').val();
            $('#spnPaging').html('Showing: ' + $('#hdnAssetGroupCount').val() + ' Assets');
            $('#txtAssignSearch').val('');
            $('.cls-asset-action').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
        });
    },
    showAllUnchecked: function (obj) {
        $('.cls-selection').show();
        $('#spnPaging').html($('input[type=checkbox].stagingcheck:checked').length + ' asset(s) selected');
        $('.cls-selection').show();
        if (obj.checked) {
            var unSelEl = $('input[type=checkbox].stagingcheck:not(checked)').parents('.cls-main-asset'),
                selEl = $('input[type=checkbox].stagingcheck:checked').parents('.cls-main-asset');
            unSelEl.each(function (i, els) {
                $(els).removeClass('cls-el-selected').addClass('cls-el-not-selected');
            });
            selEl.each(function (i, els) {
                $(els).removeClass('cls-el-not-selected').addClass('cls-el-selected');
            });
        }
        else {
            $(obj).parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
        }
        if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
            $('.cls-main-asset').removeClass('cls-el-selected').removeClass('cls-el-not-selected');
            $('.cls-selection').hide();
        }
    },
    showAddCategory: function () {
        $('#dvCatSuccMsg').hide();
        $('.cls-file-cat .cls-foot-cancel').show();
        $('.cls-file-cat .cls-foot-upload').show();
        $('#txtCategoryName').val('');
        $('#txtCatThumb').val('');
        $('#dvAddCat').show();
        $('#dvAddPro').hide();
    },
    saveCategory: function () {
        var data = new FormData();
        data.append("files", $("#txtCatThumbImg").get(0).files[0]);
        var categoryName = $.trim($('#txtCategoryName').val());
        if (categoryName == '') {
            $('#dvCatValidMsg').html('Please enter category name');
            return;
        }
        if (!ASSETS.isValid(categoryName)) {
            $('#dvCatValidMsg').html('Please remove special characters from category name');
            return;
        }

        //if ($.inArray(categoryName.toLowerCase(), arSpecial) > -1) {
        //    $('#dvCatValidMsg').html('Please remove *,&,/ from category name');
        //    return;
        //}

        UploadServices.saveCategory(categoryName, data,
         function (result) {
             ASSETS.saveCategorySuccess(result);
         },
function (result) {
    ASSETS.saveCategoryFail(result);
});
        $('#dvCatSuccMsg').html('Adding the new category...');
        $('#dvCatSuccMsg').show();
        $('.cls-file-cat .cls-foot-cancel').hide();
        $('.cls-file-cat .cls-foot-upload').hide();
    },
    saveCategorySuccess: function (res) {
        if (res.Transaction_Status) {
            var catId = res.Additional_Context.split('~')[0];
            var category = res.Additional_Context.split('~')[1];
            ASSETS.getCategory(catId, category);

            $('#dvCatSuccMsg').html(res.Message_To_Display);
            $('#dvAddCat').hide();
            $('#dvAddPro').show();
            $('.cls-file-cat .cls-foot-upload').show();
            $('.cls-file-cat .cls-foot-cancel').show();
            $('#dvCatSuccMsg').hide();
        }
        else {
            alert(res.Message_To_Display);
            $('#dvCatSuccMsg').hide();
            $('.cls-file-cat .cls-foot-cancel').show();
            $('.cls-file-cat .cls-foot-upload').show();
        }
    },
    saveCategoryFail: function (res) {
        $('#dvProSuccMsg').html(res.Message_To_Display);
    },
    updateFileProperties: function () {
        var fileName = $.trim($('#txtFileName').val());
        var Description = $.trim($('#txtDesc').val());
        var Categoryid = $('#cboCategory').val();
        var Category = $.trim($('#cboCategory :selected').text());
        var Expirdate = "";
        var tagDetails = $.trim($('#txtTagDetails').val());
        if ($.trim($('#txtExpDate').val()) != '') {
            Expirdate = moment($('#txtExpDate').val() + ' 12:00:00 AM', 'DD/MM/YYYY').format("YYYY-MM-DD");
        }
        var assetId = "";
        var Isdownload = 'Y';
        var IsShare = 'Y';
        var IsEduMaterial = 0;
        if (Description != '') {
        }
        else {
            if ($('input[type=checkbox].stagingcheck:checked').length < 1) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please enter description.');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
        }
        if ($('input[type=checkbox].stagingcheck:checked').length < 1) {
            if (Categoryid == '') {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select category');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
        }
        if (fileName != '') {
        }
        else {
            if ($('input[type=checkbox].stagingcheck:checked').length < 1) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please enter asset name');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
        }

        if ($.trim($('#txtExpDate').val()) != '') {
            var result = isValidDateFormat($("#txtExpDate"));
            if (!result) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please enter valid date in expiry date');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
            var exp = $("#txtExpDate").val().split('/')[2] + '/' + $("#txtExpDate").val().split('/')[1] + '/' + $("#txtExpDate").val().split('/')[0];
            var getdate = new Date(UploadServices.currentDate + "00:00:00");
            if ((new Date(exp)) < getdate) {
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Expiry date should be greater than or equal to current date');
                ShowModalPopup('dvCommonMsgModal');
                return;
            }
        }

        var isRetain = true;
        if ($('input[type=checkbox][name=chkRetain]').attr('checked')) {
            isRetain = true;
        }
        else {
            isRetain = false;
        }

        if ($('#chkDwonload').is(':checked') == true) {
            Isdownload = 'Y';
        } else { Isdownload = 'N' }

        if ($('#chkShare').is(':checked') == true) {
            IsShare = 'Y';
        } else { IsShare = 'N' }

        if ($('#chkEduMat').is(':checked') == true) {
            IsEduMaterial = 1
        } else { IsEduMaterial = 0 }

        if ($('input[type=checkbox].stagingcheck:checked').length > 1) {
            fileName = 'null';
            if (Description == '') {
                Description = 'null';
            }
            if (Categoryid == '') {
                Categoryid = 'null';
                Category = 'null';
            }
            if (tagDetails == '') {
                tagDetails = 'null';
            }
            if (Expirdate == '') {
                Expirdate = 'null';
            }
            if (Isdownload == 'N') {
                Isdownload = 'null'
            } if (IsShare == 'N') {
                IsShare = 'null'
            }
            if (IsEduMaterial == 0) {
                IsEduMaterial = 'null'
            }
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                assetId += $(val).attr('data-checkedid') + ',';
            });
            assetId = assetId.slice(0, -1);
        }
        else {
            var selectedJson = jsonPath(ASSETS.defaults.Assigned_Assets_Json, "$.[?(@.DA_Code=="
                 + $('#hdnStagingCode').val() + ")]");
            if (selectedJson != false && selectedJson != undefined && selectedJson != null) {
                if (selectedJson[0].DA_Name.toUpperCase() == fileName.toUpperCase()) {
                    fileName = 'null';
                }
                if (selectedJson[0].DA_Category_Code == Categoryid) {
                    Categoryid = 'null';
                    Category = 'null';
                }
                if (selectedJson[0].DA_Description.toUpperCase() == Description.toUpperCase()) {
                    Description = 'null';
                }
                if (tagDetails == '') {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please enter atleast one tag');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
                if (selectedJson[0].ToDate != '') {
                    if (moment(selectedJson[0].ToDate + ' 12:00:00 AM', 'DD/MM/YYYY').format("YYYY-MM-DD") == Expirdate) {
                        Expirdate = 'null';
                    }
                }
                assetId = $('#hdnStagingCode').val();
                isRetain = false;
            }
        }

        ASSETS.updateProperties(fileName, Categoryid, Category, Description, tagDetails, Expirdate, Isdownload,
        IsShare, assetId, isRetain, IsEduMaterial);

    },
    updateProperties: function (fileName, categoryId, category, description, tagdetails, expiryDate, isDownload,
        isShare, assetId, isRetain, IsEduMaterial) {
        $('#dvProSuccMsg').html('Updating the asset(s) properties...');
        $('#dvProSuccMsg').show();
        $('.cls-file-pro-act .cls-foot-cancel').hide();
        $('.cls-file-pro-act .cls-foot-upload').hide();
        var finalAssetId = ASSETS.getMyOwnAssetIds(assetId);

        var obj = {};
        obj.DA_Name = fileName.replace(/'/g, '');
        obj.DA_Category_Code = categoryId;
        obj.DA_Category_Name = category;
        obj.DA_Description = description.replace(/'/g, '');
        obj.Tags = tagdetails.replace(/,/g, '~').replace(/'/g, '');
        obj.ToDate = expiryDate;
        obj.Is_Downloadable = isDownload;
        obj.Is_Customer_Sharable = isShare;
        obj.Target_Asset_Ids = finalAssetId;
        obj.Is_Education_Material = IsEduMaterial;
        UploadServices.updateProperties(isRetain, obj,
        function (result) {
            ASSETS.updatePropertySuccess(result);
        },
        function () {

        });
    },
    updatePropertySuccess: function (result) {
        var assetId = '';
        if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
            assetId = $('#hdnStagingCode').val() + ",";
        }
        else {
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                assetId += $(val).attr('data-checkedid') + ',';
            });
        }
        assetId = assetId.slice(0, -1);
        $('#dvProSuccMsg').html(result.Message_To_Display);
        $('.cls-mul-pro-action  .cls-foot-cancel').show();
        $('.cls-mul-pro-action  .cls-foot-upload').show();
        $('#dvProSuccMsg').hide();
        HideModalPopup('dvFileProperty');
        $('#dvUnassigned').html('');
        ASSETS.getAssetGroupCount();
        ASSETS.getAssignedAssets();
        ASSETS.getTagNames();
        $('.cls-main-asset').removeClass('cls-el-selected').removeClass('cls-el-not-selected');
    },
    showCatThumbnailChange: function (input) {
        if ($.browser.msie) {
            var imgUrl = $('#txtCatThumbImg').val().replace(/C:\\fakepath\\/i, '');
            if (imgUrl != '') {
                var fileName = $('#txtCatThumbImg').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var arFileName = $('#txtCatThumbImg').val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                     arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    $('#txtCatThumb').val(fileName);

                }
                else {
                    $('#txtCatThumb').val('');
                    $("#txtCatThumbImg").val('');

                }
            }
            else {
                $('#dvCatValidMsg').html('Please select valid file.');
                $('#txtCatThumb').val('');
                $("#txtCatThumbImg").val('');
            }
        }
        else {
            //var input = $('#txtSurImg');
            if (input.files && input.files[0]) {
                var arFileName = $('#txtCatThumbImg').prop("files")[0].name.split('.');
                var fileNameAlone = arFileName[0];
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                   arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    var filerdr = new FileReader();
                    filerdr.onload = function (e) {
                    }
                    filerdr.readAsDataURL(input.files[0]);
                    $('#txtCatThumb').val($('#txtCatThumbImg').prop("files")[0].name);
                }
                else {
                    $('#dvCatValidMsg').html('Please select valid file.');
                    $('#txtCatThumb').val('');
                    $("#txtCatThumbImg").val('');
                }
            }
            else {
                $('#dvCatValidMsg').html('Please select valid file.');
                $('#txtCatThumb').val('');
                $("#txtCatThumbImg").val('');
            }
        }
    },
    openFileProperties: function (stagingCode) {
        $('#dvAddCat').hide();
        $('#dvAddPro').show();
        $('#dvProSuccMsg').hide();
        $('.cls-file-pro-act .cls-foot-cancel').show();
        $('.cls-file-pro-act .cls-foot-upload').show();
        $('#chkShare').attr('checked', true);
        $('.cls-share-dis').show();

        if (ASSETS.defaults.Is_Pharma_Customer == 0) {
            $('.cls-edu-material').show();
        }
        else {
            $('.cls-edu-material').hide();
        }

        ASSETS.clearFileProperties();
        if ($('input[type=checkbox].stagingcheck:checked').length > 1) {
            if (ASSETS.defaults.Customer_Shareable == "Y") {
                $('.cls-allow-share').show();
            }
            else {
                $('.cls-allow-share').hide();
            }
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                stagingCode += $(val).attr('data-checkedid') + ',';
            });
            stagingCode = stagingCode.slice(0, -1);
            $('#hdnStagingCode').val(stagingCode);
            $('#dvFileName').hide();
            $('#dvRetailsPrevious').show();
            $('#txtFileName').focus();
            $('#chkDwonload').attr('disabled', false); $('#chkShare').attr('checked', false); $('#chkEduMat').attr('checked', false); $('#chkDwonload').attr('checked', false);
        }
        else {
            $('#chkDwonload').attr('disabled', false);
            $('#dvFileName').show();
            if (ASSETS.defaults.Customer_Shareable == "Y") {
                $('.cls-allow-share').show();
            }
            else {
                $('.cls-allow-share').hide();
            }

            $('.cls-share-dis').show();
            $('#dvRetailsPrevious').hide();
            if (stagingCode == '') {
                stagingCode = $('input[type=checkbox].stagingcheck:checked').attr('data-checkedid')
            }
            $('#hdnStagingCode').val(stagingCode);
            var fileExt = $('input[type=checkbox].stagingcheck[data-checkedid=' + $('#hdnStagingCode').val() + ']').attr('file-ext');

            var selectedJson = jsonPath(ASSETS.defaults.Assigned_Assets_Json, "$.[?(@.DA_Code=="
                + stagingCode + ")]");
            if (selectedJson != false && selectedJson != undefined && selectedJson != null) {
                $('#txtFileName').val(selectedJson[0].DA_Name);
                $('#txtFileExt').html(selectedJson[0].File_Extension);
                $('#cboCategory').val(selectedJson[0].DA_Category_Code);
                $('#txtDesc').val(selectedJson[0].DA_Description);
                //$('.tagdetails').tokenInput("clear");
                $('.tagdetails').val('');
                var selectedtag = selectedJson[0].Tag_Name.split('~');

                //var selectedtag = Tags.split('~');
                if (ASSETS.defaults.Tags_Json != null) {
                    $.each(ASSETS.defaults.Tags_Json, function (idx, obj) {
                        $.each(selectedtag, function (idx, objtag) {
                            if (obj.Real_Tag_Name == objtag) {
                                select = { id: obj.Real_Tag_Name, name: obj.Real_Tag_Name };
                                $('.tagdetails').tokenInput("add", { "id": "" + obj.Real_Tag_Name + "", "name": "" + obj.Real_Tag_Name + "" });
                            }
                        });
                    });
                }
                if (selectedJson[0].ToDate != null && selectedJson[0].ToDate != undefined && selectedJson[0].ToDate != '') {
                    var date = selectedJson[0].ToDate;
                    $(".date-picker").datepicker("setDate", new Date(selectedJson[0].To_Date_Original));
                    //if (ASSETS.defaults.Date_Format.toUpperCase().indexOf('MMM') > -1) {
                    //    $('.date-picker').datepicker('update', moment(date + ' 12:00:00 AM', ASSETS.defaults.Date_Format.toUpperCase()).format("DD/MM/YYYY"));
                    //}
                    //else if (ASSETS.defaults.Date_Format.toUpperCase().match("^MM") != null) {
                    //    $('.date-picker').datepicker('update', moment(date + ' 12:00:00 AM', ASSETS.defaults.Date_Format.toUpperCase()).format("DD/MM/YYYY"));
                    //}
                    //else if (ASSETS.defaults.Date_Format.toUpperCase().match("^DD") != null) {
                    //    $('.date-picker').datepicker('update', moment(date + ' 12:00:00 AM', ASSETS.defaults.Date_Format.toUpperCase()).format("DD/MM/YYYY"));
                    //}
                    //else {
                    //    $('.date-picker').datepicker('update', moment(date + ' 12:00:00 AM', ASSETS.defaults.Date_Format.toUpperCase()).format("DD/MM/YYYY"));
                    //}
                }
                else {
                }
                if (selectedJson[0].Is_Downloadable == "Y") {
                    $('#chkDwonload').attr('checked', true);
                }
                else {
                    $('#chkDwonload').attr('checked', false);
                }
                if (selectedJson[0].Is_Customer_Sharable == "Y") {
                    $('#chkShare').attr('checked', true);
                }
                else {
                    $('#chkShare').attr('checked', false);
                }
                if (selectedJson[0].Is_Education_Material == 1) {
                    $('#chkEduMat').attr('checked', true);
                }
                else {
                    $('#chkEduMat').attr('checked', false);
                }

                $('#txtFileName').focus();
                if ($.inArray(fileExt.toLowerCase(), ASSETS.defaults.Share_Not_Allowed_Ext) > -1) {
                    $('#chkDwonload').attr('checked', true);
                    $('#chkDwonload').attr('disabled', 'disabled');
                }
            }
        }
        $('#txtFileName').focus();
        ShowModalPopup('dvFileProperty');
    },
    clearFileProperties: function () {
        $('#txtFileName').val('');
        $('#txtFileExt').html('');
        $('#cboCategory').val('');
        $('#txtDesc').val('');
        $('.tagdetails').tokenInput("clear");
        $('.tagdetails').val('');
        $('#txtExpDate').val('');
    },
    deleteAssetConfirm: function (stagingCode, daName) {
        $('.cls-delete-action .cls-foot-cancel').show();
        $('.cls-delete-action .cls-foot-upload').show();
        $('#dvDeleteSuccMsg').hide();
        if ($('input[type=checkbox].stagingcheck:checked').length > 1) {
            $('#dvDeleteMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/>You have selected multiple assets to retire. <br/><br/>To continue, click ok or click cancel. <br/><br/>');
        }
        else {
            if (daName != '') {
                $('#dvDeleteMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/>You have chosen  <b>' + daName + '</b> to retire <br/><br/>To continue, click ok or click cancel.');
            }
            else {
                $('#dvDeleteMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/>You have selected one asset to retire. <br/><br/>To continue, click ok or click cancel.');
            }
            $('#hdnStagingCode').val(stagingCode);
        }
        ShowModalPopup('dvDeleteAssetModal');
    },
    deleteAsset: function (stagingCode) {
        if ($('input[type=checkbox].stagingcheck:checked').length > 1) {
            var stagingCode = '';
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                    stagingCode += $(val).attr('data-checkedid') + ',';
                }
            });
            stagingCode = stagingCode.slice(0, -1);
            $('#hdnStagingCode').val(stagingCode);
        }
        else {
            if (stagingCode == '') {
                if ($('input[type=checkbox].stagingcheck:checked').attr('own-asset').toUpperCase() == "TRUE") {
                    stagingCode = $('input[type=checkbox].stagingcheck:checked').attr('data-checkedid')
                }
                else {
                    alert('You can retire only your own assets');
                    return;
                }
            }
            $('#hdnStagingCode').val(stagingCode);
        }
        var finalAssetId = ASSETS.getMyOwnAssetIds(stagingCode);
        if ($.trim(finalAssetId) == '') {
            alert('You can retire only your own assets');
            return;
        }
        else {
            HideModalPopup('dvAssetDetailsFull');
            $('#dvDeleteSuccMsg').html('Retiring the asset(s)...');
            $('#dvDeleteSuccMsg').show();
            $('.cls-delete-action .cls-foot-cancel').hide();
            $('.cls-delete-action .cls-foot-upload').hide();
            UploadServices.retireAsset(finalAssetId,
               function (result) {
                   ASSETS.bindSuccMessage(result);
               },
               function () {
                   ASSETS.onDeleteUnassignedFail();
               });
        }
    },
    bindSuccMessage: function (result) {
        $('#dvDeleteSuccMsg').html(result.Message_To_Display);
        ASSETS.getAssetGroupCount();
        HideModalPopup('dvDeleteAssetModal');
        ASSETS.showCommonMsg(result);
        ASSETS.reloadPage('');
        $('.cls-main-asset').removeClass('cls-el-selected').removeClass('cls-el-not-selected');
    },
    onDeleteUnassignedFail: function () {
        $('.cls-asset-action').unblock();
    },
    Closemodel: function () {
        HideModalPopup('dvAssetDetailsFull');
        HideModalPopup('dvDeleteAssetModal');
    },
    saveChangedFile: function () {
        if ($("#txtFile").get(0).files.length > 0) {
            $('#dvFileChangeMsg').html('Updating the asset(s) file...');
            $('#dvFileChangeMsg').show();
            $('#dvFileChange .cls-foot-cancel').hide();
            $('#dvFileChange .cls-foot-upload').hide();
            var data = new FormData();
            data.append("files", $("#txtFile").get(0).files[0]);
            UploadServices.changeFile($('#hdnStagingCode').val(), $("#txtFile").get(0).files[0].size, data,
                function (result) {
                    $('#dvFileMsg').html('');
                    ASSETS.saveFileSuccess(result);
                },
                function (result) {
                    $('#dvFileMsg').html(result.Message_To_Display);
                });
        }
        else {
            $('#dvFileMsg').html('Please select file');
        }
    },
    saveFileSuccess: function (res) {
        $('#dvFileChangeMsg').html(res.Message_To_Display);
        $('#txtAssetChange').val('');
        $("#txtFile").val('');
        $('#dvFileMsg').html('');
        //  $('#dvFileChangeMsg').html('');
        $('#dvFileChangeMsg').hide();
        $('#dvFileChange .cls-foot-cancel').show();
        $('#dvFileChange .cls-foot-upload').show();
        ASSETS.showCommonMsg(res);
        HideModalPopup('dvFileChange');
        ASSETS.reloadPage('');
    },
    showFileChange: function (input) {

        if ($.browser.msie) {
            var imgUrl = $('#txtFile').val().replace(/C:\\fakepath\\/i, '');
            if (imgUrl != '') {
                var fileName = $('#txtFile').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var arFileName = $('#txtFile').val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
                arFileName.reverse();
                if ($.inArray(arFileName[0].toUpperCase(), ASSETS.defaults.file_Accepted_Extension) > -1) {
                    $('#txtAssetChange').val(fileName);
                    $('#dvFileMsg').html('');
                }
                else {
                    $('#txtAssetChange').val('');
                    $("#txtFile").val('');
                    $('#dvFileMsg').html('Please select valid file.');
                }
            }
            else {
                $('#dvFileMsg').html('Please select file.');
                $('#txtAssetChange').val('');
                $("#txtFile").val('');
            }
        }
        else {
            //var input = $('#txtSurImg');
            if (input.files && input.files[0]) {
                var arFileName = $('#txtFile').prop("files")[0].name.split('.');
                var fileNameAlone = arFileName[0];
                arFileName.reverse();
                if ($.inArray(arFileName[0].toUpperCase(), ASSETS.defaults.file_Accepted_Extension) > -1) {
                    var filerdr = new FileReader();
                    filerdr.onload = function (e) {
                    }
                    filerdr.readAsDataURL(input.files[0]);
                    $('#txtAssetChange').val($('#txtFile').prop("files")[0].name);
                    $('#dvFileMsg').html('');
                }
                else {
                    $('#dvFileMsg').html('Please select valid file.');
                    $('#txtAssetChange').val('');
                    $("#txtFile").val('');
                }
            }
            else {
                $('#dvFileMsg').html('Please select file.');
                $('#txtAssetChange').val('');
                $("#txtFile").val('');
            }
        }
    },
    assignToAllUsersPopUp: function (daCode) {
        $('#dvAssignAllSuccMsg').hide();
        $('#dvAssignToAll .cls-foot-cancel').show();
        $('#dvAssignToAll .cls-foot-upload').show();
        // $('#dvAssignToAll').modal('show');
        ShowModalPopup('dvAssignToAll');
        $('#dvAssignAllMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/>Do you want to assign the selected assets to all the users. <br/><br/>To continue, click ok or click cancel. ');
        $('#dvAssignToAll .cls-foot-upload').unbind('click').bind('click', function () {
            ASSETS.assignToAllUsers(daCode);
        });
        $('#dvAssignToAll .cls-foot-cancel').unbind('click').bind('click', function () {
            // $('#dvAssignToAll').modal('hide');
            HideModalPopup('dvAssignToAll');
        });
    },
    assignToAllUsers: function (daCode) {
        var assetId = "";
        if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
            $('#hdnStagingCode').val(daCode);
            assetId = $('#hdnStagingCode').val() + ",";
        }
        else {
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                    assetId += $(val).attr('data-checkedid') + ',';
                }
            });
        }
        assetId = assetId.slice(0, -1);
        // var userArray = new Array();
        $('#hdnStagingCode').val(assetId);
        var ar = new Array();
        ar.push(assetId);
        if (assetId != '') {
            $('#dvAssignAllSuccMsg').html('Sharing to all users. Please wait...');
            $('#dvAssignAllSuccMsg').show();
            $('#dvAssignToAll .cls-foot-cancel').hide();
            $('#dvAssignToAll .cls-foot-upload').hide();
            UploadServices.assignToAllUsers($('#hdnStagingCode').val(), $('#hdnStagingCode').val().split(',').length, ar,
                function (result) {
                    ASSETS.bindAssignToAllSuccess(result);
                },
                function (result) {
                });
        }
        else {
        }
    },
    bindAssignToAllSuccess: function (result) {
        $('#dvAssignAllSuccMsg').html(result.Message_To_Display);
        $('#dvAssignAllSuccMsg').show();
        $('#dvAssignToAll .cls-foot-cancel').hide();
        $('#dvAssignToAll .cls-foot-upload').hide();
        HideModalPopup('dvAssignToAll');
        ASSETS.getAssetGroupCount();
        ASSETS.reloadPage('');
    },
    showFilters: function () {
        ASSETS.filterEl = new Filter({
            selectedAssets: ASSETS.filterSelection, isUnassign: false,
            userId: UploadServices.userId, onfilterselected: function () {
                ASSETS.filterEl.hide();
                ASSETS.defaults.Asset_Page_No = 1;
                $('#dvUnassigned').html('');
                $('.cls-asset-action').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            }
        });
        ASSETS.filterEl.show();
    },
    getAllActiveUsers: function () {
        UploadServices.getAllActiveDistictUsers(
             function (result) {
                 ASSETS.showQuickShare(result);
             },
             function (result) {
             });
    },
    showQuickShare: function (allUserJson) {
        ASSETS.defaults.Is_First_Time_Share_Open = 1;
        $('.cls-foot-cancel').show();
        $('.cls-foot-upload').show();
        $('#dvShareSucMsg').hide();
        var content = "";
        var data = new Array();
        var result = allUserJson;
        content = "[";
        for (var i = 0; i < result.length; i++) {
            content += "{id:\"" + result[i].User_Id + "\",name:\"" + result[i].Employee_Name + "\"},";
        }
        content = content.slice(0, -1) + "]";
        if (result.length == 0) {
            content = "[]";
        }
        data = eval('(' + content + ')');

        $('#txtQuickShare').prev().detach();
        $(".token-input-list-facebook").prev().detach();
        $('#txtQuickShare').tokenInput([data], {
            theme: "facebook",
            allowFreeTagging: false,
            preventDuplicates: true
        });
        $('#dvQuickShare .cls-foot-upload').unbind('click').bind('click', function () {
            ASSETS.ShareAssets();
        });
        $('#dvQuickShare .cls-foot-cancel').unbind('click').bind('click', function () {
            HideModalPopup('dvQuickShare');
        });
        ShowModalPopup('dvQuickShare');
    },
    ShareAssets: function () {
        var users = $('#txtQuickShare').val();
        if ($.trim(users) == '') {
            $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/>Please select atleast any one user to assign');
            ShowModalPopup('dvCommonMsgModal');
            return;
        }
        else {
            $('.cls-foot-cancel').hide();
            $('.cls-foot-upload').hide();
            $('#dvShareSucMsg').show();
            $('#dvShareSucMsg').html('Assigning the assets to the selected users');
            var noOfAssets = $('#hdnStagingCode').val().split(',').length;
            var finalAssetId = ASSETS.getMyOwnAssetIds($('#hdnStagingCode').val());
            if ($.trim(finalAssetId) == '') {
                alert('you can share your own assets only');
                return;
            }
            else {
                daCode_g = finalAssetId;
                noOfAssets_g = finalAssetId.split(',').length;
                var userAr = new Array();
                var finalAr = new Array();
                finalAr.push(daCode_g);
                finalAr.push(users);
                UploadServices.insertAssetUserShared(1, false, finalAr, function (result) { ASSETS.shareAssetSuccess(result) }, function (result) { $('#dvShareSucMsg').html(result); });
                //UploadServices.assignToAllUsers($('#hdnStagingCode').val(), $('#hdnStagingCode').val().split(',').length, users,
                // function (result) {
                //     ASSETS.shareAssetSuccess(result);
                // },
                // function (result) {
                //     ASSETS.assignUsersFailure();
                // });
            }
        }
    },
    shareAssetSuccess: function (res) {
        if (res) {
            $('#dvShareSucMsg').html('Asset successfully mapped to the selective users');
            $('#txtQuickShare').val('');
            HideModalPopup('dvQuickShare');
            //$('.cls-asset-action').block({
            //    message: 'Processing...',
            //    css: { border: '2px solid #DDD' }
            //});
            //setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            ASSETS.getAssetGroupCount();
            ASSETS.reloadPage('');
        }
        else {
            $('#dvShareSucMsg').html('Error occured while assigning the assets to the user.Please try again');
        }
    },
    assignUsersFailure: function (result) {
        $('#dvShareSucMsg').html(result);
    },
    getAssigendUsersForSelectedAsset: function (id) {
        ASSETS.defaults.User_Page_No = 1;
        $('.userlistdetFull').html('');
        $('.userlistdet').html('');
        $('#dvUnassigned').block({
            message: 'Processing...',
            css: { border: '2px solid #DDD' }
        });
        $('#hdnStagingCode').val(id);
        var ar = new Array();
        ar.push(id);
        UploadServices.getAssetDetailsByAssetId(ar,
            function (result) {
                ASSETS.showAssignedAssetUsers(result);
            },
            function (result) {

            });
    },
    showAssignedAssetUsers: function (res) {
        var html = "<div class='silderWrapper'></div>";
        $('body').append(html);
        $.each(res, function (Index, itemresult) {
            $('.da-thumb').attr("src", itemresult.DA_Thumbnail_URL);
            var daName = '';
            if (itemresult.DA_Name.length > 20) {
                daName = itemresult.DA_Name.substring(0, 20) + '...';
            }
            else {
                daName = itemresult.DA_Name
            }
            $(".da_name").text(daName);
            $(".spn_da_name").text(itemresult.DA_Name);
            $('.da_namefull').text(daName);
            $(".spn_da_namefull").text(itemresult.DA_Name);
            $("#assetid").val(itemresult.DA_Code);
            var catName;
            if (itemresult.DA_Category_Name.length > 20) {
                catName = itemresult.DA_Category_Name.substring(0, 20) + '...';
            }
            else {
                catName = itemresult.DA_Category_Name
            }
            $(".da-category").text(catName);
            $('.da-categoryfull').text(catName);
            $('.spn_da-category').text(itemresult.DA_Category_Name);
            $('.spn_da-categoryfull').text(itemresult.DA_Category_Name);
            $(".da-category").attr({ "data-cat": itemresult.DA_Category_Code });
            $(".da-categoryfull").attr({ "data-cat": itemresult.DA_Category_Code });
            var description;
            if (itemresult.DA_Description.length > 200) {
                description = itemresult.DA_Description.substring(0, 200) + '...';
            }
            else {
                description = itemresult.DA_Description
            }
            $(".da-description").text(description);
            $('.spn_da-description').text(itemresult.DA_Description);
            $(".da-uploadedname").text(itemresult.Uploaded_By_Name);
            $(".da-uploadeddate").text(itemresult.Uploaded_Date);
            $(".starcnt").text(itemresult.Star_Count);
            $(".viewcnt").text(itemresult.Views_Count);
            $(".likecnt").text(itemresult.Likes_Count);
            $('.post-popup-desc .cls-size').text(itemresult.DA_Size_In_MB);
            if (itemresult.Is_Downloadable == "Y") {
                $('.post-popup-desc .cls-ass-download').html('<i class="fa fa-download"></i>');
            }
            else {
                $('.post-popup-desc .cls-ass-download').html('<i class="fa fa-globe"></i>');
            }
            if (itemresult.Is_Customer_Sharable == "Y") {
                $('.post-popup-desc .cls-ass-share').html('<i class="fa fa-share-alt"></i>');
            }
            else {
                $('.post-popup-desc .cls-ass-share').html('');
            }

            var tag = itemresult.Tag_Name.split('~');
            $(".da-tags").empty();
            $(".da-tags").attr({ 'data-tagid': itemresult.Tag_Name });
            $.each(tag, function (Index, item) {
                $(".da-tags").append("<span class='label label-default' style='margin-right:5px'><i class='fa fa-tag'></i>" + item + "</span>");
            });
            var image = ASSETS.getFileExtension(itemresult.DA_File_Name);
            $('.imgAssignedThum').attr('src', '../../Areas/HDNextGen/Content/AssetUpload/doctype/' + image);

            $(".userlistdet").empty();
            $(".userfulllistdet").empty();
            //var content = "";
            //var fullContent = "";

            ASSETS.getAssignedAssetMappedUsers();
            // ASSETS.bindAssetMappedUsers(itemresult.Users_Mapped);

        });
        ASSETS.bindSlideEvents();
    },
    getAssignedAssetMappedUsers: function () {

        var searchText = '';
        if ($.trim($('#txtUserSearchFull').val()) == '') {
            searchText = 'null';
        }
        else {
            searchText = $.trim($('#txtUserSearchFull').val());
        }
        UploadServices.getUsersMappedToAssetsByAssetIdWithPaging($('#hdnStagingCode').val(), ASSETS.defaults.User_Page_No, ASSETS.defaults.User_Page_Size, searchText,
          function (result) {
              ASSETS.bindAssetMappedUsers(result);
          }, function (result) {
              ASSETS.onFail();
          });

    },
    bindSlideEvents: function () {
        $('.editname').unbind('click').bind('click', function () {
            ASSETS.editName(this);
        });
        $('.editdesc').unbind('click').bind('click', function () {
            ASSETS.editDesc(this);
        });
        $('.edittag').unbind('click').bind('click', function () {
            ASSETS.editTags(this);
        });
        $('.editcategory').unbind('click').bind('click', function () {
            ASSETS.editCategory();
        });
        $('.savename').unbind('click').bind('click', function () {
            ASSETS.saveDAName(this);
        });
        $('.savecategory').unbind('click').bind('click', function () {
            ASSETS.saveEditedCategory();
        });
        $('.savedesc').unbind('click').bind('click', function () {
            ASSETS.saveDesc();
        });
        $('.savetag').unbind('click').bind('click', function () {
            ASSETS.saveEditedTags(this);
        });
        $('.editnamefull').unbind('click').bind('click', function () {
            ASSETS.editNameFullView(this);
        });
        $('.editdescfull').unbind('click').bind('click', function () {
            ASSETS.editDescFullView(this);
        });
        $('.edittagfull').unbind('click').bind('click', function () {
            ASSETS.editTagsFullView(this);
        });
        $('.editcategoryfull').unbind('click').bind('click', function () {
            ASSETS.editCategoryFullView();
        });
        $('.savenamefull').unbind('click').bind('click', function () {
            ASSETS.saveDANameFullView(this);
        });
        $('.savecategoryfull').unbind('click').bind('click', function () {
            ASSETS.saveEditedCategoryFullView();
        });
        $('.savedescfull').unbind('click').bind('click', function () {
            ASSETS.saveDescFullView();
        });
        $('.savetagfull').unbind('click').bind('click', function () {
            ASSETS.saveEditedTagsFullView(this);
        });
        slider2.slideReveal("show", false);
        $('#slider2').show()
        $("#slidehide").click(function () {
            slider2.slideReveal("hide", false);
            $('.silderWrapper').remove();
            $('#slider2').hide();
        });
        $('.btn-ass-delete').unbind('click').bind('click', function () {
            //ASSETS.deleteAssetConfirm($('#hdnStagingCode').val());
            //slider2.slideReveal("hide", false);
            //$('.silderWrapper').remove();
            if (confirm('Do you want to retire this asset')) {
                ASSETS.deleteAsset($('#hdnStagingCode').val());
            }
        });
        $('.btn-ass-assign').unbind('click').bind('click', function () {
            //ASSETS.assignToAllUsersPopUp($('#hdnStagingCode').val());
            //$('#dvAssetDetailsFull').modal('hide');
            HideModalPopup('dvAssetDetailsFull');
            var stagingCode = "";
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                stagingCode = $('#hdnStagingCode').val() + ",";
                noOfAssets_g = 1;
            }
            else {
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        stagingCode += $(val).attr('data-checkedid') + ',';
                    }
                });
                if (stagingCode == null || stagingCode == undefined || stagingCode == '') {
                    stagingCode = $('#hdnStagingCode').val() + ',';
                    noOfAssets_g = 1;
                }
                else {
                    noOfAssets_g = $('input[type=checkbox].stagingcheck:checked').length;
                }
            }
            if (stagingCode.slice(0, -1) != '') {
                $('#hdnStagingCode').val(stagingCode.slice(0, -1));
                daCode_g = stagingCode.slice(0, -1);
                $('#dvAssign').html('');
                ShowModalPopup('dvAssignAssetModal');
                $('#dvAssign').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () {
                    //USER_ASSIGNMENT.getDivisions();
                    USER_ASSIGNMENT.getAllActiveUsers();
                }, 10);
            }

        });
        $('.cls-user-editlnk').unbind('click').bind('click', function () {
            var stagingCode = "";
            if ($('input[type=checkbox].stagingcheck:checked').length == 0) {
                stagingCode = $('#hdnStagingCode').val() + ",";
                noOfAssets_g = 1;
            }
            else {
                $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                    if ($(val).attr('own-asset').toUpperCase() == "TRUE") {
                        stagingCode += $(val).attr('data-checkedid') + ',';
                    }
                });
                noOfAssets_g = $('input[type=checkbox].stagingcheck:checked').length;
            }
            if (stagingCode.slice(0, -1) != '') {
                $('#hdnStagingCode').val(stagingCode.slice(0, -1));
                daCode_g = stagingCode.slice(0, -1);
                slider2.slideReveal("show", false);
                $('#dvAssign').html('');
                ShowModalPopup('dvAssignAssetModal');
                $('#dvAssign').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () {
                    //USER_ASSIGNMENT.getDivisions();
                    USER_ASSIGNMENT.getAllActiveUsers();
                }, 10);
            }
            else {
                //alert('Please select any one asset');
                $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select any one asset');
                ShowModalPopup('dvCommonMsgModal');
            }

            // $('#dvAssignAssetModal').modal('show');
        });
        $('#dvAssetDetailsFull .cls-collapse').unbind('click').bind('click', function () {

            slider2.slideReveal("show", false);
            $('#slider2').show();
            var html = "<div class='silderWrapper'></div>";
            $('body').append(html);
            //$('#dvAssetDetailsFull').modal('hide');
            HideModalPopup('dvAssetDetailsFull');

        });
        slider2.getNiceScroll().resize();

        $('.nameunedit').show();
        $('.nameedit').hide();
        $('.editname').show();
        $('.savename').hide();

        $('.categoryunedit').show();
        $('.categoryedit').hide();
        $('.editcategory').show();
        $('.savecategory').hide();

        $('.descunedit').show();
        $('.descedit').hide();
        $('.editdesc').show();
        $('.savedesc').hide();

        $('.tagunedit').show();
        $('.tagedit').hide();
        $('.edittag').show();
        $('.savetag').hide();

        $('.nameuneditfull').show();
        $('.nameeditfull').hide();
        $('.editnamefull').show();
        $('.savenamefull').hide();

        $('.categoryuneditfull').show();
        $('.categoryeditfull').hide();
        $('.editcategoryfull').show();
        $('.savecategoryfull').hide();

        $('.descuneditfull').show();
        $('.desceditfull').hide();
        $('.editdescfull').show();
        $('.savedescfull').hide();

        $('.taguneditfull').show();
        $('.tageditfull').hide();
        $('.edittagfull').show();
        $('.savetagfull').hide();
        $('#dvUnassigned').unblock();
    },
    bindAssetMappedUsers: function (itemresult) {
        if (itemresult.length > 0) {
            ASSETS.defaults.loading = false;
        }
        ASSETS.defaults.Assigned_Users = itemresult
        var content = ""; var fullContent = "";
        var i = 0;
        $.each(itemresult, function (index, useritem) {
            i++;

            var bg = '';
            if (index % 2 == 0) {
                bg = 'cls-user-alt-bg';
            }
            var imgUrl = useritem.Profile_Photo_BLOB_URL;
            var userName = '';

            if (useritem.Employee_Name.length > 10) {
                userName = useritem.Employee_Name.substring(0, 10) + '...';
            }
            else {
                userName = useritem.Employee_Name;
            }
            if (i < 10) {
                content += "<div class='col-xs-12 cls-padding-none cls-usergroup-list " + bg + "'>";
                content += "<div class='col-xs-3'>";
                content += "<a href='#'>";

                if (imgUrl != '' && imgUrl != null && imgUrl != undefined) {
                    content += "<img src='" + imgUrl + "'></a>";
                }
                else {
                    content += "<img src='../../Areas/HDNextGen/Content/images/profile-pic.jpg'></a>";
                }
                // content += "<img src='../../Images/profile-pic.jpg'></a>";
                content += "</div>";
                content += "<div class='col-xs-9'><p>" + userName + "</p><p>" + useritem.Region_Name.substring(0, 10) + "</p></div><div class='clearfix'></div>";
                content += "</div>";
            }
            fullContent += "<div class='cls-padding-none cls-usergroup-list-full " + bg + "'>";
            if (useritem.Employee_Name.length > 14) {
                userName = useritem.Employee_Name.substring(0, 14) + '...';
            }
            else {
                userName = useritem.Employee_Name;
            }
            fullContent += "<a href='#'>";
            if (imgUrl != '' && imgUrl != null && imgUrl != undefined) {
                fullContent += "<img src='" + imgUrl + "'></a>";
            }
            else {
                fullContent += "<img src='../../Areas/HDNextGen/Content/images/profile-pic.jpg'></a>";
            }
            fullContent += "<div class=''><p title=" + useritem.Employee_Name + ">" + userName + "</p><p title=" + useritem.Region_Name + ">" + useritem.Region_Name.substring(0, 14) + "</p></div><div class='clearfix'></div>";
            fullContent += "</div>";
            //$(".userlistdet").append("<div class='col-xs-6 '><div class=''><div class=''><div class=''><a href='#'> <img  src=''></a></div><div class=''>" + useritem.Employee_Name + "</div></div></div></div>");

            // $(".userlistdet").niceScroll();


            // $('.userlistdetFull').niceScroll();
            // $(".userlistdet").getNiceScroll().resize();
            // $('.userlistdetFull').getNiceScroll().resize();

        });
        if (ASSETS.defaults.User_Page_No == 1) {
            $(".userlistdet").html(content);
            if (itemresult.length > 9) {
                $(".userlistdet").append("<a href='#' onclick='ShowModalPopup(\"dvAssetDetailsFull\");' style='float:right;  padding-top: 12px; padding-right: 25px;text-decoration: underline;'>More...</a>");
            }
        }
        $(".userlistdetFull").append(fullContent);
        $('.cls-details-scroll').niceScroll();
        if (itemresult.length == 0) {
            if (ASSETS.defaults.User_Page_No == 1) {
                $(".userlistdet").html('Users are not assigned');
                $(".userlistdetFull").html('Users are not assigned');
                $(".userlistdet").addClass('user-empty');
                $(".userlistdetFull").addClass('user-empty');
            }
        }
        else {
            $(".userlistdet").removeClass('user-empty');
            $(".userlistdetFull").removeClass('user-empty');
        }
        $('#btnUserSearch').unbind('click').bind('click', function () {
            $('.userlistdet').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.searchUserDetails($('#txtUserSearch').val()); }, 10);
        });
        $('#btnUserSearchFull').unbind('click').bind('click', function () {
            $('.userlistdetFull').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            ASSETS.defaults.User_Page_No = 1;
            $('.userlistdetFull').html('');
            setTimeout(function () { ASSETS.getAssignedAssetMappedUsers(); }, 10);
        });
        //$('#btnUserSearchFull').unbind('click').bind('click', function () {
        //    $('.userlistdetFull').block({
        //        message: 'Processing...',
        //        css: { border: '2px solid #DDD' }
        //    });
        //    setTimeout(function () { ASSETS.searchUserDetails($('#txtUserSearchFull').val()); }, 10);
        //});
        $("#txtUserSearch").unbind('keydown').bind('keydown', function (e) {
            if (e.keyCode == 13) {
                $('#btnUserSearch').click();
            }
        });
        $("#txtUserSearchFull").unbind('keydown').bind('keydown', function (e) {
            if (e.keyCode == 13) {
                $('#btnUserSearchFull').click();
            }
        });
        slider2.getNiceScroll().resize();
        $('.userlistdet').unblock();
        $('.userlistdetFull').unblock();
        // $('.cls-details-scroll').niceScroll();
        $('.cls-details-scroll').getNiceScroll().resize();
        $('.userlistdetFull').on('scroll', function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {

                //if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (!ASSETS.defaults.loading) {
                    ASSETS.defaults.loading = true;
                    ASSETS.defaults.User_Page_No = parseInt(ASSETS.defaults.User_Page_No) + 1;
                    ASSETS.getAssignedAssetMappedUsers();
                }
            }
        })
    },
    searchUserDetails: function (val) {
        if ($.trim(val) != '') {
            var searchText = $.trim(val).toLowerCase();
            var disJson = new Array();
            for (var i = 0; i < ASSETS.defaults.Assigned_Users.length; i++) {
                if (ASSETS.defaults.Assigned_Users[i].Employee_Name.toLowerCase().indexOf(searchText) > -1) {
                    disJson.push(ASSETS.defaults.Assigned_Users[i]);
                }
            }
            if (disJson.length > 0) {
                ASSETS.bindAssetMappedUsers(disJson);
                $(".userlistdet").removeClass('user-empty');
                $(".userlistdetFull").removeClass('user-empty');
            }
            else {
                $(".userlistdet").html('No such users found');
                $(".userlistdetFull").html('No such users found');
                $(".userlistdet").addClass('user-empty');
                $(".userlistdetFull").addClass('user-empty');
            }
        }
        else {
            ASSETS.bindAssetMappedUsers(ASSETS.defaults.Assigned_Users);
        }
    },
    editName: function (obj) {
        $(obj).parent().parent().find('.nameedit').show();
        $(obj).parent().parent().find('.nameunedit').hide();
        $(obj).parent().parent().find('.nameedit').find('input').val($(obj).parent().parent().find('.nameunedit').find('label').text());
        $('.savename').show();
    },
    editDesc: function (obj) {
        $(obj).parent().parent().parent().find('.descedit').show();
        $(obj).parent().parent().parent().find('.descunedit').hide();
        //  $(obj).parent().find('.savedesc').show();
        $(obj).parent().parent().parent().find('.descedit').find('textarea').text($(obj).parent().parent().parent().find('.descunedit').find('p').text());
        $(obj).css({ "display": "none" });
        $('.savedesc').show();
    },
    editTags: function (obj) {
        $(obj).parent().parent().parent().find('.tagedit').css({ "display": "block" });
        $(obj).parent().parent().parent().find('.tagunedit').css({ "display": "none" });
        $(obj).parent().find('.savetag').show();
        var select = {};
        var tagfilter = $(obj).parent().parent().parent().find('.tagunedit').find('span').attr('data-tagid');
        var selectedtag = tagfilter.split('~');
        var content = "";
        var data = new Array();
        var result = ASSETS.defaults.Tags_Json;
        content = "[";
        for (var i = 0; i < result.length; i++) {
            content += "{id:\"" + result[i].Real_Tag_Name + "\",name:\"" + result[i].Real_Tag_Name + "\"},";
        }
        content = content.slice(0, -1) + "]";
        if (result.length == 0) {
            content = "[]";
        }
        data = eval('(' + content + ')');

        $('.Tagdetails').prev().detach();
        $(".token-input-list-facebook").prev().detach();
        $('.Tagdetails').tokenInput([data], {
            theme: "facebook",
            allowFreeTagging: true,
            preventDuplicates: true,
            // searchingText: 'Please press enter to accept the tag...',
        });
        $('.tagdetailsfull').prev().detach();
        $(".token-input-list-facebook").prev().detach();
        $('.tagdetailsfull').tokenInput([data], {
            theme: "facebook",
            allowFreeTagging: true,
            preventDuplicates: true,
            // searchingText: 'Please press enter to accept the tag...',
        });

        $.each(result, function (idx, obj) {
            $.each(selectedtag, function (idx, objtag) {
                if (obj.Real_Tag_Name == objtag) {
                    select = { id: obj.Real_Tag_Name, name: obj.Real_Tag_Name };
                    $('.Tagdetails').tokenInput("add", { "id": "" + obj.Real_Tag_Name + "", "name": "" + obj.Real_Tag_Name + "" });
                    $('.tagdetailsfull').tokenInput("add", { "id": "" + obj.Real_Tag_Name + "", "name": "" + obj.Real_Tag_Name + "" });
                }
            });
        });
        $(obj).css({ "display": "none" });
    },
    editCategory: function (obj) {
        $('.categoryedit').show();
        $('.categoryunedit').hide();
        $('.categoryedit .categoryload option').remove();
        //$('.categoryload .option').remove();
        var res = ASSETS.defaults.Assigned_Category_Json;
        $.each(res, function (Index, itemresult) {
            // var value = "\"" + itemresult.DA_Category_Code + "\"";
            if ($('.spn_da-category').text().toUpperCase() == itemresult.DA_Category_Name.toUpperCase()) {
                $('.categoryedit .categoryload').append("<option value=" + itemresult.DA_Category_Code + " selected='selected'>" + itemresult.DA_Category_Name + "</option>");
            }
            else {
                $('.categoryedit .categoryload').append("<option value=" + itemresult.DA_Category_Code + ">" + itemresult.DA_Category_Name + "</option>");
            }
        });
        $('.savecategory').show();
        //$(obj).parent().parent().find(".categoryedit").find('select').val($(obj).parent().parent().find('.categoryunedit').find('label').attr('data-cat'));
    },
    saveDAName: function (obj) {
        var assetname = $(obj).parent().parent().find('.nameedit').find('input').val();
        var assetid = $("#assetid").val();

        var obj = {};
        obj.DA_Name = assetname;
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateAssetName(obj, function (result) {
            ASSETS.saveNameSuccess(result);
        }, function (result) {

        });
    },
    saveNameSuccess: function (res) {
        if (res.Transaction_Status == true) {
            var name = $('.nameedit').find('input').val();
            if (name.length > 15) {
                $('.nameunedit').find('label').text(name.substring(0, 15) + '...');
                $('.nameuneditfull').find('label').text(name.substring(0, 15) + '...');
            }
            $('.spn_da_namefull').text(name);
            $('.spn_da_name').text(name);
        }
        $('.nameedit').hide();
        $('.nameunedit').show();
    },
    saveEditedCategory: function (obj) {
        var assetcategoryid = $('.categoryedit').find('select').val();
        var assetcategory = $('.categoryedit').find('select :selected').text();
        if ($('.categoryedit').find('select').val().toUpperCase() == "SELECT") {
            // alert('Please select valid category');
            $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select valid category');
            ShowModalPopup('dvCommonMsgModal');
            return;
        }
        var assetid = $("#assetid").val();

        var obj = {};
        obj.DA_Category_Code = assetcategoryid;
        obj.DA_Category_Name = assetcategory;
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateAssetCategory(obj, function (result) {
            ASSETS.saveEditedCategorySuccess(result);
        },
        function (result) {
        });
    },
    saveEditedCategorySuccess: function (res) {
        if (res.Transaction_Status = true) {
            var category = $('.categoryedit').find('select :selected').text();
            var catId = $('.categoryedit').find('select').val();
            $('.categoryunedit').find('label').text(category);
            $('.categoryuneditfull').find('label').text(category);
            // $(".da-category").attr({ "data-cat": $('.categoryedit').find('select :selected').text() });
            $('.categoryload').val(catId);
            $('.categoryloadfull').val(catId);
        }
        $('.categoryedit').hide();
        $('.categoryunedit').show();
    },
    saveDesc: function (obj) {
        $(obj).css({ 'display': 'none' });
        var assetdesc = $('.descedit').find('textarea').val();
        var assetid = $("#assetid").val();

        var obj = {};
        obj.DA_Description = encodeURIComponent(assetdesc);
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateDesc(obj, function (result) { ASSETS.saveDescSuccess(result) }, function (result) { });
    },
    saveDescSuccess: function (res) {
        if (res.Transaction_Status = true) {
            var desc = $('.descedit').find('textarea').val();
            $('.descunedit').find('p').text(desc);
            $('.descuneditfull').find('p').text(desc);
        }
        $('.savedesc').hide();
        $('.editdesc').show();
        $('.descedit').hide()
        $('.descunedit').show();
    },
    saveEditedTags: function (obj) {
        var assettag = $(obj).parent().parent().parent().find('.tagedit').find('.Tagdetails').val().replace(/,/g, '~');;
        var assetid = $("#assetid").val();
        $(obj).parent().find('.edittag').show();
        $('.savetag').hide();

        var obj = {};
        obj.Tags = assettag;
        obj.Target_Asset_Ids = assetid
        UploadServices.updateAssetTags(obj, function (result) { ASSETS.saveEditedTagsSuccess(result) }, function (result) { });
    },
    saveEditedTagsSuccess: function () {
        var tags = $('.tagedit').find('.Tagdetails').val().split(',');
        $(".da-tags").html('');
        $.each(tags, function (Index, item) {
            $(".da-tags").append("<span class='label label-default' style='margin-right:5px'><i class='fa fa-tag'></i>" + item + "</span>");
        });
        $('.tagedit').hide();
        $('.tagunedit').show();
    },
    editNameFullView: function (obj) {
        $(obj).parent().parent().find('.nameeditfull').css({ "display": "block" });
        $(obj).parent().parent().find('.nameuneditfull').css({ "display": "none" });
        $(obj).parent().parent().find('.nameeditfull').find('input').val($('.spn_da_namefull').html());
        $('.savenamefull').show();
    },
    editDescFullView: function (obj) {
        $(obj).parent().parent().parent().find('.desceditfull').css({ "display": "block" });
        $(obj).parent().parent().parent().find('.descuneditfull').css({ "display": "none" });
        $(obj).parent().find('.savedescfull').show();
        $(obj).parent().parent().parent().find('.desceditfull').find('textarea').text($(obj).parent().parent().parent().find('.descuneditfull').find('span').text());
        $(obj).css({ "display": "none" });
        $('.savedescfull').show();
    },
    editTagsFullView: function (obj) {
        $(obj).parent().parent().parent().find('.tageditfull').css({ "display": "block" });
        $(obj).parent().parent().parent().find('.taguneditfull').css({ "display": "none" });
        $(obj).parent().find('.savetagfull').show();
        var select = {};
        var tagfilter = $('.tagsuneditfull').attr('data-tagid');
        var selectedtag = tagfilter.split('~');
        var content = "";
        var data = new Array();
        var result = ASSETS.defaults.Tags_Json;
        content = "[";
        for (var i = 0; i < result.length; i++) {
            content += "{id:\"" + result[i].Real_Tag_Name + "\",name:\"" + result[i].Real_Tag_Name + "\"},";
        }
        content = content.slice(0, -1) + "]";
        if (result.length == 0) {
            content = "[]";
        }
        data = eval('(' + content + ')');

        $('.tagdetailsfull').prev().detach();
        $(".token-input-list-facebook").prev().detach();
        $('.tagdetailsfull').tokenInput([data], {
            theme: "facebook",
            allowFreeTagging: true,
            preventDuplicates: true,
            // searchingText: 'Please press enter to accept the tag...',
        });

        $.each(result, function (idx, obj) {
            $.each(selectedtag, function (idx, objtag) {
                if (obj.Real_Tag_Name == objtag) {
                    select = { id: obj.Real_Tag_Name, name: obj.Real_Tag_Name };
                    $('.tagdetailsfull').tokenInput("add", { "id": "" + obj.Real_Tag_Name + "", "name": "" + obj.Real_Tag_Name + "" });
                }
            });
        });
        $(obj).css({ "display": "none" });
    },
    editCategoryFullView: function (obj) {
        $('.categoryeditfull').show();
        $('.categoryuneditfull').hide();
        $('.categoryeditfull .categoryload option').remove();
        var res = ASSETS.defaults.Assigned_Category_Json;
        $.each(res, function (Index, itemresult) {
            // var value = "\"" + itemresult.DA_Category_Code + "\"";
            if ($('.spn_da-categoryfull').text().toUpperCase() == itemresult.DA_Category_Name.toUpperCase()) {
                $('.categoryeditfull .categoryload').append("<option value=" + itemresult.DA_Category_Code + " selected='selected'>" + itemresult.DA_Category_Name + "</option>");
            }
            else {
                $('.categoryeditfull .categoryload').append("<option value=" + itemresult.DA_Category_Code + ">" + itemresult.DA_Category_Name + "</option>");
            }
        });
        $('.savecategoryfull').show();
        //$(obj).parent().parent().find(".categoryedit").find('select').val($(obj).parent().parent().find('.categoryunedit').find('label').attr('data-cat'));
    },
    saveDANameFullView: function (obj) {
        var assetname = $(obj).parent().parent().find('.nameeditfull').find('input').val();
        var assetid = $("#assetid").val();
        //UpdateAssetNameOfAssignedAsset
        var obj = {};
        obj.DA_Name = assetname;
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateAssetName(obj, function (result) {
            ASSETS.saveNameSuccessFullView(result);
        }, function (result) {

        });
    },
    saveNameSuccessFullView: function (res) {
        if (res.Transaction_Status == true) {
            var name = $('.nameeditfull').find('input').val();
            if (name.length > 15) {
                $('.nameunedit').find('label').text(name.substring(0, 15) + '...');
                $('.nameuneditfull').find('label').text(name.substring(0, 15) + '...');
            }
            $('.spn_da_namefull').text(name);
            $('.spn_da_name').text(name);
        }
        $('.nameeditfull').hide();
        $('.nameuneditfull').show();
    },
    saveEditedCategoryFullView: function (obj) {
        var assetcategoryid = $('.categoryeditfull').find('select').val();
        var assetcategory = $('.categoryeditfull').find('select :selected').text();
        var assetid = $("#assetid").val();

        var obj = {};
        obj.DA_Category_Code = assetcategoryid;
        obj.DA_Category_Name = assetcategory;
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateAssetCategory(obj, function (result) {
            ASSETS.saveEditedCategorySuccessFullView(result);
        },
          function (result) {
          });
    },
    saveEditedCategorySuccessFullView: function (res) {
        if (res.Transaction_Status = true) {
            var category = $('.categoryeditfull').find('select :selected').text();
            var catId = $('.categoryeditfull').find('select').val()
            $('.categoryuneditfull').find('label').text(category);
            $('.categoryeditfull .categoryload').val(catId);
            $('.categoryunedit').find('label').text(category);
            $('categoryload').val(catId);

            $('.categoryunedit').find('label').text(category);
            $('.categoryedit .categoryload').val(catId);
        }
        $('.categoryeditfull').hide();
        $('.categoryuneditfull').show();
    },
    saveDescFullView: function (obj) {
        $(obj).css({ 'display': 'none' });
        var assetdesc = $('.desceditfull').find('textarea').val();
        var assetid = $("#assetid").val();

        var obj = {};
        obj.DA_Description = encodeURIComponent(assetdesc);
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateDesc(obj, function (result) { ASSETS.saveDescSuccessFullView(result) }, function (result) { });
    },
    saveDescSuccessFullView: function (res) {
        if (res.Transaction_Status = true) {
            var desc = $('.desceditfull').find('textarea').val();
            $('.descuneditfull').find('p').text(desc);
            $('.descunedit').find('p').text(desc);
        }
        $('.savedescfull').hide();
        $('.editdescfull').show();
        $('.desceditfull').hide()
        $('.descuneditfull').show();
    },
    saveEditedTagsFullView: function (obj) {
        var assettag = $('.tageditfull').find('.tagdetailsfull').val().replace(/,/g, '~');;
        var assetid = $("#assetid").val();
        $(obj).parent().find('.edittagfull').show();
        $('.savetagfull').hide();
        var obj = {};
        obj.Tags = assettag;
        obj.Target_Asset_Ids = assetid;
        UploadServices.updateAssetTags(obj, function (result) { ASSETS.saveEditedTagsSuccessFullView(result) }, function (result) { });
    },
    saveEditedTagsSuccessFullView: function () {
        var tags = $('.tageditfull').find('.tagdetailsfull').val().split(',');
        $(".da-tags").html('');
        $.each(tags, function (Index, item) {
            $(".da-tags").append("<span class='label label-default' style='margin-right:5px'><i class='fa fa-tag'></i>" + item + "</span>");
        });
        $('.tageditfull').hide();
        $('.taguneditfull').show();
    },
    showNextPage: function () {
        ASSETS.defaults.Asset_Page_No = parseInt(ASSETS.defaults.Asset_Page_No) + 1;
        ASSETS.getAssignedAssets();
    },
    showPreviousPage: function () {
        ASSETS.defaults.Asset_Page_No = parseInt(ASSETS.defaults.Asset_Page_No) - 1;
        ASSETS.getAssignedAssets();
    },
    showShareCustomerPopUp: function () {
        ShowModalPopup('dvShareCustomer');
        $('#dvCustPnl').block({
            message: 'Processing...',
            css: { border: '2px solid #DDD' }
        });
        setTimeout(function () { ASSETS.getCustomerPagingDetails(); }, 10);
    },
    getCustomerPagingDetails: function () {
        var fName = ($.trim($('#txtFName').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtFName').val()).replace(/~/g, "");
        var lName = ($.trim($('#txtLName').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtLName').val()).replace(/~/g, "");
        var speciality = ($('#cboCustCategory').val() == '0') ? null : $('#cboCustCategory').val();
        var email = ($.trim($('#txtEmailId').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtEmailId').val()).replace(/~/g, "");
        var searchText = ($.trim($('#txtSearchCust').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtSearchCust').val()).replace(/~/g, "");
        var selectedSpecialities = ($('#cboSpeciality').val() == null) ? null : $('#cboSpeciality').val().toString();

        var filterDetails = fName + "~" + lName + "~" + speciality + "~" + email + "~" + searchText + "~" + UploadServices.userId + "~" + selectedSpecialities;

        UploadServices.getCustomerEntityWithPaging(ASSETS.defaults.Customer_Page_No, $('#cboCusPagePerSize').val(), filterDetails,
            function (result) { ASSETS.bindCustomerPaging(result) }, function (result) { });
    },
    bindCustomerPaging: function (resultJson) {
        ASSETS.defaults.Customer_Page_Count = resultJson[0].Total_Pages_Count;
        ASSETS.defaults.Customer_Total_Records = resultJson[0].Total_Record_Count;
        ASSETS.bindCustomerPagingDetails();
        ASSETS.getCustomersForAssteMapping();
    },
    bindCustomerPagingDetails: function () {
        if (ASSETS.defaults.Customer_Page_Count == 0) {
            $('#dvCutAssFilter').hide();
        }
        else {
            $('#dvCutAssFilter').show();
        }
        var pageNo = ASSETS.defaults.Customer_Page_No;
        $('#cboCusPagePerSize').unbind('change').bind('change', function () {
            ASSETS.defaults.Customer_Page_No = 1;
            $('#dvCustPnl').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getCustomerPagingDetails(); }, 10);

        });
        if (parseInt(ASSETS.defaults.Customer_Page_Count) == parseInt(pageNo)) {
            $('#btnCustNext').unbind('click');
        }
        if (parseInt(ASSETS.defaults.Customer_Page_Count) > parseInt(pageNo)) {
            $('#btnCustNext').unbind('click').bind('click', function () {
                ASSETS.defaults.Customer_Page_No = ASSETS.defaults.Customer_Page_No + 1;
                $('#dvCustPnl').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.getCustomersForAssteMapping(); }, 10);
            });
        }
        if (pageNo == 1) {
            $('#btnCustPre').unbind('click');
        }
        else {
            $('#btnCustPre').unbind('click').bind('click', function () {
                ASSETS.defaults.Customer_Page_No = (ASSETS.defaults.Customer_Page_No) - 1;
                $('#dvCustPnl').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.getCustomersForAssteMapping(); }, 10);
            });
        }
        //debugger;
        if (ASSETS.defaults.Customer_Page_Count == 1) {
            $('#spnCusPageDisplay').html('1 to ' + ASSETS.defaults.Customer_Total_Records + ' of ' + ASSETS.defaults.Customer_Total_Records);
        }
        else if (ASSETS.defaults.Customer_Page_No == 1 && ASSETS.defaults.Customer_Page_Count != 1) {
            $('#spnCusPageDisplay').html('1 to ' + $('#cboCusPagePerSize').val() + ' of ' + ASSETS.defaults.Customer_Total_Records);
        }
        else if (ASSETS.defaults.Customer_Page_No == ASSETS.defaults.Customer_Page_Count) {
            var startCount = ((parseFloat(ASSETS.defaults.Customer_Page_No) * parseFloat($('#cboCusPagePerSize').val())) - parseFloat($('#cboCusPagePerSize').val()) + 1);
            $('#spnCusPageDisplay').html(startCount + ' - ' + ASSETS.defaults.Customer_Total_Records + ' of ' + ASSETS.defaults.Customer_Total_Records);
        }
        else {
            var endCount = (parseFloat(ASSETS.defaults.Customer_Page_No) * parseFloat($('#cboCusPagePerSize').val()))
            var startCount = ((parseFloat(ASSETS.defaults.Customer_Page_No) * parseFloat($('#cboCusPagePerSize').val())) - parseFloat($('#cboCusPagePerSize').val()) + 1);
            $('#spnCusPageDisplay').html(startCount + ' - ' + endCount + ' of ' + ASSETS.defaults.Customer_Total_Records);
        }
    },
    getCustomersForAssteMapping: function () {
        // ShowModalPopup('dvShareCustomer');

        var fName = ($.trim($('#txtFName').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtFName').val()).replace(/~/g, "");
        var lName = ($.trim($('#txtLName').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtLName').val()).replace(/~/g, "");
        var speciality = ($('#cboCustCategory').val() == '0') ? null : $('#cboCustCategory').val();
        var email = ($.trim($('#txtEmailId').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtEmailId').val()).replace(/~/g, "");
        var searchText = ($.trim($('#txtSearchCust').val()).replace(/~/g, "") == '') ? null : $.trim($('#txtSearchCust').val()).replace(/~/g, "");
        var selectedSpecialities = ($('#cboSpeciality').val() == null) ? null : $('#cboSpeciality').val().toString();
        if (fName != null || lName != null || speciality != null || email != null || searchText != null || selectedSpecialities != null) {
            $('#dvFilterStatus').html('Showing: Filtered customers  <i class="fa fa-times-circle remove-filter" style="cursor:pointer;"></i>');
            $('.remove-filter').unbind('click').bind('click', function () {
                $('#txtFName').val('');
                $('#txtLName').val('');
                $('#cboCustSpeciality').val('0');
                $('#txtEmailId').val('');
                $('#txtSearchCust').val('');
                $('#dvCustPnl').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { ASSETS.getCustomerPagingDetails(); }, 10);
                $('.cls-filter-customer').hide();
                $('#dvAssetCus').show();
            });
            $('#lnkCusFilter').css('color', 'blue');
        }
        else {
            $('#dvFilterStatus').html('Showing: All customers');
            $('#lnkCusFilter').css('color', 'black');
        }
        var filterDetails = fName + "~" + lName + "~" + speciality + "~" + email + "~" + searchText + "~" + UploadServices.userId + "~" + selectedSpecialities;
        UploadServices.getAllCKCustomerWiseWithEntityWithPaging(ASSETS.defaults.Customer_Page_No, $('#cboCusPagePerSize').val(), filterDetails,
                 function (result) { ASSETS.bindCustomers(result) }, function (result) { });
    },
    bindCustomers: function (resultJson) {
        ASSETS.defaults.Is_First_Time_Share_Open = parseInt(ASSETS.defaults.Is_First_Time_Share_Open) + 1;
        ASSETS.bindCustomerPagingDetails();
        var customersJson = resultJson[0].lstCustomers;
        console.log(customersJson);
        var categoryJson = resultJson[0].lstEntity;
        var displayJson = resultJson[0].DisplayName;
        //  console.log(resultJson);
        var cus = $('#dvAssetCus');
        $(cus).html('');
        var content = "<table id='tblCus' class='table table-striped' >";
        content += "<thead><tr><th><input type='checkbox' name='chkSelectAllCus' /></th><th>First Name</th>";
        if (displayJson != null && displayJson != '' && displayJson != undefined) {
            ASSETS.defaults.Entity_Common_Name = displayJson;
        }
        $('#lnkCatBased').html(ASSETS.defaults.Entity_Common_Name + ' based sharing');
        $('#txtSearchCust').attr('placeholder', 'Name/Email/' + ASSETS.defaults.Entity_Common_Name + '');
        content += "<th>Last Name</th><th>" + ASSETS.defaults.Entity_Common_Name + "</th><th>Email</th><th>Phone</th>";
        content += "</tr></thead><tbody>";
        $.each(customersJson, function (index, ele) {
            content += "<tr><td><input type='checkbox' name='chkCus' value='" + ele.Customer_Id + "'/></td><td>" + ele.Customer_FName + "</td>";
            content += "<td>" + ele.Customer_LName + "</td><td>" + ele.Entity_Value_Name + "</td><td>" + ele.Customer_Email + "</td><td>" + ele.Customer_Phone + "</td>";
            content += "</tr>";
        });
        content += "</tbody></table>";
        //debugger;
        $('#dvAssetCus').html(content);
        console.log(content);
        ASSETS.bindCustomerCategory(resultJson[0].lstEntity);
        // if (ASSETS.defaults.Is_First_Time_Share_Open == 1) {
        ASSETS.bindMailTemplate(resultJson[0].lstTemplate);
        //}
        $("input:checkbox[name=chkSelectAllCus]").unbind('click').bind('click', function () {
            ASSETS.selectAllCust();
        });

        $("input:checkbox[name=chkCus]").unbind('click').bind('click', function () {
            if ($('input[name=chkCus]:not(:checked)').length == 0) {
                $('input[type=checkbox][name=chkSelectAllCus]').attr('checked', true);
            }
            else {
                $('input[type=checkbox][name=chkSelectAllCus]').attr('checked', false);
            }
        });
        $('#btnShareAllCust').unbind('click').bind('click', function () {
            if ($('#dvCategory').hasClass('active')) {
                if ($("input:checkbox[name=chkCat]").length == 0) {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> No ' + ASSETS.defaults.Entity_Common_Name + ' details found');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
                //if ($("input:checkbox[name=chkCat]:checked").length == 0) {
                //    $('#dvCommonMsg').html('<b>Dear ' + currentEmpName_g + '</b>,</br> <br/> Please select atleast one ' + ASSETS.defaults.Entity_Common_Name);
                //    ShowModalPopup('dvCommonMsgModal');
                //    return;
                //}
                if (confirm('This selected Asset(s) will be shared with all customers, do you want to proceed?')) {
                    $("input:checkbox[name=chkCat]").each(function () {
                        this.checked = true;
                    });
                    $('#dvCustPnl').block({
                        message: 'Processing...',
                        css: { border: '2px solid #DDD' }
                    });
                    setTimeout(function () { ASSETS.saveCategoryCustomer(); }, 10);
                }

            }
            else {
                if ($("input:checkbox[name=chkCus]").length == 0) {
                    $('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> No customer details found');
                    ShowModalPopup('dvCommonMsgModal');
                    return;
                }
                //if ($("input:checkbox[name=chkCus]:checked").length == 0) {
                //    $('#dvCommonMsg').html('<b>Dear ' + currentEmpName_g + '</b>,</br> <br/> Please select atleast one customer');
                //    ShowModalPopup('dvCommonMsgModal');
                //    return;
                //}
                if (confirm('This selected Asset(s) will be shared with all customers, do you want to proceed?')) {
                    $('#dvCustPnl').block({
                        message: 'Processing...',
                        css: { border: '2px solid #DDD' }
                    });
                    setTimeout(function () { ASSETS.saveAssetToAllCustomer(); }, 10);
                }

            }
        });
        $('#dvCustPnl').unblock();
        //  $('#dvShareCustomer').unblock();
    },
    bindCustomerCategory: function (categoryJson) {
        var cat = $('#dvCusCat');
        var cboCat = $('#cboCustCategory');
        $(cat).html('');
        $('#cboCustCategory option').remove();
        if (categoryJson != null && categoryJson != '' && categoryJson != undefined) {
            $(cboCat).append("<option value=0>Select " + categoryJson[0].Entity_Name + "</option>");
            $(cat).html('');
            var content = "<table id='tblSpec' class='table table-striped' style='margin-top: 15px;'><thead><tr><th><input type='checkbox' name='chkSelectAllCat' /></th><th>" + categoryJson[0].Entity_Name + "</th><th>Customer Count</th></tr></thead><tbody>";
            $.each(categoryJson, function (index, ele) {
                content += "<tr><td><input type='checkbox' name='chkCat' value='" + ele.Entity_Value_Id + "'/></td><td>" + ele.Entity_Value_Name + "</td><td style='text-align:center;'>" + ele.Category_Count + "</td></tr>";
                $(cboCat).append("<option value='" + ele.Entity_Value_Id + "'>" + ele.Entity_Value_Name + "</option>");
            });
            content += "</tbody></table>";
            $(cat).html(content);
        }
        else {
            $(cboCat).append("<option value=0>Select</option>");
            $(cat).html('<p style="text-align: center;padding-top: 100px;font-size: 16px;">No ' + ASSETS.defaults.Entity_Common_Name + ' details found</p>');
        }

        $("input:checkbox[name=chkSelectAllCat]").unbind('click').bind('click', function () {
            ASSETS.selectAllCat();
        });

        $("input:checkbox[name=chkCat]").unbind('click').bind('click', function () {
            if ($('input[name=chkCat]:not(:checked)').length == 0) {
                $('input[type=checkbox][name=chkSelectAllCat]').attr('checked', true);
            }
            else {
                $('input[type=checkbox][name=chkSelectAllCat]').attr('checked', false);
            }
        });
        //ASSETS.getCustomersForAssteMapping();
        // $('#dvUnassigned').unblock();
    },
    bindMailTemplate: function (jsonData) {
        //var $container = $(".clsTemplate");
        var $container = $("#slideTemplate");

        $container.empty();
        var isDefault = 0;
        for (var i = 0; i < jsonData.length; i++) {
            var $sectionWrapper = $("<div temp-id=" + jsonData[i].Template_Id + " class=\"upfront verifycheck cls-asset\">");
            var $section = $("<div class=\"col-lg-12 cls-main-temp-asset\" id='dv-main-temp-asset_" + i + "'>");
            var $postContainer = $("<div class=\"post-temp-container\" style=\"position: relative;\">");
            var $postImage = $("<div class=\"post-temp-image\">");
            var $imageGroup = $("<a href=\"img/fransisca-post-image03-big.jpg\" class=\"img-group-gallery\" title=\"Lorem ipsum dolor sit amet\"> <img data-post-id=\"11728\" src=\"" + jsonData[i].Thumbnail_Url + "\" class=\"img-responsive\" alt=\"\"></a>");

            var $overlayDefault = $("<div style=\"display: block; text-align: center; padding-top: 27px; font-size: 40px;\"  id='dv_Default_" + i + "' class=\"overlay-option cls-make-default\"><a style=\"color: green;\" class=\"fa fa-check\"></a></div>");
            var $overlayWrapper = $("<div class=\"overlay-option-wrapper\"></div>");
            var $overlay = $("<div class=\"overlay-option\">");
            var $overlayPreview = $("<div onclick='ASSETS.fnTemplatePreview(" + jsonData[i].Template_Id + "," + i + "); return false;'  class=\"overlay-button overlay-preview\" onclick=\"\"><span><a class=\"overlay-icon fa fa-eye\" onclick=\"return false;\"></a><a onclick=\"return false;\" class=\"overlay-hint\">Preview</a></span>");

            var $overlayMakeDefault = $("<div onclick='ASSETS.fnMakeDefault(" + jsonData[i].Template_Id + "," + i + "); return false;' class=\"overlay-button overlay-makedefault\"><span><a onclick=\"return false;\" class=\"overlay-icon fa fa-check-circle\"></a><a onclick=\"return false;\" class=\"overlay-hint\">Select</a></span></div>");

            var $imageThumbnail = $("<img src=\"" + jsonData[i].Thumbnail_Url + "\" alt=\"Generic placeholder thumbnail\">");
            var $label = $("<div style='text-align: center;'><h5>" + jsonData[i].Template_Name + "</h5></div>");

            $overlay.append($overlayPreview);
            $overlay.append($overlayMakeDefault);
            //$overlay.append($overlayEdit);
            //$overlay.append($overlayDelete);
            $postContainer.append($overlayDefault);
            if (jsonData[i].Is_default == 1) {
                //$postContainer.append($overlayDefault);
                $('#hdnTemplateId').val(jsonData[i].Template_Id);
                isDefault = i;
            }
            $postContainer.append($overlayWrapper);
            $postContainer.append($overlay);

            $postImage.append($imageGroup);
            $postContainer.append($postImage);
            $section.append($postContainer);
            $section.append($label);
            $sectionWrapper.append($section);

            $container.append($sectionWrapper);
            $('.cls-make-default').hide();
            $('#dv_Default_' + isDefault).css('display', 'block');
            $('#dv-main-temp-asset_' + isDefault).addClass('cls-slide-selected');
            //  $('#hdnTemplateId').val(jsonData[i].Template_Id);
            $("#dvCatTemplate").niceScroll();
            $("#dvCusTemplate").niceScroll();
            $("#dvCatTemplate").getNiceScroll().resize();
            $("#dvCusTemplate").getNiceScroll().resize();
        }

    },
    fnMakeDefault: function (val, index) {
        $('.cls-make-default').hide();
        $('.cls-main-temp-asset').removeClass('cls-slide-selected');
        $('#dv-main-temp-asset_' + index).addClass('cls-slide-selected');
        $('#hdnTemplateId').val(val);
        $('#dv_Default_' + index).css('display', 'block');
    },
    fnTemplatePreview: function (val, index) {
        //var templateJson = {};
        //templateJson.name = "templateId";
        //templateJson.value = val;
        //var arData = new Array();
        //arData.push(templateJson);
        //DPAjax.requestInvoke('Template', 'GetPreviewdata', arData, 'GET', this.onBindTempateData, this.onFail);
        HideModalPopup('dvShareCustomer');
        //$('.cls-make-default').hide();
        //$('#hdnTemplateId').val(val);
        //$('#dv_Default_' + index).css('display', 'block');
        UploadServices.getPreviewData(val, function (result) { ASSETS.onBindTempateData(result) }, function () { });
    },
    onBindTempateData: function (jsonData) {
        HideModalPopup('dvShareCustomer');
        ShowModalPopup('divPreview');
        $("#divTemplatePreview").html(jsonData);
        $('#divTemplatePreview').find('input, textarea, button, select,checkbox').attr('disabled', 'disabled');
        $('#divTemplatePreview').find('a').removeAttr('href');
        //$('#divPreview').modal('show');
    },
    saveAssetToAllCustomer: function () {
        var stagingCode = '';
        var content = '';

        if ($('input[type=checkbox].stagingcheck:checked').length > 0) {
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                // if ($.inArray($(val).attr('file-ext').toLowerCase(), ASSETS.defaults.Share_Not_Allowed_Ext) == -1) {
                stagingCode += $(val).attr('data-checkedid') + ',';
                // }
            });
            stagingCode = stagingCode.slice(0, -1);
            $('#hdnStagingCode').val(stagingCode);
        }
        else {
            stagingCode = $('#hdnStagingCode').val();
        }
        var ids = stagingCode.split(',');
        $.each(ids, function (i, stagingId) {
            content += stagingId + "^";
            $.each($('input[name=chkCus]:checked'), function (index, ele) {
                content += $(ele).val() + ",";
            });
            content = content.slice(0, -1);
            content += "|";
        });
        var isRetain = false;

        if (stagingCode.split(',').length == 1) {
            isRetain = true;
        }
        var ar = new Array();
        ar.push(content.slice(0, -1));

        UploadServices.insertAssetCustomerSharing(stagingCode, $('#hdnTemplateId').val(), 'ASSIGNED', ar, true,
            function (result) { ASSETS.saveCustomerSuccess(result) }, function (result) { ASSETS.saveCustomerFail(result) });
    },
    selectTemplate: function (obj) {
        $('.cls-selected-temp').remove();
        //$("#li_" + obj.id.split('_')[1]).append("<i class='fa fa-check cls-selected-temp' id='chkCheck_" + obj.id.split('_')[1] + "'></i>");
        $(obj).append("<i class='fa fa-check cls-selected-temp' id='chkCheck_" + obj.id.split('_')[1] + "'></i>");
        $('#hdnTemplateId').val($(obj).attr('temp-id'));
    },
    saveAssetCustomer: function () {
        var stagingCode = '';
        var content = '';

        if ($('input[type=checkbox].stagingcheck:checked').length > 0) {
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                // if ($.inArray($(val).attr('file-ext').toLowerCase(), ASSETS.defaults.Share_Not_Allowed_Ext) == -1) {
                stagingCode += $(val).attr('data-checkedid') + ',';
                // }
            });
            stagingCode = stagingCode.slice(0, -1);
            $('#hdnStagingCode').val(stagingCode);
        }
        else {
            stagingCode = $('#hdnStagingCode').val();
        }
        var ids = stagingCode.split(',');
        $.each(ids, function (i, stagingId) {
            debugger;
            content += stagingId + "^";
            $.each($('input[name=chkCus]:checked'), function (index, ele) {
                content += $(ele).val() + ",";
            });
            content = content.slice(0, -1);
            content += "|";
        });
        var isRetain = false;

        if (stagingCode.split(',').length == 1) {
            isRetain = true;
        }
        var ar = new Array();
        ar.push(content.slice(0, -1));

        UploadServices.insertAssetCustomerSharing(stagingCode, $('#hdnTemplateId').val(), 'ASSIGNED', ar, false,
            function (result) { ASSETS.saveCustomerSuccess(result) }, function (result) { ASSETS.saveCustomerFail(result) });
    },
    saveCustomerSuccess: function (res) {
        if (res) {
            HideModalPopup('dvShareCustomer');
            ASSETS.getAssetGroupCount();
            ASSETS.reloadPage('');
            //$('#dvUnassigned').block({
            //    message: 'Processing...',
            //    css: { border: '2px solid #DDD' }
            //});
            //setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
        }
        else {
            $('#dvShareCustSucc').html('Error while sharing the asset with customers.Please try again');
        }
        $('#dvCustPnl').unblock();
    },
    saveCustomerFail: function () {
        $('#dvCustPnl').unblock();
    },
    saveCategoryCustomer: function () {
        var stagingCode = '';
        var content = '';
        if ($('input[type=checkbox].stagingcheck:checked').length > 0) {
            $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
                // if ($.inArray($(val).attr('file-ext').toLowerCase(), ASSETS.defaults.Share_Not_Allowed_Ext) == -1) {
                stagingCode += $(val).attr('data-checkedid') + ',';
                // }
            });
            stagingCode = stagingCode.slice(0, -1);
            $('#hdnStagingCode').val(stagingCode);
        }
        else {
            stagingCode = $('#hdnStagingCode').val();
        }
        var ids = stagingCode.split(',');
        $.each(ids, function (i, stagingId) {
            content += stagingId + "^";
            $.each($('input[name=chkCat]:checked'), function (index, ele) {
                content += $(ele).val() + ",";
            });
            content = content.slice(0, -1);
            content += "|";
        });
        var ar = new Array();
        ar.push(content.slice(0, -1));

        UploadServices.insertAssetEntityMapping(stagingCode, $('#hdnTemplateId').val(), 'ASSIGNED', ar,
              function (result) { ASSETS.saveCustomerSuccess(result) }, function (result) { ASSETS.saveCatCustomerFail(result) });
    },
    saveCategoryCustomerSuccess: function () {
        if (res) {
            HideModalPopup('dvShareCustomer');
            ASSETS.getAssetGroupCount();
            $('#dvUnassigned').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
        }
        else {
            $('#dvShareCustSucc').html('Error while sharing the asset with customers.Please try again');
        }
        $('#dvCustPnl').unblock();
    },
    saveCatCustomerFail: function () {
        $('#dvCustPnl').unblock();
    },
    selectAllCust: function () {
        if ($("input:checkbox[name=chkSelectAllCus]:checked").length > 0) {
            $("input:checkbox[name=chkCus]").each(function () {
                this.checked = true;
            });
        }
        else {
            $("input:checkbox[name=chkCus]").each(function () {
                this.checked = false;
            });
        }
    },
    selectAllCat: function () {
        if ($("input:checkbox[name=chkSelectAllCat]:checked").length > 0) {
            $("input:checkbox[name=chkCat]").each(function () {
                this.checked = true;
            });
        }
        else {
            $("input:checkbox[name=chkCat]").each(function () {
                this.checked = false;
            });
        }
    },
    isValidFileName: function (fname) {
        var rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
        var rg2 = /^\./; // cannot start with dot (.)
        var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        //return function isValid(fname) {
        return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
        //}
    },
    showFileDetails: function (daCode) {
        $('#spnFileName').html('');
        $('#spnFileCategory').html('');
        $('#txtAssetChange').html('');
        $('#hdnStagingCode').val(daCode);
        var selectedJson = jsonPath(ASSETS.defaults.Assigned_Assets_Json, "$.[?(@.DA_Code=="
            + daCode + ")]");

        if (selectedJson != false && selectedJson != undefined && selectedJson != null) {
            if (selectedJson[0].DA_File_Name.length > 20) {
                $('#spnFileName').html(selectedJson[0].DA_File_Name.substring(0, 20) + '...');
                $('#spnFileName').attr('title', selectedJson[0].DA_File_Name);
            }
            else {
                $('#spnFileName').html(selectedJson[0].DA_File_Name);
                $('#spnFileName').attr('title', selectedJson[0].DA_File_Name);
            }

            if (selectedJson[0].DA_Category_Name.length > 20) {
                $('#spnFileCategory').html(selectedJson[0].DA_Category_Name.substring(0, 20) + '...');
                $('#spnFileCategory').attr('title', selectedJson[0].DA_Category_Name);
            }
            else {
                $('#spnFileCategory').html(selectedJson[0].DA_Category_Name);
                $('#spnFileCategory').attr('title', selectedJson[0].DA_Category_Name);
            }
        }
        $('#dvFileChangeMsg').hide();
        $('#dvFileChange .cls-foot-cancel').show();
        $('#dvFileChange .cls-foot-upload').show();
        //$('#dvFileChange').modal('show');
        ShowModalPopup('dvFileChange');
    },
    setCode: function (code, daFileName) {
        $('#hdnStagingCode').val(code);
        $('#txtThumbChange').val('');
        $('#txtThumbImg').val('');
        $('#imgThumbPreview').attr('src', '')
        $('#lblFileName').html(daFileName);
        $('#dvThumbSuccMsg').hide();
        $('.cls-thum-change .cls-foot-cancel').show();
        $('.cls-thum-change .cls-foot-upload').show();
        // $('#dvUnAssinThumbChange').modal('show');
        ShowModalPopup('dvUnAssinThumbChange');
    },
    showThumbnailChange: function (input) {
        if ($.browser.msie) {
            var imgUrl = $('#txtThumbImg').val().replace(/C:\\fakepath\\/i, '');
            if (imgUrl != '') {
                var fileName = $('#txtThumbImg').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var arFileName = $('#txtThumbImg').val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                     arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    $('#txtThumbChange').val(fileName);
                    //$('#lblFileName').html(fileName);
                    $('#dvThumbMsg').html('');

                }
                else {
                    $('#txtThumbChange').val('');
                    // $('#lblFileName').html('');
                    $('#dvThumbMsg').html('');
                    $('#dvThumbMsg').html('Please select valid file.');
                    $("#txtThumbImg").val('')
                }
            }
            else {
                $('#dvThumbMsg').html('Please select valid file.');
                $('#txtThumbChange').val('');
                // $('#lblFileName').html('');
                $("#txtThumbImg").val('')
            }
        }
        else {
            //var input = $('#txtSurImg');
            if (input.files && input.files[0]) {
                var arFileName = $('#txtThumbImg').prop("files")[0].name.split('.');
                var fileNameAlone = arFileName[0];
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                   arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    var filerdr = new FileReader();
                    filerdr.onload = function (e) {
                        $('#imgThumbPreview').attr('src', e.target.result);
                        // $('#lblFileName').html(fileNameAlone);
                    }
                    filerdr.readAsDataURL(input.files[0]);
                    $('#txtThumbChange').val($('#txtThumbImg').prop("files")[0].name);
                    $('#dvThumbMsg').html('');
                }
                else {
                    $('#imgThumbPreview').removeAttr('src');
                    $('#dvThumbMsg').html('Please select valid file.');
                    $('#txtThumbChange').val('');
                    $("#txtThumbImg").val('');
                    //$('#lblFileName').html('');
                }
            }
            else {
                $('#dvThumbMsg').html('Please select valid file.');
                $('#txtThumbChange').val('');
                //$('#lblFileName').html('');
                $("#txtThumbImg").val('')
            }
        }
    },
    saveThumbnail: function () {
        if ($.trim($("#txtThumbImg").val()) != '') {
            $('#dvThumbSuccMsg').html('Updating the asset(s) thumbnail...');
            $('#dvThumbSuccMsg').show();
            $('.cls-thum-change .cls-foot-cancel').hide();
            $('.cls-thum-change .cls-foot-upload').hide();
            var data = new FormData();
            data.append("files", $("#txtThumbImg").get(0).files[0]);
            UploadServices.UpdateAssetThumbnailOfAssignedAsset($('#hdnStagingCode').val(), data, function (result) { ASSETS.thumbUploadSuccess(result) }, function (result) { });
        }
        else {
            $('#dvThumbMsg').html('Please select valid file.');
        }
    },
    thumbUploadSuccess: function (result) {
        $('#dvThumbSuccMsg').html(result.Message_To_Display);
        $("img[data-post-id=" + $('#hdnStagingCode').val() + "]").attr('src', result.Additional_Context)
        //$('#dvUnAssinThumbChange').modal('hide');
        HideModalPopup('dvUnAssinThumbChange');
    },
    showConfirmPopUp: function (mode, subMode) {

        $('.dv-modal-body').html('');
        var content = '';
        var meAr = new Array();
        var othersAr = new Array();
        var finalAssetId = '';
        var flag = false;
        var ownedByMe = '<table id="tblMe" style="display:none;" class="table table-condensed"><thead><tr><th></th><th>Asset Name</th><th>Category Name</th><th>Uploaded By</th></tr></thead>', ownedByMeCount = 0;
        var ownedbyOthers = '<table id="tblOthers"  class="table table-condensed"><thead><tr><th></th><th>Asset Name</th><th>Category Name</th><th>Uploaded By</th></tr></thead>', othersCount = 0;
        var count = $('input[type=checkbox].stagingcheck:checked').length;
        $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
            //debugger;
            var assetId = $(val).attr('data-checkedid');
            var selectedJson = jsonPath(ASSETS.defaults.Assigned_Assets_Json, "$.[?(@.DA_Code==" + assetId + ")]");
            var rows = '';
            var img = ASSETS.getFileExtension(selectedJson[0].DA_File_Name);
            var daName = selectedJson[0].DA_File_Name;
            rows += "<tr><td><img src='../../Areas/HDNextGen/Content/AssetUpload/doctype/" + img + "''/></td><td>" + daName + "</td><td>" + selectedJson[0].DA_Category_Name + "</td>";
            rows += "<td>" + selectedJson[0].Uploaded_By_Name + "<input type='hidden' value=" + selectedJson[0].DA_Code + "/></td></tr>";
            if (mode == "R" || mode == "P" || mode == "S") {
                if (selectedJson[0].Is_Uploaded_By_Me) {
                    meAr.push(assetId);
                    ownedByMe += rows;
                    ownedByMeCount = parseInt(ownedByMeCount) + 1;
                    finalAssetId += assetId + ',';
                }
                else {
                    othersAr.push(assetId);
                    ownedbyOthers += rows;
                    othersCount = parseInt(othersCount) + 1;
                }
            }
            else {
                if (selectedJson[0].Is_Customer_Sharable == "Y") {
                    meAr.push(assetId);
                    ownedByMe += rows;
                    ownedByMeCount = parseInt(ownedByMeCount) + 1;
                }
                else {
                    othersAr.push(assetId);
                    ownedbyOthers += rows;
                    othersCount = parseInt(othersCount) + 1;
                }
            }
        });
        ownedByMe += '</table>';
        ownedbyOthers += '</table>';
        daCode_g = finalAssetId.slice(0, -1);
        noOfAssets_g = finalAssetId.slice(0, -1).split(',').length;
        $('#hdnStagingCode').val(finalAssetId.slice(0, -1));
        if (mode == "R") {
            if (othersCount > 0) {
                ShowModalPopup('dvAlertModal');
                ASSETS.bindMultiDelete(othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr);
            }
            else {
                ASSETS.deleteAssetConfirm('', '');
            }
        }
        if (mode == "C") {
            if (othersCount > 0) {
                ShowModalPopup('dvAlertModal');
                ASSETS.bindMultiShareWithCustomer(othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr);
            }
            else {
                ASSETS.showShareCustomerPopUp();
            }
        }
        if (mode == "S") {

            if (othersCount > 0) {
                ShowModalPopup('dvAlertModal');
                ASSETS.bindMultiShareWithEmployees(othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr);
                if (subMode == "Q") {
                    $('#btnContinue').unbind('click').bind('click', function () {
                        for (var i = 0; i < othersAr.length; i++) {
                            $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').attr('checked', false)
                            $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
                        }
                        HideModalPopup('dvAlertModal');
                        ASSETS.getAllActiveUsers();
                    });
                }
                if (subMode == "A") {
                    $('#btnContinue').unbind('click').bind('click', function () {
                        for (var i = 0; i < othersAr.length; i++) {
                            $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').attr('checked', false)
                            $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
                        }
                        HideModalPopup('dvAlertModal');
                        ASSETS.assignToAllUsersPopUp('');
                    });
                }
                if (subMode == "S") {
                    $('#btnContinue').unbind('click').bind('click', function () {
                        for (var i = 0; i < othersAr.length; i++) {
                            $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').attr('checked', false)
                            $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
                        }
                        HideModalPopup('dvAlertModal');
                        ShowModalPopup('dvAssignAssetModal');
                        USER_ASSIGNMENT.getAllActiveUsers();
                    });
                }
            }
            else {
                if (subMode == "Q") {
                    ASSETS.getAllActiveUsers();
                }
                if (subMode == "A") {

                    ASSETS.assignToAllUsersPopUp('');
                }
                if (subMode == "S") {
                    ShowModalPopup('dvAssignAssetModal');
                    USER_ASSIGNMENT.getAllActiveUsers();
                }
            }
        }
        if (mode == "P") {
            if (othersCount > 0) {
                ShowModalPopup('dvAlertModal');
                ASSETS.bindMultiProp(othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr);
            }
            else {
                ASSETS.openFileProperties('');
            }
        }
    },
    bindMultiDelete: function (othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr) {
        var content = '';
        content += "<div class='dd'><p>Since, you are not the owner of " + othersCount + " asset(s), you cannot retire them. Click continue to remove them from the selection and retire only those assets (i.e. " + ownedByMeCount + " of " + count + " selected assets) that are owned by you.</p></div>";
        content += "<div class='dd'>";
        content += "<span class='dd-title dd-title-active' onclick=$('#tblMe').hide();$('#tblOthers').show();>Owned by others(" + othersCount + ")</span> ";
        content += "<span class='dd-title' onclick=$('#tblMe').show();$('#tblOthers').hide();>Owned by you(" + ownedByMeCount + ")</span>";
        content += "</div>";
        content += "<div id='dvContent' class='col-lg-12 cls-padding-none cls-confirm-content'>";
        content += ownedByMe;
        content += ownedbyOthers
        content += " </div>";
        $('.dv-modal-body').html(content);
        $('.dd-title').unbind('click').bind('click', function () {
            $('.dd-title').removeClass('dd-title-active');
            $(this).addClass('dd-title-active');
        });
        $('#btnContinue').unbind('click').bind('click', function () {
            for (var i = 0; i < othersAr.length; i++) {
                $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').attr('checked', false)
                $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
            }
            HideModalPopup('dvAlertModal');
            ASSETS.deleteAsset('');
        });
    },
    bindMultiShareWithCustomer: function (othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr) {
        var content = '';
        content += "<div class='dd'><p>Your selection contains  " + othersCount + " non-shareable assets. Since, you cannot share them with your customers, click continue to remove them from the selection and share only the shareable assets( i.e. " + ownedByMeCount + " of " + count + " selected assets) with your customers. </p></div>";
        content += "<div class='dd'>";
        content += "<span class='dd-title dd-title-active' onclick=$('#tblMe').hide();$('#tblOthers').show();>Non-shareable Assets (" + othersCount + ")</span> ";
        content += "<span class='dd-title' onclick=$('#tblMe').show();$('#tblOthers').hide();> Sharable Assets (" + ownedByMeCount + ")</span>";
        content += "</div>";
        content += "<div id='dvContent' class='col-lg-12 cls-padding-none cls-confirm-content'>";

        content += ownedByMe;
        content += ownedbyOthers
        content += " </div>";
        $('.dv-modal-body').html(content);
        $('.dd-title').unbind('click').bind('click', function () {
            $('.dd-title').removeClass('dd-title-active');
            $(this).addClass('dd-title-active');
        });
        $('#btnContinue').unbind('click').bind('click', function () {
            for (var i = 0; i < othersAr.length; i++) {
                $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').attr('checked', false)
                $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
            }
            HideModalPopup('dvAlertModal');
            ASSETS.showShareCustomerPopUp();
        });
    },
    bindMultiShareWithEmployees: function (othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr) {
        var content = '';
        content += "<div class='dd'><p>Since, you are not owner of " + othersCount + " asset(s), you cannot share them with your employees. Click continue to remove them from the selection and share only those assets (i.e. " + ownedByMeCount + " of " + count + " selected assets) that are owned by you.</p></div>";
        content += "<div class='dd'>";
        content += "<span class='dd-title dd-title-active' onclick=$('#tblMe').hide();$('#tblOthers').show();>Owned by others(" + othersCount + ")</span> ";
        content += "<span class='dd-title' onclick=$('#tblMe').show();$('#tblOthers').hide();>Owned by you(" + ownedByMeCount + ")</span>";
        content += "</div>";
        content += "<div id='dvContent' class='col-lg-12 cls-padding-none cls-confirm-content'>";
        content += ownedByMe;
        content += ownedbyOthers
        content += " </div>";
        $('.dv-modal-body').html(content);
        $('.dd-title').unbind('click').bind('click', function () {
            $('.dd-title').removeClass('dd-title-active');
            $(this).addClass('dd-title-active');
        });

    },
    bindMultiProp: function (othersCount, ownedByMeCount, count, ownedByMe, ownedbyOthers, meAr, othersAr) {
        var content = '';
        content += "<div class='dd'><p>Since, you are not the owner of " + othersCount + " asset(s), you cannot modify their details. Click continue to remove them from the selection and modify only the details of those assets (i.e. " + ownedByMeCount + " of " + count + " selected assets) that are owned by you.</p></div>";
        content += "<div class='dd'>";
        content += "<span class='dd-title dd-title-active' onclick=$('#tblMe').hide();$('#tblOthers').show();>Owned by others(" + othersCount + ")</span> ";
        content += "<span class='dd-title' onclick=$('#tblMe').show();$('#tblOthers').hide();>Owned by you(" + ownedByMeCount + ")</span>";
        content += "</div>";
        content += "<div id='dvContent' class='col-lg-12 cls-padding-none cls-confirm-content'>";
        content += ownedByMe;
        content += ownedbyOthers
        content += " </div>";
        $('.dv-modal-body').html(content);
        $('.dd-title').unbind('click').bind('click', function () {
            $('.dd-title').removeClass('dd-title-active');
            $(this).addClass('dd-title-active');
        });
        $('#btnContinue').unbind('click').bind('click', function () {
            for (var i = 0; i < othersAr.length; i++) {
                $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').attr('checked', false)
                $('input[type=checkbox][data-checkedid=' + othersAr[i] + ']').parents('.cls-main-asset').eq(0).removeClass('cls-el-selected cls-el-not-selected');
            }
            HideModalPopup('dvAlertModal');
            ASSETS.openFileProperties('');
        });
    },
    selectAllAssets: function () {
        var selEl = $('input[type=checkbox].stagingcheck').parents('.cls-main-asset');
        selEl.each(function (i, els) {
            $(els).removeClass('cls-el-not-selected').addClass('cls-el-selected');
        });
        $('input[type=checkbox].stagingcheck').attr('checked', true);
        $('#spnPaging').html($('input[type=checkbox].stagingcheck:checked').length + ' asset(s) selected');
    },
    unSelectAllAssets: function () {
        $('.cls-main-asset').removeClass('cls-el-selected').removeClass('cls-el-not-selected');
        $('input[type=checkbox].stagingcheck').attr('checked', false);
        $('#spnPaging').html($('input[type=checkbox].stagingcheck:checked').length + ' asset(s) selected');
    },
    invertSelection: function () {
        var unSelCheck = $('input[type=checkbox].stagingcheck:not(checked)'),
           selElCheck = $('input[type=checkbox].stagingcheck:checked');
        var unSelEl = $('input[type=checkbox].stagingcheck:not(checked)').parents('.cls-main-asset'),
            selEl = $('input[type=checkbox].stagingcheck:checked').parents('.cls-main-asset');

        unSelEl.each(function (i, els) {
            $(els).removeClass('cls-el-not-selected').addClass('cls-el-selected');
        });
        selEl.each(function (i, els) {
            $(els).removeClass('cls-el-selected').addClass('cls-el-not-selected');
        });
        unSelCheck.each(function (i, els) {
            $(els).attr('checked', true);
        });
        selElCheck.each(function (i, els) {
            $(els).attr('checked', false);
        });
        $('#spnPaging').html($('input[type=checkbox].stagingcheck:checked').length + ' asset(s) selected');
    },
    showOnlySelectedAssets: function (obj) {
        //debugger;
        //var unSelCheck = $('input[type=checkbox].stagingcheck:not(checked)').parents('.cls-asset'),
        // selElCheck = $('input[type=checkbox].stagingcheck:checked').parents('.cls-asset');
        //if ($(obj).hasClass('selected')) {

        //    //$('input[type=checkbox].stagingcheck:not(checked)').parents('.cls-asset').hide();
        //    //$(obj).removeClass('selected').addClass('all-selected');
        //    unSelCheck.each(function (i, els) {
        //        $(els).hide();
        //    });
        //    $(obj).removeClass('selected').addClass('all-selected');
        //}
        //else {
        //    //$('input[type=checkbox].stagingcheck').parents('.cls-asset').show();
        //    //$(obj).removeClass('all-selected').addClass('selected');

        //    $('input[type=checkbox].stagingcheck').parents('.cls-asset').show();
        //    $(obj).removeClass('all-selected').addClass('selected');
        //}
        if ($(obj).hasClass('selected')) {
            $.each($('input[type=checkbox].stagingcheck'), function (i, ele) {
                //debugger;
                if ($(ele).prop('checked') == false) {
                    //debugger;
                    $(ele).parents('.cls-asset').hide();
                }
            });
            $('img', obj).attr('title', 'Show All');
            $(obj).removeClass('selected').addClass('all-selected');
        }
        else {
            $('img', obj).attr('title', 'Show only selected');
            $('input[type=checkbox].stagingcheck').parents('.cls-asset').show();
            $(obj).removeClass('all-selected').addClass('selected');
        }
        $('#spnPaging').html($('input[type=checkbox].stagingcheck:checked:visible').length + ' asset(s) selected');
    },
    showCommonMsg: function (result) {
        if (result.Transaction_Status) {
            $('#spnAllSuccMsg').addClass('cls-all-com-msg');
            $('#spnAllSuccMsg').html(result.Message_To_Display);
            $('#spnAllSuccMsg').fadeIn().fadeOut(6000);
        }
        else {
            $('#spnAllSuccMsg').addClass('cls-all-com-msg');
            $('#spnAllSuccMsg').html(result.Message_To_Display);
            $('#spnAllSuccMsg').fadeIn().fadeOut(6000);
        }
    },
    reloadPage: function (mode) {
        if (mode == 'R') {
            ASSETS.defaults.Asset_Page_No = 1;
        }
        $('#dvUnassigned').html('');
        $('.cls-asset-action').block({
            message: 'Processing...',
            css: { border: '2px solid #DDD' }
        });
        setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
    },
    getMyOwnAssetIds: function (assetId) {

        var finalAssetId = '';
        var ar = assetId.split(',');
        for (var i = 0; i < ar.length; i++) {
            var selectedJson = jsonPath(ASSETS.defaults.Assigned_Assets_Json, "$.[?(@.DA_Code==" + ar[i] + ")]");
            if (selectedJson != false) {
                if (selectedJson[0].Is_Uploaded_By_Me) {
                    finalAssetId += ar[i] + ',';
                }
            }
        }
        finalAssetId = finalAssetId.slice(0, -1);
        return finalAssetId;
    },
    //getSpecialities: function () {
    //    UploadServices.getSpecialities(function (result) {
    //        $("#cboSpeciality option").remove();
    //        for (var i = 0; i < result.length; i++) {
    //            $("#cboSpeciality").append("<option value=" + result[i].Preference_Value_Id + ">" + result[i].Preference_Value + "</option>");
    //        }
    //        $("#cboSpeciality").multiselect({
    //            checkboxName: true, includeSelectAllOption: true,
    //            includeSelectAllIfMoreThan: 0,
    //            enableFiltering: true, enableCaseInsensitiveFiltering: true,
    //        });
    //        if (ASSETS.defaults.Is_Pharma_Customer == 0) {
    //            $('#trSpec').show();
    //        }
    //        else {
    //            $('#trSpec').hide();
    //        }
    //    }, function (result) { })
    //},
    //getCustomerDomain: function () {
    //    UploadServices.getCustomerDomain(function (result) {
    //        ASSETS.defaults.Is_Pharma_Customer = result;
    //        //if (ASSETS.defaults.Is_Pharma_Customer == 0) {
    //        //    $('.cls-edu-material').show();
    //        //}
    //        //else {
    //        //    $('.cls-edu-material').hide();
    //        //}
    //        ASSETS.checkCustomerSharable();
    //    }, function (result) { });
    //},
    //getCustomerSpeciality: function () {
    //    UploadServices.getCustomerSpeciality(function (result) {
    //        if (result.length > 0) {
    //            var content = '<table class="cls-tbl-spec"><thead><tr><th><input type="checkbox" name="chkAllSpec" onclick="ASSETS.selectAllSpec();"/></th><th>Name</th><th>No of Doctors</th></tr></thead><tbody>';
    //            $.each(result, function (index, obj) {
    //                content += "<tr><td><input type='checkbox' name='chkSpec' value=" + obj.Preference_Value_Id + " spec-name='" + obj.Preference_Value + "'/></td>";
    //                content += "<td cls-spec-name=" + obj.Preference_Value + ">" + obj.Preference_Value + "</td>";
    //                content += "<td>" + obj.Customer_Count + " Doctors</td></tr>";
    //            });
    //            content += "</tbody></table>";
    //            $('#dvAssSpec').html(content);
    //        }
    //        $('#btnSaveSpec').unbind('click').bind('click', function () {
    //            $('#dvAssetSpec').block({
    //                message: 'Processing...',
    //                css: { border: '2px solid #DDD' }
    //            });
    //            setTimeout(function () { ASSETS.insertAssetSpeciality(); }, 10);

    //        });
    //        $('#txtSpecSearch').keyup(function (e) { ASSETS.searchSpeciality(); });
    //    }, function () { });
    //},
    //insertAssetSpeciality: function () {
    //    if ($('input[type=checkbox][name=chkSpec]:checked').length == 0) {
    //        //$('#dvCommonMsg').html('<b>Dear ' + UploadServices.empName + '</b>,</br> <br/> Please select atleast one speciality.');
    //        //ShowModalPopup('dvCommonMsgModal');
    //        $('#spnSpecInfoMsg').html('Please select atleast one speciality.');
    //        return;
    //    }
    //    var stagingCode = '';
    //    if ($('input[type=checkbox].stagingcheck:checked').length > 0) {
    //        $.each($('input[type=checkbox].stagingcheck:checked'), function (index, val) {
    //            stagingCode += $(val).attr('data-checkedid') + ',';
    //        });
    //        stagingCode = stagingCode.slice(0, -1);
    //        $('#hdnStagingCode').val(stagingCode);
    //    }
    //    else {
    //        stagingCode = $('#hdnStagingCode').val();
    //    }
    //    var ids = stagingCode.split(',');
    //    var specAr = new Array();
    //    var content = '';

    //    $.each(ids, function (i, stagingId) {
    //        $.each($('input[name=chkSpec]:checked'), function (index, ele) {
    //            content += stagingId + "^" + $(this).val() + "|" + $(this).attr('spec-name') + ",";
    //            //var saveObj = {};
    //            //debugger;
    //            //saveObj.DA_Code = stagingId;
    //            //saveObj.Speciality_Id = $(this).val();
    //            //saveObj.Speciality_Name = $(this).attr('spec-name');
    //            //specAr.push(saveObj);
    //        });
    //    });
    //    var ar = new Array();
    //    ar.push(content.slice(0, -1));
    //    console.log(specAr);
    //    UploadServices.insertAssetSpeciality(ar,
    //        function (result) { ASSETS.saveSpecSuccess(result) }, function (result) { $('#dvAssetSpec').unblock(); $('#spnSpecInfoMsg').html('Error while mapping the asset with speciality'); });
    //},
    //saveSpecSuccess: function (result) {
    //    if (result) {
    //        $('input[type=checkbox][name=chkAllSpec]').attr('checked', false);
    //        $('input[type=checkbox][name=chkSpec]').attr('checked', false);
    //        $('input[name=chkSpec]').attr('checked', false);
    //        $('.cls-main-asset').removeClass('cls-el-selected').removeClass('cls-el-not-selected');
    //        $('input[type=checkbox].stagingcheck').attr('checked', false);
    //        $('#spnPaging').html($('input[type=checkbox].stagingcheck:checked').length + ' asset(s) selected');
    //        $('.cls-selection').hide();
    //        $('#dvAssetSpec').unblock();
    //        HideModalPopup('dvAssetSpec');
    //    }
    //    else {
    //        $('#dvAssetSpec').unblock();
    //        $('#spnSpecInfoMsg').html('Error while mapping the asset with speciality');
    //    }
    //},
    //selectAllSpec: function () {
    //    if ($("input:checkbox[name=chkAllSpec]:checked").length > 0) {
    //        $("input:checkbox[name=chkSpec]").each(function () {
    //            this.checked = true;
    //        });
    //    }
    //    else {
    //        $("input:checkbox[name=chkSpec]").each(function () {
    //            this.checked = false;
    //        });
    //    }
    //},
    //searchSpeciality: function () {
    //    if ($.trim($('#txtSpecSearch').val()).length > 0) {
    //        var i = 0;
    //        var valThis = $.trim($('#txtSpecSearch').val()).toLowerCase();
    //        $('.cls-tbl-spec tr td').each(function () {
    //            debugger;
    //            if ($(this).attr('cls-spec-name') != null && $(this).attr('cls-spec-name') != undefined) {
    //                var text = $(this).attr('cls-spec-name').toLowerCase();
    //                if (text.indexOf(valThis) >= 0) {
    //                    i++;
    //                    $(this).closest('tr').show();
    //                }
    //                else {
    //                    $(this).closest('tr').hide();
    //                }
    //            }
    //        });

    //    }
    //    else {
    //        $('.cls-tbl-spec tr').show();
    //    }
    //},
    isValid: function (fname) {
        var rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
        var rg2 = /^\./; // cannot start with dot (.)
        var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
    }
}


var Upload_Asset = {
    defaults: {
        "APIURL": "/",
        "filedata": [],
        "rowCount": 0,
        "currentUploadRow": 0,
        "DropZone": "",
    },

    initEvents: function () {
        //$('.cls-foot-upload').unbind('click').bind('click', function () {
        //    Upload_Asset.uploadFiles();
        //});
        $('#btn-main-upload').unbind('click').bind('click', function () {
            $("#dvTrdPty").toggle();
        });
        $('#txtAssetFile').change(function () {
            Upload_Asset.getSelectedFileObj(this);
        });
        $('#txtFile').change(function () {
            Upload_Asset.getSelectedFileObj(this);
        });
        $('.cls-drop-main').hide();
        $('.notification').show();
        $('.cls-upload-asset').unbind('click').bind('click', function () {
            $('.cls-drop-main').show();
            $('.notification').hide();
            $('.cls-upload-asset').hide();
            $('.cls-main-content').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { Upload_Asset.uploadFiles(); }, 10);

        });
        $('#dvUpload .close').unbind('click').bind('click', function () {
            if (Upload_Asset.defaults.filedata.length > 0) {
                if (confirm('You have selected some files to upload , if you close this window then files wont be upload. Still do you want to close?')) {
                    $('.dz-preview').remove();
                    Upload_Asset.defaults.filedata = [];
                    $('.cls-upload-asset').hide();
                    HideModalPopup("dvUpload");
                }
            }
            else {
                $('.dz-preview').remove();
                Upload_Asset.defaults.filedata = [];
                $('.cls-upload-asset').hide();
                HideModalPopup("dvUpload");
            }

        });
    },
    getSelectedFileObj: function (input) {
        if ($.browser.msie) {
            var imgUrl = $(input).val().replace(/C:\\fakepath\\/i, '');
            if (imgUrl != '') {
                var fileName = $(input).val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                var arFileName = $(input).val().replace(/C:\\fakepath\\/i, '').split('\\').pop().split('.');
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                     arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    Upload_Asset.defaults.rowCount++;
                    // var i = Upload_Asset.defaults.rowCount;
                    var resdata = [];
                    resdata.push(input.files[0]);
                    resdata.push(Upload_Asset.defaults.rowCount);
                    Upload_Asset.defaults.filedata.push(resdata);
                    //  Upload_Asset.defaults.reverseFileData = Upload_Asset.defaults.filedata.reverse();
                    Upload_Asset.createRowContent(resimg, Upload_Asset.defaults.rowCount);
                }
            }

        }
        else {
            if (input.files && input.files[0]) {
                var arFileName = $(input).prop("files")[0].name.split('.');
                var fileNameAlone = arFileName[0];
                arFileName.reverse();
                if (arFileName[0].toUpperCase() == "JPG" || arFileName[0].toUpperCase() == "PNG" || arFileName[0].toUpperCase() == "JPEG" ||
                   arFileName[0].toUpperCase() == "BMP" || arFileName[0].toUpperCase() == "GIF") {
                    var filerdr = new FileReader();
                    filerdr.onload = function (e) {
                        //e.target.result);
                        Upload_Asset.defaults.rowCount++;
                        var resdata = [];
                        resdata.push(input.files[0]);
                        resdata.push(Upload_Asset.defaults.rowCount);
                        Upload_Asset.defaults.filedata.push(resdata);
                        // Upload_Asset.defaults.reverseFileData = Upload_Asset.defaults.filedata.reverse();
                        Upload_Asset.createRowContent(input.files[0], Upload_Asset.defaults.rowCount);
                    }
                    filerdr.readAsDataURL(input.files[0]);
                }

            }

        }

    },
    initializeDropZone: function () {
        $('.cls-upload-asset').hide();
        try {
            DropZone = $(".dropzone").dropzone({

                method: "POST",
                paramName: "files", // The name that will be used to transfer the file
                maxFilesize: 60, // MB
                acceptedFiles: ".doc, .docx, .ppt, .pptx, .xls, .xlsx, .pdf, .jpg, .jpeg, .bmp, .png, .gif, .mp4, .zip",
                url: "/AssetUpload/UploadImage",
                success: function (resimg) {
                    Upload_Asset.defaults.rowCount++;
                    var i = Upload_Asset.defaults.rowCount
                    var resdata = [];
                    resdata.push(resimg);
                    resdata.push(i);
                    Upload_Asset.defaults.filedata.push(resdata);
                    //  Upload_Asset.defaults.reverseFileData = Upload_Asset.defaults.filedata.reverse();
                    Upload_Asset.createRowContent(resimg, Upload_Asset.defaults.rowCount);
                    $("#dvThirdPty").hide();
                },
                maxFiles: 10,
                parallelUploads: 20,
                addRemoveLinks: false,
                uploadMultiple: true,
                autoProcessQueue: true,
                async: false,
                thumbnailWidth: 80,
                thumbnailHeight: 80,
                dictResponseError: 'Error while uploading file!',
                previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n<div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail id='IMG' />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"

            });
            Dropzone.autoDiscover = false;
            if ($('#tblUploadAsset tbody tr').length > 0) {
                $('#tblUploadFoot').show();
                $("#dvThirdPty").hide();
                $("#dvdpBtn").show();
            }
            else {
                $('#tblUploadFoot').hide();
            }
        }
        catch (e) {
            alert('Dropzone.js does not support older browsers!');
        }
        Dropzone.options.myDropzone = {
            init: function () {
                this.on("addedfile", function (file) {
                    var removeButton = Dropzone.createElement("<button>Remove file</button>");
                    var _this = this;
                    removeButton.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        _this.removeFile(file);
                        // If you want to the delete the file on the server as well,
                        // you can do the AJAX request here.
                    });
                    file.previewElement.appendChild(removeButton);
                });
            }
        };
        Upload_Asset.initEvents();
        //$(".progress-li").addClass("clswhite-select");
        //$(".progress-li").click(function () {
        //    $(".progress-li").addClass("clswhite-select");
        //    $(".Unassigned-li").removeClass("clswhite-select");
        //    $(".Assigned-li").removeClass("clswhite-select");

        //});
        //$(".Unassigned-li").click(function () {
        //    $(".Unassigned-li").addClass("clswhite-select");
        //    $(".progress-li").removeClass("clswhite-select");
        //    $(".Assigned-li").removeClass("clswhite-select");

        //});
        //$(".Assigned-li").click(function () {
        //    $(".Assigned-li").addClass("clswhite-select");
        //    $(".Unassigned-li").removeClass("clswhite-select");
        //    $(".progress-li").removeClass("clswhite-select");

        //});
        //if ($('.clswhite-select a').attr('href').toUpperCase() == "../../ASSETUPLOAD/UPLOADASSETS") {
        //    $('#dvDropResponse').show();
        //    $('.cls-drop-tbl-head').show();
        //    $('.notification').removeClass('cls-drop-add');
        //    //  $('.notification').css('width', '34%');
        //}
    },
    createRowContent: function (resimg, i) {
        $('#dvDropResponse').show();
        $('.cls-drop-tbl-head').show();
        $('.notification').removeClass('cls-drop-add');
        $('.notification').addClass('cls-drop-edit');
        $('#dvDropResponse').css('display', 'block');
        $('.cls-drop-tbl-head').show();
        $('.cls-title').show();
        $('.cls-add-btn').show();
        var trContent = "";
        // $('#progressresult tr.rowremove').remove();
        $('#progressresult tr').remove();
        $.each(Upload_Asset.defaults.filedata.reverse(), function (index, ele) {
            var i = index;
            trContent += "<tr class='rowremove' data-id=" + i + "> <td style='width: 225px;'>";
            var image = Upload_Asset.getFileExtension(ele[0].name);
            trContent += "<img src='../../Areas/HDNextGen/Content/AssetUpload/doctype/" + image + "' /><span>" + ele[0].name + "</span> </td> ";
            trContent += "<td style='width: 70px;'>Default </td> <td style='width: 180px' class='status' data-id=" + i + "><div class='status-txt'>Pending Upload</div> ";
            trContent += "<div class='progress'>";
            trContent += "<div class='progress-bar progress-bar-success' role='progressbar' ";
            trContent += " aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width:0%'>";
            trContent += " </div></div></td>";
            trContent += "<td  style='width: 25px;' class='deleteasset' data-row=" + i + "><i class='fa fa-trash'></i>";
            trContent += "</td></p></tr>";
        });
        $('#progressresult').prepend(trContent);
        if ($('#progressresult tr').length > 0) {
            //$('#tblUploadFoot').show();
            $('.cls-fail-msg').show();
        }
        else {
            // $('#tblUploadFoot').hide();
            $('.cls-fail-msg').hide();
        }
        $('.cls-DropResponse').niceScroll();
        $('.deleteasset .fa-times-circle').unbind('click').bind('click', function () {
            Upload_Asset.deleteFile(this);
        });
        $('.deleteasset .fa-trash').unbind('click').bind('click', function () {
            Upload_Asset.deleteFile(this);
        });
        //$('.dz-remove').unbind('click').bind('click', function () {
        //   
        //    alert(this);
        //});
        $('.cls-upload-asset').show();
        //var window_height = $(window).height();
        //var document_height = $(document).height();
        //$('html,body').animate({ scrollTop: window_height + document_height }, 'slow', function () {
        //});
    },
    onFail: function () {
        $('#dvUnassigned').unblock();
    },
    uploadFiles: function () {
        //  console.log(Upload_Asset.defaults.filedata);
        $('.cls-drop-main').show();
        var current = $('#tblUploadAsset tbody tr');
        $('.progress-bar', current.eq(Upload_Asset.defaults.currentUploadRow)).css('width', '25%');
        $('.deleteasset .fa-trash', current).removeClass('fa-trash').addClass('fa-times-circle');
        $('.cls-up-suc-msg').html('Uploading files. Please wait...');
        $('.cls-up-suc-msg').show();
        $('.cls-foot-cancel').hide();
        $('.cls-foot-upload').hide();
        $(".dropvisible").css({ 'display': 'none' });
        $('.deleteasset .fa-times-circle', current.eq(Upload_Asset.defaults.currentUploadRow)).removeClass('fa-times-circle');
        var data = new FormData();
        data.append("files", Upload_Asset.defaults.filedata[Upload_Asset.defaults.currentUploadRow][0]);
        $('.progress-bar', current.eq(Upload_Asset.defaults.currentUploadRow)).css('width', '50%');
        UploadServices.uploadAsset(Upload_Asset.defaults.filedata[Upload_Asset.defaults.currentUploadRow][0].size, data,
            function (result) {
                Upload_Asset.uploadFileSuccess(result);
            }, function (result) { Upload_Asset.onFileUploadFailed(result); });

    },
    uploadFileSuccess: function (res) {
        //if (res.Transaction_Status) {
        if (res) {
            debugger;
            var current = $('#tblUploadAsset tbody tr');
            $('.progress-bar', current.eq(Upload_Asset.defaults.currentUploadRow)).css('width', '100%');
            $('.status-txt', $('#tblUploadAsset tbody tr').eq(Upload_Asset.defaults.currentUploadRow)).html('Uploaded')
            Upload_Asset.defaults.currentUploadRow++;

            if (Upload_Asset.defaults.currentUploadRow < Upload_Asset.defaults.filedata.length) {
                Upload_Asset.uploadFiles();
            }
            else {
                //$('.cls-up-suc-msg').html(res.Message_To_Display);
                $('.cls-up-suc-msg').html('Files uploaded successfully');
                $('.cls-up-suc-msg').show();
                $('.cls-main-content').unblock();
                $('#btn-main-upload').attr('href', '../../AssetUpload/AssetMaster');
                $('#btn-main-upload').attr('title', 'Upload');
                $('#btn-main-upload').css('cursor', 'pointer');
                $('.dz-preview').remove();
                Upload_Asset.defaults.filedata = [];
                $('.cls-upload-asset').hide();
                $('#dvDropResponse').hide();
                $('#dvDropResponseHeader').hide();
                ASSETS.getAssetGroupCount();
                ASSETS.reloadPage('R');
                HideModalPopup('dvUpload');
                $('.cls-drop-main').hide();
                Upload_Asset.defaults.currentUploadRow = 0;
                //  Upload_Asset.initializeDropZone();
                $('#dropzoneone').html('');
                $('#dropzoneone').html('<form class="dropzone dz-clickable" enctype="multipart/form-data" method="post" id="image" title="Select File(s)"><i class="fa fa-10x fa-cloud-upload"></i><span>Drag and drop files here or Click here to select files</span> <p>*.doc, *.docx, *.ppt, *.pptx, *.xls, *.xlsx, *.pdf, *.jpg, *.jpeg, *.bmp, *.png, *.gif, *.mp4, *.zip</p></form>');
                Upload_Asset.initializeDropZone();
            }
        }
        else {
            $('.cls-up-suc-msg').html('Failed');
            $(".cls-drop-main").hide();
            $('.cls-up-suc-msg').show();
            $('.cls-main-content').unblock();
        }

    },
    onFileUploadFailed: function (res) {

        var current = $('#tblUploadAsset tbody tr');
        $('.progress-bar', current.eq(Upload_Asset.defaults.currentUploadRow)).css('width', '0%');
        $('.status-txt', $('#tblUploadAsset tbody tr').eq(Upload_Asset.defaults.currentUploadRow)).html('Failed');
        $('.status-txt', $('#tblUploadAsset tbody tr').eq(Upload_Asset.defaults.currentUploadRow)).css('color', 'red');
        Upload_Asset.defaults.currentUploadRow++;
        // alert(Upload_Asset.defaults.currentUploadRow);
        if (Upload_Asset.defaults.currentUploadRow < Upload_Asset.defaults.filedata.length) {
            // alert('in')
            //  alert(Upload_Asset.defaults.filedata);
            Upload_Asset.uploadFiles();
        }
        else {
            $(".cls-drop-main").hide();
            $('.cls-main-content').unblock();
            $('#btn-main-upload').attr('href', '../../AssetUpload/AssetMaster');
            $('#btn-main-upload').attr('title', 'Upload');
            $('#btn-main-upload').css('cursor', 'pointer');
        }
    },
    _raw: function (url, requestType, context, data, success, failure) {
        //TODO $.mobile.allowCrossDomainPages = true; un - comment code
        //$.support.cors = true;
        url = CoreREST._addContext(url, context);
        if (data == null) {
            data = {};
        }
        // data.accessKey = this.accessKey;
        $.ajax({
            url: url,
            type: requestType,
            data: data,
            contentType: 'multipart/form-data',
            processData: false,
            async: true,
            crossDomain: true,
            success: function (response) {
                success(response);
            },
            error: function (a, b, c) {
                console.log(JSON.stringify(a) + " - " + JSON.stringify(b) + " - " + JSON.stringify(c));
                failure(a);
            }
        });
    },
    deleteFile: function (obj) {

        var rowIndex = $(obj).attr('data-row');
        Upload_Asset.defaults.filedata.splice(rowIndex, 1);
        $(obj).closest('tr').remove();
    },
    getFileExtension: function (fileName) {
        if (fileName == null || fileName === undefined || fileName == '')
            return 'INVALID';
        var parts = fileName.split('.'), ext = parts[parts.length - 1].toLowerCase();
        if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp')
            extIcon = 'image.png';
        else if (ext == 'pdf')
            extIcon = 'pdf.png';
        else if (ext == 'docx' || ext == 'doc')
            extIcon = 'docx.png';
        else if (ext == 'ppt' || ext == 'pptx')
            extIcon = 'pptx.png';
        else if (ext == 'xls' || ext == 'xlsx')
            extIcon = 'xlsx.png';
        else if (ext == 'zip')
            extIcon = 'html5.png';
        else
            extIcon = 'video.png';

        return extIcon;
    },

}

var USER_ASSIGNMENT = {
    defaults: {
        "divisionJson": [],
        "userTypeJson": [],
        "allUsersJson": [],
        "assignUsers": [],
        "disDivisionUsersJson": []
    },
    onFail: function () {
        $('#dvUnassigned').unblock();
    },
    getAllActiveUsers: function () {
        $('#dvAssign').html('');
        $('#dvAssign').block({
            message: 'Processing...',
            css: { border: '2px solid #DDD' }
        });
        UploadServices.getAllActiveUsers(function (result) { USER_ASSIGNMENT.bindUsers(result) }, function (result) { });
        //var _this = Upload_Asset.defaults.APIURL;
        //var context = ['AutoSignOnApi', 'GetAllActiveUsers', subDomainName_g, currentCompId_g, currentUserId_g];
        //CoreREST._raw(_this, "GET", context, null, this.bindUsers, this.onFail);
    },
    bindUsers: function (jsonData) {
        USER_ASSIGNMENT.defaults.allUsersJson = eval(jsonData);
        var arr = [], //to collect user id values 
        collection = []; //collect unique object

        $.each(USER_ASSIGNMENT.defaults.allUsersJson, function (index, value) {
            if ($.inArray(value.Division_Code, arr) == -1) { //check if id value not exits than add it
                arr.push(value.Division_Code);//push id value in arr
                var a = {};
                a.Division_Code = value.Division_Code;
                a.Division_Name = value.Division_Name;
                collection.push(a); //put object in collection to access it's all values
            }
        });
        USER_ASSIGNMENT.defaults.divisionJson = collection;
        var arr = [], //to collect user id values 
       collection = []; //collect unique object
        $.each(USER_ASSIGNMENT.defaults.allUsersJson, function (index, value) {
            if ($.inArray(value.User_Type_Code, arr) == -1) { //check if id value not exits than add it
                arr.push(value.User_Type_Code);//push id value in arr
                var a = {};
                a.User_Type_Code = value.User_Type_Code;
                a.User_Type_Name = value.User_Type_Name;
                collection.push(a); //put object in collection to access it's all values
            }
        });
        USER_ASSIGNMENT.defaults.userTypeJson = collection;
        USER_ASSIGNMENT.bindData();
    },
    bindData: function () {
        var content = "";
        content += "<div class='cls-main-panel'>";
        content += " <div class='col-md-4 cls-no-padding'>";
        // division div   
        content += USER_ASSIGNMENT.bindDivisionsContent();
        // user type div
        content += USER_ASSIGNMENT.bindUserTypesContent();
        content += "</div>";
        /// all users div                                 
        content += " <div class='col-md-8 cls-no-padding cls-users'>";
        content += USER_ASSIGNMENT.bindAllUsersContent();
        content += "</div>";
        content += "<div class='cls-user-mid'>  <div class='cls-act-btn'> <span class='cls-nav-btn'>";
        content += "<i class='fa fa-caret-square-o-right'></i><br/><br/><i class='fa fa-caret-square-o-left'></i></span>";
        content += "</div> </div>";
        /// assign user div    
        content += USER_ASSIGNMENT.bindAssignUsersContent();
        content += " </div>";
        //  content += " </div>";
        // content += " </div>";
        $('#dvAssign').html(content);

        $('#dvAssignUserSuccMsg').hide();
        $('.cls-add-users-pnl-body').niceScroll();
        $('.cls-remove-users-pnl-body').niceScroll();
        $('.cls-UT-pnl-body').niceScroll();
        $('.cls-div-pnl-body').niceScroll();
        $('#tblAllUsers').hide();
        $('.clsUserInfo').show();
        $('.clsAssUserInfo').hide();
        $('#dvAssignUserList').hide();
        $('.fa-caret-square-o-right').hide();
        $('.fa-caret-square-o-left').hide();
        $('.cls-Retain').hide();
        $('.cls-btn-submit').hide();
        USER_ASSIGNMENT.bindEvents();
        $('#dvAssign').unblock();
        if (noOfAssets_g == 1) {
            //USER_ASSIGNMENT.getTagDetails();
            if (mode_g != "UNASSIGNED") {
                $('#dvAssign').block({
                    message: 'Processing...',
                    css: { border: '2px solid #DDD' }
                });
                setTimeout(function () { USER_ASSIGNMENT.getUsersMapped(daCode_g); }, 10);
            }

            //USER_ASSIGNMENT.bindAssignedUsersForSelectedAsset();
        }
        else {
            $('#dvAssign').unblock();
        }
        // ShowModalPopup('dvAssignAssetModal');

        // $('#dvAssignAssetModal').modal('show');
    },
    bindDivisionsContent: function () {
        var content = '';
        if (USER_ASSIGNMENT.defaults.divisionJson.length > 1) {
            content += "<div id='dvDivisions' class='clsDivsions col-lg-12 cls-no-padding'>";
            content += "<div class='panel panel-default cls-pnl'>";
            content += "<div class='panel-heading cls-pnl-head'><span>Division</span><span class='cls-pnl-lnk cls-pnl-lnk-div'>Select All</span></div>";
            content += "<div class='panel-body cls-pnl-body cls-div-pnl-body'>";
            content += " <table id='tblDivision' class='cls-tbl-div'>";
            var divisionJson = USER_ASSIGNMENT.defaults.divisionJson;
            for (var i = 0; i < divisionJson.length; i++) {
                content += "<tr><td> <input type='checkbox' name='chkDivision' value=" + divisionJson[i].Division_Code + " /></td>";
                content += " <td>" + divisionJson[i].Division_Name.toLowerCase() + "</td></tr>";
            }
            content += "</table></div> </div></div>";
        }
        return content;
    },
    bindUserTypesContent: function () {
        var content = '';
        content += "<div id='dvUserTypes' class='clsUserTypes col-lg-12 cls-no-padding'>";
        content += "<div class='panel panel-default cls-pnl'>";
        content += "<div class='panel-heading cls-pnl-head'><span>Designation</span><span class='cls-pnl-lnk cls-pnl-lnk-UT'>Select All</span></div>";
        if (USER_ASSIGNMENT.defaults.divisionJson.length > 1) {
            content += "<div class='panel-body cls-pnl-body cls-UT-pnl-body'>";
        }
        else {
            content += "<div class='panel-body cls-pnl-body cls-UT-pnl-body' style='max-height: 450px;'>";
        }
        content += "<table id='tblUserTypes' class='cls-tbl-UT'>";
        var usertypeJson = USER_ASSIGNMENT.defaults.userTypeJson;
        for (var i = 0; i < usertypeJson.length; i++) {
            content += "<tr><td> <input type='checkbox' name='chkUserTypes' value=" + usertypeJson[i].User_Type_Code + " /></td>";
            content += "<td>" + usertypeJson[i].User_Type_Name.toLowerCase() + "</td> </tr>";
        }
        content += "</table></div></div> </div> ";
        return content;
    },
    bindAllUsersContent: function () {
        var content = "";
        content += "<div id='dvUserList' class='cls-user-list cls-no-padding'>";
        content += "<div class='panel panel-default cls-pnl'>";
        content += " <div class='panel-heading cls-pnl-head'><span>User List</span><span class='cls-pnl-lnk clsAllUserlnk'>Select All</span></div>";
        content += "<div class='panel-body cls-pnl-body cls-add-users-pnl-body'>";
        content += "<table class='table table-hover cls-tbl-All-users' id='tblAllUsers'><tbody>";
        var allusersJson = USER_ASSIGNMENT.defaults.allUsersJson;

        var arr = [], //to collect user id values 
         collection = []; //collect unique object

        $.each(allusersJson, function (index, value) {
            if ($.inArray(value.User_Id, arr) == -1) { //check if id value not exits than add it
                arr.push(value.User_Id);//push id value in arr
                collection.push(value); //put object in collection to access it's all values
            }
        });

        for (var i = 0; i < collection.length; i++) {
            var imgUrl = "../../Areas/HDNextGen/Content/images/profile-pic.jpg";
            content += " <tr code='" + collection[i].Division_Code + "_" + collection[i].User_Type_Code + "' user_id='" + collection[i].User_Id + "'>";
            if (collection[i].Profile_Photo_BLOB_URL != null && collection[i].Profile_Photo_BLOB_URL != '' && collection[i].Profile_Photo_BLOB_URL != undefined) {
                content += "<td><div> <a href='#'><img src='" + collection[i].Profile_Photo_BLOB_URL + "' class='cls-img' /></a></div></td>";
            }
            else {
                content += "<td><div> <a href='#'><img src=" + imgUrl + " class='cls-img' /></a></div></td>";
            }
            content += "<td>";
            content += "<div class='col-lg-12'>" + collection[i].Employee_Name.toLowerCase() + "</div>";
            content += " <div class='col-lg-12'>" + collection[i].User_Type_Name.toLowerCase() + " | "
                + collection[i].Region_Name.toLowerCase() + "</div></td>";
            content += "<td user_id=" + collection[i].User_Id + "><span class='cls-add-user'> <i class='fa fa-plus-circle'></i></span>";
            content += "<input type='hidden' class='cls-ass-user-id' value=" + collection[i].User_Id + " id='hdnUserId_" + i + "'/> </td> </tr>";
        }
        content += "</tbody></table>";
        if (USER_ASSIGNMENT.defaults.divisionJson.length > 1) {
            content += "<div class='col-lg-12 text-center clsUserInfo'>Please select division and user types to show the user list </div>";
        }
        else {
            content += "<div class='col-lg-12 text-center clsUserInfo'>Please select user types to show the user list </div>";
        }
        content += "</div></div>";
        return content;
    },
    bindAssignUsersContent: function () {
        var content = "";
        content += "<div id='dvAssignUserList' class='cls-ass-user-list cls-no-padding'>";
        content += " <div class='panel panel-default'>";
        content += "<div class='panel-heading'><span>Assign to</span><span class='cls-pnl-lnk clsAssignUserlnk'>Select All</span></div>";
        content += "<div class='panel-body cls-pnl-body cls-remove-users-pnl-body'>";
        content += "<table class='table table-hover' id='tblAssignUsers'><tbody>";

        content += "</table>";

        content += "<div class='col-lg-12 text-center clsAssUserInfo'>Please select one or more users to assign </div>";

        content += " </div></div>";
        content += "<div class='col-lg-12 cls-act cls-no-padding'>";
        content += "<div class='checkbox checkbox-primary cls-Retain' style='display:none;'>";
        content += "<input id='checkbox2' type='checkbox' name='chkRetainUser'>";
        content += "<label for='checkbox2'>Retain all the previous users assignment</label>";
        content += "</div>";
        //content += "<div class='col-lg-12 cls-Retain cls-no-padding' style='display:none;'>";
        //content += "<label><input type='checkbox' name='chkRetain'/>Retails all the previous users assignment</label></div>";
        content += "<div class='col-lg-12 cls-btn-submit cls-no-padding text-right'><input type='button' value='Cancel' class='cls-btn-cancel'/>";
        content += "<input type='button' value='Assign' class='cls-btn-assign'/></div><div class='clearfix'></div></div>";
        content += "</div>";
        content += "  <div class='clearfix'></div>";
        content += "  </div>";
        content += " <div class='clearfix'></div>";
        return content;
    },
    getTagDetails: function () {
        UploadServices.getDATagDetails(function (result) {
            USER_ASSIGNMENT.bindTagDetails(result);
        }, function (result) { });


        //var arData = new Array();
        //var daCode = {};
        //daCode.name = "daCode";
        //daCode.value = daCode_g;
        //DPAjax.requestInvoke('AssetUpload', 'GetDATagDetails', arData, 'POST', this.bindTagDetails, this.onFail);
    },
    bindTagDetails: function (jsonData) {

        if (jsonData != null && jsonData != undefined && jsonData != '') {
            var jsonUsers = jsonPath(jsonData, "$.[?(@.DA_Tag_Code=='USRID')]");
            if (jsonUsers.length > 0) {

            }
        }
    },
    bindEvents: function () {
        $('.cls-add-user').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.addUser(this);
        });
        $('.cls-remove-user').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.removeUser(this);
        });
        $('.clsAllUserlnk').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.selectAllUsers();
        });
        $('.clsAssignUserlnk').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.selectAllAssignUsers();
        });
        $('input[type=checkbox][name=chkDivision]').unbind('change').bind('change', function () {
            USER_ASSIGNMENT.filterUsers();
        });
        $('input[type=checkbox][name=chkUserTypes]').unbind('change').bind('change', function () {
            USER_ASSIGNMENT.filterUsers();
        });
        $('.cls-nav-btn .fa-caret-square-o-right').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.addAllUsers();
        });
        $('.cls-nav-btn .fa-caret-square-o-left').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.removeAllUsers();
        });
        $('.cls-pnl-lnk-div').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.selectAllDivisions();
        });
        $('.cls-pnl-lnk-UT').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.selectAllUserTypes();
        });
        $('.cls-btn-assign').unbind('click').bind('click', function () {
            $('#dvAssign').block({
                message: 'Processing...',
                css: { border: '2px solid #DDD' }
            });
            setTimeout(function () { USER_ASSIGNMENT.assignUsers(); }, 10);

        });
        $('.cls-btn-cancel').unbind('click').bind('click', function () {
            // $('#dvAssignAssetModal').modal('hide');
            HideModalPopup('dvAssignAssetModal');
        });
    },
    addUser: function (obj) {
        var row = $(obj).closest('tr').html();
        var code = $(obj).closest('tr').attr('code');
        var userId = $(obj).closest('tr').attr('user_id');
        var selectedHtml = row.replace(/fa fa-plus-circle/g, 'fa fa-minus-circle').replace(/cls-add-user/g, 'cls-remove-user');
        selectedHtml = selectedHtml.replace(/cls-selected-bg/g, '');
        $('#tblAssignUsers tbody').append('<tr code=' + code + ' user_id=' + userId + '>' + selectedHtml + '</tr>');
        $('.cls-remove-user').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.removeUser(this);
        });
        $(obj).closest('tr').hide();
        $('.cls-remove-user').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.removeUser(this);
        });
        $('.clsAssUserInfo').hide();
        if (noOfAssets_g > 1) {
            if (mode_g != "UNASSIGNED") {
                $('.cls-Retain').show();
            }
        }
        $('.cls-btn-submit').show();
        if ($('#tblAssignUsers tr:visible').length > 0) {
            //$('.fa-caret-square-o-right').show();
            $('.clsAssignUserlnk').text('Select All');
        }
        $('.cls-add-users-pnl-body').getNiceScroll().resize();
        $('.cls-remove-users-pnl-body').getNiceScroll().resize();
    },
    removeUser: function (obj) {
        var row = $(obj).closest('tr').html();
        // var code = $(obj).closest('tr').attr('code');
        var cell = $(obj).closest('td');
        var code = $(obj).closest('td').attr('user_id');
        $('#tblAllUsers tr td[user_id=' + code + ']').closest('tr').show();
        $('#tblAllUsers tr td[user_id=' + code + ']').closest('tr').removeClass('cls-selected-bg');
        $(obj).closest('tr').remove();
        $('.cls-remove-users-pnl-body').niceScroll();
        if ($('#tblAssignUsers tbody tr').length == 0) {
            $('.clsAssUserInfo').show();
            $('.cls-Retain').hide();
            $('.cls-btn-submit').hide();
        }
        if ($('#tblAllUsers tr:visible').length > 0) {
            // $('.fa-caret-square-o-left').show();
            $('.clsAllUserlnk').text('Select All');
        }
        $('.cls-add-users-pnl-body').getNiceScroll().resize();
        $('.cls-remove-users-pnl-body').getNiceScroll().resize();
    },
    addAllUsers: function () {
        // $('#tblAssignUsers tr').remove();
        var selectedRows = $('#tblAllUsers tbody tr:visible');
        $('#tblAllUsers tbody tr:visible').each(function () {
            var html = $(this).html();
            var code = $(this).attr('code');
            var userId = $('td[user_id]', $(this)).attr('user_id');
            //if ($('#tblAssignUsers tr[code=' + code + ']').length == 0) {
            if ($('#tblAssignUsers tr td[user_id=' + userId + ']').length == 0) {
                $('#tblAssignUsers tbody').append('<tr code=' + code + '>' + html + '</tr>');
            }
            $(this).hide();
        });
        $($('#tblAssignUsers tbody tr td')).removeClass('cls-selected-bg');
        $($('#tblAllUsers tbody tr td')).removeClass('cls-selected-bg');
        $('#tblAssignUsers tbody tr td i').removeClass('fa-plus-circle').removeClass('cls-add-user');
        $('#tblAssignUsers tbody tr td i').addClass('fa-minus-circle').addClass('cls-remove-user');
        $('.fa-caret-square-o-right').hide();
        $('.cls-remove-user').unbind('click').bind('click', function () {
            USER_ASSIGNMENT.removeUser(this);
        });
        $('.clsAssUserInfo').hide();
        if (noOfAssets_g > 1) {
            if (mode_g != "UNASSIGNED") {
                $('.cls-Retain').show();
            }
        }
        $('.cls-btn-submit').show();
        $('.cls-add-users-pnl-body').getNiceScroll().resize();
        $('.cls-remove-users-pnl-body').getNiceScroll().resize();
        $('.clsAllUserlnk').text('');
        $('.clsAssignUserlnk').text('Select All');
    },
    removeAllUsers: function () {
        $('#tblAssignUsers tbody tr').each(function () {
            var row = $(this);
            var code = $(this).attr('code');
            if ($('#tblAllUsers tr[code=' + code + ']').length > 0) {
                $('#tblAllUsers tr[code=' + code + ']').show();
            }
            $(this).remove();
            $('.fa-caret-square-o-left').hide();
            $($('#tblAllUsers tbody tr td')).removeClass('cls-selected-bg');
            $('#tblAllUsers tbody tr td i').removeClass('fa-minus-circle').removeClass('cls-remove-user');
            $('#tblAllUsers tbody tr td i').addClass('fa-plus-circle').addClass('cls-add-user');
        });
        if ($('#tblAssignUsers tbody tr').length == 0) {
            $('.clsAssUserInfo').show();
            $('.cls-Retain').hide();
            $('.cls-btn-submit').hide();
        }
        $('.cls-add-users-pnl-body').getNiceScroll().resize();
        $('.cls-remove-users-pnl-body').getNiceScroll().resize();
        $('.clsAssignUserlnk').text('');
        $('.clsAllUserlnk').text('Select All');
    },
    selectAllUsers: function () {
        if ($('.clsAllUserlnk').text().toUpperCase() == "SELECT ALL") {
            $('.clsAllUserlnk').text('Unselect All');
            $($('#tblAllUsers tbody tr:visible td')).addClass('cls-selected-bg');
            if ($('#tblAllUsers tr:visible').length > 1) {
                $('.fa-caret-square-o-right').show();
            }
        }
        else {
            $('.clsAllUserlnk').text('Select All');
            $($('#tblAllUsers tbody tr:visible td')).removeClass('cls-selected-bg');
            $('.fa-caret-square-o-right').hide();
        }
    },
    selectAllAssignUsers: function () {
        if ($('.clsAssignUserlnk').text().toUpperCase() == "SELECT ALL") {
            $('.clsAssignUserlnk').text('Unselect All');
            $($('#tblAssignUsers tbody tr td')).addClass('cls-selected-bg');
            if ($('#tblAssignUsers tr:visible').length > 1) {
                $('.fa-caret-square-o-left').show();
            }
        }
        else {
            $('.clsAssignUserlnk').text('Select All');
            $($('#tblAssignUsers tbody tr td')).removeClass('cls-selected-bg');
            $('.fa-caret-square-o-left').hide();
        }


    },
    filterUsers: function () {
        $('#tblAllUsers tr').hide();
        var checkedDivisions = [];
        checkedDivisions = $('input[name=chkDivision]:checked').map(function () {
            return $(this).val();
        }).get();
        var checkedUserTypes = $('input[name=chkUserTypes]:checked').map(function () {
            return $(this).val();
        }).get();
        if (checkedDivisions.length == 0) {
            checkedDivisions.push(USER_ASSIGNMENT.defaults.divisionJson[0].Division_Code);
        }
        // if (checkedUserTypes.length > 0) {
        var flag = false;
        for (var d = 0; d < checkedDivisions.length; d++) {
            for (var i = 0; i < checkedUserTypes.length; i++) {
                //if ($('#tblAssignUsers tr[code=' + checkedDivisions[d] + '_' + checkedUserTypes[i] + ']').length == 0) {
                if ($('#tblAllUsers tr[code=' + checkedDivisions[d] + '_' + checkedUserTypes[i] + ']').length > 0) {
                    $('#tblAllUsers tr[code=' + checkedDivisions[d] + '_' + checkedUserTypes[i] + ']').each(function (index, element) {
                        //if ($('#tblAssignUsers tr[user_id=' + $(element).attr('user_id') + ']').length == 0) {
                        if ($('#tblAssignUsers tr td[user_id=' + $(element).attr('user_id') + ']').length == 0) {
                            $(element).show();
                            flag = true;
                        }
                    });

                }
                // $('#tblAllUsers tr[code=' + checkedDivisions[d] + '_' + checkedUserTypes[i] + ']').show();
                // }
            }
        }
        //  alert(flag);
        if (flag) {
            $('.cls-user-list').css('width', '47%');
            $('.cls-user-mid').css('width', '6%');
            $('.cls-ass-user-list').css('width', '47%');
            $('#dvAssignUserList').show();
            $('#tblAllUsers').show();
            $('.clsUserInfo').hide();
            if ($('#tblAssignUsers tbody tr').length == 0) {
                $('.clsAssUserInfo').show();
            }
            if ($('#tblAssignUsers tr').length > 0) {
                if (noOfAssets_g > 1) {
                    if (mode_g != "UNASSIGNED") {
                        $('.cls-Retain').show();
                    }
                }
                $('.cls-btn-submit').show();
            }
            else {
                $('.cls-Retain').hide();
                $('.cls-btn-submit').hide();
            }
        }
        else {
            //if (USER_ASSIGNMENT.defaults.divisionJson.length > 1) {
            //    //$('.clsUserInfo').text('Please select division and user types to show the user list');
            //    $('.clsUserInfo').text('No users found based on the selection');
            //}
            //else {
            //    $('.clsUserInfo').text('Please select user types to show the user list ');
            //}
            $('.clsUserInfo').show();
            $('.clsUserInfo').text('No users found based on the selection');
            $('.clsAssUserInfo').text('Please select one or more users to assign');
            $('.cls-user-list').css('width', '47%');
            $('.cls-user-mid').css('width', '6%');
            $('.cls-ass-user-list').css('width', '47%');
            $('#dvAssignUserList').show();
            //$('#tblAssignUsers tbody tr').remove();
            //  $('.cls-user-list').css('width', '94%');
            // $('.cls-user-mid').css('width', '6%');
        }
        $('.cls-add-users-pnl-body').getNiceScroll().resize();
        $('.cls-remove-users-pnl-body').getNiceScroll().resize();
    },
    selectAllDivisions: function () {
        if ($('.cls-pnl-lnk-div').text().toUpperCase() == "SELECT ALL") {
            $("input:checkbox[name=chkDivision]").each(function () {
                this.checked = true;
            });
            $('.cls-pnl-lnk-div').text('Unselect All');
        }
        else {
            $('.cls-pnl-lnk-div').text('Select All');
            $("input:checkbox[name=chkDivision]").each(function () {
                this.checked = false;
            });
        }
        USER_ASSIGNMENT.filterUsers();
    },
    selectAllUserTypes: function () {
        if ($('.cls-pnl-lnk-UT').text().toUpperCase() == "SELECT ALL") {
            $("input:checkbox[name=chkUserTypes]").each(function () {
                this.checked = true;
            });
            $('.cls-pnl-lnk-UT').text('Unselect All');
        }
        else {
            $('.cls-pnl-lnk-UT').text('Select All');
            $("input:checkbox[name=chkUserTypes]").each(function () {
                this.checked = false;
            });
        }

        //$("input:checkbox[name=chkUserTypes]").each(function () {
        //    this.checked = true;
        //});
        USER_ASSIGNMENT.filterUsers();
    },
    getAssignUsersData: function () {
        var userId = "";
        var retainPreUsers = 0;
        $('#tblAssignUsers tbody tr').each(function (index, ele) {
            // userId = $($(ele).children('td')[2]).attr('user_id') + ",";
            userId += $('.cls-ass-user-id', $(ele)).val() + ",";
        });
        userId = userId.slice(0, -1);
        if ($('input[type=checkbox][name=chkRetainUser]').attr('checked')) {
            retainPreUsers = 1;
        }
        else {
            retainPreUsers = 0;
        }
        if (noOfAssets_g == 1) {
            retainPreUsers = 0;
        }
        var arData = new Array();
        arData.push(userId);
        arData.push(retainPreUsers);
        arData.push(daCode_g);
        arData.push(noOfAssets_g);
        return arData;
    },
    assignUsers: function () {
        var arData = new Array();
        //arData = USER_ASSIGNMENT.getAssignUsersData();

        var userId = "";
        var retainPreUsers = 0;
        var userAr = new Array();
        $('#tblAssignUsers tbody tr').each(function (index, ele) {
            // userId += $('.cls-ass-user-id', $(ele)).val() + ",";
            // var a = {};
            // a.User_Id = $('.cls-ass-user-id', $(ele)).val();
            userAr.push($('.cls-ass-user-id', $(ele)).val());
        });
        userId = userId.slice(0, -1);
        if ($('input[type=checkbox][name=chkRetainUser]').attr('checked')) {
            retainPreUsers = 1;
        }
        else {
            retainPreUsers = 0;
        }
        if (noOfAssets_g == 1) {
            retainPreUsers = 0;
        }

        UploadServices.insertAssetUserShared(retainPreUsers, false, userAr, function (result) { USER_ASSIGNMENT.assignUsersSuccess(result) }, function () { });
    },
    assignUsersSuccess: function (res) {
        debugger;
        //  if (res > 0) {
        if (res) {
            // var ar = daCode_g.split(',');
            // if (ar.length == noOfAssets_g) {
            $('#dvAssignUserSuccMsg').html('The selected users are successfully mapped to the asset(s)');
            $('#dvAssignUserSuccMsg').show();
            // $('#dvAssignAssetModal').modal('hide');
            HideModalPopup('dvAssignAssetModal');
            ASSETS.getAssetGroupCount();
            ASSETS.reloadPage('');
            //if (mode_g == "UNASSIGNED") {
            //    // Unassigned_Assets.getUnAssigendAssetPaging();
            //    $('#dvUnassigned').block({
            //        message: 'Processing...',
            //        css: { border: '2px solid #DDD' }
            //    });
            //    setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            //}
            //else {
            //    // Assigned_Assets.getAssigendAssetPaging();
            //    $('#dvUnassigned').block({
            //        message: 'Processing...',
            //        css: { border: '2px solid #DDD' }
            //    });
            //    setTimeout(function () { ASSETS.getAssignedAssets(); }, 10);
            //}
            $('#dvAssignUserSuccMsg').hide();
        }
        // }
        //  }

        $('#dvAssign').unblock();
    },
    assignUsersFailure: function () {
        $('#dvAssign').unblock();
    },
    getUsersMapped: function (id) {
        debugger;
        $('#hdnStagingCode').val(id);
        var ar = new Array();
        ar.push(id);
        UploadServices.getAssetDetailsByAssetIdV38(ar, function (result) { USER_ASSIGNMENT.bindAssignedUsersForSelectedAsset(result) }, function (result) { });

    },
    bindAssignedUsersForSelectedAsset: function (res) {
        console.log(res);
        var allusersJson = res;
        if (allusersJson != null && allusersJson != undefined && allusersJson != '') {
            var arr = [], //to collect user id values 
             collection = []; //collect unique object

            $.each(allusersJson[0].Users_Mapped, function (index, value) {
                if ($.inArray(value.User_Id, arr) == -1) { //check if id value not exits than add it
                    arr.push(value.User_Id);//push id value in arr
                    collection.push(value); //put object in collection to access it's all values
                }
            });
            var content = "";
            var i = 0;
            // $.each(collection, function (Index, itemresult) {
            $.each(collection, function (index, useritem) {
                //  content += "<table class='table table-hover cls-tbl-All-users' id='tblAllUsers'><tbody>";
                // for (var i = 0; i < collection.length; i++) {
                i++;
                var imgUrl = "../../Areas/HDNextGen/Content/images/profile-pic.jpg";
                content += " <tr code='" + useritem.Division_Code + "_" + useritem.User_Type_Code + "'>";
                if (useritem.Profile_Photo_BLOB_URL != null && useritem.Profile_Photo_BLOB_URL != '' && useritem.Profile_Photo_BLOB_URL != undefined) {
                    content += "<td><div> <a href='#'><img src='" + useritem.Profile_Photo_BLOB_URL + "' class='cls-img' /></a></div></td>";
                }
                else {
                    content += "<td><div> <a href='#'><img src=" + imgUrl + " class='cls-img' /></a></div></td>";
                }
                content += "<td>";
                content += "<div class='col-lg-12'>" + useritem.Employee_Name + "</div>";
                content += " <div class='col-lg-12'>" + useritem.User_Type_Name + " | "
                    + useritem.Region_Name + "</div></td>";
                content += "<td user_id=" + useritem.User_Id + "><span class='cls-remove-user'> <i class='fa fa fa-minus-circle'></i></span>";
                content += "<input type='hidden' class='cls-ass-user-id' value=" + useritem.User_Id + " id='hdnUserId_" + i + "'/> </td> </tr>";
                // }
                //  content += "</tbody></table>";
                // }
                $('#tblAllUsers tr td[user_id=' + useritem.User_Id + ']').closest('tr').hide();
            });
            //});
            $('#tblAssignUsers tbody').html(content);
            $('.cls-remove-user').unbind('click').bind('click', function () {
                USER_ASSIGNMENT.removeUser(this);
            });
            //$(obj).closest('tr').hide();
            $('.cls-remove-user').unbind('click').bind('click', function () {
                USER_ASSIGNMENT.removeUser(this);
            });
            $('.clsAssUserInfo').hide();
            if (noOfAssets_g > 1) {
                if (mode_g != "UNASSIGNED") {
                    $('.cls-Retain').show();
                }
            }
            $('.cls-btn-submit').show();

            if (i > 0) {
                $('.cls-user-list').css('width', '47%');
                $('.cls-user-mid').css('width', '6%');
                $('.cls-ass-user-list').css('width', '47%');
                $('#dvAssignUserList').show();
                $('#tblAllUsers').show();
                $('.clsUserInfo').hide();
                if ($('#tblAssignUsers tbody tr').length == 0) {
                    $('.clsAssUserInfo').show();
                }
                if ($('#tblAssignUsers tr').length > 0) {
                    if (noOfAssets_g > 1) {
                        if (mode_g != "UNASSIGNED") {
                            $('.cls-Retain').show();
                        }
                    }
                    $('.cls-btn-submit').show();
                }
                else {
                    $('.cls-Retain').hide();
                    $('.cls-btn-submit').hide();
                }
            }
            else {
                $('#dvAssignUserList').hide();
                $('#tblAssignUsers tbody tr').remove();
                $('.cls-user-list').css('width', '94%');
                $('.cls-user-mid').css('width', '6%');
            }
            $('.cls-add-users-pnl-body').getNiceScroll().resize();
            $('.cls-remove-users-pnl-body').getNiceScroll().resize();
        }
        $('#dvAssign').unblock();
    },


}



var Filter = function (options) {
    var self = this;
    this.options = options;
    this.selectedAssets = options.selectedAssets;
    this.wrapEl = null;
    this.el = null;
    this.filterTypes = null;
    this.init();

    self.resize();
    $(window).resize(function () {
        self.resize();
    });
};
Filter.prototype.init = function () {
    var self = this;
    this.wrapEl = $('<div class="wrapper-filter"></div>');
    this.hdrEl = $('<header></header>');
    this.el = $('<div class="filter-cont"></div>');

    this.wrapEl.append(this.hdrEl);

    this.wrapEl.append(this.el);
    // this.wrapEl.append('<div class="clearfix cls-fiter-btn">Ok</div>');
    $('body').append(this.wrapEl);
    this.el.append("<div class='col-lg-12 cls-fil-title'><a class='cls-fil-cancel' style='float: left;'>Cancel</a><a class='cls-file-title'>Filters</a><a style='float: right;' class='cls-fiter-bt'>Apply</a></div>");

    $('.cls-fiter-bt').unbind('click').bind('click', function () {
        if (self.options.onfilterselected)
            self.options.onfilterselected();

    });
    $('.cls-fil-cancel').unbind('click').bind('click', function () {
        ASSETS.filterEl.wrapEl.remove();
    });

    this.createFilters();
    this.createFilterOptions('category');
};
Filter.prototype.resize = function () {
    var hgt = $(window).height() - $('header').height();
    //this.filterTypes.css('height', 480);
    //$('.filter-details').css('height', 480);
};
Filter.prototype.show = function () {
    this.wrapEl.show();
};
Filter.prototype.hide = function () {
    this.wrapEl.remove();
};
Filter.prototype.createFilters = function () {
    var filterTypes = '<div class="filter-option">';
    filterTypes += '<ul>';
    filterTypes += '<li><a class="active" href="#" title="category"><span class="fa fa-list"></span><span class="filter-option-title">Category</span><span class="filter-count" style="display: none"></span></a></li>';
    filterTypes += '<li><a href="#" title="types"><span class="fa fa-columns"></span><span class="filter-option-title">Type</span><span class="filter-count" style="display: none"></span></a></li>';
    filterTypes += '<li><a href="#" title="users"><span class="fa fa-user"></span><span class="filter-option-title">Uploaded By</span><span class="filter-count" style="display: none"></span></a></li>';
    filterTypes += '<li><a href="#" title="tags"><span class="fa fa-tags"></span><span class="filter-option-title">Tags</span><span class="filter-count" style="display: none"></span></a></li>';

    filterTypes += '</ul>';
    filterTypes += '<a class="cls-fil-clear">Clear All</a>';
    filterTypes += '</div>';
    this.el.append(filterTypes);

    for (var typeName in this.selectedAssets) {
        if (this.selectedAssets[typeName].length > 0) {
            $('a[title="' + typeName + '"] .filter-count').show().text(this.selectedAssets[typeName].length);
        }
    }

    this.filterTypes = $('.filter-option');
    this.bindActions();
    $('.cls-fil-clear').unbind('click').bind('click', function () {
        $('.filter-details ul li input').each(function (i, el) {
            el.checked = false;
            $('a .filter-count').hide().text(0);
        });
        if (ASSETS.filterEl != null) {
            ASSETS.filterEl.selectedAssets["category"] = new Array();
            ASSETS.filterEl.selectedAssets["tags"] = new Array();
            ASSETS.filterEl.selectedAssets["types"] = new Array();
            ASSETS.filterEl.selectedAssets["users"] = new Array();
        }
    });
};
Filter.prototype.createFilterOptions = function (filterId) {
    $('.filter-details').remove();
    this.resize();

    var self = this, filterCont = '<div class="filter-details">';
    filterCont += '<div class="filter-search"><input type="text" value="" placeholder="Search category"/></div>';
    filterCont += '<br/><a href="#" title="clear all" class="clear-filters">Clear <span class="fa fa-remove"></span></a>';
    var items = new Array();

    if (filterId == 'category') {
        items = this.getUniqueCategories(function (data) {
            self.htmlItems(data, filterCont, filterId);
        });
    } else if (filterId == 'types') {
        items = this.getUniqueTypes(function (data) {
            self.htmlItems(data, filterCont, filterId);
        });
    } else if (filterId == 'users') {
        items = this.getUniqueUsers(function (data) {
            self.htmlItems(data, filterCont, filterId);
        });
    } else if (filterId == 'tags') {
        items = this.getUniqueTags(function (data) {
            self.htmlItems(data, filterCont, filterId);
        });
    }
};
Filter.prototype.htmlItems = function (items, filterCont, typeName) {
    var count = 0, listHtml = '';
    for (var i = 0; i < items.length; i++) {
        count = count + items[i].count;
        listHtml += '<li ' + (items[i].count <= 0 ? 'class="disabled"' : '') + '><span class="list-title">' + items[i].name + ' (' + items[i].count + ')</span>';
        if (this.selectedAssets[typeName] !== undefined && this.selectedAssets[typeName].length > 0) {
            var isChecked = false;
            for (var j = 0; j < this.selectedAssets[typeName].length; j++) {
                if (items[i].value == this.selectedAssets[typeName][j]) {
                    isChecked = true;
                }
            }
            if (items[i].count > 0) {
                listHtml += '<span class="list-input">';
                listHtml += '<input type="checkbox" value="' + items[i].value + '" ' + (isChecked ? 'checked' : '') + '/>';
                listHtml += '</span>';
            }
        } else {
            var isChecked = false;
            if (this.selectedAssets !== undefined && this.selectedAssets[typeName] !== undefined) {
                for (var j = 0; j < this.selectedAssets[typeName].length; j++) {
                    if (items[i].value == this.selectedAssets[typeName][j]) {
                        isChecked = true;
                    }
                }
            }
            if (items[i].count > 0) {
                listHtml += '<span class="list-input">';
                listHtml += '<input type="checkbox" value="' + items[i].value + '" ' + (isChecked ? 'checked' : '') + '/>';
                listHtml += '</span>';
            }
        }
        listHtml += '</li>';
    }

    filterCont += '<ul>';
    //filterCont += '<li><span class="list-title">All (' + count + ')</span><span class="list-input"><input type="checkbox" value="All"/></span></li></li>';
    filterCont += listHtml;
    filterCont += '</ul>';
    filterCont += '</div>';
    this.el.append(filterCont);

    // this.el.append('<div class="clearfix cls-fiter-btn">Ok</div>');
    this.bindSearchItems(typeName);
    this.bindCheckActions(typeName);
    // $('.cls-fiter-btn', this.el).remove();
    //this.el.append('<div class="clearfix cls-fiter-btn">Ok</div>');
    //var self = this;
    //$('.cls-fiter-btn').unbind('click').bind('click', function () {
    //    if (self.options.onfilterselected)
    //        self.options.onfilterselected();

    //});
};
Filter.prototype.bindActions = function () {
    var self = this;
    $('li a', this.filterTypes).unbind('click').bind('click', function () {
        $('li a', self.filterTypes).removeClass('active');
        $(this).addClass('active');
        self.createFilterOptions($(this).attr('title'));
        return false;
    });
};
Filter.prototype.bindCheckActions = function (typeName) {
    var self = this;
    $('.list-input').bind('change', function () {
        self.showSelectedCount(typeName);
    });
};
Filter.prototype.bindSearchItems = function (typeName) {
    var self = this;
    $('.filter-search input').bind('change', function () {
        var inputVal = $(this).val().toLowerCase();
        $('.filter-details ul li').each(function (i, el) {
            var val = $('.list-title', $(el)).text().toLowerCase();;
            if (val.indexOf(inputVal) > -1)
                $(el).show();
            else
                $(el).hide();
        });
    });
    $('.clear-filters').unbind('click').bind('click', function () {
        $('.filter-details ul li input').each(function (i, el) {
            el.checked = false;
            $('a[title="' + typeName + '"] .filter-count').hide().text(0);
        });
        self.selectedAssets[typeName] = new Array();
        return false;
    });
};
Filter.prototype.showSelectedCount = function (typeName) {
    var self = this;
    if (self.selectedAssets == undefined || self.selectedAssets[typeName] == undefined)
        self.selectedAssets[typeName] = new Array();
    var typeArrayEl = $('.list-input input:checked'), typeArray = new Array();
    $.each(typeArrayEl, function (i, el) {
        typeArray.push(el.value);
    });
    self.selectedAssets[typeName] = typeArray;
    if (typeArray.length > 0) {
        $('a[title="' + typeName + '"] .filter-count').show().text(typeArray.length);
    } else {
        $('a[title="' + typeName + '"] .filter-count').hide();
    }
};
Filter.prototype.getUniqueCategories = function (success, failure) {
    //debugger;
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = servicesFilter['getFilterCategoriesUnassign'];
    } else {
        servObj = servicesFilter['getFilterCategoriesAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;

    var searchText = $('#txtAssignSearch').val();
    if (searchText == '') {
        searchText = null;
    }

    var obj = {};
    obj.Group_Name = $('#hdnAssetGroup').val();
    obj.Category_Filters = categoryValue;
    obj.File_Type_Filters = typeValue
    obj.Tag_Filters = tagsValue
    obj.Uploaded_By_User_Filters = userValue
    obj.Search_Text = searchText

    servObj(obj, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].DA_Category_Name, count: data[i].Asset_Count, value: data[i].DA_Category_Code });
        }
        if (success) success(formattedAssets);
    }, function () { });
};
Filter.prototype.getUniqueTypes = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = servicesFilter['getFilterFilesUnassign'];
    } else {
        servObj = servicesFilter['getFilterFilesAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;

    var searchText = $('#txtAssignSearch').val();
    if (searchText == '') {
        searchText = null;
    }

    var obj = {};
    obj.Group_Name = $('#hdnAssetGroup').val();
    obj.Category_Filters = categoryValue;
    obj.File_Type_Filters = typeValue
    obj.Tag_Filters = tagsValue
    obj.Uploaded_By_User_Filters = userValue
    obj.Search_Text = searchText

    servObj(obj, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].File_Extension, count: data[i].Asset_Count, value: data[i].File_Extension });
        }
        if (success) success(formattedAssets);
    }, function () { });
};
Filter.prototype.getUniqueUsers = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = servicesFilter['getFilterUsersUnassign'];
    } else {
        servObj = servicesFilter['getFilterUsersAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;
    var searchText = $('#txtAssignSearch').val();
    if (searchText == '') {
        searchText = null;
    }

    var obj = {};
    obj.Group_Name = $('#hdnAssetGroup').val();
    obj.Category_Filters = categoryValue;
    obj.File_Type_Filters = typeValue
    obj.Tag_Filters = tagsValue
    obj.Uploaded_By_User_Filters = userValue
    obj.Search_Text = searchText

    servObj(obj, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].Employee_Name, count: data[i].Asset_Count, value: data[i].Uploaded_By });
        }
        if (success) success(formattedAssets);
    }, function () { });
};
Filter.prototype.getUniqueTags = function (success, failure) {
    var formattedAssets = new Array(), servObj = null;
    if (this.options.isUnassign == true) {
        servObj = servicesFilter['getFilterTagsUnassign'];
    } else {
        servObj = servicesFilter['getFilterTagsAssign'];
    }

    var categoryValue = this.selectedAssets['category'].length > 0 ? this.selectedAssets['category'].join() : null,
        typeValue = this.selectedAssets['types'].length > 0 ? this.selectedAssets['types'].join() : null,
        tagsValue = this.selectedAssets['tags'].length > 0 ? this.selectedAssets['tags'].join() : null,
        userValue = this.selectedAssets['users'].length > 0 ? this.selectedAssets['users'].join() : null;

    var searchText = $('#txtAssignSearch').val();
    if (searchText == '') {
        searchText = null;
    }

    var obj = {};
    obj.Group_Name = $('#hdnAssetGroup').val();
    obj.Category_Filters = categoryValue;
    obj.File_Type_Filters = typeValue
    obj.Tag_Filters = tagsValue
    obj.Uploaded_By_User_Filters = userValue
    obj.Search_Text = searchText

    servObj(obj, function (data) {
        for (var i = 0; i < data.length; i++) {
            formattedAssets.push({ name: data[i].DA_Tag_Value, count: data[i].Asset_Count, value: data[i].DA_Tag_Value });
        }
        if (success) success(formattedAssets);
    }, function () { });
};

