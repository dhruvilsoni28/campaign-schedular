import React, { useState, useEffect } from "react";
import { Campaign } from "../App";

interface CampaignFormProps {
  onAddCampaign: (campaign: Campaign) => void;
  onEditCampaign: (campaign: Campaign) => void;
  editingCampaign: Campaign | null;
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CampaignForm: React.FC<CampaignFormProps> = ({
  onAddCampaign,
  onEditCampaign,
  editingCampaign,
}) => {
  const [formData, setFormData] = useState<Campaign>({
    id: editingCampaign ? editingCampaign.id : Date.now(),
    type: editingCampaign ? editingCampaign.type : "",
    startDate: editingCampaign ? editingCampaign.startDate : "",
    endDate: editingCampaign ? editingCampaign.endDate : "",
    schedule: editingCampaign ? editingCampaign.schedule : [],
  });

  const [errors, setErrors] = useState<{
    type?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [scheduleErrors, setScheduleErrors] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    if (editingCampaign) {
      setFormData(editingCampaign);
    }
  }, [editingCampaign]);

  const validateForm = () => {
    const newErrors: { type?: string; startDate?: string; endDate?: string } =
      {};
    if (!formData.type) newErrors.type = "Campaign type is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.startDate = "Start date cannot be after end date.";
      newErrors.endDate = "End date cannot be before start date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSchedule = () => {
    const newScheduleErrors: { [key: number]: string } = {};
    formData.schedule.forEach((slot, index) => {
      const duplicate = formData.schedule.find(
        (s, i) =>
          i !== index && s.day === slot.day && s.startTime === slot.startTime
      );
      if (duplicate) {
        newScheduleErrors[
          index
        ] = `Duplicate schedule on ${slot.day} at ${slot.startTime}`;
      }
    });
    setScheduleErrors(newScheduleErrors);
    return Object.keys(newScheduleErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: "", startTime: "", endTime: "" }],
    });
  };

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: updatedSchedule });
    validateSchedule();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !validateSchedule()) return;

    if (editingCampaign) {
      onEditCampaign(formData);
    } else {
      onAddCampaign(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Campaign Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`mt-1 block w-full border p-2 rounded ${
            errors.type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Type</option>
          <option value="Cost per Order">Cost per Order</option>
          <option value="Cost per Click">Cost per Click</option>
          <option value="Buy One Get One">Buy One Get One</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`mt-1 block w-full border p-2 rounded ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`mt-1 block w-full border p-2 rounded ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Campaign Schedule</label>
        {formData.schedule.map((slot, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <select
              value={slot.day}
              onChange={(e) =>
                handleScheduleChange(index, "day", e.target.value)
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Day</option>
              {weekdays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) =>
                handleScheduleChange(index, "startTime", e.target.value)
              }
              className={`border p-2 rounded flex-1 ${
                scheduleErrors[index] ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) =>
                handleScheduleChange(index, "endTime", e.target.value)
              }
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  schedule: formData.schedule.filter((_, i) => i !== index),
                })
              }
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        {Object.keys(scheduleErrors).length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            Fix duplicate schedule conflicts
          </p>
        )}
        <button
          type="button"
          onClick={handleAddSchedule}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          + Add Schedule
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        {editingCampaign ? "Update Campaign" : "Create Campaign"}
      </button>
    </form>
  );
};

export default CampaignForm;
