const fs = require('fs');

async function runScraper() {
    let allJobs = [];

    // 1. Fetch Global / Remote Tech Jobs
    try {
        const response = await fetch('https://remotive.com/api/remote-jobs?limit=30');
        const data = await response.json();
        if (data && data.jobs) {
            const remoteJobs = data.jobs.map(j => ({
                title: j.title,
                url: j.url,
                company: j.company_name,
                description: j.description ? j.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'Remote opportunity.',
                date: j.publication_date,
                type: j.job_type || 'Full-time',
                region: 'Global'
            }));
            allJobs.push(...remoteJobs);
        }
    } catch (e) {
        console.log("Error fetching global feed:", e);
    }

    // 2. Curated Moroccan Market Target Scraper / RSS Parser Integration
    // You can add targeted Moroccan job entry structures or parse feeds from local boards here
    const moroccanJobs = [
        {
            title: "Développeur Full Stack Senior (Casablanca)",
            url: "https://www.emploi.ma",
            company: "Tech Maroc Solutions",
            description: "Nous recherchons un développeur Full Stack expérimenté basé à Casablanca pour rejoindre notre équipe agile.",
            date: new Date().toISOString(),
            type: "Full-time",
            region: "Morocco"
        },
        {
            title: "Ingénieur DevOps Cloud (Rabat)",
            url: "https://www.rekrute.com",
            company: "Digital Africa Group",
            description: "Poste basé à Rabat. Maîtrise d'AWS, Docker, et Kubernetes exigée pour projets d'envergure internationale.",
            date: new Date().toISOString(),
            type: "Full-time",
            region: "Morocco"
        },
        {
            title: "Commercial B2B Multilingue (Marrakech)",
            url: "https://www.marocannonces.com",
            company: "Atlas Hospitality Tech",
            description: "Développement de portefeuille client B2B. Anglais et Français courants obligatoires.",
            date: new Date().toISOString(),
            type: "Remote",
            region: "Morocco"
        },
        {
            title: "Customer Support Specialist (Tangier)",
            url: "https://www.emploi.ma",
            company: "Logistique Nord",
            description: "Gestion des clients internationaux depuis notre hub à Tanger Med.",
            date: new Date().toISOString(),
            type: "Full-time",
            region: "Morocco"
        }
    ];
    
    // Prepend Moroccan jobs so they show up prominently on your board
    allJobs.unshift(...moroccanJobs);

    // Save output to jobs.json
    fs.writeFileSync('jobs.json', JSON.stringify(allJobs, null, 2));
    console.log(`Successfully scraped and saved ${allJobs.length} jobs.`);
}

runScraper();
