const utils = require("../utils");
const fs = require("fs");
const path = require("path");

exports.select = (req, res) => {
  let file = "";

  if (req.body.templateType === "existing") {
    file = path.resolve(
      utils.root_path,
      "public",
      "templates",
      `${req.body.templateName}.html`
    );
  } else {
    file = path.resolve(
      utils.root_path,
      "uploads",
      req.body.identifier,
      "templates",
      Math.random().toString(36).substring(2, 16) + ".html"
    );

    // if (req.body.use_file === '1') {
    req.files.templateFile.mv(file);
    // } else {
    //     fs.writeFile(file, req.body.template_content.toString(), (err) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    // }
  }

  return res.send({ templatePath: file });
};