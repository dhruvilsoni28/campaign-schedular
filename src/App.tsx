import React, { useState, useEffect } from "react";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";

export interface Campaign {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  schedule: { day: string; startTime: string; endTime: string }[];
}

const App: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    JSON.parse(localStorage.getItem("campaigns")!) || []
  );
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  const handleAddCampaign = (campaign: Campaign) => {
    setCampaigns([...campaigns, campaign]);
    setIsFormOpen(false);
  };

  const handleEditCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(
      campaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
    );
    setEditingCampaign(null);
    setIsFormOpen(false);
  };

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Campaign Scheduler</h1>
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add New Campaign
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <CampaignForm
              onAddCampaign={handleAddCampaign}
              onEditCampaign={handleEditCampaign}
              editingCampaign={editingCampaign}
            />
            <button
              onClick={() => setIsFormOpen(false)}
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mt-6">
        <CampaignList
          campaigns={campaigns}
          onEdit={(c) => {
            setEditingCampaign(c);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteCampaign}
        />
      </div>
    </div>
  );
};

export default App;
