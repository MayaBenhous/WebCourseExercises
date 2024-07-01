const { dbConnection } = require("../db_connection");
const vacationData = require("../data/records.json");

exports.prefersController = {
  async postNewPrefer(req, res) {
    const connection = await dbConnection.createConnection();
    const { body } = req;
    try {
      const access_code_user = body.access_code;
      const access_code_tblUsers = await getUserById(
        req.params.idUser,
        connection
      );
      let sameAccessCode =
        access_code_user === access_code_tblUsers.access_code;
      if (!sameAccessCode) {
        res.status(400).json({ error: "Connection failed! User not exist." });
      }
      let validDates = await checkDatesValid(body.start_date, body.end_date);
      if (!validDates) {
        res.status(400).json({ error: "Update failed! Dates not valid." });
      }
      let destExist = await checkDestExist(body.destination, vacationData);
      if (!destExist) {
        res
          .status(400)
          .json({ error: "Connection failed! Destination not from list." });
      }
      let typeExist = await checkTypeExist(body.type_vacation, vacationData);
      if (!typeExist) {
        res
          .status(400)
          .json({ error: "Connection failed! Type not from list." });
      }
      if (sameAccessCode && destExist && typeExist) {
        await connection.execute(
          `INSERT INTO tbl_40_preferences (access_code, start_date, end_date, destination, type_vacation, curr_time) VALUES 
          ("${body.access_code}", "${body.start_date}", "${body.end_date}", "${body.destination}", "${body.type_vacation}", now())`
        );
        res
          .status(201)
          .json({ success: `New preference is In! - connection success!` });
      } else {
        res
          .status(400)
          .json({ error: "Connection failed! User/ dest/ type not right." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
    connection.end();
  },
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

