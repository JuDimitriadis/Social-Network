import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receivedfriendsAndRequests,
    friendshipAccepted,
    unfriended,
} from "../redux/friends_and_requests/slice";

export default function MyFriends({ id }) {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friendsAndRequestsReducer &&
            state.friendsAndRequestsReducer.filter(
                (friends) => friends.accepted === true
            )
    );

    const friendshipRequested = useSelector(
        (state) =>
            state.friendsAndRequestsReducer &&
            state.friendsAndRequestsReducer.filter(
                (friends) =>
                    friends.sender_id === id && friends.accepted === false
            )
    );

    const friendshipRecieved = useSelector(
        (state) =>
            state.friendsAndRequestsReducer &&
            state.friendsAndRequestsReducer.filter(
                (friends) =>
                    friends.recipient_id === id && friends.accepted === false
            )
    );

    useEffect(() => {
        fetch("/api/get-friends-and-requests")
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                dispatch(receivedfriendsAndRequests(result));
                return;
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
            .then((result) => {
                console.log(result);
                if (result.status === "Unfriend") {
                    dispatch(friendshipAccepted(theOderUserID));
                } else {
                    dispatch(unfriended(theOderUserID));
                }
            })
            .then(() => console.log("friends     after dispacth", friends));
    }

    return (
        <>
            <div>
                <h2 className="friendsTitle"> Friends to be</h2>
                <div className="myFriendsGrid">
                    {friendshipRecieved.map((user) => {
                        return (
                            <div className="myFriendsContainer" key={user.id}>
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={
                                            user.profile_picture_url ||
                                            `https://avatars.dicebear.com/api/big-smile/female/${user.first_name}.svg`
                                        }
                                    />
                                    <p className="myFriendsContainerP">
                                        {user.first_name} {user.last_name}
                                    </p>
                                </Link>
                                <button
                                    className="myFriendsContainerButton"
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
                    {friendshipRequested.map((user) => {
                        return (
                            <div className="myFriendsContainer" key={user.id}>
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={
                                            user.profile_picture_url ||
                                            `https://avatars.dicebear.com/api/big-smile/female/${user.first_name}.svg`
                                        }
                                    />
                                    <p className="myFriendsContainerP">
                                        {user.first_name} {user.last_name}
                                    </p>
                                </Link>
                                <button
                                    className="myFriendsContainerButton"
                                    onClick={() =>
                                        handleAcceptClick(
                                            "Cancel Friend Request",
                                            user.id
                                        )
                                    }
                                >
                                    Cancel Friend Request
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <h2 className="friendsTitle"> My Friends</h2>
                <div className="myFriendsGrid">
                    {friends.map((user) => {
                        return (
                            <div className="myFriendsContainer" key={user.id}>
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={
                                            user.profile_picture_url ||
                                            `https://avatars.dicebear.com/api/big-smile/female/${user.first_name}.svg`
                                        }
                                    />
                                    <p className="myFriendsContainerP">
                                        {user.first_name} {user.last_name}
                                    </p>
                                </Link>
                                <button
                                    className="myFriendsContainerButton"
                                    onClick={() =>
                                        handleAcceptClick("Unfriend", user.id)
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
