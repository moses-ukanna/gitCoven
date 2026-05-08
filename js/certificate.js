// GitCoven — Completion Certificate Generator
// Creates a downloadable PDF-style certificate using Canvas

function generateCertificate() {
  if (completed.size < phases.length) {
    alert('Complete all ' + phases.length + ' phases to earn your certificate!');
    return;
  }

  var canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1100;
  var ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, 1600, 1100);

  // Border
  ctx.strokeStyle = '#3fb950';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1520, 1020);
  ctx.strokeStyle = '#21262d';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, 1496, 996);

  // Corner accents
  var corners = [[60,60],[1540,60],[60,1040],[1540,1040]];
  ctx.fillStyle = '#3fb950';
  for (var i = 0; i < corners.length; i++) {
    ctx.beginPath();
    ctx.arc(corners[i][0], corners[i][1], 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top badge
  ctx.fillStyle = '#3fb950';
  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', 800, 120);

  // Cauldron icon (simplified)
  ctx.font = '48px serif';
  ctx.fillText('🧙', 800, 190);

  // Title
  ctx.fillStyle = '#e6edf3';
  ctx.font = 'bold 56px Georgia, serif';
  ctx.fillText('GitCoven', 800, 280);

  // Subtitle
  ctx.fillStyle = '#8b949e';
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText('From Newbie to Enterprise Pro', 800, 320);

  // Divider
  ctx.strokeStyle = '#3fb950';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(500, 360);
  ctx.lineTo(1100, 360);
  ctx.stroke();

  // "This certifies that"
  ctx.fillStyle = '#8b949e';
  ctx.font = '18px Georgia, serif';
  ctx.fillText('This certifies that', 800, 420);

  // Name
  ctx.fillStyle = '#3fb950';
  ctx.font = 'bold 52px Georgia, serif';
  ctx.fillText(userName || 'Apprentice', 800, 490);

  // Underline under name
  var nameWidth = ctx.measureText(userName || 'Apprentice').width;
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(800 - nameWidth/2 - 20, 505);
  ctx.lineTo(800 + nameWidth/2 + 20, 505);
  ctx.stroke();

  // Achievement text
  ctx.fillStyle = '#c9d1d9';
  ctx.font = '22px Georgia, serif';
  ctx.fillText('has successfully completed all ' + phases.length + ' phases of the GitCoven curriculum', 800, 570);
  ctx.fillText('mastering Git from fundamental concepts to enterprise-level workflows.', 800, 605);

  // Stats row
  ctx.fillStyle = '#3fb950';
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.fillText(phases.length + ' Phases', 500, 700);
  var totalChallenges = 0;
  for (var i = 0; i < challengeState.length; i++) {
    for (var j = 0; j < challengeState[i].solved.length; j++) {
      if (challengeState[i].solved[j]) totalChallenges++;
    }
  }
  ctx.fillText(totalChallenges + ' Challenges', 800, 700);
  ctx.fillText('👑 Enterprise Pro', 1100, 700);

  ctx.fillStyle = '#484f58';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText('COMPLETED', 500, 725);
  ctx.fillText('SOLVED', 800, 725);
  ctx.fillText('RANK ACHIEVED', 1100, 725);

  // Date
  var today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#8b949e';
  ctx.font = '16px Georgia, serif';
  ctx.fillText('Issued on ' + today, 800, 810);

  // Divider
  ctx.strokeStyle = '#21262d';
  ctx.beginPath();
  ctx.moveTo(400, 860);
  ctx.lineTo(1200, 860);
  ctx.stroke();

  // Signatures
  ctx.fillStyle = '#3fb950';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('WiredHash', 550, 920);
  ctx.fillText('GitCoven', 1050, 920);

  ctx.fillStyle = '#484f58';
  ctx.font = '13px "Courier New", monospace';
  ctx.fillText('ORGANIZATION', 550, 945);
  ctx.fillText('PLATFORM', 1050, 945);

  // Footer
  ctx.fillStyle = '#30363d';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText('gitcoven.vercel.app · Verify at wiredhash.com · Certificate ID: GC-' + Date.now().toString(36).toUpperCase(), 800, 1010);

  // Download
  var link = document.createElement('a');
  link.download = 'GitCoven-Certificate-' + (userName || 'User').replace(/\s+/g, '-') + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}