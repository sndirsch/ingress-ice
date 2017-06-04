/**
 * @file Ingress-ICE, extra features
 * @license MIT
 */

/*global page */
/*global config */

/**
 * Adds a timestamp to a screenshot
 * @since 2.3.0
 * @param {String} time
 * @param {boolean} iitcz
 */
function addTimestamp(time, iitcz) {
  if (!iitcz) {
    page.evaluate(function(dateTime) {
      var water = document.createElement('p');
      water.id='watermark-ice';
      water.innerHTML = dateTime;
      water.style.position = 'absolute';
      water.style.color = 'orange';
      water.style.top = '0';
      water.style.left = '0';
      water.style.fontSize = '40px';
      water.style.opacity = '0.8';
      water.style.marginTop = '0';
      water.style.paddingTop = '0';
      water.style.fontFamily = 'monospace';
      water.style.textShadow = '2px 2px 5px #111717';
      document.querySelector('#map_canvas').appendChild(water);
    }, time);
  } else {
    page.evaluate(function(dateTime) {
      var water = document.createElement('p');
      water.id='watermark-ice';
      water.innerHTML = dateTime;
      water.style.position = 'absolute';
      water.style.color = '#3A539B';
      water.style.top = '0';
      water.style.zIndex = '4404';
      water.style.marginTop = '0';
      water.style.paddingTop = '0';
      water.style.left = '0';
      water.style.fontSize = '40px';
      water.style.opacity = '0.8';
      water.style.fontFamily = 'monospace';
      water.style.textShadow = '2px 2px 5px #111717';
      document.querySelectorAll('body')[0].appendChild(water);
    }, time);
  }
}

/**
 * Inserts IITC and defines settings
 * @var hideRes
 * @var hideEnl
 * @var hideLink
 * @var hideField
 * @var minlevel
 * @var maxlevel
 * @var plugins
 * @var pluginsConfig
 * @author akileos (https://github.com/akileos)
 * @author Nikitakun
 */
function addIitc() {
  page.evaluate(function(field, link, res, enl, min, max) {
    localStorage['ingress.intelmap.layergroupdisplayed'] = JSON.stringify({
      "Unclaimed Portals":Boolean(min === 1),
      "Level 1 Portals":Boolean(min === 1),
      "Level 2 Portals":Boolean((min <= 2) && (max >= 2)),
      "Level 3 Portals":Boolean((min <= 3) && (max >= 3)),
      "Level 4 Portals":Boolean((min <= 4) && (max >= 4)),
      "Level 5 Portals":Boolean((min <= 5) && (max >= 5)),
      "Level 6 Portals":Boolean((min <= 6) && (max >= 6)),
      "Level 7 Portals":Boolean((min <= 7) && (max >= 7)),
      "Level 8 Portals":Boolean(max === 8),
      "Fields":field,
      "Links":link,
      "Resistance":res,
      "Enlightened":enl,
      "DEBUG Data Tiles":false,
      "Artifacts":true,
      "Ornaments":true
    });
    var script = document.createElement('script');
    script.type='text/javascript';
    script.src='https://static.iitc.me/build/release/total-conversion-build.user.js';
    document.head.insertBefore(script, document.head.lastChild);
  }, !config.hideField, !config.hideLink, !config.hideRes, !config.hideEnl, config.minlevel, config.maxlevel);
  setupIitcPlugins(JSON.parse(config.pluginsConfig));
  JSON.parse(config.plugins).forEach(function(plugin) {
    loadIitcPlugin(plugin);
  })
}

/**
 * Loads an IITC plugin
 * @arg src {String}
 */
function loadIitcPlugin(src) {
  page.evaluate(function(src) {
    var script = document.createElement('script');
    script.type='text/javascript';
    script.src=src;
    document.head.insertBefore(script, document.head.lastChild);
  }, src);
}

/**
 * Configures IITC plugins
 * @arg settings {array}
 */
function setupIitcPlugins(settings) {
  page.evaluate(function(settings) {
    settings.forEach(function(param) {
      localStorage[param.key] = param.value;
    });
  }, settings);
}
