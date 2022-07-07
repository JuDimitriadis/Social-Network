export function friendsAndRequestsReducer(friendsAndRequests = [], action) {
    if (action.type == "friendsAndRequests/receivedfriendsAndRequests") {
        friendsAndRequests = action.payload.newFriendsAndRequests;
    }

    if (action.type == "friendsAndRequests/accepted") {
        friendsAndRequests = friendsAndRequests.map((friend) => {
            if (friend.id === action.payload) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
    }

    if (action.type == "friendsAndRequests/unfriended") {
        friendsAndRequests = friendsAndRequests.map((friend) => {
            if (friend.id === action.payload) {
                return {};
                //ASK FOR A BETTER SOLUTION
            } else {
                return friend;
            }
        });
    }
    return friendsAndRequests;
}

// ACTION CREATORS -----------------------------------

export function receivedfriendsAndRequests(newFriendsAndRequests) {
    return {
        type: "friendsAndRequests/receivedfriendsAndRequests",
        payload: { newFriendsAndRequests },
    };
}

export function friendshipAccepted(id) {
    return {
        type: "friendsAndRequests/accepted",
        payload: id,
    };
}

export function unfriended(id) {
    return {
        type: "friendsAndRequests/unfriended",
        payload: id,
    };
}
