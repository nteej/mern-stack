import express, { Router } from 'express';

import { getProducts,showProduct,storeProduct,updateProduct,deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

//List
router.get("/", getProducts);
//show
router.get("/:id", showProduct);
//Store
router.post("/", storeProduct);
//update
router.put("/:id",updateProduct);
//Delete
router.delete('/:id',deleteProduct)

export default router