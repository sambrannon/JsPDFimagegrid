**- - STILL A WORK IN PROGRESS - -**

Overview
===

This plugin uses [JsPDF](https://github.com/MrRio/jsPDF) to generate PDFs with a custom grid arrangement. Each image is resized and positioned to fit perfectly inside each row and column.  

Installation Instructions
===

1. Load up jQuery and JsPDF  
`<script type='text/javascript' src='js/jquery.js'></script>`
`<script type='text/javascript' src='js/jspdf.min.js'></script>`

2. AddJsPDFimagegrid  
`<script type='text/javascript' src='js/imageGrid.js'></script>`

3. Attach the function to a `<button id="uniqueID">` element and fire off the script with `$('#uniqueID').imageGrid(args);` _Note: Should be a button as the script does some special state toggling on the button element._

Examples
---

**Creating a 2x3 grid PDF**

