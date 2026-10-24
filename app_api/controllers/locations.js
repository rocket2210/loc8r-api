const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

//거리를 기준으로 위치를 찾는 함수
const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const near = {
    type: "Point",
    coordinates: [lng, lat]
  };
  //geoNear 옵션 설정
  const geoOptions = {
    distanceField: "distance.calculated",
    key: 'coords',
    spherical: true,
    maxDistance: 20000,
  };
  if (!lng || !lat) {
    return res
      .status(404)
      .json({ "message": "lng and lat query parameters are required" });
  }
  //geoNear를 이용하여 근처 위치를 찾는 코드
  try {
    const results = await Loc.aggregate([
      {
        $geoNear: {
          near,
          ...geoOptions
        }
      }
    ]);
    //결과를 가공하여 필요한 정보만 반환
    const locations = results.map(result => {
      return {
        _id: result._id,
        name: result.name,
        address: result.address,
        rating: result.rating,
        facilities: result.facilities,
        distance: result.distance.calculated
      }
    });
    res
      .status(200)
      .json(locations);
  } catch (err) {
    res
      .status(404)
      .json(err);
  }
};
//특정 위치의 상세 정보를 가져오는 함수
const locationsReadOne = async (req, res) => {
  try {
    const location = await Loc.findById(req.params.locationid).exec();
    if (!location) {
      return res
        .status(404)
        .json({ "message": "location not found" });
    }
    return res
      .status(200)
      .json(location);
  } catch (err) {
    return res
      .status(400)
      .json(err);
  }
};
//새로운 위치를 생성하는 함수
const locationsCreate = async (req, res) => {
  try {
    const location = await Loc.create({
      name: req.body.name,
      address: req.body.address,
      facilities: req.body.facilities.split(","),
      coords: {
        type: "Point",
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      },
      openingTimes: [
        {
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        },
        {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }
      ]
    });
    return res.status(201).json(location);

  } catch (err) {
    return res
      .status(400)
      .json(err);
  }
};

// 위치 정보 업데이트
const locationsUpdateOne = async (req, res) => {
  if (!req.params.locationid) {
    return res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
  }
  try {
    const location = await Loc.findById(req.params.locationid).select('-reviews -rating').exec();
    
    if (!location) {
      return res
        .status(404)
        .json({
          "message": "locationid not found"
        });
    }
    location.name = req.body.name;
    location.address = req.body.address;
    location.facilities = req.body.facilities.split(',');
    location.coords = [
      parseFloat(req.body.lng),
      parseFloat(req.body.lat)
    ];
    location.openingTimes = [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }];
    const updatedLocation = await location.save();
    return res
      .status(200)
      .json(updatedLocation);
  } catch (err) {
    return res
      .status(400)
      .json(err);
  }
};

// 위치 삭제
const locationsDeleteOne = async (req, res) => {
  const { locationid } = req.params;
  if (!locationid) {
    return res
      .status(404)
      .json({
        "message": "No Location"
      });
  }
  try {
    const location = await Loc.findByIdAndRemove(locationid).exec();
    if (!location) {
      return res
        .status(404)
        .json({
          "message": "locationid not found"
        });
    }
    return res
      .status(204)
      .json();
  } catch (err) {
    return res
      .status(404)
      .json(err);
  }
};

// 모듈로 내보내기
module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};