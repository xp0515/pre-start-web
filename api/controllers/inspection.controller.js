const Inspection = require('../models/Inspection.model');

module.exports.getInspections = (req, res, next) => {
  Inspection.find()
    .populate('vehicle')
    .populate('plan')
    .populate('result.item')
    .exec((err, inspections) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(inspections);
    })
}

module.exports.getInspection = (req, res, next) => {
  Inspection.findById(req.params.id)
    .populate('vehicle')
    .populate('plan')
    .populate('result.item')
    .exec((err, inspection) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(inspection);
    })
}

module.exports.deleteInspection = (req, res, next) => {
  Inspection.findByIdAndDelete(req.params.id)
    .then(err => {
      if (!err) {
        return res.status(404).send({
          message: "Inspection not found with id " + req.params.id
        });
      }
      res.send({ message: "Inspection deleted successfully!" });
    })
}
