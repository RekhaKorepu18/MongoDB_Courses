import mongoose from "mongoose"
import connection from "./connection";
const express = require('express');
const router = express.Router();
import Courses from "./courses"
router.get('/prerequisitesForCourse', async(req:any, res:any)=>{
       const level: string= req.query.level;
       const name : string = req.query.name;
       try {
       const course: any = await Courses.findOne({Level : level, name: name});
       const preId = course.prerequisite;
       for(const id in preId){
          const pre_course = await Courses.findOne({_id : id});
          res.json(pre_course);
       }
    }catch(error){
        console.log("error while finding tprerequisites");
    }
    
});
//Get courses By ID.
router.get('/CourseById:id', async(req :any, res: any){
    const courseId = req.params.id;
    const course: any = await Courses.findOne({_id : courseId});
    res.josn(course);
});
// Get all courses BY ID.
router.get('/AllCourses', async(req: any, res: any){
    const courses: any = await Courses.find();
    res.json(courses);
});

