
import mysql, { RowDataPacket } from "mysql2/promise";



const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sa12345678',
    port: 3306,
    database: 'vacations_project'
});

export function execute<T>(query: string, params?: any[]) {
  return pool.execute<T & RowDataPacket[]>(query, params);
}


