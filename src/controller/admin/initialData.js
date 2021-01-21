const Category = require("../../models/category");
const Product = require("../../models/product");

function createCategoryList(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((elem) => elem.parentId == undefined);
  } else {
    category = categories.filter((elem) => elem.parentId == parentId);
  }
  for (let elem of category) {
    categoryList.push({
      _id: elem.id,
      name: elem.name,
      slug: elem.slug,
      parentId: elem.parentId,
      children: createCategoryList(categories, elem._id),
      type: elem.type,
    });
  }
  return categoryList;
}
exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  res.status(200).json({
    categories: createCategoryList(categories),
    products,
  });
};
