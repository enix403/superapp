import { ApiRouter } from "@/lib/ApiRouter";

import { router as authRouter } from "./auth/auth.controller";
import { router as healthRouter } from "./health/health.controller";
import { router as planRouter } from "./plan/plan.controller";
import { router as userRouter } from "./user/user.controller";
import { router as uploadsRouter } from "./uploads/uploads.controller";
import { router as courseRouter } from "./course/course.controller";
import { router as enrollmentRouter } from "./enrollment/enrollment.controller";

export function createRootApiRouter() {
  const router = new ApiRouter();

  router.use(healthRouter);
  router.use(authRouter);
  router.use(planRouter);
  router.use(userRouter);
  router.use(courseRouter);
  router.use(enrollmentRouter);
  router.use(uploadsRouter);

  return router;
}
