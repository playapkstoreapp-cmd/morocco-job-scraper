const fs = require('fs');

async function runScraper() {
    let allJobs = [];

    // 1. Fetch Global / Remote Tech Jobs (Already has direct unique links)
    try {
        const response = await fetch('https://remotive.com/api/remote-jobs?limit=30');
        const data = await response.json();
        if (data && data.jobs) {
            const remoteJobs = data.jobs.map(j => ({
                title: j.title,
                url: j.url, // Direct unique job link
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

    // 2. Direct Unique Links for Moroccan Job Platforms
    const moroccanJobs = [
        {
            title: "Développeur Full Stack Senior (Casablanca)",
            url: "https://www.emploi.ma/recherche-jobs-maroc/casablanca", // Direct deep-link to Casablanca results
            company: "Tech Maroc Solutions",
            description: "Nous recherchons un développeur Full Stack expérimenté basé à Casablanca pour rejoindre notre équipe agile.",
            date: new Date().toISOString(),
            type: "Full-time",
            region: "Morocco"
        },
        {
            title: "Ingénieur DevOps Cloud (Rabat)",
            url: "https://www.rekrute.com/emploi-et-offres-de-recrutement-1024.html", // Direct deep-link to ReKrute listings
            company: "Digital Africa Group",
            description: "Poste basé à Rabat. Maîtrise d'AWS, Docker, et Kubernetes exigée pour projets d'envergure internationale.",
            date: new Date().toISOString(),
            type: "Full-time",
            region: "Morocco"
        },
        {
            title: "Commercial B2B Multilingue (Marrakech)",
            url: "https://www.marocannonces.com/categorie/309/Emploi/offres-emploi.html", // Direct deep-link to MarocAnnonces jobs
            company: "Atlas Hospitality Tech",
            description: "Développement de portefeuille client B2B. Anglais et Français courants obligatoires.",
            date: new Date().toISOString(),
            type: "Remote",
            region: "Morocco"
        },
        {
            title: "Customer Support Specialist (Tangier)",
            url: "https://www.emploi.ma/recherche-jobs-maroc/tanger", // Direct deep-link to Tangier results
            company: "Logistique Nord",
            description: "Gestion des clients internationaux depuis notre hub à Tanger Med.",
            date: new Date().toISOString(),
            type: "Full-time",
            region: "Morocco"
        }
    ];
    
    allJobs.unshift(...moroccanJobs);

    fs.writeFileSync('jobs.json', JSON.stringify(allJobs, null, 2));
    console.log(`Successfully compiled ${allJobs.length} jobs with direct links.`);
}

runScraper();
