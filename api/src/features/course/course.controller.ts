import { authGuard } from "@/guards/auth.guard";
import { ApiRouter } from "@/lib/ApiRouter";
import { reply } from "@/lib/app-reply";
import { NotFound } from "@/lib/errors";
import Course from "@/models/course";
import Joi from "joi";


export const router = new ApiRouter({
    pathPrefix: "/course",
    defaultTags: ["Course"]
});

const videoSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().optional(),
    videoUrl: Joi.string().uri().required(),
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
                category: Joi.string().required(),
                videos: Joi.array().items(videoSchema)
            })
        }
    },
    async (req, res) => {
        const course = await new Course({ teacherId: req.user.id, ...req.body })
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
        const query = { ...req.query };
        const filter: Record<string, any> = {};

        // Filtering logic
        if (query.category) filter.category = { $regex: query.category, $options: "i" };
        if (query.title) filter.title = { $regex: query.title, $options: "i" };

        const courses = await Course.find(filter).populate("teacherId")

        return reply(res, courses);
    }
);


router.add(
    {
        path: "/get-my-courses",
        method: "GET",
        summary: "Get courses created by (me)teacher",
        middlewares: [authGuard(["teacher"])],

    },
    async (req, res) => {
        const courses = await Course.find({ teacherId: req.user.id }) // only fetch the 'courses' field from User

        return reply(res, courses);

    }
);


// Get a course
router.add(
    {
        path: "/:id",
        method: "GET",
        summary: "GET course details",

        desc: "GET a course with new details.",

    },
    async (req, res) => {
        // throw new ApplicationError("adwa");

        const course = await Course.findById(req.params.id).populate("teacherId")
        if (!course) throw new NotFound();
        return reply(res, course);
    }
);

// Update a course
router.add(
    {
        path: "/:id",
        method: "PATCH",
        summary: "Update course details",
        middlewares: [authGuard(["teacher"])],

        desc: "Updates a course with new details.",
        schema: {
            body: Joi.object({
                title: Joi.string().required(),
                desc: Joi.string().required(),
                thumbnail: Joi.string().required(),
                category: Joi.string().required(),
                videos: Joi.array().items(videoSchema)
            })

        }
    },
    async (req, res) => {
        // throw new ApplicationError("adwa");
        const updates = req.body;

        const course = await Course.findOneAndUpdate({ _id: req.params.id, teacherId: req.user.id }, updates, {
            new: true
        });
        if (!course) throw new NotFound();
        return reply(res, course);
    }
);

// Delete a course
router.add(
    {
        path: "/:id",
        method: "DELETE",
        summary: "Delete course details",
        middlewares: [authGuard(["teacher"])],

        desc: "Delete a course.",

    },
    async (req, res) => {

        const course = await Course.findOneAndDelete({ _id: req.params.id, teacherId: req.user.id }, {
            new: true
        });
        if (!course) throw new NotFound();
        return reply(res, course);
    }
);
