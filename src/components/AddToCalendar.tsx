import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Monitor, Smartphone } from 'lucide-react';

export function AddToCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const eventDetails = {
    title: 'EnterpriseCEO Media Owners & Executives Masterclass',
    description: 'A high-impact, executive-level programme designed to equip decision-makers with the strategic foresight, leadership capability, and practical tools required to navigate modern media.',
    location: 'Lagos, Nigeria',
    // Oct 21, 2026 09:00 to Oct 22, 2026 17:00 (WAT, UTC+1)
    startUtc: '20261021T080000Z',
    endUtc: '20261022T160000Z',
  };

  const handleGoogleCalendar = () => {
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startUtc}/${eventDetails.endUtc}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    window.open(googleUrl, '_blank');
    setIsOpen(false);
  };

  const handleIcsDownload = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EnterpriseCEO//Masterclass//EN',
      'BEGIN:VEVENT',
      `DTSTART:${eventDetails.startUtc}`,
      `DTEND:${eventDetails.endUtc}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'EnterpriseCEO_Masterclass.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors border border-white/20 text-sm"
      >
        <Calendar className="w-4 h-4" />
        Notify Me / Save Date
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 z-50 overflow-hidden py-1">
          <button
            onClick={handleGoogleCalendar}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Monitor className="w-4 h-4 text-gray-400" />
            Google Calendar
          </button>
          <button
            onClick={handleIcsDownload}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-gray-400" />
            Apple / Outlook / Yahoo
          </button>
        </div>
      )}
    </div>
  );
}
