const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'cook.biohelix.cn',
    port: 443,
    path: '/ipbEOrGR29.txt',
    method: 'GET',
    rejectUnauthorized: false // 仅测试用
};

const req = https.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('响应内容:');
        console.log(data);
    });
});

req.on('error', (error) => {
    console.error('错误:', error);
});

req.end();
