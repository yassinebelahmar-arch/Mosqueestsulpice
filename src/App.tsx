import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { Hero } from './components/Hero';
import { PrayerTimesStrip } from './components/PrayerTimesStrip';
import { MissionSection } from './components/MissionSection';
import { MawaqitSection } from './components/MawaqitSection';
import { ParkingDonationSection } from './components/ParkingDonationSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { NewsSection } from './components/NewsSection';
import { AboutMosqueSection } from './components/AboutMosqueSection';
import { ContactAndAccessSection } from './components/ContactAndAccessSection';
import { QuranDhikrSection } from './components/QuranDhikrSection';
import { PrayerCalendarModal } from './components/PrayerCalendarModal';
import { Footer } from './components/Footer';
import { VolunteerAdminModal } from './components/VolunteerAdminModal';

import {
  INITIAL_NEWS,
  INITIAL_ACTIVITIES,
  INITIAL_PROJECT,
  INITIAL_VOLUNTEER_CONFIG,
} from './data/initialData';
import { NewsItem, ActivityItem, ProjectCampaign, VolunteerConfig } from './types';

const STORAGE_KEYS = {
  CONFIG: 'mosquee_salem_config_v4',
  NEWS: 'mosquee_salem_news_v5',
  PROJECT: 'mosquee_salem_project_v4',
};

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Volunteer persistent configurations
  const [config, setConfig] = useState<VolunteerConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEER_CONFIG;
    } catch {
      return INITIAL_VOLUNTEER_CONFIG;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [project, setProject] = useState<ProjectCampaign>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECT);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT;
    } catch {
      return INITIAL_PROJECT;
    }
  });

  // Keep project campaign numbers synced with config
  const activeProject: ProjectCampaign = {
    ...project,
    currentAmount: config.parkingCurrentAmount ?? project.currentAmount,
    targetAmount: config.parkingTargetAmount ?? project.targetAmount,
    donorsCount: config.parkingDonorsCount ?? project.donorsCount,
  };

  const handleSaveConfig = (newConfig: VolunteerConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Storage save error', e);
    }
  };

  const handleSaveNews = (newNews: NewsItem[]) => {
    setNews(newNews);
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newNews));
    } catch (e) {
      console.error('Storage save error', e);
    }
  };

  const handleSaveProject = (newProject: ProjectCampaign) => {
    setProject(newProject);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(newProject));
    } catch (e) {
      console.error('Storage save error', e);
    }
  };

  const handleResetDefaults = () => {
    setConfig(INITIAL_VOLUNTEER_CONFIG);
    setNews(INITIAL_NEWS);
    setProject(INITIAL_PROJECT);
    try {
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      localStorage.removeItem(STORAGE_KEYS.NEWS);
      localStorage.removeItem(STORAGE_KEYS.PROJECT);
    } catch (e) {
      console.error('Storage reset error', e);
    }
  };

  const cotizupUrl = project.cotizupUrl;
  const mawaqitUrl = 'https://mawaqit.net/fr/m/mosquee-salem-de-st-sulpice-la-pointe-saint-sulpice-la-pointe-81370-france-1';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans">
      {/* 1. Alert Banner for Important Announcements */}
      <AlertBanner
        enabled={config.alertBannerEnabled}
        text={config.alertBannerText}
        linkText={config.alertBannerLinkText}
        linkHref={config.alertBannerLinkHref}
      />

      {/* 2. Top Navigation Bar */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        cotizupUrl={cotizupUrl}
      />

      <main className="flex-1">
        {/* 3. Operational Today's Prayer Times Strip (Strictly fixed 5 prayers, no scrolling/dropdown) */}
        <PrayerTimesStrip
          mawaqitUrl={mawaqitUrl}
          overrideTimes={config.prayerTimesOverride}
          onOpenCalendar={() => setIsCalendarOpen(true)}
        />

        {/* 4. Full-Width Hero Section with Grand Mosque Photo and CTAs */}
        <Hero
          cotizupParkingUrl={cotizupUrl}
          onOpenCalendar={() => setIsCalendarOpen(true)}
        />

        {/* 5. Mission & Values Section */}
        <MissionSection />

        {/* 6. Official Mawaqit Integration Section & Full Monthly Calendar */}
        <MawaqitSection mawaqitUrl={mawaqitUrl} />

        {/* 7. Saint Coran & Dhikr Section */}
        <QuranDhikrSection />

        {/* 8. Grand Projet Parking Donation Section (CotizUp Conversion Block) */}
        <ParkingDonationSection
          project={activeProject}
          onUpdateProject={handleSaveProject}
        />

        {/* 9. Activities & Arabic Lessons Section */}
        <ActivitiesSection activities={INITIAL_ACTIVITIES} />

        {/* 10. News & Latest Announcements Section */}
        <NewsSection news={news} cotizupUrl={cotizupUrl} />

        {/* 11. About the Mosque & Association Section */}
        <AboutMosqueSection />

        {/* 12. Location, Access & Contact Form Section */}
        <ContactAndAccessSection />
      </main>

      {/* 13. Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        cotizupParkingUrl={cotizupUrl}
        cotizupGeneralUrl={project.cotizupGeneralUrl}
        mawaqitUrl={mawaqitUrl}
      />

      {/* Full Monthly Prayer Calendar Modal */}
      <PrayerCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        mawaqitUrl={mawaqitUrl}
      />

      {/* Volunteer Admin Modal (Easy Updates) */}
      <VolunteerAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        news={news}
        onSaveNews={handleSaveNews}
        project={activeProject}
        onSaveProject={handleSaveProject}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
