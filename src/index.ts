import express, { Express } from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.routes";
import authRouts from './routes/auth.route'
import userRouts from './routes/user.route'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Routes
app.use("/auth", authRouts);
app.use("/admin", adminRoutes);
app.use("/user", userRouts);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});