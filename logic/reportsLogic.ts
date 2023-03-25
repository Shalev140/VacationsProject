import { ReportModel } from "../models/ReportModel";
import { execute } from "../utils/dal";

export async function getReports(): Promise<ReportModel[]>{
    try{
        const query = `SELECT destination,
        (select count(*) from likes where likes.vacationId = vacations.id) as 'totalLikes'
        FROM vacations ;`
        const [rows] = await execute<ReportModel[]>(query);
        return rows;
    }catch(error){
        throw error
    }
}
