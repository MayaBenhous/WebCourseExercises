const { dbConnection } = require("../db_connection");
const vacationData = require("../data/records.json");

exports.prefersController = {
  async postNewPrefer(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    try {
      const access_code_user = body.access_code;
      const access_code_tblUsers = await getUserById(req.params.idUser,connection);
      let sameAccessCode = (access_code_user === access_code_tblUsers.access_code);

      console.log(sameAccessCode);
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }

      let destExist = checkDestExist(body.destination, vacationData);
      console.log(destExist);
      if (!destExist) {
        res.status(400).json({ error: "Connection failed! Destination not from list." });
      }

      let typeExist = checkTypeExist(body.type_vacation, vacationData);
      console.log(typeExist);
      if (!typeExist) {
        res.status(400).json({ error: "Connection failed! Type not from list." });
      }

      if (sameAccessCode && destExist && typeExist) {
        console.log("good!");
        await connection.execute(
          `INSERT INTO tbl_40_preferences (access_code, start_date, end_date, destination, type_vacation) VALUES 
          ("${body.access_code}", "${body.start_date}", "${body.end_date}", "${body.destination}", "${body.type_vacation}")`
        );
          res
            .status(201)
            .json({ success: `connection success!` });
        // }
      } else {
        res.status(400).json({ error: "Connection failed! User/ dest/ type not right." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
    connection.end();
  },

  // async putUpdatePrefer(req, res) {
  //   const connection = await dbConnection.createConnection();

  //   connection.end();
  // },

  // async getViewAllPrefers(req, res) {
  //   const connection = await dbConnection.createConnection();

  //   connection.end();
  // },
};

async function getUserById(userId, connection) {
  const [rows] = await connection.execute(
    `SELECT access_code from tbl_40_users WHERE id=${userId}`
  );
  return rows[0];
}

async function checkDestExist(destination, vacationData) {
  const lengthDestinations = vacationData.destinations.length;
  for (let v = 0; v < lengthDestinations; v++) {
    const vacation_dest = vacationData.destinations[v];
    if (vacation_dest.dest_name == destination) {
      return true;
    }
  }
  return false;
}

async function checkTypeExist(type, vacationData) {
  const lengthTypes = vacationData.types.length;
  for (let v = 0; v < lengthTypes; v++) {
    const vacation_type = vacationData.types[v];
    if (vacation_type.type_name == type) return true;
  }
  return false;
}

// const { accessCode, start_date, end_date, destination, type_vacation } = req.body;
// while (destOK == false && typeOk == false) {
//   if (destOK == false) {
//     // destOK = checkDestExist(destination, vacationData);
//     res.status(500).json({ Error: "dest don't exist" });
//   }
//   if (typeOk == false) {
//     // typeOk = checkTypeExist(type_vacation, vacationData);
//     res.status(500).json({ Error: "type don't exist" });
//   }
// }
