document.addEventListener('DOMContentLoaded', () => {
    // Example TFT Compositions
    let tftCompositions = [
        {
            id: 'kda-ahri',
            name: '학살자 벨베스',
            champions: ['Ahri', 'Akali', 'Kaisa', 'Seraphine', 'Evelynn', 'Neeko', 'Lillia', 'Gnar'],
            mainChampion: 'Ahri',
            championCost: 4, // 1~5 cost
            imageUrl: '/16-챔피언/4코/BelVeth_1762915791-BelVeth.jpg',
            votes: 0
        },
        {
            id: 'true-damage-ezreal',
            name: '리세라핀',
            champions: ['Ezreal', 'Ekko', 'Senna', 'Yasuo', 'Qiyana', 'Kennen', 'Jax', 'Yone'],
            mainChampion: 'Ezreal',
            championCost: 4,
            imageUrl: '/16-챔피언/4코/Seraphine_1762916313-Seraphine.jpg',
            votes: 0
        },
        {
            id: 'heartsteel-yone',
            name: '9렙 5코 탐켄치',
            champions: ['Yone', 'K\'Sante', 'Sett', 'Aphelios', 'Yorick', 'Kayn', 'Illaoi', 'Tahm Kench'],
            mainChampion: 'Yone',
            championCost: 5,
            imageUrl: '/16-챔피언/5코/TahmKench_1762916854-TahmKench.jpg',
            votes: 0
        },
        {
            id: 'country-samira',
            name: '아리 리롤',
            champions: ['Samira', 'Urgot', 'Tahm Kench', 'Katarina', 'Sett', 'Vex', 'Amumu', 'Mordekaiser'],
            mainChampion: 'Samira',
            championCost: 3,
            imageUrl: '/16-챔피언/3코/Ahri_1762916349-Ahri.jpg',
            votes: 0
        },
        {
            id: 'disco-blitzcrank',
            name: '이쉬탈 바드 리롤',
            champions: ['Blitzcrank', 'Taric', 'Nami', 'Gragas', 'Twisted Fate', 'Lux', 'Fizz', 'Bard'],
            mainChampion: 'Blitzcrank',
            championCost: 2,
            imageUrl: '/16-챔피언/2코/Bard_1762915765-Bard.jpg',
            votes: 0
        }
    ];

    // Load composition votes from localStorage
    tftCompositions = tftCompositions.map(comp => {
        const storedVotes = localStorage.getItem(`tft-labs-studio-comp-${comp.id}-votes`);
        return { ...comp, votes: storedVotes ? parseInt(storedVotes) : 0 };
    });

    // Helper function to get vote data from localStorage
    function getVoteData(type) {
        const data = localStorage.getItem(`tft-labs-studio-${type}-vote`);
        return data ? JSON.parse(data) : { like: 0, dislike: 0, voted: false };
    }

    // Helper function to save vote data to localStorage
    function saveVoteData(type, data) {
        localStorage.setItem(`tft-labs-studio-${type}-vote`, JSON.stringify(data));
    }

    // Function to update the display for season/patch voting
    function updateVotingDisplay(type) {
        const data = getVoteData(type);
        const total = data.like + data.dislike;
        const likePercent = total === 0 ? 0 : (data.like / total) * 100;
        const dislikePercent = total === 0 ? 0 : (data.dislike / total) * 100;

        const card = document.querySelector(`.voting-card:has(button[data-vote-type="${type}"])`);
        if (!card) return;

        card.querySelector('.progress-fill.like').style.width = `${likePercent}%`;
        card.querySelector('.progress-fill.dislike').style.width = `${dislikePercent}%`;
        card.querySelector('.percentages .like-percent').textContent = `${Math.round(likePercent)}%`;
        card.querySelector('.percentages .dislike-percent').textContent = `${Math.round(dislikePercent)}%`;

        // Disable buttons if already voted
        if (data.voted) {
            card.querySelectorAll('button').forEach(button => button.disabled = true);
        }
    }

    // Function to update Live Stats / Summary section
    function updateLiveStats() {
        const totalVotesElement = document.getElementById('total-votes');
        const topCompositionElement = document.getElementById('top-composition');
        const trendSummaryElement = document.getElementById('trend-summary');

        let totalTftCompVotes = tftCompositions.reduce((sum, comp) => sum + comp.votes, 0);

        const seasonVotes = getVoteData('season');
        const patchVotes = getVoteData('patch');
        const totalGlobalVotes = seasonVotes.like + seasonVotes.dislike + patchVotes.like + patchVotes.dislike;

        const overallTotalVotes = totalTftCompVotes + totalGlobalVotes;

        totalVotesElement.textContent = overallTotalVotes.toString();
        
        let topCompName = 'N/A';
        if (tftCompositions.length > 0) {
            const sortedCompositions = [...tftCompositions].sort((a, b) => b.votes - a.votes);
            if (sortedCompositions[0].votes > 0) {
                topCompName = sortedCompositions[0].name;
            }
        }
        topCompositionElement.textContent = topCompName;
        trendSummaryElement.textContent = '현재 데이터 분석 중...'; // Still placeholder for detailed trend
    }

    // Function to render TFT composition cards
    function renderCompositionCards() {
        const compositionGrid = document.querySelector('.composition-grid');
        compositionGrid.innerHTML = ''; // Clear existing cards

        tftCompositions.forEach(comp => {
            const card = document.createElement('div');
            card.classList.add('composition-card');
            card.dataset.id = comp.id;

            const totalVotesForComp = tftCompositions.reduce((sum, c) => sum + c.votes, 0);
            const votePercentage = totalVotesForComp === 0 ? 0 : (comp.votes / totalVotesForComp) * 100;

            card.innerHTML = `
                <h3>${comp.name}</h3>
                <div class="champion-image-container cost-${comp.championCost}">
                    <div class="hexagon-border">
                        <img src="${comp.imageUrl}" alt="${comp.mainChampion}" class="champion-main-image" />
                    </div>
                </div>
                <div class="vote-percentage">
                    <span class="percentage-value">${Math.round(votePercentage)}</span>%
                </div>
                <div class="composition-actions">
                    <button class="button vote-comp-button" data-comp-id="${comp.id}">👍 "이 조합 재밌다"</button>
                </div>
            `;
            compositionGrid.appendChild(card);
        });
    }

    // Event listeners for season/patch voting buttons
    document.querySelectorAll('.voting-card .vote-buttons .button').forEach(button => {
        button.addEventListener('click', (event) => {
            const type = event.target.dataset.voteType; // 'season' or 'patch'
            const value = event.target.dataset.voteValue; // 'like' or 'dislike'

            let voteData = getVoteData(type);

            if (!voteData.voted) { // Only allow voting once per session/category
                voteData[value]++;
                voteData.voted = true;
                saveVoteData(type, voteData);
                updateVotingDisplay(type);
                updateLiveStats(); // Update live stats after each vote
            } else {
                alert('이미 투표하셨습니다!'); // Inform user they've already voted
            }
        });
    });

    // Event listener for composition voting buttons (delegated to document)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('vote-comp-button')) {
            const compId = event.target.dataset.compId;
            let composition = tftCompositions.find(comp => comp.id === compId);

            if (composition) {
                const hasVotedForComp = localStorage.getItem(`tft-labs-studio-comp-voted-${compId}`);
                if (!hasVotedForComp) {
                    composition.votes++;
                    localStorage.setItem(`tft-labs-studio-comp-${compId}-votes`, composition.votes.toString());
                    localStorage.setItem(`tft-labs-studio-comp-voted-${compId}`, 'true'); // Mark as voted

                    renderCompositionCards(); // Re-render to update percentages
                    updateLiveStats(); // Update overall live stats

                    // Disable the button after voting
                    event.target.disabled = true;
                } else {
                    alert('이 조합에는 이미 투표하셨습니다!');
                }
            }
        }
    });

    // Initial display update on page load
    updateVotingDisplay('season');
    updateVotingDisplay('patch');
    renderCompositionCards(); // Initial render of composition cards
    updateLiveStats(); // Initial call for live stats
});