import React from 'react';

export const Status = {
  Initial: 0,
  Hide: 1,
  Measure: 2,
  Show: 3,
};

export const useStatusHelper = (initialStatus = Status.Initial) => {
  const [statusRef, setStatus] = React.useState<{ current: number }>({
    current: initialStatus,
  });

  const is = (status: number) => statusRef.current === status;

  const set = (status: number, update?: boolean) => {
    if (update) {
      return setStatus({ current: status });
    }
    statusRef.current = status;
  };

  return [is, set] as const;
};
