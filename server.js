const express = require('express'),
    app = express(),
    request = require('request'),
    PORT = process.env.PORT || 3000;

var RE = 6371.00877,
    GRID = 5.0,
    SLAT1 = 30.0,
    SLAT2 = 60.0,
    OLON = 126.0,
    OLAT = 38.0,
    XO = 43,
    YO = 136; 

    function dfs_xy_conv(code, v1, v2) {
        var DEGRAD = Math.PI / 180.0;
        var RADDEG = 180.0 / Math.PI;

        var re = RE / GRID;
        var slat1 = SLAT1 * DEGRAD;
        var slat2 = SLAT2 * DEGRAD;
        var olon = OLON * DEGRAD;
        var olat = OLAT * DEGRAD;

        var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        var rs = {};

        if (code == "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
            ra = re * sf / Math.pow(ra, sn);
            var theta = v2 * DEGRAD - olon;
            if (theta > Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
            rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        }
        else {
            rs['x'] = v1;
            rs['y'] = v2;
            var xn = v1 - XO;
            var yn = ro - v2 + YO;
            ra = Math.sqrt(xn * xn + yn * yn);
            if (sn < 0.0) - ra;
            var alat = Math.pow((re * sf / ra), (1.0 / sn));
            alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            }
            else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI * 0.5;
                    if (xn < 0.0) - theta;
                }
                else theta = Math.atan2(xn, yn);
            }
            var alon = theta / sn + olon;
            rs['lat'] = alat * RADDEG;
            rs['lng'] = alon * RADDEG;
        }
        return rs;
    }

app.get('/',  (req,res) => {
    const pages = "<h2>Welcome to KHJ's weather api!</h2> <h3>Please leave your inquiry <a href='https://open.kakao.com/me/KHJcode'>here</a> to use this api.</h3>"
    res.send(pages);
});

app.get('/:id/:v1,:v2', (req, res) => {
const userkey = ['portfolio'],
    srcText =  ['<ddclass="now_weather1_centertemp1MB10">','</dd>','<dtclass="w_hour1MB5">','<ddclass="now_weather1_center">'],
    id = req.params.id,
    v1 = req.params.v1,
    v2 = req.params.v2,
    rs = dfs_xy_conv('toXY',v1,v2),
    url = `https://www.weather.go.kr/weather/forecast/digital_forecast.jsp?x=${rs.x}&y=${rs.y}&unit=K`;
    if (userkey.includes(id)) {
        request(url, function(error, response, html){
            if (error) {
                throw error;
            }
            html = html.replace(/(\s*)/g, ''),
            html = html.replace(/�/gi, ''),
            html = html.replace(/\n/gi, ''),
            html = html.replace(/\r/gi, '');
            var nowWint = html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).substring(html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('km')-5,html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('km')+4);
            nowWint = nowWint.substring(nowWint.indexOf('.')-1);
            var nowHumi = html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).substring(html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('%')-2,html.substring(html.indexOf(srcText[2]),html.indexOf(srcText[2])+200).indexOf('%')+1);
            var nowTemp = html.substring(html.indexOf(srcText[0])+srcText[0].length,9059).substring(0,html.substring(html.indexOf(srcText[0])+srcText[0].length,9057).indexOf(srcText[1]));
            const values = {
                현재_기온: `${nowTemp}`,
                현재_습도: `${nowHumi}`,
                현재_풍속: `${nowWint}`,
                출처: `https://www.weather.go.kr/w/index.do`
            }
            if (nowTemp) {
                return res.status(404).json(values);
            } else {
                return res.status(404).json(`입력된 위도,경도의 값이 올바르지 않습니다.`);
            }
        });
    } else {
        return res.status(404).json({err: 'This Location is Error.'});
    }
});

app.listen(PORT);
