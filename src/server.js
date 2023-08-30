const express = require("express");
var cors = require('cors')
const app = express();
const port = 5555;
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/students', createProxyMiddleware({
    target: 'http://196.4.80.60:8080',
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));
app.use('/mobile-payments', createProxyMiddleware({
    target: 'http://161.97.101.70:8085',
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.listen(port);