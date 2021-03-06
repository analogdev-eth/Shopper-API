const { Product } = require('../models/product.js');
const { productValidation } = require('../middlewares/validation.js');


class ProductController {

  allProducts = async (req, res) => {
    try {
      const productsList = await Product.find();
      res.json({ 'success': true, 'response': productsList });
    }
    catch(error) {
      res.json({ 'success': false, 'response': 'An error occured !' });
    }
  }

  createProduct = async (req, res) => {
    const { value, error } = productValidation(req.body);
    if (error) {
      return res.json({ 'success': false, 'response': error.details[0].message });
    }

    const { product_name, product_description, date_uploaded, date_edited, product_variety } = value;
    try {
      const body = await new Product({
        product_name,
        product_description,
        date_uploaded,
        date_edited,
        product_variety
      });
      const newProduct = await body.save();
      res.json({ 'success': true, 'response': newProduct });
    }
    catch(error) {
      res.json({ 'success': false, 'response': 'An error occured !' });
    }
  }

  updateProduct = async (req, res) => {
    const { value, error } = productValidation(req.body);
    if (error) {
      return res.json({ 'success': false, 'response': error.details[0].message });
    }

    const id = req.params.id;
    const { product_name, product_description, date_uploaded, date_edited, product_variety } = value;
    try {
      const updateProduct = await Product.updateOne(
        { _id: id },
        { $set: {
          product_name,
          product_description,
          date_uploaded,
          date_edited: new Date(),
          product_variety
        }}
      );
      res.json({ 'success': true, 'response': updateProduct });
    }
    catch(error) {
      res.json({ 'success': false, 'response': 'An error occured !' });
    }
  }

  deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
      const dbResponse = await Product.deleteOne({ _id: id });
      res.json({ 'success': true, 'response': dbResponse });
    }
    catch(error) {
      res.json({ 'success': false, 'response': 'An error occured !' });
    }
  }

}


const productController = new ProductController();
module.exports = {
  allProducts: productController.allProducts,
  createProduct: productController.createProduct,
  updateProduct: productController.updateProduct,
  deleteProduct: productController.deleteProduct
}