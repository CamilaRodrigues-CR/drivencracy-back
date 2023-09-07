import { Router } from "express";
import { getPoll, postPoll } from "../controllers/controllersPolls.js";
import { validatePostPoll } from "../schemas/validatePollsSchemas.js";

const routerPolls = Router()

routerPolls.post('/poll',validatePostPoll , postPoll)
routerPolls.get('/poll' , getPoll)

export default routerPolls