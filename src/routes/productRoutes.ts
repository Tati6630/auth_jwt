import { Router } from "express";
import {
  createProduct,
  listProduct,
  listProductById,
  updateProductById,
  deleteProductById
} from "../controllers/productController.ts";
import { auth } from "../middleware/auth.ts";


const productRouter = Router();

productRouter.post("/product", auth, createProduct);

productRouter.get("/product", auth, listProduct);

productRouter.get("/product/:id", auth, listProductById);

productRouter.put("/product/:id", auth, updateProductById);

productRouter.delete("/product/:id", auth, deleteProductById);

export default productRouter;