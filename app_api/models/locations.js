const mongoose = require('mongoose');

// 1. 리뷰 서브다큐먼트 스키마 정의
const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    'default': Date.now
  }
  
});

// 2. 영업시간 서브다큐먼트 스키마 정의
const openingTimeSchema = new mongoose.Schema({
  days: { type: String, required: true },
  opening: String,
  closing: String,
  closed: { type: Boolean, required: true }
});

// 3. 메인 Location 스키마 정의
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  rating: { type: Number, 'default': 0, min: 0, max: 5 },
  facilities: [String],
  coords: {
    type: { type: String },
    coordinates: [Number]
  },
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

// 위치 기반 2dsphere 인덱스 설정
locationSchema.index({ coords: '2dsphere' });

// 스키마를 Mongoose 모델로 컴파일
mongoose.model('Location', locationSchema);