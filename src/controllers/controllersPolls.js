import { db } from "../database/databaseConecction.js";
import moment from "moment";

//-------- rota post --------
export async function postPoll(req, res) {
    const { title, expireAt } = req.body


    try {
        if (expireAt === "") {
            const date = moment().add(1, 'months').format("DD-MM-YYYY HH:mm") 
           const enquet = await db.collection('enquets').insertOne({ title, expireAt: date})
           return res.status(201).send({enquet, date })
        }else {
            const enquet = await db.collection('enquets').insertOne({ title, expireAt})
            return res.status(201).send(enquet)
        }
        


    } catch (err) {
        res.status(500).send(err.message)
    }
}


//-------- rota get ---------
export async function getPoll(req, res) {
    try{
       const enquets = await db.collection('enquets').find().toArray()
        res.status(201).send(enquets)
    } catch (err) {
        res.status(500).send(err.message)
    }
}