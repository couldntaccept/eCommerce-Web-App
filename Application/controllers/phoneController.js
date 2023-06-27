const Phone = require("../models/phone");


exports.setHidden = async (req, res) => {

    let reviewindex = "reviews." + req.body.indexnumber + ".hidden"
    let setunset = ""
    if (req.body.hide === true) {
        setunset = "$set"
    } else {
        setunset = "$unset"
    }

    try {
        const hide = await Phone.findOneAndUpdate(
            { "_id": req.body.phoneid },
            {
                [setunset]: {
                    [reviewindex]: ""

                }
            },
            //returns the new object instead of the original object
            { new: true }

        )
        res.send(hide.reviews[req.body.indexnumber])

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}

exports.getPhone = async (req, res) => {
    //Pass in a Phone ID and return a Phone Object
    //Same code as searchPhones except it converts string to the object ID.

    console.log("Received request to search phone " + req.query.id)

    try {
        //const phone = await Phone.findById(req.query.id);
        const phone = await Phone.aggregate([
            //Stage 1: Get the Phone Object that matches the quey paramters
            {
                $match: {
                    $expr: {
                        $eq:
                            ['$_id', { $toObjectId: req.query.id }]
                    }
                }
            }
            ,
            {//Stage 2: Lookup the seller ID to the user ID collection and return concatenated firstname+" "+lastname
                $lookup:
                {
                    from: "users",
                    let: { "sellerid": { $toObjectId: "$seller" } },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr: { $eq: ["$_id", "$$sellerid"] }

                            }
                        },
                        {
                            $project: { sellerfullname: { $concat: ["$firstname", " ", "$lastname"] }, _id: 0 }

                        },
                    ],
                    as: "sellerfullnametemp"
                }
            },

            //Stage 3: Take the elements in sellerfullname and make it a field in the parent document
            { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$sellerfullnametemp", 0] }] } } }

            ,

            //Stage 4: Get all fields for the next transformation

            { $project: { sellerfullname: 1, seller: 1, brand: 1, disabled: 1, image: 1, price: 1, stock: 1, title: 1, reviews: { reviewer: 1, rating: 1, comment: 1, hidden: 1 } } }
            ,//Stage 5: Turn the reviews into 
            { "$unwind": { path: "$reviews", preserveNullAndEmptyArrays: true } }
            ,
            //Stage 6: Push the reviews up one level
            { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$reviews"] } } }
            ,//Stage 7: Get all the fields for the lookup
            { $project: { sellerfullname: 1, seller: 1, brand: 1, disabled: 1, image: 1, price: 1, stock: 1, title: 1, reviewer: 1, rating: 1, comment: 1, hidden: 1 } }
            ,//Stage 8: Lookup the reviewerid to the users table
            {
                $lookup:
                {
                    from: "users",
                    let: { "reviewerid": { $toObjectId: "$reviewer" } },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr: { $eq: ["$_id", "$$reviewerid"] }

                            }
                        },
                        {

                            $project: { reviewerid: 1, reviewername: { $concat: ["$firstname", " ", "$lastname"] } }

                        },
                    ],
                    as: "reviewerfullname"
                }
            }

            ,//Stage 9: Regroup the data by ID

            {

                $group: {
                    _id: {
                        _id: "$_id",
                        seller: "$seller",
                        sellerfullname: "$sellerfullname",
                        brand: "$brand",
                        disabled: "$disabled",
                        image: "$image",
                        price: { $round: ["$price", 2] },
                        stock: "$stock",
                        title: "$title"

                    },

                    reviews: {
                        $push: {
                            reviewerid: "$reviewer",
                            reviewer: { $arrayElemAt: ["$reviewerfullname.reviewername", 0] },
                            rating: "$rating",
                            comment: "$comment",
                            hidden: "$hidden"
                        },

                    }
                }
            }

            , //Stage 10: Brings the "_id" group up one level so that it goes back to the original format
            { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$_id"] } } }


        ]);

        res.json(phone)

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });

    }
}

exports.postReview = async (req, res) => {
    //Find the Phone object ID that matches the phone ID and then push a review object into the 'reviews' array
    try {
        const update = await Phone.findOneAndUpdate(
            { "_id": req.body.phoneid },

            {
                $push: {
                    "reviews":
                    {
                        "reviewer": req.body.userid,
                        "rating": req.body.rating,
                        "comment": req.body.comment
                    }
                }
            })
        res.send("Received")
        //{_id: ObjectId('6430089e45ff6d9e55bc01af')}
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.searchPhones = async (req, res) => {
    let searchcriteria = Object.keys(req.query)[0]
    let searchterm = ""
    switch (searchcriteria) {
        case 'title':
            searchterm = req.query.title
            break;

        case 'seller':
            searchterm = req.query.seller
            break;
    }


    try {

        console.log("Received search request by " + searchcriteria + " for: \"" + searchterm + "\". Running query on database...")
        const phones = await Phone.aggregate(

            /*This  function passes in a 'title' or 'sellerid' search in the query string returns a case insensitive, partial match of phones.
    
                There are additional stages included to transform the seller IDs and reviewer IDs into names.
                The object that is returned will resemble the original object in the database, however, there are two fields that are added:
                1) "sellerfullname"
                2) reviews:
                    [{
                        "reviewer"
                    }]
    
                */

            [
                {//Stage 1: Get a case insensitive match on the title
                    $match: { [searchcriteria]: { $regex: searchterm, $options: 'i' } }
                    //[searchterm]
                }
                ,
                {//Stage 2: Lookup the seller ID to the user ID collection and return concatenated firstname+" "+lastname
                    $lookup:
                    {
                        from: "users",
                        let: { "sellerid": { $toObjectId: "$seller" } },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr: { $eq: ["$_id", "$$sellerid"] }

                                }
                            },
                            {
                                $project: { sellerfullname: { $concat: ["$firstname", " ", "$lastname"] }, _id: 0 }

                            },
                        ],
                        as: "sellerfullnametemp"
                    }
                },

                //Stage 3: Take the elements in sellerfullname and make it a field in the parent document
                { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$sellerfullnametemp", 0] }] } } },

                //Stage 4: Get all fields for the next transformation

                { $project: { sellerfullname: 1, seller: 1, brand: 1, disabled: 1, image: 1, price: 1, stock: 1, title: 1, reviews: { reviewer: 1, rating: 1, comment: 1, hidden: 1 } } }
                ,//Stage 5: Turn the reviews into 
                { "$unwind": { path: "$reviews", preserveNullAndEmptyArrays: true } }
                ,
                //Stage 6: Push the reviews up one level
                { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$reviews"] } } }
                ,//Stage 7: Get all the fields for the lookup
                { $project: { sellerfullname: 1, seller: 1, brand: 1, disabled: 1, image: 1, price: 1, stock: 1, title: 1, reviewer: 1, rating: 1, comment: 1, hidden: 1 } }
                ,//Stage 8: Lookup the reviewerid to the users table
                {
                    $lookup:
                    {
                        from: "users",
                        let: { "reviewerid": { $toObjectId: "$reviewer" } },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr: { $eq: ["$_id", "$$reviewerid"] }

                                }
                            },
                            {

                                $project: { reviewerid: 1, reviewername: { $concat: ["$firstname", " ", "$lastname"] } }

                            },
                        ],
                        as: "reviewerfullname"
                    }
                }

                ,//Stage 9: Regroup the data by ID

                {

                    $group: {
                        _id: {
                            _id: "$_id",
                            sellerfullname: "$sellerfullname",
                            seller: "$seller",
                            brand: "$brand",
                            disabled: "$disabled",
                            image: "$image",
                            price: { $round: ["$price", 2] },
                            stock: "$stock",
                            title: "$title"

                        },

                        reviews: {
                            $push: {

                                reviewerid: "$reviewer",
                                reviewer: { $arrayElemAt: ["$reviewerfullname.reviewername", 0] },
                                rating: "$rating",
                                comment: "$comment",
                                hidden: "$hidden"
                            },

                        }
                    }
                }
                , //Stage 10: Brings the "_id" group up one level so that it goes back to the original format
                { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$_id"] } } }
                ,
                //Stage 11: Sort by price ascending
                { $sort: { price: 1 } }
            ]
        );

        console.log("Successful - Sending data to client")
        res.json(phones)

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });

    }
}

exports.soldoutPhones = async (req, res) => {
    try {
        const phones = await Phone.aggregate([
            {
                $match: {
                    stock: { $gt: 0 },
                    disabled: { $exists: false },
                },
            },

            {
                $lookup:
                {
                    from: "users",
                    let: { "sellerid": { $toObjectId: "$seller" } },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr: { $eq: ["$_id", "$$sellerid"] }

                            }
                        },
                        {
                            $project: { sellerfullname: { $concat: ["$firstname", " ", "$lastname"] }, _id: 0 }

                        },
                    ],
                    as: "sellerfullname"
                }

            },
            { $unwind: {path: "$sellerfullname", preserveNullAndEmptyArrays: true }},
            {
                $addFields: {
                    sellerfullname: "$sellerfullname.sellerfullname",
                },
            },
            {
                $unwind: {
                  path: "$reviews",
                  preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { reviewerid: { $toObjectId: '$reviews.reviewer' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$reviewerid'] }
                            }
                        },
                        {
                            $project: {
                                reviewerfullname: { $concat: ['$firstname', ' ', '$lastname'] },
                                _id: 0
                            }
                        }
                    ],
                    as: 'reviews.reviewerfullname'
                }
            },
            { $unwind: {path:'$reviews.reviewerfullname', preserveNullAndEmptyArrays: true}},
            {
                $group: {
                    _id: '$_id',
                    seller: { $first: '$seller' },
                    sellerfullname: { $first: '$sellerfullname' },
                    brand: { $first: '$brand' },
                    disabled: { $first: '$disabled' },
                    image: { $first: '$image' },
                    price: { $first: '$price' },
                    stock: { $first: '$stock' },
                    title: { $first: '$title' },
                    reviews: {
                        $push: {
                            reviewer: '$reviews.reviewer',
                            reviewerfullname: '$reviews.reviewerfullname.reviewerfullname',
                            rating: '$reviews.rating',
                            comment: '$reviews.comment',
                            hidden: '$reviews.hidden'
                        }
                    },
                    averageRating: { $first: '$averageRating' }
                }
            },
            {
                $sort: { stock: 1, title: 1 },
            },
            {
                $limit: 5,
            },

        ]);

        res.json(phones);
    } catch (err) {
            console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.bestsellerPhones = async (req, res) => {
    try {
        const phones = await Phone.aggregate([
            { $match: { disabled: { $ne: true }, 'reviews.1': { $exists: true } } },
            { $addFields: { averageRating: { $avg: '$reviews.rating' } } },

            { $sort: { averageRating: -1 } },
            { $limit: 5 },
            {
                $lookup:
                {
                    from: "users",
                    let: { "sellerid": { $toObjectId: "$seller" } },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr: { $eq: ["$_id", "$$sellerid"] }

                            }
                        },
                        {
                            $project: { sellerfullname: { $concat: ["$firstname", " ", "$lastname"] }, _id: 0 }

                        },
                    ],
                    as: "sellerfullname"
                }

            },
            { $unwind: "$sellerfullname" },
            {
                $addFields: {
                    sellerfullname: "$sellerfullname.sellerfullname",
                },
            },
            {
                $unwind: '$reviews'
            },
            {
                $lookup: {
                    from: 'users',
                    let: { reviewerid: { $toObjectId: '$reviews.reviewer' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$reviewerid'] }
                            }
                        },
                        {
                            $project: {
                                reviewerfullname: { $concat: ['$firstname', ' ', '$lastname'] },
                                _id: 0
                            }
                        }
                    ],
                    as: 'reviews.reviewerfullname'
                }
            },
            { $unwind: '$reviews.reviewerfullname' },
            {
                $group: {
                    _id: '$_id',
                    seller: { $first: '$seller' },
                    sellerfullname: { $first: '$sellerfullname' },
                    brand: { $first: '$brand' },
                    disabled: { $first: '$disabled' },
                    image: { $first: '$image' },
                    price: { $first: '$price' },
                    stock: { $first: '$stock' },
                    title: { $first: '$title' },
                    reviews: {
                        $push: {
                            reviewer: '$reviews.reviewer',
                            reviewerfullname: '$reviews.reviewerfullname.reviewerfullname',
                            rating: '$reviews.rating',
                            comment: '$reviews.comment',
                            hidden: '$reviews.hidden'
                        }
                    },
                    averageRating: { $first: '$averageRating' }
                }
            },
            { $sort: { averageRating: -1, title: 1 } },
            { $limit: 5 },

        ]);

        res.json(phones)

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });

    }
}


exports.viewComments = async (req, res) => {

    /*THIS FUNCTION HAS BEEN REPLACED BY SEARCHPHONES*/
    const { userId } = req.params;

    const phones = await Phone.find({ 'reviews.reviewer': userId });

    const userPhoneComments = phones.map((phone) => {
        return {
            id: phone._id,
            title: phone.title,
            comments: phone.reviews.filter((review) => review.reviewer === userId),
        };
    });

    res.json(userPhoneComments);
}




exports.getPhonesByTitle = async (req, res) => {
    // no need populate with full names
    try {
        const phones = await Phone.find({ title: req.body.name });
        res.json(phones)
    } catch (err) {
        console.error(err);
    }
};

exports.getPhonesByTitleWithFullname = async (req, res) => {

    try {
        const phones = await Phone.find({ title: req.query.title })
            .populate('seller', 'firstname lastname')
            .populate('reviews.reviewer', 'firstname lastname');
        res.json(phones)
    } catch (err) {
        console.error(err);
    }
};

exports.toggleHidden = async (req, res) => {
    const { phoneId, commentIndex } = req.params;
    try {
        const phone = await Phone.findById(phoneId);

        if (!phone) {
            return res.status(404).json({ error: 'Phone not found' });
        }

        const comment = phone.reviews[commentIndex];

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if ('hidden' in comment) {
            delete comment.hidden;
        } else {
            comment.hidden = "";
        }

        await phone.save();

        res.json(phone);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
