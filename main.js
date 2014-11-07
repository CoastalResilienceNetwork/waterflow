define([
        "dojo/_base/declare",
		"framework/PluginBase",
		
		"esri/request",
		"esri/toolbars/draw",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/ArcGISTiledMapServiceLayer",
		"esri/tasks/QueryTask",
		"esri/tasks/query",
		"esri/graphicsUtils",
		"esri/graphic",
		"esri/symbols/SimpleLineSymbol",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleMarkerSymbol",
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
					QueryTask,
					esriQuery,
					graphicsUtils,
					Graphic,
					SimpleLineSymbol,
					SimpleFillSymbol,
					SimpleMarkerSymbol,
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
			   width: 420,
			   infoGraphic: _infographic, 
			   height: _config.pluginHeight,
			   rendered: false,
			   
               activate: function () { 
			   			   
					console.log("HI")
			   },
			   
               deactivate: function () {

			
			   
			   },
			   
               hibernate: function () { 
					
			   },
			   
			   
				initialize: function (frameworkParameters) {
				
					declare.safeMixin(this, frameworkParameters);
			
					domClass.add(this.container, "claro");
					
					this.configVizObject = dojo.eval("[" + configData + "]")[0].regions;
					
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

