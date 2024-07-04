const asyncHandler = require("express-async-handler")

const Transaction = require("../model/Transaction")

const TransactionController = {

    //!=== add =========>
    create: asyncHandler(async(req, res)=>{
            const {type, category, amount, date, description}= req.body
        if(!type || !amount || !date){
            throw new Error('type, date and amount are required for creating category')
        }
        const transaction = await Transaction.create({
            user: req.user,
            type,
            category,
            amount,
            date,
            description
        })
        res.status(201).json(transaction)

            
        }),
        //!==========lists========>

    getFilteredTransactions: asyncHandler(async (req, res) =>{
        const {startDate, endDate, type, category} = req.query
        
        const filters = { user:req.user }
        if(startDate){
            filters.date = {...filters.date, $gte : new Date(startDate)}
        }
        if(endDate){
            filters.date = {...filters.date, $lte : new Date(endDate)}
        }
        if(type){
            filters.type= type
        }
        if(category){
            if(category==="All"){

            }else if(category==="Uncategorized"){
                filters.category = "Uncategorized"
            }else{
                filters.category = category
            }
        }
        const transactions = await Transaction.find(filters)

        res.status(200).json(transactions)
    }),

    //!=========update=============>

    update: asyncHandler(async (req, res) =>{
        const transaction = await Transaction.findById(req.params.id)
        if(transaction && transaction.user.toString() === req.user.toString()){
            (transaction.type = req.body.type || transaction.type),
            (transaction.category = req.body.category || transaction.category),
            (transaction.amount = req.body.amount || transaction.amount),
            (transaction.date = req.body.date || transaction.date),
            (transaction.description = req.body.description || transaction.description)
        }
        const updatedTransaction = await transaction.save()
        res.send(updatedTransaction)
    }),

    //!=================delete=================>

    delete : asyncHandler(async (req, res) =>{
        const transaction = await Transaction.findById(req.params.id)
        if(transaction && transaction.user.toString() === req.user.toString()){
            await Transaction.findByIdAndDelete(req.params.id)
            res.json({message: "transaction deleted"})
        }

        })
}

module.exports = TransactionController