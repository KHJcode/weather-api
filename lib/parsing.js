const request = require('request');

const _text =  ['<ddclass="now_weather1_centertemp1MB10">','</dd>','<dtclass="w_hour1MB5">','<ddclass="now_weather1_center">'];

function webParsing (url) {
  return new Promise((resolve, reject) => {
    try {
      request(url, function(error, res, html){
        if (error) throw error;
        html = html.replace(/(\s*)/g, '');
        html = html.replace(/�|\n|\r/gi, '');
        let nowWint = html.substring(html.indexOf(_text[2]),html.indexOf(_text[2])+200).substring(html.substring(html.indexOf(_text[2]),html.indexOf(_text[2])+200).indexOf('km')-5,html.substring(html.indexOf(_text[2]),html.indexOf(_text[2])+200).indexOf('km')+4);
        nowWint = nowWint.substring(nowWint.indexOf('.')-1);
        const nowHumi = html.substring(html.indexOf(_text[2]),html.indexOf(_text[2])+200).substring(html.substring(html.indexOf(_text[2]),html.indexOf(_text[2])+200).indexOf('%')-2,html.substring(html.indexOf(_text[2]),html.indexOf(_text[2])+200).indexOf('%')+1);
        const nowTemp = html.substring(html.indexOf(_text[0])+_text[0].length,9059).substring(0,html.substring(html.indexOf(_text[0])+_text[0].length,9057).indexOf(_text[1]));
        resolve({
          wisp: nowWint,
          humi: nowHumi,
          temp: nowTemp
        });
      });
    } catch {
      reject(Error('error'));
    }
  });
}

module.exports = webParsing;
