/* ==========================================================================
   TREND (ترند) — INTERACTIVE JAVASCRIPT ENGINE
   Controls: Rising Bubbles Engine, Fizz & Coldness Customizer Lab, 
   Flavor Detail Glass Modal, Navigation & Store Locator.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
   * 1. RISING AMBIENT BUBBLES ENGINE (HERO BACKGROUND)
   * Single purposeful animation: slow, delicate carbonation bubbles behind hero.
   * ------------------------------------------------------------------------ */
  function initHeroBubblesEngine() {
    const container = document.getElementById('bubblesContainer');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width = canvas.width = container.offsetWidth || window.innerWidth;
    let height = canvas.height = container.offsetHeight || window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = container.offsetWidth || window.innerWidth;
      height = canvas.height = container.offsetHeight || window.innerHeight;
    });

    // Particle class for fizz bubbles
    class Bubble {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.radius = Math.random() * 3 + 1.5;
        this.speed = Math.random() * 0.8 + 0.3; // Gentle slow rise
        this.opacity = Math.random() * 0.4 + 0.15;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.4;

        if (this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(38, 224, 194, ${this.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    const bubbleCount = 45;
    const bubbles = Array.from({ length: bubbleCount }, () => new Bubble());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      bubbles.forEach(b => {
        b.update();
        b.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ------------------------------------------------------------------------
   * 2. FLAVOR DETAIL GLASS MODAL DATA & CONTROLLER
   * ------------------------------------------------------------------------ */
  const flavorData = {
    'citrus-orange': {
      title: 'برتقال فوار — Citrus Orange Fizz',
      badge: 'الأكثر مبيعاً',
      color: '#FF6B35',
      glowClass: 'glow-citrus-orange',
      calories: '0 سعرة',
      cating: '-4°C',
      vitaminC: '160mg (200% Daily Value)',
      desc: 'مزيج فريد من خلاصة البرتقال الصيفي الطبيعي وحمض اليوسفي مع فقاعات ثاني أكسيد الكربون الحادة. يُقدم في درجة برودة -4° مئوية ليضمن لك قمة الانتعاش مع كل رشفة.',
      ingredients: 'ماء فوار مُفلتر بلورياً، عصير برتقال طبيعي مركز (0% سكر مضاف)، حمض الليمونيك، خلاصات يوسفي طبيعية، فيتامين C.'
    },
    'mint-lime': {
      title: 'ليمون نعناع مُثلّج — Frosted Mint Lime',
      badge: 'الانتعاش الأقصى',
      color: '#26E0C2',
      glowClass: 'glow-mint-lime',
      calories: '0 سعرة',
      cating: '-5°C',
      vitaminC: '140mg (175% Daily Value)',
      desc: 'عصير الليمون الأخضر الصافي مع خلاصة أوراق النعناع الجبلي البارد المستخلص بالضغط البارد. يمنحك شعوراً كالجليد يطفئ العطش فجأة.',
      ingredients: 'ماء فوار، عصير ليمون أخضر صلب، مستخلص نعناع بلوري طبيعي، ستيفيا طبيعية، أحماض الفواكه.'
    },
    'turquoise-berry': {
      title: 'توت مائي فيروزي — Turquoise Berry Fizz',
      badge: 'إصدار خاص',
      color: '#00C2A8',
      glowClass: 'glow-turquoise-berry',
      calories: '5 سعرات',
      cating: '-4°C',
      vitaminC: '110mg (137% Daily Value)',
      desc: 'نكهة التوت البري الأزرق والمائي الممزوج بلمسة حمضية ناعمة ولون الفيروز الجليدي المستوحى من هوية ترند البصرية.',
      ingredients: 'ماء فوار بلوري، خلاصة التوت البري الأزرق، مستخلص توت العليق، مضادات أكسدة طبيعية، حمض الستريك.'
    },
    'ruby-citrus': {
      title: 'رمان حمضي — Ruby Citrus Pomegranate',
      badge: 'طعم غني',
      color: '#FF5252',
      glowClass: 'glow-ruby-citrus',
      calories: '0 سعرة',
      cating: '-3.5°C',
      vitaminC: '150mg (187% Daily Value)',
      desc: 'عصير الرمان الياقوتي المفعم بالحيوية والممزوج بقطرات الجريب فروت الوردي للحصول على توازن مذهل بين الحلاوة الطبيعية والحدة الحمضية.',
      ingredients: 'ماء فوار، عصير رمان طبيعي مركز، عصير جريب فروت وردي، خلاصة قشور الحمضيات، فيتامين C.'
    }
  };

  const modalBackdrop = document.getElementById('flavorModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalGlow = document.getElementById('modalGlow');

  function openFlavorModal(flavorKey) {
    const data = flavorData[flavorKey];
    if (!data) return;

    if (modalGlow) {
      modalGlow.style.background = data.color;
    }

    modalContent.innerHTML = `
      <div class="modal-header-flex">
        <div class="modal-can-icon">
          <svg viewBox="0 0 100 160" style="width:100%; height:100%;">
            <rect x="20" y="20" width="60" height="120" rx="10" fill="${data.color}" />
            <ellipse cx="50" cy="20" rx="30" ry="5" fill="#607D75" />
            <circle cx="50" cy="80" r="18" fill="rgba(255,255,255,0.2)" stroke="#FFF" stroke-width="1.5"/>
            <text x="50" y="85" font-family="Cairo" font-weight="800" font-size="10" fill="#FFF" text-anchor="middle">ترند</text>
          </svg>
        </div>
        <div>
          <span class="modal-subtitle">${data.badge}</span>
          <h2 class="modal-title">${data.title}</h2>
        </div>
      </div>

      <div class="modal-nutrition-grid">
        <div class="nutri-item">
          <span>السعرات الحرارية</span>
          <strong>${data.calories}</strong>
        </div>
        <div class="nutri-item">
          <span>حرارة التقديم</span>
          <strong>${data.cating}</strong>
        </div>
        <div class="nutri-item">
          <span>فيتامين C</span>
          <strong>${data.vitaminC}</strong>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: var(--text-primary); margin-bottom: 0.5rem; font-weight:700;">الوصف التجريبي:</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem;">${data.desc}</p>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="color: var(--text-primary); margin-bottom: 0.5rem; font-weight:700;">المكونات الطبيعية:</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem;">${data.ingredients}</p>
      </div>

      <div style="display:flex; gap:1rem;">
        <button class="btn btn-citrus btn-block" onclick="alert('تمت إضافة خيار ${data.title} إلى السلة التجريبية!')">اطلب العلبة المُثلّجة الان</button>
      </div>
    `;

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const flavorKey = e.currentTarget.getAttribute('data-modal-flavor');
      openFlavorModal(flavorKey);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) closeModal();
  });

  /* ------------------------------------------------------------------------
   * 3. FIZZ & TEMPERATURE CUSTOMIZER LAB CONTROLLER
   * ------------------------------------------------------------------------ */
  const tempSlider = document.getElementById('tempSlider');
  const tempValueDisplay = document.getElementById('tempValue');
  const fizzSlider = document.getElementById('fizzSlider');
  const fizzValueDisplay = document.getElementById('fizzValue');
  const flavorChips = document.querySelectorAll('.flavor-chip');
  const labSummaryText = document.getElementById('labSummaryText');
  const dynamicCanGlow = document.getElementById('dynamicCanGlow');
  const dropsContainer = document.getElementById('dropsContainer');
  const labCanTitle = document.getElementById('labCanTitle');
  const labGradStop1 = document.getElementById('labGradStop1');
  const labStrokeStop1 = document.getElementById('labStrokeStop1');
  const saveMixBtn = document.getElementById('saveMixBtn');

  let currentFlavorColor = '#FF6B35';
  let currentFlavorName = 'برتقال حمضي';

  // Update Condensation Water Droplets based on temperature slider
  function updateDroplets(tempVal) {
    if (!dropsContainer) return;
    dropsContainer.innerHTML = '';

    // colder = more droplets
    const count = Math.round(Math.abs(tempVal - 5) * 2.5);
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'drop';
      const size = Math.random() * 6 + 4;
      drop.style.width = `${size}px`;
      drop.style.height = `${size * 1.2}px`;
      drop.style.top = `${Math.random() * 85 + 5}%`;
      drop.style.left = `${Math.random() * 80 + 10}%`;
      drop.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
      dropsContainer.appendChild(drop);
    }
  }

  // Canvas Bubbles inside the Lab Preview Can
  const labCanvas = document.getElementById('canBubblesCanvas');
  let labCtx = labCanvas ? labCanvas.getContext('2d') : null;
  let labBubbles = [];

  function initLabCanvas() {
    if (!labCanvas || !labCtx) return;
    labCanvas.width = 220;
    labCanvas.height = 340;

    class LabBubble {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * 120 + 50;
        this.y = 280;
        this.radius = Math.random() * 2.5 + 1;
        this.speed = Math.random() * 1.5 + 0.8;
        this.opacity = Math.random() * 0.6 + 0.2;
      }
      update(speedMultiplier) {
        this.y -= this.speed * speedMultiplier;
        if (this.y < 60) this.reset();
      }
      draw() {
        labCtx.beginPath();
        labCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        labCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        labCtx.fill();
      }
    }

    labBubbles = Array.from({ length: 30 }, () => new LabBubble());

    function renderLabBubbles() {
      labCtx.clearRect(0, 0, labCanvas.width, labCanvas.height);
      const fizzVal = fizzSlider ? parseInt(fizzSlider.value) : 3;
      const speedMult = fizzVal * 0.5;

      labBubbles.forEach(b => {
        b.update(speedMult);
        b.draw();
      });
      requestAnimationFrame(renderLabBubbles);
    }

    renderLabBubbles();
  }

  function updateLabUI() {
    const tempVal = tempSlider ? parseInt(tempSlider.value) : -4;
    const fizzVal = fizzSlider ? parseInt(fizzSlider.value) : 4;

    // Temp Text
    if (tempValueDisplay) {
      let iceStatus = tempVal < -4 ? '(ثلج بلوري مكثف)' : (tempVal <= 0 ? '(مُثلّجة هادئة)' : '(باردة)');
      tempValueDisplay.textContent = `${tempVal}°C ${iceStatus}`;
    }

    // Fizz Text
    const fizzLabels = ['خفيفة جداً', 'متوازنة', 'فوارة بوضوح', 'فوارة بكثافة (High Fizz)', 'انفجار فقاعات أقصى'];
    if (fizzValueDisplay) {
      fizzValueDisplay.textContent = fizzLabels[fizzVal - 1] || 'فوارة';
    }

    // Dynamic Glow & SVG color update
    if (dynamicCanGlow) dynamicCanGlow.style.background = currentFlavorColor;
    if (labGradStop1) labGradStop1.setAttribute('stop-color', currentFlavorColor);
    if (labStrokeStop1) labStrokeStop1.setAttribute('stop-color', currentFlavorColor);

    // Droplets
    updateDroplets(tempVal);

    // Summary Text
    if (labSummaryText) {
      labSummaryText.textContent = `مشروب ${currentFlavorName} بنسبة تكثيف برودة عند ${tempVal}° مئوية ومستوى فقاعات (${fizzLabels[fizzVal - 1]}).`;
    }
  }

  if (tempSlider) tempSlider.addEventListener('input', updateLabUI);
  if (fizzSlider) fizzSlider.addEventListener('input', updateLabUI);

  flavorChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      flavorChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFlavorColor = chip.getAttribute('data-chip-color');
      currentFlavorName = chip.getAttribute('data-chip-name');
      updateLabUI();
    });
  });

  if (saveMixBtn) {
    saveMixBtn.addEventListener('click', () => {
      alert(`تم حفظ خلطة الانتعاش الخاصة بك (${currentFlavorName}) بنجاح! يمكن طلبها من منافذ البيع.`);
    });
  }

  /* ------------------------------------------------------------------------
   * 4. STORE LOCATOR SEARCH FILTER & MOBILE NAV TOGGLE
   * ------------------------------------------------------------------------ */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
    });

    // Close menu when clicking a link inside mobile drawer
    mainNav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-open');
      });
    });
  }

  const locatorInput = document.getElementById('locatorInput');
  const locatorResults = document.getElementById('locatorResults');

  if (locatorInput && locatorResults) {
    locatorInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const chips = locatorResults.querySelectorAll('.store-chip');

      chips.forEach(chip => {
        if (!query || chip.textContent.toLowerCase().includes(query)) {
          chip.style.display = 'inline-block';
        } else {
          chip.style.display = 'none';
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 5. STANDALONE NEWS PAGE INTERACTIVE ENGINE
   * ------------------------------------------------------------------------ */
  const newsCatChips = document.querySelectorAll('.news-cat-chip');
  const newsGrid = document.getElementById('newsGrid');
  const newsSearchInput = document.getElementById('newsSearchInput');
  const newsArticleModal = document.getElementById('newsArticleModal');
  const newsModalContent = document.getElementById('newsModalContent');
  const newsModalCloseBtn = document.getElementById('newsModalCloseBtn');

  const newsArticlesData = {
    '1': {
      title: 'علب ألومنيوم مُثلّجة 100% قابلة لإعادة التدوير للأبد دون فقدان البرودة',
      category: 'الاستدامة والبيئة',
      date: '2 سبتمبر 2026',
      content: `تعلن ترند عن تحولها الكامل إلى استخدام العلب الألومنيوم فائقة النقاء، والتي تم تطويرها بطبقة عزل زجاجية معتمة تمنع تفاعل أشعة الشمس مع المشروبات الغازية.<br><br>تتيح هذه التقنية الاحتفاظ بالبرودة في درجة -4° مئوية لفترات أطول بنسبة 40%، مع إمكانية إعادة تدوير العلبة بالكامل للأبد بدون أي فقدان في الجودة، مما يسهم في خفض الانبعاثات الكربونية بنسبة 75%.`
    },
    '2': {
      title: 'تقنية التبريد السريع: كيف تحافظ ترند على قوة الفقاعات عند -4 درجات؟',
      category: 'ابتكار التبريد',
      date: '25 أغسطس 2026',
      content: `تعتمد صودا ترند على تقنية تبريد النكهات تحت ضغط هيدروستاتيكي متوازن يمنع تطاير الفقاعات الغازية قبل فتح العلبة.<br><br>عند درجات الحرارة المنخفضة جداً (-4° مئوية)، يزداد ذوبان ثاني أكسيد الكربون في العصير الحمضي الطبيعي، مما يعطي إحساساً بالنقر اللطيف الحاد على اللسان لحظة التذوق.`
    },
    '3': {
      title: 'إطلاق نكهة التوت المائي الفيروزي في جميع منافذ البيع',
      category: 'إصدار جديد',
      date: '18 أغسطس 2026',
      content: `أعلنت علامة ترند عن توفر نكهة 'التوت المائي الفيروزي' ذات اللون الأزرق الجليدي المستوحى من هوية العلامة الزجاجية.<br><br>تعتمد النكهة على خلاصات التوت البري النادرة والماء الصافي المفلتر بلورياً مع نسبة حموضة خفيفة تمنح طعماً ينعش الحواس.`
    },
    '4': {
      title: 'منصة ترند في مدينة إب: تجربة الانتعاش الزجاجي بين طبيعة إب الخضراء',
      category: 'فعاليات صيفية',
      date: '10 أغسطس 2026',
      content: `افتتحت ترند مكعباتها الزجاجية المبردة في مدينة إب (شارع العدين والمعاين) لتزويد الأهالي والزوار بالمشروبات الغازية المبردة فوراً بين الطبيعة الخضراء.<br><br>تتضمن الفعالية مسابقات تفاعلية لتخصيص نسبة البرودة والفقاعات وتوزيع هدايا تذكارية زجاجية.`
    },
    '5': {
      title: 'شراكة مع مزارع الحمضيات العضوية في وديان إب لدعم زراعة الليمون الأخضر',
      category: 'الاستدامة والبيئة',
      date: '1 أغسطس 2026',
      content: `وقعت ترند اتفاقية توريد استراتيجية مع مزارع حمضيات محليّة في وديان إب الخضراء تعتمد الزراعة العضوية دون أي مبيدات كيميائية.<br><br>تضمن هذه الشراكة الحصول على أفضل ثمار الليمون والبرتقال الطازجة، وتوجيه العصير المباشر لخطوط التعبئة خلال أقل من 12 ساعة من القطف.`
    }
  };

  if (newsCatChips.length > 0 && newsGrid) {
    newsCatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        newsCatChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const cat = chip.getAttribute('data-cat');
        const cards = newsGrid.querySelectorAll('.news-card-wrapper');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-cat');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  if (newsSearchInput && newsGrid) {
    newsSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = newsGrid.querySelectorAll('.news-card-wrapper');

      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Open Full News Modal
  document.querySelectorAll('.read-full-news-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const newsId = e.currentTarget.getAttribute('data-news-id');
      const article = newsArticlesData[newsId];
      if (!article || !newsArticleModal || !newsModalContent) return;

      newsModalContent.innerHTML = `
        <span style="color: var(--accent-fizz); font-weight:700; font-size:0.85rem;">${article.category} • ${article.date}</span>
        <h2 style="font-size: 1.8rem; font-weight:800; margin: 0.6rem 0 1.2rem 0; line-height: 1.3;">${article.title}</h2>
        <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--radius-md); color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 1.8rem;">
          ${article.content}
        </div>
        <button class="btn btn-citrus btn-block" onclick="document.getElementById('newsArticleModal').classList.remove('active')">إغلاق المقال</button>
      `;

      newsArticleModal.classList.add('active');
      newsArticleModal.setAttribute('aria-hidden', 'false');
    });
  });

  if (newsModalCloseBtn && newsArticleModal) {
    newsModalCloseBtn.addEventListener('click', () => {
      newsArticleModal.classList.remove('active');
      newsArticleModal.setAttribute('aria-hidden', 'true');
    });
  }

  /* ------------------------------------------------------------------------
   * 5. INITIALIZATION
   * ------------------------------------------------------------------------ */
  initHeroBubblesEngine();
  initLabCanvas();
  updateLabUI();
});
