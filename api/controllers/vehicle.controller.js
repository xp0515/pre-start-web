const Vehicle = require('../models/vehicle.model');

module.exports.getVehicles = (req, res, next) => {
  Vehicle.find().exec((err, vehicles) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(vehicles);
  })
}

module.exports.getVehicle = (req, res, next) => {
  Vehicle.findById(req.params.id)
    .exec((err, vehicle) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(vehicle);
    })
}

module.exports.postVehicle = (req, res, next) => {
  let vehicle = new Vehicle(req.body);
  vehicle.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(vehicle);
  })
}

