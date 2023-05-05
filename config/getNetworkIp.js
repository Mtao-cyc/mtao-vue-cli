/*
    getNetworkIp.js
    用于获取WLAN地址
*/
const os = require('os');
 
function getNetworkIp() {
  let needHost = ''; // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces();
    // 获取WLAN的接口
    let alias = network['WLAN'];
    console.log(network['WLAN']);
    for (let i = 0; i < alias.length; i++) {
      // 获取IPv4的地址
      if (alias[i]['family'] === 'IPv4' && alias[i]['address'] !== '127.0.0.1' && !alias[i]['internal']) {
        needHost = alias[i]['address'];
      }
    }
  } catch (e) {
    needHost = 'localhost';
  }
  return needHost;
}
 
module.exports = getNetworkIp