import { authGuard } from "@/guards/auth.guard";
import { ApiRouter } from "@/lib/ApiRouter";
import { reply } from "@/lib/app-reply";
import { ApplicationError, NotFound } from "@/lib/errors";
import Course from "@/models/course";
import Enrollment from "@/models/enrollment";
import Joi from "joi";

export const router = new ApiRouter({
    pathPrefix: "/enrollment",
    defaultTags: ["Enrollment"]
});



router.add(
    {
        path: "/:id",
        method: "POST",
        summary: "Enrollment create",
        middlewares: [authGuard(["student"])],

    },
    async (req, res) => {
        const enrollment = await new Enrollment({ studentId: req.user.id, courseId: req.params.id })
        await enrollment.save()

        return reply(res, enrollment);
    }
);

router.add(
    {
        path: "/get-my-enrollments",
        method: "GET",
        summary: "Enrollment get for student",
        middlewares: [authGuard(["student"])],

    },
    async (req, res) => {
        const enrollment = await Enrollment.find({ studentId: req.user.id }).populate("courseId")
        return reply(res, enrollment);
    }
);


router.add(
    {
        path: "/update-progress/:id",
        method: "PATCH",
        summary: "Enrollment progress update for students",
        middlewares: [authGuard(["student"])],
        schema: {
            body: Joi.object({
                progress: Joi.number().required()
            })
        }

    },
    async (req, res) => {
        const courseId = req.params.id
        const progress = req.body.progress
        const course = await Course.findById(courseId)
        if (!course) throw new NotFound();
        if (course.videos?.length < progress)
            throw new ApplicationError("Progress can not be greater than no of videos", 400);
        const calculatedProgress = (progress / course.videos?.length) * 100;
        const enrollment = await Enrollment.findOneAndUpdate({ studentId: req.user.id, courseId: courseId }, { progress: calculatedProgress }, { new: true }).populate("courseId")
        return reply(res, enrollment);
    }
);