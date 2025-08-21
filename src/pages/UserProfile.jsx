import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  getUserProfile, 
  getUserMissions, 
  getUserAchievements, 
  getUserStats,
  getUserRanking 
} from '../services/profile';
import { CustomLoader } from '../components/CustomLoader';

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [missions, setMissions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [ranking, setRanking] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        const [
          profileData,
          missionsData,
          achievementsData,
          statsData,
          rankingData
        ] = await Promise.all([
          getUserProfile(user.id),
          getUserMissions(user.id),
          getUserAchievements(user.id),
          getUserStats(user.id),
          getUserRanking(user.id)
        ]);

        setProfile(profileData);
        setMissions(missionsData);
        setAchievements(achievementsData);
        setStats(statsData);
        setRanking(rankingData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadUserData();
    }
  }, [user]);

  if (loading) {
    return <CustomLoader />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Perfil não encontrado
          </h2>
        </div>
      </div>
    );
  }

  const completedMissions = missions.filter(m => m.isCompleted);
  const inProgressMissions = missions.filter(m => m.isInProgress);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header do Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.codename}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Nv. {profile.gamification?.level || 1}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile.codename}
                </h1>
                <p className="text-blue-100 text-lg mb-2">
                  {profile.profile?.fullName}
                </p>
                <p className="text-blue-200 mb-4">
                  {profile.profile?.bio}
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="text-white text-sm">
                      🏆 {ranking.userPosition ? `#${ranking.userPosition}` : 'Sem rank'}
                    </span>
                  </div>
                  <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="text-white text-sm">
                      ⚡ {profile.gamification?.xp || 0} XP
                    </span>
                  </div>
                  <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="text-white text-sm">
                      🔥 {profile.gamification?.streak || 0} dias
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de Progresso XP */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Progresso para o próximo nível</span>
                <span>
                  {profile.gamification?.xp || 0} / {(profile.gamification?.xp || 0) + (profile.gamification?.xpToNextLevel || 250)} XP
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${((profile.gamification?.xp || 0) / ((profile.gamification?.xp || 0) + (profile.gamification?.xpToNextLevel || 250))) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Visão Geral', icon: '📊' },
                { id: 'missions', name: 'Missões', icon: '🎯' },
                { id: 'achievements', name: 'Conquistas', icon: '🏆' },
                { id: 'stats', name: 'Estatísticas', icon: '📈' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Aba Visão Geral */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Informações Pessoais
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Especialização:</strong> {profile.profile?.specialization}</p>
                    <p><strong>Experiência:</strong> {profile.profile?.experience}</p>
                    <p><strong>Localização:</strong> {profile.profile?.location}</p>
                    <p><strong>Turma:</strong> {profile.turma}</p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Progresso Atual
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Missões Concluídas:</strong> {completedMissions.length}</p>
                    <p><strong>Missões em Progresso:</strong> {inProgressMissions.length}</p>
                    <p><strong>Conquistas:</strong> {unlockedAchievements.length}</p>
                    <p><strong>Ranking Global:</strong> {ranking.userPosition ? `#${ranking.userPosition}` : 'Sem posição'}</p>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Habilidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.profile?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Aba Missões */}
            {activeTab === 'missions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Missões em Progresso
                  </h3>
                  {inProgressMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inProgressMissions.map((mission) => (
                        <div key={mission.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{mission.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {mission.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {mission.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Progresso: {mission.progress}/{mission.maxProgress}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                              +{mission.xpReward} XP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma missão em progresso.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Missões Concluídas
                  </h3>
                  {completedMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedMissions.map((mission) => (
                        <div key={mission.id} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{mission.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {mission.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {mission.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-600 font-medium">
                              ✅ Concluída
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              +{mission.xpReward} XP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma missão concluída ainda.</p>
                  )}
                </div>
              </div>
            )}

            {/* Aba Conquistas */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg p-4 ${
                      achievement.isUnlocked
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300'
                        : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        achievement.isUnlocked ? 'text-yellow-600' : 'text-gray-400'
                      }`}>
                        {achievement.isUnlocked ? '🏆 Desbloqueada' : '🔒 Bloqueada'}
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aba Estatísticas */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Atividade Social
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Posts Criados:</span>
                      <span className="font-semibold">{stats.postsCreated || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Respostas Dadas:</span>
                      <span className="font-semibold">{stats.repliesGiven || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Votos Úteis:</span>
                      <span className="font-semibold">{stats.helpfulVotes || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Produtividade
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Projetos Concluídos:</span>
                      <span className="font-semibold">{stats.projectsCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Code Reviews:</span>
                      <span className="font-semibold">{stats.codeReviews || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bugs Encontrados:</span>
                      <span className="font-semibold">{stats.bugsFound || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Liderança
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Pontos de Mentor:</span>
                      <span className="font-semibold">{stats.mentorPoints || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Convites Enviados:</span>
                      <span className="font-semibold">{stats.teamInvitesSent || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Convites Recebidos:</span>
                      <span className="font-semibold">{stats.teamInvitesReceived || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
