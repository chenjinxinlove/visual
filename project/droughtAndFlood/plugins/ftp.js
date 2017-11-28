/**
 * Created by chen on 2017/4/21.
 */
/**
 * Created by littledu on 15/4/28.
 */

var path = require('path');

module.exports = function(config){
  var remotePath = config['ftp']['remotePath'] || "";
  var url = 'http://' + path.join(remotePath, config['projectName'], 'dist/pages/').replace(/\\/g, '/');
}
