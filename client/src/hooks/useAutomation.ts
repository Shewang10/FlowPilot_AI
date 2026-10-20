import { useState, useCallback } from 'react';
import type {
  RawLead,
  NormalizedLead,
  CleaningOptions,
  AIOptions,
  ProcessSummary,
  ProcessResponse
} from '../types/data.ts';

const SAMPLE_MESSY_LEADS: RawLead[] = [
  {
    'First Name': 'JOHN',
    'Last Name': 'DOE',
    'Company': 'Acme Corp',
    'Title': 'Vice President of Sales',
    'Email': 'john.doe@acmecorp.com',
    'Phone': '+1 (555) 019-2834',
    'Website': 'https://www.acmecorp.com',
    'Notes': 'Leading B2B manufacturing firm looking to expand sales pipeline.'
  },
  {
    'First Name': 'sarah',
    'Last Name': 'smith',
    'Company': 'Global Logistics LLC',
    'Title': 'Operations Director',
    'Email': 'sarah.smith@globallogistics.io',
    'Phone': '555.019.2835',
    'Website': 'http://globallogistics.io',
    'Notes': 'Managing supply chain distribution across 12 hubs.'
  },
  {
    'First Name': 'John',
    'Last Name': 'Doe',
    'Company': 'Acme Corporation',
    'Title': 'VP Sales',
    'Email': 'john.doe@acmecorp.com',
    'Phone': '555-019-2834',
    'Website': 'acmecorp.com',
    'Notes': 'Duplicate entry with slightly different company formatting.'
  },
  {
    'First Name': 'michael',
    'Last Name': 'CHANG',
    'Company': 'Summit Health',
    'Title': 'Chief Technology Officer',
    'Email': 'mchang@summithealth.org',
    'Phone': '(555) 019-4829',
    'Website': 'https://summithealth.org',
    'Notes': 'Healthcare provider scaling their electronic health record system.'
  },
  {
    'First Name': 'Emily',
    'Last Name': 'watson',
    'Company': 'Acme Corp',
    'Title': 'Marketing Manager',
    'Email': 'emily.watson@acmecorp.com',
    'Phone': '+1 555 019 9921',
    'Website': 'www.acmecorp.com',
    'Notes': 'Same domain as Acme Corp, junior marketing contact.'
  },
  {
    'First Name': 'David',
    'Last Name': 'Miller',
    'Company': 'Miller & Sons Law',
    'Title': 'Managing Partner',
    'Email': 'david@millerlaw.example',
    'Phone': '5550198822',
    'Website': 'http://www.millerlaw.example/',
    'Notes': 'Regional commercial litigation and corporate advisory practice.'
  },
  {
    'First Name': 'ALEX',
    'Last Name': 'JOHNSON',
    'Company': 'Apex Cloud Solutions',
    'Title': 'Head of Engineering',
    'Email': 'alex.j@apexcloud.co',
    'Phone': '555-019-7711',
    'Website': 'https://apexcloud.co',
    'Notes': 'Cloud migration agency helping fintech startups adopt AWS.'
  },
  {
    'First Name': 'Alex',
    'Last Name': 'Johnson',
    'Company': 'Apex Cloud',
    'Title': 'VP Engineering',
    'Email': 'alex.j@apexcloud.co',
    'Phone': '555-019-7711',
    'Website': 'apexcloud.co',
    'Notes': 'Duplicate record from secondary conference attendee list.'
  },
  {
    'First Name': 'lisa',
    'Last Name': 'ANDERSON',
    'Company': 'Bright Horizon Retail',
    'Title': 'Director of Merchandising',
    'Email': 'lisa.a@brighthorizon.store',
    'Phone': '+1-555-019-6633',
    'Website': 'brighthorizon.store',
    'Notes': 'E-commerce brand scaling sustainable apparel lines.'
  },
  {
    'First Name': 'Robert',
    'Last Name': 'Taylor',
    'Company': 'Taylor Capital Group',
    'Title': 'Principal Investor',
    'Email': 'robert@taylorcap.example',
    'Phone': '555 019 5544',
    'Website': 'https://taylorcap.example',
    'Notes': 'Private equity firm investing in lower middle-market B2B services.'
  },
  {
    'First Name': 'marcus',
    'Last Name': 'VANCE',
    'Company': 'Vance Media Group',
    'Title': 'Head of Growth',
    'Email': 'marcus.v@vancemedia.co',
    'Phone': '(555) 019-3388',
    'Website': 'vancemedia.co',
    'Notes': 'B2B performance marketing agency scaling inbound demand.'
  }
];

export function useAutomation() {
  const [rawData, setRawData] = useState<RawLead[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<NormalizedLead[]>([]);
  const [duplicates, setDuplicates] = useState<NormalizedLead[]>([]);
  const [summary, setSummary] = useState<ProcessSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings State
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('flowpilot_gemini_key') || '');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Pipeline Configuration State
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>({
    normalizeNames: true,
    normalizeEmails: true,
    normalizePhones: true,
    normalizeWebsites: true,
    deduplicate: true,
    dedupeStrategy: 'email_or_domain',
  });

  const [aiOptions, setAiOptions] = useState<AIOptions>({
    classifyTier: true,
    generateIcebreaker: true,
    useDemoMock: true,
  });

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem('flowpilot_gemini_key', key);
    if (key.trim()) {
      setIsDemoMode(false);
      setAiOptions((prev) => ({ ...prev, useDemoMock: false, userApiKey: key }));
    }
  }, []);

  const handleToggleDemoMode = useCallback((demo: boolean) => {
    setIsDemoMode(demo);
    setAiOptions((prev) => ({ ...prev, useDemoMock: demo }));
  }, []);

  const loadSampleData = useCallback(() => {
    setRawData(SAMPLE_MESSY_LEADS);
    setFilename('sample_messy_leads.csv');
    setResults([]);
    setDuplicates([]);
    setSummary(null);
    setErrorMsg(null);
  }, []);

  const resetAll = useCallback(() => {
    setRawData([]);
    setFilename('');
    setResults([]);
    setDuplicates([]);
    setSummary(null);
    setErrorMsg(null);
  }, []);

  const runPipeline = useCallback(async () => {
    if (rawData.length === 0) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          records: rawData,
          cleaningOptions,
          aiOptions: {
            ...aiOptions,
            useDemoMock: isDemoMode || !apiKey.trim(),
            userApiKey: apiKey.trim() || undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.errors?.[0] || 'Pipeline processing failed.');
      }

      const data: ProcessResponse = await response.json();
      setResults(data.records);
      setDuplicates(data.duplicates);
      setSummary(data.summary);
    } catch (err: any) {
      console.error('[Pipeline Run Error]', err);
      setErrorMsg(err?.message || 'Failed to process data. Ensure the backend server is running.');
    } finally {
      setIsProcessing(false);
    }
  }, [rawData, cleaningOptions, aiOptions, isDemoMode, apiKey]);

  return {
    rawData,
    setRawData,
    filename,
    setFilename,
    isProcessing,
    results,
    duplicates,
    summary,
    errorMsg,
    apiKey,
    handleSaveApiKey,
    isDemoMode,
    handleToggleDemoMode,
    cleaningOptions,
    setCleaningOptions,
    aiOptions,
    setAiOptions,
    loadSampleData,
    resetAll,
    runPipeline,
  };
}

