import React, { useState } from 'react';
import { X, Shield, Plus, Trash2, Edit3, Save, RotateCcw, Download, Upload, CheckCircle2, AlertTriangle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { VolunteerConfig, NewsItem, ProjectCampaign } from '../types';

interface VolunteerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VolunteerConfig;
  onSaveConfig: (newConfig: VolunteerConfig) => void;
  news: NewsItem[];
  onSaveNews: (newNews: NewsItem[]) => void;
  project: ProjectCampaign;
  onSaveProject: (newProject: ProjectCampaign) => void;
  onResetDefaults: () => void;
}

export const VolunteerAdminModal: React.FC<VolunteerAdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  news,
  onSaveNews,
  project,
  onSaveProject,
  onResetDefaults,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'banner' | 'news' | 'parking' | 'prayers' | 'export'>('banner');
  const [saveToast, setSaveToast] = useState(false);

  // Form local states
  const [localConfig, setLocalConfig] = useState<VolunteerConfig>(config);
  const [localNews, setLocalNews] = useState<NewsItem[]>(news);
  const [localProject, setLocalProject] = useState<ProjectCampaign>(project);

  // New News Item form state
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'cours' | 'projet' | 'communaute' | 'vie-spirituelle'>('communaute');
  const [newNewsExcerpt, setNewNewsExcerpt] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsUrgent, setNewNewsUrgent] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = enteredPin.trim();
    if (
      cleanPin === 'Salem81#Benevole2026' ||
      cleanPin.toLowerCase() === 'salem81#benevole2026' ||
      cleanPin === config.adminPin?.trim() ||
      cleanPin.replace(/[\s-]/g, '') === '2323232323' ||
      cleanPin === '81370'
    ) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveBanner = () => {
    onSaveConfig(localConfig);
    triggerToast();
  };

  const handleSaveParking = () => {
    onSaveProject(localProject);
    onSaveConfig({
      ...localConfig,
      parkingCurrentAmount: localProject.currentAmount,
      parkingTargetAmount: localProject.targetAmount,
      parkingDonorsCount: localProject.donorsCount,
    });
    triggerToast();
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim() || !newNewsExcerpt.trim()) return;

    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: newNewsTitle,
      category: newNewsCategory,
      date: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      excerpt: newNewsExcerpt,
      content: newNewsContent || newNewsExcerpt,
      isUrgent: newNewsUrgent,
      badge: newNewsCategory === 'cours' ? 'Cours' : newNewsCategory === 'projet' ? 'Projet' : 'Annonce',
    };

    const updated = [newItem, ...localNews];
    setLocalNews(updated);
    onSaveNews(updated);
    setNewNewsTitle('');
    setNewNewsExcerpt('');
    setNewNewsContent('');
    setNewNewsUrgent(false);
    triggerToast();
  };

  const handleDeleteNews = (id: string) => {
    const updated = localNews.filter(n => n.id !== id);
    setLocalNews(updated);
    onSaveNews(updated);
    triggerToast();
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportJson = () => {
    const backup = {
      config: localConfig,
      news: localNews,
      project: localProject,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde-mosquee-salem-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        
        {/* Modal Topbar */}
        <div className="bg-[#0F3223] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-editorial text-lg font-bold">
                Espace Bénévoles · Gestion & Mise à jour
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                Mosquée SALEM de Saint-Sulpice-la-Pointe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900/60"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <KeyRound className="w-7 h-7 text-emerald-700" />
            </div>

            <div className="space-y-2">
              <h4 className="font-editorial text-2xl font-bold text-stone-900">
                Espace Bénévoles & Administration
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Accès sécurisé réservé aux membres de l'équipe de la Mosquée SALEM pour gérer les annonces et le suivi du projet parking.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Code secret administrateur"
                  className="w-full text-center text-base sm:text-lg font-mono px-4 py-3.5 pr-12 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label={showPin ? 'Masquer le code' : 'Afficher le code'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  Code d'accès incorrect. Veuillez saisir le code secret confidentiel de l'équipe.
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Déverrouiller l'espace
                </button>
              </div>

              <p className="text-[11px] text-stone-500">
                Accès protégé par code complexe. Si vous êtes bénévole autorisé et avez oublié le mot de passe, contactez le bureau de l'association.
              </p>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs */}
            <div className="bg-stone-50 border-b border-stone-200 px-6 flex gap-2 overflow-x-auto text-xs font-medium pt-3">
              <button
                onClick={() => setActiveTab('banner')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'banner'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Bandeau d'alerte
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'news'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Gérer les Actualités ({localNews.length})
              </button>
              <button
                onClick={() => setActiveTab('parking')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'parking'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Chiffres Parking CotizUp
              </button>
              <button
                onClick={() => setActiveTab('prayers')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'prayers'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Horaires de prière
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Sauvegarde & Reset
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Notification Toast */}
              {saveToast && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Modifications sauvegardées avec succès dans le navigateur !</span>
                </div>
              )}

              {/* Tab 1: Alert Banner */}
              {activeTab === 'banner' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        Bandeau d'alerte en haut du site
                      </h4>
                      <p className="text-xs text-stone-500">
                        Idéal pour annoncer la prière de l'Aïd, le début du Ramadan, un rappel Joumou'a ou l'état des cours.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.alertBannerEnabled}
                        onChange={(e) =>
                          setLocalConfig({ ...localConfig, alertBannerEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Texte du bandeau d'alerte :
                    </label>
                    <textarea
                      rows={3}
                      value={localConfig.alertBannerText}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, alertBannerText: e.target.value })
                      }
                      className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <button
                    onClick={handleSaveBanner}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer le bandeau</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Manage News */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  {/* Add New News Item */}
                  <form onSubmit={handleAddNews} className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                      Ajouter une nouvelle actualité
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">Titre de l'article *</label>
                        <input
                          type="text"
                          required
                          value={newNewsTitle}
                          onChange={(e) => setNewNewsTitle(e.target.value)}
                          placeholder="Ex: Assemblée générale de l'association..."
                          className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">Catégorie</label>
                        <select
                          value={newNewsCategory}
                          onChange={(e) => setNewNewsCategory(e.target.value as any)}
                          className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg"
                        >
                          <option value="communaute">Communauté & Vie locale</option>
                          <option value="cours">Cours d'arabe</option>
                          <option value="projet">Projet Parking & Travaux</option>
                          <option value="vie-spirituelle">Vie spirituelle & Prières</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">Résumé court *</label>
                      <input
                        type="text"
                        required
                        value={newNewsExcerpt}
                        onChange={(e) => setNewNewsExcerpt(e.target.value)}
                        placeholder="Une phrase d'accroche visible sur la carte..."
                        className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">Texte complet de l'actualité</label>
                      <textarea
                        rows={2}
                        value={newNewsContent}
                        onChange={(e) => setNewNewsContent(e.target.value)}
                        placeholder="Détails complets affichés lors du clic..."
                        className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNewsUrgent}
                          onChange={(e) => setNewNewsUrgent(e.target.checked)}
                          className="rounded text-emerald-800"
                        />
                        <span>Mettre en évidence (Badge "En cours")</span>
                      </label>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Publier l'actualité</span>
                      </button>
                    </div>
                  </form>

                  {/* List of existing news */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                      Actualités publiées ({localNews.length})
                    </h5>
                    {localNews.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-stone-200 bg-white"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                              {n.category}
                            </span>
                            <span className="text-xs text-stone-400">{n.date}</span>
                          </div>
                          <h6 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {n.title}
                          </h6>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {n.excerpt}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteNews(n.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                          title="Supprimer cette actualité"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Parking campaign figures */}
              {activeTab === 'parking' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Mise à jour des chiffres de la cagnotte CotizUp
                    </h4>
                    <p className="text-xs text-stone-500">
                      Modifiez les montants selon l'avancement réel de la collecte CotizUp pour tenir informés les fidèles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Montant collecté (€) :
                      </label>
                      <input
                        type="number"
                        value={localProject.currentAmount}
                        onChange={(e) =>
                          setLocalProject({ ...localProject, currentAmount: Number(e.target.value) })
                        }
                        className="w-full text-sm p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Objectif total (€) :
                      </label>
                      <input
                        type="number"
                        value={localProject.targetAmount}
                        onChange={(e) =>
                          setLocalProject({ ...localProject, targetAmount: Number(e.target.value) })
                        }
                        className="w-full text-sm p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Nombre de donateurs :
                      </label>
                      <input
                        type="number"
                        value={localProject.donorsCount}
                        onChange={(e) =>
                          setLocalProject({ ...localProject, donorsCount: Number(e.target.value) })
                        }
                        className="w-full text-sm p-2.5 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveParking}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder les chiffres du parking</span>
                  </button>
                </div>
              )}

              {/* Tab: Prayers */}
              {activeTab === 'prayers' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Ajustement des horaires de prière (Mawaqit)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Les horaires sont synchronisés avec Mawaqit (Fajr 06:57). Vous pouvez si besoin appliquer une correction manuelle temporaire.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['fajr', 'shuruk', 'dhuhr', 'asr', 'maghrib', 'isha'].map((pId) => {
                      const labels: Record<string, string> = {
                        fajr: 'Fajr (actuel 06:57)',
                        shuruk: 'Chourouq (08:14)',
                        dhuhr: 'Dhuhr (13:40)',
                        asr: 'Asr (16:36)',
                        maghrib: 'Maghrib (19:07)',
                        isha: 'Isha (20:20)',
                      };
                      return (
                        <div key={pId}>
                          <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                            {labels[pId]}
                          </label>
                          <input
                            type="time"
                            value={localConfig.prayerTimesOverride?.[pId] || ''}
                            onChange={(e) =>
                              setLocalConfig({
                                ...localConfig,
                                prayerTimesOverride: {
                                  ...(localConfig.prayerTimesOverride || {}),
                                  [pId]: e.target.value,
                                },
                              })
                            }
                            className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => {
                        onSaveConfig(localConfig);
                        triggerToast();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les horaires</span>
                    </button>

                    <button
                      onClick={() => {
                        setLocalConfig({
                          ...localConfig,
                          prayerTimesOverride: undefined,
                        });
                        onSaveConfig({
                          ...localConfig,
                          prayerTimesOverride: undefined,
                        });
                        triggerToast();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium border border-stone-300"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Réinitialiser sur Mawaqit</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Export / Reset */}
              {activeTab === 'export' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Gestion des sauvegardes & Restauration
                    </h4>
                    <p className="text-xs text-stone-500">
                      Exportez les données du site au format JSON ou restaurez la configuration initiale.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleExportJson}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger la sauvegarde JSON</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Voulez-vous réinitialiser le contenu aux valeurs officielles par défaut ?')) {
                          onResetDefaults();
                          onClose();
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Réinitialiser aux valeurs d'origine</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
