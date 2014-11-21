define([
        "dojo/_base/declare",
		"framework/PluginBase",
		
		"esri/request",
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
		"esri/request",
		
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
					ESRIRequest,
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
					esriRequest,
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
					
					this.huc8Service = new FeatureLayer(this.configVizObject.huc8.service, {
					  infoTemplate: new InfoTemplate("yo", "HI"),
					  mode: FeatureLayer.MODE_ONDEMAND,
					  outFields: ["*"]
					});
					
					this.map.addLayer(this.huc8Service);
					
					this.huc8Service.on("mouse-over", lang.hitch(this, this.selectHuc8));		
					
					
					
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
					
					
			   },
			   
			   selectHuc12: function(evt) {
				
					this.map.graphics.clear();
					highlightSymbol = new SimpleFillSymbol(this.configVizObject.huc12.symbol);
					
					highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
					this.map.graphics.add(highlightGraphic);
			   
			   },
			   
			   selectHuc8: function(e) {
			   
					console.log(e);
			   
			   },
			   
               deactivate: function () {

			
			   
			   },
			   
               hibernate: function () { 
					
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

