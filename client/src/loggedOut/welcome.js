import { BrowserRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <section className="welcomePage">
                    <img className="welcomePageBoxImg" src="/MomsCover.jpg" />
                    <h1 className="welcomePageLog">the expat MOM</h1>
                    <div className="loginAndRegisterIcons">
                        <Link to="/login">
                            <img className="loginIcon" src="/login.png" />
                        </Link>
                        <Link to="/register">
                            <img className="registerIcon" src="/register.png" />
                        </Link>
                    </div>
                    <div className="welcomePageAnimation">
                        <p className="welcomePageDescription">
                            Being an expatriate mom can be challenging at times.
                            So join our virtual community where we support each
                            other through this journey.
                        </p>
                    </div>
                    {/* <div className="welcomePageForm"> */}
                    <div>
                        <Route exact path="/register">
                            <Registration />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/reset-password">
                            <ResetPassword />
                        </Route>
                    </div>
                    {/* </div> */}
                </section>{" "}
            </BrowserRouter>
            <footer>
                <p>&copy; 2022 the expat Mom GmbH</p>
            </footer>
        </>
    );
}
