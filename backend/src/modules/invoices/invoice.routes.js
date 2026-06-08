const router = require("express").Router();
const invoiceController = require("./invoice.controller");
const auth = require("../../middlewares/auth.middleware");
const permission = require("../../middlewares/permission.middleware");

router.use(auth);

router.post("/", permission("invoices", "add"), invoiceController.createInvoice);
router.get("/", permission("invoices", "view"), invoiceController.getInvoices);
router.get("/:id", permission("invoices", "view"), invoiceController.getInvoiceById);
router.put("/:id", permission("invoices", "edit"), invoiceController.updateInvoice);

module.exports = router;