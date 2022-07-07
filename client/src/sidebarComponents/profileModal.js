import { Component } from "react";

export default class ProfileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.closeBioModal = this.closeBioModal.bind(this);
    }

    closeBioModal() {
        this.props.setShowBioModal(false);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state);
    }
    handleSaveClick(evt) {
        evt.preventDefault();
        const body = {
            newBoy: this.state.boy || this.props.boy,
            newGirl: this.state.girl || this.props.girl,
            newOn_the_way: this.state.onTheWay || this.props.on_the_way,
            newFrom_country: this.state.from_country || this.props.from_country,
            newLive_city: this.state.live_city || this.props.live_city,
            newBio: this.state.editedBio || this.props.bio,
        };

        console.log("BODY ", body);
        const bodyJson = JSON.stringify(body);

        fetch("/api/update-profile", {
            method: "POST",
            body: bodyJson,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((result) => result.json())
            .then((result) => {
                console.log("/api/update-profile result   ", result);
                this.props.onNewProfile(result);
                this.closeBioModal();
            });
    }

    render() {
        return (
            <>
                {" "}
                {this.props.showBioModal ? (
                    <div className="modalShadow">
                        <div className="modalContainer">
                            <aside onClick={this.closeBioModal}>X</aside>
                            <div className="modalInner">
                                <h2 className="modalTitle">
                                    Edit your profile
                                </h2>
                                <form onSubmit={this.handleSaveClick}>
                                    <p>You are a mom of :</p>
                                    <div className="modalKidsCountRow">
                                        <div className="modalKidsCountForm">
                                            <label htmlFor="boy">
                                                <img src="/boy.png"></img>
                                            </label>
                                            <input
                                                className="KidsCountInput"
                                                name="boy"
                                                id="boy"
                                                type="number"
                                                defaultValue={this.props.boy}
                                                onChange={this.handleChange}
                                            ></input>
                                        </div>
                                        <div className="modalKidsCountForm">
                                            <label htmlFor="girl">
                                                <img src="/girl.png"></img>
                                            </label>
                                            <input
                                                className="KidsCountInput"
                                                name="girl"
                                                type="number"
                                                defaultValue={this.props.girl}
                                                onChange={this.handleChange}
                                            ></input>
                                        </div>
                                        <div className="modalKidsCountForm">
                                            <label htmlFor="onTheWay">
                                                <img src="/ultrasound.png"></img>
                                            </label>
                                            <input
                                                className="KidsCountInput"
                                                name="onTheWay"
                                                type="number"
                                                defaultValue={
                                                    this.props.on_the_way
                                                }
                                                onChange={this.handleChange}
                                            ></input>
                                        </div>
                                    </div>
                                    <label htmlFor="from_country">
                                        Where are you from?
                                    </label>
                                    <input
                                        className="modalInput"
                                        name="from_country"
                                        type="text"
                                        defaultValue={this.props.from_country}
                                        onChange={this.handleChange}
                                    ></input>
                                    <label htmlFor="live_city">
                                        Where do you live now?
                                    </label>
                                    <input
                                        className="modalInput"
                                        name="live_city"
                                        type="text"
                                        defaultValue={this.props.live_city}
                                        onChange={this.handleChange}
                                    ></input>
                                    <label htmlFor="editedBio">
                                        Write you Bio here
                                    </label>
                                    <textarea
                                        name="editedBio"
                                        id="editedBio"
                                        defaultValue={this.props.bio}
                                        onChange={this.handleChange}
                                    ></textarea>
                                    <p className="error">{this.state.error}</p>

                                    <button>
                                        {this.props.bio ||
                                        this.props.boy ||
                                        this.props.girl ||
                                        this.props.on_the_way ||
                                        this.props.from_country ||
                                        this.props.live_city ||
                                        this.props.live_state ? (
                                            <>Save Changes</>
                                        ) : (
                                            <>Save New Profile</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : null}{" "}
            </>
        );
        // if the user is editing,
        // display the edit htmlForm
        // else, display the appropriate text / button
    }
}
