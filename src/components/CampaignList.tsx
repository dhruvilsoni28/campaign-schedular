import React from "react";
import { Campaign } from "../App";

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
}

const getNextActivation = (schedule: { day: string; startTime: string }[]) => {
  if (!schedule.length) return "No upcoming activation";

  const today = new Date();
  const currentDayIndex = today.getDay();
  const currentTime = today.getHours() * 60 + today.getMinutes(); // Convert to minutes

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    schedule.reduce<{ nextActivation: string | null; minDiff: number }>(
      (acc, { day, startTime }) => {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const scheduleTime = startHour * 60 + startMinute; // Convert to minutes

        const scheduleDayIndex = daysOfWeek.findIndex((d) => d === day);

        let dayDiff = scheduleDayIndex - currentDayIndex + 1;

        if (dayDiff < 0) dayDiff += 7; // Wrap around to next week

        const totalDiff = dayDiff * 1440 + (scheduleTime - currentTime); // Convert to total minutes
        return totalDiff > 0 && totalDiff < acc.minDiff
          ? { nextActivation: `${day}, ${startTime}`, minDiff: totalDiff }
          : acc;
      },
      { nextActivation: null, minDiff: Infinity }
    ).nextActivation || "No upcoming activation"
  );
};

const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {campaigns && campaigns.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white p-4 rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-semibold">{campaign.type}</h3>
              <p className="text-gray-500">Start: {campaign.startDate}</p>
              <p className="text-gray-500">End: {campaign.endDate}</p>
              <p className="text-blue-600 font-semibold">
                Next Activation: {getNextActivation(campaign.schedule)}
              </p>
              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => onEdit(campaign)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(campaign.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No Campaigns Scheduled Yet.
        </div>
      )}
    </>
  );
};

export default CampaignList;
