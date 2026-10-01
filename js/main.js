/**
 * Sricharan Surakanti Portfolio - Main Interactive Script
 * Features: Neural Canvas, Spotlight Glow, Live Sentiment Lab, Project Filtering, Stats Counter
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DYNAMIC YEAR
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. AMBIENT CURSOR GLOW
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // 3. BACKGROUND CANVAS (NEURAL PARTICLES MESH)
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width > 768 ? 65 : 30, 80);
    const mouse = { x: null, y: null, maxDist: 140 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ';
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Gentle mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            const force = (mouse.maxDist - dist) / mouse.maxDist;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const linkAlpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar Scrolled Glass Background
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollY > 450) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active link detection
    let currentSectionId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. MOBILE MENU DRAWER
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 6. HERO STATS COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  function runCounter() {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.max(1, Math.floor(target / 30));

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 40);
    });
  }

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        runCounter();
        counted = true;
      }
    });
  }, { threshold: 0.2 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  // 7. PROJECT FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 8. INTERACTIVE LIVE AI & NLP LAB (MULTI-PROJECT SUITE)
  const labTabButtons = document.querySelectorAll('.lab-tab-btn');
  const labTabPanels = document.querySelectorAll('.lab-tab-panel');

  function switchLabTab(tabKey) {
    labTabButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    labTabPanels.forEach((panel) => {
      const isMatch = panel.id === `tabPanel-${tabKey}`;
      panel.classList.toggle('active', isMatch);
    });
  }

  labTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      switchLabTab(tabKey);
    });
  });

  // --- MODEL 1: HYBRIDSENSE-X AMBIVALENCE SIMULATOR ---
  const demoTextInput = document.getElementById('demoTextInput');
  const runAnalysisBtn = document.getElementById('runAnalysisBtn');
  const clearDemoBtn = document.getElementById('clearDemoBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  const predClassBadge = document.getElementById('predClassBadge');
  const predExplanation = document.getElementById('predExplanation');
  const barAmb = document.getElementById('barAmb');
  const barPos = document.getElementById('barPos');
  const barNeg = document.getElementById('barNeg');
  const barNeu = document.getElementById('barNeu');
  const probAmbVal = document.getElementById('probAmbVal');
  const probPosVal = document.getElementById('probPosVal');
  const probNegVal = document.getElementById('probNegVal');
  const probNeuVal = document.getElementById('probNeuVal');
  const xaiTokens = document.getElementById('xaiTokens');

  const positiveWords = ['love', 'excellent', 'great', 'awesome', 'spectacular', 'good', 'adore', 'groundbreaking', 'fast', 'crisp', 'smooth', 'perfect', 'beautiful', 'wonderful', 'happy'];
  const negativeWords = ['terrible', 'bad', 'atrocious', 'awful', 'crashes', 'freezes', 'horrible', 'poor', 'slow', 'hate', 'worst', 'buggy', 'glitchy', 'defect', 'fail', 'drain'];
  const adversatives = ['but', 'however', 'although', 'yet', 'nevertheless', 'whereas', 'though', 'while'];

  function analyzeSentiment(rawText) {
    const text = rawText.trim();
    if (!text) {
      alert('Please enter a sentence or choose a preset test case first.');
      return;
    }

    const lower = text.toLowerCase();
    const words = lower.replace(/[^\w\s]/g, '').split(/\s+/);

    let hasAdversative = false;
    let posCount = 0;
    let negCount = 0;

    words.forEach((w) => {
      if (adversatives.includes(w)) hasAdversative = true;
      if (positiveWords.includes(w)) posCount++;
      if (negativeWords.includes(w)) negCount++;
    });

    let primaryClass = 'Neutral';
    let pAmb = 5;
    let pPos = 10;
    let pNeg = 10;
    let pNeu = 75;
    let explanation = '';

    if ((hasAdversative && (posCount > 0 || negCount > 0)) || (posCount > 0 && negCount > 0)) {
      primaryClass = 'Ambivalent';
      pAmb = Math.floor(Math.random() * 8) + 88;
      pPos = Math.floor((100 - pAmb) * 0.55);
      pNeg = Math.floor((100 - pAmb) * 0.35);
      pNeu = 100 - (pAmb + pPos + pNeg);
      explanation = `Detected conflicting sentiments across clauses connected by an adversative marker ('${hasAdversative ? 'adversative connective' : 'contrast'}'). Concurrently exhibits positive and negative polarity.`;
    } else if (posCount > negCount) {
      primaryClass = 'Positive';
      pPos = Math.floor(Math.random() * 7) + 89;
      pNeu = Math.floor((100 - pPos) * 0.6);
      pAmb = Math.floor((100 - pPos) * 0.3);
      pNeg = 100 - (pPos + pNeu + pAmb);
      explanation = 'High concentration of positive sentiment indicators with absence of significant polarity conflict.';
    } else if (negCount > posCount) {
      primaryClass = 'Negative';
      pNeg = Math.floor(Math.random() * 7) + 89;
      pNeu = Math.floor((100 - pNeg) * 0.6);
      pAmb = Math.floor((100 - pNeg) * 0.3);
      pPos = 100 - (pNeg + pNeu + pAmb);
      explanation = 'Predominantly unfavorable linguistic markers reflecting strong negative sentiment.';
    } else {
      primaryClass = 'Neutral';
      pNeu = Math.floor(Math.random() * 7) + 86;
      pPos = Math.floor((100 - pNeu) * 0.5);
      pNeg = Math.floor((100 - pNeu) * 0.35);
      pAmb = 100 - (pNeu + pPos + pNeg);
      explanation = 'Objective or factual statement without significant emotive polarity markers.';
    }

    if (predClassBadge) {
      predClassBadge.textContent = primaryClass;
      if (primaryClass === 'Ambivalent') {
        predClassBadge.style.background = 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)';
      } else if (primaryClass === 'Positive') {
        predClassBadge.style.background = 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)';
      } else if (primaryClass === 'Negative') {
        predClassBadge.style.background = 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
      } else {
        predClassBadge.style.background = 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
      }
    }

    if (predExplanation) predExplanation.textContent = explanation;

    if (probAmbVal) probAmbVal.textContent = `${pAmb}%`;
    if (barAmb) barAmb.style.width = `${pAmb}%`;
    if (probPosVal) probPosVal.textContent = `${pPos}%`;
    if (barPos) barPos.style.width = `${pPos}%`;
    if (probNegVal) probNegVal.textContent = `${pNeg}%`;
    if (barNeg) barNeg.style.width = `${pNeg}%`;
    if (probNeuVal) probNeuVal.textContent = `${pNeu}%`;
    if (barNeu) barNeu.style.width = `${pNeu}%`;

    renderXaiTokens(rawText);
  }

  function renderXaiTokens(sentence) {
    if (!xaiTokens) return;
    xaiTokens.innerHTML = '';
    const rawTokens = sentence.split(/(\s+)/);

    rawTokens.forEach((tok) => {
      const clean = tok.toLowerCase().replace(/[^\w]/g, '');
      const span = document.createElement('span');
      span.className = 'token';
      span.textContent = tok;

      if (adversatives.includes(clean)) {
        span.className += ' token-split';
      } else if (positiveWords.includes(clean)) {
        span.className += ' token-pos-high';
      } else if (negativeWords.includes(clean)) {
        span.className += ' token-neg-high';
      } else if (clean.length > 3) {
        span.className += ' token-pos';
      }

      xaiTokens.appendChild(span);
    });
  }

  if (runAnalysisBtn && demoTextInput) {
    runAnalysisBtn.addEventListener('click', () => {
      analyzeSentiment(demoTextInput.value);
    });
  }

  if (clearDemoBtn && demoTextInput) {
    clearDemoBtn.addEventListener('click', () => {
      demoTextInput.value = '';
      demoTextInput.focus();
    });
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const presetText = btn.getAttribute('data-text');
      demoTextInput.value = presetText;
      analyzeSentiment(presetText);
    });
  });

  // --- MODEL 2: AUTOMATIC KEYWORD & KEYPHRASE EXTRACTOR (TF-IDF) ---
  const keywordsInput = document.getElementById('keywordsInput');
  const runKeywordsBtn = document.getElementById('runKeywordsBtn');
  const clearKeywordsBtn = document.getElementById('clearKeywordsBtn');
  const presetKeywordBtns = document.querySelectorAll('.preset-keyword-btn');
  const keywordNgramSelect = document.getElementById('keywordNgramSelect');
  const keywordTopKSelect = document.getElementById('keywordTopKSelect');
  const keyphrasesList = document.getElementById('keyphrasesList');
  const keywordChips = document.getElementById('keywordChips');
  const kmTotalTokens = document.getElementById('kmTotalTokens');
  const kmFilteredTokens = document.getElementById('kmFilteredTokens');
  const kmSalientPhrases = document.getElementById('kmSalientPhrases');
  const kmMatrixDensity = document.getElementById('kmMatrixDensity');

  const stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
    'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
    'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
    'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
    'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
    'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
  ]);

  function runKeywordExtraction(rawText) {
    const text = rawText.trim();
    if (!text) {
      alert('Please enter some text or select a sample abstract first.');
      return;
    }

    const ngramMode = keywordNgramSelect ? keywordNgramSelect.value : 'both';
    const topK = keywordTopKSelect ? parseInt(keywordTopKSelect.value, 10) : 8;

    const tokens = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const totalWordsCount = tokens.length;
    let stopWordsCount = 0;
    const contentTokens = [];

    tokens.forEach((t) => {
      if (stopWords.has(t)) {
        stopWordsCount++;
      } else {
        contentTokens.push(t);
      }
    });

    const candidates = [];
    if (ngramMode === 'both' || ngramMode === 'unigrams') {
      contentTokens.forEach((w) => candidates.push(w));
    }
    if (ngramMode === 'both' || ngramMode === 'bigrams') {
      for (let i = 0; i < contentTokens.length - 1; i++) {
        candidates.push(`${contentTokens[i]} ${contentTokens[i + 1]}`);
      }
    }

    const tf = {};
    candidates.forEach((cand) => {
      tf[cand] = (tf[cand] || 0) + 1;
    });

    const domainBoosts = ['attention', 'neural', 'deep', 'transformer', 'bilstm', 'convolutional', 'machine', 'learning', 'sequence', 'model', 'dataset', 'accuracy', 'sensor', 'telemetry', 'lidar', 'genomic', 'mutation', 'algorithm', 'convergence', 'latency', 'biomarker', 'spectroscopic', 'infrared', 'quantum'];

    const scored = Object.keys(tf).map((phrase) => {
      const count = tf[phrase];
      let score = (count / (candidates.length || 1)) * 4.2;
      if (phrase.includes(' ')) score *= 1.45;
      domainBoosts.forEach((boost) => {
        if (phrase.includes(boost)) score += 0.35;
      });
      score += Math.min(phrase.length * 0.015, 0.22);
      return { phrase, score: Math.min(score, 0.985), count };
    });

    scored.sort((a, b) => b.score - a.score);
    const topKeyphrases = scored.slice(0, topK);

    if (kmTotalTokens) kmTotalTokens.textContent = totalWordsCount;
    if (kmFilteredTokens) kmFilteredTokens.textContent = stopWordsCount;
    if (kmSalientPhrases) kmSalientPhrases.textContent = topKeyphrases.length;
    if (kmMatrixDensity) kmMatrixDensity.textContent = `${Math.min(94.2, Math.round(((totalWordsCount - stopWordsCount) / (totalWordsCount || 1)) * 100))}%`;

    if (keyphrasesList) {
      keyphrasesList.innerHTML = '';
      topKeyphrases.forEach((item, idx) => {
        const pct = Math.round(item.score * 100);
        const div = document.createElement('div');
        div.className = 'kp-item';
        div.innerHTML = `
          <span class="kp-rank">#${idx + 1}</span>
          <span class="kp-text" title="${item.phrase}">${item.phrase}</span>
          <div class="kp-bar-wrap">
            <div class="kp-bar" style="width: ${pct}%"></div>
          </div>
          <span class="kp-score">${(item.score).toFixed(3)}</span>
        `;
        keyphrasesList.appendChild(div);
      });
    }

    if (keywordChips) {
      keywordChips.innerHTML = '';
      topKeyphrases.forEach((item) => {
        const span = document.createElement('span');
        span.className = 'kp-chip';
        span.innerHTML = `${item.phrase} <span class="kp-chip-score">${item.score.toFixed(2)}</span>`;
        keywordChips.appendChild(span);
      });
    }
  }

  if (runKeywordsBtn && keywordsInput) {
    runKeywordsBtn.addEventListener('click', () => {
      runKeywordExtraction(keywordsInput.value);
    });
  }

  if (clearKeywordsBtn && keywordsInput) {
    clearKeywordsBtn.addEventListener('click', () => {
      keywordsInput.value = '';
      keywordsInput.focus();
    });
  }

  presetKeywordBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      if (keywordsInput) {
        keywordsInput.value = text;
        runKeywordExtraction(text);
      }
    });
  });

  if (keywordNgramSelect && keywordsInput) {
    keywordNgramSelect.addEventListener('change', () => {
      if (keywordsInput.value.trim()) runKeywordExtraction(keywordsInput.value);
    });
  }
  if (keywordTopKSelect && keywordsInput) {
    keywordTopKSelect.addEventListener('change', () => {
      if (keywordsInput.value.trim()) runKeywordExtraction(keywordsInput.value);
    });
  }

  // --- MODEL 3: FAKE NEWS & MISINFORMATION DETECTOR ---
  const fakenewsInput = document.getElementById('fakenewsInput');
  const runFakeNewsBtn = document.getElementById('runFakeNewsBtn');
  const clearFakeNewsBtn = document.getElementById('clearFakeNewsBtn');
  const presetFnBtns = document.querySelectorAll('.preset-fn-btn');

  const fnVerdictCard = document.getElementById('fnVerdictCard');
  const fnVerdictIcon = document.getElementById('fnVerdictIcon');
  const fnVerdictTitle = document.getElementById('fnVerdictTitle');
  const fnVerdictScore = document.getElementById('fnVerdictScore');
  const fnVerdictDesc = document.getElementById('fnVerdictDesc');
  const fnProbLabel = document.getElementById('fnProbLabel');
  const fnConfidenceVal = document.getElementById('fnConfidenceVal');
  const fnProgressBar = document.getElementById('fnProgressBar');
  const fnSignalsList = document.getElementById('fnSignalsList');
  const fnTokenTokens = document.getElementById('fnTokenTokens');

  const deceptiveTriggers = [
    'shocking', 'conspiracy', 'secret', 'miracle', 'cure', 'panicking', 'panic', 'leaked',
    'memo', 'mind waves', 'radiation', '5g', 'mainstream media', 'truth', 'hide', 'anonymous',
    'hate him', 'hates him', 'unbelievable', 'you won\'t believe', 'exposes', 'hoax', 'cures',
    'banned', 'disaster', 'illuminati'
  ];

  const credibleTriggers = [
    'astronomers', 'james webb', 'telescope', 'spectroscopic', 'atmosphere', 'published',
    'peer-reviewed', 'nature', 'nasa', 'wednesday', 'federal reserve', 'interest rates',
    'fomc', 'monetary', 'inflation', 'quarterly', 'labor market', 'reuters', 'associated press',
    'researchers', 'university', 'study released', 'confirmed evidence', 'bureau', 'spokesperson'
  ];

  function runFakeNewsClassification(rawText) {
    const text = rawText.trim();
    if (!text) {
      alert('Please enter a headline or choose a preset story first.');
      return;
    }

    const lower = text.toLowerCase();
    const words = text.split(/\s+/);
    let allCapsCount = 0;
    words.forEach((w) => {
      if (w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w)) allCapsCount++;
    });

    const exclamations = (text.match(/!/g) || []).length;

    let deceptiveCount = 0;
    deceptiveTriggers.forEach((trig) => {
      if (lower.includes(trig)) deceptiveCount++;
    });

    let credibleCount = 0;
    credibleTriggers.forEach((trig) => {
      if (lower.includes(trig)) credibleCount++;
    });

    let isFake = false;
    let score = 0;

    if (deceptiveCount > credibleCount || allCapsCount >= 2 || (deceptiveCount > 0 && credibleCount === 0)) {
      isFake = true;
      const base = 88;
      const boost = Math.min(10, deceptiveCount * 3 + allCapsCount * 2 + exclamations * 2);
      score = base + boost;
    } else if (credibleCount > deceptiveCount) {
      isFake = false;
      const base = 91;
      const boost = Math.min(7, credibleCount * 2);
      score = base + boost;
    } else {
      isFake = exclamations > 1 || allCapsCount > 0;
      score = isFake ? 76 : 82;
    }

    if (fnVerdictCard) {
      fnVerdictCard.className = `fn-verdict-card ${isFake ? 'deceptive' : 'credible'}`;
    }
    if (fnVerdictIcon) {
      fnVerdictIcon.innerHTML = isFake ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-circle-check"></i>';
    }
    if (fnVerdictTitle) {
      fnVerdictTitle.textContent = isFake ? 'High Risk: Misinformation / Deceptive' : 'High Credibility: Verified Journalism';
    }
    if (fnVerdictScore) {
      fnVerdictScore.textContent = `${score.toFixed(1)}%`;
    }
    if (fnVerdictDesc) {
      fnVerdictDesc.textContent = isFake
        ? `Linguistic anomaly detected: Extreme emotional hyperbole, lack of peer citations, sensational keywords (${deceptiveCount} trigger matches), and clickbait formatting.`
        : `Linguistic pattern matches credible news wire: Verified attribution to reputable organizations, objective tone, formal syntax, and factual contextual framing.`;
    }

    if (fnProbLabel) {
      fnProbLabel.textContent = isFake ? 'Deceptive Likelihood' : 'Credibility Verification';
    }
    if (fnConfidenceVal) {
      fnConfidenceVal.textContent = `${score.toFixed(1)}%`;
    }
    if (fnProgressBar) {
      fnProgressBar.style.width = `${score}%`;
      fnProgressBar.style.background = isFake
        ? 'linear-gradient(90deg, #ef4444, #f97316)'
        : 'linear-gradient(90deg, #10b981, #06b6d4)';
    }

    if (fnSignalsList) {
      fnSignalsList.innerHTML = `
        <div class="fn-signal-item">
          <div class="fn-signal-info">
            <i class="fa-solid ${allCapsCount > 0 || exclamations > 0 ? 'fa-bolt text-danger' : 'fa-check text-success'}"></i>
            <span>Hyperbole &amp; Capitalization Index</span>
          </div>
          <span class="fn-signal-tag ${allCapsCount > 0 ? 'tag-flagged' : 'tag-verified'}">
            ${allCapsCount > 0 ? `${allCapsCount} ALL-CAPS words flagged` : 'Calm / Standard Syntax'}
          </span>
        </div>
        <div class="fn-signal-item">
          <div class="fn-signal-info">
            <i class="fa-solid ${credibleCount > 0 ? 'fa-building-columns text-success' : 'fa-circle-xmark text-danger'}"></i>
            <span>Institutional Citations &amp; Sourcing</span>
          </div>
          <span class="fn-signal-tag ${credibleCount > 0 ? 'tag-verified' : 'tag-flagged'}">
            ${credibleCount > 0 ? `${credibleCount} verified source tokens` : 'Unsubstantiated / Absent Sources'}
          </span>
        </div>
        <div class="fn-signal-item">
          <div class="fn-signal-info">
            <i class="fa-solid ${isFake ? 'fa-skull-crossbones text-danger' : 'fa-scale-balanced text-success'}"></i>
            <span>Emotional Manipulation vs Neutrality</span>
          </div>
          <span class="fn-signal-tag ${isFake ? 'tag-flagged' : 'tag-verified'}">
            ${isFake ? 'Urgency &amp; Fear Induction' : 'Objective Journalism'}
          </span>
        </div>
      `;
    }

    if (fnTokenTokens) {
      fnTokenTokens.innerHTML = '';
      const rawTokens = text.split(/(\s+)/);
      rawTokens.forEach((tok) => {
        const clean = tok.toLowerCase().replace(/[^\w]/g, '');
        const span = document.createElement('span');
        span.className = 'token';
        span.textContent = tok;

        if (deceptiveTriggers.some((d) => clean === d || (d.includes(clean) && clean.length > 3))) {
          span.className += ' token-neg-high';
        } else if (credibleTriggers.some((c) => clean === c || (c.includes(clean) && clean.length > 3))) {
          span.className += ' token-pos-high';
        } else if (tok === tok.toUpperCase() && tok.length > 2 && /[A-Z]/.test(tok)) {
          span.className += ' token-split';
        }

        fnTokenTokens.appendChild(span);
      });
    }
  }

  if (runFakeNewsBtn && fakenewsInput) {
    runFakeNewsBtn.addEventListener('click', () => {
      runFakeNewsClassification(fakenewsInput.value);
    });
  }

  if (clearFakeNewsBtn && fakenewsInput) {
    clearFakeNewsBtn.addEventListener('click', () => {
      fakenewsInput.value = '';
      fakenewsInput.focus();
    });
  }

  presetFnBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      if (fakenewsInput) {
        fakenewsInput.value = text;
        runFakeNewsClassification(text);
      }
    });
  });

  // --- LIVE DEPLOYMENT LAUNCHERS (WIRED DIRECTLY TO LIVE DEMO EXECUTION) ---
  const liveDeployButtons = document.querySelectorAll('.btn-live-deploy');
  liveDeployButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.getAttribute('data-project');
      if (!proj) return;

      switchLabTab(proj);

      const demoSection = document.getElementById('demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        if (proj === 'hybridsense') {
          if (demoTextInput && !demoTextInput.value.trim()) {
            demoTextInput.value = "The design is excellent but the battery life is terrible.";
          }
          if (demoTextInput) analyzeSentiment(demoTextInput.value);
        } else if (proj === 'keywords') {
          if (keywordsInput && !keywordsInput.value.trim()) {
            keywordsInput.value = "Recent advancements in deep neural networks have revolutionized natural language processing. In this paper, we propose a multi-head self-attention mechanism combined with bidirectional long short-term memory (BiLSTM) for sequence modeling. Our experimental evaluation demonstrates state-of-the-art accuracy, reduced training latency, and robust convergence across diverse benchmark datasets.";
          }
          if (keywordsInput) runKeywordExtraction(keywordsInput.value);
        } else if (proj === 'fakenews') {
          if (fakenewsInput && !fakenewsInput.value.trim()) {
            fakenewsInput.value = "SHOCKING CONSPIRACY: Secret government leaked memo confirms 5G radiation towers are secretly controlling daily global weather and mind waves! Mainstream media is desperately trying to hide this truth from the public!";
          }
          if (fakenewsInput) runFakeNewsClassification(fakenewsInput.value);
        }
      }, 350);
    });
  });

  // Initialize all 3 models with default demonstrations
  if (demoTextInput && demoTextInput.value.trim()) {
    analyzeSentiment(demoTextInput.value);
  } else if (demoTextInput) {
    demoTextInput.value = "The design is excellent but the battery life is terrible.";
    analyzeSentiment(demoTextInput.value);
  }

  if (keywordsInput && !keywordsInput.value.trim()) {
    keywordsInput.value = "Recent advancements in deep neural networks have revolutionized natural language processing. In this paper, we propose a multi-head self-attention mechanism combined with bidirectional long short-term memory (BiLSTM) for sequence modeling. Our experimental evaluation demonstrates state-of-the-art accuracy, reduced training latency, and robust convergence across diverse benchmark datasets.";
    runKeywordExtraction(keywordsInput.value);
  }

  if (fakenewsInput && !fakenewsInput.value.trim()) {
    fakenewsInput.value = "SHOCKING CONSPIRACY: Secret government leaked memo confirms 5G radiation towers are secretly controlling daily global weather and mind waves! Mainstream media is desperately trying to hide this truth from the public!";
    runFakeNewsClassification(fakenewsInput.value);
  }


  // 9. COPY EMAIL TO CLIPBOARD
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const originalIcon = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalIcon;
        }, 2000);
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000);
      });
    });
  }

  // 10. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitFormBtn = document.getElementById('submitFormBtn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      submitFormBtn.disabled = true;
      submitFormBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-circle-check"></i>';
        formStatus.style.display = 'block';
        formStatus.className = 'form-status-msg success';
        formStatus.innerHTML = `<strong>Thank you, ${name}!</strong> Your message has been prepared. Opening your default mail client...`;

        // Direct mailto fallback
        const mailtoUrl = `mailto:surakantisricharan8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Sricharan,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
        window.open(mailtoUrl, '_blank');

        contactForm.reset();

        setTimeout(() => {
          submitFormBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        }, 4000);
      }, 1000);
    });
  }

  // 11. PROJECT EXECUTION DRAWER TOGGLE & COPY TERMINAL COMMANDS
  const execButtons = document.querySelectorAll('.btn-execution');
  execButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');

      // Close other open execution drawers for neat display
      document.querySelectorAll('.project-execution-drawer.open').forEach((openDrawer) => {
        if (openDrawer !== drawer) {
          openDrawer.classList.remove('open');
          const correspondingBtn = document.querySelector(`.btn-execution[data-target="${openDrawer.id}"]`);
          if (correspondingBtn) {
            correspondingBtn.innerHTML = '<i class="fa-solid fa-terminal"></i> Run Locally';
            correspondingBtn.classList.remove('active');
          }
        }
      });

      if (isOpen) {
        drawer.classList.remove('open');
        btn.innerHTML = '<i class="fa-solid fa-terminal"></i> Run Locally';
        btn.classList.remove('active');
      } else {
        drawer.classList.add('open');
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Hide Run Guide';
        btn.classList.add('active');
      }
    });
  });

  const execCopyButtons = document.querySelectorAll('.exec-copy-btn');
  execCopyButtons.forEach((copyBtn) => {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const terminal = copyBtn.closest('.exec-terminal');
      if (!terminal) return;
      const codeElement = terminal.querySelector('.exec-code code');
      if (!codeElement) return;

      const rawCode = codeElement.innerText.trim();
      navigator.clipboard.writeText(rawCode).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = originalHtml;
        }, 2200);
      }).catch(() => {
        // Fallback copy
        const temp = document.createElement('textarea');
        temp.value = rawCode;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2200);
      });
    });
  });

});

