import { Router } from "express";
import { getChoices, postChoices, postVote } from "../controllers/controllersChoices.js";
import { validateChoicePoll } from "../schemas/validateChoicesSchema.js";


const routerChoices = Router()

routerChoices.post('/choice',validateChoicePoll, postChoices)
routerChoices.get('/poll/:id/choice', getChoices)
routerChoices.post('/choice/:id/vote', postVote)

export default routerChoices