// import './App.css'
import { Routes, Route, Navigate } from "react-router";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Navbar from "./components/Navbar";
import { FaDumbbell } from "react-icons/fa";

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ActivityForm onActivityAdded={handleActivityAdded} />
      <ActivityList key={refreshKey} />
    </Container>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <>
      {!token ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              maxWidth: 400,
            }}
          >
            <FaDumbbell
              style={{ fontSize: "4rem", color: "#1976d2", marginBottom: 16 }}
            />
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, color: "#1976d2" }}
            >
              FitTrack Pro
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Track your fitness journey with AI-powered insights
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => logIn()}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
              }}
            >
              Login to Get Started
            </Button>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
          <Navbar onLogout={logOut} />
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/activities" replace />
                ) : (
                  <Container sx={{ textAlign: "center", mt: 10 }}>
                    <Typography variant="h5">
                      Please log in to view activities
                    </Typography>
                  </Container>
                )
              }
            />
          </Routes>
        </Box>
      )}
    </>
  );
}

export default App;
