import mongoose, { Schema, Document, Model } from 'mongoose';
import { Types } from 'mongoose';

// Define the Video subdocument
interface IVideo {
    title: string;
    desc: string;
    videoUrl: string;
}

export interface ICourse extends Document {
    title: string;
    desc: string;
    thumbnail: string;
    videos: IVideo[];
    category: string;
    teacherId: Types.ObjectId;
}

const videoSchema: Schema<IVideo> = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        desc: { type: String },

    },
    { _id: false }
);

const courseSchema: Schema<ICourse> = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        desc: { type: String, required: true },
        thumbnail: { type: String, required: true },
        videos: [videoSchema],
        category: { type: String, required: true },
        teacherId: {
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


courseSchema.virtual("teacher", {
    ref: "User",
    localField: "teacherId",
    foreignField: "_id",
    justOne: true
});

courseSchema.virtual("enrollment", {
    ref: "Enrollment",
    localField: "_id",
    foreignField: "courseId",
});



const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
