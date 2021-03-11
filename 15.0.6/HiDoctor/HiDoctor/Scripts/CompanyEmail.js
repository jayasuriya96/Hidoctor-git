var FromEmailIdarr = [];
var docResubmission = "";
var hrmsCCmailarr = [];
var MailSenderNamearr = [];
var TemplateUrl = "";
var welcomeEmailId = "";
var hrmsCCmail = "";
var Mail_Sender_Mail = "";


function fngetCompanyEmail() {
    $.ajax({
        url: '../HiDoctor_Master/UsercreationWizard/GetCompanyEmail',
        type: "POST",
        async: false,
        data: "",
        success: function (JsonResult) {
            debugger
            var response = eval('(' + JsonResult + ')');
            if (response.length > 0 && response != null && response != ''){
                var returnWelcomEmail = $.grep(response, function (element, index) {
                    return element.Email_Purpose == 'FROM_MAIL';
                });
                if (returnWelcomEmail.length > 0) {
                    debugger;
                    for (var i = 0; i < returnWelcomEmail.length; i++) {
                        var Fromobj = {
                            FromMail: returnWelcomEmail[i].Email_Id,
                            TemplateName: returnWelcomEmail[i].TemplateName
                        }
                        FromEmailIdarr.push(Fromobj);
                    }
                    // welcomeEmailId = returnWelcomEmail[0].Email_Id;
                }
                else {
                    welcomeEmailId = "no_reply@swaas.net";
                }
                var returnWelcomEmail = $.grep(response, function (element, index) {
                    return element.Email_Purpose == 'TO_MAIL';
                });
                if (returnWelcomEmail.length > 0) {
                    debugger;
                    docResubmission = returnWelcomEmail[0].Email_Id;
                }
                else {
                    docResubmission = "no_reply@swaas.net";
                }

                var returnWelcomEmail = $.grep(response, function (element, index) {
                    return element.Email_Purpose == 'CC_MAIL';
                });
                if (returnWelcomEmail.length > 0) {
                    debugger;
                    for (var i = 0; i < returnWelcomEmail.length; i++) {
                        var CCobj = {
                            CCMail: returnWelcomEmail[i].Email_Id,
                            TemplateName: returnWelcomEmail[i].TemplateName
                        }
                        hrmsCCmailarr.push(CCobj);
                    }
                }
                else {
                    hrmsCCmail = "no_reply@swaas.net";
                }

                var returnWelcomEmail = $.grep(response, function (element, index) {
                    return element.Email_Purpose == 'MAIL_SENDER_NAME';
                });
                if (returnWelcomEmail.length > 0) {
                    debugger;
                    for (var i = 0; i < returnWelcomEmail.length; i++) {
                        var Sendernameobj = {
                            SenderName: returnWelcomEmail[i].Email_Id,
                            TemplateName: returnWelcomEmail[i].TemplateName
                        }
                        MailSenderNamearr.push(Sendernameobj);
                    }
                    //MailSenderNamearr = "no_reply"
                }
                else {
                    Mail_Sender_Mail = "no_reply";
                }
            }
            else {
                welcomeEmailId = "no_reply@swaas.net";
                docResubmission = "no_reply@swaas.net";
                hrmsCCmail = "no_reply@swaas.net";
                Mail_Sender_Mail = "no_reply";
            }
            HideModalPopup('dvLoading');
        },
        error: function () {
            fnMsgAlert("Send mail Failed.");
            HideModalPopup('dvLoading');
            //$('#dvPanel').unblock();
        }
    });
}

function fnBindEmailSucesscallback(response) {
    
    TemplateUrl = 'https://hdnotifications.co.in/hd/index.php';
   // TemplateUrl = "http://swaasemailsys.com/ttk_email/index.php";
}
function fnBindEmailFailurecallback() {

}
