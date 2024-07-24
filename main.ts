import mongoose from "mongoose"
import connection from "./connection";
import * as fs from 'fs'; 
import * as path from 'path';
import Courses from "./courses"
//import Courses.prerequisite from "./Courses"
import { AnyFunction } from "sequelize/types/utils";
//import * as nconf from 'nconf';

const nconf = require('nconf');

interface courses{
    courseLevel : string,
    name : string,
    prerequisite : mongoose.Types.ObjectId[]
}

async function connect(): Promise<void>{
  await connection();
}
nconf.argv().env().file({ file: path.resolve(__dirname, 'config.json') });
function readCSVFile(filePath : string): Promise< any[] >{
    return new Promise((resolve,reject) => {
        fs.readFile(filePath, 'utf-8', (error, fileContent) => {
            if(error){
                reject(error);
                return;
            }
            const parsedData= parseCSVContent(fileContent) ;
            resolve(parsedData);
        });
    });
}
function parseCSVContent(content: string): any[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      return [];
    }
  
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];
  
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      const entry: any = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j];
      }
      data.push(entry);
    }
  
    return data;
}
async function main(): Promise<void> {
    try {
      connect();
      const coursesDataPath = nconf.get('coursesDataPath');
     
  
      if (!coursesDataPath) {
        throw new Error('Paths to CSV files are not defined in the configuration.');
      }
  
      const courseData: courses[] = await readCSVFile(coursesDataPath);
     
    for(const record of courseData){
      // console.log(record);
      // await insertDocuments(record);
    }
       
    }
    catch (error) {
        console.error('Error:', error);
      }
}

async function insertDocuments(record: any){
    try {
      const { Level, name, pre_level, pre_course } =record;
      // console.log(pre_level);
      let course:any = await Courses.findOne({Level:Level,name:name})
   
     
      if (!course) {
        
        course = await Courses.create({ Level:Level,name:name});
        await course.save();
        console.log(`Inserted course: ${name} (${Level})`);
    }

    if (pre_level && pre_course) {

        let preCourse = await Courses.findOne({ name: pre_course, Level: pre_level });
        if (!preCourse) {
            preCourse = await Courses.create({ name: pre_course, Level: pre_level });
            await preCourse.save();
            console.log(` prerequisite course created: ${pre_course} (${pre_level})`);
        } else  {
            course.prerequisite.push(preCourse._id);
            await course.save();
            console.log(`Inserted course: ${name} (${Level}) with prerequisite: ${pre_course} (${pre_level})`);
        } 
    } else {
        console.log(`No prerequisites inserted: ${name} (${Level})`);
    }

        
    }catch(error){
       console.log("Error while inserting the record");
    }
}
main();



    