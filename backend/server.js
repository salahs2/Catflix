import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import tvRoutes from "./routes/tvRoutes.js";
import tvRoutes from "./routes/searchRoutes.js";
import protectRoute from "./middleware/protectRoute.js";
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';


const app = express(); 
const PORT = ENV_VARS.PORT

app.use(express.json()); 
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

app.listen(PORT, () => {
    console.log('Server Started at http://localhost:' + PORT);
    connectDB();
});
