
        const defaultColors = [
            '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0',
            '#4895ef', '#560bad', '#b5179e', '#f15bb5', '#00bbf9'
        ];

        
        const sampleData = [
            { name: 'Party A', votes: 34000, color: defaultColors[0], weight: 1 },
            { name: 'Party B', votes: 27000, color: defaultColors[1], weight: 1 },
            { name: 'Party C', votes: 16000, color: defaultColors[2], weight: 1 },
            { name: 'Party D', votes: 8000, color: defaultColors[3], weight: 1 },
            { name: 'Party E', votes: 4000, color: defaultColors[4], weight: 1 }
        ];

        
        let candidates = [];
        let totalSeats = 10;
        let allocationMethod = 'dhondt';
        let modifiedSainteLague = false;
        let tieBreakRule = 'votes';
        let voteInputType = 'absolute';
        let currentTheme = 'light';

        
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const totalSeatsInput = document.getElementById('totalSeats');
        const allocationMethodSelect = document.getElementById('allocationMethod');
        const modifiedSainteLagueCheckbox = document.getElementById('modifiedSainteLague');
        const tieBreakVotesRadio = document.getElementById('tieVotes');
        const tieBreakRandomRadio = document.getElementById('tieRandom');
        const inputAbsoluteRadio = document.getElementById('inputAbsolute');
        const inputPercentageRadio = document.getElementById('inputPercentage');
        const candidatesTableBody = document.getElementById('candidatesTableBody');
        const addCandidateButton = document.getElementById('addCandidate');
        const importCSVButton = document.getElementById('importCSV');
        const clearAllButton = document.getElementById('clearAll');
        const csvDataTextarea = document.getElementById('csvData');
        const parseCSVButton = document.getElementById('parseCSV');
        const noDataMessage = document.getElementById('noDataMessage');
        const resultsContent = document.getElementById('resultsContent');
        const totalVotesElement = document.getElementById('totalVotes');
        const seatsAllocatedElement = document.getElementById('seatsAllocated');
        const largestRemainderElement = document.getElementById('largestRemainder');
        const methodUsedElement = document.getElementById('methodUsed');
        const barChart = document.getElementById('barChart');
        const resultsTableBody = document.getElementById('resultsTableBody');
        const stepsContainer = document.getElementById('stepsContainer');
        const exportCSVButton = document.getElementById('exportCSV');
        const copyResultsButton = document.getElementById('copyResults');
        const printResultsButton = document.getElementById('printResults');
        const sainteLagueOptions = document.getElementById('sainteLagueOptions');

        
        function init() {
            
            candidates = JSON.parse(JSON.stringify(sampleData));
            renderCandidatesTable();
            calculateAllocation();
            
            
            setupEventListeners();
            
            
            checkReducedMotion();
        }

        
        function setupEventListeners() {
            
            themeToggle.addEventListener('click', toggleTheme);
            
            
            totalSeatsInput.addEventListener('change', updateTotalSeats);
            allocationMethodSelect.addEventListener('change', updateAllocationMethod);
            modifiedSainteLagueCheckbox.addEventListener('change', updateModifiedSainteLague);
            tieBreakVotesRadio.addEventListener('change', updateTieBreakRule);
            tieBreakRandomRadio.addEventListener('change', updateTieBreakRule);
            inputAbsoluteRadio.addEventListener('change', updateVoteInputType);
            inputPercentageRadio.addEventListener('change', updateVoteInputType);
            
            
            addCandidateButton.addEventListener('click', addCandidate);
            importCSVButton.addEventListener('click', importCSV);
            clearAllButton.addEventListener('click', clearAllCandidates);
            parseCSVButton.addEventListener('click', parseCSVData);
            
            
            exportCSVButton.addEventListener('click', exportResultsCSV);
            copyResultsButton.addEventListener('click', copyResultsToClipboard);
            printResultsButton.addEventListener('click', printResults);
        }

        
        function toggleTheme() {
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.textContent = '☀️';
                currentTheme = 'dark';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeIcon.textContent = '🌙';
                currentTheme = 'light';
            }
            
            
            localStorage.setItem('raySolverTheme', currentTheme);
        }

        
        function checkReducedMotion() {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (reducedMotionQuery.matches) {
                document.documentElement.style.setProperty('--transition', 'none');
            }
            
            reducedMotionQuery.addEventListener('change', (e) => {
                if (e.matches) {
                    document.documentElement.style.setProperty('--transition', 'none');
                } else {
                    document.documentElement.style.setProperty('--transition', 'all 0.3s ease');
                }
            });
        }

        
        function updateTotalSeats() {
            totalSeats = parseInt(totalSeatsInput.value) || 1;
            calculateAllocation();
        }

        function updateAllocationMethod() {
            allocationMethod = allocationMethodSelect.value;
            
            
            if (allocationMethod === 'sainte-lague') {
                sainteLagueOptions.classList.remove('hidden');
            } else {
                sainteLagueOptions.classList.add('hidden');
            }
            
            calculateAllocation();
        }

        function updateModifiedSainteLague() {
            modifiedSainteLague = modifiedSainteLagueCheckbox.checked;
            calculateAllocation();
        }

        function updateTieBreakRule() {
            tieBreakRule = document.querySelector('input[name="tieBreak"]:checked').value;
            calculateAllocation();
        }

        function updateVoteInputType() {
            voteInputType = document.querySelector('input[name="voteInput"]:checked').value;
            
            
            if (candidates.length > 0) {
                const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
                
                if (voteInputType === 'percentage' && totalVotes > 0) {
                    candidates.forEach(candidate => {
                        candidate.votes = Math.round((candidate.votes / totalVotes) * 10000) / 100; // Round to 2 decimal places
                    });
                } else if (voteInputType === 'absolute' && totalVotes > 100) {
                    
                    candidates.forEach(candidate => {
                        candidate.votes = Math.round(candidate.votes * 100);
                    });
                }
                
                renderCandidatesTable();
                calculateAllocation();
            }
        }

        function addCandidate() {
            const newCandidate = {
                name: `Party ${String.fromCharCode(65 + candidates.length)}`,
                votes: 0,
                color: defaultColors[candidates.length % defaultColors.length],
                weight: 1
            };
            
            candidates.push(newCandidate);
            renderCandidatesTable();
            calculateAllocation();
        }

        function removeCandidate(index) {
            candidates.splice(index, 1);
            renderCandidatesTable();
            calculateAllocation();
        }

        function updateCandidate(index, field, value) {
            if (field === 'votes') {
                value = parseFloat(value) || 0;
                if (voteInputType === 'percentage' && value > 100) {
                    value = 100;
                }
            } else if (field === 'weight') {
                value = parseFloat(value) || 1;
                if (value <= 0) value = 1;
            }
            
            candidates[index][field] = value;
            calculateAllocation();
        }

        function updateCandidateColor(index, color) {
            candidates[index].color = color;
            calculateAllocation();
        }

        function clearAllCandidates() {
            if (confirm('Are you sure you want to remove all candidates?')) {
                candidates = [];
                renderCandidatesTable();
                calculateAllocation();
            }
        }

        function importCSV() {
            csvDataTextarea.focus();
        }

        function parseCSVData() {
            const csvText = csvDataTextarea.value.trim();
            if (!csvText) return;
            
            try {
                const lines = csvText.split('\n');
                const newCandidates = [];
                
                for (const line of lines) {
                    const [name, votesStr] = line.split(',').map(item => item.trim());
                    if (!name || !votesStr) continue;
                    
                    const votes = parseFloat(votesStr);
                    if (isNaN(votes)) continue;
                    
                    newCandidates.push({
                        name,
                        votes,
                        color: defaultColors[newCandidates.length % defaultColors.length],
                        weight: 1
                    });
                }
                
                if (newCandidates.length > 0) {
                    candidates = newCandidates;
                    renderCandidatesTable();
                    calculateAllocation();
                }
            } catch (error) {
                alert('Error parsing CSV data. Please check the format.');
                console.error(error);
            }
        }

        function renderCandidatesTable() {
            candidatesTableBody.innerHTML = '';
            
            if (candidates.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `<td colspan="5" class="text-center">No candidates added yet</td>`;
                candidatesTableBody.appendChild(emptyRow);
                return;
            }
            
            candidates.forEach((candidate, index) => {
                const row = document.createElement('tr');
                row.className = 'candidate-row added';
                
                row.innerHTML = `
                    <td>
                        <input type="text" class="form-control" value="${candidate.name}" 
                               onchange="updateCandidate(${index}, 'name', this.value)">
                    </td>
                    <td>
                        <input type="color" class="color-picker" value="${candidate.color}" 
                               onchange="updateCandidateColor(${index}, this.value)">
                    </td>
                    <td>
                        <input type="number" class="form-control" value="${candidate.votes}" 
                               min="0" ${voteInputType === 'percentage' ? 'max="100" step="0.01"' : ''}
                               onchange="updateCandidate(${index}, 'votes', this.value)">
                    </td>
                    <td>
                        <input type="number" class="form-control" value="${candidate.weight}" 
                               min="0.1" step="0.1" onchange="updateCandidate(${index}, 'weight', this.value)">
                    </td>
                    <td>
                        <button class="btn btn-danger" onclick="removeCandidate(${index})">Remove</button>
                    </td>
                `;
                
                candidatesTableBody.appendChild(row);
            });
        }

        function calculateAllocation() {
            if (candidates.length === 0 || totalSeats < 1) {
                noDataMessage.classList.remove('hidden');
                resultsContent.classList.add('hidden');
                return;
            }
            
            noDataMessage.classList.add('hidden');
            resultsContent.classList.remove('hidden');
            
            let totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
            
            let workingVotes;
            if (voteInputType === 'percentage') {
                workingVotes = candidates.map(candidate => ({
                    ...candidate,
                    absoluteVotes: (candidate.votes / 100) * 10000 
                }));
                totalVotes = 10000; 
            } else {
                workingVotes = candidates.map(candidate => ({
                    ...candidate,
                    absoluteVotes: candidate.votes
                }));
            }
            
            let allocationResult;
            if (allocationMethod === 'dhondt') {
                allocationResult = calculateDHondt(workingVotes, totalSeats);
            } else {
                allocationResult = calculateSainteLague(workingVotes, totalSeats, modifiedSainteLague);
            }
           
            displayResults(allocationResult, totalVotes);
        }

        function calculateDHondt(candidates, seats) {
            
            const result = candidates.map(candidate => ({
                ...candidate,
                seats: 0,
                quotients: []
            }));
            
            const allocationSteps = [];
           
            for (let seat = 1; seat <= seats; seat++) {
                let maxQuotient = -1;
                let winnerIndex = -1;
              
                for (let i = 0; i < result.length; i++) {
                    const quotient = result[i].absoluteVotes / (result[i].seats + 1);
                    result[i].quotients.push(quotient);
                    
                    if (quotient > maxQuotient) {
                        maxQuotient = quotient;
                        winnerIndex = i;
                    } else if (quotient === maxQuotient) {
                        if (tieBreakRule === 'votes' && result[i].absoluteVotes > result[winnerIndex].absoluteVotes) {
                            winnerIndex = i;
                        } else if (tieBreakRule === 'random') {
                            const randomValue = deterministicRandom(result[i].name + seat);
                            const currentRandom = deterministicRandom(result[winnerIndex].name + seat);
                            if (randomValue > currentRandom) {
                                winnerIndex = i;
                            }
                        }
                    }
                }

                result[winnerIndex].seats++;
                allocationSteps.push({
                    seat,
                    candidate: result[winnerIndex].name,
                    color: result[winnerIndex].color,
                    quotient: maxQuotient
                });
            }
            
            return {
                candidates: result,
                steps: allocationSteps
            };
        }

        function calculateSainteLague(candidates, seats, modified = false) {
            const result = candidates.map(candidate => ({
                ...candidate,
                seats: 0,
                quotients: []
            }));
            
            const allocationSteps = [];
            const firstDivisor = modified ? 1.4 : 1;
            
            for (let seat = 1; seat <= seats; seat++) {
                let maxQuotient = -1;
                let winnerIndex = -1;
                
                for (let i = 0; i < result.length; i++) {
                    const divisor = result[i].seats === 0 ? firstDivisor : 2 * result[i].seats + 1;
                    const quotient = result[i].absoluteVotes / divisor;
                    result[i].quotients.push(quotient);
                    
                    if (quotient > maxQuotient) {
                        maxQuotient = quotient;
                        winnerIndex = i;
                    } else if (quotient === maxQuotient) {
                        if (tieBreakRule === 'votes' && result[i].absoluteVotes > result[winnerIndex].absoluteVotes) {
                            winnerIndex = i;
                        } else if (tieBreakRule === 'random') {
                            const randomValue = deterministicRandom(result[i].name + seat);
                            const currentRandom = deterministicRandom(result[winnerIndex].name + seat);
                            if (randomValue > currentRandom) {
                                winnerIndex = i;
                            }
                        }
                    }
                }
                
                result[winnerIndex].seats++;
                allocationSteps.push({
                    seat,
                    candidate: result[winnerIndex].name,
                    color: result[winnerIndex].color,
                    quotient: maxQuotient
                });
            }
            
            return {
                candidates: result,
                steps: allocationSteps
            };
        }

        function deterministicRandom(seed) {
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                const char = seed.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; 
            }
            return (hash % 10000) / 10000; 
        }

        
        function displayResults(result, totalVotes) {
            const { candidates: resultCandidates, steps } = result;
            
            
            totalVotesElement.textContent = formatNumber(totalVotes);
            seatsAllocatedElement.textContent = totalSeats;
            largestRemainderElement.textContent = calculateLargestRemainder(resultCandidates, totalVotes, totalSeats);
            methodUsedElement.textContent = allocationMethod === 'dhondt' ? 'D\'Hondt' : 
                                           modifiedSainteLague ? 'Modified Sainte-Laguë' : 'Sainte-Laguë';
            
            
            renderBarChart(resultCandidates, totalSeats);
            
            
            renderResultsTable(resultCandidates, totalVotes);
            
            
            renderAllocationSteps(steps);
        }

        
        function calculateLargestRemainder(candidates, totalVotes, totalSeats) {
            
            const votesPerSeat = totalVotes / totalSeats;
            let maxRemainder = 0;
            
            for (const candidate of candidates) {
                const exactSeats = candidate.absoluteVotes / votesPerSeat;
                const remainder = exactSeats - Math.floor(exactSeats);
                if (remainder > maxRemainder) {
                    maxRemainder = remainder;
                }
            }
            
            return (maxRemainder * votesPerSeat).toFixed(0);
        }

        
        function renderBarChart(candidates, totalSeats) {
            barChart.innerHTML = '';
            
            
            const sortedCandidates = [...candidates].sort((a, b) => b.seats - a.seats);
            
            for (const candidate of sortedCandidates) {
                if (candidate.seats === 0) continue;
                
                const percentage = (candidate.seats / totalSeats) * 100;
                
                const barLabel = document.createElement('div');
                barLabel.className = 'bar-label';
                barLabel.innerHTML = `
                    <span>${candidate.name}</span>
                    <span>${candidate.seats} seat${candidate.seats !== 1 ? 's' : ''} (${percentage.toFixed(1)}%)</span>
                `;
                
                const barContainer = document.createElement('div');
                barContainer.className = 'bar-container';
                
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.backgroundColor = candidate.color;
                bar.style.width = '0%'; // Start at 0 for animation
                bar.textContent = candidate.seats > 0 ? `${candidate.seats} seat${candidate.seats !== 1 ? 's' : ''}` : '';
                
                barContainer.appendChild(bar);
                barChart.appendChild(barLabel);
                barChart.appendChild(barContainer);
                
                
                setTimeout(() => {
                    bar.style.width = `${percentage}%`;
                }, 100);
            }
        }

        
        function renderResultsTable(candidates, totalVotes) {
            resultsTableBody.innerHTML = '';
            
            
            const sortedCandidates = [...candidates].sort((a, b) => {
                if (b.seats !== a.seats) return b.seats - a.seats;
                return b.absoluteVotes - a.absoluteVotes;
            });
            
            for (const candidate of sortedCandidates) {
                const votePercentage = (candidate.absoluteVotes / totalVotes) * 100;
                const row = document.createElement('tr');
                
                
                const change = 0;
                
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${candidate.color};"></div>
                            ${candidate.name}
                        </div>
                    </td>
                    <td>${formatNumber(candidate.absoluteVotes)}</td>
                    <td>${votePercentage.toFixed(2)}%</td>
                    <td>${candidate.seats}</td>
                    <td>
                        <span class="seat-change ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}">
                            ${change > 0 ? '+' : ''}${change}
                        </span>
                    </td>
                `;
                
                resultsTableBody.appendChild(row);
            }
        }

        
        function renderAllocationSteps(steps) {
            stepsContainer.innerHTML = '';
            
            for (const step of steps) {
                const stepElement = document.createElement('div');
                stepElement.className = 'step';
                stepElement.innerHTML = `
                    <div class="step-color" style="background-color: ${step.color};"></div>
                    <span><strong>Seat ${step.seat}:</strong> ${step.candidate}</span>
                `;
                
                stepsContainer.appendChild(stepElement);
            }
        }

        
        function exportResultsCSV() {
            if (candidates.length === 0) return;
            
            const headers = ['Candidate', 'Votes', 'Percentage', 'Seats'];
            const csvContent = [
                headers.join(','),
                ...candidates.map(candidate => {
                    const percentage = (candidate.absoluteVotes / candidates.reduce((sum, c) => sum + c.absoluteVotes, 0)) * 100;
                    return [
                        candidate.name,
                        candidate.absoluteVotes,
                        percentage.toFixed(2),
                        candidate.seats
                    ].join(',');
                })
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'allocation_results.csv';
            a.click();
            URL.revokeObjectURL(url);
        }

        
        function copyResultsToClipboard() {
            if (candidates.length === 0) return;
            
            const resultsText = candidates.map(candidate => {
                const percentage = (candidate.absoluteVotes / candidates.reduce((sum, c) => sum + c.absoluteVotes, 0)) * 100;
                return `${candidate.name}: ${candidate.seats} seats (${percentage.toFixed(2)}% of votes)`;
            }).join('\n');
            
            navigator.clipboard.writeText(resultsText).then(() => {
                // Show success feedback
                const originalText = copyResultsButton.textContent;
                copyResultsButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyResultsButton.textContent = originalText;
                }, 2000);
            });
        }

       
        function printResults() {
            window.print();
        }

        
        function formatNumber(num) {
            return num.toLocaleString();
        }

        
        function loadThemePreference() {
            const savedTheme = localStorage.getItem('raySolverTheme');
            if (savedTheme) {
                currentTheme = savedTheme;
                if (currentTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    themeIcon.textContent = '☀️';
                }
            }
        }

       
        document.addEventListener('DOMContentLoaded', () => {
            loadThemePreference();
            init();
        });

       
        window.updateCandidate = updateCandidate;
        window.updateCandidateColor = updateCandidateColor;
        window.removeCandidate = removeCandidate;
