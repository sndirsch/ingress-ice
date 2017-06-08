/**
 * @file Ingress-ICE, mandatory features
 * @license MIT
 */

/*global idleReset */
/*global announce */
/*global config */
/*global page */
/*global folder */
/*global getDateTime */
/*global hideDebris */
/*global curnum */
/*global greet */
/*global cookiesFileExists */
/*global firePlainLogin */
/*global addCookies */
/*global main */
/*global ssnum */
/*global phantom */
/*global addTimestamp */
/*global afterCookieLogin */

/**
 * Screenshot wrapper
 */
function s(file) {
  announce('Screen saved');
  page.render(file);
}

/**
 * Screenshots counter
 * @var {number} curnum
 * @var {number} ssnum
 */
function count() {
  if ((curnum >= ssnum)&&(ssnum !== 0)) {
    announce('Finished sucessfully. Exiting...\nThanks for using ingress-ice!');
    phantom.exit();
  } else if (ssnum !== 0) {
    announce('Screen #' + (curnum + 1) + '/' + ssnum + ' captured');
    curnum++;
  }
}

/**
 * Hide debris on the map like selectors
 * @param {boolean} iitcz
 */
function hideDebris(iitcz) {
  if (iitcz) {
    window.setTimeout(function() {
      page.evaluate(function() {
        if (document.querySelector('#chat'))                      {document.querySelector('#chat').style.display = 'none';}
        if (document.querySelector('#chatcontrols'))              {document.querySelector('#chatcontrols').style.display = 'none';}
        if (document.querySelector('#chatinput'))                 {document.querySelector('#chatinput').style.display = 'none';}
        if (document.querySelector('#portal_highlight_select'))   {document.querySelector('#portal_highlight_select').style.display = 'none';}
        if (document.querySelector('#updatestatus'))              {document.querySelector('#updatestatus').style.display = 'none';}
        if (document.querySelector('#sidebartoggle'))             {document.querySelector('#sidebartoggle').style.display = 'none';}
        if (document.querySelector('#scrollwrapper'))             {document.querySelector('#scrollwrapper').style.display = 'none';}
        if (document.querySelector('.leaflet-control-container')) {document.querySelector('.leaflet-control-container').style.display = 'none';}
      });
    }, 2000);
  } else {
    page.evaluate(function() {
      if (document.querySelector('#comm'))             {document.querySelector('#comm').style.display = 'none';}
      if (document.querySelector('#player_stats'))     {document.querySelector('#player_stats').style.display = 'none';}
      if (document.querySelector('#game_stats'))       {document.querySelector('#game_stats').style.display = 'none';}
      if (document.querySelector('#geotools'))         {document.querySelector('#geotools').style.display = 'none';}
      if (document.querySelector('#header'))           {document.querySelector('#header').style.display = 'none';}
      if (document.querySelector('#snapcontrol'))      {document.querySelector('#snapcontrol').style.display = 'none';}
      if (document.querySelectorAll('.img_snap')[0])   {document.querySelectorAll('.img_snap')[0].style.display = 'none';}
      if (document.querySelector('#display_msg_text')) {document.querySelector('#display_msg_text').style.display = 'none';}
    });
    page.evaluate(function() {
      var hide = document.querySelectorAll('.gmnoprint');
      for (var index = 0; index < hide.length; ++index) {
        hide[index].style.display = 'none';
      }
    });
  }
}

/**
 * Prepare map for screenshooting. Make screenshots same width and height with map_canvas
 * If IITC, also set width and height
 * @param {boolean} iitcz
 * @param {number} widthz
 * @param {number} heightz
 */
function prepare(iitcz, widthz, heightz) {
  if (iitcz) {
    window.setTimeout(function() {
      page.evaluate(function(w, h) {
        var water = document.createElement('p');
        water.id='viewport-ice';
        water.style.position = 'absolute';
        water.style.top = '0';
        water.style.marginTop = '0';
        water.style.paddingTop = '0';
        water.style.left = '0';
        water.style.width = w;
        water.style.height = h;
        document.querySelectorAll('body')[0].appendChild(water);
      }, widthz, heightz);
      var selector = "#viewport-ice";
      setElementBounds(selector);
    }, 4000);
  } else {
    var selector = "#map_canvas";
    setElementBounds(selector);
  }
}

/**
 * Sets element bounds
 * @param selector
 */
function setElementBounds(selector) {
  page.clipRect = page.evaluate(function(selector) {
    var clipRect = document.querySelector(selector).getBoundingClientRect();
    return {
      top:    clipRect.top,
      left:   clipRect.left,
      width:  clipRect.width,
      height: clipRect.height
    };
  }, selector);
}

/**
 * Checks if human presence not detected and makes a human present
 * @since 2.3.0
 */
function humanPresence() {
  var outside = page.evaluate(function() {
    return !!(document.getElementById('butterbar') && (document.getElementById('butterbar').style.display !== 'none'));
  });
  if (outside) {
    var rekt = page.evaluate(function() {
      return document.getElementById('butterbar').getBoundingClientRect();
    });
    page.sendEvent('click', rekt.left + rekt.width / 2, rekt.top + rekt.height / 2);
  }
}

/**
 * Does postprocessing like uploading to AWS, Dropbox, etc.
 * @arg file {String}
 */
function postprocess (file) {
  // The reason why only one of them can be processed is because the file may be deleted.
  if (config.S3Key) {
    announce('Uploading to Amazon S3...');
    uploadS3(config.S3Key, config.S3Secret, config.S3Bucket, config.S3Alc, config.directory+file, config.S3Remove);
  } else if (config.DropboxToken) {
    announce('Uploading to Dropbox...');
    uploadDropbox(config.DropboxToken, config.DropboxPath+file, config.directory+file, config.DropboxRemove);
  }
}

/**
 * Main function.
 */
function main() {
  count();
  if (config.timestamp) {
    page.evaluate(function() {
      if (document.getElementById('watermark-ice')) {
        var oldStamp = document.getElementById('watermark-ice');
        oldStamp.parentNode.removeChild(oldStamp);
      }
    });
  }
  if (config.iitc) {
    page.evaluate(function() {
      idleReset();
      // If 'Reload IITC' window appears...
      if (window.blockOutOfDateRequests) {
        window.location.reload();
      }
    });
  } else {
    humanPresence();
    hideDebris(config.iitc);
  }
  window.setTimeout(function() {
    if (config.timestamp) {
      addTimestamp(getDateTime(0, config.timezone), config.iitc);
    }
    if (config.format == undefined || config.format == '') {
      lastScreen = 'ice-' + getDateTime(1, config.timezone) + '.png';
    } else {
      lastScreen = 'ice-' + getDateTime(1, config.timezone) + '.' + config.format;
    }
    file = folder + lastScreen;
    s(file);
    postprocess(lastScreen);
  }, 2000);
}

/**
 * Starter
 */
function ice() {
  greet();
  if (config.SACSID == undefined || config.SACSID == '') {
    loadCookies();
  }
  if (config.SACSID == undefined || config.SACSID == '') {
    firePlainLogin();
  } else {
    addCookies(config.SACSID, config.CSRF);
    announce('Using cookies to log in');
    afterCookieLogin();
  }
}
