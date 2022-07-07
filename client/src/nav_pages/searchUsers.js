import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SearchUsers() {
    const [usersArray, setUsersArray] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        let abort = false;

        if (!searchValue) {
            fetch(`/api/find-new-users/`)
                .then((res) => res.json())
                .then((result) => {
                    if (!abort) {
                        setUsersArray(result);
                    }
                });
            return;
        } else {
            fetch(`/api/find-users/${searchValue}`)
                .then((res) => res.json())
                .then((result) => {
                    if (!abort) {
                        setUsersArray(result);
                    }
                });
        }

        return () => (abort = true);
    }, [searchValue]);

    function handleChange(evt) {
        setSearchValue(evt.target.value);
    }

    return (
        <>
            {" "}
            <div className="findpeople">
                <h2 className="friendsTitle">
                    {" "}
                    Here you can find moms around you to connect with
                </h2>
                <form className="seachForm">
                    <input
                        type="text"
                        name="searchValue"
                        placeholder="Enter name here"
                        onChange={handleChange}
                    />
                </form>
                {!searchValue ? (
                    <h2 className="recentJoinedTitle">
                        {" "}
                        Checkout who just joined!
                    </h2>
                ) : null}
                <div className="myFriendsGrid">
                    {usersArray.map((user) => {
                        return (
                            <div className="myFriendsContainer" key={user.id}>
                                <Link to={`/users/${user.id}`}>
                                    <img
                                        src={
                                            user.profile_picture_url ||
                                            `https://avatars.dicebear.com/api/big-smile/${user.first_name}.svg`
                                        }
                                    />
                                    <p className="myFriendsContainerP">
                                        {user.first_name} {user.last_name}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
