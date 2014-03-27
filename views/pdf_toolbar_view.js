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
SC.PdfToolbarView = SC.View.extend({
  layout: { top: 0, centerX: 0, height: 30, width: 350 },

  classNames: ['sc-pdf-toolbar'], 

  pdfView: null,

  childViewLayout: SC.View.HORIZONTAL_STACK,
  childViewLayoutOptions: {
    paddingBefore: 5,
    paddingAfter: 5,
    spacing: 5
  },

  childViews: 'pageUp pageDown pageNumber numPages zoomOut zoomIn scaleSelect print'.w(),

  pageUp: SC.ButtonView.extend({
    layout: { centerY: 0, height: 24, width: 30 },
    icon: 'glyphicons up_arrow',
    target: SC.outlet('parentView.pdfView'),
    action: 'pageUp',
  }),

  pageDown: SC.ButtonView.extend({
    layout: { centerY: 0, height: 24, width: 30 },
    icon: 'glyphicons down_arrow',
    target: SC.outlet('parentView.pdfView'),
    action: 'pageDown',
  }),

  pageNumber: SC.TextFieldView.extend({
    layout: { centerY: 0, height: 22, width: 30 },
    valueBinding: '.parentView.pdfView.currentPage',
  }),

  numPages: SC.LabelView.extend({
    layout: { centerY: 0, height: 24, width: 75 },
    valueBinding: SC.Binding.oneWay('.parentView.pdfView.pageLengthLabel'),
  }),

  zoomOut: SC.ButtonView.extend({
    layout: { centerY: 0, height: 24, width: 30 },
    icon: 'glyphicons zoom_out',
    target: SC.outlet('parentView.pdfView'),
    action: 'zoomIn',
  }),

  zoomIn: SC.ButtonView.extend({
    layout: { centerY: 0, height: 24, width: 30 },
    icon: 'glyphicons zoom_in',
    target: SC.outlet('parentView.pdfView'),
    action: 'zoomOut',
  }),


  scaleSelect: SC.SelectView.extend({
    layout: { centerY: 0, height: 24, width: 150 },
    itemsBinding: SC.Binding.oneWay('.parentView.pdfView.scaleSelectItems'),
    itemTitleKey: 'title',
    itemValueKey: 'value',
    valueBinding: '.parentView.pdfView.scaleSelectItem',
  }),

  print: SC.ButtonView.extend({
    layout: { centerY: 0, height: 24, width: 30 },
    marginBefore: 20,
    icon: 'glyphicons print',
    target: SC.outlet('parentView.pdfView'),
    action: 'print',
  }),



});