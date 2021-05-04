// ------------------------------------------------------------------------//
// Description: Demo application source code
// Repository: https://github.com/erickangMSFT
// Author: Eric Kang
// License: MIT
// ------------------------------------------------------------------------//

'use strict';

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const fs = require('fs');
const sqldevops = require('../modules/sqldevops.js');

const dbconfig = require('../config/dbconfig.json');
const tablespaceSqlFile = './src/sql/tablespace.sql';
const nav = require('../config/navconfig.json');
const myhost = require('os');
const app = require('../../app.js');
const { pathToFileURL } = require('url');
const pool = mssql.globalConnectionPool;



/* GET home page. */
router.get('/', (req, res, next) => {
  fs.readFile(tablespaceSqlFile, 'utf8', (err, script) => {
    pool.connect((err) => {
      const request = new mssql.Request(pool);

      request.query('select @@SERVERNAME as MyServerName',(err, result)=>{
        const myServerName = result.recordset[0].MyServerName;
        console.log('GOT SERVERNAME ' + myServerName)
      
        request.query('select @@VERSION as myversion',(err, result)=>{
          const myversion = result.recordset[0].myversion;
          console.log('GOT VERSION ' + myversion)
      
      
      request.query(script, (err, rec) => {
        if (err) {
          const sqlerror = sqldevops.getSqlError(err);
          res.render('error', {
            message: sqlerror.message,
            error: sqlerror
          });
        }
        else {
          // for debugging
          //console.log(rec.recordset);
          res.render('index', {
            title: 'Linux MSSQL Insights',
            nav: nav,
            tablespaces: rec.recordset,
            server: dbconfig.server,
            database: dbconfig.database,
            user: dbconfig.user,
            sakura: myhost.hostname, 
            mazda: myServerName,
            v8: myversion 
          });
        }
      });
    });
  });
});
});
});

module.exports = router;