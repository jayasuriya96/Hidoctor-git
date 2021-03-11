(function (e, t, n) { "use strict"; function s(n, r) { var s = this; s.$el = e(n); s.el = n; s.$window = e(t); s.$clonedHeader = null; s.$originalHeader = null; s.isCloneVisible = false; s.leftOffset = null; s.topOffset = null; s.init = function () { s.options = e.extend({}, i, r); s.$el.each(function () { var t = e(this); t.css("padding", 0); s.$originalHeader = e("thead:first", this); s.$clonedHeader = s.$originalHeader.clone(); s.$clonedHeader.addClass("tableFloatingHeader"); s.$clonedHeader.css({ position: "fixed", top: 0, "z-index": 1, display: "none" }); s.$originalHeader.addClass("tableFloatingHeaderOriginal"); s.$originalHeader.after(s.$clonedHeader); e("th", s.$clonedHeader).click(function (t) { var n = e("th", s.$clonedHeader).index(this); e("th", s.$originalHeader).eq(n).click() }); t.bind("sortEnd", s.updateWidth) }); s.updateWidth(); s.toggleHeaders(); s.$window.scroll(s.toggleHeaders); s.$window.resize(s.toggleHeaders); s.$window.resize(s.updateWidth) }; s.toggleHeaders = function () { s.$el.each(function () { var t = e(this); var n = isNaN(s.options.fixedOffset) ? s.options.fixedOffset.height() : s.options.fixedOffset; var r = t.offset(); var i = s.$window.scrollTop() + n; var o = s.$window.scrollLeft(); if (i > r.top && i < r.top + t.height()) { var u = r.left - o; if (s.isCloneVisible && u === s.leftOffset && n === s.topOffset) { return } s.$clonedHeader.css({ top: n, "margin-top": 0, left: u, display: "block" }); s.$originalHeader.css("visibility", "hidden"); s.isCloneVisible = true; s.leftOffset = u; s.topOffset = n } else if (s.isCloneVisible) { s.$clonedHeader.css("display", "none"); s.$originalHeader.css("visibility", "visible"); s.isCloneVisible = false } }) }; s.updateWidth = function () { e("th", s.$clonedHeader).each(function (t) { var n = e(this); var r = e("th", s.$originalHeader).eq(t); this.className = r.attr("class") || ""; n.css("width", r.width()) }); s.$clonedHeader.css("width", s.$originalHeader.width()) }; s.init() } var r = "stickyTableHeaders"; var i = { fixedOffset: 0 }; e.fn[r] = function (t) { return this.each(function () { if (!e.data(this, "plugin_" + r)) { e.data(this, "plugin_" + r, new s(this, t)) } }) } })(jQuery, window)