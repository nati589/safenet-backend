const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const accessToken = req.headers["authorization"];
    if (!accessToken) return res.sendStatus(401);

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            const refreshToken = req.cookies.refreshToken;
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, user) => { 
                    if (err) return res.sendStatus(403);
                    const accessToken = jwt.sign(
                        {
                                id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "15m" }
                    );
                    res.json({ accessToken });
                }
            );
        } else {
            req.user = user;
            next();
        }
    });
}

module.exports = { authenticateToken };
