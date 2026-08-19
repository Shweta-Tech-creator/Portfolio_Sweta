/**
 * Auto-Cycling & Multi-Year GitHub Contribution Calendar Controller
 * Transitions between 2026, 2025, 2024 automatically every 4.5 seconds
 */
(function() {
  const years = ['2026', '2025', '2024'];
  let currentIdx = 0;
  let cycleTimer = null;
  let isAutoCycling = true;

  function switchYear(year, isManual = false) {
    const wrap = document.getElementById('ghExactCalendarWrap');
    const titleEl = document.getElementById('ghContributionTitle');
    const periodEl = document.getElementById('ghContributionPeriod');
    const tabs = document.querySelectorAll('.gh-year-btn');
    
    const yearData = window.GH_YEARLY_DATA && window.GH_YEARLY_DATA[year];
    if (!wrap || !yearData) return;

    // Update active tab
    tabs.forEach(tab => {
      if (tab.getAttribute('data-year') === year) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update title and period
    if (titleEl) {
      titleEl.innerHTML = `<span class="gh-heat-num">${yearData.total}</span> Contributions in <span class="gh-heat-year">${year}</span>`;
    }
    if (periodEl) {
      periodEl.textContent = `Activity: ${yearData.period}`;
    }

    // Smooth transition
    wrap.style.opacity = '0';
    wrap.style.transform = 'translateY(3px) scale(0.99)';
    wrap.style.transition = 'opacity 0.22s ease, transform 0.22s ease';

    setTimeout(() => {
      wrap.innerHTML = yearData.svg;
      wrap.style.opacity = '1';
      wrap.style.transform = 'translateY(0) scale(1)';
    }, 220);

    // Update index
    currentIdx = years.indexOf(year);

    if (isManual) {
      resetCycleTimer(7000);
    }
  }

  function nextYear() {
    currentIdx = (currentIdx + 1) % years.length;
    switchYear(years[currentIdx], false);
  }

  function resetCycleTimer(duration = 4500) {
    if (cycleTimer) clearInterval(cycleTimer);
    if (isAutoCycling) {
      cycleTimer = setInterval(nextYear, duration);
    }
  }

  function initControls() {
    const tabs = document.querySelectorAll('.gh-year-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const year = tab.getAttribute('data-year');
        if (year) {
          switchYear(year, true);
        }
      });
    });

    const toggleBtn = document.getElementById('ghAutoCycleToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isAutoCycling = !isAutoCycling;
        toggleBtn.classList.toggle('active', isAutoCycling);
        toggleBtn.innerHTML = isAutoCycling 
          ? '<i class="fa-solid fa-arrows-rotate fa-spin" style="--fa-animation-duration: 4s;"></i> Live Cycle' 
          : '<i class="fa-solid fa-pause"></i> Paused';
        if (isAutoCycling) {
          resetCycleTimer();
        } else if (cycleTimer) {
          clearInterval(cycleTimer);
        }
      });
    }

    // Initial render
    switchYear('2026', false);
    resetCycleTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initControls);
  } else {
    initControls();
  }
})();
