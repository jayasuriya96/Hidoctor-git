(function (e, t) { e.widget("mobile.simpledialog2", e.mobile.widget, { options: { version: "1.0.1-2012061300", mode: "blank", themeDialog: "b", themeInput: false, themeButtonDefault: false, themeHeader: "a", fullScreen: false, fullScreenForce: false, dialogAllow: false, dialogForce: false, headerText: false, headerClose: false, buttonPrompt: false, buttonInput: false, buttonInputDefault: false, buttonPassword: false, blankContent: false, blankContentAdopt: false, resizeListener: true, safeNuke: true, forceInput: true, showModal: true, animate: true, transition: "pop", clickEvent: "click", zindex: "500", width: "280px", left: false, top: false, callbackOpen: false, callbackOpenArgs: [], callbackClose: false, callbackCloseArgs: [] }, _eventHandler: function (e, t) { var n = e.data.widget, r = e.data.widget.options; if (!e.isPropagationStopped()) { switch (t.method) { case "close": n.close(); break; case "html": n.updateBlank(t.source); break } } }, _create: function () { var t = this, n = e.extend(this.options, this.element.jqmData("options")), r = new Date, i = e("<div class='ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden " + (n.animate === true ? n.transition : "") + " ui-body-" + n.themeDialog + "'></div>"); if (n.themeButtonDefault === false) { n.themeButtonDefault = n.themeDialog } if (n.themeInput === false) { n.themeInput = n.themeDialog } e.mobile.sdCurrentDialog = t; if (typeof e.mobile.sdLastInput !== "undefined") { delete e.mobile.sdLastInput } t.internalID = r.getTime(); t.displayAnchor = e.mobile.activePage.children(".ui-content").first(); if (t.displayAnchor.length === 0) { t.displayAnchor = e.mobile.activePage } t.dialogPage = e("<div data-role='dialog' data-theme='" + n.themeDialog + "'><div data-role='header'></div><div data-role='content'></div></div>"); t.sdAllContent = t.dialogPage.find("[data-role=content]"); i.appendTo(t.sdAllContent); t.sdIntContent = t.sdAllContent.find(".ui-simpledialog-container"); t.sdIntContent.css("width", n.width); if (n.headerText !== false || n.headerClose !== false) { t.sdHeader = e('<div style="margin-bottom: 4px;" class="ui-header ui-bar-' + n.themeHeader + '"></div>'); if (n.headerClose === true) { e("<a class='ui-btn-left' rel='close' href='#'>Close</a>").appendTo(t.sdHeader).buttonMarkup({ theme: n.themeHeader, icon: "delete", iconpos: "notext", corners: true, shadow: true }) } e('<h1 class="ui-title">' + (n.headerText !== false ? n.headerText : "") + "</h1>").appendTo(t.sdHeader); t.sdHeader.appendTo(t.sdIntContent) } if (n.mode === "blank") { if (n.blankContent === true) { if (n.blankContentAdopt === true) { n.blankContent = t.element.children() } else { n.blankContent = t.element.html() } } e(n.blankContent).appendTo(t.sdIntContent) } else if (n.mode === "button") { t._makeButtons().appendTo(t.sdIntContent) } t.sdIntContent.appendTo(t.displayAnchor.parent()); t.dialogPage.appendTo(e.mobile.pageContainer).page().css("minHeight", "0px").css("zIndex", n.zindex); if (n.animate === true) { t.dialogPage.addClass(n.transition) } t.screen = e("<div>", { "class": "ui-simpledialog-screen ui-simpledialog-hidden" }).css("z-index", n.zindex - 1).appendTo(t.displayAnchor.parent()).bind(n.clickEvent, function (e) { if (!n.forceInput) { t.close() } e.preventDefault() }); if (n.showModal) { t.screen.addClass("ui-simpledialog-screen-modal") } e(document).bind("simpledialog." + t.internalID, { widget: t }, function (e, n) { t._eventHandler(e, n) }) }, _makeButtons: function () { var t = this, n = t.options, r = e("<div></div>"), i = e("<div class='ui-simpledialog-controls'><input class='ui-simpledialog-input ui-input-text ui-shadow-inset ui-corner-all ui-body-" + n.themeInput + "' type='" + (n.buttonPassword === true ? "password" : "text") + "' value='" + (n.buttonInputDefault !== false ? n.buttonInputDefault.replace('"', "&#34;").replace("'", "&#39;") : "") + "' name='pickin' /></div>"), s = e("<div>", { "class": "ui-simpledialog-controls" }); if (n.buttonPrompt !== false) { t.buttonPromptText = e("<p class='ui-simpledialog-subtitle'>" + n.buttonPrompt + "</p>").appendTo(r) } if (n.buttonInput !== false) { e.mobile.sdLastInput = ""; i.appendTo(r); i.find("input").bind("change", function () { e.mobile.sdLastInput = i.find("input").first().val(); t.thisInput = i.find("input").first().val() }) } s.appendTo(r); t.butObj = []; e.each(n.buttons, function (r, i) { i = e.isFunction(i) ? { click: i } : i; i = e.extend({ text: r, id: r + t.internalID, theme: n.themeButtonDefault, icon: "check", iconpos: "left", corners: "true", shadow: "true", args: [], close: true }, i); t.butObj.push(e("<a href='#'>" + r + "</a>").appendTo(s).attr("id", i.id).buttonMarkup({ theme: i.theme, icon: i.icon, iconpos: i.iconpos, corners: i.corners, shadow: i.shadow }).unbind("vclick click").bind(n.clickEvent, function () { if (n.buttonInput) { t.sdIntContent.find("input [name=pickin]").trigger("change") } var r = i.click.apply(t, e.merge(arguments, i.args)); if (r !== false && i.close === true) { t.close() } })) }); return r }, _getCoords: function (t) { var n = t, r = e.mobile.activePage.width(), i = e(window).scrollTop(), s = e(window).height(), o = t.sdIntContent.innerWidth(), u = t.sdIntContent.outerHeight(), a = { high: e(window).height(), width: e.mobile.activePage.width(), fullTop: e(window).scrollTop(), fullLeft: e(window).scrollLeft(), winTop: i + (t.options.top !== false ? t.options.top : s / 2 - u / 2), winLeft: t.options.left !== false ? t.options.left : r / 2 - o / 2 }; if (a.winTop < 45) { a.winTop = 45 } return a }, _orientChange: function (e) { var t = e.data.widget, n = e.data.widget.options, r = e.data.widget._getCoords(e.data.widget); e.stopPropagation(); if (t.isDialog === true) { return true } else { if (n.fullScreen === true && (r.width < 400 || n.fullScreenForce === true)) { t.sdIntContent.css({ border: "none", position: "absolute", top: r.fullTop, left: r.fullLeft, height: r.high, width: r.width, maxWidth: r.width }).removeClass("ui-simpledialog-hidden") } else { t.sdIntContent.css({ position: "absolute", top: r.winTop, left: r.winLeft }).removeClass("ui-simpledialog-hidden") } } }, repos: function () { var e = { data: { widget: this }, stopPropagation: function () { return true } }; this._orientChange(e) }, open: function () { var t = this, n = this.options, r = this._getCoords(this); t.sdAllContent.find(".ui-btn-active").removeClass("ui-btn-active"); t.sdIntContent.delegate("[rel=close]", n.clickEvent, function (e) { e.preventDefault(); t.close() }); if (n.dialogAllow === true && r.width < 400 || n.dialogForce) { t.isDialog = true; if (n.mode === "blank") { t.sdIntContent.find("select").each(function () { e(this).jqmData("nativeMenu", true) }) } t.displayAnchor.parent().unbind("pagehide.remove"); t.sdAllContent.append(t.sdIntContent); t.sdAllContent.trigger("create"); if (n.headerText !== false) { t.sdHeader.find("h1").appendTo(t.dialogPage.find("[data-role=header]")); t.sdIntContent.find(".ui-header").empty().removeClass() } if (n.headerClose === true) { t.dialogPage.find(".ui-header a").bind("click", function () { setTimeout("$.mobile.sdCurrentDialog.destroy();", 1e3) }) } else { t.dialogPage.find(".ui-header a").remove() } t.sdIntContent.removeClass().css({ top: "auto", width: "auto", left: "auto", marginLeft: "auto", marginRight: "auto", zIndex: n.zindex }); e.mobile.changePage(t.dialogPage, { transition: n.animate === true ? n.transition : "none" }) } else { t.isDialog = false; t.selects = []; if (n.fullScreen === false) { if (n.showModal === true && n.animate === true) { t.screen.fadeIn("slow") } else { t.screen.removeClass("ui-simpledialog-hidden") } } t.sdIntContent.addClass("ui-overlay-shadow in").css("zIndex", n.zindex).trigger("create"); if (n.fullScreen === true && (r.width < 400 || n.fullScreenForce === true)) { t.sdIntContent.removeClass("ui-simpledialog-container").css({ border: "none", position: "absolute", top: r.fullTop, left: r.fullLeft, height: r.high, width: r.width, maxWidth: r.width }).removeClass("ui-simpledialog-hidden") } else { t.sdIntContent.css({ position: "absolute", top: r.winTop, left: r.winLeft }).removeClass("ui-simpledialog-hidden") } e(document).bind("orientationchange.simpledialog", { widget: t }, function (e) { t._orientChange(e) }); if (n.resizeListener === true) { e(window).bind("resize.simpledialog", { widget: t }, function (e) { t._orientChange(e) }) } } if (e.isFunction(n.callbackOpen)) { n.callbackOpen.apply(t, n.callbackOpenArgs) } }, close: function () { var t = this, n = this.options, r; if (e.isFunction(t.options.callbackClose)) { r = t.options.callbackClose.apply(t, t.options.callbackCloseArgs); if (r === false) { return false } } if (t.isDialog) { e(t.dialogPage).dialog("close"); t.sdIntContent.addClass("ui-simpledialog-hidden"); t.sdIntContent.appendTo(t.displayAnchor.parent()); if (e.mobile.activePage.jqmData("page").options.domCache != true && e.mobile.activePage.is(":jqmData(external-page='true')")) { e.mobile.activePage.bind("pagehide.remove", function () { e(this).remove() }) } } else { if (t.options.showModal === true && t.options.animate === true) { t.screen.fadeOut("slow") } else { t.screen.addClass("ui-simpledialog-hidden") } t.sdIntContent.addClass("ui-simpledialog-hidden").removeClass("in"); e(document).unbind("orientationchange.simpledialog"); if (t.options.resizeListener === true) { e(window).unbind("resize.simpledialog") } } if (n.mode === "blank" && n.blankContent !== false && n.blankContentAdopt === true) { t.element.append(n.blankContent); n.blankContent = true } if (t.isDialog === true || t.options.animate === true) { setTimeout(function (e) { return function () { e.destroy() } }(t), 1e3) } else { t.destroy() } }, destroy: function () { var t = this, n = t.element; if (t.options.mode === "blank") { e.mobile.sdCurrentDialog.sdIntContent.find("select").each(function () { if (e(this).data("nativeMenu") == false) { e(this).data("selectmenu").menuPage.remove(); e(this).data("selectmenu").screen.remove(); e(this).data("selectmenu").listbox.remove() } }) } e(t.sdIntContent).remove(); e(t.dialogPage).remove(); e(t.screen).remove(); e(document).unbind("simpledialog." + t.internalID); delete e.mobile.sdCurrentDialog; e.Widget.prototype.destroy.call(t); if (t.options.safeNuke === true && e(n).parents().length === 0 && e(n).contents().length === 0) { n.remove() } }, updateBlank: function (t) { var n = this, r = this.options; n.sdIntContent.empty(); if (r.headerText !== false || r.headerClose !== false) { n.sdHeader = e('<div class="ui-header ui-bar-' + r.themeHeader + '"></div>'); if (r.headerClose === true) { e("<a class='ui-btn-left' rel='close' href='#'>Close</a>").appendTo(n.sdHeader).buttonMarkup({ theme: r.themeHeader, icon: "delete", iconpos: "notext", corners: true, shadow: true }) } e('<h1 class="ui-title">' + (r.headerText !== false ? r.headerText : "") + "</h1>").appendTo(n.sdHeader); n.sdHeader.appendTo(n.sdIntContent) } e(t).appendTo(n.sdIntContent); n.sdIntContent.trigger("create"); e(document).trigger("orientationchange.simpledialog") }, _init: function () { this.open() } }) })(jQuery)