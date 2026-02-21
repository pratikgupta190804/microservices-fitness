import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Chip,
  CardActionArea,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getActivities } from "../services/api";
import { FaRunning, FaWalking, FaBicycle, FaSwimmer } from "react-icons/fa";
import { MdTimer, MdLocalFireDepartment } from "react-icons/md";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const activityConfig = {
    RUNNING: { icon: FaRunning, color: "#2196f3", bg: "#e3f2fd" },
    WALKING: { icon: FaWalking, color: "#4caf50", bg: "#e8f5e9" },
    CYCLING: { icon: FaBicycle, color: "#ff9800", bg: "#fff3e0" },
    SWIMMING: { icon: FaSwimmer, color: "#00bcd4", bg: "#e0f7fa" },
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Card sx={{ mt: 3, p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No activities logged yet. Start tracking your fitness journey!
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Your Activities
      </Typography>
      <Grid container spacing={3}>
        {activities.map((activity) => {
          const config =
            activityConfig[activity.type] || activityConfig.RUNNING;
          const Icon = config.icon;

          return (
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/activities/${activity.id}`, { state: { activity } })}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          bgcolor: config.bg,
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Icon
                          style={{ color: config.color, fontSize: "1.5rem" }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ ml: 1, fontWeight: 600, color: config.color }}
                        >
                          {activity.type}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <MdTimer style={{ marginRight: 8, color: "#666" }} />
                        <Typography variant="body1" color="text.secondary">
                          <strong>{activity.duration}</strong> minutes
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <MdLocalFireDepartment
                          style={{ marginRight: 8, color: "#ff5722" }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          <strong>{activity.caloriesBurned}</strong> kcal
                        </Typography>
                      </Box>
                    </Box>

                    {activity.createdAt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 2 }}
                      >
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ActivityList;
