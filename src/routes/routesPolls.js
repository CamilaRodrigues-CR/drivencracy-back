import { Router } from "express";
import { getPoll, postPoll } from "../controllers/controllersPolls.js";
import { validatePostPoll } from "../schemas/validatePollsSchemas.js";
import { getResults } from "../controllers/controllersChoices.js";

const routerPolls = Router()

routerPolls.post('/poll',validatePostPoll , postPoll)
routerPolls.get('/poll' , getPoll)

routerPolls.get('/poll/:id/result', getResults)
export default routerPolls