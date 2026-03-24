/* ============================================
   Flafka ROI Calculator — W85-2
   Vanilla JS, no dependencies
   ============================================ */

(function () {
  'use strict';

  var SEAT_PRICE = 19; // $/seat/month
  var REDUCTION_FACTOR = 0.5; // conservative 50% time reduction
  var CFU_OPTIMIZATION = 0.15; // 15% CFU cost reduction with Flafka visibility
  var DEBOUNCE_MS = 50;

  // DOM references
  var els = {};
  var debounceTimer = null;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    els.teamSize = document.getElementById('roi-team-size');
    els.hours = document.getElementById('roi-hours');
    els.hourlyRate = document.getElementById('roi-hourly-rate');
    els.monthlySpend = document.getElementById('roi-monthly-spend');
    els.teamSizeValue = document.getElementById('roi-team-size-value');
    els.hoursValue = document.getElementById('roi-hours-value');
    els.monthlySpendValue = document.getElementById('roi-monthly-spend-value');
    els.annualSavings = document.getElementById('roi-annual-savings');
    els.roiPercentage = document.getElementById('roi-percentage');
    els.roiBadge = document.getElementById('roi-badge');
    els.timeSaved = document.getElementById('roi-time-saved');
    els.payback = document.getElementById('roi-payback');
    els.cfuSavings = document.getElementById('roi-cfu-savings');
    els.barCurrent = document.getElementById('roi-bar-current');
    els.barFlafka = document.getElementById('roi-bar-flafka');
    els.barSavings = document.getElementById('roi-bar-savings');
    els.enterpriseNote = document.getElementById('roi-enterprise-note');
    els.copyLink = document.getElementById('roi-copy-link');
    els.copiedMsg = document.getElementById('roi-copied-msg');

    if (!els.teamSize || !els.hours) return;

    // Bind inputs
    els.teamSize.addEventListener('input', onSliderInput);
    els.hours.addEventListener('input', onSliderInput);
    els.monthlySpend.addEventListener('input', onSliderInput);
    els.hourlyRate.addEventListener('input', onNumberInput);

    // Copy link
    if (els.copyLink) {
      els.copyLink.addEventListener('click', copyShareableLink);
    }

    // Load from URL params if present
    loadFromURL();

    // Initial calculation
    calculate();
  }

  function onSliderInput() {
    // Update displayed value immediately
    if (els.teamSizeValue) {
      els.teamSizeValue.textContent = els.teamSize.value;
      els.teamSize.setAttribute('aria-valuenow', els.teamSize.value);
      els.teamSize.setAttribute('aria-valuetext', els.teamSize.value + ' engineers');
    }
    if (els.hoursValue) {
      els.hoursValue.textContent = parseFloat(els.hours.value).toFixed(1);
      els.hours.setAttribute('aria-valuenow', els.hours.value);
      els.hours.setAttribute('aria-valuetext', els.hours.value + ' hours per week');
    }
    if (els.monthlySpendValue) {
      els.monthlySpendValue.textContent = '$' + formatNumber(parseInt(els.monthlySpend.value, 10));
      els.monthlySpend.setAttribute('aria-valuenow', els.monthlySpend.value);
      els.monthlySpend.setAttribute('aria-valuetext', '$' + formatNumber(parseInt(els.monthlySpend.value, 10)) + ' per month');
    }
    debouncedCalculate();
  }

  function onNumberInput() {
    debouncedCalculate();
  }

  function debouncedCalculate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(calculate, DEBOUNCE_MS);
  }

  function calculate() {
    var teamSize = parseInt(els.teamSize.value, 10) || 5;
    var hoursPerWeek = parseFloat(els.hours.value) || 2;
    var hourlyRate = parseFloat(els.hourlyRate.value) || 75;
    var monthlySpend = parseFloat(els.monthlySpend.value) || 10000;

    // Clamp values
    teamSize = Math.max(1, Math.min(50, teamSize));
    hoursPerWeek = Math.max(0.5, Math.min(5, hoursPerWeek));
    hourlyRate = Math.max(50, Math.min(200, hourlyRate));
    monthlySpend = Math.max(500, Math.min(100000, monthlySpend));

    // Time savings: team debugging hours reduced by 50%
    var monthlyTimeSaved = teamSize * hoursPerWeek * 4.33 * REDUCTION_FACTOR; // hours/month
    var monthlyTimeCostSavings = monthlyTimeSaved * hourlyRate;

    // CFU optimization savings: 15% of monthly Confluent bill
    var monthlyCfuSavings = monthlySpend * CFU_OPTIMIZATION;

    // Total savings
    var totalMonthlySavings = monthlyTimeCostSavings + monthlyCfuSavings;
    var annualSavings = totalMonthlySavings * 12;
    var flafkaCostAnnual = teamSize * SEAT_PRICE * 12;
    var netSavings = annualSavings - flafkaCostAnnual;
    var roiPercent = flafkaCostAnnual > 0 ? (netSavings / flafkaCostAnnual) * 100 : 0;
    var paybackMonths = totalMonthlySavings > 0 ? flafkaCostAnnual / totalMonthlySavings : 0;

    // Current total cost = debugging cost + Confluent spend (annual)
    var annualCurrentCost = (teamSize * hoursPerWeek * 4.33 * hourlyRate * 12) + (monthlySpend * 12);
    // With Flafka = reduced debugging + reduced Confluent spend + Flafka license
    var annualWithFlafka = annualCurrentCost - annualSavings + flafkaCostAnnual;

    // Update outputs
    updateValue(els.annualSavings, '$' + formatNumber(Math.round(netSavings)));
    updateValue(els.roiPercentage, Math.round(roiPercent) + '%');
    updateValue(els.timeSaved, Math.round(monthlyTimeSaved) + ' hours');
    updateValue(els.payback, paybackMonths < 1 ? '< 1 month' : Math.ceil(paybackMonths) + ' months');
    updateValue(els.cfuSavings, '$' + formatNumber(Math.round(monthlyCfuSavings)) + '/mo');

    // ROI badge
    if (els.roiBadge) {
      if (roiPercent >= 100) {
        els.roiBadge.className = 'roi-badge roi-badge--strong';
        els.roiBadge.textContent = 'Strong ROI (' + Math.round(roiPercent) + '%)';
      } else if (roiPercent >= 50) {
        els.roiBadge.className = 'roi-badge roi-badge--moderate';
        els.roiBadge.textContent = 'Moderate ROI (' + Math.round(roiPercent) + '%)';
      } else {
        els.roiBadge.className = 'roi-badge roi-badge--low';
        els.roiBadge.textContent = 'Low ROI (' + Math.round(roiPercent) + '%)';
      }
    }

    // Bar chart: Current Cost vs With Flafka
    var maxCost = Math.max(annualCurrentCost, annualWithFlafka, 1);
    updateBar(els.barCurrent, annualCurrentCost, maxCost, '$' + formatNumber(Math.round(annualCurrentCost)));
    updateBar(els.barFlafka, annualWithFlafka, maxCost, '$' + formatNumber(Math.round(annualWithFlafka)));
    updateBar(els.barSavings, Math.max(0, netSavings), maxCost, '$' + formatNumber(Math.round(Math.max(0, netSavings))));

    // Enterprise note
    if (els.enterpriseNote) {
      if (teamSize > 20) {
        els.enterpriseNote.classList.add('visible');
      } else {
        els.enterpriseNote.classList.remove('visible');
      }
    }
  }

  function updateValue(el, value) {
    if (!el) return;
    el.textContent = value;
  }

  function updateBar(el, value, maxValue, label) {
    if (!el) return;
    var pct = maxValue > 0 ? Math.max(5, (value / maxValue) * 100) : 5;
    el.style.width = pct + '%';
    el.textContent = label;
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('team')) els.teamSize.value = params.get('team');
    if (params.has('hours')) els.hours.value = params.get('hours');
    if (params.has('rate')) els.hourlyRate.value = params.get('rate');
    if (params.has('spend')) els.monthlySpend.value = params.get('spend');

    // Update slider displays
    if (els.teamSizeValue) els.teamSizeValue.textContent = els.teamSize.value;
    if (els.hoursValue) els.hoursValue.textContent = parseFloat(els.hours.value).toFixed(1);
  }

  function copyShareableLink() {
    var url = window.location.origin + window.location.pathname +
      '?team=' + els.teamSize.value +
      '&hours=' + els.hours.value +
      '&rate=' + els.hourlyRate.value +
      '&spend=' + els.monthlySpend.value;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        showCopiedMessage();
      });
    } else {
      // Fallback
      var textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopiedMessage();
    }
  }

  function showCopiedMessage() {
    if (els.copiedMsg) {
      els.copiedMsg.classList.add('visible');
      setTimeout(function () {
        els.copiedMsg.classList.remove('visible');
      }, 2000);
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
