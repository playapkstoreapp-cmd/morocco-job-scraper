const fs = require('fs');

async function runScraper() {
    let allJobs = [];

    // Public Career RSS Feeds that supply exact deep links
    const rssFeeds = [
        'https://weworkremotely.com/remote-jobs.rss',
        'https://remotive.com/remote-jobs.rss'
    ];

    for (const feedUrl of rssFeeds) {
        try {
            const response = await fetch(feedUrl);
            const xmlText = await response.text();
            
            // Simple XML item regex parser
            const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);
            if (!itemMatches) continue;

            for (const item of itemMatches) {
                const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
                const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
                const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
                const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

                if (titleMatch && linkMatch) {
                    const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').trim();
                    const url = linkMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
                    const description = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').substring(0, 150).trim() + '...' : 'Click to read full description.';
                    const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

                    allJobs.push({
                        title: title,
                        url: url, // Exact deep link from RSS item
                        company: "Verified RSS Partner",
                        description: description,
                        date: pubDate,
                        type: "Full-time",
                        region: title.toLowerCase().includes('morocco') || title.toLowerCase().includes('casablanca') ? 'Morocco' : 'Global'
                    });
                }
            }
        } catch (err) {
            console.error(`Error parsing feed ${feedUrl}:`, err);
        }
    }

    // Save parsed feed items to jobs.json
    fs.writeFileSync('jobs.json', JSON.stringify(allJobs, null, 2));
    console.log(`Successfully parsed ${allJobs.length} jobs via RSS/XML feed.`);
}

runScraper();
