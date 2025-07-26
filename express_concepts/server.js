require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { configureCors } = require("./config/corsConfig");
const { requestLogger, addTimeStamp } = require("./middleware/customMIddleware");
const { globalErrorHandler } = require("./middleware/errorHandler");
const { urlVersioning } = require("./middleware/apiVersioning");
const { createBasicRateLimiter } = require("./middleware/rateLimiting");
const itemRoutes=require("./routes/item-routes")
const app = express();
const PORT = process.env.PORT || 3000;


app.use(requestLogger);
app.use(addTimeStamp);

app.use(configureCors());
app.use(createBasicRateLimiter(100,15*60*1000));//100requests per 15 minutes

app.use(express.json());

app.use(urlVersioning('v1'));
app.use('/api/v1/',itemRoutes)

app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
