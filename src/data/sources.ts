import type { CareerFieldId, CategoryId, Source } from "../types";

export const SOURCES: Record<CategoryId, Source[]> = {
  career: [
    {
      name: "OECD Employment Outlook 2024",
      url: "https://www.oecd.org/employment/employment-outlook.htm",
      what: "Unemployment rates, labour market depth, wage growth across OECD members",
    },
    {
      name: "IMF World Economic Outlook April 2025",
      url: "https://www.imf.org/en/Publications/WEO",
      what: "GDP per capita, economic resilience, growth projections by country",
    },
    {
      name: "Mercer Cost of Living Survey 2024",
      url: "https://www.mercer.com/insights/total-rewards/talent-mobility-insights/cost-of-living",
      what: "Purchasing power and effective cost of living for professionals by city",
    },
    {
      name: "Levels.fyi Global Salary Data",
      url: "https://www.levels.fyi/t/software-engineer",
      what: "Senior professional compensation benchmarks by country",
    },
    {
      name: "World Bank – GDP per capita (current USD)",
      url: "https://data.worldbank.org/indicator/NY.GDP.PCAP.CD",
      what: "Economic output and wealth baselines by country",
    },
    {
      name: "ECA International Global Mobility Report",
      url: "https://www.eca-international.com",
      what: "Expat salary competitiveness and employer demand for skilled workers",
    },
  ],
  tech: [
    {
      name: "Levels.fyi – SWE Salaries by Location",
      url: "https://www.levels.fyi/t/software-engineer",
      what: "Senior and staff SWE total compensation by country",
    },
    {
      name: "Startup Genome – Global Startup Ecosystem Report 2024",
      url: "https://startupgenome.com/article/gser2024",
      what: "Startup ecosystem depth, VC funding, and founder success rates by city",
    },
    {
      name: "Atomico – State of European Tech 2024",
      url: "https://stateofeuropeantech.com",
      what: "Engineering talent supply, tech sector salaries, and startup investment in Europe",
    },
    {
      name: "GFCI 38 – Global Financial Centres Index",
      url: "https://www.longfinance.net/programmes/financial-centre-futures/global-financial-centres-index",
      what: "Tech and fintech hub rankings by city, used to validate tech hub depth",
    },
    {
      name: "OECD – ICT sector employment share",
      url: "https://stats.oecd.org",
      what: "Share of ICT employment in total economy by country",
    },
  ],
  social: [
    {
      name: "InterNations Expat Insider Survey 2024",
      url: "https://www.internations.org/expat-insider",
      what: "Friendliness rankings, ease of settling in, and social experience of 12,000+ expats",
    },
    {
      name: "MIPEX – Migrant Integration Policy Index 2025",
      url: "https://www.mipex.eu",
      what: "Legal and institutional frameworks for immigrant integration by country",
    },
    {
      name: "OECD – Society at a Glance: Social Trust",
      url: "https://www.oecd.org/social/society-at-a-glance.htm",
      what: "Social trust levels, civic engagement, and minority acceptance by country",
    },
    {
      name: "Gallup World Poll – Social Acceptance",
      url: "https://news.gallup.com/poll/world.aspx",
      what: "Community belonging, discrimination experience, and openness to outsiders",
    },
    {
      name: "World Values Survey – Wave 7 (2017–2022)",
      url: "https://www.worldvaluessurvey.org",
      what: "Cultural values, tolerance toward outsiders, and openness to immigration",
    },
  ],
  stability: [
    {
      name: "Global Peace Index 2025",
      url: "https://www.visionofhumanity.org/maps",
      what: "Societal safety, security, and militarisation scores for 163 countries",
    },
    {
      name: "Economist Intelligence Unit – Democracy Index 2024",
      url: "https://www.eiu.com/n/campaigns/democracy-index-2024",
      what: "Political pluralism, civil liberties, and institutional stability",
    },
    {
      name: "IMF – Fiscal Monitor 2025",
      url: "https://www.imf.org/en/Publications/FM",
      what: "Public debt trajectories, fiscal sustainability, and deficit projections",
    },
    {
      name: "UN World Population Prospects 2024",
      url: "https://population.un.org/wpp",
      what: "Fertility rates, aging population projections, and demographic sustainability",
    },
    {
      name: "WEF – Global Risks Report 2025",
      url: "https://www.weforum.org/reports/the-global-risks-report-2025",
      what: "Geopolitical, environmental and economic risk outlook by country",
    },
    {
      name: "IEA – Energy Security Report 2024",
      url: "https://www.iea.org/topics/energy-security",
      what: "Energy independence, renewable transition, and energy resilience by country",
    },
  ],
  lifestyle: [
    {
      name: "Mercer Quality of Living Survey 2024",
      url: "https://www.mercer.com/en-us/insights/total-rewards/talent-mobility-insights/quality-of-living",
      what: "Overall quality of life including leisure, culture, and social environment",
    },
    {
      name: "World Happiness Report 2025",
      url: "https://worldhappiness.report",
      what: "Life satisfaction, work-life balance, and subjective wellbeing by country",
    },
    {
      name: "OECD Better Life Index",
      url: "https://www.oecdbetterlifeindex.org",
      what: "Work-life balance, leisure time, community, and life satisfaction metrics",
    },
    {
      name: "InterNations Expat Insider – Leisure & Social Life Index 2024",
      url: "https://www.internations.org/expat-insider",
      what: "Expat-rated social life, nightlife, dining, and cultural activities by country",
    },
  ],
  terrain: [
    {
      name: "Environmental Performance Index 2024 (Yale/Columbia)",
      url: "https://epi.yale.edu",
      what: "Ecosystem vitality, biodiversity, and access to natural environments",
    },
    {
      name: "OECD Regional Wellbeing – Access to Green Space",
      url: "https://stats.oecd.org/Index.aspx?DataSetCode=RWB",
      what: "Green space and natural environment access across OECD regions",
    },
    {
      name: "World Economic Forum – Nature Risk Index",
      url: "https://www.weforum.org",
      what: "Biodiversity richness and natural landscape diversity by country",
    },
    {
      name: "Numbeo – Quality of Life Index 2025",
      url: "https://www.numbeo.com/quality-of-life",
      what: "Nature access and climate quality as part of composite quality-of-life scores",
    },
  ],
  safety: [
    {
      name: "Global Peace Index 2025",
      url: "https://www.visionofhumanity.org/maps",
      what: "Peacefulness scores covering crime, conflict, and militarisation for 163 countries",
    },
    {
      name: "UNODC – Global Study on Homicide 2023",
      url: "https://www.unodc.org/unodc/en/data-and-analysis/homicide.html",
      what: "Intentional homicide rates per 100,000 population by country",
    },
    {
      name: "Numbeo – Crime Index 2025",
      url: "https://www.numbeo.com/crime/rankings_by_country.jsp",
      what: "Perceived levels of crime, safety walking alone, and police trust by country",
    },
    {
      name: "OSAC – Country Security Reports",
      url: "https://www.osac.gov/country",
      what: "US government security threat assessments for each country",
    },
    {
      name: "Eurostat – Crime Statistics",
      url: "https://ec.europa.eu/eurostat/statistics-explained/index.php/Crime_statistics",
      what: "Police-recorded crime rates for EU member states",
    },
  ],
  urban: [
    {
      name: "Economist – Global Liveability Index 2024",
      url: "https://www.eiu.com/n/campaigns/global-liveability-index-2024",
      what: "Infrastructure, transit, stability, and culture scores for 173 cities",
    },
    {
      name: "Mercer Quality of Living – Infrastructure",
      url: "https://www.mercer.com/en-us/insights/total-rewards/talent-mobility-insights/quality-of-living",
      what: "Public transport, commute times, and city planning quality ratings",
    },
    {
      name: "Numbeo – Traffic Commute Time Index 2025",
      url: "https://www.numbeo.com/traffic/rankings_by_country.jsp",
      what: "Average commute times and traffic congestion levels by country",
    },
    {
      name: "ITDP – Sustainable Transport Scorecard",
      url: "https://itdp.org",
      what: "Walkability, cycling infrastructure, and public transport quality assessments",
    },
    {
      name: "Arcadis – Sustainable Cities Index 2024",
      url: "https://www.arcadis.com/campaigns/creating-a-lasting-legacy",
      what: "People, planet, and profit dimensions of city sustainability and design",
    },
  ],
  health: [
    {
      name: "WHO – World Health Statistics 2024",
      url: "https://www.who.int/data/gho/publications/world-health-statistics",
      what: "Healthcare access, quality, and outcomes indicators globally",
    },
    {
      name: "OECD Health at a Glance 2023",
      url: "https://www.oecd.org/health/health-at-a-glance.htm",
      what: "Wait times, doctor density, health spending, and outcomes across OECD",
    },
    {
      name: "Commonwealth Fund – International Health Policy Survey 2023",
      url: "https://www.commonwealthfund.org/international-health-policy-center/system-scorecard",
      what: "Comparative healthcare performance across 11 high-income countries",
    },
    {
      name: "Bloomberg – Global Health Index 2024",
      url: "https://www.bloomberg.com/graphics/health-determined-countries",
      what: "Life expectancy, nutrition, clean water, and health behaviors by country",
    },
    {
      name: "Numbeo – Healthcare Index 2025",
      url: "https://www.numbeo.com/health-care/rankings_by_country.jsp",
      what: "User-rated healthcare quality, speed, and affordability by country",
    },
  ],
  env: [
    {
      name: "Yale/Columbia – Environmental Performance Index 2024",
      url: "https://epi.yale.edu",
      what: "Air quality, water quality, biodiversity, climate policy, and ecosystem health",
    },
    {
      name: "WHO – Global Air Quality Database 2024",
      url: "https://www.who.int/data/gho/data/themes/air-pollution",
      what: "PM2.5 concentrations and ambient air pollution levels by country",
    },
    {
      name: "IEA – Renewables 2024 Report",
      url: "https://www.iea.org/reports/renewables-2024",
      what: "Renewable energy share in electricity generation and clean energy progress",
    },
    {
      name: "UNEP – Global Environment Outlook 6",
      url: "https://www.unep.org/resources/global-environment-outlook-6",
      what: "Biodiversity status, pollution levels, and environmental governance quality",
    },
  ],
  housing: [
    {
      name: "Demographia International Housing Affordability 2025",
      url: "http://demographia.com/dhi.pdf",
      what: "Price-to-income ratios and housing affordability in major cities globally",
    },
    {
      name: "Numbeo – Cost of Living Index 2025",
      url: "https://www.numbeo.com/cost-of-living/rankings_by_country.jsp",
      what: "Rent, groceries, utilities, transport costs by country",
    },
    {
      name: "OECD – Affordable Housing Database 2024",
      url: "https://www.oecd.org/els/family/affordable-housing-database.htm",
      what: "Housing cost burdens, social housing availability, and rent-to-income ratios",
    },
    {
      name: "Mercer – Cost of Living Survey 2024",
      url: "https://www.mercer.com",
      what: "Actual expat living costs in major cities, used to calibrate CoL scores",
    },
    {
      name: "Eurostat – Housing Cost Overburden Rate",
      url: "https://ec.europa.eu/eurostat/statistics-explained/index.php/Housing_statistics",
      what: "Share of population spending >40% of income on housing in EU countries",
    },
  ],
  gov: [
    {
      name: "Transparency International – CPI 2024",
      url: "https://www.transparency.org/en/cpi",
      what: "Perceived public sector corruption for 180 countries",
    },
    {
      name: "World Bank – Worldwide Governance Indicators 2024",
      url: "https://info.worldbank.org/governance/wgi",
      what: "Rule of law, government effectiveness, regulatory quality, and accountability",
    },
    {
      name: "World Justice Project – Rule of Law Index 2024",
      url: "https://worldjusticeproject.org/rule-of-law-index",
      what: "Open government, fundamental rights, civil justice, and criminal justice",
    },
    {
      name: "EIU – Democracy Index 2024",
      url: "https://www.eiu.com/n/campaigns/democracy-index-2024",
      what: "Electoral process, civil liberties, government functioning, and political culture",
    },
    {
      name: "UN E-Government Survey 2024",
      url: "https://publicadministration.un.org/egovkb/en-us/Reports/UN-E-Government-Survey-2024",
      what: "Quality and accessibility of digital government services by country",
    },
  ],
  values: [
    {
      name: "Pew Research – Global Attitudes Survey 2024",
      url: "https://www.pewresearch.org/global",
      what: "Social tolerance, attitudes toward immigrants, and progressive vs conservative alignment",
    },
    {
      name: "ILGA-Europe – Rainbow Map 2024",
      url: "https://www.ilga-europe.org/rainbow-map-index",
      what: "LGBTQ+ legal rights and social acceptance scores for European countries",
    },
    {
      name: "World Values Survey – Wave 7",
      url: "https://www.worldvaluessurvey.org",
      what: "Cultural values across 90 countries including gender equality and individual freedom",
    },
    {
      name: "OECD – Gender Data Portal",
      url: "https://stats.oecd.org/Index.aspx?DataSetCode=GIDDB2019",
      what: "Gender pay gap, political representation, and work-life balance equality",
    },
    {
      name: "V-Dem – Liberal Democracy Index 2024",
      url: "https://v-dem.net",
      what: "Civil society inclusion, freedom of expression, and individual liberty scores",
    },
  ],
  immi: [
    {
      name: "MIPEX – Migrant Integration Policy Index 2025",
      url: "https://www.mipex.eu",
      what: "PR timelines, citizenship pathways, family reunification rules, and labour market access",
    },
    {
      name: "Henley Passport Index 2025",
      url: "https://www.henleyglobal.com/passport-index",
      what: "Passport strength and visa-free access, as a proxy for immigration reciprocity",
    },
    {
      name: "OECD – International Migration Outlook 2024",
      url: "https://www.oecd.org/migration/international-migration-outlook.htm",
      what: "Immigrant intake volumes, policy changes, and labour migration data",
    },
    {
      name: "Official government immigration portals (all 26 countries)",
      url: "https://www.immd.gov.hk",
      what: "Verified PR timelines, citizenship residency requirements, and dual citizenship rules",
    },
    {
      name: "Free Movement – UK immigration analysis",
      url: "https://freemovement.org.uk",
      what: "UK ADR visa refusal rates, earned-settlement reform tracking, and ILR details",
    },
    {
      name: "EB5AN – EB-2 India Backlog Analysis",
      url: "https://eb5affiliatenetwork.com/indian-nationals-face-up-to-128-year-wait-for-eb-2-eb-3-green-cards",
      what: "US green card backlog estimates for Indian nationals",
    },
  ],
  edu: [
    {
      name: "PISA 2022 Results (OECD)",
      url: "https://www.oecd.org/pisa/publications/pisa-2022-results.htm",
      what: "Reading, maths, and science scores for 15-year-olds across 80 countries",
    },
    {
      name: "QS World University Rankings 2025",
      url: "https://www.topuniversities.com/university-rankings/world-university-rankings/2025",
      what: "University quality by academic reputation, research output, and employer feedback",
    },
    {
      name: "Times Higher Education Rankings 2026",
      url: "https://www.timeshighereducation.com/world-university-rankings",
      what: "University research intensity, teaching quality, and international diversity",
    },
    {
      name: "UNICEF – Report Card 18: Child Wellbeing 2024",
      url: "https://www.unicef.org/reports/state-worlds-children-2024",
      what: "Child safety, mental health, and social well-being outcomes across rich countries",
    },
    {
      name: "OECD – Education at a Glance 2024",
      url: "https://www.oecd.org/education/education-at-a-glance",
      what: "Public education spending, graduation rates, and social mobility by country",
    },
  ],
  history: [
    {
      name: "Freedom House – Freedom in the World 2025",
      url: "https://freedomhouse.org/report/freedom-world",
      what: "Political rights and civil liberties — used to assess democratic maturity",
    },
    {
      name: "V-Dem Institute – Historical Democracy Scores",
      url: "https://v-dem.net/data",
      what: "Long-run institutional continuity and democratic development trajectories",
    },
    {
      name: "Transparency International – CPI Historical Trend",
      url: "https://www.transparency.org/en/cpi",
      what: "Decade-long governance trend — used to assess whether accountability improved",
    },
    {
      name: "Wikipedia / Encyclopaedia Britannica – Colonial History",
      url: "https://www.britannica.com",
      what: "Scope and scale of colonial empires as input to historical accountability scoring",
    },
    {
      name: "Bergier Commission Report (Switzerland, 1998–2002)",
      url: "https://www.uek.ch/en",
      what: "Switzerland WWII banking history and historical accountability analysis",
    },
    {
      name: "German Federal Government – Reparations and Holocaust Education",
      url: "https://www.bundesregierung.de",
      what: "Germany historical reckoning assessment — laws, memorials, reparations",
    },
  ],
};

export const FIELD_SOURCES: Record<CareerFieldId, Source[]> = {
  technology: [
    {
      name: "Levels.fyi – SWE Salaries",
      url: "https://www.levels.fyi/t/software-engineer",
      what: "Senior SWE total compensation benchmarks by country",
    },
    {
      name: "Startup Genome – GSER 2024",
      url: "https://startupgenome.com/article/gser2024",
      what: "Startup ecosystem rankings, VC funding depth, and talent access",
    },
    {
      name: "Atomico – State of European Tech 2024",
      url: "https://stateofeuropeantech.com",
      what: "Engineering salaries, talent pipelines, and tech investment across Europe",
    },
  ],
  finance: [
    {
      name: "GFCI 38 – Global Financial Centres Index",
      url: "https://www.longfinance.net/programmes/financial-centre-futures/global-financial-centres-index",
      what: "City-level financial hub rankings used to score national finance market depth",
    },
    {
      name: "Glassdoor – Finance salaries by country",
      url: "https://www.glassdoor.com/Salaries",
      what: "Investment banking and asset management compensation benchmarks",
    },
    {
      name: "World Bank – Financial Sector Data",
      url: "https://data.worldbank.org/topic/financial-sector",
      what: "Banking sector size, credit depth, and financial system development",
    },
  ],
  engineering: [
    {
      name: "IFR – World Robotics 2024",
      url: "https://ifr.org/ifr-press-releases/news/robot-surge-in-2023",
      what: "Industrial robot density — key proxy for advanced manufacturing maturity",
    },
    {
      name: "OECD – R&D Expenditure by Country",
      url: "https://stats.oecd.org/Index.aspx?DataSetCode=MSTI2023",
      what: "R&D as % of GDP used to score engineering innovation environment",
    },
    {
      name: "IW Koln – STEM Skills Shortage Germany 2024",
      url: "https://arbeitgeber.de/en/germanys-ability-to-innovate-at-risk-209000-skilled-workers-in-stem-professions-are-lacking",
      what: "Documented 209,000 STEM shortage validating Germany top score",
    },
  ],
  healthcare: [
    {
      name: "OECD Health at a Glance 2023",
      url: "https://www.oecd.org/health/health-at-a-glance.htm",
      what: "Health spending per capita, doctor density, and pharmaceutical sector data",
    },
    {
      name: "TradeImeX – Pharmaceutical Exporters 2023–24",
      url: "https://www.tradeimex.in/blogs/top-Pharmaceutical-exporters",
      what: "Top pharma exporting countries used to score life-sciences sector depth",
    },
    {
      name: "Eurostat – International Trade in Medicinal Products",
      url: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=International_trade_in_medicinal_and_pharmaceutical_products",
      what: "EU pharma export data validating Switzerland, Germany, Ireland, Belgium scores",
    },
  ],
  consulting: [
    {
      name: "MBB – McKinsey, BCG, Bain Global Office Presence",
      url: "https://www.hackingthecaseinterview.com/pages/mbb-big-three-consulting",
      what: "MBB office headcount and depth used to score consulting market quality",
    },
    {
      name: "GoGlobal – Singapore APAC Business Hub",
      url: "https://goglobal.com/blog/global-recruitment/singapore-top-of-list-for-apac-expansion",
      what: "Singapore APAC HQ density validating its consulting market score",
    },
    {
      name: "Big 4 Annual Reports 2024 (Deloitte, PwC, EY, KPMG)",
      url: "https://www.deloitte.com",
      what: "Headcount and revenue by country used to calibrate consulting market depth",
    },
  ],
  legal: [
    {
      name: "Queen Mary/White & Case – International Arbitration Survey 2025",
      url: "https://www.whitecase.com/insight-our-thinking/current-choices-and-future-adaptations",
      what: "Arbitration seat preferences — validates UK/SG/FR scores as arbitration hubs",
    },
    {
      name: "HFW – Maritime Arbitration in Numbers 2025",
      url: "https://www.hfw.com/app/uploads/2025/09/007499-Maritime-Arbitration-in-Numbers-2025.pdf",
      what: "Arbitration volume data confirming London and Singapore dominance",
    },
    {
      name: "GoGlobal – Singapore Legal Market",
      url: "https://goglobal.com/blog/global-recruitment/singapore-top-of-list-for-apac-expansion",
      what: "Singapore as accessible international legal hub for foreign-qualified lawyers",
    },
  ],
  marketing: [
    {
      name: "Statista – Global Advertising Market",
      url: "https://www.statista.com/topics/990/global-advertising-market",
      what: "Advertising spend by country used to score marketing industry size",
    },
    {
      name: "DataReportal – Digital Advertising Trends 2025",
      url: "https://datareportal.com/reports/digital-2025-sub-section-global-advertising-trends",
      what: "Digital ad spend and digital marketing ecosystem depth by country",
    },
    {
      name: "Market Data Forecast – Europe Digital Advertising",
      url: "https://www.marketdataforecast.com/market-reports/europe-digital-advertising-market",
      what: "European market shares used to score DE/FR/GB/NL/SE marketing positions",
    },
  ],
  media: [
    {
      name: "ProdPro – Production Intelligence 2024",
      url: "https://www.productiondirectory.com",
      what: "Global production spend rankings used to score film/TV industry strength",
    },
    {
      name: "Newzoo – Global Games Market Report 2024",
      url: "https://newzoo.com/resources/trend-reports/newzoo-global-games-market-report-2024-free-version",
      what: "Gaming market size by country, used to score media/entertainment depth",
    },
    {
      name: "Vitrina AI – Rise of Korean Content",
      url: "https://vitrina.ai/blog/the-rise-of-animated-korean-content-global-influence-and-industry-evolution",
      what: "K-content export value validating South Korea's 9/10 media score",
    },
    {
      name: "Voronoi – Global Video Game Revenue by Country",
      url: "https://www.voronoiapp.com/other/Global-Video-Game-Revenue-by-Country--6049",
      what: "Country-level gaming revenue breakdown validating Japan/KR/US positions",
    },
  ],
  education: [
    {
      name: "QS World University Rankings 2025",
      url: "https://www.topuniversities.com/university-rankings/world-university-rankings/2025",
      what: "University prestige and research quality by country",
    },
    {
      name: "Times Higher Education Rankings 2026",
      url: "https://www.timeshighereducation.com/world-university-rankings",
      what: "Teaching quality, research output, and international diversity scores",
    },
    {
      name: "Nature Index 2024",
      url: "https://www.nature.com/nature-index",
      what: "Research output and scientific impact used to calibrate research-focused scores",
    },
    {
      name: "SSTI – International R&D Expenditure Comparison",
      url: "https://ssti.org/blog/useful-stats-international-comparison-rd-expenditures",
      what: "R&D intensity by country used to score research environment quality",
    },
    {
      name: "UK Research Council – ERC Grant Capture 2025",
      url: "https://www.timeshighereducation.com/news/uk-secures-most-european-research-council-grants-after-brexit-dip",
      what: "UK securing most ERC grants validates GB 10/10 education score",
    },
  ],
  architecture: [
    {
      name: "WA100 2025 – World Architecture 100",
      url: "https://www.scribd.com/document/840560025/WA100-2025-The-big-list-Features-Building-Design",
      what: "Top 100 architecture firms by fee income, used to identify national hubs",
    },
    {
      name: "ARCHIVIBE – Largest Architecture Firms Globally",
      url: "https://www.archivibe.com/largest-architecture-firms-in-the-world",
      what: "Firm HQ locations confirming US, UK, SG, JP, NL architecture dominance",
    },
    {
      name: "Architizer – Architecture in Singapore",
      url: "https://architizer.com/blog/inspiration/collections/best-architecture-firms-in-singapore",
      what: "Singapore's regional architecture firm density validating its high score",
    },
  ],
  construction: [
    {
      name: "Canada Immigration – Express Entry Trades 2025",
      url: "https://immigration.ca/every-one-of-the-trades-occupations-targeted-by-canada-express-entry-in-2025",
      what: "25 trades occupations in Express Entry validating Canada's 9/10 score",
    },
    {
      name: "IW Koln – Construction Trades Shortage Germany",
      url: "https://arbeitgeber.de/en/germanys-ability-to-innovate-at-risk-209000-skilled-workers-in-stem-professions-are-lacking",
      what: "30,800 construction trades shortfall in Germany validating high score",
    },
    {
      name: "Australia CSOL – Construction Occupation List",
      url: "https://immi.homeaffairs.gov.au",
      what: "Electricians, plumbers, welders on priority shortage list validating AU 10/10",
    },
  ],
  logistics: [
    {
      name: "World Bank – Logistics Performance Index 2023",
      url: "https://lpi.worldbank.org",
      what: "Core LPI scores: customs, infrastructure, tracking, timeliness — primary scoring input",
    },
    {
      name: "World Population Review – LPI Rankings 2026",
      url: "https://worldpopulationreview.com/country-rankings/logistics-performance-index-by-country",
      what: "Current LPI rankings used to calibrate SG/NL/DE top scores",
    },
    {
      name: "Container News – Top Global Container Ports",
      url: "https://container-news.com/top-container-ports-key-rankings-and-insights",
      what: "Container port volumes confirming Rotterdam/Singapore/Hamburg as world leaders",
    },
    {
      name: "AJOT – Top 100 Container Ports",
      url: "https://ajot.com/premium/ajot-ajots-top-100-container-ports-ports-in-the-age-of-disruptions",
      what: "Port throughput data validating Belgium/Denmark/South Korea logistics scores",
    },
  ],
  agriculture: [
    {
      name: "CBS Netherlands – Agricultural Exports 2023–24",
      url: "https://www.cbs.nl/en-gb/news/2024/10/dutch-agricultural-exports-worth-nearly-124-billion-euros-in-2023",
      what: "NL €124B agri exports on tiny land base validating 10/10 score",
    },
    {
      name: "FAO/ITC – Agricultural Export Values by Country",
      url: "https://statbase.org/datasets/trade/agricultural-exports-value",
      what: "Absolute agricultural export volumes used to baseline country scores",
    },
    {
      name: "Andaman Partners – Global Agriculture Report 2025",
      url: "https://andamanpartners.com/2025/07/global-agriculture-producing-and-trading-the-worlds-food-and-strategic-implications-for-agri-businesses",
      what: "Agribusiness HQ density and strategic agri-investment trends",
    },
  ],
  tourism: [
    {
      name: "UNWTO – International Tourist Arrivals 2023",
      url: "https://www.unwto.org/tourism-statistics/international-tourism-and-covid-19",
      what: "Primary ranking input — France 100M, Spain 85M, Italy 57M arrivals",
    },
    {
      name: "WTTC – Economic Impact of Travel & Tourism 2024",
      url: "https://wttc.org/research/economic-impact",
      what: "Tourism contribution to GDP and employment by country",
    },
    {
      name: "Statista – International Tourist Arrivals by Country",
      url: "https://www.statista.com/statistics/233223/travel-and-tourism-total-economic-contribution-worldwide",
      what: "Cross-validated arrival volumes and tourism revenue trends",
    },
    {
      name: "Road Genius – Global Tourism Statistics 2024–26",
      url: "https://roadgenius.com/statistics/tourism",
      what: "Year-round demand seasonality and forecast arrival volumes",
    },
  ],
  arts: [
    {
      name: "IFDAQ – Global Fashion Cities Index",
      url: "https://www.amordesign.org/blog/top-fashion-capitals-of-the-world",
      what: "Fashion capital rankings placing Paris, Milan, NYC, London as Big 4",
    },
    {
      name: "Byshree – The Big 4 of Fashion",
      url: "https://byshree.com/blogs/news/what-is-the-big-4-of-fashion",
      what: "Fashion week and luxury house density confirming FR/IT/GB/US top scores",
    },
    {
      name: "Art Basel / UBS – Global Art Market Report 2024",
      url: "https://www.artbasel.com/stories/art-market-report",
      what: "Art market share by country — US 42%, UK 17%, France 7%, used for scoring",
    },
  ],
  sales: [
    {
      name: "IDA Ireland – Salesforce & SaaS EMEA Hubs",
      url: "https://www.idaireland.com/success-stories/salesforce",
      what: "Confirms Dublin as Europe's #1 SaaS EMEA sales hub validating IE 10/10",
    },
    {
      name: "Irish Times – OpenAI EMEA Sales Hub Dublin 2026",
      url: "https://www.irishtimes.com/business/2026/02/11/openai-hires-sales-chief-for-emea-hub-in-dublin",
      what: "Recent evidence of Dublin's continued dominance as EMEA sales destination",
    },
    {
      name: "LinkedIn – Why SaaS Companies Love Ireland",
      url: "https://www.linkedin.com/pulse/why-saas-companies-love-ireland-location-scale-alan-mc-glinchey",
      what: "Structural reasons behind Ireland's SaaS sales hub dominance",
    },
    {
      name: "Bridge Group – SaaS AE Compensation Report 2024",
      url: "https://bridgegroupinc.com",
      what: "SaaS Account Executive OTE benchmarks used to validate US/GB/NL/SG scores",
    },
  ],
};
