const csv = require("fast-csv");
const fs = require("fs");
const html_to_pdf = require("html-pdf-node");
const utils = require("../utils");
const path = require("path");
const nodemailer = require("nodemailer");

exports.generate = (req, res) => {
  let template = "";

  let config = {
    host: req.body.useSMTPService ? process.env.SMTP_HOST : req.body.host,
    port: req.body.useSMTPService ? process.env.SMTP_PORT : req.body.port,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: req.body.useSMTPService
          ? process.env.SMTP_USERNAME
          : req.body.username,
      pass: req.body.useSMTPService
          ? process.env.SMTP_PASSWORD
          : req.body.password,
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
  };

  if (req.body.useSMTPService && process.env.MAIL_SERVICE === 'Gmail') {
      config['service'] = 'Gmail';
  }

  let transporter = nodemailer.createTransport(config);

  fs.readFile(req.body.templatePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    template = data;

    fs.createReadStream(req.body.csvPath)
      .pipe(csv.parse({ headers: false }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        let name = row[0];
        let email = row[1];

        let replaced_template = template
          .replace("{{name}}", name)
          .replace("{{email}}", email);
        let pdf_path = path.resolve(
          utils.root_path,
          "generated",
          Math.random().toString(36).substring(2, 16) + ".pdf"
        );

        html_to_pdf
          .generatePdf({ content: replaced_template }, { format: "A4" })
          .then((pdfBuffer) => {
            fs.writeFile(pdf_path, pdfBuffer, async (err) => {
              if (err) {
                console.log(err);
              }
              await transporter.sendMail({
                from: `"${req.body.fromName}" <${req.body.fromMail}>`,
                to: email,
                subject: "Hello ",
                text: "Hello ",
                html: "<b>Hello</b>",
                attachments: [
                  {
                    filename: "certificate.pdf",
                    path: pdf_path,
                  },
                ],
              });
            });
          });
      })
      .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
  });

  return res.end("success");
};