import mongoose from "mongoose"
import connection from "./connection";
import Schema from "mongoose";

// const courseSchema = new mongoose.Schema({
//     courseLevel : Number,
//     courseName : String
// })

// const prerequisiteSchema = new mongoose.Schema({
//     courseName : String,
//     prerequisites :  {
//         type : [mongoose.SchemaTypes.ObjectId],
//         ref : 'Courses'

//     }
// })
// const courseLevel = mongoose.model('courseLevel', courseSchema);
// const prerequisite = mongoose.model('Prerequisite', prerequisiteSchema);

// export {courseLevel , prerequisite}

enum courseLevel {
    ssc = "ssc",
    intermediate = "intermediate",
    diploma = "diploma",
    engineering = "engineering",
    degree = "degree",
    medical = "medical"
}

const courseNames = {
    [courseLevel.ssc]: ["Maths", "Science"],
    [courseLevel.intermediate]: ["MPC", "BiPC"],
    [courseLevel.diploma]: ["ECE","EEE","CSE"],
    [courseLevel.engineering]: ["ECE","EEE","CSE"],
    [courseLevel.degree]: ["Bsc", "BCom", "Mpcs"],
    [courseLevel.medical]: ["BPharm",  "MBBS"]
}

const courseSchema = new mongoose.Schema ({
    Level : {
        type : String,
        required : true
    },
    name : {
         type : String,
         required : true,
         immutable : true,
         validator: function(v: string) {
            const course = (this as any).level as courseLevel;
            return courseNames[course] ? courseNames[course].includes(v) : false;
        },
        message: "provide  valid name"
    
    },
    prerequisite : [{
        type : Schema.Types.ObjectId,
        default : [],
        ref : 'Courses'
    }]
})
const Courses = mongoose.model('Courses', courseSchema);
export default Courses;