# SproutCore PDF

A basic PDF Viewer for SproutCore.

![ScreenShot](https://raw.github.com/GestiXi/sproutcore-pdf/master/screen-shot.png)

## Features

- PDF Rendering using the great Mozilla PDF.js Library (<a href="https://github.com/mozilla/pdf.js">https://github.com/mozilla/pdf.js</a>)
- Page navigation
- Zoom in/out
- Printing


## Getting Started
  
First, you will have to include PDF.js (<a href="https://github.com/mozilla/pdf.js">https://github.com/mozilla/pdf.js</a>). Since the library is a bit heavy, you may want to load it as a module. 

We recommand you to include:

- compatibility.js
- pdf.js

Once PDF.js is loaded you have to set some variables:
    
    PDFJS.workerSrc = "http://assets.example.com/pdf.worker.js";
    PDFJS.imageResourcesPath = "http://assets.example.com/images";
    PDFJS.cMapUrl = "http://assets.example.com/cmaps";
    PDFJS.cMapPacked = true;


## Usage

You can add a PDF viewer the same as you would for any control:

    MyApp.MyPdfView = SC.PdfViewerView.extend({
      value: 'https://github.com/mozilla/pdf.js/raw/master/web/compressed.tracemonkey-pldi-09.pdf'
    })


## Note

Currently, the icons of the toolbar needs the GLYPHICONS library which is not include here.


## TODOs

- Multiple pages rendering
- Provides text-selection functionality
- Provides a "search" or "find" functionality
- Add some tests


## License

The MIT License (MIT)

