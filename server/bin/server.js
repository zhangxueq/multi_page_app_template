const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { routerFactory } = require('../routes')
const CONFIG = require('../../build/config')
const port = CONFIG.PORT
let app = express()
let webpackConfig = require('../../build/webpack.dev.config')
let compiler = webpack(webpackConfig)

;(async app => {
	// 用 webpack-dev-middleware 启动 webpack 编译
	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		overlay: true,
		hot: true
	}))

	// 使用 webpack-hot-middleware 支持热更新
	app.use(webpackHotMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		noInfo: true
	}))

	app.use(webpackConfig.output.publicPath, express.static(path.resolve(__dirname, '../../src')))

	// 构造路由
	routerFactory(app)

	// 错误处理
	app.use((err, req, res, next) => {
		res.status(err.status || 500)
		res.send(err.stack || 'Service Error')
		/*
		res.render('error', {
			message: err.message,
			error: err
		})
		*/
	})
})(app)

app.listen(port, () => console.log(`development is listening on port ${port}`))
