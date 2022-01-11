const express = require("express");
let mysql = require("mysql");
let app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});

var port = process.env.PORT || 2410;

let conntData = {
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs_test",
};
let connection = mysql.createConnection(conntData);

let { employeeArr } = require("../httpm2/empMod");
let arr = employeeArr.map((emp1) => [
  emp1.empCode,
  emp1.name,
  emp1.department,
  emp1.designation,
  emp1.salary,
  emp1.gender,
]);

app.get(`/employee`, (req, res) => {
  console.log(`employe`, req.query);
  let { depart, desig, gender } = req.query;
  let sql2 = "SELECT * FROM Emplyees";
  connection.query(sql2, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(result);
      let Arr = result;
      if (depart) {
        Arr = Arr.filter((ele1) => ele1.department === depart);
      }
      if (desig) {
        Arr = Arr.filter((ele1) => ele1.designation === desig);
      }
      if (gender) {
        Arr = Arr.filter((ele1) => ele1.gender === gender);
      }
      res.send(Arr);
    }
  });
});

app.get("/employee/:id", function (req, res) {
  console.log(req.params);
  let id = +req.params.id;
  let sql2 = "SELECT * FROM Emplyees WHERE empCode=?";
  connection.query(sql2, id, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(result);
      let Arr = result;
      res.send(Arr);
    }
  });
});

app.post("/employee", function (req, res) {
  let body = req.body;
  console.log(body);
  let valArr = [
    body.empCode,
    body.name,
    body.department,
    body.designation,
    body.salary,
    body.gender,
  ];
  let sql =
    "INSERT INTO Emplyees (empCode,name,department,designation,salary,gender) VALUES (?,?,?,?,?,?)";
  connection.query(sql, valArr, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(
        "Successfully inserted Affected rows : ",
        result.affectedRows
      );
      let sql2 = "SELECT * FROM Emplyees WHERE empCode=?";
      connection.query(sql2, result.insertId, function (err, result) {
        if (err) console.log(err);
        else res.send(result);
      });
    }
  });
});

app.put("/employee/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  console.log(body);
  let valArr = [
    body.name,
    body.department,
    body.designation,
    body.salary,
    body.gender,
    id,
  ];
  let sql =
    "UPDATE  Emplyees SET name=?,department=?,designation=?,salary=?,gender=? WHERE empCode=?";
  connection.query(sql, valArr, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(
        "Successfully Updated Affected rows : ",
        result.affectedRows,
        result
      );
      let sql2 = "SELECT * FROM Emplyees WHERE empCode=?";
      connection.query(sql2, id, function (err, result) {
        if (err) console.log(err);
        else res.send(result);
      });
    }
  });
});

app.delete("/employee/:id", function (req, res) {
  let id = +req.params.id;
  console.log(id);
  let sql2 = "SELECT * FROM Emplyees WHERE empCode=?";
  connection.query(sql2, id, function (err, result) {
    if (err) console.log(err);
    else {
      res.send(result);

      let sql = "DELETE FROM Emplyees WHERE empCode=?";
      connection.query(sql, id, function (err, result) {
        if (err) console.log(err);
        else {
          console.log(
            "Successfully Deleted Affected rows : ",
            result.affectedRows,
            result
          );
        }
      });
    }
  });
});

app.get("/svr/resetData", (req, res) => {
  let sql = "DELETE FROM Emplyees ";
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(
        "Successfully Deleted Affected rows : ",
        result.affectedRows,
        result
      );
      let sql1 =
        "INSERT INTO Emplyees (empCode,name,department,designation,salary,gender) VALUES ?";
      connection.query(sql1, [arr], function (err, result) {
        if (err) console.log(err);
        else {
          console.log(
            "Successfully inserted Affected rows : ",
            result.affectedRows
          );
          let sql2 = "SELECT * FROM Emplyees";
          connection.query(sql2, function (err, result) {
            if (err) console.log(err);
            else res.send(result);
          });
        }
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on ${port}`));
