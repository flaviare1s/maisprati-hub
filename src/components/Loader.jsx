export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light w-screen loader">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-logo border-t-orange-logo rounded-full animate-spin" />
      </div>
    </div>
  );
};
