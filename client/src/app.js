import { Component } from "react";
import { Link, BrowserRouter, Route } from "react-router-dom";
import Profile from "./sidebarComponents/profile";
import SearchUsers from "./nav_pages/searchUsers";
import OtherUsersProfile from "./nav_pages/otherUsersProfile";
import MyFriends from "./nav_pages/myFriends";
import PublicChat from "./nav_pages/publicChat";
import Home from "./nav_pages/home";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onNewPicUpload = this.onNewPicUpload.bind(this);
        this.onNewProfile = this.onNewProfile.bind(this);
    }

    onNewPicUpload(newUrl) {
        this.setState({
            profile_picture_url: newUrl,
        });
    }
    onNewProfile(newProfile) {
        console.log("on new profile    : ", newProfile);
        this.setState({
            bio: newProfile.bio,
            boy: newProfile.boy,
            girl: newProfile.girl,
            on_the_way: newProfile.on_the_way,
            from_country: newProfile.from_country,
            live_city: newProfile.live_city,
            live_state: newProfile.live_state,
        });
        return;
    }

    componentDidMount() {
        if (location.pathname === "/") {
            console.log("location.pathname : ", location.pathname);
            history.pushState({}, "", "/home");
            location.reload();
            console.log("location.pathname AFTER: ", location.pathname);
        }
        fetch("/api/get-user/data")
            .then((result) => {
                return result.json();
            })
            .then((data) => {
                this.setState({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    id: data.id,
                    profile_picture_url: data.profile_picture_url,
                    bio: data.bio,
                    boy: data.boy,
                    girl: data.girl,
                    on_the_way: data.on_the_way,
                    from_country: data.from_country,
                    live_city: data.live_city,
                    live_state: data.live_state,
                    email: data.email,
                });

                console.log("state id", this.state.id);
                return;
            });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <div className="logededPage">
                        <header className="headerApp">
                            <h1 className="appLogo">the expat MOM</h1>
                            <img src="/MomsTopBar.jpg" />
                        </header>
                        <nav className="navBarApp">
                            <Link to="/public-chat" className="navLink">
                                <img src="/chat.png" />
                            </Link>
                            <Link to="/search" className="navLink">
                                <img src="/search.png" />
                            </Link>
                            <Link to="/my-friends" className="navLink">
                                <img src="/friends.png" />
                            </Link>

                            <Link to="/home" className="navLink">
                                <img src="/home.png" />
                            </Link>
                        </nav>
                        <div className="sideBar">
                            <Profile
                                first_name={this.state.first_name}
                                last_name={this.state.last_name}
                                url={this.state.profile_picture_url}
                                bio={this.state.bio}
                                id={this.state.id}
                                boy={this.state.boy}
                                girl={this.state.girl}
                                on_the_way={this.state.on_the_way}
                                from_country={this.state.from_country}
                                live_city={this.state.live_city}
                                live_state={this.state.live_state}
                                email={this.state.email}
                                onNewPicUpload={this.onNewPicUpload}
                                onNewProfile={this.onNewProfile}
                            ></Profile>
                        </div>

                        <div className="navPages">
                            <Route path="/home">
                                <Home></Home>
                            </Route>
                            <Route path="/search">
                                <SearchUsers></SearchUsers>
                            </Route>
                            <Route path="/users/:theOderUserID">
                                <OtherUsersProfile
                                    id={this.state.id}
                                ></OtherUsersProfile>
                            </Route>
                            <Route path="/my-friends">
                                <MyFriends id={this.state.id}></MyFriends>
                            </Route>
                            <Route path="/public-chat">
                                <PublicChat id={this.state.id}></PublicChat>
                            </Route>
                        </div>
                    </div>{" "}
                </BrowserRouter>
                <footer>
                    <p>&copy; 2022 the expat Mom GmbH</p>
                </footer>
            </>
        );
    }
}
