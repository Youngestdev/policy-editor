import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import NavBar from "./components/NavBar/NavBar";
import PolicyForm from "./components/Policies/Form";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Policy from "./components/Policies/Policy";
import GitHubAuth from "./components/Authentication/GitHub";

function App() {
  return (
    <>
      <Box p={4}>
        <PolicyForm />
      </Box>
    </>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/policy/:name" element={<Policy />} />
          <Route path="/login" element={<GitHubAuth />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
