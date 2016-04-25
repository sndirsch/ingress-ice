/**
 * @file Ingress-ICE, setMinMax
 * @license MIT
 */

/*global page */
/*global announce */

/**
 * Sets minimal and maximal portal levels (filter) by clicking those buttons on filter panel.
 * 10 000 ms will be enough
 * @summary Portal level filter
 * @param {number} min - minimal portal level
 * @param {number} max - maximum portal level
 */
function setMinMax(min, max) {
  var minAvailable = page.evaluate(function() {
    return document.querySelectorAll('.level_notch.selected')[0];
  });
  if (parseInt(minAvailable.id[9], 10) > min) {
    announce('The minimal portal level is too low for current zoom, using default.');
  } else {
    var rect = page.evaluate(function() {
      return document.querySelectorAll('.level_notch.selected')[0].getBoundingClientRect();
    });
    page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
    window.setTimeout(function() {
      var rect1 = page.evaluate(function(min) {
        return document.querySelector('#level_low' + min).getBoundingClientRect();
      }, min);
      page.sendEvent('click', rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);
      if (max === 8) {
        page.evaluate(function() {
          document.querySelector('#filters_container').style.display = 'none';
        });
      }
    }, 2000);
  }
  if (max < 8) {
    window.setTimeout(function() {
      var rect2 = page.evaluate(function() {
        return document.querySelectorAll('.level_notch.selected')[1].getBoundingClientRect();
      });
      page.sendEvent('click', rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);
      window.setTimeout(function() {
        var rect3 = page.evaluate(function(min) {
          return document.querySelector('#level_high' + min).getBoundingClientRect();
        }, max);
        page.sendEvent('click', rect3.left + rect3.width / 2, rect3.top + rect3.height / 2);
        page.evaluate(function() {
          document.querySelector('#filters_container').style.display = 'none';
        });
      }, 2000);
    }, 4000);
  }
}
