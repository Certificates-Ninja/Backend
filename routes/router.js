const express = require("express");
const ImportController = require("../controllers/ImportController");
const TemplateController = require("../controllers/TemplateController");
const CertificateController = require("../controllers/CertificateController");

const router = express.Router();

router.post("/import", ImportController.import);
router.post("/templates", TemplateController.select);
router.post("/generate", CertificateController.generate);

module.exports = router;
