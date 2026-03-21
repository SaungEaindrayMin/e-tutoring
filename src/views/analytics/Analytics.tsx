import { Box, Stack } from "@mui/material";
import StatsCards from "./StatsCards";
import AnalyticsTabs from "./AnalyticsTabs";
import { useEffect, useState } from "react";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

type StatsData = {
  totalVisit: number;
  uniquePages: number;
  browsers: number;
};

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

type TablePagination = {
  page: number;
  totalPages: number;
};

const Analytics = () => {
  const config = new Configuration();
  const dataService = new DataServices();
  const pageSize = 10;

  const [statsData, setStatsData] = useState<StatsData>({
    totalVisit: 0,
    uniquePages: 0,
    browsers: 0,
  });
  const [detailsData, setDetailsData] = useState<DetailRow[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
  const [detailsPagination, setDetailsPagination] = useState<TablePagination>({
    page: 1,
    totalPages: 1,
  });
  const [leaderboardPagination, setLeaderboardPagination] =
    useState<TablePagination>({
      page: 1,
      totalPages: 1,
    });
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [detailsError, setDetailsError] = useState("");
  const [leaderboardError, setLeaderboardError] = useState("");

  const toNumber = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getFirstValue = (source: any, keys: string[]) => {
    if (!source || typeof source !== "object") return undefined;
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null) {
        return source[key];
      }
    }
    return undefined;
  };

  const normalizeRole = (role: unknown) => {
    if (typeof role !== "string") return "-";
    const cleanRole = role.trim();
    if (!cleanRole) return "-";
    return cleanRole.charAt(0).toUpperCase() + cleanRole.slice(1).toLowerCase();
  };

  const unwrapPayload = (response: any) => {
    if (!response || typeof response !== "object") return null;
    if ("data" in response) return response.data;
    return response;
  };

  const normalizePagination = (
    pagination: any,
    fallbackPage: number,
  ): TablePagination => {
    const page = toNumber(
      getFirstValue(pagination, ["page", "currentPage", "current_page"]) ??
        fallbackPage,
    );
    const totalPages = toNumber(
      getFirstValue(pagination, ["totalPages", "total_pages", "pages"]) ?? 1,
    );

    return {
      page: page > 0 ? page : fallbackPage,
      totalPages: totalPages > 0 ? totalPages : 1,
    };
  };

  const normalizeStats = (payload: any): StatsData => {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return {
        totalVisit: 0,
        uniquePages: 0,
        browsers: 0,
      };
    }

    return {
      totalVisit: toNumber(
        getFirstValue(payload, [
          "totalActivities",
          "total_activities",
          "totalVisit",
          "totalVisits",
          "total_visit",
          "total_visits",
          "visits",
          "total",
        ]) ?? 0,
      ),
      uniquePages: toNumber(
        getFirstValue(payload, [
          "uniquePageCount",
          "unique_page_count",
          "uniquePages",
          "unique_pages",
          "totalPages",
          "total_pages",
          "pages",
          "pageCount",
          "page_count",
        ]) ?? 0,
      ),
      browsers: toNumber(
        getFirstValue(payload, [
          "uniqueBrowserCount",
          "unique_browser_count",
          "browsers",
          "totalBrowsers",
          "total_browsers",
          "browserCount",
          "browser_count",
          "browserUsed",
          "browser_used",
        ]) ?? 0,
      ),
    };
  };

  const normalizeDetails = (payload: any): DetailRow[] => {
    const rows = Array.isArray(payload)
      ? payload
      : payload?.data ||
        payload?.result ||
        payload?.details ||
        payload?.items ||
        payload?.rows ||
        payload?.list ||
        [];

    if (!Array.isArray(rows)) return [];

    return rows.map((item: any) => ({
      page:
        getFirstValue(item, [
          "page",
          "pageName",
          "page_name",
          "route",
          "path",
        ]) || "-",
      browser:
        getFirstValue(item, [
          "browser",
          "browserName",
          "browser_name",
          "userAgentName",
          "user_agent_name",
        ]) || "-",
      visits: toNumber(
        getFirstValue(item, [
          "activityCount",
          "activity_count",
          "visits",
          "totalVisits",
          "total_visits",
          "count",
          "total",
        ]) ?? 0,
      ),
    }));
  };

  const normalizeLeaderboard = (payload: any): LeaderboardRow[] => {
    const rows = Array.isArray(payload)
      ? payload
      : payload?.data ||
        payload?.result ||
        payload?.leaderboard ||
        payload?.users ||
        payload?.items ||
        payload?.rows ||
        payload?.list ||
        [];

    if (!Array.isArray(rows)) return [];

    return rows.map((item: any) => ({
      rank: toNumber(getFirstValue(item, ["rank", "position"])),
      name:
        getFirstValue(item, [
          "name",
          "userName",
          "user_name",
          "username",
          "fullName",
          "full_name",
        ]) ||
        item?.user?.name ||
        "-",
      email:
        getFirstValue(item, ["email", "userEmail", "user_email"]) ||
        item?.user?.email ||
        "-",
      role: normalizeRole(
        getFirstValue(item, ["role", "userRole", "user_role"]) ||
          item?.user?.role,
      ),
      visits: toNumber(
        getFirstValue(item, [
          "visits",
          "totalVisits",
          "total_visits",
          "count",
          "total",
        ]) ?? 0,
      ),
    }));
  };

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const statsRes = await dataService.retrieve(
          config.SERVICE_NAME,
          `${config.SERVICE_USER_ACTIVITY}/stats`,
        );
        setStatsData(normalizeStats(unwrapPayload(statsRes)));
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setDetailsLoading(true);
      setDetailsError("");
      try {
        const detailsRes = await dataService.retrieve(
          config.SERVICE_NAME,
          `${config.SERVICE_USER_ACTIVITY}/details?page=${detailsPagination.page}&limit=${pageSize}`,
        );
        const detailsPayload = unwrapPayload(detailsRes);
        setDetailsData(normalizeDetails(detailsPayload));
        setDetailsPagination((prev) =>
          normalizePagination(detailsPayload?.pagination, prev.page),
        );

        if (detailsRes?.status === "error" && detailsRes?.message) {
          setDetailsError(detailsRes.message);
        }
      } catch (err) {
        console.error("Failed to fetch details:", err);
        setDetailsError("Failed to load detail statistics.");
        setDetailsData([]);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [detailsPagination.page]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true);
      setLeaderboardError("");
      try {
        const leaderboardRes = await dataService.retrieve(
          config.SERVICE_NAME,
          `${config.SERVICE_USER_ACTIVITY}/leaderboard?page=${leaderboardPagination.page}&limit=${pageSize}`,
        );
        const leaderboardPayload = unwrapPayload(leaderboardRes);
        setLeaderboardData(normalizeLeaderboard(leaderboardPayload));
        setLeaderboardPagination((prev) =>
          normalizePagination(leaderboardPayload?.pagination, prev.page),
        );

        if (leaderboardRes?.status === "error" && leaderboardRes?.message) {
          setLeaderboardError(leaderboardRes.message);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setLeaderboardError("Failed to load leaderboard.");
        setLeaderboardData([]);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardPagination.page]);

  return (
    <Box>
      <Stack spacing={3}>
        <StatsCards data={statsData} loading={statsLoading} />
        <AnalyticsTabs
          detailsData={detailsData}
          leaderboardData={leaderboardData}
          detailsLoading={detailsLoading}
          leaderboardLoading={leaderboardLoading}
          detailsError={detailsError}
          leaderboardError={leaderboardError}
          detailsPage={detailsPagination.page}
          detailsTotalPages={detailsPagination.totalPages}
          leaderboardPage={leaderboardPagination.page}
          leaderboardTotalPages={leaderboardPagination.totalPages}
          onDetailsPageChange={(page) =>
            setDetailsPagination((prev) => ({ ...prev, page }))
          }
          onLeaderboardPageChange={(page) =>
            setLeaderboardPagination((prev) => ({ ...prev, page }))
          }
        />
      </Stack>
    </Box>
  );
};

export default Analytics;
