(() => {
  const source = document.getElementById('cattleya-retention-data');
  const controls = document.querySelector('.cattleya-cohorts');
  if (!source || !controls) return;
  const data = JSON.parse(source.textContent);
  const buttons = [...document.querySelectorAll('[data-cohort]')];
  const notes = {
    all: 'Includes mixed and slipping contacts. Two adhesive/preload failures and two single-caudicle pulls are excluded from the 20-trial total.',
    clean: 'Selected for usable contact and a single failure pathway. There is no contact-clean trial at 75 mm/min; this subset does not establish an all-or-none rate switch across all trials.'
  };
  function show(id) {
    const cohort = data.find(row => row.id === id);
    if (!cohort) return;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cohort === id)));
    document.getElementById('retention-heading').textContent = cohort.label;
    document.getElementById('retention-note').textContent = notes[id];
    cohort.groups.forEach((group, i) => {
      const track = document.getElementById('retention-bar-' + i);
      track.querySelector('span').style.width = group.possible ? (100 * group.retained / group.possible) + '%' : '0%';
      track.setAttribute('aria-label', group.possible ? group.retained + ' of ' + group.possible + ' pollinia retained; ' + group.trials + ' trials' : 'No contact-clean trial at this rate');
      document.getElementById('retention-value-' + i).innerHTML = group.possible ? group.retained + '/' + group.possible + ' <small>· ' + group.trials + ' ' + (group.trials === 1 ? 'trial' : 'trials') + '</small>' : '<small>No clean trial</small>';
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.cohort)));
  show('all');
  controls.hidden = false;
})();
