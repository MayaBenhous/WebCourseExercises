exports.prefersController = {
  // GET localhost:8081/posts
  // async getPosts() {
  //   const { dbConnection } = require("../db_connection");
  //   const connection = await dbConnection.createConnection();
  //   const [rows] = await connection.execute(`SELECT * from tbl_40_preferences`);
  //   connection.end();
  //   return rows;
  // },

  async postNewPrefer(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();
    let destOK = false;
    let typeOk = false;
    try {
      const { accessCode, start_date, end_date, destination, type_vacation } = req.body;
      while (!destOK && !typeOk) {
        destOK = checkDestExist(destination, vacationData);
        typeOk = checkTypeExist(type_vacation, vacationData);
      }
      await connection.execute(
        `INSERT INTO tbl_40_preferences (access_code, start_date, end_date, destination, type_vacation) VALUES  ("${accessCode}", "${start_date}", "${end_date}", "${destination}", "${type_vacation}")`
      );
      res.status(201).json({ accessCode: accessCode });
    } catch (error) {
      res.status(500).json({ Error: "user already exist" });
    }

    connection.end();
  },

  async putUpdatePrefer(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();

    // const [rows] = await connection.execute(`SELECT * from tbl_40_preferences`);
    connection.end();
    // return rows;
  },

  async getViewAllPrefers(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();
    // const [rows] = await connection.execute(`SELECT * from tbl_40_preferences`);
    connection.end();
    // return rows;
  },
};

function checkDestExist(destination, vacationData) {
  for (let v in vacationData.destinations) {
    const vacation_dest = vacationData.destinations[v];
    if (vacation_dest.dest_name == destination) return true;
  }
  return false;
}

function checkTypeExist(type, vacationData) {
  for (let t in vacationData.types) {
    const vacation_type = vacationData.types[t];
    if (vacation_type.type_name == destination) return true;
  }
  return false;
}
