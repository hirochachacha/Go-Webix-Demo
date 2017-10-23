import 'webix/webix.js'
import 'webix/webix.css'

webix.ready(function() {
	webix.ui({
		type: "space",
		rows: [
			{
				view: "toolbar",
				cols: [
					{
						view: "button",
						id: "up-button",
						type: "icon",
						icon: "arrow-circle-up",
						label: "up",
						width: 60
					},
					{
						view: "button",
						id: "right-button",
						type: "icon",
						icon: "arrow-circle-right",
						label: "right",
						width: 60
					},
					{
						view: "label",
						id: "pathname",
						template: function() {
							var d = $$("dir-table");
							var path;
							if (d == null || d.data == null || d.data.url == null) {
								path = ".";
							} else {
								var w = new URL(window.location);
								var url = new URL(w.protocol+"//"+w.host+d.data.url);
								path = url.searchParams.get("path");
								if (path === null) {
									path = ".";
								}
							}
							return "<span class='webix_icon fa-folder'></span>"+path;
						},
						align: "center"
					}
				]
			},
			{
				view: "datatable",
				id: "dir-table",
				width: 700,
				select: true,
				columns: [
					{
						id: "name",
						header: "name",
						template: function(obj) {
							if (obj.is_dir) {
								return "<span class='webix_icon fa-folder'></span>"+obj.name;
							}
							return "<span class='webix_icon fa-file'></span>"+obj.name;
						},
						width: 200
					},
					{
						id: "size",
						header: "size",
						template: function(obj) {
							if (obj.size >= 1024*1024) {
								return parseInt(obj.size/(1024*1024)) + "m";
							}
							if (obj.size >= 1024) {
								return parseInt(obj.size/1024) +"k";
							}
							return obj.size;
						},
						width: 100
					},
					{id: "created_at", header: "created_at", width: 400, fillspace: true}
				],
			}
		]
	});

	$$("dir-table").load("/json?path=.");

	$$("up-button").attachEvent("onItemClick", function(id, e, node) {
		var d = $$("dir-table");
		var w = new URL(window.location);
		var url = new URL(w.protocol+"//"+w.host+d.data.url);
		var path = url.searchParams.get("path");
		if (path === null) {
			path = "..";
		} else {
			path += "/..";
		}
		d.data.clearAll();
		d.load("/json?path=" + path);
		$$("pathname").refresh();
	});

	$$("right-button").attachEvent("onItemClick", function(id, e, node) {
		var d = $$("dir-table");
		var item = d.getSelectedItem();
		if (item.is_dir) {
			var w = new URL(window.location);
			var url = new URL(w.protocol+"//"+w.host+d.data.url);
			var path = url.searchParams.get("path");
			if (path === null) {
				path = item.name;
			} else {
				path += "/" + item.name;
			}
			d.data.clearAll();
			d.load("/json?path=" + path);
			$$("pathname").refresh();
		}
	});
});
