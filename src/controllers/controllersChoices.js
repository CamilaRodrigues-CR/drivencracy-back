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

        const choice = await db.collection('choices').insertOne({ title, pollId: new ObjectId(pollId) })
        res.status(201).send(choice)

    } catch (err) {
        res.status(500).send(err.message)
    }
}



export async function getChoices(req, res) {
    const { id } = req.params
    try {
        const enquet = await db.collection("enquets").findOne({ _id: new ObjectId(id) })
        if (!enquet) return res.sendStatus(404)
        
        const choices = await db.collection('choices').find({ pollId:new ObjectId(id)}).toArray()
        res.status(201).send(choices)
    } catch (err) {
        res.status(500).send(err.message)
    }
}