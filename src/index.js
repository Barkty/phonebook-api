import { connectDB } from "./services/database.js"
import server from "./server.js"

let { PORT } = process.env

const serverStart = async () => {
  try {
      // Open MongoDB Connection

      await connectDB()

      // await connectTestDB()

      if (PORT == '' || PORT == null) {
          PORT = 8069
      }

      server.listen(PORT, ()=> {
          console.log(`Server is running on port ${PORT}`)
      })

  } catch (error) {
      console.log(error);
      process.exit(1);
  }
}

serverStart()