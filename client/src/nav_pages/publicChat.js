import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const timeRangesInSec = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
];
function timeAgo(timeStamp) {
    const timeStampInSec = Math.floor(
        (new Date() - new Date(timeStamp)) / 1000
    );
    let howLongAgo;
    let range;
    const suffix = howLongAgo === 1 ? "" : "s";

    for (let [name, seconds] of timeRangesInSec) {
        const interval = Math.floor(timeStampInSec / seconds);
        if (interval >= 1) {
            howLongAgo = interval;
            range = name;
            return `${howLongAgo} ${range}${suffix} ago`;
        }
    }
}

let socket;

export default function PublicChat() {
    const [recentMessages, setRecentMessages] = useState([]);
    const inputRef = useRef(null);
    const lastMsgRef = useRef(null);

    useEffect(() => {
        setImmediate(() => inputRef.current.focus());

        if (!socket) {
            socket = io.connect();
        }

        socket.on("recentPublicChatMsg", (messages) => {
            console.log("recent messages from the server", messages);
            setRecentMessages(messages);
            lastMsgRef.current &&
                lastMsgRef.current.scrollIntoView({
                    behavior: "smooth",
                });
        });

        return () => {
            socket.off("recentPublicChatMsg");
            socket.disconnect();
            socket = null;
        };
    }, []);

    useEffect(() => {
        socket.on("newSavedMsg", (newMsg) => {
            console.log("new msg back from server", newMsg);
            setRecentMessages([...recentMessages, newMsg]);
            if (lastMsgRef.current) {
                console.log("lastMsgRef.current;", lastMsgRef);
                lastMsgRef.current.scrollIntoView({
                    behavior: "instant",
                });
            }
        });
    }, [recentMessages]);

    function handleSubmit(evt) {
        console.log("SUBMITED", evt.target[0].value);
        event.preventDefault();
        const newMessage = evt.target[0].value;
        socket.emit("newMsg", newMessage);
        evt.target[0].value = "";
    }

    return (
        <section className="chatPage">
            <div className="chatTitleandDescriptionContainer">
                <h2 className="chatTitle">The MOM Room</h2>
                <p className="chatDescription">
                    Welcome to our open chat room, a safe space where you can
                    ask question or just talk about motherhood chalanges.
                </p>
            </div>{" "}
            <div className="chatContainer">
                <div className="messagesContainer">
                    {recentMessages.map((msg) => {
                        return (
                            <div
                                className="singleMsgContainer"
                                key={msg.id}
                                ref={lastMsgRef}
                            >
                                <Link to={`/users/${msg.sender_id}`}>
                                    <img
                                        className="singleMsgContainerImg"
                                        src={
                                            msg.profile_picture_url ||
                                            `https://avatars.dicebear.com/api/big-smile/${msg.first_name}.svg`
                                        }
                                    />
                                </Link>
                                <div className="textMsgContainer">
                                    <p className="textMsg">{msg.text}</p>
                                    <p className="sender">
                                        sent by{" "}
                                        <Link to={`/users/${msg.sender_id}`}>
                                            {" "}
                                            {msg.first_name} {msg.last_name}{" "}
                                        </Link>{" "}
                                        {timeAgo(msg.created_at)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <form
                    className="chatForm"
                    onSubmit={handleSubmit}
                    ref={inputRef}
                >
                    <input type="text" name="newMessage" required></input>
                    <button className="sendBtn">Send</button>
                </form>
            </div>
        </section>
    );
}
