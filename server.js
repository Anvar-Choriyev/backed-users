require("dotenv").config()
const app = require("./app")
const database = require("./config/database/database")
require("./models/Users")

database.authenticate().then(() => {
    console.log("Database successfully connected");
    database.sync()
}).catch(error => {
    console.log(error);
})

const PORT = process.env.PORT || 9090

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})