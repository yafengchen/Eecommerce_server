const Page = require("../../models/page");

exports.createPage = (req, res) => {
  const { banners, products } = req.files;
  if (banners.length > 0) {
    req.body.banners = banners.map((banner, index) => ({
      img: `/public/${banner.filename}`,
      navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  if (products.length > 0) {
    req.body.products = products.map((product, index) => ({
      img: `/public/${product.filename}`,
      navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  req.body.createdBy = req.auth._id;

  Page.findOne({ category: req.body.category }).exec((err, page) => {
    if (err) return res.status(400).json({ err });
    if (page) {
      Page.findOneAndUpdate({ category: req.body.category }, req.body).exec(
        (err, updatedPage) => {
          if (err) return res.status(400).json({ err });
          if (updatedPage) {
            return res.status(201).json({ page: updatedPage });
          }
        }
      );
    } else {
      const page = new Page(req.body);
      page.save((err, page) => {
        if (err) return res.status(400).json({ err });
        if (page) {
          return res.status(201).json({ page });
        }
      });
    }
  });
};

exports.getPage = (req, res) => {
  const { category, type } = req.params;
  if (type === "page") {
    Page.findOne({ category: category }).exec((err, page) => {
      if (err) return res.status(400).json({ err });
      if (page) return res.status(200).json({ page });
    });
  }
};
