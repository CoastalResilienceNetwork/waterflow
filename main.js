define([
        "dojo/_base/declare",
		"framework/PluginBase",
		
		"esri/toolbars/draw",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/ArcGISTiledMapServiceLayer",
		"esri/layers/FeatureLayer",
		"esri/InfoTemplate",
		"esri/tasks/QueryTask",
		"esri/tasks/query",
		"esri/graphicsUtils",
		"esri/graphic",
		"esri/symbols/SimpleLineSymbol",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/renderers/SimpleRenderer",
		"dojo/_base/Color",
		"esri/geometry/Extent",
		"esri/geometry/Polygon",
		"esri/geometry/Point",
		"esri/request",
		"esri/geometry/screenUtils",
		
		"dijit/registry",
		"dijit/form/Button",
		"dijit/form/DropDownButton",
		"dijit/DropDownMenu", 
		"dijit/MenuItem",
		"dijit/layout/ContentPane",
		"dijit/layout/TabContainer",
		"dijit/form/HorizontalSlider",
		"dijit/form/CheckBox",
		"dijit/form/RadioButton",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/window",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"dojo/dom-geometry",
		"dijit/Dialog",
		
		"dojox/charting/Chart", 
		"dojox/charting/plot2d/Pie",
		"dojox/charting/action2d/Highlight",
        "dojox/charting/action2d/MoveSlice" , 
		"dojox/charting/action2d/Tooltip",
        "dojox/charting/themes/MiamiNice", 
		"dojox/charting/widget/Legend",
		
		"dojo/html",
		"dojo/_base/array",
		"dojo/aspect",
		"dojo/_base/lang",
		'dojo/_base/json',
		"dojo/on",
		"dojo/parser",
		"dojo/query",
		"dojo/NodeList-traverse",
		"require",
		"dojo/text!./config.json"
		
       ],
       function (declare, 
					PluginBase, 
					Drawer,
					ArcGISDynamicMapServiceLayer,
					ArcGISTiledMapServiceLayer,
					FeatureLayer,
					InfoTemplate,
					QueryTask,
					esriQuery,
					graphicsUtils,
					Graphic,
					SimpleLineSymbol,
					SimpleFillSymbol,
					SimpleMarkerSymbol,
					SimpleRenderer,
					Color,
					Extent,
					Polygon,
					Point,
					esriRequest,
					screenUtils,
					registry,
					Button,
					DropDownButton, 
					DropDownMenu, 
					MenuItem,
					ContentPane,
					TabContainer,
					HorizontalSlider,
					CheckBox,
					RadioButton,
					dom,
					domClass,
					domStyle,
					win,
					domConstruct,
					domAttr,
					domGeom,
					Dialog,
					Chart,
					Pie,
					Highlight, 
					MoveSlice, 
					Tooltip, 
					MiamiNice, 
					Legend,
					html,
					array,
					aspect,
					lang,
					dJson,
					on,
					parser,
					dojoquery,
					NodeListtraverse,
					localrequire,
					configData
					) {
					
			_config = dojo.eval("[" + configData + "]")[0];
			
			_infographic = _config.infoGraphic;
			console.log(_infographic);
			
			if (_infographic != undefined) {
			
				_infographic = localrequire.toUrl("./" + _infographic);
			
			}
			
			if (_config.ddText != undefined) {
			
				_ddText = _config.ddText;
			
			} else {
			
				_ddText = "Choose a Region";
			
			}
					
           return declare(PluginBase, {
		       toolbarName: _config.name,
               toolbarType: "sidebar",
               allowIdentifyWhenActive: false,
			   width: _config.pluginWidth,
			   infoGraphic: _infographic, 
			   height: _config.pluginHeight,
			   rendered: false,
			   
               activate: function () { 
			   			   
					console.log("start");
					
					ext = new Extent(this.configVizObject.extent);
					this.map.setExtent(ext);
					
					this.huc8Service = new FeatureLayer(this.configVizObject.huc8.service, {
					 // infoTemplate: new InfoTemplate("yo", "HI"),
					  mode: FeatureLayer.MODE_SELECTION,
					  outFields: ["*"]
					});

					symbol8 = new SimpleFillSymbol(this.configVizObject.huc8.symbol);
					
					this.huc8Service.setRenderer(new SimpleRenderer(symbol8));
					
					this.map.addLayer(this.huc8Service);
					
					//this.huc8Service.on("mouse-over", lang.hitch(this, this.selectHuc8));		

					this.huc12Service = new FeatureLayer(this.configVizObject.huc12.service, {
					  infoTemplate: new InfoTemplate("yo", "HI"),
					  mode: FeatureLayer.MODE_ONDEMAND,
					  outFields: ["*"]
					});
				
					
					symbol = new SimpleFillSymbol({
					  "type": "esriSFS",
					  "style": "esriSFSSolid",
					  "color": [115,76,0,0],
						"outline": {
						 "type": "esriSLS",
						 "style": "esriSLSSolid",
						 "color": [110,110,110,0],
						 "width": 1
						 }});
					
					this.huc12Service.setRenderer(new SimpleRenderer(symbol));
					
					this.map.addLayer(this.huc12Service);
				
					this.huc12Service.on("mouse-over", lang.hitch(this, this.selectHuc12));

					this.mainpane = new ContentPane({

					});
					
					dom.byId(this.container).appendChild(this.mainpane.domNode);
					domClass.add(this.mainpane.domNode, "claro");
					

					nodetitle = domConstruct.create("div", {style:"font-weight: bold;padding:10px", innerHTML: "Move the mouse to explore the region and select a watershed."});
					this.mainpane.domNode.appendChild(nodetitle);
				
					this.huc8title = domConstruct.create("div", {style:"", innerHTML: ""});
					this.mainpane.domNode.appendChild(this.huc8title);
					
					this.huc12title = domConstruct.create("div", {style:"padding-top:10px", innerHTML: ""});
					this.mainpane.domNode.appendChild(this.huc12title);
					
					parser.parse();
					
			   },
			   
			   selectHuc12: function(evt) {
				
					this.map.graphics.clear();
					highlightSymbol = new SimpleFillSymbol(this.configVizObject.huc12.symbol);
					
					highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
					this.map.graphics.add(highlightGraphic);
			
					console.log(evt.graphic.attributes["HUC_12"])//["HUC_12"])//.getCentroid();
					
					fid = evt.graphic.attributes["HUC_12"]
					
					 var layerUrl = "http://ec2-54-81-38-200.compute-1.amazonaws.com/wf_api/Navigate/.jsonp";
					  var layersRequest = esriRequest({
						url: layerUrl,
						content: { "direction": "upstream", "feature_type": "huc12", "feature_id" : fid, "time": "50", "dist": "100" },
						handleAs: "json",
						callbackParamName: "callback"
					  });
					  layersRequest.then(
						function(response) {
						  console.log("Success: ", response);
					  }, function(error) {
						  console.log("Error: ", error);
					  });
					
					html.set(this.huc12title, "HUC 12: <br>" + evt.graphic.attributes[this.configVizObject.huc12.nameField]);
					
					//screenUtils.toMapGeometry(this.map.extent, this.map.width, this.map.height, screenGeometry);
					
					sums = [0,0]
					array.forEach(evt.graphic.geometry.rings[0], lang.hitch(this, function(entry, i) {
						sums[0] = entry[0] + sums[0];
						sums[1] = entry[1] + sums[1];
					}));
					point = new Point( {"x": sums[0] / evt.graphic.geometry.rings[0].length, "y": sums[1] / evt.graphic.geometry.rings[0].length, "spatialReference": {"wkid": 3857 } });
					
					query = new esriQuery();
					query.geometry = point;
					this.huc8Service.selectFeatures(query,FeatureLayer.SELECTION_NEW, lang.hitch(this, this.selectHuc8));
			   
			   },
			   
			   selectHuc8: function(e) {
			   
					console.log(e[0].attributes[this.configVizObject.huc8.nameField]);
					
					html.set(this.huc8title, "HUC 8: <br>" + e[0].attributes[this.configVizObject.huc8.nameField]);
			   
			   },
			   
               deactivate: function () {

			
			   
			   },
			   
               hibernate: function () { 
					
					domConstruct.empty(this.mainpane.domNode);
					
			   },
			   
			   
				initialize: function (frameworkParameters) {
				
					declare.safeMixin(this, frameworkParameters);
			
					domClass.add(this.container, "claro");
					
					this.configVizObject = dojo.eval("[" + configData + "]")[0];
					
					console.log(this.configVizObject);
					
				},
				
			     resize: function(w, h) {
				 
					cdg = domGeom.position(this.container);
					//console.log(this.mainpane.domNode);

				 },
				
               getState: function () { 
			   
				console.log(this.controls);
			   
				state = this.controls;
			   
				return state;
	
			   
				},
				
				
               setState: function (state) { 
				
				this.controls = state;
				
				this.render();
				
				
				},
           });
       });

