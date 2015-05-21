// ==========================================================================
// Project:   SproutCore PDF
// Copyright: ©2014 GestiXi
// Author:    Nicolas BADIA (nicolas@gestixi.com) and contributors
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** @class
  
  @extends SC.View
  @author Nicolas BADIA
*/
SC.PdfView = SC.View.extend({
  
  /**
    Url of the pdf

    @type String
    @default null
  */
  value: null,
  
  /**
    The pdf object
  */
  pdfDoc: null,

  /**
    Currently displayed page
  */
  pdfPage: null,

  textLayer: null,

  numPages: 0,


  // ..........................................................
  // Internal views
  //

  scrollView: SC.ScrollView.extend({
    backgroundColor: '#FFF',

    /*viewDidResize: function() {
      sc_super();
      this.contentView.updatePdfSize();
    },*/
  }),

  canvasView: SC.View.extend({
      
    render: function(context) {
      context.push('<canvas></canvas>');
    },

  }),


  // ..........................................................
  // Toolbar properties
  //

  pageDown: function() {
    var numPages = this.get('numPages'),
      currentPage = this.get('currentPage');
    
    if (currentPage < numPages) this.incrementProperty('currentPage');
  },

  pageUp: function() {
    var currentPage = this.get('currentPage');
    
    if (currentPage > 1) this.decrementProperty('currentPage');
  },

  currentPage: 1,

  pageLengthLabel: function () {
    var numPages = this.get('numPages');
  
    return '_of %@'.loc(numPages);
  }.property('numPages').cacheable(),

  zoomOut: function() {
    var scale = this.get('scale');
    if (scale < 4) this.set('_scale', scale+.1);
  },

  zoomIn: function() {
    var scale = this.get('scale');
    if (scale > .25) this.set('_scale', scale-.1);
  },


  _defaultScaleSelectItems: [
    // TODO { title: '_pageScaleAuto'.loc(), value: 'pageScaleAuto' },
    // TODO { title: '_pageScaleActual'.loc(), value: 'pageScaleActual' },
    // TODO { title: '_pageScaleFit'.loc(), value: 'pageScaleFit' },
    // TODO { title: '_pageScaleWidth'.loc(), value: 'pageScaleWidth' },
    { title: '50%', value: 0.5 },
    { title: '75%', value: 0.75 },
    { title: '100%', value: 1 },
    { title: '125%', value: 1.25 },
    { title: '150%', value: 1.5 },
    { title: '200%', value: 2 },
  ],

  scaleSelectItems: function () {
    var scale = this.get('_scale'),
      items = this._defaultScaleSelectItems,
      isInclude = false;
  
    items.forEach(function(item) {
      if (item.value === scale) isInclude = true;
    }, this);

    if (!isInclude) {
      items = SC.A(items);
      items.insertAt(4, { title: parseInt(scale*100)+'%', value: scale });
    }

    this.set('scaleSelectItem', scale);
  
    return items;
  }.property('_scale').cacheable(),

  scaleSelectItem: 'pageScaleAuto',

  _scale: 1,

  scale: function () {
    var scaleSelectItem = this.get('scaleSelectItem'),
      ret = scaleSelectItem;

    if (SC.typeOf(scaleSelectItem) !== SC.T_NUMBER) {
      ret = 1;
    }
  
    return ret;
  }.property('scaleSelectItem').cacheable(),

  print: function () {  
    this.doPrint();
  },


  // ..........................................................
  // Init
  //

  createChildViews: function() {
    var scrollView = this.get('scrollView'),
      canvasView = this.get('canvasView');

    scrollView = scrollView.create();
    canvasView = canvasView.create();
    
    this.appendChild(scrollView);

    scrollView.set('contentView', canvasView);

    this.set('scrollView', scrollView);
    this.set('canvasView', canvasView);
  },


  // ..........................................................
  // Properties
  //

  canvasLayer: function () {
    return this.get('canvasView').$('canvas')[0];
  }.property().cacheable(),


  // ..........................................................
  // Observers
  //

  valueDidChange: function() {
    this.invokeOnceLater('getDocument');
  }.observes('value'),

  currentPageDidChange: function() {
    if (this.isRender) this.renderPage();
  }.observes('currentPage'),

  scalePageDidChange: function() {
    if (this.isRender) this.renderPage();
  }.observes('scale'),


  // ..........................................................
  // Rendering
  //

  getDocument: function() {
    this.destroyDocument();

    var that = this,
      value = this.get('value'),
      pdfDoc = PDFJS.getDocument(value);

    pdfDoc.then(function(pdfDoc) {
      SC.run(function() { that.onLoad(pdfDoc); });
    });
  },

  onLoad: function(pdfDoc) {
    this.set('pdfDoc', pdfDoc);

    var isEmpty = pdfDoc.numPages === 0;
    this.set('numPages', pdfDoc.numPages);
    this.set('currentPage', (isEmpty ? 0 : 1));

    this.renderPage();
  },

  renderPage: function() {
    if (this.isRendering) return;
    this.isRendering = true;

    var that = this,
      pdfDoc = this.get('pdfDoc'),
      currPage = this.get('currentPage');

    pdfDoc.getPage(currPage).then(function(page) {
      SC.run(function() { that._renderPage(page); });
    });
  },

  _renderPage: function(page) {
    this.pdfPage = page;

    var pdfDoc = this.get('pdfDoc'),
      viewport = page.getViewport(this.get('scale')),
      canvasView = this.get('canvasView'),
      currPage = this.get('currentPage'),
      canvasLayer = this.get('canvasLayer'),
      textLayer;

    if (!canvasLayer) return;

    canvasView.adjust({
      width: viewport.width,
      height: viewport.height,
    });

    canvasLayer.height = viewport.height;
    canvasLayer.width = viewport.width;

    var ctx = canvasLayer.getContext('2d');
    ctx.save();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvasLayer.width, canvasLayer.height);
    ctx.restore();

    /*
    // TODO Not working 
    // textLayer is needed to allow text selection.

    var textLayerDiv = null;
    if (!this.disableTextLayer) {
      textLayerDiv = document.createElement('div');
      textLayerDiv.className = 'sc-pdf-text-layer';
      textLayerDiv.style.width = canvasLayer.width + 'px';
      textLayerDiv.style.height = canvasLayer.height + 'px';
      canvasView.get('layer').appendChild(textLayerDiv);
    }
    textLayer = this.textLayer =
    textLayerDiv ? new TextLayerBuilder({
      textLayerDiv: textLayerDiv,
      pageIndex: currPage - 1,
      viewport: viewport
    }) : null;
    */

    var renderContext ={
      canvasContext: ctx,
      viewport: viewport,
      textLayer: textLayer
    };
    page.render(renderContext);


    this.isRender = true;
    this.isRendering = false;
  },


  // ..........................................................
  // Destroy
  //

  destroy: function() {
    this.destroyDocument();
    sc_super();
  },

  destroyDocument: function() {
    var pdfDoc =  this.get('pdfDoc');

    if (pdfDoc) {
      pdfDoc.destroy();
      this.set('pdfDoc', null);
      var canvasLayer = this.get('canvasLayer');
      canvasLayer.getContext('2d').clearRect(0, 0, canvasLayer.width, canvasLayer.height);
    }
  },


  // ..........................................................
  // Print
  //

  /**
    Loads the PDF inside an iframe and print it.
  */
  doPrint: function () {
    var iframe = this._printIframe;
    if (!this._printIframe) {
      iframe = this._printIframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      iframe.style.display = 'none';
      iframe.onload = function() {
        setTimeout(function() {
          iframe.focus();
          iframe.contentWindow.print();
        }, 1);
      };
    }
    
    iframe.src = this.get('value');
  },

});
