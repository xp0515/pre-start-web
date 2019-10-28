const Item = require('../models/item.model');

module.exports.getItems = (req, res, next) => {
  Item.find().exec((err, items) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(items);
  })
}

module.exports.getItem = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(item);
  })
}

module.exports.postItem = (req, res, next) => {
  let item = new Item(req.body);
  item.save((err, item) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(item);
  })
}

module.exports.updateItem = (req, res, next) => {
  Item.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    (err, item) => {
      if (err) return res.status(500).send(err);
      return res.send(item);
    }
  )
}

module.exports.deleteItem = (req, res, next) => {
  Item.findByIdAndDelete(req.params.id)
    .then(err => {
      if (!err) {
        return res.status(404).send({
          message: "Item not found with id " + req.params.id
        });
      }
      res.send({ message: "Item deleted successfully!" });
    })
}

