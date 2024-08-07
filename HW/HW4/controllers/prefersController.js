const { dbConnection } = require("../db_connection");
const vacationData = require("../data/records.json");

exports.prefersController = {
  async postNewPrefer(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    try {
      const access_code_user = body.access_code;
      const access_code_tblUsers = await getUserById(req.params.idUser,connection);
      let sameAccessCode = access_code_user === access_code_tblUsers.access_code;
      let validDates = await checkDatesValid(body.start_date, body.end_date);
      let destExist = await checkDestExist(body.destination, vacationData);
      let typeExist = await checkTypeExist(body.type_vacation, vacationData);
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
      else if (!validDates) {
        res.status(400).json({ error: "Update failed! Dates not valid." });
      }
      else if (!destExist) {
        res
          .status(400)
          .json({ error: "Connection failed! Destination not from list." });
      }
      else if (!typeExist) {
        res
          .status(400)
          .json({ error: "Connection failed! Type not from list." });
      }
      else {
        await connection.execute(
          `INSERT INTO tbl_40_preferences (access_code, start_date, end_date, destination, type_vacation, curr_time) VALUES 
          ("${body.access_code}", "${body.start_date}", "${body.end_date}", "${body.destination}", "${body.type_vacation}", now())`
        );
        res.status(201).json({ success: `New preference is In! - connection success!` });
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
      let sameAccessCode =
        access_code_user === access_code_tblUsers.access_code;
      if (!sameAccessCode) {
        res.status(400).json({error: "Connection failed! access_code is not match to this user.",});
      }
      let update_changes = [
        body.access_code,
        body.start_date,
        body.end_date,
        body.destination,
        body.type_vacation,
      ];
      const vocation_fields = [];
      let isField = await getVocationFields(body.access_code, connection, vocation_fields);
      console.log(sameAccessCode);
      if (sameAccessCode) {
        for (let i = 0; i < update_changes.length; i++) {
          console.log(vocation_fields[i]);
          if (!update_changes[i]) {
              update_changes[i] = vocation_fields[i];
            }
            console.log("here");
            console.log(update_changes[i]);
        }
        let validDates = await checkDatesValid(update_changes[1], update_changes[2]);
        let destExist = await checkDestExist(update_changes[3], vacationData);
        let typeExist = await checkTypeExist(update_changes[4], vacationData);
        if (validDates === false) {
          console.log("date not valid :(");
          res.status(400).json({ error: "Update failed! Dates not valid." });
        }
        else if (!destExist) {
          res.status(400).json({ error: "Update failed! Destination not from list." });
        }
        else if (!typeExist) {
          res.status(400).json({ error: "Update failed! Type not from list." });
        }
        else {
          await connection.execute(
            `UPDATE tbl_40_preferences SET start_date="${update_changes[1]}", end_date="${update_changes[2]}", destination="${update_changes[3]}",
              type_vacation="${update_changes[4]}", curr_time=now() WHERE access_code="${update_changes[0]}"`
          );
          console.log("good job!");
          res.status(201).json({ success: `Update preference is in! - connection success!` });
        }
      } else {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    connection.end();
  },

  async getViewAllPrefers(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    try {
      const [rows] = await connection.execute(`SELECT * FROM tbl_40_preferences`);
      if (rows != null) {
        res.status(201).json({success: `Connection success! - View all preferences:`,rows,});
      } else {
        res.status(400).json({ error: "Table is null." });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    connection.end();
  },

  async getSelectedVocation(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    const access_code_user = body.access_code;
    const access_code_tblUsers = await getUserById(
      req.params.idUser,
      connection
    );
    let sameAccessCode = access_code_user === access_code_tblUsers.access_code;
    if (!sameAccessCode) {
      res.status(400).json({error: "Connection failed! access_code is not match to this user."});
    }
    try {
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as perferCount FROM tbl_40_preferences`
      );
      console.log(countResult[0].perferCount);
      perfersCount = countResult[0].perferCount;
      if (perfersCount == "5") {
        console.log("ya!");
        const [destination] = await connection.execute(`SELECT destination
        FROM (SELECT destination, COUNT(*) AS cnt, MIN(curr_time) AS min_curr_time 
        FROM tbl_40_preferences
        GROUP BY destination
        ORDER BY cnt DESC, min_curr_time ASC
        LIMIT 1) AS destSel`);
        destSelected = destination[0].destination;

        const [type_vacation] = await connection.execute(`SELECT type_vacation
        FROM (SELECT type_vacation, COUNT(*) AS cnt, MIN(curr_time) AS min_curr_time
        FROM tbl_40_preferences
        GROUP BY type_vacation
        ORDER BY cnt DESC, min_curr_time ASC
        LIMIT 1) AS typeSel`);
        typeSelected = type_vacation[0].type_vacation;

        const [dates] =
          await connection.execute(`SELECT MAX(start_date) AS start_date, MIN(end_date) AS end_date
          FROM tbl_40_preferences
          WHERE
          type_vacation = "${typeSelected}"
          AND destination = "${destSelected}"
          AND start_date <= (SELECT MIN(end_date) FROM tbl_40_preferences WHERE type_vacation = "${typeSelected}" AND destination = "${destSelected}")
          AND end_date >= (SELECT MAX(start_date) FROM tbl_40_preferences WHERE type_vacation = "${typeSelected}" AND destination = "${destSelected}")`);

        startDateSelected = dates[0].start_date;
        endDateSelected = dates[0].end_date;

        let selectedVocation = {
          start_date: null,
          end_date: null,
          destination: null,
          type_vacation: null,
        };

        selectedVocation.start_date = startDateSelected;
        selectedVocation.end_date = endDateSelected;
        selectedVocation.destination = destSelected;
        selectedVocation.type_vacation = typeSelected;

        res.status(201).json({success: `Connection success! - View selected vocation:`,selectedVocation,});
      }
      res.status(400).json({ error: "In table have under from 5" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    connection.end();
  },
}

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

async function checkDatesValid(start_date, end_date) {
  let startDateStr = start_date;
  let endDateStr = end_date;
  function parseDate(dateStr) {
    let parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]); // Note: monthIndex is zero-based
  }
  let startDate = parseDate(startDateStr);
  let endDate = parseDate(endDateStr);
  console.log(startDate); // Output: Sat Jun 29 2024 00:00:00 GMT+0000 (Coordinated Universal Time)
  console.log(endDate); // Output: Sun Jun 30 2024 00:00:00 GMT+0000 (Coordinated Universal Time)
  let startBeforeEnd = (startDate <= endDate);
  console.log("Start date is before or the same as end date:", startBeforeEnd); // Output: true
  let differenceInDays = Math.ceil(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
  );
  console.log("Difference in days:", differenceInDays); // Output: 1
  if (startBeforeEnd === true) {
    if (differenceInDays > 0 && differenceInDays <= 7) return true;
    return false;
  }
  return false;
}

async function getVocationFields(access_code, connection, vocation_fields) {
  const [rows] = await connection.execute(
    `SELECT * FROM tbl_40_preferences WHERE access_code="${access_code}"`);
  vocation_fields.push(rows[0].access_code);
  vocation_fields.push(rows[0].start_date);
  vocation_fields.push(rows[0].end_date);
  vocation_fields.push(rows[0].destination);
  vocation_fields.push(rows[0].type_vacation);
  return (vocation_fields != null);
}

// async function getStartDate(access_code, connection) {
//   const [rows] = await connection.execute(
//     `SELECT start_date FROM tbl_40_preferences WHERE access_code="${access_code}"`
//   );
//   return rows[0].start_date;
// }


// async function getEndDate(access_code, connection) {
//   const [rows] = await connection.execute(
//     `SELECT end_date FROM tbl_40_preferences WHERE access_code="${access_code}"`
//   );
//   return rows[0].end_date;
// }
