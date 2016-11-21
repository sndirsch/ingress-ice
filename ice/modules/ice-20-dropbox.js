/**
 * @file Ingress-ICE, Dropbox interface
 * @license MIT
 * @author c2nprds
 */

/*global announce */
/*global fs */
/*global webpage */

/**
 * Upload Dropbox
 * @see AccessToken https://www.dropbox.com/developers/reference/oauth-guide
 * @param {String} token - Dropbox token
 * @param {String} remotepath - Upload path
 * @param {String} path - Screenshot filepath
 * @param {Boolean} remove - delete current file
 * @author c2nprds
 */
function uploadDropbox(token, remotepath, path, remove) {
  var dropbox = webpage.create();

  dropbox.onError = function(msg, trace) {};
  dropbox.content = '<html><body><input id="file-chooser" name="file-chooser" type="file"></body></html>';

  dropbox.onCallback = function(data) {
    if (data.status == 200) {
      announce('Successfully! file upload for Dropbox');
      if (remove) {
        fs.remove(path);
      }
    } else {
      announce('Failure! file upload for Dropbox');
    }
    dropbox.close();
  };

  dropbox.evaluate(function(token, remotepath) {
    var fileChooser = document.querySelector('#file-chooser');

    fileChooser.addEventListener('change', function() {
      var file = new FileReader();

      file.addEventListener("load", function(e) {
        var xhr = new XMLHttpRequest();
        var buffer = new Uint8Array(file.result);

        xhr.onload = function() {
          if (xhr.status === 200) {
            window.callPhantom({ status: 200, data: JSON.parse(xhr.response) });
          } else {
            window.callPhantom({ status: 500 });
          }
        };

        xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
          path: remotepath,
          mode: 'add'
        }));

        xhr.send(buffer);
      });

      file.readAsArrayBuffer(fileChooser.files[0]);
    }, false);

  }, token, remotepath);

  dropbox.uploadFile("input[name=file-chooser]", path);
}
