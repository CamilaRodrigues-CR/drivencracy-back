import moment from "moment"
import { db } from "../database/databaseConecction.js"
import { ObjectId } from "mongodb"


export async function postChoices(req, res) {
    const { title, pollId } = req.body

    try {
        const enquet = await db.collection("enquets").findOne({ _id: new ObjectId(pollId) })
        if (!enquet) return res.sendStatus(404)

        const titleChoice = await db.collection('choices').findOne({ title })
        if (titleChoice) return res.sendStatus(409)

        await db.collection('choices').insertOne({ title, pollId: new ObjectId(pollId) })

        const choice = await db.collection('choices').findOne({ title })

        return res.status(201).send(choice)

    } catch (err) {
        res.status(500).send(err.message)
    }
}


// ----------- rota get
export async function getChoices(req, res) {
    const { id } = req.params
    try {
        const enquet = await db.collection("enquets").findOne({ _id: new ObjectId(id) })
        if (!enquet) return res.sendStatus(404)

        const choices = await db.collection('choices').find({ pollId: new ObjectId(id) }).toArray()
        res.status(201).send(choices)
    } catch (err) {
        res.status(500).send(err.message)
    }
}


//-------------------- votos ----------------------------
export async function postVote(req, res) {
    const { id } = req.params

    try {
        const choice = await db.collection("choices").findOne({ _id: new ObjectId(id) })
        if (!choice) return res.sendStatus(404)

        const createdAt = moment().format('YYYY-MM-DD HH:mm')

        await db.collection('votes').insertOne({ createdAt, choiceId: new ObjectId(id) })

        return res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }

}

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
        ]).toArray() // tenho agregado: o id da enquete, o id da escolha, o titulo da escolha mais votada e o numero de votos

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



