export const DashboardTab = ({ icon, title, activeTab, setActiveTab }) => {
  const tabKey = title.toLowerCase();

  return (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === tabKey
          ? "border-blue-logo text-blue-logo"
          : "border-transparent text-gray-muted"
        }`}
    >
      {icon}
      {title}
    </button>
  );
};
