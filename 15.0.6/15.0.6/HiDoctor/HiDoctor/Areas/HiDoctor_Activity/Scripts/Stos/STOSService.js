 
var STOSServices = {
    
    STOSApi: "",      
     
    getSTOSDoctorDetails: function (companyCode, RegionCode, success, failure) {        
        var _this = STOSServices;         
        context = ["Api/v1/Doctor", companyCode, RegionCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    getSTOSSpeciality: function (companyCode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/Speciality", companyCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    getSTOSProductDetails: function (companyCode, RegionCode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/Product", companyCode, RegionCode];
        CoreREST.get(_this, context, null, success, failure);
    },

    postSTOSProductData: function (companyCode, objRequest, success, failure) {
    var _this = STOSServices;
    context = ["Api/v1/STOS", companyCode];
    CoreREST.post(_this, context, objRequest, success, failure);
    },

    getSTOSViewDetails: function (companyCode, userCode, userTypeName, mode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSSummary", companyCode, userCode, userTypeName, mode];
        CoreREST.get(_this, context, null, success, failure);
    },

    getParticularSTOSDetails: function (companyCode, userCode, STOSId, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOS/ParticularSTOS/", companyCode, userCode, STOSId];
        CoreREST.get(_this, context, null, success, failure);
    },

    getOrderStatusDetailsRequest: function (CompanyCode, StatusOwnerType, mode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOS/Order/", CompanyCode, StatusOwnerType, mode];
        CoreREST.get(_this, context, null, success, failure);
    },

    postSTOSDocProductData: function (companyCode, mode, objRequest, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSDocProduct", companyCode, mode];
        CoreREST.post(_this, context, objRequest, success, failure);
    },

    postSTOSCancel: function (CompanyCode, STOS_Id, objRequest, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOS/Cancel/", CompanyCode, STOS_Id];
        CoreREST.post(_this, context, objRequest, success, failure);
    },
    getSTOSView: function (CompanyCode, STOS_Id, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSView", CompanyCode, STOS_Id];
        CoreREST.get(_this, context, null, success, failure);
    },

    getSTOSRequestByUser: function (CompanyCode, regionCode, userTypeName, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSReqByUser/", CompanyCode, regionCode, userTypeName];
        CoreREST.get(_this, context, null, success, failure);
    },

    getSTOSUserRequestDetails: function (CompanyCode, STOSId, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSUserRequestDetails/", CompanyCode, STOSId];
        CoreREST.get(_this, context, null, success, failure);
    },

    getSTOSOrderStatusDetails: function (CompanyCode, cycleCode, moveOrder, userTypeName, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOS/Order/", CompanyCode, cycleCode, moveOrder, userTypeName];
        CoreREST.get(_this, context, null, success, failure);
    },
    getSTOSEdit: function (CompanyCode, DoctorName, STOS_Id, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSEdit/", CompanyCode, DoctorName, STOS_Id];
        CoreREST.get(_this, context, null, success, failure);
    },

    getActiveUser: function (CompanyCode, userCode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/user/", CompanyCode, userCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    postUpdateSTOS: function (CompanyCode, objRequest, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/UpdateSTOS/", CompanyCode];
        CoreREST.post(_this, context, objRequest, success, failure);
    },

    getUploadedImages: function (CompanyCode, stosId, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOS/Images/", CompanyCode, stosId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getHistoryHeader: function (CompanyCode, stosId, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/HistoryHeader/", CompanyCode, stosId];
        CoreREST.get(_this, context, null, success, failure);
    },

    postSTOSStatusChange: function (companyCode, objRequest, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/StatusChange/", companyCode];
        CoreREST.post(_this, context, objRequest, success, failure);
    },

    getSTOSDocProductHistory: function (companyCode, stosid, STOSHistoryId, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSDocProductHistory/", companyCode, stosid, STOSHistoryId];
        CoreREST.get(_this, context, null, success, failure);
    },

    getSTOSFinalStage: function (companyCode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/Finalstage/", companyCode];
        CoreREST.get(_this, context, null, success, failure);
    },

    getSTOSFinalDocProductDetails: function (companyCode, STOSId, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSFinalDocProductDetails/", companyCode, STOSId];
        CoreREST.get(_this, context, null, success, failure);
    },

    getSTOSDepot: function (companyCode, RegionCode, success, failure) {
        debugger;
        var _this = STOSServices;
        context = ["Api/v1/Depot", companyCode, RegionCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    
    getSTOSinwardDepot: function (companyCode, RegionCode, success, failure) {
        debugger;
        var _this = STOSServices;
        context = ["Api/v1/GetDepot", companyCode, RegionCode];
        CoreREST.get(_this, context, null, success, failure);
    },

    postInsertInwardAllocation: function (companyCode, Mode, userName ,objRequest, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/InwardAllocation/", companyCode, Mode,userName];
        CoreREST.post(_this, context, objRequest, success, failure);
    },

    getSTOSRemarks: function (companyCode, STOS_Id, STOS_History_Id, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSRemarks/", companyCode, STOS_Id, STOS_History_Id];
        CoreREST.get(_this, context, null, success, failure);
    },

    PostDeleteDocProduct: function (companyCode, objRequest, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/DeleteDocProduct/", companyCode];
        CoreREST.post(_this, context, objRequest, success, failure);
    },

    getCheckActiveUserStatus: function (companyCode, User_Code, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/ActiveUserStatus/", companyCode, User_Code];
        CoreREST.get(_this, context, null, success, failure);
    },
    getEmailtrigger: function (Company_code,userName, data, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSWeeklyMail/", Company_code,userName];
        CoreREST.post(_this, context, data, success, failure);
    },
    getdetailsformail: function (companyCode, RegionCode, userCode, success, failure) {
        var _this = STOSServices;
        context = ["Api/v1/STOSWeeklDetails/", companyCode, RegionCode, userCode];
        CoreREST.get(_this, context, null, success, failure);
    },

}

