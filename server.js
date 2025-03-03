const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors=require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database.db3");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


//get todos
app.get('/todos', async(request, response)=>{
  const getTodos='SELECT * FROM todos'
  const todos=await db.all(getTodos)
  response.send(todos)
})

//delete todos
app.delete('/todos/:id', async (request, response)=>{
  const {id}=request.params;
  const deleteTodos=`DELETE FROM todos WHERE id = ${id};`
  await db.run(deleteTodos)
  response.send("Todo Deleted")
})

//add todos
app.post('/todos', async (request, response)=>{
  const {title}=request.body;
  const addTodo=`INSERT INTO todos (title) VALUES ('${title}');`
  await db.run(addTodo)
  response.send("Todo Added")

})