import { Box, Card } from "@mui/material";
import { useState } from "react";
import MostActiveUsersTable from "./MostActiveUsersTable";
import DetailedStatsTable from "./DetailedStatsTable";

type DetailRow = {
  page: string;
  browser: string;
  visits: number;
};

type LeaderboardRow = {
  rank?: number;
  name: string;
  email: string;
  role: string;
  visits: number;
};

type AnalyticsTabsProps = {
  detailsData: DetailRow[];
  leaderboardData: LeaderboardRow[];
  detailsLoading: boolean;
  leaderboardLoading: boolean;
  detailsError?: string;
  leaderboardError?: string;
  detailsPage: number;
  detailsTotalPages: number;
  leaderboardPage: number;
  leaderboardTotalPages: number;
  onDetailsPageChange: (page: number) => void;
  onLeaderboardPageChange: (page: number) => void;
};

const AnalyticsTabs = ({
  detailsData,
  leaderboardData,
  detailsLoading,
  leaderboardLoading,
  detailsError,
  leaderboardError,
  detailsPage,
  detailsTotalPages,
  leaderboardPage,
  leaderboardTotalPages,
  onDetailsPageChange,
  onLeaderboardPageChange,
}: AnalyticsTabsProps) => {
  const [tab, setTab] = useState("users");

  return (
    <Card
      sx={{
        p: 3,
        border: 0.5,
        borderColor: "text.input",
        borderRadius: 0.5,
        boxShadow: "none",
      }}
    >
      {/* 🔥 Pill Tabs Container */}
      <Box
        sx={{
          display: "inline-flex",
          bgcolor: "background.switch",
          borderRadius: "999px",
          p: 0.5,
          mb: 3,
        }}
      >
        {/* Tab 1 */}
        <Box
          onClick={() => setTab("users")}
          sx={{
            p:1.5,
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "0.2s",
            bgcolor: tab === "users" ? "primary.dark" : "background.switch",
            color: tab === "users" ? "#fff" : "text.primary",
          }}
        >
          Most Active Users
        </Box>

        {/* Tab 2 */}
        <Box
          onClick={() => setTab("details")}
          sx={{
            p:1.5,
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "0.2s",
            bgcolor: tab === "details" ? "primary.dark" : "background.switch",
            color: tab === "details" ? "#fff" : "text.primary",
          }}
        >
          Detail Statistics
        </Box>
      </Box>

      {/* Content */}
      <Box>
        {tab === "users" ? (
          <MostActiveUsersTable
            data={leaderboardData}
            loading={leaderboardLoading}
            error={leaderboardError}
            page={leaderboardPage}
            totalPages={leaderboardTotalPages}
            onPageChange={onLeaderboardPageChange}
          />
        ) : (
          <DetailedStatsTable
            data={detailsData}
            loading={detailsLoading}
            error={detailsError}
            page={detailsPage}
            totalPages={detailsTotalPages}
            onPageChange={onDetailsPageChange}
          />
        )}
      </Box>
    </Card>
  );
};

export default AnalyticsTabs;
