import * as mysql from "mysql"

export const pool = mysql.createPool({
    host: 'viaduct.proxy.rlwy.net',
    user: 'root',
    password: '5c5hbH22f3dddAF-D23D6-545CGbGdf2',
    database: 'railway',   
    port: 43545,
    connectionLimit: 10,
    multipleStatements: false
  })

  
// export const pool = mysql.createPool({ //local
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'eshop_2022',   
//   connectionLimit: 10,
//   multipleStatements: false
// }) 