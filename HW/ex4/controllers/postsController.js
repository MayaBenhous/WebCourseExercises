exports.postsController = {
  // GET localhost:8081/posts
  async getPosts() {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();
    const [rows] = await connection.execute(`SELECT * from tbl_40_posts`);
    connection.end();
    return rows;
  },
};
