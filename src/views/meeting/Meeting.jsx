import { useState } from "react";
import { Box, Button } from "@mui/material";
import PageHeader from "../../layouts/main/components/PageHeader";
import TabSwitcher from "./TabSwitcher";
import MeetingCard from "./MeetingCard";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import ScheduleMeetingForm from "./ScheduleMeetingForm";
const Meeting = () => {
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <PageHeader
        title="Meetings"
        subtitle="Schedule and manage your tutoring meetings"
        buttonText="Schedule Meeting"
        onButtonClick={() => setOpen(true)}
      />

      <TabSwitcher value={tab} onChange={setTab} />

      {tab === "past" && (
        <MeetingCard
          title="Academic Progress Review"
          date="Feb 9, 2026"
          time="10:00 AM • 30 minutes"
          tutor="Dr. Sarah Brown"
          status="Completed"
        />
      )}

      <CustomDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule New Meeting"
        actions={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained">Schedule Meeting</Button>
          </>
        }
      >
        <ScheduleMeetingForm />
      </CustomDialog>
    </Box>
  );
};

export default Meeting;
