import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import FriendshipButton from "./friendshipButton";
import PrivateChat from "./privateChat";

export default function OtherUsersProfile(id) {
    const [first_name, setFirst_name] = useState();
    const [last_name, setLast_name] = useState();
    const [picUrl, setPicUrl] = useState();
    const [bio, setBio] = useState();
    const [boy, setBoy] = useState();
    const [girl, setGirl] = useState();
    const [onTheWay, setOnTheWay] = useState();
    const [fromCoutry, setFromCouuntry] = useState();
    const [liveCity, setLiveCity] = useState();
    const [friendStatus, setFriendStatus] = useState();

    const { theOderUserID } = useParams();
    const history = useHistory();

    function onSetFriendStatus(newStatus) {
        setFriendStatus(newStatus);
        console.log("onSetFriendStatus called", friendStatus);
        return;
    }

    useEffect(() => {
        console.log("OtherUsersProfile", id);
        fetch(`/api/get-other-user/${theOderUserID}`)
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                if (result.success === "same id") {
                    history.replace("/");
                    return;
                }
                if (result.success === false) {
                    return;
                }
                console.log("fetch result", result);
                setFirst_name(result.first_name);
                setLast_name(result.last_name);
                setPicUrl(result.profile_picture_url);
                setBio(result.bio);
                setBoy(result.boy);
                setGirl(result.girl);
                setOnTheWay(result.on_the_way);
                setFromCouuntry(result.from_country);
                setLiveCity(result.live_city);
            });
    }, []);

    return (
        <section className="theOtherUser">
            <div className="theOtherUserData">
                <div className="theOtherUSerContainer">
                    <div className="theOtherUserInner">
                        <img
                            src={
                                picUrl ||
                                `https://avatars.dicebear.com/api/big-smile/female/${first_name}.svg`
                            }
                        />{" "}
                        <h1>
                            {first_name} {last_name}
                        </h1>
                    </div>
                    <div className="otherUserKidsCount">
                        {boy ? (
                            <div className="otherUserKidsCountContainer">
                                <img src="/boy.png" /> <p>{boy}</p>
                            </div>
                        ) : null}
                        {girl ? (
                            <div className="otherUserKidsCountContainer">
                                <img src="/girl.png" /> <p>{girl}</p>
                            </div>
                        ) : null}
                        {onTheWay ? (
                            <div className="otherUserKidsCountContainer">
                                <img src="/ultrasound.png" /> <p>{onTheWay}</p>
                            </div>
                        ) : null}
                    </div>
                    {fromCoutry ? (
                        <p className="otherUserText">I am from {fromCoutry} </p>
                    ) : null}
                    {liveCity ? (
                        <p className="otherUserText">I live in {liveCity}</p>
                    ) : null}
                    {bio ? <p className="otherUserText">{bio}</p> : null}
                    <FriendshipButton
                        theOderUserID={theOderUserID}
                        onSetFriendStatus={onSetFriendStatus}
                    ></FriendshipButton>
                </div>
            </div>
            <div className="privateChat">
                <PrivateChat
                    friendStatus={friendStatus}
                    id={id}
                    theOderUserID={theOderUserID}
                ></PrivateChat>
            </div>
        </section>
    );
}
