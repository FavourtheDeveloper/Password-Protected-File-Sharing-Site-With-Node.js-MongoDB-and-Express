const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const File = require("./model/file");
const app = express();
app.listen(3000);

const upload = multer({ dest: "uploads" });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.URI)
  .then((result) => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("file");
});

app.post("/", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File.create(fileData);
  console.log(file);
  res.render("file", { filelink: `${req.headers.origin}/file/${file.id}` });
});

app.route("/file/:id").get(handleDownload).post(handleDownload);

async function handleDownload(req, res) {
  const currentfileid = req.params.id;

  const file = await File.findById(currentfileid);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }

  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);
  res.download(file.path, file.originalName);
}
