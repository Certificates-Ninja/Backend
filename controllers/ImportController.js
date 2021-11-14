const fs = require("fs");
const utils = require("../utils");
const path = require("path");

exports.import = (req, res) => {
  let uploadPath = path.resolve(
    utils.root_path,
    "uploads",
    req.body.identifier,
    "imports",
    Math.random().toString(36).substring(2, 16) + ".csv"
  );

  if (req.body.importType === "file") {
    req.files.csvFile.mv(uploadPath);
  } else {
    fs.writeFile(uploadPath, req.body.csvContent, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  return res.send({ csvPath: uploadPath });
};