"use client";

import { DateTimeField, useFormFields, useFormModified } from "@payloadcms/ui";
import { DateFieldProps } from "payload";
import React, { useEffect, useState } from "react";

export const CustomPublishOnField: React.FC<DateFieldProps> = (props) => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }));
  const isFormModified = useFormModified();

  const status = fields?._status?.value;
  const publishOn = fields?.publishOn?.value;

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publishOn && isFormModified) {
      const targetDate = new Date(String(publishOn)).getTime();

      if (targetDate < Date.now()) {
        setError("The publish date must be in the future.");
        setTimeRemaining(null);
      } else {
        setError(null);

        const updateTimeRemaining = () => {
          const now = Date.now();
          const timeDifference = targetDate - now;

          if (timeDifference <= 0) {
            setTimeRemaining("Published");
          } else {
            const days = Math.floor(timeDifference / (1000 * 3600 * 24));
            const hours = Math.floor(
              (timeDifference % (1000 * 3600 * 24)) / (1000 * 3600)
            );
            const minutes = Math.floor(
              (timeDifference % (1000 * 3600)) / (1000 * 60)
            );
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          }
        };

        // Initial call to set the time remaining
        updateTimeRemaining();

        // Update every second
        const interval = setInterval(updateTimeRemaining, 1000);

        // Clear interval on component unmount or dependencies change
        return () => clearInterval(interval);
      }
    } else {
      setTimeRemaining(null);
      setError(null);
    }
  }, [isFormModified, publishOn, status]);

  return (
    <div>
      <DateTimeField
        {...props}
        readOnly={
          Boolean(publishOn) && status === "published" && !isFormModified
        }
      />
      {error && (
        <div
          className="error-message"
          style={{ color: "red", paddingTop: "3px" }}
        >
          {error}
        </div>
      )}
      {timeRemaining && !error && (
        <div className="time-remaining" style={{ paddingTop: "3px" }}>
          Time Remaining: {timeRemaining}
        </div>
      )}
    </div>
  );
};
