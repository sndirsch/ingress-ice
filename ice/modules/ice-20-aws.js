/**
 * @file Ingress-ICE, Amazon S3 interface
 * @license MIT
 * @author c2nprds
 */

/*global announce */
/*global fs */
/*global AWS */
/*global webpage */

/**
 * Upload AWS S3
 * @see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
 * @see ALC https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
 * @param {String} key - AWS S3 accessKeyId
 * @param {String} secret - AWS S3 secretKeyId
 * @param {String} bucket - AWS S3 bucket name
 * @param {String} alc - AWS S3 access control list
 * @param {String} path - Screenshot filepath
 * @param {Boolean} remove - delete current file
 * @author c2nprds
 */
function uploadS3(key, secret, bucket, alc, path, remove) {
  var s3 = webpage.create();
  s3.onError = function(msg, trace) {};
  s3.content = '<html><body><input id="file-chooser" name="file-chooser" type="file"></body></html>';

  s3.onCallback = function(data) {
    if (data.status == 200) {
      announce('Successfully! file upload for Amazon S3');
      if (remove) {
        fs.remove(path);
      }
    } else {
      announce('Failure! file upload for Amazon S3');
    }
    s3.close();
  };

  s3.includeJs('http://sdk.amazonaws.com/js/aws-sdk-2.1.34.min.js', function() {
    s3.evaluate(function(key, secret, bucket, alc) {
      var fileChooser = document.querySelector('#file-chooser');
      fileChooser.addEventListener('change', function() {
        var f = fileChooser.files[0];
        if (f) {
          AWS.config.update({accessKeyId: key, secretAccessKey: secret});
          var params = {Key: f.name, ContentType: f.type, Body: f};
          var b = new AWS.S3({params: {Bucket: bucket, ACL: alc}});
          b.putObject(params, function (err, data) {
            window.callPhantom({ status: (err ? 500 : 200), data: data });
          });
        } else {
          window.callPhantom({ status: 400 });
        }
      }, false);
    }, key, secret, bucket, alc);

    s3.uploadFile("input[name=file-chooser]", path);
  });
}
