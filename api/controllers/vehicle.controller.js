const mongoose = require("mongoose");
const Vehicle = require('../models/vehicle.model');

module.exports.getVehicles = (req, res, next) => {
  Vehicle.find().exec((err, vehicles) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(vehicles);
  })
}

module.exports.postVehicle = (req, res, next) => {
  let vehicle = new Vehicle(req.body);
  vehicle.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(vehicle);
  })
}

