import React from "react";
import { Campaign } from "../App";

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
}

const getNextActivation = (
  schedule: { day: string; startTime: string }[],
  startDate: string,
  endDate: string
) => {
  if (!schedule.length) return "No upcoming activation";

  // Parse the start date
  const startDateObj = new Date(startDate);

  // Validate start date
  if (isNaN(startDateObj.getTime())) {
    throw new Error("Invalid start date");
  }

  const currentDayIndex = startDateObj.getDay();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const nextActive = schedule.reduce<{
    day: string;
    startTime: string;
    dayDiff: number;
  } | null>((acc, { day, startTime }) => {
    const scheduleDayIndex = daysOfWeek.findIndex((d) => d === day);

    let dayDiff = scheduleDayIndex - currentDayIndex;

    if (dayDiff <= 0) {
      dayDiff += 7;
    }

    if (!acc || dayDiff < acc.dayDiff) {
      return { day, startTime, dayDiff };
    }

    return acc;
  }, null);

  if (!nextActive) {
    return "No Upcoming activation";
  }

  // Calculate the exact date of the next activation
  const nextActivationDate = new Date(startDateObj);
  nextActivationDate.setDate(startDateObj.getDate() + nextActive.dayDiff);

  // Check if the next activation date is within the end date
  const endDateObj = new Date(endDate);
  if (nextActivationDate > endDateObj) {
    return "No Upcoming activation";
  }

  // Format the date as YYYY-MM-DD
  const formattedDate = nextActivationDate.toISOString().split("T")[0];

  // Return the full activation details
  return `${nextActive.day},${formattedDate},${nextActive.startTime}`;
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
                Next Activation:{" "}
                {getNextActivation(
                  campaign.schedule,
                  campaign.startDate,
                  campaign.endDate
                )}
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
