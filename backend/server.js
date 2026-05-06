require("dotenv").config();

const express = require("express");
const cors = require("cors");
const generationRoutes = require("./src/routes/generationRoutes");
const correctionRoutes = require("./src/routes/correctionRoutes");
const exportRoutes = require("./src/routes/exportRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const documentLibraryRoutes = require("./src/routes/documentLibraryRoutes");
const sectionRoutes = require("./src/routes/sectionRoutes");
const inlineEditRoutes = require("./src/routes/inlineEditRoutes");
const documentReviewRoutes = require("./src/routes/documentReviewRoutes");
const documentSummaryRoutes = require("./src/routes/documentSummaryRoutes");
const documentComparisonRoutes = require("./src/routes/documentComparisonRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/generation", generationRoutes);
app.use("/api/correction", correctionRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/documents", documentLibraryRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/inline-edit", inlineEditRoutes);
app.use("/api/review", documentReviewRoutes);
app.use("/api/summary", documentSummaryRoutes);
app.use("/api/comparison", documentComparisonRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});