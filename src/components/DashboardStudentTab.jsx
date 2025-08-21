export const DashboardStudentTab = ({ icon, title, activeTab, setActiveTab }) => {
  return (
    <button
      onClick={() => setActiveTab(title.toLowerCase())}
      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
        activeTab === title.toLowerCase()
          ? "border-blue-logo text-blue-logo"
          : "border-transparent text-gray-muted"
      }`}
    >
      { icon }
      { title }
    </button>
  );
};
