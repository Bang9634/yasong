export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}분 ${secs}초`;
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};
