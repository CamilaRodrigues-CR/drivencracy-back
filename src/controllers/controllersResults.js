import { db } from "../database/databaseConecction.js"
import { ObjectId } from "mongodb"


export async function getResults(req, res) {
    const { id } = req.params
    try {
        const existEnquet= await db.collection('votes').findOne({ choiceId: new ObjectId(id) })
        if (!existEnquet) return res.sendStatus(404) 

        const result = await db.collection("votes").aggregate([
            {
                $group: {
                    _id: "$choiceId",
                    count: { $sum: 1 }
                } // irá agrupar todos os votos do mesmo id
            },
            {
                $sort: { count: -1 } //vai ordenar do maior para o menor
            },
            {
                $limit: 1   // acho que irá limitar a exibição para 1
            },
            {
                $lookup: {
                    from: "choices",
                    localField: "_id", // id do vote
                    foreignField: "_id", // id da choice
                    pipeline: [
                        {
                            $lookup: {
                                from: 'enquets',
                                localField: '_id', //id da choice
                                foreignField: '_id', //id da enquet
                                as: 'enquetDetails'
                            }
                        },
                        { $unwind: { 'path': '$enquetDetails', } },
                //    {
                //         $group: {
                //              _id: "$enquetDetails._id",                              ---- essa parte eu tirei pq acho que não faz sentido eu agrupar esses dados
                //              enquetTitle: "$enquetDetails.title" ,
                //              enquetExpireAt: "$enquetDetails.expireAt"
                //          }
                //      }
                    ],
                    as: 'choiceDetails'
                }
            },
            {
                $unwind: "$choiceDetails"
            },
            {
                $match: {
                    "choiceDetails.pollId": new ObjectId(id)
                }
            },
            {
                $project: {
                    _id: 0,
                    pollId: "$choiceDetails.pollId",
                    enquetTitle: "$enquetDetails.title" ,
                    enquetExpireAt: "$enquetDetails.expireAt",
                    result : {
                        choiceTitle: "$choiceDetails.title",
                        voteCount: "$count"
                    }
                    
                }
            }
        ]).toArray() 
        /* 
        ([
            {
                $group: {
                    _id: "$choiceId",
                    count: { $sum: 1 }
                } // irá agrupar todos os votos do mesmo id
            },
            {
                $sort: { count: -1 } //vai ordenar do maior para o menor
            },
            {
                $limit: 1   // acho que irá limitar a exibição para 1
            },
            {
                $lookup: {
                    from: "choices",
                    localField: "_id", // id do vote
                    foreignField: "_id", // id da choice
                    as: "choiceDetails"
                }
            },
            {
                $unwind: "$choiceDetails"
            },
            {
                $match: {
                    "choiceDetails.pollId": new ObjectId(id)
                }
            },
            {
                $project: {
                    _id: 0,
                    pollId: "$choiceDetails.pollId",
                    choiceId: "$choiceDetails._id",
                    choiceTitle: "$choiceDetails.title",
                    voteCount: "$count"
                }
            }
        ])
      
        
        */


        console.log(result)


        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}
