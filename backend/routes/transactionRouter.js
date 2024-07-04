const express = require("express")
const transactionController = require("../controllers/transactionCtrl")
const isAuthenticated = require("../middlewares/isAuth")


const transactionRouter = express.Router()
transactionRouter.post("/api/v1/transaction/create", isAuthenticated, transactionController.create)
transactionRouter.get("/api/v1/transaction/lists", isAuthenticated, transactionController.getFilteredTransactions)
transactionRouter.put("/api/v1/transaction/update/:id", isAuthenticated, transactionController.update)
transactionRouter.delete("/api/v1/transaction/delete/:id", isAuthenticated, transactionController.delete)


module.exports = transactionRouter