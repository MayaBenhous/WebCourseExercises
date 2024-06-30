const { dbConnection } = require("../db_connection");
const vacationData = require("../data/records.json");

exports.prefersController = {
  async postNewPrefer(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    try {
      const access_code_user = body.access_code;
      // console.log(access_code_user);
      const access_code_tblUsers = await getUserById(req.params.idUser,connection);
      // console.log(access_code_tblUsers);
      let sameAccessCode = (access_code_user === access_code_tblUsers.access_code);
      // console.log(sameAccessCode);
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
      let destExist = await checkDestExist(body.destination, vacationData);
      // console.log(destExist);
      if (!destExist) {
        res.status(400).json({ error: "Connection failed! Destination not from list." });
      }
      let typeExist = await checkTypeExist(body.type_vacation, vacationData);
      // console.log(typeExist);
      if (!typeExist) {
        res.status(400).json({ error: "Connection failed! Type not from list." });
      }
      if (sameAccessCode && destExist && typeExist) {
        // console.log("good!");
        await connection.execute(
          `INSERT INTO tbl_40_preferences (access_code, start_date, end_date, destination, type_vacation) VALUES 
          ("${body.access_code}", "${body.start_date}", "${body.end_date}", "${body.destination}", "${body.type_vacation}")`
        );
        res.status(201).json({ success: `New preference is In! - connection success!` });
      } else {
        res.status(400).json({ error: "Connection failed! User/ dest/ type not right." });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
    connection.end();
  },

  async putUpdatePrefer(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    let status [];
    try {
      const access_code_user = body.access_code;
      const access_code_tblUsers = await getUserById(req.params.idUser,connection);
      let sameAccessCode = access_code_user === access_code_tblUsers.access_code;
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
      let update_changes = [body.access_code, body.start_date, body.end_date, body.destination, body.type_vacation];
      const vocation_fields = ['access_code', 'start_date', 'end_date', 'destination', 'type_vacation'];
      if (sameAccessCode) {
        for(let i=0 ; i<update_changes.length ; i++) {
          if(!update_changes[i])
            update_changes = vocation_fields[i];
          console.log(update_changes[i]);
        }
        // let startDateNum = update_changes[1];
        // let endDateNum = update_changes[2];
        let destExist = await checkDestExist(update_changes[3], vacationData);
        // console.log(destExist);
        if (!destExist) {
          res.status(400).json({ error: "Connection failed! Destination not from list." });
        }
        let typeExist = await checkTypeExist(update_changes[4], vacationData);
        // console.log(typeExist);
        if (!typeExist) {
          res.status(400).json({ error: "Connection failed! Type not from list." });
        }
        await connection.execute(
              `UPDATE tbl_40_preferences SET start_date="${update_changes[1]}", end_date="${update_changes[2]}", destination="${update_changes[3]}",
              type_vacation="${update_changes[4]}" WHERE access_code="${update_changes[0]}"`);
              console.log("good job!");
            res.status(201).json({success: `Update preference is in! - connection success!`,});
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

      // update_changes[0] = body.access_code;
      // update_changes[1] = body.start_date;
      // update_changes[2] = body.end_date;
      // update_changes[3] = body.destination;
      // update_changes[4] = body.type_vacation;

              // if (body.start_date) {
        //   await connection.execute(
        //     `UPDATE tbl_40_preferences SET start_date="${body.start_date}" WHERE access_code="${body.access_code}"`
        //   );
        //   res.status(201).json({success: `Update start date is In! - connection success!`,});
        //   //check if start date if after end date
        // }
        // if (body.end_date) {
        //   await connection.execute(
        //     `UPDATE tbl_40_preferences SET end_date="${body.end_date}" WHERE access_code="${body.access_code}"`
        //   );
        //   res.status(201).json({success: `Update end date is In! - connection success!`,});
        //   //check if end date if before start date
        // }
        // if (body.destination) {
        //     let destExist = checkDestExist(body.destination, vacationData);
        //     if (!destExist) {
        //       res.status(400).json({ error: "Connection failed! Destination not from list." });
        //     }          
        //     await connection.execute(
        //     `UPDATE tbl_40_preferences SET destination="${body.destination}" WHERE access_code="${body.access_code}"`);
        //   res.status(201).json({success: `Update destination is In! - connection success!`,});
        // }
        // if (body.type_vacation) {
        //   let typeExist = checkTypeExist(body.type_vacation, vacationData);
        //   if (!typeExist) {
        //     res.status(400).json({ error: "Connection failed! Type not from list." });
        //   }
        //   await connection.execute(
        //     `UPDATE tbl_40_preferences SET type_vacation="${body.type_vacation}" WHERE access_code="${body.access_code}"`);
        //   res.status(201).json({success: `Update type vacation is In! - connection success!`,});
        // }