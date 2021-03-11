function fnMsgAlert(e, t, n) {
    //alert("lsdjflsjfksfkjdf");
     $.msgAlert({
        type: e,
        title: t,
        html: n
    })
}

function fnGrowAlert(e, t, n) {
    $.msgGrowl({
        type: e,
        title: t,
        text: n
    })
}

function fnBarAlert(e, t, n, r) {
    $("#" + r).html($.msgBar({
        type: e,
        title: t,
        text: n,
        lifetime: 4e3
    }))
}
var TitleDeleteRI = "Quizky";
var TextDeleteRI = "Unable to delete, please check the dependencies";
var TitleSaved = "Quizky";
var TextSaved = "Successfully saved!";
(function (e) {
    e.msgAlert = function (t) {
        function u(t) {
            t.preventDefault();
            e.msgAlert.close()
        }
        var n, r, i, s, o, u, a, f, l;
        n = {
            type: "",
            title: "",
            text: "",
            callback: function () { },
            closeTrigger: true,
            escClose: true,
            overlay: true,
            overlayClose: false,
            html: "",
            buttons: [{
                text: "Ok",
                callback: function () {
                    e.msgAlert.close();
                    r.callback()
                }
            }]
        };
        r = e.extend(n, t);
        i = e("<div>", {
            "class": "msgAlert " + r.type
        }).appendTo("body");
        s = e("<div>", {
            "class": "msgAlert_popup"
        }).appendTo(i);
        if (r.title != "") {
            o = e("<div/>", {
                "class": "msgAlert_header",
                html: "<h4>" + r.title + "</h4>"
            }).appendTo(s)
        }
        if (r.closeTrigger) {
            u = e("<a>", {
                href: "javascript:;",
                "class": "msgAlert_close",
                click: u
            }).appendTo(o)
        }
        if (r.text == "") {
            a = e("<div/>", {
                "class": "msgAlert_content html",
                html: r.html
            }).appendTo(s)
        } else {
            a = e("<div/>", {
                "class": "msgAlert_content html",
                text: r.text
            }).appendTo(s)
        }
        f = e("<div/>", {
            "class": "msgAlert_footer"
        }).appendTo(i);
        if (r.overlay) {
            l = e("<div/>", {
                "class": "msgAlert_overlay"
            }).appendTo("body");
            if (r.overlay && r.overlayClose) {
                l.bind("click", u)
            }
        }
        if (r.type == "warning") {
            r.buttons = [{
                text: "Yes",
                callback: function () {
                    r.callback();
                    e.msgAlert.close()
                }
            }, {
                text: "No",
                callback: function () {
                    e.msgAlert.close()
                }
            }, {
                text: "Cancel",
                callback: function () {
                    e.msgAlert.close()
                }
            }]
        }
        //debugger ;
        if (r.buttons.length > 0) {
            for (key in r.buttons) {
                if (key !== "contains") {
                    if (key !== 'remove') {
                        if (key !== 'clear') { //by jamal
                            e("<button>", {
                                text: r.buttons[key].text
                            }).bind("click", r.buttons[key].callback).appendTo(f)
                        }
                    }
                }
            }
        }
        i.appendTo("body");
        i.find("button:first").focus();
      //  i.find("button:second").focus();
        if (r.escClose) {
            e(document).bind("keyup.msgAlert", function (t) {
                if (t.keyCode == 27) {
                    e.msgAlert.close()
                }
            })
        }
    };
    e.msgAlert.close = function () {
        e(".msgAlert").fadeOut("fast", function () {
            e(this).remove()
        });
        e(".msgAlert_overlay").fadeOut("fast", function () {
            e(this).remove()
        });
        e(document).unbind("keyup.msgAlert")
    }
})(jQuery);
(function (e) {
    e.msgBar = function (t) {
        function u() {
            i.slideUp("medium", function () {
                e(this).remove()
            })
        }
        var n, r, i, s, o;
        n = {
            type: "",
            title: "",
            text: "",
            lifetime: 0,
            closeTrigger: true
        };
        r = e.extend(n, t);
        i = e("<div>", {
            "class": "msgBar " + r.type,
            text: r.text
        });
        s = e("<div>", {
            "class": "icon"
        }).appendTo(i);
        if (r.closeTrigger) {
            o = e("<div>", {
                "class": "close",
                text: "x",
                click: u
            }).appendTo(i)
        }
        if (r.lifetime > 0) {
            setTimeout(function () {
                u()
            }, r.lifetime)
        }
        return i
    }
})(jQuery)