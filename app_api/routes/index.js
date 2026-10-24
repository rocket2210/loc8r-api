const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');

//Locations 관련 라우트
router.route('/locations')
    .get(ctrlLocations.locationsListByDistance)
    .post(ctrlLocations.locationsCreate);

router.route('/locations/:locationid')
    .get(ctrlLocations.locationsReadOne)
   
//Reviews 관련 라우트
router.route('/locations/:locationid/reviews')
    .post(ctrlReviews.reviewsCreate);

//특정 리뷰 조회, 수정, 삭제 라우트
router.route('/locations/:locationid/reviews/:reviewid')
    .get(ctrlReviews.reviewsReadOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;