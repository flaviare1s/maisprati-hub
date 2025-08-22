import { FaWhatsapp } from "react-icons/fa";
import { MdGroupAdd } from "react-icons/md";

export const NoTeamList = ({ heroes, handleStartChat, handleSendInvite }) => {
  return (
    <div>
      <div className="mb-4 text-center">
        <p className="text-gray-muted">
          Conecte-se com outros hérois e forme sua equipe dos sonhos!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="bg-gradient-to-r from-light to-blue-50 border rounded-lg p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={hero.avatar}
                alt={hero.codename}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{hero.codename}</h4>
                <p className="text-sm text-blue-logo">{hero.specialty}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${hero.status === "looking"
                    ? "bg-green-400"
                    : hero.status === "available"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
              ></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStartChat(hero.whatsapp)}
                className="flex items-center gap-2 bg-green-500 text-light py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors justify-center cursor-pointer"
              >
                <FaWhatsapp />
                WhatsApp
              </button>
              <button
                onClick={() => handleSendInvite()}
                className="flex items-center gap-2 bg-blue-logo text-light py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <MdGroupAdd />
                Convidar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
