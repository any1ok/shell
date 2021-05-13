var express = require("express");
var app = express.Router();

const path = require("path");
const request = require("request");
const sync_request = require("sync-request");

const AWS = require("aws-sdk");
AWS.config.loadFromPath(path.resolve(__dirname, "../config/awsconfig.json"));
const { logger } = require(path.resolve(__dirname, "../config/winston.js"));

const shell = require('shelljs')

const s3 = new AWS.S3();

function replaceData(data, replace) {
    return data === undefined || data === '' ? replace : data;
}

let result = {};


const { promises: fs } = require("fs");
const util = require('util')

async function readFile(filePath, encoding = "utf-8") {
    if (!filePath) {
        throw new Error("filePath required");
    }

    return fs.readFile(filePath, { encoding });
}

function isImage(file_name) {
    return file_name.toLowerCase().match(/\.(jpg|jpeg|png)$/);
};

  

app.post("/ANALYZE_HOME_TEST", async function (req, res) {
    //res.json({camera_result : "ddd"});
    //return ;
    //let file_name = "P9.jpg"; // 테스트용도 이거 주석하고 아래 주석 풀어야 됨. 파일명 클라이언트에서 서버(람다)로 보냈을 때 유저키와 timestamp 먹여서 절대 중복 안나게 해야됨.
    console.log("------- 0");
    const file_name = replaceData(req.body.file_name, null);
    
    
 
    //const pass_no = replaceData(req.body.pass_no, 0);
    const user_no = replaceData(req.body.user_no, 0);

    if (user_no == 0) {
        res.status(403).send({ msg, error: new Error("bad parameter") });
        return;
    }

    if (file_name == null) {
        res.status(403).send({ msg, error: new Error("bad parameter") });
        return;
    }

    if (!isImage(file_name)) {
        res.status(403).send({ msg, error: new Error("bad parameter") });
        return;
    }

    console.log("------- 1");
    const extname = path.extname(file_name);
    
    let params = {
        Key: 'public/HOMETEST/' + file_name, //버켓 위치 수정해야 됨.
        Bucket: "standard-pass-file"
    }

    let result_value = "";

    // let transaction;

    try {
        // transaction = await req.sequelize.transaction();
        
        //파일을 s3 에서 받고 로컬에 저장한다.
    
        console.log(params);
        const s3_file = await s3.getObject(params).promise();
 
        await fs.writeFile('../downloads/' + file_name, s3_file.Body);
      
        //이미지 분석 시스템을 실행한다.
        if (shell.exec('/usr/local/bin/SPHT_Warping /home/ec2-user/downloads/' + file_name + ' /home/ec2-user/saveimg/').code !== 0) {
            shell.echo('Error: command failed')
            shell.exit(1)
        }
        
        //이미지 분석 결과 파일을 읽는다.
        let result_file = file_name.replace(extname, ".rst");
        console.log("result_file", result_file);
        let content = await readFile("/home/ec2-user/saveimg/" + result_file);
        //이미지 분석 결과 파일 마지막이 \n이 먹혀 있어서 split 으로 자른다. 혹시 앞자리만 쓸꺼면 content[0].toUpperCase 로 가도 될듯...
        content = content.split('\n');

        console.log(content[0]);
        result_value = content[0];

        //다운받은 파일과 분석 후 생긴 파일을 삭제한다.
        // await fs.unlink('/home/ec2-user/downloads/' + file_name);
        // await fs.unlink('/home/ec2-user/saveimg/' + file_name);
        // await fs.unlink('/home/ec2-user/saveimg/' + result_file);
        
        // 쿼리에 반영한다. (이 쿼리는 샘플로 잘 호출되는지 한거라 상황에 맞게 처리해야 됨.)
        // const query_TestApi = req.mybatisMapper.getStatement(
        //     "SP_HOME_TEST",
        //     "TEST_API.SELECT",
        //     {
        //         pass_no : 1,
        //     },
        //     { language: "sql", indent: "  " }
        // );

        // const data_TestApi = await req.sequelize.query(query_TestApi, {
        //     type: req.sequelize.QueryTypes.SELECT,
        // });

        //결과 값을 반영해준다.
        // result.values = data_TestApi[0];
        result.result_value = result_value;
        
        //결과를 반환한다.
        res.json(result);
    } catch (error) {
        // if (error) await transaction.rollback();
        console.log("PPAP: error", error);
        res.status(403).send({ msg :"false", error: error });
    }

    
});



app.post("/DK_ANALYZE_HOME_TEST", async function (req, res) {
    //res.json({camera_result : "ddd"});
    //return ;
    // let file_name = "N1.jpg"; // 테스트용도 이거 주석하고 아래 주석 풀어야 됨. 파일명 클라이언트에서 서버(람다)로 보냈을 때 유저키와 timestamp 먹여서 절대 중복 안나게 해야됨.
    console.log("------- 0");
    const file_name = replaceData(req.body.file_name, null);
    
    
    var msg = "";
    //const pass_no = replaceData(req.body.pass_no, 0);
    // const user_no = replaceData(req.body.user_no, 0);

    // if (user_no == 0) {
    //     res.status(403).send({ msg, error: new Error("bad parameter") });
    //     return;
    // }

    if (file_name == null) {
        res.status(403).send({ msg, error: new Error("bad parameter") });
        return;
    }

    if (!isImage(file_name)) {
        res.status(403).send({ msg, error: new Error("bad parameter") });
        return;
    }

    console.log("------- 1");
    const extname = path.extname(file_name);
    
    let params = {
        Key: 'public/test/' + file_name, //버켓 위치 수정해야 됨.
        Bucket: "standard-pass-file"
    }

    let result_value = "";

    // let transaction;

    try {
        // transaction = await req.sequelize.transaction();
        
        //파일을 s3 에서 받고 로컬에 저장한다.
        console.log("KKKKKK1");
        console.log("KKKKKK11");
        console.log(params);
        const s3_file = await s3.getObject(params).promise();
        console.log("KKKKKK2");
        await fs.writeFile('../downloads/' + file_name, s3_file.Body);
        console.log("KKKKKK3");
        //이미지 분석 시스템을 실행한다.
        if (shell.exec('/usr/local/bin/SPHT_Warping /home/ec2-user/downloads/' + file_name + ' /home/ec2-user/saveimg/').code !== 0) {
            shell.echo('Error: command failed')
            shell.exit(1)
        }
        
        //이미지 분석 결과 파일을 읽는다.
        let result_file = file_name.replace(extname, ".rst");
        console.log("result_file", result_file);
        let content = await readFile("/home/ec2-user/saveimg/" + result_file);
        //이미지 분석 결과 파일 마지막이 \n이 먹혀 있어서 split 으로 자른다. 혹시 앞자리만 쓸꺼면 content[0].toUpperCase 로 가도 될듯...
        content = content.split('\n');

        console.log(content[0]);
        result_value = content[0];

        //다운받은 파일과 분석 후 생긴 파일을 삭제한다.
        // await fs.unlink('/home/ec2-user/downloads/' + file_name);
        // await fs.unlink('/home/ec2-user/saveimg/' + file_name);
        // await fs.unlink('/home/ec2-user/saveimg/' + result_file);
        
        // 쿼리에 반영한다. (이 쿼리는 샘플로 잘 호출되는지 한거라 상황에 맞게 처리해야 됨.)
        // const query_TestApi = req.mybatisMapper.getStatement(
        //     "SP_HOME_TEST",
        //     "TEST_API.SELECT",
        //     {
        //         pass_no : 1,
        //     },
        //     { language: "sql", indent: "  " }
        // );

        // const data_TestApi = await req.sequelize.query(query_TestApi, {
        //     type: req.sequelize.QueryTypes.SELECT,
        // });

        //결과 값을 반영해준다.
        // result.values = data_TestApi[0];
        result.result_value = result_value;
        
        //결과를 반환한다.
        res.json(result);
    } catch (error) {
        // if (error) await transaction.rollback();
        console.log("PPAP: error", error);
        res.status(403).send({ msg :"false", error: error });
    }

    
});

app.get("/TEST", async function (req, res) {
    result.values = "HELLO";

    
    res.json(result);
});




module.exports = app;
