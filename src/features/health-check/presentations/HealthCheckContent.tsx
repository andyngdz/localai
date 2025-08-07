import { FC, useMemo } from "react";

export interface HealthCheckContentProps {
  isHealthy: boolean;
}

export const HealthCheckContent: FC<HealthCheckContentProps> = ({
  isHealthy,
}) => {
  const children = useMemo(() => {
    if (isHealthy) {
      return (
        <div className="badge badge-success">
          <span>LocalAI backend is running and ready to use</span>
        </div>
      );
    }

    return (
      <div className="badge badge-error">
        <span>LocalAI backend is not running</span>
      </div>
    );
  }, [isHealthy]);

  return <div className="card-body items-center">{children}</div>;
};
