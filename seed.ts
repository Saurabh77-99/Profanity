import fs from "fs"
import csv from 'csv-parser';

interface Row{
    text:string
}

//reading from the dataset
async function parseCSV(filepath:string):Promise<Row[]> {
    return new Promise((resolve,reject)=>{
        const rows:Row[] = []

        // csv to js array
        fs.createReadStream(filepath)
          .pipe(csv({separator:","}))
          .on("data",(row)=>{
            rows.push(row)
          })
          .on("error",(err)=>{
            reject(err);
          })
          .on("end",()=>{
            resolve(rows);
          })
    })
}

//putting into database
const batch = 30 
const seed = async () =>{
    const data = await parseCSV("training_data.csv");

    // console.log(data);   
    for (let i = 0; i < data.length; i++) {
      const chunk = data.slice(i,i+batch);

      const formatted = chunk.map((row,batchIndex)=>({
        data:row.text,
        id:i+batchIndex,
        metadata:{text:row.text}
      }))

      console.log("upsert",formatted);
      
    }
}

seed()