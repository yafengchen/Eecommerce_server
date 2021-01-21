const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };

  if (req.file) {
    categoryObj.categoryImage = "/public/" + req.file.filename;
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }
  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ msg: error });
    if (category) {
      return res.status(201).json({ category });
    }
  });
};

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

exports.getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) return res.status(400).json({ msg: err });
    if (categories) {
      const categoryList = createCategoryList(categories);
      return res.status(201).json({ categoryList });
    }
  });
};

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }
      const newCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        {
          new: true,
        }
      );
      updatedCategories.push(newCategory);
    }
    return res.status(201).json({ updateCategories: updatedCategories });
  } else {
    const category = {
      name,
      type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const newCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(201).json({ newCategory: newCategory });
  }
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const category_to_delete = await Category.findOneAndDelete({
      _id: ids[i]._id,
    });
    deletedCategories.push(category_to_delete);
  }
  if (deletedCategories.length == ids.length) {
    res.status(200).json({ msg: "categories removed" });
  } else {
    res.status(400).json({ msg: "Something went wrong" });
  }
};
