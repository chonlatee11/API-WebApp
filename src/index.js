import express from "express";
import ip from "ip";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "./config/mysql.config.js";
import logger from "./util/logger.js";
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const myip = process.env.IP;
const app = express();
const secret = process.env.SECRET;
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/",(res) => { res.send( {message: 'UP'}) })

app.post("/loginADMIN", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      res.json({ err });
      connection.release();
      //   console.log(err);
    } else {
      connection.query(
        "SELECT * FROM Admin WHERE email = ?",
        [req.body.email],
        function (err, rows) {
          if (err) {
            // console.log(err);
            res.json({ err });
            connection.release();
          } else {
            for (let index = 0; index < rows.length; index++) {
              const element = rows[index];
              if (req.body.email == "admin" && req.body.password == "admin") {
                let token = jwt.sign({ email: element.email }, secret, {
                  expiresIn: "1h",
                });
                // console.log(element.Email);
                res.json({
                  status: "AdminLogin",
                  token,
                  email: element.Email,
                  AdminID: 1,
                });
                connection.release();
              } else {
                bcrypt.compare(
                  req.body.password,
                  element.passWord,
                  function (err, result) {
                    if (err) {
                      res.json({ err });
                      connection.release();
                      //   console.log(err);
                    }
                    if (result == true) {
                      //   console.log("password match");
                      let token = jwt.sign({ email: element.Email }, secret, {
                        expiresIn: "1h",
                      });
                      res.json({
                        email: element.Email,
                        status: "AdminLogin",
                        token,
                        AdminID: element.adminID,
                      });
                      connection.release();
                    } else {
                      //   console.log("password not match");
                      // res.status==401;
                      res.json({ data: "notmatch", status: 402 });
                      connection.release();
                    }
                  }
                );
              }
            }
          }

          if (rows.length == 0 || rows == undefined) {
            res.json({ data: "Not found", status: 401 });
            connection.release();
          }
        }
      );
    }
  });
});

app.put("/AddAdmin", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // console.log(hash);
    if (err) {
      res.json({ err });
      //   console.log(err);
    } else {
      database.getConnection(function (err, connection) {
        if (err) {
          res.json({ err });
          connection.release();
          //   console.log(err);
        } else {
          connection.query(
            "INSERT INTO `Admin` (`Email`, `passWord`, `fName`, `lName`) VALUES ( ?, ?, ?, ?);",
            [req.body.email, hash, req.body.fname, req.body.lname],
            function (err) {
              if (err) {
                res.json({ err });
                connection.release();
              } else {
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.delete("/deleteAdmin", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      res.json({ err });
      connection.release();
      //   console.log(err);
    } else {
      connection.query(
        "DELETE FROM `Admin` WHERE `Admin`.`Email` = ?",
        [req.body.email],
        function (err) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log("delete success");
            res.json({ status: "success" });
            connection.release();
          }
        }
      );
    }
  });
});

app.patch("/updateAdmin", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // console.log(hash);
    if (err) {
      //   console.log(err);
      res.json({ err });
    } else {
      database.getConnection(function (err, connection) {
        if (err) {
          //   console.log(err);
          res.json({ err });
          connection.release();
        } else {
          connection.query(
            "UPDATE `Admin` SET `fName` = ?, `lName` = ?, `Email` = ?, `passWord` = ?, `modifydate` = ? WHERE `Admin`.`Email` = ?",
            [
              req.body.fname,
              req.body.lname,
              req.body.emailupdate,
              hash,
              req.body.modifydate,
              req.body.email,
            ],
            function (err) {
              if (err) {
                res.json({ err });
                connection.release();
              } else {
                // console.log("update success");
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.get("/getAdmin", jsonParser, function (req, res) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      res.json({ err });
      connection.release();
      //   console.log(err);
    } else {
      connection.query(
        "SELECT * FROM Admin",
        [req.body.userID],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log(data.length);
            res.json({ data });
            connection.release();
          }
        }
      );
    }
  });
});

app.put("/AddResearch", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // console.log(hash);
    if (err) {
      //   console.log(err);
      res.json({ err });
    } else {
      database.getConnection(function (err, connection) {
        if (err) {
          //   console.log(err);
          res.json({ err });
          connection.release();
        } else {
          connection.query(
            "INSERT INTO `Researcher` (`Email`, `passWord`, `fName`, `lName`, `phoneNumber`) VALUES ( ?, ?, ?, ?, ?);",
            [
              req.body.email,
              hash,
              req.body.fname,
              req.body.lname,
              req.body.phoneNumber,
            ],
            function (err) {
              if (err) {
                res.json({ err });
                connection.release();
              } else {
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.delete("/deleteResearch", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "DELETE FROM `Researcher` WHERE `Researcher`.`Email` = ?",
        [req.body.email],
        function (err) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log("delete success");
            res.json({ status: "success" });
            connection.release();
          }
        }
      );
    }
  });
});

app.patch("/updateResearch", jsonParser, function (req, res, next) {
  console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log(hash);
    if (err) {
      //   console.log(err);
      res.json({ err });
    } else {
      database.getConnection(function (err, connection) {
        if (err) {
          //   console.log(err);
          res.json({ err });
          connection.release();
        } else {
          connection.query(
            "UPDATE `Researcher` SET `fName` = ?, `lName` = ?, `Email` = ?, `passWord` = ?, `Modifydate` = ? WHERE `Researcher`.`Email` = ?",
            [
              req.body.fname,
              req.body.lname,
              req.body.emailupdate,
              hash,
              req.body.modifydate,
              req.body.email,
            ],
            function (err) {
              if (err) {
                res.json({ err });
                connection.release();
              } else {
                console.log("update success");
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.get("/getResearch", jsonParser, function (req, res) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT * FROM Researcher",
        [req.body.userID],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log(data.length);
            res.json({ data });
            // connection.end();
            connection.release();
          }
        }
      );
    }
  });
});

app.put("/HistoryDiseaseModify", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  const imagelink = `http://${myip}:3002/image/` + req.body.ImageNameUpdate;
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "INSERT INTO `HistoryDiseaseModify` (`DiseaseID`, `DiseaseName`, `AdminID`, `AdminEmail`, `ModifyDate`, `InfoUpdate`, `ProtectUpdate`, `NameUpdate`, `ImageNameUpdate`, `NameEngUpdate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          req.body.DiseaseID,
          req.body.DiseaseName,
          req.body.AdminID,
          req.body.AdminEmail,
          req.body.ModifyDate,
          req.body.InfoUpdate,
          req.body.ProtectUpdate,
          req.body.NameUpdate,
          imagelink,
          req.body.NameEngUpdate,
        ],
        function (err) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log("insert success");
            res.json({ status: "success" });
            connection.release();
          }
        }
      );
    }
  });
});

app.get("/getHistoryDiseaseModify", jsonParser, function (req, res, next) {
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT * FROM `HistoryDiseaseModify`;",
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            res.json({ status: "success", data: data });
            connection.release();
          }
        }
      );
    }
  });
});

app.post("/ResearcherLogin", jsonParser, function (req, res, next) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT * FROM Researcher WHERE Email = ?",
        [req.body.Email],
        function (err, rows) {
          if (err) {
            // console.log(err);
            res.json({ err });
            connection.release();
          } else {
            for (let index = 0; index < rows.length; index++) {
              const element = rows[index];
              bcrypt.compare(
                req.body.passWord,
                element.passWord,
                function (err, result) {
                  if (err) {
                    //   console.log(err);
                    res.json({ err });
                    connection.release();
                  }
                  if (result == true) {
                    //   console.log("password match");
                    let token = jwt.sign({ Email: element.Email }, secret, {
                      expiresIn: "1h",
                    });
                    res.json({
                      Email: element.Email,
                      status: "ResearcherLogin",
                      token,
                      ReseachID: element.researcherID,
                    });
                    connection.release();
                  } else {
                    //   console.log("password not match");
                    // res.status==401;
                    res.json({ data: "notmatch", status: 402 });
                    connection.release();
                  }
                }
              );
            }
          }
          if (rows.length == 0 || rows == undefined) {
            res.json({ data: "Not found", status: 401 });
            connection.release();
          }
        }
      );
    }
  });
});

app.get("/DiseaseAllReport", jsonParser, function (req, res) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT DS.* , Disease.colorShow FROM DiseaseReport DS LEFT JOIN Disease ON DS.DiseaseID = Disease.DiseaseID",
        [req.body.userID],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log(data.length);
            for (let i = 0; i < data.length; i++) {
              data[i].ImageUrl =
                `http://${myip}:3002/image/` + data[i].DiseaseImage;
            }
            res.json({ data });
            connection.release();
          }
        }
      );
    }
  });
});

app.post("/getSelectUser", jsonParser, function (req, res) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT * FROM `User` WHERE fName LIKE ? OR lName LIKE ?;",
        [req.body.Name, req.body.Name],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log(data.length);
            if (data.length == 0) {
              res.json({ data: 401, status: 401 });
              connection.release();
            } else {
              res.json({ data });
              connection.release();
            }
          }
        }
      );
    }
  });
});

app.post("/getSelectDesease", jsonParser, function (req, res) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT * FROM `DiseaseReport` WHERE DiseaseName LIKE ?;",
        [req.body.Name, req.body.Name],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log(data.length);
            if (data.length == 0) {
              res.json({ data: 401, status: 401 });
              connection.release();
            } else {
              res.json({ data });
              connection.release();
            }
          }
        }
      );
    }
  });
});

app.post("/getSelectResearch", jsonParser, function (req, res) {
  //   console.log(req.body);
  database.getConnection(function (err, connection) {
    if (err) {
      //   console.log(err);
      res.json({ err });
      connection.release();
    } else {
      connection.query(
        "SELECT * FROM `Researcher` WHERE researcherID = ?;",
        [req.body.researcherID],
        function (err, data) {
          if (err) {
            res.json({ err });
            connection.release();
          } else {
            // console.log(data.length);
            if (data.length == 0) {
              res.json({ data: 401, status: 401 });
              connection.release();
            } else {
              res.json({ data });
              connection.release();
            }
          }
        }
      );
    }
  });
});

app.patch("/updataSelectResearch", jsonParser, function (req, res) {
  //   console.log(req.body);
  const saltRounds = 10;
  const myPlaintextPassword = req.body.passWord;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // console.log(hash);
    if (err) {
      //   console.log(err);
      res.json({ err });
    } else {
      database.getConnection(function (err, connection) {
        if (err) {
          //   console.log(err);
          res.json({ err });
          connection.release();
        } else {
          connection.query(
            "UPDATE `Researcher` SET `Email` = ?, `passWord` = ?, `fName` = ?, `lName` = ?, `Modifydate` = ?, `phoneNumber` = ? WHERE `Researcher`.`researcherID` = ?",
            [
              req.body.Email,
              hash,
              req.body.fName,
              req.body.lName,
              req.body.Modifydate,
              req.body.phoneNumber,
              req.body.researcherID,
            ],
            function (err) {
              if (err) {
                res.json({ err });
                connection.release();
              } else {
                // console.log("update success");
                res.json({ status: "success" });
                connection.release();
              }
            }
          );
        }
      });
    }
  });
});

app.listen(PORT, () =>
  logger.info(`Server running on : ${ip.address()}:${PORT}`)
);
