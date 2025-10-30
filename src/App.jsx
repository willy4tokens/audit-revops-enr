import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Download } from 'lucide-react';

const AuditTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    processClarity: null, callbackOwner: '', callbackDelay: '', numRelances: '', documentationYes: null,
    leadsPerMonth: '', rdvRate: '', firstContactDelay: '', quoteDelay: '',
    installTeams: '', capacityDays: '', lostSalesYes: null,
    crmUsed: '', checklistsYes: null, autoRelanceYes: null, dashboardsYes: null,
    objective90Days: '', mainPriority: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('auditData');
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('auditData', JSON.stringify(formData));
  }, [formData]);

  const projectsData = [
    { name: "Lead Speed™", days: 1, category: "conversion", results: ["100% des leads taggés", "Rappel < 10 min", "Notification instantanée"] },
    { name: "Show-Up Engine™", days: 1, category: "conversion", results: ["+20–40% présence", "Confirmation auto", "Rappels 24h"] },
    { name: "Follow-Up Machine™", days: 1, category: "conversion", results: ["+30% réponses", "5 relances min", "Multicanal"] },
    { name: "Devis Fastlane™", days: 1, category: "conversion", results: ["< 48h", "Relances auto", "Vue centralisée"] },
    { name: "Pipeline Builder™", days: 2, category: "process", results: ["Pipeline clair", "Vues hot/lost", "100% doc"] },
    { name: "Procurement Flow™", days: 2, category: "process", results: ["Achats auto", "Alertes stock", "Suivi fournisseurs"] },
    { name: "Chantier Tracker™", days: 3, category: "process", results: ["Gestion complète", "Planning", "Dashboard"] },
    { name: "Client Journey ENR™", days: 3, category: "process", results: ["Parcours complet", "Handover auto", "Notifications"] },
    { name: "Director Dashboard™", days: 1, category: "pilotage", results: ["5 KPIs", "Reporting", "Suivi CA"] },
    { name: "Capacity Planner™", days: 2, category: "pilotage", results: ["Charge opt", "Planning", "Zéro surcharge"] },
    { name: "Finance Sync™", days: 2, category: "pilotage", results: ["Suivi paiement", "Alertes", "Sync CA"] },
    { name: "AI Setter™", days: 3, category: "ia", results: ["Qualification auto", "RDV auto", "+40%"] },
    { name: "Revive Database™", days: 1.5, category: "ia", results: ["Pipeline relancé", "Campaign", "+15-25%"] },
    { name: "Chatbot Qualif™", days: 2, category: "ia", results: ["Pré-qualif 24/7", "WhatsApp", "+5-8h"] }
  ];

  const sections = [
    { title: "Structure commerciale", questions: [
      { id: "processClarity", label: "Processus clair du lead à la pose ?", type: "yesno" },
      { id: "callbackOwner", label: "Qui rappelle les leads ?", type: "text" },
      { id: "callbackDelay", label: "Délai rappel (heures) ?", type: "number" },
      { id: "numRelances", label: "Nombre de relances par lead ?", type: "number" },
      { id: "documentationYes", label: "Documentation CRM complète ?", type: "yesno" }
    ]},
    { title: "Volume & vélocité", questions: [
      { id: "leadsPerMonth", label: "Volume leads/mois ?", type: "number" },
      { id: "rdvRate", label: "Taux de RDV (%) ?", type: "number" },
      { id: "firstContactDelay", label: "Délai 1er contact (heures) ?", type: "number" },
      { id: "quoteDelay", label: "Délai devis (jours) ?", type: "number" }
    ]},
    { title: "Capacité & opérations", questions: [
      { id: "installTeams", label: "Nombre équipes installation ?", type: "number" },
      { id: "capacityDays", label: "Charge remplie sur (jours) ?", type: "number" },
      { id: "lostSalesYes", label: "Perdez-vous des ventes faute de capacité ?", type: "yesno" }
    ]},
    { title: "Outils & discipline", questions: [
      { id: "crmUsed", label: "Quel CRM utilisez-vous ?", type: "text" },
      { id: "checklistsYes", label: "Checklists opérationnelles ?", type: "yesno" },
      { id: "autoRelanceYes", label: "Relances automatisées ?", type: "yesno" },
      { id: "dashboardsYes", label: "Dashboards de pilotage ?", type: "yesno" }
    ]},
    { title: "Objectif & urgence", questions: [
      { id: "objective90Days", label: "Objectif 90 jours ?", type: "text" },
      { id: "mainPriority", label: "Priorité la plus urgente ?", type: "text" }
    ]}
  ];

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const calculateRecommendations = () => {
    const recommendations = [];
    const callDelay = parseInt(formData.callbackDelay) || 0;
    const relances = parseInt(formData.numRelances) || 0;
    const quoteDelay = parseInt(formData.quoteDelay) || 0;
    const contactDelay = parseInt(formData.firstContactDelay) || 0;
    if (callDelay > 24 || !formData.processClarity) recommendations.push("Lead Speed™");
    if (relances < 5) recommendations.push("Follow-Up Machine™");
    if (quoteDelay > 2) recommendations.push("Devis Fastlane™");
    if (contactDelay > 6) recommendations.push("Show-Up Engine™");
    if (!formData.documentationYes || !formData.checklistsYes) recommendations.push("Pipeline Builder™");
    if (parseInt(formData.installTeams) > 1) recommendations.push("Chantier Tracker™");
    if (formData.lostSalesYes) {
      recommendations.push("Capacity Planner™");
      recommendations.push("Client Journey ENR™");
    }
    if (!formData.dashboardsYes) recommendations.push("Director Dashboard™");
    const leadVolume = parseInt(formData.leadsPerMonth) || 0;
    if (leadVolume > 100) recommendations.push("AI Setter™");
    if (!formData.autoRelanceYes && leadVolume > 50) recommendations.push("Revive Database™");
    if (parseInt(formData.installTeams) > 0) recommendations.push("Procurement Flow™");
    if (parseInt(formData.installTeams) > 1) recommendations.push("Finance Sync™");
    return [...new Set(recommendations)].slice(0, 8);
  };

  const generateInsights = () => {
    const insights = [];
    const dealValue = 5000;
    const callDelay = parseInt(formData.callbackDelay) || 999;
    const relances = parseInt(formData.numRelances) || 0;
    const quoteDelay = parseInt(formData.quoteDelay) || 999;
    const leadsPerMonth = parseInt(formData.leadsPerMonth) || 0;
    const rdvRate = parseInt(formData.rdvRate) || 0;

    if (callDelay > 24) {
      insights.push({
        section: "VÉLOCITÉ COMMERCIALE",
        title: "Délai de rappel critique",
        problem: `Délai de ${callDelay}h. Répondre en <5 min = 100x plus de conversion.`,
        impact: `Perte ~${Math.round(leadsPerMonth * 0.8)} leads/mois = €${Math.round(leadsPerMonth * 0.8 * dealValue * 12).toLocaleString()}/an`,
        solution: "Lead Speed™ < 10 min = +45% qualification",
        action: "GRATUIT: Notifications push + SLA < 2h"
      });
    }
    if (relances < 5) {
      insights.push({
        section: "RELANCES",
        title: "80% des ventes = 5+ tentatives",
        problem: `Seulement ${relances} relance(s). Vous laissez 60% du CA.`,
        impact: `€${Math.round(leadsPerMonth * 0.6 * dealValue * 12).toLocaleString()}/an perdu`,
        solution: "Follow-Up Machine™: J+1, J+3, J+7, J+14",
        action: "GRATUIT: Checklist + rappels fixes"
      });
    }
    return insights;
  };

  const getHealthScore = () => {
    let score = 0;
    if (formData.processClarity) score += 12;
    if (formData.documentationYes) score += 12;
    if (formData.checklistsYes) score += 12;
    if (formData.autoRelanceYes) score += 12;
    if (formData.dashboardsYes) score += 12;
    if (parseInt(formData.callbackDelay) <= 2) score += 10;
    if (parseInt(formData.numRelances) >= 5) score += 10;
    if (!formData.lostSalesYes) score += 10;
    if (parseInt(formData.quoteDelay) <= 2) score += 10;
    return Math.min(score, 100);
  };

  const handlePrint = () => window.print();

  if (showResults) {
    const recommendations = calculateRecommendations();
    const selectedProjects = projectsData.filter(p => recommendations.includes(p.name));
    const totalDays = selectedProjects.reduce((sum, p) => sum + p.days, 0);
    const totalCost = totalDays * 750;
    const healthScore = getHealthScore();
    const insights = generateInsights();
    const leadsPerMonth = parseInt(formData.leadsPerMonth) || 100;
    const rdvRateNum = parseInt(formData.rdvRate) / 100 || 0.3;
    const dealValue = 5000;
    const assumedClosingRate = 0.2;
    const currentMonthlyRevenue = leadsPerMonth * rdvRateNum * assumedClosingRate * dealValue;
    const uplift = 0.2;
    const annualGains = currentMonthlyRevenue * uplift * 12;
    const roiPercentage = Math.round(((annualGains - totalCost) / totalCost) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-indigo-600">Rapport Final</h1>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-6xl font-bold text-indigo-600">{healthScore}%</p>
            <p>Maturité RevOps</p>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-bold w-full">
            Réserver appel gratuit
          </button>
          <button onClick={() => { setShowResults(false); setCurrentStep(0); localStorage.removeItem('auditData'); }} className="text-indigo-600 flex items-center gap-2 mx-auto">
            <RefreshCw className="w-5 h-5" /> Relancer
          </button>
          <button onClick={handlePrint} className="text-indigo-600 flex items-center gap-2 mx-auto">
            <Download className="w-5 h-5" /> PDF
          </button>
        </div>
      </div>
    );
  }

  const section = sections[currentStep];
  const progress = ((currentStep + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Audit RevOps ENR</h1>
        <div className="bg-white p-8 rounded-xl mt-6 shadow-lg">
          <h2 className="text-2xl font-bold">{section.title}</h2>
          <div className="w-full bg-gray-200 h-3 rounded-full mt-3">
            <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-8 space-y-6">
            {section.questions.map(q => (
              <div key={q.id}>
                <label className="block font-semibold text-gray-700">{q.label}</label>
                {q.type === "yesno" ? (
                  <div className="flex gap-4 mt-3">
                    <button onClick={() => handleInputChange(q.id, true)} className={`flex-1 py-3 rounded-lg font-bold transition ${formData[q.id] === true ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Oui</button>
                    <button onClick={() => handleInputChange(q.id, false)} className={`flex-1 py-3 rounded-lg font-bold transition ${formData[q.id] === false ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Non</button>
                  </div>
                ) : (
                  <input type={q.type} value={formData[q.id]} onChange={e => handleInputChange(q.id, e.target.value)} className="w-full mt-3 p-3 border rounded-lg focus:border-indigo-600" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            {currentStep > 0 && <button onClick={() => setCurrentStep(s => s - 1)} className="flex-1 py-3 border rounded-lg">Retour</button>}
            <button onClick={() => currentStep === sections.length - 1 ? setShowResults(true) : setCurrentStep(s => s + 1)} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold">
              {currentStep === sections.length - 1 ? "Voir résultats" : "Suivant"} <ChevronRight className="inline w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTool;
