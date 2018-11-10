import * as Express from "express";

const router = Express.Router();

router.get("/oauth/google", (_req, res) => {
  return res.send("test");
});

router.post("/oauth/google", (_req, res) => {
  return res.send("poe");
});

export default {
  path: "/login",
  router
};
