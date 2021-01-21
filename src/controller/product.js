const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  const { name, price, description, category, createdBy, quantity } = req.body;
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const product = new Product({
    name: name,
    slug: slugify(name),
    price: price,
    description: description,
    productPictures,
    category,
    quantity,
    createdBy: req.auth._id,
  });

  product.save((err, product) => {
    if (err) return res.status(400).json({ err });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.getProducts = (req, res) => {
  Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .exec((err, allproducts) => {
      if (err) {
        return res.status(400).json({ err });
      }
      if (allproducts) {
        return res.status(200).json({
          allproducts,
        });
      }
    });
};

exports.getProductsBySlug = (req, res) => {
  Category.findOne({ slug: req.params.slug })
    .select("_id")
    .exec((err, category) => {
      if (err) {
        return res.status(400).json({ err });
      }
      if (category) {
        Product.find({ category: category._id }).exec((err, products) => {
          if (err) {
            return res.status(400).json({ err });
          }
          if (products.length > 0) {
            res.status(200).json({
              products,
              productsByPrice: {
                under5k: products.filter((product) => product.price <= 50000),
                under10k: products.filter(
                  (product) => product.price <= 100000 && product.price > 50000
                ),
              },
            });
          }
        });
      }
    });
};

exports.getProductById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((err, product) => {
      if (err) {
        return res.status(400).json({ err });
      }
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ err: "Params required" });
  }
};
