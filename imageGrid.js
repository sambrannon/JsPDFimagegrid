(function ($) {

  $.fn.imageGrid = function(columns, rows, pageUrl){

    $(this).click(function(){

      var button = $(this);

      // make button inactive
      button.attr('disabled', 'disabled');

      // swap icon for spinner
      button.addClass('loading');

      // Unit conversion between px/in. 1" at 150 ppi == 150 pixels
      var unitScale = 150;

      // establish paper sizes. US letter is 1275 x 1650px @ 150 ppi
      var paperWidth = 1275;
      var paperHeight = 1650;
      var marginSize = 30;

      //set up footer size
      var footerHeight = 80;

      //set up image container sizes
      var containerWidth = ( paperWidth - (marginSize * 2) ) / columns;
      var containerHeight = (paperHeight - footerHeight) / rows;

      var containerWidthIn = containerWidth / unitScale;
      var containerHeightIn = containerHeight / unitScale;

      var containerInnerWidth = containerWidth - (marginSize * 2);
      var containerInnerHeight = containerHeight - (marginSize * 4); //two extra for title space
      var containerInnerRatio = containerInnerWidth / containerInnerHeight;

      $.get( pageUrl, function(rawData){

          /*************************************
          Cover Page
          *************************************/
          // Initialize new PDF
          var doc = new jsPDF('p', 'in', 'letter');
          doc.setFont("helvetica");

          var footerInfo = function(){

            // set up main copyright footer text
            var footerText = 'Proofs are for reference only. Copyright clearance must be arranged prior to reproduction or distribution.';
            var footerTextOffsetX = ( 380 ) / unitScale;
            var footerTextOffsetY = ( ( containerHeight * rows ) + ( marginSize * 1.5 ) ) / unitScale;
            doc.text(footerText, footerTextOffsetX, footerTextOffsetY);

          };

          var pageNumber = function(imgCount, rows, columns, currentImg){

            //get total number of pages
            var imgsPerPage = rows * columns;
            var totalPages = Math.ceil(imgCount / imgsPerPage);

            //get current page
            var curPage = Math.ceil(currentImg / imgsPerPage);

            var pageNumText = 'Page ' + curPage + '/' + totalPages;
            var pageNumY = ( ( containerHeight * rows ) + ( marginSize * 1.5 ) ) / unitScale;
            //var pageNumX = 7.75;
            var pageNumX = ( marginSize ) / unitScale;

            doc.text(pageNumText, pageNumX, pageNumY);

          };

          /*************************************
          Image Pages
          *************************************/
          var images = $(rawData).find('li > img');

          images.each(function(index){

            var imageNumber = index+1;

            //get image title
            var imageTitle = $(this).data('title');

            //get image dimensions
            var imageWidth = $(this).data('width'),
                imageHeight = $(this).data('height'),
                imageRatio = imageWidth / imageHeight;

            //set new image dimensions
            if( imageRatio > containerInnerRatio ){ //more landscaped
              imageWidth = containerInnerWidth;
              imageHeight = imageWidth / imageRatio;
            } else if( imageRatio < containerInnerRatio ){ //more portrait
              imageHeight = containerHeight - (marginSize * 4);
              imageWidth = imageHeight * imageRatio;
            }

            // set offset defaults
            var topOffset,
                leftOffset;

            //set offset values
            if( imageRatio > containerInnerRatio ){
              topOffset = (containerHeight - imageHeight) / 2; //more landscaped
              leftOffset = marginSize;
            } else if( imageRatio < containerInnerRatio) {
              topOffset = marginSize;
              leftOffset = (containerWidth - imageWidth) / 2; //more portrait
            } else {
              topOffset = marginSize;
              leftOffset = marginSize;
            }

            //get column number for image
            var colNumber = imageNumber % columns;
            if( colNumber === 0 ){
              colNumber = columns;
            }

            //get row number for image
            var rowNumber = Math.ceil( imageNumber / columns );
            rowNumber = rowNumber % rows;
            if( rowNumber === 0 ){
              rowNumber = rows;
            }

            //set horizontal offset
            var leftPos = ( (colNumber-1) * containerWidth ) + leftOffset + marginSize;

            //set vertical offset
            var topPos =  ( (rowNumber-1) * containerHeight ) + topOffset;

            //convert everything to inches
            var imageWidthIn = imageWidth / unitScale;
            var imageHeightIn = imageHeight / unitScale;
            var leftPosIn = leftPos / unitScale;
            var topPosIn = topPos / unitScale;

            //get image source
            var imageSrc = $(this).attr('src');

            //ADD RECTANGLE TO PDF
            /* rectangle x and y */
            var frameX = ( (colNumber-1) * containerWidth ) + marginSize;
                frameX = frameX / unitScale;
            var frameY = ( (rowNumber-1) * containerHeight );
                frameY = frameY / unitScale;

            doc.setDrawColor(230,230,230);
            doc.setLineWidth(0.008);
            doc.rect(frameX, frameY, containerWidthIn, containerHeightIn);

            //ADD IMAGE TO PDF
            doc.addImage(imageSrc, 'JPEG', leftPosIn, topPosIn, imageWidthIn, imageHeightIn);

            //add image title
            var titleOffsetX = ( ( (colNumber-1) * containerWidth ) + marginSize + marginSize ) / unitScale;
            var titleOffsetY = ( topPos + imageHeight + (marginSize * 2) ) / unitScale;
            doc.setFontSize(10);
            doc.setTextColor(160,160,160);
            doc.text( imageTitle, titleOffsetX, titleOffsetY );

            if( imageNumber % (columns * rows) === 1 ){

              headerInfo();
              footerInfo();
              pageNumber( images.length, rows, columns, imageNumber );

            }

            if( imageNumber % (columns * rows) === 0 && imageNumber !== images.length ){
              //add new page
              doc.addPage();
            }

          });

          //save pdf
          var slugcontent_hyphens = title.replace(/\s/g,'-');
          var finishedslug = slugcontent_hyphens.replace(/[^a-zA-Z0-9\-]/g,'');
          var fileTitle = finishedslug.toLowerCase();

          doc.save( fileTitle + '_' + columns + 'x' + rows + '.pdf');

        }).done(function(){
          //switch loading button back to normal
          // make button inactive
          button.removeAttr('disabled');

          // swap icon for spinner
          button.removeClass('loading');
        }).fail(function(){
          window.alert('There was an error processing this PDF, please try again or contact me for help.');
        });

    });

  }; // end function

}(jQuery));