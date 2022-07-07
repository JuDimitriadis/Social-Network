import { combineReducers } from "redux";
import { friendsAndRequestsReducer } from "./friends_and_requests/slice";

const rootReducer = combineReducers({
    friendsAndRequestsReducer: friendsAndRequestsReducer,
});

export default rootReducer;
