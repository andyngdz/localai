import { FC } from "react";

export const GpuDetectionCpuModeOnly: FC = () => {
  return (
    <div className="rounded-md">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium">CPU Mode Only</h3>
          <div className="mt-2 text-sm">
            <p>
              LocalAI will run on CPU. This will be slower but still functional.
              Consider installing CUDA drivers for better performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
