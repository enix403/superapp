import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Video subdocument
interface IVideo {
    title: string;
    desc: string;
    url: string;
}

export interface ICourse extends Document {
    title: string;
    desc: string;
    thumbnail: string;
    videos: IVideo[];
    category: string;
}

const videoSchema: Schema<IVideo> = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
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
        category: [String]
    },
    { timestamps: true }
);


courseSchema.virtual("teacherId", {
    ref: "User",
    localField: "_id",
    foreignField: "courses",
    justOne: true
});


const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
