exports.authentication = async (req, res, next) => {
  // auth header가 없다면 fail
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);

  const [bearer, key] = authorization.split(" ");
  if (bearer !== "Bearer") return res.sendStatus(401);

  // key로 찾을 수 있는 유저가 없다면 auth fail
  const user = await User.findOne({ key });
  if (!user) return res.sendStatus(401);

  req.user = user;
  next();
};
