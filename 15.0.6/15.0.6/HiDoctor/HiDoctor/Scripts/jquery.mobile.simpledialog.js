(function (e, t) { e.widget("mobile.simpledialog", e.mobile.widget, { options: { version: "1.0.1-2012021300", pickPageTheme: "b", pickPageInputTheme: "e", pickPageButtonTheme: "a", fullScreen: false, fullScreenAlways: false, disabled: false, zindex: "500", width: "280px", prompt: "Are you sure?", mode: "bool", allowReopen: true, useModal: true, forceInput: true, isOpen: false, blankMode: false, fullHTML: null, subTitle: false, inputPassword: false, cleanOnClose: false, animate: true, transition: "pop", clickEvent: "click", left: t, top: t, useDialogForceTrue: false, useDialogForceFalse: false, useDialog: false, isInit: false, sawOnce: false, enterToTrigger: 0, escToTrigger: 1, butObj: [], debug: false, selects: false, selectparent: [], onCreated: null, onOpened: null, onClosed: null, onShown: null }, _eventHandler: function (t, n) { var r = e(this).data("simpledialog"), i = r.options; if (!t.isPropagationStopped()) { switch (n.method) { case "close": r.close(n.fromCloseButton); break; case "open": r.open(); break; case "refresh": r.refresh(); break; case "button": i.butObj[n.index].trigger(i.clickEvent); break } } }, _orientChange: function (t) { var n = e(t.currentTarget).data("simpledialog"), r = n.options, i = e.mobile.activePage.width(), s = e(window).scrollTop(), o = e(window).height(), u = n.pickerContent.outerHeight(), a = n.pickerContent.innerWidth(), f = parseFloat(r.top) + 1e4 ? parseFloat(r.top) : s + o / 2 - u / 2, l = parseFloat(r.left) + 1e4 ? parseFloat(r.left) : i / 2 - a / 2; if (u + f > e(document).height()) { f = e(document).height() - (u + 2) } if (f < 45) { f = 45 } t.stopPropagation(); if (!n.pickerContent.is(":visible") || r.useDialog === true) { return false } else { n.pickerContent.css({ top: f, left: l }) } }, open: function () { if (this.pickPage.is(":visible")) { return false } var t = this, n = this.options, r = e.mobile.activePage.width(), i = e(window).scrollTop(), s = e(window).height(), o = t.pickerContent.outerHeight(), u = t.pickerContent.innerWidth(), a = e(window).scrollTop(), f = e(window).scrollLeft(), l = parseFloat(n.top) + 1e4 ? parseFloat(n.top) : i + s / 2 - o / 2, c = parseFloat(n.left) + 1e4 ? parseFloat(n.left) : r / 2 - u / 2; if (o + l > e(document).height()) { l = e(document).height() - (o + 2) } if (l < 45) { l = 45 } if (n.prompt !== false) { t.pickerHeader.html(n.prompt); t.pickPage.find(".ui-header").find(".ui-title").text(n.prompt) } t.pickerContent.find(".ui-btn-active").removeClass("ui-btn-active"); if (n.mode === "blank") { t.pickerContent.delegate('[rel="close"]', n.clickEvent, function () { t.close() }) } if (!n.disabled) { if (r > 400 && !n.useDialogForceTrue || n.useDialogForceFalse || n.fullScreen) { n.useDialog = false; if (n.fullScreen === false) { if (n.useModal === true) { if (n.animate === true) { t.screen.fadeIn("slow") } else { t.screen.show() } } else { t.screen.removeClass("ui-simpledialog-hidden") } } if (n.mode === "blank") { n.selects = t.pickPage.find(".ui-selectmenu"); n.selects.each(function () { n.selectparent.push(e(this).closest(".ui-dialog")); e(this).appendTo(t.thisPage) }) } t.pickerContent.addClass("ui-overlay-shadow").css("zIndex", t.options.zindex); t.pickerHeader.show(); if (n.fullScreenAlways || n.fullScreen && r < 400) { t.pickerContent.css({ border: "0px !important", position: "absolute", top: a, left: f, height: s, width: r, maxWidth: r }).addClass("ui-overlay-shadow in").removeClass("ui-simpledialog-hidden") } else { t.pickerContent.css({ position: "absolute", top: l, left: c }).addClass("ui-overlay-shadow in").removeClass("ui-simpledialog-hidden") } } else { t.thisPage.unbind("pagehide.remove"); n.useDialog = true; t.pickPageContent.append(t.pickerContent); t.pickerHeader.hide(); t.pickerContent.removeClass("ui-overlay-shadow ui-simpledialog-hidden").css({ top: "auto", left: "auto", marginLeft: "auto", marginRight: "auto" }).css("zIndex", t.options.zindex); e.mobile.changePage(t.pickPage, { transition: n.animate === true ? n.transition : "none" }) } this.options.isOpen = true } }, close: function (t) { var n = this; t = typeof t === "undefined" ? false : t; if (n.options.useDialog) { if (t === false) { e(n.pickPage).dialog("close") } if (typeof n.thisPage.jqmData("page") !== "undefined" && !n.thisPage.jqmData("page").options.domCache) { n.thisPage.bind("pagehide.remove", function () { e(n).remove() }) } n.pickerContent.addClass("ui-simpledialog-hidden"); n.thisPage.append(n.pickerContent) } else { if (n.options.useModal) { if (n.options.animate === true) { n.screen.fadeOut("slow") } else { n.screen.hide() } } else { n.screen.addClass("ui-simpledialog-hidden") } n.pickerContent.addClass("ui-simpledialog-hidden").removeClass("in") } n.caller.removeClass("ui-btn-active"); n.options.isOpen = false; if (n.options.cleanOnClose === true && n.options.useDialog === false) { n.clean() } if (n.options.onClosed && typeof n.options.onClosed === "function") { n.options.onClosed(n) } }, clean: function () { var t = this; if (t.options.selects !== false) { t.options.selects.each(function () { e(this).remove() }); e(t.options.selectparent).each(function () { e(this).remove() }) } t.pickerContent.remove(); t.pickPage.remove(); t.screen.remove(); t.caller.removeData("simpledialog") }, _create: function () { var t = this, n = e.extend(this.options, this.element.data("options")), r = this.element; if (n.isInit && n.allowReopen) { t.open() } else { var i = r.closest(".ui-page"), s = e("<div data-role='dialog' class='ui-simpledialog-dialog' data-theme='" + n.pickPageTheme + "' >" + "<div data-role='header' data-backbtn='false' data-theme='a'>" + "<div class='ui-title'>" + n.prompt + "</div>" + "</div>" + "<div data-role='content'></div>" + "</div>"), o = null, u = null; if (n.mode === "blank") { o = e("<div class='ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden " + (n.animate === true ? n.transition : "") + " ui-body-" + n.pickPageTheme + "'></div>"); o.html(n.fullHTML); e("[data-role=content]", s).append(o) } s.appendTo(e.mobile.pageContainer).page().css("minHeight", "0px").css("zIndex", n.zindex); if (n.animate === true) { s.addClass("pop") } u = s.find(".ui-content"); r.live("simpledialog", t._eventHandler); s.find(".ui-header a").bind(n.clickEvent, function (e) { e.preventDefault(); e.stopImmediatePropagation(); t.close(true) }); if (n.prompt === false) { s.find(".ui-header").find(".ui-title").html("&nbsp;") } e.extend(t, { pickPage: s, thisPage: i, pickPageContent: u, screen: screen, caller: r }); t._buildPage(); t.options.isInit = true; e(document).bind("orientationchange", function (e) { r.trigger("orientationchange") }); r.bind("orientationchange", t._orientChange); if (t.options.onCreated && typeof t.options.onCreated === "function") { t.options.onCreated(t) } } }, _reposition: function () { var t = this, n = this.options, r = e.mobile.activePage.width(), i = e(window).scrollTop(), s = e(window).height(), o = t.pickerContent.outerHeight(), u = t.pickerContent.innerWidth(), a = parseFloat(n.top) + 1e4 ? parseFloat(n.top) : i + s / 2 - o / 2, f = parseFloat(n.left) + 1e4 ? parseFloat(n.left) : r / 2 - u / 2; if (o + a > e(document).height()) { a = e(document).height() - (o + 2) } if (a < 45) { a = 45 } t.pickerContent.css({ position: "absolute", width: u, top: a, left: f }) }, refresh: function () { if (this.options.mode !== "blank") { return false } else { this.pickerContent.css("width", "auto"); this.pickerContent.html(this.options.fullHTML); this.pickerContent.trigger("create"); if (this.pickerContent.is(":visible") && this.options.useDialog === false) { this._reposition() } } }, _init: function () { if (!this.options.sawOnce || this.options.allowReopen) { this.options.sawOnce = true; this.open() } }, _buildPage: function () { var t = this, n = t.options, r = null, i, s, o, u = e("<div>", { "class": "ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden " + (n.animate === true ? n.transition : "") + " ui-body-" + n.pickPageTheme }).css({ zIndex: n.zindex, width: n.width }), a = e("<div class='ui-simpledialog-header'><h4></h4></div>").appendTo(u).find("h4"); u.bind("webkitAnimationEnd", function () { if (t.options.onShown && typeof t.options.onShown === "function") { t.options.onShown(t) } }); if (n.mode !== "blank") { if (n.prompt !== false) { a.html(n.prompt) } else { a.parent().html() } if (n.subTitle !== false) { e("<p class='ui-simpledialog-subtitle'>" + n.subTitle + "<p>").appendTo(u) } if (n.mode === "string") { i = e("<div class='ui-simpledialog-controls'><input class='ui-simpledialog-input ui-input-text ui-shadow-inset ui-corner-all ui-body-" + n.pickPageInputTheme + "' type='" + (n.inputPassword === true ? "password" : "text") + "' name='pickin' /></div>").bind("keyup", function (e) { if (e.keyCode === 13 && n.enterToTrigger !== false) { n.butObj[n.enterToTrigger].trigger(n.clickEvent) } if (e.keyCode === 27 && n.escToTrigger !== false) { n.butObj[n.escToTrigger].trigger(n.clickEvent) } }).appendTo(u) } s = e("<div>", { "class": "ui-simpledialog-controls" }).appendTo(u); e.each(n.buttons, function (o, u) { u = e.isFunction(u) ? { click: u } : u; u = e.extend({ text: o, theme: n.pickPageButtonTheme, icon: "check", iconpos: "left", closeOnClick: true, corners: true, shadow: true }, u); r = n.butObj.push(e("<a href='#'>" + o + "</a>").appendTo(s).buttonMarkup({ theme: u.theme, icon: u.icon, iconpos: u.iconpos, corners: u.corners, shadow: u.shadow }).unbind("vclick").unbind("click").bind(n.clickEvent, function () { if (n.mode === "string") { t.caller.attr("data-string", i.find("input").val()) } var e = u.click.apply(t.element[0], arguments); if (e !== false && u.closeOnClick === true) { t.close() } })); if (typeof u.id !== "undefined" && u.id.length > 0) n.butObj[r - 1].attr("id", u.id); if (u.hidden) n.butObj[r - 1].addClass("button-hidden"); if (u.insertSeparator) e("<div class='buttons-separator'>").appendTo(s) }) } else { u = t.pickPageContent.contents() } u.appendTo(t.thisPage); o = e("<div>", { "class": "ui-simpledialog-screen ui-simpledialog-hidden" }).css({ "z-index": n.zindex - 1 }).appendTo(t.thisPage).bind(n.clickEvent, function (e) { if (!n.forceInput) { t.close() } e.preventDefault() }); if (n.useModal) { o.addClass("ui-simpledialog-screen-modal") } e.extend(t, { pickerContent: u, pickerHeader: a, screen: o }) }, disable: function () { this.options.disabled = true }, enable: function () { this.options.disabled = false } }) })(jQuery)