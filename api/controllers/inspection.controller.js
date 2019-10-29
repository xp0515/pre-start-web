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

module.exports.updateInspection = (req, res, next) => {
    Inspection.findByIdAndUpdate({ _id: req.params.id },
        req.body,
        (err, inspection) => {
            if (err) return res.status(500).send(err);
            return res.send(inspection);
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

module.exports.postInspection = (req, res, next) => {
    if (req.body.signature) {
        req.body.signature = Buffer.from(req.body.signature.split(",")[1], "base64");
    }
    let inspection = new Inspection(req.body);
    inspection.save(err => {
        if (err) return res.status(500).send(err);
        return res.status(200).send({ _id: inspection._id, message: 'Inspection saved successfully' });
    })
}