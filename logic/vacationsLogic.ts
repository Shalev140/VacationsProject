import { ResultSetHeader, RowDataPacket } from "mysql2";
import { AddVacationResponse, editVacationResponse, VacationModel } from "../models/VacationModel";
import { execute } from "../utils/dal";
import { unlinkSync, existsSync } from 'fs';
import path from "path";



export async function getAllVacations(id: number, limit: number, offset: number): Promise<VacationModel[]> {
    try {
        const query = `SELECT *,
        (select likes.userId from likes  where likes.userId = ${id} and likes.vacationId = vacations.id) as 'userLikes',
        (select count(*) from likes where likes.vacationId = vacations.id) as 'totalLikes'
        FROM vacations order by startDate limit ${limit} offset ${offset};`

        const [rows] = await execute<VacationModel[]>(query);
        return rows
    } catch (error) {
        throw error
    }

}



export async function userAddLike(userId: number, vacationId: number) {
    try{
        const query = `INSERT INTO vacations_project.likes (userId, vacationId)
        VALUES (${userId}, ${vacationId});`
        
        const [rows] = await execute<any>(query)
        return rows;
    }catch(error){
        throw error
    }
}

export async function userRemoveLike(userId: number, vacationId: number) {
    try{
        const query = `DELETE FROM vacations_project.likes
        WHERE userId = ${userId} AND vacationId = ${vacationId};`
        
        const [rows] = await execute<any>(query)
        return rows;
    }catch(error){
        throw error
    }
}

export async function getAllVacationsThatUserLike(limit: number, offset: number, id: number): Promise<VacationModel[]> {
    try{
        const query = `SELECT *,
        (SELECT likes.userId FROM likes WHERE likes.userId = ${id} AND likes.vacationId = vacations.id ) AS 'userLikes',
        (SELECT COUNT(*) FROM likes WHERE likes.vacationId = vacations.id) AS 'totalLikes'
        FROM vacations
        WHERE (SELECT likes.userId FROM likes WHERE likes.userId = ${id}  AND likes.vacationId = vacations.id ) = ${id} 
        ORDER BY startDate
        LIMIT ${limit}  OFFSET ${offset} ;`
        
        const [rows] = await execute<VacationModel[]>(query);
        return rows
    }catch(error){
        throw error
    }

}


export async function getAllActiveVacations(limit: number, offset: number, id: number): Promise<VacationModel[]> {
    try{
        const query = `SELECT *,
        (SELECT likes.userId FROM likes WHERE likes.userId = ${id} AND likes.vacationId = vacations.id) AS 'userLikes',
        (SELECT COUNT(*) FROM likes WHERE likes.vacationId = vacations.id) AS 'totalLikes'
        FROM vacations
        WHERE startDate < CURDATE() AND endDate > CURDATE()
        ORDER BY startDate
        LIMIT ${limit} OFFSET ${offset};`
        
        const [rows] = await execute<VacationModel[]>(query);
        return rows
    }catch(error){
        throw error
    }

}

export async function getAllFutureVacations(limit: number, offset: number, id: number): Promise<VacationModel[]> {
    try{
        const query = `SELECT *,
        (SELECT likes.userId FROM likes WHERE likes.userId = ${id} AND likes.vacationId = vacations.id) AS 'userLikes',
        (SELECT COUNT(*) FROM likes WHERE likes.vacationId = vacations.id) AS 'totalLikes'
        FROM vacations
        WHERE startDate > CURDATE()
        ORDER BY startDate
        LIMIT ${limit} OFFSET ${offset};`
        
        const [rows] = await execute<VacationModel[]>(query);
        return rows
    }catch(error){
        throw error
    }

}




export async function addNewVacation({ destination, description, startDate, endDate, price, photoName }: VacationModel): Promise<{ message: string; newId: number }> {
    const query = `INSERT INTO vacations (destination, description, startDate, endDate, price, photoName) VALUES (?, ?, ?, ?, ?, ?)`;
    const [rows] = await execute<ResultSetHeader>(query, [destination, description, startDate, endDate, price, photoName]);
    if (rows.affectedRows === 1) {
        return { message: "Success ", newId: rows.insertId }
    } else {
        throw "Not success"
    }


}

export async function deleteVacation(id: number) {
    const query = `DELETE FROM vacations WHERE id = ${id}`;
    const [rows] = await execute(query);
    const photoPath = path.resolve(__dirname, "..", "assets", `${id}.png`);
    if (existsSync(photoPath)) {
        unlinkSync(photoPath);
    }
    return rows;
}



export async function editVacation({ id, destination, description, startDate, endDate, price, photoName }: VacationModel): Promise<VacationModel | RowDataPacket | editVacationResponse> {
    try {

        const query = `UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, photoName = ? WHERE id = ?`;
        const [rows] = await execute<VacationModel | any>(query, [destination, description, startDate, endDate, price, photoName, id]);
        // console.log(rows.affectedRows);

        if (rows.affectedRows === 1) {
            return { message: "Success " }
        } else {
            throw "Not success"
        }
    }
    catch (error) {
        console.log(error);

    }
}
