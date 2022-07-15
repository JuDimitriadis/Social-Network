import { useState, useEffect } from "react";
import ProfilePicModal from "./profilePicModal";
import ProfileModal from "./profileModal";

export default function Profile({
    first_name,
    last_name,
    url,
    bio,
    id,
    boy,
    girl,
    on_the_way,
    from_country,
    live_city,
    live_state,
    email,
    onNewPicUpload,
    onNewProfile,
}) {
    const [showPicModal, setShowPicModal] = useState(false);
    const [showBioModal, setShowBioModal] = useState(false);

    function openPicModal() {
        console.log("click clicks");
        setShowPicModal(!showPicModal);
        console.log("showPicModal", showPicModal);
    }

    function openBioModal() {
        setShowBioModal(!showBioModal);
    }

    return (
        <>
            <img
                onClick={openPicModal}
                className="sideBarProfilePic"
                alt={"Profile Picture from" + { first_name } + { last_name }}
                src={
                    url ||
                    `https://avatars.dicebear.com/api/big-smile/female/${first_name}.svg`
                }
            />
            <h1 className="sideBarUserName">
                {first_name} {last_name}
            </h1>
            <div className="kidsCountRow">
                {" "}
                {boy ? (
                    <div className="kidsCount">
                        <img src="/boy.png" />
                        <p>{boy}</p>
                    </div>
                ) : null}
                {girl ? (
                    <div className="kidsCount">
                        <img src="/girl.png" />
                        <p>{girl}</p>
                    </div>
                ) : null}
                {on_the_way ? (
                    <div className="kidsCount">
                        <img src="/ultrasound.png" />
                        <p>{on_the_way}</p>
                    </div>
                ) : null}
            </div>

            {from_country ? (
                <p className="sideBarP">I am from {from_country}</p>
            ) : null}
            {live_city || live_state ? (
                <p className="sideBarP">
                    {" "}
                    I live in {live_city} {live_state}
                </p>
            ) : null}
            {bio ? <p className="sideBarP">{bio} </p> : null}
            {!bio &&
            !boy &&
            !girl &&
            !on_the_way &&
            !from_country &&
            !live_city &&
            !live_state ? (
                <p className="sideBarP">
                    Looks like you haven't fill out you profile yet.
                </p>
            ) : null}
            <div className="editProfileButton" onClick={openBioModal}>
                {bio ||
                boy ||
                girl ||
                on_the_way ||
                from_country ||
                live_city ||
                live_state ? (
                    <>Edit Profile</>
                ) : (
                    <>Add Profile</>
                )}
            </div>

            {showPicModal && (
                <ProfilePicModal
                    onShowModalChange={showPicModal}
                    onXClick={openPicModal}
                    id={id}
                    url={url}
                    onNewPicUpload={onNewPicUpload}
                ></ProfilePicModal>
            )}

            <ProfileModal
                showBioModal={showBioModal}
                setShowBioModal={setShowBioModal}
                id={id}
                bio={bio}
                boy={boy}
                girl={girl}
                on_the_way={on_the_way}
                from_country={from_country}
                live_city={live_city}
                live_state={live_state}
                onNewProfile={onNewProfile}
            ></ProfileModal>
        </>
    );
}
