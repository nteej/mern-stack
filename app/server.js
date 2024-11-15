import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import productRoutes from "./routes/product.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());//enable to accept JSON data in payload

app.get("/", (req, res) => {
    res.send('Server is ready')
});

app.use('/api/products',productRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:'+PORT);
})

