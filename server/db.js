const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
    } = require("../secrets.json");
    db = spicedPg(
        `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
    );
    console.log(`[db] Connecting to: ${DATABASE_NAME}`);
}

function hashPassword(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

function changePassword(newpassword, id) {
    return hashPassword(newpassword)
        .then((hashPass) => {
            return db.query(
                `UPDATE users SET hash_password = $1 WHERE id = $2
            RETURNING * `,
                [hashPass, id]
            );
        })
        .then((result) => {
            return result.rows[0];
        });
}

function authLogin(email, password) {
    let userLogin;
    return getUserByemail(email)
        .then((user) => {
            userLogin = user;
            if (!user) {
                return null;
            } else {
                return bcrypt.compare(password, user.hash_password);
            }
        })
        .then((result) => {
            if (result === false || result === null) {
                return null;
            } else {
                return userLogin;
            }
        });
}

function newUser(firstName, lastName, eMail, password) {
    const first = firstName.toUpperCase();
    const last = lastName.toUpperCase();
    return hashPassword(password)
        .then((hashPass) => {
            return db.query(
                `INSERT INTO users (first_name, last_name, email, hash_password)
        VALUES ($1,$2,$3, $4)
        RETURNING * `,
                [first, last, eMail, hashPass]
            );
        })
        .then((result) => result.rows[0]);
}

function updateUsers(firstName, lastName, eMail, id) {
    const newFirst = firstName.toUpperCase();
    const newLast = lastName.toUpperCase();
    return db
        .query(
            `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4
        RETURNING * `,
            [newFirst, newLast, eMail, id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => console.log("UpdateUsers ERROR", error));
}

function resetCode(email) {
    return getUserByemail(email).then((result) => {
        if (!result) {
            return "user not found";
        } else {
            const secretCode = cryptoRandomString({
                length: 6,
            });
            return db.query(
                `INSERT INTO password_reset_codes (user_id, code, email)
        VALUES ($1,$2,$3)
        RETURNING * `,
                [result.id, secretCode, email]
            );
        }
    });
}

function checkResetCode(email, code) {
    return db
        .query(
            `SELECT * FROM password_reset_codes 
    WHERE email = $1 AND  code = $2 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
            [email, code]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => console.log("checkResetCode ERROR", error));
}

//FUNCTION CALLED BY "/api/upload-profile-pic"- POST
function newImage(fileName, id) {
    const url = "https://auspic.s3.eu-central-1.amazonaws.com/" + fileName;
    return db
        .query(
            `UPDATE users SET  profile_picture_url = $1 WHERE id = $2 
        RETURNING * `,
            [url, id]
        )
        .then((result) => {
            return result.rows[0];
        });
}

//FUNCTION CALLED BY "/api/upload-profile-pic"- DELETE
function deleteProfilePic(id) {
    return db
        .query(
            `UPDATE users 
                    SET  profile_picture_url = NULL 
                    WHERE id = $1
                    RETURNING * `,
            [id]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function updateProfile(
    { newBoy, newGirl, newOn_the_way, newFrom_country, newLive_city, newBio },
    id
) {
    console.log(
        "UPDATE PROFILE DB CALLED",
        "newBoy",
        newBoy,
        "newGirl",
        newGirl,
        "newOn_the_way",
        newOn_the_way,
        "newFrom_country",
        newFrom_country,
        "newLive_city",
        newLive_city,
        "newBio",
        newBio,
        "ID",
        id
    );
    return db
        .query(
            `INSERT INTO profiles (boy, girl, on_the_way, from_country, live_city, bio, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (user_id)
    DO UPDATE SET boy = $1, girl = $2, on_the_way = $3, from_country = $4, live_city= $5, bio=$6, user_id=$7
    RETURNING * `,
            [
                newBoy,
                newGirl,
                newOn_the_way,
                newFrom_country,
                newLive_city,
                newBio,
                id,
            ]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function checkFriendshipStatus(id, otherUserId) {
    // console.log("db call", id, otherUserId);
    return db
        .query(
            `SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
            [id, otherUserId]
        )
        .then((result) => {
            // console.log("db result", result.rows[0]);
            return result.rows[0];
        });
}

function getFriendshipRequests(id) {
    // console.log("db call", id, otherUserId);
    return db
        .query(
            `SELECT users.id, users.first_name, users.last_name, users.profile_picture_url, 
            friendships.sender_id, friendships.recipient_id 
            FROM friendships
            JOIN users
            ON friendships.sender_id = users.id
            WHERE recipient_id = $1 AND accepted = false`,
            [id]
        )
        .then((result) => {
            // // console.log("db result", result.rows[0]);
            return result.rows;
        });
}

function deleteFriendRequest(id, otherUserId) {
    // console.log("db call", id, otherUserId);
    return db
        .query(
            `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
            [id, otherUserId]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function newFriendRequest(id, otherUserId) {
    return db
        .query(
            `INSERT INTO friendships (sender_id, recipient_id)
    VALUES ($1,$2)
    RETURNING * `,
            [id, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function updateFriendRequest(id, otherUserId) {
    return db
        .query(
            `UPDATE friendships SET  accepted = true WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1) 
        RETURNING * `,
            [id, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function getFriendsAndRequests(id) {
    return db
        .query(
            `SELECT users.id, users.first_name, users.last_name, users.profile_picture_url, 
            friendships.sender_id, friendships.recipient_id, friendships.accepted  
            FROM users 
            RIGHT OUTER JOIN friendships   
            ON (friendships.recipient_id = users.id OR friendships.sender_id = users.id )
            WHERE recipient_id = $1 AND users.id != $1
            OR sender_id = $1 AND users.id != $1`,
            [id]
        )
        .then((result) => {
            console.log("db result", result.rows);
            return result.rows;
        });
}

function getUserByemail(email) {
    return db
        .query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((result) => result.rows[0]);
}

// FUNCTION CALLED BY "/api/get-user/data"
function getUserById(id) {
    return db
        .query(
            `SELECT users.id, users.first_name, users.last_name, users.email, 
         users.profile_picture_url, profiles.bio, profiles.boy, profiles.girl, 
        profiles.on_the_way, profiles.from_country, profiles.live_city, 
        profiles.live_state   
        FROM users 
        FULL JOIN profiles
        ON users.id = profiles.user_id
        WHERE users.id = $1`,
            [id]
        )
        .then((result) => result.rows[0]);
}

//FUNCTION CALLED BY "/api/get-countries-list" GET
function getCountriesList() {
    return db.query(`SELECT * FROM countries`).then((result) => result.rows);
}

function findNewestUsers(id) {
    return db
        .query(
            `SELECT * FROM users WHERE id != $1 ORDER BY created_at DESC LIMIT 3`,
            [id]
        )
        .then((result) => result.rows);
}

function findUsers(searchValue, id) {
    console.log("searchValue + %", searchValue + "%");
    return db
        .query(
            `SELECT * FROM users
        WHERE (first_name ILIKE $1 AND id != $2)
        OR (last_name ILIKE $1 AND id != $2);`,
            [searchValue + "%", id]
        )
        .then((result) => result.rows);
}

findUsers("Ha", 2);

function createPublicChatMessage(sender_id, text) {
    return db
        .query(
            `INSERT INTO public_chat_messages (sender_id, text) 
    VALUES($1, $2) 
    RETURNING *`,
            [sender_id, text]
        )
        .then((result) => {
            return db.query(
                `SELECT public_chat_messages.id, public_chat_messages.sender_id, public_chat_messages.text, public_chat_messages.created_at, users.first_name, users.last_name, users.profile_picture_url
            FROM public_chat_messages
            JOIN users
            ON public_chat_messages.sender_id = users.id
            WHERE public_chat_messages.id = $1`,
                [result.rows[0].id]
            );
        })
        .then((result) => result.rows[0]);
}

function createPrivateChatMessage(msg, senderId, recipientId) {
    console.log("new private msg", msg, senderId, recipientId);
    return db
        .query(
            `INSERT INTO private_chat_messages (text, sender_id, recipient_id ) 
VALUES($1, $2, $3) 
RETURNING *`,
            [msg, senderId, recipientId]
        )
        .then((result) => {
            console.log("insert result", result);
            return db.query(
                `SELECT private_chat_messages.id, private_chat_messages.sender_id, private_chat_messages.recipient_id, private_chat_messages.text, private_chat_messages.created_at, users.first_name, users.last_name, users.profile_picture_url 
                FROM private_chat_messages 
                JOIN users 
                ON private_chat_messages.sender_id = users.id
                 WHERE private_chat_messages.id = $1`,
                [result.rows[0].id]
            );
        })
        .then((result) => result.rows[0]);
}

function getPublicChatMessages() {
    return db
        .query(
            `SELECT public_chat_messages.id, public_chat_messages.sender_id, public_chat_messages.text, public_chat_messages.created_at, users.first_name, users.last_name, users.profile_picture_url 
        FROM public_chat_messages 
        JOIN users 
        ON public_chat_messages.sender_id = users.id
        ORDER BY public_chat_messages.created_at DESC LIMIT 20`
        )
        .then((result) => result.rows);
}

function getPrivateMessages(idOne, idTwo) {
    console.log("get private msg DB", idOne, idTwo);
    return db
        .query(
            `SELECT private_chat_messages.id, private_chat_messages.sender_id, private_chat_messages.recipient_id, private_chat_messages.text, private_chat_messages.created_at, users.first_name, users.last_name, users.profile_picture_url 
            FROM private_chat_messages 
            JOIN users 
            ON private_chat_messages.sender_id = users.id
            WHERE (private_chat_messages.sender_id = $1 AND private_chat_messages.recipient_id = $2)
            OR (private_chat_messages.recipient_id  = $1 AND private_chat_messages.sender_id = $2)
            ORDER BY private_chat_messages.created_at DESC LIMIT 20`,
            [idOne, idTwo]
        )
        .then((result) => {
            console.log("get private msg DB result", result);
            return result.rows;
        });
}

function getQuote() {
    const random = Math.floor(Math.random() * 20) + 1;
    return db
        .query(`SELECT * FROM quotes WHERE id = $1`, [random])
        .then((result) => {
            return result.rows[0];
        });
}

module.exports = {
    changePassword,
    updateUsers,
    newUser,
    authLogin,
    resetCode,
    checkResetCode,
    getUserById,
    newImage,
    updateProfile,
    findNewestUsers,
    findUsers,
    checkFriendshipStatus,
    newFriendRequest,
    deleteFriendRequest,
    updateFriendRequest,
    getFriendsAndRequests,
    getQuote,
    getPublicChatMessages,
    createPublicChatMessage,
    getFriendshipRequests,
    deleteProfilePic,
    getCountriesList,
    getPrivateMessages,
    createPrivateChatMessage,
};
