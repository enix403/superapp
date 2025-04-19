import { authGuard } from "@/guards/auth.guard";
import { ApiRouter } from "@/lib/ApiRouter";
import { reply } from "@/lib/app-reply";
import Course from "@/models/course";
import { User } from "@/models/user";
import Joi from "joi";


export const router = new ApiRouter({
    pathPrefix: "/course",
    defaultTags: ["Course"]
});

const videoSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().optional(),
    url: Joi.string().uri().required(),
});

router.add(
    {
        path: "/",
        method: "POST",
        summary: "Create",
        middlewares: [authGuard(["teacher"])],
        schema: {
            body: Joi.object({
                title: Joi.string().required(),
                desc: Joi.string().required(),
                thumbnail: Joi.string().required(),
                videos: Joi.array().items(videoSchema)
            })
        }
    },
    async (req, res) => {
        const course = await new Course(req.body)
        await course.save()

        return reply(res, course);
    }
);

router.add(
    {
        path: "/",
        method: "GET",
        summary: "GET",
    },
    async (req, res) => {
        const course = await Course.find()

        return reply(res, course);
    }
);


router.add(
    {
        path: "/get-my-courses",
        method: "GET",
        summary: "Get courses created by teacher",
        middlewares: [authGuard(["teacher"])],

    },
    async (req, res) => {
        const course = await Course.find({})

        return reply(res, course);

        return reply(res, course);
    }
);