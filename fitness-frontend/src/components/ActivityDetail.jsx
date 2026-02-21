import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { getActivityDetail } from "../services/api";
import { FaRunning, FaWalking, FaBicycle, FaSwimmer } from "react-icons/fa";
import {
  MdTimer,
  MdLocalFireDepartment,
  MdArrowBack,
  MdLightbulb,
  MdTrendingUp,
  MdSecurity,
  MdCalendarToday,
} from "react-icons/md";

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedActivity = location.state?.activity;

  const [activity, setActivity] = useState(passedActivity || null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(!passedActivity);

  const activityConfig = {
    RUNNING: { icon: FaRunning, color: "#2196f3", bg: "#e3f2fd" },
    WALKING: { icon: FaWalking, color: "#4caf50", bg: "#e8f5e9" },
    CYCLING: { icon: FaBicycle, color: "#ff9800", bg: "#fff3e0" },
    SWIMMING: { icon: FaSwimmer, color: "#00bcd4", bg: "#e0f7fa" },
  };

  const parseRecommendation = (text) => {
    if (!text) return [];

    // Split by common section headers
    const sectionPattern =
      /(Overall|Pace|Heart Rate|Calories):/gi;
    const parts = text.split(sectionPattern);

    const sections = [];
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        sections.push({
          title: parts[i].trim(),
          content: parts[i + 1].trim(),
        });
      }
    }

    // If no sections found, return the whole text as one section
    if (sections.length === 0) {
      return [{ title: null, content: text }];
    }

    return sections;
  };

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        if (!passedActivity) {
          setLoading(true);
        }
        const response = await getActivityDetail(id);

        // Merge passed activity data with API response
        // Use passed activity for basic fields, API response for recommendations
        const mergedActivity = {
          ...(passedActivity || {}),
          ...response.data,
          // Preserve basic fields from passed activity if they exist
          type: passedActivity?.type || response.data.type,
          duration: passedActivity?.duration || response.data.duration,
          caloriesBurned:
            passedActivity?.caloriesBurned || response.data.caloriesBurned,
          createdAt: passedActivity?.createdAt || response.data.createdAt,
        };

        setActivity(mergedActivity);
        setRecommendation(response.data.recommendation || response.data);
      } catch (error) {
        console.error("Error fetching activity detail:", error);
        // If API fails but we have passed activity, still show it
        if (passedActivity) {
          setActivity(passedActivity);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchActivityDetail();
  }, [id, passedActivity]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
        <Typography variant="h6" color="error">
          Activity not found
        </Typography>
      </Box>
    );
  }

  const config = activityConfig[activity.type] || activityConfig.RUNNING;
  const Icon = config.icon;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Button
        startIcon={<MdArrowBack />}
        onClick={() => navigate("/activities")}
        sx={{ mb: 2 }}
      >
        Back to Activities
      </Button>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              bgcolor: config.bg,
              p: 2,
              borderRadius: 2,
            }}
          >
            <Icon
              style={{ fontSize: "3rem", color: config.color, marginRight: 16 }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: config.color }}
              >
                {activity.type}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Activity Details
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MdTimer
                  style={{ fontSize: "1.5rem", marginRight: 8, color: "#666" }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Duration
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {activity.duration}{" "}
                <span style={{ fontSize: "1rem" }}>min</span>
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                bgcolor: "#fff3e0",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MdLocalFireDepartment
                  style={{
                    fontSize: "1.5rem",
                    marginRight: 8,
                    color: "#ff5722",
                  }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Calories Burned
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {activity.caloriesBurned}{" "}
                <span style={{ fontSize: "1rem" }}>kcal</span>
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                bgcolor: "#e8f5e9",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MdCalendarToday
                  style={{
                    fontSize: "1.5rem",
                    marginRight: 8,
                    color: "#4caf50",
                  }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {new Date(activity.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      {recommendation && (
        <Card elevation={3}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                mb: 3,
              }}
            >
              <MdLightbulb style={{ marginRight: 8, color: "#ffc107" }} />
              AI-Powered Recommendations
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2, mb: 3 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Analysis
              </Typography>

              {parseRecommendation(activity.recommendation).map(
                (section, index) => (
                  <Box key={index} sx={{ mb: section.title ? 2.5 : 0 }}>
                    {section.title && (
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: "#1976d2",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 4,
                            height: 16,
                            bgcolor: "#1976d2",
                            borderRadius: 1,
                            mr: 1,
                          }}
                        />
                        {section.title}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        lineHeight: 1.8,
                        color: "text.primary",
                        pl: section.title ? 2 : 0,
                        textAlign: "justify",
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Box>
                ),
              )}
            </Paper>

            {activity?.improvements && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    <MdTrendingUp
                      style={{ marginRight: 8, color: "#2196f3" }}
                    />
                    Improvements
                  </Typography>
                  {Array.isArray(activity.improvements) ? (
                    activity.improvements.map((improvement, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1.5,
                          pl: 2,
                        }}
                      >
                        <Typography
                          sx={{ mr: 1, color: "#2196f3", fontWeight: 600 }}
                        >
                          •
                        </Typography>
                        <Typography sx={{ lineHeight: 1.6 }}>
                          {improvement}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ pl: 2 }}>
                      {activity.improvements}
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {activity?.suggestions && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    <MdLightbulb style={{ marginRight: 8, color: "#ffc107" }} />
                    Suggestions
                  </Typography>
                  {Array.isArray(activity.suggestions) ? (
                    activity.suggestions.map((suggestion, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1.5,
                          pl: 2,
                        }}
                      >
                        <Typography
                          sx={{ mr: 1, color: "#ffc107", fontWeight: 600 }}
                        >
                          •
                        </Typography>
                        <Typography sx={{ lineHeight: 1.6 }}>
                          {suggestion}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ pl: 2 }}>
                      {activity.suggestions}
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {activity?.safety && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    <MdSecurity style={{ marginRight: 8, color: "#f44336" }} />
                    Safety Guidelines
                  </Typography>
                  {Array.isArray(activity.safety) ? (
                    activity.safety.map((safety, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1.5,
                          pl: 2,
                        }}
                      >
                        <Typography
                          sx={{ mr: 1, color: "#f44336", fontWeight: 600 }}
                        >
                          •
                        </Typography>
                        <Typography sx={{ lineHeight: 1.6 }}>
                          {safety}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ pl: 2 }}>{activity.safety}</Typography>
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
