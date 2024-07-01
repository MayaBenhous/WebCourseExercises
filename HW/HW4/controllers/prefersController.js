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