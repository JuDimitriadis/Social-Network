import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [quote, setQuote] = useState();
    const [newFriendsRequest, setNewFriendsRequest] = useState();
    const [friendsReqCount, setFriendsReqCount] = useState();

    useEffect(() => {
        fetch("/api/get-quote")
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                setQuote(result.quotes);
            });

        fetch("/api/get-friendsReq")
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                setNewFriendsRequest(result);
                setFriendsReqCount(result.length);
            });
    }, []);

    function handleAcceptClick(friendshipStatus, theOderUserID) {
        const body = {
            status: friendshipStatus,
            otherId: theOderUserID,
        };

        const bodyJson = JSON.stringify(body);

        fetch(`/api/friendshipStatus`, {
            method: "POST",
            body: bodyJson,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((result) => {
                return result.json();
            })
            .then(() => {
                const filterId = (obj) => {
                    return obj.id != theOderUserID;
                };
                const newArray = newFriendsRequest.filter(filterId);
                setNewFriendsRequest(newArray);
                setFriendsReqCount(newArray.length);
            });
    }

    return (
        <>
            <h1 className="quotes">{quote}</h1>
            {newFriendsRequest ? (
                <>
                    <h3 className="homeFriendsReqTitle">
                        You have some friendship requests waiting for you
                    </h3>
                    <div className="homeFriendsReqGrid">
                        {newFriendsRequest.slice(0, 3).map((user) => {
                            return (
                                <div
                                    className="homeFriendsReqContainer"
                                    key={user.id}
                                >
                                    <Link to={`/users/${user.id}`}>
                                        <img
                                            src={
                                                user.profile_picture_url ||
                                                `https://avatars.dicebear.com/api/big-smile/female/${user.first_name}.svg`
                                            }
                                        />
                                        <p className="homeFriendsReqP">
                                            {user.first_name} {user.last_name}
                                        </p>
                                    </Link>
                                    <button
                                        className="homeFriendsReqButton"
                                        onClick={() =>
                                            handleAcceptClick(
                                                "Accept Friend Request",
                                                user.id
                                            )
                                        }
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : null}
            {friendsReqCount > 3 ? (
                <>
                    {" "}
                    <p className="homeFriendsReqCount">
                        {" "}
                        <Link to="/my-friends"> Click here </Link> and check all{" "}
                        {friendsReqCount} friendship requests waiting for you.
                    </p>{" "}
                </>
            ) : null}
        </>
    );
}
