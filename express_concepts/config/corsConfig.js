const cors = require("cors");
const configureCors = () => {
  return cors({
    //origin -> from which origin user can access api
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", //for local
        "https://customdomain.com", //production url
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); //giving permission
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    credentials: true, //enable suppor for cookies
    preflightContinue: false, //cors will handle preflighe
    maxAge: 600, //cache pre flight responses for 10mins(600sec)->avoid sending option requests multiple time
    optionsSuccessStatus:204

});
};

module.exports={configureCors}
