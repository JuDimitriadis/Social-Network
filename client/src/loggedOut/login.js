import { Component } from "react";
import { Link, Redirect } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // () => console.log(this.state)
        );
    }

    handleSubmit(evt) {
        evt.preventDefault();

        console.log("USER TRIED TO login");
        const { email, password } = this.state;
        if (email && password) {
            const body = {
                email: email,
                password: password,
            };
            const bodyJson = JSON.stringify(body);

            fetch("/api/check-login", {
                method: "POST",
                body: bodyJson,
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    // console.log(result);
                    if (result.success === false) {
                        this.setState({
                            error: "Ops, somenthing went wrong! E-mail and/or password incorrect",
                        });
                    } else {
                        history.pushState({}, "", "/");
                        location.reload();
                        return;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        error: "Ops, somenthig went wrong! Please try again",
                    });
                });
        } else {
            console.log("missing field");

            this.setState(
                {
                    error: "Please fill out all required fields before submitting",
                }
                // () => console.log(this.state)
            );
        }
    }

    render() {
        return (
            <div className="welcomePageForm">
                <h2 className="welcomePageFormTittle">Log in</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="email"
                        name="email"
                        placeholder="Email Address"
                    />
                    <input
                        onChange={this.handleChange}
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    <p className="error">{this.state.error}</p>
                    <button className="welcomePageFormButton">Login</button>
                </form>
                <Link to="/reset-password" className="resetLink">
                    Forgot your password?
                </Link>
            </div>
        );
    }
}
