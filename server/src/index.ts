import "dotenv/config";
import express from "express";
import cors from "cors";
import exercisesRouter from "./routes/exercises";
import exerciseGifsRouter from "./routes/exerciseGifs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/exercises", exercisesRouter);
app.use("/api/exercise-gifs", exerciseGifsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});