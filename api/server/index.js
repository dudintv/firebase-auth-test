import express from "express";
import { getAuth } from "firebase-admin/auth";

const app = express();
const port = 3333;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/auth", (req, res) => {
  getAuth()
    .projectConfigManager()
    .updateProjectConfig({
      multiFactorConfig: {
        providerConfigs: [
          {
            state: "ENABLED",
            totpProviderConfig: {
              adjacentIntervals: 5,
            },
          },
        ],
      },
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
