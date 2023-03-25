import { Router } from "express";
import { getReports } from "../logic/reportsLogic";

export const reportsController = Router();

reportsController.get('/', async (req, res)=>{
    try{
        const reportData = await getReports();
        res.json(reportData);
    }catch(error){
        res.status(400).json({ error });
    }
})