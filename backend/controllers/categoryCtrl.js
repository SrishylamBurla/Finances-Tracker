const asyncHandler = require("express-async-handler");

const Category = require("../model/Category");
const Transaction = require("../model/Transaction");
const { update } = require("./transactionCtrl");

const categoryController = {
  //!=== add =========>
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      throw new Error("name and type are required for creating category");
    }
    const normalizedName = name.toLowerCase();

    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error(`Invalid category type` + type);
    }

    const categoryExists = await Category.findOne({
      user: req.user,
      name: normalizedName,
    });
    if (categoryExists) {
      throw new Error(
        `Category ${categoryExists.name} already exists in the database`
      );
    }
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type: type.toLowerCase(),
    });
    res.status(201).json(category);
  }),
  //!==========lists========>

  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({
      user: req.user,
    });
    res.status(200).json(categories);
  }),

  //!=========update=============>

  
  update: asyncHandler(async (req, res) => {
    const { categoryId } = req.params
      const { type, name } = req.body;
  
      
    // Ensure type and name are provided
    if (!type || !name) {
        return res.status(400).json({ message: "Path `type` and `name` are required" });
    }

    // Ensure type is valid
    if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ message: "Invalid value for `type`. Must be 'income' or 'expense'" });
    }
  
      const normalizedName = name.toLowerCase();
      const category = await Category.findById(req.params.id);
  
      // Check if the category exists
      if (!category) {
          return res.status(404).json({ message: "Category not found" });
      }
  
      // Check if the user is authorized to update the category
      if (category.user.toString() !== req.user.toString()) {
          return res.status(403).json({ message: "User not authorized" });
      }
  
      const oldName = category.name;
  
      // Update category fields
      category.name = normalizedName;
      category.type = type;
  
      // Save the updated category
      const updatedCategory = await category.save();
  
      // Update transactions if the category name has changed
      if (oldName !== updatedCategory.name) {
          await Transaction.updateMany(
              { user: req.user, category: oldName },
              { $set: { category: updatedCategory.name } }
          );
      }
  
      res.status(200).json(updatedCategory);
  }),
  
  






//   update: asyncHandler(async (req, res) => {
//     const { categoryId } = req.params;

//     const { type, name } = req.body;
    
//     const normalizedName = name.toLowerCase();
//     const category = await Category.findById(categoryId);
//     console.log(category);
//     if (!type) {
//         res.status(400).json({ message: "Path `type` is required" });
//         return;
//     }
    //console.log(category.user.toString());
    //console.log(req.user.toString());
//     if (!category && category.user.toString() !== req.user.toString()) {
//       res.json({ message: "Category not found or User not authorized" });
//     }
//     const oldName = category.name;

//     category.name = normalizedName;
//     category.type = type;

//     const updatedCategory = await category.save();

//     if (oldName !== updatedCategory.name) {
//       await Transaction.updateMany(
//         { user: req.user, category: oldName },
//         { $set: { category: updatedCategory.name } }
//       );
//     }
//     res.json(updatedCategory);
//   }),

  //!====================or============================>

  //   update: asyncHandler(async (req, res) => {
  //       try {
  //         const { categoryId } = req.params;
  //         console.log('Updating category with id:', categoryId);

  //         const { type, name } = req.body;
  //         const normalizedName = name.toLowerCase();

  //         const category = await Category.findById(categoryId);

  //         if (!category) {
  //           console.log('Category not found with id:', categoryId);
  //           return res.status(404).json({ message: "Category not found" });
  //         }

  //         if (category.user.toString() !== req.user.toString()) {
  //           return res.status(403).json({ message: "User not authorized to update this category" });
  //         }

  //         const oldName = category.name;

  //         category.name = normalizedName;
  //         category.type = type;

  //         const updatedCategory = await category.save();

  //         if (oldName !== updatedCategory.name) {
  //           await Transaction.updateMany(
  //             { user: req.user, category: oldName },
  //             { $set: { category: updatedCategory.name } }
  //           );
  //         }

  //         res.json(updatedCategory);
  //       } catch (error) {
  //         console.error('Error updating category:', error);
  //         res.status(500).json({ message: "Server error" });
  //       }
  //     }),

  //!=================delete=================>

  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        { user: req.user, category: category.name },
        { $set: { category: defaultCategory } }
      );
      await Category.findByIdAndDelete(req.params.id);
      res.json({
        message: "Category removed and transaction updated",
      });
    } else {
      res.json({
        message: "Category not found or user not authorized",
      });
    }
  }),
};

module.exports = categoryController;
