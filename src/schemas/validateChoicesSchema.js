import Joi from "joi";


export const postChoiceSchema = Joi.object({
    title: Joi.string().required(),
    pollId:Joi.allow(),
});


export function validateChoicePoll(req, res, next) {
    const validation = postChoiceSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(det => det.message)
        return res.status(422).send(errors)
    }

    next();

}
