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
	
		"dojox/charting/themes/Tom",
		"dojox/charting/plot2d/Lines",
		"dojox/charting/plot2d/Markers",
		"dojox/charting/axis2d/Default",
		
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
					theme,
					Lines,
					Markers,
					DefaultChart,
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
					//  infoTemplate: new InfoTemplate("yo", "HI"),
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
				
					this.map.on("click", lang.hitch(this, this.selectHuc12Click));
					
					this.tracksignal = this.huc12Service.on("mouse-over", lang.hitch(this, this.selectHuc12));
					
					this.mainpane = new ContentPane({
							style:"overflow: hidden;"
					});
					
					dom.byId(this.container).appendChild(this.mainpane.domNode);
					domClass.add(this.mainpane.domNode, "claro");
					
					this.startover();
					
			   },
			   
			   startover: function() {
			   
					domConstruct.empty(this.mainpane.domNode);
					
					nodetitle = domConstruct.create("div", {style:"font-weight: bold;padding:10px", innerHTML: "Move the mouse to explore the region and select a watershed."});
					this.mainpane.domNode.appendChild(nodetitle);
				
					this.huc8title = domConstruct.create("div", {style:"", innerHTML: ""});
					this.mainpane.domNode.appendChild(this.huc8title);
					
					this.huc12title = domConstruct.create("div", {style:"padding-top:10px", innerHTML: ""});
					this.mainpane.domNode.appendChild(this.huc12title);
					
					this.huc12info = domConstruct.create("div", {style:"padding-top:10px", innerHTML: ""});
					this.mainpane.domNode.appendChild(this.huc12info);
					
					parser.parse();
			   
			   },
			   
			   selectHuc12Click: function() {
			   
			    this.tracksignal.remove();
				console.log(this.currenthuc12);

				this.map.setExtent(this.currenthuc8.geometry.getExtent(),true);

				this.map.graphics.clear();
				
				highlightSymbol = new SimpleFillSymbol(this.configVizObject.huc12.symbolHighlight);
					
				highlightGraphic = new Graphic(this.currenthuc12.geometry,highlightSymbol);
				this.map.graphics.add(highlightGraphic);
							
					hucname = this.currenthuc12.attributes[this.configVizObject.huc12.nameField];
					
					domConstruct.empty(this.mainpane.domNode);
				
					// style: "background: url(" + this.refreshURL + ") no-repeat center center; height: 32px; width: 32px; display: inline-block; position: absolute; left: 45%;"
					n = domConstruct.create("div", { innerHTML: "<p><b>" + hucname + "</b><p>" });
					dom.byId(this.mainpane.domNode).appendChild(n);
					
					//n2 = domConstruct.create("div", {style: "float:right !important", innerHTML: "<p><b>HI</b><p>" });
					//dom.byId(this.mainpane.domNode).appendChild(n2);
					 
					this.tabpan = new TabContainer({
						style: "height: 250px; width: 100%;"
					});
					

					this.SingleStats = new ContentPane({
					//  style:"height:" + this.sph + "px !important",
					  //style: "height: 100%; width: 100%;",
					  title: "Single Statistics",
					  innerHTML: this.currenthuc12.huc12infoText
					});
					
					this.TSStats = new ContentPane({
					//  style:"height:" + this.sph + "px !important",
					  //style: "height: 100%; width: 100%;",
					  title: "Time Series"
					});
					
					this.CatchStats = new ContentPane({
					//  style:"height:" + this.sph + "px !important",
					  //style: "height: 100%; width: 100%;",
					  title: "Catchments",
					  innerHTML: "Show list of Catchments here"
					});
					
					this.TSdiv = domConstruct.create("div");
					dom.byId(this.TSStats.domNode).appendChild(this.TSdiv);
					
					parser.parse();
					
					dom.byId(this.mainpane.domNode).appendChild(this.tabpan.domNode);
					
					this.tabpan.addChild(this.SingleStats);
					this.tabpan.addChild(this.TSStats);
					this.tabpan.addChild(this.CatchStats);
					
					aspect.after(this.tabpan, "selectChild", lang.hitch(this,function (event) {
						this.resize();
					}));
					
					this.tabpan.startup();	
					this.mainpane.startup();
					
					parser.parse();
					
					
					this.TSmetricReturnCount = 0;
					
					array.forEach(this.huc12tsmetrics, lang.hitch(this, function(metric, m) {
					
						 var layerUrl = "http://ec2-54-81-38-200.compute-1.amazonaws.com/wf_api/GetMetric/.jsonp";
						  var layersRequest = esriRequest({
							url: layerUrl,
							content: { "metric_id": metric.id, "feature_type": "huc12", "feature_id" : fid, "time": "50", "dist": "100" },
							handleAs: "json",
							callbackParamName: "callback"
						  });
						  
						  layersRequest.then(lang.hitch(this,this.showTSMetrics, metric));
					  
					}));
			   
			   },
			   
			   selectHuc12: function(evt) {
				
					this.map.graphics.clear();
					highlightSymbol = new SimpleFillSymbol(this.configVizObject.huc12.symbol);
					
					highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
					this.currenthuc12 = evt.graphic;
					this.map.graphics.add(highlightGraphic);
			
					//highlightGraphic.on("click", lang.hitch(this, this.selectHuc12Click));
					
					console.log(evt.graphic.attributes["HUC_12"]);//["HUC_12"])//.getCentroid();
					
					fid = evt.graphic.attributes["HUC_12"]
					
					html.set(this.huc12title, "HUC 12: <br>" + evt.graphic.attributes[this.configVizObject.huc12.nameField]);
					html.set(this.huc12info, "");
					
					
					console.log(this.huc12singlemetrics);
					
					this.metricReturnCount = 0;
					
					array.forEach(this.huc12singlemetrics, lang.hitch(this, function(metric, m) {
					
						 var layerUrl = "http://ec2-54-81-38-200.compute-1.amazonaws.com/wf_api/GetMetric/.jsonp";
						  var layersRequest = esriRequest({
							url: layerUrl,
							content: { "metric_id": metric.id, "feature_type": "huc12", "feature_id" : fid, "time": "50", "dist": "100" },
							handleAs: "json",
							callbackParamName: "callback"
						  });
						  
						  layersRequest.then(lang.hitch(this,this.showMetrics, metric));
						  
						//  layersRequest.then(
						//	function(response) {
						//	  console.log( m + " Success info: ", response);
						//  }, function(error) {
						//	  console.log("Error: ", error);
						//  });
					  
					}));
					
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

					this.currenthuc8 = e[0];
					console.log(e[0].attributes[this.configVizObject.huc8.nameField]);
					
					html.set(this.huc8title, "HUC 8: <br>" + e[0].attributes[this.configVizObject.huc8.nameField]);
			   
			   },
			   
               deactivate: function () {

			
			   
			   },
			   
               hibernate: function () { 
					
					domConstruct.empty(this.mainpane.domNode);
					
			   },

			   showTSMetrics: function(metric, metricValues) {
			   
					TitleNode = domConstruct.create("div", { innerHTML: metric.metric });
					this.TSdiv.appendChild(TitleNode);
			   
					ChartNode = domConstruct.create("div");
					this.TSdiv.appendChild(ChartNode);
			   
					this.TSmetricReturnCount = this.TSmetricReturnCount + 1
					//console.log("mvals", metricValues, "m", metric);
					
					metric["values"] = metricValues;
					
					chartData = [];
					
					array.forEach(metricValues, lang.hitch(this, function(val, v) {
						
						chartData.push(val.metric_value);
					
					}));
					
					if (this.TSmetricReturnCount == this.huc12tsmetrics.length) {
						console.log("All TS Metrics Loaded");
						huc12infoText = ""
						array.forEach(this.huc12tsmetrics, lang.hitch(this, function(metric, m) {
					
							console.log(metric);
							
						}));
						
						//this.TSdiv.innerHTML = "Put Charts Here";
					
					};
					
						console.log(chartData);
						//var chartData = [10000,9200,11811,12000,7662,13887,14200,12222,12000,10009,11288,12099];
					 
						// Create the chart within it's "holding" node
						var chart = new Chart(ChartNode);
					 
						// Set the theme
						chart.setTheme(theme);
					 
						// Add the only/default plot
						chart.addPlot("default", {
							type: "Lines",
							markers: true
						});
					 
						// Add axes
						chart.addAxis("x");
						chart.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major" });
					 
						// Add the series of data
						chart.addSeries("SalesThisDecade",chartData);
					 
						// Render the chart!
						chart.render();
			
			   },
			   
			   showMetrics: function(metric, metricValues) {
			   
					this.metricReturnCount = this.metricReturnCount + 1
					//console.log("mvals", metricValues, "m", metric);
					
					metric["values"] = metricValues;
					
					if (this.metricReturnCount == this.huc12singlemetrics.length) {
						console.log("All Metrics Loaded");
						huc12infoText = ""
						array.forEach(this.huc12singlemetrics, lang.hitch(this, function(metric, m) {
					
							outval = metric.values[0].metric_value;
							
							huc12infoText = huc12infoText + metric.metric + ": " + outval + "<br>"; 
							
						}));
						
						html.set(this.huc12info, huc12infoText);
						
						this.currenthuc12.huc12infoText = huc12infoText;
					}
			
			   },
			   
			   
				initialize: function (frameworkParameters) {
				
					declare.safeMixin(this, frameworkParameters);
			
					domClass.add(this.container, "claro");
					
					this.configVizObject = dojo.eval("[" + configData + "]")[0];
					
					console.log(this.configVizObject);
					
					this.refreshURL = localrequire.toUrl("./images/spinner.gif");
					
					 var layerUrl = "http://ec2-54-81-38-200.compute-1.amazonaws.com/wf_api/GetMetricsList/.jsonp";
					  var layersRequest = esriRequest({
						url: layerUrl,
						content: { "metric_type": "single", "feature_type": "huc12"},
						handleAs: "json",
						callbackParamName: "callback"
					  });
					  
					  layersRequest.then(lang.hitch(this,this.setupMetricLists)); 
					  
					 var layerUrl = "http://ec2-54-81-38-200.compute-1.amazonaws.com/wf_api/GetMetricsList/.jsonp";
					  var layersRequest = esriRequest({
						url: layerUrl,
						content: { "metric_type": "timeseries", "feature_type": "huc12"},
						handleAs: "json",
						callbackParamName: "callback"
					  });
					  
					  layersRequest.then(lang.hitch(this,this.setuptsMetricLists)); 
					  
					//	function(response) {
					//	  console.log("Success rester: ", response);
					//  }, function(error) {
					//	  console.log(alert("Waterflow Rest Server Does not appear to work"));
					//  });
					
					
				},

				setuptsMetricLists: function(response) {
		
					this.huc12tsmetrics = response;
					//console.log("TTTTTTTTTTT", this.huc12tsmetrics);
				
				},
				
				setupMetricLists: function(response) {
		
					this.huc12singlemetrics = response;
					//console.log(this);
				
				},
				
				
			     resize: function(w, h) {
				 
					cdg = domGeom.position(this.container);
					console.log(this.mainpane.domNode);
					
					this.sph = cdg.h-57;

					this.tabpan.resize({"w" : cdg.w - 17, "h" : this.sph});

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

