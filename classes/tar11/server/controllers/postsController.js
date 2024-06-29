exports.postsController = {
  // GET localhost:8081/posts
  async getPosts(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();

    const [rows] = await connection.execute(`SELECT * from tbl_40_posts`);

    connection.end();
    res.json(rows);
  },

  // GET localhost:8081/posts/2
  async getPost(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();

    const [rows] = await connection.execute(
      `SELECT * from tbl_40_posts WHERE id=${req.params.postId}`
    );

    connection.end();
    res.json(rows[0]);
  },

  // POST localhost:8081/posts
  async addPost(req, res) {
    // console.log(req);
    // const { dbConnection } = require('../db_connection');
    // const connection = await dbConnection.createConnection();

    // const { body } = req;
    // await connection.execute(`INSERT INTO tbl_40_posts (title, description) VALUES ("${body.title}", "${body.description}")`);
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();
    const { body } = req;

    await connection
      .execute(
        `INSERT INTO tbl_40_posts (title, description) VALUES ("${body.title}", "${body.description}")`
      )
      .then((response) => {
        if (response[0].affectedRows === 1) {
          getPostById(response[0].insertId).then((row) => res.json(row));
        } else {
          // ?
        }
      });

    connection.end();
    res.send(true);
  },

  // PUT localhost:8081/posts/5
  async updatePost(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();

    const { body } = req;
    await connection.execute(
      `UPDATE tbl_40_posts SET title = "${body.title}", description = "${body.description}" WHERE id=${req.params.postId}`
    );

    connection.end();
    res.send(true);
  },

  // DELETE localhost:8081/posts/5
  async deletePost(req, res) {
    const { dbConnection } = require("../db_connection");
    const connection = await dbConnection.createConnection();

    await connection.execute(
      `DELETE FROM tbl_40_posts WHERE id=${req.params.postId}`
    );

    connection.end();
    res.send(true);
  },
};

async function getPostById(postId) {
  const { dbConnection } = require("../db_connection");
  const connection = await dbConnection.createConnection();
  const [rows] = await connection.execute(
    `SELECT * from tbl_40_posts WHERE id=${postId}`
  );
  connection.end();
  return rows[0];
}



