import { pool } from "./pool";

export default function update_request(sql: string, values: Array<Array<Array<string>>> | Array<string>){

    return new Promise<number>((resolve, reject) => {

        pool.getConnection((conn_err: any, conn: any) => {
            if(conn_err){
                console.log("update_request; 🚀 ~ pool.getConnection ~ conn_err:", conn_err.message)
            }else{
                conn.query(sql, values, (err: any, result: any, fiels: any) => {
                    conn.release();
                    if(err){
                        console.log("update_request; 🚀 ~ conn.query ~ err:", err.message)
                    }else{ 
                        resolve(result.affected_rows)
                    }
                })
            }
        })
    })

}