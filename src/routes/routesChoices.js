import { Router } from "express";
import { getChoices, postChoices } from "../controllers/controllersChoices.js";
import { validateChoicePoll } from "../schemas/validateChoicesSchema.js";


const routerChoices = Router()

routerChoices.post('/choice',validateChoicePoll, postChoices)
routerChoices.get('/poll/:id/choice', getChoices)

export default routerChoices