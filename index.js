const express = require("express");
const app = express();
const mongoose = require("mongoose");

//importing from other files
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

//DB url
const DB = "mongodb+srv://kishor:kishor@cluster0.x1a1d2e.mongodb.net/?retryWrites=true&w=majority";


//middleware
app.use(express.json());
app.use(authRouter);
app.use(userRouter);


mongoose
  .connect(DB)
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => {
    console.log(err);
  });


// mongoose.set("strictQuery", false);
// mongoose.connect(DB).then(()=>{
//     console.log("Connection established");
// }).catch((e)=>{
//     console.log(e);
// })

app.use(express.json());

const PORT= 5000;


app.listen(PORT, () =>
  console.log(`Connection Established at Port = ${PORT}!`)
);



