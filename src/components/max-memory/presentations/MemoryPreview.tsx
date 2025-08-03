import { FC } from "react";
import { MEMORY_OPTIONS } from "../constants";
import { MemoryPreviewProps } from "../types";

export const MemoryPreview: FC<MemoryPreviewProps> = ({
  selectedValue,
  totalMemory = 16,
}) => {
  const selectedOption = MEMORY_OPTIONS.find(
    (option) => option.value === selectedValue
  );

  if (!selectedOption) {
    return (
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <p className="text-base-content/60">
            Select a memory option to see preview
          </p>
        </div>
      </div>
    );
  }

  const usedMemory =
    Math.round(((totalMemory * selectedOption.value) / 100) * 10) / 10;
  const availableMemory = Math.round((totalMemory - usedMemory) * 10) / 10;

  const getProgressColor = () => {
    if (selectedOption.value <= 50) return "progress-success";
    if (selectedOption.value <= 70) return "progress-warning";
    return "progress-error";
  };

  const getBadgeColor = () => {
    if (selectedOption.value <= 50) return "badge-success";
    if (selectedOption.value <= 70) return "badge-warning";
    return "badge-error";
  };

  const getRecommendation = () => {
    if (selectedOption.value <= 50)
      return "Conservative setting - ideal for general use with other applications running.";
    if (selectedOption.value <= 70)
      return "Balanced setting - good performance while leaving memory for system operations.";
    return "High performance setting - maximum AI performance but may impact other applications.";
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title text-lg">Memory Usage Preview</h3>
          <div className={`badge ${getBadgeColor()} badge-lg font-semibold`}>
            {selectedOption.label}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="stat place-items-center">
              <div className="stat-title text-xs">Total Memory</div>
              <div className="stat-value text-sm">{totalMemory} GB</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title text-xs">AI Usage</div>
              <div>{usedMemory} GB</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title text-xs">Available</div>
              <div className="stat-value text-sm">{availableMemory} GB</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memory Allocation</span>
              <span className="font-semibold">{selectedOption.label}</span>
            </div>
            <progress
              className={`progress ${getProgressColor()} w-full h-3`}
              value={selectedOption.value}
              max="100"
            />
          </div>

          <div className="alert bg-base-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h4 className="font-semibold">Recommendation</h4>
              <p className="text-sm">{getRecommendation()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
