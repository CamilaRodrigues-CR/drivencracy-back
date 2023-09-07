
import Joi from "joi";


export const postPollSchema = Joi.object({
    title: Joi.string().required(),
    expireAt: Joi.optional(new RegExp('[0-9]{2}[-][0-9]{2}[-][0-9]{4}[ ][0-9]{2}[:][0-9]{2}'))
});


export function validatePostPoll(req, res, next) {
    const validation = postPollSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(det => det.message)
        return res.status(422).send(errors)
    }

    next();

}
