import { useState } from "react";

export default function ProfilePicModal({
    onShowModalChange,
    onXClick,
    id,
    url,
    onNewPicUpload,
}) {
    const [error, setError] = useState(false);

    function onSubmit(evt) {
        evt.preventDefault();
        const file = evt.target[0].files[0];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);

        fetch("/api/upload-profile-pic", {
            method: "POST",
            body: formData,
        })
            .then((result) => result.json())
            .then((result) => {
                if (result.success === false) {
                    setError("Ops, somenthing went wrong! Please, try again.");
                } else {
                    onNewPicUpload(result.profile_picture_url);
                    closePicModal();
                }
            });
    }

    function deletePic(evt) {
        evt.preventDefault();
        fetch("/api/upload-profile-pic", {
            method: "DELETE",
        })
            .then((result) => result.json())
            .then((result) => {
                if (result.success === false) {
                    setError("Ops, somenthing went wrong! Please, try again.");
                } else {
                    onNewPicUpload(null);
                    closePicModal();
                }
            });
    }

    function closePicModal(evt) {
        onXClick(evt);
        setError(null);
    }

    return (
        <>
            {" "}
            {onShowModalChange ? (
                <div className="modalShadow">
                    <div className="modalContainer">
                        <aside onClick={closePicModal}>X</aside>
                        <div className="modalInner">
                            <h2 className="modalTitle">
                                Would you like to change your profile picture?
                            </h2>
                            <form
                                className="profilePicForm"
                                onSubmit={onSubmit}
                            >
                                <input
                                    className="modalInput"
                                    type="file"
                                    accept="image/*"
                                    name="file"
                                    placeholder="Choose a File"
                                ></input>
                                <p className="error">{error}</p>
                                <button>Upload</button>
                            </form>
                            {url ? (
                                <button onClick={deletePic}>
                                    Delete Profile Picture
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
