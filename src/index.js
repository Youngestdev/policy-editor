import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import NavBar from "./components/NavBar/NavBar";
import PolicyForm from "./components/Policies/Form";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Policy from "./components/Policies/Policy";

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
          <Route path=":name" element={<Policy />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
