const model = require('../models/model');

//  post: http://localhost:8080/api/categories
// async function create_Categories(req, res) {
//     const Create = new model.Categories({
//         type: "Investment",
//         color: "#FCBE44"
//     })

//     await Create.save(function (err) {
//         if (!err) return res.json(Create);
//         return res.status(400).json({ message: `Error while creating categories ${err}` });
//     });
// }
async function create_Categories(req, res) {
    try {
        const Create = new model.Categories({
            type: "Savings",
            color: "#1F3B5C"
        });

        const createdCategory = await Create.save();

        res.json(createdCategory);
    } catch (err) {
        res.status(400).json({ message: `Error while creating categories: ${err.message}` });
    }
}


//  get: http://localhost:8080/api/categories
async function get_Categories(req, res) {
    // Fetch all categories from the database
    let data = await model.Categories.find({});
    // console.log(data);

    // Map the data to include only 'type' and 'color' properties
    let filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color }));

    // Send the filtered data as a JSON response
    return res.json(filter);
}
//  post: http://localhost:8080/api/transaction
// async function create_Transaction(req, res) {
//     if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
//     let { name, type, amount } = req.body;

//     const create = await new model.Transaction(
//         {
//             name,
//             type,
//             amount,
//             date: new Date()
//         }
//     );

//     create.save(function (err) {
//         if (!err) return res.json(create);
//         return res.status(400).json({ message: `Erro while creating transaction ${err}` });
//     });

// }
async function create_Transaction(req, res) {
    try {
        if (!req.body) {
            console.log("Hello world!");
            return res.status(400).json("Post HTTP Data not Provided");
        }

        // console.log(req.body);

        const { name, type, amount } = req.body;

        const create = new model.Transaction({
            name,
            type,
            amount,
            date: new Date()
        });

        const savedTransaction = await create.save();
        res.json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: `Error while creating transaction: ${err.message}` });
    }
}


//  get: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
    let data = await model.Transaction.find({});
    return res.json(data);
}

//  delete: http://localhost:8080/api/transaction
// async function delete_Transaction(req, res) {
//     if (!req.body) res.status(400).json({ message: "Request body not Found" });
//     await model.Transaction.deleteOne(req.body, function (err) {
//         if (!err) res.json("Record Deleted...!");
//     }).clone().catch(function (err) { res.json("Error while deleting Transaction Record") });
// }
async function delete_Transaction(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body not found" });
        }

        const result = await model.Transaction.deleteOne(req.body);

        if (result.deletedCount === 1) {
            res.json("Record Deleted...!");
        } else {
            res.json("No matching record found for deletion.");
        }
    } catch (err) {
        res.status(400).json({ message: "Error while deleting Transaction Record" });
    }
}



//  get: http://localhost:8080/api/labels
async function get_Labels(req, res) {

    model.Transaction.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind: "$categories_info"
        }
    ]).then(result => {
        let data = result.map(v => Object.assign({}, { _id: v._id, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color'] }));
        res.json(data);
    }).catch(error => {
        res.status(400).json("Looup Collection Error");
    })

}

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}