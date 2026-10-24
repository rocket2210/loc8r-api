const mongoose = require('mongoose');
const readLine = require('readline');
mongoose.set("strictQuery", false);

// MongoDB 연결 URI
//const dbURI = 'mongodb://localhost/Loc8r';
const dbPassword = process.env.MONGODB_PASSWORD;
const dbURI = `mongodb+srv://my_atlas_user:${dbPassword}@cluster0.6au7eq9.mongodb.net/Loc8r`
mongoose.connect(dbURI);

// 연결 상태 이벤트 모니터링
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// 프로세스 종료 시 안전하게 연결 닫기 함수
const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}`);
  callback();
};

// nodemon 재시작 이벤트
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// 앱 종료 이벤트 (Ctrl + C)
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// Heroku 종료 이벤트
process.on('SIGTERM', () => {
     gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

// 스키마 파일 불러오기
require('./locations');