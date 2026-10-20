import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy'
];

const companyRoots = [
  'Apex', 'Nexus', 'Summit', 'Global', 'BluePeak', 'CloudScale', 'Vanguard', 'Optima',
  'Horizon', 'Zenith', 'Acme', 'Starlight', 'Catalyst', 'Frontier', 'Innova', 'Prime',
  'Velocity', 'Aero', 'Matrix', 'Pulse', 'Hyperion', 'Titan', 'Beacon', 'Atlas',
  'Alpha', 'Crest', 'Quantum', 'Synergy', 'Solstice', 'Veritas', 'Pinnacle', 'Elevation'
];

const companyTypes = [
  'Technologies', 'Solutions', 'Logistics', 'Capital', 'Media', 'Health', 'Ventures',
  'Labs', 'Consulting', 'Systems', 'Software', 'Networks', 'Analytics', 'Digital',
  'Robotics', 'Industries'
];

const tlds = ['com', 'io', 'co', 'ai', 'net', 'org'];

const titles = [
  // Tier A (Decision Makers)
  'Chief Executive Officer',
  'Chief Technology Officer',
  'Chief Financial Officer',
  'Vice President of Sales',
  'VP of Engineering',
  'Vice President of Marketing',
  'Founder & CEO',
  'Managing Director',
  'Head of Growth',
  'Head of Product',
  // Tier B (Managers / Champions)
  'Operations Manager',
  'Product Lead',
  'Engineering Manager',
  'Regional Sales Director',
  'Senior Account Executive',
  'Senior Product Manager',
  'Marketing Lead',
  'Technical Lead',
  // Tier C (Contributors)
  'Software Engineer',
  'Sales Development Representative',
  'Marketing Coordinator',
  'Research Associate',
  'Customer Success Specialist',
  'Account Manager',
  'Business Analyst'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatCasing(str, style) {
  if (style === 'upper') return str.toUpperCase();
  if (style === 'lower') return str.toLowerCase();
  return str;
}

function formatPhone(num, style) {
  const s = String(num).padStart(10, '0');
  const d1 = s.slice(0, 3);
  const d2 = s.slice(3, 6);
  const d3 = s.slice(6, 10);

  if (style === 0) return `+1 (${d1}) ${d2}-${d3}`;
  if (style === 1) return `(${d1}) ${d2}-${d3}`;
  if (style === 2) return `${d1}.${d2}.${d3}`;
  if (style === 3) return `${d1}-${d2}-${d3}`;
  return `${d1}${d2}${d3}`;
}

function formatWebsite(domain, style) {
  if (style === 0) return `https://${domain}`;
  if (style === 1) return `http://${domain}/`;
  if (style === 2) return `www.${domain}`;
  if (style === 3) return `https://www.${domain}/about`;
  return domain;
}

export function generate10kLeads(targetCount = 10000) {
  console.log(`[Data Generator] Generating ${targetCount} realistic B2B leads...`);
  const rows = [];
  rows.push(['First Name', 'Last Name', 'Company', 'Title', 'Email', 'Phone', 'Website', 'Notes'].join(','));

  // Pre-generate 800 companies
  const companies = [];
  for (let i = 0; i < 800; i++) {
    const root = getRandomItem(companyRoots);
    const type = getRandomItem(companyTypes);
    const tld = getRandomItem(tlds);
    const companyName = `${root} ${type}`;
    const domain = `${root.toLowerCase()}${type.toLowerCase()}.${tld}`;
    companies.push({ companyName, domain });
  }

  // Generate 9,200 unique base records
  const uniquePool = [];
  const baseCount = Math.floor(targetCount * 0.92);

  for (let i = 0; i < baseCount; i++) {
    const fNameRaw = getRandomItem(firstNames);
    const lNameRaw = getRandomItem(lastNames);
    const compObj = getRandomItem(companies);
    const title = getRandomItem(titles);

    // Casing variation (20% uppercase, 20% lowercase, 60% standard)
    const casingRoll = Math.random();
    const casing = casingRoll < 0.2 ? 'upper' : casingRoll < 0.4 ? 'lower' : 'normal';

    const fName = formatCasing(fNameRaw, casing);
    const lName = formatCasing(lNameRaw, casing);

    const email = `${fNameRaw.toLowerCase()}.${lNameRaw.toLowerCase()}${i % 7 === 0 ? i : ''}@${compObj.domain}`;
    const phone = formatPhone(5550000000 + (i * 73) % 9999999, i % 5);
    const website = formatWebsite(compObj.domain, i % 5);
    const notes = `Prospect in ${compObj.companyName} evaluating quarterly enterprise automation initiatives.`;

    const record = {
      fName,
      lName,
      company: compObj.companyName,
      title,
      email,
      phone,
      website,
      notes: `"${notes}"`,
      domain: compObj.domain
    };

    uniquePool.push(record);
    rows.push([record.fName, record.lName, `"${record.company}"`, `"${record.title}"`, record.email, record.phone, record.website, record.notes].join(','));
  }

  // Inject ~800 duplicates (exact email duplicates and same domain colleague duplicates)
  const duplicateCount = targetCount - baseCount;
  for (let i = 0; i < duplicateCount; i++) {
    const sourceRecord = uniquePool[i * 7 % uniquePool.length];
    const isExactEmailDupe = i % 2 === 0;

    if (isExactEmailDupe) {
      // Duplicate of same person with slightly different company formatting
      const dupeFName = Math.random() > 0.5 ? sourceRecord.fName.toLowerCase() : sourceRecord.fName.toUpperCase();
      rows.push([
        dupeFName,
        sourceRecord.lName,
        `"${sourceRecord.company} Inc"`,
        `"${sourceRecord.title}"`,
        sourceRecord.email,
        sourceRecord.phone,
        sourceRecord.domain,
        `"Duplicate conference attendee scan."`
      ].join(','));
    } else {
      // Colleague from the same company domain
      const newFName = getRandomItem(firstNames);
      const newLName = getRandomItem(lastNames);
      const colleagueEmail = `${newFName.toLowerCase()}.${newLName.toLowerCase()}@${sourceRecord.domain}`;
      rows.push([
        newFName,
        newLName,
        `"${sourceRecord.company}"`,
        `"Account Executive"`,
        colleagueEmail,
        formatPhone(5559000000 + i, 2),
        sourceRecord.domain,
        `"Secondary contact at ${sourceRecord.company}."`
      ].join(','));
    }
  }

  const outputDir = path.resolve(__dirname, '../sample-data');
  const outputPath = path.join(outputDir, 'dummy_10k_leads.csv');

  fs.writeFileSync(outputPath, rows.join('\r\n'), 'utf-8');
  const stats = fs.statSync(outputPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`[Data Generator] Successfully created: ${outputPath}`);
  console.log(`[Data Generator] Total rows: ${rows.length - 1} | File size: ${sizeMb} MB`);
}

generate10kLeads(10000);
