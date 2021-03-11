(function (e, t) { var n = 0; e.widget("ech.multiselect", { options: { header: true, height: 175, minWidth: 225, classes: "", checkAllText: "Check all", uncheckAllText: "Uncheck all", noneSelectedText: "Select options", selectedText: "# selected", selectedList: 0, show: "", hide: "", autoOpen: false, multiple: true, position: {} }, _create: function () { var t = this.element.hide(), n = this.options; this.speed = e.fx.speeds._default; this._isOpen = false; var r = (this.button = e('<button type="button"><span class="ui-icon ui-icon-triangle-2-n-s"></span></button>')).addClass("ui-multiselect ui-widget ui-state-default ui-corner-all").addClass(n.classes).attr({ title: t.attr("title"), "aria-haspopup": true, tabIndex: t.attr("tabIndex") }).insertAfter(t), i = (this.buttonlabel = e("<span />")).html(n.noneSelectedText).appendTo(r), s = (this.menu = e("<div />")).addClass("ui-multiselect-menu ui-widget ui-widget-content ui-corner-all").addClass(n.classes).appendTo(document.body), o = (this.header = e("<div />")).addClass("ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix").appendTo(s), u = (this.headerLinkContainer = e("<ul />")).addClass("ui-helper-reset").html(function () { if (n.header === true) { return '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + n.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + n.uncheckAllText + "</span></a></li>" } else if (typeof n.header === "string") { return "<li>" + n.header + "</li>" } else { return "" } }).append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>').appendTo(o), a = (this.checkboxContainer = e("<ul />")).addClass("ui-multiselect-checkboxes ui-helper-reset").appendTo(s); this._bindEvents(); this.refresh(true); if (!n.multiple) { s.addClass("ui-multiselect-single") } }, _init: function () { if (this.options.header === false) { this.header.hide() } if (!this.options.multiple) { this.headerLinkContainer.find(".ui-multiselect-all, .ui-multiselect-none").hide() } if (this.options.autoOpen) { this.open() } if (this.element.is(":disabled")) { this.disable() } }, refresh: function (t) { var r = this.element, i = this.options, s = this.menu, o = this.checkboxContainer, u = [], a = [], f = r.attr("id") || n++; r.find("option").each(function (t) { var n = e(this), r = this.parentNode, s = this.innerHTML, o = this.title, l = this.value, c = this.id || "ui-multiselect-" + f + "-option-" + t, h = this.disabled, p = this.selected, d = ["ui-corner-all"], v; if (r.tagName.toLowerCase() === "optgroup") { v = r.getAttribute("label"); if (e.inArray(v, u) === -1) { a.push('<li class="ui-multiselect-optgroup-label"><a href="#">' + v + "</a></li>"); u.push(v) } } if (h) { d.push("ui-state-disabled") } if (p && !i.multiple) { d.push("ui-state-active") } a.push('<li class="' + (h ? "ui-multiselect-disabled" : "") + '">'); a.push('<label for="' + c + '" title="' + o + '" class="' + d.join(" ") + '">'); a.push('<input id="' + c + '" name="multiselect_' + f + '" type="' + (i.multiple ? "checkbox" : "radio") + '" value="' + l + '" title="' + s + '"'); if (p) { a.push(' checked="checked"'); a.push(' aria-selected="true"') } if (h) { a.push(' disabled="disabled"'); a.push(' aria-disabled="true"') } a.push(" /><span>" + s + "</span></label></li>") }); o.html(a.join("")); this.labels = s.find("label"); this._setButtonWidth(); this._setMenuWidth(); this.button[0].defaultValue = this.update(); if (!t) { this._trigger("refresh") } }, update: function () { var t = this.options, n = this.labels.find("input"), r = n.filter("[checked]"), i = r.length, s; if (i === 0) { s = t.noneSelectedText } else { if (e.isFunction(t.selectedText)) { s = t.selectedText.call(this, i, n.length, r.get()) } else if (/\d/.test(t.selectedList) && t.selectedList > 0 && i <= t.selectedList) { s = r.map(function () { return e(this).next().text() }).get().join(", ") } else { s = t.selectedText.replace("#", i).replace("#", n.length) } } this.buttonlabel.html(s); return s }, _bindEvents: function () { function r() { t[t._isOpen ? "close" : "open"](); return false } var t = this, n = this.button; n.find("span").bind("click.multiselect", r); n.bind({ click: r, keypress: function (e) { switch (e.which) { case 27: case 38: case 37: t.close(); break; case 39: case 40: t.open(); break } }, mouseenter: function () { if (!n.hasClass("ui-state-disabled")) { e(this).addClass("ui-state-hover") } }, mouseleave: function () { e(this).removeClass("ui-state-hover") }, focus: function () { if (!n.hasClass("ui-state-disabled")) { e(this).addClass("ui-state-focus") } }, blur: function () { e(this).removeClass("ui-state-focus") } }); this.header.delegate("a", "click.multiselect", function (n) { if (e(this).hasClass("ui-multiselect-close")) { t.close() } else { t[e(this).hasClass("ui-multiselect-all") ? "checkAll" : "uncheckAll"]() } n.preventDefault() }); this.menu.delegate("li.ui-multiselect-optgroup-label a", "click.multiselect", function (n) { n.preventDefault(); var r = e(this), i = r.parent().nextUntil("li.ui-multiselect-optgroup-label").find("input:visible:not(:disabled)"), s = i.get(), o = r.parent().text(); if (t._trigger("beforeoptgrouptoggle", n, { inputs: s, label: o }) === false) { return } t._toggleChecked(i.filter("[checked]").length !== i.length, i); t._trigger("optgrouptoggle", n, { inputs: s, label: o, checked: s[0].checked }) }).delegate("label", "mouseenter.multiselect", function () { if (!e(this).hasClass("ui-state-disabled")) { t.labels.removeClass("ui-state-hover"); e(this).addClass("ui-state-hover").find("input").focus() } }).delegate("label", "keydown.multiselect", function (n) { n.preventDefault(); switch (n.which) { case 9: case 27: t.close(); break; case 38: case 40: case 37: case 39: t._traverse(n.which, this); break; case 13: e(this).find("input")[0].click(); break } }).delegate('input[type="checkbox"], input[type="radio"]', "click.multiselect", function (n) { var r = e(this), i = this.value, s = this.checked, o = t.element.find("option"); if (this.disabled || t._trigger("click", n, { value: i, text: this.title, checked: s }) === false) { n.preventDefault(); return } r.focus(); r.attr("aria-selected", s); o.each(function () { if (this.value === i) { this.selected = s } else if (!t.options.multiple) { this.selected = false } }); if (!t.options.multiple) { t.labels.removeClass("ui-state-active"); r.closest("label").toggleClass("ui-state-active", s); t.close() } t.element.trigger("change"); setTimeout(e.proxy(t.update, t), 10) }); e(document).bind("mousedown.multiselect", function (n) { if (t._isOpen && !e.contains(t.menu[0], n.target) && !e.contains(t.button[0], n.target) && n.target !== t.button[0]) { t.close() } }); e(this.element[0].form).bind("reset.multiselect", function () { setTimeout(e.proxy(t.refresh, t), 10) }) }, _setButtonWidth: function () { var e = this.element.outerWidth(), t = this.options; if (/\d/.test(t.minWidth) && e < t.minWidth) { e = t.minWidth } this.button.width(e) }, _setMenuWidth: function () { var e = this.menu, t = this.button.outerWidth() - parseInt(e.css("padding-left"), 10) - parseInt(e.css("padding-right"), 10) - parseInt(e.css("border-right-width"), 10) - parseInt(e.css("border-left-width"), 10); e.width(t || this.button.outerWidth()) }, _traverse: function (t, n) { var r = e(n), i = t === 38 || t === 37, s = r.parent()[i ? "prevAll" : "nextAll"]("li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)")[i ? "last" : "first"](); if (!s.length) { var o = this.menu.find("ul").last(); this.menu.find("label")[i ? "last" : "first"]().trigger("mouseover"); o.scrollTop(i ? o.height() : 0) } else { s.find("label").trigger("mouseover") } }, _toggleState: function (e, t) { return function () { if (!this.disabled) { this[e] = t } if (t) { this.setAttribute("aria-selected", true) } else { this.removeAttribute("aria-selected") } } }, _toggleChecked: function (t, n) { var r = n && n.length ? n : this.labels.find("input"), i = this; r.each(this._toggleState("checked", t)); r.eq(0).focus(); this.update(); var s = r.map(function () { return this.value }).get(); this.element.find("option").each(function () { if (!this.disabled && e.inArray(this.value, s) > -1) { i._toggleState("selected", t).call(this) } }); if (r.length) { this.element.trigger("change") } }, _toggleDisabled: function (e) { this.button.attr({ disabled: e, "aria-disabled": e })[e ? "addClass" : "removeClass"]("ui-state-disabled"); this.menu.find("input").attr({ disabled: e, "aria-disabled": e }).parent()[e ? "addClass" : "removeClass"]("ui-state-disabled"); this.element.attr({ disabled: e, "aria-disabled": e }) }, open: function (t) { var n = this, r = this.button, i = this.menu, s = this.speed, o = this.options; if (this._trigger("beforeopen") === false || r.hasClass("ui-state-disabled") || this._isOpen) { return } var u = i.find("ul").last(), a = o.show, f = r.offset(); if (e.isArray(o.show)) { a = o.show[0]; s = o.show[1] || n.speed } u.scrollTop(0).height(o.height); if (e.ui.position && !e.isEmptyObject(o.position)) { o.position.of = o.position.of || r; i.show().position(o.position).hide().show(a, s) } else { i.css({ top: f.top + r.outerHeight(), left: f.left }).show(a, s) } this.labels.eq(0).trigger("mouseover").trigger("mouseenter").find("input").trigger("focus"); r.addClass("ui-state-active"); this._isOpen = true; this._trigger("open") }, close: function () { if (this._trigger("beforeclose") === false) { return } var t = this.options, n = t.hide, r = this.speed; if (e.isArray(t.hide)) { n = t.hide[0]; r = t.hide[1] || this.speed } this.menu.hide(n, r); this.button.removeClass("ui-state-active").trigger("blur").trigger("mouseleave"); this._isOpen = false; this._trigger("close") }, enable: function () { this._toggleDisabled(false) }, disable: function () { this._toggleDisabled(true) }, checkAll: function (e) { this._toggleChecked(true); this._trigger("checkAll") }, uncheckAll: function () { this._toggleChecked(false); this._trigger("uncheckAll") }, getChecked: function () { return this.menu.find("input").filter("[checked]") }, destroy: function () { e.Widget.prototype.destroy.call(this); this.button.remove(); this.menu.remove(); this.element.show(); return this }, isOpen: function () { return this._isOpen }, widget: function () { return this.menu }, _setOption: function (t, n) { var r = this.menu; switch (t) { case "header": r.find("div.ui-multiselect-header")[n ? "show" : "hide"](); break; case "checkAllText": r.find("a.ui-multiselect-all span").eq(-1).text(n); break; case "uncheckAllText": r.find("a.ui-multiselect-none span").eq(-1).text(n); break; case "height": r.find("ul").last().height(parseInt(n, 10)); break; case "minWidth": this.options[t] = parseInt(n, 10); this._setButtonWidth(); this._setMenuWidth(); break; case "selectedText": case "selectedList": case "noneSelectedText": this.options[t] = n; this.update(); break; case "classes": r.add(this.button).removeClass(this.options.classes).addClass(n); break } e.Widget.prototype._setOption.apply(this, arguments) } }) })(jQuery)