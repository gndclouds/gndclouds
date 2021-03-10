// const MongoClient = require("mongodb").MongoClient;
// const url = process.env.MONGO_URL;
//
// module.exports = async function () {
//   let films = await getFilms();
//
//   return films;
// };
//
// async function getFilms() {
//   const client = new MongoClient(url, { useUnifiedTopology: true });
//   await client.connect();
//   console.log("connecting to mongodb...");
//   const db = client.db("tinyprofiles");
//   const films = db.collection("users");
//   const filmArray = await films.find({}).toArray(); // this is what the qurry is looking form
//   await client.close();
//   console.log("connection closed");
//
//   return filmArray;
//   console.log(filmArray);
// }
//
// // MongoClient.connect(url, function (err, db) {
// //   if (err) throw err;
// //   var dbo = db.db("tinyprofiles");
// //   const filmArray = dbo
// //     .collection("users")
// //     .find({ username: "gndclouds" })
// //     .toArray(function (err, result) {
// //       if (err) throw err;
// //       console.log(result);
// //       db.close();
// //     });
// //   return filmArray;
// // });
