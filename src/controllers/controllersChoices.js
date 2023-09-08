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



