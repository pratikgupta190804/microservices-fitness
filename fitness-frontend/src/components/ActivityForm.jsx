import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../services/api";
import { FaRunning, FaWalking, FaBicycle, FaSwimmer } from "react-icons/fa";
import { MdTimer, MdLocalFireDepartment, MdAdd } from "react-icons/md";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const activityIcons = {
    RUNNING: <FaRunning style={{ marginRight: 8 }} />,
    WALKING: <FaWalking style={{ marginRight: 8 }} />,
    CYCLING: <FaBicycle style={{ marginRight: 8 }} />,
    SWIMMING: <FaSwimmer style={{ marginRight: 8 }} />,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activity.duration || !activity.caloriesBurned) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await addActivity(activity);
      setSnackbar({
        open: true,
        message: "Activity added successfully!",
        severity: "success",
      });
      onActivityAdded();
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      console.error("Error submitting activity:", error);
      setSnackbar({
        open: true,
        message: "Failed to add activity",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", fontWeight: 600, mb: 3 }}
        >
          <MdAdd style={{ marginRight: 8 }} />
          Log New Activity
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="activity-type-label">Activity Type</InputLabel>
            <Select
              labelId="activity-type-label"
              label="Activity Type"
              value={activity.type}
              onChange={(e) =>
                setActivity({ ...activity, type: e.target.value })
              }
            >
              <MenuItem value="RUNNING">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {activityIcons.RUNNING} Running
                </Box>
              </MenuItem>
              <MenuItem value="WALKING">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {activityIcons.WALKING} Walking
                </Box>
              </MenuItem>
              <MenuItem value="CYCLING">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {activityIcons.CYCLING} Cycling
                </Box>
              </MenuItem>
              <MenuItem value="SWIMMING">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {activityIcons.SWIMMING} Swimming
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Duration"
            type="number"
            sx={{ mb: 2 }}
            value={activity.duration}
            onChange={(e) =>
              setActivity({ ...activity, duration: e.target.value })
            }
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdTimer />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">minutes</InputAdornment>
              ),
            }}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            sx={{ mb: 3 }}
            value={activity.caloriesBurned}
            onChange={(e) =>
              setActivity({ ...activity, caloriesBurned: e.target.value })
            }
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLocalFireDepartment style={{ color: "#ff5722" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">kcal</InputAdornment>
              ),
            }}
            inputProps={{ min: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={<MdAdd />}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {loading ? "Adding..." : "Add Activity"}
          </Button>
        </Box>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ActivityForm;
