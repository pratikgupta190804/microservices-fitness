import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { FaDumbbell } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const Navbar = ({ onLogout }) => {
  return (
    <AppBar position="sticky" sx={{ mb: 3, bgcolor: "#1976d2" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <FaDumbbell style={{ fontSize: "2rem", marginRight: "12px" }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            FitTrack Pro
          </Typography>
          <Button
            color="inherit"
            onClick={onLogout}
            startIcon={<MdLogout />}
            sx={{
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
