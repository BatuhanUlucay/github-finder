import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();
const GITHUB_URL = "https://api.github.com";

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  //Get search results
  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const { items } = await response.json();
    console.log(items);
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  //get a single user
  const getUser = async (login) => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      console.log(data);
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  //clear users from state
  const clearUsers = () => dispatch({ type: "CLEAR_USERS" });

  //set loading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
