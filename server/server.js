const { Server } = require("http");
const express = require("express");
const compression = require("compression");
const path = require("path");
const database = require("./db.js");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const ses = require("./ses.js");
const multer = require("./midleware.js");
const s3 = require("./s3.js");

const app = express();
const server = Server(app);
// app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: `I love my MoM`,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: true,
});

app.use(cookieSessionMiddleware);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(compression());

if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

app.get("/api/user/id.json", (req, res) => {
    if (!req.session.id) {
        return res.json({ success: false });
    } else {
        return res.json({ success: true });
    }
});

app.post("/api/register", (req, res) => {
    const { first, last, email, password } = req.body;
    database
        .newUser(first, last, email, password)
        .then((new_user) => {
            const newId = { id: new_user.id };
            req.session = newId;
            return res.json({ success: true });
        })
        .catch((error) => {
            console.log("new user error", error);
            if (error.constraint === "users_email_key") {
                return res.json({ error: "email" });
            } else {
                return res.json({ error: "others" });
            }
        });
});

//API SERVING login.js
app.post("/api/check-login", (req, res) => {
    const { email, password } = req.body;
    database.authLogin(email, password).then((result) => {
        if (result === null) {
            return res.json({ success: false });
        }
        const loginId = { id: result.id };
        req.session = loginId;
        res.json({ success: true });
        return;
    });
});

app.put("/reset-password", (req, res) => {
    const { email, code, password } = req.body;
    database
        .checkResetCode(email, code)
        .then((result) => {
            if (!result) {
                return false;
            } else {
                const resetEmail = { email: result.email };
                req.session = resetEmail;
                return result;
            }
        })
        .then((result) => {
            if (!result) {
                return res.json({ success: false });
            } else {
                return database
                    .changePassword(password, result.user_id)
                    .then((result) => {
                        if (!result) {
                            return res.json({ success: false });
                        } else {
                            const loginId = { id: result.id };
                            req.session = loginId;
                            // res.redirect("/");
                            res.json({ success: true });
                        }
                    });
            }
        });
});

app.post("/reset-password", (req, res) => {
    database
        .resetCode(req.body.email)
        .then((result) => {
            if (result === "user not found") {
                return res.json({ success: "user not found" });
            } else {
                return ses.sendEmail(
                    "julianaspdimitriadis@gmail.com",
                    result.rows[0].code
                );
            }
        })
        .then(() => {
            return res.json({ success: true });
        })
        .catch((error) => {
            console.log("ERROR Post - Reset-password", error);
        });
});

// API SERVING => app.js
app.get("/api/get-user/data", (req, res) => {
    database.getUserById(req.session.id).then((result) => {
        return res.json(result);
    });
});

//API SERVING profilePicModal.js
app.post(
    "/api/upload-profile-pic",
    multer.uploader.single("file"),
    s3.upload,
    (req, res) => {
        if (req.file) {
            database.newImage(req.file.filename, req.body.id).then((result) => {
                if (result) {
                    return res.json(result);
                } else {
                    res.json({ success: false });
                }
            });
        } else {
            res.json({ success: false });
        }
    }
);

//API SERVING profilePicModal.js
app.delete("/api/upload-profile-pic", (req, res) => {
    database.deleteProfilePic(req.session.id).then((result) => {
        if (result) {
            return res.json(result);
        } else {
            res.json({ success: false });
        }
    });
});

//API SERVING profileModal.js
// app.get("/api/get-countries-list", (req, res) => {
//     database.getCountriesList().then((result) => {
//         res.json(result);
//     });
// });

//API SERVING profileModal.js
app.post("/api/update-profile", (req, res) => {
    database.updateProfile(req.body, req.session.id).then((result) => {
        res.json(result);
    });
});

app.get("/api/find-users/:searchval", (req, res) => {
    database.findUsers(req.params.searchval, req.session.id).then((result) => {
        res.json(result);
    });
});

app.get("/api/find-new-users/", (req, res) => {
    database.findNewestUsers(req.session.id).then((result) => {
        res.json(result);
    });
});

//API SERVING otherUsersProfile.js
app.get(`/api/get-other-user/:otherId`, (req, res) => {
    if (req.session.id === +req.params.otherId) {
        res.json({ success: "same id" });
    } else {
        database.getUserById(req.params.otherId).then((result) => {
            if (!result) {
                res.json({ success: false });
            } else {
                res.json(
                    result
                    // {
                    // first_name: result.first_name,
                    // last_name: result.last_name,
                    // picUrl: result.profile_picture_url,
                    // bio: result.bio,
                    // }
                );
            }
            return;
        });
    }
});

app.get("/api/friendshipStatus/:otherId", (req, res) => {
    database
        .checkFriendshipStatus(req.session.id, +req.params.otherId)
        .then((result) => {
            if (!result) {
                res.json({ status: "Make a Friend Request" });
                return;
            }
            if (result.accepted === true) {
                res.json({ status: "Unfriend" });
                return;
            }
            if (result.sender_id === req.session.id) {
                res.json({ status: "Cancel Friend Request" });
                return;
            }
            if (result.recipient_id === req.session.id) {
                res.json({ status: "Accept Friend Request" });
                return;
            }
        });
});

app.post("/api/friendshipStatus", (req, res) => {
    if (req.body.status === "Make a Friend Request") {
        database
            .newFriendRequest(req.session.id, req.body.otherId)
            .then((result) => {
                if (result) {
                    res.json({ status: "Cancel Friend Request" });
                    return;
                } else {
                    res.json({ status: "error" });
                }
            });
        return;
    }
    if (
        req.body.status === "Unfriend" ||
        req.body.status === "Cancel Friend Request"
    ) {
        database
            .deleteFriendRequest(req.session.id, req.body.otherId)
            .then(() => {
                res.json({ status: "Make a Friend Request" });
            });
        return;
    }
    if (req.body.status === "Accept Friend Request") {
        database
            .updateFriendRequest(req.session.id, req.body.otherId)
            .then((result) => {
                if (result) {
                    res.json({ status: "Unfriend" });
                    return;
                } else {
                    res.json({ status: "error" });
                }
            });
        return;
    }
});

app.get("/api/get-friends-and-requests", (req, res) => {
    database.getFriendsAndRequests(req.session.id).then((result) => {
        return res.json(result);
    });
});

app.get("/api/get-quote", (req, res) => {
    database.getQuote().then((result) => {
        return res.json(result);
    });
});

app.get("/api/get-friendsReq", (req, res) => {
    database.getFriendshipRequests(req.session.id).then((result) => {
        return res.json(result);
    });
});

const io = require("socket.io")(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(
                `https://theexpatmom.herokuapp.com/`
            )
        ),
});
let privateChatUsers;

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
    if (!privateChatUsers) {
        if (socket.handshake.auth.theOderUserID) {
            privateChatUsers = [
                socket.request.session.id,
                socket.handshake.auth.theOderUserID,
            ];
            return;
        }
    }
});

io.on("connection", async (socket) => {
    if (socket.handshake.auth.theOderUserID) {
        database
            .getPrivateMessages(
                socket.request.session.id,
                socket.handshake.auth.theOderUserID
            )
            .then((result) => {
                socket.emit("recentPrivateChatMsg", result.reverse());
            });
    }

    if (!socket.handshake.auth.theOderUserID) {
        database.getPublicChatMessages().then((result) => {
            socket.emit("recentPublicChatMsg", result.reverse());
        });
    }

    socket.on("newMsg", (msg) => {
        database
            .createPublicChatMessage(socket.request.session.id, msg)
            .then((result) => {
                io.emit("newSavedMsg", result);
            });
    });

    socket.on("newPrivateMsg", (msg) => {
        database
            .createPrivateChatMessage(
                msg,
                socket.request.session.id,
                socket.handshake.auth.theOderUserID
            )
            .then((result) => {
                io.emit("newSavedPrivateMsg", result);
            });
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
