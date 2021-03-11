// Dont User The Object Directly. Strictly Use The Copy of the object using "Object.assign({},MailObject)"
// Do Not change the Properties untill new properties added in the EMail Template
var MailObject = {
    //data: {
    //    Add_1: "",
    //    Add_2: "",
    //    Add_3: "",
    //    Add_4: "",
    //    Add_5: "",
    //    Authority_Signature: "",
    //    Can_Mobile: "",
    //    CTC: "",
    //    Cc_Mail: "",
    //    Company_Logo_Path: "",
    //    Date: "",
    //    Designation: "",
    //    Designation_Name: "",
    //    Division_Name: "",
    //    DYN_PARTICULARS: "",
    //    Due_Date: "2",
    //    First_Name: "",
    //    Full_Name: "",
    //    filename: "",
    //    filepath: "",
    //    File_Url: "",
    //    GM_ZBM_RBM_File: "",
    //    HR_Name: "",
    //    HeadQuarter: "",
    //    Human_Resources: "",
    //    Last_Name: "",
    //    lstOffer: [],
    //    Location: "",
    //    No_Of_Days: 0,
    //    Mail_Sender_Name: "",
    //    Mail_Subject: "",
    //    Manager: "",
    //    Manager_Contact_No: "",
    //    Manager_Name: "",
    //    Medical_Fitness: "",
    //    Mobile: "",
    //    Pincode: "",
    //    Place: "",
    //    Position: "",
    //    Probation_Trainee: "",
    //    RM_SM_VP_SM: "",
    //    Ref_No: "",
    //    Req_Date: "",
    //    Salutation: "",
    //    Sender_Mail: "",
    //    sec_cc: "",
    //    State: "",
    //    To_Mail: "",
    //    Training_Position: "",
    //    Region_Name: "",
    //    Offer_Position: "",
    //    Offer_Design: "",
    //    Reporting_Region: ""
    //},
    data: {
        filename: "",
        action_date: "",
        employee_name: "",
        employee_number: "",
        designation: "",
        region_name: "",
        expcall_avg: "",
        actcall_avg: "",
        CallAvg_month: "",
        CallAvg_year: "",
        send_flag: "",
        filepath: "",
        Attachment: '',
        mail_subject: "",
        to_mail: "",
        req_id: "",
        Sender_Emp_Name: "",
        header: "",
        absence_from_date: "",
        User_name:"",
        Password: "",
        URL: "",
        Mail_Sender_Name: "",
        Sender_Mail: "",
        cc_mail:""

    },
}
var PDFGenerator = {
    GenerateOffer: function (ReqType, URL, Header, Data, SuccessCB, FailureCB) {
        $.ajax({
            type: ReqType,
            headers: Header,
            url: URL,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                SuccessCB(result);
            },
            error: function (result) {
                FailureCB(result);
            }
        });
    },
}
var Notifications = {
    GetHost: function (Group_Id, CompanyCode, DivisionName, TemplateName, SuccessCB, FailureCB) {
        $.ajax({
            type: 'GET',
            url: '/MPRFApi/GetNotificationHost' + "/" + Group_Id + "/" + CompanyCode + "/" + DivisionName + "/" + TemplateName,
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                SuccessCB(result);

            },
            error: function (result) {
                FailureCB(result);
            }
        });
    },
    Trigger: function (ReqType, URL, Header, Data, SuccessCB, FailureCB) {
        $.ajax({
            type: ReqType,
            headers: Header,
            url: URL,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                SuccessCB(result);
            },
            error: function (result) {
                FailureCB(result);
            }
        });
    },
    KangleTest: function (objData, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            url: TemplateUrl + '/transaction_schedule/sendKangleWrittenTestEmail/3',
            //url: TemplateUrl + '/transaction_schedule/sendKangleWrittenTestEmail/' + groupId,
            data: JSON.stringify(objData),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                SuccessCB(result);

            },
            error: function (result) {
                FailureCB(result);
            }
        });
    },
    OfferRelease: function (objData, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            //url: TemplateUrl + '/transaction_schedule/sendOfferPdfMail/' + groupId,
            url: TemplateUrl + '/transaction_schedule/sendOfferPdfMail/3',
            data: JSON.stringify(objData),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                SuccessCB(result);
            },
            error: function (result) {
                FailureCB(result);
            },
        });
    },
    InterviewerSchedule: function (objData, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            url: TemplateUrl + '/transaction_schedule/sendEvaluatorObservationEmail/3',
            //url: TemplateUrl + '/transaction_schedule/sendEvaluatorObservationEmail/' + groupId,
            data: JSON.stringify(objData),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
            },
            error: function (result) {
            }
        });
    },
    CandidateSchedule: function (objData, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            url: TemplateUrl + '/transaction_schedule/sendEvaluatorEmail/3',
            //url: TemplateUrl + '/transaction_schedule/sendEvaluatorEmail/' + groupId,
            data: JSON.stringify(objData),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
            },
            error: function (result) {
            }
        });
    },
    RequestDocuments: function (objData, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            url: TemplateUrl + '/transaction_schedule/sendSelectedDocumentEmail/3',
            //url: TemplateUrl + '/transaction_schedule/sendSelectedDocumentEmail/' + groupId,
            data: JSON.stringify(objData),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                SuccessCB(result);
            },
            error: function (result) {
                FailureCB(result);
            }
        });
    },
    WelcomeMail: function (objData, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            url: TemplateUrl + '/transaction_schedule/sendAutoReplymail/3',
            //url: TemplateUrl + '/transaction_schedule/sendAutoReplymail/' + groupId,
            data: JSON.stringify(objData),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
            },
            error: function (result) {
            }
        });
    },
}
var Maillog = {
    PostData: function (Obj, SuccessCB, FailureCB) {
        $.ajax({
            type: 'POST',
            url: "http://hdlog.hidoctor.me/api/ErrorLogServices",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(Obj),
            success: function (response) {
                debugger;
                console.log(response);
                SuccessCB(response);
            },
            error: function (err) {
                FailureCB(err);
            }
        })
    }
}