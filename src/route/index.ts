import * as Express from 'express';
import login from "./login";

const router = Express.Router()

router.get("/health", (req, res) => {
  res.send("live!")
})

const endPoints = [login, { path: "/", router }];

function applyRouter(app: Express.Application) {
  return endPoints.reduce((app, endPoint) => app.use(endPoint.path, endPoint.router), app)
}

export default applyRouter;
