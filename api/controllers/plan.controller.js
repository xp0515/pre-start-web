const mongoose = require('mongoose');
const Plan = require('../models/Plan.model');

module.exports.getPlans = (req, res, next) => {
  Plan.find()
    .populate('vehicles')
    .populate('items')
    .exec((err, plans) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(plans);
    })
}

module.exports.getPlan = (req, res, next) => {
  Plan.findById(req.params.id)
    .populate('items')
    .populate('vehicles')
    .exec((err, plan) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(plan);
    })
}

module.exports.postPlan = (req, res, next) => {
  let plan = new Plan(req.body);
  plan.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(plan);
  })
}

module.exports.updatePlan = (req, res, next) => {
  Plan.findByIdAndUpdate({ _id: req.params.id },
    req.body,
    (err, plan) => {
      if (err) return res.status(500).send(err);
      return res.send(plan);
    })
}

module.exports.deletePlan = (req, res, next) => {
  Plan.findByIdAndDelete(req.params.id)
    .then(err => {
      if (!err) {
        return res.status(404).send({
          message: "Plan not found with id " + req.params.id
        });
      }
      res.send({ message: "Plan deleted successfully!" });
    })
}
