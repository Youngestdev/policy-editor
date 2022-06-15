import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import NavBar from "./components/NavBar/NavBar";
import PolicyForm from "./components/Policies/Form";
import UpdatePolicy from "./components/Policies/UpdatePolicy";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Policy from "./components/Policies/Policy";
import GitHubAuth from "./components/Authentication/GitHub";
import { reducer, initialState } from "./utils/reducer";

export const AuthContext = React.createContext();

// TODO: Clean up function.

function Home() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
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
            <Route path="/" element={<App />} />
            <Route path="/policy/:name" element={<Policy />} />
            <Route path="/policy/:name/edit" element={<UpdatePolicy />} />
            <Route path="/login" element={<GitHubAuth />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </AuthContext.Provider>
  </React.StrictMode>
  )
}

function App() {

  return (
      <Box p={4}>
        <PolicyForm />
      </Box>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
  
root.render(<Home />);
