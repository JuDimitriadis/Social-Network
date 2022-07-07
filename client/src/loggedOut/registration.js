import { Component } from "react";
import { Link } from "react-router-dom";

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
            },
            () => console.log(this.state)
        );
    }

    handleSubmit(evt) {
        evt.preventDefault();

        console.log("USER TRIED TO SUBMIT");
        const { first, last, email, password, confirmPassword } = this.state;
        if (first && last && email && password && confirmPassword) {
            if (this.state.password === this.state.confirmPassword) {
                const body = {
                    first: first,
                    last: last,
                    email: email,
                    password: password,
                };
                const bodyJson = JSON.stringify(body);

                fetch("/api/register", {
                    method: "POST",
                    body: bodyJson,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((result) => {
                        console.log("result fetch REGISTRATION", result);
                        if (result.success === true) {
                            history.pushState({}, "", "/");
                            location.reload();
                            return;
                        }
                        if (result.error === "email") {
                            this.setState({
                                error: "Email already registered.Please log in",
                            });
                            return;
                        }

                        if (result.error === "others") {
                            this.setState({
                                error: "Ops, somenthig went wrong! Please try again",
                            });
                            return;
                        }

                        return;
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState(
                            {
                                error: "Ops, somenthig went wrong! Please try again",
                            }
                            // () => console.log(this.state)
                        );
                    });
            } else {
                console.log("diferent password");

                this.setState(
                    {
                        error: "Ops,password doesn't match",
                    }
                    // () => console.log(this.state)
                );
            }
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
                <h2 className="welcomePageFormTittle">Register here</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="text"
                        name="first"
                        placeholder="First Name"
                    />
                    <input
                        onChange={this.handleChange}
                        type="text"
                        name="last"
                        placeholder="Last Name"
                    />
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
                    <input
                        onChange={this.handleChange}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                    />
                    <p className="error">{this.state.error}</p>
                    <button className="welcomePageFormButton">Submit</button>
                </form>
            </div>
        );
    }
}
