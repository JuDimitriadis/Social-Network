import { useState, useEffect } from "react";

export default function FriendshipButton({ theOderUserID, onSetFriendStatus }) {
    const [friendshipStatus, setFriendshipStatus] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        fetch(`/api/friendshipStatus/${theOderUserID}`)
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                if (result.status != "error") {
                    setFriendshipStatus(result.status);
                    onSetFriendStatus(result.status);
                    return;
                } else {
                    setError(true);
                    return;
                }
            });
    });

    function handleClick() {
        const body = {
            status: friendshipStatus,
            otherId: +theOderUserID,
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
                if (result != "error") {
                    setFriendshipStatus(result.status);
                    onSetFriendStatus(result.status);
                    return;
                } else {
                    setError(true);
                    return;
                }
            });
    }

    return (
        <>
            <button className="theOtherUserFriendButton" onClick={handleClick}>
                {friendshipStatus}
            </button>
            {error ? (
                <p className="error">
                    Ops, somenthing went wrong! Please try again.
                </p>
            ) : null}
        </>
    );
}
