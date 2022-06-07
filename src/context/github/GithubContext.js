import { createContext, useReducer} from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();
const GITHUB_URL = "https://api.github.com";

export const GithubProvider = ({ children }) => {

    const initialState = {
        users: [],
        loading: false,
    }

    const [state, dispatch] = useReducer(githubReducer, initialState);

    //get initial users (testing purposes.)
  const fetchUsers = async () => {
      setLoading();
    const response = await fetch(`${GITHUB_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    dispatch({
        type: "GET_USERS",
        payload: data,
    });
    console.log(data);
  };

  //set loading
  const setLoading = () => dispatch({type: "SET_LOADING"});

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        fetchUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
