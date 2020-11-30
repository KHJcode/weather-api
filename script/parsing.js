const request = require('request');

const srcText =  ['<ddclass="now_weather1_centertemp1MB10">','</dd>','<dtclass="w_hour1MB5">','<ddclass="now_weather1_center">'];

function webParsing (url) {
  return new Promise((resolve, reject) => {
    try {
      request(url, function(error, response, html){
        if (error) throw error;
        html = html.replace(/(\s*)/g, '');
        html = html.replace(/�|\n|\r/gi, '');
        var nowWint = html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).substring(html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('km')-5,html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('km')+4);
        nowWint = nowWint.substring(nowWint.indexOf('.')-1);
        var nowHumi = html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).substring(html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('%')-2,html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('%')+1);
        var nowTemp = html.substring(html.indexOf(srcText[0])+srcText[0].length,9059).substring(0,html.substring(html.indexOf(srcText[0])+srcText[0].length,9057).indexOf(srcText[1])) + '°C';
        const data = { wisp: nowWint, humi: nowHumi, temp: nowTemp, };
        if (data) {
          if (mode === 'all') resolve(data);
          else resolve(data[mode]);
        }
      });
    } catch {
      reject(Error('error'));
    }
  });
}

module.exports = webParsing;
