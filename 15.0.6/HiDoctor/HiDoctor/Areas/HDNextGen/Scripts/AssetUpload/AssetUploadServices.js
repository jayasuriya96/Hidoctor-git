var commonValues = {
    defaults: {
        timeZoneOffSet: new Date().getTimezoneOffset()
    },
    getUTCOffset: function () {
        var offset = (new Date()).getTimezoneOffset();
        if (offset < 0) {
            offset = 10000 + Math.abs(offset);
        }
        return offset;
    },
};
var UploadServices = {
    subdomainName: "",
    utcOffset: commonValues.getUTCOffset(),
    companyId: "",
    userId: "",
    userCode: "",
    companyCode: "",
    empName: "",
    regionCode: "",
    currentDate: "",
    is_share_Count_g: "",
    Access_Allowed: "",
    context: {
        AutoSignOnApi: 'AutoSignOnApi',
        AutoSignOnAssetApi: 'AutoSignOnAssetApi'
    },
    Version_No: 3.9,
    offset: commonValues.getUTCOffset(),
    APIURL: "/",
    getAssetGroupingCount: function (success, failure) {
        var _this = UploadServices, context = '';
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetsGroupCount', _this.subdomainName,
            _this.companyId, _this.userId, _this.userCode]
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    getThirdPartyAccess: function (success, failure) {
        var _this = UploadServices, context = '';
        var context = [_this.context.AutoSignOnAssetApi, 'GetCustomerKangleModuleAccess', _this.subdomainName,
            _this.companyId, _this.userId, 'THIRD_PARTY']
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    //getAssetPaging: function (pageSize, categoryFilter, typeFilter, tagsFilter, uploadedByFilter, searchText, success, failure) {
    //    var _this = UploadServices, context = '';
    //    alert(_this.subdomainName);
    //    var context = [_this.context.AutoSignOnApi, 'GetAssignedAssetPagingDetailsForV38', _this.subdomainName,
    //        _this.companyId, _this.userId, pageSize, categoryFilter, typeFilter, tagsFilter, uploadedByFilter, searchText]
    //    CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    //},
    getAssetPaging: function (pageSize, obj, success, failure) {
        var _this = UploadServices, context = '';
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetPagingDetailsFor39', _this.subdomainName,
            _this.companyId, _this.userId, pageSize, _this.Version_No]
        CoreREST._raw(_this.APIURL, "POST", context, obj, success, failure);
    },
    //getAssignedAssets: function (pageNumber, pageSize, categoryFilter, typeFilter, tagsFilter, uploadedByFilter, searchText, sortMode, success, failure) {
    //    var _this = UploadServices, context = '';
    //    var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetsWithPagingForV39', _this.subdomainName, _this.companyId,
    //         _this.userId, pageNumber, pageSize, categoryFilter, typeFilter, tagsFilter,
    //       uploadedByFilter, searchText, _this.utcOffset, sortMode]
    //    CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    //},

    getAssignedAssets: function (pageNumber, pageSize, columnName, orderBy, obj, success, failure) {
        var _this = UploadServices, context = '';
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetsWithPagingForV39', _this.subdomainName, _this.companyId,
             _this.userId, pageNumber, pageSize, columnName, orderBy, _this.utcOffset, _this.Version_No]
        CoreREST._raw(_this.APIURL, "POST", context, obj, success, failure);
    },
    getDateFormat: function (success, failure) {
        debugger;
        var _this = UploadServices, context = '';
        context = [_this.context.AutoSignOnApi, 'GetDateDisplayFormat', _this.subdomainName, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    getCategory: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssetCategories', _this.subdomainName, _this.companyCode, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    checkCustomerSharable: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetLandingPageAccess', _this.subdomainName, _this.companyId, _this.userId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    getTagNames: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssetTags', _this.subdomainName, _this.companyCode, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    saveCategory: function (categoryName, data, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'AddNewCategory', _this.subdomainName, _this.companyCode,
            _this.companyId, categoryName, _this.userId, _this.userCode];
        CoreREST._rawPostFile(_this.APIURL, 'POST', context, data, success, failure);
    },
    updateProperties: function (isRetain, obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'UpdateAssignedAssetPropertiesForV39', _this.subdomainName, _this.companyId,
                 _this.userId, isRetain, _this.userCode, _this.companyCode];
        CoreREST.postArray(_this.APIURL, context, obj, success, failure);
    },
    saveThumbnail: function (stagingCode, data, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'UpdateAssetThumbnailOfAssignedAsset', _this.subdomainName, _this.companyId,
        stagingCode, _this.userId];
        CoreREST._rawPostFile(_this.APIURL, 'POST', context, data, success, failure);
    },
    retireAsset: function (stagingCode, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'RetireAssignedAssetsForV38', _this.subdomainName, _this.companyId,
            _this.userId, _this.userCode, stagingCode];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    changeFile: function (stagingCode, fileSize, data, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'ChangeAssignedAssetFileForV38', _this.subdomainName, _this.companyId,
            _this.userId, stagingCode, commonValues.getUTCOffset(), fileSize];
        CoreREST._rawPostFile(_this.APIURL, 'POST', context, data, success, failure);
    },
    assignToAllUsers: function (stagingCode, stagingCount, userArray, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'InsertAssetUserShared', _this.subdomainName, 0, stagingCode, stagingCount, _this.companyId, _this.companyCode, _this.userCode, mode_g, _this.userId, true];
        CoreREST.postArray(_this.APIURL, context, userArray, success, failure);
    },
    getAllActiveDistictUsers: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'GetDistinctActiveUsers', _this.subdomainName, _this.companyId, _this.userId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    ShareAssets: function (stagingCode, stagingCount, users, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'InsertAssetUserShared', _this.subdomainName, 1, stagingCode,
            stagingCount, _this.companyId, _this.companyCode, _this.userCode, mode_g, _this.userId, false];
        CoreREST.postArray(_this.APIURL, context, users.split(','), success, failure);
    },
    getAssetDetailsByAssetIdV38: function (id, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssetDetailsByTargetAssetIds', _this.subdomainName, _this.companyId, _this.userId,
             commonValues.getUTCOffset(), _this.Version_No];
        CoreREST.postArray(_this.APIURL, context, id, success, failure);
    },
    getAssetDetailsByAssetId: function (id, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssetDetailsByTargetAssetIds', _this.subdomainName, _this.companyId, _this.userId,
            , commonValues.getUTCOffset(), _this.Version_No];
        CoreREST.postArray(_this.APIURL, context, id, success, failure);
    },
    getUsersMappedToAssetsByAssetIdWithPaging: function (stagingCode, userPageNo, userPageSize, searchText, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetUsersMappedToAssetsByAssetIdWithPagingForV39', _this.subdomainName, _this.companyId, stagingCode, userPageNo, userPageSize, searchText];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    updateAssetName: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'UpdateAssetNameOfAssignedAssetForV38', _this.subdomainName, _this.companyId,
            , _this.userId];
        CoreREST._raw(_this.APIURL, "POST", context, obj, success, failure);
    },
    updateAssetCategory: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'UpdateAssetCategoryOfAssignedAssetForV38', _this.subdomainName, _this.companyId,
           _this.userId];
        CoreREST.postArray(_this.APIURL, context, obj, success, failure);
    },
    updateDesc: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'UpdateAssetDescriptionOfAssignedAssetForV38', _this.subdomainName, _this.companyId,
           _this.userId];
        CoreREST.postArray(_this.APIURL, context, obj, success, failure);
    },
    updateAssetTags: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'UpdateAssetTagsOfAssignedAssetForV38', _this.subdomainName, _this.companyId,
            _this.userId, _this.userCode, _this.companyCode, false];
        CoreREST.postArray(_this.APIURL, context, obj, success, failure);
    },
    getCustomerEntityWithPaging: function (customerPageNo, pageSize, filterDetails, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetCKCustomerEntityWithPaging', _this.subdomainName, _this.companyId,
                customerPageNo, pageSize];
        CoreREST.postArray(_this.APIURL, context, filterDetails.split('~'), success, failure);
    },
    getAllCKCustomerWiseWithEntityWithPaging: function (customerPageNo, pageSize, filterDetails, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAllCKCustomerWiseWithEntityWithPaging', _this.subdomainName, _this.companyId,
         customerPageNo, pageSize];
        CoreREST.postArray(_this.APIURL, context, filterDetails.split('~'), success, failure);
    },
    getPreviewData: function (val, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetPreviewdata', _this.subdomainName, _this.companyId, val];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    insertAssetCustomerSharing: function (stagingCode, templateId, mode, ar, isTrue, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'InsertAssetCustomerSharing', _this.subdomainName, _this.companyId, _this.userId,
            stagingCode.split(',').length, isTrue, mode, templateId];
        CoreREST.postArray(_this.APIURL, context, ar, success, failure);
    },
    insertAssetEntityMapping: function (stagingCode, templateId, mode, ar, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'InsertAssetEntiryMapping', _this.subdomainName, _this.companyId, _this.userId, stagingCode.split(',').length, mode, templateId];
        CoreREST.postArray(_this.APIURL, context, ar, success, failure);
    },
    UpdateAssetThumbnailOfAssignedAsset: function (stagingCode, data, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'UpdateAssetThumbnailOfAssignedAsset', _this.subdomainName, _this.companyId,
         stagingCode, _this.userId];
        CoreREST._rawPostFile(_this.APIURL, 'POST', context, data, success, failure);
    },
    getAllActiveUsers: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'GetAllActiveUsers', _this.subdomainName, _this.companyId, _this.userId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    getDATagDetails: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'GetDATagDetails', _this.subdomainName, daCode_g, _this.companyCode, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    insertAssetUserShared: function (retainPreUsers, isTrue, userAr, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnApi, 'InsertAssetUserShared', _this.subdomainName, retainPreUsers, noOfAssets_g, _this.companyId, _this.companyCode, _this.userCode, mode_g, _this.userId, isTrue];
        CoreREST.postArray(_this.APIURL, context, userAr, success, failure);
    },
    uploadAsset: function (size, obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'UploadAsset', this.subdomainName, _this.companyId, _this.userId, 'WEB'
       , size, _this.Version_No];
        CoreREST._rawPostFile(_this.APIURL, 'POST', context, obj, success, failure);
    },
    getSpecialities: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetCustomerSpecialityByCompany', _this.subdomainName, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    getCustomerDomain: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetCustDomain', _this.subdomainName, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    getCustomerSpeciality: function (success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetSpecialityForAssetMapping', _this.subdomainName, _this.companyId];
        CoreREST._raw(_this.APIURL, "GET", context, null, success, failure);
    },
    insertAssetSpeciality: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'InsertAssetSpeciality', _this.subdomainName, _this.companyId, _this.userId];
        CoreREST.postArray(_this.APIURL, context, obj, success, failure);
    }
}

var servicesFilter = {
    getFilterCategoriesAssign: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetFilterCategoryForV39', _this.subdomainName, _this.companyId, _this.userId, _this.Version_No];
        CoreREST._raw(_this.APIURL, 'POST', context, obj, success, failure);
    },

    getFilterFilesAssign: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetFilterFileExtensionForV39', _this.subdomainName, _this.companyId, _this.userId, _this.Version_No];
        CoreREST._raw(_this.APIURL, 'POST', context, obj, success, failure);
    },

    getFilterTagsAssign: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetFilterTagsForV39', _this.subdomainName, _this.companyId, _this.userId, _this.Version_No];
        CoreREST._raw(_this.APIURL, 'POST', context, obj, success, failure);
    },

    getFilterUsersAssign: function (obj, success, failure) {
        var _this = UploadServices;
        var context = [_this.context.AutoSignOnAssetApi, 'GetAssignedAssetFilterUsersForV39', _this.subdomainName, _this.companyId, _this.userId, _this.Version_No];
        CoreREST._raw(_this.APIURL, 'POST', context, obj, success, failure);
    }
};