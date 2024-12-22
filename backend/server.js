import express from "express";
import cookieParser from "cookie-parser";
import path from "path";


import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import tvRoutes from "./routes/tvRoutes.js";
import protectRoute from "./middleware/protectRoute.js";
import searchRoutes from "./routes/searchRoutes.js";

import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';


const app = express(); 
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json()); 
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/tv", tvRoutes);
app.use("/api/v1/search", searchRoutes);


if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
});
