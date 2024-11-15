import Product from "../models/product.model.js";
import mongoose from 'mongoose';
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: false, message: "", data: products });

    } catch (error) {
        console.error("Error in products fetching:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const showProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (product) {
            res.status(200).json({ success: false, message: "", data: product });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }


    } catch (error) {
        console.error("Error in product fetching:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const storeProduct = async (req, res) => {
    const product = req.body;
    //validation
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: "Provide all mandate fields" });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, message: "", data: newProduct });

    } catch (error) {
        console.error("Error in product creation:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateProduct =  async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product,{new:true});
        res.status(200).json({ success: false, message: "", data: updatedProduct });

    } catch (error) {
        console.error("Error in products fetching:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }

};
export const deleteProduct =  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid product id" });
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product Deleted" })
    } catch (error) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
}