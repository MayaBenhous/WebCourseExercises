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
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
      let validDates = await checkDatesValid(body.start_date, body.end_date);
        if (!validDates) {
          res.status(400).json({ error: "Update failed! Dates not valid." });
        }
      let destExist = await checkDestExist(body.destination, vacationData);
      if (!destExist) {
        res.status(400).json({ error: "Connection failed! Destination not from list." });
      }
      let typeExist = await checkTypeExist(body.type_vacation, vacationData);
      if (!typeExist) {
        res.status(400).json({ error: "Connection failed! Type not from list." });
      }
      if (sameAccessCode && destExist && typeExist) {
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
    try {
      const access_code_user = body.access_code;
      const access_code_tblUsers = await getUserById(req.params.idUser,connection);
      let sameAccessCode = access_code_user === access_code_tblUsers.access_code;
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! access_code is not match to this user." });
      }
      let update_changes = [body.access_code, body.start_date, body.end_date, body.destination, body.type_vacation];
      const vocation_fields = ['access_code', 'start_date', 'end_date', 'destination', 'type_vacation'];
      if (sameAccessCode) {
        for(let i=0 ; i<update_changes.length ; i++) {
          if(!update_changes[i])
            if(i === 1) {
              update_changes[1] = await getStartDate(update_changes[0], connection);
            }
            else if (i === 2) {
              update_changes[2] = await getEndDate(update_changes[0], connection);
            }
            else
            {
              update_changes = vocation_fields[i];
            }
          console.log(update_changes[i]);
        }
        let validDates = await checkDatesValid(update_changes[1], update_changes[2]);
        if (!validDates) {
          res.status(400).json({ error: "Update failed! Dates not valid." });
        }
        let destExist = await checkDestExist(update_changes[3], vacationData);
        if (!destExist) {
          res.status(400).json({ error: "Update failed! Destination not from list." });
        }
        let typeExist = await checkTypeExist(update_changes[4], vacationData);
        if (!typeExist) {
          res.status(400).json({ error: "Update failed! Type not from list." });
        }
        await connection.execute(
            `UPDATE tbl_40_preferences SET start_date="${update_changes[1]}", end_date="${update_changes[2]}", destination="${update_changes[3]}",
            type_vacation="${update_changes[4]}" WHERE access_code="${update_changes[0]}"`);
            console.log("good job!");
          res.status(201).json({success: `Update preference is in! - connection success!`,});
      } else {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error"});
    }
    connection.end();
  },

  async getViewAllPrefers(req, res) {
    const connection = await dbConnection.createConnection();

    connection.end();
  },
};

async function getUserById(userId, connection) {
  const [rows] = await connection.execute(
    `SELECT access_code from tbl_40_users WHERE id=${userId}`
  );
  return rows[0];
}

async function getStartDate(access_code, connection) {
  const [rows] = await connection.execute(
    `SELECT start_date FROM tbl_40_preferences WHERE access_code="${access_code}"`
  );
  return rows[0].start_date;
}

async function getEndDate(access_code, connection) {
    const [rows] = await connection.execute(
      `SELECT end_date FROM tbl_40_preferences WHERE access_code="${access_code}"`);  
  return rows[0].end_date;
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

async function checkDatesValid(start_date, end_date) {
  let startDateStr = start_date;
  let endDateStr = end_date;
  // Function to parse dd/mm/yyyy format into Date object
  function parseDate(dateStr) {
      let parts = dateStr.split("/");
      // new Date(year, monthIndex, day)
      return new Date(parts[2], parts[1] - 1, parts[0]); // Note: monthIndex is zero-based
  }
  // Parse start date and end date
  let startDate = parseDate(startDateStr);
  let endDate = parseDate(endDateStr);
  // Output parsed dates
  console.log(startDate); // Output: Sat Jun 29 2024 00:00:00 GMT+0000 (Coordinated Universal Time)
  console.log(endDate);   // Output: Sun Jun 30 2024 00:00:00 GMT+0000 (Coordinated Universal Time)

  // Compare dates
  let startBeforeEnd = startDate <= endDate;
  console.log("Start date is before or the same as end date:", startBeforeEnd); // Output: true
  
  // Calculate difference in days
  let differenceInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  console.log("Difference in days:", differenceInDays); // Output: 1
  if(startBeforeEnd === true) {
    if(differenceInDays > 0 && differenceInDays <= 7)
      return true;
    return false;
  }
  return false;

}