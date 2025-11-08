import app from "./src/app.js";
import myEnv from "./src/config/env.js";

const PORT = myEnv.PORT || 3000;

// Avvia il server
app.listen(PORT, () => {
  console.log(`🚀 Server in esecuzione sulla porta ${PORT}`);
  console.log(`📍 Ambiente: ${myEnv.NODE_ENV || "development"}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
