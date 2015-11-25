/* exported expac */
/* global document, folders */
'use strict';

var expac = function(){
  document.body.addEventListener('error', function(e) {
    console.log('e', e);
    e.target.src = folders.image[e.target.getAttribute('src')];
  }, true);

  Array.prototype.slice.call(document.querySelectorAll('link[href]')).forEach(
    function(el){
      el.setAttribute('href', folders.css[el.getAttribute('href')]);
    }
  );
};

expac();
