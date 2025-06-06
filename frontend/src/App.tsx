
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.tsx";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import AlbumPage from "./pages/AlbumPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import { Toaster } from "react-hot-toast";
import NotfoundPage from "./pages/NotfoundPage.tsx";
import SearchPage from "@/pages/SearchPage.tsx";
import LikedSongsPage from "@/components/LikedSongsPage.tsx";

function App() {

  return (
    <>
      <Routes>
        <Route path="/sso-callback"
          element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>

          <Route path="/" element={<HomePage />} />

          <Route path="/chat" element={<ChatPage />} />
            <Route path="/search" element={<SearchPage />} />

            <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/liked-songs" element={<LikedSongsPage />} />

          <Route path="*" element={ <NotfoundPage/>} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
