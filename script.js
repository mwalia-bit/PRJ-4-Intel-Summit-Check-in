// Reset Attendance logic
document.getElementById('resetBtn').addEventListener('click', function() {
	attendeeList = [];
	totalAttendees = 0;
	teamCounts = { water: 0, zero: 0, power: 0 };
	saveProgress();
	saveAttendeeList();
	updateCounts();
	updateProgressBar();
	renderAttendeeList();
	greetingEl.textContent = '';
	celebrationEl.style.display = 'none';
	document.querySelectorAll('.team-card').forEach(card => card.classList.remove('winner'));
});
// Attendee list feature
let attendeeList = [];

function loadAttendeeList() {
	const savedList = localStorage.getItem('attendeeList');
	if (savedList) attendeeList = JSON.parse(savedList);
}

function saveAttendeeList() {
	localStorage.setItem('attendeeList', JSON.stringify(attendeeList));
}

function renderAttendeeList() {
	let attendeeListEl = document.getElementById('attendeeList');
	if (!attendeeListEl) {
		// Create attendee list container if not present
		const container = document.querySelector('.container');
		const listContainer = document.createElement('div');
		listContainer.className = 'attendee-list-container';
		listContainer.innerHTML = '<h3>Attendee List</h3><ul id="attendeeList"></ul>';
		container.appendChild(listContainer);
		attendeeListEl = document.getElementById('attendeeList');
	}
	attendeeListEl.innerHTML = '';
	attendeeList.forEach(att => {
		const li = document.createElement('li');
		li.textContent = `${att.name} (${att.teamName})`;
		attendeeListEl.appendChild(li);
	});
}
// Intel Summit Check-In Core Logic
const attendeeCountEl = document.getElementById('attendeeCount');
const waterCountEl = document.getElementById('waterCount');
const zeroCountEl = document.getElementById('zeroCount');
const powerCountEl = document.getElementById('powerCount');
const greetingEl = document.getElementById('greeting');
const progressBarEl = document.getElementById('progressBar');
const checkInForm = document.getElementById('checkInForm');

// Celebration message element
let celebrationEl = document.getElementById('celebration');
if (!celebrationEl) {
	celebrationEl = document.createElement('div');
	celebrationEl.id = 'celebration';
	celebrationEl.style.display = 'none';
	celebrationEl.style.textAlign = 'center';
	celebrationEl.style.fontSize = '1.5em';
	celebrationEl.style.margin = '20px 0';
	document.querySelector('.container').appendChild(celebrationEl);
}

let totalAttendees = 0;
let teamCounts = {
	water: 0,
	zero: 0,
	power: 0
};
// Load from localStorage if available
function loadProgress() {
	const savedTotal = localStorage.getItem('totalAttendees');
	const savedTeams = localStorage.getItem('teamCounts');
	if (savedTotal !== null) totalAttendees = parseInt(savedTotal, 10);
	if (savedTeams) teamCounts = JSON.parse(savedTeams);
}
function saveProgress() {
	localStorage.setItem('totalAttendees', totalAttendees);
	localStorage.setItem('teamCounts', JSON.stringify(teamCounts));
}
const ATTENDANCE_GOAL = 50;

function updateCounts() {
	attendeeCountEl.textContent = totalAttendees;
	waterCountEl.textContent = teamCounts.water;
	zeroCountEl.textContent = teamCounts.zero;
	powerCountEl.textContent = teamCounts.power;
}

function updateProgressBar() {
	const percent = Math.min((totalAttendees / ATTENDANCE_GOAL) * 100, 100);
	progressBarEl.style.width = percent + '%';
	progressBarEl.textContent = percent >= 100 ? 'Goal Reached!' : '';
	if (percent >= 100) {
		triggerCelebration();
	}
}
function triggerCelebration() {
	// Find the winning team
	const maxCount = Math.max(teamCounts.water, teamCounts.zero, teamCounts.power);
	let winningTeams = [];
	for (const team in teamCounts) {
		if (teamCounts[team] === maxCount && maxCount > 0) {
			winningTeams.push(team);
		}
	}
	let teamNames = winningTeams.map(team => {
		if (team === 'water') return 'Team Water Wise';
		if (team === 'zero') return 'Team Net Zero';
		if (team === 'power') return 'Team Renewables';
		return '';
	});
	celebrationEl.innerHTML = `<span style="color: #0071c5; font-weight: bold;">🎉 Attendance goal reached!</span><br>Winning team${teamNames.length > 1 ? 's' : ''}: <span style="color: #28a745;">${teamNames.join(', ')}</span>`;
	celebrationEl.style.display = 'block';
	// Highlight winning team card(s)
	document.querySelectorAll('.team-card').forEach(card => {
		card.classList.remove('winner');
	});
	winningTeams.forEach(team => {
		let cardClass = '';
		if (team === 'water') cardClass = '.team-card.water';
		if (team === 'zero') cardClass = '.team-card.zero';
		if (team === 'power') cardClass = '.team-card.power';
		const card = document.querySelector(cardClass);
		if (card) card.classList.add('winner');
	});
}

function showGreeting(name, team) {
	let teamName = '';
	if (team === 'water') teamName = 'Team Water Wise';
	else if (team === 'zero') teamName = 'Team Net Zero';
	else if (team === 'power') teamName = 'Team Renewables';
	const messages = [
		`Welcome, ${name}! Ready to make an impact with ${teamName}?`,
		`Hi ${name}, thanks for checking in! ${teamName} appreciates your support.`,
		`Great to see you, ${name}! ${teamName} is stronger with you. Let’s make a difference together!`,
		`Go ${teamName}! Welcome aboard, ${name}. Your participation helps us reach our sustainability goals!`,
		`🎉 Welcome, ${name}! ${teamName} just got even better. Let’s make this summit unforgettable!`,
		`Welcome, ${name}! Did you know ${teamName} is leading the way in sustainability? Glad you’re with us!`
	];
	const randomMsg = messages[Math.floor(Math.random() * messages.length)];
	greetingEl.textContent = randomMsg;
	greetingEl.style.display = 'block';
	// Confetti animation
	if (window.confetti) {
		confetti({
			particleCount: 120,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#0071c5', '#28a745', '#ffd700', '#00cfff']
		});
	}
}

checkInForm.addEventListener('submit', function(e) {
	e.preventDefault();
	const name = document.getElementById('attendeeName').value.trim();
	const team = document.getElementById('teamSelect').value;
	if (!name || !team) return;
	totalAttendees++;
	teamCounts[team]++;
	updateCounts();
	updateProgressBar();
	showGreeting(name, team);
	saveProgress();
	checkInForm.reset();

  // Add attendee to list and save
  let teamName = '';
  if (team === 'water') teamName = 'Team Water Wise';
  else if (team === 'zero') teamName = 'Team Net Zero';
  else if (team === 'power') teamName = 'Team Renewables';
  attendeeList.push({ name, teamName });
  saveAttendeeList();
  renderAttendeeList();
});

// Initial render
loadProgress();
updateCounts();
updateProgressBar();

loadAttendeeList();
renderAttendeeList();
