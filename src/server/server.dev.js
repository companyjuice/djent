'use strict'

import express from 'express'
import path from 'path'

import mongoose from 'mongoose'

// import { renderToString } from 'react-dom/server'
// import { Provider } from 'react-redux'
// import React from 'react'
// import configureStore from '../generic/scripts/app/store/configureStore'
// import { RouterContext, match } from 'react-router'
// import routes from '../generic/scripts/app/routes-chat'
// //import routes from '../generic/scripts/app/routes'
// import createHistory from 'history/createMemoryHistory'
// import DevTools from '../generic/scripts/app/containers/DevTools'
// import cors from 'cors'
// import webpack from 'webpack'
// [MM]
// import webpackConfig from '../../webpack.config.dev'
// //import webpackConfig from '../../webpack.config'
// const compiler = webpack(webpackConfig)
// import User from './models/User'
// import passport from 'passport'
// require('../../config/passport')(passport)
// import SocketIo from 'socket.io'

// const app = express()
// [MM] polling
const app1 = express()

//set env vars
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev'
process.env.PORT = process.env.PORT || 3000
// connect our DB
mongoose.connect(process.env.MONGOLAB_URI)
process.on('uncaughtException', function (err) {
  console.log(err)
})
console.log(
  `
  ===
  [MM] CONNECTED TO DB
  ===
  `
)

// app.use(cors())
// app.use(passport.initialize())

// console.log(
//   `
//   ===
//   ${compiler}
//   ===
//   ${webpackConfig.output.publicPath}
//   ===
//   `
// )

// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: webpackConfig.output.publicPath
// }))
// app.use(require('webpack-hot-middleware')(compiler))


// [MM] polling
var connections = []
var title = 'Untitled Room'

app1.use(express.static('./www'))
app1.use(express.static('./node_modules/bootstrap/dist'))
app1.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../www/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
var server1 = app1.listen(3003)
var ioServer = require('socket.io').listen(server1)

ioServer.sockets.on('connection', function(socket) {
  
  socket.once('disconnect', function() {
    connections.splice(connections.indexOf(socket), 1)
    socket.disconnect()
    console.log("ioServer socket disconnected: %s sockets remaining", connections.length)
  })
  
  socket.on('join', function(payload) {
    var newMember = {
      id: this.id,
      name: payload.name
    }
    this.emit('joined', newMember)
    console.log("ioServer socket audience joined: %s", payload.name)
  })

  socket.emit('welcome', {
    title: title
  })

  connections.push(socket)
  console.log("ioServer socket connected: %s", socket.id)
  console.log("ioServer socket connections: %s", connections.length)
})

console.log("Polling server is running at 'http://localhost:3003'")


// load routers
// const messageRouter = express.Router();
// const usersRouter = express.Router();
// const channelRouter = express.Router();
// require('./routes/message_routes')(messageRouter);
// require('./routes/channel_routes')(channelRouter);
// require('./routes/user_routes')(usersRouter, passport);
// app.use('/api', messageRouter);
// app.use('/api', usersRouter);
// app.use('/api', channelRouter);

// app.use('/', express.static(path.join(__dirname, '..', 'static')));

// app.get('/*', function(req, res) {
//   const history = createHistory()
//   const location = history.location
//   match({ routes, location }, (err, redirectLocation, renderProps) => {

//     const initialState = {
//       auth: {
//         user: {
//           username: 'tester123',
//           id: 0,
//           socketID: null
//         }
//       }
//     }
//     const store = configureStore(initialState);
//     // console.log(redirectLocation);
//     // if(redirectLocation) {
//     //   return res.status(302).end(redirectLocation);
//     // }


//     if(err) {
//       console.error(err);
//       return res.status(500).end('Internal server error');
//     }

//     if(!renderProps) {
//       return res.status(404).end('Not found');
//     }
//     const InitialView = (
//       <Provider className="root" store={store}>
//         <div style={{height: '100%'}}>
//           <RouterContext {...renderProps} />
//           {/* {process.env.NODE_ENV !== 'production' && <DevTools />} */}
//           <DevTools />
//         </div>
//       </Provider>
//     );

//     const finalState = store.getState();
//     const html = renderToString(InitialView)
//     res.status(200).end(renderFullPage(html, finalState));
//   })
// })

// const server = app.listen(process.env.PORT, 'localhost', function(err) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('server listening on port: %s', process.env.PORT);
// });

// const io = new SocketIo(server, {path: '/api/chat'})
// const socketEvents = require('./socketEvents')(io);

// function renderFullPage(html, initialState) {
//   return `
//     <!doctype html>
//     <html lang="en">
//       <head>
//         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
//         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
//         <link rel="icon" href="./favicon.ico" type="image/x-icon" />
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
//         <title>React Redux Socket.io Chat</title>
//       </head>
//       <body>
//         <container id="react">${html}</container>
//         <script>
//           window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
//         </script>
//         <script src="/dist/bundle.js"></script>
//       </body>
//     </html>
//   `
// }
