// ==========================================================================
// Project:   SproutCore PDF
// Copyright: ©2014 GestiXi
// Author:    Nicolas BADIA (nicolas@gestixi.com) and contributors
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/pdf_view');
sc_require('views/pdf_toolbar_view');

/** @class

  @extends SC.View
  @author Nicolas BADIA
*/
SC.PdfViewerView = SC.View.extend({

  /**
    Url of the pdf

    @type String
    @default null
  */
  value: null,

  childViews: ['pdfView', 'toolbarView'],

  toolbarView: SC.PdfToolbarView.extend({
    pdfView: SC.outlet('parentView.pdfView'),
  }),

  pdfView: SC.PdfView.extend({
    valueBinding: SC.Binding.oneWay('.parentView.value'),
  }),


});
