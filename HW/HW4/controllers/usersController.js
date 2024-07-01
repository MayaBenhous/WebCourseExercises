const { dbConnection } = require("../db_connection");
const { v4: uuidv4 } = require('uuid');

exports.usersController = {
  async postNewUser(req, res) {
    const connection = await dbConnection.createConnection();
    try {
        const {user_name, password} = req.body;
        const accessCode = uuidv4();
        await connection.execute(`INSERT INTO tbl_40_users (access_code, user_name, password) VALUES  ("${accessCode}", "${user_name}", "${password}")`);
        res.status(201).json({ accessCode: accessCode });
    }
    catch (error) {
        res.status(500).json({ Error: 'user already exist' });
      }
    connection.end();
  },

};

