(function (e) { e.extend(e.ui.gmap.prototype, { getCurrentPosition: function (e, t) { var n = this; if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(function (t) { n._call(e, t, "OK") }, function (t) { n._call(e, null, t) }, t) } else { n._call(e, null, "NOT_SUPPORTED") } }, watchPosition: function (e, t) { var n = this; if (navigator.geolocation) { this.set("watch", navigator.geolocation.watchPosition(function (t) { n._call(e, t, "OK") }, function (t) { n._call(e, null, t) }, t)) } else { n._call(e, null, "NOT_SUPPORTED") } }, clearWatch: function () { if (navigator.geolocation) { navigator.geolocation.clearWatch(this.get("watch")) } }, autocomplete: function (t, n) { var r = this; e(this._unwrap(t)).autocomplete({ source: function (t, n) { r.search({ address: t.term }, function (t, r) { if (r === "OK") { n(e.map(t, function (e) { return { label: e.formatted_address, value: e.formatted_address, position: e.geometry.location } })) } else if (r === "OVER_QUERY_LIMIT") { alert("Google said it's too much!") } }) }, minLength: 3, select: function (e, t) { r._call(n, t) }, open: function () { e(this).removeClass("ui-corner-all").addClass("ui-corner-top") }, close: function () { e(this).removeClass("ui-corner-top").addClass("ui-corner-all") } }) }, placesSearch: function (e, t) { this.get("services > PlacesService", new google.maps.places.PlacesService(this.get("map"))).search(e, t) }, clearDirections: function () { var e = this.get("services > DirectionsRenderer"); if (e) { e.setMap(null); e.setPanel(null) } } }) })(jQuery)