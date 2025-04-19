import mongoose, { Schema, Document, Model } from 'mongoose';
import { Types } from 'mongoose';

// Define the Video subdocument
interface IEnrollment {
    progress: number;
    courseId: Types.ObjectId;
    studentId: Types.ObjectId;

}

const enrollmentSchema: Schema<IEnrollment> = new Schema<IEnrollment>(
    {
        progress: { type: Number, default: 0 },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

enrollmentSchema.virtual("course", {
    ref: "Course",
    localField: "courseId",
    foreignField: "_id",
    justOne: true
});
enrollmentSchema.virtual("student", {
    ref: "User",
    localField: "studentId",
    foreignField: "_id",
    justOne: true
});


const Enrollment: Model<IEnrollment> = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);

export default Enrollment;
