import React, { useEffect } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import NavBar from "./components/NavBar/NavBar";
import PolicyForm from "./components/Policies/Form";
import UpdatePolicy from "./components/Policies/UpdatePolicy";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Policy from "./components/Policies/Policy";
import Policies from "./components/Policies/Policies";
import GitHubAuth from "./components/Authentication/GitHub";
import { reducer, initialState } from "./utils/reducer";
import GitLabAuthentication from "./components/Authentication/GitLab";
import Auth from "./components/Authentication";

export const AuthContext = React.createContext();

function Home() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // if loggedInTime in the state value is less than 8 hours from now, then logout
  useEffect(() => {
    if (state.loggedInTime) {
      const diff = new Date().getTime() - new Date(state.loggedInTime).getTime();
      if (diff > 8 * 60 * 60 * 1000) {
        dispatch({ type: "LOGOUT" });
      }
    }
  }
  , [state.loggedInTime]);

  return (
    <React.StrictMode>
      <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <ChakraProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/policy/new" element={<PolicyForm />} />
            <Route path="/policy/:name" element={<Policy />} />
            <Route path="/policy/:name/edit" element={<UpdatePolicy />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/" element={<Policies />} />
            <Route path="/policies" element={<Policies />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </AuthContext.Provider>
  </React.StrictMode>
  )
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
  
root.render(<Home />);
