const competitionData = [
    { 
        club: "ENSIA tech community", 
        sigil: "https://via.placeholder.com/45/ff0000/ffffff?text=D", 
        categories: { dev: 1500, design: 800, ai: 2200, uiux: 1000 } 
    },
    { 
        club: "CSE Club", 
        sigil: "https://via.placeholder.com/45/999999/ffffff?text=W", 
        categories: { dev: 2100, design: 1200, ai: 1400, uiux: 900 } 
    },
    { 
        club: "Micro Club", 
        sigil: "https://via.placeholder.com/45/ffaa00/ffffff?text=L",
        categories: { dev: 900, design: 2500, ai: 1100, uiux: 1800 } 
    },
    { 
        club: "Shellmates", 
        sigil: "https://via.placeholder.com/45/004080/ffffff?text=K", 
        categories: { dev: 1800, design: 1500, ai: 1900, uiux: 1100 } 
    },
    { 
        club: "GDG Algiers", 
        sigil: "https://via.placeholder.com/45/006400/ffffff?text=S", 
        categories: { dev: 1200, design: 1000, ai: 1300, uiux: 1700 } 
    },
    { 
        club: "VIC Club", 
        sigil: "https://via.placeholder.com/45/ffd700/ffffff?text=S", 
        categories: { dev: 800, design: 900, ai: 1000, uiux: 1200 } 
    },
    {
        club: "Ingeniums Club",
        sigil: "https://via.placeholder.com/45/ffd700/ffffff?text=S",
        categories: { dev: 900, design: 500, ai: 700, uiux: 800}
    },
    {
        club: "MECA CLUB USTHB",
        sigil: "https://via.placeholder.com/45/ffd700/ffffff?text=S",
        categories: { dev: 800, design: 800, ai: 750, uiux: 1000}
    },
    {
        club: "CAP Club",
        sigil: "https://via.placeholder.com/45/ffd700/ffffff?text=S",
        categories: { dev: 1000, design: 400, ai: 600, uiux: 600}
    },
];

const categoryTitleMap = {
    'dev': 'Development',
    'design': 'Design',
    'ai': 'AI / ML',
    'uiux': 'UI / UX'
};

const contentContainer = document.getElementById('leaderboard-content');
const podiumContainer = document.getElementById('podium-display');
const popup = document.getElementById('club-details-popup');
const popupContent = document.getElementById('popup-content');
const closeBtn = document.getElementById('close-details-btn');

function getOverallLeaderboard() {
    return competitionData.map(clubData => {
        const totalPoints = Object.values(clubData.categories).reduce((sum, points) => sum + points, 0);
        return {
            ...clubData, 
            points: totalPoints 
        };
    }).sort((a, b) => b.points - a.points); 
}

function renderPodium(topThree) {
    const displayOrder = [topThree[1], topThree[0], topThree[2]]; 
    
    const rankIcons = {
        'rank-1': '<i class="fas fa-crown"></i>',
        'rank-2': '<i class="fas fa-shield-alt"></i>',
        'rank-3': '<i class="fas fa-scroll"></i>'
    };

    let html = '';
    
    displayOrder.forEach((item, index) => {
        if (!item) return;
        const rank = index === 1 ? 1 : (index === 0 ? 2 : 3);
        const rankClass = `rank-${rank}`;
        html += `
            <div class="${rankClass} podium-slot" data-club-name="${item.club}">
                <div class="podium-card">
                    <span class="podium-rank-icon">${rankIcons[rankClass]}</span>
                    <img src="${item.sigil}" alt="${item.club} Sigil" class="club-sigil">
                    <span class="club-name">${item.club}</span>
                    <span class="club-points">${item.points.toLocaleString()}</span>
                </div>
            </div>
        `;
    });

    podiumContainer.innerHTML = html;
}

function renderTable(data, startRank) {
    let html = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th class="rank-cell">Rank#</th>
                    <th>Great House (Click for Details)</th>
                    <th class="points-cell">Total Dominion</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach((item, index) => {
        const rank = startRank + index;
        
        html += `
            <tr class="club-row" data-club-name="${item.club}">
                <td class="rank-cell">${rank}</td>
                <td class="club-details">
                    <img src="${item.sigil}" alt="${item.club} Sigil" class="club-sigil">
                    <div class="club-info">
                        <span class="club-name">${item.club}</span>
                    </div>
                </td>
                <td class="points-cell">${item.points.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    contentContainer.innerHTML = html;
}

function renderFullLeaderboard() {
    const data = getOverallLeaderboard();
    const topThree = data.slice(0, 3);
    const restOfClubs = data.slice(3);

    renderPodium(topThree);
    renderTable(restOfClubs, 4);
    attachClickListeners();
}

function showClubDetails(clubName) {
    const clubData = competitionData.find(club => club.club === clubName);
    const overallData = getOverallLeaderboard(); 
    const clubOverallData = overallData.find(club => club.club === clubName);

    if (!clubData || !clubOverallData) return;

    let html = `
        <h2 class="details-header">${clubData.club}'s Challenge Ledger</h2>
        <ul class="details-category-list">
    `;
    for (const key in clubData.categories) {
        if (clubData.categories.hasOwnProperty(key)) {
            const points = clubData.categories[key];
            const name = categoryTitleMap[key];
            html += `
                <li>
                    <span class="category-label">${name}</span>
                    <span class="category-points">${points.toLocaleString()} Points</span>
                </li>
            `;
        }
    }
    html += `
            <li style="border-top: 2px solid var(--color-gold); margin-top: 15px; font-size: 1.2em;">
                <span class="category-label">Total Dominion</span>
                <span class="category-points">${clubOverallData.points.toLocaleString()}</span>
            </li>
        </ul>
    `;
    popupContent.innerHTML = html;
    popup.classList.add('visible');
}

function attachClickListeners() {
    contentContainer.querySelectorAll('.club-row').forEach(row => {
        row.addEventListener('click', () => {
            const clubName = row.dataset.clubName;
            showClubDetails(clubName);
        });
    });
    podiumContainer.querySelectorAll('.podium-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const clubName = slot.dataset.clubName;
            showClubDetails(clubName);
        });
    });
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('visible');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFullLeaderboard();
});
